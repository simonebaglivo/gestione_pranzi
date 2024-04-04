// Importing: React.
import React from "react";

// Importing: Server.
import server from "../api/server";

// Importing: Interfaces.
import UserInterface from "../interfaces/user";

export default function useUnmarriedUsers() {
  // Declaring Memo.
  const initialUser = React.useMemo(
    () => [{ value: "0000", label: "Non Selezionato" }],
    []
  );

  // Declaring States.
  const [unmarriedUsers, setUnmarriedUsers]: any[] = React.useState([]);

  async function createOptions(user?: UserInterface) {
    const newUsers = [...initialUser];
    const unMarried = await loadUsers(user?._id);
    const userValue = `${user?.married} ${user?.marriedName}`;
    const marriedUser = { label: user?.marriedName || "", value: userValue };

    unMarried.map((unMarriedUser: UserInterface) => {
      return newUsers.push({
        label: unMarriedUser.fullname,
        value: `${unMarriedUser._id} ${unMarriedUser.fullname}`,
      });
    });

    setUnmarriedUsers(newUsers);
    if (!user?.married) return newUsers;

    // Adding also the married user.
    newUsers.splice(1, 0, marriedUser);

    // Returning the spliced array.
    return newUsers;
  }

  async function loadUsers(id: string = "0000") {
    const json = await server(`/api/users/unmarried/${id}`, "GET");

    // Setting value in the state variable.
    setUnmarriedUsers(json[0]);

    // Returning for the createOptions call.
    return json[0];
  }

  return { unmarriedUsers, createOptions };
}
