import {
  Button,
  Card,
  Form,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
} from "antd";
import {
  DeleteFilled,
  DownloadOutlined,
  EditOutlined,
  EyeInvisibleFilled,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
  const [allCustomer, setAllCustomer] = useState([]);
  const [finalCustomer, setFinalCustomer] = useState([]);
  const [messageApi, context] = message.useMessage();
  const [no, setNo] = useState(0);
  const [edit, setEdit] = useState(null);

  //get branding data
  const { data: branding, error: bError } = useSWR("api/branding", fetchData, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 120000,
  });

  //get all customer data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/customers");

        setAllCustomer(
          data?.data.filter((cus) => cus.branch == userInfo?.branch)
        );
        setFinalCustomer(
          data?.data.filter((cus) => cus.branch == userInfo?.branch)
        );
      } catch (error) {
        messageApi.error("Unable to fetch data !");
      }
    };

    fetcher();
  }, [no]);

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
      const { data } = await httpReq.post("/api/users", finalObj);
      finalObj.customerLoginId = data?.data?._id;

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
      setAccountModal(false);
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

  //update isActive
  const updateIsActive = async (id, isActive, loginId) => {
    try {
      const obj = {
        isActive: !isActive,
      };
      const httpReq = http();
      await httpReq.put(`api/users/${loginId}`, obj);
      await httpReq.put(`api/customers/${id}`, obj);

      setNo(no + 1);
      messageApi.success("IsActive Updated");
    } catch (err) {
      messageApi.error("Unable to update isActtive !");
    }
  };

  //update employee
  const onEditCustomer = (obj) => {
    setEdit(obj);
    setAccountModal(true);
    accountForm.setFieldsValue(obj);
  };

  const onUpdateCustomer = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      delete finalObj.password;
      delete finalObj.accountNo;
      delete finalObj.email;
      if (photo) {
        finalObj.profile = photo;
      }
      if (document) {
        finalObj.document = document;
      }
      if (signature) {
        finalObj.signature = signature;
      }
      const httpReq = http();
      await httpReq.put(`api/customers/${edit._id}`, finalObj);

      setEdit(null);
      accountForm.resetFields();
      setPhoto(null);
      setDocument(null);
      setSignature(null);
      setNo(no + 1);
      setAccountModal(false);
      messageApi.success("Customer updated successfully");
    } catch (err) {
      messageApi.error("Unable to update Customer !");
    } finally {
      setLoading(false);
    }
  };

  //delete customer
  const onDeleteCustomer = async (id, loginId) => {
    try {
      const httpReq = http();
      await httpReq.delete(`api/users/${loginId}`);
      await httpReq.delete(`api/customers/${id}`);

      setNo(no + 1);
      messageApi.success("Customer deleted successfully");
    } catch (err) {
      messageApi.error("Unable to delete customer !");
    }
  };

  //Search User by all
  const onSearch = (e) => {
    const value = e.target.value.trim().toLowerCase();
    const filter =
      finalCustomer &&
      finalCustomer.filter((Item) => {
        if (Item?.fullname.toLowerCase().indexOf(value) != -1) {
          return Item;
        } else if (Item?.email.toLowerCase().indexOf(value) != -1) {
          return Item;
        } else if (
          Item.address &&
          Item?.address.toLowerCase().indexOf(value) != -1
        ) {
          return Item;
        } else if (Item?.userType.toLowerCase().indexOf(value) != -1) {
          return Item;
        } else if (
          Item.mobile &&
          Item?.mobile.toLowerCase().indexOf(value) != -1
        ) {
          return Item;
        } else if (
          Item.branch &&
          Item?.branch.toLowerCase().indexOf(value) != -1
        ) {
          return Item;
        } else if (Item?.accountNo.toLowerCase().indexOf(value) != -1) {
          return Item;
        } else if (
          Item?.finalBalance.toString().toLowerCase().indexOf(value) != -1
        ) {
          return Item;
        } else if (Item?.createdBy.toLowerCase().indexOf(value) != -1) {
          return Item;
        }
      });

    setAllCustomer(filter);
  };

  //columns for tables
  const columns = [
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
          src={`${import.meta.env.VITE_BASEURL}/${obj.signature}`}
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
        <Button
          type="text"
          shape="circle"
          className="!bg-blue-100 !text-blue-500"
          icon={<DownloadOutlined />}
        />
      ),
    },
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
      title: "Balance",
      dataIndex: "finalBalance",
      key: "finalBalance",
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
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
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
            onConfirm={() =>
              updateIsActive(obj._id, obj.isActive, obj.customerLoginId)
            }
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
            onConfirm={() => onEditCustomer(obj)}
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
            onConfirm={() => onDeleteCustomer(obj._id, obj.customerLoginId)}
          >
            <Button
              type="text"
              className="!bg-rose-100 !text-rose-500"
              icon={<DeleteFilled />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onCloseModal = () => {
    setAccountModal(false);
    setEdit(null);
    accountForm.resetFields();
  };

  return (
    <div>
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
                onChange={onSearch}
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
            dataSource={allCustomer}
            scroll={{ x: "max-content" }}
          />
        </Card>
        <Modal
          open={accountModal}
          onCancel={onCloseModal}
          width={820}
          footer={null}
          title="Open New Account"
        >
          <Form
            layout="vertical"
            form={accountForm}
            onFinish={edit ? onUpdateCustomer : onFinish}
          >
            {!edit && (
              <div className="grid md:grid-cols-3 gap-x-3">
                <Item
                  label="Account No"
                  name="accountNo"
                  rules={[{ required: true }]}
                >
                  <Input disabled placeholder="Account No" />
                </Item>
                <Item label="Email" name="email" rules={[{ required: true }]}>
                  <Input disabled={edit ? true : false} placeholder="Email" />
                </Item>
                <Item
                  label="Password"
                  name="password"
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    disabled={edit ? true : false}
                    placeholder="Password"
                  />
                </Item>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-x-3">
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
                name="xyz"
                // rules={[{ required: true }]}
              >
                <Input type="file" onChange={handlePhoto} />
              </Item>
              <Item
                label="Signature"
                name="dlf"
                // rules={[{ required: true }]}
              >
                <Input type="file" onChange={handleSignature} />
              </Item>
              <Item
                label="Document"
                name="dsr"
                // rules={[{ required: true }]}
              >
                <Input type="file" onChange={handleDocument} />
              </Item>
            </div>
            <Item label="Address" name="address" rules={[{ required: true }]}>
              <Input.TextArea />
            </Item>
            <Item className="flex justify-end items-center">
              {edit ? (
                <Button
                  loading={loading}
                  type="text"
                  htmlType="submit"
                  className="!bg-red-500 !font-semibold !text-white"
                >
                  Update
                </Button>
              ) : (
                <Button
                  loading={loading}
                  type="text"
                  htmlType="submit"
                  className="!bg-blue-500 !font-semibold !text-white"
                >
                  Submit
                </Button>
              )}
            </Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default NewAccount;
