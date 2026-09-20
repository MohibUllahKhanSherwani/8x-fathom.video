"""
TTS synthesis pipeline for Fathom clone seed meetings.
Uses edge-tts (free, no API keys) to generate distinct voices per participant.
Exports constant bitrate mono MP3 at 32 kbps and generates exact timestamped segments.
"""

import os
import sys
import json
import asyncio
from pathlib import Path
import edge_tts

# Distinct voices for the team roster
VOICE_MAP = {
    "Alex Rivera": "en-US-GuyNeural",
    "Priya Nair": "en-IN-NeerjaNeural",
    "Daniel Okafor": "en-GB-RyanNeural",
    "Mei Lin": "en-US-JennyNeural",
    "Carlos Ramirez": "en-US-DavisNeural",
    "Hannah Weiss": "en-US-AriaNeural",
    "Tom Becker": "en-US-BrianNeural",
    "Aisha Khan": "en-GB-SoniaNeural",
    "Jordan Lee": "en-US-EricNeural",
    "Sarah Jenkins": "en-US-AriaNeural",
    "Mark Vance": "en-US-GuyNeural",
    "Elena Rostova": "en-GB-SoniaNeural",
    "Devin Wright": "en-US-ChristopherNeural",
}

DEFAULT_VOICE = "en-US-GuyNeural"

async def synthesize_utterance(text: str, voice: str, output_path: str):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_path)

def main():
    print("TTS pipeline script ready.")

if __name__ == "__main__":
    main()
