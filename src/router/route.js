import express from "express"
import FacultController from "../controller/faculty.js";
import OfficeController from "../controller/office.js";
import PartDemandController from "../controller/partDemand.js";
import PartSuppileController from "../controller/partSuppile.js";
import DocumentInController from "../controller/documentIn.js";
import DocumentOutController from "../controller/documentOut.js";
import PermissionController from "../controller/permmision.js";
import PermissionRoleController from "../controller/permmision_role.js";
import PermissionUserController from "../controller/permission_user.js";

import RoleController from "../controller/role.js";
import RoleUserController from "../controller/roleUser.js";
import UserController from "../controller/user.js";
import { auth, authAdmin, checkPermission } from "../middleware/auth.js";
import dashboard from "../controller/dashboard.js";
import ReportController from "../controller/report.js";
import DocumentTypeController from "../controller/docType.js";
import FollowDocumentInController from "../controller/follow.js";
import FollowDocumentOutController from "../controller/followDocumentOut.js";
const router = express.Router();

// --- Dashboard ----
router.get("/dashboard", auth, authAdmin, dashboard)

// --- User ----
router.post("/user/register", UserController.Register);
router.post("/user/login", UserController.Login);
router.get("/user/selAll", auth, authAdmin, checkPermission, UserController.SelectAll)
router.put("/user/update/:user_id", auth, authAdmin, checkPermission, UserController.UpdateUser)
router.get("/user/allUserRolePermission", auth, authAdmin, checkPermission, UserController.SelectAllUserWithRoleAndPermission)

// ---- Role -----
router.get("/role/selAll", RoleController.SelectAll);
router.post("/role/insert", RoleController.Insert);
// ----- Role user ----
router.post("/role_user/insert", auth, authAdmin, checkPermission, RoleUserController.Insert)
router.get("/role_user/selAll", auth, authAdmin, checkPermission, RoleUserController.SelectAll)
router.put("/role_user/update", auth, authAdmin, RoleUserController.Update)

// ----- Permission ----
router.post("/permission/insert", auth, authAdmin, checkPermission, PermissionController.Insert)
router.get("/permission/selAll", auth, authAdmin, checkPermission, PermissionController.SelectAll)

router.put("/permission/update", auth, authAdmin, checkPermission, PermissionUserController.Update)
// ----- Permission Role ----
router.post("/permission_role/insert", auth, authAdmin, checkPermission, PermissionRoleController.Insert)
router.get("/permission_role/selAll", auth, authAdmin, checkPermission, PermissionRoleController.SelectAll)
//------ Faculty ------
router.get("/faculty/selAll", auth, checkPermission, FacultController.SelectAll);
router.get("/faculty/selOne/:faculty_id", auth, checkPermission, FacultController.SelectOne);
router.post("/faculty/insert", auth, checkPermission, FacultController.Insert);
router.put("/faculty/update/:faculty_id", auth, checkPermission, FacultController.UpdateFaculty);
router.delete("/faculty/delete/:faculty_id", auth, checkPermission, FacultController.DeleteFaculty);
//------ Office ------
router.get("/office/selAll", auth, checkPermission, OfficeController.SelectAll);
router.get("/office/selOne/:office_id", auth, checkPermission, OfficeController.SelectOne);
router.post("/office/insert", auth, checkPermission, OfficeController.Insert);
router.put("/office/update/:office_id", auth, checkPermission, OfficeController.UpdateOffice);
router.delete("/office/delete/:office_id", auth, checkPermission, OfficeController.DeleteOffice);
//------ Part Demand ------
router.get("/part_demand/selAll", auth, checkPermission, PartDemandController.SelectAll);
router.get("/part_demand/selOne/:part_demand_id", auth, checkPermission, PartDemandController.SelectOne);
router.post("/part_demand/insert", auth, checkPermission, PartDemandController.Insert);
router.put("/part_demand/update/:part_demand_id", auth, checkPermission, PartDemandController.UpdatePartDemand);
router.delete("/part_demand/delete/:part_demand_id", auth, checkPermission, PartDemandController.DeletePartDemend);
//------ Part Suppile ------
router.get("/part_suppile/selAll", auth, checkPermission, PartSuppileController.SelectAll);
router.get("/part_suppile/selOne/:part_suppile_id", auth, checkPermission, PartSuppileController.SelectOne);
router.post("/part_suppile/insert", auth, checkPermission, PartSuppileController.Insert);
router.put("/part_suppile/update/:part_suppile_id", auth, checkPermission, PartSuppileController.UpdatePartSuppile);
router.delete("/part_suppile/delete/:part_suppile_id", auth, checkPermission, PartSuppileController.DeletePartSuppile);
//------ Document In ------
router.get("/document_in/search", DocumentInController.Search);
router.get("/document_in/selAll", DocumentInController.SelectAll);
router.get("/document_in/selOne/:document_in_id", auth, checkPermission, DocumentInController.SelectOne);
router.post("/document_in/insert", auth, checkPermission, DocumentInController.Insert);
router.put("/document_in/update/:document_in_id", auth, checkPermission, DocumentInController.UpdateDocumentIn);
router.put("/document_in/updateStatus/:document_in_id", auth, checkPermission, DocumentInController.UpdateStatus);
router.delete("/document_in/delete/:document_in_id", auth, checkPermission, DocumentInController.DeleteDocumentIn);
//------ Document Out ------
router.get("/document_out/search", DocumentOutController.Search);
router.get("/document_out/selAll", DocumentOutController.SelectAll);
router.get("/document_out/selOne/:document_out_id", auth, checkPermission, DocumentOutController.SelectOne);
router.post("/document_out/insert", auth, checkPermission, DocumentOutController.Insert);
router.put("/document_out/update/:document_out_id", auth, checkPermission, DocumentOutController.UpdateDocumentOut);
router.put("/document_out/updateStatus/:document_out_id", auth, checkPermission, DocumentOutController.UpdateStatus);
router.delete("/document_out/delete/:document_out_id", auth, checkPermission, DocumentOutController.DeleteDocumentOut);
//------ Document Type ------
router.get("/document_type/selAll", DocumentTypeController.SelectAll);
router.get("/document_type/selOne/:document_type_id", auth, checkPermission, DocumentTypeController.SelectOne);
router.post("/document_type/insert", auth, checkPermission, DocumentTypeController.Insert);
router.put("/document_type/update/:document_type_id", auth, checkPermission, DocumentTypeController.UpdateDocumentType);
router.delete("/document_type/delete/:document_type_id", auth, checkPermission, DocumentTypeController.DeleteDocumentType);
//---- Report ----
router.get("/report/selAll", auth, authAdmin, ReportController.reportPadding);
//---- Follow document in ---
router.get("/follow_document_in/selAll", FollowDocumentInController.SelectAll);
router.get("/follow_document_in/selBy/:document_in_id", FollowDocumentInController.SelectBy);
router.get("/follow_document_in/selOne/:follow_document_in_id", auth, checkPermission, FollowDocumentInController.SelectOne);
router.post("/follow_document_in/insert", auth, checkPermission, FollowDocumentInController.Insert);
router.put("/follow_document_in/update/:follow_document_in_id", auth, checkPermission, FollowDocumentInController.Update);
router.delete("/follow_document_in/delete/:follow_document_in_id", auth, checkPermission, FollowDocumentInController.Delete);
//---- Follow document out ---
router.get("/follow_document_out/selAll", FollowDocumentOutController.SelectAll);
router.get("/follow_document_out/selBy/:document_out_id", FollowDocumentOutController.SelectBy);
router.get("/follow_document_out/selOne/:follow_document_out_id", auth, checkPermission, FollowDocumentOutController.SelectOne);
router.post("/follow_document_out/insert", auth, checkPermission, FollowDocumentOutController.Insert);
router.put("/follow_document_out/update/:follow_document_out_id", auth, checkPermission, FollowDocumentOutController.Update);
router.delete("/follow_document_out/delete/:follow_document_out_id", auth, checkPermission, FollowDocumentOutController.Delete);
export default router;
