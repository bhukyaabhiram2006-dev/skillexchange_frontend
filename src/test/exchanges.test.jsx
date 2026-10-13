import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { ExchangeProvider } from '../context/ExchangeContext';
import { MessageProvider } from '../context/MessageContext';
import SkillCard from '../components/skills/SkillCard';
import ExchangeCard from '../components/exchanges/ExchangeCard';

function renderWithAllProviders(ui) {
  return render(
    <ToastProvider>
      <AuthProvider>
        <ExchangeProvider>
          <MessageProvider>
            <BrowserRouter>{ui}</BrowserRouter>
          </MessageProvider>
        </ExchangeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

describe('Exchanges and Skills Interaction Components', () => {
  it('renders SkillCard with title, level, and tags', () => {
    const mockSkill = {
      id: 'skill-test-1',
      title: 'Python for Beginners & Scripting',
      description: 'Learn fundamentals and scripting',
      category: 'programming',
      level: 'Beginner',
      format: '1-on-1 Mentoring',
      studentId: 'student-1',
      studentName: 'Sophia Chen',
      studentAvatar: '',
      college: 'Stanford University',
      rating: 5.0,
      exchangeCount: 10,
      tags: ['Python', 'Scripts'],
      lookingFor: 'Figma UI/UX',
    };

    renderWithAllProviders(<SkillCard skill={mockSkill} viewMode="grid" />);

    expect(screen.getByText('Python for Beginners & Scripting')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('#Python')).toBeInTheDocument();
    expect(screen.getByText(/Request Exchange/i)).toBeInTheDocument();
  });

  it('renders ExchangeCard with partner info and status badge', () => {
    const mockExchange = {
      id: 'exch-test-1',
      partnerId: 'p-1',
      partnerName: 'Sophia Chen',
      partnerAvatar: '',
      partnerCollege: 'Stanford University',
      status: 'active',
      skillTeaching: 'Python Scripts',
      skillLearning: 'Figma UI Design',
      exchangeMode: 'Online (Zoom)',
      nextSessionDate: 'Tomorrow at 4:00 PM',
      completedSessions: 2,
      totalPlannedSessions: 4,
      dateInitiated: '2026-10-01',
    };

    renderWithAllProviders(<ExchangeCard exchange={mockExchange} />);

    expect(screen.getByText('Sophia Chen')).toBeInTheDocument();
    expect(screen.getByText('Python Scripts')).toBeInTheDocument();
    expect(screen.getByText('Figma UI Design')).toBeInTheDocument();
    expect(screen.getByText('Active Exchange')).toBeInTheDocument();
  });
});
