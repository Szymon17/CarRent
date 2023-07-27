import "./product-card.styles.sass";
import { FC } from "react";
import { product } from "../../store/products/products.types";
import Button from "../button/button.component";
import testImg from "../../assets/mustang.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faGasPump, faGauge, faUserGroup } from "@fortawesome/free-solid-svg-icons";

const ProductCard: FC<{ product: product }> = ({ product }) => {
  return (
    <div className="product-card">
      <img className="product-card__img" src={testImg} />
      <div className="product-card__description">
        <h2 className="product-card__description__title">{`${product.brand} ${product.model}`}</h2>
        <div className="product-card__description__icons">
          <div className="product-card__description__icons-box">
            <FontAwesomeIcon icon={faUserGroup} className="product-card__description__icons-icon"></FontAwesomeIcon>
            <span className="product-card__description__icons-value">{product.number_of_seats}</span>
          </div>
          <div className="product-card__description__icons-box">
            <FontAwesomeIcon icon={faGasPump} className="product-card__description__icons-icon"></FontAwesomeIcon>
            <span className="product-card__description__icons-value">{product.fuel_type}</span>
          </div>
          <div className="product-card__description__icons-box">
            <FontAwesomeIcon icon={faGauge} className="product-card__description__icons-icon"></FontAwesomeIcon>
            <span className="product-card__description__icons-value">{product.power}</span>
          </div>
          <div className="product-card__description__icons-box">
            <FontAwesomeIcon icon={faClock} className="product-card__description__icons-icon"></FontAwesomeIcon>
            <span className="product-card__description__icons-value">{product.year}</span>
          </div>
        </div>
        <Button>Sprawdź</Button>
      </div>
    </div>
  );
};

export default ProductCard;
