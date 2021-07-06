const express = require('express');

const router = express.Router();

const postDB = require('./postDb');

router.get('/', (req, res) => {
  // do your magic!
  postDB.get()
  .then(postList =>{
    res.status(200).json(postList)
  })
  .catch(err=>{
    res.status(500).json({message:'error in getting posts'})
  })
});

router.get('/:id',validatePostId, (req, res) => {
  // do your magic!
  postDB.getById(req.params.id)
  .then(post =>{
    res.status(200).json(post)
  })
  .catch(() =>{
    res.status(500).json({message:`error in getting post with id of ${req.params.id}`})
  }
  )
});

router.delete('/:id',validatePostId, (req, res) => {
  // do your magic!
  postDB.remove(req.params.id)
  .then(() =>{
    res.status(200).json({message: "the post has been deleted"})
  })
  .catch(err=>{
    res.status(500).json({message: 'there was an error in deleting the post'})
  })
});

router.put('/:id',validatePostId, validatePost, (req, res) => {
  // do your magic!
  const {id} = req.params;
  let changes = req.body;
  postDB.update(id,changes)
  .then(post =>{
    res.status(201).json(changes)
  })
  .catch(err =>{
    res.status(500).json({message:"error in updating changes to the post"})
  })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const {id} = req.params;
  postDB.getById(id)
  .then(post =>{
    if(post){
      req.post = post;
      next();
    }else{
      res.status(400).json({message: "invalid post ID"})
    }
  })
  .catch(err=>{
    res.status(500).json({message:"error",err})
  })
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
