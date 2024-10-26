from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import socket
import dns.resolver

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/dns-lookup', methods=['POST'])
def dns_lookup():
    domain = request.json.get('domain')
    if not domain:
        return jsonify({'error': 'Domain is required'}), 400

    try:
        records = []
        resolver = dns.resolver.Resolver()

        # Function to safely query DNS records
        def get_records(domain, record_type):
            try:
                answers = resolver.resolve(domain, record_type)
                return [str(rdata) for rdata in answers]
            except Exception:
                return []

        # Get A records
        a_records = get_records(domain, 'A')
        for value in a_records:
            records.append({
                'name': domain,
                'ttl': '300',
                'type': 'A',
                'value': value
            })

        # Get AAAA records
        aaaa_records = get_records(domain, 'AAAA')
        for value in aaaa_records:
            records.append({
                'name': domain,
                'ttl': '300',
                'type': 'AAAA',
                'value': value
            })

        # Get MX records
        mx_records = get_records(domain, 'MX')
        for value in mx_records:
            records.append({
                'name': domain,
                'ttl': '300',
                'type': 'MX',
                'value': value
            })

        # Get NS records
        ns_records = get_records(domain, 'NS')
        for value in ns_records:
            records.append({
                'name': domain,
                'ttl': '300',
                'type': 'NS',
                'value': value
            })

        # Get TXT records
        txt_records = get_records(domain, 'TXT')
        for value in txt_records:
            records.append({
                'name': domain,
                'ttl': '300',
                'type': 'TXT',
                'value': value
            })

        return jsonify({'records': records})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)