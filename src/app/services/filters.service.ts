import { Injectable } from '@angular/core';
import { Offer } from '../interfaces/offer';
import { FiltersValues } from '../interfaces/filters/filters-values';
import { BehaviorSubject, Observable } from 'rxjs';
import { UtilityService } from './utility.service';
import { CheckboxOption } from '../interfaces/filters/checkbox-option';

@Injectable({
    providedIn: 'root',
})
export class FiltersService {
    private filtersState$ = new BehaviorSubject<FiltersValues | null>(null);
    private baseFiltersState$ = new BehaviorSubject<FiltersValues | null>(null);
    // prettier-ignore
    private latestModifiedCheckboxDropdownName$ =
        new BehaviorSubject<string | null>(null);

    baseFiltersState!: FiltersValues;
    checkedDropdownsSequence: string[] = [];
    rangeDropdownsSequence: string[] = [];
    doneCount = 0;

    constructor(private utilityService: UtilityService) {}

    getFiltersState$(): Observable<FiltersValues | null> {
        return this.filtersState$.asObservable();
    }

    getBaseFiltersState$(): Observable<FiltersValues | null> {
        return this.baseFiltersState$.asObservable();
    }

    updateFiltersCheckboxOptions(
        filterName: string,
        newOptions: CheckboxOption[]
    ) {
        if (filterName === 'seatsAmount') filterName = 'seats';

        let oldOptions = this.filtersState$.value;
        oldOptions!.checkboxFilters[filterName].options = newOptions;
        this.filtersState$.next(oldOptions);

        if (
            this.checkedDropdownsSequence.find(
                (option) => option === filterName
            )
        ) {
            if (newOptions.find((option) => option.status === 'checked'))
                return;

            this.checkedDropdownsSequence =
                this.checkedDropdownsSequence.filter(
                    (option) => option !== filterName
                );
        } else {
            this.checkedDropdownsSequence.push(filterName);
        }
    }

    updateFiltersRangeOptions(
        filterName: string,
        generalfilterName: string,
        minOrMax: 'min' | 'max',
        value: number
    ) {
        let oldOptions = this.filtersState$.value;

        if (
            !this.rangeDropdownsSequence.find((option) => option === filterName)
        ) {
            this.rangeDropdownsSequence.push(filterName);
            oldOptions!.rangeFilters[
                filterName
            ].dynamicProperties.canShowValue = true;
        }

        oldOptions!.rangeFilters[generalfilterName + 'From'].dynamicProperties[
            minOrMax + 'Value'
        ] = value;
        oldOptions!.rangeFilters[generalfilterName + 'UpTo'].dynamicProperties[
            minOrMax + 'Value'
        ] = value;

        this.filtersState$.next(oldOptions);
    }

    clearAllCheckboxFiltersOptions() {
        let oldOptions = this.filtersState$.value;

        for (const [key, value] of Object.entries(
            oldOptions!.checkboxFilters
        )) {
            value.options.forEach((option) => {
                if (option.status === 'checked') option.status = 'available';
            });

            this.latestModifiedCheckboxDropdownName$.next(key);
        }

        this.filtersState$.next(oldOptions);
    }

    clearAllCheckboxFilterOptions(filterName: string) {
        let oldOptions = this.filtersState$.value;

        oldOptions?.checkboxFilters[filterName].options.forEach((option) => {
            if (option.status === 'checked') option.status = 'available';
        });

        this.latestModifiedCheckboxDropdownName$.next(filterName);
        this.filtersState$.next(oldOptions);
    }

    clearSingleCheckboxFilterOption(filterName: string, index: number) {
        let oldOptions = this.filtersState$.value;

        oldOptions!.checkboxFilters[filterName].options.at(index)!.status =
            'available';

        this.latestModifiedCheckboxDropdownName$.next(filterName);
        this.filtersState$.next(oldOptions);
    }

    getLatestModifiedCheckboxDropdownName(): Observable<string | null> {
        return this.latestModifiedCheckboxDropdownName$.asObservable();
    }

    clearAllRangeFiltersValues() {
        let oldOptions = this.filtersState$.value;

        for (const [key, value] of Object.entries(oldOptions!.rangeFilters)) {
            value.dynamicProperties.minValue =
                this.baseFiltersState.rangeFilters[
                    key
                ].dynamicProperties.minValue;

            value.dynamicProperties.maxValue =
                this.baseFiltersState.rangeFilters[
                    key
                ].dynamicProperties.maxValue;

            value.dynamicProperties.canShowValue = false;

            this.rangeDropdownsSequence = [];
        }

        this.filtersState$.next(oldOptions);
    }

    clearAllRangeFilterValues(generalFilterName: string) {
        let oldOptions = this.filtersState$.value;

        oldOptions!.rangeFilters[
            generalFilterName + 'From'
        ].dynamicProperties.minValue =
            this.baseFiltersState.rangeFilters[
                generalFilterName + 'From'
            ].dynamicProperties.minValue;

        oldOptions!.rangeFilters[
            generalFilterName + 'From'
        ].dynamicProperties.maxValue =
            this.baseFiltersState.rangeFilters[
                generalFilterName + 'From'
            ].dynamicProperties.maxValue;

        oldOptions!.rangeFilters[
            generalFilterName + 'UpTo'
        ].dynamicProperties.minValue =
            this.baseFiltersState.rangeFilters[
                generalFilterName + 'UpTo'
            ].dynamicProperties.minValue;

        oldOptions!.rangeFilters[
            generalFilterName + 'UpTo'
        ].dynamicProperties.maxValue =
            this.baseFiltersState.rangeFilters[
                generalFilterName + 'UpTo'
            ].dynamicProperties.maxValue;

        oldOptions!.rangeFilters[
            generalFilterName + 'UpTo'
        ].dynamicProperties.canShowValue = false;

        oldOptions!.rangeFilters[
            generalFilterName + 'From'
        ].dynamicProperties.canShowValue = false;

        this.rangeDropdownsSequence = this.rangeDropdownsSequence.filter(
            (dropdownName) =>
                dropdownName !== generalFilterName + 'From' &&
                dropdownName !== generalFilterName + 'UpTo'
        );

        this.filtersState$.next(oldOptions);
    }

    clearMinRangeFilterValue(generalFilterName: string) {
        let oldOptions = this.filtersState$.value;

        oldOptions!.rangeFilters[
            generalFilterName + 'From'
        ].dynamicProperties.minValue =
            this.baseFiltersState.rangeFilters[
                generalFilterName + 'From'
            ].dynamicProperties.minValue;

        oldOptions!.rangeFilters[
            generalFilterName + 'UpTo'
        ].dynamicProperties.minValue =
            this.baseFiltersState.rangeFilters[
                generalFilterName + 'UpTo'
            ].dynamicProperties.minValue;

        oldOptions!.rangeFilters[
            generalFilterName + 'From'
        ].dynamicProperties.canShowValue = false;

        this.rangeDropdownsSequence = this.rangeDropdownsSequence.filter(
            (dropdownName) => dropdownName !== generalFilterName + 'From'
        );

        this.filtersState$.next(oldOptions);
    }

    clearMaxRangeFilterValue(generalFilterName: string) {
        let oldOptions = this.filtersState$.value;

        oldOptions!.rangeFilters[
            generalFilterName + 'From'
        ].dynamicProperties.maxValue =
            this.baseFiltersState.rangeFilters[
                generalFilterName + 'From'
            ].dynamicProperties.maxValue;

        oldOptions!.rangeFilters[
            generalFilterName + 'UpTo'
        ].dynamicProperties.maxValue =
            this.baseFiltersState.rangeFilters[
                generalFilterName + 'UpTo'
            ].dynamicProperties.maxValue;

        oldOptions!.rangeFilters[
            generalFilterName + 'UpTo'
        ].dynamicProperties.canShowValue = false;

        this.rangeDropdownsSequence = this.rangeDropdownsSequence.filter(
            (dropdownName) => dropdownName !== generalFilterName + 'UpTo'
        );

        this.filtersState$.next(oldOptions);
    }

    assignInitialValues(offers: Offer[]) {
        const initialFiltersValues: FiltersValues = {
            checkboxFilters: {
                carBrands: {
                    name: 'carBrands',
                    displayedLabel: 'Car Brands',
                    isMultiSelect: true,
                    options: [],
                },
                fuelTypes: {
                    name: 'fuelTypes',
                    displayedLabel: 'Fuel Types',
                    isMultiSelect: true,
                    options: [],
                },
                gearboxTypes: {
                    name: 'gearboxTypes',
                    displayedLabel: 'Gearbox Types',
                    isMultiSelect: true,
                    options: [],
                },
                seats: {
                    name: 'seatsAmount',
                    displayedLabel: 'Seats Amount',
                    isMultiSelect: true,
                    options: [],
                },
            },
            rangeFilters: {
                priceFrom: {
                    staticProperties: {
                        name: 'priceFrom',
                        generalName: 'price',
                        displayedLabel: 'Price From',
                        suffix: 'zł',
                        minOrMax: 'min',
                        mask: 'separator',
                    },
                    dynamicProperties: {
                        canShowValue: false,
                        minValue: Math.min(
                            ...offers.map((offer) => offer.car.price)
                        ),
                        maxValue: Math.max(
                            ...offers.map((offer) => offer.car.price)
                        ),
                    },
                },
                priceUpTo: {
                    staticProperties: {
                        name: 'priceUpTo',
                        generalName: 'price',
                        displayedLabel: 'Price Up To',
                        suffix: 'zł',
                        minOrMax: 'max',
                        mask: 'separator',
                    },
                    dynamicProperties: {
                        canShowValue: false,
                        minValue: Math.min(
                            ...offers.map((offer) => offer.car.price)
                        ),
                        maxValue: Math.max(
                            ...offers.map((offer) => offer.car.price)
                        ),
                    },
                },

                horsePowerFrom: {
                    staticProperties: {
                        name: 'horsePowerFrom',
                        generalName: 'horsePower',
                        displayedLabel: 'HP From',
                        suffix: 'hp',
                        minOrMax: 'min',
                        mask: 'separator',
                    },
                    dynamicProperties: {
                        canShowValue: false,
                        minValue: Math.min(
                            ...offers.map((offer) => offer.car.horsePower)
                        ),
                        maxValue: Math.max(
                            ...offers.map((offer) => offer.car.horsePower)
                        ),
                    },
                },
                horsePowerUpTo: {
                    staticProperties: {
                        name: 'horsePowerUpTo',
                        generalName: 'horsePower',
                        displayedLabel: 'HP Up To',
                        suffix: 'hp',
                        minOrMax: 'max',
                        mask: 'separator',
                    },
                    dynamicProperties: {
                        canShowValue: false,
                        minValue: Math.min(
                            ...offers.map((offer) => offer.car.horsePower)
                        ),
                        maxValue: Math.max(
                            ...offers.map((offer) => offer.car.horsePower)
                        ),
                    },
                },

                engineSizeFrom: {
                    staticProperties: {
                        name: 'engineSizeFrom',
                        generalName: 'engineSize',
                        displayedLabel: 'Engine Size From',
                        suffix: 'cm³',
                        minOrMax: 'min',
                        mask: 'separator',
                    },
                    dynamicProperties: {
                        canShowValue: false,
                        minValue: Math.min(
                            ...offers.map((offer) => offer.car.engineCapacity)
                        ),
                        maxValue: Math.max(
                            ...offers.map((offer) => offer.car.engineCapacity)
                        ),
                    },
                },
                engineSizeUpTo: {
                    staticProperties: {
                        name: 'engineSizeUpTo',
                        generalName: 'engineSize',
                        displayedLabel: 'Engine Size Up To',
                        suffix: 'cm³',
                        minOrMax: 'max',
                        mask: 'separator',
                    },
                    dynamicProperties: {
                        canShowValue: false,
                        minValue: Math.min(
                            ...offers.map((offer) => offer.car.engineCapacity)
                        ),
                        maxValue: Math.max(
                            ...offers.map((offer) => offer.car.engineCapacity)
                        ),
                    },
                },

                productionYearFrom: {
                    staticProperties: {
                        name: 'productionYearFrom',
                        generalName: 'productionYear',
                        displayedLabel: 'Year From',
                        suffix: '',
                        minOrMax: 'min',
                        mask: '0000',
                    },
                    dynamicProperties: {
                        canShowValue: false,
                        minValue: Math.min(
                            ...offers.map((offer) => offer.car.productionYear)
                        ),
                        maxValue: Math.max(
                            ...offers.map((offer) => offer.car.productionYear)
                        ),
                    },
                },
                productionYearUpTo: {
                    staticProperties: {
                        name: 'productionYearUpTo',
                        generalName: 'productionYear',
                        displayedLabel: 'Year Up To',
                        suffix: '',
                        minOrMax: 'max',
                        mask: '0000',
                    },
                    dynamicProperties: {
                        canShowValue: false,
                        minValue: Math.min(
                            ...offers.map((offer) => offer.car.productionYear)
                        ),
                        maxValue: Math.max(
                            ...offers.map((offer) => offer.car.productionYear)
                        ),
                    },
                },

                mileageFrom: {
                    staticProperties: {
                        name: 'mileageFrom',
                        generalName: 'mileage',
                        displayedLabel: 'Mileage From',
                        suffix: 'km',
                        minOrMax: 'min',
                        mask: 'separator',
                    },
                    dynamicProperties: {
                        canShowValue: false,
                        minValue: Math.min(
                            ...offers.map((offer) => offer.car.mileage)
                        ),
                        maxValue: Math.max(
                            ...offers.map((offer) => offer.car.mileage)
                        ),
                    },
                },
                mileageUpTo: {
                    staticProperties: {
                        name: 'mileageUpTo',
                        generalName: 'mileage',
                        displayedLabel: 'Mileage Up To',
                        suffix: 'km',
                        minOrMax: 'max',
                        mask: 'separator',
                    },
                    dynamicProperties: {
                        canShowValue: false,
                        minValue: Math.min(
                            ...offers.map((offer) => offer.car.mileage)
                        ),
                        maxValue: Math.max(
                            ...offers.map((offer) => offer.car.mileage)
                        ),
                    },
                },
            },
        };

        this.baseFiltersState = structuredClone(
            this.calculateOptionsCount(initialFiltersValues, offers)
        );
        this.baseFiltersState$.next(this.baseFiltersState);

        this.filtersState$.next(
            this.calculateOptionsCount(initialFiltersValues, offers)
        );
    }

    filterOffers(filtersValues: FiltersValues, offers: Offer[]): Offer[] {
        offers = offers.filter((offer) => {
            let allOptionsAvailable: { [key: string]: boolean } = {
                carBrands: false,
                fuelTypes: false,
                gearboxTypes: false,
                seats: false,
            };

            for (const [key, value] of Object.entries(
                filtersValues.checkboxFilters
            )) {
                if (
                    value.options.every(
                        (option: CheckboxOption) =>
                            option.status === 'available'
                    )
                ) {
                    allOptionsAvailable[key] = true;
                } else {
                    allOptionsAvailable[key] = false;
                }
            }

            const {
                carBrands: { options: carBrandOptions },
                fuelTypes: { options: fuelTypesOptions },
                gearboxTypes: { options: gearboxTypesOptions },
                seats: { options: seatsOptions },
            } = filtersValues.checkboxFilters;

            for (const [key, value] of Object.entries(
                filtersValues.rangeFilters
            )) {
                if (
                    this.rangeDropdownsSequence.find(
                        (dropdownName) => dropdownName === key
                    )
                ) {
                    if (value.staticProperties.minOrMax === 'min')
                        value.dynamicProperties.maxValue =
                            this.baseFiltersState.rangeFilters[
                                key
                            ].dynamicProperties.maxValue;

                    if (value.staticProperties.minOrMax === 'max')
                        value.dynamicProperties.minValue =
                            this.baseFiltersState.rangeFilters[
                                key
                            ].dynamicProperties.minValue;
                } else {
                    value.dynamicProperties.minValue =
                        this.baseFiltersState.rangeFilters[
                            key
                        ].dynamicProperties.minValue;

                    value.dynamicProperties.maxValue =
                        this.baseFiltersState.rangeFilters[
                            key
                        ].dynamicProperties.maxValue;
                }
            }

            if (
                (carBrandOptions.length > 0 &&
                    !carBrandOptions.some((option) => {
                        if (
                            option.status === 'checked' ||
                            (allOptionsAvailable['carBrands'] === true &&
                                option.status === 'available')
                        ) {
                            return (
                                option.name ===
                                    offer.car.carBrand.toLowerCase() ||
                                option.name ===
                                    this.utilityService.capitalizeEveryWord(
                                        offer.car.carBrand
                                    )
                            );
                        } else {
                            return false;
                        }
                    })) ||
                (fuelTypesOptions.length > 0 &&
                    !fuelTypesOptions.some((option) => {
                        if (
                            option.status === 'checked' ||
                            (allOptionsAvailable['fuelTypes'] === true &&
                                option.status === 'available')
                        ) {
                            return option.name === offer.car.fuelType;
                        } else {
                            return false;
                        }
                    })) ||
                (gearboxTypesOptions.length > 0 &&
                    !gearboxTypesOptions.some((option) => {
                        if (
                            option.status === 'checked' ||
                            (allOptionsAvailable['gearboxTypes'] === true &&
                                option.status === 'available')
                        ) {
                            return option.name === offer.car.gearboxType;
                        } else {
                            return false;
                        }
                    })) ||
                (seatsOptions.length > 0 &&
                    !seatsOptions.some((option) => {
                        if (
                            option.status === 'checked' ||
                            (allOptionsAvailable['seats'] === true &&
                                option.status === 'available')
                        ) {
                            return option.name === String(offer.car.seats);
                        } else {
                            return false;
                        }
                    }))
            ) {
                return false;
            }

            const {
                priceFrom: {
                    dynamicProperties: { minValue: priceMinValue },
                },
                priceUpTo: {
                    dynamicProperties: { maxValue: priceMaxValue },
                },

                horsePowerFrom: {
                    dynamicProperties: { minValue: horsePowerMinValue },
                },
                horsePowerUpTo: {
                    dynamicProperties: { maxValue: horsePowerMaxValue },
                },

                engineSizeFrom: {
                    dynamicProperties: { minValue: engineSizeMinValue },
                },
                engineSizeUpTo: {
                    dynamicProperties: { maxValue: engineSizeMaxValue },
                },

                productionYearFrom: {
                    dynamicProperties: { minValue: productionYearMinValue },
                },
                productionYearUpTo: {
                    dynamicProperties: { maxValue: productionYearMaxValue },
                },

                mileageFrom: {
                    dynamicProperties: { minValue: mileageMinValue },
                },
                mileageUpTo: {
                    dynamicProperties: { maxValue: mileageMaxValue },
                },
            } = filtersValues.rangeFilters;

            if (
                (priceMinValue > 0 && offer.car.price < priceMinValue) ||
                (priceMaxValue > 0 && offer.car.price > priceMaxValue) ||
                (horsePowerMinValue > 0 &&
                    offer.car.horsePower < horsePowerMinValue) ||
                (horsePowerMaxValue > 0 &&
                    offer.car.horsePower > horsePowerMaxValue) ||
                (engineSizeMinValue > 0 &&
                    offer.car.engineCapacity < engineSizeMinValue) ||
                (engineSizeMaxValue > 0 &&
                    offer.car.engineCapacity > engineSizeMaxValue) ||
                (productionYearMinValue > 0 &&
                    offer.car.productionYear < productionYearMinValue) ||
                (productionYearMaxValue > 0 &&
                    offer.car.productionYear > productionYearMaxValue) ||
                (mileageMinValue > 0 && offer.car.mileage < mileageMinValue) ||
                (mileageMaxValue > 0 && offer.car.mileage > mileageMaxValue)
            ) {
                return false;
            }

            return true;
        });

        this.doneCount++;

        if (this.doneCount <= 2) {
            for (const [key, value] of Object.entries(
                filtersValues.checkboxFilters
            )) {
                value.options.forEach((option) => (option.count = 0));
            }
            this.calculateOptionsCount(filtersValues, offers);
        }

        if (this.doneCount > 2) {
            for (const [key, value] of Object.entries(
                filtersValues.checkboxFilters
            )) {
                if (key !== this.checkedDropdownsSequence.at(-1))
                    value.options.forEach((option) => (option.count = 0));
            }

            this.calculateFiltersValues(filtersValues, offers);
        }

        return offers;
    }

    calculateOptionsCount(
        filtersValues: FiltersValues,
        offers: Offer[]
    ): FiltersValues {
        offers.forEach((offer, i) => {
            for (const [key, value] of Object.entries(
                filtersValues.checkboxFilters
            )) {
                const existingOption = filtersValues.checkboxFilters[
                    key
                ].options.find(
                    (option: CheckboxOption) =>
                        option.name ===
                        String(
                            offer.car[key === 'seats' ? key : key.slice(0, -1)]
                        )
                );

                if (existingOption) {
                    existingOption.count++;
                } else {
                    filtersValues.checkboxFilters[key].options.push({
                        name: String(
                            offer.car[key === 'seats' ? key : key.slice(0, -1)]
                        ),
                        id: this.utilityService.generateRandomString(10),
                        count: 1,
                        status: 'available',
                    });
                }
            }
        });

        return filtersValues;
    }

    calculateFiltersValues(
        filtersValues: FiltersValues,
        offers: Offer[]
    ): FiltersValues {
        offers.forEach((offer, i) => {
            for (const [key, value] of Object.entries(
                filtersValues.checkboxFilters
            )) {
                if (key !== this.checkedDropdownsSequence.at(-1)) {
                    const existingOption = filtersValues.checkboxFilters[
                        key
                    ].options.find(
                        (option: CheckboxOption) =>
                            option.name ===
                            String(
                                offer.car[
                                    key === 'seats' ? key : key.slice(0, -1)
                                ]
                            )
                    );

                    if (existingOption) {
                        existingOption.count++;
                    }
                }

                if (
                    key === this.checkedDropdownsSequence[0] &&
                    this.checkedDropdownsSequence.length === 1
                ) {
                    filtersValues.checkboxFilters[key].options.forEach(
                        (option, i) => {
                            option.count =
                                this.baseFiltersState.checkboxFilters[
                                    key
                                ].options[i].count;
                        }
                    );
                }
            }
        });

        for (const [key, value] of Object.entries(filtersValues.rangeFilters)) {
            let carPropertyAccessKey = value.staticProperties.generalName;
            if (carPropertyAccessKey === 'engineSize')
                carPropertyAccessKey = 'engineCapacity';

            value.dynamicProperties.minValue = Math.min(
                ...offers.map((offer) => +offer.car[carPropertyAccessKey])
            );

            value.dynamicProperties.maxValue = Math.max(
                ...offers.map((offer) => +offer.car[carPropertyAccessKey])
            );
        }

        return filtersValues;
    }
}
