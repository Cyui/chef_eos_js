import { beforeEach, it, expect, vi } from 'vitest';
const mock = vi.hoisted(() => ({ auth: { currentUser: null }, getDocs: vi.fn(), getDoc: vi.fn(), setDoc: vi.fn(), updateDoc: vi.fn(), deleteDoc: vi.fn(), signOut: vi.fn() }));
vi.mock('../firebase-config', () => ({ app: {} }));
vi.mock('firebase/auth', () => ({ getAuth: () => mock.auth, signOut: mock.signOut }));
vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}), collection: (...args) => ({ args }), doc: (...args) => ({ args, id: 'generated-id' }),
  query: (...args) => ({ args }), orderBy: (...args) => ({ args }), limit: (...args) => ({ args }),
  getDocs: mock.getDocs, getDoc: mock.getDoc, setDoc: mock.setDoc, updateDoc: mock.updateDoc, deleteDoc: mock.deleteDoc,
}));
import * as firebase from './firebase';
import { CInvoice } from './invoice';
const owner = { uid: 'owner', email: 'owner@example.com' };
beforeEach(() => {
  vi.clearAllMocks(); firebase.initializeUser(null); mock.auth.currentUser = owner; firebase.initializeUser(owner);
  mock.getDocs.mockResolvedValue({ docs: [] }); mock.getDoc.mockResolvedValue({ exists: () => false });
  mock.setDoc.mockResolvedValue(); mock.updateDoc.mockResolvedValue(); mock.deleteDoc.mockResolvedValue();
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
  await pending; expect(firebase.Invoices).toEqual([]); expect(firebase.Mail).toBe(next.email);
});
it('rejects unauthenticated access and preserves cache for repeat auth callbacks', () => {
  const item = new CInvoice(); firebase.updateInvoices(item); firebase.initializeUser(owner); expect(firebase.Invoices).toEqual([item]);
  mock.auth.currentUser = null; firebase.initializeUser(null); expect(() => firebase.pullAllInvoiceFromFirebase()).toThrow('Authentication required');
});
