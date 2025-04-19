import React from "react"
import { Navigate } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Pages Calendar
import Calendar from "../pages/Calendar/index"

//Email
import EmailInbox from "../pages/Email/email-inbox"
import EmailRead from "../pages/Email/email-read"
import EmailCompose from "../pages/Email/email-compose"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login"
import Register1 from "../pages/AuthenticationInner/Register"
import Recoverpw from "../pages/AuthenticationInner/Recoverpw"
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen"

// Dashboard
import Dashboard from "../pages/Dashboard/index"

//Charts
import ChartsAppex from "../pages/Charts/charts-appex";
import ChartsJs from "../pages/Charts/charts-chartjs";
import ChartsKnob from "../pages/Charts/charts-knob";
import ChartsSparkLine from "../pages/Charts/charts-sparkline";

// Maps
import MapsGoogle from "../pages/Maps/MapsGoogle"
import MapsVector from "../pages/Maps/MapsVector"

//Icons
import IconMaterialdesign from "../pages/Icons/IconMaterialdesign"
import Iconion from "../pages/Icons/Iconion"
import IconFontawesome from "../pages/Icons/IconFontawesome"
import IconThemify from "../pages/Icons/IconThemify"
import IconDripicons from "../pages/Icons/IconDripicons"
import IconTypicons from "../pages/Icons/IconTypicons"

//Tables
import BasicTables from "../pages/Tables/BasicTables"
import DatatableTables from "../pages/Tables/DatatableTables"
import ResponsiveTables from "../pages/Tables/ResponsiveTables"

// Forms
import FormElements from "../pages/Forms/FormElements"
import FormAdvanced from "../pages/Forms/FormAdvanced"
import FormEditors from "../pages/Forms/FormEditors"
import FormValidations from "../pages/Forms/FormValidations"
import FormUpload from "../pages/Forms/FormUpload"

//Ui
import UiAlert from "../pages/Ui/UiAlert"
import UiButtons from "../pages/Ui/UiButtons"
import UiBadge from "../pages/Ui/UiBadge"
import UiCards from "../pages/Ui/UiCards"
import UiCarousel from "../pages/Ui/UiCarousel"
import UiDropdown from "../pages/Ui/UiDropdown"
import UiGrid from "../pages/Ui/UiGrid"
import UiImages from "../pages/Ui/UiImages"
import UiLightbox from "../pages/Ui/UiLightbox"
import UiModal from "../pages/Ui/UiModal"
import UiPagination from "../pages/Ui/UiPagination"
import UiPopoverTooltips from "../pages/Ui/UiPopoverTooltips"
import UiProgressbar from "../pages/Ui/UiProgressbar"
import UiTabsAccordions from "../pages/Ui/UiTabsAccordions"
import UiTypography from "../pages/Ui/UiTypography"
import UiVideo from "../pages/Ui/UiVideo"
import UiSessionTimeout from "../pages/Ui/UiSessionTimeout"
import UiRangeSlider from "../pages/Ui/UiRangeSlider"


//Extra Pages
import PagesTimeline from "../pages/Extra Pages/pages-timeline";
import PagesInvoice from "../pages/Extra Pages/pages-invoice";
import PagesDirectory from "../pages/Extra Pages/pages-directory";
import PagesBlank from "../pages/Extra Pages/pages-blank";
import Pages404 from "../pages/Extra Pages/pages-404";
import Pages500 from "../pages/Extra Pages/pages-500";
import UiUtilities from "pages/Ui/UiUtilities"
import UiColors from "pages/Ui/UiColors"
import UiOffcanvas from "pages/Ui/UiOffcanvas"
import Chat from "pages/Chat/Chat";
import Kanban from "pages/Kanban"
import Inventory from "pages/Inventory/inventory"
import Products from "pages/Products/Products"
import UpdateProduct from "pages/Products/UpdateProduct"
import OrderStatus from "pages/OrderStatus/OrderStatus"
import UpdateOrderStatus from "pages/OrderStatus/UpdateOrderStatus"
import Orders from "pages/Orders/orders"
import ProductLobby from "pages/Product_Lobby/productLobby"
import InventoryUpload from "pages/InvemtoryUpload/InventoryUpload"
import UserStock from "pages/User Stock/UserStock"
import AdminStocklist from "pages/Admin Stocklist/AdminStocklist"
import Invoice from "pages/Invoice/invoice"
import Order from "pages/Orders/orders"
import LiveInventory from "pages/InvemtoryUpload/LiveInventory"
import Buyers from "pages/Buyers/buyers"
import Expense from "pages/Expense/Expense"
import InvoiceTable from "pages/Invoice/InvoiceTable"
import InvoiceUpload from "pages/InvoiceUpload/InvoiceUpload"
import Subscriber from "pages/Subscriber/subscriber"
import Supplier from "pages/Supplier/supplier"
import PurchaseOrder from "pages/PurchaseOrder/purchaseOrder"
import EmailTemplate from "pages/Email_Template/emailTemplate"
import EmailCampaign from "pages/Email_Campaign/emailCampaign"
import ExpenseCategory from "pages/ExpenseCategory/expenseCategory"
import CreditNote from "pages/CreditNote/CreditNote"
import DeliveryNote from "pages/Delivery_Notes/deliveryNote"
import CampaignRecep from "pages/CampaignRecep/campaignRecep"
import Marketplace from "pages/MarketPlace/marketPlace"
import Rmas from "pages/Rmas/rmas"
import ReportTemplate from "pages/Report_Template/reportTemplate"
import GenerateReport from "pages/Generate_Report/generateReport"
import Listing from "pages/Listing/listing"

import CreditNoteModule from "pages/CreditNote_Module/creditNoteModule"
import GenerateCreditNote from "pages/CreditNote_Module/generateCreditNote"
import RmasTable from "pages/CreditNote_Module/rmasTable";
import ListingModule from "pages/Listing_Module/listing";
import ListingOverview from "pages/Listing_Overview/listingOverview";
import BellIcon from "pages/Bell_Icon/bellIcon";
import InvoiceTemplate from "pages/InvoiceTemplate/invoiceTemplate";
import CreditNoteAdmin from "pages/CreditNoteAdmin/CreditNoteAdmin"






const userRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/inventory", component: <Inventory /> },
  { path: "/orders/:id", component: <Orders /> },
  { path: "/inventory-upload", component: <InventoryUpload /> },
  { path: "/live-inventory", component: <LiveInventory /> },

  { path: "/products", component: <Products /> },
  { path: "/update-product/:id", component: <UpdateProduct /> },

  { path: "/order-statuses", component: <OrderStatus /> },
  { path: "/update-order-statuses/:id", component: <UpdateOrderStatus /> },

  { path: "/product_lobby/:id", component: <ProductLobby /> },
  { path: "/user-stock", component: <UserStock /> },
  { path: "/admin-stocklist", component: <AdminStocklist /> },
  { path: "/invoice", component: <Invoice /> },
  { path: "/order", component: <Order /> },

  { path: "/buyers", component: <Buyers /> },

  { path: "/expense", component: <Expense /> },

  { path: "/invoice", component: <InvoiceTable /> },
  { path: "/invoiceupload", component: <InvoiceUpload /> },
  { path: "/subscriber", component: <Subscriber /> },
  { path: "/supplier", component: <Supplier /> },
  { path: "/purchaseorder", component: <PurchaseOrder /> },
  { path: "/emailtemplate", component: <EmailTemplate /> },
  { path: "/emailcampaign", component: <EmailCampaign /> },
  { path: "/expensecategory", component: <ExpenseCategory /> },
  { path: "/creditNote", component: <CreditNote /> },

  { path: "/deliverynote", component: <DeliveryNote /> },
  { path: "/campaignrecep", component: <CampaignRecep /> },
  { path: "/marketplace", component: <Marketplace /> },
  { path: "/rmas", component: <Rmas /> },
  { path: "/reporttemplate", component: <ReportTemplate /> },
  { path: "/generatereport", component: <GenerateReport /> },
  { path: "/listing", component: <Listing /> },
  { path: "/creditnotemodule", component: <CreditNoteModule /> },
  { path: "/generatecreditnote", component: <GenerateCreditNote /> },
  { path: "/rmastable", component: <RmasTable /> },
  { path: "/listingmodule", component: <ListingModule /> },
  { path: "/listingoverview", component: <ListingOverview /> },
  { path: "/bellicon", component: <BellIcon /> },
  { path: "/creditnotetable", component: <CreditNote /> },
  { path: "/invoicetemplate", component: <InvoiceTemplate /> },
  { path: "/credit-note-admin", component: <CreditNoteAdmin /> },

  // //calendar
  { path: "/calendar", component: <Calendar /> },

  { path: "/chat", component: <Chat /> },
  { path: "/kanbanboard", component: <Kanban /> },

  // // //profile
  { path: "/profile", component: <UserProfile /> },

  // //Email
  { path: "/email-inbox", component: <EmailInbox /> },
  { path: "/email-read", component: <EmailRead /> },
  { path: "/email-compose", component: <EmailCompose /> },

  // //Charts
  { path: "/apex-charts", component: <ChartsAppex /> },
  { path: "/charts-chartjs", component: <ChartsJs /> },
  { path: "/charts-knob", component: <ChartsKnob /> },
  { path: "/sparkline-charts", component: <ChartsSparkLine /> },

  // // Icons
  { path: "/icons-materialdesign", component: <IconMaterialdesign /> },
  { path: "/icons-ion", component: <Iconion /> },
  { path: "/icons-fontawesome", component: <IconFontawesome /> },
  { path: "/icons-themify", component: <IconThemify /> },
  { path: "/icons-dripicons", component: <IconDripicons /> },
  { path: "/icons-typicons", component: <IconTypicons /> },

  // // Tables
  { path: "/tables-basic", component: <BasicTables /> },
  { path: "/tables-datatable", component: <DatatableTables /> },
  { path: "/tables-responsive", component: <ResponsiveTables /> },

  // // Maps
  { path: "/maps-google", component: <MapsGoogle /> },
  { path: "/maps-vector", component: <MapsVector /> },

  // // Forms
  { path: "/form-elements", component: <FormElements /> },
  { path: "/form-advanced", component: <FormAdvanced /> },
  { path: "/form-editors", component: <FormEditors /> },
  { path: "/form-uploads", component: <FormUpload /> },
  { path: "/form-validation", component: <FormValidations /> },

  // // Ui
  { path: "/ui-alerts", component: <UiAlert /> },
  { path: "/ui-buttons", component: <UiButtons /> },
  { path: "/ui-badge", component: <UiBadge /> },
  { path: "/ui-cards", component: <UiCards /> },
  { path: "/ui-carousel", component: <UiCarousel /> },
  { path: "/ui-dropdowns", component: <UiDropdown /> },
  { path: "/ui-grid", component: <UiGrid /> },
  { path: "/ui-images", component: <UiImages /> },
  { path: "/ui-lightbox", component: <UiLightbox /> },
  { path: "/ui-modals", component: <UiModal /> },
  { path: "/ui-pagination", component: <UiPagination /> },
  { path: "/ui-popover-tooltip", component: <UiPopoverTooltips /> },
  { path: "/ui-progressbars", component: <UiProgressbar /> },
  { path: "/ui-tabs-accordions", component: <UiTabsAccordions /> },
  { path: "/ui-typography", component: <UiTypography /> },
  { path: "/ui-video", component: <UiVideo /> },
  { path: "/ui-session-timeout", component: <UiSessionTimeout /> },
  { path: "/ui-rangeslider", component: <UiRangeSlider /> },
  { path: "/ui-utilities", component: <UiUtilities /> },
  { path: "/ui-colors", component: <UiColors /> },
  { path: "/ui-offcanvas", component: <UiOffcanvas /> },

  // //Extra Pages
  { path: "/pages-timeline", component: <PagesTimeline /> },
  { path: "/pages-invoice", component: <PagesInvoice /> },
  { path: "/pages-directory", component: <PagesDirectory /> },
  { path: "/pages-blank", component: <PagesBlank /> },

  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
]

const authRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },

  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },

  // Authentication Inner
  { path: "/pages-login", component: <Login1 /> },
  { path: "/pages-register", component: <Register1 /> },
  { path: "/page-recoverpw", component: <Recoverpw /> },
  { path: "/auth-lock-screen", component: <LockScreen /> },
]

export { userRoutes, authRoutes }