# Sharu The Design Studio

Boutique website for Men, Women, Kids and family/group matching outfits.
No cart, no payments, no orders - customers browse the collection and visit the studio.
Key feature: **Measurements** - customers abroad follow picture guides and send their sizes to the admin.

Stack: Next.js 14 (App Router), MongoDB Atlas (Mongoose), Cloudinary, JWT admin login, Framer Motion.

## Setup
1. Install Node.js 18.18+ (Node 20 recommended).
2. Copy `.env.example` to `.env` and put your real values (MongoDB URI, JWT secret, admin password, Cloudinary keys).
3. In MongoDB Atlas > Network Access, allow your IP (or 0.0.0.0/0 for testing).
4. Run:
   ```
   npm install
   npm run dev
   ```
5. Open http://localhost:3000 and the admin at http://localhost:3000/admin

## First time in admin
1. Log in with `ADMIN_PASSWORD`.
2. Dashboard > "Load sample categories and guides" (optional) - gives ready measurement lists.
3. **Measurement guides**: open each guide, add a photo for every measurement (neck, chest, sleeve...), save.
4. **Categories**: upload an image for each function (wedding, office, party, lehenga...).
5. **Products**: add dresses with photos, choose For (Men/Women/Kids/Family) and Category.
6. **Site settings**: address, phone, WhatsApp, hours, hero image.
7. **Customer measurements**: all customer submissions appear here with WhatsApp / call links and status.

## Deploy
Push to GitHub and import in Vercel. Add every variable from `.env.example` in Vercel > Settings > Environment Variables
and set `NEXT_PUBLIC_SITE_URL` to your real domain (used for SEO sitemap). Vercel limits upload size to ~4.5 MB per image.

## Security
Never commit `.env`. Use a strong `ADMIN_PASSWORD` and a long random `JWT_SECRET`.
