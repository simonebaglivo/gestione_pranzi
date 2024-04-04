// Importing: React.
import React from "react";

// Importing: Server.
import server from "../api/server";

export default function useUsers() {
  // Declaring States.
  const [users, setUsers] = React.useState([]);

  const getUsers = async () => {
    if (users.length) return users;
    return await fetchUsers();
  };

  const fetchUsers = async () => {
    const data = await server("/api/users", "GET");

    // DON'T REMOVE.
    console.log("");
    setUsers(data[0].users);
    return data[0].users;
  };

  return { users, getUsers, fetchUsers };
}
