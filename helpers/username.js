import Database from "../shared/services/db.js";

export const checkUsername = async (app, username) => {
  const Users = new Database("vector", "users");
  return await Users.findOne({
    app,
    username,
  });
};
