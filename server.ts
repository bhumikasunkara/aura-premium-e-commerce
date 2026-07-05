import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to the JSON database
const dbPath = path.resolve(process.cwd(), "src/data/db.json");

// Helper to load database
function loadDb(): any {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database file, using fallback:", error);
  }
  return { users: [], products: [], categories: [], brands: [], orders: [], reviews: [], coupons: [], wishlists: {}, carts: {}, notifications: {} };
}

// Helper to save database
function saveDb(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to database file:", error);
  }
}

// Initialize db in memory
let db = loadDb();

// Lazy Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required for AI features. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ------------------- API ENDPOINTS -------------------

// 1. Auth Endpoints
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.post("/api/auth/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }

  const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  const newUser = {
    id: "u_" + Math.random().toString(36).substr(2, 9),
    email,
    password,
    role: "customer" as const,
    name,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    addresses: []
  };

  db.users.push(newUser);
  saveDb(db);

  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ user: userWithoutPassword });
});

app.post("/api/auth/address", (req, res) => {
  const { userId, address } = req.body;
  const userIndex = db.users.findIndex((u: any) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = db.users[userIndex];
  if (!user.addresses) user.addresses = [];

  const newAddress = {
    id: "addr_" + Math.random().toString(36).substr(2, 9),
    ...address,
    isDefault: user.addresses.length === 0 ? true : address.isDefault || false
  };

  if (newAddress.isDefault) {
    user.addresses.forEach((a: any) => a.isDefault = false);
  }

  user.addresses.push(newAddress);
  db.users[userIndex] = user;
  saveDb(db);

  res.json({ address: newAddress, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, addresses: user.addresses } });
});

// 2. Product Management
app.get("/api/products", (req, res) => {
  let products = [...db.products];
  const { category, brand, search, sort, minPrice, maxPrice, rating } = req.query;

  if (category) {
    products = products.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (brand) {
    products = products.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (minPrice) {
    products = products.filter(p => p.price >= parseFloat(minPrice as string));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= parseFloat(maxPrice as string));
  }
  if (rating) {
    products = products.filter(p => p.rating >= parseFloat(rating as string));
  }

  if (sort) {
    const s = sort as string;
    if (s === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (s === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (s === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    } else if (s === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  res.json(products);
});

app.post("/api/products", (req, res) => {
  const { name, description, price, category, brand, stock, images, variants } = req.body;
  if (!name || !description || !price || !category || !brand) {
    return res.status(400).json({ error: "Missing required product fields" });
  }

  const newProduct = {
    id: "p_" + Math.random().toString(36).substr(2, 9),
    name,
    description,
    price: parseFloat(price),
    category,
    brand,
    rating: 5.0,
    reviewCount: 0,
    stock: parseInt(stock) || 0,
    images: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600"],
    variants: variants || { sizes: ["One Size"], colors: ["Standard"] }
  };

  db.products.push(newProduct);
  if (!db.categories.includes(category)) {
    db.categories.push(category);
  }
  if (!db.brands.includes(brand)) {
    db.brands.push(brand);
  }
  saveDb(db);
  res.json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const productIdx = db.products.findIndex((p: any) => p.id === id);
  if (productIdx === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updatedProduct = {
    ...db.products[productIdx],
    ...req.body,
    price: parseFloat(req.body.price),
    stock: parseInt(req.body.stock)
  };

  db.products[productIdx] = updatedProduct;
  saveDb(db);
  res.json(updatedProduct);
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const productIdx = db.products.findIndex((p: any) => p.id === id);
  if (productIdx === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const deletedProduct = db.products.splice(productIdx, 1)[0];
  saveDb(db);
  res.json({ success: true, deleted: deletedProduct });
});

// Categories & Brands
app.get("/api/categories", (req, res) => {
  res.json(db.categories);
});

app.get("/api/brands", (req, res) => {
  res.json(db.brands);
});

// 3. Coupon Validation
app.post("/api/coupons/validate", (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Coupon code is required" });

  const coupon = db.coupons.find((c: any) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
  if (!coupon) {
    return res.status(404).json({ error: "Invalid or inactive coupon code" });
  }

  res.json(coupon);
});

// 4. Cart & Wishlist Sync
app.get("/api/cart/:userId", (req, res) => {
  const { userId } = req.params;
  const cart = db.carts[userId] || [];
  res.json(cart);
});

app.post("/api/cart/:userId", (req, res) => {
  const { userId } = req.params;
  const { cartItems } = req.body;
  db.carts[userId] = cartItems;
  saveDb(db);
  res.json({ success: true, cart: db.carts[userId] });
});

app.get("/api/wishlist/:userId", (req, res) => {
  const { userId } = req.params;
  const wishlist = db.wishlists[userId] || [];
  res.json(wishlist);
});

app.post("/api/wishlist/:userId", (req, res) => {
  const { userId } = req.params;
  const { productIds } = req.body;
  db.wishlists[userId] = productIds;
  saveDb(db);
  res.json({ success: true, wishlist: db.wishlists[userId] });
});

// 5. Order Processing
app.get("/api/orders", (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const orders = db.orders.filter((o: any) => o.userId === userId);
    return res.json(orders);
  }
  res.json(db.orders);
});

app.post("/api/orders", (req, res) => {
  const { userId, orderItems, shippingAddress, shippingOption, shippingCost, discountAmount, totalAmount, paymentMethod } = req.body;
  if (!userId || !orderItems || !shippingAddress || !totalAmount) {
    return res.status(400).json({ error: "Missing required order information" });
  }

  // Adjust product stock
  for (const item of orderItems) {
    const pIdx = db.products.findIndex((p: any) => p.id === item.productId);
    if (pIdx !== -1) {
      db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
    }
  }

  const newOrder = {
    id: "o_" + Math.random().toString(36).substr(2, 9),
    userId,
    orderItems,
    status: "Processing",
    shippingAddress,
    shippingOption,
    shippingCost: parseFloat(shippingCost) || 0,
    paymentStatus: "Paid", // Demo Stripe integration is instant Paid
    paymentMethod: paymentMethod || "Card (Demo)",
    discountAmount: parseFloat(discountAmount) || 0,
    totalAmount: parseFloat(totalAmount),
    date: new Date().toISOString()
  };

  db.orders.push(newOrder);

  // Clear user cart
  db.carts[userId] = [];

  // Create success notification
  if (!db.notifications[userId]) {
    db.notifications[userId] = [];
  }
  db.notifications[userId].push({
    id: "n_" + Math.random().toString(36).substr(2, 9),
    title: "Order Placed Successfully",
    message: `Your order #${newOrder.id} totaling $${newOrder.totalAmount.toFixed(2)} has been placed and is being processed.`,
    read: false,
    date: new Date().toISOString()
  });

  saveDb(db);
  res.json(newOrder);
});

app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orderIdx = db.orders.findIndex((o: any) => o.id === id);
  if (orderIdx === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  db.orders[orderIdx].status = status;

  // Add notification to user
  const userId = db.orders[orderIdx].userId;
  if (!db.notifications[userId]) db.notifications[userId] = [];
  db.notifications[userId].push({
    id: "n_" + Math.random().toString(36).substr(2, 9),
    title: `Order Status Update: ${status}`,
    message: `The status of your order #${id} has been updated to ${status}.`,
    read: false,
    date: new Date().toISOString()
  });

  saveDb(db);
  res.json(db.orders[orderIdx]);
});

// 6. Review Endpoints
app.get("/api/reviews/:productId", (req, res) => {
  const { productId } = req.params;
  const reviews = db.reviews.filter((r: any) => r.productId === productId);
  res.json(reviews);
});

app.post("/api/reviews", (req, res) => {
  const { productId, userId, userName, rating, comment } = req.body;
  if (!productId || !userId || !rating || !comment) {
    return res.status(400).json({ error: "Missing required review fields" });
  }

  const newReview = {
    id: "r_" + Math.random().toString(36).substr(2, 9),
    productId,
    userId,
    userName: userName || "Anonymous Customer",
    rating: parseInt(rating),
    comment,
    date: new Date().toISOString()
  };

  db.reviews.push(newReview);

  // Re-calculate average rating for product
  const productReviews = db.reviews.filter((r: any) => r.productId === productId);
  const totalRating = productReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
  const avgRating = parseFloat((totalRating / productReviews.length).toFixed(1));

  const pIdx = db.products.findIndex((p: any) => p.id === productId);
  if (pIdx !== -1) {
    db.products[pIdx].rating = avgRating;
    db.products[pIdx].reviewCount = productReviews.length;
  }

  saveDb(db);
  res.json(newReview);
});

// 7. Notifications
app.get("/api/notifications/:userId", (req, res) => {
  const { userId } = req.params;
  res.json(db.notifications[userId] || []);
});

app.post("/api/notifications/:userId/read-all", (req, res) => {
  const { userId } = req.params;
  if (db.notifications[userId]) {
    db.notifications[userId].forEach((n: any) => n.read = true);
    saveDb(db);
  }
  res.json({ success: true, notifications: db.notifications[userId] || [] });
});

// 8. Admin Analytics
app.get("/api/admin/analytics", (req, res) => {
  const orders = db.orders;
  const users = db.users;
  const products = db.products;

  // Total sales revenue
  const totalRevenue = orders.reduce((sum: number, o: any) => o.paymentStatus === "Paid" ? sum + o.totalAmount : sum, 0);

  // Average order value
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Active customer count (exclude admin)
  const customerCount = users.filter((u: any) => u.role === "customer").length;

  // Best selling products
  const productSalesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
  for (const o of orders) {
    for (const item of o.orderItems) {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
      }
      productSalesMap[item.productId].quantity += item.quantity;
      productSalesMap[item.productId].revenue += item.price * item.quantity;
    }
  }

  const bestSellers = Object.entries(productSalesMap)
    .map(([id, info]) => ({ id, ...info }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Sales by category
  const categorySalesMap: Record<string, number> = {};
  for (const o of orders) {
    for (const item of o.orderItems) {
      const prod = products.find((p: any) => p.id === item.productId);
      const cat = prod ? prod.category : "Uncategorized";
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (item.price * item.quantity);
    }
  }

  const categorySales = Object.entries(categorySalesMap).map(([name, value]) => ({ name, value }));

  // Sales over time (last 7 days or mock points)
  const salesOverTime = [
    { date: "Mon", revenue: 1450, orders: 4 },
    { date: "Tue", revenue: 2100, orders: 6 },
    { date: "Wed", revenue: 1800, orders: 5 },
    { date: "Thu", revenue: 3200, orders: 9 },
    { date: "Fri", revenue: 4500, orders: 12 },
    { date: "Sat", revenue: 3800, orders: 10 },
    { date: "Sun", revenue: totalRevenue > 0 ? Math.round(totalRevenue % 5000) : 5200, orders: orders.length || 14 }
  ];

  res.json({
    totalRevenue,
    avgOrderValue,
    orderCount: orders.length,
    customerCount,
    bestSellers,
    categorySales,
    salesOverTime
  });
});

// ------------------- GEMINI AI FEATURES -------------------

// AI recommendations route
app.post("/api/ai/recommendations", async (req, res) => {
  const { preferences, cartProductIds } = req.body;

  try {
    const ai = getGeminiClient();
    const productList = db.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      brand: p.brand,
      rating: p.rating
    }));

    const cartContext = cartProductIds && cartProductIds.length > 0 
      ? `The user currently has these items in their cart: ${cartProductIds.map((id: string) => db.products.find((p: any) => p.id === id)?.name || id).join(", ")}`
      : "The user's cart is currently empty.";

    const prompt = `You are a high-end personal styling assistant for Aura, an elite lifestyle store.
Below is the store catalog of available products:
${JSON.stringify(productList, null, 2)}

User's preferences and style context: "${preferences || "Looking for premium workspace or lifestyle accessories."}"
${cartContext}

Based on this information, pick exactly 3 products that perfectly complement their taste, interest, or current cart.
For each of the 3 recommended products, provide a personalized, highly compelling, sophisticated explanation of why it was chosen for them. Keep the tone refined and minimalist (no exclamation marks, elegant word choice, focus on materials/aesthetics).

You must return a JSON response matching this schema:
[
  {
    "productId": "string",
    "reason": "string"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of recommended products with explanation reasons",
          items: {
            type: Type.OBJECT,
            properties: {
              productId: { type: Type.STRING, description: "The product ID being recommended" },
              reason: { type: Type.STRING, description: "Personalized premium explanation of why this product fits the user's style" }
            },
            required: ["productId", "reason"]
          }
        }
      }
    });

    const recommendations = JSON.parse(response.text || "[]");
    res.json({ recommendations });
  } catch (error) {
    console.error("Gemini Recommendations Error:", error);
    // Return a beautiful fallback list if Gemini fails or is not configured
    const fallbackIds = db.products.slice(0, 3).map((p: any) => p.id);
    const fallbacks = fallbackIds.map((id: string) => ({
      productId: id,
      reason: "An exquisite addition selected by our curated gallery style guide to elevate your modern collection."
    }));
    res.json({ recommendations: fallbacks, warning: error instanceof Error ? error.message : "AI fallback utilized." });
  }
});

// AI Chat Assistant Route
app.post("/api/ai/assistant", async (req, res) => {
  const { message, chatHistory } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const ai = getGeminiClient();
    const productCatalog = db.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      brand: p.brand,
      rating: p.rating,
      stock: p.stock,
      colors: p.variants.colors,
      sizes: p.variants.sizes
    }));

    const systemInstruction = `You are Aura, an elite, minimalist AI Shopping Assistant for the Aura Premium Store. Aura is an exclusive, luxury e-commerce boutique inspired by Apple, Nike, and Zara, specializing in premium audio, wearables, workspace gear, and select apparel.
Your tone is professional, sophisticated, polite, and elegant—like a high-end personal shopping concierge. Keep answers clean, concise, and focused on helping the user find the perfect product.

You have access to the store's current product catalog:
${JSON.stringify(productCatalog, null, 2)}

Answer questions about products, recommend items based on features, colors, and pricing. If the user asks about sizing or variants, check the catalog. Highlight the key benefits of buying with Aura: free express shipping on orders over $150, 30-day hassle-free returns, and lifetime premium warranty.

Always be helpful and keep explanations punchy, structured with bullet points where necessary, and visually beautiful. Ensure that you mention exact products from our catalog. If an item is out of stock (stock is 0), mention we can notify them.
Do not make up products not present in the catalog.`;

    const contents = [];
    if (chatHistory && chatHistory.length > 0) {
      for (const h of chatHistory) {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini Assistant Error:", error);
    res.json({ 
      reply: "Thank you for inquiring with Aura. I am currently offline, but you can explore our premium, minimalist curated collection of premium audio wearables, workspace accessories, and hand-selected apparel directly in our storefront. Our order service, free shipping, and custom payment terminals are fully operational.",
      warning: error instanceof Error ? error.message : "AI Offline."
    });
  }
});

// AI Description Generator for Admin
app.post("/api/ai/generate-description", async (req, res) => {
  const { name, category } = req.body;
  if (!name || !category) return res.status(400).json({ error: "Product name and category are required" });

  try {
    const ai = getGeminiClient();
    const prompt = `You are an elite marketing copywriter at Apple and Nike. Write a single, highly compelling, premium, sophisticated product marketing paragraph (approx 50-70 words) for a product named "${name}" in the "${category}" category. 
The description should evoke luxury, precision engineering, tactile performance, and minimalist aesthetics. Do not use generic clichés or hype. Use elegant, design-focused copywriting.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8
      }
    });

    res.json({ description: response.text?.trim() });
  } catch (error) {
    console.error("Gemini Description Generator Error:", error);
    res.json({ 
      description: `Introducing the all-new ${name}. A masterclass in minimalist design and performance, engineered to integrate seamlessly into your premium daily routine with outstanding reliability and premium craftsmanship.`,
      warning: error instanceof Error ? error.message : "AI Offline."
    });
  }
});

// Vite & Static file hosting configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aura Server] running on http://localhost:${PORT}`);
  });
}

startServer();
