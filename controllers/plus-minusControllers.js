const User = require("../models/userModel");
const Pm = require("../models/pmModel");

const getPlusMinusPage = async (req, res) => {
  try {
    const pagelimit = 10;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const total = await Pm.countDocuments();

    if (req.url === "/") {
      return res.redirect(`?page=1&limit=${pagelimit}`);
    }

    // Pagination o'zgaruvchisini aniqlash
    const pagination = {
      page,
      limit,
      pagelimit,
      pageCount: Math.ceil(total / limit),
    };

    const pms = await Pm.find()
      .sort({ createdAt: -1 }) // Teskari tartibda chiqarish
      .skip(page * limit - limit)
      .limit(limit);

    res.render("plus-minus/pm", {
      title: "Plus-minus",
      pms,
      user: req.session.user,
      pagination,
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
      category: req.body.category,
      name: req.body.name,
      amount: req.body.amount,
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
    res.redirect("/plus-minus");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getPlusMinusPage,
  addNewPlusPage,
  addNewPlus,
};
