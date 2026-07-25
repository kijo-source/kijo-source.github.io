/**
 * 文创工作台 v2 - 数据管理模块
 * localStorage 持久化，按日期组织
 */

const DB_KEY_V2 = 'wenchuang_workbench_v2';
const DB_KEY_V1 = 'wenchuang_workbench_v1';

const DEFAULT_DATA = {
  meta: {
    version: '2.0',
    createdAt: new Date().toISOString(),
    lastUpdate: new Date().toISOString()
  },
  todos: {},        // { '2025-07-25': [{id, text, done, priority, category, createdAt}] }
  inspirations: [], // 种草帖 [{id, title, source, category, tags, summary, link, savedAt, status}]
  knowledge: [],    // 科普帖 [{id, title, category, summary, link, savedAt, read}]
  franchises: [],   // 加盟帖 [{id, brand, investAmount, model, contact, source, tags, summary, link, savedAt, status}]
  fitness: [],      // 健身打卡 [{id, date, type, duration, intensity, note, createdAt}]
  reading: [],      // 阅读打卡 [{id, date, bookTitle, author, duration, pages, excerpt, createdAt}]
  accountLogs: [],  // 抖音账号 [{id, date, followers, following, posts, likes, note, createdAt}]
  notes: {}         // 每日笔记 { '2025-07-25': '内容' }
};

const CATEGORIES = {
  todo: [
    { value: 'content', label: '内容创作', color: '#d4654a' },
    { value: 'research', label: '选题调研', color: '#4ecdc4' },
    { value: 'operation', label: '运营推广', color: '#45b7d1' },
    { value: 'design', label: '设计制作', color: '#f9ca24' },
    { value: 'biz', label: '商务对接', color: '#a55eea' },
    { value: 'other', label: '其他', color: '#95a5a6' }
  ],
  inspiration: [
    '手账文具', '国潮文创', 'IP联名', '非遗手作', '博物馆文创',
    '潮玩盲盒', '文创周边', '新中式美学', '复古设计', '其他'
  ],
  knowledge: [
    '版权IP', '供应链', '私域运营', '线上线下一体化', 'IP孵化',
    '品牌策略', '财务税务', '政策扶持', '行业报告', '跨界融合', '其他'
  ],
  franchise: [
    '文创加盟', 'IP授权', '代理合作', '直营门店', '快闪店', '其他'
  ],
  fitness: ['跑步', '力量训练', '瑜伽', '游泳', '骑行', '球类', '其他'],
  reading: ['文创设计', '创业商业', '市场营销', '文学小说', '个人成长', '其他']
};

const PRIORITY = [
  { value: 'high', label: '高', color: '#c64b4b' },
  { value: 'medium', label: '中', color: '#d4a93a' },
  { value: 'low', label: '低', color: '#5b8c5a' }
];

const FRANCHISE_STATUS = [
  { value: 'pending', label: '待了解', color: '#d4a93a' },
  { value: 'contacting', label: '联系中', color: '#45b7d1' },
  { value: 'evaluating', label: '评估中', color: '#a55eea' },
  { value: 'passed', label: '已放弃', color: '#999' }
];

class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      // 先尝试 v2
      const rawV2 = localStorage.getItem(DB_KEY_V2);
      if (rawV2) {
        const data = JSON.parse(rawV2);
        return { ...JSON.parse(JSON.stringify(DEFAULT_DATA)), ...data };
      }
      // 检测 v1 数据并迁移
      const rawV1 = localStorage.getItem(DB_KEY_V1);
      if (rawV1) {
        const v1 = JSON.parse(rawV1);
        const migrated = JSON.parse(JSON.stringify(DEFAULT_DATA));
        migrated.todos = v1.todos || {};
        migrated.inspirations = v1.inspirations || [];
        migrated.knowledge = v1.knowledge || [];
        // crossover 并入 knowledge
        if (v1.crossover && v1.crossover.length) {
          v1.crossover.forEach(c => {
            migrated.knowledge.push({
              id: c.id || this.genId(),
              title: c.title || '未命名',
              category: '跨界融合',
              summary: c.summary || '',
              link: c.link || '',
              savedAt: c.savedAt || new Date().toISOString(),
              read: c.read || false
            });
          });
        }
        migrated.notes = v1.notes || {};
        migrated.meta.migratedFrom = 'v1';
        migrated.meta.migratedAt = new Date().toISOString();
        localStorage.setItem(DB_KEY_V2, JSON.stringify(migrated));
        return migrated;
      }
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    } catch (e) {
      console.error('数据加载失败', e);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }

  save() {
    this.data.meta.lastUpdate = new Date().toISOString();
    localStorage.setItem(DB_KEY_V2, JSON.stringify(this.data));
  }

  export() {
    return JSON.stringify(this.data, null, 2);
  }

  import(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      this.data = { ...JSON.parse(JSON.stringify(DEFAULT_DATA)), ...data };
      this.save();
      return true;
    } catch (e) {
      return false;
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.save();
  }

  genId() {
    return Date.now().toString() + Math.random().toString(36).slice(2, 6);
  }

  formatDate(d) {
    const dt = d instanceof Date ? d : new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // ========== 待办 ==========
  getTodos(date) {
    return this.data.todos[date] || [];
  }

  addTodo(date, todo) {
    if (!this.data.todos[date]) this.data.todos[date] = [];
    const item = {
      id: this.genId(),
      text: todo.text,
      done: false,
      priority: todo.priority || 'medium',
      category: todo.category || 'other',
      createdAt: new Date().toISOString()
    };
    this.data.todos[date].push(item);
    this.save();
    return item;
  }

  updateTodo(date, id, updates) {
    const todos = this.data.todos[date] || [];
    const idx = todos.findIndex(t => t.id === id);
    if (idx >= 0) {
      todos[idx] = { ...todos[idx], ...updates };
      this.save();
      return todos[idx];
    }
    return null;
  }

  deleteTodo(date, id) {
    if (!this.data.todos[date]) return;
    this.data.todos[date] = this.data.todos[date].filter(t => t.id !== id);
    if (this.data.todos[date].length === 0) delete this.data.todos[date];
    this.save();
  }

  // ========== 种草帖 ==========
  getInspirations(filter = {}) {
    let list = [...this.data.inspirations];
    if (filter.category) list = list.filter(i => i.category === filter.category);
    if (filter.status) list = list.filter(i => i.status === filter.status);
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      list = list.filter(i =>
        (i.title || '').toLowerCase().includes(kw) ||
        (i.summary || '').toLowerCase().includes(kw) ||
        (i.tags || []).some(t => t.toLowerCase().includes(kw))
      );
    }
    return list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  }

  addInspiration(item) {
    const entry = {
      id: this.genId(),
      title: item.title || '未命名',
      source: item.source || '小红书',
      category: item.category || '其他',
      tags: item.tags || [],
      summary: item.summary || '',
      link: item.link || '',
      savedAt: new Date().toISOString(),
      status: item.status || 'pending'
    };
    this.data.inspirations.push(entry);
    this.save();
    return entry;
  }

  updateInspiration(id, updates) {
    const idx = this.data.inspirations.findIndex(i => i.id === id);
    if (idx >= 0) {
      this.data.inspirations[idx] = { ...this.data.inspirations[idx], ...updates };
      this.save();
      return this.data.inspirations[idx];
    }
    return null;
  }

  deleteInspiration(id) {
    this.data.inspirations = this.data.inspirations.filter(i => i.id !== id);
    this.save();
  }

  // ========== 科普帖 ==========
  getKnowledge(filter = {}) {
    let list = [...this.data.knowledge];
    if (filter.category) list = list.filter(i => i.category === filter.category);
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      list = list.filter(i =>
        (i.title || '').toLowerCase().includes(kw) ||
        (i.summary || '').toLowerCase().includes(kw)
      );
    }
    return list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  }

  addKnowledge(item) {
    const entry = {
      id: this.genId(),
      title: item.title || '未命名',
      category: item.category || '其他',
      summary: item.summary || '',
      link: item.link || '',
      savedAt: new Date().toISOString(),
      read: false
    };
    this.data.knowledge.push(entry);
    this.save();
    return entry;
  }

  updateKnowledge(id, updates) {
    const idx = this.data.knowledge.findIndex(i => i.id === id);
    if (idx >= 0) {
      this.data.knowledge[idx] = { ...this.data.knowledge[idx], ...updates };
      this.save();
      return this.data.knowledge[idx];
    }
    return null;
  }

  deleteKnowledge(id) {
    this.data.knowledge = this.data.knowledge.filter(i => i.id !== id);
    this.save();
  }

  // ========== 加盟帖 ==========
  getFranchises(filter = {}) {
    let list = [...this.data.franchises];
    if (filter.category) list = list.filter(i => i.category === filter.category);
    if (filter.status) list = list.filter(i => i.status === filter.status);
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      list = list.filter(i =>
        (i.brand || '').toLowerCase().includes(kw) ||
        (i.summary || '').toLowerCase().includes(kw) ||
        (i.tags || []).some(t => t.toLowerCase().includes(kw))
      );
    }
    return list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  }

  addFranchise(item) {
    const entry = {
      id: this.genId(),
      brand: item.brand || '未命名',
      investAmount: item.investAmount || '',
      model: item.model || '',
      contact: item.contact || '',
      source: item.source || '小红书',
      category: item.category || '文创加盟',
      tags: item.tags || [],
      summary: item.summary || '',
      link: item.link || '',
      savedAt: new Date().toISOString(),
      status: item.status || 'pending'
    };
    this.data.franchises.push(entry);
    this.save();
    return entry;
  }

  updateFranchise(id, updates) {
    const idx = this.data.franchises.findIndex(i => i.id === id);
    if (idx >= 0) {
      this.data.franchises[idx] = { ...this.data.franchises[idx], ...updates };
      this.save();
      return this.data.franchises[idx];
    }
    return null;
  }

  deleteFranchise(id) {
    this.data.franchises = this.data.franchises.filter(i => i.id !== id);
    this.save();
  }

  // ========== 健身打卡 ==========
  getFitness(date) {
    return this.data.fitness.filter(f => f.date === date);
  }

  getAllFitness() {
    return [...this.data.fitness].sort((a, b) => b.date.localeCompare(a.date));
  }

  addFitness(item) {
    const entry = {
      id: this.genId(),
      date: item.date,
      type: item.type || '其他',
      duration: item.duration || 0,
      intensity: item.intensity || 3,
      note: item.note || '',
      createdAt: new Date().toISOString()
    };
    this.data.fitness.push(entry);
    this.save();
    return entry;
  }

  deleteFitness(id) {
    this.data.fitness = this.data.fitness.filter(f => f.id !== id);
    this.save();
  }

  // ========== 阅读打卡 ==========
  getReading(date) {
    return this.data.reading.filter(r => r.date === date);
  }

  getAllReading() {
    return [...this.data.reading].sort((a, b) => b.date.localeCompare(a.date));
  }

  addReading(item) {
    const entry = {
      id: this.genId(),
      date: item.date,
      bookTitle: item.bookTitle || '',
      author: item.author || '',
      duration: item.duration || 0,
      pages: item.pages || 0,
      excerpt: item.excerpt || '',
      createdAt: new Date().toISOString()
    };
    this.data.reading.push(entry);
    this.save();
    return entry;
  }

  deleteReading(id) {
    this.data.reading = this.data.reading.filter(r => r.id !== id);
    this.save();
  }

  // ========== 连续打卡天数 ==========
  getStreak(type) {
    // type = 'fitness' | 'reading'
    const records = this.data[type] || [];
    const dateSet = new Set(records.map(r => r.date));
    let streak = 0;
    const d = new Date();
    // 如果今天没打卡，从昨天开始算（允许今天还没打卡）
    if (!dateSet.has(this.formatDate(d))) {
      d.setDate(d.getDate() - 1);
    }
    while (dateSet.has(this.formatDate(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  // ========== 抖音账号 ==========
  getLatestAccount() {
    if (!this.data.accountLogs.length) return null;
    return [...this.data.accountLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
  }

  getAccountHistory(days = 30) {
    const sorted = [...this.data.accountLogs].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.slice(0, days);
  }

  addAccountLog(item) {
    const entry = {
      id: this.genId(),
      date: item.date || this.formatDate(new Date()),
      followers: item.followers || 0,
      following: item.following || 0,
      posts: item.posts || 0,
      likes: item.likes || 0,
      note: item.note || '',
      createdAt: new Date().toISOString()
    };
    this.data.accountLogs.push(entry);
    this.save();
    return entry;
  }

  deleteAccountLog(id) {
    this.data.accountLogs = this.data.accountLogs.filter(a => a.id !== id);
    this.save();
  }

  getAccountStreak() {
    const logs = this.data.accountLogs;
    const dateSet = new Set(logs.map(l => l.date));
    let streak = 0;
    const d = new Date();
    if (!dateSet.has(this.formatDate(d))) {
      d.setDate(d.getDate() - 1);
    }
    while (dateSet.has(this.formatDate(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  // ========== 笔记 ==========
  getNote(date) {
    return this.data.notes[date] || '';
  }

  setNote(date, content) {
    if (content.trim()) {
      this.data.notes[date] = content;
    } else {
      delete this.data.notes[date];
    }
    this.save();
  }

  // ========== 统计 ==========
  getStats() {
    const today = this.formatDate(new Date());
    const todayTodos = this.getTodos(today);
    return {
      todayTotal: todayTodos.length,
      todayDone: todayTodos.filter(t => t.done).length,
      fitnessStreak: this.getStreak('fitness'),
      readingStreak: this.getStreak('reading'),
      inspirations: this.data.inspirations.length,
      knowledge: this.data.knowledge.length,
      franchises: this.data.franchises.length,
      accountStreak: this.getAccountStreak()
    };
  }
}

// 预填示例数据
const SEED_DATA = {
  inspirations: [
    {
      id: 'seed-insp-1',
      title: '故宫文创冰箱贴又出爆款了！这次是脊兽系列',
      source: '小红书',
      category: '博物馆文创',
      tags: ['故宫', '冰箱贴', '脊兽'],
      summary: '故宫新出的脊兽系列冰箱贴，将古建筑屋脊上的神兽做成迷你立体造型，单价39-59元，上市两周销量破万。"系列化+收集向+文化IP"的套路适合文创二创参考。',
      link: '',
      savedAt: new Date().toISOString(),
      status: 'pending'
    },
    {
      id: 'seed-insp-2',
      title: '漆扇DIY体验｜非遗也能这么潮',
      source: '小红书',
      category: '非遗手作',
      tags: ['漆扇', '非遗', 'DIY'],
      summary: '大漆工艺做的扇子，每把纹理独一无二，单价68-128元。博主用沉浸式制作过程视频+成品展示，强调"独一无二"的情绪价值。非遗+体验经济是当前热门方向。',
      link: '',
      savedAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'pending'
    }
  ],
  knowledge: [
    {
      id: 'seed-know-1',
      title: '文创创业必读：著作权登记与IP授权避坑指南',
      category: '版权IP',
      summary: '文创产品的核心资产是版权。原创设计需及时做著作权登记，商标注册要覆盖核心品类。IP授权时务必明确使用范围、期限、分成方式，警惕"买断式"条款。',
      link: '',
      savedAt: new Date().toISOString(),
      read: false
    },
    {
      id: 'seed-know-2',
      title: '小批量生产怎么找代工厂？文创供应链入门',
      category: '供应链',
      summary: '文创起步通常是小批量（100-500件）。建议：1）1688筛选"小单快反"工厂；2）先打样确认工艺；3）首批控制在300件内试水；4）建立品控标准文档。',
      link: '',
      savedAt: new Date(Date.now() - 86400000).toISOString(),
      read: false
    }
  ],
  franchises: [
    {
      id: 'seed-fr-1',
      brand: '某文创集合店品牌',
      investAmount: '10-30万',
      model: '加盟',
      contact: '小红书私信',
      source: '小红书',
      category: '文创加盟',
      tags: ['集合店', '加盟'],
      summary: '主打国潮文创集合，全国已开50+店。加盟费5万，首批进货8万，门店要求30平以上。需重点考察：选品能力、供应链稳定性、区域保护政策。',
      link: '',
      savedAt: new Date().toISOString(),
      status: 'pending'
    }
  ]
};

function seedDataIfEmpty(db) {
  if (db.data.inspirations.length === 0) {
    db.data.inspirations = JSON.parse(JSON.stringify(SEED_DATA.inspirations));
  }
  if (db.data.knowledge.length === 0) {
    db.data.knowledge = JSON.parse(JSON.stringify(SEED_DATA.knowledge));
  }
  if (db.data.franchises.length === 0) {
    db.data.franchises = JSON.parse(JSON.stringify(SEED_DATA.franchises));
  }
  db.save();
}
