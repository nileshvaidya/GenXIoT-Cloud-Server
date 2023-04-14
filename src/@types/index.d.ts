declare interface IDevice{
  name : string,
  device_type_id: string,
  clientCode: string,
  locationCode: string,
  appCode: string,
  fetchFrequency: number,
  isActive: boolean,
  alarmOn: boolean,
  alertOn: boolean,
  createdBy: string,
  createdon: Date,
  updatedOn: Date,
}