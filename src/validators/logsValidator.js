import { query } from 'express-validator';

export const validateLogs = [
  query('from')
    .trim()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('From must be in YYYY-MM-DD format')
    .isISO8601()
    .withMessage('From must be a valid date'),
  query('to')
    .trim()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('To must be in YYYY-MM-DD format')
    .isISO8601()
    .withMessage('To must be a valid date'),
  query('limit')
    .trim()
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Limit must be a positive integer')
    .toInt(),
];
