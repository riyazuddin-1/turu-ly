import Database from "../shared/services/db.js";

const Users = new Database("vector", "users");

export const checkUsername = async (app, username) => {
  return await Users.findOne({
    app,
    username,
  });
};

/**
 *
 * @param {username || email || _id: (value)} identifier
 */
export const findUser = async (identifier, app) => {
  const user = await Users.findOne(
    {
      ...identifier,
      app,
    },
    {
      projection: {
        password: 1,
        name: 1,
        first_name: 1,
        last_name: 1,
      },
    },
  );
  if (!user) {
    const err = new Error("User not found");
    ((err.status = 404), (err.code = "user_not_found"));
    throw err;
  }
  user["userid"] = user._id;
  delete user._id;
  return {
    user: {
      ...user,
      app,
    },
    password: user.password,
  };
};
