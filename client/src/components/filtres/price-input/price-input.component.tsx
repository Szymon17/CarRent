import "./price-input.styles.sass";
import { FC, useState, useEffect } from "react";

interface PriceInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onBlur: (e: React.FormEvent<HTMLInputElement>) => void;
}

const PriceInput: FC<PriceInputProps> = ({ label, value, onChange, onBlur }) => {
  const [localValue, setLocalValue] = useState(String(value));

  // Synchronizuj lokalną wartość gdy value z props się zmieni
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    // Akceptuj tylko cyfry
    if (inputValue === "" || /^\d+$/.test(inputValue)) {
      setLocalValue(inputValue);
    }
  };

  const handleBlur = (e: React.FormEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;

    if (inputValue === "") {
      onChange(0);
      setLocalValue("0");
    } else {
      const newValue = Number(inputValue);
      if (!isNaN(newValue)) {
        onChange(newValue);
      }
    }

    onBlur(e);
  };

  return (
    <div className="price-input">
      <label className="price-input__label">{label}</label>
      <div className="price-input__wrapper">
        <input type="text" inputMode="numeric" value={localValue} onChange={handleInputChange} onBlur={handleBlur} className="price-input__field" />
        <span className="price-input__unit">ZŁ</span>
      </div>
    </div>
  );
};

export default PriceInput;
