/**
 * 文创工作台 - 主应用
 */
// SVG 图标库
const ICONS = {
  logo: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4654a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`,
  todo: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  inspiration: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8a4 4 0 0 1 4 4 6 6 0 0 1-2.5 4.9l-1.5 1.1-1.5-1.1A6 6 0 0 1 8 12a4 4 0 0 1 4-4z"/><path d="M12 18v3"/><path d="M9 21h6"/></svg>`,
  knowledge: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  crossover: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  note: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  emptyTodo: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4654a" stroke-width="1.2"><rect x="3" y="5" width="18" height="18" rx="2"/><path d="M8 1v4M16 1v4M3 9h18"/></svg>`,
  emptyInsp: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4654a" stroke-width="1.2"><path d="M12 8a4 4 0 0 1 4 4 6 6 0 0 1-2.5 4.9l-1.5 1.1-1.5-1.1A6 6 0 0 1 8 12a4 4 0 0 1 4-4z"/><path d="M12 18v3"/></svg>`,
  emptyKnow: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4654a" stroke-width="1.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  emptyCross: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4654a" stroke-width="1.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  delete: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  link: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  export: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  import: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`
};

// 全局数据库实例
let db;
let currentDate; // 当前选中日期
let currentView = 'todo'; // todo | inspiration | knowledge | crossover
let editingId = null;

// ========== 初始化 ==========
function initApp() {
  db = new Database();
  seedDataIfEmpty(db);
  currentDate = db.formatDate(new Date());

  // 检查 URL 参数，支持直接跳转某个 tab
  const hash = window.location.hash.replace('#', '');
  if (['todo', 'inspiration', 'knowledge', 'crossover'].includes(hash)) {
    currentView = hash;
  }

  renderApp();
  setupKeyboardShortcuts();
}

// 快捷键
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + 1-4 切换标签
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
      e.preventDefault();
      const views = ['todo', 'inspiration', 'knowledge', 'crossover'];
      switchView(views[parseInt(e.key) - 1]);
    }
    // N 键快速新建
    if (e.key === 'n' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openAddModal();
    }
    // T 键回到今天
    if (e.key === 't' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      currentDate = db.formatDate(new Date());
      if (currentView === 'todo') renderTodoView();
    }
  });
}

// ========== 主框架 ==========
function renderApp() {
  const stats = db.getStats();
  document.getElementById('app').innerHTML = `
    ${renderHeader(stats)}
    <div class="layout">
      ${renderSidebar()}
      <main class="main-content" id="mainContent">
        ${renderCurrentView()}
      </main>
    </div>
    <div id="modalContainer"></div>
    <div id="toastContainer"></div>
  `;
  bindGlobalEvents();
}

function renderHeader(stats) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  return `
    <header class="app-header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-icon">${ICONS.logo}</span>
          <div>
            <h1>文创工作台</h1>
            <p class="date-text">${dateStr}</p>
          </div>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-pill" title="今日待办完成情况">
          <span class="stat-num">${stats.todayDone}/${stats.todayTotal}</span>
          <span class="stat-label">今日待办</span>
        </div>
        <div class="stat-pill" title="待二创的种草文">
          <span class="stat-num">${stats.inspirationsPending}</span>
          <span class="stat-label">待二创</span>
        </div>
        <div class="stat-pill" title="知识库总数">
          <span class="stat-num">${stats.knowledge}</span>
          <span class="stat-label">知识库</span>
        </div>
        <div class="stat-pill" title="跨界案例">
          <span class="stat-num">${stats.crossover}</span>
          <span class="stat-label">跨界案例</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-icon" onclick="exportData()" title="导出数据">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button class="btn-icon" onclick="importData()" title="导入数据">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </button>
      </div>
    </header>
  `;
}

function renderSidebar() {
  const views = [
    { id: 'todo', icon: ICONS.todo, label: '每日待办', desc: '今日要做的事' },
    { id: 'inspiration', icon: ICONS.inspiration, label: '种草文素材', desc: '小红书爆款采集' },
    { id: 'knowledge', icon: ICONS.knowledge, label: '文创科普', desc: '创业知识库' },
    { id: 'crossover', icon: ICONS.crossover, label: '跨界融合', desc: '文创+各行业' }
  ];
  return `
    <aside class="sidebar">
      <nav class="nav">
        ${views.map(v => `
          <button class="nav-item ${currentView === v.id ? 'active' : ''}" onclick="switchView('${v.id}')">
            <span class="nav-icon">${v.icon}</span>
            <div class="nav-text">
              <span class="nav-label">${v.label}</span>
              <span class="nav-desc">${v.desc}</span>
            </div>
          </button>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <div class="shortcuts">
          <p><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd> 切换模块</p>
          <p><kbd>N</kbd> 快速新建</p>
          <p><kbd>T</kbd> 回到今天</p>
        </div>
      </div>
    </aside>
  `;
}

function renderCurrentView() {
  switch (currentView) {
    case 'todo': return renderTodoView();
    case 'inspiration': return renderInspirationView();
    case 'knowledge': return renderKnowledgeView();
    case 'crossover': return renderCrossoverView();
    default: return renderTodoView();
  }
}

function switchView(view) {
  currentView = view;
  window.location.hash = view;
  // 更新侧边栏激活态
  document.querySelectorAll('.nav-item').forEach((btn, i) => {
    const ids = ['todo', 'inspiration', 'knowledge', 'crossover'];
    btn.classList.toggle('active', ids[i] === view);
  });
  document.getElementById('mainContent').innerHTML = renderCurrentView();
}

// ========== 待办视图 ==========
function renderTodoView() {
  const todos = db.getTodos(currentDate);
  const note = db.getNote(currentDate);
  const sorted = [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const pOrder = { high: 0, medium: 1, low: 2 };
    return pOrder[a.priority] - pOrder[b.priority];
  });

  return `
    <div class="view todo-view">
      <div class="view-header">
        <div class="date-nav">
          <button class="btn-icon" onclick="changeDate(-1)" title="前一天">‹</button>
          <div class="date-display">
            <input type="date" id="datePicker" value="${currentDate}" onchange="changeToDate(this.value)" class="date-picker">
            ${currentDate === db.formatDate(new Date()) ? '<span class="today-badge">今天</span>' : ''}
          </div>
          <button class="btn-icon" onclick="changeDate(1)" title="后一天">›</button>
          ${currentDate !== db.formatDate(new Date()) ? '<button class="btn-text" onclick="goToday()">回到今天</button>' : ''}
        </div>
        <button class="btn-primary" onclick="openAddTodoModal()">
          ${ICONS.plus}
          添加待办
        </button>
      </div>

      <div class="todo-progress">
        ${todos.length > 0 ? `
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${todos.filter(t => t.done).length / todos.length * 100}%"></div>
          </div>
          <span class="progress-text">${todos.filter(t => t.done).length} / ${todos.length} 已完成</span>
        ` : '<span class="empty-hint">今天还没有待办，点击右上角添加</span>'}
      </div>

      <div class="todo-list" id="todoList">
        ${sorted.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">${ICONS.emptyTodo}</div>
            <p>暂无待办事项</p>
            <button class="btn-primary" onclick="openAddTodoModal()">添加第一个待办</button>
          </div>
        ` : sorted.map(todo => renderTodoItem(todo)).join('')}
      </div>

      <div class="note-section">
        <div class="note-header">
          <h3>${ICONS.note} 每日复盘笔记</h3>
          <span class="note-hint">记录灵感、复盘、想法…</span>
        </div>
        <textarea id="noteArea" class="note-area" placeholder="今天的复盘、灵感、待改进的点…" onblur="saveNote()">${note}</textarea>
      </div>
    </div>
  `;
}

function renderTodoItem(todo) {
  const cat = CATEGORIES.todo.find(c => c.value === todo.category) || CATEGORIES.todo[5];
  const pri = PRIORITY.find(p => p.value === todo.priority) || PRIORITY[1];
  return `
    <div class="todo-item ${todo.done ? 'done' : ''}" data-id="${todo.id}">
      <label class="checkbox-wrap">
        <input type="checkbox" ${todo.done ? 'checked' : ''} onchange="toggleTodo('${todo.id}')">
        <span class="checkbox-custom"></span>
      </label>
      <div class="todo-content">
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <div class="todo-meta">
          <span class="tag" style="background:${cat.color}20;color:${cat.color}">${cat.label}</span>
          <span class="priority-dot" style="background:${pri.color}" title="${pri.label}优先级"></span>
        </div>
      </div>
      <div class="todo-actions">
        <button class="btn-icon-sm" onclick="editTodo('${todo.id}')" title="编辑">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon-sm danger" onclick="deleteTodo('${todo.id}')" title="删除">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `;
}

// ========== 种草文素材视图 ==========
function renderInspirationView() {
  const filter = window._inspFilter || {};
  const list = db.getInspirations(filter);
  return `
    <div class="view">
      <div class="view-header">
        <h2>种草文素材库</h2>
        <button class="btn-primary" onclick="openAddInspirationModal()">
          ${ICONS.plus}
          添加素材
        </button>
      </div>
      <div class="filter-bar">
        <input type="text" class="search-input" placeholder="搜索标题、摘要、标签…" value="${filter.keyword || ''}" oninput="filterInspiration(this.value)" id="inspSearch">
        <select class="filter-select" onchange="filterInspirationCategory(this.value)">
          <option value="">全部分类</option>
          ${CATEGORIES.inspiration.map(c => `<option value="${c}" ${filter.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <select class="filter-select" onchange="filterInspirationStatus(this.value)">
          <option value="">全部状态</option>
          <option value="pending" ${filter.status === 'pending' ? 'selected' : ''}>待二创</option>
          <option value="doing" ${filter.status === 'doing' ? 'selected' : ''}>二创中</option>
          <option value="done" ${filter.status === 'done' ? 'selected' : ''}>已发布</option>
        </select>
      </div>
      <div class="card-grid" id="inspGrid">
        ${list.length === 0 ? `
          <div class="empty-state full">
            <div class="empty-icon">${ICONS.emptyInsp}</div>
            <p>暂无种草文素材</p>
            <p class="muted">去小红书找找灵感，添加到这里吧</p>
          </div>
        ` : list.map(item => renderInspirationCard(item)).join('')}
      </div>
    </div>
  `;
}

function renderInspirationCard(item) {
  const statusMap = {
    pending: { label: '待二创', color: '#f39c12', bg: '#fff3e0' },
    doing: { label: '二创中', color: '#3498db', bg: '#e3f2fd' },
    done: { label: '已发布', color: '#27ae60', bg: '#e8f5e9' }
  };
  const s = statusMap[item.status] || statusMap.pending;
  return `
    <div class="card" data-id="${item.id}">
      <div class="card-header">
        <span class="card-category">${item.category}</span>
        <span class="card-status" style="color:${s.color};background:${s.bg}">${s.label}</span>
      </div>
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <p class="card-summary">${escapeHtml(item.summary)}</p>
      ${item.tags && item.tags.length ? `<div class="card-tags">${item.tags.map(t => `<span class="card-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
      <div class="card-footer">
        <span class="card-date">${formatRelativeDate(item.savedAt)}</span>
        <div class="card-actions">
          <select class="status-select" onchange="updateInspirationStatus('${item.id}', this.value)" title="修改状态">
            <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>待二创</option>
            <option value="doing" ${item.status === 'doing' ? 'selected' : ''}>二创中</option>
            <option value="done" ${item.status === 'done' ? 'selected' : ''}>已发布</option>
          </select>
          ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" class="btn-icon-sm" title="查看原文">${ICONS.link}</a>` : ''}
          <button class="btn-icon-sm" onclick="editInspiration('${item.id}')" title="编辑">${ICONS.edit}</button>
          <button class="btn-icon-sm danger" onclick="deleteInspiration('${item.id}')" title="删除">${ICONS.delete}</button>
        </div>
      </div>
    </div>
  `;
}

// ========== 知识库视图 ==========
function renderKnowledgeView() {
  const filter = window._knowFilter || {};
  const list = db.getKnowledge(filter);
  return `
    <div class="view">
      <div class="view-header">
        <h2>文创创业知识库</h2>
        <button class="btn-primary" onclick="openAddKnowledgeModal()">
          ${ICONS.plus}
          添加知识
        </button>
      </div>
      <div class="filter-bar">
        <input type="text" class="search-input" placeholder="搜索知识…" value="${filter.keyword || ''}" oninput="filterKnowledge(this.value)">
        <select class="filter-select" onchange="filterKnowledgeCategory(this.value)">
          <option value="">全部分类</option>
          ${CATEGORIES.knowledge.map(c => `<option value="${c}" ${filter.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="list-view" id="knowList">
        ${list.length === 0 ? `
          <div class="empty-state full">
            <div class="empty-icon">${ICONS.emptyKnow}</div>
            <p>暂无知识条目</p>
          </div>
        ` : list.map(item => renderKnowledgeItem(item)).join('')}
      </div>
    </div>
  `;
}

function renderKnowledgeItem(item) {
  return `
    <div class="list-item ${item.read ? 'read' : ''}" data-id="${item.id}">
      <div class="list-item-main" onclick="toggleReadKnowledge('${item.id}')">
        <div class="list-item-header">
          <span class="read-dot ${item.read ? 'read' : ''}"></span>
          <h3 class="list-item-title">${escapeHtml(item.title)}</h3>
          <span class="card-category">${item.category}</span>
        </div>
        <p class="list-item-summary">${escapeHtml(item.summary)}</p>
        <span class="card-date">${formatRelativeDate(item.savedAt)}</span>
      </div>
      <div class="list-item-actions">
        ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" class="btn-icon-sm" title="查看原文">${ICONS.link}</a>` : ''}
        <button class="btn-icon-sm" onclick="editKnowledge('${item.id}')" title="编辑">${ICONS.edit}</button>
        <button class="btn-icon-sm danger" onclick="deleteKnowledge('${item.id}')" title="删除">${ICONS.delete}</button>
      </div>
    </div>
  `;
}

// ========== 跨界融合视图 ==========
function renderCrossoverView() {
  const filter = window._crossFilter || {};
  const list = db.getCrossover(filter);
  return `
    <div class="view">
      <div class="view-header">
        <h2>文创跨界融合案例</h2>
        <button class="btn-primary" onclick="openAddCrossoverModal()">
          ${ICONS.plus}
          添加案例
        </button>
      </div>
      <div class="filter-bar">
        <input type="text" class="search-input" placeholder="搜索案例…" value="${filter.keyword || ''}" oninput="filterCrossover(this.value)">
        <select class="filter-select" onchange="filterCrossoverCategory(this.value)">
          <option value="">全部分类</option>
          ${CATEGORIES.crossover.map(c => `<option value="${c}" ${filter.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="card-grid" id="crossGrid">
        ${list.length === 0 ? `
          <div class="empty-state full">
            <div class="empty-icon">${ICONS.emptyCross}</div>
            <p>暂无跨界案例</p>
          </div>
        ` : list.map(item => renderCrossoverCard(item)).join('')}
      </div>
    </div>
  `;
}

function renderCrossoverCard(item) {
  return `
    <div class="card" data-id="${item.id}">
      <div class="card-header">
        <span class="card-category">${item.category}</span>
        <span class="card-date">${formatRelativeDate(item.savedAt)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <p class="card-summary">${escapeHtml(item.summary)}</p>
      <div class="card-footer">
        <div></div>
        <div class="card-actions">
          ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" class="btn-icon-sm" title="查看原文">${ICONS.link}</a>` : ''}
          <button class="btn-icon-sm" onclick="editCrossover('${item.id}')" title="编辑">${ICONS.edit}</button>
          <button class="btn-icon-sm danger" onclick="deleteCrossover('${item.id}')" title="删除">${ICONS.delete}</button>
        </div>
      </div>
    </div>
  `;
}

// ========== 模态框 ==========
function openAddTodoModal() {
  editingId = null;
  const html = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <h3>添加待办</h3>
        <div class="form-group">
          <label>待办内容</label>
          <textarea id="todoText" placeholder="要做的事…" autofocus></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>分类</label>
            <select id="todoCategory">
              ${CATEGORIES.todo.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>优先级</label>
            <select id="todoPriority">
              ${PRIORITY.map(p => `<option value="${p.value}" ${p.value === 'medium' ? 'selected' : ''}>${p.label}优先级</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="closeModal()">取消</button>
          <button class="btn-primary" onclick="submitTodo()">保存</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = html;
  setTimeout(() => document.getElementById('todoText')?.focus(), 50);
}

function openAddInspirationModal() {
  editingId = null;
  const html = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg" onclick="event.stopPropagation()">
        <h3>添加种草文素材</h3>
        <div class="form-group">
          <label>标题</label>
          <input type="text" id="inspTitle" placeholder="种草文标题或你起的备注名">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>分类</label>
            <select id="inspCategory">
              ${CATEGORIES.inspiration.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>来源</label>
            <input type="text" id="inspSource" placeholder="小红书" value="小红书">
          </div>
        </div>
        <div class="form-group">
          <label>标签（逗号分隔）</label>
          <input type="text" id="inspTags" placeholder="如：故宫,冰箱贴,爆款">
        </div>
        <div class="form-group">
          <label>摘要 / 二创思路</label>
          <textarea id="inspSummary" rows="4" placeholder="这篇种草文的核心卖点、为什么适合二创、可以借鉴的点…"></textarea>
        </div>
        <div class="form-group">
          <label>原文链接</label>
          <input type="text" id="inspLink" placeholder="https://...">
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="closeModal()">取消</button>
          <button class="btn-primary" onclick="submitInspiration()">保存</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = html;
}

function openAddKnowledgeModal() {
  editingId = null;
  const html = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg" onclick="event.stopPropagation()">
        <h3>添加知识条目</h3>
        <div class="form-group">
          <label>标题</label>
          <input type="text" id="knowTitle" placeholder="知识标题">
        </div>
        <div class="form-group">
          <label>分类</label>
          <select id="knowCategory">
            ${CATEGORIES.knowledge.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>摘要 / 核心要点</label>
          <textarea id="knowSummary" rows="5" placeholder="这篇科普文的核心要点、你的笔记…"></textarea>
        </div>
        <div class="form-group">
          <label>原文链接</label>
          <input type="text" id="knowLink" placeholder="https://...">
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="closeModal()">取消</button>
          <button class="btn-primary" onclick="submitKnowledge()">保存</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = html;
}

function openAddCrossoverModal() {
  editingId = null;
  const html = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg" onclick="event.stopPropagation()">
        <h3>添加跨界案例</h3>
        <div class="form-group">
          <label>标题</label>
          <input type="text" id="crossTitle" placeholder="案例标题">
        </div>
        <div class="form-group">
          <label>分类</label>
          <select id="crossCategory">
            ${CATEGORIES.crossover.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>案例摘要 / 分析</label>
          <textarea id="crossSummary" rows="5" placeholder="案例模式、亮点、可借鉴的点…"></textarea>
        </div>
        <div class="form-group">
          <label>原文链接</label>
          <input type="text" id="crossLink" placeholder="https://...">
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="closeModal()">取消</button>
          <button class="btn-primary" onclick="submitCrossover()">保存</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = html;
}

function openAddModal() {
  switch (currentView) {
    case 'todo': openAddTodoModal(); break;
    case 'inspiration': openAddInspirationModal(); break;
    case 'knowledge': openAddKnowledgeModal(); break;
    case 'crossover': openAddCrossoverModal(); break;
  }
}

// ========== 表单提交 ==========
function submitTodo() {
  const text = document.getElementById('todoText').value.trim();
  if (!text) { showToast('请输入待办内容'); return; }
  const category = document.getElementById('todoCategory').value;
  const priority = document.getElementById('todoPriority').value;
  if (editingId) {
    db.updateTodo(currentDate, editingId, { text, category, priority });
    showToast('已更新');
  } else {
    db.addTodo(currentDate, { text, category, priority });
    showToast('已添加');
  }
  closeModal();
  renderTodoView && refreshView();
}

function submitInspiration() {
  const title = document.getElementById('inspTitle').value.trim();
  if (!title) { showToast('请输入标题'); return; }
  const data = {
    title,
    category: document.getElementById('inspCategory').value,
    source: document.getElementById('inspSource').value.trim() || '小红书',
    tags: document.getElementById('inspTags').value.split(/[,，]/).map(t => t.trim()).filter(Boolean),
    summary: document.getElementById('inspSummary').value.trim(),
    link: document.getElementById('inspLink').value.trim()
  };
  if (editingId) {
    db.updateInspiration(editingId, data);
    showToast('已更新');
  } else {
    db.addInspiration(data);
    showToast('已添加');
  }
  closeModal();
  refreshView();
}

function submitKnowledge() {
  const title = document.getElementById('knowTitle').value.trim();
  if (!title) { showToast('请输入标题'); return; }
  const data = {
    title,
    category: document.getElementById('knowCategory').value,
    summary: document.getElementById('knowSummary').value.trim(),
    link: document.getElementById('knowLink').value.trim()
  };
  if (editingId) {
    db.updateKnowledge(editingId, data);
    showToast('已更新');
  } else {
    db.addKnowledge(data);
    showToast('已添加');
  }
  closeModal();
  refreshView();
}

function submitCrossover() {
  const title = document.getElementById('crossTitle').value.trim();
  if (!title) { showToast('请输入标题'); return; }
  const data = {
    title,
    category: document.getElementById('crossCategory').value,
    summary: document.getElementById('crossSummary').value.trim(),
    link: document.getElementById('crossLink').value.trim()
  };
  if (editingId) {
    db.updateCrossover(editingId, data);
    showToast('已更新');
  } else {
    db.addCrossover(data);
    showToast('已添加');
  }
  closeModal();
  refreshView();
}

// ========== 编辑/删除/操作 ==========
function toggleTodo(id) {
  const todo = db.getTodos(currentDate).find(t => t.id === id);
  if (todo) {
    db.updateTodo(currentDate, id, { done: !todo.done });
    refreshView();
  }
}

function editTodo(id) {
  const todo = db.getTodos(currentDate).find(t => t.id === id);
  if (!todo) return;
  editingId = id;
  const html = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <h3>编辑待办</h3>
        <div class="form-group">
          <label>待办内容</label>
          <textarea id="todoText" placeholder="要做的事…">${escapeHtml(todo.text)}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>分类</label>
            <select id="todoCategory">
              ${CATEGORIES.todo.map(c => `<option value="${c.value}" ${todo.category === c.value ? 'selected' : ''}>${c.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>优先级</label>
            <select id="todoPriority">
              ${PRIORITY.map(p => `<option value="${p.value}" ${todo.priority === p.value ? 'selected' : ''}>${p.label}优先级</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="closeModal()">取消</button>
          <button class="btn-primary" onclick="submitTodo()">保存</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = html;
}

function deleteTodo(id) {
  if (!confirm('确定删除这条待办？')) return;
  db.deleteTodo(currentDate, id);
  refreshView();
  showToast('已删除');
}

function editInspiration(id) {
  const item = db.getInspirations().find(i => i.id === id);
  if (!item) return;
  editingId = id;
  const html = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg" onclick="event.stopPropagation()">
        <h3>编辑种草文素材</h3>
        <div class="form-group">
          <label>标题</label>
          <input type="text" id="inspTitle" value="${escapeHtml(item.title)}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>分类</label>
            <select id="inspCategory">
              ${CATEGORIES.inspiration.map(c => `<option value="${c}" ${item.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>来源</label>
            <input type="text" id="inspSource" value="${escapeHtml(item.source || '小红书')}">
          </div>
        </div>
        <div class="form-group">
          <label>标签（逗号分隔）</label>
          <input type="text" id="inspTags" value="${(item.tags || []).join(', ')}">
        </div>
        <div class="form-group">
          <label>摘要 / 二创思路</label>
          <textarea id="inspSummary" rows="4">${escapeHtml(item.summary)}</textarea>
        </div>
        <div class="form-group">
          <label>原文链接</label>
          <input type="text" id="inspLink" value="${escapeHtml(item.link || '')}">
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="closeModal()">取消</button>
          <button class="btn-primary" onclick="submitInspiration()">保存</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = html;
}

function deleteInspiration(id) {
  if (!confirm('确定删除这条素材？')) return;
  db.deleteInspiration(id);
  refreshView();
  showToast('已删除');
}

function updateInspirationStatus(id, status) {
  db.updateInspiration(id, { status });
  refreshView();
  showToast('状态已更新');
}

function editKnowledge(id) {
  const item = db.getKnowledge().find(i => i.id === id);
  if (!item) return;
  editingId = id;
  const html = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg" onclick="event.stopPropagation()">
        <h3>编辑知识条目</h3>
        <div class="form-group">
          <label>标题</label>
          <input type="text" id="knowTitle" value="${escapeHtml(item.title)}">
        </div>
        <div class="form-group">
          <label>分类</label>
          <select id="knowCategory">
            ${CATEGORIES.knowledge.map(c => `<option value="${c}" ${item.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>摘要 / 核心要点</label>
          <textarea id="knowSummary" rows="5">${escapeHtml(item.summary)}</textarea>
        </div>
        <div class="form-group">
          <label>原文链接</label>
          <input type="text" id="knowLink" value="${escapeHtml(item.link || '')}">
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="closeModal()">取消</button>
          <button class="btn-primary" onclick="submitKnowledge()">保存</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = html;
}

function deleteKnowledge(id) {
  if (!confirm('确定删除？')) return;
  db.deleteKnowledge(id);
  refreshView();
  showToast('已删除');
}

function toggleReadKnowledge(id) {
  const item = db.getKnowledge().find(i => i.id === id);
  if (item) {
    db.updateKnowledge(id, { read: !item.read });
    refreshView();
  }
}

function editCrossover(id) {
  const item = db.getCrossover().find(i => i.id === id);
  if (!item) return;
  editingId = id;
  const html = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal modal-lg" onclick="event.stopPropagation()">
        <h3>编辑跨界案例</h3>
        <div class="form-group">
          <label>标题</label>
          <input type="text" id="crossTitle" value="${escapeHtml(item.title)}">
        </div>
        <div class="form-group">
          <label>分类</label>
          <select id="crossCategory">
            ${CATEGORIES.crossover.map(c => `<option value="${c}" ${item.category === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>案例摘要 / 分析</label>
          <textarea id="crossSummary" rows="5">${escapeHtml(item.summary)}</textarea>
        </div>
        <div class="form-group">
          <label>原文链接</label>
          <input type="text" id="crossLink" value="${escapeHtml(item.link || '')}">
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" onclick="closeModal()">取消</button>
          <button class="btn-primary" onclick="submitCrossover()">保存</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = html;
}

function deleteCrossover(id) {
  if (!confirm('确定删除？')) return;
  db.deleteCrossover(id);
  refreshView();
  showToast('已删除');
}

// ========== 筛选 ==========
function filterInspiration(val) {
  window._inspFilter = window._inspFilter || {};
  window._inspFilter.keyword = val;
  debounce(() => { document.getElementById('mainContent').innerHTML = renderInspirationView(); })();
}
function filterInspirationCategory(val) {
  window._inspFilter = window._inspFilter || {};
  window._inspFilter.category = val;
  document.getElementById('mainContent').innerHTML = renderInspirationView();
}
function filterInspirationStatus(val) {
  window._inspFilter = window._inspFilter || {};
  window._inspFilter.status = val;
  document.getElementById('mainContent').innerHTML = renderInspirationView();
}
function filterKnowledge(val) {
  window._knowFilter = window._knowFilter || {};
  window._knowFilter.keyword = val;
  debounce(() => { document.getElementById('mainContent').innerHTML = renderKnowledgeView(); })();
}
function filterKnowledgeCategory(val) {
  window._knowFilter = window._knowFilter || {};
  window._knowFilter.category = val;
  document.getElementById('mainContent').innerHTML = renderKnowledgeView();
}
function filterCrossover(val) {
  window._crossFilter = window._crossFilter || {};
  window._crossFilter.keyword = val;
  debounce(() => { document.getElementById('mainContent').innerHTML = renderCrossoverView(); })();
}
function filterCrossoverCategory(val) {
  window._crossFilter = window._crossFilter || {};
  window._crossFilter.category = val;
  document.getElementById('mainContent').innerHTML = renderCrossoverView();
}

// ========== 日期导航 ==========
function changeDate(delta) {
  const d = new Date(currentDate);
  d.setDate(d.getDate() + delta);
  currentDate = db.formatDate(d);
  renderTodoView && (document.getElementById('mainContent').innerHTML = renderTodoView());
}
function changeToDate(date) {
  currentDate = date;
  document.getElementById('mainContent').innerHTML = renderTodoView();
}
function goToday() {
  currentDate = db.formatDate(new Date());
  document.getElementById('mainContent').innerHTML = renderTodoView();
}

// ========== 笔记 ==========
function saveNote() {
  const content = document.getElementById('noteArea').value;
  db.setNote(currentDate, content);
}

// ========== 数据导入导出 ==========
function exportData() {
  const data = db.export();
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `文创工作台_${db.formatDate(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('数据已导出');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (db.import(ev.target.result)) {
        showToast('导入成功');
        renderApp();
      } else {
        showToast('导入失败，文件格式错误');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ========== 工具函数 ==========
function closeModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('modalContainer').innerHTML = '';
  editingId = null;
}

function refreshView() {
  // 刷新统计
  const stats = db.getStats();
  document.querySelectorAll('.stat-pill').forEach((el, i) => {
    const num = el.querySelector('.stat-num');
    const nums = [`${stats.todayDone}/${stats.todayTotal}`, stats.inspirationsPending, stats.knowledge, stats.crossover];
    if (num) num.textContent = nums[i];
  });
  document.getElementById('mainContent').innerHTML = renderCurrentView();
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function formatRelativeDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}天前`;
  return d.toLocaleDateString('zh-CN');
}

let _debounceTimer;
function debounce(fn, delay = 300) {
  return (...args) => {
    clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(() => fn(...args), delay);
  };
}

function bindGlobalEvents() {
  // ESC 关闭模态框
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// 启动
document.addEventListener('DOMContentLoaded', initApp);
