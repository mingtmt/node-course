"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, privateKey, publicKey) => {
  try {
    // accessToken
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    // refreshToken
    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    // Verify the tokens
    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.error("Access token verification failed:", error);
      } else {
        console.log("Access token is valid:", decode);
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {}
};

module.exports = {
  createTokenPair,
};
