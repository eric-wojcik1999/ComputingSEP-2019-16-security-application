from rest_framework.test import APITestCase
from rest_framework.utils import json
from VMA import factories
from VMA.models import User, Asset, Vulnerability, Company
import datetime


class ReportTest(APITestCase):

    def test_asset_based(self):
        vuln = factories.VulnFactory.create()
        asset = vuln.assetID
        company = asset.company
        user = asset.owner
        user.company.delete()
        user.company = company
        self.client.force_authenticate(user)  # force the login

        query = {"start": "1960-05-27",
                 "end": "2019-09-30",
                 "date-type": {
                     "discovered": "True",
                     "modified": "False",
                     "mitigated": "False"
                 },
                 "company": asset.company.name,
                 "owner": asset.owner.username,
                 "assets": [asset.id]}
        response = self.client.post('/reports/asset_based/', query, "json")

        self.assertEqual(Asset.objects.count(), 1)
        self.assertEqual(Asset.objects.get().name, asset.name)
        self.assertEqual(Vulnerability.objects.count(), 1)
        self.assertEqual(Vulnerability.objects.get().name, vuln.name)
        self.assertEqual(Company.objects.count(), 1)
        self.assertEqual(Company.objects.get().name, company.name)

        json_data = {'vulns': [{'vulnID': vuln.vulnID, 'name': vuln.name, 'description': vuln.description,
                                'severity': vuln.severity, 'dateDiscovered': vuln.dateDiscovered,
                                'dateModified': vuln.dateModified.strftime("%Y-%m-%d"), 'dateResolved': vuln.dateResolved,
                                'actionPlan': vuln.actionPlan, 'solution': vuln.solution, 'assetID': asset.id,
                                'status': vuln.status, 'scanType': vuln.scanType, 'reference': vuln.reference,
                                'cvssScore': vuln.cvssScore}],
                     'company': [{'id': company.id, 'name': company.name, 'description': company.description,
                                  'numProducts': company.numProducts, 'securityPosture': company.securityPosture}],
                     'assets': [{'id': asset.id, 'name': asset.name, 'desc': asset.desc, 'type': asset.type,
                                 'company': asset.company.name, 'version_num': asset.version_num,
                                 'features': asset.features, 'host_address': asset.host_address, 'domain': asset.domain,
                                 'mac_address': asset.mac_address, 'hist_data': asset.hist_data,
                                 'owner': asset.owner.username, 'business_crit': asset.business_crit,
                                 'asset_dept': asset.asset_dept, 'est_worth': asset.est_worth,
                                 'platform': asset.platform}]}
        self.assertEqual(json.loads(response.content), json_data)

    def test_vuln_based(self):
        vuln = factories.VulnFactory.create()
        asset = vuln.assetID
        company = asset.company
        user = asset.owner
        user.company.delete()
        user.company = company
        self.client.force_authenticate(user)  # force the login

        query = {"start": "1960-05-27",
                 "end": "2019-09-30",
                 "date-type": {
                     "discovered": "True",
                     "modified": "False",
                     "mitigated": "False"
                 },
                 "company": asset.company.name,
                 "owner": asset.owner.username,
                 "vulns": [vuln.vulnID]}

        response = self.client.post('/reports/vuln_based/', query, "json")

        self.assertEqual(Asset.objects.count(), 1)
        self.assertEqual(Asset.objects.get().name, asset.name)
        self.assertEqual(Vulnerability.objects.count(), 1)
        self.assertEqual(Vulnerability.objects.get().name, vuln.name)
        self.assertEqual(Company.objects.count(), 1)
        self.assertEqual(Company.objects.get().name, company.name)
        self.assertEqual(Vulnerability.objects.get().dateModified, vuln.dateModified)

        json_data = {'vulns': [{'vulnID': vuln.vulnID, 'name': vuln.name, 'description': vuln.description,
                                'severity': vuln.severity, 'dateDiscovered': vuln.dateDiscovered,
                                'dateModified': vuln.dateModified.strftime("%Y-%m-%d"), 'dateResolved': vuln.dateResolved,
                                'actionPlan': vuln.actionPlan, 'solution': vuln.solution, 'assetID': asset.id,
                                'status': vuln.status, 'scanType': vuln.scanType, 'reference': vuln.reference,
                                'cvssScore': vuln.cvssScore}],
                     'company': [{'id': company.id, 'name': company.name, 'description': company.description,
                                  'numProducts': company.numProducts, 'securityPosture': company.securityPosture}],
                     'assets': [{'id': asset.id, 'name': asset.name, 'desc': asset.desc, 'type': asset.type,
                                 'company': asset.company.name, 'version_num': asset.version_num,
                                 'features': asset.features, 'host_address': asset.host_address, 'domain': asset.domain,
                                 'mac_address': asset.mac_address, 'hist_data': asset.hist_data,
                                 'owner': asset.owner.username, 'business_crit': asset.business_crit,
                                 'asset_dept': asset.asset_dept, 'est_worth': asset.est_worth,
                                 'platform': asset.platform}]}
        self.assertEqual(json.loads(response.content), json_data)










