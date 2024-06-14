import React, { ChangeEvent } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import { CONSTANTS, emailRegexPattern, systemMessage } from "@/common/constants";
import InputField from "@/common/InputField";
import { useAppDispatch } from "@/redux/store";
import { SendRestPasswordEmailAsync } from "./auth.slice";
import Toast from "@/common/Toast";

interface IProps {
  isOpen: boolean;
  onClose?: () => void;
}

const ForgotPassword: React.FC<IProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const initialValues = {
    email: "",
  };

  const signInSchema = Yup.object().shape({
    email: Yup.string()
      .matches(
        emailRegexPattern,
        CONSTANTS.signInConstants.email.invalidEmailFormat
      )
      .email(CONSTANTS.signInConstants.email.IsEmail)
      .required(CONSTANTS.signInConstants.email.requireEmail)
      .trim(),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    if (onClose) {
      const response = await dispatch(SendRestPasswordEmailAsync(values.email));
      if (SendRestPasswordEmailAsync.fulfilled.match(response)) {
        if(response?.payload.status === 400) {
          Toast(systemMessage.NoUserExists, { type: "error" });
          return;
        }
        Toast(systemMessage.ResetPasswordEmailSent, { type: "success" });
      } 
      onClose();
    }
  };

  return (
    <React.Fragment>
      <div className="email-send-modal p-4">
        <Image
          src="/assets/icons/Vector.svg"
          alt="close"
          className="absolute cursor-pointer right-4 top-4 w-3"
          onClick={onClose}
          width={10}
          height={10}
        />
        <div >
        <div className="text-18 text-center font-bold font-archivo mt-4 ml-1">
          Reset password
        </div>
        <div className="text-14 font-archivo ml-2 mt-4 ml-1">
        Enter your email address below to reset your password.
        </div>
        </div>
        <div className="flex pb-4">
          <Formik
            initialValues={initialValues}
            validationSchema={signInSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleSubmit, setValues, isValid }) => (
              <>
                <Form onSubmit={handleSubmit}>
                  <div className="flex mx-2">
                    <div className="mt-2">
                      <InputField
                        name="email"
                        id="email"
                        label="Email"
                        type="text"
                        value={values.email}
                        onChange={(event: ChangeEvent<{ value: string }>) => {
                          const { value } = event.target;
                          setValues({ ...values, email: value });
                        }}
                        customClasses="custom-width-login"
                      />
                    </div>
                    
                  </div>
                  <button
                        className={`ml-2 mt-5 px-8 text-white cursor-pointer py-3 rounded-lg bg-violet ${
                          (!isValid || !values.email) && "disabled-arrow"
                        }`}
                        disabled={!isValid || !values.email}
                        type="submit"
                      >
                        Reset password
                      </button>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassword;
