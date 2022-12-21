import { noticeModel, noticeModelType } from '../models';

class GuestService {
  private noticeModel: noticeModelType;

  constructor(noticeModel: noticeModelType) {
    this.noticeModel = noticeModel;
  }

  async getNotice() {
    const notices = await this.noticeModel.find({});
    return notices;
  }

  async getAppinfo() {
    return {
      appinfo: process.env.APP_VERSION ?? '0.1.1',
      appstore: process.env.APPSTORE_LINK ?? '',
      playstore: process.env.PLAYSTORE_LINK ?? '',
    };
  }
}

const guestService = new GuestService(noticeModel);

export { guestService };
