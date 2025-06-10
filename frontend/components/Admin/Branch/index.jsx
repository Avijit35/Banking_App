import { Button, Card, Form, Input, message, Popconfirm, Table } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { http, trimData } from "../../../modules/modules";
import { useEffect, useState } from "react";

const { Item } = Form;

const Branch = () => {
  //states collection
  const [branchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, context] = message.useMessage();
  const [allBranch, setAllBranch] = useState([]);
  const [no, setNo] = useState(0);
  const [edit, setEdit] = useState(null);

  //get all branch data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/branch");
        setAllBranch(data.data);
      } catch (error) {
        messageApi.error("Unable to fetch data !");
      }
    };

    fetcher();
  }, [no]);

  //create new branch
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      const httpReq = http();
      const { data } = await httpReq.post("/api/branch", finalObj);

      branchForm.resetFields();
      setNo(no + 1);
      messageApi.success("Branch created !");
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        branchForm.setFields([
          {
            name: "branchName",
            errors: ["Branch Name already exists !"],
          },
        ]);
      } else {
        messageApi.error("Try again later !");
      }
    } finally {
      setLoading(false);
    }
  };

  //update branch
  const onEditBranch = (obj) => {
    setEdit(obj);
    branchForm.setFieldsValue(obj);
  };

  const onUpdateBranch = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      const httpReq = http();
      await httpReq.put(`api/branch/${edit._id}`, finalObj);

      setEdit(null);
      branchForm.resetFields();
      setNo(no + 1);
      messageApi.success("Branch updated successfully");
    } catch (err) {
      messageApi.error("Unable to update branch !");
    } finally {
      setLoading(false);
    }
  };

  //delete branch
  const onDeleteBranch = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`api/branch/${id}`);

      setNo(no + 1);
      messageApi.success("Branch deleted successfully");
    } catch (err) {
      messageApi.error("Unable to delete branch !");
    }
  };

  //columns for tables
  const columns = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
    },
    {
      title: "Branch Address",
      dataIndex: "branchAddress",
      key: "branchAddress",
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
            onConfirm={() => onEditBranch(obj)}
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
            onConfirm={() => onDeleteBranch(obj._id)}
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
        <Card title="Add New Branch">
          <Form
            layout="vertical"
            form={branchForm}
            onFinish={edit ? onUpdateBranch : onFinish}
            autoComplete="on"
          >
            <Item
              name="branchName"
              label="Branch Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            <Item label="Branch Address" name="branchAddress">
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
          title="Branch List"
          className="md:col-span-2"
          style={{ overflowX: "scroll" }}
        >
          <Table
            columns={columns}
            dataSource={allBranch}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default Branch;
