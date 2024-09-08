const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const generateToken = require('../Controllers/generateToken')
const jwtAuth = require('../Controllers/jwtAuth')
// const { deleteModel } = require('mongoose')

const userRoutes = express.Router()

//     defining schema and model

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
})

const User = mongoose.model("User", userSchema)

//// Admin create for first time

userRoutes.post('/create-admin', async (req, res) => {
  try {
    const userInfo = {
      username: 'admin',
      password: 'admin',
      role: 'admin'
    }
    const user = new User(userInfo)
    await user.save()
    res.json({
      success: true,
      message: 'Admin user created successfully!'
    })
  } catch (error) {
    console.log(error.message)
    res.json({
      success: false,
      message: 'Internal server error!'
    })
  }
})

////        Create User

userRoutes.post('/create', jwtAuth, async (req, res) => {
  try {
    const { role } = req.user
    if (role === 'admin') {
      const newUser = User(req.body)
      await newUser.save()
      res.status(200).json({
        success: true,
        message: 'User added successfully!'
      })
    } else {
      res.json({
        success: false,
        message: 'Access denied!'
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    })
  }
})

/////     login route

userRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username: username, password: password })
    if (user) {
      const token = generateToken(user)
      res.status(200).json({
        success: true,
        token: token
      })
    } else {
      res.status(200).json({
        success: false,
        message: "invalid credential!"
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: "Internal server error!"
    })
  }
})

////      Get username and role 

userRoutes.post('/username', jwtAuth, async (req, res) => {
  try {
    const { username, role } = req.user
    res.status(200).json({
      success: true,
      username: username,
      role: role
    })
  } catch (error) {
    console.log(error.message)
    res.json({
      success: false,
      message: "Something went wrong!"
    })
  }

})

//////       Change Pass

userRoutes.put('/update', jwtAuth, async (req, res) => {
  try {
    const { username } = req.user
    const { password, newPassword } = req.body
    const updatedUser = await User.findOneAndUpdate(
      {
        username: username,
        password: password
      },
      {
        password: newPassword
      }
    )
    console.log(updatedUser)
    if (updatedUser) {
      res.status(200).json({
        success: true,
      })
    } else {
      res.json({
        success: false
      })
    }
  } catch (error) {
    console.log(error.message)
  }
})

///     Get all user data and role

userRoutes.post('/all-user', jwtAuth, async (req, res) => {
  const { role } = req.user

  if (!role === 'admin') {
    res.json({
      success: false,
      message: 'Unauthorized'
    })
    return
  }

  try {
    if (role === 'admin') {
      const users = await User.find({})
      const allUser = users.map((item) => {
        return {
          username: item.username,
          role: item.role,
          id: item._id
        }
      })
      res.status(200).json({
        success: true,
        allUser: allUser
      })
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

///       delete user

userRoutes.post('/delete', jwtAuth, async (req, res) => {
  const { role, username } = req.user
  if (role !== 'admin') {
    return res.json({
      success: false,
      message: "Unauthorized"
    })
  }
  if (role === 'admin') {
    try {

      const { _id, currentUser } = req.body
      if (username === currentUser) {
        return res.json({
          success: false,
          message: 'You cannot delete your own account!'
        })
      }

      await User.findOneAndDelete({ _id: _id })
      res.status(200).json({
        success: true,
        message: 'User deleted successfully!'
      })
    } catch (error) {
      console.log(error.message)
      res.json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
})


module.exports = userRoutes