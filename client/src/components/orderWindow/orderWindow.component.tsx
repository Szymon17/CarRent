import "./orderWindow.styles.sass";
import { useNavigate } from "react-router-dom";
import { dateToLocalString, countDateFromToday, isDateError } from "../../utils/basicFunctions";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { saveOrderData } from "../../store/order/order.reducer";
import { selectFiltres } from "../../store/filtres/filtres.selector";
import * as filtresReducer from "../../store/filtres/filtres.reducer";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Button, { BUTTON_CLASSES } from "../button/button.component";
import SelectLocations from "../select-locations/select-locations.component";
import DateRangePicker from "../date-range-picker/date-range-picker.component";

const OrderWindow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const filtres = useAppSelector(selectFiltres);

  const search = () => {
    const dateError = isDateError(new Date(filtres.date_of_receipt), new Date(filtres.date_of_return));

    if (!filtres.place_of_receipt || !filtres.place_of_return) toast.error(t("No location alert"));
    else if (dateError) toast.error(t(dateError));
    else {
      dispatch(
        saveOrderData({
          place_of_receipt: filtres.place_of_receipt,
          place_of_return: filtres.place_of_return,
          date_of_receipt: filtres.date_of_receipt,
          date_of_return: filtres.date_of_return,
          add_date: new Date(),
          dayQuantity: 1,
        }),
      );
      navigate(
        `offers?pul=${filtres.place_of_receipt}&rl=${filtres.place_of_return}&rd=${dateToLocalString(new Date(filtres.date_of_receipt))}&rtd=${dateToLocalString(new Date(filtres.date_of_return))}`,
      );
    }
  };

  return (
    <div className="orderWindow">
      <div className="orderWindow__container">
        <div className="orderWindow__row">
          <div className="orderWindow__item">
            <label className="orderWindow__inputLabel">{t("Pick up location")}</label>
            <SelectLocations value={filtres.place_of_receipt} changeState={value => dispatch(filtresReducer.setPlaceOfReceipt(value))} />
          </div>

          <div className="orderWindow__item">
            <label className="orderWindow__inputLabel">{t("Return location")}</label>
            <SelectLocations value={filtres.place_of_return} changeState={value => dispatch(filtresReducer.setPlaceOfReturn(value))} />
          </div>
        </div>

        <div className="orderWindow__row">
          <div className="orderWindow__item">
            <label className="orderWindow__inputLabel">{t("Pick up date")}</label>
            <DateRangePicker
              startDate={new Date(filtres.date_of_receipt)}
              endDate={new Date(filtres.date_of_return)}
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

          <div className="orderWindow__item">
            <label className="orderWindow__inputLabel">{t("Return date")}</label>
            <DateRangePicker
              startDate={new Date(filtres.date_of_receipt)}
              endDate={new Date(filtres.date_of_return)}
              onStartDateChange={date => dispatch(filtresReducer.setDateOfReceipt(date))}
              onEndDateChange={date => dispatch(filtresReducer.setDateOfReturn(date))}
              minStartDate={new Date(countDateFromToday(1))}
              maxStartDate={new Date(countDateFromToday(0, 3))}
              minEndDate={new Date(countDateFromToday(2))}
              maxEndDate={new Date(countDateFromToday(10, 3))}
              type="single"
              singleMode="end"
            />
          </div>
        </div>
      </div>
      <div className="orderWindow__buttonContainer">
        <Button buttonType={BUTTON_CLASSES.green} onClick={search}>
          {t("Check")}
        </Button>
      </div>
    </div>
  );
};

export default OrderWindow;
