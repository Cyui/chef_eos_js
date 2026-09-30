import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import MenuList from "./components/MenuList";
import { useNavigate } from "react-router-dom";
import { CProduct } from "../../model/invoice";
import * as firebase from "../../model/firebase";
import { v4 } from "uuid";

import Alert from "@mui/material/Alert";
import useAsyncAction from "../../hooks/useAsyncAction";

const EditMenu = () => {
  const navigate = useNavigate();

  const [menuProducts, setMenuProducts] = React.useState(() => firebase.Menu.products.map((item) => new CProduct(item.id, item.name, item.price)));
  const { run, pending, error } = useAsyncAction("儲存失敗，請稍後再試。");

  const handleSubmitClick = () => run(async () => {
    await firebase.pushMenuToFirebase({ ...firebase.Menu, products: menuProducts });
    navigate(-1);
  });

  const handleCancelClick = () => {
    navigate("/");
  };

  const handleReturnClick = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ m: 0 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <div>
        <MenuList menuProducts={menuProducts} setMenuProducts={setMenuProducts} />

        <IconButton
          sx={{ m: 1 }}
          aria-label="add"
          color="primary"
          onClick={() =>
            setMenuProducts((menuProducts) => [...menuProducts, new CProduct(v4(), "", 0)])
          }
        >
          <AddIcon />
        </IconButton>

        <Stack direction="row" spacing={1} sx={{ mb: 10 }}>
                    <div>
            <IconButton
              sx={{ m: 1 }}
              aria-label="return"
              color="primary"
              onClick={handleReturnClick} disabled={pending}
            >
              <KeyboardReturnIcon />
            </IconButton>
          </div>
          <div>
            <IconButton sx={{ m: 1 }} aria-label="cancel" color="error" onClick={handleCancelClick} disabled={pending}>
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            <IconButton
              sx={{ m: 1, mx: 6 }}
              aria-label="submit"
              color="success"
              onClick={handleSubmitClick}
              disabled={pending}
            >
              <DoneIcon />
            </IconButton>
          </div>
                  </Stack>
      </div>
    </Box>
  );
};

export default EditMenu;

