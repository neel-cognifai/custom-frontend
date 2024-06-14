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
import {
  EditTenantAsync,
  GetTenantByIDAsync,
  addTenantAsync,
  getTenantAsync,
  tenantState,
} from "./tenant.slice";
import { IEditTenants, IGetTenant } from "./tenant.model";

interface ITeam {
  name: string;
  description: string;
}

interface EditTenant {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}
interface Props {
  currentPage: number
  handelClose?: () => void;
  editTenantId?: string;
  setCustomerNames: React.Dispatch<React.SetStateAction<string[]>>;
}
const AddTenant: React.FC<Props> = ({
  currentPage,
  handelClose,
  editTenantId,
  setCustomerNames,
}) => {
  const initialValues: any = {
    id: "",
    name: "",
    description: "",
    is_active: false,
  };
  const { loading, getTenant } = useSelector(tenantState);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    if (editTenantId !== "" && editTenantId !== undefined) {
      getEditTenantData(editTenantId);
    } else {
      setFormValues(initialValues);
    }
  }, [editTenantId]);

  const getEditTenantData = async (tenantId: string) => {
    setIsLoading(true);
    await dispatch(GetTenantByIDAsync(tenantId));
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      loading == STATUS.fulfilled &&
      editTenantId !== "" &&
      editTenantId !== undefined
    ) {
      const editTenantData = getTenant as unknown as IGetTenant;
      if (editTenantData) {
        const { id, description, name, is_active } = editTenantData;

        setFormValues({
          id: id,
          name: name,
          description: description,
          is_active: is_active,
        });
      }
    } else {
      setFormValues(initialValues);
    }
  }, [loading, getTenant]);

  const tenantSchema = Yup.object().shape({
    name: Yup.string().required(CONSTANTS.tenantConstants.customer_name),
    description: Yup.string().required(),
  });

  const handleSubmit = async (values: ITeam) => {
    try {
      const trimmedValue = tenantSchema.cast(values);
      const { name, description } = trimmedValue;
      const payload = {
        name,
        description,
        is_active: true,
      };
      setIsLoading(true);
      const response = await dispatch(addTenantAsync(payload));
      if ((response.payload as { status: number }).status === 201) {
        setIsLoading(false);
        Toast(systemMessage.ADD_TENANT, {
          type: "success",
        });
        if (handelClose) {
          handelClose();
        }
      } else {
        setIsLoading(false)
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
      await dispatch(getTenantAsync(PaginationPayload));
      setIsLoading(false)
    } catch (error: unknown) {
      setIsLoading(false);
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleUpdate = async (values: IEditTenants) => {
    try {
      const trimmedValue = tenantSchema.cast(values);
      const { name, description } = trimmedValue;
      const payload = {
        id: values.id,
        
        description,
        is_active: values.is_active,
      };
      setIsLoading(true);
      const response = await dispatch(EditTenantAsync(payload));
      if ((response.payload as { status: number }).status === 200) {
        setIsLoading(false);
        Toast(systemMessage.UPDATE_TENANT, {
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
      await dispatch(getTenantAsync(PaginationPayload));
    } catch (error: unknown) {
      setIsLoading(false);
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <React.Fragment>
      <section className="body-font tenant-box mx-3 mt-4 text-14 bg-white tenant-box-shadow">
        <div className="container py-4 pr-4 divide-y-2 divide-blue-300">
          <div className="flex w-[97%] justify-between">
            <span className="text-sm mt-2 ml-4 font-medium text-black font-archivo ">
              {editTenantId ? 'Update Tenant':  'Add Tenant'}
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
              {!editTenantId && (
                <button
                  type="submit"
                  className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                  onClick={() => handleSubmit(formValues)}
                >
                  Add
                </button>
              )}
              {editTenantId && (
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
              {({values, handleSubmit, setValues }) => (
                <>
                  <Form onSubmit={handleSubmit}>
                    <div className="ml-8 mt-4 text-dimgray w-[350px]">
                      <div className="mb-3 w-full">
                        <InputField
                          name="tenant_name"
                          id="tenant_name"
                          label="Tenant Name"
                          customClasses={`${editTenantId ? 'disabled-select': ''}`}
                          disabled={editTenantId ? true : false}
                          type="text"
                          value={formValues.name}
                          onChange={(event: ChangeEvent<{ value: string }>) => {
                            const { value } = event.target;
                            setFormValues({ ...formValues, name: value });
                          }}
                        />
                      </div>
                      <div className="relative text-14 pb-6">
                        <textarea
                          rows={4}
                          id="description"
                          value={formValues.description}
                          onChange={(event: ChangeEvent<{ value: string }>) => {
                            const { value } = event.target;
                            setFormValues({
                              ...formValues,
                              description: value,
                            });
                          }}
                          className={`block mt-2 text-14 px-3 w-full h-[100px]  font-archivo text-sm text-black bg-transparent rounded-md border-1 border-gray appearance-none focus:outline-none focus:ring-0 focus:border-black peer`}
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

export default AddTenant;
