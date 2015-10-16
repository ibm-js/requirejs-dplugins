/**
 * Svg loading plugin.
 *
 * This plugins loads SVG files and merges them into one SVG sprite
 *
 * @example:
 *      To load the svg file `myicons/myicon.svg`:
 *      ```
 *      require(["requirejs-dplugins/svg!myicons/myicon.svg"], function (){
 *          // myicon was added to the sprite
 *      });
 *      ```
 * @module requirejs-dplugins/svg
 */

define([
	"./has",
	"./Promise!",
	"module"
], function (has, Promise, module) {
	"use strict";

	var cache = {}, // paths of loaded svgs
		SPRITE_ID = 'requirejs-dplugins-svg',
		sprite = null;


	var loadSVG = {
		id: module.id,

		/*jshint maxcomplexity: 11*/
		/**
		 * Loads an svg file file.
		 * @param {string} path - The svg file to load.
		 * @param {Function} require - A local require function to use to load other modules.
		 * @param {Function} onload - A function to call when the specified stylesheets have been loaded.
		 * @method
		 */
		load: function (path, require, onload) {
			if (has("builder")) { // when building
				cache[path] = true;
			} else { // when running

				// special case: when running a built version
				// Replace graphic by corresponding sprite.
				var layersMap = module.config().layersMap;
				if (layersMap) {
					path = layersMap[path] || path;
				}

				try {
					var filename = getFilename(path);
					if (path in cache) {
						cache[path].then(function (graphic) {
							onload(graphic.id);
						});
					} else {
						if (!sprite) {
							sprite = createSprite(document, SPRITE_ID);
							document.body.appendChild(sprite);
						}
						cache[path] = new Promise(function (resolve) {
							require(['requirejs-text/text!' + path], function (svgText) {
								var graphic = extractGraphic(document, svgText, filename),
									symbol = createSymbol(document, graphic.id, graphic.element, graphic.viewBox);
								sprite.appendChild(symbol);
								cache[path] = graphic.id;
								resolve(graphic);
							});
						});

						cache[path].then(function (graphic) {
							onload(graphic.id);
						});
					}
				} catch (e) {
					onload();
				}
			}


		}
	};

	if (has("builder")) {
		// build variables
		var writePluginFiles;

		var buildFunctions = {
			/**
			 * Writes the layersMap configuration to the corresponding modules layer.
			 * The configuration will look like this:
			 *
			 * @param {Function} write - This function takes a string as argument
			 * and writes it to the modules layer.
			 * @param {string} mid - Current module id.
			 * @param {string} dest - Current svg sprite path.
			 * @param {Array} loadList - List of svg files contained in current sprite.
			 */
			writeConfig: function (write, mid, destMid, loadList) {
				var svgConf = {
					config: {},
					paths: {}
				};
				svgConf.config[mid] = {
					layersMap: {}
				};
				loadList.forEach(function (path) {
					svgConf.config[mid].layersMap[path] = destMid;
				});

				write("require.config(" + JSON.stringify(svgConf) + ");");
			},

			/**
			 * Concatenates all svg files required by a modules layer and write the result.
			 *
			 * @param {Function} writePluginFiles - The write function provided by the builder to `writeFile`.
			 * and writes it to the modules layer.
			 * @param {string} dest - Current svg sprite path.
			 * @param {Array} loadList - List of svg files contained in current sprite.
			 * @returns {boolean} Return `true` if the function successfully writes the layer.
			 */
			writeLayer: function (writePluginFiles, dest, loadList) {
				var fs = require.nodeRequire("fs"),
					jsdom = require.nodeRequire("jsdom").jsdom;

				var document = jsdom("<html></html>").parentWindow.document;
				var sprite = createSprite(document);

				loadList.forEach(function (path) {
					var filename = getFilename(path),
						svgText = fs.readFileSync(require.toUrl(path), "utf8"),
						graphic = extractGraphic(document, svgText, filename),
						symbol = createSymbol(document, graphic.id, graphic.element, graphic.viewBox);
					sprite.appendChild(symbol);
				});

				writePluginFiles(dest, sprite.outerHTML);
				return true;
			}
		};


		loadSVG.writeFile = function (pluginName, resource, require, write) {
			writePluginFiles = write;
		};

		loadSVG.addModules = function (pluginName, resource, addModules) {
			addModules(["requirejs-text/text"]);
		};

		loadSVG.onLayerEnd = function (write, layer) {
			if (layer.name && layer.path) {
				var dest = layer.path.replace(/^(.*\/)?(.*).js$/, "$1/$2.svg"),
					destMid = layer.name + ".svg";

				var loadList = Object.keys(cache);

				// Write layer file and config
				buildFunctions.writeLayer(writePluginFiles, dest, loadList);
				buildFunctions.writeConfig(write, module.id, destMid, loadList);

				// Reset cache
				cache = {};
			}
		};

	}

	return loadSVG;


	// takes a path and returns the filename
	function getFilename(filepath) {
		return filepath.replace(/.*\/(.*)\.svg$/g, "$1");
	}

	// makes a symbol out of an svg graphic
	function extractGraphic(document, svgText, filename) {
		var div = document.createElement("div");
		div.innerHTML = svgText;
		var element = div.querySelector("svg"),
			id = element.getAttribute("id") || filename,
			viewBox = element.getAttribute("viewbox") || element.getAttribute("viewBox") || "";
		return {
			id: id,
			viewBox: viewBox,
			element: element
		};
	}

	// makes symbol from svg element
	function createSymbol(document, id, element, viewBox) {
		var symbol = document.createElementNS("http://www.w3.org/2000/svg", "symbol");
		symbol.setAttribute("id", id);
		while (element.firstChild) {
			symbol.appendChild(element.firstChild);
		}
		viewBox && symbol.setAttribute("viewBox", viewBox);
		return symbol;
	}

	// creates empty sprite
	function createSprite(document, id) {
		var sprite = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		sprite.setAttribute("style", "display: none");
		id && sprite.setAttribute("id", id);
		return sprite;
	}
});
