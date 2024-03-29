# API Documentation

## Topics API

#### GET all topics page-by-page: /api/topic/pageNum/:pageNum
Returns all the topics, sorted in descending order with the most recent first. 
Sample request response:
```javascript
{
	count: 4,
	rows: [
		{
			id: 4,
			opinionCount: 1,
			title: "Sample Data 4",
			description: "This is a description for sample data 4. SOOO EXCITING.",
			category: "general",
			createdAt: "2016-12-10T07:08:55.993Z",
			updatedAt: "2016-12-10T07:08:55.993Z",
			user_id: 1,
			userPreviouslyVoted: null,  //null if the user has never voted on this topic
			topicAuthor: "Phil Foo",
			upvotes: 0,
			downvotes: 0
		},
		{
			id: 3,
			opinionCount: 1,
			title: "Sample Data 3",
			description: "This is a description for sample data 3. Kinda boring, I know.",
			category: "general",
			createdAt: "2016-12-10T06:58:04.239Z",
			updatedAt: "2016-12-10T06:58:04.239Z",
			user_id: 1,
			userPreviouslyVoted: true,  //user has upvoted this topic
			topicAuthor: "Phil Foo",
			upvotes: 0,
			downvotes: 0
		},
		{
			id: 2,
			opinionCount: 2,
			title: "Jayson Tatum's Sick Throwdown",
			description: "DID YOU SEE THAT DUNK BR0000ooOOOHHHH?? DIRTY! FILTHY! VILE!",
			category: "sports",
			createdAt: "2016-12-10T06:57:12.285Z",
			updatedAt: "2016-12-10T06:57:12.285Z",
			user_id: 1,
			userPreviouslyVoted: false,  //user has downvoted this topic
			topicAuthor: "Phil Foo",
			upvotes: 0,
			downvotes: 0
		}
	]
}
```

#### GET information for one specific topic: /api/topic/:topicId
Retrieves information for one specific topic. Sample response:
```javascript
{
	id: 1,
	title: "My Really Bad Diarrhea Last Week",
	description: "A girl can't always have a smooth bathroom experience. Sometimes it gets a little rough. That's what happened last week when I plopped down onto the seat. I'll spare you the details.",
	category: "humor",
	createdAt: "2016-12-10T06:56:15.817Z",
	updatedAt: "2016-12-10T06:56:15.817Z",
	user_id: 1,
	userPreviouslyVoted: false,    //What the user has already voted on this topic, if they have. Null if they haven't.
	numUpvotes: 0,
	numDownvotes: 1,
	topicAuthor: "Phil Foo"
}
````


#### POST a new topic: /api/topic
Request body requires the following fields:
* String: title
* String: description
* String: category

Returns a response with status 200 and message "Topic successfully posted."
Otherwise returns a response with status 400 and message "There was an error posting your topic."




## Opinions API

#### GET all opinions for a particular topic: /api/opinion/topicId/:topicId/pageNum/:pageNum
Sample response:
```javascript
{
	count: 2,
	rows: [
		{
			id: 4,
			content: "Big b00ty Jason",
			createdAt: "2016-12-10T07:40:49.491Z",
			updatedAt: "2016-12-10T07:40:49.491Z",
			user_id: 1,
			topic_id: 2,
			userPreviouslyVoted: "savage",    //What the current user previously voted, if anything
			opinionAuthor: "Phil Foo",
			voteCount: {   //Number of votes for each type. Note that fields with 0 votes are omitted.
				savage: 1,
				debatable: 2
			},
			commentCount: 2
		},
		{
			id: 5,
			content: "Honestly I love Jayson Tatum",
			createdAt: "2016-12-10T07:40:58.429Z",
			updatedAt: "2016-12-10T07:40:58.429Z",
			user_id: 1,
			topic_id: 2,
			userPreviouslyVoted: null,
			opinionAuthor: "Phil Foo",
			voteCount: { },
			commentCount: 3
		}
	]
}
```

#### GET a specific opinion: /api/opinion/topicId/:topicId/opinionId/:opinionId
Will return to you a error response with status 400 and message "Could not find a matching opinion" if no
opinion with corresponding topicId and opinionId could be found.

Sample response otherwise:
```javascript
{
	id: 1,
	content: "I don't think that the point you make is really valid. Honestly, it kind of sucks and doesn't make much sense. Insert ad-hominem argument here.",
	createdAt: "2016-12-10T07:23:23.452Z",
	updatedAt: "2016-12-10T07:23:23.452Z",
	user_id: 1,
	topic_id: 3,
	userPreviouslyVoted: "convincing",
	voteCount: {
		convincing: 1
	},
	opinionAuthor: "Phil Foo"
}
```

#### GET opinions that a user has posted: /api/opinion/user
Returns an error response with status 400 and message "There was an error retrieving opinions for this user." in the case of an error.

Returns opinions in order of most recent. Does not require anything in the request body or parameter URLs.
```javascript
{
	count: 2,
	rows: [
	{
		id: 52,
		content: "Ellen vs. Grace is an interesting matchup though....",
		createdAt: "2016-12-17T23:19:16.148Z",
		updatedAt: "2016-12-17T23:19:16.148Z",
		user_id: 3,
		topic_id: 16,
		topicTitle: "One-on-Ones",
		voteCount: {
			intriguing: 2
		}
	},
	{
		id: 50,
		content: "EZ WIN",
		createdAt: "2016-12-17T23:14:22.519Z",
		updatedAt: "2016-12-17T23:14:22.519Z",
		user_id: 3,
		topic_id: 16,
		topicTitle: "One-on-Ones",
		voteCount: {
			flawed: 2,
			convincing: 2,
			savage: 1
		}
	}
}
```

#### POST a new opinion: /api/opinion/topicId/:topicId 
Request body requires the following fields:
* String: content

Returns a response with status 200 and message "Opinion successfully posted!"
Otherwise returns a response with status 400 and message "There was an error posting your opinion."





## Comments API

#### GET all comments for a particular opinion: /api/comment/topicId/:topicId/opinionId/:opinionId/pageNum/:pageNum

Sample response:
```javascript
{
	count: 2,
	rows: [
	{
		id: 1,
		content: "Hi Phil. I Love You.",
		createdAt: "2016-12-10T08:11:59.269Z",
		updatedAt: "2016-12-10T08:11:59.269Z",
		user_id: 1,
		topic_id: 4,
		opinion_id: 2,
		commentAuthor: "Phil Foo"
	},
	{
		id: 2,
		content: "Hi Phil. I Don't Love You.",
		createdAt: "2016-12-10T08:15:58.243Z",
		updatedAt: "2016-12-10T08:15:58.243Z",
		user_id: 1,
		topic_id: 4,
		opinion_id: 2,
		commentAuthor: "Phil Foo"
	}
	]
}
```


#### GET all comments a particular user has posted: /api/comment/user
Sorted in most-recent order. **IMPORTANT: note that the response is contained under 'comments' in the JSON object:
```
{
	count: 4,
	rows: [
		{
			id: 45,
			content: "Hi nina",
			createdAt: "2016-12-21T06:08:20.996Z",
			updatedAt: "2016-12-21T06:08:20.996Z",
			user_id: 3,
			topic_id: 7,
			opinion_id: 29
		},
		{
			id: 29,
			content: "i really don't think so ellen",
			createdAt: "2016-12-16T04:41:23.685Z",
			updatedAt: "2016-12-16T04:41:23.685Z",
			user_id: 3,
			topic_id: 12,
			opinion_id: 40
	}]
}
```


#### POST a new comment: /api/comment/topicId/:topicId/opinionId/:opinionId
Request body requires the following fields:
* String: content

Returns a response with status 200 and message "Comment successfully posted."
Otherwise returns a response with status 400 and message "There was an error posting your comment."





## TopicVote API 

#### GET all votes for one particular topic: /api/topic_votes/topicId/:topicId
Sample response:
```javascript
{
	count: 1,
	rows: [
	{
		id: 2,
		isUp: true, //Phil Foo voted up
		createdAt: "2016-12-10T08:53:28.843Z",
		updatedAt: "2016-12-10T08:53:28.843Z",
		user_id: 1,
		topic_id: 3,
		username: "Phil Foo"
	}
	]
}
```

#### GET all votes a particular user has casted: /api/topic_votes/user
Sample response:
```
{
	count: 2,
	rows: [
		{
			id: 21,
			isUp: false,
			createdAt: "2016-12-12T23:36:50.339Z",
			updatedAt: "2016-12-12T23:36:51.349Z",
			user_id: 3,
			topic_id: 8,
			upvotes: 0,
			downvotes: 0,
			topicTitle: "New Sample Topic"
		},
		{
			id: 20,
			isUp: true,
			createdAt: "2016-12-12T23:36:42.881Z",
			updatedAt: "2016-12-12T23:36:42.881Z",
			user_id: 3,
			topic_id: 9,
			upvotes: 0,
			downvotes: 0,
			topicTitle: "who going to jade?"
	}
}
```

#### POST a new topic vote: /api/topic_votes/topicId/:topicId
Request body requires the following fields:
* Boolean: is_up

Checks to see if the user has already voted on a particular topic. Will reject if the user has already voted.

Returns a response with status 200 and message "Vote posted."
Otherwise returns a response with status 400 and message "User has already voted."


#### PUT (Edit) an existing topic vote: /api/topic_votes/topicId/:topicId
Request body requires the following fields:
* Boolean: is_up

#### DELETE an existing topic vote: /api/topic_votes/topicId/:topicId
No additional notes.



## OpinionVote API

#### GET all votes associated with a particular opinion: /api/opinion_votes/topicId/:topicId/opinionId/:opinionId
Sample response:
```javascript
{
	count: 2,
	rows: [
	{
		id: 3,
		type: "savage",
		createdAt: "2016-12-10T09:17:31.211Z",
		updatedAt: "2016-12-10T09:17:31.211Z",
		user_id: 1,
		topic_id: 2,
		opinion_id: 4,
		username: "Phil Foo"
	},
	{
		id: 4,
		type: "convincing",
		createdAt: "2016-12-10T09:17:31.211Z",
		updatedAt: "2016-12-10T09:17:31.211Z",
		user_id: 3,
		topic_id: 2,
		opinion_id: 4,
		username: "Jae Hun Ro"
	}
	]
}
```

#### Get all opinionVotes casted by a particular user: /api/opinion_votes/user
Sample response:
```
{
	count: 2,
	rows: [
		{
			id: 99,
			type: "convincing",
			createdAt: "2016-12-17T23:15:13.262Z",
			updatedAt: "2016-12-17T23:15:13.262Z",
			user_id: 3,
			topic_id: 16,
			opinion_id: 50,
			opinionContent: "EZ WIN",
			topicTitle: "Memes"
		},
		{
			id: 35,
			type: "intriguing",
			createdAt: "2016-12-12T23:38:13.273Z",
			updatedAt: "2016-12-12T23:38:13.273Z",
			user_id: 3,
			topic_id: 3,
			opinion_id: 17,
			opinionContent: "i'm going to learn how to read! ",
			topicTitle: "Memes"
		}
}

```


#### POST a new opinion vote: /api/opinion_votes/topicId/:topicId/opinionId/:opinionId
Request body requires the following fields:
* String: type (convincing, debatable, savage, etc.)

Checks to make sure that the user has not already voted on a particular opinion.


Returns a response with status 200 and message "Opinion vote posted."
Otherwise returns a response with status 400 and message "User has already voted an opinion."


#### PUT (Edit) an existing opinion vote: /api/opinion_votes/topicId/:topicId/opinionId/:opinionId
Request body requires the following fields:
* String: type (convincing, debatable, savage, etc.)

#### DELETE an existing opinion vote: /api/opinion_votes/topicId/:topicId/opinionId/:opinionId
No additional notes.




## User API
#### GET User information: /api/user
Simple API call which can be used to check the admin status of a user (Perhaps for delete access?).
Ends up returning an object containing all of the user information. Returned object in format:
```javascript
{
	id: 1,
	fb_id: "10210619611520173",
	username: "Phil Foo",
	admin: true,
	createdAt: "2016-12-06T05:27:21.777Z",
	updatedAt: "2016-12-06T05:27:21.777Z"
}
```