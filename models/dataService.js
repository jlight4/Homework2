const Product = require('./product');
const User = require('./user');

// PRODUCT SERVICES
exports.getProducts = function (query) {
  const products = Product.find(query).select('-_id -__v');
  return products;
};

exports.getProductSku = function (request) {
  const SKU = Product.findOne({ sku: request.params.sku }).select('-_id -__v');
  return SKU;
};

exports.postProduct = async function (request) {
  await new Product(request.body).save();
};

exports.deleteProduct = function (request) {
  Product.deleteMany(request.query);
};

exports.deleteProductSku = function (request) {
  Product.deleteOne({ sku: request.params.sku });
};

exports.putProductSku = function (request, sku, product) {
  const result = Product.findOneAndReplace({ sku }, product, { upsert: true });
  return result;
};

exports.patchProductSku = function (sku, product) {
  const result = Product.findOneAndUpdate({ sku }, product, {
    new: true,
  })
    .select('-_id -__v');
  return result;
};

// USER SERVICES
exports.getUsers = function (query) {
  const users = User.find(query).select('-_id -__v');
  return users;
};

exports.postUser = async function (request) {
  await new User(request.body).save();
};

exports.deleteUsers = function (request) {
  Product.deleteMany(request.query);
};

exports.putUserSsu = function (ssu, user) {
  const result = Product.findOneAndReplace({ ssu }, user, { upsert: true });
  return result;
};

exports.patchUserSsn = function (ssu, user) {
  const result = Product.findOneAndUpdate({ ssu }, user, {
    new: true,
  })
    .select('-_id -__v');
  return result;
};
