const getPlusMinusPage = async (req, res) => {
  try {
    res.render("plus-minus/PM", {
      title: "Plus-minus",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getPlusMinusPage };
