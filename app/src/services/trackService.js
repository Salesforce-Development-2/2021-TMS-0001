const Track = require('../models/track');
const User = require('../models/user');

class TrackService{

  // Get track by name
    async getTrackByName(trackName){

      // Find the track with the track name
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

    // Get a track with a track id
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

    // Get all tracks from the database
    async getTracks(){
      const tracks = await Track.find().select("-courses -users");
      return tracks;
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

      // Get the track with the track id
      const track = await Track.findOne({ _id: trackId });

      // Push an object of enrollment_date and user id to the users field of the track
      track.users.push({
        enrollment_date: Date.now(),
        user_id: userId
      })
      if(await track.save()) return true;
      else return false;
    }

    // Remove a user from a track
    async unEnrollUser(trackId, userId){

      // Find the track with the track id
      const track = await Track.findOne({ _id: trackId });

        // filter the users object of the track
        track.users.filter(userObject =>{

          // all the users that return true will remain
          return userObject.user_id != userId;
        })
    }
    // returns an array of users enrolled in a course
    async getUsers(trackId){
      const usersObject = await Track.findOne({_id: trackId}).select('users -_id');
      return usersObject.users;
    }

    // updates a track in the database
    async updateTrack(trackId, newTrack){

      // Get the track from database
      let track = await this.getTrack(
        trackId
      );

      // if track is not found return null;
      if(!track) return null;

      // Else update the fields
      for (const field of Object.keys(newTrack)) {
        track[field] = req.body[field];
      }

      // return the saved track
      return await track.save();

    }

    async getUserTracks(userId){

      // Declare an empty array to keep the resulting tracks
      let result = [];

      // Fetch all tracks from database
      const tracks = await Track.find();

      // Loop through the tracks 
      tracks.forEach(track =>{

        // For each track loop through the users object
        track.users.forEach(user =>{

          // If the user id of the current track equals the userId parameter push it ot the result array
          if(user.user_id == userId) {
            result.push({enrollment_date: user.enrollment_date, track_name: track.track_name});
          }
        })
      })
      return result;
    }

    // Gets the most current track a user is enrolled on
    async getCurrentTrack(userId){

      // Get all tracks the user is enrolled on
      const userTracks = await this.getUserTracks(userId);

      // set the current track to the first element in the array
      let currentTrack = userTracks[0];

      // loop through the tracks
      userTracks.forEach(track =>{
        
        // if the track is more current than currentTrack set it to the currentTrack variable
        if(track.enrollment_date > currentTrack.enrollment_date) currentTrack = track;
      })
      return currentTrack
    }
}

module.exports = new TrackService();