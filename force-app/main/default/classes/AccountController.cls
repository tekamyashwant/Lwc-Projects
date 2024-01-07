public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static list<Account> fetchAccountRecords(){
        try {
            return [Select id, Name, Website, Phone, Industry from Account];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}