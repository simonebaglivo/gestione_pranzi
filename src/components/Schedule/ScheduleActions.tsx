// Importing: React.
import React from "react";

// Importing: Antd components.
import { Button } from "antd";

export default function ScheduleActions({
  week,
  list,
  insert,
  isError,
  setInsert,
  createSchedule,
}: scheduleActionInterface) {
  return (
    <>
      <div className={insert ? "" : "schedule__create"}>
        {insert ? (
          list
        ) : (
          <>
            <p>Non c'è un programma per questa settimana</p>
            <br />
            <Button
              size="large"
              type="primary"
              onClick={createSchedule}
              style={{ display: isError ? "none" : "initial" }}
            >
              GENERA
            </Button>
            <br />
            {week > -4 && week < 1 && (
              <Button
                size="large"
                type="default"
                className="button-default"
                onClick={() => setInsert(true)}
                style={{ display: isError ? "none" : "initial" }}
              >
                INSERISCI
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}

interface scheduleActionInterface {
  week: number;
  insert: boolean;
  isError: boolean;
  list: JSX.Element;
  createSchedule: () => Promise<void>;
  setInsert: React.Dispatch<React.SetStateAction<boolean>>;
}
