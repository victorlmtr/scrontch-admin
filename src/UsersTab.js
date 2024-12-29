import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8083/api/v1/users");
        setUsers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error fetching users: {error.message}</div>;

  return (
    <div>
      <h2>Users</h2>
      {/* Render users list here */}
    </div>
  );
};

export default UsersTab;
