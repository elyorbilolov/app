const { Router } = require("express");
const router = Router();
const {
  getPlusMinusPage,
  addNewPlusPage,
  addNewPlus,
} = require("../controllers/plus-minusControllers");
const { protected } = require("../middlewares/auth");

router.get("/", protected, getPlusMinusPage);
router.get("/padd", protected, addNewPlusPage);
router.post("/padd", protected, addNewPlus);

module.exports = router;
