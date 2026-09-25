export type CategoryId = "coffee" | "tea" | "smoothies" | "food" | "desserts"

export type Tone = "forest" | "amber" | "neutral"

export type Product = {
  slug: string
  name: string
  category: CategoryId
  kicker: string
  price: number
  kcal: number
  image: string
  badge: string
  imageTag?: string
  tags: { label: string; tone: Tone }[]
  extra?: string
  customizable?: boolean
  description?: string
}

export type Category = {
  id: CategoryId
  label: string
  count: number
  eyebrow: string
  title: string
  note?: string
}

export const categories: Category[] = [
  {
    id: "coffee",
    label: "Coffee",
    count: 14,
    eyebrow: "Single Origin & Specialty Espresso",
    title: "Coffee & Extraction Lab",
  },
  {
    id: "tea",
    label: "Tea & Infusions",
    count: 8,
    eyebrow: "Ceremonial & Botanical Leaf",
    title: "Tea & Infusions",
  },
  {
    id: "smoothies",
    label: "Smoothies",
    count: 6,
    eyebrow: "Cold-Pressed & Blended",
    title: "Smoothies & Wellness Elixirs",
  },
  {
    id: "food",
    label: "Artisanal Food",
    count: 10,
    eyebrow: "Kitchen & Hearth",
    title: "Artisanal Food & Warm Plates",
    note: "Served until 3:00 PM daily",
  },
  {
    id: "desserts",
    label: "Desserts",
    count: 5,
    eyebrow: "Pastry Laboratory",
    title: "Handcrafted Desserts & Sweets",
    note: "Baked in small daily batches",
  },
]

export const filters = [
  "All Creations",
  "Seasonal Favorites",
  "Iced & Cold Brew",
  "Single Origin Micro-lots",
  "Dairy-Free Natural",
]

export const products: Product[] = [
  {
    slug: "honey-cinnamon-oat-latte",
    name: "Honey Cinnamon Oat Latte",
    category: "coffee",
    kicker: "House Signature",
    price: 6.25,
    kcal: 180,
    image: "/images/honey-cinnamon-oat-latte.jpg",
    badge: "Hot / Iced",
    imageTag: "Barista Pick",
    tags: [{ label: "Velvety & Warm", tone: "amber" }],
    customizable: true,
    description:
      "Rich organic espresso blended with velvety steamed oat milk, pure wildflower honey, and fresh-cracked Sri Lankan Ceylon cinnamon bark.",
  },
  {
    slug: "brown-sugar-oat-shaken-espresso",
    name: "Brown Sugar Oat Shaken Espresso",
    category: "coffee",
    kicker: "Seasonal Brew",
    price: 6.5,
    kcal: 165,
    image: "/images/brown-sugar-shaken-espresso.jpg",
    badge: "Hot / Iced",
    imageTag: "V · GF",
    tags: [{ label: "Vegan", tone: "forest" }],
  },
  {
    slug: "cardamom-pistachio-cortado",
    name: "Cardamom Pistachio Cortado",
    category: "coffee",
    kicker: "Aromatic Reserve",
    price: 5.85,
    kcal: 130,
    image: "/images/cardamom-pistachio-cortado.jpg",
    badge: "Hot",
    imageTag: "Spiced Nut",
    tags: [{ label: "Signature", tone: "amber" }],
  },
  {
    slug: "bourbon-barrel-cold-brew",
    name: "Bourbon Barrel Cold Brew",
    category: "coffee",
    kicker: "Aged Cask",
    price: 6.75,
    kcal: 15,
    image: "/images/bourbon-barrel-cold-brew.jpg",
    badge: "Cold Only",
    imageTag: "20h Barrel Steep",
    tags: [{ label: "Oak & Vanilla", tone: "amber" }],
  },
  {
    slug: "velvet-flat-white",
    name: "Velvet Flat White",
    category: "coffee",
    kicker: "Traditional Classics",
    price: 4.95,
    kcal: 120,
    image: "/images/velvet-flat-white.jpg",
    badge: "Hot",
    imageTag: "Double Ristretto",
    extra: "6 oz",
    tags: [{ label: "Intense & Smooth", tone: "amber" }],
    customizable: true,
  },
  {
    slug: "ceremonial-matcha-espresso-fusion",
    name: "Ceremonial Matcha Espresso Fusion",
    category: "coffee",
    kicker: "Botanical Fusion",
    price: 6.25,
    kcal: 145,
    image: "/images/matcha-espresso-fusion.jpg",
    badge: "Hot / Iced",
    imageTag: "1st Harvest Uji",
    tags: [
      { label: "Antioxidant", tone: "forest" },
      { label: "Vegan", tone: "neutral" },
    ],
    customizable: true,
  },
  {
    slug: "ethiopian-yirgacheffe-pour-over",
    name: "Ethiopian Yirgacheffe Pour Over",
    category: "coffee",
    kicker: "Origin Pour Over",
    price: 5.25,
    kcal: 5,
    image: "/images/ethiopian-pour-over.jpg",
    badge: "Hand Brew",
    imageTag: "Grade 1 Washed",
    extra: "2,100m",
    tags: [{ label: "Light Roast", tone: "amber" }],
    customizable: true,
  },
  {
    slug: "toasted-hazelnut-mocha",
    name: "Toasted Hazelnut Mocha",
    category: "coffee",
    kicker: "Signature Dessert",
    price: 6.1,
    kcal: 260,
    image: "/images/toasted-hazelnut-mocha.jpg",
    badge: "Hot / Iced",
    imageTag: "House Confection",
    extra: "Nut Allergens",
    tags: [{ label: "Indulgent", tone: "amber" }],
    customizable: true,
  },
  {
    slug: "matcha-ceremonial-glow",
    name: "Matcha Ceremonial Glow",
    category: "tea",
    kicker: "Superfood Elixir",
    price: 8.25,
    kcal: 190,
    image: "/images/matcha-ceremonial-glow.jpg",
    badge: "Organic Uji",
    imageTag: "Lion's Mane",
    tags: [{ label: "Antioxidant", tone: "forest" }],
  },
  {
    slug: "golden-turmeric-mango-smoothie",
    name: "Golden Turmeric Mango Smoothie",
    category: "smoothies",
    kicker: "Wellness Elixir",
    price: 7.25,
    kcal: 240,
    image: "/images/golden-turmeric-mango.jpg",
    badge: "Cold-Pressed",
    imageTag: "Adaptogenic",
    tags: [{ label: "Plant Based", tone: "forest" }],
  },
  {
    slug: "acai-blueberry-protein-blast",
    name: "Açaí Blueberry Protein Blast",
    category: "smoothies",
    kicker: "Power Blend",
    price: 7.95,
    kcal: 310,
    image: "/images/acai-protein-blast.jpg",
    badge: "High Protein",
    imageTag: "22g Clean Protein",
    tags: [{ label: "High Protein", tone: "amber" }],
  },
  {
    slug: "pitaya-cold-pressed-botanical",
    name: "Pitaya Cold-Pressed Botanical",
    category: "smoothies",
    kicker: "Vitality Tonic",
    price: 7.5,
    kcal: 210,
    image: "/images/pitaya-botanical.jpg",
    badge: "Cold-Pressed",
    imageTag: "Vitamin C",
    tags: [{ label: "Vegan", tone: "forest" }],
  },
  {
    slug: "raw-cacao-maca-recovery",
    name: "Raw Cacao Maca Recovery",
    category: "smoothies",
    kicker: "Energy Elixir",
    price: 8.5,
    kcal: 320,
    image: "/images/raw-cacao-maca.jpg",
    badge: "Organic Cacao",
    imageTag: "Plant Protein",
    tags: [{ label: "Adaptogen", tone: "amber" }],
  },
  {
    slug: "spirulina-cleanse-chlorophyll",
    name: "Spirulina Cleanse & Chlorophyll",
    category: "smoothies",
    kicker: "Green Tonic",
    price: 7.75,
    kcal: 160,
    image: "/images/spirulina-cleanse.jpg",
    badge: "Cold-Pressed",
    imageTag: "Raw Chlorophyll",
    tags: [{ label: "Detox", tone: "forest" }],
  },
  {
    slug: "avocado-jammy-egg-sourdough",
    name: "Avocado & Jammy Egg Sourdough",
    category: "food",
    kicker: "Kitchen Special",
    price: 9.5,
    kcal: 380,
    image: "/images/avocado-sourdough.jpg",
    badge: "Warm Plate",
    imageTag: "Breakfast Tartine",
    tags: [{ label: "Vegetarian", tone: "forest" }],
  },
  {
    slug: "prosciutto-gruyere-croissant",
    name: "Prosciutto Gruyère Warm Croissant",
    category: "food",
    kicker: "Warm Pastry",
    price: 7.8,
    kcal: 440,
    image: "/images/prosciutto-croissant.jpg",
    badge: "Oven Baked",
    imageTag: "Artisanal Hearth",
    tags: [{ label: "Savory", tone: "amber" }],
  },
  {
    slug: "basque-burnt-cheesecake",
    name: "Basque Burnt Cheesecake",
    category: "desserts",
    kicker: "Pastry Lab",
    price: 6.5,
    kcal: 420,
    image: "/images/basque-cheesecake.jpg",
    badge: "House Signature",
    imageTag: "Gluten-Free",
    tags: [{ label: "Signature", tone: "amber" }],
  },
  {
    slug: "espresso-tiramisu-jar",
    name: "Espresso Tiramisu Jar",
    category: "desserts",
    kicker: "House Confection",
    price: 6.0,
    kcal: 350,
    image: "/images/tiramisu-jar.jpg",
    badge: "Contains Espresso",
    imageTag: "Individual Jar",
    tags: [{ label: "Artisanal", tone: "amber" }],
  },
]

export const pairings = [
  {
    slug: "cardamom-morning-bun",
    name: "Cardamom Morning Bun",
    description: "Laminated dough with spiced Swedish cardamom butter.",
    price: 4.5,
    image: "/images/cardamom-bun.jpg",
    cta: "Add Pairing",
  },
  {
    slug: "cooperativa-santa-teresa-12oz",
    name: "Cooperativa Santa Teresa (12oz)",
    description: "The exact roasted beans used for this signature craft latte.",
    price: 21.0,
    image: "/images/colombia-bean-bag.jpg",
    cta: "Add Whole Bean Bag",
  },
  {
    slug: "wild-honey-almond-biscotti",
    name: "Wild Honey Almond Biscotti",
    description: "Double baked with roasted local almonds and honey crunch.",
    price: 3.25,
    image: "/images/almond-biscotti.jpg",
    cta: "Add Pairing",
  },
]

export const locations = [
  {
    name: "Downtown Flagship",
    address: "742 Pine Hill Court, Suite 100",
    hours: "Mon – Sun • 6:30 AM – 7:00 PM",
  },
  {
    name: "Timberyard Workshop",
    address: "1208 Craft Lane, Dockside",
    hours: "Tue – Sun • 7:00 AM – 5:00 PM",
  },
]

export const customer = {
  name: "Elena Rostova",
  phone: "(555) 234-8901",
  tier: "Gold Member",
  stars: 178,
  starsGoal: 200,
  avatar: "/images/customer-portrait.png",
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function formatPrice(value: number) {
  const sign = value < 0 ? "-" : ""
  return `${sign}$${Math.abs(value).toFixed(2)}`
}
