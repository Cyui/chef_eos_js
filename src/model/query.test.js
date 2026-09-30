import { describe, it, expect } from 'vitest';
import { CInvoice } from './invoice';
import dayjs from './date';
import { filterInvoices } from './query';
import { selectInvoices } from './selection';
function invoice(id, name, time = '12:00') {
  const item = new CInvoice(); item.id = id;
  Object.assign(item.info, { name, phone: id, sn: id, date: '2026/09/30', time });
  return item;
}
const all = [invoice('1', '蔡先生', '10:00'), invoice('2', '王小姐', '12:00'), invoice('3', '蔡小姐', '14:00')];
describe('invoice query', () => {
  it('filters name independently of phone and keeps the source intact', () => {
    expect(filterInvoices(all, { name: '蔡' }).map(i => i.id)).toEqual(['1', '3']);
    expect(filterInvoices(all, { name: '蔡', phone: '3' }).map(i => i.id)).toEqual(['3']);
    expect(all).toHaveLength(3);
  });
  it('uses inclusive start and exclusive end with strict date/time parsing', () => {
    const date = dayjs('2026/09/30', 'YYYY/MM/DD', true);
    expect(filterInvoices(all, { dateFrom: date, dateTo: date, timeFrom: dayjs('10:00', 'HH:mm'), timeTo: dayjs('14:00', 'HH:mm') }).map(i => i.id)).toEqual(['1', '2']);
    expect(filterInvoices(all, { dateTo: date, timeTo: dayjs('12:00', 'HH:mm') }).map(i => i.id)).toEqual(['1']);
  });
  it('rejects invalid and reversed bounds', () => {
    expect(() => filterInvoices(all, { dateFrom: dayjs('invalid') })).toThrow();
    const date = dayjs('2026/09/30', 'YYYY/MM/DD');
    expect(() => filterInvoices(all, { dateFrom: date, dateTo: date, timeFrom: dayjs('14:00', 'HH:mm'), timeTo: dayjs('10:00', 'HH:mm') })).toThrow();
  });
  it('distinguishes all invoices from an empty query result', () => {
    expect(selectInvoices(all, null)).toBe(all);
    expect(selectInvoices(all, { invoiceIds: [] })).toEqual([]);
    expect(selectInvoices(all, { invoiceIds: ['2'] })).toEqual([all[1]]);
  });
});
