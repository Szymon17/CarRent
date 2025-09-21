import "./product.styles.sass";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectProductByName } from "../../store/products/products.selectors";
import { getProductByNameFetch } from "../../utils/fetchFunctions";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { replaceProducts } from "../../store/products/products.reducer";
import { selectOrder } from "../../store/order/order.selector";
import { saveOrderDays } from "../../store/order/order.reducer";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import Button from "../../components/button/button.component";
import NumberButton from "../../components/button/numberButton.component";
import ProductDetails from "../../components/product-details/product-details.component";

const Product = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const { name } = useParams();
  const decodedName = decodeURIComponent(name ?? "");

  const productInStorage = useAppSelector(selectProductByName(decodedName));
  const orderInStoreage = useAppSelector(selectOrder);

  useEffect(() => {
    const fetchProduct = async () => {
      if (decodedName) {
        const res = await getProductByNameFetch(decodedName);
        console.log(res, "res to");
        if (res) dispatch(replaceProducts([res]));
      }
    };

    if (!productInStorage) fetchProduct();
  }, []);

  return (
    <>
      {productInStorage ? (
        <div className="product container">
          <header className="product__header">
            <img className="product__header__img" src={"/Eksport/Golf.png"} alt="car image" />
            <div className="product__header__description">
              <h2 className="product__header__description__title">{`${productInStorage.brand} ${productInStorage.model} `}</h2>
              <div className="product__boxex_cnt">
                <div className="product__box">
                  <span className="product__header__description__price">{`${(productInStorage.daily_price * orderInStoreage.dayQuantity).toFixed(
                    2
                  )}PLN`}</span>
                  <span className="product__header__description__dailyPrice">
                    {`${productInStorage.daily_price}PLN`} / <span className="product__header__description__price-unit">{t("Day")}</span>
                  </span>
                  <span className="product__header__description__avilability">{t("Dostępny")}</span>

                  <div className="product__header__description__traits">
                    {productInStorage.traits.map((trait, index) => (
                      <span key={index} className="product__header__description__traits__trait">
                        <FontAwesomeIcon icon={faCheck} />
                        {t(trait)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="product__box right">
                  <h3>{t("Pick-up and drop-off")}</h3>
                  <div className="product__box container">
                    <div className="product__header__description__localisation">
                      <div className="text">
                        <span className="text-small">{orderInStoreage.date_of_receipt.toLocaleString().split(",")[0] ?? ""}</span>
                        <span>{productInStorage.localisation}</span>
                      </div>
                    </div>
                    <div className="product__header__description__localisation">
                      <div className="text">
                        <span className="text-small">{orderInStoreage.date_of_return.toLocaleString().split(",")[0] ?? ""}</span>
                        <span>{productInStorage.localisation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product__header__buttons">
                <Button onClick={() => navigate("/summary")}>{t("Order")}</Button>
                <NumberButton
                  min={1}
                  max={30}
                  state={{ get: orderInStoreage.dayQuantity, set: saveOrderDays as ActionCreatorWithPayload<number> }}
                  onClick={() => null}
                >
                  {orderInStoreage.dayQuantity > 1 ? t("Days") : t("Day")}
                </NumberButton>
              </div>
            </div>
          </header>
          <section className="product__nav product__section">
            {/* <span className="product__nav__box">{t("Szczegóły")}</span>
            <span className="product__nav__box">{t("Dodatki")}</span> */}
          </section>
          <section className="product__details product__section">
            <h2 className="product__section-title">{t("Details")}</h2>
            <ProductDetails product={productInStorage} />
          </section>
          <section className="product__addons product__section">
            <h2 className="product__section-title">{t("Addons")}</h2>
            <ul className="product__addons__list">
              {productInStorage.addons.map((addon, index) => (
                <li key={index} className="product__addons__list__item">
                  <FontAwesomeIcon icon={faCheck} />
                  <span className="product__addons__list__item__text">{t(addon)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <div className="fetchError"></div>
      )}
    </>
  );
};

export default Product;
