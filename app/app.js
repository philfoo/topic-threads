var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');

var userController = require('./controllers/userController');
var topicController = require('./controllers/topicController');
var opinionController = require('./controllers/opinionController');
var commentController = require('./controllers/commentController');
var topicVotesController = require('./controllers/topicVotesController');
var opinionVotesController = require('./controllers/opinionVotesController');
var finalController = require('./controllers/finalController');

var app = express();
var router = express.Router();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// session configuration
app.use(session({ secret: 'cs316projectsession' }));
app.use(passport.initialize());
app.use(passport.session());

require('../config/passport')(passport); // pass passport for configuration

/*
 =====================================
 FACEBOOK ROUTES =====================
 =====================================
*/

// route for facebook authentication and login
router.route('/fblogin')
	.get(passport.authenticate('facebook'));

// handle the callback after facebook has authenticated the user
router.route('/login/callback')
	.get(passport.authenticate('facebook', { failureRedirect: '/' }),
		function (req, res, next) {
			res.redirect('/');
		});

router.route('/logout')
	.get(function(req, res) {
		req.logout();
		res.redirect('/login');
	});


/*
========================================
INTERNAL API ROUTES
========================================
*/
//Topic routes
router.get('/api/topic/pageNum/:pageNum', userController.isLoggedIn, topicController.getAllTopics, topicVotesController.getTopicVotes, opinionController.getOpinionCountForTopics); //Tested
router.get('/api/topic/:topicId', userController.isLoggedIn, topicController.getTopic); //Tested
router.post('/api/topic', userController.isLoggedIn, topicController.postTopic); //Tested

//Opinion routes
router.get('/api/opinion/topicId/:topicId/pageNum/:pageNum', userController.isLoggedIn, opinionController.getAllOpinions, opinionVotesController.getOpinionVotes, 
commentController.getCommentCountForOpinions, finalController.sendResults); //Tested
router.get('/api/opinion/topicId/:topicId/opinionId/:opinionId', userController.isLoggedIn, opinionController.getOpinion); //Tested
router.get('/api/opinion/user', userController.isLoggedIn, opinionController.getOpinionsForUser, opinionVotesController.getOpinionVotes, topicController.getTopicTitles, finalController.sendResults);
router.post('/api/opinion/topicId/:topicId', userController.isLoggedIn, opinionController.postOpinion); //Tested

//Comment routes
router.get('/api/comment/topicId/:topicId/opinionId/:opinionId/pageNum/:pageNum', userController.isLoggedIn, commentController.getComments); //Tested
router.get('/api/comment/user', userController.isLoggedIn, commentController.getCommentsForUser, topicController.getTopicTitles, opinionController.getOpinionContent, finalController.sendResults); //Tested
router.post('/api/comment/topicId/:topicId/opinionId/:opinionId', userController.isLoggedIn, commentController.postComment); //Tested

//TopicVote routes
router.get('/api/topic_votes/topicId/:topicId', userController.isLoggedIn, topicVotesController.getDetailedTopicVotes); //Tested
router.get('/api/topic_votes/user', userController.isLoggedIn, topicVotesController.getTopicVotesForUser, topicVotesController.getTopicVotes, topicController.getTopicTitles, finalController.sendResults);
router.post('/api/topic_votes/topicId/:topicId', userController.isLoggedIn, topicVotesController.postTopicVote); //Tested
router.put('/api/topic_votes/topicId/:topicId', userController.isLoggedIn, topicVotesController.editTopicVote); //Tested
router.delete('/api/topic_votes/topicId/:topicId', userController.isLoggedIn, topicVotesController.deleteTopicVote); //Tested

//OpinionVote routes
router.post('/api/opinion_votes/topicId/:topicId/opinionId/:opinionId', userController.isLoggedIn, opinionVotesController.postOpinionVote); //Tested
router.get('/api/opinion_votes/topicId/:topicId/opinionId/:opinionId', userController.isLoggedIn, opinionVotesController.getDetailedOpinionVotes); //Tested
router.get('/api/opinion_votes/user', userController.isLoggedIn, opinionVotesController.getOpinionVotesForUser, topicController.getTopicTitles, opinionController.getOpinionContent, finalController.sendResults);

router.put('/api/opinion_votes/topicId/:topicId/opinionId/:opinionId', userController.isLoggedIn, opinionVotesController.editOpinionVote); //Tested
router.delete('/api/opinion_votes/topicId/:topicId/opinionId/:opinionId', userController.isLoggedIn, opinionVotesController.deleteOpinionVote); //Tested

//User route
router.get('/api/user', userController.isLoggedIn, userController.getUserStatus); //Tested

/*
 =====================================
 CUSTOM ROUTES =====================
 =====================================
*/

router.route('/login')
	.get(function(req, res) {
		res.sendFile(path.resolve(__dirname + '/../public/index.html'));
	})

router.route('/')
	.get(userController.isLoggedIn, function(req, res) {
		// code here to direct to actual page?
		res.sendFile(path.resolve(__dirname + '/../public/topic.html'));
	});

app.use('/', router);

// serve static file
app.use(express.static(__dirname + '/../public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler to print stack trace
if (app.get('env') == 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			code: 'failure',
			message: err.message,
			stack: err.stack
		});
	});
}

// production error handler so no stack track is shown to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		code: 'failure',
		message: err.message
	});
});

module.exports = app;
