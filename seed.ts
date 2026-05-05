import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials. Cannot seed.");
  process.exit(1);
}

const supabase = createClient(url, key);

const seedData = [
  {
    name: "Zomkom",
    category: "drink",
    price: 12.00,
    unit_label: "8oz bottle",
    short_description: "Smooth, nourishing millet drink with a gentle ginger spice",
    image_url: "/sst zomkom updtd.png",
    full_description: "Historically enjoyed by nomadic groups in Northern Ghana, Zomkom was a vital source of energy. Our version stays true to the traditional millet base but elevates it with organic ginger from the Volta region.",
    cultural_origin: "Originating from the Northern regions of Ghana, Zomkom is a drink of hospitality, traditionally offered to welcome guests into a home.",
    health_benefits: ['Good source of energy', 'Aids digestion', 'Dairy-free'],
    ingredients: ['Millet', 'Water', 'Ginger', 'Cloves', 'Black Pepper', 'Honey'],
    is_available: true
  },
  {
    name: "Hausa Beer",
    category: "drink",
    price: 12.00,
    unit_label: "8oz bottle",
    short_description: "Lightly sweet, comforting rice drink with a refreshing ginger kick",
    image_url: "/sst hausa beer updtd2.png",
    full_description: "A chilled, refreshing take on the traditional Hausa Koko. It retains the signature spicy kick of ginger and peppercorn but is served as a cooling beverage.",
    cultural_origin: "Derived from Hausa Koko, a popular Ghanaian street food breakfast porridge.",
    health_benefits: ['Warming spices aid circulation', 'Gut-friendly'],
    ingredients: ['Millet', 'Ginger', 'Grains of Selim', 'Black peppercorn', 'Sugar'],
    is_available: true
  },
  {
    name: "Samia",
    category: "drink",
    price: 12.00,
    unit_label: "8oz bottle",
    short_description: "Tangy tamarind blended with a touch of ginger",
    image_url: "/SSt Samia updt.png",
    full_description: "A tangy and sweet tamarind-based beverage that boasts an incredible depth of flavor and refreshing qualities.",
    cultural_origin: "Enjoyed throughout West Africa for its cooling properties in the hot climate.",
    health_benefits: ['Rich in antioxidants', 'Cooling effect'],
    ingredients: ['Tamarind', 'Water', 'Ginger', 'Sugar'],
    is_available: true
  },
  {
    name: "Sobolo",
    category: "drink",
    price: 12.00,
    unit_label: "8oz bottle",
    short_description: "Bold hibiscus drink with warm spices and a sweet-tangy finish",
    image_url: "/SSt Sobolo updt.png",
    full_description: "A deeply refreshing, ruby-red beverage made from dried roselle (hibiscus) leaves, steeped with fresh ginger, pineapple peels, and aromatic spices. Perfectly balanced between tart and sweet.",
    cultural_origin: "A staple across West Africa, known as Bissap in Senegal and Zobo in Nigeria. In Ghana, it is a beloved street drink often served ice cold at gatherings.",
    health_benefits: ['Rich in antioxidants', 'May help lower blood pressure', 'High in Vitamin C'],
    ingredients: ['Hibiscus leaves', 'Fresh ginger', 'Pineapple skins', 'Cloves', 'African birds-eye chili'],
    is_available: true
  },
  {
    name: "Abele Walls — Original",
    category: "icecream",
    price: 4.00,
    unit_label: "scoop",
    short_description: "Classic Ghanaian ice cream, smooth and creamy",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4m5xt3XWsoif7rWqgchwgSQUCfnqXHn0Rn4wJoQoygwEbwLbP5pDMDBTCPO97rPBhqSr53k7Ja-LOhL5XLLsAztazA2d0TTWzAhXoJP1lpQ-r8nj4wI9ctHB3yryXY2VcNS7QYiYj2R4qCCZDAODuGaAFs5439xGeYY5AwGu95G5rZTr95s16PCVpep57sBlZyubZts1heAioxWrNTMO1ORHoldHkRg2z2CICAcQrU73TrP16JETWpm8XWhVWRfbCsxypEvCFNpc",
    full_description: "Nostalgic Ghanaian street ice cream, creamy and rich without artificial preservatives. This classic flavor is a sweet, pure treat.",
    cultural_origin: "A beloved childhood treat sold by street vendors pushing colorful carts across neighborhoods in Ghana.",
    health_benefits: ['Calcium rich', 'Mood booster'],
    ingredients: ['Condensed milk', 'Full cream milk', 'Nutmeg', 'Vanilla extract'],
    is_available: true
  },
  {
    name: "Abele Walls — Chocolate",
    category: "icecream",
    price: 4.00,
    unit_label: "scoop",
    short_description: "Rich chocolate Ghanaian ice cream",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4m5xt3XWsoif7rWqgchwgSQUCfnqXHn0Rn4wJoQoygwEbwLbP5pDMDBTCPO97rPBhqSr53k7Ja-LOhL5XLLsAztazA2d0TTWzAhXoJP1lpQ-r8nj4wI9ctHB3yryXY2VcNS7QYiYj2R4qCCZDAODuGaAFs5439xGeYY5AwGu95G5rZTr95s16PCVpep57sBlZyubZts1heAioxWrNTMO1ORHoldHkRg2z2CICAcQrU73TrP16JETWpm8XWhVWRfbCsxypEvCFNpc",
    full_description: "Our signature original mix folded meticulously with rich cocoa for a deep chocolatey flavor.",
    cultural_origin: "A beloved childhood treat sold by street vendors.",
    health_benefits: ['Calcium rich'],
    ingredients: ['Condensed milk', 'Full cream milk', 'Cocoa Powder', 'Vanilla extract'],
    is_available: true
  },
  {
    name: "Abele Walls — Coconut",
    category: "icecream",
    price: 4.00,
    unit_label: "scoop",
    short_description: "Creamy coconut Ghanaian ice cream",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXwp9uWkD5sfLSU-loAZ3iwp3pmycHACJgOYpZ0kWnoJNOWVH2ScIS3yJ9aVU1lc9XKGptt_7SbSV9itP16zuXTOMlGlIuuxnAfdeJM2Wie8GKtFGXs_paJl1OpZZLDhCyqlN9IbEAf0_WjvwOloItS5TAcFB5KjroolU806B7PuiQjyjNqniBatvO0ShkijiHAmlFAbOWDx0tcSa7RInc3WEm52FWFALLiOnWaU9CypIFlyoEKgYhoTrWK4nyFrjj5zPDSgIdmU0",
    full_description: "A deeply satisfying coconut ice cream that celebrates the rich coconuts of West Africa, perfectly blended for maximum tropical flavor.",
    cultural_origin: "Inspired by the abundance of fresh coastal coconuts in Ghana.",
    health_benefits: ['Healthy fats', 'Dairy-free option'],
    ingredients: ['Coconut milk', 'Coconut flakes', 'Cane sugar'],
    is_available: true
  },
  {
    name: "Abele Walls — Custard",
    category: "icecream",
    price: 5.50,
    unit_label: "scoop",
    short_description: "Special custard flavour Ghanaian ice cream",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTFVeYdgRXScHq4KoRZUQNYhZ_i9xp3VleshOAaY8xBHZN6lJZpCTdftqSfg3sI-0HzHyqY3tBhwn9ssxUXyaYKRU7uL1Pr90e2ijVopbwzG_g-tzKaoJTNJ2qLul7h08sPiiOBRACKqhYqU4VEPXHMAZ09PV0YGxoG9JGvF_4iElEvHPT0rAmjI7QgFIfQI6lyI66L8Z_qk7q7ZUjjIvI1jc5iL4Uu4M9oGzVxOzZNuDLlnVQL-dehWIxzSeANRwOTI1AhkYiBQo",
    full_description: "A creamy custard treat combining rich egg flavor with warm spices for the ultimate comfort food experience.",
    cultural_origin: "A luxurious variation on the standard street treat.",
    health_benefits: ['Protein from eggs'],
    ingredients: ['Egg yolks', 'Milk', 'Cream', 'Cinnamon', 'Sugar'],
    is_available: true
  }
];

async function seed() {
  console.log("Seeding products...");
  
  // Optional: clear existing first to avoid duplicates, or just insert
  // We'll just upsert by name to be safe if there was a constraint, but let's just insert
  // or maybe better: delete all existing first.
  const { error: delError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all
  
  if (delError) {
    console.error("Error clearing old products:", delError.message);
  }

  const { data, error } = await supabase.from('products').insert(seedData).select();
  if (error) {
    console.error("Error seeding products:", error.message);
    process.exit(1);
  }
  
  console.log("Successfully seeded", data?.length, "products!");
}

seed();
