import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import "./button.styles.sass";
import { ButtonHTMLAttributes, Dispatch, FC, SetStateAction } from "react";
import { useAppDispatch } from "../../store/hooks";

type buttonTypes = ButtonHTMLAttributes<HTMLDivElement> & {
  state: {
    get: number;
    set: ActionCreatorWithPayload<number>;
  };
  min: number;
  max: number;
  children?: string;
};

const Button: FC<buttonTypes> = ({ state, children = "", min, max, ...otherProps }) => {
  const dispatch = useAppDispatch();

  const inputEventHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);

    if (!isNaN(value) && value <= max) dispatch(state.set(value));
  };

  const blurHandler = (e: React.FormEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);

    if (isNaN(value) || value + 1 === min) dispatch(state.set(min));
  };

  const increse = () => {
    dispatch(state.set(state.get > min ? state.get - 1 : state.get));
  };

  const decrese = () => {
    dispatch(state.set(state.get < max ? state.get + 1 : state.get));
  };

  return (
    <div className="number__button-cnt" {...otherProps}>
      <button className="number__button" onClick={increse} type="button">
        -
      </button>
      <input onBlur={blurHandler} onInput={inputEventHandler} className="button__text" value={state.get} />
      <span className="placeholder">{children}</span>
      <button className="number__button" onClick={decrese}>
        +
      </button>
    </div>
  );
};

export default Button;
