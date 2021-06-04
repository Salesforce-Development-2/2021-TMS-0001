const Course = require('../models/course');
const userService = require('./userService');
class CourseService{
    async getCourseByName(courseName){
        const course = await Course.findOne({course_name: courseName })
        return course;
    }
    async createCourse(newCourse) {
        // Create a new Course with the data from the request body
        const course = new Course({
          Course_name: newCourse.Course_name,
          Course_master: newCourse.Course_master
        });
          
        // Save the user in the database
    
        const savedCourse = await course.save();
    
        return savedCourse;
    }
    async getCourse(courseId) {
      // Get the user from database
      const course = await Course.findOne({ _id: courseId }).populate({ 
        path: 'users', 
        populate: {
          path: 'user_id'
        }
      });

      return course;
    }

    async getCourseLean(courseId){
      // Get the course from database
      const course = await Course.findOne({ _id: courseId }).select("-users");

      return course;
    }

    // returns whether or not a user is enrolled in a Course
    async isUserEnrolled(courseId, userId){
      const users = await this.getUsers(courseId);
      for(let user of users){
        if(user.user_id == userId){
          return true;
        }
      }
      return false;
    }

    // Enroll a user in a Course
    async enrollUser(courseId, userId){

      if(await this.isUserEnrolled(courseId, userId)) return {error: "User is already enrolled"};
      const course = await Course.findOne({ _id: courseId });
      course.users.push({
        enrollment_date: Date.now(),
        user_id: userId
      })
      const savedCourse = await course.save()
      if(savedCourse) return {enrolledUser: await userService.getUser(userId) }
      return {error: "unable to save"}
    }

    // Remove a user from a Course
    async unEnrollUser(courseId, userId){
      let isUserEnrolled = await this.isUserEnrolled(courseId, userId);
      if(!isUserEnrolled) return {error: "User is not enrolled"};
      const course = await Course.findOne({ _id: courseId });
        course.users = course.users.filter(userObject =>{
          return userObject.user_id != userId;
        })
      await course.save();
      return await {message: "successfully unenrolled " + (await userService.getUser(userId)).firstname };
    }
    // returns an array of users enrolled in a course
    async getUsers(courseId){
      const usersObject = await Course.findOne({_id: courseId}).select('users -_id');
      return usersObject.users;
    }

    async updateCourse(courseId, newCourse) { 

      // Get the course from the database
      let course = await this.getCourse(courseId);
  
      // if the course is not found return 404
      if (!course) return null;
  
      // Update the fields of the course object
      for (const field of Object.keys(newCourse)) {
        course[field] = newCourse[field];
      }
       await course.save()
       return this.getCourseLean(courseId);
    }
}

module.exports = new CourseService();