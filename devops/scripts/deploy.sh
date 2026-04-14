#!/bin/bash
set -e

echo "🚀 Deploying Land Intelligence Platform..."

# Load env
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | xargs)
fi

# Build and push images
echo "📦 Building Docker images..."
docker-compose -f devops/docker-compose.yml build

echo "🔄 Pushing to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ECR_REGISTRY

for service in frontend backend ai_engine; do
  docker tag land-intelligence-$service:latest $AWS_ECR_REGISTRY/land-intelligence-$service:latest
  docker push $AWS_ECR_REGISTRY/land-intelligence-$service:latest
  echo "  ✓ $service pushed"
done

echo "🎯 Updating ECS services..."
for service in frontend-service backend-service ai-engine-service; do
  aws ecs update-service --cluster land-intelligence --service $service --force-new-deployment --region $AWS_REGION
  echo "  ✓ $service updated"
done

echo "✅ Deployment complete!"
