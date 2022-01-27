import {
    SortAscendingIcon,
    SortDescendingIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    InformationCircleIcon,
} from '@heroicons/react/outline';
import ReactTooltip from 'react-tooltip';
import React, {useState} from 'react';
import {ECases, EColumns, EState, TCovidStateStats} from '@typings/common';
import {Cell} from '@components';
import {useSelector} from 'react-redux';
import {RootState} from '@store';

enum ECellType {
    columnName = 'columnName',
    rowName = 'rowName',
    value = 'value',
}

const columns: EColumns[] = [
    ...Object.values(EState),
    ...Object.values(ECases),
];

type TSortBy = Record<EColumns, boolean>;

const sortByInitialState = {
    [ECases.active]: false,
    [ECases.discharged]: false,
    [ECases.deaths]: false,
    [EState.state]: true,
};

const DataTable = ({rows = []}: {rows: TCovidStateStats[]}) => {
    const [sortBy, setSortBy] = useState<TSortBy>(sortByInitialState);
    const [ascending, setAscending] = useState<boolean>(true);
    const [computedRows, setComputedRows] = useState<TCovidStateStats[]>(rows);
    const selectedState = useSelector<RootState>(
        (state) => state.core.selectedState
    );

    React.useEffect(() => {
        if (selectedState) {
            setComputedRows([
                ...rows.filter((row) => row.state_name === selectedState),
                rows[rows.length - 1],
            ]);
        } else {
            setComputedRows(rows);
        }
    }, [selectedState]);

    const sort = React.useCallback(
        (type: EColumns) => {
            setComputedRows([
                ...rows
                    .filter((row) => row.state_name)
                    .sort((rowA, rowB) => {
                        let asc: number = 0;
                        let desc: number = 0;
                        switch (type) {
                            case ECases.active:
                                asc = rowA.new_active - rowB.new_active;
                                desc = rowB.new_active - rowA.new_active;
                                break;
                            case ECases.discharged:
                                asc = rowA.new_cured - rowB.new_cured;
                                desc = rowB.new_cured - rowA.new_cured;
                                break;
                            case ECases.deaths:
                                asc = rowA.new_death - rowB.new_death;
                                desc = rowB.new_death - rowA.new_death;
                                break;
                            case EState.state:
                                asc = rowA.state_name.localeCompare(
                                    rowB.state_name
                                );
                                desc = rowB.state_name.localeCompare(
                                    rowA.state_name
                                );
                                break;
                            default:
                        }
                        if (sortBy[type]) {
                            setAscending(!ascending);
                            return ascending ? desc : asc;
                        }
                        setAscending(false);
                        return desc;
                    }),
                rows[rows.length - 1],
            ]);
            setSortBy({
                ...sortByInitialState,
                [EState.state]: false,
                [type]: true,
            });
        },
        [ascending, sortBy, rows]
    );

    const onCellClick = React.useCallback(
        (cellValue: any, cellType: ECellType) => {
            if (cellType === ECellType.columnName && !selectedState) {
                sort(cellValue.type);
            }
        },
        [sort, selectedState]
    );

    return (
        <div>
            <div className="grid grid-cols-4 gap-0.5">
                {columns.map((column) => (
                    <Cell
                        key={column}
                        onClick={() =>
                            onCellClick({type: column}, ECellType.columnName)
                        }
                        dark
                        className="group inline-flex items-center justify-around py-8 capitalize flex-wrap"
                    >
                        <span className="inline-flex items-center">
                            {column !== EState.state && (
                                <InformationCircleIcon
                                    data-tip={
                                        column === ECases.deaths
                                            ? 'More than 70% cases<br/> due to comorbidities'
                                            : 'Including foreign Nationals'
                                    }
                                    data-for="table-tips"
                                    className="h-4 w-4 mr-1 text-bluegray-500 dark:text-bluegray-400 md:block lg:block hidden"
                                />
                            )}
                            {column}
                        </span>
                        {!sortBy[column] && (
                            <SortDescendingIcon
                                className={`h-4 w-4 ml-2 transition-opacity group-hover:opacity-100 ${
                                    sortBy[column] ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        )}
                        {sortBy[column] && ascending && (
                            <SortAscendingIcon
                                className={`h-4 w-4 ml-2 transition-opacity group-hover:opacity-100 ${
                                    sortBy[column] ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        )}
                        {sortBy[column] && !ascending && (
                            <SortDescendingIcon
                                className={`h-4 w-4 ml-2 transition-opacity group-hover:opacity-100 ${
                                    sortBy[column] ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        )}
                    </Cell>
                ))}
            </div>
            {computedRows.map((row, idx) => (
                <div
                    key={`row-${row.sno}`}
                    className="grid grid-cols-4 gap-0.5 mt-0.5"
                >
                    <Cell
                        onClick={() => onCellClick(row, ECellType.rowName)}
                        dark={!!(idx % 2)}
                        className={`inline-flex ${
                            row.state_name
                                ? 'flex-col justify-center'
                                : 'items-center'
                        }`}
                    >
                        {row.state_name || 'Total'}
                        {!row.state_name && (
                            <InformationCircleIcon
                                data-tip="States wise distribution<br/> is subject to further <br/>verification and reconciliation"
                                data-for="table-tips"
                                className="h-4 w-4 ml-1 text-bluegray-500 dark:text-bluegray-400 md:block lg:block hidden"
                            />
                        )}
                    </Cell>
                    <Cell
                        onClick={() => onCellClick(row, ECellType.value)}
                        dark={!!(idx % 2)}
                        className="inline-flex flex-col items-end justify-center font-mono"
                    >
                        <span title={`${row.new_active}`}>
                            {row.new_active}
                        </span>
                        {row.new_active - row.active !== 0 ? (
                            <span
                                className={`inline-flex items-center text-${
                                    row.new_active > row.active
                                        ? 'red'
                                        : 'green'
                                }-600 dark:text-${
                                    row.new_active > row.active
                                        ? 'red'
                                        : 'green'
                                }-500 font-medium`}
                            >
                                <InformationCircleIcon
                                    data-tip="Change since yesterday"
                                    data-for="table-tips"
                                    className="h-4 w-4 mr-1 text-bluegray-500 dark:text-bluegray-400 md:block lg:block hidden"
                                />
                                {row.new_active > row.active ? (
                                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                                ) : (
                                    <TrendingDownIcon className="h-4 w-4 mr-1" />
                                )}
                                <span
                                    title={`${Math.abs(
                                        row.new_active - row.active
                                    )}`}
                                >
                                    {Math.abs(
                                        row.new_active - row.active
                                    ).toLocaleString('en-IN')}
                                </span>
                            </span>
                        ) : null}
                    </Cell>
                    <Cell
                        onClick={() => onCellClick(row, ECellType.value)}
                        dark={!!(idx % 2)}
                        className="inline-flex flex-col items-end justify-center font-mono"
                    >
                        <span title={`${row.new_cured}`}>{row.new_cured}</span>
                        {row.new_cured - row.cured !== 0 ? (
                            <span
                                className={`max-w-full text-ellipsis inline-flex items-center text-${
                                    row.new_cured > row.cured ? 'green' : 'red'
                                }-600 dark:text-${
                                    row.new_cured > row.cured ? 'green' : 'red'
                                }-500 font-medium`}
                            >
                                <InformationCircleIcon
                                    data-tip="Change since yesterday"
                                    data-for="table-tips"
                                    className="h-4 w-4 mr-1 text-bluegray-500 dark:text-bluegray-400 md:block lg:block hidden"
                                />
                                {row.new_cured > row.cured ? (
                                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                                ) : (
                                    <TrendingDownIcon className="h-4 w-4 mr-1" />
                                )}
                                <span
                                    title={`${Math.abs(
                                        row.new_cured - row.cured
                                    )}`}
                                >
                                    {Math.abs(
                                        row.new_cured - row.cured
                                    ).toLocaleString('en-IN')}
                                </span>
                            </span>
                        ) : null}
                    </Cell>
                    <Cell
                        onClick={() => onCellClick(row, ECellType.value)}
                        dark={!!(idx % 2)}
                        className="inline-flex flex-col items-end justify-center font-mono text-ellipsis"
                    >
                        <span title={`${row.new_death}`}>{row.new_death}</span>
                        {row.new_death - row.death !== 0 ? (
                            <span
                                className={`max-w-full text-ellipsis inline-flex items-center text-${
                                    row.new_death > row.death ? 'red' : 'green'
                                }-600 dark:text-${
                                    row.new_death > row.death ? 'red' : 'green'
                                }-500 font-medium`}
                            >
                                <InformationCircleIcon
                                    data-tip="Change since yesterday"
                                    data-for="table-tips"
                                    className="h-4 w-4 mr-1 text-bluegray-500 dark:text-bluegray-400 md:block lg:block hidden"
                                />
                                {row.new_death > row.death ? (
                                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                                ) : (
                                    <TrendingDownIcon className="h-4 w-4 mr-1" />
                                )}
                                <span
                                    title={`${Math.abs(
                                        row.new_death - row.death
                                    )}`}
                                >
                                    {Math.abs(
                                        row.new_death - row.death
                                    ).toLocaleString('en-IN')}
                                </span>
                            </span>
                        ) : null}
                    </Cell>
                </div>
            ))}
            <ReactTooltip
                id="table-tips"
                multiline
                effect="solid"
                className="z-10"
            />
        </div>
    );
};

export default DataTable;
