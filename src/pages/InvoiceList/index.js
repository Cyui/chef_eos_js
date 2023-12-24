import React from "react";
import { useState, useRef, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ListItemButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import ArticleIcon from "@mui/icons-material/Article";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import DoneIcon from "@mui/icons-material/Done";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as firebase from "../../model/firebase";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import EditOrder from "../EditOrder";
import Home from "../Home";
import { CInvoice, invoiceFromObject } from "../../model/invoice";

export default function InvoiceList() {
  //const location = useLocation();
  const navigate = useNavigate();

  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(true);

  const [open, setOpen] = useState(false);
  const invoice = useRef(new CInvoice());

  const [invoices, setInvoices] = useState(
    //location.state.map((obj) => invoiceFromObject(obj))
    firebase.Invoices
  );

  useEffect(() => {
    setInvoices([...invoices]);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOK = () => {
    setInvoices((items) => {
      return items.filter((item) => item.doc !== invoice.current.doc);
    });

    firebase.deleteInvoiceFromFirebase(invoice.current.doc);

    setOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752, m: 0 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <List dense={dense}>
            {invoices.map((value) => (
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleClickOpen();
                      invoice.current = value;

                      // setInvoices((items) => {
                      //   return items.filter((item) => item.doc !== value.doc);
                      // });

                      // firebase.deleteInvoiceFromFirebase(value.doc);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                key={value.id}
                onClick={() => {
                  //console.log(value)
                  navigate("../edit", { state: value.id });
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <ArticleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`[${value.info.sn}] ${value.info.name} ${value.info.phone} <${value.info.status}>`}
                  secondary={secondary ? `${value.info.note}` : null}
                />
              </ListItem>
            ))}
          </List>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`確定刪除此筆訂單？`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {`[${invoice.current.info.sn}] ${invoice.current.info.name} ${invoice.current.info.phone}`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>取消</Button>
              <Button onClick={handleOK} autoFocus>
                確定
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1} sx={{ m: 1, mb: 10 }}>
        {/* <Link to="../"> */}
        <IconButton
          sx={{ m: 1 }}
          aria-label="return"
          color="primary"
          onClick={() => {
            navigate(-1);
          }}
        >
          <KeyboardReturnIcon />
        </IconButton>

        <IconButton
          sx={{ m: 1 }}
          aria-label="cancel"
          color="error"
          onClick={() => {
            navigate("/");
          }}
        >
          <CloseIcon />
        </IconButton>
        {/* </Link> */}
      </Stack>
    </Box>
  );
}
