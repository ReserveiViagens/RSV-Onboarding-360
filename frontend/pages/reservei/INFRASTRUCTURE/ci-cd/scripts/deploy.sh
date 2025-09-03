#!/bin/bash

# RSV 360° Ecosystem - Deployment Script
# This script handles deployment to different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
FORCE=${3:-false}

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅${NC} $1"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌${NC} $1"
    exit 1
}

# Validate environment
validate_environment() {
    log "Validating environment: $ENVIRONMENT"
    
    case $ENVIRONMENT in
        staging|production)
            success "Environment $ENVIRONMENT is valid"
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT. Use 'staging' or 'production'"
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    # Check if kubectl is installed (for Kubernetes deployments)
    if ! command -v kubectl &> /dev/null; then
        warning "kubectl is not installed. Kubernetes deployment will be skipped."
    fi
    
    success "Prerequisites check completed"
}

# Load environment configuration
load_environment_config() {
    log "Loading environment configuration for $ENVIRONMENT"
    
    ENV_FILE="$PROJECT_ROOT/INFRASTRUCTURE/ci-cd/environments/$ENVIRONMENT/.env"
    
    if [[ -f "$ENV_FILE" ]]; then
        source "$ENV_FILE"
        success "Environment configuration loaded"
    else
        warning "Environment file not found: $ENV_FILE"
        warning "Using default configuration"
    fi
}

# Build Docker images
build_images() {
    log "Building Docker images for version $VERSION"
    
    cd "$PROJECT_ROOT"
    
    # Build all service images
    SERVICES=(
        "ecosystem-master"
        "crm-system"
        "booking-engine"
        "financial-system"
        "product-catalog"
        "marketing-automation"
        "analytics-intelligence"
        "administration"
        "inventory-management"
        "payment-gateway"
        "public-facing"
    )
    
    for service in "${SERVICES[@]}"; do
        log "Building image for $service"
        docker build -f "INFRASTRUCTURE/ci-cd/docker/Dockerfile.$service" \
            -t "rsv-ecosystem/$service:$VERSION" \
            -t "rsv-ecosystem/$service:latest" \
            .
        
        if [[ $? -eq 0 ]]; then
            success "Image built successfully: rsv-ecosystem/$service:$VERSION"
        else
            error "Failed to build image for $service"
        fi
    done
}

# Deploy with Docker Compose
deploy_docker_compose() {
    log "Deploying with Docker Compose to $ENVIRONMENT"
    
    cd "$PROJECT_ROOT/INFRASTRUCTURE/ci-cd/environments/$ENVIRONMENT"
    
    # Update image tags in docker-compose.yml
    sed -i.bak "s|IMAGE_TAG|$VERSION|g" docker-compose.yml
    
    # Pull latest images
    docker-compose pull
    
    # Deploy services
    docker-compose up -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    check_health
    
    success "Docker Compose deployment completed"
}

# Deploy with Kubernetes
deploy_kubernetes() {
    log "Deploying with Kubernetes to $ENVIRONMENT"
    
    cd "$PROJECT_ROOT/INFRASTRUCTURE/ci-cd/environments/$ENVIRONMENT/kubernetes"
    
    # Update image tags in Kubernetes manifests
    find . -name "*.yaml" -exec sed -i.bak "s|IMAGE_TAG|$VERSION|g" {} \;
    
    # Apply Kubernetes manifests
    kubectl apply -f .
    
    # Wait for rollout to complete
    kubectl rollout status deployment/rsv-ecosystem-master
    kubectl rollout status deployment/rsv-crm-system
    kubectl rollout status deployment/rsv-booking-engine
    kubectl rollout status deployment/rsv-financial-system
    kubectl rollout status deployment/rsv-product-catalog
    kubectl rollout status deployment/rsv-marketing-automation
    kubectl rollout status deployment/rsv-analytics-intelligence
    kubectl rollout status deployment/rsv-administration
    kubectl rollout status deployment/rsv-inventory-management
    kubectl rollout status deployment/rsv-payment-gateway
    kubectl rollout status deployment/rsv-public-facing
    
    success "Kubernetes deployment completed"
}

# Check service health
check_health() {
    log "Checking service health..."
    
    # Define service URLs based on environment
    if [[ "$ENVIRONMENT" == "production" ]]; then
        BASE_URL="https://rsv360.com"
    else
        BASE_URL="http://staging.rsv360.com"
    fi
    
    # Health check endpoints
    ENDPOINTS=(
        "$BASE_URL/health"
        "$BASE_URL/api/health"
        "$BASE_URL/api/crm/health"
        "$BASE_URL/api/booking/health"
        "$BASE_URL/api/financial/health"
        "$BASE_URL/api/products/health"
        "$BASE_URL/api/marketing/health"
        "$BASE_URL/api/analytics/health"
        "$BASE_URL/api/admin/health"
        "$BASE_URL/api/inventory/health"
        "$BASE_URL/api/payment/health"
        "$BASE_URL/api/public/health"
    )
    
    for endpoint in "${ENDPOINTS[@]}"; do
        log "Checking health: $endpoint"
        
        if curl -f -s "$endpoint" > /dev/null; then
            success "Health check passed: $endpoint"
        else
            error "Health check failed: $endpoint"
        fi
    done
}

# Run smoke tests
run_smoke_tests() {
    log "Running smoke tests..."
    
    cd "$PROJECT_ROOT/INFRASTRUCTURE/testing-framework"
    
    # Set base URL for tests
    if [[ "$ENVIRONMENT" == "production" ]]; then
        export TEST_BASE_URL="https://rsv360.com"
    else
        export TEST_BASE_URL="http://staging.rsv360.com"
    fi
    
    # Run smoke tests
    npm run test:smoke
    
    if [[ $? -eq 0 ]]; then
        success "Smoke tests passed"
    else
        error "Smoke tests failed"
    fi
}

# Rollback deployment
rollback() {
    log "Rolling back deployment..."
    
    cd "$PROJECT_ROOT/INFRASTRUCTURE/ci-cd/environments/$ENVIRONMENT"
    
    if [[ -f "docker-compose.yml" ]]; then
        # Rollback with Docker Compose
        docker-compose down
        docker-compose up -d
    fi
    
    if [[ -d "kubernetes" ]]; then
        # Rollback with Kubernetes
        kubectl rollout undo deployment/rsv-ecosystem-master
        kubectl rollout undo deployment/rsv-crm-system
        kubectl rollout undo deployment/rsv-booking-engine
        kubectl rollout undo deployment/rsv-financial-system
        kubectl rollout undo deployment/rsv-product-catalog
        kubectl rollout undo deployment/rsv-marketing-automation
        kubectl rollout undo deployment/rsv-analytics-intelligence
        kubectl rollout undo deployment/rsv-administration
        kubectl rollout undo deployment/rsv-inventory-management
        kubectl rollout undo deployment/rsv-payment-gateway
        kubectl rollout undo deployment/rsv-public-facing
    fi
    
    success "Rollback completed"
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old versions (keep last 3)
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}" | \
        grep "rsv-ecosystem" | \
        awk '{print $3}' | \
        tail -n +4 | \
        xargs -r docker rmi -f
    
    success "Cleanup completed"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    log "Sending notification: $status"
    
    # Send Slack notification
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 RSV 360° Ecosystem Deployment $status\\nEnvironment: $ENVIRONMENT\\nVersion: $VERSION\\nMessage: $message\"}" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    # Send email notification
    if [[ -n "$EMAIL_RECIPIENTS" ]]; then
        echo "RSV 360° Ecosystem Deployment $status\nEnvironment: $ENVIRONMENT\nVersion: $VERSION\nMessage: $message" | \
            mail -s "RSV 360° Ecosystem Deployment $status" "$EMAIL_RECIPIENTS"
    fi
}

# Main deployment function
main() {
    log "🚀 Starting RSV 360° Ecosystem deployment"
    log "Environment: $ENVIRONMENT"
    log "Version: $VERSION"
    log "Force: $FORCE"
    
    # Validate inputs
    validate_environment
    check_prerequisites
    load_environment_config
    
    # Build images
    build_images
    
    # Deploy based on configuration
    if [[ -f "$PROJECT_ROOT/INFRASTRUCTURE/ci-cd/environments/$ENVIRONMENT/docker-compose.yml" ]]; then
        deploy_docker_compose
    elif [[ -d "$PROJECT_ROOT/INFRASTRUCTURE/ci-cd/environments/$ENVIRONMENT/kubernetes" ]]; then
        deploy_kubernetes
    else
        error "No deployment configuration found for environment: $ENVIRONMENT"
    fi
    
    # Run health checks
    check_health
    
    # Run smoke tests
    run_smoke_tests
    
    # Cleanup
    cleanup
    
    # Send success notification
    send_notification "SUCCESS" "Deployment completed successfully"
    
    success "🎉 Deployment completed successfully!"
    log "Environment: $ENVIRONMENT"
    log "Version: $VERSION"
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        log "Production URL: https://rsv360.com"
    else
        log "Staging URL: http://staging.rsv360.com"
    fi
}

# Error handling
trap 'error "Deployment failed. Rolling back..." && rollback && send_notification "FAILED" "Deployment failed and was rolled back"' ERR

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -v|--version)
            VERSION="$2"
            shift 2
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        --rollback)
            rollback
            exit 0
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -e, --environment ENV    Environment to deploy to (staging|production)"
            echo "  -v, --version VERSION    Version to deploy"
            echo "  -f, --force             Force deployment even if checks fail"
            echo "  --rollback              Rollback to previous version"
            echo "  -h, --help              Show this help message"
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Run main function
main
