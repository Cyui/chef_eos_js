import * as React from 'react';
import { afterEach, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../model/firebase', () => ({
  ProjectSelected: '2026y',
  refreshProjectSettings: vi.fn().mockResolvedValue({
    project_selected: '2026y', projects_available: ['2026y'],
  }),
  changeSelectedProject: vi.fn(),
  addProject: vi.fn(),
}));
vi.mock('../../model/projects', () => ({
  projectKey: value => value,
}));

import SettingMenu from './index';
import ProjectSettings from '../ProjectSettings';

afterEach(cleanup);

it('returns from the project page to settings, then to home without reopening the project page', async () => {
  render(
    <MemoryRouter initialEntries={['/', '/setting', '/setting/projects']}>
      <Routes>
        <Route path="/" element={<div>主選單</div>} />
        <Route path="/setting" element={<SettingMenu />} />
        <Route path="/setting/projects" element={<ProjectSettings />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByText('目前專案：2026y');
  const back = screen.getByRole('button', { name: '返回設定' });
  expect(back).toHaveClass('MuiIconButton-root');
  expect(back).toHaveClass('MuiIconButton-colorPrimary');
  fireEvent.click(back);
  expect(screen.getByRole('button', { name: '專案設定' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'return' }));
  expect(screen.getByText('主選單')).toBeInTheDocument();
});

it('returns to home when settings is opened directly', () => {
  render(
    <MemoryRouter initialEntries={['/setting']}>
      <Routes>
        <Route path="/" element={<div>主選單</div>} />
        <Route path="/setting" element={<SettingMenu />} />
      </Routes>
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'return' }));
  expect(screen.getByText('主選單')).toBeInTheDocument();
});
