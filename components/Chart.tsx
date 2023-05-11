import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

interface Data {
  budgetTotal: number;
  expensesTotal: number;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ budgetTotal, expensesTotal }: Data) => {
  const data = {
    labels: ["Budget", "Spent"],
    datasets: [
      {
        label: "₹",
        data: [budgetTotal, expensesTotal],
        backgroundColor: ["#3a61f8", "#faba5b"],
      },
    ],
  };
  const options = {};

  return (
    <div className="pt-12 md:flex md:justify-center md:h-[30rem] md:w-[30rem]">
      <Doughnut className="m-0" data={data} options={options}></Doughnut>
    </div>
  );
};

export default Chart;
