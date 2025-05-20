import { body } from 'express-validator';

export const validateExercise = [
  body('description')
    .exists({ values: 'falsy' })
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 5 })
    .withMessage('Description must be at least 5 characters long'),
  body('duration')
    .exists({ values: 'falsy' })
    .withMessage('Duration is required')
    .isInt({ gt: 0 })
    .withMessage('Duration must be a number greater than 0'),
  body('date')
    .optional()
    .isString()
    .withMessage('Date must be a string')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format')
    .isISO8601()
    .withMessage('Date must be a valid date'),
];
