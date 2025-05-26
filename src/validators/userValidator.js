import { body } from 'express-validator';

export const validateUser = [
  body('username')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
];
