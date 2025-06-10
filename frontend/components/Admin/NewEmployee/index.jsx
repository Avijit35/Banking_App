import {
  Button,
  Card,
  Form,
  Image,
  Input,
  message,
  Popconfirm,
  Table,
} from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleFilled,
  EyeOutlined,
} from "@ant-design/icons";
import { http, trimData } from "../../../modules/modules";
import { useEffect, useState } from "react";

const { Item } = Form;

const NewEmployee = () => {
  //states collection
  const [empForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [messageApi, context] = message.useMessage();
  const [allEmployee, setAllEmployee] = useState([]);
  const [no, setNo] = useState(0);
  const [edit, setEdit] = useState(null);

  //get all employee data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/user");
        setAllEmployee(data.data);
      } catch (error) {
        messageApi.error("Unable to fetch data !");
      }
    };

    fetcher();
  }, [no]);

  //create new employee
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      finalObj.profile = photo ? photo : "bankImages/userImage.jpg";
      const httpReq = http();
      const { data } = await httpReq.post("/api/user", finalObj);

      const mailobj = {
        email: values.email,
        password: values.password,
      };

      const res = await httpReq.post("/api/send-email", mailobj);

      empForm.resetFields();
      setPhoto(null);
      setNo(no + 1);
      messageApi.success("Employee created !");
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        empForm.setFields([
          {
            name: "email",
            errors: ["Email already exists !"],
          },
        ]);
      } else {
        messageApi.error("Try again later !");
      }
    } finally {
      setLoading(false);
    }
  };

  //handle upload
  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("photo", file);
      const httpReq = http();
      const { data } = await httpReq.post("/api/upload", formData);
      setPhoto(data.filePath);
    } catch (error) {
      messageApi.error("Failed Unable to upload file");
    }
  };

  //update isActive
  const updateIsActive = async (id, isActive) => {
    try {
      const obj = {
        isActive: !isActive,
      };
      const httpReq = http();
      await httpReq.put(`api/user/${id}`, obj);

      setNo(no + 1);
      messageApi.success("IsActive Updated");
    } catch (err) {
      messageApi.error("Unable to update isActtive !");
    }
  };

  //update employee
  const onEditUser = (obj) => {
    setEdit(obj);
    empForm.setFieldsValue(obj);
  };

  const onUpdateUser = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      if (photo) {
        finalObj.profile = photo;
      }
      const httpReq = http();
      await httpReq.put(`api/user/${edit._id}`, finalObj);

      setEdit(null);
      empForm.resetFields();
      setPhoto(null);
      setNo(no + 1);
      messageApi.success("Employee updated successfully");
    } catch (err) {
      messageApi.error("Unable to update employee !");
    } finally {
      setLoading(false);
    }
  };

  //delete employee
  const onDeleteUser = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`api/user/${id}`);

      setNo(no + 1);
      messageApi.success("Employee deleted successfully");
    } catch (err) {
      messageApi.error("Unable to delete user !");
    }
  };

  //columns for tables
  const columns = [
    {
      title: "Profile",
      key: "profile",
      render: (_, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`}
          className="rounded-full"
          height={40}
          width={40}
        />
      ),
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Are you sure?"
            description="Once you update, you can also re-update !"
            onCancel={() => messageApi.info("No changes occur !")}
            onConfirm={() => updateIsActive(obj._id, obj.isActive)}
          >
            <Button
              type="text"
              className={`${
                obj.isActive
                  ? "!bg-indigo-100 !text-indigo-500"
                  : "!bg-pink-100 !text-pink-500"
              }`}
              icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleFilled />}
            />
          </Popconfirm>
          <Popconfirm
            title="Are you Sure ?"
            description="Once update, you can also re-update !"
            onCancel={() => messageApi.info("No changes occur !")}
            onConfirm={() => onEditUser(obj)}
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
            onConfirm={() => onDeleteUser(obj._id)}
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
        <Card title="Add New Employee">
          <Form
            layout="vertical"
            form={empForm}
            onFinish={edit ? onUpdateUser : onFinish}
            autoComplete="on"
          >
            <Item name="photo" label="Profile">
              <Input type="file" onChange={handleUpload} />
            </Item>
            <div className="grid md:grid-cols-2 gap-x-2">
              <Item
                name="fullname"
                label="Fullname"
                rules={[{ required: true }]}
              >
                <Input />
              </Item>
              <Item name="mobile" label="Mobile" rules={[{ required: true }]}>
                <Input type="number" />
              </Item>
              <Item name="email" label="Email" rules={[{ required: true }]}>
                <Input />
              </Item>
              <Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
              >
                <Input.Password disabled={edit ? true : false} />
              </Item>
            </div>
            <Item label="Address" name="address">
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
          title="Employee List"
          className="md:col-span-2"
          style={{ overflowX: "scroll" }}
        >
          <Table
            columns={columns}
            dataSource={allEmployee}
            scroll={{ x: "max-content" }}
          />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default NewEmployee;
