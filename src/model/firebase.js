import { app } from "../firebase-config";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs,
  query, orderBy, limit, updateDoc, deleteDoc,
} from "firebase/firestore";
import { invoiceFromObject } from "./invoice";
import { CMenu, menuFromObject } from "./chefmenu";

export const db = getFirestore(app);
const auth = getAuth(app);
const DATA_YEAR = "2025y";
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
  Invoices = [];
  LastInvoiceNO = 0;
  Menu = new CMenu();
  dashboardRequest = null;
  invoiceRequest = null;
}

function currentSession() {
  if (!auth.currentUser || !Mail || auth.currentUser.email !== Mail) {
    throw new Error("Authentication required");
  }
  return { email: Mail, version: session };
}

function isCurrent({ email, version }) {
  return email === Mail && version === session;
}

function invoiceCollection(email) {
  return collection(db, email, "eos_invioces", DATA_YEAR);
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
  const owner = currentSession();
  const ref = doc(invoiceCollection(owner.email));
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
  const owner = currentSession();
  const data = plainData(menu);
  await setDoc(doc(db, owner.email, "eos_menu", DATA_YEAR, "current"), data);
  if (isCurrent(owner)) Menu = menuFromObject(data);
}

export async function updateInvoiceToFirebase(invoice, docid) {
  const owner = currentSession();
  const saved = invoiceFromObject({ ...invoice, doc: docid });
  await updateDoc(doc(invoiceCollection(owner.email), docid), plainData(saved));
  if (isCurrent(owner)) updateInvoices(saved);
  return saved;
}

export function pullAllInvoiceFromFirebase() {
  const owner = currentSession();
  if (invoiceRequest?.version === owner.version) return invoiceRequest.promise;
  const promise = (async () => {
    const snapshot = await getDocs(query(invoiceCollection(owner.email), orderBy("info.sn", "desc")));
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
  const snapshot = await getDoc(doc(db, owner.email, "eos_menu", DATA_YEAR, "current"));
  const menu = snapshot.exists() ? menuFromObject(snapshot.data()) : new CMenu();
  if (isCurrent(owner)) Menu = menu;
  return menu;
}

export async function deleteInvoiceFromFirebase(docid) {
  const owner = currentSession();
  await deleteDoc(doc(invoiceCollection(owner.email), docid));
  if (isCurrent(owner)) Invoices = Invoices.filter((item) => item.doc !== docid);
}

export async function getLastInvoiceFromFirebase() {
  const owner = currentSession();
  const snapshot = await getDocs(query(invoiceCollection(owner.email), orderBy("no", "desc"), limit(1)));
  const no = snapshot.docs[0]?.data().no || 0;
  if (isCurrent(owner)) LastInvoiceNO = no;
  return no;
}

export function loadDashboardData() {
  const owner = currentSession();
  if (dashboardRequest?.version === owner.version) return dashboardRequest.promise;
  const promise = Promise.all([
    pullAllInvoiceFromFirebase(), getLastInvoiceFromFirebase(), pullMenuFromFirebase(),
  ]);
  dashboardRequest = { version: owner.version, promise };
  const clear = () => { if (dashboardRequest?.promise === promise) dashboardRequest = null; };
  promise.then(clear, clear);
  return promise;
}
