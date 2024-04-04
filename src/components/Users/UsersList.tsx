// Importing: React.
import React from "react";

// Importing: Project components.
import AddUser from "./AddUser";

// Importing: Components.
import EditUser from "./EditUser";

// Importing: Ant components.
import { Layout, Modal } from "antd";

// Importing: Server.
import server from "../../api/server";

// Importing: Hooks.
import useUnmarriedUsers from "../../hooks/useUnmarriedUsers";
import useCommonList from "../../hooks/useCommonList";

// Importing: Interfaces.
import UserInterface from "../../interfaces/user";

// Importing: FontAwesome.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Importing: Icons.
import {
  faTrash,
  faPlusCircle,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";

// Importing: Styles.
import "./users.css";
import useUsers from "../../hooks/useUsers";

const initialUser = {
  fullname: "",
  identifier: "",
  married: "0000",
};

export default function UsersList() {
  // Declaring states.
  const [modal, setModal] = React.useState(false);
  const [hidden, setHidden] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [toDelete, setToDelete]: any = React.useState([]);
  const [editHidden, setEditHidden] = React.useState(true);
  const [nameToDelete, setNameToDelete] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState(initialUser);

  // Declaration spot.
  const display = hidden && editHidden ? "block" : "none";

  const getIcon = () => {
    if (toDelete.length) return faTrash;
    if (hidden && editHidden) return faPlusCircle;
    return faMinusCircle;
  };

  const rightIcon = (
    <div
      onClick={async () => await hiddenToggle()}
      style={{
        display: "flex",
        justifyContent: "right",
        width: hidden && editHidden ? "inherit" : "100%",
      }}
    >
      <FontAwesomeIcon icon={getIcon()} style={{ fontSize: 24, width: 25 }} />
    </div>
  );

  const onUserClick = async (user: UserInterface) => {
    const marriedId = user.married;
    const married = marriedId ? `${marriedId} ${user.marriedName}` : "0000";

    // Organizing the user's fields.
    await createOptions(user);
    const newUser = { ...user, married };

    // Updating the state variable.
    setSelectedUser(newUser);

    // Showing the modal.
    setEditHidden(false);
  };

  // Extracting from hooks.
  const { fetchUsers, users } = useUsers();
  const { createOptions, unmarriedUsers } = useUnmarriedUsers();

  const { header, list } = useCommonList({
    users,
    hidden,
    display,
    isLoading,
    rightIcon,
    onUserClick,
    setNameToDelete,
    selectedUsers: toDelete,
    setSelectedUsers: setToDelete,
  });

  React.useEffect(() => {
    console.log("always here");
    if (!isLoading) return;

    (async () => {
      fetchUsers();
      createOptions();
      setIsLoading(false);
    })();
  }, [isLoading, fetchUsers, createOptions]);

  const hiddenToggle = async () => {
    if (toDelete.length) return setModal(true);
    if (!editHidden) return setEditHidden(true);

    // Toggling add hidden.
    if (hidden) await createOptions();

    // Updating the state variable.
    setHidden(!hidden);
  };

  const getModalText = () => {
    const mapMessage: any = { 1: "?", 2: " e un altro utente?" };
    const basicMessage = ` e altri ${toDelete.length - 1} utenti?`;
    return mapMessage[toDelete.length] || basicMessage;
  };

  const onDelete = async () => {
    const payload = { identifiers: toDelete };
    await server("/api/users", "DELETE", payload);
    setToDelete([]);
    setModal(false);
    setNameToDelete("");
    setIsLoading(true);
  };

  return (
    <>
      {header}

      <Layout.Content style={{ height: "75vh" }}>
        {!hidden && (
          <AddUser
            hidden={hidden}
            users={unmarriedUsers}
            setIsLoading={setIsLoading}
          />
        )}

        {!editHidden && (
          <EditUser
            user={selectedUser}
            hidden={editHidden}
            setHidden={setEditHidden}
            setIsLoading={setIsLoading}
            unMarriedUsers={unmarriedUsers}
          />
        )}

        <Modal
          open={modal}
          onOk={onDelete}
          okText="Conferma"
          cancelText="Annulla"
          title="Elimina utenti"
          onCancel={() => setModal(false)}
        >
          Sei sicuro di voler eliminare {nameToDelete}
          {getModalText()}
        </Modal>

        {list}
      </Layout.Content>
    </>
  );
}
