import "./select-locations.styles.sass";
import { useAppSelector } from "../../store/hooks";
import { FC, useEffect, useRef, useState } from "react";
import { selectLocations } from "../../store/locations/locations.selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

type selectLocationsTypes = { defaultValue?: string; changeState: Function };

const SelectLocations: FC<selectLocationsTypes> = ({ defaultValue, changeState }) => {
  const locations = useAppSelector(selectLocations);
  const selectRef = useRef<HTMLDivElement>(null);

  const [selectedLocation, setSelectedLocation] = useState(defaultValue);
  const [extend, setExtendState] = useState(false);

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

  useEffect(() => {
    setSelectedLocation(locations[0]);
  }, [locations, setSelectedLocation]);

  const selectLocationHandler = (location: string) => {
    setSelectedLocation(location);
    changeState(location);
    setExtendState(false);
  };

  return (
    <div ref={selectRef} className="selectLocations">
      <div onClick={() => setExtendState(!extend)} className="selectLocations__selected">
        {selectedLocation}
      </div>
      <FontAwesomeIcon className="selectLocations__icon" icon={faCaretDown} />
      <ul className="selectLocations__selectBox">
        {locations.map((location, key) => (
          <li key={key} onClick={() => selectLocationHandler(location)} className="selectLocations__option">
            {location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectLocations;
