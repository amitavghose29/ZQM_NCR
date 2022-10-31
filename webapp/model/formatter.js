sap.ui.define([], function () {
<<<<<<< HEAD
    "use strict";
    return {
        prdordDate: function (podate) {
=======
	"use strict";
	return {
		prdordDate: function (podate) {
>>>>>>> a3e564334fd5ff5a46ded5db82e80a06b27ae92f
            var dispFormat=sap.ui.getCore().getConfiguration().getFormatSettings().getDatePattern("medium");
            if(podate){
               /**var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern : dispFormat
                });**/
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: dispFormat+"THH:mm" ,UTC:false});
                //"dd.MM.yyyy"
                // setDisplayFormat(sap.ui.getCore().getConfiguration().getFormatSettings().getDatePattern("medium"));
                var pDate = oDateFormat.format(podate);
            }
            return pDate;
        }
    };
});