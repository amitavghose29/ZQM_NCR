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
            this._oNCDialog.open();
      //    this._oNCDialog.setModel(new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZQM_NC_MS_SRV", true));
            this._oNCDialog.setModel(this.getOwnerComponent().getModel());

        },

        _handleNCCopyVHClose: function(){
            this._oNCDialog.close();
            this._oNCDialog.destroy();
        },

        onSerNoFBVHRequest: function (oEvent) {
            this._oSerNoFBVHDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SerNumFBVH", this);
            this.getView().addDependent(this._oSerNoFBVHDialog);
            this._oSerNoFBVHDialog.open();
            this.oInputSerNoFB = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "SERNR"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oSerNoFBVHDialog.setModel(oModel, "oSerNoFBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onSerNoFBLiveSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _confirmSerNoFBValueHelpDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oInputSerNoFB;
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oSerNoFBVHDialog.destroy();
        },

        onNCNoFBVHRequest: function (oEvent) {
            this._oNCNoFBVHDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NcNumFBVH", this);
            this.getView().addDependent(this._oNCNoFBVHDialog);
            this._oNCNoFBVHDialog.open();
            this.oInputNcNoFB = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "NOTIF"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oNCNoFBVHDialog.setModel(oModel, "oNcNumFBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onNcNoFBLiveSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _confirmNcNoFBValueHelpDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oInputNcNoFB;
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oNCNoFBVHDialog.destroy();
        },

        onFilterBarSearchCopyNC: function(){
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
                oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sValNotif = sap.ui.getCore().byId("idFBNcNum").getValue(),
                sValSerNo = sap.ui.getCore().byId("idFBNcNum").getValue(),
                sValAircraft = sap.ui.getCore().byId("idFBNcNum").getValue();
            var oFilter = [];
                oFilter.push(new Filter("Notification", sap.ui.model.FilterOperator.Contains, sValNotif));
                oFilter.push(new Filter("SerialNumber", sap.ui.model.FilterOperator.Contains, sValSerNo));
                oFilter.push(new Filter("Aircraft", sap.ui.model.FilterOperator.Contains, sValAircraft));
            var sPath = "/NCSearchSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    sap.ui.getCore().byId("idCopyNCTable").setModel(oModel, "oNcCopyModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
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
                    this._oDialog.setModel(oModel);
                    sap.ui.core.BusyIndicator.hide();
                }.bind(this),
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
            var data = [];
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
            if (data.length == 0) {
                MessageBox.warning(
                    "Do you want to specify a Partner Code for this Part?",
                    {
                        icon: MessageBox.Icon.WARNING,
                        title: "No matching order found",
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        emphasizedAction: MessageBox.Action.OK,
                        initialFocus: MessageBox.Action.CANCEL,
                        styleClass: sResponsivePaddingClasses,
                        onClose: function (sAction) {
                            // Added code for opening a fragment in case no matching order is found - Code Start                                 
                            if (sAction == MessageBox.Action.OK) {
                                if (!this._oSelPartDialog) {
                                    Fragment.load({
                                        name: "com.airbus.ZQM_NCR.fragments.selectPartnerCode",
                                        controller: this
                                    }).then(function (oDialog) {
                                        this._oSelPartDialog = oDialog;
                                        this._oSelPartDialog.setModel(this.oProductsModel);
                                        this._oSelPartDialog.open();
                                    }.bind(this));
                                } else {
                                    this._oSelPartDialog.open();
                                }

                            }
                            // Added code for opening a fragment in case no matching order is found - Code End                                
                            if (sAction == MessageBox.Action.CANCEL) {
                                var doSomething = "Inside Cancel";

                            }

                        }.bind(this)

                    }
                );
            }
        },

        //Added code for GR and PO Filterbar search - Code Start

        //GR search go s
        _onGRSearchGo: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var purOrd = sap.ui.getCore().byId("idFBPurchord").getValue();
            var inbDel = sap.ui.getCore().byId("idFBInboundDelivery").getValue();
            var partNo = sap.ui.getCore().byId("idFlBarGrVhPartNo").getValue();

            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "GR"));
            if (purOrd != "") {
                oFilter.push(new Filter("PurchaseOrder", FilterOperator.EQ, purOrd));
            }
            if (inbDel != "") {
                oFilter.push(new Filter("InboundDelivery", FilterOperator.EQ, inbDel));
            }
            if (partNo != "") {
                oFilter.push(new Filter("PartNumber", FilterOperator.EQ, partNo));
            }

            var sPath = "/GoodsReceiptSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    sap.ui.getCore().byId("idGRTable").setModel(oModel, "oGRModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        // production order search go s
        _onProdOrdSearchGo: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var prodseq = sap.ui.getCore().byId("idFlBarPrOrdVhPrdseq").getValue();
            var partNo = sap.ui.getCore().byId("idFlBarPrOrdVhPartNo").getValue();
            var nlp = sap.ui.getCore().byId("idFlBarPrOrdVhnlp").getValue();
            var workIns = sap.ui.getCore().byId("idFlBarPrOrdVhWrkIns").getValue();
            var clsOrd = sap.ui.getCore().byId("idFlBarPrdOrdVhClsOrd").getSelected();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "PRO"));
            if (prodseq != "") {
                oFilter.push(new Filter("ProductSequence", FilterOperator.EQ, prodseq));
            }
            if (partNo != "") {
                oFilter.push(new Filter("PartNumber", FilterOperator.EQ, partNo));
            }
            if (nlp != "") {
                oFilter.push(new Filter("NLP", FilterOperator.EQ, nlp));
            }
            if (workIns != "") {
                oFilter.push(new Filter("WorkInstruction", FilterOperator.EQ, workIns));
            }
            if (clsOrd === true) {
                oFilter.push(new Filter("ClosedOrders", FilterOperator.EQ, "X"));
            } else {
                oFilter.push(new Filter("ClosedOrders", FilterOperator.EQ, ""));
            }

            var sPath = "/Rep_ProdOrdSearchSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    if (data.length === 0
                        && sap.ui.getCore().byId("idFlBarPrOrdVhPrdseq").getValue() === ""
                        && sap.ui.getCore().byId("idFlBarPrOrdVhPartNo").getValue() === ""
                        && sap.ui.getCore().byId("idFlBarPrOrdVhnlp").getValue() === ""
                        && sap.ui.getCore().byId("idFlBarPrOrdVhWrkIns").getValue() === "") {
                        MessageBox.warning(
                            "No data found.! Please try to search using filter bar fields provided.!",
                            {
                                icon: MessageBox.Icon.WARNING,
                                title: "No matching order found",
                                actions: [MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,
                                initialFocus: MessageBox.Action.OK,
                                onClose: function (sAction) {
                                    if (sAction == MessageBox.Action.OK) {
                                    }
                                }.bind(this)
                            }
                        );
                    } else if (data.length === 0
                        && (sap.ui.getCore().byId("idFlBarPrOrdVhPrdseq").getValue() !== "" || sap.ui.getCore().byId("idFlBarPrOrdVhPartNo").getValue() !== "" ||
                            sap.ui.getCore().byId("idFlBarPrOrdVhnlp").getValue() !== "" ||
                            sap.ui.getCore().byId("idFlBarPrOrdVhWrkIns").getValue() !== "")) {
                        MessageBox.warning(
                            "Do you want to specify a Partner Code for this Part?",
                            {
                                icon: MessageBox.Icon.WARNING,
                                title: "No matching order found",
                                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                emphasizedAction: MessageBox.Action.OK,
                                initialFocus: MessageBox.Action.CANCEL,
                                onClose: function (sAction) {
                                    if (sAction == MessageBox.Action.OK) {
                                        if (!this._oSelPartDialog) {
                                            Fragment.load({
                                                name: "com.airbus.ZQM_NCR.fragments.selectPartnerCode",
                                                controller: this
                                            }).then(function (oDialog) {
                                                this._oSelPartDialog = oDialog;
                                                this._oSelPartDialog.setModel(this.getOwnerComponent().getModel());
                                                this._oSelPartDialog.open();
                                            }.bind(this));
                                        } else {
                                            this._oSelPartDialog.open();
                                        }
                                    }
                                }.bind(this)
                            }
                        );
                    }
                    oModel.setData(data);
                    sap.ui.getCore().byId("idProdOrderTable").setModel(oModel, "oPOModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        // Purchase Order search go s
        _onPoSearchGo: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var asnNo = sap.ui.getCore().byId("idFBASNNo").getValue();
            var inbDel = sap.ui.getCore().byId("idFBPOInboundDelivery").getValue();
            var partNo = sap.ui.getCore().byId("idFlBarPOVhPartNo").getValue();
            var ncNo = sap.ui.getCore().byId("idFBNCNumber").getValue();
            var disNo = sap.ui.getCore().byId("idFBDiscrpNo").getValue();
            var rmaNo = sap.ui.getCore().byId("idFBRMANo").getValue();

            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "GR"));
            if (asnNo != "") {
                oFilter.push(new Filter("AsnNumber", FilterOperator.EQ, asnNo));
            }
            if (inbDel != "") {
                oFilter.push(new Filter("InboundDelivery", FilterOperator.EQ, inbDel));
            }
            if (partNo != "") {
                oFilter.push(new Filter("PartNumber", FilterOperator.EQ, partNo));
            }
            if (ncNo != "") {
                oFilter.push(new Filter("NCNumber", FilterOperator.EQ, ncNo));
            }
            if (disNo != "") {
                oFilter.push(new Filter("DiscrepancyNumber", FilterOperator.EQ, disNo));
            }
            if (rmaNo != "") {
                oFilter.push(new Filter("RMANumber", FilterOperator.EQ, rmaNo));
            }

            var sPath = "/PurchaseOrderSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    sap.ui.getCore().byId("idPurOrdTable").setModel(oModel, "oPrModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },


        // onGRfbSearch: function () {
        //     var oGRModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/localjson/grdata.json");
        //     this.getView().setModel(oGRModel, "grsearch");
        // },

        // onPOfbSearch: function () {
        //     var oPOModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/localjson/podata.json");
        //     this.getView().setModel(oPOModel, "posearch");
        // },
        //Added code for GR and PO  Filterbar search - Code End

        //Added code for PO and GR Valuehelp dialogs - Code Start
        _handleGRValueHelpClose: function () {
            //this._oGRDialog.close();
            this._oGRDialog.destroy();
        },

        _handlePOValueHelpClose: function () {
            this._oPODialog.destroy();
        },
        //Added code for PO and GR Valuehelp dialogs - Code End

        //Added code for Slection Change in PO and GR Search Tables - Code Start
        handleCloseGRUserValueHelp: function (oEvent) {
            var oSelectedItem = oEvent.getParameters("selectedItem").listItem.getBindingContext("oGRModel").getProperty("GoodsReceiptNum"); // oEvent.getParameters().listItem.getCells()[0].getText();
            var oSelectedItemSub = oEvent.getParameters("selectedItem").listItem.getBindingContext("oGRModel").getProperty("GoodsRecpItem");
            var oInput = this.getView().byId("idsubcno");
            var oInputSub = this.getView().byId("idsubsubno");
            if (!oSelectedItem && !oSelectedItemSub) {
                oInput.resetProperty("value");
                oInputSub.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem);
            oInputSub.setValue(oSelectedItemSub);
            this._oGRDialog.close();
            this._oGRDialog.destroy();
        },

        handleClosePOUserValueHelp: function (oEvent) {
            var oSelectedItem = oEvent.getParameters().listItem.getCells()[0].getText();
            var oInput = this.getView().byId("idsubcno");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem);
            this._oPrOrdDialog.destroy();
        },
        //Added code for Slection Change in PO and GR Search Tables - Code End

        // Added code for opening value help dialog for NLP field - Code Start
        _onValueHelpReqNLP: function () {
            this._oNLPDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NLP", this);
            this.getView().addDependent(this._oNLPDialog);
            this._oNLPDialog.open();
            var oDataModel = this.getOwnerComponent().getModel();
            //NLP  Showsuggestion s
            var oNLPSugModel = new sap.ui.model.json.JSONModel();
            var oFilterNLP = [];
            oFilterNLP.push(new Filter("Key", FilterOperator.EQ, "NLP"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilterNLP,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oNLPSugModel.setData(data);
                    this._oNLPDialog.setModel(oNLPSugModel, "oNLPSuggestionModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);

                }
            });

        },
        //NLP Value
        _handleConfirmNLP: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = sap.ui.getCore().byId("idFlBarPrOrdVhnlp");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oNLPDialog.destroy();

        },
        // Added code for opening value help dialog for NLP field - Code End

        // Added code for handling search functionality for Select Partner Code dialog - Code Start
        handleSearchPartnerCode: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = [];
            oFilter.push(new Filter("ProductCode", sap.ui.model.FilterOperator.Contains, sValue));
            oFilter.push(new Filter("PartnerCode", sap.ui.model.FilterOperator.Contains, sValue));
            oFilter.push(new Filter("ParentPartNumber", sap.ui.model.FilterOperator.Contains, sValue));
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(oFilter);
        },
        // Added code for handling search functionality for Select Partner Code dialog - Code End

        // Added code for handling search selection of line item in Select Partner Code dialog - Code Start
        handleConfirmPartnerCode: function (oEvent) {
            var oSelProdCode = oEvent.getParameters().selectedItem.getBindingContext().getProperty("PartnerCode");
            // sap.m.MessageToast.show("The partner code chosen is " + oSelContxt);
            if (oSelProdCode !== "") {
                sap.ui.core.BusyIndicator.show();
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilter = [];
                oFilter.push(new Filter("Key", FilterOperator.EQ, "PRO"));
                oFilter.push(new Filter("PartNumber", FilterOperator.EQ, oSelProdCode));
                var sPath = "/Rep_ProdOrdSearchSet"
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        sap.ui.getCore().byId("idProdOrderTable").setModel(oModel, "oPOModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            } else {
                sap.m.MessageToast.show("The product code is not found against selected line item");
            }

        },
        // Added code for handling search selection of line item in Select Partner Code dialog - Code End

        // Added code to re-bind the items of Select Partner Code - Code Start
        handleClose: function (oEvent) {
            // reset the filter
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([]);
        },
        // Added code to re-bind the items of Select Partner Code - Code End

        onChngSubCat: function () {

            var oSubCat = this.getView().byId("idlinksubc").getSelectedKey();
            this.getView().byId("idsubsubno").setVisible(true);

            var oInputSub = this.getView().byId("idsubcno");
            oInputSub.setValue("");
            this.getView().byId("idsubsubno").setValue("");

            if (Number(oSubCat) == "0001") {


            } else if (Number(oSubCat) == "0002") {


            } else if (Number(oSubCat) == "0003") {

            } else if (Number(oSubCat) == "0004") {
                this.getView().byId("idsubsubno").setVisible(false);

            } else if (Number(oSubCat) == "0005") {
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
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);

                }
            });

        },
        onHandleSuggestPartNo: function (oEvent) {
            //  var sTerm = oEvent.getParameter("suggestValue");
            var aFilters = [];
            //  if (sTerm) {
            aFilters.push(new Filter("Key", sap.ui.model.FilterOperator.EQ, "PEFF"));
            //  }
            oEvent.getSource().getBinding("suggestionItems").filter(aFilters);

        },
        helpRequest: function () {
            //	var sc = this.getView().byId("idlinksubc").getSelectedKey();
            var oSubCat = this.getView().byId("idlinksubc").getSelectedKey();

            if (oSubCat === "") {
                sap.m.MessageBox.alert("Please Select Sub Category");
            } else {
                if (Number(oSubCat) == "0001") {
                    //Value Help Code for Production Order(001)           
                    this._oPODialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.f4category", this);
                    this.getView().addDependent(this._oPODialog);
                    this._oPODialog.open();
                    // this._oPODialog.setModel(this.getOwnerComponent().getModel());

                    sap.ui.core.BusyIndicator.show();
                    var oProdOrdPartSuggModel = new sap.ui.model.json.JSONModel();
                    var oDataModel = this.getOwnerComponent().getModel();
                    var oFilterProdOrd = [];
                    oFilterProdOrd.push(new Filter("Key", FilterOperator.EQ, "PEFF"));
                    var sPath = "/f4_genericSet"
                    oDataModel.read(sPath, {
                        filters: oFilterProdOrd,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var dataprod = oData.results;
                            oProdOrdPartSuggModel.setData(dataprod);
                            sap.ui.getCore().byId("idFlBarPrOrdVhPartNo").setModel(oProdOrdPartSuggModel, "oProdOrdPartSuggModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                    var oProdOrdNLPSuggModel = new sap.ui.model.json.JSONModel();
                    var oFilterNLP = [];
                    oFilterNLP.push(new Filter("Key", FilterOperator.EQ, "NLP"));
                    var sPath = "/f4_genericSet"
                    oDataModel.read(sPath, {
                        filters: oFilterNLP,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var datanlp = oData.results;
                            oProdOrdNLPSuggModel.setData(datanlp);
                            sap.ui.getCore().byId("idFlBarPrOrdVhnlp").setModel(oProdOrdNLPSuggModel, "oProdOrdNLPSuggModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });

                    var oProdOrdWISuggModel = new sap.ui.model.json.JSONModel();
                    var oFilterWI = [];
                    oFilterWI.push(new Filter("Key", FilterOperator.EQ, "WINS"));
                    var sPath = "/f4_genericSet"
                    oDataModel.read(sPath, {
                        filters: oFilterWI,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var datawi = oData.results;
                            oProdOrdWISuggModel.setData(datawi);
                            sap.ui.getCore().byId("idFlBarPrOrdVhWrkIns").setModel(oProdOrdWISuggModel, "oProdOrdWISuggModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });

                    //F4 Aircraft No s 
                    sap.ui.core.BusyIndicator.show();
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setSizeLimit(10000);
                    var oDataModel = this.getOwnerComponent().getModel();
                    var oFilter = [];
                    oFilter.push(new Filter("Key", FilterOperator.EQ, "AIR"));
                    var sPath = "/f4_genericSet"
                    oDataModel.read(sPath, {
                        filters: oFilter,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results;
                            oModel.setData(data);
                            sap.ui.getCore().byId("idFlBarPrOrdVhPrdseq").setModel(oModel, "oAircrafttNoModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                    // sap.ui.getCore().byId("idFlBarPrOrdVhPartNo").setModel(this.getOwnerComponent().getModel());
                    /*    sap.ui.core.BusyIndicator.show();
                        var oModel = new sap.ui.model.json.JSONModel();
                        var oDataModel = this.getOwnerComponent().getModel();
                        var oFilter = [];
                        oFilter.push(new Filter("Key", FilterOperator.EQ, "PR"));
                        var sPath = "/f4_genericSet"
                        oDataModel.read(sPath, {
                            filters: oFilter,
                            success: function (oData, oResult) {
                                sap.ui.core.BusyIndicator.hide();
                                var data = oData.results;
                                oModel.setData(data);
                                sap.ui.getCore().byId("idProdOrderTable").setModel(oModel, "oPOModel");
                            }.bind(this),
                            error: function (oError) {
                                sap.ui.core.BusyIndicator.hide();
                            }
                        });*/
                } else if (Number(oSubCat) == "000002") {
                    //Value Help Code for Work Instruction(002) 
                    this._oWIDialog = sap.ui.xmlfragment("WIfragId", "com.airbus.ZQM_NCR.fragments.WorkInstructionVH", this);
                    this.getView().addDependent(this._oWIDialog);
                    this._oWIDialog.open();

                    var oDataModel = this.getOwnerComponent().getModel();
                    //Work Inst Showsuggestion s
                    var oWRSugModel = new sap.ui.model.json.JSONModel();
                    var oFilterWrInst = [];
                    oFilterWrInst.push(new Filter("Key", FilterOperator.EQ, "WRKINS"));
                    var sPath = "/f4_genericSet"
                    oDataModel.read(sPath, {
                        filters: oFilterWrInst,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results;
                            oWRSugModel.setData(data);
                            this._oWIDialog.setModel(oWRSugModel, "oWRSuggestionModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);

                        }
                    });
                }
                else if (Number(oSubCat) == "000003") {
                    //Value Help Code for GR Number(003)			    	
                    this._oGRDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.GrValueHelp", this);
                    this.getView().addDependent(this._oGRDialog);
                    this._oGRDialog.open();

                    var oDataModel = this.getOwnerComponent().getModel();
                    //Purchase Order Showsuggestion s
                    var oGRPurSugModel = new sap.ui.model.json.JSONModel();
                    var oFilterPur = [];
                    oFilterPur.push(new Filter("Key", FilterOperator.EQ, "GPO"));
                    var sPath = "/f4_genericSet"
                    oDataModel.read(sPath, {
                        filters: oFilterPur,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results;
                            oGRPurSugModel.setData(data);
                            sap.ui.getCore().byId("idFBPurchord").setModel(oGRPurSugModel, "oGRPurSuggestionModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);

                        }
                    });
                    //Inbound devilery ShowSuggestion s
                    var oGRInbSugModel = new sap.ui.model.json.JSONModel();
                    var oFilterInb = [];
                    oFilterInb.push(new Filter("Key", FilterOperator.EQ, "GID"));
                    var sPath = "/f4_genericSet"
                    oDataModel.read(sPath, {
                        filters: oFilterInb,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results;
                            oGRInbSugModel.setData(data);
                            sap.ui.getCore().byId("idFBInboundDelivery").setModel(oGRInbSugModel, "oGRInbSuggestionModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);

                        }
                    });
                    //Part Number ShowSuggestion s
                    var oGRPartSugModel = new sap.ui.model.json.JSONModel();
                    var oFilterPart = [];
                    oFilterPart.push(new Filter("Key", FilterOperator.EQ, "GID"));
                    var sPath = "/f4_genericSet"
                    oDataModel.read(sPath, {
                        filters: oFilterPart,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results;
                            oGRPartSugModel.setData(data);
                            sap.ui.getCore().byId("idFlBarGrVhPartNo").setModel(oGRPartSugModel, "oGRPartSuggestionModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);

                        }
                    });

                    /*   sap.ui.core.BusyIndicator.show();
                       var oModel = new sap.ui.model.json.JSONModel();
                       var oDataModel = this.getOwnerComponent().getModel();
                       var oFilter = [];
                       oFilter.push(new Filter("Key", FilterOperator.EQ, "MD"));
                       var sPath = "/f4_genericSet"
                       oDataModel.read(sPath, {
                           filters: oFilter,
                           success: function (oData, oResult) {
                               sap.ui.core.BusyIndicator.hide();
                               var data = oData.results;
                               oModel.setData(data);
                               sap.ui.getCore().byId("idGRTable").setModel(oModel, "oGRModel");
                           }.bind(this),
                           error: function (oError) {
                               sap.ui.core.BusyIndicator.hide();
                           }
                       });*/
                } else if (Number(oSubCat) == "000004") {
                    //Value Help Code for Purchase Order(004)			    	
                    this._oPrOrdDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PoValueHelp", this);
                    this.getView().addDependent(this._oPrOrdDialog);
                    this._oPrOrdDialog.open();

                    var oDataModel = this.getOwnerComponent().getModel();
                    var sPath = "/f4_genericSet";
                    //ASN Number ShowSuggestion s
                    var oPoASNModel = new sap.ui.model.json.JSONModel();
                    var oFilterPOasn = [];
                    oFilterPOasn.push(new Filter("Key", FilterOperator.EQ, "AN"));
                    oDataModel.read(sPath, {
                        filters: oFilterPOasn,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var dataasn = oData.results;
                            oPoASNModel.setData(dataasn);
                            sap.ui.getCore().byId("idFBASNNo").setModel(oPoASNModel, "oPOASNSuggestionModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);

                        }
                    });
                    //Inbound delivery ShowSuggestion s
                    var oPoInbModel = new sap.ui.model.json.JSONModel();
                    var oFilterPOinb = [];
                    oFilterPOinb.push(new Filter("Key", FilterOperator.EQ, "ID"));
                    oDataModel.read(sPath, {
                        filters: oFilterPOinb,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var datainb = oData.results;
                            oPoInbModel.setData(datainb);
                            sap.ui.getCore().byId("idFBPOInboundDelivery").setModel(oPoInbModel, "oPOInbDevSuggestionModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);

                        }
                    });
                    //Part Number ShowSuggestion s
                    var oPoPartNoModel = new sap.ui.model.json.JSONModel();
                    var oFilterPOpartno = [];
                    oFilterPOpartno.push(new Filter("Key", FilterOperator.EQ, "PN"));
                    oDataModel.read(sPath, {
                        filters: oFilterPOpartno,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var datapartno = oData.results;
                            oPoPartNoModel.setData(datapartno);
                            sap.ui.getCore().byId("idFlBarPOVhPartNo").setModel(oPoPartNoModel, "oPOPartNoSuggestionModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);

                        }
                    });

                    //NC Number ShowSuggestion s
                    var oPoNcNoModel = new sap.ui.model.json.JSONModel();
                    var oFilterPONcno = [];
                    oFilterPONcno.push(new Filter("Key", FilterOperator.EQ, "NC"));
                    oDataModel.read(sPath, {
                        filters: oFilterPONcno,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var datancno = oData.results;
                            oPoNcNoModel.setData(datancno);
                            sap.ui.getCore().byId("idFBNCNumber").setModel(oPoNcNoModel, "oPONcNoSuggestionModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);

                        }
                    });
                    //Discrepancy Number ShowSuggestion s
                    var oPoDisNoModel = new sap.ui.model.json.JSONModel();
                    var oFilterPODisno = [];
                    oFilterPODisno.push(new Filter("Key", FilterOperator.EQ, "DN"));
                    oDataModel.read(sPath, {
                        filters: oFilterPODisno,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var datadisno = oData.results;
                            oPoDisNoModel.setData(datadisno);
                            sap.ui.getCore().byId("idFBDiscrpNo").setModel(oPoDisNoModel, "oPODisNoSuggestionModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);

                        }
                    });

                    //RMA number ShowSuggestion s
                    var oPoRmaNoModel = new sap.ui.model.json.JSONModel();
                    var oFilterPORmano = [];
                    oFilterPORmano.push(new Filter("Key", FilterOperator.EQ, "RM"));
                    oDataModel.read(sPath, {
                        filters: oFilterPORmano,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var datarmano = oData.results;
                            oPoRmaNoModel.setData(datarmano);
                            sap.ui.getCore().byId("idFBRMANo").setModel(oPoRmaNoModel, "oPORMANoSuggestionModel");
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);

                        }
                    });


                    /*    sap.ui.core.BusyIndicator.show();
                        var oModel = new sap.ui.model.json.JSONModel();
                        var oDataModel = this.getOwnerComponent().getModel();
                        var oFilter = [];
                        oFilter.push(new Filter("Key", FilterOperator.EQ, "PO"));
                        var sPath = "/f4_genericSet"
                        oDataModel.read(sPath, {
                            filters: oFilter,
                            success: function (oData, oResult) {
                                sap.ui.core.BusyIndicator.hide();
                                var data = oData.results;
                                oModel.setData(data);
                                sap.ui.getCore().byId("idPurOrdTable").setModel(oModel, "oPrModel");
                            }.bind(this),
                            error: function (oError) {
                                sap.ui.core.BusyIndicator.hide();
                            }
                        });*/
                } else if (Number(oSubCat) == "000005") {
                    //Value Help Code for Part Number(005)
                    // this._oPrtNoDialog = sap.ui.xmlfragment("f4helpfrag", "com.airbus.ZQM_NCR.fragments.partno", this);
                    // this.getView().addDependent(this._oPrtNoDialog);
                    // this._oPrtNoDialog.open();
                    // this._oPrtNoDialog.setModel(this.getOwnerComponent().getModel());
                    // this.helpRequestPartNo();                  
                    var area = this.getView().byId("idiwa").getSelectedItem();
                    if (area === null || area === '' || area === "") {
                        MessageBox.alert("Please enter a value in In Which Area");
                    } else {

                        var value1 = area.getText();
                        var key = "PART";
                        var aFilter = [];
                        var oFilter1 = new Filter("Key", "EQ", key);
                        var oFilter2 = new Filter("Value1", "EQ", value1);
                        aFilter.push(oFilter1);
                        aFilter.push(oFilter2);

                        if (!this._oPrtNoDialog) {
                            this._oPrtNoDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.ZQM_NCR.fragments.partno", this);
                            this.getView().addDependent(this._oPrtNoDialog);
                        }

                        if (value1 == "LOST") {
                            this.getView().byId("idFBLotNum").setVisible(true);

                        } else {
                            this.getView().byId("idFBLotNum").setVisible(false);
                        }


                        var oModel = this.getOwnerComponent().getModel();
                        var oJSONMOdel = new sap.ui.model.json.JSONModel();

                        oModel.read("/f4_genericSet", {
                            filters: aFilter,
                            success: function (data) {
                                sap.ui.core.BusyIndicator.hide();
                                var partnumdata = data.results;
                                oJSONMOdel.setData(partnumdata);
                                this.getView().setModel(oJSONMOdel, "PartNumModel");
                            }.bind(this),
                            error: function (oError) {
                                sap.ui.core.BusyIndicator.hide();
                                var msg = JSON.parse(oError.responseText).error.message.value;
                                MessageBox.error(msg);
                            }
                        });
                        this._oPrtNoDialog.open();

                        //this._oPrtNoDialog.setModel(this.getOwnerComponent().getModel());
                    }
                }
            }
        },

        _onValueHelpReqWorkIns: function () {
            this._oWIDialog = sap.ui.xmlfragment("WIfragId", "com.airbus.ZQM_NCR.fragments.WorkInstructionVH", this);
            this.getView().addDependent(this._oWIDialog);
            this._oWIDialog.open();

            var oDataModel = this.getOwnerComponent().getModel();
            //Work Inst Showsuggestion s
            var oWRSugModel = new sap.ui.model.json.JSONModel();
            var oFilterWrInst = [];
            oFilterWrInst.push(new Filter("Key", FilterOperator.EQ, "WINS"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilterWrInst,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oWRSugModel.setData(data);
                    this._oWIDialog.setModel(oWRSugModel, "oWRSuggestionModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);

                }
            });
        },

        _onValueHelpReqPartNo: function () {
            // this._oPrtNoDialog = sap.ui.xmlfragment("f4helpfrag", "com.airbus.ZQM_NCR.fragments.partno", this);
            // this.getView().addDependent(this._oPrtNoDialog);
            // this._oPrtNoDialog.open();
            // this._oPrtNoDialog.setModel(this.getOwnerComponent().getModel());
            this._oPrtNoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PartNoFBValueHelp", this);
            this.getView().addDependent(this._oPrtNoFBDialog);
            this._oPrtNoFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0003") {
                oFilter.push(new Filter("Key", FilterOperator.EQ, "GPN"));
            } else if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0004") {
                oFilter.push(new Filter("Key", FilterOperator.EQ, "PN"));
            } else if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0001") {
                oFilter.push(new Filter("Key", FilterOperator.EQ, "PEFF"));
            }
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oPrtNoFBDialog.setModel(oModel, "oPartNoFBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);

                }
            });
        },

        _configValueHelpDialogPartNoFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            if (this.getView().byId("idlinksubc").getSelectedItem()) {
                if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0003") {
                    oInput = sap.ui.getCore().byId("idFlBarGrVhPartNo");
                } else if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0004") {
                    oInput = sap.ui.getCore().byId("idFlBarPOVhPartNo");
                } else if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0001") {
                    oInput = sap.ui.getCore().byId("idFlBarPrOrdVhPartNo");
                }
            }
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oPrtNoFBDialog.destroy();
        },
        //work instruction confirm
        _configWrkInsVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0002") {
                oInput = this.getView().byId("idsubcno");
            } else if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0001") {
                oInput = sap.ui.getCore().byId("idFlBarPrOrdVhWrkIns");
            }

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oWIDialog.destroy();
        },
        onSearchPartNoFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },
        onSearchPartNumTab: function (oEvent) {
            var sValue = oEvent.getSource().getValue();
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oTab = this.getView().byId("idPartnumTab");
            var oBinding = oTab.getBinding("items");
            oBinding.filter([oFilter]);

        },
        onSelectPartnum: function (oEvent) {
            var partnum = oEvent.getParameters("selectedItem").listItem.getBindingContext("PartNumModel").getProperty("Value");
            this.getView().byId("idsubcno").setValue(partnum);
            this._oPrtNoDialog.close();
        },
        _onValueHelpReqtPurchOrd: function () {
            this._oPurOrdFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PurOrdFBValueHelp", this);
            this.getView().addDependent(this._oPurOrdFBDialog);
            this._oPurOrdFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "GPO"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oPurOrdFBDialog.setModel(oModel, "oPurOrdFBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);

                }
            });
        },

        _configValueHelpDialogPurOrdFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = sap.ui.getCore().byId("idFBPurchord");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oPurOrdFBDialog.destroy();
        },

        onSearchPurOrdFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _onValueHelpReqInboundDelivery: function () {
            this._oInbDelFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.InbDelFBValueHelp", this);
            this.getView().addDependent(this._oInbDelFBDialog);
            this._oInbDelFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0003") {
                oFilter.push(new Filter("Key", FilterOperator.EQ, "GID"));
            } else if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0004") {
                oFilter.push(new Filter("Key", FilterOperator.EQ, "ID"));
            }
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oInbDelFBDialog.setModel(oModel, "oInbDelFBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);

                }
            });
        },

        _configValueHelpDialogInbDelFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;

            if (this.getView().byId("idlinksubc").getSelectedItem()) {
                if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0003") {
                    oInput = sap.ui.getCore().byId("idFBInboundDelivery");
                } else if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0004") {
                    oInput = sap.ui.getCore().byId("idFBPOInboundDelivery");
                }
            }

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oInbDelFBDialog.destroy();
        },

        onSearchInbDelFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _onValueHelpReqtASNNumber: function () {
            this._oASNNoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.ASNNoFBValueHelp", this);
            this.getView().addDependent(this._oASNNoFBDialog);
            this._oASNNoFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "AN"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oASNNoFBDialog.setModel(oModel, "oASNNoFBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);

                }
            });
        },

        _configValueHelpDialogASNNoFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = sap.ui.getCore().byId("idFBASNNo");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oASNNoFBDialog.destroy();
        },

        onSearchASNNoFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _onValueHelpReqNCNo: function () {
            this._oNcNoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NcNoFBValueHelp", this);
            this.getView().addDependent(this._oNcNoFBDialog);
            this._oNcNoFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "NC"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oNcNoFBDialog.setModel(oModel, "oNcNoFBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configValueHelpDialogNcNoFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = sap.ui.getCore().byId("idFBNCNumber");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oNcNoFBDialog.destroy();
        },

        onSearchNcNoFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _onValueHelpReqDiscrepancyNo: function () {
            this._oDiscNoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DiscrepNoFBValueHelp", this);
            this.getView().addDependent(this._oDiscNoFBDialog);
            this._oDiscNoFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DN"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oDiscNoFBDialog.setModel(oModel, "oDiscNoFBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configValueHelpDialogDiscNoFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = sap.ui.getCore().byId("idFBDiscrpNo");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oDiscNoFBDialog.destroy();
        },

        onSearchDiscNoFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _onValueHelpReqRMANo: function () {
            this._oRMANoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.RMANoFBValueHelp", this);
            this.getView().addDependent(this._oRMANoFBDialog);
            this._oRMANoFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "RM"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oRMANoFBDialog.setModel(oModel, "oRMANoFBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configValueHelpDialogRMANoFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = sap.ui.getCore().byId("idFBRMANo");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oRMANoFBDialog.destroy();
        },

        onSearchRMANoFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        //Added Value help code for Bin Area,Aircraft, GR and PO subcategories - Code Start
        onBinhelpRequest: function () {
            if (!this._oBinAreDialog) {
                this._oBinAreDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.ZQM_NCR.fragments.BinAreaValueHelp", this);
                this.getView().addDependent(this._oBinAreDialog);
            }
            this._oBinAreDialog.open();
        },
        onLotNumHelpRequest: function () {

            this._oLotnumVHDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.ZQM_NCR.fragments.LotnumVH", this);
            this.getView().addDependent(this._oLotnumVHDialog);

            this._oLotnumVHDialog.open();

            var aFilter = [];
            var oFilter = new Filter("Key", "EQ", "LOTNR");

            aFilter.push(oFilter);
            var oModel = this.getOwnerComponent().getModel();
            var oJSONMOdel = new sap.ui.model.json.JSONModel();

            oModel.read("/f4_genericSet", {
                filters: aFilter,
                success: function (data) {
                    sap.ui.core.BusyIndicator.hide();
                    var lotnumdata = data.results;
                    oJSONMOdel.setData(lotnumdata);
                    this.getView().setModel(oJSONMOdel, "LotNumModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });

        },
        _onConfirmLotNumVH: function (oEvent) {

            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idFlBarPartNumVHLotNo");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oLotnumVHDialog.destroy();

        },
        _onPartSearchWithLotNum: function () {
            var oTab = this.getView().byId("idPartnumTab");
            var OBinding = oTab.getBinding("items");
            var lotnum = this.getView().byId("idFlBarPartNumVHLotNo").getValue();


            if (lotnum) {
                var aFilter = [];
                var oFilter1 = new Filter("Key", "EQ", "PART");
                var oFilter2 = new Filter("Value1", "EQ", "LOST");
                var oFilter3 = new Filter("Value", "EQ", lotnum);
                aFilter.push(oFilter1);
                aFilter.push(oFilter2);
                aFilter.push(oFilter3);

                var oModel = this.getOwnerComponent().getModel();
                var oJSONMOdel = new sap.ui.model.json.JSONModel();

                oModel.read("/f4_genericSet", {
                    filters: aFilter,
                    success: function (data) {
                        sap.ui.core.BusyIndicator.hide();
                        var partnumdata = data.results;
                        oJSONMOdel.setData(partnumdata);
                        this.getView().setModel(oJSONMOdel, "PartNumModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            }

        },
        onCloseLotNumberDialog: function () {
            var lotnum = this.getView().byId("idInpLotNo").getValue();
            if (lotnum) {
                this.helpRequest();
                this._oLotNumDialog.close();
            } else {
                MessageBox.error("Please select Lot Number to continue!!");
            }
        },
        onClosePartNumDialog: function () {
            this.getView().byId("idFlBarPartNumVHLotNo").setValue("");
            this._oPrtNoDialog.close();
        },
        onAircrafthelpRequest: function (oEvent) {
            this._oAircraftDialog = sap.ui.xmlfragment("AircraftfragId", "com.airbus.ZQM_NCR.fragments.AircraftValueHelp", this);
            this.getView().addDependent(this._oAircraftDialog);
            this._oAircraftDialog.open();
            this.oAirCraftInput = oEvent.getSource();
            //F4 Aircraft No s 
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "AIR"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oAircraftDialog.setModel(oModel, "oAircrafttNoModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },
        //live search for aircraft number s
        onAircraftliveSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onSelectBinArea: function (oEvent) {
            var binarea = oEvent.getParameter("listItem").getBindingContext().getProperty("BinLocation");
            this.getView().byId("idInpBinLoc").setValue(binarea);
            this._oBinAreDialog.close();
        },
        _confirmAircraftValueHelpDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oAirCraftInput;
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oAircraftDialog.destroy();
        },
        _confirmGRValueHelpDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idsubcno");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oGRDialog.destroy();
        },
        _confirmPOValueHelpDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idsubcno");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oPODialog.destroy();
        },
        _handleAircraftValueHelpClose: function () {
            //this._oAircraftDialog.close();
            this._oAircraftDialog.destroy();
        },
        onCloseBinAreaDialog: function () {
            this._oBinAreDialog.close();
        },
        _handlePOValueHelpClose: function () {
            this._oPrOrdDialog.close();
            this._oPrOrdDialog.destroy();
        },
        _handleGRValueHelpClose: function () {
            //this._oGRDialog.close();
            this._oGRDialog.destroy();
        },

        //Added Value help code for Bin Area,Aircraft, GR and PO subcategories - Code End
        _configValueHelpDialogOrder: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            if (this.getView().byId("idlinksubc").getSelectedItem()) {
                if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0005") {
                    oInput = this.getView().byId("idsubcno");
                } else if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0003") {
                    oInput = sap.ui.getCore().byId("idFlBarGrVhPartNo");
                } else if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0001") {
                    oInput = sap.ui.getCore().byId("idFlBarPrOrdVhPartNo");
                } else if (Number(this.getView().byId("idlinksubc").getSelectedKey()) == "0004") {
                    oInput = sap.ui.getCore().byId("idFlBarPOVhPartNo");
                }
            }
            //NC copy conditon
            // if (oInput == undefined) {
            // 	oInput = this.getView().byId("idncrnumber");
            // }

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            // this._oPODialog.destroy();

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
        handleCloseUserValueHelpNCcopy:function(oEvent){
            var oSelectedItem = oEvent.getParameters().listItem.getCells()[0].getText(); //oEvent.getParameter("selectedItem"),
            var oInput = this.getView().byId("idncrnumber");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem);
            this._oNCDialog.close();
            this._oNCDialog.destroy();
  
        },
        handleCloseUserValueHelpProdOrd: function (oEvent) {
            var oSelectedItem = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPOModel").getProperty("Order");
            var oSelectedItemSub = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPOModel").getProperty("ProdOrdItem");
            var oInput = this.getView().byId("idsubcno");
            var oInputSub = this.getView().byId("idsubsubno");
            if (!oSelectedItem && !oSelectedItemSub) {
                oInput.resetProperty("value");
                oInputSub.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem);
            oInputSub.setValue(oSelectedItemSub);
            this._oPODialog.close();
            this._oPODialog.destroy();

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
        //work instruction live search s
        onSearchOrderWorkInst: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onSearchOrder: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },
        onSearchOrdersubsub: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("ResultRet", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },
        onNCAreaChange:function()
        {
            this.getView().byId("idsubcno").setValue("");
        },
        _onLotNumVHClose:function(){
            this._oLotnumVHDialog.destroy();
        },
		/*_handleValueHelpClose: function () {
			this._oDialog.destroy();
			this._oDialog.close();
		},*/
        _handleValueHelpClosesubsub: function () {
            //	this._oDialogsub.close();
            this._oDialogsub.destroy();

        },
        onChangeWI: function () {

            var subcatSelected = this.getView().byId("idlinksubc").getSelectedItem();
            if (subcatSelected && subcatSelected.getText() === "WORK INSTRUCTION") {
                var WIvalue = this.getView().byId("idsubcno").getValue();

                var aFilters = [];

                var oFilter = new Filter("Key", "EQ", "WRKINS");
                aFilters.push(oFilter);

                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/f4_genericSet", {
                    filters: aFilters,
                    success: function (data) {
                        sap.ui.core.BusyIndicator.hide();

                        var workinstdata = data.results;

                        if (workinstdata.length > 0) {

                            var WIvaluflag = false;
                            for (var i = 0; i < workinstdata.length; i++) {
                                if (workinstdata[i].Value === WIvalue) {
                                    MessageBox.success("Entered Value exists for Work Instruction");
                                    WIvaluflag = true;
                                    break;
                                }
                            }
                            if (!WIvaluflag) {
                                MessageBox.error("Entered Value does not exist for Work Instruction");
                            }
                        }
                        else {
                            MessageBox.error("Entered Value does not exist for Work Instruction");
                        }

                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });


            }


        },

        onCloseUserPopup: function () {
            // Fixed error related to getting open state property of dialog - Code Start 
            this._oPODialog.close();
            this._oPODialog.destroy();
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

            // this.getOwnerComponent().getRouter().navTo("Ncheader");

            var rbtNc = this.getView().byId("rbg1").getSelectedIndex();
            if(rbtNc == 0){
            var nctype = this.getView().byId("idncr").getSelectedKey();
            var iwa = this.getView().byId("idiwa").getSelectedKey();
            var subcat = this.getView().byId("idlinksubc").getSelectedItem() ? this.getView().byId("idlinksubc").getSelectedItem().getText() : "";
            var binloc = this.getView().byId("idInpBinLoc").getValue();
            var acnum = this.getView().byId("idAirCraftNum").getValue();
          
            var payload = {
                NcType: nctype,
                Area: iwa,
                SubCategory: subcat,
                BinLocation: binloc
            };

            var saveData = {
                GRN: "",
                PON: "",
                NotifNo: ""
            };

            var subCat = this.getView().byId("idlinksubc").getSelectedKey();
            if (subCat !== "") {
                if (subCat == "000001") {
                    saveData.GRN = this.getView().byId("idsubcno").getValue();
                }
                else if (subCat == "000002") {
                    saveData.PON = this.getView().byId("idsubcno").getValue();
                }
            }
            var entityset ="/CreateNotificationSet";
        }else{
            var ncCopy = this.getView().byId("idncrnumber").getValue();
            var payload = {
                Notification:ncCopy,
                "Message": ""
            };
            var entityset ="/CopyNotificationSet";
        }
            var oModel = this.getOwnerComponent().getModel();
            oModel.create(entityset, payload, {
                success: function (data) {
                    MessageBox.success(data.Message, {
                        onClose: function () {

                            saveData.NotifNo = data.Notification;

                            var jsonModel = new sap.ui.model.json.JSONModel();
                            jsonModel.setData(saveData);
                            this.getOwnerComponent().setModel(jsonModel, "NCSaveModel");

                            var idsubvalue = this.getView().byId("idsubcno").getValue();
                            if (idsubvalue === "") {
                                idsubvalue = "00";
                            }
                            var ncr = this.getView().byId("rbg1").getSelectedButton().getText();
                            if (ncr === "Copy") {
                                if (!this.copyFragment) {
                                    this.copyFragment = sap.ui.xmlfragment("copyFrag", "com.airbus.ZQM_NCR.fragments.copypopup", this);
                                    this.getView().addDependent(this.copyFragment);
                                } else {
                                    this.copyFragment = sap.ui.xmlfragment("copyFrag", "com.airbus.ZQM_NCR.fragments.copypopup", this);
                                    this.getView().addDependent(this.copyFragment);
                                }

                                this.copyFragment.open();

                            } else {
                                this.getOwnerComponent().getRouter().navTo("Ncheader", { ID: idsubvalue });
                            }
                        }.bind(this)
                    });
                }.bind(this),
                error: function (oError) {
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });


        },
        onOkCopy: function () {
            var idsubvalue = this.getView().byId("idsubcno").getValue();
            if (idsubvalue === "") {
                idsubvalue = "00";
            }
            var oSelectedCopy = sap.ui.core.Fragment.byId("copyFrag", "copyrgb").getSelectedButton().getText();
            if (oSelectedCopy == "Copy all") {


            } else if (oSelectedCopy == "Copy Header data") {

            } else if (oSelectedCopy == "Copy Header with Discrepancy and Disposition data") {


            }
            this.copyFragment.close();
            this.copyFragment.destroy();
            this.getOwnerComponent().getRouter().navTo("Ncheader", { ID: idsubvalue });
        }
    });
});