import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { axios } from "../../../axios-util/axios-library-utility";
import { ICocktail } from "../ui/CocktailCard";

// id naming with createEntityAdapter, it has a thing to do with normalizing on Redux
// it will get powerful when it runs tons of data.
const cocktailsAdapter = createEntityAdapter<ICocktail>({
  selectId: () => "idDrink",
});
export const initialState = cocktailsAdapter.getInitialState({
  status: "idle",
  selectedTabIndex: 0,
  error: "",
  fetchedList: [],
});

type fetchCocktailParam = {
  keyword: string;
  firstLetter: string;
};

// a piece of thunk creation.
// if it gets more than 3 characters typed, then it will excute an api fetching data by its name
// otherwise it will bring data with the first letter.
export const fetchCocktails = createAsyncThunk(
  "cocktails/fetchCocktails",
  async ({ keyword, firstLetter }: fetchCocktailParam) => {
    if (keyword.length > 3) {
      const strVal = keyword.trim();
      const response = await axios.get(`/api/json/v1/1/search.php?s=${strVal}`);
      let sortedByFirstLetter: ICocktail[] = [];
      if (!response.data.drinks) {
        response.data.drinks = sortedByFirstLetter;
      }
      if (response.data.drinks) {
        response.data.drinks.forEach((element: ICocktail) => {
          if (element.strDrink.substring(0, 1).toUpperCase() == firstLetter) {
            sortedByFirstLetter.push(element);
          }
        });
        response.data.drinks = sortedByFirstLetter;
      }
      return response.data;
    } else {
      const response = await axios.get(
        `/api/json/v1/1/search.php?f=${firstLetter}`
      );
      return response.data;
    }
  }
);

// slice creation and extra reducer.
// bascially you don't directly modify state object, like this ( state.a = "b")
// in javascript, object refers to other object in a shallow copy way. so it will change the original state
// but redux toolkit, it uses a library returning a new reference, so here it's safe using that way.

export type sliceType = typeof createSlice;
const cocktailsSlice = createSlice({
  name: "cocktails",
  initialState,
  reducers: {
    onTabMenuChange: (state, action) => {
      const { selectedTabIndex, key } = action.payload;
      return {
        ...state,
        selectedTabIndex,
        key,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCocktails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchCocktails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fetchedList = action.payload.drinks;
      })
      .addCase(fetchCocktails.rejected, (state, action) => {
        state.status = "failed";
        if (action.error.message) state.error = action.error.message;
      });
  },
});

export const { onTabMenuChange } = cocktailsSlice.actions;
export default cocktailsSlice.reducer;
