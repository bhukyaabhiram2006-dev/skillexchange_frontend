import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useExchanges } from '../../context/ExchangeContext';
import { Calendar, Clock, Video } from 'lucide-react';

export default function ScheduleSessionModal({ isOpen, onClose, defaultExchangeId }) {
  const { exchanges, scheduleSession } = useExchanges();

  const activeExchanges = exchanges.filter((e) => e.status === 'active');

  const [selectedExchangeId, setSelectedExchangeId] = useState(
    defaultExchangeId || activeExchanges[0]?.id || ''
  );
  const [sessionTitle, setSessionTitle] = useState('');
  const [date, setDate] = useState('Tomorrow, Oct 13');
  const [time, setTime] = useState('4:00 PM - 5:00 PM');
  const [platform, setPlatform] = useState('Zoom Meeting');
  const [meetingLink, setMeetingLink] = useState('https://zoom.us/j/demo-skill-exchange');

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleSession({
      exchangeId: selectedExchangeId,
      title: sessionTitle || 'Skill Mentoring Session',
      date,
      time,
      platform,
      meetingLink,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule an Exchange Session"
      subtitle="Pick a date and share the meeting room link with your partner."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeExchanges.length > 0 ? (
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Select Active Partner
            </label>
            <select
              value={selectedExchangeId}
              onChange={(e) => setSelectedExchangeId(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {activeExchanges.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.partnerName} ({ex.skillLearning} ⇄ {ex.skillTeaching})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
            No active exchanges found. You can still schedule an open student study session below!
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Session Topic
          </label>
          <input
            type="text"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            placeholder="e.g. Figma Auto-Layout Hands-on Practice"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Date
            </label>
            <input
              type="text"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. Thursday, Oct 15"
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Time
            </label>
            <input
              type="text"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 5:00 PM - 6:00 PM"
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Platform / Location
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="Zoom Meeting">Zoom Meeting</option>
            <option value="Google Meet">Google Meet</option>
            <option value="Discord Voice / Screenshare">Discord Voice / Screenshare</option>
            <option value="Campus Library / Cafe">Campus Library / Cafe (In-Person)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Meeting Link or Room Details
          </label>
          <input
            type="text"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/... or Library 2nd floor"
            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
          >
            Confirm Schedule
          </button>
        </div>
      </form>
    </Modal>
  );
}
