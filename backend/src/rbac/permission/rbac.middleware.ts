/*RBAC Logic in Plain English
1. Inside middleware:
2. Read user role
3. Fetch permissions for that role
4. If role is ADMIN → allow
5. If permission exists → allow
6. Else → deny
That’s the entire algorithm.*/ 

import { Request, Response, NextFunction } from "express";
import { ROLE_PERMISSIONS } from "./permission_role";

export function rbac(requiredPermission: string | string[]){
    return (req:Request, res:Response, next:NextFunction)=>{
        
        if(!req.user || !req.user.role){
            return res.status(401).json({
                message:"Unauthenticated"
            })
        }
        const role = req.user.role;
        const allowed_permission = ROLE_PERMISSIONS[role]

        console.log("=== RBAC DEBUG ===");
        console.log("User Role:", role);
        console.log("Required Permissions:", requiredPermission);
        console.log("User's Allowed Permissions:", allowed_permission);
        console.log("================");
        
        if(!allowed_permission){
            return res.status(403).json({
                message: "Role not allowed"
            })
        }
        if(allowed_permission.includes("*")){
            return next();
        }
        const permissions = Array.isArray(requiredPermission)
            ? requiredPermission
            : [requiredPermission];
        const hasPermission = permissions.some((prem) =>
            allowed_permission.includes(prem)
        );
        if(!hasPermission){
            return res.status(403).json({
                message:"Forbidden"
            })
        }
        next();
    }
}