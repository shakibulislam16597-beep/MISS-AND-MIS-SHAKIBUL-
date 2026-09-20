# Our Secret 💕 - Shakibul & Jannatul

A cute, romantic, single-page website created with love for **Shakibul & Jannatul**. Built using HTML5, CSS3, JavaScript, and canvas animation effects.

---

## 🌟 Features

- **Soft Pastel Theme**: Blush pink, cream, dreamy lavender, and warm rose accents. Includes a sleek Dark Mode toggle.
- **Floating Hearts & Sparkles**: HTML5 canvas background particle system with floating hearts and sparkles.
- **Live Counter**: Calculates how many years, months, days, hours, minutes, and seconds Shakibul & Jannatul have been together (starting from `15/02/2026`).
- **Story Timeline**: Vertical interactive timeline of milestone moments with photos, dates, locations, and bilingual captions.
- **Photo Gallery**: Masonry grid layout with image hover effects and full-screen Lightbox slideshow with prev/next and keyboard controls.
- **Love Letters**: Interactive envelope-style cards that open up into modal letters with English + Bengali text.
- **Reasons I Love You**: Interactive 3D flip cards revealing heartfelt reasons on interaction.
- **Our Promises**: Romantic vowing cards for future dreams.
- **Surprise Button**: "Click for a surprise" trigger with custom confetti explosions and a sweet pop-up card.
- **Background Music**: Optional audio player with play/pause button and animated sound wave bars.
- **Bengali & English Support**: Fully optimized fonts for English (`Dancing Script`, `Caveat`, `Nunito`) and Bengali (`Hind Siliguri`, `Galada`).

---

## 🛠️ Easy Customization Guide

All data, text, photos, and dates are stored in **one simple configuration file**: `config.js`.

### 1. Changing Names & Relationship Start Date
Open `config.js` and edit the `names` and `startDate` fields:

```javascript
names: {
  partner1: "Shakibul",
  partner2: "Jannatul",
  coupleTitle: "Shakibul & Jannatul"
},

// Format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
startDate: "2026-02-15T00:00:00",
```

### 2. Adding Your Own Photos
You can replace photo links in `config.js` in the `story` and `gallery` arrays:

- **Option A (Online links)**: Use Unsplash, Imgur, or direct image URLs.
- **Option B (Local images)**: Create an `assets/` or `images/` folder in the project root, place your `.jpg` or `.png` files inside, and set the path in `config.js`:
  ```javascript
  image: "images/first-date.jpg"
  ```

### 3. Editing Love Letters, Reasons & Promises
Simply edit the text strings in `config.js`:
- `story`: Timeline dates, titles, descriptions, and location names.
- `loveLetters`: Envelope letter titles, previews, and full body content in English & Bengali.
- `reasons`: Front title and back secret text for each flip card.
- `promises`: Title, Bengali title, and descriptions for each promise card.
- `surprise`: Surprise button text and modal pop-up message.

### 4. Background Music URL
Replace the MP3 link in `config.js`:
```javascript
music: {
  enabled: true,
  title: "Our Song",
  src: "https://your-domain.com/path-to-your-song.mp3"
}
```

---

## 🚀 Step-by-Step Deployment Guide (Free Hosting)

This project is completely static (no backend required) and can be hosted for **100% free** on Netlify, Vercel, or GitHub Pages.

### Method 1: Deploy to Netlify (Easiest & Fastest)
1. Go to [Netlify.com](https://www.netlify.com/) and sign up for a free account.
2. Drag and drop the folder containing `index.html`, `config.js`, `style.css`, and `script.js` directly onto the Netlify dashboard.
3. Netlify will generate a live URL in seconds! You can customize the domain name under **Site Settings > Change site name**.

### Method 2: Deploy to Vercel
1. Install Vercel CLI via terminal or sign up on [Vercel.com](https://vercel.com/).
2. Run `npx vercel` in the project root directory.
3. Follow the quick prompts to deploy instantly.

### Method 3: Deploy to GitHub Pages
1. Push this project repository to your GitHub account.
2. Go to your repository settings -> **Pages**.
3. Under **Branch**, select `main` (or `master`) and click **Save**.
4. Your website will be published live at `https://<your-username>.github.io/<repo-name>/`.

---

## 📄 File Overview

- `index.html` - Semantic HTML5 single-page structure.
- `config.js` - Centralized data configuration (Names, Dates, Bengali/English content, Photos).
- `style.css` - Responsive CSS design with CSS variables, animations, dark mode, and masonry styles.
- `script.js` - Live counter, floating canvas hearts, theme toggle, audio player, lightbox, and surprise confetti.
- `README.md` - Complete documentation and guide.

---

Made with 💕 for **Shakibul & Jannatul**
