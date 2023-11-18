import Swal from "sweetalert2";

export const showAlert = (
  title?: string,
  text?: string,
  icon?: "success" | "error" | "warning" | "info" | "question",
  position?:
    | "top"
    | "top-start"
    | "top-end"
    | "center"
    | "center-start"
    | "center-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end",
  allowOutsideClick?: boolean,
  
) => {
  Swal.fire({
    title: title || "",
    text: text || "",
    icon: icon || undefined,
    position: position || "center",
    confirmButtonText: "確定",
    allowOutsideClick:
      allowOutsideClick !== undefined ? allowOutsideClick : true,
  });
};
