"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = void 0;
const permission_1 = require("./permission");
exports.ROLE_PERMISSIONS = {
    ADMIN: ["*"],
    USER: [
        permission_1.PERMISSIONS.PROFILE_VIEW_OWN,
        permission_1.PERMISSIONS.PROFILE_UPDATE_OWN,
        permission_1.PERMISSIONS.TEST_VIEW,
        permission_1.PERMISSIONS.BOOKING_CREATE,
        permission_1.PERMISSIONS.BOOKING_VIEW_OWN,
        permission_1.PERMISSIONS.PAYMENT_CREATE,
        permission_1.PERMISSIONS.PAYMENT_VIEW_OWN,
        permission_1.PERMISSIONS.REPORT_VIEW_OWN,
    ],
    LAB_STAFF: [
        permission_1.PERMISSIONS.PROFILE_VIEW_OWN,
        permission_1.PERMISSIONS.PROFILE_UPDATE_OWN,
        permission_1.PERMISSIONS.TEST_VIEW,
        permission_1.PERMISSIONS.BOOKING_VIEW_ALL,
        permission_1.PERMISSIONS.REPORT_UPLOAD,
        permission_1.PERMISSIONS.REPORT_VIEW_ALL,
    ],
};
//# sourceMappingURL=permission.role.js.map