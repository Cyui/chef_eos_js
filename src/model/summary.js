import { CInvoice, COption, CProduct, COrder } from "./invoice";

class CSummary {
  constructor(invoices = []) {
    this.invoices = invoices;
  }

  get total() {
    return this.invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  }

  getOrdersDict(orders) {
    let fullDict = {};
    let mainDict = {};

    orders.forEach(order => {
        fullDict[order.product.fullname] = (fullDict[order.product.fullname] || 0 ) + order.quantity;
        mainDict[order.product.name] = (mainDict[order.product.name] || 0 ) + order.quantity;
    });

    return {fullDict, mainDict};
  };

  report() {
    let fullResult = {};
    let mainResult = {};

    this.invoices.forEach(invoice => {
      var { fullDict, mainDict } = this.getOrdersDict(invoice.orders);

      for (let key in mainDict) {
        mainResult[key] = (mainResult[key] || 0) + mainDict[key];
      }

      for (let key in fullDict) {
        fullResult[key] = (fullResult[key] || 0) + fullDict[key];
      }
    });

    let rows = []

    for (let fullKey in fullResult) {
      let per = 0

      for (let mainKey in mainResult) {
        if(fullKey.search(mainKey) === 0) 
         per = mainResult[mainKey]
      }

      rows = [...rows, { name: fullKey, qty: fullResult[fullKey], per: per} ]
    }

    return rows
  }
}

export { CSummary };
