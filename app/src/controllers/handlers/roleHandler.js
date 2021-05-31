const Role = require("../../models/role");

class RoleHandler {
  async getUserRoleName(roleId) {
    const role = await Role.findById(roleId);
    return role.role_type;
  }
}

module.exports = new RoleHandler();
