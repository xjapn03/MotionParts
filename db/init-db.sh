#!/bin/bash
echo "Restaurando backup..."
psql -U postgres -d motionparts -f /docker-entrypoint-initdb.d/motionparts.sql
echo "Backup restaurado correctamente."
