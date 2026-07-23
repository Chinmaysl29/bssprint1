import os
import subprocess

def run_script(script_path):
    print(f"Running {script_path}...")
    result = subprocess.run(['python', script_path], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running {script_path}:")
        print(result.stderr)
        return False
    print(result.stdout)
    return True

def main():
    scripts = [
        os.path.join('src', 'analytics', 'clustering.py'),
        os.path.join('src', 'analytics', 'cluster_profile.py'),
        os.path.join('src', 'analytics', 'outlier_detection.py'),
        os.path.join('src', 'analytics', 'portfolio_statistics.py')
    ]
    
    for script in scripts:
        if not run_script(script):
            print("Pipeline aborted due to error.")
            break
            
    print("Pipeline finished successfully.")

if __name__ == "__main__":
    main()
