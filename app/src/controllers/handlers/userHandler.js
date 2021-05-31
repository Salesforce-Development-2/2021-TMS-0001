const User = require("../../models/user");
const Role = require("../../models/role");
const bcrypt = require("bcrypt");
class UserHandler {
  async getUserRole(role_type) {
      const role = await Role.findOne({ role_type: role_type });
      return role;
    
  }
  async createUser(newUser) {
    // Create a new user with the data from the request body
    const userRole = await this.getUserRole(newUser.role_type);
    const user = new User({
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      password: bcrypt.hashSync(newUser.password, 10),
      email: newUser.email,
      role_type: userRole._id,
      date_created: Date.now(),
    });
      
      console.log(userRole)

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
