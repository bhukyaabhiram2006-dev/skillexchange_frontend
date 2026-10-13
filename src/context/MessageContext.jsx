import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_CONVERSATIONS } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useToast } from './ToastContext';
import conversationService from '../services/conversationService';
import { getStoredToken } from '../services/apiClient';

const MessageContext = createContext(null);

const STORAGE_KEY_CONVERSATIONS = 'skill_exchange_conversations';

export function MessageProvider({ children }) {
  const { addToast } = useToast();

  const [conversations, setConversations] = useState(() => {
    return loadFromStorage(STORAGE_KEY_CONVERSATIONS, MOCK_CONVERSATIONS);
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    return conversations[0]?.id || 'conv-1';
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEY_CONVERSATIONS, conversations);
  }, [conversations]);

  // Sync conversations from backend if authenticated
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      conversationService
        .getConversations()
        .then((backendConvs) => {
          if (backendConvs && backendConvs.length > 0) {
            setConversations((prev) => {
              const backendIds = new Set(backendConvs.map((c) => c.id));
              const localUnique = prev.filter((c) => !backendIds.has(c.id));
              return [...backendConvs, ...localUnique];
            });
          }
        })
        .catch(() => {
          // Keep local mock conversations on offline/error
        });
    }
  }, []);

  // Send a message in active or target conversation
  const sendMessage = (convId, text, currentUser) => {
    if (!text || !text.trim()) return;

    const trimmed = text.trim();
    const newMsg = {
      id: 'msg-' + Date.now(),
      senderId: currentUser?.id || 'user-current',
      senderName: currentUser?.name || 'Alex Morgan',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            unreadCount: 0,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Backend synchronization if authenticated
    if (getStoredToken() && !convId.startsWith('conv-')) {
      conversationService.sendMessage(convId, trimmed).catch((e) => {
        console.warn('Could not post message to backend', e);
      });
    }

    // Simulated responsive demo partner reply for mock conversations
    const targetConv = conversations.find((c) => c.id === convId);
    if (targetConv && convId.startsWith('conv-')) {
      setTimeout(() => {
        const replies = [
          `Thanks for the update! That sounds perfect for our exchange plan.`,
          `Got it! I will review the notes and see you during our scheduled session.`,
          `Awesome question! Let me pull up some examples we can walkthrough together.`,
          `Great progress! Looking forward to diving into this during our next practice.`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const partnerReply = {
          id: 'msg-reply-' + Date.now(),
          senderId: targetConv.participantId,
          senderName: targetConv.participantName,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: 'Today',
        };

        setConversations((latest) =>
          latest.map((c) => {
            if (c.id === convId) {
              return {
                ...c,
                messages: [...c.messages, partnerReply],
              };
            }
            return c;
          })
        );
      }, 1400);
    }
  };

  // Start or open existing conversation with a student
  const startConversationWithStudent = async (student, initialTopic = '') => {
    const existing = conversations.find((c) => c.participantId === student.id);
    if (existing) {
      setActiveConversationId(existing.id);
      return existing.id;
    }

    // Attempt backend start if authenticated and numeric student id
    if (getStoredToken() && !isNaN(Number(student.userId || student.id))) {
      try {
        const partnerUserId = student.userId || student.id;
        const topic = initialTopic || `${student.skillsOffered?.[0]?.name || 'Skill'} Exchange`;
        const backendConv = await conversationService.startConversation(partnerUserId, topic);
        if (backendConv?.id) {
          setConversations((prev) => [backendConv, ...prev]);
          setActiveConversationId(backendConv.id);
          addToast(`Conversation started with ${student.name}`, 'info');
          return backendConv.id;
        }
      } catch (e) {
        console.warn('Could not start conversation on backend', e);
      }
    }

    const newConvId = 'conv-' + Date.now();
    const newConversation = {
      id: newConvId,
      participantId: student.id,
      participantName: student.name,
      participantAvatar: student.avatar,
      participantCollege: student.college,
      isOnline: true,
      lastSeen: 'Active now',
      exchangeTopic: initialTopic || `${student.skillsOffered?.[0]?.name || 'Skill'} Exchange`,
      unreadCount: 0,
      messages: [
        {
          id: 'msg-welcome-' + Date.now(),
          senderId: student.id,
          senderName: student.name,
          text: `Hi Alex! Thanks for connecting. I'd love to discuss exchanging skills!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: 'Today',
        },
      ],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConvId);
    addToast(`Conversation started with ${student.name}`, 'info');
    return newConvId;
  };

  const markConversationAsRead = (convId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
  };

  return (
    <MessageContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startConversationWithStudent,
        markConversationAsRead,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}
