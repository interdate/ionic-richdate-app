import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {AdvancedSearchResultPage} from "../advanced-search-result/advanced-search-result";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the AdvancedsearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-advancedsearch',
    templateUrl: 'advancedsearch.html',
})
export class AdvancedsearchPage {

    form: any;

    ageLower: any = 20;
    ageUpper: any = 50;

    ages: any[] = [];

    height: any[] = [];

    default_range: any = {lower: this.ageLower, upper: this.ageUpper};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiProvider) {

        this.api.storage.get('searchParams').then(data => {

            if (data) {
                this.form = data;
            } else {
                this.api.http.get(api.url + '/user/advanced/search', api.setHeaders(true)).subscribe((data: any) => {
                    this.form = data.form;
                    this.form.heightFrom.value = '';
                    this.form.heightTo.value = '';

                }, err => {
                    console.log("Oops!");
                });
            }
        });
    }

    toSearchResultsPage() {

        this.api.storage.set('searchParams', this.form);

        console.log(this.form);

        let params = JSON.stringify({
            action: 'search',
            list: '',
            filter: 'lastActivity',
            page: 1,
            advanced_search: {
                region: this.form.region.value,
                ageFrom: this.form.age.valueFrom,
                ageTo: this.form.age.valueTo,
                body: this.form.body.value,
                drinking: this.form.drinking.value,
                hairLength: this.form.hairLengthId.value,
                hairColor: this.form.hairColor.value,
                eyesColor: this.form.eyesColor.value,
                education: this.form.education.value,
                economy: this.form.economic.value,
                relationship: this.form.userRelationship.value,
                occupation: this.form.occupation.value,
                weightTo: this.form.weightTo.value,
                weightFrom: this.form.weightFrom.value,
                maritalStatus: this.form.maritalStatus.value,
                origin: this.form.origin.value,
                smoking: this.form.smoking.value,
                country: this.form.country.value,
                children: this.form.userChildren.value,
                heightFrom: this.form.heightFrom.value,
                heightTo: this.form.heightTo.value,
                lookingFor: this.form.lookingFor.value,
                withPhoto: this.form.withPhotos.value == true ? '1' : '0' ,
            }
        });
        this.navCtrl.push(AdvancedSearchResultPage, {params: params});
    }

    ionViewWillEnter() {
        this.api.pageName = 'AdvancedSearchPage';
    }

    resetForm(){
        this.api.storage.remove('searchParams').then(data => {
            this.navCtrl.push(AdvancedsearchPage);
        });
    }

    getAgeValues(event) {
        if (event.value.upper != 0) {
            this.ageUpper = event.value.upper;
        }
        if (event.value.lower != 0) {
            this.ageLower = event.value.lower;
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AdvancedSearchPage');
    }
}
