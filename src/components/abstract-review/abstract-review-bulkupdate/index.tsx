"use client";
import React, { useEffect, useState } from "react";
import Button from "@/common/Button";
import { CONSTANTS, STATUS, systemMessage } from "@/common/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import { AbstractReviewState } from "../inQueue/selectedItemsSlice";
import {
  IAbstractDetails,
  IInQueue,
  MonitorData,
  payloadMonitorID,
} from "../abstract.model";
import Image from "next/image";
import CreatableSelect from "react-select/creatable";
import { ReviewName } from "@/common/constants";
import {
  GetAllCategoryAsync,
  GetAllClassificationAsync,
  GetCategoryAsync,
  GetClassificationAsync,
  generalState,
} from "@/components/system-settings/general.slice";
import Toast from "@/common/Toast";
import {
  AbstractReviewDataState,
  AbstractReviewMoniterReviewAsync as AbstractReviewMonitorReviewAsync,
  abstractDetailsByIdAsync,
} from "../abstract-review.slice";
import { useRouter } from "next/navigation";
import AbstractModel from "@/common/modal/AbstractModel";

interface Option {
  map(arg0: (category: any) => any): any;
  readonly label: string;
  readonly value: string;
}
interface ICheckboxState {
  [key: string]: boolean;
}

const Tag: string[] = [
  "Suspected event",
  "Suspected adverse event",
  "Suspected case",
];

type tag = string;

const AbstractReviewBulkUpdate = (context: { params: payloadMonitorID }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { inQueue, status } = useAppSelector(AbstractReviewState);
  const { AbstractDetails } = useAppSelector(AbstractReviewDataState);
  const [activeTab, setActiveTab] = useState("Details");
  const [highlightedContent, setHighlightedContent] = useState<any>();
  const [fetchedInQueue, setInQueue] = useState<MonitorData[]>([]);
  const [selectedAITags, setSelectedAITags] = useState<any>([]);
  const [selectedTags, setSelectedTags] = useState<tag[]>([]);
  const [abstractDetailsArray, setAbstractDetailsArray] = useState<
    IAbstractDetails[]
  >([]);
  const { params } = context;
  const monitor_id = params?.monitor_id as string;
  const pmid = params?.pmid as string;

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });
  const [selectCategories, setSelectCategories] = useState<Option>();
  const [classficationValue, setClassficationValue] = useState<Option>();
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [classificationOptions, setClassificationOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<Option | null>(null);
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    if (status === STATUS.fulfilled && Array.isArray(inQueue)) {
      // Ensure inQueue is an array before setting it in local state
      setInQueue(inQueue);
    }
  }, [status, inQueue]);

  useEffect(() => {
    // const key: string[] = [];
    //  for (const category in selectedAITags) {
    //   if (Object.prototype.hasOwnProperty.call(selectedAITags, category)) {
    //     const categoryData : [] = selectedAITags[category];

    //     if(categoryData.length > 0){
    //       if(category )
    //        key.push(category);
    //       }
    //   }
    // }
    if (selectedAITags) {
      const Tags = selectedAITags.map((item: any) => Object.keys(item));
      setKeys(Object.keys(selectedAITags));
      setSelectedTags(Tags);
    }
  }, [selectedAITags]);

  const [sourceCheckboxes, setSourceCheckboxes] = useState<ICheckboxState>({
    "Aggregate reporting": false,
    "Safety signal": false,
    "Serious event": false,
  });
  const [formValues, setFormValues] = useState({
    selectedCheckboxes: {} as ICheckboxState,
    selectedReview: "null",
    selectedCategories: "Categories",
    comment: "",
  });

  useEffect(() => {
    if (fetchedInQueue) {
      Promise.all(
        fetchedInQueue.map((queue, index) =>
          dispatch(abstractDetailsByIdAsync(queue?.search_result_id))
        )
      )
        .then((results) => {
          const detailsArray = results.map((result) => result.payload);
          setAbstractDetailsArray(detailsArray);
        })
        .catch((error) => {
          console.error("Error fetching abstract details:", error);
        });
    }
  }, [fetchedInQueue]);

  const { Category, Classification } = useAppSelector(generalState);

  useEffect(() => {
    setIsLoading(true);
    dispatch(GetAllCategoryAsync());
    dispatch(GetAllClassificationAsync());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const mappedCategoryOptions = Category.map((cat) => ({
      label: cat.name,
      value: cat.name,
    }));
    setCategoryOptions(mappedCategoryOptions);
  }, [Category]);

  useEffect(() => {
    const mappedClassificationOptions = Classification.map((cat) => ({
      label: cat.name,
      value: cat.name,
    }));
    setClassificationOptions(mappedClassificationOptions);
  }, [Classification]);

  const handleTabClick = (tabName: React.SetStateAction<string>) => {
    setActiveTab(tabName);
  };
  const [expandedStates, setExpandedStates] = useState(
    Array(fetchedInQueue.length).fill(false)
  );

  const handleCategoriesChange = (newValue: any) => {
    // Handle the change
    setSelectCategories(newValue);
  };

  const handleClassificationChange = (newValue: any) => {
    // Handle the change
    setClassficationValue(newValue);
  };

  const handleCommentChange = (e: { target: { value: string } }) => {
    setFormValues({
      ...formValues,
      comment: e.target.value,
    });
  };

  const handleSourceCheckboxChange = (e: { target: { name: string } }) => {
    const { name } = e.target;

    setSourceCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: !prevCheckboxes[name],
    }));
  };

  useEffect(() => {
    if (fetchedInQueue !== undefined) {
      if (fetchedInQueue) {
        const aiTag = fetchedInQueue.map((tag) => {
          return tag.ai_tags;
        });
        setSelectedAITags(aiTag);
      }
    }
  }, [fetchedInQueue]);

  const handleSubmit = async () => {
    const formValuesData = { ...formValues };
    try {
      let validity = true;
      if (!formValuesData.comment) {
        const message = systemMessage.required.replace("#field#", "Comment");
        Toast(message, { type: "error" });
        validity = false;
      }
      if (!formValuesData.selectedReview || formValuesData.selectedReview === "null") {
        Toast(systemMessage.required.replace("#field#", "Review"), {
          type: "error",
        });
        validity = false;
      }

      const idArray = inQueue.map((item, index) => {
        return item.id;
      });

      let payload: any = {
        expert_review_ids: idArray,
        decision: formValuesData.selectedReview,
        is_aggregate_reporting: sourceCheckboxes["Aggregate reporting"],
        is_safety_signal: sourceCheckboxes["Safety signal"],
        is_serious_event: sourceCheckboxes["Serious event"],
        comments: formValuesData.comment,
      };

      if (selectCategories) {
        payload.categories = selectCategories.map((category) => category.value);
      }

      if (classficationValue) {
        payload.classifications = classficationValue.map(
          (classification) => classification.value
        );
      }
      setIsLoading(true)
      if (validity) {
        const response = await dispatch(
          AbstractReviewMonitorReviewAsync(payload)
        );
        if (AbstractReviewMonitorReviewAsync.fulfilled.match(response)) {
          setIsLoading(false)
          Toast(systemMessage.review_successfully, { type: "success" });
        } else {
          setIsLoading(false)
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("Error submitting review:", error);
    }
  };

  const toggleContent = (index: number) => {
    const updatedExpandedStates = [...expandedStates];
    updatedExpandedStates[index] = !updatedExpandedStates[index];
    setExpandedStates(updatedExpandedStates);
  };
  const content =
    "Although 60 years have passed since it became widely available on the therapeutic market, paracetamol dosage in patients with liver disease remains a controversial subject. Fulminant hepatic failure has been a well documented consequence of paracetamol overdose since its introduction, while short and long term use have both been associated with elevation of liver transaminases, a surrogate marker for acute liver injury. From these reports it has been assumed that paracetamol use should be restricted or the dosage reduced in patients with chronic liver";
  return (
    <div>
      <div className="absolute top-[30px] flex">
        <div>
          <div className="flex ml-2 mt-3 items-center">
            <div className="cursor-pointer	" onClick={() => router.back()}>
              <div className="absolute w-[1.1rem]">
                <Image
                  className="absolute w-[100%]"
                  width={15}
                  height={15}
                  alt=""
                  src="/assets/icons/left-arrow.png"
                />
              </div>

              <div className="left-[25px] text-black ml-8 top-[2%] capitalize">
                <span className="no-underline">Back</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[700px] h-[40px] ml-[120px] bg-white rounded-xl header-box-shadow">
          <div className="flex justify-between">
            <Image
              src="/assets/icons/Group34 (1).png"
              width={50}
              height={50}
              alt="left"
              className="w-6 mt-2 ml-2 h-6"
            />
            <div className="flex flex-wrap">
              {/* <p className="mt-2">Paracetamol Advance</p> */}
            </div>
            <Image
              src="/assets/icons/Group34 (2).png"
              alt="left"
              width={50}
              height={50}
              className="right-0 mt-2 mr-2 w-6 h-6"
            />
          </div>
        </div>
      </div>
      <div className="flex ">
        <div className="w-full">
          {abstractDetailsArray &&
            abstractDetailsArray.map((item, index) => (
              <div key={index}>
                <AbstractModel
                  selectedAITags={selectedAITags[index]}
                  selectedTags={
                    Array.isArray(selectedTags[index])
                      ? selectedTags[index]
                      : []
                  }
                  item={item}
                  index={index}
                />
              </div>
            ))}
        </div>
        <div className="w-[25%] ml-4 mr-[20px] text-14 flex-grow rounded-lg h-[590px] bg-white custom-box-shadow transition-all ease-in-out duration-300 p-4">
          <div className="mt-4">
            <p className="text-14 font-semibold ml-2 text-silvers">
              Expert Review
            </p>
            <select
              className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  selectedReview: e.target.value,
                })
              }
              value={formValues.selectedReview}
            >
              <option value="null">Review Decision</option>
              {ReviewName.map((review) => (
                <option key={review} value={review}>
                  {review}
                </option>
              ))}
            </select>
          </div>
          <div className="review-decision-font">
            {Object.keys(sourceCheckboxes).map((source, index) => (
              <label className="flex text-14 items-center" key={index}>
                <input
                  type="checkbox"
                  className="form-checkbox mt-1 m-2 border cursor-pointer uppercase border-black mr-4 text-violet bg-white-900 rounded-md"
                  name={source}
                  checked={sourceCheckboxes[source]}
                  onChange={handleSourceCheckboxChange}
                />
                <span className="ml-0">
                  {source.charAt(0).toUpperCase() + source.slice(1)}
                </span>
              </label>
            ))}
          </div>
          <div className="mt-4 text-14">
            <CreatableSelect
              isClearable
              placeholder={"Categories"}
              isDisabled={isLoading}
              isLoading={isLoading}
              onChange={handleCategoriesChange}
              options={categoryOptions}
              isMulti
            />
          </div>
          <div className="mt-4 text-14">
            <CreatableSelect
              isClearable
              isDisabled={isLoading}
              placeholder={"Classifications"}
              isLoading={isLoading}
              onChange={handleClassificationChange}
              options={classificationOptions}
              isMulti
            />
          </div>
          <div className="mt-3 text-14 w-full">
            <textarea
              className="w-[90%] h-[100px] rounded-md font-archivo text-black"
              placeholder="Comments*"
              onChange={handleCommentChange}
              value={formValues.comment}
            />
          </div>
          <div className="mt-[120px]">
            <Button
              customClasses={"w-full text-14 px-4 py-3 bg-yellow"}
              buttonText="Submit"
              buttonType="submit"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbstractReviewBulkUpdate;
