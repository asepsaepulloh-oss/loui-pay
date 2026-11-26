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
