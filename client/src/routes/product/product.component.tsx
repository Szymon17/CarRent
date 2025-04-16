import "./product.styles.sass";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectProductByIndex } from "../../store/products/products.selectors";
import { getProductByIndexFetch } from "../../utils/fetchFunctions";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { replaceProducts } from "../../store/products/products.reducer";
import Button from "../../components/button/button.component";
import ProductDetails from "../../components/product-details/product-details.component";

const Product = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [index] = useState(Number(searchParams.get("index")));
  const productInStorage = useAppSelector(selectProductByIndex(index));

  useEffect(() => {
    const fetchProduct = async () => {
      if (index) {
        const res = await getProductByIndexFetch(index);
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
            {/* <img className="product__header__img" src={productInStorage.img_url} alt="car image" /> */}
            <img className="product__header__img" src={"/Eksport/Golf.png"} alt="car image" />
            <div className="product__header__description">
              <h2 className="product__header__description__title">{`${productInStorage.brand} ${productInStorage.model} `}</h2>
              <span className="product__header__description__price">{`${productInStorage.daily_price}Zł/${t("Day")}`}</span>
              <Button onClick={() => navigate("/summary")}>{t("Order")}</Button>
            </div>
          </header>
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
