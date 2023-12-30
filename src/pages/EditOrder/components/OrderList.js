import ProductRow from "./ProductRow";

const OrderList = ({ orders, setOrders }) => {
  return (
    <div>
      {orders.map((item) => {
        return (
          <ProductRow
            key={item.id}
            id={item.id}
            order={item}
            setOrders={setOrders}
          />
        );
      })}
    </div>
  );
};

export default OrderList;
