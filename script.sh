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

ping_server(){
    if is_os_type "Linux"; then
        response_file=$(mktemp -t server_ping_response.XXXXXX)
    elif is_os_type "Darwin"; then
        response_file=$(mktemp -t server_ping_response)
    fi
    local_ip=$(get_host)
    curl -s -o "$response_file" "$local_ip":"$APP_PORT"/ping
    cat "$response_file"
    rm -f "$response_file" 
}

get_swagger_url(){
    local_ip=$(get_host)
    echo -e "Swagger docs: http://"$local_ip":"$APP_PORT"/docs"
}

isConfigured(){
    if [[ -z "$FA_SERVER" && -z "$FA_USERNAME" && -z "$FA_PASSWORD" ]]; then
        echo "UnAuthorized Access!, Please configure before"
    else
        echo "Service calling.."
    fi
}

get_host(){
    local_ip=$(ifconfig | grep 'inet ' | awk '{print $2}' | head -n 1)
    echo "$local_ip"
}

get_os_type() {
    uname -s
}

# Function to check if the OS type matches a specific value
is_os_type() {
    local target_os_type="$1"
    local current_os_type=$(get_os_type)

    if [ "$current_os_type" == "$target_os_type" ]; then
        return 0  # Return success (true)
    else
        return 1  # Return failure (false)
    fi
}


login_api_call(){

    if [[ -z "$FA_SERVER" ]]; then
        read -p "Server: " SERVER
        export FA_SERVER="$SERVER"
    fi

    if [[ -z "$FA_USERNAME" ]]; then
        read -p "username: " USERNAME
        export FA_USERNAME="$USERNAME"
    fi

    if [[ -z "$FA_PASSWORD" ]]; then
        read -p "password: " PASSWORD
        export FA_PASSWORD="$PASSWORD"
    fi
    
    
    echo
    local JSON_DATA="{\"username\": \"$FA_USERNAME\", \"password\": \"$FA_PASSWORD\"}"
    if is_os_type "Linux"; then
        response_file=$(mktemp -t server_login_response.XXXXXX)
    elif is_os_type "Darwin"; then
        response_file=$(mktemp -t server_login_response)
    fi
    curl -s -o "$response_file" -X POST "$FA_SERVER/auth/signin" -H "Content-Type: application/json" -d "$JSON_DATA"
    if [ $? -eq 0 ]; then
        # Extract access_token using grep and awk
        local access_token=$(grep -o '"accessToken": *"[^"]*"' "$response_file" | awk -F '"' '{print $4}')

        if [ -n "$access_token" ]; then
            echo 2
            echo "Congratulations! FA service configured Successfully 🤩."
            echo
            echo "Access Token: $access_token"

            # Additional processing or usage of the access_token can be done here
        else
            echo "Failed to extract access_token from the response."
            # Print the response body for debugging
            cat "$response_file"
        fi
    else
        echo "Error making API call."
    fi

    rm -f "$response_file"
}

get_refresh_token(){
    if [[ -z "$FA_SERVER" && -z "$FA_USERNAME" && -z "$FA_PASSWORD" ]]; then
        echo "UnAuthorized Access! 😐, Please configure before 🧐"
    else
        local JSON_DATA="{\"username\": \"$FA_USERNAME\", \"password\": \"$FA_PASSWORD\"}"
        if is_os_type "Linux"; then
            response_file=$(mktemp -t server_refresh_response.XXXXXX)
        elif is_os_type "Darwin"; then
            response_file=$(mktemp -t server_refresh_response)
        fi
        curl -s -o "$response_file" -X POST "$FA_SERVER/auth/signin" -H "Content-Type: application/json" -d "$JSON_DATA"
        if [ $? -eq 0 ]; then
        # Extract access_token using grep and awk
            local refresh_token=$(grep -o '"refreshToken": *"[^"]*"' "$response_file" | awk -F '"' '{print $4}')

            if [ -n "$refresh_token" ]; then
                echo "Refresh Token: $refresh_token"

            # Additional processing or usage of the access_token can be done here
            else
                echo "Failed to extract access_token from the response."
            # Print the response body for debugging
                cat "$response_file"
            fi
        else
            echo "Error making API call."
        fi
        
    fi
    rm -f "$response_file"
}

install_docker_macos() {
    echo "Installing Docker Desktop on macOS..."
    brew install --cask docker
}

install_docker_linux() {
    echo "Installing Docker on Linux..."
    sudo apt-get update
    sudo apt-get install docker.io -y
    sudo systemctl start docker
    sudo docker run hello-world
    sudo systemctl enable docker
    sudo usermod -a -G docker $(whoami)
    newgrp docker
    echo "Docker installed and started. ✅"
}
configure_docker_compose(){
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)"  -o /usr/local/bin/docker-compose
    sudo mv /usr/local/bin/docker-compose /usr/bin/docker-compose
    sudo chmod +x /usr/bin/docker-compose
    echo "Docker-compose installed and ready to use 🚀"
}

configure_docker(){
if command -v docker &> /dev/null; then
    echo "Docker is already installed."
else
    # Detect the operating system
    if [[ "$OSTYPE" == "darwin"* ]]; then
        install_docker_macos
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        install_docker_linux
    else
        echo "Unsupported operating system."
        exit 1
    fi
fi
    
}

clear
# Introduction
echo 
echo "Welcome 2FA-EXP-ORCHESTRATION 🚀"
echo "This script allows you to perform various actions to orchestration."
echo "Please select an option from the menu below:"
# Menu options
echo
options=("Install Docker" "Docker-compose Configure" "Build and Deploy to Docker" "Push to Docker Hub" "Get All Image Versions" "Deploy" "Rollout" "ping to server" "Fa Login" "Refresh Token" "swagger docs" "Quit")
echo
PS3="> "
echo
select option in "${options[@]}"; do
    case $REPLY in
        1) configure_docker
           docker_status=$(docker info &> /dev/null && echo "running" || echo "not running")
           echo "Docker status: $docker_status"
            ;;
        2) configure_docker_compose
            ;;
        3)
            run_command "docker build -t $DOCKER_REPOSITORY/$DOCKER_BUILD_IMAGE_NAME ." "Docker Image $DOCKER_BUILD_IMAGE_NAME build successfully ✅"
            sleep 2
            run_command "docker push $DOCKER_REPOSITORY/$DOCKER_BUILD_IMAGE_NAME" "$DOCKER_BUILD_IMAGE_NAME is pushed successfully on the $DOCKER_REPOSITORY repository 🐳"
            sleep 5
            run_command "docker-compose up" "deployed"
            ;;
        4)
            run_command "docker push $DOCKER_REPOSITORY/$DOCKER_BUILD_IMAGE_NAME" "$DOCKER_BUILD_IMAGE_NAME is pushed successfully on the $DOCKER_REPOSITORY repository 🐳"
            ;;
        5)
            docker_images_output=$(docker images | grep $DOCKER_BUILD_IMAGE_NAME)
            if [ -n "$docker_images_output" ]; then
                echo "Matching Docker images:"
                echo "$docker_images_output"
            else
                echo "No matching Docker images found."
            fi
            ;;

        6) docker-compose up -d
           docker-compose exec --user root pgadmin sh -c 'chmod 0777 /var/lib/pgadmin -R'
            ;;
        7) confirm_action "Rollback proceeding 🛠️" docker_compose "down -v"
            ;;

        8) ping_server
            ;;

        9) login_api_call
            ;;

        10) get_refresh_token
            ;;

        11) get_swagger_url
            ;;
        12)
            echo "Quitting..."
            break
            ;;
        *)
            echo "Invalid option. Please select a valid option."
            ;;
    esac
done

