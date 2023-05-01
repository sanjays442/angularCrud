import { Component } from '@angular/core';
import { ServicesService } from './services.service';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { User } from './user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private apiServices:ServicesService,
    private fb:FormBuilder
    ,
    private router:Router){}
  title = 'app';
  
  regForm!: FormGroup;
  User: User[] = [];
  res:any;
  isEditMode=false;
  editUserId:any;
  
  ngOnInit(): void {
    this.mainForm();
      this.getUser();
      this.setForm();
  }

  mainForm() {
    this.regForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      city: ['', [Validators.required]]

    })
  }
  onSubmit(userId:any){
    if(this.isEditMode){
      console.log(userId)
      
      this.apiServices.updateUser(userId,this.regForm.value).subscribe((res)=>{
        console.log("User Data Updated")
        this.getUser();

      });

      
    }else{
      console.log("1st")
      
      this.apiServices.addUser(this.regForm.value).subscribe(
        () => {
          this.regForm.reset();
          this.getUser();
  
  
        }
      )

    }

  }

  onEdit(userId:User){
    this.apiServices.selectedUser=userId;
    this.editUserId=userId;
    this.isEditMode=true;
    this.regForm.setValue({
      name:userId.name,
      email:userId.email,
      city:userId.city
    })


    console.log(userId)

  }

  // -- reset form
  setForm() {
    this.apiServices.selectedUser = {
      id: "",
      name: "",
      email: "",
      city: ""
    }
  }

  // -- get single data of user
  getSingleUser(id:string){
    this.apiServices.getUser(id).subscribe(data=>{
      this.res=data;
    })

  }

  //-- get all data 
  getUser() {
    this.apiServices.getUsers()
      .subscribe(data => {
        this.User = data;
        console.log(this.User)
      })
  }


  //------ delete user
  onDelete(id: string, i: any) {
    if (window.confirm('do you want to delete data')) {
      console.log("deleted data " + id);
      this.apiServices.deleteUser(id).subscribe(data => {
        this.User.splice(i, 1);
      });
    }







    //--- on edit 

  }
}