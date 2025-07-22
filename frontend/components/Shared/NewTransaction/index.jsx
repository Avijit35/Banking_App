import { Button, Card, Empty, Form, Image, Input, message, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

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

  const onFinish = (values) => {
    console.log(values);
  };

  const searchByAccountNo = async () => {
    alert(accountNo);
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
                src={`${import.meta.env.VITE_BASEURL}/bankImages/userImage.jpg`}
                width={120}
                className="rounded-full"
              />
              <Image
                src={`${import.meta.env.VITE_BASEURL}/bankImages/userImage.jpg`}
                width={120}
                className="rounded-full"
              />
            </div>
            <div className="mt-5 grid md:grid-cols-3 gap-8">
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <b>Name :</b>
                  <b>Avijit Manna</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Mobile :</b>
                  <b>9163920683</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Balance :</b>
                  <b>500000</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>DOB :</b>
                  <b>11-12-1994</b>
                </div>
                <div className="flex justify-between items-center">
                  <b>Currency :</b>
                  <b>INR</b>
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
