import { message } from "antd";

const [messageApi, contextHolder] = message.useMessage();
const MessageBox = (messageText, varient) => {
  messageApi.open({
    type: varient,
    content: messageText,
  });
  return { contextHolder };
};

export { MessageBox };
