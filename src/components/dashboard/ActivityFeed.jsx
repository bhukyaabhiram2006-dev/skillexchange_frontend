import React from 'react';
import { MOCK_ACTIVITIES } from '../../data/mockData';
import { UserPlus, Calendar, MessageSquare, CheckCircle2, Bell } from 'lucide-react';

export default function ActivityFeed() {
  const iconMap = {
    UserPlus,
    Calendar,
    MessageSquare,
    CheckCircle2,
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Activity</h3>
            <p className="text-xs text-slate-400">Updates on your exchanges</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_ACTIVITIES.map((act) => {
          const Icon = iconMap[act.icon] || Bell;
          return (
            <div key={act.id} className="flex items-start gap-3 group">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  act.unread
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4
                    className={`text-xs font-semibold truncate ${
                      act.unread ? 'text-slate-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    {act.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {act.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
