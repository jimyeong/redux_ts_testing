import {
  render,
  screen,
  act,
  findAllByRole,
  cleanup,
  waitFor,
} from "../../../test-util/test-library-utility";
import { Provider } from "react-redux";
import { store } from "../../../app/store";
import App from "../../../App";
import userEvent from "@testing-library/user-event";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { sleep } from "../../../axios-util/axios-library-utility";
import "jest-canvas-mock";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { forEach, stubString } from "lodash";
import cocktailReducer, {
  fetchCocktails,
  initialState,
} from "../features/cocktailsSlice";
import { ICocktail } from "../ui/CocktailCard";

// import * as cocktailSlice from "../features/cocktailsSlice";

afterEach(cleanup);
// canvas testing error work around
jest.mock("react-chartjs-2", () => ({
  Bar: () => null,
  Pie: () => null,
}));
// jest.mock("../features/cocktailsSlice");

// @ts-ignore`
// const k = { fetchCocktails };
// const m = jest.spyOn(cocktailSlice, "fetchCocktails"); // it is supposed to be object but I would like to test a function
test.only("fetching data, when user is typing", async () => {
  // server.resetHandlers(rest.post())

  render(<App />);

  const expectedLetter = "K";
  const testingLetter = "K";
  const searchbar: HTMLInputElement = screen.getByPlaceholderText(
    "What are you looking for"
  );

  const tabItem = screen.getByText(testingLetter, { exact: true });

  await act(async () => {
    await userEvent.click(tabItem);
    //
  });
  /// await sleep(800);

  // sometimes it fails, sometimes it doesn't
  expect(tabItem).toHaveClass("active");

  // await sleep(500);

  //   The return value of action creators is considered an implementation detail within your application, and when following an integration testing style, do not need explicit tests.
  // Similarly for thunks using Redux Thunk, our recommendation is not to write them manually, but instead use createAsyncThunk from @reduxjs/toolkit. The thunk handles dispatching the appropriate pending, fulfilled and rejected action types for you based on the lifecycle of the thunk.
  // We consider thunk behavior to be an implementation detail of the application, and recommend that it be covered by testing the group of components (or whole app) using it, rather than testing the thunk in isolation.

  /**
 * {
        keyword: searchingKeyword,
        firstLetter: menus[cocktails.selectedTabIndex],
      }
 */

  const dispatch = jest.fn();
  const args = {
    keyword: testingLetter,
    firstLetter: testingLetter,
  };
  const thunkFunction = fetchCocktails(args);
  const thunkPromise = thunkFunction(dispatch, () => {}, undefined);

  expect((await thunkPromise).type).toBe("cocktails/fetchCocktails/fulfilled");
  const nameOfCocktail: string[] = (await thunkPromise).payload.drinks.map(
    (cocktail: ICocktail) => cocktail.strDrink
  );
  nameOfCocktail.forEach((name) => {
    const firstChar = name.substring(0, 1);
    expect(firstChar).toBe(expectedLetter);
  });
  // expect().toEqual({ drinks: [] });

  expect(
    cocktailReducer(undefined, { type: "cocktails/fetchCocktails" })
  ).toEqual(initialState);
});

test("test whether charts exist", async () => {
  const { container } = render(
    <Provider store={store}>
      <App />
    </Provider>,
    {}
  );

  // console.log("@@@container", container.getElementsByClassName("pie__chart"));
  const pieChart = await screen.findByRole("pie__chart");
  const barChart = await screen.findByRole("bar__chart");

  expect(pieChart).toBeInTheDocument();
  expect(barChart).toBeInTheDocument();
});

test("progress bar test", async () => {
  server.resetHandlers(
    rest.get(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php`,
      async (req, res, ctx) => {
        await sleep(100);
        return res(
          ctx.json({
            drinks: [],
          })
        );
      }
    )
  );
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    {}
  );
  const anotherTabButton = await screen.getByText("B");
  const loadingBar = await screen.findByRole("loading__bar", {
    exact: false,
  });

  await act(async () => {
    await userEvent.click(anotherTabButton);

    expect(loadingBar).toBeInTheDocument();
  });

  expect(loadingBar).toHaveClass("loading");
  await act(async () => {
    await sleep(1000);
  });

  expect(loadingBar).not.toHaveClass("loading");
});
