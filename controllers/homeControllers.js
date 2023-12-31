const Poster = require("../models/posterModel");

const getHomePage = async (req, res) => {
  const posters = await Poster.find();
  res.render("home", {
    title: "Home page",
    posters: posters.reverse().slice(0, 8),
    user: req.session.user,
    isLogged: req.session.isLogged,
  });
};

module.exports = { getHomePage };
