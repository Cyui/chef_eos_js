import * as React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { COption, CProduct, COrder } from "../../../model/invoice";
import { CMenu } from "../../../model/chefmenu";
import * as firebase from "../../../model/firebase";

const ProductRow = ({ id, order, setOrders }) => {
  const menu = firebase.Menu;

  const quantityList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const [product, setProduct] = React.useState(order.product || null);
  const [options, setOptions] = React.useState(order.product.options || undefined);
  const [quantity, setQuantity] = React.useState(order.quantity || 1);
  const orderRef = React.useRef(order);

  React.useEffect(() => {
    orderRef.current = new COrder(
      id,
      new CProduct(product.id, product.name, product.price, options),
      quantity
    );

    pushOrder();
  }, [product, options, quantity]);

  const pushOrder = () => {
    setOrders((orders) => {
      return orders.map((item) => {
        if (item.id === id) {
          item = orderRef.current;
        }

        return item;
      });
    });
  };

  const getProductList = () => {
    return menu.products.map((item) => {
      return (
        <MenuItem key={item.id} value={item.name}>
          {item.name}
        </MenuItem>
      );
    });
  };

  const handleSelectProductChange = (event) => {
    menu.products.forEach((item) => {
      if (item.name === event.target.value) {
        setProduct(item);
      }
    });

    setOptions(undefined);
  };

  const getOptionList = () => {
    let optList = [];

    menu.options.forEach((item) => {
      item.valid.forEach((id) => {
        if (id === product.id) optList.push(item.option.tag);
      });
    });

    return optList.map((item) => {
      return (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      );
    });
  };

  const handleSelectOptionChange = (event) => {
    menu.options.forEach((item) => {
      if (item.option.tag === event.target.value) {
        setOptions([item.option]);
      }
    });
  };

  const getQuantityList = () => {
    return quantityList.map((item) => {
      return (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      );
    });
  };

  const handleSelQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handleDelOrderClick = () => {
    setOrders((orders) => {
      return orders.filter((item) => item.id !== id);
    });
  };

  return (
    // <ListItem
    //   secondaryAction={
    //     <IconButton edge="end" aria-label="delete">
    //       <DeleteIcon />
    //     </IconButton>
    //   }
    // >
    <Stack direction="row" spacing={1} sx={{ m: 1 }}>
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
        >
          {getOptionList()}
        </Select>
      </FormControl>

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

      <IconButton aria-label="delete" onClick={handleDelOrderClick}>
        <DeleteIcon />
      </IconButton>
    </Stack>
    // </ListItem>
  );
};

export default ProductRow;
