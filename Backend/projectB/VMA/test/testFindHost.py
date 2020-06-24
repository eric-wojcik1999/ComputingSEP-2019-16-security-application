from VMA import factories
from VMA.findHost import find_host_ip_name, find_host_ip_mac
from rest_framework.test import APITestCase


class TestFindIPName(APITestCase):

    def test_ip_name_1(self):  # Tests to find an asset specific to a company when a duplicate exists in another company
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111')
        ip = asset1.host_address
        name = asset1.name
        company = asset1.company
        found_id = find_host_ip_name(ip, name, company)
        self.assertEqual(asset1.pk, found_id)

    def test_ip_name_2(self):  # Tests to make sure it errors when u get illegal stuff
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111', company=company)
        ip = asset1.host_address
        name = asset1.name
        company = asset1.company
        found_id = find_host_ip_name(ip, name, company)
        self.assertEqual(-2, found_id)

    def test_ip_name_3(self):  # Tests two assets with the same name, but different IP
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.166', company=company)
        ip = asset1.host_address
        name = asset1.name
        company = asset1.company
        found_id = find_host_ip_name(ip, name, company)
        self.assertEqual(asset1.pk, found_id)

    def test_ip_name_4(self):  # Tests two assets with the same IP, but different names
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(name='testMachine2', host_address='192.124.243.111', company=company)
        asset3 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111')
        ip = asset1.host_address
        name = asset1.name
        company = asset1.company
        found_id = find_host_ip_name(ip, name, company)
        self.assertEqual(asset1.pk, found_id)

    def test_ip_name_5(self):  # This is to test name vs ip, the method should pick the name vs the ip
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(name='testMachine2', host_address='192.124.243.232', company=company)
        asset3 = factories.AssetFactory.create(name='testMachine2', host_address='192.124.243.111')
        ip = asset1.host_address
        name = asset2.name  # Note how it chooses one field from each asset.
        company = asset1.company
        found_id = find_host_ip_name(ip, name, company)
        self.assertEqual(asset2.pk, found_id)

    def test_ip_name_6(self):  # This is to test for when 50% of the information is compromised.
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(name='testMachine2', host_address='192.124.243.232', company=company)
        asset3 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111')
        ip = '123.214.232.124'  # Does not match anything
        name = asset1.name
        company = asset1.company
        found_id = find_host_ip_name(ip, name, company)
        self.assertEqual(asset1.pk, found_id)

    def test_ip_name_7(self):  # This is to test for when 50% of the information is compromised.
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(name='testMachine2', host_address='192.124.243.232', company=company)
        asset3 = factories.AssetFactory.create(name='testMachine', host_address='192.124.243.111')
        ip = asset1.host_address
        name = 'Garbage'  # Does not match anything
        company = asset1.company
        found_id = find_host_ip_name(ip, name, company)
        self.assertEqual(asset1.pk, found_id)


# This class tests the method: find_host_ip_mac
class TestFindIPMAC(APITestCase):

    def test_ip_mac_1(self):  # Tests to find an asset specific to a company when a duplicate exists in another company
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111')
        ip = asset1.host_address
        mac = asset1.mac_address
        company = asset1.company
        found_id = find_host_ip_mac(ip, mac, company)
        self.assertEqual(asset1.pk, found_id)

    def test_ip_mac_2(self):  # Tests to make sure it errors when u get illegal stuff
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111', company=company)
        ip = asset1.host_address
        mac = asset1.mac_address
        company = asset1.company
        found_id = find_host_ip_mac(ip, mac, company)
        self.assertEqual(-2, found_id)

    def test_ip_mac_3(self):  # Tests two assets with the same MAC, but different IP
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.166', company=company)
        ip = asset1.host_address
        mac = asset1.mac_address
        company = asset1.company
        found_id = find_host_ip_mac(ip, mac, company)
        self.assertEqual(asset1.pk, found_id)

    def test_ip_mac_4(self):  # Tests two assets with the same IP, but different MAC
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(mac_address='00:50:56:81:99:e3', host_address='192.124.243.111', company=company)
        asset3 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111')
        ip = asset1.host_address
        mac = asset1.mac_address
        company = asset1.company
        found_id = find_host_ip_mac(ip, mac, company)
        self.assertEqual(asset1.pk, found_id)

    def test_ip_mac_5(self):  # This is to test name vs ip, the method should pick the name vs the ip
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(mac_address='00:50:56:81:99:e3', host_address='192.124.243.232', company=company)
        asset3 = factories.AssetFactory.create(mac_address='00:50:56:81:99:e3', host_address='192.124.243.111')
        ip = asset1.host_address  # Chooses a field from each asset
        mac = asset2.mac_address  # Chooses a field from each asset
        company = asset1.company
        found_id = find_host_ip_mac(ip, mac, company)
        self.assertEqual(asset2.pk, found_id)

    def test_ip_mac_6(self):  # This is to test for when 50% of the information is compromised.
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(mac_address='00:50:56:81:99:e3', host_address='192.124.243.232', company=company)
        asset3 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111')
        ip = '123.214.232.124'  # Does not match anything
        mac = asset1.mac_address
        company = asset1.company
        found_id = find_host_ip_mac(ip, mac, company)
        self.assertEqual(asset1.pk, found_id)

    def test_ip_mac_7(self):  # This is to test for when 50% of the information is compromised.
        company = factories.CompanyFactory.create()
        asset1 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111', company=company)
        asset2 = factories.AssetFactory.create(mac_address='00:50:56:81:99:e3', host_address='192.124.243.232', company=company)
        asset3 = factories.AssetFactory.create(mac_address='00:50:56:81:01:e3', host_address='192.124.243.111')
        ip = asset1.host_address
        mac = 'Garbage'  # Does not match anything
        company = asset1.company
        found_id = find_host_ip_mac(ip, mac, company)
        self.assertEqual(asset1.pk, found_id)

