import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    HostListener,
    Input,
    ViewChild,
    inject,
} from '@angular/core';
import { CheckboxInputComponent } from './dropdown-inputs/checkbox-input/checkbox-input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RangeInputComponent } from './dropdown-inputs/range-input/range-input.component';

@Component({
    selector: 'app-dropdown-menu',
    templateUrl: './dropdown-menu.component.html',
    styleUrls: ['./dropdown-menu.component.css'],
})
export class DropdownMenuComponent implements AfterViewInit {
    @Input() canShowValue: boolean = false;
    @Input() dropdownName!: string;
    @Input() dropdownWidth: number | string = 'full';
    searchTerm: string = '';
    arrowRotated: boolean = false;
    checkedOptionsCount: number = 0;
    rangeInputValue!: number;
    numberInputValue!: string;
    rangeInputMask!: string;
    rangeInputType!: 'min' | 'max';
    minVal!: number;
    maxVal!: number;

    destroyRef = inject(DestroyRef);

    @ContentChild(CheckboxInputComponent)
    checkboxInput!: CheckboxInputComponent;

    @ContentChild(RangeInputComponent)
    rangeInput!: RangeInputComponent;

    @HostListener('document:click', ['$event'])
    clickout(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.list.nativeElement.style.height = '0px';
            this.arrowRotated = false;

            if (this.checkboxInput && this.checkboxInput.applyButtonAvailable) {
                this.checkboxInput.applyAllOptions();
            }

            if (this.rangeInput && this.rangeInput.applyButtonAvailable) {
                this.rangeInput.applyInputValues();
            }
        }
    }

    @ViewChild('list', { read: ElementRef, static: false })
    list!: ElementRef;

    constructor(
        private elementRef: ElementRef,
        private cdr: ChangeDetectorRef
    ) {}

    ngAfterViewInit() {
        if (this.checkboxInput) {
            this.checkboxInput.calculateHeightEvent
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    if (this.list)
                        this.calculateHeight(this.list.nativeElement);
                });

            this.checkboxInput.checkedOptionsChangeEvent
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data: number) => {
                    this.checkedOptionsCount = data;
                });

            this.checkboxInput.dropdownCloseEvent
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    this.list.nativeElement.style.height = '0px';
                    this.arrowRotated = false;
                });
        }

        if (this.rangeInput) {
            this.rangeInput.rangeInputValueChangeEvent
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data) => {
                    this.rangeInputValue = data;
                });

            this.rangeInput.dropdownCloseEvent
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => {
                    this.list.nativeElement.style.height = '0px';
                    this.arrowRotated = false;
                });

            this.rangeInputMask = this.rangeInput.ngxMask;
            this.rangeInputType = this.rangeInput.minOrMax;
            this.rangeInputValue = this.rangeInput.currentRangeInputValue;
            this.numberInputValue = this.rangeInput.currentNumberInputValue;
            this.minVal = this.rangeInput.minVal;
            this.maxVal = this.rangeInput.maxVal;
            this.cdr.detectChanges();
        }
    }

    calculateHeight(element: any) {
        element.style.height =
            Array.prototype.reduce.call(
                element.childNodes,
                function (p, c) {
                    return p + (c.offsetHeight || 0);
                },
                0
            ) + 'px';
    }

    toggleExpand(element: any) {
        if (!element.style.height || element.style.height == '0px') {
            this.calculateHeight(element);
        } else {
            element.style.height = '0px';
        }
    }
}
