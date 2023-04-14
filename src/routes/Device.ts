import express from 'express';
import controller from '../controllers/Device';

const router = express.Router();

router.get('/getDevicesByClientId/:clientcode', controller.readDevicesByCliendID);
router.get('/readDeviceBYDeviceId/:deviceId', controller.readDeviceByDeviceId);
router.post('/createDevice', controller.createDevice);

export = router;
