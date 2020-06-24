from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager
from rest_framework.serializers import ValidationError
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.

class MyUserManager(BaseUserManager):

    def create(self, password, companyList=None, **kwargs):
        """
        Create a user with default no perms.
        """
        if companyList is None:
            obj = self.model(companyList, **kwargs)
        else:
            obj = self.model(**kwargs)
        if obj.company is None:
            raise ValidationError({'company': 'This field may not be blank.'}, code='blank')
        obj.set_password(password)
        self._for_write = True
        obj.save(force_insert=True, using=self.db)
        if companyList is not None:
            obj.companyList.set(companyList)
        obj.companyList.add(obj.company)
        if not ('permissions' in kwargs):
            Perms.objects.create(owner=obj)
        elif kwargs.get('permissions') is None:
            Perms.objects.create(owner=obj)

        return obj


def flist():
    fl = [False, False, False, False, False]
    return fl.copy()


class User(AbstractBaseUser):
    username = models.CharField(max_length=20, primary_key=True)
    password = models.CharField(max_length=128)
    firstName = models.CharField(max_length=20)
    lastName = models.CharField(max_length=30)
    email = models.EmailField(default='example@email.com')
    phone = models.CharField(max_length=10, null=True, blank=True)
    company = models.ForeignKey('company', on_delete=models.SET_NULL, null=True)
    companyList = models.ManyToManyField('company', related_name='usersAll', default=[company])
    isAdmin = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username

#yes im just storing it as plaintext for now because it's a lot easier for testing
    #def check_password(self, raw_password):
     #   return raw_password == self.password


#Permissions list for users
class Perms(models.Model):
    owner = models.OneToOneField(User, related_name='permissions', on_delete=models.CASCADE)
    test = ArrayField(models.BooleanField(default=False), size=5, default=flist())
    user = ArrayField(models.BooleanField(default=False), size=5, default=flist())
    asset = ArrayField(models.BooleanField(default=False), size=5, default=flist())
    vulnerability = ArrayField(models.BooleanField(default=False), size=5, default=flist())
    company = ArrayField(models.BooleanField(default=False), size=5, default=flist())
    perms = ArrayField(models.BooleanField(default=False), size=5, default=flist())
    report = ArrayField(models.BooleanField(default=False), size=5, default=flist())
    service = ArrayField(models.BooleanField(default=False), size=5, default=flist())
    fileUpload = ArrayField(models.BooleanField(default=False), size=5, default=flist())


# Vulnerability Model
class Vulnerability(models.Model):
    SCAN_CHOICES = [
        ('Z', 'Zap'),
        ('Nes', 'Nessus'),
        ('Nex', 'Nexpose'),
        ('Nm', 'Nmap'),
        ('M', 'Manual Input')
    ]  # Selection options for scanType field

    STATUSES = [
        ('A', 'Accepted'),  # Not going to be fixed
        ('U', 'Unhandled'),  # Someone is going to fix/is fixing
        ('M', 'Mitigated'),  # Has been fixed
        ('N', 'Unassigned'),  # No-one is assigned to fix
        ('F', 'False positive')  # Not actually a vuln, will be removed
    ]  # Available status types

    vulnID = models.AutoField(primary_key=True)  # Not sure if its good idea to add max length or not
    name = models.CharField(max_length=256)
    description = models.TextField(blank=True)
    severity = models.IntegerField()
    dateDiscovered = models.DateField()
    dateModified = models.DateField(auto_now=True)
    dateResolved = models.DateField(null=True)
    actionPlan = models.TextField(blank=True)  # Not sure if this is a text field or nah?
    solution = models.TextField(blank=True)  # Is allowed to be blank, only selected tools support
    assetID = models.ForeignKey('Asset', on_delete=models.CASCADE)  # Should delete the vulns if the Asset is deleted
    status = models.CharField(max_length=16, choices=STATUSES)  # Can only choose from the enforced status types
    scanType = models.CharField(max_length=10, choices=SCAN_CHOICES)  # need to create choice/type enforcement
    reference = models.TextField(blank=True)  # maybe a way to store links?
    cvssScore = models.DecimalField(max_digits=2, decimal_places=1, null=True)


# Services Model
class Service(models.Model):
    port = models.IntegerField()
    service = models.CharField(max_length=256)
    description = models.TextField(blank=True)  # this can also contain the version info
    assetID = models.ForeignKey('Asset', on_delete=models.CASCADE)


class Company(models.Model):
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=300)
    numProducts = models.IntegerField()
    securityPosture = models.IntegerField()


# Asset model class
class Asset(models.Model):
    TYPE_CHOICES = [
        ('E', 'Endpoint'),  # device with an IP address capable of connecting to the company’s network.
        ('Prod', 'Product'),  # software that you could perform a code review on e.g. the company’s website.
        ('AUTO', 'Auto-created from vulnerability read'),
    ]  # Selection options for type field

    CRIT_CHOICES = [
        ('0', 'None'),
        ('VL', 'Very Low'),
        ('L', 'Low'),
        ('M', 'Medium'),
        ('H', 'High'),
        ('VH', 'Very High'),
    ]

    name = models.CharField(max_length=255, default='')
    desc = models.CharField(max_length=4000)
    type = models.CharField(max_length=16, choices=TYPE_CHOICES)
    company = models.ForeignKey('Company', on_delete=models.CASCADE)  # FK
    version_num = models.CharField(max_length=150, null=True) # Made a char to accommodate for version
    # numbers such as 3.0.7, etc
    features = models.TextField(null=True)
    host_address = models.CharField(max_length=450, null=True)  # Can be included with port number or
    # 'domain.com'
    domain = models.CharField(max_length=450, null=True)
    mac_address = models.CharField(max_length=450, null=True)  # Hardware address
    hist_data = models.TextField(null=True)
    owner = models.ForeignKey('User', on_delete=models.SET_NULL, null=True)
    business_crit = models.CharField(max_length=9, choices=CRIT_CHOICES, null=True)
    asset_dept = models.CharField(max_length=30, null=True)
    est_worth = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    platform = models.CharField(max_length=30, null=True)

    @property
    def company_name(self):
        return self.asset_company.name