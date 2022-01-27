import React from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    ProjectionConfig,
} from 'react-simple-maps';
import {scaleQuantile} from 'd3-scale';
import {useSelector} from 'react-redux';
import {RootState} from '@store';
import {ECases, EStates, TCovidStateStats} from '@typings/common';

const INDIA_TOPO_JSON =
    'https://raw.githubusercontent.com/varunon9/india-choropleth-javascript/master/src/india.topo.json';

const PROJECTION_CONFIG: ProjectionConfig = {
    scale: 450,
    center: [78.9629, 22.5937],
};

const COLOR_RANGE_ACTIVE = [
    '#e0f2fe',
    '#bae6fd',
    '#7dd3fc',
    '#38bdf8',
    '#0ea5e9',
    '#0284c7',
    '#0369a1',
    '#075985',
    '#0c4a6e',
];
const COLOR_RANGE_DISCHARGED = [
    '#dcfce7',
    '#bbf7d0',
    '#86efac',
    '#4ade80',
    '#22c55e',
    '#16a34a',
    '#15803d',
    '#166534',
    '#14532d',
];
const COLOR_RANGE_DEATHS = [
    '#fee2e2',
    '#fecaca',
    '#fca5a5',
    '#f87171',
    '#ef4444',
    '#dc2626',
    '#b91c1c',
    '#991b1b',
    '#7f1d1d',
];

const COLOR_RANGES = new Map([
    [ECases.active, COLOR_RANGE_ACTIVE],
    [ECases.discharged, COLOR_RANGE_DISCHARGED],
    [ECases.deaths, COLOR_RANGE_DEATHS],
]);

const DEFAULT_COLOR = '#EEE';

const geographyStyle = {
    default: {
        stroke: 'rgb(21 128 61 / 1)',
        outline: 'none',
        strokeWidth: 0.2,
    },
    hover: {
        fill: '#ccc',
        transition: 'all 250ms',
        outline: 'none',
    },
    pressed: {
        outline: 'none',
    },
};

const casesMapKey = {
    [ECases.active]: 'new_active',
    [ECases.discharged]: 'new_cured',
    [ECases.deaths]: 'new_death',
} as const;

const mapStatesToDataStates: any = {
    'Andaman & Nicobar Island': EStates.Andaman_and_Nicobar_Islands,
    'Andhra Pradesh': EStates.Andhra_Pradesh,
    'Arunanchal Pradesh': EStates.Arunachal_Pradesh,
    Assam: EStates.Assam,
    Bihar: EStates.Bihar,
    Chhattisgarh: EStates.Chhattisgarh,
    Puducherry: EStates.Puducherry,
    Punjab: EStates.Punjab,
    Rajasthan: EStates.Rajasthan,
    Sikkim: EStates.Sikkim,
    'Tamil Nadu': EStates.Tamil_Nadu,
    Chandigarh: EStates.Chandigarh,
    Telangana: EStates.Telangana,
    Tripura: EStates.Tripura,
    'Uttar Pradesh': EStates.Uttar_Pradesh,
    Uttarakhand: EStates.Uttarakhand,
    'West Bengal': EStates.West_Bengal,
    Odisha: EStates.Odisha,
    'Dadara & Nagar Havelli': EStates.Dadra_and_Nagar_Haveli_and_Daman_and_Diu,
    'Daman & Diu': EStates.Dadra_and_Nagar_Haveli_and_Daman_and_Diu,
    Goa: EStates.Goa,
    Gujarat: EStates.Gujarat,
    Haryana: EStates.Haryana,
    'Himachal Pradesh': EStates.Himachal_Pradesh,
    'Jammu & Kashmir': EStates.Jammu_and_Kashmir,
    Jharkhand: EStates.Jharkhand,
    Karnataka: EStates.Karnataka,
    Kerala: EStates.Kerala,
    Lakshadweep: EStates.Lakshadweep,
    'Madhya Pradesh': EStates.Madhya_Pradesh,
    Maharashtra: EStates.Maharashtra,
    Manipur: EStates.Manipur,
    Meghalaya: EStates.Meghalaya,
    Mizoram: EStates.Mizoram,
    Nagaland: EStates.Nagaland,
    'NCT of Delhi': EStates.Delhi,
} as const;

const IndiaMap = ({
    setTooltipContent,
}: {
    setTooltipContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const covidStateData = useSelector<RootState>(
        (state) => state.core.covidData?.stateData
    ) as TCovidStateStats[];
    const activeSummaryCard = useSelector<RootState>(
        (state) => state.core.activeSummaryCard
    ) as ECases;
    const colorScale = scaleQuantile()
        .domain(
            covidStateData?.map(
                (d: TCovidStateStats) => d[casesMapKey[activeSummaryCard]]
            ) || []
        )
        .range(COLOR_RANGES.get(activeSummaryCard) as any);
    return (
        <ComposableMap
            projectionConfig={PROJECTION_CONFIG}
            projection="geoMercator"
            style={{width: '100%', height: 'auto'}}
            width={200}
            height={250}
            viewBox="0 0 250 250"
            data-tip=""
        >
            <Geographies geography={INDIA_TOPO_JSON}>
                {({geographies}) =>
                    geographies.map((geo) => {
                        const current = covidStateData.find(
                            (s) =>
                                s.state_name?.toLowerCase().trim() ===
                                geo.properties.name?.toLowerCase().trim()
                        );
                        return (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                style={{
                                    ...geographyStyle,
                                    ...{
                                        default: {
                                            ...geographyStyle.default,
                                            stroke: COLOR_RANGES.get(
                                                activeSummaryCard
                                            )?.at(5),
                                        },
                                    },
                                }}
                                fill={
                                    current
                                        ? colorScale(
                                              current[
                                                  casesMapKey[activeSummaryCard]
                                              ]
                                          ).toString()
                                        : DEFAULT_COLOR
                                }
                                onMouseEnter={() => {
                                    const {
                                        // id: stateAbbr,
                                        properties: {name: state},
                                    } = geo;
                                    const filteredData = covidStateData?.filter(
                                        (d: TCovidStateStats) =>
                                            d.state_name.toLowerCase() ===
                                            mapStatesToDataStates[
                                                state
                                            ].toLowerCase()
                                    );
                                    const totalStateCase = filteredData.length
                                        ? filteredData[0][
                                              casesMapKey[activeSummaryCard]
                                          ]
                                        : 'NA';
                                    setTooltipContent(
                                        `<center><b>${state}</b><br />${activeSummaryCard.toUpperCase()} - ${totalStateCase}</center>`
                                    );
                                }}
                                onMouseLeave={() => {
                                    setTooltipContent('');
                                }}
                            />
                        );
                    })
                }
            </Geographies>
        </ComposableMap>
    );
};

export default React.memo(IndiaMap);
