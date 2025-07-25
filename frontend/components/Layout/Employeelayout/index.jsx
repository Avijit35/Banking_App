import React, { useState } from "react";
import {
  AccountBookOutlined,
  BranchesOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
const { Header, Sider, Content } = Layout;

const Employeelayout = ({ children }) => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const Logout = () => {
    sessionStorage.removeItem("userInfo");
    cookies.remove("authToken");
    navigate("/");
  };

  const items = [
    {
      key: "/employee",
      icon: <DashboardOutlined />,
      label: <Link to="/employee">Dashboard</Link>,
    },
    {
      key: "/employee/new-account",
      icon: <AccountBookOutlined />,
      label: <Link to="/employee/new-account">New Account</Link>,
    },
    {
      key: "/employee/new-transaction",
      icon: <BranchesOutlined />,
      label: <Link to="/employee/new-transaction">New Transaction</Link>,
    },
    {
      key: "/employee/logout",
      icon: <LogoutOutlined />,
      label: (
        <Button
          type="text"
          className="!text-gray-300 !font-semibold"
          onClick={Logout}
        >
          Logout
        </Button>
      ),
    },
  ];

  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="!min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default Employeelayout;
