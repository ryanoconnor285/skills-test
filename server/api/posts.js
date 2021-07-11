require("dotenv").config();
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

//  Models
const Post = require("../models/Post");

// @route POST api/posts
// @desc Upload a new post
// @access Private
router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  console.log(req.body)
  try {
    const { title, description } = req.body;
    const newPost = new Post({
      user: req.user.id,
      title,
      description
    });

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/posts
// @desc Get all posts
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/posts/:id
// @desc Get a post with an id
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/posts/:id
// @desc Delete a post with ID
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post Removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/comments/:id
// @desc Add a comment to post with an ID
// @access Private

router.put("/comments/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.comments.push({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
    });

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/likes/:id
// @desc Like a post
// @access Private

router.put("/likes/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() === req.user.id) {
      return res.status(400).json({ msg: "You can not like your own post." });
    }
    // Check if post has already been liked by this user
    if (
      post.likes.filter((x) => x.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "You have already liked this post." });
    }
    
    post.likes.push({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/unlike/:id
// @desc Unlike a post
// @access Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.likes.filter((x) => x !== req.user.id);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
