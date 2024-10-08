# API Documentation

![image info](./eco-shop-backend.png)

## OpenAPI Specification
openapi: 3.0.0

### Info
- **Title:** API Documentation
- **Version:** 1.0.0
- **Description:** API documentation for eco-shop

### Servers
- **URL:** http://localhost:3001/api/v1
  - **Name:** Local development server

### Tags
- **Users:** User management
- **Products:** Product management
- **Discounts:** Discount management
- **Orders:** Order management

### Components
#### Schemas
- **User**
  - **Type:** object
  - **Properties:**
    - **name:** string (example: "John Doe")
    - **email:** string (format: email, example: "john.doe@example.com")
    - **password:** string (example: "securePassword123")
    - **role:** string (enum: ["user", "admin"], default: "user")
    - **isVerified:** boolean (default: false)
    - **address:** string (example: "123 Main St, City, Country")
    - **phoneNumber:** string (example: "+123456789")
    - **cart:** array (items: `$ref: '#/components/schemas/CartItem'`)
    - **wishlist:** array (items: string, format: uuid)
    - **orders:** array (items: string, format: uuid)
    - **createdAt:** string (format: date-time, example: "2023-09-21T10:00:00Z")

- **CartItem**
  - **Type:** object
  - **Properties:**
    - **productId:** string (format: uuid)
    - **quantity:** integer (default: 1)
    - **selectedColor:** string
    - **selectedSize:** string

- **Product**
  - **Type:** object
  - **Properties:**
    - **name:** string (example: "Sample Product")
    - **description:** string (example: "This is a sample product description.")
    - **originalPrice:** number (example: 100.00)
    - **discount:** string (format: uuid)
    - **images:** array (items: string)
    - **category:** string (example: "Electronics")
    - **stock:** integer (example: 50)
    - **sold_out:** boolean (default: false)
    - **tags:** array (items: string)
    - **colors:** array (items: string)
    - **sizes:** array (items: string)
    - **ratings:** array (items: `$ref: '#/components/schemas/Rating'`)
    - **createdAt:** string (format: date-time, example: "2023-09-21T10:00:00Z")
    - **updatedAt:** string (format: date-time, example: "2023-09-21T10:00:00Z")

- **Rating**
  - **Type:** object
  - **Properties:**
    - **userId:** string (format: uuid)
    - **rating:** number (minimum: 1, maximum: 5)
    - **comment:** string

- **Order**
  - **Type:** object
  - **Properties:**
    - **userId:** string (format: uuid)
    - **products:** array (items: `$ref: '#/components/schemas/OrderItem'`)
    - **totalAmount:** number (example: 200.00)
    - **orderDate:** string (format: date-time, example: "2023-09-21T10:00:00Z")
    - **status:** string (enum: ["Pending", "Shipped", "Delivered", "Cancelled"], default: "Pending")
    - **shippingAddress:** string (example: "123 Main St, City, Country")
    - **paymentMethod:** string (enum: ["Credit Card", "PayPal", "Cash on Delivery"])

- **OrderItem**
  - **Type:** object
  - **Properties:**
    - **productId:** string (format: uuid)
    - **quantity:** integer (minimum: 1)
    - **selectedColor:** string
    - **selectedSize:** string

- **Discount**
  - **Type:** object
  - **Properties:**
    - **percent:** number (example: 20)
    - **startDay:** string (format: date, example: "2023-09-21")
    - **endDay:** string (format: date, example: "2023-09-30")
    - **productList:** array (items: string, format: uuid)
    - **status:** boolean (default: false)

### Security Schemes
- **bearerAuth**
  - **Type:** http
  - **Scheme:** bearer
  - **Bearer Format:** JWT

### Paths
- **/checkstatus**
  - **GET**
    - **Summary:** Check API status
    - **Responses:**
      - **200:** API is working

- **/users/register**
  - **POST**
    - **Tags:** Users
    - **Summary:** Register a new user
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **name:** string
              - **email:** string (format: email)
              - **password:** string
    - **Responses:**
      - **201:** User created successfully
      - **409:** User already exists
      - **400:** Failed to create user

- **/users/login**
  - **POST**
    - **Tags:** Users
    - **Summary:** Log in a user
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **email:** string (format: email)
              - **password:** string
    - **Responses:**
      - **200:** User logged in successfully
        - **Content:**
          - **application/json:**
            - **Schema:**
              - **Type:** object
              - **Properties:**
                - **accessToken:** string
                - **refreshToken:** string
      - **404:** User not found
      - **401:** Invalid credentials

- **/users/logout**
  - **POST**
    - **Tags:** Users
    - **Summary:** Log out a user
    - **Security:**
      - **bearerAuth:** []
    - **Responses:**
      - **200:** Logged out successfully
      - **404:** No refresh token found for user
      - **500:** Failed to logout

- **/users/refresh**
  - **POST**
    - **Tags:** Users
    - **Summary:** Refresh access token
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **token:** string
    - **Responses:**
      - **200:** Access token refreshed successfully
        - **Content:**
          - **application/json:**
            - **Schema:**
              - **Type:** object
              - **Properties:**
                - **accessToken:** string
      - **401:** Refresh token is required
      - **403:** Invalid refresh token
      - **500:** Failed to refresh token

- **/users/me**
  - **GET**
    - **Tags:** Users
    - **Summary:** Get user information
    - **Security:**
      - **bearerAuth:** []
    - **Responses:**
      - **200:** User information retrieved successfully
      - **400:** Failed to get user info

- **/users/me/update**
  - **PUT**
    - **Tags:** Users
    - **Summary:** Update user information
    - **Security:**
      - **bearerAuth:** []
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **name:** string
              - **email:** string (format: email)
    - **Responses:**
      - **200:** User information updated successfully
      - **400:** Failed to update user info

- **/users/update-password**
  - **PUT**
    - **Tags:** Users
    - **Summary:** Update user password
    - **Security:**
      - **bearerAuth:** []
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **currentPassword:** string
              - **newPassword:** string
    - **Responses:**
      - **200:** Password updated successfully
      - **400:** Failed to update password

- **/users/update-address**
  - **PUT**
    - **Tags:** Users
    - **Summary:** Update user address
    - **Security:**
      - **bearerAuth:** []
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **address:** string
    - **Responses:**
      - **200:** Address updated successfully
      - **400:** Failed to update address

- **/products**
  - **GET**
    - **Tags:** Products
    - **Summary:** Get all products
    - **Responses:**
      - **200:** List of products retrieved successfully

- **/products/{id}**
  - **GET**
    - **Tags:** Products
    - **Summary:** Get a specific product
    - **Parameters:**
      - **name:** id (path)
    - **Responses:**
      - **200:** Product retrieved successfully
      - **404:** Product not found

- **/products**
  - **POST**
    - **Tags:** Products
    - **Summary:** Create a new product
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **name:** string
              - **description:** string
              - **originalPrice:** number
              - **discount:** string (format: uuid)
              - **images:** array (items: string)
              - **category:** string
              - **stock:** integer
              - **tags:** array (items: string)
              - **colors:** array (items: string)
              - **sizes:** array (items: string)
    - **Responses:**
      - **201:** Product created successfully
      - **400:** Failed to create product

- **/products/{id}**
  - **PUT**
    - **Tags:** Products
    - **Summary:** Update a specific product
    - **Parameters:**
      - **name:** id (path)
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **name:** string
              - **description:** string
              - **originalPrice:** number
              - **discount:** string (format: uuid)
              - **images:** array (items: string)
              - **category:** string
              - **stock:** integer
              - **tags:** array (items: string)
              - **colors:** array (items: string)
              - **sizes:** array (items: string)
    - **Responses:**
      - **200:** Product updated successfully
      - **400:** Failed to update product
      - **404:** Product not found

- **/products/{id}**
  - **DELETE**
    - **Tags:** Products
    - **Summary:** Delete a specific product
    - **Parameters:**
      - **name:** id (path)
    - **Responses:**
      - **204:** Product deleted successfully
      - **404:** Product not found

- **/discounts**
  - **GET**
    - **Tags:** Discounts
    - **Summary:** Get all discounts
    - **Responses:**
      - **200:** List of discounts retrieved successfully

- **/discounts**
  - **POST**
    - **Tags:** Discounts
    - **Summary:** Create a new discount
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **percent:** number
              - **startDay:** string (format: date)
              - **endDay:** string (format: date)
              - **productList:** array (items: string, format: uuid)
              - **status:** boolean
    - **Responses:**
      - **201:** Discount created successfully
      - **400:** Failed to create discount

- **/discounts/{id}**
  - **PUT**
    - **Tags:** Discounts
    - **Summary:** Update a specific discount
    - **Parameters:**
      - **name:** id (path)
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **percent:** number
              - **startDay:** string (format: date)
              - **endDay:** string (format: date)
              - **productList:** array (items: string, format: uuid)
              - **status:** boolean
    - **Responses:**
      - **200:** Discount updated successfully
      - **400:** Failed to update discount
      - **404:** Discount not found

- **/discounts/{id}**
  - **DELETE**
    - **Tags:** Discounts
    - **Summary:** Delete a specific discount
    - **Parameters:**
      - **name:** id (path)
    - **Responses:**
      - **204:** Discount deleted successfully
      - **404:** Discount not found

- **/orders**
  - **GET**
    - **Tags:** Orders
    - **Summary:** Get all orders
    - **Security:**
      - **bearerAuth:** []
    - **Responses:**
      - **200:** List of orders retrieved successfully

- **/orders**
  - **POST**
    - **Tags:** Orders
    - **Summary:** Create a new order
    - **Security:**
      - **bearerAuth:** []
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **products:** array (items: `$ref: '#/components/schemas/OrderItem'`)
              - **totalAmount:** number
              - **shippingAddress:** string
              - **paymentMethod:** string
    - **Responses:**
      - **201:** Order created successfully
      - **400:** Failed to create order

- **/orders/{id}**
  - **GET**
    - **Tags:** Orders
    - **Summary:** Get a specific order
    - **Parameters:**
      - **name:** id (path)
    - **Responses:**
      - **200:** Order retrieved successfully
      - **404:** Order not found

- **/orders/{id}**
  - **PUT**
    - **Tags:** Orders
    - **Summary:** Update a specific order
    - **Parameters:**
      - **name:** id (path)
    - **Request Body:**
      - **Required:** true
      - **Content:**
        - **application/json:**
          - **Schema:**
            - **Type:** object
            - **Properties:**
              - **status:** string
    - **Responses:**
      - **200:** Order updated successfully
      - **400:** Failed to update order
      - **404:** Order not found

- **/orders/{id}**
  - **DELETE**
    - **Tags:** Orders
    - **Summary:** Delete a specific order
    - **Parameters:**
      - **name:** id (path)
    - **Responses:**
      - **204:** Order deleted successfully
      - **404:** Order not found
