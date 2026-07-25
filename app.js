/**
 * 文创工作台 v2 - 主应用
 * 3 大类导航：今日 / 素材库 / 账号
 */

// ========== SVG 图标 ==========
const ICONS = {
  today: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  library: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  account: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  delete: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  link: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  flame: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  export: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  import: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`
};

// ========== 全局状态 ==========
let db;
let currentDate;
let mainTab = 'today';        // today | library | account
let librarySubTab = 'inspiration'; // inspiration | knowledge | franchise
let editingId = null;

// ========== 初始化 ==========
function initApp() {
  db = new Database();
  seedDataIfEmpty(db);
  currentDate = db.formatDate(new Date());

  const hash = window.location.hash.replace('#', '');
  if (['today', 'library', 'account'].includes(hash)) {
    mainTab = hash;
  }

  renderApp();
  setupShortcuts();
}

function setupShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '3') {
      e.preventDefault();
      switchMainTab(['today', 'library', 'account'][parseInt(e.key) - 1]);
    }
    if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) {
      e.preventDefault();
      openAddModal();
    }
    if (e.key === 't' && !e.ctrlKey && !e.metaKey && !['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) {
      e.preventDefault();
      currentDate = db.formatDate(new Date());
      if (mainTab === 'today') refreshView();
    }
    if (e.key === 'Escape') closeModal();
  });
}

// ========== 主框架 ==========
function renderApp() {
  const stats = db.getStats();
  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' });

  document.getElementById('app').innerHTML = `
    <header class="app-header">
      <div class="header-title">
        <h1>文创工作台</h1>
        <span class="header-date">${dateStr}</span>
      </div>
      <div class="header-actions">
        <span class="header-stat">待办 ${stats.todayDone}/${stats.todayTotal}</span>
        <button class="btn-icon" onclick="exportData()" title="导出">${ICONS.export}</button>
        <button class="btn-icon" onclick="importData()" title="导入">${ICONS.import}</button>
      </div>
    </header>
    <div class="layout">
      ${renderSidebar()}
      <main class="main-content" id="mainContent">
        ${renderCurrentView()}
      </main>
    </div>
    <nav class="tab-bar">
      <button class="tab-item ${mainTab === 'today' ? 'active' : ''}" onclick="switchMainTab('today')">
        ${ICONS.today}<span>今日</span>
      </button>
      <button class="tab-item ${mainTab === 'library' ? 'active' : ''}" onclick="switchMainTab('library')">
        ${ICONS.library}<span>素材库</span>
      </button>
      <button class="tab-item ${mainTab === 'account' ? 'active' : ''}" onclick="switchMainTab('account')">
        ${ICONS.account}<span>账号</span>
      </button>
    </nav>
    <div id="modalContainer"></div>
    <div id="toastContainer"></div>
  `;
}

function renderSidebar() {
  return `
    <aside class="sidebar">
      <div class="nav-section">
        <button class="nav-item ${mainTab === 'today' ? 'active' : ''}" onclick="switchMainTab('today')">
          ${ICONS.today}<span>今日</span>
        </button>
        <button class="nav-item ${mainTab === 'library' ? 'active' : ''}" onclick="switchMainTab('library')">
          ${ICONS.library}<span>素材库</span>
        </button>
        <button class="nav-item ${mainTab === 'account' ? 'active' : ''}" onclick="switchMainTab('account')">
          ${ICONS.account}<span>账号</span>
        </button>
      </div>
    </aside>
  `;
}

function renderCurrentView() {
  switch (mainTab) {
    case 'today': return renderTodayView();
    case 'library': return renderLibraryView();
    case 'account': return renderAccountView();
    default: return renderTodayView();
  }
}

function switchMainTab(tab) {
  mainTab = tab;
  window.location.hash = tab;
  refreshView();
}

function refreshView() {
  const stats = db.getStats();
  const statEl = document.querySelector('.header-stat');
  if (statEl) statEl.textContent = `待办 ${stats.todayDone}/${stats.todayTotal}`;
  document.querySelectorAll('.tab-item').forEach((btn, i) => {
    const tabs = ['today', 'library', 'account'];
    btn.classList.toggle('active', tabs[i] === mainTab);
  });
  document.querySelectorAll('.sidebar .nav-item').forEach(btn => {
    const onclick = btn.getAttribute('onclick') || '';
    btn.classList.toggle('active', onclick.includes(`'${mainTab}'`));
  });
  document.getElementById('mainContent').innerHTML = renderCurrentView();
}

// ========================================
// 今日视图：待办 + 健身打卡 + 阅读打卡 + 笔记
// ========================================
function renderTodayView() {
  const todos = db.getTodos(currentDate);
  const note = db.getNote(currentDate);
  const sorted = [...todos].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const pOrder = { high: 0, medium: 1, low: 2 };
    return pOrder[a.priority] - pOrder[b.priority];
  });

  const fitnessToday = db.getFitness(currentDate);
  const readingToday = db.getReading(currentDate);
  const fitnessStreak = db.getStreak('fitness');
  const readingStreak = db.getStreak('reading');

  const isToday = currentDate === db.formatDate(new Date());

  return `
    <div class="view">
      <div class="date-nav">
        <button onclick="changeDate(-1)">‹</button>
        <div class="date-display">
          <input type="date" class="date-picker" value="${currentDate}" onchange="changeToDate(this.value)">
          ${isToday ? '<span class="today-badge">今天</span>' : ''}
        </div>
        <button onclick="changeDate(1)">›</button>
        ${!isToday ? '<button class="btn-text" onclick="goToday()">回到今天</button>' : ''}
      </div>

      <div class="view-header">
        <h2 class="view-title">待办</h2>
        <button class="btn btn-primary" onclick="openAddTodoModal()">${ICONS.plus}<span>添加</span></button>
      </div>

      ${todos.length > 0 ? `
        <div class="progress-bar"><div class="progress-fill" style="width:${todos.filter(t=>t.done).length/todos.length*100}%"></div></div>
        <div class="progress-text">${todos.filter(t=>t.done).length} / ${todos.length} 已完成</div>
      ` : ''}

      <div class="todo-list">
        ${sorted.length === 0 ? `
          <div class="empty-state">
            <p>今天还没有待办</p>
          </div>
        ` : sorted.map(renderTodoItem).join('')}
      </div>

      ${renderCheckinCard('fitness', '健身打卡', fitnessStreak, fitnessToday, isToday)}
      ${renderCheckinCard('reading', '阅读打卡', readingStreak, readingToday, isToday)}

      <div class="note-section">
        <div class="note-header">
          <h3>每日复盘</h3>
          <span style="font-size:var(--font-xs);color:var(--text-muted)">记录灵感、复盘、想法</span>
        </div>
        <textarea class="note-area" placeholder="今天的复盘、灵感、待改进的点…" onblur="saveNote()">${note}</textarea>
      </div>
    </div>
  `;
}

function renderTodoItem(todo) {
  const cat = CATEGORIES.todo.find(c => c.value === todo.category) || CATEGORIES.todo[5];
  const pri = PRIORITY.find(p => p.value === todo.priority) || PRIORITY[1];
  return `
    <div class="todo-item ${todo.done ? 'done' : ''}">
      <label class="checkbox-wrap">
        <input type="checkbox" ${todo.done ? 'checked' : ''} onchange="toggleTodo('${todo.id}')">
        <span class="checkbox-custom"></span>
      </label>
      <div class="todo-content">
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <div class="todo-meta">
          <span class="tag">${cat.label}</span>
          <span class="priority-dot" style="background:${pri.color}"></span>
        </div>
      </div>
      <div class="todo-actions">
        <button class="btn-icon" style="width:32px;height:32px" onclick="editTodo('${todo.id}')">${ICONS.edit}</button>
        <button class="btn-icon" style="width:32px;height:32px" onclick="deleteTodo('${todo.id}')">${ICONS.delete}</button>
      </div>
    </div>
  `;
}

function renderCheckinCard(type, title, streak, todayRecords, isToday) {
  const hasRecord = todayRecords.length > 0;
  return `
    <div class="checkin-card">
      <div class="checkin-header">
        <div class="checkin-title">
          ${title}
          ${streak > 0 ? `<span class="streak-badge">${ICONS.flame}${streak}天</span>` : ''}
        </div>
        <button class="btn btn-primary" onclick="openCheckinModal('${type}')">${ICONS.plus}<span>打卡</span></button>
      </div>
      <div class="checkin-status ${hasRecord ? 'done' : ''}">
        ${hasRecord ? `今日已打卡 ${todayRecords.length} 次` : (isToday ? '今天还未打卡' : '当天未打卡')}
      </div>
      <div class="checkin-records">
        ${todayRecords.map(r => renderCheckinRecord(type, r)).join('')}
      </div>
    </div>
  `;
}

function renderCheckinRecord(type, r) {
  if (type === 'fitness') {
    return `
      <div class="checkin-record">
        <span>${escapeHtml(r.type)} · ${r.duration}分钟</span>
        <button class="btn-icon" style="width:28px;height:28px" onclick="deleteCheckin('fitness','${r.id}')">${ICONS.delete}</button>
      </div>
      ${r.note ? `<div style="font-size:var(--font-xs);color:var(--text-muted);margin-bottom:4px">${escapeHtml(r.note)}</div>` : ''}
    `;
  } else {
    return `
      <div class="checkin-record">
        <span>${escapeHtml(r.bookTitle)} · ${r.duration}分钟 · ${r.pages}页</span>
        <button class="btn-icon" style="width:28px;height:28px" onclick="deleteCheckin('reading','${r.id}')">${ICONS.delete}</button>
      </div>
      ${r.excerpt ? `<div style="font-size:var(--font-xs);color:var(--text-muted);margin-bottom:4px">"${escapeHtml(r.excerpt)}"</div>` : ''}
    `;
  }
}

// ========================================
// 素材库视图：种草帖 / 科普帖 / 加盟帖
// ========================================
function renderLibraryView() {
  const tabs = [
    { id: 'inspiration', label: '爆款种草帖' },
    { id: 'knowledge', label: '文创科普帖' },
    { id: 'franchise', label: '文创加盟帖' }
  ];

  return `
    <div class="view">
      <div class="view-header">
        <h2 class="view-title">素材库</h2>
        <button class="btn btn-primary" onclick="openAddModal()">${ICONS.plus}<span>添加</span></button>
      </div>
      <div class="sub-tabs">
        ${tabs.map(t => `<button class="sub-tab ${librarySubTab === t.id ? 'active' : ''}" onclick="switchLibraryTab('${t.id}')">${t.label}</button>`).join('')}
      </div>
      ${renderLibraryContent()}
    </div>
  `;
}

function switchLibraryTab(tab) {
  librarySubTab = tab;
  refreshView();
}

function renderLibraryContent() {
  switch (librarySubTab) {
    case 'inspiration': return renderInspirationList();
    case 'knowledge': return renderKnowledgeList();
    case 'franchise': return renderFranchiseList();
    default: return renderInspirationList();
  }
}

function renderInspirationList() {
  const filter = window._inspFilter || {};
  const list = db.getInspirations(filter);
  const statusMap = {
    pending: { label: '待二创', color: '#d4a93a', bg: '#fef9e7' },
    doing: { label: '二创中', color: '#45b7d1', bg: '#e8f4f8' },
    done: { label: '已发布', color: '#5b8c5a', bg: '#eaf3ea' }
  };
  return `
    <div class="filter-bar">
      <input type="text" class="search-input" placeholder="搜索标题、摘要、标签…" value="${filter.keyword || ''}" oninput="filterInspration(this.value)">
      <select class="filter-select" onchange="filterInspirationCat(this.value)">
        <option value="">全部分类</option>
        ${CATEGORIES.inspiration.map(c => `<option value="${c}" ${filter.category===c?'selected':''}>${c}</option>`).join('')}
      </select>
      <select class="filter-select" onchange="filterInspirationStatus(this.value)">
        <option value="">全部状态</option>
        <option value="pending" ${filter.status==='pending'?'selected':''}>待二创</option>
        <option value="doing" ${filter.status==='doing'?'selected':''}>二创中</option>
        <option value="done" ${filter.status==='done'?'selected':''}>已发布</option>
      </select>
    </div>
    <div class="card-grid">
      ${list.length === 0 ? emptyState('暂无种草帖素材') : list.map(item => {
        const s = statusMap[item.status] || statusMap.pending;
        return `
          <div class="card">
            <div class="card-header">
              <span class="card-category">${item.category}</span>
              <span class="card-status" style="color:${s.color};background:${s.bg}">${s.label}</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.title)}</h3>
            <p class="card-summary">${escapeHtml(item.summary)}</p>
            ${item.tags && item.tags.length ? `<div class="card-tags">${item.tags.map(t=>`<span class="card-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
            <div class="card-footer">
              <span class="card-date">${formatRelativeDate(item.savedAt)}</span>
              <div class="card-actions">
                <select class="status-select" onchange="updateInspirationStatus('${item.id}',this.value)">
                  <option value="pending" ${item.status==='pending'?'selected':''}>待二创</option>
                  <option value="doing" ${item.status==='doing'?'selected':''}>二创中</option>
                  <option value="done" ${item.status==='done'?'selected':''}>已发布</option>
                </select>
                ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" class="btn-icon" style="width:28px;height:28px">${ICONS.link}</a>` : ''}
                <button class="btn-icon" style="width:28px;height:28px" onclick="editInspiration('${item.id}')">${ICONS.edit}</button>
                <button class="btn-icon" style="width:28px;height:28px" onclick="deleteInspiration('${item.id}')">${ICONS.delete}</button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderKnowledgeList() {
  const filter = window._knowFilter || {};
  const list = db.getKnowledge(filter);
  return `
    <div class="filter-bar">
      <input type="text" class="search-input" placeholder="搜索知识…" value="${filter.keyword || ''}" oninput="filterKnowledge(this.value)">
      <select class="filter-select" onchange="filterKnowledgeCat(this.value)">
        <option value="">全部分类</option>
        ${CATEGORIES.knowledge.map(c => `<option value="${c}" ${filter.category===c?'selected':''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="list-view">
      ${list.length === 0 ? emptyState('暂无科普帖') : list.map(item => `
        <div class="list-item ${item.read ? 'read' : ''}">
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
            ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" class="btn-icon" style="width:32px;height:32px">${ICONS.link}</a>` : ''}
            <button class="btn-icon" style="width:32px;height:32px" onclick="editKnowledge('${item.id}')">${ICONS.edit}</button>
            <button class="btn-icon" style="width:32px;height:32px" onclick="deleteKnowledge('${item.id}')">${ICONS.delete}</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderFranchiseList() {
  const filter = window._frFilter || {};
  const list = db.getFranchises(filter);
  const statusMap = {
    pending: { label: '待了解', color: '#d4a93a', bg: '#fef9e7' },
    contacting: { label: '联系中', color: '#45b7d1', bg: '#e8f4f8' },
    evaluating: { label: '评估中', color: '#a55eea', bg: '#f3e8f8' },
    passed: { label: '已放弃', color: '#999', bg: '#f5f5f5' }
  };
  return `
    <div class="filter-bar">
      <input type="text" class="search-input" placeholder="搜索品牌、摘要…" value="${filter.keyword || ''}" oninput="filterFranchise(this.value)">
      <select class="filter-select" onchange="filterFranchiseCat(this.value)">
        <option value="">全部分类</option>
        ${CATEGORIES.franchise.map(c => `<option value="${c}" ${filter.category===c?'selected':''}>${c}</option>`).join('')}
      </select>
    </div>
    <div class="card-grid">
      ${list.length === 0 ? emptyState('暂无加盟帖') : list.map(item => {
        const s = statusMap[item.status] || statusMap.pending;
        return `
          <div class="card">
            <div class="card-header">
              <span class="card-category">${item.category}</span>
              <span class="card-status" style="color:${s.color};background:${s.bg}">${s.label}</span>
            </div>
            <h3 class="card-title">${escapeHtml(item.brand)}</h3>
            ${item.investAmount ? `<div style="font-size:var(--font-sm);color:var(--text-secondary);margin-bottom:4px">投资：${escapeHtml(item.investAmount)} · ${escapeHtml(item.model)}</div>` : ''}
            <p class="card-summary">${escapeHtml(item.summary)}</p>
            ${item.contact ? `<div style="font-size:var(--font-xs);color:var(--text-muted);margin-bottom:4px">联系：${escapeHtml(item.contact)}</div>` : ''}
            <div class="card-footer">
              <span class="card-date">${formatRelativeDate(item.savedAt)}</span>
              <div class="card-actions">
                <select class="status-select" onchange="updateFranchiseStatus('${item.id}',this.value)">
                  <option value="pending" ${item.status==='pending'?'selected':''}>待了解</option>
                  <option value="contacting" ${item.status==='contacting'?'selected':''}>联系中</option>
                  <option value="evaluating" ${item.status==='evaluating'?'selected':''}>评估中</option>
                  <option value="passed" ${item.status==='passed'?'selected':''}>已放弃</option>
                </select>
                ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" class="btn-icon" style="width:28px;height:28px">${ICONS.link}</a>` : ''}
                <button class="btn-icon" style="width:28px;height:28px" onclick="editFranchise('${item.id}')">${ICONS.edit}</button>
                <button class="btn-icon" style="width:28px;height:28px" onclick="deleteFranchise('${item.id}')">${ICONS.delete}</button>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function emptyState(text) {
  return `<div class="empty-state"><p>${text}</p></div>`;
}

// ========================================
// 账号视图：抖音数据追踪
// ========================================
function renderAccountView() {
  const latest = db.getLatestAccount();
  const history = db.getAccountHistory(30);
  const streak = db.getAccountStreak();

  return `
    <div class="view">
      <div class="view-header">
        <h2 class="view-title">账号追踪</h2>
        <button class="btn btn-primary" onclick="openAccountModal()">${ICONS.plus}<span>更新数据</span></button>
      </div>

      ${latest ? `
        <div class="account-overview">
          <div class="account-platform">抖音 ${streak > 0 ? `<span class="streak-badge" style="margin-left:8px">${ICONS.flame}${streak}天</span>` : ''}</div>
          <div class="account-followers">${latest.followers.toLocaleString()}</div>
          <div class="account-followers-label">粉丝</div>
          <div class="account-stats">
            <div class="account-stat-item">
              <div class="account-stat-num">${latest.following.toLocaleString()}</div>
              <div class="account-stat-label">关注</div>
            </div>
            <div class="account-stat-item">
              <div class="account-stat-num">${latest.posts.toLocaleString()}</div>
              <div class="account-stat-label">作品</div>
            </div>
            <div class="account-stat-item">
              <div class="account-stat-num">${latest.likes.toLocaleString()}</div>
              <div class="account-stat-label">获赞</div>
            </div>
          </div>
        </div>
      ` : `
        <div class="empty-state">
          <p>还没有账号数据</p>
          <p style="font-size:var(--font-xs);color:var(--text-muted)">点击"更新数据"记录第一次数据</p>
        </div>
      `}

      ${history.length > 1 ? `
        <div class="account-history">
          ${history.map((item, i) => {
            const prev = history[i + 1];
            const diff = prev ? item.followers - prev.followers : 0;
            return `
              <div class="account-history-item">
                <span class="account-history-date">${item.date}${item.note ? ' · ' + escapeHtml(item.note) : ''}</span>
                <div class="account-history-data">
                  <span>${item.followers.toLocaleString()} 粉丝</span>
                  ${diff !== 0 ? `<span class="account-trend ${diff > 0 ? 'up' : 'down'}">${diff > 0 ? '↑' : '↓'}${Math.abs(diff)}</span>` : ''}
                  <button class="btn-icon" style="width:24px;height:24px" onclick="deleteAccountLog('${item.id}')">${ICONS.delete}</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

// ========================================
// 模态框
// ========================================
function openAddModal() {
  if (mainTab === 'today') openAddTodoModal();
  else if (mainTab === 'library') {
    if (librarySubTab === 'inspiration') openAddInspirationModal();
    else if (librarySubTab === 'knowledge') openAddKnowledgeModal();
    else openAddFranchiseModal();
  }
  else if (mainTab === 'account') openAccountModal();
}

function openAddTodoModal() {
  editingId = null;
  showModal(`
    <div class="modal-title">添加待办 <button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="form-group">
      <label>待办内容</label>
      <textarea id="todoText" placeholder="要做的事…" autofocus></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>分类</label>
        <select id="todoCategory">${CATEGORIES.todo.map(c=>`<option value="${c.value}">${c.label}</option>`).join('')}</select>
      </div>
      <div class="form-group">
        <label>优先级</label>
        <select id="todoPriority">${PRIORITY.map(p=>`<option value="${p.value}" ${p.value==='medium'?'selected':''}>${p.label}</option>`).join('')}</select>
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="submitTodo()">保存</button>
    </div>
  `);
}

function openAddInspirationModal() {
  editingId = null;
  showModal(`
    <div class="modal-title">添加种草帖 <button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="form-group"><label>标题</label><input type="text" id="inspTitle" placeholder="种草文标题"></div>
    <div class="form-row">
      <div class="form-group"><label>分类</label><select id="inspCategory">${CATEGORIES.inspiration.map(c=>`<option value="${c}">${c}</option>`).join('')}</select></div>
      <div class="form-group"><label>来源</label><input type="text" id="inspSource" value="小红书"></div>
    </div>
    <div class="form-group"><label>标签（逗号分隔）</label><input type="text" id="inspTags" placeholder="如：故宫,冰箱贴"></div>
    <div class="form-group"><label>摘要 / 二创思路</label><textarea id="inspSummary" rows="4" placeholder="核心卖点、为什么适合二创、借鉴的点…"></textarea></div>
    <div class="form-group"><label>原文链接</label><input type="text" id="inspLink" placeholder="https://..."></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="submitInspiration()">保存</button></div>
  `);
}

function openAddKnowledgeModal() {
  editingId = null;
  showModal(`
    <div class="modal-title">添加科普帖 <button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="form-group"><label>标题</label><input type="text" id="knowTitle" placeholder="知识标题"></div>
    <div class="form-group"><label>分类</label><select id="knowCategory">${CATEGORIES.knowledge.map(c=>`<option value="${c}">${c}</option>`).join('')}</select></div>
    <div class="form-group"><label>摘要 / 核心要点</label><textarea id="knowSummary" rows="5" placeholder="核心要点、你的笔记…"></textarea></div>
    <div class="form-group"><label>原文链接</label><input type="text" id="knowLink" placeholder="https://..."></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="submitKnowledge()">保存</button></div>
  `);
}

function openAddFranchiseModal() {
  editingId = null;
  showModal(`
    <div class="modal-title">添加加盟帖 <button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="form-group"><label>品牌名称</label><input type="text" id="frBrand" placeholder="品牌名"></div>
    <div class="form-row">
      <div class="form-group"><label>投资金额</label><input type="text" id="frInvest" placeholder="如：10-30万"></div>
      <div class="form-group"><label>合作模式</label><select id="frModel"><option value="直营">直营</option><option value="加盟">加盟</option><option value="代理">代理</option><option value="授权">授权</option></select></div>
    </div>
    <div class="form-group"><label>分类</label><select id="frCategory">${CATEGORIES.franchise.map(c=>`<option value="${c}">${c}</option>`).join('')}</select></div>
    <div class="form-group"><label>联系方式</label><input type="text" id="frContact" placeholder="如：小红书私信 / 微信"></div>
    <div class="form-group"><label>摘要 / 分析</label><textarea id="frSummary" rows="4" placeholder="品牌亮点、加盟条件、你的分析…"></textarea></div>
    <div class="form-group"><label>原文链接</label><input type="text" id="frLink" placeholder="https://..."></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="submitFranchise()">保存</button></div>
  `);
}

function openCheckinModal(type) {
  const title = type === 'fitness' ? '健身打卡' : '阅读打卡';
  const today = currentDate;
  let formHtml;
  if (type === 'fitness') {
    formHtml = `
      <div class="form-row">
        <div class="form-group"><label>运动类型</label><select id="ckType">${CATEGORIES.fitness.map(c=>`<option value="${c}">${c}</option>`).join('')}</select></div>
        <div class="form-group"><label>时长（分钟）</label><input type="number" id="ckDuration" placeholder="30" min="1"></div>
      </div>
      <div class="form-group"><label>强度（1-5）</label><input type="range" id="ckIntensity" min="1" max="5" value="3" oninput="document.getElementById('intensityVal').textContent=this.value+'星'"><span id="intensityVal" style="margin-left:8px;font-size:var(--font-sm)">3星</span></div>
      <div class="form-group"><label>备注</label><textarea id="ckNote" rows="2" placeholder="今天的状态、感受…"></textarea></div>
    `;
  } else {
    formHtml = `
      <div class="form-group"><label>书名</label><input type="text" id="ckBookTitle" placeholder="在读的书"></div>
      <div class="form-group"><label>作者</label><input type="text" id="ckAuthor" placeholder="作者（选填）"></div>
      <div class="form-row">
        <div class="form-group"><label>时长（分钟）</label><input type="number" id="ckDuration" placeholder="30" min="1"></div>
        <div class="form-group"><label>页数</label><input type="number" id="ckPages" placeholder="20" min="1"></div>
      </div>
      <div class="form-group"><label>摘录 / 笔记</label><textarea id="ckExcerpt" rows="3" placeholder="喜欢的句子、读书笔记…"></textarea></div>
    `;
  }
  showModal(`
    <div class="modal-title">${title} <button class="modal-close" onclick="closeModal()">×</button></div>
    <input type="hidden" id="ckType_hidden" value="${type}">
    <input type="hidden" id="ckDate" value="${today}">
    ${formHtml}
    <div class="modal-actions"><button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="submitCheckin()">完成打卡</button></div>
  `);
}

function openAccountModal() {
  const latest = db.getLatestAccount();
  showModal(`
    <div class="modal-title">更新抖音数据 <button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="form-group"><label>日期</label><input type="date" id="accDate" value="${db.formatDate(new Date())}"></div>
    <div class="form-row">
      <div class="form-group"><label>粉丝数</label><input type="number" id="accFollowers" value="${latest ? latest.followers : ''}" placeholder="0"></div>
      <div class="form-group"><label>关注数</label><input type="number" id="accFollowing" value="${latest ? latest.following : ''}" placeholder="0"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>作品数</label><input type="number" id="accPosts" value="${latest ? latest.posts : ''}" placeholder="0"></div>
      <div class="form-group"><label>获赞数</label><input type="number" id="accLikes" value="${latest ? latest.likes : ''}" placeholder="0"></div>
    </div>
    <div class="form-group"><label>备注</label><input type="text" id="accNote" placeholder="如：发布了一条新视频"></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="submitAccount()">保存</button></div>
  `);
}

function showModal(html) {
  document.getElementById('modalContainer').innerHTML = `<div class="modal-overlay" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()">${html}</div></div>`;
}

// ========================================
// 表单提交
// ========================================
function submitTodo() {
  const text = val('todoText');
  if (!text) return showToast('请输入待办内容');
  const data = { text, category: val('todoCategory'), priority: val('todoPriority') };
  if (editingId) { db.updateTodo(currentDate, editingId, data); showToast('已更新'); }
  else { db.addTodo(currentDate, data); showToast('已添加'); }
  closeModal(); refreshView();
}

function submitInspiration() {
  const title = val('inspTitle');
  if (!title) return showToast('请输入标题');
  const data = {
    title, category: val('inspCategory'), source: val('inspSource') || '小红书',
    tags: val('inspTags').split(/[,，]/).map(t=>t.trim()).filter(Boolean),
    summary: val('inspSummary'), link: val('inspLink')
  };
  if (editingId) { db.updateInspiration(editingId, data); showToast('已更新'); }
  else { db.addInspiration(data); showToast('已添加'); }
  closeModal(); refreshView();
}

function submitKnowledge() {
  const title = val('knowTitle');
  if (!title) return showToast('请输入标题');
  const data = { title, category: val('knowCategory'), summary: val('knowSummary'), link: val('knowLink') };
  if (editingId) { db.updateKnowledge(editingId, data); showToast('已更新'); }
  else { db.addKnowledge(data); showToast('已添加'); }
  closeModal(); refreshView();
}

function submitFranchise() {
  const brand = val('frBrand');
  if (!brand) return showToast('请输入品牌名称');
  const data = {
    brand, investAmount: val('frInvest'), model: val('frModel'),
    category: val('frCategory'), contact: val('frContact'),
    summary: val('frSummary'), link: val('frLink')
  };
  if (editingId) { db.updateFranchise(editingId, data); showToast('已更新'); }
  else { db.addFranchise(data); showToast('已添加'); }
  closeModal(); refreshView();
}

function submitCheckin() {
  const type = val('ckType_hidden');
  const date = val('ckDate');
  const duration = parseInt(val('ckDuration')) || 0;
  if (!duration) return showToast('请输入时长');
  if (type === 'fitness') {
    db.addFitness({ date, type: val('ckType'), duration, intensity: parseInt(val('ckIntensity')) || 3, note: val('ckNote') });
  } else {
    const bookTitle = val('ckBookTitle');
    if (!bookTitle) return showToast('请输入书名');
    db.addReading({ date, bookTitle, author: val('ckAuthor'), duration, pages: parseInt(val('ckPages')) || 0, excerpt: val('ckExcerpt') });
  }
  showToast('打卡成功！');
  closeModal(); refreshView();
}

function submitAccount() {
  const data = {
    date: val('accDate'),
    followers: parseInt(val('accFollowers')) || 0,
    following: parseInt(val('accFollowing')) || 0,
    posts: parseInt(val('accPosts')) || 0,
    likes: parseInt(val('accLikes')) || 0,
    note: val('accNote')
  };
  db.addAccountLog(data);
  showToast('数据已更新');
  closeModal(); refreshView();
}

// ========================================
// 编辑/删除/操作
// ========================================
function toggleTodo(id) {
  const todo = db.getTodos(currentDate).find(t => t.id === id);
  if (todo) { db.updateTodo(currentDate, id, { done: !todo.done }); refreshView(); }
}

function editTodo(id) {
  const todo = db.getTodos(currentDate).find(t => t.id === id);
  if (!todo) return;
  editingId = id;
  showModal(`
    <div class="modal-title">编辑待办 <button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="form-group"><label>待办内容</label><textarea id="todoText">${escapeHtml(todo.text)}</textarea></div>
    <div class="form-row">
      <div class="form-group"><label>分类</label><select id="todoCategory">${CATEGORIES.todo.map(c=>`<option value="${c.value}" ${todo.category===c.value?'selected':''}>${c.label}</option>`).join('')}</select></div>
      <div class="form-group"><label>优先级</label><select id="todoPriority">${PRIORITY.map(p=>`<option value="${p.value}" ${todo.priority===p.value?'selected':''}>${p.label}</option>`).join('')}</select></div>
    </div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="submitTodo()">保存</button></div>
  `);
}

function deleteTodo(id) {
  if (!confirm('删除这条待办？')) return;
  db.deleteTodo(currentDate, id); refreshView(); showToast('已删除');
}

function editInspiration(id) {
  const item = db.getInspirations().find(i => i.id === id);
  if (!item) return;
  editingId = id;
  showModal(`
    <div class="modal-title">编辑种草帖 <button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="form-group"><label>标题</label><input type="text" id="inspTitle" value="${escapeHtml(item.title)}"></div>
    <div class="form-row">
      <div class="form-group"><label>分类</label><select id="inspCategory">${CATEGORIES.inspiration.map(c=>`<option value="${c}" ${item.category===c?'selected':''}>${c}</option>`).join('')}</select></div>
      <div class="form-group"><label>来源</label><input type="text" id="inspSource" value="${escapeHtml(item.source||'小红书')}"></div>
    </div>
    <div class="form-group"><label>标签（逗号分隔）</label><input type="text" id="inspTags" value="${(item.tags||[]).join(', ')}"></div>
    <div class="form-group"><label>摘要 / 二创思路</label><textarea id="inspSummary" rows="4">${escapeHtml(item.summary)}</textarea></div>
    <div class="form-group"><label>原文链接</label><input type="text" id="inspLink" value="${escapeHtml(item.link||'')}"></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="submitInspiration()">保存</button></div>
  `);
}

function deleteInspiration(id) {
  if (!confirm('删除这条素材？')) return;
  db.deleteInspiration(id); refreshView(); showToast('已删除');
}

function updateInspirationStatus(id, status) {
  db.updateInspiration(id, { status }); refreshView();
}

function editKnowledge(id) {
  const item = db.getKnowledge().find(i => i.id === id);
  if (!item) return;
  editingId = id;
  showModal(`
    <div class="modal-title">编辑科普帖 <button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="form-group"><label>标题</label><input type="text" id="knowTitle" value="${escapeHtml(item.title)}"></div>
    <div class="form-group"><label>分类</label><select id="knowCategory">${CATEGORIES.knowledge.map(c=>`<option value="${c}" ${item.category===c?'selected':''}>${c}</option>`).join('')}</select></div>
    <div class="form-group"><label>摘要 / 核心要点</label><textarea id="knowSummary" rows="5">${escapeHtml(item.summary)}</textarea></div>
    <div class="form-group"><label>原文链接</label><input type="text" id="knowLink" value="${escapeHtml(item.link||'')}"></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="submitKnowledge()">保存</button></div>
  `);
}

function deleteKnowledge(id) {
  if (!confirm('删除？')) return;
  db.deleteKnowledge(id); refreshView(); showToast('已删除');
}

function toggleReadKnowledge(id) {
  const item = db.getKnowledge().find(i => i.id === id);
  if (item) { db.updateKnowledge(id, { read: !item.read }); refreshView(); }
}

function editFranchise(id) {
  const item = db.getFranchises().find(i => i.id === id);
  if (!item) return;
  editingId = id;
  showModal(`
    <div class="modal-title">编辑加盟帖 <button class="modal-close" onclick="closeModal()">×</button></div>
    <div class="form-group"><label>品牌名称</label><input type="text" id="frBrand" value="${escapeHtml(item.brand)}"></div>
    <div class="form-row">
      <div class="form-group"><label>投资金额</label><input type="text" id="frInvest" value="${escapeHtml(item.investAmount||'')}"></div>
      <div class="form-group"><label>合作模式</label><select id="frModel"><option value="直营" ${item.model==='直营'?'selected':''}>直营</option><option value="加盟" ${item.model==='加盟'?'selected':''}>加盟</option><option value="代理" ${item.model==='代理'?'selected':''}>代理</option><option value="授权" ${item.model==='授权'?'selected':''}>授权</option></select></div>
    </div>
    <div class="form-group"><label>分类</label><select id="frCategory">${CATEGORIES.franchise.map(c=>`<option value="${c}" ${item.category===c?'selected':''}>${c}</option>`).join('')}</select></div>
    <div class="form-group"><label>联系方式</label><input type="text" id="frContact" value="${escapeHtml(item.contact||'')}"></div>
    <div class="form-group"><label>摘要 / 分析</label><textarea id="frSummary" rows="4">${escapeHtml(item.summary)}</textarea></div>
    <div class="form-group"><label>原文链接</label><input type="text" id="frLink" value="${escapeHtml(item.link||'')}"></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="submitFranchise()">保存</button></div>
  `);
}

function deleteFranchise(id) {
  if (!confirm('删除？')) return;
  db.deleteFranchise(id); refreshView(); showToast('已删除');
}

function updateFranchiseStatus(id, status) {
  db.updateFranchise(id, { status }); refreshView();
}

function deleteCheckin(type, id) {
  if (!confirm('删除这条打卡记录？')) return;
  if (type === 'fitness') db.deleteFitness(id);
  else db.deleteReading(id);
  refreshView(); showToast('已删除');
}

function deleteAccountLog(id) {
  if (!confirm('删除这条记录？')) return;
  db.deleteAccountLog(id); refreshView(); showToast('已删除');
}

// ========================================
// 筛选
// ========================================
function filterInspration(v) { window._inspFilter = window._inspFilter || {}; window._inspFilter.keyword = v; debounce(refreshView); }
function filterInspirationCat(v) { window._inspFilter = window._inspFilter || {}; window._inspFilter.category = v; refreshView(); }
function filterInspirationStatus(v) { window._inspFilter = window._inspFilter || {}; window._inspFilter.status = v; refreshView(); }
function filterKnowledge(v) { window._knowFilter = window._knowFilter || {}; window._knowFilter.keyword = v; debounce(refreshView); }
function filterKnowledgeCat(v) { window._knowFilter = window._knowFilter || {}; window._knowFilter.category = v; refreshView(); }
function filterFranchise(v) { window._frFilter = window._frFilter || {}; window._frFilter.keyword = v; debounce(refreshView); }
function filterFranchiseCat(v) { window._frFilter = window._frFilter || {}; window._frFilter.category = v; refreshView(); }

// ========================================
// 日期导航
// ========================================
function changeDate(delta) {
  const d = new Date(currentDate);
  d.setDate(d.getDate() + delta);
  currentDate = db.formatDate(d);
  refreshView();
}
function changeToDate(date) { currentDate = date; refreshView(); }
function goToday() { currentDate = db.formatDate(new Date()); refreshView(); }

// ========================================
// 笔记
// ========================================
function saveNote() {
  const el = document.getElementById('noteArea');
  if (el) db.setNote(currentDate, el.value);
}

// ========================================
// 导入导出
// ========================================
function exportData() {
  const blob = new Blob([db.export()], { type: 'application/json' });
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
      if (db.import(ev.target.result)) { showToast('导入成功'); renderApp(); }
      else showToast('导入失败');
    };
    reader.readAsText(file);
  };
  input.click();
}

// ========================================
// 工具
// ========================================
function closeModal(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('modalContainer').innerHTML = '';
  editingId = null;
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2000);
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function formatRelativeDate(dateStr) {
  const d = new Date(dateStr);
  const diff = (new Date() - d) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff/60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff/3600)}小时前`;
  if (diff < 604800) return `${Math.floor(diff/86400)}天前`;
  return d.toLocaleDateString('zh-CN');
}

let _t;
function debounce(fn, delay = 300) {
  clearTimeout(_t);
  _t = setTimeout(fn, delay);
}

document.addEventListener('DOMContentLoaded', initApp);
