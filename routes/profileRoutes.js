const { Router } = require("express");
const router = Router();
const {
  getProfilePage,
  updateUserPage,
  updateUser,
} = require("../controllers/profileControllers");
const { protected } = require("../middlewares/auth");

router.get("/change", protected, updateUserPage);
router.post("/change", protected, updateUser);
router.get("/:_id", protected, getProfilePage);

module.exports = router;
