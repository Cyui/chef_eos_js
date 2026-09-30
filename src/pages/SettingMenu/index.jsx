import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FolderIcon from "@mui/icons-material/Folder";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { ProjectSelected } from "../../model/firebase";

const SettingMenu = () => {
  const navigate = useNavigate();

  const handleSetMenuProductsClick = () => {
    navigate("./menu");
  };

  const handleSetMenuOptionsClick = () => {
    navigate("./options");
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  const handleReturnClick = () => {
    navigate("/", { replace: true });
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={4} sx={{ mx: 8, my: 4 }}>
          {ProjectSelected && <>
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleSetMenuProductsClick}
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
          </>}
          <Button
            sx={{ py: 2 }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={() => navigate("./projects")}
            startIcon={<FolderIcon />}
          >
            專案設定
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 10 }}>
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
            <IconButton sx={{ m: 1 }} aria-label="cancel" color="error" onClick={handleCancelClick}>
              <CloseIcon />
            </IconButton>
          </div>
                  </Stack>
      </Box>
    </div>
  );
};

export default SettingMenu;

