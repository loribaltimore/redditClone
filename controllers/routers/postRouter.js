let express = require('express');
let postRouter = express.Router({ mergeParams: true });
let { updatePost, renderPost, addComment, deleteComment } = require('../postController');
let { updatePostSession, sessionTimer } = require('../../middleware/session');
postRouter.use(sessionTimer);

postRouter.route('/')
    .get(renderPost)
    .put(updatePostSession)

postRouter.route('/comment')
    .delete(deleteComment);

module.exports = postRouter;