sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/type/String",
    "sap/m/Token",
    "sap/m/Label"
], function (Controller, MessageBox, Filter, FilterOperator, Fragment, JSONModel, typeString, Token, Label) {
	"use strict";

	return Controller.extend("com.airbus.ZQM_NCR.controller.Main", {
		onInit: function () {

			var that = this;
			var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
			/**var oStartUpParameters = sap.ui.component(sComponentId).getComponentData().startupParameters;
			var oRole=oStartUpParameters.ROLE[0];
			if((oRole=="Quality") || (oRole=="Quality Administrator") || (oRole=="Production")  ){
				this.getView().byId("idncr").setSelectedKey("ESTANARD");
			}else if(oRole=="Stores"){
				this.getView().byId("idncr").setSelectedKey("ESNAG");
			}else if(oRole=="Supplier"){
				this.getView().byId("idncr").setSelectedKey("ESUPPLIER");
				this.getView().byId("idlinksubc").setSelectedKey("000002");
			}**/
		//	sap.ui.core.BusyIndicator.show();
			// var oModel = new sap.ui.model.json.JSONModel();
			// var oDataModel = this.getOwnerComponent().getModel();
			// oDataModel.read("/Area_SOSet()", {
			// 	success: function (oData, oResult) {
			// 		var data = oData.results;
			// 		oModel.setData(data);
			// 		that.getView().setModel(oModel, "userdetails");
			// 		sap.ui.core.BusyIndicator.hide();
			// 	},
			// 	error: function (oError) {
			// 		sap.ui.core.BusyIndicator.hide();
			// 	}
			// });
            this._oInput = this.getView().byId("idncrnumber");
            this.oColModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/ncrcopycolumns.json");
            this.oProductsModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/products.json");
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
		ncrCopyRequest: function () {
			this._oNCDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.CopyNc", this);
			this.getView().addDependent(this._oNCDialog);
            // Added code in NC Value Help Dialog for range support - Code Start
            this._oNCDialog.setRangeKeyFields([
                {
                    label: "Serial Number",
                    key: "ProductId",
                    type: "string",
                    typeInstance: new typeString({}, {
                        maxLength: 7
                    })
                },
                {
                    label: "Aircraft",
                    key: "ProductId",
                    type: "string",
                    typeInstance: new typeString({}, {
                        maxLength: 7
                    })
                }
            ]);
// Added code in NC Value Help Dialog for range support - Code End

// Added code in NC Value Help Dialog to bind table data - Code Start
            var aCols = this.oColModel.getData().cols;
            this._oNCDialog.getTableAsync().then(function (oNCTable) {
                oNCTable.setModel(this.oProductsModel);
                oNCTable.setModel(this.oColModel, "columns");

                if (oNCTable.bindRows) {
                    oNCTable.bindAggregation("rows", "/ProductCollection");
                }

                if (oNCTable.bindItems) {
                    oNCTable.bindAggregation("items", "/ProductCollection", function () {
                        return new ColumnListItem({
                            cells: aCols.map(function (column) {
                                return new Label({ text: "{" + column.template + "}" });
                            })
                        });
                    });
                }

                this._oNCDialog.update();
            }.bind(this)); 
// Added code in NC Value Help Dialog to bind table data - Code End 
 		 this._oNCDialog.open();
		},

// Added code on press of line item selection in NC Value Help dialog - Code Start        
onValueHelpOkNCPress: function (oEvent) {
    var aTokens = oEvent.getParameter("tokens");

    if (aTokens.length > 0) {
        this._oInput.setValue(aTokens[0].getKey());
    }
    this._oNCDialog.close();
},
// Added code on press of line item selection in NC Value Help dialog - Code End

// Added code on press of cancel button and closure of NC Value Help Dialog - Code Start
    onValueHelpCancelNCPress: function () {
        this._oNCDialog.close();
    },

    onValueHelpAfterNCClose: function () {
        this._oNCDialog.destroy();
    },
// Added code on press of cancel button and closure of NC Value Help Dialog - Code End

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
			var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
			oFilter.push(new Filter("Matnr", FilterOperator.Contains, data1));
			//	oFilter.push(new Filter("Matnr", FilterOperator.Contains, "A220-LP-00"));
            var data =[] ;
			var suboModel = new sap.ui.model.json.JSONModel();
			//	var oDataModel1 = this.getOwnerComponent().getModel();
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZQM_NC_MS_SRV", true);
			oDataModel.read("/Order_DetailsSet?$filter=Matnr eq '" + data1 + "'", {
				//	filters: [new Filter("Matnr", FilterOperator.Contains, data1)],
				success: function (oData, oResult) {
					data = oData.results;
					suboModel.setData(data);
					sap.ui.getCore().byId("idProductsTable").setModel(suboModel);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
			if(data.length==0){
				MessageBox.warning(
						"Do you want to specify a Partner Code for this Part?",
						{
							icon: MessageBox.Icon.WARNING,
							title: "No matching order found",
							actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
							emphasizedAction: MessageBox.Action.OK,
							initialFocus: MessageBox.Action.CANCEL,
							styleClass: sResponsivePaddingClasses,
							onClose: function(sAction)	{
// Added code for opening a fragment in case no matching order is found - Code Start                                 
								if(sAction== MessageBox.Action.OK){
									if (!this._oSelPartDialog) {
                                        Fragment.load({
                                            name: "com.airbus.ZQM_NCR.fragments.selectPartnerCode",
                                            controller: this
                                        }).then(function(oDialog){
                                            this._oSelPartDialog = oDialog;
                                            this._oSelPartDialog.setModel(this.oProductsModel);
                                            this._oSelPartDialog.open();
                                        }.bind(this));
                                    } else {
                                        this._oSelPartDialog.open();
                                    }
                                    
								}
// Added code for opening a fragment in case no matching order is found - Code End                                
                                if(sAction== MessageBox.Action.CANCEL){
                                	var doSomething ="Inside Cancel";
									
								}
								
							}.bind(this)				

						}
					);
			}
		},

// Added code for opening value help dialog for NLP field - Code Start
    _onValueHelpReqNLP: function(){
        this._oNLPDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NLP", this);
        this.getView().addDependent(this._oNLPDialog);
        this._oNLPDialog.open();
    },
// Added code for opening value help dialog for NLP field - Code End

// Added code for handling search functionality for Select Partner Code dialog - Code Start
        handleSearchPartnerCode: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
// Added code for handling search functionality for Select Partner Code dialog - Code End

// Added code for handling search selection of line item in Select Partner Code dialog - Code Start
        handleConfirmPartnerCode: function(oEvent){
           var oSelContxt = oEvent.getParameters().selectedItem.getBindingContext().getProperty("Name");
               sap.m.MessageToast.show("The product code chosen is " + oSelContxt);
            var oData = [];
                oData.push({
                    Plant: "X001",
                    OrderNum: "400156",
                    Type: "X"
                });
           
            var oModel = new JSONModel(oData);
            this.Dialog.getContent()[0].getItems()[1].setModel(oModel);
        },
// Added code for handling search selection of line item in Select Partner Code dialog - Code End

// Added code to re-bind the items of Select Partner Code - Code Start
        handleClose: function(oEvent) {
        // reset the filter
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
        },
// Added code to re-bind the items of Select Partner Code - Code End

		onChngSubCat: function(){
			
			var oSubCat= this.getView().byId("idlinksubc").getSelectedKey();
			this.getView().byId("idsubsubno").setVisible(true);
			//this.getView().byId("idsubcno")
			//this.getView().byId("idsubsubno")

            let oInput1 = this.getView().byId("idsubcno");
                oInput1.setValue("");

		    if(oSubCat=="000001"){
                
		    	
		    }else if(oSubCat=="000002"){
                
		    	
		    }else if(oSubCat=="000003"){
		    	
		    }else if(oSubCat=="000004"){
		    	this.getView().byId("idsubsubno").setVisible(false);
		    	
		    }else if(oSubCat=="000005"){
		    	this.getView().byId("idsubsubno").setVisible(false);
		    }
			
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
			} else if (sub == "000005") {
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
		//	var sc = this.getView().byId("idlinksubc").getSelectedKey();
			var oSubCat= this.getView().byId("idlinksubc").getSelectedKey();
			
			if (oSubCat === "") {
				sap.m.MessageBox.alert("Please Select Sub Category");
			} else {
				
				  if(oSubCat=="000001"){
    //Added Value Help Code for GR and PO Subcategories - Code Start
                    //if(!this._oGRDialog)
                    //{
                        this._oGRDialog = sap.ui.xmlfragment("GRfragId","com.airbus.ZQM_NCR.fragments.GrValueHelp", this);
                        this.getView().addDependent(this._oGRDialog);
                    //}
                   
                    this._oGRDialog.open();
				    	
				    }else if(oSubCat=="000002"){
                        //if(!this._oPODialog)
                        //{
                            this._oPODialog = sap.ui.xmlfragment("POfragId","com.airbus.ZQM_NCR.fragments.PoValueHelp", this);
                            this.getView().addDependent(this._oPODialog);
                        //}
                        
						this._oPODialog.open();
				    	
				    }
     //Added Value Help Code for GR and PO Subcategories - Code End     
                    else if(oSubCat=="000003"){
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
				    	
				    }else if(oSubCat=="000004"){
				    	
				    	
				    }else if(oSubCat=="000005"){
				    	this._oDialog = sap.ui.xmlfragment("f4helpfrag","com.airbus.ZQM_NCR.fragments.valuehelpf4", this);
						this.getView().addDependent(this._oDialog);
						this._oDialog.open();
						
				    }
				
				
			}
		}, 
        
    //Added Value help code for Bin Area,Aircraft, GR and PO subcategories - Code Start
        onBinhelpRequest : function(){
                //if(!this._oBinAreDialog)
                //{
                    this._oBinAreDialog = sap.ui.xmlfragment("BinfragId","com.airbus.ZQM_NCR.fragments.BinAreaValueHelp", this);
                    this.getView().addDependent(this._oBinAreDialog);
                //}
                
				this._oBinAreDialog.open();
            
        }, 
        onAircrafthelpRequest : function(){
            //if(!this._oAircraftDialog){
                this._oAircraftDialog = sap.ui.xmlfragment("AircraftfragId","com.airbus.ZQM_NCR.fragments.AircraftValueHelp", this);
						this.getView().addDependent(this._oAircraftDialog);
            //}
            
			this._oAircraftDialog.open();
        } ,  
        _confirmBinValueHelpDialog : function(oEvent){
            var oSelectedItem = oEvent.getParameter("selectedItem"),
				oInput = this.getView().byId("idBinLoc");
			if (!oSelectedItem) {
				oInput.resetProperty("value");
				return;
			}

			oInput.setValue(oSelectedItem.getTitle());
			this._oBinAreDialog.destroy();
        },
        _confirmAircraftValueHelpDialog:function(oEvent){
            var oSelectedItem = oEvent.getParameter("selectedItem"),
				oInput = this.getView().byId("idAirCraftNum");
			if (!oSelectedItem) {
				oInput.resetProperty("value");
				return;
			}

			oInput.setValue(oSelectedItem.getTitle());
			this._oAircraftDialog.destroy();
        },
        _confirmGRValueHelpDialog:function(oEvent){
            var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idsubcno");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oGRDialog.destroy();
        },
        _confirmPOValueHelpDialog:function(oEvent)
        {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idsubcno");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oPODialog.destroy();
        },
        _handleAircraftValueHelpClose:function()
        {
            //this._oAircraftDialog.close();
            this._oAircraftDialog.destroy();
        },
        _handleBinValueHelpClose:function(){
            //this._oBinAreDialog.close();
            this._oBinAreDialog.destroy();
        },
        _handlePOValueHelpClose:function(){
            //this._oPODialog.close();
            this._oPODialog.destroy();
        },
        _handleGRValueHelpClose:function(){
            //this._oGRDialog.close();
            this._oGRDialog.destroy();
        },

     //Added Value help code for Bin Area,Aircraft, GR and PO subcategories - Code End
		_configValueHelpDialogOrder: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oInput = sap.ui.getCore().byId("idPartNo");
			//NC copy conditon
			if (oInput == undefined) {
				oInput = this.getView().byId("idncrnumber");
			}

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
		_configValueF4HelpDialog: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem"),
				oInput = this.getView().byId("idsubcno");
			if (!oSelectedItem) {
				oInput.resetProperty("value");
				return;
			}

			oInput.setValue(oSelectedItem.getTitle());
			this._oDialog.destroy();
		},
       
		handleCloseUserValueHelp: function (oEvent) {
			var oSelectedItem = oEvent.getParameters().listItem.getCells()[1].getText(); //oEvent.getParameter("selectedItem"),
			var oInput = this.getView().byId("idsubcno");
			if (!oSelectedItem) {
				oInput.resetProperty("value");
				return;
			}

			oInput.setValue(oSelectedItem);
// Fixed error related to getting open state property of dialog - Code Start            
			this.Dialog.close();
            this.Dialog.destroy();
// Fixed error related to getting open state property of dialog - Code End 
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
		/*_handleValueHelpClose: function () {
			this._oDialog.destroy();
			this._oDialog.close();
		},*/
		_handleValueHelpClosesubsub: function () {
			//	this._oDialogsub.close();
			this._oDialogsub.destroy();

		},

		onCloseUserPopup: function () {
// Fixed error related to getting open state property of dialog - Code Start 
            this.Dialog.close();
            this.Dialog.destroy();
// Fixed error related to getting open state property of dialog - Code End

// Re-setting the input field value - Code Start 
            this.getView().byId("idsubcno").setValue();
// Re-setting the input field value - Code Start 
		},

		onCloseUserPopup1: function () {
// Fixed error related to getting open state property of dialog - Code Start 
            this.Dialog.close();
            this.Dialog.destroy();
// Fixed error related to getting open state property of dialog - Code End 
		},
		onPressNext: function () {
			var idsubvalue = this.getView().byId("idsubcno").getValue();
			if (idsubvalue === "") {
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

            var saveData = {
                "NCType": "", //this.getView().byId("idncr").getSelectedItem().getText(),
                "IWA": "",    //this.getView().byId("idncr").getSelectedItem().getText(),
                "SubCat":"",  //this.getView().byId("idncr").getSelectedItem().getText(),
                "GRN":"",
                "PON":"",
                "BinLoc":this.getView().byId("idBinLoc").getValue(),
                "AcNum":this.getView().byId("idAirCraftNum").getValue()
        };
        var subCat= this.getView().byId("idlinksubc").getSelectedKey();
        if (subCat !=="")
        {
            if(subCat=="000001"){
                saveData.GRN = this.getView().byId("idsubcno").getValue();
            }
            else if(subCat=="000002"){
                saveData.PON = this.getView().byId("idsubcno").getValue();
            }
        }

        var jsonModel = new sap.ui.model.json.JSONModel();
        jsonModel.setData(saveData);
        this.getOwnerComponent().setModel(jsonModel, "NCSaveModel");


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