import "./account.styles.sass";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/user/user.selectors";
import { useEffect, useState } from "react";
import { deleteUserFetch } from "../../utils/fetchFunctions";
import { logOut } from "../../store/user/user.reducer";
import { useTranslation } from "react-i18next";
import Button, { BUTTON_CLASSES } from "../../components/button/button.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faClockRotateLeft, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const [deleteAlert, setDeleteAlert] = useState(false);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const deleteAccount = async () => {
    if (user) {
      const res = await deleteUserFetch(user.email);
      if (res && res.status === "ok") dispatch(logOut());
    }
    setDeleteAlert(false);
  };

  const isHistory = location.pathname.includes("history");

  return (
    <div className="account">
      <div className="account__layout container">
        <aside className="account__sidebar">
          <div className="account__avatar">
            <span className="account__avatar__initials">
              {user?.name.charAt(0)}{user?.surname.charAt(0)}
            </span>
          </div>
          <div className="account__user-info">
            <span className="account__user-info__name">{user?.name} {user?.surname}</span>
            <span className="account__user-info__email">{user?.email}</span>
          </div>

          <nav className="account__nav">
            <Link to="" className={`account__nav__link${!isHistory ? " account__nav__link--active" : ""}`}>
              <FontAwesomeIcon icon={faUser} />
              {t("Profile")}
            </Link>
            <Link to="history" className={`account__nav__link${isHistory ? " account__nav__link--active" : ""}`}>
              <FontAwesomeIcon icon={faClockRotateLeft} />
              {t("History of orders")}
            </Link>
          </nav>

          <button className="account__delete-btn" onClick={() => setDeleteAlert(true)}>
            <FontAwesomeIcon icon={faTrash} />
            {t("Delete account")}
          </button>
        </aside>

        <main className="account__main">
          <Outlet />
        </main>
      </div>

      {deleteAlert && (
        <div className="account__overlay">
          <div className="account__dialog">
            <button className="account__dialog__close" onClick={() => setDeleteAlert(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className="account__dialog__icon">
              <FontAwesomeIcon icon={faTrash} />
            </div>
            <h2 className="account__dialog__title">{t("Delete alert")}</h2>
            <p className="account__dialog__text">{t("Delete alert")}</p>
            <div className="account__dialog__actions">
              <Button buttonType={BUTTON_CLASSES.reverse} onClick={() => setDeleteAlert(false)}>
                {t("Cancel") ?? "Anuluj"}
              </Button>
              <Button buttonType={BUTTON_CLASSES.red} onClick={deleteAccount}>
                {t("Delete account")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
