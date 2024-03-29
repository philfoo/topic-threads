var async = require('async');

/*
Grabs number of votes of each votetype for each opinion and appends to the result.
*/
function getOpinionVotes(req, res, next){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        var opinions = req.result.rows;
        async.each(opinions, function(opinion, callback){
            db.OpinionVotes.findAndCountAll({
                where: {
                    topic_id: opinion.topic_id,
                    opinion_id: opinion.id 
                }
            }).then(function(votes){
                var votesRows = votes.rows;
                var voteCount = {};
                for (var i = 0; i < votesRows.length; i++) {
                    var type = votesRows[i].type;
                    voteCount[type] = (voteCount[type] || 0) + 1;
                }
                opinion.dataValues.voteCount = voteCount;
                callback();
            });
        }, function(){
            next();
        });
    });
}


/*
Returns a detailed list of votes for one specific opinion.
*/
function getDetailedOpinionVotes(req, res){
    db.OpinionVotes.findAndCountAll({
        where: {
            topic_id: req.params.topicId,
            opinion_id: req.params.opinionId
        }
    }).then(function(result){
        var opinionVotes = result.rows;
        async.each(opinionVotes, function(opinion, callback){
            db.User.findOne({
                where: {
                    id: opinion.user_id
                }
            }).then(function(user){
                opinion.dataValues.username = user.dataValues.username;
                callback();
            })
        }, function(){
            res.send(result);
        });
    });
}

/*
Returns a list of the opinion votes that a user has posted.
*/
function getOpinionVotesForUser(req, res, next){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.OpinionVotes.findAndCountAll({
            where: {
                user_id: user.id
            },
            order: '"updatedAt" DESC'
        }).then(function(result){
            req.result = result;
            next();
        }).catch(function(err){
            res.status(400).send({
                message: "Could not retrieve opinion votes for this user."
            });
        });
    });
}

/*
Adds a vote on a particular opinion.
Request body requires: topic_id, opinion_id, and type ("savage", etc.)
First checks to see if the user has already voted on that particular opinion,
then posts the vote if they have not.
*/
function postOpinionVote(req, res){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.OpinionVotes.findOne({
            where: {
                user_id: user.id,
                topic_id: req.params.topicId,
                opinion_id: req.params.opinionId
            }
        })
        .then(function(vote){
            if (vote == null){
                db.OpinionVotes.create({
                    user_id: user.id,
                    topic_id: req.params.topicId,
                    opinion_id: req.params.opinionId,
                    type: req.body.type
                })
                .then(function(){
                    res.status(200).send({
                        message: "Opinion vote posted."
                    });
                });
            }else{
                res.status(400).send({
                    message: "User has already voted on opinion."
                });
            }
        });
    });
}


function editOpinionVote(req, res){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.OpinionVotes.findOne({
            where: {
                user_id: user.id,
                opinion_id: req.params.opinionId,
                topic_id: req.params.topicId
            }
        }).then(function(vote){
            if (vote == null){
                res.status(400).send({
                    message: "This vote does not currently exist in the database."
                });
            }
            db.OpinionVotes.update(
                {
                    topic_id: req.params.topicId,
                    opinion_id: req.params.opinionId,
                    user_id: user.id,
                    type: req.body.type
                },
                {
                    where: {
                        user_id: user.id,
                        opinion_id: req.params.opinionId,
                        topic_id: req.params.topicId
                    },
                    fields: ["type"]
                }
            ).then(function(result){
                res.status(200).send({
                    message: "Vote result updated!"
                });
            });
        });
    });
}


function deleteOpinionVote(req, res){
    db.User.findOne({
        where: {
            fb_id: req.user.id
        }
    }).then(function(user){
        db.OpinionVotes.findOne({
            where: {
                user_id: user.id,
                topic_id: req.params.topicId,
                opinion_id: req.params.opinionId
            }
        }).then(function(vote){
            if (vote == null){
                res.status(400).send({
                    message: "This vote does not currently exist in the database."
                });
            }
            db.OpinionVotes.destroy({
                where: {
                    user_id: user.id,
                    opinion_id: req.params.opinionId,
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

module.exports = {
    getOpinionVotes: getOpinionVotes,
    postOpinionVote: postOpinionVote,
    getDetailedOpinionVotes: getDetailedOpinionVotes,
    getOpinionVotesForUser: getOpinionVotesForUser,
    editOpinionVote: editOpinionVote,
    deleteOpinionVote: deleteOpinionVote
};
