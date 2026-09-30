import * as React from 'react';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
const mock = vi.hoisted(() => ({ navigate: vi.fn(), refresh: vi.fn(), select: vi.fn(), add: vi.fn() }));
vi.mock('react-router-dom', () => ({ useNavigate: () => mock.navigate }));
vi.mock('../../model/firebase', () => ({ YearSelected: '2025y', refreshYearSettings: mock.refresh, changeSelectedYear: mock.select, addYear: mock.add }));
// Keep display/validation real, avoid bootstrapping Firebase in this UI test.
vi.mock('../../firebase-config', () => ({ app: {} }));
vi.mock('firebase/auth', () => ({ getAuth: () => ({}) }));
vi.mock('firebase/firestore', () => ({ getFirestore: () => ({}), doc: vi.fn(), collection: vi.fn(), getDoc: vi.fn(), getDocs: vi.fn(), query: vi.fn(), limit: vi.fn(), runTransaction: vi.fn() }));
import YearSettings from './index';
beforeEach(() => { vi.clearAllMocks(); mock.refresh.mockResolvedValue({ year_selected: '2025y', years_available: ['2025y', '2026y'] }); mock.select.mockResolvedValue(); mock.add.mockResolvedValue(); });
afterEach(cleanup);
it('shows years without suffix and persists the chosen database key', async () => {
  render(<YearSettings />); await waitFor(() => expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-disabled', 'true'));
  fireEvent.mouseDown(screen.getByRole('combobox')); fireEvent.click(await screen.findByRole('option', { name: '2026' }));
  fireEvent.click(screen.getByRole('button', { name: '切換年度' }));
  await waitFor(() => expect(mock.select).toHaveBeenCalledWith('2026y')); expect(mock.navigate).toHaveBeenCalledWith('/', { replace: true });
  expect(screen.queryByText('2026y')).not.toBeInTheDocument();
});
it('allows a new year even when the registered list is empty', async () => {
  mock.refresh.mockResolvedValue({ year_selected: '2025y', years_available: [] }); render(<YearSettings />);
  expect(await screen.findByText(/目前沒有可選年度/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('新年度'), { target: { value: '2028' } });
  fireEvent.click(screen.getByRole('button', { name: '新增並切換年度' }));
  await waitFor(() => expect(mock.add).toHaveBeenCalledWith('2028', { allowExisting: false }));
});
it('requires explicit adoption of an already existing year', async () => {
  mock.add.mockRejectedValueOnce(Object.assign(new Error('exists'), { code: 'year-exists' }));
  render(<YearSettings />); await waitFor(() => expect(screen.getByLabelText('新年度')).not.toBeDisabled());
  fireEvent.change(screen.getByLabelText('新年度'), { target: { value: '2028' } }); fireEvent.click(screen.getByRole('button', { name: '新增並切換年度' }));
  fireEvent.click(await screen.findByRole('button', { name: '加入並切換至 2028' }));
  await waitFor(() => expect(mock.add).toHaveBeenLastCalledWith('2028', { allowExisting: true }));
});
it('keeps the user on the page when a year change fails', async () => {
  mock.select.mockRejectedValueOnce(new Error('denied')); render(<YearSettings />);
  await waitFor(() => expect(screen.getByRole('button', { name: '切換年度' })).not.toBeDisabled());
  fireEvent.click(screen.getByRole('button', { name: '切換年度' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('年度設定失敗'); expect(mock.navigate).not.toHaveBeenCalled();
});
