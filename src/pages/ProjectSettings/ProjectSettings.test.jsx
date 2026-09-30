import * as React from 'react';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
const mock = vi.hoisted(() => ({ navigate: vi.fn(), refresh: vi.fn(), select: vi.fn(), add: vi.fn() }));
vi.mock('react-router-dom', () => ({ useNavigate: () => mock.navigate }));
vi.mock('../../model/firebase', () => ({ ProjectSelected: '2025y', refreshProjectSettings: mock.refresh, changeSelectedProject: mock.select, addProject: mock.add }));
// Keep display/validation real, avoid bootstrapping Firebase in this UI test.
vi.mock('../../firebase-config', () => ({ app: {} }));
vi.mock('firebase/auth', () => ({ getAuth: () => ({}) }));
vi.mock('firebase/firestore', () => ({ getFirestore: () => ({}), doc: vi.fn(), collection: vi.fn(), getDoc: vi.fn(), getDocs: vi.fn(), query: vi.fn(), limit: vi.fn(), runTransaction: vi.fn() }));
import ProjectSettings from './index';
beforeEach(() => { vi.clearAllMocks(); mock.refresh.mockResolvedValue({ project_selected: '2025y', projects_available: ['2025y', '2026y'] }); mock.select.mockResolvedValue(); mock.add.mockResolvedValue(); });
afterEach(cleanup);
it('shows project names verbatim and persists the chosen database key', async () => {
  render(<ProjectSettings />); await waitFor(() => expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-disabled', 'true'));
  fireEvent.mouseDown(screen.getByRole('combobox')); fireEvent.click(await screen.findByRole('option', { name: '2026y' }));
  fireEvent.click(screen.getByRole('button', { name: '切換專案' }));
  await waitFor(() => expect(mock.select).toHaveBeenCalledWith('2026y')); expect(mock.navigate).toHaveBeenCalledWith('/', { replace: true });
  expect(screen.getByRole('combobox')).toHaveTextContent('2026y');
});
it('allows a new project even when the registered list is empty', async () => {
  mock.refresh.mockResolvedValue({ project_selected: '2025y', projects_available: [] }); render(<ProjectSettings />);
  expect(await screen.findByText(/目前沒有可選專案/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('新專案'), { target: { value: '夏季活動' } });
  fireEvent.click(screen.getByRole('button', { name: '新增並切換專案' }));
  await waitFor(() => expect(mock.add).toHaveBeenCalledWith('夏季活動', { allowExisting: false }));
});
it('requires explicit adoption of an already existing project', async () => {
  mock.add.mockRejectedValueOnce(Object.assign(new Error('exists'), { code: 'project-exists' }));
  render(<ProjectSettings />); await waitFor(() => expect(screen.getByLabelText('新專案')).not.toBeDisabled());
  fireEvent.change(screen.getByLabelText('新專案'), { target: { value: '夏季活動' } }); fireEvent.click(screen.getByRole('button', { name: '新增並切換專案' }));
  fireEvent.click(await screen.findByRole('button', { name: '加入並切換至 夏季活動' }));
  await waitFor(() => expect(mock.add).toHaveBeenLastCalledWith('夏季活動', { allowExisting: true }));
});
it('keeps the user on the page when a project change fails', async () => {
  mock.select.mockRejectedValueOnce(new Error('denied')); render(<ProjectSettings />);
  await waitFor(() => expect(screen.getByRole('button', { name: '切換專案' })).not.toBeDisabled());
  fireEvent.click(screen.getByRole('button', { name: '切換專案' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('專案設定失敗'); expect(mock.navigate).not.toHaveBeenCalled();
});
