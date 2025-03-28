import { Modal, message } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../Firebase/firebase";

const UserDetailModal = ({
  isModalOpen,
  setIsModalOpen,
  modalData,
  userID,
}) => {
  const { title, state } = modalData;
  const [value, setValue] = useState("");
  const [messageAPI, context] = message.useMessage();
  const sendMessage = (varient, messageText) => {
    messageAPI.open({
      type: varient,
      content: messageText,
    });
  };
  const userRef = doc(db, "UserDB", `${userID}`);
  const handleOk = async () => {
    if (state === value) {
      let varient = "error";
      let messageText = "Update Details !!!";
      sendMessage(varient, messageText);
      setValue("");
      return;
    }
    await updateDoc(userRef, {
      [title]: value,
    })
      .then(() => {
        let varient = "success";
        let messageText = "Please SigIn again to reflect updated Details";
        sendMessage(varient, messageText);
        setValue("");
      })
      .catch((err) => {
        let varient = "error";
        let messageText = err.message;
        sendMessage(varient, messageText);
        setValue("");
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setValue("");
  };

  return (
    <>
      <Modal
        title={`Update User ${title}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {context}
        <div className="d-flex justify-content-between mx-2 mb-2">
          <span>{title}:</span>
          <span>{state === undefined ? `not found` : state}</span>
        </div>
        <input
          placeholder={`Please enter ${title}`}
          className="form-control"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default UserDetailModal;
