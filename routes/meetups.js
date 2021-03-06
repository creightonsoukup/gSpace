var express = require('express');
var router = express.Router();
var queries = require('../database/queries/meetups_queries');

/* GET home page. */
router.get('/', function(req, res, next) {
    queries.getMeetups()
        .then(function(data) {
            res.render('meetups/index', {
                title: 'Meetups Homepage',
                meetups: data
            });
        })
        .catch(function(error) {
            return next(error);
        })
});

router.get(':id/page', function(req, res, next) {
    queries.getMeetup(req.params.id)
        .then(function(data) {
            if (data[0].user_id == req.user.id) {
                res.render('meetups/page', {
                    meetup: data[0],
                    isOwner: true,
                    user: req.user
                })
            } else {
                res.render('meetups/page', {
                    meetup: data[0],
                    isOwner: false,
                    user: req.user
                })
            }
        })
        .catch(function(error) {
            return next(error);
        })
});


router.get('/:id/edit', function(req, res, next) {
    queries.getMeetup(req.params.id)
        .then(function(data) {
          var meetup = data[0];
            if (!req.user.id == meetup.user_id) {
                console.log('user ' + req.user.id + 'is not meetup owner');
                res.redirect('/');
                return;
            } else {
                res.render('edit', { meetup: meetup });
            }
        })
        .catch(function(error){
          return next(error);
        })
});

router.post('/:id/edit', function(req, res, next) {
        var id = req.params.id;
        var title = req.body.title;
        var description = req.body.description;
        var location = req.body.location;
        var time = req.body.time;

        queries.updateMeetup(id, description, title, location, time)
        .then(function() {
            res.redirect('/id/page')
        })
        .catch(function(error){
          return next(error);
        })
});

router.post('/:id/delete', function(req, res, next) {
  queries.getMeetup(req.params.id)
  .then(function(data){
    if(req.user.id == data[0].user_id){
      queries.deleteMeetup(req.params.id)
      .then(function(data){
        res.redirect('/meetups')
      })
      .catch(function(error){
        return next(error);
      })
    } else {
      res.redirect('/')
    }
  })
  .catch(function(error){
    return next(error);
  })
});

module.exports = router;
