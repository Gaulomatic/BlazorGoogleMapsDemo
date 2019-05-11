const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;
const ConcatPlugin = require('webpack-concat-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const Shared = require("./webpack.config.shared");

/*****************************
 * Start | Config
 ****************************/
const GetConfig = (sourceDirectory, targetDirectory, isDevelopment) =>
{
	return {

		mode: isDevelopment ? "development" : "production",
		devtool: isDevelopment ? "source-map" : false,
		node: { fs: "empty" },
		stats: { modules: false },

		resolve:
		{
			extensions: [ ".js", ".ts", ".scss", ".svg", ".jpg" ],
			alias: Shared.ApplicationAlias(sourceDirectory, targetDirectory),
			modules:
			[
				// Make ~ availible to root of application as well as "node_modules".
				// Defaults to "node_modules" alone.
				path.resolve(sourceDirectory),
				"node_modules"
			],
		},

		entry:
		{
			"boot": path.join(sourceDirectory, "Client", "Boot.ts"),
			"styles": path.join(sourceDirectory, "Assets", "Styles", "Styles.scss"),
		},

		output:
		{
			path: path.join(targetDirectory, "wwwroot", "dist", "webpack", "application"),
			filename: "[name].js",
			publicPath: "/dist/webpack/application/" // Webpack dev middleware, if enabled, handles requests for this URL prefix
		},

		module:
		{
			rules: Shared.ApplicationRules(isDevelopment),
		},

		plugins: Shared.ApplicationPlugins(sourceDirectory, targetDirectory)

			.concat
			([
				new CheckerPlugin(),

				new MiniCssExtractPlugin
				({
					filename: "[name].css",
				}),

				new ConcatPlugin
				({
					uglify: !isDevelopment,
					sourceMap: isDevelopment,
					name: "scripts",
					fileName: '[name].js',
					filesToConcat:
					[
						"Assets/Scripts/jquery/jquery.js",
						"Assets/Scripts/jquery.gmap/jquery.gmap.js",
						"Assets/Scripts/jquery.gmap/map-styles.js",
					],
					attributes:
					{
						async: true
					}
				}),

				new webpack.DllReferencePlugin
				({
					context: targetDirectory,
					manifest: require(path.join(targetDirectory, "wwwroot", "dist", "webpack", "vendor", "vendor-manifest.json"))
				})
			])

			.concat(isDevelopment ?
			[
				// new webpack.SourceMapDevToolPlugin
				// ({
				// 	filename: "[file].map", // Remove this line if you prefer inline source maps
				// 	moduleFilenameTemplate: path.relative(clientBundleOutputDir, "[resourcePath]") // Point sourcemap entries to the original file locations on disk
				// })
			] :

			[
				// Plugins that apply in production builds only
			]),

		optimization:
		{
			minimizer:

			[
			].concat(isDevelopment ?

			[
			] :

			[
				// we specify a custom TerserPlugin here to get source maps in production
				new TerserPlugin
				({
					sourceMap: true,
					terserOptions:
					{
						compress: true,
						ecma: 6,
						mangle: true,
						keep_classnames: true,
						keep_fnames: true,
					},
				}),
			])
		}
	};
};
/*****************************
 * End | Config
 ****************************/

module.exports = (env) =>
{
	const __SourceDirectory = __dirname; // Current directory
	const __TargetDirectory = path.join(__dirname);
	const __IsDevelopment = !(env && env.prod);
	const __Config = GetConfig(__SourceDirectory, __TargetDirectory, __IsDevelopment);

	return [ __Config ];
};
