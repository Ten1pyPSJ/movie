const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware('admin'), movieController.createMovie);
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.delete('/:id', authMiddleware('admin'), movieController.deleteMovie);
router.put('/:id', authMiddleware('admin'), movieController.updateMovie);

router.post('/:id/like', authMiddleware(), movieController.toggleLike);

router.post('/:id/dislike', authMiddleware(), movieController.toggleDislike);

router.post('/:id/comment', authMiddleware(), movieController.commentMovie);

module.exports = router;
