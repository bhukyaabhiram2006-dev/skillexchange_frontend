import { describe, it, expect } from 'vitest';
import {
  normalizeSkill,
  isSkillMatch,
  calculateMatch,
  rankStudentsForUser,
} from '../utils/matchingAlgorithm';

describe('Skill Exchange Matching Algorithm', () => {
  it('normalizes skill names accurately', () => {
    expect(normalizeSkill('UI/UX Design')).toBe('ui ux design');
    expect(normalizeSkill('  Python 3  ')).toBe('python 3');
    expect(normalizeSkill('Git & GitHub')).toBe('git github');
  });

  it('detects direct and semantic skill matches', () => {
    expect(isSkillMatch('Python', 'Python')).toBe(true);
    expect(isSkillMatch('React', 'Web Development')).toBe(true);
    expect(isSkillMatch('Figma', 'UI/UX Design')).toBe(true);
    expect(isSkillMatch('French', 'Python')).toBe(false);
  });

  it('computes mutual exchange match with high score and reason', () => {
    const user = {
      id: 'u1',
      college: 'Stanford University',
      skillsOffered: [{ name: 'Python' }, { name: 'React' }],
      skillsDesired: [{ name: 'UI/UX Design' }, { name: 'Figma' }],
    };

    const peerMutual = {
      id: 'p1',
      name: 'Sophia Chen',
      college: 'Stanford University',
      skillsOffered: [{ name: 'UI/UX Design' }, { name: 'Figma' }],
      skillsDesired: [{ name: 'Python' }],
    };

    const match = calculateMatch(user, peerMutual);
    expect(match.score).toBeGreaterThanOrEqual(90);
    expect(match.isMutual).toBe(true);
    expect(match.label).toBe('Mutual Match');
    expect(match.theyTeachWhatYouWant).toContain('UI/UX Design');
    expect(match.theyWantWhatYouTeach).toContain('Python');
    expect(match.explanation).toContain('Mutual Match');
  });

  it('computes one-way learning match appropriately', () => {
    const user = {
      id: 'u1',
      college: 'Stanford University',
      skillsOffered: [{ name: 'Spanish' }],
      skillsDesired: [{ name: 'Data Science' }],
    };

    const peer = {
      id: 'p2',
      name: 'Marcus Vance',
      college: 'UC Berkeley',
      skillsOffered: [{ name: 'Data Science' }],
      skillsDesired: [{ name: 'Rust' }],
    };

    const match = calculateMatch(user, peer);
    expect(match.isMutual).toBe(false);
    expect(match.score).toBeGreaterThanOrEqual(60);
    expect(match.score).toBeLessThan(90);
    expect(match.theyTeachWhatYouWant).toContain('Data Science');
  });

  it('ranks multiple peer students by compatibility descending', () => {
    const user = {
      id: 'u1',
      college: 'Stanford University',
      skillsOffered: [{ name: 'React' }],
      skillsDesired: [{ name: 'Figma' }],
    };

    const peers = [
      {
        id: 'p1',
        name: 'Peer NonMatch',
        college: 'NYU',
        skillsOffered: [{ name: 'Gardening' }],
        skillsDesired: [{ name: 'Singing' }],
      },
      {
        id: 'p2',
        name: 'Peer Mutual',
        college: 'Stanford University',
        skillsOffered: [{ name: 'Figma' }],
        skillsDesired: [{ name: 'React' }],
      },
    ];

    const ranked = rankStudentsForUser(user, peers);
    expect(ranked[0].id).toBe('p2');
    expect(ranked[0].match.isMutual).toBe(true);
    expect(ranked[1].id).toBe('p1');
  });
});
