import "./product-card.styles.sass";
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faStar, faUsers } from "@fortawesome/free-solid-svg-icons";
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
      <div className="product-card__image-wrap">
        <span className="product-card__year">{product.year}</span>
        <img className="product-card__img" src={product.image_url} alt={product.model} />
        <span className="product-card__rating">
          <FontAwesomeIcon icon={faStar} />
          5.0
        </span>
      </div>

      <div className="product-card__info">
        <div className="product-card__heading">
          <span className="product-card__brand">{product.brand}</span>
          <h3 className="product-card__model">
            {product.model}
          </h3>
        </div>

        <div className="product-card__specs">
          <span>
            <FontAwesomeIcon icon={faUsers} />
            {product.number_of_seats}
          </span>
          <span>{t(product.fuel_type)}</span>
          <span>{product.transmission}</span>
        </div>

        <div className="product-card__bottom">
          <div className="product-card__price">
            <strong>{product.daily_price}</strong>
            <span> PLN <small>/{t("Day")}</small></span>
          </div>
          <span className="product-card__cta" aria-label={t("Book now")}>
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
