#!/bin/bash
echo "Restaurando backup..."
pg_restore -U postgres -d motionParts /docker-entrypoint-initdb.d/backup.dump
echo "Backup restaurado correctamente."
