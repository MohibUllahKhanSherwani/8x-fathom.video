"use client";

import React, { useState } from "react";
import { CheckSquare, Square, Plus, Trash2, Clock, CheckCircle2 } from "lucide-react";
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
      {/* Action Items Header & Add CTA */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Assigned Tasks ({actionItems.length})
            </h3>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Add Manual Item Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreate}
            className="mb-3.5 p-3.5 bg-[#141826] border border-white/10 rounded-xl space-y-2 text-xs"
          >
            <input
              type="text"
              placeholder="Action item description..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full p-2.5 bg-[#0e121d] border border-white/10 rounded-lg text-white placeholder-slate-400 outline-none text-xs"
              autoFocus
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Assignee (e.g. Carlos)..."
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className="flex-1 p-2 bg-[#0e121d] border border-white/10 rounded-lg text-white placeholder-slate-400 outline-none text-xs"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors cursor-pointer text-xs"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Action Items List */}
        {actionItems.length === 0 ? (
          <div className="p-4 rounded-xl bg-white/2 border border-white/6 text-center">
            <p className="text-xs text-slate-400 italic">
              No tasks assigned yet. Add one above.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                  item.done
                    ? "bg-white/2 border-white/4 opacity-60"
                    : "bg-[#121622] hover:bg-[#161c2a] border-white/6"
                }`}
              >
                {/* Done Toggle Checkbox */}
                <button
                  onClick={() => onToggleDone(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs leading-relaxed ${
                      item.done ? "line-through text-slate-400" : "text-slate-200 font-medium"
                    }`}
                  >
                    {item.text}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {/* Assignee Badge */}
                    {item.assignee && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {item.assignee}
                      </span>
                    )}

                    {/* Due Hint */}
                    {item.due_hint && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.due_hint}
                      </span>
                    )}

                    {/* Timestamp Seek Chip */}
                    {item.start_ms !== undefined && item.start_ms > 0 && (
                      <button
                        onClick={() => onSeek(item.start_ms!)}
                        className="flex items-center gap-1 font-mono text-[10px] text-slate-400 hover:text-cyan-300 px-1.5 py-0.2 rounded bg-white/4 transition-colors cursor-pointer ml-auto"
                        title="Seek to discussion"
                      >
                        <Clock className="w-2.5 h-2.5" />
                        <span>{formatTime(item.start_ms)}</span>
                      </button>
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
        <div className="pt-4 border-t border-white/6">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Saved Highlights ({highlights.length})</span>
          </h3>

          <div className="space-y-2">
            {highlights.map((hl) => (
              <div
                key={hl.id}
                className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-between gap-3 text-xs"
              >
                <button
                  onClick={() => onSeek(hl.start_ms)}
                  className="flex-1 text-left hover:text-amber-300 transition-colors cursor-pointer truncate"
                >
                  <p className="font-semibold text-slate-200 truncate">{hl.note || "Key Moment"}</p>
                  <span className="font-mono text-[10px] text-amber-400">
                    {formatTime(hl.start_ms)}
                  </span>
                </button>

                {onDeleteHighlight && (
                  <button
                    onClick={() => onDeleteHighlight(hl.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
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
