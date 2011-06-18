@echo off

rd build /Q /S
mkdir build

echo (function(window) { > "build/browser.js"
echo var Enumerable = window.Enumerable = window.$e = function (array) { >> "build/browser.js"
echo         return new Enumerable.fn.init(array); >> "build/browser.js"
echo     }; >> "build/browser.js"
echo var exports = Enumerable; >> "build/browser.js"
echo. >> "build/browser.js"
@TYPE lib\enumerable\index.js >> "build/browser.js"
echo. >> "build/browser.js"
echo })(window); >> "build/browser.js"

call "tools/jsmin.exe" <"build/browser.js" >> "build/browser.min.js"

nuget pack enumerablejs.nuspec -o build