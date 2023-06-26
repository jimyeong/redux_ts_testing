import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { axios } from "../../../axios-util/axios-library-utility";
import { ICocktail } from "../ui/CocktailCard";

const cocktailsAdapter = createEntityAdapter<ICocktail>({
  selectId: () => "idDrink",
});
const initialState = cocktailsAdapter.getInitialState({
  status: "idle",
  selectedTabIndex: 0,
  error: "",
  fetchedList: [],
});

type fetchCocktailParam = {
  keyword: string;
  firstLetter: string;
};
// AsyncThunk<any, void, AsyncThunkConfig>
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
