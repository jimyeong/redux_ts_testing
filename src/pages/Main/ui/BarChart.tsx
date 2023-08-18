import React from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  Colors,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ICocktail } from "./CocktailCard";
import { IChart } from "./ChartsDisplay";
import { Tdataset } from "./ChartsDisplay";
import "chart.js/auto";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale
);

const BarChart = ({ data }: IChart) => {
  const processedDataset: ChartData<"bar"> = {
    labels: [],
    datasets: [
      {
        label:
          "The comparison of the number of Alcoholic and Non Alcoholc Drinks",
        data: [],
      },
    ],
  };

  let dataset: Tdataset = {};
  data.forEach((el) => {
    if (!dataset.hasOwnProperty(el.strAlcoholic)) {
      dataset[el.strAlcoholic] = 1;
    } else {
      dataset[el.strAlcoholic] += 1;
    }
  });
  // data processing,  instead of using Map, dictionary
  for (const [key, value] of Object.entries(dataset)) {
    processedDataset.labels!.push(key);
    processedDataset.datasets[0].data.push(value);
  }

  return (
    <div role="bar__chart">
      <Bar data={processedDataset} className="bar__chart" />
    </div>
  );
};

export default BarChart;
