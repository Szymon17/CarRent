import "./product.styles.sass";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectProductByName } from "../../store/products/products.selectors";
import { getProductByNameFetch, serverUrl } from "../../utils/fetchFunctions";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCalendarAlt, faLocationArrow, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { replaceProducts } from "../../store/products/products.reducer";
import { selectOrder } from "../../store/order/order.selector";
import { saveOrderDays } from "../../store/order/order.reducer";
import Button, { BUTTON_CLASSES } from "../../components/button/button.component";
import NumberButton from "../../components/button/numberButton.component";
import ProductDetails from "../../components/product-details/product-details.component";
import { faBluetooth } from "@fortawesome/free-brands-svg-icons";

const addons_icons = new Map<string, IconDefinition>([["gps", faLocationArrow], ["bluetooth", faBluetooth] as [string, IconDefinition]]);

const Product = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { name } = useParams();
  const decodedName = decodeURIComponent(name ?? "");

  const productInStorage = useAppSelector(selectProductByName(decodedName));
  const orderInStoreage = useAppSelector(selectOrder);

  const [companyInfo, setCompanyInfo] = useState<{ attribute_name: string; attribute_value: string }[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (decodedName) {
        const res = await getProductByNameFetch(decodedName);
        if (res) dispatch(replaceProducts([res]));
      }
    };

    const fetchCompanyInfo = async () => {
      try {
        const req = await fetch(`${serverUrl}/assistance_info`);
        const res = await req.json();

        if (res.status === "ok") setCompanyInfo(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanyInfo();

    if (!productInStorage) fetchProduct();
  }, []);

  return (
    <>
      {productInStorage ? (
        <div className="product container">
          <header className="product__header">
            <div className="product__header__img__cnt">
              <img className="product__header__img" src={productInStorage.image_url} alt="car image" />
            </div>
            <div className="product__header__description">
              <div className="product__header__description__top">
                <div className="product__header__description__title__box">
                  <h2 className="product__header__description__title">{`${productInStorage.brand} ${productInStorage.model} `}</h2>
                  <span className="product__header__description__avilability">{t("Dostępny")}</span>
                </div>

                <div className="product__header__description__prices">
                  <span className="product__header__description__price">{`${(productInStorage.daily_price * orderInStoreage.dayQuantity).toFixed(
                    2,
                  )}PLN`}</span>
                  <span className="product__header__description__dailyPrice">
                    {`${productInStorage.daily_price}PLN`} <span className="product__header__description__price-unit">{t("per day")}</span>
                  </span>
                </div>
              </div>

              <div className="product__configuration">
                <div className="product__configuration__title">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>{t("Rental configuration")}</span>
                </div>
                <div className="product__configuration__box">
                  <div className="product__configuration__block">
                    <span className="product__configuration__block__title">{t("Number of days")}</span>
                    <div className="product__configuration__block__element">
                      <NumberButton min={1} max={30} value={orderInStoreage.dayQuantity} onChange={value => dispatch(saveOrderDays(value))}>
                        {orderInStoreage.dayQuantity > 1 ? t("Days") : t("Day")}
                      </NumberButton>
                    </div>
                  </div>
                  <div className="product__configuration__block">
                    <span className="product__configuration__block__title">{t("Pick up location")}</span>
                    <div className="product__configuration__block__element">
                      <div className="text">
                        <p className="text-small">{new Date(orderInStoreage.date_of_receipt).toLocaleString("pl-PL") ?? ""}</p>
                        <span>{orderInStoreage.place_of_receipt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="product__configuration__block">
                    <span className="product__configuration__block__title">{t("Return location")}</span>
                    <div className="text">
                      <p className="text-small">{new Date(orderInStoreage.date_of_return).toLocaleString("pl-PL") ?? ""}</p>
                      <span>{orderInStoreage.place_of_return}</span>
                    </div>
                  </div>
                </div>

                <div className="product__summary">
                  <div className="product__summary__element">
                    <span>{t("Daily Rate")}:</span>
                    <span>{`${productInStorage.daily_price}PLN`}</span>
                  </div>
                  <div className="product__summary__element">
                    <span>{t("Days")}:</span>
                    <span>{orderInStoreage.dayQuantity}</span>
                  </div>
                  <div className="product__summary__element sum">
                    <span>{t("Total Amount")}</span>
                    <span>{`${(productInStorage.daily_price * orderInStoreage.dayQuantity).toFixed(2)}PLN`}</span>
                  </div>
                </div>
              </div>
              <div className="product__header__buttons">
                <Button buttonType={BUTTON_CLASSES.black} onClick={() => navigate("/summary")}>
                  {t("Reserve Vehicle")}
                </Button>
              </div>
            </div>
          </header>

          <main className="product__main product__section">
            <div className="product__main__left">
              <div className="product__section__item">
                <h2 className="product__section-title">{t("Vehicle Specifications")}</h2>
                <div className="product__section__content">
                  <ProductDetails product={productInStorage} />
                </div>
              </div>
            </div>

            <div className="product__main__right">
              <div className="product__section__item">
                <h2 className="product__section-title">{t("Included Features")}</h2>
                <div className="product__section__content">
                  <ul className="product__addons__list">
                    {Object.entries(productInStorage.addons)?.map(([addon_code, addon], index) => (
                      <li key={index} className="product__addons__list__item">
                        <FontAwesomeIcon icon={addons_icons.get(addon_code) ?? faCheck} />
                        <span className="product__addons__list__item__text">{t(addon)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {companyInfo && (
                <div className="product__section__item assistance">
                  <h2 className="product__section-title">{t("Need Assistance?")}</h2>
                  <div className="product__section__content">
                    <ul className="product__assistance">
                      {companyInfo.map(({ attribute_name, attribute_value }, index) => (
                        <li key={index} className="product__assistance__item">
                          <span className="product__assistance__title">{attribute_name}</span>
                          <span className="product__assistance__value">{attribute_value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      ) : (
        <div className="fetchError">
          <div className="fetchError__content">
            <h2 className="fetchError__title">{t("Product Not Found")}</h2>
            <p className="fetchError__message">
              {t("Sorry, the product you're looking for could not be found. It may have been removed or the link is incorrect.")}
            </p>
            <Button buttonType={BUTTON_CLASSES.black} onClick={() => navigate("/offers")}>
              {t("Browse Other Vehicles")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
