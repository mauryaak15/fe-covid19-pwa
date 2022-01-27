const tailwindcss = require('tailwindcss');
// eslint-disable-next-line import/no-extraneous-dependencies
const autoprefixer = require('autoprefixer');
const nesting = require('tailwindcss/nesting');

module.exports = {
    plugins: [nesting, tailwindcss('./tailwind.config.js'), autoprefixer],
};

// module.exports = {
//     plugins: {
//         tailwindcss: {},
//         autoprefixer: {},
//     },
// };
