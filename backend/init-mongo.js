db.createUser({
  user: "admin",
  pwd: "password123",
  roles: [
    {
      role: "readWrite",
      db: "jewellery-app"
    }
  ]
});

db.createCollection("products");
db.createCollection("users");
db.createCollection("orders");
db.createCollection("carts");

print("MongoDB initialized successfully");