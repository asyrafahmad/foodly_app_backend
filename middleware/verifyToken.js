const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) { 
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
            if (err) {
                return res.status(403).json({ status: false, message: 'Forbidden: Invalid Token' });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ status: false, message: 'Access Denied: You are not authenticated!' });
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Admin'|| req.user.userType === 'Vendor'|| req.user.userType === 'Driver' || req.user.userType === 'Client') {
            next();
        } else {
            res.status(403).json({ status: false, message: 'Forbidden: You are not allowed to access the routes.' });
        }
    });
};

const verifyVendor = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Vendor' || req.user.userType === 'Admin') {
            next();
        } else {
            res.status(403).json({ status: false, message: 'Forbidden: Vendor/Admin access required.' });
        }
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Admin') {
            next();
        } else {
            res.status(403).json({ status: false, message: 'Forbidden: Admin access required.' });
        }
    });
};

const verifyDriver = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.userType === 'Driver') {  
            next();
        } else {
            res.status(403).json({ status: false, message: 'Forbidden: Driver access required.' });
        }
    });
};

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyVendor, verifyAdmin, verifyDriver};