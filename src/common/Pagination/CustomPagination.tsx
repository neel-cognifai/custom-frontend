import React from "react";
import Pagination from "react-js-pagination";

interface CustomPaginationProps {
  currentPage: number;
  perPage: number;
  totalRecords: number;
  handlePageChange: (pageNumber: number) => void;
  handlePerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  perPage,
  totalRecords,
  handlePageChange,
  handlePerPageChange,
}) => {
  return (
    <div className="flex justify-between text-14 mr-4 mt-4">
      <div className="ml-4">
        <span className="text-violet">Per Page:</span>
        <select
          value={perPage}
          onChange={handlePerPageChange}
          className="ml-3 cursor-pointer border text-14 px-4 py-1 border-violet rounded-md"
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={perPage}
          totalItemsCount={totalRecords}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
          prevPageText="Previous"
          nextPageText="Next"
          hideDisabled={true}
          activeClass="active"
          hideNavigation={false}
          hideFirstLastPages={true}
        />
      </div>
    </div>
  );
};

export default CustomPagination;
