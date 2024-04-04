// Importing: Server.
import { InputRef } from "antd";

// Importing: Interfaces.
import UserInterface from "../../interfaces/user";

const rules = [{ required: true, message: "" }];

export function focusManager(fullnameRef: React.RefObject<InputRef>) {
  fullnameRef.current!.focus({ cursor: "start" });
}

export function getClassName(hidden: boolean) {
  return `user__form ${hidden && "user__form-hidden"}`;
}

export function payloadOrganizer(values: onFormSubmitInterface) {
  const { fullname, identifier, married } = values;

  // Organizing payload.
  const payload = {
    fullname,
    identifier,
    married: married.split(" ")[0],
    participationDate: values.participationDate?.$d,
  };

  return payload;
} 

export interface onFormSubmitInterface extends UserInterface {
  participationDate: any;
}

export { rules };
