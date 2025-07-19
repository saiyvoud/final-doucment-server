
export const RoleUser = {
  general: "general",
  admin: "admin",
  staff: "staff"
}
// export const StatusDocument = {
//   await: "await",
//   padding: "padding",
//   success: "success",
//   cancel: "cancel"
// }

export const StatusDocument = {
  await: "ລໍຖ້າ",
  padding: "ກຳລັງດຳເນີນການ",
  success: "ສຳເລັດ",
  cancel: "ຍົກເລີກ",
}
export const FollowDocument = {
  await: "ພະແນກຂາເຂົ້າ-ຂາອອກ",
  progress: "ເລຂາອະທິການ",
  padding: "ອະທິການຫລືຮອງ",
  continue: "ກັບຄືນໄປທີ່ເລຂາອະທິການ",
  success: "ກັບມາທີ່ພະແນກຂາເຂົ້າ-ຂາອອກ",
  done: "ມາຮັບເອກະສານແລ້ວ",
 
}
export const PermissionRole = {
  insert: "INSERT",
  update: "UPDATE",
  delete: "DELETE",
  select: "SELECT"
}
export const SMessage = { // success message
  Register: "Register Success",
  Login: "Login Success",
  SelectAll: "Select All Success",
  SelectOne: "Select One Success",
  Insert: "Insert Success",
  Update: "Update Success",
  Delete: "Delete Success",
  Already: "Already",
  Search: "Search Success"
}
export const EMessage = { // Error Message
  BadRequest: "BadRequest",
  NotFound: "Not Found",
  Unaunthorization: "Unaunthorization",
  NotMatch: "Not Match",
  EInsert: "Error Insert",
  EUpdate: "Error Update",
  EDelete: "Error Delete",
  ESelectAll: "Error Select All",
  ESelectOne: "Error Select One",
  ServerInternal: "Error Server Internal"
}