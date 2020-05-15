const express = require('express');
const db = require('./userDb.js');
const postsDB = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  const newUser = req.body;
  db.insert(newUser)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ message: 'error in posting new user to database' })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const { id } = req.params;
  let newPost = req.body;
  newPost.user_id = id;

  postsDB.insert(newPost)
    .then(post => res.status(201).json(post))
    .catch(() =>res.status(500).json({ 
      message: 'error in posting new post to database' 
    }))
});

router.get('/', (req, res) => {
  // do your magic!
  db.get()
    .then(userList => {
      res.status(200).json(userList)
    })
    .catch(err => {
      res.status(500).json({ message: 'error in getting users' })
    })

});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  db.getById(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({ message: `error in getting user with id of ${req.params.id}` })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  db.getUserPosts(req.params.id)
    .then(post => {
      if (post.length > 0) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: 'this user does not have any posts' })
      }
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  db.remove(req.params.id)
    .then(user => {
      res.status(200).json({ message: `The user has been removed` })
    })
    .catch(err => {
      res.status(500).json({ message: 'Error in removing user' })
    })

});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  const changes = req.body;
  db.update(req.params.id, changes)
    .then(name => {
      res.status(200).json(changes)
    }
    )
    .catch(err => {
      res.status(500).json({ error: 'error posting changes to database' })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  db.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'error', err })
    })

}

function validateUser(req, res, next) {
  // do your magic!
  const user = req.body.name
  if (!req.body) {
    res.status(400).json({ message: "missing user data" })
  } else if (!user) {
    res.status(400).json({ message: "missing required name field" })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "missing post data" })
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next();
  }
}

module.exports = router;
