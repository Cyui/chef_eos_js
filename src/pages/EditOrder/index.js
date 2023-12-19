import React from "react";
import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { blue, red, green } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Typography from "@mui/material/Typography";
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
import * as firebase from "../../model/firebase";

export var serialNo = 0;

const EditOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //console.log(location.state)
  //console.log(invoiceFromObject(location.state))

  //const invoice = useRef(invoiceFromObject(location.state) || new CInvoice());
  const invoice = useRef(
    firebase.Invoices.find((item) => item.id === location.state) ||
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
      invoice.current.no = firebase.LastInvoiceNO + 1;
      invoice.current.submit();
    }

    //console.log(invoice.current)

    if (invoice.current.doc === "") {
      firebase.pushInvoiceToFirebase(invoice.current);
    } else {
      firebase.updateInvoiceToFirebase(invoice.current, invoice.current.doc);
      firebase.updateInvoices(invoice.current);
    }

    //let { no, name, phone, date, time, note, deposit } = info
    //console.log(no)
    //console.log(name)
    //console.log(phone)
    //console.log(date)
    //console.log(time)
    //console.log(note)
    //console.log(deposit)

    navigate(-1);
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  const handleReturnClick = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ m: 0 }}>
      <div>
        <Typography variant="h6" gutterBottom sx={{ m: 1 }}>
          {invoice.current.doc || "New"}
        </Typography>
        <EditInfo setOrders={setOrders} info={info} setInfo={setInfo} />
        <OrderList orders={orders} setOrders={setOrders} />
        <TextField
          sx={{ width: 164, m: 1 }}
          id="textDeposit"
          label="折扣"
          variant="outlined"
          fullWidth
          value={discount}
          onChange={(e) =>
            setDiscount(Math.abs(Number(e.target.value)) * -1 || 0)
          }
        />
        <Stack direction="row" spacing={1} sx={{ m: 1 }}>
          <Typography
            variant="h6"
            gutterBottom
            color={blue[500]}
            sx={{ width: 164 }}
          >
            訂單金額: {total}
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            color={red[500]}
            sx={{ width: 164 }}
          >
            餘款: {finalpayment}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mb: 10 }}>
          {/* <Link to="../"> */}
          <div>
            <IconButton
              sx={{ m: 1 }}
              aria-label="return"
              color="primary"
              onClick={handleReturnClick}
            >
              <KeyboardReturnIcon />
            </IconButton>
          </div>
          <div>
            <IconButton
              sx={{ m: 1 }}
              aria-label="cancel"
              color="error"
              onClick={handleCancelClick}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            <IconButton
              sx={{ m: 1, mx: 6 }}
              aria-label="submit"
              color="success"
              onClick={handleSubmitClick}
            >
              <DoneIcon />
            </IconButton>
          </div>
          {/* </Link> */}
        </Stack>
      </div>
    </Box>
  );
};

export default EditOrder;
