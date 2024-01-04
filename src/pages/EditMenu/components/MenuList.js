import * as React from "react";
import MenuRow from "./MenuRow";
import { CProduct } from "../../../model/invoice";

const MenuList = ({ menuProducts, setMenuProducts }) => {
  return (
    <div>
      {menuProducts.map((item) => {
        return <MenuRow key={item.id} product={item} setMenuProducts={setMenuProducts} />;
      })}
    </div>
  );
};

export default MenuList;
