async function lookupDNS(recordType = 'A') {
    const input = document.getElementById('domainInput').value;
        if (!input) {
        alert('Please enter a domain name');
        return;
    }
    
    const resultContainer = document.getElementById('resultContainer');
    const recordsTableBody = document.getElementById('recordsTableBody');
    const errorMessage = document.getElementById('errorMessage');
    const domainName = document.getElementById('domainName');
    const recordDescription = document.getElementById('recordDescription');

    // Update active tab
    document.querySelectorAll('.record-type-tab').forEach(tab => {
        if (tab.getAttribute('data-type') === recordType) {
            tab.classList.add('text-blue-600', 'font-bold', 'border-b-2', 'border-blue-600');
            tab.classList.remove('text-gray-600');
        } else {
            tab.classList.remove('text-blue-600', 'font-bold', 'border-b-2', 'border-blue-600');
            tab.classList.add('text-gray-600');
        }
    });

    // Clear previous results
    recordsTableBody.innerHTML = '';
    errorMessage.textContent = '';
    domainName.textContent = input;

    // Update record type description
    const descriptions = {
        'A': 'An A record maps a domain name to the IP address (IPv4) of the computer hosting the domain. A records are used to convert a human-readable domain name into an IP address that can be understood by computers.',
        'AAAA': 'An AAAA record maps a domain name to the IPv6 address of the computer hosting the domain. AAAA records are the IPv6 equivalent of an A record.',
        'MX': 'An MX (Mail Exchange) record specifies the mail servers responsible for accepting email messages on behalf of a domain name. It includes a priority value to indicate preferred mail servers.',
        'NS': 'NS (Name Server) records specify the authoritative DNS servers for a domain. These servers contain the actual DNS records for the domain.',
        'TXT': 'TXT records are text records that can contain any text-based data. They are commonly used for domain verification, SPF records, and other domain-related text information.'
    };
    recordDescription.innerHTML = `
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h3 class="font-bold text-blue-800">What is a ${recordType} Record?</h3>
            <p class="text-blue-700 mt-2">${descriptions[recordType]}</p>
        </div>
    `;

    try {
        const response = await fetch(`https://dns.google/resolve?name=${input}&type=${recordType}`);
        const data = await response.json();

        if (data.Status === 0 && data.Answer) {
            data.Answer.forEach(record => {
                const row = document.createElement('tr');
                let recordData = record.data;

                // Format the data based on record type
                switch(recordType) {
                    case 'MX':
                        recordData = `Priority: ${record.preference}, Server: ${record.data}`;
                        break;
                    case 'NS':
                    case 'TXT':
                        recordData = record.data;
                        break;
                    default:
                        recordData = record.data;
                        break;
                }

                row.innerHTML = `
                    <td class="p-2 border-b">${recordType}</td>
                    <td class="p-2 border-b">${input}</td>
                    <td class="p-2 border-b">${recordData}</td>
                    <td class="p-2 border-b">${record.ttl !== undefined ? record.ttl : 'N/A'} seconds</td>
                `;
                recordsTableBody.appendChild(row);
            });
            resultContainer.style.display = 'block';
        } else {
            errorMessage.textContent = 'No records found or an error occurred.';
            resultContainer.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred while fetching DNS records.';
        resultContainer.style.display = 'block';
    }
}

// Light/Dark mode toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    document.getElementById('themeToggle').textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});