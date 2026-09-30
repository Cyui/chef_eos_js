import * as React from 'react';
import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
vi.mock('../../../firebase-config', () => ({ app: {} }));
vi.mock('firebase/auth', () => ({ getAuth: () => ({}), signInWithEmailAndPassword: vi.fn().mockRejectedValue(new Error('user-not-found')) }));
import SignIn from './SignIn';
it('shows generic failure, clears both inputs, and focuses the enabled email field', async () => {
  render(<MemoryRouter><SignIn /></MemoryRouter>);
  const email = screen.getByLabelText(/Email Address/); const password = screen.getByLabelText(/Password/);
  fireEvent.change(email, { target: { value: 'wrong@example.com' } }); fireEvent.change(password, { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('登入失敗，請確認帳號與密碼後再試一次。');
  await waitFor(() => expect(email).toHaveFocus()); expect(email).toHaveValue(''); expect(password).toHaveValue(''); expect(email).not.toBeDisabled();
  expect(screen.queryByText(/user-not-found/)).not.toBeInTheDocument();
});
