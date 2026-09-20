// =========================================================================
// OUR SECRET - CONFIGURATION & DATA FILE
// Edit all names, dates, text, and photo lists directly in this file!
// =========================================================================

// Background music file path (Easy to change here!)
const MUSIC_FILE_PATH = "Dipannita_(Lyrics)___Sorry_Dipannita___সরি_দীপান্বিতা___Tarif___Shifat___Lyr.mp3" ;

const CONFIG = {
  // Couple Information
  names: {
    partner1: "Shakibul",
    partner2: "Jannatul",
    coupleTitle: "Shakibul & Jannatul"
  },

  // Relationship Start Date (Format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
  // Date given: 15 February 2026
  startDate: "2026-02-15T00:00:00",

  // Taglines & Quotes
  tagline: "Forever Ours ❤️",
  subtitle: " জান আমি শুধু তোমাকেই ভালোবাসি ", // Bengali subtitle

  // Background Music Settings
  music: {
    enabled: true,
    autoplayOnInteraction: true,
    title: "Dipannita",
    src: MUSIC_FILE_PATH
  },

  // Hero Section Custom Text
  hero: {
    counterTitle: "Together For",
    counterSubtitle: " সবসময় ইচ্ছে করে তোমার পাশে থাকতে"
  },

  // =========================================================================
  // EASY PHOTO CONFIGURATION: Just add your image file paths in these arrays!
  // Put your images in the 'images/' folder (e.g., 'images/photo1.jpg', 'images/photo2.jpg')
  // Every photo appears only ONCE on the site.
  // =========================================================================

  // Section 2: Photo-Only Story Timeline
  timelinePhotos: [
    "images/photo2.jpg"
  ],

  // Section 3: Photo Gallery Grid
  galleryPhotos: [
    "images/photo3.jpg",
    "images/photo4.jpg"
  ],

  // Section 4: Love Letters (Envelope style)
  loveLetters: [
    {
      id: 1,
      title: "To My Dearest Jannatul",
      titleBn: " Bow Jaan",
      date: "15 Feb 2026",
      preview: "From the moment you walked into my life, everything became brighter...",
      content: "My love, Jannatul,\n\nFrom the moment you walked into my life, everything became brighter and full of meaning. Your kindness, your laugh, and the warmth of your eyes illuminate my darkest days. Thank you for choosing me and making every moment special.\n\nYours forever,\nShakibul ❤️",
      contentBn: "প্রিয় জান,\n\nতুমি যখন থেকে আমার জীবনে এসেছ, সবকিছু এক অন্যরকম আলোয় ভরে গেছে। তোমার মিষ্টি হাসি আর ভালোবাসা আমাকে প্রতিদিন নতুন করে বাঁচার স্বপ্ন দেখায়। আমার পাশে থাকার জন্য আর আমার জীবনটাকে এত সুন্দর করে তোলার জন্য ধন্যবাদ।\n\nইতি,\nতোমার শাকিবুল ❤️"
    },
    {
      id: 2,
      title: "Why You Are My Jaan",
      titleBn: "তুমিই আমার মনের জান",
      date: "Night Thoughts",
      preview: "Whenever I am stressed or tired, just thinking of you brings peace...",
      content: "My heart,\n\nNo matter how chaotic the world gets outside, being with you or hearing your voice feels like coming home. You are my calm, my comfort, and my favorite person in the entire universe.\n\nAlways yours,\nShakibul 🌟",
      contentBn: "আমার সোনা,\n\nবাইরের পৃথিবীটা যতই ক্লান্তিকর হোক না কেন, তোমার কন্ঠস্বর শোনামাত্রই আমার মন শান্ত হয়ে যায়। তুমিই আমার আশ্রয়, তুমিই আমার জান।\n\nসবসময় তোমার,\nসাকিবুল 🌟"
    },
    {
      id: 3,
      title: "A Little Secret",
      titleBn: "একটি ছোট্ট গোপন কথা",
      date: "Special Note",
      preview: "Do you know when I fell for you even deeper? It was when...",
      content: "Sweetheart,\n\nHere is a little secret: every time you look away after smiling at me, I pause and thank my luck for having you. Every tiny detail about you drives me crazy in the sweetest way possible.\n\nWith all my love,\nShakibul 💕",
      contentBn: "প্রিয়তমা,\n\nএকটা ছোট গোপন কথা বলি—তুমি যখন আমার দিকে তাকিয়ে মিষ্টি করে হাসো, তখন আমার মনে হয় আমি পৃথিবীর সবচেয়ে ভাগ্যবান মানুষ। তোমার প্রতিটা কথা, প্রতিটা অঙ্গভঙ্গি আমাকে নতুন করে প্রেমে ফেলে।\n\nঅনেক ভালোবাসাসহ,\nশাকিবুল 💕"
    },
    {
      id: 4,
      title: "My Favorite Memory",
      titleBn: "আমার সবচেয়ে প্রিয় স্মৃতি",
      date: "Unforgettable Day",
      preview: "Holding your hand for the very first time was a dream come true...",
      content: "Dearest Jannatul,\n\nRemember when our hands brushed against each other for the first time? My heart skipped a beat! That simple touch felt like an eternal commitment. I hold that memory so close to my heart.\n\nLove always,\nShakibul 🌸",
      contentBn: "প্রিয় জান্নাতুল,\n\nতোমার মনে আছে প্রথমবার যখন তোমার হাত ছুঁয়েছিলাম? আমার হৃদস্পন্দন যেন এক মুহূর্তের জন্য থেমে গিয়েছিল! সেই প্রথম অনুভূতির রেশ আজও আমার মনে তাজা।\n\nভালোবাসাসহ,\nশাকিবুল 🌸"
    },
    {
      id: 5,
      title: "A Promise for Tomorrow",
      titleBn: "আগামীকালের অঙ্গীকার",
      date: "Forever & Ever",
      preview: "I promise to stand by you in every storm and celebrate every joy...",
      content: "My Angel,\n\nLife will bring sunshine and rain, but through it all, I promise to hold your hand tightly. I promise to listen, to care, to respect you, and to love you unconditionally every single day.\n\nForever yours,\nShakibul 💖",
      contentBn: "আমার মিষ্টি পরী,\n\nজীবনের পথ চলায় রোদ কিংবা বৃষ্টি যা-ই আসুক না কেন, আমি কথা দিচ্ছি সবসময় তোমার হাত শক্ত করে ধরে রাখব। তোমায় সম্মান করব, তোমায় আগলে রাখব এবং অকৃত্রিম ভালোবাসায় ভরিয়ে রাখব।\n\nচিরদিনের জন্য তোমার,\nশাকিবুল 💖"
    }
  ],

  // Section 5: Reasons I Love You (Flip Cards)
  reasons: [
    {
      icon: "✨",
      front: "Reason #1",
      frontBn: "কারণ ১",
      back: "Your smile brightens up my worst days instantly.",
      backBn: "তোমার একটা মিষ্টি হাসি আমার সমস্ত ক্লান্তি ও দুঃখ নিমিষে দূর করে দেয়।"
    },
    {
      icon: "💖",
      front: "Reason #2",
      frontBn: "কারণ ২",
      back: "The genuine kindness in your heart for everyone.",
      backBn: "সবাইকে ভালোবাসার মতো একটা সুন্দর ও কোমল হৃদয় আছে তোমার।"
    },
    {
      icon: "🌙",
      front: "Reason #3",
      frontBn: "কারণ ৩",
      back: "How you make me feel safe, valued, and deeply loved.",
      backBn: "তোমার কাছে থাকলে আমি নিজেকে পৃথিবীর সবচেয়ে নিরাপদ ও বিশেষ মানুষ মনে করি।"
    },
    {
      icon: "🌸",
      front: "Reason #4",
      frontBn: "কারণ ৪",
      back: "Your adorable laugh that I could listen to all day long.",
      backBn: "তোমার খিলখিল করে হাসির শব্দ সারাদিন শুনেও আমার মন ভরে না।"
    },
    {
      icon: "☕",
      front: "Reason #5",
      frontBn: "কারণ ৫",
      back: "The way you remember tiny details about us.",
      backBn: "আমাদের সম্পর্কের প্রতিটি ছোট ছোট স্মৃতি তুমি যেভাবে যত্ন করে মনে রাখো।"
    },
    {
      icon: "🚀",
      front: "Reason #6",
      frontBn: "কারণ ৬",
      back: "Because life with you is an endlessly beautiful adventure.",
      backBn: "কারণ তোমার সাথে কাটানো প্রতিটা দিনই একটি সুন্দর ও রোমাঞ্চকর স্বপ্ন।"
    }
  ],

  // Section 6: Our Promises
  promises: [
    {
      icon: "🤝",
      title: "Always Support Your Dreams",
      titleBn: "তোমার স্বপ্নে সারাজীবন সমর্থন দেওয়া",
      text: "I promise to be your biggest cheerleader in everything you wish to achieve.",
      textBn: "তোমার জীবনের সকল লক্ষ্য ও স্বপ্ন পূরণে আমি সবসময় তোমার পাশে দাঁড়িয়ে উৎসাহ দেব।"
    },
    {
      icon: "🤍",
      title: "Patience & Understanding",
      titleBn: "ধৈর্য ও গভীর বোঝাপড়া",
      text: "I promise to listen with empathy, forgive quickly, and grow stronger together.",
      textBn: "যেকোনো পরিস্থিতিতে ধৈর্য ধরে তোমার কথা শুনব এবং ভুলবোঝাবুঝি দূর করে ভালোবাসা বাড়িয়ে নেব।"
    },
    {
      icon: "✈️",
      title: "Explore the World Together",
      titleBn: "একসাথে পৃথিবী ঘুরে দেখা",
      text: "I promise to hold your hand as we travel to new places and make unforgettable memories.",
      textBn: "তোমার হাত ধরে নতুন নতুন জায়গায় ঘুরে বেড়াব আর ভালোবাসার নতুন গল্প লিখব।"
    },
    {
      icon: "🏡",
      title: "Build a Cozy Future",
      titleBn: "সুন্দর এক স্বপ্নের নীড় তৈরি",
      text: "I promise to fill our future home with love, warmth, peace, and endless joy.",
      textBn: "আমাদের আগামী দিনগুলোকে হাসিখুশি, শান্তি এবং ভালোবাসায় ভরিয়ে রাখব।"
    }
  ],

  // Extra Feature: Surprise Button Modal Content
  surprise: {
    buttonText: "Click for a Surprise! 🎁",
    buttonTextBn: "তোমার জন্য একটি চমক! 🎁",
    modalTitle: "A Special Message Just For You ❤️",
    modalTitleBn: "শুধু তোমার জন্য একটি বিশেষ বার্তা ❤️",
    message: "Jannatul, you are my today and all of my tomorrows. No matter where life takes us, my heart will always belong to you. Thank you for being my soulmate!",
    messageBn: "জান্নাতুল, তুমি আমার বর্তমান এবং আমার ভবিষ্যতের সবটুকু জুড়ে আছো। জীবন আমাদের যেখানেই নিয়ে যাক না কেন, আমার মন সবসময় তোমারই থাকবে। আমার জীবনে আসার জন্য তোমাকে অসংখ্য ধন্যবাদ, আমার ভালোবাসা!",
    confettiColors: ['#ffb6c1', '#ff69b4', '#e6e6fa', '#ffd700', '#ffffff', '#ff1493']
  },

  // Footer
  footer: {
    text: "Made with endless love by Shakibul 💕",
    subtext: "Designed for Jannatul • Forever & Always"
  }
};

// Make config globally accessible
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
