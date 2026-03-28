import "./button.styles.sass";
import { FC, HTMLAttributes, useState } from "react";

type NumberButtonProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onBlur"> & {
  value: number;
  onChange?: (value: number) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  children?: string;
};

const NumberButton: FC<NumberButtonProps> = ({ value, onChange, onBlur, min = 0, max = 1000, children = "", ...otherProps }) => {
  const [textValueState, setTextValueState] = useState(`${value} ${children}`);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = Number(e.currentTarget.value);

    if (!isNaN(newValue) && newValue <= max) {
      onChange?.(newValue);
      setTextValueState(newValue.toString());
    }
  };

  const handelFocus = (e: React.FormEvent<HTMLInputElement>) => {
    const currentValue = e.currentTarget.value.match(/\d+/g)?.[0] ?? "";

    setTextValueState(currentValue);
  };

  const handleBlur = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = Number(textValueState);

    if (isNaN(newValue) || newValue < min) {
      onChange?.(min);
    }

    onBlur?.(e);
    setTextValueState(`${value} ${children}`);
  };

  const handleDecrease = () => {
    const newValue = value > min ? value - 1 : value;
    onChange?.(newValue);
    setTextValueState(`${newValue} ${children}`);
  };

  const handleIncrease = () => {
    const newValue = value < max ? value + 1 : value;
    onChange?.(newValue);
    setTextValueState(`${newValue} ${children}`);
  };

  return (
    <div className="number__button-cnt" {...otherProps}>
      <button className="number__button" onClick={handleDecrease} type="button">
        -
      </button>
      <input onFocus={handelFocus} onBlur={handleBlur} onInput={handleInputChange} className="button__text" value={textValueState} />
      <button className="number__button" onClick={handleIncrease} type="button">
        +
      </button>
    </div>
  );
};

export default NumberButton;
