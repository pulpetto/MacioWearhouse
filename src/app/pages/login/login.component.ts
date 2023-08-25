import { Component } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    signupPromptVisibility!: boolean;

    constructor(private userService: UserService, private router: Router) {
        this.signupPromptVisibility = false;
    }

    loginForm = new FormGroup({
        username: new FormControl(
            '',
            [Validators.required],
            this.usernameValidator.bind(this)
        ),
        email: new FormControl(
            '',
            [Validators.required, Validators.email],
            this.emailValidator.bind(this)
        ),
        password: new FormControl('', [Validators.required]),
    });

    usernameValidator(
        control: AbstractControl
    ): Promise<ValidationErrors | null> {
        return new Promise((resolve, reject) => {
            if (
                !this.userService.users.some((user) => {
                    return user.username === control.value;
                })
            ) {
                resolve({ usernameDoestExist: true });
            } else {
                resolve(null);
            }
        });
    }

    emailValidator(control: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise((resolve, reject) => {
            if (
                !this.userService.users.some((user) => {
                    return user.email === control.value;
                })
            ) {
                resolve({ emailNotRegistered: true });
            } else {
                resolve(null);
            }
        });
    }

    onLogIn() {
        // check if user has account already
        // toggle singup prompt visibility
        // navigate to user dashboard
        // use .some() method
    }
}
