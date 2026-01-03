"use strict";
/*RBAC Logic in Plain English
1. Inside middleware:
2. Read user role
3. Fetch permissions for that role
4. If role is ADMIN → allow
5. If permission exists → allow
6. Else → deny
That's the entire algorithm.*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbac = rbac;
const permission_role_1 = require("./permission.role");
function rbac(requiredPermission) {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: "Unauthenticated"
            });
        }
        const role = req.user.role;
        const allowed_permission = permission_role_1.ROLE_PERMISSIONS[role];
        if (!allowed_permission) {
            return res.status(403).json({
                message: "Role not allowed"
            });
        }
        if (allowed_permission.includes("*")) {
            return next();
        }
        const permissions = Array.isArray(requiredPermission)
            ? requiredPermission
            : [requiredPermission];
        const hasPermission = permissions.some((prem) => allowed_permission.includes(prem));
        if (!hasPermission) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
        next();
    };
}
//# sourceMappingURL=rbac.middleware.js.map