import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { CONSTANTS, systemMessage } from "@/common/constants";
import InputField from "@/common/InputField";
import { Utils } from "../../../utils/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { UpdatePasswordAsync } from "./auth.slice";
import Toast from "@/common/Toast";
import LoadingSpinner from "@/common/LoadingSpinner";

interface IUpdateAbstract {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateCredentials: React.FC<IUpdateAbstract> = ({ onClose }) => {
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

  const handleSubmit = async (
    values: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    try {
      setLoading(true);
      const payload = {
        id: Utils.getUserData()?.user_id,
        password: values.confirm_password,
      };
      const response = await dispatch(UpdatePasswordAsync(payload));
      if (UpdatePasswordAsync.fulfilled.match(response)) {
        if (response?.payload?.status === 200) {
          Toast(systemMessage.PasswordUpdate, { type: "success" });
          setLoading(false);
          onClose();
        }
      } else {
        setLoading(false);
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false  );
      throw error;
    }
  };
  return (
    <div>
      <div className="update-credentials-modal p-4">
        <Image
          src="/assets/icons/Vector.svg"
          alt="close"
          className="absolute cursor-pointer right-4 top-4 w-3"
          onClick={onClose}
          width={10}
          height={10}
        />
        <div>
          <div className="text-14 text-black">Update Password</div>
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
                      <div className="rounded-lg flex pb-4 overflow-hidden">
                        <div className="w-auto border-2 border-red-300 mt-3">
                          <div className="relative flex border-silver w-[500px] mb-8 item-center mr-12">
                            <div className=" sm:flex-wrap w-[300px] mb-8 item-center mr-12">
                              <InputField
                                name="password"
                                id="name"
                                label="New Password *"
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
                            <div className=" sm:flex-wrap w-[300px] item-center mr-12 ">
                              <InputField
                                name="confirm_password"
                                id="name"
                                label="Confirm Password *"
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
                        <div className="absolute right-5 bottom-4">
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
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
      {loading && <LoadingSpinner modelClass={"modelClass"} />}
    </div>
  );
};

export default UpdateCredentials;
