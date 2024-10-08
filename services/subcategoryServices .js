const SubCategoryModel = require("../models/subCategoryModel");

const factory = require("./handlersFactory");

// subCateqory middleware
exports.setCategoryIdToBody = async (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }

  next();
};

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };

  req.filterObject = filterObject;
  next();
};

// create SubCategory
exports.createSubCategory = factory.createOne(SubCategoryModel);

// get all SubCategory
exports.getAllSubCategory = factory.getAll(SubCategoryModel);

// get specific SubCategory

exports.getSubCategory = factory.getOne(SubCategoryModel);

// update SubCategory

exports.updateSubCategory = factory.updateOne(SubCategoryModel);

// delete SubCategory
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);
