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

// showAlert("🚨系統提醒", "註冊成功", "success");
// showAlert("🚨系統提醒", "請輸入有效的數字...");

// 以下為兩階段 button alert
// Swal.fire({
//   title: "確定要刪除任務嗎？",
//   html: "<strong style='color: red;'>此操作將清空所有已填寫的資訊</strong>",
//   icon: "warning",
//   showCancelButton: true,
//   confirmButtonText: "確定",
//   cancelButtonText: "取消",
//   reverseButtons: true,
//   allowOutsideClick: false,
//   background: "#ffe4e6",
// }).then((result) => {
//   if (result.isConfirmed) {
//     Swal.fire({
//       title: "已刪除",
//       text: "任務資訊已清空",
//       icon: "success",
//       timer: 1500,
//       timerProgressBar: true,
//       showConfirmButton: false,
//       allowOutsideClick: false,
//     });
//     resetFormFields();
//   }
// });
