import React from "react";
import { useState, useRef } from "react";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControl from '@mui/material/FormControl';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { CMenu } from "../../../model/chefmenu";
import { COption, CProduct, COrder } from "../../../model/invoice";

const ProductRow = ({ id, order, setOrders }) => {
  const menu = new CMenu();

  const productList = menu.products.map((prod) => prod.name);
  const quantityList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [optionList, setOptionList] = useState([]);

  const [product, setProduct] = useState(order.product || null);
  const [options, setOptions] = useState(order.product.options || null);
  const [quantity, setQuantity] = useState(order.quantity || 1);
  const orderRef = useRef(order);

  const pushOrder = () => {
    setOrders((orders) => {
      return orders.map((item) => {
        if (item.id === id) {
          //item = orderRef.current //must COrder id equ
          // order.product = product
          // order.product.options = options
          // order.product.quantity = quantity

          item = orderRef.current; //must COrder id equ
        }

        return item;
      });
    });
  };

  const getProductList = () => {
    return menu.products.map((item) => {
      return <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>;
    });
  };

  const handleSelectProductChange = (event) => {
    menu.products.forEach((item) => {
      if (item.name === event.target.value) {
        setProduct(item);
        orderRef.current.product = item;
      }
    });

    pushOrder();

    setOptions(null);
  };

  const getOptionList = () => {
    let optList = [];

    menu.options.forEach((item) => {
      item.valid.forEach((id) => {
        if (id === product.id) optList.push(item.option.tag);
      });
    });

    return optList.map((item) => {
      return <MenuItem key={item} value={item}>{item}</MenuItem>;
    });
  };

  const handleSelectOptionOpen = (_) => {
    setOptionList(() => {
      let optList = [];

      menu.options.forEach((item) => {
        item.valid.forEach((id) => {
          if (id === product.id) optList.push(item.option.tag);
        });
      });

      return optList;
    });
  };

  const handleSelectOptionChange = (event) => {
    menu.options.forEach((item) => {
      if (item.option.tag === event.target.value) {
        setOptions([item.option]);
        orderRef.current.product.options = [item.option];
      }
    });

    pushOrder();
  };

  const getQuantityList = () => {
    return quantityList.map((item) => {
      return <MenuItem key={item} value={item}>{item}</MenuItem>;
    });
  };

  const handleSelQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
    orderRef.current.quantity = Number(event.target.value);

    pushOrder();
  };

  const handleDelOrderClick = () => {
    //filter order for delete
    setOrders((orders) => {
      return orders.filter((item) => item.id !== id);
    });
  };

  return (
    <div>
      <Stack direction="row" spacing={1}  sx={{ m: 1 }}>
        <div>
          <FormControl>
            <InputLabel id="label_product">品項</InputLabel>
            <Select
              labelId="label_product"
              id="product_select"
              sx={{ width: 145 }}
              defaultValue=""
              value={product.name}
              label="品項"
              onChange={handleSelectProductChange}
            >
              {getProductList()}
            </Select>
          </FormControl>
        </div>

        <div>
          <FormControl>
            <InputLabel id="label_option">選項</InputLabel>
            <Select
              labelId="label_option"
              id="option_select"
              sx={{ width: 95 }}
              defaultValue=""
              value={options?.[0]?.tag || ""}
              label="選項"
              onChange={handleSelectOptionChange}
              onOpen={handleSelectOptionOpen}
            >
              {getOptionList()}
            </Select>
          </FormControl>
        </div>

        <div>
          <FormControl>
            <InputLabel id="label_quantity">數量</InputLabel>
            <Select
              labelId="label_quantity"
              id="quantity_select"
              sx={{ width: 80 }}
              defaultValue=""
              value={quantity.toString()}
              label="數量"
              onChange={handleSelQuantityChange}
            >
              {getQuantityList()}
            </Select>
          </FormControl>
        </div>

        {/* {orderRef.current.subtotal} */}
        <IconButton aria-label="delete" onClick={handleDelOrderClick}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </div>
  );
};

export default ProductRow;
