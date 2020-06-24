from VMA.serializers import VulnSerializer, ServiceSerializer
from VMA.findHost import *
from VMA.models import Asset, Company, Vulnerability
from datetime import datetime
import json


def build_vulns(file_type, company, temp_vulns=[]):

    response = ""

    counter = 0
    duplicate = 0
    for currentVuln in temp_vulns:  # Loop for all vulnerabilities
        # print('Converting: ', i, 'name = ', currentVuln.name)
        # i = i + 1
        validated_data = assemble(currentVuln, file_type, company)  # Need to build the data first
        nameSet = validated_data['name']
        dateDis = validated_data['dateDiscovered']

        dateDis_obj = datetime.strptime(dateDis, '%Y-%m-%d')

        vulnerabilityName = Vulnerability.objects.filter(name=nameSet).values('name', 'vulnID',
                                                                              'dateDiscovered', 'dateResolved',
                                                                              'status')

        if not vulnerabilityName:
           adding = True

        else:
            for vulns in vulnerabilityName:

                dateRes = vulns['dateResolved']

                # print(type(dateRes))

                if dateRes != None:

                    if type(dateRes) != str:
                        dateRes = str(dateRes)

                    dateRes_obj = datetime.strptime(dateRes, '%Y-%m-%d')

                    if vulns['status'] == 'M' and dateDis_obj > dateRes_obj:
                        adding = True

                    else:
                        adding = False
                else:
                    adding = False

        if adding == True:
            serializer = VulnSerializer(data=validated_data)  # Serialise the data to add to database
            serializer.is_valid(validated_data)  # required to save the data
            serializer.save()
            counter = counter + 1

        elif adding == False:
            duplicate = duplicate + 1

    vulnCounter = '{"added_vulns": "'+str(counter)
    response = response + vulnCounter

    duplicateCounter = '","duplicates": "'+str(duplicate)+'"}'
    response = response + duplicateCounter

    # response = json.dumps(response) just in case need to check it can be converted to json
    # print(type(response))
    # print(response)

    return response


# This converts the vuln into validated data which is the proper format for the serializer
# currently only working for zap
def assemble(vuln, file_type, company):
    # General Section
    actionPlan = ''
    status = 'U'
    name = chop_string(vuln.vulnName, 256)  # Make sure it does not exceed limits
    solution = str(vuln.solution)
    reference = str(vuln.ref)
    mac = None
    asset_name = 'Created Automatically'
    domain = None
    # ZAP Section
    if file_type == 'ZAP':  # Zap specific
        date = convert_zap_date(vuln.date)
        domain = vuln.hostName
        vuln.hostName = vuln.host
        vuln.host = None
        assetID = find_host_domain_name(domain, vuln.hostName, company)  # Find Host
        severity = scale_score(0, 4, vuln.severity)
        kwargs = {'Affected Port: ': vuln.port, '\nUsing SSL: ': vuln.ssl,
                  '\nPath: ': vuln.path, 'ZAP ID: ': vuln.vulnID, '\n': vuln.desc}
        description = add_strings(**kwargs)  # check none of these are null and add them.
        scanType = 'Z'
        cvssScore = None
        asset_name = vuln.hostName

    # Nessus Section
    if file_type == 'Nes':  # Nessus specific
        date = convert_nes_date(vuln.date)
        mac = vuln.hostName
        asset_name = 'Created by Nessus'
        assetID = find_host_ip_mac(vuln.host, vuln.hostName, company)  # Find Host
        scanType = 'Nes'
        severity = scale_score(0, 4, vuln.severity)
        if vuln.port == '0':
            vuln.port = None
        kwargs = {'Affected Port: ': vuln.port, '\nNessus Plugin ID: ': vuln.vulnID, '\n': vuln.desc}
        description = add_strings(**kwargs)  # check none of these are null and add them.
        cvssScore = check_cvss(vuln.cvss)

    # Nexpose Section
    if file_type == 'Nex':  # Nexpose specific
        date = convert_nex_date(vuln.date)
        mac = nexpose_mac(vuln.hostName)  # Convert mac address into the correct format MM:MM:MM:MM:MM:MM
        asset_name = 'Created by Nexpose'
        assetID = find_host_ip_mac(vuln.host, mac, company)  # Find Host
        scanType = 'Nex'
        description = array_to_string(vuln.desc)
        kwargs = {'Nexpose ID: ': vuln.vulnID, '\n': description}
        description = add_strings(**kwargs)  # check none of these are null and add them.
        solution = array_to_string(vuln.solution)
        reference = array_to_string(vuln.ref)
        severity = scale_score(0, 10, vuln.severity)
        cvssScore = check_cvss(vuln.cvss)

    if assetID == -1:
        ass = Asset.objects.create(name=asset_name, desc='Created Automatically', type='AUTO', company=Company.objects.get(pk=company), features='Autocreated', host_address=vuln.host, domain=domain, mac_address=mac, hist_data='Created Automatically', est_worth=-1);
        assetID = ass.pk

    if assetID == -2:
        # This shouldn't be able to happen if we have duplication prevention.
        print('things broken REALLY BAD')
        print('Duplicate Assets')

    # Data Assembly
    data = {
        'name': name,
        'description': description,
        'severity': severity,
        'dateDiscovered': date,
        'dateModified': date,
        'dateResolved': None,
        'actionPlan': actionPlan,
        'solution': solution,
        'assetID': assetID,
        'status': status,
        'scanType': scanType,
        'reference': reference,
        'cvssScore': cvssScore,
    }
    return data


# Takes a date in the format "Fri, 29 Mar 2019 21:02:52"
# Converts it into 2019-3-29 which is proper django format
def convert_zap_date(date):  # Fri, 29 Mar 2019 21:02:52
    months = dict(Jan='1', Feb='2', Mar='3', Apr='4', May='5', Jun='6', Jul='7',
                  Aug='8', Sep='9', Oct='10', Nov='11', Dec=12)
    big_split = date.split(" ")
    day = big_split[1]
    month_word = big_split[2]
    month_date = months.get(month_word)
    year = big_split[3]
    format_date = year + '-' + month_date + '-' + day
    return format_date


# Takes a date in the format "20160218T203218272"
# Converts into 2016-02-18
def convert_nex_date(date):
    halves = date.split('T')
    date_part = halves[0]
    year = date_part[0:4]
    month_date = date_part[4:6]
    day = date_part[6:8]
    format_date = year + '-' + month_date + '-' + day
    return format_date


# Takes a date in the format: Mon Jul  1 11:33:11 2013
# Converts into 2013-07-1
def convert_nes_date(date):
    months = dict(Jan='1', Feb='2', Mar='3', Apr='4', May='5', Jun='6', Jul='7',
                  Aug='8', Sep='9', Oct='10', Nov='11', Dec=12)
    big_split = date.split(' ')
    day = big_split[3]
    month_word = big_split[1]
    year = big_split[5]
    month_date = months.get(month_word)
    format_date = year + '-' + month_date + '-' + day
    return format_date


# Scales a threat score from the range in the application to our range
def scale_score(lower,upper,score):
    factor = float(100)/float(upper)
    scaled_value = float(score)*factor
    return int(scaled_value)


# Check cvss
# if its not a valid CVSS score just sets it to None
def check_cvss(cvss):
    try:
        score = float(cvss)
        if not 10.0 > score > 1.0:
            score = None
    except (TypeError, ValueError) as e:
        score = None
    return score


# Chop String
# Restricts a string to max length if it exceeds it
def chop_string(string, limit):
    if len(string) > limit:
        string = string[0:limit]
    return string


# Checks a string is not None before adding to the description.
def add_strings(**kwargs):
    string = ''
    if kwargs is not None:
        for message, value in kwargs.items():
            if value is not None:
                string = string + message + value
    return string


# Converts string arrays into a single string
def array_to_string(array):
    final = ''
    for x in array:
        if x is not None:
            final = final + x + '\n'
    return final


# Converts nexpose mac format to standard
def nexpose_mac(nex_mac):
    mac = nex_mac[0:2] + ':' + nex_mac[2:4] + ':' + nex_mac[4:6] + ':' + nex_mac[6:8] \
          + ':' + nex_mac[8:10] + ':' + nex_mac[10:12]
    return mac


def build_services(company, temp_serv=[]):  # Converts array of services and serializes them.
    for currentServ in temp_serv:  # Loop for all services
        validated_data = assemble_service(currentServ, company)  # Need to build the data first
        serializer = ServiceSerializer(data=validated_data)  # Serialise the data to add to database
        serializer.is_valid(validated_data)  # required to save the data
        serializer.save()


def assemble_service(service, company):  # Converts a TempServices into Validated_data
    protocol = service.protocol  # protocol = either TCP or UDP
    port = service.portNo  # portNo = port’s number (80, 443 etc)
    name = service.serviceName  # serviceName = name of the service running if applicable
    prod = chop_string(str(service.serviceProduct), 256)
    # serviceProduct = What service is running
    version = service.serviceVersion  # serviceVersion = version of the service if applicable
    kwargs = {'Version: ': version, '\nService: ': name, '\nProtocol: ': protocol}
    desc = add_strings(**kwargs)  # General description information
    assetID = find_host_ip_name(service.ip, service.hostName, company)  # Find out host.
    if assetID == -1:
        ass = Asset.objects.create(name=service.hostName, desc='Created Automatically', type='AUTO', company=Company.objects.get(pk=company), features='Autocreated', host_address=service.ip, hist_data='Created Automatically', est_worth=-1);
        assetID = ass.pk

    if assetID == -2:
        # This shouldn't be able to happen if we have duplication prevention.
        print('things broken REALLY BAD')
        print('Duplicate Assets')
    data = {
        'port': port,
        'service': prod,
        'description': desc,
        'assetID': assetID,
    }
    return data
