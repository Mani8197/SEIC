import { api, LightningElement, wire } from 'lwc';
import getUserProfile from '@salesforce/apex/CommunityGroupsContoller.getUserProfile';
import getLandingPageGroups from '@salesforce/apex/CommunityGroupsContoller.getLandingPageGroups';
import UserId from '@salesforce/user/Id';
import CommunityId from '@salesforce/community/Id';
import CommunityPath from '@salesforce/community/basePath';

export default class UserProfileBanner extends LightningElement {
    @api recordId;
    @api title;

    userProfile;
    @wire(getUserProfile, {userId: '$recordId'})
    wiredUserProfile({error, data}) {
        console.log(`userId: ${this.recordId}`);
        console.log("wiredUserProfile");
        if (data) {
            console.dir(data);
            this.userProfile = data;
            this.error = undefined;
        }
        else if (error) {
            console.log(error);
            this.error = error;
            this.userProfile = undefined;
        }
    }

    currentUserProfile;
    @wire(getUserProfile, {userId: UserId})
    wiredCurrentUserProfile({error, data}) {
        if (data) {
            this.currentUserProfile = data;
            this.error = undefined;
        }
        else {
            this.currentUserProfile = undefined;
            this.error = error;
        }
    }

    landingPageGroups;
    @wire(getLandingPageGroups, {networkId: CommunityId, memberId: '$recordId'})
    wiredLandingGroups({error, data}) {
        if (data) {
            console.log("wiredLandingGroups");
            console.dir(data);
            this.landingPageGroups = data;
        }
        else if (error) {
            this.landingPageGroups = [];
            this.error = error;
        }
    }

    get userProfileBanner() {
        let banner = {}
        console.log("get userProfileBanner");
        if (this.userProfile) {
            banner.FullPhotoUrl = this.userProfile.FullPhotoUrl;
            banner.Id = this.userProfile.Id;
            banner.Name = this.userProfile.Name;
            banner.FirstName = this.userProfile.FirstName;
        }

        return banner;
    }

    get userGroups () {
        console.log("userGroups");
        let iContactGroups = [];
        
        if (this.landingPageGroups) {
            console.log('landingPageGroups');
            console.dir(this.landingPageGroups);
            this.landingPageGroups.forEach(group => {
                // If group == RIA Community don't show it to Independents
                if (group.groupName !== "RIA Community" || (group.groupName === "RIA Community" && (!this.currentUserProfile.Contact || this.currentUserProfile.Contact.BDType__c == "Independent"))) {
                    //For SEIC CommunityConnect we are opting to use only Private or Unlisted communities
                    if (group.collaborationType === "Private") {
                        iContactGroups.push({
                            Id: group.groupId,
                            Name: group.groupName,
                            InformationBody: group.informationBody,
                            FullPhotoUrl: group.fullPhotoUrl,
                            MemberCount: group.memberCount,
                            MemberCountText: group.memberCount == 1 ? `${group.memberCount} member` :
                                group.memberCount > 0 ? `${group.memberCount} members` :
                                    "",
                            IsMember: group.isMember,
                            GroupPageUrl: `${CommunityPath}/${group.communityPageUrl}`,
                            CollaborationGroupMemberId: group.groupMembershipId,
                            NotificationFrequency: group.notificationFrequency
                        });
                    }
                }
            });
        }

        
        console.log("iContactGroups");
        console.log(iContactGroups);
        return iContactGroups;
    }
}