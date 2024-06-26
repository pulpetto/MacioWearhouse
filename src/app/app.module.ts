import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
    provideAnalytics,
    getAnalytics,
    ScreenTrackingService,
    UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import {
    provideFirestore,
    getFirestore,
    FirestoreModule,
} from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import {
    provideRemoteConfig,
    getRemoteConfig,
} from '@angular/fire/remote-config';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { HeaderComponent } from './header/header.component';
import { InputComponent } from './shared/input/input.component';
import { AccountComponent } from './pages/account/account.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { NotFoundComponent } from './not-found/not-found.component';
import { OfferComponent } from './shared/offer/offer.component';
import { OffersComponent } from './pages/account/offers/offers.component';
import { SettingsComponent } from './pages/account/settings/settings.component';
import { FavouritesComponent } from './pages/account/favourites/favourites.component';
import { OfferCreatorComponent } from './pages/account/offer-creator/offer-creator.component';
import { ModalComponent } from './shared/modal/modal.component';
import { A11yModule } from '@angular/cdk/a11y';
import { TooltipDirective } from './directives/tooltip.directive';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { OfferFullViewComponent } from './shared/offer-full-view/offer-full-view.component';
import { FooterComponent } from './footer/footer.component';
import { NumberSeparatorDirective } from './directives/number-separator.directive';
import { LoadingComponent } from './shared/loading/loading.component';
import { UserComponent } from './pages/user/user.component';
import { OffersPreviewComponent } from './pages/user/offers-preview/offers-preview.component';
import { DropdownMenuComponent } from './shared/dropdown-menu/dropdown-menu.component';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './shared/search-bar/search-bar.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CheckboxInputComponent } from './shared/dropdown-menu/dropdown-inputs/checkbox-input/checkbox-input.component';
import { RangeInputComponent } from './shared/dropdown-menu/dropdown-inputs/range-input/range-input.component';
import { CamelcaseToNormalCapitalizedPipe } from './pipes/camelcase-to-normal-capitalized.pipe';
import { OffersFiltersComponent } from './pages/user/offers-preview/offers-filters/offers-filters.component';
import { CheckboxOptionsSortingPipe } from './pipes/checkbox-options-sorting.pipe';
import { ToastComponent } from './shared/toast/toast.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        InputComponent,
        AccountComponent,
        HomeComponent,
        LoginComponent,
        SignupComponent,
        NotFoundComponent,
        OfferComponent,
        OffersComponent,
        SettingsComponent,
        FavouritesComponent,
        OfferCreatorComponent,
        ModalComponent,
        TooltipDirective,
        NumberFormatPipe,
        OfferFullViewComponent,
        FooterComponent,
        NumberSeparatorDirective,
        LoadingComponent,
        UserComponent,
        OffersPreviewComponent,
        DropdownMenuComponent,
        SearchBarComponent,
        CheckboxInputComponent,
        RangeInputComponent,
        CamelcaseToNormalCapitalizedPipe,
        OffersFiltersComponent,
        CheckboxOptionsSortingPipe,
        ToastComponent,
    ],
    imports: [
        A11yModule,
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        provideFirestore(() => getFirestore()),
        provideFunctions(() => getFunctions()),
        provideMessaging(() => getMessaging()),
        providePerformance(() => getPerformance()),
        provideRemoteConfig(() => getRemoteConfig()),
        provideStorage(() => getStorage()),
        FirestoreModule,
        AngularFireModule,
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule,
    ],
    providers: [
        ScreenTrackingService,
        UserTrackingService,
        { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
        provideNgxMask(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
