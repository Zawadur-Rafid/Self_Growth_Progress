# Self-Growth Skill Tracker

A full-stack web application for tracking personal skill development and growth goals with persistent database storage.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Runtime**: Node.js

## Prerequisites
- Node.js and npm installed
- MySQL server running locally or accessible remotely
- `.env` file with database configuration

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=self_growth_tracker
   PORT=3000
   ```

3. **Set up the database:**
   Import `schema.sql` into your MySQL database:
   ```bash
   mysql -u root -p self_growth_tracker < schema.sql
   ```

4. **Start the server:**
   ```bash
   npm run start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

## Features
- ✅ **Add Skills** - Track skills with name, category, target date, notes, and progress percentage
- 📊 **Progress Tracking** - Monitor completion percentage for each skill
- 📋 **Active & Completed Tabs** - Organize skills by status
- 🎨 **Color-coded Countdown** - Visual indicators for urgency (red for overdue, gold for due soon, green for on track)
- 📈 **Stats Dashboard** - Real-time counts of active skills, due-soon tasks, and completed items
- 💾 **Persistent Storage** - Data saved to MySQL database
- 🌙 **Dark Theme** - Dark background (#0d0f14) with purple/teal gradient accents

## API Endpoints
- `GET /api/skills` - Retrieve all skills
- `POST /api/skills` - Create a new skill
- `PUT /api/skills/:id` - Update skill status or progress
- `DELETE /api/skills/:id` - Delete a skill (if implemented)

## File Structure
- `index.html` - Main UI template
- `app.js` - Frontend JavaScript logic
- `server.js` - Express backend server
- `styles.css` - Styling for the application
- `schema.sql` - MySQL database schema
- `package.json` - Project dependencies and scripts
