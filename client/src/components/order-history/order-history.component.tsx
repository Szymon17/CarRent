import "./order-history.styles.sass";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomError from "../custom-error/custom-error.component";
import OrderHistoryItem from "../order-hitory-item/order-history-item.component";
import { serverUrl } from "../../utils/fetchFunctions";
import { fullUserOrder } from "../../store/user/user.types";

const OrderHistory = () => {
  const { t } = useTranslation();

  const [orders, setOrders] = useState<fullUserOrder[]>([]);
  const delayRef = useRef(false);

  const getLastIndex = (): string => {
    return orders[orders.length - 1]?.data.id.toString() ?? "-1";
  };

  const getUserOrders = async () => {
    if (delayRef.current === true) return;
    delayRef.current = true;

    try {
      const req = await fetch(serverUrl + "/user_orders?index=" + getLastIndex(), { credentials: "include" });
      const res = await req.json();

      if (res.status === "ok") setOrders(prv => [...prv, ...res.payload]);
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => (delayRef.current = false), 1000);
  };

  const scrollEvent = (e: React.UIEvent<HTMLDivElement>) => {
    if (delayRef.current) return;

    const el = e.currentTarget;

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 30;

    if (isBottom) {
      getUserOrders();
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <div onScroll={scrollEvent} className="order-history">
      {orders && orders?.map((order, index) => <OrderHistoryItem key={index} order={order} />)}
      {orders.length === 0 && (
        <div className="order-history__box">
          <CustomError>{t("There is nothing to display")}</CustomError>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
