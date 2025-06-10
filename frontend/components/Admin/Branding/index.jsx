import { Button, Card, Form, Input, message } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import { EditFilled } from "@ant-design/icons";
import { http, trimData } from "../../../modules/modules";
import { useState, useEffect } from "react";

const { Item } = Form;

const Branding = () => {
  //states collection
  const [bankForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [brandings, setBrandings] = useState(null);
  const [no, setNo] = useState(0);
  const [edit, setEdit] = useState(false);

  //get branding data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get("/api/branding");
        setBrandings(data?.data[0]);
        bankForm.setFieldsValue(data?.data[0]);
      } catch (error) {
        console.log(error);
        messageApi.error("Unable to fetch data !");
      }
    };

    fetcher();
    setEdit(true);
  }, [no]);

  //store bank details in database
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      finalObj.bankLogo = photo ? photo : "bankImages/userImage.jpg";
      const userInfo = {
        fullname: finalObj.fullname,
        email: finalObj.email,
        password: finalObj.password,
        profile: "bankImages/userImage.jpg",
        userType: "admin",
        isActive: true,
      };

      const httpReq = http();
      await httpReq.post("/api/branding", finalObj);
      await httpReq.post("/api/user", userInfo);

      setPhoto(null);
      bankForm.resetFields();
      setNo(no + 1);
      messageApi.success("Branding created successfully");
    } catch (err) {
      messageApi.error("Unable to store branding !");
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

  //update bank details in database
  const onUpdate = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      if (photo) {
        finalObj.bankLogo = photo;
      }

      const httpReq = http();
      await httpReq.put(`/api/branding/${brandings._id}`, finalObj);

      setPhoto(null);
      bankForm.resetFields();
      setNo(no + 1);
      messageApi.success("Branding updated successfully");
    } catch (err) {
      messageApi.error("Unable to store branding !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Adminlayout>
      {context}
      <Card
        title="Bank details"
        extra={<Button icon={<EditFilled />} onClick={() => setEdit(!edit)} />}
      >
        <Form
          form={bankForm}
          layout="vertical"
          onFinish={brandings ? onUpdate : onFinish}
          disabled={edit}
        >
          <div className="grid md:grid-cols-3 gap-x-3">
            <Item
              label="Bank name"
              name="bankName"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            <Item
              label="Bank Tagline"
              name="bankTagline"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            <Item label="Bank Logo" name="photo">
              <Input type="file" onChange={handleUpload} />
            </Item>
            <Item
              label="Bank Account No"
              name="bankAccountNo"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            <Item
              label="Bank Account Transaction Id"
              name="bankTransactionId"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            <Item
              label="Bank Address"
              name="bankAddress"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            <div
              className={`${
                brandings
                  ? "hidden"
                  : "md:col-span-3 grid md:grid-cols-3 gap-x-3"
              }`}
            >
              <Item
                label="Admin Fullname"
                name="fullname"
                rules={[{ required: brandings ? false : true }]}
              >
                <Input />
              </Item>
              <Item
                label="Admin Email"
                name="email"
                rules={[{ required: brandings ? false : true }]}
              >
                <Input />
              </Item>
              <Item
                label="Admin Password"
                name="password"
                rules={[{ required: brandings ? false : true }]}
              >
                <Input.Password />
              </Item>
            </div>
            <Item label="Bank Linkedin" name="bankLinkedin">
              <Input type="url" />
            </Item>
            <Item label="Bank Twitter" name="bankTwitter">
              <Input type="url" />
            </Item>
            <Item label="Bank Facebook" name="bankFacebook">
              <Input type="url" />
            </Item>
          </div>
          <Item label="Bank Description" name="bankDesc">
            <Input.TextArea />
          </Item>
          <Item className="flex justify-end items-center">
            {brandings ? (
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-rose-500 !text-white !font-bold"
              >
                Update
              </Button>
            ) : (
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-blue-500 !text-white !font-bold"
              >
                Submit
              </Button>
            )}
          </Item>
        </Form>
      </Card>
    </Adminlayout>
  );
};

export default Branding;
