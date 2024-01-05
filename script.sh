#!/bin/bash
# Set the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Loading the .env..."
sleep 3

# Load environment variables from .env
if [ -f "$PROJECT_DIR/.env" ]; then
    source "$PROJECT_DIR/.env"
    echo -e "Successfully Loaded the environment variables\n"
    sleep 3


else
    echo "Error: .env file not found in $PROJECT_DIR."
    exit 1
fi

run_command(){
    echo "Running: $1"
    sleep 3
    if $1; then 
        echo -e "\n $2 \n"
        sleep 1
    else
        echo "Error executing command ($1). exiting..."
        exit 1
    fi
}
clear
# Introduction
echo 
echo "Welcome to the Interactive Menu Script"
echo "This script allows you to perform various actions using kubectl commands."
echo "Please select an option from the menu below:"
# Menu options
echo
options=("Build Docker Image" "Push to Docker Hub" "Get All Image Versions" "Create Server (PGADMIN4)" "Quit")
echo
PS3="> "
echo
select option in "${options[@]}"; do
    case $REPLY in
        1)
            run_command "docker build -t $DOCKER_REPOSITORY/$DOCKER_BUILD_IMAGE_NAME ." "Docker Image $DOCKER_BUILD_IMAGE_NAME build successfully"
            ;;
        2)
            run_command "docker push $DOCKER_REPOSITORY/$DOCKER_BUILD_IMAGE_NAME" "$DOCKER_BUILD_IMAGE_NAME is pushed successfully on the $DOCKER_REPOSITORY repository"
            ;;
        3)
            docker_images_output=$(docker images | grep $DOCKER_BUILD_IMAGE_NAME)
            if [ -n "$docker_images_output" ]; then
                echo "Matching Docker images:"
                echo "$docker_images_output"
            else
                echo "No matching Docker images found."
            fi
            ;;

        4) run_command "docker-compose run nestjs npm run typeorm:generate exchange-migration" "created server in pgadmin4 before the migration"
           ;;
        5)
            echo "Quitting..."
            break
            ;;
        *)
            echo "Invalid option. Please select a valid option."
            ;;
    esac
done

