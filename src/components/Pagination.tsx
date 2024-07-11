import React from "react";
import { Pagination as AntPagination } from "antd";

interface PaginationProps {
  total: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  perPage,
  currentPage,
  onPageChange,
}) => {
  //const totalPages = Math.ceil(total / perPage);

  return (
    <AntPagination
      current={currentPage}
      total={total}
      pageSize={perPage}
      onChange={(page) => onPageChange(page)}
      showSizeChanger={false}
    />
  );
};

export default Pagination;
