import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Tab,
  TabPane,
  Divider,
  Search,
  SearchProps,
  TabProps,
} from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import "./MainPage.scss";
import { onTabMenuChange, fetchCocktails } from "./features/cocktailsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAppDispatch } from "../../app/store";
import CocktailCard, { ICocktail } from "./ui/CocktailCard";
import _ from "lodash";
import cn from "classnames";
import PieChart from "./ui/PieChart";
import ChartsDisplay from "./ui/ChartsDisplay";

const menus = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "R",
];

const getCocktails = (state: RootState) => state.cocktails;

const MainPage = () => {
  const cocktails = useSelector(getCocktails); // redux pattern
  const { status, fetchedList, selectedTabIndex } = cocktails;

  // as for searching keyword, I didn't put this in the redux store, I didn't want to get the whole App re-rendered whenever someone's typing
  // especially when I am assuming there are more pages, but now we've got just one page.
  const [searchingKeyword, setSearchingKeyword] = useState("");
  const dispatch = useAppDispatch();
  const setMemu = () =>
    menus.map((menu) => {
      return {
        menuItem: menu,
        render: () => {
          if (status == "loading") {
            //"ui bottom attached loading tab segment"
            return (
              <TabPane
                className={cn([
                  "ui",
                  "bottom",
                  "attached",
                  "loading",
                  "tab",
                  "segment",
                ])}
              ></TabPane>
            );
          } else if (status == "error") {
            return (
              <TabPane
                className={cn(["ui", "bottom", "attached", "tab", "segment"])}
              >
                <div>
                  <h2>Error has occured</h2>
                </div>
              </TabPane>
            );
          } else {
            return (
              <TabPane
                className={cn(["ui", "bottom", "attached", "tab", "segment"])}
              >
                {fetchedList.length == 0 && (
                  <div>
                    <h2>No result</h2>
                  </div>
                )}
                <ul className={cn(["clearfix", " cocktail__list"])}>
                  {fetchedList.map((item: ICocktail, key: number) => {
                    return (
                      <li key={key} className={cn("list__item")}>
                        <CocktailCard item={item} key={key} />
                      </li>
                    );
                  })}
                </ul>
                <div className={cn(["mt15"])}>
                  {fetchedList.length > 0 && (
                    <React.Fragment>
                      <ChartsDisplay data={cocktails.fetchedList} />
                    </React.Fragment>
                  )}
                </div>
              </TabPane>
            );
          }
        },
        key: menu,
      };
    });
  const onSearchChange = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    data: SearchProps
  ) => {
    const { value } = data;

    // added debouncing function as the document stated
    _.debounce(() => {
      setSearchingKeyword(value ? value : "");
    }, 500)();
  };
  const onTabChange = async (
    event: React.MouseEvent<HTMLDivElement>,
    data: TabProps
  ) => {
    const { activeIndex } = data;

    // I used Redux Thunk, since I prefered the concept of middleware when you are using Redux store.
    // it make the state updating function not only work in asyncrous way but also allow you to do some works that were not basically supposed to be done in reducer
    // I believe it makes the code intuitively readable
    await dispatch(
      onTabMenuChange({
        selectedTabIndex: activeIndex,
        key: menus[activeIndex as number],
      })
    );
  };

  // since we need to find data with the first letter and searching keyword as well, I made this this way
  // as I mentioned before, I used Thunk pattern, so all the logic is behind that function named "fetchCocktails"
  // if you typed more than 3 characters, it will execute an API fetching data by name, but at the same time we are gonna use the first letter two, because the user would be on the tab panel
  // otherwise it will just execute an API fetching data by the first letter(panel)
  useEffect(() => {
    dispatch(
      fetchCocktails({
        keyword: searchingKeyword,
        firstLetter: menus[cocktails.selectedTabIndex],
      })
    );

    return () => {};
  }, [cocktails.selectedTabIndex, searchingKeyword]);

  return (
    <div className="main__page" id="main">
      <Breadcrumb className={cn(["breadcrumb__wrapper"])}>
        <NavLink to="/" className={cn(["section"])}>
          Home
        </NavLink>
        <Divider>/</Divider>
        <NavLink to="/" className={cn(["section"])}>
          Cocktails List
        </NavLink>
      </Breadcrumb>
      <section className={cn("section__main")}>
        <div className="searchbar">
          <Search
            showNoResults={false}
            onSearchChange={onSearchChange}
            placeholder="What are you looking for"
          />
        </div>
        <Tab
          onTabChange={onTabChange}
          activeIndex={cocktails.selectedTabIndex}
          panes={setMemu()}
          className={cn("main__tab")}
        />
      </section>
    </div>
  );
};

export default MainPage;
