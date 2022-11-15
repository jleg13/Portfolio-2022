import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";
// import gfm from "remark-gfm";
import { CSSTransition } from "react-transition-group";
import { ModalProps } from "../types";
import "../styles/Modal.css";

const ProjectPreviewModal = ({ open, onClose, activeRepo }: ModalProps) => {
  const [contentOpen, setContentOpen] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (open) {
      fetch(
        `https://raw.githubusercontent.com/jleg13/${activeRepo.name}/${activeRepo.branch}/README.md`
      )
        .then((res) => res.text())
        .then((text) => {
          setContent(text);
        });
    }
  }, [open, activeRepo]);

  return ReactDOM.createPortal(
    <CSSTransition
      classNames={"modal-transition"}
      in={open}
      unmountOnExit
      timeout={800}
      onEntered={() => setContentOpen(true)}
      onExit={() => setContentOpen(false)}
    >
      <div className={"modal"} onClick={onClose}>
        <div
          className={`${
            contentOpen ? "modal-content--active" : "modal-content"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-body">
            <ReactMarkdown children={content} />
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="modal-close-button">
              Close
            </button>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")!
  );
};

export default ProjectPreviewModal;
