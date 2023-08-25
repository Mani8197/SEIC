import { api, LightningElement, wire } from 'lwc';
import getCommunityGroup from '@salesforce/apex/CommunityGroupsContoller.getCommunityGroup';
import UserId from '@salesforce/user/Id';
import CommunityId from '@salesforce/community/Id';
import CommunityPath from '@salesforce/community/basePath';

export default class CommunityGroupBanner extends LightningElement {
    @api recordId;

    communityGroup;
    @wire(getCommunityGroup, {networkId: CommunityId, groupId: '$recordId'})
    wiredCommunityGroup({error, data}) {
        console.log(`networkId: ${CommunityId} groupId: ${this.recordId}`);
        console.log("wiredCommunityGroup");
        if (data) {
            console.dir(data);
            this.communityGroup = data;
            this.error = undefined;
        }
        else if (error) {
            console.log(error);
            this.error = error;
            this.communityGroup = undefined;
        }
    }

    get communityGroupBanner() {
        let banner = {}
        console.log("get communityGroupBanner");
        if (this.communityGroup) {
            //banner = this.communityGroup;
            banner.FullPhotoUrl = this.communityGroup.FullPhotoUrl;
            banner.Id = this.communityGroup.Id;
            banner.Name = this.communityGroup.Name;
            banner.Description = this.communityGroup.Description;
            banner.InformationBody = this.communityGroup.InformationBody;
            banner.OwnerPhotoUrl = this.communityGroup.Owner.SmallPhotoUrl;
            banner.OwnerName = this.communityGroup.Owner.Name;
            banner.OwnerUrl = `${CommunityPath}/profile/${this.communityGroup.Owner.Id}`;
            banner.MemberCountText = this.communityGroup.MemberCount == 1 ? 
                    `${this.communityGroup.MemberCount} member` : this.communityGroup.MemberCount > 0 ? `${this.communityGroup.MemberCount} members` : "";
            // console.log('photoUrl: ' + this.communityGroup.Owner.SmallPhotoUrl);
        }

        return banner;
    }
}