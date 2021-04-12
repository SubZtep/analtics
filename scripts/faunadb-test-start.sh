#!/usr/bin/env bash

# Exit on error
set -euo pipefail

# Db name
DB_NAME="${1:-testdb}"

# Test requirements
DOCKER_VERSION=$(docker --version)
echo "Docker: ${DOCKER_VERSION}"
FAUNA_SHELL_VERSION=$(fauna --version)
echo "Fauna Shell: ${FAUNA_SHELL_VERSION}"

# Run Fauna
docker pull fauna/faunadb
docker run -d --rm --name faunadb --health-cmd="faunadb-admin status" --health-interval=2s -p 8443:8443 -p 8084:8084 fauna/faunadb
./scripts/wait-for-healthy-container.sh faunadb 30

# Configure
echo y | fauna add-endpoint http://localhost:8443/ --alias localhost --key secret
fauna create-database ${DB_NAME} --endpoint=localhost

# Create key
fauna create-key ${DB_NAME} --endpoint=localhost
FAUNADB_KEY="$(fauna create-key ${DB_NAME} --endpoint=localhost | grep secret: | cut -d " " -f 4)"
echo "FaunaDB key for ${DB_NAME} is ${FAUNADB_KEY}"

# Import schema
curl -u ${FAUNADB_KEY}: http://localhost:8084/import --data-binary "@types/schema.gql"

TEST_ENV=".env.test"

# Create test .env file
echo "GRAPHQL_URL=http://localhost:8084/graphql" > ${TEST_ENV}
echo "GRAPHQL_SECRET=${FAUNADB_KEY}" >> ${TEST_ENV}

# Create test account
ACCOUNT=$(vr new-test-account)
echo "ACCOUNT=${ACCOUNT}" >> ${TEST_ENV}
