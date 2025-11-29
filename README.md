# Postify – Node.js Social Posting App

A mini social media backend built using **Node.js, Express, MongoDB, JWT, bcrypt, EJS, Cookie Authentication, Flash Messages & TailwindCSS**.

Users can **register, login, logout, create posts, edit posts, like/unlike posts**, and view all their posts on the profile page.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT-based session using cookies
- Password hashing with bcrypt
- Protected routes using middleware
- Flash messages for errors & success

### 📝 User Posts
- Create a new post
- View all posts on profile
- Like & Unlike posts
- Edit a post
- Only post owner can edit
- Likes stored as array of user IDs

### 🎨 Frontend (EJS + TailwindCSS)
- Clean UI with TailwindCSS
- Flash message alerts (success/error)
- Auto disappearing flash alert on reload

---

## 🛠️ Tech Stack

| Category | Tech |
|---------|------|
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + Cookies |
| Password Hashing | bcrypt |
| Templating | EJS |
| Styling | Tailwind CSS |
| Flash Messages | express-session + connect-flash |

---

## 📁 Folder Structure

```
project/
│── app.js
│── package.json
│── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   └── edit.ejs
│
│── models/
│   ├── user.js
│   └── post.js
│
└── public/
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/postify-node-app.git
cd postify-node-app
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Start MongoDB (if local)
```bash
mongod
```

### 4️⃣ Run the server
```bash
node app.js
```

### 5️⃣ Visit in browser
```
http://localhost:3000
```

---

## 🔑 Environment Variables (optional)

You can create `.env`:

```
JWT_SECRET=shhhhh
SESSION_SECRET=secretkey
```

Then replace them in code.

---

## 🛣️ API / Route Overview

### **AUTH**
| Method | Route | Description |
|--------|--------|-------------|
| POST | /register | Create account |
| POST | /login | Login user |
| GET | /logout | Clear cookie |

### **PROFILE**
| Method | Route | Description |
|--------|--------|-------------|
| GET | /profile | Protected Profile Page |

### **POSTS**
| Method | Route | Description |
|--------|--------|-------------|
| POST | /post | Create new post |
| GET | /like/:id | Like/Unlike |
| GET | /edit/:id | Load edit form |
| POST | /update/:id | Update post |

---

## 🖼️ Screenshots (Add your own)

```
/screenshots
    ├── register.png
    ├── login.png
    ├── profile.png
    └── edit_post.png
```

---

## ✨ How Flash Messages Work

Flash messages store temporary messages in session:

```js
req.flash("error", "Invalid password");
res.locals.error // accessible in every EJS file
```

They disappear as soon as the next page loads.

---

## ❤️ Author

**Wahaj Ahmad Khan**  
Node.js | MERN | Backend Developer  

---

## 📝 License

This project is open-source and free to use.

