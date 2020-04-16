const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require ('express')();
admin.initializeApp();


var config = {
  apiKey: "AIzaSyC4wVCgle4ykHKhYQCB9im-S6KsCRSycm8",
  authDomain: "social-app-c4995.firebaseapp.com",
  databaseURL: "https://social-app-c4995.firebaseio.com",
  projectId: "social-app-c4995",
  storageBucket: "social-app-c4995.appspot.com",
  messagingSenderId: "56575194694",
  appId: "1:56575194694:web:93afa85816c29a9f58fc47",
  measurementId: "G-4YNGPF9D87"
};

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/posts', (req, res) => {
  admin
    .firestore()
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let posts = [];
      data.forEach((doc) => {
        posts.push({
          postId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount
        });
      });
      return res.json(posts);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
});

// Post one post
app.post('/post', (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }

  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  admin
    .firestore()
    .collection('posts')
    .add(newPost)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
      return 
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
});

// Signup route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  
  // TODO validate data
  
  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
  .then(data => {
    return res.status(201).json({message: `user ${data.user.uid} signed up successfully`})
  })
  .catch(err => {
    console.err(err);
    return res.status(500).json({ error: err.code })
  });
});


exports.api = functions.region('europe-west1').https.onRequest(app);

