#!/bin/bash

# Script to run the MPI performance evaluator

# Default values
STUDENT_EXE="./mpi_um"
REFERENCE_EXE="./ref_mpi_um"
INPUT_FILES=("./datasets/input_1.txt" "./datasets/input_2.txt" "./datasets/input_3.txt")
PROCESSES=(1 2 4 6 12)
ALPHA=0.2
PLOT_FILE="performance_results.png"

# Function to display usage information
function show_usage {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -s, --student EXE     Path to student executable (default: $STUDENT_EXE)"
    echo "  -r, --reference EXE   Path to reference executable (default: $REFERENCE_EXE)"
    echo "  -i, --inputs FILES    Input files to test (space-separated, default: ${INPUT_FILES[*]})"
    echo "  -p, --processes PROCS Process counts to test (space-separated, default: ${PROCESSES[*]})"
    echo "  -a, --alpha VALUE     Alpha parameter for threshold (default: $ALPHA)"
    echo "  -o, --output FILE     Save performance plot to this file (default: $PLOT_FILE)"
    echo "  -h, --help            Show this help message"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--student)
            STUDENT_EXE="$2"
            shift 2
            ;;
        -r|--reference)
            REFERENCE_EXE="$2"
            shift 2
            ;;
        -i|--inputs)
            # Convert the argument to an array
            IFS=' ' read -r -a INPUT_FILES <<< "$2"
            shift 2
            ;;
        -p|--processes)
            # Convert the argument to an array
            IFS=' ' read -r -a PROCESSES <<< "$2"
            shift 2
            ;;
        -a|--alpha)
            ALPHA="$2"
            shift 2
            ;;
        -o|--output)
            PLOT_FILE="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            ;;
    esac
done

# Check if Python and required packages are installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

# Check if required Python packages are installed
REQUIRED_PACKAGES=("numpy" "matplotlib" "tabulate")
MISSING_PACKAGES=()

for package in "${REQUIRED_PACKAGES[@]}"; do
    if ! python3 -c "import $package" &> /dev/null; then
        MISSING_PACKAGES+=("$package")
    fi
done

if [ ${#MISSING_PACKAGES[@]} -gt 0 ]; then
    echo "Error: The following Python packages are required but not installed:"
    for package in "${MISSING_PACKAGES[@]}"; do
        echo "  - $package"
    done
    echo "Please install them using: pip install ${MISSING_PACKAGES[*]}"
    exit 1
fi

# Check if the executables exist
if [ ! -f "$STUDENT_EXE" ]; then
    echo "Error: Student executable '$STUDENT_EXE' not found."
    exit 1
fi

if [ ! -f "$REFERENCE_EXE" ]; then
    echo "Error: Reference executable '$REFERENCE_EXE' not found."
    exit 1
fi

# Check if the input files exist
for input_file in "${INPUT_FILES[@]}"; do
    if [ ! -f "$input_file" ]; then
        echo "Error: Input file '$input_file' not found."
        exit 1
    fi
done

# Convert arrays to space-separated strings for the Python script
INPUTS_STR=$(printf "%s " "${INPUT_FILES[@]}")
PROCESSES_STR=$(printf "%d " "${PROCESSES[@]}")

# Run the performance evaluator
echo "Running performance evaluation..."
python3 performance_evaluator.py \
    --student "$STUDENT_EXE" \
    --reference "$REFERENCE_EXE" \
    --inputs $INPUTS_STR \
    --processes $PROCESSES_STR \
    --alpha "$ALPHA" \
    --plot "$PLOT_FILE"

# Check if the evaluation was successful
if [ $? -eq 0 ]; then
    echo "Performance evaluation completed successfully."
    echo "Results plot saved to: $PLOT_FILE"
else
    echo "Performance evaluation failed."
    exit 1
fi 