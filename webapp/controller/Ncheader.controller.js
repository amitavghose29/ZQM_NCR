sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/core/Fragment',
	"sap/ui/model/json/JSONModel",
	"sap/m/MessagePopover",
	"sap/m/MenuItem",
    "sap/m/Token",
    "sap/m/SearchField",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/m/Tokenizer",
    "sap/m/MessageBox",
    "sap/ui/model/type/String"
], function (Controller, Fragment, JSONModel, MessagePopover, MenuItem, Token, SearchField, Filter, FilterOperator, Tokenizer, MessageBox, typeString) {
	"use strict";

	return Controller.extend("com.airbus.ZQM_NCR.controller.Ncheader", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.airbus.ZQM_NCR.view.Ncheader
		 */
		onInit: function () {
			//this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("Ncheader").attachMatched(this._onRouteMatched, this);
// Added code for multiinput control id initialisation and validator - Code Start            
            this._oMultiInputSN = this.getView().byId("idMNInputSN");
            this._oMultiInputSN.addValidator(function(args){
				var text = args.text;

				return new Token({key: text, text: text});
			});

            this._oMultiInputTN = this.getView().byId("idMNInputTN");
            this._oMultiInputTN.addValidator(function(args){
				var text = args.text;

				return new Token({key: text, text: text});
			});

            this.oSerNoColModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/sernocolumnsModel.json");
            this.oTrcNoColModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/trcnocolumnsModel.json");
            this.oMultiInputSNModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/serialnumber.json");
            this.oMultiInputTNModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/traceabilitynumber.json");
// Added code for multiinput control id initialisation and validator - Code End		            
        },

		_onRouteMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var fid = oArgs.ID;
            this.getView().byId("idNCHeaderDataForm").setModel(this.getOwnerComponent().getModel());
            if(this.getOwnerComponent().getModel("NCSaveModel").getData()){
                this.getView().byId("idnctypehdr").setSelectedKey(this.getOwnerComponent().getModel("NCSaveModel").getData().NCType);
                this.getView().byId("idinahdr").setSelectedKey(this.getOwnerComponent().getModel("NCSaveModel").getData().IWA);
            }
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
		handleIconbarSelect: function (oEvent) {
			var htext = this.getView().byId("idIconTabBarNoIcons");
			var key = oEvent.getParameters().selectedItem.getKey();

			//	var bold = oEvent.getParameters().selectedItem.getText().bold();
			//	oEvent.getParameters().selectedItem.setText(bold);
			if (key === "Hdata") {
				var text = "";
			} else if (key === "log") {
				text = "Traceability and History";
			} else {
				text = oEvent.getParameters().selectedItem.getText();
			}
			this.getView().byId("headertext").setText(text);
		},
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
		onNotesChange: function () {
			var oView = this.getView(),
				oButton = oView.byId("button");

			if (!this._oMenuFragment) {
				this._oMenuFragment = Fragment.load({
					id: oView.getId(),
					name: "com.airbus.ZQM_NCR.fragments.notespopup",
					controller: this
				}).then(function (oMenu) {
					oMenu.openBy(oButton);
					this._oMenuFragment = oMenu;
					return this._oMenuFragment;
				}.bind(this));
			} else {
				this._oMenuFragment.openBy(oButton);
			}
		},
		onMenuAction: function (oEvent) {
			var oItem = oEvent.getParameter("item"),
				sItemPath = "";

			while (oItem instanceof MenuItem) {
				sItemPath = oItem.getText() + " > " + sItemPath;
				oItem = oItem.getParent();
			}

			sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));

			sap.m.MessageToast.show("Action triggered on item: " + sItemPath);
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

		onDiscrepancy: function () {
			this.getView().byId("idIconTabBarNoIcons").setSelectedKey("Discre");

		},
		onCopyDiscrepancy: function () {
			if (!this.oDialog) {
				this.Dialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.copydiscrepancy", this);
				this.getView().addDependent(this.oDialog);
			}
			this.Dialog.open();
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
			this.getView().byId("idIconTabBarNoIcons").setVisible(false);
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
			this.getOwnerComponent().getRouter().navTo("TargetMain");
		},
		onNcrPressSave: function () {

			//	this.getView().byId("ncrcreatecopy").setVisible(false);
			//this.getView().byId("SimpleFormChange480_12120Dual").setVisible("false");
			//this.getView().byId("idIconTabBarNoIcons").setVisible(true);
			//this.getView().byId("idsave").setVisible(true);
			//this.getView().byId("idcancel").setVisible(true);
			//this.getView().byId("idncrsave").setVisible(false);
			//this.getView().byId("idncrcancel").setVisible(false);
			//this.getView().byId("page").setTitle("NC F721000007");
			//this.getView().byId("idheader").setVisible(true);
            
    //Manadatory Validations for Prchase info input fields - Added by Venkata 09.09.2022- Code Start

            let Gr = this.getView().byId("idPurInfGrip").getValue();
            if(Gr==="")
            {
                this.getView().byId("idPurInfGrip").setValueState("Error");
                this.getView().byId("idPurInfGrip").setValueStateText("Please Enetre GR# Value");
            }

            var GrQty = this.getView().byId("idPurInfGrQtyip").getValue();
            if(GrQty==="")
            {
                this.getView().byId("idPurInfGrQtyip").setValueState("Error");
                this.getView().byId("idPurInfGrQtyip").setValueStateText("Please Enetre GR Qty Value");
            }

            var PurchOrd = this.getView().byId("idPurInfPurOrdip").getValue();
            if(PurchOrd ==="")
            {
                this.getView().byId("idPurInfPurOrdip").setValueState("Error");
                this.getView().byId("idPurInfPurOrdip").setValueStateText("Please enter Purchase Order Value");
            }

            var PurchOrdLin = this.getView().byId("idPurInfPolnip").getValue();
            if(PurchOrdLin==="")
            {
                this.getView().byId("idPurInfPolnip").setValueState("Error");
                this.getView().byId("idPurInfPolnip").setValueStateText("Please Enter PO Line Number");

            }

            var Podt = this.getView().byId("idPurInfPoDtdp").getValue();
            if(Podt==="")
            {
                this.getView().byId("idPurInfPoDtdp").setValueState("Error");
                this.getView().byId("idPurInfPoDtdp").setValueStateText("Please Enter PO Date");
            }

            var SuppName = this.getView().byId("idPurInfSupNmip").getValue();
            if(SuppName ==="")
            {
                this.getView().byId("idPurInfSupNmip").setValueState("Error");
                this.getView().byId("idPurInfSupNmip").setValueStateText("Please Enter Supplier Name");
            }

            var Suppsapcode = this.getView().byId("idPurInfSupSCip").getValue();
            if(Suppsapcode ==="")
            {
                this.getView().byId("idPurInfSupSCip").setValueState("Error");
                this.getView().byId("idPurInfSupSCip").setValueStateText("Please Enter Supplier SAP Code");
            }

            var Supppartnum = this.getView().byId("idPurInfSupPnip").getValue();
            if(Supppartnum==="")
            {
                this.getView().byId("idPurInfSupPnip").setValueState("Error");
                this.getView().byId("idPurInfSupPnip").setValueStateText("Please Enter Supplier Part Number");
            }

            var MRPController = this.getView().byId("idPurInfMrpcrip").getValue();
            if(MRPController==="")
            {
                this.getView().byId("idPurInfMrpcrip").setValueState("Error");
                this.getView().byId("idPurInfMrpcrip").setValueStateText("Please Enter MRP Controller");
            }

            var MRPControllerName = this.getView().byId("idPurInfMrpcrnmip").getValue();
            if(MRPControllerName==="")
            {
                this.getView().byId("idPurInfMrpcrnmip").setValueState("Error");
                this.getView().byId("idPurInfMrpcrnmip").setValueStateText("Please Enter MRP Controller Name");
            }

            var WBN = this.getView().byId("idPurInfWBNip").getValue();
            if(WBN==="")
            {
                this.getView().byId("idPurInfWBNip").setValueState("Error");
                this.getView().byId("idPurInfWBNip").setValueStateText("Please Enter Way Bill No.");
            }

            var PckgSlp = this.getView().byId("idPurInfPcgslip").getValue();
            if(PckgSlp==="")
            {
                this.getView().byId("idPurInfPcgslip").setValueState("Error");
                this.getView().byId("idPurInfPcgslip").setValueStateText("Please Enter Packaging Slip Value");
            }

            var WBN2 = this.getView().byId("idPurInfWBN2ip").getValue();
            if(WBN2==="")
            {
                this.getView().byId("idPurInfWBN2ip").setValueState("Error");
                this.getView().byId("idPurInfWBN2ip").setValueStateText("Please Enter Way Bill No.");
            }

            var PckgSlp2 = this.getView().byId("idPurInfPcgsl2ip").getValue();
            if(PckgSlp2==="")
            {
                this.getView().byId("idPurInfPcgsl2ip").setValueState("Error");
                this.getView().byId("idPurInfPcgsl2ip").setValueStateText("Please Enter Packaging Slip Value");
            }

            var Po = this.getView().byId("idPurInfPOip").getValue();
            if(Po==="")
            {
                this.getView().byId("idPurInfPOip").setValueState("Error");
                this.getView().byId("idPurInfPOip").setValueStateText("Please Enter PO# Value");
            }

            var OutboundDelivery = this.getView().byId("idPurInfOutDelip").getValue();
            if(OutboundDelivery==="")
            {
                this.getView().byId("idPurInfOutDelip").setValueState("Error");
                this.getView().byId("idPurInfOutDelip").setValueStateText("Please Enter Outbound Delivery Value");
            }

            var RMA = this.getView().byId("idPurInfRMAip").getValue();
            if(RMA==="")
            {
                this.getView().byId("idPurInfRMAip").setValueState("Error");
                this.getView().byId("idPurInfRMAip").setValueStateText("Please Enter RMA Value");
            }

            var RelNot = this.getView().byId("idPurInfRelNoteip").getValue();
            if(RelNot==="")
            {
                this.getView().byId("idPurInfRelNoteip").setValueState("Error");
                this.getView().byId("idPurInfRelNoteip").setValueStateText("Please Enter Release Note");
            }

            
        //Manadatory Validations for Prchase info input fields - Added by Venkata 09.09.2022 - Code End

            var oNCType = this.getView().byId("idnctypehdr").getSelectedKey();
                if(oNCType === "ESUPPLIER" && this.getView().byId("idMNInputSN").getTokens().length === 0){
                    this.getView().byId("idMNInputSN").setValueState("Error");
                    this.getView().byId("idMNInputSN").setValueStateText("Please Enter Serial Number");
                }
                if(oNCType === "ESUPPLIER" && this.getView().byId("idMNInputTN").getTokens().length === 0){
                    this.getView().byId("idMNInputTN").setValueState("Error");
                    this.getView().byId("idMNInputTN").setValueStateText("Please Enter Traceability Number");
                }

            if(this.getOwnerComponent().getModel("NCSaveModel").getData().SubCat === "WORK INSTRUCTIONS"){
                this.getView().byId("idInpAircraft").setValueState("Error");
                this.getView().byId("idInpAircraft").setValueStateText("Please Enter Aircraft Number");
            }
		},

        handleAircraftChange: function(){
            var oInput = this.getView().byId("idInpAircraft").getValue();
                if(oInput !== ""){
                    this.getView().byId("idInpAircraft").setValueState("None");
                    this.getView().byId("idInpAircraft").setValueStateText("");
                }
        },

		onNcrchange: function () {
			var ncr = this.getView().byId("idnctypehdr").getSelectedKey();
			if (ncr === "standard") {
				// this.getView().byId("idlink").setVisible(true);
			} else {
				// this.getView().byId("idlink").setVisible(false);
			}

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
			var ic = this.getView().byId("idIconTabBarNoIcons");

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
        onOpenVHSerNo: function(){
            var aCols = this.oSerNoColModel.getData().cols;
            this._oBasicSearchField = new SearchField({
				showSearchButton: false
			});
            sap.ui.core.BusyIndicator.show();
			this._oValueHelpDialogSN = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SerialNoVHDialog", this);
			this.getView().addDependent(this._oValueHelpDialogSN);
            this._oValueHelpDialogSN.getFilterBar().setBasicSearch(this._oBasicSearchField);
            this._oValueHelpDialogSN.getTableAsync().then(function (oTable) {
				oTable.setModel(this.oMultiInputSNModel);
				oTable.setModel(this.oSerNoColModel, "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/serialcollection");
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/serialcollection", function () {
						return new ColumnListItem({
							cells: aCols.map(function (column) {
								return new Label({ text: "{" + column.template + "}" });
							})
						});
					});
				}
				this._oValueHelpDialogSN.update();
			}.bind(this));

			this._oValueHelpDialogSN.setTokens(this._oMultiInputSN.getTokens());
			this._oValueHelpDialogSN.open();
			sap.ui.core.BusyIndicator.hide();
        },

        onFilterBarSearch: function (oEvent) {
			var sSearchQuery = this._oBasicSearchField.getValue(),
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
					new Filter({ path: "ProductId", operator: FilterOperator.Contains, value1: sSearchQuery })
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
			this._oMultiInputSN.setTokens(aTokens);
			this._oValueHelpDialogSN.close();
            if(aTokens.length > 0 && this.getView().byId("idMNInputSN").getValueState() === "Error"){
                this.getView().byId("idMNInputSN").setValueState("None");
                this.getView().byId("idMNInputSN").setValueStateText("");
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
        onOpenVHTrcNo: function(){
            var aCols = this.oTrcNoColModel.getData().cols;
            this._oBasicSearchFieldTN = new SearchField({
				showSearchButton: false
			});
            sap.ui.core.BusyIndicator.show();
			this._oValueHelpDialogTN = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.TraceabilityVHDialog", this);
			this.getView().addDependent(this._oValueHelpDialogTN);
            this._oValueHelpDialogTN.getFilterBar().setBasicSearch(this._oBasicSearchFieldTN);
            this._oValueHelpDialogTN.getTableAsync().then(function (oTable) {
				oTable.setModel(this.oMultiInputTNModel);
				oTable.setModel(this.oTrcNoColModel, "columns");

				if (oTable.bindRows) {
					oTable.bindAggregation("rows", "/traceabilitycollection");
				}

				if (oTable.bindItems) {
					oTable.bindAggregation("items", "/traceabilitycollection", function () {
						return new ColumnListItem({
							cells: aCols.map(function (column) {
								return new Label({ text: "{" + column.template + "}" });
							})
						});
					});
				}
				this._oValueHelpDialogTN.update();
			}.bind(this));

			this._oValueHelpDialogTN.setTokens(this._oMultiInputTN.getTokens());
			this._oValueHelpDialogTN.open();
			sap.ui.core.BusyIndicator.hide();
        },

        onValueHelpTNOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInputTN.setTokens(aTokens);
			this._oValueHelpDialogTN.close();
            if(aTokens.length > 0 && this.getView().byId("idMNInputTN").getValueState() === "Error"){
                this.getView().byId("idMNInputTN").setValueState("None");
                this.getView().byId("idMNInputTN").setValueStateText("");
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
					new Filter({ path: "Product", operator: FilterOperator.Contains, value1: sSearchQuery })
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

// Added code for Part Number field data validation  - Code Start
        handleChangePartNo: function(){
            var oInpPartNo = this.getView().byId("idInpPartNo"),
                oMulInpSer = this.getView().byId("idMNInputSN"),
                oMulInpTrc = this.getView().byId("idMNInputTN");

                if(oInpPartNo.getValue() === ""){
                    oMulInpSer.setEditable(false);
                    oMulInpTrc.setEditable(false);
                    if(oMulInpSer.getTokens()){
                        oMulInpSer.removeAllTokens();
                    }else if(oMulInpTrc.getTokens()){
                        oMulInpTrc.removeAllTokens();
                    }
                }else{
                    oMulInpSer.setEditable(true);
                    oMulInpTrc.setEditable(true);
                }
        },

// Added code for Part Number field data validation  - Code End

// Added code for Serial Number Multi Input token when the tokens aggregation changed due to a user interaction   - Code Start
        _onTokenUpdateSN: function(oEvent) {
			var aTokens,
                sTokensText = "",
                sNo,
                i, 
                j,
                bFlag = true;

			if (oEvent.getParameter('type') === Tokenizer.TokenUpdateType.Added) {
				aTokens = oEvent.getParameter('addedTokens');

				sTokensText = "Added tokens: ";
                for (i = 0; i < aTokens.length; i++) {
                    this.getView().byId("idMNInputSN").setValueState("None");
                    this.getView().byId("idMNInputSN").setValueStateText("");
                    sTokensText = aTokens[i].getText();
                    
                    for (j = 0; j < this.oMultiInputSNModel.getData().serialcollection.length; j++){
                        sNo = this.oMultiInputSNModel.getData().serialcollection[j].ProductId;
                        if (sTokensText === sNo) {
                            bFlag = true;
                            break;
                        }else{
                            bFlag = false;
                        }
                    }
                }

                if(bFlag === false){
                    var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			                MessageBox.information(
				                "Serial Number not available in SAP.!",
				                {
					                styleClass: bCompact ? "sapUiSizeCompact" : ""
				                }
			                );
                    // sap.m.MessageToast.show("Serial Number not available in SAP");
                }
			} 
		},
// Added code for Serial Number Multi Input token when the tokens aggregation changed due to a user interaction   - Code End 

// Added code for Traceability Number Multi Input token when the tokens aggregation changed due to a user interaction   - Code Start
        _onTokenUpdateTN: function(oEvent) {
            var aTokens,
                sTokensText = "",
                sNo,
                i, 
                j,
                bFlag = true;

            if (oEvent.getParameter('type') === Tokenizer.TokenUpdateType.Added) {
                this.getView().byId("idMNInputTN").setValueState("None");
                this.getView().byId("idMNInputTN").setValueStateText("");
                aTokens = oEvent.getParameter('addedTokens');

                sTokensText = "Added tokens: ";
                for (i = 0; i < aTokens.length; i++) {
                    sTokensText = aTokens[i].getText();
                    
                    for (j = 0; j < this.oMultiInputTNModel.getData().traceabilitycollection.length; j++){
                        sNo = this.oMultiInputTNModel.getData().traceabilitycollection[j].Product;
                        if (sTokensText === sNo) {
                            bFlag = true;
                            break;
                        }else{
                            bFlag = false;
                        }
                    }

                    if(bFlag === false){
                        var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			                MessageBox.information(
				                "Traceability Number not available in SAP.!",
				                {
					                styleClass: bCompact ? "sapUiSizeCompact" : ""
				                }
			                );
                        // sap.m.MessageToast.show("Traceability Number not available in SAP");
                    }
                }
            } 
        },
// Added code for Traceability Number Multi Input token when the tokens aggregation changed due to a user interaction   - Code End 

//Added Code for Value help for GR , Purchase Order and SAP Supplier CodeFields- Code Start
onGRhelpRequest:function(oEvent){
   // if(!this._oGRDialog)
    //{
        this._oGRDialog = sap.ui.xmlfragment("GRfragId","com.airbus.ZQM_NCR.fragments.GrValueHelp", this);
        this.getView().addDependent(this._oGRDialog);
    //}
    
    this._oGRDialog.open();
},
onPurchOrdhelpRequest:function(){
    //if(!this._oPODialog)
    //{
        this._oPODialog = sap.ui.xmlfragment("POfragId","com.airbus.ZQM_NCR.fragments.PoValueHelp", this);
	    this.getView().addDependent(this._oPODialog);
    //}
    
	this._oPODialog.open();
},
onSuppSAPCodehelpRequest :function(){
    //if(!this._oSSCDialog)
    //{
        this._oSSCDialog = sap.ui.xmlfragment("SSCfragId","com.airbus.ZQM_NCR.fragments.SSCValueHelp", this);
	    this.getView().addDependent(this._oSSCDialog);
    //}
    
	this._oSSCDialog.open();
},
_confirmGRValueHelpDialog:function(oEvent){
    var oSelectedItem = oEvent.getParameter("selectedItem"),
    oInput = this.getView().byId("idPurInfGrip");
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
    oInput = this.getView().byId("idPurInfPurOrdip");
    if (!oSelectedItem) {
        oInput.resetProperty("value");
        return;
    }

    oInput.setValue(oSelectedItem.getTitle());
    this._oPODialog.destroy();
},
_confirmSSCValueHelpDialog:function(oEvent){
    var oSelectedItem = oEvent.getParameter("selectedItem"),
    oInput = this.getView().byId("idPurInfSupSCip");
    if (!oSelectedItem) {
        oInput.resetProperty("value");
        return;
    }

    oInput.setValue(oSelectedItem.getTitle());
    this._oSSCDialog.destroy();
},
_handleGRValueHelpClose:function()
{
    //this._oGRDialog.close();
    this._oGRDialog.destroy();
},
_handlePOValueHelpClose:function(){
    //this._oPODialog.close();
    this._oPODialog.destroy();
},
_handleSSCValueHelpClose:function(){
    //this._oSSCDialog.close();
    this._oSSCDialog.destroy();
},
//Added Code for Value help for GR , Purchase Order and SAP Supplier Code Fields- Code End
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
	onAfterRendering: function() {
                var oModel = this.getOwnerComponent().getModel("NCSaveModel");
                this.getView().setModel(oModel);

                
	},

    // Added code for various VH's in NC Header screen, associated events and other validations - Code Start
    onVHReqProductCode: function () {
        this._oProdCodeDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.ProductCodeVH", this);
        this.getView().addDependent(this._oProdCodeDialog);
        this._oProdCodeDialog.open();
    },

    _configProdCodeVHDialog: function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idInpProdCode");
        if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this._oProdCodeDialog.destroy();
    },

    onVHReqWrkIns: function () {
        this._oWrkInsDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.WorkInstructionVH", this);
        this.getView().addDependent(this._oWrkInsDialog);
        this._oWrkInsDialog.open();
    },

    _configWrkInsVHDialog: function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idInpWrkIns");
        if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this._oWrkInsDialog.destroy();
    },

    onVHReqPrdOrd: function () {
        this._oPrdOrdDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.ProductionOrderVH", this);
        this.getView().addDependent(this._oPrdOrdDialog);
        this._oPrdOrdDialog.open();
    },

    _configProdOrdVHDialog: function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idInpPrdOrd");
        if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this._oPrdOrdDialog.destroy();
    },

    onVHReqSupNC: function () {
        this._oSupNCDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SupersedesNCVH", this);
        this.getView().addDependent(this._oSupNCDialog);
        this._oSupNCDialog.open();
    },

    _configProdOrdVHDialog: function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idInpSupNC");
        if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this._oSupNCDialog.destroy();
    },

    onVHReqSupBy: function () {
        this._oSupByDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.SupersededByVH", this);
        this.getView().addDependent(this._oSupByDialog);
        this._oSupByDialog.open();
    },

    _configSupByVHDialog: function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idInpSupBy");
        if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this._oSupByDialog.destroy();
    },

    onVHReqRefNC: function () {
        this._oRefNCDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.ReferenceNCVH", this);
        this.getView().addDependent(this._oRefNCDialog);
        this._oRefNCDialog.open();
    },

    _configRefNCVHDialog: function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idInpRefNC");
        if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this._oRefNCDialog.destroy();
    },

    onVHReqAircraft: function () {
        this._oAircraftDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.AircraftVH", this);
        this.getView().addDependent(this._oAircraftDialog);
        this._oAircraftDialog.open();
    },

    _configAircraftVHDialog: function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idInpAircraft");
        if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this._oAircraftDialog.destroy();
        if(oInput !== ""){
            this.getView().byId("idInpAircraft").setValueState("None");
            this.getView().byId("idInpAircraft").setValueStateText("");
        }
    },

    onOpenVHPartNo: function(){
        this._oPartNoDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.partno", this);
        this.getView().addDependent(this._oPartNoDialog);
        this._oPartNoDialog.open();
        sap.ui.core.BusyIndicator.show();
        var oModel = new sap.ui.model.json.JSONModel();
        var oDataModel = this.getOwnerComponent().getModel();
        oDataModel.read("/Material_NumberSet", {
            success: function (oData, oResult) {
                var data = oData.results;
                oModel.setData(data);
                this._oPartNoDialog.setModel(oModel);
                sap.ui.core.BusyIndicator.hide();
            }.bind(this),
            error: function (oError) {
                sap.ui.core.BusyIndicator.hide();
            }
        });
    },

    _configPartNoVHDialog: function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = sap.ui.getCore().byId("idInpPartNo");

        if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this._oPartNoDialog.destroy();
    },

    onOpenVHNCCreated: function(){
        this.oNCCrtColModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/nccolumns.json");
        this.oInputNCCrtModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/traceabilitynumber.json");
        this._oNcCrtInput = this.getView().byId("idInpNCCrtBy");
        var aCols = this.oNCCrtColModel.getData().cols;
        sap.ui.core.BusyIndicator.show();
        this._oValueHelpDialogNCCrt = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NCCreatedBy", this);
        this.getView().addDependent(this._oValueHelpDialogNCCrt);
         
        this._oValueHelpDialogNCCrt.setRangeKeyFields([
            {
                label: "Department",
                key: "Department",
                type: "string",
                typeInstance: new typeString({}, {
                    maxLength: 12
                })
            },
            {
                label: "Station",
                key: "Station",
                type: "string",
                typeInstance: new typeString({}, {
                    maxLength: 12
                })
            }
        ]);

        this._oValueHelpDialogNCCrt.getTableAsync().then(function (oTable) {
            oTable.setModel(this.oInputNCCrtModel);
            oTable.setModel(this.oNCCrtColModel, "columns");
            // oTable.setSelectionMode("Single");
            if (oTable.bindRows) {
                oTable.bindAggregation("rows", "/nccomponentcollection");
            }

            if (oTable.bindItems) {
                oTable.bindAggregation("items", "/nccomponentcollection", function () {
                    return new ColumnListItem({
                        cells: aCols.map(function (column) {
                            return new Label({ text: "{" + column.template + "}" });
                        })
                    });
                });
            }
            this._oValueHelpDialogNCCrt.update();
        }.bind(this));

        this._oValueHelpDialogNCCrt.setTokens(this._oNcCrtInput.getTokens());
        this._oValueHelpDialogNCCrt.open();
        sap.ui.core.BusyIndicator.hide();
    },

    onValueHelpNCCrtOkPress: function(oEvent){
        var aTokens = oEvent.getParameter("tokens");
            this.getView().byId("idInpNCCrtBy").setTokens(aTokens);
            // if (aTokens.length > 0) {
            //     this.getView().byId("idInpNCCrtBy").setValue(aTokens[0].getKey());
            // }
            this._oValueHelpDialogNCCrt.close();
    },

    onValueHelpNCCrtCancelPress: function(){
        this._oValueHelpDialogNCCrt.close();
    },

    onValueHelpNCCrtAfterClose: function(){
        this._oValueHelpDialogNCCrt.destroy();
    },

    onOpenVHNCDetected: function(){
        this.oNCDetColModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/nccolumns.json");
        this.oInputNCDetModel = new JSONModel(sap.ui.require.toUrl("com/airbus/ZQM_NCR") + "/model/traceabilitynumber.json");
        this._oNcDetInput = this.getView().byId("idInpNCDetAt");
        var aCols = this.oNCDetColModel.getData().cols;
        sap.ui.core.BusyIndicator.show();
        this._oValueHelpDialogNCDet = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.NCDetectedAt", this);
        this.getView().addDependent(this._oValueHelpDialogNCDet);
         
        this._oValueHelpDialogNCDet.setRangeKeyFields([
            {
                label: "Department",
                key: "Department",
                type: "string",
                typeInstance: new typeString({}, {
                    maxLength: 12
                })
            },
            {
                label: "Station",
                key: "Station",
                type: "string",
                typeInstance: new typeString({}, {
                    maxLength: 12
                })
            }
        ]);

        this._oValueHelpDialogNCDet.getTableAsync().then(function (oTable) {
            oTable.setModel(this.oInputNCDetModel);
            oTable.setModel(this.oNCDetColModel, "columns");
            // oTable.setSelectionMode("Single");
            if (oTable.bindRows) {
                oTable.bindAggregation("rows", "/nccomponentcollection");
            }

            if (oTable.bindItems) {
                oTable.bindAggregation("items", "/nccomponentcollection", function () {
                    return new ColumnListItem({
                        cells: aCols.map(function (column) {
                            return new Label({ text: "{" + column.template + "}" });
                        })
                    });
                });
            }
            this._oValueHelpDialogNCDet.update();
        }.bind(this));

        this._oValueHelpDialogNCDet.setTokens(this._oNcDetInput.getTokens());
        this._oValueHelpDialogNCDet.open();
        sap.ui.core.BusyIndicator.hide();
    },

    onValueHelpNCDetOkPress: function(oEvent){
        var aTokens = oEvent.getParameter("tokens");
            this.getView().byId("idInpNCDetAt").setTokens(aTokens);
            this._oValueHelpDialogNCDet.close();
    },

    onValueHelpNCDetCancelPress: function(){
        this._oValueHelpDialogNCDet.close();
    },

    onValueHelpNCDetAfterClose: function(){
        this._oValueHelpDialogNCDet.destroy();
    },

    onOpenVHBinLoc: function(){
        this._oBinLocDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.BinAreaValueHelp", this);
        this.getView().addDependent(this._oBinLocDialog);
        this._oBinLocDialog.open();
    },

    _confirmBinValueHelpDialog: function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idInpBinLoc");
        if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this._oBinLocDialog.destroy();
    },

    onOpenVHDrpPt: function(){
        this._oDrpPtDialog = sap.ui.xmlfragment("com.airbus.ZQM_NCR.fragments.DropPointVH", this);
        this.getView().addDependent(this._oDrpPtDialog);
        this._oDrpPtDialog.open();
    },

    _configDrpPntVHDialog: function(oEvent){
        var oSelectedItem = oEvent.getParameter("selectedItem"),
            oInput = this.getView().byId("idInpDrpPt");
        if (!oSelectedItem) {
            oInput.resetProperty("value");
            return;
        }

        oInput.setValue(oSelectedItem.getTitle());
        this._oDrpPtDialog.destroy();
    }
    // Added code for various VH's in NC Header screen, associated events and other validations - Code End

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.airbus.ZQM_NCR.view.Ncheader
		 */
		//	onExit: function() {
		//
		//	}

	});

});