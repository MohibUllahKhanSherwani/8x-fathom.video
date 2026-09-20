"use client";

import React, { useState } from "react";
import { CheckSquare, Square, Sparkles, Plus, Trash2, Clock } from "lucide-react";
import { ActionItem } from "@/lib/seed-meetings";

interface ActionItemsViewProps {
  actionItems: ActionItem[];
  onToggleDone: (id: string) => void;
  onAddManualItem: (text: string, assignee: string) => void;
  onSeek: (ms: number) => void;
  highlights?: Array<{ id: string; start_ms: number; end_ms?: number; note?: string }>;
  onDeleteHighlight?: (id: string) => void;
}

export function ActionItemsView({
  actionItems,
  onToggleDone,
  onAddManualItem,
  onSeek,
  highlights = [],
  onDeleteHighlight,
}: ActionItemsViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState("");
  const [newAssignee, setNewAssignee] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddManualItem(newText.trim(), newAssignee.trim() || "Unassigned");
    setNewText("");
    setNewAssignee("");
    setShowAddForm(false);
  };

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="space-y-6 select-none">
      {/* Action Items Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-bold text-[#9a9ba1] tracking-wider uppercase">
            Action Items ({actionItems.length})
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 text-[11px] text-[#00b2ea] hover:text-[#00c5ff] font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Add Manual Item Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreate}
            className="mb-4 p-3 bg-[#1e2024] border border-[#2f3238] rounded-xl space-y-2 text-xs"
          >
            <input
              type="text"
              placeholder="Action item description..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full p-2 bg-[#161719] border border-[#2f3238] rounded-lg text-white placeholder-[#9a9ba1] outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Assignee (e.g. Carlos)..."
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className="flex-1 p-2 bg-[#161719] border border-[#2f3238] rounded-lg text-white placeholder-[#9a9ba1] outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#00b2ea] text-black font-semibold rounded-lg hover:bg-[#00c5ff] transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Action Items List */}
        {actionItems.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#161719] border border-[#26282d] text-center">
            <p className="text-xs text-[#9a9ba1] italic">
              None detected. Add manually on transcript tab
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-start gap-3 p-3 rounded-xl bg-[#161719] hover:bg-[#1e2024] border border-[#26282d] hover:border-[#32353c] transition-all text-xs"
              >
                {/* Checkbox */}
                <button
                  onClick={() => onToggleDone(item.id)}
                  className="mt-0.5 text-[#9a9ba1] hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-[#3dbb6b]" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>

                {/* Text and Meta */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`leading-relaxed mb-1.5 ${
                      item.done
                        ? "line-through text-[#9a9ba1]"
                        : "text-white font-medium"
                    }`}
                  >
                    {item.text}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    {/* Assignee Chip */}
                    {item.assignee && (
                      <span className="px-2 py-0.5 rounded-full bg-[#1e2024] text-[#d1d5db] border border-[#2f3238]">
                        {item.assignee}
                      </span>
                    )}

                    {/* Timestamp Chip */}
                    {item.start_ms !== undefined && (
                      <button
                        onClick={() => onSeek(item.start_ms)}
                        className="flex items-center gap-1 text-[#00b2ea] hover:underline font-mono cursor-pointer"
                      >
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(item.start_ms)}</span>
                      </button>
                    )}

                    {/* AI sparkle badge */}
                    {item.source === "ai" && (
                      <span className="flex items-center gap-0.5 text-[#a855f7]" title="AI Generated">
                        <Sparkles className="w-3 h-3 fill-[#a855f7]/30" />
                        <span>AI</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Highlights Section */}
      {highlights.length > 0 && (
        <div className="pt-4 border-t border-[#26282d]">
          <h3 className="text-[11px] font-bold text-[#e8b923] tracking-wider uppercase mb-3 flex items-center gap-1.5">
            <span>Highlights ({highlights.length})</span>
          </h3>

          <div className="space-y-2">
            {highlights.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#242116] border border-[#e8b923]/30 text-xs"
              >
                <button
                  onClick={() => onSeek(h.start_ms)}
                  className="flex items-center gap-2 text-white hover:text-[#e8b923] transition-colors cursor-pointer"
                >
                  <span className="font-mono text-[10px] text-[#e8b923] bg-[#e8b923]/20 px-1.5 py-0.5 rounded">
                    {formatTime(h.start_ms)}
                  </span>
                  <span>{h.note || "Meeting highlight"}</span>
                </button>

                {onDeleteHighlight && (
                  <button
                    onClick={() => onDeleteHighlight(h.id)}
                    className="text-[#9a9ba1] hover:text-[#ff4d4f] transition-colors p-1"
                    title="Delete highlight"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
