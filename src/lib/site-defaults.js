// Default text for the website. Site Settings in /admin overrides every value.
export const DEFAULT_SETTINGS = {
  site_name: "Pam’s Mind Flights",
  tagline: "Stories that take the mind somewhere new.",
  logo_image: "",
  author_name: "Pam Christy",
  author_bio:
    "[Placeholder biography] Pam’s short author biography will appear here. Replace this text in Site Settings with a few sentences about who Pam is, what she writes, and what readers can expect from her books.",
  author_story:
    "[Placeholder: Pam’s Story] This section is reserved for Pam’s personal story, in her own words. It can cover how she came to writing and the path that led to Pam’s Mind Flights.",
  why_i_write:
    "[Placeholder: Why I Write] A few sentences from Pam about why she writes and what she hopes readers take with them.",
  what_inspires:
    "[Placeholder: What Inspires Me] Pam’s reflections on the people, places and ideas that inspire her work.",
  author_qa: [
    { question: "[Author Q&A question]", answer: "[Pam’s answer will appear here once supplied.]" },
  ],
  author_quote: "[Insert a personal quote from Pam about writing, creativity, or storytelling.]",
  profile_photo: "",
  contact_email: "",
  facebook_url: "",
  instagram_url: "",
  footer_text: "Stories that take the mind somewhere new.",
  hero_headline: "Stories That Take the Mind Somewhere New.",
  hero_description:
    "Welcome to Pam’s Mind Flights — a collection of books, ideas, resources, and experiences created by author Pam Christy.",
  hero_cta_primary: "Explore the Books",
  hero_cta_secondary: "Meet Pam",
  intro_headline: "Every book begins a different journey.",
  intro_body:
    "Pam’s writing explores different subjects, audiences, and experiences. Pam’s Mind Flights brings those works together in one place while giving each story room to have its own identity.",
  newsletter_headline: "Where Will Your Mind Fly Next?",
  newsletter_body:
    "Stay connected with Pam’s Mind Flights for new books, resources, and creative projects.",
  wellness_disclaimer:
    "[Editable disclaimer] The wellness and educational content on this page is shared for general informational purposes only and is not medical advice. It is not intended to diagnose, treat, cure, or prevent any condition. Please consult a qualified healthcare professional with any questions about your health.",
  meta_title: "Pam’s Mind Flights | Stories That Take the Mind Somewhere New",
  meta_description:
    "Books, resources and experiences from author Pam Christy. Explore the library of Pam’s Mind Flights.",
  share_image: "",
  // Page text (Site Settings → Page text)
  hero_eyebrow: "An author’s world of stories",
  intro_image: "",
  intro_caption: "Each book, its own destination.",
  library_title: "Explore the Library",
  library_intro: "Three very different journeys, each with its own voice, and some with experiences that continue beyond the final page.",
  more_title: "More Than a Book",
  more_intro: "Some of Pam’s books open into something more: movement for families, audio for quiet moments, and videos to learn alongside.",
  latest_title: "Latest From Pam",
  behind_title: "Behind the Stories",
  about_heading: "Meet Pam",
  books_page_title: "The Books of Pam’s Mind Flights",
  books_page_intro: "Every title is its own destination. Browse by category, then step inside each book to find its story and the experiences that go with it.",
  experiences_page_title: "Beyond the Books",
  experiences_page_intro: "Some of Pam’s books continue past the final page, into family movement, guided audio, video resources and more. Explore everything connected to the library here.",
  news_page_title: "News & Updates",
  news_page_intro: "Announcements, events, new resources and notes from Pam.",
  contact_page_title: "Get in Touch",
  contact_page_intro: "Questions about a book, an event or media inquiry, or an invitation to your book club: Pam would love to hear from you.",
  // Legal pages
  legal_notice: true,
  legal_updated: "[Date]",
  privacy_sections: [
    { heading: "Who we are", body: "[Placeholder] Pam’s Mind Flights is the author website of Pam [Last Name]. Insert the legal name and contact details of the site owner here." },
    { heading: "Information we collect", body: "[Placeholder] Describe the information collected, such as the name and email address submitted through the contact form or mailing list signup, and technical information collected automatically when visiting the site." },
    { heading: "How we use information", body: "[Placeholder] Explain how information is used: for example, to reply to messages and to send occasional updates to people who have opted in." },
    { heading: "Email communications", body: "[Placeholder] Explain how subscribers can unsubscribe from the mailing list at any time, and which email provider (if any) processes subscriber data." },
    { heading: "Cookies & analytics", body: "[Placeholder] Describe any cookies or analytics tools used on the site, and how visitors can control them." },
    { heading: "Third-party links", body: "[Placeholder] The site links to third-party retailers and social platforms. Their privacy practices are governed by their own policies." },
    { heading: "Data retention & security", body: "[Placeholder] Describe how long information is kept and the measures taken to protect it." },
    { heading: "Your rights", body: "[Placeholder] Describe the rights visitors may have regarding their personal information, depending on where they live, and how to exercise them." },
    { heading: "Contact", body: "[Placeholder] Provide a contact method for privacy questions." },
  ],
  terms_sections: [
    { heading: "Acceptance of terms", body: "[Placeholder] Explain that by using this website, visitors agree to these terms." },
    { heading: "Use of the website", body: "[Placeholder] Describe acceptable use of the site and its content." },
    { heading: "Intellectual property", body: "[Placeholder] State that book content, text, images and other materials on the site belong to Pam [Last Name] or their respective owners, and may not be reproduced without permission." },
    { heading: "Wellness & educational content", body: "[Placeholder] State that wellness and educational materials are provided for general information only and are not a substitute for professional medical advice." },
    { heading: "Purchases & third-party retailers", body: "[Placeholder] Explain that purchases made through external retailers are subject to those retailers’ terms." },
    { heading: "Limitation of liability", body: "[Placeholder] Insert limitation of liability language reviewed by a legal professional." },
    { heading: "Changes to these terms", body: "[Placeholder] Describe how and when these terms may be updated." },
    { heading: "Contact", body: "[Placeholder] Provide a contact method for questions about these terms." },
  ],
  featured_offering_id: "",
  featured_article_id: "",
  analytics_id: "",
};

// Starter content, copied into the database the first time the site runs so
// every item shows up in /admin, where Pam can edit, replace or delete it.
// Text in [square brackets] is placeholder copy: the dashboard flags it as
// “Needs Pam’s real content”.
const today = new Date().toISOString().slice(0, 10);

export const SEED = {
  Book: [
    {
      id: "starter-book-1", title: "[Children’s Book Title]", slug: "childrens-book", subtitle: "[Subtitle]", genre: "Children’s Picture Book", category: "Children's",
      short_description: "[Placeholder] A short, warm description of Pam’s children’s book and the adventure inside it.",
      full_description: "[Placeholder] The full description of the book goes here. Pam can write several paragraphs, and use **bold** or *italic* text.",
      pull_quote: "[A favourite line from the book.]", theme: "playful", accent_primary: "#E0836B", accent_secondary: "#F2C14E", accent_background: "#FFF4E8",
      related_label: "Child Fun Movement", formats: ["Paperback", "Hardcover"], purchase_links: [], additional_images: [],
      characters: [{ name: "[Character name]", description: "[A sentence about this character.]", image: "" }],
      featured: true, status: "published", sort_order: 0,
    },
    {
      id: "starter-book-2", title: "[Wellness Book Title]", slug: "wellness-book", subtitle: "[Subtitle]", genre: "Wellness", category: "Wellness",
      short_description: "[Placeholder] A short description of Pam’s wellness book and what readers will take from it.",
      full_description: "[Placeholder] The full description of the book goes here.",
      pull_quote: "[A favourite line from the book.]", theme: "serene", accent_primary: "#7FA59A", accent_secondary: "#B7A999", accent_background: "#EEF4F1",
      related_label: "Guided Meditation", formats: ["Paperback", "eBook"], purchase_links: [], additional_images: [], characters: [],
      featured: true, status: "published", sort_order: 1,
    },
    {
      id: "starter-book-3", title: "[Mystery Novel Title]", slug: "mystery-novel", subtitle: "[Subtitle]", genre: "Murder Mystery", category: "Mystery",
      short_description: "[Placeholder] A short, intriguing description of Pam’s mystery novel, without giving the ending away.",
      full_description: "[Placeholder] The full description of the book goes here.",
      pull_quote: "[A favourite line from the book.]", theme: "cinematic", accent_primary: "#2E3A59", accent_secondary: "#B7A999", accent_background: "#E9E7EF",
      formats: ["Paperback", "eBook"], purchase_links: [], additional_images: [], characters: [],
      featured: true, status: "published", sort_order: 2,
    },
  ],
  Offering: [
    {
      id: "starter-offering-1", title: "[Family Movement Program]", type: "Program", experience_category: "Movement", book_id: "starter-book-1",
      description: "[Placeholder] Describe the movement experience that goes with the children’s book.", cta_text: "Explore the Movement",
      featured: true, coming_soon: false, status: "published", sort_order: 0,
    },
    {
      id: "starter-offering-2", title: "[Printable Activity Pages]", type: "Download", experience_category: "Downloads", book_id: "starter-book-1",
      description: "[Placeholder] Describe the printable activities families can download.", cta_text: "Download",
      featured: false, coming_soon: true, status: "published", sort_order: 1,
    },
  ],
  AudioItem: [
    {
      id: "starter-audio-1", title: "[Guided Meditation]", book_id: "starter-book-2", duration: "[10 min]",
      description: "[Placeholder] Describe this guided audio. Upload an audio file in the dashboard and visitors can listen right on the page.",
      status: "published", sort_order: 0,
    },
  ],
  Video: [
    {
      id: "starter-video-1", title: "[Video Title]", book_id: "starter-book-2", provider: "youtube", video_url: "", category: "Wellness", duration: "",
      description: "[Placeholder] Describe this video. Paste a YouTube or Vimeo link, or upload a video file, in the dashboard.",
      status: "published", sort_order: 0,
    },
  ],
  Article: [
    {
      id: "starter-article-1", title: "[Welcome to Pam’s Mind Flights]", slug: "welcome", category: "Personal Update", publish_date: today,
      excerpt: "[Placeholder] A short welcome note from Pam.",
      body: "[Placeholder] This is a news post. Pam can write announcements, events and updates here from the dashboard.",
      status: "published",
    },
  ],
};
