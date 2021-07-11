require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

// @route   GET api/users
// @desc    Get user with email address
// @access  Public
router.get(
  "/",
  [
    check("email", "Email is required.").not().isEmpty(),
    check("email", "Please enter a valid email.").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    try {
      // Find user by email
      let user = await User.findOne({
        email,
      });

      if (!user) {
        console.log("email not found");
      } else {
        console.log(user);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// @route POST api/users
// @desc Register user
// @ access Public
router.post(
  "/",
  [
    check("firstName", "First name is required.").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      let user = await User.findOne({
        email,
      });

      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg:
                "One or more of those credentials are already associated with an account. Try logging in or resetting your password.",
            },
          ],
        });
      }

      user = new User({
        firstName,
        lastName,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            if(err) throw err;
            res.json({ token})
          }
      )

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
