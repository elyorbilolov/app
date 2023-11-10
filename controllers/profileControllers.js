const User = require("../models/userModel");

const getProfilePage = async (req, res) => {
  try {
    const userProfile = await User.findOne({ _id: req.params._id }).populate(
      "posters"
    );
    if (!userProfile) throw new Error("Bunday foydalanuchi mavjud emas");

    let isMe = false;
    if (req.session.user) {
      isMe = userProfile._id == req.session.user._id.toString();
    }
    res.render("user/profile", {
      title: `${userProfile.username}`,
      userProfile,
      isMe,
      user: req.session.user,
      posters: userProfile.posters,
      isAuth: req.session.isLogged,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getProfilePage };
