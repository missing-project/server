import { BookmarkInterface } from './../models/schemas/bookmark';
import { bookmarkService } from '../services';
import { AsyncRequestHandler } from '../types';

interface bookmarkControllerInterface {
  getBookmark: AsyncRequestHandler;
  postBookmark: AsyncRequestHandler;
  deleteOneBookmark: AsyncRequestHandler;
}

/* 
컨트롤러에서는 비즈니스로직을 작성하지 마시오!      
req, res 활용하여 client와의 상호작용만을 다루는 레이어 입니다.
*/

export const bookmarkController: bookmarkControllerInterface = {
  async postBookmark(req, res) {
    const { uid } = req.body;
    const { key } = req.body;
    const info: BookmarkInterface = {
      uid,
      key,
    };
    const bookmark = await bookmarkService.createBookmark(info);
    res.json(bookmark);
  },

  async getBookmark(req, res) {
    const { uid } = req.body;
    const bookmarks = await bookmarkService.findBookmark(uid);
    res.json(bookmarks);
  },

  async deleteOneBookmark(req, res) {
    const { uid } = req.body;
    const { key } = req.body;
    const info: BookmarkInterface = {
      uid,
      key,
    };
    const deleteOne = await bookmarkService.deleteBookmark(info);
    res.json(deleteOne);
  },
};
