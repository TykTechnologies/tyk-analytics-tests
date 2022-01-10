#!/usr/bin/env bash
set -euo pipefail

tyk_args=(--debug --httpprofile)

tyk_args+=("--conf=/opt/tyk-gateway/tyk.conf")

echo "Installing Tyk..."
# echo "in entrypoint '${GW_REPO_PATH}'"
cd /opt/tyk-gateway
ls
go install

echo "Running Tyk with following arguments:"
echo "${tyk_args[@]}"

"${GOPATH:-}/bin/tyk" "${tyk_args[@]}"