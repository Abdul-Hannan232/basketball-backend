const authService = require("../services/AuthService");
const HttpStatus = require("../utils/ResponseStatus");
const register = async (req, resp, next) => {
  try {
    const user = await authService.register(req.body);
    if (user.status) {
      resp.status(user.status).json({ message: user.message });
    }
    resp
      .status(HttpStatus.CREATED)
      .json({ message: "Account Created Successfully ", data: user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, resp, next) => {
  try {
    const user = await authService.login(req);

    if (user.status) {
      resp.status(user.status).json({ message: user.message });
    }
    resp
      .status(HttpStatus.OK)
      .json({ message: "User Logged In Successfully", data: user });
  } catch (error) {
    next(error)
  }
};

const forgotPassword = async (req, resp, next) => {
  try {
    const resetToken = await authService.forgotPassword(req);
    if (resetToken.status) {
      resp.status(resetToken.status).json({ message: resetToken.message });
    }
    resp.send(resetToken);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, resp, next) => {
  try {
    const passwordUpdated = await authService.resetPassword(req.body);
    if (passwordUpdated.status) {
      resp.status(passwordUpdated.status).json({ message: passwordUpdated.message });
    }
    resp
      .status(HttpStatus.OK)
      .json({ message: "password Updated", details: passwordUpdated });
  } catch (error) {
    next(error);
  }
};

const validateToken = async (req, resp, next) => {
  try {
    const result = await authService.validateToken(req.body);

    return resp.status(result.status).json({ message: result.message });

  } catch (error) {
    return error
  }
}

const chanagePassword = async (req, resp, next) => {
   try {
    const passwordUpdated = await authService.changePassword(req.body);

     if (passwordUpdated.status !== HttpStatus.OK) {
      return resp.status(passwordUpdated.status).json({ message: passwordUpdated.message });
    }

     return resp.status(HttpStatus.OK).json({ message: passwordUpdated.message, user: passwordUpdated.user });
  } catch (error) {
    console.error("Error in chanagePassword:", error.message);
    next(error);  
  }
};


const socialMediaLogin = async (req, resp, next) => {
  try {
    const user = await authService.socialMediaLogin(req.body)
    // console.log("controller",user)
    if (user) {
      resp
      .status(HttpStatus.OK)
      .json({ message: "User Logged In Successfully", data: user });
    } 
   
  } catch (error) {
    next(error)
  }

};
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  validateToken,
  socialMediaLogin,
  chanagePassword
};
