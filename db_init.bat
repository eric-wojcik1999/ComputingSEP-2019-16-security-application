@echo off
set PGPASSWORD=vmaIsAmazingTechnologyThanksEric
docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_company\" VALUES (0, 'VMADefault', 'VMA Dev', 1, 0);"
<<<<<<< HEAD
docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_user\" VALUES (NULL, 'admin', 'pbkdf2_sha256$150000$k7YI3yULz8Ue$93Pg1khbiGQJQkSfrq5qTzZQzzRALYqO/KFDP9dRd8k=', 'Default', 'Admin', 'carleton@w578.com', NULL, True, 0);"
docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_perms\" VALUES (0, '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', 'admin');"
docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_user\" VALUES (NULL, 'test', 'pbkdf2_sha256$150000$U6c564h7DJGr$1vMg6QlIG2eLck4HiL1L0mSQ8AnqHQESkB+Lr45kvrA=', 'Please', 'Work', 'mail@mail.com', NULL, True, 0);"
docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_perms\" VALUES (1, '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', 'test');"
=======
docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_user\" VALUES (NULL, 'admin', 'pbkdf2_sha256$150000$k7YI3yULz8Ue$93Pg1khbiGQJQkSfrq5qTzZQzzRALYqO/KFDP9dRd8k=', 'Default', 'Admin', 'example@email.com', NULL, True, 0);"
docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_perms\" VALUES (0, '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', 'admin');"
>>>>>>> ChrisDevelopment
