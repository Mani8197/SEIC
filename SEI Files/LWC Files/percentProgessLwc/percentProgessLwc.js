import { LightningElement,wire,api} from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import USER_OBJECT from '@salesforce/schema/User';
import MEMBER_INFORMATION from '@salesforce/schema/Profile_Attributes__c';
//import MEMBER_ID from '@salesforce/schema/Profile_Attributes__c/Id';
import UserId from '@salesforce/user/Id';
import PROFILE_PERCENT from '@salesforce/schema/Profile_Attributes__c.Profile_Completion_Percentage__c';
import getProfileAttribute from '@salesforce/apex/CommunityGroupsContoller.getProfileAttribute';
import { NavigationMixin } from 'lightning/navigation';

// Defining fields to be retrieved
const fields = [PROFILE_PERCENT];


export default class PercentProgessLwc extends  NavigationMixin(LightningElement) {
// Getting the user Id
@api recordId = UserId;
@api recordval;

  error;
  profileAttribute;
  @wire(getProfileAttribute, { userId: UserId })
  wiredProfileAttribute({ error, data }) {
    console.log("wiredProfileAttribute");
    if (data) {
      console.dir(data);
      this.profileAttribute = data;
      this.error = undefined;
    }
    else if (error) {
      this.error = error;
      this.profileAttribute = undefined;
    }
  }


@wire(getRecord, {recordId: '$recordId', fields} )
   profilepercentVal;

   // Getter to return the value of Profile_Completion_Percentage__c field
   get profilepercentValui(){
    console.log('profile percent');
    console.log(PROFILE_PERCENT);
    

    if(this.profilepercentVal.data){
    return getFieldValue(this.profilepercentVal.data,PROFILE_PERCENT);

   }
   }

    // Getter to return a boolean value whether Profile_Completion_Percentage__c is 100 or not
    get profileComplete(){
     return this.profilepercentValui == 100;

    }

    // Method to navigate to a web page to edit user profile
    navigateToEditUserPage(){

     this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
       //"url" : "https://sei20--xpclouddev.sandbox.my.site.com/communityconnect/s/profile/"+this.recordId
          "url": "/profile/"+this.recordId

        }
    });
    }
}