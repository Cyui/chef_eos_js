import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import * as Colors from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { CSummary } from "../../model/summary";
import * as firebase from "../../model/firebase";

const SummaryList = () => {
    const navigate = useNavigate();

  const summary = new CSummary(firebase.Invoices);
  
  let rows = summary.report();

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>品項</TableCell>
              <TableCell align="right">數量</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ color: row.color }}>
                  {row.name}
                </TableCell>
                <TableCell align="right" sx={{ color: row.color }}>
                  {row.qty}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography sx={{ width: 164, m: 2 }} variant="h6" gutterBottom color={Colors.blue[500]}>
        總金額: {summary.total}
      </Typography>

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
    </div>
  );
};

export default SummaryList;
