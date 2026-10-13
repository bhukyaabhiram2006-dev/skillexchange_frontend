import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import FilterPanel from '../components/common/FilterPanel';
import SkillCard from '../components/skills/SkillCard';
import PostSkillModal from '../components/skills/PostSkillModal';
import EmptyState from '../components/common/EmptyState';
import { useExchanges } from '../context/ExchangeContext';
import { LayoutGrid, List, Plus, Sparkles, Filter } from 'lucide-react';

export default function ExploreSkillsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { allSkills } = useExchanges();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isPostSkillOpen, setIsPostSkillOpen] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all' && skill.category !== selectedCategory) {
        return false;
      }

      // Difficulty level filter
      if (selectedLevel && skill.level !== selectedLevel) {
        return false;
      }

      // Format filter
      if (selectedFormat && skill.format !== selectedFormat) {
        return false;
      }

      // Keyword search (title, description, tags, instructor name, lookingFor)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = skill.title.toLowerCase().includes(query);
        const matchesDesc = skill.description.toLowerCase().includes(query);
        const matchesInstructor = skill.studentName.toLowerCase().includes(query);
        const matchesTags = skill.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesLooking = skill.lookingFor?.toLowerCase().includes(query);

        if (!matchesTitle && !matchesDesc && !matchesInstructor && !matchesTags && !matchesLooking) {
          return false;
        }
      }

      return true;
    });
  }, [allSkills, searchQuery, selectedCategory, selectedLevel, selectedFormat]);

  const hasActiveFilters = Boolean(
    (selectedCategory && selectedCategory !== 'all') || selectedLevel || selectedFormat || searchQuery
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('');
    setSelectedFormat('');
    setSearchParams({});
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Explore Skills Marketplace
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse skills offered by fellow students across campuses and request peer exchanges.
          </p>
        </div>

        <button
          onClick={() => setIsPostSkillOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Offer Your Skill</span>
        </button>
      </div>

      {/* Search & View Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search by skill name, topic, or reciprocal learning goal..."
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Mobile filter toggle button */}
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Filters</span>
          </button>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-50 text-indigo-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-50 text-indigo-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters sidebar + Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterPanel
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            selectedFormat={selectedFormat}
            onSelectFormat={setSelectedFormat}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Mobile Filter Drawer / Collapsible */}
        {showMobileFilter && (
          <div className="lg:hidden col-span-1">
            <FilterPanel
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              selectedFormat={selectedFormat}
              onSelectFormat={setSelectedFormat}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}

        {/* Skills Cards Grid / List */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-800">{filteredSkills.length}</strong> skills
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-indigo-600 hover:underline font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>

          {filteredSkills.length === 0 ? (
            <EmptyState
              title="No skills found matching your filters"
              description="Try clearing your search terms or picking a broader category."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} viewMode="list" />
              ))}
            </div>
          )}
        </div>
      </div>

      <PostSkillModal
        isOpen={isPostSkillOpen}
        onClose={() => setIsPostSkillOpen(false)}
      />
    </div>
  );
}
