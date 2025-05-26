import { body } from 'express-validator';

export const validateExercise = [
  body('description')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 5 })
    .withMessage('Description must be at least 5 characters long'),
  body('duration')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Duration is required')
    .isInt({ gt: 0 })
    .withMessage('Duration must be a number greater than 0'),
  body('date')
    .trim()
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Date must be a string')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format')
    .custom((value) => {
      const [year, month, day] = value.split('-').map(Number);
      const date = new Date(value);

      if (
        isNaN(date.getTime()) ||
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() + 1 !== month ||
        date.getUTCDate() !== day
      ) {
        throw new Error('Date must be a valid calendar date');
      }

      return true;
    }),
];
