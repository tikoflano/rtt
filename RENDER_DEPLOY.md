# Deploying Race Time Tracker to Render

This guide walks you through deploying the app to Render for remote testing.

## Prerequisites

- A [Render](https://render.com) account (free tier works)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Option A: Deploy with Blueprint (Recommended)

The `render.yaml` in this repo defines the full stack: web service, PostgreSQL, and Redis.

### Steps

1. **Push your code** to GitHub/GitLab/Bitbucket (if not already).

2. **Go to Render Dashboard** → [dashboard.render.com](https://dashboard.render.com)

3. **Create a Blueprint**:
   - Click **New** → **Blueprint**
   - Connect your repository
   - Render will detect `render.yaml` and show the services to create
   - Click **Apply** to create everything

4. **Wait for the first deploy** (5–10 minutes). The build will:
   - Install Node.js and build the Angular frontend
   - Install Python dependencies
   - Run database migrations
   - Collect static files

5. **Create an admin user** (required to log in):
   - In the Render dashboard, open your **rtt-web** service
   - Go to **Shell** tab
   - Run: `python manage.py createsuperuser`
   - Follow the prompts to set username, email, and password

6. **Access your app** at the URL Render provides (e.g. `https://rtt-web-xxxx.onrender.com`)

### Free Tier Notes

- **Web service**: Spins down after ~15 minutes of inactivity. First request may take 30–60 seconds to wake up.
- **PostgreSQL**: Free for 90 days, then you’ll need to upgrade or export data.
- **Redis (Key Value)**: Free tier available for testing.

---

## Option B: Manual Setup (if Blueprint fails)

If the Blueprint doesn’t work (e.g. Key Value not available in your region), you can set up manually:

1. **Create a PostgreSQL database**  
   New → PostgreSQL → Free plan.

2. **Create a Key Value (Redis) instance** (optional)  
   New → Key Value → Free plan.  
   If you skip this, the app uses in-memory channels (single instance only).

3. **Create a Web Service**  
   New → Web Service → Connect your repo.

4. **Configure the Web Service**:
   - **Build Command**: `./build.sh`
   - **Start Command**: `daphne -b 0.0.0.0 -p $PORT rtt.asgi:application`
   - **Environment Variables**:
     - `RENDER` = `true`
     - `DATABASE_URL` = (from your PostgreSQL service → Connect → Internal URL)
     - `REDIS_URL` = (from Key Value → Connect → Internal URL, if you created one)
     - `SECRET_KEY` = (generate a random string, e.g. from `openssl rand -hex 32`)
     - `DEBUG` = `false`

5. **Deploy** and create a superuser via the Shell as in Option A.

---

## Troubleshooting

### Build fails on Angular

- Ensure `frontend/package.json` and `frontend/package-lock.json` are committed.
- Check the build logs for Node/npm errors.

### "DisallowedHost" or 400 errors

- `ALLOWED_HOSTS` is set from `RENDER_EXTERNAL_HOSTNAME`. If you use a custom domain, add it in the Render dashboard under Environment.

### Static files not loading

- Confirm `python manage.py collectstatic` runs during the build (it’s in `build.sh`).
- Check that WhiteNoise is in `requirements.txt`.

### Database connection errors

- Verify `DATABASE_URL` is set and uses the **Internal** URL (not External) when the database is in the same Render account.

---

## Environment Variables Reference

| Variable        | Required | Description                                      |
|----------------|----------|--------------------------------------------------|
| `RENDER`       | Yes      | Set to `true` on Render                          |
| `DATABASE_URL` | Yes      | PostgreSQL connection string from Render        |
| `REDIS_URL`    | No       | Redis URL; if omitted, in-memory channels used  |
| `REDIS_HOST`   | No       | Alternative: Redis host (with `REDIS_PORT`)       |
| `SECRET_KEY`   | Yes      | Django secret; use a random string in production|
| `DEBUG`        | No       | Set to `false` in production                     |
