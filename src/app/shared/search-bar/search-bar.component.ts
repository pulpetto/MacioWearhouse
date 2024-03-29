import {
    ChangeDetectorRef,
    Component,
    HostListener,
    OnInit,
    Renderer2,
} from '@angular/core';
import { Observable } from 'rxjs';
import { SearchingService } from 'src/app/services/searching.service';
import { VisibilityService } from 'src/app/services/visibility.service';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
    routeUsername$!: Observable<string | null>;
    isSearchBarFocused$!: Observable<boolean | null>;
    autocompleteOptions$!: Observable<string[] | null>;
    // prettier-ignore
    autocompleteOptionsLetters$!:Observable<{
        letter: string;
        match: boolean;
    }[][] | null>;
    searchTerm: string = '';

    // only for visual effect
    isSearchBarFocused: boolean = false;

    searchingHistory: string[] = [];
    showHistoryDeletedNotification: boolean = false;
    showHistoryModal: boolean = false;

    constructor(
        private visibilityService: VisibilityService,
        private searchingService: SearchingService,
        private cdr: ChangeDetectorRef,
        private renderer: Renderer2
    ) {}

    ngOnInit() {
        this.routeUsername$ = this.searchingService.getRouteUsername();

        this.searchingService.getSearchTerm().subscribe((data) => {
            if (data) this.searchTerm = data;
            if (!data) this.searchTerm = '';
            this.cdr.detectChanges();
        });

        this.searchingHistory =
            JSON.parse(localStorage.getItem('searchHistory')!) || [];

        this.isSearchBarFocused$ =
            this.visibilityService.getHeaderSearchBarFocusState();

        this.autocompleteOptions$ =
            this.searchingService.getSearchSuggestions();

        this.autocompleteOptionsLetters$ =
            this.searchingService.getSearchSuggestionsLetters();
    }

    setFocusState(state: boolean) {
        this.visibilityService.setHeaderSearchBarFocusState(state);
    }

    stopUserOffersSearch() {
        this.searchingService.setRouteUsername(null);
    }

    onSearchTermChange() {
        this.searchingService.updateSearchTerm(this.searchTerm);
    }

    onSearchTermSubmit(autocompleteOption?: string) {
        if (autocompleteOption) {
            this.searchTerm = autocompleteOption;
            this.searchingService.updateSearchTerm(this.searchTerm);
        }

        this.visibilityService.setHeaderSearchBarFocusState(false);

        if (this.searchTerm === '' && !autocompleteOption) return;

        this.searchingService.triggerSearchSubmit();

        const searchHistory =
            JSON.parse(localStorage.getItem('searchHistory')!) || [];

        if (
            searchHistory.includes(this.searchTerm) ||
            searchHistory.includes(autocompleteOption)
        )
            return;

        searchHistory.push(
            autocompleteOption ? autocompleteOption : this.searchTerm
        );
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }

    viewFullSearchigHistory() {
        this.showHistoryModal = true;
        this.renderer.addClass(document.body, 'overflow-hidden');
    }

    closeModal($event?: Event, modal?: HTMLDivElement) {
        if (
            $event &&
            modal &&
            (modal === $event.target || modal.contains($event.target as Node))
        )
            return;

        this.showHistoryModal = false;
        this.renderer.removeClass(document.body, 'overflow-hidden');
    }

    deleteSearchigHistory() {
        localStorage.setItem('searchHistory', JSON.stringify([]));
        this.searchingHistory = [];

        this.showHistoryDeletedNotification = true;

        setTimeout(() => {
            this.showHistoryDeletedNotification = false;
        }, 3000);
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.closeModal();
        }
    }
}
