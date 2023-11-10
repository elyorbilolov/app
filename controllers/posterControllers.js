const Poster = require("../models/posterModel");
const User = require("../models/userModel");

const getPostersPage = async (req, res) => {
  try {
    if (req.query.search) {
      const { search } = req.query;
      const posters = await Poster.searchPartial(search, (err, data) => {
        if (err) throw new Error();
      });
      return res.status(200).render("poster/searchResults", {
        title: "Search results",
        posters: posters.reverse(),
        user: req.session.user,
        querySearch: req.query.search,
      });
    }

    const posters = await Poster.find();
    res.render("poster/posters", {
      title: "Posters page",
      user: req.session.user,
      posters: posters.reverse(),
    });
  } catch (error) {
    console.log(error);
  }
};

const addNewPosterPage = (req, res) => {
  res.render("poster/add-poster", {
    title: "Yangi e'lon qo'shish",
    user: req.session.user,
  });
};

const addNewPoster = async (req, res) => {
  try {
    const newPoster = new Poster({
      title: req.body.title,
      amount: req.body.amount,
      region: req.body.region,
      image: "uploads/" + req.file.filename,
      description: req.body.description,
      author: req.session.user._id,
    });

    const posterSaved = await newPoster.save();
    const posterId = posterSaved._id;

    await User.findByIdAndUpdate(
      req.session.user._id,
      {
        $push: { posters: posterId },
      },
      { new: true, upsert: true }
    );
    res.redirect("/posters/" + posterId);
  } catch (error) {
    console.log(error);
  }
};

const getOnePoster = async (req, res) => {
  try {
    const poster = await Poster.findByIdAndUpdate(
      req.params.id,
      { $inc: { visits: 1 } },
      { new: true }
    ).populate("author");
    res.render("poster/one", {
      title: "One",
      poster,
      user: req.session.user,
      author: poster.author,
    });
  } catch (error) {
    console.log(error);
  }
};

const getEditPosterPage = async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id);
    res.render("poster/edit-poster", {
      title: "Edit page",
      poster,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
};

const updatePoster = async (req, res) => {
  try {
    const editedPoster = {
      title: req.body.title,
      amount: req.body.amount,
      region: req.body.region,
      image: "uploads/" + req.file.filename,
      description: req.body.description,
    };
    await Poster.findByIdAndUpdate(req.params.id, editedPoster);
    res.redirect("/posters");
  } catch (error) {
    console.log(error);
  }
};

const deletePoster = async (req, res) => {
  try {
    await Poster.findByIdAndDelete(req.params.id);

    const user = await User.findOne({ posters: req.params.id });

    if (user) {
      // User modellari ichidan bu poster ID'si bilan yangilanadi
      user.posters = user.posters.filter(
        (posterId) => posterId.toString() !== req.params.id
      );

      await user.save();
    }

    res.redirect("/posters");
  } catch (error) {
    console.log(error);
    res.status(500).send("Xatolik yuz berdi");
  }
};

module.exports = {
  getPostersPage,
  addNewPosterPage,
  addNewPoster,
  getOnePoster,
  getEditPosterPage,
  updatePoster,
  deletePoster,
};
