const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

const store = new MongoStore({
  collection: "sessions",
  uri: process.env.MONGO_URI,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.user = req.user; // req.user avtentifikatsiya orqali olingan foydalanuvchi ma'lumotlari
  next();
});

app.use("/", require("./routes/homeRoutes"));
app.use("/posters", require("./routes/posterRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/profile", require("./routes/profileRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server runing on port: ${PORT}`));
