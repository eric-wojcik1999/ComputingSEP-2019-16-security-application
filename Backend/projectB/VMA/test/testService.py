from rest_assured.testcases import ReadWriteRESTAPITestCaseMixin, BaseRESTAPITestCase
from VMA import factories


class ServiceAPITestCase(ReadWriteRESTAPITestCaseMixin, BaseRESTAPITestCase):
    base_name = 'rest_framework:services'
    factory_class = factories.ServiceFactory
    user_factory = factories.UserFactory
    response_lookup_field = 'id'
    attributes_to_check = ['id']
    update_data = {'service': 'updated',
                   'port': 13, }

    def get_create_data(self):
        data = {'port': 12,
                'service': "A service",
                'description': 'Desc',
                'assetID': factories.AssetFactory.create().pk, }
        return data
