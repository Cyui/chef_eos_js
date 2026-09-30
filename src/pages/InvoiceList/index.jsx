import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import ArticleIcon from "@mui/icons-material/Article";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as firebase from "../../model/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { CInvoice } from "../../model/invoice";
import { selectInvoices } from "../../model/selection";
import Alert from "@mui/material/Alert";
import useAsyncAction from "../../hooks/useAsyncAction";

export default function InvoiceList() {
    const navigate = useNavigate();

  const location = useLocation();
  const { run, pending, error } = useAsyncAction("刪除失敗，請稍後再試。");

  const [open, setOpen] = React.useState(false);
  const invoice = React.useRef(new CInvoice());

  const [invoices, setInvoices] = React.useState(() => selectInvoices(firebase.Invoices, location.state));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOK = () => run(async () => {
    await firebase.deleteInvoiceFromFirebase(invoice.current.doc);
    setInvoices((items) => items.filter((item) => item.doc !== invoice.current.doc));
    setOpen(false);
  });

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752, m: 0 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <List>
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
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                key={value.id}
                onClick={() => {
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
                  secondary={value.info.note}
                />
              </ListItem>
            ))}
          </List>
          <Dialog
            open={open}
            onClose={pending ? undefined : handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{`確定刪除此筆訂單？`}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {`[${invoice.current.info.sn}] ${invoice.current.info.name} ${invoice.current.info.phone}`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} disabled={pending}>取消</Button>
              <Button onClick={handleOK} disabled={pending} autoFocus>
                確定
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1} sx={{ m: 1, mb: 10 }}>
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
      </Stack>
    </Box>
  );
}

