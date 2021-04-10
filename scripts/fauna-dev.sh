#!/usr/bin/env bash

docker pull fauna/faunadb:latest
#docker pull fauna/faunadb
#docker container stop faunadb || true && docker container rm faunadb || true
docker run -d --rm --name faunadb -p 8443:8443 fauna/faunadb
#docker run --name faunadb -d \
#  --health-cmd="faunadb-admin status" --health-interval=2s \
#  -p 8443:8443 \
#  -p 8084:8084 \
#  fauna/faunadb



./scripts/wait-for-healthy.sh faunadb 30

echo n | fauna add-endpoint http://localhost:8443/ --alias localhost --key secret
fauna create-database db_name --endpoint=localhost
OUTPUT=$(fauna create-key db_name --endpoint=localhost)

#echo "${OUTPUT}"

[[ "${OUTPUT}" =~ secret\:[[:space:]]([A-Za-z0-9_\-]+) ]]

#SECRET="${BASH_REMATCH[1]}"
#echo "Secret is ${SECRET}"

#curl -u ${SECRET}: http://localhost:8084/import --data-binary "./types/schema.gql"
curl -u secret:secret:5ceb10ebc9e4709e4cfe218965d1a388a67e235aa8a22bfa006402e518b2d016 http://localhost:8084/import --data-binary "./types/schema.gql"

# echo "FAUNADB_SECRET=${SECRET}
# GRAPHQL_ENDPOINT=http://localhost:8084/graphql" > ".env.test";
