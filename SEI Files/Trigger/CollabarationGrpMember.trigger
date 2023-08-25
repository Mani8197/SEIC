trigger CollabarationGrpMember on CollaborationGroupMember (Before insert) {

    /*If(Trigger.IsBefore && Trigger.IsInsert){
        List<NetworkMember> ntworkmbr = [SELECT Id , MemberId, PreferencesDisableAllFeedsEmail FROM NetworkMember 
                                         WHERE MemberId =:Trigger.new[0].MemberId AND Id = '0DO7g000004FtACGA0'];
         System.debug('PreferencesDisableAllFeedsEmail' +  ntworkmbr[0].PreferencesDisableAllFeedsEmail);
        ntworkmbr[0].PreferencesDisableAllFeedsEmail = true;
        System.debug('ntworkmbr[0].PreferencesDisableAllFeedsEmail' +  ntworkmbr[0].PreferencesDisableAllFeedsEmail);
        Update ntworkmbr;
       }*/
    If(Trigger.IsBefore && Trigger.IsInsert){
        CollabarationGrpMemberTriggerHandler.beforeInsert(Trigger.New);
       }
   /* If((Trigger.IsAfter && Trigger.IsInsert) || (Trigger.IsAfter && Trigger.IsUpdate)){
        List<NetworkMember> ntworkmbr = [Select Id , MemberId, PreferencesDisableAllFeedsEmail from NetworkMember 
                                         where MemberId =:Trigger.new[0].MemberId and Id = '0DO7g000004FtACGA0'];
         System.debug('PreferencesDisableAllFeedsEmail' +  ntworkmbr[0].PreferencesDisableAllFeedsEmail);
        ntworkmbr[0].PreferencesDisableAllFeedsEmail = false;
        System.debug('ntworkmbr[0].PreferencesDisableAllFeedsEmail' +  ntworkmbr[0].PreferencesDisableAllFeedsEmail);
        Update ntworkmbr;
       }
    */
}