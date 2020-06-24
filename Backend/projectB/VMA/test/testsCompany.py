from rest_assured.testcases import ReadWriteRESTAPITestCaseMixin, BaseRESTAPITestCase
from VMA import factories


# Unit test
class CompanyTest(ReadWriteRESTAPITestCaseMixin, BaseRESTAPITestCase):
    """ Test module for Company model """

    base_name = 'rest_framework:company'
    factory_class = factories.CompanyFactory
    user_factory = factories.UserFactory
    response_lookup_field = 'id'
    attributes_to_check = ['id']
    create_data = {'name': 'TestCompany',
                   'description': 'Desc',
                   'numProducts': 0,
                   'securityPosture': 0,}
    update_data = {'description': 'Updated',}
