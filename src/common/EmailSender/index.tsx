import Image from "next/image";
import React, { useState } from "react";

interface IProps {
  handleSend?: (tag: string[]) => void;
  customClasses?: string;
  disabled?: boolean;
}
const EmailSenderComponent: React.FC<IProps> = ({
  handleSend,
  customClasses,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>("");

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setIsValidEmail(true);
      setValidationMessage("");
    }
  };

  const handleClose = () => {
    setTags([]);
    setIsOpen(!isOpen);
  };

  const onSend = () => {
    if (handleSend) {
      handleSend(tags);
      setIsOpen(false);
    }
    setTags([]);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const message = isValidEmailFormat(email);
      if (!message) {
        setTags([...tags, email]);
        setEmail("");
      } else {
        setValidationMessage(message);
      }
    }
  };

  const isValidEmailFormat = (email: string): string => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
    return "";
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  return (
    <React.Fragment>
      <Image
        alt="email"
        src="/assets/icons/noun-email-6146813.svg"
        width={25}
        height={25}
        title="Mail"
        onClick={handleOpen}
        aria-disabled={disabled}
        className={`cursor-pointer ${disabled ? "disabled-toggle" : ""}`}
      />
      {isOpen && (
        <div
          className={`${customClasses} absolute z-10 w-[470px] h-auto bg-white shadow-style p-2 rounded-xl border border-gray-300`}
        >
          <div className="flex ml-2 mt-8 mb-4 z-10 relative">
            <div className="mt-3 font-archivo">Email to:</div>
            <div className="ml-2">
              <input
                type="email"
                placeholder="Write email and press enter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className={`w-[250px] font-archivo rounded-md bg-white ${
                  isValidEmail ? "" : "border-red-500"
                }`}
              />
              {validationMessage && (
                <p className="text-red text-sm mt-1">{validationMessage}</p>
              )}
            </div>
            <div className="cursor-pointer">
              <button
                disabled={tags.length === 0}
                onClick={() => onSend()}
                className={`bg-violet font-archivo cursor-pointer text-white rounded-md px-3 py-3 ml-4
                ${tags.length === 0 ? "disabled-select" : ""}
                `}
              >
                Send
              </button>
            </div>
          </div>
          {tags.length > 0 && (
            <div className="ml-16  mt-4">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="input-tag-style m-1 cursor-pointer px-1 py-2 rounded-full flex items-center"
                >
                  <span className="mr-1 font-Archivo">{tag}</span>
                  <button
                    type="button"
                    className="focus:outline-none"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <div className="bg-transparent mt-1">
                      <Image
                        src="/assets/icons/Vector.svg"
                        alt="tag"
                        width={10}
                        height={10}
                        className="cursor-pointer"
                      />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="absolute right-0 top-1 cursor-pointer">
            <Image
              src="/assets/icons/circle-xmark.png"
              alt="circle"
              width={20}
              height={20}
              className="right-4 mr-4 mt-2"
              onClick={handleClose}
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default EmailSenderComponent;
