// docker/mongo-init.js
// This runs automatically when MongoDB container starts for the first time

db = db.getSiblingDB("hackathon");

db.createUser({
  user: "app_user",
  pwd: "app_password_123",
  roles: [
    {
      role: "readWrite",
      db: "hackathon",
    },
  ],
});

db.createCollection("users");

print(" MongoDB initialized: database 'hackathon' created with app_user");