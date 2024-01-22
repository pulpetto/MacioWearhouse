import { Component, Input } from '@angular/core';
import { RangeFilters } from 'src/app/interfaces/range-filters';
import { SearchingService } from 'src/app/services/searching.service';

@Component({
    selector: 'app-range-input',
    templateUrl: './range-input.component.html',
    styleUrls: ['./range-input.component.css'],
})
export class RangeInputComponent {
    @Input() minVal!: number;
    @Input() maxVal!: number;
    @Input() suffix: string = '';
    @Input() minimalValChange!: number;
    @Input() ngxMask: string = 'separator';
    @Input() connectedToFilter: RangeFilters | undefined;

    applyButtonDisabled: boolean = true;
    clearButtonDisabled: boolean = true;

    numberInputValue: string = '';
    rangeInputValue: number = 0;

    constructor(private searchingService: SearchingService) {}

    onNumberInput() {
        this.applyButtonDisabled = false;

        this.clearButtonDisabled =
            +this.numberInputValue === this.minVal ? true : false;

        this.rangeInputValue = +this.numberInputValue;
    }

    onRangeInput() {
        this.applyButtonDisabled = false;

        this.clearButtonDisabled =
            this.rangeInputValue === this.minVal ? true : false;

        if (this.minimalValChange)
            this.numberInputValue = (
                Math.round(this.rangeInputValue / this.minimalValChange) *
                this.minimalValChange
            ).toString();
    }

    applyInputValues() {
        if (this.connectedToFilter) {
            const filtersState = this.searchingService.getFiltersState();
            filtersState.rangeFilters[this.connectedToFilter] =
                this.rangeInputValue;
            this.searchingService.updateFiltersState(filtersState);
        }

        this.applyButtonDisabled = true;
    }

    clearInputValues() {
        if (this.connectedToFilter) {
            const filtersState = this.searchingService.getFiltersState();
            filtersState.rangeFilters[this.connectedToFilter] = this.minVal;
            this.searchingService.updateFiltersState(filtersState);
        }

        this.clearButtonDisabled = true;

        this.numberInputValue = '';
        this.rangeInputValue = this.minVal;
    }
}
