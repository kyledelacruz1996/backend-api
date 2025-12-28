import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Enable CORS for frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const data = req.body;

    if (!data || !data.email || !data.password) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    // Path to users.json
    const filePath = path.join(process.cwd(), "users.json");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    // Load users
    const usersRaw = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(usersRaw);

    // Check email/password
    for (const user of users) {
      if (user.email === data.email && user.password === data.password) {
        if (user.success === 1) {
          return res.json({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          });
        } else {
          return res.json({
            success: false,
            message: "Account is inactive. Cannot login.",
          });
        }
      }
    }

    // No matching user
    return res.json({ success: false, message: "Invalid email or password" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
