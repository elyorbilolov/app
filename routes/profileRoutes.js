const { Router } = require("express");
const router = Router();
const { getProfilePage } = require("../controllers/profileControllers");

router.get("/:_id", getProfilePage);

module.exports = router;
