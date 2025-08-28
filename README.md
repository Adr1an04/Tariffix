# Tariffix

A monorepo containing a web application to teach users about import tariffs and a browser extension to help estimate them.

-   **Website**: A Next.js app that explains tariff fundamentals and showcases the browser extension.
-   **Browser Extension**: A simple tool to analyze product pages, suggest HTS codes, and estimate duties.

## Tech Stack

-   **Framework**: Next.js
-   **Database**: MongoDB (with Mongoose)
-   **AI**: Google Gemini
-   **Styling**: Tailwind CSS
-   **Package Manager**: pnpm

## Prerequisites

-   Node.js (v18 or later)
-   pnpm (v8 or later)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Adr1an04/Tariffix.git
cd Tariffix
```

### 2. Install Dependencies

Install all dependencies from the root of the monorepo.

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a new file named `.env` in the root of the project. This file is required to store your API keys and database connection string.

Copy the content below into your `.env` file and replace the placeholder values with your actual credentials.

```env
# Get a key from Google AI Studio (https://makersuite.google.com/app/apikey)
GEMINI_API_KEY="your-google-ai-api-key"
NEXT_PUBLIC_GEMINI_API_KEY="your-google-ai-api-key"

# Get a connection string from MongoDB Atlas
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
```

### 4. Running the Website

To run the website in development mode:

```bash
pnpm dev:website
```

Navigate to `http://localhost:3000` to view the application.

### 5. Using the Browser Extension

#### Build the Extension

First, build the extension's static files.

```bash
pnpm build:extension
```

This command creates a `dist` folder inside `apps/extension`.

#### Install in a Chromium-based Browser

1.  Open your browser and navigate to `chrome://extensions`.
2.  Enable **Developer mode** (usually a toggle in the top-right corner).
3.  Click **Load unpacked**.
4.  Select the `apps/extension/dist` folder from this project.

The Tariffix extension will now be available in your browser.
