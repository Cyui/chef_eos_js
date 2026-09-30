import { it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAsyncAction from './useAsyncAction';
it('prevents concurrent actions, surfaces generic errors, and permits retry', async () => {
  const { result } = renderHook(() => useAsyncAction('儲存失敗'));
  let reject; const action = vi.fn(() => new Promise((_, fail) => { reject = fail; }));
  let first;
  act(() => { first = result.current.run(action); result.current.run(action); });
  expect(action).toHaveBeenCalledTimes(1); expect(result.current.pending).toBe(true);
  await act(async () => { reject(new Error('private details')); await first; });
  expect(result.current.error).toBe('儲存失敗'); expect(result.current.pending).toBe(false);
  await act(async () => { await result.current.run(async () => {}); }); expect(result.current.error).toBe('');
});
