import "./select-locations.styles.sass";
import { useAppSelector } from "../../store/hooks";
import { FC, useEffect, useRef, useState } from "react";
import { selectLocations } from "../../store/locations/locations.selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { getAppEvent } from "../../store/app/app.selectors";

type selectLocationsTypes = { value: string; changeState: Function };

const SelectLocations: FC<selectLocationsTypes> = ({ value, changeState }) => {
  const locations = useAppSelector(selectLocations);
  const selectRef = useRef<HTMLDivElement>(null);

  const appEvent = useAppSelector(getAppEvent);

  const [extend, setExtendState] = useState(false);

  useEffect(() => {
    const el = selectRef.current;

    if (el) {
      el.classList.remove("extend");
      setExtendState(false);
    }
  }, [appEvent]);

  useEffect(() => {
    const el = selectRef.current;

    if (el !== null) {
      switch (extend) {
        case true:
          el.classList.add("extend");
          break;
        case false:
          el.classList.remove("extend");
          break;
      }
    } else setExtendState(false);
  }, [extend, setExtendState]);

  const selectLocationHandler = (location: string) => {
    changeState(location);
    setExtendState(false);
  };

  return (
    <div ref={selectRef} className="selectLocations">
      <div
        onClick={e => {
          e.stopPropagation();
          setExtendState(!extend);
        }}
        className="selectLocations__selected"
      >
        {value}
      </div>
      <FontAwesomeIcon className="selectLocations__icon" icon={faCaretDown} />
      <div className="selectLocations__selectBox">
        <ul className="selectLocations__selectBox__container">
          {locations.map((location, key) => (
            <li key={key} onClick={() => selectLocationHandler(location)} className="selectLocations__option">
              {location}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectLocations;
