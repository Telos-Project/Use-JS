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

### 2.2 - Usage

On the frontend, Use JS is available through the following CDN link:

    https://cdn.jsdelivr.net/gh/Telos-Project/Use-JS/Code/Frontend/use.js

Including said script will automatically render both the require and use functions available,
though the [AutoCORS](https://github.com/Telos-Project/AutoCORS) functionality must be included
separately through the AutoCORS script.

On the backend, Use JS is available on npm under the package name "telos-use-js". Merely requiring
said package shall render the use function globally available in the backend environment.