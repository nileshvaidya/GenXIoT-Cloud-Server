import express from 'express';
import controller from '../controllers/DeviceData';

const router = express.Router();

router.get('/readDeviceDataByDeviceID/:device_Id', controller.readDeviceDataByDeviceID);
router.get('/readHistoricalDeviceDataByDeviceIDVariableName/:device_Id/:minutes', controller.readHistoricalDeviceDataByDeviceIDVariableName);
// router.post('/createDevice', controller.);

export = router;
