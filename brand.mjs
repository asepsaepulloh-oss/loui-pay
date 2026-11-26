import {readFileSync,writeFileSync} from "node:fs";
const labels = [
 ["1ai-payment","Louiv Pay"],["Merchant Portal","Portal Merchant"],
 ["Business Name","Nama usaha"],["My Online Store","Nama toko"],
 ["Create Merchant Account","Daftar merchant"],["Already have an account?","Sudah punya akun?"],
 ["Your API Key","API key toko"],["Default Callback URL","URL webhook toko"]
];
for(const file of ["src/dashboard/index.html","src/landing/payment-done.html"]){
 let page=readFileSync(file,"utf8");
 for(const [from,to] of labels) page=page.replaceAll(from,to);
 writeFileSync(file,page);
}
function patch(file, before, after) {
  const source = readFileSync(file,"utf8");
  if (!source.includes(before)) throw new Error("Unexpected upstream source: " + file);
  writeFileSync(file,source.replace(before,after));
}
patch("src/index.ts",'hostname: "127.0.0.1"','hostname: "0.0.0.0"');
patch("src/middleware/rate-limit.ts",'const cfIp = c.req.header("CF-Connecting-IP");','const cfIp = undefined;');
const portalPath = "src/dashboard/index.html";
let portal = readFileSync(portalPath,"utf8");
const originalScripts=portal.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi)||[];
const displayLabels = {
  "Overview":"Ringkasan","Transactions":"Transaksi","Refunds":"Pengembalian dana","Gateways":"Kanal pembayaran",
  "Saved Methods":"Metode tersimpan","Deliveries":"Webhook","Settings":"Pengaturan","Platform (admin)":"Admin platform",
  "Total Transactions":"Total transaksi","Successful":"Berhasil","Pending":"Menunggu","Failed":"Gagal",
  "Recent Transactions":"Transaksi terbaru","Amount":"Nominal","Date":"Tanggal","Method":"Metode","Sign Out":"Keluar",
  "Gateway Configuration":"Pengaturan kanal","Webhook Deliveries":"Pengiriman webhook","Welcome Back":"Masuk ke Louiv Pay",
  "Create refund":"Ajukan pengembalian","Sign In":"Masuk","Business name":"Nama usaha","Save changes":"Simpan perubahan",
  "Account":"Akun merchant","Reason":"Alasan","Created":"Dibuat"
};
for(const [oldLabel,newLabel] of Object.entries(displayLabels)) portal=portal.replaceAll(">"+oldLabel+"<",">"+newLabel+"<");
portal=portal.replace('id="loginKey"','id="loginKey"').replace('type="text" id="loginKey"','type="password" id="loginKey"')
.replace('Accept payments across <span id="gwCountHero">15</span> gateways','<p class="subtitle">Daftarkan toko untuk mengelola transaksi dan webhook.</p><span hidden id="gwCountHero"></span>')
.replace('Sign in with your API key to access the merchant dashboard.','Masukkan API key toko untuk membuka dashboard merchant.')
.replace('All accounts are <strong>Free</strong> (30 req/min). Pro/Enterprise tiers are assigned by the platform admin — no self-upgrade yet.','Paket Free mencakup 30 permintaan per menit.')
.replace('</style>',`
body{background:#f5f6fa;color:#22233b;font:16px/1.5 Inter,"Segoe UI",sans-serif}
.center-page{padding:24px 12px}.card,.settings-group,.stat,.table-wrap{background:white;border:1px solid #dfe1eb;border-radius:14px;color:#23243b}
.card{padding:clamp(22px,4vw,40px);box-shadow:0 12px 42px #23233c0a}
.card h1,.main h1{letter-spacing:-.045em;font-weight:700}.card h1{font-size:32px}.card p,.subtitle,.hint,.link-row,label,.settings-row .key{color:#565b70!important}
a{color:#5143aa}.btn-primary{background:#5143aa}.btn-secondary,.copy-btn{background:#eeedf6;color:#413874;border-color:#d8d5e6}
input,select,select option,textarea{background:#fff;color:#21263b;border-color:#bcc2d2;font-size:16px}
input:focus,select:focus{border-color:#7161d5}.dash-layout{display:grid;grid-template-columns:230px minmax(0,1fr)}
.sidebar{width:auto;background:#22223c;border:0;color:white;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;padding:28px 16px;overflow-y:auto}
.sidebar .logo{font-size:26px;letter-spacing:-1px}.logo:before{content:"L";display:inline-grid;place-items:center;width:35px;height:35px;background:#7160d6;color:white;border-radius:10px;margin-right:10px;font:italic bold 25px Georgia}
.sidebar .plan-badge{align-self:flex-start;margin:0 0 25px 46px;color:#ddd8ff;background:#35344c}
.sidebar nav{gap:4px}.sidebar nav button{font-size:15px;padding:11px 15px;color:#d8d8e8}.sidebar nav button.active{background:#40405a;color:white;box-shadow:inset 3px 0 #b6aaff}
.sidebar .logout-btn button{background:transparent;color:#dfdfec;border:1px solid #545469}
.main{padding:clamp(24px,4vw,64px);overflow:visible;min-width:0}.main>div{max-width:1240px;margin:auto}.main h1{font-size:clamp(30px,3vw,46px);margin-bottom:24px}.main h2{font-size:20px}
.stats{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.stat{padding:20px}.stat .label,th,.settings-group h3{text-transform:none;letter-spacing:0}.stat .label{font-size:14px;color:#565b70}.stat .value{font-size:34px;line-height:1.3;margin-top:10px;font-variant-numeric:tabular-nums}
.stat:first-child{background:#45398b;border-color:#45398b;color:white}.stat:first-child .label{color:#e6e0ff}.stat .green,.badge.success{color:#14724f}.stat .yellow,.badge.pending{color:#895909}.stat .red,.badge.failed{color:#a33e4a}
.table-wrap{overflow-x:auto;max-width:100%}table{font-size:14px;min-width:540px}td,th{border-color:#e7e8ee;padding:14px 16px}th{background:#eef0f6;color:#565b70;font-size:13px}tbody tr:hover{background:#fafaff}
.settings-group{max-width:820px}.settings-group h3{font-size:18px;color:#282b40}.settings-row{border-color:#e1e3ec;gap:16px}.val{overflow-wrap:anywhere}.main p[style*="#94a3b8"]{color:#5c6173!important}
.api-key-box,.code-block{background:#25253b;color:#e8e6ff;padding-right:65px}.warning-box{color:#805512}.error-msg{color:#ab293a}
@media(max-width:1000px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.dash-layout{display:block}.sidebar{position:relative;height:auto;padding:14px;width:100%;overflow:visible}.sidebar .logo{font-size:21px;margin-bottom:12px}.sidebar .plan-badge{display:none}.sidebar nav{flex-direction:row;overflow-x:auto;padding-bottom:3px}.sidebar nav button{white-space:nowrap;flex:none;padding:8px 12px}.sidebar .logout-btn{position:absolute;right:14px;top:14px;padding:0}.main{padding:22px 16px}.settings-group,.stat{padding:16px}.card{width:min(440px,100%);max-width:100%}.settings-row{flex-wrap:wrap}}
</style>`);
let scriptIndex=0;portal=portal.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,()=>originalScripts[scriptIndex++]);
writeFileSync(portalPath,portal);

const pageStyles = ".page:not(.active){display:none}.page.active{display:flex;min-height:100vh;min-height:100dvh;width:100%}";
const pages = readFileSync(portalPath,"utf8")
  .replace("</style>", pageStyles+"</style>")
  .replace("<head>",'<head><meta name="viewport" content="width=device-width,initial-scale=1">');
writeFileSync(portalPath,pages);
