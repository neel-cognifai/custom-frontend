import Button from "@/common/Button";
import { useAppDispatch } from "@/redux/store";
import { Form, Formik } from "formik";
import React, { ChangeEvent, ReactElement, useState } from "react";
import * as Yup from "yup";
import { ISignUpPayload } from "./auth.model";
import { CONSTANTS } from "@/common/constants";
import { signUpAsync } from "./auth.slice";
import InputField from "@/common/InputField";
import Image from "next/image";

interface IProps {
  children?: ReactElement;
  setTab: any;
}
const Signup: React.FC<IProps> = ({ setTab }) => {
  const dispatch = useAppDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const initialValues: ISignUpPayload = {
    name: "",
    email: "",
    password: "",
  };

  const signUpSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email(CONSTANTS.signInConstants.email.IsEmail)
      .required(CONSTANTS.signInConstants.email.requireEmail)
      .trim(),
    password: Yup.string()
      .required(CONSTANTS.signInConstants.password.requirePassword)
      .trim(),
  });

  const handleSubmit = (values: ISignUpPayload) => {
    const trimmedValue = signUpSchema.cast(values);
    const { name, email, password } = trimmedValue;
    const payload = {
      name,
      email: email.toLowerCase(),
      password,
    };
    dispatch(signUpAsync(payload));
    setTab("AccountVerification");
  };

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={signUpSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, setValues }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <div className="mb-4 relative mr-12 ml-6">
                <div className="relative">
                  <InputField
                    name="name"
                    id="name"
                    label="Name"
                    type="text"
                    value={values.name}
                    onChange={(event: ChangeEvent<{ value: string }>) => {
                      const { value } = event.target;
                      setValues({ ...values, name: value });
                    }}
                  />
                  <div className="absolute right-0 top-2">
                    <Image
                      src="/assets/icons/person.svg"
                      alt="Hide Password"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4 relative mr-12 ml-6">
                <div className="relative">
                  <InputField
                    name="email"
                    label="Email"
                    id="email"
                    type="text"
                    value={values.email}
                    onChange={(event: ChangeEvent<{ value: string }>) => {
                      const { value } = event.target;
                      setValues({ ...values, email: value });
                    }}
                  />
                  <div className="absolute right-0 top-3">
                    <Image
                      alt="email"
                      src="/assets/icons/noun-email-6146813.svg"
                      width={20}
                      height={20}
                      title="Mail"
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4 mr-12 ml-6 relative">
                <InputField
                  name="password"
                  label="Set Password"
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={values.password}
                  onChange={(event: ChangeEvent<{ value: string }>) => {
                    const { value } = event.target;
                    setValues({ ...values, password: value });
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 bg-eyeWhite right-0 items-center text-grey-600"
                  onClick={togglePasswordVisibility}
                >
                  {!isPasswordVisible ? (
                    <Image
                      src="/assets/icons/eye-3-1.svg"
                      width={14}
                      height={14}
                      alt="Hide Password"
                      className="cursor-pointer relative"
                    />
                  ) : (
                    <Image
                      src="/assets/icons/closed-eye-icon.svg"
                      width={14}
                      height={14}
                      alt="Show Password"
                      className="cursor-pointer relative"
                    />
                  )}
                </button>
              </div>
              <div className="absolute mr-12 ml-6 lg:w-[24%] bottom-[12%] md:w-[38%]">
                <Button
                  customClasses={"w-full font-archivo px-4 py-3 bg-violet"}
                  buttonText="Sign Up"
                  buttonType="submit"
                />
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
