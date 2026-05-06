# Use JS

## 1 - Abstract

***We require something better.***

Use JS is an extension of CommonJS which replaces the require function with the more versatile
"use" function, and enables the usage of either in the browser.

## 2 - Contents

### 2.1 - The Use Function

While mostly identical to the CommonJS require function, the use function allows module paths to be
URLs to online resources, and may take an additional options argument.

Said options argument, if present, shall be an object containing boolean fields affecting the
behavior of the loading process.

When used in a frontend environment, the use and require functions are the same, and in addition,
Use JS may be paired with [AutoCORS](https://github.com/Telos-Project/AutoCORS) in frontend
envrionments to enable modules to be fetched across domains.

When used in a backend environment, the require function retains its default behavior, while the
use function gains the additional property of automatically downloading any module referenced by
alias if said module is not already installed.

#### 2.1.1 - Options

##### 2.1.1.1 - APInt

If the options object has the field "apint" with a value of true, it will treat a JSON file
imported by the function as an (APInt)[https://github.com/Telos-Project/APInt], and will return a
function.

Said function takes an APInt path as a string. If no such argument is given, it returns the built
contents of the imported APInt as an object. If such an argument is given, and the utility to which
it points exists within the imported APInt as a CommonJS module, which should by convention have
the tags "library" and "javascript", the function shall import and return the contents of said
utility as a CommonJS module. If such an argument is given, but the utility to which it points does
not exist within the imported APInt, the function will return null.

##### 2.1.1.2 - Async

If the options object has the field "async" with a value of true, the function will import its
target asynchronously, returning a promise which resolves to the imported utility.

If the async field contains a function instead of the boolean, the aforementioned behavior shall
still apply, but the function in said field shall operate as a callback to which the imported
utility will be passed.

##### 2.1.1.3 - Dynamic

If the options object has the field "dynamic" with a value of true, the function shall treat the
path to the imported utility as its source code.

##### 2.1.1.4 - Global

If the options object has the field "global" with a value of true, the source code of the imported
utility shall execute as top-level code in the global scope.

##### 2.1.1.5 - Reload

If the options object has the field "reload" with a value of true, any cached record of the
imported utility shall be cleared, allowing it to be reloaded.

#### 2.1.2 - The Use Convention

The use convention allows a "use" function to be implemented in languages and envrionments external
to JavaScript in a manner that mimics the original as closely as befits the nature and conventions
of the target language or environment.

### 2.2 - Usage

On the frontend, Use JS is available through the following CDN link:

    https://cdn.jsdelivr.net/gh/Telos-Project/Use-JS/Code/Frontend/use.js

Including said script will automatically render both the require and use functions available,
though the [AutoCORS](https://github.com/Telos-Project/AutoCORS) functionality must be included
separately through the AutoCORS script.

On the backend, Use JS is available on npm under the package name "telos-use-js". Merely requiring
said package shall render the use function globally available in the backend environment.