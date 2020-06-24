from rest_framework.permissions import BasePermission
from VMA.models import User


class FuncPermission(BasePermission):
    permMap = {'GET': 0,
               'POST': 1,
               'PUT': 2,
               'DELETE': 3,
               'OPTIONS': 4, }

    def has_permission(self, request, view):
        ok = False
        try:
            method = request._request.META.get('REQUEST_METHOD')
            if (method == 'PATCH'):
                method = 'PUT'
            if (method == 'GET' and request._request.get_full_path() == '/'):
                return request.user.is_authenticated
            elif (request.user.is_authenticated and request.user.isAdmin):
                ok = True
            elif (request.user.is_authenticated):
                try:
                    apiName = view.serializer_class.Meta.model.__name__.lower()
                except AttributeError:
                    apiName = view.permName
                if (apiName == 'company' and method != 'GET'):
                    ok = request.user.isAdmin
                else:
                    ok = getattr(request.user.permissions, apiName)[self.permMap.get(method)]
        except AttributeError:
            raise AttributeError('This API hasn\'t been added to the permission system properly. Disable the permission class in the settings and bother Hamish about it.')
        return ok

    def has_object_permission(self, request, view, obj):
        return True
