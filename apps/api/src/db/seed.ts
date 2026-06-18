import "dotenv/config";
import { createDatabase } from "./client";
import { menuCategories, menuItems, tables } from "./schema";

const db = createDatabase();
const seededTables = await db.insert(tables).values(
  Array.from({ length: 12 }, (_, i) => ({ name: `T${String(i + 1).padStart(2, "0")}`, position: i + 1 })),
).returning();
const [starters, mains, drinks, desserts] = await db.insert(menuCategories).values([
  { name: "Starters", position: 1 }, { name: "Mains", position: 2 },
  { name: "Drinks", position: 3 }, { name: "Desserts", position: 4 },
]).returning();
await db.insert(menuItems).values([
  { categoryId: starters.id, name: "Crispy Chilli Corn", description: "Sweet chilli glaze, scallion, sesame", price: 22900 },
  { categoryId: starters.id, name: "Truffle Fries", description: "Parmesan, herbs, truffle oil", price: 24900 },
  { categoryId: mains.id, name: "Smoky Paneer Bowl", description: "Charred paneer, herbed rice, pickled onion", price: 34900 },
  { categoryId: mains.id, name: "Butter Chicken", description: "Charred chicken, tomato cream, fenugreek", price: 39900 },
  { categoryId: drinks.id, name: "Mango Cooler", description: "Mango, mint and sparkling lime", price: 16900 },
  { categoryId: desserts.id, name: "Molten Chocolate", description: "Warm chocolate cake, vanilla cream", price: 27900 },
]);
console.log(`Seeded ${seededTables.length} tables and 6 dishes`);
