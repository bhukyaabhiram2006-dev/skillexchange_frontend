import React, { useState, useMemo, useEffect } from 'react';
import SearchBar from '../components/common/SearchBar';
import StudentCard from '../components/students/StudentCard';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { MOCK_STUDENTS } from '../data/mockData';
import { rankStudentsForUser } from '../utils/matchingAlgorithm';
import profileService from '../services/profileService';
import { getStoredToken } from '../services/apiClient';
import { Users, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function StudentProfilesPage() {
  const { currentUser } = useAuth();

  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [sortBy, setSortBy] = useState('match'); // 'match', 'rating', 'exchanges'

  // Attempt backend load
  useEffect(() => {
    if (getStoredToken()) {
      profileService
        .getProfiles({ size: 50 })
        .then((res) => {
          if (res?.content && res.content.length > 0) {
            // Filter out current user from student directory
            const others = res.content.filter(
              (s) => s.id !== currentUser?.id && s.email !== currentUser?.email
            );
            if (others.length > 0) {
              setStudents(others);
            }
          }
        })
        .catch(() => {
          // Keep default mock students
        });
    }
  }, [currentUser]);

  // Extract unique colleges
  const colleges = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.college)));
    return ['All', ...list];
  }, [students]);

  // Compute matched and ranked students
  const rankedStudents = useMemo(() => {
    return rankStudentsForUser(currentUser, students);
  }, [currentUser, students]);

  // Filter & sort
  const filteredStudents = useMemo(() => {
    return rankedStudents
      .filter((student) => {
        // College filter
        if (selectedCollege !== 'All' && student.college !== selectedCollege) {
          return false;
        }

        // Mode filter
        if (selectedMode !== 'All' && !student.preferredMode.toLowerCase().includes(selectedMode.toLowerCase())) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const nameMatch = student.name.toLowerCase().includes(q);
          const courseMatch = student.course.toLowerCase().includes(q);
          const bioMatch = student.bio.toLowerCase().includes(q);
          const teachMatch = student.skillsOffered?.some((s) => s.name.toLowerCase().includes(q));
          const learnMatch = student.skillsDesired?.some((s) => s.name.toLowerCase().includes(q));

          if (!nameMatch && !courseMatch && !bioMatch && !teachMatch && !learnMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'exchanges') return b.exchangeCount - a.exchangeCount;
        return b.match.score - a.match.score; // default: match score
      });
  }, [rankedStudents, searchQuery, selectedCollege, selectedMode, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCollege('All');
    setSelectedMode('All');
    setSortBy('match');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Student Profiles & Peer Directory
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Discover learning partners, view match scores based on reciprocal skills, and send exchange proposals.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by student name, major, or skills (e.g. Figma, Python)..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* College filter */}
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-medium"
            >
              <option value="All">All Campuses</option>
              {colleges.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Mode filter */}
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-medium"
            >
              <option value="All">All Learning Modes</option>
              <option value="Online">Online Sessions</option>
              <option value="In-person">In-Person Meetups</option>
              <option value="Hybrid">Hybrid</option>
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl focus:outline-none text-indigo-800 font-semibold"
            >
              <option value="match">Sort by Match Score 🔥</option>
              <option value="rating">Sort by Rating ⭐</option>
              <option value="exchanges">Sort by Most Exchanges</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredStudents.length}</strong> peers
        </span>
        {(searchQuery || selectedCollege !== 'All' || selectedMode !== 'All') && (
          <button
            onClick={handleResetFilters}
            className="text-indigo-600 hover:underline font-semibold"
          >
            Clear active filters
          </button>
        )}
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <EmptyState
          title="No student profiles match your search criteria"
          description="Try selecting 'All Campuses' or searching for a broader skill term."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              match={student.match}
            />
          ))}
        </div>
      )}
    </div>
  );
}
