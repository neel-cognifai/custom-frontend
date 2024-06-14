import { IAbstractDetails } from "@/components/abstract-review/abstract.model";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { tagsAbstract } from "@/common/constants";

interface IProps {
  selectedAITags?: any;
  item: IAbstractDetails;
  selectedTags: string[] | any;
  index: number
}

const AbstractModel: React.FC<IProps> = ({
  item,
  selectedAITags,
  selectedTags,
  index
}) => {

  const [highlightedContent, setHighlightedContent] = useState<string>("");
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  useEffect(() => {
    highlightWords();
  }, [item]);

const highlightWords = () => {
    let highlightedText = item?.abstract!;
    if (selectedTags!.includes(tagsAbstract.Patient)) {
      const value = selectedAITags.Patient[0].entity;
      highlightedText = setTagColor(
        value,
        "highlight-patient",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract.History)) {
      const value = selectedAITags.History[0].entity;
      highlightedText = setTagColor(value, "history-text", highlightedText);
    }

    if (selectedTags!.includes(tagsAbstract["Multiple Patients"])) {
      const value = selectedAITags["Multiple Patients"][0].entity;
      highlightedText = setTagColor(
        value,
        "multiple-patients-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Interesting events / observations"])) {
      const value = selectedAITags[tagsAbstract["Interesting events / observations"]][0].entity;
      highlightedText = setTagColor(
        value,
        "interesting-events-observations-patient-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Animal/In-Vitro"])) {
      const value = selectedAITags["Animal/In-Vitro"][0].entity;
      highlightedText = setTagColor(
        value,
        "animal-in-vitro-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Abuse/Drug misuse/drug dependence"])) {
      const value = selectedAITags["Abuse/Drug misuse/drug dependence"][0].entity;
      highlightedText = setTagColor(
        value,
        "abuse-drug-misuse-drug-dependence-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Study/Review/Clinical trial"])) {
      const value = selectedAITags["Study/Review/Clinical trial"][0].entity;
      highlightedText = setTagColor(
        value,
        "study-review-clinical-text",
        highlightedText
      );
    }

    if (
      selectedTags!.includes(tagsAbstract["Occupational exposure(OC exposure)"])
    ) {
      const value =
        selectedAITags["Occupational exposure(OC exposure)"][0].entity;
      highlightedText = setTagColor(
        value,
        "occupational-exposure-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Lack of efficacy"])) {
      const value = selectedAITags["Lack of efficacy"][0].entity;
      highlightedText = setTagColor(
        value,
        "lack-of-efficacy-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Medication error"])) {
      const value = selectedAITags["Medication error"][0].entity;
      highlightedText = setTagColor(
        value,
        "medication-error-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Overdose"])) {
      const value = selectedAITags["Overdose"][0].entity;
      highlightedText = setTagColor(
        value,
        "overdose-in-vitro-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Drug interaction"])) {
      const value = selectedAITags["Drug interaction"][0].entity;
      highlightedText = setTagColor(
        value,
        "drug-interaction-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Special Keywords"])) {
      const value = selectedAITags["Special Keywords"][0].entity;
      highlightedText = setTagColor(value, "special-keywords", highlightedText);
    }

    if (selectedTags!.includes(tagsAbstract.diagnosis)) {
      const value = selectedAITags[tagsAbstract.diagnosis][0].entity;
      highlightedText = setTagColor(value, "diagnosis-diagnostic-procedure-text", highlightedText);
    }

    if (selectedTags!.includes(tagsAbstract["Diagnosis /Diagnostic Procedure"])) {
      const value = selectedAITags["Diagnosis /Diagnostic Procedure"][0].entity;
      highlightedText = setTagColor(
        value,
        "diagnosis-diagnostic-procedure-text",
        highlightedText
      );
    }
    if (selectedTags!.includes(tagsAbstract["Monitor (Target Drug)"])) {
      const value = selectedAITags["Monitor (Target Drug)"][0].entity;
      highlightedText = setTagColor(
        value,
        "highlight-skyblue",
        highlightedText
      );
    }
    if (selectedTags!.includes(tagsAbstract.Medications)) {
      const value = selectedAITags.Medications[0].entity;
      highlightedText = setTagColor(
        value,
        "highlight-medications",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Interesting section / special section"])) {
      const value = selectedAITags["Interesting section / special section"][0].entity;
      highlightedText = setTagColor(
        value,
        "highlight-blue",
        highlightedText
      );
    }

    if (
      selectedTags!.includes(tagsAbstract["Special Keywords"])
    ) {
      const value = selectedAITags["Special Keywords"].entity;
      highlightedText = setTagColor(value, "special-keywords", highlightedText);
    }
    if (
      selectedTags!.includes(tagsAbstract["Branding"])
    ) {
      const value = selectedAITags["Branding"].entity;
      highlightedText = setTagColor(
        value,
        "highlight-branding",
        highlightedText
      );
    }
    if (
      selectedTags!.includes(tagsAbstract["Diseases"])
    ) {
      const value = selectedAITags["Diseases"].entity;
      highlightedText = setTagColor(
        value,
        "highlight-diseases",
        highlightedText
      );
    }
    if (
      selectedTags!.includes(tagsAbstract["Multiple Patients"])
    ) {
      const value = selectedAITags["Multiple Patients"].entity;
      highlightedText = setTagColor(
        value,
        "multiple-patients-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract.Elderly)) {
      const value = selectedAITags.Elderly[0].entity;
      highlightedText = setTagColor(value, "elderly-text", highlightedText);
    }

    if (selectedTags!.includes(tagsAbstract.Pediatric)) {
      const value = selectedAITags.Pediatric[0].entity;
      highlightedText = setTagColor(value, "pediatric-text", highlightedText);
    }

    if (selectedTags!.includes(tagsAbstract["Pregnancy/fetus/foetus"])) {
      const value = selectedAITags["Pregnancy/fetus/foetus"][0].entity;
      highlightedText = setTagColor(
        value,
        "pregnancy-fetus-foetus-text",
        highlightedText
      );
    }

    if (
      selectedTags!.includes(tagsAbstract["Patient population"])
    ) {
      const value = selectedAITags["Patient population"].entity;
      highlightedText = setTagColor(
        value,
        "highlight-patient-population-text",
        highlightedText
      );
    }
    setHighlightedContent(highlightedText);
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


  const toggleBox = (index: number) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((item) => item !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  const isBoxExpanded = (index: number) => {
    return expandedIndexes.includes(index);
  };

  return (
    <div key={index} className="w-full">
      <div
        className={` bg-white mb-4 custom-box-shadow p-2 h-[${isBoxExpanded(index) ? "auto" : "200px"}] transition-all ease-in-out duration-300`}
      >
        <div>
          <div>
            <div className="text-14 mx-6 mt-2 text-violet capitalize">
              {item?.title}
            </div>
          </div>
          <div>
            <p className="text-14 text-black font-bold ml-6 mt-4">
              Abstract
            </p>
            <div
              className="mx-6 mt-0 text-14 content-style"
              dangerouslySetInnerHTML={{ __html: isBoxExpanded(index) ? highlightedContent : highlightedContent?.slice(0, 252) }}
            ></div>
            <div className="mt-2 flex justify-center">
              <button
                className="text-violet font-bold cursor-pointer"
                onClick={() => toggleBox(index)}
              >
                 {!isBoxExpanded(index) ? (
                  <Image
                    src="/assets/icons/Vector-25.png"
                    className="bg-none"
                    width={8}
                    height={8}
                    alt="vector"
                  />
                 ) : (
                  <Image
                    src="/assets/icons/Vector-24.svg"
                    className="bg-none"
                    width={10}
                    height={10}
                    alt="vector"
                  />
                 )}
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
  );
};

export default AbstractModel;
