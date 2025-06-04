import { Button, Card, Form, Input, Table } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleFilled,
} from "@ant-design/icons";
import { http, trimData } from "../../../modules/modules";
import axios from "axios";
import swal from "sweetalert";
import { useState } from "react";
import Password from "antd/es/input/Password";

axios.defaults.baseURL = import.meta.env.VITE_BASEURL;
const { Item } = Form;

const NewEmployee = () => {
  //states collection
  const [empForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  //create new employee
  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("photo", file);
      const httpReq = http();
      const { data } = await httpReq.post("/api/upload", formData);
      setPhoto(data.filePath);
    } catch (error) {
      swal("Failed", "Unable to upload file", "warning");
    }
  };

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
      console.log(res);

      empForm.resetFields();
      setPhoto(null);

      swal("Success", "Employee created !", "success");
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        empForm.setFields([
          {
            name: "email",
            errors: ["Email already exists !"],
          },
        ]);
      } else {
        swal("Warning", "Try again later !", "warning");
      }
    } finally {
      setLoading(false);
    }
  };

  //columns for tables
  const columns = [
    {
      title: "Profile",
      key: "profile",
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
      render: () => (
        <div className="flex gap-1">
          <Button
            type="text"
            className="!bg-pink-100 !text-pink-500"
            icon={<EyeInvisibleFilled />}
          />
          <Button
            type="text"
            className="!bg-green-100 !text-green-500"
            icon={<EditOutlined />}
          />
          <Button
            type="text"
            className="!bg-rose-100 !text-rose-500"
            icon={<DeleteOutlined />}
          />
        </div>
      ),
    },
  ];

  return (
    <Adminlayout>
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add new employee">
          <Form
            layout="vertical"
            form={empForm}
            onFinish={onFinish}
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
                <Input.Password />
              </Item>
            </div>
            <Item label="Address" name="address">
              <Input.TextArea />
            </Item>
            <Button
              htmlType="submit"
              type="text"
              loading={loading}
              className="!bg-blue-500 !font-bold !text-white !w-full"
            >
              Submit
            </Button>
          </Form>
        </Card>
        <Card title="Employee list" className="md:col-span-2">
          <Table columns={columns} dataSource={[{}, {}]} />
        </Card>
      </div>
    </Adminlayout>
  );
};

export default NewEmployee;
