import React, { useState } from 'react';
import ProfileAvatar from '../components/common/ProfileAvatar';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  School,
  BookOpen,
  Clock,
  Sparkles,
  Plus,
  X,
  Save,
  RotateCcw,
  Bell,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export default function ProfileSettingsPage() {
  const { currentUser, updateProfile, resetDemoData } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(currentUser?.name || '');
  const [headline, setHeadline] = useState(currentUser?.headline || '');
  const [college, setCollege] = useState(currentUser?.college || '');
  const [course, setCourse] = useState(currentUser?.course || '');
  const [year, setYear] = useState(currentUser?.year || '3rd Year (Junior)');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [availability, setAvailability] = useState(currentUser?.availability || '');
  const [preferredMode, setPreferredMode] = useState(currentUser?.preferredMode || '');

  // Skills
  const [skillsOffered, setSkillsOffered] = useState(currentUser?.skillsOffered || []);
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  const [newOfferedLevel, setNewOfferedLevel] = useState('Intermediate');

  const [skillsDesired, setSkillsDesired] = useState(currentUser?.skillsDesired || []);
  const [newDesiredSkill, setNewDesiredSkill] = useState('');

  // Toggles
  const [notifications, setNotifications] = useState(
    currentUser?.notifications || {
      exchangeRequests: true,
      newMessages: true,
      sessionReminders: true,
      weeklyDigest: false,
    }
  );

  const [privacy, setPrivacy] = useState(
    currentUser?.privacy || {
      showEmail: false,
      publicProfile: true,
    }
  );

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleAddOfferedSkill = (e) => {
    e.preventDefault();
    if (!newOfferedSkill.trim()) return;
    const skillObj = {
      name: newOfferedSkill.trim(),
      level: newOfferedLevel,
      category: 'general',
    };
    setSkillsOffered([...skillsOffered, skillObj]);
    setNewOfferedSkill('');
  };

  const handleRemoveOfferedSkill = (index) => {
    setSkillsOffered(skillsOffered.filter((_, i) => i !== index));
  };

  const handleAddDesiredSkill = (e) => {
    e.preventDefault();
    if (!newDesiredSkill.trim()) return;
    const skillObj = {
      name: newDesiredSkill.trim(),
      priority: 'High',
      category: 'general',
    };
    setSkillsDesired([...skillsDesired, skillObj]);
    setNewDesiredSkill('');
  };

  const handleRemoveDesiredSkill = (index) => {
    setSkillsDesired(skillsDesired.filter((_, i) => i !== index));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      headline,
      college,
      course,
      year,
      bio,
      availability,
      preferredMode,
      skillsOffered,
      skillsDesired,
      notifications,
      privacy,
    });
    addToast('Profile changes saved successfully!', 'success');
  };

  const handleConfirmReset = () => {
    resetDemoData();
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          My Profile & Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, teaching catalog, learning wishlist, and platform preferences.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
            <ProfileAvatar src={currentUser?.avatar} name={name} size="xl" isOnline={true} />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">{name || 'Your Name'}</h3>
              <p className="text-xs text-indigo-600 font-semibold">{headline}</p>
              <p className="text-xs text-slate-400">
                {college} • {course} ({year})
              </p>
            </div>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Headline / Subtitle
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                College or University
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Major / Course
                </label>
                <input
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="1st Year (Freshman)">1st Year</option>
                  <option value="2nd Year (Sophomore)">2nd Year</option>
                  <option value="3rd Year (Junior)">3rd Year</option>
                  <option value="4th Year (Senior)">4th Year</option>
                  <option value="Graduate Student">Graduate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              About You & Learning Philosophy
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed resize-none"
            />
          </div>

          {/* Availability and Preferred Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Typical Availability Schedule
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Weekday evenings, Saturday mornings"
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Preferred Exchange Mode
              </label>
              <input
                type="text"
                value={preferredMode}
                onChange={(e) => setPreferredMode(e.target.value)}
                placeholder="e.g. Online (Zoom) / Campus Library"
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Skills Management Section */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900">Manage Your Skill Exchange Catalog</h3>

          {/* Skills Offered */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-700 block">
              Skills You Can Teach
            </label>
            <div className="flex flex-wrap gap-2">
              {skillsOffered.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/60 text-xs font-medium"
                >
                  <span>
                    {s.name} <span className="opacity-70 text-[10px]">({s.level})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOfferedSkill(idx)}
                    className="hover:text-indigo-950 p-0.5"
                    aria-label="Remove skill"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill row */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newOfferedSkill}
                onChange={(e) => setNewOfferedSkill(e.target.value)}
                placeholder="Add skill you teach (e.g. Node.js, C++)"
                className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <select
                value={newOfferedLevel}
                onChange={(e) => setNewOfferedLevel(e.target.value)}
                className="text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button
                type="button"
                onClick={handleAddOfferedSkill}
                className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Skills Desired */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-violet-700 block">
              Skills You Want to Learn (Learning Goals)
            </label>
            <div className="flex flex-wrap gap-2">
              {skillsDesired.map((s, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 border border-violet-200/60 text-xs font-medium"
                >
                  <span>{s.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDesiredSkill(idx)}
                    className="hover:text-violet-950 p-0.5"
                    aria-label="Remove learning goal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add desired skill row */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newDesiredSkill}
                onChange={(e) => setNewDesiredSkill(e.target.value)}
                placeholder="Add skill you want to learn (e.g. Photography, Pitching)"
                className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <button
                type="button"
                onClick={handleAddDesiredSkill}
                className="px-3 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold hover:bg-violet-700"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                key: 'exchangeRequests',
                label: 'Exchange Proposal Alerts',
                desc: 'Receive alerts when another student proposes a skill swap',
              },
              {
                key: 'newMessages',
                label: 'Direct Chat Notifications',
                desc: 'Receive notices when an exchange partner sends you messages',
              },
              {
                key: 'sessionReminders',
                label: 'Upcoming Session Reminders',
                desc: 'Alerts 1 hour before scheduled mentoring sessions',
              },
              {
                key: 'weeklyDigest',
                label: 'Weekly Campus Skill Digest',
                desc: 'Summary of newly posted skills and trending peer matches',
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-start justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="pr-4">
                  <p className="text-xs font-semibold text-slate-900">{item.label}</p>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key] || false}
                  onChange={(e) =>
                    setNotifications({ ...notifications, [item.key]: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 mt-1"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Preferences</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Demo Data"
        subtitle="Restore platform to initial sample state"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            This will clear custom profile edits, new mock exchanges, and custom messages from your
            browser storage and restore the platform to default demo mock data.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReset}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
