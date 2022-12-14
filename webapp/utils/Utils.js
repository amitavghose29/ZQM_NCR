sap.ui.define([ "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";
    return {

        getScreenFieldPropsOnSelectedTab: function (oSelectedTab) {
            switch (oSelectedTab) {
            case "Hdata":
               return ["NCType","NCPriority","NCArea","PlantCode","ProductCode","WorkInstruction","ProdOrder","SupercedesNC","PartNumber","PartDescription","SerialNo","TraceabilityNo","SupercededByNC","ReferenceNC","Aircraftno","Binlocation","DropPoint","NCCreatedBy","NCDetectedAt"];
            case "Discre":
               return ["LinkedTo","Liability","LiabilityText","Partner","PartDesc","SupercedesItem","SupercededByItem","Aircraft","PartNumber","CompSerialNo","TraceNo","InspQnty","RejectQnty","PrelimInvest","PrelimCause","DefectCode","PartQuarantine","MESissue","CsmsIssue","DropPoint","DropShip2","Is","Shouldbe","AsPer","Incompletion","Select"];
            case "Signoff":
               return [];
            case "Dispo":
               return ["DispositionPartner","DispositionQnty","DispostionType","DispositionCode","DispositionPartReq","DispositionDropPoint","DispositionIntCharge","DispositionDropPoint","DispositionRestrictPart","DispositionCSN","DispositionPartner"];
            case "Purchase":
               return ["NCGRNo","NCPoNumber","NCPoLineNo","NCSupplierCode","NCWayBillNo","NCPackSlip"];  
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
             oReadOnlyPropsData["Button"]=true;

            }else{
                for(i=0;i<oScreenFieldArray.length;i++){
                    oReadOnlyPropsData[oScreenFieldArray[i]]=false; 

                }
                oReadOnlyPropsData["Button"]=false;
            }
            oReadOnlyPropsModel.setData(oReadOnlyPropsData);
            return oReadOnlyPropsModel;
        }
    };
});