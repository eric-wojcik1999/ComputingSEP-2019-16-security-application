import re
from rest_framework import status
from rest_framework.response import Response
from django.http.response import JsonResponse, HttpResponse
from rest_framework.decorators import api_view, renderer_classes, action
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from django.contrib.auth.views import LoginView
from rest_framework.utils import json

from projectB.authentication import CustAuthForm
from rest_framework import viewsets
from VMA.serializers import *
from VMA.models import *
from rest_framework.exceptions import ValidationError
from rest_framework_jwt.utils import jwt_encode_handler, jwt_payload_handler


# imports below this are Eric's imports
from django.core import serializers  # For report gen viewset
from django.db import connection, transaction # For report gen viewset
from collections import namedtuple  # For report gen viewset
from django.db.models.query import QuerySet
from django.core.exceptions import FieldError, ObjectDoesNotExist
from datetime import date

# imports below this is Renan's imports (Doing this so we know who is doing what)
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser
from VMA.FileReader import fileHandlerXML, fileHandlerCSV
from rest_framework.authentication import SessionAuthentication
import datetime
from django.db.models import Avg, F

class RestrictiveViewSet(viewsets.ModelViewSet):
    modelName = None

    def get_companyC(self, request): # get intended company of object from request
        model = self.serializer_class.Meta.model.__name__.lower()
        if (model == 'asset'):
            company = request.data.get('company') # if asset, get intended company of asset
        elif (model == 'vulnerability' or model == 'service'):
            company = str(Asset.objects.get(id=int(request.data.get('assetID'))).company.pk) # if vuln or service, get company of intended owner asset
        elif (model == 'perms'):
            company = str(User.objects.get(username=(request.data.get('owner'))).company.pk) # if perm, get company of intended owner
        return company

    def get_companyU(self): # get company of object user is trying to edit
        model = self.serializer_class.Meta.model.__name__.lower()
        try:
            if (model == 'asset'):
                company = self.get_object().company.pk
            elif (model == 'vulnerability' or model == 'service'):
                company = self.get_object().assetID.company.pk
            elif (model == 'perms'):
                company = self.get_object().owner.company.pk
        except (FieldError, AttributeError):
            print('Something went wrong with the company restrictive view trying to find the company pk. Tell Hamish.')
        return company

    def get_queryset(self):
        model = self.serializer_class.Meta.model.__name__.lower()
        queryset = self.serializer_class.Meta.model.objects.none()
        if self.request.user.isAdmin:  # if admin, then don't restrict
            queryset = self.queryset
        elif model == 'asset':  # have to check for different models, as each of their companies is retrieved differently
            for comp in self.request.user.companyList.all():  # create combined queryset of all user's companies
                queryset = queryset | self.serializer_class.Meta.model.objects.filter(company=comp)

        elif model == 'vulnerability' or model == 'service':
            for comp in self.request.user.companyList.all():
                queryset = queryset | self.serializer_class.Meta.model.objects.filter(assetID__company=comp)

        elif model == 'perms':
            for comp in self.request.user.companyList.all():
                queryset = queryset | self.serializer_class.Meta.model.objects.filter(owner__company=comp)

        if self.request.GET != {}:
            for param in self.request.GET:
                if param == 'assetID' or param == 'company' or param == 'owner':
                    para = {'filter': {param: self.request.GET.get(param)}}
                else:
                    para = {'filter': {param+'__contains': self.request.GET.get(param)}}
                try:
                    queryset = queryset.filter(**para['filter'])
                except (FieldError, AttributeError):
                    print('\"'+param+'\"', 'field not found when filtering', model)

        if isinstance(queryset, QuerySet):
            # Ensure queryset is re-evaluated on each request.
            queryset = queryset.all()
        return queryset

    def create(self, request, *args, **kwargs):
        allowed = False
        if request.user.isAdmin:
            allowed = True
        else:
            for comp in request.user.companyList.all():  # check if user isn't trying to make something outside their companies
                if self.get_companyC(request) == str(comp.pk):
                    allowed = True

        if (allowed is True):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def update(self, request, *args, **kwargs):
        allowed = False
        if request.user.isAdmin:
            allowed = True
        else:
            for comp in request.user.companyList.all():
                all2 = False
                if self.get_companyU() == comp.pk: # check if object user is trying to update is owned by one of their companies
                    all2 = True
                    for comp in request.user.companyList.all():
                        if all2 is True and self.get_companyC(request) == str(comp.pk): # if object is in their company, check that they're not trying to change it to a company they're not in
                            allowed = True
        if allowed is True:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class AssetViewSet(RestrictiveViewSet):
    """
        Asset Menu:
        /assets for create and list
        /assets/assetID for retrieve, update, partial_update and destroy
    """

    model = Asset
    serializer_class = AssetSerializer  # Defines the associated object class (methods and such).
    queryset = Asset.objects.all()


class CompanyViewSet(viewsets.ModelViewSet):
    """
       /company for create and list
       /company/companyID for retrieve, update, partial_update and destroy
    """
    serializer_class = CompanySerializer
    queryset = Company.objects.all()

    def get_queryset(self):

        queryset = self.serializer_class.Meta.model.objects.none()
        if self.request.user.isAdmin:  # if admin, then don't restrict
            queryset = self.queryset
        else:
            for comp in self.request.user.companyList.all(): # create combined queryset of all user's companies
                queryset = queryset | self.serializer_class.Meta.model.objects.filter(id=comp.id)

        if self.request.GET != {}:
            for param in self.request.GET:
                para = {'filter': {param + '__contains': self.request.GET.get(param)}}
                try:
                    queryset = queryset.filter(**para['filter'])
                except (FieldError, AttributeError):
                    print('\"'+param+'\"', 'field not found when filtering Company')

        if isinstance(queryset, QuerySet):
            # Ensure queryset is re-evaluated on each request.
            queryset = queryset.all()

        return queryset


# Have to use a custom viewset instead of model viewset due to serializer limit


class ReportViewSet(viewsets.ViewSet):
    """
       A simple ViewSet for listing the Assets, Vulns and Companies
    """
    permName = 'report'

    @action(detail=False, methods=['get', 'post'])
    def vuln_based(self, request):
        input_data = (json.loads(request.body))  # Converts string query into readable object

        ReportObject = namedtuple('ReportObject', ('assets', 'vulns', 'company'))
        assets = Asset.objects.all()
        vulns = Vulnerability.objects.all()
        companies = Company.objects.all()

        start_date_string = input_data['start']
        start_dates = []
        end_date_string = input_data['end']
        end_dates = []
        company_name = input_data['company']
        vuln_ids = input_data['vulns']
        owner = input_data['owner']
        dt_discovered = input_data['date-type']['discovered']
        dt_modified = input_data['date-type']['modified']
        dt_mitigated = input_data['date-type']['mitigated']
        owner_exists = True
        company_exists = True

        # Parses start date string into Y-M-D
        if start_date_string is not None:
            start_dates = start_date_string.split('-')
            start_dates = [int(i) for i in start_dates]

        # Parses end date string into Y-M-D
        if end_date_string is not None:
            end_dates = end_date_string.split('-')
            end_dates = [int(i) for i in end_dates]

        # Test whether there is an existing owner by the specified name
        if owner:  # If owner is not empty string
            try:
                User.objects.get(username=owner)
            except ObjectDoesNotExist:
                owner_exists = False

        # Test whether there is an existing company by the specified name
        try:
            Company.objects.get(name=company_name)
        except ObjectDoesNotExist:
            company_exists = False

        if company_exists:
            if owner_exists:
                vulns = Vulnerability.objects.filter(vulnID__in=vuln_ids, assetID__owner=owner, assetID__company__name=company_name).distinct()
            else:
                vulns = Vulnerability.objects.filter(vulnID__in=vuln_ids, assetID__company__name=company_name).distinct()

            companies = Company.objects.filter(name=company_name)

            # Obtain new filtered list of asset ids (in case an owner has none of the specified assets)
            temp_vulns = str(vulns)
            new_vuln_ids = re.findall(r'\d+(?:\.\d+)?', temp_vulns)

            if vulns:  # If temp_list is populated

                # These status filters stack so if both 'discovered' and 'mitigated' true, it will filter vulns with
                # both if both dates are within the range
                if dt_discovered:
                    vulns = Vulnerability.objects.filter(vulnID__in=new_vuln_ids,
                                                         dateDiscovered__range=(date(start_dates[0],
                                                                                     start_dates[1],
                                                                                     start_dates[2]),
                                                                                date(end_dates[0],
                                                                                     end_dates[1],
                                                                                     end_dates[2]))).distinct()
                if dt_mitigated == "True":
                    vulns = Vulnerability.objects.filter(vulnID__in=new_vuln_ids,
                                                         dateResolved__range=(date(start_dates[0],
                                                                                   start_dates[1],
                                                                                   start_dates[2]),
                                                                              date(end_dates[0],
                                                                                   end_dates[1],
                                                                                   end_dates[2]))).distinct()
                if dt_modified == "True":
                    vulns = Vulnerability.objects.filter(vulnID__in=new_vuln_ids,
                                                         dateModified__range=(date(start_dates[0],
                                                                                   start_dates[1],
                                                                                   start_dates[2]),
                                                                              date(end_dates[0],
                                                                                   end_dates[1],
                                                                                   end_dates[2]))).distinct()

                if dt_discovered != "True" and dt_mitigated != "True" and dt_modified != "True":
                    vulns = Vulnerability.objects.filter(vulnID__in=new_vuln_ids,
                                                         dateDiscovered__range=(date(start_dates[0],
                                                                                     start_dates[1],
                                                                                     start_dates[2]),
                                                                                date(end_dates[0],
                                                                                     end_dates[1],
                                                                                     end_dates[2]))).distinct()
                assets = Asset.objects.filter(vulnerability__vulnID__in=new_vuln_ids).distinct()
        else:
            assets = Asset.objects.none()
            companies = Company.objects.none()
            vulns = Vulnerability.objects.none()

        report = ReportObject(
            assets=assets,
            vulns=vulns,
            company=companies,
        )
        serializer = ReportSerializer(report)
        return Response(serializer.data)

    @action(detail=False, methods=['get', 'post'])
    def asset_based(self, request):
        input_data = (json.loads(request.body))  # Converts string query into readable object
        ReportObject = namedtuple('ReportObject', ('assets', 'vulns', 'company'))
        assets = Asset.objects.all()
        vulns = Vulnerability.objects.all()
        companies = Company.objects.all()

        start_date_string = input_data['start']
        start_dates = []
        end_date_string = input_data['end']
        end_dates = []
        company_name = input_data['company']
        asset_ids = input_data['assets']
        owner = input_data['owner']
        dt_discovered = input_data['date-type']['discovered']
        dt_modified = input_data['date-type']['modified']
        dt_mitigated = input_data['date-type']['mitigated']
        owner_exists = True
        company_exists = True

        # Parses start date string into Y-M-D
        if start_date_string is not None:
            start_dates = start_date_string.split('-')
            start_dates = [int(i) for i in start_dates]

        # Parses end date string into Y-M-D
        if end_date_string is not None:
            end_dates = end_date_string.split('-')
            end_dates = [int(i) for i in end_dates]

        # Test whether there is an existing owner by the specified name
        if owner:  # If owner is not empty string
            try:
                User.objects.get(username=owner)
            except ObjectDoesNotExist:
                owner_exists = False

        # Test whether there is an existing company by the specified name
        try:
            Company.objects.get(name=company_name)
        except ObjectDoesNotExist:
            company_exists = False

        if company_exists:
            if owner_exists:
                assets = Asset.objects.filter(id__in=asset_ids, owner=owner, company__name=company_name).distinct()
            else:
                assets = Asset.objects.filter(id__in=asset_ids, company__name=company_name).distinct()

            companies = Company.objects.filter(name=company_name).distinct()

            # Obtain new filtered list of asset ids (in case an owner has none of the specified assets)
            temp_assets = str(assets)
            new_asset_ids = re.findall(r'\d+(?:\.\d+)?', temp_assets)  # Extracts integers within brackets

            if assets:  # If the assets queryset is populated
                # These status filters stack so if both 'discovered' and 'mitigated' true, it will filter vulns with
                # both if both dates are within the range
                if dt_discovered == "True":
                    vulns = Vulnerability.objects.filter(assetID__in=new_asset_ids,
                                                         dateDiscovered__range=(date(start_dates[0],
                                                                                     start_dates[1],
                                                                                     start_dates[2]),
                                                                                date(end_dates[0],
                                                                                     end_dates[1],
                                                                                     end_dates[2]))).distinct()
                if dt_mitigated == "True":
                    vulns = Vulnerability.objects.filter(assetID__in=new_asset_ids,
                                                         dateResolved__range=(date(start_dates[0],
                                                                                   start_dates[1],
                                                                                   start_dates[2]),
                                                                              date(end_dates[0],
                                                                                   end_dates[1],
                                                                                   end_dates[2]))).distinct()
                if dt_modified == "True":
                    vulns = Vulnerability.objects.filter(assetID__in=new_asset_ids,
                                                         dateModified__range=(date(start_dates[0],
                                                                                   start_dates[1],
                                                                                   start_dates[2]),
                                                                              date(end_dates[0],
                                                                                   end_dates[1],
                                                                                   end_dates[2]))).distinct()

                if dt_discovered != "True" and dt_mitigated != "True" and dt_modified != "True":
                    vulns = Vulnerability.objects.filter(assetID__in=new_asset_ids,
                                                         dateDiscovered__range=(date(start_dates[0],
                                                                                     start_dates[1],
                                                                                     start_dates[2]),
                                                                                date(end_dates[0],
                                                                                     end_dates[1],
                                                                                     end_dates[2]))).distinct()
        else:
            assets = Asset.objects.none()
            companies = Company.objects.none()
            vulns = Vulnerability.objects.none()

        report = ReportObject(
            assets=assets,
            vulns=vulns,
            company=companies,
        )
        serializer = ReportSerializer(report)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    """
    epic
    """

    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self):
        if self.request.user.isAdmin:
            queryset = self.queryset
        else:
            queryset = self.serializer_class.Meta.model.objects.none()
            for comp in self.request.user.companyList.all(): # create combined queryset of all user's companies
                queryset = queryset | self.serializer_class.Meta.model.objects.filter(company=comp).exclude(isAdmin=True)

        if self.request.GET != {}:
            for param in self.request.GET:
                if param == 'company':
                    para = {'filter': {param: self.request.GET.get(param)}}
                else:
                    para = {'filter': {param+'__contains': self.request.GET.get(param)}}
                try:
                    queryset = queryset.filter(**para['filter'])
                except (FieldError, AttributeError):
                    print('\"'+param+'\"', 'field not found when filtering User')

        if isinstance(queryset, QuerySet):
            # Ensure queryset is re-evaluated on each request.
            queryset = queryset.all()

        return queryset

    def create(self, request, *args, **kwargs):
        allowed = False
        if request.user.isAdmin:
            allowed = True
        else:
            for comp in request.user.companyList:
                if str(comp.pk) == str(request.data.get('company')) and request.data.get('isAdmin') is None:
                    allowed = True
        if  allowed is True: # ensure user is either admin, or not trying to create an admin or a user for another company
            if request.user.isAdmin or (request.data.get('companyList') is None or ((len(request.data.get('companyList')) == 1) and str(request.data.get('companyList')[0]) == str(request.user.company.pk))): # ensure non admins either don't define companyList, or it only includes their company.
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def update(self, request, *args, **kwargs):
        admin = self.get_object().isAdmin
        if request.data.get('isAdmin') is not None: # not trying to alter admin status
            admin = True
        if not request.user.isAdmin and request.data.get('companyList') is not None: # non admins can't touch companyLists
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if request.data.get('company') is not None and self.get_object().companyList.filter(pk=request.data.get('company')).count() != 1: # prevent chenging user's active company to something not in their companyList
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if request.data.get('companyList') is not None and self.get_object().company.pk not in request.data.get('companyList'): # prevent removing active company from companyList
            raise ValidationError({'companyList': 'Cannot remove active company from company list.'})
        if request.user.isAdmin or (self.get_object().company.pk == request.user.company.pk and admin is False): # allows if user is admin, or if target user is in same company as logged in user and they're not trying to alter admin status
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class PermViewSet(RestrictiveViewSet):
    """
    Generally don't touch
    """

    serializer_class = PermSerializer
    queryset = Perms.objects.all()


class CustomLoginView(LoginView):
    authentication_form: CustAuthForm

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            user = form.get_user()
            payload = jwt_payload_handler(user)
            token = 'Bearer ' + jwt_encode_handler(payload)
            response = self.form_valid(form)
            response['Authorization'] = token
            return response
        else:
            return self.form_invalid(form)


class VulnerabilityViewSet(RestrictiveViewSet):
    """
    Vulnerability Menu:
    /vulnerability for create and list
    /vulnerability/vulnID for retrieve, update, partial_update and destroy
     """

    serializer_class = VulnSerializer
    queryset = Vulnerability.objects.all()


class ServicesViewSet(RestrictiveViewSet):
    """
   Services Menu:
     for create and list
     for retrieve, update, partial_update and destroy
     """

    serializer_class = ServiceSerializer
    queryset = Service.objects.all()
    # basic viewset as not needing custom fields currently


class FileUploadView(APIView):
    """
    --- A view that can accept File type content ---
    This view is from the XML File Upload Request Handler.
    It will handle a post (Creating) request for a file type data.
    The data will then be sent to file reader.
    """

    permName = 'fileUpload'

    parser_classes = (FileUploadParser,)

    def post(self, request, filename, format=None):

        file_obj = request.FILES['file']
        
        if file_obj.name.endswith('.xml') or file_obj.name.endswith('.nessus'):
            response = fileHandlerXML(file_obj, request)

        elif file_obj.name.endswith('.csv'):
            response = fileHandlerCSV(file_obj, request)

        else:
            response = Response("Please Upload a Supported File type")

        return JsonResponse(response, safe=False)

class DashboardView_Unresolved(APIView):

    def get(self, request, company_id, format=None):
        responseArray = []

        '''
        The code below is querysets for unresolved vulns
        '''

        # Grab All Unresolved Vulns
        vulnerability_unresolved = Vulnerability.objects.filter(assetID__company=company_id, status='U').count()
        response_vulnerability = {"vulnerability_unresolved": vulnerability_unresolved}
        responseArray.append(response_vulnerability)

        # Grab All Critical Severity Unresolved Vuln
        critVuln_unresolved = Vulnerability.objects.filter(assetID__company=company_id, status='U',
                                                           severity='100').count()
        response_critVuln = {"critical": critVuln_unresolved}
        responseArray.append(response_critVuln)

        # Grab All High Severity Unresolved Vuln
        highVuln_unresolved = Vulnerability.objects.filter(assetID__company=company_id, status='U',
                                                           severity='75').count()
        response_highVuln = {"high": highVuln_unresolved}
        responseArray.append(response_highVuln)

        # Grab All Medium Severity Unresolved Vuln
        mediumVuln_unresolved = Vulnerability.objects.filter(assetID__company=company_id, status='U',
                                                             severity='50').count()
        response_mediumVuln = {"medium": mediumVuln_unresolved}
        responseArray.append(response_mediumVuln)

        # Grab All Low Severity Unresolved Vuln
        lowVuln_unresolved = Vulnerability.objects.filter(assetID__company=company_id, status='U',
                                                          severity='25').count()
        response_lowVuln = {"low": lowVuln_unresolved}
        responseArray.append(response_lowVuln)

        # Grab All None Severity Unresolved Vuln
        noneVuln_unresolved = Vulnerability.objects.filter(assetID__company=company_id, status='U',
                                                           severity='0').count()
        response_noneVuln = {"none": noneVuln_unresolved}
        responseArray.append(response_noneVuln)

        asset = Asset.objects.filter(company_id=company_id).count()
        response_asset = {"asset":asset}
        responseArray.append(response_asset)

        return JsonResponse(responseArray)


class DashboardView_Resolved(APIView):

    def get(self, request, company_id, format=None):

        responseArray = []

        today = datetime.date.today()
        dateCount = datetime.timedelta(days=14)
        dueDate = today - dateCount
        '''
        The code below is the querysets for resolved vulnerabilities
        '''
        # Grab All Resolved Vulns
        vulnerability_resolved = Vulnerability.objects.filter(assetID__company=company_id, status='M').count()
        response_vulnerability = {"vulnerability_resolved_total":vulnerability_resolved}
        responseArray.append(response_vulnerability)

        # Grab All Resolved Vulns in the last 2 weeks
        resolveVuln = Vulnerability.objects.filter(assetID__company=company_id, status='M',
                                                   dateResolved__range=(dueDate, today)).count()
        response_vulnerability_twoWeeks = {"vulnerability_resolved_twoWeek":resolveVuln}
        responseArray.append(response_vulnerability_twoWeeks)

        # Grab All Resolved Critical Vulns
        critVuln_resolved = Vulnerability.objects.filter(assetID__company=company_id, status='M',
                                                           severity='100').count()
        response_critVuln = {"critical": critVuln_resolved}
        responseArray.append(response_critVuln)

        # Grab All Resolved High Vulns
        highVuln_resolved = Vulnerability.objects.filter(assetID__company=company_id, status='M',
                                                           severity='75').count()
        response_highVuln = {"high": highVuln_resolved}
        responseArray.append(response_highVuln)

        # Grab All Resolved Medium Vulns
        mediumVuln_resolved = Vulnerability.objects.filter(assetID__company=company_id, status='M',
                                                           severity='50').count()
        response_mediumVuln = {"medium": mediumVuln_resolved}
        responseArray.append(response_mediumVuln)

        # Grab All Resolved Low Vulns
        lowVuln_resolved = Vulnerability.objects.filter(assetID__company=company_id, status='M',
                                                           severity='25').count()
        response_lowVuln = {"low": lowVuln_resolved}
        responseArray.append(response_lowVuln)

        # Grab All Resolved None Vulns
        noneVuln_resolved = Vulnerability.objects.filter(assetID__company=company_id, status='M',
                                                           severity='0').count()
        response_noneVuln = {"none": noneVuln_resolved}
        responseArray.append(response_noneVuln)

        # Grab the AVG of Vulns resolved TOTAL
        avgTotal = Vulnerability.objects.filter(assetID__company=company_id, status='M')
        totalTime = avgTotal.aggregate(average_difference=Avg(F('dateResolved') - F('dateDiscovered')))
        responseArray.append(totalTime)

        # Grab the AVG of Vulns resolved in the LAST 2 weeks
        avgTwoWeeks = Vulnerability.objects.filter(assetID__company=company_id, status='M',
                                                   dateResolved__range=(dueDate, today))
        twoWeeksTime = avgTwoWeeks.aggregate(average_difference_twoweeks=Avg(F('dateResolved') - F('dateDiscovered')))
        responseArray.append(twoWeeksTime)

        asset = Asset.objects.filter(company_id=company_id).count()
        response_asset = {"asset":asset}
        responseArray.append(response_asset)

        return JsonResponse(responseArray, safe=False)