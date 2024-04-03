const { Router } = require("express");
const user = require('./model/user');
const requestValidator = require('./middleware/requestValidator');
const userController = require('./controller/userController');



const router = Router();

//...........
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './upload',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
//..........

router.put('/user/profile/upload/:email', upload.single('image'), userController.uploadProfileImage);

router.get('/user/profile/image/:email', userController.getProfileImage);

router.post(
  "/user/login",
  requestValidator.validateLoginDetail(),
  requestValidator.validate,
  upload.single('image'),
  userController.newProfile
);

router.get("/user/login", userController.getOneProfiles);

router.put("/user/profile/update", userController.updateUserProfile);

router.put("/user/forgotPassword", userController.updateUserPassword);

router.delete("/user/profile/delete", userController.deleteUserProfile);

module.exports = router;
