const Product = require('./product');
const User = require('./user');

// Product Services
exports.getProducts = async function (query) {
  const products = Product.find(query).select('-_id -__v');
  return products;
};

exports.getProductSku = async function (request) {
  const SKU = Product.findOne({ sku: request.params.sku }).select('-_id -__v');
  return SKU;
};

exports.deleteProductSku = async function (request) {
  Product.deleteOne({ sku: request.params.sku });
  return null;
};

exports.putProductSku = async function (request, sku, product) {
  Product.findOneAndReplace({ sku }, product, {
    upsert: true,
  });
};

exports.patchProductSku = async function (request, sku, product) {
  Product.findOneAndUpdate({ sku }, product, {
    new: true,
  })
    .select('-_id -__v');
};

// User Services
exports.getUsers = async function (query) {
  const users = User.find(query).select('-_id -__v');
  return users;
};

exports.patchUserSsn = async function (ssn, user) {
  User.findOneAndUpdate({ ssn }, user, {
    new: true,
  });
};
