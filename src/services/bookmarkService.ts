import { bookmarkModel, bookmarkModelType } from '../models';
import { BookmarkInterface } from '../models/schemas/bookmark';
import { missingPersonService, userService } from '../services';
// 비즈니스 로직은 여기서!!
class BookmarkService {
  private Bookmark: bookmarkModelType;

  // 의존성 주입
  constructor(bookmarkModel: bookmarkModelType) {
    this.Bookmark = bookmarkModel;
  }
  //북마크 가져오기
  async findBookmark(uid: string) {
    const bookmarkCase = await this.Bookmark.find({ uid }, { key: 1, _id: 0 });

    return await Promise.all(
      bookmarkCase.map((e) => {
        return this.getCase(e.key);
      })
    );
  }

  //북마크 생성
  async createBookmark(bookmarkInfo: BookmarkInterface) {
    return await this.Bookmark.create(bookmarkInfo);
  }
  async getCase(key: any) {
    const bookmark = await missingPersonService.getCaseBykey(key);
    return new Promise((resolve, reject) => {
      resolve(bookmark);
      reject('fail get case');
    });
  }

  async getUserInfo(uid: string) {
    return await userService.getUserInfo(uid);
  }
  //북마크 하나 삭제
  async deleteBookmark(caseId: string) {
    return await this.Bookmark.findOneAndDelete({ _id: caseId });
  }
}

const bookmarkService = new BookmarkService(bookmarkModel);

export { bookmarkService };
