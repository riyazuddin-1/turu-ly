import { ObjectId } from "mongodb";
import Database from "../../shared/services/db.js";
import Hashing from "../../shared/services/hashing.js";
import JWT from "../../shared/services/jwt.js";
import { checkUsername } from "../../helpers/username.js";
import { findUser } from "../../helpers/user.js";
import {
  sendVerificationEmail,
  verifyPasswordReset,
  verifyUserAccount,
} from "../../helpers/verification.js";

const Users = new Database("vector", "users");
const hashing = new Hashing();
const jwt = new JWT();

export const loginHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { app } = req.params;

    const { user, password: hashedPassword } = await findUser(
      username ? { username } : { email },
      app,
    );

    if (!hashing.compare(password, hashedPassword)) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = jwt.create(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(error?.status || 500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

export const signupHandler = async (req, res) => {
  try {
    const { username, email, password, name, first_name, last_name } = req.body;
    const { app } = req.params;

    const hashed = hashing.create(password);

    const payload = {
      ...(name ? { name } : { first_name, last_name }),
      ...(username && { username }),
      ...(email && { email }),
      password: hashed,
      app,
      isVerified: false,
    };

    const inserted = await Users.insertOne(payload);

    console.log("User doc created:", inserted, payload);

    if (!inserted) {
      return res.status(500).json({
        success: false,
        message: "Failed to create user",
      });
    }

    delete payload.password;
    payload.userid = inserted.insertedId;

    await sendVerificationEmail(payload);

    return res.status(200).json({
      success: true,
      message: `User signed up with ${app}. Verification mail sent to ${email}`,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(error?.status || 500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

export const verifyUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const { app } = req.params;

    const found = await checkUsername(app, username);

    if (found) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Username available",
    });
  } catch (error) {
    console.error("Verify username error:", error);
    return res.status(error?.status || 500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { app, email } = req.body;

    const { user } = await findUser({ email }, app);

    await sendPasswordResetEmail(user);

    return res.status(200).json({
      success: true,
      message: `Verification mail is sent to ${email}`,
    });
  } catch (error) {
    if (error?.code === "user_not_found") {
      return res.status(200).json({
        success: true,
        message: `Verification mail is sent to ${email}`,
      });
    } else
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
  }
};

export const changePassword = async (req, res) => {
  try {
    const {
      app,
      newPassword,
      userVerificationId: user_verification_id,
      verificationCode: verification_code,
    } = req.body;

    const { userId } = verifyPasswordReset({
      app,
      user_verification_id,
      verification_code,
    });

    const hashed = hashing.create(newPassword);

    const updated = await Users.updateOne(
      {
        _id: userId,
        app,
      },
      {
        $set: {
          password: hashed,
        },
      },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Failed to update password for specified user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error("Verify username error:", error);
    return res.status(error?.status || 500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

export const verifyAccount = async (req, res) => {
  try {
    const { user_verification_id, verification_code, app } = req.query;

    const result = await verifyUserAccount({
      user_verification_id,
      verification_code,
    });

    const { user } = await findUser({ _id: result.userId }, app);

    const token = jwt.create(user);

    return res.status(200).json({
      success: result.verified,
      message: result.message,
      token,
      data: user,
    });
  } catch (error) {
    console.error("Verify account error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const payload = req.body;
    const { userid } = req.user;

    /**
     * TODO:
     * Handle email updation, to verify email
     */

    const updated = await Users.updateOne(
      { _id: new ObjectId(userid) },
      { $set: payload },
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Could not update user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
