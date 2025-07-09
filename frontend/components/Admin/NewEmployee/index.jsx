import {
  Button,
  Card,
  Form,
  Image,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
} from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleFilled,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  fetchData,
  http,
  trimData,
  uploadFile,
} from "../../../modules/modules";
import { useEffect, useState } from "react";
import useSWR from "swr";

const { Item } = Form;

const NewEmployee = () => {
  //states collection
  const [empForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [messageApi, context] = message.useMessage();
  const [allEmployee, setAllEmployee] = useState([]);
  const [finalEmployees, setfinalEmployees] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
  const [no, setNo] = useState(0);
  const [edit, setEdit] = useState(null);

  //get branch data
  const { data: branches, error: bError } = useSWR("/api/branch", fetchData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 120000,
  });

  useEffect(() => {
    if (branches) {
      let filter =
        branches &&
        branches?.data.map((item) => {
          return {
            label: item.branchName,
            value: item.branchName,
            key: item.key,
          };
        });

      setAllBranch(filter);
    }
  }, [branches]);

  //get all employee data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/user");
        setAllEmployee(data.data);
        setfinalEmployees(data.data);
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
      finalObj.userType = "employee";
      finalObj.key = finalObj.email;
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
      const folderName = "employeePhoto";
      const result = await uploadFile(file, folderName);
      setPhoto(result.filePath);
    } catch (err) {
      messageApi.error("Upload Failed !");
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

  //Search User by all
  const onSearch = (e) => {
    const value = e.target.value.trim().toLowerCase();
    const filter =
      finalEmployees &&
      finalEmployees.filter((Item) => {
        if (Item.fullname.toLowerCase().indexOf(value) != -1) {
          return Item;
        } else if (Item.email.toLowerCase().indexOf(value) != -1) {
          return Item;
        } else if (
          Item.address &&
          Item.address.toLowerCase().indexOf(value) != -1
        ) {
          return Item;
        } else if (Item.userType.toLowerCase().indexOf(value) != -1) {
          return Item;
        } else if (
          Item.mobile &&
          Item.mobile.toLowerCase().indexOf(value) != -1
        ) {
          return Item;
        } else if (
          Item.branch &&
          Item.branch.toLowerCase().indexOf(value) != -1
        ) {
          return Item;
        }
      });

    setAllEmployee(filter);
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
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      render: (text) => {
        if (text === "admin") {
          return <span className="text-indigo-500 capitalize">{text}</span>;
        } else if (text === "employee") {
          return <span className="text-green-500 capitalize">{text}</span>;
        } else {
          return <span className="text-red-500 capitalize">{text}</span>;
        }
      },
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
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
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
            <Item
              name="branch"
              label="Select Branch"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select branch" options={allBranch} />
            </Item>
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
          extra={
            <div>
              <Input
                placeholder="Search by all"
                prefix={<SearchOutlined />}
                onChange={onSearch}
              />
            </div>
          }
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
