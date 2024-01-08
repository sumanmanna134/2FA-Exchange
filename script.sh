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

confirm_action() {
    local action_message=$1
    local confirm_function=$2
    local confirm_function_params="${@:3}"  # Get all additional parameters starting from the 3rd position

    read -p "Do you want to $action_message? (y/N): " confirmation

    if [[ "$confirmation" =~ ^[Yy]$ ]]; then
        echo "Confirmed. Proceeding with $action_message..."
        $confirm_function $confirm_function_params
    else
        echo "Operation canceled."
    fi
}

docker_compose(){
    local command_type=$1
    echo "Excuting Docker-compose api... ";
    docker-compose "$command_type"
}

call_api(){
    local api_url=$1

    #make a GET request
    local response=$(curl -X GET --header "Accept: */*" $api_url)
    echo "Response from server"
    echo $response
}

clear
# Introduction
echo s
echo "Welcome 2FA-EXP-ORCHESTRATION"
echo "This script allows you to perform various actions to orchestration."
echo "Please select an option from the menu below:"
# Menu options
echo
options=("Build and Deploy to Docker" "Push to Docker Hub" "Get All Image Versions" "Deploy" "Rollout" "ping to server" "Quit")
echo
PS3="> "
echo
select option in "${options[@]}"; do
    case $REPLY in
        1)
            run_command "docker build -t $DOCKER_REPOSITORY/$DOCKER_BUILD_IMAGE_NAME ." "Docker Image $DOCKER_BUILD_IMAGE_NAME build successfully"
            sleep 2
            run_command "docker push $DOCKER_REPOSITORY/$DOCKER_BUILD_IMAGE_NAME" "$DOCKER_BUILD_IMAGE_NAME is pushed successfully on the $DOCKER_REPOSITORY repository"
            sleep 5
            run_command "docker-compose up" "deployed"
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

        4) confirm_action "Server up.." docker_compose "up"
            ;;
        5) confirm_action "Rollback proceeding" docker_compose "down"
            ;;

        6) call_api "http://localhost:3000/ping"
            ;;
        7)
            echo "Quitting..."
            break
            ;;
        *)
            echo "Invalid option. Please select a valid option."
            ;;
    esac
done

