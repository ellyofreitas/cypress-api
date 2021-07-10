# Endpoints
```
POST /products # Create new product
GET /products/{id} # Get product
```
# Requests Example

## Creating new product
```
POST /products <- { "name": "Beer", "price": 2.5 }

Status: 201 Created
Headers: 
    Content-Type: 'application/json'
    Location: '/products/1'
Body: { "id": 1, "name": "Beer", "price": 2.5 }
```
## Get product
```
GET /products/1 

Status: 200 OK
Headers: 
    Content-Type: 'application/json'
Body: { "id": 1, "name": "Beer", "price": 2.5 }
```