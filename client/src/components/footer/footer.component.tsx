import { Link } from "react-router-dom";
import "./footer.styles.sass";
import { t } from "i18next";
import { dateToLocalString, dayAfterTomorrow, tomorrow } from "../../utils/basicFunctions";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__container container">
        <div className="footer__links">
          <Link to="/">
            <img src="./Logo.png" className="footer__logo" alt="" />
          </Link>
          <div className="footer__link">+000000000</div>
          <div className="footer__link">info@carentalpark.pl</div>
        </div>
        <div className="footer__links small">
          <Link to={"/"} className="footer__link">
            {t("Main page")}
          </Link>
          <Link to={"/about"} className="footer__link">
            {t("About")}
          </Link>
        </div>
        <div className="footer__links small">
          <Link to={"/account"} className="footer__link">
            {t("Mój profil")}
          </Link>
          <Link to={"/account/history"} className="footer__link">
            {t("Historia zamówień")}
          </Link>
        </div>
        <div className="footer__links small">
          <Link
            to={`/offers?pul=Warszawa&rl=Warszawa&rd=${dateToLocalString(tomorrow)}&rtd=${dateToLocalString(
              dayAfterTomorrow
            )}&price_from=0&price_to=1000`}
            className="footer__link"
          >
            {t("Ofert") + " Warszawa"}
          </Link>
          <Link
            to={`/offers?pul=Wrocław&rl=Wrocław&rd=${dateToLocalString(tomorrow)}&rtd=${dateToLocalString(
              dayAfterTomorrow
            )}&price_from=0&price_to=1000`}
            className="footer__link"
          >
            {t("Ofety") + " Wrocław"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
