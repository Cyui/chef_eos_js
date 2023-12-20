import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import MenuRow from "./MenuRow";
import { CProduct } from "../../../model/invoice";

const MenuList = ({ menuProducts, setMenuProducts }) => {
  return (
    <div>
      {menuProducts.map((product) => {
        return (
          <MenuRow
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            setMenuProducts={setMenuProducts}
          />
        );
      })}
    </div>
  );
};

export default MenuList;
