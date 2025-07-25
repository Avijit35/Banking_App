import { Button, Card, Empty, Form, Image, Input, message, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { http, trimData } from "../../../modules/modules.js";

const { Item } = Form;

const NewTransaction = () => {
  //get userinfo from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  //form info
  const [transactionForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  //states collection
  const [accountNo, setAccountNo] = useState(null);
  const [accountDetail, setAccountDetail] = useState(null);

  const onFinish = async (values) => {
    try {
      const finalObj = trimData(values);
      let balance = 0;

      if (finalObj.transctionType === "cr") {
        balance =
          Number(accountDetail.finalBalance) +
          Number(finalObj.transactionAmount);
      } else if (finalObj.transctionType === "dr") {
        balance =
          Number(accountDetail.finalBalance) -
          Number(finalObj.transactionAmount);
      }

      finalObj.currentBalance = accountDetail.finalBalance;
      finalObj.customerId = accountDetail._id;
      finalObj.accountNo = accountDetail.accountNo;

      const httpReq = http();
      await httpReq.post("/api/transaction", finalObj);
      await httpReq.put(`/api/customers/${accountDetail._id}`, {
        finalBalance: balance,
      });

      messageApi.success("Transaction created successfully");
      transactionForm.resetFields();
      setAccountDetail(null);
    } catch (error) {
      messageApi.error("Unable to process transaction");
    }
  };

  const searchByAccountNo = async () => {
    try {
      const obj = {
        accountNo,
        branch: userInfo?.branch,
      };

      const httpReq = http();
      const { data } = await httpReq.post("/api/find-by-account", obj);

      if (data?.data) {
        setAccountDetail(data?.data);
      } else {
        setAccountDetail(null);
        messageApi.error("There is no record of this account no !");
      }
    } catch (err) {
      messageApi.error("Unable to find account details !");
    }
  };

  return (
    <div>
      {contextHolder}
      <Card
        title="New Transaction"
        extra={
          <Input
            placeholder="Enter account number"
            onChange={(e) => setAccountNo(e.target.value)}
            addonAfter={
              <SearchOutlined
                onClick={searchByAccountNo}
                style={{ cursor: "pointer" }}
              />
            }
          />
        }
      >
        {accountDetail ? (
          <div>
            <div className="flex items-center justify-start gap-2">
              <Image
                src={`${import.meta.env.VITE_BASEURL}/${
                  accountDetail?.profile
                }`}
                width={120}
                className="rounded-full"
              />
              <Image
                src={`${import.meta.env.VITE_BASEURL}/${
                  accountDetail?.signature
                }`}
                width={120}
                className="rounded-full"
              />
            </div>
            <div className="mt-5 grid md:grid-cols-3 gap-8">
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <b>Name :</b>
                  <b>{accountDetail?.fullname}</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Mobile :</b>
                  <b>{accountDetail?.mobile}</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Balance :</b>
                  <b>
                    {accountDetail?.currency === "inr" && "₹"}
                    {accountDetail?.currency === "usd" && "$"}{" "}
                    {accountDetail?.finalBalance}
                  </b>
                </div>
                <div className="flex justify-between items-center">
                  <b>DOB :</b>
                  <b>{accountDetail?.dob}</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Currency :</b>
                  <b>{accountDetail?.currency}</b>
                </div>
              </div>
              <div></div>
              <Form
                form={transactionForm}
                onFinish={onFinish}
                layout="vertical"
              >
                <div className="grid md:grid-cols-2 gap-x-3">
                  <Item
                    label="Transaction Type"
                    rules={[{ required: true }]}
                    name="transctionType"
                  >
                    <Select
                      placeholder="Transaction Type"
                      className="w-full"
                      options={[
                        { value: "cr", label: "CR" },
                        { value: "dr", label: "DR" },
                      ]}
                    />
                  </Item>
                  <Item
                    label="Transaction Amount"
                    rules={[{ required: true }]}
                    name="transactionAmount"
                  >
                    <Input placeholder="5000.00" type="number" />
                  </Item>
                </div>
                <Item label="Reference" name="reference">
                  <Input.TextArea />
                </Item>
                <Item>
                  <Button
                    htmlType="submit"
                    type="text"
                    className="!bg-blue-500 !text-white !font-semibold !w-full"
                  >
                    Submit
                  </Button>
                </Item>
              </Form>
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </Card>
    </div>
  );
};

export default NewTransaction;
