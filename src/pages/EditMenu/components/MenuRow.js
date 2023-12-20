import React from "react";
import { useRef } from "react";
import useState from "react-usestateref";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { CMenu } from "../../../model/chefmenu";
import { COption, CProduct, COrder } from "../../../model/invoice";
import * as firebase from "../../../model/firebase";

const MenuRow = ({ id, name, price, setMenuProducts }) => {

  const [prodName, setProdName, prodNameRef] = useState(name);
  const [prodPrice, setProdPrice, prodPriceRef] = useState(price);

  const pushMenuProduct = () => {
    setMenuProducts((products) => {
      return products.map((item) => {
        if (item.id === id) {
          item.name = prodNameRef.current;
          item.price = prodPriceRef.current;
        }
        return item;
      });
    });
  };

  return (
    <div>
      <Stack direction="row" spacing={1}  sx={{ m: 2 }}>
        <div>
          <TextField
              sx={{ width: 164 }}
              id="textName"
              label="品項"
              variant="outlined"
              //fullWidth
              value={prodName}
              onChange={(e) => {
                setProdName(e.target.value);
                pushMenuProduct()
              }}
            />
        </div>

        <div>
          <TextField
              sx={{ width: 140 }}
              id="textPrice"
              label="價格"
              variant="outlined"
              //fullWidth
              value={prodPrice}
              onChange={(e) => {
                setProdPrice(Number(e.target.value)|| 0);
                pushMenuProduct()
              }}
            />
        </div>

        <IconButton aria-label="delete" onClick={()=>{
          setMenuProducts((products) => {
            return products.filter((item) => item.id !== id);
          });
        }}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </div>
  );
};

export default MenuRow;
