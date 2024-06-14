import { useEffect, useState } from "react";
import { DataEntity, IThirdPageAbstractData } from "../abstract.model";

// DetailsTabContent.tsx
interface DetailsTabContentProps {
  ai_tags: DataEntity[];
}

const AiMilTabContent: React.FC<DetailsTabContentProps> = ({ ai_tags }: any) => {
  return (
    <div className="mt-4 ml-2">
      <div className="mb-4 capitalize">
        <div className="text-black mb-2">Medications</div>
        <div className="text-dimgray">
          {ai_tags.Medications?.map(({ entity }: any) => {
            return entity.map((value: any, index: number) => {
              return <span key={index}>{value + ","}</span>;
            });
          })}
        </div>
      </div>
      <div className="mb-4 capitalize">
        <div className="text-black mb-2">Special Situation</div>
        <div className="text-dimgray">
          {ai_tags["Special Situation"] ? (
            <>
              {ai_tags["Special Situation"]?.map(({ entity }: any) => {
                return entity.map((value: any, index: number) => {
                  return <span key={index}>{value + ","}</span>;
                });
              })}
            </>
          ) : (
            <>-</>
          )}
        </div>
      </div>
      <div className="mb-4 capitalize">
        <div className="text-black mb-2">Special keywords</div>
        <div className="text-dimgray">
          {ai_tags["Special Keywords"] ? (
            <>
              {ai_tags["Special Keywords"]?.map(({ entity }: any) => {
                return entity.map((value: any, index: number) => {
                  return <span key={index}>{value + ","}</span>;
                });
              })}
            </>
          ) : (
            <>-</>
          )}
        </div>
      </div>
      <div className="mb-4 capitalize">
        <div className="text-black mb-2">Diagnosis</div>
        <div className="text-dimgray">
          {ai_tags.Diagnosis ? (
            <>
              {ai_tags.Diagnosis?.map(({ entity }: any) => {
                return entity.map((value: any, index: number) => {
                  return <span key={index}>{value + ","}</span>;
                });
              })}
            </>
          ) : (
            <>-</>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiMilTabContent;
