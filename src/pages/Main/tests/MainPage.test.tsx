import { render, screen, act } from "../../../test-util/test-library-utility";
import { Provider } from "react-redux";
import { store } from "../../../app/store";
import App from "../../../App";
import { forEach } from "lodash";
import userEvent from "@testing-library/user-event";
import { InputProps } from "semantic-ui-react";
import { InputHTMLAttributes } from "react";
import "jest-canvas-mock";

// canvas testing error work around
jest.mock("react-chartjs-2", () => ({
  Bar: () => null,
  Pie: () => null,
}));

test("default fetched data test", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    {}
  );
  let titles = await screen.findAllByRole("cocktail_title", { exact: false });
  titles.forEach((el) => {
    // default fetched data's first character will start with A
    expect(el.textContent?.substring(0, 1).toUpperCase()).toBe("A");
  });
  const inputText: HTMLInputElement = await screen.findByPlaceholderText(
    "What are you looking for"
  );
  await act(async () => {
    await userEvent.clear(inputText);
    await userEvent.type(inputText, "mojito");
  });

  expect(inputText.value).toBe("mojito");
  titles = await screen.findAllByRole("cocktail_title", { exact: false });

  const tabButton = await screen.getByText("M");

  await act(async () => {
    await userEvent.click(tabButton);
  });

  // check if fetchd items' first character starts with the alphabet you want
  titles = await screen.findAllByRole("cocktail_title", { exact: false });
  titles.forEach((el) => {
    expect(el.textContent?.substring(0, 1).toUpperCase()).toBe("M"); // right one
    // expect(el.textContent?.substring(0, 1).toUpperCase()).toBe("Q"); // wrong one
  });
});
