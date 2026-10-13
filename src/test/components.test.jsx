import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileAvatar from '../components/common/ProfileAvatar';
import Badge from '../components/common/Badge';
import StatCard from '../components/common/StatCard';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import { BookOpen } from 'lucide-react';

describe('Reusable Common Components', () => {
  it('renders ProfileAvatar with fallback initials when no image provided', () => {
    render(<ProfileAvatar name="Jordan Lee" size="md" />);
    expect(screen.getByText('JL')).toBeInTheDocument();
  });

  it('renders Badge with custom label and variant', () => {
    render(<Badge variant="emerald">Active Exchange</Badge>);
    expect(screen.getByText('Active Exchange')).toBeInTheDocument();
  });

  it('renders StatCard with title, value, and subtitle', () => {
    render(
      <StatCard
        title="Skills Offered"
        value={5}
        subtitle="Skills you can teach"
        icon={BookOpen}
        variant="indigo"
      />
    );
    expect(screen.getByText('Skills Offered')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Skills you can teach')).toBeInTheDocument();
  });

  it('handles typing and clearing in SearchBar', () => {
    const handleClear = vi.fn();
    const handleChange = vi.fn();

    render(
      <SearchBar
        value="Python"
        onChange={handleChange}
        onClear={handleClear}
        placeholder="Search skills..."
      />
    );

    const input = screen.getByPlaceholderText('Search skills...');
    expect(input.value).toBe('Python');

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('renders EmptyState with call to action', () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        title="No results found"
        description="Try different keywords"
        actionLabel="Reset Search"
        onAction={onAction}
      />
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
    const actionBtn = screen.getByText('Reset Search');
    fireEvent.click(actionBtn);
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
