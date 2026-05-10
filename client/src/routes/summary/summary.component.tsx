import "./summary.styles.sass";
import Button from "../../components/button/button.component";
import Payments from "../../components/payments/payments.component";
import { BUTTON_CLASSES } from "../../components/button/button.component";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/hooks";
import { selectOrder } from "../../store/order/order.selector";
import { selectUser } from "../../store/user/user.selectors";
import { useEffect } from "react";
import { dateToLocalString } from "../../utils/basicFunctions";
import { selectProductByIndex } from "../../store/products/products.selectors";
import { useNavigate } from "react-router-dom";
import { saveOrderFetch } from "../../utils/fetchFunctions";
import { toast } from "react-toastify";
import { faCalendarAlt, faCarRear, faCreditCard, faEnvelope, faLocationDot, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Summary = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const order = useAppSelector(selectOrder);
  const user = useAppSelector(selectUser);
  const product = useAppSelector(selectProductByIndex(order.productIndex ? order.productIndex : -1));

  useEffect(() => {
    if (!user) navigate("/log-in");
    if (!product) navigate("/offers");
  }, [user]);

  const submit = async () => {
    if (product?.id) {
      const status = await saveOrderFetch(order);
      if (status === "ok") {
        toast.success(t("Ordered"));
        navigate("/");
      }
    }
  };

  const total = order.dayQuantity * (product?.daily_price ?? 0);

  return (
    <div className="summary container">
      <div className="summary__left">
        <div className="summary__section">
          <h3 className="summary__title">
            <FontAwesomeIcon icon={faLocationDot} />
            {t("Receipt data")}
          </h3>
          <div className="summary__order-data">
            {/* Dates & locations */}
            <div>
              <div className="summary__order-data__title">{t("Pick-up and drop-off")}</div>
              <ul>
                <li>
                  <span className="summary__order-data__item-label">{t("Pick up date")}</span>
                  <span className="summary__order-data__item-value">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    {dateToLocalString(new Date(order.date_of_receipt))}
                  </span>
                </li>
                <li>
                  <span className="summary__order-data__item-label">{t("Return date")}</span>
                  <span className="summary__order-data__item-value">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    {dateToLocalString(new Date(order.date_of_return))}
                  </span>
                </li>
                <li>
                  <span className="summary__order-data__item-label">{t("Pick up location")}</span>
                  <span className="summary__order-data__item-value">
                    <FontAwesomeIcon icon={faLocationDot} />
                    {order.place_of_receipt}
                  </span>
                </li>
                <li>
                  <span className="summary__order-data__item-label">{t("Return location")}</span>
                  <span className="summary__order-data__item-value">
                    <FontAwesomeIcon icon={faLocationDot} />
                    {order.place_of_return}
                  </span>
                </li>
              </ul>
            </div>

            {/* Client info */}
            <div>
              <div className="summary__order-data__title">{t("Client data")}</div>
              <ul>
                <li>
                  <span className="summary__order-data__item-label">Email</span>
                  <span className="summary__order-data__item-value">
                    <FontAwesomeIcon icon={faEnvelope} />
                    {user?.email}
                  </span>
                </li>
                <li>
                  <span className="summary__order-data__item-label">{t("Name")}</span>
                  <span className="summary__order-data__item-value">
                    <FontAwesomeIcon icon={faUser} />
                    {user?.name} {user?.surname}
                  </span>
                </li>
                <li>
                  <span className="summary__order-data__item-label">{t("Phone number")}</span>
                  <span className="summary__order-data__item-value">
                    <FontAwesomeIcon icon={faPhone} />
                    {user?.phoneNumber}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="summary__section">
          <h3 className="summary__title">
            <FontAwesomeIcon icon={faCreditCard} />
            {t("Payments")}
          </h3>
          <Payments />
        </div>

        {/* Product */}
        {product && (
          <div className="summary__section">
            <h3 className="summary__title">
              <FontAwesomeIcon icon={faCarRear} />
              {t("Product Card")}
            </h3>
            <a href={`/product/${product.brand}-${product.model}-${product.id}`} className="summary-product">
              <img className="summary-product__img" src={product.image_url} alt={`${product.brand} ${product.model}`} />
              <div className="summary-product__detatils">
                <div>
                  <h3 className="summary-product__name">
                    {product.brand} {product.model}
                  </h3>
                  <div className="summary-product__additional-text">
                    {product.engine_capacity} · {t(product.fuel_type)} · {product.power} HP
                  </div>
                </div>
                <div className="summary-product__price">
                  {product.daily_price} PLN<span className="price__unit">/{t("Day")}</span>
                </div>
              </div>
            </a>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div className="summary__right">
        <div className="summary__right__card">
          <h3 className="summary__right__title">{t("Costs summary")}</h3>
          <div className="summary__right__informations">
            <div className="summary__right__row">
              <span className="summary__right__row-label">{t("Daily Rate")}</span>
              <span className="summary__right__row-value">{product?.daily_price} PLN</span>
            </div>
            <div className="summary__right__row">
              <span className="summary__right__row-label">{t("Rental days")}</span>
              <span className="summary__right__row-value">
                {order.dayQuantity} {t("Days")}
              </span>
            </div>
            <div className="summary__right__row">
              <span className="summary__right__row-label">{t("Additional costs")}</span>
              <span className="summary__right__row-value">0 PLN</span>
            </div>
            <div className="summary__right__row summary__right__row--total">
              <span className="summary__right__row-label">{t("Total Amount")}</span>
              <span className="summary__right__row-value">{total.toFixed(2)} PLN</span>
            </div>
          </div>
          <div className="summary__right__actions">
            <Button buttonType={BUTTON_CLASSES.green} onClick={submit}>
              {t("Order")}
            </Button>
            <p className="summary__terms">{t("By clicking 'Order' you accept the terms of use")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
