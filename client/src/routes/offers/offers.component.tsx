import "./offers.styles.sass";
import { UIEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getProducts, addProducts } from "../../store/products/products.actions";
import { selectLastIndex, selectProductFetchState, selectProducts, selectProductsStatus } from "../../store/products/products.selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose, faLocationDot, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { changeShouldFetchState } from "../../store/products/products.reducer";
import { countDateFromToday, dateToLocalString, isDateError } from "../../utils/basicFunctions";
import * as filtresReducer from "../../store/filtres/filtres.reducer";
import { selectFiltres } from "../../store/filtres/filtres.selector";
import { saveOrderData } from "../../store/order/order.reducer";
import { toast } from "react-toastify";
import Filtres from "../../components/filtres/filtres.component";
import ProductCard from "../../components/product-card/product-card.component";
import Spinner from "../../components/spinner/spinner.component";
import CustomError from "../../components/custom-error/custom-error.component";
import SelectLocations from "../../components/select-locations/select-locations.component";
import DateRangePicker from "../../components/date-range-picker/date-range-picker.component";

const regexp = /\?[\S]+/;

const Offers = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  const handleSearch = () => {
    const dateError = isDateError(new Date(filtresSelector.date_of_receipt), new Date(filtresSelector.date_of_return));
    if (dateError) return toast.error(t(dateError));

    const filters = [
      { name: "pul", value: filtresSelector.place_of_receipt },
      { name: "rl", value: filtresSelector.place_of_return },
      { name: "rd", value: dateToLocalString(new Date(filtresSelector.date_of_receipt)) },
      { name: "rtd", value: dateToLocalString(new Date(filtresSelector.date_of_return)) },
    ];

    const newLink = filters.reduce((acc, f, i) => {
      if (!f.value) return acc;
      return acc + `${i === 0 ? "?" : "&"}${f.name}=${f.value}`;
    }, "");

    navigate(newLink);
    dispatch(getProducts(newLink));
    dispatch(
      saveOrderData({
        date_of_receipt: filtresSelector.date_of_receipt,
        date_of_return: filtresSelector.date_of_return,
        add_date: new Date(),
        place_of_receipt: filtresSelector.place_of_receipt,
        place_of_return: filtresSelector.place_of_return,
        dayQuantity: 1,
      }),
    );
    dispatch(changeShouldFetchState(true));
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
          <div className="offers-search">
            <div className="offers-search__card">
              <div className="offers-search__field">
                <span className="offers-search__label">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {t("Pick up location")}
                </span>
                <SelectLocations value={filtresSelector.place_of_receipt} changeState={value => dispatch(filtresReducer.setPlaceOfReceipt(value))} />
              </div>
              <div className="offers-search__divider" />
              <div className="offers-search__field">
                <span className="offers-search__label">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {t("Return location")}
                </span>
                <SelectLocations value={filtresSelector.place_of_return} changeState={value => dispatch(filtresReducer.setPlaceOfReturn(value))} />
              </div>
            </div>

            <div className="offers-search__card">
              <div className="offers-search__field">
                <span className="offers-search__label">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {t("Pick up date")}
                </span>
                <DateRangePicker
                  startDate={new Date(filtresSelector.date_of_receipt)}
                  endDate={new Date(filtresSelector.date_of_return)}
                  onStartDateChange={date => dispatch(filtresReducer.setDateOfReceipt(date))}
                  onEndDateChange={date => dispatch(filtresReducer.setDateOfReturn(date))}
                  minStartDate={new Date(countDateFromToday(1))}
                  maxStartDate={new Date(countDateFromToday(0, 3))}
                  minEndDate={new Date(countDateFromToday(2))}
                  maxEndDate={new Date(countDateFromToday(10, 3))}
                  type="single"
                  singleMode="start"
                />
              </div>
              <div className="offers-search__divider" />
              <div className="offers-search__field">
                <span className="offers-search__label">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {t("Return date")}
                </span>
                <DateRangePicker
                  startDate={new Date(filtresSelector.date_of_receipt)}
                  endDate={new Date(filtresSelector.date_of_return)}
                  onStartDateChange={date => dispatch(filtresReducer.setDateOfReceipt(date))}
                  onEndDateChange={date => dispatch(filtresReducer.setDateOfReturn(date))}
                  minStartDate={new Date(countDateFromToday(2))}
                  maxStartDate={new Date(countDateFromToday(10, 3))}
                  minEndDate={new Date(countDateFromToday(2))}
                  maxEndDate={new Date(countDateFromToday(10, 3))}
                  type="single"
                  singleMode="end"
                />
              </div>
            </div>

          </div>
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
