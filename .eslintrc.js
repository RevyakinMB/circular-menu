module.exports = {
	"env" : {
		"browser": true,
		"amd": true
	},
    "extends": "airbnb",
    "installedESLint": true,
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
	"rules": {
		"indent": ["error", "tab"],
		"no-tabs": 0,
		"no-param-reassign": 0,
		"prefer-arrow-callback": 0,
		"no-var": 0,
		"one-var": ["error", "always"],
		"func-names": 0,
		"space-before-function-paren": 0,
		"one-var-declaration-per-line": 0,
		"no-plusplus": 0,
		"comma-dangle": 0,
		"no-continue": 0
	}
};
