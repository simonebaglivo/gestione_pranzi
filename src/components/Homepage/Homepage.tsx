// Importing: React.
import React from "react";

// Importing: Antd components.
import { Layout, Menu, MenuProps, Space } from "antd";

// Importing: Project components.
import UsersList from "../Users/UsersList";
import Schedule from "../Schedule/Schedule";

// Importing: Styles.
import "./homepage.scss";

export default function HomePage() {
  // Declaring States.
  const [current, setCurrent] = React.useState("schedule");

  const items: MenuProps["items"] = [
    {
      key: "schedule",
      label: "Programma",
    },
    {
      key: "userslist",
      label: "Lista Persone",
    },
    {
      disabled: true,
      key: "settings",
      label: "Impostazioni",
    },
  ];

  const onMenuClick: MenuProps["onClick"] = (event) => {
    setCurrent(event.key);
  };

  const getContent = () => {
    const mapContent: mapContentInterface = {
      settings: <></>,
      schedule: <Schedule />,
      userslist: <UsersList />,
    };

    return mapContent[current];
  };

  return (
    <Space direction="vertical" className="homepage">
      <Layout>
        {getContent()}

        <Layout.Footer style={{ padding: 0 }}>
          <Menu
            items={items}
            mode="horizontal"
            onClick={onMenuClick}
            selectedKeys={[current]}
            className="homepage__menu"
          />
        </Layout.Footer>
      </Layout>
    </Space>
  );
}

interface mapContentInterface {
  [key: string]: JSX.Element;
}
