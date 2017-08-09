
const SongRoom = require('../models/SongRoom.js');

exports.getSongRooms = (req, res) => {
  SongRoom.find({}).sort('-createdAt').exec((err, docs) => {
  	

    res.render('songRooms', { title: 'song rooms',
                          songRooms: docs });
  });
};

/**
 * GET /songrooms/:ID
 * Get detail.
 */
exports.getSongRoomsDetail = (req, res) => {
	console.log(req.params.Id)

  SongRoom.findOne({_id: req.params.Id}, (err, songRoom) => {
    var nameBits = songRoom.name.split('/')
    res.render('songRoomsDetail',
     { title: nameBits[nameBits.length-1], 
      'songRoom': songRoom });
  });
};

exports.createSongRooms = (req, res) => {

	var aSongRoom = new SongRoom( {name: req.body.name} )
	aSongRoom.save()
	res.redirect('back');

};
