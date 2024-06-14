import React from "react";
import { IButtonProp } from '../helper/common.modal';


const Button = ({
  buttonType,
  customClasses,
  buttonText,
  onClick,
}: IButtonProp) => {
  return (
    <React.Fragment>
      <button
        type={buttonType}
        className={`${customClasses} cursor-pointer text-center font-bold justify-center text-sm text-white rounded shadow-sm font-Montserrat focus:outline-none leading-6
       `}
        onClick={onClick}
      >
        {buttonText}
      </button>
    </React.Fragment>
  );
};

export default Button;
