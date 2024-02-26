import { Injectable } from '@angular/core';
import { Offer } from '../interfaces/offer';
import { FiltersValues } from '../interfaces/filters/filters-values';
import { BehaviorSubject, of } from 'rxjs';
import { CheckboxFilter } from '../interfaces/filters/checkbox-filter';
import { UtilityService } from './utility.service';
import { CheckboxOption } from '../interfaces/filters/checkbox-option';

@Injectable({
    providedIn: 'root',
})
export class FiltersService {
    filtersState = new BehaviorSubject<FiltersValues | null>(null);

    constructor(private utilityService: UtilityService) {}

    assignStaticValues(offers: Offer[]) {
        const initialFiltersValues: FiltersValues = {
            checkboxFilters: {
                carBrands: {
                    staticProperties: {
                        name: 'carBrands',
                        displayedLabel: 'Car Brands',
                        isMultiSelect: true,
                    },
                    dynamicProperties: {
                        checkedOptions: [],
                        availableOptions: [],
                        unavailableOptions: [],
                    },
                },
                // carModels: {
                //     staticProperties: {
                //         name: 'carModels',
                //         displayedLabel: 'Car Models',
                //         isMultiSelect: true,
                //     },
                //     dynamicProperties: {
                //         checkedOptions: [],
                //         availableOptions: [],
                //         unavailableOptions: [],
                //     },
                // },
                fuelTypes: {
                    staticProperties: {
                        name: 'fuelTypes',
                        displayedLabel: 'Fuel Types',
                        isMultiSelect: true,
                    },
                    dynamicProperties: {
                        checkedOptions: [],
                        availableOptions: [],
                        unavailableOptions: [],
                    },
                },
                gearboxTypes: {
                    staticProperties: {
                        name: 'gearboxTypes',
                        displayedLabel: 'Gearbox Types',
                        isMultiSelect: true,
                    },
                    dynamicProperties: {
                        checkedOptions: [],
                        availableOptions: [],
                        unavailableOptions: [],
                    },
                },
                seats: {
                    staticProperties: {
                        name: 'seatsAmount',
                        displayedLabel: 'Seats Amount',
                        isMultiSelect: true,
                    },
                    dynamicProperties: {
                        checkedOptions: [],
                        availableOptions: [],
                        unavailableOptions: [],
                    },
                },
            },
            rangeFilters: {
                price: {
                    priceFrom: {
                        staticProperties: {
                            name: 'priceFrom',
                            displayedLabel: 'Price From',
                            suffix: 'zł',
                            minOrMax: 'min',
                            mask: 'separator',
                        },
                        dynamicProperties: {
                            minValue: Math.min(
                                ...offers.map((offer) => offer.price)
                            ),
                            maxValue: Math.max(
                                ...offers.map((offer) => offer.price)
                            ),
                        },
                    },
                    priceTo: {
                        staticProperties: {
                            name: 'priceUpTo',
                            displayedLabel: 'Price Up To',
                            suffix: 'zł',
                            minOrMax: 'max',
                            mask: 'separator',
                        },
                        dynamicProperties: {
                            minValue: Math.min(
                                ...offers.map((offer) => offer.price)
                            ),
                            maxValue: Math.max(
                                ...offers.map((offer) => offer.price)
                            ),
                        },
                    },
                },
                horsePower: {
                    horsePowerFrom: {
                        staticProperties: {
                            name: 'horsePowerFrom',
                            displayedLabel: 'HP From',
                            suffix: 'hp',
                            minOrMax: 'min',
                            mask: 'separator',
                        },
                        dynamicProperties: {
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
                            displayedLabel: 'HP Up To',
                            suffix: 'hp',
                            minOrMax: 'max',
                            mask: 'separator',
                        },
                        dynamicProperties: {
                            minValue: Math.min(
                                ...offers.map((offer) => offer.car.horsePower)
                            ),
                            maxValue: Math.max(
                                ...offers.map((offer) => offer.car.horsePower)
                            ),
                        },
                    },
                },
                engineSize: {
                    engineSizeFrom: {
                        staticProperties: {
                            name: 'engineSizeFrom',
                            displayedLabel: 'Engine Size From',
                            suffix: 'cm³',
                            minOrMax: 'min',
                            mask: 'separator',
                        },
                        dynamicProperties: {
                            minValue: Math.min(
                                ...offers.map(
                                    (offer) => offer.car.engineCapacity
                                )
                            ),
                            maxValue: Math.max(
                                ...offers.map(
                                    (offer) => offer.car.engineCapacity
                                )
                            ),
                        },
                    },
                    engineSizeUpTo: {
                        staticProperties: {
                            name: 'engineSizeUpTo',
                            displayedLabel: 'Engine Size Up To',
                            suffix: 'cm³',
                            minOrMax: 'max',
                            mask: 'separator',
                        },
                        dynamicProperties: {
                            minValue: Math.min(
                                ...offers.map(
                                    (offer) => offer.car.engineCapacity
                                )
                            ),
                            maxValue: Math.max(
                                ...offers.map(
                                    (offer) => offer.car.engineCapacity
                                )
                            ),
                        },
                    },
                },
                productionYear: {
                    productionYearFrom: {
                        staticProperties: {
                            name: 'productionYearFrom',
                            displayedLabel: 'Year From',
                            suffix: '',
                            minOrMax: 'min',
                            mask: 'separator',
                        },
                        dynamicProperties: {
                            minValue: Math.min(
                                ...offers.map(
                                    (offer) => offer.car.productionYear
                                )
                            ),
                            maxValue: Math.max(
                                ...offers.map(
                                    (offer) => offer.car.productionYear
                                )
                            ),
                        },
                    },
                    productionYearUpTo: {
                        staticProperties: {
                            name: 'productionYearUpTo',
                            displayedLabel: 'Year Up To',
                            suffix: '',
                            minOrMax: 'max',
                            mask: 'separator',
                        },
                        dynamicProperties: {
                            minValue: Math.min(
                                ...offers.map(
                                    (offer) => offer.car.productionYear
                                )
                            ),
                            maxValue: Math.max(
                                ...offers.map(
                                    (offer) => offer.car.productionYear
                                )
                            ),
                        },
                    },
                },
                mileage: {
                    mileageFrom: {
                        staticProperties: {
                            name: 'mileageFrom',
                            displayedLabel: 'Mileage From',
                            suffix: 'km',
                            minOrMax: 'min',
                            mask: 'separator',
                        },
                        dynamicProperties: {
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
                            displayedLabel: 'Mileage Up To',
                            suffix: 'km',
                            minOrMax: 'max',
                            mask: 'separator',
                        },
                        dynamicProperties: {
                            minValue: Math.min(
                                ...offers.map((offer) => offer.car.mileage)
                            ),
                            maxValue: Math.max(
                                ...offers.map((offer) => offer.car.mileage)
                            ),
                        },
                    },
                },
            },
        };

        offers.forEach((offer, i) => {
            for (const [key, value] of Object.entries(
                initialFiltersValues.checkboxFilters
            )) {
                const existingOption = initialFiltersValues.checkboxFilters[
                    key
                ].dynamicProperties.availableOptions.find(
                    (option: CheckboxOption) =>
                        option.optionName ===
                        offer.car[key === 'seats' ? key : key.slice(0, -1)]
                );

                if (existingOption) {
                    existingOption.count++;
                } else {
                    initialFiltersValues.checkboxFilters[
                        key
                    ].dynamicProperties.availableOptions.push({
                        optionName: String(
                            offer.car[key === 'seats' ? key : key.slice(0, -1)]
                        ),
                        id: this.utilityService.generateRandomString(10),
                        count: 1,
                        isChecked: false,
                    });
                }
            }
        });

        this.filtersState.next(initialFiltersValues);
    }
}
