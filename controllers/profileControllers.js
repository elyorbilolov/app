const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

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

const updateUserPage = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render("user/update", {
      title: `${req.session.user.username}`,
      user,
      changeError: req.flash("changeError"),
      isAuth: req.session.isLogged,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const { username, phone, oldPassword, newPassword } = req.body;
    if (oldPassword === "" && newPassword === "") {
      await User.findByIdAndUpdate(user._id, req.body);
      return res.redirect(`/profile/${user._id}`);
    }

    const matchPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!matchPassword) {
      req.flash("changeError", "Eski parolni notogri kiritdingiz");
      return res.redirect("/profile/change");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(user._id, {
      username,
      phone,
      password: hashedPassword,
    });
    return res.redirect(`/profile/${user._id}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getProfilePage, updateUserPage, updateUser };
