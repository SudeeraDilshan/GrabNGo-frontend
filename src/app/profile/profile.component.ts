// profile.component.ts

import { Component } from '@angular/core';
import { ProfileService } from '../services/profile.service';  // Import ProfileService

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  // Profile Data
  profile = {
    firstName: 'Harry',
    lastName: 'Porter',
    address: 'New York',
    mobile: '+12 245 486',
    email: 'harry@gmail.com',
  };

  // Backup for canceling edits
  backupProfile = { ...this.profile };

  // Edit Mode State
  isEditing = false;

  // Profile Picture URL (initial/default picture)
  profilePictureUrl = 'https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png';

  // Injecting the ProfileService into the component's constructor
  constructor(private profileService: ProfileService) {}

  // Toggle Edit Mode
  toggleEdit() {
    this.isEditing = true;
  }

  // Save Edited Profile
  saveProfile() {
    this.profileService.updateProfile(this.profile).subscribe(
      (response) => {
        console.log('Profile updated successfully');
        this.backupProfile = { ...this.profile }; // Save changes
        this.isEditing = false;
        alert('Profile updated successfully!');
      },
      (error) => {
        console.error('Error saving profile', error);
        alert('Failed to update profile. Please try again.');
      }
    );
  }
  

  // Cancel Edits
  cancelEdit() {
    this.profile = { ...this.backupProfile }; // Revert to backup
    this.isEditing = false;
  }
  onProfilePicUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePictureUrl = e.target.result; // Update preview with the selected image
      };
      reader.readAsDataURL(file);
  
      // Upload to server
      this.profileService.uploadProfilePicture(file).subscribe(
        (response) => {
          console.log('Profile picture uploaded successfully');
          // Update with the new image URL from the server
          this.profilePictureUrl = response.profilePictureUrl;
        },
        (error) => {
          console.error('Error uploading profile picture', error);
        }
      );
    }
  }
  

  // Delete Account
  deleteAccount() {
    this.profileService.deleteAccount().subscribe(
      (response) => {
        console.log('Account deleted successfully');
        // Optionally, redirect user after deletion
        window.location.href = '/login'; // Example: Redirect to login page after account deletion
      },
      (error) => {
        console.error('Error deleting account', error);
      }
    );
  }

  // Change Password
  changePassword() {
    // You can navigate to a change-password page or open a modal here
    // In this example, we'll navigate to '/change-password'
    window.location.href = '/change-password';
  }
}
