import React from "react";
import ReactDOM from "react-dom/client";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from "@mui/material/IconButton";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CloseIcon from "@mui/icons-material/Close";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Typography from "@mui/material/Typography";
import * as firebase from "../../model/firebase";
import {CMenu} from "../../model/chefmenu"

const SettingMenu = () => {
  const navigate = useNavigate();

  const handleSetMenuProductslick = () => {
    navigate("./menu");
  };

  const handleSetMenuOptionsClick = () => {
    navigate("");
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  const handleReturnClick = () => {
    navigate(-1);
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={4} sx={{ mx: 8, my: 4 }}>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleSetMenuProductslick}
            startIcon={<MenuIcon />}
          >
            設定菜單品項
          </Button>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleSetMenuOptionsClick}
            startIcon={<QuestionMarkIcon />}
          >
            設定菜單選項
          </Button>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={()=>{
              console.log("Test")







            }}
          >
            測試
          </Button>
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
          {/* </Link> */}
        </Stack>

      </Box>
    </div>
  );
};

export default SettingMenu;
