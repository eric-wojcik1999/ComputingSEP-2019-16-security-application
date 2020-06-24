from rest_framework.test import APITestCase
from VMA import factories
from VMA.validation import *
from VMA.TempVulnerability import TempServices, TempVulnerability
from VMA.arrayConverter import assemble_service, assemble, chop_string


class TestValidation(APITestCase):

    def test_service_valid(self):
        asset = factories.AssetFactory.create()
        # ip, hostName, addrType, hostState, protocol, portNo, portState, serviceName, serviceProduct, serviceVersion
        service = TempServices('213.123.111.168', 'CoolAsset', 'ipv4', 'filtered', 'tcp', '45', 'open', 'http', 'Google', '5.1')
        result = valid_import_service(service)
        self.assertEqual(True, result, 'Entered a valid service')

        service = TempServices('2A3.123.111.168', 'CoolAsset', 'ipv4', 'filtered', 'tcp', '45', 'open', 'http', 'Google', '5.1')
        result = valid_import_service(service)
        self.assertEqual(False, result, 'Entered an invalid service, Bad IP')

        service = TempServices('213.123.111.168', 'CoolAsset', 'ipv4', 'filtered', 'tcp', '-1', 'open', 'http', 'Google', '5.1')
        result = valid_import_service(service)
        self.assertEqual(False, result, 'Entered an invalid service, negative port')

        service = TempServices('', '', '', '', '', '', '', '', '', '')
        result = valid_import_service(service)
        self.assertEqual(False, result, 'Entered an invalid service, all empty strings')

        service = TempServices(None, None, None, None, None, None, None, None, None, None)
        result = valid_import_service(service)
        self.assertEqual(False, result, 'Entered an invalid service, all None')

        service = TempServices(asset.host_address, None, None, None, None, '45', None, None, None, None)
        result = valid_import_service(service)
        self.assertEqual(False, result, 'Entered an invalid service, No Product Name')

    def test_nes_valid(self):
        # host, hostName, port, ssl, pluginId, name, severity, desc, path, sol, ref, date, cvss
        # host = IP, hostName = MAC, severity 0-4
        vuln = TempVulnerability('192.124.245.19', '00:50:56:81:01:e3', '22', 'N/A', '1001', 'BadHax', '3',
                                 'Its real Bad', 'N/A', 'Fix it', 'www.google.com', 'Mon Jul  1 11:33:11 2013', '5.5')
        result = valid_import_vuln_nes(vuln)
        self.assertEqual(True, result, 'Entered a valid Vulnerability')

        vuln = TempVulnerability('192.124.245.19', '00:50:56:81:01:', '22', 'N/A', '1001', 'BadHax', '3',
                                 'Its real Bad', 'N/A', 'Fix it', 'www.google.com', 'Mon Jul  1 11:33:11 2013', '5.5')
        result = valid_import_vuln_nes(vuln)
        self.assertEqual(False, result, 'Entered a invalid Vulnerability MAC address missing')

        vuln = TempVulnerability('192.124.245.19', '00:50:56:81:01:e3', '9999999999', 'N/A', '1001', 'BadHax', '3',
                                 'Its real Bad', 'N/A', 'Fix it', 'www.google.com', 'Mon Jul  1 11:33:11 2013', '5.5')
        result = valid_import_vuln_nes(vuln)
        self.assertEqual(False, result, 'Entered an invalid Vulnerability, bad port')

        vuln = TempVulnerability('192.124.245.19', '00:50:56:81:01:e3', '22', 'N/A', '1001', None, '3',
                                 'Its real Bad', 'N/A', 'Fix it', 'www.google.com', 'Mon Jul  1 11:33:11 2013', '5.5')
        result = valid_import_vuln_nes(vuln)
        self.assertEqual(False, result, 'Entered an invalid Vulnerability, No Name')

        vuln = TempVulnerability('192.124.245.19', '00:50:56:81:01:e3', '22', 'N/A', '1001', '', '3',
                                 'Its real Bad', 'N/A', 'Fix it', 'www.google.com', 'Mon Jul  1 11:33:11 2013', '5.5')
        result = valid_import_vuln_nes(vuln)
        self.assertEqual(False, result, 'Entered an invalid Vulnerability, Blank Name')

        vuln = TempVulnerability('192.124.245.19', '00:50:56:81:01:e3', '0', None, None, 'BadHax', '3',
                                 None, None, None, None, 'Mon Jul  1 11:33:11 2013', None)
        result = valid_import_vuln_nes(vuln)
        self.assertEqual(True, result, 'Entered a valid Vulnerability, min requirements')

        vuln = TempVulnerability(None, None, None, None, None, None, None,
                                 None, None, None, None, None, None)
        result = valid_import_vuln_nes(vuln)
        self.assertEqual(False, result, 'Entered an invalid Vulnerability, All None')

        vuln = TempVulnerability('', '', '', '', '', '', '', '', '', '', '', '', '')
        result = valid_import_vuln_nes(vuln)
        self.assertEqual(False, result, 'Entered an invalid Vulnerability, All Blank')

    def test_nex_valid(self):
        # host, hostName, port, ssl, pluginId, name, severity, desc, path, sol, ref, date, cvss
        # host = IP, hostName = MAC, severity 0-10
        vuln = TempVulnerability('192.124.245.19', '0050568101e3', 'N/A', 'N/A', '1001', 'BadHax', '3', 'Its real Bad',
                                 'N/A', 'Fix it', 'www.google.com', '20160218T203218272', '5.5')
        result = valid_import_vuln_nex(vuln)
        self.assertEqual(True, result, 'Entered a valid Vulnerability')

        vuln = TempVulnerability('192.124.245.19', '0050568101e3', None, None, None, 'BadHax', '8', None,
                                 None, None, None, '20160218T203218272', None)
        result = valid_import_vuln_nex(vuln)
        self.assertEqual(True, result, 'Entered a valid Vulnerability, min requirements')

        vuln = TempVulnerability('192.124.245.19', '0050568101e3', '', '', '', 'BadHax', '8', '',
                                 '', '', '', '20160218T203218272', '')
        result = valid_import_vuln_nex(vuln)
        self.assertEqual(True, result, 'Entered a valid Vulnerability, min requirements')

        vuln = TempVulnerability(None, None, None, None, None, None, None,
                                 None, None, None, None, None, None)
        result = valid_import_vuln_nex(vuln)
        self.assertEqual(False, result, 'Entered an invalid Vulnerability, all None')

        vuln = TempVulnerability('', '', '', '', '', '', '', '', '', '', '', '', '')
        result = valid_import_vuln_nex(vuln)
        self.assertEqual(False, result, 'Entered an invalid Vulnerability, All Blank')

        vuln = TempVulnerability('192.124.245.19', '0050568101e3', 'N/A', 'N/A', '1001', 'BadHax', '3', 'Its real Bad',
                                 'N/A', 'Fix it', 'www.google.com', '2016018272', '5.5')
        result = valid_import_vuln_nex(vuln)
        self.assertEqual(False, result, 'Entered an invalid Vulnerability, bad Date')

    def test_zap_valid(self):
        # host, hostName, port, ssl, pluginId, name, severity, desc, path, sol, ref, date, cvss
        # host = IP, hostName = hostName, severity 0-4, Path, ssl are both used here.
        vuln = TempVulnerability('192.124.245.19', 'A host with a name', '22', 'N/A', '1001', 'BadHax', '3', 'Its real Bad', 'N/A', 'Fix it', 'www.google.com', 'Thu, 19 Sep 2013 17:34:05', '5.5')
        result = valid_import_vuln_zap(vuln)
        self.assertEqual(True, result, 'Entered a valid Vulnerability')

        vuln = TempVulnerability('192.124.245.19', None, '22', None, None, 'BadHax', '2', None, None, None, None,
                                 'Thu, 19 Sep 2013 17:34:05', None)
        result = valid_import_vuln_zap(vuln)
        self.assertEqual(True, result, 'Entered a valid Vulnerability, min requirements')

        vuln = TempVulnerability(None, None, None, None, None, None, None,
                                 None, None, None, None, None, None)
        result = valid_import_vuln_zap(vuln)
        self.assertEqual(False, result, 'Entered an invalid Vulnerability, all None')

        vuln = TempVulnerability('', '', '', '', '', '', '', '', '', '', '', '', '')
        result = valid_import_vuln_zap(vuln)
        self.assertEqual(False, result, 'Entered an invalid Vulnerability, All Blank')

    def test_misc(self):
        # Random tests i have.
        result = valid_ip('123.132.241.212')
        result2 = valid_ip('2001:0db8:85a3:0000:0000:8a2e:0370:7334')
        self.assertEqual(True, result, 'Should pass as valid IPv4')
        self.assertEqual(True, result2, 'Should pass as valid IPv6')
        result3 = chop_string('1234567', 4)
        self.assertEqual('1234', result3)

    def test_nex_date(self):
        # Valid date should be: 20160218T203218272
        result1 = valid_date_nex('20160218T203218272')  # Valid
        self.assertEqual(True, result1, 'The date entered was Valid')
        result2 = valid_date_nex('2016218T203218272')  # invalid, date too short
        self.assertEqual(False, result2, 'The date entered was invalid, Too short')
        result3 = valid_date_nex('20160218203218272')  # invalid, No T
        self.assertEqual(False, result3, 'The date entered was invalid, no T')
        result4 = valid_date_nex('20160255T203218272')  # invalid, date is 55th
        self.assertEqual(False, result4, 'The date entered was invalid, date > 31')
        result5 = valid_date_nex('2016AA18T203218272')  # invalid, letters in the date
        self.assertEqual(False, result5, 'The date entered was invalid, contains letters')
        result6 = valid_date_nex('AAAAAAAAT203218272')  # invalid, letters in the date
        self.assertEqual(False, result6, 'The date entered was invalid, ALL letters')
        result7 = valid_date_nex('TTTTTTTTTTTTTTTTTT')  # invalid, letters in the date
        self.assertEqual(False, result7, 'The date entered was invalid, ALL TTTT')
        result8 = valid_date_nex('')  # invalid, letters in the date
        self.assertEqual(False, result8, 'The date entered was invalid, completely blank')

    def test_nes_date(self):
        # Valid date should be: 'Mon Jul  1 11:33:11 2013'
        result1 = valid_date_nes('Mon Jul  1 11:33:11 2013')  # Valid
        self.assertEqual(True, result1, 'The date entered was Valid')
        result2 = valid_date_nes('Mon Hul  1 11:33:11 2013')  # invalid
        self.assertEqual(False, result2, 'The date entered was invalid')
        result3 = valid_date_nes('Mon Jul  177 11:33:11 2013')  # invalid, date too large
        self.assertEqual(False, result3, 'The date entered was invalid')
        result4 = valid_date_nes('Mon Jul1 11:33:11 2013')  # invalid, missing a space
        self.assertEqual(False, result4, 'The date entered was invalid, missing a space')
        result5 = valid_date_nes('Jul  1 11:33:11 2013')  # invalid, no month
        self.assertEqual(False, result5, 'The date entered was invalid, no month')
        result6 = valid_date_nes('Mon 2013')  # invalid, missing many fields
        self.assertEqual(False, result6, 'The date entered was invalid, missing most of the data')
        result7 = valid_date_nes('AAAAAAAAAAAAAAAAAAAAA')  # invalid, Completely AAAA
        self.assertEqual(False, result7, 'The date entered was invalid, Completely AAAAA')
        result8 = valid_date_nes('')  # invalid, Completely blank
        self.assertEqual(False, result8, 'The date entered was invalid, Completely blank')

    def test_zap_date(self):
        # Valid date should be: Fri, 29 Mar 2019 21:02:52
        result1 = valid_date_zap('Fri, 29 Mar 2019 21:02:52')  # Valid
        self.assertEqual(True, result1, 'The date entered was Valid')
        result2 = valid_date_zap('Fri,29Mar201921:02:52')  # invalid, no Spaces
        self.assertEqual(False, result2, 'The date entered was invalid, no Spaces')
        result3 = valid_date_zap('Fri, 29 ZZar 2019 21:02:52')  # invalid, bad month
        self.assertEqual(False, result3, 'The date entered was invalid')
        result4 = valid_date_zap('Fri, 55 Mar 2019 21:02:52')  # invalid, bad day
        self.assertEqual(False, result4, 'The date entered was invalid')
        result5 = valid_date_zap('Fri, AA Mar 2019 21:02:52')  # invalid, letters
        self.assertEqual(False, result5, 'The date entered was invalid, letters')
        result6 = valid_date_zap('')  # invalid, blank
        self.assertEqual(False, result6, 'The date entered was invalid, blank')
        result7 = valid_date_zap('Fri, 29 Mar2019 21:02:52')  # invalid, missing a space
        self.assertEqual(False, result7, 'The date entered was invalid, missing a space')
        result8 = valid_date_zap(',,,,,,,,,,,,')  # invalid All commas
        self.assertEqual(False, result8, 'The date entered was invalid, all commas')

