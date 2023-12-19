import { app } from "../firebase-config";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
  addDoc,
  deleteDoc,
  where,
  FieldPath,
} from "firebase/firestore";
import { invoiceFromObject } from "./invoice";

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export var Invoices = [];
export var LastInvoiceNO = 0;

const auth = getAuth();
export var mail = "";

export function setInvoices(invoices) {
  Invoices = [...invoices]
}

export function updateInvoices(invoice) {
  Invoices.forEach((item, index, array) => {
    if (item.id === invoice.id) {
      array[index] = invoice;
    }
  });
}

const invoiceConverter = {
  toFirestore: (invoice) => {
    return invoice;
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return invoiceFromObject(data);
  },
};

export function getUserInfoFromFirebase() {
  if (auth !== null) {
    mail = auth.currentUser.email;
  }
}

export async function pushInvoiceToFirebase(invoice) {
  // const ref = doc(collection(db, mail, "eos_invioces", "2024y"))
  const ref = collection(db, mail, "eos_invioces", "2024y");

  const docref = await addDoc(ref, JSON.parse(JSON.stringify(invoice)));

  await updateDoc(doc(ref, docref.id), { doc: docref.id });
}

export async function updateInvoiceToFirebase(invoice, docid) {
  const ref = doc(db, mail, "eos_invioces", "2024y", docid);

  await updateDoc(ref, JSON.parse(JSON.stringify(invoice)));
}

export async function pullAllInvoiceFromFirebase() {
  let docs = [];

  const ref = collection(db, mail, "eos_invioces", "2024y").withConverter(
    invoiceConverter
  );

  const q = query(ref, orderBy("no", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    let invoice = doc.data();
    invoice.doc = doc.id;
    docs = [...docs, invoice];
  });

  Invoices = docs;
  //console.log(Invoices)
}

// export async function queryInvoiceBySnFromFirebase(sn) {

//   const ref = collection(db, mail, "eos_invioces", "2024y").withConverter(invoiceConverter);

//   const q = query(ref, where(new FieldPath('info', 'sn'), '==', sn))

//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
//   });
// }

export async function deleteInvoiceFromFirebase(docid) {
  const ref = doc(db, mail, "eos_invioces", "2024y", docid);

  await deleteDoc(ref);
}

export async function getLastInvoiceFromFirebase() {
  let no = 0;

  const ref = collection(db, mail, "eos_invioces", "2024y");
  const q = query(ref, orderBy("no", "desc"), limit(1));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    no = doc.data().no;
  });

  LastInvoiceNO = no;
  //console.log(LastInvoiceNO)
}
