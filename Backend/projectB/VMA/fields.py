from django.db import models
# Fields module stores any custom model field types


# Integer range model
# Allows int fields to be constrained to a range e.g. between 1-50
# Usage: x = models.IntegerRangeField(max_value = a, min_value =b)
class IntegerRangeField(models.IntegerField):
    def __init__(self, verbose_name=None, name=None, min_value=None, max_value=None, **kwargs):
        self.min_value, self.max_value = min_value, max_value
        models.IntegerField.__init__(self, verbose_name, name, **kwargs)

    def formfield(self, **kwargs):
        defaults = {'min_value': self.min_value, 'max_value':self.max_value}
        defaults.update(kwargs)
        return super(IntegerRangeField, self).formfield(**defaults)
