import React, { useState } from 'react';
import ProfileAvatar from '../common/ProfileAvatar';
import Badge from '../common/Badge';
import { Calendar, Video, Clock, ExternalLink, Plus } from 'lucide-react';
import { useExchanges } from '../../context/ExchangeContext';
import ScheduleSessionModal from '../exchanges/ScheduleSessionModal';

export default function UpcomingSessions() {
  const { upcomingSessions } = useExchanges();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Upcoming Sessions</h3>
              <p className="text-xs text-slate-400">Scheduled exchange meetings</p>
            </div>
          </div>
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No upcoming sessions scheduled yet.
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingSessions.slice(0, 3).map((sess) => (
              <div
                key={sess.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <ProfileAvatar src={sess.partnerAvatar} name={sess.partnerName} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{sess.title}</h4>
                      <Badge
                        variant={sess.role === 'Learning' ? 'violet' : 'emerald'}
                        size="xs"
                      >
                        {sess.role}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Partner: <span className="font-medium text-slate-700">{sess.partnerName}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {sess.date} • {sess.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3 text-slate-400" />
                        {sess.platform}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={sess.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs transition-colors self-end sm:self-center"
                >
                  <span>Join</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <ScheduleSessionModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />
    </>
  );
}
