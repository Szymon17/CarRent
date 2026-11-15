import "./home.styles.sass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faLocationDot, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setDateOfReceipt, setDateOfReturn } from "../../store/filtres/filtres.reducer";
import headerImg from "../../assets/BanerBackground.jpg";
import calendarImg from "../../assets/calendar.png";
import lockImg from "../../assets/lock.png";
import moneyImg from "../../assets/money.png";
import OrderWindow from "../../components/orderWindow/orderWindow.component";
import FiltersSnapshot from "../../components/filtersSnapshot/filtersSnapshot.component";

const Home = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const today = new Date();
    dispatch(setDateOfReceipt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)));
    dispatch(setDateOfReturn(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)));
  }, [dispatch]);

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__header_title">{t("Home baner")}</h1>
        <div className="home__header__orderBox">
          <OrderWindow />
        </div>
        <img className="home__header_background" src={headerImg} alt="background" />
        <div className="home__header_filter" />
      </header>
      <div className="container">
        <div className="home__beneffits">
          <div className="home__beneffits__item">
            <img className="home__beneffits__item__icon" src={calendarImg} alt="calendarImg" />
            <div className="home__beneffits__item__descriptionContainer">
              <h2 className="home__beneffits__item__title">{t("Dates")}</h2>
              <p className="home__beneffits__item__text">{t("Dates description")}</p>
            </div>
          </div>
          <div className="home__beneffits__item">
            <img className="home__beneffits__item__icon" src={lockImg} alt="calendarImg" />
            <div className="home__beneffits__item__descriptionContainer">
              <h2 className="home__beneffits__item__title">{t("Safety")}</h2>
              <p className="home__beneffits__item__text">{t("Safety description")}</p>
            </div>
          </div>
          <div className="home__beneffits__item">
            <img className="home__beneffits__item__icon" src={moneyImg} alt="calendarImg" />
            <div className="home__beneffits__item__descriptionContainer">
              <h2 className="home__beneffits__item__title">{t("Payments")}</h2>
              <p className="home__beneffits__item__text">{t("Payments description")}</p>
            </div>
          </div>
        </div>
        <div className="home__filtersContainer">
          <FiltersSnapshot
            links={["Chevrolet", "Opel", "Renault", "Toyota", "Ford", "Dodge"]}
            title={t("Often checked brands")}
            filterClass="brand"
          />
          <FiltersSnapshot links={["Warszawa", "Wrocław", "Kraków"]} title={t("Available localizations")} filterClass="location" />
        </div>
      </div>
      <div className="home__baner">
        <div className="home__baner__container">
          <div className="home__baner__item">
            <FontAwesomeIcon className="home__baner__icon" icon={faCar} />
            <span className="home__baner__text">151</span>
          </div>
          <div className="home__baner__item">
            <FontAwesomeIcon className="home__baner__icon" icon={faLocationDot} />
            <span className="home__baner__text">3</span>
          </div>
          <div className="home__baner__item">
            <FontAwesomeIcon className="home__baner__icon" icon={faUserGroup} />
            <span className="home__baner__text">3K+</span>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="home__offtenChosenFiltres">
          <FiltersSnapshot
            links={["SUV", "Coupe", "Hatchback", "Combi", "Sedan"]}
            title={t("Often checked car types")}
            filterClass="type"
            horizontal={true}
          />
        </div>
        <footer className="home__footer">
          Projekt powstał tylko z myślą o rozwoju własnych umiejętności. Nie jest to projekt biznesowy jak i nie jest przedmiotem komercyjnym
          należącym do realnej firmy.
        </footer>
      </div>
    </div>
  );
};

export default Home;
