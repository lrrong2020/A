#!/usr/bin/env python3
"""
Performance Evaluator for MPI Universal Minimizer Implementation

This script evaluates the performance of a student's MPI implementation against
a reference solution based on the provided grading criteria.
"""

import argparse
import subprocess
import os
import time
import numpy as np
import matplotlib.pyplot as plt
from tabulate import tabulate

# Reference latencies for input_4.txt in csl2 machine (in seconds)
REFERENCE_LATENCIES = {
    1: 0.124,
    2: 0.067,
    4: 0.039,
    6: 0.030,
    12: 0.031  # oversubscribe
}

# Default alpha value
DEFAULT_ALPHA = 0.2

def run_mpi_program(executable, input_file, num_processes, num_runs=3):
    """
    Run the MPI program multiple times and return the minimum latency.
    
    Args:
        executable: Path to the MPI executable
        input_file: Path to the input file
        num_processes: Number of MPI processes to use
        num_runs: Number of times to run the program
    
    Returns:
        Minimum latency in seconds
    """
    latencies = []
    
    for _ in range(num_runs):
        cmd = ["mpiexec", "-n", str(num_processes), executable, input_file]
        start_time = time.time()
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            end_time = time.time()
            latency = end_time - start_time
            latencies.append(latency)
            print(f"Run completed in {latency:.3f} seconds")
        except subprocess.CalledProcessError as e:
            print(f"Error running MPI program: {e}")
            print(f"Stdout: {e.stdout}")
            print(f"Stderr: {e.stderr}")
            return None
    
    min_latency = min(latencies)
    print(f"Minimum latency for {num_processes} processes: {min_latency:.3f} seconds")
    return min_latency

def calculate_score(student_latency, reference_latency, alpha, max_points=40):
    """
    Calculate the performance score based on the grading criteria.
    
    Args:
        student_latency: Latency of the student's implementation
        reference_latency: Latency of the reference solution
        alpha: Alpha parameter for the threshold
        max_points: Maximum points for performance
    
    Returns:
        Score out of max_points
    """
    threshold = (1 + alpha) * reference_latency
    
    if student_latency <= threshold:
        # Full points if latency is below threshold
        return max_points
    elif student_latency <= 2 * threshold:
        # Reduced points if latency is between threshold and 2*threshold
        reduction_factor = student_latency / threshold - 1
        return max(0, max_points * (1 - reduction_factor))
    else:
        # No points if latency exceeds 2*threshold
        return 0

def evaluate_performance(student_executable, reference_executable, input_files, process_counts, alpha=DEFAULT_ALPHA):
    """
    Evaluate the performance of a student's MPI implementation against a reference solution.
    
    Args:
        student_executable: Path to the student's MPI executable
        reference_executable: Path to the reference MPI executable
        input_files: List of input files to test
        process_counts: List of process counts to test
        alpha: Alpha parameter for the threshold
    
    Returns:
        Dictionary with evaluation results
    """
    results = {
        'student_latencies': {},
        'reference_latencies': {},
        'scores': {},
        'total_score': 0,
        'max_score': 0
    }
    
    # For each input file and process count combination
    for input_file in input_files:
        results['student_latencies'][input_file] = {}
        results['reference_latencies'][input_file] = {}
        results['scores'][input_file] = {}
        
        for proc_count in process_counts:
            print(f"\nEvaluating {input_file} with {proc_count} processes:")
            
            # Run student's implementation
            print("Running student's implementation...")
            student_latency = run_mpi_program(student_executable, input_file, proc_count)
            
            # Run reference implementation
            print("Running reference implementation...")
            reference_latency = run_mpi_program(reference_executable, input_file, proc_count)
            
            # If we have valid latencies, calculate score
            if student_latency is not None and reference_latency is not None:
                score = calculate_score(student_latency, reference_latency, alpha)
                
                results['student_latencies'][input_file][proc_count] = student_latency
                results['reference_latencies'][input_file][proc_count] = reference_latency
                results['scores'][input_file][proc_count] = score
                
                results['total_score'] += score
                results['max_score'] += 40  # 40 points per test
            else:
                print("Skipping score calculation due to errors")
    
    return results

def plot_results(results, alpha, output_file=None):
    """
    Plot the performance comparison and save to a file.
    
    Args:
        results: Dictionary with evaluation results
        alpha: Alpha parameter used for evaluation
        output_file: Path to save the plot (optional)
    """
    num_input_files = len(results['student_latencies'])
    num_process_counts = len(next(iter(results['student_latencies'].values())))
    
    fig, axes = plt.subplots(num_input_files, 1, figsize=(10, 5 * num_input_files))
    if num_input_files == 1:
        axes = [axes]
    
    for i, (input_file, latencies) in enumerate(results['student_latencies'].items()):
        ax = axes[i]
        
        proc_counts = list(latencies.keys())
        student_lats = list(latencies.values())
        ref_lats = [results['reference_latencies'][input_file][p] for p in proc_counts]
        threshold_lats = [(1 + alpha) * lat for lat in ref_lats]
        double_threshold_lats = [2 * (1 + alpha) * lat for lat in ref_lats]
        
        x = np.arange(len(proc_counts))
        width = 0.2
        
        ax.bar(x - width, student_lats, width, label='Student')
        ax.bar(x, ref_lats, width, label='Reference')
        ax.bar(x + width, threshold_lats, width, label=f'(1+{alpha})×Reference')
        ax.bar(x + 2*width, double_threshold_lats, width, label=f'2×(1+{alpha})×Reference')
        
        ax.set_xlabel('Number of Processes')
        ax.set_ylabel('Latency (seconds)')
        ax.set_title(f'Performance Comparison for {input_file}')
        ax.set_xticks(x)
        ax.set_xticklabels(proc_counts)
        ax.legend()
        ax.grid(True, linestyle='--', alpha=0.7)
        
        # Add score annotations
        for j, p in enumerate(proc_counts):
            score = results['scores'][input_file][p]
            ax.annotate(f'{score:.1f} pts', 
                        xy=(j - width, student_lats[j]),
                        xytext=(0, 10), 
                        textcoords='offset points',
                        ha='center')
    
    plt.tight_layout()
    
    if output_file:
        plt.savefig(output_file)
        print(f"Plot saved to {output_file}")
    
    plt.show()

def print_results_table(results, alpha):
    """
    Print a formatted table of the evaluation results.
    
    Args:
        results: Dictionary with evaluation results
        alpha: Alpha parameter used for evaluation
    """
    headers = ["Input File", "Processes", "Student Latency", "Reference Latency", 
               f"Threshold ((1+{alpha})×Ref)", "Score"]
    
    table_data = []
    
    for input_file in results['student_latencies']:
        for proc_count in results['student_latencies'][input_file]:
            student_lat = results['student_latencies'][input_file][proc_count]
            ref_lat = results['reference_latencies'][input_file][proc_count]
            threshold = (1 + alpha) * ref_lat
            score = results['scores'][input_file][proc_count]
            
            table_data.append([
                input_file,
                proc_count,
                f"{student_lat:.3f}s",
                f"{ref_lat:.3f}s",
                f"{threshold:.3f}s",
                f"{score:.1f}/40"
            ])
    
    # Add total score row
    table_data.append([
        "TOTAL", "", "", "", "",
        f"{results['total_score']:.1f}/{results['max_score']}"
    ])
    
    print("\nPerformance Evaluation Results:")
    print(tabulate(table_data, headers=headers, tablefmt="grid"))
    
    # Calculate percentage
    percentage = (results['total_score'] / results['max_score']) * 100 if results['max_score'] > 0 else 0
    print(f"\nOverall Performance Score: {results['total_score']:.1f}/{results['max_score']} ({percentage:.1f}%)")

def main():
    parser = argparse.ArgumentParser(description='Evaluate MPI program performance')
    parser.add_argument('--student', required=True, help='Path to student executable')
    parser.add_argument('--reference', required=True, help='Path to reference executable')
    parser.add_argument('--inputs', required=True, nargs='+', help='Input files to test')
    parser.add_argument('--processes', type=int, nargs='+', default=[1, 2, 4, 6, 12], 
                        help='Number of processes to test (default: 1 2 4 6 12)')
    parser.add_argument('--alpha', type=float, default=DEFAULT_ALPHA, 
                        help=f'Alpha parameter for threshold (default: {DEFAULT_ALPHA})')
    parser.add_argument('--plot', help='Save performance plot to this file')
    
    args = parser.parse_args()
    
    # Check if executables exist
    if not os.path.isfile(args.student):
        print(f"Error: Student executable '{args.student}' not found")
        return
    
    if not os.path.isfile(args.reference):
        print(f"Error: Reference executable '{args.reference}' not found")
        return
    
    # Check if input files exist
    for input_file in args.inputs:
        if not os.path.isfile(input_file):
            print(f"Error: Input file '{input_file}' not found")
            return
    
    print(f"Starting performance evaluation with alpha={args.alpha}")
    print(f"Student executable: {args.student}")
    print(f"Reference executable: {args.reference}")
    print(f"Input files: {args.inputs}")
    print(f"Process counts: {args.processes}")
    
    # Run evaluation
    results = evaluate_performance(
        args.student,
        args.reference,
        args.inputs,
        args.processes,
        args.alpha
    )
    
    # Print results table
    print_results_table(results, args.alpha)
    
    # Plot results
    if args.plot:
        try:
            plot_results(results, args.alpha, args.plot)
        except Exception as e:
            print(f"Error creating plot: {e}")

if __name__ == "__main__":
    main() 