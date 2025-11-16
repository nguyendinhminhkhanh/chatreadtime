import React from "react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/userAuthStore";
import { useNavigate } from "react-router";

const Logout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error( "lõi" ,error);
    }
  };
  return <Button onClick={handleLogout}>Đăng xuất</Button>;
};

export default Logout;
