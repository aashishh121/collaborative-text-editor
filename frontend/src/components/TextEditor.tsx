import React, { useEffect, useReducer, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/TextEditor.css";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"],
  ["image", "blockquote", "code-block"],
  ["link", "image", "video", "formula"],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }],
  [{ font: [] }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["clean"],
];

function TextEditor() {
  const { id } = useParams();
  const [socket, setSocket] = useState<any>();

  const quillRef: any = useRef(null);

  useEffect(() => {
    const sokt = io("http://localhost:5000");
    setSocket(sokt);

    if (quillRef) {
      console.log("loading");
      quillRef.current.getEditor().disable();
      quillRef.current.getEditor().setText("Documents Loading....");
    }

    return () => {
      sokt.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quillRef.current == null) return;

    socket.once("load-document", (document: any) => {
      quillRef.current.getEditor().setContents(document);
      quillRef.current.getEditor().enable();
    });

    socket.emit("get-documentbyid", id);
  }, [socket, quillRef, id]);

  useEffect(() => {
    if (socket == null || quillRef.current == null) return;

    //intervaltime to save changes of documents
    const intervalTimer = setInterval(() => {
      socket.emit(
        "save-docschanges",
        quillRef.current.getEditor().getContents()
      );
    }, 2000);

    //send realtime changes to the server
    const scoketHandler = (delta: any, oldDelta: any, source: any) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quillRef.current.getEditor().on("text-change", scoketHandler);

    //recieve changes to the client from serve
    const handler = (delta: any) => {
      quillRef.current.getEditor().updateContents(delta);
    };

    socket.on("recieve-changes", handler);

    return () => {
      clearInterval(intervalTimer);
      quillRef.current.getEditor().off("text-change", scoketHandler);
      socket.off("recieve-changes", handler);
    };
  }, [socket, quillRef]);

  return (
    <>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={{ toolbar: toolbarOptions }}
      />
    </>
  );
}

export default TextEditor;
