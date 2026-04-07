// InputBar.tsx — Message input with Lucide icons, save indicator, disabled upload tooltip
import { useRef, useEffect, useState } from 'react';
import { Send, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputBarProps {
  input    : string;
  loading  : boolean;
  mode     : 'qa' | 'flowchart';
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  onChange : (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit : () => void;
  uiMode?  : 'normal' | 'tui';
}

export default function InputBar({ input, loading, mode, saveState, onChange, onKeyDown, onSubmit, uiMode = 'normal' }: InputBarProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = ref.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  const placeholder = mode === 'flowchart'
    ? 'Paste Mermaid flowchart here (graph TD ...)  →  Ctrl+Enter to generate SCL'
    : 'Ask about S7-1200 programming, errors, or logic…  →  Ctrl+Enter to send';

  return (
    <footer className={`border-t px-6 py-4 transition-colors duration-300 ${
      uiMode === 'tui' ? 'bg-[#1c1917] border-[#2e2b28]' : 'bg-[#fcf9f8] border-[#C8D8F0]/20'
    }`}>
      <div className="max-w-4xl mx-auto">

        {/* Textarea container */}
        <div className={`relative transition-all duration-300 ${
          uiMode === 'tui' 
            ? 'bg-[#252220] border border-[#2e2b28]' 
            : 'bg-[#eae7e7] border-none focus-within:ring-2 focus-within:ring-[#0050C0]/40'
        }`}>
          {uiMode === 'tui' && (
            <div className="absolute top-4 left-4 text-[--active] font-mono text-sm pointer-events-none">
              ENGINEER@CONTROLS:~$
            </div>
          )}
          <textarea
            ref={ref}
            value={input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={uiMode === 'tui' ? '' : placeholder}
            disabled={loading}
            rows={3}
            className={`w-full bg-transparent px-5 py-4 pr-28 text-sm focus:outline-none disabled:opacity-60 leading-relaxed resize-none ${
              uiMode === 'tui' 
                ? 'font-mono text-[--text-primary] pl-[180px] selection:bg-[--active]/30' 
                : 'text-[#1b1c1c] placeholder-[#757681]'
            }`}
            style={{ minHeight: '80px', maxHeight: '200px' }}
          />

          {/* Action buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onSubmit}
              disabled={loading || !input.trim()}
              className={`${
                uiMode === 'tui'
                  ? 'bg-transparent border border-[--active] text-[--active] px-3 py-1.5 text-[10px] uppercase font-bold hover:bg-[--active] hover:text-[#1c1917]'
                  : 'bg-[#0050C0] text-white p-2.5 hover:bg-[#003080]'
              } transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center`}
              title="Send (Ctrl+Enter)"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : uiMode === 'tui' ? (
                '[ RUN_COMMAND ]'
              ) : (
                <Send size={18} />
              )}
            </motion.button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex gap-4 text-[10px] text-[#757681] font-industrial uppercase tracking-widest">
            <span>Ctrl+Enter Send</span>
            <span>·</span>
            <span>Ctrl+K Search</span>
            <span>·</span>
            <span>Ctrl+N New Chat</span>
          </div>

          {/* Save indicator */}
          <div className="flex items-center gap-1.5 text-[10px] transition-all">
            {saveState === 'saving' && (
              <span className="flex items-center gap-1 text-[#999999]">
                <Loader2 size={11} className="animate-spin" /> Saving…
              </span>
            )}
            {saveState === 'saved' && (
              <span className="flex items-center gap-1 text-emerald-500">
                <CheckCircle2 size={11} /> Saved
              </span>
            )}
            {saveState === 'error' && (
              <span className="flex items-center gap-1 text-red-400">
                <AlertCircle size={11} /> Failed to save
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
