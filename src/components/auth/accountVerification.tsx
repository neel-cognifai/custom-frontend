import Button from "@/common/Button";
import { useFormik } from "formik";
import Link from "next/link";
import React, { ReactElement } from "react";
import OtpInput from "react-otp-input";
import * as Yup from "yup";

interface AccountVerification {
  children?: ReactElement;
  setTab?: any;
}

const AccountVerification: React.FC<AccountVerification> = ({ setTab }) => {
  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^[0-9]{4}$/, "Must be a 4-digit number")
      .required("OTP is required"),
  });
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("otp....", values.otp);
      setTab("login");
    },
  });
  return (
    <div>
      <div className="mb-3">
        <span className="font-medium text-lg text-black font-archivo ml-32">
          Account Verification
        </span>
      </div>
      <span className="font-normal text-[14px] text-lightslategray  font-archivo ml-14 text-center">
        we’ve sent a code to
      </span>
      <span className="text-black font-archivo text-[14px] text-center ml-1">
        cameron123@gmail.com
      </span>

      <form onSubmit={formik.handleSubmit}>
        <div className="m-24 ">
          <OtpInput
            value={formik.values.otp}
            onChange={(e) => formik.setFieldValue("otp", e)}
            numInputs={4}
            renderSeparator={<span className="mr-5"> </span>}
            renderInput={(props, index) => (
              <input
                {...props}
                name={`otp${index}`}
                onKeyPress={(e) => {
                  const isNumeric = /^[0-9]*$/;
                  if (!isNumeric.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            )}
            inputStyle="inputField"
          />
          {formik.touched.otp && formik.errors.otp ? (
            <div className="text-red font-archivo text-[14px] mt-2">
              {formik.errors.otp}
            </div>
          ) : null}
          <span className="flex w-auto font-normal text-[14px] text-lightslategray  font-archivo mt-12 text-center ">
            Don’t receive code?{" "}
            <Link
              href=""
              className="font-archivo text-[14px] text-black ml-1 no-underline"
            >
              {" "}
              Resend code
            </Link>
          </span>
        </div>

        <div className="absolute mr-12 ml-6 lg:w-[24%] bottom-[12%] md:w-[3%]">
          <div
            className="flex ml-28 cursor-pointer"
            onClick={() => setTab("signup")}
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.1667 12.8333H10.5L14.3383 8.99501C14.4477 8.88655 14.5345 8.75752 14.5937 8.61535C14.6529 8.47318 14.6834 8.32069 14.6834 8.16668C14.6834 8.01266 14.6529 7.86017 14.5937 7.718C14.5345 7.57583 14.4477 7.4468 14.3383 7.33834C14.1197 7.12105 13.8241 6.99908 13.5158 6.99908C13.2076 6.99908 12.9119 7.12105 12.6933 7.33834L7.68833 12.355C7.25015 12.7906 7.0026 13.3822 7 14C7.00568 14.6138 7.25299 15.2006 7.68833 15.6333L12.6933 20.65C12.8021 20.758 12.9311 20.8436 13.0729 20.9017C13.2148 20.9599 13.3667 20.9895 13.52 20.989C13.6733 20.9885 13.8249 20.9577 13.9664 20.8986C14.1078 20.8394 14.2362 20.753 14.3442 20.6442C14.4522 20.5354 14.5377 20.4064 14.5959 20.2646C14.654 20.1227 14.6837 19.9708 14.6831 19.8176C14.6826 19.6643 14.6519 19.5126 14.5927 19.3712C14.5336 19.2297 14.4471 19.1014 14.3383 18.9933L10.5 15.1667H22.1667C22.4761 15.1667 22.7728 15.0438 22.9916 14.825C23.2104 14.6062 23.3333 14.3094 23.3333 14C23.3333 13.6906 23.2104 13.3938 22.9916 13.1751C22.7728 12.9563 22.4761 12.8333 22.1667 12.8333Z"
                fill="#c4c9cf"
              />
            </svg>{" "}
            <span className="text-lightslategray  font-archivo text-[13px] mt-[4.7px] ml-2">
              Back to Signup
            </span>
          </div>

          <Button
            customClasses={
              "w-full text-white font-Archivo login-button-font font-bold capitalize px-3 py-2 bg-violet mt-3"
            }
            buttonText="Verify"
            buttonType="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default AccountVerification;
