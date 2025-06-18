import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { trimData, http } from "../../../modules/modules";

const { Item } = Form;

const Login = () => {
  const [messageApi, context] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const finalObj = trimData(values);
      const httpReq = http();

      const { data } = await httpReq.post("/api/login", finalObj);
      console.log(data);
      messageApi.success("Login Success");
    } catch (err) {
      console.log(err);
      messageApi.error(err?.response?.data?.message);
    }
  };

  return (
    <div className="flex">
      {context}
      <div className="w-1/2 hidden md:flex justify-center items-center">
        <img src="/bank-img.jpg" alt="Bank" className="object-contain w-4/5" />
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 bg-white">
        <Card className="w-full max-w-sm shadow-xl">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Bank Login
          </h2>
          <Form name="Login" onFinish={onFinish} layout="vertical">
            <Item name="email" label="Username" rules={[{ required: true }]}>
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
              />
            </Item>
            <Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Item>
            <Button
              htmlType="submit"
              type="text"
              block
              className="!bg-blue-500 !text-white !font-bold"
            >
              Login
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
