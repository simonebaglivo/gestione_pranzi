// Importing: React.
import React, { useRef } from "react";

// Importing: Server.
import server from "../../api/server";

// Importing: Interfaces.
import UserInterface from "../../interfaces/user";

// Importing: FontAwesome.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Importing: Icons.
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// Importing: Commons.
import {
  rules,
  focusManager,
  getClassName,
  payloadOrganizer,
  onFormSubmitInterface,
} from "./Form.common";

// Importing: Ant components.
import {
  Col,
  Row,
  Form,
  Input,
  Button,
  Select,
  InputRef,
  DatePicker,
} from "antd";

// Importing: Styles.
import "./users.css";

export default function AddUser({ hidden, users, setIsLoading }: AddUserProps) {
  // Declaration spot.
  const action = "add";
  const [form] = Form.useForm();
  const fullnameRef = useRef<InputRef>(null);

  React.useEffect(() => {
    console.log("always here");
    form.resetFields();
    focusManager(fullnameRef);
  }, [form, users]);

  const onFormSubmit = async (values: onFormSubmitInterface) => {
    const payload = payloadOrganizer(values);
    await server("/api/users", "POST", payload);

    // Updating the users list.
    setTimeout(() => {
      setIsLoading(true);
    }, 1000);
  };

  return (
    <div className={getClassName(hidden)}>
      <Form
        form={form}
        hidden={hidden}
        name={`${action}user`}
        style={{ height: "100%" }}
        initialValues={{ married: "0000" }}
        onFinish={(values) => onFormSubmit(values)}
      >
        <div className="user__form__items">
          <div>
            <Form.Item rules={rules} name="fullname" label="Nome e cognome">
              <Input type="text" ref={fullnameRef} />
            </Form.Item>

            <Row align={"middle"}>
              <Col xs={8}>
                <Form.Item rules={rules} label="Codice" name="identifier">
                  <Input type="text" />
                </Form.Item>
              </Col>

              <Col xs={15} offset={1}>
                <Form.Item label="Ultima presenza" name="lastParticipation">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Inserisci data"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="married" label="Sposata con">
              <Select showSearch placeholder="Single" options={users} />
            </Form.Item>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginBottom: 10 }}
          >
            CONFERMA{" "}
            <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: 10 }} />
          </Button>
        </div>
      </Form>
    </div>
  );
}

interface AddUserProps {
  hidden: boolean;
  users: Array<UserInterface>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
