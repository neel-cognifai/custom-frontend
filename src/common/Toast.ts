import { toast, ToastOptions, ToastContent } from "react-toastify";

const Toast = (message: ToastContent, options: ToastOptions) => {
  toast(message, { ...options });
};

export default Toast;
