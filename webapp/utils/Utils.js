sap.ui.define([ "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";
    return {

        getScreenFieldPropsOnSelectedTab: function (oSelectedTab) {
            switch (oSelectedTab) {
            case "Hdata":
               return ["NCType","NCPriority","NCArea","PlantCode","ProductCode","WorkInstruction","ProdOrder","SupercedesNC","PartNumber","PartDescription","SerialNo","TraceabilityNo","SupercededByNC","ReferenceNC","Aircraft","Binlocation","DropPoint"];
            case "Discre":
               return ["LinkedTo","Liability","Partner","SupersedesItem","SupersedesByItem","Aircraft","PartNumber","InspQnty","PrelimInvest","PrelimCause","DropPoint","Is","Shouldbe","AsPer","Select"];
            case "Signoff":
               return [];
            case "Dispo":
               return ["DispositionPartner","DispositionQnty","DispositionDropPoint"];
            case "Purchase":
               return ["NCGRNo","NCPoNumber","NCPoLineNo","NCSupplierCode","NCWayBillNo.","NCPackSlip"];  
            }
        },
        
        getReadonlyPropField: function (oDataFieldArray,oSelectedTab){
            var oReadOnlyPropsData=new Object();
            var oScreenFieldArray=this.getScreenFieldPropsOnSelectedTab(oSelectedTab);
            var oReadOnlyPropsModel = new JSONModel();
            if(oDataFieldArray.length>0){
               for(var i=0;i<oScreenFieldArray.length;i++){
                  var oFieldValue ="";
                  var hasDataExist =false;
                  for(var j=0;j<oDataFieldArray.length;j++){
                     if(oScreenFieldArray[i] == oDataFieldArray[j]){
                        oFieldValue = oScreenFieldArray[i];
                        oReadOnlyPropsData[oFieldValue]=true;
                        hasDataExist=true;
                        break;
                   }
                }
                if(hasDataExist==false){
                    oFieldValue= oScreenFieldArray[i];
                    oReadOnlyPropsData[oFieldValue]=false;
                }
             }
             oReadOnlyPropsData["button"]=true;

            }else{
                for(i=0;i<oScreenFieldArray.length;i++){
                    oReadOnlyPropsData[oScreenFieldArray[i]]=false; 

                }
                oReadOnlyPropsData["button"]=false;
            }
            oReadOnlyPropsModel.setData(oReadOnlyPropsData);
            return oReadOnlyPropsModel;
        }
    };
});