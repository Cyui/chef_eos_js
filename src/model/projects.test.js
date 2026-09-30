import { beforeEach, describe, it, expect, vi } from 'vitest';
const mock = vi.hoisted(() => ({ auth: { currentUser: { email: 'owner@example.com' } }, docs: new Map(), getDoc: vi.fn(), getDocs: vi.fn(), runTransaction: vi.fn(), writes: [] }));
vi.mock('../firebase-config', () => ({ app: {} }));
vi.mock('firebase/auth', () => ({ getAuth: () => mock.auth }));
vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}), doc: (_, ...parts) => parts.join('/'), collection: (_, ...parts) => parts.join('/'),
  getDoc: mock.getDoc, getDocs: mock.getDocs, query: (...args) => args, limit: n => ({ limit: n }), runTransaction: mock.runTransaction,
}));
import { readProjectSettings, selectProject, createProject, projectKey } from './projects';
const email = 'owner@example.com'; const info = `${email}/user_info`;
const menuPath = project => `${email}/eos_menu/${project}/current`;
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
describe('project settings', () => {
  it('returns an empty configuration without writing fields or reading menus', async () => {
    mock.docs.set(info, { exp_date: '-', year_selected: '2025y', years_available: ['2025y'] });
    expect(await readProjectSettings(email)).toEqual({ project_selected: '', projects_available: [] });
    expect(mock.docs.get(info)).not.toHaveProperty('project_selected');
    expect(mock.runTransaction).not.toHaveBeenCalled();
    expect(mock.getDocs).not.toHaveBeenCalled();
    expect(mock.getDoc).toHaveBeenCalledTimes(1);
  });
  it('does not populate missing projects_available when a selection already exists', async () => {
    mock.docs.set(info, { project_selected: '2024y', exp_date: '-' });
    expect(await readProjectSettings(email)).toEqual({ project_selected: '2024y', projects_available: [] });
    expect(mock.docs.get(info)).not.toHaveProperty('projects_available');
  });
  it('lists only registered projects and selects the first project without changing other fields', async () => {
    mock.docs.set(info, { projects_available: ['夏季活動', '2025y'], exp_date: '-' });
    expect((await readProjectSettings(email)).projects_available).toEqual(['2025y', '夏季活動']);
    await selectProject(email, '夏季活動');
    expect(mock.docs.get(info)).toEqual({ project_selected: '夏季活動', projects_available: ['夏季活動', '2025y'], exp_date: '-' });
    await expect(selectProject(email, 'unregistered')).rejects.toThrow();
  });
  it('creates a named project and updates both fields without replacing the registry', async () => {
    mock.docs.set(info, { project_selected: '2025y', projects_available: ['2025y'], exp_date: '-' });
    await createProject(email, '夏季活動');
    expect(mock.docs.get(info)).toEqual({ project_selected: '夏季活動', projects_available: ['2025y', '夏季活動'], exp_date: '-' });
    expect(mock.docs.get(menuPath('夏季活動'))).toEqual({ products: [], options: [] });
    expect(mock.getDocs.mock.calls[0][0][0]).toBe(`${email}/eos_invioces/夏季活動`);
    expect(mock.writes.every(write => !write.path.includes('eos_invioces'))).toBe(true);
  });
  it('creates the first project without appending a year suffix', async () => {
    await createProject(email, '2028');
    expect(mock.docs.get(info)).toEqual({ project_selected: '2028', projects_available: ['2028'] });
    expect(mock.docs.has(menuPath('2028'))).toBe(true);
    expect(mock.docs.has(menuPath('2028y'))).toBe(false);
  });
  it('offers explicit adoption without overwriting existing menus', async () => {
    const menu = { products: [{ id: 'keep' }], options: [] }; mock.docs.set(menuPath('2028y'), menu);
    await expect(createProject(email, '2028y')).rejects.toMatchObject({ code: 'project-exists' });
    expect(mock.writes).toEqual([]);
    await createProject(email, '2028y', { allowExisting: true });
    expect(mock.docs.get(menuPath('2028y'))).toEqual(menu);
    expect(mock.docs.get(info).projects_available).toEqual(['2028y']);
  });
  it('treats existing orders or registration as an existing project', async () => {
    mock.getDocs.mockResolvedValueOnce({ docs: [{ id: 'order' }] });
    await expect(createProject(email, 'summer')).rejects.toMatchObject({ code: 'project-exists' });
    mock.docs.set(info, { projects_available: ['summer'] });
    await expect(createProject(email, 'summer')).rejects.toMatchObject({ code: 'project-exists' });
    expect(mock.writes).toEqual([]);
  });
  it('does not mistake failed reads for missing data', async () => {
    mock.getDoc.mockRejectedValueOnce(new Error('permission-denied'));
    await expect(readProjectSettings(email)).rejects.toThrow('permission-denied');
    mock.getDocs.mockRejectedValueOnce(new Error('offline'));
    await expect(createProject(email, 'summer')).rejects.toThrow('offline'); expect(mock.writes).toEqual([]);
  });
  it('keeps full names and validates Firestore path constraints', async () => {
    for (const name of ['2028', '2028y', '夏季活動', 'event-2028', '活動 🍰']) expect(projectKey(name)).toBe(name);
    expect(projectKey(' 夏季活動 ')).toBe('夏季活動');
    for (const bad of ['', ' ', '.', '..', '__reserved__', '2028/other', 'a'.repeat(1501), '中'.repeat(501), String.fromCharCode(0xd800)]) {
      expect(() => projectKey(bad)).toThrow();
    }
    mock.docs.set(info, { project_selected: '2028/other' }); await expect(readProjectSettings(email)).rejects.toThrow();
    mock.docs.set(info, { projects_available: '2028y' }); await expect(readProjectSettings(email)).rejects.toThrow();
    mock.auth.currentUser = null; await expect(createProject(email, 'summer')).rejects.toThrow('Authentication required');
  });
});
