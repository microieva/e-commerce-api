# E-COMMERCE API

E-commerce api built using Node.js Express framework and MongoDB.

## Overview

This api includes:

- All CRUD Operations
- REST API
- Authentication with JWT and Google
- Filter products by title 

## API Errors

Schema validation of requests implemented using zod. 
Request validation failure error response:

```
{
    "issues": [
        {
            "code": "custom",
            "message": "Invalid input",
            "path": [
                "body",
                "categoryId"
            ]
        }
    ],
    "name": "ZodError"
}
```

All other API errors return as:

```
{
    "msg": String
}
```

## Endpoints

### Products

GET: https://e-commerce-api-atbv.onrender.com/api/v1/products

#### Request
    -

#### Response

```
    [
        {
            "_id": "657b2a07c2c284616fa0db4e",
            "title": "Red Hoodie",
            "price": 100,
            "description": "Hottest item in winter collection!",
            "category": {
                "_id": "657b26f4b8846066b7cf5961",
                "name": "Sports",
                "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=7943"
            },
            "images": [
                "https://cdn.pixabay.com/photo/2021/12/26/08/48/executioner-6894534_1280.jpg"
            ]
        },
        ...
    ]
```

GET: https://e-commerce-api-atbv.onrender.com/api/v1/products/657b2a07c2c284616fa0db4e

#### Request
    -

#### Response

```
    {
        "_id": "657b2a07c2c284616fa0db4e",
        "title": "Red Hoodie",
        "price": 100,
        "description": "Hottest item in winter collection!",
        "category": {
            "_id": "657b26f4b8846066b7cf5961",
            "name": "Sports",
            "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=7943"
        },
        "images": [
            "https://cdn.pixabay.com/photo/2021/12/26/08/48/executioner-6894534_1280.jpg"
        ]
    }
```

POST: https://e-commerce-api-atbv.onrender.com/api/v1/products/ - protected (admin only)

#### Request

```
{
    "title": "New Product",
    "price": 50,
    "description": "New item in our shop!",
    "categoryId": "657b2706b8846066b7cf5963",
    "images": [
        "https://placeimg.com/640/480/any?r=0.9178516507833767",
        "https://placeimg.com/640/480/any?r=0.9300320592588625",
        "https://placeimg.com/640/480/any?r=0.8807778235430017"
    ]
}
```

#### Response

```
{
    "title": "New Product",
    "price": 50,
    "description": "New item in our shop!",
    "category": {
        "_id": "657b2706b8846066b7cf5963",
        "name": "Garments",
        "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=7943",
        "__v": 0
    },
    "images": [
        "https://placeimg.com/640/480/any?r=0.9178516507833767",
        "https://placeimg.com/640/480/any?r=0.9300320592588625",
        "https://placeimg.com/640/480/any?r=0.8807778235430017"
    ],
    "_id": "659bffeab41bb9f3f98e25d5",
    "__v": 0
}
```

PUT: https://e-commerce-api-atbv.onrender.com/api/v1/products/659bffeab41bb9f3f98e25d5 - protected (admin only)

#### Request

```
{
    "title": "Updated Title"
}
```

#### Response

```
{
    "_id": "659bffeab41bb9f3f98e25d5",
    "title": "Updated Title",
    "price": 50,
    "description": "New item in our shop!",
    "category": "657b2706b8846066b7cf5963",
    "images": [
        "https://placeimg.com/640/480/any?r=0.9178516507833767",
        "https://placeimg.com/640/480/any?r=0.9300320592588625",
        "https://placeimg.com/640/480/any?r=0.8807778235430017"
    ],
    "__v": 0
}
```

DELETE: https://e-commerce-api-atbv.onrender.com/api/v1/products/659bffeab41bb9f3f98e25d5 - protected (admin only)

#### Request

    -

#### Response

```
{
    "_id": "659bffeab41bb9f3f98e25d5",
    "title": "Updated Title",
    "price": 50,
    "description": "New item in our shop!",
    "category": {
        "_id": "657b2706b8846066b7cf5963",
        "name": "Garments",
        "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=7943",
        "__v": 0
    },
    "images": [
        "https://placeimg.com/640/480/any?r=0.9178516507833767",
        "https://placeimg.com/640/480/any?r=0.9300320592588625",
        "https://placeimg.com/640/480/any?r=0.8807778235430017"
    ],
    "__v": 0
}
```
-------------------------------------------------------------------------------------------------

### Categories

GET: https://e-commerce-api-atbv.onrender.com/api/v1/categories - protected (admin only)

#### Request
    -

#### Response

```
[
    {
        "_id": "657b26f4b8846066b7cf5961",
        "name": "Sports",
        "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=7943",
        "__v": 0
    }
]
```

GET: https://e-commerce-api-atbv.onrender.com/api/v1/categories/657b26f4b8846066b7cf5961 - protected (admin only)

#### Request
    -

#### Response

```
{
    "_id": "657b26f4b8846066b7cf5961",
    "name": "Sports",
    "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=7943",
    "__v": 0
}
```

POST: https://e-commerce-api-atbv.onrender.com/api/v1/categories/ - protected (admin only)

#### Request

```
{
    "name": "Outdoors",
    "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=7943"
}
```

#### Response

```
{
    "name": "Outdoors",
    "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=7943",
    "_id": "659c04ffb41bb9f3f98e25e0",
    "__v": 0
}
```

PUT: https://e-commerce-api-atbv.onrender.com/api/v1/categories/659c04ffb41bb9f3f98e25e0 - protected (admin only)

#### Request

```
{
    "image": "https://placeimg.com/640/480/any?r=0.8807778235430017"
}
```

#### Response

```
{
    "_id": "659c04ffb41bb9f3f98e25e0",
    "name": "Outdoors",
    "image": "https://placeimg.com/640/480/any?r=0.8807778235430017",
    "__v": 0
}
```


DELETE: https://e-commerce-api-atbv.onrender.com/api/v1/categories/659c04ffb41bb9f3f98e25e0 - protected (admin only)


#### Request

    -

#### Response

```
{}
```

-------------------------------------------------------------------------------------------------

### Authentication


POST: https://e-commerce-api-atbv.onrender.com/api/v1/auth/login


#### Request
```
{
    "password":"user123",
    "email": "user@email.com"
}
```

#### Response

"eyJhbGciOiJIUzI1NiIsI ..."


POST: https://e-commerce-api-atbv.onrender.com/api/v1/auth/signup


#### Request
```
{
    "password":"user123",
    "email": "user@email.com"
}
```

#### Response

"eyJhbGciOiJIUzI1NiIsI ..."

-------------------------------------------------------------------------------------------------

### Users

GET: https://e-commerce-api-atbv.onrender.com/api/v1/users - protected (admin only)

#### Request
    -

#### Response

```
[
    {
        "_id": "6579c2f36cb45cc0224a73cc",
        "name": "User",
        "email": "user@email.com",
        "password": "$2a$10$G/QgG.m5Ha6Tsqwj9GNB0.5j6LpzhK21GVxH3mG5sB0CYXfoocnvC",
        "role": "CUSTOMER",
        "avatar": "https://api.lorem.space/image/face?w=640&h=480&r=867",
        "__v": 0
    }
]
```

GET: https://e-commerce-api-atbv.onrender.com/api/v1/users/6579c2f36cb45cc0224a73cc - protected

#### Request
    -

#### Response

```
{
    "name": "User",
    "email": "user@email.com",
    "role": "CUSTOMER",
    "avatar": "https://api.lorem.space/image/face?w=640&h=480&r=867"
}
```

GET: https://e-commerce-api-atbv.onrender.com/api/v1/users/profile - protected

#### Request
    -

#### Response

```
{
    "name": "User",
    "email": "user@email.com",
    "role": "CUSTOMER",
    "avatar": "https://api.lorem.space/image/face?w=640&h=480&r=867"
}
```

PUT: https://e-commerce-api-atbv.onrender.com/api/v1/users/6579c2f36cb45cc0224a73cc - protected

#### Request

```
{
    "name": "Updated User"
}
```

#### Response

```
{
    "name": "Updated User",
    "email": "user@email.com",
    "role": "CUSTOMER",
    "avatar": "https://api.lorem.space/image/face?w=640&h=480&r=867"
}
```

DELETE: https://e-commerce-api-atbv.onrender.com/api/v1/users/6579c2f36cb45cc0224a73cc - protected

#### Request

    -

#### Response

```
{
    "msg": "User was deleted successfuly"
}
```


-------------------------------------------------------------------------------------------------

### Orders

GET: https://e-commerce-api-atbv.onrender.com/api/v1/orders - protected (admin only)

#### Request
    -

#### Response

```
[
    {
        "_id": "659bd823ec4ba207afc018d2",
        "userId": "6579c2f36cb45cc0224a73cc",
        "totalPrice": 491.5,
        "createdAt": "8.1.2024 13.10.27",
        "paid": true,
        "__v": 0
    }
]
```

GET: https://e-commerce-api-atbv.onrender.com/api/v1/orders/user/6579c2f36cb45cc0224a73cc - protected

#### Request
    -

#### Response

```
[
    {
        "_id": "659bd823ec4ba207afc018d2",
        "userId": "6579c2f36cb45cc0224a73cc",
        "totalPrice": 491.5,
        "createdAt": "8.1.2024 13.10.27",
        "paid": true,
        "__v": 0
    }
]
```

GET: https://e-commerce-api-atbv.onrender.com/api/v1/orders/items/659bd823ec4ba207afc018d2 - protected

#### Request
    -

#### Response

```
[
    {
        "_id": "657b2a2fc2c284616fa0db56",
        "title": "Fancy Hoodie",
        "price": 220.5,
        "description": "Hottest item in winter collection!",
        "category": {
            "_id": "657b2706b8846066b7cf5963",
            "name": "Garments",
            "image": "https://api.lorem.space/image/fashion?w=640&h=480&r=7943",
            "__v": 0
        },
        "images": [
            "https://cdn.pixabay.com/photo/2016/03/27/18/49/man-1283576_1280.jpg"
        ],
        "__v": 0,
        "quantity": 2
    },
    ...
]
```
POST: https://e-commerce-api-atbv.onrender.com/api/v1/orders/checkout/6579c2f36cb45cc0224a73cc - protected

#### Request

```
[
    {
        "id": "657b2a07c2c284616fa0db4e",
        "quantity": 1
    }
]
```

#### Response

```
{
    "userId": "6579c2f36cb45cc0224a73cc",
    "totalPrice": 100,
    "createdAt": "8.1.2024 16.59.56",
    "paid": false,
    "_id": "659c0dec22d99360b7217154",
    "__v": 0
}
```

PUT: https://e-commerce-api-atbv.onrender.com/api/v1/orders/order/659c0dec22d99360b7217154 - protected


#### Request

```
{
    "paid": true
}
```

#### Response

```
{
    "_id": "659c0dec22d99360b7217154",
    "userId": "6579c2f36cb45cc0224a73cc",
    "totalPrice": 100,
    "createdAt": "8.1.2024 16.59.56",
    "paid": true,
    "__v": 0
}
```

DELETE: https://e-commerce-api-atbv.onrender.com/api/v1/orders/659c0dec22d99360b7217154 - protected

#### Request

    -

#### Response

```
{
    "msg": "Order deleted successfuly"
}
```

DELETE: https://e-commerce-api-atbv.onrender.com/api/v1/orders/user/6579c2f36cb45cc0224a73cc - protected

#### Request

    -

#### Response

```
{
    "msg": "Orders deleted successfuly"
}
```

DELETE: https://e-commerce-api-atbv.onrender.com/api/v1/orders/orders/ - protected (admin only)

#### Request

    -

#### Response

```
{
    "msg": "All orders (and order items) deleted successfuly"
}
```
