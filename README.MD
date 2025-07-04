# 🛡️ CCTNS Copilot Engine

AI-powered database assistant for Andhra Pradesh Police using Indian-optimized models.

## 🎯 Overview

The CCTNS Copilot Engine enables police officers to query the CCTNS database using natural language (voice or text) in Telugu, Hindi, or English. It converts natural language to SQL, executes queries, and generates reports with visualizations.

## ✨ Features

- **🎤 Multi-language Voice Input**: Telugu, Hindi, English support
- **🧠 AI-Powered Query Generation**: Natural language to SQL conversion
- **📊 Automatic Visualizations**: Charts and graphs for data insights
- **📑 Report Generation**: PDF reports with summaries
- **💬 Conversational Interface**: Follow-up questions and context awareness
- **🔒 Secure Execution**: SQL sanitization and validation
- **📱 Mobile Ready**: Flutter and React Native apps

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Oracle Database access
- 4GB RAM (8GB recommended)
- GPU optional (improves performance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cctns-copilot-engine
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   venv\Scripts\activate     # Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download AI models**
   ```bash
   python scripts/download_models.py
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database connection string
   ```

6. **Setup database** (optional - uses sample data if not configured)
   ```bash
   python scripts/setup_database.py
   ```

7. **Run the application**
   ```bash
   python run.py
   ```

8. **Access the application**
   - Web Interface: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/api/health

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Voice Input   │───▶│  Speech-to-Text  │───▶│ Text Processing │
│ (Te/Hi/En)      │    │ (IndicConformer/ │    │   (FLAN-T5)     │
│                 │    │    Whisper)      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   SQL Result    │◀───│  SQL Execution   │◀───│ NL2SQL Generation│
│   Formatting    │    │   (Oracle)       │    │   (CodeT5)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐    ┌──────────────────┐
│ Report Generator│───▶│   Visualization  │
│   (Pegasus)     │    │ (Charts/Graphs)  │
└─────────────────┘    └──────────────────┘
```




## 🎮 Example Queries

- **English**: "Show total crimes in Guntur district"
- **Telugu**: "గుంటూర్ జిల్లాలో మొత్తం నేరాలు చూపించు"
- **Hindi**: "गुंटूर जिले में कुल अपराध दिखाएं"




## 🔧 Configuration

### Model Configuration
Edit `config/models_config.yaml` to:
- Change model preferences
- Adjust confidence thresholds
- Modify language settings
- Configure police terminology

### Database Schema
The system supports the standard CCTNS schema:
- `DISTRICT_MASTER`
- `STATION_MASTER`
- `OFFICER_MASTER`
- `CRIME_TYPE_MASTER`
- `FIR`
- `ARREST`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Andhra Pradesh Police Department
- 4SightAI for organizing the hackathon
- AI4Bharat for IndicConformer models
- OpenAI for Whisper
- Google for FLAN-T5 and Pegasus
- Microsoft for CodeT5

## 📞 Support

For technical support or questions:
- Create an issue on GitHub
- Email: dineshjnld22@gmail.com
- Documentation: [docs/](docs/)

---

**Built with ❤️ for Andhra Pradesh Police**
