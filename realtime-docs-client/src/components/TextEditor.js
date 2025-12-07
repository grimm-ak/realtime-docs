// src/components/TextEditor.js

import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

export default function TextEditor({ documentId }) {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  // 1. CONNECT TO SOCKET.IO
  useEffect(() => {
    const s = io("http://localhost:8080"); 
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // 2. LOAD DOCUMENT FROM SERVER
  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable(); // editor ready
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // 3. HANDLE INCOMING CHANGES
  useEffect(() => {
    if (!socket || !quill) return;

    socket.on("receive-changes", (delta) => {
      quill.updateContents(delta);
    });

    return () => socket.off("receive-changes");
  }, [socket, quill]);

  // 4. SEND CHANGES WHEN USER TYPES
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => quill.off("text-change", handler);
  }, [socket, quill]);

  // 5. AUTOSAVE EVERY 2 SECONDS
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 5000);

    return () => clearInterval(interval);
  }, [socket, quill]);

  // 6. SETUP QUILL EDITOR
  const editorRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, { theme: "snow" });
    q.disable();
    q.setText("Loading document...");
    setQuill(q);
  }, []);

  return <div className="container" ref={editorRef} style={{ height: "100%" }}></div>;
}
