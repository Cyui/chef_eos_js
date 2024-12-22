import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import * as Colors from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditInfo from "./components/EditInfo";
import OrderList from "./components/OrderList";
import { useNavigate, useLocation } from "react-router-dom";
import { COrder, CInfo, CInvoice } from "../../model/invoice";
import * as firebase from "../../model/firebase";

export var serialNo = 0;

const EditOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const invoice = React.useRef(
    firebase.Invoices.find((item) => item.id === location.state) || new CInvoice()
  );

  const [info, setInfo] = React.useState(invoice.current.info);
  const [orders, setOrders] = React.useState(invoice.current.orders);
  const [discount, setDiscount] = React.useState(invoice.current.discount);
  const [total, setTotal] = React.useState(invoice.current.total);
  const [finalpayment, setFinalpayment] = React.useState(invoice.current.finalpayment);
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(() => {
    invoice.current.info = info;
    invoice.current.orders = orders;
    invoice.current.discount = discount;

    updateInvoice();
  }, [info, orders, discount]);

  const updateInvoice = () => {
    setTotal(invoice.current.total);
    setFinalpayment(invoice.current.finalpayment);
  };

  const handleSubmitClick = () => {
if (invoice.current.orders.find((item) => item.product.id === "")) {
      handleClickOpen();
      return;
    }

    updateInvoice();

    if (invoice.current.id === "") {
      invoice.current.no = firebase.LastInvoiceNO + 1;
      invoice.current.submit();
    }

    if (invoice.current.doc === "") {
      firebase.pushInvoiceToFirebase(invoice.current);
    } else {
      firebase.updateInvoiceToFirebase(invoice.current, invoice.current.doc);
      firebase.updateInvoices(invoice.current);
    }

    navigate(-1);
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  const handleReturnClick = () => {
    navigate(-1);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ m: 0 }}>
              <Typography variant="h6" gutterBottom sx={{ m: 1 }}>
          {invoice.current.doc || "New"}
        </Typography>
        <EditInfo setOrders={setOrders} info={info} setInfo={setInfo} />
        <OrderList orders={orders} setOrders={setOrders} />
        <TextField
          sx={{ width: 164, m: 1 }}
          id="textDiscount"
          label="折扣"
          variant="outlined"
          fullWidth
          value={discount}
          onChange={(e) => setDiscount(Math.abs(Number(e.target.value)) * -1 || 0)}
        />
        <Stack direction="row" spacing={1} sx={{ m: 1 }}>
          <Typography variant="h6" gutterBottom color={Colors.blue[500]} sx={{ width: 164 }}>
            訂單金額: {total}
          </Typography>
          <Typography variant="h6" gutterBottom color={Colors.red[500]} sx={{ width: 164 }}>
            餘款: {finalpayment}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mb: 10 }}>
                    <div>
            <IconButton sx={{ m: 1 }} aria-label="return" color="primary" onClick={handleReturnClick}>
              <KeyboardReturnIcon />
            </IconButton>
          </div>
          <div>
            <IconButton sx={{ m: 1 }} aria-label="cancel" color="error" onClick={handleCancelClick}>
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
                  </Stack>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">有新增的品項尚未選擇</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditOrder;
