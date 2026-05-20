# Mineral Naming & Formula Calculator

A Streamlit-based web application for deriving chemical formulas and identifying minerals from elemental or oxide weight percent (wt%) data, commonly obtained from Electron Probe Micro-Analyzer (EPMA) analysis.

## Features

- **Dual Analysis Modes**: 
    - **Oxide Mode**: Normalizes cation ratios based on a user-defined oxygen count ($n$). Essential for petrological stoichiometry.
    - **Element Mode**: Simple atomic proportion calculations for elemental analysis.
- **Dynamic Input**: Interactive data editor for easy entry of wt% values.
- **Real-time Validation**: Automatic summation of wt% and warnings if the total deviates significantly from 100%.
- **Chemical Formula Derivation**: Generates empirical chemical formulas from calculated atomic ratios.
- **Mineral Identification**: Matches the derived stoichiometry against a customizable database (`mineral_db.csv`) using a least-squares difference approach.
- **Detailed Calculation Logs**: View every step of the calculation process (Molecular Weight, Molecular Proportion, Cation/Oxygen Proportion, etc.) in a tabular format.

## Tech Stack

- **Python 3.10+**
- **Streamlit**: Web UI and interactivity.
- **Pandas**: Data processing and matrix calculations.
- **Pytest**: Backend logic verification.

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd mineral-calculator
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

1.  **Run the application**:
    ```bash
    streamlit run app.py
    ```

2.  **Perform Analysis**:
    - **Select Mode**: Choose "Oxide" or "Element" in the sidebar.
    - **Set Oxygen Count**: For Oxide mode, specify the target oxygen count (e.g., 4 for Olivine, 8 for Feldspar).
    - **Select Components**: Add or remove oxides/elements from the multiselect box.
    - **Enter Data**: Fill in the `wt%` column in the data editor.
    - **Calculate**: Click the "Calculate" button to see the results.

## Project Structure

```text
mineral-calculator/
├── app.py                # Main Streamlit UI
├── requirements.txt       # Python dependencies
├── data/
│   ├── atomic_weights.csv # Standard atomic weight data
│   └── mineral_db.csv     # Mineral identification database
├── utils/
│   └── calculations.py    # Core mathematical logic
└── tests/
    └── test_calculations.py # Unit tests
```

## Data Customization

- **`data/atomic_weights.csv`**: You can update this file if you need higher precision or want to add rare elements.
- **`data/mineral_db.csv`**: Add your own mineral standards to improve identification accuracy for specific geological settings.

## License

This project is provided for educational and research purposes in the field of Earth Sciences.
