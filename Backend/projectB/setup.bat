echo off
set PATH=%PATH%;C:\Program Files\PostgreSQL\11\bin;C:\Program Files\PostgreSQL\11\lib
set /p PGPASSWORD=Please enter your postgres superuser password:
cd ..
psql -U postgres -f "%~dp0\projectB\dbinit.sql"
python %~dp0manage.py makemigrations
python %~dp0manage.py migrate
psql -U postgres -d "VMADB" -c "INSERT INTO \"VMA_company\" VALUES (0, 'VMADefault', 'VMA Dev', 1, 0);"
psql -U postgres -d "VMADB" -c "INSERT INTO \"VMA_user\" VALUES (NULL, 'admin', 'Password!', 'Default', 'Admin', 'example@email.com', NULL, True, 0);"
psql -U postgres -d "VMADB" -c "INSERT INTO \"VMA_perms\" VALUES (0, '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', 'admin');"
psql -U postgres -d "VMADB" -c "SELECT * FROM \"VMA_user\";"
psql -U postgres -d "VMADB" -c "SELECT * FROM \"VMA_company\";"
psql -U postgres -d "VMADB" -c "SELECT * FROM \"VMA_perms\";"
set /p delExit=Press the ENTER key to exit...: