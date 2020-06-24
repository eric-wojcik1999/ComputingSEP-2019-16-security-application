import { Component, OnInit, ViewChild, Inject, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AccountsService } from './accounts.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export interface AccountsData{
    select: boolean;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    company: string;
    isAdmin: boolean;
}

export interface Company {
    id: number;
    name: string;
    description: string;
    numProducts: number;
    securityPosture: number;
}

export interface DialogData {
    select: any;
}

/* Company Info Array */
var COMPANY_DATA: Company[] = [];

@Component({
  selector: 'app-manually-manage-accounts',
  templateUrl: './manually-manage-accounts.component.html',
  styleUrls: ['./manually-manage-accounts.component.css']
})

export class ManuallyManageAccountsComponent implements OnInit {
    ACCOUNTS_DATA: AccountsData[] = [];
    displayedColumns: string[] = ['select', 'name', 'password', 'firstName', 'lastName', 'email', 'phone', 'company', 'isAdmin'];
    dataSource = new MatTableDataSource<AccountsData>(this.ACCOUNTS_DATA);
    selection = new SelectionModel<AccountsData>(true, []);
    // DO NOT DELETE THIS LINE, THIS IS BINDED TO THE CHECKBOXES
         /* Selects default of zero, means nothing has been check if a user tries to delete without checking*/
         chosenItem = 0                 /* Error message should appear */

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

    constructor(private accountService: AccountsService, public dialog: MatDialog, private fb: FormBuilder) { 
        
    }

    ngOnInit() {
      // Need to Get Company Data first, so you can translate ID's to names
      this.accountService.getCompanyData().subscribe((data: any[])=>{

          var tempArray = new Array<Company>()
          var length = Object.keys(data).length;
          for(var i=0; i<length; i++)
          {
              tempArray.push({id: data[i].id, name: data[i].name, description: data[i].description, numProducts: data[i].numProducts, securityPosture: data[i].securityPosture});
          }

          /* Create new array and shift the COMPANY_DATA up by one in the new array because ID values
         start at 1, not zero */
         for(var i=1; i<length+1; i++)
         {
              COMPANY_DATA[i] = tempArray[i-1]
         }
      });

      
        
      // Load all User Data upon page load
      this.accountService.getAccountInfo().subscribe((data: AccountsData[])=>{
          var length = Object.keys(data).length;
          for(var i=0; i<length; i++)
          {
              // Check for Administrator account
              var adminStatus;
              if (data[i].isAdmin == true)
              {
                  adminStatus = "Yes";
              }
              else
              {
                  adminStatus = "No";
              }
              // Find account name instead of account id
              this.ACCOUNTS_DATA.push({select: false, 
                                  username: data[i].username,
                                  password: data[i].password,
                                  firstName: data[i].firstName,
                                  lastName: data[i].lastName,
                                  email: data[i].email,
                                  phone: data[i].phone,
                                  company: COMPANY_DATA[data[i].company].name,    // Because the Account info returns the company ID, so I take the respective name
                                  isAdmin: adminStatus
              });
          }
          this.dataSource = new MatTableDataSource(this.ACCOUNTS_DATA);
          this.dataSource.paginator = this.paginator;
      });
  }
  /* Dialog Function for adding User accounts */
  openAddUser(): void {
    const dialogRef = this.dialog.open(AddUserDialog, {
        width: '40em',
    });
    dialogRef.afterClosed().subscribe(result => {
        var temp;
        temp = result;
        this.updateTable();
    })
  }

  // Dialog function for deleting a user
  openDelUser(): void {
        const dialogRef = this.dialog.open(DeleteUserDialog, {
            width: '40em',
            // Pass the chosen item into the dialog
            data: {name: this.chosenItem}
        });
        dialogRef.afterClosed().subscribe(result => {
            var temp;
            temp = result;
        });
  }


  // Dialog function for deleting a user
  openEditUser(item): void {
    const dialogRef = this.dialog.open(EditUserDialog, {
        width: '40em',
        // Pass the chosen item into the dialog
        data: {name: this.chosenItem,
               value: item}
    });
    dialogRef.afterClosed().subscribe(result => {
        var temp;
        temp = result;
        this.updateTable();
    });
}



updateTable() {
    this.ACCOUNTS_DATA = [];
    this.ngOnInit()
  }
}

// Add User Dialog
@Component({
    selector: 'add-user-dialog',
    templateUrl: 'add-user-dialog.html'
})

export class AddUserDialog {
    constructor(public dialogRef: MatDialogRef<AddUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ""){}
}

// Delete User Dialog
@Component({
    selector: 'delete-user-dialog',
    templateUrl: 'delete-user-dialog.html',
    styleUrls: ['./delete-user-dialog.css']
})

export class DeleteUserDialog {
    constructor(private accountService: AccountsService, public dialogRef: MatDialogRef<DeleteUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    // When the user selects to close the dialog
    public closeDialog()
    {
        this.dialogRef.close();
    }

    public confirmDelete(name)
    {
        // Make a Delete request at the specied username
        this.accountService.deleteUser(name).subscribe()
        alert("User Sucessfully Deleted...Not Really");
    }
}

// Edit User Dialog
@Component({
    selector: 'edit-user-dialog',
    templateUrl: 'edit-user-dialog.html'
})

export class EditUserDialog {
    // Object User to send requests to the server for adding/ediing users
    userObject = {password: '', firstname: '', lastname: '', email: '', phone: '', company: null, companyList: [], isAdmin: null};
    val = this.data.name; 
    

    // Information on each of the fields inside the form */
    edit_user_deets = this.formBuilder.group({
        firstname:            ['', Validators.required],
        lastname:             ['', Validators.required],
        password:             ['', Validators.required],
        confirm_password:     ['', Validators.required],
        email:                ['', Validators],
        phone:                ['', Validators],
        company:              ['', Validators.required],
        is_admin:             [false, Validators]
    });

    // Creates User and Adds to Database */
  editUser = () => {
    this.accountsApiService.editUser(this.userObject, this.data.name).subscribe(
        data => {
            // Close the Dialog, Alert the user, then refresh the table
             this.dialog.closeAll()
             alert("User: " + this.data.user.name + " edited sucessfully.");
        },
        error => {  
            alert("Failed to Edit user: Please check your form fields.")
        }
    )
  }


    companies : Company[] = []


    constructor(public dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private accountsApiService: AccountsService, public dialog: MatDialog){}


    ngOnInit() {
        this.accountsApiService.getCompanyData().subscribe((data: Company[])=>{
          var length = Object.keys(data).length;
          // Declare company so we can store the name and ID dynamically upon loading of the page
          this.companies = new Array<Company>(length);
          for(var i=0; i<length; i++)
          {
              this.companies[i] = {id: data[i].id, name: data[i].name, description: data[i].description, numProducts: data[i].numProducts, securityPosture: data[i].securityPosture};
          }
      });
    }

  
    // Submit Button on Add User
    public onSubmitEdit(username){
        var pass = this.edit_user_deets.get("password").value;
        var con_pass = this.edit_user_deets.get("confirm_password").value;
  
        // Check that the passwords are the same
        if(pass != con_pass)
        {
            alert("Ensure the Passwords are the same")
        }
        else
        {
            // Build the form
            this.userObject.password = this.edit_user_deets.get("password").value;
            this.userObject.firstname = this.edit_user_deets.get("firstname").value;
            this.userObject.lastname = this.edit_user_deets.get("lastname").value;
            this.userObject.email = this.edit_user_deets.get("email").value;
            this.userObject.phone = this.edit_user_deets.get("phone").value;
            this.userObject.company = this.edit_user_deets.get("company").value;
            this.userObject.companyList = [];
            this.userObject.isAdmin = this.edit_user_deets.get("is_admin").value;


            //console.log(this.userObject)

            this.editUser()
        }
    }
  
    // When the user selects to close the dialog
    public closeDialog()
    {
        this.dialog.closeAll();
    }




  

























}