# Wanderlust

A full-stack Airbnb-like travel listing web app built with Node.js, Express, MongoDB, and EJS.

## Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Templating:** EJS + ejs-mate (layouts)
- **Auth:** Passport.js (local strategy, passport-local-mongoose)
- **Storage:** Cloudinary (images via Multer)
- **Maps:** MapTiler SDK
- **Validation:** Joi
- **Sessions:** express-session + connect-flash

## Running the Project

```bash
# Install dependencies
npm install

# Seed the database (optional)
node init/index.js

# Start server
node app.js
# Server runs on http://localhost:8080
```

MongoDB must be running locally at `mongodb://127.0.0.1:27017/wanderlust`.

## Environment Variables

Create a `.env` file in the project root:

```
CLOUD_NAME=<cloudinary_cloud_name>
CLOUD_API_KEY=<cloudinary_api_key>
CLOUD_API_SECRET=<cloudinary_api_secret>
MAP_API_KEY=<maptiler_api_key>
```

## Project Structure

```
app.js              # Main entry point (port 8080)
middleware.js       # Auth + validation middleware
cloudConfig.js      # Cloudinary setup
schema.js           # Joi validation schemas
models/             # Mongoose models (user, listing, review)
controllers/        # Route handlers (users, listings, reviews)
routes/             # Express routers (user, listing, review)
views/              # EJS templates
  layouts/          # Base layout (boilerplate.ejs)
  includes/         # Partials (navbar, footer, flash)
  listings/         # Listing views (index, new, edit, show)
  users/            # Auth views (login, signup)
public/             # Static assets (CSS, JS)
utils/              # ExpressError, wrapAsync helpers
init/               # DB seed scripts
```

## Routes

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/listings` | All listings | No |
| GET | `/listings/new` | New listing form | Login required |
| POST | `/listings` | Create listing | Login required |
| GET | `/listings/:id` | Listing details | No |
| GET | `/listings/:id/edit` | Edit form | Owner only |
| PUT | `/listings/:id` | Update listing | Owner only |
| DELETE | `/listings/:id` | Delete listing | Owner only |
| POST | `/listings/:id/reviews` | Add review | Login required |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete review | Author only |
| GET | `/signup` | Signup form | No |
| POST | `/signup` | Register user | No |
| GET | `/login` | Login form | No |
| POST | `/login` | Authenticate | No |
| GET | `/logout` | Logout | No |

## Data Models

- **Listing:** title, description, price, location, country, image (url+filename), owner (ref User), reviews (ref Review[])
- **Review:** comment, rating (1-5), createdAt, author (ref User)
- **User:** username, email (+ password hashing via passport-local-mongoose)
