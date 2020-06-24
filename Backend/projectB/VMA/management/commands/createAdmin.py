from django.core.management.base import BaseCommand, CommandError
from VMA.models import User, Company


class Command(BaseCommand):
    help = 'This command adds an admin user'

    def handle(self, *args, **options):
        print('Please enter details to create administrator account')
        print('----------------------------------------------------')

        # get username
        username = input("Please enter username: ")

        # get email
        email = input("Please enter email address: ")

        # get password (2x)
        match = False
        while not match:
            pass1 = input("Please enter password: ")
            pass2 = input("Please confirm password: ")
            if pass1 == pass2:
                match = True
            else:
                print("Passwords did not match, try again \n")

        # create a default company
        comp_set = Company.objects.filter(name='DefaultCompany')
        if comp_set.count() != 1:
            Company.objects.create(name='DefaultCompany', description='default description', numProducts=0, securityPosture=0)

        # get the object for Foreign key
        comp = Company.objects.get(name='DefaultCompany')

        # create the user
        print('Creating account: ', username)
        User.objects.create(username=username, email=email, password=pass1, company=comp, isAdmin=True)
