sap.ui.define([], function () {
	"use strict";
	return {
		prdordDate: function (podate) {
            if(podate){
               var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern : "dd.MM.yyyy"
                });
                // setDisplayFormat(sap.ui.getCore().getConfiguration().getFormatSettings().getDatePattern("medium"));
                var pDate = oDateFormat.format(podate);
            }
            return pDate;
		}
	};
});