import "./order-history-item.styles.sass";
import { FC, useEffect, useState } from "react";
import { userOrder } from "../../store/user/user.types";
import { calculatePrice, dateToLocalString, today } from "../../utils/basicFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCalendarAlt, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import ProductDetails from "../product-details/product-details.component";
import { useTranslation } from "react-i18next";

type OrderStatus = "Pending" | "Finished" | "Canceled";

const OrderHistoryItem: FC<{ order: userOrder }> = ({ order }) => {
  const { car, data } = order;
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<OrderStatus>("Pending");

  useEffect(() => {
    if (today < new Date(data.date_of_receipt)) setStatus("Pending");
    else if (data.canclel) setStatus("Canceled");
    else setStatus("Finished");
  }, []);

  const price = calculatePrice(car.daily_price, data.date_of_receipt, data.date_of_return);

  return (
    <div className={`order-history-item${expanded ? " order-history-item--expanded" : ""}`}>
      <div className="order-history-item__header" onClick={() => setExpanded(e => !e)}>
        <img className="order-history-item__img" src={car.image_url} alt={`${car.brand} ${car.model}`} />
        <div className="order-history-item__info">
          <div className="order-history-item__row">
            <h3 className="order-history-item__title">
              {car.brand} {car.model}
            </h3>
            <span className={`order-history-item__status order-history-item__status--${status.toLowerCase()}`}>{t(status)}</span>
          </div>
          <ul className="order-history-item__meta">
            <li>
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>
                {t("Pick up date")}: {dateToLocalString(new Date(data.add_date))}
              </span>
            </li>
            <li>
              <FontAwesomeIcon icon={faCalendarAlt} />
              <span>
                {t("Return date")}: {data.date_of_return ? dateToLocalString(new Date(data.date_of_return)) : t("N/A")}
              </span>
            </li>
            <li>
              <FontAwesomeIcon icon={faLocationDot} />
              <span>
                {t("Pick up location")}: {data.place_of_receipt}
              </span>
            </li>
            <li>
              <FontAwesomeIcon icon={faLocationDot} />
              <span>
                {t("Return location")}: {data.place_of_return}
              </span>
            </li>
          </ul>
          <div className="order-history-item__row order-history-item__row--footer">
            <span className="order-history-item__price">{price} PLN</span>
            <span className="order-history-item__toggle-hint">
              {t("Details")}
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </div>
        </div>
      </div>
      <div className="order-history-item__body">
        <ProductDetails product={car} />
      </div>
    </div>
  );
};

export default OrderHistoryItem;
