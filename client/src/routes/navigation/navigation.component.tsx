import "./navigation.styles.sass";
import i18n from "i18next";
import { useEffect, useState } from "react";
import { faCarRear, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/user/user.selectors";
import { dateToLocalString, dayAfterTomorrow, tomorrow } from "../../utils/basicFunctions";
import { saveOrderData } from "../../store/order/order.reducer";
import { useTranslation } from "react-i18next";
import PLflag from "../../assets/pl-flag.png";
import ENflag from "../../assets/en-flag.png";
import { getAppEvent } from "../../store/app/app.selectors";
import AccountDropdown from "../../components/account-dropdown/account-dropdown.component";
import Footer from "../../components/footer/footer.component";

const Navigation = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const appEvent = useAppSelector(getAppEvent);

  const [userDropdownState, setUserDropdownState] = useState(false);

  const [language, setLanguage] = useState("pl");

  useEffect(() => {
    if (userDropdownState) setUserDropdownState(false);
  }, [appEvent]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const saveData = () =>
    dispatch(
      saveOrderData({
        place_of_receipt: "Wrocław",
        place_of_return: "Wrocław",
        date_of_receipt: tomorrow,
        date_of_return: dayAfterTomorrow,
        dayQuantity: 1,
      })
    );

  return (
    <>
      <nav className="navigation">
        <div className="navigation__icon-box">
          <Link to="/">
            <img src="./Logo.png" className="navigation__logo" alt="" />
          </Link>
        </div>
        {/* <div className="navigation__searhField"><input type="text" className="navigation__searhInput" /></div> */}
        <ul className="navigation__links">
          <li className="navigation__link">
            <div className="navigation__link-container">
              <Link to="about"> {t("About")}</Link>
              <div className="navigation__link-underline"></div>
            </div>
          </li>
          <li className="navigation__link">
            <div className="navigation__link-container">
              <Link
                onClick={saveData}
                to={`offers?rd=${dateToLocalString(tomorrow)}&rtd=${dateToLocalString(dayAfterTomorrow)}&pul=Warszawa&rl=Warszawa`}
              >
                {t("Offers")}
              </Link>
              <div className="navigation__link-underline"></div>
            </div>
          </li>
        </ul>
        <div className="navigation__right">
          <img
            onClick={() => setLanguage("en")}
            className={`navigation__link__switch-language-icon ${language === "en" && "active"}`}
            src={ENflag}
            alt="en-flag"
          />
          <img
            onClick={() => setLanguage("pl")}
            className={`navigation__link__switch-language-icon ${language === "pl" && "active"}`}
            src={PLflag}
            alt="en-flag"
          />

          <div className="navigation__account">
            <div className="navigation__link-container">
              {user ? (
                <FontAwesomeIcon
                  onClick={e => {
                    e.stopPropagation();
                    setUserDropdownState(!userDropdownState);
                  }}
                  className="navigation__link-container__userIcon"
                  icon={faUser}
                />
              ) : (
                <Link to="log-in">{t("Log-in")}</Link>
              )}
              <div className="navigation__link-underline"></div>
            </div>
          </div>
        </div>
        {userDropdownState && user && <AccountDropdown setState={setUserDropdownState} />}
      </nav>
      <Outlet />
      <Footer />
    </>
  );
};

export default Navigation;
