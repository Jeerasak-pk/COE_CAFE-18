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
  Sparkles,
  Ban,
} from "lucide-react";

// --- Master Initial Data ---
const initialCategories = [
  { id: "all", name: "ทั้งหมด" },
  {
    id: "coffee",
    name: "Coffee",
    subCategories: [
      { id: "all", name: "ทั้งหมดใน Coffee" },
      { id: "hot", name: "Hot (ร้อน)" },
      { id: "iced", name: "Iced (เย็น)" },
      { id: "frappe", name: "Frappe (ปั่น)" },
    ],
  },
  {
    id: "non-coffee",
    name: "Non-Coffee",
    subCategories: [
      { id: "all", name: "ทั้งหมดใน Non-Coffee" },
      { id: "tea", name: "Tea & Matcha" },
      { id: "chocolate", name: "Chocolate & Milk" },
      { id: "soda", name: "Italian Soda" },
    ],
  },
  {
    id: "bakery",
    name: "Bakery",
    subCategories: [
      { id: "all", name: "ทั้งหมดใน Bakery" },
      { id: "croissant", name: "Croissant" },
      { id: "cake", name: "Cake" },
      { id: "toast", name: "Toast" },
    ],
  },
];

const initialIngredients = [
  {
    id: "ing_beans",
    name: "เมล็ดกาแฟ Special Blend",
    stock: 2500,
    unit: "กรัม",
    minStock: 500,
  },
  {
    id: "ing_milk",
    name: "นมสดเมจิ พาสเจอร์ไรส์",
    stock: 6000,
    unit: "มล.",
    minStock: 1000,
  },
  {
    id: "ing_oat_milk",
    name: "Oatly Oat Milk",
    stock: 3000,
    unit: "มล.",
    minStock: 500,
  },
  {
    id: "ing_matcha",
    name: "ผงมัทฉะอุจิเกรดพิธีการ",
    stock: 800,
    unit: "กรัม",
    minStock: 200,
  },
  {
    id: "ing_syrup",
    name: "ไซรัปกลิ่นวานิลลา",
    stock: 1200,
    unit: "มล.",
    minStock: 200,
  },
  {
    id: "ing_cups",
    name: "แก้ว Warm Craft 16oz",
    stock: 150,
    unit: "ใบ",
    minStock: 30,
  },
];

const initialMenuItems = [
  {
    id: 1,
    category: "coffee",
    subCategory: "iced",
    name: "Matcha Espresso Latte",
    price: 120,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400",
    inStock: true,
    sweetnessOptions: ["100%", "50%", "0%"],
    milkOptions: [
      {
        id: "fresh",
        label: "นมสดธรรมดา",
        price: 0,
        ingId: "ing_milk",
        amount: 150,
      },
      {
        id: "oat",
        label: "นมโอ๊ต (Oat Milk)",
        price: 20,
        ingId: "ing_oat_milk",
        amount: 150,
      },
    ],
    addons: [
      {
        id: "shot",
        label: "เพิ่ม Shot กาแฟ",
        price: 25,
        ingId: "ing_beans",
        amount: 9,
      },
      {
        id: "syrup",
        label: "เพิ่ม ไซรัปวานิลลา",
        price: 15,
        ingId: "ing_syrup",
        amount: 15,
      },
    ],
    recipe: [
      { ingId: "ing_beans", amount: 18 },
      { ingId: "ing_matcha", amount: 10 },
      { ingId: "ing_cups", amount: 1 },
    ],
  },
  {
    id: 2,
    category: "coffee",
    subCategory: "iced",
    name: "Iced Americano",
    price: 85,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400",
    inStock: true,
    sweetnessOptions: ["100%", "50%", "0%"],
    milkOptions: [],
    addons: [
      {
        id: "shot",
        label: "เพิ่ม Shot กาแฟ",
        price: 25,
        ingId: "ing_beans",
        amount: 9,
      },
    ],
    recipe: [
      { ingId: "ing_beans", amount: 18 },
      { ingId: "ing_cups", amount: 1 },
    ],
  },
  {
    id: 3,
    category: "bakery",
    subCategory: "croissant",
    name: "French Butter Croissant",
    price: 75,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    inStock: true,
    sweetnessOptions: [],
    milkOptions: [],
    addons: [{ id: "butter", label: "เนยฝรั่งเศสแท้", price: 15 }],
    recipe: [],
  },
];

const initialPromotions = [
  {
    id: "p1",
    code: "WELCOME10",
    name: "ส่วนลดต้อนรับสมาชิก",
    type: "percent",
    value: 10,
    minSpend: 100,
    active: true,
  },
  {
    id: "p2",
    code: "COFFEE20",
    name: "ส่วนลดพิเศษสายกาแฟ",
    type: "fixed",
    value: 20,
    minSpend: 150,
    active: true,
  },
];

const initialExpenses = [
  {
    id: "e1",
    title: "ซื้อเมล็ดกาแฟ Special Blend 5kg",
    category: "raw_material",
    amount: 2500,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "e2",
    title: "เครื่องบดกาแฟสำรอง",
    category: "equipment",
    amount: 4500,
    date: new Date().toISOString().split("T")[0],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("pos");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [menuItems, setMenuItems] = useState([]);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [orderHistory, setOrderHistory] = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [orderQueueCount, setOrderQueueCount] = useState(1);

  const [promotions, setPromotions] = useState(initialPromotions);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const todayObj = new Date();
  const [selectedYear, setSelectedYear] = useState(todayObj.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(todayObj.getMonth());
  const [selectedDay, setSelectedDay] = useState(String(todayObj.getDate()));

  // 🔄 🔥 Supabase Fetch & Realtime Subscription
  const fetchAllData = async () => {
    try {
      // 1. Fetch Menu Items
      const { data: menuData } = await supabase.from("menu_items").select("*");
      if (menuData && menuData.length > 0) {
        setMenuItems(menuData);
      } else {
        setMenuItems(initialMenuItems);
      }

      // 2. Fetch Orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersData) {
        const formattedOrders = ordersData.map((o) => ({
          id: o.id,
          queueNo: o.queue_no,
          total: o.total,
          status: o.status,
          orderType: o.order_type,
          paymentMethod: o.payment_method,
          items: o.items || [],
          date: new Date(o.created_at).toLocaleDateString("th-TH"),
          time: new Date(o.created_at).toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          createdAt: o.created_at,
          subtotal: o.total,
          vat: (o.total * 7) / 107,
          discount: 0,
        }));
        setOrderHistory(formattedOrders);
        setKitchenOrders(
          formattedOrders.filter(
            (o) => o.status === "pending" || o.status === "preparing"
          )
        );
        setOrderQueueCount(ordersData.length + 1);
      }
    } catch (err) {
      console.error("Error fetching data from Supabase:", err);
    }
  };

  useEffect(() => {
    fetchAllData();

    // 📡 เปิดใช้งาน Realtime Listener ให้ Sync ข้ามเครื่อง
    const channel = supabase
      .channel("realtime-orders-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchAllData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const [adminSubTab, setAdminSubTab] = useState("menu");

  const [isManagementAuthenticated, setIsManagementAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [targetTabAfterAuth, setTargetTabAfterAuth] = useState("admin");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const MANAGEMENT_PIN = "1234";

  const [selectedItemForCustom, setSelectedItemForCustom] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [orderType, setOrderType] = useState("Dine-in");
  const [cashReceived, setCashReceived] = useState("");
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isShiftCloseOpen, setIsShiftCloseOpen] = useState(false);
  const [customDiscount, setCustomDiscount] = useState(0);

  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: "",
    price: "",
    category: "coffee",
    subCategory: "hot",
    image: "",
    inStock: true,
    sweetnessText: "100%, 50%, 0%",
    milkText: "นมสดธรรมดา (+0), นมโอ๊ต (+20)",
    addonsText: "เพิ่ม Shot กาแฟ (+25), เพิ่ม ไซรัปวานิลลา (+15)",
    recipe: [],
  });

  const [selectedIngForRecipe, setSelectedIngForRecipe] = useState("");
  const [recipeIngAmount, setRecipeIngAmount] = useState("");

  const [newSweetness, setNewSweetness] = useState("");
  const [newMilk, setNewMilk] = useState("");

  const [addonName, setAddonName] = useState("");
  const [addonPrice, setAddonPrice] = useState("");
  const [selectedAddonIng, setSelectedAddonIng] = useState("");
  const [addonIngAmount, setAddonIngAmount] = useState("");

  const [ingForm, setIngForm] = useState({
    name: "",
    stock: "",
    unit: "กรัม",
    minStock: "",
  });

  const [promoForm, setPromoForm] = useState({
    code: "",
    name: "",
    type: "percent",
    value: "",
    minSpend: "",
  });

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "raw_material",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [sweetness, setSweetness] = useState("");
  const [milk, setMilk] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [itemNote, setItemNote] = useState("");
  const [customQty, setCustomQty] = useState(1);

  useEffect(() => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => {
        if (!item.recipe || item.recipe.length === 0) return item;

        const hasEnoughIngredients = item.recipe.every((r) => {
          const ing = ingredients.find((i) => i.id === r.ingId);
          return ing && ing.stock >= r.amount;
        });

        if (item.inStock !== hasEnoughIngredients) {
          return { ...item, inStock: hasEnoughIngredients };
        }
        return item;
      })
    );
  }, [ingredients]);

  const isItemInStock = (item) => {
    if (!item.inStock) return false;
    if (!item.recipe || item.recipe.length === 0) return true;
    return item.recipe.every((r) => {
      const ing = ingredients.find((i) => i.id === r.ingId);
      return ing && ing.stock >= r.amount;
    });
  };

  const handleProtectedTabClick = (tabName) => {
    if (isManagementAuthenticated) {
      setActiveTab(tabName);
    } else {
      setTargetTabAfterAuth(tabName);
      setIsAuthModalOpen(true);
      setPinInput("");
      setPinError(false);
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (pinInput === MANAGEMENT_PIN) {
      setIsManagementAuthenticated(true);
      setIsAuthModalOpen(false);
      setActiveTab(targetTabAfterAuth);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogoutConfirm = () => {
    setIsManagementAuthenticated(false);
    setIsLogoutModalOpen(false);
    setActiveTab("pos");
  };

  const handleItemClick = (item) => {
    if (!isItemInStock(item)) return;
    setSelectedItemForCustom(item);
    setSweetness(item.sweetnessOptions?.[0] || "100%");
    setMilk(item.milkOptions?.[0] || null);
    setSelectedAddons([]);
    setItemNote("");
    setCustomQty(1);
  };

  const handleAddCustomizedToCart = () => {
    const milkPrice = milk ? milk.price : 0;
    const addonPrice = selectedAddons.reduce(
      (sum, addon) => sum + addon.price,
      0
    );
    const unitPrice = selectedItemForCustom.price + milkPrice + addonPrice;

    const addonsLabel = selectedAddons.map((a) => a.label).join(", ");
    const milkLabel = milk ? milk.label : "";
    const optionsText =
      [sweetness, milkLabel, addonsLabel].filter(Boolean).join(" • ") || "ปกติ";
    const noteText = itemNote.trim();

    const cartId = `${selectedItemForCustom.id}-${optionsText}-${noteText}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) =>
          i.cartId === cartId ? { ...i, qty: i.qty + customQty } : i
        );
      }
      return [
        ...prev,
        {
          ...selectedItemForCustom,
          cartId,
          optionsText,
          noteText,
          unitPrice,
          qty: customQty,
          selectedMilk: milk,
          selectedAddonsList: selectedAddons,
        },
      ];
    });

    setSelectedItemForCustom(null);
  };

  const updateQty = (cartId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.unitPrice * item.qty,
    0
  );

  let calculatedPromoDiscount = 0;
  if (selectedPromo && subtotal >= selectedPromo.minSpend) {
    if (selectedPromo.type === "percent") {
      calculatedPromoDiscount = (subtotal * selectedPromo.value) / 100;
    } else {
      calculatedPromoDiscount = selectedPromo.value;
    }
  }

  const effectiveDiscount = Math.max(
    Number(customDiscount),
    calculatedPromoDiscount
  );

  const total = Math.max(0, subtotal - effectiveDiscount);
  const vat = (total * 7) / 107;

  // 🔥 ฟังก์ชันหักสต็อกวัตถุดิบ (เรียกเมื่อกด "ทำเสร็จสิ้น" ในครัว)
  const deductInventoryStock = (cartItems) => {
    setIngredients((prevIngs) => {
      const updated = [...prevIngs];
      cartItems.forEach((cartItem) => {
        const qty = cartItem.qty;

        if (cartItem.recipe) {
          cartItem.recipe.forEach((r) => {
            const idx = updated.findIndex((i) => i.id === r.ingId);
            if (idx !== -1) {
              updated[idx] = {
                ...updated[idx],
                stock: Math.max(0, updated[idx].stock - r.amount * qty),
              };
            }
          });
        }

        if (cartItem.selectedMilk && cartItem.selectedMilk.ingId) {
          const idx = updated.findIndex(
            (i) => i.id === cartItem.selectedMilk.ingId
          );
          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              stock: Math.max(
                0,
                updated[idx].stock - cartItem.selectedMilk.amount * qty
              ),
            };
          }
        }

        if (cartItem.selectedAddonsList && cartItem.selectedAddonsList.length > 0) {
          cartItem.selectedAddonsList.forEach((addon) => {
            if (addon.ingId && addon.amount) {
              const idx = updated.findIndex((i) => i.id === addon.ingId);
              if (idx !== -1) {
                updated[idx] = {
                  ...updated[idx],
                  stock: Math.max(
                    0,
                    updated[idx].stock - addon.amount * qty
                  ),
                };
              }
            }
          });
        }
      });
      return updated;
    });
  };

  const handleProcessPayment = async () => {
    const orderTime = new Date();
    const orderId = `INV-${orderTime.getTime().toString().slice(-6)}`;
    const queueNo = `#${String(orderQueueCount).padStart(2, "0")}`;

    const newOrderPayload = {
      id: orderId,
      queue_no: queueNo,
      total: total,
      status: "pending",
      order_type: orderType,
      payment_method: paymentMethod === "qr" ? "สแกน QR Code" : "เงินสด",
      items: cart,
    };

    try {
      await supabase.from("orders").insert([newOrderPayload]);
    } catch (err) {
      console.error("Failed to save order to Supabase:", err);
    }

    setIsCheckoutOpen(false);
    setCart([]);
    setCashReceived("");
    setCustomDiscount(0);
    setSelectedPromo(null);
  };

  // 🔥 อัปเดตสถานะออเดอร์ (รองรับ Supabase Sync + ลบโดยไม่คิดเงิน/ไม่ตัดสต็อก)
  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    const targetOrder = kitchenOrders.find((o) => o.id === orderId);

    if (nextStatus === "completed") {
      if (targetOrder) {
        deductInventoryStock(targetOrder.items);
      }
      try {
        await supabase.from("orders").update({ status: "completed" }).eq("id", orderId);
      } catch (err) {
        console.error("Failed to update status in Supabase:", err);
      }
    } else if (nextStatus === "cancelled") {
      if (
        confirm(
          `คุณต้องการยกเลิกคำสั่งซื้อ ${targetOrder?.queueNo} ใช่หรือไม่? (จะไม่ทำการตัดสต็อกวัตถุดิบและไม่นำไปคิดยอดขาย)`
        )
      ) {
        try {
          await supabase.from("orders").update({ status: "cancelled" }).eq("id", orderId);
        } catch (err) {
          console.error("Failed to cancel order in Supabase:", err);
        }
      }
    } else {
      try {
        await supabase.from("orders").update({ status: nextStatus }).eq("id", orderId);
      } catch (err) {
        console.error("Failed to update status in Supabase:", err);
      }
    }
  };

  const handleSaveIngredient = (e) => {
    e.preventDefault();
    if (!ingForm.name || !ingForm.stock) return;

    const newIng = {
      id: `ing_${Date.now()}`,
      name: ingForm.name,
      stock: Number(ingForm.stock),
      unit: ingForm.unit,
      minStock: Number(ingForm.minStock) || 100,
    };

    setIngredients((prev) => [...prev, newIng]);
    setIngForm({ name: "", stock: "", unit: "กรัม", minStock: "" });
  };

  const handleDeleteIngredient = (id) => {
    if (confirm("คุณต้องการลบวัตถุดิบรายการนี้ใช่หรือไม่?")) {
      setIngredients((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleSavePromotion = (e) => {
    e.preventDefault();
    if (!promoForm.code || !promoForm.value) return;

    const newPromo = {
      id: `p_${Date.now()}`,
      code: promoForm.code.toUpperCase(),
      name: promoForm.name,
      type: promoForm.type,
      value: Number(promoForm.value),
      minSpend: Number(promoForm.minSpend) || 0,
      active: true,
    };

    setPromotions((prev) => [...prev, newPromo]);
    setPromoForm({
      code: "",
      name: "",
      type: "percent",
      value: "",
      minSpend: "",
    });
  };

  const togglePromotionStatus = (id) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleDeletePromotion = (id) => {
    if (confirm("คุณต้องการลบโปรโมชั่นนี้ใช่หรือไม่?")) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;

    const newExp = {
      id: `e_${Date.now()}`,
      title: expenseForm.title,
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      date: expenseForm.date,
    };

    setExpenses((prev) => [newExp, ...prev]);
    setExpenseForm({
      title: "",
      category: "raw_material",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleDeleteExpense = (id) => {
    if (confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const handleAddIngToRecipe = () => {
    if (
      !selectedIngForRecipe ||
      !recipeIngAmount ||
      Number(recipeIngAmount) <= 0
    )
      return;

    setItemForm((prev) => {
      const existingIdx = prev.recipe.findIndex(
        (r) => r.ingId === selectedIngForRecipe
      );
      let updatedRecipe = [...prev.recipe];
      if (existingIdx !== -1) {
        updatedRecipe[existingIdx] = {
          ...updatedRecipe[existingIdx],
          amount: Number(recipeIngAmount),
        };
      } else {
        updatedRecipe.push({
          ingId: selectedIngForRecipe,
          amount: Number(recipeIngAmount),
        });
      }
      return { ...prev, recipe: updatedRecipe };
    });

    setSelectedIngForRecipe("");
    setRecipeIngAmount("");
  };

  const handleRemoveIngFromRecipe = (ingId) => {
    setItemForm((prev) => ({
      ...prev,
      recipe: prev.recipe.filter((r) => r.ingId !== ingId),
    }));
  };

  const addSweetnessOption = () => {
    const val = newSweetness.trim();
    if (!val) return;
    const current = itemForm.sweetnessText
      ? itemForm.sweetnessText.split(",").map((s) => s.trim())
      : [];
    setItemForm({ ...itemForm, sweetnessText: [...current, val].join(", ") });
    setNewSweetness("");
  };

  const addMilkOption = () => {
    const val = newMilk.trim();
    if (!val) return;
    const current = itemForm.milkText
      ? itemForm.milkText.split(",").map((s) => s.trim())
      : [];
    setItemForm({ ...itemForm, milkText: [...current, val].join(", ") });
    setNewMilk("");
  };

  const handleAddAddonOption = () => {
    if (!addonName) return;
    const price = Number(addonPrice) || 0;

    let addonString = `${addonName} (+${price})`;
    if (selectedAddonIng && addonIngAmount) {
      addonString += ` [${selectedAddonIng}:${addonIngAmount}]`;
    }

    const current = itemForm.addonsText
      ? itemForm.addonsText.split(",").map((s) => s.trim())
      : [];

    setItemForm({
      ...itemForm,
      addonsText: [...current, addonString].join(", "),
    });

    setAddonName("");
    setAddonPrice("");
    setSelectedAddonIng("");
    setAddonIngAmount("");
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.price) return;

    const sweetnessOptions = itemForm.sweetnessText
      ? itemForm.sweetnessText.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const milkOptions = itemForm.milkText
      ? itemForm.milkText
          .split(",")
          .map((m, idx) => {
            const match = m.match(/(.+)\s*\(\+(\d+)\)/);
            if (match) {
              return {
                id: `m_${idx}_${Date.now()}`,
                label: match[1].trim(),
                price: Number(match[2]),
              };
            }
            return { id: `m_${idx}_${Date.now()}`, label: m.trim(), price: 0 };
          })
          .filter((m) => m.label)
      : [];

    const addons = itemForm.addonsText
      ? itemForm.addonsText
          .split(",")
          .map((a, idx) => {
            const match = a.match(/(.+)\s*\(\+(\d+)\)(?:\s*\[(.+):(\d+)\])?/);
            if (match) {
              return {
                id: `a_${idx}_${Date.now()}`,
                label: match[1].trim(),
                price: Number(match[2]),
                ingId: match[3] ? match[3].trim() : null,
                amount: match[4] ? Number(match[4]) : 0,
              };
            }
            return { id: `a_${idx}_${Date.now()}`, label: a.trim(), price: 0 };
          })
          .filter((a) => a.label)
      : [];

    const itemPayload = {
      name: itemForm.name,
      price: Number(itemForm.price),
      category: itemForm.category,
      subCategory: itemForm.subCategory,
      image:
        itemForm.image ||
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400",
      inStock: itemForm.inStock,
      sweetnessOptions,
      milkOptions,
      addons,
      recipe: itemForm.recipe || [],
    };

    try {
      if (editingItem) {
        await supabase.from("menu_items").update(itemPayload).eq("id", editingItem.id);
      } else {
        await supabase.from("menu_items").insert([itemPayload]);
      }
      fetchAllData();
    } catch (err) {
      console.error("Supabase operation failed:", err);
    }

    setEditingItem(null);
    setItemForm({
      name: "",
      price: "",
      category: "coffee",
      subCategory: "hot",
      image: "",
      inStock: true,
      sweetnessText: "100%, 50%, 0%",
      milkText: "นมสดธรรมดา (+0)",
      addonsText: "เพิ่ม Shot กาแฟ (+25)",
      recipe: [],
    });
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      price: item.price,
      category: item.category,
      subCategory: item.subCategory || "all",
      image: item.image,
      inStock: item.inStock ?? true,
      sweetnessText: item.sweetnessOptions
        ? item.sweetnessOptions.join(", ")
        : "",
      milkText: item.milkOptions
        ? item.milkOptions.map((m) => `${m.label} (+${m.price})`).join(", ")
        : "",
      addonsText: item.addons
        ? item.addons
            .map((a) =>
              a.ingId && a.amount
                ? `${a.label} (+${a.price}) [${a.ingId}:${a.amount}]`
                : `${a.label} (+${a.price})`
            )
            .join(", ")
        : "",
      recipe: item.recipe || [],
    });
  };

  const handleDeleteItem = async (id) => {
    if (confirm("คุณต้องการลบรายการสินค้านี้ใช่หรือไม่?")) {
      try {
        await supabase.from("menu_items").delete().eq("id", id);
        fetchAllData();
      } catch (err) {
        console.error("Supabase delete failed:", err);
      }
    }
  };

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
    const isDayMatch = selectedDay === "" || d.getDate() === Number(selectedDay);
    return isYearMatch && isMonthMatch && isDayMatch;
  };

  const isExpenseInSelectedRange = (exp) => {
    const d = new Date(exp.date);
    const isYearMatch = d.getFullYear() === Number(selectedYear);
    const isMonthMatch = d.getMonth() === Number(selectedMonth);
    const isDayMatch = selectedDay === "" || d.getDate() === Number(selectedDay);
    return isYearMatch && isMonthMatch && isDayMatch;
  };

  // 🔥 คัดออเดอร์ที่ไม่โดนยกเลิกมาคำนวณยอดขาย
  const validOrderHistory = orderHistory.filter((o) => o.status !== "cancelled");
  const filteredDashboardOrders = validOrderHistory.filter(isOrderInSelectedRange);
  const filteredDashboardExpenses = expenses.filter(isExpenseInSelectedRange);

  const filterRevenue = filteredDashboardOrders.reduce((acc, o) => acc + o.total, 0);
  const filterExpenses = filteredDashboardExpenses.reduce((acc, e) => acc + e.amount, 0);
  const filterNetProfit = filterRevenue - filterExpenses;
  const filterOrdersCount = filteredDashboardOrders.length;
  const filterAvgValue =
    filterOrdersCount > 0 ? filterRevenue / filterOrdersCount : 0;

  const totalRevenueAll = validOrderHistory.reduce((acc, o) => acc + o.total, 0);
  const totalExpensesAll = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalOrdersCountAll = validOrderHistory.length;
  const totalItemsSoldAll = validOrderHistory.reduce(
    (acc, order) =>
      acc + order.items.reduce((itemAcc, item) => itemAcc + item.qty, 0),
    0
  );

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
      const dayExpenses = expenses.filter((e) => {
        const d = new Date(e.date);
        return (
          d.getFullYear() === Number(selectedYear) &&
          d.getMonth() === Number(selectedMonth) &&
          d.getDate() === day
        );
      });

      const rev = dayOrders.reduce((sum, o) => sum + o.total, 0);
      const exp = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

      dailyData.push({
        day,
        revenue: rev,
        expense: exp,
        profit: rev - exp,
        ordersCount: dayOrders.length,
      });
    }
    return dailyData;
  };

  const dailyBreakdown = getDailyBreakdownForSelectedMonth();

  const catSales = { coffee: 0, "non-coffee": 0, bakery: 0 };
  filteredDashboardOrders.forEach((o) => {
    o.items.forEach((i) => {
      const cat = i.category || "coffee";
      catSales[cat] = (catSales[cat] || 0) + i.unitPrice * i.qty;
    });
  });

  const getItemSalesFiltered = () => {
    const map = {};
    filteredDashboardOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!map[item.name]) {
          map[item.name] = {
            name: item.name,
            qty: 0,
            revenue: 0,
            image: item.image,
            category: item.category,
          };
        }
        map[item.name].qty += item.qty;
        map[item.name].revenue += item.unitPrice * item.qty;
      });
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty);
  };

  const filteredBestSellers = getItemSalesFiltered();

  const getWeeklySalesData = () => {
    const days = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสฯ",
      "ศุกร์",
      "เสาร์",
    ];
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("th-TH");
      const dayName = i === 0 ? "วันนี้" : days[d.getDay()];

      const daySales = validOrderHistory
        .filter((order) => order.date === dateStr)
        .reduce((sum, order) => sum + order.total, 0);

      result.push({ day: dayName, sales: daySales, date: dateStr });
    }
    return result;
  };

  const weeklySalesData = getWeeklySalesData();
  const maxWeeklySale = Math.max(...weeklySalesData.map((d) => d.sales), 1000);

  const getMonthlySalesData = () => {
    const monthNames = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const result = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - i);

      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();

      const monthSales = validOrderHistory
        .filter((order) => {
          const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
          return (
            orderDate.getFullYear() === targetYear &&
            orderDate.getMonth() === targetMonth
          );
        })
        .reduce((sum, order) => sum + order.total, 0);

      result.push({
        monthName: monthNames[targetMonth],
        sales: monthSales,
      });
    }
    return result;
  };

  const monthlySalesData = getMonthlySalesData();
  const maxMonthlySale = Math.max(
    ...monthlySalesData.map((m) => m.sales),
    2000
  );

  const activeCategoryObj = initialCategories.find(c => c.id === selectedCategory);
  const adminSelectedCategoryObj = initialCategories.find(c => c.id === itemForm.category);

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSubCategory = selectedSubCategory === "all" || !selectedSubCategory || item.subCategory === selectedSubCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-[#F8F5F0] text-[#2C221E] font-sans antialiased overflow-hidden selection:bg-[#B08968] selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-22 bg-gradient-to-b from-[#120E0C] via-[#1A1412] to-[#0F0B0A] flex flex-col items-center py-7 justify-between text-[#E6DFD5] z-30 shrink-0 shadow-2xl border-r border-[#2C231F]">
        <div className="flex flex-col items-center gap-9 w-full px-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4A373] via-[#B08968] to-[#8C6239] rounded-2xl blur-md opacity-50 group-hover:opacity-90 transition duration-500"></div>
            <div className="relative p-3.5 bg-[#211A17] text-[#E6C5A2] rounded-2xl flex items-center justify-center shadow-2xl border border-[#3D2F28]">
              <Coffee size={24} className="text-[#D4A373] transform group-hover:scale-110 transition duration-300" />
            </div>
          </div>

          <nav className="flex flex-col gap-4 w-full items-center">
            <button
              onClick={() => setActiveTab("pos")}
              title="หน้าขาย (POS)"
              className={`p-3.5 rounded-2xl transition duration-300 cursor-pointer relative group ${
                activeTab === "pos"
                  ? "bg-gradient-to-br from-[#B08968] to-[#8C6239] text-white shadow-lg shadow-[#B08968]/30 -translate-y-0.5"
                  : "text-[#9E8E81] hover:bg-[#251D19] hover:text-[#E6C5A2]"
              }`}
            >
              <ShoppingBag size={21} />
              {activeTab === "pos" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#E6C5A2] rounded-l-full shadow-glow"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("kitchen")}
              title="จอแสดงผลในครัว (Kitchen Display)"
              className={`p-3.5 rounded-2xl transition duration-300 cursor-pointer relative group ${
                activeTab === "kitchen"
                  ? "bg-gradient-to-br from-[#B08968] to-[#8C6239] text-white shadow-lg shadow-[#B08968]/30 -translate-y-0.5"
                  : "text-[#9E8E81] hover:bg-[#251D19] hover:text-[#E6C5A2]"
              }`}
            >
              <UtensilsCrossed size={21} />
              {kitchenOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E07A5F] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md border-2 border-[#120E0C]">
                  {kitchenOrders.length}
                </span>
              )}
              {activeTab === "kitchen" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#E6C5A2] rounded-l-full shadow-glow"></span>
              )}
            </button>

            <button
              onClick={() => handleProtectedTabClick("dashboard")}
              title="แดชบอร์ด & ประวัติคำสั่งซื้อ"
              className={`p-3.5 rounded-2xl transition duration-300 cursor-pointer relative group ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-br from-[#B08968] to-[#8C6239] text-white shadow-lg shadow-[#B08968]/30 -translate-y-0.5"
                  : "text-[#9E8E81] hover:bg-[#251D19] hover:text-[#E6C5A2]"
              }`}
            >
              <LayoutDashboard size={21} />
              {!isManagementAuthenticated && (
                <Lock
                  size={11}
                  className="absolute top-2 right-2 text-[#D4A373]"
                />
              )}
              {activeTab === "dashboard" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#E6C5A2] rounded-l-full shadow-glow"></span>
              )}
            </button>

            <button
              onClick={() => handleProtectedTabClick("admin")}
              title="จัดการระบบ Admin Panel"
              className={`p-3.5 rounded-2xl transition duration-300 cursor-pointer relative group ${
                activeTab === "admin"
                  ? "bg-gradient-to-br from-[#B08968] to-[#8C6239] text-white shadow-lg shadow-[#B08968]/30 -translate-y-0.5"
                  : "text-[#9E8E81] hover:bg-[#251D19] hover:text-[#E6C5A2]"
              }`}
            >
              <Settings size={21} />
              {!isManagementAuthenticated && (
                <Lock
                  size={11}
                  className="absolute top-2 right-2 text-[#D4A373]"
                />
              )}
              {activeTab === "admin" && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#E6C5A2] rounded-l-full shadow-glow"></span>
              )}
            </button>
          </nav>
        </div>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          title="ออกจากระบบ"
          className="p-3.5 text-[#9E8E81] hover:text-[#E07A5F] rounded-2xl cursor-pointer transition duration-300 hover:bg-[#251D19]"
        >
          <LogOut size={20} />
        </button>
      </aside>

      {/* POS Screen */}
      {activeTab === "pos" && (
        <>
          <main className="flex-1 flex flex-col p-8 overflow-hidden bg-[#F8F5F0]">
            <header className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-[#2C221E] tracking-tight flex items-center gap-2">
                    Warm Craft POS <Sparkles size={18} className="text-[#D4A373]" />
                  </h1>
                  <span className="bg-gradient-to-r from-[#EFE6DC] to-[#E3D6C8] text-[#7A542E] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-[#D4A373]/30 shadow-xs">
                    Specialty Edition
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#8C7E75] mt-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#2E6F40] animate-pulse"></span>
                  คิวถัดไป:{" "}
                  <span className="font-extrabold text-[#B08968]">
                    #{String(orderQueueCount).padStart(2, "0")}
                  </span>{" "}
                  <span className="text-[#C4B7AC]">|</span> บาริสต้า: Barista #01
                </p>
              </div>

              <div className="relative w-84">
                <Search
                  className="absolute left-4 top-3.5 text-[#B0A499]"
                  size={17}
                />
                <input
                  type="text"
                  placeholder="ค้นหาเมนูเครื่องดื่ม หรือ เบเกอรี..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-md rounded-2xl border border-[#E2D9CE] focus:outline-none focus:ring-2 focus:ring-[#B08968] focus:border-transparent shadow-xs text-xs font-semibold transition placeholder:text-[#B0A499]"
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
                      ? "bg-[#2C221E] text-white shadow-lg shadow-[#2C221E]/20 border border-[#2C221E] -translate-y-0.5"
                      : "bg-white text-[#5C4A42] hover:bg-[#EFE6DC]/50 border border-[#E2D9CE] shadow-xs"
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
                        ? "bg-[#B08968] text-white shadow-xs"
                        : "bg-[#EFE6DC]/40 text-[#8C6239] hover:bg-[#EFE6DC] border border-[#D4A373]/20"
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
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`bg-white rounded-3xl p-4 border border-[#E6DDD3] hover:border-[#B08968] transition-all duration-300 flex flex-col justify-between group h-68 relative overflow-hidden shadow-xs hover:shadow-xl ${
                        inStock
                          ? "cursor-pointer hover:-translate-y-1.5"
                          : "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {!inStock && (
                        <span className="absolute top-3 right-3 bg-[#E07A5F] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full z-10 shadow-md uppercase tracking-wider">
                          {!item.inStock ? "สินค้าหมด" : "วัตถุดิบหมด"}
                        </span>
                      )}

                      <div className="w-full h-38 rounded-2xl overflow-hidden mb-3 bg-[#F5EFE6] shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      </div>

                      <div className="flex flex-col justify-between flex-1">
                        <h3 className="font-extrabold text-[#2C221E] text-xs line-clamp-1 group-hover:text-[#B08968] transition duration-200">
                          {item.name}
                        </h3>
                        <div className="flex justify-between items-center mt-2.5">
                          <p className="text-[#B08968] font-black text-base">
                            ฿{item.price.toFixed(2)}
                          </p>
                          <span className="w-7 h-7 bg-[#F5EFE6] text-[#B08968] group-hover:bg-[#B08968] group-hover:text-white rounded-xl flex items-center justify-center transition duration-300 shadow-xs">
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
          <aside className="w-100 bg-white border-l border-[#E6DDD3] p-7 flex flex-col justify-between shadow-2xl shrink-0 z-10">
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#F5EFE6]">
                <h2 className="text-lg font-black text-[#2C221E] flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#B08968]" />{" "}
                  ตะกร้าสินค้า
                </h2>
                <span className="text-xs font-black text-[#B08968] bg-[#F5EFE6] px-3 py-1 rounded-full border border-[#D4A373]/20">
                  {cart.reduce((a, i) => a + i.qty, 0)} รายการ
                </span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[42vh] space-y-3 pr-1 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-[#A3978C]">
                    <Sparkle
                      size={36}
                      className="mx-auto mb-3 text-[#D4A373]/40 animate-pulse"
                    />
                    <p className="text-xs font-bold text-[#8C7E75]">
                      ยังไม่มีรายการในตะกร้า
                    </p>
                    <p className="text-[11px] text-[#A3978C] mt-1">
                      เลือกเมนูกาแฟหรือเบเกอรีด้านซ้ายมือ
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="flex justify-between items-center bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#E6DDD3] hover:border-[#B08968] transition duration-200 shadow-xs"
                    >
                      <div className="max-w-[190px]">
                        <p className="font-extrabold text-[#2C221E] text-xs">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-semibold text-[#8C7E75] truncate mt-0.5">
                          {item.optionsText}
                        </p>

                        {item.noteText && (
                          <p className="text-[10px] font-bold text-[#8C6239] bg-[#F5EFE6] px-2 py-0.5 rounded-md mt-1 italic w-fit flex items-center gap-1">
                            <FileText size={10} /> {item.noteText}
                          </p>
                        )}

                        <p className="text-xs text-[#B08968] font-black mt-1.5">
                          ฿{item.unitPrice}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-[#E6DDD3] shadow-xs">
                        <button
                          onClick={() => updateQty(item.cartId, -1)}
                          className="text-[#A3978C] hover:text-[#E07A5F] cursor-pointer transition"
                        >
                          <Trash2 size={13} />
                        </button>
                        <span className="text-xs font-black w-5 text-center text-[#2C221E]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.cartId, 1)}
                          className="text-[#A3978C] hover:text-[#B08968] cursor-pointer transition"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#F5EFE6]">
                  <label className="text-[11px] font-extrabold text-[#8C7E75] mb-2 flex items-center gap-1.5">
                    <Tag size={13} className="text-[#B08968]" /> เลือกโปรโมชั่น
                  </label>
                  <select
                    value={selectedPromo ? selectedPromo.id : ""}
                    onChange={(e) => {
                      const promo = promotions.find(
                        (p) => p.id === e.target.value
                      );
                      setSelectedPromo(promo || null);
                    }}
                    className="w-full p-2.5 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl text-xs font-bold text-[#2C221E] outline-none shadow-xs focus:ring-2 focus:ring-[#B08968]"
                  >
                    <option value="">-- ไม่ใช้โปรโมชั่น --</option>
                    {promotions
                      .filter((p) => p.active)
                      .map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          disabled={subtotal < p.minSpend}
                        >
                          {p.code} - {p.name} (
                          {p.type === "percent" ? `${p.value}%` : `฿${p.value}`}
                          )
                          {subtotal < p.minSpend
                            ? ` [ขั้นต่ำ ฿${p.minSpend}]`
                            : ""}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            <div className="border-t border-[#F5EFE6] pt-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[#8C7E75]">
                <span>ยอดรวม (Subtotal)</span>
                <span>฿{subtotal.toFixed(2)}</span>
              </div>
              {effectiveDiscount > 0 && (
                <div className="flex justify-between text-xs font-extrabold text-[#E07A5F]">
                  <span>ส่วนลดโปรโมชั่น/พิเศษ</span>
                  <span>-฿{effectiveDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#2C221E] pt-2.5 border-t border-[#E6DDD3]">
                <span>ยอดรวมสุทธิ (รวม VAT)</span>
                <span className="text-[#B08968] text-lg">฿{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-[#A3978C]">
                <span>(รวมภาษีมูลค่าเพิ่ม 7%)</span>
                <span>฿{vat.toFixed(2)}</span>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full mt-4 bg-gradient-to-r from-[#2C221E] to-[#1F1714] hover:from-[#1A1412] hover:to-[#0F0B0A] disabled:bg-[#E2D9CE] disabled:text-[#A3978C] text-white font-black py-4 rounded-2xl shadow-lg flex justify-center items-center gap-2 transition duration-300 cursor-pointer text-xs uppercase tracking-wider"
              >
                <CreditCard size={17} /> ชำระเงิน (฿{total.toFixed(2)})
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Kitchen Display Screen */}
      {activeTab === "kitchen" && (
        <main className="flex-1 p-8 bg-[#120E0C] text-white overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-8 border-b border-[#2C231F] pb-5">
            <div>
              <div className="flex items-center gap-3">
                <UtensilsCrossed size={32} className="text-[#D4A373]" />
                <h1 className="text-2xl font-black text-[#E6C5A2] tracking-tight">
                  Kitchen & Barista Realtime Monitor
                </h1>
              </div>
              <p className="text-xs text-[#A3978C] mt-1 font-medium">
                วัตถุดิบจะถูกตัดสต็อกจริงอัตโนมัติเมื่อกด "ทำเสร็จสิ้น" เท่านั้น
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-[#1C1614] border border-[#332823] px-5 py-2.5 rounded-2xl text-xs font-bold text-[#D4A373] flex items-center gap-2 shadow-inner">
                <Clock size={18} /> กำลังรอทำ: {kitchenOrders.length} ออเดอร์
              </span>
            </div>
          </div>

          {kitchenOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 text-[#8C7E75]">
              <CheckCircle2 size={64} className="mb-3 text-[#D4A373]/20" />
              <p className="text-lg font-extrabold text-white">
                ไม่มีรายการค้างในครัว
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6 items-start">
              {kitchenOrders.map((order) => {
                const coffeeItems = order.items.filter(
                  (i) => i.category === "coffee"
                );
                const nonCoffeeItems = order.items.filter(
                  (i) => i.category === "non-coffee"
                );
                const bakeryItems = order.items.filter(
                  (i) => i.category === "bakery"
                );
                const isPreparing = order.status === "preparing";

                return (
                  <div
                    key={order.id}
                    className={`bg-[#1C1614] rounded-3xl border flex flex-col justify-between overflow-hidden shadow-2xl h-[550px] transition-all duration-300 ${
                      isPreparing
                        ? "border-[#D4A373] ring-2 ring-[#D4A373]/30"
                        : "border-[#2C231F]"
                    }`}
                  >
                    <div
                      className={`p-4.5 flex justify-between items-center shrink-0 ${isPreparing ? "bg-gradient-to-r from-[#B08968] to-[#8C6239] text-white" : "bg-[#251D19] text-[#E6C5A2]"}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-2xl tracking-tight">
                            {order.queueNo}
                          </span>
                          <span className="text-[10px] bg-black/40 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {order.orderType === "Dine-in"
                              ? "ทานที่ร้าน"
                              : order.orderType === "Takeaway"
                              ? "กลับบ้าน"
                              : "เดลิเวอรี"}
                          </span>
                        </div>
                        <p className="text-[10px] opacity-80 mt-0.5 font-medium">
                          {order.id} • {order.time}
                        </p>
                      </div>
                      <span
                        className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                          isPreparing
                            ? "bg-white text-[#8C6239] shadow-xs"
                            : "bg-[#120E0C] text-[#D4A373]"
                        }`}
                      >
                        {isPreparing ? "กำลังทำ" : "รอดำเนินการ"}
                      </span>
                    </div>

                    <div className="p-4.5 space-y-4 flex-1 overflow-y-auto bg-[#16110F] custom-scrollbar">
                      {coffeeItems.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-[#D4A373] uppercase tracking-wider mb-2 border-b border-[#2C231F] pb-1 flex justify-between">
                            <span>☕ COFFEE</span>
                            <span>{coffeeItems.length} รายการ</span>
                          </p>
                          <div className="space-y-2.5">
                            {coffeeItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-[#FAF7F2] text-[#2C221E] p-3 rounded-2xl border border-[#E2D9CE] shadow-xs"
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-extrabold text-xs leading-snug">
                                    {item.name}
                                  </span>
                                  <span className="bg-[#E07A5F] text-white text-xs font-black px-2 py-0.5 rounded-lg shrink-0">
                                    x{item.qty}
                                  </span>
                                </div>
                                <p className="text-[11px] font-bold text-[#8C7E75] mt-1">
                                  {item.optionsText}
                                </p>
                                {item.noteText && (
                                  <p className="text-[11px] font-bold text-[#C85A3F] bg-[#FDF4F2] p-1.5 rounded-lg mt-1.5 border border-[#FADCD6] flex items-center gap-1">
                                    <FileText size={12} className="shrink-0" />{" "}
                                    * {item.noteText}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {nonCoffeeItems.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-[#D4A373] uppercase tracking-wider mb-2 border-b border-[#2C231F] pb-1 flex justify-between">
                            <span>🍵 NON-COFFEE</span>
                            <span>{nonCoffeeItems.length} รายการ</span>
                          </p>
                          <div className="space-y-2.5">
                            {nonCoffeeItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-[#FAF7F2] text-[#2C221E] p-3 rounded-2xl border border-[#E2D9CE] shadow-xs"
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-extrabold text-xs leading-snug">
                                    {item.name}
                                  </span>
                                  <span className="bg-[#E07A5F] text-white text-xs font-black px-2 py-0.5 rounded-lg shrink-0">
                                    x{item.qty}
                                  </span>
                                </div>
                                <p className="text-[11px] font-bold text-[#8C7E75] mt-1">
                                  {item.optionsText}
                                </p>
                                {item.noteText && (
                                  <p className="text-[11px] font-bold text-[#C85A3F] bg-[#FDF4F2] p-1.5 rounded-lg mt-1.5 border border-[#FADCD6] flex items-center gap-1">
                                    <FileText size={12} className="shrink-0" />{" "}
                                    * {item.noteText}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {bakeryItems.length > 0 && (
                        <div>
                          <p className="text-[10px] font-black text-[#D4A373] uppercase tracking-wider mb-2 border-b border-[#2C231F] pb-1 flex justify-between">
                            <span>🥐 BAKERY</span>
                            <span>{bakeryItems.length} รายการ</span>
                          </p>
                          <div className="space-y-2.5">
                            {bakeryItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-[#FAF7F2] text-[#2C221E] p-3 rounded-2xl border border-[#E2D9CE] shadow-xs"
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-extrabold text-xs leading-snug">
                                    {item.name}
                                  </span>
                                  <span className="bg-[#E07A5F] text-white text-xs font-black px-2 py-0.5 rounded-lg shrink-0">
                                    x{item.qty}
                                  </span>
                                </div>
                                {item.optionsText !== "ปกติ" && (
                                  <p className="text-[11px] font-bold text-[#8C7E75] mt-1">
                                    {item.optionsText}
                                  </p>
                                )}
                                {item.noteText && (
                                  <p className="text-[11px] font-bold text-[#C85A3F] bg-[#FDF4F2] p-1.5 rounded-lg mt-1.5 border border-[#FADCD6] flex items-center gap-1">
                                    <FileText size={12} className="shrink-0" />{" "}
                                    * {item.noteText}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 🔥 ปุ่มการทำงานในครัว (เริ่มทำ / ทำเสร็จสิ้น / ยกเลิกออเดอร์) */}
                    <div className="p-3.5 bg-[#1C1614] border-t border-[#2C231F] shrink-0 space-y-2">
                      {order.status === "pending" ? (
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, "preparing")
                          }
                          className="w-full bg-[#B08968] hover:bg-[#8C6239] text-white font-extrabold py-3 rounded-2xl text-xs transition cursor-pointer flex justify-center items-center gap-1.5 shadow-md uppercase tracking-wider"
                        >
                          ▶ เริ่มทำออเดอร์
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleUpdateOrderStatus(order.id, "completed")
                          }
                          className="w-full bg-[#2E6F40] hover:bg-[#235631] text-white font-extrabold py-3 rounded-2xl text-xs transition cursor-pointer flex justify-center items-center gap-1.5 shadow-md uppercase tracking-wider"
                        >
                          <Check size={16} /> ทำเสร็จสิ้น (ตัดสต็อกวัตถุดิบ)
                        </button>
                      )}

                      {/* 🔥 ปุ่มยกเลิกสินค้า (ไม่นำไปคิดยอดขาย & ไม่ตัดสต็อก) */}
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(order.id, "cancelled")
                        }
                        className="w-full bg-[#381E19] hover:bg-[#E07A5F] text-[#E07A5F] hover:text-white border border-[#E07A5F]/30 font-bold py-2 rounded-xl text-[11px] transition cursor-pointer flex justify-center items-center gap-1.5"
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
        <main className="flex-1 p-8 bg-[#F8F5F0] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-[#2C221E] flex items-center gap-2 tracking-tight">
                  <LayoutDashboard size={24} className="text-[#B08968]" />{" "}
                  แดชบอร์ด & รายงานยอดขาย
                </h1>
                <span className="bg-[#EAF4ED] text-[#2E6F40] text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 border border-[#2E6F40]/20 shadow-xs">
                  <CheckCircle2 size={12} /> ปลดล็อกรหัสแล้ว
                </span>
              </div>
              <p className="text-xs font-semibold text-[#8C7E75] mt-1">
                เลือกดูรายละเอียด ยอดขาย รายรับ-รายจ่าย ประจำวันและประจำเดือน
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleResetToToday}
                className="bg-[#EFE6DC] hover:bg-[#E2D9CE] text-[#8C6239] font-black px-3.5 py-2.5 rounded-2xl text-xs transition border border-[#D4A373]/30 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Calendar size={15} /> วันนี้ (ปัจจุบัน)
              </button>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white border border-[#E6DDD3] px-3.5 py-2.5 rounded-2xl text-xs font-black text-[#2C221E] outline-none shadow-xs focus:ring-2 focus:ring-[#B08968]"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>พ.ศ. {y + 543}</option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-white border border-[#E6DDD3] px-3.5 py-2.5 rounded-2xl text-xs font-black text-[#2C221E] outline-none shadow-xs focus:ring-2 focus:ring-[#B08968]"
              >
                {monthNamesTh.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="bg-white border border-[#E6DDD3] px-3.5 py-2.5 rounded-2xl text-xs font-black text-[#2C221E] outline-none shadow-xs focus:ring-2 focus:ring-[#B08968]"
              >
                <option value="">ทุกวัน (สรุปทั้งเดือน)</option>
                {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>วันที่ {d}</option>
                ))}
              </select>

              <button
                onClick={() => setIsShiftCloseOpen(true)}
                className="bg-[#2C221E] hover:bg-[#1A1412] text-white font-black px-4 py-2.5 rounded-2xl shadow-md transition flex items-center gap-2 text-xs cursor-pointer ml-1"
              >
                <Receipt size={16} /> สรุปยอดปิดกะประจำวัน
              </button>
            </div>
          </div>

          <div className="mb-6 bg-gradient-to-r from-[#F5EFE6] to-[#EFE6DC] border border-[#D4A373]/30 p-3.5 rounded-2xl flex justify-between items-center text-xs shadow-xs">
            <span className="font-extrabold text-[#8C6239] flex items-center gap-2">
              <Filter size={15} /> แสดงผลข้อมูลของ:{" "}
              <span className="text-[#2C221E] font-black">
                {selectedDay ? `วันที่ ${selectedDay} ` : "รวมทั้งเดือน "}
                {monthNamesTh[selectedMonth]} {Number(selectedYear) + 543}
              </span>
            </span>
            {selectedDay !== "" && (
              <button
                onClick={() => setSelectedDay("")}
                className="text-[11px] text-[#B08968] font-black underline hover:text-[#8C6239] cursor-pointer"
              >
                [แสดงทั้งเดือน]
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-5 mb-8">
            <div className="bg-white p-5 rounded-3xl border border-[#E6DDD3] shadow-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-[#8C7E75] uppercase tracking-wider mb-1">
                  {selectedDay ? "รายได้วันที่เลือก" : "รายได้รวมเดือนนี้"}
                </p>
                <h3 className="text-2xl font-black text-[#B08968]">
                  ฿{filterRevenue.toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-[#F5EFE6] text-[#B08968] rounded-2xl">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E6DDD3] shadow-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-[#8C7E75] uppercase tracking-wider mb-1">
                  {selectedDay ? "รายจ่ายวันที่เลือก" : "รายจ่ายรวมเดือนนี้"}
                </p>
                <h3 className="text-2xl font-black text-[#E07A5F]">
                  ฿{filterExpenses.toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-[#FDF4F2] text-[#E07A5F] rounded-2xl">
                <Wallet size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E6DDD3] shadow-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-[#8C7E75] uppercase tracking-wider mb-1">
                  กำไรสุทธิ (Net Profit)
                </p>
                <h3
                  className={`text-2xl font-black ${
                    filterNetProfit >= 0 ? "text-[#2E6F40]" : "text-[#E07A5F]"
                  }`}
                >
                  ฿{filterNetProfit.toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-[#EAF4ED] text-[#2E6F40] rounded-2xl">
                <DollarSign size={20} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#E6DDD3] shadow-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-[#8C7E75] uppercase tracking-wider mb-1">
                  จำนวนออเดอร์
                </p>
                <h3 className="text-2xl font-black text-[#2C221E]">
                  {filterOrdersCount}{" "}
                  <span className="text-xs font-semibold text-[#8C7E75]">
                    ออเดอร์
                  </span>
                </h3>
              </div>
              <div className="p-3 bg-[#F5EFE6] text-[#5C4A42] rounded-2xl">
                <ShoppingBag size={20} />
              </div>
            </div>

            <div className="bg-[#F5EFE6] p-5 rounded-3xl border border-[#E6DDD3] shadow-xs flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-[#8C7E75] uppercase tracking-wider mb-1">
                  เฉลี่ย / ออเดอร์
                </p>
                <h3 className="text-2xl font-black text-[#2C221E]">
                  ฿{filterAvgValue.toFixed(0)}
                </h3>
              </div>
              <div className="p-3 bg-white text-[#B08968] rounded-2xl shadow-xs">
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs mb-8">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-black text-[#2C221E] flex items-center gap-2">
                <Calendar size={17} className="text-[#B08968]" /> 
                รายงานสรุปรายรับ - รายจ่าย รายวัน (ประจำเดือน {monthNamesTh[selectedMonth]} {Number(selectedYear) + 543})
              </h3>
              <span className="text-[11px] font-bold text-[#8C7E75]">
                คลิกเพื่อเลือกเจาะลึกดูสินค้าขายดีเฉพาะวันได้
              </span>
            </div>

            <div className="overflow-x-auto max-h-68 overflow-y-auto pr-1 custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-[#F5EFE6] text-[#8C7E75] font-bold uppercase">
                    <th className="pb-3">วันที่</th>
                    <th className="pb-3 text-center">จำนวนออเดอร์</th>
                    <th className="pb-3 text-right">รายรับ (ยอดขาย)</th>
                    <th className="pb-3 text-right">รายจ่าย</th>
                    <th className="pb-3 text-right">กำไร/ขาดทุนสุทธิ</th>
                    <th className="pb-3 text-center">การกระทำ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6]">
                  {dailyBreakdown.map((item) => (
                    <tr
                      key={item.day}
                      className={`hover:bg-[#FBF9F6] transition ${Number(selectedDay) === item.day ? "bg-[#F5EFE6]/60 font-bold" : ""}`}
                    >
                      <td className="py-2.5 font-bold text-[#2C221E]">
                        วันที่ {item.day} {monthNamesTh[selectedMonth]}
                      </td>
                      <td className="py-2.5 text-center text-[#8C7E75] font-semibold">{item.ordersCount} ออเดอร์</td>
                      <td className="py-2.5 text-right font-black text-[#B08968]">฿{item.revenue.toFixed(2)}</td>
                      <td className="py-2.5 text-right font-black text-[#E07A5F]">฿{item.expense.toFixed(2)}</td>
                      <td className={`py-2.5 text-right font-black ${item.profit >= 0 ? "text-[#2E6F40]" : "text-[#E07A5F]"}`}>
                        ฿{item.profit.toFixed(2)}
                      </td>
                      <td className="py-2.5 text-center">
                        <button
                          onClick={() => setSelectedDay(String(item.day))}
                          className="text-[10px] bg-[#2C221E] text-white px-3 py-1 rounded-xl hover:bg-[#B08968] transition cursor-pointer font-bold"
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
            <div className="bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs">
              <h3 className="text-sm font-black text-[#2C221E] mb-5 flex items-center gap-2">
                <BarChart3 size={17} className="text-[#B08968]" />{" "}
                ยอดขายย้อนหลัง 7 วันล่าสุด
              </h3>
              <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-[#F5EFE6] pb-2">
                {weeklySalesData.map((d, i) => {
                  const barHeightPct =
                    maxWeeklySale > 0 ? (d.sales / maxWeeklySale) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                    >
                      <span className="text-[10px] font-black text-[#B08968] opacity-0 group-hover:opacity-100 transition duration-200">
                        ฿{d.sales}
                      </span>
                      <div className="w-full max-w-[36px] bg-[#F5EFE6] h-full rounded-t-xl overflow-hidden flex items-end">
                        <div
                          className="w-full bg-[#B08968] group-hover:bg-[#8C6239] transition-all duration-500 rounded-t-xl"
                          style={{ height: `${Math.max(barHeightPct, 4)}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-extrabold text-[#8C7E75]">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs">
              <h3 className="text-sm font-black text-[#2C221E] mb-5 flex items-center gap-2">
                <Calendar size={17} className="text-[#8C6239]" /> ยอดขายย้อนหลัง
                6 เดือน
              </h3>
              <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-[#F5EFE6] pb-2">
                {monthlySalesData.map((m, i) => {
                  const barHeightPct =
                    maxMonthlySale > 0 ? (m.sales / maxMonthlySale) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                    >
                      <span className="text-[10px] font-black text-[#8C6239] opacity-0 group-hover:opacity-100 transition duration-200">
                        ฿{m.sales}
                      </span>
                      <div className="w-full max-w-[36px] bg-[#F5EFE6] h-full rounded-t-xl overflow-hidden flex items-end">
                        <div
                          className="w-full bg-[#8C6239] group-hover:bg-[#5C4A42] transition-all duration-500 rounded-t-xl"
                          style={{ height: `${Math.max(barHeightPct, 4)}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-extrabold text-[#8C7E75]">
                        {m.monthName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-black text-[#2C221E] flex items-center gap-2">
                  <Award size={17} className="text-[#B08968]" />{" "}
                  ตารางอันดับเมนูยอดฮิต (Best Sellers)
                </h3>
                <span className="text-[11px] font-black text-[#B08968] bg-[#F5EFE6] px-3 py-1 rounded-full border border-[#D4A373]/20">
                  {selectedDay ? `เฉพาะวันที่ ${selectedDay} ${monthNamesTh[selectedMonth]}` : `รวมทั้งเดือน ${monthNamesTh[selectedMonth]}`}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#F5EFE6] text-[#8C7E75] font-bold uppercase">
                      <th className="pb-3">อันดับ</th>
                      <th className="pb-3">สินค้า</th>
                      <th className="pb-3">หมวดหมู่</th>
                      <th className="pb-3 text-center">จำนวนที่ขาย</th>
                      <th className="pb-3 text-right">ยอดขายรวม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EFE6]">
                    {filteredBestSellers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-[#A3978C]"
                        >
                          ไม่มีข้อมูลการขายในวันที่เลือก
                        </td>
                      </tr>
                    ) : (
                      filteredBestSellers.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#FBF9F6]">
                          <td className="py-3 font-black text-[#B08968]">
                            #{idx + 1}
                          </td>
                          <td className="py-3 flex items-center gap-3">
                            <img
                              src={item.image}
                              alt=""
                              className="w-9 h-9 rounded-xl object-cover shadow-xs"
                            />
                            <span className="font-bold text-[#2C221E]">
                              {item.name}
                            </span>
                          </td>
                          <td className="py-3 text-[#8C7E75] capitalize font-semibold">
                            {item.category || "coffee"}
                          </td>
                          <td className="py-3 text-center font-extrabold text-[#2C221E]">
                            {item.qty} ชิ้น
                          </td>
                          <td className="py-3 text-right font-black text-[#B08968]">
                            ฿{item.revenue.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-[#2C221E] mb-5 flex items-center gap-2">
                  <PieChart size={17} className="text-[#B08968]" />{" "}
                  สัดส่วนยอดขายตามหมวดหมู่
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1.5">
                      <span>Coffee</span>
                      <span className="text-[#B08968] font-black">
                        ฿{catSales.coffee.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-[#F5EFE6] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#B08968] h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${filterRevenue > 0 ? (catSales.coffee / filterRevenue) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1.5">
                      <span>Non-Coffee</span>
                      <span className="text-[#B08968] font-black">
                        ฿{catSales["non-coffee"].toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-[#F5EFE6] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#D4A373] h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${filterRevenue > 0 ? (catSales["non-coffee"] / filterRevenue) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1.5">
                      <span>Bakery</span>
                      <span className="text-[#B08968] font-black">
                        ฿{catSales.bakery.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-[#F5EFE6] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#5C4A42] h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${filterRevenue > 0 ? (catSales.bakery / filterRevenue) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs">
            <h3 className="text-sm font-black text-[#2C221E] mb-5 flex items-center gap-2">
              <Clock size={17} className="text-[#B08968]" /> ประวัติคำสั่งซื้อ (
              {filteredDashboardOrders.length} รายการ)
            </h3>
            <div className="space-y-3">
              {filteredDashboardOrders.length === 0 ? (
                <div className="p-10 text-center text-[#A3978C] text-xs font-semibold">
                  ไม่มีประวัติการชำระเงินในช่วงเวลานี้
                </div>
              ) : (
                filteredDashboardOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-4 rounded-2xl border flex justify-between items-center transition ${
                      order.status === "cancelled"
                        ? "bg-[#FDF4F2] border-[#FADCD6] opacity-70"
                        : "bg-[#FBF9F6] border-[#F5EFE6] hover:border-[#B08968]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-xs text-[#B08968] bg-[#F5EFE6] px-2.5 py-0.5 rounded-lg border border-[#D4A373]/20">
                          {order.queueNo}
                        </span>
                        <span className="font-extrabold text-xs text-[#2C221E]">
                          {order.id}
                        </span>
                        <span className="text-[10px] bg-[#2C221E] text-white px-2.5 py-0.5 rounded-full font-bold">
                          {order.orderType}
                        </span>
                        <span className="text-[10px] bg-[#F5EFE6] text-[#B08968] px-2.5 py-0.5 rounded-full font-bold">
                          {order.paymentMethod}
                        </span>
                        {order.status === "cancelled" && (
                          <span className="text-[10px] bg-[#E07A5F] text-white px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Ban size={10} /> ยกเลิกแล้ว (ไม่คิดเงิน/ตัดสต็อก)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8C7E75] font-medium mt-1">
                        {order.date} {order.time} • {order.items.length} รายการ
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-base font-black ${
                          order.status === "cancelled"
                            ? "line-through text-[#A3978C]"
                            : "text-[#B08968]"
                        }`}
                      >
                        ฿{order.total.toFixed(2)}
                      </p>
                      <button
                        onClick={() => setActiveReceipt(order)}
                        className="text-[11px] text-[#8C7E75] font-extrabold underline hover:text-[#B08968] mt-0.5 cursor-pointer"
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
        <main className="flex-1 p-8 bg-[#F8F5F0] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-black text-[#2C221E] flex items-center gap-2.5">
                <ShieldAlert size={24} className="text-[#B08968]" /> Admin
                Management Panel
              </h1>
              <p className="text-xs font-semibold text-[#8C7E75] mt-1">
                จัดการระบบทั้งหมด: สินค้า, สต็อกวัตถุดิบ, โปรโมชั่น และรายจ่าย
              </p>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-xs font-bold text-[#E07A5F] bg-[#FDF4F2] hover:bg-[#FADCD6] border border-[#F5C2B8] px-4 py-2.5 rounded-2xl transition cursor-pointer shadow-xs"
            >
              ออกจากสิทธิ์ปลดล็อก
            </button>
          </div>

          <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-[#E6DDD3] w-fit shadow-xs">
            <button
              onClick={() => setAdminSubTab("menu")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                adminSubTab === "menu"
                  ? "bg-[#B08968] text-white shadow-xs"
                  : "text-[#8C7E75] hover:text-[#2C221E]"
              }`}
            >
              <Layers size={16} /> จัดการเมนูสินค้า
            </button>
            <button
              onClick={() => setAdminSubTab("inventory")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                adminSubTab === "inventory"
                  ? "bg-[#B08968] text-white shadow-xs"
                  : "text-[#8C7E75] hover:text-[#2C221E]"
              }`}
            >
              <Package size={16} /> จัดการคลังวัตถุดิบ & สต็อก
            </button>
            <button
              onClick={() => setAdminSubTab("promotions")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                adminSubTab === "promotions"
                  ? "bg-[#B08968] text-white shadow-xs"
                  : "text-[#8C7E75] hover:text-[#2C221E]"
              }`}
            >
              <Tag size={16} /> จัดการโปรโมชั่น
            </button>
            <button
              onClick={() => setAdminSubTab("expenses")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                adminSubTab === "expenses"
                  ? "bg-[#B08968] text-white shadow-xs"
                  : "text-[#8C7E75] hover:text-[#2C221E]"
              }`}
            >
              <Wallet size={16} /> จัดการรายจ่าย & วัตถุดิบ
            </button>
          </div>

          {adminSubTab === "menu" && (
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs h-fit space-y-4">
                <h2 className="text-base font-black text-[#2C221E]">
                  {editingItem ? "แก้ไขรายการสินค้า" : "เพิ่มสินค้าใหม่"}
                </h2>
                <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                  <div>
                    <label className="font-extrabold text-[#5C4A42] block mb-1">
                      ชื่อสินค้า
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.name}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, name: e.target.value })
                      }
                      className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#B08968] outline-none text-[#2C221E] transition font-semibold"
                      placeholder="เช่น Matcha Espresso Latte"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-extrabold text-[#5C4A42] block mb-1">
                        ราคา (บาท)
                      </label>
                      <input
                        type="number"
                        required
                        value={itemForm.price}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, price: e.target.value })
                        }
                        className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#B08968] outline-none text-[#2C221E] font-black transition"
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-[#5C4A42] block mb-1">
                        หมวดหมู่หลัก
                      </label>
                      <select
                        value={itemForm.category}
                        onChange={(e) => {
                          const catId = e.target.value;
                          const catObj = initialCategories.find(c => c.id === catId);
                          const firstSub = catObj?.subCategories?.[1]?.id || "all";
                          setItemForm({
                            ...itemForm,
                            category: catId,
                            subCategory: firstSub,
                          });
                        }}
                        className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#B08968] outline-none text-[#2C221E] font-bold transition"
                      >
                        <option value="coffee">Coffee</option>
                        <option value="non-coffee">Non-Coffee</option>
                        <option value="bakery">Bakery</option>
                      </select>
                    </div>
                  </div>

                  {adminSelectedCategoryObj?.subCategories && (
                    <div>
                      <label className="font-extrabold text-[#5C4A42] block mb-1">
                        หมวดหมู่ย่อย (Sub-Category)
                      </label>
                      <select
                        value={itemForm.subCategory}
                        onChange={(e) =>
                          setItemForm({ ...itemForm, subCategory: e.target.value })
                        }
                        className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#B08968] outline-none text-[#2C221E] font-bold transition"
                      >
                        {adminSelectedCategoryObj.subCategories
                          .filter((sub) => sub.id !== "all")
                          .map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="font-extrabold text-[#5C4A42] block mb-1">
                      สถานะสินค้า
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-[#F5EFE6] rounded-xl">
                      <button
                        type="button"
                        onClick={() =>
                          setItemForm({ ...itemForm, inStock: true })
                        }
                        className={`py-2 rounded-lg font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          itemForm.inStock
                            ? "bg-white text-[#B08968] shadow-xs"
                            : "text-[#8C7E75]"
                        }`}
                      >
                        <CheckCircle2 size={14} /> พร้อมขาย
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setItemForm({ ...itemForm, inStock: false })
                        }
                        className={`py-2 rounded-lg font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          !itemForm.inStock
                            ? "bg-white text-[#E07A5F] shadow-xs"
                            : "text-[#8C7E75]"
                        }`}
                      >
                        <XCircle size={14} /> สินค้าหมด
                      </button>
                    </div>
                  </div>

                  {/* สูตรวัตถุดิบตัดสต็อก */}
                  <div className="bg-[#FBF9F6] p-4 rounded-2xl border border-[#E6DDD3] space-y-2.5">
                    <label className="font-extrabold text-[#5C4A42] block">
                      สูตรวัตถุดิบตัดสต็อก (ต่อ 1 แก้ว)
                    </label>

                    <div className="space-y-2">
                      {itemForm.recipe && itemForm.recipe.length > 0 ? (
                        itemForm.recipe.map((r) => {
                          const ing = ingredients.find((i) => i.id === r.ingId);
                          return (
                            <div
                              key={r.ingId}
                              className="flex justify-between items-center bg-white border border-[#E6DDD3] px-3 py-2 rounded-xl"
                            >
                              <span className="font-bold text-[#2C221E]">
                                {ing ? ing.name : r.ingId}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-[#B08968]">
                                  {r.amount} {ing?.unit}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveIngFromRecipe(r.ingId)
                                  }
                                  className="text-[#A3978C] hover:text-[#E07A5F]"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-[11px] text-[#A3978C] italic font-medium">
                          ยังไม่ได้กำหนดวัตถุดิบในสูตร
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#E6DDD3] space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={selectedIngForRecipe}
                          onChange={(e) =>
                            setSelectedIngForRecipe(e.target.value)
                          }
                          className="p-2.5 bg-white border border-[#E6DDD3] rounded-xl text-xs font-semibold outline-none"
                        >
                          <option value="">-- เลือกวัตถุดิบ --</option>
                          {ingredients.map((ing) => (
                            <option key={ing.id} value={ing.id}>
                              {ing.name} ({ing.unit})
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          value={recipeIngAmount}
                          onChange={(e) => setRecipeIngAmount(e.target.value)}
                          placeholder="ปริมาณที่ใช้"
                          className="p-2.5 bg-white border border-[#E6DDD3] rounded-xl text-xs font-bold outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddIngToRecipe}
                        className="w-full bg-[#2C221E] text-white font-bold py-2.5 rounded-xl text-xs hover:bg-[#1A1412] transition cursor-pointer"
                      >
                        + เพิ่มวัตถุดิบในสูตร
                      </button>
                    </div>
                  </div>

                  {/* ระดับความหวาน */}
                  <div className="bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#E6DDD3] space-y-2">
                    <label className="font-extrabold text-[#5C4A42] block">
                      ระดับความหวาน
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {itemForm.sweetnessText ? (
                        itemForm.sweetnessText.split(",").map((sw, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-[#E6DDD3] px-2.5 py-1 rounded-lg text-[#2C221E] font-medium flex items-center gap-1 shadow-xs"
                          >
                            {sw.trim()}
                            <button
                              type="button"
                              onClick={() => {
                                const list = itemForm.sweetnessText
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter((_, i) => i !== idx);
                                setItemForm({
                                  ...itemForm,
                                  sweetnessText: list.join(", "),
                                });
                              }}
                              className="text-[#A3978C] hover:text-[#E07A5F]"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[#A3978C] text-[11px]">
                          ไม่มีตัวเลือก
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        value={newSweetness}
                        onChange={(e) => setNewSweetness(e.target.value)}
                        placeholder="เพิ่มออปชัน (เช่น 25%)"
                        className="flex-1 bg-white p-2 border border-[#E6DDD3] rounded-lg text-xs outline-none font-semibold"
                      />
                      <button
                        type="button"
                        onClick={addSweetnessOption}
                        className="bg-[#B08968] text-white px-3 py-1.5 rounded-lg font-black text-xs cursor-pointer"
                      >
                        + เพิ่ม
                      </button>
                    </div>
                  </div>

                  {/* ตัวเลือกนม & ราคาเพิ่ม */}
                  <div className="bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#E6DDD3] space-y-2">
                    <label className="font-extrabold text-[#5C4A42] block">
                      ตัวเลือกนม & ราคาเพิ่ม
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {itemForm.milkText ? (
                        itemForm.milkText.split(",").map((m, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-[#E6DDD3] px-2.5 py-1 rounded-lg text-[#2C221E] font-medium flex items-center gap-1 shadow-xs"
                          >
                            {m.trim()}
                            <button
                              type="button"
                              onClick={() => {
                                const list = itemForm.milkText
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter((_, i) => i !== idx);
                                setItemForm({
                                  ...itemForm,
                                  milkText: list.join(", "),
                                });
                              }}
                              className="text-[#A3978C] hover:text-[#E07A5F]"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[#A3978C] text-[11px]">
                          ไม่มีตัวเลือก
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <input
                        type="text"
                        value={newMilk}
                        onChange={(e) => setNewMilk(e.target.value)}
                        placeholder="เช่น นมพิสตาชิโอ (+25)"
                        className="flex-1 bg-white p-2 border border-[#E6DDD3] rounded-lg text-xs outline-none font-semibold"
                      />
                      <button
                        type="button"
                        onClick={addMilkOption}
                        className="bg-[#B08968] text-white px-3 py-1.5 rounded-lg font-black text-xs cursor-pointer"
                      >
                        + เพิ่ม
                      </button>
                    </div>
                  </div>

                  {/* ท็อปปิ้ง / ตัวเลือกเพิ่มเติม */}
                  <div className="bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#E6DDD3] space-y-2">
                    <label className="font-extrabold text-[#5C4A42] block">
                      ท็อปปิ้ง / ตัวเลือกเพิ่มเติม (พร้อมการผูกตัดสต็อก)
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {itemForm.addonsText ? (
                        itemForm.addonsText.split(",").map((a, idx) => (
                          <span
                            key={idx}
                            className="bg-white border border-[#E6DDD3] px-2.5 py-1 rounded-lg text-[#2C221E] font-medium flex items-center gap-1 shadow-xs text-[11px]"
                          >
                            {a.trim()}
                            <button
                              type="button"
                              onClick={() => {
                                const list = itemForm.addonsText
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter((_, i) => i !== idx);
                                setItemForm({
                                  ...itemForm,
                                  addonsText: list.join(", "),
                                });
                              }}
                              className="text-[#A3978C] hover:text-[#E07A5F]"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[#A3978C] text-[11px]">
                          ไม่มีตัวเลือกท็อปปิ้ง
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 pt-1 border-t border-[#E6DDD3]">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={addonName}
                          onChange={(e) => setAddonName(e.target.value)}
                          placeholder="ชื่อท็อปปิ้ง (เช่น วิปครีม)"
                          className="bg-white p-2 border border-[#E6DDD3] rounded-lg text-xs outline-none font-semibold"
                        />
                        <input
                          type="number"
                          value={addonPrice}
                          onChange={(e) => setAddonPrice(e.target.value)}
                          placeholder="ราคาบวกเพิ่ม (เช่น 15)"
                          className="bg-white p-2 border border-[#E6DDD3] rounded-lg text-xs outline-none font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={selectedAddonIng}
                          onChange={(e) => setSelectedAddonIng(e.target.value)}
                          className="bg-white p-2 border border-[#E6DDD3] rounded-lg text-xs outline-none font-semibold"
                        >
                          <option value="">-- ไม่ตัดวัตถุดิบเพิ่มเติม --</option>
                          {ingredients.map((ing) => (
                            <option key={ing.id} value={ing.id}>
                              {ing.name} ({ing.unit})
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={addonIngAmount}
                          onChange={(e) => setAddonIngAmount(e.target.value)}
                          placeholder="ปริมาณที่ใช้ตัดสต็อก"
                          className="bg-white p-2 border border-[#E6DDD3] rounded-lg text-xs outline-none font-semibold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddAddonOption}
                        className="w-full bg-[#B08968] text-white py-2 rounded-lg font-black text-xs cursor-pointer hover:bg-[#8C6239] transition"
                      >
                        + เพิ่มท็อปปิ้งในเมนูนี้
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-extrabold text-[#5C4A42] block mb-1">
                      URL รูปภาพสินค้า
                    </label>
                    <input
                      type="text"
                      value={itemForm.image}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, image: e.target.value })
                      }
                      className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl focus:bg-white outline-none text-[#2C221E] font-medium"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#B08968] hover:bg-[#8C6239] text-white font-black py-3.5 rounded-2xl shadow-md transition text-xs cursor-pointer uppercase tracking-wider"
                    >
                      {editingItem ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                    </button>
                    {editingItem && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(null);
                          setItemForm({
                            name: "",
                            price: "",
                            category: "coffee",
                            subCategory: "hot",
                            image: "",
                            inStock: true,
                            sweetnessText: "100%, 50%, 0%",
                            milkText: "นมสดธรรมดา (+0)",
                            addonsText: "เพิ่ม Shot กาแฟ (+25)",
                            recipe: [],
                          });
                        }}
                        className="px-4 border border-[#E6DDD3] rounded-2xl text-[#5C4A42] hover:bg-[#F5EFE6] font-bold text-xs transition cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="col-span-2 bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs">
                <h2 className="text-base font-black text-[#2C221E] mb-5">
                  รายการสินค้าทั้งหมด ({menuItems.length} รายการ)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#F5EFE6] text-[#8C7E75] font-bold uppercase">
                        <th className="pb-3">สินค้า</th>
                        <th className="pb-3">หมวดหมู่หลัก / ย่อย</th>
                        <th className="pb-3">สถานะสต็อก</th>
                        <th className="pb-3">ราคา</th>
                        <th className="pb-3 text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFE6]">
                      {menuItems.map((item) => {
                        const inStock = isItemInStock(item);
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-[#FBF9F6] transition"
                          >
                            <td className="py-3.5 flex items-center gap-3">
                              <img
                                src={item.image}
                                alt=""
                                className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-xs"
                              />
                              <div>
                                <p className="font-extrabold text-[#2C221E]">
                                  {item.name}
                                </p>
                              </div>
                            </td>
                            <td className="py-3.5 text-[#8C7E75]">
                              <span className="capitalize font-bold text-[#2C221E]">{item.category}</span>
                              {item.subCategory && item.subCategory !== "all" && (
                                <span className="text-[10px] bg-[#F5EFE6] text-[#8C6239] px-2 py-0.5 rounded-md ml-1.5 font-bold uppercase">
                                  {item.subCategory}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5">
                              {inStock ? (
                                <span className="text-[11px] text-[#B08968] bg-[#F5EFE6] px-3 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit border border-[#D4A373]/20">
                                  <CheckCircle2 size={12} /> พร้อมขาย
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#E07A5F] bg-[#FDF4F2] px-3 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit border border-[#FADCD6]">
                                  <XCircle size={12} />{" "}
                                  {!item.inStock ? "ปิดขาย" : "วัตถุดิบหมด"}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 font-black text-[#B08968]">
                              ฿{item.price.toFixed(2)}
                            </td>
                            <td className="py-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleEditClick(item)}
                                className="p-2 text-[#8C7E75] hover:text-[#B08968] hover:bg-[#F5EFE6] rounded-xl transition cursor-pointer"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 text-[#8C7E75] hover:text-[#E07A5F] hover:bg-[#FDF4F2] rounded-xl transition cursor-pointer"
                              >
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
              <div className="bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs h-fit space-y-4">
                <h2 className="text-base font-black text-[#2C221E]">
                  เพิ่มวัตถุดิบใหม่เข้าคลัง
                </h2>
                <form
                  onSubmit={handleSaveIngredient}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="font-extrabold text-[#5C4A42] block mb-1">
                      ชื่อวัตถุดิบ
                    </label>
                    <input
                      type="text"
                      required
                      value={ingForm.name}
                      onChange={(e) =>
                        setIngForm({ ...ingForm, name: e.target.value })
                      }
                      placeholder="เช่น เมล็ดกาแฟ, นมสด"
                      className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-extrabold text-[#5C4A42] block mb-1">
                        จำนวนสต็อก
                      </label>
                      <input
                        type="number"
                        required
                        value={ingForm.stock}
                        onChange={(e) =>
                          setIngForm({ ...ingForm, stock: e.target.value })
                        }
                        placeholder="2000"
                        className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-black"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-[#5C4A42] block mb-1">
                        หน่วยนับ
                      </label>
                      <select
                        value={ingForm.unit}
                        onChange={(e) =>
                          setIngForm({ ...ingForm, unit: e.target.value })
                        }
                        className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-bold"
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
                    <label className="font-extrabold text-[#5C4A42] block mb-1">
                      จุดเตือนสั่งซื้อเพิ่ม (Min Stock)
                    </label>
                    <input
                      type="number"
                      value={ingForm.minStock}
                      onChange={(e) =>
                        setIngForm({ ...ingForm, minStock: e.target.value })
                      }
                      placeholder="500"
                      className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#B08968] text-white font-black py-3.5 rounded-2xl shadow-md text-xs cursor-pointer uppercase tracking-wider"
                  >
                    + เพิ่มวัตถุดิบ
                  </button>
                </form>
              </div>

              <div className="col-span-2 bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs">
                <h2 className="text-base font-black text-[#2C221E] mb-5">
                  คลังวัตถุดิบจริงทั้งหมด ({ingredients.length} รายการ)
                </h2>
                <div className="space-y-3">
                  {ingredients.map((ing) => {
                    const isLow = ing.stock <= ing.minStock;
                    return (
                      <div
                        key={ing.id}
                        className={`p-4 rounded-2xl border ${isLow ? "bg-[#FDF4F2] border-[#F5C2B8]" : "bg-[#FBF9F6] border-[#F5EFE6]"} flex justify-between items-center transition`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-[#2C221E]">
                              {ing.name}
                            </span>
                            {isLow && (
                              <span className="text-[10px] bg-[#E07A5F] text-white px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs">
                                <AlertTriangle size={10} /> วัตถุดิบใกล้หมด
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#8C7E75] font-medium mt-1">
                            คงเหลือ:{" "}
                            <span className="font-black text-[#B08968]">
                              {ing.stock}
                            </span>{" "}
                            {ing.unit} (ขั้นต่ำ: {ing.minStock} {ing.unit})
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const addAmount = Number(
                                prompt(
                                  `เติมจำนวน ${ing.name} (${ing.unit}):`,
                                  "1000"
                                )
                              );
                              if (addAmount) {
                                setIngredients((prev) =>
                                  prev.map((i) =>
                                    i.id === ing.id
                                      ? { ...i, stock: i.stock + addAmount }
                                      : i
                                  )
                                );
                              }
                            }}
                            className="bg-[#B08968] hover:bg-[#8C6239] text-white px-3.5 py-2 rounded-xl font-bold text-xs cursor-pointer shadow-xs transition"
                          >
                            + เติมสต็อก
                          </button>
                          <button
                            onClick={() => handleDeleteIngredient(ing.id)}
                            className="p-2 text-[#E07A5F] hover:bg-[#FDF4F2] rounded-xl cursor-pointer transition"
                          >
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
              <div className="bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs h-fit space-y-4">
                <h2 className="text-base font-black text-[#2C221E]">
                  สร้างโปรโมชั่นใหม่
                </h2>
                <form
                  onSubmit={handleSavePromotion}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="font-extrabold text-[#5C4A42] block mb-1">
                      โค้ดส่วนลด (Promotion Code)
                    </label>
                    <input
                      type="text"
                      required
                      value={promoForm.code}
                      onChange={(e) =>
                        setPromoForm({ ...promoForm, code: e.target.value })
                      }
                      placeholder="เช่น DISCOUNT10"
                      className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-black uppercase tracking-wider"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-[#5C4A42] block mb-1">
                      ชื่อโปรโมชั่น
                    </label>
                    <input
                      type="text"
                      required
                      value={promoForm.name}
                      onChange={(e) =>
                        setPromoForm({ ...promoForm, name: e.target.value })
                      }
                      placeholder="เช่น ลด 10% เมนูวันแม่"
                      className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-extrabold text-[#5C4A42] block mb-1">
                        ประเภทส่วนลด
                      </label>
                      <select
                        value={promoForm.type}
                        onChange={(e) =>
                          setPromoForm({ ...promoForm, type: e.target.value })
                        }
                        className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-bold"
                      >
                        <option value="percent">เปอร์เซ็นต์ (%)</option>
                        <option value="fixed">จำนวนเงินคงที่ (บาท)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-extrabold text-[#5C4A42] block mb-1">
                        มูลค่าส่วนลด
                      </label>
                      <input
                        type="number"
                        required
                        value={promoForm.value}
                        onChange={(e) =>
                          setPromoForm({ ...promoForm, value: e.target.value })
                        }
                        placeholder={promoForm.type === "percent" ? "10" : "20"}
                        className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-extrabold text-[#5C4A42] block mb-1">
                      ยอดขั้นต่ำในการใช้ (บาท)
                    </label>
                    <input
                      type="number"
                      value={promoForm.minSpend}
                      onChange={(e) =>
                        setPromoForm({ ...promoForm, minSpend: e.target.value })
                      }
                      placeholder="100"
                      className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#B08968] text-white font-black py-3.5 rounded-2xl shadow-md text-xs cursor-pointer uppercase tracking-wider"
                  >
                    + เพิ่มโปรโมชั่น
                  </button>
                </form>
              </div>

              <div className="col-span-2 bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs">
                <h2 className="text-base font-black text-[#2C221E] mb-5">
                  รายการโปรโมชั่นทั้งหมด ({promotions.length} รายการ)
                </h2>
                <div className="space-y-3">
                  {promotions.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 bg-[#FBF9F6] border border-[#F5EFE6] rounded-2xl flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs bg-[#2C221E] text-white px-3 py-0.5 rounded-lg tracking-wider">
                            {p.code}
                          </span>
                          <span className="font-bold text-xs text-[#2C221E]">
                            {p.name}
                          </span>
                        </div>
                        <p className="text-xs text-[#8C7E75] font-medium mt-1">
                          ส่วนลด:{" "}
                          <span className="font-black text-[#B08968]">
                            {p.type === "percent"
                              ? `${p.value}%`
                              : `฿${p.value}`}
                          </span>{" "}
                          • ยอดซื้อขั้นต่ำ: ฿{p.minSpend}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => togglePromotionStatus(p.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition ${
                            p.active
                              ? "bg-[#EAF4ED] text-[#2E6F40]"
                              : "bg-[#FDF4F2] text-[#E07A5F]"
                          }`}
                        >
                          {p.active ? "เปิดใช้งานอยู่" : "ปิดใช้งาน"}
                        </button>
                        <button
                          onClick={() => handleDeletePromotion(p.id)}
                          className="p-2 text-[#E07A5F] hover:bg-[#FDF4F2] rounded-xl cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminSubTab === "expenses" && (
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs h-fit space-y-4">
                <h2 className="text-base font-black text-[#2C221E]">
                  บันทึกรายจ่ายใหม่
                </h2>
                <form
                  onSubmit={handleSaveExpense}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="font-extrabold text-[#5C4A42] block mb-1">
                      รายการรายจ่าย/ซื้อของ
                    </label>
                    <input
                      type="text"
                      required
                      value={expenseForm.title}
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="เช่น ซื้อแก้วกาแฟ 1,000 ใบ"
                      className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-extrabold text-[#5C4A42] block mb-1">
                        หมวดหมู่รายจ่าย
                      </label>
                      <select
                        value={expenseForm.category}
                        onChange={(e) =>
                          setExpenseForm({
                            ...expenseForm,
                            category: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-bold"
                      >
                        <option value="raw_material">
                          วัตถุดิบ (Raw Material)
                        </option>
                        <option value="equipment">อุปกรณ์ (Equipment)</option>
                        <option value="utilities">ค่าน้ำ/ค่าไฟ/ค่าเช่า</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-extrabold text-[#5C4A42] block mb-1">
                        จำนวนเงิน (บาท)
                      </label>
                      <input
                        type="number"
                        required
                        value={expenseForm.amount}
                        onChange={(e) =>
                          setExpenseForm({
                            ...expenseForm,
                            amount: e.target.value,
                          })
                        }
                        placeholder="1500"
                        className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-extrabold text-[#5C4A42] block mb-1">
                      วันที่บันทึก
                    </label>
                    <input
                      type="date"
                      required
                      value={expenseForm.date}
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          date: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-[#FBF9F6] border border-[#E6DDD3] rounded-xl outline-none font-bold text-[#2C221E]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#B08968] text-white font-black py-3.5 rounded-2xl shadow-md text-xs cursor-pointer uppercase tracking-wider"
                  >
                    + บันทึกรายจ่าย
                  </button>
                </form>
              </div>

              <div className="col-span-2 bg-white p-6 rounded-3xl border border-[#E6DDD3] shadow-xs">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-base font-black text-[#2C221E]">
                    รายการบันทึกรายจ่ายทั้งหมด ({expenses.length} รายการ)
                  </h2>
                  <span className="text-xs font-black text-[#E07A5F] bg-[#FDF4F2] px-3.5 py-1 rounded-full border border-[#FADCD6]">
                    รวมสะสม: ฿{totalExpensesAll.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3">
                  {expenses.map((e) => (
                    <div
                      key={e.id}
                      className="p-4 bg-[#FBF9F6] border border-[#F5EFE6] rounded-2xl flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#2C221E]">
                            {e.title}
                          </span>
                          <span className="text-[10px] bg-[#F5EFE6] text-[#8C6239] px-2.5 py-0.5 rounded-full font-extrabold">
                            {e.category === "raw_material"
                              ? "วัตถุดิบ"
                              : e.category === "equipment"
                              ? "อุปกรณ์"
                              : e.category === "utilities"
                              ? "ค่าน้ำ/ไฟ/เช่า"
                              : "อื่นๆ"}
                          </span>
                        </div>
                        <p className="text-xs text-[#8C7E75] font-medium mt-1 flex items-center gap-1">
                          <Calendar size={13} /> {e.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-[#E07A5F]">
                          -฿{e.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteExpense(e.id)}
                          className="p-2 text-[#E07A5F] hover:bg-[#FDF4F2] rounded-xl cursor-pointer"
                        >
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
        <div className="fixed inset-0 bg-[#120E0C]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-7 border border-[#E6DDD3] animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-[#2C221E] tracking-tight">
                ชำระเงิน (คิว {String(orderQueueCount).padStart(2, "0")})
              </h3>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="cursor-pointer text-[#A3978C] hover:text-[#2C221E] p-1 rounded-full hover:bg-[#F5EFE6] transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5">
              <label className="text-xs font-extrabold text-[#8C7E75] block mb-2">
                ประเภทการสั่งซื้อ
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {["Dine-in", "Takeaway", "Delivery"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`py-2.5 rounded-2xl text-xs font-black border transition cursor-pointer ${orderType === type ? "bg-[#2C221E] text-white border-[#2C221E] shadow-sm" : "bg-[#FBF9F6] text-[#8C7E75] border-[#E6DDD3]"}`}
                  >
                    {type === "Dine-in"
                      ? "ทานที่ร้าน"
                      : type === "Takeaway"
                      ? "กลับบ้าน"
                      : "เดลิเวอรี"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#F5EFE6]">
              <label className="text-xs font-extrabold text-[#8C7E75] block mb-1.5">
                ส่วนลดกำหนดเองเพิ่มเติม (บาท)
              </label>
              <input
                type="number"
                value={customDiscount}
                onChange={(e) => setCustomDiscount(e.target.value)}
                placeholder="0"
                className="w-full p-2.5 bg-white border border-[#E6DDD3] rounded-xl text-xs font-black text-[#2C221E] outline-none focus:ring-2 focus:ring-[#B08968]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setPaymentMethod("qr")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition font-black text-xs ${paymentMethod === "qr" ? "border-[#B08968] bg-[#F5EFE6] text-[#2C221E] shadow-sm" : "border-[#E6DDD3] text-[#8C7E75]"}`}
              >
                <QrCode size={20} className="text-[#B08968]" /> สแกน QR Code
              </button>
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 cursor-pointer transition font-black text-xs ${paymentMethod === "cash" ? "border-[#B08968] bg-[#F5EFE6] text-[#2C221E] shadow-sm" : "border-[#E6DDD3] text-[#8C7E75]"}`}
              >
                <DollarSign size={20} className="text-[#B08968]" /> เงินสด
              </button>
            </div>

            {paymentMethod === "qr" ? (
              <div className="text-center p-6 bg-[#FBF9F6] rounded-2xl border border-[#F5EFE6] mb-6">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=WarmCraftCoffee"
                  alt="QR Code"
                  className="mx-auto mb-3 rounded-2xl border border-[#E6DDD3] p-2.5 bg-white shadow-xs"
                />
                <p className="text-xs font-black text-[#8C7E75]">
                  สแกนชำระยอดสุทธิ ฿{total.toFixed(2)}
                </p>
              </div>
            ) : (
              <div className="mb-6 space-y-3">
                <label className="text-xs font-extrabold text-[#5C4A42]">
                  รับเงินสดมา (บาท)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="w-full p-3.5 text-xl font-black bg-[#FBF9F6] border border-[#E6DDD3] rounded-2xl text-center focus:ring-2 focus:ring-[#B08968] outline-none text-[#2C221E]"
                />

                <div className="flex gap-2">
                  {[100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setCashReceived(String(amt))}
                      className="flex-1 bg-[#F5EFE6] hover:bg-[#EFE6DC] text-[#B08968] font-black py-2 rounded-xl text-xs cursor-pointer transition"
                    >
                      ฿{amt}
                    </button>
                  ))}
                </div>

                {Number(cashReceived) >= total && (
                  <p className="text-[#2E6F40] text-xs font-black text-center pt-1">
                    เงินทอน: ฿{(Number(cashReceived) - total).toFixed(2)}
                  </p>
                )}
              </div>
            )}

            <button
              disabled={
                paymentMethod === "cash" && Number(cashReceived) < total
              }
              onClick={handleProcessPayment}
              className="w-full bg-[#B08968] hover:bg-[#8C6239] disabled:bg-[#E2D9CE] text-white font-black py-4 rounded-2xl shadow-lg cursor-pointer text-xs transition uppercase tracking-wider"
            >
              ยืนยันการรับชำระเงิน (฿{total.toFixed(2)})
            </button>
          </div>
        </div>
      )}

      {/* Shift Close Summary Modal */}
      {isShiftCloseOpen && (
        <div className="fixed inset-0 bg-[#120E0C]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-7 shadow-2xl border border-[#E6DDD3] animate-fadeIn">
            <div className="text-center mb-6 border-b border-[#F5EFE6] pb-4">
              <Receipt size={32} className="mx-auto text-[#B08968] mb-2" />
              <h3 className="text-lg font-black text-[#2C221E]">
                สรุปยอดปิดกะประจำวัน
              </h3>
              <p className="text-xs font-bold text-[#8C7E75] mt-0.5">
                {new Date().toLocaleDateString("th-TH")}
              </p>
            </div>

            <div className="space-y-3.5 text-xs mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-[#8C7E75]">จำนวนออเดอร์ทั้งหมด:</span>{" "}
                <span className="font-extrabold text-[#2C221E]">{totalOrdersCountAll} ออเดอร์</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#8C7E75]">จำนวนสินค้าที่ขายได้:</span>{" "}
                <span className="font-extrabold text-[#2C221E]">{totalItemsSoldAll} ชิ้น</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#8C7E75]">รายรับรวม:</span>{" "}
                <span className="font-black text-[#B08968]">
                  ฿{totalRevenueAll.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#8C7E75]">รายจ่ายรวม:</span>{" "}
                <span className="font-black text-[#E07A5F]">
                  ฿{totalExpensesAll.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-[#F5EFE6] pt-3 flex justify-between font-black text-sm text-[#2E6F40]">
                <span>กำไรสุทธิคงเหลือ:</span>{" "}
                <span>฿{(totalRevenueAll - totalExpensesAll).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsShiftCloseOpen(false)}
              className="w-full bg-[#2C221E] text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md cursor-pointer"
            >
              ปิดหน้านี้
            </button>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {selectedItemForCustom && (
        <div className="fixed inset-0 bg-[#120E0C]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#E6DDD3] animate-fadeIn">
            <div className="p-6 bg-[#1A1412] text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={selectedItemForCustom.image}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover border border-[#3D2F28] shadow-md"
                />
                <div>
                  <h3 className="font-black text-base text-[#E6C5A2]">
                    {selectedItemForCustom.name}
                  </h3>
                  <p className="text-xs font-bold text-[#D4A373] mt-0.5">
                    เริ่มต้น ฿{selectedItemForCustom.price}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItemForCustom(null)}
                className="p-2 hover:bg-[#251D19] rounded-full cursor-pointer text-[#9E8E81] hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs custom-scrollbar">
              {selectedItemForCustom.sweetnessOptions?.length > 0 && (
                <div>
                  <label className="font-black text-[#8C7E75] text-[11px] uppercase tracking-wider block mb-2.5">
                    ระดับความหวาน
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {selectedItemForCustom.sweetnessOptions.map((sw) => (
                      <button
                        key={sw}
                        onClick={() => setSweetness(sw)}
                        className={`py-3 rounded-2xl border transition cursor-pointer font-black ${sweetness === sw ? "border-[#B08968] bg-[#F5EFE6] text-[#2C221E] shadow-xs" : "border-[#E6DDD3] text-[#8C7E75] hover:bg-[#FBF9F6]"}`}
                      >
                        {sw}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedItemForCustom.milkOptions?.length > 0 && (
                <div>
                  <label className="font-black text-[#8C7E75] text-[11px] uppercase tracking-wider block mb-2.5">
                    ตัวเลือกนม (Milk)
                  </label>
                  <div className="space-y-2">
                    {selectedItemForCustom.milkOptions.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMilk(m)}
                        className={`w-full p-3.5 rounded-2xl border flex justify-between transition cursor-pointer font-extrabold ${milk?.id === m.id ? "border-[#B08968] bg-[#F5EFE6] text-[#2C221E] shadow-xs" : "border-[#E6DDD3] text-[#8C7E75] hover:bg-[#FBF9F6]"}`}
                      >
                        <span>{m.label}</span>
                        <span className="text-[#B08968] font-black">+{m.price}฿</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedItemForCustom.addons?.length > 0 && (
                <div>
                  <label className="font-black text-[#8C7E75] text-[11px] uppercase tracking-wider block mb-2.5">
                    ท็อปปิ้ง / ตัวเลือกเพิ่มเติม
                  </label>
                  <div className="space-y-2">
                    {selectedItemForCustom.addons.map((addon) => {
                      const isSelected = selectedAddons.some(
                        (a) => a.id === addon.id
                      );
                      return (
                        <button
                          key={addon.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAddons(
                                selectedAddons.filter((a) => a.id !== addon.id)
                              );
                            } else {
                              setSelectedAddons([...selectedAddons, addon]);
                            }
                          }}
                          className={`w-full p-3.5 rounded-2xl border flex justify-between transition cursor-pointer font-extrabold ${isSelected ? "border-[#B08968] bg-[#F5EFE6] text-[#2C221E] shadow-xs" : "border-[#E6DDD3] text-[#8C7E75] hover:bg-[#FBF9F6]"}`}
                        >
                          <span>{addon.label}</span>
                          <span className="text-[#B08968] font-black">
                            +{addon.price}฿
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="font-black text-[#8C7E75] text-[11px] uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                  <FileText size={15} className="text-[#B08968]" />{" "}
                  หมายเหตุพิเศษ (Note / Special Instructions)
                </label>
                <input
                  type="text"
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  placeholder="เช่น หวานน้อยมาก, แยกน้ำแข็ง, ขอแก้วซ้อน 2 ชั้น..."
                  className="w-full p-3.5 bg-[#FBF9F6] border border-[#E6DDD3] rounded-2xl text-xs focus:ring-2 focus:ring-[#B08968] focus:bg-white outline-none transition font-semibold"
                />
              </div>
            </div>

            <div className="p-5 border-t border-[#F5EFE6] flex gap-3 bg-[#FBF9F6]">
              <div className="flex items-center gap-3 border border-[#E6DDD3] bg-white px-4 rounded-2xl shadow-xs">
                <button
                  onClick={() => setCustomQty((q) => Math.max(1, q - 1))}
                  className="cursor-pointer text-[#8C7E75] hover:text-[#2C221E] transition"
                >
                  <Minus size={16} />
                </button>
                <span className="font-black text-[#2C221E]">{customQty}</span>
                <button
                  onClick={() => setCustomQty((q) => q + 1)}
                  className="cursor-pointer text-[#8C7E75] hover:text-[#2C221E] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddCustomizedToCart}
                className="flex-1 bg-[#B08968] hover:bg-[#8C6239] text-white font-black py-4 rounded-2xl shadow-md cursor-pointer transition text-xs uppercase tracking-wider"
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 bg-[#120E0C]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-7 shadow-2xl font-mono text-xs border border-[#E6DDD3] relative overflow-hidden animate-fadeIn">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4A373] via-[#B08968] to-[#8C6239]"></div>

            <div className="text-center border-b border-dashed border-[#D4A373]/40 pb-5 mb-5">
              <h2 className="text-base font-black text-[#2C221E] tracking-widest">
                WARM CRAFT COFFEE
              </h2>
              <p className="text-[11px] text-[#8C7E75] font-sans font-bold mt-1">
                คิวคำสั่งซื้อ:{" "}
                <span className="font-black text-[#B08968] text-sm">
                  {activeReceipt.queueNo}
                </span>
              </p>
              <p className="text-[10px] text-[#A3978C] mt-1 font-sans">
                {activeReceipt.id} • {activeReceipt.date} {activeReceipt.time}
              </p>
            </div>

            <div className="space-y-2.5 border-b border-dashed border-[#D4A373]/40 pb-5 mb-5">
              {activeReceipt.items.map((item) => (
                <div
                  key={item.cartId}
                  className="flex justify-between text-[#2C221E]"
                >
                  <div>
                    <p className="font-bold">
                      {item.name} x{item.qty}
                    </p>
                    <p className="text-[10px] text-[#8C7E75] font-sans">
                      {item.optionsText}
                    </p>
                    {item.noteText && (
                      <p className="text-[10px] text-[#8C6239] font-sans italic">
                        * {item.noteText}
                      </p>
                    )}
                  </div>
                  <span className="font-bold">
                    ฿{(item.unitPrice * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 border-b border-dashed border-[#D4A373]/40 pb-5 mb-5 text-[#8C7E75]">
              <div className="flex justify-between">
                <span>รวม:</span>{" "}
                <span>฿{activeReceipt.subtotal.toFixed(2)}</span>
              </div>
              {activeReceipt.discount > 0 && (
                <div className="flex justify-between text-[#E07A5F]">
                  <span>ส่วนลด:</span>{" "}
                  <span>-฿{activeReceipt.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm pt-1.5 text-[#2C221E]">
                <span>ยอดรวมสุทธิ (รวม VAT):</span>{" "}
                <span className="text-[#B08968]">
                  ฿{activeReceipt.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-[#A3978C] pt-0.5">
                <span>(ภาษีมูลค่าเพิ่ม VAT 7%):</span>{" "}
                <span>฿{activeReceipt.vat.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-1 text-[#8C7E75] mb-6">
              <div className="flex justify-between">
                <span>ประเภท:</span> <span>{activeReceipt.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span>วิธีชำระ:</span>{" "}
                <span>{activeReceipt.paymentMethod}</span>
              </div>
            </div>

            <div className="flex gap-3 font-sans">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#2C221E] hover:bg-[#1A1412] text-white font-black py-3.5 rounded-2xl flex justify-center items-center gap-2 cursor-pointer text-xs transition shadow-md uppercase tracking-wider"
              >
                <Printer size={15} /> พิมพ์สลิป
              </button>
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-5 border border-[#E6DDD3] rounded-2xl font-bold text-[#5C4A42] hover:bg-[#F5EFE6] cursor-pointer text-xs transition"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Password PIN Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-[#120E0C]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-7 relative border border-[#E6DDD3] animate-fadeIn">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-5 top-5 text-[#A3978C] hover:text-[#2C221E] p-1 rounded-full hover:bg-[#F5EFE6] transition"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#F5EFE6] text-[#B08968] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <KeyRound size={24} />
              </div>
              <h3 className="text-lg font-black text-[#2C221E]">
                ยืนยันรหัสผ่านเพื่อเข้าใช้งาน
              </h3>
              <p className="text-xs font-semibold text-[#8C7E75] mt-1">
                กรอกรหัส PIN 4 หลัก (เพื่อเข้า Dashboard & Admin)
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="• • • •"
                  className="w-full text-center text-3xl tracking-[1em] py-4 bg-[#FBF9F6] border border-[#E6DDD3] rounded-2xl focus:ring-2 focus:ring-[#B08968] outline-none font-black text-[#2C221E]"
                />
                {pinError && (
                  <p className="text-[#E07A5F] text-xs font-bold text-center mt-2.5">
                    รหัสผ่านไม่ถูกต้อง!
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#B08968] hover:bg-[#8C6239] text-white font-black py-4 rounded-2xl shadow-md transition cursor-pointer text-xs uppercase tracking-wider"
              >
                ปลดล็อกเพื่อเข้าใช้งาน
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirm Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-[#120E0C]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-7 relative border border-[#E6DDD3] animate-fadeIn">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute right-5 top-5 text-[#A3978C] hover:text-[#2C221E] p-1 rounded-full hover:bg-[#F5EFE6] transition"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#FDF4F2] text-[#E07A5F] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                <LogoutIcon size={24} />
              </div>
              <h3 className="text-lg font-black text-[#2C221E]">
                ยืนยันการออกจากระบบ
              </h3>
              <p className="text-xs font-semibold text-[#8C7E75] mt-1">
                การออกจากระบบจะทำการล็อกส่วน Dashboard และ Admin
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 border border-[#E6DDD3] rounded-2xl font-black text-[#5C4A42] hover:bg-[#F5EFE6] py-3.5 text-xs transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="flex-1 bg-[#E07A5F] hover:bg-[#C85A3F] text-white font-black py-3.5 rounded-2xl shadow-md transition cursor-pointer text-xs uppercase tracking-wider"
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