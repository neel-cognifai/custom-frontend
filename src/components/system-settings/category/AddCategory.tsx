import {
  CONSTANTS,
  STATUS,
  defaultPerPage,
  systemMessage,
} from "@/common/constants";
import { AppDispatch, useAppSelector } from "@/redux/store";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { LocalStorage } from "../../../../utils/localstorage";
import {
  CreateCategoryAsync,
  EditCategoryAsync,
  GetCategoryAsync,
  GetCategoryByIDAsync,
  generalState,
} from "../general.slice";
import Toast from "@/common/Toast";
import InputField from "@/common/InputField";
import { Form, Formik } from "formik";
import TenantUserData, { ICategory } from "../general.model";
import LoadingSpinner from "@/common/LoadingSpinner";

interface AddCategoryProps {
  currentPage: number
  handelClose?: () => void;
  editCategoryId?: string | Number;
}

const AddCategory: React.FC<AddCategoryProps> = ({
  currentPage,
  handelClose,
  editCategoryId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initialValues: ICategory = {
    id: "",
    tenant_id: "",
    name: "",
    description: "",
    created_on: "",
    modified_on: "",
  };
  const { loading, getCategory } = useAppSelector(generalState);
  const [formValues, setFormValues] = useState<ICategory>(initialValues);

  useEffect(() => {
    if (editCategoryId !== "" && editCategoryId !== undefined) {
      getEditCategoryData(editCategoryId as string);
    } else {
      setFormValues(initialValues);
    }
  }, [editCategoryId]);

  const getEditCategoryData = async (categoryId: string) => {
    setIsLoading(true);
    await dispatch(GetCategoryByIDAsync(categoryId));
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      loading == STATUS.fulfilled &&
      editCategoryId !== "" &&
      editCategoryId !== undefined
    ) {
      const editCategoryData = getCategory as unknown as ICategory;
      if (editCategoryData) {
        const { id, name, description } = editCategoryData;

        setFormValues((prevValues) => ({
          ...prevValues,
          id: id,
          name: name,
          description: description,
        }));
      }
    } else {
      setFormValues(initialValues);
    }
  }, [loading, getCategory]);

  const FormSchema = Yup.object().shape({
    name: Yup.string().required(
      CONSTANTS.generalConstants.category.requireCategory
    ),
    description: Yup.string().required(
      CONSTANTS.generalConstants.category.requireDescription
    ),
  });

  const handleSubmit = async (values: ICategory) => {
    try {
      setIsLoading(true)
      const trimmedValue = FormSchema.cast(values);
      const { name, description } = trimmedValue;
      const TenantUserIdString = LocalStorage.getItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.TENANT_USER_ID
      );
      if (TenantUserIdString) {
        const TenantUser: TenantUserData = JSON.parse(TenantUserIdString);
        const payload = {
          tenant_id: TenantUser.tenant_id,
          name: name,
          description: description,
        };
        const response = await dispatch(CreateCategoryAsync(payload));
        if (CreateCategoryAsync.fulfilled.match(response)) {
          const PaginationPayload = {
            pageNumber: 1,
            perPage: defaultPerPage,
          };
          await dispatch(GetCategoryAsync(PaginationPayload));
          Toast(systemMessage.CategoryAddSuccessfully, { type: "success" });
          if (handelClose) {
            handelClose();
          }
          setIsLoading(false)
        } else {
          setIsLoading(false)
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      }
    } catch (error: unknown) {
      setIsLoading(false)
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleUpdate = async (values: ICategory) => {
    try {
      setIsLoading(true)
      const trimmedValue = FormSchema.cast(values);
      const { name, description } = trimmedValue;
      const payload = {
        review_category_id: values.id,
        name: name,
        description: description,
      };
      const response = await dispatch(EditCategoryAsync(payload));
      if (EditCategoryAsync.fulfilled.match(response)) {
        if (response.payload.status == 200) {
          const PaginationPayload = {
            pageNumber: currentPage,
            perPage: defaultPerPage,
          };
          await dispatch(GetCategoryAsync(PaginationPayload));
          Toast(systemMessage.CategoryUpdateSuccessfully, { type: "success" });
          if (handelClose) {
            handelClose();
          }
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
      setIsLoading(false)
    } catch (error: unknown) {
      setIsLoading(false)
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
              {editCategoryId ? "Update Category" : "Add Category"}
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
              {!editCategoryId && (
                <button
                  type="submit"
                  className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                  onClick={() => handleSubmit(formValues)}
                >
                  Add
                </button>
              )}
              {editCategoryId && (
                <button
                  type="submit"
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
        <div className="container">
          <div className="mr-4">
            <Formik
              initialValues={formValues}
              validationSchema={FormSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleSubmit, setValues }) => (
                <>
                  <Form onSubmit={handleSubmit}>
                    <div className="font-archivo text-archivo pb-4 ml-4 mt-4">
                      <div className="relative border-silver w-[350px] mb-2 item-center mr-12">
                        <InputField
                          name="name"
                          id="name"
                          label="Category*"
                          type="text"
                          customClasses="w-full"
                          value={values.name || formValues.name}
                          onChange={(event: ChangeEvent<{ value: string }>) => {
                            const { value } = event.target;
                            setFormValues({
                              ...formValues,
                              name: value,
                            });
                            setValues({
                              ...values,
                              name: value,
                            });
                          }}
                        />
                      </div>
                      <div className="w-[350px]">
                        <div className="relative text-14 pb-6">
                          <textarea
                            rows={4}
                            id="description"
                            value={formValues.description}
                            onChange={(
                              event: ChangeEvent<{ value: string }>
                            ) => {
                              const { value } = event.target;
                              setFormValues({
                                ...formValues,
                                description: value,
                              });
                            }}
                            className="block mt-2 text-14 px-3 w-full h-[100px]  font-archivo text-sm text-black bg-transparent rounded-md border-1 border-gray appearance-none
                                    focus:outline-none focus:ring-0 focus:border-black peer"
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

export default AddCategory;
