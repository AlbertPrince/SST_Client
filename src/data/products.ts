export type ProductSize = {
  label: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  unitLabel: string;
  image: string;
  sizes?: ProductSize[];
  shortDescription: string;
  fullDescription: string;
  culturalOrigin: string;
  healthBenefits: string[];
  ingredients: string[];
  isAvailable: boolean;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Zomkom',
    slug: 'zomkom',
    category: 'drink',
    price: 12.00,
    unitLabel: '8oz bottle',
    image: '/sst zomkom updtd.png',
    shortDescription: 'Spicy millet smoothie infused with ginger, cloves, and a touch of organic honey.',
    fullDescription: 'Historically enjoyed by nomadic groups in Northern Ghana, Zomkom was a vital source of energy. Our version stays true to the traditional millet base but elevates it with organic ginger from the Volta region.',
    culturalOrigin: 'Originating from the Northern regions of Ghana, Zomkom is a drink of hospitality, traditionally offered to welcome guests into a home.',
    healthBenefits: ['Good source of energy', 'Aids digestion', 'Dairy-free'],
    ingredients: ['Millet', 'Water', 'Ginger', 'Cloves', 'Black Pepper', 'Honey'],
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Sobolo',
    slug: 'sobolo',
    category: 'drink',
    price: 10.00,
    unitLabel: '12oz bottle',
    image: '/SSt Sobolo updt.png',
    shortDescription: 'Hibiscus tea brewed with local spices, pineapple skins, and African birds-eye chili.',
    fullDescription: 'A deeply refreshing, ruby-red beverage made from dried roselle (hibiscus) leaves, steeped with fresh ginger, pineapple peels, and aromatic spices. Perfectly balanced between tart and sweet.',
    culturalOrigin: 'A staple across West Africa, known as Bissap in Senegal and Zobo in Nigeria. In Ghana, it is a beloved street drink often served ice cold at gatherings.',
    healthBenefits: ['Rich in antioxidants', 'May help lower blood pressure', 'High in Vitamin C'],
    ingredients: ['Hibiscus leaves', 'Fresh ginger', 'Pineapple skins', 'Cloves', 'African birds-eye chili'],
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Hausa Beer',
    slug: 'hausa-beer',
    category: 'drink',
    price: 14.00,
    unitLabel: '10oz bottle',
    image: '/sst hausa beer updtd2.png',
    shortDescription: 'Rich, non-alcoholic fermented sorghum nectar with deep caramel and toasted grain notes.',
    fullDescription: 'A chilled, refreshing take on the traditional Hausa Koko. It retains the signature spicy kick of ginger and peppercorn but is served as a cooling beverage.',
    culturalOrigin: 'Derived from Hausa Koko, a popular Ghanaian street food breakfast porridge.',
    healthBenefits: ['Warming spices aid circulation', 'Gut-friendly'],
    ingredients: ['Millet', 'Ginger', 'Grains of Selim', 'Black peppercorn', 'Sugar'],
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Original Milk',
    slug: 'abele-walls-original',
    category: 'icecream',
    price: 8.00,
    unitLabel: 'Single Stick',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4m5xt3XWsoif7rWqgchwgSQUCfnqXHn0Rn4wJoQoygwEbwLbP5pDMDBTCPO97rPBhqSr53k7Ja-LOhL5XLLsAztazA2d0TTWzAhXoJP1lpQ-r8nj4wI9ctHB3yryXY2VcNS7QYiYj2R4qCCZDAODuGaAFs5439xGeYY5AwGu95G5rZTr95s16PCVpep57sBlZyubZts1heAioxWrNTMO1ORHoldHkRg2z2CICAcQrU73TrP16JETWpm8XWhVWRfbCsxypEvCFNpc',
    shortDescription: 'The classic street favorite. Pure, condensed milk frozen to perfection with a touch of nutmeg.',
    fullDescription: 'Nostalgic Ghanaian street ice cream, creamy and rich without artificial preservatives. This classic flavor is a sweet, pure treat.',
    culturalOrigin: 'A beloved childhood treat sold by street vendors pushing colorful carts across neighborhoods in Ghana.',
    healthBenefits: ['Calcium rich', 'Mood booster'],
    ingredients: ['Condensed milk', 'Full cream milk', 'Nutmeg', 'Vanilla extract'],
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Toasted Coconut',
    slug: 'abele-walls-coconut',
    category: 'icecream',
    price: 9.00,
    unitLabel: 'Single Stick',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXwp9uWkD5sfLSU-loAZ3iwp3pmycHACJgOYpZ0kWnoJNOWVH2ScIS3yJ9aVU1lc9XKGptt_7SbSV9itP16zuXTOMlGlIuuxnAfdeJM2Wie8GKtFGXs_paJl1OpZZLDhCyqlN9IbEAf0_WjvwOloItS5TAcFB5KjroolU806B7PuiQjyjNqniBatvO0ShkijiHAmlFAbOWDx0tcSa7RInc3WEm52FWFALLiOnWaU9CypIFlyoEKgYhoTrWK4nyFrjj5zPDSgIdmU0',
    shortDescription: 'Creamy coconut milk base blended with fresh shavings of Ghanian dry coconut.',
    fullDescription: 'A deeply satisfying coconut ice cream that celebrates the rich coconuts of West Africa, perfectly blended for maximum tropical flavor.',
    culturalOrigin: 'Inspired by the abundance of fresh coastal coconuts in Ghana.',
    healthBenefits: ['Healthy fats', 'Dairy-free option'],
    ingredients: ['Coconut milk', 'Coconut flakes', 'Cane sugar'],
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Velvet Custard',
    slug: 'abele-walls-custard',
    category: 'icecream',
    price: 9.50,
    unitLabel: 'Single Stick',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTFVeYdgRXScHq4KoRZUQNYhZ_i9xp3VleshOAaY8xBHZN6lJZpCTdftqSfg3sI-0HzHyqY3tBhwn9ssxUXyaYKRU7uL1Pr90e2ijVopbwzG_g-tzKaoJTNJ2qLul7h08sPiiOBRACKqhYqU4VEPXHMAZ09PV0YGxoG9JGvF_4iElEvHPT0rAmjI7QgFIfQI6lyI66L8Z_qk7q7ZUjjIvI1jc5iL4Uu4M9oGzVxOzZNuDLlnVQL-dehWIxzSeANRwOTI1AhkYiBQo',
    shortDescription: 'A nostalgic nod to Sunday treats. Silky egg-custard base with a hint of warm cinnamon.',
    fullDescription: 'A creamy custard treat combining rich egg flavor with warm spices for the ultimate comfort food experience.',
    culturalOrigin: 'A luxurious variation on the standard street treat.',
    healthBenefits: ['Protein from eggs'],
    ingredients: ['Egg yolks', 'Milk', 'Cream', 'Cinnamon', 'Sugar'],
    isAvailable: true,
  }
];
