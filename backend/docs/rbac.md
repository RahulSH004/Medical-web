1. Roles

Each user has exactly one role.

USER        (Patient)
LAB_STAFF
DOCTOR
ADMIN

Resources

Resources represent business entities or system capabilities.

AUTH            (login, register)
USER_PROFILE    (personal information)
TEST_CATALOG    (available diagnostic tests)
BOOKING         (appointments)
REPORT          (test reports / PDFs)
PAYMENT         (billing, invoices)
SYSTEM          (users, roles, audit)

3. Permissions

Permissions follow the format:

action:resource

Authentication (Documented Only — Public Routes)
auth:register
auth:login


RBAC is not enforced on these by default.