import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Users,
  ArrowLeftRight,
  MessageSquare,
  Settings,
  Sparkles,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useExchanges } from '../../context/ExchangeContext';
import { useMessages } from '../../context/MessageContext';
import ProfileAvatar from './ProfileAvatar';

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const { exchanges } = useExchanges();
  const { conversations } = useMessages();
  const navigate = useNavigate();

  const pendingCount = exchanges.filter((e) => e.status === 'pending').length;
  const unreadMsgCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const links = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Explore Skills', to: '/skills', icon: Search },
    { label: 'Student Profiles', to: '/students', icon: Users },
    {
      label: 'My Skill Exchanges',
      to: '/exchanges',
      icon: ArrowLeftRight,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      label: 'Messages',
      to: '/messages',
      icon: MessageSquare,
      badge: unreadMsgCount > 0 ? unreadMsgCount : null,
      badgeColor: 'bg-indigo-600 text-white',
    },
    { label: 'Profile & Settings', to: '/profile', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <NavLink to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  SkillExchange
                </span>
                <span className="text-[10px] font-semibold text-indigo-500 block -mt-1 tracking-wider uppercase">
                  College Hub
                </span>
              </div>
            </NavLink>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 shadow-2xs font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${link.badgeColor}`}
                    >
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout at bottom */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <NavLink
            to="/profile"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            <ProfileAvatar
              src={currentUser?.avatar}
              name={currentUser?.name}
              size="sm"
              isOnline={true}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {currentUser?.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{currentUser?.college}</p>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
