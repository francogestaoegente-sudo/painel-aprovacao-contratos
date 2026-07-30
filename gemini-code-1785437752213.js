import { useState, useEffect, useMemo, useRef } from "react";
import { Check, X, Search, Printer, Download, Trash2, Loader2, Wifi, Plus } from "lucide-react";

const SEED = [
  ["2026-07-23","Rafael Silva Azevedo dos Santos","Internet","aprovado",""],
  ["2026-07-23","José Raimundo Mendes Barros","Internet","negado",""],
  ["2026-07-23","Cleide de Jesus Mendes Barros","Internet","aprovado",""],
  ["2026-07-23","Elisvania steffany do nascimento reis","Internet","aprovado",""],
  ["2026-07-23","Evanda dos Reis Moura feitosa Pereira","Internet","aprovado",""],
  ["2026-07-23","Lilian Ribeiro Castro","Internet","negado",""],
  ["2026-07-23","Jullya beatriz Ferreira da silva","Internet","aprovado",""],
  ["2026-07-23","Matheus Felipe Santos Henrique","Internet","negado",""],
  ["2026-07-23","Larissa stephanny Reis damasceno","Internet","negado",""],
  ["2026-07-23","Fernanda Ferreira silva","Internet","aprovado",""],
  ["2026-07-24","Helyda thais mesquita gomes","Internet","negado",""],
  ["2026-07-24","Anselmo Rodrigues Carvalho","Internet","negado",""],
  ["2026-07-24","Edite Rodrigues Carvalho","Internet","negado",""],
  ["2026-07-24","Flor de Maria dos montes sousa","Internet","aprovado","Aprovado se pagar o débito"],
  ["2026-07-24","Cintia Raquel Pereira Santos","Internet","negado",""],
  ["2026-07-24","Elen Cristina garces dos santos","Internet","negado",""],
  ["2026-07-24","Mario garces Ferreira","Internet","negado",""],
  ["2026-07-24","Denilson garces dos santos","Internet","aprovado",""],
  ["2026-07-24","Claudilene Araújo silva","Internet","aprovado",""],
  ["2026-07-24","Maria Neuza Silva Pereira","Internet","negado",""],
  ["2026-07-24","Warleson aguiar Vieira","Internet","aprovado",""],
  ["2026-07-24","Maria Eduarda do Nascimento da silva","Internet","negado",""],
  ["2026-07-24","Fábio Gomes dos Santos","Internet","aprovado",""],
  ["2026-07-24","Célia cristina Martins Torres","Internet","aprovado",""],
  ["2026-07-27","Maria ivani Costa Ribeiro","Internet","negado",""],
  ["2026-07-27","Luis Carlos Ribeiro","Internet","negado",""],
  ["2026-07-27","Esmeralda sousa Pereira","Internet","aprovado",""],
  ["2026-07-27","Paulo Eduardo Machado da Silva","Internet","aprovado",""],
  ["2026-07-27","Ilario Daniel Batista","Internet","aguardando",""],
  ["2026-07-27","Maria Raissa Lima Santos","Internet","negado",""],
  ["2026-07-27","Luziane saraiva mendes","Internet","aprovado",""],
  ["2026-07-28","Lia Marques Ferreira","Internet","negado",""],
  ["2026-07-28","Maria domingas Santos costa","Internet","negado",""],
  ["2026-07-28","Paulo Leandro Santos de Brito","Internet","aprovado",""],
  ["2026-07-28","Glacimar prazeres silva","Internet","aprovado",""],
  ["2026-07-28","Aldileia Santos mesquita","Internet","aprovado",""],
  ["2026-07-28","Maria do Espírito Santo silva vieira","Internet","negado",""],
  ["2026-07-28","Carlos André Silva Campos sousa","Internet","negado",""],
  ["2026-07-28","Larissa karliandra Sousa da silva campos","Internet","negado",""],
  ["2026-07-28","Gean cleydson correia Ferreira","Internet","aprovado",""],
  ["2026-07-28","Evandro Sousa Pereira","Internet","negado",""],
  ["2026-07-29","Paulo Oliveira Ferreira","Internet","aprovado",""],
  ["2026-07-29","Anndreya Kassandra Silva Teixeira","Internet","negado",""],
  ["2026-07-29","Jefferson Wendell correia castro","Internet","aprovado",""],
  ["2026-07-29","Claudilene de Araújo soares","Internet","negado",""],
  ["2026-07-29","Maria de Jesus Moraes Azevedo","Internet","negado",""],
  ["2026-07-29","Erica mesquita","Internet","aprovado",""],
  ["2026-07-29","Egila rafaelle mesquita","Internet","negado",""],
  ["2026-07-29","José Ribamar Ferreira cunha","Internet","negado",""],
  ["2026-07-29","Thaynara farias Ribeiro","Internet","negado",""],
  ["2026-07-30","Andreyna milena Coelho Nogueira","Internet","aprovado",""],
  ["2026-07-30","Alice Camila Rocha ramos","Internet","aprovado",""],
  ["2026-07-30","Francisco mota de Araújo","Internet","aprovado",""],
  ["2026-07-30","Luis Martins gomes","Internet","aprovado",""],
].map((r, i) => ({
  id: "seed-" + i,
  date: r[0],
  cliente: r[1],
  tipo: r[2],
  status: r[3],
  observacao: r[4],
  registradoPor: "",
  decididoPor: "",
  criadoEm: new Date(r[0] + "T12:00:00").getTime() + i,
}));

const STORAGE_KEY = "contratos:records";

const STATUS_META = {
  aprovado: { label: "Aprovado", color: "#0F9D6B", bg: "#E6F7F0" },
  negado: { label: "Negado", color: "#D0362C", bg: "#FBEAE9" },
  aguardando: { label: "Aguardando", color: "#B9760A", bg: "#FCF2E1" },
};

function fmtDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function weekdayLabel(iso) {
  const dt = new Date(iso + "T12:00:00");
  const dias = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  return dias[dt.getDay()];
}

function uid() {
  return "r-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

export default function ContractApprovalPanel() {
  const [records, setRecords] = useState(null);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("todas");
  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [form, setForm] = useState({ data: new Date().toISOString().slice(0, 10), cliente: "", tipo: "Internet", observacao: "" });
  const deleteTimer = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecords(JSON.parse(saved));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
        setRecords(SEED);
      }
    } catch (e) {
      setRecords(SEED);
    }
  }, []);

  function persist(next) {
    setRecords(next);
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setSaving(false), 300);
    }
  }

  function decide(id, status) {
    const who = nome.trim() || "Não informado";
    const next = records.map((r) => r.id === id ? { ...r, status, decididoPor: who } : r);
    persist(next);
  }

  function removeRecord(id) {
    const next = records.filter((r) => r.id !== id);
    persist(next);
    setPendingDelete(null);
  }

  function askDelete(id) {
    if (pendingDelete === id) {
      removeRecord(id);
      return;
    }
    setPendingDelete(id);
    clearTimeout(deleteTimer.current);
    deleteTimer.current = setTimeout(() => setPendingDelete(null), 3000);
  }

  function addRecord(e) {
    e.preventDefault();
    if (!form.cliente.trim()) return;
    const novo = {
      id: uid(),
      date: form.data,
      cliente: form.cliente.trim(),
      tipo: form.tipo.trim() || "Internet",
      status: "aguardando",
      observacao: form.observacao.trim(),
      registradoPor: nome.trim() || "Não informado",
      decididoPor: "",
      criadoEm: Date.now(),
    };
    persist([novo, ...records]);
    setForm({ data: new Date().toISOString().slice(0, 10), cliente: "", tipo: "Internet", observacao: "" });
    setShowForm(false);
  }

  const dateOptions = useMemo(() => {
    if (!records) return [];
    return Array.from(new Set(records.map((r) => r.date))).sort().reverse();
  }, [records]);

  const filtered = useMemo(() => {
    if (!records) return [];
    return records.filter((r) => {
      if (statusFilter !== "todos" && r.status !== statusFilter) return false;
      if (dateFilter !== "todas" && r.date !== dateFilter) return false;
      if (search.trim() && !r.cliente.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [records, statusFilter, dateFilter, search]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((r) => { (map[r.date] = map[r.date] || []).push(r); });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const stats = useMemo(() => {
    const base = { total: 0, aprovado: 0, negado: 0, aguardando: 0 };
    (records || []).forEach((r) => { base.total++; base[r.status] = (base[r.status] || 0) + 1; });
    return base;
  }, [records]);

  function exportCSV() {
    const header = ["Data", "Cliente", "Tipo", "Status", "Observação", "Registrado por", "Decidido por"];
    const rows = filtered
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => [fmtDate(r.date), r.cliente, r.tipo, STATUS_META[r.status].label, r.observacao, r.registradoPor, r.decididoPor]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contratos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    window.print();
  }

  if (!records) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 320, color: "#5B6472", fontFamily: "Inter, sans-serif" }}>
        <Loader2 size={18} style={{ marginRight: 8, animation: "spin 1s linear infinite" }} />
        Carregando painel...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="panel-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .panel-root {
          --navy: #0B2036;
          --navy-2: #14304C;
          --teal: #0F9D6B;
          --teal-soft: #E6F7F0;
          --red: #D0362C;
          --red-soft: #FBEAE9;
          --amber: #B9760A;
          --amber-soft: #FCF2E1;
          --bg: #F4F6F8;
          --card: #FFFFFF;
          --line: #E3E7EC;
          --text: #16202C;
          --muted: #6B7684;
          font-family: 'Inter', sans-serif;
          color: var(--text);
          background: var(--bg);
          border-radius: 14px;
          padding: 22px;
          max-width: 980px;
          margin: 0 auto;
        }
        .panel-root * { box-sizing: border-box; }
        .p-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap; margin-bottom: 18px;
        }
        .p-title-wrap { display: flex; align-items: center; gap: 12px; }
        .p-icon {
          width: 42px; height: 42px; border-radius: 10px;
          background: linear-gradient(135deg, var(--navy), var(--navy-2));
          display: flex; align-items: center; justify-content: center; color: var(--teal);
          flex-shrink: 0;
        }
        .p-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: -0.01em; margin: 0; }
        .p-subtitle { font-size: 12.5px; color: var(--muted); margin: 2px 0 0; }
        .name-input {
          font-size: 13px; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--line);
          background: var(--card); width: 190px; outline: none;
        }
        .name-input:focus { border-color: var(--navy-2); }
        .name-label { font-size: 11px; color: var(--muted); display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .04em; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
        .stat-card { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
        .stat-num { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; line-height: 1; }
        .stat-label { font-size: 11.5px; color: var(--muted); margin-top: 4px; }
        .toolbar {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          margin-bottom: 16px; background: var(--card); border: 1px solid var(--line);
          padding: 10px; border-radius: 10px;
        }
        .search-box { display: flex; align-items: center; gap: 6px; background: var(--bg); border-radius: 8px; padding: 7px 10px; flex: 1; min-width: 160px; }
        .search-box input { border: none; background: transparent; outline: none; font-size: 13px; width: 100%; color: var(--text); }
        select.filter-select {
          border: 1px solid var(--line); border-radius: 8px; padding: 7px 10px; font-size: 13px;
          background: var(--card); color: var(--text); outline: none;
        }
        .btn {
          display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600;
          border-radius: 8px; padding: 8px 13px; border: none; cursor: pointer; white-space: nowrap;
        }
        .btn-primary { background: var(--navy); color: #fff; }
        .btn-primary:hover { background: var(--navy-2); }
        .btn-ghost { background: var(--card); color: var(--text); border: 1px solid var(--line); }
        .btn-ghost:hover { background: var(--bg); }
        .form-card {
          background: var(--card); border: 1px solid var(--line); border-radius: 10px;
          padding: 14px; margin-bottom: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        }
        .form-card label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; display: block; margin-bottom: 4px; }
        .form-card input { width: 100%; padding: 8px 10px; border: 1px solid var(--line); border-radius: 7px; font-size: 13px; outline: none; }
        .form-card input:focus { border-color: var(--navy-2); }
        .form-full { grid-column: 1 / -1; }
        .form-actions { grid-column: 1 / -1; display: flex; gap: 8px; justify-content: flex-end; }
        .date-group { margin-bottom: 18px; }
        .date-group-head {
          display: flex; align-items: baseline; gap: 10px; padding: 6px 2px; margin-bottom: 8px;
          border-bottom: 2px solid var(--navy); 
        }
        .date-group-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 15px; }
        .date-group-sub { font-size: 12px; color: var(--muted); text-transform: capitalize; }
        .row {
          display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--line);
          border-radius: 9px; padding: 10px 12px; margin-bottom: 7px;
        }
        .row-main { flex: 1; min-width: 0; }
        .row-name { font-weight: 600; font-size: 13.5px; }
        .row-meta { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
        .row-note { font-size: 11.5px; color: var(--amber); margin-top: 2px; font-style: italic; }
        .badge {
          font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 999px; white-space: nowrap;
        }
        .row-actions { display: flex; gap: 6px; align-items: center; }
        .icon-btn {
          display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;
          border-radius: 7px; border: 1px solid var(--line); background: var(--card); cursor: pointer; color: var(--muted);
        }
        .icon-btn:hover { background: var(--bg); }
        .icon-btn.approve:hover { background: var(--teal-soft); color: var(--teal); border-color: var(--teal); }
        .icon-btn.deny:hover { background: var(--red-soft); color: var(--red); border-color: var(--red); }
        .icon-btn.danger { color: var(--red); }
        .icon-btn.danger.confirm { background: var(--red); color: #fff; border-color: var(--red); }
        .empty-state { text-align: center; padding: 40px 20px; color: var(--muted); font-size: 13.5px; }
        .save-indicator { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
        select.status-select { font-size: 11.5px; font-weight: 700; border-radius: 999px; padding: 4px 8px; border: none; cursor: pointer; }
        .print-only { display: none; }
        @media print {
          .no-print { display: none !important; }
          .print-only { display: inline-block !important; }
          .panel-root { background: #fff; padding: 0; max-width: 100%; }
          .row { border: none; border-bottom: 1px solid #ddd; border-radius: 0; page-break-inside: avoid; }
          .stats-row { display: flex; gap: 20px; }
          .stat-card { border: none; padding: 0; }
        }
      `}</style>

      <div className="p-header">
        <div className="p-title-wrap">
          <div className="p-icon"><Wifi size={20} /></div>
          <div>
            <p className="p-title">Aprovação de Contratos — Internet</p>
            <p className="p-subtitle">Relação de solicitações aprovadas, negadas e pendentes</p>
          </div>
        </div>
        <div className="no-print">
          <span className="name-label">Seu nome</span>
          <input className="name-input" placeholder="Ex: Rafael" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{stats.total}</div><div className="stat-label">Total de solicitações</div></div>
        <div className="stat-card"><div className="stat-num" style={{ color: "#0F9D6B" }}>{stats.aprovado || 0}</div><div className="stat-label">Aprovados</div></div>
        <div className="stat-card"><div className="stat-num" style={{ color: "#D0362C" }}>{stats.negado || 0}</div><div className="stat-label">Negados</div></div>
        <div className="stat-card"><div className="stat-num" style={{ color: "#B9760A" }}>{stats.aguardando || 0}</div><div className="stat-label">Aguardando</div></div>
      </div>

      <div className="toolbar no-print">
        <div className="search-box">
          <Search size={14} color="#6B7684" />
          <input placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="todos">Todos os status</option>
          <option value="aprovado">Aprovados</option>
          <option value="negado">Negados</option>
          <option value="aguardando">Aguardando</option>
        </select>
        <select className="filter-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="todas">Todas as datas</option>
          {dateOptions.map((d) => <option key={d} value={d}>{fmtDate(d)}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}><Plus size={14} /> Nova solicitação</button>
        <button className="btn btn-ghost" onClick={exportCSV}><Download size={14} /> Exportar CSV</button>
        <button className="btn btn-ghost" onClick={exportPDF}><Printer size={14} /> Exportar PDF</button>
        {saving && <span className="save-indicator"><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> salvando...</span>}
      </div>

      {showForm && (
        <form className="form-card no-print" onSubmit={addRecord}>
          <div>
            <label>Data</label>
            <input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required />
          </div>
          <div>
            <label>Tipo</label>
            <input value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} />
          </div>
          <div className="form-full">
            <label>Cliente</label>
            <input placeholder="Nome completo do cliente" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} required />
          </div>
          <div className="form-full">
            <label>Observação (opcional)</label>
            <input placeholder="Ex: aprovado se pagar o débito" value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Adicionar</button>
          </div>
        </form>
      )}

      {grouped.length === 0 && (
        <div className="empty-state">Nenhuma solicitação encontrada com esse filtro.</div>
      )}

      {grouped.map(([date, items]) => (
        <div className="date-group" key={date}>
          <div className="date-group-head">
            <span className="date-group-title">{fmtDate(date)}</span>
            <span className="date-group-sub">{weekdayLabel(date)}</span>
            <span className="date-group-sub">· {items.length} solicitações</span>
          </div>
          {items.map((r) => {
            const meta = STATUS_META[r.status];
            return (
              <div className="row" key={r.id}>
                <div className="row-main">
                  <div className="row-name">{r.cliente}</div>
                  <div className="row-meta">
                    {r.tipo}
                    {r.registradoPor ? ` · registrado por ${r.registradoPor}` : ""}
                    {r.decididoPor ? ` · decidido por ${r.decididoPor}` : ""}
                  </div>
                  {r.observacao && <div className="row-note">{r.observacao}</div>}
                </div>
                <div className="row-actions">
                  {r.status === "aguardando" ? (
                    <>
                      <button className="icon-btn approve no-print" title="Aprovar" onClick={() => decide(r.id, "aprovado")}><Check size={15} /></button>
                      <button className="icon-btn deny no-print" title="Negar" onClick={() => decide(r.id, "negado")}><X size={15} /></button>
                      <span className="badge" style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
                    </>
                  ) : (
                    <select
                      className="status-select no-print"
                      style={{ color: meta.color, background: meta.bg }}
                      value={r.status}
                      onChange={(e) => decide(r.id, e.target.value)}
                    >
                      <option value="aprovado">Aprovado</option>
                      <option value="negado">Negado</option>
                      <option value="aguardando">Aguardando</option>
                    </select>
                  )}
                  <span className="badge print-only" style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
                  <button
                    className={"icon-btn danger no-print" + (pendingDelete === r.id ? " confirm" : "")}
                    title={pendingDelete === r.id ? "Clique para confirmar" : "Excluir"}
                    onClick={() => askDelete(r.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}