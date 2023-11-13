const { Router } = require("express");
const router = Router();
const { getPlusMinusPage } = require("../controllers/plus-minusControllers");

router.get("/PM", getPlusMinusPage);

module.exports = router;
