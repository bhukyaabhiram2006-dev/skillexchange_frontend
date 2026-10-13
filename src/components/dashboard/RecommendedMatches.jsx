import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../common/ProfileAvatar';
import MatchScoreBadge from '../students/MatchScoreBadge';
import ConnectModal from '../students/ConnectModal';
import { useAuth } from '../../context/AuthContext';
import { MOCK_STUDENTS } from '../../data/mockData';
import { rankStudentsForUser } from '../../utils/matchingAlgorithm';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function RecommendedMatches() {
  const { currentUser } = useAuth();
  const [targetConnectStudent, setTargetConnectStudent] = useState(null);

  const rankedStudents = rankStudentsForUser(currentUser, MOCK_STUDENTS);
  const topMatches = rankedStudents.slice(0, 3);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recommended Matches</h3>
              <p className="text-xs text-slate-400">
                Matched based on mutual skills and learning goals
              </p>
            </div>
          </div>
          <Link
            to="/students"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topMatches.map((student) => (
            <div
              key={student.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <ProfileAvatar src={student.avatar} name={student.name} size="md" />
                  <MatchScoreBadge match={student.match} />
                </div>

                <Link
                  to={`/students/${student.id}`}
                  className="font-bold text-xs text-slate-900 hover:text-indigo-600 transition-colors block"
                >
                  {student.name}
                </Link>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {student.course} • {student.college}
                </p>

                {/* Match explanation note */}
                <div className="mt-3 p-2 bg-white rounded-lg border border-slate-100 text-[11px] text-slate-600 leading-snug">
                  {student.match.explanation}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <Link
                  to={`/students/${student.id}`}
                  className="flex-1 py-1.5 text-center text-xs font-medium text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => setTargetConnectStudent(student)}
                  className="flex-1 py-1.5 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConnectModal
        isOpen={!!targetConnectStudent}
        onClose={() => setTargetConnectStudent(null)}
        targetStudent={targetConnectStudent}
      />
    </>
  );
}
