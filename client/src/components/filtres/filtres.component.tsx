import "./filtres.styles.sass";
import { ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { dateToLocalString, dayAfterTomorrow, isDateError, today, tomorrow } from "../../utils/basicFunctions";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getProducts } from "../../store/products/products.actions";
import { saveOrderData } from "../../store/order/order.reducer";
import { changeShouldFetchState } from "../../store/products/products.reducer";
import { selectFiltres } from "../../store/filtres/filtres.selector";
import * as filtresReducer from "../../store/filtres/filtres.reducer";
import Checkbox from "../checkbox/checkbox.component";
import Button, { BUTTON_CLASSES } from "../button/button.component";

const MAX_VALUE = 1000;
const MAX_DIFF = 100;

const Filtres = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const filtresSelector = useAppSelector(selectFiltres);

  useEffect(() => {
    const rd = searchParams.get("rd");
    const rtd = searchParams.get("rtd");

    if (rd) dispatch(filtresReducer.setDateOfReceipt(new Date(rd)));
    else dispatch(filtresReducer.setDateOfReceipt(new Date(today)));

    if (rtd) dispatch(filtresReducer.setDateOfReturn(new Date(rtd)));
    else dispatch(filtresReducer.setDateOfReturn(new Date(tomorrow)));

    dispatch(filtresReducer.clearExtendedFiltres());

    return () => {
      dispatch(filtresReducer.clearExtendedFiltres());
    };
  }, []);

  const progressBarStyles = {
    left: `${(filtresSelector.minValue / MAX_VALUE) * 100}%`,
    right: `${100 - (filtresSelector.maxValue / MAX_VALUE) * 100}%`,
  };

  const priceInputsHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (e.target.classList.contains("filtresSelector.minValue")) {
      dispatch(filtresReducer.setMinValue(value + MAX_DIFF > filtresSelector.maxValue ? filtresSelector.maxValue - MAX_DIFF : value));
    }

    if (e.target.classList.contains("filtresSelector.maxValue")) {
      dispatch(filtresReducer.setMaxValue(value - MAX_DIFF < filtresSelector.minValue ? filtresSelector.minValue + MAX_DIFF : value));
    }
  };

  const rangeInputHandler = (e: FormEvent<HTMLInputElement>, type: "min" | "max") => {
    const value = Number((e.target as HTMLInputElement).value.match(/\d+/g)?.join(""));

    if (type === "min") {
      !isNaN(value) && value < filtresSelector.maxValue
        ? dispatch(filtresReducer.setMinValue(value))
        : dispatch(filtresReducer.setInputMinValue(filtresSelector.minValue));
    }

    if (type === "max") {
      !isNaN(value) && value > filtresSelector.minValue
        ? dispatch(filtresReducer.setMaxValue(value))
        : dispatch(filtresReducer.setInputMaxValue(filtresSelector.maxValue));
    }
  };

  const fetchProducts = (link: string) => {
    navigate(link);
    dispatch(getProducts(link));
    dispatch(
      saveOrderData({
        date_of_receipt: filtresSelector.date_of_receipt,
        date_of_return: filtresSelector.date_of_return,
        place_of_receipt: filtresSelector.place_of_receipt,
        place_of_return: filtresSelector.place_of_return,
        dayQuantity: 1,
      }),
    );
    dispatch(changeShouldFetchState(true));
  };

  const filterHandler = () => {
    const dateError = isDateError(filtresSelector.date_of_receipt, filtresSelector.date_of_return);
    if (dateError) return toast.error(t(dateError));

    const filters = [
      { name: "pul", value: filtresSelector.place_of_receipt },
      { name: "rl", value: filtresSelector.place_of_return },
      { name: "rd", value: dateToLocalString(filtresSelector.date_of_receipt) },
      { name: "rtd", value: dateToLocalString(filtresSelector.date_of_return) },
      { name: "number_of_seats", value: filtresSelector.numberOfSits },
      { name: "fuel_type", value: filtresSelector.fuelType },
      { name: "drive_type", value: filtresSelector.driveType },
      { name: "price_from", value: filtresSelector.minValue.toString() },
      { name: "price_to", value: filtresSelector.maxValue.toString() },
    ];

    const link = filters.reduce((acc, f, i) => {
      if (!f.value) return acc;
      return acc + `${i === 0 ? "?" : "&"}${f.name}=${f.value}`;
    }, "");

    fetchProducts(link);
  };

  const clearHandler = () => {
    dispatch(filtresReducer.clearFiltres());

    fetchProducts(`?pul=Warszawa&rl=Warszawa&rd=${dateToLocalString(new Date(tomorrow))}&rtd=${dateToLocalString(new Date(dayAfterTomorrow))}`);
  };

  return (
    <aside className="filtres">
      <div className="filtres__title">
        <h2>{t("Filters")}</h2>
        <button onClick={clearHandler} className="filtres__clearFiltres">
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>

      <section className="filtres__price filtres__section">
        <h3 className="filtres__section__title">{t("Price range")}</h3>
        <div className="filtres__price__cnt">
          <div className="filtres__price__box filtres__section__body">
            <div
              style={{
                left: `calc(${progressBarStyles.left} - 8px)`,
                right: `calc(${progressBarStyles.right} + 8px)`,
              }}
              className="filtres__price__box-progress"
            />
            <div className="filtres__price__box-tumb" />
            <input
              type="range"
              min={0}
              value={filtresSelector.minValue}
              max={MAX_VALUE}
              onChange={priceInputsHandler}
              className="filtres__price__box-input filtresSelector.minValue"
            />
            <input
              type="range"
              min={0}
              value={filtresSelector.maxValue}
              max={MAX_VALUE}
              onChange={priceInputsHandler}
              className="filtres__price__box-input filtresSelector.maxValue"
            />
          </div>
        </div>

        <div className="filtres__price__inputs">
          <div className="filtres__price__input-box">
            <label>From</label>
            <input
              value={filtresSelector.inputMinValue}
              onInput={e => dispatch(filtresReducer.setInputMinValue(+e.currentTarget.value))}
              onBlur={e => rangeInputHandler(e, "min")}
              className="filtres__price__inputs__min"
              type="text"
            />
            <span className="unit">ZŁ</span>
          </div>
          <div className="filtres__price__input-box">
            <label>To</label>
            <input
              value={filtresSelector.inputMaxValue}
              onInput={e => dispatch(filtresReducer.setInputMaxValue(+e.currentTarget.value))}
              onBlur={e => rangeInputHandler(e, "max")}
              className="filtres__price__inputs__max"
              type="text"
            />
            <span className="unit">ZŁ</span>
          </div>
        </div>
      </section>

      <section className="filtres__filtresSelector.numberOfSits filtres__section">
        <span className="filtres__section__title">{t("Number of sits")}</span>
        <div className="filtres__section__body">
          <ul className="filtres__section__list">
            <li className="filtres__section__list__item">
              <Checkbox
                checked={filtresSelector.numberOfSits === "2"}
                label="2"
                click={(c, l) => dispatch(filtresReducer.setNumberOfSits(c ? l : null))}
              />
            </li>
            <li className="filtres__section__list__item">
              <Checkbox
                checked={filtresSelector.numberOfSits === "5"}
                label="5"
                click={(c, l) => dispatch(filtresReducer.setNumberOfSits(c ? l : null))}
              />
            </li>
          </ul>
        </div>
      </section>

      <section className="filtres__FuelType filtres__section">
        <span className="filtres__section__title">{t("Fuel type")}</span>
        <div className="filtres__section__body">
          <ul className="filtres__section__list">
            <li className="filtres__section__list__item">
              <Checkbox
                checked={filtresSelector.fuelType === "Petrol"}
                label="Petrol"
                click={(c, l) => dispatch(filtresReducer.setFuelType(c ? (l as any) : null))}
              />
            </li>
            <li className="filtres__section__list__item">
              <Checkbox
                checked={filtresSelector.fuelType === "Diesel"}
                label="Diesel"
                click={(c, l) => dispatch(filtresReducer.setFuelType(c ? (l as any) : null))}
              />
            </li>
            <li className="filtres__section__list__item">
              <Checkbox
                checked={filtresSelector.fuelType === "Electric"}
                label="Electric"
                click={(c, l) => dispatch(filtresReducer.setFuelType(c ? (l as any) : null))}
              />
            </li>
          </ul>
        </div>
      </section>

      <section className="filtres__filtresSelector.driveType filtres__section">
        <span className="filtres__section__title">{t("Drive type")}</span>
        <div className="filtres__section__body">
          <ul className="filtres__section__list">
            <li className="filtres__section__list__item">
              <Checkbox
                checked={filtresSelector.driveType === "4x4"}
                label="4x4"
                click={(c, l) => dispatch(filtresReducer.setDriveType(c ? (l as any) : null))}
              />
            </li>
            <li className="filtres__section__list__item">
              <Checkbox
                checked={filtresSelector.driveType === "Rear axle"}
                label="Rear axle"
                click={(c, l) => dispatch(filtresReducer.setDriveType(c ? (l as any) : null))}
              />
            </li>
            <li className="filtres__section__list__item">
              <Checkbox
                checked={filtresSelector.driveType === "Front axle"}
                label="Front axle"
                click={(c, l) => dispatch(filtresReducer.setDriveType(c ? (l as any) : null))}
              />
            </li>
          </ul>
        </div>
      </section>

      <div className="filtres__buttons">
        <Button buttonType={BUTTON_CLASSES.black} onClick={filterHandler}>
          {t("Filter")}
        </Button>
      </div>
    </aside>
  );
};

export default Filtres;
