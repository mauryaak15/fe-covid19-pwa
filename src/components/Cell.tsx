import React from 'react';

interface ICellProps {
    dark?: boolean | undefined;
    className?: string;
    onClick?: () => void | undefined;
    onKeyPress?: () => void | undefined;
    children: any;
    title?: string;
}

const Cell = ({
    children,
    dark,
    className,
    onClick,
    onKeyPress,
    title,
}: ICellProps) => (
    <div
        tabIndex={onClick ? 0 : undefined}
        onKeyPress={onKeyPress}
        role="button"
        onClick={onClick}
        title={title}
        className={`p-2 lg:px-4 min-h-14 overflow-hidden text-ellipsis rounded-sm font-serif text-xs sm:text-sm transition duration-200 cursor-pointer hover:bg-bluegray-100 text-bluegray-800 dark:text-bluegray-300 dark:hover:bg-bluegray-500 break-words ${
            dark
                ? 'bg-bluegray-300 dark:bg-bluegray-700'
                : 'bg-bluegray-200 dark:bg-bluegray-600'
        } ${className}`}
    >
        {children}
    </div>
);

Cell.defaultProps = {
    dark: undefined,
    className: '',
    onClick: undefined,
    onKeyPress: undefined,
    title: undefined,
};

export default Cell;
