@isTest
public class CollabarationGrpMemberTriggerHanTest {

    @isTest
    public static void beforeInsertTest(){
        
        Id networkId = [Select id, Name FROM Network Limit 1].id;
        CollaborationGroup collabgroup = TestDataFactory.createCollaborationGroup();
         //CollaborationGroupMember Creation
        CollaborationGroupMember member = new CollaborationGroupMember();
        member.CollaborationGroupId = collabgroup.Id;
        member.MemberId = UserInfo.getUserId(); // Associate the member with the current user
        member.NotificationFrequency = 'N';
        
        Profile pf = [SELECT Id FROM Profile WHERE Name = 'System Administrator' limit 1];

        User usr = TestDataFactory.createTestUser(pf.Id, 'Test FirstName', 'Test LastName');
        try
         {
            insert usr;
         }
         Catch(DMLException e)
         {
           System.debug(e);
         }
        Test.startTest();
        CollabarationGrpMemberTriggerHandler.beforeInsert(new List<CollaborationGroupMember>{ member });
        Test.stopTest();
    }
}