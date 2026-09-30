import * as React from 'react';
import { afterEach, beforeEach, it, expect, vi } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
const mock = vi.hoisted(() => ({ callback: null, unsubscribe: vi.fn(), load: vi.fn(), initialize: vi.fn() }));
vi.mock('./firebase-config', () => ({ app: {} }));
vi.mock('firebase/auth', () => ({ getAuth: () => ({}), onAuthStateChanged: (_, callback) => { mock.callback = callback; return mock.unsubscribe; } }));
vi.mock('./model/firebase', () => ({ initializeUser: mock.initialize, loadDashboardData: mock.load }));
vi.mock('./pages/Login', () => ({ default: () => <div>Login page</div> }));
vi.mock('./pages/Home', () => ({ default: () => <div>Home page</div> }));
vi.mock('./pages/EditOrder', () => ({ default: () => <div>Edit page</div> }));
import App from './App';
beforeEach(() => { vi.clearAllMocks(); mock.load.mockResolvedValue([]); window.location.hash = '#/'; });
afterEach(cleanup);
it('redirects anonymous direct links to login without loading private data', async () => {
  window.location.hash = '#/edit'; render(<App />);
  await act(async () => mock.callback(null));
  expect(await screen.findByText('Login page')).toBeInTheDocument(); expect(mock.load).not.toHaveBeenCalled();
});
it('waits for data on an authenticated direct link and unsubscribes on unmount', async () => {
  window.location.hash = '#/edit'; let finish; mock.load.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const view = render(<App />); await act(async () => mock.callback({ uid: 'u', email: 'u@example.com' }));
  expect(screen.queryByText('Edit page')).not.toBeInTheDocument();
  await act(async () => finish([])); expect(await screen.findByText('Edit page')).toBeInTheDocument();
  view.unmount(); expect(mock.unsubscribe).toHaveBeenCalledTimes(1);
});
it('offers retry for a failed initial read', async () => {
  mock.load.mockRejectedValueOnce(new Error('denied')).mockResolvedValue([]);
  render(<App />); await act(async () => mock.callback({ uid: 'u', email: 'u@example.com' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('資料載入失敗');
  await act(async () => screen.getByRole('button', { name: '重試' }).click());
  expect(await screen.findByText('Home page')).toBeInTheDocument();
});
