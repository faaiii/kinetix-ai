'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  FolderKanban,
  Settings,
  Plus,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { Conversation, Project } from '@/lib/types';

interface SidebarProps {
  conversations: Conversation[];
  projects: Project[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  projects,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  isCollapsed,
  onToggleCollapse,
}) => {
  const pathname = usePathname();

  // Desktop collapsed mode
  if (isCollapsed) {
    return (
      <aside className="hidden md:flex w-16 border-r border-purple-500/15 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-2xl flex-col items-center py-4 justify-between transition-all duration-300 shrink-0 z-20">
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            className="p-2 rounded-xl hover:bg-purple-500/10 text-text-muted hover:text-purple-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={onNewChat}
            aria-label="New chat"
            className="p-2.5 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-md shadow-purple-600/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Link
            href="/projects"
            aria-label="Projects"
            className={`p-2 rounded-xl hover:bg-purple-500/10 text-text-muted hover:text-purple-600 transition-colors ${
              pathname === '/projects' ? 'bg-purple-500/15 text-purple-600' : ''
            }`}
          >
            <FolderKanban className="w-5 h-5" />
          </Link>
          <Link
            href="/settings"
            aria-label="Settings"
            className={`p-2 rounded-xl hover:bg-purple-500/10 text-text-muted hover:text-purple-600 transition-colors ${
              pathname === '/settings' ? 'bg-purple-500/15 text-purple-600' : ''
            }`}
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </aside>
    );
  }

  const starredConversations = conversations.filter((c) => c.isStarred);
  const recentConversations = conversations.filter((c) => !c.isStarred);

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        onClick={onToggleCollapse}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
      />

      {/* Main Responsive Sidebar */}
      <aside className="fixed md:relative inset-y-0 left-0 w-72 md:w-64 border-r border-purple-500/15 bg-white/95 dark:bg-zinc-950/95 md:bg-white/70 md:dark:bg-zinc-950/70 backdrop-blur-2xl flex flex-col justify-between transition-all duration-300 shrink-0 select-none z-40 shadow-2xl md:shadow-sm">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Header */}
          <div className="p-3.5 border-b border-purple-500/10 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-text text-sm tracking-tight block leading-tight">
                  Kinetix AI
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                  Open Source AI
                </span>
              </div>
            </div>
            <button
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="p-1.5 rounded-lg hover:bg-purple-500/10 text-text-muted hover:text-purple-600 transition-colors"
            >
              <span className="hidden md:inline"><ChevronLeft className="w-4 h-4" /></span>
              <span className="md:hidden"><X className="w-4 h-4" /></span>
            </button>
          </div>

          {/* Start New Chat CTA */}
          <div className="p-3">
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 768) onToggleCollapse();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-semibold transition-all shadow-md shadow-purple-600/20 active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Chat Lists */}
          <div className="flex-1 overflow-y-auto px-2 space-y-4 text-xs">
            {/* Starred */}
            {starredConversations.length > 0 && (
              <div>
                <div className="px-2 py-1 text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider text-[10px] flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-purple-600 dark:fill-purple-400" />
                  <span>Starred</span>
                </div>
                <div className="space-y-0.5 mt-1">
                  {starredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        onSelectConversation(conv.id);
                        if (window.innerWidth < 768) onToggleCollapse();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl truncate transition-all flex items-center space-x-2.5 ${
                        activeConversationId === conv.id
                          ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold shadow-sm'
                          : 'text-text-muted hover:bg-purple-500/5 hover:text-text'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{conv.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Chats */}
            <div>
              <div className="px-2 py-1 text-text-muted font-semibold uppercase tracking-wider text-[10px]">
                Recent Conversations
              </div>
              <div className="space-y-0.5 mt-1">
                {recentConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      if (window.innerWidth < 768) onToggleCollapse();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl truncate transition-all flex items-center space-x-2.5 ${
                      activeConversationId === conv.id
                        ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold shadow-sm'
                        : 'text-text-muted hover:bg-purple-500/5 hover:text-text'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{conv.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Link Section */}
            <div>
              <div className="px-2 py-1 text-text-muted font-semibold uppercase tracking-wider text-[10px] flex items-center justify-between">
                <span>Knowledge Projects</span>
                <Link
                  href="/projects"
                  className="hover:text-purple-600 text-[10px] font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-0.5 mt-1">
                {projects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/projects?id=${proj.id}`}
                    className="w-full text-left px-3 py-2 rounded-xl truncate transition-all flex items-center space-x-2.5 text-text-muted hover:bg-purple-500/5 hover:text-text"
                  >
                    <FolderKanban className="w-3.5 h-3.5 shrink-0 text-purple-500" />
                    <span className="truncate">{proj.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-3 border-t border-purple-500/10 flex items-center justify-between bg-white/40 dark:bg-zinc-900/40">
          <Link
            href="/settings"
            className="flex items-center space-x-2 text-xs text-text-muted hover:text-text transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              F
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-text block truncate leading-tight">Faisal Ahmed</span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">Pro Plan</span>
            </div>
          </Link>
          <Link
            href="/settings"
            aria-label="Settings"
            className="p-1.5 rounded-lg hover:bg-purple-500/10 text-text-muted hover:text-purple-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </>
  );
};
