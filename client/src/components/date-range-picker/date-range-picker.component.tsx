import "./date-range-picker.styles.sass";
import { FC, useState, useRef, useEffect } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

// Locales don't need explicit registration with modern react-datepicker

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  minStartDate?: Date;
  maxStartDate?: Date;
  minEndDate?: Date;
  maxEndDate?: Date;
  label?: string;
  placeholder?: string;
  type?: "single" | "range";
  singleMode?: "start" | "end";
  disabled?: boolean;
}

const DateRangePicker: FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minStartDate,
  maxStartDate,
  minEndDate,
  maxEndDate,
  label,
  placeholder,
  type = "range",
  singleMode = "start",
  disabled = false,
}) => {
  const { i18n } = useTranslation();
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);
  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDateDisplay = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startPickerRef.current && !startPickerRef.current.contains(event.target as Node)) {
        setIsStartPickerOpen(false);
      }
      if (endPickerRef.current && !endPickerRef.current.contains(event.target as Node)) {
        setIsEndPickerOpen(false);
      }
    };

    if (isStartPickerOpen || isEndPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isStartPickerOpen, isEndPickerOpen]);

  const locale = i18n.language === "pl" ? "pl" : "en";

  return (
    <div className="date-range-picker">
      {label && <label className="date-range-picker__label">{label}</label>}

      <div className="date-range-picker__container">
        {/* Start Date Picker or Single Date Picker */}
        {type === "range" || singleMode === "start" ? (
          <div ref={startPickerRef} className="date-range-picker__item">
            <div
              className="date-range-picker__input-wrapper"
              onClick={() => {
                if (!disabled) setIsStartPickerOpen(!isStartPickerOpen);
              }}
            >
              <span className="date-range-picker__icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </span>
              <input
                type="text"
                className="date-range-picker__input"
                value={formatDateDisplay(startDate)}
                readOnly
                placeholder={placeholder || "Select date"}
                disabled={disabled}
              />
            </div>

            {isStartPickerOpen && (
              <div className="date-range-picker__popup">
                <ReactDatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => {
                    if (date) {
                      onStartDateChange(date);
                    }
                  }}
                  minDate={minStartDate}
                  maxDate={maxStartDate}
                  inline
                  dateFormat="dd/MM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  preventOpenOnFocus
                />
              </div>
            )}
          </div>
        ) : null}

        {/* End Date Picker (for range type or single end mode) */}
        {type === "range" || singleMode === "end" ? (
          <>
            {type === "range" && <span className="date-range-picker__separator">—</span>}
            <div ref={endPickerRef} className="date-range-picker__item">
              <div
                className="date-range-picker__input-wrapper"
                onClick={() => {
                  if (!disabled) setIsEndPickerOpen(!isEndPickerOpen);
                }}
              >
                <span className="date-range-picker__icon">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </span>
                <input
                  type="text"
                  className="date-range-picker__input"
                  value={formatDateDisplay(endDate)}
                  readOnly
                  placeholder={placeholder || "Select date"}
                  disabled={disabled}
                />
              </div>

              {isEndPickerOpen && (
                <div className="date-range-picker__popup date-range-picker__popup--right">
                  <ReactDatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        onEndDateChange(date);
                      }
                    }}
                    minDate={minEndDate}
                    maxDate={maxEndDate}
                    inline
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    preventOpenOnFocus
                  />
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DateRangePicker;
