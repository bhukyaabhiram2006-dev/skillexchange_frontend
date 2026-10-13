import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../common/ProfileAvatar';
import Badge from '../common/Badge';
import RatingStars from '../common/RatingStars';
import MatchScoreBadge from './MatchScoreBadge';
import ConnectModal from './ConnectModal';
import { ArrowRight, Sparkles, MapPin, BookOpen, Clock } from 'lucide-react';

export default function StudentCard({ student, match }) {
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
        {/* Card Header & Avatar */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <ProfileAvatar
                src={student.avatar}
                name={student.name}
                size="lg"
                isOnline={true}
              />
              <div>
                <Link
                  to={`/students/${student.id}`}
                  className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base block"
                >
                  {student.name}
                </Link>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <BookOpen className="w-3 h-3 text-slate-400" />
                  <span>{student.course} ({student.year})</span>
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{student.college}</span>
                </p>
              </div>
            </div>

            {/* Match score badge */}
            {match && <MatchScoreBadge match={match} />}
          </div>

          {/* Rating and badges */}
          <div className="flex items-center gap-2 mb-3">
            <RatingStars rating={student.rating} count={student.reviewsCount} />
            {student.badge && (
              <Badge variant="violet" size="xs">
                {student.badge}
              </Badge>
            )}
          </div>

          {/* Bio snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {student.bio}
          </p>

          {/* Skills They Teach */}
          <div className="mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Can Teach
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.skillsOffered?.slice(0, 3).map((skill) => (
                <Badge key={skill.name} variant="indigo" size="xs">
                  {skill.name}
                </Badge>
              ))}
              {student.skillsOffered?.length > 3 && (
                <span className="text-[11px] text-slate-400 self-center">
                  +{student.skillsOffered.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Skills They Want to Learn */}
          <div className="mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Wants to Learn
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.skillsDesired?.slice(0, 3).map((skill) => (
                <Badge key={skill.name} variant="slate" size="xs">
                  {skill.name}
                </Badge>
              ))}
              {student.skillsDesired?.length > 3 && (
                <span className="text-[11px] text-slate-400 self-center">
                  +{student.skillsDesired.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Availability & Mode */}
          <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="truncate max-w-[150px]">{student.preferredMode}</span>
            </span>
            <span className="font-medium text-emerald-600">Available</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
          <Link
            to={`/students/${student.id}`}
            className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            View Profile
          </Link>
          <button
            onClick={() => setIsConnectOpen(true)}
            className="flex-1 py-2 inline-flex items-center justify-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <span>Connect</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
