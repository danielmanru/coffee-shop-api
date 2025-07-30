import outletService from "../services/outlet-service.js";

const getAllOutlet = async (req, res, next) => {
  try {
    const result = await outletService.getAllOutlet();
    return res.status(200).json({
      success: true,
      message: 'Success get all outlets',
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const searchOutlet = async (req, res, next) => {
  try {
    const result = await outletService.searchOutlet(req.query.search);
    return res.status(200).json({
      success: true,
      message: 'Success get outlet searched',
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const getOutletById = async (req, res, next) => {
  try {
    const result = await outletService.getOutletById(req.params.outletId);
    return res.status(200).json({
      success: true,
      message: "Success get outlet with id "+req.params.outletId,
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const addOutlet = async (req, res, next) => {
  try {
    const result = await outletService.addOutlet(req.body);
    return res.status(201).json({
      success: true,
      message: "Success add new outlet",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const updateOutlet = async (req, res, next) => {
  try {
    const result = await outletService.updateOutlet(req.body, req.query.outletId);
    return res.status(200).json({
      success: true,
      message: "Success Update Outlet with id "+req.query.outletId,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const deleteOutlet = async (req, res, next) => {
  try {
    const result = await outletService.deleteOutlet(req.query.outletId);
    return res.status(200).json({
      success: true,
      message: "Success delete outlet with id "+req.query.outletId,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllOutlet,
  searchOutlet,
  getOutletById,
  addOutlet,
  updateOutlet,
  deleteOutlet
}