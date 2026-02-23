const AddProduct = (req, res) => {
  console.log("Products route");
  res.send("Products route");
};

const AddMobiles = (req, res) => {
  console.log("Mobiles route");
  res.send("Mobiles route");
};

module.exports = {
  AddProduct,
  AddMobiles,
};
