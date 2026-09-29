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
import { useNavigate } from "react-router-dom";
import { CInvoice } from "../../model/invoice";

export default function InvoiceList() {
    const navigate = useNavigate();

  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(true);

  const [open, setOpen] = React.useState(false);
  const invoice = React.useRef(new CInvoice());

  const [invoices, setInvoices] = React.useState(firebase.Invoices);

  React.useEffect(() => {
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
            <DialogTitle id="alert-dialog-title">{`確定刪除此筆訂單？`}</DialogTitle>
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
