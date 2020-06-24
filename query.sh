#docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_user\" VALUES (NULL, 'Tofu', 'pbkdf2_sha256$150000$k7YI3yULz8Ue$B4YpwvsLtLbono+k6V9tR0Pamr4zq+mTBfZfP60ZlYY=', 'Default', 'Admin', 'burnervmafrontend@gmail.com', NULL, True, 0);"
#docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "SELECT * FROM  \"VMA_user\";"
#docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "SELECT password FROM  \"VMA_user\";
#docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "\dt";
#docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_user\" VALUES (NULL, 'tofu', 'B4YpwvsLtLbono+k6V9tR0Pamr4zq+mTBfZfP60ZlYY=', 'Tofu', 'Warrior','burnervmafrontend@gmail.com', NULL, True, 0);"
#docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_perms\" VALUES (0, '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', '{true, true, true, true, true}', 'admin');"
docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "SELECT * FROM \"VMA_user\";"
docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "SELECT * FROM \"VMA_asset\";"
docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "SELECT * FROM \"VMA_vulnerability\";"
#docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "SELECT * FROM \"VMA_company\";"
#docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "SELECT * FROM \"VMA_asset\";"
#docker exec -it VMA_postgres psql -U vmaclientman -d VMADB -c "INSERT INTO \"VMA_asset\" VALUES (1, 'testasset', 'descript', 'Product', '2', 'feature', 'host', 'domain', 'mac', 'history', 'VH', 'dept', '10', 'OS', '0', 'bunny')";

