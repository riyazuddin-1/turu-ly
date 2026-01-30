export const validateLogin = (req, res, next) => {
  const { username, email } = req.body;
  const { app } = req.params;

  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: "Username or email is required",
    });
  }

  if (!app) {
    return res.status(400).json({
      success: false,
      message: "App name is required in params",
    });
  }

  next();
};

export const validateSignup = (req, res, next) => {
  const { username, email, name, first_name } = req.body;
  const { app } = req.params;

  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: "Username or email is required",
    });
  }

  if (!app) {
    return res.status(400).json({
      success: false,
      message: "App name is required in params",
    });
  }

  if (!name && !first_name) {
    return res.status(400).json({
      success: false,
      message: "User's name is required",
    });
  }

  next();
};
