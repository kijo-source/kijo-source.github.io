/**
 * 文创工作台 - 数据管理模块
 * 使用 localStorage 持久化，按日期组织
 */

const DB_KEY = 'wenchuang_workbench_v1';

// 默认初始数据 - 基于行业调研预填
const DEFAULT_DATA = {
  meta: {
    version: '1.0',
    createdAt: new Date().toISOString(),
    lastUpdate: new Date().toISOString()
  },
  todos: {},        // { '2025-07-25': [{id, text, done, priority, category, createdAt}] }
  inspirations: [], // 种草文素材 [{id, title, source, category, tags, summary, link, savedAt, status}]
  knowledge: [],    // 文创科普 [{id, title, category, summary, link, savedAt, read}]
  crossover: [],    // 跨界融合 [{id, title, industries, summary, link, savedAt, read}]
  notes: {}         // 每日笔记 { '2025-07-25': '内容' }
};

// 分类配置
const CATEGORIES = {
  todo: [
    { value: 'content', label: '内容创作', color: '#ff6b6b' },
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
    '品牌策略', '财务税务', '政策扶持', '行业报告', '其他'
  ],
  crossover: [
    '文创+咖啡', '文创+书店', '文创+文旅', '文创+公园商业',
    '文创+科技', '文创+餐饮', '文创+美妆', '文创+教育', '文创+家居', '其他'
  ]
};

const PRIORITY = [
  { value: 'high', label: '高', color: '#e74c3c' },
  { value: 'medium', label: '中', color: '#f39c12' },
  { value: 'low', label: '低', color: '#27ae60' }
];

class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
      const data = JSON.parse(raw);
      // 合并缺失字段
      return { ...JSON.parse(JSON.stringify(DEFAULT_DATA)), ...data };
    } catch (e) {
      console.error('数据加载失败', e);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  }

  save() {
    this.data.meta.lastUpdate = new Date().toISOString();
    localStorage.setItem(DB_KEY, JSON.stringify(this.data));
  }

  // 导出数据
  export() {
    return JSON.stringify(this.data, null, 2);
  }

  // 导入数据
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

  // 清空数据
  reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.save();
  }

  // ========== 待办事项 ==========
  getTodos(date) {
    return this.data.todos[date] || [];
  }

  addTodo(date, todo) {
    if (!this.data.todos[date]) this.data.todos[date] = [];
    const item = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
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

  // 获取多个日期的待办（用于看板视图）
  getTodosRange(startDate, endDate) {
    const result = {};
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = this.formatDate(d);
      result[key] = this.getTodos(key);
    }
    return result;
  }

  // ========== 种草文素材 ==========
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
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      title: item.title || '未命名',
      source: item.source || '小红书',
      category: item.category || '其他',
      tags: item.tags || [],
      summary: item.summary || '',
      link: item.link || '',
      cover: item.cover || '',
      savedAt: new Date().toISOString(),
      status: item.status || 'pending' // pending: 待二创, doing: 二创中, done: 已发布
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

  // ========== 知识库 ==========
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
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
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

  // ========== 跨界融合 ==========
  getCrossover(filter = {}) {
    let list = [...this.data.crossover];
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

  addCrossover(item) {
    const entry = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      title: item.title || '未命名',
      category: item.category || '其他',
      summary: item.summary || '',
      link: item.link || '',
      savedAt: new Date().toISOString(),
      read: false
    };
    this.data.crossover.push(entry);
    this.save();
    return entry;
  }

  updateCrossover(id, updates) {
    const idx = this.data.crossover.findIndex(i => i.id === id);
    if (idx >= 0) {
      this.data.crossover[idx] = { ...this.data.crossover[idx], ...updates };
      this.save();
      return this.data.crossover[idx];
    }
    return null;
  }

  deleteCrossover(id) {
    this.data.crossover = this.data.crossover.filter(i => i.id !== id);
    this.save();
  }

  // ========== 每日笔记 ==========
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

  // ========== 工具方法 ==========
  formatDate(d) {
    const dt = d instanceof Date ? d : new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // 统计
  getStats() {
    const today = this.formatDate(new Date());
    const todayTodos = this.getTodos(today);
    return {
      todayTotal: todayTodos.length,
      todayDone: todayTodos.filter(t => t.done).length,
      inspirations: this.data.inspirations.length,
      inspirationsPending: this.data.inspirations.filter(i => i.status === 'pending').length,
      knowledge: this.data.knowledge.length,
      crossover: this.data.crossover.length,
      notes: Object.keys(this.data.notes).length
    };
  }
}

// 预填的示例内容 - 帮助用户快速上手
const SEED_DATA = {
  inspirations: [
    {
      id: 'seed-insp-1',
      title: '故宫文创冰箱贴又出爆款了！这次是脊兽系列',
      source: '小红书',
      category: '博物馆文创',
      tags: ['故宫', '冰箱贴', '脊兽', '爆款'],
      summary: '故宫新出的脊兽系列冰箱贴，将古建筑屋脊上的神兽做成迷你立体造型，单价39-59元，上市两周销量破万。封面用产品特写+故宫红墙背景，标题用"终于集齐了！"制造收集欲。这种"系列化+收集向+文化IP"的套路很适合文创二创参考。',
      link: '',
      savedAt: new Date().toISOString(),
      status: 'pending'
    },
    {
      id: 'seed-insp-2',
      title: '漆扇DIY体验｜非遗也能这么潮',
      source: '小红书',
      category: '非遗手作',
      tags: ['漆扇', '非遗', 'DIY', '体验'],
      summary: '大漆工艺做的扇子，每把纹理独一无二，单价68-128元。博主用沉浸式制作过程视频+成品展示，强调"独一无二"和"亲手做"的情绪价值。非遗+体验经济是当前文创热门方向，可参考其"过程即内容"的种草逻辑。',
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
      summary: '文创产品的核心资产是版权。原创设计需及时做著作权登记（费用低、周期短），商标注册要覆盖核心品类。IP授权时务必明确使用范围、期限、分成方式，警惕"买断式"条款。建议早期就找专业知产律师把关合同。',
      link: '',
      savedAt: new Date().toISOString(),
      read: false
    },
    {
      id: 'seed-know-2',
      title: '小批量生产怎么找代工厂？文创供应链入门',
      category: '供应链',
      summary: '文创起步通常是小批量（100-500件），找大厂不接单，找小厂品质不稳。建议：1）1688筛选"小单快反"标签工厂；2）先打样确认工艺再下单；3）首批控制在300件内试水；4）建立品控标准文档，每次出货对照检查。',
      link: '',
      savedAt: new Date(Date.now() - 86400000).toISOString(),
      read: false
    }
  ],
  crossover: [
    {
      id: 'seed-cross-1',
      title: '案例拆解：一家"文创+咖啡"店如何做到月流水30万',
      category: '文创+咖啡',
      summary: '上海某文创咖啡店，核心模式是"咖啡引流+文创变现"。咖啡定价28-38元走量，店内文创周边（明信片、贴纸、手作）客单价60-120元，文创利润占比65%。关键动作：1）每月一个主题策展；2）咖啡杯套本身就是文创产品；3）打卡墙设计引导UGC传播。',
      link: '',
      savedAt: new Date().toISOString(),
      read: false
    },
    {
      id: 'seed-cross-2',
      title: '博物馆IP经济：单店年孵化100款百万级新品',
      category: '文创+文旅',
      summary: '博物馆文创已从"纪念品"升级为"IP经济"。某省级博物馆通过"馆藏元素提取→设计师共创→小批量试销→爆款放大"的链路，一年孵化100+款百万级单品。核心是建立IP素材库+设计师入驻机制，降低单品开发成本。',
      link: '',
      savedAt: new Date(Date.now() - 86400000).toISOString(),
      read: false
    }
  ]
};

// 初始化时注入种子数据（仅首次）
function seedDataIfEmpty(db) {
  if (db.data.inspirations.length === 0) {
    db.data.inspirations = JSON.parse(JSON.stringify(SEED_DATA.inspirations));
  }
  if (db.data.knowledge.length === 0) {
    db.data.knowledge = JSON.parse(JSON.stringify(SEED_DATA.knowledge));
  }
  if (db.data.crossover.length === 0) {
    db.data.crossover = JSON.parse(JSON.stringify(SEED_DATA.crossover));
  }
  db.save();
}
