def valid_import_service(service):
    is_valid = True
    fail_count = 0
    if service.serviceProduct is None:
        fail_count += 1
    if not valid_ip(service.ip):  # IP address validation
        fail_count += 1
    if not valid_int(service.portNo, 0, 65535):
        fail_count += 1
    if fail_count > 0:
        is_valid = False
    return is_valid


def valid_import_vuln_zap(vuln):
    is_valid = True
    fail_count = 0
    # NO IP address on Zap, as the scans use URLS instead.
    vuln.hostName  # name
    if not valid_int(vuln.port, 0, 65535):
        fail_count += 1
    vuln.ssl  # No validation
    vuln.vulnID  # Should i validate?
    if vuln.vulnName is None or vuln.vulnName == '':  # Has to have a name
        fail_count += 1
    if not valid_int(vuln.severity, 0, 4):
        fail_count += 1
    vuln.desc  # No validation
    vuln.path  # No validation
    vuln.solution  # No validation
    vuln.ref  # No validation
    if not valid_date_zap(vuln.date):
        fail_count += 1
    if fail_count > 0:
        is_valid = False
    return is_valid


def valid_import_vuln_nes(vuln):
    is_valid = True
    fail_count = 0
    if not valid_ip(vuln.host):  # IP address validation
        fail_count += 1
    if not string_length_check(vuln.hostName, 17):  # 00:50:56:81:01:e3
        fail_count += 1
    if not valid_int(vuln.port, 0, 65535):
        fail_count += 1
    vuln.ssl  # No validation
    vuln.vulnID  # Should i validate?
    if vuln.vulnName is None or vuln.vulnName == '':  # Has to have a name
        fail_count += 1
    if not valid_int(vuln.severity, 0, 4):
        fail_count += 1
    vuln.desc  # No validation
    vuln.path  # No validation
    vuln.solution  # No validation
    vuln.ref  # No validation
    if not valid_date_nes(vuln.date):
        fail_count += 1
    if fail_count > 0:
        is_valid = False
    return is_valid


def valid_import_vuln_nex(vuln):
    is_valid = True
    fail_count = 0
    if not valid_ip(vuln.host):  # IP address validation
        fail_count += 1
    if not string_length_check(vuln.hostName, 12):  # 00:50:56:81:01:e3
        fail_count += 1
    vuln.ssl  # No validation
    vuln.vulnID  # Should i validate?
    if vuln.vulnName is None or vuln.vulnName == '':  # Has to have a name
        fail_count += 1
    if not valid_int(vuln.severity, 0, 10):
        fail_count += 1
    vuln.desc  # No validation
    vuln.path  # No validation
    vuln.solution  # No validation
    vuln.ref  # No validation
    if not valid_date_nex(vuln.date):
        fail_count += 1
    if fail_count > 0:
        is_valid = False
    return is_valid


# Checks to see if a string is as long as it should be, for MAC address
def string_length_check(string, length):
    is_valid = False
    #print(string)
    if string is not None:
        if len(string) == length:
            is_valid = True
    return is_valid


# Checks to see if an int is within the required range
# Or if even an int
def valid_int(value, lower, upper):
    is_valid = False
    if value is not None:
        if value.isdigit():  # First check its actually a positive int

            if lower <= int(value) <= upper: # if its within boundaries
                is_valid = True
    return is_valid


# Checks for a valid IP address
# Hoping this works for both IPv4 and IPv6
def valid_ip(IP):
    is_valid = False
    # IPv4 19.117.63.126
    # IPv6 2001:0db8:85a3:0000:0000:8a2e:0370:7334
    if IP is not None:
        check4 = IP.split('.')
        check6 = IP.split(':')
        if len(check4) == 4:  # Check if its a valid IPv4
            is_valid = True
            for i in check4:
                is_valid = is_valid and valid_int(i, 0, 255)
        if len(check6) == 8:  # Check if its a valid IPv6
            is_valid = True
            for x in check6:
                for i in x:
                    if i.isdigit():
                        if 0 <= int(i) <= 9:
                            is_valid = is_valid and True
                        else:
                            is_valid = is_valid and False
                    else:
                        if ord('a') <= ord(i) <= ord('f') or ord('A') <= ord(i) <= ord('F'):
                            is_valid = is_valid and True
                        else:
                            is_valid = is_valid and False
    return is_valid


# Takes a date in the format "Fri, 29 Mar 2019 21:02:52"
# For zap
def valid_date_zap(date):
    is_valid = True
    months = dict(Jan='1', Feb='2', Mar='3', Apr='4', May='5', Jun='6', Jul='7',
                  Aug='8', Sep='9', Oct='10', Nov='11', Dec=12)
    if date is None:
        is_valid = False
    else:
        bigSplit = date.split(" ")
        if len(bigSplit) < 4:
            is_valid = False
        else:
            day = bigSplit[1]
            year = bigSplit[3]
            if day.isdigit() and year.isdigit():
                if int(day) < 1 or int(day) > 31:
                    is_valid = False
                month_word = bigSplit[2]
                month_date = months.get(month_word)
                if month_date is None:
                    is_valid = False
            else:
                is_valid = False
    return is_valid


# Checks a date in the format 20160218T203218272'
# For nexpose
def valid_date_nex(date):
    is_valid = True
    if date is None:
        is_valid = False
    else:
        halves = date.split('T')
        if len(halves) != 2:
            is_valid = False
        else:
            if len(halves[0]) < 8:
                is_valid = False
            else:
                date_part = halves[0]
                year = date_part[0:4]
                month_date = date_part[4:6]
                day = date_part[6:8]
                if month_date.isdigit() and day.isdigit() and year.isdigit():
                    if int(month_date) > 12 or int(month_date) < 1:
                        is_valid = False
                    if int(day) > 31 or int(day) < 1:
                        is_valid = False
                else:
                    is_valid = False
    return is_valid


# Checks for a date in the format: 'Mon Jul  1 11:33:11 2013'
# For nessus
def valid_date_nes(date):
    is_valid = True
    months = dict(Jan='1', Feb='2', Mar='3', Apr='4', May='5', Jun='6', Jul='7',
                  Aug='8', Sep='9', Oct='10', Nov='11', Dec=12)
    if date is None:
        is_valid = False
    else:
        big_split = date.split(' ')
        if len(big_split) < 6:
            is_valid = False
        else:
            day = big_split[3]
            month_word = big_split[1]
            year = big_split[5]
            if day.isdigit() and year.isdigit():
                month_date = months.get(month_word)
                if month_date is None:
                    is_valid = False
                if int(day) > 31 or int(day) < 1:
                    is_valid = False
            else:
                is_valid = False
    return is_valid
