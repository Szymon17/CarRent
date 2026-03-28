import "./product-card.styles.sass";
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { saveOrderIndex } from "../../store/order/order.reducer";
import { useAppDispatch } from "../../store/hooks";
import { product } from "../../store/products/products.types";

const ProductCard: FC<{ product: product }> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <a
      href={`/product/${product.brand}-${product.model}-${product.id}`}
      className="product-card"
      onClick={() => dispatch(saveOrderIndex(product.id))}
    >
      <div className="product-card__top">
        <div className="product-card__top-box">
          <div className="product-card__top__block">
            <FontAwesomeIcon className="product-card__icon" icon={faCalendarAlt} />
            <span>{product.year}</span>
          </div>
          <div className="product-card__top__block">
            <FontAwesomeIcon className="product-card__icon -star" icon={faStar} />
            <span className="rate">
              5.0 <span>(150)</span>
            </span>
          </div>
        </div>
      </div>
      <img className="product-card__img" src={product.image_url} alt={product.model} />
      <div className="product-card__bottom">
        <div className="product-card__bottom__left">
          <h3 className="product-card__model">
            {product.brand} {product.model}
          </h3>
          <div className="product-card__details">
            {product.engine_capacity} {t(product.fuel_type)} ({product.power}HP)
          </div>
        </div>
        <div className="product-card__bottom__right">
          <span className="price">
            {product.daily_price}PLN/<span className="price__unit">{t("Day")}</span>
          </span>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
