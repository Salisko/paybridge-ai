import React, { useMemo, useState } from 'react';
import {
  Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, Bot, BriefcaseBusiness,
  Check, ChevronDown, CircleDollarSign, Clock3, CreditCard, Download, FileText,
  HelpCircle, Home, LayoutDashboard, LogOut, Menu, MoreHorizontal, Plus, Search,
  Send, Settings, ShieldCheck, Sparkles, TrendingUp, Wallet, X, Zap
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const initialTransactions = [
  { id: 'PB-2048', name: 'Northstar Studio', type: 'Invoice payment', date: 'Today, 10:42 AM', amount: 1240, status: 'Completed', icon: 'N' },
  { id: 'PB-2047', name: 'Cloudways Hosting', type: 'Subscription', date: 'Today, 08:16 AM', amount: -24, status: 'Completed', icon: 'C' },
  { id: 'PB-2046', name: 'Amara Okafor', type: 'Transfer', date: 'Yesterday, 04:31 PM', amount: -350, status: 'Completed', icon: 'A' },
  { id: 'PB-2045', name: 'Lumen Design Co.', type: 'Invoice payment', date: 'Oct 07, 2026', amount: 860, status: 'Pending', icon: 'L' },
  { id: 'PB-2044', name: 'Workspace Pro', type: 'Subscription', date: 'Oct 06, 2026', amount: -49, status: 'Completed', icon: 'W' },
];
const chartData = [
  { day: 'Mon', incoming: 1200, outgoing: 500 }, { day: 'Tue', incoming: 2100, outgoing: 900 },
  { day: 'Wed', incoming: 1600, outgoing: 750 }, { day: 'Thu', incoming: 2800, outgoing: 1100 },
  { day: 'Fri', incoming: 2200, outgoing: 850 }, { day: 'Sat', incoming: 3300, outgoing: 1200 },
  { day: 'Sun', incoming: 2900, outgoing: 980 },
];
const money = (n) => `${n < 0 ? '−' : ''}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function App() {
  const [page, setPage] = useState('Overview');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [modal, setModal] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ recipient: '', amount: '', note: '' });
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState('');
  const [invoice, setInvoice] = useState({ client: '', amount: '', description: '' });

  const balance = 24850.75 + transactions.filter(t => t.id.startsWith('NEW')).reduce((sum, t) => sum + t.amount, 0);
  const filtered = useMemo(() => transactions.filter(t => `${t.name} ${t.type} ${t.id} ${t.status}`.toLowerCase().includes(search.toLowerCase())), [transactions, search]);
  const notify = (msg) => { setToast(msg); window.setTimeout(() => setToast(''), 3200); };
  const navigate = (p) => { setPage(p); setMobileNav(false); };

  function sendPayment(e) {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.recipient.trim() || !Number.isFinite(amount) || amount <= 0) return notify('Enter a recipient and a valid amount.');
    if (amount > balance) return notify('Insufficient demo balance.');
    setTransactions(prev => [{ id: `NEW-${Date.now()}`, name: form.recipient, type: 'USDC transfer', date: 'Just now', amount: -amount, status: 'Demo', icon: form.recipient.trim()[0].toUpperCase() }, ...prev]);
    setForm({ recipient: '', amount: '', note: '' }); setModal(''); notify('Demo payment created — no real funds were sent.');
  }
  function createInvoice(e) {
    e.preventDefault();
    if (!invoice.client.trim() || Number(invoice.amount) <= 0) return notify('Add a client and a valid invoice amount.');
    setTransactions(prev => [{ id: `NEW-${Date.now()}`, name: invoice.client, type: `Invoice · ${invoice.description || 'Services'}`, date: 'Just now', amount: Number(invoice.amount), status: 'Draft', icon: invoice.client[0].toUpperCase() }, ...prev]);
    setInvoice({ client: '', amount: '', description: '' }); setModal(''); notify('Invoice draft added to your demo activity.');
  }
  function askAssistant(e) {
    e.preventDefault();
    const q = assistantPrompt.toLowerCase();
    let answer = 'I can help you plan USDC payments, review activity, and organize invoices. Try asking about spending, invoices, or recurring payments.';
    if (q.includes('spend') || q.includes('expense')) answer = 'Your sample activity shows several outgoing payments. Cloudways Hosting ($24), Amara Okafor ($350), and Workspace Pro ($49) are listed as completed. Review each item before making financial decisions.';
    else if (q.includes('invoice')) answer = 'You have one sample invoice payment pending from Lumen Design Co. You can draft another invoice from the Invoices section. This demo does not email or collect payments.';
    else if (q.includes('recurring') || q.includes('subscription')) answer = 'Your sample subscriptions include Cloudways Hosting ($24) and Workspace Pro ($49). Recurring-payment automation is a planned feature; no live schedules are running in this demo.';
    else if (q.includes('balance') || q.includes('treasury')) answer = `Your displayed demo balance is ${money(balance)} USDC. This is sample data only, not a connected wallet balance.`;
    setAssistantAnswer(answer);
  }

  const nav = [
    { label: 'Overview', icon: LayoutDashboard }, { label: 'Transactions', icon: ArrowLeftRight },
    { label: 'Invoices', icon: FileText }, { label: 'Recurring payments', icon: Clock3 },
    { label: 'AI Assistant', icon: Bot }, { label: 'Settings', icon: Settings },
  ];
  return <div className="app-shell">
    {mobileNav && <div className="mobile-backdrop" onClick={() => setMobileNav(false)} />}
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><ArrowLeftRight size={21}/></div><span>paybridge<span className="brand-ai">AI</span></span><button className="close-nav" onClick={() => setMobileNav(false)}><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace-switch"><div className="workspace-icon">S</div><div><b>Studio workspace</b><small>Business account</small></div><ChevronDown size={15}/></button>
      <div className="nav-label">MENU</div>
      <nav>{nav.map(item => <button key={item.label} onClick={() => navigate(item.label)} className={`nav-item ${page === item.label ? 'active' : ''}`}><item.icon size={18}/><span>{item.label}</span>{item.label === 'AI Assistant' && <span className="new-pill">AI</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><ShieldCheck size={18}/></div><b>Payments, made clearer.</b><p>Manage your USDC activity in one place.</p><button onClick={() => notify('Help center is coming soon.')}>Visit help center <ArrowUpRight size={13}/></button></div><button className="profile"><div className="avatar">SS</div><div className="profile-text"><b>Salisu Shittu</b><small>Free plan · Demo</small></div><MoreHorizontal size={19}/></button></div>
    </aside>

    <main className="main">
      <header className="topbar"><div className="top-left"><button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={21}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div></div><div className="top-actions"><div className="network-status"><span className="status-dot"/><span>Arc Testnet</span></div><button className="icon-button" aria-label="Notifications" onClick={() => notify('You’re all caught up.')}><Bell size={18}/><i/></button><div className="top-avatar">SS</div></div></header>

      <div className="content">
        {page === 'Overview' && <>
          <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> YOUR FINANCIAL COMMAND CENTER</div><h1>Good day, Salisu <span className="wave">✦</span></h1><p className="subtitle">Here’s what’s happening with your payments today.</p></div><div className="welcome-actions"><button className="btn-secondary" onClick={() => setModal('invoice')}><Plus size={16}/> Create invoice</button><button className="btn-primary" onClick={() => setModal('send')}><Send size={16}/> Send payment</button></div></div>
          <div className="demo-banner"><div className="banner-icon"><Zap size={17}/></div><div><b>Welcome to the PayBridge AI demo</b><span>Sample balances and activity only. Payments are not sent on-chain.</span></div><button onClick={() => notify('Connect a wallet in a future version to enable on-chain actions.')} className="banner-link">About demo <ArrowUpRight size={14}/></button></div>
          <section className="stats-grid">
            <div className="stat-card balance-card"><div className="stat-top"><span>Total balance</span><span className="stat-icon"><Wallet size={17}/></span></div><div className="balance-value">{money(balance)} <span>USDC</span></div><div className="balance-bottom"><span className="positive"><TrendingUp size={14}/> 8.2%</span><span>vs. last month</span><button onClick={() => notify('Wallet connection is not enabled in this demo.')}><ArrowUpRight size={15}/> View wallet</button></div><div className="balance-glow"/></div>
            <div className="stat-card"><div className="stat-top"><span>Money received</span><span className="stat-icon green"><ArrowDownLeft size={17}/></span></div><div className="stat-value">$8,420.00</div><div className="stat-foot"><span className="positive"><TrendingUp size={13}/> 12.4%</span> <span>this month</span></div><div className="mini-bars">{[35,52,43,66,48,76,58,88,65,72,93,77].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></div>
            <div className="stat-card"><div className="stat-top"><span>Money sent</span><span className="stat-icon orange"><ArrowUpRight size={17}/></span></div><div className="stat-value">$2,145.80</div><div className="stat-foot"><span className="positive"><TrendingUp size={13}/> 4.6%</span> <span>this month</span></div><div className="mini-bars outgoing">{[55,38,64,43,73,52,66,42,79,56,68,49].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></div>
            <div className="stat-card"><div className="stat-top"><span>Pending invoices</span><span className="stat-icon purple"><FileText size={17}/></span></div><div className="stat-value">$860.00</div><div className="stat-foot"><span className="pending-dot"/> <span>1 invoice awaiting payment</span></div><button className="text-link" onClick={() => navigate('Invoices')}>Review invoices <ArrowUpRight size={14}/></button></div>
          </section>

          <div className="dashboard-grid">
            <section className="panel chart-panel"><div className="panel-heading"><div><h2>Cash flow</h2><p>Track money moving in and out</p></div><button className="select-button" onClick={() => notify('Showing sample data for the last 7 days.')}>Last 7 days <ChevronDown size={14}/></button></div><div className="chart-legend"><span><i className="legend-in"/> Received</span><span><i className="legend-out"/> Sent</span></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:10,right:5,left:-20,bottom:0}}><defs><linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#24b88a" stopOpacity={0.19}/><stop offset="100%" stopColor="#24b88a" stopOpacity={0}/></linearGradient><linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8c83f7" stopOpacity={0.12}/><stop offset="100%" stopColor="#8c83f7" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf0f4"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#8b96a8'}} dy={10}/><Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{border:'1px solid #edf0f4',borderRadius:10,fontSize:12}}/><Area type="monotone" dataKey="incoming" name="Received" stroke="#22b887" strokeWidth={2.3} fill="url(#inGrad)"/><Area type="monotone" dataKey="outgoing" name="Sent" stroke="#8c83f7" strokeWidth={2.3} fill="url(#outGrad)"/></AreaChart></ResponsiveContainer></div></section>
            <section className="panel quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Get things done faster</p></div><span className="sparkle-mark"><Zap size={17}/></span></div><div className="quick-actions">
              <button onClick={() => setModal('send')}><span className="quick-icon q-send"><Send size={18}/></span><span><b>Send USDC</b><small>Pay a person or business</small></span><ArrowUpRight size={16} className="quick-arrow"/></button>
              <button onClick={() => setModal('invoice')}><span className="quick-icon q-invoice"><FileText size={18}/></span><span><b>Create invoice</b><small>Request a payment</small></span><ArrowUpRight size={16} className="quick-arrow"/></button>
              <button onClick={() => navigate('AI Assistant')}><span className="quick-icon q-ai"><Bot size={18}/></span><span><b>Ask PayBridge AI</b><small>Get payment insights</small></span><ArrowUpRight size={16} className="quick-arrow"/></button>
              <button onClick={() => navigate('Recurring payments')}><span className="quick-icon q-recurring"><Clock3 size={18}/></span><span><b>Recurring payments</b><small>Manage scheduled bills</small></span><ArrowUpRight size={16} className="quick-arrow"/></button>
            </div></section>
          </div>
          <section className="panel transactions-panel"><div className="panel-heading"><div><h2>Recent transactions</h2><p>Your latest payment activity</p></div><button className="view-all" onClick={() => navigate('Transactions')}>View all <ArrowUpRight size={14}/></button></div><TransactionTable rows={transactions.slice(0,5)} /></section>
        </>}

        {page === 'Transactions' && <><PageHeading eyebrow="PAYMENT ACTIVITY" title="Transactions" subtitle="Review and search your payment history."/><section className="panel transactions-panel full-panel"><div className="table-toolbar"><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions..."/></div><button className="btn-secondary" onClick={() => notify('Your demo transaction export is not available yet.')}><Download size={15}/> Export</button></div><TransactionTable rows={filtered}/></section></>}
        {page === 'Invoices' && <><PageHeading eyebrow="BILLING & COLLECTIONS" title="Invoices" subtitle="Create and track payment requests for your clients." action={<button className="btn-primary" onClick={()=>setModal('invoice')}><Plus size={16}/> Create invoice</button>}/><div className="invoice-summary"><div className="stat-card"><span className="muted">Total outstanding</span><strong>$860.00</strong><small>1 invoice awaiting payment</small></div><div className="stat-card"><span className="muted">Paid this month</span><strong>$2,100.00</strong><small className="positive">Across 3 invoices</small></div><div className="stat-card"><span className="muted">Draft invoices</span><strong>{transactions.filter(t=>t.status==='Draft').length}</strong><small>Not yet sent</small></div></div><section className="panel transactions-panel"><div className="panel-heading"><div><h2>Invoice activity</h2><p>Payment requests and invoice records</p></div></div><TransactionTable rows={transactions.filter(t=>t.type.toLowerCase().includes('invoice'))}/></section></>}
        {page === 'Recurring payments' && <><PageHeading eyebrow="AUTOMATION" title="Recurring payments" subtitle="A clear view of subscriptions and planned payment automation." action={<button className="btn-primary" onClick={()=>notify('Recurring payment scheduling is planned, but not active in this demo.')}><Plus size={16}/> New schedule</button>}/><div className="feature-note"><div className="feature-note-icon"><Clock3 size={21}/></div><div><b>Automate payments with confidence</b><p>Recurring payment scheduling is planned for a future PayBridge AI release. The subscriptions below are sample activity, not active payment instructions.</p></div></div><section className="panel transactions-panel"><div className="panel-heading"><div><h2>Subscriptions in activity</h2><p>Examples found in your sample transactions</p></div><span className="soft-badge">Demo data</span></div><TransactionTable rows={transactions.filter(t=>t.type.toLowerCase().includes('subscription'))}/></section></>}
        {page === 'AI Assistant' && <><PageHeading eyebrow="INTELLIGENCE, BUILT IN" title="Meet your payment copilot" subtitle="Ask questions about your demo balance, spending, invoices, and payment workflows."/><div className="assistant-layout"><section className="assistant-card"><div className="assistant-hero"><div className="assistant-orb"><Bot size={29}/><Sparkles size={15}/></div><div><span className="assistant-label">PAYBRIDGE AI</span><h2>What can I help you with?</h2><p>Ask naturally. Get a clearer view of your payment operations.</p></div></div><div className="suggestion-grid"><button onClick={()=>setAssistantPrompt('Summarize my spending')}><Activity size={16}/> Summarize my spending</button><button onClick={()=>setAssistantPrompt('Which invoices are unpaid?')}><FileText size={16}/> Check unpaid invoices</button><button onClick={()=>setAssistantPrompt('What are my subscriptions?')}><Clock3 size={16}/> Review subscriptions</button><button onClick={()=>setAssistantPrompt('What is my treasury balance?')}><CircleDollarSign size={16}/> Explain my balance</button></div><form className="assistant-input" onSubmit={askAssistant}><input value={assistantPrompt} onChange={e=>setAssistantPrompt(e.target.value)} placeholder="Ask about your payments..." aria-label="Ask PayBridge AI"/><button className="btn-primary" type="submit"><Send size={16}/> Ask AI</button></form>{assistantAnswer && <div className="assistant-answer"><div className="answer-icon"><Sparkles size={16}/></div><div><b>PayBridge AI</b><p>{assistantAnswer}</p><small>AI-generated demo response. Verify details before acting.</small></div></div>}</section><aside className="assistant-side panel"><h3><Sparkles size={16}/> What I can do</h3>{[['Payment insights','Understand incoming and outgoing activity'],['Invoice support','Review payment requests and drafts'],['Workflow planning','Explore recurring payment use cases'],['Treasury overview','Get a summary of sample balances']].map(([t,d])=><div className="capability" key={t}><span className="cap-check"><Check size={13}/></span><div><b>{t}</b><p>{d}</p></div></div>)}<div className="privacy-note"><ShieldCheck size={16}/><span>This demo does not connect to your wallet or move funds.</span></div></aside></div></>}
        {page === 'Settings' && <><PageHeading eyebrow="YOUR WORKSPACE" title="Settings" subtitle="Manage your profile and preferences."/><section className="panel settings-panel"><div className="settings-row"><div className="settings-row-icon"><BriefcaseBusiness size={18}/></div><div><b>Workspace</b><p>Studio workspace · Business account</p></div><button className="btn-secondary" onClick={()=>notify('Workspace editing is not available in this demo.')}>Manage</button></div><div className="settings-row"><div className="settings-row-icon"><Wallet size={18}/></div><div><b>Wallet connection</b><p>No wallet connected · Arc Testnet demo</p></div><button className="btn-secondary" onClick={()=>notify('Wallet connection is not enabled yet.')}>Connect wallet</button></div><div className="settings-row"><div className="settings-row-icon"><Bell size={18}/></div><div><b>Notifications</b><p>Payment alerts and invoice reminders</p></div><button className="btn-secondary" onClick={()=>notify('Notification preferences are coming soon.')}>Preferences</button></div><div className="settings-row"><div className="settings-row-icon"><ShieldCheck size={18}/></div><div><b>Security & privacy</b><p>Review how demo data and payment actions work</p></div><button className="btn-secondary" onClick={()=>notify('No real financial data is stored by this frontend demo.')}>Learn more</button></div></section></>}
        <footer className="footer"><span>© 2026 PayBridge AI</span><span><span className="footer-dot"/> Built for smarter payments on Arc</span><button onClick={()=>notify('PayBridge AI demo · Version 1.0')}>About this demo</button></footer>
      </div>
    </main>

    {modal && <div className="modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setModal('')}}><section className="modal"><div className="modal-header"><div><span className="eyebrow">{modal==='send'?'USDC TRANSFER':'BILLING & COLLECTIONS'}</span><h2>{modal==='send'?'Send a payment':'Create an invoice'}</h2><p>{modal==='send'?'Add the recipient and amount to create a demo transfer.':'Prepare a payment request for your client.'}</p></div><button className="icon-button" onClick={()=>setModal('')}><X size={19}/></button></div>{modal==='send'?<form onSubmit={sendPayment} className="modal-form"><label>Recipient name or wallet address<input required value={form.recipient} onChange={e=>setForm({...form,recipient:e.target.value})} placeholder="e.g. alex@example.com or 0x..." /></label><label>Amount <span className="field-unit">USDC</span><div className="amount-input"><span>$</span><input required type="number" min="0.01" step="0.01" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="0.00"/></div></label><label>Note (optional)<input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="What is this payment for?"/></label><div className="demo-warning"><ShieldCheck size={16}/><span>Demo only. No wallet is connected and no real funds will move.</span></div><div className="modal-actions"><button type="button" className="btn-secondary" onClick={()=>setModal('')}>Cancel</button><button type="submit" className="btn-primary"><Send size={15}/> Create demo payment</button></div></form>:<form onSubmit={createInvoice} className="modal-form"><label>Client or business<input required value={invoice.client} onChange={e=>setInvoice({...invoice,client:e.target.value})} placeholder="e.g. Northstar Studio"/></label><label>Invoice amount <span className="field-unit">USDC</span><div className="amount-input"><span>$</span><input required type="number" min="0.01" step="0.01" value={invoice.amount} onChange={e=>setInvoice({...invoice,amount:e.target.value})} placeholder="0.00"/></div></label><label>Description<input value={invoice.description} onChange={e=>setInvoice({...invoice,description:e.target.value})} placeholder="e.g. Product design services"/></label><div className="demo-warning"><FileText size={16}/><span>This creates a local demo record. It does not send an invoice to your client.</span></div><div className="modal-actions"><button type="button" className="btn-secondary" onClick={()=>setModal('')}>Cancel</button><button type="submit" className="btn-primary"><Plus size={15}/> Create draft</button></div></form>}</section></div>}
    {toast && <div className="toast"><Check size={17}/>{toast}<button onClick={()=>setToast('')}><X size={15}/></button></div>}
  </div>;
}

function PageHeading({eyebrow,title,subtitle,action}) { return <div className="page-heading"><div><div className="eyebrow"><Sparkles size={14}/>{eyebrow}</div><h1>{title}</h1><p className="subtitle">{subtitle}</p></div>{action && <div className="page-heading-action">{action}</div>}</div>; }

function TransactionTable({ rows }) {
  if (!rows.length) return <div className="empty-state"><Search size={23}/><b>No transactions found</b><p>Try another search term or create a new payment.</p></div>;
  return <div className="table-scroll"><table className="transactions-table"><thead><tr><th>RECIPIENT / SENDER</th><th>TYPE</th><th>DATE</th><th>STATUS</th><th className="amount-cell">AMOUNT</th></tr></thead><tbody>{rows.map((t,i)=><tr key={t.id}><td><div className="recipient-cell"><span className={`transaction-avatar color-${i%5}`}>{t.icon}</span><div><b>{t.name}</b><small>{t.id}</small></div></div></td><td><span className="type-text">{t.type}</span></td><td><span className="date-text">{t.date}</span></td><td><span className={`status-badge ${t.status.toLowerCase()}`}><i/>{t.status}</span></td><td className={`amount-cell amount ${t.amount<0?'negative':'positive-amount'}`}>{t.amount<0?'−':'+'}{money(Math.abs(t.amount)).replace('−','')}</td></tr>)}</tbody></table></div>;
}
