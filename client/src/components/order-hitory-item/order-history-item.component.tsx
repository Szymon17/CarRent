import "./order-history-item.styles.sass";
import { FC, useEffect, useRef, useState } from "react";
import { userOrder } from "../../store/user/user.types";
import { calculatePrice, dateToLocalString, today } from "../../utils/basicFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import ProductDetails from "../product-details/product-details.component";
import { useTranslation } from "react-i18next";

type status = "Pending" | "Finished" | "Canceled";

const OrderHistoryItem: FC<{ order: userOrder }> = ({ order }) => {
  const { car, data } = order;

  const { t } = useTranslation();
  const itemRef = useRef<HTMLDivElement | null>(null);

  const [extended, setExtendState] = useState(false);
  const [status, setStatus] = useState<status>("Pending");

  const extend = () => {
    const itemCard = itemRef.current;

    if (itemCard) {
      setExtendState(!extended);
      itemCard.classList.toggle("extended");
    }
  };

  useEffect(() => {
    if (today < new Date(data.date_of_receipt)) setStatus("Pending");
    else if (data.canclel) setStatus("Canceled");
    else setStatus("Finished");
  }, []);

  return (
    <div ref={itemRef} className="orderHistoryItem">
      <div className="orderHistoryItem__header">
        <img className="orderHistoryItem__img" src={car.image_url} alt="car-img" />
        <div className="orderHistoryItem__description">
          <h2 className="orderHistoryItem__title">{`${car.brand} ${car.model}`}</h2>
          <div className="orderHistoryItem__basicData">
            <span className="orderHistoryItem__basicData__item">{`${t("Pick up date")}: ${dateToLocalString(new Date(data.date_of_receipt))}`}</span>
            <span className="orderHistoryItem__basicData__item">{`${t("Pick up location")}: ${data.place_of_receipt}`}</span>
            <span className="orderHistoryItem__basicData__item">{`${t("Return date")}: ${dateToLocalString(new Date(data.date_of_return))}`}</span>
            <span className="orderHistoryItem__basicData__item">{`${t("Return location")}: ${data.place_of_return}`}</span>
          </div>
          <FontAwesomeIcon onClick={extend} className="orderHistoryItem__extendIcon" icon={faAnglesDown} />
        </div>
      </div>
      <div className="orderHistoryItem__body">
        <h3 className="orderHistoryItem__price">{`${t("Amount")}: ${calculatePrice(
          car.daily_price,
          data.date_of_receipt,
          data.date_of_return
        )} ZŁ`}</h3>
        {<ProductDetails product={car} />}
      </div>
      <div className="orderHistoryItem__statusBox">
        <span>Status:</span>
        <span className={`orderHistoryItem__${status.toLowerCase()}`}>{t(status)}</span>
      </div>
    </div>
  );
};

export default OrderHistoryItem;
