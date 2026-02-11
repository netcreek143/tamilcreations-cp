# Tamil Creations - E-commerce Platform

A modern, responsive e-commerce platform for Chennai's premier fashion store specializing in bridal wear, custom designs, and traditional Indian attire.

## 🌟 Features

### Customer Features
- **Beautiful Home Page** with hero banner and featured products
- **Product Catalog** with grid/list view toggle
- **Advanced Filtering** by category, price range, and search
- **Product Details** with image gallery and variant selection
- **User Authentication** - Register and login functionality
- **Mobile Responsive** - Optimized for all screen sizes (320px to 1024px+)
- **Fashion-Themed Design** - Elegant UI with custom color palette

### Admin Features (Planned)
- Dashboard with analytics
- Product management (CRUD operations)
- Order management
- Customer management
- Analytics and reports

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Custom CSS
- **Database**: SQLite (Prisma ORM)
- **Authentication**: NextAuth.js v5
- **Icons**: Lucide React
- **UI**: Custom components with fashion-themed design

## 📦 Installation

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Setup Steps

1. **Clone the repository** (or navigate to the project directory)
   ```bash
   cd d:\tamilcreations-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   If you encounter npm errors, try:
   ```bash
   npm cache clean --force
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env` file (already created) and update if needed:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="sai-agalyas-arts-fashion-secret-key-2026"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the database** with sample data
   ```bash
   npx prisma db seed
   ```
   
   This creates:
   - Admin user: `admin@tamilcreations.com` / `admin123`
   - Sample customer: `customer@example.com` / `customer123`
   - 4 categories
   - 10 sample products

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Login Credentials

**Admin Access:**
- Email: `admin@saiagalyas.com`
- Password: `admin123`

**Customer Access:**
- Email: `customer@example.com`
- Password: `customer123`

## 📁 Project Structure

```
slooze-frontend/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── products/             # Product endpoints
│   │   └── categories/           # Category endpoints
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── shop/                     # Product catalog
│   ├── products/[id]/            # Product detail pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css              # Global styling
├── components/
│   └── layout/                   # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/                          # Utility functions
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client
│   ├── utils.ts                  # Helper functions
│   └── validations.ts            # Zod schemas
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding
├── public/
│   └── images/                   # Static images
└── types/                        # TypeScript types
```

## 🎨 Design Features

- **Mobile-First** responsive design
- **Fashion-Themed** color palette (Dusty Rose #C48B9F, Gold #D4AF37)
- **Custom Fonts**: Inter (body) and Playfair Display (headings)
- **Smooth Animations** and hover effects
- **Glassmorphism** effects on hero section
- **Touch-Friendly** UI elements
- **Accessible** with proper keyboard navigation

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Create production build
npm run start        # Start production server

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Create new migration
npx prisma db seed   # Seed database with sample data

# Linting
npm run lint         # Run ESLint
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🔄 Next Steps (To-Do)

- [ ] Implement shopping cart with localStorage
- [ ] Add checkout flow with Razorpay integration
- [ ] Build user profile and order history pages
- [ ] Implement wishlist functionality
- [ ] Create admin dashboard
- [ ] Add product review/rating system
- [ ] Implement email notifications
- [ ] Add image upload for admin
- [ ] Deploy to Vercel/Render

## 🐛 Known Issues

- Lint errors appear due to missing node_modules (run `npm install` to fix)
- Placeholder images used (replace with actual product images)
- Cart functionality pending implementation
- Payment gateway integration pending

## 📝 API Endpoints

### Public Endpoints
- `GET /api/products` - List products with filtering
- `GET /api/products/[id]` - Get product details
- `GET /api/categories` - List all categories
- `POST /api/auth/register` - Register new user

### Protected Endpoints
- `POST /api/auth/[...nextauth]` - Authentication
- Protected routes require authentication via NextAuth

## 🤝 Contributing

This is a private project for Sai Agalyas Arts & Fashion.

## 📄 License

All rights reserved © 2026 Sai Agalyas Arts & Fashion

## 📞 Support

For issues or questions, contact: info@saiagalyas.com

---

**Made with ❤️ in Chennai, India**
