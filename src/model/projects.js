import { app } from "../firebase-config";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, collection, getDoc, getDocs, query, limit, runTransaction } from "firebase/firestore";

const db = getFirestore(app);
const auth = getAuth(app);

function validateKey(value) {
  if (typeof value !== "string" || !value.trim() || value !== value.trim() ||
      value.includes("/") || value === "." || value === ".." || /^__.*__$/.test(value) ||
      /[\u0000-\u001f\u007f\ud800-\udfff]/u.test(value) ||
      new TextEncoder().encode(value).length > 1500) {
    throw new Error("專案名稱無效，請使用不含斜線的名稱，且勿在前後加空白。");
  }
  return value;
}

export function projectKey(value) {
  return validateKey(typeof value === "string" ? value.trim() : value);
}

function settingsFrom(data = {}) {
  const selected = data.project_selected;
  const projects = data.projects_available ?? [];
  if (!Array.isArray(projects)) throw new Error("可用專案清單格式錯誤。");
  return {
    project_selected: selected == null || selected === "" ? "" : validateKey(selected),
    projects_available: [...new Set(projects.map(validateKey))].sort(),
  };
}

function assertOwner(email) {
  if (!email || auth.currentUser?.email !== email) throw new Error("Authentication required");
}

function userRef(email) { return doc(db, email, "user_info"); }
function menuRef(email, project) { return doc(db, email, "eos_menu", project, "current"); }

async function readInfo(email, initializeIfMissing) {
  assertOwner(email);
  const snapshot = await getDoc(userRef(email));
  if (snapshot.exists()) return snapshot.data();
  if (!initializeIfMissing) return {};
  // Recheck inside the transaction so another login cannot be overwritten.
  return runTransaction(db, async (transaction) => {
    assertOwner(email);
    const ref = userRef(email);
    const current = await transaction.get(ref);
    if (current.exists()) return current.data();
    const data = { exp_date: "-" };
    transaction.set(ref, data);
    return data;
  });
}

export async function readProjectSettings(email, { initializeIfMissing = false } = {}) {
  return settingsFrom(await readInfo(email, initializeIfMissing));
}

export async function selectProject(email, project) {
  assertOwner(email);
  validateKey(project);
  return runTransaction(db, async (transaction) => {
    assertOwner(email);
    const snapshot = await transaction.get(userRef(email));
    const data = snapshot.exists() ? snapshot.data() : {};
    const settings = settingsFrom(data);
    if (!settings.projects_available.includes(project)) throw new Error("此專案已不在可用清單中，請重新載入。");
    const next = { ...settings, project_selected: project };
    const patch = { project_selected: project };
    transaction.set(userRef(email), patch, { merge: true });
    return next;
  });
}

export async function createProject(email, value, { allowExisting = false } = {}) {
  assertOwner(email);
  const project = projectKey(value);
  // A menu or registered name normally marks an existing project; retain legacy orders too.
  const invoices = await getDocs(query(collection(db, email, "eos_invioces", project), limit(1)));
  return runTransaction(db, async (transaction) => {
    assertOwner(email);
    const info = await transaction.get(userRef(email));
    const settings = settingsFrom(info.exists() ? info.data() : {});
    const ref = menuRef(email, project);
    const menu = await transaction.get(ref);
    if (!allowExisting && (menu.exists() || invoices.docs.length || settings.projects_available.includes(project))) {
      const error = new Error("此專案已存在，可加入清單並切換；既有資料會保留。");
      error.code = "project-exists";
      throw error;
    }
    const next = { project_selected: project, projects_available: [...new Set([...settings.projects_available, project])].sort() };
    if (!menu.exists()) transaction.set(ref, { products: [], options: [] });
    transaction.set(userRef(email), next, { merge: true });
    return next;
  });
}
