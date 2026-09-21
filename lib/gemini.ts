import { GoogleGenAI } from "@google/genai";

/**
 * Collect all available Gemini API keys from environment variables.
 * Supports:
 * - GEMINI_API_KEY
 * - GEMINI_API_KEY_2, GEMINI_API_KEY_3, etc.
 * - Comma or semicolon-separated keys in GEMINI_API_KEY
 */
export function getGeminiApiKeys(): string[] {
  const keys: string[] = [];

  // Check GEMINI_API_KEY
  const primary = process.env.GEMINI_API_KEY;
  if (primary) {
    const parts = primary.split(/[,;]/).map((k) => k.trim()).filter(Boolean);
    keys.push(...parts);
  }

  // Check additional indexed keys: GEMINI_API_KEY_2, GEMINI_API_KEY_3, etc.
  for (let i = 2; i <= 10; i++) {
    const nextKey = process.env[`GEMINI_API_KEY_${i}`];
    if (nextKey && nextKey.trim()) {
      keys.push(nextKey.trim());
    }
  }

  // Remove any duplicates while preserving order
  return Array.from(new Set(keys));
}

export interface GenerateGeminiOptions {
  model?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contents: any;
  maxKeyRotations?: number;
}

/**
 * Check whether an error is caused by rate limiting, quota exhaustion, or transient server issue
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isQuotaOrTransientError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  const status = err.status || err.statusCode || (err.response && err.response.status);

  return (
    status === 429 ||
    status === 503 ||
    status === 500 ||
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("resource_exhausted") ||
    msg.includes("rate limit") ||
    msg.includes("too many requests") ||
    msg.includes("overloaded") ||
    msg.includes("temporarily unavailable")
  );
}

/**
 * Generate content using Gemini with automatic API key rotation and exponential backoff retry.
 */
export async function generateGeminiContentWithRetry(options: GenerateGeminiOptions): Promise<{
  text: string;
  usedKeyIndex: number;
}> {
  const keys = getGeminiApiKeys();

  if (keys.length === 0) {
    throw new Error(
      "GEMINI_API_KEY is missing from environment. Live AI responses require a valid Gemini API key."
    );
  }

  const baseModel = options.model || process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const fallbackModels = [baseModel, "gemini-2.5-flash", "gemini-1.5-flash"];
  // Deduplicate models
  const modelsToTry = Array.from(new Set(fallbackModels));

  let lastError: Error | null = null;
  const maxCycles = 2; // Cycle through all keys up to 2 times with backoff

  for (let cycle = 0; cycle < maxCycles; cycle++) {
    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
      const apiKey = keys[keyIdx];

      for (const model of modelsToTry) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model,
            contents: options.contents,
          });

          const text = response.text || "";
          if (text) {
            return { text, usedKeyIndex: keyIdx };
          }
        } catch (err: unknown) {
          const errorObj = err instanceof Error ? err : new Error(String(err));
          lastError = errorObj;

          console.warn(
            `[Gemini Rotation] Key #${keyIdx + 1} with model "${model}" failed: ${errorObj.message}`
          );

          // If quota / rate-limited, immediately break to try the next key
          if (isQuotaOrTransientError(errorObj)) {
            break; // Try next API key
          }

          // If model not found or invalid argument, try next fallback model
          continue;
        }
      }
    }

    // If all keys failed in this cycle and we have another cycle left, wait with backoff
    if (cycle < maxCycles - 1) {
      const backoffMs = 1200 * (cycle + 1);
      console.warn(
        `[Gemini Rotation] All ${keys.length} API keys hit rate limits or errors. Retrying in ${backoffMs}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
    }
  }

  throw (
    lastError ||
    new Error(
      `All Gemini API keys (${keys.length} configured) exceeded quota or failed after retries.`
    )
  );
}
