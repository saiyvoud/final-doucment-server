import { EMessage, PermissionRole, RoleUser } from "../service/message.js";
import { SendError } from "../service/response.js";
import { CheckRoleInPermissionRole, CheckRoleInPermissionUser, FindOneRole, VerifyToken } from "../service/service.js";

export const auth = async (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if (!authorization) {
            return SendError(res, 401, EMessage.Unaunthorization);
        }
        const token = authorization.replace("Bearer ", "");
        const verify = await VerifyToken(token);
        if (!verify) {
            return SendError(res, 401, EMessage.Unaunthorization);
        }
        req.user = verify;
        next();
    } catch (error) {
        return SendError(res, 500, EMessage.ServerInternal, error);
    }
};

export const authAdmin = async (req, res, next) => {
    try {
        const role_id = req.user.role_id;
        const role = await FindOneRole(role_id)
        if (role.name !== RoleUser.admin) {
            return SendError(res, 404, EMessage.Unaunthorization)
        }
        next();
    } catch (error) {
        return SendError(res, 500, EMessage.ServerInternal, error);
    }
};
export const checkPermission = async (req, res, next) => {
    // try {
    //     const role_id = req.user.role_id;
    //     const permission = await CheckRoleInPermissionRole(role_id)
    //     if (permission.permission_name !== PermissionRole.insert) {
    //         return SendError(res, 404, EMessage.Unaunthorization)
    //     }
    //     next();
    // } catch (error) {
    //     return SendError(res, 500, EMessage.ServerInternal, error);
    // }
    try {
        const user_id = req?.user?.user_id;
        const method = req?.method;
        const x = await CheckRoleInPermissionUser(user_id, method);
        if (x) {
            next();
        } else {
            return SendError(res, 403, EMessage.NotFound, error);
        }
    } catch (error) {
        return SendError(res, 403, EMessage.NotFound, error);
    }
};

export const authStaff = async (req, res, next) => {
    try {
        const role_id = req.user.role_id;
        const role = await FindOneRole(role_id)
        if (role.name !== RoleUser.staff) {
            return SendError(res, 404, EMessage.Unaunthorization)
        }
        next();
    } catch (error) {
        return SendError(res, 500, EMessage.ServerInternal, error);
    }
};