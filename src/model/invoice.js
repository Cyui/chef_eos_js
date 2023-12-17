/**
 * Copyright Cyui
 * Last update date: 2023-12-16
 */

import { v4 } from "uuid";

class COption {
  constructor(id = "", tag = "", diff = 0) {
    this.id = id;
    this.tag = tag;
    this.diff = diff;
  }
}

class CProduct {
  constructor(id = "", name = "", price = 0, options) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.options = options; //is array type
  }

  get finalprice() {
    if (this.options !== undefined) {
      return this.options.reduce(
        (sum, option) => sum + option.diff,
        this.price
      );
    }

    return this.price;
  }

  get fullname() {
    if (this.options !== undefined) {
      return this.options.reduce(
        (sum, option) => sum + `[${option.tag}]`,
        this.name
      );
    }

    return this.name;
  }
}

class COrder {
  constructor(id = v4(), product = new CProduct(), quantity = 1) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
  }

  get subtotal() {
    return this.quantity * this.product.finalprice;
  }
}

class CInfo {
  constructor(
    sn = "",
    name = "",
    phone = "",
    date = "",
    time = "",
    note = "",
    deposit = 0,
    deliver = "自取",
    status = "待處理"
  ) {
    this.sn = sn;
    this.name = name;
    this.phone = phone;
    this.date = date;
    this.time = time;
    this.note = note;
    this.deposit = deposit;
    this.deliver = deliver;
    this.status = status;
  }
}

class CInvoice {
  constructor() {
    this.id = "";
    this.no = 0;
    this.timestamp = "";
    this.comment = "";
    this.orders = [];
    this.discount = 0;
    this.info = new CInfo();
    this.doc = "";
  }

  get total() {
    return this.orders.reduce((sum, order) => sum + order.subtotal, 0);
  }

  get finalpayment() {
    if (this.info !== undefined) {
      return this.total + this.discount - this.info.deposit;
    }

    return this.total + this.discount;
  }

  add(product, quantity) {
    let found = false;

    this.orders.forEach((order, index, array) => {
      if (JSON.stringify(order.product) === JSON.stringify(product)) {
        array[index].quantity += quantity;

        if (array[index].quantity <= 0) {
          array.splice(index, 1);
        }

        found = true;
      }
    });

    if (found === false) {
      this.orders.push(new COrder(product, quantity));
    }
  }

  delete(product) {
    this.orders.forEach((order, index, array) => {
      if (JSON.stringify(order.product) === JSON.stringify(product)) {
        array.splice(index, 1);
      }
    });
  }

  submit() {
    if (this.orders.length > 0) {
      this.id = v4();
      this.timestamp = new Date().toLocaleString();
    }
  }

  clear() {
    this.id = "";
    this.timestamp = "";
    this.comment = "";
    this.orders = [];
  }
}

const invoiceFromObject = (obj) => {
  let invoice = new CInvoice();

  if (obj) {
    invoice.id = obj.id;
    invoice.no = obj.no;
    invoice.timestamp = obj.timestamp;
    invoice.comment = obj.comment;
    invoice.orders = obj.orders.map((order) => {
      return new COrder(
        order.id,
        new CProduct(
          order.product.id,
          order.product.name,
          order.product.price,
          order.product.options?.map(
            (option) => new COption(option.id, option.tag, option.diff)
          )
        ),
        order.quantity
      );
    });
    invoice.discount = obj.discount;
    invoice.info = new CInfo(
      obj.info.sn,
      obj.info.name,
      obj.info.phone,
      obj.info.date,
      obj.info.time,
      obj.info.note,
      obj.info.deposit,
      obj.info.deliver,
      obj.info.status
    );
    invoice.doc = obj.doc;
  }

  return invoice;
};

export { COption, CProduct, COrder, CInfo, CInvoice, invoiceFromObject };
