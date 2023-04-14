Implement following filter for timestamp filtering

db.devicedatas.find({$and:[{"payload.timestamp":{"$gt":1658979000}},{"device_Id":"8876859491"}]}).pretty().count()
