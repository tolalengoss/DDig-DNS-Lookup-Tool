#!/bin/bash

# install.sh
echo "Starting IT ToolBox installation..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Get the current directory path
INSTALL_PATH=$(pwd)
echo "Installation path: $INSTALL_PATH"

# Update system and install requirements
echo "Updating system and installing prerequisites..."
apt update
apt install -y python3 python3-venv python3-pip

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python packages
echo "Installing Python packages..."
pip install -r requirements.txt

# Create systemd service file with dynamic paths
cat > ittoolbox.service << EOL
[Unit]
Description=IT ToolBox Flask Application
After=network.target

[Service]
User=root
WorkingDirectory=${INSTALL_PATH}
Environment="PATH=${INSTALL_PATH}/venv/bin"
ExecStart=${INSTALL_PATH}/venv/bin/python ${INSTALL_PATH}/app.py
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=ittoolbox

[Install]
WantedBy=multi-user.target
EOL

# Setup systemd service
echo "Setting up systemd service..."
cp ittoolbox.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable ittoolbox
systemctl start ittoolbox

# Get server IP address
SERVER_IP=$(hostname -I | awk '{print $1}')

# Check if the service is running
if systemctl is-active --quiet ittoolbox; then
    echo -e "\n=== Installation Completed Successfully! ===\n"
    echo "Service Status: Active (Running)"
    echo "You can access the application at:"
    echo "http://${SERVER_IP}:5000"
    echo -e "\nService Management Commands:"
    echo "Start:    sudo systemctl start ittoolbox"
    echo "Stop:     sudo systemctl stop ittoolbox"
    echo "Restart:  sudo systemctl restart ittoolbox"
    echo "Status:   sudo systemctl status ittoolbox"
    echo -e "\nInstallation Path: ${INSTALL_PATH}"
else
    echo -e "\n=== Installation Completed with Warnings ===\n"
    echo "Service Status: Failed to Start"
    echo "Please check the service status using:"
    echo "sudo systemctl status ittoolbox"
    echo "Or check the logs using:"
    echo "sudo journalctl -u ittoolbox"
fi

# Add modification to app.py to bind to all interfaces
sed -i 's/app.run(debug=True)/app.run(host="0.0.0.0", debug=True)/' app.py

# Restart service to apply changes
systemctl restart ittoolbox

echo -e "\nNote: If you're using a firewall, make sure port 5000 is open:"
echo "sudo ufw allow 5000/tcp"