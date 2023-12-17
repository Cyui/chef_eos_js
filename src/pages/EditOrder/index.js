import React from "react";
import { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "dayjs/locale/zh-tw";
import EditInfo from "./components/EditInfo";
import OrderList from "./components/OrderList";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CInfo, CInvoice, invoiceFromObject } from "../../model/invoice";
import * as firabase from "../../model/firebase";
import Typography from "@mui/material/Typography";

export var serialNo = 0;

const EditOrder = () => {
  const location = useLocation();

  //console.log(location.state)
  //console.log(invoiceFromObject(location.state))

  const invoice = useRef(
    invoiceFromObject(location.state) ||
      new CInvoice()
  );

  const [info, setInfo] = useState(invoice.current.info);
  const [orders, setOrders] = useState(invoice.current.orders);
  const [discount, setDiscount] = useState(invoice.current.discount);

  const [total, setTotal] = useState(invoice.current.total);
  const [finalpayment, setFinalpayment] = useState(
    invoice.current.finalpayment
  );

  useEffect(() => {
    updateInvoice();
  });

  const updateInvoice = () => {
    invoice.current.info = info;
    invoice.current.orders = orders;
    invoice.current.discount = discount;

    setTotal(invoice.current.total);
    setFinalpayment(invoice.current.finalpayment);
  };

  const handleSubmitClick = () => {
    updateInvoice();

    if (invoice.current.id === "") {
      invoice.current.no = firabase.lastInvoiceNO + 1
      invoice.current.submit();
    }

    //console.log(invoice.current)

    if (invoice.current.doc === "") {
      firabase.pushInvoiceToFirebase(invoice.current);
    } else {
      firabase.updateInvoiceToFirebase(invoice.current, invoice.current.doc);
    }

    //let { no, name, phone, date, time, note, deposit } = info
    //console.log(no)
    //console.log(name)
    //console.log(phone)
    //console.log(date)
    //console.log(time)
    //console.log(note)
    //console.log(deposit)
  };

  const handleCancelClick = () => {};

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {invoice.current.doc}
      </Typography>
      <EditInfo setOrders={setOrders} info={info} setInfo={setInfo} />
      <OrderList orders={orders} setOrders={setOrders} />
      <TextField
        id="textDeposit"
        label="折扣"
        variant="outlined"
        fullWidth
        value={discount}
        onChange={(e) => setDiscount(Math.abs(Number(e.target.value))*-1 || 0)}
      />
      <Typography variant="h5" gutterBottom>
        Total: {total}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Final Payment: {finalpayment}
      </Typography>
      <Link to="../">
        <Button variant="contained" color="primary" onClick={handleSubmitClick}>
          {" "}
          Submit{" "}
        </Button>
        <Button variant="contained" color="primary" onClick={handleCancelClick}>
          {" "}
          Cancel{" "}
        </Button>
      </Link>
    </div>
  );
};

export default EditOrder;
