const Course = require('../../models/course');

class CourseManager{
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
        path: 'courses', 
        populate: {
          path: 'course_id'
        }
      
      });
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
      const course = await Course.findOne({ _id: courseId });
      course.users.push({
        enrollment_date: Date.now(),
        user_id: userId
      })
      if(await course.save()) return true;
      else return false;
    }

    // Remove a user from a Course
    async unEnrollUser(courseId, userId){
      const course = await Course.findOne({ _id: courseId });
        course.users.filter(userObject =>{
          return userObject.user_id != userId;
        })
    }
    // returns an array of users enrolled in a course
    async getUsers(courseId){
      const usersObject = await Course.findOne({_id: courseId}).select('users -_id');
      return usersObject.users;
    }
}

module.exports = new CourseManager();