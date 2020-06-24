from rest_framework import serializers
from rest_framework.utils import model_meta
from VMA.models import *
from rest_framework.fields import SkipField
from rest_framework.relations import PKOnlyObject

from collections import OrderedDict


class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ('id', 'name', 'description', 'numProducts', 'securityPosture')

    def create(self, validated_data):
        return Company.objects.create(**validated_data)


class UserSerializer(serializers.ModelSerializer):

    companyList = serializers.PrimaryKeyRelatedField(many=True, read_only=False, required=False, queryset=Company.objects.all())
    #companyList = CompanySerializer(many=True, required=False)
    #password = serializers.SerializerMethodField(read_only=False)

    class Meta:
        model = User
        fields = ('username', 'password', 'firstName', 'lastName', 'email', 'phone', 'company', 'companyList', 'isAdmin')

        def validate_company(self, value):
            if value is None:
                raise serializers.ValidationError({'company': 'This field may not be blank.'}, code='blank')
            return value

    def to_representation(self, instance):
        ret = OrderedDict()
        fields = self._readable_fields
        for field in fields:
            try:
                attribute = field.get_attribute(instance)
                if field.field_name == 'password' and len(attribute.split("$")) == 4:
                    attribute = attribute.split("$")[3]
            except SkipField:
                continue

            check_for_none = attribute.pk if isinstance(attribute, PKOnlyObject) else attribute
            if check_for_none is None:
                ret[field.field_name] = None
            else:
                ret[field.field_name] = field.to_representation(attribute)

        return ret

    def update(self, instance, validated_data):
        if validated_data.get('password') is not None:
            if validated_data.get('password') != instance.password.split("$")[3]:
                validated_data['password'] = make_password(validated_data.get('password'))
            else:
                validated_data['password'] = instance.password
        instance = serializers.ModelSerializer.update(self, instance, validated_data)
        return instance

    def create(self, validated_data):
        companyL = []
        if len(validated_data.get('companyList')) == 0:
            cList = validated_data.pop('companyList')
        instance = User.objects.create(**validated_data)
        if len(companyL) > 0:
            for comp in companyL:
                instance.companyList.add(comp)
        return instance
'''
    def update(self, instance, validated_data):
        info = model_meta.get_field_info(instance)

        print("B", info.relations)
        for attr, value in validated_data.items():
            print("C", attr, value)
            if attr in info.relations and info.relations[attr].to_many:
                field = getattr(instance, attr)
                print("D", value)
                val2 = list()
                for comp in value:
                    print("DD", comp.items(), list(comp.items()), dict(list(comp.items())))
                    val2.append(dict(list(comp.items())))
                print("DDD", val2)
                field.set(val2)
            else:
                setattr(instance, attr, value)
        instance.save()

        return instance
'''

'''
{
    "username": "17",
    "password": "1",
    "firstName": "1",
    "lastName": "1",
    "email": "a@a.com",
    "phone": "",
    "company": 0,
    "companyList": [{
                "id": 0,
                "name": "VMADefault",
                "description": "VMA Dev",
                "numProducts": 1,
                "securityPosture": 0
            }, {
                "id": 2,
                "name": "b",
                "description": "b",
                "numProducts": 1,
                "securityPosture": 1
            }],
    "isAdmin": false
}
'''
class PermSerializer(serializers.ModelSerializer):

    class Meta:
        model = Perms
        fields = ('id', 'owner', 'test', 'user', 'asset', 'vulnerability', 'company', 'perms', 'report', 'service', 'fileUpload')


class VulnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vulnerability
        fields = ('vulnID', 'name', 'description', 'severity', 'dateDiscovered', 'dateModified', 'dateResolved',
                  'actionPlan', 'solution', 'assetID', 'status', 'scanType', 'reference', 'cvssScore')
        extra_kwargs = {'vulnID': {'read_only': True}}  # Prevents people messing with vuln ID's

    def create(self, validated_data):
        # create new Vuln
        return Vulnerability.objects.create(**validated_data)


class CompanyRelatedField(serializers.RelatedField):  # Custom Company FK field method
    # defines how company fk is displayed
    def display_value(self, instance):
        return instance.name

    # defines what company fk is output as in JSON - this is so it displays as the name instead of id
    def to_representation(self, value):
        rep = value.name
        return str(rep)

    # defines what company fk can be taken as - this is so you can input the company name instead of id
    def to_internal_value(self, data):
        return Company.objects.get(name=data)


class AssetSerializer(serializers.ModelSerializer):
    company = CompanyRelatedField(queryset=Company.objects.all(), many=False)

    class Meta:
        model = Asset
        fields = ('id', 'name', 'desc', 'type', 'company', 'version_num', 'features', 'host_address', 'domain',
                  'mac_address', 'hist_data', 'owner', 'business_crit', 'asset_dept', 'est_worth', 'platform')

    def create(self, validated_data):
        return Asset.objects.create(**validated_data)


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'port', 'service', 'description', 'assetID')

    def create(self, validated_data):
        return Service.objects.create(**validated_data)


# Contains serializers for all the models it should have access to
class ReportSerializer(serializers.Serializer):
    vulns = VulnSerializer(many=True)
    company = CompanySerializer(many=True)
    assets = AssetSerializer(many=True)


