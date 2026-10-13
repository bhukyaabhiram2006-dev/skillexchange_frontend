import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';

function renderWithProviders(ui) {
  return render(
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

describe('Authentication Form Validation Flows', () => {
  it('displays error messages when submitting empty login fields', () => {
    renderWithProviders(<LoginPage />);

    const submitBtn = screen.getByRole('button', { name: /Sign In to Dashboard/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  it('validates invalid email format on login', () => {
    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/alex@stanford.edu/i);
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });

    const submitBtn = screen.getByRole('button', { name: /Sign In to Dashboard/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Please enter a valid email format/i)).toBeInTheDocument();
  });

  it('validates password mismatch on signup', () => {
    renderWithProviders(<SignUpPage />);

    const nameInput = screen.getByPlaceholderText(/Maya Lin/i);
    const emailInput = screen.getByPlaceholderText(/maya@mit.edu/i);
    const collegeInput = screen.getByPlaceholderText(/UC Berkeley/i);
    const courseInput = screen.getByPlaceholderText(/Major \(e.g. CS\)/i);
    const passwordInput = screen.getByPlaceholderText(/Min 6 characters/i);
    const confirmInput = screen.getByPlaceholderText(/Repeat password/i);

    fireEvent.change(nameInput, { target: { value: 'Maya Lin' } });
    fireEvent.change(emailInput, { target: { value: 'maya@mit.edu' } });
    fireEvent.change(collegeInput, { target: { value: 'MIT' } });
    fireEvent.change(courseInput, { target: { value: 'Computer Science' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });
    fireEvent.change(confirmInput, { target: { value: 'wrongpass' } });

    const submitBtn = screen.getByRole('button', { name: /Complete Registration/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });
});
