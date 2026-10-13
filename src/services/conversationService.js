import api from './apiClient';

/**
 * Normalizes backend conversation to frontend format
 */
export function normalizeConversation(conv) {
  if (!conv) return null;
  return {
    id: conv.id?.toString(),
    participantId: conv.otherParticipantId?.toString(),
    participantName: conv.otherParticipantName || conv.title || 'Peer',
    participantAvatar: conv.otherParticipantAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    participantCollege: conv.otherParticipantCollege || 'University',
    isOnline: true,
    lastSeen: 'Active now',
    exchangeTopic: conv.title || 'Skill Exchange',
    unreadCount: conv.unreadCount || 0,
    lastMessage: conv.lastMessageText || '',
    lastMessageTime: conv.lastMessageAt,
    messages: [],
  };
}

/**
 * Normalizes backend message to frontend format
 */
export function normalizeMessage(msg) {
  if (!msg) return null;
  const sentDate = msg.sentAt ? new Date(msg.sentAt) : new Date();
  return {
    id: msg.id?.toString(),
    senderId: msg.senderId?.toString(),
    senderName: msg.senderName,
    senderAvatar: msg.senderAvatarUrl,
    text: msg.content,
    timestamp: sentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: sentDate.toLocaleDateString(),
    isRead: msg.isRead,
  };
}

export const conversationService = {
  async getConversations() {
    const list = await api.get('/conversations');
    return Array.isArray(list) ? list.map(normalizeConversation) : [];
  },

  async getMessages(conversationId) {
    const list = await api.get(`/conversations/${conversationId}/messages`);
    return Array.isArray(list) ? list.map(normalizeMessage) : [];
  },

  async sendMessage(conversationId, text) {
    const res = await api.post(`/conversations/${conversationId}/messages`, { content: text });
    return normalizeMessage(res);
  },

  async startConversation(otherUserId, title = 'Skill Exchange') {
    const res = await api.post('/conversations', {
      title,
      participantIds: [Number(otherUserId)],
    });
    return normalizeConversation(res);
  },
};

export default conversationService;
