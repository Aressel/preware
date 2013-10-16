/*global enyo, navigator, window, device, console, preware, $L, setTimeout*/

enyo.kind({
	name: "AppPanels",
	kind: "Panels",
	fit: true,
	// Lags on old webkit
	//realtimeFit: true,
	arrangerKind: "CollapsingArranger",
	classes: "app-panels",
	// required ipkgservice
	ipkgServiceVersion: 14,
	// filtered category/package lists
	currentType: "",
	availableCategories: [],
	packageFilters: {//filter for all = 0, available (i.e. not installed) = 1, only installed = 2, only updatable = 3
		all: 0,
		available: 1,
		installed: 2,
		updatable: 3
	},
	currentPackageFilter: -1,
	currentCategory: "",
	availablePackages: [],
	currentPackage: {},
	components: [
		{
			kind: "Signals",
			onPackagesStatusUpdate: "processStatusUpdate",
			onPackagesLoadFinished: "doneLoading",
			onLoadFeedsFinished: "parseFeeds",
			onBackendSimpleMessage: "processSimpleMessage",
			onPackageProgressMessage: "processProgressMessage",
			onPackageRefresh: "handlePackageRefresh",
			ondeviceready: "handleDeviceReady"
		},

		//Menu
		{name: "MenuPanel",
		layoutKind: "FittableRowsLayout",
		style: "width: 33.3%",
		components:[
			{kind: "PortsSearch",
			title: "Preware",
			taglines:[
				"I live... again...",
				"Miss me?",
				"Installing packages, with a penguin!",
				"How many Ports could a webOS Ports Port?",
				"Not just for Apps anymore.",
				"Now with 100% more Enyo2!"
			]},
			{name: "ScrollerPanel",
			kind: "Panels",
			arrangerKind: "CardArranger",
			fit: true,
			draggable: false,
			components: [
				{style: "width: 100%; height: 100%; background-image: url('assets/bg.png');",
				components: [
					{kind: "FittableRows",
					classes: "onyx-toolbar",
					style: "width: 90%; height: 224px; margin: 10% 2.5% 2.5% 2.5%; text-align: center; border-radius: 16px;",
					components:[
						{kind: "onyx.Spinner"},
						{name: "SpinnerText",
						style: "color: white;",
						allowHtml: true}
					]}
				]},
				{kind: "Scroller",
				horizontal: "hidden",
				classes: "enyo-fill",
				style: "background-image:url('assets/bg.png')",
				touch: true,
				components:[
					{kind: "ListItem", content: "Package Updates", ontap: "showUpdatablePackages" },
					{kind: "ListItem", content: "Available Packages", ontap: "showAvailableTypeList" },
					{kind: "ListItem", content: "Installed Packages", ontap: "showInstalledPackages" },
					{kind: "ListItem", content: "List of Everything", ontap: "showListOfEverything" }
				]}
			]},

			{kind: "onyx.Toolbar"}
		]},
		
		//Types
		{name: "TypePanels",
		kind: "Panels",
		arrangerKind: "CardArranger",
		draggable: false,
		style: "width: 33.3%;",
		components: [
			{kind: "EmptyPanel"},
			{kind: "FittableRows",
			components: [
			{kind: "onyx.Toolbar", components:[
				{style: "display: inline-block; position: absolute;", content: "Types"}
			]},
				{kind: "Scroller",
				horizontal: "hidden",
				classes: "enyo-fill",
				style: "background-image:url('assets/bg.png')",
				touch: true,
				fit: true,
				components:[
					{name: "TypeRepeater", kind: "Repeater", onSetupItem: "setupTypeItem", count: 0, components: [
						{kind: "ListItem", content: "Type", ontap: "typeTapped"}
					]}
				]},
				{kind: "GrabberToolbar"}
			]}
		]},
		
		//Categories
		{name: "CategoryPanels",
		kind: "Panels",
		arrangerKind: "CardArranger",
		draggable: false,
		style: "width: 33.3%;",
		components: [
			{kind: "EmptyPanel"},
			{kind: "FittableRows",
			components: [
				{kind: "onyx.Toolbar", components:[
					{style: "display: inline-block; position: absolute;", content: "Categories"}
				]},
				{kind: "Scroller",
				horizontal: "hidden",
				classes: "enyo-fill",
				style: "background-image:url('assets/bg.png')",
				touch: true,
				fit: true,
				components:[
					{name: "CategoryRepeater", kind: "Repeater", onSetupItem: "setupCategoryItem", count: 0, components: [
						{kind: "ListItem", content: "Category", ontap: "categoryTapped"}
					]}
				]},
				{kind: "GrabberToolbar"}
			]}
		]},	

		//Packages
		{name: "PackagePanels",
		kind: "Panels",
		arrangerKind: "CardArranger",
		draggable: false,
		style: "width: 33.3%;",
		components: [
			{kind: "EmptyPanel"},
			{kind: "FittableRows",
			components: [
				{kind: "onyx.Toolbar", components:[
					{style: "display: inline-block; position: absolute;", content: "Packages"}
				]},
				{kind: "Scroller",
				horizontal: "hidden",
				classes: "enyo-fill",
				style: "background-image:url('assets/bg.png')",
				touch: true,
				fit: true,
				ontap: "showPackage",
				components:[
					{name: "PackageRepeater", kind: "Repeater", onSetupItem: "setupPackageItem", count: 0, components: [
						{kind: "ListItem", content: "Package", icon: true, ontap: "packageTapped"}
					]}
				]},
				{kind: "GrabberToolbar"}
			]}
		]},

		//Package Display
		{name: "PackageDisplayPanels",
		kind: "Panels",
		arrangerKind: "CardArranger",
		draggable: false,
		style: "width: 33.3%;",
		components: [
			{kind: "EmptyPanel"},
			{kind: "FittableRows",
			components: [
				{kind: "onyx.Toolbar", components:[
					{name: "PackageIcon", kind: "Image", style: "height: 100%; margin-right: 8px;"},
					{name: "PackageTitle", style: "display: inline-block; position: absolute;", content: "Package"}
				]},
				{kind: "Scroller",
				style: "position: absolute; top: 54px; bottom: 54px;",
				horizontal: "hidden",
				touch: true,
				ontap: "showPackage",
				components:[
					{style: "padding: 15px;", components: [
						{kind: "onyx.Groupbox", components: [
							{kind: "onyx.GroupboxHeader", content: "Description"},
							{name: "PackageDescription",
							style: "padding: 15px; color: white;",
							allowHtml: true},

							{kind: "onyx.GroupboxHeader", content: "Homepage"},
							{name: "PackageHomepage",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "Maintainter"},
							{name: "PackageMaintainer",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "Version"},
							{name: "PackageVersion",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "Last Updated"},
							{name: "PackageLastUpdated",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "Download Size"},
							{name: "PackageDownloadSize",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "Installed Version"},
							{name: "PackageInstalledVersion",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "Installed"},
							{name: "PackageInstalledDate",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "Installed Size"},
							{name: "PackageInstalledSize",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "ID"},
							{name: "PackageID",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "License"},
							{name: "PackageLicense",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "Type"},
							{name: "PackageType",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "Category"},
							{name: "PackageCategory",
							style: "padding: 15px; color: white;"},

							{kind: "onyx.GroupboxHeader", content: "Feed"},
							{name: "PackageFeed",
							style: "padding: 15px; color: white;"}
						]}
					]}
				]},
				{name: "SimpleMessage",
				kind: "Toast",
				style: "height: 90px;",
				components: [
					{name: "SimpleMessageContent",
					style: "display: block; font-size: 14pt; height: 32px;",
					allowHtml: true,
					content: "Message<br>I am a fish."},
					{kind: "onyx.Button", style: "display: block; width: 100%; margin-top: 4px;", content: "Okay", ontap: "hideSimpleMessage"}
				]},
				{name: "ActionMessage",
				kind: "Toast",
				components: [
					{name: "ActionMessageContent",
					style: "display: block; font-size: 14pt; height: 46px;",
					allowHtml: true,
					content: "Message<br>I am a fish."},
					{kind: "onyx.Button", style: "display: block; width: 100%; margin-top: 10px;", content: "Button 1", ontap: "hideActionMessage"},
					{kind: "onyx.Button", style: "display: block; width: 100%; margin-top: 10px;",  content: "Button 2", ontap: "hideActionMessage"}
				]},
				{name: "ProgressMessage",
				kind: "Toast",
				style: "height: 256px;",
				components: [
					{name: "ProgressMessageContent",
					style: "display: block; font-size: 14pt; height: 132px; margin-top: 8px;",
					allowHtml: true,
					content: "Message<br>I am a fish."},
					{kind: "onyx.Spinner", classes: "onyx-light"}
				]},
				{kind: "GrabberToolbar", style: "position: absolute; bottom: 0; width: 100%;", components:[
					{name: "InstallButton", kind: "onyx.Button", content: "Install", ontap: "installTapped"},
					{name: "UpdateButton", kind: "onyx.Button", content: "Update", ontap: "updateTapped"},
					{name: "RemoveButton", kind: "onyx.Button", content: "Remove", ontap: "removeTapped"},
					{name: "LaunchButton", kind: "onyx.Button", content: "Launch", ontap: "launchTapped"}
				]}
			]}
		]}
	],
	//Handlers
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		if(window.PalmServiceBridge === undefined) {
			this.log("No PalmServiceBridge found.");
			this.$.ScrollerPanel.setIndex(1);
		} else {
			this.log("PalmServiceBridge found. 2");
		}
	},
	handleDeviceReady: function(inSender, inEvent) {
		this.log("device.version: " + device ? device.version : "undefined");
		this.log("device.name: " + device ? device.name : "undefined");
		
		this.startLoadFeeds();
	},
	reflow: function(inSender) {
		this.inherited(arguments);
		if(enyo.Panels.isScreenNarrow()) {
			this.setArrangerKind("CoreNaviArranger");
			this.setDraggable(false);
			this.$.CategoryPanels.addStyles("box-shadow: 0");
			this.$.PackagePanels.addStyles("box-shadow: 0");
			this.$.PackageDisplayPanels.addStyles("box-shadow: 0");
		}
		else {
			this.setArrangerKind("CollapsingArranger");
			this.setDraggable(true);
			this.$.TypePanels.addStyles("box-shadow: -4px 0px 4px rgba(0,0,0,0.3)");
			this.$.CategoryPanels.addStyles("box-shadow: -4px 0px 4px rgba(0,0,0,0.3)");
			this.$.PackagePanels.addStyles("box-shadow: -4px 0px 4px rgba(0,0,0,0.3)");
			this.$.PackageDisplayPanels.addStyles("box-shadow: -4px 0px 4px rgba(0,0,0,0.3)");
		}
	},
	displaySimpleMessage: function(inMessage) {
		this.hideProgressMessage();
		this.hideActionMessage();

		this.$.SimpleMessageContent.setContent(inMessage);
		if(this.$.SimpleMessage.value !== this.$.SimpleMessage.min) {
			this.$.SimpleMessage.animateToMin();
		}
	},
	hideSimpleMessage: function() {
		this.$.SimpleMessage.animateToMax();
	},
	displayProgressMessage: function(inEvent) {
		this.hideSimpleMessage();
		this.hideActionMessage();

		this.$.ProgressMessageContent.setContent(inEvent.message);
		if(this.$.ProgressMessage.value !== this.$.ProgressMessage.min) {
			this.$.ProgressMessage.animateToMin();
		}
	},
	hideProgressMessage: function() {
		this.$.ProgressMessage.animateToMax();
	},
	displayActionMessage: function(inEvent) {
		this.hideSimpleMessage();
		this.hideProgressMessage();

		this.$.ActionMessageContent.setContent(inEvent.message);
		if(this.$.ActionMessage.value !== this.$.ActionMessage.min) {
			this.$.ActionMessage.animateToMin();
		}
	},
	hideActionMessage: function() {
		this.$.ActionMessage.animateToMax();
	},
	//Action Functions
	log: function(text) {
		//this.inherited(arguments);
		console.error(text);
		this.$.SpinnerText.setContent(text);
	},
	sortPackageList: function(field) {
		if (!field) {
			field = "title";
		}
		this.availablePackages.sort(function(a, b) {
					var strA, strB;
					if (a[field] && b[field]) {
						if (typeof a[field] === 'string') {
							strA = a[field].toLowerCase();
							strB = b[field].toLowerCase();
						} else {
							strA = a[field];
							strB = b[field];
						}
						return ((strA < strB) ? -1 : ((strA > strB) ? 1 : 0));
					}
					return -1;
		});
	},
	showListOfEverything: function() {
		var i, pkg;
		this.currentPackageFilter = this.packageFilters.all;
		this.availablePackages = [];
		
		for(i = 0; i < preware.PackagesModel.packages.length; i += 1) {
			pkg = preware.PackagesModel.packages[i];
			if(this.availablePackages.indexOf(pkg) === -1) {
				this.availablePackages.push(pkg);
			}
		}
		this.sortPackageList("date");
		
		this.$.PackageRepeater.setCount(this.availablePackages.length);
		this.$.PackagePanels.setIndex(1);
		this.setIndex(3);
	},
	showUpdatablePackages: function () {
		var i, pkg;
		this.currentPackageFilter = this.packageFilters.updatable;
		this.availablePackages = [];
		
		for(i = 0; i < preware.PackagesModel.packages.length; i += 1) {
			pkg = preware.PackagesModel.packages[i];
			if(pkg.hasUpdate) {
				if(this.availablePackages.indexOf(pkg) === -1) {
					this.availablePackages.push(pkg);
				}
			}
		}
		this.sortPackageList();
		
		this.$.PackageRepeater.setCount(this.availablePackages.length);
		this.$.PackagePanels.setIndex(1);
		this.setIndex(3);
	},
	showInstalledPackages: function() {
		var i, pkg;
		this.currentPackageFilter = this.packageFilters.installed;
		this.availablePackages = [];
		
		for(i = 0; i < preware.PackagesModel.packages.length; i += 1) {
			pkg = preware.PackagesModel.packages[i];
			if(pkg.isInstalled) {
				if(this.availablePackages.indexOf(pkg) === -1) {
					this.availablePackages.push(pkg);
				}
			}
		}
		this.sortPackageList();
		
		this.$.PackageRepeater.setCount(this.availablePackages.length);
		this.$.PackagePanels.setIndex(1);
		this.setIndex(3);
	},
	showAvailableTypeList: function() {
		this.currentPackageFilter = this.packageFilters.available;
		this.$.TypePanels.setIndex(1);
		this.setIndex(1);
	},
	typeTapped: function(inSender) {
		var i, pkg;
		this.currentType = inSender.$.ItemTitle.content;
		this.availableCategories = [];

		for(i = 0; i < preware.PackagesModel.packages.length; i += 1) {
			pkg = preware.PackagesModel.packages[i];
			if((this.currentPackageFilter === this.packageFilters.available && pkg.isInstalled) 
				|| (this.currentPackageFilter === this.packageFilters.installed && !pkg.isInstalled)
				|| (this.currentPackageFilter === this.packageFilters.updatable && !pkg.hasUpdate)) {
				continue;
			}
			if(pkg.type === inSender.$.ItemTitle.content) {
				if(this.availableCategories.indexOf(pkg.category) === -1) {
					this.availableCategories.push(pkg.category);
				}
			}	
		}
		this.availableCategories.sort();

		this.$.CategoryRepeater.setCount(this.availableCategories.length);
		this.$.CategoryPanels.setIndex(1);
		this.setIndex(2);
	},
	categoryTapped: function(inSender) {
		var i, pkg;
		this.currentCategory = inSender.$.ItemTitle.content;
		this.availablePackages = [];

		for(i = 0; i < preware.PackagesModel.packages.length; i += 1) {
			pkg = preware.PackagesModel.packages[i];
			if((this.currentPackageFilter === this.packageFilters.available && pkg.isInstalled) 
				|| (this.currentPackageFilter === this.packageFilters.installed && !pkg.isInstalled)
				|| (this.currentPackageFilter === this.packageFilters.updatable && !pkg.hasUpdate)) {
				continue;
			}
			if(pkg.type === this.currentType && pkg.category === this.currentCategory) {
				if(this.availablePackages.indexOf(pkg) === -1) {
					this.availablePackages.push(pkg);
				}
			}	
		}
		this.sortPackageList();

		this.$.PackageRepeater.setCount(this.availablePackages.length);
		this.$.PackagePanels.setIndex(1);
		this.setIndex(3);
	},
	packageTapped: function(inSender) {
		this.updateCurrentPackage(inSender.$.ItemTitle.content);
		this.refreshPackageDisplay();

		this.$.PackageDisplayPanels.setIndex(1);
		this.setIndex(4);
	},
	launchTapped: function() {
		this.currentPackage.launch();
	},
	installTapped: function() {
		this.currentPackage.doInstall();
	},
	updateTapped: function() {
		this.currentPackage.doUpdate();
	},
	removeTapped: function() {
		this.currentPackage.doRemove();
	},
	//Unsorted Functions
	versionTap: function(inSender, inEvent) {
		preware.IPKGService.version(this.gotVersion.bind(this));
		this.log("Getting Version");
	},
	gotVersion: function(version) {
		this.log("Version: " + JSON.stringify(version) + "<br>");
	},
	machineName: function() {
		preware.IPKGService.getMachineName(this.gotMachineName.bind(this));
		this.log("Requesting Machine Name");
	},
	gotMachineName: function(machineName) {
		this.log("Got Machine Name: " + machineName + " (" + JSON.stringify(machineName) + ")");
	},
	startLoadFeeds: function() {
		this.log("Start Loading Feeds");
		preware.DeviceProfile.getDeviceProfile(this.gotDeviceProfile.bind(this), false);
	},
	gotDeviceProfile: function(inSender, inEvent) {
		this.log("Got Device Profile: " + (inEvent ? inEvent.success : ""));
		if (!inEvent.success || !inEvent.deviceProfile) {
			this.log("Failed to get device profile.");
			preware.IPKGService.getMachineName(this.onDeviceType.bind(this));
			this.log("Requesting Machine Name.");
		} else {
			this.log("Got deviceProfile: " + JSON.stringify(inEvent.deviceProfile));
			this.deviceProfile = inEvent.deviceProfile;
			preware.PalmProfile.getPalmProfile(this.gotPalmProfile.bind(this), false);
		}
	},
	gotPalmProfile: function(inSender, inEvent) {
		if (!inEvent.success || !inEvent.palmProfile) {
			this.log("failed to get palm profile");
			preware.IPKGService.getMachineName(this.onDeviceType.bind(this));
			this.log("Requesting Machine Name");
		} else {
			this.log("Got palmProfile.");
			this.palmProfile = inEvent.palmProfile;
			preware.IPKGService.setAuthParams(this.authParamsSet.bind(this),
					this.deviceProfile.deviceId,
					this.palmProfile.token);
		}
	},
	authParamsSet: function(inResponse) {
		this.log("Got authParams: " + JSON.stringify(inResponse));
		preware.IPKGService.getMachineName(this.onDeviceType.bind(this));
		this.log("Requesting Machine Name");
	},
	onDeviceType: function(inEvent) {
		if (true || preware.PrefCookie.get().updateInterval === 'launch') { //TODO: add support for daily, ask (now it's launch and manual only).
			// start by checking the internet connection
			this.log("Requesting Connection Status");
		
			navigator.service.Request("palm://com.palm.connectionmanager",{
				method: "getstatus",
				onSuccess: this.onConnection.bind(this),
				onFailure: this.onConnectionFailure.bind(this)
			});
		} else {
			this.loadFeeds();
		}
	},
	onConnectionFailure: function(response) {
		this.log("ConnectionStatus Failure, response="+JSON.stringify(response));
		this.loadFeeds();
	},
	onConnection: function(response) {
		var hasNet = false;
		if (response && response.returnValue === true && (response.isInternetConnectionAvailable === true || response.wifi.state === "connected"))	{
			hasNet = true;
		}
		this.log("Got Connection Status. Connection: " + hasNet);
		//this.log("Response: " + JSON.stringify(response));
		// run version check
		this.log("Run Version Check");
		preware.IPKGService.version(this.onVersionCheck.bind(this, hasNet));
	},
	onVersionCheck: function(hasNet, payload) {
		this.log("Version Check Returned: " + JSON.stringify(payload));
		try
		{
			// log payload for display
			preware.IPKGService.logPayload(payload, 'VersionCheck');

			if (!payload) {
				// i dont know if this will ever happen, but hey, it might
				this.log($L("Cannot access the service. First try restarting Preware, or reboot your device and try again."));
			} else if (payload.errorCode !== undefined) {
				if (payload.errorText === "org.webosinternals.ipkgservice is not running.") {
					this.log($L("The service is not running. First try restarting Preware, or reboot your device and try again."));
				} else {
					this.log(payload.errorText);
				}
			}	else {
				if (payload.apiVersion && payload.apiVersion < this.ipkgServiceVersion) {
					// this is if this version is too old for the version number stuff
					this.log($L("The service version is too old. First try rebooting your device, or reinstall Preware and try again."));
				}
				else {
					if (hasNet && !this.onlyLoad) {
						// initiate update if we have a connection
						this.log("start to download feeds");
						preware.FeedsModel.loadFeeds(this.downLoadFeeds.bind(this));
						this.log("...");
					}
					else {
						// if not, go right to loading the pkg info
						this.loadFeeds();
					}
				}
			}
		}
		catch (e) {
			console.error("app#onVersionCheck: " + e);
		}
	},
	downLoadFeeds: function(inSender, inEvent) {
		this.log("loaded feeds: " + JSON.stringify(inEvent));
		this.feeds = inEvent;
		
		if (this.feeds.length) {
			this.downloadFeedRequest(0);
		}
	},
	downloadFeedRequest: function(num) {	
		// update display
		this.processStatusUpdate(this, {message: $L("<strong>Downloading Feed Information</strong><br>") + this.feeds[num].name});
	
		// subscribe to new feed
		preware.IPKGService.downloadFeed(this.downloadFeedResponse.bind(this, num),
										this.feeds[num].gzipped, this.feeds[num].name, this.feeds[num].url);
	},
	downloadFeedResponse: function(num, payload) {
		if (!payload.returnValue || payload.stage === "failed") {
			this.log(payload.errorText + '<br>' + payload.stdErr.join("<br>"));
		} else if (payload.stage === "status") {
			this.processStatusUpdate(this, {message: $L("<strong>Downloading Feed Information</strong><br>") + this.feeds[num].name + "<br><br>" + payload.status});
		} else if (payload.stage === "completed") {
			num = num + 1;
			if (num < this.feeds.length) {
				// start next
				this.downloadFeedRequest(num);
			} else {
				// we're done
				this.processStatusUpdate(this, {message: $L("<strong>Done Downloading!</strong>")});
				
				// well updating looks to have finished, lets log the date:
				preware.PrefCookie.put('lastUpdate', Math.round(new Date().getTime()/1000.0));
				
				this.loadFeeds();
			}
		}
	},
	loadFeeds: function(){	
		// lets call the function to update the global list of pkgs
		this.processStatusUpdate(this, {message: $L("<strong>Loading Package Information</strong><br>")});
		preware.FeedsModel.loadFeeds();
	},
	parseFeeds: function(inSender, inEvent) {
		preware.PackagesModel.loadFeeds(inEvent.feeds, this.onlyLoad); //TODO: how did old preware set/unset onlyload?
	},
	processStatusUpdate: function(inSender, inEvent) {
		this.log(inEvent.message);
	},
	processSimpleMessage: function(inSender, inEvent) {
		this.displaySimpleMessage(inEvent);
	},
	processProgressMessage: function(inSender, inEvent) {
		this.displayProgressMessage(inEvent);
	},
	doneLoading: function() {
		// so if we're inactive we know to push a scene when we return
		//this.isLoading = false;
	
		// show that we're done (while the pushed scene is going)
		this.processStatusUpdate(this, {message: $L("<strong>Done!</strong>")});
		//this.hideProgress();
	
		// we're done loading so let the device sleep if it needs to
		// TODO: convert stayAwake.js to enyo, implement stayAwake.start() etc
		//this.stayAwake.end();
	
		//alert(packages.packages.length);
	
		if ((!this.isActive || !this.isVisible)) {	
			// if we're not the active scene, let them know via banner:
			if (this.onlyLoad) {
				navigator.notification.showBanner($L("Preware: Done Loading Feeds"), {source:'updateNotification'}, 'miniicon.png');
			} else {
				navigator.notification.showBanner($L("Preware: Done Updating Feeds"), {source:'updateNotification'}, 'miniicon.png');
			}
		}
	
		// show the menu
		var storedThis = this;
		setTimeout(function() {
			storedThis.$.ScrollerPanel.setIndex(1);
		}, 500);

		this.$.TypeRepeater.setCount(preware.PackagesModel.types.length);
		this.$.CategoryRepeater.setCount(preware.PackagesModel.categories.length);
		this.$.PackageRepeater.setCount(preware.PackagesModel.packages.length);
	},
	handlePackageRefresh: function() {
		this.updateCurrentPackage(this.currentPackage.title);
		this.refreshPackageDisplay();
	},
	updateCurrentPackage: function(inTitle) {
		var i, pkg;
		for(i = 0; i < preware.PackagesModel.packages.length; i += 1) {
			pkg = preware.PackagesModel.packages[i];
			if(pkg.title === inTitle) {
				this.currentPackage = pkg;
				break;
			}	
		}
	},
	refreshPackageDisplay: function() {
		this.$.PackageTitle.setContent(this.currentPackage.title);
		this.$.PackageIcon.setSrc(this.currentPackage.icon);
		this.$.PackageDescription.setContent(this.currentPackage.description);
		this.$.PackageHomepage.setContent(this.currentPackage.homepage);
		this.$.PackageMaintainer.setContent(this.currentPackage.maintainer);
		this.$.PackageVersion.setContent(this.currentPackage.version);
		this.$.PackageLastUpdated.setContent(this.currentPackage.date);
		this.$.PackageDownloadSize.setContent(this.currentPackage.size);
		this.$.PackageInstalledVersion.setContent(this.currentPackage.versionInstalled);
		this.$.PackageInstalledDate.setContent(this.currentPackage.dateInstalled);
		this.$.PackageInstalledSize.setContent(this.currentPackage.sizeInstalled);
		this.$.PackageID.setContent(this.currentPackage.pkg);
		this.$.PackageLicense.setContent(this.currentPackage.license);
		this.$.PackageType.setContent(this.currentPackage.type);
		this.$.PackageCategory.setContent(this.currentPackage.category);
		this.$.PackageFeed.setContent(this.currentPackage.feedString);

		this.$.InstallButton.setDisabled(this.currentPackage.isInstalled);
		this.$.UpdateButton.setDisabled(!this.currentPackage.isInstalled || !this.currentPackage.hasUpdate);
		this.$.RemoveButton.setDisabled(!this.currentPackage.isInstalled);
		this.$.LaunchButton.setDisabled(!this.currentPackage.isInstalled);
	},
	setupTypeItem: function(inSender, inEvent) {
		inEvent.item.$.listItem.$.ItemTitle.setContent(preware.PackagesModel.types[inEvent.index]);	
		return true;
	},	
	setupCategoryItem: function(inSender, inEvent) {
		inEvent.item.$.listItem.$.ItemTitle.setContent(this.availableCategories[inEvent.index]);	
		return true;
	},
	setupPackageItem: function(inSender, inEvent) {
		var pkg = this.availablePackages[inEvent.index];
		if(pkg && pkg.title) {
			inEvent.item.$.listItem.$.ItemTitle.setContent(pkg.title);
			inEvent.item.$.listItem.$.ItemIcon.setSrc(pkg.icon);	
		}

		return true;
	}
});
