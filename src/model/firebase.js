import { app } from "../firebase-config";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
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
import { CMenu, menuFromObject } from "./chefmenu";

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export var Invoices = [];
export var LastInvoiceNO = 0;
export var Menu = new CMenu();

const auth = getAuth();
export var Mail = "";

export function setInvoices(invoices) {
  Invoices = [...invoices];
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

const menuConverter = {
  toFirestore: (menu) => {
    return menu;
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return menuFromObject(data);
  },
};

export function getUserInfoFromFirebase() {
  if (auth !== null) {
    Mail = auth.currentUser.email;
  }
}

export function logOut() {
  if (auth !== null) {
    signOut(auth)
      .then(function () {
        // Sign-out successful.
        console.log("logout success");
      })
      .catch(function (error) {
        // An error happened.
        console.log("logout error");
      });
  }
}

export async function pushInvoiceToFirebase(invoice) {
  // const ref = doc(collection(db, Mail, "eos_invioces", "2024y"))
  const ref = collection(db, Mail, "eos_invioces", "2024y");

  const docref = await addDoc(ref, JSON.parse(JSON.stringify(invoice)));

  await updateDoc(doc(ref, docref.id), { doc: docref.id });
}

export async function pushMenuToFirebase(menu) {
  const ref = doc(db, Mail, "eos_menu", "2024y", "current");
  //const ref = collection(db, Mail, "eos_menu", "2024y");

  const docref = await setDoc(ref, JSON.parse(JSON.stringify(menu)));
}

export async function updateInvoiceToFirebase(invoice, docid) {
  const ref = doc(db, Mail, "eos_invioces", "2024y", docid);

  await updateDoc(ref, JSON.parse(JSON.stringify(invoice)));
}

export async function pullAllInvoiceFromFirebase() {
  let invoices = [];

  const ref = collection(db, Mail, "eos_invioces", "2024y").withConverter(
    invoiceConverter
  );

  const q = query(ref, orderBy("no", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    let invoice = doc.data();
    invoice.doc = doc.id;
    invoices = [...invoices, invoice];
  });

  Invoices = invoices;
}

export async function pullMenuFromFirebase() {
  let menu = new CMenu();

  const ref = doc(db, Mail, "eos_menu", "2024y", "current").withConverter(
    menuConverter
  );

  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    // Convert to City object
    menu = docSnap.data();
    // Use a City instance method
    //console.log(doc);
  } else {
    console.log("No such document!");
  }

  Menu = menu;
}

// export async function queryInvoiceBySnFromFirebase(sn) {

//   const ref = collection(db, Mail, "eos_invioces", "2024y").withConverter(invoiceConverter);

//   const q = query(ref, where(new FieldPath('info', 'sn'), '==', sn))

//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
//   });
// }

export async function deleteInvoiceFromFirebase(docid) {
  const ref = doc(db, Mail, "eos_invioces", "2024y", docid);

  await deleteDoc(ref);
}

export async function getLastInvoiceFromFirebase() {
  let no = 0;

  const ref = collection(db, Mail, "eos_invioces", "2024y");
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
