const Track = require('../models/track');
const User = require('../models/user');
const userService = require("./userService");
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
          track_master: newTrack.track_master,
          date_created: Date.now()
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

      if(await this.isUserEnrolled(trackId, userId)) return {error: "User is already enrolled"};
      const track = await Track.findOne({ _id: trackId });
      track.users.push({
        enrollment_date: Date.now(),
        user_id: userId
      })
      const savedTrack = await track.save()
      if(savedTrack) return {enrolledUser: await User.findById(userId) }
      return {error: "unable to save"}
    }

    // Remove a user from a track
    async unEnrollUser(trackId, userId){

      // determine if user is enrolled in track or not
      let isUserEnrolled = await this.isUserEnrolled(trackId, userId);

      // If a user is not enrolled return an error
      if(!isUserEnrolled) return {error: "User is not enrolled"};

      // Get the track from the database with the track id
      const track = await Track.findOne({ _id: trackId });

        // filter the users field by removing the specific user and assign to the users field of the fetched
        // track
        track.users = track.users.filter(userObject =>{
          return userObject.user_id != userId;
        })

      // Save the track synchronously
      await track.save();

      // return a success mesage
      return {message: "successfully unenrolled " + (await User.findById(userId)).firstname };
    }
    // returns an array of users enrolled in a track
    async getUsers(trackId){
      const trackObject = await Track.findOne({_id: trackId}).select('users -_id');
      if(!trackObject) return {error: {status: 404, message: "Track not found"}};
      return trackObject.users;
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
      if(result.length < 1) return {message: "No result found"}
      return result;
    }

    // Gets the most current track a user is enrolled on
    async getCurrentTrack(userId){

      // Get all tracks the user is enrolled on
      const userTracks = await this.getUserTracks(userId);
      
      if(userTracks.length < 1) return {message: "User is not enrolled in any track"};

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