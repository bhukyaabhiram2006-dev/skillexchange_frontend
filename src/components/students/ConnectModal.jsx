import React, { useState } from 'react';
import Modal from '../common/Modal';
import ProfileAvatar from '../common/ProfileAvatar';
import { useAuth } from '../../context/AuthContext';
import { useExchanges } from '../../context/ExchangeContext';
import { ArrowLeftRight, Send } from 'lucide-react';

export default function ConnectModal({ isOpen, onClose, targetStudent }) {
  const { currentUser } = useAuth();
  const { sendExchangeRequest } = useExchanges();

  const [skillLearning, setSkillLearning] = useState('');
  const [skillTeaching, setSkillTeaching] = useState('');
  const [exchangeMode, setExchangeMode] = useState('Online (Zoom/Discord)');
  const [proposalMessage, setProposalMessage] = useState('');

  // Set defaults when opening
  React.useEffect(() => {
    if (targetStudent) {
      const defaultLearn = targetStudent.skillsOffered?.[0]?.name || 'Skill';
      const defaultTeach = currentUser?.skillsOffered?.[0]?.name || 'Mentoring';
      setSkillLearning(defaultLearn);
      setSkillTeaching(defaultTeach);
      setProposalMessage(
        `Hi ${targetStudent.name.split(' ')[0]}! I'd love to exchange skills with you. I can share my experience in ${defaultTeach} in return for learning ${defaultLearn}!`
      );
    }
  }, [targetStudent, currentUser]);

  if (!targetStudent) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = sendExchangeRequest({
      partnerId: targetStudent.id,
      partnerName: targetStudent.name,
      partnerAvatar: targetStudent.avatar,
      partnerCollege: targetStudent.college,
      skillTeaching,
      skillLearning,
      exchangeMode,
      proposalMessage,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Propose Skill Exchange"
      subtitle={`Connect with ${targetStudent.name} from ${targetStudent.college}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile preview header */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <ProfileAvatar src={targetStudent.avatar} name={targetStudent.name} size="md" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 truncate">
              {targetStudent.name}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {targetStudent.course} • {targetStudent.college}
            </p>
          </div>
        </div>

        {/* Exchange skills select */}
        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/60 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Skill you want to learn from {targetStudent.name.split(' ')[0]}:
            </label>
            <select
              value={skillLearning}
              onChange={(e) => setSkillLearning(e.target.value)}
              className="w-full text-xs font-medium p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            >
              {targetStudent.skillsOffered?.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.level || 'Intermediate'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center text-indigo-500 my-1">
            <ArrowLeftRight className="w-4 h-4" />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Skill you can teach in return:
            </label>
            <select
              value={skillTeaching}
              onChange={(e) => setSkillTeaching(e.target.value)}
              className="w-full text-xs font-medium p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            >
              {currentUser?.skillsOffered?.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.level || 'Intermediate'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Learning Mode */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Preferred Exchange Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Online', 'In-Person', 'Hybrid'].map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setExchangeMode(mode)}
                className={`py-2 px-3 text-xs rounded-lg font-medium border text-center transition-all ${
                  exchangeMode === mode
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Proposal message */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Introductory Message
          </label>
          <textarea
            rows={3}
            value={proposalMessage}
            onChange={(e) => setProposalMessage(e.target.value)}
            className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 leading-relaxed resize-none"
            placeholder="Introduce yourself and outline your learning goals..."
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Proposal</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
