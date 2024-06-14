import React, { ChangeEvent, useEffect, useState } from "react";
import {
  STATUS,
  CONSTANTS,
  defaultPerPage,
  systemMessage,
} from "@/common/constants";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "@/common/InputField";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Toast from "@/common/Toast";
import LoadingSpinner from "@/common/LoadingSpinner";
import { IGetRole } from "./role.model";
import { AddRoleAsync, EditRoleAsync, GetRoleByIDAsync, getRoleAsync, roleState } from "./role.slice";

interface ITeam {
  id?: string;
  name: string;
  description: string;
  access_level: number;
  is_active: boolean;
}

interface EditTenant {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}
interface Props {
  currentPage: number;
  handelClose?: () => void;
  editRoleId?: string;
  setCustomerNames: React.Dispatch<React.SetStateAction<string[]>>;
}
const AddRole: React.FC<Props> = ({
  currentPage,
  handelClose,
  editRoleId,
  setCustomerNames,
}) => {
  const initialValues: any = {
    id: "",
    name: "",
    description: "",
    access_level: "",
    is_active: false,
  };
  const { loading, getRole } = useSelector(roleState);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<ITeam>(initialValues);

  useEffect(() => {
    if (editRoleId !== "" && editRoleId !== undefined) {
      getEditTenantData(editRoleId);
    } else {
      setFormValues(initialValues);
    }
  }, [editRoleId]);

  const getEditTenantData = async (roleId: string) => {
    setIsLoading(true);
    await dispatch(GetRoleByIDAsync(roleId));
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      loading == STATUS.fulfilled &&
      editRoleId !== "" &&
      editRoleId !== undefined
    ) {
      const editTenantData = getRole as unknown as IGetRole;
      if (editTenantData) {
        const { id, description, name, is_active, access_level } =
          editTenantData;

        setFormValues({
          id: id,
          name: name,
          description: description,
          access_level: access_level,
          is_active: is_active,
        });
      }
    } else {
      setFormValues(initialValues);
    }
  }, [loading, getRole]);

  const tenantSchema = Yup.object().shape({
    name: Yup.string().required(CONSTANTS.tenantConstants.customer_name),
    description: Yup.string().required(),
    access_level: Yup.number().required("Role selection is required"),
  });

  const handleSubmit = async (values: ITeam) => {
    try {
      const trimmedValue = tenantSchema.cast(values);
      const { name, description, access_level } = trimmedValue;
      const payload = {
        name,
        description,
        access_level,
        is_active: true,
      };
      setIsLoading(true);
      const response = await dispatch(AddRoleAsync(payload));
      if ((response.payload as { status: number }).status === 201) {
        setIsLoading(false);
        Toast(systemMessage.ADD_ROLE, {
          type: "success",
        });
        if (handelClose) {
          handelClose();
        }
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, {
          type: "error",
        });
      }
      setCustomerNames((prevCustomerNames: string[]) => [
        ...prevCustomerNames,
        values.name,
      ]);
      const PaginationPayload = {
        pageNumber: 1,
        perPage: defaultPerPage,
      };
      await dispatch(getRoleAsync(PaginationPayload));
      setIsLoading(false);
    } catch (error: unknown) {
      setIsLoading(false);
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      const trimmedValue = tenantSchema.cast(values);
      const { name, description, access_level } = trimmedValue;
      const payload = {
        id: values.id,
        description,
        access_level,
        is_active: values.is_active,
      };
      setIsLoading(true);
      const response = await dispatch(EditRoleAsync(payload));
      if ((response.payload as { status: number }).status === 200) {
        setIsLoading(false);
        Toast(systemMessage.ROLE_UPDATED, {
          type: "success",
        });
        if (handelClose) {
          handelClose();
        }
      } else if ((response.payload as { status: number }).status === 409) {
        setIsLoading(false);
        Toast(response.payload.data.message, { type: "error" });
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, {
          type: "error",
        });
      }
      setIsLoading(false);
      setCustomerNames((prevCustomerNames: string[]) => [
        ...prevCustomerNames,
        values.name,
      ]);
      const PaginationPayload = {
        pageNumber: currentPage,
        perPage: defaultPerPage,
      };
      await dispatch(getRoleAsync(PaginationPayload));
    } catch (error: unknown) {
      setIsLoading(false);
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleUpdate:", error);
    }
  };

  return (
    <React.Fragment>
      <section className="body-font tenant-box mx-3 mt-4 text-14 bg-white tenant-box-shadow">
        <div className="container py-4 pr-4 divide-y-2 divide-blue-300">
          <div className="flex w-[97%] justify-between">
            <span className="text-sm mt-2 ml-4 font-medium text-black font-archivo ">
              {editRoleId ? "Update Role" : "Add Role"}
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
              {!editRoleId && (
                <button
                  type="submit"
                  className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                  onClick={() => handleSubmit(formValues)}
                >
                  Add
                </button>
              )}
              {editRoleId && (
                <button
                  className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                  onClick={() => handleUpdate(formValues)}
                >
                  Update
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
              validationSchema={tenantSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                handleSubmit(values);
                resetForm();
                setSubmitting(false);
              }}
            >
              {({ values, handleSubmit, setValues }) => (
                <>
                  <Form onSubmit={handleSubmit}>
                    <div className="ml-8 flex mt-4 text-dimgray">
                      <div className="mb-3 w-[350px]">
                        <InputField
                          name="role_name"
                          id="role_name"
                          label="Role Name"
                          type="text"
                          disabled={editRoleId ? true : false}
                          customClasses={`${editRoleId ? 'disabled-select': ''}`}
                          value={formValues.name}
                          onChange={(event: ChangeEvent<{ value: string }>) => {
                            const { value } = event.target;
                            setFormValues({ ...formValues, name: value });
                          }}
                        />
                      </div>
                      <div className="relative ml-8 text-14 pb-6">
                        <textarea
                          rows={4}
                          id="description"
                          value={formValues.description}
                        //   disabled={editRoleId ? true : false}
                          onChange={(event: ChangeEvent<{ value: string }>) => {
                            const { value } = event.target;
                            setFormValues({
                              ...formValues,
                              description: value,
                            });
                          }}
                          className={`block mt-1 text-14 px-3 w-[350px] h-6  font-archivo text-sm text-black bg-transparent rounded-md border-1 border-gray appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
                          placeholder=""
                        />
                        <label
                          className="absolute text-sm text-14 text-dimgray pl-1 duration-300  font-archivo text-[1rem]
                transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  peer-focus:px-2
                 peer-focus:text-buttonGray peer-placeholder-shown:scale-100 
                 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/4 
                 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                        >
                          Description
                        </label>
                      </div>
                    </div>
                    <div className="ml-8 flex text-dimgray pb-6">
                      <div>
                        <div className="container bg-white rounded-xl px-4 py-4 shadow-role-card text-black w-72 h-56">
                          <div className="flex">
                            <div>
                              <input
                                type="radio"
                                id="drugAssociate"
                                name="access_level"
                                value="Drug Associate"
                                checked={formValues.access_level === 1}
                                onChange={() =>
                                  setFormValues({
                                    ...formValues,
                                    access_level: 1,
                                  })
                                }
                                className="form-radio radio-input ml-2 mt-2"
                              />
                            </div>
                            <div className="mt-1 font-semibold flex items-center justify-center align-middle">
                              <label htmlFor="drugAssociate" className="m-2">
                                Drug Associate
                              </label>
                            </div>
                          </div>
                          <ul className="mt-2 text-sm text-gray-600">
                            <li className="py-1 px-2">Create search string</li>
                            <li className="py-1 px-2">
                              Create and view monitors
                            </li>
                            <li className="py-1 px-2">
                              Access to abstract review workflow
                            </li>
                            <li className="py-1 px-2">
                              Access to QC review workflow
                            </li>
                            <li className="py-1 px-2">Data export facility</li>
                            <li className="py-1 px-2">
                              Review abstract screening process
                            </li>
                            <li className="py-1 px-2">Monitor management</li>
                          </ul>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="container bg-white rounded-xl px-4 py-4 shadow-role-card text-black w-72 h-56">
                          <div className="flex">
                            <div>
                              <input
                                type="radio"
                                id="teamAdmin"
                                name="access_level"
                                value="Team Admin"
                                checked={formValues.access_level === 2}
                                onChange={() =>
                                  setFormValues({
                                    ...formValues,
                                    access_level: 2,
                                  })
                                }
                                className="form-radio radio-input ml-2 mt-2"
                              />
                            </div>
                            <div className="mt-1 font-semibold flex items-center justify-center align-middle">
                              <label htmlFor="teamAdmin" className="m-2">
                                Team Admin
                              </label>
                            </div>
                          </div>
                          <ul className="mt-2 text-sm text-gray-600">
                            <li className="py-1 px-2">Drug associate level</li>
                            <li className="py-1 px-2">work assignment</li>
                            <li className="py-1 px-2">
                              Audit trail management
                            </li>
                            <li className="py-1 px-2">Audit log</li>
                            <li className="py-1 px-2">Analytics</li>
                          </ul>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="container bg-white rounded-xl px-4 py-4 shadow-role-card text-black w-72 h-56">
                          <div className="flex">
                            <div>
                              <input
                                type="radio"
                                id="systemAdmin"
                                name="access_level"
                                value="System Admin"
                                checked={formValues.access_level === 3}
                                onChange={() =>
                                  setFormValues({
                                    ...formValues,
                                    access_level: 3,
                                  })
                                }
                                className="form-radio radio-input ml-2 mt-2"
                              />
                            </div>
                            <div className="mt-1 font-semibold flex items-center justify-center align-middle">
                              <label htmlFor="systemAdmin" className="m-2">
                                System Admin
                              </label>
                            </div>
                          </div>
                          <ul className="mt-2 text-sm text-gray-600">
                            <li className="py-1 px-2">Drug associate level</li>
                            <li className="py-1 px-2">Team admin level</li>
                            <li className="py-1 px-2">User management</li>
                            <li className="py-1 px-2">System management</li>
                          </ul>
                        </div>
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
    </React.Fragment>
  );
};

export default AddRole;
