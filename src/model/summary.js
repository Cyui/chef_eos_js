import * as firebase from "./firebase";

class CSummary {
  constructor(invoices = []) {
    this.invoices = invoices;
  }

  get total() {
    return this.invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  }

  get length() {
    return this.invoices.length;
  }

  report() {
    const list = firebase.Menu.products.map((item) => {
      return { main: item.name, qty: 0, sub: Object.create(null) };
    });

    const byName = new Map();
    list.forEach((item) => { if (!byName.has(item.main)) byName.set(item.main, item); });

    this.invoices.forEach((invoice) => {
      invoice.orders.forEach((order) => {
        const obj = byName.get(order.product.name);
        if (obj) {
          if (order.product.options?.length) {
            const tag = order.product.options[0]?.tag;

            if (!obj.sub[tag]) {
              obj.sub[tag] = 0;
            }

            obj.sub[tag] += order.quantity;
          }
          obj.qty += order.quantity;
        }
      });
    });

    const rows = [];

    list.forEach((item) => {
      rows.push({ name: item.main, qty: item.qty, color: "black" });

      Object.entries(item.sub).forEach((sub) => {
        rows.push({ name: "▹ 選項： [" + sub[0] + "]", qty: sub[1], color: "gray" });
      });
    });

    return rows;
  }
}

export { CSummary };

