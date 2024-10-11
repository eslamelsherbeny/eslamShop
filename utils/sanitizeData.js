// sanatize Data
exports.sanatizeData = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
});
