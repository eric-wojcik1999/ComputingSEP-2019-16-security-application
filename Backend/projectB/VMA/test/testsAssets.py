from rest_assured.testcases import ReadWriteRESTAPITestCaseMixin, BaseRESTAPITestCase
from VMA import factories


# Unit test
class AssetTest(ReadWriteRESTAPITestCaseMixin, BaseRESTAPITestCase):
    """ Test module for Asset model """

    base_name = 'rest_framework:assets'
    factory_class = factories.AssetFactory
    user_factory = factories.UserFactory
    response_lookup_field = 'id'
    attributes_to_check = ['id']
    update_data = {'hist_data': 'Updated',
                   'business_crit': 'VL', }

    def get_create_data(self):
        data = {'name': 'DjangoAsset6',
                   'desc': 'This is an asset',
                   'type': 'E',
                   'company': factories.CompanyFactory.create().name,
                   'version_num': 2.06,
                   'features': 'No features',
                   'host_address': '127.0.0.1',
                   'mac_address': '00:50:56:81:01:e3',
                   'domain': 'None',
                   'hist_data': 'There is history',
                   'owner': factories.UserFactory.create().pk,
                   'business_crit': 'L',
                   'asset_dept': 'Research and Development',
                   'est_worth': 96000.00,
                   'platform': 'linux', }
        return data
