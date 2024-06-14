"use client";
import Button from "@/common/Button";
import {
  CONSTANTS,
  QcReviewName,
  STATUS,
  SummaryTags,
  systemMessage,
  tagsAbstract,
} from "@/common/constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import CreatableSelect from "react-select/creatable";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  CSVFileDetails,
  IAbstractDetails,
  IInQueue,
} from "@/components/abstract-review/abstract.model";
import Modal from "@/common/modal/model";
import E2br2 from "@/common/modal/e2br2";
import {
  AdvanceReviewDataState,
  AdvanceReviewMonitorDetailAsync,
  AdvanceReviewMonitorReviewAsync,
} from "../advance-review.slice";
import { IItem, IThirdPageAdvanceData } from "../advance.model";
import Toast from "@/common/Toast";
import LoadingSpinner from "@/common/LoadingSpinner";
import { useRouter } from "next/navigation";
import {
  GetAllCategoryAsync,
  GetAllClassificationAsync,
  generalState,
} from "@/components/system-settings/general.slice";
import {
  AbstractReviewDataState,
  abstractDetailsByIdAsync,
} from "@/components/abstract-review/abstract-review.slice";
import Details from "@/components/abstract-review/abstract-review-3/Details";
import AIMLModal from "@/components/abstract-review/abstract-review-3/AIMILModal";
import { LocalStorage } from "../../../../utils/localstorage";
import { Utils } from "../../../../utils/utils";
import MeSHtermsModal from "@/common/modal/MeSHtermsModal";

type tag = string;

interface Entity {
  entity: string;
  start: number;
  end: number;
}

interface Tags {
  [key: tag]: Entity[];
}

export interface IFormValues {
  selectedTags: string;
  selectedCheckboxes: ICheckboxState;
  selectedReview: string;
  selectedCategories: { label: string; value: string }[];
  selectedClassification: { label: string; value: string }[];
  comment: string;
  monitor_id: string;
  pmid: string;
}

interface ICheckboxState {
  [key: string]: boolean;
}
interface Option {
  label: string;
  value: string;
}
const Tag: string[] = [
  "Patient identified",
  "Suspected adverse event",
  "Suspected case",
];
const AdvancedReviewThirdPage = (context: { params: any }) => {
  const router = useRouter();
  const [selectedAITags, setSelectedAITags] = useState<any>([]);
  const [selectedTags, setSelectedTags] = useState<tag[]>([]);
  const [activeTab, setActiveTab] = useState("Details");
  const [feedback, setFeedback] = useState(false);
  const [fetchedInQueue, setInQueue] = useState<IInQueue>();

  const [tagEntity, setTagEntity] = useState(true);
  const [title, setTitle] = useState<string>("");
  const [abstract, setAbstract] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [generativeAIDecision, setGenerativeAIDecision] = useState<string>("");
  const [generativeAIDecisionScore, setGenerativeAIDecisionScore] =
    useState<number>(0);
  const [generativeAISummary, setGenerativeAISummary] = useState<string>("");
  const [casualityDecision, setCasualityDecision] = useState<string>("");
  const [casualityDecisionScore, setCasualityDecisionScore] =
    useState<number>(0);
  const [casualitySummary, setCasualitySummary] = useState<string>("");
  const [keys, setKeys] = useState<string[]>([]);
  const [toggleButton, setToggleButton] = useState<string>("");
  const [MeSHtermsArray, setMeSHtermsArray] = useState<string[]>([]);
  const [openMeSHterms, setOpenMeSHterms] = useState(false);

  const [author, setAuthor] = useState<string>("");
  const [summaryTag, setSummaryTag] = useState<any>([]);
  const [articleId, setArticleId] = useState<string>("");
  const [highlightedContent, setHighlightedContent] = useState<any>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenE2bR2, setIsOpenE2bR2] = useState<boolean>(false);
  const [abstractDetail, setAbstractDetail] = useState<IAbstractDetails | null>(
    null
  );
  const { status, reviewStatus, advanceReviewDetail } = useAppSelector(
    AdvanceReviewDataState
  );
  const { AbstractDetails } = useAppSelector(AbstractReviewDataState);
  const dispatch = useAppDispatch();
  const { params } = context;
  const monitor_id = params?.monitor_id as string;
  const pmid = params?.pmid as string;
  const [fetchAdvanceReviewDetail, setFetchAdvanceReviewDetail] =
    useState<IThirdPageAdvanceData | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [classificationOptions, setClassificationOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectCategories, setSelectCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [classificationValue, setClassificationValue] = useState<
    { label: string; value: string }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({
    selectedTags: "",
    selectedCheckboxes: {} as ICheckboxState,
    selectedReview: "",
    selectedCategories: [] as Option[],
    selectedClassification: [] as Option[],
    comment: "",
    monitor_id: "",
    pmid: "",
  });
  const { Category, Classification } = useAppSelector(generalState);
  const DataString: string | null = LocalStorage.getItem(
    CONSTANTS.LOCAL_STORAGE_KEYS.DATA_STORE
  );
  const Data: IItem[] | null = DataString
    ? (JSON.parse(DataString) as IItem[])
    : null;

  const indexString: string | null = LocalStorage.getItem(
    CONSTANTS.LOCAL_STORAGE_KEYS.RecordIndex
  );
  const Index: number | null = indexString
    ? (JSON.parse(indexString) as number)
    : 0;
  const [currentIndex, setCurrentIndex] = useState<number>(Index);

  const handleClickLeft = async () => {
    setIsLoading(true);
    if (currentIndex !== null && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      LocalStorage.setItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.RecordIndex,
        JSON.stringify(newIndex)
      );
      const currentRecord =
        Data && currentIndex !== null ? Data[newIndex] : null;
      if (currentRecord) {
        const id = currentRecord.id;
        await getDetails(id);
      }
    }
    setIsLoading(false);
  };

  const handleClickRight = async () => {
    setIsLoading(true);
    if (Data) {
      if (currentIndex !== null && currentIndex < Data.length) {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        LocalStorage.setItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.RecordIndex,
          JSON.stringify(newIndex)
        );

        const currentRecord =
          Data && currentIndex !== null ? Data[newIndex] : null;
        if (currentRecord) {
          const id = currentRecord.id;
          await getDetails(id);
        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getDetails(pmid);
    formValues.monitor_id = monitor_id;
    formValues.pmid = pmid;
  }, [monitor_id, pmid]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(GetAllCategoryAsync());
    dispatch(GetAllClassificationAsync());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setAbstractDetail(AbstractDetails);
    }
  }, [status, AbstractDetails]);

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

  useEffect(() => {
    if (abstractDetail) {
      setAbstract(abstractDetail.abstract);
      setKeywords(abstractDetail.keywords);
      setArticleId(abstractDetail.article_id);
    }
  }, [abstractDetail]);

  useEffect(() => {
    setLoading(true);
    if (status === STATUS.fulfilled && advanceReviewDetail) {
      setFetchAdvanceReviewDetail(advanceReviewDetail);
    }
    setLoading(false);
  }, [advanceReviewDetail, status]);

  useEffect(() => {
    if (fetchAdvanceReviewDetail?.search_result_id) {
      dispatch(
        abstractDetailsByIdAsync(fetchAdvanceReviewDetail?.search_result_id)
      );
    }
  }, [fetchAdvanceReviewDetail?.search_result_id]);

  useEffect(() => {
    if (tagEntity === true) {
      highlightWords();
    } else {
      setHighlightedContent(abstract);
    }
  }, [tagEntity, abstract, toggleButton]);

  const handleShowTags = () => {
    setTagEntity(true);
  };

  const handleTagClick = () => {
    setTagEntity(false);
  };

  useEffect(() => {
    if (fetchAdvanceReviewDetail !== undefined && fetchAdvanceReviewDetail) {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        comment:
          fetchAdvanceReviewDetail?.status === "Completed"
            ? fetchAdvanceReviewDetail?.comments
            : fetchAdvanceReviewDetail?.abstract_review_comments || "",
        selectedReview:
          fetchAdvanceReviewDetail?.status === "Completed"
            ? fetchAdvanceReviewDetail?.expert_decision
            : fetchAdvanceReviewDetail?.abstract_review_decision || "",

        selectedCategories:
          fetchAdvanceReviewDetail?.status === "Completed"
            ? fetchAdvanceReviewDetail?.categories?.map((cat) => ({
                label: cat,
                value: cat,
              }))
            : fetchAdvanceReviewDetail?.abstract_review_categories?.map(
                (cat) => ({
                  label: cat,
                  value: cat,
                })
              ) || [],

        selectedClassification:
          fetchAdvanceReviewDetail?.status === "Completed"
            ? fetchAdvanceReviewDetail?.classifications?.map((cat) => ({
                label: cat,
                value: cat,
              }))
            : fetchAdvanceReviewDetail?.abstract_review_classifications?.map(
                (cat) => ({
                  label: cat,
                  value: cat,
                })
              ) || [],
      }));

      setSourceCheckboxes({
        "Aggregate reporting":
          fetchAdvanceReviewDetail?.status === "Completed"
            ? fetchAdvanceReviewDetail?.is_aggregate_reporting
            : fetchAdvanceReviewDetail?.abstract_review_is_aggregate_reporting ||
              false,

        "Safety signal":
          fetchAdvanceReviewDetail?.status === "Completed"
            ? fetchAdvanceReviewDetail?.is_safety_signal
            : fetchAdvanceReviewDetail?.abstract_review_is_safety_signal ||
              false,

        "Serious event":
          fetchAdvanceReviewDetail?.status === "Completed"
            ? fetchAdvanceReviewDetail?.is_serious_event
            : fetchAdvanceReviewDetail?.abstract_review_is_serious_event ||
              false,
      });

      setTitle(fetchAdvanceReviewDetail?.title || "");
      setGenerativeAIDecision(fetchAdvanceReviewDetail?.ai_decision || "");
      setGenerativeAIDecisionScore(
        fetchAdvanceReviewDetail?.confidence_score || 0
      );
      setGenerativeAISummary(fetchAdvanceReviewDetail?.reason || "");
      setCasualityDecision(fetchAdvanceReviewDetail?.causality_decision || "");
      setCasualityDecisionScore(
        fetchAdvanceReviewDetail?.causality_confidence_score || 0
      );
      setCasualitySummary(fetchAdvanceReviewDetail?.causality_reason || "");
      setSelectedAITags(fetchAdvanceReviewDetail?.ai_tags || []);

      if (fetchAdvanceReviewDetail?.tags) {
        setSummaryTag(Object?.keys(fetchAdvanceReviewDetail?.tags));
      }

      highlightWords();
    }
  }, [fetchAdvanceReviewDetail]);

  const highlightWords = () => {
    let highlightedText = abstract;
    if (selectedTags.includes(tagsAbstract.Patient)) {
      const value = selectedAITags?.Patient[0]?.entity;
      highlightedText = setTagColor(
        value,
        "highlight-patient",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract.History)) {
      const value = selectedAITags?.History[0]?.entity;
      highlightedText = setTagColor(value, "history-text", highlightedText);
    }

    if (selectedTags.includes(tagsAbstract["Multiple Patients"])) {
      const value = selectedAITags["Multiple Patients"][0]?.entity;
      highlightedText = setTagColor(
        value,
        "multiple-patients-text",
        highlightedText
      );
    }

    if (
      selectedTags.includes(tagsAbstract["Interesting events / observations"])
    ) {
      const value =
        selectedAITags![tagsAbstract["Interesting events / observations"]][0]
          ?.entity;
      highlightedText = setTagColor(
        value,
        "interesting-events-observations-patient-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Animal/In-Vitro"])) {
      const value = selectedAITags!["Animal/In-Vitro"][0]?.entity;
      highlightedText = setTagColor(
        value,
        "animal-in-vitro-text",
        highlightedText
      );
    }

    if (
      selectedTags.includes(tagsAbstract["Abuse/Drug misuse/drug dependence"])
    ) {
      const value =
        selectedAITags!["Abuse/Drug misuse/drug dependence"]![0]?.entity;
      highlightedText = setTagColor(
        value,
        "abuse-drug-misuse-drug-dependence-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Study/Review/Clinical trial"])) {
      const value = selectedAITags!["Study/Review/Clinical trial"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "study-review-clinical-text",
        highlightedText
      );
    }

    if (
      selectedTags.includes(tagsAbstract["Occupational exposure(OC exposure)"])
    ) {
      const value =
        selectedAITags!["Occupational exposure(OC exposure)"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "occupational-exposure-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Lack of efficacy"])) {
      const value = selectedAITags!["Lack of efficacy"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "lack-of-efficacy-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Medication error"])) {
      const value = selectedAITags!["Medication error"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "medication-error-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Overdose"])) {
      const value = selectedAITags!["Overdose"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "overdose-in-vitro-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Drug interaction"])) {
      const value = selectedAITags!["Drug interaction"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "drug-interaction-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Special Keywords"])) {
      const value = selectedAITags!["Special Keywords"]![0]!.entity;
      highlightedText = setTagColor(value, "special-keywords", highlightedText);
    }

    if (selectedTags.includes(tagsAbstract.diagnosis)) {
      const value = selectedAITags![tagsAbstract.diagnosis]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "diagnosis-diagnostic-procedure-text",
        highlightedText
      );
    }

    if (
      selectedTags.includes(tagsAbstract["Diagnosis /Diagnostic Procedure"])
    ) {
      const value =
        selectedAITags!["Diagnosis /Diagnostic Procedure"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "diagnosis-diagnostic-procedure-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Monitor (Target Drug)"])) {
      const value = selectedAITags!["Monitor (Target Drug)"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "highlight-skyblue",
        highlightedText
      );
    }
    if (selectedTags.includes(tagsAbstract.Medications)) {
      const value = selectedAITags?.Medications[0]?.entity;
      highlightedText = setTagColor(
        value,
        "highlight-medications",
        highlightedText
      );
    }

    if (
      selectedTags.includes(
        tagsAbstract["Interesting section / special section"]
      )
    ) {
      const value =
        selectedAITags!["Interesting section / special section"]![0]!.entity;
      highlightedText = setTagColor(value, "highlight-blue", highlightedText);
    }

    if (selectedTags.includes(tagsAbstract.Elderly)) {
      const value = selectedAITags?.Elderly[0]?.entity;
      highlightedText = setTagColor(value, "elderly-text", highlightedText);
    }

    if (selectedTags.includes(tagsAbstract.Pediatric)) {
      const value = selectedAITags?.Pediatric[0]?.entity;
      highlightedText = setTagColor(value, "pediatric-text", highlightedText);
    }

    if (selectedTags.includes(tagsAbstract["Pregnancy/fetus/foetus"])) {
      const value = selectedAITags!["Pregnancy/fetus/foetus"]![0]?.entity;
      highlightedText = setTagColor(
        value,
        "pregnancy-fetus-foetus-text",
        highlightedText
      );
    }
    if (selectedTags.includes("Designated Medical Event")) {
      const value = fetchAdvanceReviewDetail?.designated_medical_events;
      highlightedText = setTagColor(
        value,
        "highlight-designated-medical-event",
        highlightedText
      );
    }

    if (
      toggleButton === tagsAbstract["Special Keywords"] &&
      selectedTags.includes(tagsAbstract["Special Keywords"])
    ) {
      const value = selectedAITags![toggleButton]?.entity;
      highlightedText = setTagColor(value, "special-keywords", highlightedText);
    }

    if (
      toggleButton === tagsAbstract["Branding"] &&
      selectedTags.includes(tagsAbstract["Branding"])
    ) {
      const value = selectedAITags![toggleButton]!.entity;
      highlightedText = setTagColor(
        value,
        "highlight-branding",
        highlightedText
      );
    }
    if (
      toggleButton === tagsAbstract["Diseases"] &&
      selectedTags.includes(tagsAbstract["Diseases"])
    ) {
      const value = selectedAITags![toggleButton]?.entity;
      highlightedText = setTagColor(
        value,
        "highlight-diseases",
        highlightedText
      );
    }

    if (
      toggleButton === tagsAbstract["Multiple Patients"] &&
      selectedTags.includes(tagsAbstract["Multiple Patients"])
    ) {
      const value = selectedAITags![toggleButton]!.entity;
      highlightedText = setTagColor(
        value,
        "multiple-patients-text",
        highlightedText
      );
    }

    if (
      toggleButton === tagsAbstract["Patient population"] &&
      selectedTags.includes(tagsAbstract["Patient population"])
    ) {
      const value = selectedAITags![toggleButton]!.entity;
      highlightedText = setTagColor(
        value,
        "highlight-patient-population-text",
        highlightedText
      );
    }
    setHighlightedContent(highlightedText);
  };
  useEffect(() => {
    // const key: string[] = [];
    // for (const category in selectedAITags) {
    //   if (Object.prototype.hasOwnProperty.call(selectedAITags, category)) {
    //     const categoryData: [] = selectedAITags[category];

    //     if (categoryData.length > 0) {
    //       if (category) key.push(category);
    //     }
    //   }
    // }
    if (selectedAITags) {
      setKeys(Object.keys(selectedAITags));
      setSelectedTags(Object.keys(selectedAITags));
    }
  }, [selectedAITags]);

  const [sourceCheckboxes, setSourceCheckboxes] = useState<ICheckboxState>({
    "Aggregate reporting": false,
    "Safety signal": false,
    "Serious event": false,
  });

  const getDetails = async (pmid: string) => {
    setLoading(true);
    await dispatch(AdvanceReviewMonitorDetailAsync(pmid));
    setLoading(false);
  };

  const setTagColor = (value: any, color: string, highlightedText: string) => {
    let modifiedText = highlightedText; // Create a copy to modify

    value?.forEach((entity: any) => {
      const highlightedTextHTML = `<span class=${color}>${entity}</span>`;
      // Escape special characters in the entity
      const escapedEntity = entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      modifiedText = modifiedText?.replace(
        new RegExp(escapedEntity, "gi"),
        highlightedTextHTML
      );
    });
    return modifiedText;
  };

  const handleFileUpload = async (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];

    // Show processing icon
    setIsUploading(true);

    // Simulate file upload process (replace this with your actual upload logic)
    await uploadFile(file);

    // Hide processing icon
    setIsUploading(false);
  };

  const uploadFile = (file: any) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  // useEffect(() => {
  //   if (reviewStatus === STATUS.fulfilled) {
  //     Toast(systemMessage.review_successfully, { type: "success" });
  //   }
  // }, [reviewStatus]);

  const handleCommentChange = (e: { target: { value: string } }) => {
    setFormValues({
      ...formValues,
      comment: e.target.value,
    });
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleE2bR2Open = () => {
    setIsOpenE2bR2(true);
  };

  const handleE2bR2Close = () => {
    setIsOpenE2bR2(false);
  };

  const handleTabClick = (tabName: React.SetStateAction<string>) => {
    setActiveTab(tabName);
  };

  const handleSourceCheckboxChange = (e: { target: { name: string } }) => {
    const { name } = e.target;

    setSourceCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: !prevCheckboxes[name],
    }));
  };

  const toggleTag = (tag: tag) => {
    if (
      keys.includes(tag) ||
      tag === "Interesting section / special section" ||
      tag === "Designated Medical Event"
    ) {
      if (selectedTags.includes(tag)) {
        setToggleButton("");
        setSelectedTags(selectedTags.filter((t) => t !== tag));
      } else {
        setToggleButton(tag);
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  if (fetchAdvanceReviewDetail?.designated_medical_events?.length) {
    selectedTags.push("Designated Medical Event");
    keys.push("Designated Medical Event");
  }
  const isTagSelected = (tag: tag) => selectedTags.includes(tag);

  const handleCategoriesChange = (newValue: any) => {
    setFormValues({
      ...formValues,
      selectedCategories: newValue,
    });
  };

  const handleClassificationChange = (newValue: any) => {
    setFormValues({
      ...formValues,
      selectedClassification: newValue,
    });
  };

  const tagColors: Record<string, string> = {
    patients: "#F39200",
    diagnosis: "purple",
    "Monitor (Target Drug)": "#FFFF00",
    medications: "fuchsia",
    "Interesting events / observations": "green",
    "Interesting section / special section": "cornflowerblue",
    reviewed: "red",
    "Clinical trial": "black",
    "Special Keywords": "greenyellow",
    "Special situation": "rebeccapurple",
    "Advisory Notice": "goldenrod",
    reporter: "gray",
  };

  const handleSubmit = async () => {
    if (fetchAdvanceReviewDetail?.status === "Unassigned") {
      Toast(systemMessage.Marked_as_unassigned, { type: "error" });
      return true;
    }

    if (fetchAdvanceReviewDetail?.status === "Completed") {
      Toast(systemMessage.Review_Already_Submitted, { type: "error" });
      return true;
    }
    const formValuesData = formValues;
    try {
      let validity = true;
      if (!formValuesData.comment) {
        const message = systemMessage.required.replace("#field#", "comment");
        Toast(message, { type: "error" });
        validity = false;
      }
      if (!formValuesData.selectedReview) {
        Toast(systemMessage.required.replace("#field#", "review"), {
          type: "error",
        });
        validity = false;
      }

      let payload: any = {
        expert_review_ids: [pmid],
        decision: formValuesData.selectedReview,
        is_aggregate_reporting: sourceCheckboxes["Aggregate reporting"]
          ? sourceCheckboxes["Aggregate reporting"]
          : false,
        is_safety_signal: sourceCheckboxes["Safety signal"]
          ? sourceCheckboxes["Safety signal"]
          : false,
        is_serious_event: sourceCheckboxes["Serious event"]
          ? sourceCheckboxes["Serious event"]
          : false,
        comments: formValuesData.comment,
      };

      if (formValuesData.selectedCategories) {
        payload.categories = formValuesData.selectedCategories.map(
          (category) => category.value
        );
      }

      if (formValuesData.selectedClassification) {
        payload.classifications = formValuesData.selectedClassification.map(
          (classification) => classification.value
        );
      }

      if (validity) {
        const response = await dispatch(
          AdvanceReviewMonitorReviewAsync(payload)
        );
        if (AdvanceReviewMonitorReviewAsync.fulfilled.match(response)) {
          Toast(systemMessage.review_successfully, { type: "success" });
          router.push(
            `${CONSTANTS.ROUTING_PATHS.advancedReview2}/${monitor_id}`
          );
        } else {
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const tabContents = {
    Details: (
      <Details
        detailsData={AbstractDetails}
        monitor_id={monitor_id}
        label={"Qc"}
      />
    ),
    "AI-ML Model Results": <AIMLModal ai_tags={advanceReviewDetail.ai_tags} />,
  };

  const handleFeedbackClick = () => {
    setFeedback(true);
  };

  const handleCancel = () => {
    setFeedback(false);
  };

  const handleDownload = () => {
    setIsExportLoading(true);
    let mergedDetails = { ...fetchAdvanceReviewDetail, ...abstractDetail };
    let selectedData: CSVFileDetails[] = [mergedDetails as any];
    const aiTagsSet = new Set<string>();
    selectedData.forEach((item) => {
      const aiTags = item.ai_tags;
      if (aiTags) {
        Object.keys(aiTags).forEach((tag) => aiTagsSet.add(tag));
      }
    });

    const aiTagsHeader = Array.from(aiTagsSet);
    const csvHeader = `Title,Citation Db,Assignee,Review Type,Status,Expert Decision,Aggregate Reporting,Safety Signal,Serious Event,Categories,Classifications,Comments,Search Result Status,Monitor Status,Active,Country,Article Id,Ai decision,Confidence Score,Reason,Causality Decision,Causality Confidence Score,Causality Reason,Designated Medical Events,Created By,Date Created,Modified By,Modified On,Abstract,Affiliation,Author,DOI,Filter Type,Keywords,language,Published On,publisher,Updated On,${aiTagsHeader.join(
      ","
    )}\n`;

    const csvContent = selectedData
      .map((item) => {
        const aiTagsMapping: Record<string, string> = {};
        aiTagsHeader.forEach((header) => {
          const aiTeg =
            item?.ai_tags?.[header]
              ?.flatMap((medication) =>
                medication?.entity?.map((entity) => entity)
              )
              .join(", ") ?? "-";
          aiTagsMapping[header] = aiTeg;
        });

        const csvRow = aiTagsHeader
          .map((header) => `"${aiTagsMapping[header]}"`)
          .join(",");

        return `"${item?.title}","${item?.filter_type}","${item?.assignee}","${
          item?.review_type
        }","${item?.status}","${item?.expert_decision || "-"}","${
          item?.is_aggregate_reporting || "-"
        }","${item?.is_safety_signal || "-"}","${
          item?.is_serious_event || "-"
        }","${item?.categories || "-"}","${item?.classifications || "-"}","${
          item?.comments || "-"
        }","${item?.search_result_status || ""}","${
          item?.monitor_status || "-"
        }","${item?.is_active || "-"}","${item?.country || "-"}","${
          item?.article_id || ""
        }","${item?.ai_decision || "-"}","${item?.confidence_score || "-"}","${
          item?.reason || "-"
        }","${item?.causality_decision || "-"}","${
          item?.causality_confidence_score || ""
        }","${item?.causality_reason || "-"}","${
          item?.designated_medical_events || "-"
        }","${item?.created_by || "-"}","${item?.created_on || "-"}","${
          item?.modified_by || "-"
        }","${item?.modified_on || "-"}","${item?.abstract || "-"}","${
          item?.affiliation || "-"
        }","${item?.author || "-"}","${item?.doi || "-"}","${
          item?.filter_type || "-"
        }","${keywords || "-"}","${item?.language || "-"}","${
          item?.publisher || ""
        }","${item?.published_on || "-"}","${
          item?.updated_on || "-"
        }",${csvRow}`;
      })
      .join("\n");

    const fullCsvContent = csvHeader + csvContent;

    const blob = new Blob([fullCsvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `ArticleId_${
        fetchAdvanceReviewDetail?.article_id
      }_${Utils.getCurrentDateAndTime()}.csv`
    );

    link.click();

    URL.revokeObjectURL(url);
    setIsExportLoading(false);
  };

  const handelMeSHtermsOpen = () => {
    setOpenMeSHterms(true);
  };

  function handleMeSHtermsClose() {
    setOpenMeSHterms(false);
  }

  return (
    <div>
      <div className="absolute top-[20px] flex">
        <div>
          <div className="flex ml-2 mt-3 items-center">
            <Link
              className="no-underline	"
              href={`${CONSTANTS.ROUTING_PATHS.advancedReview2}/${monitor_id}`}
            >
              <div className="absolute w-[1.1rem]">
                <Image
                  className="absolute mt-1 w-[100%]"
                  width={12}
                  height={12}
                  alt=""
                  src="/assets/icons/left-arrow.png"
                />
              </div>
              <div className="left-[25px] text-black ml-8 top-[2%] capitalize">
                <span className="no-underline text-14">Back</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-[500px] lg:w-[400px] xl:w-[700px] h-[40px] ml-12 bg-white header-box-shadow">
          <div className="flex justify-between">
            <div className="cursor-pointer">
              <Image
                src="/assets/icons/Group34 (1).png"
                width={50}
                height={50}
                alt="left"
                className={`w-6 mt-2 ml-2 h-6 ${
                  currentIndex === 0 ? "disabled-arrow" : ""
                }`}
                onClick={handleClickLeft}
                aria-disabled={currentIndex === 0}
              />
            </div>
            <div className="flex flex-wrap">
              {/* <p className="mt-2">Paracetamol Advance</p> */}
              <p className="item-center text-14">Article Id: {articleId}</p>
            </div>
            <div className="float-right cursor-pointer">
              <Image
                src="/assets/icons/Group34 (2).png"
                alt="left"
                width={50}
                height={50}
                className={`right-0 mt-2 mr-2 w-6 h-6 ${
                  currentIndex + 1 === Data?.length ? "disabled-arrow" : ""
                }`}
                onClick={handleClickRight}
                aria-disabled={currentIndex === Data?.length}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex mb-2">
        <div className="w-full abstract-box-style bg-gray-900 p-4">
          <div className="relative float-right">
            <button
              className={`rounded-md border ml-2 cursor-pointer border-gray text-sm font-medium font-archivo py-2 px-8 bg-yellow text-white text-14`}
              onClick={handleDownload}
            >
              Export
            </button>
            <>
              <div className="absolute cursor-pointer top-0 ml-2">
                <Image
                  src="/assets/icons/download-white.svg"
                  alt="download icon"
                  width={15}
                  height={15}
                  className={`left-0 ml-2 top-0 mt-2 `}
                />
              </div>
            </>
          </div>
          {isExportLoading && <LoadingSpinner text={"Downloading"} />}
          <div className="mt-8">
            <div>
              <div className="flex flex-wrap">
                <span className="text-14 text-black font-bold ml-2 mt-2">
                  Title:
                </span>
                <span className="text-14 mx-2 my-2 text-dimgray  capitalize">
                  {title}
                </span>
                {fetchedInQueue && (
                  <div className="px-4 text-14 mb-2 py-2 rounded-2xl text-white status-style">
                    {fetchedInQueue?.Status}
                  </div>
                )}
                {/* <div className="ml-2 cursor-pointer">
                  <Image
                    alt="lock"
                    src="/assets/icons/lock.svg"
                    width={30}
                    height={30}
                    title="lock"
                  />
                </div>
                <div className="ml-2 mt-2 cursor-pointer">
                  <EmailSenderComponent customClasses="right-12" />
                </div> */}
              </div>
              <div className="ml-2 flex">
                {summaryTag?.map((tag: string, tagIndex: number) => (
                  <div
                    key={tagIndex}
                    className={`inline-block text-14 ${
                      tagIndex > 0 ? "ml-2" : ""
                    } ${
                      tag === SummaryTags["PatientIdentified"]
                        ? "patient-identified-style auto-width text-center cursor-pointer px-4 py-2"
                        : tag === SummaryTags["Suspected Adverse Event(AE)"]
                        ? "suspected-adverse-style auto-width text-center cursor-pointer border-violet-900 px-4 py-2"
                        : tag === SummaryTags["SuspectedCase"]
                        ? "suspected-case-style auto-width text-center cursor-pointer px-4 py-2"
                        : tag === SummaryTags["Animal/In-Vitro"]
                        ? "animal-case-style auto-width text-center cursor-pointer px-4 py-2"
                        : tag === SummaryTags["Pregnancy/fetus/foetus"]
                        ? "pregnancy-case-style auto-width text-center cursor-pointer px-4 py-2"
                        : tag === SummaryTags["Elderly"]
                        ? "elderly-style auto-width text-center cursor-pointer px-4 py-2"
                        : tag === SummaryTags["Pediatric"]
                        ? "pediatric-style auto-width text-center cursor-pointer px-4 py-2"
                        : tag === SummaryTags["Abuse/Drug"]
                        ? "abuse-drug-style auto-width text-center cursor-pointer px-4 py-2"
                        : tag === SummaryTags["OccupationalExposure"]
                        ? "occupational-exposure-style auto-width text-center cursor-pointer px-4 py-2"
                        : tag === SummaryTags["OffLabel"]
                        ? "off-label-style auto-width text-center cursor-pointer px-4 py-2"
                        : tag === SummaryTags["Diagnosis /Diagnostic Procedure"]
                        ? "diagnosis-diagnostic-procedure-style auto-width text-center cursor-pointer px-4 py-2"
                        : ""
                    }`}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex box-border-style text-14 rounded-lg mt-4">
              <div className="w-full m-3">
                <div className="ml-3 font-semibold flex text-black">
                  Generative AI Assisted Decision :
                  <span className="font-bold ml-2 text-violet">
                    {generativeAIDecision}
                  </span>
                </div>
                <div className="flex mt-4 ml-3">
                  <div>Confidence Score:</div>
                  <div className="ml-1">{generativeAIDecisionScore}%</div>
                </div>
                <div className="mt-4 ml-3 content-box">
                  Reasons:{generativeAISummary}
                </div>
              </div>
              <div className="border-right-box"></div>
              <div className="w-full m-3">
                <div className="ml-3 font-semibold flex text-black">
                  Causality Assessment:{" "}
                  <span className="font-bold ml-2 text-violet">
                    {casualityDecision}
                  </span>
                </div>
                <div className="flex mt-4 ml-3">
                  <div>Confidence Score:</div>
                  <div className="ml-1">{casualityDecisionScore}%</div>
                </div>
                <div className="mt-4 ml-3 content-box">
                  Reasons: {casualitySummary}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-14 text-black font-bold ml-2 mt-4">
                Abstract
              </span>
              {highlightedContent ? (
                <div
                  className="ml-2 mt-2 text-14 content-style"
                  dangerouslySetInnerHTML={{ __html: highlightedContent }}
                ></div>
              ) : (
                <span className="ml-4">-</span>
              )}
              <div className="ml-2 mt-4 text-14 mb-2">
                <span className="font-bold ">Keywords: </span>
                <span className="ml-2">
                  {keywords ? <span>{keywords}</span> : <span>-</span>}
                </span>
              </div>
              <div className="mb-4 ml-2 w-max-content">
                <div
                  className="capitalize underline cursor-pointer text-violet font-sm font-light"
                  onClick={() => {
                    handelMeSHtermsOpen();
                    setMeSHtermsArray(
                      fetchAdvanceReviewDetail?.mesh_terms
                        ? fetchAdvanceReviewDetail?.mesh_terms
                        : []
                    );
                  }}
                >
                  MeSH terms
                </div>
              </div>
              <div className="ml-2">
                <div className="tab-header">
                  <div
                    className={`tab text-14  m-1  ${
                      activeTab === "Details"
                        ? "active bg-blue rounded-md"
                        : "hover:bg-ghostwhite hover:font-bold"
                    }`}
                    onClick={() => handleTabClick("Details")}
                  >
                    Details
                  </div>
                  <div
                    className={`tab m-1 text-14 ${
                      activeTab === "AI-ML Model Results"
                        ? "active bg-blue rounded-md"
                        : "hover:bg-ghostwhite hover:font-bold"
                    }`}
                    onClick={() => handleTabClick("AI-ML Model Results")}
                  >
                    AI-ML Model Results
                  </div>
                </div>
                <div className="text-14">
                  {tabContents[activeTab as keyof typeof tabContents]}
                </div>
              </div>
            </div>
          </div>
        </div>
        {!feedback ? (
          <div className="w-full tagging-box text-14 bg-red-900 py-4 px-4">
            {tagEntity ? (
              <div>
              <div className="text-14">
                <div>
                  <p className="text-14 font-semibold ml-2 text-silvers">
                    Main entities
                  </p>
                  <div className="flex flex-wrap mb-2">
                    <div
                      className={`flex flex-wrap patient-tagging cursor-pointer px-1 py-1 ${
                        isTagSelected("Patient") ? "patient-selected" : ""
                      } ${!keys.includes("Patient") ? "disable-div" : ""}`}
                      onClick={() => toggleTag("Patient")}
                    >
                      Patient
                      <div
                        className={`${
                          !keys.includes("Patient")
                            ? "disable-circle"
                            : "bg-[#ed6060]"
                        } rounded-lg w-4 h-4`}
                      ></div>{" "}
                    </div>
                    <div
                      className={`flex flex-wrap animal-in-vitro-tagging ml-1 cursor-pointer px-1 py-1 ${
                        isTagSelected("Animal/In-Vitro")
                          ? "animal-in-vitro-selected"
                          : ""
                      } ${
                        keys.includes("Animal/In-Vitro") ? "" : "disable-div"
                      }`}
                      onClick={() =>
                        toggleTag(tagsAbstract["Animal/In-Vitro"])
                      }
                    >
                      Animal/In-Vitro
                      <div
                        className={`${
                          keys.includes("Animal/In-Vitro")
                            ? "bg-[#0e75a1]"
                            : "disable-circle"
                        } rounded-lg w-4 h-4`}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mb-2">
                    <div
                      className={`flex flex-wrap interesting-events-tagging cursor-pointer px-1 py-1 ${
                        isTagSelected(
                          tagsAbstract["Interesting events / observations"]
                        )
                          ? "interesting-events-selected"
                          : ""
                      }${
                        keys.includes(
                          tagsAbstract["Interesting events / observations"]
                        )
                          ? ""
                          : "disable-div"
                      }`}
                      onClick={() =>
                        toggleTag(
                          tagsAbstract["Interesting events / observations"]
                        )
                      }
                    >
                      Adverse event
                      <div
                        className={`${
                          keys.includes(
                            tagsAbstract["Interesting events / observations"]
                          )
                            ? "bg-[#ed6060]"
                            : "disable-circle"
                        } rounded-lg w-4 h-4`}
                      ></div>
                    </div>
                    <div
                      className={`flex flex-wrap  medications-tagging ml-1 cursor-pointer px-1 py-1 ${
                        isTagSelected("Medications")
                          ? "medications-selected"
                          : ""
                      } ${keys.includes("Medications") ? "" : "disable-div"}`}
                      onClick={() => toggleTag(tagsAbstract["Medications"])}
                    >
                      Medications
                      <div
                        className={`${
                          keys.includes("Medications")
                            ? "bg-[#1a96e1]"
                            : "disable-circle"
                        } rounded-lg w-4 h-4`}
                      ></div>{" "}
                    </div>
                  </div>
                  <div className="flex flex-wrap">
                    <div
                      className={`flex flex-wrap branding-tagging cursor-pointer mb-2 px-1 py-1 ${
                        isTagSelected("Branding") ? "branding-selected" : ""
                      } ${keys.includes("Branding") ? "" : "disable-div"}`}
                      onClick={() => toggleTag("Branding")}
                    >
                      Branding
                      <div
                        className={`${
                          keys.includes("Branding")
                            ? "bg-[#c3bebe]"
                            : "disable-circle"
                        } rounded-lg w-4 h-4`}
                      ></div>{" "}
                    </div>
                    <div
                      className={`flex flex-wrap pediatric-tagging cursor-pointer mb-2 mt-1 ml-1 px-1 py-2 ${
                        isTagSelected(tagsAbstract.Pediatric)
                          ? "pediatric-selected"
                          : ""
                      } ${keys.includes("Pediatric") ? "" : "disable-div"}`}
                      onClick={() => toggleTag(tagsAbstract.Pediatric)}
                    >
                      Pediatric
                      <div
                        className={`${
                          keys.includes("Pediatric")
                            ? "bg-[#9cf79c]"
                            : "disable-circle"
                        } rounded-lg w-4 h-4`}
                      ></div>{" "}
                    </div>
                  </div>
                  <div className="flex flex-wrap mb-2">
                    <div
                      className={`flex flex-wrap pregnancy-fetus-foetus-tagging cursor-pointer px-1 py-1 ${
                        isTagSelected(tagsAbstract["Pregnancy/fetus/foetus"])
                          ? "pregnancy-fetus-foetus-selected"
                          : ""
                      } ${
                        keys.includes("Pregnancy/fetus/foetus")
                          ? ""
                          : "disable-div"
                      }`}
                      onClick={() =>
                        toggleTag(tagsAbstract["Pregnancy/fetus/foetus"])
                      }
                    >
                      Pregnancy/fetus/foetus
                      <div
                        className={`${
                          keys.includes("Pregnancy/fetus/foetus")
                            ? "bg-[#ed6060]"
                            : "disable-circle"
                        } rounded-lg w-4 h-4`}
                      ></div>{" "}
                    </div>
                    <div
                      className={`flex flex-wrap elderly-tagging cursor-pointer ml-1 px-1 py-1 ${
                        isTagSelected(tagsAbstract.Elderly)
                          ? "elderly-selected"
                          : ""
                      } ${keys.includes("Elderly") ? "" : "disable-div"}`}
                      onClick={() => toggleTag(tagsAbstract.Elderly)}
                    >
                      Elderly
                      <div
                        className={`${
                          keys.includes("Elderly")
                            ? "bg-[#ade0ff]"
                            : "disable-circle"
                        } rounded-lg w-4 h-4`}
                      ></div>{" "}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-14 font-semibold ml-2 text-silvers">
                    Medical Event
                  </p>
                  <div className="flex flex-wrap mb-2">
                    <div
                      className={`flex mb-2 flex-wrap designated-medical-event-tagging cursor-pointer px-1 py-1 ${
                        isTagSelected("Designated Medical Event")
                          ? "designated-medical-event-selected"
                          : ""
                      }  ${
                        keys.includes("Designated Medical Event")
                          ? ""
                          : "disable-div"
                      }`}
                      onClick={() => toggleTag("Designated Medical Event")}
                    >
                      Designated Medical Event
                      <div
                        className={`${
                          keys.includes("Designated Medical Event")
                            ? "bg-[#fab44a]"
                            : "disable-circle"
                        } rounded-lg w-4 h-4`}
                      ></div>{" "}
                    </div>
                    {/* <div
                    className={`flex flex-wrap mb-2 important-medical-event-tagging cursor-pointer px-1 py-1 ${
                      isTagSelected("Important medical event(IME)")
                        ? "important-medical-event-selected"
                        : ""
                    }  ${
                      keys.includes("Important medical event(IME")
                        ? ""
                        : "disable-div"
                    }`}
                    onClick={() => toggleTag("Important medical event(IME)")}
                  >
                    Important medical event(IME)
                    <div className="rounded-lg bg-[#A85D67] w-4 h-4"></div>
                  </div> */}
                  </div>
                </div>
                <p className="text-14 font-semibold ml-2 text-silvers">
                  Additional entities{" "}
                </p>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap  diagnosis-tagging ml-1 cursor-pointer px-1 py-1 ${
                    isTagSelected("Diagnosis /Diagnostic Procedure")
                      ? "diagnosis-selected"
                      : ""
                  } ${
                    keys.includes("Diagnosis /Diagnostic Procedure")
                      ? ""
                      : "disable-div"
                  }`}
                  onClick={() => toggleTag("Diagnosis /Diagnostic Procedure")}
                >
                  Diagnosis
                  <div
                    className={`${
                      keys.includes("Diagnosis /Diagnostic Procedure")
                        ? "bg-[#9b769c]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
                <div
                  className={`flex flex-wrap off-label-tagging cursor-pointer px-1 py-1 ml-1 ${
                    isTagSelected(tagsAbstract["Off label"])
                      ? "off-label-selected"
                      : ""
                  }  ${
                    keys.includes(tagsAbstract["Off label"])
                      ? ""
                      : "disable-div"
                  }`}
                  onClick={() => toggleTag(tagsAbstract["Off label"])}
                >
                  {tagsAbstract["Off label"]}
                  <div
                    className={`${
                      keys.includes(tagsAbstract["Off label"])
                        ? "bg-[#7A727A]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap">
                <div
                  className={`flex flex-wrap  diseases-tagging ml-1 cursor-pointer mb-2 px-1 py-1 ${
                    isTagSelected("Diseases") ? "diseases-selected" : ""
                  }${keys.includes("Diseases") ? "" : "disable-div"}`}
                  onClick={() => toggleTag("Diseases")}
                >
                  Diseases
                  <div
                    className={`${
                      keys.includes("Diseases")
                        ? "bg-[#C595F5]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
                <div
                  className={`flex flex-wrap overdose-tagging cursor-pointer ml-1 mb-2 px-1 py-1 ${
                    isTagSelected(tagsAbstract["Overdose"])
                      ? "overdose-selected"
                      : ""
                  } ${keys.includes("Overdose") ? "" : "disable-div"}`}
                  onClick={() => toggleTag("Overdose")}
                >
                  Overdose
                  <div
                    className={`${
                      keys.includes("Overdose")
                        ? "bg-[#40e0d0]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap reviewed-tagging cursor-pointer px-1 py-1 ${
                    isTagSelected(tagsAbstract["Study/Review/Clinical trial"])
                      ? "reviewed-selected"
                      : ""
                  }${
                    keys.includes(tagsAbstract["Study/Review/Clinical trial"])
                      ? ""
                      : "disable-div"
                  }`}
                  onClick={() =>
                    toggleTag(tagsAbstract["Study/Review/Clinical trial"])
                  }
                >
                  Study / Review /Clinical trial
                  <div
                    className={`${
                      !keys.includes(
                        tagsAbstract["Study/Review/Clinical trial"]
                      )
                        ? "disable-circle"
                        : "bg-[#ed6060]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap special-keywords-tagging cursor-pointer px-1 py-1 ${
                    isTagSelected("Special Keywords")
                      ? "special-keywords-selected"
                      : ""
                  }${keys.includes("Special Keywords") ? "" : "disable-div"}`}
                  onClick={() => toggleTag("Special Keywords")}
                >
                  Special Keywords
                  <div
                    className={`${
                      !keys.includes("Special Keywords")
                        ? "disable-circle"
                        : "bg-[#FA78FA]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap  patient-population-tagging ml-1 cursor-pointer px-1 py-1 ${
                    isTagSelected("Patient population")
                      ? "patient-population-selected"
                      : ""
                  }  ${
                    keys.includes("Patient population") ? "" : "disable-div"
                  }`}
                  onClick={() => toggleTag("Patient population")}
                >
                  Patient population
                  <div
                    className={`${
                      !keys.includes("Patient population")
                        ? "disable-circle"
                        : "bg-[#40E0D0]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap multiple-patients-tagging cursor-pointer px-1 py-1 ${
                    isTagSelected("Multiple Patients")
                      ? "multiple-patients-selected"
                      : ""
                  }  ${
                    keys.includes("Multiple Patients") ? "" : "disable-div"
                  }`}
                  onClick={() => toggleTag("Multiple Patients")}
                >
                  Multiple Patients
                  <div
                    className={`${
                      !keys.includes("Multiple Patients")
                        ? "disable-circle"
                        : "bg-[#88fa73]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
                <div
                  className={`flex flex-wrap history-tagging cursor-pointer px-1 py-1 ml-1 ${
                    isTagSelected(tagsAbstract["History"])
                      ? "history-selected"
                      : ""
                  }  ${
                    keys.includes(tagsAbstract["History"])
                      ? ""
                      : "disable-div"
                  }`}
                  onClick={() => toggleTag(tagsAbstract["History"])}
                >
                  {tagsAbstract["History"]}
                  <div
                    className={`${
                      !keys.includes(tagsAbstract["History"])
                        ? "disable-circle"
                        : "bg-[#EAE713]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap diagnosis-diagnostic-procedure-tagging cursor-pointer px-1 py-1 ml-1 ${
                    isTagSelected(
                      tagsAbstract["Diagnosis /Diagnostic Procedure"]
                    )
                      ? "diagnosis-diagnostic-procedure-selected"
                      : ""
                  }  ${
                    keys.includes(
                      tagsAbstract["Diagnosis /Diagnostic Procedure"]
                    )
                      ? ""
                      : "disable-div"
                  }`}
                  onClick={() =>
                    toggleTag(tagsAbstract["Diagnosis /Diagnostic Procedure"])
                  }
                >
                  {tagsAbstract["Diagnosis /Diagnostic Procedure"]}
                  <div
                    className={`${
                      !keys.includes(
                        tagsAbstract["Diagnosis /Diagnostic Procedure"]
                      )
                        ? "disable-circle"
                        : "bg-[#9B769C]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap occupational-exposure-tagging cursor-pointer px-1 py-1 ml-1 ${
                    isTagSelected(
                      tagsAbstract["Occupational exposure(OC exposure)"]
                    )
                      ? "occupational-exposure-selected"
                      : ""
                  }  ${
                    keys.includes(
                      tagsAbstract["Occupational exposure(OC exposure)"]
                    )
                      ? ""
                      : "disable-div"
                  }`}
                  onClick={() =>
                    toggleTag(
                      tagsAbstract["Occupational exposure(OC exposure)"]
                    )
                  }
                >
                  {tagsAbstract["Occupational exposure(OC exposure)"]}
                  <div
                    className={`${
                      !keys.includes(
                        tagsAbstract["Occupational exposure(OC exposure)"]
                      )
                        ? "disable-circle"
                        : "bg-[#ffdead]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap lack-of-efficacy-tagging cursor-pointer px-1 py-1 ml-1 ${
                    isTagSelected(tagsAbstract["Lack of efficacy"])
                      ? "lack-of-efficacy-selected"
                      : ""
                  }  ${
                    keys.includes(tagsAbstract["Lack of efficacy"])
                      ? ""
                      : "disable-div"
                  }`}
                  onClick={() => toggleTag(tagsAbstract["Lack of efficacy"])}
                >
                  {tagsAbstract["Lack of efficacy"]}
                  <div
                    className={`${
                      !keys.includes(tagsAbstract["Lack of efficacy"])
                        ? "disable-circle"
                        : "bg-[#918e8e]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
                <div
                  className={`flex flex-wrap drug-interaction-tagging cursor-pointer px-1 py-1 ml-1 ${
                    isTagSelected(tagsAbstract["Drug interaction"])
                      ? "drug-interaction-selected"
                      : ""
                  }  ${
                    keys.includes(tagsAbstract["Drug interaction"])
                      ? ""
                      : "disable-div"
                  }`}
                  onClick={() => toggleTag(tagsAbstract["Drug interaction"])}
                >
                  {tagsAbstract["Drug interaction"]}
                  <div
                    className={`${
                      !keys.includes(tagsAbstract["Drug interaction"])
                        ? "disable-circle"
                        : "bg-[#a85d67]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap drug-interaction-tagging cursor-pointer px-1 py-1 ml-1 ${
                    isTagSelected(
                      tagsAbstract["Abuse/Drug misuse/drug dependence"]
                    )
                      ? "drug-interaction-selected"
                      : ""
                  }  ${
                    keys.includes(
                      tagsAbstract["Abuse/Drug misuse/drug dependence"]
                    )
                      ? ""
                      : "disable-div"
                  }`}
                  onClick={() =>
                    toggleTag(
                      tagsAbstract["Abuse/Drug misuse/drug dependence"]
                    )
                  }
                >
                  {tagsAbstract["Abuse/Drug misuse/drug dependence"]}
                  <div
                    className={`${
                      !keys.includes(
                        tagsAbstract["Abuse/Drug misuse/drug dependence"]
                      )
                        ? "disable-circle"
                        : "bg-[#ed6060]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap medication-error-tagging cursor-pointer px-1 py-1 ml-1 ${
                    isTagSelected(tagsAbstract["Medication error"])
                      ? "medication-error-selected"
                      : ""
                  }  ${
                    keys.includes(tagsAbstract["Medication error"])
                      ? ""
                      : "disable-div"
                  }`}
                  onClick={() => toggleTag(tagsAbstract["Medication error"])}
                >
                  {tagsAbstract["Medication error"]}
                  <div
                    className={`${
                      !keys.includes(tagsAbstract["Medication error"])
                        ? "disable-circle"
                        : "bg-[#c595f5]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
            </div>
            ) : (
              <div>
                {" "}
                <input
                  type="button"
                  value="Generate Entities"
                  className=" w-full submit-font px-2 py-3 bg-violet-600 cursor-pointer text-center font-bold justify-center text-sm text-white rounded shadow-sm font-Montserrat focus:outline-none leading-6"
                  onClick={handleShowTags}
                />
              </div>
            )}
            {/* <div className="flex flex-wrap justify-between">
              <p className="">Tag are not Relevant?</p>
              <p
                className="text-dimgray cursor-pointer right-1 underline"
                onClick={handleFeedbackClick}
              >
                Feedback
              </p>
            </div> */}
            <div className="border-bottom"></div>
            <p className="text-14 font-semibold ml-2 text-silvers">
              Expert Review
            </p>
            <div className="mt-2">
              <select
                className="block mb-2 text-[14px] cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    selectedReview: e.target.value,
                  })
                }
                value={formValues.selectedReview}
              >
                <option value={""}>Review Decision</option>
                {QcReviewName.map((review) => (
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
            <div className="mt-1">
              <CreatableSelect
                isClearable
                placeholder={"Categories"}
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={handleCategoriesChange}
                options={categoryOptions}
                value={formValues.selectedCategories}
                isMulti
              />
            </div>
            <div className="mt-2">
              <CreatableSelect
                isClearable
                isDisabled={isLoading}
                placeholder={"Classifications"}
                isLoading={isLoading}
                onChange={handleClassificationChange}
                options={classificationOptions}
                value={formValues.selectedClassification}
                isMulti
              />
            </div>
            <div className="mt-2 w-full">
              <textarea
                required
                className="w-[90%] rounded-md text-14 font-archivo text-black"
                placeholder="Comments*"
                onChange={handleCommentChange}
                value={formValues.comment}
              />
            </div>
            <div className="mt-1">
              <Button
                customClasses={" w-full text-14 px-2 py-3 bg-yellow"}
                buttonText="Submit"
                buttonType="submit"
                onClick={handleSubmit}
              />
            </div>
          </div>
        ) : (
          <div className="w-full feedback-box feedback-scroll justify-between h-[700px] tagging-font bg-red-900 py-1 px-3">
            <div className="mt-96 w-full">
              <textarea
                className="w-[90%] h-[120px] text-14 rounded-md font-archivo text-black"
                placeholder="Comment*"
                onChange={handleCommentChange}
                value={formValues.comment}
              />
            </div>
            <div className="">
              <div className="mt-4 bottom-[]">
                <p
                  className="cmb-2 w-3/4 text-14 px-4 py-3 bg-blue ml-4 cursor-pointer text-center text-white rounded-md"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </p>
              </div>
              <div className="mt-4 bottom-[]">
                <Button
                  customClasses={"mb-2 w-full text-14 px-4 py-3 bg-orange-500"}
                  buttonText="Submit"
                  buttonType="submit"
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {isLoading && <LoadingSpinner />}
      <Modal
        isOpen={isOpenE2bR2}
        childElement={
          <E2br2
            isOpen={false}
            handelClose={() => {
              handleE2bR2Close();
            }}
          />
        }
      />
      <Modal
        isOpen={openMeSHterms}
        childElement={
          <MeSHtermsModal
            items={MeSHtermsArray}
            handelClose={() => {
              handleMeSHtermsClose();
            }}
          />
        }
      />
    </div>
  );
};

export default AdvancedReviewThirdPage;
