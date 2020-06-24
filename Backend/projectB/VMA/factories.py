import factory
import datetime
from factory.fuzzy import FuzzyAttribute

from .models import *


class TestFactory(factory.DjangoModelFactory):
    class Meta:
        model = Test

    name = 'AssetDoge'
    value = 1


class CompanyFactory(factory.DjangoModelFactory):

    class Meta:
        model = Company

    name = factory.Sequence(lambda n: 'TestCompany%i' % n)
    description = 'TestDesc'
    numProducts = 0
    securityPosture = 0


class UserFactory(factory.DjangoModelFactory):

    class Meta:
        model = User

    username = factory.Sequence(lambda n: 'test%i' % n)
    password = 'Password!'
    firstName = 'Default'
    lastName = 'User'
    email = 'example@mail.com'
    company = factory.SubFactory(CompanyFactory)
    isAdmin = True


class AssetFactory(factory.DjangoModelFactory):

    class Meta:
        model = Asset

    name = factory.Sequence(lambda n: 'assetTest%i' % n)
    desc = 'This is an test asset'
    type = 'E'
    company = factory.SubFactory(CompanyFactory)
    version_num = '2.06'
    features = 'No features'
    host_address = '127.0.0.1'
    domain = 'None'
    mac_address = '00:50:56:81:01:e3'
    hist_data = 'There is history'
    owner = factory.SubFactory(UserFactory)
    business_crit = 'L'
    asset_dept = 'Research and Development'
    est_worth = '96000.00'
    platform = 'linux'


class ServiceFactory(factory.DjangoModelFactory):
    class Meta:
        model = Service

    port = 12
    service = 'A Service'
    description = 'This is a test service'
    assetID = factory.SubFactory(AssetFactory)


class VulnFactory(factory.DjangoModelFactory):

    class Meta:
        model = Vulnerability

    name = 'TestVuln'
    description = 'Desc'
    severity = 0
    dateDiscovered = '1985-01-01'
    dateModified = datetime.datetime.now()
    dateResolved = None
    actionPlan = 'git gud'
    solution = ''
    assetID = factory.SubFactory(AssetFactory)
    status = 'U'
    scanType = 'Z'
    reference = 'i dunno'
    cvssScore = '0.0'
