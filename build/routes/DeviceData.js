"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var DeviceData_1 = __importDefault(require("../controllers/DeviceData"));
var router = express_1.default.Router();
router.get('/readDeviceDataByDeviceID/:device_Id', DeviceData_1.default.readDeviceDataByDeviceID);
router.get('/readHistoricalDeviceDataByDeviceIDVariableName/:device_Id/:minutes', DeviceData_1.default.readHistoricalDeviceDataByDeviceIDVariableName);
module.exports = router;
