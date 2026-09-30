import * as React from 'react';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
const mock = vi.hoisted(() => ({ invoices: [], navigate: vi.fn(), save: vi.fn(), push: vi.fn() }));
vi.mock('react-router-dom', () => ({ useNavigate: () => mock.navigate, useLocation: () => ({ state: 'invoice' }) }));
vi.mock('../../model/firebase', () => ({ get Invoices() { return mock.invoices; }, LastInvoiceNO: 1, Menu: { products: [], options: [] }, updateInvoiceToFirebase: mock.save, pushInvoiceToFirebase: mock.push }));
import { CInvoice, CProduct, COrder } from '../../model/invoice';
import EditOrder from './index';
beforeEach(() => {
  vi.clearAllMocks(); const item = new CInvoice(); item.id = 'invoice'; item.doc = 'doc';
  item.orders = [new COrder('row', new CProduct('p', 'food', 100), 2)]; item.info.name = 'original';
  mock.invoices = [item]; mock.save.mockResolvedValue();
});
afterEach(cleanup);
it('keeps unsaved edits detached and recalculates totals immediately', () => {
  render(<EditOrder />); fireEvent.change(screen.getByLabelText('姓名'), { target: { value: 'edited' } });
  fireEvent.change(screen.getByLabelText('折扣'), { target: { value: '30' } });
  expect(screen.getByText('訂單金額: 170')).toBeInTheDocument(); expect(mock.invoices[0].info.name).toBe('original');
  fireEvent.click(screen.getByLabelText('cancel')); expect(mock.save).not.toHaveBeenCalled();
});
it('waits for save before navigation and remains on the screen when save fails', async () => {
  let fail; mock.save.mockImplementation(() => new Promise((_, reject) => { fail = reject; }));
  render(<EditOrder />); fireEvent.click(screen.getByLabelText('submit'));
  expect(mock.navigate).not.toHaveBeenCalled(); expect(screen.getByLabelText('submit')).toBeDisabled();
  fail(new Error('denied')); expect(await screen.findByRole('alert')).toHaveTextContent('儲存失敗');
  expect(mock.navigate).not.toHaveBeenCalled(); mock.save.mockResolvedValue();
  fireEvent.click(screen.getByLabelText('submit')); await waitFor(() => expect(mock.navigate).toHaveBeenCalledWith(-1));
});
