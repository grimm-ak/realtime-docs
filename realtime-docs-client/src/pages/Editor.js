// src/pages/Editor.js

import { useParams } from "react-router-dom";
import TextEditor from "../components/TextEditor";

export default function Editor() {
  const { id } = useParams(); // 1

  return (
    <div style={{ height: "100vh" }}>
      <TextEditor documentId={id} />  {/* 2 */}
    </div>
  );
}
