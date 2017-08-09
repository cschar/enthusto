const mongoose = require('mongoose');

const songRoomSchema = new mongoose.Schema({
  name: String,

},  { timestamps: true });

const SongRoom = mongoose.model('SongRoom', songRoomSchema);
module.exports = SongRoom;