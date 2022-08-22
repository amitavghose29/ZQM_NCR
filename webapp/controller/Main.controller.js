sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, MessageBox, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("com.airbus.ZQM_NCR.controller.Main", {
    onInit: function () {

       var that = this;


      sap.ui.core.BusyIndicator.show();
      var oModel = new sap.ui.model.json.JSONModel();
      var oDataModel = this.getOwnerComponent().getModel();
      oDataModel.read("/Area_SOSet", {
        success: function (oData, oResult) {
          var data = oData.results;
          oModel.setData(data);
          that.getView().setModel(oModel, "userdetails");
          sap.ui.core.BusyIndicator.hide();
        },
        error: function (oError) {
          sap.ui.core.BusyIndicator.hide();
        }
      });
    },
    onRadioSelect: function () {
      var ncr = this.getView().byId("rbg1").getSelectedButton().getText();
      if (ncr === "Copy") {
        this.getView().byId("SimpleFormChange480_12120Dual").setVisible(false);
        this.getView().byId("idncrnumber").setVisible(true);

      } else {
        this.getView().byId("SimpleFormChange480_12120Dual").setVisible(true);
        this.getView().byId("idncrnumber").setVisible(false);
      }
    },
    helpRequestProduct: function () {

    },
    helpRequestPartNo: function () {
      this._oDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.partno", this);
      this.getView().addDependent(this._oDialog);
      this._oDialog.open();
      sap.ui.core.BusyIndicator.show();
      var oModel = new sap.ui.model.json.JSONModel();
      var oDataModel = this.getOwnerComponent().getModel();
      oDataModel.read("/Material_NumberSet", {
        success: function (oData, oResult) {
          var data = oData.results;
          oModel.setData(data);
          sap.ui.getCore().byId("mySelectDialogOrder").setModel(oModel);
          sap.ui.core.BusyIndicator.hide();
        },
        error: function (oError) {
          sap.ui.core.BusyIndicator.hide();
        }
      });
    },
    onSearch: function () {
      var data1 = sap.ui.getCore().byId("idPartNo").getValue(); //"A220-LP-00";
      var oFilter = [];
      oFilter.push(new Filter("Matnr", FilterOperator.Contains, data1));
      //  oFilter.push(new Filter("Matnr", FilterOperator.Contains, "A220-LP-00"));

      var suboModel = new sap.ui.model.json.JSONModel();
      //  var oDataModel1 = this.getOwnerComponent().getModel();
      var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZQM_NC_MS_SRV", true);
      oDataModel.read("/Order_DetailsSet?$filter=Matnr eq '" + data1 + "'", {
        //  filters: [new Filter("Matnr", FilterOperator.Contains, data1)],
        success: function (oData, oResult) {
          var data = oData.results;
          suboModel.setData(data);
          sap.ui.getCore().byId("idProductsTable").setModel(suboModel);
          sap.ui.core.BusyIndicator.hide();
        },
        error: function (oError) {
          sap.ui.core.BusyIndicator.hide();
        }
      });

    },

    helpRequestSubsub: function () {
      this._oDialogsub = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.subsubcategory", this);
      this.getView().addDependent(this._oDialogsub);
      this._oDialogsub.open();
      var sub = this.getView().byId("idlinksubc").getSelectedKey();
      var subval;
      if (sub == "000001") {
        subval = "G";
      } else if (sub == "000002") {
        subval = "P";
      } else if (sub == "000003") {
        subval = "O";
      }else if (sub == "000005"){
        subval = "N";
      }
      var subca = this.getView().byId("idsubcno").getValue();
      var oFilter = [];
      oFilter.push(new Filter("Flag", FilterOperator.Contains, subval));
      oFilter.push(new Filter("Value", FilterOperator.Contains, subca));
      sap.ui.core.BusyIndicator.show();
      var suboModel = new sap.ui.model.json.JSONModel();
      var oDataModel = this.getOwnerComponent().getModel();
      oDataModel.read("/Subcat_subitemSet", {
        filters: oFilter,
        success: function (oData, oResult) {
          var data = oData.results;
          suboModel.setData(data);
          sap.ui.getCore().byId("mySelectDialogOrdersusbsub").setModel(suboModel);
          sap.ui.core.BusyIndicator.hide();
        },
        error: function (oError) {
          sap.ui.core.BusyIndicator.hide();
        }
      });

    },
    helpRequest: function () {
      var sc = this.getView().byId("idlinksubc").getSelectedKey();
      if (sc === "") {
        sap.m.MessageBox.alert("Please Select Sub Category");
      } else {
        sap.ui.core.BusyIndicator.show();
        this.Dialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.f4category", this);
        this.getView().addDependent(this.oDialog);
        this.Dialog.open();
        sap.ui.core.BusyIndicator.show();
        var oModel = new sap.ui.model.json.JSONModel();
        var oDataModel = this.getOwnerComponent().getModel();
        oDataModel.read("/Material_NumberSet", {
          success: function (oData, oResult) {
            var data = oData.results;
            oModel.setData(data);
            sap.ui.getCore().byId("idPartNo").setModel(oModel);
            sap.ui.core.BusyIndicator.hide();
          },
          error: function (oError) {
            sap.ui.core.BusyIndicator.hide();
          }
        });
        sap.ui.core.BusyIndicator.hide();
      }
    },
    _configValueHelpDialogOrder: function (oEvent) {
      var oSelectedItem = oEvent.getParameter("selectedItem"),
        oInput = sap.ui.getCore().byId("idPartNo");
      if (!oSelectedItem) {
        oInput.resetProperty("value");
        return;
      }

      oInput.setValue(oSelectedItem.getTitle());
      this._oDialog.destroy();

    },
    _configValueHelpDialogOrdersubsub: function (oEvent) {
      var oSelectedItem = oEvent.getParameter("selectedItem"),
        oInput = this.getView().byId("idsubsubno");
      if (!oSelectedItem) {
        oInput.resetProperty("value");
        return;
      }

      oInput.setValue(oSelectedItem.getTitle());
      this._oDialogsub.destroy();
    },
    handleCloseUserValueHelp: function (oEvent) {
      var oSelectedItem = oEvent.getParameters().listItem.getCells()[1].getText(); //oEvent.getParameter("selectedItem"),
      var oInput = this.getView().byId("idsubcno");
      if (!oSelectedItem) {
        oInput.resetProperty("value");
        return;
      }

      oInput.setValue(oSelectedItem);
      this.Dialog.destroy();
      this.Dialog.close();

    },
    onSearchOrder: function (oEvent) {
      var sValue = oEvent.getParameter("value");
      var oFilter = new Filter("Matnr", FilterOperator.Contains, sValue);
      var oBinding = oEvent.getParameter("itemsBinding");
      oBinding.filter([oFilter]);
    },
    onSearchOrdersubsub: function (oEvent) {
      var sValue = oEvent.getParameter("value");
      var oFilter = new Filter("ResultRet", FilterOperator.Contains, sValue);
      var oBinding = oEvent.getParameter("itemsBinding");
      oBinding.filter([oFilter]);
    },
    _handleValueHelpClose: function () {
      this._oDialog.destroy();
      this._oDialog.close();
    },
    _handleValueHelpClosesubsub: function () {
      //  this._oDialogsub.close();
      this._oDialogsub.destroy();

    },

    onCloseUserPopup: function () {
      this.Dialog.destroy();
      this.Dialog.close();

    },
    onPressNext: function () {
      var idsubvalue = this.getView().byId("idsubcno").getValue();
      if(idsubvalue === ""){
        idsubvalue = "00";
      }
      var ncr = this.getView().byId("rbg1").getSelectedButton().getText();
      if (ncr === "Copy") {
         if (!this.copyFragment) {
                this.copyFragment = sap.ui.xmlfragment("copyFrag", "com.airbus.ZQM_NCR.fragments.copypopup", this);
                this.getView().addDependent(this.copyFragment);
         }else{
                this.copyFragment = sap.ui.xmlfragment("copyFrag", "com.airbus.ZQM_NCR.fragments.copypopup", this);
                this.getView().addDependent(this.copyFragment);
         }

         this.copyFragment.open();

      }else{
        this.getOwnerComponent().getRouter().navTo("Ncheader",{ID:idsubvalue});

      }


        // this.getOwnerComponent().getRouter().navTo("Ncheader");

    },

    onOkCopy: function (){
      var idsubvalue = this.getView().byId("idsubcno").getValue();
      if(idsubvalue === ""){
        idsubvalue = "00";
      }
      var oSelectedCopy=sap.ui.core.Fragment.byId("copyFrag", "copyrgb").getSelectedButton().getText();
      if(oSelectedCopy=="Copy all"){


      }else if(oSelectedCopy=="Copy Header data"){

      }else if(oSelectedCopy=="Copy Header with Discrepancy and Disposition data"){


      }
      this.copyFragment.close();
      this.copyFragment.destroy();
      this.getOwnerComponent().getRouter().navTo("Ncheader",{ID:idsubvalue});
    }
  });
});