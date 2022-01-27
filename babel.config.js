module.exports = (api) => {
    api.cache(true);
    const presets = [
        '@babel/env',
        '@babel/preset-react',
        '@babel/preset-typescript',
    ];
    const plugins = [
        [
            'module-resolver',
            {
                extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
                root: ['./src'],
                alias: {},
            },
        ],
    ];
    return {
        presets,
        plugins,
    };
};
