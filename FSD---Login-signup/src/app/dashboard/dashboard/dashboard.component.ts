import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profiles/services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  createProfileButton = false;

  constructor(private profileService:ProfileService, private router:Router){}

  createProfile(){
    this.router.navigate(['/profiles/create-profile']);
  }

  ngOnInit(): void {
      console.log("Inside the dashboard and ngOnInit");
      this.profileService.getCurrentUserProfile().subscribe(
        (res) => {
          console.log("success..."+res);
          localStorage.setItem('profile',JSON.stringify(res));
        },
        (err) => {
          this.createProfileButton = true;
          console.log('failed...'+JSON.stringify(err));
        }
      );
  }

}
