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
import _, { divide } from "lodash";
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
  const [searchingKeyword, setSearchingKeyword] = useState("");
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
          } else if (status == "error") {
            return (
              <TabPane className="ui bottom attached tab segment">
                <div>
                  <h2>Error has occured</h2>
                </div>
              </TabPane>
            );
          } else {
            return (
              <TabPane className="ui bottom attached tab segment">
                {fetchedList.length == 0 && (
                  <div>
                    <h2>No result</h2>
                  </div>
                )}
                <ul className="clearfix cocktail__list">
                  {fetchedList.map((item, key) => {
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
    const { value } = data;

    _.debounce(() => {
      setSearchingKeyword(value ? value : "");
    }, 500)();
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
