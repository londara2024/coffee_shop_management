export type CategoryId = "coffee" | "tea" | "food" | "desserts"

export type Tone = "forest" | "amber" | "neutral"

export type Product = {
  slug: string
  name: string
  nameKm?: string
  category: CategoryId
  kicker: string
  kickerKm?: string
  price: number
  sizePrices?: [number, number, number]
  toppings?: { id: string; label: string; labelKm?: string; delta: number; locked?: boolean }[]
  image: string
  badge: string
  imageTag?: string
  tags: { label: string; labelKm?: string; tone: Tone }[]
  extra?: string
  customizable?: boolean
  description?: string
  descriptionKm?: string
}

export type Category = {
  id: CategoryId
  label: string
  labelKm?: string
  count: number
  eyebrow: string
  eyebrowKm?: string
  title: string
  titleKm?: string
  note?: string
  noteKm?: string
}

export const categories: Category[] = [
  {
    id: "coffee",
    label: "Coffee",
    labelKm: "កាហ្វេ",
    count: 14,
    eyebrow: "Single Origin & Specialty Espresso",
    eyebrowKm: "",
    title: "Coffee & Extraction Lab",
    titleKm: "កាហ្វេ",
  },
  {
    id: "tea",
    label: "Tea & Beverages",
    labelKm: "តែ និងភេសជ្ជៈ",
    count: 14,
    eyebrow: "Ceremonial Leaf & Cold-Pressed Blends",
    eyebrowKm: "",
    title: "Tea & Beverages",
    titleKm: "តែ និងភេសជ្ជៈ",
  },
  {
    id: "food",
    label: "Food",
    labelKm: "អាហារ",
    count: 10,
    eyebrow: "Kitchen & Hearth",
    eyebrowKm: "",
    title: "Artisanal Food & Warm Plates",
    titleKm: "អាហារ",
    note: "Served until 3:00 PM daily",
    noteKm: "បម្រើរហូតដល់ម៉ោង ៣ រសៀល រាល់ថ្ងៃ",
  },
  {
    id: "desserts",
    label: "Desserts",
    labelKm: "បង្អែម",
    count: 5,
    eyebrow: "Pastry Laboratory",
    eyebrowKm: "",
    title: "Handcrafted Desserts & Sweets",
    titleKm: "បង្អែម",
    note: "Baked in small daily batches",
    noteKm: "ដុតនំជាបាច់តូចៗរាល់ថ្ងៃ",
  },
]

export const filters = [
  "All Creations",
  "Seasonal Favorites",
  "Iced & Cold Brew",
  "Single Origin Micro-lots",
  "Dairy-Free Natural",
]

/** Khmer labels for `filters`, keyed by the English label (which stays the internal identity/state value). */
export const filterLabelsKm: Record<string, string> = {
  "All Creations": "គ្រប់ម្ហូបទាំងអស់",
  "Seasonal Favorites": "ពេញនិយមតាមរដូវ",
  "Iced & Cold Brew": "ភេសជ្ជៈទឹកកក និងកាហ្វេស្រង់ត្រជាក់",
  "Single Origin Micro-lots": "កាហ្វេដើមកំណើតតែមួយ ចំនួនកំណត់",
  "Dairy-Free Natural": "គ្មានទឹកដោះគោ ធម្មជាតិ",
}

export const products: Product[] = [
  {
    slug: "honey-cinnamon-oat-latte",
    name: "Honey Cinnamon Oat Latte",
    nameKm: "ឡាតេទឹកឃ្មុំ ស៊ីណាមុន និងទឹកដោះអូ៊ត",
    category: "coffee",
    kicker: "House Signature",
    kickerKm: "ម្ហូបពិសេសរបស់ហាង",
    price: 6.25,
    image: "/images/honey-cinnamon-oat-latte.jpg",
    badge: "ត្រជាក់/ក្ដៅ",
    imageTag: "Barista Pick",
    tags: [{ label: "Velvety & Warm", labelKm: "ម៉ដ្តម៉ៃ និងកក្តៅ", tone: "amber" }],
    customizable: true,
    description:
      "Rich organic espresso blended with velvety steamed oat milk, pure wildflower honey, and fresh-cracked Sri Lankan Ceylon cinnamon bark.",
    descriptionKm:
      "អេស្ប្រេសូសរីរាង្គខាប់ ចម្រុះជាមួយទឹកដោះអូ៊តចំហុយម៉ដ្តម៉ៃ ទឹកឃ្មុំផ្កាព្រៃសុទ្ធ និងសំបកឈើស៊ីណាមុនស៊ីឡូនស្រីលង្កាដាំថ្មីៗ។",
  },
  {
    slug: "brown-sugar-oat-shaken-espresso",
    name: "Brown Sugar Oat Shaken Espresso",
    nameKm: "អេស្ប្រេសូគ្រើបស្ករត្នោត និងទឹកដោះអូ៊ត",
    category: "coffee",
    kicker: "Seasonal Brew",
    kickerKm: "កាហ្វេតាមរដូវ",
    price: 6.5,
    image: "/images/brown-sugar-shaken-espresso.jpg",
    badge: "ត្រជាក់/ក្ដៅ",
    imageTag: "V · GF",
    tags: [{ label: "Vegan", labelKm: "អាហារវែហ្គិន", tone: "forest" }],
  },
  {
    slug: "cardamom-pistachio-cortado",
    name: "Cardamom Pistachio Cortado",
    nameKm: "កូតាដូក្រវាញ់ និងភីស្តាស្យូ",
    category: "coffee",
    kicker: "Aromatic Reserve",
    kickerKm: "កាហ្វេក្រអូបពិសេស",
    price: 5.85,
    image: "/images/cardamom-pistachio-cortado.jpg",
    badge: "ក្ដៅ",
    imageTag: "Spiced Nut",
    tags: [{ label: "Signature", labelKm: "ពិសេសរបស់ហាង", tone: "amber" }],
  },
  {
    slug: "bourbon-barrel-cold-brew",
    name: "Bourbon Barrel Cold Brew",
    nameKm: "កាហ្វេស្រង់ត្រជាក់ ធុងឈើបួរបុន",
    category: "coffee",
    kicker: "Aged Cask",
    kickerKm: "ជ្រលក់ក្នុងធុងឈើចាស់",
    price: 6.75,
    image: "/images/bourbon-barrel-cold-brew.jpg",
    badge: "ត្រជាក់",
    imageTag: "20h Barrel Steep",
    tags: [{ label: "Oak & Vanilla", labelKm: "ឈើអូក និងវ៉ានីឡា", tone: "amber" }],
  },
  {
    slug: "velvet-flat-white",
    name: "Velvet Flat White",
    nameKm: "ហ្វ្លាតវ៉ែតម៉ដ្តម៉ៃ",
    category: "coffee",
    kicker: "Traditional Classics",
    kickerKm: "រូបមន្តបុរាណ",
    price: 4.95,
    image: "/images/velvet-flat-white.jpg",
    badge: "ក្ដៅ",
    imageTag: "Double Ristretto",
    extra: "6 oz",
    tags: [{ label: "Intense & Smooth", labelKm: "ខាប់ និងរលោង", tone: "amber" }],
    customizable: true,
  },
  {
    slug: "ceremonial-matcha-espresso-fusion",
    name: "Ceremonial Matcha Espresso Fusion",
    nameKm: "ម៉ាចាពិធីការ លាយអេស្ប្រេសូ",
    category: "coffee",
    kicker: "Botanical Fusion",
    kickerKm: "លាយបញ្ចូលរុក្ខជាតិ",
    price: 6.25,
    image: "/images/matcha-espresso-fusion.jpg",
    badge: "ត្រជាក់/ក្ដៅ",
    imageTag: "1st Harvest Uji",
    tags: [
      { label: "Antioxidant", labelKm: "ប្រឆាំងអុកស៊ីតកម្ម", tone: "forest" },
      { label: "Vegan", labelKm: "អាហារវែហ្គិន", tone: "neutral" },
    ],
    customizable: true,
  },
  {
    slug: "ethiopian-yirgacheffe-pour-over",
    name: "Ethiopian Yirgacheffe Pour Over",
    nameKm: "កាហ្វេចាក់ដៃ អេត្យូពី យ៉ែហ្គាឆេហ្វេ",
    category: "coffee",
    kicker: "Origin Pour Over",
    kickerKm: "កាហ្វេចាក់ដៃដើមកំណើត",
    price: 5.25,
    image: "/images/ethiopian-pour-over.jpg",
    badge: "ក្ដៅ",
    imageTag: "Grade 1 Washed",
    extra: "2,100m",
    tags: [{ label: "Light Roast", labelKm: "ដុតស្រាល", tone: "amber" }],
    customizable: true,
  },
  {
    slug: "toasted-hazelnut-mocha",
    name: "Toasted Hazelnut Mocha",
    nameKm: "ម៉ូខា គ្រាប់ហាហ្សែលនាត់ដុតក្រហម",
    category: "coffee",
    kicker: "Signature Dessert",
    kickerKm: "បង្អែមពិសេសរបស់ហាង",
    price: 6.1,
    image: "/images/toasted-hazelnut-mocha.jpg",
    badge: "ត្រជាក់/ក្ដៅ",
    imageTag: "House Confection",
    extra: "Nut Allergens",
    tags: [{ label: "Indulgent", labelKm: "ស្កប់ស្កល់", tone: "amber" }],
    customizable: true,
  },
  {
    slug: "matcha-ceremonial-glow",
    name: "Matcha Ceremonial Glow",
    nameKm: "ម៉ាចាពិធីការ ភ្លឺរស់",
    category: "tea",
    kicker: "Superfood Elixir",
    kickerKm: "ភេសជ្ជៈអាហារឧត្តម",
    price: 8.25,
    image: "/images/matcha-ceremonial-glow.jpg",
    badge: "ត្រជាក់/ក្ដៅ",
    imageTag: "Lion's Mane",
    tags: [{ label: "Antioxidant", labelKm: "ប្រឆាំងអុកស៊ីតកម្ម", tone: "forest" }],
  },
  {
    slug: "golden-turmeric-mango-smoothie",
    name: "Golden Turmeric Mango Smoothie",
    nameKm: "ស្មូធីស្វាយ ខ្ញីលឿង",
    category: "tea",
    kicker: "Wellness Elixir",
    kickerKm: "ភេសជ្ជៈសុខភាព",
    price: 7.25,
    image: "/images/golden-turmeric-mango.jpg",
    badge: "ត្រជាក់",
    imageTag: "Adaptogenic",
    tags: [{ label: "Plant Based", labelKm: "ផលិតផលពីរុក្ខជាតិ", tone: "forest" }],
  },
  {
    slug: "acai-blueberry-protein-blast",
    name: "Açaí Blueberry Protein Blast",
    nameKm: "អាសៃ ប៊្លូបឺរី ប្រូតេអ៊ីនពេញកម្លាំង",
    category: "tea",
    kicker: "Power Blend",
    kickerKm: "លាយថាមពល",
    price: 7.95,
    image: "/images/acai-protein-blast.jpg",
    badge: "ត្រជាក់",
    imageTag: "22g Clean Protein",
    tags: [{ label: "High Protein", labelKm: "ប្រូតេអ៊ីនខ្ពស់", tone: "amber" }],
  },
  {
    slug: "pitaya-cold-pressed-botanical",
    name: "Pitaya Cold-Pressed Botanical",
    nameKm: "ស្រកានាគ សង្កត់ត្រជាក់ រុក្ខជាតិ",
    category: "tea",
    kicker: "Vitality Tonic",
    kickerKm: "ភេសជ្ជៈបំប៉នកម្លាំង",
    price: 7.5,
    image: "/images/pitaya-botanical.jpg",
    badge: "ត្រជាក់",
    imageTag: "Vitamin C",
    tags: [{ label: "Vegan", labelKm: "អាហារវែហ្គិន", tone: "forest" }],
  },
  {
    slug: "raw-cacao-maca-recovery",
    name: "Raw Cacao Maca Recovery",
    nameKm: "កាកាវឆៅ និងម៉ាកា ស្តារកម្លាំង",
    category: "tea",
    kicker: "Energy Elixir",
    kickerKm: "ភេសជ្ជៈថាមពល",
    price: 8.5,
    image: "/images/raw-cacao-maca.jpg",
    badge: "ត្រជាក់",
    imageTag: "Plant Protein",
    tags: [{ label: "Adaptogen", labelKm: "សារធាតុសម្របខ្លួន", tone: "amber" }],
  },
  {
    slug: "spirulina-cleanse-chlorophyll",
    name: "Spirulina Cleanse & Chlorophyll",
    nameKm: "ស្ព្យារូលីណា សម្អាតរាងកាយ និងក្លរ៉ូហ្វីល",
    category: "tea",
    kicker: "Green Tonic",
    kickerKm: "ភេសជ្ជៈបៃតង",
    price: 7.75,
    image: "/images/spirulina-cleanse.jpg",
    badge: "ត្រជាក់",
    imageTag: "Raw Chlorophyll",
    tags: [{ label: "Detox", labelKm: "សម្អាតជាតិពុល", tone: "forest" }],
  },
  {
    slug: "avocado-jammy-egg-sourdough",
    name: "Avocado & Jammy Egg Sourdough",
    nameKm: "នំបុ័ងស៊ូដោ អាវ៉ូកាដូ និងស៊ុតលឿងទន់",
    category: "food",
    kicker: "Kitchen Special",
    kickerKm: "ម្ហូបពិសេសផ្ទះបាយ",
    price: 9.5,
    image: "/images/avocado-sourdough.jpg",
    badge: "ក្ដៅ",
    imageTag: "Breakfast Tartine",
    tags: [{ label: "Vegetarian", labelKm: "អាហារបួស", tone: "forest" }],
  },
  {
    slug: "prosciutto-gruyere-croissant",
    name: "Prosciutto Gruyère Warm Croissant",
    nameKm: "ក្រូវ៉ាសង់ក្តៅ ប្រូស្យូតូ និងឈីសហ្គ្រុយអែរ",
    category: "food",
    kicker: "Warm Pastry",
    kickerKm: "នំក្តៅស្រស់",
    price: 7.8,
    image: "/images/prosciutto-croissant.jpg",
    badge: "ក្ដៅ",
    imageTag: "Artisanal Hearth",
    tags: [{ label: "Savory", labelKm: "រសជាតិប្រៃ", tone: "amber" }],
  },
  {
    slug: "basque-burnt-cheesecake",
    name: "Basque Burnt Cheesecake",
    nameKm: "ឈីសខេកបាស្គ ដុតក្រៀម",
    category: "desserts",
    kicker: "Pastry Lab",
    kickerKm: "មន្ទីរពិសោធន៍នំបុ័ង",
    price: 6.5,
    image: "/images/basque-cheesecake.jpg",
    badge: "ត្រជាក់",
    imageTag: "Gluten-Free",
    tags: [{ label: "Signature", labelKm: "ពិសេសរបស់ហាង", tone: "amber" }],
  },
  {
    slug: "espresso-tiramisu-jar",
    name: "Espresso Tiramisu Jar",
    nameKm: "ធីរ៉ាមីស៊ូអេស្ប្រេសូ ក្នុងកែវ",
    category: "desserts",
    kicker: "House Confection",
    kickerKm: "នំផ្អែមធ្វើដោយហាង",
    price: 6.0,
    image: "/images/tiramisu-jar.jpg",
    badge: "ត្រជាក់",
    imageTag: "Individual Jar",
    tags: [{ label: "Artisanal", labelKm: "សិប្បកម្ម", tone: "amber" }],
  },
]

export type Pairing = {
  slug: string
  name: string
  nameKm?: string
  description: string
  descriptionKm?: string
  price: number
  image: string
  cta: string
  ctaKm?: string
}

export const pairings: Pairing[] = [
  {
    slug: "cardamom-morning-bun",
    name: "Cardamom Morning Bun",
    nameKm: "នំបុ័ងព្រឹក ក្រវាញ់",
    description: "Laminated dough with spiced Swedish cardamom butter.",
    descriptionKm: "ម្សៅជាន់ជាស្រទាប់ ជាមួយប៊ឺក្រវាញ់ម៉ូតស៊ុយអែត។",
    price: 4.5,
    image: "/images/cardamom-bun.jpg",
    cta: "Add Pairing",
    ctaKm: "បន្ថែមម្ហូបផ្គូផ្គង",
  },
  {
    slug: "cooperativa-santa-teresa-12oz",
    name: "Cooperativa Santa Teresa (12oz)",
    nameKm: "កូអូភើរ៉ាទីវ៉ា សាន់តាតេរេសា (១២ អោន់)",
    description: "The exact roasted beans used for this signature craft latte.",
    descriptionKm: "គ្រាប់កាហ្វេដុតដូចគ្នាបេះបិទ ដែលប្រើសម្រាប់ធ្វើឡាតេពិសេសនេះ។",
    price: 21.0,
    image: "/images/colombia-bean-bag.jpg",
    cta: "Add Whole Bean Bag",
    ctaKm: "បន្ថែមថង់គ្រាប់កាហ្វេទាំងមូល",
  },
  {
    slug: "wild-honey-almond-biscotti",
    name: "Wild Honey Almond Biscotti",
    nameKm: "ប៊ីស្កូទីអាម៉ុង ទឹកឃ្មុំព្រៃ",
    description: "Double baked with roasted local almonds and honey crunch.",
    descriptionKm: "ដុតពីរដង ជាមួយអាម៉ុងក្នុងស្រុកអាំង និងទឹកឃ្មុំក្រែម។",
    price: 3.25,
    image: "/images/almond-biscotti.jpg",
    cta: "Add Pairing",
    ctaKm: "បន្ថែមម្ហូបផ្គូផ្គង",
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

const USD_TO_RIEL = 4100

export function formatRiel(value: number) {
  const sign = value < 0 ? "-" : ""
  const riel = Math.round(Math.abs(value) * USD_TO_RIEL)
  return `${sign}៛${riel.toLocaleString("en-US")}`
}
