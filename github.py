import subprocess
import json
import sys

# CONFIGURATION
EXPECTED_USER = "SRDdev"  # The account you WANT to see

def run_gh_command(args):
    """Helper to run gh commands and return the JSON output."""
    try:
        # Run the gh command
        result = subprocess.run(
            ["gh"] + args, 
            capture_output=True, 
            text=True, 
            check=True
        )
        return json.loads(result.stdout)
        
    except subprocess.CalledProcessError as e:
        error_msg = e.stderr.strip()
        print(f"\n[!] Error running command: gh {' '.join(args)}")
        print(f"    Details: {error_msg}")
        sys.exit(1)
    except FileNotFoundError:
        print("\n[!] Error: The 'gh' command was not found.")
        sys.exit(1)

def main():
    print("Connecting to GitHub CLI...")

    # 1. Fetch User Information
    user_info = run_gh_command(["api", "user"])
    
    current_login = user_info.get('login')
    user_id = user_info.get('id')
    user_name = user_info.get('name')
    
    print("\n" + "="*45)
    print(" GITHUB ACCOUNT INFO")
    print("="*45)
    print(f"Current User : {current_login}")
    print(f"User ID      : {user_id}")
    print(f"Profile URL  : {user_info.get('html_url')}")
    
    # CHECK: Are we the right user?
    if current_login.lower() != EXPECTED_USER.lower():
        print("-" * 45)
        print(f"⚠️  WARNING: You are logged in as '{current_login}'.")
        print(f"    You requested repos for '{EXPECTED_USER}'.")
        print(f"    To fix this, run this command in your terminal:")
        print(f"    >> gh auth login")
        print("-" * 45)
        
        # Ask user if they want to proceed anyway
        choice = input(f"Do you want to list repos for '{current_login}' anyway? (y/n): ")
        if choice.lower() != 'y':
            print("Exiting.")
            sys.exit(0)

    print("-" * 45)

    # 2. Fetch Repositories
    # Fixed: Changed 'html_url' to 'url'
    print(f"\nFetching repositories for '{current_login}'...\n")
    
    repos = run_gh_command([
        "repo", "list", 
        "--limit", "1000", 
        "--json", "name,visibility,url,sshUrl" 
    ])

    # 3. Print Table
    # Added SSH URL column since you use SSH
    header = f"{'NAME':<30} | {'VISIBILITY':<10} | {'SSH URL'}"
    print(header)
    print("-" * len(header))
    
    public_count = 0
    private_count = 0

    for repo in repos:
        name = repo['name']
        visibility = repo['visibility'].upper()
        # We prefer showing the SSH URL since you are an SSH user
        url = repo.get('sshUrl', repo.get('url'))
        
        print(f"{name:<30} | {visibility:<10} | {url}")

        if visibility == "PUBLIC":
            public_count += 1
        else:
            private_count += 1

    print("-" * len(header))
    print(f"Total: {len(repos)} (Public: {public_count}, Private: {private_count})")

if __name__ == "__main__":
    main()