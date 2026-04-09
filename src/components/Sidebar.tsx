// Sidebar.tsx — Technical Navy Sidebar with Lucide React icons
import { useState } from 'react';
import {
  Plus, MessageSquare, GitBranch, HardHat, Clock,
  Trash2, Pencil, PanelLeftClose, PanelLeftOpen,
  Search, Settings2, Tag, ChevronDown, ChevronUp, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Session } from '../types';
import { VERSIONS } from '../config';

interface SidebarProps {
  user            : { name: string; email: string } | null;
  sessions        : Session[];
  activeId        : string;
  collapsed       : boolean;
  version         : string;
  uiMode?         : 'normal' | 'tui';
  onNewSession    : (mode: 'qa' | 'flowchart') => void;
  onSwitchSession : (id: string) => void;
  onDeleteSession : (id: string) => void;
  onVersionChange : (v: string) => void;
  onToggleCollapse: () => void;
  onOpenPalette   : () => void;
  onLogout        : () => void;
}

export default function Sidebar({
  user, sessions, activeId, collapsed, version, uiMode = 'normal',
  onNewSession, onSwitchSession, onDeleteSession, onVersionChange, onToggleCollapse, onOpenPalette, onLogout
}: SidebarProps) {
  const [showVersions, setShowVersions] = useState(false);

  return (
    <aside 
      className={`relative h-screen flex flex-col transition-all duration-300 border-r ${
        collapsed ? 'w-0 overflow-hidden' : 'w-72'
      } ${
        uiMode === 'tui' 
          ? 'bg-[#1c1917] border-[#2e2b28] shadow-[10px_0_30px_rgba(0,0,0,0.4)]' 
          : 'bg-[#001540] border-white/5 shadow-2xl'
      }`}
    >
      {/* Header / CTAs */}
      <div className="px-4 py-6 flex flex-col gap-3">
        <button
          onClick={() => onNewSession('qa')}
          className={`w-full py-3 px-4 flex items-center justify-center gap-2 font-headline text-sm font-bold transition-all active:scale-95 ${
            sessions.find(s => s.id === activeId)?.mode === 'qa'
              ? (uiMode === 'tui' ? 'bg-[#6a9e7f] text-[#1c1917] shadow-[0_0_15px_rgba(106,158,127,0.3)]' : 'bg-[#0050C0] text-white shadow-[0_0_20px_rgba(0,80,192,0.4)]')
              : (uiMode === 'tui'
                  ? 'bg-[#252220] border border-[#2e2b28] text-[#7a9eb5] hover:border-[#6a9e7f] hover:text-[#6a9e7f]'
                  : 'bg-[#0050C0]/10 text-[#0050C0] border border-[#0050C0]/20 hover:bg-[#0050C0]/20')
          }`}
        >
          {uiMode === 'tui' ? <ChevronRight size={14} /> : <Plus size={16} />}
          <span>New Chat</span>
        </button>
        <button
          onClick={() => onNewSession('flowchart')}
          className={`w-full py-2.5 px-4 flex items-center justify-center gap-2 font-headline text-sm font-bold transition-all active:scale-95 ${
            sessions.find(s => s.id === activeId)?.mode === 'flowchart'
              ? (uiMode === 'tui' ? 'bg-[#6a9e7f] text-[#1c1917] shadow-[0_0_15px_rgba(106,158,127,0.3)]' : 'bg-[#0050C0] text-white shadow-[0_0_20px_rgba(0,80,192,0.4)]')
              : (uiMode === 'tui'
                  ? 'bg-[#252220] border border-[#2e2b28] text-[#7a9eb5] hover:border-[#6a9e7f] hover:text-[#6a9e7f]'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10')
          }`}
        >
          {uiMode === 'tui' ? <ChevronRight size={14} /> : <GitBranch size={16} />} 
          <span>Logic Designer</span>
        </button>
      </div>

      {/* Search trigger */}
      <div className="px-4 mb-4">
        <button
          onClick={onOpenPalette}
          className="w-full flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-[#555555] hover:text-white hover:border-white/20 transition-colors text-xs"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Industrial Search...</span>
          <span className="text-[10px] opacity-40 font-mono tracking-tighter">CTRL+K</span>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-hide py-2">
        <div className="flex items-center justify-between mb-2">
           <span className="text-[10px] font-industrial text-[#7a9eb5] uppercase tracking-widest pl-2 flex items-center gap-2">
             <Clock size={10} /> Session Ledger
           </span>
        </div>
        
        {sessions.map((s) => (
          <div key={s.id} className="group relative">
            <button
              onClick={() => onSwitchSession(s.id)}
              className={`w-full text-left p-3 flex flex-col gap-1 transition-all border min-w-0 ${
                activeId === s.id 
                  ? (uiMode === 'tui' ? 'bg-[#252220] border-[#c4a96b]/50' : 'bg-[#003080] border-[#0050C0]/50') 
                  : 'bg-transparent border-transparent hover:bg-white/5'
              }`}
            >
              <span className={`text-xs font-bold leading-tight truncate w-full px-1 transition-colors ${
                activeId === s.id ? 'text-white' : 'text-[#7a9eb5] group-hover:text-white'
              }`}>
                {uiMode === 'tui' ? `ID_${s.title.toUpperCase().replace(/\s/g, '_')}` : s.title}
              </span>
              <div className="flex items-center gap-2 px-1">
                <span className="text-[9px] uppercase tracking-widest text-[#555555]">
                  {s.mode === 'flowchart' ? 'DESIGNER' : 'TECHNICAL_Q&A'}
                </span>
                <span className="text-[9px] text-[#333333]">•</span>
                <span className="text-[9px] text-[#555555]">01-A</span>
              </div>
            </button>
            {activeId === s.id && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer Area */}
      <div className="flex flex-col mt-auto">
        {/* Version Switcher */}
        <div className={`p-4 border-t ${uiMode === 'tui' ? 'border-[#2e2b28]' : 'border-white/5'}`}>
          <div className="relative">
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="w-full flex items-center gap-3 p-3 bg-white/5 border border-white/10 transition-all hover:bg-white/10 group"
            >
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center transition-transform group-hover:scale-105 ${
                uiMode === 'tui' ? 'bg-[#252220] text-[#c4a96b]' : 'bg-[#002060] text-[#0050C0]'
              }`}>
                 <HardHat size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[10px] font-industrial text-[#7a9eb5] uppercase tracking-wider">PLC Architecture</p>
                <p className="text-xs font-bold text-white truncate">{version || 'All Versions'}</p>
              </div>
            </button>

            <AnimatePresence>
              {showVersions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 w-full mb-2 bg-[#001540] border border-white/10 shadow-3xl overflow-hidden z-50 p-2 space-y-1"
                >
                  {VERSIONS.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => { onVersionChange(v.value); setShowVersions(false); }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors rounded-sm ${
                        v.value === version ? 'bg-[#0050C0] text-white' : 'text-[#7a9eb5] hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* User Account / Sign Out */}
        {user && (
          <div className={`p-4 border-t transition-colors ${uiMode === 'tui' ? 'border-[#2e2b28] bg-white/5' : 'border-white/5 bg-white/5'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  uiMode === 'tui' ? 'bg-transparent border border-[#c4a96b] text-[#c4a96b]' : 'bg-[#0050C0] text-white'
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">{user.name}</span>
                  <span className="text-[10px] text-[#7a9eb5] truncate leading-tight">{user.email}</span>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-[#7a9eb5] hover:text-red-400 transition-colors"
                title="Log Out"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
