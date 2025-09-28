import "./payments.styles.sass";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { saveOrderPayment } from "../../store/order/order.reducer";
import { getPayments } from "../../store/payments/payments.selector";
import { useState } from "react";
import { paymentState } from "../../store/payments/payments.types";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faMoneyBill, faMoneyBillTransfer, faTruck, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faCcPaypal } from "@fortawesome/free-brands-svg-icons";

const iconsMap = new Map<string, any>([
  ["credit_card", faCreditCard],
  ["blik", faMoneyBill],
  ["bank_transfer", faMoneyBillTransfer],
  ["paypal", faCcPaypal],
  ["cod", faTruck],
]);

const Payments = () => {
  const dispatch = useAppDispatch();

  const payments = useAppSelector(getPayments);

  const [activeMethod, setActiveMethod] = useState(payments[0]);
  const [state, setState] = useState<"open" | "selected">("selected");

  const setPaymentMethod = (payment: paymentState) => {
    dispatch(saveOrderPayment(payment.id));
    setActiveMethod(payment);
    setState("selected");
  };

  return (
    <div className="payments">
      {state === "open" ? (
        payments.map((payment, index) => (
          <div onClick={() => setPaymentMethod(payment)} key={index} className="payment">
            <FontAwesomeIcon className="payment__icon" icon={iconsMap.get(payment.code)} />
            <span className="payment__name">{payment.name}</span>
          </div>
        ))
      ) : (
        <div onClick={() => setState("open")} className="payment --selected">
          <FontAwesomeIcon className="payment__icon" icon={iconsMap.get(activeMethod.code)} />
          <span className="payment__name">{t(activeMethod.name)}</span>
        </div>
      )}
    </div>
  );
};

export default Payments;
