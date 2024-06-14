import React from "react";
import Loader, { Bars } from "react-loader-spinner";

type Props = {
  loaderType?: string;
  color?: string;
  height?: number;
  width?: number;
  modelClass?: string;
  text?: string;
};

const LoadingSpinner: React.FC<Props> = ({
  loaderType = "Bars",
  color = "#667acd",
  height = 50,
  width = 50,
  modelClass,
  text,
}) => {
  const LoaderComponent = loaderType === "Bars" ? Bars : null;

  return (
    <div
      className={`${
        modelClass ? "spinner-container-model" : "spinner-container"
      }`}
    >
      {LoaderComponent && (
        <div>
          <div className="ml-2">
            <LoaderComponent color={color} height={height} width={width} />
          </div>
          <div className="text-14 mt-2 text-violet">
            {text ? text : "Processing..."}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
