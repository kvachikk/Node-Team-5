# Electronic Product Catalog

A modern web application for managing hierarchical product catalogs with an intuitive admin interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![React](https://img.shields.io/badge/react-%5E18.0.0-blue.svg)

## Overview

This project implements a flexible electronic catalog system allowing for nested categories and detailed product listings. Built with Node.js and React, it provides both user-facing catalog browsing and admin management capabilities.

## Key Features

- Multi-level category hierarchy
- Detailed product cards with custom attributes
- User-friendly admin panel
- Search and filtering functionality
- Responsive design for all devices

## Entities

### Category
- Hierarchical structure (can contain products or subcategories)
- Example: Home Appliances → Large Appliances → Refrigerators → BOSCH KGN39VI306

### Product
- Belongs to categories
- Contains detailed specs, images, and availability

## User Roles

### Guest
- Browse categories and product listings
- View detailed product information
- Use search and filters

### Administrator
- Create/edit/delete categories
- Manage products (add, update, remove)
- Handle product images
- Configure category hierarchy
- Manage product attributes

## Technology Stack

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Redux, Material UI
- **Image Processing**: Sharp, Multer
- **Authentication**: JWT
- **Deployment**: Docker, GitHub Actions

## Getting Started

```bash
# Clone repository
git clone https://github.com/username/electronic-product-catalog.git

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Run development server
npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
