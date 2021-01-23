import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
// import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from '../_helpers/must-match.validator';

import { AccountService, AlertService } from '../_services';

declare var $: any;  // Declaring $ as a variable so that we can use it to access jQuery

@Component({ templateUrl: 'register.component.html' })

export class RegisterComponent implements OnInit {
    // roles: string[] = ['USER', 'ADMIN'];
    // default: string = 'USER';
    // Role Names
    Role: any = ['USER', 'ADMIN']  
    default: string = 'USER';

    form: FormGroup;    
    loading = false;
    submitted = false;  
    // model: NgbDateStruct;    
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        // $("#datepicker-1").datepicker()
        // .on("changeDate", function(date) {
        //     this.from = date;
        // });
       


        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
             // validates date format yyyy-mm-dd
             dob: ['', [Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
             email: ['', [Validators.required, Validators.email]],
             password: ['', [Validators.required, Validators.minLength(6)]],
             confirmPassword: ['', Validators.required],
             roleName: ['', Validators.required]
        },{
            validator: MustMatch('password', 'confirmPassword')            
        });
    }
    // Choose city using select dropdown
    changeRole(e) {
        console.log(e.value)
        this.roleName.setValue(e.target.value, {
        onlySelf: true
        })
    }

    // Getter method to access formcontrols
    get roleName() {
        return this.form.get('roleName');
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}