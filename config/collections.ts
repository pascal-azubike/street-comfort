export const collections = [
  { image: "/tshirt.png", title: "T-Shirts & Tops", description: "Round neck, Long sleeve, Armless" },
  { image: "/trousers.png", title: "Bottoms", description: "Jeans, Shorts, Trousers" },
  { image: "/hoodie.png", title: "Hoodies & Sweats", description: "Hoodies, Sweatshirts" },
  { image: "/cap.png", title: "Accessories", description: "Caps, Head warmers, Socks" },
  { image: "/polo-shirt.png", title: "Complete Sets", description: "Up & Down, Two-piece sets" },
  { image: "/tanktop.png", title: "Underwear", description: "Singlets, Boxers" },
] as const;

export type Collection = {
  image: string;
  title: string;
  description: string;
}; 