# DDig DNS Lookup Tool

A comprehensive web-based DNS Lookup Tool that allows users to query various DNS records for any domain. This tool is designed to be easy to install, use, and maintain in both development and production environments.

### Core Functionality
- **DNS Record Types Support:**
  - A Records (IPv4 addresses)
  - AAAA Records (IPv6 addresses)
  - MX Records (Mail servers)
  - NS Records (Name servers)
  - TXT Records (Text information)

### Technical Features
- RESTful API architecture
- Cross-Origin Resource Sharing (CORS) enabled
- Systemd service integration
- Automatic installation script
- Comprehensive error handling
- Clean and responsive UI

### Interface
- Modern, responsive design
- Real-time results display
- User-friendly error messages
- Mobile-compatible layout

## Requirements

### System Requirements
- Ubuntu/Debian-based system
- Python 3.x
- Root/sudo privileges
- Minimum 512MB RAM
- 1GB free disk space

### Network Requirements
- Port 5000 must be accessible
- Internet connection for DNS queries
- Firewall configuration (if applicable)

## Installation

### Automatic Installation (Recommended)
1. Clone the repository:
```bash
git clone https://github.com/yourusername/dns-lookup-tool.git
cd dns-lookup-tool

2. Run the installation script:
```bash
    sudo bash install.sh
    
3. After installation, the tool will be accessible at:
```bash
    http://your-server-ip:5000

### Community
- All contributors and users of this tool
- Open source community members
- Beta testers and early adopters
- Bug reporters and feature requesters

## Version History

### 1.0.0 (Initial Release)
- Core Features:
  - Basic DNS lookup functionality
  - Support for multiple record types
  - Real-time query processing
  
- Infrastructure:
  - Systemd service integration
  - Automatic installation script
  - Service management tools

- Documentation:
  - Installation guide
  - API documentation
  - Usage examples
