const express = require('express');
const mongoose = require('mongoose');
const Post = require('./model');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const sortBy = req.query.sort;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const posts = {};

  try {
    const numPosts = await Post.countDocuments();

    if (endIndex < numPosts) {
      posts.next = {
        page: page + 1,
        limit: limit,
        sortBy
      };
    }

    if (page > 1) {
      posts.previous = {
        page: page - 1,
        limit: limit,
        sortBy
      };
    }

    posts.results = await Post.find()
      .sort(sortBy)
      .limit(limit)
      .skip(startIndex);

    //return res.json({ posts });
    res.render('blog', {
      posts: posts.results,
      previous: posts.previous,
      next: posts.next
    });
  } catch (error) {
    console.error(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const post = await Post.create({ ...req.body });
    res.json({ sucess: true, message: 'blog saved' });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
