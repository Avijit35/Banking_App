import { Button, Card, Form, Input } from "antd";
import Adminlayout from "../../Layout/Adminlayout";
import { EditFilled } from "@ant-design/icons";

const { Item } = Form;

const Branding = () => {
  const [bankForm] = Form.useForm();

  const onFinish = async (values) => {
    console.log(values);
  };

  return (
    <Adminlayout>
      <Card title="Bank details" extra={<Button icon={<EditFilled />} />}>
        <Form form={bankForm} layout="vertical" onFinish={onFinish}>
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
              <Input type="file" />
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
            <Item
              label="Admin Fullname"
              name="fullName"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>
            <Item label="Admin Email" name="email" rules={[{ required: true }]}>
              <Input />
            </Item>
            <Item
              label="Admin Password"
              name="password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Item>
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
            <Button
              type="text"
              htmlType="submit"
              className="!bg-blue-500 !text-white !font-bold"
            >
              Submit
            </Button>
          </Item>
        </Form>
      </Card>
    </Adminlayout>
  );
};

export default Branding;
