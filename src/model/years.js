import { app } from "../firebase-config";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, collection, getDoc, getDocs, query, limit, runTransaction } from "firebase/firestore";

const db = getFirestore(app);
const auth = getAuth(app);

export function yearKey(value) {
  const year = String(value).trim();
  if (!/^[1-9]\d{3}$/.test(year)) throw new Error("請輸入四位數年份，例如 2028。");
  return `${year}y`;
}

export function yearLabel(value) {
  return value?.replace(/y$/, "") || "";
}

function validateKey(value) {
  if (typeof value !== "string" || !/^[1-9]\d{3}y$/.test(value)) {
    throw new Error("年度設定格式錯誤，請檢查 user_info。");
  }
  return value;
}

function settingsFrom(data = {}) {
  const selected = data.year_selected;
  const years = data.years_available ?? [];
  if (!Array.isArray(years)) throw new Error("可用年度清單格式錯誤。");
  return {
    year_selected: selected == null || selected === "" ? "" : validateKey(selected),
    years_available: [...new Set(years.map(validateKey))].sort(),
  };
}

function assertOwner(email) {
  if (!email || auth.currentUser?.email !== email) throw new Error("Authentication required");
}

function userRef(email) { return doc(db, email, "user_info"); }
function menuRef(email, year) { return doc(db, email, "eos_menu", year, "current"); }

export async function readYearSettings(email) {
  assertOwner(email);
  const snapshot = await getDoc(userRef(email));
  return settingsFrom(snapshot.exists() ? snapshot.data() : {});
}

export async function ensureYearSelection(email, date = new Date()) {
  const settings = await readYearSettings(email);
  if (settings.year_selected) return settings;
  const fallback = yearKey(date.getFullYear());
  // Re-read inside the transaction: another tab may already have selected a year.
  return runTransaction(db, async (transaction) => {
    assertOwner(email);
    const info = await transaction.get(userRef(email));
    const latest = settingsFrom(info.exists() ? info.data() : {});
    if (latest.year_selected) return latest;
    const ref = menuRef(email, fallback);
    const menu = await transaction.get(ref);
    const next = { year_selected: fallback, years_available: [...new Set([...latest.years_available, fallback])].sort() };
    if (!menu.exists()) transaction.set(ref, { products: [], options: [] });
    transaction.set(userRef(email), next, { merge: true });
    return next;
  });
}

export async function selectYear(email, year) {
  assertOwner(email);
  validateKey(year);
  return runTransaction(db, async (transaction) => {
    assertOwner(email);
    const snapshot = await transaction.get(userRef(email));
    const settings = settingsFrom(snapshot.exists() ? snapshot.data() : {});
    if (!settings.years_available.includes(year)) throw new Error("此年度已不在可用清單中，請重新載入。");
    const next = { ...settings, year_selected: year };
    transaction.set(userRef(email), { year_selected: year }, { merge: true });
    return next;
  });
}

export async function createYear(email, value, { allowExisting = false } = {}) {
  assertOwner(email);
  const year = yearKey(value);
  // A menu document normally marks an existing year. Also check for legacy orders;
  // never create a placeholder invoice or overwrite existing order documents.
  const invoices = await getDocs(query(collection(db, email, "eos_invioces", year), limit(1)));
  return runTransaction(db, async (transaction) => {
    assertOwner(email);
    const info = await transaction.get(userRef(email));
    const settings = settingsFrom(info.exists() ? info.data() : {});
    const ref = menuRef(email, year);
    const menu = await transaction.get(ref);
    if (!allowExisting && (menu.exists() || invoices.docs.length || settings.years_available.includes(year))) {
      const error = new Error("此年度已存在，可加入清單並切換；既有資料會保留。");
      error.code = "year-exists";
      throw error;
    }
    const next = { year_selected: year, years_available: [...new Set([...settings.years_available, year])].sort() };
    if (!menu.exists()) transaction.set(ref, { products: [], options: [] });
    transaction.set(userRef(email), next, { merge: true });
    return next;
  });
}
