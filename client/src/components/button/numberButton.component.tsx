import "./button.styles.sass";
import { ButtonHTMLAttributes, Dispatch, FC, SetStateAction } from "react";

type buttonTypes = ButtonHTMLAttributes<HTMLDivElement> & {
  state: {
    get: number;
    set: Dispatch<SetStateAction<number>>;
  };
  children?: string;
};

const Button: FC<buttonTypes> = ({ state, children = "", ...otherProps }) => {
  return (
    <div className="number__button-cnt" {...otherProps}>
      <button className="number__button" onClick={() => state.set(state => (state > 1 ? state - 1 : state))}>
        -
      </button>
      <input className="button__text" value={state.get + " " + children} />
      <button className="number__button" onClick={() => state.set(state => (state < 60 ? state + 1 : state))}>
        +
      </button>
    </div>
  );
};

export default Button;
