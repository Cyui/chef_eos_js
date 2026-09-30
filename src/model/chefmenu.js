import { COption, CProduct } from "./invoice";

class CMenu {
  constructor() {
    this.products = [];
    this.options = [];
  }
}

const menuFromObject = (obj) => {
  const menu = new CMenu();

  menu.products = obj.products.map(
    (item) => new CProduct(item.id, item.name, item.price)
  );

  menu.options = obj.options.map((element) => {
    return {
      option: new COption(
        element.option.id,
        element.option.tag,
        element.option.diff
      ),
      valid: [...element.valid],
    };
  });

  return menu;
};

export { CMenu, menuFromObject };

