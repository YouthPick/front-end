import { CheckSquare, Pencil, Plus, Square, Trash2 } from 'lucide-react';
import { useState } from 'react';

import type { TrackerChecklistItem } from '../../types/tracker.types';

const CHECKLIST_MESSAGE_MAX_LENGTH = 500;

interface TrackerChecklistProps {
  checklist: TrackerChecklistItem[];
  onToggleItem: (itemId: number) => void;
  onDeleteItem: (itemId: number) => void;
  onAddItem: (text: string) => void;
  onEditItem: (itemId: number, text: string) => void;
}

export function TrackerChecklist({
  checklist,
  onToggleItem,
  onDeleteItem,
  onAddItem,
  onEditItem,
}: TrackerChecklistProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAdd = () => {
    if (newItemText.trim() === '') return;
    onAddItem(newItemText.trim());
    setNewItemText('');
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewItemText('');
  };

  const handleStartEdit = (item: TrackerChecklistItem) => {
    setEditingItemId(item.id);
    setEditingText(item.text);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingText('');
  };

  const handleSaveEdit = () => {
    if (editingItemId === null || editingText.trim() === '') return;
    onEditItem(editingItemId, editingText.trim());
    setEditingItemId(null);
    setEditingText('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-slate-800 flex items-center">
          <CheckSquare className="h-4 w-4 text-primary mr-1.5" />
          <span>준비 작업 체크리스트</span>
        </h4>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center space-x-1 text-[10px] font-extrabold text-primary hover:underline cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          <span>체크항목 추가</span>
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.01] p-3 space-y-2.5">
          <input
            type="text"
            placeholder="준비할 서류 또는 작업 내용을 적어보세요..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd();
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary"
            aria-label="체크리스트 항목 입력"
          />
          <div className="flex justify-end space-x-1">
            <button
              type="button"
              onClick={handleCancelAdd}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-white hover:brightness-105"
            >
              추가하기
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {checklist.map((item) =>
          editingItemId === item.id ? (
            <div
              key={item.id}
              className="rounded-2xl border border-primary/20 bg-primary/[0.01] p-3 space-y-2.5"
            >
              <input
                type="text"
                value={editingText}
                maxLength={CHECKLIST_MESSAGE_MAX_LENGTH}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSaveEdit();
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-primary"
                aria-label="체크리스트 항목 수정"
              />
              <div className="flex justify-end space-x-1">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-white hover:brightness-105"
                >
                  저장하기
                </button>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors"
            >
              <button
                type="button"
                onClick={() => onToggleItem(item.id)}
                aria-pressed={item.completed}
                className="flex items-start space-x-2.5 text-left flex-1"
              >
                {item.completed ? (
                  <CheckSquare className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5 fill-primary/10" />
                ) : (
                  <Square className="h-4.5 w-4.5 text-slate-300 shrink-0 mt-0.5" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    item.completed ? 'line-through text-slate-400' : 'text-slate-700'
                  }`}
                >
                  {item.text}
                </span>
              </button>
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartEdit(item)}
                  aria-label={`${item.text} 항목 수정`}
                  className="text-slate-300 hover:text-primary rounded p-1 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteItem(item.id)}
                  aria-label={`${item.text} 항목 삭제`}
                  className="text-slate-300 hover:text-rose-500 rounded p-1 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
