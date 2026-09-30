import { it, expect } from 'vitest';
import { CInvoice, CProduct, COption, COrder, invoiceFromObject } from './invoice';
it('clones editable invoice data deeply and preserves calculated prices', () => {
  const source = new CInvoice(); source.discount = -10; source.info.deposit = 20;
  source.orders = [new COrder('row', new CProduct('p', 'food', 100, [new COption('o', '熱', 5)]), 2)];
  const copy = invoiceFromObject(source);
  expect(copy.total).toBe(200); expect(copy.finalpayment).toBe(180);
  copy.info.name = 'edited'; copy.orders[0].product.options[0].diff = 50;
  expect(source.info.name).toBe(''); expect(source.orders[0].product.options[0].diff).toBe(5);
});
it('merges quantities and removes every matching product without skipping adjacent rows', () => {
  const item = new CInvoice(); const product = new CProduct('p', 'food', 100);
  item.add(product, 2); item.add(product, 3); expect(item.orders).toHaveLength(1); expect(item.orders[0].quantity).toBe(5);
  item.add(product, -5); expect(item.orders).toEqual([]);
  item.orders = [new COrder('1', product), new COrder('2', product)];
  item.delete(product); expect(item.orders).toEqual([]);
});
