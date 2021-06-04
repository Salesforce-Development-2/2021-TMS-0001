const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcrypt");
const trackService = require("./trackService");
const track = require("../models/track");

const roleService = require("./roleService");

class UserService {
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

    // Save the user in the database

    const savedUser = await user.save();

    return savedUser;
  }

  async updateUser(userId, newUser) { 

    // Get the user from the database
    let user = await User.findById(userId);

    // if the user is not found return 404
    if (!user) return null;
    newUser.date_updated = Date.now();
    // Update the fields of the course object
    for (const field of Object.keys(newUser)) {
      user[field] = newUser[field];
    }
    let updatedUser = await user.save();
    updatedUser = updatedUser.toJSON();
    updatedUser.role = await roleService.getUserRoleName(updatedUser.role);
    return updatedUser
  }
  async getUser(userId) {
    let userDetails;
    // Get the user from database
    const user = await User.findOne({ _id: userId }).select('-password').populate({ path: 'role_type', select: 'role_title -_id' });
    if(!user) return user;
    // Get the users tracks
    const currentTrack = await trackService.getCurrentTrack(userId);
    // Extract only the current track names into an array

    // convert user to json and assign to userDetails. This is done because of the immutability of mongoose document
    userDetails = user.toJSON()
    userDetails.current_track = currentTrack;
    return userDetails;
  }
  async getUsers(){
    const users = await User.find().populate({ path: 'role_type', select: 'role_type -_id' });
    return users;
  }
  async getUserByEmail(email) {
    // Check if the email already exist in the database
    const emailExists = await User.findOne({ email: email });
    return emailExists;
  }

  async deleteUser(userId){
    const deletedUser = await User.deleteOne({_id: userId});
    return deletedUser;
  }
}
module.exports = new UserService();
