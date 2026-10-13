import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../common/ProfileAvatar';
import Badge from '../common/Badge';
import RatingStars from '../common/RatingStars';
import ConnectModal from '../students/ConnectModal';
import { MOCK_STUDENTS } from '../../data/mockData';
import { ArrowLeftRight, BookOpen, Layers } from 'lucide-react';

export default function SkillCard({ skill, viewMode = 'grid' }) {
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  // Find student info
  const student = MOCK_STUDENTS.find((s) => s.id === skill.studentId) || {
    id: skill.studentId,
    name: skill.studentName,
    avatar: skill.studentAvatar,
    college: skill.college,
    course: 'Student',
    skillsOffered: [{ name: skill.title, level: skill.level }],
  };

  const levelColors = {
    Beginner: 'emerald',
    Intermediate: 'indigo',
    Advanced: 'violet',
    'All Levels': 'slate',
  };

  if (viewMode === 'list') {
    return (
      <>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <ProfileAvatar src={skill.studentAvatar} name={skill.studentName} size="lg" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{skill.title}</h3>
                <Badge variant={levelColors[skill.level] || 'indigo'} size="xs">
                  {skill.level}
                </Badge>
                <Badge variant="slate" size="xs">
                  {skill.format}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Taught by{' '}
                <Link to={`/students/${skill.studentId}`} className="text-indigo-600 hover:underline">
                  {skill.studentName}
                </Link>{' '}
                • {skill.college}
              </p>
              <p className="text-xs text-slate-600 line-clamp-1 max-w-2xl">{skill.description}</p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {skill.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-right">
              <RatingStars rating={skill.rating} count={skill.exchangeCount} />
              <p className="text-[11px] text-slate-400 mt-0.5">
                Wants: <span className="text-slate-700 font-medium">{skill.lookingFor}</span>
              </p>
            </div>
            <button
              onClick={() => setIsConnectOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors whitespace-nowrap"
            >
              Request Exchange
            </button>
          </div>
        </div>

        <ConnectModal
          isOpen={isConnectOpen}
          onClose={() => setIsConnectOpen(false)}
          targetStudent={student}
        />
      </>
    );
  }

  // Grid view
  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
        <div className="p-5">
          {/* Top badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge variant={levelColors[skill.level] || 'indigo'} size="xs">
              {skill.level}
            </Badge>
            <span className="text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              {skill.format}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base line-clamp-1 mb-2">
            {skill.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 min-h-[36px]">
            {skill.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skill.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100"
              >
                #{tag}
              </span>
            ))}
            {skill.tags?.length > 3 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{skill.tags.length - 3}
              </span>
            )}
          </div>

          {/* Reciprocal looking for */}
          <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100/50 mb-4 flex items-center gap-2 text-xs">
            <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <div className="truncate">
              <span className="text-slate-500 text-[11px]">Wants to learn: </span>
              <span className="font-semibold text-indigo-900 text-[11px] truncate">
                {skill.lookingFor}
              </span>
            </div>
          </div>

          {/* Instructor & Rating */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <div className="flex items-center gap-2">
              <ProfileAvatar src={skill.studentAvatar} name={skill.studentName} size="sm" />
              <div className="min-w-0">
                <Link
                  to={`/students/${skill.studentId}`}
                  className="text-xs font-semibold text-slate-800 hover:text-indigo-600 truncate block max-w-[120px]"
                >
                  {skill.studentName}
                </Link>
                <p className="text-[11px] text-slate-400 truncate max-w-[120px]">{skill.college}</p>
              </div>
            </div>
            <RatingStars rating={skill.rating} count={skill.exchangeCount} />
          </div>
        </div>

        {/* Action Button */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-100">
          <button
            onClick={() => setIsConnectOpen(true)}
            className="w-full py-2 text-center text-xs font-semibold text-indigo-600 hover:text-white bg-white hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 rounded-xl transition-all shadow-2xs"
          >
            Request Exchange
          </button>
        </div>
      </div>

      <ConnectModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        targetStudent={student}
      />
    </>
  );
}
