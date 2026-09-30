import * as React from 'react';
import { afterEach, beforeEach, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
const mock = vi.hoisted(() => ({ project: '', logout: vi.fn() }));
vi.mock('../../model/firebase', () => ({ get ProjectSelected() { return mock.project; }, Mail: 'owner@example.com', logOut: mock.logout }));
import Home from './index';
beforeEach(() => { mock.project = ''; });
afterEach(cleanup);
it('shows only settings and logout before a project is selected', () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['設定', '登出']);
  expect(screen.getByText('目前專案：尚未選擇')).toBeInTheDocument();
});
it('shows data operations and the exact project name after selection', () => {
  mock.project = '2025y'; render(<MemoryRouter><Home /></MemoryRouter>);
  expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['新增', '統計', '列表', '查詢', '設定', '登出']);
  expect(screen.getByText('目前專案：2025y')).toBeInTheDocument();
});
