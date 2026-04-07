import React from 'react';
import { Message } from '../types';

interface LogicWorkbenchProps {
  messages: Message[];
}

export default function LogicWorkbench({ messages }: LogicWorkbenchProps) {
  // Extract the latest SCL code block from messages
  const latestCode = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === 'assistant') {
        const match = msg.content.match(/```(?:scl)?\n([\s\S]*?)```/);
        if (match) return match[1].trim();
      }
    }
    return null;
  }, [messages]);

  const handleCopy = () => {
    if (latestCode) {
      navigator.clipboard.writeText(latestCode);
    }
  };

  const handleDownload = () => {
    if (latestCode) {
      const blob = new Blob([latestCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logic_block.scl';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex-1 flex flex-col border border-[--border] bg-[--bg-panel] relative min-h-0">
      <div className="absolute -top-2 left-4 bg-[--bg-main] px-2 text-[--danger] font-bold text-[10px] uppercase tracking-widest z-10">
        LOGIC_WORKBENCH
      </div>
      
      <div className="flex justify-between items-center px-4 py-2 border-b border-[--border] bg-white/5 shrink-0">
        <span className="text-[--text-muted] text-[10px] uppercase tracking-wider">
          {latestCode ? 'FILE: logic_block.scl' : 'NO_LOGIC_DETECTED'}
        </span>
        <div className="flex gap-4 text-[10px]">
          <button 
            onClick={handleCopy}
            disabled={!latestCode}
            className="text-[--active] hover:underline uppercase disabled:opacity-30"
          >
            [COPY]
          </button>
          <button 
            onClick={handleDownload}
            disabled={!latestCode}
            className="text-[--success] hover:underline uppercase disabled:opacity-30"
          >
            [DL_BLOCK]
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 text-[--text-primary] leading-relaxed bg-[--bg-main]/40 font-mono text-[13px] ${!latestCode ? 'scrollbar-hide' : ''}`}>
        {latestCode ? (
          <pre className="whitespace-pre-wrap break-all">
            <code>{latestCode}</code>
          </pre>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[--text-dim] text-center gap-4 opacity-50">
            <div className="text-4xl text-[--border]">[ ? ]</div>
            <p className="max-w-[200px] text-[10px] uppercase tracking-[0.2em]">
              Waiting for logic generation sequence...
            </p>
          </div>
        )}
      </div>

      <div className="h-[24px] border-t border-[--border] bg-black/10 px-4 flex items-center justify-between text-[9px] text-[--text-dim] uppercase tracking-widest shrink-0">
        <span>STATUS: {latestCode ? 'COMPILED' : 'IDLE'}</span>
        <span>ENC: UTF-8 // IEC-61131-3</span>
      </div>
    </div>
  );
}
