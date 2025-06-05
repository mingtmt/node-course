"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

const shopRoles = {
  SHOP: "shop",
  WRITER: "writer",
  EDITOR: "editor",
  ADMIN: "admin",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already exists with this email");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [shopRoles.SHOP],
    });

    if (newShop) {
      // create a privateKey, publicKey
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      console.log(privateKey, publicKey); // save these keys to the collection KeyStore

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        return {
          code: "xxxx",
          message: "Failed to create public key token",
        };
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString);

      console.log("publicKeyObject", publicKeyObject);
      // create token pair
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        privateKey,
        publicKeyString
      );
      console.log("created tokens", tokens);

      return {
        code: "201",
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email", "roles"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: "200",
      metadata: null,
    };
    // } catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;
