import * as React from 'react';
import { afterEach, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../model/firebase', () => ({
  YearSelected: '2026y',
  refreshYearSettings: vi.fn().mockResolvedValue({
    year_selected: '2026y', years_available: ['2026y'],
  }),
  changeSelectedYear: vi.fn(),
  addYear: vi.fn(),
}));
vi.mock('../../model/years', () => ({
  yearLabel: key => key.replace(/y$/, ''),
  yearKey: value => value + 'y',
}));

import SettingMenu from './index';
import YearSettings from '../YearSettings';

afterEach(cleanup);

it('returns from the year page to settings, then to home without reopening the year page', async () => {
  render(
    <MemoryRouter initialEntries={['/', '/setting', '/setting/years']}>
      <Routes>
        <Route path="/" element={<div>主選單</div>} />
        <Route path="/setting" element={<SettingMenu />} />
        <Route path="/setting/years" element={<YearSettings />} />
      </Routes>
    </MemoryRouter>,
  );
  await screen.findByText('目前年度：2026');
  const back = screen.getByRole('button', { name: '返回設定' });
  expect(back).toHaveClass('MuiIconButton-root');
  expect(back).toHaveClass('MuiIconButton-colorPrimary');
  fireEvent.click(back);
  expect(screen.getByRole('button', { name: '年度資料設定' })).toBeInTheDocument();
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
