<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["success" => false, "message" => "Invalid data"]);
  exit;
}

$file = "users.json";

// Load users
$users = file_exists($file)
  ? json_decode(file_get_contents($file), true)
  : [];

// Check if email already exists
foreach ($users as $user) {
  if ($user["email"] === $data["email"]) {
    echo json_encode([
      "success" => false,
      "message" => "Email already registered"
    ]);
    exit;
  }
}

// Create new user
$newUser = [
  "id" => uniqid(),
  "username" => $data["username"],
  "email" => $data["email"],
  "password" => $data["password"], // ⚠ demo only
  "created_at" => date("Y-m-d H:i:s"),
  "success" => 0
];

// Save user
$users[] = $newUser;
file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT));

echo json_encode([
  "success" => true,
  "message" => "Registration successful"
]);
