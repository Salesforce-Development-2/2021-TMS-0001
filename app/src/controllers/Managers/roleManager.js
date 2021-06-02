const Role = require("../../models/role");

class RoleManager {
  async getUserRoleName(roleId) {
    const role = await Role.findById(roleId);
    return role.role_type;
  }
}

module.exports = new RoleManager();
