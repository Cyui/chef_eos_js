import * as React from 'react';
import { useState, useRef, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ListItemButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import * as firebase from "../../model/firebase"
import {Routes, Route, Link, useNavigate, useLocation} from 'react-router-dom';
import EditOrder from '../EditOrder';
import Home from '../Home';
import { CInvoice,invoiceFromObject } from '../../model/invoice';


export default function InvoiceList() {
  const location = useLocation();

  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(true);

  const navigate = useNavigate();

  const [invoices, setInvoices] = useState(location.state.map(obj=>
    invoiceFromObject(obj)
    ));

  return (
    <div>
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
            <List dense={dense}>
              {invoices.map((value) =>(
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" 
                    onClick={(e) => { 
                      e.stopPropagation()

                      setInvoices((items) => {
                        return items.filter((item) => item.doc !== value.doc);
                      });

                      firebase.deleteInvoiceFromFirebase(value.doc)
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  key={value.id}
                  onClick={()=>{
                    //console.log(value)
                    navigate('../edit', {state: value})
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={ `No: ${value.info.sn}, Name: ${value.info.name}, Phone: ${value.info.phone}` }
                    secondary={secondary ? `Note: ${value.info.note}` : null}
                  />
                </ListItem>
              ))}
            </List>
        </Grid>
      </Grid>
    </Box>

    <Link to="../">
      <Button variant="contained" color="primary" onClick={() => {}}>Cancel</Button>
    </Link>
    </div>
  );
}