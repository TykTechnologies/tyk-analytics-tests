#!/usr/bin/env bash
set -euo pipefail

dash_creds=/develop/confs/credentials/dashboard.json
tyk_args=(--debug --httpprofile)

if [ -f "$dash_creds" ]; then
  # Fold values from the dashboard credentials file into a temporary tyk.conf
  sed "s/{ORGID}/$(jq -r .org_id "$dash_creds")/" /develop/confs/tyk.conf \
    | sed "s/{APIKEY}/$(jq -r .user_code "$dash_creds")/" \
    | tee /tmp/tyk.conf

  tyk_args+=("--conf=/tmp/tyk.conf")
else
  # Ignore the dashboard credentials file and use the boilerplate config
  tyk_args+=("--conf=/opt/tyk-gateway/tyk.conf")
fi

echo "Installing Tyk..."
cd /develop/go/src/github.com/TykTechnologies/tyk
go install

echo "Running Tyk with following arguments:"
echo "${tyk_args[@]}"

"${GOPATH:-}/bin/tyk" "${tyk_args[@]}"