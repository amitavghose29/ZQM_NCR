sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, Filter, FilterOperator, Fragment, JSONModel) {
	"use strict";

	return Controller.extend("com.airbus.ZQM_NCR.controller.Main", {
		onInit: function () {},

        /**
        * Function is triggered when the user makes a change on the radio button - NC Create/Copy
        * @function
        */
		onRBNcCrtCpySelect: function () {
			var ncr = this.getView().byId("rbgNcCrtCpy").getSelectedButton().getText();
			if (ncr === "Copy") {
				this.getView().byId("SimpleFormNcCreate").setVisible(false);
				this.getView().byId("idncrnumber").setVisible(true);
			} else {
				this.getView().byId("SimpleFormNcCreate").setVisible(true);
				this.getView().byId("idncrnumber").setVisible(false);
			}
		},
        
        /**
        * Function is triggered when the value help indicator for NC Copy is clicked
        * @function
        */
		onValueHelpNcCopyRequest: function () {
			this._oNCDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.CopyNc", this);
			this.getView().addDependent(this._oNCDialog);
			this._oNCDialog.open();
			this._oNCDialog.setModel(this.getOwnerComponent().getModel());
		},
        
        /**
        * Function is triggered when the NC Copy Dialog is closed
        * @function
        */
		_handleNCCopyVHClose: function () {
			this._oNCDialog.close();
			this._oNCDialog.destroy();
		},
        
        /**
        * Function is triggered when the value help indicator for Serial Number as in filter bar field of NC Number Value Help is clicked
        * @function
        * @param {sap.ui.base.Event} oEvent source of the input
        */
		onSerNoFBVHRequest: function (oEvent) {
			this._oSerNoFBVHDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SerNumFBVH", this);
			this.getView().addDependent(this._oSerNoFBVHDialog);
			this._oSerNoFBVHDialog.open();
			this.oInputSerNoFB = oEvent.getSource();
			sap.ui.core.BusyIndicator.show();
			var oModel = new JSONModel();
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
        
        /**
        * Function is fired when the value of the input is changed - e.g. at each keypress for Serial Number as in filter bar field of NC Number Value Help
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input
        */
		onSerNoFBLiveSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);
		},
        
        /**
        * Function is fired when the serial number as in filter bar field of NC Number Value Help dialog is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
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
        
        /**
        * Function is fired when the value help indicator for notification number as in filter bar field of NC Number Value Help dialog is clicked 
        * @function
        * @param {sap.ui.base.Event} oEvent source of the input 
        */
		onNCNoFBVHRequest: function (oEvent) {
			this._oNCNoFBVHDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NcNumFBVH", this);
			this.getView().addDependent(this._oNCNoFBVHDialog);
			this._oNCNoFBVHDialog.open();
			this.oInputNcNoFB = oEvent.getSource();
			sap.ui.core.BusyIndicator.show();
			var oModel = new JSONModel();
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
        
        /**
        * Function is fired when the value of the input is changed - e.g. at each keypress for Notification Number as in filter bar field of NC Number Value Help
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input
        */
		onNcNoFBLiveSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Value", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getParameter("itemsBinding");
			oBinding.filter([oFilter]);
		},
        
        /**
        * Function is fired when the notification number as in filter bar field of NC Number Value Help dialog is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
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
        
        /**
        * Function is triggered when the go button in filter bar of NC Number Value Help dialog is clicked
        * @function
        */
		onFilterBarSearchCopyNC: function () {
			sap.ui.core.BusyIndicator.show();
			var oModel = new JSONModel();
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

		/**
        * Function is triggered when the go button in filter bar of Goods Receipt Number Value Help dialog is clicked
        * @function
        */
		_onGRSearchGo: function () {
			sap.ui.core.BusyIndicator.show();
			var oModel = new JSONModel();
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

		/**
        * Function is triggered when the go button in filter bar of Production Order Value Help dialog is clicked
        * @function
        */
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
					sap.ui.core.BusyIndicator.hide();
					var data = oData.results;
					if (data.length === 0 && sap.ui.getCore().byId("idFlBarPrOrdVhPrdseq").getValue() === "" && sap.ui.getCore().byId(
							"idFlBarPrOrdVhPartNo").getValue() === "" && sap.ui.getCore().byId("idFlBarPrOrdVhnlp").getValue() === "" && sap.ui.getCore()
						.byId("idFlBarPrOrdVhWrkIns").getValue() === "") {
						MessageBox.warning(
							"No data found.! Please try to search using filter bar fields provided.!", {
								icon: MessageBox.Icon.WARNING,
								title: "No matching order found",
								actions: [MessageBox.Action.OK],
								emphasizedAction: MessageBox.Action.OK,
								initialFocus: MessageBox.Action.OK,
								onClose: function (sAction) {
									if (sAction == MessageBox.Action.OK) {}
								}.bind(this)
							}
						);
					} else if (data.length === 0 && (sap.ui.getCore().byId("idFlBarPrOrdVhPrdseq").getValue() !== "" || sap.ui.getCore().byId(
								"idFlBarPrOrdVhPartNo").getValue() !== "" ||
							sap.ui.getCore().byId("idFlBarPrOrdVhnlp").getValue() !== "" ||
							sap.ui.getCore().byId("idFlBarPrOrdVhWrkIns").getValue() !== "")) {
						MessageBox.warning(
							"Do you want to specify a Partner Code for this Part?", {
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

		/**
        * Function is triggered when the go button in filter bar of Purchase Order Value Help dialog is clicked
        * @function
        */
		_onPoSearchGo: function () {
			sap.ui.core.BusyIndicator.show();
			var oModel = new JSONModel();
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
        
        /**
        * Function is triggered when the Goods Receipt value help is closed
        * @function
        */
		_handleGRValueHelpClose: function () {
			this._oGRDialog.destroy();
		},

        /**
        * Function is triggered when the Production Order value help is closed
        * @function
        */
		_handlePOValueHelpClose: function () {
			this._oPODialog.destroy();
		},
        
        /**
        * Function is triggered when the Goods Receipt value help line item is pressed
        * @function
        * @param {sap.ui.base.Event} oEvent object of pressed item
        */
		handleGRItemSelection: function (oEvent) {
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
        
        /**
        * Function is triggered when the Purchase Order value help line item is pressed
        * @function
        * @param {sap.ui.base.Event} oEvent object of pressed item
        */
       handlePurOrdItemSelection: function (oEvent) {
			var oSelectedItem = oEvent.getParameters().listItem.getCells()[0].getText();
			var oInput = this.getView().byId("idsubcno");
			if (!oSelectedItem) {
				oInput.resetProperty("value");
				return;
			}

			oInput.setValue(oSelectedItem);
			this._oPrOrdDialog.destroy();
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
        
        /**
        * Function is executed when the search is triggered in Select Partner Code dialog 
        * @function
        * @param {sap.ui.base.Event} oEvent object of the user input
        */
		handleSearchPartnerCode: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = [];
			oFilter.push(new Filter("ProductCode", sap.ui.model.FilterOperator.Contains, sValue));
			oFilter.push(new Filter("PartnerCode", sap.ui.model.FilterOperator.Contains, sValue));
			oFilter.push(new Filter("ParentPartNumber", sap.ui.model.FilterOperator.Contains, sValue));
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilter);
		},
        
        /**
        * Function is fired when the Partner Code is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
		handleConfirmPartnerCode: function (oEvent) {
			var oSelProdCode = oEvent.getParameters().selectedItem.getBindingContext().getProperty("PartnerCode");
			// sap.m.MessageToast.show("The partner code chosen is " + oSelContxt);
			if (oSelProdCode !== "") {
				sap.ui.core.BusyIndicator.show();
				var oModel = new JSONModel();
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

		/**
        * Function is fired when the value in the text input field is changed for Sub Category 
        * @function
        */
        onChngSubCat: function () {
			var oSubCat = this.getView().byId("idlinksubc").getSelectedKey();
			this.getView().byId("idsubsubno").setVisible(true);
			var oInputSub = this.getView().byId("idsubcno");
			oInputSub.setValue("");
			this.getView().byId("idsubsubno").setValue("");
			if (Number(oSubCat) == "0004") {
				this.getView().byId("idsubsubno").setVisible(false);
			} else if (Number(oSubCat) == "0005") {
				this.getView().byId("idsubsubno").setVisible(false);
			}

		},

        /**
        * Function is triggered when the value help indicator for sub category is clicked
        * @function
        */
		_onVHReqSubCategory: function () {
			var oDataModel = this.getOwnerComponent().getModel();
			var oSubCat = this.getView().byId("idlinksubc").getSelectedKey();

			if (oSubCat === "") {
				sap.m.MessageBox.alert("Please Select Sub Category");
			} else {

				sap.ui.core.BusyIndicator.show();
				if (Number(oSubCat) == "0001") {
					//Value Help Code for Production Order(001)           
					this._oPODialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.f4category", this);
					this.getView().addDependent(this._oPODialog);
					this._oPODialog.open();
					// this._oPODialog.setModel(this.getOwnerComponent().getModel());

					var oProdOrdPartSuggModel = new JSONModel();

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
					var oProdOrdNLPSuggModel = new JSONModel();
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

					var oProdOrdWISuggModel = new JSONModel();
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

				} else if (Number(oSubCat) == "000002") {
					//Value Help Code for Work Instruction(002) 
					this._oWIDialog = sap.ui.xmlfragment("WIfragId", "com.airbus.ZQM_NCR.fragments.WorkInstructionVH", this);
					this.getView().addDependent(this._oWIDialog);
					this._oWIDialog.open();
					//Work Inst Showsuggestion s
					var oWRSugModel = new JSONModel();
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
				} else if (Number(oSubCat) == "000003") {
					//Value Help Code for GR Number(003)			    	
					this._oGRDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.GrValueHelp", this);
					this.getView().addDependent(this._oGRDialog);
					this._oGRDialog.open();

					//Purchase Order Showsuggestion s
					var oGRPurSugModel = new JSONModel();
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
					var oGRInbSugModel = new JSONModel();
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
					var oGRPartSugModel = new JSONModel();
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

				} else if (Number(oSubCat) == "000004") {
					//Value Help Code for Purchase Order(004)			    	
					this._oPrOrdDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PoValueHelp", this);
					this.getView().addDependent(this._oPrOrdDialog);
					this._oPrOrdDialog.open();

					var sPath = "/f4_genericSet";
					//ASN Number ShowSuggestion s
					var oPoASNModel = new JSONModel();
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
					var oPoInbModel = new JSONModel();
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
					var oPoPartNoModel = new JSONModel();
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
					var oPoNcNoModel = new JSONModel();
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
					var oPoDisNoModel = new JSONModel();
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
					var oPoRmaNoModel = new JSONModel();
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

				} else if (Number(oSubCat) == "000005") {
					//Value Help Code for Part Number(005)
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
						var oJSONMOdel = new JSONModel();

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

					}
				}
			}
		},

		/**
        * Function is triggered when the value help indicator for Work Instruction as in filter bar field of Production Order Value Help is clicked
        * @function
        */
        _onValueHelpReqWorkIns: function () {
			this._oWIDialog = sap.ui.xmlfragment("WIfragId", "com.airbus.ZQM_NCR.fragments.WorkInstructionVH", this);
			this.getView().addDependent(this._oWIDialog);
			this._oWIDialog.open();

			var oDataModel = this.getOwnerComponent().getModel();
			//Work Inst Showsuggestion s
			var oWRSugModel = new JSONModel();
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

        /**
        * Function is triggered when the value help indicator for Part Number as in filter bar field of Production Order, Purchase Order and Goods Receipt Value Help is clicked
        * @function
        */
		_onValueHelpReqPartNo: function () {
		this._oPrtNoFBDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.PartNoFBValueHelp", this);
			this.getView().addDependent(this._oPrtNoFBDialog);
			this._oPrtNoFBDialog.open();
			sap.ui.core.BusyIndicator.show();
			var oModel = new JSONModel();
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
        
        /**
        * Function is fired when the Part Number as in filter bar field of Production Order, Purchase Order and Goods Receipt Value Help dialog is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
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

		/**
        * Function is fired when the work instruction as in filter bar field of Goods Receipt and Work Instruction Value Help dialog is confirmed by selecting an item 
        * @function
        * @param {sap.ui.base.Event} oEvent item being selected is returned 
        */
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
			var oModel = new JSONModel();
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
			var oJSONMOdel = new JSONModel();

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
				var oJSONMOdel = new JSONModel();

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
				this._onVHReqSubCategory();
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
			if (!oSelectedItem) {
				oInput.resetProperty("value");
				return;
			}
			oInput.setValue(oSelectedItem.getTitle());
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

		handleCloseUserValueHelpNCcopy: function (oEvent) {
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
			this.Dialog.close();
			this.Dialog.destroy();
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

		onNCAreaChange: function () {
			this.getView().byId("idsubcno").setValue("");
		},

		_onLotNumVHClose: function () {
			this._oLotnumVHDialog.destroy();
		},

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
						} else {
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
			this._oPODialog.close();
			this._oPODialog.destroy();
			this.getView().byId("idsubcno").setValue();
		},

		onCloseUserPopup1: function () {
			this.Dialog.close();
			this.Dialog.destroy();
		},

		onPressNext: function () {
			var rbtNc = this.getView().byId("rbgNcCrtCpy").getSelectedIndex();
			if (rbtNc == 0) {
				var nctype = this.getView().byId("idncr").getSelectedKey();
				var iwa = this.getView().byId("idiwa").getSelectedKey();
				var subcat = this.getView().byId("idlinksubc").getSelectedItem() ? this.getView().byId("idlinksubc").getSelectedItem().getText() :
					"";
				var binloc = this.getView().byId("idInpBinLoc").getValue();
				var subItemNo = this.getView().byId("idsubcno").getValue();

				var payload = {
					NcType: nctype,
					Area: iwa,
					SubCategory: subcat,
					BinLocation: binloc
				};
				var saveData = {};
				// var saveData = {
				//     GRN: "",
				//     PON: "",
				//     NotifNo: ""
				// };

				// var subCat = this.getView().byId("idlinksubc").getSelectedKey();
				// if (subCat !== "") {
				// 	if (subCat == "000001") {
				// 		saveData.GRN = this.getView().byId("idsubcno").getValue();
				// 	} else if (subCat == "000002") {
				// 		saveData.PON = this.getView().byId("idsubcno").getValue();
				// 	}
				// }
				var entityset = "/CreateNotificationSet";

               if (payload.NcType == "" || payload.Area == "" || payload.SubCategory == "" || payload.BinLocation == "" || subItemNo == "") {
					var temp = "";
				} else {
					temp = "X";
				}
			} else {
				var ncCopy = this.getView().byId("idncrnumber").getValue();
				var payload = {
					Notification: ncCopy,
					"Message": ""
				};
				var entityset = "/CopyNotificationSet";
				if (ncCopy == "") {
					var temp = "";
				} else {
					temp = "X"
				}
			}

			if (temp == "") {
				MessageBox.warning("Please Select Mandtory Fields")
			} else {
				var oModel = this.getOwnerComponent().getModel();
				oModel.create(entityset, payload, {
					success: function (data) {
						MessageBox.success(data.Message, {
							onClose: function () {
								saveData = payload;
								saveData.NotifNo = data.Notification;
								var jsonModel = new JSONModel();
								jsonModel.setData(saveData);
								this.getOwnerComponent().setModel(jsonModel, "NCSaveModel");

								this.getOwnerComponent().getRouter().navTo("Ncheader", {
									ID: data.Notification
								});

							}.bind(this)
						});
					}.bind(this),
					error: function (oError) {
						var msg = JSON.parse(oError.responseText).error.message.value;
						MessageBox.error(msg);
					}
				});
			}
		}
	});
});