import Outlet from "../models/outlet.model.js";
import {validate} from "../validations/validation.js";
import {
  addAndUpdateOutletValidation,
  searchOutletValidation,
} from "../validations/outlet-validation.js";
import {ResponseError} from "../error/response-error.js";
import idValidation from "../validations/id-validation.js";

const getAllOutlet = async (request) => {
  return Outlet.find( {} ).select("-createdAt -updatedAt -__v");
}

const getOutletById = async (outletId) => {
  const outlet_id = validate(idValidation, outletId);
  const outlet = await Outlet.findById(outlet_id).select("-createdAt -updatedAt -__v");

  if(!outlet) {
    throw new ResponseError(404, "Outlet not found");
  }

  return outlet;
}

const searchOutlet = async (request) => {
  const req = validate(searchOutletValidation, request);

  const outlets = await Outlet.find(
    { $text: { $search: req } },
    { score: {$meta: "textScore" } }
  ).sort( { score: { $meta: "textScore" } }).select("-createdAt -updatedAt -__v");

  if(!outlets) {
    throw new ResponseError(404, "Outlet not found");
  }

  return outlets;
}

const addOutlet = async (request) => {
  const req = validate(addAndUpdateOutletValidation, request);
  const outlet = await Outlet.exists( { name: req.name });

  if(outlet) {
    throw new ResponseError(400, "Outlet already exists");
  }
  const outletCreated = await Outlet.create(req);
  return Outlet.findById(outletCreated._id).select("-createdAt -updatedAt -__v");
}

const updateOutlet = async (request, outletId) => {
  const req = validate(addAndUpdateOutletValidation, request);
  const outlet_id = validate(idValidation, outletId);
  const updatedOutlet = await Outlet.findByIdAndUpdate(
    outlet_id,
    { $set: req },
    { new: true }
  ).select("-createdAt -updatedAt -__v");

  if(!updatedOutlet) {
    throw new ResponseError(404, "Outlet not found");
  }

  return updatedOutlet;
}

const deleteOutlet = async (outletId) => {
  const outlet_id = validate(idValidation, outletId);
  const outlet = await Outlet.findByIdAndDelete(outlet_id).select("-createdAt -updatedAt -__v");

  if(!outlet) {
    throw new ResponseError(404, "Outlet not found");
  }

  return null;
}

export default {
  getAllOutlet,
  getOutletById,
  searchOutlet,
  addOutlet,
  updateOutlet,
  deleteOutlet
}