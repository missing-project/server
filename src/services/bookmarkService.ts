import { bookmarkModel, bookmarkModelType } from '../models';
import { BookmarkInterface } from '../models/schemas/bookmark';
import { CaseInterface } from '../models/schemas/case';
import { logger } from '../winston';
// 비즈니스 로직은 여기서!!
class BookmarkService {
  private Bookmark: bookmarkModelType;

  // 의존성 주입
  constructor(bookmarkModel: bookmarkModelType) {
    this.Bookmark = bookmarkModel;
  }
  //북마크 가져오기
  async findBookmark(uid: string) {
    const response = await this.Bookmark.find({ uid }).populate<{
      key: CaseInterface;
    }>('key');
    return response
      ? response.map(({ key }) => key).filter((el) => !!el._id)
      : [];
  }

  private async isBookmarked(
    bookmarkInfo: BookmarkInterface
  ): Promise<boolean> {
    const isBookmarked = await this.Bookmark.findOne(bookmarkInfo);
    return !isBookmarked;
  }
  //북마크 생성
  async createBookmark(bookmarkInfo: BookmarkInterface) {
    const isBookmarked = await this.isBookmarked(bookmarkInfo);
    if (!isBookmarked) {
      logger.error('already created bookmark');
      throw new Error('이미 북마크 한 사건입니다. ');
    }
    return await this.Bookmark.create(bookmarkInfo);
  }

  //북마크 하나 삭제
  async deleteBookmark(info: BookmarkInterface) {
    return await this.Bookmark.findOneAndDelete(info);
  }
}

const bookmarkService = new BookmarkService(bookmarkModel);

export { bookmarkService };
