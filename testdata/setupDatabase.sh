#!/bin/bash -x

psql -c "CREATE ROLE jsonapi WITH LOGIN CREATEDB PASSWORD 'jsonapi';" postgres
psql -c "DROP DATABASE IF EXISTS jsonapi;" postgres
psql -c "CREATE DATABASE jsonapi;" postgres
