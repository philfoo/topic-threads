var async = require('async');

/*
Grabs the upvotes/downvotes for each topic and appends to the result.
*/
function getTopicVotes(req, res, next){
    var topics = req.result.rows;
    async.each(topics, function(topic, callback){
        db.TopicVotes.findAndCountAll({
            where: {
                topic_id: topic.id
            }
        }).then(function(votes){
            var votesRows = votes.rows;
            var upvotes = votesRows.filter(function(el) {
                return el.dataValues.isUp;
            }).length;
            var downvotes = votesRows.length - upvotes;
            topic.dataValues.upvotes = upvotes;
            topic.dataValues.downvotes = downvotes;
            callback();
        });
    }, function(){
        next();
    });
}



/*
Returns a detailed list of votes for one specific topic.
*/
function getDetailedTopicVotes(req, res){
    db.TopicVotes.findAndCountAll({
        where: {
            topic_id: req.params.topicId,
        }
    }).then(function(result){
        var topicVotes = result.rows;
        async.each(topicVotes, function(topic, callback){
            db.User.findOne({
                where: {
                    id: topic.user_id
                }
            }).then(function(user){
                topic.dataValues.username = user.dataValues.username;
                callback();
            })
        }, function(){
            res.send(result);
        });
    });
}

function getTopicVotesForUser(req, res, next){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.TopicVotes.findAndCountAll({
            where: {
                user_id: user.id
            },
            order: '"updatedAt" DESC'
        }).then(function(result){
            req.result = result;
            next();
        });
    }).catch(function(err){
        res.status(400).send({
            message: "There was an error retrieving topic votes for this user."
        });
    });
}

/*
Posts a topic vote associated with a particular topic.
Required in the request body: topic_id and isUp (a boolean).
Checks to see whether the user has already voted on a particular topic. If they 
haven't, the topic vote is posted.
*/
function postTopicVote(req, res) {
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.TopicVotes.findOne({
            where: {
                user_id: user.id,
                topic_id: req.params.topicId
            }
        })
        .then(function(vote){
            if (vote == null){
                db.TopicVotes.create({
                    user_id: user.id,
                    topic_id: req.params.topicId,
                    isUp: req.body.is_up
                })
                .then(function(){
                    res.status(200).send({
                        message: "Vote posted."
                    });
                });
            }else{
                res.status(400).send({
                    message: "User has already voted."
                })
            }
        });
    });
}

function deleteTopicVote(req, res){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.TopicVotes.findOne({
            where: {
                user_id: user.id,
                topic_id: req.params.topicId
            }
        }).then(function(vote){
            if (vote == null){
                res.status(400).send({
                    message: "This vote does not currently exist in the database."
                });
            }
            db.TopicVotes.destroy({
                where: {
                    user_id: user.id,
                    topic_id: req.params.topicId
                }
            }).then(function(result){
                res.status(200).send({
                    message: "Vote deleted."
                });
            });
        });
    });
}


function editTopicVote(req, res){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.TopicVotes.findOne({
            where: {
                user_id: user.id,
                topic_id: req.params.topicId
            }
        }).then(function(vote){
            if (vote == null){
                res.status(400).send({
                    message: "Vote does not exist."
                });
            }
            db.TopicVotes.update(
                {
                    isUp: req.body.is_up
                }, {
                    where: {
                        user_id: user.id,
                        topic_id: req.params.topicId
                    },
                    fields: ["isUp"]
                }
            ).then(function(){
                res.status(200).send({
                    message: "Vote result updated!"
                });
            });
        });
    });
}

module.exports = {
    getTopicVotes: getTopicVotes,
    postTopicVote: postTopicVote,
    getTopicVotesForUser: getTopicVotesForUser,
    deleteTopicVote: deleteTopicVote,
    editTopicVote: editTopicVote,
    getDetailedTopicVotes: getDetailedTopicVotes
};