import Outlet from "../model/outlet.model.js";
import {validate} from "../validation/validation.js";
import {
  addAndUpdateOutletValidation,
  searchOutletValidation,
} from "../validation/outlet-validation.js";
import {ResponseError} from "../error/response-error.js";
import idValidation from "../validation/id-validation.js";

const getAllOutlet = async (request) => {
  const outlets = await Outlet.find( {} );
}

const getOutletById = async (outletId) => {
  const outlet_id = validate(idValidation, outletId);
  const outlet = await Outlet.findById(outlet_id);

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
  ).sort( { score: { $meta: "textScore" } });

  if(!outlets) {
    throw new ResponseError(404, "Outlet not found");
  }

  return outlets;
}

const addOutlet = async (request) => {
  const req = validate(addAndUpdateOutletValidation(request));
  const outlet = await Outlet.exists( { name: req.name });

  if(outlet) {
    throw ResponseError(400, "Outlet already exists");
  }

  return Outlet.create(req);
}

const updateOutlet = async (request, outletId) => {
  const req = validate(addAndUpdateOutletValidation, request);
  const outlet_id = validate(idValidation, outletId);
  const updatedOutlet = await Outlet.findByIdAndUpdate(
    outlet_id,
    { $set: req },
    {$new: true}
  );

  if(!updatedOutlet) {
    throw new ResponseError(404, "Outlet not found");
  }

  return updatedOutlet;
}

const deleteOutlet = async (outletId) => {
  const outlet_id = validate(idValidation, outletId);
  const outlet = await Outlet.findByIdAndDelete(outlet_id);

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