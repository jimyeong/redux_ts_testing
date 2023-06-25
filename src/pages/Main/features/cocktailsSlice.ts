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

// AsyncThunk<any, void, AsyncThunkConfig>
export const fetchCocktails = createAsyncThunk(
  "cocktails/fetchCocktails",
  async (firstLetter: string) => {
    console.log("@@first Letter@@", firstLetter);
    const response = await axios.get(
      `/api/json/v1/1/search.php?f=${firstLetter}`
    );
    return response.data;
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
