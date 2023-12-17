// import React from 'react';
// import { useState, useRef } from "react";
// import { useLocation} from "react-router";
import Button from "@mui/material/Button";
// import TextField from '@mui/material/TextField'
// import 'dayjs/locale/zh-tw';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
// import { CInvoice } from '../../model/invoice';
import { CSummary } from "../../model/summary";
import * as firebase from "../../model/firebase";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CInfo, CInvoice, invoiceFromObject } from "../../model/invoice";

const SummaryList = () => {
  const location = useLocation();
  
  const summary = new CSummary(location.state.map(obj=>
    invoiceFromObject(obj)
    ));
  //let rows = createData(summary.report())
  let rows = summary.report();

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Quantity / Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell align="right">{row.qty + " / " + row.per}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to="../">
        <Button variant="contained" color="primary" onClick={() => {}}>Cancel</Button>
      </Link>
    </div>
  );
};

export default SummaryList;
