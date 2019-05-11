const path = require("path");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const ApplicationAlias = (sourceDirectory, targetDirectory) =>
{
	return {
	}
};

const SharedRules = (isDevelopment) =>
{
	return [

		{
			test: /\.(woff|woff2|ttf|eot)$/,
			loader: "file-loader?name=assets/fonts/[name]-[hash:6].[ext]"
		},

		{
			test: /\.(png|jpg|gif|tif|tiff|cur)$/,
			loader: "file-loader?name=assets/images/[name].[ext]"
		},

		{
			test: /\.(svg)$/,
			loader: "file-loader?name=assets/vector/[name].[ext]"
		},

	];
};

const ApplicationRules = (isDevelopment) =>
{
	return [

		{
			test: /\.(sa|sc|c)ss$/,
			use: [ MiniCssExtractPlugin.loader, isDevelopment ? "css-loader" : "css-loader?minimize", "resolve-url-loader", "sass-loader?sourceMap" ]
		},

		{
			test: /\.less$/,
			use: [ MiniCssExtractPlugin.loader, isDevelopment ? "css-loader" : "css-loader?minimize", "resolve-url-loader", "less-loader", ]
		},

		{
			test: /\.ts$/,
			use: [ "awesome-typescript-loader?silent=true" ]
		},

		{
			test: /\.html$/,
			use: "html-loader?minimize=false"
		},

		...SharedRules(isDevelopment),

	];
};

const VendorRules = (isDevelopment) =>
{
	return [

		{
			test: /\.(sa|sc|c)ss$/,
			use: [ MiniCssExtractPlugin.loader, isDevelopment ? "css-loader" : "css-loader?minimize", "resolve-url-loader", "sass-loader?sourceMap" ]
		},

		{
			test: /\.less$/,
			use: [ MiniCssExtractPlugin.loader, isDevelopment ? "css-loader" : "css-loader?minimize", "resolve-url-loader", "less-loader", ]
		},

		...SharedRules(isDevelopment),

	];
};

const ApplicationPlugins = (sourceDirectory, targetDirectory) =>
{
	return [

		new CleanWebpackPlugin
		({
			dry: false,
			verbose: true,
			dangerouslyAllowCleanPatternsOutsideProject: true,
			cleanAfterEveryBuildPatterns: [],
			cleanOnceBeforeBuildPatterns:
			[
				path.join(targetDirectory, "wwwroot/dist/webpack/application"),
				path.join(targetDirectory, "wwwroot/dist/assets/images")
			]
		}),

		new CopyWebpackPlugin
		(
			[
				{
					from: path.join(sourceDirectory, "Assets", "Images", "GoogleMapsPin.png"),
					to: path.join(targetDirectory, "wwwroot/dist/assets/images")
				},
			],
			{
				copyUnmodified: true,
				logLevel: "info",
				ignore:
				[
					".DS_Store"
				]
			}
		),

	]
};

const VendorPlugins = (sourceDirectory, targetDirectory) =>
{
	return [

		new CleanWebpackPlugin
		({
			verbose: true,
			dangerouslyAllowCleanPatternsOutsideProject: true,
			cleanAfterEveryBuildPatterns: [],
			cleanOnceBeforeBuildPatterns:
			[

				path.join(targetDirectory, "wwwroot/dist/webbpack/vendor")
			]
		}),

	]
};

const TreeShakableModules =
[
	"linqts",
];

const NonTreeShakableModules =
[
	"animate.css/animate.css",
];

const AllModules = TreeShakableModules.concat(NonTreeShakableModules);

module.exports =
{
	ApplicationAlias,
	ApplicationRules,
	VendorRules,
	TreeShakableModules,
	NonTreeShakableModules,
	AllModules,
	ApplicationPlugins,
	VendorPlugins,
};
