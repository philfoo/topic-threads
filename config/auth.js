var FACEBOOK_CALLBACK = (process.env.NODE_ENV !== 'production') ? 'http://localhost:3001/login/callback' : 'http://topic-threads.herokuapp.com/login/callback';

module.exports = {
  'FACEBOOK_APP_ID'      : '1799462417008461', // your App ID
  'FACEBOOK_APP_SECRET'  : '87b58f37918dd4a9e74716a41c6e2e65', // your App Secret
  'FACEBOOK_CALLBACK'		: FACEBOOK_CALLBACK
};