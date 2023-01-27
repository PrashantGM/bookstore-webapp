**Requirements:**

1. You must have node and postgres installed on your PC.
2. Optional: Set up cloudinary account and get its account name, api key and api-secret.  
   (By default, images are saved locally in the device. You can opt in later to save images to cloud with cloudinary when adding new books. For that, you need cloudinary account and aforementioned credentials)
3. Optional: Code editor is recommended. Eg; VS Code

## Steps to run bookstore-webapp

1. Download zip file or clone the app with: git clone https://github.com/PrashantGM/bookstore-webapp.git.
2. After download, open project folder in your favorite text editor and run npm install on its terminal.
   Note: You should be on same project directory on the terminal.
3. Create .env file on project's root directory and include following .env variables.  
   PORT= < port your app is listening to >  
   CLOUD_NAME= < your cloudinary account name >  
   CLOUD_API_KEY= < your cloudinary api key >  
   CLOUD_API_SECRET= < your cloudinary api secret >  
   JWT_SECRET= < secret for signing jwt token >  
   JWT_LIFE_TIME= < life time of jwt token eg;1d >
4. Run npx prisma migrate dev on the terminal.
5. Then, execute npm run dev.
   App wil be live on http://localhost:8000.

**Notice: By default, new users are registered as normal users. But, you need to have users with admin role to get admin access for CRUD operations. Currently, admin role can only be set/edited manually within the postgres database.**

### HOMEPAGE

![alt text](https://github.com/PrashantGM/bookstore-webapp/blob/main/views/imgs/mainpage-demo.png?raw=true)

### BOOKS BY GENRE

![alt text](https://github.com/PrashantGM/bookstore-webapp/blob/main/views/imgs/books-by-genre-demo.png?raw=true)

### BOOK PAGE

![alt text](https://github.com/PrashantGM/bookstore-webapp/blob/main/views/imgs/book-demo.png?raw=true)

### CART

![alt text](https://github.com/PrashantGM/bookstore-webapp/blob/main/views/imgs/cart-demo.png?raw=true)

### STRIPE PAYMENT

![alt text](https://github.com/PrashantGM/bookstore-webapp/blob/main/views/imgs/stripe-payment-demo.png?raw=true)

### ADD BOOK(ADMIN)

![alt text](https://github.com/PrashantGM/bookstore-webapp/blob/main/views/imgs/add-book-demo.png?raw=true)

### UPDATE BOOK(ADMIN)

![alt text](https://github.com/PrashantGM/bookstore-webapp/blob/main/views/imgs/edit-book-demo.png?raw=true)

**_ Other pages admin pages will be added within an hour _**
