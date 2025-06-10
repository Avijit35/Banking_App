import { Button, Card, Form, Input, message, Popconfirm, Table } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { http, trimData } from "../../../modules/modules";
import { useEffect, useState } from "react";

const { Item } = Form;

const Currency = () => {
  //states collection
  const [currencyForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, context] = message.useMessage();
  const [allCurrency, setAllCurrency] = useState([]);
  const [no, setNo] = useState(0);
  const [edit, setEdit] = useState(null);

  //get all currency data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/currency");
        setAllCurrency(data.data);
      } catch (error) {
        messageApi.error("Unable to fetch data !");
      }
    };

    fetcher();
  }, [no]);

  //create new currency
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      finalObj.key = finalObj.currencyName;
      const httpReq = http();
      const { data } = await httpReq.post("/api/currency", finalObj);

      currencyForm.resetFields();
      setNo(no + 1);
      messageApi.success("Currency created !");
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        currencyForm.setFields([
          {
            name: "currencyName",
            errors: ["Currency Name already exists !"],
          },
        ]);
      } else {
        messageApi.error("Try again later !");
      }
    } finally {
      setLoading(false);
    }
  };

  //update currency
  const onEditCurrency = (obj) => {
    setEdit(obj);
    currencyForm.setFieldsValue(obj);
  };

  const onUpdateCurrency = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      const httpReq = http();
      await httpReq.put(`api/currency/${edit._id}`, finalObj);

      setEdit(null);
      currencyForm.resetFields();
      setNo(no + 1);
      messageApi.success("Currency updated successfully");
    } catch (err) {
      messageApi.error("Unable to update branch !");
    } finally {
      setLoading(false);
    }
  };

  //delete currency
  const onDeleteCurrency = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`api/currency/${id}`);

      setNo(no + 1);
      messageApi.success("Currency deleted successfully");
    } catch (err) {
      messageApi.error("Unable to delete Currency !");
    }
  };

  //columns for tables
  const columns = [
    {
      title: "Currency Name",
      dataIndex: "currencyName",
      key: "currencyName",
    },
    {
      title: "Currency Description",
      dataIndex: "currencyDesc",
      key: "currencyDesc",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Are you Sure ?"
            description="Once update, you can also re-update !"
            onCancel={() => messageApi.info("No changes occur !")}
            onConfirm={() => onEditCurrency(obj)}
          >
            <Button
              type="text"
              className="!bg-green-100 !text-green-500"
              icon={<EditOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="Are you sure ?"
            description="Once you deleted, you can not restore !"
            onCancel={() => messageApi.info("Your data is safe !")}
            onConfirm={() => onDeleteCurrency(obj._id)}
          >
            <Button
              type="text"
              className="!bg-rose-100 !text-rose-500"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Adminlayout>
      {context}
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add New Currency">
          <Form
            layout="vertical"
            form={currencyForm}
            onFinish={edit ? onUpdateCurrency : onFinish}
            autoComplete="on"
          >
            <Item
              name="currencyName"
              label="Currency Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            <Item label="Currency Description" name="currencyDesc">
              <Input.TextArea />
            </Item>
            {edit ? (
              <Button
                htmlType="submit"
                type="text"
                loading={loading}
                className="!bg-rose-500 !font-bold !text-white !w-full"
              >
                Update
              </Button>
            ) : (
              <Button
                htmlType="submit"
                type="text"
                loading={loading}
                className="!bg-blue-500 !font-bold !text-white !w-full"
              >
                Submit
              </Button>
            )}
          </Form>
        </Card>
        <Card
          title="Currency List"
          className="md:col-span-2"
          style={{ overflowX: "scroll" }}
        >
          <Table
            columns={columns}
            dataSource={allCurrency}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default Currency;
