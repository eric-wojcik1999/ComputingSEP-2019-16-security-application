from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from VMA.factories import UserFactory
from os import path
from io import BytesIO as Bytes


class UploadTest(APITestCase):

    c = APIClient()

    def test_file_upload_ZAP(self):
        self.c.force_authenticate(UserFactory.create())
        with open(path.join('VMA', 'test', 'Test.xml'), "rb") as fp:
            self.c.post('/upload/Test.xml', {'filename': 'name', 'attachment': fp})

    def test_file_upload_Nessus(self):
        self.c.force_authenticate(UserFactory.create())
        with open(path.join('VMA', 'test', 'nessus_v_unknown.nessus'), 'rb') as fp:
            self.c.post('/upload/nessus_v_unknown.nessus', {b'filename': b'TestNessus.xml', b'attachment': fp})

    def test_file_upload_Nexpose(self):
        self.c.force_authenticate(UserFactory.create())
        with open(path.join('VMA', 'test', 'report.xml'), 'rb') as fp:
            self.c.post('/upload/TestNexposeXML.xml', {b'filename': b'TestNexpose.xml', b'attachment': fp})
