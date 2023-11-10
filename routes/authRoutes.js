const { Router } = require("express");
const router = Router();
const {
  getloginSignUpPage,
  registerNewUser,
  loginUser,
  logout,
} = require("../controllers/authControllers");
const { guest } = require("../middlewares/auth");

router.get("/loginSignUp", guest, getloginSignUpPage);
router.post("/signUp", guest, registerNewUser);
router.post("/login", guest, loginUser);
router.get("/logout", logout);

module.exports = router;
