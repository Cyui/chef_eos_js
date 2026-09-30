import dayjs from "./date";

export function filterInvoices(invoices, filters) {
  const { sn, name, phone, status, deliver, noteOpt, dateFrom, timeFrom, dateTo, timeTo } = filters;
  const start = dateFrom ? dayjs(`${dateFrom.format("YYYY/MM/DD")} ${timeFrom?.format("HH:mm")}`, "YYYY/MM/DD HH:mm", true) : null;
  const end = dateTo ? dayjs(`${dateTo.format("YYYY/MM/DD")} ${timeTo?.format("HH:mm")}`, "YYYY/MM/DD HH:mm", true) : null;
  if ((start && !start.isValid()) || (end && !end.isValid()) || (start && end && !start.isBefore(end))) {
    throw new Error("Invalid date range");
  }
  return invoices.filter(({ info }) => {
    if (sn && !info.sn.includes(sn)) return false;
    if (name && !info.name.includes(name)) return false;
    if (phone && !info.phone.includes(phone)) return false;
    if (status && !info.status.includes(status)) return false;
    if (deliver && !info.deliver.includes(deliver)) return false;
    if (noteOpt && !info.note) return false;
    if (start || end) {
      const time = dayjs(`${info.date} ${info.time}`, "YYYY/MM/DD HH:mm", true);
      if (!time.isValid() || (start && time.isBefore(start)) || (end && !time.isBefore(end))) return false;
    }
    return true;
  });
}
