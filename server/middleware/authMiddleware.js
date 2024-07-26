const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = (requiredRole = 'user') => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      if (!authHeader) {
        return res.status(401).json({ message: 'Нет авторизационного заголовка' });
      }

      const token = authHeader.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ message: 'Отсутствует токен' });
      }

      const decoded = jwt.verify(token, process.env.SECRET);
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: 'Неверный токен' });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Пользователь не найден' });
      }

      if (user.role !== requiredRole && requiredRole !== 'user') {
        return res.status(403).json({ message: 'Нет доступа' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Authorization error:', err);
      res.status(401).json({ message: 'Неверный токен', error: err.message });
    }
  };
};

module.exports = authMiddleware;
