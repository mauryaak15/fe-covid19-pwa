import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ECases, EStates, TCovidStats} from '@typings/common';
// Define a type for the slice state

type TSelectedState = EStates | undefined | '';
interface ICoreState {
    covidData: TCovidStats | undefined;
    selectedState: TSelectedState;
    isLoading: boolean;
    activeSummaryCard: ECases;
}

// Define the initial state using that type
const initialState: ICoreState = {
    covidData: undefined,
    selectedState: '',
    isLoading: false,
    activeSummaryCard: ECases.discharged,
};

const coreSlice = createSlice({
    name: 'core',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setCovidData(state: ICoreState, action: PayloadAction<TCovidStats>) {
            state.covidData = action.payload;
        },
        setSelectedState(
            state: ICoreState,
            action: PayloadAction<TSelectedState>
        ) {
            state.selectedState = action.payload;
        },
        setLoading(state: ICoreState, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setActiveSummaryCard(state: ICoreState, action: PayloadAction<ECases>) {
            state.activeSummaryCard = action.payload;
        },
    },
});

export const {...actions} = coreSlice.actions;

export default coreSlice.reducer;
