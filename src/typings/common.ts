export enum ECases {
    active = 'active',
    discharged = 'discharged',
    deaths = 'deaths',
}

export type TCovidStateStats = {
    active: number;
    cured: number;
    death: number;
    death_reconsille: number;
    new_active: number;
    new_cured: number;
    new_death: number;
    new_positive: number;
    positive: number;
    sno: number;
    state_code: number;
    state_name: string;
    total: number;
};

export type TCasesSummary = {
    changePerc: number;
    newCase: 13824;
    totalCase: 2223018;
    type: ECases;
    changeFlow: 'up' | 'down';
};

export type TCovidStats = {
    lastUpdatedDate: string;
    stateData: TCovidStateStats[];
    summary: TCasesSummary[];
} | null;

export enum EStates {
    Andaman_and_Nicobar_Islands = 'Andaman and Nicobar Islands',
    Andhra_Pradesh = 'Andhra Pradesh',
    Arunachal_Pradesh = 'Arunachal Pradesh',
    Assam = 'Assam',
    Bihar = 'Bihar',
    Chandigarh = 'Chandigarh',
    Chhattisgarh = 'Chhattisgarh',
    Dadra_and_Nagar_Haveli_and_Daman_and_Diu = 'Dadra and Nagar Haveli and Daman and Diu',
    Delhi = 'Delhi',
    Goa = 'Goa',
    Gujarat = 'Gujarat',
    Haryana = 'Haryana',
    Himachal_Pradesh = 'Himachal Pradesh',
    Jammu_and_Kashmir = 'Jammu and Kashmir',
    Jharkhand = 'Jharkhand',
    Karnataka = 'Karnataka',
    Kerala = 'Kerala***',
    Ladakh = 'Ladakh',
    Lakshadweep = 'Lakshadweep',
    Madhya_Pradesh = 'Madhya Pradesh',
    Maharashtra = 'Maharashtra',
    Manipur = 'Manipur',
    Meghalaya = 'Meghalaya',
    Mizoram = 'Mizoram',
    Nagaland = 'Nagaland',
    Odisha = 'Odisha',
    Puducherry = 'Puducherry',
    Punjab = 'Punjab',
    Rajasthan = 'Rajasthan',
    Sikkim = 'Sikkim',
    Tamil_Nadu = 'Tamil Nadu',
    Telangana = 'Telangana',
    Tripura = 'Tripura',
    Uttarakhand = 'Uttarakhand',
    Uttar_Pradesh = 'Uttar Pradesh',
    West_Bengal = 'West Bengal',
}

export enum EState {
    state = 'state',
}

export type EColumns = EState | ECases;
