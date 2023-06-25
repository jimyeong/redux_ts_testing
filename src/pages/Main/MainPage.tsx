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
import cn from "classnames";
import "./MainPage.scss";
import { onTabMenuChange, fetchCocktails } from "./features/cocktailsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AppDispatch, useAppDispatch } from "../../app/store";
import CocktailCard, { ICocktail } from "./ui/CocktailCard";
import List from "../../components/List/List";
import _ from "lodash";
import { axios } from "../../axios-util/axios-library-utility";

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
  const cocktails = useSelector(getCocktails);
  const { status, fetchedList, selectedTabIndex } = cocktails;
  const [searchedData, setSearchedData] = useState({
    searchingKeyword: "",
    fetchedData: [],
  });

  const isSearching = () => {
    console.log("length@@", searchedData.searchingKeyword);
    if (searchedData.searchingKeyword?.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const dispatch = useAppDispatch();
  const setMemu = () =>
    menus.map((menu) => {
      return {
        menuItem: menu,
        render: () => {
          if (status == "loading") {
            return (
              <TabPane className="ui bottom attached loading tab segment"></TabPane>
            );
          } else {
            return (
              <TabPane>
                <ul className="clearfix cocktail__list">
                  {isSearching() &&
                    searchedData.fetchedData?.map((item: ICocktail, key) => {
                      if (
                        item.strDrink.substring(0, 1).toUpperCase() ==
                        menus[selectedTabIndex]
                      ) {
                        return (
                          <li key={key} className="list__item">
                            <CocktailCard item={item} key={key} />
                          </li>
                        );
                      } else {
                        return null;
                      }
                    })}
                  {!isSearching() &&
                    fetchedList.map((item, key) => {
                      console.log("@@@fetchedList", fetchedList);
                      return (
                        <li key={key} className="list__item">
                          <CocktailCard item={item} key={key} />
                        </li>
                      );
                    })}
                </ul>
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
    console.log("event@", event);
    console.log("daata@ ", data);
    const { value } = data;
    const strVal = value?.trim();
    if (strVal && strVal.length > 3) {
      _.debounce(async () => {
        try {
          const result = await axios.get(
            `/api/json/v1/1/search.php?s=${strVal}`
          );
          setSearchedData({
            searchingKeyword: value ? value : "",
            fetchedData: result.data.drinks,
          });
        } catch (error) {
          console.error(error);
        }
      }, 300)();
    }
  };
  const onTabChange = async (
    event: React.MouseEvent<HTMLDivElement>,
    data: TabProps
  ) => {
    const { activeIndex } = data;
    await dispatch(
      onTabMenuChange({
        selectedTabIndex: activeIndex,
        key: menus[activeIndex as number],
      })
    );
  };
  useEffect(() => {
    dispatch(fetchCocktails(menus[cocktails.selectedTabIndex]));

    return () => {};
  }, [cocktails.selectedTabIndex, searchedData.searchingKeyword]);

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
