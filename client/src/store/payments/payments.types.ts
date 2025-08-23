type paymentState = {
  id: number;
  name: string;
  code: string;
};

type paymentsInintialState = {
  payments: paymentState[];
  status: "idle" | "loading" | "failed";
};

export { paymentsInintialState, paymentState };
