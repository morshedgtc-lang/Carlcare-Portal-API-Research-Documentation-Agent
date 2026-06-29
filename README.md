# Carlcare Portal API Analysis Toolkit

A secure, local-first developer toolkit for capturing, analyzing, and documenting HTTP traffic from your authenticated Carlcare web session.

## Overview

This toolkit helps you:
- **Discover API endpoints** by analyzing your own network traffic
- **Document endpoints** with automated schema generation
- **Detect patterns** and identify duplicate or related endpoints
- **Map dependencies** between API calls
- **Export findings** in multiple formats (JSON, Markdown, CSV)

All data is captured locally and never transmitted to external services. Sensitive data (tokens, passwords, API keys) is automatically redacted.

---

## Features

### 🔍 Endpoint Discovery
- Automatically identify all HTTP requests made during your session
- Parse request metadata (URL, method, headers, parameters)
- Extract and organize JSON request/response bodies
- Group endpoints by functionality (Login, User Profile, Appeals, etc.)

### 📊 API Analysis
- Generate complete JSON schemas from responses
- Detect optional vs. required fields
- Identify nested objects and arrays
- Discover duplicate or similar endpoints

### 📖 Documentation
- Auto-generate Markdown documentation
- Include endpoint purpose, method, parameters, and response schemas
- Create sample responses (with sensitive values redacted)
- Export dependency maps showing how endpoints relate

### 🔐 Security First
- Never captures plain-text passwords
- Automatically redacts:
  - Authorization headers
  - Session cookies
  - API keys and tokens
  - X-CSRF-TOKEN headers
- All data stored locally on your machine
- No external service calls

### 🎨 User Interface
- Search endpoints by URL, method, or keyword
- Browse captured requests and responses
- View JSON tree structures
- Export data in JSON, Markdown, or CSV formats

---

## Project Structure

```
carlcare_api_toolkit/
├── README.md                          # This file
├── requirements.txt                   # Python dependencies
├── setup.py                          # Installation script
├── config/
│   └── settings.json                 # Configuration file
├── src/
│   ├── __init__.py
│   ├── main.py                       # Application entry point
│   ├── capture/
│   │   ├── __init__.py
│   │   ├── sniffer.py               # Network traffic capture
│   │   ├── proxy.py                 # mitmproxy integration
│   │   └── browser_har.py           # HAR file import
│   ├── parsers/
│   │   ├── __init__.py
│   │   ├── http_parser.py           # HTTP request/response parsing
│   │   ├── json_analyzer.py         # JSON structure analysis
│   │   ├── schema_generator.py      # JSON Schema generation
│   │   └── redactor.py              # Sensitive data redaction
│   ├── database/
│   │   ├── __init__.py
│   │   ├── db_manager.py            # SQLite operations
│   │   ├── models.py                # Data models
│   │   └── migrations.py            # Database schema
│   ├── analysis/
│   │   ├── __init__.py
│   │   ├── classifier.py            # Endpoint classification
│   │   ├── deduplicator.py          # Find duplicate endpoints
│   │   ├── dependency_mapper.py     # Build dependency maps
│   │   └── statistics.py            # Generate analysis statistics
│   ├── exporters/
│   │   ├── __init__.py
│   │   ├── markdown_exporter.py     # Export to Markdown
│   │   ├── json_exporter.py         # Export to JSON
│   │   ├── csv_exporter.py          # Export to CSV
│   │   └── swagger_exporter.py      # Export to OpenAPI/Swagger
│   └── ui/
│       ├── __init__.py
│       ├── main_window.py           # Main UI window
│       ├── widgets/
│       │   ├── __init__.py
│       │   ├── endpoint_list.py     # Endpoint list view
│       │   ├── request_viewer.py    # Request detail viewer
│       │   ├── response_viewer.py   # Response detail viewer
│       │   ├── search_panel.py      # Search interface
│       │   └── export_panel.py      # Export options
│       └── resources/
│           └── styles.css           # UI styling
├── tests/
│   ├── __init__.py
│   ├── test_parsers.py
│   ├── test_redactor.py
│   ├── test_classifier.py
│   ├── test_exporters.py
│   └── fixtures/
│       ├── sample_requests.json
│       └── sample_responses.json
├── docs/
│   ├── INSTALLATION.md              # Detailed setup guide
│   ├── USAGE.md                     # How to use the toolkit
│   ├── API_REFERENCE.md             # API documentation
│   ├── SECURITY.md                  # Security considerations
│   └── EXAMPLES.md                  # Example workflows
└── examples/
    ├── sample_export.md
    ├── sample_export.json
    └── sample_dependency_map.txt
```

---

## Quick Start

### Prerequisites
- Python 3.9+
- Windows, macOS, or Linux
- ~500MB disk space for database and exports

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/carlcare-api-toolkit.git
   cd carlcare_api_toolkit
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the database**
   ```bash
   python -m src.database.migrations
   ```

5. **Run the application**
   ```bash
   python -m src.main
   ```

---

## Usage

### Basic Workflow

1. **Start the Toolkit**
   ```bash
   python -m src.main
   ```

2. **Set Up Traffic Capture**
   - Choose capture method (mitmproxy or browser HAR import)
   - Configure network proxy (if using mitmproxy)
   - Or import HAR file from browser Developer Tools

3. **Log Into Carlcare Portal**
   - Open your browser
   - Navigate to Carlcare Portal
   - Log in with your credentials (these are NOT captured by the toolkit)

4. **Use the Application**
   - Perform your usual tasks (appeals, uploads, etc.)
   - All HTTP requests are captured and analyzed

5. **Analyze Results**
   - View endpoints in the toolkit UI
   - Search by keyword or endpoint URL
   - Review request/response structures
   - Examine generated schemas

6. **Export Documentation**
   - Export as Markdown (for documentation)
   - Export as JSON (for integration)
   - Export as CSV (for analysis)
   - Export as OpenAPI/Swagger (for tools)

### Capture Methods

#### Option 1: mitmproxy (Recommended)
```bash
# Start mitmproxy
mitmproxy -p 8080

# Configure browser proxy: 127.0.0.1:8080
# Open browser and navigate to mitm.it to install certificate
```

#### Option 2: Browser HAR Import
```bash
# In browser DevTools (F12):
1. Go to Network tab
2. Perform your actions
3. Right-click → Save all as HAR with content
4. In toolkit: Import HAR → Select the file
```

---

## Key Modules

### Capture Layer (`src/capture/`)
- **sniffer.py**: Raw network traffic capture
- **proxy.py**: mitmproxy integration and certificate handling
- **browser_har.py**: Parse and import HAR files from browsers

### Parsing Layer (`src/parsers/`)
- **http_parser.py**: Extract metadata from HTTP messages
- **json_analyzer.py**: Analyze JSON structures
- **schema_generator.py**: Generate JSON Schema from samples
- **redactor.py**: Remove sensitive data before storage/display

### Storage Layer (`src/database/`)
- **db_manager.py**: SQLite CRUD operations
- **models.py**: Data models (Endpoint, Request, Response, etc.)
- **migrations.py**: Schema initialization and versioning

### Analysis Layer (`src/analysis/`)
- **classifier.py**: Group endpoints by functionality
- **deduplicator.py**: Find duplicate/similar endpoints
- **dependency_mapper.py**: Map endpoint dependencies
- **statistics.py**: Generate metrics and insights

### Export Layer (`src/exporters/`)
- **markdown_exporter.py**: Clean, readable documentation
- **json_exporter.py**: Complete structured export
- **csv_exporter.py**: Tabular format for analysis
- **swagger_exporter.py**: OpenAPI 3.0 format

### UI Layer (`src/ui/`)
- **main_window.py**: PySide6 main application window
- **widgets/**: Reusable UI components
- **resources/**: Styling and assets

---

## Security Guarantees

### What We DON'T Capture
- Plain-text passwords
- Your login credentials
- Form submission data that contains passwords

### What We DO Redact
Before storing or displaying, the toolkit automatically removes:
- `Authorization` headers (Bearer tokens, Basic auth, etc.)
- `Cookie` headers (session cookies, auth tokens)
- `X-CSRF-Token` headers
- `X-API-Key` headers
- `Referer` headers (can leak sensitive URLs)
- Authorization query parameters (`?token=`, `?key=`, etc.)
- Sensitive JSON fields (`password`, `token`, `api_key`, `secret`, `auth`)

### Data Storage
- All captured data is stored in a local SQLite database
- Database file is unencrypted (you can add encryption if needed)
- No data is ever sent to external services
- You can delete the database at any time

### Recommended Practices
1. Run this toolkit on a dedicated machine or isolated network segment
2. Use HTTPS for all Carlcare connections
3. Keep the database file secure (restrict file permissions)
4. Review redaction rules in `src/parsers/redactor.py`
5. Audit exports before sharing with others

---

## Configuration

Edit `config/settings.json` to customize:

```json
{
  "capture": {
    "proxy_host": "127.0.0.1",
    "proxy_port": 8080,
    "ssl_insecure": false
  },
  "redaction": {
    "redact_headers": ["authorization", "cookie", "x-csrf-token"],
    "redact_fields": ["password", "token", "api_key", "secret"],
    "redact_body": true
  },
  "classification": {
    "auto_categorize": true,
    "default_category": "Other"
  },
  "ui": {
    "theme": "light",
    "auto_refresh": true
  }
}
```

---

## Troubleshooting

### "Certificate not trusted" error
- This is normal with mitmproxy
- Install the mitmproxy CA certificate in your browser
- Visit http://mitm.it while proxy is active
- Follow the installation instructions

### No requests being captured
- Verify proxy is configured in browser settings
- Check proxy host/port matches toolkit settings
- Ensure SSL inspection is enabled (if using HTTPS)
- Check firewall rules

### Sensitive data still visible
- Review `config/settings.json` redaction rules
- Check `src/parsers/redactor.py` for custom patterns
- Re-import data if rules were updated

### Database is growing too large
- Export and delete old sessions
- Use the UI to purge data by date range
- Consider moving to a new database

---

## Development

### Running Tests
```bash
pytest tests/ -v
```

### Code Quality
```bash
# Format code
black src/

# Check for issues
flake8 src/

# Type checking
mypy src/
```

### Building Releases
```bash
# Create executable (Windows)
pyinstaller --onefile --windowed src/main.py

# Or create wheel
python setup.py bdist_wheel
```

---

## Extending the Toolkit

### Adding a New Exporter
1. Create `src/exporters/custom_exporter.py`
2. Inherit from `BaseExporter`
3. Implement `export()` method
4. Register in `src/ui/widgets/export_panel.py`

### Adding a New Classifier
1. Create `src/analysis/my_classifier.py`
2. Implement classification logic
3. Use in `src/analysis/classifier.py`

### Custom Redaction Rules
Edit `src/parsers/redactor.py`:
```python
REDACT_PATTERNS = {
    'custom_sensitive': re.compile(r'my_pattern'),
}
```

---

## FAQs

**Q: Will this capture my password?**
A: No. The toolkit captures HTTP traffic, not keyboard input. Passwords are only sent in the login request body, which is redacted.

**Q: Can I use this on a shared machine?**
A: Not recommended. The database contains sensitive information about your API usage. Use on a personal machine.

**Q: How do I share findings with my team?**
A: Export as Markdown or OpenAPI/Swagger format. Both formats have sensitive data redacted.

**Q: Can I run this without a UI?**
A: Yes. Use the Python API directly:
```python
from src.capture.proxy import ProxyCapture
from src.analysis.classifier import classify_endpoints
from src.exporters.markdown_exporter import MarkdownExporter

capture = ProxyCapture()
capture.start()
# ... use the app ...
capture.stop()

endpoints = capture.get_endpoints()
classified = classify_endpoints(endpoints)
exporter = MarkdownExporter()
exporter.export(classified, 'output.md')
```

**Q: How often is the database updated?**
A: In real-time as requests are captured. The UI refreshes every 2 seconds (configurable).

---

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## Support

- 📖 Read the [USAGE.md](docs/USAGE.md) guide
- 🔍 Check [EXAMPLES.md](docs/EXAMPLES.md) for workflows
- 🔐 Review [SECURITY.md](docs/SECURITY.md) for details
- 💬 Open an issue on GitHub

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Status**: Production Ready
