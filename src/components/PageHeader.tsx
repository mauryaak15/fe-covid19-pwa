import React from 'react';
import {MoonIcon, SunIcon} from '@heroicons/react/outline';
import {EventBus} from '@utils';

const PageHeader = () => {
    const onClickToggleIcon = () => {
        EventBus.getInstance().fireEvent('ToggleDarkMode');
    };

    return (
        <nav className="flex items-center justify-between py-8 fluid-container">
            <div className="font-bold uppercase tracking-wider text-sm dark:text-bluegray-400 text-bluegray-600">
                {new Date().toLocaleString()}
            </div>
            <button
                onClick={onClickToggleIcon}
                className="rounded-md text-bluegray-900 dark:text-bluegray-300 hover:bg-bluegray-200 dark:hover:bg-bluegray-700 p-2"
                type="button"
            >
                <MoonIcon className="h-5 w-5 dark:hidden" />
                <SunIcon className="h-5 w-5 hidden dark:block" />
            </button>
        </nav>
    );
};

export default PageHeader;
