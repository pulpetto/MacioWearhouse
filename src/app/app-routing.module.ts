import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AccountComponent } from './pages/account/account.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OffersComponent } from './pages/account/offers/offers.component';
import { isLoggedGuard } from './guards/is-logged.guard';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [isLoggedGuard],
    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [isLoggedGuard],
    },
    // {
    //     path: 'account',
    //     // can there be no component show up
    //     // component: AccountComponent,
    //     canActivateChild: [authGuard],
    //     children: [
    //         {
    //             path: 'account',
    //             redirectTo: ':username/:userId/user-offers',
    //             pathMatch: 'full',
    //         },
    //         {
    //             path: ':username/:userId',
    //             component: AccountComponent,
    //             children: [
    //                 { path: 'user-offers', component: OffersComponent },
    //                 // { path: 'settings', component: UserSettingsComponent },
    //                 // { path: 'favourites', component: UserFavouritesComponent },
    //             ],
    //         },
    //     ],
    // },
    {
        path: 'account/:username/:userId',
        component: AccountComponent,
        // canActivateChild: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'offers',
                pathMatch: 'full',
            },
            { path: 'offers', component: OffersComponent },
            // { path: 'settings', component: UserSettingsComponent },
            // { path: 'favourites', component: UserFavouritesComponent },
        ],
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', pathMatch: 'full', component: NotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
