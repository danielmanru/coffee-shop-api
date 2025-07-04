import outletService from "../services/outlet-service.js";

const getAllOutlet = async (req, res, next) => {
  try {
    const result = await outletService.getAllOutlet();
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const getOutletById = async (req, res, next) => {
  try {
    const result = await outletService.getOutletById(req.params.id);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const addOutlet = async (req, res, next) => {
  try {
    const result = await outletService.addOutlet(req.body);
    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const  updateOutlet = async (req, res, next) => {
  try {
    const result = await outletService.updateOutlet(req.body, req.params.id);
    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteOutlet = async (req, res, next) => {
  try {
    const result = await outletService.deleteOutlet(req.params.id);
    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllOutlet,
  getOutletById,
  addOutlet,
  updateOutlet,
  deleteOutlet
}