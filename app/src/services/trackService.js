const Track = require('../models/track');

class TrackManager{
    async getTrackByName(trackName){
        const track = await Track.findOne({track_name: trackName })
        return track;
    }
    async createTrack(newTrack) {
        // Create a new track with the data from the request body
        const track = new Track({
          track_name: newTrack.track_name,
          track_master: newTrack.track_master
        });
          
        // Save the user in the database
    
        const savedTrack = await track.save();
    
        return savedTrack;
    }
    async getTrack(trackId) {
      // Get the user from database
      const track = await Track.findOne({ _id: trackId }).populate({ 
        path: 'courses', 
        populate: {
          path: 'course_id'
        }
      
      });
      return track;
    }

    // returns whether or not a user is enrolled in a track
    async isUserEnrolled(trackId, userId){
      const users = await this.getUsers(trackId);
      for(let user of users){
        if(user.user_id == userId){
          return true;
        }
      }
      return false;
    }

    // Enroll a user in a track
    async enrollUser(trackId, userId){
      const track = await Track.findOne({ _id: trackId });
      track.users.push({
        enrollment_date: Date.now(),
        user_id: userId
      })
      if(await track.save()) return true;
      else return false;
    }

    // Remove a user from a track
    async unEnrollUser(trackId, userId){
      const track = await Track.findOne({ _id: trackId });
        track.users.filter(userObject =>{
          return userObject.user_id != userId;
        })
    }
    // returns an array of users enrolled in a course
    async getUsers(trackId){
      const usersObject = await Track.findOne({_id: trackId}).select('users -_id');
      return usersObject.users;
    }
}

module.exports = new TrackManager();