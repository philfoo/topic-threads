var async = require('async');

/*
Number of topics to show per page.
*/
var numTopicsToShow = 50;

/*
Grabs a specified number of topics to show (taking into account offsets).
For each topic, it checks the TopicVotes table to see whether the user has
already voted on that particular topic. Appends a hasVoted attribute to the
result, then sends it back as a response.
*/
function getAllTopics(req, res, next){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.Topic.findAndCountAll({
            order: '"updatedAt" DESC',
            limit: numTopicsToShow,
            offset: numTopicsToShow * (req.params.pageNum - 1)
        }).then(function(result){
            var topics = result.rows;
            async.each(topics, function(topic, callback){
                db.TopicVotes.findOne({
                    where: {
                        topic_id: topic.dataValues.id,
                        user_id: user.id
                    }
                }).then(function(vote){
                    topic.dataValues.userPreviouslyVoted = null;
                    if (vote != null){
                        topic.dataValues.userPreviouslyVoted = vote.dataValues.isUp;
                    }
                    db.User.findOne({
                        where: {
                            id: topic.user_id
                        }
                    }).then(function(user){
                        topic.dataValues.topicAuthor = user.dataValues.username;
                        callback();
                    });
                });
            }, function(){
                req.result = result;
                next();
            });
        })
    });
}


/**
Iterates through a list already defined in req.result and finds corresponding topic titles based on topic_id
*/
function getTopicTitles(req, res, next){
    async.each(req.result.rows, function(object, callback){
        db.Topic.findOne({
            where: {
                id: object.topic_id
            }
        }).then(function(topic){
            object.dataValues.topicTitle = topic.dataValues.title;
            callback();
        })
    }, function(){
        next();
    })
}

/*
Gets information associated with a particular topic. Nothing
additional necessary in the request body. Also appends the
number of upvotes and downvotes onto returned data. Includes
information about whether the current user has previously voted on the topic.
*/
function getTopic(req, res, next){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.Topic.findOne({
            where: {
                id: req.params.topicId
            }
        }).then(function(result){
            if (result == null){
                res.send({
                    status: 400,
                    message: "No topics with this ID found."
                });
            }
            db.TopicVotes.findAndCountAll({
                where: {
                    topic_id: req.params.topicId
                }
            }).then(function(votes){
                var votes = votes.rows;
                var numUpvotes = 0;
                var numDownvotes = 0;
                result.dataValues.userPreviouslyVoted = null;
                for (var i = 0; i < votes.length; i++){
                    if (votes[i].isUp) numUpvotes++;
                    if (votes[i].user_id === user.id){
                        result.dataValues.userPreviouslyVoted = votes[i].isUp;
                    }
                }
                result.dataValues.upvotes = numUpvotes;
                result.dataValues.downvotes = votes.length - numUpvotes;
                db.User.findOne({
                    where: {
                        id: result.dataValues.user_id
                    }
                }).then(function(user){
                    result.dataValues.topicAuthor = user.dataValues.username;
                    res.send(result);
                });
           });
        });
    });
}

function postTopic(req, res, next) {
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user) {
        db.Topic.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            user_id: user.id
        })
        .then(function() {
            res.status(200).send({
                message: "Topic successfully posted."
            });
        }).catch(function(err){
            res.status(400).send({
                message: "There was an error posting your topic."
            });
        });
    });
}

module.exports = {
    postTopic: postTopic,
    getAllTopics: getAllTopics,
    getTopicTitles: getTopicTitles,
    getTopic: getTopic
};
