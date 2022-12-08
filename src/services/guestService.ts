import {
  appinfoModel,
  appinfoModelType,
  noticeModel,
  noticeModelType,
} from '../models';

class GuestService {
  private noticeModel: noticeModelType;
  private appinfoModel: appinfoModelType;

  constructor(noticeModel: noticeModelType, appinfoModel: appinfoModelType) {
    this.noticeModel = noticeModel;
    this.appinfoModel = appinfoModel;
  }

  async getNotice() {
    const notices = await this.noticeModel.find({});
    return notices;
  }

  async getAppinfo() {
    const appinfo = await this.appinfoModel.findOne({});
    return appinfo;
  }
}

const guestService = new GuestService(noticeModel, appinfoModel);

export { guestService };
