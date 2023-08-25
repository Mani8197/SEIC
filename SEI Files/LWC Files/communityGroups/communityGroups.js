import { api, LightningElement, wire } from 'lwc';
import RIA_BADGE from '@salesforce/contentAssetUrl/RIA_Badge';
import WOMEN_ADVISORS from '@salesforce/contentAssetUrl/Women_Advisors_Square';
import getGroups from '@salesforce/apex/CommunityGroupsContoller.getGroups';
import getUserProfile from '@salesforce/apex/CommunityGroupsContoller.getUserProfile';
import getLandingPageGroups from '@salesforce/apex/CommunityGroupsContoller.getLandingPageGroups';
import getGroupMemberships from '@salesforce/apex/CommunityGroupsContoller.getGroupMemberships';
import createMemberRequest from '@salesforce/apex/CommunityGroupsContoller.createMemberRequest';
import acceptMemberRequest from '@salesforce/apex/CommunityGroupsContoller.acceptMemberRequest';
import removeMemberFromGroup from '@salesforce/apex/CommunityGroupsContoller.removeMemberFromGroup';
import updateNotificationFrequency from '@salesforce/apex/CommunityGroupsContoller.updateNotificationFrequency';
import UserId from '@salesforce/user/Id';
import CommunityId from '@salesforce/community/Id';
import CommunityPath from '@salesforce/community/basePath';
import { RefreshEvent } from 'lightning/refresh';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class CommunityGroups extends LightningElement {
    @api title;
    @api recordId;
    riaUrl = RIA_BADGE;
    womenAdvisorsUrl = WOMEN_ADVISORS;
    error;
    isLoaded = true;

    groupMemberships;
    @wire(getGroupMemberships, {networkId: CommunityId, memberId: UserId})
    wiredGroupMemberships({error, data}) {
        console.log("wiredGroupMemberships");
        if (data) {
            console.dir(data);
            this.groupMemberships = data;
            this.error = undefined;
        }
        else if (error) {
            this.groupMemberships = [];
            this.error = error;
        }
    }

    landingPageGroups;
    @wire(getLandingPageGroups, {networkId: CommunityId, memberId: UserId})
    wiredLandingGroups({error, data}) {
        if (data) {
            console.log("wiredLandingGroups");
            console.dir(data);
            this.landingPageGroups = data;
            this.error = undefined;
        }
        else if (error) {
            this.landingPageGroups = [];
            this.error = error;
        }
    }

    currentUserProfile;
    @wire(getUserProfile, {userId: UserId})
    wiredUserProfile({error, data}) {
        if (data) {
            this.currentUserProfile = data;
            this.error = undefined;
        }
        else {
            this.currentUserProfile = undefined;
            this.error = error;
        }
    }

    get userCommunities () {
        console.log("userCommunities");
        let iContactGroups = [];

        if(this.landingPageGroups && this.currentUserProfile) {
            console.dir(this.landingPageGroups);
            console.dir(this.currentUserProfile);
            this.landingPageGroups.forEach(group => {
                // If group == RIA Community don't show it to Independents
                if (group.groupName !== "RIA Community" || (group.groupName === "RIA Community" && (!this.currentUserProfile.Contact || this.currentUserProfile.Contact.BDType__c == "Independent"))) {
                    //For SEIC CommunityConnect we are opting to use only Private or Unlisted communities
                    if (group.collaborationType === "Private" || (group.collaborationType === "Unlisted" && group.isMember)) {
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
                            GroupPageUrl: group.communityPageUrl,
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

    get options() {
        return [
            { label: 'Every Post', value: 'P' },
            { label: 'Daily Digest', value: 'D' },
            { label: 'Weekly Digest', value: 'W' },
            { label: 'Limited', value: 'N' },
        ];
    }

    async handleClick(event) {
        console.log(event.target.dataset.groupId);
        console.log(event.target.dataset.isMember);

        const groupId = event.target.dataset.groupId;
        const isMember = event.target.dataset.isMember;
        const groupMembershipId = event.target.dataset.groupMembershipId;

        if (!isMember) {
            let memberRequest = { CollaborationGroupId: groupId, RequesterId: UserId };
            const memberRequestId = await (createMemberRequest({ memberRequest: memberRequest }));
            console.log(memberRequestId);

            await (acceptMemberRequest({ memberRequestId: memberRequestId }));
            window.location.reload();
        }
        else if (isMember) {
            await (removeMemberFromGroup({ groupMembershipId: groupMembershipId }));
            window.location.reload();
        }
    }

    async handleClick1(event) {
        console.log(event.target.dataset.groupId);
        let memberRequest = {CollaborationGroupId: event.target.dataset.groupId, RequesterId: UserId};
        const memberRequestId = await(createMemberRequest({memberRequest : memberRequest}));
        console.log(memberRequestId);

        await(acceptMemberRequest({memberRequestId : memberRequestId}));
        window.location.reload();
    }

    async handleOnChange(event) {
        // this.isLoaded = false;
        console.log(event.target.dataset.groupId);
        console.log(event.target.value);
        await(updateNotificationFrequency({groupMemberId: event.target.dataset.groupId, notificationFrequency: event.target.value}));
        window.location.reload();
    }

    constructor() {
        super();
        console.log("constructor");
        console.log("CommunityPath: " + CommunityPath);
      }
    
    connectedCallback() {
        //Called when the element is inserted into a document. 
        //This hook flows from parent to child. You can’t access child elements because they don’t exist yet.

        console.log('connectedCallback');
    }

    renderedCallback() {
        console.log('renderedCallback');
    }
}