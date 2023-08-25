/** @File Name   : CommunityGroupsContoller
* @Created BY    : Nteli
* @Date          : May 03 , 2023
* @Description   : Test class for CommunityGroupsContollerTest
*/

@isTest
public class CommunityGroupsContollerTest {
    
    @isTest
    public static void getGroupsTest(){
        
        Id networkId = [Select id, Name FROM Network Limit 1].id;
        CollaborationGroup collabgroup = TestDataFactory.createCollaborationGroup();
        Test.startTest();
        List<CollaborationGroup> coll = CommunityGroupsContoller.getGroups(networkId);
        Test.stopTest();
        System.assert(!coll.isEmpty(), 'Expected non-empty list of collaboration groups');
    }
    
    @isTest
    public static void getProfileAttributeTest(){
        
       Profile p = [SELECT Id FROM Profile WHERE Name='System Administrator' limit 1]; 
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com', 
                          EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US', 
                          LocaleSidKey='en_US', ProfileId = p.Id,
                          TimeZoneSidKey='America/Los_Angeles', UserName='standarduser1@testorg.com');
        
        Test.startTest();
        Profile_Attributes__c result = CommunityGroupsContoller.getProfileAttribute(u.Id);
        Test.stopTest();
        
        
        
    }
    
    @isTest
    public static void  getGroupMembershipsTest(){
        
        Id networkId = [Select id, Name FROM Network Limit 1].id;
        CollaborationGroup testGroup = TestDataFactory.createCollaborationGroup();
   
        Profile p = [SELECT Id FROM Profile WHERE Name='System Administrator' limit 1]; 
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com', 
                          EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US', 
                          LocaleSidKey='en_US', ProfileId = p.Id,
                          TimeZoneSidKey='America/Los_Angeles', UserName='standarduser1@testorg.com');
        insert u;
        
        Test.startTest();
        List<CollaborationGroupMember> result = CommunityGroupsContoller.getGroupMemberships(networkId, u.Id);
        test.stopTest();
        
    }
    
    @isTest
    public static void removeMemberFromGroupTest(){
        
        Id networkId = [Select id, Name FROM Network Limit 1].id;
        //CollaborationGroup creation
        CollaborationGroup cg = TestDataFactory.createCollaborationGroup();
        //CollaborationGroupMember Creation
        CollaborationGroupMember member = new CollaborationGroupMember();
        member.CollaborationGroupId = cg.Id;
        member.MemberId = UserInfo.getUserId(); // Associate the member with the current user
        member.NotificationFrequency = 'N';
        Test.startTest();
        CommunityGroupsContoller.removeMemberFromGroup(member.Id);
        Test.stopTest();
        
    }
    
    @isTest
    public static void getLandingPageGroupsTest(){
        Id networkId = [Select id, Name FROM Network Limit 1].id;
        //CollaborationGroup creation
        CollaborationGroup cg = TestDataFactory.createCollaborationGroup();
        //CollaborationGroupMember Creation
        CollaborationGroupMember member = new CollaborationGroupMember();
        member.CollaborationGroupId = cg.Id;
        member.MemberId = UserInfo.getUserId(); // Associate the member with the current user
        member.NotificationFrequency = 'N';
        Test.startTest();
        CommunityGroupsContoller.getLandingPageGroups(networkId, UserInfo.getUserId());
        Test.stopTest();
        
    }
    
    @isTest
    public static void getUserProfileTest(){
        Profile p = [SELECT Id FROM Profile WHERE Name='System Administrator' limit 1]; 
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com', 
                          EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US', 
                          LocaleSidKey='en_US', ProfileId = p.Id, 
                          TimeZoneSidKey='America/Los_Angeles', UserName='standarduser1@testorg.com');
        
        insert u;
        Test.startTest();
        User result = CommunityGroupsContoller.getUserProfile(u.Id);
        Test.stopTest();
        
    }
    @isTest
    public static void getCommunityGroupTest(){
        
        Id networkId = [Select id, Name FROM Network Limit 1].id;
        CollaborationGroup collgroup = TestDataFactory.createCollaborationGroup();
        Test.startTest();
        CommunityGroupsContoller.getCommunityGroup(networkId, collgroup.Id);
        Test.stopTest();
     }
    
    @isTest
    public static void createMemberRequestTest(){
        Id networkId = [Select id, Name FROM Network WHERE Name = 'Community Connect'].id;
        CollaborationGroup collgroup = TestDataFactory.createCollaborationGroup();
        //CollaborationGroupMemberRequest Creation
        CollaborationGroupMemberRequest memberRequest = new CollaborationGroupMemberRequest();
        memberRequest.CollaborationGroupId = collgroup.Id;
        memberRequest.RequesterId = UserInfo.getUserId();
        Test.startTest();
        String memberRequestId = CommunityGroupsContoller.createMemberRequest(memberRequest);
        Test.stopTest();
        
        
    }
    
    @isTest
    public static void acceptMemberRequestTest(){
        
        Id networkId = [Select id, Name FROM Network Limit 1].id;
        CollaborationGroup collgroup = TestDataFactory.createCollaborationGroup();
        CollaborationGroupMemberRequest memberRequest = new CollaborationGroupMemberRequest();
        memberRequest.CollaborationGroupId = collgroup.Id;
        memberRequest.RequesterId = UserInfo.getUserId();
        Test.startTest();
        CommunityGroupsContoller.acceptMemberRequest(memberRequest.Id);
        Test.stopTest();
        
    }
    
    @isTest
    public static void updateNotificationFrequencyTest(){
        
        Id networkId = [Select id, Name FROM Network Limit 1].id;
        CollaborationGroup collgroup = TestDataFactory.createCollaborationGroup();
        CollaborationGroupMember member = new CollaborationGroupMember();
        member.CollaborationGroupId = collgroup.Id;
        member.NotificationFrequency = 'N';
        Test.startTest();
        CommunityGroupsContoller.updateNotificationFrequency(member.Id, 'Weekly');
        Test.stopTest();
    }
    
}