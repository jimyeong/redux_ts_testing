import React from "react";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import { ICocktail } from "./CocktailCard";

export interface IChart {
  data: ICocktail[];
}

export type Tdataset = {
  [key: string]: number;
};

const ChartsDisplay = ({ data }: IChart) => {
  return (
    <React.Fragment>
      <div className="chart clearfix">
        <div className="chart__item chart__item--lft">
          <h3 className="chart__title chart__title">
            Types of Glass and The frequency of usage
          </h3>
          <PieChart data={data} />
        </div>
        <div className="chart__item chart__item--lft">
          <h3 className="chart__title chart__title">
            Comparison of the number of Alcoholic and Non Alcoholc Drinks
          </h3>
          <BarChart data={data} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChartsDisplay;
