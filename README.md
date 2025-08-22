# PicoStore - E-commerce Product Management System

A modern e-commerce platform built with **Next.js 15**, **MongoDB**, and **NextAuth.js** for seamless product management and user authentication.

---

## Features

- **User Authentication:** Secure login with NextAuth.js supporting Google OAuth and credentials-based authentication.
- **Product Management:** Full CRUD operations for products with categories, tags, and stock tracking.
- **Responsive Design:** Mobile-first design using Tailwind CSS and Radix UI components.
- **Dashboard:** Professional admin dashboard with collapsible sidebar and analytics.
- **Product Browsing:** Advanced product filtering, sorting, and search functionality.
- **Image Management:** Cloudinary integration for product image uploads and optimization.
- **Dark Mode:** Built-in theme toggle for light and dark mode.
- **Toast Notifications:** User-friendly notifications using Sonner.

---

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, Radix UI, Lucide React Icons
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** NextAuth.js with MongoDB adapter
- **Form Handling:** React Hook Form with Zod validation
- **Image Management:** Cloudinary
- **State Management:** React hooks and context
- **HTTP Client:** Axios

---

## Installation and Setup

### Prerequisites

- Node.js 18+
- MongoDB account
- Google OAuth credentials (for Google login)
- Cloudinary account (for image uploads)

### Clone the Repository

```bash
git clone https://github.com/codeswithrakib/picostore.git
cd picostore
npm install

```

### Environment Variables

Create a `.env.local` file in the root folder and add the following:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

## Usage

### Public Features

- Browse products with advanced filtering and sorting
- View detailed product information
- Search for products by name, description, or tags

### Authenticated Features

- Add new products to the catalog
- Manage product inventory
- Access the admin dashboard
- View analytics and reports

## Running the Project

```bash
# Run development server
npm run dev


# Build for production
npm run build
npm start
```

| Route                     | Access    | Description                       |
| ------------------------- | --------- | --------------------------------- |
| `/`                       | Public    | Landing page & product browsing   |
| `/products`               | Public    | List all products                 |
| `/products/:id`           | Public    | Product details page              |
| `/login`                  | Public    | Sign in page (Google/Credentials) |
| `/dashboard`              | Protected | Admin/manager dashboard overview  |
| `/dashboard/add-products` | Protected | Add new products                  |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

---

## License

This project is licensed under the MIT License.
