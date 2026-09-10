# URL Shortener - Frontend

A simple, modern, and responsive web application for creating, managing, and tracking shortened URLs with user authentication and click analytics.

## 🚀 Features

- **User Authentication**: Secure Sign Up, Log In, Email Verification, and Password Reset workflows.
- **Analytics Dashboard**: Real-time overview of total link clicks and short URLs created.
- **URL Creation**: Convert long web addresses into short, memorable links.
- **Link Management**: View all created short URLs, edit destination links or titles, and delete URLs.
- **Seamless Redirection**: Automatic redirection to target destinations with dynamic click counting.

## 🛠️ Tech Stack

- **Core**: React 18, React Router v6
- **UI & Styling**: React Bootstrap, Material-UI (MUI), Custom CSS
- **Form Handling & Validation**: Formik, Yup
- **Notifications**: React Toastify

## ⚙️ Environment Configuration

Create a `.env` file in the root folder using `.env.example` as a template:

```env
REACT_APP_API_URL=https://url-shortener-xndv.onrender.com
REACT_APP_FRONTEND_URL=https://shorturl0.netlify.app
```

## 💻 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm start
```
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### 3. Production Build
```bash
npm run build
```
Builds the app for production in the `build` directory.
