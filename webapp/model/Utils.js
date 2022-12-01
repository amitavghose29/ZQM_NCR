sap.ui.define([
], function () {
    "use strict";
    return {

        getScreenFieldPropsOnSelectedTab: function (oSelectedTab) {
            switch (oSelectedTab) {
                case "Hdata":
                    return ["NcType", "Priority", "InWhich", "PlantCode", "ProductCode", "WI", "PrdOrder", "SupNC", "PartNum", "PartDesc", "SerNo", "TraceNum", "NCCWC", "NCDWC", "SupByNC", "RefNC", "Aircraft", "BinLoc", "DropPt"];
                case "Discre":
                    return [];
                case "Signoff":
                    return [];
                case "Dispo":
                    return [];
                case "Purchase":
                    return [];

            }
        }
    };
});
