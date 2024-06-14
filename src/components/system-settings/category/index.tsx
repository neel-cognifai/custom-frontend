import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/common/LoadingSpinner";
import CustomPagination from "@/common/Pagination/CustomPagination";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { STATUS, defaultPerPage, systemMessage } from "@/common/constants";
import { ICategory } from "../general.model";
import Image from "next/image";
import AddCategory from "./AddCategory";
import { SortOption } from "../../../../utils/sortingUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  GetCategoryAsync,
  GetCategoryCountAsync,
  deleteCategoryAsync,
  generalState,
} from "../general.slice";
import Modal from "@/common/modal/model";
import DeleteModal from "@/common/modal/DeleteModel";
import Toast from "@/common/Toast";
import { Utils } from "../../../../utils/utils";

const Category = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [openAdd, setOPenAdd] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string>("");
  const [category, setCategory] = useState<ICategory[]>([]);
  const [nameDropdownOpen, setNameDropdownOpen] = useState(false);
  const nameDropdownRef = useRef<HTMLDivElement>(null);
  const [totalRecords, setTotalRecords] = useState<Number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof ICategory;
    direction: "ascending" | "descending" | "";
  }>({
    key: "name",
    direction: "",
  });

  const { loading, Category, TotalCategory } = useAppSelector(generalState);

  useEffect(() => {
    setIsLoading(true);
    dispatch(GetCategoryCountAsync());
    const payload = {
      pageNumber: 1,
      perPage: perPage,
    };
    dispatch(GetCategoryAsync(payload));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setCategory(Category);
      setTotalRecords(TotalCategory);
    }
  }, [loading, Category, TotalCategory]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        nameDropdownRef.current &&
        !nameDropdownRef.current.contains(event.target as Node)
      ) {
        setNameDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handelOpen = () => {
    setCategoryId("");
    setOPenAdd(true);
  };

  const handleClose = () => {
    setOPenAdd(false);
    setCategoryId("");
  };

  const handleDeleteClose = () => {
    setOpenDelete(false);
    setCategoryId("");
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await dispatch(deleteCategoryAsync(categoryId));
      if (deleteCategoryAsync.fulfilled.match(response)) {
        if (response.payload.status === 204) {
          const PaginationPayload = {
            pageNumber: 1,
            perPage: defaultPerPage,
          };
          await dispatch(GetCategoryAsync(PaginationPayload));
          Toast(systemMessage.DeleteCategory, { type: "success" });
          setIsLoading(false);
          setOpenDelete(false);
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

  const handleOpenEdit = (id: React.SetStateAction<string>) => {
    setCategoryId(id);
    setOPenAdd(true);
  };

  const handleOpenDelete = (id: React.SetStateAction<string>) => {
    setCategoryId(id);
    setOpenDelete(true);
  };

  const handlePageChange = (pageNumber: number) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    const payload = { pageNumber, perPage };
    dispatch(GetCategoryAsync(payload));
    setIsLoading(false);
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = { pageNumber: 1, perPage: newPerPage };
    dispatch(GetCategoryAsync(payload));
    setIsLoading(false);
  };

  const sortedData = [...category].sort((a, b) => {
    const nameA = a[sortConfig.key].toLowerCase();
    const nameB = b[sortConfig.key].toLowerCase();

    if (sortConfig.direction === "ascending") {
      return nameA > nameB ? 1 : -1;
    } else {
      return nameA < nameB ? 1 : -1;
    }
  });

  const requestSort = (
    key: keyof ICategory,
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.direction == "") {
      direction;
    }
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleMonitorNameSort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.key === "name" && sortConfig.direction === direction) {
      return;
    }
    requestSort("name", direction);
    setNameDropdownOpen(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container h-auto bg-white custom-box-shadow rounded-xl border border-gray-300">
          <div className="add mt-4">
            {!openAdd ? (
              <>
                <div className="ml-2 mt-2 flex">
                  <div>
                    <input
                      type="text"
                      placeholder="Search by category"
                      onChange={handleSearch}
                      className="w-[400px] h-[22px] text-14 rounded-md border-1 border-solid border-gray text-dimgray px-4 py-2"
                    />
                  </div>
                  <div className="ml-[-30px] mt-3">
                    <Image
                      src="/assets/icons/search-5-1.svg"
                      width={15}
                      height={15}
                      alt="search icon"
                      className=""
                    />
                  </div>
                  <div className="action-button-right flex flex-col items-end justify-end mr-4">
                    <button
                      className="bg-yellow cursor-pointer px-4 py-3 w-40 text-white text-14 text-base font-archivo font-medium capitalize rounded"
                      onClick={handelOpen}
                    >
                      + add Category
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <AddCategory
                handelClose={() => {
                  handleClose();
                }}
                currentPage={currentPage}
                editCategoryId={categoryId}
              />
            )}
          </div>
          <section className="mt-4 bg-white custom-box-shadow">
            <div className="border-style"></div>
            <div className="overflow-style">
              <table className="w-[100%] border border-collapse table-auto relative">
                <thead className="border-style text-14 text-sm text-left">
                  <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                    <th className="py-6 hover-text-style">
                      <div ref={nameDropdownRef} className="relative">
                        <span
                          className="flex px-4 py-4 hover-text-style items-center hover:bg-whiteGray cursor-pointer"
                          onClick={() => setNameDropdownOpen(!nameDropdownOpen)}
                        >
                          Category{" "}
                          <Image
                            src="/assets/icons/sort.svg"
                            alt="sort"
                            width={15}
                            height={15}
                            className={`ml-3 ${
                              sortConfig.direction === "ascending"
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </span>
                        {nameDropdownOpen && (
                          <div className="absolute top-14 w-[190px] bg-white border rounded shadow-lg">
                            <SortOption
                              label="Sort Ascending"
                              direction="ascending"
                              active={sortConfig.direction}
                              onClick={handleMonitorNameSort}
                              iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                              iconAlt="arrow"
                            />
                            <SortOption
                              label="Sort Descending"
                              direction="descending"
                              active={sortConfig.direction}
                              onClick={handleMonitorNameSort}
                              iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                              iconAlt="arrow"
                            />
                          </div>
                        )}
                      </div>
                    </th>
                    <th className="px-2 py-6 hover-text-style">Description</th>
                    <th className="px-2 py-6 hover-text-style">Action</th>
                  </tr>
                </thead>
                <tbody className="text-14">
                  {sortedData &&
                    sortedData
                      ?.filter((item) =>
                        item.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((item, index) => (
                        <tr
                          key={index}
                          className="border-b text-left text-sm border-style"
                        >
                          <td
                            className={`px-4 text-left py-6 ${
                              searchQuery ? "font-bold" : ""
                            }`}
                          >
                            {item?.name || "-"}
                          </td>
                          <td className="px-2 text-1212 py-6">
                            {item?.description || "-"}
                          </td>
                          <td className="px-2 mt-4 cursor-pointer text-left py-3">
                            <div className="flex">
                              <div
                                onClick={() => {
                                  Utils.scrollToTopSmooth();
                                  handleOpenEdit(item.id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  color={"#F39200"}
                                  size="xl"
                                  title="Edit"
                                />
                              </div>
                              <div
                                className="ml-4"
                                onClick={() => handleOpenDelete(item.id)}
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  color={"#F39200"}
                                  size="xl"
                                  title="Delete"
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <Modal
              isOpen={openDelete}
              childElement={
                <DeleteModal
                  label="Category"
                  onClose={() => {
                    handleDeleteClose();
                  }}
                  isOpen={false}
                  onDelete={() => {
                    handleDelete();
                  }}
                />
              }
            />
          </section>
          {isLoading && <LoadingSpinner />}
        </div>
        {category.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            perPage={perPage}
            totalRecords={Number(totalRecords)}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
          />
        )}
      </section>
    </div>
  );
};

export default Category;
