import "./account-dropdown.styles.sass";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/user/user.selectors";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../../store/user/user.reducer";
import { logOutUser } from "../../utils/fetchFunctions";
import Button, { BUTTON_CLASSES } from "../button/button.component";
import { useTranslation } from "react-i18next";
import { FC } from "react";

type AccountDropdownState = {
  setState: Function;
};

const AccountDropdow: FC<AccountDropdownState> = ({ setState }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const logout = async () => {
    await logOutUser();
    dispatch(logOut());
    navigate("/");
  };

  return (
    <div className="account-dropdown" onClick={e => e.stopPropagation()}>
      <h3 className="account-dropdown__name">{user?.name}</h3>
      <ul className="account-dropdown__linksCnt">
        <li className="account-dropdown__link">
          <Link onClick={() => setState(false)} to="/account">
            {t("Profile")}
          </Link>
        </li>
        <li className="account-dropdown__link">
          <Link onClick={() => setState(false)} to="/account/history">
            {t("History of orders")}
          </Link>
        </li>
      </ul>
      <div className="account-dropdown__button-container">
        <Button buttonType={BUTTON_CLASSES.black} onClick={logout}>
          {t("Logout")}
        </Button>
      </div>
    </div>
  );
};

export default AccountDropdow;
