#!/usr/bin/env bash
set -euo pipefail

echo "Tyk log level: '${TYK_LOGLEVEL:-}'"

src_dir=/develop/go/src
cd "$src_dir"

echo "Installing Tyk Dashboard..."
git config --global url."https://${TOKEN}@github.com".insteadOf "https://github.com"
go install

dashboard_args=("--conf=/opt/tyk-dashboard/tyk_analytics.conf")

# Required to work around the kingpin CLI parser used in tyk-analytics:
# https://github.com/TykTechnologies/tyk-analytics/blob/e554af201b/cli/cli.go#L49
if test -n "${TYK_ARG:-}"; then
  dashboard_args+=("$TYK_ARG")
fi

echo "Running Tyk Dashboard with following arguments:"
echo "${dashboard_args[@]}"

"${GOPATH}/bin/tyk-analytics" "${dashboard_args[@]}"