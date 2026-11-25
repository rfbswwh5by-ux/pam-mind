// Built-in images that ship with the site (in public/media). Pam can replace any
// of them from /admin by uploading her own image on the matching item.
export const LOGO = "/media/logo.png";

export const IMAGES = {
  horizon: "/media/horizon.jpg",
  mystery: "/media/mystery.jpg",
  movement: "/media/movement.jpg",
  meditation: "/media/meditation.jpg",
  wellness: "/media/wellness.jpg",
  desk: "/media/desk.jpg",
  pages: "/media/pages.jpg",
};

export const CATEGORY_IMAGE = {
  Movement: IMAGES.movement,
  Audio: IMAGES.meditation,
  Video: IMAGES.wellness,
  Activities: IMAGES.movement,
  Downloads: IMAGES.pages,
  Programs: IMAGES.horizon,
  Other: IMAGES.pages,
};