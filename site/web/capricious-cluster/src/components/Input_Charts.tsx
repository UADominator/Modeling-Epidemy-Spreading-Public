import { useState } from "react";
import { FormComponent } from "./FormComponent";
import { ChartSIRt } from "./ChartSIRt";
import { ChartIS } from '../components/ChartIS';
import { ChartSR } from '../components/ChartSR';
import VisulRegions from "./VisualRegions";

const Input_Charts = () => {
  const [chartData, setChartData] = useState<any>(null);

  const handleFormSubmit = (data: any) => {
    setChartData(data);
  };
  

  return (
    <div>
      <div className="container">
        <FormComponent onSubmit={handleFormSubmit} />
      </div>

      <div className="container">
        <VisulRegions infection={chartData} geojsonUrl={`/geoJsons/${chartData==null ? "Україна" : chartData.city}.geojson`}/>
      </div>

      <div className="container">
        <ChartSIRt infection={chartData} />
      </div>

      <div className="container">
        <ChartIS infection={chartData} />
      </div>

      <div className="container">
        <ChartSR infection={chartData} />
      </div>
    </div>
  );
};

export default Input_Charts;


