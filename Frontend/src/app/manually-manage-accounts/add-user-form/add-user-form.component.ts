import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from '../accounts.service';
import { MatDialog } from '@angular/material';



// Interface for holding the Company Name and ID
export interface Company {
    id: number;
    name: string;
    description: string;
    numProducts: number;
    securityPosture: number;
}

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css']
})


export class AddUserFormComponent implements OnInit {

    // Object User to send requests to the server for adding/ediing users
    userObject = {username: '', password: '', firstname: '', lastname: '', email: '', phone: '', company: null, companyList: [], isAdmin: null};

    /* Information on each of the fields inside the form */
    add_user_deets = this.formBuilder.group({
        firstname:            ['', Validators.required],
        lastname:             ['', Validators.required],
        user_name:            ['', Validators.required],
        password:             ['', Validators.required],
        confirm_password:     ['', Validators.required],
        email:                ['', Validators],
        phone:                ['', Validators],
        company:              ['', Validators.required],
        is_admin:             [false, Validators]
    });


    // Creates User and Adds to Database */
    createUser = () => {
        this.accountsApiService.createUser(this.userObject).subscribe(
            data => {
                // Close the Dialog, Alert the user, then refresh the table
                this.dialog.closeAll()
                alert("User " + this.add_user_deets.get("user_name").value + " created sucessfully.");
                
            },
            error => {  
                alert("Failed to add user: Please check your form fields.")
            }
        )
    }

    /* Holds the Company Lists Names and ID's*/
    companies : Company[] = []

    constructor(private formBuilder: FormBuilder, private accountsApiService: AccountsService, public dialog: MatDialog) { }


  ngOnInit() {
      // Get all of the Company Data
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
    public onSubmitAdd(){
        var pass = this.add_user_deets.get("password").value;
        var con_pass = this.add_user_deets.get("confirm_password").value;

        // Check that the passwords are the same
        if(pass != con_pass)
        {
            alert("Ensure the Passwords are the same")
        }
        else
        {
            // Build the form
            this.userObject.username = this.add_user_deets.get("user_name").value;
            this.userObject.password = this.add_user_deets.get("password").value;
            this.userObject.firstname = this.add_user_deets.get("firstname").value;
            this.userObject.lastname = this.add_user_deets.get("lastname").value;
            this.userObject.email = this.add_user_deets.get("email").value;
            this.userObject.phone = this.add_user_deets.get("phone").value;
            this.userObject.company = this.add_user_deets.get("company").value;
            this.userObject.companyList = [];
            this.userObject.isAdmin = this.add_user_deets.get("is_admin").value;
            this.createUser()
        }
    }
}
