#!/bin/bash

psql -c "CREATE ROLE jsonapi WITH LOGIN PASSWORD 'IpaNosj';" postgres
psql -c "DROP DATABASE IF EXISTS jsonapi;" postgres
psql -c "CREATE DATABASE jsonapi WITH OWNER jsonapi;" postgres
