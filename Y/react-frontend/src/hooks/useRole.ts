import { useState, useEffect } from "react";
import axios from "axios";

export const useRole = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get("http://10.2.2.63:5000/protected", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const parts = response.data.message.split(", ");
        // Extract the role and remove the "Role: " prefix
        const fetchedRole = parts[2].replace("Role: ", "").trim(); // Clean the role
        setRole(fetchedRole); // Set the cleaned role
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRole();
  }, []);

  return role;
};
