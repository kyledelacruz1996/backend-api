import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const data = req.body;

    if (!data || !data.email || !data.username || !data.password) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const filePath = path.join(process.cwd(), "users.json");

    // Load existing users
    const users = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : [];

    // Check if email already exists
    if (users.some(user => user.email === data.email)) {
      return res.json({ success: false, message: "Email already registered" });
    }

    // Create new user
    const newUser = {
      id: crypto.randomUUID(), // unique ID
      username: data.username,
      email: data.email,
      password: data.password, // ⚠ demo only, store hashed in production
      created_at: new Date().toISOString(),
      success: 0
    };

    users.push(newUser);

    // Save back to users.json
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8");

    return res.json({ success: true, message: "Registration successful" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
