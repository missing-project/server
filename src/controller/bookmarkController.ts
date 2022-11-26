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
        const bookmark = await bookmarkService.createBookmark(req.body);
        res.json(bookmark);
    },
    
    async getBookmark(req, res) {
        const { userId } = req.params;
        const bookmarks = await bookmarkService.findBookmark(userId);
        res.json(bookmarks);
    },
        
    async deleteOneBookmark(req, res) {
        const caseKey = req.params.caseKey;
        const userId = req.params.userId;
        const deleteOne = await bookmarkService.deleteBookmark(userId, caseKey);
        res.json(deleteOne);
    },
};
