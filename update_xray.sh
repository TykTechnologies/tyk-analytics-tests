echo "Sending update of test execution to Xray"
if [ "$STATUS" == "success" ]; then
    RESULT="PASSED"
else
    RESULT="FAILED"
fi
echo "Checking branch: $BRANCH"
if [ "$BRANCH" == "refs/heads/master" ]; then
    EXECUTION=QA-894
fi
if [ "$BRANCH" == "refs/heads/release-4.0.2" ]; then
    EXECUTION=QA-902
fi
if [ "$BRANCH" == "refs/heads/release-4" ]; then
    EXECUTION=QA-903
fi
if [ "$BRANCH" == "refs/heads/release-4-lts" ]; then
    EXECUTION=QA-904
fi

if [[ ! -z "$EXECUTION" ]]; then
    echo "Requesting Token"
    TOKEN=$(curl -H "Content-Type: application/json" -X POST --data "{ \"client_id\": \"$CLIENT_ID\",\"client_secret\": \"$CLIENT_SECRET\" }" https://xray.cloud.getxray.app/api/v2/authenticate| tr -d '"')
    echo "Sending update $RESULT on $TEST and execution $EXECUTION"
    curl -H "Authorization: Bearer $TOKEN" -X POST https://xray.cloud.getxray.app/api/v2/import/execution \
        -d '{"testExecutionKey":"'$EXECUTION'","tests":[{"testKey":"'$TEST'","status":"'$RESULT'"}]}' \
        -H 'Content-Type: application/json'
else
    echo "Branch $BRANCH is not specified for updated"
fi