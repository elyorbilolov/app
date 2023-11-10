const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const getloginSignUpPage = (req, res) => {
  if (!req.session.isLogged) {
    res.render("auth/loginSignUp", {
      title: "Login_SignUp",
      loginError: req.flash("loginError"),
      regError: req.flash("regError"),
    });
  }
};

const registerNewUser = async (req, res) => {
  try {
    const { email, username, phone, password, password2 } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      req.flash("regError", "Bunday foydalanuchi bazada bor");
      return res.redirect("/auth/loginSignUp");
    }

    if (password !== password2) {
      req.flash("regError", "Parollar mos tushmayapti");
      return res.redirect("/auth/loginSignUp");
    }

    await User.create({
      email,
      username,
      phone,
      password,
    });

    return res.redirect("/auth/loginSignUp");
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      const matchPassword = await bcrypt.compare(
        req.body.password,
        userExist.password
      );
      if (matchPassword) {
        req.session.user = userExist;
        req.session.isLogged = true;
        req.session.save((err) => {
          if (err) throw err;
          res.redirect("/profile/" + req.session.user._id);
        });
      } else {
        req.flash("loginError", "Notogri malumot kiritildi");
        res.redirect("/auth/loginSignUp");
      }
    } else {
      req.flash("loginError", "Bunday foydalanuvchi mavjud emas");
      res.redirect("/auth/loginSignUp");
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = (req, res) => {
  const sessionId = req.session._id; // O'chirilayotgan sessiya ID'si
  req.session.destroy(() => {
    // Sessiyani o'chirish
    if (sessionId) {
      // Sessiya MongoDB'da saqlangan sessiyalardan o'chiriladi
      YourSessionModel.deleteOne({ _id: sessionId }, (err) => {
        if (err) {
          console.log("Sessiyani o'chirishda xatolik yuz berdi:", err);
        }
        res.redirect("/");
      });
    } else {
      res.redirect("/");
    }
  });
};

module.exports = { getloginSignUpPage, registerNewUser, loginUser, logout };
