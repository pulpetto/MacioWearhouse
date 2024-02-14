import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {
    AngularFireDatabase,
    AngularFireList,
    AngularFireObject,
} from '@angular/fire/compat/database';
import { getDatabase, ref, set } from '@angular/fire/database';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, combineLatest, map, retry } from 'rxjs';
import { Offer } from '../interfaces/offer';
import { FilterModel } from '../interfaces/filter-model';
import { UtilityService } from './utility.service';
import { MultiselectDropdownOption } from '../interfaces/multiselect-dropdown-option';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userSubject = new BehaviorSubject<User | null>(null);

    private filtersState$ = new BehaviorSubject<FilterModel | null>(null);
    private baseFiltersValues$ = new BehaviorSubject<FilterModel | null>(null);
    private availableFiltersValues$ = new BehaviorSubject<FilterModel | null>(
        null
    );

    // prettier-ignore
    private multiselectDropdownsOptionsWithCount$ = new BehaviorSubject<{
        [key: string]: Map<string, MultiselectDropdownOption>;
    } | null>(null);

    constructor(
        private angularFireDatabase: AngularFireDatabase,
        private angularFireAuth: AngularFireAuth,
        private utilityService: UtilityService,
        private router: Router
    ) {}

    getMultiselectDropdownsOptionsWithCount$(): Observable<{
        [key: string]: Map<string, MultiselectDropdownOption>;
    } | null> {
        return this.multiselectDropdownsOptionsWithCount$;
    }

    getCurrentFiltersState(): FilterModel | null {
        return this.filtersState$.value;
    }

    getFiltersState$(): Observable<FilterModel | null> {
        return this.filtersState$.asObservable();
    }

    updateFiltersState(newState: FilterModel) {
        this.filtersState$.next(newState);
    }

    getAvailableFiltersValues$(): Observable<FilterModel | null> {
        return this.availableFiltersValues$.asObservable();
    }

    updateAvailableFiltersValues(newState: FilterModel) {
        this.availableFiltersValues$.next(newState);
    }

    getBaseFiltersValues$(): Observable<FilterModel | null> {
        return this.baseFiltersValues$.asObservable();
    }

    getBaseFiltersValues(): FilterModel | null {
        return this.baseFiltersValues$.value;
    }

    getOfferById(offerId: string): Observable<Offer | null> {
        return this.angularFireDatabase
            .list<Offer>('offers', (ref) =>
                ref.orderByChild('offerId').equalTo(offerId)
            )
            .valueChanges()
            .pipe(map((offers) => (offers.length ? offers[0] : null)));
    }

    // make it case-insensitive
    getOffersNamesBySearchTerm(
        searchTerm: string,
        username: string | null
    ): Observable<string[]> {
        const path = username ? `users/${username}/offers` : 'offers';

        return this.angularFireDatabase
            .list<Offer>(path, (ref) =>
                ref
                    .orderByChild('car/fullCarName')
                    .startAt(searchTerm)
                    .endAt(searchTerm + '\uf8ff')
                    .limitToFirst(10)
            )
            .valueChanges()
            .pipe(
                map((offers) =>
                    offers
                        .map((offer) =>
                            `${offer.car.fullCarName}`
                                .trim()
                                .replace(/\s+/g, ' ')
                        )
                        .filter(
                            (value, index, self) =>
                                self.indexOf(value) === index
                        )
                )
            );
    }

    getUserByUsername(username: string): Observable<User | null> {
        return combineLatest([
            this.angularFireDatabase
                .list<User>('users', (ref) =>
                    ref.orderByChild('username').equalTo(username)
                )
                .valueChanges()
                .pipe(map((users) => (users.length ? users[0] : null))),
            this.angularFireDatabase
                .list(`users/${username}/offers`)
                .valueChanges(),
        ]).pipe(
            map(([user, offersArray]) => {
                if (user && offersArray) {
                    user.offers = offersArray as Offer[];
                }
                return user;
            })
        );
    }

    getOffers(
        username: string | null,
        searchTerm: string | null,
        orderBy: string = 'ascending',
        sortBy: string = 'unixPublishDate',
        arrayStartIndex: number = 0,
        maxItemsPerPage: number = 10,
        sortingByCarProperties: boolean = false
    ): Observable<{
        offers: Offer[];
        offersAmount: number;
        pagesAmount: number;
    } | null> {
        let query;
        const offersPath = username ? `users/${username}/offers` : 'offers';
        const sortingBy = sortingByCarProperties ? `car/${sortBy}` : sortBy;

        if (searchTerm === null) {
            query = this.angularFireDatabase.list<Offer>(offersPath, (ref) =>
                ref.orderByChild(sortingBy)
            );
        } else {
            query = this.angularFireDatabase.list<Offer>(offersPath, (ref) =>
                ref
                    .orderByChild('car/fullCarName')
                    .startAt(searchTerm)
                    .endAt(searchTerm + '\uf8ff')
            );
        }

        return query.valueChanges().pipe(
            map((offers) => {
                if (this.filtersState$.value !== null)
                    offers = offers.filter((offer) => {
                        if (
                            this.filtersState$.value &&
                            this.filtersState$.value.multiOptionsFilters
                        ) {
                            const {
                                carBrands,
                                carModels,
                                fuelTypes,
                                gearboxTypes,
                                seatsAmount,
                            } = this.filtersState$.value.multiOptionsFilters;

                            if (
                                // FIX LATER - so that all created offers will have every property in lowercase // remove capitalization here
                                (carBrands.length > 0 &&
                                    !carBrands.includes(
                                        this.utilityService.capitalizeEveryWord(
                                            offer.car.carBrand
                                        )
                                    ) &&
                                    !carBrands.includes(
                                        offer.car.carBrand.toLowerCase()
                                    )) ||
                                // (carModels.length >= 0 &&
                                //     !carModels.includes(
                                //         offer.car.brandModel
                                //     )) ||
                                (fuelTypes.length > 0 &&
                                    !fuelTypes.includes(offer.car.fuelType)) ||
                                (gearboxTypes.length > 0 &&
                                    !gearboxTypes.includes(
                                        offer.car.gearboxType
                                    )) ||
                                (seatsAmount.length > 0 &&
                                    !seatsAmount.includes(
                                        offer.car.seats.toString()
                                    ))
                            ) {
                                return false;
                            }
                        }

                        if (
                            this.filtersState$.value &&
                            this.filtersState$.value.rangeFilters
                        ) {
                            const {
                                price: { priceFrom, priceTo },
                                horsePower: { horsePowerFrom, horsePowerTo },
                                engineSize: { engineSizeFrom, engineSizeTo },
                                productionYear: {
                                    productionYearFrom,
                                    productionYearTo,
                                },
                                mileage: { mileageFrom, mileageTo },
                            } = this.filtersState$.value.rangeFilters;

                            if (
                                (priceFrom > 0 && offer.price < priceFrom) ||
                                (priceTo > 0 && offer.price > priceTo) ||
                                (horsePowerFrom > 0 &&
                                    offer.car.horsePower < horsePowerFrom) ||
                                (horsePowerTo > 0 &&
                                    offer.car.horsePower > horsePowerTo) ||
                                (engineSizeFrom > 0 &&
                                    offer.car.engineCapacity <
                                        engineSizeFrom) ||
                                (engineSizeTo > 0 &&
                                    offer.car.engineCapacity > engineSizeTo) ||
                                (productionYearFrom > 0 &&
                                    offer.car.productionYear <
                                        productionYearFrom) ||
                                (productionYearTo > 0 &&
                                    offer.car.productionYear >
                                        productionYearTo) ||
                                (mileageFrom > 0 &&
                                    offer.car.mileage < mileageFrom) ||
                                (mileageTo > 0 && offer.car.mileage > mileageTo)
                            ) {
                                return false;
                            }
                        }

                        return true;
                    });

                const offersAmount = offers.length;
                const pagesAmount = Math.ceil(offers.length / maxItemsPerPage);

                if (!offers) return null;

                const propertyCounts: {
                    [key: string]: Map<string, MultiselectDropdownOption>;
                } = {
                    carBrands: new Map<
                        string,
                        { count: number; id: string; checked: boolean }
                    >(),
                    carModels: new Map<
                        string,
                        { count: number; id: string; checked: boolean }
                    >(),
                    fuelTypes: new Map<
                        string,
                        { count: number; id: string; checked: boolean }
                    >(),
                    gearboxTypes: new Map<
                        string,
                        { count: number; id: string; checked: boolean }
                    >(),
                    seatsAmount: new Map<
                        string,
                        { count: number; id: string; checked: boolean }
                    >(),
                };

                offers.forEach((offer) => {
                    propertyCounts['carBrands'].set(offer.car.carBrand, {
                        count:
                            (propertyCounts['carBrands'].get(offer.car.carBrand)
                                ?.count || 0) + 1,
                        id: this.utilityService.generateRandomString(10),
                        checked: false,
                    });
                    propertyCounts['fuelTypes'].set(offer.car.fuelType, {
                        count:
                            (propertyCounts['fuelTypes'].get(offer.car.fuelType)
                                ?.count || 0) + 1,
                        id: this.utilityService.generateRandomString(10),
                        checked: false,
                    });
                    propertyCounts['gearboxTypes'].set(offer.car.gearboxType, {
                        count:
                            (propertyCounts['gearboxTypes'].get(
                                offer.car.gearboxType
                            )?.count || 0) + 1,
                        id: this.utilityService.generateRandomString(10),
                        checked: false,
                    });
                    const seatsKey = offer.car.seats.toString();
                    propertyCounts['seatsAmount'].set(seatsKey, {
                        count:
                            (propertyCounts['seatsAmount'].get(seatsKey)
                                ?.count || 0) + 1,
                        id: this.utilityService.generateRandomString(10),
                        checked: false,
                    });
                });

                this.multiselectDropdownsOptionsWithCount$.next(propertyCounts);

                const availableFiltersValues: FilterModel = {
                    multiOptionsFilters: {
                        carBrands: Array.from(
                            new Set(offers.map((offer) => offer.car.carBrand))
                        ).sort((a, b) => a.localeCompare(b)),
                        carModels: [],
                        fuelTypes: Array.from(
                            new Set(offers.map((offer) => offer.car.fuelType))
                        ).sort((a, b) => a.localeCompare(b)),
                        gearboxTypes: Array.from(
                            new Set(
                                offers.map((offer) => offer.car.gearboxType)
                            )
                        ).sort((a, b) => a.localeCompare(b)),
                        seatsAmount: Array.from(
                            new Set(
                                offers.map((offer) =>
                                    offer.car.seats.toString()
                                )
                            )
                        ).sort((a, b) => a.localeCompare(b)),
                    },
                    rangeFilters: {
                        price: {
                            priceFrom: Math.min(
                                ...offers.map((offer) => offer.price)
                            ),
                            priceTo: Math.max(
                                ...offers.map((offer) => offer.price)
                            ),
                        },
                        horsePower: {
                            horsePowerFrom: Math.min(
                                ...offers.map((offer) => offer.car.horsePower)
                            ),
                            horsePowerTo: Math.max(
                                ...offers.map((offer) => offer.car.horsePower)
                            ),
                        },
                        engineSize: {
                            engineSizeFrom: Math.min(
                                ...offers.map(
                                    (offer) => offer.car.engineCapacity
                                )
                            ),
                            engineSizeTo: Math.max(
                                ...offers.map(
                                    (offer) => offer.car.engineCapacity
                                )
                            ),
                        },
                        productionYear: {
                            productionYearFrom: Math.min(
                                ...offers.map(
                                    (offer) => offer.car.productionYear
                                )
                            ),
                            productionYearTo: Math.max(
                                ...offers.map(
                                    (offer) => offer.car.productionYear
                                )
                            ),
                        },
                        mileage: {
                            mileageFrom: Math.min(
                                ...offers.map((offer) => offer.car.mileage)
                            ),
                            mileageTo: Math.max(
                                ...offers.map((offer) => offer.car.mileage)
                            ),
                        },
                    },
                };

                if (this.filtersState$.value === null) {
                    this.filtersState$.next(availableFiltersValues);
                    this.baseFiltersValues$.next(
                        JSON.parse(JSON.stringify(availableFiltersValues))
                    );
                }

                this.availableFiltersValues$.next(availableFiltersValues);

                if (orderBy === 'ascending') {
                    offers = offers.slice(
                        arrayStartIndex,
                        arrayStartIndex + maxItemsPerPage
                    );
                }

                if (orderBy === 'descending') {
                    offers = offers
                        .reverse()
                        .slice(
                            arrayStartIndex,
                            arrayStartIndex + maxItemsPerPage
                        );
                }

                const returnObj = {
                    offers: offers,
                    offersAmount,
                    pagesAmount,
                };

                return returnObj;
            })
        );
    }

    getOffersAmount(username: string | null): Observable<number | null> {
        const path = username ? `users/${username}/offers` : 'offers';

        return this.angularFireDatabase
            .list(path)
            .snapshotChanges()
            .pipe(map((changes) => (changes ? changes.length : null)));
    }

    setUser(user: User) {
        this.userSubject.next(user);
    }

    getUser(): Observable<User | null> {
        return this.userSubject.asObservable();
    }

    getUser2(): Observable<User | null> {
        return combineLatest([
            this.userSubject.asObservable(),
            this.angularFireDatabase
                .list(`users/${this.userSubject.value?.username}/offers`)
                .valueChanges(),
        ]).pipe(
            map(([user, offersArray]) => {
                if (user && offersArray) {
                    user.offers = offersArray as Offer[];
                }
                return user;
            })
        );
    }

    getUsers(): Observable<any[]> {
        return this.angularFireDatabase.list('users').valueChanges();
    }

    getUserOffers(): Observable<any> {
        return this.angularFireDatabase
            .list(`users/${this.userSubject.value?.username}/offers`)
            .valueChanges();
    }

    isLoggedIn(): Observable<boolean> {
        return this.userSubject
            .asObservable()
            .pipe(map((user: User | null) => !!user));
    }

    navigateToDashboard() {
        this.angularFireAuth.authState.subscribe((data) => {
            const routeUrl = `/account/${this.userSubject.value?.username}/${data?.uid}`;
            this.router.navigate([routeUrl]);
        });
    }

    addOffer(newOffer: Offer) {
        set(
            ref(
                this.angularFireDatabase.database,
                'offers/' + newOffer.offerId
            ),
            newOffer
        );

        set(
            ref(
                this.angularFireDatabase.database,
                'users/' +
                    this.userSubject.value?.username +
                    '/offers/' +
                    newOffer.offerId
            ),
            newOffer
        );
    }

    login(username: string, email: string, password: string) {
        this.getUsers().subscribe((users) => {
            const loggedUser = users.find((user) => user.username === username);

            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
            this.userSubject.next(loggedUser);
        });

        // should i do everything separetly or in .then() sequence
        this.angularFireAuth.signInWithEmailAndPassword(email, password);

        this.navigateToDashboard();
    }

    async signup(newUser: User) {
        // this.angularFireAuth
        //     .createUserWithEmailAndPassword(newUser.email, newUser.password)
        //     .then(() => {
        //         set(
        //             ref(
        //                 this.angularFireDatabase.database,
        //                 'users/' + newUser.username
        //             ),
        //             newUser
        //         );
        //     })
        //     .then(() => {
        //         this.login(newUser.username, newUser.email, newUser.password);
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });

        try {
            await this.angularFireAuth.createUserWithEmailAndPassword(
                newUser.email,
                newUser.password
            );

            await set(
                ref(
                    this.angularFireDatabase.database,
                    'users/' + newUser.username
                ),
                newUser
            );

            // foreach offer set, and also for fav
            await set(
                ref(
                    this.angularFireDatabase.database,
                    'users/' + newUser.username + '/offers'
                ),
                []
            );

            this.login(newUser.username, newUser.email, newUser.password);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    logout() {
        this.angularFireAuth
            .signOut()
            .then(() => {
                localStorage.removeItem('loggedUser');
                this.userSubject.next(null);
                this.router.navigate(['home']);
            })
            .catch((error) => {
                console.error('Sign-out error:', error);
            });
    }
}
