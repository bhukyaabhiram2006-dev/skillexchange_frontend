import api from './apiClient';

/**
 * Normalizes backend proposal to frontend exchange item
 */
export function normalizeProposal(proposal, currentUserId) {
  if (!proposal) return null;
  const isOutgoing = currentUserId && proposal.proposerId?.toString() === currentUserId.toString();
  const partnerId = isOutgoing ? proposal.receiverId : proposal.proposerId;
  const partnerName = isOutgoing ? proposal.receiverName : proposal.proposerName;
  const partnerAvatar = isOutgoing ? proposal.receiverAvatarUrl : proposal.proposerAvatarUrl;
  const partnerCollege = isOutgoing ? proposal.receiverCollege : proposal.proposerCollege;

  const skillTeaching = isOutgoing ? proposal.skillOfferedName : proposal.skillRequestedName;
  const skillLearning = isOutgoing ? proposal.skillRequestedName : proposal.skillOfferedName;

  return {
    id: `prop-${proposal.id}`,
    proposalId: proposal.id,
    partnerId: partnerId?.toString(),
    partnerName: partnerName || 'Student Partner',
    partnerAvatar: partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    partnerCollege: partnerCollege || 'University',
    status: proposal.status?.toLowerCase() === 'pending' ? 'pending' : proposal.status?.toLowerCase(),
    skillTeaching: skillTeaching || 'Skill',
    skillLearning: skillLearning || 'Reciprocal Skill',
    exchangeMode: proposal.exchangeMode || 'Online',
    nextSessionDate: isOutgoing ? 'Awaiting partner response' : 'Awaiting your response',
    completedSessions: 0,
    totalPlannedSessions: 4,
    lastActivity: proposal.message || (isOutgoing ? 'You sent an exchange proposal' : 'Partner sent an exchange proposal'),
    dateInitiated: proposal.createdAt ? proposal.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    requestType: isOutgoing ? 'outgoing' : 'incoming',
    proposalMessage: proposal.message,
  };
}

/**
 * Normalizes backend exchange to frontend exchange item
 */
export function normalizeExchange(exchange) {
  if (!exchange) return null;
  const statusLower = (exchange.status || 'ACTIVE').toLowerCase();
  const uiStatus = statusLower === 'scheduled' || statusLower === 'in_progress' ? 'active' : statusLower;

  return {
    id: `exch-${exchange.id}`,
    exchangeId: exchange.id,
    proposalId: exchange.proposalId,
    partnerId: exchange.partnerId?.toString(),
    partnerName: exchange.partnerName || 'Partner',
    partnerAvatar: exchange.partnerAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    partnerCollege: exchange.partnerCollege || 'University',
    status: uiStatus,
    skillTeaching: exchange.skillTaughtName || 'Skill',
    skillLearning: exchange.skillLearnedName || 'Skill',
    exchangeMode: exchange.mode || 'Online',
    nextSessionDate: exchange.scheduledAt || (uiStatus === 'active' ? 'Schedule your next session' : `Completed on ${exchange.completedAt || 'recent'}`),
    completedSessions: exchange.completedSessions || 0,
    totalPlannedSessions: exchange.totalSessions || 4,
    lastActivity: exchange.lastActivity || 'Active exchange',
    dateInitiated: exchange.initiatedAt ? exchange.initiatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
    meetingDetails: exchange.meetingDetails,
  };
}

export const exchangeService = {
  // Get all user exchanges (both active and historical)
  async getExchanges(status) {
    const endpoint = status ? `/exchanges?status=${status}` : '/exchanges';
    const list = await api.get(endpoint);
    return Array.isArray(list) ? list.map(normalizeExchange) : [];
  },

  // Get user exchange proposals (pending)
  async getProposals(type) {
    const endpoint = type ? `/proposals?type=${type}` : '/proposals';
    const list = await api.get(endpoint);
    return Array.isArray(list) ? list : [];
  },

  // Combined fetch of proposals and active exchanges for the user dashboard/exchanges page
  async getAllUserExchanges(currentUserId) {
    const [proposals, exchanges] = await Promise.all([
      api.get('/proposals').catch(() => []),
      api.get('/exchanges').catch(() => []),
    ]);

    const normalizedProposals = (Array.isArray(proposals) ? proposals : [])
      .filter((p) => p.status === 'PENDING')
      .map((p) => normalizeProposal(p, currentUserId));

    const normalizedExchanges = (Array.isArray(exchanges) ? exchanges : [])
      .map(normalizeExchange);

    return [...normalizedProposals, ...normalizedExchanges];
  },

  // Send proposal / request exchange
  async sendExchangeProposal({
    receiverId,
    skillOfferedId,
    skillOfferedName,
    skillRequestedId,
    skillRequestedName,
    message,
    exchangeMode,
  }) {
    const payload = {
      receiverId: receiverId ? Number(receiverId) : undefined,
      skillOfferedId: skillOfferedId ? Number(skillOfferedId) : undefined,
      skillOfferedName,
      skillRequestedId: skillRequestedId ? Number(skillRequestedId) : undefined,
      skillRequestedName,
      message,
      exchangeMode: exchangeMode || 'ONLINE',
    };
    return await api.post('/proposals', payload);
  },

  // Respond to proposal (accept or reject)
  async respondToProposal(proposalId, accept, responseMessage = '') {
    return await api.put(`/proposals/${proposalId}/respond`, {
      accept,
      responseMessage,
    });
  },

  // Cancel proposal
  async cancelProposal(proposalId) {
    return await api.put(`/proposals/${proposalId}/cancel`);
  },

  // Complete exchange
  async completeExchange(exchangeId, reviewRating = 5, reviewComment = '') {
    return await api.put(`/exchanges/${exchangeId}/complete`, {
      reviewRating,
      reviewComment,
    });
  },

  // Cancel exchange
  async cancelExchange(exchangeId, reason = 'Cancelled by student') {
    return await api.put(`/exchanges/${exchangeId}/cancel`, { reason });
  },
};

export default exchangeService;
