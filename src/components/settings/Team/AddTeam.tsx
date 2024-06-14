import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import InputField from "@/common/InputField";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  CONSTANTS,
  STATUS,
  defaultPerPage,
  systemMessage,
} from "@/common/constants";
import Image from "next/image";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  EditTeamDataAsync,
  TeamUserCreateAsync,
  TeamUserUpdateAsync,
  UserDetailByTenantIDAsync,
  addTeamAsync,
  getByIdTeamAsync,
  getTeamAsync,
  teamState,
} from "./team.slice";
import { useDispatch } from "react-redux";
import { IAddTenant, ITenants, Team, TeamById } from "./team.model";
import Toast from "@/common/Toast";
import LoadingSpinner from "@/common/LoadingSpinner";
import { AllTenantListAsync, tenantState } from "../Tenant/tenant.slice";
import { getTeamUserAsync, userState } from "../User/user.slice";
import { IUserTenantByID, TeamUser } from "../User/user.model";

interface ProfileSettingProps {
  handelClose?: () => void;
  editTeamId?: string | Number;
  currentPage: number;
}

type YourTenant = {
  name: string;
  description: string;
};

type TeamMember = {
  id: string;
  email: string;
  tenant_id: Number;
  name: string;
};
const AddTeam: React.FC<ProfileSettingProps> = ({
  currentPage,
  handelClose,
  editTeamId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tenant } = useAppSelector(tenantState);
  const { UserMember, teamUser } = useAppSelector(userState);
  const [teamUserDetails, setTeamUserDetails] = useState<TeamUser[]>();
  const [teamDetail, setTeamDetail] = useState<Team[]>([]);
  const [tenantData, setTenantData] = useState<ITenants[]>([]);
  const { loading, teamData, teamDataById, getTenantByID } =
    useAppSelector(teamState);
  const [teamMember, setTeamMember] = useState<IUserTenantByID[]>([]);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    { id: string; email: string; name: string; percentage_load?: number }[]
  >([]);
  const [selectedName, setSelectedName] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [openModals, setOpenModals] = useState(
    new Array(teamMember?.length).fill(false)
  );

  const initialValues: any = {
    id: "",
    name: "",
    description: "",
    tenant_id: "",
    team_type: "",
    is_active: true,
    task_assignment: "",
  };

  const [emailList, setEmailList] = useState<[]>([]);
  const [percentageValues, setPercentageValues] = useState<number[]>(
    new Array(selectedCheckboxes.length).fill(0)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<Team>(initialValues);
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<Team>();

  useEffect(() => {
    setIsLoading(true);
    dispatch(AllTenantListAsync());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setTenantData(tenant);
      setTeamDetail(teamData);
    }
  }, [loading, tenant, UserMember, teamData]);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setTeamUserDetails(teamUser);
    }
  }, [teamUser, loading, editTeamId, teamUserDetails]);

  useEffect(() => {
    if (formValues.tenant_id !== "" && formValues.tenant_id !== undefined) {
      setTeamMember(getTenantByID);
    } else {
      setTeamMember([]);
    }
  }, [formValues.tenant_id, getTenantByID]);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      if (editTeamId) {
        const editData = teamDataById as unknown as TeamById;
        if (editData) {
          const {
            id,
            name,
            description,
            tenant_id,
            team_type,
            task_assignment,
            is_active,
          } = editData;
          const filteredData = teamUserDetails?.filter(
            (item) => item.team_id === editData.id
          );
          console.log("filteredData", filteredData);
          const res = filteredData?.map(
            ({ percentage_load }) => percentage_load
          );
          const emails =
            filteredData?.map((item) => ({
              id: item.user_id || "",
              email: item.email || "",
              name: item.user_name || "",
              percentage_load: item.percentage_load || 0,
            })) || [];
          setSelectedCheckboxes(emails);
          setPercentageValues(res as any);
          setFormValues({
            ...formValues,
            id: id,
            name: name,
            description: description,
            tenant_id: tenant_id,
            team_type: team_type,
            is_active: is_active,
            task_assignment: task_assignment,
          });
        }
      } else {
        // Reset form values when adding a new team
        setFormValues(initialValues);
        setSelectedCheckboxes([]);
      }
    }
  }, [loading, teamDataById, editTeamId, teamUser, teamData, teamUserDetails]);

  useEffect(() => {
    if (editTeamId !== "" && editTeamId !== undefined) {
      getEditTeamData(editTeamId as string);
    } else {
      setFormValues(formValues);
    }
  }, [editTeamId]);

  const getEditTeamData = async (tenantId: string) => {
    setIsLoading(true);
    try {
      const response = await dispatch(getByIdTeamAsync(tenantId));
      if (getByIdTeamAsync.fulfilled.match(response)) {
        await dispatch(
          UserDetailByTenantIDAsync(response.payload.data.tenant_id)
        );
        await dispatch(getTeamUserAsync());
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      setIsLoading(false);
      Toast("An error occurred. Please try again.", { type: "error" });
    }
    setIsLoading(false);
  };

  const handlePercentageChange = (index: number, value: string) => {
    const newPercentageValues = [...percentageValues];
    newPercentageValues[index] = parseFloat(value);
    setPercentageValues(newPercentageValues);
  };

  const teamSchema = Yup.object().shape({
    name: Yup.string().required(
      CONSTANTS.signInConstants.team_name.requireName
    ),
    description: Yup.string(),
    tenant_id: Yup.string(),
    team_type: Yup.string(),
    is_active: Yup.boolean(),
    task_assignment: Yup.string(),
  });

  const handleSubmit = async (values: Team) => {
    try {
      const totalPercentage = percentageValues.reduce(
        (sum, percentage) => sum + percentage,
        0
      );
      const trimmedValue = teamSchema.cast(values);
      const {
        name,
        description,
        tenant_id,
        team_type,
        is_active,
        task_assignment,
      } = trimmedValue;

      if (trimmedValue.task_assignment === "Auto") {
        if (totalPercentage !== 100) {
          Toast("Total percentage assigned must be 100%", { type: "error" });
          return;
        }
      }

      const payload: IAddTenant = {
        name: name,
        description: description!,
        tenant_id: tenant_id!,
        team_type: team_type!,
        task_assignment: task_assignment!,
        is_active: true,
      };

      if (payload.team_type === "" || payload.team_type === "None") {
        const message = systemMessage.required.replace("#field#", "Team Type");
        Toast(message, { type: "error" });
        return;
      }

      if (payload.tenant_id === "" || payload.tenant_id === "None") {
        const message = systemMessage.required.replace("#field#", "Tenant");
        Toast(message, { type: "error" });
        return;
      }

      if (payload.is_active === null) {
        const message = systemMessage.required.replace(
          "#field#",
          "Team Status"
        );
        Toast(message, { type: "error" });
        return;
      }

      if (
        payload.task_assignment === "" ||
        payload.task_assignment === "None"
      ) {
        const message = systemMessage.required.replace(
          "#field#",
          "Assign Type"
        );
        Toast(message, { type: "error" });
        return;
      }

      if (selectedCheckboxes.length <= 0) {
        const message = systemMessage.required.replace(
          "#field#",
          "Team Member"
        );
        Toast(message, { type: "error" });
        return;
      }

      setIsLoading(true);
      const response = await dispatch(addTeamAsync(payload));
      if (response.payload && response.payload.status === 201) {
        const teamID = response.payload.data?.id;
        let teamUserPayload = [];
        if (values.task_assignment === "Auto") {
          const selectedMembers = selectedCheckboxes.map((item, index) => ({
            percentage_load: percentageValues[index],
            user_id: item.id,
          }));
          teamUserPayload.push({
            team_id: teamID,
            users: selectedMembers,
          });
        } else {
          const selectedMembers = selectedCheckboxes.map((item, index) => ({
            user_id: item.id,
          }));
          teamUserPayload.push({
            team_id: teamID,
            users: selectedMembers,
          });
        }
        Toast(systemMessage.ADD_TEAM, { type: "success" });
        const TeamUserResponse = await dispatch(
          TeamUserCreateAsync(teamUserPayload)
        );
        if (TeamUserCreateAsync.fulfilled.match(TeamUserResponse)) {
          setIsLoading(false);
          if (handelClose) {
            setTeamDetail([]);
            handelClose();
          }
          setIsCreatingTeam(false);
          const paginationPayload = {
            pageNumber: 1,
            perPage: defaultPerPage,
          };
          setTeamMember([]);
          await dispatch(getTeamAsync(paginationPayload));
        } else {
          setFormValues(initialValues);
          setIsLoading(false);
          Toast(response.payload.data.message, { type: "error" });
        }
      }
    } catch (error) {
      setIsLoading(false);
      setFormValues(initialValues);
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleUpdate = async (values: Team, fieldsToUpdate: (keyof Team)[]) => {
    const totalPercentage = percentageValues.reduce(
      (sum, percentage) => sum + percentage,
      0
    );
    if (values.task_assignment === "Auto") {
      if (totalPercentage !== 100) {
        Toast("Total percentage assigned must be 100%", { type: "error" });
        return;
      }
    }

    if (values.team_type === "" || values.team_type === "None") {
      const message = systemMessage.required.replace("#field#", "Team Type");
      Toast(message, { type: "error" });
      return;
    }

    if (values.tenant_id === "" || values.tenant_id === "None") {
      const message = systemMessage.required.replace("#field#", "Tenant");
      Toast(message, { type: "error" });
      return;
    }

    if (values.is_active === null) {
      const message = systemMessage.required.replace("#field#", "Team Status");
      Toast(message, { type: "error" });
      return;
    }

    if (values.task_assignment === "" || values.task_assignment === "None") {
      const message = systemMessage.required.replace("#field#", "Assign Type");
      Toast(message, { type: "error" });
      return;
    }

    if (selectedCheckboxes.length <= 0) {
      const message = systemMessage.required.replace("#field#", "Team Member");
      Toast(message, { type: "error" });
      return;
    }
    const payload: any = { id: values.id };
    const editData = teamDataById as unknown as TeamById;
    fieldsToUpdate.forEach((field) => {
      if (values[field] !== editData[field]) {
        payload[field] = values[field];
      }
    });

    if (Object.keys(payload).length === 0) {
      Toast("No changes detected.", { type: "info" });
      return;
    }
    try {
      setIsLoading(true);
      const response = await dispatch(EditTeamDataAsync(payload));
      if (response.payload && response.payload.status === 200) {
        let teamUserPayload = [];
        if (values.task_assignment === "Auto") {
          const selectedMembers = selectedCheckboxes.map((item, index) => ({
            percentage_load: percentageValues[index],
            user_id: item.id,
          }));
          teamUserPayload.push({
            team_id: values.id,
            users: selectedMembers,
          });
        } else {
          const selectedMembers = selectedCheckboxes.map((item, index) => ({
            user_id: item.id,
          }));
          teamUserPayload.push({
            team_id: values.id,
            users: selectedMembers,
          });
        }
        Toast(systemMessage.ADD_UPDATED, { type: "success" });
        const TeamUserResponse = await dispatch(
          TeamUserUpdateAsync(teamUserPayload)
        );
        if (TeamUserUpdateAsync.fulfilled.match(TeamUserResponse)) {
          setIsLoading(false);
          if (handelClose) {
            setTeamDetail([]);
            handelClose();
          }
          setIsCreatingTeam(false);
        } else {
          setFormValues(initialValues);
          setIsLoading(false);
          Toast(response.payload.data.message, { type: "error" });
        }
        const paginationPayload = {
          pageNumber: currentPage,
          perPage: defaultPerPage,
        };
        setTeamMember([]);
        await dispatch(getTeamAsync(paginationPayload));
      } else {
        setFormValues(initialValues);
        setIsLoading(false);
        Toast(response.payload.data.message, { type: "error" });
      }
    } catch (error) {
      setIsLoading(false);
      setFormValues(initialValues);
      Toast("An error occurred. Please try again.", { type: "error" });
    }
  };

  const deleteItem = (id: string) => {};

  const handleCheckboxChange = (data: IUserTenantByID) => {
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      const selectedIndex = prevSelectedCheckboxes.findIndex(
        (item) => item.id === data.user_id
      );
      if (selectedIndex !== -1) {
        return prevSelectedCheckboxes.filter(
          (_, index) => index !== selectedIndex
        );
      } else {
        return [
          ...prevSelectedCheckboxes,
          { id: data.user_id, email: data.email, name: data.user_name },
        ];
      }
    });
  };

  const handleModalClose = () => {
    setOpenModalIndex(null);
    const newOpenModals = [...openModals];
    newOpenModals[selectedItemIndex] = false;
    setOpenModals(newOpenModals);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleModalClose();
      }
    };
    if (openModalIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModalIndex]);

  useEffect(() => {
    if (selectedTenantId) {
      onTenantChange(formValues);
    }
  }, [selectedTenantId]);

  const onTenantChange = async (formValues: Team) => {
    try {
      await dispatch(UserDetailByTenantIDAsync(formValues.tenant_id));
      setFormValues({
        ...formValues,
        tenant_id: formValues.tenant_id,
      });
    } catch (error: unknown) {
      setIsLoading(false);
      Toast("An error occurred. Please try again.", { type: "error" });
    }
  };

  const updatedFields: (keyof Team)[] = [
    "team_type",
    "name",
    "description",
    "task_assignment",
    "tenant_id",
    "is_active",
  ];
  // useEffect(()=> {
  //   if(editTeamId) {
  //     if(Array.isArray(selectedCheckboxes)){
  //       if(selectedCheckboxes.length > 0) {
  //       const res = selectedCheckboxes.map(({percentage_load})=>percentage_load);
  //       if(res !== undefined) {
  //         setPercentageValues(res as any);
  //       }
  //     }
  //   }
  // }

  // },[editTeamId, teamUserDetails])

  return (
    <>
      <section className="body-font tenant-box mx-3 mt-4 text-14 cursor-pointer bg-white tenant-box-shadow">
        <div className="container py-4 pr-4 divide-y-2 divide-blue-300">
          <div className="flex w-[97%] justify-between">
            <span className="text-sm mt-2 ml-4 font-medium text-black font-archivo ">
              {editTeamId ? "Update Team" : "Add Team"}
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
              {!editTeamId && (
                <button
                  type="submit"
                  onClick={() => handleSubmit(formValues)}
                  className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                >
                  Add
                </button>
              )}
              {editTeamId && (
                <button
                  type="submit"
                  className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                  onClick={() => handleUpdate(formValues, updatedFields)}
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
              initialValues={initialValues}
              validationSchema={teamSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                handleSubmit(values);
                resetForm();
                setSubmitting(false);
              }}
              enableReinitialize={true}
            >
              {({ values, handleSubmit, setValues }) => (
                <>
                  <Form onSubmit={handleSubmit}>
                    <div className="flex pb-4">
                      <div>
                        <div className="ml-8 mt-4 text-dimgray w-[350px]">
                          <div className="mb-3 w-full">
                            <InputField
                              customClasses={`${
                                editTeamId ? "disabled-select" : ""
                              }`}
                              name="team_name"
                              id="name"
                              label="Team Name *"
                              type="text"
                              disabled={editTeamId ? true : false}
                              value={values.name || formValues.name}
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setValues({
                                  ...values,
                                  team_name: value,
                                });
                                setFormValues({
                                  ...formValues,
                                  name: value,
                                });
                              }}
                            />
                          </div>
                          <div className="relative">
                            <textarea
                              rows={4}
                              id="team_goal"
                              value={
                                formValues.description || values.description
                              }
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setValues({
                                  ...values,
                                  description: value,
                                });
                                setFormValues({
                                  ...formValues,
                                  description: value,
                                });
                              }}
                              disabled={editTeamId ? true : false}
                              className={`block mt-2 text-14 px-3 w-full h-[100px]  font-archivo text-sm text-black bg-transparent rounded-md border-1 border-gray appearance-none
                                    focus:outline-none focus:ring-0 focus:border-black peer ${
                                      editTeamId ? "disabled-select" : ""
                                    }`}
                              placeholder=""
                            />
                            <label
                              className="absolute text-14 text-sm text-dimgray duration-300  font-archivo text-[1rem]
                transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  peer-focus:px-2
                 peer-focus:text-buttonGray peer-placeholder-shown:scale-100 
                 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/4 
                 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
                            >
                              Team goal
                            </label>
                          </div>
                          <div className="mt-4">
                            <div className="mt-2">
                              <p className="text-dimgray capitalize">
                                Team Type*
                              </p>
                            </div>
                            <select
                              className={`block cursor-pointer w-[380px] px-4 py-2 pr-8 text-14 text-dimgray leading-tight bg-white border border-silver rounded-md appearance-none focus:outline-none focus:border-blue-500 ${
                                editTeamId ? "disabled-select" : ""
                              }`}
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setValues({
                                  ...values,
                                  team_type: value,
                                });
                                setFormValues({
                                  ...formValues,
                                  team_type: value,
                                });
                              }}
                              disabled={editTeamId ? true : false}
                              value={formValues.team_type || values.team_type}
                            >
                              <option value="None">None</option>
                              <option value="Abstract Review">
                                Abstract Review
                              </option>
                              <option value="QC Review">QC Review</option>
                              <option value="Safety Surveillance">
                                Safety Surveillance
                              </option>
                              <option value="Signal Monitoring">
                                Signal Monitoring
                              </option>
                              <option value="Aggregate Reporting">
                                Aggregate Reporting
                              </option>
                            </select>
                          </div>
                          <div className="mt-2">
                            <div className="mt-2">
                              <p className="text-dimgray capitalize">Tenant*</p>
                            </div>
                            <select
                              disabled={editTeamId ? true : false}
                              className={`block cursor-pointer w-[380px] px-4 py-2 pr-8 text-14 text-dimgray leading-tight bg-white border border-silver rounded-md appearance-none focus:outline-none focus:border-blue-500
                              ${editTeamId ? "disabled-select" : ""}
                              `}
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setValues({
                                  ...values,
                                  tenant_id: value,
                                });
                                if (value !== "") {
                                  setFormValues({
                                    ...formValues,
                                    tenant_id: value,
                                  });
                                  setSelectedTenantId(formValues);
                                }
                              }}
                              value={values.tenant_id || formValues.tenant_id}
                            >
                              <option value="None">None</option>
                              {tenantData.map((tenant) => (
                                <option
                                  key={tenant.name}
                                  value={tenant.id}
                                  disabled={!tenant.is_active}
                                  className={`${
                                    !tenant.is_active ? "disabled-select" : ""
                                  } cursor-pointer`}
                                >
                                  {tenant.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mt-4">
                            <div className="mt-2">
                              <p className="text-dimgray capitalize">
                                assign type*
                              </p>
                            </div>
                            <select
                              className={`block cursor-pointer w-[380px] px-4 py-2 pr-8 text-14 text-dimgray leading-tight bg-white border border-silver rounded-md appearance-none focus:outline-none focus:border-blue-500
                              ${editTeamId ? "disabled-select" : ""}
                              `}
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setValues({
                                  ...values,
                                  task_assignment: value,
                                });
                                setFormValues({
                                  ...formValues,
                                  task_assignment: value,
                                });
                              }}
                              disabled={editTeamId ? true : false}
                              value={
                                formValues.task_assignment ||
                                values.task_assignment
                              }
                            >
                              <option value="None">None</option>
                              <option value="Manual">Manual</option>
                              <option value="Auto">Automatic</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      {teamMember.length > 0 && (
                        <div className="ml-4">
                          {!isEdit ? (
                            <>
                              <div className="flex text-14">
                                <p className="ml-8 mt-6 text-black">
                                  Team Member *
                                </p>
                                <div className="ml-2 mt-3">
                                  <div className="w-9 h-9 text-14 rounded-full bg-violet text-white flex items-center justify-center">
                                    {teamMember?.length}
                                  </div>
                                </div>
                              </div>
                              <div className="text-14 team-list-box ml-8 mt-2 overflow-y-auto max-h-96">
                                {teamMember?.map((item, index) => (
                                  <div
                                    className="flex cursor-pointer justify-between hover:bg-ghostwhite"
                                    key={`teamMember_${index}`}
                                  > 
                                    <div className="flex">
                                      <input
                                        type="checkbox"
                                        className={`border border-black mt-4 ml-3 ${
                                          !item.is_user_active
                                            ? "disabled-select"
                                            : ""
                                        }`}
                                        onChange={() =>
                                          handleCheckboxChange(item)
                                        }
                                        checked={selectedCheckboxes.some(
                                          (selectedItem) =>
                                            selectedItem.email === item.email
                                        )}
                                        disabled={!item.is_user_active}
                                      ></input>
                                      <div className="ml-2">
                                        <p className="text-14 text-black mt-4">
                                          {item.email}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="px-2 py-1 relative cursor-pointer">
                                      <Image
                                        src="/assets/icons/menu-dots-vertical.png"
                                        alt="3 dots"
                                        width={15}
                                        height={15}
                                        className="m-3 w-4"
                                        onClick={() => {
                                          setOpenModalIndex(index);
                                          const newOpenModals = [...openModals];
                                          newOpenModals[index] = true;
                                          setOpenModals(newOpenModals);
                                        }}
                                      />
                                      {openModalIndex === index &&
                                        openModals[index] && (
                                          <div
                                            ref={modalRef}
                                            className="absolute right-12 w-28 top-[5px] rounded-lg bg-white shadow-style"
                                            style={{ zIndex: 10 }}
                                          >
                                            <div className="flex items-center py-2 space-x-2">
                                              <div
                                                className="ml-4"
                                                onClick={() => {
                                                  deleteItem(item.email);
                                                }}
                                              >
                                                Make Admin
                                              </div>
                                            </div>
                                            <div className="border-bottom"></div>
                                            <div className="flex items-center py-2 space-x-2">
                                              <div
                                                className="ml-4"
                                                onClick={() => {
                                                  const newOpenModals = [
                                                    ...openModals,
                                                  ];
                                                  newOpenModals[index] = false;
                                                  setOpenModals(newOpenModals);
                                                }}
                                              >
                                                Remove
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex">
                                <p className="team-member-text-font ml-8 text-black">
                                  Team Member
                                </p>
                                <div className="ml-2 mt-3">
                                  <div className="w-6 h-6 text-14 rounded-full bg-violet text-white flex items-center justify-center">
                                    {emailList?.length}
                                  </div>
                                </div>
                              </div>
                              <div className="team-member-box-style ml-8 mt-2">
                                {emailList?.map((item, index) => (
                                  <>
                                    <div
                                      className="flex cursor-pointer justify-between hover:bg-ghostwhite"
                                      key={index}
                                    >
                                      <div className="flex">
                                        <div className="ml-2">
                                          <p className="team-member-email-font text-black m-3">
                                            {item}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      <div className="ml-4">
                        {(selectedName || selectedCheckboxes.length > 0) && (
                          <div className="mt-4 ml-8 text-black">
                            <div className="mt-4">
                              <div className="font font-semibold">
                                Selected Team Members:{" "}
                              </div>
                              {selectedCheckboxes.map((item, index) => (
                                <>
                                  <div className="mt-2" key={index}>
                                    {item.name}
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                        {formValues.task_assignment === "Auto" &&
                          selectedCheckboxes.length > 0 && (
                            <div className="mt-4 ml-8 text-black">
                              <div className="mt-2">
                                <div className="font-semibold">
                                  Selected Team Members with percentage:
                                </div>
                                {selectedCheckboxes.map((member, index) => (
                                  <>
                                    <div key={index} className="flex mt-4 pb-2">
                                      <span className="mt-2">
                                        {member.name}:
                                      </span>
                                      <input
                                        type="number"
                                        value={percentageValues[index]}
                                        onChange={(e) =>
                                          handlePercentageChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                        className="block w-20 px-4 py-2 ml-4 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none"
                                      />
                                      <div className="mt-2 ml-3">%</div>
                                    </div>
                                  </>
                                ))}
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
    </>
  );
};

export default AddTeam;
