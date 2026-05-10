import "react-day-picker/style.css";
import "./date-range-picker.styles.sass";
import { FC, useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { pl, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

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
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const locale = i18n.language === "pl" ? pl : enUS;
  const formatDate = (date: Date) => format(date, "dd.MM.yyyy");

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (startRef.current && !startRef.current.contains(e.target as Node)) setIsStartOpen(false);
      if (endRef.current && !endRef.current.contains(e.target as Node)) setIsEndOpen(false);
    };
    if (isStartOpen || isEndOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [isStartOpen, isEndOpen]);

  const showStart = type === "range" || singleMode === "start";
  const showEnd = type === "range" || singleMode === "end";

  return (
    <div className="rdp-picker">
      {label && <span className="rdp-picker__label">{label}</span>}

      <div className="rdp-picker__row">
        {showStart && (
          <div ref={startRef} className="rdp-picker__field">
            <button
              type="button"
              className={`rdp-picker__trigger${isStartOpen ? " rdp-picker__trigger--open" : ""}${disabled ? " rdp-picker__trigger--disabled" : ""}`}
              onClick={() => !disabled && setIsStartOpen(v => !v)}
            >
              <FontAwesomeIcon className="rdp-picker__ico" icon={faCalendarAlt} />
              <span>{formatDate(startDate)}</span>
            </button>

            {isStartOpen && (
              <div className="rdp-picker__popup">
                <DayPicker
                  mode="single"
                  selected={startDate}
                  onSelect={date => { if (date) { onStartDateChange(date); setIsStartOpen(false); } }}
                  disabled={[
                    ...(minStartDate ? [{ before: minStartDate }] : []),
                    ...(maxStartDate ? [{ after: maxStartDate }] : []),
                  ]}
                  locale={locale}
                  components={{
                    Chevron: ({ orientation }) => (
                      <FontAwesomeIcon icon={orientation === "left" ? faChevronLeft : faChevronRight} />
                    ),
                  }}
                />
              </div>
            )}
          </div>
        )}

        {type === "range" && <span className="rdp-picker__sep">—</span>}

        {showEnd && (
          <div ref={endRef} className="rdp-picker__field">
            <button
              type="button"
              className={`rdp-picker__trigger${isEndOpen ? " rdp-picker__trigger--open" : ""}${disabled ? " rdp-picker__trigger--disabled" : ""}`}
              onClick={() => !disabled && setIsEndOpen(v => !v)}
            >
              <FontAwesomeIcon className="rdp-picker__ico" icon={faCalendarAlt} />
              <span>{formatDate(endDate)}</span>
            </button>

            {isEndOpen && (
              <div className="rdp-picker__popup rdp-picker__popup--right">
                <DayPicker
                  mode="single"
                  selected={endDate}
                  onSelect={date => { if (date) { onEndDateChange(date); setIsEndOpen(false); } }}
                  disabled={[
                    ...(minEndDate ? [{ before: minEndDate }] : []),
                    ...(maxEndDate ? [{ after: maxEndDate }] : []),
                  ]}
                  locale={locale}
                  components={{
                    Chevron: ({ orientation }) => (
                      <FontAwesomeIcon icon={orientation === "left" ? faChevronLeft : faChevronRight} />
                    ),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
