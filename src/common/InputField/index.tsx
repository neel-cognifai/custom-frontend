import React from "react";
import { ErrorMessage, Field } from "formik";
import { IInputFieldProps } from "../helper/common.modal";

const InputField = ({
  name,
  id,
  label,
  type,
  value,
  onChange,
  customClasses,
  disabled,
  icon,
}: IInputFieldProps) => {
  return (
    <div className="relative mt-1">
      <Field
        type={type}
        value={value}
        id={id}
        className={`${customClasses} ${
          disabled ? "text-dimgray " : "text-black"
        } block px-3 w-full font-archivo text-sm text-14 text-black bg-transparent rounded-md border-1 border-gray appearance-none
        focus:outline-none focus:ring-0 focus:border-black peer`}
        name={name}
        onChange={onChange}
        placeholder=""
        disabled={disabled}
      />
      {icon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {icon}
        </div>
      )}
      <label
        className={`absolute label-font text-buttonGray duration-300  font-archivo 
                transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  peer-focus:px-1
                 peer-focus:text-buttonGray peer-placeholder-shown:scale-100 
                 peer-placeholder-shown:-translate-y-[-6px] peer-placeholder-shown:top-[14%]  
                 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-2 left-3 ${
                   disabled ? "text-dimgray" : "text-black"
                 }
                 `}
      >
        {label}
      </label>
      <ErrorMessage name={name}>
        {(errorMessage) => (
          <div
            className={
              name == "password"
                ? "text-red absolute z-50 mt-2 ml-1 font-archivo errorMessage-font"
                : "text-red relative z-50 mt-2 font-archivo mb-2 ml-1 errorMessage-font"
            }
          >
            {errorMessage}
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};

export default InputField;