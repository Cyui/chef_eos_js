import { it, expect, vi } from 'vitest';
vi.mock('./firebase', () => ({ Menu: { products: [{ name: 'food' }, { name: 'unused' }] } }));
import { CSummary } from './summary';
import { CInvoice, COrder, CProduct, COption } from './invoice';
it('aggregates quantities safely for prototype-like tags and ignores empty options', () => {
  const item = new CInvoice();
  item.orders = [new COrder('1', new CProduct('p', 'food', 10, [new COption('o', '__proto__', 0)]), 2), new COrder('2', new CProduct('p', 'food', 10, []), 3)];
  const summary = new CSummary([item]);
  expect(summary.report()).toEqual([{ name: 'food', qty: 5, color: 'black' }, { name: '▹ 選項： [__proto__]', qty: 2, color: 'gray' }, { name: 'unused', qty: 0, color: 'black' }]);
  expect(summary.total).toBe(50);
});
