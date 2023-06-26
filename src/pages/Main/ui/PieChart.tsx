import React from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  Colors,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { ICocktail } from "./CocktailCard";
import { IChart } from "./ChartsDisplay";
import { Tdataset } from "./ChartsDisplay";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

const PieChart = ({ data }: IChart) => {
  const proccessedDataset: ChartData<"pie"> = {
    labels: [],
    datasets: [
      {
        label: "Types of glass",
        data: [],
      },
    ],
  };

  // data processing,  instead of using Map, dictionary
  let dataset: Tdataset = {};
  data.forEach((el) => {
    if (!dataset.hasOwnProperty(el.strGlass)) {
      dataset[el.strGlass] = 1;
    } else {
      dataset[el.strGlass] += 1;
    }
  });
  for (const [key, value] of Object.entries(dataset)) {
    proccessedDataset.labels!.push(key);
    proccessedDataset.datasets[0].data.push(value);
  }
  return <Pie data={proccessedDataset} />;
};

export default PieChart;
