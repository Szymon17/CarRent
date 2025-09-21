import "./product-card.styles.sass";
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGasPump, faGauge, faMoneyBill1, faUserGroup, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { saveOrderIndex } from "../../store/order/order.reducer";
import { useAppDispatch } from "../../store/hooks";
import { product } from "../../store/products/products.types";
import Button, { BUTTON_CLASSES } from "../button/button.component";

const ProductCard: FC<{ product: product }> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToProduct = () => {
    dispatch(saveOrderIndex(product.index));
    navigate("/product/" + product.brand + " " + product.model);
  };

  return (
    <div className="product-card">
      <img className="product-card__img" src={product.image_url} />
      <div className="product-card__description">
        <h2 className="product-card__description__title">{`${product.brand} ${product.model}`}</h2>
        <div className="product-card__description__box">
          <div className="product-card__description__box__container">
            <div className="product-card__description__icons">
              <div className="product-card__description__icons-box">
                <FontAwesomeIcon icon={faUserGroup} className="product-card__description__icons-box-icon" />
                <span className="product-card__description__icons-value">{product.number_of_seats}</span>
              </div>
              <div className="product-card__description__icons-box">
                <FontAwesomeIcon icon={faGasPump} className="product-card__description__icons-box-icon" />
                <span className="product-card__description__icons-value"> {t(product.fuel_type)}</span>
              </div>
              <div className="product-card__description__icons-box">
                <FontAwesomeIcon icon={faGauge} className="product-card__description__icons-box-icon" />
                <span className="product-card__description__icons-value">{product.power}hp</span>
              </div>
              <div className="product-card__description__icons-box">
                <FontAwesomeIcon icon={faMoneyBill1} className="product-card__description__icons-box-icon" />
                <span className="product-card__description__icons-value">{product.mileage} km</span>
              </div>
            </div>
            <div className="product-card__description__box__traits">
              {product.traits &&
                product.traits.map(trait => (
                  <div key={trait} className="product-card__trait">
                    <FontAwesomeIcon icon={faCheck} className="product-card__trait__icon" />
                    <span className="product-card__trait-text">{t(trait)}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="product-card__description__box__right">
            <span className="product-card__description__dailyPrice">
              <span>{product.daily_price}ZŁ</span>
              <span className="product-card__description__dailyPrice-text"> / {t("Day")}</span>
            </span>
            <Button buttonType={BUTTON_CLASSES.green} onClick={goToProduct}>
              {t("Check")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
