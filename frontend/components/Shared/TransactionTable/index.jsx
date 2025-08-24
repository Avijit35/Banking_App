import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { http, formatDate } from "../../../modules/modules";

const TransactionTable = ({ query = {} }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [accountNo, setAccountNo] = useState(query?.accountNo || "");
  const [branch, setBranch] = useState(query?.branch || "");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
  });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (params = {}) => {
    setLoading(true);
    const searchParams = new URLSearchParams({
      page: params.current,
      pageSize: params.pageSize,
    });

    if (branch) searchParams.append("branch", branch);
    if (accountNo) searchParams.append("accountNo", accountNo);

    try {
      const httpReq = http();
      const response = await httpReq.get(
        `/api/transaction/pagination?${searchParams.toString()}`
      );
      setData(response.data.data);
      setTotal(response.data.total);
      setPagination({
        current: response.data.page,
        pageSize: response.data.pageSize,
      });
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(pagination);
  }, [query]);

  const handleTableChange = (pagination) => {
    fetchTransactions(pagination);
  };

  const columns = [
    {
      title: "Account No",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Type",
      dataIndex: "transactionType",
      key: "transactionType",
    },
    {
      title: "Amount",
      dataIndex: "transactionAmount",
      key: "transactionAmount",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => formatDate(d),
    },
  ];

  return (
    <div className="p-4">
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        pagination={{
          total: total,
          current: pagination.current,
          pageSize: pagination.pageSize,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default TransactionTable;
