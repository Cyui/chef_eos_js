import React from "react";
import { useState, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { CMenu } from "../../../model/chefmenu";
import { COption, CProduct, COrder } from "../../../model/invoice";

const ProductRow = ({ id, order, setOrders }) => {
  //console.log(order)

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

  const handleSelectProdNameChange = (_, value) => {
    menu.products.forEach((item) => {
      if (item.name === value) {
        setProduct(item);
        orderRef.current.product = item;
      }
    });

    pushOrder();

    setOptions(null);
  };

  const handleSelectOptTagOpen = (_) => {
    setOptionList(() => {
      let optList = [];

      menu.options.forEach((item) => {
        item.avlid.forEach((id) => {
          if (id === product.id) optList.push(item.option.tag);
        });
      });

      return optList;
    });
  };

  const handleSelectOptTagChange = (_, value) => {
    menu.options.forEach((item) => {
      if (item.option.tag === value) {
        setOptions([item.option]);
        orderRef.current.product.options = [item.option];
      }
    });

    pushOrder();

    //setOptionValue(value)
  };

  const handleSelQuantityChange = (_, value) => {
    setQuantity(Number(value));
    orderRef.current.quantity = Number(value);

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
      <Stack direction="row" spacing={1}>
        <div>
          <Autocomplete
            sx={{ width: 194 }}
            options={productList}
            value={product.name}
            onChange={handleSelectProdNameChange}
            renderInput={(params) => <TextField {...params} label="品項" />}
          />
        </div>

        <div>
          <Autocomplete
            sx={{ width: 120 }}
            options={optionList}
            getOptionLabel={(option) => option}
            value={options?.[0]?.tag || null}
            // defaultValue={ ()=>{
            //         return (options) ? options[0].tag : null
            //     }
            // }
            onChange={handleSelectOptTagChange}
            onOpen={handleSelectOptTagOpen}
            renderInput={(params) => <TextField {...params} label="選項" />}
          />
        </div>

        <div>
          <Autocomplete
            sx={{ width: 100 }}
            options={quantityList}
            value={quantity.toString()}
            onChange={handleSelQuantityChange}
            renderInput={(params) => <TextField {...params} label="數量" />}
          />
        </div>

        {orderRef.current.subtotal}
        <Button variant="contained" color="primary" onClick={handleDelOrderClick}>
          {" "}
          Delete{" "}
        </Button>
      </Stack>
    </div>
  );
};

export default ProductRow;
