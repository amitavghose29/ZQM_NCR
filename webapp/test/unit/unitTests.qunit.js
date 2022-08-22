/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comairbus/ZQM_NCR/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
