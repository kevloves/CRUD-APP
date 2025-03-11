#!/bin/bash

# Exit on error
set -e

# MongoDB and JWT settings
echo "Please enter your MongoDB URI (e.g. mongodb+srv://username:password@cluster.mongodb.net/dbname)"
read -p "MongoDB URI: " MONGODB_URI
echo "Please enter your JWT secret (any secure string of characters)"
read -p "JWT Secret: " JWT_SECRET

# Update docker-compose.yml with environment variables
sed -i '' "s|mongodb+srv://admin:password@mongodb.example.com/crud-app|$MONGODB_URI|g" docker-compose.yml
sed -i '' "s|myJWTsecret123|$JWT_SECRET|g" docker-compose.yml

# Deploy to Elastic Beanstalk
echo "Deploying to Elastic Beanstalk..."
eb deploy

echo "Deployment complete!"
echo "Your application should be available soon at: $(eb status | grep CNAME | awk '{print $2}')"