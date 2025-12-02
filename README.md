# News Web Application 🌐

A secure, responsive web application that aggregates real-time news from external APIs (The Guardian and NewsAPI) with user authentication, data transformation, error handling, and logging.

## 📋 Assignment Overview
This project was developed as part of the **Web Services Integration and Security** assignment, demonstrating practical implementation of:
1. **Web Service Integration** – Consuming external RESTful APIs
2. **API Authentication & Authorization** – JWT-based security
3. **Data Transformation** – Parsing and displaying API data
4. **Error Handling & Logging** – Comprehensive exception management

## ✨ Features
- 🔐 **JWT Authentication** – Secure login/logout with token-based authorization
- 📰 **Multi-Source News Aggregation** – Fetches from The Guardian API with NewsAPI fallback
- 🏷️ **Category Filtering** – Browse news by categories (sports, technology, business, etc.)
- 🔍 **Search Functionality** – Find articles by keywords
- 📱 **Responsive Design** – Mobile-friendly UI with CSS Grid/Flexbox
- 📊 **Pagination** – Browse articles page by page
- 🛡️ **Protected Routes** – Middleware secures API endpoints
- 📝 **Request Logging** – Winston logs all API activities
- ⚡ **Error Handling** – Graceful fallback when primary API fails

## 🏗️ System Architecture

## 🛠️ Technologies Used

### Backend
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **JSON Web Tokens (JWT)** – Authentication
- **Axios** – HTTP client for API calls
- **Winston** – Logging library
- **CORS** – Cross-origin resource sharing

### Frontend
- **HTML5** – Markup structure
- **CSS3** – Styling and responsiveness
- **Vanilla JavaScript** – Client-side logic
- **Axios (CDN)** – HTTP requests from browser

### External APIs
- **The Guardian Open Platform** – Primary news source
- **NewsAPI.org** – Fallback news source

### Development Tools
- **VS Code** – Code editor
- **Postman** – API testing
- **Git & GitHub** – Version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/news-web-app.git
   cd news-web-app
   npm install

   Environment Setup (Optional)
GUARDIAN_API_KEY=your_key_here
NEWSAPI_KEY=your_key_here
JWT_SECRET=your_secret_here
JWT_SECRET=your_secret_here
# 🧪 **Testing**

The application has been tested across multiple layers to ensure reliability, correctness, and user experience.

---

## ✅ **Unit Testing**

* Authentication flow
* API response parsing
* Token validation

---

## 🔗 **Integration Testing**

* Login → Token → Protected routes workflow
* Category filtering + pagination
* Search functionality

---

## 🖥️ **UI Testing**

* Responsive design (mobile, tablet, desktop)
* Cross-browser compatibility

---

## ❗ **Error Testing**

* Invalid login attempts
* Expired tokens
* API failures and fallback handling

---

# 📸 **Screenshots**

| Login Page                         | Dashboard                              | News Display                      |
| ---------------------------------- | -------------------------------------- | --------------------------------- |
| ![](https://screenshots/login.png) | ![](https://screenshots/dashboard.png) | ![](https://screenshots/news.png) |

> **Note:** Add real screenshots inside a `/screenshots` folder in your project.

---

# 🔗 **API Endpoints**

| Method   | Endpoint          | Description             | Auth Required |
| -------- | ----------------- | ----------------------- | ------------- |
| **POST** | `/api/login`      | User login, returns JWT | ✅           |
| **GET**  | `/api/news`       | Fetch news articles     | ✅             |
| **GET**  | `/api/categories` | Get list of categories  | ✅             |

---

# 📈 **Key Implementation Details**

## 🌐 **Web Service Integration**

* **The Guardian API** – Primary source, no key required for testing
* **NewsAPI** – Fallback source, handles rate limiting gracefully
* **Data Transformation** – Raw external API responses mapped into a unified structure

---

## 🔐 **Authentication & Authorization**

* JWT tokens issued on login
* Protected routes require valid `Bearer <token>`
* Expired tokens return HTTP `401 Unauthorized`
* Middleware validates tokens in all protected routes

---

## ⚠️ **Error Handling & Logging**

* **Winston logger** tracks:

  * timestamps
  * routes
  * response times
  * status codes
* Fallback API activates automatically if primary API fails
* Frontend displays user-friendly error messages

---

# 🎯 **Assignment Requirements Coverage**

| Requirement                      | Status                           |
| -------------------------------- | -------------------------------- |
| External RESTful API consumption | ✅ Guardian API + NewsAPI         |
| Authentication mechanism         | ✅ JWT + middleware               |
| Data transformation & display    | ✅ News cards with formatted data |
| Error handling & logging         | ✅ Winston + fallback system      |
| GitHub submission                | ✅ Project uploaded               |
| Report documentation             | ✅ Detailed report included       |

---

# 🚧 **Challenges & Solutions**

| Challenge                      | Solution                                    |
| ------------------------------ | ------------------------------------------- |
| Missing images in Guardian API | Placeholder images for missing thumbnails   |
| NewsAPI rate limiting          | Used only as fallback                       |
| CORS issues                    | Configured Express CORS middleware          |
| Token expiration               | Auto-clear localStorage + redirect to login |

---

# 📝 **Future Enhancements**

* User preferences and saved articles
* Admin dashboard
* Multi-language UI support
* Weather API integration
* OAuth 2.0 login (Google, Facebook)
* Full unit testing with Jest / Mocha
* Docker containerization

---

# 📚 **References**

* **Express.js Documentation**
* **The Guardian Open Platform**
* **NewsAPI Documentation**
* **JWT Documentation**
* **Winston Logging Library**

---

# 👥 **Contributors**

* **Abenezer Tamiru** (RU 2154/14)
* **Betselot Abraham** (RU 1612/14)
* **Mengistu Tadesse** (RU 1187/14)
* **Natnael Bayu** (RU 1408/14)
* **Eman Hussen** (RU 0279/14)

**Jimma Institute of Technology**
*Faculty of Computing and Informatics*
*Department of Software Engineering*

