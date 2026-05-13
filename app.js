(function () {
  "use strict";

  const STORAGE_KEY = "fortune_menu_v3";
  const DEFAULT_CATEGORIES = ["猪肉", "牛肉", "鸡肉", "海鲜", "素菜", "汤", "凉菜", "主食"];
  const ALL_CATEGORY = "全部";
  const MAX_IMAGE_DIM = 800;
  const IMAGE_QUALITY = 0.8;

  // 食材分组(按超市动线排序:肉类→海鲜→蛋奶豆→菌菇→蔬菜→葱姜蒜→水果→主食→干货→调料→其他)
  const INGREDIENT_GROUPS = [
    { name: "🥩 肉类", keywords: ["五花肉", "排骨", "里脊", "猪肉", "猪", "牛腩", "牛排", "牛肉", "牛", "羊肉", "羊", "鸡腿", "鸡翅", "鸡胸", "鸡爪", "鸡肉", "鸡", "鸭", "鹅", "培根", "香肠", "火腿", "腊肉", "肉馅", "肉丝", "肉片", "肉"] },
    { name: "🦐 海鲜", keywords: ["大虾", "基围虾", "虾仁", "虾", "螃蟹", "蟹", "扇贝", "蛤蜊", "贝", "鱿鱼", "墨鱼", "三文鱼", "带鱼", "鲈鱼", "鲫鱼", "鱼", "海带", "紫菜"] },
    { name: "🥚 蛋奶豆制品", keywords: ["鸡蛋", "鸭蛋", "鹌鹑蛋", "蛋", "牛奶", "酸奶", "奶酪", "豆腐", "豆干", "豆皮", "腐竹", "豆浆", "千张", "油豆腐"] },
    { name: "🍄 菌菇", keywords: ["香菇", "金针菇", "杏鲍菇", "平菇", "茶树菇", "口蘑", "蘑菇", "木耳", "银耳"] },
    { name: "🥬 蔬菜", keywords: ["西红柿", "番茄", "土豆", "马铃薯", "青椒", "尖椒", "彩椒", "黄瓜", "白菜", "胡萝卜", "白萝卜", "萝卜", "茄子", "菠菜", "西兰花", "花菜", "莲藕", "藕", "豆角", "四季豆", "韭菜", "芹菜", "生菜", "包菜", "卷心菜", "油菜", "苦瓜", "丝瓜", "冬瓜", "南瓜", "玉米", "豌豆", "毛豆", "芦笋", "茼蒿", "空心菜", "娃娃菜", "上海青", "竹笋", "笋", "黄豆芽", "绿豆芽", "豆芽"] },
    { name: "🌿 葱姜蒜香菜", keywords: ["大葱", "小葱", "香葱", "葱", "生姜", "姜", "大蒜", "蒜瓣", "蒜", "洋葱", "蒜苗", "蒜薹", "香菜", "辣椒"] },
    { name: "🍎 水果", keywords: ["苹果", "梨", "香蕉", "橙", "橘", "柠檬", "草莓", "葡萄", "西瓜"] },
    { name: "🍚 主食", keywords: ["大米", "小米", "米饭", "米", "面条", "挂面", "饺子皮", "馄饨皮", "馒头", "米粉", "粉丝", "粉条", "意面", "年糕"] },
    { name: "🥜 干货", keywords: ["花生", "核桃", "腰果", "杏仁", "干辣椒", "八角", "桂皮", "香叶", "花椒", "枸杞", "红枣", "莲子", "薏米"] },
    { name: "🧂 调料", keywords: ["盐", "白糖", "冰糖", "糖", "陈醋", "白醋", "醋", "老抽", "生抽", "酱油", "料酒", "黄酒", "鸡精", "味精", "蚝油", "豆瓣酱", "黄豆酱", "甜面酱", "番茄酱", "芝麻油", "香油", "麻油", "胡椒粉", "白胡椒", "黑胡椒", "胡椒", "五香粉", "孜然", "辣椒粉", "辣椒油", "淀粉", "生粉", "玉米淀粉", "面粉", "蜂蜜"] }
  ];
  const OTHER_GROUP = "📦 其他";

  function classifyIngredient(name) {
    for (const group of INGREDIENT_GROUPS) {
      for (const kw of group.keywords) {
        if (name.includes(kw)) return group.name;
      }
    }
    return OTHER_GROUP;
  }

  const DEFAULT_RECIPES = [
    {
      id: "demo-1",
      name: "西红柿炒鸡蛋",
      emoji: "🍅",
      image: "",
      category: "素菜",
      cookCount: 0,
      notes: "1. 鸡蛋打散加少许盐\n2. 热油先炒蛋,半凝固盛出\n3. 西红柿去皮切块炒出汁\n4. 倒入鸡蛋翻炒,加糖少许提味",
      ingredients: [{ name: "西红柿" }, { name: "鸡蛋" }, { name: "葱" }, { name: "盐" }]
    },
    {
      id: "demo-2",
      name: "青椒土豆丝",
      emoji: "🥔",
      image: "",
      category: "素菜",
      cookCount: 0,
      notes: "土豆丝先用清水冲洗淀粉,大火快炒保持脆度,出锅前淋点醋提味。",
      ingredients: [{ name: "土豆" }, { name: "青椒" }, { name: "蒜" }, { name: "盐" }]
    },
    {
      id: "demo-3",
      name: "番茄牛腩",
      emoji: "🍲",
      image: "",
      category: "牛肉",
      cookCount: 0,
      notes: "1. 牛腩冷水下锅焯水\n2. 西红柿炒出沙\n3. 加牛腩翻炒,倒热水没过\n4. 小火炖 1.5 小时至软烂",
      ingredients: [{ name: "西红柿" }, { name: "牛腩" }, { name: "葱" }, { name: "姜" }]
    }
  ];

  // ---------- 状态 ----------
  let state = loadState();
  let activeCategory = ALL_CATEGORY;
  let currentDetailId = null;
  let pendingImage = "";

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return migrate();
      }
      const parsed = JSON.parse(raw);
      return {
        recipes: Array.isArray(parsed.recipes) ? parsed.recipes.map(normalizeRecipe) : [],
        selectedRecipeIds: Array.isArray(parsed.selectedRecipeIds) ? parsed.selectedRecipeIds : [],
        cartChecked: parsed.cartChecked && typeof parsed.cartChecked === "object" ? parsed.cartChecked : {},
        customCategories: Array.isArray(parsed.customCategories) ? parsed.customCategories : []
      };
    } catch (e) {
      return defaultState();
    }
  }

  function defaultState() {
    return {
      recipes: DEFAULT_RECIPES.slice(),
      selectedRecipeIds: [],
      cartChecked: {},
      customCategories: []
    };
  }

  function migrate() {
    // 尝试从 v2/v1 迁移
    for (const oldKey of ["fortune_menu_v2", "fortune_menu_v1"]) {
      const raw = localStorage.getItem(oldKey);
      if (!raw) continue;
      try {
        const old = JSON.parse(raw);
        const recipes = (old.recipes || []).map(normalizeRecipe);
        return {
          recipes: recipes.length ? recipes : DEFAULT_RECIPES.slice(),
          selectedRecipeIds: old.selectedRecipeIds || [],
          cartChecked: old.cartChecked || {},
          customCategories: []
        };
      } catch (e) {
        /* 忽略 */
      }
    }
    return defaultState();
  }

  function normalizeRecipe(r) {
    return {
      id: r.id || genId(),
      name: r.name || "",
      emoji: r.emoji || "🍽️",
      image: r.image || "",
      category: r.category || "素菜",
      cookCount: typeof r.cookCount === "number" ? r.cookCount : 0,
      notes: r.notes || "",
      ingredients: (r.ingredients || []).map((ing) => ({
        name: typeof ing === "string" ? ing : ing.name || ""
      })).filter((ing) => ing.name)
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      showToast("存储已满,请删除一些图片");
    }
  }

  function genId() {
    return "r-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function getAllCategories() {
    const merged = DEFAULT_CATEGORIES.slice();
    state.customCategories.forEach((c) => {
      if (!merged.includes(c)) merged.push(c);
    });
    return merged;
  }

  // ---------- DOM 工具 ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(v) {
    return escapeHtml(v == null ? "" : v);
  }

  // ---------- Tab ----------
  function switchTab(tabName) {
    $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tabName));
    $$(".panel").forEach((p) => p.classList.toggle("active", p.id === "panel-" + tabName));
    if (tabName === "cart") renderCart();
    if (tabName === "menu") renderRecipes();
    if (tabName === "add") {
      renderManageList();
      renderCategoryManageList();
      populateCategorySelect();
    }
  }

  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // ---------- 分类筛选条 ----------
  function renderCategoryBar() {
    const bar = $("#categoryBar");
    bar.innerHTML = "";
    [ALL_CATEGORY, ...getAllCategories()].forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "category-pill" + (activeCategory === cat ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        activeCategory = cat;
        renderCategoryBar();
        renderRecipes();
      });
      bar.appendChild(btn);
    });
  }

  // ---------- 菜谱网格 ----------
  function renderRecipes() {
    const grid = $("#recipeGrid");
    const empty = $("#emptyRecipes");
    grid.innerHTML = "";

    const list =
      activeCategory === ALL_CATEGORY
        ? state.recipes
        : state.recipes.filter((r) => r.category === activeCategory);

    if (state.recipes.length === 0) {
      empty.hidden = false;
      empty.querySelector("p").innerHTML = '还没有菜谱,点上方 <b>+ 添加菜谱</b> 开始录入吧。';
      updateSummary();
      return;
    }
    if (list.length === 0) {
      empty.hidden = false;
      empty.querySelector("p").textContent = `「${activeCategory}」分类下还没有菜谱。`;
      updateSummary();
      return;
    }
    empty.hidden = true;

    list.forEach((recipe) => {
      const isSelected = state.selectedRecipeIds.includes(recipe.id);
      const card = document.createElement("div");
      card.className = "recipe-card" + (isSelected ? " selected" : "");
      card.dataset.id = recipe.id;

      const coverStyle = recipe.image
        ? `style="background-image:url('${recipe.image}')"`
        : "";
      const coverContent = recipe.image ? "" : escapeHtml(recipe.emoji || "🍽️");

      card.innerHTML = `
        ${recipe.category ? `<div class="category-tag">${escapeHtml(recipe.category)}</div>` : ""}
        ${isSelected ? '<div class="count-badge">✓</div>' : ""}
        <div class="cover" ${coverStyle}>${coverContent}</div>
        ${recipe.cookCount > 0 ? `<div class="cook-count">做过 ${recipe.cookCount} 次</div>` : ""}
        <div class="name">${escapeHtml(recipe.name)}</div>
      `;
      card.addEventListener("click", () => openDetail(recipe.id));
      grid.appendChild(card);
    });
    updateSummary();
  }

  function toggleRecipe(id) {
    const idx = state.selectedRecipeIds.indexOf(id);
    if (idx === -1) {
      state.selectedRecipeIds.push(id);
      const recipe = state.recipes.find((r) => r.id === id);
      if (recipe) showToast("已加入:" + recipe.name);
    } else {
      state.selectedRecipeIds.splice(idx, 1);
      pruneCartChecked();
      showToast("已移出菜单");
    }
    saveState();
    renderRecipes();
    updateCartBadge();
  }

  // 清掉那些已经不在购物车里的勾选状态(共享食材会保留)
  function pruneCartChecked() {
    const cart = computeCart();
    const validKeys = new Set(cart.map((c) => c.key));
    Object.keys(state.cartChecked).forEach((k) => {
      if (!validKeys.has(k)) delete state.cartChecked[k];
    });
  }

  $("#clearSelected").addEventListener("click", () => {
    if (state.selectedRecipeIds.length === 0) return;
    state.selectedRecipeIds = [];
    state.cartChecked = {};
    saveState();
    renderRecipes();
    updateCartBadge();
    showToast("已清空");
  });

  function updateSummary() {
    $("#selectedSummary").textContent = `已选 ${state.selectedRecipeIds.length} 道菜`;
    updateCartBadge();
  }

  function updateCartBadge() {
    const cart = computeCart();
    const badge = $("#cartBadge");
    badge.textContent = cart.length;
    badge.dataset.empty = cart.length === 0;
  }

  // ---------- 详情弹层 ----------
  function openDetail(id) {
    const recipe = state.recipes.find((r) => r.id === id);
    if (!recipe) return;
    currentDetailId = id;

    const cover = $("#detailCover");
    if (recipe.image) {
      cover.style.backgroundImage = `url('${recipe.image}')`;
      cover.textContent = "";
    } else {
      cover.style.backgroundImage = "";
      cover.textContent = recipe.emoji || "🍽️";
    }

    $("#detailName").textContent = recipe.name;
    $("#detailCategory").textContent = recipe.category || "";
    updateCookStepper(recipe.cookCount || 0);

    const ingList = $("#detailIngredients");
    ingList.innerHTML = "";
    if (recipe.ingredients.length === 0) {
      ingList.innerHTML = '<li style="color:#999;background:transparent;">暂无食材</li>';
    } else {
      recipe.ingredients.forEach((ing) => {
        const li = document.createElement("li");
        li.textContent = ing.name;
        ingList.appendChild(li);
      });
    }

    $("#detailNotes").textContent = recipe.notes || "";
    updateDetailButton();
    $("#detailModal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function updateDetailButton() {
    if (!currentDetailId) return;
    const btn = $("#detailToggle");
    const isSelected = state.selectedRecipeIds.includes(currentDetailId);
    btn.textContent = isSelected ? "✓ 已加入" : "加入今日菜单";
    btn.classList.toggle("in-cart", isSelected);
  }

  function closeDetail() {
    $("#detailModal").hidden = true;
    document.body.style.overflow = "";
    currentDetailId = null;
  }

  $("#detailClose").addEventListener("click", closeDetail);
  $("#detailModal").addEventListener("click", (e) => {
    if (e.target.id === "detailModal") closeDetail();
  });

  $("#detailToggle").addEventListener("click", () => {
    if (!currentDetailId) return;
    toggleRecipe(currentDetailId);
    updateDetailButton();
  });

  $("#detailEdit").addEventListener("click", () => {
    if (!currentDetailId) return;
    const recipe = state.recipes.find((r) => r.id === currentDetailId);
    if (!recipe) return;
    closeDetail();
    loadRecipeIntoForm(recipe);
  });

  function updateCookStepper(count) {
    $("#detailCookCount").textContent = `做过 ${count} 次`;
    $("#cookMinus").disabled = count <= 0;
  }

  function adjustCookCount(delta) {
    if (!currentDetailId) return;
    const recipe = state.recipes.find((r) => r.id === currentDetailId);
    if (!recipe) return;
    const next = Math.max(0, (recipe.cookCount || 0) + delta);
    if (next === recipe.cookCount) return;
    recipe.cookCount = next;
    saveState();
    updateCookStepper(next);
    renderRecipes();
    if (delta > 0) showToast(`已记录,共做过 ${next} 次`);
    else showToast(`已撤销一次,共 ${next} 次`);
  }

  $("#cookPlus").addEventListener("click", () => adjustCookCount(+1));
  $("#cookMinus").addEventListener("click", () => adjustCookCount(-1));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#detailModal").hidden) closeDetail();
  });

  // ---------- 购物车合并(按食材名去重) ----------
  function computeCart() {
    const map = new Map();
    state.selectedRecipeIds.forEach((rid) => {
      const recipe = state.recipes.find((r) => r.id === rid);
      if (!recipe) return;
      recipe.ingredients.forEach((ing) => {
        const name = (ing.name || "").trim();
        if (!name) return;
        const key = name;
        if (map.has(key)) {
          const item = map.get(key);
          if (!item.sources.includes(recipe.name)) item.sources.push(recipe.name);
        } else {
          map.set(key, { key, name, sources: [recipe.name] });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "zh"));
  }

  function groupCart(cart) {
    const groups = new Map();
    const order = [...INGREDIENT_GROUPS.map((g) => g.name), OTHER_GROUP];
    cart.forEach((item) => {
      const g = classifyIngredient(item.name);
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(item);
    });
    return order
      .filter((g) => groups.has(g))
      .map((g) => ({ name: g, items: groups.get(g) }));
  }

  function renderCart() {
    const cart = computeCart();
    const container = $("#cartGroups");
    const empty = $("#emptyCart");
    container.innerHTML = "";

    if (cart.length === 0) {
      empty.hidden = false;
      $("#selectedRecipes").innerHTML = "";
      return;
    }
    empty.hidden = true;

    const groups = groupCart(cart);
    groups.forEach((group) => {
      const section = document.createElement("div");
      section.className = "cart-group";
      const title = document.createElement("h3");
      title.className = "cart-group-title";
      title.textContent = group.name;
      section.appendChild(title);

      const ul = document.createElement("ul");
      ul.className = "cart-list";
      group.items.forEach((item) => {
        const checked = !!state.cartChecked[item.key];
        const li = document.createElement("li");
        li.className = "cart-item" + (checked ? " checked" : "");
        li.innerHTML = `
          <input type="checkbox" class="cart-check" ${checked ? "checked" : ""} />
          <div class="cart-item-body">
            <div class="ingredient-name">${escapeHtml(item.name)}</div>
            <span class="ingredient-sources">来自:${escapeHtml(item.sources.join("、"))}</span>
          </div>
        `;
        li.querySelector(".cart-check").addEventListener("change", (e) => {
          state.cartChecked[item.key] = e.target.checked;
          saveState();
          li.classList.toggle("checked", e.target.checked);
        });
        ul.appendChild(li);
      });
      section.appendChild(ul);
      container.appendChild(section);
    });

    const selRecipes = state.selectedRecipeIds
      .map((id) => state.recipes.find((r) => r.id === id))
      .filter(Boolean);
    if (selRecipes.length > 0) {
      $("#selectedRecipes").innerHTML = `
        <h3>本次菜单(${selRecipes.length} 道)</h3>
        <div class="chip-list">
          ${selRecipes.map((r) => `<span class="chip">${escapeHtml(r.emoji || "🍽️")} ${escapeHtml(r.name)}</span>`).join("")}
        </div>
      `;
    } else {
      $("#selectedRecipes").innerHTML = "";
    }
  }

  // ---------- 文本生成 ----------
  function buildCartText() {
    const cart = computeCart();
    if (cart.length === 0) return "";
    const groups = groupCart(cart);
    const lines = ["🛒 今日买菜清单"];
    groups.forEach((g) => {
      lines.push("");
      lines.push(g.name);
      g.items.forEach((item) => lines.push(`  ☐ ${item.name}`));
    });
    return lines.join("\n");
  }

  function getDateStr() {
    const d = new Date();
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
  }

  function getSelectedRecipes() {
    return state.selectedRecipeIds
      .map((id) => state.recipes.find((r) => r.id === id))
      .filter(Boolean);
  }

  function buildMenuText(detailed) {
    const selRecipes = getSelectedRecipes();
    const lines = [`🍽️ 今日菜单 · ${getDateStr()}`, ""];
    if (selRecipes.length === 0) {
      lines.push("(还没有选菜)");
      return lines.join("\n");
    }
    selRecipes.forEach((r, i) => {
      lines.push(`${i + 1}. ${r.emoji || "🍽️"} ${r.name}${r.category ? `  [${r.category}]` : ""}`);
      if (detailed) {
        if (r.ingredients.length > 0) {
          lines.push(`   食材:${r.ingredients.map((ing) => ing.name).join("、")}`);
        }
        if (r.notes) {
          const notesLines = r.notes.split("\n");
          lines.push(`   做法:`);
          notesLines.forEach((nl) => lines.push(`     ${nl}`));
        }
        lines.push("");
      }
    });
    return lines.join("\n").trimEnd();
  }

  function buildShareText(mode) {
    let body = "";
    if (mode === "menu") {
      body = buildMenuText(true);
    } else if (mode === "list") {
      const cartText = buildCartText();
      body = cartText || "(购物车是空的)";
    } else {
      // full
      body = buildMenuText(false);
      const cartText = buildCartText();
      if (cartText) {
        body += "\n\n―――――――――――\n\n" + cartText;
      }
    }
    return body + "\n\n— 来自「买菜小助手」";
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (e) {
        reject(e);
      }
      document.body.removeChild(ta);
    });
  }

  // ---------- 复制清单 ----------
  $("#copyCart").addEventListener("click", () => {
    const text = buildCartText();
    if (!text) {
      showToast("购物车是空的");
      return;
    }
    copyText(text).then(
      () => showToast("已复制到剪贴板"),
      () => showToast("复制失败")
    );
  });

  // ---------- 分享 ----------
  let shareMode = "full";

  $("#shareCart").addEventListener("click", () => openShareModal("full"));
  $("#shareMenuBtn").addEventListener("click", () => openShareModal("menu"));

  function openShareModal(mode) {
    if (state.selectedRecipeIds.length === 0) {
      showToast("先去菜谱页选几个菜吧");
      return;
    }
    shareMode = mode || "full";
    $$("#shareModeTabs .share-mode-tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.mode === shareMode);
    });
    refreshSharePreview();
    $("#shareImageWrap").hidden = true;
    $("#shareImageEl").src = "";
    $("#shareNative").hidden = !(navigator.share && typeof navigator.share === "function");
    $("#shareModal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function refreshSharePreview() {
    $("#sharePreview").textContent = buildShareText(shareMode);
  }

  $$("#shareModeTabs .share-mode-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      shareMode = tab.dataset.mode;
      $$("#shareModeTabs .share-mode-tab").forEach((t) => {
        t.classList.toggle("active", t === tab);
      });
      refreshSharePreview();
      $("#shareImageWrap").hidden = true;
    });
  });

  function closeShareModal() {
    $("#shareModal").hidden = true;
    document.body.style.overflow = "";
  }

  $("#shareClose").addEventListener("click", closeShareModal);
  $("#shareModal").addEventListener("click", (e) => {
    if (e.target.id === "shareModal") closeShareModal();
  });

  $("#shareCopy").addEventListener("click", () => {
    copyText(buildShareText(shareMode)).then(
      () => showToast("已复制,粘贴到聊天里发给朋友吧"),
      () => showToast("复制失败")
    );
  });

  $("#shareNative").addEventListener("click", async () => {
    try {
      await navigator.share({ title: "今日菜单", text: buildShareText(shareMode) });
    } catch (e) {
      /* 用户取消 */
    }
  });

  $("#shareImage").addEventListener("click", () => {
    const dataUrl = renderShareImage(shareMode);
    if (!dataUrl) {
      showToast("生成失败");
      return;
    }
    $("#shareImageEl").src = dataUrl;
    $("#shareImageWrap").hidden = false;
    setTimeout(() => $("#shareImageEl").scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  });

  function renderShareImage(mode) {
    mode = mode || "full";
    const selRecipes = getSelectedRecipes();
    const cart = computeCart();
    const groups = groupCart(cart);
    const dateStr = getDateStr();

    const W = 750;
    const PAD = 40;
    const cardX = 24, cardW = W - 48;
    const innerW = cardW - 64; // 32 padding both sides
    const dpr = window.devicePixelRatio || 2;
    const fontBase = `-apple-system, "PingFang SC", sans-serif`;

    // 用一个临时 canvas 度量文本换行
    const measureCanvas = document.createElement("canvas");
    const mctx = measureCanvas.getContext("2d");
    function wrapText(text, maxWidth, font) {
      mctx.font = font;
      const lines = [];
      const paragraphs = String(text || "").split("\n");
      paragraphs.forEach((para) => {
        if (!para) {
          lines.push("");
          return;
        }
        let line = "";
        for (let i = 0; i < para.length; i++) {
          const ch = para[i];
          const test = line + ch;
          if (mctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = ch;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);
      });
      return lines;
    }

    // 预计算高度
    let h = 0;
    h += 36; // top padding inside card
    h += 44; // 大标题
    h += 30; // 日期
    h += 36; // 分隔

    const blocks = [];
    if (mode === "full" || mode === "menu") {
      blocks.push({ type: "section", text: mode === "menu" ? "✨ 今日菜单" : "✨ 今天做这些" });
      h += 36;
      selRecipes.forEach((r) => {
        blocks.push({ type: "recipe", recipe: r });
        h += 30; // name line
        if (mode === "menu") {
          if (r.ingredients.length > 0) {
            const ingText = "食材:" + r.ingredients.map((i) => i.name).join("、");
            const ls = wrapText(ingText, innerW - 24, `14px ${fontBase}`);
            blocks.push({ type: "ingredients", lines: ls });
            h += ls.length * 22 + 4;
          }
          if (r.notes) {
            const ls = wrapText(r.notes, innerW - 24, `14px ${fontBase}`);
            blocks.push({ type: "notes", lines: ls });
            h += 22; // "做法:" label
            h += ls.length * 22 + 4;
          }
          h += 14; // gap
        }
      });
      h += 12;
    }

    if (mode === "full" || mode === "list") {
      blocks.push({ type: "section", text: "🛒 买菜清单" });
      h += 36;
      groups.forEach((g) => {
        blocks.push({ type: "groupTitle", text: g.name });
        h += 26;
        g.items.forEach((item) => {
          blocks.push({ type: "groupItem", text: item.name });
          h += 24;
        });
        h += 8;
      });
    }

    h += 50; // 底部

    const canvas = document.createElement("canvas");
    canvas.width = W * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.textBaseline = "top";

    // 背景
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#c5b9e8");
    bg.addColorStop(1, "#ede7f6");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, h);

    // 卡片
    const cardY = 0;
    const cardH = h;
    roundRect(ctx, cardX, cardY + 24, cardW, cardH - 48, 20);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    let y = cardY + 24 + 32;

    // 大标题
    ctx.fillStyle = "#6f63b5";
    ctx.font = `bold 28px ${fontBase}`;
    const titleText = mode === "menu" ? "🍽️  今日菜单" : mode === "list" ? "🛒  买菜清单" : "🍽️  今日菜单";
    ctx.fillText(titleText, cardX + 32, y);
    y += 42;
    ctx.fillStyle = "#888";
    ctx.font = `14px ${fontBase}`;
    ctx.fillText(dateStr, cardX + 32, y);
    y += 30;

    // 分隔线
    ctx.strokeStyle = "#ebe6f3";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 32, y);
    ctx.lineTo(cardX + cardW - 32, y);
    ctx.stroke();
    y += 16;

    blocks.forEach((b) => {
      if (b.type === "section") {
        ctx.fillStyle = "#6f63b5";
        ctx.font = `bold 18px ${fontBase}`;
        ctx.fillText(b.text, cardX + 32, y);
        y += 32;
      } else if (b.type === "recipe") {
        ctx.fillStyle = "#222";
        ctx.font = `bold 16px ${fontBase}`;
        const cat = b.recipe.category ? `  [${b.recipe.category}]` : "";
        ctx.fillText(`${b.recipe.emoji || "🍽️"}  ${b.recipe.name}${cat}`, cardX + 44, y);
        y += 28;
      } else if (b.type === "ingredients") {
        ctx.fillStyle = "#555";
        ctx.font = `14px ${fontBase}`;
        b.lines.forEach((ln, i) => {
          ctx.fillText(ln, cardX + 64, y);
          y += 22;
        });
        y += 4;
      } else if (b.type === "notes") {
        ctx.fillStyle = "#7e6fb8";
        ctx.font = `600 14px ${fontBase}`;
        ctx.fillText("做法:", cardX + 64, y);
        y += 22;
        ctx.fillStyle = "#555";
        ctx.font = `14px ${fontBase}`;
        b.lines.forEach((ln) => {
          ctx.fillText(ln, cardX + 78, y);
          y += 22;
        });
        y += 18;
      } else if (b.type === "groupTitle") {
        ctx.fillStyle = "#7e6fb8";
        ctx.font = `600 14px ${fontBase}`;
        ctx.fillText(b.text, cardX + 44, y);
        y += 24;
      } else if (b.type === "groupItem") {
        ctx.fillStyle = "#444";
        ctx.font = `15px ${fontBase}`;
        ctx.fillText(`  ☐  ${b.text}`, cardX + 60, y);
        y += 24;
      }
    });

    // 底部
    ctx.fillStyle = "#aaa";
    ctx.font = `12px ${fontBase}`;
    ctx.textAlign = "center";
    ctx.fillText("— 来自「买菜小助手」 —", cardX + cardW / 2, cardY + cardH - 36);
    ctx.textAlign = "left";

    try {
      return canvas.toDataURL("image/png");
    } catch (e) {
      return null;
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#shareModal").hidden) closeShareModal();
  });

  // ---------- 添加 / 编辑菜谱 ----------
  function populateCategorySelect() {
    const sel = $("#recipeCategory");
    const current = sel.value;
    sel.innerHTML = "";
    getAllCategories().forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      sel.appendChild(opt);
    });
    if (current && getAllCategories().includes(current)) sel.value = current;
  }

  $("#addCategoryBtn").addEventListener("click", () => {
    const name = (prompt("输入新分类名称:") || "").trim();
    if (!name) return;
    if (getAllCategories().includes(name)) {
      showToast("分类已存在");
      $("#recipeCategory").value = name;
      return;
    }
    state.customCategories.push(name);
    saveState();
    populateCategorySelect();
    renderCategoryBar();
    renderCategoryManageList();
    $("#recipeCategory").value = name;
    showToast("已添加分类:" + name);
  });

  function renderCategoryManageList() {
    const list = $("#categoryManageList");
    list.innerHTML = "";
    getAllCategories().forEach((cat) => {
      const isDefault = DEFAULT_CATEGORIES.includes(cat);
      const li = document.createElement("li");
      li.className = "category-manage-item" + (isDefault ? " locked" : "");
      li.innerHTML = `
        <span>${escapeHtml(cat)}</span>
        <button class="delete-cat" title="删除分类">×</button>
      `;
      li.querySelector(".delete-cat").addEventListener("click", () => {
        const used = state.recipes.some((r) => r.category === cat);
        if (used && !confirm(`分类「${cat}」下还有菜谱,删除后这些菜会归到「素菜」。继续?`)) return;
        if (!used && !confirm(`删除分类「${cat}」?`)) return;
        state.customCategories = state.customCategories.filter((c) => c !== cat);
        state.recipes.forEach((r) => {
          if (r.category === cat) r.category = "素菜";
        });
        if (activeCategory === cat) activeCategory = ALL_CATEGORY;
        saveState();
        renderCategoryBar();
        renderCategoryManageList();
        populateCategorySelect();
        renderRecipes();
        renderManageList();
      });
      list.appendChild(li);
    });
  }

  function addIngredientRow(data) {
    data = data || { name: "" };
    const row = document.createElement("div");
    row.className = "ingredient-row";
    row.innerHTML = `
      <input type="text" class="ing-name" placeholder="食材名称" value="${escapeAttr(data.name)}" />
      <button type="button" class="remove" title="删除">×</button>
    `;
    row.querySelector(".remove").addEventListener("click", () => {
      row.remove();
      if ($("#ingredientList").children.length === 0) addIngredientRow();
    });
    $("#ingredientList").appendChild(row);
  }

  $("#addIngredient").addEventListener("click", () => addIngredientRow());

  // ---------- 图片上传 ----------
  function setPreviewImage(dataUrl) {
    pendingImage = dataUrl || "";
    const preview = $("#imagePreview");
    if (pendingImage) {
      preview.style.backgroundImage = `url('${pendingImage}')`;
      preview.innerHTML = "";
      $("#clearImage").hidden = false;
    } else {
      preview.style.backgroundImage = "";
      preview.innerHTML = '<span class="image-placeholder">未上传</span>';
      $("#clearImage").hidden = true;
    }
  }

  $("#recipeImageFile").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("请选择图片文件");
      return;
    }
    resizeImage(file)
      .then((dataUrl) => setPreviewImage(dataUrl))
      .catch(() => showToast("图片处理失败"));
    e.target.value = "";
  });

  $("#clearImage").addEventListener("click", () => setPreviewImage(""));

  function resizeImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let { width, height } = img;
          if (width > MAX_IMAGE_DIM || height > MAX_IMAGE_DIM) {
            const scale = Math.min(MAX_IMAGE_DIM / width, MAX_IMAGE_DIM / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          try {
            resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
          } catch (e) {
            reject(e);
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function resetForm() {
    $("#recipeId").value = "";
    $("#recipeName").value = "";
    $("#recipeEmoji").value = "";
    populateCategorySelect();
    $("#recipeCategory").value = getAllCategories()[0] || "素菜";
    $("#recipeNotes").value = "";
    $("#ingredientList").innerHTML = "";
    addIngredientRow();
    setPreviewImage("");
    $("#cancelEdit").hidden = true;
    $("#saveRecipe").textContent = "保存菜谱";
  }

  function loadRecipeIntoForm(recipe) {
    populateCategorySelect();
    $("#recipeId").value = recipe.id;
    $("#recipeName").value = recipe.name;
    $("#recipeEmoji").value = recipe.emoji || "";
    $("#recipeCategory").value = recipe.category || getAllCategories()[0];
    $("#recipeNotes").value = recipe.notes || "";
    $("#ingredientList").innerHTML = "";
    if (recipe.ingredients.length === 0) {
      addIngredientRow();
    } else {
      recipe.ingredients.forEach((ing) => addIngredientRow(ing));
    }
    setPreviewImage(recipe.image || "");
    $("#cancelEdit").hidden = false;
    $("#saveRecipe").textContent = "更新菜谱";
    switchTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $("#cancelEdit").addEventListener("click", resetForm);

  $("#recipeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = $("#recipeId").value || genId();
    const name = $("#recipeName").value.trim();
    const emoji = $("#recipeEmoji").value.trim() || "🍽️";
    const category = $("#recipeCategory").value || "素菜";
    const notes = $("#recipeNotes").value.trim();
    if (!name) {
      showToast("请输入菜名");
      return;
    }
    const ingredients = [];
    $$("#ingredientList .ingredient-row").forEach((row) => {
      const ingName = row.querySelector(".ing-name").value.trim();
      if (!ingName) return;
      ingredients.push({ name: ingName });
    });
    if (ingredients.length === 0) {
      showToast("至少添加一个食材");
      return;
    }
    const existing = state.recipes.find((r) => r.id === id);
    const recipe = {
      id,
      name,
      emoji,
      image: pendingImage,
      category,
      notes,
      cookCount: existing ? existing.cookCount || 0 : 0,
      ingredients
    };
    if (existing) {
      const idx = state.recipes.indexOf(existing);
      state.recipes[idx] = recipe;
      showToast("已更新");
    } else {
      state.recipes.unshift(recipe);
      showToast("已保存");
    }
    saveState();
    resetForm();
    renderManageList();
    renderRecipes();
    updateCartBadge();
  });

  function renderManageList() {
    const list = $("#manageList");
    list.innerHTML = "";
    if (state.recipes.length === 0) {
      list.innerHTML = '<li style="color:#999;font-size:13px;">还没有菜谱</li>';
      return;
    }
    state.recipes.forEach((recipe) => {
      const li = document.createElement("li");
      li.className = "manage-item";
      const thumbStyle = recipe.image
        ? `style="background-image:url('${recipe.image}')"`
        : "";
      const thumbContent = recipe.image ? "" : escapeHtml(recipe.emoji || "🍽️");
      li.innerHTML = `
        <span class="thumb" ${thumbStyle}>${thumbContent}</span>
        <span class="name">${escapeHtml(recipe.name)}<br><small style="color:#999;font-size:12px;">${escapeHtml(recipe.category || "")} · ${recipe.ingredients.length} 种食材 · 做过 ${recipe.cookCount || 0} 次</small></span>
        <span class="actions">
          <button class="edit">编辑</button>
          <button class="delete">删除</button>
        </span>
      `;
      li.querySelector(".edit").addEventListener("click", () => loadRecipeIntoForm(recipe));
      li.querySelector(".delete").addEventListener("click", () => {
        if (!confirm(`确定删除「${recipe.name}」吗?`)) return;
        state.recipes = state.recipes.filter((r) => r.id !== recipe.id);
        state.selectedRecipeIds = state.selectedRecipeIds.filter((sid) => sid !== recipe.id);
        pruneCartChecked();
        saveState();
        renderManageList();
        renderRecipes();
        updateCartBadge();
        showToast("已删除");
      });
      list.appendChild(li);
    });
  }

  // ---------- Toast ----------
  let toastTimer = null;
  function showToast(msg) {
    let toast = $(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => toast.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1500);
  }

  // ---------- 初始化 ----------
  populateCategorySelect();
  resetForm();
  renderCategoryBar();
  renderRecipes();
  renderManageList();
  renderCategoryManageList();
  updateCartBadge();
})();
