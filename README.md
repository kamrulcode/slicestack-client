
# 🍕 SliceStack — Client

A modern, responsive pizza ordering platform built with Next.js. SliceStack connects customers with food vendors through an intuitive ordering experience, while providing dedicated dashboards for vendors and administrators.

## ✨ Features

- **Authentication:** Secure user authentication and role-based access.
- **Customer Dashboard:** Browse menus, manage favorites, place orders, and submit reviews.
- **Vendor Dashboard:** Manage restaurant profiles, menu items, availability, and customer orders.
- **Admin Dashboard:** Manage users, vendors, menu items, approvals, and platform operations.
- **Vendor Approval:** Vendors must receive admin approval before accessing vendor functionality.
- **Menu Management:** Add, edit, update, and manage menu item statuses.
- **Premium Subscription:** Stripe Checkout integration for upgrading vendor accounts.
- **Menu Limits:** Free vendors can publish up to 3 eligible menu items; Premium vendors can publish unlimited items.
- **Favorites & Reviews:** Save favorite menu items and share customer experiences.
- **Image Uploads:** Upload and manage menu and profile images.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Toast Notifications:** User-friendly success and error feedback.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16.4.6 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| Animations | Motion |
| Notifications | Sonner |
| Payment | Stripe Checkout |
| API Communication | Fetch API / configured HTTP client |

> See `package.json` for the complete and exact dependency list.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm
- Running SliceStack backend server

### Installation

1. Clone the repository:

   ```bash
   git clone <CLIENT_REPOSITORY_URL>
   ```

2. Navigate to the project directory:

   ```bash
   cd slicestack-client
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root and configure the environment variables.

   ```env
   NEXT_PUBLIC_API_URL=your_backend_api_url
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your browser:

   ```text
   http://localhost:3000
   ```

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

Check the actual `.env.example` and source code for any additional variables.

## 🌐 Project Links

- **Live Website:** [Visit SliceStack](<LIVE_WEBSITE_URL>)
- **Client Repository:** [GitHub](<CLIENT_REPOSITORY_URL>)
- **Server Repository:** [GitHub](<SERVER_REPOSITORY_URL>)

## 📁 Project Structure

```text
slicestack-client/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── types/
│   └── utils/
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

## 👨‍💻 Author

**Kamrul Islam**

Full Stack MERN Developer

---

Fresh slices. Fast delivery. Good times. 🍕
