<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Get input data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

$file = "users.json";

// Check if file exists
if (!file_exists($file)) {
    echo json_encode(["success" => false, "message" => "No users found"]);
    exit;
}

// Load users
$users = json_decode(file_get_contents($file), true);

foreach ($users as $user) {
    if ($user["email"] === $data["email"] && $user["password"] === $data["password"]) {
        if ($user["success"] == 1) { // check if user can login
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $user["id"],
                    "username" => $user["username"],
                    "email" => $user["email"]
                ]
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Account is inactive. Cannot login."
            ]);
        }
        exit; // stop after matching user
    }
}

// No matching email/password found
echo json_encode([
    "success" => false,
    "message" => "Invalid email or password"
]);
