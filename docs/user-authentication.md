# User API Spec

## Register User API
### Endpoint : POST /api/users/register
#### Request Body : 
```json
{
  "name" : "John Doe",
  "email" : "johndoe@gmail.com",
  "password" : "klendestin",
  "phone" : "0898987655678",
  "role" : "customer"
}
```
Valid value for `role` is `customer`, `staff`, or `admin`

#### Response Body Success 
```json
{
  "success" : true,
  "message" : "User has been registered",
  "data": {
    "email" : "johndoe@gmail.com",
    "name" : "John Does"
  }
}
```
#### Response Body Errors : Email already registered
```json
{
  "success" : false,
  "errors": {
    "message" : "Email already registered"
  }
}
```

## Login User API
### Endpoint : POST /api/users/login

#### Request Body : 
```json
{
  "email" : "johndoe@gmail.com",
  "password" : "klendestin"
}
```
#### Response Body Success : 
```json
{
  "success" : true,
  "message" : "User successfully logged in",
  "data": {
    "accessToken" : "unique-token", 
    "refreshToken" : "unique-token"
  }
}
```
**Notes:**
- `accessToken`: JWT for authentication.
- `refreshToken`: JWT for requesting new access token.

Response Body Errors : Email or password is wrong
```json
{
  "success" : false,
  "errors": {
    "message" : "Email or password is wrong"
  }
}
```

## Update User API
### Endpoint : PUT /api/users/updateUserDetail

Headers : 
- Authorization : Bearer Token

#### Request Body : 
```json
{
  "name" : "John Sagala", 
  "birthDate" : 2, 
  "birthDate" : 1, 
  "birthYear" : 2001,
  "gender" : "MALE",
  "phone" : "0898987655678"
}
```
#### Response Body Success : 
```json
{
  "success" : true,
  "message" : "User data successfully updated",
  "data": {
    "email" : "johndoe@gmail.com",
    "name" : "John Sagala", 
    "birthDate" : 2, 
    "birthDate" : 1, 
    "birthYear" : 2001,
    "gender" : "MALE",
    "phone" : "0898987655678"
  }
}
```
#### Response Body Errors : Token is not included in the header or user role is prohibited from accessing
```json
{
  "success" : false,
  "errors": {
    "message" : "Unauthorized"
  }
}
```
#### Response Body Errors : User is not registered
```json
{
  "success" : false,
  "errors": {
    "message" : "User is not found"
  }
}
```

## Get User API
### Endpoint : GET /api/users/current

Headers : 
- Authorization : Bearer Token

#### Response Body Success : 
```json
{
  "success" : true,
  "message" : "Successfully get user data",
  "data": {
    "email" : "johndoe@gmail.com",
    "name" : "John Sagala", 
    "birthDate" : 2, 
    "birthDate" : 1, 
    "birthYear" : 2001,
    "gender" : "MALE",
    "phone" : "0898987655678"
  }
}
```
#### Response Body Errors : Token is not included in the header or user role is prohibited from accessing
```json
{
  "success" : false,
  "errors": {
    "message" : "Unauthorized"
  }
}
```
#### Response Body Errors : User is not registered
```json
{
  "success" : false,
  "errors": {
    "message" : "User is not found"
  }
}
```

## Logout User API
Endpoint : PUT /api/users//current/logout

Headers : 
- Authorization : Bearer Token

#### Response Body Success : 
```json
{
  "success" : true,
  "message" : "User successfully logged out"
}
```
#### Response Body Errors : Token is not included in the header or user role is prohibited from accessing
```json
{
  "success" : false,
  "errors": {
    "message" : "Unauthorized"
  }
}
```
#### Response Body Errors : User is not registered
```json
{
  "success" : false,
  "errors": {
    "message" : "User is not found"
  }
}
```
