const Poster = require("../models/posterModel");
const User = require("../models/userModel");
const filtering = require("../utils/filtering");

const getPostersPage = async (req, res) => {
  try {
    const pagelimit = 10;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const total = await Poster.countDocuments();

    if (req.url === "/") {
      return res.redirect(`?page=1&limit=${pagelimit}`);
    }

    // Pagination o'zgaruvchisini aniqlash
    const pagination = {
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    };

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
        pagination, // Paginationni qo'shing
      });
    }

    if (!req.query.page || !req.query.limit) {
      const { category, from, to, region } = req.query;
      // $gte $lte $gt $lt
      const filterings = filtering(category, from, to, region);
      const posters = await Poster.find(filterings);

      return res.render("poster/searchResults", {
        title: "Filter results",
        posters: posters.reverse(),
        user: req.session.user,
        querySearch: req.query.search,
        pagination, // Paginationni qo'shing
      });
    }

    const posters = await Poster.find()
      .skip(page * limit - limit)
      .limit(limit);

    return res.render("poster/posters", {
      title: "Posters page",
      user: req.session.user,
      posters: posters.reverse(),
      pagination, // Paginationni qo'shing
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
      category: req.body.category,
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
      category: req.body.category,
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
