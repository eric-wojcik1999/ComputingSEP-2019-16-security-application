import xml.etree.ElementTree as ET
from VMA.TempVulnerability import TempVulnerability, TempServices
from rest_framework.response import Response
from django.http import JsonResponse
from VMA.arrayConverter import build_vulns, build_services
from VMA.validation import valid_import_vuln_zap, valid_import_vuln_nes, valid_import_vuln_nex, valid_import_service
import csv
from datetime import datetime

"""
The functions takes in an UploadedFile Class Object. Which inherits from FILE
it will read the uploaded file sent from the front end and parse it depending on which file is uploaded.
It will return a Response Accepted or Bad Request
This is where all the last line of defense for error handling will happen.
"""

def fileHandlerCSV(file, request):

    """
    This is a dynamic a CSV file reader.
    It will scan through the rows available and count them to assign them to a variable
    """

    filepath = file.temporary_file_path()

    company = request.user.company.pk

    listVuln = []
    bad_vuln = []
    array = []

    # The counters for the dynamic reader

    counter = 0 - 1
    hostAddress_counter = 0 - 1
    hostName_counter = 0 - 1
    port_counter = 0 - 1
    ssl = 'none'
    vulnID_counter = 0 - 1
    vulnName_counter = 0 - 1
    severity_counter = 0 - 1
    desc_counter = 0 - 1
    path = 'none'
    sol_counter = 0 - 1
    ref_counter = 0 - 1
    date_counter = 0 - 1
    cvss_counter = 0 - 1

    nexposeTrigger = False
    nessusTrigger = False


    with open(filepath) as file:
        readCSV = csv.reader(file, delimiter=',')
        for row in readCSV:
            for elements in row:
                counter = counter + 1
                if elements == 'Host':
                    hostAddress_counter = counter
                    nessusTrigger = True

                elif elements == 'Asset IP Address':
                    hostAddress_counter = counter
                    nexposeTrigger = True

                if hostName_counter == 'MAC Address':
                    hostName_counter = counter
                elif elements == 'Asset MAC Addresses':
                    hostName_counter = counter

                if elements == 'Port':
                    port_counter = counter
                elif elements == 'Service Port':
                    port_counter = counter

                if elements == 'Plugin ID':
                    vulnID_counter = counter
                elif elements == 'Vulnerability ID':
                    vulnID_counter = counter

                if elements == 'Name':
                    vulnName_counter = counter
                elif elements == 'Vulnerability Title':
                    vulnName_counter = counter

                if elements == 'Risk':
                    severity_counter = counter
                elif elements == 'Vulnerability Severity Level':
                    severity_counter = counter

                if elements == 'Description':
                    desc_counter = counter
                elif elements == 'Vulnerability Description':
                    desc_counter = counter

                if elements == 'Solution':
                    sol_counter = counter
                elif elements == 'Vulnerability Solution':
                    sol_counter = counter

                if elements == 'See Also':
                    ref_counter = counter
                elif elements == 'Vulnerability CVE IDs':
                    ref_counter = counter

                if elements == 'Date':
                    date_counter = counter

                if elements == 'CVSS':
                    cvss_counter = counter
                elif elements == 'Vulnerability CVSS Score':
                    cvss_counter = counter

            if nessusTrigger or nexposeTrigger == True:
                if hostAddress_counter > -1:
                    hostAddress = row[hostAddress_counter]
                else:
                    hostAddress = 'none'

                if hostName_counter > -1:
                    hostName = row[hostName_counter]
                else:
                    hostName = 'none'

                if port_counter > -1:
                    port = row[port_counter]
                else:
                    port = 'none'

                if vulnID_counter > -1:
                    vulnID = row[vulnID_counter]
                else:
                    vulnID = 'none'

                if vulnName_counter > -1:
                    vulnName = row[vulnName_counter]
                else:
                    vulnName = 'none'

                if severity_counter > -1:
                    severity = row[severity_counter]
                    if severity == 'Critical':
                        severity = '4'
                    elif severity == 'High':
                        severity = '3'
                    elif severity == 'Medium':
                        severity = '2'
                    elif severity == 'Low':
                        severity = '1'
                    elif severity == 'None':
                        severity = '0'
                    elif severity == 'Vulnerability Severity Level':
                        severity = '0'

                else:
                    severity = 'none'

                if desc_counter > -1:
                    desc = row[desc_counter]
                else:
                    desc = 'none'

                if sol_counter > -1:
                    sol = row[sol_counter]
                else:
                    sol = 'none'

                if ref_counter > -1:
                    ref = row[ref_counter]
                else:
                    ref = 'none'

                if date_counter > -1:
                    date = row[date_counter]
                else:
                    # SET TO CURRENT DATE IF CSV FILE HAS NO DATE TO BE READ
                    today = datetime.now()
                    if nessusTrigger == True:
                        date = today.strftime("%a %b  %d %H:%M:%S %Y")
                    elif nexposeTrigger == True:
                        date = today.strftime("%Y%m%dT%H%M%s")

                if cvss_counter > -1:
                    cvss = row[cvss_counter]
                else:
                    cvss = 'none'
            else:
                return Response("Error: Not a supported CSV File is being read")

            # if hostAddress != 'Host':
            vulnerability = TempVulnerability(hostAddress, hostName, port, ssl, vulnID, vulnName, severity, desc, path, sol,
                                          ref, date, cvss)

            listVuln.append(vulnerability)

            if vulnerability is None:
                return Response(" Error: Not a supported CSV File is being read")

            # Push Object into the end of  the list.
            # vulnerability.print()

            if nessusTrigger == True:
                tempArray = []
                for i in listVuln:
                    if i.host != 'Host':
                        tempArray.append(i)
                    elif i.host == 'Host':
                        bad_vuln.append(i)

                for i in tempArray:
                    if valid_import_vuln_nes(i):
                        array.append(i)
                    else:
                        bad_vuln.append(i)

                response = build_vulns('Nes', company, array)

            elif nexposeTrigger == True:
                tempArray = []
                for i in listVuln:
                    # print(i.host)
                    if i.host != 'Asset IP Address':
                        tempArray.append(i)
                    elif i.host == 'Asset IP Address':
                        bad_vuln.append(i)
                    else:
                        return Response("Not a supported CSV File is being read")

                for i in tempArray:
                    if valid_import_vuln_nex(i):
                        array.append(i)
                    else:
                        bad_vuln.append(i)

                response = build_vulns('Nex', company, array)
            else:
                return Response("Not a supported CSV File is being read")

    # This is a print method to print out the vulnerability -- For TESTING ONLY
    '''for i in array:
        i.print()'''

    return response


def fileHandlerXML(file, request):

    """
    This is a function that will deal with the file from the views.py
    It will take in a datatype/Object called UploadedFile
    https://docs.djangoproject.com/en/2.2/ref/files/uploads/#django.core.files.uploadhandler.TemporaryFileUploadHandler
    """
    filepath = file.temporary_file_path()
    #print(file.read())

    try:
        tree = ET.parse(filepath)
        root = tree.getroot()
        if root.tag == 'OWASPZAPReport':
            response = zapHandler(root, request)

        elif root.tag == 'NessusClientData_v2':
            response = nessusRead(root, request)

        elif root.tag == 'NexposeReport':
            response = nexposeRead(root, request)

        elif root.tag == 'nmaprun':
            response = nmapRead(root, request)

        else:
            response = Response("Error, File Uploaded is not supported")

    except ET.ParseError:
        return Response('Error Reading File')

    return response

"""
The functions below will takes in a ElementTree variable, which is the root of the tree.
The functions will then parse through the the root element and find the relative data that is needed.
It returns a JSON Response of either status=200 or status=404, depending of the success of the reading.
"""

def nmapRead(root, request):
    # count = 0
    company = request.user.company.pk

    listServ = []
    bad_service = []

    #date = root.get('startstr')  # The date when the nmap scan was ran/when it was detect

    for elem in root.findall('host'):

        for hostNameiter in elem.iter('hostname'):
            hostName = hostNameiter.get('name')

        for add in elem.findall('address'):
            hostAddress = add.get('addr')  # The IP address of the host
            addType = add.get('addrtype')  # The type of address (either ipv4 or ipv6)

        for status in elem.findall('status'):
            hostState = status.get('state')  # The state of the host (either up or down)

        for port in elem.iter('port'):
            protocol = port.get('protocol')  # The protocol of the port TCP or UDP
            portNo = port.get('portid')  # The port Number

        for state in elem.iter('state'):
            portState = state.get('state')  # The state of the port (either up or down)

        for service in elem.iter('service'):
            serviceName = service.get('name')  # The service Name e.g http, snews....
            serviceProduct = service.get('product')  # The service Product e.g Apache, lighttpd
            serviceVersion = service.get('Version')  # The version of the service running

            # Creating a vulnerability object to add into the listServ array
            services = TempServices(hostAddress, hostName, addType, hostState, protocol, portNo, portState, serviceName,
                                    serviceProduct, serviceVersion)

            if valid_import_service(services):
                listServ.append(services)
            else:
                bad_service.append(services)


    # This just for testing to print the vulnerabilities scanned.
    '''for i in listServ:
        i.print()'''

    build_services(company, listServ)

    return Response(status=202)


def nexposeRead(root, request):

    """
    Note: Nexpose desc, reference and solution is an array that has to be iterated through to get all of the data.
    """
    company = request.user.company.pk

    listVuln = []
    bad_vuln = []

    for child in root:
        for scans in child.findall('scan'):
            date = scans.get('startTime')  # The date of when the scan, example format = 20160218T203218272

        for nodes in child.findall('node'):
            hostAddress = nodes.get('address')  # The ip address of the host scanned
            hostName = nodes.get('hardware-address')

        for vuln in child.findall('vulnerability'):

            vulnID = vuln.get('id')  # The vulnerability ID according to the Nexpose Database
            vulnName = vuln.get('title')  # The name of the vulnerability
            severity = vuln.get('severity')  # The severity of Nexpose 0-10 (int)
            cvss = vuln.get('cvss')  # This is the common vulnerability score
            port = 'n/a'  # There is no ports scanned in the Nexpose
            ssl = 'n/a'  # SSl is only for ZAP
            path = 'n/a'  # This is a ZAP only variable

            desc = []  # This is an array for the long description for Nexpose
            sol = []  # This is an array for the long solution text for Nexpose
            ref = []  # This is an array for the multiple reference Nexpose gives

            # This are the for loops which enters the details into the array.
            for elem in vuln.iter('description'):
                for description in elem.iter('Paragraph'):
                    desc.append(description.text)

            for reference in vuln.iter('reference'):
                ref.append(reference.get('source') + ' ' + reference.text)

            for solution in vuln.iter('solution'):
                for para in solution.iter('Paragraph'):
                    sol.append(para.text)

            vulnerability = TempVulnerability(hostAddress, hostName, port, ssl, vulnID, vulnName, severity, desc,
                                              path, sol, ref, date, cvss)
            #vulnerability.printNexpose()

            if valid_import_vuln_nex(vulnerability):
                listVuln.append(vulnerability)
            else:
                bad_vuln.append(vulnerability)

    response = build_vulns('Nex', company, listVuln)  # Pass off the vulns to be read.

    # This is a print method to print out the vulnerability -- For TESTING ONLY
    '''for i in listVuln:
        i.printNexpose()'''

    return response


def nessusRead(root, request):

    company = request.user.company.pk

    # The dynamic array(list) that the vulnerabilities would be stored in.
    listVuln = []
    bad_vuln = []  # The rejected vulns

    for elem in root:
        if elem.tag == 'Report':
            for report in elem:
                for host in report.findall('HostProperties'):
                    # This grabs the Host Name and IP address of the host.
                    hostName = host[4].text
                    hostAddress = host[7].text
                    date = host[10].text  # The date of when the scan, example format =
                for host2 in report.findall('ReportItem'):

                    ref = 'none'  # If the reference is empty set it as none
                    path = 'none'  # If the path is empty set it as none
                    cvss = 'none'  # This is the common vulnerability score

                    port = host2.get('port')  # This is the port scanned
                    ssl = 'none'

                    vulnID = host2.get('pluginID')  # This is the vulnerability ID according to the nessus database
                    vulnName = host2.get('pluginName')  # This is the name of the vulnerability
                    severity = host2.get('severity')  # This is the severity of the vulnerability (0-4)

                    for cvssIter in host2.iter('cvss_base_score'):
                        cvss = cvssIter.text

                    for descIter in host2.iter('description'):
                            desc = descIter.text  # This is the description of the vulnerability

                    for refIter in host2.iter('see_also'):
                        ref = refIter.text  # This is the reference of the vulnerability.
                        # Note: There possible may be multiple urls in one string
                        # (Did not array this one)

                    for solIter in host2.iter('solution'):
                        sol = solIter.text  # Solution of the vulnerability detected

                    vulnerability = TempVulnerability(hostAddress, hostName, port, ssl, vulnID, vulnName,
                                                              severity, desc, path, sol, ref, date, cvss)

                    # Push Object into the end of  the list.
                    # vulnerability.print()
                    if valid_import_vuln_nes(vulnerability):
                        listVuln.append(vulnerability)
                    else:
                        bad_vuln.append(vulnerability)

    # This is a print method to print out the vulnerability -- For TESTING ONLY
    '''for i in listVuln:
        i.print()'''

    response = build_vulns('Nes', company, listVuln)  # Pass off the vulns to be read.

    return response


def zapHandler(root, request):

    company = request.user.company.pk
    listVuln = []
    bad_vuln = []

    # Iterate through root
    for elem in root:
        date = root.get('generated')  # The date of when the scan, example format = Thu, 19 Sep 2013 17:34:05
        hostAddress = elem.get('host')  # The IP Address of the host scanned or f2dn or DNS name
        hostName = elem.get('name')  # The name of the Host contains the http://<url>
        port = elem.get('port')  # The port scanned
        ssl = elem.get('SSL')  # This is the SSL inspection? It is either true or false
        cvss = 'none'

        # Root has a child node, that contains another child node.
        for node in elem:
            for node2 in node:
                # The 3rd child node contains all the details needed.
                for child in node2:
                    if child.tag == 'pluginid':
                        if child.text == 'None':
                            vulnID = 'N/A'
                        else:
                            vulnID = child.text  # This is the vulnerability ID according to ZAP database

                    if child.tag == 'alert':
                        if child.text == 'None':
                            vulnName = 'N/A'
                        else:
                            vulnName = child.text  # The name of the vulnerability

                    if child.tag == 'riskcode':
                        if child.text == 'None':
                            severity = 'N/A'
                        else:
                            severity = child.text  # This is the severity of the vulnerability (0-4)

                    if child.tag == 'desc':
                        if child.text == 'None':
                            desc = 'N/A'
                        else:
                            desc = child.text  # This is the description of the vulnerability

                    if child.tag == 'uri':
                        if child.text == 'None':
                            path = 'N/A'
                        else:
                            path = child.text  # This is a ZAP only thing. It is the extension of the url (or path)
                            # e.g /extend/this/

                    if child.tag == 'solution':
                        if child.text == 'None':
                            solution = 'N/A'
                        else:
                            solution = child.text  # This is the Solution for the vulnerability

                    if child.tag == 'reference':
                        if child.text == 'None':
                            ref = 'N/A'
                        else:
                            ref = child.text

                        # Storing the vulns into a class called Vulnerability
                        vulnerability = TempVulnerability(hostAddress, hostName, port, ssl, vulnID, vulnName, severity,
                                                        desc, path, solution, ref, date, cvss)
                        # vulnerability.print()

                        # If The vulnerabilities are not entered into the object then send a bad request
                        if vulnerability is None:
                            return Response(status=400)

                        if valid_import_vuln_zap(vulnerability):
                            listVuln.append(vulnerability)
                        else:
                            bad_vuln.append(vulnerability)


    # ADD METHOD HERE TO SEND THE LIST OF VULN TO ANOTHER METHOD

    """
    To iterate through the list and grab the individual data of the vulnerabilties below is an example:

    for i in listVuln:
        i.print()
        # OR
        i.getHostIp()
        # .... Need to add more functions to the vulnerability

    """

    '''for i in listVuln:
        i.print()'''

    response = build_vulns('ZAP', company, listVuln)  # Pass off the vulns to be read.

    return response
