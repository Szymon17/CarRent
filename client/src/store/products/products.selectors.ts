import { createSelector } from "@reduxjs/toolkit";
import { stateType } from "../store";

const selectProductsReducer = (state: stateType) => state.products;

const selectProducts = createSelector([selectProductsReducer], ({ products }) => products);

const selectProductByIndex = (id: number) => createSelector([selectProductsReducer], ({ products }) => products.find(product => product.id === id));

const selectProductByName = (name: string) => {
  const [brand, model, id] = name.split("-");

  return createSelector([selectProductsReducer], ({ products }) => products.find(product => product.id === +id));
};

const selectLastIndex = createSelector([selectProductsReducer], ({ products }) =>
  products[products.length - 1] ? products[products.length - 1].id : 0,
);

const selectProductsStatus = createSelector([selectProductsReducer], ({ status }) => status);

const selectProductFetchState = createSelector([selectProductsReducer], ({ shouldFetch }) => shouldFetch);

export { selectProducts, selectLastIndex, selectProductByIndex, selectProductByName, selectProductsStatus, selectProductFetchState };
