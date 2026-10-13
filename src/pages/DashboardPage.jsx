import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import RecommendedMatches from '../components/dashboard/RecommendedMatches';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import SkillCard from '../components/skills/SkillCard';
import PostSkillModal from '../components/skills/PostSkillModal';
import ScheduleSessionModal from '../components/exchanges/ScheduleSessionModal';
import { useAuth } from '../context/AuthContext';
import { useExchanges } from '../context/ExchangeContext';
import {
  Sparkles,
  BookOpen,
  Target,
  ArrowLeftRight,
  CheckCircle2,
  Plus,
  Users,
  MessageSquare,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const { exchanges, allSkills } = useExchanges();

  const [isPostSkillOpen, setIsPostSkillOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Stats calculation
  const skillsOfferedCount = currentUser?.skillsOffered?.length || 0;
  const learningGoalsCount = currentUser?.skillsDesired?.length || 0;
  const activeExchangesCount = exchanges.filter((e) => e.status === 'active').length;
  const completedExchangesCount = exchanges.filter((e) => e.status === 'completed').length;

  const recentSkills = allSkills.slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/10">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-indigo-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collegiate Exchange Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser?.name || 'Student'}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            You have <span className="font-bold underline">{activeExchangesCount} active</span> skill
            exchanges underway at {currentUser?.college}. Check your matches or schedule your next
            mentoring session below.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-3 flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsPostSkillOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Offer a New Skill</span>
            </button>
            <Link
              to="/students"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors border border-white/20"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Find a Partner</span>
            </Link>
            <button
              onClick={() => setIsScheduleOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors border border-white/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Session</span>
            </button>
            <Link
              to="/messages"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors border border-white/20"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Messages</span>
            </Link>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Skills Offered"
          value={skillsOfferedCount}
          subtitle="Skills you can teach peers"
          icon={BookOpen}
          variant="indigo"
        />
        <StatCard
          title="Learning Goals"
          value={learningGoalsCount}
          subtitle="Skills you want to acquire"
          icon={Target}
          variant="violet"
        />
        <StatCard
          title="Active Exchanges"
          value={activeExchangesCount}
          subtitle="Ongoing peer partnerships"
          icon={ArrowLeftRight}
          variant="emerald"
        />
        <StatCard
          title="Completed Exchanges"
          value={completedExchangesCount}
          subtitle="Finished mentoring cycles"
          icon={CheckCircle2}
          variant="amber"
        />
      </div>

      {/* Recommended Matches Section */}
      <RecommendedMatches />

      {/* Two Column Grid: Upcoming Sessions & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingSessions />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Recently Added Skills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recently Added Skills</h3>
            <p className="text-xs text-slate-400">Discover what peers have recently posted</p>
          </div>
          <Link
            to="/skills"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} viewMode="grid" />
          ))}
        </div>
      </div>

      {/* Modals */}
      <PostSkillModal
        isOpen={isPostSkillOpen}
        onClose={() => setIsPostSkillOpen(false)}
      />
      <ScheduleSessionModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />
    </div>
  );
}
