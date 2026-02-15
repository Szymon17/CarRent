import "./offers.styles.sass";
import { UIEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getProducts, addProducts } from "../../store/products/products.actions";
import { selectLastIndex, selectProductFetchState, selectProducts, selectProductsStatus } from "../../store/products/products.selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCalendarAlt, faClose, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { changeShouldFetchState } from "../../store/products/products.reducer";
import { countDateFromToday, dateToLocalString } from "../../utils/basicFunctions";
import * as filtresReducer from "../../store/filtres/filtres.reducer";
import { selectFiltres } from "../../store/filtres/filtres.selector";
import Filtres from "../../components/filtres/filtres.component";
import ProductCard from "../../components/product-card/product-card.component";
import Spinner from "../../components/spinner/spinner.component";
import CustomError from "../../components/custom-error/custom-error.component";
import SelectLocations from "../../components/select-locations/select-locations.component";
import FormInput from "../../components/formInput/formInput.component";

const regexp = /\?[\S]+/;

const Offers = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const filtresSelector = useAppSelector(selectFiltres);
  const productStatus = useAppSelector(selectProductsStatus);
  const products = useAppSelector(selectProducts);
  const lastIndex = useAppSelector(selectLastIndex);
  const shouldFetch = useAppSelector(selectProductFetchState);

  const [filtersAreOpen, setFiltersState] = useState(false);
  const [fetchDelay, setFetchDelay] = useState(false);

  const filtersRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const linkMatchArray = window.location.href.toString().match(regexp);
  const link: string = linkMatchArray ? (linkMatchArray[0] as string) : "";

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.target as HTMLDivElement;

    if (el && !fetchDelay && shouldFetch && el.scrollTop + el.clientHeight + 3 >= el.scrollHeight) {
      setFetchDelay(true);
      setTimeout(() => setFetchDelay(false), 400);
      dispatch(addProducts(`${link}&index=${lastIndex}`));
    }
  };

  useEffect(() => {
    dispatch(getProducts(link));
    dispatch(changeShouldFetchState(true));
  }, []);

  const toggleFiltersVisability = () => {
    if (filtersRef.current && productsRef.current) {
      filtersRef.current.classList.toggle("open");
      productsRef.current.classList.toggle("hidden");

      setFiltersState(!filtersAreOpen);
    }
  };

  return (
    <div className="offers container">
      <div className="offers__filters-switch">
        <h2 className="offers__filters-switch-title">Filtry</h2>
        <div className="offers__filters-switch-cnt">
          <button onClick={toggleFiltersVisability} className="offers__filters-switch-button">
            {!filtersAreOpen ? <FontAwesomeIcon icon={faBars} /> : <FontAwesomeIcon icon={faClose} />}
          </button>
        </div>
      </div>
      <div ref={filtersRef} className="offers__filters-box">
        <Filtres />
      </div>
      <main ref={productsRef} className="offers__main">
        <div className="offers__settings">
          <section className="filtres__data">
            <div className="filtres__data__locations__box">
              <span className="filtres__section__title">
                <span className="section_ico">
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>
                {t("Pick up location")}
              </span>
              <SelectLocations value={filtresSelector.place_of_receipt} changeState={value => dispatch(filtresReducer.setPlaceOfReceipt(value))} />
            </div>
            <div className="filtres__data__locations__box">
              <span className="filtres__section__title">
                <span className="section_ico">
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>
                {t("Return location")}
              </span>
              <SelectLocations value={filtresSelector.place_of_return} changeState={value => dispatch(filtresReducer.setPlaceOfReturn(value))} />
            </div>

            <div className="filtres__data__dates__box">
              <span className="filtres__section__title">
                <span className="section_ico">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </span>
                {t("Pick up date")}
              </span>
              <FormInput
                onChange={e => dispatch(filtresReducer.setDateOfReceipt(new Date(e.target.value)))}
                value={dateToLocalString(new Date(filtresSelector.date_of_receipt))}
                type="date"
                min={countDateFromToday(1)}
                max={countDateFromToday(0, 3)}
              />
            </div>
            <div className="filtres__data__dates__box">
              <span className="filtres__section__title">
                <span className="section_ico">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </span>
                {t("Return date")}
              </span>
              <FormInput
                onChange={e => dispatch(filtresReducer.setDateOfReturn(new Date(e.target.value)))}
                value={dateToLocalString(new Date(filtresSelector.date_of_return))}
                type="date"
                min={countDateFromToday(2)}
                max={countDateFromToday(10, 3)}
              />
            </div>
          </section>
        </div>
        {products.length > 0 && productStatus !== "loading" ? (
          <div onScroll={handleScroll} className="offers__products">
            <div className="offers__products-cnt">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        ) : productStatus === "loading" ? (
          <Spinner />
        ) : (
          <CustomError>{t("there is nothing to display")}</CustomError>
        )}
      </main>
    </div>
  );
};

export default Offers;
