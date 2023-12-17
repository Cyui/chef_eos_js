import ProductRow from "./ProductRow";

const OrderList = ({ orders, setOrders }) => {
  return (
    <div>
      {orders.map((order) => {
        return (
          <ProductRow
            key={order.id}
            id={order.id}
            order={order}
            setOrders={setOrders}
          />
        );
      })}
    </div>
  );
};

export default OrderList;
