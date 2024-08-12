const { body } = require('express-validator');
exports.registerValidator=[
    body('email')
    .isEmail().withMessage('Invalid Email')
    .normalizeEmail(),
    body('password')
    .isLength({min:6}).withMessage('Invalid Password')
]