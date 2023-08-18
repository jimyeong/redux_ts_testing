import { render } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import cocktailSliceReducer from "../pages/Main/features/cocktailsSlice";
import { RenderOptions } from "@testing-library/react";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { AppStore } from "../app/store";
import { JsxElement } from "typescript";
import { Provider } from "react-redux";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

const renderWithContext = (
  ui: any,
  {
    preloadedState,
    store = configureStore({
      reducer: { cocktails: cocktailSliceReducer },
      preloadedState,
    }),
    ...renderOption
  }: ExtendedRenderOptions = {}
) => {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <MemoryRouter>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    );
  }
  return render(ui, { wrapper: Wrapper, ...renderOption });
};

export * from "@testing-library/react";

export { renderWithContext as render };
