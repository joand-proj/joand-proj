const router = require("express").Router();
const { default: axios } = require("axios");
const consumerKey = process.env.CONSUMER_KEY
const secretKey = process.env.SECRET_KEY
var Discogs = require('disconnect').Client;
const passport = require('passport')
const User = require('../models/User.model')

var dis = new Discogs({
	consumerKey: consumerKey, 
	consumerSecret: secretKey
});

var db = dis.database();

router.get("/artists", (req, res, next) => {
  let arr = []
  axios.get(`https://api.discogs.com/database/search?type=artist&q=${req.query.q}&key=${consumerKey}&secret=${secretKey}`)
    .then(response => {
        response.data.results.forEach((artist) => {
            if (artist.thumb.length !== 0) {
            arr.push(artist)
          }
          })
        res.render('./artistsAlbumsTracks/artists', {data: arr, auth: req.isAuthenticated()}) 
    })
    .catch(err => console.log(err))
    
    });

router.get('/artist/:id', (req,res,next) => {
  let albumArr = []

  db.getArtistReleases(req.params.id, {page: 1, per_page: 100}, function(err, data){
      data.releases.forEach(album => {
        if (album.type === 'master' && album.thumb !== '' && album.role === 'Main'){
          albumArr.push(album)
        }
      })

  db.getArtist(req.params.id, function(err, datas){
    let membersArr = []
    let linksArr = []
    console.log(datas.urls)
    for (let i = 0; i < 5; i++ ){
      console.log(datas.urls)
      if(datas.urls){
        linksArr.push(datas.urls[i])
      }
    }

 
    let img = datas.images[0].uri
    res.render('./artistsAlbumsTracks/artistAlbums', {albums: albumArr, artist: datas, img: img, links: linksArr, auth: req.isAuthenticated()})
  })

  })
      
})


 
module.exports = router;