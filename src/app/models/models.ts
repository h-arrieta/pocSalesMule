export interface ObjectRequest {
    actionType: string,
    contextId: string,
    comments: string
}

export interface CardData {
    approvalId: string,
    opportunity: Opportunity
}

export interface Opportunity {
    Asunto__c: string,
    Description: string,
    approval_type__c: string,
    Cliente__c: string,
    Amount: string,
    Id: string,
    type: string,
    CloseDate: string,
    Name: string,
}

export interface TreatCard {
    isTreated: boolean,
    cardData: CardData
}