import { IAbstractDetails, IThirdPageAbstractData } from "../abstract.model";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  AbstractReviewDataState,
  PreviewURlAsync,
} from "../abstract-review.slice";
import { CONSTANTS, STATUS } from "@/common/constants";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/common/LoadingSpinner";

// DetailsTabContent.tsx
interface DetailsTabContentProps {
  detailsData: IAbstractDetails;
  monitor_id: string;
  label: string;
}

const DetailsTabContent: React.FC<DetailsTabContentProps> = ({
  detailsData,
  monitor_id,
  label,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { status, abstractReviewDetail, previewURL } = useAppSelector(
    AbstractReviewDataState
  );
  const dispatch = useAppDispatch();
  const [fetchAbstractReviewDetail, setFetchAbstractReviewDetail] =
    useState<IThirdPageAbstractData | null>(null);

  useEffect(() => {
    setIsLoading(true);
    if (status === STATUS.fulfilled && abstractReviewDetail) {
      setFetchAbstractReviewDetail(abstractReviewDetail);
    }
    setIsLoading(false);
  }, [abstractReviewDetail, status]);

  useEffect(() => {
    if (fetchAbstractReviewDetail?.search_result_id) {
      dispatch(PreviewURlAsync(fetchAbstractReviewDetail.search_result_id));
    }
  }, [fetchAbstractReviewDetail?.search_result_id]);
  const handleLink = async () => {
    setIsLoading(true);
    if (fetchAbstractReviewDetail?.search_result_id) {
      await dispatch(
        PreviewURlAsync(fetchAbstractReviewDetail.search_result_id)
      );
    }
    router.push(`${CONSTANTS.ROUTING_PATHS.PDFReaderFromTable}/${monitor_id}`);
    setIsLoading(false);
  };
  return (
    <div className="mt-4 ml-2 flex ">
      <div>
        <div className="mb-4 w-max-content">
          <div className="text-black mb-2">Author(s)</div>
          <ul className="list-disc pl-5">
            {detailsData?.author?.split(",").map((author, index) => (
              <li key={index} className="text-dimgray">
                {author.trim()}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <div className="text-black mb-2">Article Literature ID</div>
          <div className="text-violet">
            {detailsData.filter_type === "PubMed Search" ||
            detailsData.filter_type === "PubMed Nbib Reference Format" ? (
              <Link
                legacyBehavior
                className="text-violet"
                href={`https://pubmed.ncbi.nlm.nih.gov/${detailsData?.article_id}`}
              >
                <a target="_blank">{detailsData?.article_id}</a>
              </Link>
            ) : (
              <>{detailsData?.article_id}</>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="text-black mb-2">Publication</div>
          <div className="text-dimgray">{detailsData?.publisher}</div>
        </div>
        {label === "Qc" && (
          <div className="mb-4">
            <div className="text-black mb-2">Processed Fulltext Link</div>
            <div className="text-dimgray">
              {previewURL.status === 400 ? (
                <>{"-"}</>
              ) : (
                <>
                  <div
                    className="ml-3 mt-2 cursor-pointer"
                    onClick={handleLink}
                  >
                    <Image
                      alt="download"
                      src="/assets/icons/linkicon.png"
                      width={20}
                      height={20}
                      title="preview"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="ml-8">
        <div>
          <div className="mb-4">
            <div className="text-black mb-2">Full text and DOI</div>
            {detailsData?.doi !== "None" ? (
              <Link
                legacyBehavior
                className="text-violet"
                href={`https://doi.org/${detailsData?.doi
                  ?.replace("[doi]", "")
                  .replace(/\s/g, "")}`}
              >
                <a target="_blank">
                  {detailsData?.doi?.replace("[doi]", "").replace(/\s/g, "")}
                </a>
              </Link>
            ) : (
              <span>{detailsData?.doi} </span>
            )}
          </div>
          <div className="mb-4">
            <div className="text-black mb-2">Country</div>
            <div className="text-dimgray">{detailsData?.country}</div>
          </div>
          <div className="mb-4">
            <div className="text-black mb-2">Database</div>
            <div className="text-dimgray">{detailsData?.citation_db}</div>
          </div>
          <div className="mb-4">
            <div className="text-black mb-2">Published on</div>
            <div className="text-violet">{detailsData?.published_on}</div>
          </div>
          <div className="mb-4">
            <div className="text-black mb-2">Affiliation</div>
            <div className="text-violet">{detailsData?.affiliation}</div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default DetailsTabContent;
