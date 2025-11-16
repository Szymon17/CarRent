import "./summary.styles.sass";
import Button from "../../components/button/button.component";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectOrder } from "../../store/order/order.selector";
import { selectUser } from "../../store/user/user.selectors";
import { useEffect } from "react";
import { dateToLocalString } from "../../utils/basicFunctions";
import { selectProductByIndex } from "../../store/products/products.selectors";
import { useNavigate } from "react-router-dom";
import { saveOrderFetch } from "../../utils/fetchFunctions";
import { saveUserOrder } from "../../store/user/user.reducer";
import { toast } from "react-toastify";
import { faCalendarAlt, faCarRear, faCreditCard, faEnvelope, faLocationDot, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductCard from "../../components/product-card/product-card.component";
import Payments from "../../components/payments/payments.component";

const Summary = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const order = useAppSelector(selectOrder);
  const user = useAppSelector(selectUser);
  const product = useAppSelector(selectProductByIndex(order.productIndex ? order.productIndex : -1));

  useEffect(() => {
    if (!user) navigate("/log-in");
    if (!product) navigate("/offers");
  }, [user]);

  const submit = async () => {
    if (product?.index) {
      const status = await saveOrderFetch(order);

      if (status === "ok") {
        dispatch(saveUserOrder({ car: product, data: order }));
        toast.success(t("Ordered"));
        navigate("/");
      }
    }
  };

  return (
    <div className="summary container">
      <div className="summary__left">
        <div className="summary__section">
          <h3 className="summary__title">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{t("Receipt data")}</span>
          </h3>
          <div className="summary__order-data">
            <ul className="summary__left__order-data">
              <li className="summary__left__order-data__date">
                <span className="summary__left__order-data__title">{`${t("Pick up date")}: `}</span>
                <div>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>{dateToLocalString(new Date(order.date_of_receipt))}</span>
                </div>
              </li>
              <li className="summary__left__order-data__date">
                <span className="summary__left__order-data__title">{`${t("Return date")}: `}</span>
                <div>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>{dateToLocalString(new Date(order.date_of_return))}</span>
                </div>
              </li>
              <li className="summary__left__order-data__location">
                <span className="summary__left__order-data__title">{`${t("Pick up location")}: `}</span>
                <div>
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{order.place_of_receipt}</span>
                </div>
              </li>
              <li className="summary__left__order-data__location">
                <span className="summary__left__order-data__title">{`${t("Return location")}: `}</span>
                <div>
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>{order.place_of_return}</span>
                </div>
              </li>
            </ul>

            <div className="summary__left__order-data --right">
              <ul className="summary__left__order-data__right-container">
                <li className="summary__left__order-data__value">
                  <span className="summary__left__order-data__title">Email: </span>
                  <div>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>{user?.email}</span>
                  </div>
                </li>
                <li className="summary__left__order-data__value">
                  <span className="summary__left__order-data__title">{t("Name")}: </span>
                  <div>
                    <FontAwesomeIcon icon={faUser} />
                    <span>{user?.name}</span>
                  </div>
                </li>
                <li className="summary__left__order-data__value">
                  <span className="summary__left__order-data__title">{t("Surname")}: </span>
                  <div>
                    <FontAwesomeIcon icon={faUser} />
                    <span>{user?.surname}</span>
                  </div>
                </li>
                <li className="summary__left__order-data__value">
                  <span className="summary__left__order-data__title">{t("Phone number")}: </span>
                  <div>
                    <FontAwesomeIcon icon={faPhone} />
                    <span>{user?.phoneNumber}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="summary__section">
          <h3 className="summary__title">
            <FontAwesomeIcon icon={faCreditCard} />
            <span>{t("Payments")}</span>
          </h3>

          <section className="summary__left__data__section --payments">
            <Payments />
          </section>
        </div>

        <div className="summary__section">
          <h3 className="summary__title">
            <FontAwesomeIcon icon={faCarRear} />
            <span>{t("Product Card")}</span>
          </h3>

          {product && (
            <section className="summary__left__data__section --product">
              <ProductCard product={product} />
            </section>
          )}
        </div>
      </div>
      <div className="summary__right">
        <h3 className="summary__right__title">{t("Costs summary")}</h3>
        <div className="summary__right__informations">
          <span className="summary__right__informations__title">{t("Additional costs")}</span>
          <span className="summary__right__informations__ammount">0ZŁ</span>
          <span className="summary__right__informations__title">{t("Rental days")}</span>
          <span className="summary__right__informations__ammount">{`${order.dayQuantity} ${t("Days")}`}</span>
          <span className="summary__right__informations__title">{t("Value of purchase")}</span>
          <span className="summary__right__informations__ammount">{`${order.dayQuantity * (product?.daily_price ?? NaN)}ZŁ`}</span>
        </div>
        <Button onClick={submit}>{t("Order")}</Button>
        <p className="summary__terms">{t("By clicking 'Order' you accept the terms of use")}</p>
      </div>
    </div>
  );
};

export default Summary;
