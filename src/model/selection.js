export function selectInvoices(invoices, state) {
  if (!Array.isArray(state?.invoiceIds)) return invoices;
  const ids = new Set(state.invoiceIds);
  return invoices.filter((invoice) => ids.has(invoice.id));
}
