import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_EXCHANGES, MOCK_UPCOMING_SESSIONS, MOCK_SKILLS } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useToast } from './ToastContext';
import exchangeService from '../services/exchangeService';
import skillService from '../services/skillService';
import { getStoredToken } from '../services/apiClient';

const ExchangeContext = createContext(null);

const STORAGE_KEY_EXCHANGES = 'skill_exchange_exchanges';
const STORAGE_KEY_SESSIONS = 'skill_exchange_sessions';
const STORAGE_KEY_SKILLS = 'skill_exchange_custom_skills';

export function ExchangeProvider({ children }) {
  const { addToast } = useToast();

  const [exchanges, setExchanges] = useState(() => {
    return loadFromStorage(STORAGE_KEY_EXCHANGES, MOCK_EXCHANGES);
  });

  const [upcomingSessions, setUpcomingSessions] = useState(() => {
    return loadFromStorage(STORAGE_KEY_SESSIONS, MOCK_UPCOMING_SESSIONS);
  });

  const [allSkills, setAllSkills] = useState(() => {
    const custom = loadFromStorage(STORAGE_KEY_SKILLS, []);
    return [...MOCK_SKILLS, ...custom];
  });

  // Synchronize data from Spring Boot backend if available
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      // Load marketplace skills from backend
      skillService
        .getSkills({ size: 50 })
        .then((res) => {
          if (res?.content && res.content.length > 0) {
            setAllSkills(res.content);
          }
        })
        .catch(() => {
          // Keep mock/local skills on connection error
        });

      // Load user proposals and exchanges from backend
      exchangeService
        .getAllUserExchanges()
        .then((backendExchanges) => {
          if (backendExchanges && backendExchanges.length > 0) {
            setExchanges((prev) => {
              // Combine backend exchanges with unique local ones
              const backendIds = new Set(backendExchanges.map((e) => e.id));
              const localUnique = prev.filter((e) => !backendIds.has(e.id));
              return [...backendExchanges, ...localUnique];
            });
          }
        })
        .catch(() => {
          // Keep mock/local exchanges on connection error
        });
    }
  }, []);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_EXCHANGES, exchanges);
  }, [exchanges]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_SESSIONS, upcomingSessions);
  }, [upcomingSessions]);

  // Send an exchange or connection request to another student
  const sendExchangeRequest = async ({
    partnerId,
    partnerName,
    partnerAvatar,
    partnerCollege,
    skillTeaching,
    skillLearning,
    exchangeMode = 'Online',
    proposalMessage = '',
  }) => {
    // Check if an exchange already exists with this partner
    const existing = exchanges.find(
      (e) => e.partnerId === partnerId && (e.status === 'pending' || e.status === 'active')
    );

    if (existing) {
      addToast(`You already have a ${existing.status} exchange with ${partnerName}!`, 'warning');
      return false;
    }

    const newExchange = {
      id: 'exch-' + Date.now(),
      partnerId,
      partnerName,
      partnerAvatar,
      partnerCollege,
      status: 'pending',
      skillTeaching,
      skillLearning,
      exchangeMode,
      nextSessionDate: 'Awaiting partner response',
      completedSessions: 0,
      totalPlannedSessions: 4,
      lastActivity: 'You sent an exchange proposal',
      dateInitiated: new Date().toISOString().split('T')[0],
      requestType: 'outgoing',
      proposalMessage,
    };

    setExchanges((prev) => [newExchange, ...prev]);
    addToast(`Skill exchange request sent to ${partnerName}!`, 'success');

    // Async sync with backend if token exists
    if (getStoredToken()) {
      try {
        const backendProp = await exchangeService.sendExchangeProposal({
          receiverId: partnerId,
          skillOfferedName: skillTeaching,
          skillRequestedName: skillLearning,
          message: proposalMessage,
          exchangeMode: exchangeMode.toUpperCase().includes('ONLINE') ? 'ONLINE' : 'IN_PERSON',
        });
        if (backendProp?.id) {
          setExchanges((prev) =>
            prev.map((e) => (e.id === newExchange.id ? { ...e, proposalId: backendProp.id } : e))
          );
        }
      } catch (e) {
        console.warn('Could not post proposal to backend', e);
      }
    }

    return true;
  };

  // Accept a pending incoming exchange
  const acceptExchange = async (exchangeId) => {
    const target = exchanges.find((e) => e.id === exchangeId);
    setExchanges((prev) =>
      prev.map((e) => {
        if (e.id === exchangeId) {
          return {
            ...e,
            status: 'active',
            nextSessionDate: 'Schedule your first session',
            lastActivity: 'Exchange accepted! Connect to schedule a time.',
          };
        }
        return e;
      })
    );
    addToast('Exchange request accepted! It is now in your Active exchanges.', 'success');

    if (getStoredToken() && target?.proposalId) {
      try {
        await exchangeService.respondToProposal(target.proposalId, true);
      } catch (e) {
        console.warn('Could not accept proposal on backend', e);
      }
    }
  };

  // Reject / decline a pending exchange
  const rejectExchange = async (exchangeId) => {
    const target = exchanges.find((e) => e.id === exchangeId);
    setExchanges((prev) => prev.filter((e) => e.id !== exchangeId));
    addToast('Exchange request declined.', 'info');

    if (getStoredToken() && target?.proposalId) {
      try {
        await exchangeService.respondToProposal(target.proposalId, false);
      } catch (e) {
        console.warn('Could not reject proposal on backend', e);
      }
    }
  };

  // Complete an active exchange
  const completeExchange = async (exchangeId, reviewRating = 5, reviewComment = '') => {
    const target = exchanges.find((e) => e.id === exchangeId);
    setExchanges((prev) =>
      prev.map((e) => {
        if (e.id === exchangeId) {
          return {
            ...e,
            status: 'completed',
            completedSessions: e.totalPlannedSessions,
            nextSessionDate: `Completed on ${new Date().toLocaleDateString()}`,
            lastActivity: 'Exchange marked complete',
            review: {
              rating: reviewRating,
              comment: reviewComment || 'Great exchange sessions! Highly recommended learning partner.',
            },
          };
        }
        return e;
      })
    );
    addToast('Skill exchange marked as completed! Congratulations!', 'success');

    if (getStoredToken() && target?.exchangeId) {
      try {
        await exchangeService.completeExchange(target.exchangeId, reviewRating, reviewComment);
      } catch (e) {
        console.warn('Could not complete exchange on backend', e);
      }
    }
  };

  // Cancel an active or pending exchange
  const cancelExchange = async (exchangeId) => {
    const target = exchanges.find((e) => e.id === exchangeId);
    setExchanges((prev) =>
      prev.map((e) => {
        if (e.id === exchangeId) {
          return {
            ...e,
            status: 'cancelled',
            lastActivity: 'Exchange was cancelled',
          };
        }
        return e;
      })
    );
    addToast('Exchange session has been cancelled.', 'info');

    if (getStoredToken()) {
      try {
        if (target?.exchangeId) {
          await exchangeService.cancelExchange(target.exchangeId);
        } else if (target?.proposalId) {
          await exchangeService.cancelProposal(target.proposalId);
        }
      } catch (e) {
        console.warn('Could not cancel exchange on backend', e);
      }
    }
  };

  // Schedule a new exchange session
  const scheduleSession = ({ exchangeId, title, date, time, platform, meetingLink }) => {
    const exchange = exchanges.find((e) => e.id === exchangeId);
    const newSession = {
      id: 'sess-' + Date.now(),
      title: title || `${exchange ? exchange.skillLearning : 'Skill'} Deep Dive`,
      partnerName: exchange ? exchange.partnerName : 'Partner',
      partnerAvatar: exchange ? exchange.partnerAvatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'Learning',
      date: date || 'Next Week',
      time: time || '4:00 PM - 5:00 PM',
      platform: platform || 'Zoom Meeting',
      meetingLink: meetingLink || 'https://zoom.us/j/demo-scheduled',
      status: 'confirmed',
    };

    setUpcomingSessions((prev) => [newSession, ...prev]);

    // Update exchange nextSessionDate
    if (exchangeId) {
      setExchanges((prev) =>
        prev.map((e) =>
          e.id === exchangeId
            ? { ...e, nextSessionDate: `${date} at ${time}` }
            : e
        )
      );
    }

    addToast(`Session scheduled with ${newSession.partnerName}!`, 'success');
    return newSession;
  };

  // Post a new skill offered by the user
  const postNewSkill = async (skillData, currentUser) => {
    const newSkill = {
      id: 'skill-' + Date.now(),
      title: skillData.title,
      description: skillData.description,
      category: skillData.category || 'programming',
      categoryName: skillData.categoryName || 'Programming',
      level: skillData.level || 'Intermediate',
      format: skillData.format || '1-on-1 Mentoring',
      studentId: currentUser?.id || 'user-current',
      studentName: currentUser?.name || 'Alex Morgan',
      studentAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      college: currentUser?.college || 'University',
      rating: 5.0,
      exchangeCount: 0,
      tags: skillData.tags || [],
      lookingFor: skillData.lookingFor || 'Any reciprocal skill',
    };

    const custom = loadFromStorage(STORAGE_KEY_SKILLS, []);
    saveToStorage(STORAGE_KEY_SKILLS, [newSkill, ...custom]);
    setAllSkills((prev) => [newSkill, ...prev]);
    addToast('Your new skill offering has been published!', 'success');

    if (getStoredToken()) {
      try {
        const backendSkill = await skillService.createSkill(skillData);
        if (backendSkill?.id) {
          setAllSkills((prev) =>
            prev.map((s) => (s.id === newSkill.id ? { ...backendSkill } : s))
          );
        }
      } catch (e) {
        console.warn('Could not save skill to backend', e);
      }
    }

    return newSkill;
  };

  return (
    <ExchangeContext.Provider
      value={{
        exchanges,
        upcomingSessions,
        allSkills,
        sendExchangeRequest,
        acceptExchange,
        rejectExchange,
        completeExchange,
        cancelExchange,
        scheduleSession,
        postNewSkill,
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
}

export function useExchanges() {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchanges must be used within an ExchangeProvider');
  }
  return context;
}
