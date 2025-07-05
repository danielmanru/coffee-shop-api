import userService from "../services/user-service.js";

const register = async (req, res, next) => {
  try{
    const result =  await userService.register(req.body);
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data : result
    })
  }catch(e){
    next(e);
  }
};

const sendVerificationEmail = async(req, res, next) => {
  try{
    const result = await userService.sendVerificationEmail(req.user.email);

    res.status(200).json({
      status : "PENDING",
      message : "An verification email is being sent to your email!"
    })
  } catch(e) {
    next(e);
  }
}

const verifyUser = async(req, res,next) => {
  try{
    const result = await userService.verifyUser(req);

    res.status(200).json({
      success: true,
      message: "User verified successfully",
      data : result
    })
  } catch(e) {
    next(e)
  }
}

const login = async(req, res, next) => {
  try{
    const result = await userService.login(req.body);
    res.status(200).json({
      success: true,
      message: "Login successfully",
      data : result,
    })
  }catch(e){
    next(e)
  }
}

const refreshToken = async(req, res, next) => {
  try{
    const result  = await userService.refreshToken(req.user);
    res.status(200).json({
      success: true,
      message: "New access token generated successfully",
      accessToken : result
    })
  }catch(e){
    next(e);
  }
}

const getUser = async (req, res, next) => {
  try{
    const email =  req.user.email;
    const result = await userService.getUser(email);
    res.status(200).json({
      success: true,
      message: "Successfully get user data",
      data : result
    });
  }catch(e){
    next(e);
  }
};

const updateUserDetail = async (req, res, next) => {
  try{
    const result = await userService.updateUserDetail(req.body, req.user.email);

    res.status(200).json({
      success: true,
      message: "Successfully update user data",
      data : result
    });
  }catch(e){
    next(e);
  }
};

const changePassword = async (req, res, next) => {
  try{
    const result = await userService.changePassword(req);
    res.status(200).json({
      success: true,
      message: "Successfully change password",
      data : result
    });
  } catch(e) {
    next(e);
  }
};

const forgetPassword = async (req, res, next) => {
  try{
    const result = await userService.forgetPassword(req.body);

    res.status(200).json(result);
  } catch(e) {
    next(e)
  }
};

const resetPassword = async (req, res, next) => {
  try{
    const result = await userService.resetPassword(req);
    res.status(200).json({
      success: true,
      message : "Password reset successfully",
      data : result
    });
  } catch(e) {
    next(e)
  }
}

const logout = async (req, res, next) => {
  try{
    const result = await userService.logout(req.user);
    res.status(200).json({
      success: true,
      message : "User successfully logged out",
      data : result,
    })
  } catch (e) {
    next(e);
  }
}

export default{
  register,
  login,
  getUser,
  updateUserDetail,
  changePassword,
  refreshToken,
  verifyUser,
  forgetPassword,
  resetPassword,
  sendVerificationEmail,
  logout,
}