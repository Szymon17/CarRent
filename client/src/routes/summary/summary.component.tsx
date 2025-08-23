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
        <h3 className="summary__title">{t("Receipt data")}</h3>
        <div className="summary__order-data">
          <div className="summary__left__order-data">
            <span className="summary__left__order-data__date">{`${t("Pick up date")}: ${dateToLocalString(new Date(order.date_of_receipt))}`}</span>
            <span className="summary__left__order-data__date">{`${t("Return date")}: ${dateToLocalString(new Date(order.date_of_return))}`}</span>
            <span className="summary__left__order-data__location">{`${t("Pick up location")}: ${order.place_of_receipt}`}</span>
            <span className="summary__left__order-data__location">{`${t("Return location")}: ${order.place_of_return}`}</span>
          </div>
          <div className="summary__left__order-data --right">
            <div className="summary__left__order-data__right-container">
              <div className="summary__left__order-data__value">Email: {user?.email}</div>
              <div className="summary__left__order-data__value">
                {t("Name")}: {user?.name}
              </div>
              <div className="summary_left__order-data__value">
                {t("Surname")}: {user?.surname}
              </div>
              <div className="summary__left_order-data__value">
                {t("Phone number")}: {user?.phoneNumber}
              </div>
            </div>
          </div>
        </div>

        <h3 className="summary__title --section_title">{t("Payments")}</h3>
        <section className="summary__left__data__section --payments">
          <Payments />
        </section>

        <h3 className="summary__title --section_title">{t("Product Card")}</h3>
        {product && (
          <section className="summary__left__data__section --product">
            <ProductCard product={product} />
          </section>
        )}
      </div>
      <div className="summary__right">
        <div className="summary__right__informations">
          <span className="summary__right__informations__title">{t("Additional costs")}</span>
          <span className="summary__right__informations__ammount">0ZŁ</span>
          <span className="summary__right__informations__title">{t("Rental days")}</span>
          <span className="summary__right__informations__ammount">{`${order.dayQuantity} ${t("Days")}`}</span>
          <span className="summary__right__informations__title">{t("Value of purchase")}</span>
          <span className="summary__right__informations__ammount">{`${order.dayQuantity * (product?.daily_price ?? NaN)}ZŁ`}</span>
        </div>
        <Button onClick={submit}>{t("Order")}</Button>
      </div>
    </div>
  );
};

export default Summary;
