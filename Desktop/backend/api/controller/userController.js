const user = require('../model/user');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const getOneProfiles = (req, res) => {
  const { email, password } = req.query;
  

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  user
    .findOne({ email, password }, { password: 0 }) 
    .then((data) => {
      if (!data) {
        return res.status(404).json({ message: "Profile not found." });
      }
      return res.json(data);
    })
    .catch((err) => {
      return res.json({ Error: err });
    });
};

const newProfile = (req, res) => {
  console.log("newuser")
  const { email, username, password, phonenumber, address,admin } = req.body;
  console.log(admin);

  user
    .findOne({ username: username })
    .then((data) => {
      if (!data) {
        const newUser = new user({
          email: email,
          username: username,
          password: password,
          phonenumber: phonenumber,
          address: address,
          filename:req.file.filename,
          admin:admin
        });

        // Check if an image was uploaded
        if (req.file) {
          newUser.filename = req.file.filename;
        }
        console.log(newUser.filename);

        return newUser.save();
      } else {
        throw new Error("Details already exist");
      }
    })
    .then((data) => {
      // const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
      // res.setHeader('Authorization', `Bearer ${token}`);
      console.log(data);
      res.json(data);
    })
    .catch((err) => {
      // Delete the uploaded image if something goes wrong
      if (req.file) {
        fs.unlinkSync(`uploads/${req.file.filename}`);
      }

      return res.json({ Error: err.message || "Something went wrong, please try again." });
    });
};

const updateUserPassword = (req, res) => {
  const { email, newPassword } = req.body;

  // Check if email and newPassword are provided
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and newPassword are required." });
  }

  // Find the user by email and update the password
  user.findOneAndUpdate(
    { email }, // Use only email field to find the user
    { password: newPassword }, // Update the password field
    { new: true }
  )
    .then((updatedData) => {
      if (!updatedData) {
        return res.status(404).json({ message: "User not found." });
      }
      console.log("Password updated successfully:", updatedData);
      return res.json({ message: "Password updated successfully." });
    })
    .catch((err) => {
      console.error("Error updating password:", err);
      return res.status(500).json({ message: "Failed to update password." });
    });
};

const updateUserProfile = (req, res) => {
  const { email, username, phonenumber, address } = req.body; // Remove password field

  user.findOneAndUpdate(
    { email }, // Use only email field to find the user
    { username, phonenumber, address }, // Update other fields except password
    { new: true }
  )
    .then((updatedData) => {
      if (!updatedData) {
        return res.status(404).json({ message: "Profile not found." });
      }
      console.log("Updated Data:", updatedData);
      return res.json(updatedData);
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
      return res.status(500).json({ message: "Failed to update profile." });
    });
};

const deleteUserProfile = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  user.deleteOne({ email })
    .then((data) => {
      if (data.deletedCount === 0) {
        return res.status(404).json({ message: "Profile not found." });
      } else {
        return res.json({ message: "Profile deleted." });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: "Failed to delete profile." });
    });
};

const uploadProfileImage = async (req, res) => {
  const { email } = req.params;
  console.log(email);
  console.log('Received image upload request');
  console.log(req.file);

  try {
    const foundUser = await user.findOne({ email });
    console.log(foundUser);

    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).send('No image file');
    }

    foundUser.filename = req.file.filename;
    await foundUser.save();

    res.status(200).send('Image uploaded successfully');
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

const getProfileImage = async (req, res) => {
  const { email } = req.params;
  console.log(email);

  try {
    const photo = await user.findOne({ email });

    if (!photo || !photo.filename) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const imagePath = path.join(__dirname, '..', 'upload', photo.filename);
    res.sendFile(imagePath);
  } 
  
  catch (error) {
    console.error('Error fetching image by ID:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
};

module.exports = {
  newProfile,
  getOneProfiles,
  updateUserProfile,
  deleteUserProfile,
  updateUserPassword,
  uploadProfileImage,
  getProfileImage
};
