/**
 * Skill Exchange Matching Algorithm
 * Calculates compatibility score, match tier, and explanatory reasons
 * between the current logged-in student and peer students.
 */

// Helper to normalize skill names for comparison (e.g., 'ui/ux design' -> 'ui ux design')
export function normalizeSkill(skillName) {
  if (!skillName) return '';
  return skillName
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Checks if skill A roughly or strictly matches skill B
export function isSkillMatch(skillA, skillB) {
  const normA = normalizeSkill(skillA);
  const normB = normalizeSkill(skillB);

  if (normA === normB) return true;
  if (normA.includes(normB) || normB.includes(normA)) return true;

  // Synonyms and special domain overlaps
  const synonyms = [
    ['react', 'web development', 'frontend', 'javascript'],
    ['ui ux design', 'figma', 'product design', 'user research', 'design systems'],
    ['python', 'programming', 'automation', 'scripting'],
    ['data science', 'sql', 'pandas', 'machine learning', 'statistics'],
    ['video editing', 'davinci resolve', 'premiere pro', 'film'],
    ['graphic design', 'illustrator', 'photoshop', 'branding', 'typography'],
  ];

  for (const group of synonyms) {
    const hasA = group.some(item => normA.includes(item) || item.includes(normA));
    const hasB = group.some(item => normB.includes(item) || item.includes(normB));
    if (hasA && hasB) return true;
  }

  return false;
}

/**
 * Calculates match between current student and a candidate peer
 */
export function calculateMatch(currentUser, peer) {
  if (!currentUser || !peer || currentUser.id === peer.id) {
    return {
      score: 0,
      label: 'Self',
      isMutual: false,
      theyTeachWhatYouWant: [],
      theyWantWhatYouTeach: [],
      explanation: 'Current profile',
    };
  }

  // Extract skill names
  const userWants = (currentUser.skillsDesired || []).map(s => typeof s === 'string' ? s : s.name);
  const userTeaches = (currentUser.skillsOffered || []).map(s => typeof s === 'string' ? s : s.name);

  const peerTeaches = (peer.skillsOffered || []).map(s => typeof s === 'string' ? s : s.name);
  const peerWants = (peer.skillsDesired || []).map(s => typeof s === 'string' ? s : s.name);

  // 1. Peer teaches skills current user wants to learn (Direct match)
  const theyTeachWhatYouWant = peerTeaches.filter(pTeach =>
    userWants.some(uWant => isSkillMatch(pTeach, uWant))
  );

  // 2. Peer wants skills current user can teach (Mutual return match)
  const theyWantWhatYouTeach = peerWants.filter(pWant =>
    userTeaches.some(uTeach => isSkillMatch(pWant, uTeach))
  );

  let score = 25; // baseline interest
  let isMutual = false;
  let explanation = '';

  const hasLearningMatch = theyTeachWhatYouWant.length > 0;
  const hasTeachingMatch = theyWantWhatYouTeach.length > 0;

  if (hasLearningMatch && hasTeachingMatch) {
    // Perfect mutual exchange!
    isMutual = true;
    score = 88 + Math.min(theyTeachWhatYouWant.length * 4 + theyWantWhatYouTeach.length * 3, 10);
    if (currentUser.college === peer.college) score += 2;
    score = Math.min(score, 99);

    explanation = `Mutual Match: ${peer.name.split(' ')[0]} teaches ${theyTeachWhatYouWant[0]} (you want to learn) & wants ${theyWantWhatYouTeach[0]} (you teach).`;
  } else if (hasLearningMatch) {
    // Peer can teach what user wants
    score = 65 + Math.min(theyTeachWhatYouWant.length * 5, 15);
    if (currentUser.college === peer.college) score += 3;
    score = Math.min(score, 85);

    explanation = `${peer.name.split(' ')[0]} teaches ${theyTeachWhatYouWant.join(', ')} matching your learning goals.`;
  } else if (hasTeachingMatch) {
    // Peer wants what user can teach
    score = 50 + Math.min(theyWantWhatYouTeach.length * 5, 12);
    score = Math.min(score, 68);

    explanation = `${peer.name.split(' ')[0]} wants to learn ${theyWantWhatYouTeach.join(', ')} which you can mentor.`;
  } else {
    // Weak or general interest
    if (currentUser.college === peer.college) score += 15;
    score = Math.min(score, 45);
    explanation = `Fellow student at ${peer.college} with popular skill offerings.`;
  }

  let label = 'Potential Match';
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';

  if (score >= 90) {
    label = 'Mutual Match';
    badgeColor = 'bg-violet-100 text-violet-800 border-violet-200';
  } else if (score >= 75) {
    label = 'High Match';
    badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
  } else if (score >= 60) {
    label = 'Good Match';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  }

  return {
    score,
    label,
    isMutual,
    theyTeachWhatYouWant,
    theyWantWhatYouTeach,
    explanation,
    badgeColor,
  };
}

/**
 * Ranks all peer students for current user
 */
export function rankStudentsForUser(currentUser, students) {
  if (!students || !Array.isArray(students)) return [];

  return students
    .filter(s => s.id !== currentUser.id)
    .map(peer => {
      const match = calculateMatch(currentUser, peer);
      return {
        ...peer,
        match,
      };
    })
    .sort((a, b) => b.match.score - a.match.score);
}
