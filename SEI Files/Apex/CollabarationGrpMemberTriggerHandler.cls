public with sharing class CollabarationGrpMemberTriggerHandler {
 public static void beforeInsert(List<CollaborationGroupMember> collGrpMembers)
 {
     //Set the Email flag to true when user added to group - no need to send to user as per requirement.
     stopEmailForMembersWhenAddedToGroup(collGrpMembers);
 }
 public static void stopEmailForMembersWhenAddedToGroup(List<CollaborationGroupMember> members)
 {
     //Get the list of members
     Set<String> memberIds = new Set<String>();
     for(CollaborationGroupMember member : members)
     {
         memberIds.add(member.MemberId);
     }
     //Get the Network Id for the current site
     String networkId = System.Label.Current_Experience_Cloud_NetworkId;
     //Get the NetworkMember flag for the current site
     List<NetworkMember> nwkMembers = [Select Id , MemberId, PreferencesDisableAllFeedsEmail from NetworkMember 
                                         where MemberId in :memberIds and NetworkId = :networkId LIMIT 1];
     if(! nwkMembers.isEmpty())
     {
         for(NetworkMember nwMember : nwkMembers)
         {
             //Set the flg to stop the email when user added to the group.
             nwMember.PreferencesDisableAllFeedsEmail = true;
         }
         //Update the records
         Database.update(nwkMembers);
     }
    
     
     
 }
}