const API_BASE_URL = 'http://localhost:3000/api';

// UI Elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const categoryModal = new bootstrap.Modal(document.getElementById('category-modal'));
const productModal = new bootstrap.Modal(document.getElementById('product-modal'));

// Pagination state
let currentCategoryPage = 1;
let currentProductPage = 1;
let homeCurrentCategoryPage = 1;
let productsLimit = 6;
let categoriesLimit = 6;

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = e.target.dataset.page;
        showPage(targetPage);
    });
});

// Function to clear pagination
function clearPagination() {
    const existingPagination = document.querySelectorAll('.pagination-container');
    existingPagination.forEach(elem => elem.remove());
}

function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageId}-page`) {
            page.classList.add('active');
        }
    });

    // Активуємо відповідний пункт меню
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });

    // Clear any existing pagination before initializing the page
    clearPagination();

    // Ініціалізуємо відповідну сторінку
    if (pageId === 'categories') {
        loadCategories();
    } else if (pageId === 'products') {
        loadProducts();
        loadCategoriesForFilter();
        // Очищаємо розділ підкатегорій, якщо жодна категорія не вибрана
        if (!document.getElementById('category-filter').value) {
            document.getElementById('subcategories-list').innerHTML = '';
        }
    } else if (pageId === 'home') {
        loadHomeCategories();
    } else if (pageId === 'relationships') {
        loadCategoriesForRelationships();
    }
}

// Toast notifications
function showToast(message, type = 'success') {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: type === 'success' ? "#28a745" : "#dc3545",
    }).showToast();
}

// Category Management
document.getElementById('create-category-btn').addEventListener('click', () => {
    document.getElementById('category-id').value = '';
    document.getElementById('category-name').value = '';
    document.getElementById('category-image').value = '';
    document.getElementById('category-description').value = '';
    categoryModal.show();
});

document.getElementById('save-category').addEventListener('click', async () => {
    const id = document.getElementById('category-id').value;
    const category = {
        name: document.getElementById('category-name').value,
        imageUrl: document.getElementById('category-image').value,
        description: document.getElementById('category-description').value
    };

    try {
        if (id) {
            await axios.put(`${API_BASE_URL}/categories/${id}`, category);
            showToast('Категорію оновлено успішно');
        } else {
            await axios.post(`${API_BASE_URL}/categories`, category);
            showToast('Категорію створено успішно');
        }
        categoryModal.hide();
        loadCategories();
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Помилка при збереженні категорії';
        showToast(errorMessage, 'error');
    }
});

async function loadCategories() {
    try {
        // Clear any existing pagination
        clearPagination();
        
        const response = await axios.get(`${API_BASE_URL}/categories/paginated?page=${currentCategoryPage}&limit=${categoriesLimit}`);
        const categoriesList = document.getElementById('categories-list');
        categoriesList.innerHTML = '';

        const categories = response.data.data;
        const pagination = response.data.pagination;

        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card category-card" onclick="loadProductsByCategory(${category.id})">
                    <img src="${category.imageUrl || 'default-image.jpg'}" class="card-img-top" alt="${category.name}">
                    <div class="card-body">
                        <h5 class="card-title">${category.name}</h5>
                        <div class="btn-group">
                            <button class="btn btn-primary" onclick="editCategory(${category.id}, '${category.name}', '${category.imageUrl || ''}', '${category.description || ''}')">Редагувати</button>
                            <button class="btn btn-danger" onclick="deleteCategory(${category.id})">Видалити</button>
                        </div>
                    </div>
                </div>
            `;
            categoriesList.appendChild(card);
        });

        // Add pagination controls
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container mt-4 d-flex justify-content-center';
        paginationContainer.innerHTML = createPaginationControls(pagination, 'category');
        categoriesList.parentNode.appendChild(paginationContainer);
    } catch (error) {
        showToast('Помилка при завантаженні категорій', 'error');
    }
}

async function loadHomeCategories() {
    try {
        // Clear any existing pagination
        clearPagination();
        
        const response = await axios.get(`${API_BASE_URL}/categories/paginated?page=${homeCurrentCategoryPage}&limit=${categoriesLimit}`);
        const categoriesContainer = document.getElementById('home-categories');
        categoriesContainer.innerHTML = '';

        const categories = response.data.data;
        const pagination = response.data.pagination;

        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card category-card" onclick="loadProductsByCategory(${category.id})">
                    <img src="${category.imageUrl || 'default-image.jpg'}" class="card-img-top" alt="${category.name}">
                    <div class="card-body">
                        <h5 class="card-title">${category.name}</h5>
                        <p class="card-text">${category.description || 'Немає опису'}</p>
                        <button class="btn btn-primary w-100" onclick="loadProductsByCategory(${category.id})">Переглянути</button>
                    </div>
                </div>
            `;
            categoriesContainer.appendChild(card);
        });

        // Add pagination controls
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container mt-4 d-flex justify-content-center';
        paginationContainer.innerHTML = createPaginationControls(pagination, 'home-category');
        categoriesContainer.parentNode.appendChild(paginationContainer);
    } catch (error) {
        showToast('Помилка при завантаженні категорій', 'error');
    }
}

async function loadSubcategories(categoryId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        const subcategoriesList = document.getElementById('subcategories-list');
        subcategoriesList.innerHTML = '';

        const categories = response.data.data;
        const currentCategory = categories.find(cat => cat.id === parseInt(categoryId));
        
        if (!currentCategory) return;
        
        // Додаємо заголовок з назвою поточної категорії
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'mb-3';
        categoryHeader.innerHTML = `
            <p>${currentCategory.description || ''}</p>
        `;
        subcategoriesList.appendChild(categoryHeader);
        
        // Відображаємо батьківські категорії, якщо вони є
        if (currentCategory.parents && currentCategory.parents.length > 0) {
            const parentsContainer = document.createElement('div');
            parentsContainer.className = 'parents mb-4';
            parentsContainer.innerHTML = '<h4>Батьківські категорії:</h4>';
            
            const parentsRow = document.createElement('div');
            parentsRow.className = 'row';
            
            currentCategory.parents.forEach(parent => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-3';
                card.innerHTML = `
                    <div class="card parent-card" onclick="loadProductsByCategory(${parent.id})">
                        <div class="card-body">
                            <h5 class="card-title">${parent.name}</h5>
                            <p class="card-text">${parent.description || 'Немає опису'}</p>
                            <button class="btn btn-outline-secondary w-100" onclick="loadProductsByCategory(${parent.id})">Перейти</button>
                        </div>
                    </div>
                `;
                parentsRow.appendChild(card);
            });
            
            parentsContainer.appendChild(parentsRow);
            subcategoriesList.appendChild(parentsContainer);
        }
        
        // Відображаємо підкатегорії
        if (currentCategory.children && currentCategory.children.length > 0) {
            const subcategoriesContainer = document.createElement('div');
            subcategoriesContainer.className = 'subcategories mb-4';
            
            const subcategoriesRow = document.createElement('div');
            subcategoriesRow.className = 'row';
            
            currentCategory.children.forEach(subcategory => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-3';
                card.innerHTML = `
                    <div class="card subcategory-card" onclick="loadProductsByCategory(${subcategory.id})">
                        <div class="card-body">
                            <h5 class="card-title">${subcategory.name}</h5>
                            <p class="card-text">${subcategory.description || 'Немає опису'}</p>
                            <button class="btn btn-outline-primary w-100" onclick="loadProductsByCategory(${subcategory.id})">Переглянути</button>
                        </div>
                    </div>
                `;
                subcategoriesRow.appendChild(card);
            });
            
            subcategoriesContainer.appendChild(subcategoriesRow);
            subcategoriesList.appendChild(subcategoriesContainer);
        }
    } catch (error) {
        showToast('Помилка при завантаженні підкатегорій', 'error');
    }
}

async function loadProductsByCategory(categoryId) {
    showPage('products');
    document.getElementById('category-filter').value = categoryId;
    currentProductPage = 1; // Reset to first page when changing category
    await loadProducts();
    await loadSubcategories(categoryId);
}

function editCategory(id, name, imageUrl, description) {
    document.getElementById('category-id').value = id;
    document.getElementById('category-name').value = name;
    document.getElementById('category-image').value = imageUrl;
    document.getElementById('category-description').value = description;
    categoryModal.show();
}

async function deleteCategory(id) {
    if (confirm('Ви впевнені, що хочете видалити цю категорію?')) {
        try {
            await axios.delete(`${API_BASE_URL}/categories/${id}`);
            showToast('Категорію видалено успішно');
            loadCategories();
        } catch (error) {
            showToast('Помилка при видаленні категорії', 'error');
        }
    }
}

// Product Management
document.getElementById('create-product-btn').addEventListener('click', () => {
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('product-description').value = '';
    loadCategoriesForProductForm();
    productModal.show();
});

document.getElementById('save-product').addEventListener('click', async () => {
    const id = document.getElementById('product-id').value;
    const product = {
        name: document.getElementById('product-name').value,
        categoryId: document.getElementById('product-category').value,
        price: document.getElementById('product-price').value,
        stock: document.getElementById('product-stock').value,
        imageUrl: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value
    };

    try {
        if (id) {
            await axios.put(`${API_BASE_URL}/products/${id}`, product);
            showToast('Продукт оновлено успішно');
        } else {
            await axios.post(`${API_BASE_URL}/products`, product);
            showToast('Продукт створено успішно');
        }
        productModal.hide();
        loadProducts();
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Помилка при збереженні продукту';
        showToast(errorMessage, 'error');
    }
});

async function loadProducts() {
    try {
        clearPagination();
        
        const searchQuery = document.getElementById('search-input').value;
        const categoryId = document.getElementById('category-filter').value;
        let url = `${API_BASE_URL}/products`;

        if (searchQuery) {
            url += `/search?q=${encodeURIComponent(searchQuery)}&page=${currentProductPage}&limit=${productsLimit}`;
        } else if (categoryId) {
            url += `/category/${categoryId}/paginated?page=${currentProductPage}&limit=${productsLimit}`;
        } else {
            url += `/paginated?page=${currentProductPage}&limit=${productsLimit}`;
        }

        const response = await axios.get(url);
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = '';

        // Access the data array from the response
        const products = response.data.data;
        const pagination = response.data.pagination;

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card product-card">
                    <img src="${product.imageUrl || 'default-image.jpg'}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description || 'Немає опису'}</p>
                        <p class="card-text"><strong>Ціна:</strong> ${product.price} грн</p>
                        <p class="card-text"><strong>Кількість на складі:</strong> ${product.stock}</p>
                        <div class="btn-group">
                            <button class="btn btn-primary" onclick="editProduct(${product.id}, '${product.name}', ${product.categoryId}, ${product.price}, ${product.stock}, '${product.imageUrl || ''}', '${product.description || ''}')">Редагувати</button>
                            <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Видалити</button>
                        </div>
                    </div>
                </div>
            `;
            productsList.appendChild(card);
        });

        // Add pagination controls
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container mt-4 d-flex justify-content-center';
        paginationContainer.innerHTML = createPaginationControls(pagination, 'product');
        productsList.parentNode.appendChild(paginationContainer);
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Помилка при завантаженні продуктів', 'error');
    }
}

async function loadCategoriesForProductForm() {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        const categorySelect = document.getElementById('product-category');
        categorySelect.innerHTML = '<option value="">Виберіть категорію</option>';
        
        const categories = response.data.data;
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        showToast('Помилка при завантаженні категорій', 'error');
    }
}

function editProduct(id, name, categoryId, price, stock, imageUrl, description) {
    document.getElementById('product-id').value = id;
    document.getElementById('product-name').value = name;
    document.getElementById('product-price').value = price;
    document.getElementById('product-stock').value = stock;
    document.getElementById('product-image').value = imageUrl;
    document.getElementById('product-description').value = description;
    
    loadCategoriesForProductForm().then(() => {
        document.getElementById('product-category').value = categoryId;
        productModal.show();
    });
}

async function deleteProduct(id) {
    if (confirm('Ви впевнені, що хочете видалити цей продукт?')) {
        try {
            await axios.delete(`${API_BASE_URL}/products/${id}`);
            showToast('Продукт видалено успішно');
            loadProducts();
        } catch (error) {
            showToast('Помилка при видаленні продукту', 'error');
        }
    }
}

async function loadCategoriesForFilter() {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        const categoryFilter = document.getElementById('category-filter');
        
        // Очищаємо список, залишаючи тільки опцію "Всі категорії"
        categoryFilter.innerHTML = '<option value="">Всі категорії</option>';
        
        const categories = response.data.data;
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
        
        // Додаємо слухач подій для фільтрації продуктів при зміні категорії
        categoryFilter.addEventListener('change', async function() {
            const selectedCategoryId = this.value;
            document.getElementById('search-input').value = ''; // Clear search input
            currentProductPage = 1; // Reset to first page when changing category
            
            if (selectedCategoryId) {
                await loadProductsByCategory(selectedCategoryId);
            } else {
                // Якщо вибрано "Всі категорії"
                await loadProducts();
                document.getElementById('subcategories-list').innerHTML = '';
            }
        });
    } catch (error) {
        showToast('Помилка при завантаженні категорій для фільтра', 'error');
    }
}

async function loadCategoriesForRelationships() {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        const categories = response.data.data;
        
        // Заповнюємо списки категорій для форми створення зв'язку
        const parentSelect = document.getElementById('parent-category');
        const childSelect = document.getElementById('child-category');
        parentSelect.innerHTML = '<option value="">Виберіть батьківську категорію</option>';
        childSelect.innerHTML = '<option value="">Виберіть дочірню категорію</option>';
        
        categories.forEach(category => {
            const parentOption = document.createElement('option');
            parentOption.value = category.id;
            parentOption.textContent = category.name;
            parentSelect.appendChild(parentOption);
            
            const childOption = document.createElement('option');
            childOption.value = category.id;
            childOption.textContent = category.name;
            childSelect.appendChild(childOption);
        });
        
        // Заповнюємо списки для форми переміщення зв'язку
        const moveChildSelect = document.getElementById('move-child-category');
        moveChildSelect.innerHTML = '<option value="">Виберіть категорію для переміщення</option>';
        
        categories.forEach(category => {
            if (category.parents && category.parents.length > 0) {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                moveChildSelect.appendChild(option);
            }
        });
        
        // Слухач подій для завантаження батьківських категорій
        moveChildSelect.addEventListener('change', () => {
            const selectedChildId = moveChildSelect.value;
            if (!selectedChildId) return;
            
            // Знаходимо обрану категорію
            const selectedChild = categories.find(cat => cat.id === parseInt(selectedChildId));
            if (!selectedChild || !selectedChild.parents) return;
            
            // Заповнюємо список старих батьківських категорій
            const oldParentSelect = document.getElementById('old-parent-category');
            oldParentSelect.innerHTML = '<option value="">Виберіть стару батьківську категорію</option>';
            
            selectedChild.parents.forEach(parent => {
                const option = document.createElement('option');
                option.value = parent.id;
                option.textContent = parent.name;
                oldParentSelect.appendChild(option);
            });
            
            // Заповнюємо список нових батьківських категорій
            const newParentSelect = document.getElementById('new-parent-category');
            newParentSelect.innerHTML = '<option value="">Виберіть нову батьківську категорію</option>';
            
            categories.forEach(category => {
                // Виключаємо саму категорію і вже існуючі батьківські категорії
                if (category.id !== parseInt(selectedChildId) && 
                    !selectedChild.parents.some(parent => parent.id === category.id)) {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    newParentSelect.appendChild(option);
                }
            });
        });
        
        // Завантажуємо існуючі зв'язки
        loadRelationships();
    } catch (error) {
        showToast('Помилка при завантаженні категорій', 'error');
    }
}

async function loadRelationships() {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        const categories = response.data.data;
        const relationshipsTableBody = document.getElementById('relationships-table-body');
        relationshipsTableBody.innerHTML = '';
        
        // Створюємо масив всіх зв'язків
        const relationships = [];
        
        categories.forEach(category => {
            if (category.children && category.children.length > 0) {
                category.children.forEach(child => {
                    relationships.push({
                        parentId: category.id,
                        parentName: category.name,
                        childId: child.id,
                        childName: child.name
                    });
                });
            }
        });
        
        // Відображаємо зв'язки в таблиці або показуємо повідомлення, якщо їх немає
        if (relationships.length > 0) {
            relationships.forEach(relationship => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${relationship.parentName}</td>
                    <td>${relationship.childName}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="removeRelationship(${relationship.parentId}, ${relationship.childId})">
                            <i class="bi bi-trash"></i> Видалити
                        </button>
                    </td>
                `;
                relationshipsTableBody.appendChild(row);
            });
        } else {
            // Показуємо повідомлення про відсутність зв'язків
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="3" class="text-center py-4">
                    <div class="empty-state">
                        <i class="bi bi-diagram-3"></i>
                        <p>Зв'язків між категоріями ще немає</p>
                        <small>Використовуйте форму вище, щоб створити зв'язок</small>
                    </div>
                </td>
            `;
            relationshipsTableBody.appendChild(emptyRow);
        }
    } catch (error) {
        showToast('Помилка при завантаженні зв\'язків', 'error');
    }
}

async function removeRelationship(parentId, childId) {
    if (confirm('Ви впевнені, що хочете видалити цей зв\'язок?')) {
        try {
            await axios.delete(`${API_BASE_URL}/categories/relationships`, {
                data: { parentId, childId }
            });
            showToast('Зв\'язок успішно видалено');
            loadRelationships();
            // Оновлюємо списки категорій для форми переміщення
            loadCategoriesForRelationships();
        } catch (error) {
            console.error('Error removing relationship:', error);
            const errorMessage = error.response?.data?.message || 'Помилка при видаленні зв\'язку';
            showToast(`${errorMessage}. Деталі: ${error.toString()}`, 'error');
            
            // Інформація для розробника бекенду
            if (error.toString().includes('removeChild is not a function')) {
                console.error('Backend developer note: The removeChild method is not properly defined in the Category model. Check your Sequelize associations setup.');
            }
        }
    }
}

// Function to create pagination controls
function createPaginationControls(pagination, type) {
    if (!pagination) return '';
    
    const { currentPage, totalPages } = pagination;
    
    let html = '<nav aria-label="Page navigation"><ul class="pagination">';
    
    // Previous button
    html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage('${type === 'product' ? 'currentProductPage' : type === 'category' ? 'currentCategoryPage' : 'homeCurrentCategoryPage'}', ${currentPage - 1}, '${type}')" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage('${type === 'product' ? 'currentProductPage' : type === 'category' ? 'currentCategoryPage' : 'homeCurrentCategoryPage'}', ${i}, '${type}')">${i}</a>
                </li>`;
    }
    
    // Next button
    html += `<li class="page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage('${type === 'product' ? 'currentProductPage' : type === 'category' ? 'currentCategoryPage' : 'homeCurrentCategoryPage'}', ${currentPage + 1}, '${type}')" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>`;
            
    html += '</ul></nav>';
    return html;
}

// Function to change page
function changePage(pageVarName, newPage, type) {
    if (type === 'product') {
        currentProductPage = newPage;
        loadProducts();
    } else if (type === 'category') {
        currentCategoryPage = newPage;
        loadCategories();
    } else if (type === 'home-category') {
        homeCurrentCategoryPage = newPage;
        loadHomeCategories();
    }
}

document.getElementById('search-input').addEventListener('keyup', () => {
    currentProductPage = 1;
    loadProducts();
});

// Category filter event
document.getElementById('category-filter').addEventListener('change', function() {
    const selectedCategoryId = this.value;
    document.getElementById('search-input').value = ''; // Clear search input
    currentProductPage = 1; // Reset to first page when changing category
    
    if (selectedCategoryId) {
        loadProductsByCategory(selectedCategoryId);
    } else {
        // If "All categories" is selected
        loadProducts();
        document.getElementById('subcategories-list').innerHTML = '';
    }
});

// Initialize
window.onload = function() {
    // Initialize homepage 
    showPage('home');
};