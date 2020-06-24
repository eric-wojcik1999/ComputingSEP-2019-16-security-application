#!/bin/bash
PGPASSWORD="ENTERYOURPASSWORDHEREthisisnotthepassword"
DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
psql -U postgres -f "$DIR/projectB/dbinit.sql"
python3 "$DIR"/manage.py makemigrations
python3 "$DIR"/manage.py migrate

sudo -u postgres psql -U postgres -d "vmadb" -c "INSERT INTO \"VMA_company\" VALUES (0, 'VMADefault', 'VMA Dev', 1, 0);"
sudo -u postgres psql -U postgres -d "vmadb" -c "INSERT INTO \"VMA_user\" VALUES (NULL, 'admin', 'Password!', 'Default', 'Admin', 'example@email.com', NULL, True, 0);"
sudo -u postgres psql -U postgres -d "vmadb" -c "INSERT INTO \"VMA_perms\" VALUES (0, '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', 'admin');"
sudo -u postgres psql -U postgres -d "vmadb" -c "SELECT * FROM \"VMA_user\";"

echo $PGPASSWORD