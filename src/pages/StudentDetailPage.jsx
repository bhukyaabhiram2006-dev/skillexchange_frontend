import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProfileAvatar from '../components/common/ProfileAvatar';
import Badge from '../components/common/Badge';
import RatingStars from '../components/common/RatingStars';
import MatchScoreBadge from '../components/students/MatchScoreBadge';
import ConnectModal from '../components/students/ConnectModal';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { MOCK_STUDENTS } from '../data/mockData';
import { calculateMatch } from '../utils/matchingAlgorithm';
import profileService from '../services/profileService';
import {
  ArrowLeft,
  BookOpen,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Award,
} from 'lucide-react';

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { startConversationWithStudent } = useMessages();
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  const [student, setStudent] = useState(() => {
    return MOCK_STUDENTS.find((s) => s.id === id) || MOCK_STUDENTS[0];
  });

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      profileService
        .getProfileById(id)
        .then((p) => {
          if (p) setStudent(p);
        })
        .catch(() => {});
    } else {
      const found = MOCK_STUDENTS.find((s) => s.id === id);
      if (found) setStudent(found);
    }
  }, [id]);

  const match = calculateMatch(currentUser, student);

  const handleMessageClick = () => {
    startConversationWithStudent(student);
    navigate('/messages');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back Button */}
      <Link
        to="/students"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Profiles</span>
      </Link>

      {/* Profile Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
        {/* Cover Photo */}
        <div
          className="h-44 sm:h-56 w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${
              student.coverImage ||
              'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80'
            })`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <ProfileAvatar
                src={student.avatar}
                name={student.name}
                size="2xl"
                isOnline={true}
                className="ring-4 ring-white"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {student.name}
                  </h1>
                  {student.badge && (
                    <Badge variant="violet" size="sm">
                      {student.badge}
                    </Badge>
                  )}
                  <MatchScoreBadge match={match} />
                </div>
                <p className="text-sm font-semibold text-indigo-600">{student.headline}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{student.course} ({student.year})</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{student.college}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
              <button
                onClick={handleMessageClick}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Message</span>
              </button>
              <button
                onClick={() => setIsConnectOpen(true)}
                className="px-5 py-2.5 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Exchange Proposal</span>
              </button>
            </div>
          </div>

          {/* Bio text */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl border-t border-slate-100 pt-4">
            {student.bio}
          </p>
        </div>
      </div>

      {/* Two Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Skills & Match Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Match Analysis Breakdown */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-violet-50/70 rounded-2xl p-6 border border-indigo-100/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Compatibility Analysis with You ({match.score}% Match)
                </h3>
                <p className="text-xs text-slate-500">{match.explanation}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-indigo-100">
              <div className="p-3 bg-white/80 rounded-xl border border-indigo-100/50">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                  What {student.name.split(' ')[0]} can teach you:
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  {match.theyTeachWhatYouWant.length > 0
                    ? match.theyTeachWhatYouWant.join(', ')
                    : student.skillsOffered?.map((s) => s.name).slice(0, 2).join(', ')}
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-indigo-100/50">
                <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider block mb-1">
                  What you can teach in return:
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  {match.theyWantWhatYouTeach.length > 0
                    ? match.theyWantWhatYouTeach.join(', ')
                    : currentUser?.skillsOffered?.map((s) => s.name).slice(0, 2).join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Skills Offered Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Skills Offered for Mentoring</h3>
              <p className="text-xs text-slate-400">
                Topics {student.name} is comfortable teaching or pairing on
              </p>
            </div>

            <div className="space-y-3">
              {student.skillsOffered?.map((skill) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{skill.name}</h4>
                      <Badge variant="indigo" size="xs">
                        {skill.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Experience: {skill.years || '2+ years'} • Structured exercises & portfolio reviews
                    </p>
                  </div>
                  <button
                    onClick={() => setIsConnectOpen(true)}
                    className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    Request this Skill
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Desired Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Learning Wishlist</h3>
              <p className="text-xs text-slate-400">
                Skills {student.name} is looking to learn in exchange
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {student.skillsDesired?.map((skill) => (
                <div
                  key={skill.name}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  <span>{skill.name}</span>
                  <span className="text-[10px] text-slate-400">({skill.priority || 'High'} Priority)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Availability, Stats & Verification */}
        <div className="space-y-6">
          {/* Availability & Mode Box */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Exchange Preferences</h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Availability</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>{student.availability}</span>
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Preferred Mode</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>{student.preferredMode}</span>
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Campus Status</span>
                <p className="font-semibold text-emerald-600 mt-0.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Student at {student.college}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Community Track Record</h3>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <p className="text-2xl font-black text-slate-900">{student.exchangeCount}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Exchanges Completed</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1">
                  <RatingStars rating={student.rating} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">({student.reviewsCount} Reviews)</p>
              </div>
            </div>
          </div>

          {/* Sample Endorsement Quote */}
          <div className="p-5 bg-indigo-50/40 rounded-2xl border border-indigo-100 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1 text-indigo-600 font-bold">
              <Award className="w-4 h-4" />
              <span>Peer Endorsement</span>
            </div>
            <p className="italic leading-relaxed">
              "Working with {student.name.split(' ')[0]} was effortless. Very punctual, prepared
              practical exercises, and provided thoughtful feedback on my assignments."
            </p>
            <p className="text-[10px] text-slate-400">— Verified Student Review</p>
          </div>
        </div>
      </div>

      <ConnectModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        targetStudent={student}
      />
    </div>
  );
}
