import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";

const renderWithContext = (ui: any, options = {}) =>
  render(ui, { wrapper: MemoryRouter, ...options });

export * from "@testing-library/react";

export { renderWithContext as render };
