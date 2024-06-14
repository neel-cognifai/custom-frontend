"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { CONSTANTS, systemMessage } from "@/common/constants";
import { Utils } from "../../../utils/utils";
import { UpdatePasswordAsync, resetPasswordAsync } from "../auth/auth.slice";
import Toast from "@/common/Toast";
import InputField from "@/common/InputField";
import LoadingSpinner from "@/common/LoadingSpinner";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  console.log("token", token);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const initialValues = {
    password: "",
    confirm_password: "",
  };
 
  const updateSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required(CONSTANTS.signInConstants.password.newPassword),
    confirm_password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .oneOf(
        [Yup.ref("password"), undefined],
        "Passwords must match to new password"
      )
      .required(CONSTANTS.signInConstants.password.confirmPassword),
  });

  const returnToSignIn = () => {
    window.location.reload();
  };

  const handleSubmit = async (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    try {
      setLoading(true);
      if (token) {
        const payload = {
          token: token,
          password: values.confirm_password,
        };
        const response = await dispatch(resetPasswordAsync(payload));
        if (resetPasswordAsync.fulfilled.match(response)) {
          if (response?.payload?.status === 200) {
            Toast(systemMessage.PasswordUpdate, { type: "success" });
            setLoading(false);
          }
          else {
            Toast(response?.payload?.data.message, { type: "error" });
          }
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  return (
    <div className="flex justify-center h-screen mt-10">
      <div className="p-4 text-center">
        <Image
          src="/assets/icons/CoVigilAI_logo.png"
          alt="image1"
          width={200}
          height={50}
          className="mt-16"
        />
        <div>
          <div className="text-18 text-black text-center mt-20">
            Reset password
          </div>
          <div className="border-bottom mt-3"></div>
        </div>
        <div className="container">
          <div className="mr-4">
            <Formik
              initialValues={initialValues}
              validationSchema={updateSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleSubmit, setValues, isValid }) => (
                <>
                  <Form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap font-archivo text-archivo">
                      <div className="rounded-lg pb-4 overflow-hidden">
                        <div className="w-auto border-2 border-red-300 mt-3">
                          <div className="relative flex border-silver w-auto mb-8 item-center">
                            <div className=" sm:flex-wrap w-[350px] mb-8 item-center mr-12">
                              <div className="relative">
                                <div className="flex">
                                  <label className="text-14 ml-1">
                                    New Password
                                  </label>
                                  <span className="ml-1 text-red">*</span>
                                </div>
                                <InputField
                                  name="password"
                                  id="name"
                                  type="text"
                                  value={values.password}
                                  onChange={(
                                    event: ChangeEvent<{
                                      value: string;
                                    }>
                                  ) => {
                                    const { value } = event.target;
                                    setValues({ ...values, password: value });
                                  }}
                                />
                              </div>
                            </div>
                            <div className=" sm:flex-wrap w-[350px] item-center mr-12 ">
                              <div className="relative">
                                <div className="flex">
                                  <label className="text-14 ml-1">
                                    Confirm Password
                                  </label>
                                  <span className="ml-1 text-red">*</span>
                                </div>
                                <InputField
                                  name="confirm_password"
                                  id="name"
                                  type="password"
                                  value={values.confirm_password}
                                  onChange={(
                                    event: ChangeEvent<{
                                      value: string;
                                    }>
                                  ) => {
                                    const { value } = event.target;
                                    setValues({
                                      ...values,
                                      confirm_password: value,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="float-right">
                          <button
                            className={`font-Archivo mt-2  cursor-pointer add-button-font py-3 px-8 bg-violet text-white rounded-md ${
                              (!isValid ||
                                !values.password ||
                                !values.confirm_password) &&
                              "disabled-arrow"
                            }`}
                            type="submit"
                            disabled={
                              !isValid ||
                              !values.password ||
                              !values.confirm_password
                            }
                          >
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="float-left cursor-pointer"
                      onClick={returnToSignIn}
                    >
                       Return to <a href={window.location.origin}>Sign in</a>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default ResetPassword;
