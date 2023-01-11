sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    "sap/ui/model/json/JSONModel",_onSelectingDiscrepancy
    "sap/m/Token",
    "sap/m/SearchField",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Tokenizer",
    "sap/m/MessageBox",
    "../utils/Utils",
    "../model/formatter"
], function (Controller, Fragment, JSONModel, MenuItem, Token, SearchField, Filter, FilterOperator, Tokenizer, MessageBox, Utils, formatter) {
    "use strict";
    var sObjectId, oNctype, oDiscrepancy;

    return Controller.extend("com.airbus.ZQM_NCR.controller.Ncheader", {
        formatter: formatter,

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf com.airbus.ZQM_NCR.view.Ncheader
         */
        onInit: function () {
            //this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            var oRouter = this.getOwnerComponent().getRouter();
            this.workingQueueMode = "";
            oRouter.getRoute("Ncheader").attachMatched(this._onRouteMatched, this);
            this.addMultiInputValidator();
            var oAttachModel = new JSONModel();
            oAttachModel.setData([]);
            this.getView().setModel(oAttachModel, "AttachmentModel");
            this.oAppMode = "";
        },

        // Added code for multiinput control id initialisation and validator
        addMultiInputValidator: function () {
            this._oMultiInputSN = this.getView().byId("idMNInputSN");
            this._oMultiInputSN.addValidator(function (args) {
                var text = args.text;

                return new Token({ key: text, text: text });
            });

            this._oMultiInputTN = this.getView().byId("idMNInputTN");
            this._oMultiInputTN.addValidator(function (args) {
                var text = args.text;

                return new Token({ key: text, text: text });
            });

            this._oMultiInputDiscSN = this.getView().byId("idMulInpDiscSerNo");
            this._oMultiInputDiscSN.addValidator(function (args) {
                var text = args.text;

                return new Token({ key: text, text: text });
            });

            this._oMultiInputDiscTN = this.getView().byId("idMulInpDiscTrcNo");
            this._oMultiInputDiscTN.addValidator(function (args) {
                var text = args.text;

                return new Token({ key: text, text: text });
            });

            this._oMultiInputDispoSN = this.getView().byId("idMulInpDispoSerNo");
            this._oMultiInputDispoSN.addValidator(function (args) {
                var text = args.text;

                return new Token({ key: text, text: text });
            });

            this._oMultiInputDispoRewrkOrd = this.getView().byId("idMulInpDispoRewrkOrd");
            this._oMultiInputDispoRewrkOrd.addValidator(function (args) {
                var text = args.text;

                return new Token({ key: text, text: text });
            });
        },

        _onRouteMatched: function (oEvent) {
            // var oArgs = oEvent.getParameter("arguments");
            // var fid = oArgs.ID;
            sObjectId = oEvent.getParameter("arguments").ID;
            this.oAppMode = oEvent.getParameter("arguments").APP;
            this.getOwnerComponent().getModel().metadataLoaded().then(function () {
                var sObjectPath = this.getOwnerComponent().getModel().createKey("CreateNotificationHeaderSet", {
                    NotificationNo: sObjectId
                });
                this._bindView("/" + sObjectPath);
                this._bindTable("/" + sObjectPath);
            }.bind(this));
            /*** Date-22.11.2022 * Added Working Queue display mode functionality*/

            //var workingQueueMode = "";
            if (sap.ui.getCore().getModel("modeModel")) {
                if ((sap.ui.getCore().getModel("modeModel").oData.ModeBtn != "")) {  //&& (sap.ui.getCore().getModel("modeModel") != undefined)
                    this.workingQueueMode = sap.ui.getCore().getModel("modeModel").oData.ModeBtn;
                }
            }
            /*** End*/
            if (this.oAppMode === "QUEUE") {
                this.oIsWorkingQueueFlag = true;
            } else {
                this.oIsWorkingQueueFlag = false;
            }
            if(this.workingQueueMode === "BUYEDIT"){
                /**  var oIconTabBar = this.getView().byId("idIconTabBarHeader");
                    oIconTabBar.fireSelect({ 
                    key: "Dispo",
                    item: oIconTabBar.getItems()[0]
                  } );
                  oIconTabBar.setSelectedKey("Dispo");**/
 
               }
 


        },

        _bindView: function (sObjectPath) {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = sObjectPath;
            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_headerserial,to_headertrace"
                },
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData;
                    var oNCType = data.NCType,
                        oPlantCode = data.PlantCode,
                        oNCPriority = data.NCPriority,
                        oNCArea = data.NCArea,
                        oAircraftno = data.Aircraftno,
                        oBinlocation = data.Binlocation,
                        oDropPint = data.DropPoint,
                        oNCCreatedBy = data.NCCreatedBy,
                        oNCDetectedAt = data.NCDetectedAt,
                        oNCStatus = data.NCStatus,
                        oPartDescription = data.PartDescription,
                        oPartNumber = data.PartNumber,
                        oProdOrder = data.ProdOrder,
                        oProductCode = data.ProductCode,
                        oReferenceNC = data.ReferenceNC,
                        oLinkToAircraft = data.Aircraft,
                        oCreateDate = data.CreateDate,
                        oSupercededByNC = data.SupercededByNC,
                        oSupercedesNC = data.SupercedesNC,
                        oWorkInstruction = data.WorkInstruction,
                        oSerialList = data.to_headerserial,
                        oTraceList = data.to_headertrace,
                        oHdrRoProp = data.HeaderChangeFields;

                    this.getView().byId("idCombNcType").setValue(oNCType);
                    this.getView().byId("idPlntCodeHdr").setValue(oPlantCode);
                    this.getView().byId("idComBoxPriority").setValue(oNCPriority);
                    this.getView().byId("idCombInWhArea").setValue(oNCArea);
                    this.getView().byId("idInpAircraft").setValue(oAircraftno);
                    this.getView().byId("idInpBinLoc").setValue(oBinlocation);
                    this.getView().byId("idInpDrpPt").setValue(oDropPint);
                    this.getView().byId("idInpNCCrtBy").setValue(oNCCreatedBy);
                    this.getView().byId("idInpNCDetAt").setValue(oNCDetectedAt);
                    this.getView().byId("idObjNCStatus").setText(oNCStatus);
                    this.getView().byId("idInpStatPartDesc").setValue(oPartDescription);
                    this.getView().byId("idInpPartNo").setValue(oPartNumber);
                    this.getView().byId("idInpPrdOrd").setValue(oProdOrder);
                    this.getView().byId("idInpProdCode").setValue(oProductCode);
                    this.getView().byId("idInpRefNC").setValue(oReferenceNC);
                    this.getView().byId("idChkBoxLinkAircraft").setSelected(oLinkToAircraft);
                    this.getView().byId("ncHdrDPCrtDate").setDateValue(oCreateDate);
                    this.getView().byId("idInpSupBy").setValue(oSupercededByNC);
                    this.getView().byId("idInpSupNC").setValue(oSupercedesNC);
                    this.getView().byId("idInpWrkIns").setValue(oWorkInstruction);
                    this._oMultiInputSN.removeAllTokens();
                    this._oMultiInputTN.removeAllTokens();

                    if (oSerialList.results.length > 0) {
                        for (var i = 0; i < oSerialList.results.length; i++) {
                            var oSerialNosToken = oSerialList.results[i].SerialNo;
                            var oSernrToken = new sap.m.Token({
                                key: oSerialNosToken,
                                text: oSerialNosToken
                            });
                            this._oMultiInputSN.addToken(oSernrToken);
                        }
                    }
                    if (oTraceList.results.length > 0) {
                        for (var j = 0; j < oTraceList.results.length; j++) {
                            var oTrcNosToken = oTraceList.results[j].TraceNo
                            var oTrcNoToken = new sap.m.Token({
                                key: oTrcNosToken,
                                text: oTrcNosToken
                            });
                            this._oMultiInputTN.addToken(oTrcNoToken);
                        }
                    }
                    if (oPartNumber !== "") {
                        this._oMultiInputSN.setEditable(true);
                        this._oMultiInputTN.setEditable(true);
                        this.handlePartNo();
                    } else {
                        this._oMultiInputSN.setEditable(false);
                        this._oMultiInputTN.setEditable(false);
                        this.getView().byId("idInpStatPartDesc").setEditable(false);
                    }
                    oNctype = this.getView().byId("idCombNcType").getValue();
                    if (this.workingQueueMode == "EDIT") {
                        var hdrODataArray = [];
                        var oROModel;
                        if (oHdrRoProp != "") {
                            hdrODataArray = oHdrRoProp.split(',');
                            oROModel = Utils.getReadonlyPropField(hdrODataArray, "Hdata");
                        } else {
                            oROModel = Utils.getReadonlyPropField(hdrODataArray, "Hdata");
                        }
                        this.bindROHeaderProps(oROModel);
                    }
                    this.bindHeaderData();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        bindROHeaderProps: function (oROModel) {
            this.getView().byId("idCombNcType").setEnabled(oROModel.oData.NCType);
            this.getView().byId("idComBoxPriority").setEnabled(oROModel.oData.NCPriority);
            this.getView().byId("idCombInWhArea").setEnabled(oROModel.oData.NCArea);
            this.getView().byId("idPlntCodeHdr").setEnabled(oROModel.oData.PlantCode);
            this.getView().byId("idInpProdCode").setEditable(oROModel.oData.ProductCode);
            this.getView().byId("idInpWrkIns").setEditable(oROModel.oData.WorkInstruction);
            this.getView().byId("idInpPrdOrd").setEditable(oROModel.oData.ProdOrder);
            this.getView().byId("idInpSupNC").setEditable(oROModel.oData.SupercedesNC);
            this.getView().byId("idInpSupBy").setEditable(oROModel.oData.SupercededByNC);
            this.getView().byId("idInpRefNC").setEditable(oROModel.oData.ReferenceNC);
            this.getView().byId("idInpAircraft").setEditable(oROModel.oData.Aircraft);
            this.getView().byId("idInpPartNo").setEditable(oROModel.oData.PartNumber);
            this.getView().byId("idMNInputSN").setEditable(oROModel.oData.SerialNo);
            this.getView().byId("idMNInputTN").setEditable(oROModel.oData.TraceabilityNo);
            this.getView().byId("idInpNCCrtBy").setEditable(oROModel.oData.NCCreatedBy);
            this.getView().byId("idInpNCDetAt").setEditable(oROModel.oData.NCDetectedAt);
            this.getView().byId("idInpBinLoc").setEditable(oROModel.oData.Binlocation);
            this.getView().byId("idInpDrpPt").setEditable(oROModel.oData.DropPoint);
            this.getView().byId("idncrsave").setVisible(oROModel.oData.Button);
        },


        bindHeaderData: function () {
            this.handleMandatFields();
            this.bindDefaultWorkGroup();
            this.bindPriority();
            this.bindPlantCode();
            this.bindInWhichArea();
            this.getView().byId("idPageNCHeader").setTitle("NC: " + sObjectId + "");
            this.getView().byId("idIconTabBarHeader").setSelectedKey("Hdata");
            this.getView().byId("headertext").setText();
            this.getView().byId("idstatus").setVisible(true);
            this.getView().byId("idObjNCStatus").setVisible(true);
            this.getView().byId("idObjNCStatusDiscrep").setVisible(false);
            this.getView().byId("idObjNCStatusDispo").setVisible(false);
            this.getView().byId("btnWorkGrp").setVisible(true);
            var oParData = { ParentDispoNo: "" };
            this.oParentDispoModel = new JSONModel(oParData);
        },

        bindPriority: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "PRIOK"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this.getView().byId("idComBoxPriority").setModel(oModel, "oPriorityModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        bindInWhichArea: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            var oNcType = this.getView().byId("idCombNcType").getValue();
            oFilter.push(new Filter("NcType", FilterOperator.EQ, oNcType));
            var sPath = "/Area_soSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this.getView().setModel(oModel, "AreaModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        bindPlantCode: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "WERKS"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this.getView().byId("idPlntCodeHdr").setModel(oModel, "oPlantCodeModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        handleMandatFields: function () {
            if (this.getOwnerComponent().getModel("NCSaveModel").getData()) {
                if (Number(this.getOwnerComponent().getModel("NCSaveModel").getData().Category) == "002") {
                    this.getView().byId("idInpAircraft").setRequired(true);
                } else if (this.getView().byId("idInpWrkIns").getValue() !== "") {
                    this.getView().byId("idInpAircraft").setRequired(true);
                } else {
                    this.getView().byId("idInpAircraft").setRequired(false);
                }
            }
        },

        bindDefaultWorkGroup: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/UserWorkGroupS";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    if (oData.results.length > 0) {
                        for (var i = 0; i < oData.results.length; i++) {
                            var oDefaultFlag = oData.results[i].Default;
                            var oDefaultWrkGrp = oData.results[i].WorkGroup;
                            if (oDefaultFlag === true) {
                                this.getView().byId("idworkgroup").setText(oDefaultWrkGrp);
                                break;
                            }
                        }
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        bindSupplierFromPurInfo: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/CreatePurchaseInfoSet('" + sObjectId + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData;
                    var oSupplierCode = data.NCSupplierCode,
                        oSupplierName = data.NCSupplierName;
                    this.getView().byId("idDcIpPrtnr").setValue(oSupplierCode);
                    this.getView().byId("idDcIpPrtnrNm").setValue(oSupplierName);
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _bindTable: function (sObjectPath) {
            var oHeaderDisTabModel = new JSONModel();
            var that = this;
            var oDataModel = this.getOwnerComponent().getModel().sServiceUrl;
            var sPath = oDataModel + sObjectPath + "?$expand=to_discrepancy";
            var aData = jQuery.ajax({
                type: "GET",
                contentType: "application/json",
                url: sPath,
                dataType: "json",
                async: false,
                success: function (data, textStatus, jqXHR) {
                    oHeaderDisTabModel.setData(data.d.to_discrepancy.results);
                }
            });
            this.getView().byId("idHeaderDiscTable").setModel(oHeaderDisTabModel, "oHeaderDiscTable");
        },

        onListItemPress: function () {

        },

        onCssChange: function (oEvent) {
            var a = oEvent.getParameters().value;
            if (a == "") {

            } else {

            }
        },

        helpRequestComponent: function () {
            sap.ui.core.BusyIndicator.show();
            this.Dialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.componentf4help", this);
            this.getView().addDependent(this.oDialog);
            this.Dialog.open();
            sap.ui.core.BusyIndicator.hide();

        },

        onCloseUserPopup: function () {
            this.Dialog.close();
            this.Dialog.destroy();
        },

        handleIconbarSelect: function () {
            var icontabbar = this.getView().byId("idIconTabBarHeader");
            // var key = oEvent.getParameters().selectedItem.getKey();
            var key = icontabbar.getSelectedKey();
            var text;
            this.getView().byId("headertext").setText();
            this.getView().byId("idstatus").setVisible(false);
            this.getView().byId("idObjNCStatus").setVisible(false);
            this.getView().byId("idObjNCStatusDiscrep").setVisible(false);
            this.getView().byId("idObjNCStatusDispo").setVisible(false);
            this.getView().byId("btnWorkGrp").setVisible(false);
            this.getView().byId("idBtnCancel").setVisible(true);
            if (key === "Hdata") {
                this.getView().byId("idstatus").setVisible(true);
                this.getView().byId("idObjNCStatus").setVisible(true);
                this.getView().byId("idObjNCStatusDiscrep").setVisible(false);
                this.getView().byId("idObjNCStatusDispo").setVisible(false);
                this.getView().byId("btnWorkGrp").setVisible(true);
                var sObjectPath = "CreateNotificationHeaderSet('" + sObjectId + "')";
                this._bindView("/" + sObjectPath);
                this._bindTable("/" + sObjectPath);
            } else if (key === "log") {
                text = "Traceability and History";
                this.getView().byId("headertext").setText(text);
            } else if (key === "Purchase") {
                this._setPurchaseInfoData();
            } else if (key === "Discre") {
                this._setDiscrepancyComboBox();
                this._setPrelimCauseComboBox();
                this._setFormatComboBox();
                this.bindLinkedToDiscrepancy();
                this.onSelectDiscPartlocation();
                var oDiscrepancyNo = "";
                this.bindDiscrepancyTab(oDiscrepancyNo);
                this.bindSupplier();
                this.bindDefaultPartNumber();
                this.getView().byId("idstatus").setVisible(true);
                this.getView().byId("idObjNCStatus").setVisible(false);
                this.getView().byId("idObjNCStatusDiscrep").setVisible(true);
                this.getView().byId("idObjNCStatusDispo").setVisible(false);
                this.getView().byId("idDcBtStkPrg").setVisible(false);
            } else if (key === "Dispo") {
                this._setDiscrepancyComboBox();
                var oDiscrepancyNo = "";
                this.bindDispositionTab(oDiscrepancyNo);
                this.bindMajorMinorNc();
                this.getView().byId("idstatus").setVisible(true);
                this.getView().byId("idObjNCStatus").setVisible(false);
                this.getView().byId("idObjNCStatusDiscrep").setVisible(false);
                this.getView().byId("idObjNCStatusDispo").setVisible(true);
                this.getView().byId("idBtnCancel").setVisible(false);
            } else if (key == "Signoff") {
                this.getView().byId("headertext").setText();
                this.getView().byId("idBtnCancel").setVisible(false);
                this.headerSingoffDetails();
                // this.discSingoffDetails();
            }
        },

        bindSupplier: function () {
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/GetDiscSupplierCodeSet('" + sObjectId + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    if (oData.DiscPartnerCode !== "") {
                        var oDiscPartnerCode = oData.DiscPartnerCode,
                            oDiscPartnerDesc = oData.DiscPartnerDesc;
                        this.getView().byId("idDcIpPrtnr").setValue(oDiscPartnerCode);
                        this.getView().byId("idDcIpPrtnrNm").setValue(oDiscPartnerDesc);
                    } else {
                        this.bindSupplierFromPurInfo();
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        bindDefaultPartNumber: function () {
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/DefaultPartNumberHeaderSet(NotificationNo='" + sObjectId + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var oMulInpSer = this.getView().byId("idMulInpDiscSerNo"),
                        oMulInpTrc = this.getView().byId("idMulInpDiscTrcNo");
                    if (oData.PartNumber !== "") {
                        var oDiscPartNum = oData.PartNumber,
                            oDiscPartDesc = oData.PartDescription;
                        this.getView().byId("idDiscPartNumber").setValue(oDiscPartNum);
                        this.getView().byId("idDiscPartDesc").setValue(oDiscPartDesc);
                        this.getView().byId("idDiscPartDesc").setEditable(false);
                        oMulInpSer.setEditable(true);
                        oMulInpTrc.setEditable(true);
                    } else {
                        this.getView().byId("idDiscPartDesc").setEditable(true);
                        oMulInpSer.setEditable(false);
                        oMulInpTrc.setEditable(false);
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        // discrepancy part location combobox data select
        onSelectDiscPartlocation: function () {
            var oDataModel = this.getOwnerComponent().getModel();
            var oModel = new JSONModel();
            var oFilterPart = [];
            oFilterPart.push(new Filter("Key", FilterOperator.EQ, "DISCSTATION"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilterPart,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this.getView().setModel(oModel, "oSelectPartLocationModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);

                }
            });
        },

        //Based on location it will display location fields 
        onDiscPartSelectLocation: function (oEvent) {
            var rsel = oEvent.getSource().getSelectedKey();
            this.getView().byId("idFuselage").setVisible(false);
            this.getView().byId("idWing").setVisible(false);
            this.getView().byId("idVertical").setVisible(false);
            this.getView().byId("idRudder").setVisible(false);
            this.getView().byId("idHorizontal").setVisible(false);
            this.getView().byId("idPlyon").setVisible(false);
            this.getView().byId("idOthers").setVisible(false);
            switch (rsel) {

                case "WING":
                    this.getView().byId("idWing").setVisible(true);
                    break;
                case "VERTICAL EMPENNAGE":
                    this.getView().byId("idVertical").setVisible(true);
                    break;
                case "RUDDER":
                    this.getView().byId("idRudder").setVisible(true);
                    break;
                case "HORIZONTAL EMPENNAGE":
                    this.getView().byId("idHorizontal").setVisible(true);
                    break;
                case "PYLON / NACELLE":
                    this.getView().byId("idPlyon").setVisible(true);
                    break;
                case "OTHER":
                    this.getView().byId("idOthers").setVisible(true);
                    break;
                case "FUSELAGE":
                    this.getView().byId("idFuselage").setVisible(true);
                    break;
            }
            this.onClearPartLocation();
            this.onSelectDiscPartlocationList();
        },

        onDiscPartSelectLocationList: function () {
            var oDataModel = this.getOwnerComponent().getModel();
            var oModel = new JSONModel();
            var sDiscrepancy = this.getView().byId("idDispCobDscNo").getValue();
            if (sDiscrepancy == "") {
                var sDisp = this.getView().byId("headertext").getText();
                var len = sDisp.search(":");
                var sDiscrepancy = sDisp.slice(Number(len) + 1).trim();
            } else {
                var sDiscrepancy = sDiscrepancy;
            }
            var sSequence = this.getView().byId("cmbDescSelect1").getSelectedKey();
            if (sSequence == "") {
                this.onClearPartLocation();
                return;
            }
            var sStation = this.getView().byId("cmbDescSelect").getSelectedKey();
            // var sPath = "/DiscrepancyPartAircraftSet(NotificationNo='200001061',DiscrepancyNo='0100',Location='FUSELAGE',SequenceNo='11')"
            var sPath = "/DiscrepancyPartAircraftSet(NotificationNo='" + sObjectId + "',DiscrepancyNo='" + sDiscrepancy + "',Location='" + sStation + "',SequenceNo='" + sSequence + "')"
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    var data = oData;
                    oModel.setData(data);
                    this.getView().setModel(oModel, "oPartLocationList");
                    sap.ui.core.BusyIndicator.hide();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    this.onClearPartLocation();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onSelectDiscPartlocationList: function () {
            var oDataModel = this.getOwnerComponent().getModel();
            var oModel = new JSONModel();
            var oFilter = [];
            var sDiscrepancy = this.getView().byId("idDispCobDscNo").getValue();
            if (sDiscrepancy == "") {
                var sDisp = this.getView().byId("headertext").getText();
                var len = sDisp.search(":");
                var sDiscrepancy = sDisp.slice(Number(len) + 1).trim();
            } else {
                var sDiscrepancy = sDiscrepancy;
            }
            var sStation = this.getView().byId("cmbDescSelect").getSelectedKey();
            oFilter.push(new Filter("NotificationNo", FilterOperator.EQ, sObjectId));
            oFilter.push(new Filter("DiscrepancyNo", FilterOperator.EQ, sDiscrepancy));
            oFilter.push(new Filter("Station", FilterOperator.EQ, sStation));
            var sPath = "/GetPartAircraftListSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this.getView().setModel(oModel, "oSelectPartLocationListModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        // Descrepancy part location save
        onSavePartLocation: function () {
            var obj = {};
            var serialno = this.getView().byId("cmbDescSelect1").getSelectedKey();
            if (serialno != "") {
                obj.SequenceNo = serialno;
            }
            var notificaitonno = sObjectId;
            var locationKey = this.getView().byId("cmbDescSelect").getSelectedKey();
            obj.NotificationNo = sObjectId;
            obj.Location = locationKey;
            obj.DiscrepancyNo = this.getView().byId("idDcCobDscNo").getSelectedKey();
            if (obj.DiscrepancyNo == "") {
                var oSavPrtLocMsg = this.getView().getModel("i18n").getProperty("SplDiscMsg");
                MessageBox.warning(oSavPrtLocMsg);
                return
            }
            if (locationKey == "FUSELAGE") {

                //line1
                obj.FuselageStation = this.getView().byId("chbFuseStation").getSelected();
                var rbtFuseSation = this.getView().byId("rbtFuseStation").getSelected();
                var rbtFuseSation1 = this.getView().byId("rbtFuseStation1").getSelected();
                var fstaSel = rbtFuseSation === true ? "AT" : (rbtFuseSation1 === true ? "BETWEEN" : "");
                obj.FuseStatnSel = fstaSel;
                obj.FuseStatnVal1 = this.getView().byId("inpFuseStation").getValue();
                obj.FuseStatnVal2 = this.getView().byId("inpFuseStation1").getValue();
                //line2
                obj.FuseFrame = this.getView().byId("chbFuseFStation").getSelected();
                var rbtFuseFStation = this.getView().byId("rbtFuseFStation").getSelected();
                var rbtFuseFStation1 = this.getView().byId("rbtFuseFStation1").getSelected();
                var ffstation = rbtFuseFStation === true ? "AT" : (rbtFuseFStation1 === true ? "BETWEEN" : "");
                obj.FuseFrameSel = ffstation;
                obj.FuseFrameVal1 = this.getView().byId("inpFuseFStation").getValue();
                obj.FuseFrameVal2 = this.getView().byId("inpFuseFStation1").getValue();
                //line3
                obj.FuseStringer = this.getView().byId("chbFuseString").getSelected();
                var rbtFuseString = this.getView().byId("rbtFuseString").getSelected();
                var rbtFuseString1 = this.getView().byId("rbtFuseString1").getSelected();
                var ffstring = rbtFuseString === true ? "AT" : (rbtFuseString1 === true ? "BETWEEN" : "");
                obj.FuseStringerSel = ffstring;
                obj.FuseStringerVal1 = this.getView().byId("inpFuseString").getValue();
                obj.FuseStringerVal2 = this.getView().byId("inpFuseString1").getValue();
                //line4
                obj.ButtockLine = this.getView().byId("chbFuseBLine").getSelected();
                var rbtFuseBLine = this.getView().byId("rbtFuseBLine").getSelected();
                var rbtFuseBLine1 = this.getView().byId("rbtFuseBLine1").getSelected();
                var bLine = rbtFuseBLine === true ? "AT" : (rbtFuseBLine1 === true ? "BETWEEN" : "");
                obj.ButtockLineSel = bLine;
                obj.ButtockLineVal1 = this.getView().byId("inpFuseBLine").getValue();
                obj.ButtockLineVal2 = this.getView().byId("inpFuseBLine1").getValue();
                //line5
                obj.WaterLine = this.getView().byId("chbFuseWLine").getSelected();
                var rbtFuseWLine = this.getView().byId("rbtFuseWLine").getSelected();
                var rbtFuseWLine1 = this.getView().byId("rbtFuseWLine1").getSelected();
                var wLine = rbtFuseWLine === true ? "AT" : (rbtFuseWLine1 === true ? "BETWEEN" : "");
                obj.WaterLineSel = wLine;
                obj.WaterLineVal1 = this.getView().byId("inpFuseWLine").getValue();
                obj.WaterLineVal2 = this.getView().byId("inpFuseWLine1").getValue();
                //line6
                obj.OmlIml = this.getView().byId("chbFuseOmlIml").getSelected();
                var rbtFuseOml = this.getView().byId("rbtFuseOml").getSelected();
                var rbtFuseIml = this.getView().byId("rbtFuseIml").getSelected();
                var fuseomliml = rbtFuseOml === true ? "OML" : (rbtFuseIml === true ? "IML" : "");
                obj.OmlImlValue = fuseomliml;

                obj.FuseFrameLhs1 = this.getView().byId("rbtFuseStringL").getSelected();
                obj.FuseFrameRhs1 = this.getView().byId("rbtFuseStringR").getSelected();
                obj.FuseFrameLhs2 = this.getView().byId("rbtFuseStringL1").getSelected();
                obj.FuseFrameRhs2 = this.getView().byId("rbtFuseStringR1").getSelected();

                obj.FuseStringLhs1 = this.getView().byId("rbtFuseBLineL").getSelected();
                obj.FuseStringRhs1 = this.getView().byId("rbtFuseBLineR").getSelected();
                obj.FuseStringLhs2 = this.getView().byId("rbtFuseBLineL1").getSelected();
                obj.FuseStringRhs2 = this.getView().byId("rbtFuseBLineR1").getSelected();

            } else if (locationKey == "HORIZONTAL EMPENNAGE") {
                //line1
                obj.Lhs_Rhs = this.getView().byId("chbHorizontalLhsRhs").getSelected();
                obj.Lhs = this.getView().byId("rbtHorizontalLhsRhsL").getSelected();
                obj.Rhs = this.getView().byId("rbtHorizontalLhsRhsR").getSelected();
                //line2
                obj.HorzRib = this.getView().byId("chbHorizontalRib").getSelected();
                var rbtHorizontalRibat = this.getView().byId("rbtHorizontalRibat").getSelected();
                var rbtHorizontalRibbw = this.getView().byId("rbtHorizontalRibbw").getSelected();
                var horizRib = rbtHorizontalRibat === true ? "AT" : (rbtHorizontalRibbw === true ? "BETWEEN" : "");
                obj.HorzRibSel = horizRib;
                obj.HorzRibVal = this.getView().byId("inpHorizontalRib").getValue();
                obj.HorzRibVal2 = this.getView().byId("inpHorizontalRib1").getValue();
                //line4    
                obj.OmlIml = this.getView().byId("chbHorizontalOmlIml").getSelected();
                var rbtHorizontalOml = this.getView().byId("rbtHorizontalOml").getSelected();
                var rbtHorizontalIml = this.getView().byId("rbtHorizontalIml").getSelected();
                var horizomliml = rbtHorizontalOml === true ? "OML" : (rbtHorizontalIml === true ? "IML" : "");
                obj.OmlImlValue = horizomliml;
                //line3
                obj.HorzStation = this.getView().byId("chbHorizontalStation").getSelected();
                var rbtHorizontalStationat = this.getView().byId("rbtHorizontalStationat").getSelected();
                var rbtHorizontalStationbw = this.getView().byId("rbtHorizontalStationbw").getSelected();
                var horizStation = rbtHorizontalStationat === true ? "AT" : (rbtHorizontalStationbw === true ? "BETWEEN" : "");
                obj.HorzStationSel = horizStation;
                obj.HorzStationVal1 = this.getView().byId("inpHorizontalStation").getValue();
                obj.HorzStationVal2 = this.getView().byId("inpHorizontalStation1").getValue();

            } else if (locationKey == "VERTICAL EMPENNAGE") {

                //line2
                obj.VerticalEmpStation = this.getView().byId("chbVerticalStation").getSelected();
                var rbtVerticalStationat = this.getView().byId("rbtVerticalStationat").getSelected();
                var rbtVerticalStationbw = this.getView().byId("rbtVerticalStationbw").getSelected();
                var vertStation = rbtVerticalStationat === true ? "AT" : (rbtVerticalStationbw === true ? "BETWEEN" : "");
                obj.VerticalEmpStationSel = vertStation;
                obj.VerticalEmpStationVal1 = this.getView().byId("inpVerticalStation").getValue();
                obj.VerticalEmpStationVal2 = this.getView().byId("inpVerticalStation1").getValue();
                //line3
                obj.VerticalEmpRib = this.getView().byId("chbVerticalRib").getSelected();
                var rbtVerticalRibat = this.getView().byId("rbtVerticalRibat").getSelected();
                var rbtVerticalRibbw = this.getView().byId("rbtVerticalRibbw").getSelected();
                var vertRib = rbtVerticalRibat === true ? "AT" : (rbtVerticalRibbw === true ? "BETWEEN" : "");
                obj.VerticalEmpRibSel = vertRib;
                obj.VerticalEmpRibVal1 = this.getView().byId("inpVerticalRib").getValue();
                obj.VerticalEmpRibVal2 = this.getView().byId("inpVerticalRib1").getValue();
                //line1
                obj.Lhs_Rhs = this.getView().byId("chbVerticalLhsRhs").getSelected();
                obj.Lhs = this.getView().byId("rbtVerticalLhsRhsL").getSelected();
                obj.Rhs = this.getView().byId("rbtVerticalLhsRhsR").getSelected();
                //line4
                obj.OmlIml = this.getView().byId("chbVerticalOmlIml").getSelected();
                var rbtVerticalOml = this.getView().byId("rbtVerticalOml").getSelected();
                var rbtVerticalIml = this.getView().byId("rbtVerticalIml").getSelected();
                var verticalomliml = rbtVerticalOml === true ? "OML" : (rbtVerticalIml === true ? "IML" : "");
                obj.OmlImlValue = verticalomliml;

            } else if (locationKey == "PYLON / NACELLE") {
                //line1
                obj.FuselageStation = this.getView().byId("chbPlyonStation").getSelected();
                var rbtPlyonStationat = this.getView().byId("rbtPlyonStationat").getSelected();
                var rbtPlyonStationbw = this.getView().byId("rbtPlyonStationbw").getSelected();
                var ployonStation = rbtPlyonStationat === true ? "AT" : (rbtPlyonStationbw === true ? "BETWEEN" : "");
                obj.FuseStatnSel = ployonStation;
                obj.FuseStatnVal1 = this.getView().byId("inpPlyonStation").getValue();
                obj.FuseStatnVal2 = this.getView().byId("inpPlyonStation1").getValue();
                //line2
                obj.ButtockLine = this.getView().byId("chbPlyonBLine").getSelected();
                var rbtPlyonBLineat = this.getView().byId("rbtPlyonBLineat").getSelected();
                var rbtPlyonBLinebw = this.getView().byId("rbtPlyonBLinebw").getSelected();
                var plyonBLine = rbtPlyonBLineat === true ? "AT" : (rbtPlyonBLinebw === true ? "BETWEEN" : "");
                obj.ButtockLineSel = plyonBLine;
                obj.ButtockLineVal1 = this.getView().byId("inpPlyonBLine").getValue();
                obj.ButtockLineLhs1 = this.getView().byId("rbtPlyonBLineL").getSelected();
                obj.ButtockLineRhs1 = this.getView().byId("rbtPlyonBLineR").getSelected();
                obj.ButtockLineVal2 = this.getView().byId("inpPlyonBLine1").getValue();
                obj.ButtockLineLhs2 = this.getView().byId("rbtPlyonBLineL1").getSelected();
                obj.ButtockLineRhs2 = this.getView().byId("rbtPlyonBLineR1").getSelected();

                //line3
                obj.WaterLine = this.getView().byId("chbPlyonWLine").getSelected();
                var rbtPlyonWLineat = this.getView().byId("rbtPlyonWLineat").getSelected();
                var rbtPlyonWLinebw = this.getView().byId("rbtPlyonWLinebw").getSelected();
                var plyonWLine = rbtPlyonWLineat === true ? "AT" : (rbtPlyonWLinebw === true ? "BETWEEN" : "");
                obj.WaterLineSel = plyonWLine;
                obj.WaterLineVal1 = this.getView().byId("inpPlyonWLine").getValue();
                obj.WaterLineVal2 = this.getView().byId("inpPlyonWLine1").getValue();
                //line4
                obj.OmlIml = this.getView().byId("chbPlyonOmlIml").getSelected();
                var rbtPlyonOml = this.getView().byId("rbtPlyonOml").getSelected();
                var rbtPlyonIml = this.getView().byId("rbtPlyonIml").getSelected();
                var plyonOmlIml = rbtPlyonOml === true ? "OML" : (rbtPlyonIml === true ? "IML" : "");
                obj.OmlImlValue = plyonOmlIml;

            } else if (locationKey == "WING") {

                //line2
                obj.WingStation = this.getView().byId("chbWingStation").getSelected();
                var rbtWingStationat = this.getView().byId("rbtWingStationat").getSelected();
                var rbtWingStationbw = this.getView().byId("rbtWingStationbw").getSelected();
                var wingstation = rbtWingStationat === true ? "AT" : (rbtWingStationbw === true ? "BETWEEN" : "");
                obj.WingStationSel = wingstation;
                obj.WingStationVal1 = this.getView().byId("inpWingStation").getValue();
                obj.WinfStationVal2 = this.getView().byId("inpWingStation1").getValue();
                //line3
                obj.WingRib = this.getView().byId("chbWingRib").getSelected();
                var rbtWingRibat = this.getView().byId("rbtWingRibat").getSelected();
                var rbtWingRibbw = this.getView().byId("rbtWingRibbw").getSelected();
                var wingRib = rbtWingRibat === true ? "AT" : (rbtWingRibbw === true ? "BETWEEN" : "");
                obj.WingRibSel = wingRib;
                obj.WingRibVal1 = this.getView().byId("inpWingRib").getValue();
                obj.WingRibVal2 = this.getView().byId("inpWingRib1").getValue();


                obj.OmlIml = this.getView().byId("chbWingOmlIml").getSelected();
                var rbtWingOml = this.getView().byId("rbtWingOml").getSelected();
                var rbtWingIml = this.getView().byId("rbtWingIml").getSelected();
                var wingomliml = rbtWingOml === true ? "OML" : (rbtWingIml === true ? "IML" : "");
                obj.OmlImlValue = wingomliml;

                obj.Lhs_Rhs = this.getView().byId("chbWingLhsRhs").getSelected();
                obj.Lhs = this.getView().byId("rbtWingLhsRhsL").getSelected();
                obj.Rhs = this.getView().byId("rbtWingLhsRhsR").getSelected();


            } else if (locationKey == "RUDDER") {
                //line2
                obj.RuderTailStation = this.getView().byId("chbRudderStation").getSelected();
                var rbtRudderStationat = this.getView().byId("rbtRudderStationat").getSelected();
                var rbtRudderStationbw = this.getView().byId("rbtRudderStationbw").getSelected();
                var rudderStation = rbtRudderStationat === true ? "AT" : (rbtRudderStationbw === true ? "BETWEEN" : "");
                obj.RuderTailStationSel = rudderStation;
                obj.RuderTailStationVal = this.getView().byId("inpRudderStation").getValue();
                obj.RuderTailStationVal1 = this.getView().byId("inpRudderStation1").getValue();
                //line3
                obj.RuderRib = this.getView().byId("chbRudderRib").getSelected();
                var rbtRudderRibat = this.getView().byId("rbtRudderRibat").getSelected(); obj.RuderRibSel = "";
                var rbtRudderRibbw = this.getView().byId("rbtRudderRibbw").getSelected();
                var rudderRib = rbtRudderRibat === true ? "AT" : (rbtRudderRibbw === true ? "BETWEEN" : "");
                obj.RuderRibSel = rudderRib;
                obj.RuderRibVal1 = this.getView().byId("inpRudderRib").getValue();;
                obj.RuderRibVal2 = this.getView().byId("inpRudderRib1").getValue();
                //line4

                obj.Lhs_Rhs = this.getView().byId("chbRudderLhsRhs").getSelected();
                obj.Lhs = this.getView().byId("rbtRudderLhsRhsL").getSelected();
                obj.Rhs = this.getView().byId("rbtRudderLhsRhsR").getSelected();

                obj.OmlIml = this.getView().byId("chbRudderOmlIml").getSelected();
                var rbtRudderOml = this.getView().byId("rbtRudderOml").getSelected();
                var rbtRudderIml = this.getView().byId("rbtRudderIml").getSelected();
                var rudderomliml = rbtRudderOml === true ? "OML" : (rbtRudderIml === true ? "IML" : "");
                obj.OmlImlValue = rudderomliml;

            } else if (locationKey == "OTHER") {
                //line1
                obj.Lhs_Rhs = this.getView().byId("chbOthersLhsRhs").getSelected();
                obj.Lhs = this.getView().byId("rbtOthersLhsRhsL").getSelected();
                obj.Rhs = this.getView().byId("rbtOthersLhsRhsR").getSelected();
                //line2
                obj.FuselageStation = this.getView().byId("chbOthersFStation").getSelected();
                var rbtOthersFStationat = this.getView().byId("rbtOthersFStationat").getSelected();
                var rbtOthersFStationbw = this.getView().byId("rbtOthersFStationbw").getSelected();
                var otherStation = rbtOthersFStationat === true ? "AT" : (rbtOthersFStationbw === true ? "BETWEEN" : "");
                obj.FuseStatnSel = otherStation;
                obj.FuseStatnVal1 = this.getView().byId("inpOthersFStation").getValue();
                obj.FuseStatnVal2 = this.getView().byId("inpOthersFStation1").getValue();
                //line3
                obj.ButtockLine = this.getView().byId("chbOthersBLine").getSelected();
                var rbtOthersBLineat = this.getView().byId("rbtOthersBLineat").getSelected();
                var rbtOthersBLinebw = this.getView().byId("rbtOthersBLinebw").getSelected();
                var otherBLine = rbtOthersBLineat === true ? "AT" : (rbtOthersBLinebw === true ? "BETWEEN" : "");
                obj.ButtockLineSel = otherBLine;
                obj.ButtockLineVal1 = this.getView().byId("inpOthersBLine").getValue();
                obj.ButtockLineVal2 = this.getView().byId("inpOthersBLine1").getValue();
                //line4
                obj.WaterLine = this.getView().byId("chbOthersWLine").getSelected();
                var rbtOthersWLineat = this.getView().byId("rbtOthersWLineat").getSelected();
                var rbtOthersWLinebw = this.getView().byId("rbtOthersWLinebw").getSelected();
                var otherWLine = rbtOthersWLineat === true ? "AT" : (rbtOthersWLinebw === true ? "BETWEEN" : "");
                obj.WaterLineSel = otherWLine;
                obj.WaterLineVal1 = this.getView().byId("inpOthersWLine").getValue();
                obj.WaterLineVal2 = this.getView().byId("inpOthersWLine1").getValue();


                obj.ButtockLineLhs1 = this.getView().byId("rbtOthersBLineL").getSelected();
                obj.ButtockLineRhs1 = this.getView().byId("rbtOthersBLineR").getSelected();

                obj.ButtockLineLhs2 = this.getView().byId("rbtOthersBLineL1").getSelected();
                obj.ButtockLineRhs2 = this.getView().byId("rbtOthersBLineR1").getSelected();
                //line5
                obj.OmlIml = this.getView().byId("chbOthersOmlIml").getSelected();
                var rbtOthersOml = this.getView().byId("rbtOthersOml").getSelected();
                var rbtOthersIml = this.getView().byId("rbtOthersIml").getSelected();
                var otherOMLIML = rbtOthersOml === true ? "OML" : (rbtOthersIml === true ? "IML" : "");
                obj.OmlImlValue = otherOMLIML;
            }
            var oModel = this.getOwnerComponent().getModel();
            oModel.create("/DiscrepancyPartAircraftSet", obj, {
                success: function (odata, Response) {
                    sap.ui.core.BusyIndicator.hide();
                    if (Response.headers["sap-message"]) {
                        var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                        var oSeverity = JSON.parse(Response.headers["sap-message"]).severity;
                        if (oSeverity == "success") {
                            MessageBox.success(oMsg);
                            this.getView().byId("cmbDescSelect1").setSelectedKey();
                            this.onClearPartLocation();
                            this.onSelectDiscPartlocationList();

                        } else {
                            MessageBox.error(oMsg);
                        }
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });

        },

        //part location clear the values
        onClearPartLocation: function (oEvent) {
            this.getView().byId("chbFuseStation").setSelected(false);
            this.getView().byId("chbFuseFStation").setSelected(false);
            this.getView().byId("chbFuseString").setSelected(false);
            this.getView().byId("chbFuseBLine").setSelected(false);
            this.getView().byId("chbFuseWLine").setSelected(false);
            this.getView().byId("chbFuseOmlIml").setSelected(false);
            this.getView().byId("rbtFuseStation").setSelected(false);
            this.getView().byId("rbtFuseFStation").setSelected(false);
            this.getView().byId("rbtFuseString").setSelected(false);
            this.getView().byId("rbtFuseBLine").setSelected(false);
            this.getView().byId("rbtFuseWLine").setSelected(false);
            this.getView().byId("rbtFuseOml").setSelected(false);
            this.getView().byId("rbtFuseStation1").setSelected(false);
            this.getView().byId("rbtFuseFStation1").setSelected(false);
            this.getView().byId("rbtFuseString1").setSelected(false);
            this.getView().byId("rbtFuseBLine1").setSelected(false);
            this.getView().byId("rbtFuseWLine1").setSelected(false);
            this.getView().byId("rbtFuseIml").setSelected(false);
            this.getView().byId("inpFuseStation").setValue();
            this.getView().byId("inpFuseFStation").setValue();
            this.getView().byId("inpFuseString").setValue();
            this.getView().byId("inpFuseBLine").setValue();
            this.getView().byId("inpFuseWLine").setValue();
            this.getView().byId("rbtFuseStringL").setSelected(false);
            this.getView().byId("rbtFuseStringR").setSelected(false);
            this.getView().byId("rbtFuseBLineL").setSelected(false);
            this.getView().byId("rbtFuseBLineR").setSelected(false);
            this.getView().byId("inpFuseStation1").setValue();
            this.getView().byId("inpFuseFStation1").setValue();
            this.getView().byId("inpFuseString1").setValue();
            this.getView().byId("inpFuseBLine1").setValue();
            this.getView().byId("inpFuseWLine1").setValue();
            this.getView().byId("rbtFuseStringL1").setSelected(false);
            this.getView().byId("rbtFuseStringR1").setSelected(false);
            this.getView().byId("rbtFuseBLineL1").setSelected(false);
            this.getView().byId("rbtFuseBLineR1").setSelected(false);

            this.getView().byId("chbWingLhsRhs").setSelected(false);
            this.getView().byId("chbWingStation").setSelected(false);
            this.getView().byId("chbWingRib").setSelected(false);
            this.getView().byId("chbWingOmlIml").setSelected(false);
            this.getView().byId("rbtWingLhsRhsL").setSelected(false);
            this.getView().byId("rbtWingStationat").setSelected(false);
            this.getView().byId("rbtWingRibat").setSelected(false);
            this.getView().byId("rbtWingOml").setSelected(false);
            this.getView().byId("rbtWingLhsRhsR").setSelected(false);
            this.getView().byId("rbtWingStationbw").setSelected(false);
            this.getView().byId("rbtWingRibbw").setSelected(false);
            this.getView().byId("rbtWingRibbw").setSelected(false);
            this.getView().byId("rbtWingIml").setSelected(false);
            this.getView().byId("inpWingStation").setValue();
            this.getView().byId("inpWingRib").setValue();
            this.getView().byId("inpWingStation1").setValue();
            this.getView().byId("inpWingRib1").setValue();

            this.getView().byId("chbVerticalLhsRhs").setSelected(false);
            this.getView().byId("chbVerticalStation").setSelected(false);
            this.getView().byId("chbVerticalRib").setSelected(false);
            this.getView().byId("chbVerticalOmlIml").setSelected(false);
            this.getView().byId("rbtVerticalLhsRhsL").setSelected(false);
            this.getView().byId("rbtVerticalStationat").setSelected(false);
            this.getView().byId("rbtVerticalRibat").setSelected(false);
            this.getView().byId("rbtVerticalOml").setSelected(false);
            this.getView().byId("rbtVerticalLhsRhsR").setSelected(false);
            this.getView().byId("rbtVerticalStationbw").setSelected(false);
            this.getView().byId("rbtVerticalRibbw").setSelected(false);
            this.getView().byId("rbtVerticalIml").setSelected(false);
            this.getView().byId("inpVerticalStation").setValue();
            this.getView().byId("inpVerticalRib").setValue();
            this.getView().byId("inpVerticalStation1").setValue();
            this.getView().byId("inpVerticalRib1").setValue();

            this.getView().byId("chbRudderLhsRhs").setSelected(false);
            this.getView().byId("chbRudderStation").setSelected(false);
            this.getView().byId("chbRudderRib").setSelected(false);
            this.getView().byId("chbRudderOmlIml").setSelected(false);
            this.getView().byId("rbtRudderLhsRhsL").setSelected(false);
            this.getView().byId("rbtRudderStationat").setSelected(false);
            this.getView().byId("rbtRudderRibat").setSelected(false);
            this.getView().byId("rbtRudderOml").setSelected(false);
            this.getView().byId("rbtRudderLhsRhsR").setSelected(false);
            this.getView().byId("rbtRudderStationbw").setSelected(false);
            this.getView().byId("rbtRudderRibbw").setSelected(false);
            this.getView().byId("rbtRudderIml").setSelected(false);
            this.getView().byId("inpRudderStation").setValue();
            this.getView().byId("inpRudderRib").setValue();
            this.getView().byId("inpRudderStation1").setValue();
            this.getView().byId("inpRudderRib1").setValue();

            this.getView().byId("chbHorizontalLhsRhs").setSelected(false);
            this.getView().byId("chbHorizontalStation").setSelected(false);
            this.getView().byId("chbHorizontalRib").setSelected(false);
            this.getView().byId("chbHorizontalOmlIml").setSelected(false);
            this.getView().byId("rbtHorizontalLhsRhsL").setSelected(false);
            this.getView().byId("rbtHorizontalStationat").setSelected(false);
            this.getView().byId("rbtHorizontalRibat").setSelected(false);
            this.getView().byId("rbtHorizontalOml").setSelected(false);
            this.getView().byId("rbtHorizontalLhsRhsR").setSelected(false);
            this.getView().byId("rbtHorizontalStationbw").setSelected(false);
            this.getView().byId("rbtHorizontalRibbw").setSelected(false);
            this.getView().byId("rbtHorizontalIml").setSelected(false);
            this.getView().byId("inpHorizontalStation").setValue();
            this.getView().byId("inpHorizontalRib").setValue();
            this.getView().byId("inpHorizontalStation1").setValue();
            this.getView().byId("inpHorizontalRib1").setValue();

            this.getView().byId("chbPlyonStation").setSelected(false);
            this.getView().byId("chbPlyonBLine").setSelected(false);
            this.getView().byId("chbPlyonWLine").setSelected(false);
            this.getView().byId("chbPlyonOmlIml").setSelected(false);
            this.getView().byId("rbtPlyonStationat").setSelected(false);
            this.getView().byId("rbtPlyonBLineat").setSelected(false);
            this.getView().byId("rbtPlyonWLineat").setSelected(false);
            this.getView().byId("rbtPlyonOml").setSelected(false);
            this.getView().byId("rbtPlyonStationbw").setSelected(false);
            this.getView().byId("rbtPlyonBLinebw").setSelected(false);
            this.getView().byId("rbtPlyonIml").setSelected(false);
            this.getView().byId("inpPlyonStation").setValue();
            this.getView().byId("inpPlyonBLine").setValue();
            this.getView().byId("inpPlyonWLine").setValue();
            this.getView().byId("rbtPlyonBLineL").setSelected(false);
            this.getView().byId("rbtPlyonBLineR").setSelected(false);
            this.getView().byId("inpPlyonStation1").setValue();
            this.getView().byId("inpPlyonBLine1").setValue();
            this.getView().byId("inpPlyonWLine1").setValue();
            this.getView().byId("rbtPlyonBLineL1").setSelected(false);
            this.getView().byId("rbtPlyonBLineR1").setSelected(false);

            this.getView().byId("chbOthersLhsRhs").setSelected(false);
            this.getView().byId("chbOthersFStation").setSelected(false);
            this.getView().byId("chbOthersBLine").setSelected(false);
            this.getView().byId("chbOthersWLine").setSelected(false);
            this.getView().byId("chbOthersOmlIml").setSelected(false);
            this.getView().byId("rbtOthersLhsRhsL").setSelected(false);
            this.getView().byId("rbtOthersFStationat").setSelected(false);
            this.getView().byId("rbtOthersBLineat").setSelected(false);
            this.getView().byId("rbtOthersWLineat").setSelected(false);
            this.getView().byId("rbtOthersOml").setSelected(false);
            this.getView().byId("rbtOthersLhsRhsR").setSelected(false);
            this.getView().byId("rbtOthersFStationbw").setSelected(false);
            this.getView().byId("rbtOthersBLinebw").setSelected(false);
            this.getView().byId("rbtOthersWLinebw").setSelected(false);
            this.getView().byId("rbtOthersIml").setSelected(false);
            this.getView().byId("inpOthersFStation").setValue();
            this.getView().byId("inpOthersBLine").setValue();
            this.getView().byId("inpOthersWLine").setValue();
            this.getView().byId("rbtOthersBLineL").setSelected(false);
            this.getView().byId("rbtOthersBLineR").setSelected(false);
            this.getView().byId("inpOthersFStation1").setValue();
            this.getView().byId("inpOthersBLine1").setValue();
            this.getView().byId("inpOthersWLine1").setValue();
            this.getView().byId("rbtOthersBLineL1").setSelected(false);
            this.getView().byId("rbtOthersBLineR1").setSelected(false);
        },

        headerSingoffDetails: function () {
            var oDataModel = this.getOwnerComponent().getModel();
            var oheaderSingoffModel = new JSONModel();
            var odiscSingoffModel = new JSONModel();
            var workgrp = this.getView().byId("idworkgroup").getText();
            //  var oFilterPart = [];
            // oFilterPart.push(new Filter("Notification", FilterOperator.EQ, sObjectId));
            //var sPath = "/SignOffSet(Notification='"+sObjectId+"',DiscrepancyNo='0100',WorkGroup='"+workgrp+"')";
            var sPath = "/SignOffSet(Notification='" + sObjectId + "',WorkGroup='" + workgrp + "')";
            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_headersignoff,to_discsignoff"
                },
                success: function (oData, oResult) {
                    var headerSignOffData = oData.to_headersignoff.results;
                    var discrpncySignOffData = oData.to_discsignoff.results;
                    oheaderSingoffModel.setData(headerSignOffData);
                    odiscSingoffModel.setData(discrpncySignOffData);
                    this.getView().byId("idTabHeaderSingoff").setModel(oheaderSingoffModel, "HeaderSignOffDetails");
                    this.getView().byId("idTabDiscSingoff").setModel(odiscSingoffModel, "DiscrepancySignOffDetails");
                    sap.ui.core.BusyIndicator.hide();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onHeadersingoffAR: function (oEvent) {
            this._oHeadersingoffARDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.hedersingoffAR", this);
            this.getView().addDependent(this._oHeadersingoffARDialog);
            this._oHeadersingoffARDialog.open();
            this.oHeadersingoffAR = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oDataModel = this.getOwnerComponent().getModel();
            var oheaderSingoffModelAR = new JSONModel();
            var oFilterPart = [];
            oFilterPart.push(new Filter("Key", FilterOperator.EQ, "SIGNOFFAR"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilterPart,
                success: function (oData, oResult) {
                    var data = oData.results;
                    oheaderSingoffModelAR.setData(data);
                    this._oHeadersingoffARDialog.setModel(oheaderSingoffModelAR, "oHeaderSingoffAR");
                    sap.ui.core.BusyIndicator.hide();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },
       

        _configSingoffARDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oHeadersingoffAR;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oHeadersingoffARDialog.destroy();

        },

        _handleSingoffARClose: function () {
            this._oHeadersingoffARDialog.close();

        },

        onHeadersingoffStatus: function (oEvent) {
            this._oHeadersingoffStatusDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.hedersingoffStatus", this);
            this.getView().addDependent(this._oHeadersingoffStatusDialog);
            this._oHeadersingoffStatusDialog.open();
            this.oHeadersingoffStatus = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oDataModel = this.getOwnerComponent().getModel();
            var oheaderSingoffModelStatus = new JSONModel();
            var oFilterPart = [];
            oFilterPart.push(new Filter("Key", FilterOperator.EQ, "SIGNOFFSTATUS"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilterPart,
                success: function (oData, oResult) {
                    var data = oData.results;
                    oheaderSingoffModelStatus.setData(data);
                    this._oHeadersingoffStatusDialog.setModel(oheaderSingoffModelStatus, "oHeaderSingoffStatus");
                    sap.ui.core.BusyIndicator.hide();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configSingoffStatusDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oHeadersingoffStatus;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oHeadersingoffStatusDialog.destroy();

        },

        _handleSingoffStatusClose: function () {
            this._oHeadersingoffStatusDialog.close();
        },

        onDiscsingoffdiscno: function (oEvent) {
            this._oDiscrepancysingoffdnoDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DiscNo", this);
            this.getView().addDependent(this._oDiscrepancysingoffdnoDialog);
            this._oDiscrepancysingoffdnoDialog.open();
            this.oDiscrepancysingoffdnoDialog = oEvent.getSource();
            
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                var oDataModel = this.getOwnerComponent().getModel();
                var sPath = "/CreateNotificationHeaderSet('" +sObjectId+"')";
                oDataModel.read(sPath, {
                    urlParameters: {
                        "$expand": "to_discrepancy"
                    },
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.to_discrepancy.results;
                        oModel.setData(data);
                        this._oDiscrepancysingoffdnoDialog.setModel(oModel, "oDiscreSingoffDNO");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
                                       
        },
        _configSingoffdnoDialog:function(oEvent){
            var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.oDiscrepancysingoffdnoDialog;
       if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }
        oInput.setValue(oSelectedItem.getTitle());
        this._oDiscrepancysingoffdnoDialog.destroy();
       },
		_handleSingoffDNOClose:function(){
            this._oDiscrepancysingoffdnoDialog.close();
        },


        onAddHeaderSignOffLineItem: function () {
            var oHeaderSignOffTable = this.getView().byId("idTabHeaderSingoff");
            var oHeaderSignOffTableModel = oHeaderSignOffTable.getModel("HeaderSignOffDetails").getData();
            if (oHeaderSignOffTableModel.length === 0) {
                oHeaderSignOffTableModel.push({
                    "SignOffGroup": "",
                    "User": "",
                    "SignOffNote": "",
                    "ActionCode": "",
                    "DateInQueue": "",
                    "ActualStart": "",
                    "FinishDate": "",
                    "Status": "",
                    "AR": "",
                    "Comments": "",
                    "Sequence": "",
                    "StatusText": "",
                    "WorkGroup": ""
                });
                oHeaderSignOffTable.getModel("HeaderSignOffDetails").setData(oHeaderSignOffTableModel);
            } else if (oHeaderSignOffTableModel.length > 0) {
                var userFlag = false, sHeaderSignOffUser;
                for (var i = 0; i < oHeaderSignOffTableModel.length; i++) {
                    sHeaderSignOffUser = oHeaderSignOffTableModel[i].User;
                    if (sHeaderSignOffUser === "") {
                        userFlag = false;
                        break;
                    } else {
                        userFlag = true;
                    }
                }
                if (userFlag === false) {
                    var sHeaderSignOffAddItemMsg = this.getView().getModel("i18n").getProperty("HeaderSignOffAddItemMsg");
                    MessageBox.warning(sHeaderSignOffAddItemMsg);
                } else {
                    oHeaderSignOffTableModel.push({
                        "SignOffGroup": "",
                        "User": "",
                        "SignOffNote": "",
                        "ActionCode": "",
                        "DateInQueue": "",
                        "ActualStart": "",
                        "FinishDate": "",
                        "Status": "",
                        "AR": "",
                        "Comments": "",
                        "Sequence": "",
                        "StatusText": "",
                        "WorkGroup": ""
                    });
                    oHeaderSignOffTable.getModel("HeaderSignOffDetails").setData(oHeaderSignOffTableModel);
                }
            }
        },

        onAddDiscSignOffLineItem: function () {
            var oDiscSignOffTable = this.getView().byId("idTabDiscSingoff");
            var oDiscSignOffTableModel = oDiscSignOffTable.getModel("DiscrepancySignOffDetails").getData();
            if (oDiscSignOffTableModel.length === 0) {
                oDiscSignOffTableModel.push({
                    "SignOffGroup": "",
                    "DiscrepancyNo": "",
                    "User": "",
                    "SignOffNote": "",
                    "ActionCode": "",
                    "DateInQueue": "",
                    "ActualStart": "",
                    "FinishDate": "",
                    "Status": "",
                    "AR": "",
                    "Comments": "",
                    "Sequence": "",
                    "StatusText": "",
                    "WorkGroup": ""
                });
                oDiscSignOffTable.getModel("DiscrepancySignOffDetails").setData(oDiscSignOffTableModel);
            } else if (oDiscSignOffTableModel.length > 0) {
                var userFlag = false, sDiscSignOffUser;
                for (var i = 0; i < oDiscSignOffTableModel.length; i++) {
                    sDiscSignOffUser = oDiscSignOffTableModel[i].User;
                    if (sDiscSignOffUser === "") {
                        userFlag = false;
                        break;
                    } else {
                        userFlag = true;
                    }
                }
                if (userFlag === false) {
                    var sDiscSignOffAddItemMsg = this.getView().getModel("i18n").getProperty("DiscSignOffAddItemMsg");
                    MessageBox.warning(sDiscSignOffAddItemMsg);
                } else {
                    oDiscSignOffTableModel.push({
                        "SignOffGroup": "",
                        "User": "",
                        "SignOffNote": "",
                        "ActionCode": "",
                        "DateInQueue": "",
                        "ActualStart": "",
                        "FinishDate": "",
                        "Status": "",
                        "AR": "",
                        "Comments": "",
                        "Sequence": "",
                        "StatusText": "",
                        "WorkGroup": ""
                    });
                    oDiscSignOffTable.getModel("HeaderSignOffDetails").setData(oDiscSignOffTableModel);
                }
            }
        },

        onDeleteHeaderSignOffLineItem: function (oEvent) {
            sap.ui.core.BusyIndicator.show();
            var oModel = this.getOwnerComponent().getModel();
            var oHeaderSignoffTab = this.getView().byId("idTabHeaderSingoff");
            var oHeaderSignOffTableModel = oHeaderSignoffTab.getModel("HeaderSignOffDetails").getData();
            var oBindingContexts = oEvent.getSource().getParent().oBindingContexts['HeaderSignOffDetails'];
            var index = oBindingContexts.sPath.split('/')[1];
            var notification = oHeaderSignOffTableModel[index].Notification;
            var signoffgroup = oHeaderSignOffTableModel[index].SignOffGroup;
            var sequence = oHeaderSignOffTableModel[index].Sequence;
            var workgroup = oHeaderSignOffTableModel[index].WorkGroup;

            if (sequence != "") {
                sap.ui.core.BusyIndicator.hide();
                var sDeleteConfirm = this.getView().getModel("i18n").getProperty("DleteConfirm");
                MessageBox.confirm(
                    sDeleteConfirm, {
                    icon: MessageBox.Icon.CONFRIRMATION,
                    title: "Confirmation",
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.CANCEL,
                    initialFocus: MessageBox.Action.CANCEL,
                    onClose: function (sAction) {
                        if (sAction == MessageBox.Action.OK) {
                           // oModel.remove("/HeaderSignOffSet(Notification ='" + notification + "', SignOffGroup ='" + signoffgroup + "', Sequence = '" + sequence + "', WorkGroup ='" + workgroup + "')", {
                            var payload = "/HeaderSignOffSet(Notification ='" + notification + "', SignOffGroup ='" + signoffgroup + "', Sequence = '" + sequence + "', WorkGroup ='" + workgroup + "')";
                            oModel.remove(payload, {
                                method: "DELETE",  
                           success: function (response) {
                                    // sap.ui.core.BusyIndicator.hide();
                                    if (response.headers["sap-message"]) {
                                        var sMessg = JSON.parse(response.headers["sap-message"]).message;
                                        MessageBox.success(sMessg);
                                    }
                                    oModel.refresh();
                                    this.headerSingoffDetails();
                                },
                                error: function (oError) {
                                    //sap.ui.core.BusyIndicator.hide();
                                    //var msg = JSON.parse(oError.responseText).error.message.value;
                                    var msg = oError.message;
                                    MessageBox.error(msg);
                                }
                            });
                        }
                    }.bind(this)
                });
            } else {
                sap.ui.core.BusyIndicator.hide();
                var sNoSeqMessg = this.getView().getModel("i18n").getProperty("NoSeqMessg");
                MessageBox.warning(sNoSeqMessg);
            }
        },

        onDeleteDiscSignOffLineItem: function (oEvent) {
            sap.ui.core.BusyIndicator.show();
            var oModel = this.getOwnerComponent().getModel();
            var oDiscSignOffTab = this.getView().byId("idTabDiscSingoff");
            var oDiscSignOffTableModel = oDiscSignOffTab.getModel("DiscrepancySignOffDetails").getData();
            var oBindingContexts = oEvent.getSource().getParent().oBindingContexts['DiscrepancySignOffDetails'];
            var index = oBindingContexts.sPath.split('/')[1];
            var notification = oDiscSignOffTableModel[index].Notification;
            var signoffgroup = oDiscSignOffTableModel[index].SignOffGroup;
            var sequence = oDiscSignOffTableModel[index].Sequence;
            var workgroup = oDiscSignOffTableModel[index].WorkGroup;

            if (sequence != "") {
                sap.ui.core.BusyIndicator.hide();
                var sDeleteConfirm = this.getView().getModel("i18n").getProperty("DleteConfirm");
                MessageBox.confirm(
                    sDeleteConfirm, {
                    icon: MessageBox.Icon.CONFRIRMATION,
                    title: "Confirmation",
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.CANCEL,
                    initialFocus: MessageBox.Action.CANCEL,
                    onClose: function (sAction) {
                        if (sAction == MessageBox.Action.OK) {
                         var payload= "/DiscSignOffSet(Notification ='" + notification + "', SignOffGroup ='" + signoffgroup + "', Sequence = '" + sequence + "', WorkGroup ='" + workgroup + "')";
                            oModel.remove(payload, {
                                method: "DELETE",
                                success: function (response) {
                                    //sap.ui.core.BusyIndicator.hide();
                                    if (response.headers["sap-message"]) {
                                        var sMessg = JSON.parse(response.headers["sap-message"]).message;
                                        MessageBox.success(sMessg);
                                    }
                                    oModel.refresh();
                                    this.headerSingoffDetails();
                                },
                                error: function (oError) {
                                    //sap.ui.core.BusyIndicator.hide();
                                    //var msg = JSON.parse(oError.responseText).error.message.value;
                                    var msg = oError.message;
                                    MessageBox.error(msg);
                                }
                            });
                        }
                    }.bind(this)
                });
            } else {
                sap.ui.core.BusyIndicator.hide();
                var sNoSeqMessg = this.getView().getModel("i18n").getProperty("NoSeqMessg");
                MessageBox.warning(sNoSeqMessg);
            }
        },

        // discSingoffDetails: function () {
        //     var oDataModel = this.getOwnerComponent().getModel();
        //     var odiscSingoffModel = new JSONModel();
        //     var oFilterPart = [];
        //     oFilterPart.push(new Filter("Notification", FilterOperator.EQ, sObjectId));
        //     var sPath = "/DiscSignOffSet"
        //     oDataModel.read(sPath, {
        //         filters: oFilterPart,
        //         success: function (oData, oResult) {
        //             var data = oData.results;
        //             odiscSingoffModel.setData(data);
        //             this.getView().setModel(odiscSingoffModel, "oDiscSingoff");
        //             sap.ui.core.BusyIndicator.hide();
        //         }.bind(this),
        //         error: function (oError) {
        //             sap.ui.core.BusyIndicator.hide();
        //             var msg = JSON.parse(oError.responseText).error.message.value;
        //             MessageBox.error(msg);
        //         }
        //     });
        // },

        onPressPrint: function () {
            // var ctrlstring = "width=500px,height=500px";
            // var wind = window.open("", "PrintWindow", ctrlstring);
            //	var hContent = '<html><head></head><body>';

            /*var print_Url = $.sap.getModulePath("com", "/css/");
            var printCssUrl = print_Url + "style.css";
            // var hContent = '<html><head><link rel="stylesheet" href=' + printCssUrl + ' type="text/css" /></head><body>';
            var bodyContent = $(".printAreaBox").html();
            var closeContent = "</body></html>";
            var htmlpage = hContent + bodyContent + closeContent;

            var win = window.open("", "PrintWindow");
            win.document.write(htmlpage);
            win.print();
            win.stop();*/
            window.print();

        },

        handleSwitchWorkGroup: function () {
            var oView = this.getView(),
                oButton = oView.byId("btnWorkGrp");
            if (!this._oMenuFragment) {
                this._oMenuFragment = Fragment.load({
                    id: oView.getId(),
                    name: "com.airbus.ZQM_NCR.fragments.Workgroup",
                    controller: this
                }).then(function (oMenu) {
                    this.configWorkGroupMenu();
                    oMenu.openBy(oButton);
                    this._oMenuFragment = oMenu;
                    return this._oMenuFragment;
                }.bind(this));
            } else {
                this._oMenuFragment.openBy(oButton);
            }
        },

        configWorkGroupMenu: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/UserWorkGroupS";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oMenuFragment.setModel(oModel, "WrkGrpModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onMenuAction: function (oEvent) {
            var oItem = oEvent.getParameter("item"),
                sItemPath = "";
            while (oItem instanceof MenuItem) {
                sItemPath = oItem.getText() + " > " + sItemPath;
                oItem = oItem.getParent();
            }
            sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));
            // sap.m.MessageToast.show("The selected Workgroup is " + sItemPath);
            this.getView().byId("idworkgroup").setText(sItemPath);
        },

        onNotesChange1: function (oEvent) {
            // var oCtx = oEvent.getSource().getBindingContext(),
            var oCtx = oEvent.getParameters()._userInputValue,
                oControl = oEvent.getSource(),
                oView = this.getView();

            // create popover
            if (!this._pPopover) {
                this._pPopover = Fragment.load({
                    id: oView.getId(),
                    name: "com.airbus.ZQM_NCR.fragments.notespopup",
                    controller: this
                }).then(function (oPopover) {
                    oView.addDependent(oPopover);
                    oPopover.attachAfterOpen(function () {
                        this.disablePointerEvents();
                    }, this);
                    oPopover.attachAfterClose(function () {
                        this.enablePointerEvents();
                    }, this);
                    return oPopover;
                }.bind(this));
            }
            this._pPopover.then(function (oPopover) {
                //	oPopover.bindElement(oCtx);
                oPopover.mAggregations.content[0].setValue(oCtx);
                oPopover.openBy(oControl);
            });
            //	sap.ui.getCore().byId("idnotes").setText(oCtx);
        },
        disablePointerEvents: function () {
            this.byId("idsingoff1").getDomRef().style["pointer-events"] = "none";
        },

        enablePointerEvents: function () {
            this.byId("idsingoff1").getDomRef().style["pointer-events"] = "auto";
        },
        onEnterText: function (oEvent) {
            var text = oEvent.getParameters().value;
            if (text.lenth == 0 || text == "") {
                oEvent.getSource().setValueHelpIconSrc("sap-icon://document-text");

            } else {
                oEvent.getSource().setValueHelpIconSrc("sap-icon://request");
            }
        },
        //data coming from backend then write validation
        onformatterText: function (text) {
            if (text.lenth == 0 || text == "") {
                var htext = "sap-icon://document-text";
            } else {
                htext = "sap-icon://request";
            }
            return htext;
        },
        handleActionPress: function () {
            // note: We don't need to chain to the _pPopover promise, since this event-handler
            // is only called from within the loaded dialog itself.
            this.byId("myPopover").close();
            //sap.m.MessageToast.show("Action has been pressed");
        },

        onCopyDiscrepancy: function () {
            // if (!this.oDialog) {
            //     this.Dialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.copydiscrepancy", this);
            //     this.getView().addDependent(this.oDialog);
            // }
            // this.Dialog.open();
        },

        onAddDiscrepancy: function () {
            if (!this.oDialog) {
                this.Dialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.adddiscrepancy", this);
                this.getView().addDependent(this.oDialog);
            }
            this.Dialog.open();
        },

        onChangeSN: function onChangeSN() {
            var model = this.getOwnerComponent().getModel("json");
            var gdata = model.getProperty("/data");
            var sn = this.getView().byId("idInputSN");
            var list = this.getView().byId("list").getItems();
            var that = this;
            var huValue = "";
            var SNModel = new JSONModel([]);
            var _snArr = [];
            if (sn.getValue().trim() !== "") {
                huValue = sn.getValue().trim();
            }
            _snArr.push({
                SN: sn.getValue().toUpperCase(),
            });

            if (gdata === null || gdata == undefined) {
                var finaldata = _snArr;
            } else {
                finaldata = _snArr.concat(gdata);

            }
            model.setProperty("/data", finaldata);
            SNModel.setData(finaldata);
            this.getView().byId("list").setModel(SNModel);
            sn.setValue();
        },

        handleDelete: function (oEvent) {
            /*	var oList = oEvent.getSource(),
                    oItem = oEvent.getParameter("listItem"),
                    sPath = oItem.getBindingContext().getPath();
                    var _selIndex = oEvent
                        .getParameter("listItem")
                        .getBindingContextPath()
                        .substr(1);*/
            // after deletion put the focus back to the list
            //	oList.attachEventOnce("updateFinished", oList.focus, oList);
            var _selIndex = oEvent.getParameters().id[oEvent.getParameters().id.length - 1];
            var _snArr = this.getOwnerComponent().getModel("json").getProperty("/data");

            _snArr.splice(_selIndex, 1);
            this.getOwnerComponent().getModel().setProperty("/data", _snArr);
            var SNModel = new JSONModel([]);
            SNModel.setData(_snArr);
            this.getView().byId("list").setModel(SNModel);

        },
        onPressCancel: function () {
            //	this.getView().byId("ncrcreatecopy").setVisible(true);
            this.getView().byId("SimpleFormChange480_12120Dual").setVisible(true);
            this.getView().byId("idIconTabBarHeader").setVisible(false);
            this.getView().byId("idsave").setVisible(false);
            this.getView().byId("idcancel").setVisible(false);
            this.getView().byId("idncrsave").setVisible(true);
            this.getView().byId("idncrcancel").setVisible(true);
            this.getView().byId("page").setTitle("NC Creation");
            this.getView().byId("idheader").setVisible(false);
        },

        onNcrPressCancel: function () {
            /*	this.getView().byId("idlink").setValue();
                this.getView().byId("idlink").setVisible(false);
                this.getView().byId("idin").setValue();
                this.getView().byId("idpono").setValue();
                this.getView().byId("idporder").setValue();
                this.getView().byId("idworkinst").setValue();
                this.getView().byId("idworkorder").setValue();
                this.getView().byId("idlast").setValue();
                this.getView().byId("idncr").setValue();*/
            if ((this.workingQueueMode === "EDIT") || (this.workingQueueMode === "COPY")) {
                var modeData = {};
                modeData.ModeBtn = "CANCEL";
                var modeModel = new JSONModel();
                modeModel.setData(modeData);
                sap.ui.getCore().setModel(modeModel, "cancelModel");

                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "zwrkque",
                        action: "display"
                    }
                })) || "";
                oCrossAppNavigator.toExternal({
                    target: {
                        shellHash: hash
                    }
                });
            }else if((this.workingQueueMode === "BUYEDIT")){
                var modeData = {};
                modeData.ModeBtn = "CANCEL";
                var modeModel = new JSONModel();
                modeModel.setData(modeData);
                sap.ui.getCore().setModel(modeModel, "cancelModel");

                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "zbuyoffqueue",
                        action: "display"
                    }
                })) || "";
                oCrossAppNavigator.toExternal({
                    target: {
                        shellHash: hash
                    }
                });

            }else if (this.oAppMode === "NETLIST") {
                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "zncretreivelist",
                        action: "display"
                    }
                })) || "";
                oCrossAppNavigator.toExternal({
                    target: {
                        shellHash: hash
                    }
                });
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                this.getView().byId("idIconTabBarHeader").setSelectedKey("Hdata");
                this.handleIconbarSelect();
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Dispo") {
                this.getView().byId("idIconTabBarHeader").setSelectedKey("Hdata");
                this.handleIconbarSelect();
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Purchase") {
                this.getView().byId("idIconTabBarHeader").setSelectedKey("Hdata");
                this.handleIconbarSelect();
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Signoff") {
                this.getView().byId("idIconTabBarHeader").setSelectedKey("Hdata");
                this.handleIconbarSelect();
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "log") {
                this.getView().byId("idIconTabBarHeader").setSelectedKey("Hdata");
                this.handleIconbarSelect();
            } else {
                this.getOwnerComponent().getRouter().navTo("TargetMain");
                this.getView().byId("idCombNcType").setValue();
                this.getView().byId("idCombInWhArea").setValue();
                this.getView().byId("idPlntCodeHdr").setValue();
                this.getView().byId("idInpProdCode").setValue();
                this.getView().byId("idInpWrkIns").setValue();
                this.getView().byId("idInpPrdOrd").setValue();
                this.getView().byId("idInpSupNC").setValue();
                this.getView().byId("idInpSupBy").setValue();
                this.getView().byId("idInpRefNC").setValue();
                this.getView().byId("idInpAircraft").setValue();
                this.getView().byId("idMNInputSN").removeAllTokens();
                this.getView().byId("idMNInputTN").removeAllTokens();
                this.getView().byId("idInpNCCrtBy").removeAllTokens();
                this.getView().byId("idInpNCDetAt").removeAllTokens();
                this.getView().byId("idInpBinLoc").setValue();
                this.getView().byId("idInpDrpPt").setValue();
                /**Cancelling Values in Purchase Info*/
                this.getView().byId("idPurInfPurOrdip").setValue();
                this.getView().byId("idPurInfPolnip").setValue();
                this.getView().byId("idPurInfSupSCip").setValue();
                this.getView().byId("idPurInfSupNmip").setValue();
                this.getView().byId("idPurInfSupPnip").setValue();
                this.getView().byId("idPurInfMrpcrip").setValue();
                this.getView().byId("idPurInfMrpcrnmip").setValue();
                this.getView().byId("idPurInfPcgslip").setValue();
                this.getView().byId("idPurInfWBNip").setValue();
                this.getView().byId("idPurInfGrip").setValue();
                this.getView().byId("idPurInfGrQtyip").setValue();
                this.getView().byId("idInpPurInfGritm").setValue();
                this.getView().byId("idInpPurInfGryr").setValue();
                this.getView().byId("idPurInfGrUom").setValue();
            }

        },

        onNcrPressSave: function () {
            //this.getView().byId("ncrcreatecopy").setVisible(false);
            //this.getView().byId("SimpleFormChange480_12120Dual").setVisible("false");
            //this.getView().byId("idIconTabBarHeader").setVisible(true);
            //this.getView().byId("idsave").setVisible(true);
            //this.getView().byId("idcancel").setVisible(true);
            //this.getView().byId("idncrsave").setVisible(false);
            //this.getView().byId("idncrcancel").setVisible(false);
            //this.getView().byId("page").setTitle("NC F721000007");
            //this.getView().byId("idheader").setVisible(true);

            //Manadatory Validations for Prchase info input fields - Added by Venkata 09.09.2022- Code Start
            // var Gr = this.getView().byId("idPurInfGrip").getValue();
            // if (Gr === "") {
            //     this.getView().byId("idPurInfGrip").setValueState("Error");
            //     this.getView().byId("idPurInfGrip").setValueStateText("Please Enetre GR# Value");
            // }
            // else {
            //     this.getView().byId("idPurInfGrip").setValueState("None");
            //     this.getView().byId("idPurInfGrip").setValueStateText();
            // }
            // var GrQty = this.getView().byId("idPurInfGrQtyip").getValue();
            // if (GrQty === "") {
            //     this.getView().byId("idPurInfGrQtyip").setValueState("Error");
            //     this.getView().byId("idPurInfGrQtyip").setValueStateText("Please Enetre GR Qty Value");
            // }
            // else {
            //     this.getView().byId("idPurInfGrQtyip").setValueState("None");
            //     this.getView().byId("idPurInfGrQtyip").setValueStateText();
            // }

            // var PurchOrd = this.getView().byId("idPurInfPurOrdip").getValue();
            // if (PurchOrd === "") {
            //     this.getView().byId("idPurInfPurOrdip").setValueState("Error");
            //     this.getView().byId("idPurInfPurOrdip").setValueStateText("Please enter Purchase Order Value");
            // } else {
            //     this.getView().byId("idPurInfPurOrdip").setValueState("None");
            //     this.getView().byId("idPurInfPurOrdip").setValueStateText();
            // }

            // var PurchOrdLin = this.getView().byId("idPurInfPolnip").getValue();
            // if (PurchOrdLin === "") {
            //     this.getView().byId("idPurInfPolnip").setValueState("Error");
            //     this.getView().byId("idPurInfPolnip").setValueStateText("Please Enter PO Line Number");

            // } else {
            //     this.getView().byId("idPurInfPolnip").setValueState("None");
            //     this.getView().byId("idPurInfPolnip").setValueStateText();
            // }

            // var Podt = this.getView().byId("idPurInfPoDtdp").getValue();
            // if (Podt === "") {
            //     this.getView().byId("idPurInfPoDtdp").setValueState("Error");
            //     this.getView().byId("idPurInfPoDtdp").setValueStateText("Please Enter PO Date");
            // } else {
            //     this.getView().byId("idPurInfPoDtdp").setValueState("None");
            //     this.getView().byId("idPurInfPoDtdp").setValueStateText();
            // }

            // var SuppName = this.getView().byId("idPurInfSupNmip").getValue();
            // if (SuppName === "") {
            //     this.getView().byId("idPurInfSupNmip").setValueState("Error");
            //     this.getView().byId("idPurInfSupNmip").setValueStateText("Please Enter Supplier Name");
            // } else {
            //     this.getView().byId("idPurInfSupNmip").setValueState("None");
            //     this.getView().byId("idPurInfSupNmip").setValueStateText();
            // }

            // var Suppsapcode = this.getView().byId("idPurInfSupSCip").getValue();
            // if (Suppsapcode === "") {
            //     this.getView().byId("idPurInfSupSCip").setValueState("Error");
            //     this.getView().byId("idPurInfSupSCip").setValueStateText("Please Enter Supplier SAP Code");
            // } else {
            //     this.getView().byId("idPurInfSupSCip").setValueState("None");
            //     this.getView().byId("idPurInfSupSCip").setValueStateText();
            // }

            // var Supppartnum = this.getView().byId("idPurInfSupPnip").getValue();
            // if (Supppartnum === "") {
            //     this.getView().byId("idPurInfSupPnip").setValueState("Error");
            //     this.getView().byId("idPurInfSupPnip").setValueStateText("Please Enter Supplier Part Number");
            // } else {
            //     this.getView().byId("idPurInfSupPnip").setValueState("None");
            //     this.getView().byId("idPurInfSupPnip").setValueStateText();
            // }

            // var MRPController = this.getView().byId("idPurInfMrpcrip").getValue();
            // if (MRPController === "") {
            //     this.getView().byId("idPurInfMrpcrip").setValueState("Error");
            //     this.getView().byId("idPurInfMrpcrip").setValueStateText("Please Enter MRP Controller");
            // } else {
            //     this.getView().byId("idPurInfMrpcrip").setValueState("None");
            //     this.getView().byId("idPurInfMrpcrip").setValueStateText();
            // }

            // var MRPControllerName = this.getView().byId("idPurInfMrpcrnmip").getValue();
            // if (MRPControllerName === "") {
            //     this.getView().byId("idPurInfMrpcrnmip").setValueState("Error");
            //     this.getView().byId("idPurInfMrpcrnmip").setValueStateText("Please Enter MRP Controller Name");
            // } else {
            //     this.getView().byId("idPurInfMrpcrnmip").setValueState("None");
            //     this.getView().byId("idPurInfMrpcrnmip").setValueStateText();
            // }

            // var WBN = this.getView().byId("idPurInfWBNip").getValue();
            // if (WBN === "") {
            //     this.getView().byId("idPurInfWBNip").setValueState("Error");
            //     this.getView().byId("idPurInfWBNip").setValueStateText("Please Enter Way Bill No.");
            // } else {
            //     this.getView().byId("idPurInfWBNip").setValueState("None");
            //     this.getView().byId("idPurInfWBNip").setValueStateText();
            // }

            // var PckgSlp = this.getView().byId("idPurInfPcgslip").getValue();
            // if (PckgSlp === "") {
            //     this.getView().byId("idPurInfPcgslip").setValueState("Error");
            //     this.getView().byId("idPurInfPcgslip").setValueStateText("Please Enter Packaging Slip Value");
            // } else {
            //     this.getView().byId("idPurInfPcgslip").setValueState("None");
            //     this.getView().byId("idPurInfPcgslip").setValueStateText();
            // }

            // var WBN2 = this.getView().byId("idPurInfWBN2ip").getValue();
            // if (WBN2 === "") {
            //     this.getView().byId("idPurInfWBN2ip").setValueState("Error");
            //     this.getView().byId("idPurInfWBN2ip").setValueStateText("Please Enter Way Bill No.");
            // } else {
            //     this.getView().byId("idPurInfWBN2ip").setValueState("None");
            //     this.getView().byId("idPurInfWBN2ip").setValueStateText();
            // }

            // var PckgSlp2 = this.getView().byId("idPurInfPcgsl2ip").getValue();
            // if (PckgSlp2 === "") {
            //     this.getView().byId("idPurInfPcgsl2ip").setValueState("Error");
            //     this.getView().byId("idPurInfPcgsl2ip").setValueStateText("Please Enter Packaging Slip Value");
            // } else {
            //     this.getView().byId("idPurInfPcgsl2ip").setValueState("None");
            //     this.getView().byId("idPurInfPcgsl2ip").setValueStateText();
            // }

            // var Po = this.getView().byId("idPurInfPOip").getValue();
            // if (Po === "") {
            //     this.getView().byId("idPurInfPOip").setValueState("Error");
            //     this.getView().byId("idPurInfPOip").setValueStateText("Please Enter PO# Value");
            // } else {
            //     this.getView().byId("idPurInfPOip").setValueState("None");
            //     this.getView().byId("idPurInfPOip").setValueStateText();
            // }

            // var OutboundDelivery = this.getView().byId("idPurInfOutDelip").getValue();
            // if (OutboundDelivery === "") {
            //     this.getView().byId("idPurInfOutDelip").setValueState("Error");
            //     this.getView().byId("idPurInfOutDelip").setValueStateText("Please Enter Outbound Delivery Value");
            // } else {
            //     this.getView().byId("idPurInfOutDelip").setValueState("None");
            //     this.getView().byId("idPurInfOutDelip").setValueStateText();
            // }

            // var RMA = this.getView().byId("idPurInfRMAip").getValue();
            // if (RMA === "") {
            //     this.getView().byId("idPurInfRMAip").setValueState("Error");
            //     this.getView().byId("idPurInfRMAip").setValueStateText("Please Enter RMA Value");
            // } else {
            //     this.getView().byId("idPurInfRMAip").setValueState("None");
            //     this.getView().byId("idPurInfRMAip").setValueStateText();
            // }

            // var RelNot = this.getView().byId("idPurInfRelNoteip").getValue();
            // if (RelNot === "") {
            //     this.getView().byId("idPurInfRelNoteip").setValueState("Error");
            //     this.getView().byId("idPurInfRelNoteip").setValueStateText("Please Enter Release Note");
            // } else {
            //     this.getView().byId("idPurInfRelNoteip").setValueState("None");
            //     this.getView().byId("idPurInfRelNoteip").setValueStateText();
            // }
            //Manadatory Validations for Prchase info input fields - Added by Venkata 09.09.2022 - Code End

            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                var oNCType = this.getView().byId("idCombNcType").getValue();
                if (oNCType == "SUPPLIER" && this.getView().byId("idMNInputSN").getTokens().length === 0 && this.getView().byId("idMNInputTN").getTokens().length === 0) {
                    var oNcrSaveTrcMsg = this.getView().getModel("i18n").getProperty("NCSaveTrcMsg");
                    MessageBox.warning(oNcrSaveTrcMsg);
                } else if (Number(this.getOwnerComponent().getModel("NCSaveModel").getData().Category) == "002" || this.getView().byId("idInpWrkIns").getValue() !== "") {
                    if (this.getView().byId("idInpAircraft").getValue() !== "") {
                        this.getView().byId("idInpAircraft").setValueState("None");
                        this.getView().byId("idInpAircraft").setValueStateText("");
                        this.updateHeaderData();
                    } else {
                        var oNcrSaveFldMsg = this.getView().getModel("i18n").getProperty("NCSaveFieldMsg");
                        MessageBox.information(oNcrSaveFldMsg);
                        this.getView().byId("idInpAircraft").setValueState("Error");
                        this.getView().byId("idInpAircraft").setValueStateText("Please Enter Aircraft Number");
                    }
                } else {
                    this.updateHeaderData();
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Purchase") {
                var oNCType = this.getView().byId("idCombNcType").getValue();
                if (oNCType == "SUPPLIER") {
                    var updateFlag = true;

                    if (this.getView().byId("idPurInfPurOrdip").getValue() !== "") {
                        this.getView().byId("idPurInfPurOrdip").setValueState("None");
                        this.getView().byId("idPurInfPurOrdip").setValueStateText("");
                    } else {
                        this.getView().byId("idPurInfPurOrdip").setValueState("Error");
                        this.getView().byId("idPurInfPurOrdip").setValueStateText("Please Enter Purchase Order");
                        updateFlag = false;
                    }

                    if (this.getView().byId("idPurInfPolnip").getValue() !== "") {
                        this.getView().byId("idPurInfPolnip").setValueState("None");
                        this.getView().byId("idPurInfPolnip").setValueStateText("");
                    } else {
                        this.getView().byId("idPurInfPolnip").setValueState("Error");
                        this.getView().byId("idPurInfPolnip").setValueStateText("Please Enter PO Line Number ");
                        updateFlag = false;
                    }

                    if (updateFlag) {
                        var ponumber = this.getView().byId("idPurInfPurOrdip").getValue(),
                            polinenum = this.getView().byId("idPurInfPolnip").getValue(),
                            suppliercode = this.getView().byId("idPurInfSupSCip").getValue(),
                            suppliername = this.getView().byId("idPurInfSupNmip").getValue(),
                            supplierpartno = this.getView().byId("idPurInfSupPnip").getValue();

                        var payloadPurchInfData = {
                            "NCPoNumber": ponumber,
                            "NCPoLineNo": polinenum,
                            "NCSupplierCode": suppliercode,
                            "NCSupplierName": suppliername,
                            "NCSupplierPartNo": supplierpartno
                        }
                        this.updatePurchaseInfoData(payloadPurchInfData);
                    }
                } else {
                    var ponumber = this.getView().byId("idPurInfPurOrdip").getValue(),
                        polinenum = this.getView().byId("idPurInfPolnip").getValue(),
                        suppliercode = this.getView().byId("idPurInfSupSCip").getValue(),
                        suppliername = this.getView().byId("idPurInfSupNmip").getValue(),
                        supplierpartno = this.getView().byId("idPurInfSupPnip").getValue(),
                        mrpcontroller = this.getView().byId("idPurInfMrpcrip").getValue(),
                        mrpcntrlrname = this.getView().byId("idPurInfMrpcrnmip").getValue(),
                        pckgslp = this.getView().byId("idPurInfPcgslip").getValue(),
                        wayblnum = this.getView().byId("idPurInfWBNip").getValue(),
                        grnum = this.getView().byId("idPurInfGrip").getValue(),
                        grqty = this.getView().byId("idPurInfGrQtyip").getValue(),
                        gritem = this.getView().byId("idInpPurInfGritm").getValue(),
                        gryear = this.getView().byId("idInpPurInfGryr").getValue(),
                        uom = this.getView().byId("idPurInfGrUom").getValue();

                    var payloadPurchInfData = {
                        "NCPoNumber": ponumber,
                        "NCPoLineNo": polinenum,
                        "NCSupplierCode": suppliercode,
                        "NCSupplierName": suppliername,
                        "NCSupplierPartNo": supplierpartno,
                        "NCMRPNo": mrpcontroller,
                        "NCMRPName": mrpcntrlrname,
                        "NCPackSlip": pckgslp,
                        "NCWayBillNo": wayblnum,
                        "NCGRNo": grnum,
                        "NCGRQnty": grqty,
                        "NCGRLineNo": gritem,
                        "NCGRUOM": uom,
                        "NCGRYear": gryear
                    }
                    this.updatePurchaseInfoData(payloadPurchInfData);
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                if (oNctype == "STOCK PURGE") {
                    if (this.getView().byId("idDiscAircraft").getValue() == "") {
                        var oNcrSaveFldMsg = this.getView().getModel("i18n").getProperty("NCSaveFieldMsg");
                        MessageBox.information(oNcrSaveFldMsg);
                        this.getView().byId("idDiscAircraft").setValueState("Warning");
                        this.getView().byId("idDiscAircraft").setValueStateText("Please Enter Aircraft Number.");
                    } else {
                        this.getView().byId("idDiscAircraft").setValueState("None");
                        this.getView().byId("idDiscAircraft").setValueStateText();
                        // this.IsUserMRBCertifiedCheck();
                        if (this.getView().byId("idDcCobDscNo").getValue() === "" && (this.getView().byId("idDcCbIf").getSelected() === true || this.oDiscIncompleteFlag === true)) {
                            this.createDiscrepancyData();
                        } else if (this.getView().byId("idDcCobDscNo").getValue() !== "" && (this.getView().byId("idDcCbIf").getSelected() === true || this.oDiscIncompleteFlag === true)) {
                            this.updateDiscrepancyData();
                        } else if ((this.getView().byId("idDcCobDscNo").getValue() !== "" || this.getView().byId("idDcCobDscNo").getValue() === "") && this.oDiscIncompleteFlag === false) {
                            this.IsUserMRBCertifiedCheck();
                        }
                    }
                } else if (this.getView().byId("idComBoxDiscLinkTo").getValue() == "AIRCRAFT" || this.getView().byId("idComBoxDiscLinkTo").getValue() == "ASSEMBLY") {
                    if (this.getView().byId("idDiscAircraft").getValue() == "" || this.getView().byId("idDcIpLblty").getValue() == ""
                        || this.getView().byId("idDiscQtyIns").getValue() == "" || this.getView().byId("idDiscQtyRej").getValue() == ""
                        || this.getView().byId("idDcIpDc").getValue() == "" || this.getView().byId("idDcTxtIs").getValue() == "") {

                        var oNcrSaveFldMsg = this.getView().getModel("i18n").getProperty("NCSaveFieldMsg");
                        MessageBox.information(oNcrSaveFldMsg);
                        this.getView().byId("idDiscAircraft").getValue() === "" ? this.getView().byId("idDiscAircraft").setValueState("Warning") : "";
                        this.getView().byId("idDiscAircraft").getValue() === "" ? this.getView().byId("idDiscAircraft").setValueStateText("Please Enter Aircraft Number") : "";
                        this.getView().byId("idDcIpLblty").getValue() === "" ? this.getView().byId("idDcIpLblty").setValueState("Warning") : "";
                        this.getView().byId("idDcIpLblty").getValue() === "" ? this.getView().byId("idDcIpLblty").setValueStateText("Please Enter Liability") : "";
                        this.getView().byId("idDiscQtyIns").getValue() === "" ? this.getView().byId("idDiscQtyIns").setValueState("Warning") : "";
                        this.getView().byId("idDiscQtyIns").getValue() === "" ? this.getView().byId("idDiscQtyIns").setValueStateText("Please Enter Quantity Inspected") : "";
                        this.getView().byId("idDiscQtyRej").getValue() === "" ? this.getView().byId("idDiscQtyRej").setValueState("Warning") : "";
                        this.getView().byId("idDiscQtyRej").getValue() === "" ? this.getView().byId("idDiscQtyRej").setValueStateText("Please Enter Quantity Rejected") : "";
                        this.getView().byId("idDcIpDc").getValue() === "" ? this.getView().byId("idDcIpDc").setValueState("Warning") : "";
                        this.getView().byId("idDcIpDc").getValue() === "" ? this.getView().byId("idDcIpDc").setValueStateText("Please Enter Defect Code") : "";
                        this.getView().byId("idDcTxtIs").getValue() === "" ? this.getView().byId("idDcTxtIs").setValueState("Warning") : "";
                        this.getView().byId("idDcTxtIs").getValue() === "" ? this.getView().byId("idDcTxtIs").setValueStateText("Please Enter Is Text") : "";
                    } else {
                        this.getView().byId("idDiscAircraft").setValueState("None");
                        this.getView().byId("idDcIpLblty").setValueState("None");
                        this.getView().byId("idDiscQtyIns").setValueState("None");
                        this.getView().byId("idDiscQtyRej").setValueState("None");
                        this.getView().byId("idDcIpDc").setValueState("None");
                        this.getView().byId("idDcTxtIs").setValueState("None");
                        this.getView().byId("idDiscAircraft").setValueStateText();
                        this.getView().byId("idDcIpLblty").setValueStateText();
                        this.getView().byId("idDiscQtyIns").setValueStateText();
                        this.getView().byId("idDiscQtyRej").setValueStateText();
                        this.getView().byId("idDcIpDc").setValueStateText();
                        this.getView().byId("idDcTxtIs").setValueStateText();
                        // this.IsUserMRBCertifiedCheck();
                        if (this.getView().byId("idDcCobDscNo").getValue() === "" && (this.getView().byId("idDcCbIf").getSelected() === true || this.oDiscIncompleteFlag === true)) {
                            this.createDiscrepancyData();
                        } else if (this.getView().byId("idDcCobDscNo").getValue() !== "" && (this.getView().byId("idDcCbIf").getSelected() === true || this.oDiscIncompleteFlag === true)) {
                            this.updateDiscrepancyData();
                        } else if ((this.getView().byId("idDcCobDscNo").getValue() !== "" || this.getView().byId("idDcCobDscNo").getValue() === "") && this.oDiscIncompleteFlag === false) {
                            this.IsUserMRBCertifiedCheck();
                        }
                    }
                } else {
                    // this.IsUserMRBCertifiedCheck();
                    if (this.getView().byId("idDcCobDscNo").getValue() === "" && (this.getView().byId("idDcCbIf").getSelected() === true || this.oDiscIncompleteFlag === true)) {
                        this.createDiscrepancyData();
                    } else if (this.getView().byId("idDcCobDscNo").getValue() !== "" && (this.getView().byId("idDcCbIf").getSelected() === true || this.oDiscIncompleteFlag === true)) {
                        this.updateDiscrepancyData();
                    } else if ((this.getView().byId("idDcCobDscNo").getValue() !== "" || this.getView().byId("idDcCobDscNo").getValue() === "") && this.oDiscIncompleteFlag === false) {
                        this.IsUserMRBCertifiedCheck();
                    }
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Dispo") {
                if (this.getView().byId("idDispoGenInfoIncompFlag").getSelected() === true) {
                    this.createDisposition();
                } else if ((this.getView().byId("idTableDisposition").getSelectedItem()) && (this.getView().byId("idDispoGenInfoIncompFlag").getSelected() === false)) {
                    if (this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionStatus") == "Open") {
                        this.createDisposition();
                    } else {
                        this.dispoIsUserMRBCertifiedCheck();
                    }
                } else if (this.getView().byId("idDispoGenInfoIncompFlag").getSelected() === false) {
                    this.dispoIsUserMRBCertifiedCheck();
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Signoff") {
                this.onSaveSingOff();
            }

        },

        onSaveSingOff: function () {
            sap.ui.core.BusyIndicator.show();
            var htab = this.getView().byId("idTabHeaderSingoff").getItems();
            var dtab = this.getView().byId("idTabDiscSingoff").getItems();
            var obj = {};
            var hsarr = [], dsarr = [];
            var workgrp = this.getView().byId("idworkgroup").getText();
            for (var i = 0; i < htab.length; i++) {
                var hobj = {};
                hobj.Notification = sObjectId;
                hobj.SignOffGroup = htab[i].getCells()[0].getText();
                hobj.Sequence = htab[i].getCells()[11].getText();
                hobj.SignOffNote = htab[i].getCells()[2].getValue();
                hobj.ActionCode = htab[i].getCells()[3].getValue();
                hobj.AR = htab[i].getCells()[8].getValue();
                hobj.Comments = htab[i].getCells()[9].getValue();
                hobj.Status = htab[i].getCells()[12].getValue();
                hobj.StatusText = htab[i].getCells()[7].getText();
                hsarr.push(hobj);
            }
            for (var j = 0; j < dtab.length; j++) {
                var dobj={};
                dobj.Notification = sObjectId;
                dobj.DiscrepancyNo = dtab[j].getCells()[1].getText();
                dobj.SignOffGroup = dtab[j].getCells()[0].getText();
                dobj.Sequence = dtab[j].getCells()[12].getText();
                dobj.SignOffNote = dtab[j].getCells()[3].getValue();
                dobj.ActionCode = dtab[j].getCells()[4].getValue();
                dobj.AR = dtab[j].getCells()[9].getValue();
                dobj.Comments = dtab[j].getCells()[10].getValue();
                dobj.Status = dtab[j].getCells()[13].getValue();
                dobj.StatusText = dtab[j].getCells()[8].getText();
                dsarr.push(dobj);
            }

            obj.Notification = sObjectId;
            obj.WorkGroup = workgrp;
            obj.to_headersignoff = hsarr;
            obj.to_discsignoff = dsarr;
            var oModel = this.getOwnerComponent().getModel();
            oModel.create("/SignOffSet", obj, {
                method: "POST",
                success: function (data, response) {
                    sap.ui.core.BusyIndicator.hide();
                    if (response.headers["sap-message"]) {
                        var sMessg = JSON.parse(response.headers["sap-message"]).message;
                        MessageBox.success(sMessg);
                    }
                    oModel.refresh();
                    this.headerSingoffDetails();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });

        },

        handleChangeDiscAircraft: function () {
            if (this.getView().byId("idDiscAircraft").getValue() !== "") {
                this.getView().byId("idDiscAircraft").setValueState("None");
                this.getView().byId("idDiscAircraft").setValueStateText();
            }
        },

        updateHeaderData: function () {
            var oNotifNo = sObjectId;
            var oWorkGroup = this.getView().byId("idworkgroup").getText();
            var oNcStatus = this.getView().byId("idObjNCStatus").getText();
            var oNcType = this.getView().byId("idCombNcType").getValue();
            var oNcPriority = this.getView().byId("idComBoxPriority").getValue();
            var oNcArea = this.getView().byId("idCombInWhArea").getValue();
            var oPlantCode = this.getView().byId("idPlntCodeHdr").getValue();
            var oProductCode = this.getView().byId("idInpProdCode").getValue();
            var oWorkInst = this.getView().byId("idInpWrkIns").getValue();
            var oProdOrder = this.getView().byId("idInpPrdOrd").getValue();
            var oSupercedesNC = this.getView().byId("idInpSupNC").getValue();
            var oSupercededByNC = this.getView().byId("idInpSupBy").getValue();
            var oReferenceNC = this.getView().byId("idInpRefNC").getValue();
            // var oExistingATS = this.getView().byId("idSwitchExstATS").getState();
            var oAircraftNo = this.getView().byId("idInpAircraft").getValue();
            var oNCCreatedBy = this.getView().byId("idInpNCCrtBy").getValue();
            var oNCDetectedAt = this.getView().byId("idInpNCDetAt").getValue();
            var oBinLocation = this.getView().byId("idInpBinLoc").getValue();
            var oDropPoint = this.getView().byId("idInpDrpPt").getValue();
            var oPartNum = this.getView().byId("idInpPartNo").getValue();
            var oPartDesc = this.getView().byId("idInpStatPartDesc").getValue();
            var oInpSerNo = this.getView().byId("idMNInputSN");
            var oInpTrcNo = this.getView().byId("idMNInputTN");
            if ((oInpSerNo.getTokens().length === 1 && oInpTrcNo.getTokens().length === 1) ||
                (oInpSerNo.getTokens().length === 1 && oInpTrcNo.getTokens().length === 0) ||
                (oInpSerNo.getTokens().length === 0 && oInpTrcNo.getTokens().length === 1) ||
                (oInpSerNo.getTokens().length === 0 && oInpTrcNo.getTokens().length === 0)) {
                sap.ui.core.BusyIndicator.show();
                var oSerialNo = oInpSerNo.getTokens().length === 1 ? oInpSerNo.getTokens()[0].getKey() : "";
                var oTraceabilityNo = oInpTrcNo.getTokens().length === 1 ? oInpTrcNo.getTokens()[0].getKey() : "";
                var payLoadHdrData = {
                    "WorkGroup": oWorkGroup,
                    "NCStatus": oNcStatus,
                    "NCType": oNcType,
                    "NCPriority": oNcPriority,
                    "NCArea": oNcArea,
                    "PlantCode": oPlantCode,
                    "ProductCode": oProductCode,
                    "WorkInstruction": oWorkInst,
                    "ProdOrder": oProdOrder,
                    "SupercedesNC": oSupercedesNC,
                    "SupercededByNC": oSupercededByNC,
                    "ReferenceNC": oReferenceNC,
                    // "ExistingATS": oExistingATS,
                    "Aircraftno": oAircraftNo,
                    "NCCreatedBy": oNCCreatedBy,
                    "NCDetectedAt": oNCDetectedAt,
                    "Binlocation": oBinLocation,
                    "DropPoint": oDropPoint,
                    "PartNumber": oPartNum,
                    "PartDescription": oPartDesc,
                    "SerialNo": oSerialNo,
                    "TraceabilityNo": oTraceabilityNo
                }
                this.getOwnerComponent().getModel().update("/CreateNotificationHeaderSet('" + oNotifNo + "')", payLoadHdrData, {
                    method: "PUT",
                    success: function (odata, Response) {
                        sap.ui.core.BusyIndicator.hide();
                        // var msg = "The header data has been updated successfully.!";
                        if (Response.headers["sap-message"]) {
                            var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                            MessageBox.success(oMsg);
                        }
                        var sObjectPath = "CreateNotificationHeaderSet('" + oNotifNo + "')";
                        this._bindView("/" + sObjectPath);
                        this._bindTable("/" + sObjectPath);
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            } else {
                var payLoadHdrData = {
                    "WorkGroup": oWorkGroup,
                    "NotificationNo": oNotifNo,
                    "NCStatus": oNcStatus,
                    "NCType": oNcType,
                    "NCPriority": oNcPriority,
                    "NCArea": oNcArea,
                    "PlantCode": oPlantCode,
                    "ProductCode": oProductCode,
                    "WorkInstruction": oWorkInst,
                    "ProdOrder": oProdOrder,
                    "SupercedesNC": oSupercedesNC,
                    "SupercededByNC": oSupercededByNC,
                    "ReferenceNC": oReferenceNC,
                    // "ExistingATS": oExistingATS,
                    "Aircraftno": oAircraftNo,
                    "NCCreatedBy": oNCCreatedBy,
                    "NCDetectedAt": oNCDetectedAt,
                    "Binlocation": oBinLocation,
                    "DropPoint": oDropPoint,
                    "PartNumber": oPartNum,
                    "PartDescription": oPartDesc,
                    "to_headerserial": [],
                    "to_headertrace": []
                }
                if (oInpSerNo.getTokens().length >= 1) {
                    payLoadHdrData["to_headerserial"] = [];
                    for (var i = 0; i < oInpSerNo.getTokens().length; i++) {
                        var oSerialNo = oInpSerNo.getTokens()[i].getKey();
                        payLoadHdrData["to_headerserial"].push({
                            "SerialNo": oSerialNo
                        });
                    }
                }

                if (oInpTrcNo.getTokens().length >= 1) {
                    payLoadHdrData["to_headertrace"] = [];
                    for (var j = 0; j < oInpTrcNo.getTokens().length; j++) {
                        var oTraceNo = oInpTrcNo.getTokens()[j].getKey();
                        payLoadHdrData["to_headertrace"].push({
                            "TraceNo": oTraceNo
                        });
                    }
                }

                this.getOwnerComponent().getModel().create("/CreateNotificationHeaderSet", payLoadHdrData, {
                    success: function (odata, Response) {
                        sap.ui.core.BusyIndicator.hide();
                        // var msg = "The header data has been updated successfully.!";
                        if (Response.headers["sap-message"]) {
                            var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                            var oSeverity = JSON.parse(Response.headers["sap-message"]).severity;
                            if (oSeverity == "success") {
                                MessageBox.success(oMsg);
                            } else {
                                MessageBox.error(oMsg);
                            }
                        }
                        var sObjectPath = "CreateNotificationHeaderSet('" + oNotifNo + "')";
                        this._bindView("/" + sObjectPath);
                        this._bindTable("/" + sObjectPath);
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }.bind(this)
                })
            }
        },

        /**Function is triggered when clicked on Purchase Info Tab */
        _setPurchaseInfoData: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/CreatePurchaseInfoSet('" + sObjectId + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData;
                    var nctype = data.NCType,
                        subcategory = data.NCSubCat,
                        subcatseq = data.NCSubCatSeq,
                        ponumber = data.NCPoNumber,
                        polinenum = data.NCPoLineNo,
                        podate = data.NCPoDate,
                        suppliercode = data.NCSupplierCode,
                        suppliername = data.NCSupplierName,
                        supplierpartno = data.NCSupplierPartNo,
                        supplierpartnodesc = data.NCSupplierPartNoDesc,
                        mrpcontroller = data.NCMRPNo,
                        mrpcntrlrname = data.NCMRPName,
                        pckgslp = data.NCPackSlip,
                        wayblnum = data.NCWayBillNo,
                        grnum = data.NCGRNo,
                        grqty = data.NCGRQnty,
                        gritem = data.NCGRLineNo,
                        gryear = data.NCGRYear,
                        uom = data.NCGRUOM,
                        ropurfield = data.PurchaseChangeFields;
                    if (nctype == "SUPPLIER") {
                        this.getView().byId("idLblGrn").setVisible(false);
                        this.getView().byId("idPurInfGrip").setVisible(false);
                        this.getView().byId("idInpPurInfGritm").setVisible(false);
                        this.getView().byId("idInpPurInfGryr").setVisible(false);
                        this.getView().byId("idLblGrqty").setVisible(false);
                        this.getView().byId("idPurInfGrQtyip").setVisible(false);
                        this.getView().byId("idPurInfGrUom").setVisible(false);
                        this.getView().byId("idLblMrpctrlr").setVisible(false);
                        this.getView().byId("idPurInfMrpcrip").setVisible(false);
                        this.getView().byId("idLblMrpCtrlrNm").setVisible(false);
                        this.getView().byId("idPurInfMrpcrnmip").setVisible(false);
                        this.getView().byId("idLblWblNo").setVisible(false);
                        this.getView().byId("idPurInfWBNip").setVisible(false);
                        this.getView().byId("idLblPcgslp").setVisible(false);
                        this.getView().byId("idPurInfPcgslip").setVisible(false);
                        this.getView().byId("idPurInfPurOrdip").setRequired(true);
                        this.getView().byId("idPurInfPolnip").setRequired(true);
                        this.getView().byId("idPurInfPurOrdip").setValue(ponumber);
                        this.getView().byId("idPurInfPolnip").setValue(polinenum);
                        //this.getView().byId("idPurInfPoDtdp").setValue(podate);
                        this.getView().byId("idPurInfSupNmip").setValue(suppliername);
                        this.getView().byId("idPurInfSupSCip").setValue(suppliercode);
                        this.getView().byId("idPurInfSupPnip").setValue(supplierpartno);
                        this.getView().byId("idPurInfSupPnDescip").setValue(supplierpartnodesc);
                    } else {
                        this.getView().byId("idPurInfPurOrdip").setRequired(false);
                        this.getView().byId("idPurInfPolnip").setRequired(false);
                        this.getView().byId("idLblGrn").setVisible(true);
                        this.getView().byId("idPurInfGrip").setVisible(true);
                        this.getView().byId("idInpPurInfGritm").setVisible(true);
                        this.getView().byId("idInpPurInfGryr").setVisible(true);
                        this.getView().byId("idLblGrqty").setVisible(true);
                        this.getView().byId("idPurInfGrQtyip").setVisible(true);
                        this.getView().byId("idPurInfGrUom").setVisible(true);
                        this.getView().byId("idLblMrpctrlr").setVisible(true);
                        this.getView().byId("idPurInfMrpcrip").setVisible(true);
                        this.getView().byId("idLblMrpCtrlrNm").setVisible(true);
                        this.getView().byId("idPurInfMrpcrnmip").setVisible(true);
                        this.getView().byId("idLblWblNo").setVisible(true);
                        this.getView().byId("idPurInfWBNip").setVisible(true);
                        this.getView().byId("idLblPcgslp").setVisible(true);
                        this.getView().byId("idPurInfPcgslip").setVisible(true);
                        this.getView().byId("idPurInfGrip").setValue(grnum);
                        this.getView().byId("idPurInfGrQtyip").setValue(grqty);
                        this.getView().byId("idPurInfGrUom").setValue(uom);
                        this.getView().byId("idInpPurInfGritm").setValue(gritem);
                        this.getView().byId("idInpPurInfGryr").setValue(gryear);
                        this.getView().byId("idPurInfPurOrdip").setValue(ponumber);
                        this.getView().byId("idPurInfPolnip").setValue(polinenum);
                        //this.getView().byId("idPurInfPoDtdp").setValue(podate);
                        this.getView().byId("idPurInfSupNmip").setValue(suppliername);
                        this.getView().byId("idPurInfSupSCip").setValue(suppliercode);
                        this.getView().byId("idPurInfSupPnip").setValue(supplierpartno);
                        this.getView().byId("idPurInfSupPnDescip").setValue(supplierpartnodesc);
                        this.getView().byId("idPurInfMrpcrip").setValue(mrpcontroller);
                        this.getView().byId("idPurInfMrpcrnmip").setValue(mrpcntrlrname);
                        this.getView().byId("idPurInfWBNip").setValue(wayblnum);
                        this.getView().byId("idPurInfPcgslip").setValue(pckgslp);
                    }
                    if (this.workingQueueMode == "EDIT") {
                        var purODataArray = [];
                        var oROModel;
                        if (ropurfield != "") {
                            purODataArray = ropurfield.split(',');
                            oROModel = Utils.getReadonlyPropField(purODataArray, "Purchase");
                        } else {
                            oROModel = Utils.getReadonlyPropField(purODataArray, "Purchase");
                        }
                        this.bindROPurchaseProps(oROModel);
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        bindROPurchaseProps: function (oROModel) {
            this.getView().byId("idPurInfGrip").setEditable(oROModel.oData.NCGRNo);
            this.getView().byId("idPurInfPurOrdip").setEditable(oROModel.oData.NCPoNumber);
            this.getView().byId("idPurInfPolnip").setEditable(oROModel.oData.NCPoLineNo);
            this.getView().byId("idPurInfSupSCip").setEditable(oROModel.oData.NCSupplierCode);
            this.getView().byId("idPurInfWBNip").setEditable(oROModel.oData.NCWayBillNo);
            this.getView().byId("idPurInfPcgslip").setEditable(oROModel.oData.NCPackSlip);
            this.getView().byId("idncrsave").setVisible(oROModel.oData.Button);
        },

        /**Function is triggered when saving or updating Purchase Info Data */
        updatePurchaseInfoData: function (payloadPurchInfData) {
            var oNotifNo = sObjectId;
            var oModel = this.getOwnerComponent().getModel();
            oModel.update("/CreatePurchaseInfoSet('" + oNotifNo + "')", payloadPurchInfData, {
                method: "PUT",
                success: function (data, response) {
                    sap.ui.core.BusyIndicator.hide();
                    //var msg = "Purchase Info data has been updated successfully.!";
                    if (response.headers["sap-message"]) {
                        var sMessg = JSON.parse(response.headers["sap-message"]).message;
                        MessageBox.success(sMessg);
                    }
                    oModel.refresh();
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        /**Function is triggered when clicked on Discrepancy tab to set discrepancy drop down */
        _setDiscrepancyComboBox: function () {
            this.getOwnerComponent().getModel().metadataLoaded().then(function () {
                var sEntitypath = this.getOwnerComponent().getModel().createKey("CreateNotificationHeaderSet", {
                    NotificationNo: sObjectId
                    // NotificationNo: '200000032'
                });
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                var oDataModel = this.getOwnerComponent().getModel();
                var sPath = "/" + sEntitypath;
                oDataModel.read(sPath, {
                    urlParameters: {
                        "$expand": "to_discrepancy"
                    },
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.to_discrepancy;
                        oModel.setData(data);
                        this.getView().setModel(oModel, "discrepancyDropdownModel");
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            }.bind(this));
        },

        /**Function is triggered when clicked on Discrepancy tab to set Preliminary cause dropdown */
        _setPrelimCauseComboBox: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "PCAUSE"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this.getView().setModel(oModel, "preliminarycauseModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        /**Function is triggered when clicked on Discrepancy tab to set Preliminary cause dropdown */
        _setFormatComboBox: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DISCASPER"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this.getView().setModel(oModel, "discrepancyFormatModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        /**Function is triggered when Stock Purge Button is clicked*/
        _onPressStockPurge: function () {
            this._oStockPurgeDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.ZQM_NCR.fragments.StockPurge", this);
            this.getView().addDependent(this._oStockPurgeDialog);
            this._oStockPurgeDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var discrepancyNo = this.getView().byId("idDcCobDscNo").getSelectedKey();
            var sPath = "/DiscrepancyStockPurgeSet(NotificationNo='" + sObjectId + "',DiscrepancyNo='" + discrepancyNo + "')"
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData,
                        floorQtyNtGood = data.FloorQtyNtGood,
                        floorQtyGood = data.FloorQtyGood,
                        floorQtyTotal = data.FloorQtyTotal,
                        storeQtyNtGood = data.StoreQtyNtGood,
                        storeQtyGood = data.StoreQtyGood,
                        storeQtyTotal = data.StoreQtyTotal,
                        gtotalQtyNtGood = data.GtotalQtyNtGood,
                        gtotalQtyGood = data.GtotalQtyGood,
                        gtotalQtyTotal = data.GtotalQtyTotal;
                    this.getView().byId("idInpFlrQngd").setValue(floorQtyNtGood);
                    this.getView().byId("idInpFlrQgd").setValue(floorQtyGood);
                    this.getView().byId("idInpFlrQtot").setValue(floorQtyTotal);
                    this.getView().byId("idInpStrQngd").setValue(storeQtyNtGood);
                    this.getView().byId("idInpStrQgd").setValue(storeQtyGood);
                    this.getView().byId("idInpStrQtot").setValue(storeQtyTotal);
                    this.getView().byId("idInpGtotQngd").setValue(gtotalQtyNtGood);
                    this.getView().byId("idInpGtotQgd").setValue(gtotalQtyGood);
                    this.getView().byId("idInpGtotQtot").setValue(gtotalQtyTotal);
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        /**Function is triggered when clicked on Close button in Stock Purge Dilaog */
        onCloseStockPurge: function () {
            this._oStockPurgeDialog.destroy();
        },

        /**Function is triggered when clicked on Save button in Stock Purge Dilaog */
        onSaveStockPurge: function () {
            var floorQtyNtGood = this.getView().byId("idInpFlrQngd").getValue(),
                floorQtyGood = this.getView().byId("idInpFlrQgd").getValue(),
                floorQtyTotal = this.getView().byId("idInpFlrQtot").getValue(),
                storeQtyNtGood = this.getView().byId("idInpStrQngd").getValue(),
                storeQtyGood = this.getView().byId("idInpStrQgd").getValue(),
                storeQtyTotal = this.getView().byId("idInpStrQtot").getValue(),
                gtotalQtyNtGood = this.getView().byId("idInpGtotQngd").getValue(),
                gtotalQtyGood = this.getView().byId("idInpGtotQgd").getValue(),
                gtotalQtyTotal = this.getView().byId("idInpGtotQtot").getValue();
            var payloadDiscrepancyStockPurge = {
                "NotificationNo": sObjectId,
                "DiscrepancyNo": oDiscrepancy,
                "FloorQtyNtGood": floorQtyNtGood,
                "FloorQtyGood": floorQtyGood,
                "FloorQtyTotal": floorQtyTotal,
                "StoreQtyNtGood": storeQtyNtGood,
                "StoreQtyGood": storeQtyGood,
                "StoreQtyTotal": storeQtyTotal,
                "GtotalQtyNtGood": gtotalQtyNtGood,
                "GtotalQtyGood": gtotalQtyGood,
                "GtotalQtyTotal": gtotalQtyTotal
            };
            var oModel = this.getOwnerComponent().getModel();
            oModel.create("/DiscrepancyStockPurgeSet", payloadDiscrepancyStockPurge, {
                method: "POST",
                success: function (data, response) {
                    sap.ui.core.BusyIndicator.hide();
                    if (response.headers["sap-message"]) {
                        var sMessg = JSON.parse(response.headers["sap-message"]).message;
                        MessageBox.success(sMessg);
                    }
                    oModel.refresh();
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
            this._oStockPurgeDialog.destroy();
        },

        /**Function triggered when clicked on Defect Code value help button */
        _handleValueHelpDefCode: function (oEvent) {
            this._oDefectCodeDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.ZQM_NCR.fragments.DefectCodeValueHelp", this);
            this.getView().addDependent(this._oDefectCodeDialog);
            this._oDefectCodeDialog.open();
            //Model to set in Defect Code Dialog
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DCODE"));
            oFilter.push(new Filter("KeyValue", FilterOperator.EQ, sObjectId));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oDefectCodeDialog.setModel(oModel, "defectCodeModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        /**Function is triggered when searching for a defect code in defect code value help dialog */
        onDefectCodeliveSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**Function is triggered when selected a defect code in value help dialog */
        _confirmDefectCodeValueHelpDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idDcIpDc"),
                oInput1 = this.getView().byId("idDcIpDcVal1"),
                oText = this.getView().byId("idDcTxtDc");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            oInput1.setValue(oSelectedItem.getInfo());
            oText.setText(oSelectedItem.getDescription());
            if (oInput.getValue() !== "") {
                oInput.setValueState("None");
                oInput.setValueStateText();
            }
            this._oDefectCodeDialog.destroy();
        },

        /**Function is triggered when selected an item in discrepancy drop down */
        _onSelectingDiscrepancy: function (oEvent) {
            var iconKey = this.getView().byId("idIconTabBarHeader").getSelectedKey();
            if (iconKey == "Hdata") {
                var hdatatab = this.getView().byId("idHeaderDiscTable").getSelectedItems();
                if (hdatatab.length == 0) {
                    var oSelDiscMsg = this.getView().getModel("i18n").getProperty("SelDiscMsg");
                    MessageBox.warning(oSelDiscMsg);
                    return;
                } else {
                    if (this.getView().byId("idHeaderDiscTable").getSelectedItem().getBindingContext("oHeaderDiscTable")) {
                        var discrepancyNo = this.getView().byId("idHeaderDiscTable").getSelectedItem().getBindingContext("oHeaderDiscTable").getProperty("DiscrepancyNo");
                        this.getView().byId("idIconTabBarHeader").setSelectedKey("Discre");
                        this.getView().byId("idHeaderDiscTable").removeSelections();
                        var bFlag = "Copy Discrepancy";
                        this.bindDiscrepancyTab(discrepancyNo, bFlag);
                        this._setDiscrepancyComboBox();
                        this._setPrelimCauseComboBox();
                        this._setFormatComboBox();
                        // this.bindLinkedToDiscrepancy();
                        this.onSelectDiscPartlocation();
                        this.onSelectDiscPartlocationList();
                        this.bindSupplier();
                        this.bindDefaultPartNumber();
                        this.getView().byId("idstatus").setVisible(true);
                        this.getView().byId("idObjNCStatus").setVisible(false);
                        this.getView().byId("idObjNCStatusDiscrep").setVisible(true);
                        this.getView().byId("idObjNCStatusDispo").setVisible(false);
                        this.getView().byId("btnWorkGrp").setVisible(false);
                    }
                }
            } else if (iconKey == "Discre") {
                if (oEvent.getParameters("selectedItem").selectedItem) {
                    var discrepancyNo = oEvent.getParameters("selectedItem").selectedItem.getKey();
                    oDiscrepancy = discrepancyNo;
                    if (discrepancyNo != "") {
                        if (oNctype == "STOCK PURGE") {
                            this.getView().byId("idDcBtStkPrg").setVisible(true);
                        } else {
                            this.getView().byId("idDcBtStkPrg").setVisible(false);
                        }
                    }
                } else {
                    var discrepancyNo = "";
                    oDiscrepancy = discrepancyNo;
                }
                this.bindDiscrepancyTab(discrepancyNo);
            } else if (iconKey == "Dispo") {
                if (oEvent.getParameters("selectedItem").selectedItem) {
                    var discrepancyNo = oEvent.getParameters("selectedItem").selectedItem.getKey();
                    oDiscrepancy = discrepancyNo;
                    if (discrepancyNo != "") {
                        this.bindDispositionTab(discrepancyNo);
                        this.bindDispositionDetails();
                        this.bindBuyOffTable();
                    }
                }
            }
        },

        handleNavToDiscrepancy: function () {
            var iconKey = this.getView().byId("idIconTabBarHeader").getSelectedKey();
            if (iconKey == "Hdata") {
                var hdatatab = this.getView().byId("idHeaderDiscTable").getSelectedItems();
                if (hdatatab.length == 0) {
                    var oNavToDisc = this.getView().getModel("i18n").getProperty("NavToDiscMsg");
                    MessageBox.warning(oNavToDisc);
                    return;
                } else {
                    if (this.getView().byId("idHeaderDiscTable").getSelectedItem().getBindingContext("oHeaderDiscTable")) {
                        var discrepancyNo = this.getView().byId("idHeaderDiscTable").getSelectedItem().getBindingContext("oHeaderDiscTable").getProperty("DiscrepancyNo");
                        this.getView().byId("idIconTabBarHeader").setSelectedKey("Discre");
                        this.getView().byId("idHeaderDiscTable").removeSelections();
                        if (discrepancyNo != "") {
                            oDiscrepancy = discrepancyNo;
                            if (oNctype == "STOCK PURGE") {
                                this.getView().byId("idDcBtStkPrg").setVisible(true);
                            } else {
                                this.getView().byId("idDcBtStkPrg").setVisible(false);
                            }
                        }
                        this.bindDiscrepancyTab(discrepancyNo);
                        this._setDiscrepancyComboBox();
                        this._setPrelimCauseComboBox();
                        this._setFormatComboBox();
                        this.bindLinkedToDiscrepancy();
                        this.onSelectDiscPartlocation();
                        this.bindSupplier();
                        this.bindDefaultPartNumber();
                        this.getView().byId("idstatus").setVisible(true);
                        this.getView().byId("idObjNCStatus").setVisible(false);
                        this.getView().byId("idObjNCStatusDiscrep").setVisible(true);
                        this.getView().byId("idObjNCStatusDispo").setVisible(false);
                        this.getView().byId("idDcBtStkPrg").setVisible(false);
                        this.getView().byId("btnWorkGrp").setVisible(false);
                    }
                }
            }
        },

        handleNavToDisposition: function () {
            var iconKey = this.getView().byId("idIconTabBarHeader").getSelectedKey();
            if (iconKey == "Hdata") {
                var hdatatab = this.getView().byId("idHeaderDiscTable").getSelectedItems();
                if (hdatatab.length == 0) {
                    var oNavToDispoMsg = this.getView().getModel("i18n").getProperty("NavToDispoMsg");
                    MessageBox.warning(oNavToDispoMsg);
                    return;
                } else {
                    if (this.getView().byId("idHeaderDiscTable").getSelectedItem().getBindingContext("oHeaderDiscTable")) {
                        var discrepancyNo = this.getView().byId("idHeaderDiscTable").getSelectedItem().getBindingContext("oHeaderDiscTable").getProperty("DiscrepancyNo");
                        this.getView().byId("idIconTabBarHeader").setSelectedKey("Dispo");
                        this.getView().byId("idHeaderDiscTable").removeSelections();
                        this.bindDispositionTab(discrepancyNo);
                        this.getView().byId("idstatus").setVisible(true);
                        this.getView().byId("idObjNCStatus").setVisible(false);
                        this.getView().byId("idObjNCStatusDiscrep").setVisible(false);
                        this.getView().byId("idObjNCStatusDispo").setVisible(true);
                        this.getView().byId("idBtnCancel").setVisible(false);
                        this.bindDispositionDetails(discrepancyNo);
                        this.bindBuyOffTable();
                        this.bindMajorMinorNc();
                        this._setDiscrepancyComboBox();
                    }
                }
            }
        },

        handleNavToSignOff: function () {
            this.getView().byId("idIconTabBarHeader").setSelectedKey("Signoff");
            this.getView().byId("idHeaderDiscTable").removeSelections();
            this.getView().byId("idstatus").setVisible(false);
            this.getView().byId("idObjNCStatus").setVisible(false);
            this.getView().byId("idObjNCStatusDiscrep").setVisible(false);
            this.getView().byId("idObjNCStatusDispo").setVisible(false);
            this.getView().byId("idBtnCancel").setVisible(false);
            this.getView().byId("btnWorkGrp").setVisible(false);
        },

        handleDiscItemSelection: function (oEvent) {
            var discrepancyNo;
            if (oEvent.getParameters().listItem.getBindingContext("oHeaderDiscTable")) {
                discrepancyNo = oEvent.getParameters().listItem.getBindingContext("oHeaderDiscTable").getProperty("DiscrepancyNo");
            } else {
                discrepancyNo = "";
            }
            if (discrepancyNo != "") {
                if (oNctype == "STOCK PURGE") {
                    this.getView().byId("idDcBtStkPrg").setVisible(true);
                } else {
                    this.getView().byId("idDcBtStkPrg").setVisible(false);
                }
            }
            this.bindDiscrepancyTab(discrepancyNo);
            this.getView().byId("idIconTabBarHeader").setSelectedKey("Discre");
            this.getView().byId("idHeaderDiscTable").removeSelections();
        },

        bindDiscrepancyTab: function (discrepancyNo, bFlag) {
            sap.ui.core.BusyIndicator.show();
            if (bFlag) {
                this.sFlag = bFlag;
            } else {
                this.sFlag = "";
            }
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/CreateNotificationHeaderSet('" + sObjectId + "')/to_discrepancy(NotificationNo='" + sObjectId + "',DiscrepancyNo='" + discrepancyNo + "')";
            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_serials,to_traces"
                },
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData;
                    var discstatus = data.Status,
                        discrepancyNum = data.DiscrepancyNo == 0 ? "" : data.DiscrepancyNo,
                        linkedTo = data.LinkedTo,
                        liability = data.Liability,
                        liabilitytext = data.LiabilityText,
                        partner = data.Partner,
                        partnerName = data.PartnerName,
                        supercedesItem = data.SupercedesItem == 0 ? "" : data.SupercedesItem,
                        supercededByItem = data.SupercededByItem == 0 ? "" : data.SupercededByItem,
                        // dropShip2 = data.DropShip2,
                        aircraft = data.Aircraft,
                        openDate = data.OpenDate,
                        closeDate = data.CloseDate,
                        partNumber = data.PartNumber,
                        partDesc = data.PartDesc,
                        inspQnty = data.InspQnty == 0 ? "" : data.InspQnty,
                        rejectQnty = data.RejectQnty == 0 ? "" : data.RejectQnty,
                        qntyUOM = data.QntyUOM,
                        compSerialNo = data.to_serials,
                        traceNo = data.to_traces,
                        prelimInvest = data.PrelimInvest,
                        partQuarantine = data.PartQuarantine,
                        mesIssue = data.MESissue,
                        csmsIssue = data.CsmsIssue,
                        prelimCause = data.PrelimCause,
                        defectCode = data.DefectCode,
                        defect = data.Defect,
                        defectCodeDesc = data.DefectCodeDesc,
                        dropPoint = data.DropPoint == 0 ? "" : data.DropPoint,
                        is = data.Is,
                        shouldbe = data.Shouldbe,
                        asPer = data.AsPer,
                        incompletion = data.Incompletion,
                        rodiscfield = data.DiscChangeFields;
                    //setting values in General Info Screen
                    this.getView().byId("idObjNCStatusDiscrep").setText(discstatus);
                    this.getView().byId("headertext").setText("Discrepancy No: " + discrepancyNum + "");
                    this.getView().byId("idDiscPartNumber").setValue(partNumber);
                    this.getView().byId("idDiscPartDesc").setValue(partDesc);
                    this.getView().byId("idDiscQtyIns").setValue(inspQnty);
                    this.getView().byId("idDiscUomIns").setText(qntyUOM);
                    this.getView().byId("idDiscQtyRej").setValue(rejectQnty);
                    this.getView().byId("idDiscUomRej").setText(qntyUOM);
                    this.getView().byId("idDcCobDscNo").setValue(discrepancyNum);
                    this.getView().byId("idDcCobDscNo").setSelectedKey(discrepancyNum);
                    this.getView().byId("idDiscLbltyTxt").setValue(liabilitytext);
                    this._oMultiInputDiscSN.removeAllTokens();
                    this._oMultiInputDiscTN.removeAllTokens();
                    this.getView().byId("idComBoxDiscLinkTo").setValue(linkedTo);
                    if (linkedTo == "AIRCRAFT") {
                        // this.getView().byId("idDiscPartNumber").setValueHelpOnly(false);
                        this.getView().byId("idDiscPartDesc").setEditable(true);
                    } else if (linkedTo == "DETAIL") {
                        // this.getView().byId("idDiscPartNumber").setValueHelpOnly(false);
                        this.getView().byId("idDiscPartDesc").setEditable(true);
                    } else if (linkedTo == "ASSEMBLY") {
                        // this.getView().byId("idDiscPartNumber").setValueHelpOnly(true);
                        this.getView().byId("idDiscPartDesc").setEditable(false);
                    } else {
                        // this.getView().byId("idDiscPartNumber").setValueHelpOnly(false);
                        this.getView().byId("idDiscPartDesc").setEditable(true);
                    }

                    if (partNumber !== "") {
                        this._oMultiInputDiscSN.setEditable(true);
                        this._oMultiInputDiscTN.setEditable(true);
                    } else {
                        this._oMultiInputDiscSN.setEditable(false);
                        this._oMultiInputDiscTN.setEditable(false);
                    }
                    if (compSerialNo.results.length > 0) {
                        for (var i = 0; i < compSerialNo.results.length; i++) {
                            var oSerialNosDiscToken = compSerialNo.results[i].SerialNo;
                            var oSernrDiscToken = new sap.m.Token({
                                key: oSerialNosDiscToken,
                                text: oSerialNosDiscToken
                            });
                            this._oMultiInputDiscSN.addToken(oSernrDiscToken);
                        }
                    }
                    if (traceNo.results.length > 0) {
                        for (var j = 0; j < traceNo.results.length; j++) {
                            var oTraceNosDiscToken = traceNo.results[j].TraceNo;
                            var oTraceDiscToken = new sap.m.Token({
                                key: oTraceNosDiscToken,
                                text: oTraceNosDiscToken
                            });
                            this._oMultiInputDiscTN.addToken(oTraceDiscToken);
                        }
                    }

                    this.getView().byId("idDcIpLblty").setValue(liability);
                    this.getView().byId("idDcIpPrtnr").setValue(partner);
                    this.getView().byId("idDcIpPrtnrNm").setValue(partnerName);
                    this.getView().byId("idDcIpSpsdsItm").setValue(supercedesItem);
                    this.getView().byId("idDcIpSpsdbyItm").setValue(supercededByItem);
                    // this.getView().byId("idDcTxtCdt").setText();
                    // this.getView().byId("idDcCbDs2").setSelected(true);
                    this.getView().byId("idDiscAircraft").setValue(aircraft);
                    if (openDate) {
                        this.getView().byId("idDcIpOdt").setValue(openDate);
                    }
                    if (closeDate) {
                        this.getView().byId("idDcIpCdt").setValue(closeDate);
                    }
                    // this.getView().byId("idDcCbDs2").setSelected(dropShip2);
                    //setting values in descripancy details 
                    this.getView().byId("idDcTAPi").setValue(prelimInvest);
                    this.getView().byId("idDcCbPrq").setSelected(partQuarantine);
                    this.getView().byId("idDcCbMesi").setValue(mesIssue);
                    this.getView().byId("idDcCbCsmsi").setValue(csmsIssue);
                    this.getView().byId("idDcCobPc").setSelectedKey(prelimCause);
                    this.getView().byId("idDcIpDc").setValue(defectCode);
                    this.getView().byId("idDcTxtDc").setText(defectCodeDesc);
                    this.getView().byId("idDcIpDcVal1").setValue(defect);
                    this.getView().byId("idDcIpDp").setValue(dropPoint);
                    this.getView().byId("idDcTxtIs").setValue(is);
                    this.getView().byId("idDcTaSb").setValue(shouldbe);
                    this.getView().byId("idDcInpAp").setValue(asPer);
                    if (this.getView().byId("idDcCobDscNo").getValue() === "") {
                        this.getView().byId("idDcCbIf").setSelected(true);
                        this.getView().byId("idDcCbIf").setEnabled(false);
                    } else {
                        this.getView().byId("idDcCbIf").setSelected(incompletion);
                        this.getView().byId("idDcCbIf").setEnabled(true);
                    }
                    if (this.getView().byId("idDcCbIf").getSelected() === true) {
                        this.oDiscIncompleteFlag = true;
                    } else {
                        this.oDiscIncompleteFlag = false;
                    }
                    if (discrepancyNo != "") {
                        oDiscrepancy = discrepancyNo;
                        if (oNctype == "STOCK PURGE") {
                            this.getView().byId("idDcBtStkPrg").setVisible(true);
                        } else {
                            this.getView().byId("idDcBtStkPrg").setVisible(false);
                        }
                    }
                    if (oNctype == "STOCK PURGE") {
                        this.getView().byId("idDiscAircraft").setRequired(true);
                    } else {
                        this.getView().byId("idDiscAircraft").setRequired(false);
                    }

                    if (linkedTo == "AIRCRAFT" || linkedTo == "ASSEMBLY") {
                        this.getView().byId("idDiscAircraft").setRequired(true);
                        this.getView().byId("idLblDiscLiability").setRequired(true);
                        this.getView().byId("idLblDiscQtyIns").setRequired(true);
                        this.getView().byId("idLblDiscQtyRej").setRequired(true);
                        this.getView().byId("idLblDiscDefCode").setRequired(true);
                        this.getView().byId("idDcTxtIs").setRequired(true);
                    } else {
                        this.getView().byId("idDiscAircraft").setRequired(false);
                        this.getView().byId("idLblDiscLiability").setRequired(false);
                        this.getView().byId("idLblDiscQtyIns").setRequired(false);
                        this.getView().byId("idLblDiscQtyRej").setRequired(false);
                        this.getView().byId("idLblDiscDefCode").setRequired(false);
                        this.getView().byId("idDcTxtIs").setRequired(false);
                    }
                    this.getView().byId("idDiscAircraft").setValueState("None");
                    this.getView().byId("idDcIpLblty").setValueState("None");
                    this.getView().byId("idDiscQtyIns").setValueState("None");
                    this.getView().byId("idDiscQtyRej").setValueState("None");
                    this.getView().byId("idDcIpDc").setValueState("None");
                    this.getView().byId("idDcTxtIs").setValueState("None");

                    this.getView().byId("idDiscAircraft").setValueStateText();
                    this.getView().byId("idDcIpLblty").setValueStateText();
                    this.getView().byId("idDiscQtyIns").setValueStateText();
                    this.getView().byId("idDiscQtyRej").setValueStateText();
                    this.getView().byId("idDcIpDc").setValueStateText();
                    this.getView().byId("idDcTxtIs").setValueStateText();

                    if (this.sFlag == "Copy Discrepancy") {
                        this.getView().byId("idObjNCStatusDiscrep").setText();
                        this.getView().byId("headertext").setText("Discrepancy No: ");
                        this.getView().byId("idDcCobDscNo").setValue();
                        this.getView().byId("idDcCobDscNo").setSelectedKey();
                        this._oMultiInputDiscSN.removeAllTokens();
                        this._oMultiInputDiscTN.removeAllTokens();
                        this.getView().byId("idDcCbIf").setSelected(true);
                    }

                    if (discstatus == "Cancelled") {
                        this.getView().byId("idBtnCancel").setEnabled(false);
                    } else {
                        this.getView().byId("idBtnCancel").setEnabled(true);
                    }

                    if (this.workingQueueMode == "EDIT") {
                        var discreODataArray = [];
                        var oROModel;
                        if (rodiscfield != "") {
                            discreODataArray = rodiscfield.split(",");
                            oROModel = Utils.getReadonlyPropField(discreODataArray, "Discre");
                        } else {
                            oROModel = Utils.getReadonlyPropField(discreODataArray, "Discre");
                        }
                        this.bindRODispProps(oROModel);
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        bindRODispProps: function (oROModel) {
            this.getView().byId("idComBoxDiscLinkTo").setEnabled(oROModel.oData.LinkedTo);
            this.getView().byId("idDcIpLblty").setEnabled(oROModel.oData.Liability);
            this.getView().byId("idDiscLbltyTxt").setEditable(oROModel.oData.LiabilityText);
            this.getView().byId("idDcIpPrtnr").setEditable(oROModel.oData.Partner);
            this.getView().byId("idDcIpSpsdsItm").setEditable(oROModel.oData.SupercedesItem);
            this.getView().byId("idDcIpSpsdbyItm").setEditable(oROModel.oData.SupercededByItem);
            // this.getView().byId("idDcCbDs2").setEnabled(oROModel.oData.DropShip2);
            this.getView().byId("idDiscAircraft").setEditable(oROModel.oData.Aircraft);
            this.getView().byId("idDiscPartNumber").setEditable(oROModel.oData.PartNumber);
            this.getView().byId("idDiscPartDesc").setEditable(oROModel.oData.PartDesc);
            this.getView().byId("idMulInpDiscSerNo").setEditable(oROModel.oData.CompSerialNo);
            this.getView().byId("idMulInpDiscTrcNo").setEditable(oROModel.oData.TraceNo);
            this.getView().byId("idDiscQtyIns").setEditable(oROModel.oData.InspQnty);
            this.getView().byId("idDiscQtyRej").setEditable(oROModel.oData.RejectQnty);
            // this.getView().byId("idMulInpDiscSerNo").setEditable(oROModel.oData.RejectQnty);
            // this.getView().byId("idMulInpDiscTrcNo").setEditable(oROModel.oData.RejectQnty);
            this.getView().byId("idDcTAPi").setEditable(oROModel.oData.PrelimInvest);
            this.getView().byId("idDcCbPrq").setEnabled(oROModel.oData.PartQuarantine);
            this.getView().byId("idDcCbMesi").setEditable(oROModel.oData.MESissue);
            this.getView().byId("idDcCbCsmsi").setEditable(oROModel.oData.CsmsIssue);
            this.getView().byId("idDcCobPc").setEnabled(oROModel.oData.PrelimCause);
            this.getView().byId("idDcIpDc").setEditable(oROModel.oData.DefectCode);
            this.getView().byId("idDcIpDp").setEditable(oROModel.oData.DropPoint);
            this.getView().byId("idDcTxtIs").setEditable(oROModel.oData.Is);
            this.getView().byId("idDcTaSb").setEditable(oROModel.oData.Shouldbe);
            //this.getView().byId("idDcCobPcAsper").setEnabled(oROModel.oData.);
            this.getView().byId("idDcInpAp").setEditable(oROModel.oData.AsPer);
            this.getView().byId("idDcCbIf").setEnabled(oROModel.oData.Incompletion);
            this.getView().byId("idncrsave").setVisible(oROModel.oData.Button);
        },

        /**Function is triggered on selection change of format ComboBox */
        _onSelectingFormat: function (oEvent) {
            var format = oEvent.getParameters("selectedItem").selectedItem.getKey();
            sap.ui.core.BusyIndicator.show();
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/AsPerSet(Asper='" + format + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.AsperValue;
                    const textArray = data.split("</n>");
                    var rows = textArray.length;
                    var text = "";
                    for (var i = 0; i < rows; i++) {
                        var text = text + textArray[i] + "\n";
                    }
                    this.getView().byId("idDcInpAp").setRows(rows);
                    //this.getView().byId("idDcInpAp").setValue(textArray);
                    //this.getView().byId("idDcInpAp").setValue(data);
                    this.getView().byId("idDcInpAp").setValue(text);
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        handleAircraftChange: function () {
            var oInput = this.getView().byId("idInpAircraft").getValue();
            if (oInput !== "") {
                this.getView().byId("idInpAircraft").setValueState("None");
                this.getView().byId("idInpAircraft").setValueStateText("");
            }
        },

        onNcrchange: function (oEvent) {
            var nctype = this.getView().byId("idCombNcType").getSelectedKey();
            var notifNo = sObjectId;
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/NCTypeChangeSet(NotificationNo='" + notifNo + "',NCType='" + nctype + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    this.getView().byId("idCombNcType").setSelectedKey(nctype);
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                    this.getView().byId("idCombNcType").setSelectedKey(oNctype);
                }.bind(this)
            });
        },

        inEnter: function () {
            var inw = this.getView().byId("idin").getValue();
            if (inw === "") {
                this.getView().byId("idin").setValueState("Warning");
                this.getView().byId("idin").setValueStateText("Enter Input Value");
            } else {
                this.getView().byId("idin").setValueState("None");
                this.getView().byId("idin").setValueStateText();
            }
        },

        poEnter: function () {
            var pono = this.getView().byId("idpono").getValue();
            if (pono === "") {
                this.getView().byId("idpono").setValueState("Warning");
                this.getView().byId("idpono").setValueStateText("PO Number");
            } else {
                this.getView().byId("idpono").setValueState("None");
                this.getView().byId("idpono").setValueStateText();
            }
        },

        PurchaseEnter: function () {
            var porder = this.getView().byId("idporder").getValue();
            if (porder === "") {
                this.getView().byId("idporder").setValueState("Warning");
                this.getView().byId("idporder").setValueStateText("Enter Purchase Order Value");
            } else {
                this.getView().byId("idporder").setValueState("None");
                this.getView().byId("idporder").setValueStateText();
            }
        },

        onCreate: function () {
            var ic = this.getView().byId("idIconTabBarHeader");

            /*	var ncr = this.getView().byId("idncr").getSelected();
                var snag = this.getView().byId("idsnag").getSelected();
                var stock = this.getView().byId("idstock").getSelected();
                var supplier = this.getView().byId("idsupplier").getSelected();*/

            var inw = this.getView().byId("idin").getValue();
            var pono = this.getView().byId("idpono").getValue();
            var porder = this.getView().byId("idporder").getValue();

            if (inw === "" || pono === "" || porder === "") {
                /*this.getView().byId("idncr").setValueState("Warning");
                this.getView().byId("idsnag").setValueState("Warning");
                this.getView().byId("idstock").setValueState("Warning");
                this.getView().byId("idsupplier").setValueState("Warning");*/

                this.getView().byId("idin").setValueState("Warning");
                this.getView().byId("idpono").setValueState("Warning");
                this.getView().byId("idporder").setValueState("Warning");

                this.getView().byId("idin").setValueStateText("Enter Input Value");
                this.getView().byId("idpono").setValueStateText("Enter PO Number");
                this.getView().byId("idporder").setValueStateText("Enter Purchase Order Value");
            } else {
                for (var i in ic.getItems()) {
                    ic.getItems()[i].setVisible(true);
                }
            }
        },

        handleValueHelp: function () {
            this.Dialog = sap.ui.xmlfragment("com.airbus.Zncreport.fragments.disposition", this);
            this.Dialog.open();

        },
        onClose: function (oEvent) {
            this.Dialog.close();
            this.Dialog.destroy();
        },

        handleValueHelp1: function (oEvent) {
            /*	var oDialog1 = sap.ui.xmlfragment("com.airbus.Zncreport.fragments.disposition",
                    this);
                oDialog1.open();*/
            this._getDialog().open();
        },

        _getDialog: function () {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.controller.fragments.disposition");
                this.getView().addDependent(this._oDialog);
            }
            return this._oDialog;
        },

        onRadioSelectLocation: function (oEvent) {
            var rsel = oEvent.getSource().getSelectedKey();
            this.getView().byId("idFuselage").setVisible(false);
            this.getView().byId("idWing").setVisible(false);
            this.getView().byId("idVertical").setVisible(false);
            this.getView().byId("idRudder").setVisible(false);
            this.getView().byId("idHorizontal").setVisible(false);
            this.getView().byId("idPlyon").setVisible(false);
            this.getView().byId("idOthers").setVisible(false);
            switch (rsel) {

                case "wing":
                    this.getView().byId("idWing").setVisible(true);
                    break;
                case "vertical":
                    this.getView().byId("idVertical").setVisible(true);
                    break;
                case "rudder":
                    this.getView().byId("idRudder").setVisible(true);
                    break;
                case "horiz":
                    this.getView().byId("idHorizontal").setVisible(true);
                    break;
                case "pylon":
                    this.getView().byId("idPlyon").setVisible(true);
                    break;
                case "others":
                    this.getView().byId("idOthers").setVisible(true);
                    break;
                default:
                    this.getView().byId("idFuselage").setVisible(true);
            }

        },

        // Added code for initialisation, loading and associated events related to component serial number multi input field  - Code Start
        onOpenVHSerNo: function () {
            this.oSerNoColModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/sernocolumnsModel.json");
            var aCols = this.oSerNoColModel.getData().cols;
            this._oBasicSearchFieldSN = new SearchField({
                showSearchButton: false
            });
            sap.ui.core.BusyIndicator.show();
            this._oValueHelpDialogSN = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SerialNoVHDialog", this);
            this.getView().addDependent(this._oValueHelpDialogSN);
            this._oValueHelpDialogSN.getFilterBar().setBasicSearch(this._oBasicSearchFieldSN);
            this._oValueHelpDialogSN.getTableAsync().then(function (oTable) {
                sap.ui.core.BusyIndicator.show();
                var oModel = new sap.ui.model.json.JSONModel();
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilter = [];
                if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                    oFilter.push(new Filter("Key", FilterOperator.EQ, "SERNR"));
                    if (this.getView().byId("idInpPartNo").getValue() !== "") {
                        var oMatNo = this.getView().byId("idInpPartNo").getValue();
                        oFilter.push(new Filter("Value", FilterOperator.EQ, oMatNo));
                    }
                }

                if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                    oFilter.push(new Filter("Key", FilterOperator.EQ, "DISCSERNR"));
                    if (this.getView().byId("idDiscPartNumber").getValue() !== "") {
                        var oDiscMatNo = this.getView().byId("idDiscPartNumber").getValue();
                        oFilter.push(new Filter("Value", FilterOperator.EQ, oDiscMatNo));
                    }
                }

                var sPath = "/f4_genericSet";
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        oTable.setModel(oModel);
                        oTable.setModel(this.oSerNoColModel, "columns");

                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", "/");
                        }

                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/", function () {
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        return new Label({ text: "{" + column.template + "}" });
                                    })
                                });
                            });
                        }
                        this._oValueHelpDialogSN.update();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            }.bind(this));
            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                this._oValueHelpDialogSN.setTokens(this._oMultiInputSN.getTokens());
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                this._oValueHelpDialogSN.setTokens(this._oMultiInputDiscSN.getTokens());
            }
            this._oValueHelpDialogSN.open();
            sap.ui.core.BusyIndicator.hide();
        },

        onFilterBarSearchSN: function (oEvent) {
            var sSearchQuery = this._oBasicSearchFieldSN.getValue(),
                aSelectionSet = oEvent.getParameter("selectionSet");
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }
                return aResult;
            }, []);

            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "Value", operator: FilterOperator.Contains, value1: sSearchQuery })
                ],
                and: false
            }));

            this._filterTable(new Filter({
                filters: aFilters,
                and: true
            }));
        },

        _filterTable: function (oFilter) {
            var oValueHelpDialog = this._oValueHelpDialogSN;
            oValueHelpDialog.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                    oTable.getBinding("rows").filter(oFilter);
                }
                if (oTable.bindItems) {
                    oTable.getBinding("items").filter(oFilter);
                }
                oValueHelpDialog.update();
            });
        },

        onValueHelpSNOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                this._oMultiInputSN.setTokens(aTokens);
                this._oValueHelpDialogSN.close();
                if (aTokens.length > 0 && this.getView().byId("idMNInputSN").getValueState() === "Error") {
                    this.getView().byId("idMNInputSN").setValueState("None");
                    this.getView().byId("idMNInputSN").setValueStateText("");
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                this._oMultiInputDiscSN.setTokens(aTokens);
                this._oValueHelpDialogSN.close();
            }
        },

        onValueHelpSNCancelPress: function () {
            this._oValueHelpDialogSN.close();
        },

        onValueHelpSNAfterClose: function () {
            this._oValueHelpDialogSN.destroy();
        },

        // Added code for initialisation, loading and associated events related to component serial number multi input field  - Code End

        // Added code for initialisation, loading and associated events related to traceability multi input field  - Code Start
        onOpenVHTrcNo: function () {
            this.oTrcNoColModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/trcnocolumnsModel.json");
            var aCols = this.oTrcNoColModel.getData().cols;
            this._oBasicSearchFieldTN = new SearchField({
                showSearchButton: false
            });
            sap.ui.core.BusyIndicator.show();
            this._oValueHelpDialogTN = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.TraceabilityVHDialog", this);
            this.getView().addDependent(this._oValueHelpDialogTN);
            this._oValueHelpDialogTN.getFilterBar().setBasicSearch(this._oBasicSearchFieldTN);
            this._oValueHelpDialogTN.getTableAsync().then(function (oTable) {
                sap.ui.core.BusyIndicator.show();
                var oModel = new sap.ui.model.json.JSONModel();
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilter = [];
                oFilter.push(new Filter("Key", FilterOperator.EQ, "TRACE"));
                if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                    if (this.getView().byId("idInpPartNo").getValue() !== "") {
                        var oMatNo = this.getView().byId("idInpPartNo").getValue();
                        oFilter.push(new Filter("Value", FilterOperator.EQ, oMatNo));
                    }
                }

                if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                    if (this.getView().byId("idDiscPartNumber").getValue() !== "") {
                        var oDiscMatNo = this.getView().byId("idDiscPartNumber").getValue();
                        oFilter.push(new Filter("Value", FilterOperator.EQ, oDiscMatNo));
                    }
                }

                var sPath = "/f4_genericSet";
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        oTable.setModel(oModel);
                        oTable.setModel(this.oTrcNoColModel, "columns");

                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", "/");
                        }

                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/", function () {
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        return new Label({ text: "{" + column.template + "}" });
                                    })
                                });
                            });
                        }
                        this._oValueHelpDialogTN.update();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            }.bind(this));
            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                this._oValueHelpDialogTN.setTokens(this._oMultiInputTN.getTokens());
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                this._oValueHelpDialogTN.setTokens(this._oMultiInputDiscTN.getTokens());
            }
            this._oValueHelpDialogTN.open();
            sap.ui.core.BusyIndicator.hide();
        },

        onValueHelpTNOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                this._oMultiInputTN.setTokens(aTokens);
                this._oValueHelpDialogTN.close();
                if (aTokens.length > 0 && this.getView().byId("idMNInputTN").getValueState() === "Error") {
                    this.getView().byId("idMNInputTN").setValueState("None");
                    this.getView().byId("idMNInputTN").setValueStateText("");
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                this._oMultiInputDiscTN.setTokens(aTokens);
                this._oValueHelpDialogTN.close();
            }
        },

        onValueHelpTNCancelPress: function () {
            this._oValueHelpDialogTN.close();
        },

        onValueHelpTNAfterClose: function () {
            this._oValueHelpDialogTN.destroy();
        },

        onFilterBarSearchTN: function (oEvent) {
            var sSearchQuery = this._oBasicSearchFieldTN.getValue(),
                aSelectionSet = oEvent.getParameter("selectionSet");
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }

                return aResult;
            }, []);

            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "Value", operator: FilterOperator.Contains, value1: sSearchQuery })
                ],
                and: false
            }));

            this._filterTableTN(new Filter({
                filters: aFilters,
                and: true
            }));
        },

        _filterTableTN: function (oFilter) {
            var oValueHelpDialog = this._oValueHelpDialogTN;
            oValueHelpDialog.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                    oTable.getBinding("rows").filter(oFilter);
                }
                if (oTable.bindItems) {
                    oTable.getBinding("items").filter(oFilter);
                }
                oValueHelpDialog.update();
            });
        },
        // Added code for initialisation, loading and associated events related to traceability multi input field  - Code End

        // Added code for Serial Number Multi Input token when the tokens aggregation changed due to a user interaction   - Code Start
        _onTokenUpdateSN: function (oEvent) {
            var aTokens,
                sTokensText = "",
                sNo,
                i,
                j,
                bFlag = true;

            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                if (oEvent.getParameter('type') === Tokenizer.TokenUpdateType.Added) {
                    aTokens = oEvent.getParameter('addedTokens');
                    sTokensText = "Added tokens: ";
                    sap.ui.core.BusyIndicator.show();
                    var oModel = new sap.ui.model.json.JSONModel();
                    var oDataModel = this.getOwnerComponent().getModel();
                    var oFilter = [];
                    oFilter.push(new Filter("Key", FilterOperator.EQ, "SERNR"));
                    if (this.getView().byId("idInpPartNo").getValue() !== "") {
                        var oMaterNo = this.getView().byId("idInpPartNo").getValue();
                        oFilter.push(new Filter("Value", FilterOperator.EQ, oMaterNo));
                    }
                    var sPath = "/f4_genericSet";
                    oDataModel.read(sPath, {
                        filters: oFilter,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results;
                            oModel.setData(data);
                            for (i = 0; i < aTokens.length; i++) {
                                this.getView().byId("idMNInputSN").setValueState("None");
                                this.getView().byId("idMNInputSN").setValueStateText("");
                                sTokensText = aTokens[i].getText();
                                if (oModel.getData().length === 0) {
                                    bFlag = false;
                                    break;
                                } else {
                                    for (j = 0; j < oModel.getData().length; j++) {
                                        sNo = oModel.getData()[j].Value;
                                        if (sTokensText === sNo) {
                                            bFlag = true;
                                            break;
                                        } else {
                                            bFlag = false;
                                        }
                                    }
                                }
                            }
                            if (bFlag === false) {
                                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                                var oTokUpdateSnMsg = this.getView().getModel("i18n").getProperty("TokenUpdateSerNoMsg");
                                MessageBox.information(
                                    oTokUpdateSnMsg,
                                    {
                                        styleClass: bCompact ? "sapUiSizeCompact" : ""
                                    }
                                );
                            }
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                if (oEvent.getParameter('type') === Tokenizer.TokenUpdateType.Added) {
                    aTokens = oEvent.getParameter('addedTokens');
                    sTokensText = "Added tokens: ";
                    sap.ui.core.BusyIndicator.show();
                    var oModel = new sap.ui.model.json.JSONModel();
                    var oDataModel = this.getOwnerComponent().getModel();
                    var oFilter = [];
                    oFilter.push(new Filter("Key", FilterOperator.EQ, "DISCSERNR"));
                    if (this.getView().byId("idDiscPartNumber").getValue() !== "") {
                        var oMaterNo = this.getView().byId("idDiscPartNumber").getValue();
                        oFilter.push(new Filter("Value", FilterOperator.EQ, oMaterNo));
                    }
                    var sPath = "/f4_genericSet";
                    oDataModel.read(sPath, {
                        filters: oFilter,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results;
                            oModel.setData(data);
                            for (i = 0; i < aTokens.length; i++) {
                                sTokensText = aTokens[i].getText();
                                if (oModel.getData().length === 0) {
                                    bFlag = false;
                                    break;
                                } else {
                                    for (j = 0; j < oModel.getData().length; j++) {
                                        sNo = oModel.getData()[j].Value;
                                        if (sTokensText === sNo) {
                                            bFlag = true;
                                            break;
                                        } else {
                                            bFlag = false;
                                        }
                                    }
                                }
                            }
                            if (bFlag === false) {
                                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                                var oTokUpdateSnMsg = this.getView().getModel("i18n").getProperty("TokenUpdateSerNoMsg");
                                MessageBox.information(
                                    oTokUpdateSnMsg,
                                    {
                                        styleClass: bCompact ? "sapUiSizeCompact" : ""
                                    }
                                );
                            }
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                }
            }
        },
        // Added code for Serial Number Multi Input token when the tokens aggregation changed due to a user interaction   - Code End 

        // Added code for Traceability Number Multi Input token when the tokens aggregation changed due to a user interaction   - Code Start
        _onTokenUpdateTN: function (oEvent) {
            var aTokens,
                sTokensText = "",
                tNo,
                i,
                j,
                bFlag = true;
            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                if (oEvent.getParameter('type') === Tokenizer.TokenUpdateType.Added) {
                    this.getView().byId("idMNInputTN").setValueState("None");
                    this.getView().byId("idMNInputTN").setValueStateText("");
                    aTokens = oEvent.getParameter('addedTokens');
                    sTokensText = "Added tokens: ";
                    sap.ui.core.BusyIndicator.show();
                    var oModel = new sap.ui.model.json.JSONModel();
                    var oDataModel = this.getOwnerComponent().getModel();
                    var oFilter = [];
                    oFilter.push(new Filter("Key", FilterOperator.EQ, "TRACE"));
                    if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                        if (this.getView().byId("idInpPartNo").getValue() !== "") {
                            var oMatNo = this.getView().byId("idInpPartNo").getValue();
                            oFilter.push(new Filter("Value", FilterOperator.EQ, oMatNo));
                        }
                    }
                    var sPath = "/f4_genericSet";
                    oDataModel.read(sPath, {
                        filters: oFilter,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results;
                            oModel.setData(data);
                            for (i = 0; i < aTokens.length; i++) {
                                sTokensText = aTokens[i].getText();
                                if (oModel.getData().length === 0) {
                                    bFlag = false;
                                    break;
                                } else {
                                    for (j = 0; j < oModel.getData().length; j++) {
                                        tNo = oModel.getData()[j].Value;
                                        if (sTokensText === tNo) {
                                            bFlag = true;
                                            break;
                                        } else {
                                            bFlag = false;
                                        }
                                    }
                                }
                            }
                            if (bFlag === false) {
                                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                                var oTokUpdateTnMsg = this.getView().getModel("i18n").getProperty("TokenUpdateTrcNoMsg");
                                MessageBox.information(
                                    oTokUpdateTnMsg,
                                    {
                                        styleClass: bCompact ? "sapUiSizeCompact" : ""
                                    }
                                );
                            }
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                if (oEvent.getParameter('type') === Tokenizer.TokenUpdateType.Added) {
                    aTokens = oEvent.getParameter('addedTokens');
                    sTokensText = "Added tokens: ";
                    sap.ui.core.BusyIndicator.show();
                    var oModel = new sap.ui.model.json.JSONModel();
                    var oDataModel = this.getOwnerComponent().getModel();
                    var oFilter = [];
                    oFilter.push(new Filter("Key", FilterOperator.EQ, "TRACE"));
                    if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                        if (this.getView().byId("idDiscPartNumber").getValue() !== "") {
                            var oDiscMatNo = this.getView().byId("idDiscPartNumber").getValue();
                            oFilter.push(new Filter("Value", FilterOperator.EQ, oDiscMatNo));
                        }
                    }
                    var sPath = "/f4_genericSet";
                    oDataModel.read(sPath, {
                        filters: oFilter,
                        success: function (oData, oResult) {
                            sap.ui.core.BusyIndicator.hide();
                            var data = oData.results;
                            oModel.setData(data);
                            for (i = 0; i < aTokens.length; i++) {
                                sTokensText = aTokens[i].getText();
                                if (oModel.getData().length === 0) {
                                    bFlag = false;
                                    break;
                                } else {
                                    for (j = 0; j < oModel.getData().length; j++) {
                                        tNo = oModel.getData()[j].Value;
                                        if (sTokensText === tNo) {
                                            bFlag = true;
                                            break;
                                        } else {
                                            bFlag = false;
                                        }
                                    }
                                }
                            }
                            if (bFlag === false) {
                                var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                                var oTokUpdateTnMsg = this.getView().getModel("i18n").getProperty("TokenUpdateTrcNoMsg");
                                MessageBox.information(
                                    oTokUpdateTnMsg,
                                    {
                                        styleClass: bCompact ? "sapUiSizeCompact" : ""
                                    }
                                );
                            }
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                }
            }
        },
        // Added code for Traceability Number Multi Input token when the tokens aggregation changed due to a user interaction   - Code End 

        //Added Code for Value help for GR , Purchase Order and SAP Supplier CodeFields- Code Start
        onGRhelpRequest: function (oEvent) {
            this._valuhelpFlag = "GR";
            this._oGRDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.ZQM_NCR.fragments.GrValueHelp", this);
            this.getView().addDependent(this._oGRDialog);
            this._oGRDialog.open();
        },

        onPurchOrdhelpRequest: function () {
            this._valuhelpFlag = "PO";
            this._oPODialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.ZQM_NCR.fragments.PoValueHelp", this);
            this.getView().addDependent(this._oPODialog);
            this._oPODialog.open();
        },

        onSuppSAPCodehelpRequest: function () {
            this._oSSCDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SSCValueHelp", this);
            this.getView().addDependent(this._oSSCDialog);
            this._oSSCDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/SupplierCodeSet"
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oSSCDialog.setModel(oModel, "supplierCodeModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        /** Function Triggered when searchin in SAP Supplier Code standard dialog */
        onSearchSSC: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("SupplierCodeID", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        handleChangeSupplierSapCode: function () {
            if (this.getView().byId("idPurInfSupSCip").getValue() === "") {
                this.getView().byId("idPurInfSupNmip").setValue();
            }
        },

        //Added code for GR and PO Filterbar search - Code Start
        onGRfbSearch: function () {

            var oGRModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/localjson/grdata.json");
            this.getView().setModel(oGRModel, "grsearch");
        },

        onPOfbSearch: function () {
            var oPOModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/localjson/podata.json");
            this.getView().setModel(oPOModel, "posearch");
        },
        //Added code for GR and PO  Filterbar search - Code End

        //Added code for Slection Change in PO and GR Search Tables - Code Start
        handleGRItemSelection: function (oEvent) {
            var oSelectedItem = oEvent.getParameters("selectedItem").listItem.getBindingContext("oGRModel").getProperty("GoodsReceiptNum");
            var oSelectedItem1 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oGRModel").getProperty("GoodsRecpItem");
            var oSelectedItem2 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oGRModel").getProperty("GoodsRecpYear");
            var oSelectedItem3 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oGRModel").getProperty("GRQty");
            var oSelectedItem4 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oGRModel").getProperty("GRUom");
            var oInput = this.getView().byId("idPurInfGrip");
            var oInput1 = this.getView().byId("idInpPurInfGritm");
            var oInput2 = this.getView().byId("idInpPurInfGryr");
            var oInput3 = this.getView().byId("idPurInfGrQtyip");
            var oInput4 = this.getView().byId("idPurInfGrUom");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem);
            oInput1.setValue(oSelectedItem1);
            oInput2.setValue(oSelectedItem2);
            oInput3.setValue(oSelectedItem3);
            oInput4.setValue(oSelectedItem4);
            this._oGRDialog.destroy();
        },

        handlePurOrdItemSelection: function (oEvent) {
            var oSelectedItem = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPrModel").getProperty("PurchaseOrderNum");
            var oSelectedItem1 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPrModel").getProperty("PurchaseItem");
            var oSelectedItem2 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPrModel").getProperty("SupplierCode");
            var oSelectedItem3 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPrModel").getProperty("SupplierName");
            var oSelectedItem4 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPrModel").getProperty("PartNumber");
            var oSelectedItem5 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPrModel").getProperty("PartName");
            var oSelectedItem6 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPrModel").getProperty("MRPControllerNo");
            var oSelectedItem7 = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPrModel").getProperty("MRPControllerName");
            var oInput = this.getView().byId("idPurInfPurOrdip");
            var oInput1 = this.getView().byId("idPurInfPolnip");
            var oInput2 = this.getView().byId("idPurInfSupSCip");
            var oInput3 = this.getView().byId("idPurInfSupNmip");
            var oInput4 = this.getView().byId("idPurInfSupPnip");
            var oInput5 = this.getView().byId("idPurInfSupPnDescip");
            var oInput6 = this.getView().byId("idPurInfMrpcrip");
            var oInput7 = this.getView().byId("idPurInfMrpcrnmip");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem);
            oInput1.setValue(oSelectedItem1);
            oInput2.setValue(oSelectedItem2);
            oInput3.setValue(oSelectedItem3);
            oInput4.setValue(oSelectedItem4);
            oInput5.setValue(oSelectedItem5);
            oInput6.setValue(oSelectedItem6);
            oInput7.setValue(oSelectedItem7);
            this._oPODialog.destroy();
        },
        //Added code for Slection Change in PO and GR Search Tables - Code End

        _confirmGRValueHelpDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idPurInfGrip");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oGRDialog.destroy();
        },

        _confirmPOValueHelpDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idPurInfPurOrdip");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oPODialog.destroy();
        },

        _confirmSSCValueHelpDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idPurInfSupSCip"),
                oInpDesc = this.getView().byId("idPurInfSupNmip");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            oInpDesc.setValue(oSelectedItem.getInfo());
            this._oSSCDialog.destroy();
        },

        _handleGRValueHelpClose: function () {
            //this._oGRDialog.close();
            this._oGRDialog.destroy();
        },

        _handlePOValueHelpClose: function () {
            //this._oPODialog.close();
            this._oPODialog.destroy();
        },

        _handleSSCValueHelpClose: function () {
            //this._oSSCDialog.close();
            this._oSSCDialog.destroy();
        },

        //Added Code for Value help for GR , Purchase Order and SAP Supplier Code Fields- Code End

        // Added code for various VH's in NC Header screen, associated events and other validations - Code Start
        onVHReqProductCode: function () {
            this._oProdCodeDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.ProductCodeVH", this);
            this.getView().addDependent(this._oProdCodeDialog);
            this._oProdCodeDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "PRDCOD"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oProdCodeDialog.setModel(oModel, "ProductCodeModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configProdCodeVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idInpProdCode");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oProdCodeDialog.destroy();
        },

        onSearchProductCode: function () {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _onValueHelpReqWorkIns: function (oEvent) {
            this._oWrkInsDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.WorkInstructionVH", this);
            this.getView().addDependent(this._oWrkInsDialog);
            this._oWrkInsDialog.open();
            this.oWorkInstructionInp = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "WRKINS"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oWrkInsDialog.setModel(oModel, "oWRSuggestionModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configWrkInsVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oWorkInstructionInp;
            // this.getView().byId("idInpWrkIns");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oWrkInsDialog.destroy();
        },

        onSearchOrderWorkInst: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onVHReqPrdOrd: function () {
            this._oPrdOrdDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.ProductionOrderVH", this);
            this.getView().addDependent(this._oPrdOrdDialog);
            this._oPrdOrdDialog.open();

            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
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
        },

        /**
        * Function is triggered when the close button in Production Order value help is pressed to close
        * @function
        */
        onCloseProdOrdPopup: function () {
            this._oPrdOrdDialog.close();
            this._oPrdOrdDialog.destroy();
        },

        /**
        * Function is triggered when the value help indicator for NLP as in filter bar field of Production Order Value Help is clicked
        * @function
        */
        _onValueHelpReqNLP: function () {
            this._oNLPDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NLP", this);
            this.getView().addDependent(this._oNLPDialog);
            this._oNLPDialog.open();
            var oDataModel = this.getOwnerComponent().getModel();
            //NLP  Showsuggestion s
            var oNLPSugModel = new JSONModel();
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

        /**
        * Function is fired when the NLP as in filter bar field of Production Order value help dialog is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
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

        _onProdOrdSearchGo: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
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
                    var data = oData.results;
                    if (data.length === 0 && sap.ui.getCore().byId("idFlBarPrOrdVhPrdseq").getValue() === "" && sap.ui.getCore().byId(
                        "idFlBarPrOrdVhPartNo").getValue() === "" && sap.ui.getCore().byId("idFlBarPrOrdVhnlp").getValue() === "" && sap.ui.getCore()
                            .byId("idFlBarPrOrdVhWrkIns").getValue() === "") {
                        var oProdOrdNodata = this.getView().getModel("i18n").getProperty("ProductionorderWRNodata");
                        MessageBox.warning(
                            oProdOrdNodata, {
                            icon: MessageBox.Icon.WARNING,
                            title: "No matching order found",
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            initialFocus: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                if (sAction == MessageBox.Action.OK) { }
                            }.bind(this)
                        }
                        );
                    } else if (data.length === 0 && (sap.ui.getCore().byId("idFlBarPrOrdVhPrdseq").getValue() !== "" || sap.ui.getCore().byId(
                        "idFlBarPrOrdVhPartNo").getValue() !== "" ||
                        sap.ui.getCore().byId("idFlBarPrOrdVhnlp").getValue() !== "" ||
                        sap.ui.getCore().byId("idFlBarPrOrdVhWrkIns").getValue() !== "")) {
                        var oPartnerCodeMsg = this.getView().getModel("i18n").getProperty("PartnerCodeMsg");
                        MessageBox.warning(
                            oPartnerCodeMsg, {
                            icon: MessageBox.Icon.WARNING,
                            title: "No matching order found",
                            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                            emphasizedAction: MessageBox.Action.OK,
                            initialFocus: MessageBox.Action.CANCEL,
                            onClose: function (sAction) {
                                if (sAction == MessageBox.Action.OK) {
                                    // setting i18n model on select partner code fragment
                                    var i18nModel = new sap.ui.model.resource.ResourceModel({
                                        bundleName: "com.airbus.ZQM_NCR.i18n.i18n"
                                    });
                                    if (!this._oSelPartDialog) {
                                        Fragment.load({
                                            name: "com.airbus.ZQM_NCR.fragments.selectPartnerCode",
                                            controller: this
                                        }).then(function (oDialog) {
                                            this._oSelPartDialog = oDialog;
                                            this._oSelPartDialog.setModel(this.getOwnerComponent().getModel());
                                            this._oSelPartDialog.setModel(i18nModel, "i18n");
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
                    sap.ui.core.BusyIndicator.hide();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        handleCloseUserValueHelpProdOrd: function (oEvent) {
            var oSelectedItem = oEvent.getParameters("selectedItem").listItem.getBindingContext("oPOModel").getProperty("Order");
            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                var oInput = this.getView().byId("idInpPrdOrd");
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Dispo") {
                var oInput = this.getView().byId("idmrbOrderno");
            }
            if (!oSelectedItem && !oSelectedItemSub) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem);
            this._oPrdOrdDialog.close();
            this._oPrdOrdDialog.destroy();
        },

        handleSearchPartnerCode: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = [];
            oFilter.push(new Filter("ProductCode", sap.ui.model.FilterOperator.Contains, sValue));
            oFilter.push(new Filter("PartnerCode", sap.ui.model.FilterOperator.Contains, sValue));
            oFilter.push(new Filter("ParentPartNumber", sap.ui.model.FilterOperator.Contains, sValue));
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(oFilter);
        },

        handleConfirmPartnerCode: function (oEvent) {
            var oSelProdCode = oEvent.getParameters().selectedItem.getBindingContext().getProperty("ParentPartNumber");
            var oSelProdFrom = oEvent.getParameters().selectedItem.getBindingContext().getProperty("ProductSeqFrom");
            var oSelProdTo = oEvent.getParameters().selectedItem.getBindingContext().getProperty("ProductSeqTo");
            var oSelProdseqRange = oSelProdFrom + "," + oSelProdTo;
            if (oSelProdCode !== "") {
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilter = [];
                oFilter.push(new Filter("Key", FilterOperator.EQ, "PRO"));
                oFilter.push(new Filter("ParentPartNo", FilterOperator.EQ, oSelProdCode));
                oFilter.push(new Filter("ProductSequence", FilterOperator.EQ, oSelProdseqRange));
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

        onVHReqSupNC: function () {
            this._oSupNCDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SupersedesNCVH", this);
            this.getView().addDependent(this._oSupNCDialog);
            this._oSupNCDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "SUPERCEDES"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oSupNCDialog.setModel(oModel, "oSupsedNcModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configSupNCVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idInpSupNC");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oSupNCDialog.destroy();
        },

        onSearchSupsedNC: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onVHReqSupBy: function () {
            this._oSupByDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SupersededByVH", this);
            this.getView().addDependent(this._oSupByDialog);
            this._oSupByDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "SUPERCEDED"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oSupByDialog.setModel(oModel, "oSupsedByModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configSupByVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idInpSupBy");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oSupByDialog.destroy();
        },

        onSearchSupsedBy: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onVHReqRefNC: function () {
            this._oRefNCDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.ReferenceNCVH", this);
            this.getView().addDependent(this._oRefNCDialog);
            this._oRefNCDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "REFNUM"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oRefNCDialog.setModel(oModel, "oRefNCModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configRefNCVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idInpRefNC");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oRefNCDialog.destroy();
        },

        onSearchRefNC: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onVHReqAircraft: function () {
            this._oAircraftDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.AircraftValueHelp", this);
            this.getView().addDependent(this._oAircraftDialog);
            this._oAircraftDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "AIR"));
            var sPath = "/f4_genericSet";
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

        _confirmAircraftValueHelpDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");

            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                var oInput = this.getView().byId("idInpAircraft");
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                var oInput = this.getView().byId("idDiscAircraft");
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Dispo") {
                var oInput = this.getView().byId("idmrbAircraftNo");
            }
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oAircraftDialog.destroy();

            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                if (this.getView().byId("idInpAircraft").getValue() !== "") {
                    this.getView().byId("idInpAircraft").setValueState("None");
                    this.getView().byId("idInpAircraft").setValueStateText("");
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                if (this.getView().byId("idDiscAircraft").getValue() !== "") {
                    this.getView().byId("idDiscAircraft").setValueState("None");
                    this.getView().byId("idDiscAircraft").setValueStateText();
                }
            }
        },

        onAircraftliveSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onOpenVHPartNo: function (oEvent) {
            this._oPartNoDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PartNoFBValueHelp", this);
            this.getView().addDependent(this._oPartNoDialog);
            this._oPartNoDialog.open();
            this.oPartNoInput = oEvent.getSource().getId();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "PRT"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oPartNoDialog.setModel(oModel, "oPartNoFBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configValueHelpDialogPartNoFB: function (oEvent) {
            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput;

                if (this.oPartNoInput.includes("idFlBarPrOrdVhPartNo")) {
                    oInput = sap.ui.getCore().byId("idFlBarPrOrdVhPartNo");
                } else if (this.oPartNoInput.includes("idInpPartNo")) {
                    oInput = this.getView().byId("idInpPartNo");
                    var oPartDesc = oEvent.getParameter("selectedItem").getInfo();
                    this.getView().byId("idInpStatPartDesc").setValue(oPartDesc);
                    this.getView().byId("idMNInputSN").setEditable(true);
                    this.getView().byId("idMNInputTN").setEditable(true);
                }

                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }
                oInput.setValue(oSelectedItem.getTitle());
                if (this.oPartNoInput.includes("idFlBarPrOrdVhPartNo")) {
                    this._oPrtNoFBDialog.destroy();
                } else if (this.oPartNoInput.includes("idInpPartNo")) {
                    this._oPartNoDialog.destroy();
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Purchase") {
                var oSelectedItem = oEvent.getParameter("selectedItem"),
                    oInput;
                if (this._valuhelpFlag === "GR") {
                    oInput = this.getView().byId("idFlBarGrVhPartNo");
                } else if (this._valuhelpFlag === "PO") {
                    oInput = this.getView().byId("idFlBarPOVhPartNo");
                }
                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }
                oInput.setValue(oSelectedItem.getTitle());
                this._oPrtNoFBDialog.destroy();
            }
        },

        onSearchPartNoFB: function (oEvent) {
            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
                if (this.oPartNoInput.includes("idFlBarPrOrdVhPartNo")) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
                    var oBinding = oEvent.getParameter("itemsBinding");
                    oBinding.filter([oFilter]);
                } else if (this.oPartNoInput.includes("idInpPartNo")) {
                    if (oEvent.getParameter("value").includes("*") === true) {
                        var oValue = oEvent.getParameter("value");
                        var oSplitVal = oValue.split("*")[1];
                        var aFilter = [], oFilter = [];
                        oFilter.push(new Filter("Value", FilterOperator.Contains, oSplitVal));
                        oFilter.push(new Filter("Description", FilterOperator.Contains, oSplitVal));
                        aFilter.push(new Filter(oFilter, false));
                        var oBinding = oEvent.getParameter("itemsBinding");
                        oBinding.filter(aFilter);
                    } else {
                        var oValue = oEvent.getParameter("value");
                        var aFilter = [], oFilter = [];
                        oFilter.push(new Filter("Value", FilterOperator.Contains, oValue));
                        oFilter.push(new Filter("Description", FilterOperator.Contains, oValue));
                        aFilter.push(new Filter(oFilter, false));
                        var oBinding = oEvent.getParameter("itemsBinding");
                        oBinding.filter(aFilter);
                    }
                }
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Purchase") {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter([oFilter]);
            }
        },

        handlePartNo: function () {
            var oInpPartNo = this.getView().byId("idInpPartNo");
            sap.ui.core.BusyIndicator.show();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "PRT"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    var bFlag;
                    if (data.length === 0) {
                        bFlag = true;
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            var oPartNo = data[i].Value;
                            if (oPartNo == oInpPartNo.getValue()) {
                                bFlag = false;
                                break;
                            } else {
                                bFlag = true;
                            }
                        }
                    }

                    if (bFlag === true) {
                        this.getView().byId("idInpStatPartDesc").setEditable(true);
                    } else {
                        this.getView().byId("idInpStatPartDesc").setEditable(false);
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });

        },

        handleChangePartNo: function () {
            var oInpPartNo = this.getView().byId("idInpPartNo"),
                oMulInpSer = this.getView().byId("idMNInputSN"),
                oMulInpTrc = this.getView().byId("idMNInputTN");
            if (oInpPartNo.getValue() === "") {
                oMulInpSer.setEditable(false);
                oMulInpTrc.setEditable(false);
                this.getView().byId("idInpStatPartDesc").setEditable(false);
                this.getView().byId("idInpStatPartDesc").setValue();
                if (oMulInpSer.getTokens()) {
                    oMulInpSer.removeAllTokens();
                }
                if (oMulInpTrc.getTokens()) {
                    oMulInpTrc.removeAllTokens();
                }
            } else {
                oMulInpSer.setEditable(true);
                oMulInpTrc.setEditable(true);
                sap.ui.core.BusyIndicator.show();
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilter = [];
                oFilter.push(new Filter("Key", FilterOperator.EQ, "PRT"));
                var sPath = "/f4_genericSet";
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        var bFlag;
                        if (data.length === 0) {
                            bFlag = true;
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                var oPartNo = data[i].Value;
                                var oPartDesc = data[i].Description;
                                if (oPartNo == oInpPartNo.getValue()) {
                                    bFlag = false;
                                    break;
                                } else {
                                    bFlag = true;
                                }
                            }
                        }

                        if (bFlag === true) {
                            this.getView().byId("idInpStatPartDesc").setEditable(true);
                            this.getView().byId("idInpStatPartDesc").setValue();
                            var oPrtNoMsg = this.getView().getModel("i18n").getProperty("PartNumMatchMsg");
                            MessageBox.warning(
                                oPrtNoMsg, {
                                icon: MessageBox.Icon.WARNING,
                                title: "Information",
                                actions: [MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,
                                initialFocus: MessageBox.Action.OK,
                                onClose: function (sAction) {
                                    if (sAction == MessageBox.Action.OK) { }
                                }.bind(this)
                            });
                        } else {
                            this.getView().byId("idInpStatPartDesc").setEditable(false);
                            this.getView().byId("idInpStatPartDesc").setValue(oPartDesc);
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

        onOpenVHNCCreated: function (oEvent) {
            this._oValueHelpDialogNCCrt = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NCCreatedBy", this);
            this.getView().addDependent(this._oValueHelpDialogNCCrt);
            this._oValueHelpDialogNCCrt.open();
            this.oInputWorkCenter = oEvent.getSource();
        },

        _handleNCCrtdByClose: function () {
            this._oValueHelpDialogNCCrt.close();
            this._oValueHelpDialogNCCrt.destroy();
        },

        onFilterBarSearchNCCrt: function (oEvent) {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var wrkcentercategory = sap.ui.getCore().byId("idFBNCCrtByWrkCntCateg").getValue();
            var workcenter = sap.ui.getCore().byId("idFBNCCrtByWorkCenter").getValue();
            var plant = sap.ui.getCore().byId("idFBNCCrtByPlant").getValue();

            var oFilter = [];
            oFilter.push(new Filter("WorkCenterCategory", FilterOperator.EQ, wrkcentercategory));
            if (workcenter != "") {
                oFilter.push(new Filter("WorkCenter", FilterOperator.EQ, workcenter));
            }
            if (plant != "") {
                oFilter.push(new Filter("Plant", FilterOperator.EQ, plant));
            }

            var sPath = "/NcCreateWorkcenterF4Set"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    var data = oData.results;
                    oModel.setData(data);
                    sap.ui.getCore().byId("idTableNCCreatedBy").setModel(oModel, "NCCreatedByModel");
                    sap.ui.core.BusyIndicator.hide();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        handleNCCrtItemSelection: function (oEvent) {
            var oSelectedItem = oEvent.getParameters("selectedItem").listItem.getBindingContext("NCCreatedByModel").getProperty("WorkCenter");
            var oInput = this.oInputWorkCenter;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem);
            this._oValueHelpDialogNCCrt.close();
            this._oValueHelpDialogNCCrt.destroy();
        },

        onOpenVHNCDetected: function () {
            this._oValueHelpDialogNCDet = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NCDetectedAt", this);
            this.getView().addDependent(this._oValueHelpDialogNCDet);
            this._oValueHelpDialogNCDet.open();
        },

        _handleNCDetAtClose: function () {
            this._oValueHelpDialogNCDet.close();
            this._oValueHelpDialogNCDet.destroy();
        },

        onFilterBarSearchNCDet: function (oEvent) {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var wrkcentercategory = sap.ui.getCore().byId("idFBNCDetAtWrkCntCateg").getValue();
            var workcenter = sap.ui.getCore().byId("idFBNCDetAtWorkCenter").getValue();
            var plant = sap.ui.getCore().byId("idFBNCDetAtPlant").getValue();

            var oFilter = [];
            oFilter.push(new Filter("WorkCenterCategory", FilterOperator.EQ, wrkcentercategory));
            if (workcenter != "") {
                oFilter.push(new Filter("WorkCenter", FilterOperator.EQ, workcenter));
            }
            if (plant != "") {
                oFilter.push(new Filter("Plant", FilterOperator.EQ, plant));
            }

            var sPath = "/NcCreateWorkcenterF4Set"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    var data = oData.results;
                    oModel.setData(data);
                    sap.ui.getCore().byId("idTableNCCreatedBy").setModel(oModel, "NCDetectedAtModel");
                    sap.ui.core.BusyIndicator.hide();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        handleNCDetItemSelection: function (oEvent) {
            var oSelectedItem = oEvent.getParameters("selectedItem").listItem.getBindingContext("NCDetectedAtModel").getProperty("WorkCenter");
            var oInput = this.getView().byId("idInpNCDetAt");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem);
            this._oValueHelpDialogNCDet.close();
            this._oValueHelpDialogNCDet.destroy();
        },

        onOpenWorkCenter: function (oEvent) {
            this._oWrkCntFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.WorkCenterFBVH", this);
            this.getView().addDependent(this._oWrkCntFBDialog);
            this._oWrkCntFBDialog.open();
            this.oInpWrkCntFB = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "WRKCNTR"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oWrkCntFBDialog.setModel(oModel, "WrkCntModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onSearchWorkCenterFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _handleConfirmWorkCenterFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oInpWrkCntFB;
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oWrkCntFBDialog.destroy();
        },

        onOpenWrkCntCateg: function (oEvent) {
            this._oWrkCntCategFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.WorkCenterCategoryFBVH", this);
            this.getView().addDependent(this._oWrkCntCategFBDialog);
            this._oWrkCntCategFBDialog.open();
            this.oInpWrkCntCategFB = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "WRKCAT"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oWrkCntCategFBDialog.setModel(oModel, "WrkCntCategModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onSearchWorkCenterCategFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _handleConfirmWorkCenterCategFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oInpWrkCntCategFB;
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oWrkCntCategFBDialog.destroy();
        },

        onOpenPlant: function (oEvent) {
            this._oPlantFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PlantFBVH", this);
            this.getView().addDependent(this._oPlantFBDialog);
            this._oPlantFBDialog.open();
            this.oInpPlantFB = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "WERKS"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oPlantFBDialog.setModel(oModel, "PlantModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onSearchPlantFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        _handleConfirmPlantFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oInpPlantFB;
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oPlantFBDialog.destroy();
        },

        /**
        * Function is triggered when the value help indicator for Bin Area is clicked
        * @function
        */
        onOpenVHBinLoc: function () {
            this._oBinAreaDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.ZQM_NCR.fragments.BinAreaValueHelp", this);
            this.getView().addDependent(this._oBinAreaDialog);
            this._oBinAreaDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/BinlocationSet"
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oBinAreaDialog.setModel(oModel, "BinAreaModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        /**
        * Function is executed when the search for Bin Area VH is triggered
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input    
        */
        _confirmBinAreaVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idInpBinLoc");
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oBinAreaDialog.destroy();
        },

        /**
        * Function is executed when the live search for Bin Area VH is triggered
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input    
        */
        onBinArealiveSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("BinLocation", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onOpenVHDrpPt: function (oEvent) {
            this._oDrpPtDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DropPointVH", this);
            this.getView().addDependent(this._oDrpPtDialog);
            this._oDrpPtDialog.open();
            this.oDrpPointInput = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "ZDP_NUM"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oDrpPtDialog.setModel(oModel, "DrpPointModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configDrpPntVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var oInput = this.oDrpPointInput;
            // if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Hdata") {
            //     oInput = this.getView().byId("idInpDrpPt");
            // } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
            //     oInput = this.getView().byId("idDcIpDp");
            // } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Dispo") {
            //     oInput = this.getView().byId("dispGenDropPoint");
            // }
            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oDrpPtDialog.destroy();
        },

        onDropPointSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**
        * Function is triggered when the go button in filter bar of Purchase Order Value Help dialog is clicked
        * @function
        */
        _onPoSearchGo: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var asnNo = this.getView().byId("idFBASNNo").getValue();
            var inbDel = this.getView().byId("idFBPOInboundDelivery").getValue();
            var partNo = this.getView().byId("idFlBarPOVhPartNo").getValue();
            var ncNo = this.getView().byId("idFBNCNumber").getValue();
            var disNo = this.getView().byId("idFBDiscrpNo").getValue();
            var rmaNo = this.getView().byId("idFBRMANo").getValue();

            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "PO"));
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
                    this.getView().byId("idPurOrdTable").setModel(oModel, "oPrModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        /**
        * Function is triggered when the value help indicator for ASN Number as in filter bar field of Purchase Order value help is clicked
        * @function
        */
        _onValueHelpReqtASNNumber: function () {
            this._oASNNoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.ASNNoFBValueHelp", this);
            this.getView().addDependent(this._oASNNoFBDialog);
            this._oASNNoFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
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

        /**
        * Function is executed when the search for ASN Number as in filter bar field of Purchase Order value help is triggered
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input    
        */
        onSearchASNNoFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**
        * Function is fired when the ASN Number as in filter bar field of Purchase Order value help is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
        _configValueHelpDialogASNNoFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = this.getView().byId("idFBASNNo");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oASNNoFBDialog.destroy();
        },

        /**
        * Function is triggered when the go button in filter bar of Goods Receipt Number Value Help dialog is clicked
        * @function
        */
        _onGRSearchGo: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var purOrd = this.getView().byId("idFBPurchord").getValue();
            var inbDel = this.getView().byId("idFBInboundDelivery").getValue();
            var partNo = this.getView().byId("idFlBarGrVhPartNo").getValue();

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
                    this.getView().byId("idGRTable").setModel(oModel, "oGRModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        /**
        * Function is triggered when the value help indicator for Purchase Order is clicked
        * @function
        */
        _onValueHelpReqtPurchOrd: function () {
            this._oPurOrdFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PurOrdFBValueHelp", this);
            this.getView().addDependent(this._oPurOrdFBDialog);
            this._oPurOrdFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
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

        /**
        * Function is triggered when the value help indicator for Inbound Delivery as in filter bar field of Goods Receipt and Purchase Order value help is clicked
        * @function
        */
        _onValueHelpReqInboundDelivery: function () {
            this._oInbDelFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.InbDelFBValueHelp", this);
            this.getView().addDependent(this._oInbDelFBDialog);
            this._oInbDelFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];

            oFilter.push(new Filter("Key", FilterOperator.EQ, "GID"));

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

        /**
        * Function is triggered when the value help indicator for Part Number as in filter bar field of Production Order, Purchase Order and Goods Receipt Value Help is clicked
        * @function
        */
        _onValueHelpReqPartNo: function (oEvent) {
            this._oPrtNoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PartNoFBValueHelp", this);
            this.getView().addDependent(this._oPrtNoFBDialog);
            this._oPrtNoFBDialog.open();
            this.oPartNoInput = oEvent.getSource().getId();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            if (oEvent.getSource().getId().includes("idFlBarGrVhPartNo") || oEvent.getSource().getId().includes("idFlBarPOVhPartNo")) {
                oFilter.push(new Filter("Key", FilterOperator.EQ, "GPN"));
            } else if (oEvent.getSource().getId().includes("idFlBarPrOrdVhPartNo")) {
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

        /**
        * Function is executed when the search for Purchase Order is triggered
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input    
        */
        onSearchPurOrdFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**
        * Function is fired when the Purchase Order is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
        _configValueHelpDialogPurOrdFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = this.getView().byId("idFBPurchord");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oPurOrdFBDialog.destroy();
        },

        /**
        * Function is executed when the search for Inbound Delivery as in filter bar field of Goods Receipt and Purchase Order value help is triggered
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input    
        */
        onSearchInbDelFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**
        * Function is fired when the Inbound Delivery as in filter bar field of Goods Receipt and Purchase Order value help is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
        _configValueHelpDialogInbDelFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;

            if (this._valuhelpFlag === "GR") {
                oInput = this.getView().byId("idFBInboundDelivery");
            } else if (this._valuhelpFlag === "PO") {
                oInput = this.getView().byId("idFBPOInboundDelivery");
            }


            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oInbDelFBDialog.destroy();
        },

        /**
        * Function is executed when the search for part number as in filter bar field for different sub categories is triggered
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input
        */
        // onSearchPartNoFB: function (oEvent) {
        //     var sValue = oEvent.getParameter("value");
        //     var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
        //     var oBinding = oEvent.getParameter("itemsBinding");
        //     oBinding.filter([oFilter]);
        // },

        /**
        * Function is fired when the Part Number as in filter bar field of Production Order, Purchase Order and Goods Receipt Value Help dialog is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
        // _configValueHelpDialogPartNoFB: function (oEvent) {
        //     var oSelectedItem = oEvent.getParameter("selectedItem"),
        //         oInput;

        //     if (this._valuhelpFlag === "GR") {
        //         oInput = this.getView().byId("idFlBarGrVhPartNo");
        //     } else if (this._valuhelpFlag === "PO") {
        //         oInput = this.getView().byId("idFlBarPOVhPartNo");
        //     }


        //     if (!oSelectedItem) {
        //         oInput.resetProperty("value");
        //         return;
        //     }
        //     oInput.setValue(oSelectedItem.getTitle());
        //     this._oPrtNoFBDialog.destroy();
        // },

        /**
        * Function is triggered when the value help indicator for NC Number is clicked
        * @function
        */
        _onValueHelpReqNCNo: function () {
            this._oNcNoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NcNoFBValueHelp", this);
            this.getView().addDependent(this._oNcNoFBDialog);
            this._oNcNoFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
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

        /**
        * Function is executed when the search for ASN Number as in filter bar field of Purchase Order value help is triggered
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input    
        */
        onSearchNcNoFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**
        * Function is fired when the NC Number is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
        _configValueHelpDialogNcNoFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = this.getView().byId("idFBNCNumber");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oNcNoFBDialog.destroy();
        },

        /**
        * Function is triggered when the value help indicator for Discrepancy Number is clicked
        * @function
        */
        _onValueHelpReqDiscrepancyNo: function () {
            this._oDiscNoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DiscrepNoFBValueHelp", this);
            this.getView().addDependent(this._oDiscNoFBDialog);
            this._oDiscNoFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
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

        /**
        * Function is executed when the search for Discrepancy Number is triggered
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input    
        */
        onSearchDiscNoFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**
        * Function is fired when the Discrepancy Number is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
        _configValueHelpDialogDiscNoFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = this.getView().byId("idFBDiscrpNo");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oDiscNoFBDialog.destroy();
        },

        /**
        * Function is triggered when the value help indicator for RMA Number is clicked
        * @function
        */
        _onValueHelpReqRMANo: function () {
            this._oRMANoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.RMANoFBValueHelp", this);
            this.getView().addDependent(this._oRMANoFBDialog);
            this._oRMANoFBDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
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

        /**
        * Function is executed when the search for RMA Number is triggered
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input    
        */
        onSearchRMANoFB: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        /**
        * Function is fired when the RMA Number is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
        _configValueHelpDialogRMANoFB: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = this.getView().byId("idFBRMANo");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oRMANoFBDialog.destroy();
        },

        handleAddDiscrepancy: function () {
            var oDiscrepancyNo = "";
            this.bindDiscrepancyTab(oDiscrepancyNo);
            this.bindSupplier();
            this.bindDefaultPartNumber();
            this.bindLinkedToDiscrepancy();
            this._setPrelimCauseComboBox();
            this._setFormatComboBox();
            this.onSelectDiscPartlocation();
            this.getView().byId("idIconTabBarHeader").setSelectedKey("Discre");
            this.getView().byId("idHeaderDiscTable").removeSelections();
            this.getView().byId("idstatus").setVisible(true);
            this.getView().byId("idObjNCStatus").setVisible(false);
            this.getView().byId("idObjNCStatusDiscrep").setVisible(true);
            this.getView().byId("idObjNCStatusDispo").setVisible(false);
            this.getView().byId("btnWorkGrp").setVisible(false);
            this.getView().byId("idDcCobPcAsper").setSelectedKey();
            this.getView().byId("idDcBtStkPrg").setVisible(false);
        },

        bindLinkedToDiscrepancy: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "LINKTO"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this.getView().byId("idComBoxDiscLinkTo").setModel(oModel, "LinkToModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onOpenVHPartNoDisc: function (oEvent) {
            this._oPartNoDiscDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PartNoDiscrepancyVH", this);
            this.getView().addDependent(this._oPartNoDiscDialog);
            this._oPartNoDiscDialog.open();
            this.oPartNoInput = oEvent.getSource().getId();
            sap.ui.core.BusyIndicator.show();
            var oModel = new sap.ui.model.json.JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/DiscrepancyPartSet";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oPartNoDiscDialog.setModel(oModel, "PartNoDiscModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configValueHelpDialogPartNoDisc: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idDiscPartNumber");
            var oPartDesc = oEvent.getParameter("selectedItem").getInfo();
            this.getView().byId("idDiscPartDesc").setValue(oPartDesc);
            var oUnitOfMeas = oSelectedItem.getBindingContext("PartNoDiscModel").getProperty("UOM");
            this.getView().byId("idDiscUomIns").setText(oUnitOfMeas);
            this.getView().byId("idDiscUomRej").setText(oUnitOfMeas);
            this.getView().byId("idDiscPartDesc").setEditable(false);

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this.getView().byId("idMulInpDiscSerNo").setEditable(true);
            this.getView().byId("idMulInpDiscTrcNo").setEditable(true);
            this._oPartNoDiscDialog.destroy();
        },

        onSearchPartNoDisc: function (oEvent) {
            if (oEvent.getParameter("value").includes("*") === true) {
                var oValue = oEvent.getParameter("value");
                var oSplitVal = oValue.split("*")[1];
                var aFilter = [], oFilter = [];
                oFilter.push(new Filter("PartNumber", FilterOperator.Contains, oSplitVal));
                oFilter.push(new Filter("PartName", FilterOperator.Contains, oSplitVal));
                aFilter.push(new Filter(oFilter, false));
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter(aFilter);
            } else {
                var oValue = oEvent.getParameter("value");
                var aFilter = [], oFilter = [];
                oFilter.push(new Filter("PartNumber", FilterOperator.Contains, oValue));
                oFilter.push(new Filter("PartName", FilterOperator.Contains, oValue));
                aFilter.push(new Filter(oFilter, false));
                var oBinding = oEvent.getParameter("itemsBinding");
                oBinding.filter(aFilter);
            }
        },

        onChangeLinkedTo: function (oEvent) {
            var oSelLinkedTo = oEvent.getSource().getSelectedItem();
            var oSelLinkToTxt = oSelLinkedTo.getText();
            // if (this.getView().byId("idDcCobDscNo").getValue() !== "") {
            //     this.getView().byId("idDiscPartNumber").setValue();
            //     this.getView().byId("idDiscPartDesc").setValue();
            // }
            if (oSelLinkToTxt == "AIRCRAFT") {
                // this.getView().byId("idDiscPartNumber").setValueHelpOnly(false);
                this.getView().byId("idDiscPartDesc").setEditable(true);
            } else if (oSelLinkToTxt == "DETAIL") {
                // this.getView().byId("idDiscPartNumber").setValueHelpOnly(false);
                this.getView().byId("idDiscPartDesc").setEditable(true);
            } else if (oSelLinkToTxt == "ASSEMBLY") {
                // this.getView().byId("idDiscPartNumber").setValueHelpOnly(true);
                this.getView().byId("idDiscPartDesc").setEditable(false);
            } else {
                // this.getView().byId("idDiscPartNumber").setValueHelpOnly(false);
                this.getView().byId("idDiscPartDesc").setEditable(true);
            }

            if (oSelLinkToTxt == "AIRCRAFT" || oSelLinkToTxt == "ASSEMBLY") {
                this.getView().byId("idDiscAircraft").setRequired(true);
                this.getView().byId("idLblDiscLiability").setRequired(true);
                this.getView().byId("idLblDiscQtyIns").setRequired(true);
                this.getView().byId("idLblDiscQtyRej").setRequired(true);
                this.getView().byId("idLblDiscDefCode").setRequired(true);
                this.getView().byId("idDcTxtIs").setRequired(true);
                this.oIsMasterCheckFlag = false;
            } else {
                this.getView().byId("idDiscAircraft").setRequired(false);
                this.getView().byId("idLblDiscLiability").setRequired(false);
                this.getView().byId("idLblDiscQtyIns").setRequired(false);
                this.getView().byId("idLblDiscQtyRej").setRequired(false);
                this.getView().byId("idLblDiscDefCode").setRequired(false);
                this.getView().byId("idDcTxtIs").setRequired(false);
            }
        },

        onVHReqLiability: function () {
            this._oLiabilityDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.LiabilityValueHelp", this);
            this.getView().addDependent(this._oLiabilityDialog);
            this._oLiabilityDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "LIAB"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oLiabilityDialog.setModel(oModel, "LiabilityModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configVHDialogLiability: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idDcIpLblty");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            if (oInput.getValue() !== "") {
                oInput.setValueState("None");
                oInput.setValueStateText();
            }
            this._oLiabilityDialog.destroy();
        },

        onSearchLiability: function (oEvent) {
            var oValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, oValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        handleChangeLiability: function () {
            if (this.getView().byId("idDcIpLblty").getValue() !== "") {
                this.getView().byId("idDcIpLblty").setValueState("None");
                this.getView().byId("idDcIpLblty").setValueStateText();
            }
        },

        hanldeChangeInspectQty: function () {
            if (this.getView().byId("idDiscQtyIns").getValue() !== "") {
                this.getView().byId("idDiscQtyIns").setValueState("None");
                this.getView().byId("idDiscQtyIns").setValueStateText();
            }
        },

        hanldeChangeRejectQty: function () {
            if (this.getView().byId("idDiscQtyRej").getValue() !== "") {
                this.getView().byId("idDiscQtyRej").setValueState("None");
                this.getView().byId("idDiscQtyRej").setValueStateText();
            }
        },

        handleChangeIsText: function () {
            if (this.getView().byId("idDcTxtIs").getValue() !== "") {
                this.getView().byId("idDcTxtIs").setValueState("None");
                this.getView().byId("idDcTxtIs").setValueStateText();
            }
        },

        onVHReqPartner: function () {
            this._oPartnerDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PartnerValueHelp", this);
            this.getView().addDependent(this._oPartnerDialog);
            this._oPartnerDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "PARNRDISC"));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oPartnerDialog.setModel(oModel, "PartnerModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configVHDialogPartner: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var oInput, oText;
            if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Discre") {
                oInput = this.getView().byId("idDcIpPrtnr");
                oText = this.getView().byId("idDcIpPrtnrNm");
            } else if (this.getView().byId("idIconTabBarHeader").getSelectedKey() === "Dispo") {
                oInput = this.getView().byId("dispGenPartSuppName");
                oText = this.getView().byId("dispGenPartSuppDesc")
            }

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            oText.setValue(oSelectedItem.getInfo());
            this._oPartnerDialog.destroy();
        },

        onSearchPartner: function (oEvent) {
            var oValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, oValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        handleChangeSupplierName: function () {
            if (this.getView().byId("idDcIpPrtnr").getValue() === "") {
                this.getView().byId("idDcIpPrtnrNm").setValue();
            }
        },

        onVHReqSupersedesItem: function () {
            this._oSupersedesItemDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SupersedesItemValueHelp", this);
            this.getView().addDependent(this._oSupersedesItemDialog);
            this._oSupersedesItemDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DISCITEM"));
            oFilter.push(new Filter("Value", FilterOperator.EQ, this.getView().byId("idInpSupNC").getValue()));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oSupersedesItemDialog.setModel(oModel, "SupersedesItemModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configVHDialogSupersedesItem: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idDcIpSpsdsItm");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oSupersedesItemDialog.destroy();
        },

        onSearchSupersedesItem: function (oEvent) {
            var oValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value1", FilterOperator.Contains, oValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onVHReqSupersededbyItem: function () {
            this._oSupersededbyItemDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SupersededbyItemValueHelp", this);
            this.getView().addDependent(this._oSupersededbyItemDialog);
            this._oSupersededbyItemDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DISCSUPBY"));
            oFilter.push(new Filter("Value", FilterOperator.EQ, this.getView().byId("idInpSupBy").getValue()));
            var sPath = "/f4_genericSet"
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oSupersededbyItemDialog.setModel(oModel, "SupersededbyItemModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configVHDialogSupersededbyItem: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.getView().byId("idDcIpSpsdbyItm");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oSupersededbyItemDialog.destroy();
        },

        onSearchSupersededbyItem: function (oEvent) {
            var oValue = oEvent.getParameter("value");
            var aFilter = [], oFilter = [];
            oFilter.push(new Filter("Value1", FilterOperator.Contains, oValue));
            oFilter.push(new Filter("Value", FilterOperator.Contains, oValue));
            aFilter.push(new Filter(oFilter, false));
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter(aFilter);
        },

        handleChangeDiscPartNo: function () {
            var oInpPartNo = this.getView().byId("idDiscPartNumber"),
                oMulInpSer = this.getView().byId("idMulInpDiscSerNo"),
                oMulInpTrc = this.getView().byId("idMulInpDiscTrcNo");
            if (oInpPartNo.getValue() === "") {
                oMulInpSer.setEditable(false);
                oMulInpTrc.setEditable(false);
                this.getView().byId("idDiscPartDesc").setValue();
                this.getView().byId("idDiscPartDesc").setEditable(false);
                if (oMulInpSer.getTokens()) {
                    oMulInpSer.removeAllTokens();
                } else if (oMulInpTrc.getTokens()) {
                    oMulInpTrc.removeAllTokens();
                }
            } else {
                oMulInpSer.setEditable(true);
                oMulInpTrc.setEditable(true);
                sap.ui.core.BusyIndicator.show();
                var oDataModel = this.getOwnerComponent().getModel();
                var sPath = "/DiscrepancyPartSet";
                oDataModel.read(sPath, {
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        var bFlag;
                        if (data.length === 0) {
                            bFlag = true;
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                var oPartNo = data[i].PartNumber;
                                var oPartDesc = data[i].PartName;
                                if (oPartNo == oInpPartNo.getValue()) {
                                    bFlag = false;
                                    break;
                                } else {
                                    bFlag = true;
                                }
                            }
                        }

                        if (bFlag === true) {
                            this.getView().byId("idDiscPartDesc").setEditable(true);
                            this.getView().byId("idDiscPartDesc").setValue();
                            this.getView().byId("idDiscUomIns").setText();
                            this.getView().byId("idDiscUomRej").setText();
                            if (this.getView().byId("idComBoxDiscLinkTo").getValue() == "AIRCRAFT") {
                                var oMessage = this.getView().getModel("i18n").getProperty("PartNumMatchMsg");
                                MessageBox.warning(
                                    oMessage, {
                                    icon: MessageBox.Icon.WARNING,
                                    title: "Information",
                                    actions: [MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                    initialFocus: MessageBox.Action.OK,
                                    onClose: function (sAction) {
                                        if (sAction == MessageBox.Action.OK) { }
                                    }.bind(this)
                                });
                            } else if (this.getView().byId("idComBoxDiscLinkTo").getValue() == "DETAIL") {
                                var oMessage = this.getView().getModel("i18n").getProperty("DiscPrtNoDetMsg");
                                MessageBox.warning(
                                    oMessage, {
                                    icon: MessageBox.Icon.WARNING,
                                    title: "Information",
                                    actions: [MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                    initialFocus: MessageBox.Action.OK,
                                    onClose: function (sAction) {
                                        if (sAction == MessageBox.Action.OK) {
                                            this.oIsMasterCheckFlag = true;
                                        }
                                    }.bind(this)
                                });
                            } else {
                                var oMessage = this.getView().getModel("i18n").getProperty("PartNumMatchMsg");
                                MessageBox.warning(
                                    oMessage, {
                                    icon: MessageBox.Icon.WARNING,
                                    title: "Information",
                                    actions: [MessageBox.Action.OK],
                                    emphasizedAction: MessageBox.Action.OK,
                                    initialFocus: MessageBox.Action.OK,
                                    onClose: function (sAction) {
                                        if (sAction == MessageBox.Action.OK) { }
                                    }.bind(this)
                                });
                            }
                        } else {
                            this.getView().byId("idDiscPartDesc").setEditable(false);
                            this.getView().byId("idDiscPartDesc").setValue(oPartDesc);
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

        IsUserMRBCertifiedCheck: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oWrkGrp = this.getView().byId("idworkgroup").getText();
            var sPath = "/IsUserMRBCertifiedSet(Bname='',Workgroup='" + oWrkGrp + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    // oData.MRBCertified = true;
                    this.oSelectedWrkGrp = "";
                    this.oDiscMRBCertifiedUser = "";
                    this.oDiscMRBActionYes = "";
                    this.oDiscMRBActionNo = "";
                    if (oData.MRBCertified === false) {
                        this.initialiseWorkGroupDialog();
                        this.oDiscMRBCertifiedUser = false;
                        // this.createDiscrepancyData();
                    }
                    // else if (oData.MRBCertified === false && this.getView().byId("idDcCobDscNo").getValue() !== "") {
                    //     this.updateDiscrepancyData();
                    // } 
                    else if (oData.MRBCertified === true) {
                        var oMRBCertMsg = this.getView().getModel("i18n").getProperty("MRBCertMsg");
                        MessageBox.show(
                            oMRBCertMsg, {
                            icon: MessageBox.Icon.INFORMATION,
                            title: "MRB certified User",
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            onClose: function (oAction) {
                                if (oAction === "YES") {
                                    this.oDiscMRBActionYes = true;
                                    this.oDiscMRBActionNo = false;
                                    this.initialiseWorkGroupDialog();
                                } else {
                                    this.oDiscMRBActionYes = false;
                                    this.oDiscMRBActionNo = true;
                                    if (this.getView().byId("idDcCobDscNo").getValue() === "") {
                                        this.createDiscrepancyData();
                                    } else if (this.getView().byId("idDcCobDscNo").getValue() !== "") {
                                        this.updateDiscrepancyData();
                                    }
                                }
                            }.bind(this)
                        }
                        );
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        initialiseWorkGroupDialog: function () {
            this._oWrkOrdDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.WorkGroupMRBDialog", this);
            this.getView().addDependent(this._oWrkOrdDialog);
            this._oWrkOrdDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "BUYWRKGRP"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oWrkOrdDialog.setModel(oModel, "WorkGroupModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onWorkGrpItemSel: function (oEvent) {
            this.oSelectedWrkGrp = oEvent.getParameters().listItem.getBindingContext("WorkGroupModel").getProperty("Value");
            this._oWrkOrdDialog.close();
            // this.getView().byId("idworkgroup").setText(oSelectedWrkGrp);
            if (this.getView().byId("idDcCobDscNo").getValue() === "") {
                this.createDiscrepancyData();
            } else if (this.getView().byId("idDcCobDscNo").getValue() !== "") {
                this.updateDiscrepancyData();
            }
        },

        onSearchMRBWorkGroup: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            // add filter for search
            var aFilter = [], oFilter = [];
            if (sQuery && sQuery.length > 0) {
                oFilter.push(new Filter("Value", FilterOperator.Contains, sQuery));
                oFilter.push(new Filter("Value1", FilterOperator.Contains, sQuery));
                oFilter.push(new Filter("Description", FilterOperator.Contains, sQuery));
                aFilter.push(new Filter(oFilter, false));
            }
            // update list binding
            var oWrkGrpTable = this._oWrkOrdDialog.getContent()[1];
            var oBinding = oWrkGrpTable.getBinding("items");
            oBinding.filter(aFilter);
        },

        onCloseWrkGrpMRB: function () {
            this._oWrkOrdDialog.close();
            this._oWrkOrdDialog.destroy();
            if (this.getView().byId("idDcCobDscNo").getValue() === "") {
                this.createDiscrepancyData();
            } else if (this.getView().byId("idDcCobDscNo").getValue() !== "") {
                this.updateDiscrepancyData();
            }
        },

        handleIncompleteFlagCheck: function () {
            if (this.getView().byId("idDcCobDscNo").getValue() === "") {
                this.getView().byId("idDcCbIf").setSelected(true);
            } else {
                sap.ui.core.BusyIndicator.show();
                var oDataModel = this.getOwnerComponent().getModel();
                var oNotifNum = sObjectId;
                var oDiscrepacyNo = this.getView().byId("idDcCobDscNo").getValue();
                var oLinkTo = this.getView().byId("idComBoxDiscLinkTo").getValue();
                var sPath = "/DiscrepancyIncompleteCheckSet(NotificationNo='" + oNotifNum + "',DiscrepancyNo='" + oDiscrepacyNo + "',Linkto='" + oLinkTo + "')";
                oDataModel.read(sPath, {
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        // if (oData.IncompleteCheck === false && oData.Message === "") {
                        // this.getView().byId("idDcCbIf").setSelected(oData.IncompleteCheck);
                        // this.initiatePasswordCheck(oData.IncompleteCheck);
                        // } else if (oData.IncompleteCheck === true && oData.Message !== "") {
                        //     MessageBox.information(oData.Message);
                        //     this.getView().byId("idDcCbIf").setSelected(oData.IncompleteCheck);
                        // }
                        if(oData.IncompleteCheck === false && this.getView().byId("idObjNCStatusDiscrep").getText() == "Open"){
                            MessageBox.information("User can not again check the incomplete flag once the status of discrepancy is Open.");
                            this.oDiscIncompleteFlag = true;
                        }else if ((oData.IncompleteCheck === true || oData.IncompleteCheck === false) && oData.Linkto == "ASSEMBLY") {
                            var message = oData.Message;
                            if(message !== ""){
                                MessageBox.information(message);
                                this.getView().byId("idDcCbIf").setSelected(oData.IncompleteCheck);
                                this.oDiscIncompleteFlag = true;
                            }else{
                                this.getView().byId("idDcCbIf").setSelected(oData.IncompleteCheck);
                                this.oDiscIncompleteFlag = false;
                            }         
                        } else if ((oData.IncompleteCheck === true || oData.IncompleteCheck === false) && oData.Linkto == "DETAIL") {
                            var message = oData.Message;
                            if(message !== ""){
                                MessageBox.information(message);
                                this.getView().byId("idDcCbIf").setSelected(oData.IncompleteCheck);
                                this.oDiscIncompleteFlag = true;
                            }else{
                                this.getView().byId("idDcCbIf").setSelected(oData.IncompleteCheck);
                                this.oDiscIncompleteFlag = false;
                            }
                        } else if ((oData.IncompleteCheck === true || oData.IncompleteCheck === false) && oData.Linkto == "AIRCRAFT") {
                            var message = oData.Message;
                            if(message !== ""){
                                MessageBox.information(message);
                                this.getView().byId("idDcCbIf").setSelected(oData.IncompleteCheck);
                                this.oDiscIncompleteFlag = true;
                            }else{
                                this.getView().byId("idDcCbIf").setSelected(oData.IncompleteCheck);
                                this.oDiscIncompleteFlag = false;
                            }
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

        initiatePasswordCheck: function (bFlag) {
            this._oPwdChkDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PasswordCheck", this);
            this.getView().addDependent(this._oPwdChkDialog);
            this._oPwdChkDialog.open();
            this.oFlag = bFlag;
        },

        onSubmitPwdCheck: function () {
            sap.ui.core.BusyIndicator.show();
            var oDataModel = this.getOwnerComponent().getModel();
            var oPassWord = sap.ui.getCore().byId("passwordInput").getValue();
            var sPath = "/PasswordCheckSet(PASSWORD='" + oPassWord + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onCancelPwdCheck: function () {
            this._oPwdChkDialog.close();
            this._oPwdChkDialog.destroy();
            this.getView().byId("idDcCbIf").setSelected(!this.oFlag);
        },

        createDiscrepancyData: function () {
            var oModel = this.getOwnerComponent().getModel();
            var oNotifNo = sObjectId;
            var oWorkGroup = this.getView().byId("idworkgroup").getText();
            var oDiscrepancyNo = this.getView().byId("idDcCobDscNo").getValue();
            var oDisLinkedTo = this.getView().byId("idComBoxDiscLinkTo").getValue();
            var oDiscLiability = this.getView().byId("idDcIpLblty").getValue();
            var oLiabilityText = this.getView().byId("idDiscLbltyTxt").getValue();
            var oDiscPartner = this.getView().byId("idDcIpPrtnr").getValue();
            var oDiscPartnerName = this.getView().byId("idDcIpPrtnrNm").getValue();
            var oDiscSupercedesItem = this.getView().byId("idDcIpSpsdsItm").getValue();
            var oDiscSupercededByItem = this.getView().byId("idDcIpSpsdbyItm").getValue();
            // var oDiscDropShip2 = this.getView().byId("idDcCbDs2").getSelected();
            var oDiscAircraft = this.getView().byId("idDiscAircraft").getValue();
            // var oDiscOpenDate = this.fnFormatDate(this.getView().byId("idDcIpOdt").getDateValue());
            // var oDiscCloseDate = this.fnFormatDate(this.getView().byId("idDcIpCdt").getDateValue());
            var oDiscPartNumber = this.getView().byId("idDiscPartNumber").getValue();
            var oDiscPartDesc = this.getView().byId("idDiscPartDesc").getValue();
            var oDiscInspQnty = this.getView().byId("idDiscQtyIns").getValue();
            var oDiscRejectQnty = this.getView().byId("idDiscQtyRej").getValue();
            var oDiscQntyUOM = this.getView().byId("idDiscUomIns").getText();
            var oDiscCompSerialNo = this.getView().byId("idMulInpDiscSerNo").getTokens();
            var oDiscTraceNo = this.getView().byId("idMulInpDiscTrcNo").getTokens();
            var oDiscPrelimInvest = this.getView().byId("idDcTAPi").getValue();
            var oDiscPartQuarantine = this.getView().byId("idDcCbPrq").getSelected();
            var oDiscMESissue = this.getView().byId("idDcCbMesi").getValue();
            var oDiscCsmsIssue = this.getView().byId("idDcCbCsmsi").getValue();
            var oDiscPrelimCause = this.getView().byId("idDcCobPc").getSelectedKey();
            var oDiscDefectCode = this.getView().byId("idDcIpDc").getValue();
            var oDiscDefect = this.getView().byId("idDcIpDcVal1").getValue();
            var oDiscDefectCodeDesc = this.getView().byId("idDcTxtDc").getText();
            var oDiscDropPoint = this.getView().byId("idDcIpDp").getValue();
            var oDiscIs = this.getView().byId("idDcTxtIs").getValue();
            var oDiscShouldbe = this.getView().byId("idDcTaSb").getValue();
            var oDiscAsPer = this.getView().byId("idDcInpAp").getValue();
            var oDiscIncompletion = this.getView().byId("idDcCbIf").getSelected();

            if ((oDiscCompSerialNo.length === 1 && oDiscTraceNo.length === 1) ||
                (oDiscCompSerialNo.length === 1 && oDiscTraceNo.length === 0) ||
                (oDiscCompSerialNo.length === 0 && oDiscTraceNo.length === 1) ||
                (oDiscCompSerialNo.length === 0 && oDiscTraceNo.length === 0)) {
                sap.ui.core.BusyIndicator.show();
                oDiscCompSerialNo = oDiscCompSerialNo.length === 1 ? oDiscCompSerialNo[0].getKey() : "";
                oDiscTraceNo = oDiscTraceNo.length === 1 ? oDiscTraceNo[0].getKey() : "";
                var payloadCrtDisData = {
                    "NotificationNo": oNotifNo,
                    "WorkGroup": oWorkGroup,
                    "LinkedTo": oDisLinkedTo,
                    "Liability": oDiscLiability,
                    "LiabilityText": oLiabilityText,
                    "Partner": oDiscPartner,
                    "PartnerName": oDiscPartnerName,
                    "SupercedesItem": oDiscSupercedesItem,
                    "SupercededByItem": oDiscSupercededByItem,
                    // "DropShip2": oDiscDropShip2,
                    "Aircraft": oDiscAircraft,
                    // "OpenDate": oDiscOpenDate,
                    // "CloseDate": oDiscCloseDate,
                    "PartNumber": oDiscPartNumber,
                    "PartDesc": oDiscPartDesc,
                    "InspQnty": oDiscInspQnty === "" ? "0" : oDiscInspQnty,
                    "RejectQnty": oDiscRejectQnty === "" ? "0" : oDiscRejectQnty,
                    "QntyUOM": oDiscQntyUOM,
                    "CompSerialNo": oDiscCompSerialNo,
                    "TraceNo": oDiscTraceNo,
                    "PrelimInvest": oDiscPrelimInvest,
                    "PartQuarantine": oDiscPartQuarantine,
                    "MESissue": oDiscMESissue,
                    "CsmsIssue": oDiscCsmsIssue,
                    "PrelimCause": oDiscPrelimCause,
                    "DefectCode": oDiscDefectCode,
                    "Defect": oDiscDefect,
                    "DefectCodeDesc": oDiscDefectCodeDesc,
                    "DropPoint": oDiscDropPoint,
                    "Is": oDiscIs,
                    "Shouldbe": oDiscShouldbe,
                    "AsPer": oDiscAsPer,
                    "Incompletion": oDiscIncompletion,
                    "WorkGroupMRB": (this.oSelectedWrkGrp === "" || this.oSelectedWrkGrp == undefined || this.oSelectedWrkGrp == false) ? "" : this.oSelectedWrkGrp,
                    "IsMRB": (this.oDiscMRBCertifiedUser === "" || this.oDiscMRBCertifiedUser == undefined || this.oDiscMRBCertifiedUser == false) ? false : true,
                    "IsMRBYes": (this.oDiscMRBActionYes === "" || this.oDiscMRBActionYes == undefined || this.oDiscMRBActionYes == false) ? false : true,
                    "IsMRBNo": (this.oDiscMRBActionNo === "" || this.oDiscMRBActionNo == undefined || this.oDiscMRBActionNo == false) ? false : true,
                    "IsMasterCheck": (this.oIsMasterCheckFlag === "" || this.oIsMasterCheckFlag == undefined || this.oIsMasterCheckFlag == false) ? false : true,
                    "IsWorkingQueue": this.oIsWorkingQueueFlag
                }
                oModel.create("/NotificationDiscrepancySet", payloadCrtDisData, {
                    success: function (odata, Response) {
                        sap.ui.core.BusyIndicator.hide();
                        if (Response.headers["sap-message"]) {
                            var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                            MessageBox.success(oMsg);
                        }
                        // this.getView().byId("idDcCobDscNo").setValue(odata.DiscrepancyNo);
                        var oDiscrepancyNo = odata.DiscrepancyNo;
                        this.bindDiscrepancyTab(oDiscrepancyNo);
                        this._setDiscrepancyComboBox();
                        this.resetDiscInitialisedFields();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            } else {
                var payloadCrtDisData = {
                    "NotificationNo": oNotifNo,
                    "WorkGroup": oWorkGroup,
                    "LinkedTo": oDisLinkedTo,
                    "Liability": oDiscLiability,
                    "LiabilityText": oLiabilityText,
                    "Partner": oDiscPartner,
                    "PartnerName": oDiscPartnerName,
                    "SupercedesItem": oDiscSupercedesItem,
                    "SupercededByItem": oDiscSupercededByItem,
                    // "DropShip2": oDiscDropShip2,
                    "Aircraft": oDiscAircraft,
                    // "OpenDate": oDiscOpenDate,
                    // "CloseDate": oDiscCloseDate,
                    "PartNumber": oDiscPartNumber,
                    "PartDesc": oDiscPartDesc,
                    "InspQnty": oDiscInspQnty === "" ? "0" : oDiscInspQnty,
                    "RejectQnty": oDiscRejectQnty === "" ? "0" : oDiscRejectQnty,
                    "QntyUOM": oDiscQntyUOM,
                    "to_serials": [],
                    "to_traces": [],
                    "PrelimInvest": oDiscPrelimInvest,
                    "PartQuarantine": oDiscPartQuarantine,
                    "MESissue": oDiscMESissue,
                    "CsmsIssue": oDiscCsmsIssue,
                    "PrelimCause": oDiscPrelimCause,
                    "DefectCode": oDiscDefectCode,
                    "Defect": oDiscDefect,
                    "DefectCodeDesc": oDiscDefectCodeDesc,
                    "DropPoint": oDiscDropPoint,
                    "Is": oDiscIs,
                    "Shouldbe": oDiscShouldbe,
                    "AsPer": oDiscAsPer,
                    "Incompletion": oDiscIncompletion,
                    "WorkGroupMRB": (this.oSelectedWrkGrp === "" || this.oSelectedWrkGrp == undefined || this.oSelectedWrkGrp == false) ? "" : this.oSelectedWrkGrp,
                    "IsMRB": (this.oDiscMRBCertifiedUser === "" || this.oDiscMRBCertifiedUser == undefined || this.oDiscMRBCertifiedUser == false) ? false : true,
                    "IsMRBYes": (this.oDiscMRBActionYes === "" || this.oDiscMRBActionYes == undefined || this.oDiscMRBActionYes == false) ? false : true,
                    "IsMRBNo": (this.oDiscMRBActionNo === "" || this.oDiscMRBActionNo == undefined || this.oDiscMRBActionNo == false) ? false : true,
                    "IsMasterCheck": (this.oIsMasterCheckFlag === "" || this.oIsMasterCheckFlag == undefined || this.oIsMasterCheckFlag == false) ? false : true,
                    "IsWorkingQueue": this.oIsWorkingQueueFlag
                };
                if (oDiscCompSerialNo.length > 1) {
                    payloadCrtDisData["to_serials"] = [];
                    for (var i = 0; i < oDiscCompSerialNo.length; i++) {
                        var oSerialNo = oDiscCompSerialNo[i].getKey();
                        payloadCrtDisData["to_serials"].push({
                            "NotificationNo": oNotifNo,
                            "DiscrepancyNo": oDiscrepancyNo,
                            "SerialNo": oSerialNo
                        });
                    }
                }

                if (oDiscTraceNo.length > 1) {
                    payloadCrtDisData["to_traces"] = [];
                    for (var j = 0; j < oDiscTraceNo.length; j++) {
                        var oTraceNo = oDiscTraceNo[j].getKey();
                        payloadCrtDisData["to_traces"].push({
                            "NotificationNo": oNotifNo,
                            "DiscrepancyNo": oDiscrepancyNo,
                            "TraceNo": oTraceNo
                        });
                    }
                }

                oModel.create("/NotificationDiscrepancySet", payloadCrtDisData, {
                    success: function (odata, Response) {
                        sap.ui.core.BusyIndicator.hide();
                        if (Response.headers["sap-message"]) {
                            var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                            MessageBox.success(oMsg);
                        }
                        var oDiscrepancyNo = odata.DiscrepancyNo;
                        this.bindDiscrepancyTab(oDiscrepancyNo);
                        this._setDiscrepancyComboBox();
                        this.resetDiscInitialisedFields();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            }
        },

        updateDiscrepancyData: function () {
            var oModel = this.getOwnerComponent().getModel();
            var oNotifNo = sObjectId;
            var oDiscrepancyNo = this.getView().byId("idDcCobDscNo").getValue();
            var oWorkGroup = this.getView().byId("idworkgroup").getText();
            var oDisLinkedTo = this.getView().byId("idComBoxDiscLinkTo").getValue();
            var oDiscLiability = this.getView().byId("idDcIpLblty").getValue();
            var oLiabilityText = this.getView().byId("idDiscLbltyTxt").getValue();
            var oDiscPartner = this.getView().byId("idDcIpPrtnr").getValue();
            var oDiscPartnerName = this.getView().byId("idDcIpPrtnrNm").getValue();
            var oDiscSupercedesItem = this.getView().byId("idDcIpSpsdsItm").getValue();
            var oDiscSupercededByItem = this.getView().byId("idDcIpSpsdbyItm").getValue();
            // var oDiscDropShip2 = this.getView().byId("idDcCbDs2").getSelected();
            var oDiscAircraft = this.getView().byId("idDiscAircraft").getValue();
            // var oDiscOpenDate = this.fnFormatDate(this.getView().byId("idDcIpOdt").getDateValue());
            // var oDiscCloseDate = this.fnFormatDate(this.getView().byId("idDcIpCdt").getDateValue());    
            var oDiscPartNumber = this.getView().byId("idDiscPartNumber").getValue();
            var oDiscPartDesc = this.getView().byId("idDiscPartDesc").getValue();
            var oDiscInspQnty = this.getView().byId("idDiscQtyIns").getValue();
            var oDiscRejectQnty = this.getView().byId("idDiscQtyRej").getValue();
            var oDiscQntyUOM = this.getView().byId("idDiscUomIns").getText();
            var oDiscCompSerialNo = this.getView().byId("idMulInpDiscSerNo").getTokens();
            var oDiscTraceNo = this.getView().byId("idMulInpDiscTrcNo").getTokens();
            var oDiscPrelimInvest = this.getView().byId("idDcTAPi").getValue();
            var oDiscPartQuarantine = this.getView().byId("idDcCbPrq").getSelected();
            var oDiscMESissue = this.getView().byId("idDcCbMesi").getValue();
            var oDiscCsmsIssue = this.getView().byId("idDcCbCsmsi").getValue();
            var oDiscPrelimCause = this.getView().byId("idDcCobPc").getSelectedKey();
            var oDiscDefectCode = this.getView().byId("idDcIpDc").getValue();
            var oDiscDefect = this.getView().byId("idDcIpDcVal1").getValue();
            var oDiscDefectCodeDesc = this.getView().byId("idDcTxtDc").getText();
            var oDiscDropPoint = this.getView().byId("idDcIpDp").getValue();
            var oDiscIs = this.getView().byId("idDcTxtIs").getValue();
            var oDiscShouldbe = this.getView().byId("idDcTaSb").getValue();
            var oDiscAsPer = this.getView().byId("idDcInpAp").getValue();
            var oDiscIncompletion = this.getView().byId("idDcCbIf").getSelected();

            if ((oDiscCompSerialNo.length === 1 && oDiscTraceNo.length === 1) ||
                (oDiscCompSerialNo.length === 1 && oDiscTraceNo.length === 0) ||
                (oDiscCompSerialNo.length === 0 && oDiscTraceNo.length === 1) ||
                (oDiscCompSerialNo.length === 0 && oDiscTraceNo.length === 0)) {
                sap.ui.core.BusyIndicator.show();
                oDiscCompSerialNo = oDiscCompSerialNo.length === 1 ? oDiscCompSerialNo[0].getKey() : "";
                oDiscTraceNo = oDiscTraceNo.length === 1 ? oDiscTraceNo[0].getKey() : "";
                var payloadUpdDisData = {
                    "NotificationNo": oNotifNo,
                    "DiscrepancyNo": oDiscrepancyNo,
                    "WorkGroup": oWorkGroup,
                    "LinkedTo": oDisLinkedTo,
                    "Liability": oDiscLiability,
                    "LiabilityText": oLiabilityText,
                    "Partner": oDiscPartner,
                    "PartnerName": oDiscPartnerName,
                    "SupercedesItem": oDiscSupercedesItem,
                    "SupercededByItem": oDiscSupercededByItem,
                    // "DropShip2": oDiscDropShip2,
                    "Aircraft": oDiscAircraft,
                    // "OpenDate": oDiscOpenDate,
                    // "CloseDate": oDiscCloseDate,
                    "PartNumber": oDiscPartNumber,
                    "PartDesc": oDiscPartDesc,
                    "InspQnty": oDiscInspQnty === "" ? "0" : oDiscInspQnty,
                    "RejectQnty": oDiscRejectQnty === "" ? "0" : oDiscRejectQnty,
                    "QntyUOM": oDiscQntyUOM,
                    "CompSerialNo": oDiscCompSerialNo,
                    "TraceNo": oDiscTraceNo,
                    "PrelimInvest": oDiscPrelimInvest,
                    "PartQuarantine": oDiscPartQuarantine,
                    "MESissue": oDiscMESissue,
                    "CsmsIssue": oDiscCsmsIssue,
                    "PrelimCause": oDiscPrelimCause,
                    "DefectCode": oDiscDefectCode,
                    "Defect": oDiscDefect,
                    "DefectCodeDesc": oDiscDefectCodeDesc,
                    "DropPoint": oDiscDropPoint,
                    "Is": oDiscIs,
                    "Shouldbe": oDiscShouldbe,
                    "AsPer": oDiscAsPer,
                    "Incompletion": oDiscIncompletion,
                    "WorkGroupMRB": (this.oSelectedWrkGrp === "" || this.oSelectedWrkGrp == undefined || this.oSelectedWrkGrp == false) ? "" : this.oSelectedWrkGrp,
                    "IsMRB": (this.oDiscMRBCertifiedUser === "" || this.oDiscMRBCertifiedUser == undefined || this.oDiscMRBCertifiedUser == false) ? false : true,
                    "IsMRBYes": (this.oDiscMRBActionYes === "" || this.oDiscMRBActionYes == undefined || this.oDiscMRBActionYes == false) ? false : true,
                    "IsMRBNo": (this.oDiscMRBActionNo === "" || this.oDiscMRBActionNo == undefined || this.oDiscMRBActionNo == false) ? false : true,
                    "IsMasterCheck": (this.oIsMasterCheckFlag === "" || this.oIsMasterCheckFlag == undefined || this.oIsMasterCheckFlag == false) ? false : true,
                    "IsWorkingQueue": this.oIsWorkingQueueFlag
                }
                oModel.create("/NotificationDiscrepancySet", payloadUpdDisData, {
                    success: function (odata, Response) {
                        sap.ui.core.BusyIndicator.hide();
                        if (Response.headers["sap-message"]) {
                            var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                            MessageBox.success(oMsg);
                        }
                        var oDiscrepancyNo = odata.DiscrepancyNo;
                        this.bindDiscrepancyTab(oDiscrepancyNo);
                        this.resetDiscInitialisedFields();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            } else {
                var payloadUpdDisData = {
                    "NotificationNo": oNotifNo,
                    "DiscrepancyNo": oDiscrepancyNo,
                    "WorkGroup": oWorkGroup,
                    "LinkedTo": oDisLinkedTo,
                    "Liability": oDiscLiability,
                    "LiabilityText": oLiabilityText,
                    "Partner": oDiscPartner,
                    "PartnerName": oDiscPartnerName,
                    "SupercedesItem": oDiscSupercedesItem,
                    "SupercededByItem": oDiscSupercededByItem,
                    // "DropShip2": oDiscDropShip2,
                    "Aircraft": oDiscAircraft,
                    // "OpenDate": oDiscOpenDate,
                    // "CloseDate": oDiscCloseDate,
                    "PartNumber": oDiscPartNumber,
                    "PartDesc": oDiscPartDesc,
                    "InspQnty": oDiscInspQnty === "" ? "0" : oDiscInspQnty,
                    "RejectQnty": oDiscRejectQnty === "" ? "0" : oDiscRejectQnty,
                    "QntyUOM": oDiscQntyUOM,
                    "to_serials": [],
                    "to_traces": [],
                    "PrelimInvest": oDiscPrelimInvest,
                    "PartQuarantine": oDiscPartQuarantine,
                    "MESissue": oDiscMESissue,
                    "CsmsIssue": oDiscCsmsIssue,
                    "PrelimCause": oDiscPrelimCause,
                    "DefectCode": oDiscDefectCode,
                    "Defect": oDiscDefect,
                    "DefectCodeDesc": oDiscDefectCodeDesc,
                    "DropPoint": oDiscDropPoint,
                    "Is": oDiscIs,
                    "Shouldbe": oDiscShouldbe,
                    "AsPer": oDiscAsPer,
                    "Incompletion": oDiscIncompletion,
                    "WorkGroupMRB": (this.oSelectedWrkGrp === "" || this.oSelectedWrkGrp == undefined || this.oSelectedWrkGrp == false) ? "" : this.oSelectedWrkGrp,
                    "IsMRB": (this.oDiscMRBCertifiedUser === "" || this.oDiscMRBCertifiedUser == undefined || this.oDiscMRBCertifiedUser == false) ? false : true,
                    "IsMRBYes": (this.oDiscMRBActionYes === "" || this.oDiscMRBActionYes == undefined || this.oDiscMRBActionYes == false) ? false : true,
                    "IsMRBNo": (this.oDiscMRBActionNo === "" || this.oDiscMRBActionNo == undefined || this.oDiscMRBActionNo == false) ? false : true,
                    "IsMasterCheck": (this.oIsMasterCheckFlag === "" || this.oIsMasterCheckFlag == undefined || this.oIsMasterCheckFlag == false) ? false : true,
                    "IsWorkingQueue": this.oIsWorkingQueueFlag
                };
                if (oDiscCompSerialNo.length > 1) {
                    payloadUpdDisData["to_serials"] = [];
                    for (var i = 0; i < oDiscCompSerialNo.length; i++) {
                        var oSerialNo = oDiscCompSerialNo[i].getKey();
                        payloadUpdDisData["to_serials"].push({
                            "NotificationNo": oNotifNo,
                            "DiscrepancyNo": oDiscrepancyNo,
                            "SerialNo": oSerialNo
                        });
                    }
                }

                if (oDiscTraceNo.length > 1) {
                    payloadUpdDisData["to_traces"] = [];
                    for (var j = 0; j < oDiscTraceNo.length; j++) {
                        var oTraceNo = oDiscTraceNo[j].getKey();
                        payloadUpdDisData["to_traces"].push({
                            "NotificationNo": oNotifNo,
                            "DiscrepancyNo": oDiscrepancyNo,
                            "TraceNo": oTraceNo
                        });
                    }
                }

                oModel.create("/NotificationDiscrepancySet", payloadUpdDisData, {
                    success: function (odata, Response) {
                        sap.ui.core.BusyIndicator.hide();
                        if (Response.headers["sap-message"]) {
                            var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                            MessageBox.success(oMsg);
                        }
                        var oDiscrepancyNo = odata.DiscrepancyNo;
                        this.bindDiscrepancyTab(oDiscrepancyNo);
                        this.resetDiscInitialisedFields();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            }
        },

        resetDiscInitialisedFields: function () {
            this.oSelectedWrkGrp = "";
            this.oDiscMRBCertifiedUser = "";
            this.oDiscMRBActionYes = "";
            this.oDiscMRBActionNo = "";
            this.oDiscIncompleteFlag = "";
            this.oIsMasterCheckFlag = "";
        },

        onChangeAttachNCHeader: function (oEvent) {
            var fileContent = oEvent.getParameter("files")[0];
            var oUploadCollection = oEvent.getSource();
            var oModel = this.getOwnerComponent().getModel();
            var array = [];
            array.push(oEvent.getParameters().files[0]);
            oModel.refreshSecurityToken();
            var oCustomHeaderToken = new sap.m.UploadCollectionParameter({
                name: "x-csrf-token",
                value: oModel.getSecurityToken()
            });
            oUploadCollection.addHeaderParameter(oCustomHeaderToken);

            var obj = {
                "FileContent": fileContent,
                "FileID": Math.floor(Math.random() * 143143)
            };

            var oAttModel = this.getView().getModel("AttachmentModel").getData();
            oAttModel.push(obj);
            this.onUploadAttachNCHeader();
        },

        onUploadCompleteNCHeader: function (oEvent) {
            var sUploadedFile = oEvent.getParameter("files")[0].fileName;
            if (!sUploadedFile) {
                var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
                sUploadedFile = aUploadedFile[0];
            }
            oItem = {
                "AttachID": jQuery.now().toString(),
                "FileName": sUploadedFile
            };
        },

        onBeforeUploadStartsNCHeader: function (oEvent) {
            var data = this.getView().getModel("AttachmentModel").getData();
            for (var k = 0; k < data.length; k++) {
                var oCustomHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: oEvent.getParameter("fileName")
                });
                oEvent.getParameters().addHeaderParameter(oCustomHeaderSlug);
            }
        },

        onUploadAttachNCHeader: function () {
            var data = this.getView().getModel("AttachmentModel").getData();
            for (var k = 0; k < data.length; k++) {
                var p = 0;
                var i = this.getView().getModel();
                var c = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: i.getSecurityToken()
                });
                this.token = c.getProperty("value");
                this.slug = data[k].FileContent.name + "|" + sObjectId + "|" + "0001";
                this.oContentType = data[k].FileContent.type;
                var e = {
                    "x-csrf-token": this.token,
                    slug: this.slug,
                    "Content-type": this.oContentType
                };
                jQuery.ajax({
                    type: "POST",
                    url: this.getOwnerComponent().getModel().sServiceUrl + "/FileUploadSet",
                    headers: e,
                    cache: false,
                    // contentType: this.oContentType,
                    // datatype : "application/json",
                    processData: false,
                    data: data[k].FileContent,
                    async: true,
                    success: function (data, response) {
                    },
                    error: function (err) {
                    }
                })
            }
        },

        bindDispositionTab: function (discrepancyNo) {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/CreateNotificationHeaderSet('" + sObjectId + "')/to_discrepancy(NotificationNo='" + sObjectId + "',DiscrepancyNo='" + discrepancyNo + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData;
                    var discstatus = data.Status,
                        discrepancyNum = data.DiscrepancyNo == 0 ? "" : data.DiscrepancyNo,
                        partNumber = data.PartNumber,
                        partDesc = data.PartDesc,
                        partner = data.Partner,
                        partnername = data.PartnerName,
                        prelimInvest = data.PrelimInvest,
                        partQuarantine = data.PartQuarantine,
                        mesIssue = data.MESissue,
                        csmsIssue = data.CsmsIssue,
                        prelimCause = data.PrelimCause,
                        defectCode = data.DefectCode,
                        defect = data.Defect,
                        defectCodeDesc = data.DefectCodeDesc,
                        dropPoint = data.DropPoint == 0 ? "" : data.DropPoint,
                        is = data.Is,
                        shouldbe = data.Shouldbe,
                        asPer = data.AsPer,
                        incompletion = data.Incompletion;
                    if (discrepancyNum === "") {
                        this.getView().byId("headertext").setText();
                    } else {
                        this.getView().byId("headertext").setText("Discrepancy/Disposition No: " + discrepancyNum + "/");
                    }
                    this.getView().byId("idDispCobDscNo").setValue(discrepancyNum);
                    this.getView().byId("idDispCobDscNo").setSelectedKey(discrepancyNum);
                    this.getView().byId("idObjNCStatusDispo").setText();
                    //setting values in General Info Screen                    
                    this.getView().byId("idInpDispPrtNo").setValue(partNumber);
                    this.getView().byId("idOsDispPrtDesc").setText(partDesc);
                    this.getView().byId("dispGenInterCharge").setSelected(false);
                    this.getView().byId("dispGenDropPoint").setValue();
                    this.getView().byId("dispGenRestrictPart").setSelected(false);
                    this.getView().byId("dispGenCSN").setState(false);
                    this.getView().byId("dispGenPartSuppName").setValue(partner);
                    this.getView().byId("dispGenPartSuppDesc").setValue(partnername);
                    // this.getView().byId("dispGenMajorMinorNC").setSelectedKey();
                    // this.getView().byId("dispGenMajorMinorNC").setValue();
                    this._oMultiInputDispoSN.removeAllTokens();
                    this._oMultiInputDispoRewrkOrd.removeAllTokens();
                    //setting values in descripancy details                     
                    this.getView().byId("idDispTAPi").setValue(prelimInvest);
                    this.getView().byId("idDispCbPrq").setSelected(partQuarantine);
                    this.getView().byId("idDispCbMesi").setValue(mesIssue);
                    this.getView().byId("idDispCbCsmsi").setValue(csmsIssue);
                    this.getView().byId("idDispCobPc").setSelectedKey(prelimCause);
                    this.getView().byId("idDispIpDc").setValue(defectCode);
                    this.getView().byId("idDispIpDcVal1").setValue(defect);
                    this.getView().byId("idDispTxtDc").setText(defectCodeDesc);
                    this.getView().byId("idDispIpDp").setValue(dropPoint);
                    this.getView().byId("idDispTxtIs").setValue(is);
                    this.getView().byId("idDispTaSb").setValue(shouldbe);
                    this.getView().byId("idDispInpAp").setValue(asPer);
                    this.getView().byId("idDispCbIf").setSelected(incompletion);
                    this.getView().byId("idDispoTextArea").setValue();
                    this.bindDispositionDetails();
                    this.bindBuyOffTable();
                    this.oQtyUOM = data.QntyUOM;
                    if (discstatus == "Cancelled") {
                        this.getView().byId("idBtnDispositionAdd").setEnabled(false);
                        MessageBox.information("The selected discrepancy is in cancelled status, so disposition can't be created.");
                    } else {
                        this.getView().byId("idBtnDispositionAdd").setEnabled(true);
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        bindDispositionDetails: function (sValue) {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDiscrepacyNo;
            if (sValue) {
                oDiscrepacyNo = sValue;
            } else {
                oDiscrepacyNo = this.getView().byId("idDispCobDscNo").getValue();
            }
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/NotificationDiscrepancySet(NotificationNo='" + sObjectId + "',DiscrepancyNo='" + oDiscrepacyNo + "')";
            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_disposition"
                },
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    /*** Working Queue*/
                    /**if (oData.to_disposition.results.length > 0) {
                        if (this.workingQueueMode == "EDIT") {
                            var dispLineItemODataArray = [];
                            var oROLineItemModel;
                            for (var i = 0; i < oData.to_disposition.results.length; i++) {
                                if (oData.to_disposition.results[i].DispoChangeFields != "") {
                                    dispLineItemODataArray = oData.to_disposition.results[i].DispoChangeFields.split(',');
                                    oROLineItemModel = Utils.getReadonlyPropField(dispLineItemODataArray, "Dispo");
                                    oData.to_disposition.results[i].DispostionTypeRO = oROLineItemModel.oData.DispostionType;
                                    oData.to_disposition.results[i].DispositionCodeRO = oROLineItemModel.oData.DispositionCode;
                                    oData.to_disposition.results[i].DispositionQntyRO = oROLineItemModel.oData.DispositionQnty;
                                    oData.to_disposition.results[i].DispositionPartReqRO = oROLineItemModel.oData.DispositionPartReq;
                                } else {
                                    oROLineItemModel = Utils.getReadonlyPropField(dispLineItemODataArray, "Dispo");
                                    oData.to_disposition.results[i].DispostionTypeRO = oROLineItemModel.oData.DispostionType;
                                    oData.to_disposition.results[i].DispositionCodeRO = oROLineItemModel.oData.DispositionCode;
                                    oData.to_disposition.results[i].DispositionQntyRO = oROLineItemModel.oData.DispositionQnty;
                                    oData.to_disposition.results[i].DispositionPartReqRO = oROLineItemModel.oData.DispositionPartReq;
                                }
                            }
                        } else {
                            for (var i = 0; i < oData.to_disposition.results.length; i++) {
                                oData.to_disposition.results[i].DispostionTypeRO = true;
                                oData.to_disposition.results[i].DispositionCodeRO = true;
                                oData.to_disposition.results[i].DispositionQntyRO = true;
                                oData.to_disposition.results[i].DispositionPartReqRO = true;
                            }
                        }
                    }**/
                    /**
                     * Working queue end
                     */
                    var data = oData.to_disposition.results;
                    oModel.setData(data);
                    this.getView().byId("idTableDisposition").setModel(oModel, "DispositionDetails");
                    this.getView().byId("idBtnDispositionRTV").setEnabled(false);
                    this.getView().byId("idBtnDispositionCopy").setEnabled(false);
                    this.getView().byId("idBtnDispositionDlt").setEnabled(false);
                    this.getView().byId("idBtnMRBDisp").setEnabled(false);
                    this.getView().byId("idBtnBuyOffAdd").setEnabled(false);
                    this.getView().byId("idDispoGenInfoIncompFlag").setEnabled(false);
                    this.resetDispositionGenInfoFields();
                    var oDiscNo = this.getView().byId("idDispCobDscNo").getValue();
                    this.getView().byId("headertext").setText("Discrepancy/Disposition No: " + oDiscNo + "/");
                    this.getView().byId("idObjNCStatusDispo").setText();
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        bindMajorMinorNc: function () {
            sap.ui.core.BusyIndicator.show();
            var oMajMinModel = new JSONModel();
            oMajMinModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DISPIMPACT"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oMajMinModel.setData(data);
                    this.getView().byId("dispGenMajorMinorNC").setModel(oMajMinModel, "DispoMajMinNCModel");
                    this.getView().byId("dispGenMajorMinorNC").setSelectedKey("DISPIMPACT");
                    this.getView().byId("dispGenMajorMinorNC").setValue("MINOR");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        handleChangeMajorMinorNC: function () {
            sap.ui.core.BusyIndicator.show();
            var oDataModel = this.getOwnerComponent().getModel();
            var oMajorMinorNCValue = this.getView().byId("dispGenMajorMinorNC").getValue();
            var oMajorMinorNCKey = this.getView().byId("dispGenMajorMinorNC").getSelectedKey();
            var sPath = "/CheckMajorMinorChangeSet(DispositionMajorMinor='" + oMajorMinorNCValue + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    if (oData.Change == false && this.getView().byId("idTableDisposition").getSelectedItem() == null) {
                        var oMajMinNCMsg = this.getView().getModel("i18n").getProperty("MajMinNCMsg");
                        MessageBox.warning(oMajMinNCMsg);
                        this.getView().byId("dispGenMajorMinorNC").setSelectedKey();
                        this.getView().byId("dispGenMajorMinorNC").setValue();
                    } else if (oData.Change == false && this.getView().byId("idTableDisposition").getSelectedItem()) {
                        var oMajMinNCMsg = this.getView().getModel("i18n").getProperty("MajMinNCMsg");
                        MessageBox.warning(oMajMinNCMsg);
                        this.getView().byId("dispGenMajorMinorNC").setSelectedKey("DISPIMPACT");
                        this.getView().byId("dispGenMajorMinorNC").setValue(this.oMajorMinorNC);
                    } else {
                        this.getView().byId("dispGenMajorMinorNC").setSelectedKey(oMajorMinorNCKey);
                        this.getView().byId("dispGenMajorMinorNC").setValue(oMajorMinorNCValue);
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onOpenVHDispoSerNo: function () {
            this.oSerNoColModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/disposernocolmodel.json");
            var aCols = this.oSerNoColModel.getData().cols;
            this._oBasicSearchFieldDispoSN = new SearchField({
                showSearchButton: false
            });
            sap.ui.core.BusyIndicator.show();
            this._oValueHelpDialogDispoSN = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DispoSerialNoVHDialog", this);
            this.getView().addDependent(this._oValueHelpDialogDispoSN);
            this._oValueHelpDialogDispoSN.getFilterBar().setBasicSearch(this._oBasicSearchFieldDispoSN);
            this._oValueHelpDialogDispoSN.getTableAsync().then(function (oTable) {
                sap.ui.core.BusyIndicator.show();
                var oModel = new sap.ui.model.json.JSONModel();
                var oDataModel = this.getOwnerComponent().getModel();
                var sDiscrepancy = this.getView().byId("idDispCobDscNo").getValue();
                var oFilter = [];
                oFilter.push(new Filter("NotificationNo", FilterOperator.EQ, sObjectId));
                oFilter.push(new Filter("DiscrepancyNo", FilterOperator.EQ, sDiscrepancy));
                var sPath = "/DispositionSerialF4Set";
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        oTable.setModel(oModel);
                        oTable.setModel(this.oSerNoColModel, "columns");

                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", "/");
                        }

                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/", function () {
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        return new Label({ text: "{" + column.template + "}" });
                                    })
                                });
                            });
                        }
                        this._oValueHelpDialogDispoSN.update();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            }.bind(this));
            this._oValueHelpDialogDispoSN.setTokens(this._oMultiInputDispoSN.getTokens());
            this._oValueHelpDialogDispoSN.open();
            sap.ui.core.BusyIndicator.hide();
        },

        onFBSearchDispoSerNo: function (oEvent) {
            var sSearchQuery = this._oBasicSearchFieldDispoSN.getValue(),
                aSelectionSet = oEvent.getParameter("selectionSet");
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }
                return aResult;
            }, []);

            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "SerialNo", operator: FilterOperator.Contains, value1: sSearchQuery })
                ],
                and: false
            }));

            this._filterDispoTable(new Filter({
                filters: aFilters,
                and: true
            }));
        },

        _filterDispoTable: function (oFilter) {
            var oValueHelpDialogDispoSerNo = this._oValueHelpDialogDispoSN;
            oValueHelpDialogDispoSerNo.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                    oTable.getBinding("rows").filter(oFilter);
                }
                if (oTable.bindItems) {
                    oTable.getBinding("items").filter(oFilter);
                }
                oValueHelpDialogDispoSerNo.update();
            });
        },

        onValueHelpDispoSNOkPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            this._oMultiInputDispoSN.setTokens(aTokens);
            this._oValueHelpDialogDispoSN.close();
        },

        onValueHelpDispoSNCancelPress: function () {
            this._oValueHelpDialogDispoSN.close();
        },

        onValueHelpDispoSNAfterClose: function () {
            this._oValueHelpDialogDispoSN.destroy();
        },

        _onTokenUpdateDispoSN: function (oEvent) {
            var aTokens,
                sTokensText = "",
                sNo,
                i,
                j,
                bFlag = true;

            if (oEvent.getParameter('type') === Tokenizer.TokenUpdateType.Added) {
                aTokens = oEvent.getParameter('addedTokens');
                sTokensText = "Added tokens: ";
                sap.ui.core.BusyIndicator.show();
                var sDiscrepancy = this.getView().byId("idDispCobDscNo").getValue();
                var oModel = new sap.ui.model.json.JSONModel();
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilter = [];
                oFilter.push(new Filter("NotificationNo", FilterOperator.EQ, sObjectId));
                oFilter.push(new Filter("DiscrepancyNo", FilterOperator.EQ, sDiscrepancy));
                var sPath = "/DispositionSerialF4Set";
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        for (i = 0; i < aTokens.length; i++) {
                            sTokensText = aTokens[i].getText();
                            if (oModel.getData().length === 0) {
                                bFlag = false;
                                break;
                            } else {
                                for (j = 0; j < oModel.getData().length; j++) {
                                    sNo = oModel.getData()[j].SerialNo;
                                    if (sTokensText === sNo) {
                                        bFlag = true;
                                        break;
                                    } else {
                                        bFlag = false;
                                    }
                                }
                            }
                        }
                        if (bFlag === false) {
                            var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
                            var oSerMsg = this.getView().getModel("i18n").getProperty("TokenUpdateSerNoMsg");
                            MessageBox.information(
                                oSerMsg,
                                {
                                    styleClass: bCompact ? "sapUiSizeCompact" : ""
                                }
                            );
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

        onOpenVHDispoRewrkOrd: function () {
            this.oReWrkOrdColModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/reworkordercolmodel.json");
            var aCols = this.oReWrkOrdColModel.getData().cols;
            // this._oBasicSearchFieldDispoRewrkOrd = new SearchField({
            //     showSearchButton: false
            // });
            sap.ui.core.BusyIndicator.show();
            this._oVHDialogDispoReworkOrd = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.ReworkOrderVHDialog", this);
            this.getView().addDependent(this._oVHDialogDispoReworkOrd);
            // this._oVHDialogDispoReworkOrd.getFilterBar().setBasicSearch(this._oBasicSearchFieldDispoRewrkOrd);
            this._oVHDialogDispoReworkOrd.getTableAsync().then(function (oTable) {
                sap.ui.core.BusyIndicator.show();
                var oModel = new sap.ui.model.json.JSONModel();
                var oDataModel = this.getOwnerComponent().getModel();
                var sPath = "/GetDispositionOrderF4Set";
                oDataModel.read(sPath, {
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        oTable.setModel(oModel);
                        oTable.setModel(this.oReWrkOrdColModel, "columns");

                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", "/");
                        }

                        if (oTable.bindItems) {
                            oTable.bindAggregation("items", "/", function () {
                                return new ColumnListItem({
                                    cells: aCols.map(function (column) {
                                        return new Label({ text: "{" + column.template + "}" });
                                    })
                                });
                            });
                        }
                        this._oVHDialogDispoReworkOrd.update();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            }.bind(this));
            this._oVHDialogDispoReworkOrd.setTokens(this._oMultiInputDispoRewrkOrd.getTokens());
            this._oVHDialogDispoReworkOrd.open();
            sap.ui.core.BusyIndicator.hide();
        },

        onFBSearchDispoRewrkOrd: function (oEvent) {
            var aSelectionSet = oEvent.getParameter("selectionSet");
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }
                return aResult;
            }, []);

            this._filterDispoReworkOrder(new Filter({
                filters: aFilters,
                and: true
            }));
        },

        _filterDispoReworkOrder: function (oFilter) {
            var oVHDialogDispoRewrkOrd = this._oVHDialogDispoReworkOrd;
            oVHDialogDispoRewrkOrd.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                    oTable.getBinding("rows").filter(oFilter);
                }
                if (oTable.bindItems) {
                    oTable.getBinding("items").filter(oFilter);
                }
                oVHDialogDispoRewrkOrd.update();
            });
        },

        onVHDispoRewrkOrdPress: function (oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            this._oMultiInputDispoRewrkOrd.setTokens(aTokens);
            this._oVHDialogDispoReworkOrd.close();
        },

        onVHDispoRewrkOrdCancelPress: function () {
            this._oVHDialogDispoReworkOrd.close();
        },

        onVHDispoRewrkOrdAfterClose: function () {
            this._oVHDialogDispoReworkOrd.destroy();
        },

        onVHReqDispoOrderType: function (oEvent) {
            this._oDispoOrdTypeDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DispositionOrderType", this);
            this.getView().addDependent(this._oDispoOrdTypeDialog);
            this._oDispoOrdTypeDialog.open();
            this.oDispoOrdTypeInp = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DISPOORDTYPE"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oDispoOrdTypeDialog.setModel(oModel, "DispoOrdTypeModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configDispoOrdTypeVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oDispoOrdTypeInp;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oDispoOrdTypeDialog.destroy();
        },

        onSearchDispoOrdType: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onVHReqDispoProcessGrp: function (oEvent) {
            this._oDispoProGrpDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DispositionProcessingGroup", this);
            this.getView().addDependent(this._oDispoProGrpDialog);
            this._oDispoProGrpDialog.open();
            this.oDispoProGrpInp = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DISPOGROUP"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oDispoProGrpDialog.setModel(oModel, "DispoProcessGrpModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configDispoProGrpVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oDispoProGrpInp;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oDispoProGrpDialog.destroy();
        },

        onSearchDispoProGrp: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onVHReqDispoControlArea: function (oEvent) {
            this._oDispoControlAreaDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DispositionControllingArea", this);
            this.getView().addDependent(this._oDispoControlAreaDialog);
            this._oDispoControlAreaDialog.open();
            this.oDispoControlAreaInp = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DISPOCONAREA"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oDispoControlAreaDialog.setModel(oModel, "DispoControlAreaModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configDispoControlAreaVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oDispoControlAreaInp;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oDispoControlAreaDialog.destroy();
        },

        onSearchDispoControlArea: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onDispoistionMRB: function () {
            this._oMRBDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.ZQM_NCR.fragments.MRBDisposition", this);
            this.getView().addDependent(this._oMRBDialog);
            this._oMRBDialog.open();
            this.getView().byId("idmrbPartno").setValue(this.getView().byId("idInpDispPrtNo").getValue());
            this.getView().byId("idmrbPartDesc").setValue(this.getView().byId("idOsDispPrtDesc").getText());
            this.getView().byId("idmrbUnit").setValue(this.oQtyUOM);
        },

        onCloseMRBRequestOut: function () {
            this._oMRBDialog.close();
            this._oMRBDialog.destroy();
        },

        onPressSaveMRBRequestOut: function () {
            var oMrbReqNo = this.getView().byId("idmrbReqno").getValue();
            var oMrbPartNo = this.getView().byId("idmrbPartno").getValue();
            var oMrbOrderNo = this.getView().byId("idmrbOrderno").getValue();
            var oMrbQty = this.getView().byId("idmrbQuantity").getValue();
            var oMrbUnit = this.getView().byId("idmrbUnit").getValue();
            var oMrbAircraftNo = this.getView().byId("idmrbAircraftNo").getValue();
            var oMrbWrkCntr = this.getView().byId("idmrbWorkCenter").getValue();
            var oMrbDrpPnt = this.getView().byId("idmrbDropPoint").getValue();
            var oMrbAttenName = this.getView().byId("idmrbTotheAtt").getValue();
            var oMrbAddInfo = this.getView().byId("idmrbAddInfo").getValue();
            var oDispoNotification = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("NotificationNo");
            var oDispoDiscrepancy = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DiscrepancyNo");
            var oParentDispoNo = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("ParentDispoNo");

            var payloadMRBData = {
                "NotificationNo": oDispoNotification,
                "DiscrepancyNo": oDispoDiscrepancy,
                "ParentDispoNo": oParentDispoNo,
                "MRBReqNo": oMrbReqNo,
                "PartNo": oMrbPartNo,
                "OrderNo": oMrbOrderNo,
                "Quantity": oMrbQty,
                "UOM": oMrbUnit,
                "AircraftNo": oMrbAircraftNo,
                "WorkCenter": oMrbWrkCntr,
                "Droppoint": oMrbDrpPnt,
                "AttentionName": oMrbAttenName,
                "Comments": oMrbAddInfo
            }

            this.getOwnerComponent().getModel().create("/DispositionMRBReqSet", payloadMRBData, {
                success: function (odata, Response) {
                    sap.ui.core.BusyIndicator.hide();
                    if (Response.headers["sap-message"]) {
                        var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                        MessageBox.success(oMsg, {
                            onClose: function () {
                                if (odata.MRBReqNo) {
                                    this.getView().byId("idmrbReqno").setValue(odata.MRBReqNo);
                                    this.getView().byId("idmrbExstReqNo").setValue(odata.MRBReqNo);
                                }
                                // this.getView().byId("idmrbOrderno").setValue();
                                // this.getView().byId("idmrbQuantity").setValue();
                                // this.getView().byId("idmrbAircraftNo").setValue();
                                // this.getView().byId("idmrbWorkCenter").setValue();
                                // this.getView().byId("idmrbDropPoint").setValue();
                                // this.getView().byId("idmrbTotheAtt").setValue();
                                // this.getView().byId("idmrbAddInfo").setValue();
                                // this.getView().byId("idmrbReqno").setValue();
                            }.bind(this)
                        });
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onOpenMrbVHReqNo: function () {
            this._oMRBVHDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.MRBValueHelp", this);
            this.getView().addDependent(this._oMRBVHDialog);
            this._oMRBVHDialog.open();
            var oDispoNotification = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("NotificationNo");
            var oDispoDiscrepancy = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DiscrepancyNo");
            var oParentDispoNo = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("ParentDispoNo");
            var oWorkGroupKey = this.getView().byId("idworkgroup").getText();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/NotificationDispositionSet(NotificationNo='" + oDispoNotification + "',DiscrepancyNo='" + oDispoDiscrepancy + "',ParentDispoNo='" + oParentDispoNo + "',WorkGroupKey='" + oWorkGroupKey + "')";
            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_disposerial,to_dispomrb"
                },
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.to_dispomrb.results;
                    oModel.setData(data);
                    this._oMRBVHDialog.setModel(oModel, "MRBModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _confirmMRBReqOutVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput;
            oInput = this.getView().byId("idmrbExstReqNo");

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle());
            this._oMRBVHDialog.destroy();
        },

        onMRBReqOutSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("MRBReqNo", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        handleGoMRBRequestNo: function () {
            var oDispoNotification = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("NotificationNo");
            var oDispoDiscrepancy = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DiscrepancyNo");
            var oParentDispoNo = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("ParentDispoNo");
            var oMrbReqNo = this.getView().byId("idmrbExstReqNo").getValue();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/DispositionMRBReqSet(NotificationNo='" + oDispoNotification + "',DiscrepancyNo='" + oDispoDiscrepancy + "',ParentDispoNo='" + oParentDispoNo + "',MRBReqNo='" + oMrbReqNo + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var oAircraftNo = oData.AircraftNo,
                        oAttentionName = oData.AttentionName,
                        oComments = oData.Comments,
                        oDroppoint = oData.Droppoint,
                        oMRBReqNo = oData.MRBReqNo,
                        oOrderNo = oData.OrderNo,
                        oPartNo = oData.PartNo,
                        oQuantity = oData.Quantity,
                        oUOM = oData.UOM,
                        oWorkCenter = oData.WorkCenter

                    this.getView().byId("idmrbOrderno").setValue(oOrderNo);
                    this.getView().byId("idmrbQuantity").setValue(oQuantity);
                    this.getView().byId("idmrbAircraftNo").setValue(oAircraftNo);
                    this.getView().byId("idmrbWorkCenter").setValue(oWorkCenter);
                    this.getView().byId("idmrbDropPoint").setValue(oDroppoint);
                    this.getView().byId("idmrbTotheAtt").setValue(oAttentionName);
                    this.getView().byId("idmrbAddInfo").setValue(oComments);
                    this.getView().byId("idmrbReqno").setValue(oMRBReqNo);
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        handleCrtMRBRequestNo: function () {
            this.getView().byId("idmrbOrderno").setValue();
            this.getView().byId("idmrbQuantity").setValue();
            this.getView().byId("idmrbAircraftNo").setValue();
            this.getView().byId("idmrbWorkCenter").setValue();
            this.getView().byId("idmrbDropPoint").setValue();
            this.getView().byId("idmrbTotheAtt").setValue();
            this.getView().byId("idmrbAddInfo").setValue();
            this.getView().byId("idmrbReqno").setValue();
            this.getView().byId("idmrbExstReqNo").setValue();
        },

        onAddDispositionLineItem: function () {
            if (this.getView().byId("idTableDisposition").getSelectedItem()) {
                this.getView().byId("dispGenInterCharge").setSelected(false);
                this.getView().byId("idDispoGenInfoIncompFlag").setSelected(true);
                this.getView().byId("dispGenDropPoint").setValue();
                this.getView().byId("dispGenRestrictPart").setSelected(false);
                this.getView().byId("dispGenCSN").setState(false);
                // this.getView().byId("dispGenPartSuppName").setValue();
                // this.getView().byId("dispGenPartSuppDesc").setValue();
                this.getView().byId("dispGenMajorMinorNC").setSelectedKey("DISPIMPACT");
                this.getView().byId("dispGenMajorMinorNC").setValue("MINOR");
                this.getView().byId("idTableDisposition").removeSelections(true);
                this.getView().byId("idObjNCStatusDispo").setText();
                var oDiscNo = this.getView().byId("idDispCobDscNo").getValue();
                this.getView().byId("headertext").setText("Discrepancy/Disposition No: " + oDiscNo + "/");
                this._oMultiInputDispoSN.removeAllTokens();
                this._oMultiInputDispoRewrkOrd.removeAllTokens();
                this.getView().byId("idDispoTextArea").setValue();
            }
            var oDispositionTable = this.getView().byId("idTableDisposition");
            var oDispoTableModel = oDispositionTable.getModel("DispositionDetails").getData();
            if (oDispoTableModel.length === 0) {
                oDispoTableModel.push({
                    "ParentDispoNo": "",
                    "DispostionType": "",
                    "DispositionCode": "",
                    "DispositionStatus": "",
                    "DispositionQnty": "",
                    "DispositionPartReq": "",
                    "DispositionAttchement": "",
                    "DispositionCreateBy": "",
                    "DispositionBadge": "",
                    "DispositionGroup": "",
                    "DispositionDateinWorking": ""
                });
                oDispositionTable.getModel("DispositionDetails").setData(oDispoTableModel);
            } else if (oDispoTableModel.length > 0) {
                var bFlag = false, sDispoSerialNo;
                for (var k = 0; k < oDispoTableModel.length; k++) {
                    sDispoSerialNo = oDispoTableModel[k].ParentDispoNo;
                    if (sDispoSerialNo === "") {
                        bFlag = false;
                        break;
                    } else {
                        bFlag = true;
                    }
                }
                if (bFlag === false) {
                    var oDispoAddItemMsg = this.getView().getModel("i18n").getProperty("DispoAddItemMsg");
                    MessageBox.warning(oDispoAddItemMsg);
                } else {
                    oDispoTableModel.push({
                        "ParentDispoNo": "",
                        "DispostionType": "",
                        "DispositionCode": "",
                        "DispositionStatus": "",
                        "DispositionQnty": "",
                        "DispositionPartReq": "",
                        "DispositionAttchement": "",
                        "DispositionCreateBy": "",
                        "DispositionBadge": "",
                        "DispositionGroup": "",
                        "DispositionDateinWorking": ""
                    });
                    oDispositionTable.getModel("DispositionDetails").setData(oDispoTableModel);
                }
            }
            this.bindBuyOffTable();
            this.getView().byId("idBtnBuyOffAdd").setEnabled(false);
        },

        onCancelDisposition: function () {
            var oDispoNotifNo = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("NotificationNo");
            var oDispoDiscrepancy = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DiscrepancyNo");
            var oDispoParentNo = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("ParentDispoNo");
            // var oDispoStatus = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionStatus");
            var payloadDispoCancelData = {
                "NotificationNo": oDispoNotifNo,
                "DiscrepancyNo": oDispoDiscrepancy,
                "ParentDispoNo": oDispoParentNo,
                "DispositionStatus": true
            }

            this.getOwnerComponent().getModel().create("/CancelStatusSet", payloadDispoCancelData, {
                success: function (odata, Response) {
                    sap.ui.core.BusyIndicator.hide();
                    if (Response.headers["sap-message"] && JSON.parse(Response.headers["sap-message"]).severity === "success") {
                        var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                        MessageBox.success(oMsg, {
                            onClose: function () {
                            }.bind(this)
                        });
                        this.bindDispositionDetails(odata.DiscrepancyNo);
                        this.bindBuyOffTable();
                        // var oDiscNo = this.getView().byId("idDispCobDscNo").getValue();
                        // this.getView().byId("headertext").setText("Discrepancy/Disposition No: " + odata.DiscrepancyNo + "/");
                        // this.getView().byId("idObjNCStatusDispo").setText();
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onOpenVHDispositionType: function (oEvent) {
            this._oDispoTypeDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DispositionType", this);
            this.getView().addDependent(this._oDispoTypeDialog);
            this._oDispoTypeDialog.open();
            this.oDispoTypeInp = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DISPOTYPE"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oDispoTypeDialog.setModel(oModel, "DispositionTypeModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configDispTypeVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oDispoTypeInp;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oDispoTypeDialog.destroy();
        },

        onSearchDispositionType: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onOpenVHDispositionCode: function (oEvent) {
            this._oDispoCodeDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DispositionCode", this);
            this.getView().addDependent(this._oDispoCodeDialog);
            this._oDispoCodeDialog.open();
            this.oDispoCodeInp = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DISPOCODE"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oDispoCodeDialog.setModel(oModel, "DispositionCodeModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configDispoCodeVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oDispoCodeInp;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oDispoCodeDialog.destroy();
        },

        onSearchDispositionCode: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        onOpenVHDispoPartReq: function (oEvent) {
            this._oDispoPartReqDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DispositionPartReq", this);
            this.getView().addDependent(this._oDispoPartReqDialog);
            this._oDispoPartReqDialog.open();
            this.oDispoPartReqInp = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "DISPOPRTREQ"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oDispoPartReqDialog.setModel(oModel, "DispositionPartReqModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configDispoPartReqVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oDispoPartReqInp;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oDispoCodeDialog.destroy();
        },

        onSearchDispoPartReq: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },

        handleDispIncompFlagCheck: function () {
            if (this.getView().byId("idDispoGenInfoIncompFlag").getSelected() === false) {
                this._oQualityWkGrpDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DispositionWorkGroupQuality", this);
                this.getView().addDependent(this._oQualityWkGrpDialog);
                this._oQualityWkGrpDialog.open();
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var oFilter = [];
                oFilter.push(new Filter("Key", FilterOperator.EQ, "DISPOWRKF4"));
                var sPath = "/f4_genericSet";
                oDataModel.read(sPath, {
                    filters: oFilter,
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var data = oData.results;
                        oModel.setData(data);
                        this._oQualityWkGrpDialog.setModel(oModel, "WorkGroupQual")
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            } else if ((this.getView().byId("idDispoGenInfoIncompFlag").getSelected() === true) && (this.getView().byId("idTableDisposition").getSelectedItem())) {
                if (this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionStatus") == "Open") {
                    this.getView().byId("idDispoGenInfoIncompFlag").setSelected(false);
                    var oDispIncompMsg = this.getView().getModel("i18n").getProperty("DispoIncompMsg");
                    MessageBox.warning(oDispIncompMsg);
                } else {
                    this.getView().byId("idDispoGenInfoIncompFlag").setSelected(true);
                }
            }
        },

        onSearchQualityWorkGroup: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            // add filter for search
            var aFilter = [], oFilter = [];
            if (sQuery && sQuery.length > 0) {
                oFilter.push(new Filter("Value", FilterOperator.Contains, sQuery));
                oFilter.push(new Filter("Value1", FilterOperator.Contains, sQuery));
                oFilter.push(new Filter("Description", FilterOperator.Contains, sQuery));
                oFilter.push(new Filter("KeyValue", FilterOperator.Contains, sQuery));
                aFilter.push(new Filter(oFilter, false));
            }
            // update list binding
            var oWrkGrpTable = this._oQualityWkGrpDialog.getContent()[1];
            var oBinding = oWrkGrpTable.getBinding("items");
            oBinding.filter(aFilter);
        },

        onQualWorkGrpItemSel: function (oEvent) {
            this.oSelectedQualWrkGrp = oEvent.getParameters().listItem.getBindingContext("WorkGroupQual").getProperty("Value");
            this._oQualityWkGrpDialog.close();
            if (this.oSelectedQualWrkGrp) {
                this.oQualityWrkGrp = this.oSelectedQualWrkGrp;
            } else {
                this.oQualityWrkGrp = "";
            }
        },

        onCloseWrkGrpQuality: function () {
            this.getView().byId("idDispoGenInfoIncompFlag").setSelected(true);
            this._oQualityWkGrpDialog.close();
            this._oQualityWkGrpDialog.destroy();
        },

        dispoIsUserMRBCertifiedCheck: function () {
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oWrkGrp = this.getView().byId("idworkgroup").getText();
            var sPath = "/IsUserMRBCertifiedSet(Bname='',Workgroup='" + oWrkGrp + "')";
            oDataModel.read(sPath, {
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    // oData.MRBCertified = true;
                    this.oSelectedDispoWrkGrp = "";
                    this.oMRBCertifiedUser = "";
                    this.oMRBActionYes = "";
                    this.oMRBActionNo = "";
                    if (oData.MRBCertified === false) {
                        this.dispoInitialiseWorkGroupDialog();
                        this.oMRBCertifiedUser = false;
                    }
                    else if (oData.MRBCertified === true) {
                        this.oMRBCertifiedUser = true;
                        var oDsipoMrbCertMsg = this.getView().getModel("i18n").getProperty("MRBCertMsg");
                        MessageBox.show(
                            oDsipoMrbCertMsg, {
                            icon: MessageBox.Icon.INFORMATION,
                            title: "MRB certified User",
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            onClose: function (oAction) {
                                if (oAction === "YES") {
                                    this.oMRBActionYes = true;
                                    this.oMRBActionNo = false;
                                    this.dispoInitialiseWorkGroupDialog();
                                } else {
                                    this.oMRBActionYes = false;
                                    this.oMRBActionNo = true;
                                    this.createDisposition();
                                }
                            }.bind(this)
                        }
                        );
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        dispoInitialiseWorkGroupDialog: function () {
            this._oDispoWrkOrdDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DispositionWorkGroupMRB", this);
            this.getView().addDependent(this._oDispoWrkOrdDialog);
            this._oDispoWrkOrdDialog.open();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "BUYWRKGRP"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oDispoWrkOrdDialog.setModel(oModel, "DispoWorkGroupModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onDispoWorkGrpItemSel: function (oEvent) {
            this.oSelectedDispoWrkGrp = oEvent.getParameters().listItem.getBindingContext("DispoWorkGroupModel").getProperty("Value");
            this._oDispoWrkOrdDialog.close();
            this.createDisposition();
        },

        onSearchDispoMRBWorkGroup: function (oEvent) {
            var sQuery = oEvent.getSource().getValue();
            // add filter for search
            var aFilter = [], oFilter = [];
            if (sQuery && sQuery.length > 0) {
                oFilter.push(new Filter("Value", FilterOperator.Contains, sQuery));
                oFilter.push(new Filter("Value1", FilterOperator.Contains, sQuery));
                oFilter.push(new Filter("Description", FilterOperator.Contains, sQuery));
                aFilter.push(new Filter(oFilter, false));
            }
            // update list binding
            var oWrkGrpTable = this._oDispoWrkOrdDialog.getContent()[1];
            var oBinding = oWrkGrpTable.getBinding("items");
            oBinding.filter(aFilter);
        },

        onCloseDispoWrkGrpMRB: function () {
            this._oDispoWrkOrdDialog.close();
            this._oDispoWrkOrdDialog.destroy();
            this.createDisposition();
        },

        createDisposition: function () {
            var oModel = this.getOwnerComponent().getModel();
            var oNotifNo = sObjectId;
            var oDiscrepancyNo = this.getView().byId("idDispCobDscNo").getValue();
            var oDispositionReworkOrd = this._oMultiInputDispoRewrkOrd;
            var oDispositionSerialNo = this._oMultiInputDispoSN;
            var oDispositionCSN = this.getView().byId("dispGenCSN").getState();
            var oDispoMajMinNC = this.getView().byId("dispGenMajorMinorNC").getValue();
            var oDispositionRestrictPart = this.getView().byId("dispGenRestrictPart").getSelected();
            var oDispositionIntCharge = this.getView().byId("dispGenInterCharge").getSelected();
            var oDispositionDropPoint = this.getView().byId("dispGenDropPoint").getValue();
            var oDispositionPartner = this.getView().byId("dispGenPartSuppName").getValue();
            var oDispositionPartnerName = this.getView().byId("dispGenPartSuppDesc").getValue();
            var oDispositionIncompleteChk = this.getView().byId("idDispoGenInfoIncompFlag").getSelected();
            var oDispositionText = this.getView().byId("idDispoTextArea").getValue();
            var oDefaultWrkGroup = this.getView().byId("idworkgroup").getText();

            if (oDiscrepancyNo) {
                if (this.getView().byId("idTableDisposition").getModel("DispositionDetails").getData().length === 0) {
                    if (this.getView().byId("idTableDisposition").getModel("DispositionDetails").getData().length === 0) {
                        var oDispoAddLineItemMsg = this.getView().getModel("i18n").getProperty("DispoAddLineItemMsg");
                        MessageBox.warning(oDispoAddLineItemMsg);
                        return;
                    } else {
                        sap.ui.core.BusyIndicator.show();
                        var oDispoTabData = this.getView().byId("idTableDisposition").getModel("DispositionDetails").getData();
                        var payloadDispoData = {
                            "NotificationNo": oNotifNo,
                            "DiscrepancyNo": oDiscrepancyNo,
                            "ParentDispoNo": "",
                            "ChildDispoNo": "",
                            "DispositionParentflag": true,
                            "DispositionChildflag": false,
                            "DispositionBadge": oDispoTabData[0].DispositionBadge,
                            "DispositionCode": oDispoTabData[0].DispositionCode,
                            // "DispositionDateinWorking": oDispoTabData[0].DispositionDateinWorking,
                            "DispositionGroup": oDefaultWrkGroup,
                            "DispositionMRBGroup": (this.oSelectedDispoWrkGrp === "" || this.oSelectedDispoWrkGrp == undefined) ? "" : this.oSelectedDispoWrkGrp,
                            "DispositionPartReq": oDispoTabData[0].DispositionPartReq,
                            "DispositionQnty": oDispoTabData[0].DispositionQnty,
                            "DispositionStatus": oDispoTabData[0].DispositionStatus,
                            "DispostionType": oDispoTabData[0].DispostionType,
                            "IsMRB": (this.oMRBCertifiedUser === "" || this.oMRBCertifiedUser == undefined || this.oMRBCertifiedUser == false) ? false : true,
                            "IsMRBYes": (this.oMRBActionYes === "" || this.oMRBActionYes == undefined || this.oMRBActionYes == false) ? false : true,
                            "IsMRBNo": (this.oMRBActionNo === "" || this.oMRBActionNo == undefined || this.oMRBActionNo == false) ? false : true,
                            "DispositionDropPoint": oDispositionDropPoint,
                            "DispositionIntCharge": oDispositionIntCharge,
                            "Incomplete": oDispositionIncompleteChk,
                            "DispositionCSN": oDispositionCSN,
                            "DispositionMajorMinor": oDispoMajMinNC,
                            "DispositionPartner": oDispositionPartner,
                            "DispositionPartnerName": oDispositionPartnerName,
                            "DispositionRestrictPart": oDispositionRestrictPart,
                            "to_disposerial": [],
                            "to_disporework": [],
                            "to_dispobuyoff": [],
                            "DispositionText": oDispositionText,
                            "DispositionGroupQuality": (this.oQualityWrkGrp === "" || this.oQualityWrkGrp == undefined) ? "" : this.oQualityWrkGrp, // oDispositionIncompleteChk === true ? "" : this.oQualityWrkGrp,
                            "Create": true
                        }

                        if (oDispositionSerialNo.getTokens().length === 1) {
                            payloadDispoData["to_disposerial"] = [];
                            var oSerialNo = oDispositionSerialNo.getTokens()[0].getKey();
                            payloadDispoData["to_disposerial"].push({
                                "SerialNo": oSerialNo
                            });
                        } else if (oDispositionSerialNo.getTokens().length > 1) {
                            payloadDispoData["to_disposerial"] = [];
                            for (var i = 0; i < oDispositionSerialNo.getTokens().length; i++) {
                                var oSerialNo = oDispositionSerialNo.getTokens()[i].getKey();
                                payloadDispoData["to_disposerial"].push({
                                    "SerialNo": oSerialNo
                                });
                            }
                        }

                        if (oDispositionReworkOrd.getTokens().length === 1) {
                            payloadDispoData["to_disporework"] = [];
                            var oOrderNo = oDispositionReworkOrd.getTokens()[0].getKey();
                            payloadDispoData["to_disporework"].push({
                                "Order": oOrderNo
                            });
                        } else if (oDispositionReworkOrd.getTokens().length > 1) {
                            payloadDispoData["to_disporework"] = [];
                            for (var j = 0; j < oDispositionReworkOrd.getTokens().length; j++) {
                                var oOrderNo = oDispositionReworkOrd.getTokens()[j].getKey();
                                payloadDispoData["to_disporework"].push({
                                    "Order": oOrderNo
                                });
                            }
                        }

                        if (this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel")) {
                            var oBuyOffTableData = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData();
                            if (oBuyOffTableData.length === 1) {
                                payloadDispoData["to_dispobuyoff"] = [];
                                var oDispositionGroup = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].DispositionGroup;
                                var oWorkCenter = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].WorkCenter;
                                var oBuyOffStatusText = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffStatusText;
                                var oBuyOffSequence = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].DispositionSequence;
                                var oBuyOffStatusKey = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffStatusKey === "" ? this.getView().byId("idTableDispoBuyOff").getItems()[0].getCells()[4].getTooltip() : this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffStatusKey;
                                var oBuyOffComment = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffComment;
                                payloadDispoData["to_dispobuyoff"].push({
                                    "DispositionGroup": oDispositionGroup,
                                    "WorkCenter": oWorkCenter,
                                    "BuyOffStatusText": oBuyOffStatusText,
                                    "DispositionSequence": oBuyOffSequence,
                                    "BuyOffStatusKey": oBuyOffStatusKey,
                                    "BuyOffComment": oBuyOffComment
                                });
                            } else if (oBuyOffTableData.length > 1) {
                                payloadDispoData["to_dispobuyoff"] = [];
                                for (var k = 0; k < oBuyOffTableData.length; k++) {
                                    var oDispositionGroup = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].DispositionGroup;
                                    var oWorkCenter = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].WorkCenter;
                                    var oBuyOffStatusText = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffStatusText;
                                    var oBuyOffSequence = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].DispositionSequence;
                                    var oBuyOffStatusKey = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffStatusKey === "" ? this.getView().byId("idTableDispoBuyOff").getItems()[k].getCells()[4].getTooltip() : this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffStatusKey;
                                    var oBuyOffComment = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffComment;
                                    payloadDispoData["to_dispobuyoff"].push({
                                        "DispositionGroup": oDispositionGroup,
                                        "WorkCenter": oWorkCenter,
                                        "BuyOffStatusText": oBuyOffStatusText,
                                        "DispositionSequence": oBuyOffSequence,
                                        "BuyOffStatusKey": oBuyOffStatusKey,
                                        "BuyOffComment": oBuyOffComment
                                    });
                                }
                            }
                        }

                    }
                } else if (this.getView().byId("idTableDisposition").getModel("DispositionDetails").getData().length > 0) {
                    sap.ui.core.BusyIndicator.show();
                    var oDispoTabData = this.getView().byId("idTableDisposition").getModel("DispositionDetails").getData();
                    var oIndex = oDispoTabData.length - 1;
                    if (this.getView().byId("idTableDisposition").getSelectedItem()) {
                        if (oDispoTabData[oIndex].ParentDispoNo === "") {
                            this.getView().byId("idTableDisposition").removeItem(this.getView().byId("idTableDisposition").getItems()[oIndex]);
                        }
                        var oParentDispoNo = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("ParentDispoNo");
                        var oDispositionBadge = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionBadge");
                        var oDispositionGroup = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionGroup");
                        var oDispositionCode = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionCode");
                        var oDispositionPartReq = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionPartReq");
                        var oDispositionQty = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionQnty");
                        var oDispositionStatus = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionStatus");
                        var oDispositionType = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispostionType");
                        var payloadDispoData = {
                            "NotificationNo": oNotifNo,
                            "DiscrepancyNo": oDiscrepancyNo,
                            "ParentDispoNo": oParentDispoNo,
                            "DispositionBadge": oDispositionBadge,
                            "DispositionCode": oDispositionCode,
                            // "DispositionDateinWorking": oDispoTabData[0].DispositionDateinWorking,
                            "DispositionGroup": oDefaultWrkGroup,
                            "DispositionMRBGroup": (this.oSelectedDispoWrkGrp === "" || this.oSelectedDispoWrkGrp == undefined) ? "" : this.oSelectedDispoWrkGrp,
                            "DispositionPartReq": oDispositionPartReq,
                            "DispositionQnty": oDispositionQty,
                            "DispositionStatus": oDispositionStatus,
                            "DispostionType": oDispositionType,
                            "IsMRB": (this.oMRBCertifiedUser === "" || this.oMRBCertifiedUser == undefined || this.oMRBCertifiedUser == false) ? false : true,
                            "IsMRBYes": (this.oMRBActionYes === "" || this.oMRBActionYes == undefined || this.oMRBActionYes == false) ? false : true,
                            "IsMRBNo": (this.oMRBActionNo === "" || this.oMRBActionNo == undefined || this.oMRBActionNo == false) ? false : true,
                            "DispositionDropPoint": oDispositionDropPoint,
                            "DispositionIntCharge": oDispositionIntCharge,
                            "Incomplete": oDispositionIncompleteChk,
                            "DispositionCSN": oDispositionCSN,
                            "DispositionMajorMinor": oDispoMajMinNC,
                            "DispositionPartner": oDispositionPartner,
                            "DispositionPartnerName": oDispositionPartnerName,
                            "DispositionRestrictPart": oDispositionRestrictPart,
                            "to_disposerial": [],
                            "to_disporework": [],
                            "to_dispobuyoff": [],
                            "DispositionText": oDispositionText,
                            "DispositionGroupQuality": (this.oQualityWrkGrp === "" || this.oQualityWrkGrp == undefined) ? "" : this.oQualityWrkGrp,
                            "Update": true
                        }

                        if (oDispositionSerialNo.getTokens().length === 1) {
                            payloadDispoData["to_disposerial"] = [];
                            var oSerialNo = oDispositionSerialNo.getTokens()[0].getKey();
                            payloadDispoData["to_disposerial"].push({
                                "SerialNo": oSerialNo
                            });
                        } else if (oDispositionSerialNo.getTokens().length > 1) {
                            payloadDispoData["to_disposerial"] = [];
                            for (var i = 0; i < oDispositionSerialNo.getTokens().length; i++) {
                                var oSerialNo = oDispositionSerialNo.getTokens()[i].getKey();
                                payloadDispoData["to_disposerial"].push({
                                    "SerialNo": oSerialNo
                                });
                            }
                        }

                        if (oDispositionReworkOrd.getTokens().length === 1) {
                            payloadDispoData["to_disporework"] = [];
                            var oOrderNo = oDispositionReworkOrd.getTokens()[0].getKey();
                            payloadDispoData["to_disporework"].push({
                                "Order": oOrderNo
                            });
                        } else if (oDispositionReworkOrd.getTokens().length > 1) {
                            payloadDispoData["to_disporework"] = [];
                            for (var j = 0; j < oDispositionReworkOrd.getTokens().length; j++) {
                                var oOrderNo = oDispositionReworkOrd.getTokens()[j].getKey();
                                payloadDispoData["to_disporework"].push({
                                    "Order": oOrderNo
                                });
                            }
                        }

                        if (this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel")) {
                            var oBuyOffTableData = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData();
                            if (oBuyOffTableData.length === 1) {
                                payloadDispoData["to_dispobuyoff"] = [];
                                var oDispositionGroup = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].DispositionGroup;
                                var oWorkCenter = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].WorkCenter;
                                var oBuyOffStatusText = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffStatusText;
                                var oBuyOffSequence = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].DispositionSequence;
                                var oBuyOffStatusKey = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffStatusKey === "" ? this.getView().byId("idTableDispoBuyOff").getItems()[0].getCells()[4].getTooltip() : this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffStatusKey;
                                var oBuyOffComment = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffComment;
                                payloadDispoData["to_dispobuyoff"].push({
                                    "DispositionGroup": oDispositionGroup,
                                    "WorkCenter": oWorkCenter,
                                    "BuyOffStatusText": oBuyOffStatusText,
                                    "DispositionSequence": oBuyOffSequence,
                                    "BuyOffStatusKey": oBuyOffStatusKey,
                                    "BuyOffComment": oBuyOffComment
                                });
                            } else if (oBuyOffTableData.length > 1) {
                                payloadDispoData["to_dispobuyoff"] = [];
                                for (var k = 0; k < oBuyOffTableData.length; k++) {
                                    var oDispositionGroup = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].DispositionGroup;
                                    var oWorkCenter = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].WorkCenter;
                                    var oBuyOffStatusText = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffStatusText;
                                    var oBuyOffSequence = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].DispositionSequence;
                                    var oBuyOffStatusKey = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffStatusKey === "" ? this.getView().byId("idTableDispoBuyOff").getItems()[k].getCells()[4].getTooltip() : this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffStatusKey;
                                    var oBuyOffComment = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffComment;
                                    payloadDispoData["to_dispobuyoff"].push({
                                        "DispositionGroup": oDispositionGroup,
                                        "WorkCenter": oWorkCenter,
                                        "BuyOffStatusText": oBuyOffStatusText,
                                        "DispositionSequence": oBuyOffSequence,
                                        "BuyOffStatusKey": oBuyOffStatusKey,
                                        "BuyOffComment": oBuyOffComment
                                    });
                                }
                            }
                        }

                    } else if (oDispoTabData[oIndex].ParentDispoNo === "") {
                        var payloadDispoData = {
                            "NotificationNo": oNotifNo,
                            "DiscrepancyNo": oDiscrepancyNo,
                            "ParentDispoNo": this.oParentDispoModel.getData().ParentDispoNo === "" ? "" : this.oParentDispoModel.getData().ParentDispoNo,
                            "ChildDispoNo": "",
                            "DispositionParentflag": this.oParentDispoModel.getData().ParentDispoNo === "" ? true : false,
                            "DispositionChildflag": this.oParentDispoModel.getData().ParentDispoNo === "" ? false : true,
                            "DispositionBadge": oDispoTabData[oIndex].DispositionBadge,
                            "DispositionCode": oDispoTabData[oIndex].DispositionCode,
                            // "DispositionDateinWorking": oDispoTabData[0].DispositionDateinWorking,
                            "DispositionGroup": oDefaultWrkGroup,
                            "DispositionMRBGroup": (this.oSelectedDispoWrkGrp === "" || this.oSelectedDispoWrkGrp == undefined) ? "" : this.oSelectedDispoWrkGrp,
                            "DispositionPartReq": oDispoTabData[oIndex].DispositionPartReq,
                            "DispositionQnty": oDispoTabData[oIndex].DispositionQnty,
                            "DispositionStatus": oDispoTabData[oIndex].DispositionStatus,
                            "DispostionType": oDispoTabData[oIndex].DispostionType,
                            "IsMRB": (this.oMRBCertifiedUser === "" || this.oMRBCertifiedUser == undefined || this.oMRBCertifiedUser == false) ? false : true,
                            "IsMRBYes": (this.oMRBActionYes === "" || this.oMRBActionYes == undefined || this.oMRBActionYes == false) ? false : true,
                            "IsMRBNo": (this.oMRBActionNo === "" || this.oMRBActionNo == undefined || this.oMRBActionNo == false) ? false : true,
                            "DispositionDropPoint": oDispositionDropPoint,
                            "DispositionIntCharge": oDispositionIntCharge,
                            "Incomplete": oDispositionIncompleteChk,
                            "DispositionCSN": oDispositionCSN,
                            "DispositionMajorMinor": oDispoMajMinNC,
                            "DispositionPartner": oDispositionPartner,
                            "DispositionPartnerName": oDispositionPartnerName,
                            "DispositionRestrictPart": oDispositionRestrictPart,
                            "to_disposerial": [],
                            "to_disporework": [],
                            "to_dispobuyoff": [],
                            "DispositionText": oDispositionText,
                            "DispositionGroupQuality": (this.oQualityWrkGrp === "" || this.oQualityWrkGrp == undefined) ? "" : this.oQualityWrkGrp,
                            "Create": true
                        }

                        if (oDispositionSerialNo.getTokens().length === 1) {
                            payloadDispoData["to_disposerial"] = [];
                            var oSerialNo = oDispositionSerialNo.getTokens()[0].getKey();
                            payloadDispoData["to_disposerial"].push({
                                "SerialNo": oSerialNo
                            });
                        } else if (oDispositionSerialNo.getTokens().length > 1) {
                            payloadDispoData["to_disposerial"] = [];
                            for (var i = 0; i < oDispositionSerialNo.getTokens().length; i++) {
                                var oSerialNo = oDispositionSerialNo.getTokens()[i].getKey();
                                payloadDispoData["to_disposerial"].push({
                                    "SerialNo": oSerialNo
                                });
                            }
                        }

                        if (oDispositionReworkOrd.getTokens().length === 1) {
                            payloadDispoData["to_disporework"] = [];
                            var oOrderNo = oDispositionReworkOrd.getTokens()[0].getKey();
                            payloadDispoData["to_disporework"].push({
                                "Order": oOrderNo
                            });
                        } else if (oDispositionReworkOrd.getTokens().length > 1) {
                            payloadDispoData["to_disporework"] = [];
                            for (var j = 0; j < oDispositionReworkOrd.getTokens().length; j++) {
                                var oOrderNo = oDispositionReworkOrd.getTokens()[j].getKey();
                                payloadDispoData["to_disporework"].push({
                                    "Order": oOrderNo
                                });
                            }
                        }

                        if (this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel")) {
                            var oBuyOffTableData = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData();
                            if (oBuyOffTableData.length === 1) {
                                payloadDispoData["to_dispobuyoff"] = [];
                                var oDispositionGroup = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].DispositionGroup;
                                var oWorkCenter = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].WorkCenter;
                                var oBuyOffStatusText = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffStatusText;
                                var oBuyOffSequence = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].DispositionSequence;
                                var oBuyOffStatusKey = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffStatusKey === "" ? this.getView().byId("idTableDispoBuyOff").getItems()[0].getCells()[4].getTooltip() : this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffStatusKey;
                                var oBuyOffComment = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[0].BuyOffComment;
                                payloadDispoData["to_dispobuyoff"].push({
                                    "DispositionGroup": oDispositionGroup,
                                    "WorkCenter": oWorkCenter,
                                    "BuyOffStatusText": oBuyOffStatusText,
                                    "DispositionSequence": oBuyOffSequence,
                                    "BuyOffStatusKey": oBuyOffStatusKey,
                                    "BuyOffComment": oBuyOffComment
                                });
                            } else if (oBuyOffTableData.length > 1) {
                                payloadDispoData["to_dispobuyoff"] = [];
                                for (var k = 0; k < oBuyOffTableData.length; k++) {
                                    var oDispositionGroup = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].DispositionGroup;
                                    var oWorkCenter = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].WorkCenter;
                                    var oBuyOffStatusText = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffStatusText;
                                    var oBuyOffSequence = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].DispositionSequence;
                                    var oBuyOffStatusKey = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffStatusKey === "" ? this.getView().byId("idTableDispoBuyOff").getItems()[k].getCells()[4].getTooltip() : this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffStatusKey;
                                    var oBuyOffComment = this.getView().byId("idTableDispoBuyOff").getModel("DispositionBuyOffModel").getData()[k].BuyOffComment;
                                    payloadDispoData["to_dispobuyoff"].push({
                                        "DispositionGroup": oDispositionGroup,
                                        "WorkCenter": oWorkCenter,
                                        "BuyOffStatusText": oBuyOffStatusText,
                                        "DispositionSequence": oBuyOffSequence,
                                        "BuyOffStatusKey": oBuyOffStatusKey,
                                        "BuyOffComment": oBuyOffComment
                                    });
                                }
                            }
                        }


                    } else {
                        var oDispoLineItemMsg = this.getView().getModel("i18n").getProperty("DispoAddLineItemMsg");
                        MessageBox.warning(oDispoLineItemMsg);
                        sap.ui.core.BusyIndicator.hide();
                        return;
                    }
                }
                oModel.create("/NotificationDispositionSet", payloadDispoData, {
                    success: function (odata, Response) {
                        sap.ui.core.BusyIndicator.hide();
                        if (Response.headers["sap-message"]) {
                            var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                            MessageBox.success(oMsg, {
                                onClose: function () {
                                    this.bindDispositionDetails();
                                    this.bindBuyOffTable();
                                    this.resetDispositionGenInfoFields();
                                    this.resetInitialisedFields();
                                }.bind(this)
                            });
                        }
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }.bind(this)
                });
            } else {
                var oSelDiscToCrtDispo = this.getView().getModel("i18n").getProperty("SelDiscToCrtDispoMsg");
                MessageBox.warning(oSelDiscToCrtDispo);
            }
        },

        handleAddSubDisposition: function () {
            if (this.getView().byId("idTableDisposition").getSelectedItem()) {
                var oDispoNotification = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("NotificationNo");
                var oDispoDiscrepancy = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DiscrepancyNo");
                var oParentDispoNo = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("ParentDispoNo");
                sap.ui.core.BusyIndicator.show();
                var oDataModel = this.getOwnerComponent().getModel();
                var sPath = "/GetDispositionQuantityCheckSet(NotificationNo='" + oDispoNotification + "',DiscrepancyNo='" + oDispoDiscrepancy + "',ParentDispoNo='" + oParentDispoNo + "')";
                oDataModel.read(sPath, {
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        var oQntyChk = oData.QuantityCheck;
                        if (oQntyChk === false) {
                            var oQtyChkMsg = this.getView().getModel("i18n").getProperty("QtyChkMsg");
                            MessageBox.warning(oQtyChkMsg);
                            this.getView().byId("idTableDisposition").removeSelections();
                        } else {
                            var oParentDispoNo = oData.ParentDispoNo;
                            var oParData = {
                                ParentDispoNo: oParentDispoNo
                            };
                            this.oParentDispoModel.setData(oParData);
                            this.onAddDispositionLineItem();
                            this.getView().byId("idBtnDispositionRTV").setEnabled(false);
                            this.getView().byId("idBtnDispositionCopy").setEnabled(false);
                            this.getView().byId("idBtnDispositionDlt").setEnabled(false);
                            this.getView().byId("idBtnMRBDisp").setEnabled(false);
                            this.getView().byId("idBtnBuyOffAdd").setEnabled(false);
                            this.getView().byId("idDispoGenInfoIncompFlag").setEnabled(false);
                        }
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            } else {
                var oSelLineItemMsg = this.getView().getModel("i18n").getProperty("SelLineItemMsg");
                MessageBox.warning(oSelLineItemMsg);
            }
        },

        resetDispositionGenInfoFields: function () {
            this.getView().byId("dispGenInterCharge").setSelected(false);
            this.getView().byId("idDispoGenInfoIncompFlag").setSelected(true);
            this.getView().byId("dispGenDropPoint").setValue();
            this.getView().byId("dispGenRestrictPart").setSelected(false);
            this.getView().byId("dispGenCSN").setState(false);
            // this.getView().byId("dispGenPartSuppName").setValue();
            // this.getView().byId("dispGenPartSuppDesc").setValue();
            this.getView().byId("dispGenMajorMinorNC").setSelectedKey("DISPIMPACT");
            this.getView().byId("dispGenMajorMinorNC").setValue("MINOR");
            this.getView().byId("idObjNCStatusDispo").setText();
            this._oMultiInputDispoSN.removeAllTokens();
            this._oMultiInputDispoRewrkOrd.removeAllTokens();
            this.getView().byId("idDispoTextArea").setValue();
        },

        resetInitialisedFields: function () {
            var oParData = { ParentDispoNo: "" };
            this.oParentDispoModel.setData(oParData);
            this.oSelectedDispoWrkGrp = "";
            this.oSelectedWrkGrp = "";
            this.oMRBCertifiedUser = "";
            this.oMRBActionYes = "";
            this.oMRBActionNo = "";
            this.oQualityWrkGrp = "";
        },

        onDispoLineItemSelection: function (oEvent) {
            var oDispoNotification = oEvent.getParameters().listItem.getBindingContext("DispositionDetails").getProperty("NotificationNo");
            var oDispoDiscrepancy = oEvent.getParameters().listItem.getBindingContext("DispositionDetails").getProperty("DiscrepancyNo");
            var oParentDispoNo = oEvent.getParameters().listItem.getBindingContext("DispositionDetails").getProperty("ParentDispoNo");
            var oDispositionCode = oEvent.getParameters().listItem.getBindingContext("DispositionDetails").getProperty("DispositionCode");
            var oDispositionStatus = oEvent.getParameters().listItem.getBindingContext("DispositionDetails").getProperty("DispositionStatus");
            var oWorkGroupKey = this.getView().byId("idworkgroup").getText();
            if (oParentDispoNo) {
                this.getView().byId("headertext").setText("Discrepancy/Disposition No: " + oDispoDiscrepancy + "/" + oParentDispoNo);
                this.getView().byId("idBtnDispositionCopy").setEnabled(true);
                this.getView().byId("idBtnDispositionDlt").setEnabled(true);
                this.getView().byId("idBtnMRBDisp").setEnabled(true);
                this.getView().byId("idBtnBuyOffAdd").setEnabled(true);
                this.getView().byId("idDispoGenInfoIncompFlag").setEnabled(true);
                if (oDispositionCode == "RTV") {
                    this.getView().byId("idBtnDispositionRTV").setEnabled(true);
                } else {
                    this.getView().byId("idBtnDispositionRTV").setEnabled(false);
                }
                if (oDispositionStatus == "Cancelled") {
                    this.getView().byId("idBtnDispositionDlt").setEnabled(false);
                } else {
                    this.getView().byId("idBtnDispositionDlt").setEnabled(true);
                }
                sap.ui.core.BusyIndicator.show();
                var oModel = new JSONModel();
                oModel.setSizeLimit(10000);
                var oDataModel = this.getOwnerComponent().getModel();
                var sPath = "/NotificationDispositionSet(NotificationNo='" + oDispoNotification + "',DiscrepancyNo='" + oDispoDiscrepancy + "',ParentDispoNo='" + oParentDispoNo + "',WorkGroupKey='" + oWorkGroupKey + "')";
                oDataModel.read(sPath, {
                    urlParameters: {
                        "$expand": "to_disposerial,to_disporework"
                    },
                    success: function (oData, oResult) {
                        sap.ui.core.BusyIndicator.hide();
                        this._oMultiInputDispoSN.removeAllTokens();
                        this._oMultiInputDispoRewrkOrd.removeAllTokens();
                        var oSerialData = oData.to_disposerial.results,
                            oDispoStatus = oData.DispositionStatus,
                            oReworkOrdData = oData.to_disporework.results,
                            oDispositionIntCharge = oData.DispositionIntCharge,
                            oDispositionIncompChk = oData.Incomplete,
                            oDispositionDropPoint = oData.DispositionDropPoint,
                            oDispositionRestrictPart = oData.DispositionRestrictPart,
                            oDispositionCSN = oData.DispositionCSN,
                            oDispositionPartner = oData.DispositionPartner,
                            oDispositionPartnerName = oData.DispositionPartnerName,
                            oDispositionMajorMinor = oData.DispositionMajorMinor,
                            oDispositionText = oData.DispositionText,
                            oDispositionROProp = oData.DispoChangeFields;

                        this.getView().byId("idObjNCStatusDispo").setText(oDispoStatus);
                        if (oSerialData.length > 0) {
                            for (var i = 0; i < oSerialData.length; i++) {
                                var oSerialNosToken = oSerialData[i].SerialNo;
                                var oSernrToken = new sap.m.Token({
                                    key: oSerialNosToken,
                                    text: oSerialNosToken
                                });
                                this._oMultiInputDispoSN.addToken(oSernrToken);
                            }
                        }
                        if (oReworkOrdData.length > 0) {
                            for (var j = 0; j < oReworkOrdData.length; j++) {
                                var oOrderNosToken = oReworkOrdData[j].Order;
                                var oOrderToken = new sap.m.Token({
                                    key: oOrderNosToken,
                                    text: oOrderNosToken
                                });
                                this._oMultiInputDispoRewrkOrd.addToken(oOrderToken);
                            }
                        }
                        this.getView().byId("dispGenInterCharge").setSelected(oDispositionIntCharge);
                        this.getView().byId("idDispoGenInfoIncompFlag").setSelected(oDispositionIncompChk);
                        this.getView().byId("dispGenDropPoint").setValue(oDispositionDropPoint);
                        this.getView().byId("dispGenRestrictPart").setSelected(oDispositionRestrictPart);
                        this.getView().byId("dispGenCSN").setState(oDispositionCSN);
                        this.getView().byId("dispGenPartSuppName").setValue(oDispositionPartner);
                        this.getView().byId("dispGenPartSuppDesc").setValue(oDispositionPartnerName);
                        this.getView().byId("dispGenMajorMinorNC").setSelectedKey("DISPIMPACT");
                        this.getView().byId("dispGenMajorMinorNC").setValue(oDispositionMajorMinor);
                        this.oMajorMinorNC = oDispositionMajorMinor;
                        this.getView().byId("idDispoTextArea").setValue(oDispositionText);
                        this.bindBuyOffTable(oData.NotificationNo, oData.DiscrepancyNo, oData.ParentDispoNo);

                        if (this.workingQueueMode == "EDIT") {
                            var dispoODataArray = [];
                            var oROModel;
                            if (oDispositionROProp != "") {
                                dispoODataArray = oDispositionROProp.split(',');
                                oROModel = Utils.getReadonlyPropField(dispoODataArray, "Dispo");
                            } else {
                                oROModel = Utils.getReadonlyPropField(dispoODataArray, "Dispo");
                            }
                            this.bindRODispoProps(oROModel);
                        }
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            } else {
                var oLineItemSelMsg = this.getView().getModel("i18n").getProperty("SelDispoLineItemMsg");
                MessageBox.warning(oLineItemSelMsg);
                this.getView().byId("idTableDisposition").removeSelections(true);
                this.getView().byId("idBtnDispositionCopy").setEnabled(false);
                this.getView().byId("idBtnDispositionDlt").setEnabled(false);
                this.getView().byId("idBtnMRBDisp").setEnabled(false);
                this.getView().byId("idBtnBuyOffAdd").setEnabled(false);
                this.getView().byId("idDispoGenInfoIncompFlag").setEnabled(false);
                this.resetDispositionGenInfoFields();
            }
        },

        bindBuyOffTable: function (sNotif, sDiscre, sParDispo) {
            sap.ui.core.BusyIndicator.show();
            if (sNotif == undefined || sNotif == null) {
                sNotif = "";
            }
            if (sDiscre == undefined || sDiscre == null) {
                sDiscre = "";
            }
            if (sParDispo == undefined || sParDispo == null) {
                sParDispo = "";
            }
            var oDispoNotification = sNotif,
                oDispoDiscrepancy = sDiscre,
                oParentDispoNo = sParDispo,
                oWorkGroupKey = this.getView().byId("idworkgroup").getText();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/NotificationDispositionSet(NotificationNo='" + oDispoNotification + "',DiscrepancyNo='" + oDispoDiscrepancy + "',ParentDispoNo='" + oParentDispoNo + "',WorkGroupKey='" + oWorkGroupKey + "')";
            oDataModel.read(sPath, {
                urlParameters: {
                    "$expand": "to_dispobuyoff"
                },
                success: function (oData, oResult) {
                    //debugger;
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.to_dispobuyoff.results;
                    oModel.setData(data);
                    this.getView().byId("idTableDispoBuyOff").setModel(oModel, "DispositionBuyOffModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        bindRODispoProps: function (oROModel) {
            this.getView().byId("dispGenInterCharge").setEnabled(oROModel.oData.DispositionIntCharge);
            this.getView().byId("dispGenDropPoint").setEditable(oROModel.oData.DispositionDropPoint);
            this.getView().byId("dispGenRestrictPart").setEnabled(oROModel.oData.DispositionRestrictPart);
            this.getView().byId("dispGenCSN").setEnabled(oROModel.oData.DispositionCSN);
            this.getView().byId("dispGenPartSuppName").setEditable(oROModel.oData.DispositionPartner);
        },

        onPressDispositionCopy: function (oEvent) {
            var oDispositionType = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispostionType");
            var oDispositionCode = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionCode");
            var oDispositionQty = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionQnty");
            var oDispositionPartsReq = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DispositionPartReq");
            var oDispositionTable = this.getView().byId("idTableDisposition");
            var oDispoTableModel = oDispositionTable.getModel("DispositionDetails").getData();
            oDispoTableModel.push({
                "ParentDispoNo": "",
                "DispostionType": oDispositionType,
                "DispositionCode": oDispositionCode,
                "DispositionStatus": "",
                "DispositionQnty": oDispositionQty,
                "DispositionPartReq": oDispositionPartsReq,
                "DispositionAttchement": "",
                "DispositionCreateBy": "",
                "DispositionBadge": "",
                "DispositionGroup": "",
                "DispositionDateinWorking": ""
            });
            oDispositionTable.getModel("DispositionDetails").setData(oDispoTableModel);
            var oDiscNo = this.getView().byId("idDispCobDscNo").getValue();
            this.getView().byId("headertext").setText("Discrepancy/Disposition No: " + oDiscNo + "/");
        },

        onPressDispositionRTV: function () {
            this._oRTVDialog = sap.ui.xmlfragment(this.getView().getId(), "com.airbus.ZQM_NCR.fragments.RTVDisposition", this);
            this.getView().addDependent(this._oRTVDialog);
            this._oRTVDialog.open();
            var oDispoNotification = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("NotificationNo");
            var oDispoDiscrepancy = this.getView().byId("idTableDisposition").getSelectedItem().getBindingContext("DispositionDetails").getProperty("DiscrepancyNo");
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("NotificationNo", FilterOperator.EQ, oDispoNotification));
            oFilter.push(new Filter("DiscrepancyNo", FilterOperator.EQ, oDispoDiscrepancy));
            var sPath = "/GetRTVDetailsSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oRTVDialog.setModel(oModel, "RTVModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        onCloseRTVPopout: function () {
            this._oRTVDialog.destroy();
        },

        onOpenVHBuyOffGroup: function (oEvent) {
            this._oBuyoffGrpDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.BuyoffGroup", this);
            this.getView().addDependent(this._oBuyoffGrpDialog);
            this._oBuyoffGrpDialog.open();
            this.oBuyOffGrpInp = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "BUYWRKGRP"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oBuyoffGrpDialog.setModel(oModel, "BuyOffGroupModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configBuyOffGroupVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oBuyOffGrpInp;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
            this._oBuyoffGrpDialog.destroy();
        },

        onSearchBuyOffGroup: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var aFilter = [], oFilter = [];
            oFilter.push(new Filter("Value", FilterOperator.Contains, sValue));
            oFilter.push(new Filter("Value1", FilterOperator.Contains, sValue));
            oFilter.push(new Filter("Description", FilterOperator.Contains, sValue));
            aFilter.push(new Filter(oFilter, false));
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter(aFilter);
        },

        onOpenVHBuyOffStatus: function (oEvent) {
            this._oBuyoffStatusDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.BuyoffStatus", this);
            this.getView().addDependent(this._oBuyoffStatusDialog);
            this._oBuyoffStatusDialog.open();
            this.oBuyOffStatusInp = oEvent.getSource();
            sap.ui.core.BusyIndicator.show();
            var oModel = new JSONModel();
            oModel.setSizeLimit(10000);
            var oDataModel = this.getOwnerComponent().getModel();
            var oFilter = [];
            oFilter.push(new Filter("Key", FilterOperator.EQ, "BUYOFFSTATUS"));
            var sPath = "/f4_genericSet";
            oDataModel.read(sPath, {
                filters: oFilter,
                success: function (oData, oResult) {
                    sap.ui.core.BusyIndicator.hide();
                    var data = oData.results;
                    oModel.setData(data);
                    this._oBuyoffStatusDialog.setModel(oModel, "BuyOffStatusModel");
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var msg = JSON.parse(oError.responseText).error.message.value;
                    MessageBox.error(msg);
                }
            });
        },

        _configBuyOffStatusVHDialog: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.oBuyOffStatusInp;

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }
            if (oSelectedItem) {
                oInput.setValue(oSelectedItem.getTitle());
                oInput.setTooltip(oSelectedItem.getInfo());
            }
            this._oBuyoffStatusDialog.destroy();
        },

        onSearchBuyOffStatus: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("Description", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]);
        },
        onSearchDiscNoSignoff:function(){
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("DiscrepancyNo", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getParameter("itemsBinding");
            oBinding.filter([oFilter]); 
        },
        onBuyoffAdd: function () {
            var oBuyOffTable = this.getView().byId("idTableDispoBuyOff");
            var oBuyOffTableModel = oBuyOffTable.getModel("DispositionBuyOffModel").getData();
            if (oBuyOffTableModel.length === 0) {
                oBuyOffTableModel.push({
                    "DispositionGroup": "",
                    "WorkCenter": "",
                    "BuyOffUser": "",
                    "BuyOffDate": "",
                    "BuyOffStatusText": "",
                    "BuyOffComment": "",
                    "DispositionSequence": "",
                    "BuyOffStatusKey": ""
                });
                oBuyOffTable.getModel("DispositionBuyOffModel").setData(oBuyOffTableModel);
            } else if (oBuyOffTableModel.length > 0) {
                var bFlag = false, sBuyOffSequnce;
                for (var k = 0; k < oBuyOffTableModel.length; k++) {
                    sBuyOffSequnce = oBuyOffTableModel[k].DispositionSequence;
                    if (sBuyOffSequnce === "") {
                        bFlag = false;
                        break;
                    } else {
                        bFlag = true;
                    }
                }
                if (bFlag === false) {
                    var oBuyOffAddItemMsg = this.getView().getModel("i18n").getProperty("BuyOffAddItemMsg");
                    MessageBox.warning(oBuyOffAddItemMsg);
                } else {
                    oBuyOffTableModel.push({
                        "DispositionGroup": "",
                        "WorkCenter": "",
                        "BuyOffUser": "",
                        "BuyOffDate": "",
                        "BuyOffStatusText": "",
                        "BuyOffComment": "",
                        "DispositionSequence": "",
                        "BuyOffStatusKey": ""
                    });
                    oBuyOffTable.getModel("DispositionBuyOffModel").setData(oBuyOffTableModel);
                }
            }
        },

        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf com.airbus.ZQM_NCR.view.Ncheader
         */
        //	onBeforeRendering: function() {
        //
        //	},

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf com.airbus.ZQM_NCR.view.Ncheader
         */
        onAfterRendering: function () {
            var oModel = this.getOwnerComponent().getModel("NCSaveModel");
            this.getView().setModel(oModel, "NCSaveModel");
            this.getView().setModel(this.getOwnerComponent().getModel());
        },

        handlePressCancel: function () {
            // this.getView().byId("idIconTabBarHeader").setSelectedKey("Hdata");
            // this.handleIconbarSelect();
            var iconTabBarKey = this.getView().byId("idIconTabBarHeader").getSelectedKey();
            if (iconTabBarKey == "Hdata") {
                var payloadHeaderCancelData = {
                    "NotificationNo": sObjectId,
                    "HeaderStatus": true
                }
                this.getOwnerComponent().getModel().create("/CancelStatusSet", payloadHeaderCancelData, {
                    success: function (odata, Response) {
                        sap.ui.core.BusyIndicator.hide();
                        if (Response.headers["sap-message"] && JSON.parse(Response.headers["sap-message"]).severity === "success") {
                            var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                            MessageBox.success(oMsg, {
                                onClose: function () {
                                }.bind(this)
                            });
                            var sObjectPath = "CreateNotificationHeaderSet('" + sObjectId + "')";
                            this._bindView("/" + sObjectPath);
                            this._bindTable("/" + sObjectPath);
                        }
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            } else if (iconTabBarKey == "Discre") {
                var oDiscrepancyNo = this.getView().byId("idDcCobDscNo").getValue();
                if (oDiscrepancyNo !== "") {
                    var payloadDiscrCancelData = {
                        "NotificationNo": sObjectId,
                        "DiscrepancyNo": oDiscrepancyNo,
                        "DiscrepancyStatus": true
                    }
                    this.getOwnerComponent().getModel().create("/CancelStatusSet", payloadDiscrCancelData, {
                        success: function (odata, Response) {
                            sap.ui.core.BusyIndicator.hide();
                            if (Response.headers["sap-message"] && JSON.parse(Response.headers["sap-message"]).severity === "success") {
                                var oMsg = JSON.parse(Response.headers["sap-message"]).message;
                                MessageBox.success(oMsg, {
                                    onClose: function () {
                                        this.bindDiscrepancyTab(odata.DiscrepancyNo);
                                    }.bind(this)
                                });
                            }
                        }.bind(this),
                        error: function (oError) {
                            sap.ui.core.BusyIndicator.hide();
                            var msg = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(msg);
                        }
                    });
                } else {
                    var oDiscCancelMsg = this.getView().getModel("i18n").getProperty("SelDiscCancelMsg");
                    MessageBox.warning(oDiscCancelMsg);
                }
            }
        },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf com.airbus.ZQM_NCR.view.Ncheader
         */
        onExit: function () {
            var modeData = {};
            modeData.ModeBtn = "";
            var modeModel = new JSONModel();
            modeModel.setData(modeData);
            sap.ui.getCore().setModel(modeModel, "modeModel");
        }

    });
});