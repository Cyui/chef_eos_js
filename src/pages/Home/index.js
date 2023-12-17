import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import * as firebase from "../../model/firebase";

const Home = () => {
  const navigate = useNavigate();

  firebase.getUserInfo();
  firebase.pullAllInvoiceFromFirebase();
  firebase.getLastInvoiceFromFirebase();

  const handleNewClick = () => {
    navigate("../edit");
  };

  const handleSummaryClick = () => {
    navigate("../summary", { state: firebase.invoices });
  };

  const handleListClick = () => {
    navigate("../list", { state: firebase.invoices });
  };

  const handleQueryClick = () => {
    navigate("../query");
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={4} sx={{ m: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleNewClick}
          >
            New Order
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleSummaryClick}
          >
            Summary
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleListClick}
          >
            List
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleQueryClick}
          >
            Query
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default Home;
