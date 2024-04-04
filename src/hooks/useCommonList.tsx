// Importing: React.
import React from "react";

// Importing: Antd components.
import { Checkbox, Input, Layout, List } from "antd";

// Importing: Interfaces.
import UserInterface from "../interfaces/user";

export default function useCommonList({
  users,
  hidden,
  display,
  isLoading,
  rightIcon,
  onUserClick,
  selectedUsers,
  setNameToDelete,
  setSelectedUsers,
}: commonListInterface) {
  // Declaration spot.
  const className = `content ${hidden && "content__userslist"}`;

  // Declaring States.
  const [searched, setSearched] = React.useState("");

  const onCheckboxClick = (
    checkedUser: UserInterface,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.stopPropagation();
    const value = checkedUser._id || "";
    const newSelected = [...selectedUsers];
    const index = newSelected.findIndex((element) => element === value);
    index === -1 ? newSelected.push(value) : newSelected.splice(index, 1);
    if (!newSelected.length && setNameToDelete) setNameToDelete("");

    if (newSelected.length === 1 && setNameToDelete) {
      const nameIndex = users.findIndex(
        (user: UserInterface) => user._id === newSelected[0]
      );

      const name = nameIndex ? users[nameIndex].fullname : "";
      setNameToDelete(name);
    }

    setSelectedUsers(newSelected);
  };

  const renderItem = (user: UserInterface) => {
    const fullname = user.fullname.toLocaleLowerCase();
    if (!fullname.includes(searched.toLocaleLowerCase())) return;

    return (
      <List.Item onClick={async () => await onUserClick(user)}>
        <List.Item.Meta title={user.fullname} avatar={user.identifier} />

        <Checkbox
          className="checkbox"
          checked={selectedUsers.includes(user._id)}
          onClick={(event) => onCheckboxClick(user, event)}
        />
      </List.Item>
    );
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget as HTMLInputElement;
    setSearched(target.value || "");
  };

  const header = (
    <Layout.Header className="bit-header">
      <div className="header__options">
        <Input.Search
          allowClear
          suffix={null}
          onChange={onSearchChange}
          style={{ display, marginRight: 20 }}
        />
        {rightIcon}
      </div>
    </Layout.Header>
  );

  const list = (
    <List
      dataSource={users}
      style={{ display }}
      loading={isLoading}
      className={className}
      renderItem={(user) => renderItem(user)}
    />
  );

  return { header, list };
}

interface commonListInterface {
  hidden: boolean;
  selectedUsers: any;
  isLoading: boolean;
  users: UserInterface[];
  setSelectedUsers: any;
  rightIcon: JSX.Element;
  display: "block" | "none";
  onUserClick: (user: UserInterface) => Promise<void>;
  setNameToDelete?: React.Dispatch<React.SetStateAction<string>>;
}
