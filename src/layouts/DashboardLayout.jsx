import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ProfileAvatar from '../components/common/ProfileAvatar';
import PostSkillModal from '../components/skills/PostSkillModal';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useExchanges } from '../context/ExchangeContext';
import { Menu, Plus, Bell, MessageSquare, Search, ShieldCheck } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPostSkillOpen, setIsPostSkillOpen] = useState(false);
  const { currentUser } = useAuth();
  const { conversations } = useMessages();
  const { exchanges } = useExchanges();
  const location = useLocation();

  const pendingExchanges = exchanges.filter((e) => e.status === 'pending').length;
  const unreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Derive header title from path
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/skills')) return 'Explore Skills Marketplace';
    if (path.startsWith('/students')) return 'Student Directory & Peers';
    if (path.startsWith('/exchanges')) return 'My Skill Exchanges';
    if (path.startsWith('/messages')) return 'Messages & Chat';
    if (path.startsWith('/profile')) return 'My Profile & Settings';
    return 'Student Skill Exchange';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {getHeaderTitle()}
              </h1>
              <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
                Connected as {currentUser?.name} • {currentUser?.college}
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Post Skill Quick Action */}
            <button
              onClick={() => setIsPostSkillOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offer a Skill</span>
            </button>

            {/* Notification icons */}
            <Link
              to="/exchanges"
              className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Skill Exchanges"
            >
              <Bell className="w-4 h-4" />
              {pendingExchanges > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
              )}
            </Link>

            <Link
              to="/messages"
              className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessages > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white" />
              )}
            </Link>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* Profile Avatar link */}
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ProfileAvatar src={currentUser?.avatar} name={currentUser?.name} size="sm" isOnline={true} />
            </Link>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Post Skill Modal */}
      <PostSkillModal
        isOpen={isPostSkillOpen}
        onClose={() => setIsPostSkillOpen(false)}
      />
    </div>
  );
}
