var di=Object.defineProperty;var Vr=e=>{throw TypeError(e)};var fi=(e,t,r)=>t in e?di(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var O=(e,t,r)=>fi(e,typeof t!="symbol"?t+"":t,r),_t=(e,t,r)=>t.has(e)||Vr("Cannot "+r);var T=(e,t,r)=>(_t(e,t,"read from private field"),r?r.call(e):t.get(e)),B=(e,t,r)=>t.has(e)?Vr("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),k=(e,t,r,s)=>(_t(e,t,"write to private field"),s?s.call(e,r):t.set(e,r),r),H=(e,t,r)=>(_t(e,t,"access private method"),r);var Xr=(e,t,r,s)=>({set _(n){k(e,t,n,r)},get _(){return T(e,t,s)}});import Fe from"events";import He from"util";import _n from"crypto";import hi from"dns";import Cn from"fs";import Pn from"net";import pi from"tls";import mi from"path";import Tn from"stream";import gi from"string_decoder";var Wr=(e,t,r)=>(s,n)=>{let i=-1;return o(0);async function o(a){if(a<=i)throw new Error("next() called multiple times");i=a;let c,u=!1,l;if(e[a]?(l=e[a][0][0],s.req.routeIndex=a):l=a===e.length&&n||void 0,l)try{c=await l(s,()=>o(a+1))}catch(f){if(f instanceof Error&&t)s.error=f,c=await t(f,s),u=!0;else throw f}else s.finalized===!1&&r&&(c=await r(s));return c&&(s.finalized===!1||u)&&(s.res=c),s}},bi=Symbol(),yi=async(e,t=Object.create(null))=>{const{all:r=!1,dot:s=!1}=t,i=(e instanceof qn?e.raw.headers:e.headers).get("Content-Type");return i!=null&&i.startsWith("multipart/form-data")||i!=null&&i.startsWith("application/x-www-form-urlencoded")?vi(e,{all:r,dot:s}):{}};async function vi(e,t){const r=await e.formData();return r?wi(r,t):{}}function wi(e,t){const r=Object.create(null);return e.forEach((s,n)=>{t.all||n.endsWith("[]")?xi(r,n,s):r[n]=s}),t.dot&&Object.entries(r).forEach(([s,n])=>{s.includes(".")&&(Ei(r,s,n),delete r[s])}),r}var xi=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},Ei=(e,t,r)=>{let s=e;const n=t.split(".");n.forEach((i,o)=>{o===n.length-1?s[i]=r:((!s[i]||typeof s[i]!="object"||Array.isArray(s[i])||s[i]instanceof File)&&(s[i]=Object.create(null)),s=s[i])})},Rn=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Si=e=>{const{groups:t,path:r}=Ai(e),s=Rn(r);return _i(s,t)},Ai=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,s)=>{const n=`@${s}`;return t.push([n,r]),n}),{groups:t,path:e}},_i=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[s]=t[r];for(let n=e.length-1;n>=0;n--)if(e[n].includes(s)){e[n]=e[n].replace(s,t[r][1]);break}}return e},ot={},Ci=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const s=`${e}#${t}`;return ot[s]||(r[2]?ot[s]=t&&t[0]!==":"&&t[0]!=="*"?[s,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:ot[s]=[e,r[1],!0]),ot[s]}return null},yt=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},Pi=e=>yt(e,decodeURI),In=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let s=r;for(;s<t.length;s++){const n=t.charCodeAt(s);if(n===37){const i=t.indexOf("?",s),o=t.slice(r,i===-1?void 0:i);return Pi(o.includes("%25")?o.replace(/%25/g,"%2525"):o)}else if(n===63)break}return t.slice(r,s)},Ti=e=>{const t=In(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},qe=(e,t,...r)=>(r.length&&(t=qe(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),Nn=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let s="";return t.forEach(n=>{if(n!==""&&!/\:/.test(n))s+="/"+n;else if(/\:/.test(n))if(/\?/.test(n)){r.length===0&&s===""?r.push("/"):r.push(s);const i=n.replace("?","");s+="/"+i,r.push(s)}else s+="/"+n}),r.filter((n,i,o)=>o.indexOf(n)===i)},Ct=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?yt(e,kr):e):e,Dn=(e,t,r)=>{let s;if(!r&&t&&!/[%+]/.test(t)){let o=e.indexOf(`?${t}`,8);for(o===-1&&(o=e.indexOf(`&${t}`,8));o!==-1;){const a=e.charCodeAt(o+t.length+1);if(a===61){const c=o+t.length+2,u=e.indexOf("&",c);return Ct(e.slice(c,u===-1?void 0:u))}else if(a==38||isNaN(a))return"";o=e.indexOf(`&${t}`,o+1)}if(s=/[%+]/.test(e),!s)return}const n={};s??(s=/[%+]/.test(e));let i=e.indexOf("?",8);for(;i!==-1;){const o=e.indexOf("&",i+1);let a=e.indexOf("=",i);a>o&&o!==-1&&(a=-1);let c=e.slice(i+1,a===-1?o===-1?void 0:o:a);if(s&&(c=Ct(c)),i=o,c==="")continue;let u;a===-1?u="":(u=e.slice(a+1,o===-1?void 0:o),s&&(u=Ct(u))),r?(n[c]&&Array.isArray(n[c])||(n[c]=[]),n[c].push(u)):n[c]??(n[c]=u)}return t?n[t]:n},Ri=Dn,Ii=(e,t)=>Dn(e,t,!0),kr=decodeURIComponent,Gr=e=>yt(e,kr),Le,Z,de,On,kn,Dr,he,gn,qn=(gn=class{constructor(e,t="/",r=[[]]){B(this,de);O(this,"raw");B(this,Le);B(this,Z);O(this,"routeIndex",0);O(this,"path");O(this,"bodyCache",{});B(this,he,e=>{const{bodyCache:t,raw:r}=this,s=t[e];if(s)return s;const n=Object.keys(t)[0];return n?t[n].then(i=>(n==="json"&&(i=JSON.stringify(i)),new Response(i)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,k(this,Z,r),k(this,Le,{})}param(e){return e?H(this,de,On).call(this,e):H(this,de,kn).call(this)}query(e){return Ri(this.url,e)}queries(e){return Ii(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,s)=>{t[s]=r}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await yi(this,e))}json(){return T(this,he).call(this,"text").then(e=>JSON.parse(e))}text(){return T(this,he).call(this,"text")}arrayBuffer(){return T(this,he).call(this,"arrayBuffer")}blob(){return T(this,he).call(this,"blob")}formData(){return T(this,he).call(this,"formData")}addValidatedData(e,t){T(this,Le)[e]=t}valid(e){return T(this,Le)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[bi](){return T(this,Z)}get matchedRoutes(){return T(this,Z)[0].map(([[,e]])=>e)}get routePath(){return T(this,Z)[0].map(([[,e]])=>e)[this.routeIndex].path}},Le=new WeakMap,Z=new WeakMap,de=new WeakSet,On=function(e){const t=T(this,Z)[0][this.routeIndex][1][e],r=H(this,de,Dr).call(this,t);return r&&/\%/.test(r)?Gr(r):r},kn=function(){const e={},t=Object.keys(T(this,Z)[0][this.routeIndex][1]);for(const r of t){const s=H(this,de,Dr).call(this,T(this,Z)[0][this.routeIndex][1][r]);s!==void 0&&(e[r]=/\%/.test(s)?Gr(s):s)}return e},Dr=function(e){return T(this,Z)[1]?T(this,Z)[1][e]:e},he=new WeakMap,gn),Ni={Stringify:1},Ln=async(e,t,r,s,n)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const i=e.callbacks;return i!=null&&i.length?(n?n[0]+=e:n=[e],Promise.all(i.map(a=>a({phase:t,buffer:n,context:s}))).then(a=>Promise.all(a.filter(Boolean).map(c=>Ln(c,t,!1,s,n))).then(()=>n[0]))):Promise.resolve(e)},Di="text/plain; charset=UTF-8",Pt=(e,t)=>({"Content-Type":e,...t}),$e,et,ae,je,le,J,tt,Be,Me,xe,rt,st,pe,Oe,bn,qi=(bn=class{constructor(e,t){B(this,pe);B(this,$e);B(this,et);O(this,"env",{});B(this,ae);O(this,"finalized",!1);O(this,"error");B(this,je);B(this,le);B(this,J);B(this,tt);B(this,Be);B(this,Me);B(this,xe);B(this,rt);B(this,st);O(this,"render",(...e)=>(T(this,Be)??k(this,Be,t=>this.html(t)),T(this,Be).call(this,...e)));O(this,"setLayout",e=>k(this,tt,e));O(this,"getLayout",()=>T(this,tt));O(this,"setRenderer",e=>{k(this,Be,e)});O(this,"header",(e,t,r)=>{this.finalized&&k(this,J,new Response(T(this,J).body,T(this,J)));const s=T(this,J)?T(this,J).headers:T(this,xe)??k(this,xe,new Headers);t===void 0?s.delete(e):r!=null&&r.append?s.append(e,t):s.set(e,t)});O(this,"status",e=>{k(this,je,e)});O(this,"set",(e,t)=>{T(this,ae)??k(this,ae,new Map),T(this,ae).set(e,t)});O(this,"get",e=>T(this,ae)?T(this,ae).get(e):void 0);O(this,"newResponse",(...e)=>H(this,pe,Oe).call(this,...e));O(this,"body",(e,t,r)=>H(this,pe,Oe).call(this,e,t,r));O(this,"text",(e,t,r)=>!T(this,xe)&&!T(this,je)&&!t&&!r&&!this.finalized?new Response(e):H(this,pe,Oe).call(this,e,t,Pt(Di,r)));O(this,"json",(e,t,r)=>H(this,pe,Oe).call(this,JSON.stringify(e),t,Pt("application/json",r)));O(this,"html",(e,t,r)=>{const s=n=>H(this,pe,Oe).call(this,n,t,Pt("text/html; charset=UTF-8",r));return typeof e=="object"?Ln(e,Ni.Stringify,!1,{}).then(s):s(e)});O(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});O(this,"notFound",()=>(T(this,Me)??k(this,Me,()=>new Response),T(this,Me).call(this,this)));k(this,$e,e),t&&(k(this,le,t.executionCtx),this.env=t.env,k(this,Me,t.notFoundHandler),k(this,st,t.path),k(this,rt,t.matchResult))}get req(){return T(this,et)??k(this,et,new qn(T(this,$e),T(this,st),T(this,rt))),T(this,et)}get event(){if(T(this,le)&&"respondWith"in T(this,le))return T(this,le);throw Error("This context has no FetchEvent")}get executionCtx(){if(T(this,le))return T(this,le);throw Error("This context has no ExecutionContext")}get res(){return T(this,J)||k(this,J,new Response(null,{headers:T(this,xe)??k(this,xe,new Headers)}))}set res(e){if(T(this,J)&&e){e=new Response(e.body,e);for(const[t,r]of T(this,J).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const s=T(this,J).headers.getSetCookie();e.headers.delete("set-cookie");for(const n of s)e.headers.append("set-cookie",n)}else e.headers.set(t,r)}k(this,J,e),this.finalized=!0}get var(){return T(this,ae)?Object.fromEntries(T(this,ae)):{}}},$e=new WeakMap,et=new WeakMap,ae=new WeakMap,je=new WeakMap,le=new WeakMap,J=new WeakMap,tt=new WeakMap,Be=new WeakMap,Me=new WeakMap,xe=new WeakMap,rt=new WeakMap,st=new WeakMap,pe=new WeakSet,Oe=function(e,t,r){const s=T(this,J)?new Headers(T(this,J).headers):T(this,xe)??new Headers;if(typeof t=="object"&&"headers"in t){const i=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[o,a]of i)o.toLowerCase()==="set-cookie"?s.append(o,a):s.set(o,a)}if(r)for(const[i,o]of Object.entries(r))if(typeof o=="string")s.set(i,o);else{s.delete(i);for(const a of o)s.append(i,a)}const n=typeof t=="number"?t:(t==null?void 0:t.status)??T(this,je);return new Response(e,{status:n,headers:s})},bn),z="ALL",Oi="all",ki=["get","post","put","delete","options","patch"],jn="Can not add a route since the matcher is already built.",Bn=class extends Error{},Li="__COMPOSED_HANDLER",ji=e=>e.text("404 Not Found",404),Jr=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},ee,Q,Un,te,ve,dt,ft,yn,Mn=(yn=class{constructor(t={}){B(this,Q);O(this,"get");O(this,"post");O(this,"put");O(this,"delete");O(this,"options");O(this,"patch");O(this,"all");O(this,"on");O(this,"use");O(this,"router");O(this,"getPath");O(this,"_basePath","/");B(this,ee,"/");O(this,"routes",[]);B(this,te,ji);O(this,"errorHandler",Jr);O(this,"onError",t=>(this.errorHandler=t,this));O(this,"notFound",t=>(k(this,te,t),this));O(this,"fetch",(t,...r)=>H(this,Q,ft).call(this,t,r[1],r[0],t.method));O(this,"request",(t,r,s,n)=>t instanceof Request?this.fetch(r?new Request(t,r):t,s,n):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${qe("/",t)}`,r),s,n)));O(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(H(this,Q,ft).call(this,t.request,t,void 0,t.request.method))})});[...ki,Oi].forEach(i=>{this[i]=(o,...a)=>(typeof o=="string"?k(this,ee,o):H(this,Q,ve).call(this,i,T(this,ee),o),a.forEach(c=>{H(this,Q,ve).call(this,i,T(this,ee),c)}),this)}),this.on=(i,o,...a)=>{for(const c of[o].flat()){k(this,ee,c);for(const u of[i].flat())a.map(l=>{H(this,Q,ve).call(this,u.toUpperCase(),T(this,ee),l)})}return this},this.use=(i,...o)=>(typeof i=="string"?k(this,ee,i):(k(this,ee,"*"),o.unshift(i)),o.forEach(a=>{H(this,Q,ve).call(this,z,T(this,ee),a)}),this);const{strict:s,...n}=t;Object.assign(this,n),this.getPath=s??!0?t.getPath??In:Ti}route(t,r){const s=this.basePath(t);return r.routes.map(n=>{var o;let i;r.errorHandler===Jr?i=n.handler:(i=async(a,c)=>(await Wr([],r.errorHandler)(a,()=>n.handler(a,c))).res,i[Li]=n.handler),H(o=s,Q,ve).call(o,n.method,n.path,i)}),this}basePath(t){const r=H(this,Q,Un).call(this);return r._basePath=qe(this._basePath,t),r}mount(t,r,s){let n,i;s&&(typeof s=="function"?i=s:(i=s.optionHandler,s.replaceRequest===!1?n=c=>c:n=s.replaceRequest));const o=i?c=>{const u=i(c);return Array.isArray(u)?u:[u]}:c=>{let u;try{u=c.executionCtx}catch{}return[c.env,u]};n||(n=(()=>{const c=qe(this._basePath,t),u=c==="/"?0:c.length;return l=>{const f=new URL(l.url);return f.pathname=f.pathname.slice(u)||"/",new Request(f,l)}})());const a=async(c,u)=>{const l=await r(n(c.req.raw),...o(c));if(l)return l;await u()};return H(this,Q,ve).call(this,z,qe(t,"*"),a),this}},ee=new WeakMap,Q=new WeakSet,Un=function(){const t=new Mn({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,k(t,te,T(this,te)),t.routes=this.routes,t},te=new WeakMap,ve=function(t,r,s){t=t.toUpperCase(),r=qe(this._basePath,r);const n={basePath:this._basePath,path:r,method:t,handler:s};this.router.add(t,r,[s,n]),this.routes.push(n)},dt=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},ft=function(t,r,s,n){if(n==="HEAD")return(async()=>new Response(null,await H(this,Q,ft).call(this,t,r,s,"GET")))();const i=this.getPath(t,{env:s}),o=this.router.match(n,i),a=new qi(t,{path:i,matchResult:o,env:s,executionCtx:r,notFoundHandler:T(this,te)});if(o[0].length===1){let u;try{u=o[0][0][0][0](a,async()=>{a.res=await T(this,te).call(this,a)})}catch(l){return H(this,Q,dt).call(this,l,a)}return u instanceof Promise?u.then(l=>l||(a.finalized?a.res:T(this,te).call(this,a))).catch(l=>H(this,Q,dt).call(this,l,a)):u??T(this,te).call(this,a)}const c=Wr(o[0],this.errorHandler,T(this,te));return(async()=>{try{const u=await c(a);if(!u.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return u.res}catch(u){return H(this,Q,dt).call(this,u,a)}})()},yn),Hn=[];function Bi(e,t){const r=this.buildAllMatchers(),s=(n,i)=>{const o=r[n]||r[z],a=o[2][i];if(a)return a;const c=i.match(o[0]);if(!c)return[[],Hn];const u=c.indexOf("",1);return[o[1][u],c]};return this.match=s,s(e,t)}var pt="[^/]+",Ye=".*",Ke="(?:|/.*)",ke=Symbol(),Mi=new Set(".\\+*[^]$()");function Ui(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===Ye||e===Ke?1:t===Ye||t===Ke?-1:e===pt?1:t===pt?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var Ee,Se,re,vn,qr=(vn=class{constructor(){B(this,Ee);B(this,Se);B(this,re,Object.create(null))}insert(t,r,s,n,i){if(t.length===0){if(T(this,Ee)!==void 0)throw ke;if(i)return;k(this,Ee,r);return}const[o,...a]=t,c=o==="*"?a.length===0?["","",Ye]:["","",pt]:o==="/*"?["","",Ke]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let u;if(c){const l=c[1];let f=c[2]||pt;if(l&&c[2]&&(f===".*"||(f=f.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(f))))throw ke;if(u=T(this,re)[f],!u){if(Object.keys(T(this,re)).some(d=>d!==Ye&&d!==Ke))throw ke;if(i)return;u=T(this,re)[f]=new qr,l!==""&&k(u,Se,n.varIndex++)}!i&&l!==""&&s.push([l,T(u,Se)])}else if(u=T(this,re)[o],!u){if(Object.keys(T(this,re)).some(l=>l.length>1&&l!==Ye&&l!==Ke))throw ke;if(i)return;u=T(this,re)[o]=new qr}u.insert(a,r,s,n,i)}buildRegExpStr(){const r=Object.keys(T(this,re)).sort(Ui).map(s=>{const n=T(this,re)[s];return(typeof T(n,Se)=="number"?`(${s})@${T(n,Se)}`:Mi.has(s)?`\\${s}`:s)+n.buildRegExpStr()});return typeof T(this,Ee)=="number"&&r.unshift(`#${T(this,Ee)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},Ee=new WeakMap,Se=new WeakMap,re=new WeakMap,vn),gt,nt,wn,Hi=(wn=class{constructor(){B(this,gt,{varIndex:0});B(this,nt,new qr)}insert(e,t,r){const s=[],n=[];for(let o=0;;){let a=!1;if(e=e.replace(/\{[^}]+\}/g,c=>{const u=`@\\${o}`;return n[o]=[u,c],o++,a=!0,u}),!a)break}const i=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let o=n.length-1;o>=0;o--){const[a]=n[o];for(let c=i.length-1;c>=0;c--)if(i[c].indexOf(a)!==-1){i[c]=i[c].replace(a,n[o][1]);break}}return T(this,nt).insert(i,t,s,T(this,gt),r),s}buildRegExp(){let e=T(this,nt).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],s=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(n,i,o)=>i!==void 0?(r[++t]=Number(i),"$()"):(o!==void 0&&(s[Number(o)]=++t),"")),[new RegExp(`^${e}`),r,s]}},gt=new WeakMap,nt=new WeakMap,wn),Fi=[/^$/,[],Object.create(null)],ht=Object.create(null);function Fn(e){return ht[e]??(ht[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function zi(){ht=Object.create(null)}function Qi(e){var u;const t=new Hi,r=[];if(e.length===0)return Fi;const s=e.map(l=>[!/\*|\/:/.test(l[0]),...l]).sort(([l,f],[d,h])=>l?1:d?-1:f.length-h.length),n=Object.create(null);for(let l=0,f=-1,d=s.length;l<d;l++){const[h,m,b]=s[l];h?n[m]=[b.map(([p])=>[p,Object.create(null)]),Hn]:f++;let v;try{v=t.insert(m,f,h)}catch(p){throw p===ke?new Bn(m):p}h||(r[f]=b.map(([p,y])=>{const E=Object.create(null);for(y-=1;y>=0;y--){const[A,N]=v[y];E[A]=N}return[p,E]}))}const[i,o,a]=t.buildRegExp();for(let l=0,f=r.length;l<f;l++)for(let d=0,h=r[l].length;d<h;d++){const m=(u=r[l][d])==null?void 0:u[1];if(!m)continue;const b=Object.keys(m);for(let v=0,p=b.length;v<p;v++)m[b[v]]=a[m[b[v]]]}const c=[];for(const l in o)c[l]=r[o[l]];return[i,c,n]}function Ie(e,t){if(e){for(const r of Object.keys(e).sort((s,n)=>n.length-s.length))if(Fn(r).test(t))return[...e[r]]}}var me,ge,bt,zn,xn,Vi=(xn=class{constructor(){B(this,bt);O(this,"name","RegExpRouter");B(this,me);B(this,ge);O(this,"match",Bi);k(this,me,{[z]:Object.create(null)}),k(this,ge,{[z]:Object.create(null)})}add(e,t,r){var a;const s=T(this,me),n=T(this,ge);if(!s||!n)throw new Error(jn);s[e]||[s,n].forEach(c=>{c[e]=Object.create(null),Object.keys(c[z]).forEach(u=>{c[e][u]=[...c[z][u]]})}),t==="/*"&&(t="*");const i=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const c=Fn(t);e===z?Object.keys(s).forEach(u=>{var l;(l=s[u])[t]||(l[t]=Ie(s[u],t)||Ie(s[z],t)||[])}):(a=s[e])[t]||(a[t]=Ie(s[e],t)||Ie(s[z],t)||[]),Object.keys(s).forEach(u=>{(e===z||e===u)&&Object.keys(s[u]).forEach(l=>{c.test(l)&&s[u][l].push([r,i])})}),Object.keys(n).forEach(u=>{(e===z||e===u)&&Object.keys(n[u]).forEach(l=>c.test(l)&&n[u][l].push([r,i]))});return}const o=Nn(t)||[t];for(let c=0,u=o.length;c<u;c++){const l=o[c];Object.keys(n).forEach(f=>{var d;(e===z||e===f)&&((d=n[f])[l]||(d[l]=[...Ie(s[f],l)||Ie(s[z],l)||[]]),n[f][l].push([r,i-u+c+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(T(this,ge)).concat(Object.keys(T(this,me))).forEach(t=>{e[t]||(e[t]=H(this,bt,zn).call(this,t))}),k(this,me,k(this,ge,void 0)),zi(),e}},me=new WeakMap,ge=new WeakMap,bt=new WeakSet,zn=function(e){const t=[];let r=e===z;return[T(this,me),T(this,ge)].forEach(s=>{const n=s[e]?Object.keys(s[e]).map(i=>[i,s[e][i]]):[];n.length!==0?(r||(r=!0),t.push(...n)):e!==z&&t.push(...Object.keys(s[z]).map(i=>[i,s[z][i]]))}),r?Qi(t):null},xn),be,ce,En,Xi=(En=class{constructor(e){O(this,"name","SmartRouter");B(this,be,[]);B(this,ce,[]);k(this,be,e.routers)}add(e,t,r){if(!T(this,ce))throw new Error(jn);T(this,ce).push([e,t,r])}match(e,t){if(!T(this,ce))throw new Error("Fatal error");const r=T(this,be),s=T(this,ce),n=r.length;let i=0,o;for(;i<n;i++){const a=r[i];try{for(let c=0,u=s.length;c<u;c++)a.add(...s[c]);o=a.match(e,t)}catch(c){if(c instanceof Bn)continue;throw c}this.match=a.match.bind(a),k(this,be,[a]),k(this,ce,void 0);break}if(i===n)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(T(this,ce)||T(this,be).length!==1)throw new Error("No active router has been determined yet.");return T(this,be)[0]}},be=new WeakMap,ce=new WeakMap,En),ze=Object.create(null),ye,W,Ae,Ue,X,ue,we,Sn,Qn=(Sn=class{constructor(e,t,r){B(this,ue);B(this,ye);B(this,W);B(this,Ae);B(this,Ue,0);B(this,X,ze);if(k(this,W,r||Object.create(null)),k(this,ye,[]),e&&t){const s=Object.create(null);s[e]={handler:t,possibleKeys:[],score:0},k(this,ye,[s])}k(this,Ae,[])}insert(e,t,r){k(this,Ue,++Xr(this,Ue)._);let s=this;const n=Si(t),i=[];for(let o=0,a=n.length;o<a;o++){const c=n[o],u=n[o+1],l=Ci(c,u),f=Array.isArray(l)?l[0]:c;if(f in T(s,W)){s=T(s,W)[f],l&&i.push(l[1]);continue}T(s,W)[f]=new Qn,l&&(T(s,Ae).push(l),i.push(l[1])),s=T(s,W)[f]}return T(s,ye).push({[e]:{handler:r,possibleKeys:i.filter((o,a,c)=>c.indexOf(o)===a),score:T(this,Ue)}}),s}search(e,t){var a;const r=[];k(this,X,ze);let n=[this];const i=Rn(t),o=[];for(let c=0,u=i.length;c<u;c++){const l=i[c],f=c===u-1,d=[];for(let h=0,m=n.length;h<m;h++){const b=n[h],v=T(b,W)[l];v&&(k(v,X,T(b,X)),f?(T(v,W)["*"]&&r.push(...H(this,ue,we).call(this,T(v,W)["*"],e,T(b,X))),r.push(...H(this,ue,we).call(this,v,e,T(b,X)))):d.push(v));for(let p=0,y=T(b,Ae).length;p<y;p++){const E=T(b,Ae)[p],A=T(b,X)===ze?{}:{...T(b,X)};if(E==="*"){const _=T(b,W)["*"];_&&(r.push(...H(this,ue,we).call(this,_,e,T(b,X))),k(_,X,A),d.push(_));continue}const[N,C,g]=E;if(!l&&!(g instanceof RegExp))continue;const x=T(b,W)[N],w=i.slice(c).join("/");if(g instanceof RegExp){const _=g.exec(w);if(_){if(A[C]=_[0],r.push(...H(this,ue,we).call(this,x,e,T(b,X),A)),Object.keys(T(x,W)).length){k(x,X,A);const P=((a=_[0].match(/\//))==null?void 0:a.length)??0;(o[P]||(o[P]=[])).push(x)}continue}}(g===!0||g.test(l))&&(A[C]=l,f?(r.push(...H(this,ue,we).call(this,x,e,A,T(b,X))),T(x,W)["*"]&&r.push(...H(this,ue,we).call(this,T(x,W)["*"],e,A,T(b,X)))):(k(x,X,A),d.push(x)))}}n=d.concat(o.shift()??[])}return r.length>1&&r.sort((c,u)=>c.score-u.score),[r.map(({handler:c,params:u})=>[c,u])]}},ye=new WeakMap,W=new WeakMap,Ae=new WeakMap,Ue=new WeakMap,X=new WeakMap,ue=new WeakSet,we=function(e,t,r,s){const n=[];for(let i=0,o=T(e,ye).length;i<o;i++){const a=T(e,ye)[i],c=a[t]||a[z],u={};if(c!==void 0&&(c.params=Object.create(null),n.push(c),r!==ze||s&&s!==ze))for(let l=0,f=c.possibleKeys.length;l<f;l++){const d=c.possibleKeys[l],h=u[c.score];c.params[d]=s!=null&&s[d]&&!h?s[d]:r[d]??(s==null?void 0:s[d]),u[c.score]=!0}}return n},Sn),_e,An,Wi=(An=class{constructor(){O(this,"name","TrieRouter");B(this,_e);k(this,_e,new Qn)}add(e,t,r){const s=Nn(t);if(s){for(let n=0,i=s.length;n<i;n++)T(this,_e).insert(e,s[n],r);return}T(this,_e).insert(e,t,r)}match(e,t){return T(this,_e).search(e,t)}},_e=new WeakMap,An),Vn=class extends Mn{constructor(e={}){super(e),this.router=e.router??new Xi({routers:[new Vi,new Wi]})}},Gi=e=>{const r={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},s=(i=>typeof i=="string"?i==="*"?()=>i:o=>i===o?o:null:typeof i=="function"?i:o=>i.includes(o)?o:null)(r.origin),n=(i=>typeof i=="function"?i:Array.isArray(i)?()=>i:()=>[])(r.allowMethods);return async function(o,a){var l;function c(f,d){o.res.headers.set(f,d)}const u=await s(o.req.header("origin")||"",o);if(u&&c("Access-Control-Allow-Origin",u),r.origin!=="*"){const f=o.req.header("Vary");f?c("Vary",f):c("Vary","Origin")}if(r.credentials&&c("Access-Control-Allow-Credentials","true"),(l=r.exposeHeaders)!=null&&l.length&&c("Access-Control-Expose-Headers",r.exposeHeaders.join(",")),o.req.method==="OPTIONS"){r.maxAge!=null&&c("Access-Control-Max-Age",r.maxAge.toString());const f=await n(o.req.header("origin")||"",o);f.length&&c("Access-Control-Allow-Methods",f.join(","));let d=r.allowHeaders;if(!(d!=null&&d.length)){const h=o.req.header("Access-Control-Request-Headers");h&&(d=h.split(/\s*,\s*/))}return d!=null&&d.length&&(c("Access-Control-Allow-Headers",d.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await a()}},Ji=/^[\w!#$%&'*.^`|~+-]+$/,Yi=/^[ !#-:<-[\]-~]*$/,Yr=(e,t)=>{if(t&&e.indexOf(t)===-1)return{};const r=e.trim().split(";"),s={};for(let n of r){n=n.trim();const i=n.indexOf("=");if(i===-1)continue;const o=n.substring(0,i).trim();if(t&&t!==o||!Ji.test(o))continue;let a=n.substring(i+1).trim();if(a.startsWith('"')&&a.endsWith('"')&&(a=a.slice(1,-1)),Yi.test(a)&&(s[o]=a.indexOf("%")!==-1?yt(a,kr):a,t))break}return s},Ki=(e,t,r={})=>{let s=`${e}=${t}`;if(e.startsWith("__Secure-")&&!r.secure)throw new Error("__Secure- Cookie must have Secure attributes");if(e.startsWith("__Host-")){if(!r.secure)throw new Error("__Host- Cookie must have Secure attributes");if(r.path!=="/")throw new Error('__Host- Cookie must have Path attributes with "/"');if(r.domain)throw new Error("__Host- Cookie must not have Domain attributes")}if(r&&typeof r.maxAge=="number"&&r.maxAge>=0){if(r.maxAge>3456e4)throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");s+=`; Max-Age=${r.maxAge|0}`}if(r.domain&&r.prefix!=="host"&&(s+=`; Domain=${r.domain}`),r.path&&(s+=`; Path=${r.path}`),r.expires){if(r.expires.getTime()-Date.now()>3456e7)throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");s+=`; Expires=${r.expires.toUTCString()}`}if(r.httpOnly&&(s+="; HttpOnly"),r.secure&&(s+="; Secure"),r.sameSite&&(s+=`; SameSite=${r.sameSite.charAt(0).toUpperCase()+r.sameSite.slice(1)}`),r.priority&&(s+=`; Priority=${r.priority.charAt(0).toUpperCase()+r.priority.slice(1)}`),r.partitioned){if(!r.secure)throw new Error("Partitioned Cookie must have Secure attributes");s+="; Partitioned"}return s},Tt=(e,t,r)=>(t=encodeURIComponent(t),Ki(e,t,r)),G=(e,t,r)=>{const s=e.req.raw.headers.get("Cookie");if(typeof t=="string"){if(!s)return;let i=t;return Yr(s,i)[i]}return s?Yr(s):{}},Zi=(e,t,r)=>{let s;return(r==null?void 0:r.prefix)==="secure"?s=Tt("__Secure-"+e,t,{path:"/",...r,secure:!0}):(r==null?void 0:r.prefix)==="host"?s=Tt("__Host-"+e,t,{...r,path:"/",secure:!0,domain:void 0}):s=Tt(e,t,{path:"/",...r}),s},se=(e,t,r,s)=>{const n=Zi(t,r,s);e.header("Set-Cookie",n,{append:!0})},mt=(e,t,r)=>{const s=G(e,t);return se(e,t,"",{...r,maxAge:0}),s};class $i{constructor(t,r){O(this,"supabaseUrl");O(this,"supabaseKey");this.supabaseUrl=t,this.supabaseKey=r}async query(t,r={},s){const{select:n="*",filters:i={},order:o,limit:a,single:c=!1}=r;let u=`${this.supabaseUrl}/rest/v1/${t}?select=${n}`;Object.entries(i).forEach(([d,h])=>{u+=`&${d}=eq.${h}`}),o&&(u+=`&order=${o}`),a&&(u+=`&limit=${a}`);const l={apikey:this.supabaseKey,"Content-Type":"application/json"};s&&(l.Authorization=`Bearer ${s}`),c&&(l.Accept="application/vnd.pgrst.object+json");const f=await fetch(u,{headers:l});if(!f.ok)throw new Error(`Supabase query failed: ${f.statusText}`);return await f.json()}async insert(t,r,s){const n=`${this.supabaseUrl}/rest/v1/${t}`,i={apikey:this.supabaseKey,"Content-Type":"application/json",Prefer:"return=representation"};s&&(i.Authorization=`Bearer ${s}`);const o=await fetch(n,{method:"POST",headers:i,body:JSON.stringify(r)});if(!o.ok){const a=await o.text();throw console.error(`Supabase insert failed for table ${t}:`,{status:o.status,statusText:o.statusText,error:a,data:r}),new Error(`Supabase insert failed (${o.status}): ${a}`)}return await o.json()}async update(t,r,s,n){let i=`${this.supabaseUrl}/rest/v1/${t}?`;Object.entries(r).forEach(([c,u])=>{i+=`${c}=eq.${u}&`});const o={apikey:this.supabaseKey,"Content-Type":"application/json",Prefer:"return=representation"};n&&(o.Authorization=`Bearer ${n}`);const a=await fetch(i,{method:"PATCH",headers:o,body:JSON.stringify(s)});if(!a.ok){const c=await a.text();throw new Error(`Supabase update failed: ${c}`)}return await a.json()}async delete(t,r,s){let n=`${this.supabaseUrl}/rest/v1/${t}?`;Object.entries(r).forEach(([a,c])=>{n+=`${a}=eq.${c}&`});const i={apikey:this.supabaseKey,"Content-Type":"application/json"};s&&(i.Authorization=`Bearer ${s}`);const o=await fetch(n,{method:"DELETE",headers:i});if(!o.ok){const a=await o.text();throw new Error(`Supabase delete failed: ${a}`)}return!0}async rpc(t,r={},s){const n=`${this.supabaseUrl}/rest/v1/rpc/${t}`,i={apikey:this.supabaseKey,"Content-Type":"application/json"};s&&(i.Authorization=`Bearer ${s}`);const o=await fetch(n,{method:"POST",headers:i,body:JSON.stringify(r)});if(!o.ok){const a=await o.text();throw new Error(`Supabase RPC failed: ${a}`)}return await o.json()}}const Qe=new Map;class Lr{constructor(t){O(this,"connectionString");this.connectionString=t.replace("postgresql+psycopg2://","postgresql://").replace("postgres+psycopg2://","postgresql://")}async getPool(){if(Qe.has(this.connectionString))return Qe.get(this.connectionString);const t=await Promise.resolve().then(()=>aa),{Pool:r}=t.default||t;let s=this.connectionString;s.includes("connect_timeout")||(s+=(s.includes("?")?"&":"?")+"connect_timeout=5");const n=new r({connectionString:s,ssl:!1,max:5,idleTimeoutMillis:3e4,connectionTimeoutMillis:5e3});return n.on("error",i=>{console.error("❌ PostgreSQL pool error:",i.message)}),Qe.set(this.connectionString,n),n}async query(t,r={}){const{select:s="*",filters:n={},order:i,limit:o,single:a=!1}=r,c=await this.getPool(),u=[],l=[];let f=1;for(const[p,y]of Object.entries(n))u.push(`"${p}" = $${f}`),l.push(y),f++;let d="";i&&(d="ORDER BY "+i.replace(/\.desc$/i," DESC").replace(/\.asc$/i," ASC").replace(/,([^,]+)\.desc/gi,", $1 DESC").replace(/,([^,]+)\.asc/gi,", $1 ASC"));const h=u.length>0?`WHERE ${u.join(" AND ")}`:"",m=o||a?`LIMIT ${a?1:o}`:"",b=`SELECT ${s} FROM "${t}" ${h} ${d} ${m}`.trim(),v=await c.query(b,l);return a?v.rows[0]||null:v.rows}async insert(t,r){const s=await this.getPool(),n=Object.keys(r).filter(u=>r[u]!==void 0),i=n.map(u=>r[u]),o=n.map((u,l)=>`$${l+1}`),a=`
      INSERT INTO "${t}" (${n.map(u=>`"${u}"`).join(", ")})
      VALUES (${o.join(", ")})
      RETURNING *
    `;return(await s.query(a,i)).rows}async update(t,r,s){const n=await this.getPool(),i=Object.keys(s).filter(h=>s[h]!==void 0),o=[];let a=1;const c=i.map(h=>(o.push(s[h]),`"${h}" = $${a++}`)),u=[];for(const[h,m]of Object.entries(r))u.push(`"${h}" = $${a}`),o.push(m),a++;const l=u.length>0?`WHERE ${u.join(" AND ")}`:"",f=`UPDATE "${t}" SET ${c.join(", ")} ${l} RETURNING *`;return(await n.query(f,o)).rows}async delete(t,r){const s=await this.getPool(),n=[],i=[];let o=1;for(const[u,l]of Object.entries(r))n.push(`"${u}" = $${o}`),i.push(l),o++;const a=n.length>0?`WHERE ${n.join(" AND ")}`:"",c=`DELETE FROM "${t}" ${a}`;return await s.query(c,i),!0}async sql(t,r=[]){return(await(await this.getPool()).query(t,r)).rows}async rpc(t,r={}){const s=await this.getPool(),n=Object.keys(r),i=n.map(u=>r[u]),o=n.map((u,l)=>`${u} => $${l+1}`).join(", "),a=`SELECT * FROM ${t}(${o})`,c=await s.query(a,i);if(c.rows.length===1){const u=c.rows[0],l=Object.keys(u);return l.length===1?u[l[0]]:u}return c.rows}async end(){const t=Qe.get(this.connectionString);t&&(await t.end(),Qe.delete(this.connectionString))}}const Kr="data:image/png;base64,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";var jr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Xn(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function eo(e){if(Object.prototype.hasOwnProperty.call(e,"__esModule"))return e;var t=e.default;if(typeof t=="function"){var r=function s(){return this instanceof s?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};r.prototype=t.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(e).forEach(function(s){var n=Object.getOwnPropertyDescriptor(e,s);Object.defineProperty(r,s,n.get?n:{enumerable:!0,get:function(){return e[s]}})}),r}var Ne={},Rt,Zr;function to(){return Zr||(Zr=1,Rt=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),Rt}var It={},fe={},$r;function Ce(){if($r)return fe;$r=1;let e;const t=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return fe.getSymbolSize=function(s){if(!s)throw new Error('"version" cannot be null or undefined');if(s<1||s>40)throw new Error('"version" should be in range from 1 to 40');return s*4+17},fe.getSymbolTotalCodewords=function(s){return t[s]},fe.getBCHDigit=function(r){let s=0;for(;r!==0;)s++,r>>>=1;return s},fe.setToSJISFunction=function(s){if(typeof s!="function")throw new Error('"toSJISFunc" is not a valid function.');e=s},fe.isKanjiModeEnabled=function(){return typeof e<"u"},fe.toSJIS=function(s){return e(s)},fe}var Nt={},es;function Br(){return es||(es=1,(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(r){if(typeof r!="string")throw new Error("Param is not a string");switch(r.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+r)}}e.isValid=function(s){return s&&typeof s.bit<"u"&&s.bit>=0&&s.bit<4},e.from=function(s,n){if(e.isValid(s))return s;try{return t(s)}catch{return n}}})(Nt)),Nt}var Dt,ts;function ro(){if(ts)return Dt;ts=1;function e(){this.buffer=[],this.length=0}return e.prototype={get:function(t){const r=Math.floor(t/8);return(this.buffer[r]>>>7-t%8&1)===1},put:function(t,r){for(let s=0;s<r;s++)this.putBit((t>>>r-s-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(t){const r=Math.floor(this.length/8);this.buffer.length<=r&&this.buffer.push(0),t&&(this.buffer[r]|=128>>>this.length%8),this.length++}},Dt=e,Dt}var qt,rs;function so(){if(rs)return qt;rs=1;function e(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}return e.prototype.set=function(t,r,s,n){const i=t*this.size+r;this.data[i]=s,n&&(this.reservedBit[i]=!0)},e.prototype.get=function(t,r){return this.data[t*this.size+r]},e.prototype.xor=function(t,r,s){this.data[t*this.size+r]^=s},e.prototype.isReserved=function(t,r){return this.reservedBit[t*this.size+r]},qt=e,qt}var Ot={},ss;function no(){return ss||(ss=1,(function(e){const t=Ce().getSymbolSize;e.getRowColCoords=function(s){if(s===1)return[];const n=Math.floor(s/7)+2,i=t(s),o=i===145?26:Math.ceil((i-13)/(2*n-2))*2,a=[i-7];for(let c=1;c<n-1;c++)a[c]=a[c-1]-o;return a.push(6),a.reverse()},e.getPositions=function(s){const n=[],i=e.getRowColCoords(s),o=i.length;for(let a=0;a<o;a++)for(let c=0;c<o;c++)a===0&&c===0||a===0&&c===o-1||a===o-1&&c===0||n.push([i[a],i[c]]);return n}})(Ot)),Ot}var kt={},ns;function io(){if(ns)return kt;ns=1;const e=Ce().getSymbolSize,t=7;return kt.getPositions=function(s){const n=e(s);return[[0,0],[n-t,0],[0,n-t]]},kt}var Lt={},is;function oo(){return is||(is=1,(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(n){return n!=null&&n!==""&&!isNaN(n)&&n>=0&&n<=7},e.from=function(n){return e.isValid(n)?parseInt(n,10):void 0},e.getPenaltyN1=function(n){const i=n.size;let o=0,a=0,c=0,u=null,l=null;for(let f=0;f<i;f++){a=c=0,u=l=null;for(let d=0;d<i;d++){let h=n.get(f,d);h===u?a++:(a>=5&&(o+=t.N1+(a-5)),u=h,a=1),h=n.get(d,f),h===l?c++:(c>=5&&(o+=t.N1+(c-5)),l=h,c=1)}a>=5&&(o+=t.N1+(a-5)),c>=5&&(o+=t.N1+(c-5))}return o},e.getPenaltyN2=function(n){const i=n.size;let o=0;for(let a=0;a<i-1;a++)for(let c=0;c<i-1;c++){const u=n.get(a,c)+n.get(a,c+1)+n.get(a+1,c)+n.get(a+1,c+1);(u===4||u===0)&&o++}return o*t.N2},e.getPenaltyN3=function(n){const i=n.size;let o=0,a=0,c=0;for(let u=0;u<i;u++){a=c=0;for(let l=0;l<i;l++)a=a<<1&2047|n.get(u,l),l>=10&&(a===1488||a===93)&&o++,c=c<<1&2047|n.get(l,u),l>=10&&(c===1488||c===93)&&o++}return o*t.N3},e.getPenaltyN4=function(n){let i=0;const o=n.data.length;for(let c=0;c<o;c++)i+=n.data[c];return Math.abs(Math.ceil(i*100/o/5)-10)*t.N4};function r(s,n,i){switch(s){case e.Patterns.PATTERN000:return(n+i)%2===0;case e.Patterns.PATTERN001:return n%2===0;case e.Patterns.PATTERN010:return i%3===0;case e.Patterns.PATTERN011:return(n+i)%3===0;case e.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(i/3))%2===0;case e.Patterns.PATTERN101:return n*i%2+n*i%3===0;case e.Patterns.PATTERN110:return(n*i%2+n*i%3)%2===0;case e.Patterns.PATTERN111:return(n*i%3+(n+i)%2)%2===0;default:throw new Error("bad maskPattern:"+s)}}e.applyMask=function(n,i){const o=i.size;for(let a=0;a<o;a++)for(let c=0;c<o;c++)i.isReserved(c,a)||i.xor(c,a,r(n,c,a))},e.getBestMask=function(n,i){const o=Object.keys(e.Patterns).length;let a=0,c=1/0;for(let u=0;u<o;u++){i(u),e.applyMask(u,n);const l=e.getPenaltyN1(n)+e.getPenaltyN2(n)+e.getPenaltyN3(n)+e.getPenaltyN4(n);e.applyMask(u,n),l<c&&(c=l,a=u)}return a}})(Lt)),Lt}var at={},os;function Wn(){if(os)return at;os=1;const e=Br(),t=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],r=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return at.getBlocksCount=function(n,i){switch(i){case e.L:return t[(n-1)*4+0];case e.M:return t[(n-1)*4+1];case e.Q:return t[(n-1)*4+2];case e.H:return t[(n-1)*4+3];default:return}},at.getTotalCodewordsCount=function(n,i){switch(i){case e.L:return r[(n-1)*4+0];case e.M:return r[(n-1)*4+1];case e.Q:return r[(n-1)*4+2];case e.H:return r[(n-1)*4+3];default:return}},at}var jt={},Ve={},as;function ao(){if(as)return Ve;as=1;const e=new Uint8Array(512),t=new Uint8Array(256);return(function(){let s=1;for(let n=0;n<255;n++)e[n]=s,t[s]=n,s<<=1,s&256&&(s^=285);for(let n=255;n<512;n++)e[n]=e[n-255]})(),Ve.log=function(s){if(s<1)throw new Error("log("+s+")");return t[s]},Ve.exp=function(s){return e[s]},Ve.mul=function(s,n){return s===0||n===0?0:e[t[s]+t[n]]},Ve}var ls;function lo(){return ls||(ls=1,(function(e){const t=ao();e.mul=function(s,n){const i=new Uint8Array(s.length+n.length-1);for(let o=0;o<s.length;o++)for(let a=0;a<n.length;a++)i[o+a]^=t.mul(s[o],n[a]);return i},e.mod=function(s,n){let i=new Uint8Array(s);for(;i.length-n.length>=0;){const o=i[0];for(let c=0;c<n.length;c++)i[c]^=t.mul(n[c],o);let a=0;for(;a<i.length&&i[a]===0;)a++;i=i.slice(a)}return i},e.generateECPolynomial=function(s){let n=new Uint8Array([1]);for(let i=0;i<s;i++)n=e.mul(n,new Uint8Array([1,t.exp(i)]));return n}})(jt)),jt}var Bt,cs;function co(){if(cs)return Bt;cs=1;const e=lo();function t(r){this.genPoly=void 0,this.degree=r,this.degree&&this.initialize(this.degree)}return t.prototype.initialize=function(s){this.degree=s,this.genPoly=e.generateECPolynomial(this.degree)},t.prototype.encode=function(s){if(!this.genPoly)throw new Error("Encoder not initialized");const n=new Uint8Array(s.length+this.degree);n.set(s);const i=e.mod(n,this.genPoly),o=this.degree-i.length;if(o>0){const a=new Uint8Array(this.degree);return a.set(i,o),a}return i},Bt=t,Bt}var Mt={},Ut={},Ht={},us;function Gn(){return us||(us=1,Ht.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}),Ht}var ne={},ds;function Jn(){if(ds)return ne;ds=1;const e="[0-9]+",t="[A-Z $%*+\\-./:]+";let r="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";r=r.replace(/u/g,"\\u");const s="(?:(?![A-Z0-9 $%*+\\-./:]|"+r+`)(?:.|[\r
]))+`;ne.KANJI=new RegExp(r,"g"),ne.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),ne.BYTE=new RegExp(s,"g"),ne.NUMERIC=new RegExp(e,"g"),ne.ALPHANUMERIC=new RegExp(t,"g");const n=new RegExp("^"+r+"$"),i=new RegExp("^"+e+"$"),o=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return ne.testKanji=function(c){return n.test(c)},ne.testNumeric=function(c){return i.test(c)},ne.testAlphanumeric=function(c){return o.test(c)},ne}var fs;function Pe(){return fs||(fs=1,(function(e){const t=Gn(),r=Jn();e.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(i,o){if(!i.ccBits)throw new Error("Invalid mode: "+i);if(!t.isValid(o))throw new Error("Invalid version: "+o);return o>=1&&o<10?i.ccBits[0]:o<27?i.ccBits[1]:i.ccBits[2]},e.getBestModeForData=function(i){return r.testNumeric(i)?e.NUMERIC:r.testAlphanumeric(i)?e.ALPHANUMERIC:r.testKanji(i)?e.KANJI:e.BYTE},e.toString=function(i){if(i&&i.id)return i.id;throw new Error("Invalid mode")},e.isValid=function(i){return i&&i.bit&&i.ccBits};function s(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+n)}}e.from=function(i,o){if(e.isValid(i))return i;try{return s(i)}catch{return o}}})(Ut)),Ut}var hs;function uo(){return hs||(hs=1,(function(e){const t=Ce(),r=Wn(),s=Br(),n=Pe(),i=Gn(),o=7973,a=t.getBCHDigit(o);function c(d,h,m){for(let b=1;b<=40;b++)if(h<=e.getCapacity(b,m,d))return b}function u(d,h){return n.getCharCountIndicator(d,h)+4}function l(d,h){let m=0;return d.forEach(function(b){const v=u(b.mode,h);m+=v+b.getBitsLength()}),m}function f(d,h){for(let m=1;m<=40;m++)if(l(d,m)<=e.getCapacity(m,h,n.MIXED))return m}e.from=function(h,m){return i.isValid(h)?parseInt(h,10):m},e.getCapacity=function(h,m,b){if(!i.isValid(h))throw new Error("Invalid QR Code version");typeof b>"u"&&(b=n.BYTE);const v=t.getSymbolTotalCodewords(h),p=r.getTotalCodewordsCount(h,m),y=(v-p)*8;if(b===n.MIXED)return y;const E=y-u(b,h);switch(b){case n.NUMERIC:return Math.floor(E/10*3);case n.ALPHANUMERIC:return Math.floor(E/11*2);case n.KANJI:return Math.floor(E/13);case n.BYTE:default:return Math.floor(E/8)}},e.getBestVersionForData=function(h,m){let b;const v=s.from(m,s.M);if(Array.isArray(h)){if(h.length>1)return f(h,v);if(h.length===0)return 1;b=h[0]}else b=h;return c(b.mode,b.getLength(),v)},e.getEncodedBits=function(h){if(!i.isValid(h)||h<7)throw new Error("Invalid QR Code version");let m=h<<12;for(;t.getBCHDigit(m)-a>=0;)m^=o<<t.getBCHDigit(m)-a;return h<<12|m}})(Mt)),Mt}var Ft={},ps;function fo(){if(ps)return Ft;ps=1;const e=Ce(),t=1335,r=21522,s=e.getBCHDigit(t);return Ft.getEncodedBits=function(i,o){const a=i.bit<<3|o;let c=a<<10;for(;e.getBCHDigit(c)-s>=0;)c^=t<<e.getBCHDigit(c)-s;return(a<<10|c)^r},Ft}var zt={},Qt,ms;function ho(){if(ms)return Qt;ms=1;const e=Pe();function t(r){this.mode=e.NUMERIC,this.data=r.toString()}return t.getBitsLength=function(s){return 10*Math.floor(s/3)+(s%3?s%3*3+1:0)},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(s){let n,i,o;for(n=0;n+3<=this.data.length;n+=3)i=this.data.substr(n,3),o=parseInt(i,10),s.put(o,10);const a=this.data.length-n;a>0&&(i=this.data.substr(n),o=parseInt(i,10),s.put(o,a*3+1))},Qt=t,Qt}var Vt,gs;function po(){if(gs)return Vt;gs=1;const e=Pe(),t=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function r(s){this.mode=e.ALPHANUMERIC,this.data=s}return r.getBitsLength=function(n){return 11*Math.floor(n/2)+6*(n%2)},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(n){let i;for(i=0;i+2<=this.data.length;i+=2){let o=t.indexOf(this.data[i])*45;o+=t.indexOf(this.data[i+1]),n.put(o,11)}this.data.length%2&&n.put(t.indexOf(this.data[i]),6)},Vt=r,Vt}var Xt,bs;function mo(){if(bs)return Xt;bs=1;const e=Pe();function t(r){this.mode=e.BYTE,typeof r=="string"?this.data=new TextEncoder().encode(r):this.data=new Uint8Array(r)}return t.getBitsLength=function(s){return s*8},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(r){for(let s=0,n=this.data.length;s<n;s++)r.put(this.data[s],8)},Xt=t,Xt}var Wt,ys;function go(){if(ys)return Wt;ys=1;const e=Pe(),t=Ce();function r(s){this.mode=e.KANJI,this.data=s}return r.getBitsLength=function(n){return n*13},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(s){let n;for(n=0;n<this.data.length;n++){let i=t.toSJIS(this.data[n]);if(i>=33088&&i<=40956)i-=33088;else if(i>=57408&&i<=60351)i-=49472;else throw new Error("Invalid SJIS character: "+this.data[n]+`
Make sure your charset is UTF-8`);i=(i>>>8&255)*192+(i&255),s.put(i,13)}},Wt=r,Wt}var Gt={exports:{}},vs;function bo(){return vs||(vs=1,(function(e){var t={single_source_shortest_paths:function(r,s,n){var i={},o={};o[s]=0;var a=t.PriorityQueue.make();a.push(s,0);for(var c,u,l,f,d,h,m,b,v;!a.empty();){c=a.pop(),u=c.value,f=c.cost,d=r[u]||{};for(l in d)d.hasOwnProperty(l)&&(h=d[l],m=f+h,b=o[l],v=typeof o[l]>"u",(v||b>m)&&(o[l]=m,a.push(l,m),i[l]=u))}if(typeof n<"u"&&typeof o[n]>"u"){var p=["Could not find a path from ",s," to ",n,"."].join("");throw new Error(p)}return i},extract_shortest_path_from_predecessor_list:function(r,s){for(var n=[],i=s;i;)n.push(i),r[i],i=r[i];return n.reverse(),n},find_path:function(r,s,n){var i=t.single_source_shortest_paths(r,s,n);return t.extract_shortest_path_from_predecessor_list(i,n)},PriorityQueue:{make:function(r){var s=t.PriorityQueue,n={},i;r=r||{};for(i in s)s.hasOwnProperty(i)&&(n[i]=s[i]);return n.queue=[],n.sorter=r.sorter||s.default_sorter,n},default_sorter:function(r,s){return r.cost-s.cost},push:function(r,s){var n={value:r,cost:s};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};e.exports=t})(Gt)),Gt.exports}var ws;function yo(){return ws||(ws=1,(function(e){const t=Pe(),r=ho(),s=po(),n=mo(),i=go(),o=Jn(),a=Ce(),c=bo();function u(p){return unescape(encodeURIComponent(p)).length}function l(p,y,E){const A=[];let N;for(;(N=p.exec(E))!==null;)A.push({data:N[0],index:N.index,mode:y,length:N[0].length});return A}function f(p){const y=l(o.NUMERIC,t.NUMERIC,p),E=l(o.ALPHANUMERIC,t.ALPHANUMERIC,p);let A,N;return a.isKanjiModeEnabled()?(A=l(o.BYTE,t.BYTE,p),N=l(o.KANJI,t.KANJI,p)):(A=l(o.BYTE_KANJI,t.BYTE,p),N=[]),y.concat(E,A,N).sort(function(g,x){return g.index-x.index}).map(function(g){return{data:g.data,mode:g.mode,length:g.length}})}function d(p,y){switch(y){case t.NUMERIC:return r.getBitsLength(p);case t.ALPHANUMERIC:return s.getBitsLength(p);case t.KANJI:return i.getBitsLength(p);case t.BYTE:return n.getBitsLength(p)}}function h(p){return p.reduce(function(y,E){const A=y.length-1>=0?y[y.length-1]:null;return A&&A.mode===E.mode?(y[y.length-1].data+=E.data,y):(y.push(E),y)},[])}function m(p){const y=[];for(let E=0;E<p.length;E++){const A=p[E];switch(A.mode){case t.NUMERIC:y.push([A,{data:A.data,mode:t.ALPHANUMERIC,length:A.length},{data:A.data,mode:t.BYTE,length:A.length}]);break;case t.ALPHANUMERIC:y.push([A,{data:A.data,mode:t.BYTE,length:A.length}]);break;case t.KANJI:y.push([A,{data:A.data,mode:t.BYTE,length:u(A.data)}]);break;case t.BYTE:y.push([{data:A.data,mode:t.BYTE,length:u(A.data)}])}}return y}function b(p,y){const E={},A={start:{}};let N=["start"];for(let C=0;C<p.length;C++){const g=p[C],x=[];for(let w=0;w<g.length;w++){const _=g[w],P=""+C+w;x.push(P),E[P]={node:_,lastCount:0},A[P]={};for(let R=0;R<N.length;R++){const S=N[R];E[S]&&E[S].node.mode===_.mode?(A[S][P]=d(E[S].lastCount+_.length,_.mode)-d(E[S].lastCount,_.mode),E[S].lastCount+=_.length):(E[S]&&(E[S].lastCount=_.length),A[S][P]=d(_.length,_.mode)+4+t.getCharCountIndicator(_.mode,y))}}N=x}for(let C=0;C<N.length;C++)A[N[C]].end=0;return{map:A,table:E}}function v(p,y){let E;const A=t.getBestModeForData(p);if(E=t.from(y,A),E!==t.BYTE&&E.bit<A.bit)throw new Error('"'+p+'" cannot be encoded with mode '+t.toString(E)+`.
 Suggested mode is: `+t.toString(A));switch(E===t.KANJI&&!a.isKanjiModeEnabled()&&(E=t.BYTE),E){case t.NUMERIC:return new r(p);case t.ALPHANUMERIC:return new s(p);case t.KANJI:return new i(p);case t.BYTE:return new n(p)}}e.fromArray=function(y){return y.reduce(function(E,A){return typeof A=="string"?E.push(v(A,null)):A.data&&E.push(v(A.data,A.mode)),E},[])},e.fromString=function(y,E){const A=f(y,a.isKanjiModeEnabled()),N=m(A),C=b(N,E),g=c.find_path(C.map,"start","end"),x=[];for(let w=1;w<g.length-1;w++)x.push(C.table[g[w]].node);return e.fromArray(h(x))},e.rawSplit=function(y){return e.fromArray(f(y,a.isKanjiModeEnabled()))}})(zt)),zt}var xs;function vo(){if(xs)return It;xs=1;const e=Ce(),t=Br(),r=ro(),s=so(),n=no(),i=io(),o=oo(),a=Wn(),c=co(),u=uo(),l=fo(),f=Pe(),d=yo();function h(C,g){const x=C.size,w=i.getPositions(g);for(let _=0;_<w.length;_++){const P=w[_][0],R=w[_][1];for(let S=-1;S<=7;S++)if(!(P+S<=-1||x<=P+S))for(let D=-1;D<=7;D++)R+D<=-1||x<=R+D||(S>=0&&S<=6&&(D===0||D===6)||D>=0&&D<=6&&(S===0||S===6)||S>=2&&S<=4&&D>=2&&D<=4?C.set(P+S,R+D,!0,!0):C.set(P+S,R+D,!1,!0))}}function m(C){const g=C.size;for(let x=8;x<g-8;x++){const w=x%2===0;C.set(x,6,w,!0),C.set(6,x,w,!0)}}function b(C,g){const x=n.getPositions(g);for(let w=0;w<x.length;w++){const _=x[w][0],P=x[w][1];for(let R=-2;R<=2;R++)for(let S=-2;S<=2;S++)R===-2||R===2||S===-2||S===2||R===0&&S===0?C.set(_+R,P+S,!0,!0):C.set(_+R,P+S,!1,!0)}}function v(C,g){const x=C.size,w=u.getEncodedBits(g);let _,P,R;for(let S=0;S<18;S++)_=Math.floor(S/3),P=S%3+x-8-3,R=(w>>S&1)===1,C.set(_,P,R,!0),C.set(P,_,R,!0)}function p(C,g,x){const w=C.size,_=l.getEncodedBits(g,x);let P,R;for(P=0;P<15;P++)R=(_>>P&1)===1,P<6?C.set(P,8,R,!0):P<8?C.set(P+1,8,R,!0):C.set(w-15+P,8,R,!0),P<8?C.set(8,w-P-1,R,!0):P<9?C.set(8,15-P-1+1,R,!0):C.set(8,15-P-1,R,!0);C.set(w-8,8,1,!0)}function y(C,g){const x=C.size;let w=-1,_=x-1,P=7,R=0;for(let S=x-1;S>0;S-=2)for(S===6&&S--;;){for(let D=0;D<2;D++)if(!C.isReserved(_,S-D)){let M=!1;R<g.length&&(M=(g[R]>>>P&1)===1),C.set(_,S-D,M),P--,P===-1&&(R++,P=7)}if(_+=w,_<0||x<=_){_-=w,w=-w;break}}}function E(C,g,x){const w=new r;x.forEach(function(D){w.put(D.mode.bit,4),w.put(D.getLength(),f.getCharCountIndicator(D.mode,C)),D.write(w)});const _=e.getSymbolTotalCodewords(C),P=a.getTotalCodewordsCount(C,g),R=(_-P)*8;for(w.getLengthInBits()+4<=R&&w.put(0,4);w.getLengthInBits()%8!==0;)w.putBit(0);const S=(R-w.getLengthInBits())/8;for(let D=0;D<S;D++)w.put(D%2?17:236,8);return A(w,C,g)}function A(C,g,x){const w=e.getSymbolTotalCodewords(g),_=a.getTotalCodewordsCount(g,x),P=w-_,R=a.getBlocksCount(g,x),S=w%R,D=R-S,M=Math.floor(w/R),U=Math.floor(P/R),F=U+1,V=M-U,ci=new c(V);let xt=0;const it=new Array(R),zr=new Array(R);let Et=0;const ui=new Uint8Array(C.buffer);for(let Re=0;Re<R;Re++){const At=Re<D?U:F;it[Re]=ui.slice(xt,xt+At),zr[Re]=ci.encode(it[Re]),xt+=At,Et=Math.max(Et,At)}const St=new Uint8Array(w);let Qr=0,ie,oe;for(ie=0;ie<Et;ie++)for(oe=0;oe<R;oe++)ie<it[oe].length&&(St[Qr++]=it[oe][ie]);for(ie=0;ie<V;ie++)for(oe=0;oe<R;oe++)St[Qr++]=zr[oe][ie];return St}function N(C,g,x,w){let _;if(Array.isArray(C))_=d.fromArray(C);else if(typeof C=="string"){let M=g;if(!M){const U=d.rawSplit(C);M=u.getBestVersionForData(U,x)}_=d.fromString(C,M||40)}else throw new Error("Invalid data");const P=u.getBestVersionForData(_,x);if(!P)throw new Error("The amount of data is too big to be stored in a QR Code");if(!g)g=P;else if(g<P)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+P+`.
`);const R=E(g,x,_),S=e.getSymbolSize(g),D=new s(S);return h(D,g),m(D),b(D,g),p(D,x,0),g>=7&&v(D,g),y(D,R),isNaN(w)&&(w=o.getBestMask(D,p.bind(null,D,x))),o.applyMask(w,D),p(D,x,w),{modules:D,version:g,errorCorrectionLevel:x,maskPattern:w,segments:_}}return It.create=function(g,x){if(typeof g>"u"||g==="")throw new Error("No input text");let w=t.M,_,P;return typeof x<"u"&&(w=t.from(x.errorCorrectionLevel,t.M),_=u.from(x.version),P=o.from(x.maskPattern),x.toSJISFunc&&e.setToSJISFunction(x.toSJISFunc)),N(g,_,w,P)},It}var Jt={},Yt={},Es;function Yn(){return Es||(Es=1,(function(e){function t(r){if(typeof r=="number"&&(r=r.toString()),typeof r!="string")throw new Error("Color should be defined as hex string");let s=r.slice().replace("#","").split("");if(s.length<3||s.length===5||s.length>8)throw new Error("Invalid hex color: "+r);(s.length===3||s.length===4)&&(s=Array.prototype.concat.apply([],s.map(function(i){return[i,i]}))),s.length===6&&s.push("F","F");const n=parseInt(s.join(""),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:"#"+s.slice(0,6).join("")}}e.getOptions=function(s){s||(s={}),s.color||(s.color={});const n=typeof s.margin>"u"||s.margin===null||s.margin<0?4:s.margin,i=s.width&&s.width>=21?s.width:void 0,o=s.scale||4;return{width:i,scale:i?4:o,margin:n,color:{dark:t(s.color.dark||"#000000ff"),light:t(s.color.light||"#ffffffff")},type:s.type,rendererOpts:s.rendererOpts||{}}},e.getScale=function(s,n){return n.width&&n.width>=s+n.margin*2?n.width/(s+n.margin*2):n.scale},e.getImageWidth=function(s,n){const i=e.getScale(s,n);return Math.floor((s+n.margin*2)*i)},e.qrToImageData=function(s,n,i){const o=n.modules.size,a=n.modules.data,c=e.getScale(o,i),u=Math.floor((o+i.margin*2)*c),l=i.margin*c,f=[i.color.light,i.color.dark];for(let d=0;d<u;d++)for(let h=0;h<u;h++){let m=(d*u+h)*4,b=i.color.light;if(d>=l&&h>=l&&d<u-l&&h<u-l){const v=Math.floor((d-l)/c),p=Math.floor((h-l)/c);b=f[a[v*o+p]?1:0]}s[m++]=b.r,s[m++]=b.g,s[m++]=b.b,s[m]=b.a}}})(Yt)),Yt}var Ss;function wo(){return Ss||(Ss=1,(function(e){const t=Yn();function r(n,i,o){n.clearRect(0,0,i.width,i.height),i.style||(i.style={}),i.height=o,i.width=o,i.style.height=o+"px",i.style.width=o+"px"}function s(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(i,o,a){let c=a,u=o;typeof c>"u"&&(!o||!o.getContext)&&(c=o,o=void 0),o||(u=s()),c=t.getOptions(c);const l=t.getImageWidth(i.modules.size,c),f=u.getContext("2d"),d=f.createImageData(l,l);return t.qrToImageData(d.data,i,c),r(f,u,l),f.putImageData(d,0,0),u},e.renderToDataURL=function(i,o,a){let c=a;typeof c>"u"&&(!o||!o.getContext)&&(c=o,o=void 0),c||(c={});const u=e.render(i,o,c),l=c.type||"image/png",f=c.rendererOpts||{};return u.toDataURL(l,f.quality)}})(Jt)),Jt}var Kt={},As;function xo(){if(As)return Kt;As=1;const e=Yn();function t(n,i){const o=n.a/255,a=i+'="'+n.hex+'"';return o<1?a+" "+i+'-opacity="'+o.toFixed(2).slice(1)+'"':a}function r(n,i,o){let a=n+i;return typeof o<"u"&&(a+=" "+o),a}function s(n,i,o){let a="",c=0,u=!1,l=0;for(let f=0;f<n.length;f++){const d=Math.floor(f%i),h=Math.floor(f/i);!d&&!u&&(u=!0),n[f]?(l++,f>0&&d>0&&n[f-1]||(a+=u?r("M",d+o,.5+h+o):r("m",c,0),c=0,u=!1),d+1<i&&n[f+1]||(a+=r("h",l),l=0)):c++}return a}return Kt.render=function(i,o,a){const c=e.getOptions(o),u=i.modules.size,l=i.modules.data,f=u+c.margin*2,d=c.color.light.a?"<path "+t(c.color.light,"fill")+' d="M0 0h'+f+"v"+f+'H0z"/>':"",h="<path "+t(c.color.dark,"stroke")+' d="'+s(l,u,c.margin)+'"/>',m='viewBox="0 0 '+f+" "+f+'"',v='<svg xmlns="http://www.w3.org/2000/svg" '+(c.width?'width="'+c.width+'" height="'+c.width+'" ':"")+m+' shape-rendering="crispEdges">'+d+h+`</svg>
`;return typeof a=="function"&&a(null,v),v},Kt}var _s;function Eo(){if(_s)return Ne;_s=1;const e=to(),t=vo(),r=wo(),s=xo();function n(i,o,a,c,u){const l=[].slice.call(arguments,1),f=l.length,d=typeof l[f-1]=="function";if(!d&&!e())throw new Error("Callback required as last argument");if(d){if(f<2)throw new Error("Too few arguments provided");f===2?(u=a,a=o,o=c=void 0):f===3&&(o.getContext&&typeof u>"u"?(u=c,c=void 0):(u=c,c=a,a=o,o=void 0))}else{if(f<1)throw new Error("Too few arguments provided");return f===1?(a=o,o=c=void 0):f===2&&!o.getContext&&(c=a,a=o,o=void 0),new Promise(function(h,m){try{const b=t.create(a,c);h(i(b,o,c))}catch(b){m(b)}})}try{const h=t.create(a,c);u(null,i(h,o,c))}catch(h){u(h)}}return Ne.create=t.create,Ne.toCanvas=n.bind(null,r.render),Ne.toDataURL=n.bind(null,r.renderToDataURL),Ne.toString=n.bind(null,function(i,o,a){return s.render(i,a)}),Ne}var So=Eo();const Ao=Xn(So),I=new Vn,Zt=new Map,$t=new Map;function q(e){const t=e.env.DATABASE_CCT;if(!t)throw new Error("DATABASE_CCT não configurado nas variáveis de ambiente");return new Lr(t)}function Kn(e){const t=e.env.DATABASE_URL_CREDITOS||e.env.DATABASE_SUITEPLUS;if(!t)throw new Error("DATABASE_URL_CREDITOS não configurado");return new Lr(t)}async function Zn(e){const t=e.connectionString||"credits";Zt.has(t)||Zt.set(t,(async()=>{await e.sql(`
        CREATE TABLE IF NOT EXISTS users_credits (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL UNIQUE,
          credits_balance INTEGER NOT NULL DEFAULT 0,
          total_credits_used INTEGER NOT NULL DEFAULT 0,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `),await e.sql("CREATE INDEX IF NOT EXISTS idx_users_credits_email ON users_credits(lower(user_email))")})()),await Zt.get(t)}async function Or(e,t){await Zn(e);const r=await e.sql("SELECT credits_balance FROM users_credits WHERE lower(user_email) = lower($1)",[t]);return r.length>0?parseInt(r[0].credits_balance):0}async function _o(e,t,r){return await Zn(e),(await e.sql(`UPDATE users_credits
     SET credits_balance = credits_balance - $1,
         total_credits_used = COALESCE(total_credits_used, 0) + $1,
         updated_at = NOW()
     WHERE lower(user_email) = lower($2)
       AND credits_balance >= $1
     RETURNING credits_balance`,[r,t])).length>0}async function Mr(e){const t=e.connectionString||"lesson-rentals";$t.has(t)||$t.set(t,(async()=>{await e.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS rentable BOOLEAN DEFAULT FALSE"),await e.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS rental_credits INTEGER DEFAULT 0"),await e.sql(`
        CREATE TABLE IF NOT EXISTS lesson_rentals (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          lesson_id INTEGER NOT NULL,
          credits_paid INTEGER NOT NULL,
          rented_at TIMESTAMPTZ DEFAULT NOW(),
          expires_at TIMESTAMPTZ NOT NULL,
          UNIQUE(user_email, lesson_id)
        )
      `),await e.sql("CREATE INDEX IF NOT EXISTS idx_lesson_rentals_email ON lesson_rentals(user_email)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_lesson_rentals_lesson ON lesson_rentals(lesson_id)")})()),await $t.get(t)}async function Ur(e,t){try{const s=await new Lr(t).sql(`SELECT expires_at FROM user_subscriptions
       WHERE user_email = $1 AND product_id = 4 AND status = 'active'
       ORDER BY expires_at DESC LIMIT 1`,[e.toLowerCase()]);return s.length>0&&s[0].expires_at?new Date(s[0].expires_at):null}catch(r){return console.error("⚠️ Suiteplus subscription check failed:",r.message),null}}I.use("/api/*",Gi());I.get("/health",e=>{const t=!!e.env.SUPABASE_URL,r=!!e.env.SUPABASE_ANON_KEY;return e.json({status:"ok",timestamp:new Date().toISOString(),environment:{supabase_url:t?"✅ Configured":"❌ Missing",supabase_key:r?"✅ Configured":"❌ Missing"}})});async function Y(e,t,r){try{if(e.startsWith("IMPERSONATE:")){const n=JSON.parse(Buffer.from(e.replace("IMPERSONATE:",""),"base64").toString("utf-8")),i=Buffer.from(`${n.email}:${r}`).toString("base64");return n.signature!==i?(console.error("❌ Invalid impersonation token signature"),null):Date.now()-new Date(n.impersonated_at).getTime()>1440*60*1e3?(console.error("❌ Impersonation token expired"),null):(console.log(`🎭 Using impersonation token for ${n.email}`),{email:n.email,user_metadata:{name:n.nome},id:n.user_id,impersonated:!0})}const s=await fetch(`${t}/auth/v1/user`,{headers:{Authorization:`Bearer ${e}`,apikey:r}});return s.ok?await s.json():null}catch(s){return console.error("Token verification error:",s),null}}async function K(e,t){const r=G(e,"sb-access-token");if(!r)return e.json({error:"Unauthorized"},401);const s=await Y(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!s)return e.json({error:"Invalid token"},401);e.set("user",s),await t()}I.get("/api/user/credits",K,async e=>{try{const t=e.get("user");if(!(e.env.DATABASE_URL_CREDITOS||e.env.DATABASE_SUITEPLUS))return console.warn("Credits DB not configured — returning 0"),e.json({success:!0,credits:0,unavailable:!0});const s=Kn(e),n=await Or(s,t.email);return e.json({success:!0,credits:n})}catch(t){return console.error("Get credits error:",t),e.json({success:!0,credits:0,unavailable:!0})}});I.post("/api/auth/login",async e=>{try{const t=await e.req.json(),{email:r,password:s}=t;if(console.log("🔐 Login attempt:",{email:r,hasPassword:!!s}),console.log("🌐 Supabase URL:",e.env.SUPABASE_URL),console.log("🔑 Supabase Key present:",!!e.env.SUPABASE_ANON_KEY),!r||!s)return console.error("❌ Missing email or password"),e.json({error:"Email e senha são obrigatórios"},400);const n=await fetch(`${e.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:r,password:s})}),i=await n.json();return console.log("📨 Supabase response:",{status:n.status,ok:n.ok}),n.ok?(console.log("✅ Login successful for:",r),se(e,"sb-access-token",i.access_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),se(e,"sb-refresh-token",i.refresh_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0,user:i.user})):(console.error("❌ Login failed:",i),e.json({error:i.error_description||i.message||"Login failed"},400))}catch{return e.json({error:"Login failed"},500)}});I.post("/api/auth/register",async e=>{try{const{email:t,password:r,name:s}=await e.req.json(),n=await fetch(`${e.env.SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:t,password:r,data:{name:s}})}),i=await n.json();if(!n.ok)return e.json({error:i.error_description||"Registration failed"},400);try{await q(e).insert("users",{email:t,nome:s,ativo:!0,teste_gratis:!1}),console.log("✅ User record created in users table:",t)}catch(o){console.error("❌ Failed to create user record:",o)}return e.json({success:!0,message:"Registration successful. Please check your email to confirm.",user:i.user})}catch{return e.json({error:"Registration failed"},500)}});I.post("/api/auth/logout",async e=>(mt(e,"sb-access-token"),mt(e,"sb-refresh-token"),e.json({success:!0})));I.get("/api/auth/me",async e=>{var s;const t=G(e,"sb-access-token");if(!t)return e.json({user:null});try{if((s=JSON.parse(atob(t.split(".")[1])).amr)==null?void 0:s.some(o=>o.method==="otp"))return mt(e,"sb-access-token"),mt(e,"sb-refresh-token"),e.json({user:null,error:"password_reset_required",message:"Por favor, redefina sua senha antes de fazer login"},401)}catch{}const r=await Y(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);return e.json({user:r})});I.get("/api/user/profile",async e=>{var t;try{const r=G(e,"sb-access-token");if(!r)return e.json({error:"Não autenticado"},401);const s=await Y(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!s)return e.json({error:"Usuário não encontrado"},404);const n=q(e),i=await n.query("users",{select:"*",filters:{email:s.email},single:!0});if(!i){await n.insert("users",{email:s.email,nome:((t=s.user_metadata)==null?void 0:t.name)||"",ativo:!0,teste_gratis:!1});const o=await n.query("users",{select:"*",filters:{email:s.email},single:!0});return e.json({profile:o})}return e.json({profile:i})}catch(r){return console.error("Error fetching user profile:",r),e.json({error:"Erro ao buscar perfil"},500)}});I.put("/api/user/profile",async e=>{try{const t=G(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const r=await Y(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({error:"Usuário não encontrado"},404);const{nome:s,first_name:n,last_name:i,cpf:o,telefone:a,whatsapp:c,end_cep:u,end_logradouro:l,end_numero:f,end_cidade:d,end_estado:h}=await e.req.json();return await q(e).update("users",{email:r.email},{nome:s||null,first_name:n||null,last_name:i||null,cpf:o||null,telefone:a||null,whatsapp:c||null,end_cep:u||null,end_logradouro:l||null,end_numero:f||null,end_cidade:d||null,end_estado:h||null,updated_at:new Date().toISOString()}),s&&await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({data:{name:s.trim()}})}),e.json({success:!0,message:"Perfil atualizado com sucesso!"})}catch(t){return console.error("Error updating user profile:",t),e.json({error:"Erro ao atualizar perfil"},500)}});I.put("/api/auth/profile",async e=>{try{const t=G(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const{name:r}=await e.req.json();if(console.log("👤 Profile update attempt"),console.log("   Name:",r),!r||r.trim().length===0)return console.error("❌ Missing name"),e.json({error:"Nome é obrigatório"},400);const s=await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({data:{name:r.trim()}})});if(console.log("📨 Supabase response:",{status:s.status,ok:s.ok}),!s.ok){const i=await s.json();return console.error("❌ Profile update failed:",i),e.json({error:i.error_description||i.message||"Falha ao atualizar perfil"},400)}const n=await s.json();return console.log("✅ Profile updated successfully"),e.json({success:!0,user:n,message:"Perfil atualizado com sucesso!"})}catch(t){return console.error("💥 Profile update error:",t),e.json({error:"Erro ao atualizar perfil"},500)}});I.post("/api/auth/change-password",async e=>{try{const t=G(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const{currentPassword:r,newPassword:s}=await e.req.json();if(console.log("🔐 Password change attempt"),console.log("   Has current password:",!!r),console.log("   New password length:",s==null?void 0:s.length),!r||!s)return console.error("❌ Missing passwords"),e.json({error:"Senha atual e nova senha são obrigatórias"},400);if(s.length<6)return console.error("❌ Password too short"),e.json({error:"A nova senha deve ter pelo menos 6 caracteres"},400);const n=await Y(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!n||!n.email)return e.json({error:"Usuário não encontrado"},401);if(!(await fetch(`${e.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:n.email,password:r})})).ok)return console.error("❌ Current password is incorrect"),e.json({error:"Senha atual incorreta"},400);console.log("✅ Current password verified");const o=await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({password:s})});if(console.log("📨 Supabase response:",{status:o.status,ok:o.ok}),!o.ok){const c=await o.json();console.error("❌ Password change failed:",c);let u="Falha ao alterar senha";return c.error_code==="same_password"?u="A nova senha deve ser diferente da senha atual":c.msg?u=c.msg:c.error_description&&(u=c.error_description),e.json({error:u},400)}const a=await o.json();return console.log("✅ Password changed successfully"),a.access_token&&se(e,"sb-access-token",a.access_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),a.refresh_token&&se(e,"sb-refresh-token",a.refresh_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0,message:"Senha alterada com sucesso!"})}catch(t){return console.error("💥 Password change error:",t),e.json({error:"Erro ao alterar senha"},500)}});I.get("/api/user/access-status",K,async e=>{var t;try{const s=e.get("user").email;if(!s)return e.json({error:"Email do usuário não encontrado"},400);const n=q(e),i=await n.rpc("user_tipo_acesso",{email_usuario:s});console.log("🔍 Access type result for",s,":",i);let o="SEM_ACESSO";typeof i=="string"?o=i:Array.isArray(i)&&i.length>0?o=i[0].user_tipo_acesso||i[0]:i&&typeof i=="object"&&(o=i.user_tipo_acesso),console.log("✅ Determined access type:",o);const a=await n.query("member_subscriptions",{select:"data_expiracao, teste_gratis, detalhe",filters:{email_membro:s},order:"data_expiracao.desc",limit:1});let c=null,u=null;if(a&&a.length>0){const f=a[0];new Date(f.data_expiracao)>new Date&&(c=f.data_expiracao,u=f.detalhe)}const l=e.env.DATABASE_SUITEPLUS;if(l){const f=await Ur(s,l);f&&f>new Date&&(o==="SEM_ACESSO"&&(o="COMPLETO"),(!c||f>new Date(c))&&(c=f.toISOString()))}return e.json({email:s,accessType:o,hasActiveSubscription:o!=="SEM_ACESSO",hasFullAccess:o==="COMPLETO",expirationDate:c,subscriptionDetail:u})}catch(r){return console.error("Error loading access status:",(r==null?void 0:r.message)||r),e.json({email:((t=e.get("user"))==null?void 0:t.email)||"",accessType:"SEM_ACESSO",hasActiveSubscription:!1,hasFullAccess:!1,expirationDate:null,subscriptionDetail:null},200)}});I.get("/api/user/subscriptions",K,async e=>{try{const r=e.get("user").email;if(!r)return e.json({error:"Email do usuário não encontrado"},400);const n=await q(e).query("member_subscriptions",{select:"*",filters:{email_membro:r},order:"data_expiracao.desc"}),i=e.env.DATABASE_SUITEPLUS;if(i&&n&&n.length>0){const o=await Ur(r,i);if(o)for(const a of n){const c=new Date(a.data_expiracao);o>c&&(a.data_expiracao=o.toISOString())}}return e.json({subscriptions:n||[],total:(n==null?void 0:n.length)||0})}catch(t){return console.error("Error loading subscriptions:",t),e.json({error:t.message||"Erro ao carregar assinaturas"},500)}});I.get("/auth/callback*",async e=>{var r;const t=e.req.path;if(t.includes("%20")||t.includes(" ")){const s=t.split(/(%20| )/)[0],n=e.req.url.split("#")[1],i=(r=e.req.url.split("?")[1])==null?void 0:r.split("#")[0];let o=s;return i&&(o+="?"+i),n&&(o+="#"+n),e.redirect(o)}return await Co(e)});async function Co(e){var o,a,c,u,l,f;const t=new URL(e.req.url),r=t.searchParams.get("error_code")||((o=t.hash.match(/error_code=([^&]+)/))==null?void 0:o[1]);if(t.searchParams.get("error_description")||((a=t.hash.match(/error_description=([^&]+)/))==null||a[1]),r)return r==="otp_expired"?e.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link Expirado - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div class="text-center mb-6">
            <div class="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-clock text-4xl text-red-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Link Expirado</h1>
            <p class="text-gray-600">
                O link de recuperação de senha expirou ou já foi usado.
            </p>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-blue-800">
                <i class="fas fa-info-circle mr-2"></i>
                Por motivos de segurança, os links de recuperação expiram rapidamente.
            </p>
        </div>
        
        <a href="/" 
           class="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors">
            <i class="fas fa-redo mr-2"></i>
            Solicitar Novo Link
        </a>
        
        <p class="text-center text-sm text-gray-500 mt-4">
            Você será redirecionado para a tela de login onde pode solicitar um novo link.
        </p>
    </div>
</body>
</html>
      `):e.redirect(`/?error=${r}`);const s=t.searchParams.get("access_token")||((c=t.hash.match(/access_token=([^&]+)/))==null?void 0:c[1]),n=t.searchParams.get("refresh_token")||((u=t.hash.match(/refresh_token=([^&]+)/))==null?void 0:u[1]),i=t.searchParams.get("type")||((l=t.hash.match(/type=([^&]+)/))==null?void 0:l[1]);if(!s)return e.redirect("/?error=no_token");try{const h=(f=JSON.parse(atob(s.split(".")[1])).amr)==null?void 0:f.some(m=>m.method==="otp");if(i==="recovery"||h)return e.redirect(`/reset-password#access_token=${s}&refresh_token=${n||""}&type=recovery`)}catch{if(i==="recovery")return e.redirect(`/reset-password#access_token=${s}&refresh_token=${n||""}&type=recovery`)}return se(e,"sb-access-token",s,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),n&&se(e,"sb-refresh-token",n,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.redirect("/?auth=success")}I.post("/api/auth/callback",async e=>{try{const{access_token:t,refresh_token:r}=await e.req.json();return t?(se(e,"sb-access-token",t,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),r&&se(e,"sb-refresh-token",r,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0})):e.json({error:"No access token"},400)}catch{return e.json({error:"Callback failed"},500)}});I.post("/api/auth/forgot-password",async e=>{try{const{email:t}=await e.req.json();if(!t)return e.json({error:"Email is required"},400);const r=e.req.header("host")||"localhost:3000",n=`${r.includes("localhost")?"http":"https"}://${r}/auth/callback`,i=await fetch(`${e.env.SUPABASE_URL}/auth/v1/recover`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:t,options:{redirectTo:n}})});if(i.ok)return e.json({success:!0,message:"Se o email estiver cadastrado, você receberá um link de recuperação. O link é válido por 1 hora."});const o=await i.json();return e.json({error:o.error_description||"Failed to send reset email"},400)}catch{return e.json({error:"Failed to process request"},500)}});I.post("/api/auth/reset-password",async e=>{try{const t=await e.req.json(),{token:r,password:s}=t;if(console.log("🔐 Password reset attempt"),console.log("   Token present:",!!r),console.log("   Token length:",r==null?void 0:r.length),console.log("   Password length:",s==null?void 0:s.length),!r||!s)return console.error("❌ Missing token or password"),e.json({error:"Token e senha são obrigatórios"},400);if(s.length<6)return console.error("❌ Password too short"),e.json({error:"A senha deve ter pelo menos 6 caracteres"},400);console.log("📨 Calling Supabase to update password...");const n=await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({password:s})});if(console.log("📨 Supabase response:",{status:n.status,ok:n.ok}),!n.ok){const o=await n.json();console.error("❌ Password reset failed:",o);let a="Falha ao redefinir senha";return o.error_code==="same_password"?a="A nova senha deve ser diferente da senha atual":o.msg?a=o.msg:o.error_description?a=o.error_description:o.message&&(a=o.message),e.json({error:a},400)}const i=await n.json();return console.log("✅ Password reset successful"),i.access_token&&se(e,"sb-access-token",i.access_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),i.refresh_token&&se(e,"sb-refresh-token",i.refresh_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0,message:"Senha alterada com sucesso!"})}catch{return e.json({error:"Failed to reset password"},500)}});async function Hr(e,t,r,s){try{return await new $i(t,r).query("users",{select:"id, email, isadmin",filters:{email:e,isadmin:!0},single:!0},s)!==null}catch(n){return console.error("Error checking admin access in Supabase users:",n),!1}}async function j(e,t){const r=G(e,"sb-access-token");if(!r)return e.json({error:"Unauthorized"},401);const s=await Y(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!s)return e.json({error:"Invalid token"},401);if(!await Hr(s.email,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY,r))return e.json({error:"Forbidden - Admin only"},403);e.set("user",s),await t()}I.get("/api/admin/check",async e=>{const t=G(e,"sb-access-token");if(!t)return e.json({isAdmin:!1});const r=await Y(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({isAdmin:!1});const s=await Hr(r.email,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY,t);return e.json({isAdmin:s})});I.post("/api/admin/impersonate",j,async e=>{try{const{user_email:t}=await e.req.json();if(!t)return e.json({error:"user_email is required"},400);console.log(`🎭 Admin impersonating user: ${t}`);const s=await q(e).query("users",{select:"*",filters:{email:t}});if(!s||s.length===0)return e.json({error:"User not found"},404);const n=s[0],i={email:t,nome:n.nome||"Usuário",impersonated:!0,impersonated_at:new Date().toISOString(),user_id:n.id,signature:Buffer.from(`${t}:${e.env.SUPABASE_ANON_KEY}`).toString("base64")},o=`IMPERSONATE:${Buffer.from(JSON.stringify(i)).toString("base64")}`;return console.log(`✅ Impersonation token created for ${t}`),e.json({token:o,user_email:t,user_name:n.nome})}catch(t){return console.error("Impersonation error:",t),e.json({error:t.message||"Failed to impersonate user"},500)}});I.post("/api/admin/courses",j,async e=>{try{const{title:t,description:r,duration_hours:s,instructor:n,offers_certificate:i,is_published:o}=await e.req.json(),c=await q(e).insert("courses",{title:t,description:r||null,duration_hours:s||0,instructor:n||"Vicelmo",offers_certificate:i!==void 0?i:!0,is_published:o!==void 0?o:!0});return e.json({success:!0,course_id:c[0].id})}catch(t){return console.error("Create course error:",t),e.json({error:t.message||"Failed to create course"},500)}});I.put("/api/admin/courses/:id",j,async e=>{try{const t=e.req.param("id"),{title:r,description:s,duration_hours:n,instructor:i,offers_certificate:o,is_published:a}=await e.req.json();return await q(e).update("courses",{id:t},{title:r,description:s||null,duration_hours:n||0,instructor:i||"Vicelmo",offers_certificate:o!==void 0?o:!0,is_published:a!==void 0?a:!0}),e.json({success:!0})}catch{return e.json({error:"Failed to update course"},500)}});I.delete("/api/admin/courses/:id",j,async e=>{try{const t=e.req.param("id");return await q(e).delete("courses",{id:t}),e.json({success:!0})}catch{return e.json({error:"Failed to delete course"},500)}});I.get("/api/admin/courses/find",j,async e=>{try{const t=e.req.query("title");if(!t)return e.json({error:"Title is required"},400);const s=await q(e).query("courses",{select:"*",filters:{title:t},limit:1});return s&&s.length>0?e.json({course:s[0]}):e.json({course:null})}catch(t){return console.error("Find course error:",t),e.json({error:t.message||"Failed to find course"},500)}});I.post("/api/admin/modules",j,async e=>{try{const{course_id:t,title:r,description:s,order_index:n}=await e.req.json(),o=await q(e).insert("modules",{course_id:t,title:r,description:s||null,order_index:n||0});return e.json({success:!0,module_id:o[0].id})}catch(t){return console.error("Create module error:",t),e.json({error:t.message||"Failed to create module"},500)}});I.put("/api/admin/modules/:id",j,async e=>{try{const t=e.req.param("id"),{title:r,description:s,order_index:n}=await e.req.json();return await q(e).update("modules",{id:t},{title:r,description:s||null,order_index:n}),e.json({success:!0})}catch{return e.json({error:"Failed to update module"},500)}});I.delete("/api/admin/modules/:id",j,async e=>{try{const t=e.req.param("id");return await q(e).delete("modules",{id:t}),e.json({success:!0})}catch{return e.json({error:"Failed to delete module"},500)}});I.get("/api/admin/modules/find",j,async e=>{try{const t=e.req.query("course_id"),r=e.req.query("title");if(!t||!r)return e.json({error:"course_id and title are required"},400);const n=await q(e).query("modules",{select:"*",filters:{course_id:t,title:r},limit:1});return n&&n.length>0?e.json({module:n[0]}):e.json({module:null})}catch(t){return console.error("Find module error:",t),e.json({error:t.message||"Failed to find module"},500)}});I.post("/api/admin/lessons",j,async e=>{try{const{module_id:t,title:r,description:s,video_provider:n,video_id:i,duration_minutes:o,order_index:a,free_trial:c,support_text:u,transcript:l,attachments:f,rentable:d,rental_credits:h}=await e.req.json();let m=null;n&&i&&(n==="youtube"?m=`https://www.youtube.com/watch?v=${i}`:n==="vimeo"?m=`https://vimeo.com/${i}`:m=i);const v=await q(e).insert("lessons",{module_id:t,title:r,description:s||null,video_url:m,video_provider:n||null,video_id:i||null,duration_minutes:o||0,order_index:a||0,teste_gratis:c||!1,support_text:u||null,transcript:l||null,attachments:JSON.stringify(f||[]),rentable:d||!1,rental_credits:h||0});return e.json({success:!0,lesson_id:v[0].id})}catch(t){return console.error("Create lesson error:",t),e.json({error:t.message||"Failed to create lesson"},500)}});I.post("/api/admin/lessons-reorder",j,async e=>{try{const{lessons:t}=await e.req.json();if(!Array.isArray(t))return e.json({error:"lessons must be an array"},400);const r=q(e);for(const{id:s,order_index:n}of t)await r.update("lessons",{id:Number(s)},{order_index:Number(n)});return e.json({success:!0})}catch(t){return console.error("Reorder lessons error:",t),e.json({error:t.message||"Failed to reorder lessons"},500)}});I.put("/api/admin/lessons/:id",j,async e=>{try{const t=e.req.param("id"),{title:r,description:s,video_provider:n,video_id:i,duration_minutes:o,order_index:a,free_trial:c,support_text:u,transcript:l,attachments:f,rentable:d,rental_credits:h}=await e.req.json();let m=null;n&&i&&(n==="youtube"?m=`https://www.youtube.com/watch?v=${i}`:n==="vimeo"?m=`https://vimeo.com/${i}`:m=i);const b=q(e),v=parseInt(t);await b.update("lessons",{id:v},{title:r,description:s||null,video_url:m,video_provider:n||null,video_id:i||null,duration_minutes:parseInt(o)||0,order_index:parseInt(a)||0,teste_gratis:c===!0||c==="true"});try{await b.sql("UPDATE lessons SET support_text = $1, transcript = $2, attachments = $3::jsonb WHERE id = $4",[u||null,l||null,JSON.stringify(f||[]),v])}catch(p){console.warn("support_text/transcript/attachments columns may not exist:",p.message)}return await b.sql("UPDATE lessons SET rentable = $1, rental_credits = $2 WHERE id = $3",[d===!0||d==="true",parseInt(h)||0,v]),e.json({success:!0})}catch(t){return console.error("Update lesson error:",t),e.json({error:t.message||"Failed to update lesson"},500)}});I.post("/api/admin/lessons/:id/generate-transcript",j,async e=>{var t,r,s;try{const n=parseInt(e.req.param("id")),{context:i}=await e.req.json(),a=await q(e).sql("SELECT title, transcript FROM lessons WHERE id = $1",[n]);if(!a.length)return e.json({error:"Aula não encontrada"},404);const c=a[0];if(!c.transcript)return e.json({error:"Esta aula não possui transcrição para estruturar."},400);const u=e.env.VITE_OPENROUTER_API_KEY;if(!u)return e.json({error:"VITE_OPENROUTER_API_KEY não configurada no ambiente"},500);const l="Você é um especialista em direito trabalhista, liquidação de sentença judicial e uso do software PJe-Calc. Sua tarefa é pegar transcrições brutas de aulas e organizá-las em Markdown estruturado, claro e didático.",f=`Abaixo está a transcrição bruta de uma aula chamada "${c.title}".${i?`

Instruções adicionais: ${i}`:""}

Organize essa transcrição em Markdown estruturado, sem inventar conteúdo. Apenas reorganize, agrupe por tópicos e formate o que já está no texto:
- Título principal com #
- Tópicos e subtópicos com ## e ###
- Conceitos importantes em **negrito**
- > Blockquote para trechos de destaque ou alertas
- Listas com - quando houver enumerações
- Um **Resumo** ao final com os pontos principais

Transcrição bruta:
---
${c.transcript}
---`,d=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`,"HTTP-Referer":"https://cct2026.com.br","X-Title":"CCT2026 Admin"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"system",content:l},{role:"user",content:f}]})});if(!d.ok){const b=await d.text();return e.json({error:`Erro na API OpenRouter: ${b}`},500)}const m=((s=(r=(t=(await d.json()).choices)==null?void 0:t[0])==null?void 0:r.message)==null?void 0:s.content)||"";return e.json({transcript:m})}catch(n){return console.error("Generate transcript error:",n),e.json({error:n.message||"Erro ao gerar transcrição"},500)}});I.delete("/api/admin/lessons/:id",j,async e=>{try{const t=e.req.param("id");return await q(e).delete("lessons",{id:t}),e.json({success:!0})}catch{return e.json({error:"Failed to delete lesson"},500)}});I.post("/api/lessons/:id/rent",K,async e=>{try{const t=parseInt(e.req.param("id")),s=e.get("user").email,n=q(e);await Mr(n);const i=await n.sql("SELECT id, title, rentable, rental_credits FROM lessons WHERE id = $1",[t]);if(!i.length||!i[0].rentable)return e.json({error:"Esta aula não está disponível para aluguel"},400);const o=i[0],a=parseInt(o.rental_credits);if(!Number.isFinite(a)||a<=0)return e.json({error:"Créditos de aluguel inválidos para esta aula"},400);const c=await n.sql("SELECT expires_at FROM lesson_rentals WHERE user_email = $1 AND lesson_id = $2 AND expires_at > NOW()",[s,t]);if(c.length>0)return e.json({error:"Você já possui acesso ativo a esta aula",expires_at:c[0].expires_at},400);const u=e.env.DATABASE_URL_CREDITOS||e.env.DATABASE_SUITEPLUS;console.log("Credits DB configured:",!!u,"| prefix:",u==null?void 0:u.substring(0,30));const l=Kn(e),f=await Or(l,s);if(f<a)return e.json({error:"Créditos insuficientes",available:f,required:a},400);if(!await _o(l,s,a)){const h=await Or(l,s);return e.json({error:"Créditos insuficientes",available:h,required:a},400)}return await n.sql(`INSERT INTO lesson_rentals (user_email, lesson_id, credits_paid, rented_at, expires_at)
       VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '30 days')
       ON CONFLICT (user_email, lesson_id)
       DO UPDATE SET credits_paid = $3, rented_at = NOW(), expires_at = NOW() + INTERVAL '30 days'`,[s,t,a]),e.json({success:!0,message:"Aula alugada com sucesso! Acesso liberado por 30 dias."})}catch(t){return console.error("Rent lesson error:",t),e.json({error:t.message||"Erro ao processar aluguel"},500)}});I.get("/api/user/rentals",K,async e=>{try{const t=e.get("user"),r=q(e);await Mr(r);const s=await r.sql(`SELECT lr.id, lr.lesson_id, lr.credits_paid, lr.rented_at, lr.expires_at,
              lr.expires_at > NOW() AS is_active,
              l.title AS lesson_title, l.description AS lesson_description,
              l.duration_minutes, l.video_provider,
              m.title AS module_title,
              co.title AS course_title, co.id AS course_id
       FROM lesson_rentals lr
       JOIN lessons l ON l.id = lr.lesson_id
       JOIN modules m ON m.id = l.module_id
       JOIN courses co ON co.id = m.course_id
       WHERE lr.user_email = $1
       ORDER BY lr.expires_at DESC`,[t.email]);return e.json({rentals:s})}catch(t){return console.error("Get rentals error:",t),e.json({error:t.message||"Erro ao buscar aluguéis"},500)}});async function Te(e){await e.sql(`
    CREATE TABLE IF NOT EXISTS trails (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      is_published BOOLEAN DEFAULT FALSE,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `),await e.sql(`
    CREATE TABLE IF NOT EXISTS trail_lessons (
      id SERIAL PRIMARY KEY,
      trail_id INTEGER NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
      lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(trail_id, lesson_id)
    )
  `),await e.sql("CREATE INDEX IF NOT EXISTS idx_trail_lessons_trail ON trail_lessons(trail_id)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_trail_lessons_lesson ON trail_lessons(lesson_id)")}I.get("/api/trails",K,async e=>{try{const t=e.get("user"),r=q(e);await Te(r);const s=await r.sql(`
      SELECT t.*,
             COUNT(tl.id)::int AS lessons_count,
             COUNT(up.id)::int AS completed_count
      FROM trails t
      LEFT JOIN trail_lessons tl ON tl.trail_id = t.id
      LEFT JOIN lessons l ON l.id = tl.lesson_id
      LEFT JOIN user_progress up ON up.lesson_id = tl.lesson_id AND up.user_email = $1 AND up.completed = true
      WHERE t.is_published = true
      GROUP BY t.id
      ORDER BY t.order_index ASC, t.created_at DESC
    `,[t.email]);return e.json({trails:s})}catch(t){return console.error("Get trails error:",t),e.json({error:t.message||"Erro ao buscar trilhas"},500)}});I.get("/api/trails/:id",K,async e=>{try{const t=e.req.param("id"),r=e.get("user"),s=q(e);await Te(s);const n=await s.sql("SELECT * FROM trails WHERE id = $1",[t]);if(!n.length)return e.json({error:"Trilha não encontrada"},404);const i=n[0],o=await s.sql(`
      SELECT tl.order_index, tl.lesson_id,
             l.title, l.description, l.duration_minutes, l.video_provider, l.teste_gratis, l.rentable, l.rental_credits,
             m.title AS module_title,
             co.id AS course_id, co.title AS course_title,
             CASE WHEN up.completed = true THEN true ELSE false END AS is_completed
      FROM trail_lessons tl
      JOIN lessons l ON l.id = tl.lesson_id
      JOIN modules m ON m.id = l.module_id
      JOIN courses co ON co.id = m.course_id
      LEFT JOIN user_progress up ON up.lesson_id = tl.lesson_id AND up.user_email = $2 AND up.completed = true
      WHERE tl.trail_id = $1
      ORDER BY tl.order_index ASC
    `,[t,r.email]);return e.json({trail:i,lessons:o})}catch(t){return console.error("Get trail error:",t),e.json({error:t.message||"Erro ao buscar trilha"},500)}});I.get("/api/admin/trails",j,async e=>{try{const t=q(e);await Te(t);const r=await t.sql(`
      SELECT t.*, COUNT(tl.id)::int AS lessons_count
      FROM trails t
      LEFT JOIN trail_lessons tl ON tl.trail_id = t.id
      GROUP BY t.id
      ORDER BY t.order_index ASC, t.created_at DESC
    `);return e.json({trails:r})}catch(t){return e.json({error:t.message},500)}});I.post("/api/admin/trails",j,async e=>{try{const{title:t,description:r,is_published:s,order_index:n}=await e.req.json();if(!t)return e.json({error:"title is required"},400);const i=q(e);await Te(i);const o=await i.insert("trails",{title:t,description:r||null,is_published:s??!1,order_index:n??0});return e.json({success:!0,trail_id:o[0].id,trail:o[0]})}catch(t){return e.json({error:t.message},500)}});I.put("/api/admin/trails/:id",j,async e=>{try{const t=parseInt(e.req.param("id")),r=await e.req.json(),s=q(e);await Te(s);const n=["title","description","is_published","order_index"],i={updated_at:new Date().toISOString()};for(const o of n)o in r&&(i[o]=r[o]);return await s.update("trails",{id:t},i),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});I.delete("/api/admin/trails/:id",j,async e=>{try{const t=parseInt(e.req.param("id")),r=q(e);return await Te(r),await r.delete("trails",{id:t}),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});I.post("/api/admin/trails/:id/lessons",j,async e=>{var t;try{const r=parseInt(e.req.param("id")),{lesson_id:s}=await e.req.json();if(!s)return e.json({error:"lesson_id required"},400);const n=q(e);await Te(n);const o=(((t=(await n.sql("SELECT COALESCE(MAX(order_index), -1) AS max_idx FROM trail_lessons WHERE trail_id = $1",[r]))[0])==null?void 0:t.max_idx)??-1)+1;return await n.sql("INSERT INTO trail_lessons (trail_id, lesson_id, order_index) VALUES ($1, $2, $3) ON CONFLICT (trail_id, lesson_id) DO NOTHING",[r,s,o]),e.json({success:!0})}catch(r){return e.json({error:r.message},500)}});I.delete("/api/admin/trails/:id/lessons/:lessonId",j,async e=>{try{const t=parseInt(e.req.param("id")),r=parseInt(e.req.param("lessonId"));return await q(e).sql("DELETE FROM trail_lessons WHERE trail_id = $1 AND lesson_id = $2",[t,r]),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});I.post("/api/admin/trails/:id/reorder",j,async e=>{try{const t=parseInt(e.req.param("id")),{lessons:r}=await e.req.json();if(!Array.isArray(r))return e.json({error:"lessons array required"},400);const s=q(e);for(const n of r)await s.sql("UPDATE trail_lessons SET order_index = $1 WHERE trail_id = $2 AND lesson_id = $3",[n.order_index,t,n.lesson_id]);return e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});I.get("/api/admin/trails/search-lessons",j,async e=>{try{const t=e.req.query("q")||"",r=e.req.query("course_id"),s=q(e),n=r?`AND co.id = ${parseInt(r)}`:"",i=t?"AND (l.title ILIKE $1)":"",o=t?[`%${t}%`]:[],a=await s.sql(`
      SELECT l.id, l.title, l.duration_minutes, l.teste_gratis, l.rentable, l.rental_credits,
             m.title AS module_title,
             co.id AS course_id, co.title AS course_title
      FROM lessons l
      JOIN modules m ON m.id = l.module_id
      JOIN courses co ON co.id = m.course_id
      WHERE 1=1 ${n} ${i}
      ORDER BY co.title ASC, m.order_index ASC, l.order_index ASC
      LIMIT 50
    `,o);return e.json({lessons:a})}catch(t){return e.json({error:t.message},500)}});I.get("/api/admin/lessons/find",j,async e=>{try{const t=e.req.query("module_id"),r=e.req.query("title");if(!t||!r)return e.json({error:"module_id and title are required"},400);const n=await q(e).query("lessons",{select:"*",filters:{module_id:t,title:r},limit:1});return n&&n.length>0?e.json({lesson:n[0]}):e.json({lesson:null})}catch(t){return console.error("Find lesson error:",t),e.json({error:t.message||"Failed to find lesson"},500)}});I.post("/api/admin/run-migration-lesson-fields",j,async e=>{try{const t=q(e);return await t.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS support_text TEXT"),await t.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS transcript TEXT"),await t.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb"),await Mr(t),e.json({success:!0,message:"Migration applied successfully"})}catch(t){return console.error("Migration error:",t),e.json({error:t.message},500)}});I.get("/api/admin/users",j,async e=>{try{const r=await q(e).query("users",{select:"*",order:"created_at DESC"});return e.json({users:r})}catch(t){return console.error("Get users error:",t),e.json({error:t.message||"Failed to fetch users"},500)}});I.get("/api/admin/users/find",j,async e=>{try{const t=e.req.query("email");if(!t)return e.json({error:"Email is required"},400);const s=await q(e).query("users",{select:"*",filters:{email:t},limit:1});return s&&s.length>0?e.json({user:s[0]}):e.json({user:null})}catch(t){return console.error("Find user error:",t),e.json({error:t.message||"Failed to find user"},500)}});I.post("/api/admin/users",j,async e=>{try{const t=await e.req.json();if(!t.email)return e.json({error:"Email is required"},400);const s=await q(e).insert("users",{email:t.email,nome:t.nome||null,first_name:t.first_name||null,last_name:t.last_name||null,cpf:t.cpf||null,telefone:t.telefone||null,whatsapp:t.whatsapp||null,foto:t.foto||null,end_cep:t.end_cep||null,end_logradouro:t.end_logradouro||null,end_numero:t.end_numero||null,end_cidade:t.end_cidade||null,end_estado:t.end_estado||null,ativo:t.ativo!==void 0?t.ativo:!0,teste_gratis:t.teste_gratis||!1,dt_expiracao:t.dt_expiracao||null});return e.json({success:!0,user_id:s[0].id})}catch(t){return console.error("Create user error:",t),e.json({error:t.message||"Failed to create user"},500)}});I.put("/api/admin/users/:id",j,async e=>{try{const t=e.req.param("id"),r=await e.req.json();return await q(e).update("users",{id:t},{nome:r.nome,first_name:r.first_name,last_name:r.last_name,cpf:r.cpf,telefone:r.telefone,whatsapp:r.whatsapp,foto:r.foto,end_cep:r.end_cep,end_logradouro:r.end_logradouro,end_numero:r.end_numero,end_cidade:r.end_cidade,end_estado:r.end_estado,ativo:r.ativo,teste_gratis:r.teste_gratis,dt_expiracao:r.dt_expiracao,updated_at:new Date().toISOString()}),e.json({success:!0})}catch(t){return console.error("Update user error:",t),e.json({error:t.message||"Failed to update user"},500)}});I.delete("/api/admin/users/:id",j,async e=>{try{const t=e.req.param("id");return await q(e).delete("users",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete user error:",t),e.json({error:t.message||"Failed to delete user"},500)}});I.get("/api/admin/certificates",j,async e=>{try{const r=await q(e).query("certificates",{select:"*",order:"created_at DESC"});return e.json({certificates:r||[]})}catch(t){return console.error("List certificates error:",t),e.json({error:t.message||"Failed to list certificates"},500)}});I.get("/api/admin/certificates/:id",j,async e=>{try{const t=e.req.param("id"),s=await q(e).query("certificates",{select:"*",filters:{id:t}});return!s||s.length===0?e.json({error:"Certificate not found"},404):e.json({certificate:s[0]})}catch(t){return console.error("Get certificate error:",t),e.json({error:t.message||"Failed to get certificate"},500)}});I.get("/api/admin/certificates/find",j,async e=>{try{const t=e.req.query("email"),r=e.req.query("course");if(!t||!r)return e.json({error:"Email and course parameters are required"},400);const n=await q(e).query("certificates",{select:"*",filters:{user_email:t,course_title:r}});return e.json({certificates:n||[]})}catch(t){return console.error("Find certificate error:",t),e.json({error:t.message||"Failed to find certificate"},500)}});I.post("/api/admin/certificates",j,async e=>{try{const t=await e.req.json();if(!t.user_email||!t.course_title)return e.json({error:"Email and course title are required"},400);const r=q(e),s=new Date().toISOString(),n=await r.insert("certificates",{user_email:t.user_email,user_name:t.user_name||"Aluno",course_id:t.course_id||null,course_title:t.course_title,issued_at:t.issued_at||s,completion_date:t.completion_date||s,carga_horaria:t.carga_horaria||null,certificate_code:t.certificate_code||null,generated_at:t.generated_at||null});return e.json({success:!0,certificate_id:n&&n.length>0?n[0].id:null})}catch(t){return console.error("Create certificate error:",t),e.json({error:t.message||"Failed to create certificate"},500)}});I.put("/api/admin/certificates/:id",j,async e=>{try{const t=e.req.param("id"),r=await e.req.json(),s=q(e);let n=r.course_title;if(r.course_id){const i=await s.query("courses",{select:"title",filters:{id:r.course_id}});i&&i.length>0&&(n=i[0].title)}return await s.update("certificates",{id:t},{user_email:r.user_email,user_name:r.user_name,course_id:r.course_id,course_title:n,carga_horaria:r.carga_horaria,updated_at:new Date().toISOString()}),e.json({success:!0})}catch(t){return console.error("Update certificate error:",t),e.json({error:t.message||"Failed to update certificate"},500)}});I.delete("/api/admin/certificates/:id",j,async e=>{try{const t=e.req.param("id");return await q(e).delete("certificates",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete certificate error:",t),e.json({error:t.message||"Failed to delete certificate"},500)}});function Po(e){const t=!!e.templateImageUrl,r=!!e.versoImageUrl,s=e.modules&&e.modules.length>0;if(t){const u=s?e.modules.map((f,d)=>`<div class="mod-item"><span class="mod-num">${String(d+1).padStart(2,"0")}.</span> ${f}</div>`).join(""):"",l=r?`
    <div class="page verso-page">
      <img class="bg-img" src="${e.versoImageUrl}" alt="Verso do certificado">
      ${s?`
      <div class="verso-overlay">
        <div class="mod-grid">${u}</div>
      </div>`:""}
    </div>`:"";return`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Certificado - ${e.studentName}</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 297mm; background: #555; }

    .page {
      width: 297mm;
      height: 210mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      background: #fff;
    }
    .bg-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* ── Campos sobrepostos na frente ── */

    /* Nome do aluno: linha em branco abaixo de "Certificamos que" (~50% do topo) */
    .field-nome {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      width: 70%;
      font-family: 'Georgia', serif;
      font-size: 20pt;
      font-weight: bold;
      color: #1a1a1a;
      letter-spacing: 1px;
    }

    /* Carga horária: abaixo do nome do curso (~68% do topo) */
    .field-carga {
      position: absolute;
      left: 50%;
      top: 68%;
      transform: translateX(-50%);
      text-align: center;
      font-family: 'Georgia', serif;
      font-size: 11pt;
      color: #333;
    }
    .field-carga strong { font-size: 13pt; color: #1a1a1a; }

    /* Data: campo DATA no rodapé esquerdo (~83% do topo, ~17% da esquerda) */
    .field-data {
      position: absolute;
      left: 17%;
      top: 83%;
      transform: translateX(-50%);
      text-align: center;
      font-family: 'Georgia', serif;
      font-size: 10pt;
      color: #1a1a1a;
    }

    /* Data de início: ~74% topo, posicionada na linha do início */
    .field-data-inicio {
      position: absolute;
      left: 62%;
      top: 71.5%;
      font-family: 'Georgia', serif;
      font-size: 10pt;
      color: #1a1a1a;
    }

    /* Data de final: ~78% topo, posicionada na linha do final */
    .field-data-final {
      position: absolute;
      left: 62%;
      top: 78%;
      font-family: 'Georgia', serif;
      font-size: 10pt;
      color: #1a1a1a;
    }

    /* Código de verificação: rodapé direito */
    .field-codigo {
      position: absolute;
      right: 6mm;
      bottom: 4mm;
      text-align: right;
      font-family: Arial, sans-serif;
      font-size: 7pt;
      color: #555;
      max-width: 70mm;
    }
    .field-codigo a { color: #c00; text-decoration: none; word-break: break-all; }

    /* ── Overlay verso: módulos ── */
    .verso-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18mm 22mm;
    }
    .mod-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5px 20px;
      width: 100%;
    }
    .mod-item {
      font-family: Georgia, serif;
      font-size: 10pt;
      color: #1a2e4a;
      padding: 4px 0;
      border-bottom: 1px solid rgba(26,46,74,0.15);
      line-height: 1.3;
    }
    .mod-num { font-weight: bold; margin-right: 4px; color: #c00; }

    @media print {
      html, body { background: white; }
      .page { box-shadow: none; }
    }
  </style>
</head>
<body>

  <!-- FRENTE -->
  <div class="page frente-page">
    <img class="bg-img" src="${e.templateImageUrl}" alt="Frente do certificado">

    <div class="field-nome">${e.studentName}</div>

    <div class="field-carga"><strong>${e.workload} horas</strong></div>

    ${e.startDate?`<div class="field-data-inicio">${e.startDate}</div>`:""}
    ${e.completionDate?`<div class="field-data-final">${e.completionDate}</div>`:""}
    <div class="field-data">${e.completionDate||e.startDate||""}</div>

    ${e.verificationCode?`
    <div class="field-codigo">
      Cód.: ${e.verificationCode}<br>
      <a href="${e.verificationUrl}">${e.verificationUrl}</a>
    </div>`:""}
  </div>

  ${l}

</body>
</html>`}const n=`<svg viewBox="0 0 115 78" xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" style="display:block;width:100%;height:100%;">
    <path d="M 0 0 L 110 0 C 130 0 114 28 62 58 C 38 72 8 79 0 79 Z" fill="#1a1a2e"/>
    <path d="M 0 0 L 90 0 C 108 0 93 23 48 50 C 27 63 4 70 0 67 Z" fill="#c0392b"/>
  </svg>`,i=`<svg viewBox="0 0 80 108" xmlns="http://www.w3.org/2000/svg" width="66" height="89">
    <path d="M 22 72 L 8 108 L 23 95 L 40 104 L 57 95 L 72 108 L 58 72 Z" fill="#c0392b"/>
    <circle cx="40" cy="38" r="36" fill="#1a1a2e"/>
    <circle cx="40" cy="38" r="32" fill="none" stroke="#c0a84a" stroke-width="1.5"/>
    <circle cx="40" cy="38" r="26.5" fill="none" stroke="#c0a84a" stroke-width="0.6"/>
    <text x="34" y="54" font-family="Georgia,serif" font-size="30" font-weight="bold" fill="white">e</text>
    <polygon points="56,33 65,38 59,40 62,50 57,51 55,41 49,44" fill="#ccc" opacity="0.75"/>
  </svg>`,o=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="47" fill="none" stroke="#555" stroke-width="5"/>
    <circle cx="50" cy="50" r="39" fill="none" stroke="#555" stroke-width="1"/>
    <text x="31" y="70" font-family="Georgia,serif" font-size="58" font-weight="bold" fill="#555">e</text>
    <polygon points="70,43 80,48 73,51 76,61 71,62 68,52 62,55" fill="#555" opacity="0.6"/>
  </svg>`,a=`
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; background: #ccc; }

    /* ── Página ── */
    .page {
      width: 297mm; height: 210mm;
      position: relative; overflow: hidden;
      background: #f8f7f5;
      display: grid;
      grid-template-rows: 46mm 26mm 1fr 42mm;
    }
    .page:not(:last-child) { page-break-after: always; }

    /* ── Cantos em swoosh curvo ── */
    .corner-tl {
      position: absolute; top: 0; left: 0; z-index: 1;
      width: 105mm; height: 65mm; pointer-events: none;
    }
    .corner-br {
      position: absolute; bottom: 0; right: 0; z-index: 1;
      width: 105mm; height: 65mm; pointer-events: none;
      transform: rotate(180deg);
    }

    /* ── Borda ornamental fina ── */
    .cert-border {
      position: absolute; inset: 5.5mm; z-index: 4;
      border: 1px solid #c0c0c0; pointer-events: none;
    }

    /* ── Marca d'água ── */
    .watermark {
      position: absolute; right: 14mm; top: 50%;
      transform: translateY(-50%); opacity: 0.055; z-index: 1;
      width: 58mm; height: 58mm; pointer-events: none;
    }

    /* ── Logo (centralizado) ── */
    .logo-section {
      position: relative; z-index: 5;
      display: flex; align-items: center; justify-content: center;
      padding-top: 9mm;
    }
    .logo-img { height: 28mm; width: auto; }

    /* ── Título CERTIFICADO ── */
    .title-section {
      position: relative; z-index: 5;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 1.5mm;
    }
    .title-row {
      display: flex; align-items: center; gap: 5mm;
    }
    .title-line { width: 35mm; height: 1px; background: #999; }
    .title-ornament-side { font-size: 11px; color: #888; }
    .cert-title {
      font-size: 40px; font-weight: bold; color: #1a1a2e;
      letter-spacing: 7px; font-style: italic;
    }
    .title-sub-ornament { font-size: 18px; color: #bbb; letter-spacing: 5px; }

    /* ── Corpo ── */
    .body-section {
      position: relative; z-index: 5;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 0 50mm; text-align: center; gap: 2.5mm;
    }
    .pre-text { font-size: 15px; color: #666; }
    .student-name {
      font-size: 30px; font-weight: bold; color: #1a1a2e;
      border-bottom: 1px solid #777;
      padding: 0 18mm 2mm; white-space: nowrap;
    }
    .cert-desc { font-size: 14px; color: #444; line-height: 1.7; max-width: 155mm; }
    .cert-dates { font-size: 13.5px; color: #555; margin-top: 3mm; letter-spacing: 0.2px; }

    /* ── Rodapé ── */
    .footer-section {
      position: relative; z-index: 5;
      display: flex; align-items: flex-end; justify-content: space-between;
      padding: 3mm 16mm 8mm;
      border-top: 1px solid #aaa;
    }
    .f-left { flex: 1; display: flex; align-items: flex-end; gap: 4mm; }
    .f-center { text-align: center; flex: 0 0 74mm; display: flex; align-items: flex-end; justify-content: center; }
    .f-right { text-align: right; flex: 1; }
    .f-line { display: block; height: 1px; background: #999; margin-bottom: 2.5mm; }
    .f-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #aaa; font-family: Arial,sans-serif; }
    .f-value { font-size: 12px; color: #1a1a2e; margin-top: 1mm; }
    .f-sig-name { font-style: italic; font-size: 15px; color: #1a1a2e; }
    .f-sig-role { font-size: 8px; text-transform: uppercase; letter-spacing: 2px; color: #aaa; font-family: Arial,sans-serif; margin-top: 1mm; }
    .qr-wrap { flex-shrink: 0; }
    .qr-wrap svg { width: 55px !important; height: 55px !important; display: block; }
    .qr-meta { font-size: 7.5px; color: #aaa; font-family: Arial,sans-serif; }
    .qr-meta span { display: block; }

    .verif-code {
      position: absolute; bottom: 2.5mm; left: 0; right: 0;
      text-align: center; font-size: 7px; color: #ccc; font-family: Arial; z-index: 6;
    }

    /* ── Botão de impressão ── */
    .print-btn {
      position: fixed; top: 14px; right: 14px; z-index: 9999;
      background: #c0392b; color: #fff; border: none; border-radius: 6px;
      padding: 10px 22px; font-size: 14px; font-weight: bold;
      cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.25); font-family: Arial;
    }
    .print-btn:hover { background: #a93226; }
    @media print { .print-btn { display: none !important; } body { background: white; } }

    /* ── VERSO ── */
    .verso-body {
      position: relative; z-index: 5;
      display: flex; flex-direction: column; align-items: center;
      padding: 4mm 16mm 0;
    }
    .verso-title { font-size: 15px; font-weight: bold; color: #1a1a2e; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 2mm; }
    .verso-sub { font-size: 9.5px; color: #999; font-style: italic; margin-bottom: 5mm; }
    .modules-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3px 16px; width: 100%; }
    .mod-item { font-size: 9.5px; color: #333; padding: 3px 7px; border-left: 3px solid #c0392b; background: #f5f4f2; line-height: 1.3; }
    .mod-num { font-weight: bold; color: #c0392b; margin-right: 3px; }
  `,c=s?`
  <div class="page">
    <div class="corner-tl">${n}</div>
    <div class="corner-br">${n}</div>
    <div class="cert-border"></div>
    <div class="watermark">${o}</div>

    <div class="logo-section">
      <img class="logo-img" src="${Kr}" alt="Ensino Plus"/>
    </div>

    <div class="title-section">
      <div class="title-row">
        <span class="title-line"></span>
        <span class="title-ornament-side">&#10022;</span>
        <span style="font-size:14px;color:#888;letter-spacing:3px;">CONTEÚDO PROGRAMÁTICO</span>
        <span class="title-ornament-side">&#10022;</span>
        <span class="title-line"></span>
      </div>
      <div class="title-sub-ornament">&#8764; &#8764; &#8764;</div>
    </div>

    <div class="verso-body">
      <div class="verso-sub">${e.studentName} &mdash; ${e.courseName}</div>
      <div class="modules-grid">
        ${e.modules.map((u,l)=>`
          <div class="mod-item"><span class="mod-num">${String(l+1).padStart(2,"0")}.</span>${u}</div>`).join("")}
      </div>
    </div>

    <div class="footer-section">
      <div class="f-left">
        <div class="f-label">Código de Verificação</div>
        <div class="f-value">${e.verificationCode}</div>
      </div>
      <div class="f-center">${i}</div>
      <div class="f-right">
        <span class="f-line"></span>
        <div class="f-sig-name">Nárgila de Souza Santos</div>
        <div class="f-sig-role">DIRETORA</div>
      </div>
    </div>
  </div>`:"";return`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Certificado &mdash; Ensino Plus</title>
  <style>${a}</style>
</head>
<body>

  <button class="print-btn" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>

  <!-- FRENTE -->
  <div class="page">
    <div class="corner-tl">${n}</div>
    <div class="corner-br">${n}</div>
    <div class="cert-border"></div>
    <div class="watermark">${o}</div>

    <!-- Logo centralizado grande -->
    <div class="logo-section">
      <img class="logo-img" src="${Kr}" alt="Ensino Plus"/>
    </div>

    <!-- Título CERTIFICADO ornamental -->
    <div class="title-section">
      <div class="title-row">
        <span class="title-line"></span>
        <span class="title-ornament-side">&#9670;</span>
        <span class="cert-title">CERTIFICADO</span>
        <span class="title-ornament-side">&#9670;</span>
        <span class="title-line"></span>
      </div>
      <div class="title-sub-ornament">&#8764; &#8764; &#8764;</div>
    </div>

    <!-- Corpo -->
    <div class="body-section">
      <div class="pre-text">Certificamos que o(a) aluno(a)</div>
      <div class="student-name">${e.studentName}</div>
      <div class="cert-desc">
        concluiu a carga horária necessária para obtenção do presente certificado
        referente ao curso <strong>${e.courseName}</strong>,
        ministrado pela <strong>Centro de Ensino e Aprendizagem Plus Ltda</strong>
        &ndash; CNPJ: 35.537.045/0001-84, com carga horária total de <strong>${e.workload} horas</strong>.
      </div>
      <div class="cert-dates">
        <span>Início do curso: <strong>${e.startDate||"&mdash;"}</strong></span>
        &nbsp;&nbsp;&nbsp;
        <span>Conclusão: <strong>${e.completionDate||"&mdash;"}</strong></span>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="footer-section">
      <div class="f-left">
        ${e.qrCodeSVG?`<div class="qr-wrap">${e.qrCodeSVG}</div>`:""}
        <div>
          <span class="f-line"></span>
          <div class="f-label">DATA</div>
          <div class="f-value">${e.completionDate||e.startDate||"&mdash;"}</div>
          ${e.qrCodeSVG?`<div class="qr-meta"><span>Escaneie para verificar</span><span>${e.verificationCode}</span></div>`:""}
        </div>
      </div>
      <div class="f-center">${i}</div>
      <div class="f-right">
        <span class="f-line"></span>
        <div class="f-sig-name">Nárgila de Souza Santos</div>
        <div class="f-sig-role">DIRETORA</div>
      </div>
    </div>

    <div class="verif-code">
      Centro de Ensino e Aprendizagem Plus Ltda &mdash; CNPJ: 35.537.045/0001-84
      &nbsp;&nbsp;|&nbsp;&nbsp;
      Cód.: ${e.verificationCode} &nbsp;|&nbsp; ${e.verificationUrl}
    </div>
  </div>

  ${c}

  <script>window.onload=function(){document.querySelectorAll('.qr-wrap svg').forEach(function(s){s.setAttribute('width','60');s.setAttribute('height','60');})}<\/script>

</body>
</html>`}I.get("/api/my-certificates",K,async e=>{try{const r=e.get("user").email;if(!r)return e.json({error:"User email not found"},400);const n=await q(e).query("certificates",{select:"*",filters:{user_email:r},order:"completion_date DESC"});return e.json({certificates:n||[]})}catch(t){return console.error("Get my certificates error:",t),e.json({error:t.message||"Failed to get certificates"},500)}});I.get("/api/certificates/:id/html",K,async e=>{try{const t=e.req.param("id"),s=e.get("user").email,n=q(e),i=await n.query("certificates",{select:"*",filters:{id:t}});if(!i||i.length===0)return e.json({error:"Certificate not found"},404);const o=i[0];if(o.user_email!==s)return e.json({error:"Unauthorized"},403);const a=o.start_date?new Date(o.start_date).toLocaleDateString("pt-BR"):void 0,c=o.completion_date?new Date(o.completion_date).toLocaleDateString("pt-BR"):void 0,u=o.generated_at?new Date(o.generated_at).toLocaleDateString("pt-BR"):new Date().toLocaleDateString("pt-BR"),l=new URL(e.req.url).origin,f=o.certificate_code||o.verification_code||"",d=f?`${l}/verificar/${f}`:"";let h=[];if(o.course_modules)try{h=JSON.parse(o.course_modules).map(E=>E.title||E)}catch(y){console.log("Error parsing course_modules:",y)}if(h.length===0&&o.course_id)try{const y=await n.query("modules",{select:"title, order_index",filters:{course_id:o.course_id},order:"order_index ASC"});y&&y.length>0&&(h=y.map(E=>E.title))}catch(y){console.log("Error fetching modules:",y)}let m,b;if(o.course_id)try{const y=await n.query("certificate_templates",{select:"template_data, template_mime, verso_data, verso_mime",filters:{course_id:o.course_id},single:!0});y!=null&&y.template_data&&(m=`data:${y.template_mime||"image/jpeg"};base64,${y.template_data}`),y!=null&&y.verso_data&&(b=`data:${y.verso_mime||"image/jpeg"};base64,${y.verso_data}`)}catch{console.log("No certificate template found for course",o.course_id)}let v;if(d)try{v=await Ao.toString(d,{type:"svg",margin:1,color:{dark:"#1a1a2e",light:"#f8f7f5"}})}catch(y){console.log("QR code generation failed:",y)}const p=Po({studentName:o.user_name,courseName:o.course_title,workload:o.carga_horaria||"N/A",startDate:a,completionDate:c,issueDate:u,verificationCode:f,verificationUrl:d,qrCodeSVG:v,modules:h.length>0?h:void 0,templateImageUrl:m,versoImageUrl:b});return e.html(p)}catch(t){return console.error("Generate certificate HTML error:",t),e.json({error:t.message||"Failed to generate certificate"},500)}});I.get("/verificar/:code",async e=>{try{const t=e.req.param("code"),r=q(e),s=await r.query("certificates",{select:"*",filters:{certificate_code:t}});if(!s||s.length===0)return e.html(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certificado Não Encontrado - CCT 2026</title>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
        </head>
        <body class="bg-gray-100">
          <div class="min-h-screen flex items-center justify-center p-4">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
              <div class="text-red-500 text-6xl mb-4">❌</div>
              <h1 class="text-2xl font-bold text-gray-800 mb-4">Certificado Não Encontrado</h1>
              <p class="text-gray-600 mb-6">
                O código de verificação <strong>${t}</strong> não foi encontrado em nossa base de dados.
              </p>
              <p class="text-sm text-gray-500">
                Verifique se o código está correto ou entre em contato com o emissor do certificado.
              </p>
              <a href="/" class="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Voltar ao Início
              </a>
            </div>
          </div>
        </body>
        </html>
      `);const n=s[0];try{await r.update("certificates",{id:n.id},{verification_count:(n.verification_count||0)+1})}catch{}const i=n.start_date?new Date(n.start_date).toLocaleDateString("pt-BR"):void 0,o=n.completion_date?new Date(n.completion_date).toLocaleDateString("pt-BR"):void 0,a=n.generated_at?new Date(n.generated_at).toLocaleDateString("pt-BR"):new Date().toLocaleDateString("pt-BR");let c=[];if(n.course_modules)try{c=JSON.parse(n.course_modules).map(f=>f.title||f)}catch(l){console.log("Error parsing course_modules:",l)}if(c.length===0&&n.course_id)try{const l=await r.query("modules",{select:"title, order_index",filters:{course_id:n.course_id},order:"order_index ASC"});l&&l.length>0&&(c=l.map(f=>f.title))}catch(l){console.log("Error fetching modules:",l)}const u=c.length>0?`
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="text-sm font-bold text-gray-700 mb-3">
          <i class="fas fa-list-check mr-2 text-blue-600"></i>Módulos Concluídos:
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${c.map((l,f)=>`
            <div class="flex items-start text-sm text-gray-700">
              <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>${l}</span>
            </div>
          `).join("")}
        </div>
      </div>
      `:"";return e.html(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de Certificado - CCT 2026</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
      </head>
      <body class="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
            <div class="text-center mb-6">
              <div class="text-green-500 text-6xl mb-4">
                <i class="fas fa-certificate"></i>
              </div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">✅ Certificado Verificado</h1>
              <p class="text-gray-600">Este certificado é válido e autêntico</p>
            </div>
            
            <div class="border-t-2 border-b-2 border-blue-200 py-6 my-6">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <span class="text-sm text-gray-500 block">Aluno</span>
                  <span class="text-xl font-bold text-gray-800">${n.user_name}</span>
                </div>
                <div>
                  <span class="text-sm text-gray-500 block">Curso</span>
                  <span class="text-lg font-semibold text-gray-800">${n.course_title}</span>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Carga Horária</span>
                <span class="text-lg font-bold text-blue-600">${n.carga_horaria||"N/A"} horas</span>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Data de Conclusão</span>
                <span class="text-lg font-bold text-blue-600">${o}</span>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Início do Curso</span>
                <span class="text-lg font-bold text-blue-600">${i||"&mdash;"}</span>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Emissão do Certificado</span>
                <span class="text-lg font-bold text-blue-600">${a}</span>
              </div>
            </div>
            
            ${u}
            
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-gray-500 block mb-1">Código de Verificação</span>
                  <span class="text-sm font-mono font-bold text-gray-800">${n.certificate_code}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-500 block mb-1">Emitido em</span>
                  <span class="text-sm font-semibold text-gray-800">${a}</span>
                </div>
              </div>
            </div>
            
            <div class="text-center text-xs text-gray-500">
              <p class="mb-2">
                <i class="fas fa-eye mr-1"></i>
                Este certificado foi verificado ${n.verification_count||1} vez(es)
              </p>
              <p class="text-xs">
                Certificado emitido por<br>
                <strong>Centro de Ensino e Aprendizagem Plus Ltda</strong><br>
                CNPJ: 35.537.045/0001-84
              </p>
            </div>
            
            <div class="mt-6 text-center">
              <a href="/" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                <i class="fas fa-home mr-2"></i>Voltar ao Início
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `)}catch(t){return console.error("Verify certificate error:",t),e.json({error:t.message||"Failed to verify certificate"},500)}});I.get("/api/verify/:code",async e=>{try{const t=e.req.param("code"),r=q(e),s=await r.query("certificates",{select:"*",filters:{certificate_code:t}});if(!s||s.length===0)return e.json({valid:!1,message:"Certificate not found"},404);const n=s[0];try{await r.update("certificates",{id:n.id},{verification_count:(n.verification_count||0)+1})}catch{}return e.json({valid:!0,certificate:{student_name:n.user_name,course_title:n.course_title,workload:n.carga_horaria,completion_date:n.completion_date,issued_at:n.issued_at,certificate_code:n.certificate_code,verification_count:(n.verification_count||0)+1}})}catch(t){return console.error("Verify certificate API error:",t),e.json({error:t.message||"Failed to verify certificate"},500)}});I.get("/api/admin/member-subscriptions",j,async e=>{try{const r=await q(e).query("member_subscriptions",{select:"*",order:"created_at DESC"});return e.json({subscriptions:r||[]})}catch(t){return console.error("List member subscriptions error:",t),e.json({error:t.message||"Failed to list member subscriptions"},500)}});I.get("/api/admin/member-subscriptions/find",j,async e=>{try{const t=e.req.query("email");if(!t)return e.json({error:"Email parameter is required"},400);const s=await q(e).query("member_subscriptions",{select:"*",filters:{email_membro:t}});return e.json({subscriptions:s||[]})}catch(t){return console.error("Find member subscription error:",t),e.json({error:t.message||"Failed to find member subscription"},500)}});I.post("/api/admin/member-subscriptions",j,async e=>{try{const t=await e.req.json();if(!t.email_membro)return e.json({error:"Email is required"},400);const s=await q(e).insert("member_subscriptions",{email_membro:t.email_membro,data_expiracao:t.data_expiracao||null,detalhe:t.detalhe||null,origem:t.origem||null,teste_gratis:t.teste_gratis||!1,ativo:t.ativo!==void 0?t.ativo:!0});return e.json({success:!0,subscription_id:s&&s.length>0?s[0].id:null})}catch(t){return console.error("Create member subscription error:",t),e.json({error:t.message||"Failed to create member subscription"},500)}});I.put("/api/admin/member-subscriptions/:id",j,async e=>{try{const t=e.req.param("id"),r=await e.req.json();return await q(e).update("member_subscriptions",{id:t},{email_membro:r.email_membro,data_expiracao:r.data_expiracao,detalhe:r.detalhe,origem:r.origem,teste_gratis:r.teste_gratis,ativo:r.ativo,updated_at:new Date().toISOString()}),e.json({success:!0})}catch(t){return console.error("Update member subscription error:",t),e.json({error:t.message||"Failed to update member subscription"},500)}});I.delete("/api/admin/member-subscriptions/:id",j,async e=>{try{const t=e.req.param("id");return await q(e).delete("member_subscriptions",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete user error:",t),e.json({error:t.message||"Failed to delete user"},500)}});I.get("/api/courses",async e=>{try{const t=q(e),r=G(e,"sb-access-token");let s=!1;if(r){const a=await Y(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);a&&(s=await Hr(a.email,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY,r))}const n=s?{}:{is_published:!0},i=s?"":"WHERE c.is_published = true",o=await t.sql(`
      SELECT c.*,
             COUNT(DISTINCT m.id)::int AS modules_count,
             COUNT(l.id)::int          AS lessons_count
      FROM courses c
      LEFT JOIN modules m ON m.course_id = c.id
      LEFT JOIN lessons l ON l.module_id = m.id
      ${i}
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);return e.json({courses:o})}catch(t){return console.error("❌ /api/courses error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch courses"},500)}});I.get("/api/courses/:id",async e=>{try{const t=e.req.param("id"),r=q(e),s=await r.query("courses",{select:"*",filters:{id:t},single:!0});if(!s)return e.json({error:"Course not found"},404);const n=await r.query("modules",{select:"*",filters:{course_id:t},order:"order_index"}),i=await r.sql(`SELECT l.* FROM lessons l
       JOIN modules m ON m.id = l.module_id
       WHERE m.course_id = $1
       ORDER BY m.order_index, l.order_index`,[t]),o=new Map;for(const a of i){const c=o.get(a.module_id)||[];c.push(a),o.set(a.module_id,c)}for(const a of n)a.lessons=o.get(a.id)||[];return e.json({course:s,modules:n})}catch(t){return console.error("❌ /api/courses/:id error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch course"},500)}});I.get("/api/lessons/:id",async e=>{var t,r,s;try{const n=e.req.param("id"),i=G(e,"sb-access-token");let o=null;if(i){const m=await Y(i,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);m&&(o=m.email)}const a=q(e);let c=!1,u=!1;if(o)try{const m=await a.rpc("user_has_lesson_access",{email_usuario:o,lesson_id:parseInt(n)});if(console.log("Access check result:",m),Array.isArray(m)&&m.length>0?c=m[0].user_has_lesson_access||m[0]===!0||!!m[0]:typeof m=="boolean"?c=m:m&&typeof m=="object"&&(c=!!m.user_has_lesson_access),console.log("Has access:",c,"User:",o,"Lesson:",n),!c)if((await a.sql("SELECT expires_at FROM lesson_rentals WHERE user_email = $1 AND lesson_id = $2 AND expires_at > NOW()",[o,parseInt(n)])).length>0)c=!0;else{const v=await a.sql("SELECT rentable, rental_credits, title FROM lessons WHERE id = $1",[parseInt(n)]);return console.log("❌ Access denied for user:",o,"lesson:",n),e.json({error:"Access denied",message:"Você não tem permissão para acessar esta aula.",needsUpgrade:!0,rentable:((t=v[0])==null?void 0:t.rentable)||!1,rental_credits:((r=v[0])==null?void 0:r.rental_credits)||0,lesson_title:((s=v[0])==null?void 0:s.title)||""},403)}console.log("✅ Access granted for user:",o,"lesson:",n)}catch(m){console.error("❌ Error checking access via RPC:",m),console.log("⚠️ Allowing access due to RPC error (fallback mode)"),u=!0,c=!0}if(!o||!c&&!u){const m=await a.query("lessons",{select:"teste_gratis",filters:{id:n},single:!0});if(!(m!=null&&m.teste_gratis))return e.json({error:"Access denied",message:"Esta é uma aula premium. Faça login e tenha um plano ativo para acessar.",needsLogin:!0},403)}const f=await a.sql(`
      SELECT l.*, m.title as module_title, c.title as course_title, c.id as course_id
      FROM lessons l
      LEFT JOIN modules m ON l.module_id = m.id
      LEFT JOIN courses c ON m.course_id = c.id
      WHERE l.id = $1
    `,[parseInt(n)]);if(!f||f.length===0)return e.json({error:"Lesson not found"},404);const d=f[0],h=await a.query("comments",{select:"*",filters:{lesson_id:n},order:"created_at DESC"});return e.json({lesson:d,comments:h})}catch(n){return console.error("Error fetching lesson:",n),e.json({error:"Failed to fetch lesson"},500)}});I.post("/api/lessons/:id/comments",async e=>{var t,r;try{const s=e.req.param("id"),{comment_text:n}=await e.req.json(),i=G(e,"sb-access-token");if(!i)return e.json({error:"Unauthorized"},401);const o=await Y(i,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!o)return e.json({error:"Unauthorized"},401);if(!n||!n.trim())return e.json({error:"Comment text is required"},400);const a=((t=o.user_metadata)==null?void 0:t.full_name)||((r=o.email)==null?void 0:r.split("@")[0])||"Usuário",u=await q(e).insert("comments",{lesson_id:parseInt(s),user_name:a,user_email:o.email,comment_text:n.trim()});return e.json({success:!0,comment_id:u[0].id})}catch(s){return console.error("Add comment error:",s),e.json({error:s.message||"Failed to add comment"},500)}});I.get("/api/progress/:email/:courseId",async e=>{try{const t=e.req.param("email"),r=e.req.param("courseId"),i=await q(e).sql(`
      SELECT up.*, l.module_id
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      WHERE up.user_email = $1 AND m.course_id = $2
    `,[t,parseInt(r)]);return e.json({progress:i||[]})}catch(t){return console.error("❌ /api/progress error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch progress"},500)}});I.post("/api/progress/complete",async e=>{try{const{user_email:t,lesson_id:r}=await e.req.json();if(!t||!r)return e.json({error:"Missing required fields"},400);const s=q(e),n=await s.query("user_progress",{select:"*",filters:{user_email:t,lesson_id:r}});return n&&n.length>0?await s.update("user_progress",{id:n[0].id},{completed:!0,completed_at:new Date().toISOString()}):await s.insert("user_progress",{user_email:t,lesson_id:parseInt(r),completed:!0,completed_at:new Date().toISOString()}),e.json({success:!0})}catch{return e.json({error:"Failed to update progress"},500)}});I.post("/api/progress/uncomplete",async e=>{try{const{user_email:t,lesson_id:r}=await e.req.json();if(!t||!r)return e.json({error:"Missing required fields"},400);const s=q(e),n=await s.query("user_progress",{select:"*",filters:{user_email:t,lesson_id:r}});return n&&n.length>0&&await s.delete("user_progress",{id:n[0].id}),e.json({success:!0})}catch{return e.json({error:"Failed to update progress"},500)}});I.post("/api/admin/certificate-template",j,async e=>{try{const t=await e.req.json(),{course_id:r,image_data:s,verso_data:n}=t;if(!r||!s)return e.json({error:"ID do curso e imagem da frente são obrigatórios"},400);const i=b=>{const v=b.match(/^data:([^;]+);base64,/);return v?v[1]:"image/jpeg"},o=b=>b.includes(",")?b.split(",")[1]:b,a=i(s),c=o(s),u=n?i(n):null,l=n?o(n):null,f=`/api/certificate-template/${r}/image`,d=n?`/api/certificate-template/${r}/verso`:null,h=q(e),m=await h.query("certificate_templates",{select:"*",filters:{course_id:r}});if(m&&m.length>0){const b={template_url:f,template_data:c,template_mime:a,updated_at:new Date().toISOString()};n!==void 0&&(b.verso_data=l,b.verso_mime=u),await h.update("certificate_templates",{id:m[0].id},b)}else await h.insert("certificate_templates",{course_id:parseInt(r),template_url:f,template_data:c,template_mime:a,verso_data:l,verso_mime:u,created_at:new Date().toISOString(),updated_at:new Date().toISOString()});return console.log("✅ Certificate template saved to Postgres"),e.json({success:!0,template_url:f,verso_url:d,message:"Template de certificado salvo com sucesso!"})}catch(t){return console.error("💥 Certificate template error:",t),e.json({error:"Erro ao salvar template de certificado",details:t.message},500)}});I.get("/api/certificate-template/:courseId/image",async e=>{try{const t=e.req.param("courseId"),s=await q(e).query("certificate_templates",{select:"template_data, template_mime",filters:{course_id:t},single:!0});if(!(s!=null&&s.template_data))return e.json({error:"Imagem não encontrada"},404);const n=Uint8Array.from(atob(s.template_data),i=>i.charCodeAt(0));return new Response(n,{headers:{"Content-Type":s.template_mime||"image/jpeg","Cache-Control":"public, max-age=86400"}})}catch{return e.json({error:"Erro ao buscar imagem"},500)}});I.get("/api/certificate-template/:courseId/verso",async e=>{try{const t=e.req.param("courseId"),s=await q(e).query("certificate_templates",{select:"verso_data, verso_mime",filters:{course_id:t},single:!0});if(!(s!=null&&s.verso_data))return e.json({error:"Verso não encontrado"},404);const n=Uint8Array.from(atob(s.verso_data),i=>i.charCodeAt(0));return new Response(n,{headers:{"Content-Type":s.verso_mime||"image/jpeg","Cache-Control":"public, max-age=86400"}})}catch{return e.json({error:"Erro ao buscar verso"},500)}});I.get("/api/certificate-template/:courseId",async e=>{try{const t=e.req.param("courseId"),r=q(e),s=await r.query("certificate_templates",{select:"id, course_id, template_mime, verso_mime, created_at, updated_at",filters:{course_id:t},single:!0});if(s){s.template_url=`/api/certificate-template/${t}/image`;const n=await r.query("certificate_templates",{select:"verso_data",filters:{course_id:t},single:!0});s.verso_url=n!=null&&n.verso_data?`/api/certificate-template/${t}/verso`:null}return e.json({template:s})}catch{return e.json({template:null})}});I.post("/api/certificates/generate",async e=>{var t,r,s;try{const n=G(e,"sb-access-token");if(!n)return e.json({error:"Não autenticado"},401);const i=await Y(n,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!i)return e.json({error:"Usuário não encontrado"},401);const{course_id:o}=await e.req.json();if(console.log("📜 Certificate generation request:",{user_email:i.email,course_id:o}),!o)return e.json({error:"ID do curso é obrigatório"},400);const a=q(e),c=await a.query("certificates",{select:"*",filters:{user_email:i.email,course_id:o}});if(c&&c.length>0)return console.log("✅ Certificate already exists"),e.json({success:!0,certificate:c[0],message:"Certificado já existe!"});const u=await a.query("courses",{select:"*",filters:{id:o},single:!0});if(!u)return e.json({error:"Curso não encontrado"},404);const l=await a.query("modules",{select:"*",filters:{course_id:o}});let f=[];if(l)for(const v of l){const p=await a.query("lessons",{select:"id",filters:{module_id:v.id}});p&&(f=[...f,...p.map(y=>y.id)])}if(f.length===0)return e.json({error:"Curso não possui aulas"},400);const h=(await a.query("user_progress",{select:"*",filters:{user_email:i.email}})||[]).filter(v=>v.completed&&f.includes(v.lesson_id)).map(v=>v.lesson_id),m=h.length/f.length*100;if(console.log("📊 Course completion:",{total_lessons:f.length,completed_lessons:h.length,percentage:m}),m<100)return e.json({error:"Você precisa completar 100% do curso para receber o certificado",completion:m},400);const b=await a.insert("certificates",{user_email:i.email,user_name:((t=i.user_metadata)==null?void 0:t.name)||"Aluno",course_id:parseInt(o),course_title:u.title,issued_at:new Date().toISOString(),completion_date:new Date().toISOString()});return console.log("✅ Certificate generated successfully"),e.json({success:!0,certificate:b,message:"Parabéns! Seu certificado foi gerado com sucesso!"})}catch(n){return console.error("💥 Certificate generation error:",n),console.error("Error details:",n.message),(r=n.message)!=null&&r.includes("certificates")||(s=n.message)!=null&&s.includes("relation")?e.json({error:"Tabela de certificados não encontrada. Execute a migração SQL no Supabase.",details:n.message},500):e.json({error:"Erro ao gerar certificado",details:n.message},500)}});I.get("/api/certificates",async e=>{try{const t=G(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const r=await Y(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({error:"Usuário não encontrado"},401);const s=q(e),n=await s.query("certificates",{select:"*",filters:{user_email:r.email},order:"issued_at DESC"})||[],i=await Promise.all(n.map(async o=>{const a=await s.query("certificate_templates",{select:"*",filters:{course_id:o.course_id},single:!0});return{...o,template_url:(a==null?void 0:a.template_url)||null}}));return e.json({certificates:i})}catch(t){return console.error("💥 Certificates fetch error:",t),e.json({error:"Erro ao buscar certificados"},500)}});I.get("/api/certificates/:id",async e=>{try{const t=e.req.param("id"),r=q(e),s=await r.query("certificates",{select:"*",filters:{id:t},single:!0});if(!s)return e.json({error:"Certificado não encontrado"},404);const n=await r.query("certificate_templates",{select:"*",filters:{course_id:s.course_id},single:!0});return e.json({certificate:{...s,template_url:(n==null?void 0:n.template_url)||null}})}catch{return e.json({error:"Erro ao buscar certificado"},500)}});I.get("/api/plans",async e=>{try{const r=await q(e).query("plans",{select:"*",filters:{is_active:!0},order:"display_order"})||[];return e.json({plans:r})}catch{return e.json({error:"Erro ao buscar planos"},500)}});I.get("/api/subscriptions/current",async e=>{try{const t=G(e,"sb-access-token");if(!t)return e.json({subscription:null});const r=await Y(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({subscription:null});const i=await q(e).sql(`
      SELECT s.*, p.name as plan_name, p.monthly_price, p.duration_days
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_email = $1 AND s.status = 'active'
      ORDER BY s.end_date DESC
      LIMIT 1
    `,[r.email]);return e.json({subscription:i&&i.length>0?i[0]:null})}catch(t){return console.error("Error fetching subscription:",t),e.json({subscription:null})}});I.post("/api/admin/subscriptions",j,async e=>{try{const{user_email:t,plan_id:r,duration_days:s}=await e.req.json();if(!t||!r)return e.json({error:"Email e plano são obrigatórios"},400);const n=q(e),i=await n.query("plans",{select:"*",filters:{id:r},single:!0});if(!i)return e.json({error:"Plano não encontrado"},404);const o=new Date;o.setDate(o.getDate()+(s||i.duration_days));const a=o.toISOString(),c=await n.insert("member_subscriptions",{email_membro:t,data_expiracao:a,detalhe:i.name,origem:"admin",teste_gratis:i.is_free_trial||!1,ativo:!0}),u=await n.query("users",{select:"id",filters:{email:t},single:!0});return u&&await n.update("users",{id:u.id},{dt_expiracao:a,updated_at:new Date().toISOString()}),e.json({success:!0,message:"Assinatura criada com sucesso!",subscription:c[0]})}catch(t){return console.error("Error creating subscription:",t),e.json({error:"Erro ao criar assinatura"},500)}});I.get("/api/lessons/:id/access",async e=>{try{const t=e.req.param("id"),r=G(e,"sb-access-token");if(!r){const c=await q(e).query("lessons",{select:"teste_gratis",filters:{id:t},single:!0});return e.json({hasAccess:(c==null?void 0:c.teste_gratis)||!1,reason:c!=null&&c.teste_gratis?"free_lesson":"not_authenticated"})}const s=await Y(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!s)return e.json({hasAccess:!1,reason:"invalid_token"});const i=await q(e).rpc("user_has_lesson_access",{email_usuario:s.email,lesson_id:parseInt(t)});let o=!1;if(Array.isArray(i)&&i.length>0?o=i[0].user_has_lesson_access||i[0]===!0||!!i[0]:typeof i=="boolean"?o=i:i&&typeof i=="object"&&(o=!!i.user_has_lesson_access),!o){const a=e.env.DATABASE_SUITEPLUS;if(a){const c=await Ur(s.email,a);c&&c>new Date&&(o=!0)}}return e.json({hasAccess:o,reason:o?"active_subscription":"no_active_subscription"})}catch(t){return console.error("Error checking lesson access:",t),e.json({hasAccess:!1,reason:"error"},500)}});I.post("/api/admin/subscriptions/expire",j,async e=>{try{return await q(e).rpc("expire_subscriptions",{}),e.json({success:!0,message:"Assinaturas expiradas com sucesso!"})}catch(t){return console.error("Error expiring subscriptions:",t),e.json({error:"Erro ao expirar assinaturas"},500)}});I.get("/api/admin/plans",j,async e=>{try{const r=await q(e).query("plans",{select:"*",order:"display_order"})||[];return e.json({plans:r})}catch{return e.json({error:"Erro ao buscar planos"},500)}});I.post("/api/admin/plans",j,async e=>{try{const t=await e.req.json(),{id:r,name:s,description:n,price:i,duration_days:o,is_active:a,is_free_trial:c,features:u,display_order:l}=t,f=q(e);if(r)return await f.update("plans",{id:r},{name:s,description:n,price:parseFloat(i),duration_days:parseInt(o),is_active:a,is_free_trial:c,features:u||[],display_order:parseInt(l||0),updated_at:new Date().toISOString()}),e.json({success:!0,message:"Plano atualizado!"});{const d=await f.insert("plans",{name:s,description:n,price:parseFloat(i),duration_days:parseInt(o),is_active:a,is_free_trial:c,features:u||[],display_order:parseInt(l||0)});return e.json({success:!0,plan:d[0],message:"Plano criado!"})}}catch(t){return console.error("Error saving plan:",t),e.json({error:"Erro ao salvar plano"},500)}});I.get("/api/admin/subscriptions",j,async e=>{try{const t=q(e),r=await t.query("subscriptions",{select:"*",order:"created_at DESC"})||[],s=await Promise.all(r.map(async n=>{const i=await t.query("plans",{select:"*",filters:{id:n.plan_id},single:!0});return{...n,plan_name:(i==null?void 0:i.name)||"Desconhecido"}}));return e.json({subscriptions:s})}catch{return e.json({error:"Erro ao buscar assinaturas"},500)}});I.get("/recover",e=>e.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div class="text-center mb-6">
            <div class="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-key text-4xl text-blue-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Recuperar Senha</h1>
            <p class="text-gray-600">
                Cole o link completo que você recebeu no email abaixo
            </p>
        </div>
        
        <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
                Link do Email:
            </label>
            <textarea 
                id="recoveryLink"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                rows="4"
                placeholder="Cole aqui o link completo do email..."></textarea>
        </div>
        
        <button 
            onclick="extractToken()"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-4">
            <i class="fas fa-magic mr-2"></i>
            Extrair Token e Continuar
        </button>
        
        <div id="result" class="hidden"></div>
        
        <div class="mt-6 text-center">
            <a href="/" class="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                <i class="fas fa-arrow-left mr-1"></i> Voltar ao login
            </a>
        </div>
    </div>
    
    <script>
        // Check if we have token in hash already
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
            window.location.href = '/reset-password' + hash
        }
        
        function extractToken() {
            const link = document.getElementById('recoveryLink').value.trim()
            const resultDiv = document.getElementById('result')
            
            if (!link) {
                resultDiv.className = 'bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm'
                resultDiv.textContent = '❌ Por favor, cole o link do email'
                resultDiv.classList.remove('hidden')
                return
            }
            
            // Try to extract access_token from the link
            const tokenMatch = link.match(/access_token=([^&]+)/)
            const typeMatch = link.match(/type=([^&]+)/)
            const refreshMatch = link.match(/refresh_token=([^&]+)/)
            
            if (tokenMatch && typeMatch && typeMatch[1] === 'recovery') {
                const accessToken = tokenMatch[1]
                const refreshToken = refreshMatch ? refreshMatch[1] : ''
                
                resultDiv.className = 'bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm'
                resultDiv.innerHTML = '✅ Token extraído! Redirecionando...'
                resultDiv.classList.remove('hidden')
                
                // Redirect with clean token
                setTimeout(() => {
                    window.location.href = \`/reset-password#access_token=\${accessToken}&refresh_token=\${refreshToken}&type=recovery\`
                }, 1000)
            } else {
                resultDiv.className = 'bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm'
                resultDiv.innerHTML = '❌ Link inválido ou token não encontrado.<br><br>Certifique-se de colar o link completo do email.'
                resultDiv.classList.remove('hidden')
            }
        }
    <\/script>
</body>
</html>
  `));I.get("/reset-password",e=>e.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white text-center">
            <i class="fas fa-key text-5xl mb-3"></i>
            <h1 class="text-2xl font-bold">Redefinir Senha</h1>
            <p class="text-blue-200 text-sm mt-2">CCT - Clube do Cálculo Trabalhista</p>
        </div>
        
        <div class="p-8">
            <div id="messageDiv" class="hidden mb-4 p-3 rounded-lg text-sm"></div>
            
            <form id="resetForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-lock mr-1"></i> Nova Senha
                    </label>
                    <input type="password" 
                           id="newPassword" 
                           required
                           minlength="6"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Mínimo 6 caracteres">
                </div>
                
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-lock mr-1"></i> Confirmar Senha
                    </label>
                    <input type="password" 
                           id="confirmPassword" 
                           required
                           minlength="6"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           placeholder="Digite a senha novamente">
                </div>
                
                <button type="submit" 
                        id="submitBtn"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <i class="fas fa-check"></i>
                    Redefinir Senha
                </button>
            </form>
            
            <div class="mt-6 text-center">
                <a href="/" class="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                    <i class="fas fa-arrow-left mr-1"></i> Voltar ao login
                </a>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
    <script>
        // Get access token from URL hash
        const hash = window.location.hash
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const type = params.get('type')
        
        const messageDiv = document.getElementById('messageDiv')
        const form = document.getElementById('resetForm')
        const submitBtn = document.getElementById('submitBtn')
        
        function showMessage(message, isError = false) {
            messageDiv.textContent = message
            messageDiv.classList.remove('hidden', 'bg-red-50', 'border-red-200', 'text-red-700', 'bg-green-50', 'border-green-200', 'text-green-700')
            
            if (isError) {
                messageDiv.classList.add('bg-red-50', 'border', 'border-red-200', 'text-red-700')
            } else {
                messageDiv.classList.add('bg-green-50', 'border', 'border-green-200', 'text-green-700')
            }
        }
        
        // Check if we have a valid token
        if (!accessToken || type !== 'recovery') {
            showMessage('❌ Link inválido ou expirado. Por favor, solicite um novo link de recuperação.', true)
            form.classList.add('hidden')
        }
        
        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            const newPassword = document.getElementById('newPassword').value
            const confirmPassword = document.getElementById('confirmPassword').value
            
            if (newPassword !== confirmPassword) {
                showMessage('❌ As senhas não coincidem. Por favor, tente novamente.', true)
                return
            }
            
            if (newPassword.length < 6) {
                showMessage('❌ A senha deve ter pelo menos 6 caracteres.', true)
                return
            }
            
            // Disable submit button
            submitBtn.disabled = true
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...'
            
            try {
                const response = await axios.post('/api/auth/reset-password', {
                    token: accessToken,
                    password: newPassword
                })
                
                if (response.data.success) {
                    showMessage('✅ ' + response.data.message, false)
                    form.classList.add('hidden')
                    
                    // Redirect to home after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000)
                }
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao redefinir senha. Tente novamente.'
                showMessage('❌ ' + errorMessage, true)
                
                // Re-enable submit button
                submitBtn.disabled = false
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Redefinir Senha'
            }
        })
    <\/script>
</body>
</html>
  `));I.get("/test-continue",e=>e.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testar "Continue de Onde Parou"</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body class="bg-gray-100 p-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">
            🧪 Testar "Continue de Onde Parou"
        </h1>
        
        <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-3">Status Atual:</h2>
            <div id="status" class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-600">Carregando...</p>
            </div>
        </div>
        
        <div class="space-y-4">
            <button onclick="setTestData()" 
                    class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                ✅ Adicionar Dados de Teste
            </button>
            
            <button onclick="clearData()" 
                    class="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
                🗑️ Limpar Dados
            </button>
            
            <button onclick="checkData()" 
                    class="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                🔍 Verificar Dados
            </button>
            
            <a href="/" 
               class="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-center">
                🏠 Voltar à Página Principal
            </a>
        </div>
        
        <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 class="font-semibold text-yellow-800 mb-2">💡 Como funciona:</h3>
            <ol class="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                <li>Clique em "Adicionar Dados de Teste" para simular uma aula visitada</li>
                <li>Volte à página principal</li>
                <li>O banner "Continue de onde parou" deve aparecer no topo</li>
                <li>Use "Limpar Dados" para resetar</li>
            </ol>
        </div>
    </div>
    
    <script>
        function setTestData() {
            const testData = {
                lessonId: 1,
                lessonTitle: "Bem-vindo ao CCT",
                moduleName: "Introdução aos Cálculos Trabalhistas",
                courseName: "Curso Completo de Cálculos Trabalhistas",
                timestamp: Date.now()
            }
            
            localStorage.setItem('lastAccessedLesson', JSON.stringify(testData))
            
            alert('✅ Dados de teste adicionados!\\n\\nAgora volte à página principal para ver o banner.')
            checkData()
        }
        
        function clearData() {
            localStorage.removeItem('lastAccessedLesson')
            alert('🗑️ Dados removidos!')
            checkData()
        }
        
        function checkData() {
            const data = localStorage.getItem('lastAccessedLesson')
            const statusDiv = document.getElementById('status')
            
            if (data) {
                const parsed = JSON.parse(data)
                statusDiv.innerHTML = \`
                    <div class="text-green-700">
                        <p class="font-semibold mb-2">✅ Dados encontrados:</p>
                        <pre class="text-xs bg-white p-3 rounded border border-green-200 overflow-auto">\${JSON.stringify(parsed, null, 2)}</pre>
                    </div>
                \`
            } else {
                statusDiv.innerHTML = \`
                    <p class="text-red-600 font-semibold">
                        ❌ Nenhum dado encontrado no localStorage
                    </p>
                    <p class="text-sm text-gray-600 mt-2">
                        Para que o banner apareça, você precisa:
                        <br>1. Adicionar dados de teste (botão acima), ou
                        <br>2. Acessar qualquer aula na aplicação
                    </p>
                \`
            }
        }
        
        // Check on load
        checkData()
    <\/script>
</body>
</html>
  `));I.get("/",e=>e.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light only">
        <title>CCT - Clube do Cálculo Trabalhista</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          /* Module and Lesson Styles */
          .lesson-item:hover { background-color: #f3f4f6; }
          .completed { background-color: #d1fae5 !important; }
          .module-header { cursor: pointer; }
          .module-content { display: none; }
          .module-content.active { display: block; }
          
          /* Premium Locked Lessons */
          .premium-locked {
            cursor: not-allowed !important;
            background-color: #fef3f2 !important;
            border-color: #fecaca !important;
          }
          .premium-locked:hover {
            background-color: #fee2e2 !important;
            transform: scale(1.02);
          }
          
          /* Line Clamp Utilities */
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          /* Card Hover Effects - Only on non-touch devices */
          @media (hover: hover) {
            .group:hover .group-hover\\:scale-110 {
              transform: scale(1.1);
            }
            .group:hover .group-hover\\:gap-2 {
              gap: 0.5rem;
            }
          }
          
          /* Smooth Animations */
          * {
            transition-property: color, background-color, border-color, opacity, transform, box-shadow;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 0ms;
          }
          
          /* Mobile Responsive Utilities */
          @media (max-width: 640px) {
            .mobile-hide { display: none !important; }
            .mobile-text-sm { font-size: 0.875rem; }
            .mobile-text-xs { font-size: 0.75rem; }
            .mobile-p-4 { padding: 1rem; }
            .mobile-gap-2 { gap: 0.5rem; }
          }
          
          /* Video Container Responsive */
          .video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            overflow: hidden;
          }
          .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 py-4 md:py-6">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <!-- Logo/Title -->
                    <div class="flex-shrink-0">
                        <a href="/" class="flex items-center gap-3 md:gap-4 hover:opacity-90 transition-opacity">
                            <!-- Logo -->
                            <img src="https://page.gensparksite.com/v1/base64_upload/8f96be1bcec5a62130e0023674c921df"
                                 alt="CCT Logo"
                                 class="h-12 md:h-16 w-auto">

                            <!-- Title -->
                            <div>
                                <h1 class="text-lg md:text-2xl font-bold">
                                    <span class="hidden sm:inline">CCT - Clube do Cálculo Trabalhista</span>
                                    <span class="sm:hidden">CCT</span>
                                </h1>
                                <p class="text-blue-200 mt-1 text-xs md:text-sm hidden sm:block">Domine os cálculos da Justiça do Trabalho</p>
                            </div>
                        </a>
                    </div>
                    
                    <!-- User Menu -->
                    <div class="flex items-center gap-2 md:gap-4">
                        <!-- User Info - Hidden on very small screens -->
                        <div class="hidden md:flex items-center gap-2">
                            <i class="fas fa-user-circle text-2xl"></i>
                            <div>
                                <p class="text-xs">Bem-vindo,</p>
                                <p class="font-semibold text-sm" id="userName">Aluno</p>
                            </div>
                        </div>

                        <!-- Credits Badge -->
                        <div id="creditsDisplay" class="hidden items-center gap-2 bg-green-600/30 border border-green-500/40 rounded-xl px-3 py-2">
                            <i class="fas fa-coins text-yellow-300 text-sm"></i>
                            <div>
                                <p class="text-xs text-green-200 leading-none mb-0.5">Créditos</p>
                                <p class="text-sm font-bold text-white leading-none" id="userCredits">
                                    <span class="inline-block w-8 h-3 bg-white/20 rounded animate-pulse"></span>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Search Button -->
                        <button onclick="app.showSearch(this)" 
                                class="px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs md:text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <i class="fas fa-search"></i>
                            <span class="hidden sm:inline ml-2">Buscar</span>
                        </button>
                        
                        <!-- Plans Button -->
                        <button onclick="app.showPlans()"
                                class="px-3 md:px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-crown"></i>
                            <span class="hidden sm:inline ml-2">Planos</span>
                        </button>

                        <!-- Trails Button -->
                        <button onclick="app.showTrails()"
                                class="px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-route"></i>
                            <span class="hidden sm:inline ml-2">Trilhas</span>
                        </button>
                        
                        <!-- Rentals Button -->
                        <button onclick="app.showRentals()"
                                class="px-3 md:px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-key"></i>
                            <span class="hidden sm:inline ml-2">Alugadas</span>
                        </button>

                        <!-- Favorites Button -->
                        <button onclick="window.location.href='/favorites'"
                                class="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-heart"></i>
                            <span class="hidden sm:inline ml-2">Favoritos</span>
                        </button>

                        <!-- Certificates Button -->
                        <button onclick="window.location.href='/certificates'"
                                class="px-3 md:px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-certificate"></i>
                            <span class="hidden sm:inline ml-2">Certificados</span>
                        </button>
                        
                        <!-- Profile Button -->
                        <button onclick="window.location.href='/profile'" 
                                class="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-user-circle"></i>
                            <span class="hidden sm:inline ml-2">Perfil</span>
                        </button>
                        
                        <!-- Admin Button -->
                        <button onclick="app.showAdminPanel()" 
                                id="adminButton"
                                class="hidden px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-tools"></i>
                            <span class="hidden sm:inline ml-2">Admin</span>
                        </button>
                        
                        <!-- Logout Button -->
                        <button onclick="app.logout()" 
                                class="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                            <i class="fas fa-sign-out-alt"></i>
                            <span class="hidden sm:inline ml-2">Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
            <!-- View: Courses List -->
            <div id="coursesView">
                <!-- Courses Grid -->
                <div id="coursesList" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    <!-- Courses will be loaded here -->
                </div>
            </div>

            <!-- View: Course Detail -->
            <div id="courseView" class="hidden">
                <button onclick="app.showCourses()" class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i> Voltar aos cursos
                </button>
                <div id="courseDetail">
                    <!-- Course details will be loaded here -->
                </div>
            </div>

            <!-- View: Lesson Detail -->
            <div id="lessonView" class="hidden">
                <button onclick="app.backToCourse()" class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i> Voltar ao curso
                </button>
                <div id="lessonDetail">
                    <!-- Lesson details will be loaded here -->
                </div>
            </div>
            
            <!-- View: Search -->
            <div id="searchView" class="hidden">
                <button onclick="app.showCourses()" 
                        class="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <i class="fas fa-arrow-left"></i> Voltar aos cursos
                </button>
                
                <!-- Search Header -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div class="flex items-center gap-4 mb-6">
                        <i class="fas fa-search text-3xl text-purple-600"></i>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">Busca Inteligente de Aulas</h2>
                            <p class="text-gray-600">Encontre rapidamente a aula que você precisa</p>
                        </div>
                    </div>
                    
                    <!-- Search Input -->
                    <div class="relative mb-6">
                        <input type="text" 
                               id="searchInput" 
                               placeholder="Digite palavras-chave (ex: liquidação, horas extras, FGTS...)"
                               class="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg">
                        <i class="fas fa-search absolute left-4 top-4 text-gray-400 text-xl"></i>
                    </div>
                    
                    <!-- Filters Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <!-- Course Filter -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-book mr-2"></i>Curso
                            </label>
                            <select id="courseFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none">
                                <option value="">Todos os cursos</option>
                            </select>
                        </div>
                        
                        <!-- Type Filter -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-filter mr-2"></i>Tipo
                            </label>
                            <select id="typeFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none">
                                <option value="all">Todas</option>
                                <option value="free">Apenas Grátis</option>
                                <option value="premium">Apenas Premium</option>
                                <option value="rented">Minhas Alugadas</option>
                            </select>
                        </div>
                        
                        <!-- Duration Filter -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-clock mr-2"></i>Duração
                            </label>
                            <select id="durationFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none">
                                <option value="0-120">Qualquer duração</option>
                                <option value="0-10">Até 10 min</option>
                                <option value="10-30">10-30 min</option>
                                <option value="30-60">30-60 min</option>
                                <option value="60-999">Mais de 1 hora</option>
                            </select>
                        </div>
                        
                        <!-- Sort Filter -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-sort mr-2"></i>Ordenar por
                            </label>
                            <select id="sortFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none">
                                <option value="relevance">Relevância</option>
                                <option value="title">Título (A-Z)</option>
                                <option value="duration">Duração</option>
                                <option value="date">Mais recentes</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Results Count -->
                    <div class="mt-4 flex items-center justify-between">
                        <p id="resultsCount" class="text-gray-600 font-semibold"></p>
                        <button onclick="searchManager.clearSearch()" 
                                class="text-sm text-purple-600 hover:text-purple-800 font-semibold">
                            <i class="fas fa-redo mr-1"></i>Limpar filtros
                        </button>
                    </div>
                </div>
                
                <!-- Search Results -->
                <div id="searchResults" class="space-y-4">
                    <!-- Results will be rendered here -->
                </div>
            </div>
        </main>

        <script defer src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
        <script defer src="/static/auth.js"><\/script>
        <script defer src="/static/admin.js?v=6"><\/script>
        <script defer src="/static/access-control.js?v=3"><\/script>
        <script defer src="/static/app.js?v=12"><\/script>
        <script defer src="/static/search.js?v=3"><\/script>
    </body>
    </html>
  `));I.get("/course/:courseId",e=>{const t=e.req.param("courseId");return e.html(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="color-scheme" content="light only">
<title>CCT - Abrindo aula...</title>
<style>body{margin:0;background:#1e3a8a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;color:white}</style>
</head>
<body>
<script>
(function() {
  var hash = window.location.hash;
  var lessonId = hash.startsWith('#lesson-') ? hash.slice(8) : '';
  if (lessonId) {
    window.location.replace('/?lesson=' + encodeURIComponent(lessonId));
  } else {
    window.location.replace('/?course=' + encodeURIComponent('${t}'));
  }
})();
<\/script>
<p>Abrindo aula...</p>
</body>
</html>`)});I.get("/lesson/:lessonId",e=>{const t=e.req.param("lessonId");return e.html(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="color-scheme" content="light only">
<title>CCT - Abrindo aula...</title>
<style>body{margin:0;background:#1e3a8a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;color:white}</style>
</head>
<body>
<script>window.location.replace('/?lesson=' + encodeURIComponent('${t}'));<\/script>
<p>Abrindo aula...</p>
</body>
</html>`)});I.get("/api/favorites",K,async e=>{const t=e.get("user"),r=q(e);try{const s=await r.sql(`
      SELECT f.id, f.lesson_id, f.created_at,
             l.title AS lesson_title,
             c.title AS course_title,
             c.id    AS course_id
      FROM user_favorites f
      JOIN lessons l ON l.id = f.lesson_id
      JOIN modules m ON m.id = l.module_id
      JOIN courses c ON c.id = m.course_id
      WHERE f.user_email = $1
      ORDER BY f.created_at DESC
    `,[t.email]);return e.json(s)}finally{await r.end()}});I.post("/api/favorites",K,async e=>{const t=e.get("user"),r=await e.req.json();if(!r.lesson_id)return e.json({error:"lesson_id required"},400);const s=q(e);try{return await s.sql("INSERT INTO user_favorites (user_email, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",[t.email,r.lesson_id]),e.json({ok:!0})}finally{await s.end()}});I.delete("/api/favorites/:lessonId",K,async e=>{const t=e.get("user"),r=parseInt(e.req.param("lessonId")),s=q(e);try{return await s.sql("DELETE FROM user_favorites WHERE user_email = $1 AND lesson_id = $2",[t.email,r]),e.json({ok:!0})}finally{await s.end()}});I.get("/api/favorites/check/:lessonId",K,async e=>{const t=e.get("user"),r=parseInt(e.req.param("lessonId")),s=q(e);try{const n=await s.sql("SELECT id FROM user_favorites WHERE user_email = $1 AND lesson_id = $2 LIMIT 1",[t.email,r]);return e.json({favorite:n.length>0})}finally{await s.end()}});I.get("/favorites",e=>e.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aulas Favoritas - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
<div class="min-h-screen">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <a href="/" class="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <span class="text-blue-900 font-bold text-sm">CCT</span>
                        </div>
                        <div>
                            <h1 class="text-lg font-bold">CCT</h1>
                            <p class="text-blue-200 text-xs">Clube do Cálculo Trabalhista</p>
                        </div>
                    </a>
                </div>
                <nav class="flex items-center gap-4">
                    <a href="/" class="text-blue-200 hover:text-white text-sm transition-colors">
                        <i class="fas fa-home mr-1"></i>Início
                    </a>
                    <a href="/certificates" class="text-blue-200 hover:text-white text-sm transition-colors">
                        <i class="fas fa-certificate mr-1"></i>Certificados
                    </a>
                    <div id="userInfo" class="flex items-center gap-2">
                        <span id="userName" class="text-sm text-blue-200"></span>
                        <button onclick="logout()" class="text-xs bg-blue-800 hover:bg-blue-600 px-3 py-1 rounded transition-colors">Sair</button>
                    </div>
                </nav>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <div class="flex items-center gap-3 mb-6">
            <i class="fas fa-heart text-red-500 text-2xl"></i>
            <h2 class="text-2xl font-bold text-gray-800">Aulas Favoritas</h2>
        </div>

        <!-- Course filter pills -->
        <div id="courseFilters" class="flex flex-wrap gap-2 mb-6"></div>

        <!-- Favorites grid -->
        <div id="favoritesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="col-span-full text-center py-12 text-gray-400">
                <i class="fas fa-spinner fa-spin text-3xl mb-3"></i>
                <p>Carregando favoritos...</p>
            </div>
        </div>
    </main>
</div>

<script defer src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
<script defer src="/static/auth.js"><\/script>
<script>
let allFavorites = []
let activeFilter = null

function renderFilters() {
    const courses = [...new Map(allFavorites.map(f => [f.course_id, f.course_title])).entries()]
    const container = document.getElementById('courseFilters')
    if (courses.length === 0) { container.innerHTML = ''; return }

    const allBtn = document.createElement('button')
    allBtn.textContent = 'Todos'
    allBtn.className = 'px-4 py-1.5 rounded-full text-sm font-medium transition-colors ' + (activeFilter === null ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border hover:bg-gray-100')
    allBtn.onclick = () => { activeFilter = null; renderFilters(); renderFavorites(allFavorites) }
    container.innerHTML = ''
    container.appendChild(allBtn)

    for (const [id, title] of courses) {
        const btn = document.createElement('button')
        btn.textContent = title
        btn.className = 'px-4 py-1.5 rounded-full text-sm font-medium transition-colors ' + (activeFilter === id ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border hover:bg-gray-100')
        btn.onclick = () => { activeFilter = id; renderFilters(); renderFavorites(allFavorites.filter(f => f.course_id === id)) }
        container.appendChild(btn)
    }
}

function renderFavorites(list) {
    const grid = document.getElementById('favoritesGrid')
    if (list.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-12 text-gray-400"><i class="fas fa-heart-broken text-3xl mb-3"></i><p>Nenhuma aula favorita encontrada.</p></div>'
        return
    }
    grid.innerHTML = list.map(f => \`
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div class="flex-1">
                <p class="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">\${f.course_title}</p>
                <h3 class="text-gray-800 font-semibold text-sm leading-snug">\${f.lesson_title}</h3>
            </div>
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                <a href="/course/\${f.course_id}#lesson-\${f.lesson_id}"
                   class="text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors">
                    <i class="fas fa-play-circle mr-1"></i>Assistir
                </a>
                <button onclick="removeFavorite(\${f.lesson_id}, this)"
                        class="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1">
                    <i class="fas fa-heart-broken"></i> Remover
                </button>
            </div>
        </div>
    \`).join('')
}

async function loadFavorites() {
    try {
        const res = await axios.get('/api/favorites')
        allFavorites = res.data
        renderFilters()
        renderFavorites(allFavorites)
    } catch (e) {
        if (e.response && e.response.status === 401) { window.location.href = '/'; return }
        document.getElementById('favoritesGrid').innerHTML =
            '<div class="col-span-full text-center py-12 text-red-400"><i class="fas fa-exclamation-triangle text-3xl mb-3"></i><p>Erro ao carregar favoritos.</p></div>'
    }
}

async function removeFavorite(lessonId, btn) {
    btn.disabled = true
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
    try {
        await axios.delete('/api/favorites/' + lessonId)
        allFavorites = allFavorites.filter(f => f.lesson_id !== lessonId)
        const filtered = activeFilter ? allFavorites.filter(f => f.course_id === activeFilter) : allFavorites
        renderFilters()
        renderFavorites(filtered)
    } catch(e) {
        btn.disabled = false
        btn.innerHTML = '<i class="fas fa-heart-broken"></i> Remover'
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    const user = await authManager.init()
    if (!user) { window.location.href = '/'; return }
    const name = authManager.getUserName ? authManager.getUserName() : ''
    if (name) document.getElementById('userName').textContent = name
    loadFavorites()
})
<\/script>
</body>
</html>
  `));I.get("/certificates",e=>e.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meus Certificados - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <img src="https://page.gensparksite.com/v1/base64_upload/8f96be1bcec5a62130e0023674c921df" 
                             alt="CCT Logo" 
                             class="h-12 md:h-16 w-auto">
                        <div>
                            <h1 class="text-2xl font-bold">CCT</h1>
                            <p class="text-blue-200 text-xs">Clube do Cálculo Trabalhista</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 md:gap-4">
                        <button onclick="window.location.href='/'" 
                                class="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2">
                            <i class="fas fa-home"></i>
                            <span class="hidden sm:inline">Início</span>
                        </button>
                        <button onclick="window.location.href='/profile'" 
                                class="px-3 md:px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-2">
                            <i class="fas fa-user-circle"></i>
                            <span class="hidden sm:inline">Perfil</span>
                        </button>
                        <button id="logoutBtn" 
                                class="px-3 md:px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2">
                            <i class="fas fa-sign-out-alt"></i>
                            <span class="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8">
            <div class="mb-6">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-certificate text-yellow-600 mr-2"></i>
                    Meus Certificados
                </h2>
                <p class="text-gray-600">Visualize e baixe seus certificados de conclusão</p>
            </div>

            <!-- Loading State -->
            <div id="loadingDiv" class="text-center py-16">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                <p class="text-gray-600">Carregando certificados...</p>
            </div>

            <!-- Certificates Grid -->
            <div id="certificatesGrid" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Certificates will be loaded here -->
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="hidden text-center py-16">
                <i class="fas fa-certificate text-gray-300 text-6xl mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Nenhum certificado disponível</h3>
                <p class="text-gray-500 mb-6">Complete cursos para receber seus certificados!</p>
                <button onclick="window.location.href='/'" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    <i class="fas fa-arrow-left mr-2"></i>Voltar aos Cursos
                </button>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
    <script src="/static/auth.js"><\/script>
    <script>
        let currentUser = null;

        // Initialize page
        async function init() {
            // Check authentication
            const user = await authManager.init()
            
            if (!user) {
                window.location.href = '/'
                return
            }
            
            currentUser = user
            loadCertificates()
        }

        // Load certificates
        async function loadCertificates() {
            try {
                const response = await axios.get('/api/my-certificates')
                const certificates = response.data.certificates

                document.getElementById('loadingDiv').classList.add('hidden')

                if (certificates.length === 0) {
                    document.getElementById('emptyState').classList.remove('hidden')
                    return
                }

                renderCertificates(certificates)
            } catch (error) {
                console.error('Error loading certificates:', error)
                document.getElementById('loadingDiv').innerHTML = \`
                    <div class="text-center py-16">
                        <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
                        <p class="text-gray-600">Erro ao carregar certificados</p>
                        <button onclick="location.reload()" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Tentar Novamente
                        </button>
                    </div>
                \`
            }
        }

        // Render certificates
        function renderCertificates(certificates) {
            const grid = document.getElementById('certificatesGrid')
            grid.classList.remove('hidden')

            grid.innerHTML = certificates.map(cert => {
                const completionDate = cert.completion_date ? new Date(cert.completion_date).toLocaleDateString('pt-BR') : (cert.start_date ? new Date(cert.start_date).toLocaleDateString('pt-BR') : '—')
                const startDate = cert.start_date ? new Date(cert.start_date).toLocaleDateString('pt-BR') : '—'
                const verificationUrl = cert.certificate_code ? \`\${window.location.origin}/verificar/\${cert.certificate_code}\` : null

                return \`
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                        <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-2">
                                        <i class="fas fa-certificate text-2xl"></i>
                                        <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                                            ✓ Certificado
                                        </span>
                                    </div>
                                    <h3 class="text-xl font-bold mb-1">\${cert.course_title}</h3>
                                    <p class="text-blue-100 text-sm">Início: \${startDate} &nbsp;|&nbsp; Conclusão: \${completionDate}</p>
                                </div>
                            </div>
                        </div>

                        <div class="p-6">
                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-xs text-gray-500 mb-1">Carga Horária</div>
                                    <div class="text-lg font-bold text-gray-800">
                                        \${cert.carga_horaria || 'N/A'} \${cert.carga_horaria ? 'horas' : ''}
                                    </div>
                                </div>
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="text-xs text-gray-500 mb-1">Código</div>
                                    <div class="text-sm font-mono font-bold text-gray-800">
                                        \${cert.certificate_code || '—'}
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <button onclick="viewCertificate(\${cert.id})"
                                    class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                    <i class="fas fa-eye"></i>
                                    Visualizar Certificado
                                </button>

                                <button onclick="downloadCertificate(\${cert.id})"
                                    class="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                                    <i class="fas fa-download"></i>
                                    Baixar PDF
                                </button>

                                \${verificationUrl ? \`
                                <button onclick="shareCertificate('\${verificationUrl}')"
                                    class="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2">
                                    <i class="fas fa-share-alt"></i>
                                    Compartilhar Link
                                </button>\` : ''}
                            </div>

                            \${verificationUrl ? \`
                            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div class="text-xs text-gray-600">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Verificação: <a href="\${verificationUrl}" target="_blank" class="text-blue-600 hover:underline break-all">\${verificationUrl}</a>
                                </div>
                            </div>\` : ''}
                        </div>
                    </div>
                \`
            }).join('')
        }

        // View certificate
        function viewCertificate(certId) {
            const url = \`/api/certificates/\${certId}/html\`
            window.open(url, '_blank')
        }

        // Download certificate as PDF
        function downloadCertificate(certId) {
            const url = \`/api/certificates/\${certId}/html\`
            const printWindow = window.open(url, '_blank')
            
            printWindow.addEventListener('load', () => {
                setTimeout(() => {
                    printWindow.print()
                }, 500)
            })
            
            alert('📄 Certificado aberto em nova janela. Use Ctrl+P ou Cmd+P para imprimir ou salvar como PDF.')
        }

        // Share verification link
        async function shareCertificate(verificationUrl) {
            try {
                if (navigator.share) {
                    await navigator.share({
                        title: 'Verificar Certificado - CCT 2026',
                        text: 'Verifique a autenticidade deste certificado',
                        url: verificationUrl
                    })
                } else {
                    await navigator.clipboard.writeText(verificationUrl)
                    alert('✅ Link de verificação copiado para a área de transferência!')
                }
            } catch (error) {
                console.error('Error sharing certificate:', error)
                prompt('Link de verificação do certificado:', verificationUrl)
            }
        }

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            const result = await authManager.logout()
            if (result.success) {
                window.location.href = '/'
            }
        })

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', init)
    <\/script>
</body>
</html>
  `));I.get("/profile",e=>e.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Perfil - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <img src="https://page.gensparksite.com/v1/base64_upload/8f96be1bcec5a62130e0023674c921df" 
                             alt="CCT Logo" 
                             class="h-12 md:h-16 w-auto">
                        <div>
                            <h1 class="text-2xl font-bold">CCT</h1>
                            <p class="text-blue-200 text-xs">Clube do Cálculo Trabalhista</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div id="userInfo" class="text-right hidden">
                            <p class="text-sm font-semibold" id="userName">Carregando...</p>
                            <p class="text-xs text-blue-200" id="userEmail">...</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.location.href='/'" 
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2">
                                <i class="fas fa-home"></i>
                                <span class="hidden sm:inline">Início</span>
                            </button>
                            <button id="logoutBtn" 
                                    class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2">
                                <i class="fas fa-sign-out-alt"></i>
                                <span class="hidden sm:inline">Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8 max-w-4xl">
            <div class="mb-6">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-user-circle text-blue-600 mr-2"></i>
                    Meu Perfil
                </h2>
                <p class="text-gray-600">Gerencie suas informações pessoais e configurações de conta</p>
            </div>

            <!-- Success/Error Messages -->
            <div id="messageDiv" class="hidden mb-6"></div>

            <!-- Profile Information -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div class="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                    <h3 class="text-white font-bold text-lg">
                        <i class="fas fa-id-card mr-2"></i>
                        Informações do Perfil
                    </h3>
                </div>
                <div class="p-6">
                    <form id="profileForm" class="space-y-6">
                        <!-- Email (readonly) -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-envelope mr-1 text-blue-600"></i> Email
                            </label>
                            <input type="email" 
                                   id="profileEmail" 
                                   disabled
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                   placeholder="seu@email.com">
                            <p class="text-xs text-gray-500 mt-1">
                                <i class="fas fa-info-circle"></i> O email não pode ser alterado
                            </p>
                        </div>
                        
                        <!-- Personal Information -->
                        <div class="border-t pt-4">
                            <h4 class="text-md font-bold text-gray-700 mb-4">
                                <i class="fas fa-id-card mr-2 text-blue-600"></i>Informações Pessoais
                            </h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-user mr-1 text-blue-600"></i> Nome Completo
                                    </label>
                                    <input type="text" 
                                           id="profileNome" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Seu nome completo">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-user mr-1 text-blue-600"></i> Primeiro Nome
                                    </label>
                                    <input type="text" 
                                           id="profileFirstName" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Primeiro nome">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-user mr-1 text-blue-600"></i> Sobrenome
                                    </label>
                                    <input type="text" 
                                           id="profileLastName" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Sobrenome">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-id-card mr-1 text-blue-600"></i> CPF
                                    </label>
                                    <input type="text" 
                                           id="profileCPF" 
                                           maxlength="14"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="000.000.000-00">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-phone mr-1 text-blue-600"></i> Telefone
                                    </label>
                                    <input type="text" 
                                           id="profileTelefone" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="(00) 0000-0000">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fab fa-whatsapp mr-1 text-green-600"></i> WhatsApp
                                    </label>
                                    <input type="text" 
                                           id="profileWhatsapp" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="(00) 00000-0000">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Address Information -->
                        <div class="border-t pt-4">
                            <h4 class="text-md font-bold text-gray-700 mb-4">
                                <i class="fas fa-map-marker-alt mr-2 text-blue-600"></i>Endereço
                            </h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-map-pin mr-1 text-blue-600"></i> CEP
                                    </label>
                                    <input type="text" 
                                           id="profileCEP" 
                                           maxlength="9"
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="00000-000">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-road mr-1 text-blue-600"></i> Logradouro
                                    </label>
                                    <input type="text" 
                                           id="profileLogradouro" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Rua, Avenida, etc.">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-hashtag mr-1 text-blue-600"></i> Número
                                    </label>
                                    <input type="text" 
                                           id="profileNumero" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Número">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-city mr-1 text-blue-600"></i> Cidade
                                    </label>
                                    <input type="text" 
                                           id="profileCidade" 
                                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                           placeholder="Cidade">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        <i class="fas fa-map mr-1 text-blue-600"></i> Estado
                                    </label>
                                    <select id="profileEstado" 
                                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Selecione</option>
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">Distrito Federal</option>
                                        <option value="ES">Espírito Santo</option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">Mato Grosso do Sul</option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piauí</option>
                                        <option value="RJ">Rio de Janeiro</option>
                                        <option value="RN">Rio Grande do Norte</option>
                                        <option value="RS">Rio Grande do Sul</option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">Santa Catarina</option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" 
                                id="profileSubmitBtn"
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <i class="fas fa-save"></i>
                            Salvar Alterações
                        </button>
                    </form>
                </div>
            </div>

            <!-- Subscription History -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div class="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                    <h3 class="text-white font-bold text-lg">
                        <i class="fas fa-history mr-2"></i>
                        Histórico de Planos
                    </h3>
                </div>
                <div class="p-6">
                    <div id="subscriptionHistory">
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                            <p>Carregando histórico...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rented Lessons -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                <div class="bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-4">
                    <h3 class="text-white font-bold text-lg">
                        <i class="fas fa-shopping-cart mr-2"></i>
                        Minhas Aulas Alugadas
                    </h3>
                </div>
                <div class="p-6">
                    <div id="rentalsContainer">
                        <div class="text-center py-8 text-gray-500">
                            <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                            <p>Carregando aluguéis...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Change Password -->
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4">
                    <h3 class="text-white font-bold text-lg">
                        <i class="fas fa-key mr-2"></i>
                        Alterar Senha
                    </h3>
                </div>
                <div class="p-6">
                    <form id="passwordForm" class="space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-lock mr-1 text-purple-600"></i> Senha Atual
                            </label>
                            <input type="password" 
                                   id="currentPassword" 
                                   required
                                   minlength="6"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                   placeholder="Digite sua senha atual">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-lock mr-1 text-purple-600"></i> Nova Senha
                            </label>
                            <input type="password" 
                                   id="newPassword" 
                                   required
                                   minlength="6"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                   placeholder="Mínimo 6 caracteres">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-lock mr-1 text-purple-600"></i> Confirmar Nova Senha
                            </label>
                            <input type="password" 
                                   id="confirmPassword" 
                                   required
                                   minlength="6"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                   placeholder="Digite a nova senha novamente">
                        </div>
                        
                        <button type="submit" 
                                id="passwordSubmitBtn"
                                class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <i class="fas fa-check"></i>
                            Alterar Senha
                        </button>
                    </form>
                </div>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
    <script src="/static/auth.js"><\/script>
    <script>
        const messageDiv = document.getElementById('messageDiv')
        const profileForm = document.getElementById('profileForm')
        const passwordForm = document.getElementById('passwordForm')
        const profileSubmitBtn = document.getElementById('profileSubmitBtn')
        const passwordSubmitBtn = document.getElementById('passwordSubmitBtn')
        
        function showMessage(message, isError = false) {
            messageDiv.innerHTML = \`
                <div class="p-4 rounded-lg border \${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}">
                    <i class="fas \${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
                    \${message}
                </div>
            \`
            messageDiv.classList.remove('hidden')
            
            // Scroll to message
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageDiv.classList.add('hidden')
            }, 5000)
        }
        
        // Load user data
        async function loadUserProfile() {
            try {
                const authResponse = await axios.get('/api/auth/me')
                
                if (!authResponse.data.user) {
                    window.location.href = '/'
                    return
                }
                
                const user = authResponse.data.user
                
                // Update header
                document.getElementById('userName').textContent = user.user_metadata?.name || 'Usuário'
                document.getElementById('userEmail').textContent = user.email || ''
                document.getElementById('userInfo').classList.remove('hidden')
                
                // Load full profile from users table
                try {
                    const profileResponse = await axios.get('/api/user/profile')
                    const profile = profileResponse.data.profile || {}
                    
                    // Fill all form fields
                    document.getElementById('profileEmail').value = user.email || ''
                    document.getElementById('profileNome').value = profile.nome || ''
                    document.getElementById('profileFirstName').value = profile.first_name || ''
                    document.getElementById('profileLastName').value = profile.last_name || ''
                    document.getElementById('profileCPF').value = profile.cpf || ''
                    document.getElementById('profileTelefone').value = profile.telefone || ''
                    document.getElementById('profileWhatsapp').value = profile.whatsapp || ''
                    document.getElementById('profileCEP').value = profile.end_cep || ''
                    document.getElementById('profileLogradouro').value = profile.end_logradouro || ''
                    document.getElementById('profileNumero').value = profile.end_numero || ''
                    document.getElementById('profileCidade').value = profile.end_cidade || ''
                    document.getElementById('profileEstado').value = profile.end_estado || ''
                    
                    // Add CPF and CEP masks
                    addInputMasks()
                } catch (profileError) {
                    console.error('Error loading profile data:', profileError)
                    // Continue anyway with basic info
                    document.getElementById('profileEmail').value = user.email || ''
                }
                
                // Load subscription history and rentals
                loadSubscriptionHistory(user.email)
                loadRentals()
            } catch (error) {
                console.error('Error loading profile:', error)
                window.location.href = '/'
            }
        }
        
        // Add input masks
        function addInputMasks() {
            // CPF mask
            const cpfInput = document.getElementById('profileCPF')
            cpfInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\\D/g, '')
                if (value.length > 11) value = value.slice(0, 11)
                value = value.replace(/(\\d{3})(\\d)/, '$1.$2')
                value = value.replace(/(\\d{3})(\\d)/, '$1.$2')
                value = value.replace(/(\\d{3})(\\d{1,2})$/, '$1-$2')
                e.target.value = value
            })
            
            // CEP mask
            const cepInput = document.getElementById('profileCEP')
            cepInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\\D/g, '')
                if (value.length > 8) value = value.slice(0, 8)
                value = value.replace(/(\\d{5})(\\d)/, '$1-$2')
                e.target.value = value
            })
        }
        
        // Load subscription history
        async function loadSubscriptionHistory(email) {
            const container = document.getElementById('subscriptionHistory')
            
            try {
                const response = await axios.get('/api/user/subscriptions')
                const subscriptions = response.data.subscriptions || []
                
                // Separar planos ativos e expirados
                const now = new Date()
                const activePlans = subscriptions.filter(s => new Date(s.data_expiracao) > now)
                const expiredPlans = subscriptions.filter(s => new Date(s.data_expiracao) <= now)

                let html = ''

                // Card de renovação sempre visível no topo
                html += \`
                    <div class="rounded-xl border-2 border-red-200 bg-red-50 p-5 mb-2">
                        <h4 class="text-base font-bold text-red-700 mb-1 flex items-center gap-2">
                            <i class="fas fa-sync-alt"></i> Renovar Plano
                        </h4>
                        <p class="text-sm text-red-600 mb-4">Escolha como deseja renovar seu acesso:</p>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <a href="https://pay.hotmart.com/I68113150G?off=q7xf5t1z" target="_blank"
                               class="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-lg transition text-sm">
                                <i class="fas fa-credit-card"></i>
                                Renovar com Cartão
                            </a>
                            <a href="https://assinaturas.ensinoplus.com.br" target="_blank"
                               class="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-5 rounded-lg transition text-sm">
                                <i class="fas fa-coins"></i>
                                Renovar com Créditos
                            </a>
                        </div>
                    </div>
                \`

                // Planos ativos
                if (activePlans.length > 0) {
                    html += \`
                        <div class="mb-4">
                            <h4 class="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                                <i class="fas fa-check-circle"></i>
                                Planos Ativos (\${activePlans.length})
                            </h4>
                            <div class="space-y-3">
                                \${activePlans.map(sub => renderSubscription(sub, true)).join('')}
                            </div>
                        </div>
                    \`
                }

                // Planos expirados
                if (expiredPlans.length > 0) {
                    html += \`
                        <div>
                            <h4 class="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
                                <i class="fas fa-history"></i>
                                Planos Anteriores (\${expiredPlans.length})
                            </h4>
                            <div class="space-y-3">
                                \${expiredPlans.map(sub => renderSubscription(sub, false)).join('')}
                            </div>
                        </div>
                    \`
                }

                if (subscriptions.length === 0) {
                    html += \`
                        <div class="text-center py-4 text-gray-500">
                            <i class="fas fa-inbox text-3xl mb-2 text-gray-300"></i>
                            <p class="text-sm">Nenhum histórico de assinaturas encontrado</p>
                        </div>
                    \`
                }

                container.innerHTML = html
                
            } catch (error) {
                console.error('Error loading subscription history:', error)
                container.innerHTML = \`
                    <div class="text-center py-8 text-red-500">
                        <i class="fas fa-exclamation-triangle text-4xl mb-3"></i>
                        <p class="text-lg font-semibold">Erro ao carregar histórico</p>
                        <p class="text-sm">Tente novamente mais tarde</p>
                    </div>
                \`
            }
        }
        
        // Render single subscription
        function renderSubscription(sub, isActive) {
            const expirationDate = new Date(sub.data_expiracao)
            const formattedDate = expirationDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
            
            const daysRemaining = Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24))
            
            const typeIcon = sub.teste_gratis 
                ? '<i class="fas fa-gift text-yellow-500"></i>'
                : '<i class="fas fa-crown text-purple-500"></i>'
            
            const statusBadge = isActive
                ? \`<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                     <i class="fas fa-check-circle"></i> Ativo
                   </span>\`
                : \`<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                     <i class="fas fa-times-circle"></i> Expirado
                   </span>\`
            
            const urgencyClass = isActive && daysRemaining <= 7 
                ? 'border-l-4 border-red-500 bg-red-50' 
                : isActive 
                ? 'border-l-4 border-green-500 bg-green-50' 
                : 'border-l-4 border-gray-300 bg-gray-50'
            
            return \`
                <div class="p-4 rounded-lg border \${urgencyClass}">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex items-start gap-3 flex-1">
                            <div class="text-2xl">
                                \${typeIcon}
                            </div>
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <h5 class="font-bold text-gray-800">\${sub.detalhe}</h5>
                                    \${statusBadge}
                                </div>
                                <div class="text-sm text-gray-600 space-y-1">
                                    <p>
                                        <i class="fas fa-calendar-alt text-gray-400 mr-1"></i>
                                        <strong>Expira em:</strong> \${formattedDate}
                                    </p>
                                    \${isActive ? \`
                                        <p class="\${daysRemaining <= 7 ? 'text-red-600 font-semibold' : 'text-green-600'}">
                                            <i class="fas fa-clock text-gray-400 mr-1"></i>
                                            <strong>Tempo restante:</strong> \${daysRemaining} dia(s)
                                        </p>
                                    \` : ''}
                                    \${sub.teste_gratis ? \`
                                        <p class="text-yellow-700">
                                            <i class="fas fa-info-circle mr-1"></i>
                                            <strong>Tipo:</strong> Teste Grátis (5 dias)
                                        </p>
                                    \` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    \${(!isActive || daysRemaining <= 30) ? \`
                    <div class="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                        <a href="https://pay.hotmart.com/I68113150G?off=q7xf5t1z" target="_blank"
                           class="flex-1 text-center text-xs font-bold py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">
                            <i class="fas fa-credit-card mr-1"></i> Cartão
                        </a>
                        <a href="https://assinaturas.ensinoplus.com.br" target="_blank"
                           class="flex-1 text-center text-xs font-bold py-2 px-3 rounded-lg bg-gray-700 hover:bg-gray-800 text-white transition">
                            <i class="fas fa-coins mr-1"></i> Créditos
                        </a>
                    </div>\` : ''}
                </div>
            \`
        }

        // Load rented lessons
        async function loadRentals() {
            const container = document.getElementById('rentalsContainer')
            try {
                const response = await axios.get('/api/user/rentals')
                const rentals = response.data.rentals || []

                if (rentals.length === 0) {
                    container.innerHTML = \`
                        <div class="text-center py-6 text-gray-500">
                            <i class="fas fa-shopping-cart text-3xl mb-2 text-gray-300"></i>
                            <p class="text-sm">Nenhuma aula alugada ainda</p>
                            <p class="text-xs text-gray-400 mt-1">Aulas disponíveis para aluguel aparecem na plataforma</p>
                        </div>
                    \`
                    return
                }

                const now = new Date()
                const activeRentals = rentals.filter(r => new Date(r.expires_at) > now)
                const expiredRentals = rentals.filter(r => new Date(r.expires_at) <= now)

                const renderRental = (r, active) => {
                    const exp = new Date(r.expires_at)
                    const formatted = exp.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                    const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))
                    const borderClass = active
                        ? (daysLeft <= 3 ? 'border-l-4 border-red-400 bg-red-50' : 'border-l-4 border-amber-400 bg-amber-50')
                        : 'border-l-4 border-gray-300 bg-gray-50'
                    return \`
                        <div class="p-4 rounded-lg border \${borderClass} mb-3">
                            <div class="flex items-start justify-between gap-3">
                                <div class="flex-1">
                                    <p class="text-xs text-gray-500 mb-1">
                                        \${r.course_title ? r.course_title + ' › ' : ''}\${r.module_title || ''}
                                    </p>
                                    <h5 class="font-bold text-gray-800 mb-1">\${r.lesson_title}</h5>
                                    <div class="text-sm text-gray-600 space-y-1">
                                        <p><i class="fas fa-coins text-amber-500 mr-1"></i><strong>Créditos pagos:</strong> \${r.credits_paid}</p>
                                        <p><i class="fas fa-calendar-alt text-gray-400 mr-1"></i><strong>Expira em:</strong> \${formatted}</p>
                                        \${active ? \`<p class="\${daysLeft <= 3 ? 'text-red-600 font-semibold' : 'text-amber-700'}">
                                            <i class="fas fa-clock mr-1"></i><strong>Tempo restante:</strong> \${daysLeft} dia(s)
                                        </p>\` : '<p class="text-gray-500"><i class="fas fa-times-circle mr-1"></i>Expirado</p>'}
                                    </div>
                                </div>
                                \${active ? \`<a href="/" onclick="localStorage.setItem('openLesson', '\${r.lesson_id}')"
                                    class="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition">
                                    <i class="fas fa-play mr-1"></i>Assistir
                                </a>\` : ''}
                            </div>
                        </div>
                    \`
                }

                let html = ''
                if (activeRentals.length > 0) {
                    html += \`<h4 class="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2">
                        <i class="fas fa-clock"></i> Aluguéis Ativos (\${activeRentals.length})</h4>\`
                    html += activeRentals.map(r => renderRental(r, true)).join('')
                }
                if (expiredRentals.length > 0) {
                    html += \`<h4 class="text-sm font-bold text-gray-500 mb-3 mt-4 flex items-center gap-2">
                        <i class="fas fa-history"></i> Aluguéis Anteriores (\${expiredRentals.length})</h4>\`
                    html += expiredRentals.map(r => renderRental(r, false)).join('')
                }
                container.innerHTML = html
            } catch (error) {
                console.error('Error loading rentals:', error)
                container.innerHTML = \`<div class="text-center py-4 text-gray-400 text-sm">
                    <i class="fas fa-exclamation-circle mr-1"></i>Erro ao carregar aluguéis
                </div>\`
            }
        }

        // Handle profile form submission
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            profileSubmitBtn.disabled = true
            profileSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...'
            
            try {
                const profileData = {
                    nome: document.getElementById('profileNome').value.trim(),
                    first_name: document.getElementById('profileFirstName').value.trim(),
                    last_name: document.getElementById('profileLastName').value.trim(),
                    cpf: document.getElementById('profileCPF').value.trim(),
                    telefone: document.getElementById('profileTelefone').value.trim(),
                    whatsapp: document.getElementById('profileWhatsapp').value.trim(),
                    end_cep: document.getElementById('profileCEP').value.trim(),
                    end_logradouro: document.getElementById('profileLogradouro').value.trim(),
                    end_numero: document.getElementById('profileNumero').value.trim(),
                    end_cidade: document.getElementById('profileCidade').value.trim(),
                    end_estado: document.getElementById('profileEstado').value
                }
                
                const response = await axios.put('/api/user/profile', profileData)
                
                if (response.data.success) {
                    showMessage('✅ ' + response.data.message, false)
                    
                    // Update header name if changed
                    if (profileData.nome) {
                        document.getElementById('userName').textContent = profileData.nome
                    }
                }
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao atualizar perfil'
                showMessage('❌ ' + errorMessage, true)
            } finally {
                profileSubmitBtn.disabled = false
                profileSubmitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações'
            }
        })
        
        // Handle password form submission
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            
            const currentPassword = document.getElementById('currentPassword').value
            const newPassword = document.getElementById('newPassword').value
            const confirmPassword = document.getElementById('confirmPassword').value
            
            if (newPassword !== confirmPassword) {
                showMessage('❌ As senhas não coincidem', true)
                return
            }
            
            if (newPassword.length < 6) {
                showMessage('❌ A nova senha deve ter pelo menos 6 caracteres', true)
                return
            }
            
            if (currentPassword === newPassword) {
                showMessage('❌ A nova senha deve ser diferente da senha atual', true)
                return
            }
            
            passwordSubmitBtn.disabled = true
            passwordSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Alterando...'
            
            try {
                const response = await axios.post('/api/auth/change-password', {
                    currentPassword,
                    newPassword
                })
                
                if (response.data.success) {
                    showMessage('✅ ' + response.data.message, false)
                    
                    // Clear form
                    passwordForm.reset()
                    
                    // Optional: redirect after password change
                    setTimeout(() => {
                        showMessage('🔄 Redirecionando...', false)
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 1000)
                    }, 2000)
                }
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Erro ao alterar senha'
                showMessage('❌ ' + errorMessage, true)
            } finally {
                passwordSubmitBtn.disabled = false
                passwordSubmitBtn.innerHTML = '<i class="fas fa-check"></i> Alterar Senha'
            }
        })
        
        // Handle logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja sair?')) {
                await auth.logout()
            }
        })
        
        // Initialize
        loadUserProfile()
    <\/script>
</body>
</html>
  `));I.get("/certificates",e=>e.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meus Certificados - CCT</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <img src="https://page.gensparksite.com/v1/base64_upload/8f96be1bcec5a62130e0023674c921df" 
                             alt="CCT Logo" 
                             class="h-12 md:h-16 w-auto">
                        <div>
                            <h1 class="text-2xl font-bold">CCT</h1>
                            <p class="text-blue-200 text-xs">Clube do Cálculo Trabalhista</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div id="userInfo" class="text-right hidden">
                            <p class="text-sm font-semibold" id="userName">Carregando...</p>
                            <p class="text-xs text-blue-200" id="userEmail">...</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.location.href='/'" 
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2">
                                <i class="fas fa-home"></i>
                                <span class="hidden sm:inline">Início</span>
                            </button>
                            <button onclick="window.location.href='/profile'" 
                                    class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-2">
                                <i class="fas fa-user"></i>
                                <span class="hidden sm:inline">Perfil</span>
                            </button>
                            <button id="logoutBtn" 
                                    class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2">
                                <i class="fas fa-sign-out-alt"></i>
                                <span class="hidden sm:inline">Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="container mx-auto px-4 py-8 max-w-6xl">
            <div class="mb-6">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-certificate text-yellow-500 mr-2"></i>
                    Meus Certificados
                </h2>
                <p class="text-gray-600">Visualize e baixe seus certificados de conclusão de curso</p>
            </div>

            <!-- Message Div -->
            <div id="messageDiv" class="hidden mb-6"></div>

            <!-- Loading State -->
            <div id="loadingState" class="text-center py-12">
                <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                <p class="text-gray-600">Carregando certificados...</p>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="hidden text-center py-12 bg-white rounded-xl shadow-md">
                <i class="fas fa-certificate text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Nenhum certificado ainda</h3>
                <p class="text-gray-600 mb-6">Complete um curso para receber seu certificado!</p>
                <button onclick="window.location.href='/'" 
                        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                    <i class="fas fa-book mr-2"></i>
                    Ver Cursos
                </button>
            </div>

            <!-- Certificates Grid -->
            <div id="certificatesGrid" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Certificates will be loaded here -->
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
    <script src="/static/auth.js"><\/script>
    <script>
        const loadingState = document.getElementById('loadingState')
        const emptyState = document.getElementById('emptyState')
        const certificatesGrid = document.getElementById('certificatesGrid')
        const messageDiv = document.getElementById('messageDiv')
        
        function showMessage(message, isError = false) {
            messageDiv.innerHTML = \`
                <div class="p-4 rounded-lg border \${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}">
                    <i class="fas \${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
                    \${message}
                </div>
            \`
            messageDiv.classList.remove('hidden')
            
            setTimeout(() => {
                messageDiv.classList.add('hidden')
            }, 5000)
        }
        
        function formatDate(dateString) {
            const date = new Date(dateString)
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
        
        async function loadCertificates() {
            try {
                // Load user info
                const userResponse = await axios.get('/api/auth/me')
                if (userResponse.data.user) {
                    document.getElementById('userName').textContent = userResponse.data.user.user_metadata?.name || 'Usuário'
                    document.getElementById('userEmail').textContent = userResponse.data.user.email || ''
                    document.getElementById('userInfo').classList.remove('hidden')
                }
                
                // Load certificates
                const response = await axios.get('/api/certificates')
                const certificates = response.data.certificates || []
                
                loadingState.classList.add('hidden')
                
                if (certificates.length === 0) {
                    emptyState.classList.remove('hidden')
                } else {
                    certificatesGrid.classList.remove('hidden')
                    certificatesGrid.innerHTML = certificates.map(cert => \`
                        <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                            <div class="relative h-48 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 flex items-center justify-center">
                                \${cert.template_url ? 
                                    \`<img src="\${cert.template_url}" alt="Certificado" class="w-full h-full object-cover">\` :
                                    \`<div class="text-center text-white p-6">
                                        <i class="fas fa-award text-6xl mb-2 opacity-75"></i>
                                        <p class="text-sm font-bold">CERTIFICADO</p>
                                    </div>\`
                                }
                                <div class="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-xs font-bold text-yellow-600">
                                    <i class="fas fa-star mr-1"></i>
                                    Concluído
                                </div>
                            </div>
                            <div class="p-6">
                                <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                                    \${cert.course_title}
                                </h3>
                                <div class="space-y-2 mb-4 text-sm text-gray-600">
                                    <p>
                                        <i class="fas fa-user text-blue-600 mr-2"></i>
                                        \${cert.user_name}
                                    </p>
                                    <p>
                                        <i class="fas fa-calendar text-green-600 mr-2"></i>
                                        Concluído em \${formatDate(cert.completion_date)}
                                    </p>
                                </div>
                                <button onclick="viewCertificate(\${cert.id}, '\${cert.template_url || ''}')" 
                                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <i class="fas fa-eye"></i>
                                    Visualizar Certificado
                                </button>
                            </div>
                        </div>
                    \`).join('')
                }
            } catch (error) {
                console.error('Error loading certificates:', error)
                loadingState.classList.add('hidden')
                emptyState.classList.remove('hidden')
            }
        }
        
        function viewCertificate(certId, templateUrl) {
            if (templateUrl) {
                window.open(templateUrl, '_blank')
            } else {
                showMessage('⚠️ Template de certificado não configurado para este curso', true)
            }
        }
        
        // Handle logout
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja sair?')) {
                await auth.logout()
            }
        })
        
        // Initialize
        loadCertificates()
    <\/script>
</body>
</html>
  `));const Cs=new Vn,To=Object.assign({"/src/index.tsx":I});let $n=!1;for(const[,e]of Object.entries(To))e&&(Cs.all("*",t=>{let r;try{r=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,r)}),Cs.notFound(t=>{let r;try{r=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,r)}),$n=!0);if(!$n)throw new Error("Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']");var er={exports:{}},tr={exports:{}},De={},rr={},Ps;function ei(){if(Ps)return rr;Ps=1,rr.parse=function(r,s){return new e(r,s).parse()};class e{constructor(s,n){this.source=s,this.transform=n||t,this.position=0,this.entries=[],this.recorded=[],this.dimension=0}isEof(){return this.position>=this.source.length}nextCharacter(){var s=this.source[this.position++];return s==="\\"?{value:this.source[this.position++],escaped:!0}:{value:s,escaped:!1}}record(s){this.recorded.push(s)}newEntry(s){var n;(this.recorded.length>0||s)&&(n=this.recorded.join(""),n==="NULL"&&!s&&(n=null),n!==null&&(n=this.transform(n)),this.entries.push(n),this.recorded=[])}consumeDimensions(){if(this.source[0]==="[")for(;!this.isEof();){var s=this.nextCharacter();if(s.value==="=")break}}parse(s){var n,i,o;for(this.consumeDimensions();!this.isEof();)if(n=this.nextCharacter(),n.value==="{"&&!o)this.dimension++,this.dimension>1&&(i=new e(this.source.substr(this.position-1),this.transform),this.entries.push(i.parse(!0)),this.position+=i.position-2);else if(n.value==="}"&&!o){if(this.dimension--,!this.dimension&&(this.newEntry(),s))return this.entries}else n.value==='"'&&!n.escaped?(o&&this.newEntry(!0),o=!o):n.value===","&&!o?this.newEntry():this.record(n.value);if(this.dimension!==0)throw new Error("array dimension not balanced");return this.entries}}function t(r){return r}return rr}var sr,Ts;function ti(){if(Ts)return sr;Ts=1;var e=ei();return sr={create:function(t,r){return{parse:function(){return e.parse(t,r)}}}},sr}var nr,Rs;function Ro(){if(Rs)return nr;Rs=1;var e=/(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/,t=/^(\d{1,})-(\d{2})-(\d{2})( BC)?$/,r=/([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/,s=/^-?infinity$/;nr=function(u){if(s.test(u))return Number(u.replace("i","I"));var l=e.exec(u);if(!l)return n(u)||null;var f=!!l[8],d=parseInt(l[1],10);f&&(d=o(d));var h=parseInt(l[2],10)-1,m=l[3],b=parseInt(l[4],10),v=parseInt(l[5],10),p=parseInt(l[6],10),y=l[7];y=y?1e3*parseFloat(y):0;var E,A=i(u);return A!=null?(E=new Date(Date.UTC(d,h,m,b,v,p,y)),a(d)&&E.setUTCFullYear(d),A!==0&&E.setTime(E.getTime()-A)):(E=new Date(d,h,m,b,v,p,y),a(d)&&E.setFullYear(d)),E};function n(c){var u=t.exec(c);if(u){var l=parseInt(u[1],10),f=!!u[4];f&&(l=o(l));var d=parseInt(u[2],10)-1,h=u[3],m=new Date(l,d,h);return a(l)&&m.setFullYear(l),m}}function i(c){if(c.endsWith("+00"))return 0;var u=r.exec(c.split(" ")[1]);if(u){var l=u[1];if(l==="Z")return 0;var f=l==="-"?-1:1,d=parseInt(u[2],10)*3600+parseInt(u[3]||0,10)*60+parseInt(u[4]||0,10);return d*f*1e3}}function o(c){return-(c-1)}function a(c){return c>=0&&c<100}return nr}var ir,Is;function Io(){if(Is)return ir;Is=1,ir=t;var e=Object.prototype.hasOwnProperty;function t(r){for(var s=1;s<arguments.length;s++){var n=arguments[s];for(var i in n)e.call(n,i)&&(r[i]=n[i])}return r}return ir}var or,Ns;function No(){if(Ns)return or;Ns=1;var e=Io();or=t;function t(v){if(!(this instanceof t))return new t(v);e(this,b(v))}var r=["seconds","minutes","hours","days","months","years"];t.prototype.toPostgres=function(){var v=r.filter(this.hasOwnProperty,this);return this.milliseconds&&v.indexOf("seconds")<0&&v.push("seconds"),v.length===0?"0":v.map(function(p){var y=this[p]||0;return p==="seconds"&&this.milliseconds&&(y=(y+this.milliseconds/1e3).toFixed(6).replace(/\.?0+$/,"")),y+" "+p},this).join(" ")};var s={years:"Y",months:"M",days:"D",hours:"H",minutes:"M",seconds:"S"},n=["years","months","days"],i=["hours","minutes","seconds"];t.prototype.toISOString=t.prototype.toISO=function(){var v=n.map(y,this).join(""),p=i.map(y,this).join("");return"P"+v+"T"+p;function y(E){var A=this[E]||0;return E==="seconds"&&this.milliseconds&&(A=(A+this.milliseconds/1e3).toFixed(6).replace(/0+$/,"")),A+s[E]}};var o="([+-]?\\d+)",a=o+"\\s+years?",c=o+"\\s+mons?",u=o+"\\s+days?",l="([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?",f=new RegExp([a,c,u,l].map(function(v){return"("+v+")?"}).join("\\s*")),d={years:2,months:4,days:6,hours:9,minutes:10,seconds:11,milliseconds:12},h=["hours","minutes","seconds","milliseconds"];function m(v){var p=v+"000000".slice(v.length);return parseInt(p,10)/1e3}function b(v){if(!v)return{};var p=f.exec(v),y=p[8]==="-";return Object.keys(d).reduce(function(E,A){var N=d[A],C=p[N];return!C||(C=A==="milliseconds"?m(C):parseInt(C,10),!C)||(y&&~h.indexOf(A)&&(C*=-1),E[A]=C),E},{})}return or}var ar,Ds;function Do(){if(Ds)return ar;Ds=1;var e=Buffer.from||Buffer;return ar=function(r){if(/^\\x/.test(r))return e(r.substr(2),"hex");for(var s="",n=0;n<r.length;)if(r[n]!=="\\")s+=r[n],++n;else if(/[0-7]{3}/.test(r.substr(n+1,3)))s+=String.fromCharCode(parseInt(r.substr(n+1,3),8)),n+=4;else{for(var i=1;n+i<r.length&&r[n+i]==="\\";)i++;for(var o=0;o<Math.floor(i/2);++o)s+="\\";n+=Math.floor(i/2)*2}return e(s,"binary")},ar}var lr,qs;function qo(){if(qs)return lr;qs=1;var e=ei(),t=ti(),r=Ro(),s=No(),n=Do();function i(g){return function(w){return w===null?w:g(w)}}function o(g){return g===null?g:g==="TRUE"||g==="t"||g==="true"||g==="y"||g==="yes"||g==="on"||g==="1"}function a(g){return g?e.parse(g,o):null}function c(g){return parseInt(g,10)}function u(g){return g?e.parse(g,i(c)):null}function l(g){return g?e.parse(g,i(function(x){return y(x).trim()})):null}var f=function(g){if(!g)return null;var x=t.create(g,function(w){return w!==null&&(w=A(w)),w});return x.parse()},d=function(g){if(!g)return null;var x=t.create(g,function(w){return w!==null&&(w=parseFloat(w)),w});return x.parse()},h=function(g){if(!g)return null;var x=t.create(g);return x.parse()},m=function(g){if(!g)return null;var x=t.create(g,function(w){return w!==null&&(w=r(w)),w});return x.parse()},b=function(g){if(!g)return null;var x=t.create(g,function(w){return w!==null&&(w=s(w)),w});return x.parse()},v=function(g){return g?e.parse(g,i(n)):null},p=function(g){return parseInt(g,10)},y=function(g){var x=String(g);return/^\d+$/.test(x)?x:g},E=function(g){return g?e.parse(g,i(JSON.parse)):null},A=function(g){return g[0]!=="("?null:(g=g.substring(1,g.length-1).split(","),{x:parseFloat(g[0]),y:parseFloat(g[1])})},N=function(g){if(g[0]!=="<"&&g[1]!=="(")return null;for(var x="(",w="",_=!1,P=2;P<g.length-1;P++){if(_||(x+=g[P]),g[P]===")"){_=!0;continue}else if(!_)continue;g[P]!==","&&(w+=g[P])}var R=A(x);return R.radius=parseFloat(w),R},C=function(g){g(20,y),g(21,p),g(23,p),g(26,p),g(700,parseFloat),g(701,parseFloat),g(16,o),g(1082,r),g(1114,r),g(1184,r),g(600,A),g(651,h),g(718,N),g(1e3,a),g(1001,v),g(1005,u),g(1007,u),g(1028,u),g(1016,l),g(1017,f),g(1021,d),g(1022,d),g(1231,d),g(1014,h),g(1015,h),g(1008,h),g(1009,h),g(1040,h),g(1041,h),g(1115,m),g(1182,m),g(1185,m),g(1186,s),g(1187,b),g(17,n),g(114,JSON.parse.bind(JSON)),g(3802,JSON.parse.bind(JSON)),g(199,E),g(3807,E),g(3907,h),g(2951,h),g(791,h),g(1183,h),g(1270,h)};return lr={init:C},lr}var cr,Os;function Oo(){if(Os)return cr;Os=1;var e=1e6;function t(r){var s=r.readInt32BE(0),n=r.readUInt32BE(4),i="";s<0&&(s=~s+(n===0),n=~n+1>>>0,i="-");var o="",a,c,u,l,f,d;{if(a=s%e,s=s/e>>>0,c=4294967296*a+n,n=c/e>>>0,u=""+(c-e*n),n===0&&s===0)return i+u+o;for(l="",f=6-u.length,d=0;d<f;d++)l+="0";o=l+u+o}{if(a=s%e,s=s/e>>>0,c=4294967296*a+n,n=c/e>>>0,u=""+(c-e*n),n===0&&s===0)return i+u+o;for(l="",f=6-u.length,d=0;d<f;d++)l+="0";o=l+u+o}{if(a=s%e,s=s/e>>>0,c=4294967296*a+n,n=c/e>>>0,u=""+(c-e*n),n===0&&s===0)return i+u+o;for(l="",f=6-u.length,d=0;d<f;d++)l+="0";o=l+u+o}return a=s%e,c=4294967296*a+n,u=""+c%e,i+u+o}return cr=t,cr}var ur,ks;function ko(){if(ks)return ur;ks=1;var e=Oo(),t=function(h,m,b,v,p){b=b||0,v=v||!1,p=p||function(_,P,R){return _*Math.pow(2,R)+P};var y=b>>3,E=function(_){return v?~_&255:_},A=255,N=8-b%8;m<N&&(A=255<<8-m&255,N=m),b&&(A=A>>b%8);var C=0;b%8+m>=8&&(C=p(0,E(h[y])&A,N));for(var g=m+b>>3,x=y+1;x<g;x++)C=p(C,E(h[x]),8);var w=(m+b)%8;return w>0&&(C=p(C,E(h[g])>>8-w,w)),C},r=function(h,m,b){var v=Math.pow(2,b-1)-1,p=t(h,1),y=t(h,b,1);if(y===0)return 0;var E=1,A=function(C,g,x){C===0&&(C=1);for(var w=1;w<=x;w++)E/=2,(g&1<<x-w)>0&&(C+=E);return C},N=t(h,m,b+1,!1,A);return y==Math.pow(2,b+1)-1?N===0?p===0?1/0:-1/0:NaN:(p===0?1:-1)*Math.pow(2,y-v)*N},s=function(h){return t(h,1)==1?-1*(t(h,15,1,!0)+1):t(h,15,1)},n=function(h){return t(h,1)==1?-1*(t(h,31,1,!0)+1):t(h,31,1)},i=function(h){return r(h,23,8)},o=function(h){return r(h,52,11)},a=function(h){var m=t(h,16,32);if(m==49152)return NaN;for(var b=Math.pow(1e4,t(h,16,16)),v=0,p=t(h,16),y=0;y<p;y++)v+=t(h,16,64+16*y)*b,b/=1e4;var E=Math.pow(10,t(h,16,48));return(m===0?1:-1)*Math.round(v*E)/E},c=function(h,m){var b=t(m,1),v=t(m,63,1),p=new Date((b===0?1:-1)*v/1e3+9466848e5);return h||p.setTime(p.getTime()+p.getTimezoneOffset()*6e4),p.usec=v%1e3,p.getMicroSeconds=function(){return this.usec},p.setMicroSeconds=function(y){this.usec=y},p.getUTCMicroSeconds=function(){return this.usec},p},u=function(h){var m=t(h,32);t(h,32,32);for(var b=t(h,32,64),v=96,p=[],y=0;y<m;y++)p[y]=t(h,32,v),v+=32,v+=32;var E=function(N){var C=t(h,32,v);if(v+=32,C==4294967295)return null;var g;if(N==23||N==20)return g=t(h,C*8,v),v+=C*8,g;if(N==25)return g=h.toString(this.encoding,v>>3,(v+=C<<3)>>3),g;console.log("ERROR: ElementType not implemented: "+N)},A=function(N,C){var g=[],x;if(N.length>1){var w=N.shift();for(x=0;x<w;x++)g[x]=A(N,C);N.unshift(w)}else for(x=0;x<N[0];x++)g[x]=E(C);return g};return A(p,b)},l=function(h){return h.toString("utf8")},f=function(h){return h===null?null:t(h,8)>0},d=function(h){h(20,e),h(21,s),h(23,n),h(26,n),h(1700,a),h(700,i),h(701,o),h(16,f),h(1114,c.bind(null,!1)),h(1184,c.bind(null,!0)),h(1e3,u),h(1007,u),h(1016,u),h(1008,u),h(1009,u),h(25,l)};return ur={init:d},ur}var dr,Ls;function Lo(){return Ls||(Ls=1,dr={BOOL:16,BYTEA:17,CHAR:18,INT8:20,INT2:21,INT4:23,REGPROC:24,TEXT:25,OID:26,TID:27,XID:28,CID:29,JSON:114,XML:142,PG_NODE_TREE:194,SMGR:210,PATH:602,POLYGON:604,CIDR:650,FLOAT4:700,FLOAT8:701,ABSTIME:702,RELTIME:703,TINTERVAL:704,CIRCLE:718,MACADDR8:774,MONEY:790,MACADDR:829,INET:869,ACLITEM:1033,BPCHAR:1042,VARCHAR:1043,DATE:1082,TIME:1083,TIMESTAMP:1114,TIMESTAMPTZ:1184,INTERVAL:1186,TIMETZ:1266,BIT:1560,VARBIT:1562,NUMERIC:1700,REFCURSOR:1790,REGPROCEDURE:2202,REGOPER:2203,REGOPERATOR:2204,REGCLASS:2205,REGTYPE:2206,UUID:2950,TXID_SNAPSHOT:2970,PG_LSN:3220,PG_NDISTINCT:3361,PG_DEPENDENCIES:3402,TSVECTOR:3614,TSQUERY:3615,GTSVECTOR:3642,REGCONFIG:3734,REGDICTIONARY:3769,JSONB:3802,REGNAMESPACE:4089,REGROLE:4096}),dr}var js;function vt(){if(js)return De;js=1;var e=qo(),t=ko(),r=ti(),s=Lo();De.getTypeParser=o,De.setTypeParser=a,De.arrayParser=r,De.builtins=s;var n={text:{},binary:{}};function i(c){return String(c)}function o(c,u){return u=u||"text",n[u]&&n[u][c]||i}function a(c,u,l){typeof u=="function"&&(l=u,u="text"),n[u][c]=l}return e.init(function(c,u){n.text[c]=u}),t.init(function(c,u){n.binary[c]=u}),De}var Bs;function wt(){return Bs||(Bs=1,(function(e){var t={};let r;try{r=process.platform==="win32"?t.USERNAME:t.USER}catch{}e.exports={host:"localhost",user:r,database:void 0,password:null,connectionString:void 0,port:5432,rows:0,binary:!1,max:10,idleTimeoutMillis:3e4,client_encoding:"",ssl:!1,application_name:void 0,fallback_application_name:void 0,options:void 0,parseInputDatesAsUTC:!1,statement_timeout:!1,lock_timeout:!1,idle_in_transaction_session_timeout:!1,query_timeout:!1,connect_timeout:0,keepalives:1,keepalives_idle:0};const s=vt(),n=s.getTypeParser(20,"text"),i=s.getTypeParser(1016,"text");e.exports.__defineSetter__("parseInt8",function(o){s.setTypeParser(20,"text",o?s.getTypeParser(23,"text"):n),s.setTypeParser(1016,"text",o?s.getTypeParser(1007,"text"):i)})})(tr)),tr.exports}var fr,Ms;function Ze(){if(Ms)return fr;Ms=1;const e=wt(),t=He,{isDate:r}=t.types||t;function s(d){return'"'+d.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'}function n(d){let h="{";for(let m=0;m<d.length;m++)if(m>0&&(h=h+","),d[m]===null||typeof d[m]>"u")h=h+"NULL";else if(Array.isArray(d[m]))h=h+n(d[m]);else if(ArrayBuffer.isView(d[m])){let b=d[m];if(!(b instanceof Buffer)){const v=Buffer.from(b.buffer,b.byteOffset,b.byteLength);v.length===b.byteLength?b=v:b=v.slice(b.byteOffset,b.byteOffset+b.byteLength)}h+="\\\\x"+b.toString("hex")}else h+=s(i(d[m]));return h=h+"}",h}const i=function(d,h){if(d==null)return null;if(typeof d=="object"){if(d instanceof Buffer)return d;if(ArrayBuffer.isView(d)){const m=Buffer.from(d.buffer,d.byteOffset,d.byteLength);return m.length===d.byteLength?m:m.slice(d.byteOffset,d.byteOffset+d.byteLength)}return r(d)?e.parseInputDatesAsUTC?c(d):a(d):Array.isArray(d)?n(d):o(d,h)}return d.toString()};function o(d,h){if(d&&typeof d.toPostgres=="function"){if(h=h||[],h.indexOf(d)!==-1)throw new Error('circular reference detected while preparing "'+d+'" for query');return h.push(d),i(d.toPostgres(i),h)}return JSON.stringify(d)}function a(d){let h=-d.getTimezoneOffset(),m=d.getFullYear();const b=m<1;b&&(m=Math.abs(m)+1);let v=String(m).padStart(4,"0")+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+"T"+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")+":"+String(d.getSeconds()).padStart(2,"0")+"."+String(d.getMilliseconds()).padStart(3,"0");return h<0?(v+="-",h*=-1):v+="+",v+=String(Math.floor(h/60)).padStart(2,"0")+":"+String(h%60).padStart(2,"0"),b&&(v+=" BC"),v}function c(d){let h=d.getUTCFullYear();const m=h<1;m&&(h=Math.abs(h)+1);let b=String(h).padStart(4,"0")+"-"+String(d.getUTCMonth()+1).padStart(2,"0")+"-"+String(d.getUTCDate()).padStart(2,"0")+"T"+String(d.getUTCHours()).padStart(2,"0")+":"+String(d.getUTCMinutes()).padStart(2,"0")+":"+String(d.getUTCSeconds()).padStart(2,"0")+"."+String(d.getUTCMilliseconds()).padStart(3,"0");return b+="+00:00",m&&(b+=" BC"),b}function u(d,h,m){return d=typeof d=="string"?{text:d}:d,h&&(typeof h=="function"?d.callback=h:d.values=h),m&&(d.callback=m),d}return fr={prepareValue:function(h){return i(h)},normalizeQueryConfig:u,escapeIdentifier:function(d){return'"'+d.replace(/"/g,'""')+'"'},escapeLiteral:function(d){let h=!1,m="'";if(d==null||typeof d!="string")return"''";for(let b=0;b<d.length;b++){const v=d[b];v==="'"?m+=v+v:v==="\\"?(m+=v+v,h=!0):m+=v}return m+="'",h===!0&&(m=" E"+m),m}},fr}var lt={exports:{}},hr,Us;function jo(){if(Us)return hr;Us=1;const e=_n;function t(a){return e.createHash("md5").update(a,"utf-8").digest("hex")}function r(a,c,u){const l=t(c+a);return"md5"+t(Buffer.concat([Buffer.from(l),u]))}function s(a){return e.createHash("sha256").update(a).digest()}function n(a,c){return a=a.replace(/(\D)-/,"$1"),e.createHash(a).update(c).digest()}function i(a,c){return e.createHmac("sha256",a).update(c).digest()}async function o(a,c,u){return e.pbkdf2Sync(a,c,u,32,"sha256")}return hr={postgresMd5PasswordHash:r,randomBytes:e.randomBytes,deriveKey:o,sha256:s,hashByName:n,hmacSha256:i,md5:t},hr}var pr,Hs;function Bo(){if(Hs)return pr;Hs=1;const e=_n;pr={postgresMd5PasswordHash:o,randomBytes:n,deriveKey:l,sha256:a,hashByName:c,hmacSha256:u,md5:i};const t=e.webcrypto||globalThis.crypto,r=t.subtle,s=new TextEncoder;function n(f){return t.getRandomValues(Buffer.alloc(f))}async function i(f){try{return e.createHash("md5").update(f,"utf-8").digest("hex")}catch{const h=typeof f=="string"?s.encode(f):f,m=await r.digest("MD5",h);return Array.from(new Uint8Array(m)).map(b=>b.toString(16).padStart(2,"0")).join("")}}async function o(f,d,h){const m=await i(d+f);return"md5"+await i(Buffer.concat([Buffer.from(m),h]))}async function a(f){return await r.digest("SHA-256",f)}async function c(f,d){return await r.digest(f,d)}async function u(f,d){const h=await r.importKey("raw",f,{name:"HMAC",hash:"SHA-256"},!1,["sign"]);return await r.sign("HMAC",h,s.encode(d))}async function l(f,d,h){const m=await r.importKey("raw",s.encode(f),"PBKDF2",!1,["deriveBits"]),b={name:"PBKDF2",hash:"SHA-256",salt:d,iterations:h};return await r.deriveBits(b,m,256,["deriveBits"])}return pr}var Fs;function ri(){return Fs||(Fs=1,parseInt(process.versions&&process.versions.node&&process.versions.node.split(".")[0])<15?lt.exports=jo():lt.exports=Bo()),lt.exports}var mr,zs;function Mo(){if(zs)return mr;zs=1;function e(i,o){return new Error("SASL channel binding: "+i+" when parsing public certificate "+o.toString("base64"))}function t(i,o){let a=i[o++];if(a<128)return{length:a,index:o};const c=a&127;if(c>4)throw e("bad length",i);a=0;for(let u=0;u<c;u++)a=a<<8|i[o++];return{length:a,index:o}}function r(i,o){if(i[o++]!==6)throw e("non-OID data",i);const{length:a,index:c}=t(i,o);o=c;const u=o+a,l=i[o++];let f=(l/40>>0)+"."+l%40;for(;o<u;){let d=0;for(;o<u;){const h=i[o++];if(d=d<<7|h&127,h<128)break}f+="."+d}return{oid:f,index:o}}function s(i,o){if(i[o++]!==48)throw e("non-sequence data",i);return t(i,o)}function n(i,o){o===void 0&&(o=0),o=s(i,o).index;const{length:a,index:c}=s(i,o);o=c+a,o=s(i,o).index;const{oid:u,index:l}=r(i,o);switch(u){case"1.2.840.113549.1.1.4":return"MD5";case"1.2.840.113549.1.1.5":return"SHA-1";case"1.2.840.113549.1.1.11":return"SHA-256";case"1.2.840.113549.1.1.12":return"SHA-384";case"1.2.840.113549.1.1.13":return"SHA-512";case"1.2.840.113549.1.1.14":return"SHA-224";case"1.2.840.113549.1.1.15":return"SHA512-224";case"1.2.840.113549.1.1.16":return"SHA512-256";case"1.2.840.10045.4.1":return"SHA-1";case"1.2.840.10045.4.3.1":return"SHA-224";case"1.2.840.10045.4.3.2":return"SHA-256";case"1.2.840.10045.4.3.3":return"SHA-384";case"1.2.840.10045.4.3.4":return"SHA-512";case"1.2.840.113549.1.1.10":{if(o=l,o=s(i,o).index,i[o++]!==160)throw e("non-tag data",i);o=t(i,o).index,o=s(i,o).index;const{oid:f}=r(i,o);switch(f){case"1.2.840.113549.2.5":return"MD5";case"1.3.14.3.2.26":return"SHA-1";case"2.16.840.1.101.3.4.2.1":return"SHA-256";case"2.16.840.1.101.3.4.2.2":return"SHA-384";case"2.16.840.1.101.3.4.2.3":return"SHA-512"}throw e("unknown hash OID "+f,i)}case"1.3.101.110":case"1.3.101.112":return"SHA-512";case"1.3.101.111":case"1.3.101.113":throw e("Ed448 certificate channel binding is not currently supported by Postgres")}throw e("unknown OID "+u,i)}return mr={signatureAlgorithmHashFromCertificate:n},mr}var gr,Qs;function Uo(){if(Qs)return gr;Qs=1;const e=ri(),{signatureAlgorithmHashFromCertificate:t}=Mo();function r(f,d){const h=["SCRAM-SHA-256"];d&&h.unshift("SCRAM-SHA-256-PLUS");const m=h.find(p=>f.includes(p));if(!m)throw new Error("SASL: Only mechanism(s) "+h.join(" and ")+" are supported");if(m==="SCRAM-SHA-256-PLUS"&&typeof d.getPeerCertificate!="function")throw new Error("SASL: Mechanism SCRAM-SHA-256-PLUS requires a certificate");const b=e.randomBytes(18).toString("base64");return{mechanism:m,clientNonce:b,response:(m==="SCRAM-SHA-256-PLUS"?"p=tls-server-end-point":d?"y":"n")+",,n=*,r="+b,message:"SASLInitialResponse"}}async function s(f,d,h,m){if(f.message!=="SASLInitialResponse")throw new Error("SASL: Last message was not SASLInitialResponse");if(typeof d!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");if(d==="")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a non-empty string");if(typeof h!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");const b=c(h);if(b.nonce.startsWith(f.clientNonce)){if(b.nonce.length===f.clientNonce.length)throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");const v="n=*,r="+f.clientNonce,p="r="+b.nonce+",s="+b.salt+",i="+b.iteration;let y=m?"eSws":"biws";if(f.mechanism==="SCRAM-SHA-256-PLUS"){const S=m.getPeerCertificate().raw;let D=t(S);(D==="MD5"||D==="SHA-1")&&(D="SHA-256");const M=await e.hashByName(D,S);y=Buffer.concat([Buffer.from("p=tls-server-end-point,,"),Buffer.from(M)]).toString("base64")}const E="c="+y+",r="+b.nonce,A=v+","+p+","+E,N=Buffer.from(b.salt,"base64"),C=await e.deriveKey(d,N,b.iteration),g=await e.hmacSha256(C,"Client Key"),x=await e.sha256(g),w=await e.hmacSha256(x,A),_=l(Buffer.from(g),Buffer.from(w)).toString("base64"),P=await e.hmacSha256(C,"Server Key"),R=await e.hmacSha256(P,A);f.message="SASLResponse",f.serverSignature=Buffer.from(R).toString("base64"),f.response=E+",p="+_}function n(f,d){if(f.message!=="SASLResponse")throw new Error("SASL: Last message was not SASLResponse");if(typeof d!="string")throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");const{serverSignature:h}=u(d);if(h!==f.serverSignature)throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match")}function i(f){if(typeof f!="string")throw new TypeError("SASL: text must be a string");return f.split("").map((d,h)=>f.charCodeAt(h)).every(d=>d>=33&&d<=43||d>=45&&d<=126)}function o(f){return/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(f)}function a(f){if(typeof f!="string")throw new TypeError("SASL: attribute pairs text must be a string");return new Map(f.split(",").map(d=>{if(!/^.=/.test(d))throw new Error("SASL: Invalid attribute pair entry");const h=d[0],m=d.substring(2);return[h,m]}))}function c(f){const d=a(f),h=d.get("r");if(h){if(!i(h))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");const m=d.get("s");if(m){if(!o(m))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");const b=d.get("i");if(b){if(!/^[1-9][0-9]*$/.test(b))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");const v=parseInt(b,10);return{nonce:h,salt:m,iteration:v}}function u(f){const h=a(f).get("v");if(h){if(!o(h))throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64")}else throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");return{serverSignature:h}}function l(f,d){if(!Buffer.isBuffer(f))throw new TypeError("first argument must be a Buffer");if(!Buffer.isBuffer(d))throw new TypeError("second argument must be a Buffer");if(f.length!==d.length)throw new Error("Buffer lengths must match");if(f.length===0)throw new Error("Buffers cannot be empty");return Buffer.from(f.map((h,m)=>f[m]^d[m]))}return gr={startSession:r,continueSession:s,finalizeSession:n},gr}var br,Vs;function Fr(){if(Vs)return br;Vs=1;const e=vt();function t(r){this._types=r||e,this.text={},this.binary={}}return t.prototype.getOverrides=function(r){switch(r){case"text":return this.text;case"binary":return this.binary;default:return{}}},t.prototype.setTypeParser=function(r,s,n){typeof s=="function"&&(n=s,s="text"),this.getOverrides(s)[r]=n},t.prototype.getTypeParser=function(r,s){return s=s||"text",this.getOverrides(s)[r]||this._types.getTypeParser(r,s)},br=t,br}var yr,Xs;function Ho(){if(Xs)return yr;Xs=1;function e(i,o={}){if(i.charAt(0)==="/"){const h=i.split(" ");return{host:h[0],database:h[1]}}const a={};let c,u=!1;/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(i)&&(i=encodeURI(i).replace(/%25(\d\d)/g,"%$1"));try{try{c=new URL(i,"postgres://base")}catch{c=new URL(i.replace("@/","@___DUMMY___/"),"postgres://base"),u=!0}}catch(h){throw h.input&&(h.input="*****REDACTED*****"),h}for(const h of c.searchParams.entries())a[h[0]]=h[1];if(a.user=a.user||decodeURIComponent(c.username),a.password=a.password||decodeURIComponent(c.password),c.protocol=="socket:")return a.host=decodeURI(c.pathname),a.database=c.searchParams.get("db"),a.client_encoding=c.searchParams.get("encoding"),a;const l=u?"":c.hostname;a.host?l&&/^%2f/i.test(l)&&(c.pathname=l+c.pathname):a.host=decodeURIComponent(l),a.port||(a.port=c.port);const f=c.pathname.slice(1)||null;a.database=f?decodeURI(f):null,(a.ssl==="true"||a.ssl==="1")&&(a.ssl=!0),a.ssl==="0"&&(a.ssl=!1),(a.sslcert||a.sslkey||a.sslrootcert||a.sslmode)&&(a.ssl={});const d=a.sslcert||a.sslkey||a.sslrootcert?Cn:null;if(a.sslcert&&(a.ssl.cert=d.readFileSync(a.sslcert).toString()),a.sslkey&&(a.ssl.key=d.readFileSync(a.sslkey).toString()),a.sslrootcert&&(a.ssl.ca=d.readFileSync(a.sslrootcert).toString()),o.useLibpqCompat&&a.uselibpqcompat)throw new Error("Both useLibpqCompat and uselibpqcompat are set. Please use only one of them.");if(a.uselibpqcompat==="true"||o.useLibpqCompat)switch(a.sslmode){case"disable":{a.ssl=!1;break}case"prefer":{a.ssl.rejectUnauthorized=!1;break}case"require":{a.sslrootcert?a.ssl.checkServerIdentity=function(){}:a.ssl.rejectUnauthorized=!1;break}case"verify-ca":{if(!a.ssl.ca)throw new Error("SECURITY WARNING: Using sslmode=verify-ca requires specifying a CA with sslrootcert. If a public CA is used, verify-ca allows connections to a server that somebody else may have registered with the CA, making you vulnerable to Man-in-the-Middle attacks. Either specify a custom CA certificate with sslrootcert parameter or use sslmode=verify-full for proper security.");a.ssl.checkServerIdentity=function(){};break}}else switch(a.sslmode){case"disable":{a.ssl=!1;break}case"prefer":case"require":case"verify-ca":case"verify-full":{a.sslmode!=="verify-full"&&n(a.sslmode);break}case"no-verify":{a.ssl.rejectUnauthorized=!1;break}}return a}function t(i){return Object.entries(i).reduce((a,[c,u])=>(u!=null&&(a[c]=u),a),{})}function r(i){return Object.entries(i).reduce((a,[c,u])=>{if(c==="ssl"){const l=u;typeof l=="boolean"&&(a[c]=l),typeof l=="object"&&(a[c]=t(l))}else if(u!=null)if(c==="port"){if(u!==""){const l=parseInt(u,10);if(isNaN(l))throw new Error(`Invalid ${c}: ${u}`);a[c]=l}}else a[c]=u;return a},{})}function s(i){return r(e(i))}function n(i){!n.warned&&typeof process<"u"&&process.emitWarning&&(n.warned=!0,process.emitWarning(`SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=${i}'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.`))}return yr=e,e.parse=e,e.toClientConfig=r,e.parseIntoClientConfig=s,yr}var vr,Ws;function si(){if(Ws)return vr;Ws=1;var e={};const t=hi,r=wt(),s=Ho().parse,n=function(u,l,f){return l[u]?l[u]:(f===void 0?f=e["PG"+u.toUpperCase()]:f===!1||(f=e[f]),f||r[u])},i=function(){switch(e.PGSSLMODE){case"disable":return!1;case"prefer":case"require":case"verify-ca":case"verify-full":return!0;case"no-verify":return{rejectUnauthorized:!1}}return r.ssl},o=function(u){return"'"+(""+u).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"},a=function(u,l,f){const d=l[f];d!=null&&u.push(f+"="+o(d))};class c{constructor(l){l=typeof l=="string"?s(l):l||{},l.connectionString&&(l=Object.assign({},l,s(l.connectionString))),this.user=n("user",l),this.database=n("database",l),this.database===void 0&&(this.database=this.user),this.port=parseInt(n("port",l),10),this.host=n("host",l),Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:n("password",l)}),this.binary=n("binary",l),this.options=n("options",l),this.ssl=typeof l.ssl>"u"?i():l.ssl,typeof this.ssl=="string"&&this.ssl==="true"&&(this.ssl=!0),this.ssl==="no-verify"&&(this.ssl={rejectUnauthorized:!1}),this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this.client_encoding=n("client_encoding",l),this.replication=n("replication",l),this.isDomainSocket=!(this.host||"").indexOf("/"),this.application_name=n("application_name",l,"PGAPPNAME"),this.fallback_application_name=n("fallback_application_name",l,!1),this.statement_timeout=n("statement_timeout",l,!1),this.lock_timeout=n("lock_timeout",l,!1),this.idle_in_transaction_session_timeout=n("idle_in_transaction_session_timeout",l,!1),this.query_timeout=n("query_timeout",l,!1),l.connectionTimeoutMillis===void 0?this.connect_timeout=e.PGCONNECT_TIMEOUT||0:this.connect_timeout=Math.floor(l.connectionTimeoutMillis/1e3),l.keepAlive===!1?this.keepalives=0:l.keepAlive===!0&&(this.keepalives=1),typeof l.keepAliveInitialDelayMillis=="number"&&(this.keepalives_idle=Math.floor(l.keepAliveInitialDelayMillis/1e3))}getLibpqConnectionString(l){const f=[];a(f,this,"user"),a(f,this,"password"),a(f,this,"port"),a(f,this,"application_name"),a(f,this,"fallback_application_name"),a(f,this,"connect_timeout"),a(f,this,"options");const d=typeof this.ssl=="object"?this.ssl:this.ssl?{sslmode:this.ssl}:{};if(a(f,d,"sslmode"),a(f,d,"sslca"),a(f,d,"sslkey"),a(f,d,"sslcert"),a(f,d,"sslrootcert"),this.database&&f.push("dbname="+o(this.database)),this.replication&&f.push("replication="+o(this.replication)),this.host&&f.push("host="+o(this.host)),this.isDomainSocket)return l(null,f.join(" "));this.client_encoding&&f.push("client_encoding="+o(this.client_encoding)),t.lookup(this.host,function(h,m){return h?l(h,null):(f.push("hostaddr="+o(m)),l(null,f.join(" ")))})}}return vr=c,vr}var wr,Gs;function ni(){if(Gs)return wr;Gs=1;const e=vt(),t=/^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/;class r{constructor(n,i){this.command=null,this.rowCount=null,this.oid=null,this.rows=[],this.fields=[],this._parsers=void 0,this._types=i,this.RowCtor=null,this.rowAsArray=n==="array",this.rowAsArray&&(this.parseRow=this._parseRowAsArray),this._prebuiltEmptyResultObject=null}addCommandComplete(n){let i;n.text?i=t.exec(n.text):i=t.exec(n.command),i&&(this.command=i[1],i[3]?(this.oid=parseInt(i[2],10),this.rowCount=parseInt(i[3],10)):i[2]&&(this.rowCount=parseInt(i[2],10)))}_parseRowAsArray(n){const i=new Array(n.length);for(let o=0,a=n.length;o<a;o++){const c=n[o];c!==null?i[o]=this._parsers[o](c):i[o]=null}return i}parseRow(n){const i={...this._prebuiltEmptyResultObject};for(let o=0,a=n.length;o<a;o++){const c=n[o],u=this.fields[o].name;if(c!==null){const l=this.fields[o].format==="binary"?Buffer.from(c):c;i[u]=this._parsers[o](l)}else i[u]=null}return i}addRow(n){this.rows.push(n)}addFields(n){this.fields=n,this.fields.length&&(this._parsers=new Array(n.length));const i={};for(let o=0;o<n.length;o++){const a=n[o];i[a.name]=null,this._types?this._parsers[o]=this._types.getTypeParser(a.dataTypeID,a.format||"text"):this._parsers[o]=e.getTypeParser(a.dataTypeID,a.format||"text")}this._prebuiltEmptyResultObject={...i}}}return wr=r,wr}var xr,Js;function Fo(){if(Js)return xr;Js=1;const{EventEmitter:e}=Fe,t=ni(),r=Ze();class s extends e{constructor(i,o,a){super(),i=r.normalizeQueryConfig(i,o,a),this.text=i.text,this.values=i.values,this.rows=i.rows,this.types=i.types,this.name=i.name,this.queryMode=i.queryMode,this.binary=i.binary,this.portal=i.portal||"",this.callback=i.callback,this._rowMode=i.rowMode,process.domain&&i.callback&&(this.callback=process.domain.bind(i.callback)),this._result=new t(this._rowMode,this.types),this._results=this._result,this._canceledDueToError=!1}requiresPreparation(){return this.queryMode==="extended"||this.name||this.rows?!0:!this.text||!this.values?!1:this.values.length>0}_checkForMultirow(){this._result.command&&(Array.isArray(this._results)||(this._results=[this._result]),this._result=new t(this._rowMode,this._result._types),this._results.push(this._result))}handleRowDescription(i){this._checkForMultirow(),this._result.addFields(i.fields),this._accumulateRows=this.callback||!this.listeners("row").length}handleDataRow(i){let o;if(!this._canceledDueToError){try{o=this._result.parseRow(i.fields)}catch(a){this._canceledDueToError=a;return}this.emit("row",o,this._result),this._accumulateRows&&this._result.addRow(o)}}handleCommandComplete(i,o){this._checkForMultirow(),this._result.addCommandComplete(i),this.rows&&o.sync()}handleEmptyQuery(i){this.rows&&i.sync()}handleError(i,o){if(this._canceledDueToError&&(i=this._canceledDueToError,this._canceledDueToError=!1),this.callback)return this.callback(i);this.emit("error",i)}handleReadyForQuery(i){if(this._canceledDueToError)return this.handleError(this._canceledDueToError,i);if(this.callback)try{this.callback(null,this._results)}catch(o){process.nextTick(()=>{throw o})}this.emit("end",this._results)}submit(i){if(typeof this.text!="string"&&typeof this.name!="string")return new Error("A query must have either text or a name. Supplying neither is unsupported.");const o=i.parsedStatements[this.name];if(this.text&&o&&this.text!==o)return new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);if(this.values&&!Array.isArray(this.values))return new Error("Query values must be an array");if(this.requiresPreparation()){i.stream.cork&&i.stream.cork();try{this.prepare(i)}finally{i.stream.uncork&&i.stream.uncork()}}else i.query(this.text);return null}hasBeenParsed(i){return this.name&&i.parsedStatements[this.name]}handlePortalSuspended(i){this._getRows(i,this.rows)}_getRows(i,o){i.execute({portal:this.portal,rows:o}),o?i.flush():i.sync()}prepare(i){this.hasBeenParsed(i)||i.parse({text:this.text,name:this.name,types:this.types});try{i.bind({portal:this.portal,statement:this.name,values:this.values,binary:this.binary,valueMapper:r.prepareValue})}catch(o){this.handleError(o,i);return}i.describe({type:"P",name:this.portal||""}),this._getRows(i,this.rows)}handleCopyInResponse(i){i.sendCopyFail("No source stream defined")}handleCopyData(i,o){}}return xr=s,xr}var Er={},L={},Ys;function ii(){if(Ys)return L;Ys=1,Object.defineProperty(L,"__esModule",{value:!0}),L.NoticeMessage=L.DataRowMessage=L.CommandCompleteMessage=L.ReadyForQueryMessage=L.NotificationResponseMessage=L.BackendKeyDataMessage=L.AuthenticationMD5Password=L.ParameterStatusMessage=L.ParameterDescriptionMessage=L.RowDescriptionMessage=L.Field=L.CopyResponse=L.CopyDataMessage=L.DatabaseError=L.copyDone=L.emptyQuery=L.replicationStart=L.portalSuspended=L.noData=L.closeComplete=L.bindComplete=L.parseComplete=void 0,L.parseComplete={name:"parseComplete",length:5},L.bindComplete={name:"bindComplete",length:5},L.closeComplete={name:"closeComplete",length:5},L.noData={name:"noData",length:5},L.portalSuspended={name:"portalSuspended",length:5},L.replicationStart={name:"replicationStart",length:4},L.emptyQuery={name:"emptyQuery",length:4},L.copyDone={name:"copyDone",length:4};class e extends Error{constructor(b,v,p){super(b),this.length=v,this.name=p}}L.DatabaseError=e;class t{constructor(b,v){this.length=b,this.chunk=v,this.name="copyData"}}L.CopyDataMessage=t;class r{constructor(b,v,p,y){this.length=b,this.name=v,this.binary=p,this.columnTypes=new Array(y)}}L.CopyResponse=r;class s{constructor(b,v,p,y,E,A,N){this.name=b,this.tableID=v,this.columnID=p,this.dataTypeID=y,this.dataTypeSize=E,this.dataTypeModifier=A,this.format=N}}L.Field=s;class n{constructor(b,v){this.length=b,this.fieldCount=v,this.name="rowDescription",this.fields=new Array(this.fieldCount)}}L.RowDescriptionMessage=n;class i{constructor(b,v){this.length=b,this.parameterCount=v,this.name="parameterDescription",this.dataTypeIDs=new Array(this.parameterCount)}}L.ParameterDescriptionMessage=i;class o{constructor(b,v,p){this.length=b,this.parameterName=v,this.parameterValue=p,this.name="parameterStatus"}}L.ParameterStatusMessage=o;class a{constructor(b,v){this.length=b,this.salt=v,this.name="authenticationMD5Password"}}L.AuthenticationMD5Password=a;class c{constructor(b,v,p){this.length=b,this.processID=v,this.secretKey=p,this.name="backendKeyData"}}L.BackendKeyDataMessage=c;class u{constructor(b,v,p,y){this.length=b,this.processId=v,this.channel=p,this.payload=y,this.name="notification"}}L.NotificationResponseMessage=u;class l{constructor(b,v){this.length=b,this.status=v,this.name="readyForQuery"}}L.ReadyForQueryMessage=l;class f{constructor(b,v){this.length=b,this.text=v,this.name="commandComplete"}}L.CommandCompleteMessage=f;class d{constructor(b,v){this.length=b,this.fields=v,this.name="dataRow",this.fieldCount=v.length}}L.DataRowMessage=d;class h{constructor(b,v){this.length=b,this.message=v,this.name="notice"}}return L.NoticeMessage=h,L}var Xe={},We={},Ks;function zo(){if(Ks)return We;Ks=1,Object.defineProperty(We,"__esModule",{value:!0}),We.Writer=void 0;class e{constructor(r=256){this.size=r,this.offset=5,this.headerPosition=0,this.buffer=Buffer.allocUnsafe(r)}ensure(r){if(this.buffer.length-this.offset<r){const n=this.buffer,i=n.length+(n.length>>1)+r;this.buffer=Buffer.allocUnsafe(i),n.copy(this.buffer)}}addInt32(r){return this.ensure(4),this.buffer[this.offset++]=r>>>24&255,this.buffer[this.offset++]=r>>>16&255,this.buffer[this.offset++]=r>>>8&255,this.buffer[this.offset++]=r>>>0&255,this}addInt16(r){return this.ensure(2),this.buffer[this.offset++]=r>>>8&255,this.buffer[this.offset++]=r>>>0&255,this}addCString(r){if(!r)this.ensure(1);else{const s=Buffer.byteLength(r);this.ensure(s+1),this.buffer.write(r,this.offset,"utf-8"),this.offset+=s}return this.buffer[this.offset++]=0,this}addString(r=""){const s=Buffer.byteLength(r);return this.ensure(s),this.buffer.write(r,this.offset),this.offset+=s,this}add(r){return this.ensure(r.length),r.copy(this.buffer,this.offset),this.offset+=r.length,this}join(r){if(r){this.buffer[this.headerPosition]=r;const s=this.offset-(this.headerPosition+1);this.buffer.writeInt32BE(s,this.headerPosition+1)}return this.buffer.slice(r?0:5,this.offset)}flush(r){const s=this.join(r);return this.offset=5,this.headerPosition=0,this.buffer=Buffer.allocUnsafe(this.size),s}}return We.Writer=e,We}var Zs;function Qo(){if(Zs)return Xe;Zs=1,Object.defineProperty(Xe,"__esModule",{value:!0}),Xe.serialize=void 0;const e=zo(),t=new e.Writer,r=S=>{t.addInt16(3).addInt16(0);for(const U of Object.keys(S))t.addCString(U).addCString(S[U]);t.addCString("client_encoding").addCString("UTF8");const D=t.addCString("").flush(),M=D.length+4;return new e.Writer().addInt32(M).add(D).flush()},s=()=>{const S=Buffer.allocUnsafe(8);return S.writeInt32BE(8,0),S.writeInt32BE(80877103,4),S},n=S=>t.addCString(S).flush(112),i=function(S,D){return t.addCString(S).addInt32(Buffer.byteLength(D)).addString(D),t.flush(112)},o=function(S){return t.addString(S).flush(112)},a=S=>t.addCString(S).flush(81),c=[],u=S=>{const D=S.name||"";D.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",D,D.length),console.error("This can cause conflicts and silent errors executing queries"));const M=S.types||c,U=M.length,F=t.addCString(D).addCString(S.text).addInt16(U);for(let V=0;V<U;V++)F.addInt32(M[V]);return t.flush(80)},l=new e.Writer,f=function(S,D){for(let M=0;M<S.length;M++){const U=D?D(S[M],M):S[M];U==null?(t.addInt16(0),l.addInt32(-1)):U instanceof Buffer?(t.addInt16(1),l.addInt32(U.length),l.add(U)):(t.addInt16(0),l.addInt32(Buffer.byteLength(U)),l.addString(U))}},d=(S={})=>{const D=S.portal||"",M=S.statement||"",U=S.binary||!1,F=S.values||c,V=F.length;return t.addCString(D).addCString(M),t.addInt16(V),f(F,S.valueMapper),t.addInt16(V),t.add(l.flush()),t.addInt16(1),t.addInt16(U?1:0),t.flush(66)},h=Buffer.from([69,0,0,0,9,0,0,0,0,0]),m=S=>{if(!S||!S.portal&&!S.rows)return h;const D=S.portal||"",M=S.rows||0,U=Buffer.byteLength(D),F=4+U+1+4,V=Buffer.allocUnsafe(1+F);return V[0]=69,V.writeInt32BE(F,1),V.write(D,5,"utf-8"),V[U+5]=0,V.writeUInt32BE(M,V.length-4),V},b=(S,D)=>{const M=Buffer.allocUnsafe(16);return M.writeInt32BE(16,0),M.writeInt16BE(1234,4),M.writeInt16BE(5678,6),M.writeInt32BE(S,8),M.writeInt32BE(D,12),M},v=(S,D)=>{const U=4+Buffer.byteLength(D)+1,F=Buffer.allocUnsafe(1+U);return F[0]=S,F.writeInt32BE(U,1),F.write(D,5,"utf-8"),F[U]=0,F},p=t.addCString("P").flush(68),y=t.addCString("S").flush(68),E=S=>S.name?v(68,`${S.type}${S.name||""}`):S.type==="P"?p:y,A=S=>{const D=`${S.type}${S.name||""}`;return v(67,D)},N=S=>t.add(S).flush(100),C=S=>v(102,S),g=S=>Buffer.from([S,0,0,0,4]),x=g(72),w=g(83),_=g(88),P=g(99),R={startup:r,password:n,requestSsl:s,sendSASLInitialResponseMessage:i,sendSCRAMClientFinalMessage:o,query:a,parse:u,bind:d,execute:m,describe:E,close:A,flush:()=>x,sync:()=>w,end:()=>_,copyData:N,copyDone:()=>P,copyFail:C,cancel:b};return Xe.serialize=R,Xe}var Ge={},Je={},$s;function Vo(){if($s)return Je;$s=1,Object.defineProperty(Je,"__esModule",{value:!0}),Je.BufferReader=void 0;class e{constructor(r=0){this.offset=r,this.buffer=Buffer.allocUnsafe(0),this.encoding="utf-8"}setBuffer(r,s){this.offset=r,this.buffer=s}int16(){const r=this.buffer.readInt16BE(this.offset);return this.offset+=2,r}byte(){const r=this.buffer[this.offset];return this.offset++,r}int32(){const r=this.buffer.readInt32BE(this.offset);return this.offset+=4,r}uint32(){const r=this.buffer.readUInt32BE(this.offset);return this.offset+=4,r}string(r){const s=this.buffer.toString(this.encoding,this.offset,this.offset+r);return this.offset+=r,s}cstring(){const r=this.offset;let s=r;for(;this.buffer[s++]!==0;);return this.offset=s,this.buffer.toString(this.encoding,r,s-1)}bytes(r){const s=this.buffer.slice(this.offset,this.offset+r);return this.offset+=r,s}}return Je.BufferReader=e,Je}var en;function Xo(){if(en)return Ge;en=1,Object.defineProperty(Ge,"__esModule",{value:!0}),Ge.Parser=void 0;const e=ii(),t=Vo(),r=1,n=r+4,i=-1,o=Buffer.allocUnsafe(0);class a{constructor(x){if(this.buffer=o,this.bufferLength=0,this.bufferOffset=0,this.reader=new t.BufferReader,(x==null?void 0:x.mode)==="binary")throw new Error("Binary mode not supported yet");this.mode=(x==null?void 0:x.mode)||"text"}parse(x,w){this.mergeBuffer(x);const _=this.bufferOffset+this.bufferLength;let P=this.bufferOffset;for(;P+n<=_;){const R=this.buffer[P],S=this.buffer.readUInt32BE(P+r),D=r+S;if(D+P<=_){const M=this.handlePacket(P+n,R,S,this.buffer);w(M),P+=D}else break}P===_?(this.buffer=o,this.bufferLength=0,this.bufferOffset=0):(this.bufferLength=_-P,this.bufferOffset=P)}mergeBuffer(x){if(this.bufferLength>0){const w=this.bufferLength+x.byteLength;if(w+this.bufferOffset>this.buffer.byteLength){let P;if(w<=this.buffer.byteLength&&this.bufferOffset>=this.bufferLength)P=this.buffer;else{let R=this.buffer.byteLength*2;for(;w>=R;)R*=2;P=Buffer.allocUnsafe(R)}this.buffer.copy(P,0,this.bufferOffset,this.bufferOffset+this.bufferLength),this.buffer=P,this.bufferOffset=0}x.copy(this.buffer,this.bufferOffset+this.bufferLength),this.bufferLength=w}else this.buffer=x,this.bufferOffset=0,this.bufferLength=x.byteLength}handlePacket(x,w,_,P){const{reader:R}=this;R.setBuffer(x,P);let S;switch(w){case 50:S=e.bindComplete;break;case 49:S=e.parseComplete;break;case 51:S=e.closeComplete;break;case 110:S=e.noData;break;case 115:S=e.portalSuspended;break;case 99:S=e.copyDone;break;case 87:S=e.replicationStart;break;case 73:S=e.emptyQuery;break;case 68:S=y(R);break;case 67:S=u(R);break;case 90:S=c(R);break;case 65:S=m(R);break;case 82:S=N(R,_);break;case 83:S=E(R);break;case 75:S=A(R);break;case 69:S=C(R,"error");break;case 78:S=C(R,"notice");break;case 84:S=b(R);break;case 116:S=p(R);break;case 71:S=f(R);break;case 72:S=d(R);break;case 100:S=l(R,_);break;default:return new e.DatabaseError("received invalid response: "+w.toString(16),_,"error")}return R.setBuffer(0,o),S.length=_,S}}Ge.Parser=a;const c=g=>{const x=g.string(1);return new e.ReadyForQueryMessage(i,x)},u=g=>{const x=g.cstring();return new e.CommandCompleteMessage(i,x)},l=(g,x)=>{const w=g.bytes(x-4);return new e.CopyDataMessage(i,w)},f=g=>h(g,"copyInResponse"),d=g=>h(g,"copyOutResponse"),h=(g,x)=>{const w=g.byte()!==0,_=g.int16(),P=new e.CopyResponse(i,x,w,_);for(let R=0;R<_;R++)P.columnTypes[R]=g.int16();return P},m=g=>{const x=g.int32(),w=g.cstring(),_=g.cstring();return new e.NotificationResponseMessage(i,x,w,_)},b=g=>{const x=g.int16(),w=new e.RowDescriptionMessage(i,x);for(let _=0;_<x;_++)w.fields[_]=v(g);return w},v=g=>{const x=g.cstring(),w=g.uint32(),_=g.int16(),P=g.uint32(),R=g.int16(),S=g.int32(),D=g.int16()===0?"text":"binary";return new e.Field(x,w,_,P,R,S,D)},p=g=>{const x=g.int16(),w=new e.ParameterDescriptionMessage(i,x);for(let _=0;_<x;_++)w.dataTypeIDs[_]=g.int32();return w},y=g=>{const x=g.int16(),w=new Array(x);for(let _=0;_<x;_++){const P=g.int32();w[_]=P===-1?null:g.string(P)}return new e.DataRowMessage(i,w)},E=g=>{const x=g.cstring(),w=g.cstring();return new e.ParameterStatusMessage(i,x,w)},A=g=>{const x=g.int32(),w=g.int32();return new e.BackendKeyDataMessage(i,x,w)},N=(g,x)=>{const w=g.int32(),_={name:"authenticationOk",length:x};switch(w){case 0:break;case 3:_.length===8&&(_.name="authenticationCleartextPassword");break;case 5:if(_.length===12){_.name="authenticationMD5Password";const P=g.bytes(4);return new e.AuthenticationMD5Password(i,P)}break;case 10:{_.name="authenticationSASL",_.mechanisms=[];let P;do P=g.cstring(),P&&_.mechanisms.push(P);while(P)}break;case 11:_.name="authenticationSASLContinue",_.data=g.string(x-8);break;case 12:_.name="authenticationSASLFinal",_.data=g.string(x-8);break;default:throw new Error("Unknown authenticationOk message type "+w)}return _},C=(g,x)=>{const w={};let _=g.string(1);for(;_!=="\0";)w[_]=g.cstring(),_=g.string(1);const P=w.M,R=x==="notice"?new e.NoticeMessage(i,P):new e.DatabaseError(P,i,x);return R.severity=w.S,R.code=w.C,R.detail=w.D,R.hint=w.H,R.position=w.P,R.internalPosition=w.p,R.internalQuery=w.q,R.where=w.W,R.schema=w.s,R.table=w.t,R.column=w.c,R.dataType=w.d,R.constraint=w.n,R.file=w.F,R.line=w.L,R.routine=w.R,R};return Ge}var tn;function oi(){return tn||(tn=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.DatabaseError=e.serialize=e.parse=void 0;const t=ii();Object.defineProperty(e,"DatabaseError",{enumerable:!0,get:function(){return t.DatabaseError}});const r=Qo();Object.defineProperty(e,"serialize",{enumerable:!0,get:function(){return r.serialize}});const s=Xo();function n(i,o){const a=new s.Parser;return i.on("data",c=>a.parse(c,o)),new Promise(c=>i.on("end",()=>c()))}e.parse=n})(Er)),Er}var ct={},rn;function Wo(){return rn||(rn=1,Object.defineProperty(ct,"__esModule",{value:!0}),ct.default={}),ct}var Sr,sn;function Go(){if(sn)return Sr;sn=1;const{getStream:e,getSecureStream:t}=i();Sr={getStream:e,getSecureStream:t};function r(){function o(c){const u=Pn;return new u.Socket}function a(c){return pi.connect(c)}return{getStream:o,getSecureStream:a}}function s(){function o(c){const{CloudflareSocket:u}=Wo();return new u(c)}function a(c){return c.socket.startTls(c),c.socket}return{getStream:o,getSecureStream:a}}function n(){if(typeof navigator=="object"&&navigator!==null&&typeof navigator.userAgent=="string")return navigator.userAgent==="Cloudflare-Workers";if(typeof Response=="function"){const o=new Response(null,{cf:{thing:!0}});if(typeof o.cf=="object"&&o.cf!==null&&o.cf.thing)return!0}return!1}function i(){return n()?s():r()}return Sr}var Ar,nn;function ai(){if(nn)return Ar;nn=1;const e=Fe.EventEmitter,{parse:t,serialize:r}=oi(),{getStream:s,getSecureStream:n}=Go(),i=r.flush(),o=r.sync(),a=r.end();class c extends e{constructor(l){super(),l=l||{},this.stream=l.stream||s(l.ssl),typeof this.stream=="function"&&(this.stream=this.stream(l)),this._keepAlive=l.keepAlive,this._keepAliveInitialDelayMillis=l.keepAliveInitialDelayMillis,this.parsedStatements={},this.ssl=l.ssl||!1,this._ending=!1,this._emitMessage=!1;const f=this;this.on("newListener",function(d){d==="message"&&(f._emitMessage=!0)})}connect(l,f){const d=this;this._connecting=!0,this.stream.setNoDelay(!0),this.stream.connect(l,f),this.stream.once("connect",function(){d._keepAlive&&d.stream.setKeepAlive(!0,d._keepAliveInitialDelayMillis),d.emit("connect")});const h=function(m){d._ending&&(m.code==="ECONNRESET"||m.code==="EPIPE")||d.emit("error",m)};if(this.stream.on("error",h),this.stream.on("close",function(){d.emit("end")}),!this.ssl)return this.attachListeners(this.stream);this.stream.once("data",function(m){switch(m.toString("utf8")){case"S":break;case"N":return d.stream.end(),d.emit("error",new Error("The server does not support SSL connections"));default:return d.stream.end(),d.emit("error",new Error("There was an error establishing an SSL connection"))}const v={socket:d.stream};d.ssl!==!0&&(Object.assign(v,d.ssl),"key"in d.ssl&&(v.key=d.ssl.key));const p=Pn;p.isIP&&p.isIP(f)===0&&(v.servername=f);try{d.stream=n(v)}catch(y){return d.emit("error",y)}d.attachListeners(d.stream),d.stream.on("error",h),d.emit("sslconnect")})}attachListeners(l){t(l,f=>{const d=f.name==="error"?"errorMessage":f.name;this._emitMessage&&this.emit("message",f),this.emit(d,f)})}requestSsl(){this.stream.write(r.requestSsl())}startup(l){this.stream.write(r.startup(l))}cancel(l,f){this._send(r.cancel(l,f))}password(l){this._send(r.password(l))}sendSASLInitialResponseMessage(l,f){this._send(r.sendSASLInitialResponseMessage(l,f))}sendSCRAMClientFinalMessage(l){this._send(r.sendSCRAMClientFinalMessage(l))}_send(l){return this.stream.writable?this.stream.write(l):!1}query(l){this._send(r.query(l))}parse(l){this._send(r.parse(l))}bind(l){this._send(r.bind(l))}execute(l){this._send(r.execute(l))}flush(){this.stream.writable&&this.stream.write(i)}sync(){this._ending=!0,this._send(o)}ref(){this.stream.ref()}unref(){this.stream.unref()}end(){if(this._ending=!0,!this._connecting||!this.stream.writable){this.stream.end();return}return this.stream.write(a,()=>{this.stream.end()})}close(l){this._send(r.close(l))}describe(l){this._send(r.describe(l))}sendCopyFromChunk(l){this._send(r.copyData(l))}endCopyFrom(){this._send(r.copyDone())}sendCopyFail(l){this._send(r.copyFail(l))}}return Ar=c,Ar}var ut={exports:{}},_r={exports:{}},Cr,on;function Jo(){if(on)return Cr;on=1;const{Transform:e}=Tn,{StringDecoder:t}=gi,r=Symbol("last"),s=Symbol("decoder");function n(u,l,f){let d;if(this.overflow){if(d=this[s].write(u).split(this.matcher),d.length===1)return f();d.shift(),this.overflow=!1}else this[r]+=this[s].write(u),d=this[r].split(this.matcher);this[r]=d.pop();for(let h=0;h<d.length;h++)try{o(this,this.mapper(d[h]))}catch(m){return f(m)}if(this.overflow=this[r].length>this.maxLength,this.overflow&&!this.skipOverflow){f(new Error("maximum buffer reached"));return}f()}function i(u){if(this[r]+=this[s].end(),this[r])try{o(this,this.mapper(this[r]))}catch(l){return u(l)}u()}function o(u,l){l!==void 0&&u.push(l)}function a(u){return u}function c(u,l,f){switch(u=u||/\r?\n/,l=l||a,f=f||{},arguments.length){case 1:typeof u=="function"?(l=u,u=/\r?\n/):typeof u=="object"&&!(u instanceof RegExp)&&!u[Symbol.split]&&(f=u,u=/\r?\n/);break;case 2:typeof u=="function"?(f=l,l=u,u=/\r?\n/):typeof l=="object"&&(f=l,l=a)}f=Object.assign({},f),f.autoDestroy=!0,f.transform=n,f.flush=i,f.readableObjectMode=!0;const d=new e(f);return d[r]="",d[s]=new t("utf8"),d.matcher=u,d.mapper=l,d.maxLength=f.maxLength,d.skipOverflow=f.skipOverflow||!1,d.overflow=!1,d._destroy=function(h,m){this._writableState.errorEmitted=!1,m(h)},d}return Cr=c,Cr}var an;function Yo(){return an||(an=1,(function(e){var t={},r=mi,s=Tn.Stream,n=Jo(),i=He,o=5432,a=process.platform==="win32",c=process.stderr,u=56,l=7,f=61440,d=32768;function h(N){return(N&f)==d}var m=["host","port","database","user","password"],b=m.length,v=m[b-1];function p(){var N=c instanceof s&&c.writable===!0;if(N){var C=Array.prototype.slice.call(arguments).concat(`
`);c.write(i.format.apply(i,C))}}Object.defineProperty(e.exports,"isWin",{get:function(){return a},set:function(N){a=N}}),e.exports.warnTo=function(N){var C=c;return c=N,C},e.exports.getFileName=function(N){var C=N||t,g=C.PGPASSFILE||(a?r.join(C.APPDATA||"./","postgresql","pgpass.conf"):r.join(C.HOME||"./",".pgpass"));return g},e.exports.usePgPass=function(N,C){return Object.prototype.hasOwnProperty.call(t,"PGPASSWORD")?!1:a?!0:(C=C||"<unkn>",h(N.mode)?N.mode&(u|l)?(p('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less',C),!1):!0:(p('WARNING: password file "%s" is not a plain file',C),!1))};var y=e.exports.match=function(N,C){return m.slice(0,-1).reduce(function(g,x,w){return w==1&&Number(N[x]||o)===Number(C[x])?g&&!0:g&&(C[x]==="*"||C[x]===N[x])},!0)};e.exports.getPassword=function(N,C,g){var x,w=C.pipe(n());function _(S){var D=E(S);D&&A(D)&&y(N,D)&&(x=D[v],w.end())}var P=function(){C.destroy(),g(x)},R=function(S){C.destroy(),p("WARNING: error on reading file: %s",S),g(void 0)};C.on("error",R),w.on("data",_).on("end",P).on("error",R)};var E=e.exports.parseLine=function(N){if(N.length<11||N.match(/^\s+#/))return null;for(var C="",g="",x=0,w=0,_={},P=!1,R=function(D,M,U){var F=N.substring(M,U);Object.hasOwnProperty.call(t,"PGPASS_NO_DEESCAPE")||(F=F.replace(/\\([:\\])/g,"$1")),_[m[D]]=F},S=0;S<N.length-1;S+=1){if(C=N.charAt(S+1),g=N.charAt(S),P=x==b-1,P){R(x,w);break}S>=0&&C==":"&&g!=="\\"&&(R(x,w,S+1),w=S+2,x+=1)}return _=Object.keys(_).length===b?_:null,_},A=e.exports.isValidEntry=function(N){for(var C={0:function(P){return P.length>0},1:function(P){return P==="*"?!0:(P=Number(P),isFinite(P)&&P>0&&P<9007199254740992&&Math.floor(P)===P)},2:function(P){return P.length>0},3:function(P){return P.length>0},4:function(P){return P.length>0}},g=0;g<m.length;g+=1){var x=C[g],w=N[m[g]]||"",_=x(w);if(!_)return!1}return!0}})(_r)),_r.exports}var ln;function Ko(){if(ln)return ut.exports;ln=1;var e=Cn,t=Yo();return ut.exports=function(r,s){var n=t.getFileName();e.stat(n,function(i,o){if(i||!t.usePgPass(o,n))return s(void 0);var a=e.createReadStream(n);t.getPassword(r,a,s)})},ut.exports.warnTo=t.warnTo,ut.exports}var Pr,cn;function Zo(){if(cn)return Pr;cn=1;const e=Fe.EventEmitter,t=Ze(),r=He,s=Uo(),n=Fr(),i=si(),o=Fo(),a=wt(),c=ai(),u=ri(),l=r.deprecate(()=>{},"Client.activeQuery is deprecated and will be removed in pg@9.0"),f=r.deprecate(()=>{},"Client.queryQueue is deprecated and will be removed in pg@9.0."),d=r.deprecate(()=>{},"pgpass support is deprecated and will be removed in pg@9.0. You can provide an async function as the password property to the Client/Pool constructor that returns a password instead. Within this function you can call the pgpass module in your own code."),h=r.deprecate(()=>{},"Passing a custom Promise implementation to the Client/Pool constructor is deprecated and will be removed in pg@9.0."),m=r.deprecate(()=>{},"Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.");class b extends e{constructor(p){super(),this.connectionParameters=new i(p),this.user=this.connectionParameters.user,this.database=this.connectionParameters.database,this.port=this.connectionParameters.port,this.host=this.connectionParameters.host,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:this.connectionParameters.password}),this.replication=this.connectionParameters.replication;const y=p||{};y.Promise&&h(),this._Promise=y.Promise||jr.Promise,this._types=new n(y.types),this._ending=!1,this._ended=!1,this._connecting=!1,this._connected=!1,this._connectionError=!1,this._queryable=!0,this._activeQuery=null,this.enableChannelBinding=!!y.enableChannelBinding,this.connection=y.connection||new c({stream:y.stream,ssl:this.connectionParameters.ssl,keepAlive:y.keepAlive||!1,keepAliveInitialDelayMillis:y.keepAliveInitialDelayMillis||0,encoding:this.connectionParameters.client_encoding||"utf8"}),this._queryQueue=[],this.binary=y.binary||a.binary,this.processID=null,this.secretKey=null,this.ssl=this.connectionParameters.ssl||!1,this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this._connectionTimeoutMillis=y.connectionTimeoutMillis||0}get activeQuery(){return l(),this._activeQuery}set activeQuery(p){l(),this._activeQuery=p}_getActiveQuery(){return this._activeQuery}_errorAllQueries(p){const y=A=>{process.nextTick(()=>{A.handleError(p,this.connection)})},E=this._getActiveQuery();E&&(y(E),this._activeQuery=null),this._queryQueue.forEach(y),this._queryQueue.length=0}_connect(p){const y=this,E=this.connection;if(this._connectionCallback=p,this._connecting||this._connected){const A=new Error("Client has already been connected. You cannot reuse a client.");process.nextTick(()=>{p(A)});return}this._connecting=!0,this._connectionTimeoutMillis>0&&(this.connectionTimeoutHandle=setTimeout(()=>{E._ending=!0,E.stream.destroy(new Error("timeout expired"))},this._connectionTimeoutMillis),this.connectionTimeoutHandle.unref&&this.connectionTimeoutHandle.unref()),this.host&&this.host.indexOf("/")===0?E.connect(this.host+"/.s.PGSQL."+this.port):E.connect(this.port,this.host),E.on("connect",function(){y.ssl?E.requestSsl():E.startup(y.getStartupConf())}),E.on("sslconnect",function(){E.startup(y.getStartupConf())}),this._attachListeners(E),E.once("end",()=>{const A=this._ending?new Error("Connection terminated"):new Error("Connection terminated unexpectedly");clearTimeout(this.connectionTimeoutHandle),this._errorAllQueries(A),this._ended=!0,this._ending||(this._connecting&&!this._connectionError?this._connectionCallback?this._connectionCallback(A):this._handleErrorEvent(A):this._connectionError||this._handleErrorEvent(A)),process.nextTick(()=>{this.emit("end")})})}connect(p){if(p){this._connect(p);return}return new this._Promise((y,E)=>{this._connect(A=>{A?E(A):y(this)})})}_attachListeners(p){p.on("authenticationCleartextPassword",this._handleAuthCleartextPassword.bind(this)),p.on("authenticationMD5Password",this._handleAuthMD5Password.bind(this)),p.on("authenticationSASL",this._handleAuthSASL.bind(this)),p.on("authenticationSASLContinue",this._handleAuthSASLContinue.bind(this)),p.on("authenticationSASLFinal",this._handleAuthSASLFinal.bind(this)),p.on("backendKeyData",this._handleBackendKeyData.bind(this)),p.on("error",this._handleErrorEvent.bind(this)),p.on("errorMessage",this._handleErrorMessage.bind(this)),p.on("readyForQuery",this._handleReadyForQuery.bind(this)),p.on("notice",this._handleNotice.bind(this)),p.on("rowDescription",this._handleRowDescription.bind(this)),p.on("dataRow",this._handleDataRow.bind(this)),p.on("portalSuspended",this._handlePortalSuspended.bind(this)),p.on("emptyQuery",this._handleEmptyQuery.bind(this)),p.on("commandComplete",this._handleCommandComplete.bind(this)),p.on("parseComplete",this._handleParseComplete.bind(this)),p.on("copyInResponse",this._handleCopyInResponse.bind(this)),p.on("copyData",this._handleCopyData.bind(this)),p.on("notification",this._handleNotification.bind(this))}_getPassword(p){const y=this.connection;if(typeof this.password=="function")this._Promise.resolve().then(()=>this.password(this.connectionParameters)).then(E=>{if(E!==void 0){if(typeof E!="string"){y.emit("error",new TypeError("Password must be a string"));return}this.connectionParameters.password=this.password=E}else this.connectionParameters.password=this.password=null;p()}).catch(E=>{y.emit("error",E)});else if(this.password!==null)p();else try{Ko()(this.connectionParameters,A=>{A!==void 0&&(d(),this.connectionParameters.password=this.password=A),p()})}catch(E){this.emit("error",E)}}_handleAuthCleartextPassword(p){this._getPassword(()=>{this.connection.password(this.password)})}_handleAuthMD5Password(p){this._getPassword(async()=>{try{const y=await u.postgresMd5PasswordHash(this.user,this.password,p.salt);this.connection.password(y)}catch(y){this.emit("error",y)}})}_handleAuthSASL(p){this._getPassword(()=>{try{this.saslSession=s.startSession(p.mechanisms,this.enableChannelBinding&&this.connection.stream),this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism,this.saslSession.response)}catch(y){this.connection.emit("error",y)}})}async _handleAuthSASLContinue(p){try{await s.continueSession(this.saslSession,this.password,p.data,this.enableChannelBinding&&this.connection.stream),this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)}catch(y){this.connection.emit("error",y)}}_handleAuthSASLFinal(p){try{s.finalizeSession(this.saslSession,p.data),this.saslSession=null}catch(y){this.connection.emit("error",y)}}_handleBackendKeyData(p){this.processID=p.processID,this.secretKey=p.secretKey}_handleReadyForQuery(p){this._connecting&&(this._connecting=!1,this._connected=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback&&(this._connectionCallback(null,this),this._connectionCallback=null),this.emit("connect"));const y=this._getActiveQuery();this._activeQuery=null,this.readyForQuery=!0,y&&y.handleReadyForQuery(this.connection),this._pulseQueryQueue()}_handleErrorWhileConnecting(p){if(!this._connectionError){if(this._connectionError=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback)return this._connectionCallback(p);this.emit("error",p)}}_handleErrorEvent(p){if(this._connecting)return this._handleErrorWhileConnecting(p);this._queryable=!1,this._errorAllQueries(p),this.emit("error",p)}_handleErrorMessage(p){if(this._connecting)return this._handleErrorWhileConnecting(p);const y=this._getActiveQuery();if(!y){this._handleErrorEvent(p);return}this._activeQuery=null,y.handleError(p,this.connection)}_handleRowDescription(p){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected rowDescription message from backend.");this._handleErrorEvent(E);return}y.handleRowDescription(p)}_handleDataRow(p){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected dataRow message from backend.");this._handleErrorEvent(E);return}y.handleDataRow(p)}_handlePortalSuspended(p){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected portalSuspended message from backend.");this._handleErrorEvent(E);return}y.handlePortalSuspended(this.connection)}_handleEmptyQuery(p){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected emptyQuery message from backend.");this._handleErrorEvent(E);return}y.handleEmptyQuery(this.connection)}_handleCommandComplete(p){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected commandComplete message from backend.");this._handleErrorEvent(E);return}y.handleCommandComplete(p,this.connection)}_handleParseComplete(){const p=this._getActiveQuery();if(p==null){const y=new Error("Received unexpected parseComplete message from backend.");this._handleErrorEvent(y);return}p.name&&(this.connection.parsedStatements[p.name]=p.text)}_handleCopyInResponse(p){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected copyInResponse message from backend.");this._handleErrorEvent(E);return}y.handleCopyInResponse(this.connection)}_handleCopyData(p){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected copyData message from backend.");this._handleErrorEvent(E);return}y.handleCopyData(p,this.connection)}_handleNotification(p){this.emit("notification",p)}_handleNotice(p){this.emit("notice",p)}getStartupConf(){const p=this.connectionParameters,y={user:p.user,database:p.database},E=p.application_name||p.fallback_application_name;return E&&(y.application_name=E),p.replication&&(y.replication=""+p.replication),p.statement_timeout&&(y.statement_timeout=String(parseInt(p.statement_timeout,10))),p.lock_timeout&&(y.lock_timeout=String(parseInt(p.lock_timeout,10))),p.idle_in_transaction_session_timeout&&(y.idle_in_transaction_session_timeout=String(parseInt(p.idle_in_transaction_session_timeout,10))),p.options&&(y.options=p.options),y}cancel(p,y){if(p.activeQuery===y){const E=this.connection;this.host&&this.host.indexOf("/")===0?E.connect(this.host+"/.s.PGSQL."+this.port):E.connect(this.port,this.host),E.on("connect",function(){E.cancel(p.processID,p.secretKey)})}else p._queryQueue.indexOf(y)!==-1&&p._queryQueue.splice(p._queryQueue.indexOf(y),1)}setTypeParser(p,y,E){return this._types.setTypeParser(p,y,E)}getTypeParser(p,y){return this._types.getTypeParser(p,y)}escapeIdentifier(p){return t.escapeIdentifier(p)}escapeLiteral(p){return t.escapeLiteral(p)}_pulseQueryQueue(){if(this.readyForQuery===!0){this._activeQuery=this._queryQueue.shift();const p=this._getActiveQuery();if(p){this.readyForQuery=!1,this.hasExecuted=!0;const y=p.submit(this.connection);y&&process.nextTick(()=>{p.handleError(y,this.connection),this.readyForQuery=!0,this._pulseQueryQueue()})}else this.hasExecuted&&(this._activeQuery=null,this.emit("drain"))}}query(p,y,E){let A,N,C,g,x;if(p==null)throw new TypeError("Client was passed a null or undefined query");return typeof p.submit=="function"?(C=p.query_timeout||this.connectionParameters.query_timeout,N=A=p,A.callback||(typeof y=="function"?A.callback=y:E&&(A.callback=E))):(C=p.query_timeout||this.connectionParameters.query_timeout,A=new o(p,y,E),A.callback||(N=new this._Promise((w,_)=>{A.callback=(P,R)=>P?_(P):w(R)}).catch(w=>{throw Error.captureStackTrace(w),w}))),C&&(x=A.callback||(()=>{}),g=setTimeout(()=>{const w=new Error("Query read timeout");process.nextTick(()=>{A.handleError(w,this.connection)}),x(w),A.callback=()=>{};const _=this._queryQueue.indexOf(A);_>-1&&this._queryQueue.splice(_,1),this._pulseQueryQueue()},C),A.callback=(w,_)=>{clearTimeout(g),x(w,_)}),this.binary&&!A.binary&&(A.binary=!0),A._result&&!A._result._types&&(A._result._types=this._types),this._queryable?this._ending?(process.nextTick(()=>{A.handleError(new Error("Client was closed and is not queryable"),this.connection)}),N):(this._queryQueue.length>0&&m(),this._queryQueue.push(A),this._pulseQueryQueue(),N):(process.nextTick(()=>{A.handleError(new Error("Client has encountered a connection error and is not queryable"),this.connection)}),N)}ref(){this.connection.ref()}unref(){this.connection.unref()}end(p){if(this._ending=!0,!this.connection._connecting||this._ended)if(p)p();else return this._Promise.resolve();if(this._getActiveQuery()||!this._queryable?this.connection.stream.destroy():this.connection.end(),p)this.connection.once("end",p);else return new this._Promise(y=>{this.connection.once("end",y)})}get queryQueue(){return f(),this._queryQueue}}return b.Query=o,Pr=b,Pr}var Tr,un;function $o(){if(un)return Tr;un=1;const e=Fe.EventEmitter,t=function(){},r=(u,l)=>{const f=u.findIndex(l);return f===-1?void 0:u.splice(f,1)[0]};class s{constructor(l,f,d){this.client=l,this.idleListener=f,this.timeoutId=d}}class n{constructor(l){this.callback=l}}function i(){throw new Error("Release called on client which has already been released to the pool.")}function o(u,l){if(l)return{callback:l,result:void 0};let f,d;const h=function(b,v){b?f(b):d(v)},m=new u(function(b,v){d=b,f=v}).catch(b=>{throw Error.captureStackTrace(b),b});return{callback:h,result:m}}function a(u,l){return function f(d){d.client=l,l.removeListener("error",f),l.on("error",()=>{u.log("additional client error after disconnection due to error",d)}),u._remove(l),u.emit("error",d,l)}}class c extends e{constructor(l,f){super(),this.options=Object.assign({},l),l!=null&&"password"in l&&Object.defineProperty(this.options,"password",{configurable:!0,enumerable:!1,writable:!0,value:l.password}),l!=null&&l.ssl&&l.ssl.key&&Object.defineProperty(this.options.ssl,"key",{enumerable:!1}),this.options.max=this.options.max||this.options.poolSize||10,this.options.min=this.options.min||0,this.options.maxUses=this.options.maxUses||1/0,this.options.allowExitOnIdle=this.options.allowExitOnIdle||!1,this.options.maxLifetimeSeconds=this.options.maxLifetimeSeconds||0,this.log=this.options.log||function(){},this.Client=this.options.Client||f||li().Client,this.Promise=this.options.Promise||jr.Promise,typeof this.options.idleTimeoutMillis>"u"&&(this.options.idleTimeoutMillis=1e4),this._clients=[],this._idle=[],this._expired=new WeakSet,this._pendingQueue=[],this._endCallback=void 0,this.ending=!1,this.ended=!1}_promiseTry(l){const f=this.Promise;return typeof f.try=="function"?f.try(l):new f(d=>d(l()))}_isFull(){return this._clients.length>=this.options.max}_isAboveMin(){return this._clients.length>this.options.min}_pulseQueue(){if(this.log("pulse queue"),this.ended){this.log("pulse queue ended");return}if(this.ending){this.log("pulse queue on ending"),this._idle.length&&this._idle.slice().map(f=>{this._remove(f.client)}),this._clients.length||(this.ended=!0,this._endCallback());return}if(!this._pendingQueue.length){this.log("no queued requests");return}if(!this._idle.length&&this._isFull())return;const l=this._pendingQueue.shift();if(this._idle.length){const f=this._idle.pop();clearTimeout(f.timeoutId);const d=f.client;d.ref&&d.ref();const h=f.idleListener;return this._acquireClient(d,l,h,!1)}if(!this._isFull())return this.newClient(l);throw new Error("unexpected condition")}_remove(l,f){const d=r(this._idle,m=>m.client===l);d!==void 0&&clearTimeout(d.timeoutId),this._clients=this._clients.filter(m=>m!==l);const h=this;l.end(()=>{h.emit("remove",l),typeof f=="function"&&f()})}connect(l){if(this.ending){const h=new Error("Cannot use a pool after calling end on the pool");return l?l(h):this.Promise.reject(h)}const f=o(this.Promise,l),d=f.result;if(this._isFull()||this._idle.length){if(this._idle.length&&process.nextTick(()=>this._pulseQueue()),!this.options.connectionTimeoutMillis)return this._pendingQueue.push(new n(f.callback)),d;const h=(v,p,y)=>{clearTimeout(b),f.callback(v,p,y)},m=new n(h),b=setTimeout(()=>{r(this._pendingQueue,v=>v.callback===h),m.timedOut=!0,f.callback(new Error("timeout exceeded when trying to connect"))},this.options.connectionTimeoutMillis);return b.unref&&b.unref(),this._pendingQueue.push(m),d}return this.newClient(new n(f.callback)),d}newClient(l){const f=new this.Client(this.options);this._clients.push(f);const d=a(this,f);this.log("checking client timeout");let h,m=!1;this.options.connectionTimeoutMillis&&(h=setTimeout(()=>{f.connection?(this.log("ending client due to timeout"),m=!0,f.connection.stream.destroy()):f.isConnected()||(this.log("ending client due to timeout"),m=!0,f.end())},this.options.connectionTimeoutMillis)),this.log("connecting new client"),f.connect(b=>{if(h&&clearTimeout(h),f.on("error",d),b)this.log("client failed to connect",b),this._clients=this._clients.filter(v=>v!==f),m&&(b=new Error("Connection terminated due to connection timeout",{cause:b})),this._pulseQueue(),l.timedOut||l.callback(b,void 0,t);else{if(this.log("new client connected"),this.options.onConnect){this._promiseTry(()=>this.options.onConnect(f)).then(()=>{this._afterConnect(f,l,d)},v=>{this._clients=this._clients.filter(p=>p!==f),f.end(()=>{this._pulseQueue(),l.timedOut||l.callback(v,void 0,t)})});return}return this._afterConnect(f,l,d)}})}_afterConnect(l,f,d){if(this.options.maxLifetimeSeconds!==0){const h=setTimeout(()=>{this.log("ending client due to expired lifetime"),this._expired.add(l),this._idle.findIndex(b=>b.client===l)!==-1&&this._acquireClient(l,new n((b,v,p)=>p()),d,!1)},this.options.maxLifetimeSeconds*1e3);h.unref(),l.once("end",()=>clearTimeout(h))}return this._acquireClient(l,f,d,!0)}_acquireClient(l,f,d,h){h&&this.emit("connect",l),this.emit("acquire",l),l.release=this._releaseOnce(l,d),l.removeListener("error",d),f.timedOut?h&&this.options.verify?this.options.verify(l,l.release):l.release():h&&this.options.verify?this.options.verify(l,m=>{if(m)return l.release(m),f.callback(m,void 0,t);f.callback(void 0,l,l.release)}):f.callback(void 0,l,l.release)}_releaseOnce(l,f){let d=!1;return h=>{d&&i(),d=!0,this._release(l,f,h)}}_release(l,f,d){if(l.on("error",f),l._poolUseCount=(l._poolUseCount||0)+1,this.emit("release",d,l),d||this.ending||!l._queryable||l._ending||l._poolUseCount>=this.options.maxUses)return l._poolUseCount>=this.options.maxUses&&this.log("remove expended client"),this._remove(l,this._pulseQueue.bind(this));if(this._expired.has(l))return this.log("remove expired client"),this._expired.delete(l),this._remove(l,this._pulseQueue.bind(this));let m;this.options.idleTimeoutMillis&&this._isAboveMin()&&(m=setTimeout(()=>{this._isAboveMin()&&(this.log("remove idle client"),this._remove(l,this._pulseQueue.bind(this)))},this.options.idleTimeoutMillis),this.options.allowExitOnIdle&&m.unref()),this.options.allowExitOnIdle&&l.unref(),this._idle.push(new s(l,f,m)),this._pulseQueue()}query(l,f,d){if(typeof l=="function"){const m=o(this.Promise,l);return setImmediate(function(){return m.callback(new Error("Passing a function as the first parameter to pool.query is not supported"))}),m.result}typeof f=="function"&&(d=f,f=void 0);const h=o(this.Promise,d);return d=h.callback,this.connect((m,b)=>{if(m)return d(m);let v=!1;const p=y=>{v||(v=!0,b.release(y),d(y))};b.once("error",p),this.log("dispatching query");try{b.query(l,f,(y,E)=>{if(this.log("query dispatched"),b.removeListener("error",p),!v)return v=!0,b.release(y),y?d(y):d(void 0,E)})}catch(y){return b.release(y),d(y)}}),h.result}end(l){if(this.log("ending"),this.ending){const d=new Error("Called end on pool more than once");return l?l(d):this.Promise.reject(d)}this.ending=!0;const f=o(this.Promise,l);return this._endCallback=f.callback,this._pulseQueue(),f.result}get waitingCount(){return this._pendingQueue.length}get idleCount(){return this._idle.length}get expiredCount(){return this._clients.reduce((l,f)=>l+(this._expired.has(f)?1:0),0)}get totalCount(){return this._clients.length}}return Tr=c,Tr}var Rr={exports:{}};const ea={},ta=Object.freeze(Object.defineProperty({__proto__:null,default:ea},Symbol.toStringTag,{value:"Module"})),ra=eo(ta);var Ir={exports:{}},dn;function sa(){if(dn)return Ir.exports;dn=1;const e=Fe.EventEmitter,t=He,r=Ze(),s=Ir.exports=function(i,o,a){e.call(this),i=r.normalizeQueryConfig(i,o,a),this.text=i.text,this.values=i.values,this.name=i.name,this.queryMode=i.queryMode,this.callback=i.callback,this.state="new",this._arrayMode=i.rowMode==="array",this._emitRowEvents=!1,this.on("newListener",(function(c){c==="row"&&(this._emitRowEvents=!0)}).bind(this))};t.inherits(s,e);const n={sqlState:"code",statementPosition:"position",messagePrimary:"message",context:"where",schemaName:"schema",tableName:"table",columnName:"column",dataTypeName:"dataType",constraintName:"constraint",sourceFile:"file",sourceLine:"line",sourceFunction:"routine"};return s.prototype.handleError=function(i){const o=this.native.pq.resultErrorFields();if(o)for(const a in o){const c=n[a]||a;i[c]=o[a]}this.callback?this.callback(i):this.emit("error",i),this.state="error"},s.prototype.then=function(i,o){return this._getPromise().then(i,o)},s.prototype.catch=function(i){return this._getPromise().catch(i)},s.prototype._getPromise=function(){return this._promise?this._promise:(this._promise=new Promise((function(i,o){this._once("end",i),this._once("error",o)}).bind(this)),this._promise)},s.prototype.submit=function(i){this.state="running";const o=this;this.native=i.native,i.native.arrayMode=this._arrayMode;let a=function(c,u,l){if(i.native.arrayMode=!1,setImmediate(function(){o.emit("_done")}),c)return o.handleError(c);o._emitRowEvents&&(l.length>1?u.forEach((f,d)=>{f.forEach(h=>{o.emit("row",h,l[d])})}):u.forEach(function(f){o.emit("row",f,l)})),o.state="end",o.emit("end",l),o.callback&&o.callback(null,l)};if(process.domain&&(a=process.domain.bind(a)),this.name){this.name.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",this.name,this.name.length),console.error("This can cause conflicts and silent errors executing queries"));const c=(this.values||[]).map(r.prepareValue);if(i.namedQueries[this.name]){if(this.text&&i.namedQueries[this.name]!==this.text){const u=new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);return a(u)}return i.native.execute(this.name,c,a)}return i.native.prepare(this.name,this.text,c.length,function(u){return u?a(u):(i.namedQueries[o.name]=o.text,o.native.execute(o.name,c,a))})}else if(this.values){if(!Array.isArray(this.values)){const u=new Error("Query values must be an array");return a(u)}const c=this.values.map(r.prepareValue);i.native.query(this.text,c,a)}else this.queryMode==="extended"?i.native.query(this.text,[],a):i.native.query(this.text,a)},Ir.exports}var fn;function na(){if(fn)return Rr.exports;fn=1;const e=He;var t;try{t=ra}catch(u){throw u}const r=Fr(),s=Fe.EventEmitter,n=He,i=si(),o=sa(),a=e.deprecate(()=>{},"Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead."),c=Rr.exports=function(u){s.call(this),u=u||{},this._Promise=u.Promise||jr.Promise,this._types=new r(u.types),this.native=new t({types:this._types}),this._queryQueue=[],this._ending=!1,this._connecting=!1,this._connected=!1,this._queryable=!0;const l=this.connectionParameters=new i(u);u.nativeConnectionString&&(l.nativeConnectionString=u.nativeConnectionString),this.user=l.user,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:l.password}),this.database=l.database,this.host=l.host,this.port=l.port,this.namedQueries={}};return c.Query=o,n.inherits(c,s),c.prototype._errorAllQueries=function(u){const l=f=>{process.nextTick(()=>{f.native=this.native,f.handleError(u)})};this._hasActiveQuery()&&(l(this._activeQuery),this._activeQuery=null),this._queryQueue.forEach(l),this._queryQueue.length=0},c.prototype._connect=function(u){const l=this;if(this._connecting){process.nextTick(()=>u(new Error("Client has already been connected. You cannot reuse a client.")));return}this._connecting=!0,this.connectionParameters.getLibpqConnectionString(function(f,d){if(l.connectionParameters.nativeConnectionString&&(d=l.connectionParameters.nativeConnectionString),f)return u(f);l.native.connect(d,function(h){if(h)return l.native.end(),u(h);l._connected=!0,l.native.on("error",function(m){l._queryable=!1,l._errorAllQueries(m),l.emit("error",m)}),l.native.on("notification",function(m){l.emit("notification",{channel:m.relname,payload:m.extra})}),l.emit("connect"),l._pulseQueryQueue(!0),u(null,this)})})},c.prototype.connect=function(u){if(u){this._connect(u);return}return new this._Promise((l,f)=>{this._connect(d=>{d?f(d):l(this)})})},c.prototype.query=function(u,l,f){let d,h,m,b,v;if(u==null)throw new TypeError("Client was passed a null or undefined query");if(typeof u.submit=="function")m=u.query_timeout||this.connectionParameters.query_timeout,h=d=u,typeof l=="function"&&(u.callback=l);else if(m=u.query_timeout||this.connectionParameters.query_timeout,d=new o(u,l,f),!d.callback){let p,y;h=new this._Promise((E,A)=>{p=E,y=A}).catch(E=>{throw Error.captureStackTrace(E),E}),d.callback=(E,A)=>E?y(E):p(A)}return m&&(v=d.callback||(()=>{}),b=setTimeout(()=>{const p=new Error("Query read timeout");process.nextTick(()=>{d.handleError(p,this.connection)}),v(p),d.callback=()=>{};const y=this._queryQueue.indexOf(d);y>-1&&this._queryQueue.splice(y,1),this._pulseQueryQueue()},m),d.callback=(p,y)=>{clearTimeout(b),v(p,y)}),this._queryable?this._ending?(d.native=this.native,process.nextTick(()=>{d.handleError(new Error("Client was closed and is not queryable"))}),h):(this._queryQueue.length>0&&a(),this._queryQueue.push(d),this._pulseQueryQueue(),h):(d.native=this.native,process.nextTick(()=>{d.handleError(new Error("Client has encountered a connection error and is not queryable"))}),h)},c.prototype.end=function(u){const l=this;this._ending=!0,this._connected||this.once("connect",this.end.bind(this,u));let f;return u||(f=new this._Promise(function(d,h){u=m=>m?h(m):d()})),this.native.end(function(){l._connected=!1,l._errorAllQueries(new Error("Connection terminated")),process.nextTick(()=>{l.emit("end"),u&&u()})}),f},c.prototype._hasActiveQuery=function(){return this._activeQuery&&this._activeQuery.state!=="error"&&this._activeQuery.state!=="end"},c.prototype._pulseQueryQueue=function(u){if(!this._connected||this._hasActiveQuery())return;const l=this._queryQueue.shift();if(!l){u||this.emit("drain");return}this._activeQuery=l,l.submit(this);const f=this;l.once("_done",function(){f._pulseQueryQueue()})},c.prototype.cancel=function(u){this._activeQuery===u?this.native.cancel(function(){}):this._queryQueue.indexOf(u)!==-1&&this._queryQueue.splice(this._queryQueue.indexOf(u),1)},c.prototype.ref=function(){},c.prototype.unref=function(){},c.prototype.setTypeParser=function(u,l,f){return this._types.setTypeParser(u,l,f)},c.prototype.getTypeParser=function(u,l){return this._types.getTypeParser(u,l)},c.prototype.isConnected=function(){return this._connected},Rr.exports}var Nr,hn;function pn(){return hn||(hn=1,Nr=na()),Nr}var mn;function li(){return mn||(mn=1,(function(e){var t={};const r=Zo(),s=wt(),n=ai(),i=ni(),o=Ze(),a=$o(),c=Fr(),{DatabaseError:u}=oi(),{escapeIdentifier:l,escapeLiteral:f}=Ze(),d=v=>class extends a{constructor(y){super(y,v)}},h=function(v){this.defaults=s,this.Client=v,this.Query=this.Client.Query,this.Pool=d(this.Client),this._pools=[],this.Connection=n,this.types=vt(),this.DatabaseError=u,this.TypeOverrides=c,this.escapeIdentifier=l,this.escapeLiteral=f,this.Result=i,this.utils=o};let m=r,b=!1;try{b=!!t.NODE_PG_FORCE_NATIVE}catch{}b&&(m=pn()),e.exports=new h(m),Object.defineProperty(e.exports,"native",{configurable:!0,enumerable:!1,get(){let v=null;try{v=new h(pn())}catch(p){if(p.code!=="MODULE_NOT_FOUND")throw p}return Object.defineProperty(e.exports,"native",{value:v}),v}})})(er)),er.exports}var ia=li();const $=Xn(ia);$.Client;const oa=$.Pool;$.Connection;$.types;$.Query;$.DatabaseError;$.escapeIdentifier;$.escapeLiteral;$.Result;$.TypeOverrides;$.defaults;const aa=Object.freeze(Object.defineProperty({__proto__:null,Pool:oa,default:$},Symbol.toStringTag,{value:"Module"}));export{Cs as default};
