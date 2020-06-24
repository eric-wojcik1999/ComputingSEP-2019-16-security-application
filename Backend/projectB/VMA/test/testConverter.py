from VMA.arrayConverter import build_vulns, build_services
from VMA.TempVulnerability import TempVulnerability, TempServices
from VMA.models import Vulnerability, Service
from rest_framework.test import APITestCase
from VMA import factories


class TestConvert(APITestCase):

    def test_zap(self):
        asset = factories.AssetFactory.create()
        list_vuln = []
        for i in range(1, 4):
            hostIP = asset.host_address
            hostName = asset.name
            hostPort = '8443'
            hostSSL = 'false'
            pluginID = '10015'
            pluginName = 'ZAPVulnerability' + str(i)
            severity = '12'
            desc = 'This is description' + str(i)
            ref = 'N/A'
            path = 'https://satoffice043:8443/wavsep/active/index.jsp'
            sol = 'testSOL'
            date = 'Fri, 29 Mar 2019 21:02:52'
            cvss = ''
            # Create a vulnerability OBJECT
            vuln = TempVulnerability(hostIP, hostName, hostPort, hostSSL, pluginID, pluginName,
                                 severity, desc, path, sol, ref, date, cvss)
            # Push Object into the end of  the list.
            list_vuln.append(vuln)
        build_vulns('ZAP', asset.company.pk, list_vuln)  # serialize the vulns
        total_vulns = len(list_vuln)
        actual_vuln = Vulnerability.objects.count()
        # print('Expected: ', total_vulns, ' Actual: ', actual_vuln)
        self.assertEqual(total_vulns, actual_vuln)

    def test_nex(self):
        asset = factories.AssetFactory.create()
        list_vuln = []
        for i in range(1, 4):
            hostIP = asset.host_address  # IP ADDRESS
            hostName = asset.mac_address  # MAC ADDRESS
            hostPort = 'N/A'
            hostSSL = 'N/A'
            pluginID = 'N/A'
            vulnName = 'NEXVulnerability' + str(i)
            severity = '2'  # 0-10
            desc = ['This is description' + str(i) + 'a', 'This is description' + str(i) + 'b',
                    'This is description' + str(i) + 'c']
            ref = ['This is a reference' + str(i) + 'a', 'This is a reference' + str(i) + 'b',
                   'This is a reference' + str(i) + 'c']
            path = 'N/A'
            sol = ['This is a solution' + str(i) + 'a', 'This is a solution' + str(i) + 'b',
                   'This is a solution' + str(i) + 'c']
            date = '20160218T203218272'
            cvss = '4.5'
            # Create a vulnerability OBJECT
            vuln = TempVulnerability(hostIP, hostName, hostPort, hostSSL, pluginID, vulnName,
                                 severity, desc, path, sol, ref, date, cvss)
            # Push Object into the end of  the list.
            list_vuln.append(vuln)
        build_vulns('Nex', asset.company.pk, list_vuln)  # serialize the vulns
        total_vulns = len(list_vuln)
        actual_vuln = Vulnerability.objects.count()
        # print('Expected: ', total_vulns, ' Actual: ', actual_vuln)
        self.assertEqual(total_vulns, actual_vuln)

    def test_nes(self):
        asset = factories.AssetFactory.create()
        list_vuln = []
        for i in range(1, 4):
            hostIP = asset.host_address
            hostName = asset.mac_address  # MAC ADDRESS
            hostPort = '0'
            hostSSL = 'N/A'
            pluginID = '12'
            pluginName = 'NESVulnerability' + str(i)
            severity = '3'
            desc = 'This is description' + str(i)
            ref = '''http://support.microsoft.com/kb/887429
http://www.nessus.org/u?74b80723
http://www.samba.org/samba/docs/man/manpages-3/smb.conf.5.html'''
            path = 'N/A'
            sol = 'Fix the reverse DNS or host file.'
            date = 'Mon Jul  1 11:33:11 2013'
            cvss = ''
            # Create a vulnerability OBJECT
            vuln = TempVulnerability(hostIP, hostName, hostPort, hostSSL, pluginID, pluginName,
                                 severity, desc, path, sol, ref, date, cvss)
            # Push Object into the end of  the list.
            list_vuln.append(vuln)
        build_vulns('Nes', asset.company.pk, list_vuln)  # serialize the vulns
        total_vulns = len(list_vuln)
        actual_vuln = Vulnerability.objects.count()
        # print('Expected: ', total_vulns, ' Actual: ', actual_vuln)
        self.assertEqual(total_vulns, actual_vuln)

    def test_service(self):
        asset = factories.AssetFactory.create()
        list_serv = []
        for i in range(1, 4):
            ip = asset.host_address
            hostName = asset.name
            addrType = 'ipv4'
            hostState = 'up'
            protocol = 'tcp'
            portNo = '80'
            portState = 'open'
            serviceName = 'http'
            serviceProduct = 'Apache httpd'
            serviceVersion = '1.3.39'
            service = TempServices(ip, hostName,addrType, hostState, protocol, portNo, portState, serviceName, serviceProduct, serviceVersion)
            # Push Object into the end of  the list.
            list_serv.append(service)
        build_services(asset.company.pk, list_serv)  # serialize the vulns
        total_services = len(list_serv)
        actual_services = Service.objects.count()
        # print('Expected: ', total_services, ' Actual: ', actual_services)
        self.assertEqual(total_services, actual_services)