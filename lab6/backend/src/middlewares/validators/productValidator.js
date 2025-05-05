const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error',
      errors: errors.array() 
    });
  }
  next();
};

const createProduct = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive integer'),
  body('categoryId')
    .notEmpty()
    .withMessage('Category ID is required')
    .isInt()
    .withMessage('Category ID must be an integer'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('specifications')
    .optional()
    .isObject()
    .withMessage('Specifications must be an object'),
  validate
];

const updateProduct = [
  param('id')
    .isInt()
    .withMessage('Invalid product ID'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive integer'),
  body('categoryId')
    .optional()
    .isInt()
    .withMessage('Category ID must be an integer'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('specifications')
    .optional()
    .isObject()
    .withMessage('Specifications must be an object'),
  validate
];

const bulkCreateProducts = [
  param('categoryId')
    .isInt()
    .withMessage('Invalid category ID'),
  body('products')
    .isArray()
    .withMessage('Products must be an array')
    .notEmpty()
    .withMessage('Products array cannot be empty'),
  body('products.*.name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('products.*.description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('products.*.price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('products.*.stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive integer'),
  body('products.*.imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('products.*.specifications')
    .optional()
    .isObject()
    .withMessage('Specifications must be an object'),
  body('products.*.simulateError')
    .optional()
    .isBoolean()
    .withMessage('simulateError must be a boolean value'),
  validate
];

module.exports = {
  createProduct,
  updateProduct,
  bulkCreateProducts
}; 