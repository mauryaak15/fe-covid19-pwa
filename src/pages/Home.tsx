import React, {useCallback, useState} from 'react';
import {
    BackspaceIcon,
    SearchIcon,
    TrendingUpIcon,
    TrendingDownIcon,
} from '@heroicons/react/outline';
import {IndiaMap, PageHeader} from '@components';
import {useCovidData} from '@hooks';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@store';
import {ECases, EStates, TCovidStats} from '@typings/common';
import {DataTable} from '@containers';
import {debounce} from '@utils';
import {actions} from '@store/core';
import ReactTooltip from 'react-tooltip';

const DEBOUNCE_MS = 300;

const Home = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [autocompleteItems, setAutocompleteItems] = useState<EStates[]>([]);
    useCovidData();
    const isLoading = useSelector<RootState>(
        (state) => state.core.isLoading
    ) as boolean;
    const covidData = useSelector<RootState>(
        (state) => state.core.covidData
    ) as TCovidStats | undefined;
    const dispatch = useDispatch<AppDispatch>();
    const activeSummaryCard = useSelector<RootState>(
        (state) => state.core.activeSummaryCard
    ) as ECases;
    const reloadAutoCompleteList = useCallback(
        debounce((term: string) => {
            if (term.length) {
                setAutocompleteItems(
                    Object.values(EStates).filter((s) =>
                        s.toLowerCase().includes(term.toLowerCase())
                    )
                );
            } else {
                setAutocompleteItems([]);
            }
        }, DEBOUNCE_MS),
        []
    );
    const [toolTip, setToolTip] = React.useState<string>('');
    if (isLoading) {
        return (
            <div className="absolute top-0 left-0 right-0 bottom-0 dark:bg-slate-900 bg-gray-50 flex flex-col justify-center items-center">
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-gray-100" />
                </div>
                <p className="font-bold text-xl dark:text-white text-gray-800 mt-10">
                    Loading...
                </p>
            </div>
        );
    }
    return (
        <div className="w-full min-h-screen h-full font-sans transition duration-300 dark:bg-bluegray-900 text-bluegray-900 dark:text-bluegray-200">
            <PageHeader />
            <div className="fluid-container pb-52">
                <div className="grid md:grid-cols-3 gap-x-4 lg:gap-x-8 gap-y-8">
                    {covidData?.summary.map(
                        ({type, totalCase, changeFlow, newCase}) => {
                            let isTrendHealthy = changeFlow !== 'up';
                            let bgColor = 'sky';
                            const isActive = type === activeSummaryCard;
                            if (type === ECases.discharged) {
                                isTrendHealthy = changeFlow === 'up';
                                bgColor = 'green';
                            } else if (type === ECases.deaths) {
                                bgColor = 'red';
                            }
                            const activeBg = isActive
                                ? `bg-${bgColor}-50 dark:bg-${bgColor}-900`
                                : `hover:bg-${bgColor}-50 dark:hover:bg-${bgColor}-900 bg-bluegray-100 dark:bg-bluegray-800`;
                            return (
                                <div
                                    key={type}
                                    className={`hover:cursor-pointer transition duration-300 ${activeBg} rounded-md hover:shadow-md shadow-gray-200 dark:shadow-gray-900 p-4 md:py-8`}
                                    onClick={() => {
                                        dispatch(
                                            actions.setActiveSummaryCard(type)
                                        );
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            dispatch(
                                                actions.setActiveSummaryCard(
                                                    type
                                                )
                                            );
                                        }
                                    }}
                                >
                                    <h4
                                        className={`text-center text-lg font-semibold font-serif text-${bgColor}-600 dark:text-${bgColor}-200 capitalize`}
                                    >
                                        {type}
                                    </h4>
                                    <div className="my-2 md:my-8 text-center">
                                        <div
                                            className={`font-mono text-xl tracking-wider text-${bgColor}-700 dark:text-${bgColor}-300`}
                                        >
                                            {totalCase.toLocaleString('en-IN')}
                                        </div>
                                        <div
                                            className={`inline-flex items-center px-2 rounded-md bg-${
                                                isTrendHealthy ? 'green' : 'red'
                                            }-500 dark:bg-${
                                                isTrendHealthy ? 'green' : 'red'
                                            }-600 text-white mt-2`}
                                        >
                                            {changeFlow === 'up' ? (
                                                <TrendingUpIcon className="h-4 w-4" />
                                            ) : (
                                                <TrendingDownIcon className="h-4 w-4" />
                                            )}
                                            <span className="font-sans font-semibold text-sm pl-1">
                                                {newCase?.toLocaleString(
                                                    'en-IN'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>

                <div className="px-6 mt-10 flex items-center justify-center">
                    <div className="relative text-bluegray-400 dark:text-bluegray-400 focus-within:text-bluegray-600 dark:focus-within:text-bluegray-200 max-w-md basis-96">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            <div className="p-1 focus:outline-none focus:shadow-outline">
                                <SearchIcon className="w-6 h-6" />
                            </div>
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('');
                                setAutocompleteItems([]);
                                dispatch(actions.setSelectedState(''));
                            }}
                            className={`absolute inset-y-0 right-0 flex items-center pr-2 ${
                                searchTerm.length ? '' : 'hidden'
                            }`}
                        >
                            <div className="p-1 focus:outline-none focus:shadow-outline ml-2">
                                <BackspaceIcon className="w-6 h-6" />
                            </div>
                        </button>
                        <input
                            type="text"
                            name="q"
                            className="py-2 h-14 w-full md:h-16 transition-shadow duration-300 shadow-sm focus:shadow-md font-serif dark:text-bluegray-200 text-bluegray-800 bg-bluegray-100 dark:bg-bluegray-700 rounded-md pl-12 pr-10 focus:outline-none focus:bg-bluegray-50 dark:focus:bg-bluegray-600 focus:text-bluegray-900 dark:focus:text-bluegray-100 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis"
                            placeholder="Search by State..."
                            autoComplete="off"
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value?.trim());
                                reloadAutoCompleteList(
                                    event.target.value?.trim()
                                );
                            }}
                        />
                    </div>
                </div>

                {!!autocompleteItems.length && (
                    <div className="px-6 flex items-center justify-center mt-1">
                        <ul className="w-full max-w-md basis-96 transition-shadow duration-300 shadow-sm focus:shadow-md font-serif dark:text-bluegray-200 text-bluegray-800 bg-bluegray-100 dark:bg-bluegray-700 rounded-md overflow-hidden">
                            {autocompleteItems.slice(0, 5).map((item) => (
                                <li
                                    key={`${item}`}
                                    className="font-normal tracking-wide my-0.5 cursor-pointer hover:bg-bluegray-200 dark:hover:bg-bluegray-600 pl-12 py-2 pr-2"
                                >
                                    <button
                                        type="button"
                                        className="w-full text-left"
                                        onClick={() => {
                                            setSearchTerm(item);
                                            dispatch(
                                                actions.setSelectedState(item)
                                            );
                                            setAutocompleteItems([]);
                                        }}
                                    >
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-8 grid lg:grid-cols-2 lg:gap-x-4 gap-y-8">
                    <div className="rounded-md">
                        {!isLoading && (
                            <DataTable rows={covidData?.stateData || []} />
                        )}
                    </div>
                    <div className="rounded-md ">
                        {!isLoading && (
                            <div>
                                <IndiaMap setTooltipContent={setToolTip} />
                                <ReactTooltip html>{toolTip}</ReactTooltip>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
