import { useTranslation } from "react-i18next";
import "./checkbox.style.sass";
import { FC } from "react";

type Props = {
  label: string;
  click: (checked: boolean, label: string) => void;
  checked: boolean;
};

const Checkbox: FC<Props> = ({ label, click, checked }) => {
  const { t } = useTranslation();

  const clickHandler = () => {
    if (click) click(!checked, label);
  };

  return (
    <div className={`custom-checkbox${checked ? " checked" : ""}`} onClick={clickHandler}>
      <label className="custom-checkbox__label">{t(label)}</label>
    </div>
  );
};

export default Checkbox;
