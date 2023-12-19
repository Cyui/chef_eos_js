import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListIcon from "@mui/icons-material/List";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import * as firebase from "../../model/firebase";

const Home = () => {
  const navigate = useNavigate();

  firebase.getUserInfoFromFirebase();
  firebase.pullAllInvoiceFromFirebase();
  firebase.getLastInvoiceFromFirebase();

  const handleNewClick = () => {
    navigate("../edit");
  };

  const handleSummaryClick = () => {
    navigate("../summary", { state: firebase.Invoices });
  };

  const handleListClick = () => {
    navigate("../list", { state: firebase.Invoices });
  };

  const handleQueryClick = () => {
    navigate("../query");
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h6" gutterBottom sx={{ m: 1 }}>
          {firebase.mail}
        </Typography>

        <Stack spacing={4} sx={{ mx: 8, my: 4 }}>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleNewClick}
            startIcon={<AddIcon />}
          >
            新增
          </Button>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleSummaryClick}
            startIcon={<BarChartIcon />}
          >
            統計
          </Button>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleListClick}
            startIcon={<ListIcon />}
          >
            列表
          </Button>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleQueryClick}
            startIcon={<SearchIcon />}
          >
            查詢
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default Home;
