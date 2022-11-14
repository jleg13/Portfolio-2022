import React, { useState } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { ModalProps } from "../types";
import "../styles/Modal.css";

const ProjectPreviewModal = ({ open, onClose }: ModalProps) => {
  const [contentOpen, setContentOpen] = useState(false);
  
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
          <div className="modal-header">
            <h4>Projects</h4>
          </div>
          <div className="modal-body">This is modal content</div>
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
