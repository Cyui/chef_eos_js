import React from "react";
import { useRef, useEffect } from "react";
import useState from "react-usestateref";
//import  from "react-usestateref";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { blue, red, green } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Typography from "@mui/material/Typography";
import "dayjs/locale/zh-tw";
import MenuList from "./components/MenuList";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CInfo, CProduct, CInvoice, invoiceFromObject } from "../../model/invoice";
import * as firebase from "../../model/firebase";
import { v4 } from "uuid";

export var serialNo = 0;

const EditMenu = () => {
  const navigate = useNavigate();

  const [menuProducts, setMenuProducts, menuProductsRef] = useState(firebase.Menu.products.map(
    (item) => new CProduct(item.id, item.name, item.price)
  ) || []);

  useEffect(() => {
    
  });

  const handleSubmitClick = () => {
    //console.log(menuProductsRef.current)
    firebase.Menu.products = menuProductsRef.current
    firebase.pushMenuToFirebase(firebase.Menu)

    navigate(-1);
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  const handleReturnClick = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ m: 0 }}>
      <div>
        <MenuList
          menuProducts={menuProducts}
          setMenuProducts={setMenuProducts}
        />

        <IconButton
          sx={{ m: 1 }}
          aria-label="add"
          color="primary"
          onClick={ () =>
            setMenuProducts((menuProducts) => [...menuProducts, new CProduct(v4(), "", 0)])
          }
        >
          <AddIcon />
        </IconButton>

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
          <div>
            <IconButton
              sx={{ m: 1, mx: 6 }}
              aria-label="submit"
              color="success"
              onClick={handleSubmitClick}
            >
              <DoneIcon />
            </IconButton>
          </div>
          {/* </Link> */}
        </Stack>
      </div>
    </Box>
  );
};

export default EditMenu;
