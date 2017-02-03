'use strict';

export default class SettingsController {
  user = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  errors = {
    other: undefined
  };
  message = '';
  infoMessage = '';
  submitted = false;

  info = {
    fullName: '',
    city: '',
    state: ''
  }

  /*@ngInject*/
  constructor(Auth) {
    this.Auth = Auth;
    this.getCurrentUser = Auth.getCurrentUser;
  }
  
  $onInit(){
    this.getCurrentUser()
      .then((info)=> {
        this.info = {
          fullName: info.fullName,
          city: info.city,
          state: info.state
        }
    })

  }
  
  changePassword(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
  }
  
  changeInformation(form) {
    if(form.$valid) {
      this.Auth.changeInformation(this.info)
        .then(() => {
          this.infoMessage = 'Information successfully changed.';
        })
        .catch(() => {
          this.infoMessage = 'There was an error changing your information.';
        });
    } else {
      this.infoMessage = 'Make sure the form is filled out completely.';
    }
  }
  
  
}
