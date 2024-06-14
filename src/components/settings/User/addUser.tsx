import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import InputField from "@/common/InputField";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  CONSTANTS,
  STATUS,
  defaultPerPage,
  emailRegexPattern,
  systemMessage,
} from "@/common/constants";
import Image from "next/image";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import Toast from "@/common/Toast";
import LoadingSpinner from "@/common/LoadingSpinner";
import { IEditUser, ISetting } from "@/components/auth/auth.model";
import {
  AllTenantListAsync,
  createTenantAsync,
  tenantState,
} from "../Tenant/tenant.slice";
import {
  GetUserByIDAsync,
  addUserAsync,
  createRoleAsync,
  getRoleAsync,
  getRoleByIdAsync,
  getTeamMemberAsync,
  getTeamUserAsync,
  getTenantByIdAsync,
  userState,
} from "./user.slice";
import {
  IRoleList,
  IUserList,
  GetRoleByIdData,
  IUserTenantByID,
} from "./user.model";
import { IGetTenant } from "../Tenant/tenant.model";

interface ProfileSettingProps {
  currentPage: number;
  handelClose?: () => void;
  editUserId?: string;
}

type YourTenant = {
  id: string;
  name: string;
  description: string;
};

const AddUser: React.FC<ProfileSettingProps> = ({
  currentPage,
  handelClose,
  editUserId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [userDetail, setUserDetail] = useState<IUserList[]>([]);
  const [tenantData, setTenantData] = useState<IGetTenant[]>([]);
  // const [formValues, setFormValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [RoleDetail, setRoleDetail] = useState<IRoleList[]>([]);
  const {
    loading,
    UserMember,
    roleData,
    getUser,
    getRoleByIdDetails,
    getTenantByID,
  } = useAppSelector(userState);
  const { tenant } = useAppSelector(tenantState);

  const initialValues: ISetting = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    select_role: "None",
    select_tenant: "None",
  };
  const [formValues, setFormValues] = useState<ISetting>(initialValues);
  const [isUserNameEditable, setIsUserNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(AllTenantListAsync());
    dispatch(getRoleAsync());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setTenantData(tenant);
      setUserDetail(UserMember);
      setRoleDetail(roleData);
    }
  }, [loading, tenant, UserMember, roleData]);

  useEffect(() => {
    if (
      loading === STATUS.fulfilled &&
      editUserId !== "" &&
      editUserId !== undefined
    ) {
      const editUser = getUser as IUserList;
      const role = getRoleByIdDetails as GetRoleByIdData[];
      const Tenant = getTenantByID as IUserTenantByID[];
      if (editUser) {
        const { name, email } = editUser;
        setFormValues({
          ...formValues,
          name: name,
          email: email,
          select_role: role[0]?.role_id,
          select_tenant: Tenant[0]?.tenant_id,
        });
        setIsUserNameEditable(true);
        setIsEmailEditable(true);
      }
    } else {
      setFormValues(formValues);
    }
  }, [loading, editUserId, getUser, getRoleByIdDetails, getTenantByID]);

  useEffect(() => {
    if (editUserId !== "" && editUserId !== undefined) {
      getEditTenantData(editUserId);
      getRoleById(editUserId);
      getTenantById(editUserId);
    } else {
      setFormValues(formValues);
    }
  }, [editUserId]);

  const getRoleById = async (id: string) => {
    setIsLoading(true);
    await dispatch(getRoleByIdAsync(id));
    setIsLoading(false);
  };

  const getTenantById = async (id: string) => {
    setIsLoading(true);
    await dispatch(getTenantByIdAsync(id));
    setIsLoading(false);
  };

  const getEditTenantData = async (tenantId: string) => {
    setIsLoading(true);
    await dispatch(GetUserByIDAsync(tenantId));
    setIsLoading(false);
  };

  const signUpSchema = Yup.object().shape({
    name: Yup.string().required(
      CONSTANTS.signInConstants.user_name.requireName
    ),
    email: Yup.string()
      .matches(
        emailRegexPattern,
        CONSTANTS.signInConstants.email.invalidEmailFormat
      )
      .email(CONSTANTS.signInConstants.email.IsEmail)
      .required(CONSTANTS.signInConstants.email.requireEmail)
      .trim(),
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
    select_role: Yup.string(),
    select_tenant: Yup.string(),
  });

  const handleSubmit = async (values: ISetting) => {
    try {
      const trimmedValue = signUpSchema.cast(values);
      const {
        name,
        email,
        password,
        confirm_password,
        select_role,
        select_tenant,
      } = trimmedValue;

      if (select_role === "" || select_role === "None") {
        const message = systemMessage.required.replace("#field#", "Role");
        Toast(message, { type: "error" });
        return;
      }

      if (select_tenant === "" || select_tenant === "None") {
        const message = systemMessage.required.replace("#field#", "Tenant");
        Toast(message, { type: "error" });
        return;
      }

      const payload = {
        name,
        email,
        password,
        is_active: true,
      };
      const response = await dispatch(addUserAsync(payload));
      if (response.payload && response.payload.status == 201) {
        const RolePayload = {
          user_id: response?.payload?.data?.id,
          role_id: select_role,
          is_active: true,
        };
        const TenantPayload = {
          user_id: response?.payload?.data?.id,
          tenant_id: select_tenant,
          is_active: true,
        };
        await dispatch(createRoleAsync(RolePayload));
        await dispatch(createTenantAsync(TenantPayload));
        const PaginationPayload = {
          pageNumber: 1,
          perPage: defaultPerPage,
        };
        await dispatch(getTeamMemberAsync(PaginationPayload));
        await dispatch(getTeamUserAsync());
        if (handelClose) {
          handelClose();
        }
        Toast(systemMessage.ADD_USER, { type: "success" });
        setIsUserNameEditable(true);
      } else {
        Toast(response?.payload?.data?.message, { type: "error" });
      }
    } catch (error) {
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleSubmit:", error);
    }
  };

  const changeRole = async (value: string) => {
    try {
      if (editUserId) {
        if (value === "" || value === "None") {
          const message = systemMessage.required.replace("#field#", "Role");
          Toast(message, { type: "error" });
          return;
        }
        const RolePayload = {
          user_id: editUserId!,
          role_id: value,
          is_active: true,
        };
        const response = await dispatch(createRoleAsync(RolePayload));
        if (createRoleAsync.fulfilled.match(response)) {
          if (response.payload.status == 409) {
            Toast(systemMessage.UserRoleExists, { type: "error" });
            return;
          }
          Toast(systemMessage.UPDATED_ROLE, { type: "success" });
          // if (handelClose) {
          //   handelClose();
          // }
        } else {
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
        const PaginationPayload = {
          pageNumber: currentPage,
          perPage: defaultPerPage,
        };
        await dispatch(getTeamMemberAsync(PaginationPayload));
      }
    } catch (error: unknown) {
      setIsLoading(false);
    }
  };
  const changeTenant = async (value: string) => {
    try {
      if (editUserId) {
        if (value === "" || value === "None") {
          const message = systemMessage.required.replace("#field#", "Tenant");
          Toast(message, { type: "error" });
          return;
        }
        const RolePayload = {
          user_id: editUserId!,
          tenant_id: value,
          is_active: true,
        };
        const response = await dispatch(createTenantAsync(RolePayload));
        if (createTenantAsync.fulfilled.match(response)) {
          if (response.payload.status == 409) {
            Toast(systemMessage.UserTenantExists, { type: "error" });
            return;
          }
          Toast(systemMessage.UPDATED_TENANT, { type: "success" });
          // if (handelClose) {
          //   handelClose();
          // }
        } else {
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
        const PaginationPayload = {
          pageNumber: currentPage,
          perPage: defaultPerPage,
        };
        await dispatch(getTeamMemberAsync(PaginationPayload));
      }
    } catch (error: unknown) {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <section className="body-font tenant-box mx-3 mt-4 text-14 bg-white tenant-box-shadow">
        <div className="container py-4 pr-4 divide-y-2 divide-blue-300">
          <div className="flex w-[97%] justify-between">
            <span className="text-sm mt-2 ml-4 font-medium text-black font-archivo ">
              {editUserId ? "Update User" : "Add User"}
            </span>
            <div className="flex gap-2">
              <div className="p-2">
                <button
                  className="font-Archivo cursor-pointer  text-dimgray bg-transparent rounded-sm"
                  onClick={handelClose}
                >
                  Cancel
                </button>
              </div>
              {!editUserId && (
                <button
                  type="submit"
                  className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                  onClick={() => handleSubmit(formValues)}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50 " />
        {/* <section className=" body-font flex"> */}
        <div className="container">
          <div className="mr-4">
            <Formik
              initialValues={formValues}
              validationSchema={signUpSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                handleSubmit(values);
                resetForm();
                setSubmitting(false);
              }}
            >
              {({ values, handleSubmit, setValues }) => (
                <>
                  <Form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap font-archivo text-archivo ml-4 mt-4 ">
                      <div className="rounded-lg flex pb-4 overflow-hidden">
                        <div className="w-auto border-2 border-red-300 mt-3 ml-4">
                          <div className="relative border-silver w-[320px] mb-8 item-center mr-12">
                            <InputField
                              name="email"
                              id="email"
                              label="Email*"
                              type="email"
                              customClasses={`w-full ${
                                isEmailEditable ? "disabled-select" : ""
                              }`}
                              value={values.email || formValues.email}
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setValues({ ...values, email: value });
                                setFormValues({
                                  ...formValues,
                                  email: value,
                                });
                              }}
                              disabled={isEmailEditable}
                            />
                          </div>
                          <div className="relative border-silver w-[320px] mb-8 item-center mr-12 ">
                            <InputField
                              name="name"
                              id="name"
                              label="User Name *"
                              type="text"
                              customClasses={`w-full ${
                                isUserNameEditable ? "disabled-select" : ""
                              }`}
                              value={values.name || formValues.name}
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setValues({ ...values, name: value });
                                setFormValues({
                                  ...formValues,
                                  name: value,
                                });
                              }}
                              disabled={isUserNameEditable}
                            />
                          </div>
                          {!editUserId && (
                            <>
                              <div className=" sm:flex-wrap mb-8 item-center mr-12">
                                <InputField
                                  name="password"
                                  id="name"
                                  label="New Password *"
                                  type="text"
                                  value={values.password || formValues.password}
                                  onChange={(
                                    event: ChangeEvent<{
                                      value: string;
                                    }>
                                  ) => {
                                    const { value } = event.target;
                                    setValues({ ...values, password: value });
                                    setFormValues({
                                      ...formValues,
                                      password: value,
                                    });
                                  }}
                                />
                              </div>
                              <div className=" sm:flex-wrap item-center mr-12 ">
                                <InputField
                                  name="confirm_password"
                                  id="name"
                                  label="Confirm Password *"
                                  type="password"
                                  value={
                                    values.confirm_password ||
                                    formValues.confirm_password
                                  }
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
                                    setFormValues({
                                      ...formValues,
                                      confirm_password: value,
                                    });
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="mt-1">
                            <p className="text-dimgray capitalize">Role*</p>
                          </div>
                          <div>
                            <select
                              className="block cursor-pointer w-[200px] px-4 py-2 pr-8 text-14 text-dimgray leading-tight bg-white border border-silver rounded-md appearance-none focus:outline-none focus:border-blue-500"
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setValues({ ...values, select_role: value });
                                setFormValues({
                                  ...formValues,
                                  select_role: value,
                                });
                                changeRole(value);
                              }}
                              value={formValues.select_role}
                            >
                              <option value="None">None</option>
                              {RoleDetail.length && RoleDetail?.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {!editUserId && (
                          <div className="ml-4">
                            <div className="mt-1">
                              <div className="mt-2">
                                <p className="text-dimgray capitalize">
                                  Tenant*
                                </p>
                              </div>
                              <select
                                className="block cursor-pointer w-[200px] px-4 py-2 pr-8 text-14 text-dimgray leading-tight bg-white border border-silver rounded-md appearance-none focus:outline-none focus:border-blue-500"
                                onChange={(
                                  event: ChangeEvent<{ value: string }>
                                ) => {
                                  const { value } = event.target;
                                  setValues({
                                    ...values,
                                    select_tenant: value,
                                  });
                                  setFormValues({
                                    ...formValues,
                                    select_tenant: value,
                                  });
                                  changeTenant(value);
                                }}
                                value={formValues.select_tenant}
                              >
                                <option value="None">None</option>
                                {tenantData?.map((tenant) => (
                                  <option
                                    key={tenant.id}
                                    value={tenant.id}
                                    disabled={!tenant.is_active}
                                    className={`${!tenant.is_active ? "disabled-select" : ""} cursor-pointer`}
                                  >
                                    {tenant.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </section>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default AddUser;
