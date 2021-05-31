const User = require("../../models/user");
const Role = require("../../models/role");
class UserHandler {
  async getUserRole(role_type) {
    role = await Role.findOne({ role_type: role_type });
  }
  async createUser(user) {
    // Create a new user with the data from the request body
    const user = new User({
      firstname: user.firstname,
      lastname: user.lastname,
      password: bcrypt.hashSync(user.password, 10),
      email: user.email,
      role_type: await this.getUserRole(user.role_type).id,
      date_created: Date.now(),
    });

    // Save the user in the database
    // Save the user in the database

    const savedUser = await user.save();

    return savedUser;
  }
  async editUser(user) {}
  async getUserByEmail(email) {
    // Check if the email already exist in the database
    const emailExists = await User.findOne({ email: email });
    return emailExists;
  }
}
module.exports = new UserHandler();
