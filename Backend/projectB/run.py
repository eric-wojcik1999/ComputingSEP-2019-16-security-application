import subprocess
import os
import sys

try:  # Get the 'ipconfig' or 'ifconfig' output
    networks = subprocess.check_output(['ifconfig']).split(b'\n')
    env = 1
except FileNotFoundError:
    networks = subprocess.check_output(['ipconfig']).split(b'\r\n\r\n')
    env = 2

port = "8000"  # Set the port as 8000 by default
if len(sys.argv) > 1:
    port = sys.argv[1]  # Or use the port number given as the argument

for net in networks:
    try:
        if env == 2:  # Windows
            ips = net.split(b'\r\n')  # Extract the IP addresses
            for line in ips:  # Determine ipv4 address
                if 'IPv4 Address' in line.decode():
                    ip = line.decode().split(': ')[1]
                    if ip != "127.0.0.1":
                        print("* Trying to run server at http://%s:%s/\n" % (ip, port))
                        os.system("python %smanage.py runserver %s:%s" % (os.path.realpath(__file__).strip('run.py'), ip, port))  # Run the command to start the server

        elif env == 1:  # Unix
            ip = net.strip().split(b'inet addr:')[1].strip().split(b' ')[0]  # Extract the IP address
            if ip != "127.0.0.1":
                print("* Trying to run server at http://%s:%s/\n" % (ip, port))
                os.system("python manage.py runserver %s:%s" % (os.path.realpath(__file__).strip('run.py'), ip, port))  # Run the command to start the server

    except IndexError:
        continue
