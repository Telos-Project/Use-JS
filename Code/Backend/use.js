function openResource(path) {

	if(path.startsWith("http://") || path.startsWith("https://")) {

		let xhr = require('xmlhttprequest').XMLHttpRequest;
		
		let request = new xhr();
		request.open("GET", path, false);

		let text = "";

		request.onreadystatechange = function() {

			if(request.readyState === 4) {

				if(request.status === 200 || request.status == 0)
					text = request.responseText;
			}
		}

		request.send(null);

		return text;
	}

	return require("fs").readFileSync(path, "utf-8");
}

function useJS() {

	try {

		use(true);

		return;
	}

	catch(error) {

	}

	var child_process = require("child_process");
	var fs = require("fs");
	var moduleUtils = require("module");
	var path = require('path');

	try {
		child_process.execSync("npm init -y");
	}

	catch(error) {

	}

	try {
		require("xmlhttprequest");
	}
	
	catch(error) {

		try {
			child_process.execSync("npm install xmlhttprequest");
		}

		catch(error) {

		}
	}
		
	var installedModules = [].concat(moduleUtils.builtinModules);
	installedModules.push("xmlhttprequest");

	module.paths.push(process.cwd() + path.sep + "node_modules");

	try {

		installedModules = installedModules.concat(
			Object.keys(
				JSON.parse(
					require("child_process").
						execSync('npm ls --json').
						toString()
				).dependencies
			)
		);
	}
	
	catch(error) {
		
	}

	use = function(path, options) {

		if(path == true)
			return use;

		if(typeof options != "object")
			options = { };

		if(options.async == true || typeof options.async == "function") {

			let promise = new Promise(function(resolve, reject) {

				try {

					resolve(
						use(
							path,
							{
								dynamic: options.dynamic,
								global: options.global,
								reload: options.reload
							}
						)
					);
				}

				catch(error) {
					reject(error);
				}
			});

			if(options.async != true)
				promise.then(options.async);

			return options.async == true ? promise : undefined;
		}

		if(!options.dynamic) {

			if(options.reload) {

				if(use.cache[path] != null)
					delete use.cache[path];
			}

			else if(use.cache[path] != null)
				return use.cache[path];

			use.cache[path] = { };

			if(!path.startsWith("http://") &&
				!path.startsWith("https://") &&
				!options.global) {

				let modulePath = path.includes("/") ?
					path.substring(0, path.indexOf("/")) : path;

				if(!(
					require("fs").existsSync(path) ||
						require("fs").existsSync(path + ".js")
				) && !installedModules.includes(modulePath)) {
			
					try {

						use.execSync("npm install \"" + modulePath + "\"");

						installedModules.push(modulePath);
					}
		
					catch(error) {
						
					}
				}

				try {
		
					let item = null;
					
					if(installedModules.includes(modulePath)) {

						try {
							item = require(path);
						}

						catch(error) {

							try {

								item = require(
									process.cwd() + "/node_modules/" + path
								);
							}
	
							catch(error) {
								item = require(path);
							}
						}
					}

					else {

						let text = openResource(path);

						try {
							item = JSON.parse(text);
						}

						catch(error) {

							item = (new Function(
								"use = arguments[0]; require = arguments[1];" +
									"var module={exports:{}};" +
									text +
									";return module.exports;"
							))(use, require);
						}
					}

					use.cache[path] = item;
		
					return item;
				}

				catch(error) {

					delete use.cache[path];

					return { };
				}
			}
		}

		let data = options.dynamic ? path : openResource(path);
		
		let result = null;

		try {
			result = JSON.parse(data);
		}

		catch(error) {
			
			if(!options.global) {
	
				data =
					"use = arguments[0];var module={exports:{}};" +
					data +
					";return module.exports;";
	
				result = (new Function(data))(use);
			}
	
			else {
	
				var module = { exports: { } };
	
				(1, eval)(data);
	
				result = module.exports;
			}
		}
		
		if(!options.dynamic)
			use.cache[path] = result;

		return result;
	}

	global.use = use;
	
	use.cache = { };

	use.execSync = child_process.execSync;
	use.fs = fs;
}

useJS();