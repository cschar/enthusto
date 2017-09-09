const SongRoom = require('../models/SongRoom.js');
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  SongRoom.find({}).sort('-createdAt').limit(1).exec((err, docs) => {

    if(docs.length == 1){
      songRoom = docs[0]
    }else{
      songRoom = {id: 0,name:0}
    }

    res.render('home', { title: 'song rooms',
                          songRoom: songRoom});
  });

  //res.render('home', {
  //  title: 'Home'
  //});
};
