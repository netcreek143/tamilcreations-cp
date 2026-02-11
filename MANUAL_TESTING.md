# Manual Feature Testing Guide

This guide outlines the steps to manually verify the features of the Tamil Creations e-commerce platform.

## 1. User Authentication
**Goal**: Verify users can register, login, and access protected routes.

### 1.1 Registration
1.  Navigate to `/register`.
2.  Enter valid details (Name, Email, Password).
3.  Click "Register".
4.  **Expected**: Redirect to login page or home page with success message. Database should have new user.

### 1.2 Login
1.  Navigate to `/login`.
2.  Enter valid credentials.
3.  Click "Sign In".
4.  **Expected**: Redirect to home page. Header should show user name/profile icon.

### 1.3 Logout
1.  Click user profile menu in header.
2.  Click "Sign Out".
3.  **Expected**: Redirect to home page/login. Header should show "Login" button.

## 2. Product Browsing & Shopping
**Goal**: Verify customers can find and view products.

### 2.1 Home Page
1.  Check "Featured Collections" section.
2.  Check "Shop by Category" section.
3.  **Expected**: Images load, links work.

### 2.2 Shop Page (`/shop`)
1.  Navigate to `/shop`.
2.  Test Category filters (e.g., "Sarees", "Lehengas").
3.  Test Sort functionality (Price: Low to High).
4.  **Expected**: Product list updates accordingly.

### 2.3 Product Details
1.  Click on any product.
2.  **Expected**:
    - Product title, price, description visible.
    - "Add to Cart" button visible.
    - "Add to Wishlist" button visible.
    - Related products (if implemented) shown.

## 3. Cart & Wishlist
**Goal**: Verify cart management and saved items.

### 3.1 Wishlist
1.  On a product page, click the "Heart" icon.
2.  Navigate to `/wishlist`.
3.  **Expected**: Product appears in list.
4.  Click "Remove".
5.  **Expected**: Product disappears.

### 3.2 Shopping Cart
1.  On product page, select quantity (if available) and click "Add to Cart".
2.  Navigate to `/cart`.
3.  **Expected**: Item appears with correct price.
4.  Update quantity. **Expected**: Total price updates.
5.  Remove item. **Expected**: Item disappears.

## 4. Checkout Flow
**Goal**: Verify order placement.

1.  Add items to cart.
2.  Click "Checkout" in cart.
3.  Fill in shipping details.
4.  Click "Place Order" (or "Pay Now" if Razorpay active).
5.  **Expected**: Redirect to Order Confirmation page. Order saved in DB.

## 5. Admin Panel (Admin Only)
**Goal**: Verify store management.

### 5.1 Access Control
1.  Login as ADMIN user.
2.  Navigate to `/admin`.
3.  **Expected**: Dashboard loads.
4.  Login as CUSTOMER user.
5.  Navigate to `/admin`.
6.  **Expected**: Redirect to home or 403 error.

### 5.2 Dashboard
1.  Check stats (Total Orders, Revenue).
2.  **Expected**: Numbers match database records.

### 5.3 Product Management (`/admin/products`)
1.  **Add Product**:
    - Click "Add Product".
    - Fill details (Title, Price, Stock, Category, Images).
    - Save.
    - **Expected**: Product appears in list and in Shop.
2.  **Edit Product**:
    - Click Edit icon on a product.
    - Change Price.
    - Save.
    - **Expected**: Price updated in Shop.
3.  **Delete Product**:
    - Click Delete icon.
    - Confirm.
    - **Expected**: Product removed from list and Shop.

### 5.4 Order Management (`/admin/orders`)
1.  View Order List.
2.  Click on an Order ID.
3.  Update Status (e.g., to "SHIPPED").
4.  **Expected**: Status updates in list and in Customer's "My Orders" view.
