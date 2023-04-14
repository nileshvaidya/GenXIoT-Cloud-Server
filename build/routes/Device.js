"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var Device_1 = __importDefault(require("../controllers/Device"));
var router = express_1.default.Router();
router.get('/getDevicesByClientId/:clientcode', Device_1.default.readDevicesByCliendID);
router.get('/readDeviceBYDeviceId/:deviceId', Device_1.default.readDeviceByDeviceId);
router.post('/createDevice', Device_1.default.createDevice);
module.exports = router;
