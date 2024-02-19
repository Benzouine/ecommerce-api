const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/ApiError");
const FeaturesApi = require("../utils/FeaturesApi");

exports.getDocuments = (Model) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const features = new FeaturesApi(Model.find(filter), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const documents = await features.query;
    res
      .status(200)
      .json({ status: "success", results: documents.length, data: documents });
  });

exports.createDocument = (Model) =>
  asyncHandler(async (req, res) => {
    const { name } = req.body;

    const document = await Model.create(req.body);

    res.status(201).json({ status: "success", data: document });
  });

exports.getOneDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ status: "success", data: document });
  });

exports.updateDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ status: "success", data: document });
  });

exports.deleteDocument = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(204).send();
  });
