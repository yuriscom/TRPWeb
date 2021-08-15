TRPWeb
======
TheRedPin 2.0 web application


Frontend Requirements
---------------------
1. Node.js, There are two options for installing Node.js on Mac OS X:
	* Download and install the binaries from [Node.js](http://nodejs.org) (Easier, but not recommended!)
	* Using Homebrew, which is a better option:
		1. First install XCode Command Line Tools, `xcode-select --install`
		2. Install Homebrew, visit [Homebrew](http://brew.sh), or `ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"`
		3. Run `brew doctor`
		4. Run `brew install node`
2. Node Packaged Modules (or Node Package Manager), npm, which should be installed along with Node
3. Grunt, JavaScript Task Runner, `npm install -g grunt-cli` visit [Grunt](http://gruntjs.com) for more information
4. Bower, run `npm install -g bower`
5. Compass, run `gem install compass` or `sudo gem install compass`
6. First time we clone the repository, we should run `npm install` to install the dependencies for forntend development, this would also fetch specific versions of runtime vendor dependencies through bower, like jQuery, jQuery UI, Foundation, Backbone etc.


Frontend Grunt Tasks
--------------------
* `grunt graphics`, for minimizing graphics, generate spritesheets and create stylesheets for them
* `grunt vendor`, for copying vendor libraries (graphics, styles & scripts) from bower to source, then compile them into assets
* `grunt development` or `grunt watch` for watching over changes to style & script sources and compile them automatically, it leaves source mapping and console logging for debugging
* `grunt remote` injects Weinre (Web Remote Inspector) script to main HTML and runs Weinre server, for mobile web inspection, development & debugging
* `grunt production` for compiling source styles & scripts into assets
* `grunt build` runs graphics, vendor & production grunt tasks, which builds all the frontend assets

Weinre Setup
------------
* Install weinre in TRPWeb folder.
* Grab your local IP, using `ifconfig | grep 192`
* Run `grunt remote`
* Open Chrome, go to http://localhost:8082 for the inspector
* Click on debug client user interface: http://localhost:8082/client/#anonymous
* Go to your http://192... (local ip) on the mobile device
* You should now see a client connected to weinre (displayed in green color) and you can inspect it
* Vagrant should be set to forward your Mac's 8080 to Vagrant's 80 port, you should actually open http://192...:8080 to connect to the Vagrant's web server

Frontend Development Notes
--------------------------
npm install permission errors you need to install bundler with sudo

```bash
sudo gem install bundler
bundle install
```



Frontend Resources
------------------
* [Homebrew](http://brew.sh)
* [Node.js](http://nodejs.org)
* [npm](https://www.npmjs.org)
* [Grunt](http://gruntjs.com)
* [Bower](http://bower.io)
* [Compass](http://compass-style.org)
* [SASS](http://sass-lang.com)
* [RubyGems](https://rubygems.org)


Backend Requirements
--------------------
N/A

Backend Development Notes
-------------------------
N/A
