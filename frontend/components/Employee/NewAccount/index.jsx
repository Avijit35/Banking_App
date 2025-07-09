import { Button, Card, Form, Input, message, Modal, Select, Table } from "antd";
import Employeelayout from "../../Layout/Employeelayout";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  http,
  fetchData,
  trimData,
  uploadFile,
} from "../../../modules/modules";
import useSWR, { mutate } from "swr";

const { Item } = Form;

const NewAccount = () => {
  const [accountForm] = Form.useForm();
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  //states collection
  const [accountModal, setAccountModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [signature, setSignature] = useState(null);
  const [messageApi, context] = message.useMessage();
  const [no, setNo] = useState(0);

  //get branding data
  const { data: branding, error: bError } = useSWR("api/branding", fetchData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 120000,
  });

  let bankAccountNo = Number(branding && branding?.data[0]?.bankAccountNo) + 1;
  let brandingId = branding && branding?.data[0]?._id;

  useEffect(() => {
    if (accountModal) accountForm.setFieldValue("accountNo", bankAccountNo);
  }, [accountModal]);

  //create new acoount
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      finalObj.profile = photo ? photo : "bankImages/userImage.jpg";
      finalObj.document = document ? document : "bankImages/userImage.jpg";
      finalObj.signature = signature ? signature : "bankImages/userImage.jpg";
      finalObj.key = finalObj.email;
      finalObj.userType = "customer";
      finalObj.branch = userInfo?.branch;
      finalObj.createdBy = userInfo?.email;

      const httpReq = http();
      await httpReq.post("/api/users", finalObj);
      await httpReq.post("/api/customers", finalObj);

      const mailobj = {
        email: values.email,
        password: values.password,
      };

      await httpReq.post("/api/send-email", mailobj);
      await httpReq.put(`/api/branding/${brandingId}`, { bankAccountNo });

      accountForm.resetFields();
      mutate("api/branding");
      setPhoto(null);
      setDocument(null);
      setSignature(null);
      setNo(no + 1);
      messageApi.success("Account created !");
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        accountForm.setFields([
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

  //handle Photo Upload
  const handlePhoto = async (e) => {
    try {
      const file = e.target.files[0];
      const folderName = "customerPhoto";
      const result = await uploadFile(file, folderName);
      setPhoto(result.filePath);
    } catch (err) {
      messageApi.error("Upload Failed !");
    }
  };

  //handle document Upload
  const handleDocument = async (e) => {
    try {
      const file = e.target.files[0];
      const folderName = "customerDocument";
      const result = await uploadFile(file, folderName);
      setDocument(result.filePath);
    } catch (err) {
      messageApi.error("Upload Failed !");
    }
  };

  //handle signature Upload
  const handleSignature = async (e) => {
    try {
      const file = e.target.files[0];
      const folderName = "customerSignature";
      const result = await uploadFile(file, folderName);
      setSignature(result.filePath);
    } catch (err) {
      messageApi.error("Upload Failed !");
    }
  };

  //columns for tables
  const columns = [
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
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
      title: "Account No",
      dataIndex: "accountNo",
      key: "accountNo",
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Photo",
      key: "photo",
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
      title: "Signature",
      key: "signature",
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
      title: "Document",
      key: "document",
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
    <Employeelayout>
      {context}
      <div className="grid">
        <Card
          title="Account List"
          style={{ overflowX: "scroll" }}
          extra={
            <div className="flex gap-x-3">
              <Input
                placeholder="Search by all"
                prefix={<SearchOutlined />}
                // onChange={onSearch}
              />
              <Button
                type="text"
                className="!font-bold !bg-blue-500 !text-white"
                onClick={() => setAccountModal(true)}
              >
                Add New Account
              </Button>
            </div>
          }
        >
          <Table
            columns={columns}
            dataSource={[]}
            scroll={{ x: "max-content" }}
          />
        </Card>
        <Modal
          open={accountModal}
          onCancel={() => setAccountModal(false)}
          width={820}
          footer={null}
          title="Open New Account"
        >
          <Form layout="vertical" form={accountForm} onFinish={onFinish}>
            <div className="grid md:grid-cols-3 gap-x-3">
              <Item
                label="Account No"
                name="accountNo"
                rules={[{ required: true }]}
              >
                <Input disabled placeholder="Account No" />
              </Item>
              <Item
                label="Fullname"
                name="fullname"
                rules={[{ required: true }]}
              >
                <Input placeholder="Fullname" />
              </Item>
              <Item label="Mobile" name="mobile" rules={[{ required: true }]}>
                <Input type="number" />
              </Item>
              <Item
                label="Father Name"
                name="fatherName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Father Name" />
              </Item>
              <Item label="Email" name="email" rules={[{ required: true }]}>
                <Input placeholder="Email" />
              </Item>
              <Item
                label="Password"
                name="password"
                rules={[{ required: true }]}
              >
                <Input.Password placeholder="Password" />
              </Item>
              <Item label="DOB" name="dob" rules={[{ required: true }]}>
                <Input type="date" />
              </Item>
              <Item label="Gender" name="gender" rules={[{ required: true }]}>
                <Select
                  placeholder="Select gender"
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                />
              </Item>
              <Item
                label="Currency"
                name="currency"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select currency"
                  options={[
                    { label: "INR", value: "inr" },
                    { label: "USD", value: "usd" },
                  ]}
                />
              </Item>
              <Item
                label="Photo"
                name="photo"
                // rules={[{ required: true }]}
              >
                <Input type="file" onChange={handlePhoto} />
              </Item>
              <Item
                label="Signature"
                name="signature"
                // rules={[{ required: true }]}
              >
                <Input type="file" onChange={handleSignature} />
              </Item>
              <Item
                label="Document"
                name="document"
                // rules={[{ required: true }]}
              >
                <Input type="file" onChange={handleDocument} />
              </Item>
            </div>
            <Item label="Address" name="address" rules={[{ required: true }]}>
              <Input.TextArea />
            </Item>
            <Item className="flex justify-end items-center">
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-blue-500 !font-semibold !text-white"
              >
                Submit
              </Button>
            </Item>
          </Form>
        </Modal>
      </div>
    </Employeelayout>
  );
};

export default NewAccount;
