import { createSelector } from "@reduxjs/toolkit";
import { stateType } from "../store";

const selectProductsReducer = (state: stateType) => state.products;

const selectProducts = createSelector([selectProductsReducer], ({ products }) => products);

const selectProductByIndex = (index: number) =>
  createSelector([selectProductsReducer], ({ products }) => products.find(product => product.index === index));

const selectProductByName = (name: string) => {
  const [brand, model] = name.split(" ");

  return createSelector([selectProductsReducer], ({ products }) => products.find(product => product.model === model && product.brand === brand));
};

const selectLastIndex = createSelector([selectProductsReducer], ({ products }) =>
  products[products.length - 1] ? products[products.length - 1].index : 0
);

const selectProductsStatus = createSelector([selectProductsReducer], ({ status }) => status);

const selectProductFetchState = createSelector([selectProductsReducer], ({ shouldFetch }) => shouldFetch);

export { selectProducts, selectLastIndex, selectProductByIndex, selectProductByName, selectProductsStatus, selectProductFetchState };
