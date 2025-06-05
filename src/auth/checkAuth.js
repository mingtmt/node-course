"use strict";

const req = require("express/lib/request");
const { findByKey } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: "Forbidden Error" });
    }

    // check api key
    const objKey = await findByKey(key);
    if (!objKey) {
      return res.status(403).json({ message: "Forbidden Error" });
    }
    req.objKey = objKey;

    return next();
  } catch (error) {}
};

const permissions = (permissions) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: "Permission denined" });
    }

    const validPermissions = req.objKey.permissions.includes(permissions);
    if (!validPermissions) {
      return res.status(403).json({ message: "Permission denined" });
    }

    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permissions,
  asyncHandler,
};
