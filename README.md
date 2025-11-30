# 🧱 Habit Tracker
A web application for creating, tracking, and organizing habits. The project is built with **Next.js**, uses **MongoDB**, **Chakra UI**, **Zustand**, and includes full authentication and habit-management functionality.

---

## ✨ Features

### 👤 Authentication
- User registration  
- Login with email + password  
- Forgot password flow  
- Email verification with 6-digit code (OTP)  
- Protected API routes using JWT  

### 📘 Habit Management
- Create a habit  
- Edit a habit  
- Delete or archive a habit  
- Mark daily progress (check-in)  

### 🗂 Habit Groups
- Create groups that combine multiple habits
- Edit a group 
- View and manage habits inside groups  

### 🎨 UI Theme
- Light & dark themes

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**
- **React 19**
- **Chakra UI**
- **TailwindCSS 4**
- **React Hook Form**
- **Zustand** (state management)

### Backend (inside Next.js)
- **MongoDB** + **Mongoose**
- **JWT** + `jwt-decode`
- **bcrypt / bcryptjs** for password hashing
- **Nodemailer / Resend** for sending email
- **Crypto** for secure code generation

