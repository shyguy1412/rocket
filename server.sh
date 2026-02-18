#! /bin/env bash
docker run --network host --name spacebar_db -e POSTGRES_PASSWORD=pass -d postgres
docker start spacebar_db
cd spacebar_server
npm run build
DATABASE=postgres://postgres:pass@localhost:5432/postgres CONFIG_PATH=../spacebar_config.json npm run start