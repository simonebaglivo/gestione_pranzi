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

export default function EditUser({
  user,
  hidden,
  setHidden,
  setIsLoading,
  unMarriedUsers,
}: EditUserProps) {
  // Declaration spot.
  const action = "edit";
  const [form] = Form.useForm();
  const fullnameRef = useRef<InputRef>(null);

  React.useEffect(() => {
    console.log("always here");
    form.resetFields();
    focusManager(fullnameRef);
  }, [form, unMarriedUsers]);

  const onFormSubmit = async (values: onFormSubmitInterface) => {
    const payload: any = payloadOrganizer(values);
    const originalMarried = user.married.split(" ")[0];

    if (originalMarried !== payload.married && payload.married !== "000") {
      payload.originalMarried = originalMarried;
    }

    await server(`/api/users/${user._id}`, "PATCH", payload);

    setTimeout(() => {
      setIsLoading(true);

      // Closing modal.
      setHidden(true);
    }, 1000);
  };

  return (
    <>
      <div className={getClassName(hidden)}>
        <Form
          form={form}
          hidden={hidden}
          name={`${action}user`}
          style={{ height: "100%" }}
          onFinish={(values) => onFormSubmit(values)}
          initialValues={{
            married: user.married,
            fullname: user.fullname,
            identifier: user.identifier,
          }}
        >
          <div className="adduser__form__items">
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
                <Select
                  showSearch
                  placeholder="Single"
                  options={unMarriedUsers}
                />
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
    </>
  );
}

interface EditUserProps {
  hidden: boolean;
  user: UserInterface;
  unMarriedUsers: { value: string; label: string }[];
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
