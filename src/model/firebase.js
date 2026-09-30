import { app } from "../firebase-config";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs,
  query, orderBy, limit, updateDoc, deleteDoc,
} from "firebase/firestore";
import { invoiceFromObject } from "./invoice";
import { CMenu, menuFromObject } from "./chefmenu";
import { ensureYearSelection, readYearSettings, selectYear, createYear } from "./years";

export const db = getFirestore(app);
const auth = getAuth(app);
export let YearSelected = "";
export let YearsAvailable = [];
let dataReady = false;
const scopeListeners = new Set();

export function subscribeDataScope(listener) {
  scopeListeners.add(listener);
  return () => scopeListeners.delete(listener);
}
export function getDataScope() { return session; }
function notifyScope() { scopeListeners.forEach((listener) => listener()); }

function clearYearData() {
  dataReady = false;
  Invoices = [];
  LastInvoiceNO = 0;
  Menu = new CMenu();
  dashboardRequest = null;
  invoiceRequest = null;
}

function activateSettings(settings) {
  YearsAvailable = settings.years_available;
  if (YearSelected !== settings.year_selected) {
    YearSelected = settings.year_selected;
    session += 1;
    clearYearData();
    notifyScope();
  }
}
export let Invoices = [];
export let LastInvoiceNO = 0;
export let Menu = new CMenu();
export let Mail = "";
let session = 0;
let userId = null;
let dashboardRequest = null;
let invoiceRequest = null;

export function initializeUser(user) {
  const nextId = user?.uid || null;
  if (nextId === userId && (user?.email || "") === Mail) return;
  userId = nextId;
  session += 1;
  Mail = user?.email || "";
  YearSelected = "";
  YearsAvailable = [];
  clearYearData();
  notifyScope();
}

function currentSession(requireYear = true) {
  if (!auth.currentUser || !Mail || auth.currentUser.email !== Mail) {
    throw new Error("Authentication required");
  }
  if (requireYear && !YearSelected) throw new Error("Year is not initialized");
  return { email: Mail, year: YearSelected, version: session };
}

function isCurrent({ email, version }) {
  return email === Mail && version === session;
}

function invoiceCollection(email, year) {
  return collection(db, email, "eos_invioces", year);
}

// Class instances and optional undefined fields need plain Firestore data.
function plainData(value) {
  return JSON.parse(JSON.stringify(value));
}

export function updateInvoices(invoice) {
  const index = Invoices.findIndex((item) => item.id === invoice.id);
  Invoices = index < 0
    ? [...Invoices, invoice]
    : Invoices.map((item, i) => i === index ? invoice : item);
}

export function logOut() {
  return signOut(auth);
}

export async function pushInvoiceToFirebase(invoice) {
  if (!dataReady) throw new Error("Year data is not ready");
  const owner = currentSession();
  const ref = doc(invoiceCollection(owner.email, owner.year));
  const saved = invoiceFromObject({ ...invoice, doc: ref.id });
  // Save the generated document ID in the same write, rather than a second update.
  await setDoc(ref, plainData(saved));
  if (isCurrent(owner)) {
    invoice.doc = ref.id;
    updateInvoices(saved);
    LastInvoiceNO = Math.max(LastInvoiceNO, saved.no);
  }
  return saved;
}

export async function pushMenuToFirebase(menu) {
  if (!dataReady) throw new Error("Year data is not ready");
  const owner = currentSession();
  const data = plainData(menu);
  await setDoc(doc(db, owner.email, "eos_menu", owner.year, "current"), data);
  if (isCurrent(owner)) Menu = menuFromObject(data);
}

export async function updateInvoiceToFirebase(invoice, docid) {
  if (!dataReady) throw new Error("Year data is not ready");
  const owner = currentSession();
  const saved = invoiceFromObject({ ...invoice, doc: docid });
  await updateDoc(doc(invoiceCollection(owner.email, owner.year), docid), plainData(saved));
  if (isCurrent(owner)) updateInvoices(saved);
  return saved;
}

export function pullAllInvoiceFromFirebase() {
  const owner = currentSession();
  if (invoiceRequest?.version === owner.version) return invoiceRequest.promise;
  const promise = (async () => {
    const snapshot = await getDocs(query(invoiceCollection(owner.email, owner.year), orderBy("info.sn", "desc")));
    const invoices = snapshot.docs.map((item) => invoiceFromObject({ ...item.data(), doc: item.id }));
    if (isCurrent(owner)) Invoices = invoices;
    return invoices;
  })();
  invoiceRequest = { version: owner.version, promise };
  const clear = () => { if (invoiceRequest?.promise === promise) invoiceRequest = null; };
  promise.then(clear, clear);
  return promise;
}

export async function pullMenuFromFirebase() {
  const owner = currentSession();
  const snapshot = await getDoc(doc(db, owner.email, "eos_menu", owner.year, "current"));
  const menu = snapshot.exists() ? menuFromObject(snapshot.data()) : new CMenu();
  if (isCurrent(owner)) Menu = menu;
  return menu;
}

export async function deleteInvoiceFromFirebase(docid) {
  if (!dataReady) throw new Error("Year data is not ready");
  const owner = currentSession();
  await deleteDoc(doc(invoiceCollection(owner.email, owner.year), docid));
  if (isCurrent(owner)) Invoices = Invoices.filter((item) => item.doc !== docid);
}

export async function getLastInvoiceFromFirebase() {
  const owner = currentSession();
  const snapshot = await getDocs(query(invoiceCollection(owner.email, owner.year), orderBy("no", "desc"), limit(1)));
  const no = snapshot.docs[0]?.data().no || 0;
  if (isCurrent(owner)) LastInvoiceNO = no;
  return no;
}

export function loadDashboardData() {
  const owner = currentSession(false);
  if (dashboardRequest?.version === owner.version) return dashboardRequest.promise;
  dataReady = false;
  const promise = (async () => {
    const settings = await ensureYearSelection(owner.email);
    if (!isCurrent(owner)) throw new Error("Data scope changed");
    activateSettings(settings);
    dashboardRequest = { version: session, promise };
    const active = currentSession();
    await Promise.all([
      pullAllInvoiceFromFirebase(), getLastInvoiceFromFirebase(), pullMenuFromFirebase(),
    ]);
    if (!isCurrent(active)) throw new Error("Data scope changed");
    dataReady = true;
  })();
  dashboardRequest = { version: owner.version, promise };
  const clear = () => { if (dashboardRequest?.promise === promise) dashboardRequest = null; };
  promise.then(clear, clear);
  return promise;
}

export async function refreshYearSettings() {
  const owner = currentSession(false);
  const settings = await readYearSettings(owner.email);
  if (!isCurrent(owner)) throw new Error("Data scope changed");
  // Refresh the list only; changing selection must pass through the data gate.
  YearsAvailable = settings.years_available;
  return { ...settings, year_selected: YearSelected };
}

export async function changeSelectedYear(year) {
  const owner = currentSession();
  const settings = await selectYear(owner.email, year);
  if (!isCurrent(owner)) throw new Error("Data scope changed");
  activateSettings(settings);
  return settings;
}

export async function addYear(value, options) {
  const owner = currentSession();
  const settings = await createYear(owner.email, value, options);
  if (!isCurrent(owner)) throw new Error("Data scope changed");
  activateSettings(settings);
  return settings;
}
