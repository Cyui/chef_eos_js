import { COption, CProduct } from "./invoice";

class CMenu {
  constructor() {
    this.products = [
      // new CProduct("acb5721f-50de-4af0-8d9c-3b8288d66f80", "極品佛跳牆", 1650),
      // new CProduct("46686bef-c08e-4c71-973f-e6f104def74a", "清蒸紅條魚", 1200),
      // new CProduct("c681a495-6cec-4fec-a400-631cb4125ef8", "豆酥白鯧魚", 880),
      // new CProduct("7fbac97a-86b0-418a-b703-86b2c14c3ed2", "茄汁大蝦", 650),
      // new CProduct("23a69af2-3533-4b9e-8118-ff8721f2a7e8", "富貴元蹄", 650),
      // new CProduct("6a82ef7e-f210-4c4c-8c60-99cc5623ac7f", "干貝芥菜心", 450),
      // new CProduct("2cc9f007-25a1-4614-841a-d0da640be344", "櫻花蝦米糕", 600),
      // new CProduct("d65c30a8-907a-45aa-93ee-f5472344461c", "廣式叉燒", 500),
      // new CProduct("2ae7a951-3760-418e-8297-ee23282472dd", "鹿茸蟲草燉全雞", 1300),
      // new CProduct("12a5eb2e-976d-4851-96d4-2d8d838fcd6a", "山藥竹笙排骨湯", 600),
      // new CProduct("b790625f-c659-4ab7-a08d-352fe638611d", "迎春拼盤", 1300),
      // new CProduct("8bde78c7-69ae-435b-9ecf-49de9fa63ed6", "紹興醉雞", 500),
      // new CProduct("bf4607f7-85ce-4224-8b18-f6a63cc2c251", "彈牙牛肚", 420),
      // new CProduct("6f3f66ba-62b4-4d5d-b2f8-631772ef89b2", "功夫牛腱", 400),
      // new CProduct("a03178c7-1a85-455f-ae4b-274258c271f2", "廣式肝腸", 200),
      // new CProduct("21f05c71-2795-41ed-b5d6-c0d579e1db6d", "廣式臘腸", 200),
      // new CProduct("7a014e7c-b56e-4112-845e-a382c169280e", "涼拌海蜇絲", 180),
      // new CProduct("0d0b8290-bdf9-4355-b06a-a21ec1dbaf82", "干貝珍珠丸", 600),
      // new CProduct("639e9e70-5b46-40ea-a3ee-9927fffb1473", "五更腸旺", 0),
      // new CProduct("16c6219c-c4a1-42ff-bf85-d167a121a02e", "筍絲", 0)
    ];

    this.options = [
      // {
      //   option: new COption("a5b8dfa1-8cc8-4d7a-9c99-6f07be5dce6a", "熱", 0),
      //   valid: ["acb5721f-50de-4af0-8d9c-3b8288d66f80",
      //           "2cc9f007-25a1-4614-841a-d0da640be344"],
      // },

      // {
      //   option: new COption("a5b7ad6d-11f9-40d8-8935-c54ccde45137", "凍", -50),
      //   valid: ["acb5721f-50de-4af0-8d9c-3b8288d66f80",
      //           "2cc9f007-25a1-4614-841a-d0da640be344"],
      // },

      // {
      //   option: new COption("c3f6d16d-6194-40b4-aa40-87d3cd62e0ae", "切", 0),
      //   valid: ["d65c30a8-907a-45aa-93ee-f5472344461c",
      //           "8bde78c7-69ae-435b-9ecf-49de9fa63ed6",
      //           "bf4607f7-85ce-4224-8b18-f6a63cc2c251",
      //           "6f3f66ba-62b4-4d5d-b2f8-631772ef89b2",
      //           "a03178c7-1a85-455f-ae4b-274258c271f2",
      //           "21f05c71-2795-41ed-b5d6-c0d579e1db6d"],
      // },

      // {
      //   option: new COption("f3330458-7baf-478f-91a2-3f9514d20192", "不切", 0),
      //   valid: ["d65c30a8-907a-45aa-93ee-f5472344461c",
      //           "8bde78c7-69ae-435b-9ecf-49de9fa63ed6",
      //           "bf4607f7-85ce-4224-8b18-f6a63cc2c251",
      //           "6f3f66ba-62b4-4d5d-b2f8-631772ef89b2",
      //           "a03178c7-1a85-455f-ae4b-274258c271f2",
      //           "21f05c71-2795-41ed-b5d6-c0d579e1db6d"],
      // },
    ];
  }
}

const menuFromObject = (obj) => {
  let menu = new CMenu();

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
      valid: element.valid,
    };
  });

  return menu;
};

export { CMenu, menuFromObject };
