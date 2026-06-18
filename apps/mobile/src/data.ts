import type { TableStatus } from "@restaurant/shared";
export type Table = { id: string; name: string; seats: number; status: TableStatus; items?: number };
export const tables: Table[] = [
  { id: "1", name: "T01", seats: 2, status: "available" }, { id: "2", name: "T02", seats: 4, status: "pending", items: 3 },
  { id: "3", name: "T03", seats: 4, status: "preparing", items: 5 }, { id: "4", name: "T04", seats: 6, status: "added_later", items: 2 },
  { id: "5", name: "T05", seats: 2, status: "available" }, { id: "6", name: "T06", seats: 8, status: "completed", items: 4 },
  { id: "7", name: "Patio 1", seats: 4, status: "available" }, { id: "8", name: "Patio 2", seats: 4, status: "available" },
];
export const menu = [
  { id: "m1", name: "Smoky Paneer Bowl", category: "Mains", price: 349, emoji: "🥘", description: "Charred paneer, herbed rice, pickled onion" },
  { id: "m2", name: "Crispy Chilli Corn", category: "Starters", price: 229, emoji: "🌽", description: "Sweet chilli glaze, scallion, sesame" },
  { id: "m3", name: "Butter Chicken", category: "Mains", price: 399, emoji: "🍛", description: "Charred chicken, tomato cream, fenugreek" },
  { id: "m4", name: "Truffle Fries", category: "Starters", price: 249, emoji: "🍟", description: "Parmesan, herbs, truffle oil" },
  { id: "m5", name: "Mango Cooler", category: "Drinks", price: 169, emoji: "🥭", description: "Mango, mint and sparkling lime" },
  { id: "m6", name: "Molten Chocolate", category: "Desserts", price: 279, emoji: "🍫", description: "Warm chocolate cake, vanilla cream" },
];
