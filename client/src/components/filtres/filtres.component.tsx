import "./filtres.styles.sass";
import { useState, ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { dateToLocalString, countDateFromToday, dayAfterTomorrow, isDateError, today, tomorrow } from "../../utils/basicFunctions";
import { useAppDispatch } from "../../store/hooks";
import { getProducts } from "../../store/products/products.actions";
import { saveOrderData } from "../../store/order/order.reducer";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { changeShouldFetchState } from "../../store/products/products.reducer";
import SelectLocations from "../select-locations/select-locations.component";
import Button, { BUTTON_CLASSES } from "../button/button.component";
import FormInput from "../formInput/formInput.component";
import Checkbox from "../checkbox/checkbox.component";
import { faCalendarAlt, faClose, faLocation, faLocationArrow, faLocationDot, faLocationPin } from "@fortawesome/free-solid-svg-icons";

const Filtres = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const maxValueForInput = 1000;
  const maxAmountDifference = 100;

  const [searchParams] = useSearchParams();
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(maxValueForInput);

  const [place_of_receipt, set_place_of_receipt] = useState(searchParams.get("pul") || "Warszawa");
  const [place_of_return, set_place_of_return] = useState(searchParams.get("rl") || "Warszawa");
  const [date_of_receipt, set_date_of_receipt] = useState(searchParams.get("rd") ? new Date(searchParams.get("rd") as string) : new Date(tomorrow));
  const [date_of_return, set_date_of_return] = useState(
    searchParams.get("rtd") ? new Date(searchParams.get("rtd") as string) : new Date(dayAfterTomorrow)
  );

  const [numberOfSits, setNumberOfSits] = useState(searchParams.get("number_of_seats") || null);
  const [fuelType, setFuelType] = useState(searchParams.get("fuel_type") || null);
  const [driveType, setDriveType] = useState(searchParams.get("drive_type") || null);

  const filters: { name: string; value: string | null }[] = [
    { name: "pul", value: place_of_receipt },
    { name: "rl", value: place_of_return },
    { name: "rd", value: dateToLocalString(date_of_receipt) },
    { name: "rtd", value: dateToLocalString(date_of_return) },
    { name: "number_of_seats", value: numberOfSits },
    { name: "fuel_type", value: fuelType },
    { name: "drive_type", value: driveType },
    { name: "price_from", value: minValue.toString() },
    { name: "price_to", value: maxValue.toString() },
  ];

  const progressBarStyles = {
    left: `${(minValue / maxValueForInput) * 100}%`,
    right: `${100 - (maxValue / maxValueForInput) * 100}%`,
  };

  const priceInputsHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const element = e.target;
    const value = Number(element.value);

    if (element.classList.contains("minValue")) {
      if (value + maxAmountDifference > maxValue) setMinValue(maxValue - maxAmountDifference);
      else setMinValue(value);
    } else if (element.classList.contains("maxValue")) {
      if (value - maxAmountDifference < minValue) setMaxValue(minValue + maxAmountDifference);
      else setMaxValue(Number(e.target.value));
    }
  };

  const checkboxHandler = (checked: boolean, label: string, setPropertHandler: Function) => {
    if (checked) setPropertHandler(label);
    else setPropertHandler(null);
  };

  const fetchProducts = (link: string) => {
    navigate(link);
    dispatch(getProducts(link));
    dispatch(saveOrderData({ date_of_receipt, date_of_return, place_of_receipt, place_of_return, dayQuantity: 1 }));
    dispatch(changeShouldFetchState(true));
  };

  const filterHendler = () => {
    const dateError = isDateError(date_of_receipt, date_of_return);
    if (dateError) return toast.error(t(dateError));

    const link = filters.reduce((acc, filter, i) => {
      if (filter.value) {
        if (i === 0) acc += `?${filter.name}=${filter.value}`;
        else acc += `&${filter.name}=${filter.value}`;
      }

      return acc;
    }, "");

    fetchProducts(link);
  };

  const clearFilters = () => {
    const newTommorow = new Date(tomorrow);
    const newDayAfterTommorow = new Date(dayAfterTomorrow);

    setNumberOfSits(null);
    setFuelType(null);
    setDriveType(null);

    set_place_of_receipt("Warszawa");
    set_place_of_return("Warszawa");
    set_date_of_receipt(newTommorow);
    set_date_of_return(newDayAfterTommorow);

    const link = `?pul=Warszawa&rl=Warszawa&rd=${dateToLocalString(newTommorow)}&rtd=${dateToLocalString(newDayAfterTommorow)}`;
    fetchProducts(link);
  };

  return (
    <aside className="filtres">
      <div className="filtres__title">
        <h2>{t("Filters")}</h2>
        <button onClick={clearFilters} className="filtres__clearFiltres">
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      <section className="filtres__price filtres__section">
        <div className="filtres__price__box filtres__section__body">
          <span className="filtres__price__box-minValue" style={{ left: progressBarStyles.left }}>
            <div className="filtres__price__box-cnt">
              <span className="filtres__price__box-amount">{minValue}</span>
              <span className="filtres__price__box-unit">ZŁ</span>
            </div>
          </span>
          <span className="filtres__price__box-maxValue" style={{ right: progressBarStyles.right }}>
            <div className="filtres__price__box-cnt">
              <span className="filtres__price__box-amount">{maxValue}</span>
              <span className="filtres__price__box-unit">ZŁ</span>
            </div>
          </span>
          <div
            style={{ left: `calc(${progressBarStyles.left} - 8px)`, right: `calc(${progressBarStyles.right} + 8px` }}
            className="filtres__price__box-progress"
          ></div>
          <div className="filtres__price__box-tumb"></div>
          <input
            type="range"
            min={0}
            value={minValue}
            max={maxValueForInput}
            onChange={priceInputsHandler}
            className="filtres__price__box-input minValue"
          />
          <input
            type="range"
            min={0}
            value={maxValue}
            max={maxValueForInput}
            onChange={priceInputsHandler}
            className="filtres__price__box-input maxValue"
          />
        </div>
      </section>
      <section className="filtres__data filtres__section">
        <div>
          <div className="filtres__data__locations__box">
            <span className="filtres__section__title">
              <span className="section_ico">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
              {t("Pick up location")}
            </span>
            <SelectLocations value={place_of_receipt} changeState={set_place_of_receipt} />
          </div>
          <div className="filtres__data__locations__box">
            <span className="filtres__section__title">
              <span className="section_ico">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
              {t("Return location")}
            </span>
            <SelectLocations value={place_of_return} changeState={set_place_of_return} />
          </div>
        </div>
        <div className="filtres__data__dates">
          <div className="filtres__data__dates__box">
            <span className="filtres__section__title">
              <span className="section_ico">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </span>
              {t("Pick up date")}
            </span>
            <FormInput
              onChange={e => set_date_of_receipt(new Date(e.target.value))}
              value={dateToLocalString(date_of_receipt)}
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
              onChange={e => set_date_of_return(new Date(e.target.value))}
              value={dateToLocalString(date_of_return)}
              type="date"
              min={countDateFromToday(2)}
              max={countDateFromToday(10, 3)}
            />
          </div>
        </div>
      </section>
      <section className="filtres__numberOfSits filtres__section">
        <span className="filtres__section__title">{t("Number of sits")}</span>
        <div className="filtres__section__body">
          <ul className="filtres__section__list">
            <li className="filtres__section__list__item">
              <Checkbox checked={numberOfSits === "2"} label="2" click={(checked, label) => checkboxHandler(checked, label, setNumberOfSits)} />
            </li>
            <li className="filtres__section__list__item">
              <Checkbox checked={numberOfSits === "5"} label="5" click={(checked, label) => checkboxHandler(checked, label, setNumberOfSits)} />
            </li>
          </ul>
        </div>
      </section>
      <section className="filtres__FuelType filtres__section">
        <span className="filtres__section__title">{t("Fuel type")}</span>
        <div className="filtres__section__body">
          <ul className="filtres__section__list">
            <li className="filtres__section__list__item">
              <Checkbox checked={fuelType === "Petrol"} label="Petrol" click={(checked, label) => checkboxHandler(checked, label, setFuelType)} />
            </li>
            <li className="filtres__section__list__item">
              <Checkbox checked={fuelType === "Diesel"} label="Diesel" click={(checked, label) => checkboxHandler(checked, label, setFuelType)} />
            </li>
            <li className="filtres__section__list__item">
              <Checkbox checked={fuelType === "Electric"} label="Electric" click={(checked, label) => checkboxHandler(checked, label, setFuelType)} />
            </li>
          </ul>
        </div>
      </section>
      <section className="filtres__driveType filtres__section">
        <span className="filtres__section__title">{t("Drive type")}</span>
        <div className="filtres__section__body">
          <ul className="filtres__section__list">
            <li className="filtres__section__list__item">
              <Checkbox checked={driveType === "4x4"} label="4x4" click={(checked, label) => checkboxHandler(checked, label, setDriveType)} />
            </li>
            <li className="filtres__section__list__item">
              <Checkbox
                checked={driveType === "Rear axle"}
                label="Rear axle"
                click={(checked, label) => checkboxHandler(checked, label, setDriveType)}
              />
            </li>
            <li className="filtres__section__list__item">
              <Checkbox
                checked={driveType === "Front axle"}
                label="Front axle"
                click={(checked, label) => checkboxHandler(checked, label, setDriveType)}
              />
            </li>
          </ul>
        </div>
      </section>
      <div className="filtres__buttons">
        <Button buttonType={BUTTON_CLASSES.green} onClick={filterHendler}>
          {t("Filter")}
        </Button>
      </div>
    </aside>
  );
};

export default Filtres;
