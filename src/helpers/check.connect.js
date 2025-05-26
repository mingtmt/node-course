"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

// This function counts the number of active connections to the MongoDB database
const countConnect = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of active connections: ${numConnections}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = numCores * 5; // Example threshold: 5 connections per CPU core
    if (numConnections > maxConnections) {
      console.warn(
        `High number of connections: ${numConnections} (max: ${maxConnections})`
      );
    }

    console.log(`Active connections: ${numConnections}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
  }, _SECONDS); // Check every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
