const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
          message: 'failed',
          details: 'Access token missing'
        });
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({  
              message: 'error',
              details: 'Invalid or expired token' });
        }
        req.user = user;
        
        next();
    });
};

module.exports = authenticateToken;
