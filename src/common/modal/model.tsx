import React, { ReactElement } from "react";

interface Props {
  label?: string;
  isOpen: boolean;
  childElement?: ReactElement;
}

const Modal: React.FC<Props> = ({ label, isOpen, childElement }) => {
  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="relative z-50 transform bg-white rounded-lg shadow-lg"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div>
              {childElement}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
