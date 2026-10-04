import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import {
  ShoppingBag,
  Coffee,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Clock,
  Settings,
  LogOut,
  X,
  Printer,
  QrCode,
  DollarSign,
  TrendingUp,
  Edit3,
  ShieldAlert,
  BarChart3,
  Lock,
  KeyRound,
  CheckCircle2,
  XCircle,
  Receipt,
  LogOut as LogoutIcon,
  LayoutDashboard,
  PieChart,
  ArrowUpRight,
  AlertTriangle,
  Layers,
  Sparkle,
  FileText,
  UtensilsCrossed,
  Check,
  Tag,
  Wallet,
  Award,
  Calendar,
  Package,
  Filter,
  Ban,
  Maximize2,
  HeartHandshake,
  Flame,
  User,
  AlertCircle
} from "lucide-react";

// ==========================================
// CONSTANTS & INITIAL DATA
// ==========================================
const initialCategories = [
  { 
    id: "all", 
    name: "ทั้งหมด",
    subCategories: [] 
  },
  {
    id: "coffee",
    name: "Coffee",
    subCategories: [
      { id: "all", name: "ทั้งหมดใน Coffee" },
      { id: "hot", name: "Hot (ร้อน)" },
      { id: "iced", name: "Iced (เย็น)" },
      { id: "frappe", name: "Frappe (ปั่น)" }
    ]
  },
  {
    id: "non-coffee",
    name: "Non-Coffee",
    subCategories: [
      { id: "all", name: "ทั้งหมดใน Non-Coffee" },
      { id: "tea", name: "Tea & Matcha" },
      { id: "chocolate", name: "Chocolate & Milk" },
      { id: "soda", name: "Italian Soda" }
    ]
  },
  {
    id: "bakery",
    name: "Bakery",
    subCategories: [
      { id: "all", name: "ทั้งหมดใน Bakery" },
      { id: "croissant", name: "Croissant" },
      { id: "cake", name: "Cake" },
      { id: "toast", name: "Toast" }
    ]
  }
];

export default function App() {
  // ==========================================
  // STATE MANAGEMENT (NAVIGATION & GENERAL)
  // ==========================================
  const [activeTab, setActiveTab] = useState("pos");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Data States
  const [menuItems, setMenuItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [orderQueueCount, setOrderQueueCount] = useState(1);
  const [promotions, setPromotions] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Customer & Cart Edit
  const [customerName, setCustomerName] = useState("");
  const [editingCartId, setEditingCartId] = useState(null);

  // Authentication & Management
  const [adminSubTab, setAdminSubTab] = useState("menu");
  const [isManagementAuthenticated, setIsManagementAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [targetTabAfterAuth, setTargetTabAfterAuth] = useState("admin");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const MANAGEMENT_PIN = "1234";

  // Date Filter States for Dashboard
  const initialDateObj = new Date();
  const [selectedYear, setSelectedYear] = useState(initialDateObj.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialDateObj.getMonth());
  const [selectedDay, setSelectedDay] = useState(String(initialDateObj.getDate()));

  // Checkout & Payment States
  const [selectedItemForCustom, setSelectedItemForCustom] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [orderType, setOrderType] = useState("Dine-in");
  const [cashReceived, setCashReceived] = useState("");
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [customDiscount, setCustomDiscount] = useState(0);

  // Modals
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isShiftCloseOpen, setIsShiftCloseOpen] = useState(false);
  const [actualCashCount, setActualCashCount] = useState("");

  // Item Options State
  const [sweetness, setSweetness] = useState("");
  const [coffeeRoast, setCoffeeRoast] = useState("");
  const [milk, setMilk] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [itemNote, setItemNote] = useState("");
  const [customQty, setCustomQty] = useState(1);

  // Confirmation Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmModalAction, setConfirmModalAction] = useState(null);

  // ==========================================
  // SEPARATE ADMIN FORM STATES (NO OBJECT COMBINING)
  // ==========================================
  const [editingItem, setEditingItem] = useState(null);
  const [hasMultipleSizes, setHasMultipleSizes] = useState(false);
  
  // State สำหรับกรองหมวดหมู่หน้า Admin รายการสินค้า
  const [adminFilterCategory, setAdminFilterCategory] = useState("all");

  // Explicit Item Form Input States
  const [itemNameInput, setItemNameInput] = useState("");
  const [itemPriceInput, setItemPriceInput] = useState("");
  const [itemCategoryInput, setItemCategoryInput] = useState("coffee");
  const [itemSubCategoryInput, setItemSubCategoryInput] = useState("hot");
  const [itemImageInput, setItemImageInput] = useState("");
  const [itemInStockInput, setItemInStockInput] = useState(true);
  const [itemSweetnessTextInput, setItemSweetnessTextInput] = useState("100%, 50%, 0%");
  const [itemCoffeeRoastTextInput, setItemCoffeeRoastTextInput] = useState("คั่วอ่อน, คั่วกลาง (Standard), คั่วเข้ม");
  const [itemMilkTextInput, setItemMilkTextInput] = useState("นมสดธรรมดา (+0), นมโอ๊ต (+20)");
  const [itemAddonsTextInput, setItemAddonsTextInput] = useState("เพิ่ม Shot กาแฟ (+25)");
  const [itemRecipeList, setItemRecipeList] = useState([]);
  const [itemSizesList, setItemSizesList] = useState([]);

  // Admin Sizes Sub-states
  const [newSizeName, setNewSizeName] = useState("");
  const [newSizePrice, setNewSizePrice] = useState("");
  const [selectedSizeIdxForRecipe, setSelectedSizeIdxForRecipe] = useState(0);

  // Admin Recipe Input States
  const [selectedIngForRecipe, setSelectedIngForRecipe] = useState("");
  const [recipeIngAmount, setRecipeIngAmount] = useState("");

  // Option Helper Inputs
  const [newSweetnessInput, setNewSweetnessInput] = useState("");
  const [newCoffeeRoastInput, setNewCoffeeRoastInput] = useState("");
  const [newMilkInput, setNewMilkInput] = useState("");

  // Addon Helper Inputs
  const [addonNameInput, setAddonNameInput] = useState("");
  const [addonPriceInput, setAddonPriceInput] = useState("");
  const [selectedAddonIngInput, setSelectedAddonIngInput] = useState("");
  const [addonIngAmountInput, setAddonIngAmountInput] = useState("");

  // Explicit Ingredient Form States
  const [ingNameInput, setIngNameInput] = useState("");
  const [ingStockInput, setIngStockInput] = useState("");
  const [ingUnitInput, setIngUnitInput] = useState("กรัม");
  const [ingMinStockInput, setIngMinStockInput] = useState("");

  // Explicit Promotion Form States
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoNameInput, setPromoNameInput] = useState("");
  const [promoTypeInput, setPromoTypeInput] = useState("percent");
  const [promoValueInput, setPromoValueInput] = useState("");
  const [promoMinSpendInput, setPromoMinSpendInput] = useState("");

  // Explicit Expense Form States
  const [expTitleInput, setExpTitleInput] = useState("");
  const [expCategoryInput, setExpCategoryInput] = useState("raw_material");
  const [expAmountInput, setExpAmountInput] = useState("");
  const [expDateInput, setExpDateInput] = useState(new Date().toISOString().split("T")[0]);

  // ==========================================
  // CONFIRMATION DIALOG HANDLERS
  // ==========================================
  const triggerConfirmation = (title, message, actionFunction) => {
    setConfirmModalTitle(title);
    setConfirmModalMessage(message);
    setConfirmModalAction(() => actionFunction);
    setConfirmModalOpen(true);
  };

  const closeConfirmation = () => {
    setConfirmModalOpen(false);
    setConfirmModalTitle("");
    setConfirmModalMessage("");
    setConfirmModalAction(null);
  };

  const handleExecuteConfirmation = async () => {
    if (confirmModalAction) {
      await confirmModalAction();
    }
    closeConfirmation();
  };

  // ==========================================
  // SUPABASE DATA FETCHING
  // ==========================================
  const fetchMenuItems = async () => {
    const { data, error } = await supabase.from("menu_items").select("*");
    if (!error && data) {
      setMenuItems(data);
    }
  };

  const fetchIngredients = async () => {
    const { data, error } = await supabase.from("ingredients").select("*");
    if (!error && data) {
      setIngredients(data);
    }
  };

  const fetchPromotions = async () => {
    const { data, error } = await supabase.from("promotions").select("*");
    if (!error && data) {
      setPromotions(data);
    }
  };

  const fetchExpenses = async () => {
    const { data, error } = await supabase.from("expenses").select("*").order("date", { ascending: false });
    if (!error && data) {
      setExpenses(data);
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      const formatted = data.map((orderItem) => {
        const orderDateObj = new Date(orderItem.created_at);
        const dateFormatted = orderDateObj.toLocaleDateString("th-TH");
        const timeFormatted = orderDateObj.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

        return {
          id: orderItem.id,
          queueNo: orderItem.queue_no,
          customerName: orderItem.customer_name || "",
          total: orderItem.total,
          status: orderItem.status,
          orderType: orderItem.order_type,
          paymentMethod: orderItem.payment_method,
          items: orderItem.items || [],
          date: dateFormatted,
          time: timeFormatted,
          createdAt: orderItem.created_at,
          subtotal: orderItem.total,
          vat: (orderItem.total * 7) / 107,
          discount: orderItem.discount || 0
        };
      });

      setOrderHistory(formatted);

      const activeKitchenList = formatted.filter((o) => {
        return o.status === "pending" || o.status === "preparing";
      });
      setKitchenOrders(activeKitchenList);

      const todayStr = new Date().toLocaleDateString("th-TH");
      const todayCount = formatted.filter((o) => o.date === todayStr).length;
      setOrderQueueCount(todayCount + 1);
    }
  };

  const fetchAllData = async () => {
    await fetchMenuItems();
    await fetchIngredients();
    await fetchPromotions();
    await fetchExpenses();
    await fetchOrders();
  };

  useEffect(() => {
    fetchAllData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsManagementAuthenticated(true);
      }
    });

    const realtimeChannel = supabase
      .channel("pos-realtime-all-tables")
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, () => fetchMenuItems())
      .on("postgres_changes", { event: "*", schema: "public", table: "ingredients" }, () => fetchIngredients())
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrders())
      .on("postgres_changes", { event: "*", schema: "public", table: "promotions" }, () => fetchPromotions())
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, () => fetchExpenses())
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, []);

  // ==========================================
  // INVENTORY & STOCK CHECK LOGIC
  // ==========================================
  const checkSingleRecipeStock = (recipeArray) => {
    if (!recipeArray) return true;
    if (recipeArray.length === 0) return true;

    for (let i = 0; i < recipeArray.length; i++) {
      const recipeItem = recipeArray[i];
      const foundIngredient = ingredients.find((ing) => ing.id === recipeItem.ingId);
      if (!foundIngredient) {
        return false;
      }
      if (foundIngredient.stock < recipeItem.amount) {
        return false;
      }
    }
    return true;
  };

  const isItemInStock = (itemObject) => {
    const isManualStock = itemObject.in_stock ?? itemObject.inStock ?? true;
    if (isManualStock === false) {
      return false;
    }

    if (itemObject.sizes && itemObject.sizes.length > 0) {
      for (let s = 0; s < itemObject.sizes.length; s++) {
        const sizeObj = itemObject.sizes[s];
        if (checkSingleRecipeStock(sizeObj.recipe) === true) {
          return true;
        }
      }
      return false;
    }

    return checkSingleRecipeStock(itemObject.recipe);
  };

  const isSizeInStock = (sizeObject, fallbackRecipe = []) => {
    if (sizeObject && sizeObject.recipe) {
      return checkSingleRecipeStock(sizeObject.recipe);
    }
    return checkSingleRecipeStock(fallbackRecipe);
  };

  // ==========================================
  // AUTHENTICATION HANDLERS
  // ==========================================
  const handleProtectedTabClick = (tabKey) => {
    if (isManagementAuthenticated === true) {
      setActiveTab(tabKey);
    } else {
      setTargetTabAfterAuth(tabKey);
      setIsAuthModalOpen(true);
      setPinInput("");
      setPinError("");
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setPinError("");

    if (pinInput === MANAGEMENT_PIN) {
      setIsManagementAuthenticated(true);
      setIsAuthModalOpen(false);
      setActiveTab(targetTabAfterAuth);
    } else {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "admin@sweetgear.cafe",
          password: pinInput
        });

        if (error) {
          setPinError("รหัสผ่านไม่ถูกต้อง");
        } else {
          if (data.session) {
            setIsManagementAuthenticated(true);
            setIsAuthModalOpen(false);
            setActiveTab(targetTabAfterAuth);
          }
        }
      } catch (err) {
        setPinError("รหัสผ่านไม่ถูกต้อง");
      }
    }
  };

  const handleLogoutConfirm = async () => {
    await supabase.auth.signOut();
    setIsManagementAuthenticated(false);
    setIsLogoutModalOpen(false);
    setActiveTab("pos");
  };

  // ==========================================
  // POS & CART HANDLERS
  // ==========================================
  const handleItemClick = (item) => {
    if (isItemInStock(item) === false) {
      return;
    }

    setSelectedItemForCustom(item);
    setEditingCartId(null);

    const sizeArray = item.sizes || [];
    if (sizeArray.length > 0) {
      let selectedDefault = sizeArray[0];
      for (let i = 0; i < sizeArray.length; i++) {
        if (isSizeInStock(sizeArray[i], item.recipe) === true) {
          selectedDefault = sizeArray[i];
          break;
        }
      }
      setSelectedSize(selectedDefault);
    } else {
      setSelectedSize(null);
    }

    const swOpts = item.sweetness_options || item.sweetnessOptions || [];
    const roastOpts = item.coffee_roast_options || item.coffeeRoastOptions || ["คั่วอ่อน", "คั่วกลาง (Standard)", "คั่วเข้ม"];
    const milkOpts = item.milk_options || item.milkOptions || [];

    if (swOpts.length > 0) {
      setSweetness(swOpts[0]);
    } else {
      setSweetness("100%");
    }

    if (item.category === "coffee") {
      if (roastOpts.length > 1) {
        setCoffeeRoast(roastOpts[1]);
      } else if (roastOpts.length > 0) {
        setCoffeeRoast(roastOpts[0]);
      } else {
        setCoffeeRoast("คั่วกลาง (Standard)");
      }
    } else {
      setCoffeeRoast("");
    }

    if (milkOpts.length > 0) {
      setMilk(milkOpts[0]);
    } else {
      setMilk(null);
    }

    setSelectedAddons([]);
    setItemNote("");
    setCustomQty(1);
  };

  const handleEditCartItem = (cartItem) => {
    setEditingCartId(cartItem.cartId);
    setSelectedItemForCustom(cartItem);
    setSelectedSize(cartItem.selectedSize || null);
    setSweetness(cartItem.sweetness || "100%");
    setCoffeeRoast(cartItem.coffeeRoast || "");
    setMilk(cartItem.selectedMilk || null);
    setSelectedAddons(cartItem.selectedAddonsList || []);
    setItemNote(cartItem.noteText || "");
    setCustomQty(cartItem.qty || 1);
  };

  const handleAddCustomizedToCart = () => {
    let basePriceNum = 0;
    if (selectedSize) {
      basePriceNum = Number(selectedSize.price);
    } else {
      basePriceNum = Number(selectedItemForCustom.price);
    }

    let milkPriceNum = 0;
    if (milk) {
      milkPriceNum = Number(milk.price);
    }

    let addonsPriceNum = 0;
    for (let a = 0; a < selectedAddons.length; a++) {
      addonsPriceNum = addonsPriceNum + Number(selectedAddons[a].price);
    }

    const finalUnitPrice = basePriceNum + milkPriceNum + addonsPriceNum;

    const sizeLabel = selectedSize ? selectedSize.name : "";
    const milkLabel = milk ? milk.label : "";
    
    const addonsLabelArray = [];
    for (let i = 0; i < selectedAddons.length; i++) {
      addonsLabelArray.push(selectedAddons[i].label);
    }
    const addonsLabelStr = addonsLabelArray.join(", ");

    const textParts = [];
    if (sizeLabel !== "") textParts.push(sizeLabel);
    if (coffeeRoast !== "") textParts.push(coffeeRoast);
    if (sweetness !== "") textParts.push(sweetness);
    if (milkLabel !== "") textParts.push(milkLabel);
    if (addonsLabelStr !== "") textParts.push(addonsLabelStr);

    let finalOptionsText = "ปกติ";
    if (textParts.length > 0) {
      finalOptionsText = textParts.join(" • ");
    }

    const noteTextTrimmed = itemNote.trim();
    let computedCartId = editingCartId;
    if (!computedCartId) {
      computedCartId = `${selectedItemForCustom.id}-${finalOptionsText}-${noteTextTrimmed}-${Date.now()}`;
    }

    let activeRecipe = [];
    if (selectedSize && selectedSize.recipe) {
      activeRecipe = selectedSize.recipe;
    } else if (selectedItemForCustom.recipe) {
      activeRecipe = selectedItemForCustom.recipe;
    }

    const cartItemPayload = {
      ...selectedItemForCustom,
      cartId: computedCartId,
      optionsText: finalOptionsText,
      noteText: noteTextTrimmed,
      unitPrice: finalUnitPrice,
      qty: customQty,
      selectedSize: selectedSize,
      recipe: activeRecipe,
      selectedMilk: milk,
      selectedAddonsList: selectedAddons,
      coffeeRoast: coffeeRoast,
      sweetness: sweetness
    };

    if (editingCartId) {
      const updatedCart = cart.map((item) => {
        if (item.cartId === editingCartId) {
          return cartItemPayload;
        }
        return item;
      });
      setCart(updatedCart);
    } else {
      const existingIndex = cart.findIndex((i) => i.cartId === computedCartId);
      if (existingIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingIndex].qty += customQty;
        setCart(updatedCart);
      } else {
        setCart([...cart, cartItemPayload]);
      }
    }

    setSelectedItemForCustom(null);
    setEditingCartId(null);
  };

  const updateCartQuantity = (cartId, delta) => {
    const updated = [];
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      if (item.cartId === cartId) {
        const newQty = item.qty + delta;
        if (newQty > 0) {
          updated.push({ ...item, qty: newQty });
        }
      } else {
        updated.push(item);
      }
    }
    setCart(updated);
  };

  // Calculations
  let subtotal = 0;
  for (let c = 0; c < cart.length; c++) {
    subtotal += cart[c].unitPrice * cart[c].qty;
  }

  let promoDiscountCalculated = 0;
  if (selectedPromo) {
    const minSpendValue = selectedPromo.min_spend ?? selectedPromo.minSpend ?? 0;
    if (subtotal >= minSpendValue) {
      if (selectedPromo.type === "percent") {
        promoDiscountCalculated = (subtotal * selectedPromo.value) / 100;
      } else {
        promoDiscountCalculated = selectedPromo.value;
      }
    }
  }

  let effectiveDiscount = promoDiscountCalculated;
  if (Number(customDiscount) > effectiveDiscount) {
    effectiveDiscount = Number(customDiscount);
  }

  let total = subtotal - effectiveDiscount;
  if (total < 0) {
    total = 0;
  }
  const vat = (total * 7) / 107;

  // Stock deduction execution
  const deductInventoryStock = async (cartItemsArray) => {
    const deductionsMap = {};

    for (let i = 0; i < cartItemsArray.length; i++) {
      const item = cartItemsArray[i];
      const itemQty = item.qty;

      if (item.recipe) {
        for (let r = 0; r < item.recipe.length; r++) {
          const rec = item.recipe[r];
          if (!deductionsMap[rec.ingId]) {
            deductionsMap[rec.ingId] = 0;
          }
          deductionsMap[rec.ingId] += rec.amount * itemQty;
        }
      }

      if (item.selectedMilk && item.selectedMilk.ingId) {
        const milkIngId = item.selectedMilk.ingId;
        if (!deductionsMap[milkIngId]) {
          deductionsMap[milkIngId] = 0;
        }
        deductionsMap[milkIngId] += item.selectedMilk.amount * itemQty;
      }

      if (item.selectedAddonsList) {
        for (let a = 0; a < item.selectedAddonsList.length; a++) {
          const add = item.selectedAddonsList[a];
          if (add.ingId && add.amount) {
            if (!deductionsMap[add.ingId]) {
              deductionsMap[add.ingId] = 0;
            }
            deductionsMap[add.ingId] += add.amount * itemQty;
          }
        }
      }
    }

    const ingKeys = Object.keys(deductionsMap);
    for (let k = 0; k < ingKeys.length; k++) {
      const ingId = ingKeys[k];
      const amountToDeduct = deductionsMap[ingId];

      const currentIng = ingredients.find((ing) => ing.id === ingId);
      if (currentIng) {
        let updatedStock = currentIng.stock - amountToDeduct;
        if (updatedStock < 0) {
          updatedStock = 0;
        }
        await supabase.from("ingredients").update({ stock: updatedStock }).eq("id", ingId);
      }
    }
  };

  const handleProcessPayment = async () => {
    const nowObj = new Date();
    const orderIdStr = `INV-${nowObj.getTime().toString().slice(-6)}`;
    const queueNoStr = `#${String(orderQueueCount).padStart(2, "0")}`;

    let payMethodLabel = "เงินสด";
    if (paymentMethod === "qr") {
      payMethodLabel = "สแกน QR Code";
    }

    const newOrderObj = {
      id: orderIdStr,
      queue_no: queueNoStr,
      customer_name: customerName.trim(),
      total: total,
      discount: effectiveDiscount,
      status: "pending",
      order_type: orderType,
      payment_method: payMethodLabel,
      items: cart
    };

    try {
      await supabase.from("orders").insert([newOrderObj]);
      await fetchAllData();
    } catch (err) {
      console.error("Error creating order:", err);
    }

    setIsCheckoutOpen(false);
    setCart([]);
    setCashReceived("");
    setCustomerName("");
    setCustomDiscount(0);
    setSelectedPromo(null);
  };

  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    const targetOrder = kitchenOrders.find((o) => o.id === orderId);

    if (nextStatus === "completed") {
      if (targetOrder) {
        await deductInventoryStock(targetOrder.items);
      }
      try {
        await supabase.from("orders").update({ status: "completed" }).eq("id", orderId);
        await fetchAllData();
      } catch (err) {
        console.error("Error updating status to completed:", err);
      }
    } else if (nextStatus === "cancelled") {
      const orderQueueName = targetOrder ? targetOrder.queueNo : "";
      triggerConfirmation(
        "ยกเลิกคำสั่งซื้อ",
        `คุณต้องการยกเลิกคำสั่งซื้อ ${orderQueueName} ใช่หรือไม่? (จะไม่ทำการตัดสต็อกวัตถุดิบและไม่นำไปคิดยอดขาย)`,
        async () => {
          try {
            await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId);
            await fetchAllData();
          } catch (err) {
            console.error("Error cancelling order:", err);
          }
        }
      );
    } else {
      try {
        await supabase.from("orders").update({ status: nextStatus }).eq("id", orderId);
        await fetchAllData();
      } catch (err) {
        console.error("Error updating status:", err);
      }
    }
  };

  // ==========================================
  // INGREDIENTS ADMIN HANDLERS
  // ==========================================
  const handleSaveIngredient = async (e) => {
    e.preventDefault();
    if (ingNameInput === "") return;
    if (ingStockInput === "") return;

    let minStockVal = 100;
    if (ingMinStockInput !== "") {
      minStockVal = Number(ingMinStockInput);
    }

    const newIngObj = {
      id: `ing_${Date.now()}`,
      name: ingNameInput,
      stock: Number(ingStockInput),
      unit: ingUnitInput,
      min_stock: minStockVal
    };

    try {
      await supabase.from("ingredients").insert([newIngObj]);
      await fetchAllData();
    } catch (err) {
      console.error("Error adding ingredient:", err);
    }

    setIngNameInput("");
    setIngStockInput("");
    setIngUnitInput("กรัม");
    setIngMinStockInput("");
  };

  const handleAddIngredientStock = async (ingId, currentStock, ingName, unit) => {
    const addStr = prompt(`เติมจำนวน ${ingName} (${unit}):`, "1000");
    const addAmount = Number(addStr);
    if (addAmount && addAmount > 0) {
      try {
        await supabase.from("ingredients").update({ stock: currentStock + addAmount }).eq("id", ingId);
        await fetchAllData();
      } catch (err) {
        console.error("Error updating stock:", err);
      }
    }
  };

  const handleDeleteIngredient = (id) => {
    triggerConfirmation("ยืนยันการลบ", "คุณต้องการลบวัตถุดิบรายการนี้ใช่หรือไม่?", async () => {
      try {
        await supabase.from("ingredients").delete().eq("id", id);
        await fetchAllData();
      } catch (err) {
        console.error("Error deleting ingredient:", err);
      }
    });
  };

  // ==========================================
  // PROMOTIONS ADMIN HANDLERS
  // ==========================================
  const handleSavePromotion = async (e) => {
    e.preventDefault();
    if (promoCodeInput === "") return;
    if (promoValueInput === "") return;

    let minSpendVal = 0;
    if (promoMinSpendInput !== "") {
      minSpendVal = Number(promoMinSpendInput);
    }

    const newPromoObj = {
      id: `p_${Date.now()}`,
      code: promoCodeInput.toUpperCase(),
      name: promoNameInput,
      type: promoTypeInput,
      value: Number(promoValueInput),
      min_spend: minSpendVal,
      active: true
    };

    try {
      await supabase.from("promotions").insert([newPromoObj]);
      await fetchAllData();
    } catch (err) {
      console.error("Error adding promotion:", err);
    }

    setPromoCodeInput("");
    setPromoNameInput("");
    setPromoTypeInput("percent");
    setPromoValueInput("");
    setPromoMinSpendInput("");
  };

  const togglePromotionStatus = async (id, currentStatus) => {
    try {
      await supabase.from("promotions").update({ active: !currentStatus }).eq("id", id);
      await fetchAllData();
    } catch (err) {
      console.error("Error toggling promotion:", err);
    }
  };

  const handleDeletePromotion = (id) => {
    triggerConfirmation("ยืนยันการลบ", "คุณต้องการลบโปรโมชั่นนี้ใช่หรือไม่?", async () => {
      try {
        await supabase.from("promotions").delete().eq("id", id);
        await fetchAllData();
      } catch (err) {
        console.error("Error deleting promotion:", err);
      }
    });
  };

  // ==========================================
  // EXPENSES ADMIN HANDLERS
  // ==========================================
  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (expTitleInput === "") return;
    if (expAmountInput === "") return;

    const newExpObj = {
      id: `e_${Date.now()}`,
      title: expTitleInput,
      category: expCategoryInput,
      amount: Number(expAmountInput),
      date: expDateInput
    };

    try {
      await supabase.from("expenses").insert([newExpObj]);
      await fetchAllData();
    } catch (err) {
      console.error("Error saving expense:", err);
    }

    setExpTitleInput("");
    setExpCategoryInput("raw_material");
    setExpAmountInput("");
    setExpDateInput(new Date().toISOString().split("T")[0]);
  };

  const handleDeleteExpense = (id) => {
    triggerConfirmation("ยืนยันการลบ", "คุณต้องการลบรายการนี้ใช่หรือไม่?", async () => {
      try {
        await supabase.from("expenses").delete().eq("id", id);
        await fetchAllData();
      } catch (err) {
        console.error("Error deleting expense:", err);
      }
    });
  };

  // ==========================================
  // MENU ITEMS FORM SUB-HANDLERS
  // ==========================================
  const handleAddIngToSingleRecipe = () => {
    if (selectedIngForRecipe === "") return;
    if (recipeIngAmount === "") return;
    if (Number(recipeIngAmount) <= 0) return;

    const existingIdx = itemRecipeList.findIndex((r) => r.ingId === selectedIngForRecipe);
    const updatedRecipe = [...itemRecipeList];

    if (existingIdx !== -1) {
      updatedRecipe[existingIdx] = {
        ...updatedRecipe[existingIdx],
        amount: Number(recipeIngAmount)
      };
    } else {
      updatedRecipe.push({
        ingId: selectedIngForRecipe,
        amount: Number(recipeIngAmount)
      });
    }

    setItemRecipeList(updatedRecipe);
    setSelectedIngForRecipe("");
    setRecipeIngAmount("");
  };

  const handleRemoveIngFromSingleRecipe = (ingId) => {
    const updated = itemRecipeList.filter((r) => r.ingId !== ingId);
    setItemRecipeList(updated);
  };

  const handleAddNewSize = () => {
    if (newSizeName === "") return;
    if (newSizePrice === "") return;

    const newSizeObj = {
      id: `size_${Date.now()}`,
      name: newSizeName.trim(),
      price: Number(newSizePrice),
      recipe: []
    };

    setItemSizesList([...itemSizesList, newSizeObj]);
    setNewSizeName("");
    setNewSizePrice("");
  };

  const handleRemoveSize = (sizeIdx) => {
    triggerConfirmation("ลบขนาดสินค้า", "ต้องการลบขนาดสินค้านี้ใช่หรือไม่?", () => {
      const updated = itemSizesList.filter((_, idx) => idx !== sizeIdx);
      setItemSizesList(updated);
      if (selectedSizeIdxForRecipe >= sizeIdx && selectedSizeIdxForRecipe > 0) {
        setSelectedSizeIdxForRecipe(selectedSizeIdxForRecipe - 1);
      }
    });
  };

  const handleAddIngToSizeRecipe = () => {
    if (selectedIngForRecipe === "") return;
    if (recipeIngAmount === "") return;
    if (Number(recipeIngAmount) <= 0) return;
    if (itemSizesList.length === 0) return;

    const updatedSizes = [...itemSizesList];
    const targetSize = updatedSizes[selectedSizeIdxForRecipe];
    if (!targetSize) return;

    const sizeRecipe = targetSize.recipe || [];
    const existingIdx = sizeRecipe.findIndex((r) => r.ingId === selectedIngForRecipe);
    const updatedRecipe = [...sizeRecipe];

    if (existingIdx !== -1) {
      updatedRecipe[existingIdx] = {
        ...updatedRecipe[existingIdx],
        amount: Number(recipeIngAmount)
      };
    } else {
      updatedRecipe.push({
        ingId: selectedIngForRecipe,
        amount: Number(recipeIngAmount)
      });
    }

    updatedSizes[selectedSizeIdxForRecipe] = {
      ...targetSize,
      recipe: updatedRecipe
    };

    setItemSizesList(updatedSizes);
    setSelectedIngForRecipe("");
    setRecipeIngAmount("");
  };

  const handleRemoveIngFromSizeRecipe = (sizeIdx, ingId) => {
    const updatedSizes = [...itemSizesList];
    const targetSize = updatedSizes[sizeIdx];
    if (!targetSize) return;

    const updatedRecipe = (targetSize.recipe || []).filter((r) => r.ingId !== ingId);
    updatedSizes[sizeIdx] = {
      ...targetSize,
      recipe: updatedRecipe
    };

    setItemSizesList(updatedSizes);
  };

  const addSweetnessOption = () => {
    const val = newSweetnessInput.trim();
    if (val === "") return;

    let currentArray = [];
    if (itemSweetnessTextInput !== "") {
      const parts = itemSweetnessTextInput.split(",");
      for (let i = 0; i < parts.length; i++) {
        currentArray.push(parts[i].trim());
      }
    }
    currentArray.push(val);
    setItemSweetnessTextInput(currentArray.join(", "));
    setNewSweetnessInput("");
  };

  const addCoffeeRoastOption = () => {
    const val = newCoffeeRoastInput.trim();
    if (val === "") return;

    let currentArray = [];
    if (itemCoffeeRoastTextInput !== "") {
      const parts = itemCoffeeRoastTextInput.split(",");
      for (let i = 0; i < parts.length; i++) {
        currentArray.push(parts[i].trim());
      }
    }
    currentArray.push(val);
    setItemCoffeeRoastTextInput(currentArray.join(", "));
    setNewCoffeeRoastInput("");
  };

  const addMilkOption = () => {
    const val = newMilkInput.trim();
    if (val === "") return;

    let currentArray = [];
    if (itemMilkTextInput !== "") {
      const parts = itemMilkTextInput.split(",");
      for (let i = 0; i < parts.length; i++) {
        currentArray.push(parts[i].trim());
      }
    }
    currentArray.push(val);
    setItemMilkTextInput(currentArray.join(", "));
    setNewMilkInput("");
  };

  const handleAddAddonOption = () => {
    if (addonNameInput === "") return;
    const priceNum = Number(addonPriceInput) || 0;

    let addonString = `${addonNameInput} (+${priceNum})`;
    if (selectedAddonIngInput !== "" && addonIngAmountInput !== "") {
      addonString = `${addonString} [${selectedAddonIngInput}:${addonIngAmountInput}]`;
    }

    let currentArray = [];
    if (itemAddonsTextInput !== "") {
      const parts = itemAddonsTextInput.split(",");
      for (let i = 0; i < parts.length; i++) {
        currentArray.push(parts[i].trim());
      }
    }
    currentArray.push(addonString);
    setItemAddonsTextInput(currentArray.join(", "));

    setAddonNameInput("");
    setAddonPriceInput("");
    setSelectedAddonIngInput("");
    setAddonIngAmountInput("");
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (itemNameInput === "") return;

    let basePrice = Number(itemPriceInput) || 0;
    if (hasMultipleSizes === true && itemSizesList.length > 0) {
      basePrice = itemSizesList[0].price;
    }

    const sweetnessOptions = [];
    if (itemSweetnessTextInput !== "") {
      const swParts = itemSweetnessTextInput.split(",");
      for (let i = 0; i < swParts.length; i++) {
        const trimmed = swParts[i].trim();
        if (trimmed !== "") sweetnessOptions.push(trimmed);
      }
    }

    const coffeeRoastOptions = [];
    if (itemCoffeeRoastTextInput !== "") {
      const roastParts = itemCoffeeRoastTextInput.split(",");
      for (let i = 0; i < roastParts.length; i++) {
        const trimmed = roastParts[i].trim();
        if (trimmed !== "") coffeeRoastOptions.push(trimmed);
      }
    }

    const milkOptions = [];
    if (itemMilkTextInput !== "") {
      const milkParts = itemMilkTextInput.split(",");
      for (let i = 0; i < milkParts.length; i++) {
        const m = milkParts[i];
        const match = m.match(/(.+)\s*\(\+(\d+)\)/);
        if (match) {
          milkOptions.push({
            id: `m_${i}_${Date.now()}`,
            label: match[1].trim(),
            price: Number(match[2])
          });
        } else {
          const trimmedLabel = m.trim();
          if (trimmedLabel !== "") {
            milkOptions.push({
              id: `m_${i}_${Date.now()}`,
              label: trimmedLabel,
              price: 0
            });
          }
        }
      }
    }

    const addons = [];
    if (itemAddonsTextInput !== "") {
      const addonParts = itemAddonsTextInput.split(",");
      for (let i = 0; i < addonParts.length; i++) {
        const a = addonParts[i];
        const match = a.match(/(.+)\s*\(\+(\d+)\)(?:\s*\[(.+):(\d+)\])?/);
        if (match) {
          addons.push({
            id: `a_${i}_${Date.now()}`,
            label: match[1].trim(),
            price: Number(match[2]),
            ingId: match[3] ? match[3].trim() : null,
            amount: match[4] ? Number(match[4]) : 0
          });
        } else {
          const trimmedLabel = a.trim();
          if (trimmedLabel !== "") {
            addons.push({
              id: `a_${i}_${Date.now()}`,
              label: trimmedLabel,
              price: 0
            });
          }
        }
      }
    }

    let finalImage = itemImageInput;
    if (finalImage === "") {
      finalImage = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400";
    }

    const itemPayload = {
      name: itemNameInput,
      price: basePrice,
      category: itemCategoryInput,
      sub_category: itemSubCategoryInput,
      image: finalImage,
      in_stock: itemInStockInput,
      sweetness_options: sweetnessOptions,
      coffee_roast_options: coffeeRoastOptions,
      milk_options: milkOptions,
      addons: addons,
      recipe: hasMultipleSizes ? [] : itemRecipeList,
      sizes: hasMultipleSizes ? itemSizesList : []
    };

    try {
      if (editingItem) {
        await supabase.from("menu_items").update(itemPayload).eq("id", editingItem.id);
      } else {
        await supabase.from("menu_items").insert([itemPayload]);
      }
      await fetchAllData();
    } catch (err) {
      console.error("Save item failed:", err);
    }

    // Reset Form
    setEditingItem(null);
    setHasMultipleSizes(false);
    setItemNameInput("");
    setItemPriceInput("");
    setItemCategoryInput("coffee");
    setItemSubCategoryInput("hot");
    setItemImageInput("");
    setItemInStockInput(true);
    setItemSweetnessTextInput("100%, 50%, 0%");
    setItemCoffeeRoastTextInput("คั่วอ่อน, คั่วกลาง (Standard), คั่วเข้ม");
    setItemMilkTextInput("นมสดธรรมดา (+0)");
    setItemAddonsTextInput("เพิ่ม Shot กาแฟ (+25)");
    setItemRecipeList([]);
    setItemSizesList([]);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    const itemSizes = item.sizes || [];
    setHasMultipleSizes(itemSizes.length > 0);

    setItemNameInput(item.name);
    setItemPriceInput(item.price);
    setItemCategoryInput(item.category);
    setItemSubCategoryInput(item.sub_category || item.subCategory || "all");
    setItemImageInput(item.image);
    setItemInStockInput(item.in_stock ?? item.inStock ?? true);

    const swOpts = item.sweetness_options || item.sweetnessOptions;
    if (swOpts) {
      setItemSweetnessTextInput(swOpts.join(", "));
    } else {
      setItemSweetnessTextInput("");
    }

    const roastOpts = item.coffee_roast_options || item.coffeeRoastOptions;
    if (roastOpts) {
      setItemCoffeeRoastTextInput(roastOpts.join(", "));
    } else {
      setItemCoffeeRoastTextInput("คั่วอ่อน, คั่วกลาง (Standard), คั่วเข้ม");
    }

    const milkOpts = item.milk_options || item.milkOptions;
    if (milkOpts) {
      const milkStrs = milkOpts.map((m) => `${m.label} (+${m.price})`);
      setItemMilkTextInput(milkStrs.join(", "));
    } else {
      setItemMilkTextInput("");
    }

    if (item.addons) {
      const addonStrs = item.addons.map((a) => {
        if (a.ingId && a.amount) {
          return `${a.label} (+${a.price}) [${a.ingId}:${a.amount}]`;
        }
        return `${a.label} (+${a.price})`;
      });
      setItemAddonsTextInput(addonStrs.join(", "));
    } else {
      setItemAddonsTextInput("");
    }

    setItemRecipeList(item.recipe || []);
    setItemSizesList(itemSizes);
  };

  const handleDeleteItem = (id) => {
    triggerConfirmation("ยืนยันการลบ", "คุณต้องการลบรายการสินค้านี้ใช่หรือไม่?", async () => {
      try {
        await supabase.from("menu_items").delete().eq("id", id);
        await fetchAllData();
      } catch (err) {
        console.error("Delete item failed:", err);
      }
    });
  };

  // ==========================================
  // DASHBOARD CALCULATIONS
  // ==========================================
  const monthNamesTh = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const daysInSelectedMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const handleResetToToday = () => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
    setSelectedDay(String(now.getDate()));
  };

  const isOrderInSelectedRange = (order) => {
    const d = order.createdAt ? new Date(order.createdAt) : new Date();
    const isYearMatch = d.getFullYear() === Number(selectedYear);
    const isMonthMatch = d.getMonth() === Number(selectedMonth);
    let isDayMatch = true;
    if (selectedDay !== "") {
      isDayMatch = d.getDate() === Number(selectedDay);
    }
    return isYearMatch && isMonthMatch && isDayMatch;
  };

  const isExpenseInSelectedRange = (exp) => {
    const d = new Date(exp.date);
    const isYearMatch = d.getFullYear() === Number(selectedYear);
    const isMonthMatch = d.getMonth() === Number(selectedMonth);
    let isDayMatch = true;
    if (selectedDay !== "") {
      isDayMatch = d.getDate() === Number(selectedDay);
    }
    return isYearMatch && isMonthMatch && isDayMatch;
  };

  const validOrderHistory = orderHistory.filter((o) => o.status !== "cancelled");
  const filteredDashboardOrders = validOrderHistory.filter(isOrderInSelectedRange);
  const filteredDashboardExpenses = expenses.filter(isExpenseInSelectedRange);

  let filterRevenue = 0;
  for (let i = 0; i < filteredDashboardOrders.length; i++) {
    filterRevenue += filteredDashboardOrders[i].total;
  }

  let filterExpenses = 0;
  for (let i = 0; i < filteredDashboardExpenses.length; i++) {
    filterExpenses += filteredDashboardExpenses[i].amount;
  }

  const filterNetProfit = filterRevenue - filterExpenses;
  const filterOrdersCount = filteredDashboardOrders.length;
  let filterAvgValue = 0;
  if (filterOrdersCount > 0) {
    filterAvgValue = filterRevenue / filterOrdersCount;
  }

  const isTodayDate = (d) => {
    const now = new Date();
    if (d.getFullYear() !== now.getFullYear()) return false;
    if (d.getMonth() !== now.getMonth()) return false;
    if (d.getDate() !== now.getDate()) return false;
    return true;
  };

  const todayOrders = validOrderHistory.filter((o) => {
    const d = o.createdAt ? new Date(o.createdAt) : new Date();
    return isTodayDate(d);
  });

  const todayExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return isTodayDate(d);
  });

  let todayRevenue = 0;
  for (let i = 0; i < todayOrders.length; i++) {
    todayRevenue += todayOrders[i].total;
  }

  let todayExpensesTotal = 0;
  for (let i = 0; i < todayExpenses.length; i++) {
    todayExpensesTotal += todayExpenses[i].amount;
  }

  const todayOrdersCount = todayOrders.length;

  let todayItemsSold = 0;
  for (let i = 0; i < todayOrders.length; i++) {
    const items = todayOrders[i].items;
    for (let j = 0; j < items.length; j++) {
      todayItemsSold += items[j].qty;
    }
  }

  let totalExpensesAll = 0;
  for (let i = 0; i < expenses.length; i++) {
    totalExpensesAll += expenses[i].amount;
  }

  const getDailyBreakdownForSelectedMonth = () => {
    const dailyData = [];
    for (let day = 1; day <= daysInSelectedMonth; day++) {
      const dayOrders = validOrderHistory.filter((o) => {
        const d = o.createdAt ? new Date(o.createdAt) : new Date();
        return (
          d.getFullYear() === Number(selectedYear) &&
          d.getMonth() === Number(selectedMonth) &&
          d.getDate() === day
        );
      });

      const dayExpensesList = expenses.filter((e) => {
        const d = new Date(e.date);
        return (
          d.getFullYear() === Number(selectedYear) &&
          d.getMonth() === Number(selectedMonth) &&
          d.getDate() === day
        );
      });

      let rev = 0;
      for (let o = 0; o < dayOrders.length; o++) {
        rev += dayOrders[o].total;
      }

      let exp = 0;
      for (let e = 0; e < dayExpensesList.length; e++) {
        exp += dayExpensesList[e].amount;
      }

      dailyData.push({
        day: day,
        revenue: rev,
        expense: exp,
        profit: rev - exp,
        ordersCount: dayOrders.length
      });
    }
    return dailyData;
  };

  const dailyBreakdown = getDailyBreakdownForSelectedMonth();

  const catSales = { coffee: 0, "non-coffee": 0, bakery: 0 };
  for (let o = 0; o < filteredDashboardOrders.length; o++) {
    const items = filteredDashboardOrders[o].items;
    for (let i = 0; i < items.length; i++) {
      const cat = items[i].category || "coffee";
      catSales[cat] = (catSales[cat] || 0) + items[i].unitPrice * items[i].qty;
    }
  }

  const getItemSalesFiltered = () => {
    const salesMap = {};
    for (let o = 0; o < filteredDashboardOrders.length; o++) {
      const items = filteredDashboardOrders[o].items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!salesMap[item.name]) {
          salesMap[item.name] = {
            name: item.name,
            qty: 0,
            revenue: 0,
            image: item.image,
            category: item.category
          };
        }
        salesMap[item.name].qty += item.qty;
        salesMap[item.name].revenue += item.unitPrice * item.qty;
      }
    }
    return Object.values(salesMap).sort((a, b) => b.qty - a.qty);
  };

  const filteredBestSellers = getItemSalesFiltered();

  const getWeeklySalesData = () => {
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสฯ", "ศุกร์", "เสาร์"];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("th-TH");
      let dayName = days[d.getDay()];
      if (i === 0) dayName = "วันนี้";

      let daySales = 0;
      for (let o = 0; o < validOrderHistory.length; o++) {
        if (validOrderHistory[o].date === dateStr) {
          daySales += validOrderHistory[o].total;
        }
      }

      result.push({ day: dayName, sales: daySales, date: dateStr });
    }
    return result;
  };

  const weeklySalesData = getWeeklySalesData();
  let maxWeeklySale = 1000;
  for (let i = 0; i < weeklySalesData.length; i++) {
    if (weeklySalesData[i].sales > maxWeeklySale) {
      maxWeeklySale = weeklySalesData[i].sales;
    }
  }

  const getMonthlySalesData = () => {
    const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - i);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();

      let monthSales = 0;
      for (let o = 0; o < validOrderHistory.length; o++) {
        const orderDate = validOrderHistory[o].createdAt ? new Date(validOrderHistory[o].createdAt) : new Date();
        if (orderDate.getFullYear() === targetYear && orderDate.getMonth() === targetMonth) {
          monthSales += validOrderHistory[o].total;
        }
      }

      result.push({ monthName: monthNames[targetMonth], sales: monthSales });
    }
    return result;
  };

  const monthlySalesData = getMonthlySalesData();
  let maxMonthlySale = 2000;
  for (let i = 0; i < monthlySalesData.length; i++) {
    if (monthlySalesData[i].sales > maxMonthlySale) {
      maxMonthlySale = monthlySalesData[i].sales;
    }
  }

  const activeCategoryObj = initialCategories.find((c) => c.id === selectedCategory);
  const adminSelectedCategoryObj = initialCategories.find((c) => c.id === itemCategoryInput);

  const filteredItems = menuItems.filter((item) => {
    const subCat = item.sub_category || item.subCategory;
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === "all" || !selectedSubCategory || subCat === selectedSubCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  // กรองรายการสินค้าในหน้า Admin Panel ตามหมวดหมู่ที่เลือก
  const adminFilteredMenuItems = menuItems.filter((item) => {
    if (adminFilterCategory === "all") return true;
    return item.category === adminFilterCategory;
  });

  return (
    <div className="flex h-screen bg-[#FAF7F2] text-[#2D2422] font-sans antialiased overflow-hidden selection:bg-[#800020] selection:text-white">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-receipt-modal, #thermal-receipt-modal * {
            visibility: visible;
          }
          #thermal-receipt-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Sidebar Navigation */}
      <aside className="w-22 bg-gradient-to-b from-[#4A0013] via-[#1E293B] to-[#0F172A] flex flex-col items-center py-7 justify-between text-[#FAF7F2] z-30 shrink-0 shadow-2xl border-r border-[#800020]/30">
        <div className="flex flex-col items-center gap-9 w-full px-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4AF37] via-[#800020] to-[#F59E0B] rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative p-3 bg-[#334155] text-[#D4AF37] rounded-2xl flex items-center justify-center shadow-2xl border border-[#D4AF37]/30">
              <Coffee size={24} className="text-[#D4AF37] transform group-hover:scale-110 transition duration-300 relative z-10" />
            </div>
          </div>

          <nav className="flex flex-col gap-4 w-full items-center">
            <button
              onClick={() => setActiveTab("pos")}
              title="หน้าขาย (POS)"
              className={`p-3.5 rounded-2xl transition duration-300 cursor-pointer relative group ${
                activeTab === "pos"
                  ? "bg-gradient-to-br from-[#800020] to-[#5C0017] text-white shadow-lg shadow-[#800020]/50 -translate-y-0.5 border border-[#D4AF37]/40"
                  : "text-[#94A3B8] hover:bg-[#334155] hover:text-white"
              }`}
            >
              <ShoppingBag size={21} />
              {activeTab === "pos" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#D4AF37] rounded-l-full shadow-glow"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("kitchen")}
              title="จอแสดงผลในครัว (Kitchen Display)"
              className={`p-3.5 rounded-2xl transition duration-300 cursor-pointer relative group ${
                activeTab === "kitchen"
                  ? "bg-gradient-to-br from-[#800020] to-[#5C0017] text-white shadow-lg shadow-[#800020]/50 -translate-y-0.5 border border-[#D4AF37]/40"
                  : "text-[#94A3B8] hover:bg-[#334155] hover:text-white"
              }`}
            >
              <UtensilsCrossed size={21} />
              {kitchenOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md border-2 border-[#1E293B]">
                  {kitchenOrders.length}
                </span>
              )}
              {activeTab === "kitchen" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#D4AF37] rounded-l-full shadow-glow"></span>
              )}
            </button>

            <button
              onClick={() => handleProtectedTabClick("dashboard")}
              title="แดชบอร์ด & ประวัติคำสั่งซื้อ"
              className={`p-3.5 rounded-2xl transition duration-300 cursor-pointer relative group ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-br from-[#800020] to-[#5C0017] text-white shadow-lg shadow-[#800020]/50 -translate-y-0.5 border border-[#D4AF37]/40"
                  : "text-[#94A3B8] hover:bg-[#334155] hover:text-white"
              }`}
            >
              <LayoutDashboard size={21} />
              {!isManagementAuthenticated && (
                <Lock size={11} className="absolute top-2 right-2 text-[#F59E0B]" />
              )}
              {activeTab === "dashboard" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#D4AF37] rounded-l-full shadow-glow"></span>
              )}
            </button>

            <button
              onClick={() => handleProtectedTabClick("admin")}
              title="จัดการระบบ Admin Panel"
              className={`p-3.5 rounded-2xl transition duration-300 cursor-pointer relative group ${
                activeTab === "admin"
                  ? "bg-gradient-to-br from-[#800020] to-[#5C0017] text-white shadow-lg shadow-[#800020]/50 -translate-y-0.5 border border-[#D4AF37]/40"
                  : "text-[#94A3B8] hover:bg-[#334155] hover:text-white"
              }`}
            >
              <Settings size={21} />
              {!isManagementAuthenticated && (
                <Lock size={11} className="absolute top-2 right-2 text-[#F59E0B]" />
              )}
              {activeTab === "admin" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#D4AF37] rounded-l-full shadow-glow"></span>
              )}
            </button>
          </nav>
        </div>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          title="ออกจากระบบ"
          className="p-3.5 text-[#94A3B8] hover:text-[#EF4444] rounded-2xl cursor-pointer transition duration-300 hover:bg-[#334155]"
        >
          <LogOut size={20} />
        </button>
      </aside>

      {/* POS Screen */}
      {activeTab === "pos" && (
        <>
          <main className="flex-1 flex flex-col p-8 overflow-hidden bg-[#FAF7F2]">
            <header className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-[#800020] tracking-tight flex items-center gap-2">
                    SWEET GEAR CAFE
                  </h1>
                  <span className="bg-gradient-to-r from-[#800020] via-[#A31C38] to-[#1E293B] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-[#D4AF37]/30 shadow-xs flex items-center gap-1">
                    <HeartHandshake size={11} className="text-[#D4AF37]" /> วิศวะสายหวาน
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#64748B] mt-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                  คิวถัดไป:{" "}
                  <span className="font-extrabold text-[#800020]">
                    #{String(orderQueueCount).padStart(2, "0")}
                  </span>{" "}
                  <span className="text-[#CBD5E1]">|</span> บาริสต้า: COE Engineer #01
                </p>
              </div>

              <div className="relative w-84">
                <Search className="absolute left-4 top-3.5 text-[#94A3B8]" size={17} />
                <input
                  type="text"
                  placeholder="ค้นหาเมนูกาแฟ เครื่องดื่ม เบเกอรี..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/90 backdrop-blur-md rounded-2xl border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent shadow-xs text-xs font-semibold transition placeholder:text-[#94A3B8]"
                />
              </div>
            </header>

            <div className="flex gap-3 mb-3">
              {initialCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubCategory("all");
                  }}
                  className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-[#800020] text-white shadow-lg shadow-[#800020]/25 border border-[#800020] -translate-y-0.5"
                      : "bg-white text-[#334155] hover:bg-[#FEF3C7] border border-[#E2E8F0] shadow-xs"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {activeCategoryObj?.subCategories && (
              <div className="flex gap-2 mb-6 pl-1 animate-fadeIn">
                {activeCategoryObj.subCategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubCategory(sub.id)}
                    className={`px-4 py-1.5 rounded-xl text-[11px] font-bold transition duration-200 cursor-pointer ${
                      selectedSubCategory === sub.id
                        ? "bg-[#1E293B] text-[#D4AF37] shadow-xs"
                        : "bg-[#FEF3C7]/60 text-[#B45309] hover:bg-[#FEF3C7] border border-[#F59E0B]/20"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-3 gap-6 auto-rows-max pb-4">
                {filteredItems.map((item) => {
                  const inStock = isItemInStock(item);
                  const hasSizes = item.sizes && item.sizes.length > 0;
                  const displayPrice = hasSizes
                    ? `฿${item.sizes[0].price}+`
                    : `฿${Number(item.price).toFixed(2)}`;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`bg-white rounded-3xl p-4 border border-[#E2E8F0] hover:border-[#800020] transition-all duration-300 flex flex-col justify-between group h-68 relative overflow-hidden shadow-xs hover:shadow-xl ${
                        inStock
                          ? "cursor-pointer hover:-translate-y-1.5"
                          : "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {!inStock && (
                        <span className="absolute top-3 right-3 bg-[#EF4444] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full z-10 shadow-md uppercase tracking-wider">
                          {!(item.in_stock ?? item.inStock) ? "สินค้าหมด" : "วัตถุดิบหมด"}
                        </span>
                      )}

                      <div className="w-full h-38 rounded-2xl overflow-hidden mb-3 bg-[#F1F5F9] shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                        {hasSizes && (
                          <span className="absolute bottom-2.5 left-2.5 bg-[#1E293B]/80 text-[#D4AF37] text-[10px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-xs flex items-center gap-1 border border-[#D4AF37]/30">
                            <Maximize2 size={10} /> {item.sizes.length} ขนาด
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col justify-between flex-1">
                        <h3 className="font-extrabold text-[#0F172A] text-xs line-clamp-1 group-hover:text-[#800020] transition duration-200">
                          {item.name}
                        </h3>
                        <div className="flex justify-between items-center mt-2.5">
                          <p className="text-[#800020] font-black text-base">
                            {displayPrice}
                          </p>
                          <span className="w-7 h-7 bg-[#FEF3C7] text-[#800020] group-hover:bg-[#800020] group-hover:text-white rounded-xl flex items-center justify-center transition duration-300 shadow-xs">
                            <Plus size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>

          {/* Cart Panel */}
          <aside className="w-100 bg-white border-l border-[#E2E8F0] p-7 flex flex-col justify-between shadow-2xl shrink-0 z-10">
            <div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#F1F5F9]">
                <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#800020]" /> ตะกร้าสินค้า
                </h2>
                <span className="text-xs font-black text-[#800020] bg-[#FEF3C7] px-3.5 py-1 rounded-full border border-[#800020]/20">
                  {cart.reduce((a, i) => a + i.qty, 0)} รายการ
                </span>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-3 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ชื่อลูกค้า / เลขโต๊ะ (ถ้ามี)..."
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A] outline-none focus:ring-2 focus:ring-[#800020]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[36vh] space-y-3 pr-1 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-[#94A3B8]">
                    <Sparkle size={36} className="mx-auto mb-3 text-[#800020]/30 animate-pulse" />
                    <p className="text-xs font-bold text-[#64748B]">ยังไม่มีรายการในตะกร้า</p>
                    <p className="text-[11px] text-[#94A3B8] mt-1">เลือกเมนูกาแฟหรือเบเกอรีด้านซ้ายมือ</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="flex justify-between items-center bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E2E8F0] hover:border-[#800020] transition duration-200 shadow-xs relative group"
                    >
                      <div className="max-w-[170px]">
                        <p className="font-extrabold text-[#0F172A] text-xs">{item.name}</p>
                        <p className="text-[10px] font-semibold text-[#64748B] truncate mt-0.5">{item.optionsText}</p>

                        {item.noteText && (
                          <p className="text-[10px] font-bold text-[#800020] bg-[#FEF3C7] px-2 py-0.5 rounded-md mt-1 italic w-fit flex items-center gap-1 border border-[#800020]/10">
                            <FileText size={10} /> {item.noteText}
                          </p>
                        )}

                        <p className="text-xs text-[#800020] font-black mt-1.5">฿{item.unitPrice}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditCartItem(item)}
                          title="แก้ไขตัวเลือก"
                          className="p-1.5 text-[#64748B] hover:text-[#800020] bg-white hover:bg-[#FEF3C7] rounded-lg border border-[#E2E8F0] transition cursor-pointer"
                        >
                          <Edit3 size={12} />
                        </button>

                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-[#E2E8F0] shadow-xs">
                          <button
                            onClick={() => updateCartQuantity(item.cartId, -1)}
                            className="text-[#94A3B8] hover:text-[#EF4444] cursor-pointer transition"
                          >
                            <Trash2 size={13} />
                          </button>
                          <span className="text-xs font-black w-4 text-center text-[#0F172A]">{item.qty}</span>
                          <button
                            onClick={() => updateCartQuantity(item.cartId, 1)}
                            className="text-[#94A3B8] hover:text-[#800020] cursor-pointer transition"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                  <label className="text-[11px] font-extrabold text-[#64748B] mb-2 flex items-center gap-1.5">
                    <Tag size={13} className="text-[#800020]" /> เลือกโปรโมชั่น
                  </label>
                  <select
                    value={selectedPromo ? selectedPromo.id : ""}
                    onChange={(e) => {
                      const promo = promotions.find((p) => p.id === e.target.value);
                      setSelectedPromo(promo || null);
                    }}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0F172A] outline-none shadow-xs focus:ring-2 focus:ring-[#800020]"
                  >
                    <option value="">-- ไม่ใช้โปรโมชั่น --</option>
                    {promotions
                      .filter((p) => p.active)
                      .map((p) => {
                        const minSpend = p.min_spend ?? p.minSpend ?? 0;
                        return (
                          <option key={p.id} value={p.id} disabled={subtotal < minSpend}>
                            {p.code} - {p.name} ({p.type === "percent" ? `${p.value}%` : `฿${p.value}`})
                            {subtotal < minSpend ? ` [ขั้นต่ำ ฿${minSpend}]` : ""}
                          </option>
                        );
                      })}
                  </select>
                </div>
              )}
            </div>

            <div className="border-t border-[#F1F5F9] pt-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#64748B]">
                <span>ยอดรวม (Subtotal)</span>
                <span>฿{subtotal.toFixed(2)}</span>
              </div>
              {effectiveDiscount > 0 && (
                <div className="flex justify-between text-xs font-extrabold text-[#EF4444]">
                  <span>ส่วนลดโปรโมชั่น/พิเศษ</span>
                  <span>-฿{effectiveDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#0F172A] pt-2 border-t border-[#E2E8F0]">
                <span>ยอดรวมสุทธิ (รวม VAT)</span>
                <span className="text-[#800020] text-lg">฿{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-[#94A3B8]">
                <span>(รวมภาษีมูลค่าเพิ่ม 7%)</span>
                <span>฿{vat.toFixed(2)}</span>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full mt-3 bg-gradient-to-r from-[#800020] to-[#5C0017] hover:from-[#66001A] hover:to-[#400010] disabled:bg-[#E2E8F0] disabled:text-[#94A3B8] text-white font-black py-4 rounded-2xl shadow-lg shadow-[#800020]/20 flex justify-center items-center gap-2 transition duration-300 cursor-pointer text-xs uppercase tracking-wider"
              >
                <CreditCard size={17} /> ชำระเงิน (฿{total.toFixed(2)})
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Kitchen Display Screen */}
      {activeTab === "kitchen" && (
        <main className="flex-1 p-8 bg-[#0F172A] text-white overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-8 border-b border-[#334155] pb-5">
            <div>
              <div className="flex items-center gap-3">
                <UtensilsCrossed size={32} className="text-[#D4AF37]" />
                <h1 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
                  SWEET GEAR Kitchen & Barista Monitor
                </h1>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1 font-medium">
                วัตถุดิบจะถูกตัดสต็อกจริงตามสูตรขนาดแก้วเมื่อกด "ทำเสร็จสิ้น" เท่านั้น
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-[#1E293B] border border-[#334155] px-5 py-2.5 rounded-2xl text-xs font-bold text-[#D4AF37] flex items-center gap-2 shadow-inner">
                <Clock size={18} /> กำลังรอทำ: {kitchenOrders.length} ออเดอร์
              </span>
            </div>
          </div>

          {kitchenOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-[#64748B]">
              <CheckCircle2 size={64} className="mb-3 text-[#D4AF37]/30" />
              <p className="text-lg font-extrabold text-white">ไม่มีรายการค้างในครัว</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 items-start">
              {kitchenOrders.map((order) => {
                const coffeeItems = order.items.filter((i) => i.category === "coffee");
                const nonCoffeeItems = order.items.filter((i) => i.category === "non-coffee");
                const bakeryItems = order.items.filter((i) => i.category === "bakery");
                const isPreparing = order.status === "preparing";

                return (
                  <div
                    key={order.id}
                    className={`bg-[#1E293B] rounded-3xl border flex flex-col justify-between overflow-hidden shadow-2xl h-[550px] transition-all duration-300 ${
                      isPreparing ? "border-[#800020] ring-2 ring-[#800020]/50" : "border-[#334155]"
                    }`}
                  >
                    <div
                      className={`p-4.5 flex justify-between items-center shrink-0 ${
                        isPreparing ? "bg-gradient-to-r from-[#800020] to-[#5C0017] text-white" : "bg-[#0F172A] text-[#F8FAFC]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-2xl tracking-tight">{order.queueNo}</span>
                          {order.customerName && (
                            <span className="text-xs font-bold bg-[#D4AF37] text-[#0F172A] px-2 py-0.5 rounded-md truncate max-w-[100px]">
                              {order.customerName}
                            </span>
                          )}
                          <span className="text-[10px] bg-black/40 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {order.orderType === "Dine-in" ? "ทานที่ร้าน" : order.orderType === "Takeaway" ? "กลับบ้าน" : "เดลิเวอรี"}
                          </span>
                        </div>
                        <p className="text-[10px] opacity-80 mt-0.5 font-medium">
                          {order.id} • {order.time}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                          isPreparing ? "bg-[#FEF3C7] text-[#800020] shadow-xs" : "bg-[#0F172A] text-[#D4AF37]"
                        }`}
                      >
                        {isPreparing ? "กำลังทำ" : "รอดำเนินการ"}
                      </span>
                    </div>

                    <div className="p-4.5 space-y-4 flex-1 overflow-y-auto bg-[#0F172A] custom-scrollbar">
                      {coffeeItems.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider mb-2 border-b border-[#334155] pb-1 flex justify-between">
                            <span>☕ COFFEE</span>
                            <span>{coffeeItems.length} รายการ</span>
                          </p>
                          <div className="space-y-2.5">
                            {coffeeItems.map((item, idx) => (
                              <div key={idx} className="bg-[#FAF7F2] text-[#0F172A] p-3 rounded-2xl border border-[#E2E8F0] shadow-xs">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-extrabold text-xs leading-snug">{item.name}</span>
                                  <span className="bg-[#800020] text-white text-xs font-black px-2 py-0.5 rounded-lg shrink-0">x{item.qty}</span>
                                </div>
                                <p className="text-[11px] font-bold text-[#64748B] mt-1">{item.optionsText}</p>
                                {item.noteText && (
                                  <p className="text-[11px] font-bold text-[#EF4444] bg-[#FEF2F2] p-1.5 rounded-lg mt-1.5 border border-[#FCA5A5] flex items-center gap-1">
                                    <FileText size={12} className="shrink-0" /> * {item.noteText}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {nonCoffeeItems.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider mb-2 border-b border-[#334155] pb-1 flex justify-between">
                            <span>🍵 NON-COFFEE</span>
                            <span>{nonCoffeeItems.length} รายการ</span>
                          </p>
                          <div className="space-y-2.5">
                            {nonCoffeeItems.map((item, idx) => (
                              <div key={idx} className="bg-[#FAF7F2] text-[#0F172A] p-3 rounded-2xl border border-[#E2E8F0] shadow-xs">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-extrabold text-xs leading-snug">{item.name}</span>
                                  <span className="bg-[#800020] text-white text-xs font-black px-2 py-0.5 rounded-lg shrink-0">x{item.qty}</span>
                                </div>
                                <p className="text-[11px] font-bold text-[#64748B] mt-1">{item.optionsText}</p>
                                {item.noteText && (
                                  <p className="text-[11px] font-bold text-[#EF4444] bg-[#FEF2F2] p-1.5 rounded-lg mt-1.5 border border-[#FCA5A5] flex items-center gap-1">
                                    <FileText size={12} className="shrink-0" /> * {item.noteText}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {bakeryItems.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider mb-2 border-b border-[#334155] pb-1 flex justify-between">
                            <span>🥐 BAKERY</span>
                            <span>{bakeryItems.length} รายการ</span>
                          </p>
                          <div className="space-y-2.5">
                            {bakeryItems.map((item, idx) => (
                              <div key={idx} className="bg-[#FAF7F2] text-[#0F172A] p-3 rounded-2xl border border-[#E2E8F0] shadow-xs">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-extrabold text-xs leading-snug">{item.name}</span>
                                  <span className="bg-[#800020] text-white text-xs font-black px-2 py-0.5 rounded-lg shrink-0">x{item.qty}</span>
                                </div>
                                {item.optionsText !== "ปกติ" && (
                                  <p className="text-[11px] font-bold text-[#64748B] mt-1">{item.optionsText}</p>
                                )}
                                {item.noteText && (
                                  <p className="text-[11px] font-bold text-[#EF4444] bg-[#FEF2F2] p-1.5 rounded-lg mt-1.5 border border-[#FCA5A5] flex items-center gap-1">
                                    <FileText size={12} className="shrink-0" /> * {item.noteText}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 bg-[#1E293B] border-t border-[#334155] shrink-0 space-y-2">
                      {order.status === "pending" ? (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                          className="w-full bg-[#800020] hover:bg-[#5C0017] text-white font-extrabold py-3 rounded-2xl text-xs transition cursor-pointer flex justify-center items-center gap-1.5 shadow-md uppercase tracking-wider"
                        >
                          ▶ เริ่มทำออเดอร์
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                          className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold py-3 rounded-2xl text-xs transition cursor-pointer flex justify-center items-center gap-1.5 shadow-md uppercase tracking-wider"
                        >
                          <Check size={16} /> ทำเสร็จสิ้น (ตัดสต็อกวัตถุดิบ)
                        </button>
                      )}

                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                        className="w-full bg-[#334155] hover:bg-[#EF4444] text-[#FCA5A5] hover:text-white border border-[#EF4444]/30 font-bold py-2 rounded-xl text-[11px] transition cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        <Ban size={13} /> ยกเลิกออเดอร์นี้ (ไม่คิดเงิน/ไม่ตัดสต็อก)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* Dashboard Screen */}
      {activeTab === "dashboard" && (
        <main className="flex-1 p-8 bg-[#FAF7F2] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-[#0F172A] flex items-center gap-2 tracking-tight">
                  <LayoutDashboard size={24} className="text-[#800020]" /> แดชบอร์ด & รายงานยอดขาย SWEET GEAR CAFE
                </h1>
                <span className="bg-[#D1FAE5] text-[#059669] text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 border border-[#10B981]/20 shadow-xs">
                  <CheckCircle2 size={12} /> ปลดล็อกรหัสแล้ว
                </span>
              </div>
              <p className="text-xs font-semibold text-[#64748B] mt-1">
                เลือกดูรายละเอียด ยอดขาย รายรับ-รายจ่าย ประจำวันและประจำเดือน
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleResetToToday}
                className="bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] font-black px-3.5 py-2.5 rounded-2xl text-xs transition border border-[#F59E0B]/20 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Calendar size={15} /> วันนี้ (ปัจจุบัน)
              </button>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-[#E2E8F0] px-3.5 py-2.5 rounded-2xl text-xs font-black text-[#0F172A] outline-none shadow-xs focus:ring-2 focus:ring-[#800020]"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>พ.ศ. {y + 543}</option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-white border border-[#E2E8F0] px-3.5 py-2.5 rounded-2xl text-xs font-black text-[#0F172A] outline-none shadow-xs focus:ring-2 focus:ring-[#800020]"
              >
                {monthNamesTh.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="bg-white border border-[#E2E8F0] px-3.5 py-2.5 rounded-2xl text-xs font-black text-[#0F172A] outline-none shadow-xs focus:ring-2 focus:ring-[#800020]"
              >
                <option value="">ทุกวัน (สรุปทั้งเดือน)</option>
                {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>วันที่ {d}</option>
                ))}
              </select>

              <button
                onClick={() => setIsShiftCloseOpen(true)}
                className="bg-[#800020] hover:bg-[#5C0017] text-white font-black px-4 py-2.5 rounded-2xl shadow-md transition flex items-center gap-2 text-xs cursor-pointer"
              >
                <Receipt size={16} /> สรุปยอดปิดกะประจำวัน
              </button>
            </div>
          </div>

          <div className="mb-6 bg-gradient-to-r from-[#FEF3C7]/60 to-[#FAF7F2] border border-[#800020]/20 p-3.5 rounded-2xl flex justify-between items-center text-xs shadow-xs">
            <span className="font-extrabold text-[#800020] flex items-center gap-2">
              <Filter size={15} /> แสดงผลข้อมูลของ:{" "}
              <span className="text-[#0F172A] font-black">
                {selectedDay ? `วันที่ ${selectedDay} ` : "รวมทั้งเดือน "}
                {monthNamesTh[selectedMonth]} {Number(selectedYear) + 543}
              </span>
            </span>
            {selectedDay !== "" && (
              <button
                onClick={() => setSelectedDay("")}
                className="text-[11px] text-[#800020] font-black underline hover:text-[#5C0017] cursor-pointer"
              >
                [แสดงทั้งเดือน]
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-5 mb-8">
            <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-wider mb-1">
                  {selectedDay ? "รายได้วันที่เลือก" : "รายได้รวมเดือนนี้"}
                </p>
                <h3 className="text-2xl font-black text-[#800020]">฿{filterRevenue.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-[#FEF3C7] text-[#B45309] rounded-2xl">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-wider mb-1">
                  {selectedDay ? "รายจ่ายวันที่เลือก" : "รายจ่ายรวมเดือนนี้"}
                </p>
                <h3 className="text-2xl font-black text-[#EF4444]">฿{filterExpenses.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-[#FEF2F2] text-[#EF4444] rounded-2xl">
                <Wallet size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-wider mb-1">
                  กำไรสุทธิ (Net Profit)
                </p>
                <h3 className={`text-2xl font-black ${filterNetProfit >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  ฿{filterNetProfit.toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-[#D1FAE5] text-[#10B981] rounded-2xl">
                <DollarSign size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-wider mb-1">จำนวนออเดอร์</p>
                <h3 className="text-2xl font-black text-[#0F172A]">
                  {filterOrdersCount} <span className="text-xs font-semibold text-[#64748B]">ออเดอร์</span>
                </h3>
              </div>
              <div className="p-3 bg-[#F1F5F9] text-[#334155] rounded-2xl">
                <ShoppingBag size={20} />
              </div>
            </div>

            <div className="bg-[#FEF3C7]/40 p-5 rounded-3xl border border-[#E2E8F0] shadow-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-[#64748B] uppercase tracking-wider mb-1">เฉลี่ย / ออเดอร์</p>
                <h3 className="text-2xl font-black text-[#0F172A]">฿{filterAvgValue.toFixed(0)}</h3>
              </div>
              <div className="p-3 bg-white text-[#800020] rounded-2xl shadow-xs">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs mb-8">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
                <Calendar size={17} className="text-[#800020]" />
                รายงานสรุปรายรับ - รายจ่าย รายวัน (ประจำเดือน {monthNamesTh[selectedMonth]} {Number(selectedYear) + 543})
              </h3>
              <span className="text-[11px] font-bold text-[#64748B]">คลิกเพื่อเลือกเจาะลึกดูสินค้าขายดีเฉพาะวันได้</span>
            </div>

            <div className="overflow-x-auto max-h-68 overflow-y-auto pr-1 custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-[#F1F5F9] text-[#64748B] font-bold uppercase">
                    <th className="pb-3">วันที่</th>
                    <th className="pb-3 text-center">จำนวนออเดอร์</th>
                    <th className="pb-3 text-right">รายรับ (ยอดขาย)</th>
                    <th className="pb-3 text-right">รายจ่าย</th>
                    <th className="pb-3 text-right">กำไร/ขาดทุนสุทธิ</th>
                    <th className="pb-3 text-center">การกระทำ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {dailyBreakdown.map((item) => (
                    <tr
                      key={item.day}
                      className={`hover:bg-[#FAF7F2] transition ${Number(selectedDay) === item.day ? "bg-[#FEF3C7]/50 font-bold" : ""}`}
                    >
                      <td className="py-2.5 font-bold text-[#0F172A]">
                        วันที่ {item.day} {monthNamesTh[selectedMonth]}
                      </td>
                      <td className="py-2.5 text-center text-[#64748B] font-semibold">{item.ordersCount} ออเดอร์</td>
                      <td className="py-2.5 text-right font-black text-[#800020]">฿{item.revenue.toFixed(2)}</td>
                      <td className="py-2.5 text-right font-black text-[#EF4444]">฿{item.expense.toFixed(2)}</td>
                      <td className={`py-2.5 text-right font-black ${item.profit >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                        ฿{item.profit.toFixed(2)}
                      </td>
                      <td className="py-2.5 text-center">
                        <button
                          onClick={() => setSelectedDay(String(item.day))}
                          className="text-[10px] bg-[#800020] text-white px-3 py-1 rounded-xl hover:bg-[#5C0017] transition cursor-pointer font-bold"
                        >
                          ดูสินค้าขายดีวันนี้
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
              <h3 className="text-sm font-black text-[#0F172A] mb-5 flex items-center gap-2">
                <BarChart3 size={17} className="text-[#800020]" /> ยอดขายย้อนหลัง 7 วันล่าสุด
              </h3>
              <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-[#F1F5F9] pb-2">
                {weeklySalesData.map((d, i) => {
                  const barHeightPct = maxWeeklySale > 0 ? (d.sales / maxWeeklySale) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-black text-[#800020] opacity-0 group-hover:opacity-100 transition duration-200">
                        ฿{d.sales}
                      </span>
                      <div className="w-full max-w-[36px] bg-[#F1F5F9] h-full rounded-t-xl overflow-hidden flex items-end">
                        <div
                          className="w-full bg-[#800020] group-hover:bg-[#5C0017] transition-all duration-500 rounded-t-xl"
                          style={{ height: `${Math.max(barHeightPct, 4)}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-extrabold text-[#64748B]">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
              <h3 className="text-sm font-black text-[#0F172A] mb-5 flex items-center gap-2">
                <Calendar size={17} className="text-[#1E293B]" /> ยอดขายย้อนหลัง 6 เดือน
              </h3>
              <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-[#F1F5F9] pb-2">
                {monthlySalesData.map((m, i) => {
                  const barHeightPct = maxMonthlySale > 0 ? (m.sales / maxMonthlySale) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-black text-[#1E293B] opacity-0 group-hover:opacity-100 transition duration-200">
                        ฿{m.sales}
                      </span>
                      <div className="w-full max-w-[36px] bg-[#F1F5F9] h-full rounded-t-xl overflow-hidden flex items-end">
                        <div
                          className="w-full bg-[#1E293B] group-hover:bg-[#0F172A] transition-all duration-500 rounded-t-xl"
                          style={{ height: `${Math.max(barHeightPct, 4)}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-extrabold text-[#64748B]">{m.monthName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
                  <Award size={17} className="text-[#800020]" /> ตารางอันดับเมนูยอดฮิต (Best Sellers)
                </h3>
                <span className="text-[11px] font-black text-[#800020] bg-[#FEF3C7] px-3.5 py-1 rounded-full border border-[#800020]/20">
                  {selectedDay ? `เฉพาะวันที่ ${selectedDay} ${monthNamesTh[selectedMonth]}` : `รวมทั้งเดือน ${monthNamesTh[selectedMonth]}`}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#F1F5F9] text-[#64748B] font-bold uppercase">
                      <th className="pb-3">อันดับ</th>
                      <th className="pb-3">สินค้า</th>
                      <th className="pb-3">หมวดหมู่</th>
                      <th className="pb-3 text-center">จำนวนที่ขาย</th>
                      <th className="pb-3 text-right">ยอดขายรวม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredBestSellers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-[#94A3B8]">
                          ไม่มีข้อมูลการขายในวันที่เลือก
                        </td>
                      </tr>
                    ) : (
                      filteredBestSellers.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF7F2]">
                          <td className="py-3 font-black text-[#800020]">#{idx + 1}</td>
                          <td className="py-3 flex items-center gap-3">
                            <img src={item.image} alt="" className="w-9 h-9 rounded-xl object-cover shadow-xs" />
                            <span className="font-bold text-[#0F172A]">{item.name}</span>
                          </td>
                          <td className="py-3 text-[#64748B] capitalize font-semibold">{item.category || "coffee"}</td>
                          <td className="py-3 text-center font-extrabold text-[#0F172A]">{item.qty} ชิ้น</td>
                          <td className="py-3 text-right font-black text-[#800020]">฿{item.revenue.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-[#0F172A] mb-5 flex items-center gap-2">
                  <PieChart size={17} className="text-[#800020]" /> สัดส่วนยอดขายตามหมวดหมู่
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1.5">
                      <span>Coffee</span>
                      <span className="text-[#800020] font-black">฿{catSales.coffee.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#800020] h-full transition-all duration-500 rounded-full"
                        style={{ width: `${filterRevenue > 0 ? (catSales.coffee / filterRevenue) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1.5">
                      <span>Non-Coffee</span>
                      <span className="text-[#800020] font-black">฿{catSales["non-coffee"].toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#B45309] h-full transition-all duration-500 rounded-full"
                        style={{ width: `${filterRevenue > 0 ? (catSales["non-coffee"] / filterRevenue) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1.5">
                      <span>Bakery</span>
                      <span className="text-[#800020] font-black">฿{catSales.bakery.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1E293B] h-full transition-all duration-500 rounded-full"
                        style={{ width: `${filterRevenue > 0 ? (catSales.bakery / filterRevenue) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
            <h3 className="text-sm font-black text-[#0F172A] mb-5 flex items-center gap-2">
              <Clock size={17} className="text-[#800020]" /> ประวัติคำสั่งซื้อ ({filteredDashboardOrders.length} รายการ)
            </h3>
            <div className="space-y-3">
              {filteredDashboardOrders.length === 0 ? (
                <div className="p-10 text-center text-[#94A3B8] text-xs font-semibold">
                  ไม่มีประวัติการชำระเงินในช่วงเวลานี้
                </div>
              ) : (
                filteredDashboardOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-4 rounded-2xl border flex justify-between items-center transition ${
                      order.status === "cancelled"
                        ? "bg-[#FEF2F2] border-[#FCA5A5] opacity-70"
                        : "bg-[#FAF7F2] border-[#F1F5F9] hover:border-[#800020]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-xs text-[#800020] bg-[#FEF3C7] px-2.5 py-0.5 rounded-lg border border-[#800020]/20">
                          {order.queueNo}
                        </span>
                        {order.customerName && (
                          <span className="font-extrabold text-xs text-[#0F172A] bg-white px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                            {order.customerName}
                          </span>
                        )}
                        <span className="font-extrabold text-xs text-[#0F172A]">{order.id}</span>
                        <span className="text-[10px] bg-[#800020] text-white px-2.5 py-0.5 rounded-full font-bold">
                          {order.orderType}
                        </span>
                        <span className="text-[10px] bg-[#F1F5F9] text-[#1E293B] px-2.5 py-0.5 rounded-full font-bold">
                          {order.paymentMethod}
                        </span>
                        {order.status === "cancelled" && (
                          <span className="text-[10px] bg-[#EF4444] text-white px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Ban size={10} /> ยกเลิกแล้ว (ไม่คิดเงิน/ตัดสต็อก)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] font-medium mt-1">
                        {order.date} {order.time} • {order.items.length} รายการ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-black ${order.status === "cancelled" ? "line-through text-[#94A3B8]" : "text-[#800020]"}`}>
                        ฿{order.total.toFixed(2)}
                      </p>
                      <button
                        onClick={() => setActiveReceipt(order)}
                        className="text-[11px] text-[#64748B] font-extrabold underline hover:text-[#800020] mt-0.5 cursor-pointer"
                      >
                        ดูใบเสร็จ
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      )}

      {/* Admin Screen */}
      {activeTab === "admin" && (
        <main className="flex-1 p-8 bg-[#FAF7F2] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-black text-[#0F172A] flex items-center gap-2.5">
                <ShieldAlert size={24} className="text-[#800020]" /> SWEET GEAR Admin Management
              </h1>
              <p className="text-xs font-semibold text-[#64748B] mt-1">
                จัดการระบบทั้งหมด: สินค้า, สต็อกวัตถุดิบ, โปรโมชั่น และรายจ่าย
              </p>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-xs font-bold text-[#EF4444] bg-[#FEF2F2] hover:bg-[#FCA5A5]/30 border border-[#FCA5A5] px-4 py-2.5 rounded-2xl transition cursor-pointer shadow-xs"
            >
              ออกจากสิทธิ์ปลดล็อก
            </button>
          </div>

          <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-[#E2E8F0] w-fit shadow-xs">
            <button
              onClick={() => setAdminSubTab("menu")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                adminSubTab === "menu" ? "bg-[#800020] text-white shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Layers size={16} /> จัดการเมนูสินค้า
            </button>
            <button
              onClick={() => setAdminSubTab("inventory")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                adminSubTab === "inventory" ? "bg-[#800020] text-white shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Package size={16} /> จัดการคลังวัตถุดิบ & สต็อก
            </button>
            <button
              onClick={() => setAdminSubTab("promotions")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                adminSubTab === "promotions" ? "bg-[#800020] text-white shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Tag size={16} /> จัดการโปรโมชั่น
            </button>
            <button
              onClick={() => setAdminSubTab("expenses")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                adminSubTab === "expenses" ? "bg-[#800020] text-white shadow-xs" : "text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <Wallet size={16} /> จัดการรายจ่าย & วัตถุดิบ
            </button>
          </div>

          {adminSubTab === "menu" && (
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs h-fit space-y-4">
                <h2 className="text-base font-black text-[#0F172A]">{editingItem ? "แก้ไขรายการสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
                <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                  <div>
                    <label className="font-extrabold text-[#334155] block mb-1">ชื่อสินค้า</label>
                    <input
                      type="text"
                      required
                      value={itemNameInput}
                      onChange={(e) => setItemNameInput(e.target.value)}
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#800020] outline-none text-[#0F172A] transition font-semibold"
                      placeholder="เช่น Matcha Espresso Latte"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-extrabold text-[#334155] block mb-1">หมวดหมู่หลัก</label>
                      <select
                        value={itemCategoryInput}
                        onChange={(e) => {
                          const catId = e.target.value;
                          const catObj = initialCategories.find((c) => c.id === catId);
                          let firstSub = "all";
                          if (catObj && catObj.subCategories && catObj.subCategories.length > 1) {
                            firstSub = catObj.subCategories[1].id;
                          }
                          setItemCategoryInput(catId);
                          setItemSubCategoryInput(firstSub);
                        }}
                        className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#800020] outline-none text-[#0F172A] font-bold transition"
                      >
                        <option value="coffee">Coffee</option>
                        <option value="non-coffee">Non-Coffee</option>
                        <option value="bakery">Bakery</option>
                      </select>
                    </div>

                    {adminSelectedCategoryObj?.subCategories && (
                      <div>
                        <label className="font-extrabold text-[#334155] block mb-1">หมวดหมู่ย่อย</label>
                        <select
                          value={itemSubCategoryInput}
                          onChange={(e) => setItemSubCategoryInput(e.target.value)}
                          className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#800020] outline-none text-[#0F172A] font-bold transition"
                        >
                          {adminSelectedCategoryObj.subCategories
                            .filter((sub) => sub.id !== "all")
                            .map((sub) => (
                              <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="font-extrabold text-[#334155]">การตั้งค่าขนาดแก้ว & ราคา</label>
                      <button
                        type="button"
                        onClick={() => setHasMultipleSizes(!hasMultipleSizes)}
                        className={`text-[11px] font-black px-3 py-1 rounded-xl transition cursor-pointer ${
                          hasMultipleSizes ? "bg-[#800020] text-white" : "bg-[#E2E8F0] text-[#64748B]"
                        }`}
                      >
                        {hasMultipleSizes ? "มีหลายขนาดแก้ว" : "ขนาดเดียว (Standard)"}
                      </button>
                    </div>

                    {!hasMultipleSizes ? (
                      <div>
                        <label className="font-bold text-[#64748B] block mb-1">ราคา (บาท)</label>
                        <input
                          type="number"
                          required={!hasMultipleSizes}
                          value={itemPriceInput}
                          onChange={(e) => setItemPriceInput(e.target.value)}
                          className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#800020] outline-none text-[#0F172A] font-black"
                          placeholder="60"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3 pt-1 border-t border-[#E2E8F0]">
                        <div className="space-y-1.5">
                          {itemSizesList && itemSizesList.length > 0 ? (
                            itemSizesList.map((sz, idx) => (
                              <div
                                key={sz.id || idx}
                                className={`p-2.5 rounded-xl border flex justify-between items-center transition cursor-pointer ${
                                  selectedSizeIdxForRecipe === idx ? "bg-white border-[#800020] shadow-xs" : "bg-white/60 border-[#E2E8F0]"
                                }`}
                                onClick={() => setSelectedSizeIdxForRecipe(idx)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-xs text-[#0F172A]">{sz.name}</span>
                                  <span className="text-[10px] font-bold text-[#800020] bg-[#FEF3C7] px-2 py-0.5 rounded-md">฿{sz.price}</span>
                                  <span className="text-[10px] text-[#64748B]">({sz.recipe?.length || 0} วัตถุดิบ)</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveSize(idx);
                                  }}
                                  className="text-[#94A3B8] hover:text-[#EF4444] p-1"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] text-[#94A3B8] italic">ยังไม่ได้เพิ่มขนาดแก้ว</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <input
                            type="text"
                            value={newSizeName}
                            onChange={(e) => setNewSizeName(e.target.value)}
                            placeholder="เช่น 16 oz, 22 oz, Hot 8oz"
                            className="p-2 bg-white border border-[#E2E8F0] rounded-lg text-xs outline-none font-semibold"
                          />
                          <input
                            type="number"
                            value={newSizePrice}
                            onChange={(e) => setNewSizePrice(e.target.value)}
                            placeholder="ราคา (เช่น 65)"
                            className="p-2 bg-white border border-[#E2E8F0] rounded-lg text-xs outline-none font-black"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddNewSize}
                          className="w-full bg-[#800020] text-white py-2 rounded-lg font-black text-xs cursor-pointer hover:bg-[#5C0017] transition"
                        >
                          + เพิ่มขนาดแก้วนี้
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-extrabold text-[#334155] block mb-1">สถานะสินค้า</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-[#F1F5F9] rounded-xl">
                      <button
                        type="button"
                        onClick={() => setItemInStockInput(true)}
                        className={`py-2 rounded-lg font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          itemInStockInput ? "bg-white text-[#800020] shadow-xs" : "text-[#64748B]"
                        }`}
                      >
                        <CheckCircle2 size={14} /> พร้อมขาย
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemInStockInput(false)}
                        className={`py-2 rounded-lg font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          !itemInStockInput ? "bg-white text-[#EF4444] shadow-xs" : "text-[#64748B]"
                        }`}
                      >
                        <XCircle size={14} /> สินค้าหมด
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2E8F0] space-y-2.5">
                    <label className="font-extrabold text-[#334155] block">
                      {hasMultipleSizes && itemSizesList.length > 0
                        ? `สูตรวัตถุดิบตัดสต็อกสำหรับขนาด [ ${itemSizesList[selectedSizeIdxForRecipe]?.name || ""} ]`
                        : "สูตรวัตถุดิบตัดสต็อก (ต่อ 1 แก้ว)"}
                    </label>

                    <div className="space-y-2">
                      {!hasMultipleSizes ? (
                        itemRecipeList && itemRecipeList.length > 0 ? (
                          itemRecipeList.map((r) => {
                            const ing = ingredients.find((i) => i.id === r.ingId);
                            return (
                              <div key={r.ingId} className="flex justify-between items-center bg-white border border-[#E2E8F0] px-3 py-2 rounded-xl">
                                <span className="font-bold text-[#0F172A]">{ing ? ing.name : r.ingId}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-[#800020]">{r.amount} {ing?.unit}</span>
                                  <button type="button" onClick={() => handleRemoveIngFromSingleRecipe(r.ingId)} className="text-[#94A3B8] hover:text-[#EF4444]">
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-[11px] text-[#94A3B8] italic font-medium">ยังไม่ได้กำหนดวัตถุดิบในสูตร</p>
                        )
                      ) : (
                        itemSizesList[selectedSizeIdxForRecipe]?.recipe?.length > 0 ? (
                          itemSizesList[selectedSizeIdxForRecipe].recipe.map((r) => {
                            const ing = ingredients.find((i) => i.id === r.ingId);
                            return (
                              <div key={r.ingId} className="flex justify-between items-center bg-white border border-[#E2E8F0] px-3 py-2 rounded-xl">
                                <span className="font-bold text-[#0F172A]">{ing ? ing.name : r.ingId}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-[#800020]">{r.amount} {ing?.unit}</span>
                                  <button type="button" onClick={() => handleRemoveIngFromSizeRecipe(selectedSizeIdxForRecipe, r.ingId)} className="text-[#94A3B8] hover:text-[#EF4444]">
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-[11px] text-[#94A3B8] italic font-medium">ยังไม่ได้กำหนดวัตถุดิบในสูตรของขนาดนี้</p>
                        )
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={selectedIngForRecipe}
                          onChange={(e) => setSelectedIngForRecipe(e.target.value)}
                          className="p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold outline-none"
                        >
                          <option value="">-- เลือกวัตถุดิบ --</option>
                          {ingredients.map((ing) => (
                            <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                          ))}
                        </select>

                        <input
                          type="number"
                          value={recipeIngAmount}
                          onChange={(e) => setRecipeIngAmount(e.target.value)}
                          placeholder="ปริมาณที่ใช้"
                          className="p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={hasMultipleSizes ? handleAddIngToSizeRecipe : handleAddIngToSingleRecipe}
                        className="w-full bg-[#800020] text-white font-bold py-2.5 rounded-xl text-xs hover:bg-[#5C0017] transition cursor-pointer"
                      >
                        + เพิ่มวัตถุดิบในสูตร
                      </button>
                    </div>
                  </div>

                  {itemCategoryInput === "coffee" && (
                    <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-2">
                      <label className="font-extrabold text-[#334155] block flex items-center gap-1">
                        <Flame size={14} className="text-[#800020]" /> ตัวเลือกระดับความเข้มกาแฟ / เมล็ดคั่ว
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {itemCoffeeRoastTextInput !== "" ? (
                          itemCoffeeRoastTextInput.split(",").map((roast, idx) => (
                            <span key={idx} className="bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg text-[#0F172A] font-medium flex items-center gap-1 shadow-xs">
                              {roast.trim()}
                              <button
                                type="button"
                                onClick={() => {
                                  const list = itemCoffeeRoastTextInput.split(",").map((s) => s.trim()).filter((_, i) => i !== idx);
                                  setItemCoffeeRoastTextInput(list.join(", "));
                                }}
                                className="text-[#94A3B8] hover:text-[#EF4444]"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-[#94A3B8] text-[11px]">ไม่มีตัวเลือก</span>
                        )}
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <input
                          type="text"
                          value={newCoffeeRoastInput}
                          onChange={(e) => setNewCoffeeRoastInput(e.target.value)}
                          placeholder="เช่น คั่วเข้มพิเศษ"
                          className="flex-1 bg-white p-2 border border-[#E2E8F0] rounded-lg text-xs outline-none font-semibold"
                        />
                        <button type="button" onClick={addCoffeeRoastOption} className="bg-[#800020] text-white px-3 py-1.5 rounded-lg font-black text-xs cursor-pointer">
                          + เพิ่ม
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-2">
                    <label className="font-extrabold text-[#334155] block">ระดับความหวาน</label>
                    <div className="flex flex-wrap gap-1.5">
                      {itemSweetnessTextInput !== "" ? (
                        itemSweetnessTextInput.split(",").map((sw, idx) => (
                          <span key={idx} className="bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg text-[#0F172A] font-medium flex items-center gap-1 shadow-xs">
                            {sw.trim()}
                            <button
                              type="button"
                              onClick={() => {
                                const list = itemSweetnessTextInput.split(",").map((s) => s.trim()).filter((_, i) => i !== idx);
                                setItemSweetnessTextInput(list.join(", "));
                              }}
                              className="text-[#94A3B8] hover:text-[#EF4444]"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[#94A3B8] text-[11px]">ไม่มีตัวเลือก</span>
                      )}
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        value={newSweetnessInput}
                        onChange={(e) => setNewSweetnessInput(e.target.value)}
                        placeholder="เพิ่มออปชัน (เช่น 25%)"
                        className="flex-1 bg-white p-2 border border-[#E2E8F0] rounded-lg text-xs outline-none font-semibold"
                      />
                      <button type="button" onClick={addSweetnessOption} className="bg-[#800020] text-white px-3 py-1.5 rounded-lg font-black text-xs cursor-pointer">
                        + เพิ่ม
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-2">
                    <label className="font-extrabold text-[#334155] block">ตัวเลือกนม & ราคาเพิ่ม</label>
                    <div className="flex flex-wrap gap-1.5">
                      {itemMilkTextInput !== "" ? (
                        itemMilkTextInput.split(",").map((m, idx) => (
                          <span key={idx} className="bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg text-[#0F172A] font-medium flex items-center gap-1 shadow-xs">
                            {m.trim()}
                            <button
                              type="button"
                              onClick={() => {
                                const list = itemMilkTextInput.split(",").map((s) => s.trim()).filter((_, i) => i !== idx);
                                setItemMilkTextInput(list.join(", "));
                              }}
                              className="text-[#94A3B8] hover:text-[#EF4444]"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[#94A3B8] text-[11px]">ไม่มีตัวเลือก</span>
                      )}
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        value={newMilkInput}
                        onChange={(e) => setNewMilkInput(e.target.value)}
                        placeholder="เช่น นมพิสตาชิโอ (+25)"
                        className="flex-1 bg-white p-2 border border-[#E2E8F0] rounded-lg text-xs outline-none font-semibold"
                      />
                      <button type="button" onClick={addMilkOption} className="bg-[#800020] text-white px-3 py-1.5 rounded-lg font-black text-xs cursor-pointer">
                        + เพิ่ม
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-2">
                    <label className="font-extrabold text-[#334155] block">ท็อปปิ้ง / ตัวเลือกเพิ่มเติม (พร้อมการผูกตัดสต็อก)</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {itemAddonsTextInput !== "" ? (
                        itemAddonsTextInput.split(",").map((a, idx) => (
                          <span key={idx} className="bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg text-[#0F172A] font-medium flex items-center gap-1 shadow-xs text-[11px]">
                            {a.trim()}
                            <button
                              type="button"
                              onClick={() => {
                                const list = itemAddonsTextInput.split(",").map((s) => s.trim()).filter((_, i) => i !== idx);
                                setItemAddonsTextInput(list.join(", "));
                              }}
                              className="text-[#94A3B8] hover:text-[#EF4444]"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[#94A3B8] text-[11px]">ไม่มีตัวเลือกท็อปปิ้ง</span>
                      )}
                    </div>

                    <div className="space-y-2 pt-1 border-t border-[#E2E8F0]">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={addonNameInput}
                          onChange={(e) => setAddonNameInput(e.target.value)}
                          placeholder="ชื่อท็อปปิ้ง (เช่น วิปครีม)"
                          className="bg-white p-2 border border-[#E2E8F0] rounded-lg text-xs outline-none font-semibold"
                        />
                        <input
                          type="number"
                          value={addonPriceInput}
                          onChange={(e) => setAddonPriceInput(e.target.value)}
                          placeholder="ราคาบวกเพิ่ม (เช่น 15)"
                          className="bg-white p-2 border border-[#E2E8F0] rounded-lg text-xs outline-none font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={selectedAddonIngInput}
                          onChange={(e) => setSelectedAddonIngInput(e.target.value)}
                          className="bg-white p-2 border border-[#E2E8F0] rounded-lg text-xs outline-none font-semibold"
                        >
                          <option value="">-- ไม่ตัดวัตถุดิบเพิ่มเติม --</option>
                          {ingredients.map((ing) => (
                            <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={addonIngAmountInput}
                          onChange={(e) => setAddonIngAmountInput(e.target.value)}
                          placeholder="ปริมาณที่ใช้ตัดสต็อก"
                          className="bg-white p-2 border border-[#E2E8F0] rounded-lg text-xs outline-none font-semibold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddAddonOption}
                        className="w-full bg-[#800020] text-white py-2 rounded-lg font-black text-xs cursor-pointer hover:bg-[#5C0017] transition"
                      >
                        + เพิ่มท็อปปิ้งในเมนูนี้
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-extrabold text-[#334155] block mb-1">URL รูปภาพสินค้า</label>
                    <input
                      type="text"
                      value={itemImageInput}
                      onChange={(e) => setItemImageInput(e.target.value)}
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl focus:bg-white outline-none text-[#0F172A] font-medium"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#800020] hover:bg-[#5C0017] text-white font-black py-3.5 rounded-2xl shadow-md transition text-xs cursor-pointer uppercase tracking-wider"
                    >
                      {editingItem ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                    </button>
                    {editingItem && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          setHasMultipleSizes(false);
                          setItemNameInput("");
                          setItemPriceInput("");
                          setItemCategoryInput("coffee");
                          setItemSubCategoryInput("hot");
                          setItemImageInput("");
                          setItemInStockInput(true);
                          setItemSweetnessTextInput("100%, 50%, 0%");
                          setItemCoffeeRoastTextInput("คั่วอ่อน, คั่วกลาง (Standard), คั่วเข้ม");
                          setItemMilkTextInput("นมสดธรรมดา (+0)");
                          setItemAddonsTextInput("เพิ่ม Shot กาแฟ (+25)");
                          setItemRecipeList([]);
                          setItemSizesList([]);
                        }}
                        className="px-4 border border-[#E2E8F0] rounded-2xl text-[#334155] hover:bg-[#F1F5F9] font-bold text-xs transition cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="col-span-2 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
                <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                  <h2 className="text-base font-black text-[#0F172A]">
                    รายการสินค้าทั้งหมด ({adminFilteredMenuItems.length} / {menuItems.length} รายการ)
                  </h2>

                  {/* เพิ่มปุ่มกรองหมวดหมู่ฝั่งตารางรายการสินค้า */}
                  <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-2xl border border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => setAdminFilterCategory("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                        adminFilterCategory === "all"
                          ? "bg-[#800020] text-white shadow-xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      ทั้งหมด
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminFilterCategory("coffee")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                        adminFilterCategory === "coffee"
                          ? "bg-[#800020] text-white shadow-xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Coffee
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminFilterCategory("non-coffee")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                        adminFilterCategory === "non-coffee"
                          ? "bg-[#800020] text-white shadow-xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Non-Coffee
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminFilterCategory("bakery")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                        adminFilterCategory === "bakery"
                          ? "bg-[#800020] text-white shadow-xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Bakery
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#F1F5F9] text-[#64748B] font-bold uppercase">
                        <th className="pb-3">สินค้า</th>
                        <th className="pb-3">หมวดหมู่หลัก / ย่อย</th>
                        <th className="pb-3">ขนาดที่มี</th>
                        <th className="pb-3">สถานะสต็อก</th>
                        <th className="pb-3">ราคา</th>
                        <th className="pb-3 text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {adminFilteredMenuItems.map((item) => {
                        const inStock = isItemInStock(item);
                        const subCat = item.sub_category || item.subCategory;
                        const hasSizes = item.sizes && item.sizes.length > 0;

                        return (
                          <tr key={item.id} className="hover:bg-[#FAF7F2] transition">
                            <td className="py-3.5 flex items-center gap-3">
                              <img src={item.image} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-xs" />
                              <span className="font-extrabold text-[#0F172A]">{item.name}</span>
                            </td>
                            <td className="py-3.5 text-[#64748B]">
                              <span className="capitalize font-bold text-[#0F172A]">{item.category}</span>
                              {subCat && subCat !== "all" && (
                                <span className="text-[10px] bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded-md ml-1.5 font-bold uppercase">
                                  {subCat}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5">
                              {hasSizes ? (
                                <div className="flex flex-wrap gap-1">
                                  {item.sizes.map((s, idx) => (
                                    <span key={idx} className="text-[10px] bg-[#FEF3C7] border border-[#800020]/20 text-[#800020] font-black px-2 py-0.5 rounded-md">
                                      {s.name} (฿{s.price})
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[#94A3B8] italic text-[11px]">ขนาดเดียว</span>
                              )}
                            </td>
                            <td className="py-3.5">
                              {inStock ? (
                                <span className="text-[11px] text-[#059669] bg-[#D1FAE5] px-3 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit border border-[#10B981]/20">
                                  <CheckCircle2 size={12} /> พร้อมขาย
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#EF4444] bg-[#FEF2F2] px-3 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit border border-[#FCA5A5]">
                                  <XCircle size={12} /> {!(item.in_stock ?? item.inStock) ? "ปิดขาย" : "วัตถุดิบหมด"}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 font-black text-[#800020]">
                              {hasSizes ? `฿${item.sizes[0].price}+` : `฿${Number(item.price).toFixed(2)}`}
                            </td>
                            <td className="py-3.5 text-right space-x-2">
                              <button onClick={() => handleEditClick(item)} className="p-2 text-[#64748B] hover:text-[#800020] hover:bg-[#FEF3C7] rounded-xl transition cursor-pointer">
                                <Edit3 size={16} />
                              </button>
                              <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-xl transition cursor-pointer">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminSubTab === "inventory" && (
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs h-fit space-y-4">
                <h2 className="text-base font-black text-[#0F172A]">เพิ่มวัตถุดิบใหม่เข้าคลัง</h2>
                <form onSubmit={handleSaveIngredient} className="space-y-4 text-xs">
                  <div>
                    <label className="font-extrabold text-[#334155] block mb-1">ชื่อวัตถุดิบ</label>
                    <input
                      type="text"
                      required
                      value={ingNameInput}
                      onChange={(e) => setIngNameInput(e.target.value)}
                      placeholder="เช่น เมล็ดกาแฟ, นมสด"
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-extrabold text-[#334155] block mb-1">จำนวนสต็อก</label>
                      <input
                        type="number"
                        required
                        value={ingStockInput}
                        onChange={(e) => setIngStockInput(e.target.value)}
                        placeholder="2000"
                        className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-black"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-[#334155] block mb-1">หน่วยนับ</label>
                      <select
                        value={ingUnitInput}
                        onChange={(e) => setIngUnitInput(e.target.value)}
                        className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-bold"
                      >
                        <option value="กรัม">กรัม (g)</option>
                        <option value="กิโลกรัม">กิโลกรัม (kg)</option>
                        <option value="มล.">มิลลิลิตร (ml)</option>
                        <option value="ลิตร">ลิตร (L)</option>
                        <option value="ใบ">ใบ</option>
                        <option value="ชิ้น">ชิ้น</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-extrabold text-[#334155] block mb-1">จุดเตือนสั่งซื้อเพิ่ม (Min Stock)</label>
                    <input
                      type="number"
                      value={ingMinStockInput}
                      onChange={(e) => setIngMinStockInput(e.target.value)}
                      placeholder="500"
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-bold"
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#800020] text-white font-black py-3.5 rounded-2xl shadow-md text-xs cursor-pointer uppercase tracking-wider">
                    + เพิ่มวัตถุดิบ
                  </button>
                </form>
              </div>

              <div className="col-span-2 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
                <h2 className="text-base font-black text-[#0F172A] mb-5">คลังวัตถุดิบจริงทั้งหมด ({ingredients.length} รายการ)</h2>
                <div className="space-y-3">
                  {ingredients.map((ing) => {
                    const minStock = ing.min_stock ?? ing.minStock ?? 0;
                    const isLow = ing.stock <= minStock;
                    return (
                      <div
                        key={ing.id}
                        className={`p-4 rounded-2xl border ${isLow ? "bg-[#FEF2F2] border-[#FCA5A5]" : "bg-[#FAF7F2] border-[#F1F5F9]"} flex justify-between items-center transition`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-[#0F172A]">{ing.name}</span>
                            {isLow && (
                              <span className="text-[10px] bg-[#EF4444] text-white px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs">
                                <AlertTriangle size={10} /> วัตถุดิบใกล้หมด
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#64748B] font-medium mt-1">
                            คงเหลือ: <span className="font-black text-[#800020]">{ing.stock}</span> {ing.unit} (ขั้นต่ำ: {minStock} {ing.unit})
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddIngredientStock(ing.id, ing.stock, ing.name, ing.unit)}
                            className="bg-[#800020] hover:bg-[#5C0017] text-white px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer shadow-xs transition"
                          >
                            + เติมสต็อก
                          </button>
                          <button onClick={() => handleDeleteIngredient(ing.id)} className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-xl cursor-pointer transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {adminSubTab === "promotions" && (
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs h-fit space-y-4">
                <h2 className="text-base font-black text-[#0F172A]">สร้างโปรโมชั่นใหม่</h2>
                <form onSubmit={handleSavePromotion} className="space-y-4 text-xs">
                  <div>
                    <label className="font-extrabold text-[#334155] block mb-1">โค้ดส่วนลด (Promotion Code)</label>
                    <input
                      type="text"
                      required
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="เช่น DISCOUNT10"
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-black uppercase tracking-wider"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-[#334155] block mb-1">ชื่อโปรโมชั่น</label>
                    <input
                      type="text"
                      required
                      value={promoNameInput}
                      onChange={(e) => setPromoNameInput(e.target.value)}
                      placeholder="เช่น ลด 10% เมนูวันแม่"
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-extrabold text-[#334155] block mb-1">ประเภทส่วนลด</label>
                      <select
                        value={promoTypeInput}
                        onChange={(e) => setPromoTypeInput(e.target.value)}
                        className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-bold"
                      >
                        <option value="percent">เปอร์เซ็นต์ (%)</option>
                        <option value="fixed">จำนวนเงินคงที่ (บาท)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-extrabold text-[#334155] block mb-1">มูลค่าส่วนลด</label>
                      <input
                        type="number"
                        required
                        value={promoValueInput}
                        onChange={(e) => setPromoValueInput(e.target.value)}
                        placeholder={promoTypeInput === "percent" ? "10" : "20"}
                        className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-extrabold text-[#334155] block mb-1">ยอดขั้นต่ำในการใช้ (บาท)</label>
                    <input
                      type="number"
                      value={promoMinSpendInput}
                      onChange={(e) => setPromoMinSpendInput(e.target.value)}
                      placeholder="100"
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-bold"
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#800020] text-white font-black py-3.5 rounded-2xl shadow-md text-xs cursor-pointer uppercase tracking-wider">
                    + เพิ่มโปรโมชั่น
                  </button>
                </form>
              </div>

              <div className="col-span-2 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
                <h2 className="text-base font-black text-[#0F172A] mb-5">รายการโปรโมชั่นทั้งหมด ({promotions.length} รายการ)</h2>
                <div className="space-y-3">
                  {promotions.map((p) => {
                    const minSpend = p.min_spend ?? p.minSpend ?? 0;
                    return (
                      <div key={p.id} className="p-4 bg-[#FAF7F2] border border-[#F1F5F9] rounded-2xl flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs bg-[#800020] text-white px-3 py-0.5 rounded-lg tracking-wider">{p.code}</span>
                            <span className="font-bold text-xs text-[#0F172A]">{p.name}</span>
                          </div>
                          <p className="text-xs text-[#64748B] font-medium mt-1">
                            ส่วนลด: <span className="font-black text-[#800020]">{p.type === "percent" ? `${p.value}%` : `฿${p.value}`}</span> • ยอดซื้อขั้นต่ำ: ฿{minSpend}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => togglePromotionStatus(p.id, p.active)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition ${
                              p.active ? "bg-[#D1FAE5] text-[#059669]" : "bg-[#FEF2F2] text-[#EF4444]"
                            }`}
                          >
                            {p.active ? "เปิดใช้งานอยู่" : "ปิดใช้งาน"}
                          </button>
                          <button onClick={() => handleDeletePromotion(p.id)} className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-xl cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {adminSubTab === "expenses" && (
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs h-fit space-y-4">
                <h2 className="text-base font-black text-[#0F172A]">บันทึกรายจ่ายใหม่</h2>
                <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
                  <div>
                    <label className="font-extrabold text-[#334155] block mb-1">รายการรายจ่าย/ซื้อของ</label>
                    <input
                      type="text"
                      required
                      value={expTitleInput}
                      onChange={(e) => setExpTitleInput(e.target.value)}
                      placeholder="เช่น ซื้อแก้วกาแฟ 1,000 ใบ"
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-extrabold text-[#334155] block mb-1">หมวดหมู่รายจ่าย</label>
                      <select
                        value={expCategoryInput}
                        onChange={(e) => setExpCategoryInput(e.target.value)}
                        className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-bold"
                      >
                        <option value="raw_material">วัตถุดิบ (Raw Material)</option>
                        <option value="equipment">อุปกรณ์ (Equipment)</option>
                        <option value="utilities">ค่าน้ำ/ค่าไฟ/ค่าเช่า</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-extrabold text-[#334155] block mb-1">จำนวนเงิน (บาท)</label>
                      <input
                        type="number"
                        required
                        value={expAmountInput}
                        onChange={(e) => setExpAmountInput(e.target.value)}
                        placeholder="1500"
                        className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-extrabold text-[#334155] block mb-1">วันที่บันทึก</label>
                    <input
                      type="date"
                      required
                      value={expDateInput}
                      onChange={(e) => setExpDateInput(e.target.value)}
                      className="w-full p-3 bg-[#FAF7F2] border border-[#E2E8F0] rounded-xl outline-none font-bold text-[#0F172A]"
                    />
                  </div>
                  <button type="submit" className="w-full bg-[#800020] text-white font-black py-3.5 rounded-2xl shadow-md text-xs cursor-pointer uppercase tracking-wider">
                    + บันทึกรายจ่าย
                  </button>
                </form>
              </div>

              <div className="col-span-2 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-xs">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-base font-black text-[#0F172A]">รายการบันทึกรายจ่ายทั้งหมด ({expenses.length} รายการ)</h2>
                  <span className="text-xs font-black text-[#EF4444] bg-[#FEF2F2] px-3.5 py-1 rounded-full border border-[#FCA5A5]">
                    รวมสะสม: ฿{totalExpensesAll.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3">
                  {expenses.map((e) => (
                    <div key={e.id} className="p-4 bg-[#FAF7F2] border border-[#F1F5F9] rounded-2xl flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#0F172A]">{e.title}</span>
                          <span className="text-[10px] bg-[#FEF3C7] text-[#B45309] px-2.5 py-0.5 rounded-full font-extrabold">
                            {e.category === "raw_material" ? "วัตถุดิบ" : e.category === "equipment" ? "อุปกรณ์" : e.category === "utilities" ? "ค่าน้ำ/ไฟ/เช่า" : "อื่นๆ"}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] font-medium mt-1 flex items-center gap-1">
                          <Calendar size={13} /> {e.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-[#EF4444]">-฿{Number(e.amount).toFixed(2)}</span>
                        <button onClick={() => handleDeleteExpense(e.id)} className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-xl cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-7 border border-[#E2E8F0] animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                ชำระเงิน (คิว {String(orderQueueCount).padStart(2, "0")}) {customerName && `• คุณ ${customerName}`}
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="cursor-pointer text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-full hover:bg-[#F1F5F9] transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5">
              <label className="text-xs font-extrabold text-[#64748B] block mb-2">ประเภทการสั่งซื้อ</label>
              <div className="grid grid-cols-3 gap-2.5">
                {["Dine-in", "Takeaway", "Delivery"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`py-2.5 rounded-2xl text-xs font-black border transition cursor-pointer ${
                      orderType === type ? "bg-[#800020] text-white border-[#800020] shadow-sm" : "bg-[#FAF7F2] text-[#64748B] border-[#E2E8F0]"
                    }`}
                  >
                    {type === "Dine-in" ? "ทานที่ร้าน" : type === "Takeaway" ? "กลับบ้าน" : "เดลิเวอรี"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#F1F5F9]">
              <label className="text-xs font-extrabold text-[#64748B] block mb-1.5">ส่วนลดกำหนดเองเพิ่มเติม (บาท)</label>
              <input
                type="number"
                min="0"
                value={customDiscount}
                onChange={(e) => setCustomDiscount(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-black text-[#0F172A] outline-none focus:ring-2 focus:ring-[#800020]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setPaymentMethod("qr")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition font-black text-xs ${
                  paymentMethod === "qr" ? "border-[#800020] bg-[#FEF3C7]/40 text-[#0F172A] shadow-sm" : "border-[#E2E8F0] text-[#64748B]"
                }`}
              >
                <QrCode size={20} className="text-[#800020]" /> สแกน QR Code
              </button>
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition font-black text-xs ${
                  paymentMethod === "cash" ? "border-[#800020] bg-[#FEF3C7]/40 text-[#0F172A] shadow-sm" : "border-[#E2E8F0] text-[#64748B]"
                }`}
              >
                <DollarSign size={20} className="text-[#800020]" /> เงินสด
              </button>
            </div>

            {paymentMethod === "qr" ? (
              <div className="text-center p-6 bg-[#FAF7F2] rounded-2xl border border-[#F1F5F9] mb-6">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=SWEET_GEAR_CAFE"
                  alt="QR Code"
                  className="mx-auto mb-3 rounded-2xl border border-[#E2E8F0] p-2.5 bg-white shadow-xs"
                />
                <p className="text-xs font-black text-[#64748B]">สแกนชำระยอดสุทธิ ฿{total.toFixed(2)}</p>
              </div>
            ) : (
              <div className="mb-6 space-y-3">
                <label className="text-xs font-extrabold text-[#334155]">รับเงินสดมา (บาท)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="w-full p-3.5 text-xl font-black bg-[#FAF7F2] border border-[#E2E8F0] rounded-2xl text-center focus:ring-2 focus:ring-[#800020] outline-none text-[#0F172A]"
                />

                <div className="flex gap-2">
                  {[100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCashReceived(String(amt))}
                      className="flex-1 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] font-black py-2 rounded-xl text-xs cursor-pointer transition"
                    >
                      ฿{amt}
                    </button>
                  ))}
                </div>

                {Number(cashReceived) >= total ? (
                  <p className="text-[#10B981] text-xs font-black text-center pt-1">
                    เงินทอน: ฿{(Number(cashReceived) - total).toFixed(2)}
                  </p>
                ) : (
                  cashReceived !== "" && (
                    <p className="text-[#EF4444] text-xs font-bold text-center pt-1">
                      เงินสดไม่พอ ชำระขาดอีก ฿{(total - Number(cashReceived)).toFixed(2)}
                    </p>
                  )
                )}
              </div>
            )}

            <button
              disabled={paymentMethod === "cash" && (Number(cashReceived) < total || Number(cashReceived) <= 0)}
              onClick={handleProcessPayment}
              className="w-full bg-[#800020] hover:bg-[#5C0017] disabled:bg-[#E2E8F0] disabled:text-[#94A3B8] text-white font-black py-4 rounded-2xl shadow-lg cursor-pointer text-xs transition uppercase tracking-wider"
            >
              ยืนยันการรับชำระเงิน (฿{total.toFixed(2)})
            </button>
          </div>
        </div>
      )}

      {/* Shift Close Summary Modal */}
      {isShiftCloseOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-7 shadow-2xl border border-[#E2E8F0] animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#1E293B]"></div>

            <div className="text-center mb-6 border-b border-[#F1F5F9] pb-4">
              <Receipt size={32} className="mx-auto text-[#800020] mb-2" />
              <h3 className="text-lg font-black text-[#0F172A]">สรุปยอดปิดกะประจำวัน (วันนี้)</h3>
              <p className="text-xs font-extrabold text-[#800020] mt-1 bg-[#FEF3C7] px-3 py-1 rounded-full w-fit mx-auto border border-[#D4AF37]/30">
                {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <div className="flex justify-between">
                <span className="font-semibold text-[#64748B]">จำนวนออเดอร์วันนี้:</span>
                <span className="font-extrabold text-[#0F172A]">{todayOrdersCount} ออเดอร์</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#64748B]">จำนวนสินค้าที่ขายได้วันนี้:</span>
                <span className="font-extrabold text-[#0F172A]">{todayItemsSold} ชิ้น</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#64748B]">ยอดขายรวมระบบ:</span>
                <span className="font-black text-[#800020] text-sm">฿{todayRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#64748B]">รายจ่ายรวมวันนี้:</span>
                <span className="font-black text-[#EF4444]">฿{todayExpensesTotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#F1F5F9] pt-2 flex justify-between font-black text-sm text-[#10B981]">
                <span>กำไรสุทธิกะวันนี้:</span>
                <span>฿{(todayRevenue - todayExpensesTotal).toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E2E8F0] mb-6 space-y-2">
              <label className="text-[11px] font-black text-[#334155] block">
                ระบุจำนวนเงินสดที่นับได้จริงในลิ้นชัก (บาท):
              </label>
              <input
                type="number"
                value={actualCashCount}
                onChange={(e) => setActualCashCount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-black text-[#0F172A] outline-none focus:ring-2 focus:ring-[#800020]"
              />

              {actualCashCount !== "" && (
                <div className="pt-2 border-t border-[#E2E8F0] text-xs font-black">
                  {Number(actualCashCount) - todayRevenue === 0 ? (
                    <p className="text-[#10B981] flex items-center gap-1">
                      <CheckCircle2 size={14} /> เงินสดตรงตามระบบเป๊ะ
                    </p>
                  ) : Number(actualCashCount) - todayRevenue > 0 ? (
                    <p className="text-[#3B82F6]">
                      เงินเกินระบบอยู่: +฿{(Number(actualCashCount) - todayRevenue).toFixed(2)}
                    </p>
                  ) : (
                    <p className="text-[#EF4444]">
                      เงินขาดจากระบบอยู่: -฿{Math.abs(Number(actualCashCount) - todayRevenue).toFixed(2)}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsShiftCloseOpen(false)}
              className="w-full bg-[#800020] hover:bg-[#5C0017] text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md cursor-pointer transition"
            >
              ยืนยันการปิดกะ
            </button>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {selectedItemForCustom && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#E2E8F0] animate-fadeIn">
            <div className="p-6 bg-[#1E293B] text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={selectedItemForCustom.image} alt="" className="w-14 h-14 rounded-2xl object-cover border border-[#334155] shadow-md" />
                <div>
                  <h3 className="font-black text-base text-[#F8FAFC]">{selectedItemForCustom.name}</h3>
                  <p className="text-xs font-bold text-[#D4AF37] mt-0.5">
                    {selectedSize ? `ขนาด ${selectedSize.name} • ฿${selectedSize.price}` : `เริ่มต้น ฿${selectedItemForCustom.price}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedItemForCustom(null);
                  setEditingCartId(null);
                }}
                className="p-2 hover:bg-[#334155] rounded-full cursor-pointer text-[#94A3B8] hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs custom-scrollbar">
              {selectedItemForCustom.sizes && selectedItemForCustom.sizes.length > 0 && (
                <div>
                  <label className="font-black text-[#64748B] text-[11px] uppercase tracking-wider block mb-2.5">ขนาดแก้ว (Size)</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedItemForCustom.sizes.map((sz) => {
                      const sizeInStock = isSizeInStock(sz, selectedItemForCustom.recipe);
                      const isSelected = selectedSize?.name === sz.name;

                      return (
                        <button
                          key={sz.name}
                          disabled={!sizeInStock}
                          onClick={() => setSelectedSize(sz)}
                          className={`p-3.5 rounded-2xl border flex justify-between items-center transition font-extrabold ${
                            !sizeInStock
                              ? "opacity-40 border-[#E2E8F0] bg-[#FAF7F2] cursor-not-allowed"
                              : isSelected
                              ? "border-[#800020] bg-[#FEF3C7]/40 text-[#0F172A] shadow-xs cursor-pointer"
                              : "border-[#E2E8F0] text-[#64748B] hover:bg-[#FAF7F2] cursor-pointer"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {sz.name} {!sizeInStock && <span className="text-[9px] text-[#EF4444] font-bold">(หมด)</span>}
                          </span>
                          <span className="text-[#800020] font-black">฿{sz.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedItemForCustom.category === "coffee" && (
                <div>
                  <label className="font-black text-[#800020] text-[11px] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Flame size={15} /> ระดับความเข้มกาแฟ / เมล็ดคั่ว (Coffee Roast)
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(
                      selectedItemForCustom.coffee_roast_options ||
                      selectedItemForCustom.coffeeRoastOptions ||
                      ["คั่วอ่อน", "คั่วกลาง (Standard)", "คั่วเข้ม"]
                    ).map((roast) => (
                      <button
                        key={roast}
                        onClick={() => setCoffeeRoast(roast)}
                        className={`py-3 rounded-2xl border transition cursor-pointer font-black text-center ${
                          coffeeRoast === roast ? "border-[#800020] bg-[#800020] text-white shadow-md" : "border-[#E2E8F0] text-[#64748B] hover:bg-[#FAF7F2]"
                        }`}
                      >
                        {roast}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(selectedItemForCustom.sweetness_options || selectedItemForCustom.sweetnessOptions)?.length > 0 && (
                <div>
                  <label className="font-black text-[#64748B] text-[11px] uppercase tracking-wider block mb-2.5">ระดับความหวาน</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(selectedItemForCustom.sweetness_options || selectedItemForCustom.sweetnessOptions).map((sw) => (
                      <button
                        key={sw}
                        onClick={() => setSweetness(sw)}
                        className={`py-3 rounded-2xl border transition cursor-pointer font-black ${
                          sweetness === sw ? "border-[#800020] bg-[#FEF3C7]/40 text-[#0F172A] shadow-xs" : "border-[#E2E8F0] text-[#64748B] hover:bg-[#FAF7F2]"
                        }`}
                      >
                        {sw}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(selectedItemForCustom.milk_options || selectedItemForCustom.milkOptions)?.length > 0 && (
                <div>
                  <label className="font-black text-[#64748B] text-[11px] uppercase tracking-wider block mb-2.5">ตัวเลือกนม (Milk)</label>
                  <div className="space-y-2">
                    {(selectedItemForCustom.milk_options || selectedItemForCustom.milkOptions).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMilk(m)}
                        className={`w-full p-3.5 rounded-2xl border flex justify-between transition cursor-pointer font-extrabold ${
                          milk?.id === m.id ? "border-[#800020] bg-[#FEF3C7]/40 text-[#0F172A] shadow-xs" : "border-[#E2E8F0] text-[#64748B] hover:bg-[#FAF7F2]"
                        }`}
                      >
                        <span>{m.label}</span>
                        <span className="text-[#800020] font-black">+{m.price}฿</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedItemForCustom.addons?.length > 0 && (
                <div>
                  <label className="font-black text-[#64748B] text-[11px] uppercase tracking-wider block mb-2.5">ท็อปปิ้ง / ตัวเลือกเพิ่มเติม</label>
                  <div className="space-y-2">
                    {selectedItemForCustom.addons.map((addon) => {
                      const isSelected = selectedAddons.some((a) => a.id === addon.id);
                      return (
                        <button
                          key={addon.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
                            } else {
                              setSelectedAddons([...selectedAddons, addon]);
                            }
                          }}
                          className={`w-full p-3.5 rounded-2xl border flex justify-between transition cursor-pointer font-extrabold ${
                            isSelected ? "border-[#800020] bg-[#FEF3C7]/40 text-[#0F172A] shadow-xs" : "border-[#E2E8F0] text-[#64748B] hover:bg-[#FAF7F2]"
                          }`}
                        >
                          <span>{addon.label}</span>
                          <span className="text-[#800020] font-black">+{addon.price}฿</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="font-black text-[#64748B] text-[11px] uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                  <FileText size={15} className="text-[#800020]" /> หมายเหตุพิเศษ (Note / Special Instructions)
                </label>
                <input
                  type="text"
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  placeholder="เช่น หวานน้อยมาก, แยกน้ำแข็ง..."
                  className="w-full p-3.5 bg-[#FAF7F2] border border-[#E2E8F0] rounded-2xl text-xs focus:ring-2 focus:ring-[#800020] focus:bg-white outline-none transition font-semibold"
                />
              </div>
            </div>

            <div className="p-5 border-t border-[#F1F5F9] flex gap-3 bg-[#FAF7F2]">
              <div className="flex items-center gap-3 border border-[#E2E8F0] bg-white px-4 rounded-2xl shadow-xs">
                <button onClick={() => setCustomQty((q) => Math.max(1, q - 1))} className="cursor-pointer text-[#64748B] hover:text-[#0F172A] transition">
                  <Minus size={16} />
                </button>
                <span className="font-black text-[#0F172A]">{customQty}</span>
                <button onClick={() => setCustomQty((q) => q + 1)} className="cursor-pointer text-[#64748B] hover:text-[#0F172A] transition">
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddCustomizedToCart}
                className="flex-1 bg-[#800020] hover:bg-[#5C0017] text-white font-black py-4 rounded-2xl shadow-md cursor-pointer transition text-xs uppercase tracking-wider"
              >
                {editingCartId ? "บันทึกการแก้ไขออเดอร์" : "เพิ่มลงตะกร้า"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div id="thermal-receipt-modal" className="bg-white w-full max-w-sm rounded-3xl p-7 shadow-2xl font-mono text-xs border border-[#E2E8F0] relative overflow-hidden animate-fadeIn">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#1E293B]"></div>

            <div className="text-center border-b border-dashed border-[#800020]/30 pb-5 mb-5">
              <h2 className="text-base font-black text-[#0F172A] tracking-widest">SWEET GEAR CAFE</h2>
              <p className="text-[11px] text-[#64748B] font-sans font-bold mt-1">
                คิวคำสั่งซื้อ: <span className="font-black text-[#800020] text-sm">{activeReceipt.queueNo}</span>
              </p>
              {activeReceipt.customerName && (
                <p className="text-xs text-[#0F172A] font-sans font-extrabold mt-0.5">
                  ลูกค้า: คุณ {activeReceipt.customerName}
                </p>
              )}
              <p className="text-[10px] text-[#94A3B8] mt-1 font-sans">
                {activeReceipt.id} • {activeReceipt.date} {activeReceipt.time}
              </p>
            </div>

            <div className="space-y-2.5 border-b border-dashed border-[#800020]/30 pb-5 mb-5">
              {activeReceipt.items.map((item) => (
                <div key={item.cartId} className="flex justify-between text-[#0F172A]">
                  <div>
                    <p className="font-bold">{item.name} x{item.qty}</p>
                    <p className="text-[10px] text-[#64748B] font-sans">{item.optionsText}</p>
                    {item.noteText && <p className="text-[10px] text-[#800020] font-sans italic">* {item.noteText}</p>}
                  </div>
                  <span className="font-bold">฿{(item.unitPrice * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 border-b border-dashed border-[#800020]/30 pb-5 mb-5 text-[#64748B]">
              <div className="flex justify-between">
                <span>รวม:</span> <span>฿{activeReceipt.subtotal.toFixed(2)}</span>
              </div>
              {activeReceipt.discount > 0 && (
                <div className="flex justify-between text-[#EF4444]">
                  <span>ส่วนลด:</span> <span>-฿{activeReceipt.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-[#0F172A] font-black text-sm pt-1.5">
                <span>ยอดรวมสุทธิ (รวม VAT):</span>
                <span className="text-[#800020]">฿{activeReceipt.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#94A3B8] pt-0.5">
                <span>(ภาษีมูลค่าเพิ่ม VAT 7%):</span>
                <span>฿{activeReceipt.vat.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-1 text-[#64748B] mb-6">
              <div className="flex justify-between">
                <span>ประเภท:</span> <span>{activeReceipt.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span>วิธีชำระ:</span> <span>{activeReceipt.paymentMethod}</span>
              </div>
            </div>

            <div className="flex gap-3 font-sans no-print">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#800020] hover:bg-[#5C0017] text-white font-black py-3.5 rounded-2xl flex justify-center items-center gap-2 cursor-pointer text-xs transition shadow-md uppercase tracking-wider"
              >
                <Printer size={15} /> พิมพ์สลิป
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-5 border border-[#E2E8F0] rounded-2xl font-bold text-[#334155] hover:bg-[#F1F5F9] cursor-pointer text-xs transition"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Password PIN Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-7 relative border border-[#E2E8F0] animate-fadeIn">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-5 top-5 text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-full hover:bg-[#F1F5F9] transition"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#FEF3C7] text-[#B45309] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border border-[#D4AF37]/30">
                <KeyRound size={24} />
              </div>
              <h3 className="text-lg font-black text-[#0F172A]">ยืนยันรหัสผ่านผู้ดูแลระบบ</h3>
              <p className="text-xs font-semibold text-[#64748B] mt-1">
                กรอกรหัสผ่านเพื่อเข้าใช้งาน Dashboard & Admin
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="• • • •"
                  className="w-full text-center text-2xl py-3.5 bg-[#FAF7F2] border border-[#E2E8F0] rounded-2xl focus:ring-2 focus:ring-[#800020] outline-none font-black text-[#0F172A]"
                />
                {pinError && (
                  <p className="text-[#EF4444] text-xs font-bold text-center mt-2.5 flex items-center justify-center gap-1">
                    <AlertCircle size={14} /> {pinError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#800020] hover:bg-[#5C0017] text-white font-black py-4 rounded-2xl shadow-md transition cursor-pointer text-xs uppercase tracking-wider"
              >
                เข้าสู่ระบบ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Explicit Confirmation Dialog Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-7 border border-[#E2E8F0] animate-fadeIn text-center">
            <div className="w-12 h-12 bg-[#FEF2F2] text-[#EF4444] rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-black text-[#0F172A]">{confirmModalTitle}</h3>
            <p className="text-xs text-[#64748B] font-medium mt-1 mb-6">{confirmModalMessage}</p>

            <div className="flex gap-3">
              <button
                onClick={closeConfirmation}
                className="flex-1 py-3 rounded-2xl border border-[#E2E8F0] font-extrabold text-xs text-[#334155] hover:bg-[#F1F5F9] cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleExecuteConfirmation}
                className="flex-1 py-3 rounded-2xl bg-[#EF4444] hover:bg-[#DC2626] font-extrabold text-xs text-white cursor-pointer shadow-md"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirm Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-7 relative border border-[#E2E8F0] animate-fadeIn">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute right-5 top-5 text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-full hover:bg-[#F1F5F9] transition"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#FEF2F2] text-[#EF4444] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                <LogoutIcon size={24} />
              </div>
              <h3 className="text-lg font-black text-[#0F172A]">ยืนยันการออกจากระบบ</h3>
              <p className="text-xs font-semibold text-[#64748B] mt-1">
                การออกจากระบบจะทำการล็อกส่วน Dashboard และ Admin
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 border border-[#E2E8F0] rounded-2xl font-black text-[#334155] hover:bg-[#F1F5F9] py-3.5 text-xs transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] text-white font-black py-3.5 rounded-2xl shadow-md transition cursor-pointer text-xs uppercase tracking-wider"
              >
                ยืนยันล็อกเอาต์
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}