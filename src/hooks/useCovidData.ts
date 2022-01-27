import {Logger} from '@libs';
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@store';
import {actions} from '@store/core';
import {TCovidStats} from '@typings/common';

const logger = new Logger('useCovidData');

const useCovidData = () => {
    const [error, setError] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const getData = async () => {
            dispatch(actions.setLoading(true));
            try {
                const caseData = await fetch(`${CONFIG.apiBaseUrl}/getCases`);
                const casesJson: TCovidStats = await caseData.json();
                dispatch(actions.setCovidData(casesJson));
            } catch (err: any) {
                setError(err.message);
                logger.error(err);
            }
            dispatch(actions.setLoading(false));
        };
        getData();
    }, []);
    return {error};
};

export default useCovidData;
