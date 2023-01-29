**REQUIREMENTS**  
 You must have:

1. Node and PostgreSQL installed on your PC.
2. Optional: Cloudinary account.  
   (By default, images are saved locally in the device. You can opt in later to save images to cloud with cloudinary when adding new books. For that, you would need cloudinary account.)
3. Optional: Code Editor is recommended. Eg; VS Code
4. Optional: Stripe account for payment feature.

### STEPS TO RUN BOOKSTORE-WEBAPP

1. Download .zip file or clone the app with :&ensp; `git clone https://github.com/PrashantGM/bookstore-webapp.git`.
2. Open the project folder in your favorite text editor and run npm install on the terminal.
3. Optional:
   - Set up cloudinary account and get its account name, api key and api secret.
   - Also, set up stripe account, go to developer's section and get secret key.
   - Then, set up webhook listener from your terminal by running following commands and get webhook test key.<br>
     ```console
     stripe login
     stripe listen --forward-to http://localhost:8000/order/stripe/webhook
     ```
4. Create .env file on project's root directory and include aforementioned keys with other .env variables below:

```
   PORT= <port your app is listening to>
   CLOUD_NAME= <your cloudinary account name>
   CLOUD_API_KEY= <your cloudinary api key>
   CLOUD_API_SECRET= <your cloudinary api secret>
   JWT_SECRET= <secret for signing jwt token>
   JWT_LIFE_TIME= <life time of jwt token eg;1d>
   STRIPE_KEY= <stripe secret key>
   WEBHOOK_TEST_KEY= <test key for stripe webhook>
```

5. Run npx prisma migrate dev on the terminal.
6. Then, execute npm run dev.
   App will be live on http://localhost:8000.

**Notice:**

- **_If optional requirements weren't applied, relevant source code must be disabled to avoid errors._**
- **_By default, new users are registered as normal users. To register admin user for CRUD operations, you need to manually update user's role within the postgres database._**

<br>

### APP UI SNIPPETS

#### HOMEPAGE

![homepage](/views/imgs/ui/mainpage-demo.png?raw=true)

---

#### BOOKS BY GENRE

![books-by-genre](/views/imgs/ui/books-by-genre-demo.png?raw=true)

---

#### BOOK PAGE

![book-page](/views/imgs/ui/book-demo.png?raw=true)

---

#### CART

![cart](/views/imgs/ui/cart-demo.png?raw=true)

---

#### STRIPE PAYMENT

![stripe](/views/imgs/ui/stripe-payment-demo.png?raw=true)

---

<br>

#### ADMIN DASHBOARD

![admin](/views/imgs/ui/admin-demo.png?raw=true)

---

#### ADD BOOK(ADMIN)

![add](/views/imgs/ui/add-book-demo.png?raw=true)

---

#### UPDATE BOOK(ADMIN)

![update](/views/imgs/ui/edit-book-demo.png?raw=true)