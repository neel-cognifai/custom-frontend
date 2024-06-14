import React, { useEffect, useState } from "react";
import SafetyReport, { ISafetyReport } from "./SafetyReport";
import Sender, { ISender, initialSenderValues } from "./Sender";
import Receiver, { IReceiver, initialReceiverValues } from "./Receiver";
import { LocalStorage } from "../../../../utils/localstorage";
import { CONSTANTS, STATUS, systemMessage } from "@/common/constants";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  GetE2BR2DataAsync,
  AddE2BR2DataAsync,
  generalState,
  UpdateE2BR2DataAsync,
} from "../general.slice";
import Toast from "@/common/Toast";
import LoadingSpinner from "@/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface ITenantData {
  tenant_id: string;
}

const E2BR2R3Component = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [safetyReportValue, setSafetyReportValue] = useState<ISafetyReport>({});
  const [safetyReportOnChange, setSafetyReportOnChange] =
    useState<boolean>(true);

  const [senderValue, setSenderValue] = useState<ISender>(initialSenderValues);
  const [senderValueOnChange, setSenderValueOnChange] = useState<boolean>(true);

  const [receiverValue, setReceiverValue] = useState<IReceiver>(
    initialReceiverValues
  );
  const [receiverValueOnChange, setReceiverValueOnChange] =
    useState<boolean>(true);
  const { loading, E2BR2Data } = useAppSelector(generalState);
  const [E2BR2items, setE2BR2items] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(true);

  const tenantData: string | null = LocalStorage.getItem(
    CONSTANTS.LOCAL_STORAGE_KEYS.TENANT_USER_ID
  );
  const tenant_id: ITenantData | null = tenantData
    ? (JSON.parse(tenantData) as ITenantData)
    : null;

  useEffect(() => {
    if (tenant_id) {
      dispatch(GetE2BR2DataAsync(tenant_id.tenant_id));
    }
  }, []);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setE2BR2items(E2BR2Data);
    }
  }, [loading, E2BR2Data, safetyReportValue]);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setSafetyReportValue(E2BR2items.nodes?.safety_report);
      setSenderValue(E2BR2items?.nodes?.sender);
      setReceiverValue(E2BR2items?.nodes?.receiver);
    }
  }, [loading, E2BR2items]);

  const handleSubmit = async () => {
    try {
      const payload = {
        tenant_id: tenant_id?.tenant_id,
        nodes: {
          safety_report: safetyReportValue,
          sender: senderValue,
          receiver: receiverValue,
        },
      };
      const response = await dispatch(AddE2BR2DataAsync(payload));
      if (AddE2BR2DataAsync.fulfilled.match(response)) {
        if (response.payload.status === 201) {
          if (tenant_id) {
            dispatch(GetE2BR2DataAsync(tenant_id?.tenant_id));
          }
          Toast(systemMessage.E2br2AddSuccess, { type: "success" });
        }
      } else {
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleOpenEdit = () => {
    setUpdate(false);
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const payload = {
        id: E2BR2items.id,
        nodes: {
          safety_report: safetyReportValue,
          sender: senderValue,
          receiver: receiverValue,
        },
      };
      const response = await dispatch(UpdateE2BR2DataAsync(payload));
      if (UpdateE2BR2DataAsync.fulfilled.match(response)) {
        if (response.payload.status === 200) {
          Toast(systemMessage.E2br2UpdateSuccess, { type: "success" });
          setReceiverValueOnChange(true);
          setSafetyReportOnChange(true);
          setSenderValueOnChange(true);
          if (tenant_id) {
            dispatch(GetE2BR2DataAsync(tenant_id?.tenant_id));
          }
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="bg-white custom-box-shadow scrollable-content-MyTeam w-full rounded-xl">
          <div className="mt-2 p-2">
            <div className="divide-y-2">
              <h4 className="ml-4 mt-2">Safety Report</h4>
              <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
              <SafetyReport
                safetyReportValue={safetyReportValue}
                setSafetyReportOnChange={setSafetyReportOnChange}
                onChange={(value: ISafetyReport) => setSafetyReportValue(value)}
              />
            </div>
          </div>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
          <div className="mt-2 p-2">
            <div className="divide-y-2">
              <h4 className="ml-4 mt-2">Sender</h4>
              <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
              <Sender
                senderValue={senderValue}
                setSenderValueOnChange={setSenderValueOnChange}
                onChange={(value: ISender) => setSenderValue(value)}
              />
            </div>
          </div>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
          <div className="mt-2 p-2">
            <div className="divide-y-2">
              <h4 className="ml-4 mt-2">Receiver</h4>
              <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
              <Receiver
                setReceiverValueOnChange={setReceiverValueOnChange}
                receiverValue={receiverValue}
                onChange={(value: IReceiver) => setReceiverValue(value)}
              />
            </div>
          </div>
          <div className="rounded overflow-hidden mr-6 mb-2 float-right">
            {E2BR2items?.status == "error" ? (
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-yellow cursor-pointer text-sm font-archivo text-white px-5 py-3 "
              >
                Submit
              </button>
            ) : (
              <div className="flex">
                <div>
                  <button
                    disabled={update}
                    type="submit"
                    onClick={handleUpdate}
                    className={`bg-yellow rounded-md cursor-pointer text-sm font-archivo text-white px-6 py-3 ${
                      update ? "disabled-select" : ""
                    }`}
                  >
                    Update
                  </button>
                </div>
                <div className="mt-2 ml-2 cursor-pointer" onClick={() => handleOpenEdit()}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    color={"#F39200"}
                    size="xl"
                    title="Edit"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default E2BR2R3Component;
