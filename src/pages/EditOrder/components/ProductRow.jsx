import * as React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CProduct, COrder } from "../../../model/invoice";
import * as firebase from "../../../model/firebase";

const ProductRow = ({ id, order, setOrders }) => {
  const menu = firebase.Menu;

  const { product, quantity } = order;
  const options = product.options;
  const availableOptions = menu.options.filter((item) => item.valid.includes(product.id));
  const updateOrder = (nextProduct = product, nextQuantity = quantity) => {
    setOrders((items) => items.map((item) => item.id === id
      ? new COrder(id, nextProduct, nextQuantity) : item));
  };
  const handleSelectProductChange = (event) => {
    const selected = menu.products.find((item) => item.id === event.target.value);
    if (selected) updateOrder(new CProduct(selected.id, selected.name, selected.price));
  };
  const handleSelectOptionChange = (event) => {
    const selected = availableOptions.find((item) => item.option.id === event.target.value);
    updateOrder(new CProduct(product.id, product.name, product.price, selected ? [selected.option] : undefined));
  };
  const handleSelQuantityChange = (event) => updateOrder(product, Number(event.target.value));
  const handleDelOrderClick = () => setOrders((items) => items.filter((item) => item.id !== id));

  return (
        <Stack direction="row" spacing={1} sx={{ m: 1 }}>
      <FormControl>
        <InputLabel id={`product-label-${id}`}>品項</InputLabel>
        <Select
          labelId={`product-label-${id}`}
          id={`product-select-${id}`}
          sx={{ width: 145 }}
          value={menu.products.some((item) => item.id === product.id) ? product.id : ""}
          label="品項"
          onChange={handleSelectProductChange}
        >
          {menu.products.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel id={`option-label-${id}`}>選項</InputLabel>
        <Select
          labelId={`option-label-${id}`}
          id={`option-select-${id}`}
          sx={{ width: 95 }}
          value={availableOptions.some((item) => item.option.id === options?.[0]?.id) ? options[0].id : ""}
          label="選項"
          onChange={handleSelectOptionChange}
        >
          {availableOptions.map((item) => <MenuItem key={item.option.id} value={item.option.id}>{item.option.tag}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel id={`quantity-label-${id}`}>數量</InputLabel>
        <Select
          labelId={`quantity-label-${id}`}
          id={`quantity-select-${id}`}
          sx={{ width: 80 }}
          value={quantity.toString()}
          label="數量"
          onChange={handleSelQuantityChange}
        >
          {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
        </Select>
      </FormControl>

      <IconButton aria-label="delete" onClick={handleDelOrderClick}>
        <DeleteIcon />
      </IconButton>
    </Stack>
      );
};

export default ProductRow;

