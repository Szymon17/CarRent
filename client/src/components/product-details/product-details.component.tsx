import "./product-details.styles.sass";
import { FC } from "react";
import { product } from "../../store/products/products.types";
import { useTranslation } from "react-i18next";

const ProductDetails: FC<{ product: product }> = ({ product }) => {
  const { t } = useTranslation();

  return (
    <div className="productDetails">
      <div className="productDetails__lists">
        <ul className="productDetails__list">
          <li className="productDetails__list__item">
            <span className="productDetails__list__item__left">{t("Brand")}</span>
            <span className="productDetails__list__item__right">{product.brand}</span>
          </li>
          <li className="productDetails__list__item">
            <span className="productDetails__list__item__left">Model</span>
            <span className="productDetails__list__item__right">{product.model}</span>
          </li>
          <li className="productDetails__list__item">
            <span className="productDetails__list__item__left">{t("Year")}</span>
            <span className="productDetails__list__item__right">{product.year}</span>
          </li>
          <li className="productDetails__list__item">
            <span className="productDetails__list__item__left">{t("Capacity")}</span>
            <span className="productDetails__list__item__right">{product.engine_capacity}</span>
          </li>
          <li className="productDetails__list__item">
            <span className="productDetails__list__item__left">{t("Color")}</span>
            <span className="productDetails__list__item__right">{t(product.color)}</span>
          </li>
        </ul>
        <ul className="productDetails__list">
          <li className="productDetails__list__item">
            <span className="productDetails__list__item__left">{t("Transmission")}</span>
            <span className="productDetails__list__item__right">{t(product.transmission)}</span>
          </li>
          <li className="productDetails__list__item">
            <span className="productDetails__list__item__left">{t("Drive type")}</span>
            <span className="productDetails__list__item__right">{t(product.drive_type)}</span>
          </li>
          <li className="productDetails__list__item">
            <span className="productDetails__list__item__left">{t("Power")}</span>
            <span className="productDetails__list__item__right">{product.power}hp</span>
          </li>
          <li className="productDetails__list__item">
            <span className="productDetails__list__item__left">{t("Fuel consumption city")}</span>
            <span className="productDetails__list__item__right">{product.fuel_usage_city}</span>
          </li>
          <li className="productDetails__list__item">
            <span className="productDetails__list__item__left">{t("Fuel consumption out of city")}</span>
            <span className="productDetails__list__item__right">{product.fuel_usage_outcity}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDetails;
