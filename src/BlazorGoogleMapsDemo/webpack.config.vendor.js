const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const Shared = require("./webpack.config.shared");

/*****************************
 * Start | Config
 ****************************/
const GetConfig = (sourceDirectory, targetDirectory, isDevelopment) =>
{
	return {

		mode: isDevelopment ? "development" : "production",
		stats: { modules: false },

		resolve:
		{
			extensions: [ ".js" ]
		},

		module:
		{
			rules: Shared.VendorRules(isDevelopment),
		},

		entry:
		{
			// To keep development builds fast, include all vendor dependencies in the vendor bundle.
			// But for production builds, leave the tree-shakable ones out so the AOT compiler can produce a smaller bundle.
			vendor: isDevelopment ? Shared.AllModules : Shared.NonTreeShakableModules
		},

		output:
		{
			// publicPath: "dist/",
			filename: "[name].js",
			library: "[name]_[hash]",
			path: path.join(targetDirectory, "wwwroot", "dist", "webpack", "vendor"),
			publicPath: "/dist/webpack/vendor/"
		},

		plugins: Shared.VendorPlugins(sourceDirectory, targetDirectory)

			.concat
			([
				// new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
				new webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/, path.join(sourceDirectory, "Client")), // Workaround for https://github.com/angular/angular/issues/11580
				new webpack.ContextReplacementPlugin(/(.+)?angular(\\|\/)core(.+)?/, path.join(sourceDirectory, "Client")), // Workaround for https://github.com/angular/angular/issues/14898
				new webpack.IgnorePlugin(/^vertx$/), // Workaround for https://github.com/stefanpenner/es6-promise/issues/100

				new MiniCssExtractPlugin
				({
					filename: "vendor.css",
				}),

				new webpack.DllPlugin
				({
					path: path.join(targetDirectory, "wwwroot", "dist", "webpack", "vendor", "[name]-manifest.json"),
					name: "[name]_[hash]"
				})
			])

			.concat(isDevelopment ?
			[
			] :
			[
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
					cache: true,
					parallel: true,
					sourceMap: true,
					terserOptions:
					{
						compress: false,
						ecma: 6,
						mangle: true,
						keep_classnames: true,
						keep_fnames: true,
					},
				})
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
