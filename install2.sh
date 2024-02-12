#!/bin/sh

# Installation Script

set -e

bin_dir="/usr/local/bin"
exe="$bin_dir/steampipe"

# Ensure necessary tools are available
if ! command -v tar >/dev/null; then
    echo "Error: 'tar' is required to install Steampipe." 1>&2
    exit 1
fi

if ! command -v gzip >/dev/null; then
    echo "Error: 'gzip' is required to install Steampipe." 1>&2
    exit 1
fi

if ! command -v install >/dev/null; then
    echo "Error: 'install' is required to install Steampipe." 1>&2
    exit 1
fi

# Check if Steampipe is already installed
if command -v steampipe >/dev/null; then
    # steampipe already exists
    status_out=$(steampipe service status --all | wc -l)
    if [ $? -ne 0 ]; then
        echo "Error: There was an issue fetching service status. Please re-run." 1>&2
        exit 1
    fi
    if [ $status_out -gt 1 ]; then
        echo "$(steampipe service status --all)"
        echo "Error: The above service(s) are running. Please stop them before running installation." 1>&2
        exit 1
    fi
fi

# ... (rest of the installation script)



echo "Steampipe was installed successfully to $exe"

if ! command -v $bin_dir/steampipe >/dev/null; then
    echo "Steampipe was installed, but could not be executed. Are you sure '$bin_dir/steampipe' has the necessary permissions?"
    exit 1
fi
