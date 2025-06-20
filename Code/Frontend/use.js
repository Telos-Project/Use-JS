function useJS() {

	if(typeof use != typeof undefined)
		return;

	module = {
		id: '.',
		exports: { },
		parent: null,
		filename: "",
		loaded: false,
		children: [],
		paths: []
	};
	
	window.use = (path, options) => {

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

		let lowerPath = path.toLowerCase().
			split("-").join("").split(" ").join("");
	
		use.cache = use.cache ? use.cache : { };
	
		if(module.parent != null) {
	
			if(path.startsWith(".")) {
	
				path =
					module.filename.substring(
						0,
						module.filename.lastIndexOf('/') + 1
					) +
					path;
			}
		}
	
		while(lowerPath.startsWith("././"))
			lowerPath = lowerPath.substring(2);
	
		let cacheItem = use.cache[lowerPath];
	
		let newModule = {
			id: path,
			exports: { },
			parent: module,
			filename: path,
			loaded: false,
			children: [],
			paths: []
		};
	
		if(cacheItem == null || options.reload || options.dynamic) {

			let text = path;
			
			if(!options.dynamic) {

				let request = new XMLHttpRequest();
				request.open("GET", path, false);

				request.onreadystatechange = function() {

					if(request.readyState === 4) {

						if(request.status === 200 || request.status == 0)
							text = request.responseText;
					}
				}

				request.send(null);

				use.cache[lowerPath] = newModule;
			}

			let isJSON = false;

			try {

				JSON.parse(text);

				isJSON = true;
			}

			catch(error) {

			}

			if(isJSON)
				text = "module.exports=" + text;

			if(!options.global) {
		
				let moduleFunction = new Function(
					"var module = arguments[0];" +
					use.toString() +
					"\nuse.cache = arguments[1];" +
					text +
					";return module;"
				);
				
				let newModuleContents = moduleFunction(
					newModule,
					use.cache
				);
		
				for(key in newModuleContents.exports)
					newModule.exports[key] = newModuleContents.exports[key];
		
				module.children.push(newModule);
		
				newModule.loaded = true;
		
				return newModule.exports;
			}

			else {
				
				let module = newModule;

				(1, eval)(text);

				return module.exports;
			}
		}
	
		else
			return cacheItem.exports;
	}

	window.require = use;
}

useJS();