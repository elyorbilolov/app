const User = require("../models/userModel");
const Pm = require("../models/pmModel");

const getPlusMinusPage = async (req, res) => {
  try {
    const pms = await Pm.find();
    res.render("plus-minus/pm", {
      title: "Plus-minus",
      pms,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
};

const addNewPlusPage = (req, res) => {
  res.render("plus-minus/padd", {
    title: "Daromad qoshish",
    user: req.session.user,
  });
};

const addNewPlus = async (req, res) => {
  try {
    const newPlus = new Pm({
      title: req.body.title,
      amount: req.body.amount,
      region: req.body.region,
      category: req.body.category,
      description: req.body.description,
      author: req.session.user._id,
    });

    const pmSaved = await newPlus.save();
    const posterId = pmSaved._id;

    await User.findByIdAndUpdate(
      req.session.user._id,
      {
        $push: { pms: posterId },
      },
      { new: true, upsert: true }
    );
    res.redirect("/plus-minus/" + posterId);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getPlusMinusPage, addNewPlusPage, addNewPlus };
