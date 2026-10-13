import React, { useState } from 'react';
import ExchangeCard from '../components/exchanges/ExchangeCard';
import ScheduleSessionModal from '../components/exchanges/ScheduleSessionModal';
import EmptyState from '../components/common/EmptyState';
import { useExchanges } from '../context/ExchangeContext';
import { ArrowLeftRight, Clock, CheckCircle2, AlertCircle, Plus, Calendar } from 'lucide-react';

export default function SkillExchangesPage() {
  const { exchanges } = useExchanges();
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'pending', 'completed', 'all'
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const pendingExchanges = exchanges.filter((e) => e.status === 'pending');
  const activeExchanges = exchanges.filter((e) => e.status === 'active');
  const completedExchanges = exchanges.filter((e) => e.status === 'completed');

  const filteredExchanges = exchanges.filter((e) => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  const tabs = [
    { id: 'active', label: 'Active Exchanges', count: activeExchanges.length, icon: ArrowLeftRight },
    { id: 'pending', label: 'Pending Proposals', count: pendingExchanges.length, icon: Clock },
    { id: 'completed', label: 'Completed', count: completedExchanges.length, icon: CheckCircle2 },
    { id: 'all', label: 'All History', count: exchanges.length, icon: Calendar },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            My Skill Exchanges
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track your ongoing peer mentoring partnerships, accept incoming requests, and manage session progress.
          </p>
        </div>

        {activeExchanges.length > 0 && (
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Exchanges List Grid */}
      {filteredExchanges.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title={`No ${activeTab} skill exchanges`}
          description={
            activeTab === 'pending'
              ? 'You have no pending requests at this time. Explore student profiles to send a new proposal!'
              : activeTab === 'active'
              ? 'No active exchanges currently. Check your pending tab or connect with recommended student partners.'
              : 'Completed exchanges will appear here once you and your partners conclude your learning cycles.'
          }
          actionLabel="Explore Student Profiles"
          onAction={() => (window.location.href = '/students')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExchanges.map((exchange) => (
            <ExchangeCard key={exchange.id} exchange={exchange} />
          ))}
        </div>
      )}

      <ScheduleSessionModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />
    </div>
  );
}
