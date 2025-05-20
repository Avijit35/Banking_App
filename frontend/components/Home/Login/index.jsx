import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";

const { Item } = Form;

const Login = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  return (
    <div className="flex">
      <div className="w-1/2 hidden md:flex justify-center items-center">
        <img src="/bank-img.jpg" alt="Bank" className="object-contain w-4/5" />
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 bg-white">
        <Card className="w-full max-w-sm shadow-xl">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Bank Login
          </h2>
          <Form name="Login" onFinish={onFinish} layout="vertical">
            <Item name="username" label="Username" rules={[{ required: true }]}>
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
              />
            </Item>
            <Item name="password" label="Password" rules={[{ required: true }]}>
              <Input
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
