import { beforeEach, it, expect, vi } from 'vitest';
const mock = vi.hoisted(() => ({ auth: { currentUser: null }, getDocs: vi.fn(), getDoc: vi.fn(), setDoc: vi.fn(), updateDoc: vi.fn(), deleteDoc: vi.fn(), signOut: vi.fn() }));
vi.mock('../firebase-config', () => ({ app: {} }));
vi.mock('firebase/auth', () => ({ getAuth: () => mock.auth, signOut: mock.signOut }));
vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}), collection: (...args) => ({ args }), doc: (...args) => ({ args, id: 'generated-id' }),
  query: (...args) => ({ args }), orderBy: (...args) => ({ args }), limit: (...args) => ({ args }),
  getDocs: mock.getDocs, getDoc: mock.getDoc, setDoc: mock.setDoc, updateDoc: mock.updateDoc, deleteDoc: mock.deleteDoc,
}));
vi.mock('./projects', () => ({
  readProjectSettings: vi.fn().mockResolvedValue({ project_selected: '2025y', projects_available: ['2025y'] }),
  selectProject: vi.fn(async (_, project) => ({ project_selected: project, projects_available: ['2025y', '2026y'] })),
  createProject: vi.fn(async (_, project) => ({ project_selected: project, projects_available: ['2025y', project] })),
}));
import * as firebase from './firebase';
import { CInvoice } from './invoice';
const owner = { uid: 'owner', email: 'owner@example.com' };
beforeEach(async () => {
  vi.clearAllMocks(); firebase.initializeUser(null); mock.auth.currentUser = owner; firebase.initializeUser(owner);
  mock.getDocs.mockResolvedValue({ docs: [] }); mock.getDoc.mockResolvedValue({ exists: () => false });
  mock.setDoc.mockResolvedValue(); mock.updateDoc.mockResolvedValue(); mock.deleteDoc.mockResolvedValue();
  await firebase.loadDashboardData();
  vi.clearAllMocks();
});
it('writes a new invoice once, including its generated document ID', async () => {
  const item = new CInvoice(); item.id = 'invoice'; item.no = 4;
  await firebase.pushInvoiceToFirebase(item);
  expect(mock.setDoc).toHaveBeenCalledTimes(1); expect(mock.setDoc.mock.calls[0][1].doc).toBe('generated-id');
  expect(mock.updateDoc).not.toHaveBeenCalled(); expect(firebase.Invoices[0].doc).toBe('generated-id'); expect(firebase.LastInvoiceNO).toBe(4);
});
it('does not update local state when a mutation fails', async () => {
  const item = new CInvoice(); item.id = 'invoice'; firebase.updateInvoices(item);
  mock.deleteDoc.mockRejectedValueOnce(new Error('denied'));
  await expect(firebase.deleteInvoiceFromFirebase('doc')).rejects.toThrow(); expect(firebase.Invoices).toEqual([item]);
  mock.setDoc.mockRejectedValueOnce(new Error('denied'));
  await expect(firebase.pushInvoiceToFirebase(new CInvoice())).rejects.toThrow(); expect(firebase.Invoices).toHaveLength(1);
});
it('coalesces concurrent dashboard loads', async () => {
  const first = firebase.loadDashboardData(); const second = firebase.loadDashboardData();
  expect(first).toBe(second); await first; expect(mock.getDocs).toHaveBeenCalledTimes(2); expect(mock.getDoc).toHaveBeenCalledTimes(1);
});
it('ignores stale reads after switching accounts', async () => {
  let finish; mock.getDocs.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  const pending = firebase.pullAllInvoiceFromFirebase();
  const next = { uid: 'other', email: 'other@example.com' }; mock.auth.currentUser = next; firebase.initializeUser(next);
  const item = new CInvoice(); item.id = 'old'; finish({ docs: [{ id: 'doc', data: () => item }] });
  await expect(pending).rejects.toThrow('Data scope changed'); expect(firebase.Invoices).toEqual([]); expect(firebase.Mail).toBe(next.email);
});
it('rejects unauthenticated access and preserves cache for repeat auth callbacks', () => {
  const item = new CInvoice(); firebase.updateInvoices(item); firebase.initializeUser(owner); expect(firebase.Invoices).toEqual([item]);
  mock.auth.currentUser = null; firebase.initializeUser(null); expect(() => firebase.pullAllInvoiceFromFirebase()).toThrow('Authentication required');
});
it('isolates pending reads and writes across project switches', async () => {
  let finishRead; mock.getDocs.mockImplementationOnce(() => new Promise(resolve => { finishRead = resolve; }));
  const read = firebase.pullAllInvoiceFromFirebase();
  let finishWrite; mock.setDoc.mockImplementationOnce(() => new Promise(resolve => { finishWrite = resolve; }));
  const item = new CInvoice(); item.id = 'old-project'; const write = firebase.pushInvoiceToFirebase(item);
  await firebase.changeSelectedProject('2026y');
  expect(firebase.Invoices).toEqual([]); expect(firebase.LastInvoiceNO).toBe(0); expect(firebase.Menu.products).toEqual([]);
  await expect(firebase.pushInvoiceToFirebase(item)).rejects.toThrow('Project data is not ready');
  const completed = Promise.allSettled([read, write]);
  finishRead({ docs: [{ id: 'old-doc', data: () => item }] }); finishWrite();
  expect((await completed).map(result => result.status)).toEqual(['rejected', 'rejected']);
  expect(firebase.Invoices).toEqual([]); expect(item.doc).toBe('');
  expect(mock.setDoc.mock.calls[0][0].args[0].args).toContain('2025y');
  expect(firebase.ProjectSelected).toBe('2026y');
});
it('routes every data operation to the selected project after loading', async () => {
  // Stub the next bootstrap read as if the persisted setting was changed.
  const projects = await import('./projects');
  projects.readProjectSettings.mockResolvedValueOnce({ project_selected: '夏季活動', projects_available: ['夏季活動'] });
  await firebase.loadDashboardData(); vi.clearAllMocks();
  const item = new CInvoice(); item.id = 'new-project';
  await firebase.pushInvoiceToFirebase(item); await firebase.updateInvoiceToFirebase(item, 'doc');
  await firebase.pushMenuToFirebase({ products: [], options: [] }); await firebase.deleteInvoiceFromFirebase('doc');
  const invoicePath = mock.setDoc.mock.calls[0][0].args[0].args;
  expect(invoicePath).toContain('夏季活動'); expect(mock.setDoc.mock.calls[1][0].args).toContain('夏季活動');
  expect(mock.updateDoc.mock.calls[0][0].args[0].args).toContain('夏季活動'); expect(mock.deleteDoc.mock.calls[0][0].args[0].args).toContain('夏季活動');
});
it('blocks writes when the active-project dashboard load fails', async () => {
  mock.getDoc.mockRejectedValueOnce(new Error('permission-denied'));
  await expect(firebase.loadDashboardData()).rejects.toThrow('permission-denied');
  await expect(firebase.pushMenuToFirebase({ products: [], options: [] })).rejects.toThrow('Project data is not ready');
  expect(mock.setDoc).not.toHaveBeenCalled();
});

it('loads an unconfigured account without reading project data or writing configuration', async () => {
  const projects = await import('./projects');
  projects.readProjectSettings.mockResolvedValueOnce({ project_selected: '', projects_available: [] });
  await firebase.loadDashboardData();
  expect(firebase.ProjectSelected).toBe('');
  expect(mock.getDocs).not.toHaveBeenCalled(); expect(mock.getDoc).not.toHaveBeenCalled();
  expect(mock.setDoc).not.toHaveBeenCalled();
  await expect(firebase.pushMenuToFirebase({ products: [], options: [] })).rejects.toThrow();
});
it('allows explicit creation and selection before an account has a selected project', async () => {
  const projects = await import('./projects');
  projects.readProjectSettings.mockResolvedValueOnce({ project_selected: '', projects_available: ['夏季活動'] });
  await firebase.loadDashboardData();
  await firebase.changeSelectedProject('夏季活動'); expect(projects.selectProject).toHaveBeenCalledWith(owner.email, '夏季活動');
  projects.readProjectSettings.mockResolvedValueOnce({ project_selected: '', projects_available: [] });
  await firebase.loadDashboardData();
  await firebase.addProject('new-project'); expect(projects.createProject).toHaveBeenCalledWith(owner.email, 'new-project', undefined);
  expect(firebase.ProjectSelected).toBe('new-project');
});
