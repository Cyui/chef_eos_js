import { beforeEach, describe, it, expect, vi } from 'vitest';
const mock = vi.hoisted(() => ({ auth: { currentUser: { email: 'owner@example.com' } }, docs: new Map(), getDoc: vi.fn(), getDocs: vi.fn(), runTransaction: vi.fn(), writes: [] }));
vi.mock('../firebase-config', () => ({ app: {} }));
vi.mock('firebase/auth', () => ({ getAuth: () => mock.auth }));
vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}), doc: (_, ...parts) => parts.join('/'), collection: (_, ...parts) => parts.join('/'),
  getDoc: mock.getDoc, getDocs: mock.getDocs, query: (...args) => args, limit: n => ({ limit: n }), runTransaction: mock.runTransaction,
}));
import { ensureYearSelection, readYearSettings, selectYear, createYear, yearKey, yearLabel } from './years';
const email = 'owner@example.com'; const info = `${email}/user_info`;
const menuPath = year => `${email}/eos_menu/${year}/current`;
const snapshot = path => ({ exists: () => mock.docs.has(path), data: () => structuredClone(mock.docs.get(path)) });
beforeEach(() => {
  vi.clearAllMocks(); mock.docs.clear(); mock.writes = []; mock.auth.currentUser = { email };
  mock.getDoc.mockImplementation(async path => snapshot(path)); mock.getDocs.mockResolvedValue({ docs: [] });
  mock.runTransaction.mockImplementation(async (_, callback) => {
    const writes = [];
    const result = await callback({
      get: async path => { if (writes.length) throw new Error('read after write'); return snapshot(path); },
      set: (path, data, options) => writes.push({ path, data, options }),
    });
    for (const write of writes) mock.docs.set(write.path, write.options?.merge ? { ...mock.docs.get(write.path), ...write.data } : write.data);
    mock.writes.push(...writes); return result;
  });
});
describe('year settings', () => {
  it('does not populate missing years_available when a selection already exists', async () => {
    mock.docs.set(info, { year_selected: '2024y', exp_date: '-' });
    expect(await ensureYearSelection(email)).toEqual({ year_selected: '2024y', years_available: [] });
    expect(mock.runTransaction).not.toHaveBeenCalled(); expect(mock.docs.get(info)).not.toHaveProperty('years_available');
  });
  it('falls back to local calendar year, preserving metadata and historical registrations', async () => {
    mock.docs.set(info, { exp_date: '-', years_available: ['2024y'] });
    const settings = await ensureYearSelection(email, new Date(2026, 8, 30));
    expect(settings).toEqual({ year_selected: '2026y', years_available: ['2024y', '2026y'] });
    expect(mock.docs.get(info).exp_date).toBe('-'); expect(mock.docs.get(menuPath('2026y'))).toEqual({ products: [], options: [] });
    expect(mock.writes).toHaveLength(2); expect(mock.writes.every(w => !w.path.includes('eos_invioces'))).toBe(true);
  });
  it('reuses an existing current-year menu without overwriting its products', async () => {
    const menu = { products: [{ id: 'keep' }], options: [] }; mock.docs.set(menuPath('2026y'), menu);
    await ensureYearSelection(email, new Date(2026, 0, 1));
    expect(mock.docs.get(menuPath('2026y'))).toEqual(menu); expect(mock.writes).toHaveLength(1);
  });
  it('honors a concurrent selection made after the first read', async () => {
    mock.getDoc.mockImplementationOnce(async () => {
      mock.docs.set(info, { year_selected: '2027y', years_available: ['2027y'] });
      return { exists: () => false };
    });
    expect((await ensureYearSelection(email, new Date(2026, 0, 1))).year_selected).toBe('2027y');
    expect(mock.writes).toHaveLength(0);
  });
  it('lists only explicitly registered years and selects without altering other fields', async () => {
    mock.docs.set(info, { year_selected: '2025y', years_available: ['2026y', '2025y'], exp_date: '-' });
    expect((await readYearSettings(email)).years_available).toEqual(['2025y', '2026y']);
    await selectYear(email, '2026y'); expect(mock.docs.get(info).year_selected).toBe('2026y');
    expect(mock.docs.get(info).years_available).toEqual(['2026y', '2025y']); expect(mock.docs.get(info).exp_date).toBe('-');
    await expect(selectYear(email, '2028y')).rejects.toThrow();
  });
  it('creates an empty year and updates both fields without replacing the registry', async () => {
    mock.docs.set(info, { year_selected: '2025y', years_available: ['2025y'], exp_date: '-' });
    await createYear(email, '2028');
    expect(mock.docs.get(info)).toEqual({ year_selected: '2028y', years_available: ['2025y', '2028y'], exp_date: '-' });
    expect(mock.docs.get(menuPath('2028y'))).toEqual({ products: [], options: [] });
    expect(mock.getDocs.mock.calls[0][0][0]).toBe(`${email}/eos_invioces/2028y`);
  });
  it('rejects existing menu years and offers explicit registration without modifying data', async () => {
    const menu = { products: [{ id: 'keep' }], options: [] }; mock.docs.set(menuPath('2028y'), menu);
    await expect(createYear(email, '2028')).rejects.toMatchObject({ code: 'year-exists' }); expect(mock.writes).toEqual([]);
    await createYear(email, '2028', { allowExisting: true });
    expect(mock.docs.get(menuPath('2028y'))).toEqual(menu); expect(mock.docs.get(info).years_available).toEqual(['2028y']);
  });
  it('treats existing orders or registration as an existing year', async () => {
    mock.getDocs.mockResolvedValueOnce({ docs: [{ id: 'order' }] });
    await expect(createYear(email, '2028')).rejects.toMatchObject({ code: 'year-exists' });
    mock.docs.set(info, { years_available: ['2028y'] });
    await expect(createYear(email, '2028')).rejects.toMatchObject({ code: 'year-exists' }); expect(mock.writes).toEqual([]);
  });
  it('does not mistake failed reads for missing data', async () => {
    mock.getDoc.mockRejectedValueOnce(new Error('permission-denied'));
    await expect(ensureYearSelection(email)).rejects.toThrow('permission-denied'); expect(mock.writes).toEqual([]);
    mock.getDocs.mockRejectedValueOnce(new Error('offline'));
    await expect(createYear(email, '2028')).rejects.toThrow('offline'); expect(mock.writes).toEqual([]);
  });
  it('validates input and stored settings before constructing paths', async () => {
    expect(yearKey('2028')).toBe('2028y'); expect(yearLabel('2028y')).toBe('2028');
    for (const bad of ['28', '2028y', '2028/other', 'abcd']) expect(() => yearKey(bad)).toThrow();
    mock.docs.set(info, { year_selected: '2028/other' }); await expect(ensureYearSelection(email)).rejects.toThrow();
    mock.docs.set(info, { years_available: '2028y' }); await expect(readYearSettings(email)).rejects.toThrow();
    mock.auth.currentUser = null; await expect(createYear(email, '2028')).rejects.toThrow('Authentication required');
  });
});
