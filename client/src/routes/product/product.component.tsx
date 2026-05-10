import "./product.styles.sass";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectProductByName } from "../../store/products/products.selectors";
import { getProductByNameFetch, serverUrl } from "../../utils/fetchFunctions";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCalendarAlt, faLocationArrow, faGasPump, faBolt, IconDefinition } from "@fortawesome/free-solid-svg-icons";
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

  const totalPrice = (productInStorage?.daily_price ?? 0) * orderInStoreage.dayQuantity;

  return (
    <>
      {productInStorage ? (
        <div className="product container">
          <header className="product__header">
            <div className="product__header__img-wrap">
              <img className="product__header__img" src={productInStorage.image_url} alt={productInStorage.model} />
            </div>

            <div className="product__header__info">
              <div className="product__header__info__top">
                <span className="product__header__badge">{t("Dostępny")}</span>
                <h1 className="product__header__title">
                  {productInStorage.brand} {productInStorage.model}
                </h1>
                <div className="product__header__tags">
                  <span className="product__header__tag">
                    <FontAwesomeIcon icon={faCalendarAlt} /> {productInStorage.year}
                  </span>
                  <span className="product__header__tag">
                    <FontAwesomeIcon icon={faGasPump} /> {t(productInStorage.fuel_type)}
                  </span>
                  <span className="product__header__tag">
                    <FontAwesomeIcon icon={faBolt} /> {productInStorage.power} HP
                  </span>
                </div>
              </div>

              <div className="product__header__pricing">
                <div className="product__header__pricing__daily">
                  <span className="product__header__pricing__amount">{productInStorage.daily_price} PLN</span>
                  <span className="product__header__pricing__unit">/ {t("Day")}</span>
                </div>
                <span className="product__header__pricing__total">
                  {totalPrice.toFixed(2)} PLN {t("Total Amount").toLowerCase()} ({orderInStoreage.dayQuantity}{" "}
                  {orderInStoreage.dayQuantity === 1 ? t("Day") : t("Days")})
                </span>
              </div>

              <Button buttonType={BUTTON_CLASSES.green} onClick={() => navigate("/summary")}>
                {t("Reserve Vehicle")}
              </Button>
            </div>
          </header>

          <div className="product__booking">
            <div className="product__booking__block product__booking__block--days">
              <span className="product__booking__label">{t("Number of days")}</span>
              <NumberButton min={1} max={30} value={orderInStoreage.dayQuantity} onChange={value => dispatch(saveOrderDays(value))}>
                {orderInStoreage.dayQuantity > 1 ? t("Days") : t("Day")}
              </NumberButton>
            </div>

            <div className="product__booking__divider" />

            <div className="product__booking__block">
              <span className="product__booking__label">{t("Pick up location")}</span>
              <span className="product__booking__value">{orderInStoreage.place_of_receipt}</span>
              <span className="product__booking__sub">{new Date(orderInStoreage.date_of_receipt).toLocaleDateString("pl-PL")}</span>
            </div>

            <div className="product__booking__divider" />

            <div className="product__booking__block">
              <span className="product__booking__label">{t("Return location")}</span>
              <span className="product__booking__value">{orderInStoreage.place_of_return}</span>
              <span className="product__booking__sub">{new Date(orderInStoreage.date_of_return).toLocaleDateString("pl-PL")}</span>
            </div>

            <div className="product__booking__divider" />

            <div className="product__booking__block product__booking__block--total">
              <span className="product__booking__label">{t("Total Amount")}</span>
              <span className="product__booking__total">{totalPrice.toFixed(2)} PLN</span>
              <span className="product__booking__sub">
                {productInStorage.daily_price} PLN × {orderInStoreage.dayQuantity} {orderInStoreage.dayQuantity === 1 ? t("Day") : t("Days")}
              </span>
            </div>
          </div>

          <main className="product__main">
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
                        <span>{t(addon)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {companyInfo.length > 0 && (
                <div className="product__section__item">
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
