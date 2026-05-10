export type MenuItem = {
  name: string;
  description: string;
  price: string;
  popular?: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "grills",
    title: "Grills & Mains",
    items: [
      { name: "Chicken Grilled with Peri-Peri", description: "Half chicken marinated in fiery peri-peri, flame grilled.", price: "৳620", popular: true },
      { name: "Grilled Chicken with Lemon", description: "Tender chicken with herb-lemon butter and roasted veg.", price: "৳580", popular: true },
      { name: "Jamaican Jerk Chicken", description: "Smoky island spices, slow-cooked over open flame.", price: "৳650" },
      { name: "Rice with Grilled Chicken", description: "Fragrant rice, grilled chicken, gravy and salad.", price: "৳420", popular: true },
      { name: "Mushroom Rice", description: "Buttery rice tossed with sautéed mushrooms.", price: "৳380" },
    ],
  },
  {
    id: "pizza",
    title: "Wood-Fired Pizza",
    items: [
      { name: "BBQ Pizza", description: "Smoky BBQ chicken, onion, cheese pull on a thin crust.", price: "৳780", popular: true },
      { name: "Margherita Classica", description: "San Marzano tomato, fresh mozzarella, basil.", price: "৳640" },
      { name: "Zero Special", description: "Pepperoni, jalapeño, olives, double cheese.", price: "৳890" },
    ],
  },
  {
    id: "starters",
    title: "Starters & Sides",
    items: [
      { name: "Buffalo Wings", description: "Crispy wings tossed in our house buffalo sauce.", price: "৳420", popular: true },
      { name: "Zero Special Cashew Nut Salad", description: "Greens, roasted cashews, citrus dressing.", price: "৳360" },
      { name: "Mushrooms & Vegetables", description: "Garlic-butter mushrooms with seasonal veg.", price: "৳320" },
      { name: "French Fries", description: "Golden, crisp, with house seasoning.", price: "৳180" },
    ],
  },
  {
    id: "drinks",
    title: "Drinks & Desserts",
    items: [
      { name: "Cafe Mocha", description: "Espresso, steamed milk, dark chocolate.", price: "৳240", popular: true },
      { name: "Lemonade", description: "Hand-pressed lemon, mint, sparkling.", price: "৳180", popular: true },
      { name: "Latte", description: "Smooth espresso layered with velvety milk.", price: "৳220" },
      { name: "Lava Cake", description: "Warm chocolate cake with a molten centre.", price: "৳280", popular: true },
    ],
  },
];
