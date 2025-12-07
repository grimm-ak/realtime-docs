// src/pages/Home.js

import { v4 as uuidV4 } from "uuid";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = uuidV4();
    navigate(`/docs/${id}`);
  }, [navigate]);
  

  return null; // 3
}
