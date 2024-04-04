// Importing: React.
import React from "react";

// Importing: Api.
import server from "../../api/server";

// Importing: Project components.
import ScheduleActions from "./ScheduleActions";

// Importing: Interfaces.
import UserInterface from "../../interfaces/user";

// Importing: Hooks.
import useUsers from "../../hooks/useUsers";
import useCommonList from "../../hooks/useCommonList";

// Importing: Antd components.
import { Button, Layout, List, Modal } from "antd";

// Importing: Scripts.
import { getNextMonday } from "../../scripts/getNextMonday";

// Importing: Icons.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBan,
  faSave,
  faArrowLeft,
  faArrowRight,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

// Importing: Styles.
import "./schedule.css";

export default function Schedule() {
  // Declaring States.
  const [week, setWeek] = React.useState(0);
  const [modal, setModal] = React.useState(false);
  const [insert, setInsert] = React.useState(false);
  const [schedule, setSchedule] = React.useState([]);
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const [deleteHeader, setDeleteHeader] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(getNextMonday(week));

  // Declaration spot.
  const onUserClick = async (user: UserInterface) => {};

  // Extracting from hooks.
  const { getUsers, users } = useUsers();

  const { header, list } = useCommonList({
    users,
    onUserClick,
    selectedUsers,
    hidden: false,
    display: "block",
    isLoading: false,
    setSelectedUsers,
    rightIcon: <></>,
  });

  React.useEffect(() => {
    // Returning if there are already the right schedule.
    if (!isLoading) return;

    (async () => {
      getUsers();
      fetchSchedule(week);
    })();
  }, [week, isLoading, getUsers]);

  const fetchSchedule = async (week: number) => {
    const data = await server(`/api/schedules?week=${week}`, "GET");

    if (data[0].error) {
      setSchedule([]);
      return setIsError(true);
    }

    // Setting users in the state variable.
    setSchedule(data[0].schedules);

    // Updating Loading.
    setIsError(false);
    setIsLoading(false);
  };

  const createSchedule = async () => {
    await server("/api/schedules", "POST", { week });

    // Updating list.
    setIsLoading(true);
  };

  const changeWeek = async (newWeek: number) => {
    setWeek(newWeek);
    setIsLoading(true);
    setCurrentDate(getNextMonday(newWeek));
  };

  const getIcon = (icon?: IconDefinition) => {
    if (!icon) return;
    return <FontAwesomeIcon icon={icon} style={{ fontSize: "24px" }} />;
  };

  const onCreate = async () => {
    const payload = { users: selectedUsers };
    await server(`/api/schedules?week=${week}`, "POST", payload);
    await fetchSchedule(week);
    setInsert(false);
    // setSelectedUsers([]);
  };

  const onActionClick = async (plus?: boolean, saveIcon?: boolean | 0) => {
    if (saveIcon) return await onCreate();
    if (insert) return setInsert(false);
    const currentWeek = plus ? week + 1 : week - 1;
    changeWeek(currentWeek);
  };

  const ArrowButton = ({
    icon,
    plus,
    disabled,
    className,
  }: arrowButtonInterface) => {
    const { length } = selectedUsers;
    const rightIcon = icon === faSave && length;
    const saveIcon = rightIcon && length === 15;

    if (rightIcon && length !== 15) {
      return (
        <span style={{ fontSize: 24, marginLeft: 0, width: 23 }}>
          {selectedUsers.length}
        </span>
      );
    }

    return (
      <Button
        type="link"
        disabled={disabled}
        className={className}
        onClick={async () => await onActionClick(plus, saveIcon)}
        style={{ color: "white", paddingLeft: 0, paddingRight: 0 }}
      >
        {getIcon(icon)}
      </Button>
    );
  };

  const onHeaderClick = () => {
    if (!schedule.length) return;
    setDeleteHeader(!deleteHeader);
    if (deleteHeader) setModal(true);
  };

  const getRightIcon = () => {
    if (insert) return faSave;
    if (week > 10) return faBan;
    return faArrowRight;
  };

  const getHeader = () => {
    if (insert) return header;
    if (deleteHeader) return "Elimina programma";
    return currentDate;
  };

  return (
    <>
      <Layout.Header className="bit-header">
        <div>
          <ArrowButton className="back" icon={faArrowLeft} />
          <span style={{ textTransform: "capitalize" }} onClick={onHeaderClick}>
            {getHeader()}
          </span>

          <ArrowButton
            plus
            className="next"
            icon={getRightIcon()}
            disabled={week > 10 || false}
          />
        </div>
      </Layout.Header>

      <Modal
        open={modal}
        onOk={onCreate}
        okText="Conferma"
        cancelText="Annulla"
        title="Elimina programma"
        onCancel={() => {
          setModal(false);
          setDeleteHeader(false);
        }}
      >
        Sei sicuro di voler procedere?
      </Modal>

      <Layout.Content style={{ height: "75vh" }}>
        {schedule.length ? (
          <List
            className="content content__userslist"
            loading={isLoading}
            dataSource={schedule}
            renderItem={(user: UserInterface) => (
              <List.Item>
                <List.Item.Meta
                  title={user.fullname}
                  avatar={user.identifier}
                />
              </List.Item>
            )}
          />
        ) : (
          <ScheduleActions
            week={week}
            list={list}
            insert={insert}
            isError={isError}
            setInsert={setInsert}
            createSchedule={createSchedule}
          />
        )}
      </Layout.Content>
    </>
  );
}

interface arrowButtonInterface {
  plus?: boolean;
  className: string;
  disabled?: boolean;
  icon?: IconDefinition;
}
