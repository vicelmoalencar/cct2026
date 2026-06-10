var bi=Object.defineProperty;var Kr=e=>{throw TypeError(e)};var yi=(e,t,r)=>t in e?bi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var j=(e,t,r)=>yi(e,typeof t!="symbol"?t+"":t,r),It=(e,t,r)=>t.has(e)||Kr("Cannot "+r);var R=(e,t,r)=>(It(e,t,"read from private field"),r?r.call(e):t.get(e)),U=(e,t,r)=>t.has(e)?Kr("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),k=(e,t,r,s)=>(It(e,t,"write to private field"),s?s.call(e,r):t.set(e,r),r),H=(e,t,r)=>(It(e,t,"access private method"),r);var Zr=(e,t,r,s)=>({set _(n){k(e,t,n,r)},get _(){return R(e,t,s)}});import ze from"events";import He from"util";import On from"crypto";import vi from"dns";import Ln from"fs";import qn from"net";import wi from"tls";import Ei from"path";import Dn from"stream";import xi from"string_decoder";var es=(e,t,r)=>(s,n)=>{let i=-1;return o(0);async function o(l){if(l<=i)throw new Error("next() called multiple times");i=l;let c,u=!1,a;if(e[l]?(a=e[l][0][0],s.req.routeIndex=l):a=l===e.length&&n||void 0,a)try{c=await a(s,()=>o(l+1))}catch(f){if(f instanceof Error&&t)s.error=f,c=await t(f,s),u=!0;else throw f}else s.finalized===!1&&r&&(c=await r(s));return c&&(s.finalized===!1||u)&&(s.res=c),s}},_i=Symbol(),Si=async(e,t=Object.create(null))=>{const{all:r=!1,dot:s=!1}=t,i=(e instanceof Un?e.raw.headers:e.headers).get("Content-Type");return i!=null&&i.startsWith("multipart/form-data")||i!=null&&i.startsWith("application/x-www-form-urlencoded")?Ai(e,{all:r,dot:s}):{}};async function Ai(e,t){const r=await e.formData();return r?Ti(r,t):{}}function Ti(e,t){const r=Object.create(null);return e.forEach((s,n)=>{t.all||n.endsWith("[]")?Ci(r,n,s):r[n]=s}),t.dot&&Object.entries(r).forEach(([s,n])=>{s.includes(".")&&(Ri(r,s,n),delete r[s])}),r}var Ci=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},Ri=(e,t,r)=>{let s=e;const n=t.split(".");n.forEach((i,o)=>{o===n.length-1?s[i]=r:((!s[i]||typeof s[i]!="object"||Array.isArray(s[i])||s[i]instanceof File)&&(s[i]=Object.create(null)),s=s[i])})},jn=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Ni=e=>{const{groups:t,path:r}=Ii(e),s=jn(r);return Pi(s,t)},Ii=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,s)=>{const n=`@${s}`;return t.push([n,r]),n}),{groups:t,path:e}},Pi=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[s]=t[r];for(let n=e.length-1;n>=0;n--)if(e[n].includes(s)){e[n]=e[n].replace(s,t[r][1]);break}}return e},at={},Oi=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const s=`${e}#${t}`;return at[s]||(r[2]?at[s]=t&&t[0]!==":"&&t[0]!=="*"?[s,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:at[s]=[e,r[1],!0]),at[s]}return null},vt=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},Li=e=>vt(e,decodeURI),kn=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let s=r;for(;s<t.length;s++){const n=t.charCodeAt(s);if(n===37){const i=t.indexOf("?",s),o=t.slice(r,i===-1?void 0:i);return Li(o.includes("%25")?o.replace(/%25/g,"%2525"):o)}else if(n===63)break}return t.slice(r,s)},qi=e=>{const t=kn(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},qe=(e,t,...r)=>(r.length&&(t=qe(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),Bn=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let s="";return t.forEach(n=>{if(n!==""&&!/\:/.test(n))s+="/"+n;else if(/\:/.test(n))if(/\?/.test(n)){r.length===0&&s===""?r.push("/"):r.push(s);const i=n.replace("?","");s+="/"+i,r.push(s)}else s+="/"+n}),r.filter((n,i,o)=>o.indexOf(n)===i)},Pt=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?vt(e,zr):e):e,Mn=(e,t,r)=>{let s;if(!r&&t&&!/[%+]/.test(t)){let o=e.indexOf(`?${t}`,8);for(o===-1&&(o=e.indexOf(`&${t}`,8));o!==-1;){const l=e.charCodeAt(o+t.length+1);if(l===61){const c=o+t.length+2,u=e.indexOf("&",c);return Pt(e.slice(c,u===-1?void 0:u))}else if(l==38||isNaN(l))return"";o=e.indexOf(`&${t}`,o+1)}if(s=/[%+]/.test(e),!s)return}const n={};s??(s=/[%+]/.test(e));let i=e.indexOf("?",8);for(;i!==-1;){const o=e.indexOf("&",i+1);let l=e.indexOf("=",i);l>o&&o!==-1&&(l=-1);let c=e.slice(i+1,l===-1?o===-1?void 0:o:l);if(s&&(c=Pt(c)),i=o,c==="")continue;let u;l===-1?u="":(u=e.slice(l+1,o===-1?void 0:o),s&&(u=Pt(u))),r?(n[c]&&Array.isArray(n[c])||(n[c]=[]),n[c].push(u)):n[c]??(n[c]=u)}return t?n[t]:n},Di=Mn,ji=(e,t)=>Mn(e,t,!0),zr=decodeURIComponent,ts=e=>vt(e,zr),ke,K,fe,Fn,Hn,Mr,he,_n,Un=(_n=class{constructor(e,t="/",r=[[]]){U(this,fe);j(this,"raw");U(this,ke);U(this,K);j(this,"routeIndex",0);j(this,"path");j(this,"bodyCache",{});U(this,he,e=>{const{bodyCache:t,raw:r}=this,s=t[e];if(s)return s;const n=Object.keys(t)[0];return n?t[n].then(i=>(n==="json"&&(i=JSON.stringify(i)),new Response(i)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,k(this,K,r),k(this,ke,{})}param(e){return e?H(this,fe,Fn).call(this,e):H(this,fe,Hn).call(this)}query(e){return Di(this.url,e)}queries(e){return ji(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,s)=>{t[s]=r}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await Si(this,e))}json(){return R(this,he).call(this,"text").then(e=>JSON.parse(e))}text(){return R(this,he).call(this,"text")}arrayBuffer(){return R(this,he).call(this,"arrayBuffer")}blob(){return R(this,he).call(this,"blob")}formData(){return R(this,he).call(this,"formData")}addValidatedData(e,t){R(this,ke)[e]=t}valid(e){return R(this,ke)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[_i](){return R(this,K)}get matchedRoutes(){return R(this,K)[0].map(([[,e]])=>e)}get routePath(){return R(this,K)[0].map(([[,e]])=>e)[this.routeIndex].path}},ke=new WeakMap,K=new WeakMap,fe=new WeakSet,Fn=function(e){const t=R(this,K)[0][this.routeIndex][1][e],r=H(this,fe,Mr).call(this,t);return r&&/\%/.test(r)?ts(r):r},Hn=function(){const e={},t=Object.keys(R(this,K)[0][this.routeIndex][1]);for(const r of t){const s=H(this,fe,Mr).call(this,R(this,K)[0][this.routeIndex][1][r]);s!==void 0&&(e[r]=/\%/.test(s)?ts(s):s)}return e},Mr=function(e){return R(this,K)[1]?R(this,K)[1][e]:e},he=new WeakMap,_n),ki={Stringify:1},zn=async(e,t,r,s,n)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const i=e.callbacks;return i!=null&&i.length?(n?n[0]+=e:n=[e],Promise.all(i.map(l=>l({phase:t,buffer:n,context:s}))).then(l=>Promise.all(l.filter(Boolean).map(c=>zn(c,t,!1,s,n))).then(()=>n[0]))):Promise.resolve(e)},Bi="text/plain; charset=UTF-8",Ot=(e,t)=>({"Content-Type":e,...t}),et,tt,le,Be,ce,G,rt,Me,Ue,xe,st,nt,me,De,Sn,Mi=(Sn=class{constructor(e,t){U(this,me);U(this,et);U(this,tt);j(this,"env",{});U(this,le);j(this,"finalized",!1);j(this,"error");U(this,Be);U(this,ce);U(this,G);U(this,rt);U(this,Me);U(this,Ue);U(this,xe);U(this,st);U(this,nt);j(this,"render",(...e)=>(R(this,Me)??k(this,Me,t=>this.html(t)),R(this,Me).call(this,...e)));j(this,"setLayout",e=>k(this,rt,e));j(this,"getLayout",()=>R(this,rt));j(this,"setRenderer",e=>{k(this,Me,e)});j(this,"header",(e,t,r)=>{this.finalized&&k(this,G,new Response(R(this,G).body,R(this,G)));const s=R(this,G)?R(this,G).headers:R(this,xe)??k(this,xe,new Headers);t===void 0?s.delete(e):r!=null&&r.append?s.append(e,t):s.set(e,t)});j(this,"status",e=>{k(this,Be,e)});j(this,"set",(e,t)=>{R(this,le)??k(this,le,new Map),R(this,le).set(e,t)});j(this,"get",e=>R(this,le)?R(this,le).get(e):void 0);j(this,"newResponse",(...e)=>H(this,me,De).call(this,...e));j(this,"body",(e,t,r)=>H(this,me,De).call(this,e,t,r));j(this,"text",(e,t,r)=>!R(this,xe)&&!R(this,Be)&&!t&&!r&&!this.finalized?new Response(e):H(this,me,De).call(this,e,t,Ot(Bi,r)));j(this,"json",(e,t,r)=>H(this,me,De).call(this,JSON.stringify(e),t,Ot("application/json",r)));j(this,"html",(e,t,r)=>{const s=n=>H(this,me,De).call(this,n,t,Ot("text/html; charset=UTF-8",r));return typeof e=="object"?zn(e,ki.Stringify,!1,{}).then(s):s(e)});j(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});j(this,"notFound",()=>(R(this,Ue)??k(this,Ue,()=>new Response),R(this,Ue).call(this,this)));k(this,et,e),t&&(k(this,ce,t.executionCtx),this.env=t.env,k(this,Ue,t.notFoundHandler),k(this,nt,t.path),k(this,st,t.matchResult))}get req(){return R(this,tt)??k(this,tt,new Un(R(this,et),R(this,nt),R(this,st))),R(this,tt)}get event(){if(R(this,ce)&&"respondWith"in R(this,ce))return R(this,ce);throw Error("This context has no FetchEvent")}get executionCtx(){if(R(this,ce))return R(this,ce);throw Error("This context has no ExecutionContext")}get res(){return R(this,G)||k(this,G,new Response(null,{headers:R(this,xe)??k(this,xe,new Headers)}))}set res(e){if(R(this,G)&&e){e=new Response(e.body,e);for(const[t,r]of R(this,G).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const s=R(this,G).headers.getSetCookie();e.headers.delete("set-cookie");for(const n of s)e.headers.append("set-cookie",n)}else e.headers.set(t,r)}k(this,G,e),this.finalized=!0}get var(){return R(this,le)?Object.fromEntries(R(this,le)):{}}},et=new WeakMap,tt=new WeakMap,le=new WeakMap,Be=new WeakMap,ce=new WeakMap,G=new WeakMap,rt=new WeakMap,Me=new WeakMap,Ue=new WeakMap,xe=new WeakMap,st=new WeakMap,nt=new WeakMap,me=new WeakSet,De=function(e,t,r){const s=R(this,G)?new Headers(R(this,G).headers):R(this,xe)??new Headers;if(typeof t=="object"&&"headers"in t){const i=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[o,l]of i)o.toLowerCase()==="set-cookie"?s.append(o,l):s.set(o,l)}if(r)for(const[i,o]of Object.entries(r))if(typeof o=="string")s.set(i,o);else{s.delete(i);for(const l of o)s.append(i,l)}const n=typeof t=="number"?t:(t==null?void 0:t.status)??R(this,Be);return new Response(e,{status:n,headers:s})},Sn),V="ALL",Ui="all",Fi=["get","post","put","delete","options","patch"],Vn="Can not add a route since the matcher is already built.",Qn=class extends Error{},Hi="__COMPOSED_HANDLER",zi=e=>e.text("404 Not Found",404),rs=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},ee,Q,Wn,te,we,ft,pt,An,Xn=(An=class{constructor(t={}){U(this,Q);j(this,"get");j(this,"post");j(this,"put");j(this,"delete");j(this,"options");j(this,"patch");j(this,"all");j(this,"on");j(this,"use");j(this,"router");j(this,"getPath");j(this,"_basePath","/");U(this,ee,"/");j(this,"routes",[]);U(this,te,zi);j(this,"errorHandler",rs);j(this,"onError",t=>(this.errorHandler=t,this));j(this,"notFound",t=>(k(this,te,t),this));j(this,"fetch",(t,...r)=>H(this,Q,pt).call(this,t,r[1],r[0],t.method));j(this,"request",(t,r,s,n)=>t instanceof Request?this.fetch(r?new Request(t,r):t,s,n):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${qe("/",t)}`,r),s,n)));j(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(H(this,Q,pt).call(this,t.request,t,void 0,t.request.method))})});[...Fi,Ui].forEach(i=>{this[i]=(o,...l)=>(typeof o=="string"?k(this,ee,o):H(this,Q,we).call(this,i,R(this,ee),o),l.forEach(c=>{H(this,Q,we).call(this,i,R(this,ee),c)}),this)}),this.on=(i,o,...l)=>{for(const c of[o].flat()){k(this,ee,c);for(const u of[i].flat())l.map(a=>{H(this,Q,we).call(this,u.toUpperCase(),R(this,ee),a)})}return this},this.use=(i,...o)=>(typeof i=="string"?k(this,ee,i):(k(this,ee,"*"),o.unshift(i)),o.forEach(l=>{H(this,Q,we).call(this,V,R(this,ee),l)}),this);const{strict:s,...n}=t;Object.assign(this,n),this.getPath=s??!0?t.getPath??kn:qi}route(t,r){const s=this.basePath(t);return r.routes.map(n=>{var o;let i;r.errorHandler===rs?i=n.handler:(i=async(l,c)=>(await es([],r.errorHandler)(l,()=>n.handler(l,c))).res,i[Hi]=n.handler),H(o=s,Q,we).call(o,n.method,n.path,i)}),this}basePath(t){const r=H(this,Q,Wn).call(this);return r._basePath=qe(this._basePath,t),r}mount(t,r,s){let n,i;s&&(typeof s=="function"?i=s:(i=s.optionHandler,s.replaceRequest===!1?n=c=>c:n=s.replaceRequest));const o=i?c=>{const u=i(c);return Array.isArray(u)?u:[u]}:c=>{let u;try{u=c.executionCtx}catch{}return[c.env,u]};n||(n=(()=>{const c=qe(this._basePath,t),u=c==="/"?0:c.length;return a=>{const f=new URL(a.url);return f.pathname=f.pathname.slice(u)||"/",new Request(f,a)}})());const l=async(c,u)=>{const a=await r(n(c.req.raw),...o(c));if(a)return a;await u()};return H(this,Q,we).call(this,V,qe(t,"*"),l),this}},ee=new WeakMap,Q=new WeakSet,Wn=function(){const t=new Xn({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,k(t,te,R(this,te)),t.routes=this.routes,t},te=new WeakMap,we=function(t,r,s){t=t.toUpperCase(),r=qe(this._basePath,r);const n={basePath:this._basePath,path:r,method:t,handler:s};this.router.add(t,r,[s,n]),this.routes.push(n)},ft=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},pt=function(t,r,s,n){if(n==="HEAD")return(async()=>new Response(null,await H(this,Q,pt).call(this,t,r,s,"GET")))();const i=this.getPath(t,{env:s}),o=this.router.match(n,i),l=new Mi(t,{path:i,matchResult:o,env:s,executionCtx:r,notFoundHandler:R(this,te)});if(o[0].length===1){let u;try{u=o[0][0][0][0](l,async()=>{l.res=await R(this,te).call(this,l)})}catch(a){return H(this,Q,ft).call(this,a,l)}return u instanceof Promise?u.then(a=>a||(l.finalized?l.res:R(this,te).call(this,l))).catch(a=>H(this,Q,ft).call(this,a,l)):u??R(this,te).call(this,l)}const c=es(o[0],this.errorHandler,R(this,te));return(async()=>{try{const u=await c(l);if(!u.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return u.res}catch(u){return H(this,Q,ft).call(this,u,l)}})()},An),$n=[];function Vi(e,t){const r=this.buildAllMatchers(),s=(n,i)=>{const o=r[n]||r[V],l=o[2][i];if(l)return l;const c=i.match(o[0]);if(!c)return[[],$n];const u=c.indexOf("",1);return[o[1][u],c]};return this.match=s,s(e,t)}var mt="[^/]+",Ye=".*",Ke="(?:|/.*)",je=Symbol(),Qi=new Set(".\\+*[^]$()");function Xi(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===Ye||e===Ke?1:t===Ye||t===Ke?-1:e===mt?1:t===mt?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var _e,Se,re,Tn,Ur=(Tn=class{constructor(){U(this,_e);U(this,Se);U(this,re,Object.create(null))}insert(t,r,s,n,i){if(t.length===0){if(R(this,_e)!==void 0)throw je;if(i)return;k(this,_e,r);return}const[o,...l]=t,c=o==="*"?l.length===0?["","",Ye]:["","",mt]:o==="/*"?["","",Ke]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let u;if(c){const a=c[1];let f=c[2]||mt;if(a&&c[2]&&(f===".*"||(f=f.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(f))))throw je;if(u=R(this,re)[f],!u){if(Object.keys(R(this,re)).some(d=>d!==Ye&&d!==Ke))throw je;if(i)return;u=R(this,re)[f]=new Ur,a!==""&&k(u,Se,n.varIndex++)}!i&&a!==""&&s.push([a,R(u,Se)])}else if(u=R(this,re)[o],!u){if(Object.keys(R(this,re)).some(a=>a.length>1&&a!==Ye&&a!==Ke))throw je;if(i)return;u=R(this,re)[o]=new Ur}u.insert(l,r,s,n,i)}buildRegExpStr(){const r=Object.keys(R(this,re)).sort(Xi).map(s=>{const n=R(this,re)[s];return(typeof R(n,Se)=="number"?`(${s})@${R(n,Se)}`:Qi.has(s)?`\\${s}`:s)+n.buildRegExpStr()});return typeof R(this,_e)=="number"&&r.unshift(`#${R(this,_e)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},_e=new WeakMap,Se=new WeakMap,re=new WeakMap,Tn),bt,it,Cn,Wi=(Cn=class{constructor(){U(this,bt,{varIndex:0});U(this,it,new Ur)}insert(e,t,r){const s=[],n=[];for(let o=0;;){let l=!1;if(e=e.replace(/\{[^}]+\}/g,c=>{const u=`@\\${o}`;return n[o]=[u,c],o++,l=!0,u}),!l)break}const i=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let o=n.length-1;o>=0;o--){const[l]=n[o];for(let c=i.length-1;c>=0;c--)if(i[c].indexOf(l)!==-1){i[c]=i[c].replace(l,n[o][1]);break}}return R(this,it).insert(i,t,s,R(this,bt),r),s}buildRegExp(){let e=R(this,it).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],s=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(n,i,o)=>i!==void 0?(r[++t]=Number(i),"$()"):(o!==void 0&&(s[Number(o)]=++t),"")),[new RegExp(`^${e}`),r,s]}},bt=new WeakMap,it=new WeakMap,Cn),$i=[/^$/,[],Object.create(null)],ht=Object.create(null);function Gn(e){return ht[e]??(ht[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function Gi(){ht=Object.create(null)}function Ji(e){var u;const t=new Wi,r=[];if(e.length===0)return $i;const s=e.map(a=>[!/\*|\/:/.test(a[0]),...a]).sort(([a,f],[d,p])=>a?1:d?-1:f.length-p.length),n=Object.create(null);for(let a=0,f=-1,d=s.length;a<d;a++){const[p,g,b]=s[a];p?n[g]=[b.map(([h])=>[h,Object.create(null)]),$n]:f++;let v;try{v=t.insert(g,f,p)}catch(h){throw h===je?new Qn(g):h}p||(r[f]=b.map(([h,y])=>{const E=Object.create(null);for(y-=1;y>=0;y--){const[S,L]=v[y];E[S]=L}return[h,E]}))}const[i,o,l]=t.buildRegExp();for(let a=0,f=r.length;a<f;a++)for(let d=0,p=r[a].length;d<p;d++){const g=(u=r[a][d])==null?void 0:u[1];if(!g)continue;const b=Object.keys(g);for(let v=0,h=b.length;v<h;v++)g[b[v]]=l[g[b[v]]]}const c=[];for(const a in o)c[a]=r[o[a]];return[i,c,n]}function Pe(e,t){if(e){for(const r of Object.keys(e).sort((s,n)=>n.length-s.length))if(Gn(r).test(t))return[...e[r]]}}var ge,be,yt,Jn,Rn,Yi=(Rn=class{constructor(){U(this,yt);j(this,"name","RegExpRouter");U(this,ge);U(this,be);j(this,"match",Vi);k(this,ge,{[V]:Object.create(null)}),k(this,be,{[V]:Object.create(null)})}add(e,t,r){var l;const s=R(this,ge),n=R(this,be);if(!s||!n)throw new Error(Vn);s[e]||[s,n].forEach(c=>{c[e]=Object.create(null),Object.keys(c[V]).forEach(u=>{c[e][u]=[...c[V][u]]})}),t==="/*"&&(t="*");const i=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const c=Gn(t);e===V?Object.keys(s).forEach(u=>{var a;(a=s[u])[t]||(a[t]=Pe(s[u],t)||Pe(s[V],t)||[])}):(l=s[e])[t]||(l[t]=Pe(s[e],t)||Pe(s[V],t)||[]),Object.keys(s).forEach(u=>{(e===V||e===u)&&Object.keys(s[u]).forEach(a=>{c.test(a)&&s[u][a].push([r,i])})}),Object.keys(n).forEach(u=>{(e===V||e===u)&&Object.keys(n[u]).forEach(a=>c.test(a)&&n[u][a].push([r,i]))});return}const o=Bn(t)||[t];for(let c=0,u=o.length;c<u;c++){const a=o[c];Object.keys(n).forEach(f=>{var d;(e===V||e===f)&&((d=n[f])[a]||(d[a]=[...Pe(s[f],a)||Pe(s[V],a)||[]]),n[f][a].push([r,i-u+c+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(R(this,be)).concat(Object.keys(R(this,ge))).forEach(t=>{e[t]||(e[t]=H(this,yt,Jn).call(this,t))}),k(this,ge,k(this,be,void 0)),Gi(),e}},ge=new WeakMap,be=new WeakMap,yt=new WeakSet,Jn=function(e){const t=[];let r=e===V;return[R(this,ge),R(this,be)].forEach(s=>{const n=s[e]?Object.keys(s[e]).map(i=>[i,s[e][i]]):[];n.length!==0?(r||(r=!0),t.push(...n)):e!==V&&t.push(...Object.keys(s[V]).map(i=>[i,s[V][i]]))}),r?Ji(t):null},Rn),ye,ue,Nn,Ki=(Nn=class{constructor(e){j(this,"name","SmartRouter");U(this,ye,[]);U(this,ue,[]);k(this,ye,e.routers)}add(e,t,r){if(!R(this,ue))throw new Error(Vn);R(this,ue).push([e,t,r])}match(e,t){if(!R(this,ue))throw new Error("Fatal error");const r=R(this,ye),s=R(this,ue),n=r.length;let i=0,o;for(;i<n;i++){const l=r[i];try{for(let c=0,u=s.length;c<u;c++)l.add(...s[c]);o=l.match(e,t)}catch(c){if(c instanceof Qn)continue;throw c}this.match=l.match.bind(l),k(this,ye,[l]),k(this,ue,void 0);break}if(i===n)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(R(this,ue)||R(this,ye).length!==1)throw new Error("No active router has been determined yet.");return R(this,ye)[0]}},ye=new WeakMap,ue=new WeakMap,Nn),Ve=Object.create(null),ve,W,Ae,Fe,X,de,Ee,In,Yn=(In=class{constructor(e,t,r){U(this,de);U(this,ve);U(this,W);U(this,Ae);U(this,Fe,0);U(this,X,Ve);if(k(this,W,r||Object.create(null)),k(this,ve,[]),e&&t){const s=Object.create(null);s[e]={handler:t,possibleKeys:[],score:0},k(this,ve,[s])}k(this,Ae,[])}insert(e,t,r){k(this,Fe,++Zr(this,Fe)._);let s=this;const n=Ni(t),i=[];for(let o=0,l=n.length;o<l;o++){const c=n[o],u=n[o+1],a=Oi(c,u),f=Array.isArray(a)?a[0]:c;if(f in R(s,W)){s=R(s,W)[f],a&&i.push(a[1]);continue}R(s,W)[f]=new Yn,a&&(R(s,Ae).push(a),i.push(a[1])),s=R(s,W)[f]}return R(s,ve).push({[e]:{handler:r,possibleKeys:i.filter((o,l,c)=>c.indexOf(o)===l),score:R(this,Fe)}}),s}search(e,t){var l;const r=[];k(this,X,Ve);let n=[this];const i=jn(t),o=[];for(let c=0,u=i.length;c<u;c++){const a=i[c],f=c===u-1,d=[];for(let p=0,g=n.length;p<g;p++){const b=n[p],v=R(b,W)[a];v&&(k(v,X,R(b,X)),f?(R(v,W)["*"]&&r.push(...H(this,de,Ee).call(this,R(v,W)["*"],e,R(b,X))),r.push(...H(this,de,Ee).call(this,v,e,R(b,X)))):d.push(v));for(let h=0,y=R(b,Ae).length;h<y;h++){const E=R(b,Ae)[h],S=R(b,X)===Ve?{}:{...R(b,X)};if(E==="*"){const T=R(b,W)["*"];T&&(r.push(...H(this,de,Ee).call(this,T,e,R(b,X))),k(T,X,S),d.push(T));continue}const[L,A,m]=E;if(!a&&!(m instanceof RegExp))continue;const _=R(b,W)[L],w=i.slice(c).join("/");if(m instanceof RegExp){const T=m.exec(w);if(T){if(S[A]=T[0],r.push(...H(this,de,Ee).call(this,_,e,R(b,X),S)),Object.keys(R(_,W)).length){k(_,X,S);const C=((l=T[0].match(/\//))==null?void 0:l.length)??0;(o[C]||(o[C]=[])).push(_)}continue}}(m===!0||m.test(a))&&(S[A]=a,f?(r.push(...H(this,de,Ee).call(this,_,e,S,R(b,X))),R(_,W)["*"]&&r.push(...H(this,de,Ee).call(this,R(_,W)["*"],e,S,R(b,X)))):(k(_,X,S),d.push(_)))}}n=d.concat(o.shift()??[])}return r.length>1&&r.sort((c,u)=>c.score-u.score),[r.map(({handler:c,params:u})=>[c,u])]}},ve=new WeakMap,W=new WeakMap,Ae=new WeakMap,Fe=new WeakMap,X=new WeakMap,de=new WeakSet,Ee=function(e,t,r,s){const n=[];for(let i=0,o=R(e,ve).length;i<o;i++){const l=R(e,ve)[i],c=l[t]||l[V],u={};if(c!==void 0&&(c.params=Object.create(null),n.push(c),r!==Ve||s&&s!==Ve))for(let a=0,f=c.possibleKeys.length;a<f;a++){const d=c.possibleKeys[a],p=u[c.score];c.params[d]=s!=null&&s[d]&&!p?s[d]:r[d]??(s==null?void 0:s[d]),u[c.score]=!0}}return n},In),Te,Pn,Zi=(Pn=class{constructor(){j(this,"name","TrieRouter");U(this,Te);k(this,Te,new Yn)}add(e,t,r){const s=Bn(t);if(s){for(let n=0,i=s.length;n<i;n++)R(this,Te).insert(e,s[n],r);return}R(this,Te).insert(e,t,r)}match(e,t){return R(this,Te).search(e,t)}},Te=new WeakMap,Pn),Kn=class extends Xn{constructor(e={}){super(e),this.router=e.router??new Ki({routers:[new Yi,new Zi]})}},eo=e=>{const r={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},s=(i=>typeof i=="string"?i==="*"?()=>i:o=>i===o?o:null:typeof i=="function"?i:o=>i.includes(o)?o:null)(r.origin),n=(i=>typeof i=="function"?i:Array.isArray(i)?()=>i:()=>[])(r.allowMethods);return async function(o,l){var a;function c(f,d){o.res.headers.set(f,d)}const u=await s(o.req.header("origin")||"",o);if(u&&c("Access-Control-Allow-Origin",u),r.origin!=="*"){const f=o.req.header("Vary");f?c("Vary",f):c("Vary","Origin")}if(r.credentials&&c("Access-Control-Allow-Credentials","true"),(a=r.exposeHeaders)!=null&&a.length&&c("Access-Control-Expose-Headers",r.exposeHeaders.join(",")),o.req.method==="OPTIONS"){r.maxAge!=null&&c("Access-Control-Max-Age",r.maxAge.toString());const f=await n(o.req.header("origin")||"",o);f.length&&c("Access-Control-Allow-Methods",f.join(","));let d=r.allowHeaders;if(!(d!=null&&d.length)){const p=o.req.header("Access-Control-Request-Headers");p&&(d=p.split(/\s*,\s*/))}return d!=null&&d.length&&(c("Access-Control-Allow-Headers",d.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await l()}},to=/^[\w!#$%&'*.^`|~+-]+$/,ro=/^[ !#-:<-[\]-~]*$/,ss=(e,t)=>{if(t&&e.indexOf(t)===-1)return{};const r=e.trim().split(";"),s={};for(let n of r){n=n.trim();const i=n.indexOf("=");if(i===-1)continue;const o=n.substring(0,i).trim();if(t&&t!==o||!to.test(o))continue;let l=n.substring(i+1).trim();if(l.startsWith('"')&&l.endsWith('"')&&(l=l.slice(1,-1)),ro.test(l)&&(s[o]=l.indexOf("%")!==-1?vt(l,zr):l,t))break}return s},so=(e,t,r={})=>{let s=`${e}=${t}`;if(e.startsWith("__Secure-")&&!r.secure)throw new Error("__Secure- Cookie must have Secure attributes");if(e.startsWith("__Host-")){if(!r.secure)throw new Error("__Host- Cookie must have Secure attributes");if(r.path!=="/")throw new Error('__Host- Cookie must have Path attributes with "/"');if(r.domain)throw new Error("__Host- Cookie must not have Domain attributes")}if(r&&typeof r.maxAge=="number"&&r.maxAge>=0){if(r.maxAge>3456e4)throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");s+=`; Max-Age=${r.maxAge|0}`}if(r.domain&&r.prefix!=="host"&&(s+=`; Domain=${r.domain}`),r.path&&(s+=`; Path=${r.path}`),r.expires){if(r.expires.getTime()-Date.now()>3456e7)throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");s+=`; Expires=${r.expires.toUTCString()}`}if(r.httpOnly&&(s+="; HttpOnly"),r.secure&&(s+="; Secure"),r.sameSite&&(s+=`; SameSite=${r.sameSite.charAt(0).toUpperCase()+r.sameSite.slice(1)}`),r.priority&&(s+=`; Priority=${r.priority.charAt(0).toUpperCase()+r.priority.slice(1)}`),r.partitioned){if(!r.secure)throw new Error("Partitioned Cookie must have Secure attributes");s+="; Partitioned"}return s},Lt=(e,t,r)=>(t=encodeURIComponent(t),so(e,t,r)),$=(e,t,r)=>{const s=e.req.raw.headers.get("Cookie");if(typeof t=="string"){if(!s)return;let i=t;return ss(s,i)[i]}return s?ss(s):{}},no=(e,t,r)=>{let s;return(r==null?void 0:r.prefix)==="secure"?s=Lt("__Secure-"+e,t,{path:"/",...r,secure:!0}):(r==null?void 0:r.prefix)==="host"?s=Lt("__Host-"+e,t,{...r,path:"/",secure:!0,domain:void 0}):s=Lt(e,t,{path:"/",...r}),s},se=(e,t,r,s)=>{const n=no(t,r,s);e.header("Set-Cookie",n,{append:!0})},gt=(e,t,r)=>{const s=$(e,t);return se(e,t,"",{...r,maxAge:0}),s};class io{constructor(t,r){j(this,"supabaseUrl");j(this,"supabaseKey");this.supabaseUrl=t,this.supabaseKey=r}async query(t,r={},s){const{select:n="*",filters:i={},order:o,limit:l,single:c=!1}=r;let u=`${this.supabaseUrl}/rest/v1/${t}?select=${n}`;Object.entries(i).forEach(([d,p])=>{u+=`&${d}=eq.${p}`}),o&&(u+=`&order=${o}`),l&&(u+=`&limit=${l}`);const a={apikey:this.supabaseKey,"Content-Type":"application/json"};s&&(a.Authorization=`Bearer ${s}`),c&&(a.Accept="application/vnd.pgrst.object+json");const f=await fetch(u,{headers:a});if(!f.ok)throw new Error(`Supabase query failed: ${f.statusText}`);return await f.json()}async insert(t,r,s){const n=`${this.supabaseUrl}/rest/v1/${t}`,i={apikey:this.supabaseKey,"Content-Type":"application/json",Prefer:"return=representation"};s&&(i.Authorization=`Bearer ${s}`);const o=await fetch(n,{method:"POST",headers:i,body:JSON.stringify(r)});if(!o.ok){const l=await o.text();throw console.error(`Supabase insert failed for table ${t}:`,{status:o.status,statusText:o.statusText,error:l,data:r}),new Error(`Supabase insert failed (${o.status}): ${l}`)}return await o.json()}async update(t,r,s,n){let i=`${this.supabaseUrl}/rest/v1/${t}?`;Object.entries(r).forEach(([c,u])=>{i+=`${c}=eq.${u}&`});const o={apikey:this.supabaseKey,"Content-Type":"application/json",Prefer:"return=representation"};n&&(o.Authorization=`Bearer ${n}`);const l=await fetch(i,{method:"PATCH",headers:o,body:JSON.stringify(s)});if(!l.ok){const c=await l.text();throw new Error(`Supabase update failed: ${c}`)}return await l.json()}async delete(t,r,s){let n=`${this.supabaseUrl}/rest/v1/${t}?`;Object.entries(r).forEach(([l,c])=>{n+=`${l}=eq.${c}&`});const i={apikey:this.supabaseKey,"Content-Type":"application/json"};s&&(i.Authorization=`Bearer ${s}`);const o=await fetch(n,{method:"DELETE",headers:i});if(!o.ok){const l=await o.text();throw new Error(`Supabase delete failed: ${l}`)}return!0}async rpc(t,r={},s){const n=`${this.supabaseUrl}/rest/v1/rpc/${t}`,i={apikey:this.supabaseKey,"Content-Type":"application/json"};s&&(i.Authorization=`Bearer ${s}`);const o=await fetch(n,{method:"POST",headers:i,body:JSON.stringify(r)});if(!o.ok){const l=await o.text();throw new Error(`Supabase RPC failed: ${l}`)}return await o.json()}}const Qe=new Map;class wt{constructor(t){j(this,"connectionString");this.connectionString=t.replace("postgresql+psycopg2://","postgresql://").replace("postgres+psycopg2://","postgresql://")}async getPool(){if(Qe.has(this.connectionString))return Qe.get(this.connectionString);const t=await Promise.resolve().then(()=>pa),{Pool:r}=t.default||t;let s=this.connectionString;s.includes("connect_timeout")||(s+=(s.includes("?")?"&":"?")+"connect_timeout=5");const n=new r({connectionString:s,ssl:!1,max:5,idleTimeoutMillis:3e4,connectionTimeoutMillis:5e3});return n.on("error",i=>{console.error("❌ PostgreSQL pool error:",i.message)}),Qe.set(this.connectionString,n),n}async query(t,r={}){const{select:s="*",filters:n={},order:i,limit:o,single:l=!1}=r,c=await this.getPool(),u=[],a=[];let f=1;for(const[h,y]of Object.entries(n))u.push(`"${h}" = $${f}`),a.push(y),f++;let d="";i&&(d="ORDER BY "+i.replace(/\.desc$/i," DESC").replace(/\.asc$/i," ASC").replace(/,([^,]+)\.desc/gi,", $1 DESC").replace(/,([^,]+)\.asc/gi,", $1 ASC"));const p=u.length>0?`WHERE ${u.join(" AND ")}`:"",g=o||l?`LIMIT ${l?1:o}`:"",b=`SELECT ${s} FROM "${t}" ${p} ${d} ${g}`.trim(),v=await c.query(b,a);return l?v.rows[0]||null:v.rows}async insert(t,r){const s=await this.getPool(),n=Object.keys(r).filter(u=>r[u]!==void 0),i=n.map(u=>r[u]),o=n.map((u,a)=>`$${a+1}`),l=`
      INSERT INTO "${t}" (${n.map(u=>`"${u}"`).join(", ")})
      VALUES (${o.join(", ")})
      RETURNING *
    `;return(await s.query(l,i)).rows}async update(t,r,s){const n=await this.getPool(),i=Object.keys(s).filter(p=>s[p]!==void 0),o=[];let l=1;const c=i.map(p=>(o.push(s[p]),`"${p}" = $${l++}`)),u=[];for(const[p,g]of Object.entries(r))u.push(`"${p}" = $${l}`),o.push(g),l++;const a=u.length>0?`WHERE ${u.join(" AND ")}`:"",f=`UPDATE "${t}" SET ${c.join(", ")} ${a} RETURNING *`;return(await n.query(f,o)).rows}async delete(t,r){const s=await this.getPool(),n=[],i=[];let o=1;for(const[u,a]of Object.entries(r))n.push(`"${u}" = $${o}`),i.push(a),o++;const l=n.length>0?`WHERE ${n.join(" AND ")}`:"",c=`DELETE FROM "${t}" ${l}`;return await s.query(c,i),!0}async sql(t,r=[]){return(await(await this.getPool()).query(t,r)).rows}async rpc(t,r={}){const s=await this.getPool(),n=Object.keys(r),i=n.map(u=>r[u]),o=n.map((u,a)=>`${u} => $${a+1}`).join(", "),l=`SELECT * FROM ${t}(${o})`,c=await s.query(l,i);if(c.rows.length===1){const u=c.rows[0],a=Object.keys(u);return a.length===1?u[a[0]]:u}return c.rows}async end(){const t=Qe.get(this.connectionString);t&&(await t.end(),Qe.delete(this.connectionString))}}const ns="data:image/png;base64,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";var Vr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Zn(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function oo(e){if(Object.prototype.hasOwnProperty.call(e,"__esModule"))return e;var t=e.default;if(typeof t=="function"){var r=function s(){return this instanceof s?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};r.prototype=t.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(e).forEach(function(s){var n=Object.getOwnPropertyDescriptor(e,s);Object.defineProperty(r,s,n.get?n:{enumerable:!0,get:function(){return e[s]}})}),r}var Oe={},qt,is;function ao(){return is||(is=1,qt=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),qt}var Dt={},pe={},os;function Ce(){if(os)return pe;os=1;let e;const t=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return pe.getSymbolSize=function(s){if(!s)throw new Error('"version" cannot be null or undefined');if(s<1||s>40)throw new Error('"version" should be in range from 1 to 40');return s*4+17},pe.getSymbolTotalCodewords=function(s){return t[s]},pe.getBCHDigit=function(r){let s=0;for(;r!==0;)s++,r>>>=1;return s},pe.setToSJISFunction=function(s){if(typeof s!="function")throw new Error('"toSJISFunc" is not a valid function.');e=s},pe.isKanjiModeEnabled=function(){return typeof e<"u"},pe.toSJIS=function(s){return e(s)},pe}var jt={},as;function Qr(){return as||(as=1,(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(r){if(typeof r!="string")throw new Error("Param is not a string");switch(r.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+r)}}e.isValid=function(s){return s&&typeof s.bit<"u"&&s.bit>=0&&s.bit<4},e.from=function(s,n){if(e.isValid(s))return s;try{return t(s)}catch{return n}}})(jt)),jt}var kt,ls;function lo(){if(ls)return kt;ls=1;function e(){this.buffer=[],this.length=0}return e.prototype={get:function(t){const r=Math.floor(t/8);return(this.buffer[r]>>>7-t%8&1)===1},put:function(t,r){for(let s=0;s<r;s++)this.putBit((t>>>r-s-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(t){const r=Math.floor(this.length/8);this.buffer.length<=r&&this.buffer.push(0),t&&(this.buffer[r]|=128>>>this.length%8),this.length++}},kt=e,kt}var Bt,cs;function co(){if(cs)return Bt;cs=1;function e(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}return e.prototype.set=function(t,r,s,n){const i=t*this.size+r;this.data[i]=s,n&&(this.reservedBit[i]=!0)},e.prototype.get=function(t,r){return this.data[t*this.size+r]},e.prototype.xor=function(t,r,s){this.data[t*this.size+r]^=s},e.prototype.isReserved=function(t,r){return this.reservedBit[t*this.size+r]},Bt=e,Bt}var Mt={},us;function uo(){return us||(us=1,(function(e){const t=Ce().getSymbolSize;e.getRowColCoords=function(s){if(s===1)return[];const n=Math.floor(s/7)+2,i=t(s),o=i===145?26:Math.ceil((i-13)/(2*n-2))*2,l=[i-7];for(let c=1;c<n-1;c++)l[c]=l[c-1]-o;return l.push(6),l.reverse()},e.getPositions=function(s){const n=[],i=e.getRowColCoords(s),o=i.length;for(let l=0;l<o;l++)for(let c=0;c<o;c++)l===0&&c===0||l===0&&c===o-1||l===o-1&&c===0||n.push([i[l],i[c]]);return n}})(Mt)),Mt}var Ut={},ds;function fo(){if(ds)return Ut;ds=1;const e=Ce().getSymbolSize,t=7;return Ut.getPositions=function(s){const n=e(s);return[[0,0],[n-t,0],[0,n-t]]},Ut}var Ft={},fs;function po(){return fs||(fs=1,(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(n){return n!=null&&n!==""&&!isNaN(n)&&n>=0&&n<=7},e.from=function(n){return e.isValid(n)?parseInt(n,10):void 0},e.getPenaltyN1=function(n){const i=n.size;let o=0,l=0,c=0,u=null,a=null;for(let f=0;f<i;f++){l=c=0,u=a=null;for(let d=0;d<i;d++){let p=n.get(f,d);p===u?l++:(l>=5&&(o+=t.N1+(l-5)),u=p,l=1),p=n.get(d,f),p===a?c++:(c>=5&&(o+=t.N1+(c-5)),a=p,c=1)}l>=5&&(o+=t.N1+(l-5)),c>=5&&(o+=t.N1+(c-5))}return o},e.getPenaltyN2=function(n){const i=n.size;let o=0;for(let l=0;l<i-1;l++)for(let c=0;c<i-1;c++){const u=n.get(l,c)+n.get(l,c+1)+n.get(l+1,c)+n.get(l+1,c+1);(u===4||u===0)&&o++}return o*t.N2},e.getPenaltyN3=function(n){const i=n.size;let o=0,l=0,c=0;for(let u=0;u<i;u++){l=c=0;for(let a=0;a<i;a++)l=l<<1&2047|n.get(u,a),a>=10&&(l===1488||l===93)&&o++,c=c<<1&2047|n.get(a,u),a>=10&&(c===1488||c===93)&&o++}return o*t.N3},e.getPenaltyN4=function(n){let i=0;const o=n.data.length;for(let c=0;c<o;c++)i+=n.data[c];return Math.abs(Math.ceil(i*100/o/5)-10)*t.N4};function r(s,n,i){switch(s){case e.Patterns.PATTERN000:return(n+i)%2===0;case e.Patterns.PATTERN001:return n%2===0;case e.Patterns.PATTERN010:return i%3===0;case e.Patterns.PATTERN011:return(n+i)%3===0;case e.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(i/3))%2===0;case e.Patterns.PATTERN101:return n*i%2+n*i%3===0;case e.Patterns.PATTERN110:return(n*i%2+n*i%3)%2===0;case e.Patterns.PATTERN111:return(n*i%3+(n+i)%2)%2===0;default:throw new Error("bad maskPattern:"+s)}}e.applyMask=function(n,i){const o=i.size;for(let l=0;l<o;l++)for(let c=0;c<o;c++)i.isReserved(c,l)||i.xor(c,l,r(n,c,l))},e.getBestMask=function(n,i){const o=Object.keys(e.Patterns).length;let l=0,c=1/0;for(let u=0;u<o;u++){i(u),e.applyMask(u,n);const a=e.getPenaltyN1(n)+e.getPenaltyN2(n)+e.getPenaltyN3(n)+e.getPenaltyN4(n);e.applyMask(u,n),a<c&&(c=a,l=u)}return l}})(Ft)),Ft}var lt={},ps;function ei(){if(ps)return lt;ps=1;const e=Qr(),t=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],r=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return lt.getBlocksCount=function(n,i){switch(i){case e.L:return t[(n-1)*4+0];case e.M:return t[(n-1)*4+1];case e.Q:return t[(n-1)*4+2];case e.H:return t[(n-1)*4+3];default:return}},lt.getTotalCodewordsCount=function(n,i){switch(i){case e.L:return r[(n-1)*4+0];case e.M:return r[(n-1)*4+1];case e.Q:return r[(n-1)*4+2];case e.H:return r[(n-1)*4+3];default:return}},lt}var Ht={},Xe={},hs;function ho(){if(hs)return Xe;hs=1;const e=new Uint8Array(512),t=new Uint8Array(256);return(function(){let s=1;for(let n=0;n<255;n++)e[n]=s,t[s]=n,s<<=1,s&256&&(s^=285);for(let n=255;n<512;n++)e[n]=e[n-255]})(),Xe.log=function(s){if(s<1)throw new Error("log("+s+")");return t[s]},Xe.exp=function(s){return e[s]},Xe.mul=function(s,n){return s===0||n===0?0:e[t[s]+t[n]]},Xe}var ms;function mo(){return ms||(ms=1,(function(e){const t=ho();e.mul=function(s,n){const i=new Uint8Array(s.length+n.length-1);for(let o=0;o<s.length;o++)for(let l=0;l<n.length;l++)i[o+l]^=t.mul(s[o],n[l]);return i},e.mod=function(s,n){let i=new Uint8Array(s);for(;i.length-n.length>=0;){const o=i[0];for(let c=0;c<n.length;c++)i[c]^=t.mul(n[c],o);let l=0;for(;l<i.length&&i[l]===0;)l++;i=i.slice(l)}return i},e.generateECPolynomial=function(s){let n=new Uint8Array([1]);for(let i=0;i<s;i++)n=e.mul(n,new Uint8Array([1,t.exp(i)]));return n}})(Ht)),Ht}var zt,gs;function go(){if(gs)return zt;gs=1;const e=mo();function t(r){this.genPoly=void 0,this.degree=r,this.degree&&this.initialize(this.degree)}return t.prototype.initialize=function(s){this.degree=s,this.genPoly=e.generateECPolynomial(this.degree)},t.prototype.encode=function(s){if(!this.genPoly)throw new Error("Encoder not initialized");const n=new Uint8Array(s.length+this.degree);n.set(s);const i=e.mod(n,this.genPoly),o=this.degree-i.length;if(o>0){const l=new Uint8Array(this.degree);return l.set(i,o),l}return i},zt=t,zt}var Vt={},Qt={},Xt={},bs;function ti(){return bs||(bs=1,Xt.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}),Xt}var ne={},ys;function ri(){if(ys)return ne;ys=1;const e="[0-9]+",t="[A-Z $%*+\\-./:]+";let r="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";r=r.replace(/u/g,"\\u");const s="(?:(?![A-Z0-9 $%*+\\-./:]|"+r+`)(?:.|[\r
]))+`;ne.KANJI=new RegExp(r,"g"),ne.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),ne.BYTE=new RegExp(s,"g"),ne.NUMERIC=new RegExp(e,"g"),ne.ALPHANUMERIC=new RegExp(t,"g");const n=new RegExp("^"+r+"$"),i=new RegExp("^"+e+"$"),o=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return ne.testKanji=function(c){return n.test(c)},ne.testNumeric=function(c){return i.test(c)},ne.testAlphanumeric=function(c){return o.test(c)},ne}var vs;function Re(){return vs||(vs=1,(function(e){const t=ti(),r=ri();e.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(i,o){if(!i.ccBits)throw new Error("Invalid mode: "+i);if(!t.isValid(o))throw new Error("Invalid version: "+o);return o>=1&&o<10?i.ccBits[0]:o<27?i.ccBits[1]:i.ccBits[2]},e.getBestModeForData=function(i){return r.testNumeric(i)?e.NUMERIC:r.testAlphanumeric(i)?e.ALPHANUMERIC:r.testKanji(i)?e.KANJI:e.BYTE},e.toString=function(i){if(i&&i.id)return i.id;throw new Error("Invalid mode")},e.isValid=function(i){return i&&i.bit&&i.ccBits};function s(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+n)}}e.from=function(i,o){if(e.isValid(i))return i;try{return s(i)}catch{return o}}})(Qt)),Qt}var ws;function bo(){return ws||(ws=1,(function(e){const t=Ce(),r=ei(),s=Qr(),n=Re(),i=ti(),o=7973,l=t.getBCHDigit(o);function c(d,p,g){for(let b=1;b<=40;b++)if(p<=e.getCapacity(b,g,d))return b}function u(d,p){return n.getCharCountIndicator(d,p)+4}function a(d,p){let g=0;return d.forEach(function(b){const v=u(b.mode,p);g+=v+b.getBitsLength()}),g}function f(d,p){for(let g=1;g<=40;g++)if(a(d,g)<=e.getCapacity(g,p,n.MIXED))return g}e.from=function(p,g){return i.isValid(p)?parseInt(p,10):g},e.getCapacity=function(p,g,b){if(!i.isValid(p))throw new Error("Invalid QR Code version");typeof b>"u"&&(b=n.BYTE);const v=t.getSymbolTotalCodewords(p),h=r.getTotalCodewordsCount(p,g),y=(v-h)*8;if(b===n.MIXED)return y;const E=y-u(b,p);switch(b){case n.NUMERIC:return Math.floor(E/10*3);case n.ALPHANUMERIC:return Math.floor(E/11*2);case n.KANJI:return Math.floor(E/13);case n.BYTE:default:return Math.floor(E/8)}},e.getBestVersionForData=function(p,g){let b;const v=s.from(g,s.M);if(Array.isArray(p)){if(p.length>1)return f(p,v);if(p.length===0)return 1;b=p[0]}else b=p;return c(b.mode,b.getLength(),v)},e.getEncodedBits=function(p){if(!i.isValid(p)||p<7)throw new Error("Invalid QR Code version");let g=p<<12;for(;t.getBCHDigit(g)-l>=0;)g^=o<<t.getBCHDigit(g)-l;return p<<12|g}})(Vt)),Vt}var Wt={},Es;function yo(){if(Es)return Wt;Es=1;const e=Ce(),t=1335,r=21522,s=e.getBCHDigit(t);return Wt.getEncodedBits=function(i,o){const l=i.bit<<3|o;let c=l<<10;for(;e.getBCHDigit(c)-s>=0;)c^=t<<e.getBCHDigit(c)-s;return(l<<10|c)^r},Wt}var $t={},Gt,xs;function vo(){if(xs)return Gt;xs=1;const e=Re();function t(r){this.mode=e.NUMERIC,this.data=r.toString()}return t.getBitsLength=function(s){return 10*Math.floor(s/3)+(s%3?s%3*3+1:0)},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(s){let n,i,o;for(n=0;n+3<=this.data.length;n+=3)i=this.data.substr(n,3),o=parseInt(i,10),s.put(o,10);const l=this.data.length-n;l>0&&(i=this.data.substr(n),o=parseInt(i,10),s.put(o,l*3+1))},Gt=t,Gt}var Jt,_s;function wo(){if(_s)return Jt;_s=1;const e=Re(),t=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function r(s){this.mode=e.ALPHANUMERIC,this.data=s}return r.getBitsLength=function(n){return 11*Math.floor(n/2)+6*(n%2)},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(n){let i;for(i=0;i+2<=this.data.length;i+=2){let o=t.indexOf(this.data[i])*45;o+=t.indexOf(this.data[i+1]),n.put(o,11)}this.data.length%2&&n.put(t.indexOf(this.data[i]),6)},Jt=r,Jt}var Yt,Ss;function Eo(){if(Ss)return Yt;Ss=1;const e=Re();function t(r){this.mode=e.BYTE,typeof r=="string"?this.data=new TextEncoder().encode(r):this.data=new Uint8Array(r)}return t.getBitsLength=function(s){return s*8},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(r){for(let s=0,n=this.data.length;s<n;s++)r.put(this.data[s],8)},Yt=t,Yt}var Kt,As;function xo(){if(As)return Kt;As=1;const e=Re(),t=Ce();function r(s){this.mode=e.KANJI,this.data=s}return r.getBitsLength=function(n){return n*13},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(s){let n;for(n=0;n<this.data.length;n++){let i=t.toSJIS(this.data[n]);if(i>=33088&&i<=40956)i-=33088;else if(i>=57408&&i<=60351)i-=49472;else throw new Error("Invalid SJIS character: "+this.data[n]+`
Make sure your charset is UTF-8`);i=(i>>>8&255)*192+(i&255),s.put(i,13)}},Kt=r,Kt}var Zt={exports:{}},Ts;function _o(){return Ts||(Ts=1,(function(e){var t={single_source_shortest_paths:function(r,s,n){var i={},o={};o[s]=0;var l=t.PriorityQueue.make();l.push(s,0);for(var c,u,a,f,d,p,g,b,v;!l.empty();){c=l.pop(),u=c.value,f=c.cost,d=r[u]||{};for(a in d)d.hasOwnProperty(a)&&(p=d[a],g=f+p,b=o[a],v=typeof o[a]>"u",(v||b>g)&&(o[a]=g,l.push(a,g),i[a]=u))}if(typeof n<"u"&&typeof o[n]>"u"){var h=["Could not find a path from ",s," to ",n,"."].join("");throw new Error(h)}return i},extract_shortest_path_from_predecessor_list:function(r,s){for(var n=[],i=s;i;)n.push(i),r[i],i=r[i];return n.reverse(),n},find_path:function(r,s,n){var i=t.single_source_shortest_paths(r,s,n);return t.extract_shortest_path_from_predecessor_list(i,n)},PriorityQueue:{make:function(r){var s=t.PriorityQueue,n={},i;r=r||{};for(i in s)s.hasOwnProperty(i)&&(n[i]=s[i]);return n.queue=[],n.sorter=r.sorter||s.default_sorter,n},default_sorter:function(r,s){return r.cost-s.cost},push:function(r,s){var n={value:r,cost:s};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};e.exports=t})(Zt)),Zt.exports}var Cs;function So(){return Cs||(Cs=1,(function(e){const t=Re(),r=vo(),s=wo(),n=Eo(),i=xo(),o=ri(),l=Ce(),c=_o();function u(h){return unescape(encodeURIComponent(h)).length}function a(h,y,E){const S=[];let L;for(;(L=h.exec(E))!==null;)S.push({data:L[0],index:L.index,mode:y,length:L[0].length});return S}function f(h){const y=a(o.NUMERIC,t.NUMERIC,h),E=a(o.ALPHANUMERIC,t.ALPHANUMERIC,h);let S,L;return l.isKanjiModeEnabled()?(S=a(o.BYTE,t.BYTE,h),L=a(o.KANJI,t.KANJI,h)):(S=a(o.BYTE_KANJI,t.BYTE,h),L=[]),y.concat(E,S,L).sort(function(m,_){return m.index-_.index}).map(function(m){return{data:m.data,mode:m.mode,length:m.length}})}function d(h,y){switch(y){case t.NUMERIC:return r.getBitsLength(h);case t.ALPHANUMERIC:return s.getBitsLength(h);case t.KANJI:return i.getBitsLength(h);case t.BYTE:return n.getBitsLength(h)}}function p(h){return h.reduce(function(y,E){const S=y.length-1>=0?y[y.length-1]:null;return S&&S.mode===E.mode?(y[y.length-1].data+=E.data,y):(y.push(E),y)},[])}function g(h){const y=[];for(let E=0;E<h.length;E++){const S=h[E];switch(S.mode){case t.NUMERIC:y.push([S,{data:S.data,mode:t.ALPHANUMERIC,length:S.length},{data:S.data,mode:t.BYTE,length:S.length}]);break;case t.ALPHANUMERIC:y.push([S,{data:S.data,mode:t.BYTE,length:S.length}]);break;case t.KANJI:y.push([S,{data:S.data,mode:t.BYTE,length:u(S.data)}]);break;case t.BYTE:y.push([{data:S.data,mode:t.BYTE,length:u(S.data)}])}}return y}function b(h,y){const E={},S={start:{}};let L=["start"];for(let A=0;A<h.length;A++){const m=h[A],_=[];for(let w=0;w<m.length;w++){const T=m[w],C=""+A+w;_.push(C),E[C]={node:T,lastCount:0},S[C]={};for(let I=0;I<L.length;I++){const x=L[I];E[x]&&E[x].node.mode===T.mode?(S[x][C]=d(E[x].lastCount+T.length,T.mode)-d(E[x].lastCount,T.mode),E[x].lastCount+=T.length):(E[x]&&(E[x].lastCount=T.length),S[x][C]=d(T.length,T.mode)+4+t.getCharCountIndicator(T.mode,y))}}L=_}for(let A=0;A<L.length;A++)S[L[A]].end=0;return{map:S,table:E}}function v(h,y){let E;const S=t.getBestModeForData(h);if(E=t.from(y,S),E!==t.BYTE&&E.bit<S.bit)throw new Error('"'+h+'" cannot be encoded with mode '+t.toString(E)+`.
 Suggested mode is: `+t.toString(S));switch(E===t.KANJI&&!l.isKanjiModeEnabled()&&(E=t.BYTE),E){case t.NUMERIC:return new r(h);case t.ALPHANUMERIC:return new s(h);case t.KANJI:return new i(h);case t.BYTE:return new n(h)}}e.fromArray=function(y){return y.reduce(function(E,S){return typeof S=="string"?E.push(v(S,null)):S.data&&E.push(v(S.data,S.mode)),E},[])},e.fromString=function(y,E){const S=f(y,l.isKanjiModeEnabled()),L=g(S),A=b(L,E),m=c.find_path(A.map,"start","end"),_=[];for(let w=1;w<m.length-1;w++)_.push(A.table[m[w]].node);return e.fromArray(p(_))},e.rawSplit=function(y){return e.fromArray(f(y,l.isKanjiModeEnabled()))}})($t)),$t}var Rs;function Ao(){if(Rs)return Dt;Rs=1;const e=Ce(),t=Qr(),r=lo(),s=co(),n=uo(),i=fo(),o=po(),l=ei(),c=go(),u=bo(),a=yo(),f=Re(),d=So();function p(A,m){const _=A.size,w=i.getPositions(m);for(let T=0;T<w.length;T++){const C=w[T][0],I=w[T][1];for(let x=-1;x<=7;x++)if(!(C+x<=-1||_<=C+x))for(let P=-1;P<=7;P++)I+P<=-1||_<=I+P||(x>=0&&x<=6&&(P===0||P===6)||P>=0&&P<=6&&(x===0||x===6)||x>=2&&x<=4&&P>=2&&P<=4?A.set(C+x,I+P,!0,!0):A.set(C+x,I+P,!1,!0))}}function g(A){const m=A.size;for(let _=8;_<m-8;_++){const w=_%2===0;A.set(_,6,w,!0),A.set(6,_,w,!0)}}function b(A,m){const _=n.getPositions(m);for(let w=0;w<_.length;w++){const T=_[w][0],C=_[w][1];for(let I=-2;I<=2;I++)for(let x=-2;x<=2;x++)I===-2||I===2||x===-2||x===2||I===0&&x===0?A.set(T+I,C+x,!0,!0):A.set(T+I,C+x,!1,!0)}}function v(A,m){const _=A.size,w=u.getEncodedBits(m);let T,C,I;for(let x=0;x<18;x++)T=Math.floor(x/3),C=x%3+_-8-3,I=(w>>x&1)===1,A.set(T,C,I,!0),A.set(C,T,I,!0)}function h(A,m,_){const w=A.size,T=a.getEncodedBits(m,_);let C,I;for(C=0;C<15;C++)I=(T>>C&1)===1,C<6?A.set(C,8,I,!0):C<8?A.set(C+1,8,I,!0):A.set(w-15+C,8,I,!0),C<8?A.set(8,w-C-1,I,!0):C<9?A.set(8,15-C-1+1,I,!0):A.set(8,15-C-1,I,!0);A.set(w-8,8,1,!0)}function y(A,m){const _=A.size;let w=-1,T=_-1,C=7,I=0;for(let x=_-1;x>0;x-=2)for(x===6&&x--;;){for(let P=0;P<2;P++)if(!A.isReserved(T,x-P)){let D=!1;I<m.length&&(D=(m[I]>>>C&1)===1),A.set(T,x-P,D),C--,C===-1&&(I++,C=7)}if(T+=w,T<0||_<=T){T-=w,w=-w;break}}}function E(A,m,_){const w=new r;_.forEach(function(P){w.put(P.mode.bit,4),w.put(P.getLength(),f.getCharCountIndicator(P.mode,A)),P.write(w)});const T=e.getSymbolTotalCodewords(A),C=l.getTotalCodewordsCount(A,m),I=(T-C)*8;for(w.getLengthInBits()+4<=I&&w.put(0,4);w.getLengthInBits()%8!==0;)w.putBit(0);const x=(I-w.getLengthInBits())/8;for(let P=0;P<x;P++)w.put(P%2?17:236,8);return S(w,A,m)}function S(A,m,_){const w=e.getSymbolTotalCodewords(m),T=l.getTotalCodewordsCount(m,_),C=w-T,I=l.getBlocksCount(m,_),x=w%I,P=I-x,D=Math.floor(w/I),M=Math.floor(C/I),F=M+1,z=D-M,At=new c(z);let Tt=0;const ot=new Array(I),Jr=new Array(I);let Ct=0;const gi=new Uint8Array(A.buffer);for(let Ie=0;Ie<I;Ie++){const Nt=Ie<P?M:F;ot[Ie]=gi.slice(Tt,Tt+Nt),Jr[Ie]=At.encode(ot[Ie]),Tt+=Nt,Ct=Math.max(Ct,Nt)}const Rt=new Uint8Array(w);let Yr=0,oe,ae;for(oe=0;oe<Ct;oe++)for(ae=0;ae<I;ae++)oe<ot[ae].length&&(Rt[Yr++]=ot[ae][oe]);for(oe=0;oe<z;oe++)for(ae=0;ae<I;ae++)Rt[Yr++]=Jr[ae][oe];return Rt}function L(A,m,_,w){let T;if(Array.isArray(A))T=d.fromArray(A);else if(typeof A=="string"){let D=m;if(!D){const M=d.rawSplit(A);D=u.getBestVersionForData(M,_)}T=d.fromString(A,D||40)}else throw new Error("Invalid data");const C=u.getBestVersionForData(T,_);if(!C)throw new Error("The amount of data is too big to be stored in a QR Code");if(!m)m=C;else if(m<C)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+C+`.
`);const I=E(m,_,T),x=e.getSymbolSize(m),P=new s(x);return p(P,m),g(P),b(P,m),h(P,_,0),m>=7&&v(P,m),y(P,I),isNaN(w)&&(w=o.getBestMask(P,h.bind(null,P,_))),o.applyMask(w,P),h(P,_,w),{modules:P,version:m,errorCorrectionLevel:_,maskPattern:w,segments:T}}return Dt.create=function(m,_){if(typeof m>"u"||m==="")throw new Error("No input text");let w=t.M,T,C;return typeof _<"u"&&(w=t.from(_.errorCorrectionLevel,t.M),T=u.from(_.version),C=o.from(_.maskPattern),_.toSJISFunc&&e.setToSJISFunction(_.toSJISFunc)),L(m,T,w,C)},Dt}var er={},tr={},Ns;function si(){return Ns||(Ns=1,(function(e){function t(r){if(typeof r=="number"&&(r=r.toString()),typeof r!="string")throw new Error("Color should be defined as hex string");let s=r.slice().replace("#","").split("");if(s.length<3||s.length===5||s.length>8)throw new Error("Invalid hex color: "+r);(s.length===3||s.length===4)&&(s=Array.prototype.concat.apply([],s.map(function(i){return[i,i]}))),s.length===6&&s.push("F","F");const n=parseInt(s.join(""),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:"#"+s.slice(0,6).join("")}}e.getOptions=function(s){s||(s={}),s.color||(s.color={});const n=typeof s.margin>"u"||s.margin===null||s.margin<0?4:s.margin,i=s.width&&s.width>=21?s.width:void 0,o=s.scale||4;return{width:i,scale:i?4:o,margin:n,color:{dark:t(s.color.dark||"#000000ff"),light:t(s.color.light||"#ffffffff")},type:s.type,rendererOpts:s.rendererOpts||{}}},e.getScale=function(s,n){return n.width&&n.width>=s+n.margin*2?n.width/(s+n.margin*2):n.scale},e.getImageWidth=function(s,n){const i=e.getScale(s,n);return Math.floor((s+n.margin*2)*i)},e.qrToImageData=function(s,n,i){const o=n.modules.size,l=n.modules.data,c=e.getScale(o,i),u=Math.floor((o+i.margin*2)*c),a=i.margin*c,f=[i.color.light,i.color.dark];for(let d=0;d<u;d++)for(let p=0;p<u;p++){let g=(d*u+p)*4,b=i.color.light;if(d>=a&&p>=a&&d<u-a&&p<u-a){const v=Math.floor((d-a)/c),h=Math.floor((p-a)/c);b=f[l[v*o+h]?1:0]}s[g++]=b.r,s[g++]=b.g,s[g++]=b.b,s[g]=b.a}}})(tr)),tr}var Is;function To(){return Is||(Is=1,(function(e){const t=si();function r(n,i,o){n.clearRect(0,0,i.width,i.height),i.style||(i.style={}),i.height=o,i.width=o,i.style.height=o+"px",i.style.width=o+"px"}function s(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(i,o,l){let c=l,u=o;typeof c>"u"&&(!o||!o.getContext)&&(c=o,o=void 0),o||(u=s()),c=t.getOptions(c);const a=t.getImageWidth(i.modules.size,c),f=u.getContext("2d"),d=f.createImageData(a,a);return t.qrToImageData(d.data,i,c),r(f,u,a),f.putImageData(d,0,0),u},e.renderToDataURL=function(i,o,l){let c=l;typeof c>"u"&&(!o||!o.getContext)&&(c=o,o=void 0),c||(c={});const u=e.render(i,o,c),a=c.type||"image/png",f=c.rendererOpts||{};return u.toDataURL(a,f.quality)}})(er)),er}var rr={},Ps;function Co(){if(Ps)return rr;Ps=1;const e=si();function t(n,i){const o=n.a/255,l=i+'="'+n.hex+'"';return o<1?l+" "+i+'-opacity="'+o.toFixed(2).slice(1)+'"':l}function r(n,i,o){let l=n+i;return typeof o<"u"&&(l+=" "+o),l}function s(n,i,o){let l="",c=0,u=!1,a=0;for(let f=0;f<n.length;f++){const d=Math.floor(f%i),p=Math.floor(f/i);!d&&!u&&(u=!0),n[f]?(a++,f>0&&d>0&&n[f-1]||(l+=u?r("M",d+o,.5+p+o):r("m",c,0),c=0,u=!1),d+1<i&&n[f+1]||(l+=r("h",a),a=0)):c++}return l}return rr.render=function(i,o,l){const c=e.getOptions(o),u=i.modules.size,a=i.modules.data,f=u+c.margin*2,d=c.color.light.a?"<path "+t(c.color.light,"fill")+' d="M0 0h'+f+"v"+f+'H0z"/>':"",p="<path "+t(c.color.dark,"stroke")+' d="'+s(a,u,c.margin)+'"/>',g='viewBox="0 0 '+f+" "+f+'"',v='<svg xmlns="http://www.w3.org/2000/svg" '+(c.width?'width="'+c.width+'" height="'+c.width+'" ':"")+g+' shape-rendering="crispEdges">'+d+p+`</svg>
`;return typeof l=="function"&&l(null,v),v},rr}var Os;function Ro(){if(Os)return Oe;Os=1;const e=ao(),t=Ao(),r=To(),s=Co();function n(i,o,l,c,u){const a=[].slice.call(arguments,1),f=a.length,d=typeof a[f-1]=="function";if(!d&&!e())throw new Error("Callback required as last argument");if(d){if(f<2)throw new Error("Too few arguments provided");f===2?(u=l,l=o,o=c=void 0):f===3&&(o.getContext&&typeof u>"u"?(u=c,c=void 0):(u=c,c=l,l=o,o=void 0))}else{if(f<1)throw new Error("Too few arguments provided");return f===1?(l=o,o=c=void 0):f===2&&!o.getContext&&(c=l,l=o,o=void 0),new Promise(function(p,g){try{const b=t.create(l,c);p(i(b,o,c))}catch(b){g(b)}})}try{const p=t.create(l,c);u(null,i(p,o,c))}catch(p){u(p)}}return Oe.create=t.create,Oe.toCanvas=n.bind(null,r.render),Oe.toDataURL=n.bind(null,r.renderToDataURL),Oe.toString=n.bind(null,function(i,o,l){return s.render(i,l)}),Oe}var No=Ro();const Io=Zn(No),N=new Kn,sr=new Map,nr=new Map,ir=new Map,or=new Map;function O(e){const t=e.env.DATABASE_CCT;if(!t)throw new Error("DATABASE_CCT não configurado nas variáveis de ambiente");return new wt(t)}function ni(e){const t=e.env.DATABASE_URL_CREDITOS||e.env.DATABASE_SUITEPLUS;if(!t)throw new Error("DATABASE_URL_CREDITOS não configurado");return new wt(t)}async function ii(e){const t=e.connectionString||"credits";sr.has(t)||sr.set(t,(async()=>{await e.sql(`
        CREATE TABLE IF NOT EXISTS users_credits (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL UNIQUE,
          credits_balance INTEGER NOT NULL DEFAULT 0,
          total_credits_used INTEGER NOT NULL DEFAULT 0,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `),await e.sql("CREATE INDEX IF NOT EXISTS idx_users_credits_email ON users_credits(lower(user_email))")})()),await sr.get(t)}async function Fr(e,t){await ii(e);const r=await e.sql("SELECT credits_balance FROM users_credits WHERE lower(user_email) = lower($1)",[t]);return r.length>0?parseInt(r[0].credits_balance):0}async function Po(e,t,r){return await ii(e),(await e.sql(`UPDATE users_credits
     SET credits_balance = credits_balance - $1,
         total_credits_used = COALESCE(total_credits_used, 0) + $1,
         updated_at = NOW()
     WHERE lower(user_email) = lower($2)
       AND credits_balance >= $1
     RETURNING credits_balance`,[r,t])).length>0}async function Xr(e){const t=e.connectionString||"lesson-rentals";nr.has(t)||nr.set(t,(async()=>{await e.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS rentable BOOLEAN DEFAULT FALSE"),await e.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS rental_credits INTEGER DEFAULT 0"),await e.sql(`
        CREATE TABLE IF NOT EXISTS lesson_rentals (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          lesson_id INTEGER NOT NULL,
          credits_paid INTEGER NOT NULL,
          rented_at TIMESTAMPTZ DEFAULT NOW(),
          expires_at TIMESTAMPTZ NOT NULL,
          UNIQUE(user_email, lesson_id)
        )
      `),await e.sql("CREATE INDEX IF NOT EXISTS idx_lesson_rentals_email ON lesson_rentals(user_email)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_lesson_rentals_lesson ON lesson_rentals(lesson_id)")})()),await nr.get(t)}async function Et(e){const t=e.connectionString||"comments-replies";ir.has(t)||ir.set(t,(async()=>{await e.sql("ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_reply TEXT"),await e.sql("ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_replied_at TIMESTAMPTZ"),await e.sql("ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_replied_by TEXT"),await e.sql("CREATE INDEX IF NOT EXISTS idx_comments_admin_replied_at ON comments(admin_replied_at)")})()),await ir.get(t)}async function ie(e){const t=e.connectionString||"question-bank";or.has(t)||or.set(t,(async()=>{await e.sql(`
        CREATE TABLE IF NOT EXISTS question_bank (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255),
          statement_html TEXT NOT NULL DEFAULT '',
          question_type VARCHAR(32) NOT NULL DEFAULT 'multiple_choice',
          alternatives JSONB NOT NULL DEFAULT '[]'::jsonb,
          answer_key JSONB NOT NULL DEFAULT '{}'::jsonb,
          technical_comment_html TEXT,
          difficulty VARCHAR(32) NOT NULL DEFAULT 'medio',
          theme VARCHAR(160),
          subtheme VARCHAR(160),
          legal_basis TEXT,
          weight NUMERIC(8,2) NOT NULL DEFAULT 1,
          estimated_minutes INTEGER NOT NULL DEFAULT 5,
          tags JSONB NOT NULL DEFAULT '[]'::jsonb,
          status VARCHAR(32) NOT NULL DEFAULT 'draft',
          professor VARCHAR(160),
          course_id INTEGER,
          lesson_id INTEGER,
          source_transcript TEXT,
          ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
          version INTEGER NOT NULL DEFAULT 1,
          order_index INTEGER NOT NULL DEFAULT 0,
          usage_count INTEGER NOT NULL DEFAULT 0,
          attempts_count INTEGER NOT NULL DEFAULT 0,
          correct_count INTEGER NOT NULL DEFAULT 0,
          wrong_count INTEGER NOT NULL DEFAULT 0,
          created_by VARCHAR(255),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `),await e.sql(`
        CREATE TABLE IF NOT EXISTS question_bank_versions (
          id SERIAL PRIMARY KEY,
          question_id INTEGER NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
          version INTEGER NOT NULL,
          snapshot JSONB NOT NULL,
          changed_by VARCHAR(255),
          change_note TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `),await e.sql(`
        CREATE TABLE IF NOT EXISTS question_bank_exam_items (
          id SERIAL PRIMARY KEY,
          question_id INTEGER NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
          exam_title VARCHAR(255),
          used_at TIMESTAMPTZ DEFAULT NOW()
        )
      `),await e.sql("CREATE INDEX IF NOT EXISTS idx_question_bank_status ON question_bank(status)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_question_bank_type ON question_bank(question_type)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_question_bank_theme ON question_bank(theme)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_question_bank_course ON question_bank(course_id)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_question_versions_question ON question_bank_versions(question_id)")})()),await or.get(t)}async function xt(e,t){try{const s=await new wt(t).sql(`SELECT expires_at FROM user_subscriptions
       WHERE user_email = $1 AND product_id = 4 AND status = 'active'
       ORDER BY expires_at DESC LIMIT 1`,[e.toLowerCase()]);return s.length>0&&s[0].expires_at?new Date(s[0].expires_at):null}catch(r){return console.error("⚠️ Suiteplus subscription check failed:",r.message),null}}N.use("/api/*",eo());N.get("/health",e=>{const t=!!e.env.SUPABASE_URL,r=!!e.env.SUPABASE_ANON_KEY;return e.json({status:"ok",timestamp:new Date().toISOString(),environment:{supabase_url:t?"✅ Configured":"❌ Missing",supabase_key:r?"✅ Configured":"❌ Missing"}})});async function J(e,t,r){try{if(e.startsWith("IMPERSONATE:")){const n=JSON.parse(Buffer.from(e.replace("IMPERSONATE:",""),"base64").toString("utf-8")),i=Buffer.from(`${n.email}:${r}`).toString("base64");return n.signature!==i?(console.error("❌ Invalid impersonation token signature"),null):Date.now()-new Date(n.impersonated_at).getTime()>1440*60*1e3?(console.error("❌ Impersonation token expired"),null):(console.log(`🎭 Using impersonation token for ${n.email}`),{email:n.email,user_metadata:{name:n.nome},id:n.user_id,impersonated:!0})}const s=await fetch(`${t}/auth/v1/user`,{headers:{Authorization:`Bearer ${e}`,apikey:r}});return s.ok?await s.json():null}catch(s){return console.error("Token verification error:",s),null}}async function Y(e,t){const r=$(e,"sb-access-token");if(!r)return e.json({error:"Unauthorized"},401);const s=await J(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!s)return e.json({error:"Invalid token"},401);e.set("user",s),await t()}N.get("/api/user/credits",Y,async e=>{try{const t=e.get("user");if(!(e.env.DATABASE_URL_CREDITOS||e.env.DATABASE_SUITEPLUS))return console.warn("Credits DB not configured — returning 0"),e.json({success:!0,credits:0,unavailable:!0});const s=ni(e),n=await Fr(s,t.email);return e.json({success:!0,credits:n})}catch(t){return console.error("Get credits error:",t),e.json({success:!0,credits:0,unavailable:!0})}});N.post("/api/auth/login",async e=>{try{const t=await e.req.json(),{email:r,password:s}=t;if(console.log("🔐 Login attempt:",{email:r,hasPassword:!!s}),console.log("🌐 Supabase URL:",e.env.SUPABASE_URL),console.log("🔑 Supabase Key present:",!!e.env.SUPABASE_ANON_KEY),!r||!s)return console.error("❌ Missing email or password"),e.json({error:"Email e senha são obrigatórios"},400);const n=await fetch(`${e.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:r,password:s})}),i=await n.json();return console.log("📨 Supabase response:",{status:n.status,ok:n.ok}),n.ok?(console.log("✅ Login successful for:",r),se(e,"sb-access-token",i.access_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),se(e,"sb-refresh-token",i.refresh_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0,user:i.user})):(console.error("❌ Login failed:",i),e.json({error:i.error_description||i.message||"Login failed"},400))}catch{return e.json({error:"Login failed"},500)}});N.post("/api/auth/register",async e=>{try{const{email:t,password:r,name:s}=await e.req.json();if(!t||!r||!s)return e.json({error:"Nome, email e senha são obrigatórios"},400);const n=await fetch(`${e.env.SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:t,password:r,data:{name:s}})}),i=await n.json();if(!n.ok){const o=i.error_description||i.message||i.msg||i.error||"Registration failed";return console.error("❌ Supabase signup failed:",{status:n.status,error:o,raw:i}),e.json({error:o},n.status)}try{await O(e).insert("users",{email:t,nome:s,ativo:!0,teste_gratis:!1}),console.log("✅ User record created in users table:",t)}catch(o){console.error("❌ Failed to create user record:",o)}return e.json({success:!0,message:"Registration successful. Please check your email to confirm.",user:i.user})}catch{return e.json({error:"Registration failed"},500)}});N.post("/api/auth/logout",async e=>(gt(e,"sb-access-token"),gt(e,"sb-refresh-token"),e.json({success:!0})));N.get("/api/auth/me",async e=>{var s;const t=$(e,"sb-access-token");if(!t)return e.json({user:null});try{if((s=JSON.parse(atob(t.split(".")[1])).amr)==null?void 0:s.some(o=>o.method==="otp"))return gt(e,"sb-access-token"),gt(e,"sb-refresh-token"),e.json({user:null,error:"password_reset_required",message:"Por favor, redefina sua senha antes de fazer login"},401)}catch{}const r=await J(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);return e.json({user:r})});N.get("/api/user/profile",async e=>{var t;try{const r=$(e,"sb-access-token");if(!r)return e.json({error:"Não autenticado"},401);const s=await J(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!s)return e.json({error:"Usuário não encontrado"},404);const n=O(e),i=await n.query("users",{select:"*",filters:{email:s.email},single:!0});if(!i){await n.insert("users",{email:s.email,nome:((t=s.user_metadata)==null?void 0:t.name)||"",ativo:!0,teste_gratis:!1});const o=await n.query("users",{select:"*",filters:{email:s.email},single:!0});return e.json({profile:o})}return e.json({profile:i})}catch(r){return console.error("Error fetching user profile:",r),e.json({error:"Erro ao buscar perfil"},500)}});N.put("/api/user/profile",async e=>{try{const t=$(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const r=await J(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({error:"Usuário não encontrado"},404);const{nome:s,first_name:n,last_name:i,cpf:o,telefone:l,whatsapp:c,end_cep:u,end_logradouro:a,end_numero:f,end_cidade:d,end_estado:p}=await e.req.json();return await O(e).update("users",{email:r.email},{nome:s||null,first_name:n||null,last_name:i||null,cpf:o||null,telefone:l||null,whatsapp:c||null,end_cep:u||null,end_logradouro:a||null,end_numero:f||null,end_cidade:d||null,end_estado:p||null,updated_at:new Date().toISOString()}),s&&await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({data:{name:s.trim()}})}),e.json({success:!0,message:"Perfil atualizado com sucesso!"})}catch(t){return console.error("Error updating user profile:",t),e.json({error:"Erro ao atualizar perfil"},500)}});N.put("/api/auth/profile",async e=>{try{const t=$(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const{name:r}=await e.req.json();if(console.log("👤 Profile update attempt"),console.log("   Name:",r),!r||r.trim().length===0)return console.error("❌ Missing name"),e.json({error:"Nome é obrigatório"},400);const s=await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({data:{name:r.trim()}})});if(console.log("📨 Supabase response:",{status:s.status,ok:s.ok}),!s.ok){const i=await s.json();return console.error("❌ Profile update failed:",i),e.json({error:i.error_description||i.message||"Falha ao atualizar perfil"},400)}const n=await s.json();return console.log("✅ Profile updated successfully"),e.json({success:!0,user:n,message:"Perfil atualizado com sucesso!"})}catch(t){return console.error("💥 Profile update error:",t),e.json({error:"Erro ao atualizar perfil"},500)}});N.post("/api/auth/change-password",async e=>{try{const t=$(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const{currentPassword:r,newPassword:s}=await e.req.json();if(console.log("🔐 Password change attempt"),console.log("   Has current password:",!!r),console.log("   New password length:",s==null?void 0:s.length),!r||!s)return console.error("❌ Missing passwords"),e.json({error:"Senha atual e nova senha são obrigatórias"},400);if(s.length<6)return console.error("❌ Password too short"),e.json({error:"A nova senha deve ter pelo menos 6 caracteres"},400);const n=await J(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!n||!n.email)return e.json({error:"Usuário não encontrado"},401);if(!(await fetch(`${e.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:n.email,password:r})})).ok)return console.error("❌ Current password is incorrect"),e.json({error:"Senha atual incorreta"},400);console.log("✅ Current password verified");const o=await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({password:s})});if(console.log("📨 Supabase response:",{status:o.status,ok:o.ok}),!o.ok){const c=await o.json();console.error("❌ Password change failed:",c);let u="Falha ao alterar senha";return c.error_code==="same_password"?u="A nova senha deve ser diferente da senha atual":c.msg?u=c.msg:c.error_description&&(u=c.error_description),e.json({error:u},400)}const l=await o.json();return console.log("✅ Password changed successfully"),l.access_token&&se(e,"sb-access-token",l.access_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),l.refresh_token&&se(e,"sb-refresh-token",l.refresh_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0,message:"Senha alterada com sucesso!"})}catch(t){return console.error("💥 Password change error:",t),e.json({error:"Erro ao alterar senha"},500)}});N.get("/api/user/access-status",Y,async e=>{var t;try{const s=e.get("user").email;if(!s)return e.json({error:"Email do usuário não encontrado"},400);const n=O(e);let i="SEM_ACESSO";try{const a=await n.rpc("user_tipo_acesso",{email_usuario:s});console.log("🔍 Access type result for",s,":",a),typeof a=="string"?i=a:Array.isArray(a)&&a.length>0?i=a[0].user_tipo_acesso||a[0]:a&&typeof a=="object"&&(i=a.user_tipo_acesso)}catch(a){console.log("⚠️ user_tipo_acesso RPC error, will fallback to member_subscriptions:",a==null?void 0:a.message)}console.log("🔍 RPC accessType:",i);const o=await n.query("member_subscriptions",{select:"data_expiracao, teste_gratis, detalhe",filters:{email_membro:s,ativo:!0},order:"data_expiracao.desc",limit:1});let l=null,c=null;if(o&&o.length>0){const a=o[0];new Date(a.data_expiracao)>new Date&&(l=a.data_expiracao,c=a.detalhe,i==="SEM_ACESSO"&&(i="COMPLETO"))}const u=e.env.DATABASE_SUITEPLUS;if(u){const a=await xt(s,u);a&&a>new Date&&(i==="SEM_ACESSO"&&(i="COMPLETO"),(!l||a>new Date(l))&&(l=a.toISOString()))}return console.log("✅ Final accessType for",s,":",i),e.json({email:s,accessType:i,hasActiveSubscription:i!=="SEM_ACESSO",hasFullAccess:i==="COMPLETO",expirationDate:l,subscriptionDetail:c})}catch(r){return console.error("Error loading access status:",(r==null?void 0:r.message)||r),e.json({email:((t=e.get("user"))==null?void 0:t.email)||"",accessType:"SEM_ACESSO",hasActiveSubscription:!1,hasFullAccess:!1,expirationDate:null,subscriptionDetail:null},200)}});N.get("/api/user/subscriptions",Y,async e=>{try{const r=e.get("user").email;if(!r)return e.json({error:"Email do usuário não encontrado"},400);const n=await O(e).query("member_subscriptions",{select:"*",filters:{email_membro:r},order:"data_expiracao.desc"}),i=e.env.DATABASE_SUITEPLUS;if(i&&n&&n.length>0){const o=await xt(r,i);if(o)for(const l of n){const c=new Date(l.data_expiracao);o>c&&(l.data_expiracao=o.toISOString())}}return e.json({subscriptions:n||[],total:(n==null?void 0:n.length)||0})}catch(t){return console.error("Error loading subscriptions:",t),e.json({error:t.message||"Erro ao carregar assinaturas"},500)}});N.get("/auth/callback*",async e=>{var r;const t=e.req.path;if(t.includes("%20")||t.includes(" ")){const s=t.split(/(%20| )/)[0],n=e.req.url.split("#")[1],i=(r=e.req.url.split("?")[1])==null?void 0:r.split("#")[0];let o=s;return i&&(o+="?"+i),n&&(o+="#"+n),e.redirect(o)}return await Oo(e)});async function Oo(e){var o,l,c,u,a,f;const t=new URL(e.req.url),r=t.searchParams.get("error_code")||((o=t.hash.match(/error_code=([^&]+)/))==null?void 0:o[1]);if(t.searchParams.get("error_description")||((l=t.hash.match(/error_description=([^&]+)/))==null||l[1]),r)return r==="otp_expired"?e.html(`
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
      `):e.redirect(`/?error=${r}`);const s=t.searchParams.get("access_token")||((c=t.hash.match(/access_token=([^&]+)/))==null?void 0:c[1]),n=t.searchParams.get("refresh_token")||((u=t.hash.match(/refresh_token=([^&]+)/))==null?void 0:u[1]),i=t.searchParams.get("type")||((a=t.hash.match(/type=([^&]+)/))==null?void 0:a[1]);if(!s)return e.redirect("/?error=no_token");try{const p=(f=JSON.parse(atob(s.split(".")[1])).amr)==null?void 0:f.some(g=>g.method==="otp");if(i==="recovery"||p)return e.redirect(`/reset-password#access_token=${s}&refresh_token=${n||""}&type=recovery`)}catch{if(i==="recovery")return e.redirect(`/reset-password#access_token=${s}&refresh_token=${n||""}&type=recovery`)}return se(e,"sb-access-token",s,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),n&&se(e,"sb-refresh-token",n,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.redirect("/?auth=success")}N.post("/api/auth/callback",async e=>{try{const{access_token:t,refresh_token:r}=await e.req.json();return t?(se(e,"sb-access-token",t,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),r&&se(e,"sb-refresh-token",r,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0})):e.json({error:"No access token"},400)}catch{return e.json({error:"Callback failed"},500)}});N.post("/api/auth/forgot-password",async e=>{try{const{email:t}=await e.req.json();if(!t)return e.json({error:"Email is required"},400);const r=e.req.header("host")||"localhost:3000",n=`${r.includes("localhost")?"http":"https"}://${r}/auth/callback`,i=await fetch(`${e.env.SUPABASE_URL}/auth/v1/recover`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:t,options:{redirectTo:n}})});if(i.ok)return e.json({success:!0,message:"Se o email estiver cadastrado, você receberá um link de recuperação. O link é válido por 1 hora."});const o=await i.json();return e.json({error:o.error_description||"Failed to send reset email"},400)}catch{return e.json({error:"Failed to process request"},500)}});N.post("/api/auth/reset-password",async e=>{try{const t=await e.req.json(),{token:r,password:s}=t;if(console.log("🔐 Password reset attempt"),console.log("   Token present:",!!r),console.log("   Token length:",r==null?void 0:r.length),console.log("   Password length:",s==null?void 0:s.length),!r||!s)return console.error("❌ Missing token or password"),e.json({error:"Token e senha são obrigatórios"},400);if(s.length<6)return console.error("❌ Password too short"),e.json({error:"A senha deve ter pelo menos 6 caracteres"},400);console.log("📨 Calling Supabase to update password...");const n=await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({password:s})});if(console.log("📨 Supabase response:",{status:n.status,ok:n.ok}),!n.ok){const o=await n.json();console.error("❌ Password reset failed:",o);let l="Falha ao redefinir senha";return o.error_code==="same_password"?l="A nova senha deve ser diferente da senha atual":o.msg?l=o.msg:o.error_description?l=o.error_description:o.message&&(l=o.message),e.json({error:l},400)}const i=await n.json();return console.log("✅ Password reset successful"),i.access_token&&se(e,"sb-access-token",i.access_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),i.refresh_token&&se(e,"sb-refresh-token",i.refresh_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0,message:"Senha alterada com sucesso!"})}catch{return e.json({error:"Failed to reset password"},500)}});async function Wr(e,t,r,s){try{return await new io(t,r).query("users",{select:"id, email, isadmin",filters:{email:e,isadmin:!0},single:!0},s)!==null}catch(n){return console.error("Error checking admin access in Supabase users:",n),!1}}async function q(e,t){const r=$(e,"sb-access-token");if(!r)return e.json({error:"Unauthorized"},401);const s=await J(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!s)return e.json({error:"Invalid token"},401);if(!await Wr(s.email,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY,r))return e.json({error:"Forbidden - Admin only"},403);e.set("user",s),await t()}N.get("/api/admin/check",async e=>{const t=$(e,"sb-access-token");if(!t)return e.json({isAdmin:!1});const r=await J(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({isAdmin:!1});const s=await Wr(r.email,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY,t);return e.json({isAdmin:s})});N.post("/api/admin/impersonate",q,async e=>{try{const{user_email:t}=await e.req.json();if(!t)return e.json({error:"user_email is required"},400);console.log(`🎭 Admin impersonating user: ${t}`);const r=O(e);let s=await r.sql("SELECT id, email, nome FROM users WHERE lower(email) = lower($1) LIMIT 1",[t]);if((!s||s.length===0)&&(s=await r.sql(`SELECT NULL::integer AS id, email_membro AS email, NULL::text AS nome
         FROM member_subscriptions
         WHERE lower(email_membro) = lower($1)
         ORDER BY data_expiracao DESC NULLS LAST
         LIMIT 1`,[t])),!s||s.length===0)return e.json({error:"User not found"},404);const n=s[0],i={email:t,nome:n.nome||"Usuário",impersonated:!0,impersonated_at:new Date().toISOString(),user_id:n.id,signature:Buffer.from(`${t}:${e.env.SUPABASE_ANON_KEY}`).toString("base64")},o=`IMPERSONATE:${Buffer.from(JSON.stringify(i)).toString("base64")}`;return console.log(`✅ Impersonation token created for ${t}`),e.json({token:o,user_email:t,user_name:n.nome})}catch(t){return console.error("Impersonation error:",t),e.json({error:t.message||"Failed to impersonate user"},500)}});N.post("/api/admin/courses",q,async e=>{try{const{title:t,description:r,duration_hours:s,instructor:n,offers_certificate:i,is_published:o}=await e.req.json(),c=await O(e).insert("courses",{title:t,description:r||null,duration_hours:s||0,instructor:n||"Vicelmo",offers_certificate:i!==void 0?i:!0,is_published:o!==void 0?o:!0});return e.json({success:!0,course_id:c[0].id})}catch(t){return console.error("Create course error:",t),e.json({error:t.message||"Failed to create course"},500)}});N.put("/api/admin/courses/:id",q,async e=>{try{const t=e.req.param("id"),{title:r,description:s,duration_hours:n,instructor:i,offers_certificate:o,is_published:l}=await e.req.json();return await O(e).update("courses",{id:t},{title:r,description:s||null,duration_hours:n||0,instructor:i||"Vicelmo",offers_certificate:o!==void 0?o:!0,is_published:l!==void 0?l:!0}),e.json({success:!0})}catch{return e.json({error:"Failed to update course"},500)}});N.delete("/api/admin/courses/:id",q,async e=>{try{const t=e.req.param("id");return await O(e).delete("courses",{id:t}),e.json({success:!0})}catch{return e.json({error:"Failed to delete course"},500)}});N.get("/api/admin/courses/find",q,async e=>{try{const t=e.req.query("title");if(!t)return e.json({error:"Title is required"},400);const s=await O(e).query("courses",{select:"*",filters:{title:t},limit:1});return s&&s.length>0?e.json({course:s[0]}):e.json({course:null})}catch(t){return console.error("Find course error:",t),e.json({error:t.message||"Failed to find course"},500)}});N.post("/api/admin/modules",q,async e=>{try{const{course_id:t,title:r,description:s,order_index:n}=await e.req.json(),o=await O(e).insert("modules",{course_id:t,title:r,description:s||null,order_index:n||0});return e.json({success:!0,module_id:o[0].id})}catch(t){return console.error("Create module error:",t),e.json({error:t.message||"Failed to create module"},500)}});N.post("/api/admin/modules-reorder",q,async e=>{try{const{modules:t}=await e.req.json();if(!Array.isArray(t))return e.json({error:"modules must be an array"},400);const r=O(e);for(const{id:s,order_index:n}of t)await r.update("modules",{id:Number(s)},{order_index:Number(n)});return e.json({success:!0})}catch(t){return console.error("Reorder modules error:",t),e.json({error:t.message||"Failed to reorder modules"},500)}});N.put("/api/admin/modules/:id",q,async e=>{try{const t=e.req.param("id"),{title:r,description:s,order_index:n}=await e.req.json();return await O(e).update("modules",{id:t},{title:r,description:s||null,order_index:n}),e.json({success:!0})}catch{return e.json({error:"Failed to update module"},500)}});N.delete("/api/admin/modules/:id",q,async e=>{try{const t=e.req.param("id");return await O(e).delete("modules",{id:t}),e.json({success:!0})}catch{return e.json({error:"Failed to delete module"},500)}});N.get("/api/admin/modules/find",q,async e=>{try{const t=e.req.query("course_id"),r=e.req.query("title");if(!t||!r)return e.json({error:"course_id and title are required"},400);const n=await O(e).query("modules",{select:"*",filters:{course_id:t,title:r},limit:1});return n&&n.length>0?e.json({module:n[0]}):e.json({module:null})}catch(t){return console.error("Find module error:",t),e.json({error:t.message||"Failed to find module"},500)}});N.post("/api/admin/lessons",q,async e=>{try{const{module_id:t,title:r,description:s,video_provider:n,video_id:i,duration_minutes:o,order_index:l,free_trial:c,support_text:u,transcript:a,attachments:f,rentable:d,rental_credits:p}=await e.req.json();let g=null;n&&i&&(n==="youtube"?g=`https://www.youtube.com/watch?v=${i}`:n==="vimeo"?g=`https://vimeo.com/${i}`:g=i);const v=await O(e).insert("lessons",{module_id:t,title:r,description:s||null,video_url:g,video_provider:n||null,video_id:i||null,duration_minutes:o||0,order_index:l||0,teste_gratis:c||!1,support_text:u||null,transcript:a||null,attachments:JSON.stringify(f||[]),rentable:d||!1,rental_credits:p||0});return e.json({success:!0,lesson_id:v[0].id})}catch(t){return console.error("Create lesson error:",t),e.json({error:t.message||"Failed to create lesson"},500)}});N.post("/api/admin/lessons-reorder",q,async e=>{try{const{lessons:t}=await e.req.json();if(!Array.isArray(t))return e.json({error:"lessons must be an array"},400);const r=O(e);for(const{id:s,order_index:n}of t)await r.update("lessons",{id:Number(s)},{order_index:Number(n)});return e.json({success:!0})}catch(t){return console.error("Reorder lessons error:",t),e.json({error:t.message||"Failed to reorder lessons"},500)}});N.put("/api/admin/lessons/:id",q,async e=>{try{const t=e.req.param("id"),{title:r,description:s,video_provider:n,video_id:i,duration_minutes:o,order_index:l,free_trial:c,support_text:u,transcript:a,attachments:f,rentable:d,rental_credits:p}=await e.req.json();let g=null;n&&i&&(n==="youtube"?g=`https://www.youtube.com/watch?v=${i}`:n==="vimeo"?g=`https://vimeo.com/${i}`:g=i);const b=O(e),v=parseInt(t);await b.update("lessons",{id:v},{title:r,description:s||null,video_url:g,video_provider:n||null,video_id:i||null,duration_minutes:parseInt(o)||0,order_index:parseInt(l)||0,teste_gratis:c===!0||c==="true"});try{await b.sql("UPDATE lessons SET support_text = $1, transcript = $2, attachments = $3::jsonb WHERE id = $4",[u||null,a||null,JSON.stringify(f||[]),v])}catch(h){console.warn("support_text/transcript/attachments columns may not exist:",h.message)}return await b.sql("UPDATE lessons SET rentable = $1, rental_credits = $2 WHERE id = $3",[d===!0||d==="true",parseInt(p)||0,v]),e.json({success:!0})}catch(t){return console.error("Update lesson error:",t),e.json({error:t.message||"Failed to update lesson"},500)}});N.post("/api/admin/lessons/:id/generate-transcript",q,async e=>{var t,r,s;try{const n=parseInt(e.req.param("id")),{context:i}=await e.req.json(),l=await O(e).sql("SELECT title, transcript FROM lessons WHERE id = $1",[n]);if(!l.length)return e.json({error:"Aula não encontrada"},404);const c=l[0];if(!c.transcript)return e.json({error:"Esta aula não possui transcrição para estruturar."},400);const u=e.env.VITE_OPENROUTER_API_KEY;if(!u)return e.json({error:"VITE_OPENROUTER_API_KEY não configurada no ambiente"},500);const a="Você é um especialista em direito trabalhista, liquidação de sentença judicial e uso do software PJe-Calc. Sua tarefa é pegar transcrições brutas de aulas e organizá-las em Markdown estruturado, claro e didático.",f=`Abaixo está a transcrição bruta de uma aula chamada "${c.title}".${i?`

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
---`,d=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`,"HTTP-Referer":"https://cct2026.com.br","X-Title":"CCT2026 Admin"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"system",content:a},{role:"user",content:f}]})});if(!d.ok){const b=await d.text();return e.json({error:`Erro na API OpenRouter: ${b}`},500)}const g=((s=(r=(t=(await d.json()).choices)==null?void 0:t[0])==null?void 0:r.message)==null?void 0:s.content)||"";return e.json({transcript:g})}catch(n){return console.error("Generate transcript error:",n),e.json({error:n.message||"Erro ao gerar transcrição"},500)}});N.post("/api/admin/structure-transcript",q,async e=>{var t,r,s;try{const{title:n,transcript:i,context:o}=await e.req.json();if(!(i!=null&&i.trim()))return e.json({error:"Transcrição vazia"},400);const l=e.env.VITE_OPENROUTER_API_KEY;if(!l)return e.json({error:"VITE_OPENROUTER_API_KEY não configurada"},500);const c="Você é um especialista em direito trabalhista, liquidação de sentença judicial e uso do software PJe-Calc. Sua tarefa é pegar transcrições brutas de aulas e organizá-las em Markdown estruturado, claro e didático.",u=`Abaixo está a transcrição bruta de uma aula${n?` chamada "${n}"`:""}.${o?`

Instruções adicionais: ${o}`:""}

Organize essa transcrição em Markdown estruturado, sem inventar conteúdo:
- Título principal com #
- Tópicos e subtópicos com ## e ###
- Conceitos importantes em **negrito**
- > Blockquote para destaques e alertas
- Listas com - quando houver enumerações
- Um ## Resumo ao final com os pontos principais

Transcrição bruta:
---
${i}
---`,a=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${l}`,"HTTP-Referer":"https://cct2026.com.br","X-Title":"CCT2026 Admin"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"system",content:c},{role:"user",content:u}]})});if(!a.ok)return e.json({error:`OpenRouter: ${await a.text()}`},500);const f=await a.json();return e.json({transcript:((s=(r=(t=f.choices)==null?void 0:t[0])==null?void 0:r.message)==null?void 0:s.content)||""})}catch(n){return e.json({error:n.message},500)}});N.post("/api/admin/vimeo-transcript",q,async e=>{try{const{video_id:t}=await e.req.json();if(!t)return e.json({error:"video_id obrigatório"},400);const r=e.env.VIMEO_ACCESS_TOKEN;if(!r)return e.json({error:"VIMEO_ACCESS_TOKEN não configurada"},500);const s=String(t).replace(/^https?:\/\/(?:www\.)?vimeo\.com\//i,"").replace(/[?#].*$/,"").replace(/\/$/,""),n=await fetch(`https://api.vimeo.com/videos/${s}/texttracks?per_page=100`,{headers:{Authorization:`Bearer ${r}`,Accept:"application/vnd.vimeo.*+json;version=3.4"}});if(!n.ok)return e.json({error:`Vimeo API ${n.status}`},502);const o=(await n.json()).data||[];if(!o.length)return e.json({error:"Nenhuma legenda encontrada para este vídeo"},404);const c=[...o].sort((g,b)=>{const v=h=>{let y=0;return String(h.language||"").toLowerCase().startsWith("pt")&&(y+=40),h.active!==!1&&(y+=20),h.type==="captions"&&(y+=10),y};return v(b)-v(g)}).find(g=>g.link)||null;if(!c)return e.json({error:"Nenhuma legenda com link disponível"},404);const u=await fetch(c.link);if(!u.ok)return e.json({error:`Download da legenda falhou: ${u.status}`},502);const f=(await u.text()).replace(/^﻿/,"").split(/\r?\n/).map(g=>g.trim()),d=[];for(const g of f){if(!g||/^(WEBVTT|Kind:|Language:|NOTE|STYLE|REGION|\d+$)/.test(g)||g.includes("-->"))continue;const b=g.replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();b&&d[d.length-1]!==b&&d.push(b)}const p=d.join(" ").replace(/\s+/g," ").trim();return p?e.json({transcript:p,language:c.language}):e.json({error:"Legenda encontrada mas está vazia"},404)}catch(t){return e.json({error:t.message},500)}});N.post("/api/admin/lessons/:id/whisper-transcribe",q,async e=>{var t,r,s,n;try{const i=parseInt(e.req.param("id")),o=O(e),l=await o.sql("SELECT id, title, video_provider, video_id FROM lessons WHERE id = $1",[i]);if(!l.length)return e.json({error:"Aula não encontrada"},404);const c=l[0];if(c.video_provider!=="vimeo")return e.json({error:"Esta aula não usa Vimeo como provedor"},400);if(!c.video_id||!/^\d+$/.test(c.video_id))return e.json({error:"ID do vídeo Vimeo inválido"},400);const u=((t=globalThis.process)==null?void 0:t.env)||{},a=e.env.VIMEO_ACCESS_TOKEN||u.VIMEO_ACCESS_TOKEN,f=e.env.OPENAI_API_KEY||u.OPENAI_API_KEY||u["OPENAI_API-KEY"],d=e.env.VITE_OPENROUTER_API_KEY||u.VITE_OPENROUTER_API_KEY;if(!a)return e.json({error:"VIMEO_ACCESS_TOKEN não configurado"},500);if(!f){const x=Object.keys(u).filter(P=>P.toLowerCase().includes("openai"));return e.json({error:`OPENAI_API_KEY não configurado. Chaves OPENAI encontradas: [${x.join(", ")}]`},500)}const p=await fetch(`https://api.vimeo.com/videos/${c.video_id}?fields=download`,{headers:{Authorization:`Bearer ${a}`}});if(!p.ok)return e.json({error:`Vimeo API ${p.status}`},502);const b=((await p.json()).download||[]).filter(x=>x.link&&x.size).sort((x,P)=>x.size-P.size);if(!b.length)return e.json({error:"Download não disponível para este vídeo"},400);const v=b[0],h=(v.size/1024/1024).toFixed(1),y=await fetch(v.link);if(!y.ok)return e.json({error:`Download falhou: HTTP ${y.status}`},502);let E=Buffer.from(await y.arrayBuffer()),S="video.mp4";const L=24*1024*1024;if(E.length>L){try{const x=await import("os"),P=await import("path"),D=await import("fs"),M=await import("child_process"),F=P.join(x.tmpdir(),`cct_w_${i}.mp4`),z=P.join(x.tmpdir(),`cct_w_${i}.mp3`);D.writeFileSync(F,E),M.spawnSync("ffmpeg",["-y","-i",F,"-vn","-ar","16000","-ac","1","-b:a","32k",z],{stdio:"pipe"}).status===0&&D.existsSync(z)&&(E=D.readFileSync(z),S="audio.mp3",D.unlinkSync(z)),D.unlinkSync(F)}catch{}if(E.length>L)return e.json({error:`Arquivo muito grande (${h} MB). Use o script de transcrição em lote.`},400)}const A="----WhisperBoundary"+Date.now().toString(16),m=`\r
`,_=S.endsWith(".mp3")?"audio/mpeg":"video/mp4",w=Buffer.concat([Buffer.from(`--${A}${m}Content-Disposition: form-data; name="file"; filename="${S}"${m}Content-Type: ${_}${m}${m}`),E,Buffer.from(`${m}--${A}${m}Content-Disposition: form-data; name="model"${m}${m}whisper-1`),Buffer.from(`${m}--${A}${m}Content-Disposition: form-data; name="language"${m}${m}pt`),Buffer.from(`${m}--${A}${m}Content-Disposition: form-data; name="response_format"${m}${m}text`),Buffer.from(`${m}--${A}--${m}`)]),T=await fetch("https://api.openai.com/v1/audio/transcriptions",{method:"POST",headers:{Authorization:`Bearer ${f}`,"Content-Type":`multipart/form-data; boundary=${A}`,"Content-Length":String(w.length)},body:w});if(!T.ok)return e.json({error:`OpenAI Whisper ${T.status}: ${await T.text()}`},502);let C=(await T.text()).trim(),I=null;if(d&&C){const x=`Você é um assistente especializado em cursos de PJe-Calc (cálculos trabalhistas no sistema judicial brasileiro).

Recebi a transcrição bruta de uma aula chamada "${c.title}". Organize esta transcrição em Markdown estruturado com:
- Um resumo em ## Resumo (3-4 linhas)
- Tópicos principais com ## e subtópicos com ###
- **Negrito** para termos técnicos e ações importantes
- Listas com - para passos ou itens
- > Destaques para avisos, dicas e pontos críticos

Mantenha o idioma português do Brasil. Não adicione conteúdo que não esteja na transcrição.

TRANSCRIÇÃO:
${C}`,P=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${d}`,"Content-Type":"application/json"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"user",content:x}]})});if(P.ok){const M=((n=(s=(r=(await P.json()).choices)==null?void 0:r[0])==null?void 0:s.message)==null?void 0:n.content)||"";if(M){C=M;const F=M.match(/##\s*Resumo\s*\n([\s\S]*?)(?=\n##\s|\n*$)/);F&&(I=F[1].trim())}}}return await o.sql("UPDATE lessons SET transcript = $1, description = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE description END WHERE id = $3",[C,I,i]),e.json({transcript:C,description:I,sizeMB:h})}catch(i){return e.json({error:i.message},500)}});N.post("/api/admin/lessons/:id/groq-transcribe",q,async e=>{var t,r,s,n;try{const i=parseInt(e.req.param("id")),o=O(e),l=await o.sql("SELECT id, title, video_provider, video_id FROM lessons WHERE id = $1",[i]);if(!l.length)return e.json({error:"Aula não encontrada"},404);const c=l[0];if(c.video_provider!=="vimeo")return e.json({error:"Esta aula não usa Vimeo como provedor"},400);if(!c.video_id||!/^\d+$/.test(c.video_id))return e.json({error:"ID do vídeo Vimeo inválido"},400);const u=((t=globalThis.process)==null?void 0:t.env)||{},a=e.env.VIMEO_ACCESS_TOKEN||u.VIMEO_ACCESS_TOKEN,f=e.env.GROQ_API_KEY||u.GROQ_API_KEY,d=e.env.VITE_OPENROUTER_API_KEY||u.VITE_OPENROUTER_API_KEY;if(!a)return e.json({error:"VIMEO_ACCESS_TOKEN não configurado"},500);if(!f){const x=Object.keys(u).filter(P=>P.toLowerCase().includes("groq"));return e.json({error:`GROQ_API_KEY não configurado. Chaves GROQ encontradas: [${x.join(", ")}]`},500)}const p=await fetch(`https://api.vimeo.com/videos/${c.video_id}?fields=download`,{headers:{Authorization:`Bearer ${a}`}});if(!p.ok)return e.json({error:`Vimeo API ${p.status}`},502);const b=((await p.json()).download||[]).filter(x=>x.link&&x.size).sort((x,P)=>x.size-P.size);if(!b.length)return e.json({error:"Download não disponível para este vídeo"},400);const v=b[0],h=(v.size/1024/1024).toFixed(1),y=await fetch(v.link);if(!y.ok)return e.json({error:`Download falhou: HTTP ${y.status}`},502);let E=Buffer.from(await y.arrayBuffer()),S="video.mp4";const L=24*1024*1024;if(E.length>L){try{const x=await import("os"),P=await import("path"),D=await import("fs"),M=await import("child_process"),F=P.join(x.tmpdir(),`cct_g_${i}.mp4`),z=P.join(x.tmpdir(),`cct_g_${i}.mp3`);D.writeFileSync(F,E),M.spawnSync("ffmpeg",["-y","-i",F,"-vn","-ar","16000","-ac","1","-b:a","32k",z],{stdio:"pipe"}).status===0&&D.existsSync(z)&&(E=D.readFileSync(z),S="audio.mp3",D.unlinkSync(z)),D.unlinkSync(F)}catch{}if(E.length>L)return e.json({error:`Arquivo muito grande (${h} MB). Use o script de transcrição em lote.`},400)}const A="----GroqBoundary"+Date.now().toString(16),m=`\r
`,_=S.endsWith(".mp3")?"audio/mpeg":"video/mp4",w=Buffer.concat([Buffer.from(`--${A}${m}Content-Disposition: form-data; name="file"; filename="${S}"${m}Content-Type: ${_}${m}${m}`),E,Buffer.from(`${m}--${A}${m}Content-Disposition: form-data; name="model"${m}${m}whisper-large-v3-turbo`),Buffer.from(`${m}--${A}${m}Content-Disposition: form-data; name="language"${m}${m}pt`),Buffer.from(`${m}--${A}${m}Content-Disposition: form-data; name="response_format"${m}${m}text`),Buffer.from(`${m}--${A}--${m}`)]),T=await fetch("https://api.groq.com/openai/v1/audio/transcriptions",{method:"POST",headers:{Authorization:`Bearer ${f}`,"Content-Type":`multipart/form-data; boundary=${A}`,"Content-Length":String(w.length)},body:w});if(!T.ok)return e.json({error:`Groq Whisper ${T.status}: ${await T.text()}`},502);let C=(await T.text()).trim(),I=null;if(d&&C){const x=`Você é um assistente especializado em cursos de PJe-Calc (cálculos trabalhistas no sistema judicial brasileiro).

Recebi a transcrição bruta de uma aula chamada "${c.title}". Organize esta transcrição em Markdown estruturado com:
- Um resumo em ## Resumo (3-4 linhas)
- Tópicos principais com ## e subtópicos com ###
- **Negrito** para termos técnicos e ações importantes
- Listas com - para passos ou itens
- > Destaques para avisos, dicas e pontos críticos

Mantenha o idioma português do Brasil. Não adicione conteúdo que não esteja na transcrição.

TRANSCRIÇÃO:
${C}`,P=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${d}`,"Content-Type":"application/json"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"user",content:x}]})});if(P.ok){const M=((n=(s=(r=(await P.json()).choices)==null?void 0:r[0])==null?void 0:s.message)==null?void 0:n.content)||"";if(M){C=M;const F=M.match(/##\s*Resumo\s*\n([\s\S]*?)(?=\n##\s|\n*$)/);F&&(I=F[1].trim())}}}return await o.sql("UPDATE lessons SET transcript = $1, description = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE description END WHERE id = $3",[C,I,i]),e.json({transcript:C,description:I,sizeMB:h})}catch(i){return e.json({error:i.message},500)}});N.delete("/api/admin/lessons/:id",q,async e=>{try{const t=e.req.param("id");return await O(e).delete("lessons",{id:t}),e.json({success:!0})}catch{return e.json({error:"Failed to delete lesson"},500)}});N.post("/api/lessons/:id/rent",Y,async e=>{try{const t=parseInt(e.req.param("id")),s=e.get("user").email,n=O(e);await Xr(n);const i=await n.sql("SELECT id, title, rentable, rental_credits FROM lessons WHERE id = $1",[t]);if(!i.length||!i[0].rentable)return e.json({error:"Esta aula não está disponível para aluguel"},400);const o=i[0],l=parseInt(o.rental_credits);if(!Number.isFinite(l)||l<=0)return e.json({error:"Créditos de aluguel inválidos para esta aula"},400);const c=await n.sql("SELECT expires_at FROM lesson_rentals WHERE user_email = $1 AND lesson_id = $2 AND expires_at > NOW()",[s,t]);if(c.length>0)return e.json({error:"Você já possui acesso ativo a esta aula",expires_at:c[0].expires_at},400);const u=e.env.DATABASE_URL_CREDITOS||e.env.DATABASE_SUITEPLUS;console.log("Credits DB configured:",!!u,"| prefix:",u==null?void 0:u.substring(0,30));const a=ni(e),f=await Fr(a,s);if(f<l)return e.json({error:"Créditos insuficientes",available:f,required:l},400);if(!await Po(a,s,l)){const p=await Fr(a,s);return e.json({error:"Créditos insuficientes",available:p,required:l},400)}return await n.sql(`INSERT INTO lesson_rentals (user_email, lesson_id, credits_paid, rented_at, expires_at)
       VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '30 days')
       ON CONFLICT (user_email, lesson_id)
       DO UPDATE SET credits_paid = $3, rented_at = NOW(), expires_at = NOW() + INTERVAL '30 days'`,[s,t,l]),e.json({success:!0,message:"Aula alugada com sucesso! Acesso liberado por 30 dias."})}catch(t){return console.error("Rent lesson error:",t),e.json({error:t.message||"Erro ao processar aluguel"},500)}});N.get("/api/user/rentals",Y,async e=>{try{const t=e.get("user"),r=O(e);await Xr(r);const s=await r.sql(`SELECT lr.id, lr.lesson_id, lr.credits_paid, lr.rented_at, lr.expires_at,
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
       ORDER BY lr.expires_at DESC`,[t.email]);return e.json({rentals:s})}catch(t){return console.error("Get rentals error:",t),e.json({error:t.message||"Erro ao buscar aluguéis"},500)}});async function Ne(e){await e.sql(`
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
  `),await e.sql("CREATE INDEX IF NOT EXISTS idx_trail_lessons_trail ON trail_lessons(trail_id)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_trail_lessons_lesson ON trail_lessons(lesson_id)")}N.get("/api/trails",Y,async e=>{try{const t=e.get("user"),r=O(e);await Ne(r);const s=await r.sql(`
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
    `,[t.email]);return e.json({trails:s})}catch(t){return console.error("Get trails error:",t),e.json({error:t.message||"Erro ao buscar trilhas"},500)}});N.get("/api/trails/:id",Y,async e=>{try{const t=e.req.param("id"),r=e.get("user"),s=O(e);await Ne(s);const n=await s.sql("SELECT * FROM trails WHERE id = $1",[t]);if(!n.length)return e.json({error:"Trilha não encontrada"},404);const i=n[0],o=await s.sql(`
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
    `,[t,r.email]);return e.json({trail:i,lessons:o})}catch(t){return console.error("Get trail error:",t),e.json({error:t.message||"Erro ao buscar trilha"},500)}});N.get("/api/admin/trails",q,async e=>{try{const t=O(e);await Ne(t);const r=await t.sql(`
      SELECT t.*, COUNT(tl.id)::int AS lessons_count
      FROM trails t
      LEFT JOIN trail_lessons tl ON tl.trail_id = t.id
      GROUP BY t.id
      ORDER BY t.order_index ASC, t.created_at DESC
    `);return e.json({trails:r})}catch(t){return e.json({error:t.message},500)}});N.post("/api/admin/trails",q,async e=>{try{const{title:t,description:r,is_published:s,order_index:n}=await e.req.json();if(!t)return e.json({error:"title is required"},400);const i=O(e);await Ne(i);const o=await i.insert("trails",{title:t,description:r||null,is_published:s??!1,order_index:n??0});return e.json({success:!0,trail_id:o[0].id,trail:o[0]})}catch(t){return e.json({error:t.message},500)}});N.put("/api/admin/trails/:id",q,async e=>{try{const t=parseInt(e.req.param("id")),r=await e.req.json(),s=O(e);await Ne(s);const n=["title","description","is_published","order_index"],i={updated_at:new Date().toISOString()};for(const o of n)o in r&&(i[o]=r[o]);return await s.update("trails",{id:t},i),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});N.delete("/api/admin/trails/:id",q,async e=>{try{const t=parseInt(e.req.param("id")),r=O(e);return await Ne(r),await r.delete("trails",{id:t}),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});N.post("/api/admin/trails/:id/lessons",q,async e=>{var t;try{const r=parseInt(e.req.param("id")),{lesson_id:s}=await e.req.json();if(!s)return e.json({error:"lesson_id required"},400);const n=O(e);await Ne(n);const o=(((t=(await n.sql("SELECT COALESCE(MAX(order_index), -1) AS max_idx FROM trail_lessons WHERE trail_id = $1",[r]))[0])==null?void 0:t.max_idx)??-1)+1;return await n.sql("INSERT INTO trail_lessons (trail_id, lesson_id, order_index) VALUES ($1, $2, $3) ON CONFLICT (trail_id, lesson_id) DO NOTHING",[r,s,o]),e.json({success:!0})}catch(r){return e.json({error:r.message},500)}});N.delete("/api/admin/trails/:id/lessons/:lessonId",q,async e=>{try{const t=parseInt(e.req.param("id")),r=parseInt(e.req.param("lessonId"));return await O(e).sql("DELETE FROM trail_lessons WHERE trail_id = $1 AND lesson_id = $2",[t,r]),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});N.post("/api/admin/trails/:id/reorder",q,async e=>{try{const t=parseInt(e.req.param("id")),{lessons:r}=await e.req.json();if(!Array.isArray(r))return e.json({error:"lessons array required"},400);const s=O(e);for(const n of r)await s.sql("UPDATE trail_lessons SET order_index = $1 WHERE trail_id = $2 AND lesson_id = $3",[n.order_index,t,n.lesson_id]);return e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});N.get("/api/admin/trails/search-lessons",q,async e=>{try{const t=e.req.query("q")||"",r=e.req.query("course_id"),s=O(e),n=r?`AND co.id = ${parseInt(r)}`:"",i=t?"AND (l.title ILIKE $1)":"",o=t?[`%${t}%`]:[],l=await s.sql(`
      SELECT l.id, l.title, l.duration_minutes, l.teste_gratis, l.rentable, l.rental_credits,
             m.title AS module_title,
             co.id AS course_id, co.title AS course_title
      FROM lessons l
      JOIN modules m ON m.id = l.module_id
      JOIN courses co ON co.id = m.course_id
      WHERE 1=1 ${n} ${i}
      ORDER BY co.title ASC, m.order_index ASC, l.order_index ASC
      LIMIT 50
    `,o);return e.json({lessons:l})}catch(t){return e.json({error:t.message},500)}});N.get("/api/admin/lessons/find",q,async e=>{try{const t=e.req.query("module_id"),r=e.req.query("title");if(!t||!r)return e.json({error:"module_id and title are required"},400);const n=await O(e).query("lessons",{select:"*",filters:{module_id:t,title:r},limit:1});return n&&n.length>0?e.json({lesson:n[0]}):e.json({lesson:null})}catch(t){return console.error("Find lesson error:",t),e.json({error:t.message||"Failed to find lesson"},500)}});function $r(e,t){const r=Array.isArray(e.alternatives)?e.alternatives:[],s=Array.isArray(e.tags)?e.tags:String(e.tags||"").split(",").map(n=>n.trim()).filter(Boolean);return{title:e.title||null,statement_html:e.statement_html||"",question_type:e.question_type||"multiple_choice",alternatives:JSON.stringify(r),answer_key:JSON.stringify(e.answer_key||{}),technical_comment_html:e.technical_comment_html||null,difficulty:e.difficulty||"medio",theme:e.theme||null,subtheme:e.subtheme||null,legal_basis:e.legal_basis||null,weight:Number(e.weight||1),estimated_minutes:parseInt(e.estimated_minutes)||5,tags:JSON.stringify(s),status:e.status||"draft",professor:e.professor||null,course_id:e.course_id?parseInt(e.course_id):null,lesson_id:e.lesson_id?parseInt(e.lesson_id):null,source_transcript:e.source_transcript||null,ai_generated:e.ai_generated===!0||e.ai_generated==="true",order_index:parseInt(e.order_index)||0,usage_count:parseInt(e.usage_count)||0,attempts_count:parseInt(e.attempts_count)||0,correct_count:parseInt(e.correct_count)||0,wrong_count:parseInt(e.wrong_count)||0,created_by:t||e.created_by||null}}function Hr(e){if(typeof e=="string")return e.replace(/\b(conforme|segundo|de acordo com|com base na|a partir da)\s+a\s+transcri[cç][aã]o\b/gi,"").replace(/\bna\s+transcri[cç][aã]o\b/gi,"no material de estudo").replace(/\bda\s+transcri[cç][aã]o\b/gi,"do material de estudo").replace(/\btranscri[cç][aã]o\b/gi,"material de estudo").replace(/\s{2,}/g," ").replace(/\s+([,.;:!?])/g,"$1").trim();if(Array.isArray(e))return e.map(Hr).filter(t=>!(typeof t=="string"&&/transcri[cç][aã]o/i.test(t)));if(e&&typeof e=="object"){const t={};for(const[r,s]of Object.entries(e))t[r]=Hr(s);return t}return e}N.get("/api/admin/questions",q,async e=>{try{const t=O(e);await ie(t);const r=[],s=[];let n=1;const i=(h,y)=>{r.push(h.replace("?",`$${n++}`)),s.push(y)},o=e.req.query("q"),l=e.req.query("theme"),c=e.req.query("professor"),u=e.req.query("course_id"),a=e.req.query("difficulty"),f=e.req.query("question_type"),d=e.req.query("status"),p=e.req.query("from"),g=e.req.query("to");o&&(r.push(`(title ILIKE $${n} OR statement_html ILIKE $${n+1} OR legal_basis ILIKE $${n+2})`),s.push(`%${o}%`,`%${o}%`,`%${o}%`),n+=3),l&&i("theme = ?",l),c&&i("professor = ?",c),u&&i("course_id = ?",parseInt(u)),a&&i("difficulty = ?",a),f&&i("question_type = ?",f),d&&i("status = ?",d),p&&i("created_at >= ?",p),g&&i("created_at <= ?",g);const b=r.length?`WHERE ${r.join(" AND ")}`:"",v=await t.sql(`
      SELECT q.*,
             c.title AS course_title,
             l.title AS lesson_title,
             CASE WHEN q.attempts_count > 0 THEN ROUND((q.correct_count::numeric / q.attempts_count::numeric) * 100, 1) ELSE NULL END AS success_rate,
             CASE WHEN q.attempts_count > 0 THEN ROUND((q.wrong_count::numeric / q.attempts_count::numeric) * 100, 1) ELSE NULL END AS real_difficulty_index
      FROM question_bank q
      LEFT JOIN courses c ON c.id = q.course_id
      LEFT JOIN lessons l ON l.id = q.lesson_id
      ${b}
      ORDER BY q.order_index ASC, q.updated_at DESC
      LIMIT 500
    `,s);return e.json({questions:v})}catch(t){return console.error("List questions error:",t),e.json({error:t.message||"Failed to list questions"},500)}});N.get("/api/admin/questions/stats",q,async e=>{try{const t=O(e);await ie(t);const r=await t.sql(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'published')::int AS published,
        COUNT(*) FILTER (WHERE ai_generated)::int AS ai_generated,
        COALESCE(SUM(usage_count), 0)::int AS total_usage,
        ROUND(AVG(CASE WHEN attempts_count > 0 THEN correct_count::numeric / attempts_count::numeric * 100 END), 1) AS avg_success_rate
      FROM question_bank
    `),s=await t.sql("SELECT id, title, wrong_count, attempts_count FROM question_bank ORDER BY wrong_count DESC, attempts_count DESC LIMIT 5"),n=await t.sql("SELECT id, title, usage_count FROM question_bank ORDER BY usage_count DESC LIMIT 5");return e.json({stats:r[0]||{},mostWrong:s,mostUsed:n})}catch(t){return e.json({error:t.message},500)}});N.get("/api/admin/questions/:id/versions",q,async e=>{try{const t=O(e);await ie(t);const r=await t.sql("SELECT * FROM question_bank_versions WHERE question_id = $1 ORDER BY version DESC, created_at DESC",[parseInt(e.req.param("id"))]);return e.json({versions:r})}catch(t){return e.json({error:t.message},500)}});N.post("/api/admin/questions",q,async e=>{try{const t=e.get("user"),r=O(e);await ie(r);const s=$r(await e.req.json(),t==null?void 0:t.email),i=(await r.sql(`
      INSERT INTO question_bank (
        title, statement_html, question_type, alternatives, answer_key, technical_comment_html,
        difficulty, theme, subtheme, legal_basis, weight, estimated_minutes, tags, status,
        professor, course_id, lesson_id, source_transcript, ai_generated, order_index,
        usage_count, attempts_count, correct_count, wrong_count, created_by
      )
      VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
      RETURNING *
    `,[s.title,s.statement_html,s.question_type,s.alternatives,s.answer_key,s.technical_comment_html,s.difficulty,s.theme,s.subtheme,s.legal_basis,s.weight,s.estimated_minutes,s.tags,s.status,s.professor,s.course_id,s.lesson_id,s.source_transcript,s.ai_generated,s.order_index,s.usage_count,s.attempts_count,s.correct_count,s.wrong_count,s.created_by]))[0];return await r.sql("INSERT INTO question_bank_versions (question_id, version, snapshot, changed_by, change_note) VALUES ($1, $2, $3::jsonb, $4, $5)",[i.id,1,JSON.stringify(i),(t==null?void 0:t.email)||null,"Criacao"]),e.json({success:!0,question:i})}catch(t){return console.error("Create question error:",t),e.json({error:t.message||"Failed to create question"},500)}});N.put("/api/admin/questions/:id",q,async e=>{try{const t=e.get("user"),r=parseInt(e.req.param("id")),s=O(e);await ie(s);const n=await s.sql("SELECT * FROM question_bank WHERE id = $1",[r]);if(!n.length)return e.json({error:"Question not found"},404);const i=n[0],o=$r(await e.req.json(),t==null?void 0:t.email),l=parseInt(i.version||1)+1,c=await s.sql(`
      UPDATE question_bank SET
        title=$1, statement_html=$2, question_type=$3, alternatives=$4::jsonb, answer_key=$5::jsonb,
        technical_comment_html=$6, difficulty=$7, theme=$8, subtheme=$9, legal_basis=$10,
        weight=$11, estimated_minutes=$12, tags=$13::jsonb, status=$14, professor=$15,
        course_id=$16, lesson_id=$17, source_transcript=$18, ai_generated=$19, order_index=$20,
        usage_count=$21, attempts_count=$22, correct_count=$23, wrong_count=$24,
        version=$25, updated_at=NOW()
      WHERE id=$26
      RETURNING *
    `,[o.title,o.statement_html,o.question_type,o.alternatives,o.answer_key,o.technical_comment_html,o.difficulty,o.theme,o.subtheme,o.legal_basis,o.weight,o.estimated_minutes,o.tags,o.status,o.professor,o.course_id,o.lesson_id,o.source_transcript,o.ai_generated,o.order_index,o.usage_count,o.attempts_count,o.correct_count,o.wrong_count,l,r]);return await s.sql("INSERT INTO question_bank_versions (question_id, version, snapshot, changed_by, change_note) VALUES ($1, $2, $3::jsonb, $4, $5)",[r,l,JSON.stringify(c[0]),(t==null?void 0:t.email)||null,"Edicao manual"]),e.json({success:!0,question:c[0]})}catch(t){return console.error("Update question error:",t),e.json({error:t.message||"Failed to update question"},500)}});N.post("/api/admin/questions/:id/duplicate",q,async e=>{try{const t=e.get("user"),r=parseInt(e.req.param("id")),s=O(e);await ie(s);const n=await s.sql("SELECT * FROM question_bank WHERE id = $1",[r]);if(!n.length)return e.json({error:"Question not found"},404);const i=n[0],o=await s.sql(`
      INSERT INTO question_bank (
        title, statement_html, question_type, alternatives, answer_key, technical_comment_html,
        difficulty, theme, subtheme, legal_basis, weight, estimated_minutes, tags, status,
        professor, course_id, lesson_id, source_transcript, ai_generated, order_index, created_by
      )
      VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,'draft',$14,$15,$16,$17,$18,$19,$20)
      RETURNING *
    `,[`${i.title||"Questao"} (copia)`,i.statement_html,i.question_type,JSON.stringify(i.alternatives||[]),JSON.stringify(i.answer_key||{}),i.technical_comment_html,i.difficulty,i.theme,i.subtheme,i.legal_basis,i.weight,i.estimated_minutes,JSON.stringify(i.tags||[]),i.professor,i.course_id,i.lesson_id,i.source_transcript,i.ai_generated,i.order_index+1,(t==null?void 0:t.email)||null]);return e.json({success:!0,question:o[0]})}catch(t){return e.json({error:t.message},500)}});N.delete("/api/admin/questions/:id",q,async e=>{try{const t=O(e);return await ie(t),await t.sql("DELETE FROM question_bank WHERE id = $1",[parseInt(e.req.param("id"))]),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});N.post("/api/admin/questions-reorder",q,async e=>{try{const{questions:t}=await e.req.json();if(!Array.isArray(t))return e.json({error:"questions must be an array"},400);const r=O(e);await ie(r);for(const s of t)await r.sql("UPDATE question_bank SET order_index = $1, updated_at = NOW() WHERE id = $2",[parseInt(s.order_index),parseInt(s.id)]);return e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});N.post("/api/admin/questions/import",q,async e=>{try{const{questions:t}=await e.req.json();if(!Array.isArray(t))return e.json({error:"questions array required"},400);const r=e.get("user"),s=O(e);await ie(s);let n=0;for(const i of t){const o=$r(i,r==null?void 0:r.email);await s.sql(`
        INSERT INTO question_bank (
          title, statement_html, question_type, alternatives, answer_key, technical_comment_html,
          difficulty, theme, subtheme, legal_basis, weight, estimated_minutes, tags, status,
          professor, course_id, lesson_id, source_transcript, ai_generated, order_index, created_by
        )
        VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,$16,$17,$18,$19,$20,$21)
      `,[o.title,o.statement_html,o.question_type,o.alternatives,o.answer_key,o.technical_comment_html,o.difficulty,o.theme,o.subtheme,o.legal_basis,o.weight,o.estimated_minutes,o.tags,o.status,o.professor,o.course_id,o.lesson_id,o.source_transcript,o.ai_generated,o.order_index,o.created_by]),n++}return e.json({success:!0,created:n})}catch(t){return e.json({error:t.message},500)}});N.post("/api/admin/questions/generate-ai",q,async e=>{var t,r,s;try{const{lesson_id:n,transcript:i,count:o=5,types:l=["multiple_choice","true_false","discursive"],difficulty:c="misto",context:u=""}=await e.req.json(),a=O(e);await ie(a);let f=i||"",d=null;if(n&&(d=(await a.sql(`
        SELECT l.id, l.title, l.transcript, c.title AS course_title, c.instructor, c.id AS course_id
        FROM lessons l
        JOIN modules m ON m.id = l.module_id
        JOIN courses c ON c.id = m.course_id
        WHERE l.id = $1
      `,[parseInt(n)]))[0]||null,f=f||(d==null?void 0:d.transcript)||""),!(f!=null&&f.trim()))return e.json({error:"Informe uma transcricao ou selecione uma aula com transcricao."},400);const p=e.env.VITE_OPENROUTER_API_KEY;if(!p)return e.json({error:"VITE_OPENROUTER_API_KEY nao configurada"},500);const g=`Gere questoes para prova de proficiencia e certificacao em calculos trabalhistas usando exclusivamente o conteudo-base fornecido abaixo.
Retorne somente JSON valido, sem markdown, no formato {"questions":[...]}.
Cada item deve conter: title, statement_html, question_type ("discursive", "multiple_choice" ou "true_false"), alternatives (array com {label,text_html,is_correct}), answer_key, technical_comment_html, difficulty ("facil","medio","dificil"), theme, subtheme, legal_basis, weight, estimated_minutes, tags.
Crie alternativas plausiveis, gabarito comentado e fundamentacao tecnica. Tipos desejados: ${l.join(", ")}. Dificuldade: ${c}. Quantidade: ${o}.
Nao mencione "transcricao", "aula transcrita", "texto transcrito" ou a origem do conteudo em nenhum enunciado, alternativa, comentario, gabarito, tag, tema ou titulo. As questoes devem parecer itens independentes de prova.
Contexto adicional: ${u||"nenhum"}.
Conteudo-base:
---
${f.slice(0,24e3)}
---`,b=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${p}`,"HTTP-Referer":"https://cct2026.com.br","X-Title":"CCT2026 Admin"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"system",content:"Voce e especialista em direito do trabalho, calculos trabalhistas, PJe-Calc e avaliacao educacional. Responda apenas JSON valido."},{role:"user",content:g}],response_format:{type:"json_object"}})});if(!b.ok)return e.json({error:`OpenRouter: ${await b.text()}`},500);const h=((s=(r=(t=(await b.json()).choices)==null?void 0:t[0])==null?void 0:r.message)==null?void 0:s.content)||'{"questions":[]}',E=(JSON.parse(h).questions||[]).map(S=>({...Hr(S),lesson_id:(d==null?void 0:d.id)||n||null,course_id:(d==null?void 0:d.course_id)||null,professor:(d==null?void 0:d.instructor)||null,source_transcript:f,ai_generated:!0,status:"review"}));return e.json({questions:E})}catch(n){return console.error("Generate questions error:",n),e.json({error:n.message||"Erro ao gerar questoes"},500)}});N.post("/api/admin/run-migration-lesson-fields",q,async e=>{try{const t=O(e);return await t.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS support_text TEXT"),await t.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS transcript TEXT"),await t.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb"),await Xr(t),e.json({success:!0,message:"Migration applied successfully"})}catch(t){return console.error("Migration error:",t),e.json({error:t.message},500)}});N.get("/api/admin/users",q,async e=>{try{const r=await O(e).sql(`
      SELECT *
      FROM (
        SELECT
          id,
          email,
          nome,
          first_name,
          last_name,
          cpf,
          telefone,
          whatsapp,
          foto,
          end_cep,
          end_logradouro,
          end_numero,
          end_cidade,
          end_estado,
          ativo,
          teste_gratis,
          dt_expiracao,
          created_at,
          updated_at,
          'users'::text AS source,
          false AS is_virtual
        FROM users

        UNION ALL

        SELECT
          NULL::integer AS id,
          ms.email_membro AS email,
          NULL::varchar(255) AS nome,
          NULL::varchar(100) AS first_name,
          NULL::varchar(100) AS last_name,
          NULL::varchar(14) AS cpf,
          NULL::varchar(20) AS telefone,
          NULL::varchar(20) AS whatsapp,
          NULL::text AS foto,
          NULL::varchar(10) AS end_cep,
          NULL::varchar(255) AS end_logradouro,
          NULL::varchar(20) AS end_numero,
          NULL::varchar(100) AS end_cidade,
          NULL::varchar(2) AS end_estado,
          COALESCE(bool_or(ms.ativo), true) AS ativo,
          bool_or(COALESCE(ms.teste_gratis, false)) AS teste_gratis,
          MAX(ms.data_expiracao) AS dt_expiracao,
          MIN(ms.created_at) AS created_at,
          MAX(ms.updated_at) AS updated_at,
          'member_subscriptions'::text AS source,
          true AS is_virtual
        FROM member_subscriptions ms
        LEFT JOIN users u ON lower(u.email) = lower(ms.email_membro)
        WHERE u.id IS NULL
          AND ms.email_membro IS NOT NULL
          AND btrim(ms.email_membro) <> ''
        GROUP BY lower(ms.email_membro), ms.email_membro
      ) all_users
      ORDER BY created_at DESC NULLS LAST, email ASC
    `);return e.json({users:r})}catch(t){return console.error("Get users error:",t),e.json({error:t.message||"Failed to fetch users"},500)}});N.get("/api/admin/users/find",q,async e=>{try{const t=e.req.query("email");if(!t)return e.json({error:"Email is required"},400);const s=await O(e).query("users",{select:"*",filters:{email:t},limit:1});return s&&s.length>0?e.json({user:s[0]}):e.json({user:null})}catch(t){return console.error("Find user error:",t),e.json({error:t.message||"Failed to find user"},500)}});N.post("/api/admin/users",q,async e=>{try{const t=await e.req.json();if(!t.email)return e.json({error:"Email is required"},400);const s=await O(e).insert("users",{email:t.email,nome:t.nome||null,first_name:t.first_name||null,last_name:t.last_name||null,cpf:t.cpf||null,telefone:t.telefone||null,whatsapp:t.whatsapp||null,foto:t.foto||null,end_cep:t.end_cep||null,end_logradouro:t.end_logradouro||null,end_numero:t.end_numero||null,end_cidade:t.end_cidade||null,end_estado:t.end_estado||null,ativo:t.ativo!==void 0?t.ativo:!0,teste_gratis:t.teste_gratis||!1,dt_expiracao:t.dt_expiracao||null});return e.json({success:!0,user_id:s[0].id})}catch(t){return console.error("Create user error:",t),e.json({error:t.message||"Failed to create user"},500)}});N.put("/api/admin/users/:id",q,async e=>{try{const t=e.req.param("id"),r=await e.req.json();return await O(e).update("users",{id:t},{nome:r.nome,first_name:r.first_name,last_name:r.last_name,cpf:r.cpf,telefone:r.telefone,whatsapp:r.whatsapp,foto:r.foto,end_cep:r.end_cep,end_logradouro:r.end_logradouro,end_numero:r.end_numero,end_cidade:r.end_cidade,end_estado:r.end_estado,ativo:r.ativo,teste_gratis:r.teste_gratis,dt_expiracao:r.dt_expiracao,updated_at:new Date().toISOString()}),e.json({success:!0})}catch(t){return console.error("Update user error:",t),e.json({error:t.message||"Failed to update user"},500)}});N.delete("/api/admin/users/:id",q,async e=>{try{const t=e.req.param("id");return await O(e).delete("users",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete user error:",t),e.json({error:t.message||"Failed to delete user"},500)}});N.get("/api/admin/certificates",q,async e=>{try{const r=await O(e).query("certificates",{select:"*",order:"created_at DESC"});return e.json({certificates:r||[]})}catch(t){return console.error("List certificates error:",t),e.json({error:t.message||"Failed to list certificates"},500)}});N.get("/api/admin/certificates/:id",q,async e=>{try{const t=e.req.param("id"),s=await O(e).query("certificates",{select:"*",filters:{id:t}});return!s||s.length===0?e.json({error:"Certificate not found"},404):e.json({certificate:s[0]})}catch(t){return console.error("Get certificate error:",t),e.json({error:t.message||"Failed to get certificate"},500)}});N.get("/api/admin/certificates/find",q,async e=>{try{const t=e.req.query("email"),r=e.req.query("course");if(!t||!r)return e.json({error:"Email and course parameters are required"},400);const n=await O(e).query("certificates",{select:"*",filters:{user_email:t,course_title:r}});return e.json({certificates:n||[]})}catch(t){return console.error("Find certificate error:",t),e.json({error:t.message||"Failed to find certificate"},500)}});N.post("/api/admin/certificates",q,async e=>{try{const t=await e.req.json();if(!t.user_email||!t.course_title)return e.json({error:"Email and course title are required"},400);const r=O(e),s=new Date().toISOString(),n=await r.insert("certificates",{user_email:t.user_email,user_name:t.user_name||"Aluno",course_id:t.course_id||null,course_title:t.course_title,issued_at:t.issued_at||s,completion_date:t.completion_date||s,carga_horaria:t.carga_horaria||null,certificate_code:t.certificate_code||null,generated_at:t.generated_at||null});return e.json({success:!0,certificate_id:n&&n.length>0?n[0].id:null})}catch(t){return console.error("Create certificate error:",t),e.json({error:t.message||"Failed to create certificate"},500)}});N.put("/api/admin/certificates/:id",q,async e=>{try{const t=e.req.param("id"),r=await e.req.json(),s=O(e);let n=r.course_title;if(r.course_id){const i=await s.query("courses",{select:"title",filters:{id:r.course_id}});i&&i.length>0&&(n=i[0].title)}return await s.update("certificates",{id:t},{user_email:r.user_email,user_name:r.user_name,course_id:r.course_id,course_title:n,carga_horaria:r.carga_horaria,updated_at:new Date().toISOString()}),e.json({success:!0})}catch(t){return console.error("Update certificate error:",t),e.json({error:t.message||"Failed to update certificate"},500)}});N.delete("/api/admin/certificates/:id",q,async e=>{try{const t=e.req.param("id");return await O(e).delete("certificates",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete certificate error:",t),e.json({error:t.message||"Failed to delete certificate"},500)}});function Lo(e){const t=!!e.templateImageUrl,r=!!e.versoImageUrl,s=e.modules&&e.modules.length>0;if(t){const u=s?e.modules.map((f,d)=>`<div class="mod-item"><span class="mod-num">${String(d+1).padStart(2,"0")}.</span> ${f}</div>`).join(""):"",a=r?`
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

  ${a}

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
  </svg>`,l=`
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
      <img class="logo-img" src="${ns}" alt="Ensino Plus"/>
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
        ${e.modules.map((u,a)=>`
          <div class="mod-item"><span class="mod-num">${String(a+1).padStart(2,"0")}.</span>${u}</div>`).join("")}
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
  <style>${l}</style>
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
      <img class="logo-img" src="${ns}" alt="Ensino Plus"/>
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
</html>`}N.get("/api/my-certificates",Y,async e=>{try{const r=e.get("user").email;if(!r)return e.json({error:"User email not found"},400);const n=await O(e).query("certificates",{select:"*",filters:{user_email:r},order:"completion_date DESC"});return e.json({certificates:n||[]})}catch(t){return console.error("Get my certificates error:",t),e.json({error:t.message||"Failed to get certificates"},500)}});N.get("/api/certificates/:id/html",Y,async e=>{try{const t=e.req.param("id"),s=e.get("user").email,n=O(e),i=await n.query("certificates",{select:"*",filters:{id:t}});if(!i||i.length===0)return e.json({error:"Certificate not found"},404);const o=i[0];if(o.user_email!==s)return e.json({error:"Unauthorized"},403);const l=o.start_date?new Date(o.start_date).toLocaleDateString("pt-BR"):void 0,c=o.completion_date?new Date(o.completion_date).toLocaleDateString("pt-BR"):void 0,u=o.generated_at?new Date(o.generated_at).toLocaleDateString("pt-BR"):new Date().toLocaleDateString("pt-BR"),a=new URL(e.req.url).origin,f=o.certificate_code||o.verification_code||"",d=f?`${a}/verificar/${f}`:"";let p=[];if(o.course_modules)try{p=JSON.parse(o.course_modules).map(E=>E.title||E)}catch(y){console.log("Error parsing course_modules:",y)}if(p.length===0&&o.course_id)try{const y=await n.query("modules",{select:"title, order_index",filters:{course_id:o.course_id},order:"order_index ASC"});y&&y.length>0&&(p=y.map(E=>E.title))}catch(y){console.log("Error fetching modules:",y)}let g,b;if(o.course_id)try{const y=await n.query("certificate_templates",{select:"template_data, template_mime, verso_data, verso_mime",filters:{course_id:o.course_id},single:!0});y!=null&&y.template_data&&(g=`data:${y.template_mime||"image/jpeg"};base64,${y.template_data}`),y!=null&&y.verso_data&&(b=`data:${y.verso_mime||"image/jpeg"};base64,${y.verso_data}`)}catch{console.log("No certificate template found for course",o.course_id)}let v;if(d)try{v=await Io.toString(d,{type:"svg",margin:1,color:{dark:"#1a1a2e",light:"#f8f7f5"}})}catch(y){console.log("QR code generation failed:",y)}const h=Lo({studentName:o.user_name,courseName:o.course_title,workload:o.carga_horaria||"N/A",startDate:l,completionDate:c,issueDate:u,verificationCode:f,verificationUrl:d,qrCodeSVG:v,modules:p.length>0?p:void 0,templateImageUrl:g,versoImageUrl:b});return e.html(h)}catch(t){return console.error("Generate certificate HTML error:",t),e.json({error:t.message||"Failed to generate certificate"},500)}});N.get("/verificar/:code",async e=>{try{const t=e.req.param("code"),r=O(e),s=await r.query("certificates",{select:"*",filters:{certificate_code:t}});if(!s||s.length===0)return e.html(`
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
      `);const n=s[0];try{await r.update("certificates",{id:n.id},{verification_count:(n.verification_count||0)+1})}catch{}const i=n.start_date?new Date(n.start_date).toLocaleDateString("pt-BR"):void 0,o=n.completion_date?new Date(n.completion_date).toLocaleDateString("pt-BR"):void 0,l=n.generated_at?new Date(n.generated_at).toLocaleDateString("pt-BR"):new Date().toLocaleDateString("pt-BR");let c=[];if(n.course_modules)try{c=JSON.parse(n.course_modules).map(f=>f.title||f)}catch(a){console.log("Error parsing course_modules:",a)}if(c.length===0&&n.course_id)try{const a=await r.query("modules",{select:"title, order_index",filters:{course_id:n.course_id},order:"order_index ASC"});a&&a.length>0&&(c=a.map(f=>f.title))}catch(a){console.log("Error fetching modules:",a)}const u=c.length>0?`
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="text-sm font-bold text-gray-700 mb-3">
          <i class="fas fa-list-check mr-2 text-blue-600"></i>Módulos Concluídos:
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${c.map((a,f)=>`
            <div class="flex items-start text-sm text-gray-700">
              <i class="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
              <span>${a}</span>
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
                <span class="text-lg font-bold text-blue-600">${l}</span>
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
                  <span class="text-sm font-semibold text-gray-800">${l}</span>
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
    `)}catch(t){return console.error("Verify certificate error:",t),e.json({error:t.message||"Failed to verify certificate"},500)}});N.get("/api/verify/:code",async e=>{try{const t=e.req.param("code"),r=O(e),s=await r.query("certificates",{select:"*",filters:{certificate_code:t}});if(!s||s.length===0)return e.json({valid:!1,message:"Certificate not found"},404);const n=s[0];try{await r.update("certificates",{id:n.id},{verification_count:(n.verification_count||0)+1})}catch{}return e.json({valid:!0,certificate:{student_name:n.user_name,course_title:n.course_title,workload:n.carga_horaria,completion_date:n.completion_date,issued_at:n.issued_at,certificate_code:n.certificate_code,verification_count:(n.verification_count||0)+1}})}catch(t){return console.error("Verify certificate API error:",t),e.json({error:t.message||"Failed to verify certificate"},500)}});N.get("/api/admin/member-subscriptions",q,async e=>{try{const r=await O(e).query("member_subscriptions",{select:"*",order:"created_at DESC"});return e.json({subscriptions:r||[]})}catch(t){return console.error("List member subscriptions error:",t),e.json({error:t.message||"Failed to list member subscriptions"},500)}});N.get("/api/admin/suiteplus-subscriptions",q,async e=>{try{const t=e.env.DATABASE_SUITEPLUS;if(!t)return e.json({error:"DATABASE_SUITEPLUS não configurada"},500);const s=await new wt(t).sql(`SELECT id, user_email, product_id, started_at, expires_at, status, payment_source, recurring_enabled
       FROM user_subscriptions
       ORDER BY expires_at DESC`);return e.json({subscriptions:s})}catch(t){return console.error("SuitePlus subscriptions error:",t),e.json({error:t.message||"Erro ao buscar assinaturas SuitePlus"},500)}});N.get("/api/admin/member-subscriptions/find",q,async e=>{try{const t=e.req.query("email");if(!t)return e.json({error:"Email parameter is required"},400);const s=await O(e).query("member_subscriptions",{select:"*",filters:{email_membro:t}});return e.json({subscriptions:s||[]})}catch(t){return console.error("Find member subscription error:",t),e.json({error:t.message||"Failed to find member subscription"},500)}});N.post("/api/admin/member-subscriptions",q,async e=>{try{const t=await e.req.json();if(!t.email_membro)return e.json({error:"Email is required"},400);const s=await O(e).insert("member_subscriptions",{email_membro:t.email_membro,data_expiracao:t.data_expiracao||null,detalhe:t.detalhe||null,origem:t.origem||null,teste_gratis:t.teste_gratis||!1,ativo:t.ativo!==void 0?t.ativo:!0});return e.json({success:!0,subscription_id:s&&s.length>0?s[0].id:null})}catch(t){return console.error("Create member subscription error:",t),e.json({error:t.message||"Failed to create member subscription"},500)}});N.put("/api/admin/member-subscriptions/:id",q,async e=>{try{const t=e.req.param("id"),r=await e.req.json();return await O(e).update("member_subscriptions",{id:t},{email_membro:r.email_membro,data_expiracao:r.data_expiracao,detalhe:r.detalhe,origem:r.origem,teste_gratis:r.teste_gratis,ativo:r.ativo,updated_at:new Date().toISOString()}),e.json({success:!0})}catch(t){return console.error("Update member subscription error:",t),e.json({error:t.message||"Failed to update member subscription"},500)}});N.delete("/api/admin/member-subscriptions/:id",q,async e=>{try{const t=e.req.param("id");return await O(e).delete("member_subscriptions",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete user error:",t),e.json({error:t.message||"Failed to delete user"},500)}});N.get("/api/courses",async e=>{try{const t=O(e),r=$(e,"sb-access-token");let s=!1;if(r){const l=await J(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);l&&(s=await Wr(l.email,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY,r))}const n=s?{}:{is_published:!0},i=s?"":"WHERE c.is_published = true",o=await t.sql(`
      SELECT c.*,
             COUNT(DISTINCT m.id)::int AS modules_count,
             COUNT(l.id)::int          AS lessons_count
      FROM courses c
      LEFT JOIN modules m ON m.course_id = c.id
      LEFT JOIN lessons l ON l.module_id = m.id
      ${i}
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);return e.json({courses:o})}catch(t){return console.error("❌ /api/courses error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch courses"},500)}});N.get("/api/courses/:id",async e=>{try{const t=e.req.param("id"),r=O(e),s=await r.query("courses",{select:"*",filters:{id:t},single:!0});if(!s)return e.json({error:"Course not found"},404);const n=await r.query("modules",{select:"*",filters:{course_id:t},order:"order_index"}),i=await r.sql(`SELECT l.* FROM lessons l
       JOIN modules m ON m.id = l.module_id
       WHERE m.course_id = $1
       ORDER BY m.order_index, l.order_index`,[t]),o=new Map;for(const l of i){const c=o.get(l.module_id)||[];c.push(l),o.set(l.module_id,c)}for(const l of n)l.lessons=o.get(l.id)||[];return e.json({course:s,modules:n})}catch(t){return console.error("❌ /api/courses/:id error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch course"},500)}});N.get("/api/lessons/:id",async e=>{var t,r,s,n;try{const i=e.req.param("id"),o=$(e,"sb-access-token");let l=null;if(o){const h=await J(o,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);h&&(l=h.email)}const c=O(e);let u=!1,a=!1;if(l)try{if(u=!!((t=(await c.sql("SELECT user_has_lesson_access($1::text, $2::integer) AS has_access",[l,parseInt(i)]))[0])!=null&&t.has_access),console.log("Has access:",u,"User:",l,"Lesson:",i),!u)if((await c.sql("SELECT expires_at FROM lesson_rentals WHERE user_email = $1 AND lesson_id = $2 AND expires_at > NOW()",[l,parseInt(i)])).length>0)u=!0;else{if((await c.sql("SELECT id FROM member_subscriptions WHERE email_membro = $1 AND data_expiracao > NOW() AND ativo = true LIMIT 1",[l])).length>0)u=!0;else{const S=e.env.DATABASE_SUITEPLUS;if(S){const L=await xt(l,S);L&&L>new Date&&(u=!0)}}if(!u){const S=await c.sql("SELECT rentable, rental_credits, title FROM lessons WHERE id = $1",[parseInt(i)]);return console.log("❌ Access denied for user:",l,"lesson:",i),e.json({error:"Access denied",message:"Você não tem permissão para acessar esta aula.",needsUpgrade:!0,rentable:((r=S[0])==null?void 0:r.rentable)||!1,rental_credits:((s=S[0])==null?void 0:s.rental_credits)||0,lesson_title:((n=S[0])==null?void 0:n.title)||""},403)}}console.log("✅ Access granted for user:",l,"lesson:",i)}catch(h){console.error("❌ Error checking access via RPC:",h),console.log("⚠️ Allowing access due to RPC error (fallback mode)"),a=!0,u=!0}if(!l||!u&&!a){const h=await c.query("lessons",{select:"teste_gratis",filters:{id:i},single:!0});if(!(h!=null&&h.teste_gratis))return e.json({error:"Access denied",message:"Esta é uma aula premium. Faça login e tenha um plano ativo para acessar.",needsLogin:!0},403)}const d=await c.sql(`
      SELECT l.*, m.title as module_title, c.title as course_title, c.id as course_id
      FROM lessons l
      LEFT JOIN modules m ON l.module_id = m.id
      LEFT JOIN courses c ON m.course_id = c.id
      WHERE l.id = $1
    `,[parseInt(i)]);if(!d||d.length===0)return e.json({error:"Lesson not found"},404);const p=d[0];await Et(c);const g=await c.query("comments",{select:"*",filters:{lesson_id:i},order:"created_at DESC"}),v=await c.sql(`
      SELECT
        t.id as trail_id,
        t.title as trail_title,
        tl.order_index,
        (SELECT COUNT(*)::int FROM trail_lessons WHERE trail_id = t.id) as total_lessons,
        (SELECT l2.id FROM trail_lessons tl2
         JOIN lessons l2 ON l2.id = tl2.lesson_id
         WHERE tl2.trail_id = t.id AND tl2.order_index < tl.order_index
         ORDER BY tl2.order_index DESC LIMIT 1) as prev_lesson_id,
        (SELECT l2.title FROM trail_lessons tl2
         JOIN lessons l2 ON l2.id = tl2.lesson_id
         WHERE tl2.trail_id = t.id AND tl2.order_index < tl.order_index
         ORDER BY tl2.order_index DESC LIMIT 1) as prev_lesson_title,
        (SELECT l2.id FROM trail_lessons tl2
         JOIN lessons l2 ON l2.id = tl2.lesson_id
         WHERE tl2.trail_id = t.id AND tl2.order_index > tl.order_index
         ORDER BY tl2.order_index ASC LIMIT 1) as next_lesson_id,
        (SELECT l2.title FROM trail_lessons tl2
         JOIN lessons l2 ON l2.id = tl2.lesson_id
         WHERE tl2.trail_id = t.id AND tl2.order_index > tl.order_index
         ORDER BY tl2.order_index ASC LIMIT 1) as next_lesson_title
      FROM trail_lessons tl
      JOIN trails t ON t.id = tl.trail_id
      WHERE tl.lesson_id = $1 AND t.is_published = true
      ORDER BY t.order_index
    `,[parseInt(i)]);return e.json({lesson:p,comments:g,trails:v})}catch(i){return console.error("Error fetching lesson:",i),e.json({error:"Failed to fetch lesson"},500)}});N.get("/api/admin/comments",q,async e=>{try{const t=e.req.query("status")||"all",r=(e.req.query("search")||"").trim(),s=O(e);await Et(s);const n=[],i=[];t==="pending"?n.push("NULLIF(TRIM(COALESCE(c.admin_reply, '')), '') IS NULL"):t==="answered"&&n.push("NULLIF(TRIM(COALESCE(c.admin_reply, '')), '') IS NOT NULL"),r&&(i.push(`%${r}%`),n.push(`(
        c.comment_text ILIKE $${i.length}
        OR c.user_name ILIKE $${i.length}
        OR c.user_email ILIKE $${i.length}
        OR l.title ILIKE $${i.length}
        OR m.title ILIKE $${i.length}
        OR co.title ILIKE $${i.length}
      )`));const o=n.length?`WHERE ${n.join(" AND ")}`:"",l=await s.sql(`
      SELECT
        c.*,
        l.title AS lesson_title,
        l.video_provider,
        l.video_id,
        l.video_url,
        m.title AS module_title,
        co.title AS course_title,
        CASE
          WHEN l.video_url IS NOT NULL AND l.video_url <> '' THEN l.video_url
          WHEN l.video_provider = 'youtube' AND l.video_id IS NOT NULL AND l.video_id <> '' THEN 'https://www.youtube.com/watch?v=' || l.video_id
          WHEN l.video_provider = 'vimeo' AND l.video_id IS NOT NULL AND l.video_id <> '' THEN 'https://vimeo.com/' || l.video_id
          WHEN l.video_provider = 'url' THEN l.video_id
          ELSE NULL
        END AS lesson_video_link
      FROM comments c
      JOIN lessons l ON l.id = c.lesson_id
      LEFT JOIN modules m ON m.id = l.module_id
      LEFT JOIN courses co ON co.id = m.course_id
      ${o}
      ORDER BY c.created_at DESC
      LIMIT 200
    `,i);return e.json({comments:l})}catch(t){return console.error("List admin comments error:",t),e.json({error:t.message||"Failed to list comments"},500)}});N.put("/api/admin/comments/:id/reply",q,async e=>{try{const t=parseInt(e.req.param("id")),{admin_reply:r}=await e.req.json(),s=e.get("user"),n=String(r||"").trim(),i=O(e);await Et(i);const o=await i.update("comments",{id:t},{admin_reply:n||null,admin_replied_at:n?new Date().toISOString():null,admin_replied_by:n&&(s==null?void 0:s.email)||null});return e.json({success:!0,comment:o[0]||null})}catch(t){return console.error("Reply comment error:",t),e.json({error:t.message||"Failed to reply comment"},500)}});N.delete("/api/admin/comments/:id",q,async e=>{try{const t=parseInt(e.req.param("id")),r=O(e);return await Et(r),await r.delete("comments",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete comment error:",t),e.json({error:t.message||"Failed to delete comment"},500)}});N.post("/api/lessons/:id/comments",async e=>{var t,r;try{const s=e.req.param("id"),{comment_text:n}=await e.req.json(),i=$(e,"sb-access-token");if(!i)return e.json({error:"Unauthorized"},401);const o=await J(i,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!o)return e.json({error:"Unauthorized"},401);if(!n||!n.trim())return e.json({error:"Comment text is required"},400);const l=((t=o.user_metadata)==null?void 0:t.full_name)||((r=o.email)==null?void 0:r.split("@")[0])||"Usuário",u=await O(e).insert("comments",{lesson_id:parseInt(s),user_name:l,user_email:o.email,comment_text:n.trim()});return e.json({success:!0,comment_id:u[0].id})}catch(s){return console.error("Add comment error:",s),e.json({error:s.message||"Failed to add comment"},500)}});N.get("/api/progress/:email/:courseId",async e=>{try{const t=e.req.param("email"),r=e.req.param("courseId"),i=await O(e).sql(`
      SELECT up.*, l.module_id
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      WHERE up.user_email = $1 AND m.course_id = $2
    `,[t,parseInt(r)]);return e.json({progress:i||[]})}catch(t){return console.error("❌ /api/progress error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch progress"},500)}});N.post("/api/progress/complete",async e=>{try{const{user_email:t,lesson_id:r}=await e.req.json();if(!t||!r)return e.json({error:"Missing required fields"},400);const s=O(e),n=await s.query("user_progress",{select:"*",filters:{user_email:t,lesson_id:r}});return n&&n.length>0?await s.update("user_progress",{id:n[0].id},{completed:!0,completed_at:new Date().toISOString()}):await s.insert("user_progress",{user_email:t,lesson_id:parseInt(r),completed:!0,completed_at:new Date().toISOString()}),e.json({success:!0})}catch{return e.json({error:"Failed to update progress"},500)}});N.post("/api/progress/uncomplete",async e=>{try{const{user_email:t,lesson_id:r}=await e.req.json();if(!t||!r)return e.json({error:"Missing required fields"},400);const s=O(e),n=await s.query("user_progress",{select:"*",filters:{user_email:t,lesson_id:r}});return n&&n.length>0&&await s.delete("user_progress",{id:n[0].id}),e.json({success:!0})}catch{return e.json({error:"Failed to update progress"},500)}});N.post("/api/admin/certificate-template",q,async e=>{try{const t=await e.req.json(),{course_id:r,image_data:s,verso_data:n}=t;if(!r||!s)return e.json({error:"ID do curso e imagem da frente são obrigatórios"},400);const i=b=>{const v=b.match(/^data:([^;]+);base64,/);return v?v[1]:"image/jpeg"},o=b=>b.includes(",")?b.split(",")[1]:b,l=i(s),c=o(s),u=n?i(n):null,a=n?o(n):null,f=`/api/certificate-template/${r}/image`,d=n?`/api/certificate-template/${r}/verso`:null,p=O(e),g=await p.query("certificate_templates",{select:"*",filters:{course_id:r}});if(g&&g.length>0){const b={template_url:f,template_data:c,template_mime:l,updated_at:new Date().toISOString()};n!==void 0&&(b.verso_data=a,b.verso_mime=u),await p.update("certificate_templates",{id:g[0].id},b)}else await p.insert("certificate_templates",{course_id:parseInt(r),template_url:f,template_data:c,template_mime:l,verso_data:a,verso_mime:u,created_at:new Date().toISOString(),updated_at:new Date().toISOString()});return console.log("✅ Certificate template saved to Postgres"),e.json({success:!0,template_url:f,verso_url:d,message:"Template de certificado salvo com sucesso!"})}catch(t){return console.error("💥 Certificate template error:",t),e.json({error:"Erro ao salvar template de certificado",details:t.message},500)}});N.get("/api/certificate-template/:courseId/image",async e=>{try{const t=e.req.param("courseId"),s=await O(e).query("certificate_templates",{select:"template_data, template_mime",filters:{course_id:t},single:!0});if(!(s!=null&&s.template_data))return e.json({error:"Imagem não encontrada"},404);const n=Uint8Array.from(atob(s.template_data),i=>i.charCodeAt(0));return new Response(n,{headers:{"Content-Type":s.template_mime||"image/jpeg","Cache-Control":"public, max-age=86400"}})}catch{return e.json({error:"Erro ao buscar imagem"},500)}});N.get("/api/certificate-template/:courseId/verso",async e=>{try{const t=e.req.param("courseId"),s=await O(e).query("certificate_templates",{select:"verso_data, verso_mime",filters:{course_id:t},single:!0});if(!(s!=null&&s.verso_data))return e.json({error:"Verso não encontrado"},404);const n=Uint8Array.from(atob(s.verso_data),i=>i.charCodeAt(0));return new Response(n,{headers:{"Content-Type":s.verso_mime||"image/jpeg","Cache-Control":"public, max-age=86400"}})}catch{return e.json({error:"Erro ao buscar verso"},500)}});N.get("/api/certificate-template/:courseId",async e=>{try{const t=e.req.param("courseId"),r=O(e),s=await r.query("certificate_templates",{select:"id, course_id, template_mime, verso_mime, created_at, updated_at",filters:{course_id:t},single:!0});if(s){s.template_url=`/api/certificate-template/${t}/image`;const n=await r.query("certificate_templates",{select:"verso_data",filters:{course_id:t},single:!0});s.verso_url=n!=null&&n.verso_data?`/api/certificate-template/${t}/verso`:null}return e.json({template:s})}catch{return e.json({template:null})}});N.post("/api/certificates/generate",async e=>{var t,r,s;try{const n=$(e,"sb-access-token");if(!n)return e.json({error:"Não autenticado"},401);const i=await J(n,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!i)return e.json({error:"Usuário não encontrado"},401);const{course_id:o}=await e.req.json();if(console.log("📜 Certificate generation request:",{user_email:i.email,course_id:o}),!o)return e.json({error:"ID do curso é obrigatório"},400);const l=O(e),c=await l.query("certificates",{select:"*",filters:{user_email:i.email,course_id:o}});if(c&&c.length>0)return console.log("✅ Certificate already exists"),e.json({success:!0,certificate:c[0],message:"Certificado já existe!"});const u=await l.query("courses",{select:"*",filters:{id:o},single:!0});if(!u)return e.json({error:"Curso não encontrado"},404);const a=await l.query("modules",{select:"*",filters:{course_id:o}});let f=[];if(a)for(const v of a){const h=await l.query("lessons",{select:"id",filters:{module_id:v.id}});h&&(f=[...f,...h.map(y=>y.id)])}if(f.length===0)return e.json({error:"Curso não possui aulas"},400);const p=(await l.query("user_progress",{select:"*",filters:{user_email:i.email}})||[]).filter(v=>v.completed&&f.includes(v.lesson_id)).map(v=>v.lesson_id),g=p.length/f.length*100;if(console.log("📊 Course completion:",{total_lessons:f.length,completed_lessons:p.length,percentage:g}),g<100)return e.json({error:"Você precisa completar 100% do curso para receber o certificado",completion:g},400);const b=await l.insert("certificates",{user_email:i.email,user_name:((t=i.user_metadata)==null?void 0:t.name)||"Aluno",course_id:parseInt(o),course_title:u.title,issued_at:new Date().toISOString(),completion_date:new Date().toISOString()});return console.log("✅ Certificate generated successfully"),e.json({success:!0,certificate:b,message:"Parabéns! Seu certificado foi gerado com sucesso!"})}catch(n){return console.error("💥 Certificate generation error:",n),console.error("Error details:",n.message),(r=n.message)!=null&&r.includes("certificates")||(s=n.message)!=null&&s.includes("relation")?e.json({error:"Tabela de certificados não encontrada. Execute a migração SQL no Supabase.",details:n.message},500):e.json({error:"Erro ao gerar certificado",details:n.message},500)}});N.get("/api/certificates",async e=>{try{const t=$(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const r=await J(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({error:"Usuário não encontrado"},401);const s=O(e),n=await s.query("certificates",{select:"*",filters:{user_email:r.email},order:"issued_at DESC"})||[],i=await Promise.all(n.map(async o=>{const l=await s.query("certificate_templates",{select:"*",filters:{course_id:o.course_id},single:!0});return{...o,template_url:(l==null?void 0:l.template_url)||null}}));return e.json({certificates:i})}catch(t){return console.error("💥 Certificates fetch error:",t),e.json({error:"Erro ao buscar certificados"},500)}});N.get("/api/certificates/:id",async e=>{try{const t=e.req.param("id"),r=O(e),s=await r.query("certificates",{select:"*",filters:{id:t},single:!0});if(!s)return e.json({error:"Certificado não encontrado"},404);const n=await r.query("certificate_templates",{select:"*",filters:{course_id:s.course_id},single:!0});return e.json({certificate:{...s,template_url:(n==null?void 0:n.template_url)||null}})}catch{return e.json({error:"Erro ao buscar certificado"},500)}});N.get("/api/plans",async e=>{try{const r=await O(e).query("plans",{select:"*",filters:{is_active:!0},order:"display_order"})||[];return e.json({plans:r})}catch{return e.json({error:"Erro ao buscar planos"},500)}});N.get("/api/subscriptions/current",async e=>{try{const t=$(e,"sb-access-token");if(!t)return e.json({subscription:null});const r=await J(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({subscription:null});const i=await O(e).sql(`
      SELECT s.*, p.name as plan_name, p.monthly_price, p.duration_days
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_email = $1 AND s.status = 'active'
      ORDER BY s.end_date DESC
      LIMIT 1
    `,[r.email]);return e.json({subscription:i&&i.length>0?i[0]:null})}catch(t){return console.error("Error fetching subscription:",t),e.json({subscription:null})}});N.post("/api/admin/subscriptions",q,async e=>{try{const{user_email:t,plan_id:r,duration_days:s}=await e.req.json();if(!t||!r)return e.json({error:"Email e plano são obrigatórios"},400);const n=O(e),i=await n.query("plans",{select:"*",filters:{id:r},single:!0});if(!i)return e.json({error:"Plano não encontrado"},404);const o=new Date;o.setDate(o.getDate()+(s||i.duration_days));const l=o.toISOString(),c=await n.insert("member_subscriptions",{email_membro:t,data_expiracao:l,detalhe:i.name,origem:"admin",teste_gratis:i.is_free_trial||!1,ativo:!0}),u=await n.query("users",{select:"id",filters:{email:t},single:!0});return u&&await n.update("users",{id:u.id},{dt_expiracao:l,updated_at:new Date().toISOString()}),e.json({success:!0,message:"Assinatura criada com sucesso!",subscription:c[0]})}catch(t){return console.error("Error creating subscription:",t),e.json({error:"Erro ao criar assinatura"},500)}});N.get("/api/lessons/:id/access",async e=>{var t;try{const r=e.req.param("id"),s=$(e,"sb-access-token");if(!s){const u=await O(e).query("lessons",{select:"teste_gratis",filters:{id:r},single:!0});return e.json({hasAccess:(u==null?void 0:u.teste_gratis)||!1,reason:u!=null&&u.teste_gratis?"free_lesson":"not_authenticated"})}const n=await J(s,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!n)return e.json({hasAccess:!1,reason:"invalid_token"});let l=!!((t=(await O(e).sql("SELECT user_has_lesson_access($1::text, $2::integer) AS has_access",[n.email,parseInt(r)]))[0])!=null&&t.has_access);if(!l){const c=e.env.DATABASE_SUITEPLUS;if(c){const u=await xt(n.email,c);u&&u>new Date&&(l=!0)}}return e.json({hasAccess:l,reason:l?"active_subscription":"no_active_subscription"})}catch(r){return console.error("Error checking lesson access:",r),e.json({hasAccess:!1,reason:"error"},500)}});N.post("/api/admin/subscriptions/expire",q,async e=>{try{return await O(e).rpc("expire_subscriptions",{}),e.json({success:!0,message:"Assinaturas expiradas com sucesso!"})}catch(t){return console.error("Error expiring subscriptions:",t),e.json({error:"Erro ao expirar assinaturas"},500)}});N.get("/api/admin/plans",q,async e=>{try{const r=await O(e).query("plans",{select:"*",order:"display_order"})||[];return e.json({plans:r})}catch{return e.json({error:"Erro ao buscar planos"},500)}});N.post("/api/admin/plans",q,async e=>{try{const t=await e.req.json(),{id:r,name:s,description:n,price:i,duration_days:o,is_active:l,is_free_trial:c,features:u,display_order:a}=t,f=O(e);if(r)return await f.update("plans",{id:r},{name:s,description:n,price:parseFloat(i),duration_days:parseInt(o),is_active:l,is_free_trial:c,features:u||[],display_order:parseInt(a||0),updated_at:new Date().toISOString()}),e.json({success:!0,message:"Plano atualizado!"});{const d=await f.insert("plans",{name:s,description:n,price:parseFloat(i),duration_days:parseInt(o),is_active:l,is_free_trial:c,features:u||[],display_order:parseInt(a||0)});return e.json({success:!0,plan:d[0],message:"Plano criado!"})}}catch(t){return console.error("Error saving plan:",t),e.json({error:"Erro ao salvar plano"},500)}});N.get("/api/admin/subscriptions",q,async e=>{try{const t=O(e),r=await t.query("subscriptions",{select:"*",order:"created_at DESC"})||[],s=await Promise.all(r.map(async n=>{const i=await t.query("plans",{select:"*",filters:{id:n.plan_id},single:!0});return{...n,plan_name:(i==null?void 0:i.name)||"Desconhecido"}}));return e.json({subscriptions:s})}catch{return e.json({error:"Erro ao buscar assinaturas"},500)}});N.get("/recover",e=>e.html(`
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
  `));N.get("/reset-password",e=>e.html(`
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
  `));N.get("/test-continue",e=>e.html(`
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
  `));N.get("/admin",e=>e.html(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <title>Admin — CCT</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen">
  <header class="bg-purple-700 text-white px-4 py-3 flex items-center gap-4 shadow">
    <a href="/" class="flex items-center gap-2 text-purple-200 hover:text-white transition-colors text-sm font-semibold">
      <i class="fas fa-arrow-left"></i>
      <span>Voltar ao site</span>
    </a>
    <span class="text-purple-300">|</span>
    <span class="font-bold text-lg"><i class="fas fa-tools mr-2"></i>Painel Admin</span>
  </header>
  <main>
    <div id="loadingAdmin" class="text-center py-16">
      <i class="fas fa-spinner fa-spin text-4xl text-purple-500"></i>
      <p class="mt-4 text-gray-500">Carregando painel admin...</p>
    </div>
    <div id="adminView" class="hidden"></div>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
  <script src="/static/auth.js?v=whatsapp-floating-20260602"><\/script>
  <script src="/static/admin.js?v=8"><\/script>
  <script>
    document.addEventListener('DOMContentLoaded', async () => {
      const isAdmin = await adminManager.checkAdmin()
      document.getElementById('loadingAdmin').remove()
      if (!isAdmin) {
        document.querySelector('main').innerHTML = \`
          <div class="text-center py-16">
            <i class="fas fa-lock text-4xl text-red-400"></i>
            <p class="mt-4 text-red-600 font-semibold">Acesso negado. Você não tem permissão de administrador.</p>
            <a href="/" class="mt-6 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Voltar ao site</a>
          </div>\`
        return
      }
      document.getElementById('adminView').classList.remove('hidden')
      await adminUI.loadData()
      adminUI.renderAdminPanel()
    })
  <\/script>
</body>
</html>`));N.get("/aula/:id",e=>e.redirect(`/?aula=${e.req.param("id")}`));N.get("/curso/:id",e=>e.redirect(`/?curso=${e.req.param("id")}`));N.get("/",e=>e.html(`
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
          
          /* Markdown rendered content */
          .md-body h1 { font-size: 1.4em; font-weight: 700; margin: 1em 0 .4em; color: #1e293b; }
          .md-body h2 { font-size: 1.2em; font-weight: 700; margin: 1em 0 .4em; color: #1e293b; }
          .md-body h3 { font-size: 1.05em; font-weight: 600; margin: .8em 0 .3em; color: #334155; }
          .md-body p  { margin: .5em 0; }
          .md-body ul, .md-body ol { padding-left: 1.4em; margin: .5em 0; }
          .md-body ul { list-style: disc; }
          .md-body ol { list-style: decimal; }
          .md-body li { margin: .25em 0; }
          .md-body strong { font-weight: 700; }
          .md-body em { font-style: italic; }
          .md-body blockquote { border-left: 4px solid #a855f7; background: #faf5ff; padding: .5em 1em; margin: .75em 0; border-radius: 0 .5em .5em 0; color: #6b21a8; }
          .md-body code { background: #f1f5f9; padding: .1em .3em; border-radius: .25em; font-size: .9em; font-family: monospace; }
          .md-body pre { background: #1e293b; color: #e2e8f0; padding: 1em; border-radius: .5em; overflow-x: auto; margin: .75em 0; }
          .md-body pre code { background: none; padding: 0; color: inherit; }
          .md-body hr { border: none; border-top: 1px solid #e2e8f0; margin: 1em 0; }

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
                        <button onclick="window.open('/admin', '_blank')"
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
        <script defer src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
        <script defer src="/static/auth.js?v=whatsapp-floating-20260602"><\/script>
        <script defer src="/static/admin.js?v=8"><\/script>
        <script defer src="/static/access-control.js?v=3"><\/script>
        <script defer src="/static/app.js?v=16"><\/script>
        <script defer src="/static/search.js?v=4"><\/script>
    </body>
    </html>
  `));N.get("/course/:courseId",e=>{const t=e.req.param("courseId");return e.html(`<!DOCTYPE html>
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
</html>`)});N.get("/lesson/:lessonId",e=>{const t=e.req.param("lessonId");return e.html(`<!DOCTYPE html>
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
</html>`)});N.get("/api/favorites",Y,async e=>{const t=e.get("user"),r=O(e);try{const s=await r.sql(`
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
    `,[t.email]);return e.json(s)}finally{await r.end()}});N.post("/api/favorites",Y,async e=>{const t=e.get("user"),r=await e.req.json();if(!r.lesson_id)return e.json({error:"lesson_id required"},400);const s=O(e);try{return await s.sql("INSERT INTO user_favorites (user_email, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",[t.email,r.lesson_id]),e.json({ok:!0})}finally{await s.end()}});N.delete("/api/favorites/:lessonId",Y,async e=>{const t=e.get("user"),r=parseInt(e.req.param("lessonId")),s=O(e);try{return await s.sql("DELETE FROM user_favorites WHERE user_email = $1 AND lesson_id = $2",[t.email,r]),e.json({ok:!0})}finally{await s.end()}});N.get("/api/favorites/check/:lessonId",Y,async e=>{const t=e.get("user"),r=parseInt(e.req.param("lessonId")),s=O(e);try{const n=await s.sql("SELECT id FROM user_favorites WHERE user_email = $1 AND lesson_id = $2 LIMIT 1",[t.email,r]);return e.json({favorite:n.length>0})}finally{await s.end()}});N.get("/favorites",e=>e.html(`
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
<script defer src="/static/auth.js?v=whatsapp-floating-20260602"><\/script>
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
  `));N.get("/certificates",e=>e.html(`
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
    <script src="/static/auth.js?v=whatsapp-floating-20260602"><\/script>
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
  `));N.get("/profile",e=>e.html(`
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
    <script src="/static/auth.js?v=whatsapp-floating-20260602"><\/script>
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
  `));N.get("/certificates",e=>e.html(`
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
    <script src="/static/auth.js?v=whatsapp-floating-20260602"><\/script>
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
  `));const Ls=new Kn,qo=Object.assign({"/src/index.tsx":N});let oi=!1;for(const[,e]of Object.entries(qo))e&&(Ls.all("*",t=>{let r;try{r=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,r)}),Ls.notFound(t=>{let r;try{r=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,r)}),oi=!0);if(!oi)throw new Error("Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']");var ar={exports:{}},lr={exports:{}},Le={},cr={},qs;function ai(){if(qs)return cr;qs=1,cr.parse=function(r,s){return new e(r,s).parse()};class e{constructor(s,n){this.source=s,this.transform=n||t,this.position=0,this.entries=[],this.recorded=[],this.dimension=0}isEof(){return this.position>=this.source.length}nextCharacter(){var s=this.source[this.position++];return s==="\\"?{value:this.source[this.position++],escaped:!0}:{value:s,escaped:!1}}record(s){this.recorded.push(s)}newEntry(s){var n;(this.recorded.length>0||s)&&(n=this.recorded.join(""),n==="NULL"&&!s&&(n=null),n!==null&&(n=this.transform(n)),this.entries.push(n),this.recorded=[])}consumeDimensions(){if(this.source[0]==="[")for(;!this.isEof();){var s=this.nextCharacter();if(s.value==="=")break}}parse(s){var n,i,o;for(this.consumeDimensions();!this.isEof();)if(n=this.nextCharacter(),n.value==="{"&&!o)this.dimension++,this.dimension>1&&(i=new e(this.source.substr(this.position-1),this.transform),this.entries.push(i.parse(!0)),this.position+=i.position-2);else if(n.value==="}"&&!o){if(this.dimension--,!this.dimension&&(this.newEntry(),s))return this.entries}else n.value==='"'&&!n.escaped?(o&&this.newEntry(!0),o=!o):n.value===","&&!o?this.newEntry():this.record(n.value);if(this.dimension!==0)throw new Error("array dimension not balanced");return this.entries}}function t(r){return r}return cr}var ur,Ds;function li(){if(Ds)return ur;Ds=1;var e=ai();return ur={create:function(t,r){return{parse:function(){return e.parse(t,r)}}}},ur}var dr,js;function Do(){if(js)return dr;js=1;var e=/(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/,t=/^(\d{1,})-(\d{2})-(\d{2})( BC)?$/,r=/([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/,s=/^-?infinity$/;dr=function(u){if(s.test(u))return Number(u.replace("i","I"));var a=e.exec(u);if(!a)return n(u)||null;var f=!!a[8],d=parseInt(a[1],10);f&&(d=o(d));var p=parseInt(a[2],10)-1,g=a[3],b=parseInt(a[4],10),v=parseInt(a[5],10),h=parseInt(a[6],10),y=a[7];y=y?1e3*parseFloat(y):0;var E,S=i(u);return S!=null?(E=new Date(Date.UTC(d,p,g,b,v,h,y)),l(d)&&E.setUTCFullYear(d),S!==0&&E.setTime(E.getTime()-S)):(E=new Date(d,p,g,b,v,h,y),l(d)&&E.setFullYear(d)),E};function n(c){var u=t.exec(c);if(u){var a=parseInt(u[1],10),f=!!u[4];f&&(a=o(a));var d=parseInt(u[2],10)-1,p=u[3],g=new Date(a,d,p);return l(a)&&g.setFullYear(a),g}}function i(c){if(c.endsWith("+00"))return 0;var u=r.exec(c.split(" ")[1]);if(u){var a=u[1];if(a==="Z")return 0;var f=a==="-"?-1:1,d=parseInt(u[2],10)*3600+parseInt(u[3]||0,10)*60+parseInt(u[4]||0,10);return d*f*1e3}}function o(c){return-(c-1)}function l(c){return c>=0&&c<100}return dr}var fr,ks;function jo(){if(ks)return fr;ks=1,fr=t;var e=Object.prototype.hasOwnProperty;function t(r){for(var s=1;s<arguments.length;s++){var n=arguments[s];for(var i in n)e.call(n,i)&&(r[i]=n[i])}return r}return fr}var pr,Bs;function ko(){if(Bs)return pr;Bs=1;var e=jo();pr=t;function t(v){if(!(this instanceof t))return new t(v);e(this,b(v))}var r=["seconds","minutes","hours","days","months","years"];t.prototype.toPostgres=function(){var v=r.filter(this.hasOwnProperty,this);return this.milliseconds&&v.indexOf("seconds")<0&&v.push("seconds"),v.length===0?"0":v.map(function(h){var y=this[h]||0;return h==="seconds"&&this.milliseconds&&(y=(y+this.milliseconds/1e3).toFixed(6).replace(/\.?0+$/,"")),y+" "+h},this).join(" ")};var s={years:"Y",months:"M",days:"D",hours:"H",minutes:"M",seconds:"S"},n=["years","months","days"],i=["hours","minutes","seconds"];t.prototype.toISOString=t.prototype.toISO=function(){var v=n.map(y,this).join(""),h=i.map(y,this).join("");return"P"+v+"T"+h;function y(E){var S=this[E]||0;return E==="seconds"&&this.milliseconds&&(S=(S+this.milliseconds/1e3).toFixed(6).replace(/0+$/,"")),S+s[E]}};var o="([+-]?\\d+)",l=o+"\\s+years?",c=o+"\\s+mons?",u=o+"\\s+days?",a="([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?",f=new RegExp([l,c,u,a].map(function(v){return"("+v+")?"}).join("\\s*")),d={years:2,months:4,days:6,hours:9,minutes:10,seconds:11,milliseconds:12},p=["hours","minutes","seconds","milliseconds"];function g(v){var h=v+"000000".slice(v.length);return parseInt(h,10)/1e3}function b(v){if(!v)return{};var h=f.exec(v),y=h[8]==="-";return Object.keys(d).reduce(function(E,S){var L=d[S],A=h[L];return!A||(A=S==="milliseconds"?g(A):parseInt(A,10),!A)||(y&&~p.indexOf(S)&&(A*=-1),E[S]=A),E},{})}return pr}var hr,Ms;function Bo(){if(Ms)return hr;Ms=1;var e=Buffer.from||Buffer;return hr=function(r){if(/^\\x/.test(r))return e(r.substr(2),"hex");for(var s="",n=0;n<r.length;)if(r[n]!=="\\")s+=r[n],++n;else if(/[0-7]{3}/.test(r.substr(n+1,3)))s+=String.fromCharCode(parseInt(r.substr(n+1,3),8)),n+=4;else{for(var i=1;n+i<r.length&&r[n+i]==="\\";)i++;for(var o=0;o<Math.floor(i/2);++o)s+="\\";n+=Math.floor(i/2)*2}return e(s,"binary")},hr}var mr,Us;function Mo(){if(Us)return mr;Us=1;var e=ai(),t=li(),r=Do(),s=ko(),n=Bo();function i(m){return function(w){return w===null?w:m(w)}}function o(m){return m===null?m:m==="TRUE"||m==="t"||m==="true"||m==="y"||m==="yes"||m==="on"||m==="1"}function l(m){return m?e.parse(m,o):null}function c(m){return parseInt(m,10)}function u(m){return m?e.parse(m,i(c)):null}function a(m){return m?e.parse(m,i(function(_){return y(_).trim()})):null}var f=function(m){if(!m)return null;var _=t.create(m,function(w){return w!==null&&(w=S(w)),w});return _.parse()},d=function(m){if(!m)return null;var _=t.create(m,function(w){return w!==null&&(w=parseFloat(w)),w});return _.parse()},p=function(m){if(!m)return null;var _=t.create(m);return _.parse()},g=function(m){if(!m)return null;var _=t.create(m,function(w){return w!==null&&(w=r(w)),w});return _.parse()},b=function(m){if(!m)return null;var _=t.create(m,function(w){return w!==null&&(w=s(w)),w});return _.parse()},v=function(m){return m?e.parse(m,i(n)):null},h=function(m){return parseInt(m,10)},y=function(m){var _=String(m);return/^\d+$/.test(_)?_:m},E=function(m){return m?e.parse(m,i(JSON.parse)):null},S=function(m){return m[0]!=="("?null:(m=m.substring(1,m.length-1).split(","),{x:parseFloat(m[0]),y:parseFloat(m[1])})},L=function(m){if(m[0]!=="<"&&m[1]!=="(")return null;for(var _="(",w="",T=!1,C=2;C<m.length-1;C++){if(T||(_+=m[C]),m[C]===")"){T=!0;continue}else if(!T)continue;m[C]!==","&&(w+=m[C])}var I=S(_);return I.radius=parseFloat(w),I},A=function(m){m(20,y),m(21,h),m(23,h),m(26,h),m(700,parseFloat),m(701,parseFloat),m(16,o),m(1082,r),m(1114,r),m(1184,r),m(600,S),m(651,p),m(718,L),m(1e3,l),m(1001,v),m(1005,u),m(1007,u),m(1028,u),m(1016,a),m(1017,f),m(1021,d),m(1022,d),m(1231,d),m(1014,p),m(1015,p),m(1008,p),m(1009,p),m(1040,p),m(1041,p),m(1115,g),m(1182,g),m(1185,g),m(1186,s),m(1187,b),m(17,n),m(114,JSON.parse.bind(JSON)),m(3802,JSON.parse.bind(JSON)),m(199,E),m(3807,E),m(3907,p),m(2951,p),m(791,p),m(1183,p),m(1270,p)};return mr={init:A},mr}var gr,Fs;function Uo(){if(Fs)return gr;Fs=1;var e=1e6;function t(r){var s=r.readInt32BE(0),n=r.readUInt32BE(4),i="";s<0&&(s=~s+(n===0),n=~n+1>>>0,i="-");var o="",l,c,u,a,f,d;{if(l=s%e,s=s/e>>>0,c=4294967296*l+n,n=c/e>>>0,u=""+(c-e*n),n===0&&s===0)return i+u+o;for(a="",f=6-u.length,d=0;d<f;d++)a+="0";o=a+u+o}{if(l=s%e,s=s/e>>>0,c=4294967296*l+n,n=c/e>>>0,u=""+(c-e*n),n===0&&s===0)return i+u+o;for(a="",f=6-u.length,d=0;d<f;d++)a+="0";o=a+u+o}{if(l=s%e,s=s/e>>>0,c=4294967296*l+n,n=c/e>>>0,u=""+(c-e*n),n===0&&s===0)return i+u+o;for(a="",f=6-u.length,d=0;d<f;d++)a+="0";o=a+u+o}return l=s%e,c=4294967296*l+n,u=""+c%e,i+u+o}return gr=t,gr}var br,Hs;function Fo(){if(Hs)return br;Hs=1;var e=Uo(),t=function(p,g,b,v,h){b=b||0,v=v||!1,h=h||function(T,C,I){return T*Math.pow(2,I)+C};var y=b>>3,E=function(T){return v?~T&255:T},S=255,L=8-b%8;g<L&&(S=255<<8-g&255,L=g),b&&(S=S>>b%8);var A=0;b%8+g>=8&&(A=h(0,E(p[y])&S,L));for(var m=g+b>>3,_=y+1;_<m;_++)A=h(A,E(p[_]),8);var w=(g+b)%8;return w>0&&(A=h(A,E(p[m])>>8-w,w)),A},r=function(p,g,b){var v=Math.pow(2,b-1)-1,h=t(p,1),y=t(p,b,1);if(y===0)return 0;var E=1,S=function(A,m,_){A===0&&(A=1);for(var w=1;w<=_;w++)E/=2,(m&1<<_-w)>0&&(A+=E);return A},L=t(p,g,b+1,!1,S);return y==Math.pow(2,b+1)-1?L===0?h===0?1/0:-1/0:NaN:(h===0?1:-1)*Math.pow(2,y-v)*L},s=function(p){return t(p,1)==1?-1*(t(p,15,1,!0)+1):t(p,15,1)},n=function(p){return t(p,1)==1?-1*(t(p,31,1,!0)+1):t(p,31,1)},i=function(p){return r(p,23,8)},o=function(p){return r(p,52,11)},l=function(p){var g=t(p,16,32);if(g==49152)return NaN;for(var b=Math.pow(1e4,t(p,16,16)),v=0,h=t(p,16),y=0;y<h;y++)v+=t(p,16,64+16*y)*b,b/=1e4;var E=Math.pow(10,t(p,16,48));return(g===0?1:-1)*Math.round(v*E)/E},c=function(p,g){var b=t(g,1),v=t(g,63,1),h=new Date((b===0?1:-1)*v/1e3+9466848e5);return p||h.setTime(h.getTime()+h.getTimezoneOffset()*6e4),h.usec=v%1e3,h.getMicroSeconds=function(){return this.usec},h.setMicroSeconds=function(y){this.usec=y},h.getUTCMicroSeconds=function(){return this.usec},h},u=function(p){var g=t(p,32);t(p,32,32);for(var b=t(p,32,64),v=96,h=[],y=0;y<g;y++)h[y]=t(p,32,v),v+=32,v+=32;var E=function(L){var A=t(p,32,v);if(v+=32,A==4294967295)return null;var m;if(L==23||L==20)return m=t(p,A*8,v),v+=A*8,m;if(L==25)return m=p.toString(this.encoding,v>>3,(v+=A<<3)>>3),m;console.log("ERROR: ElementType not implemented: "+L)},S=function(L,A){var m=[],_;if(L.length>1){var w=L.shift();for(_=0;_<w;_++)m[_]=S(L,A);L.unshift(w)}else for(_=0;_<L[0];_++)m[_]=E(A);return m};return S(h,b)},a=function(p){return p.toString("utf8")},f=function(p){return p===null?null:t(p,8)>0},d=function(p){p(20,e),p(21,s),p(23,n),p(26,n),p(1700,l),p(700,i),p(701,o),p(16,f),p(1114,c.bind(null,!1)),p(1184,c.bind(null,!0)),p(1e3,u),p(1007,u),p(1016,u),p(1008,u),p(1009,u),p(25,a)};return br={init:d},br}var yr,zs;function Ho(){return zs||(zs=1,yr={BOOL:16,BYTEA:17,CHAR:18,INT8:20,INT2:21,INT4:23,REGPROC:24,TEXT:25,OID:26,TID:27,XID:28,CID:29,JSON:114,XML:142,PG_NODE_TREE:194,SMGR:210,PATH:602,POLYGON:604,CIDR:650,FLOAT4:700,FLOAT8:701,ABSTIME:702,RELTIME:703,TINTERVAL:704,CIRCLE:718,MACADDR8:774,MONEY:790,MACADDR:829,INET:869,ACLITEM:1033,BPCHAR:1042,VARCHAR:1043,DATE:1082,TIME:1083,TIMESTAMP:1114,TIMESTAMPTZ:1184,INTERVAL:1186,TIMETZ:1266,BIT:1560,VARBIT:1562,NUMERIC:1700,REFCURSOR:1790,REGPROCEDURE:2202,REGOPER:2203,REGOPERATOR:2204,REGCLASS:2205,REGTYPE:2206,UUID:2950,TXID_SNAPSHOT:2970,PG_LSN:3220,PG_NDISTINCT:3361,PG_DEPENDENCIES:3402,TSVECTOR:3614,TSQUERY:3615,GTSVECTOR:3642,REGCONFIG:3734,REGDICTIONARY:3769,JSONB:3802,REGNAMESPACE:4089,REGROLE:4096}),yr}var Vs;function _t(){if(Vs)return Le;Vs=1;var e=Mo(),t=Fo(),r=li(),s=Ho();Le.getTypeParser=o,Le.setTypeParser=l,Le.arrayParser=r,Le.builtins=s;var n={text:{},binary:{}};function i(c){return String(c)}function o(c,u){return u=u||"text",n[u]&&n[u][c]||i}function l(c,u,a){typeof u=="function"&&(a=u,u="text"),n[u][c]=a}return e.init(function(c,u){n.text[c]=u}),t.init(function(c,u){n.binary[c]=u}),Le}var Qs;function St(){return Qs||(Qs=1,(function(e){var t={};let r;try{r=process.platform==="win32"?t.USERNAME:t.USER}catch{}e.exports={host:"localhost",user:r,database:void 0,password:null,connectionString:void 0,port:5432,rows:0,binary:!1,max:10,idleTimeoutMillis:3e4,client_encoding:"",ssl:!1,application_name:void 0,fallback_application_name:void 0,options:void 0,parseInputDatesAsUTC:!1,statement_timeout:!1,lock_timeout:!1,idle_in_transaction_session_timeout:!1,query_timeout:!1,connect_timeout:0,keepalives:1,keepalives_idle:0};const s=_t(),n=s.getTypeParser(20,"text"),i=s.getTypeParser(1016,"text");e.exports.__defineSetter__("parseInt8",function(o){s.setTypeParser(20,"text",o?s.getTypeParser(23,"text"):n),s.setTypeParser(1016,"text",o?s.getTypeParser(1007,"text"):i)})})(lr)),lr.exports}var vr,Xs;function Ze(){if(Xs)return vr;Xs=1;const e=St(),t=He,{isDate:r}=t.types||t;function s(d){return'"'+d.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'}function n(d){let p="{";for(let g=0;g<d.length;g++)if(g>0&&(p=p+","),d[g]===null||typeof d[g]>"u")p=p+"NULL";else if(Array.isArray(d[g]))p=p+n(d[g]);else if(ArrayBuffer.isView(d[g])){let b=d[g];if(!(b instanceof Buffer)){const v=Buffer.from(b.buffer,b.byteOffset,b.byteLength);v.length===b.byteLength?b=v:b=v.slice(b.byteOffset,b.byteOffset+b.byteLength)}p+="\\\\x"+b.toString("hex")}else p+=s(i(d[g]));return p=p+"}",p}const i=function(d,p){if(d==null)return null;if(typeof d=="object"){if(d instanceof Buffer)return d;if(ArrayBuffer.isView(d)){const g=Buffer.from(d.buffer,d.byteOffset,d.byteLength);return g.length===d.byteLength?g:g.slice(d.byteOffset,d.byteOffset+d.byteLength)}return r(d)?e.parseInputDatesAsUTC?c(d):l(d):Array.isArray(d)?n(d):o(d,p)}return d.toString()};function o(d,p){if(d&&typeof d.toPostgres=="function"){if(p=p||[],p.indexOf(d)!==-1)throw new Error('circular reference detected while preparing "'+d+'" for query');return p.push(d),i(d.toPostgres(i),p)}return JSON.stringify(d)}function l(d){let p=-d.getTimezoneOffset(),g=d.getFullYear();const b=g<1;b&&(g=Math.abs(g)+1);let v=String(g).padStart(4,"0")+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+"T"+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")+":"+String(d.getSeconds()).padStart(2,"0")+"."+String(d.getMilliseconds()).padStart(3,"0");return p<0?(v+="-",p*=-1):v+="+",v+=String(Math.floor(p/60)).padStart(2,"0")+":"+String(p%60).padStart(2,"0"),b&&(v+=" BC"),v}function c(d){let p=d.getUTCFullYear();const g=p<1;g&&(p=Math.abs(p)+1);let b=String(p).padStart(4,"0")+"-"+String(d.getUTCMonth()+1).padStart(2,"0")+"-"+String(d.getUTCDate()).padStart(2,"0")+"T"+String(d.getUTCHours()).padStart(2,"0")+":"+String(d.getUTCMinutes()).padStart(2,"0")+":"+String(d.getUTCSeconds()).padStart(2,"0")+"."+String(d.getUTCMilliseconds()).padStart(3,"0");return b+="+00:00",g&&(b+=" BC"),b}function u(d,p,g){return d=typeof d=="string"?{text:d}:d,p&&(typeof p=="function"?d.callback=p:d.values=p),g&&(d.callback=g),d}return vr={prepareValue:function(p){return i(p)},normalizeQueryConfig:u,escapeIdentifier:function(d){return'"'+d.replace(/"/g,'""')+'"'},escapeLiteral:function(d){let p=!1,g="'";if(d==null||typeof d!="string")return"''";for(let b=0;b<d.length;b++){const v=d[b];v==="'"?g+=v+v:v==="\\"?(g+=v+v,p=!0):g+=v}return g+="'",p===!0&&(g=" E"+g),g}},vr}var ct={exports:{}},wr,Ws;function zo(){if(Ws)return wr;Ws=1;const e=On;function t(l){return e.createHash("md5").update(l,"utf-8").digest("hex")}function r(l,c,u){const a=t(c+l);return"md5"+t(Buffer.concat([Buffer.from(a),u]))}function s(l){return e.createHash("sha256").update(l).digest()}function n(l,c){return l=l.replace(/(\D)-/,"$1"),e.createHash(l).update(c).digest()}function i(l,c){return e.createHmac("sha256",l).update(c).digest()}async function o(l,c,u){return e.pbkdf2Sync(l,c,u,32,"sha256")}return wr={postgresMd5PasswordHash:r,randomBytes:e.randomBytes,deriveKey:o,sha256:s,hashByName:n,hmacSha256:i,md5:t},wr}var Er,$s;function Vo(){if($s)return Er;$s=1;const e=On;Er={postgresMd5PasswordHash:o,randomBytes:n,deriveKey:a,sha256:l,hashByName:c,hmacSha256:u,md5:i};const t=e.webcrypto||globalThis.crypto,r=t.subtle,s=new TextEncoder;function n(f){return t.getRandomValues(Buffer.alloc(f))}async function i(f){try{return e.createHash("md5").update(f,"utf-8").digest("hex")}catch{const p=typeof f=="string"?s.encode(f):f,g=await r.digest("MD5",p);return Array.from(new Uint8Array(g)).map(b=>b.toString(16).padStart(2,"0")).join("")}}async function o(f,d,p){const g=await i(d+f);return"md5"+await i(Buffer.concat([Buffer.from(g),p]))}async function l(f){return await r.digest("SHA-256",f)}async function c(f,d){return await r.digest(f,d)}async function u(f,d){const p=await r.importKey("raw",f,{name:"HMAC",hash:"SHA-256"},!1,["sign"]);return await r.sign("HMAC",p,s.encode(d))}async function a(f,d,p){const g=await r.importKey("raw",s.encode(f),"PBKDF2",!1,["deriveBits"]),b={name:"PBKDF2",hash:"SHA-256",salt:d,iterations:p};return await r.deriveBits(b,g,256,["deriveBits"])}return Er}var Gs;function ci(){return Gs||(Gs=1,parseInt(process.versions&&process.versions.node&&process.versions.node.split(".")[0])<15?ct.exports=zo():ct.exports=Vo()),ct.exports}var xr,Js;function Qo(){if(Js)return xr;Js=1;function e(i,o){return new Error("SASL channel binding: "+i+" when parsing public certificate "+o.toString("base64"))}function t(i,o){let l=i[o++];if(l<128)return{length:l,index:o};const c=l&127;if(c>4)throw e("bad length",i);l=0;for(let u=0;u<c;u++)l=l<<8|i[o++];return{length:l,index:o}}function r(i,o){if(i[o++]!==6)throw e("non-OID data",i);const{length:l,index:c}=t(i,o);o=c;const u=o+l,a=i[o++];let f=(a/40>>0)+"."+a%40;for(;o<u;){let d=0;for(;o<u;){const p=i[o++];if(d=d<<7|p&127,p<128)break}f+="."+d}return{oid:f,index:o}}function s(i,o){if(i[o++]!==48)throw e("non-sequence data",i);return t(i,o)}function n(i,o){o===void 0&&(o=0),o=s(i,o).index;const{length:l,index:c}=s(i,o);o=c+l,o=s(i,o).index;const{oid:u,index:a}=r(i,o);switch(u){case"1.2.840.113549.1.1.4":return"MD5";case"1.2.840.113549.1.1.5":return"SHA-1";case"1.2.840.113549.1.1.11":return"SHA-256";case"1.2.840.113549.1.1.12":return"SHA-384";case"1.2.840.113549.1.1.13":return"SHA-512";case"1.2.840.113549.1.1.14":return"SHA-224";case"1.2.840.113549.1.1.15":return"SHA512-224";case"1.2.840.113549.1.1.16":return"SHA512-256";case"1.2.840.10045.4.1":return"SHA-1";case"1.2.840.10045.4.3.1":return"SHA-224";case"1.2.840.10045.4.3.2":return"SHA-256";case"1.2.840.10045.4.3.3":return"SHA-384";case"1.2.840.10045.4.3.4":return"SHA-512";case"1.2.840.113549.1.1.10":{if(o=a,o=s(i,o).index,i[o++]!==160)throw e("non-tag data",i);o=t(i,o).index,o=s(i,o).index;const{oid:f}=r(i,o);switch(f){case"1.2.840.113549.2.5":return"MD5";case"1.3.14.3.2.26":return"SHA-1";case"2.16.840.1.101.3.4.2.1":return"SHA-256";case"2.16.840.1.101.3.4.2.2":return"SHA-384";case"2.16.840.1.101.3.4.2.3":return"SHA-512"}throw e("unknown hash OID "+f,i)}case"1.3.101.110":case"1.3.101.112":return"SHA-512";case"1.3.101.111":case"1.3.101.113":throw e("Ed448 certificate channel binding is not currently supported by Postgres")}throw e("unknown OID "+u,i)}return xr={signatureAlgorithmHashFromCertificate:n},xr}var _r,Ys;function Xo(){if(Ys)return _r;Ys=1;const e=ci(),{signatureAlgorithmHashFromCertificate:t}=Qo();function r(f,d){const p=["SCRAM-SHA-256"];d&&p.unshift("SCRAM-SHA-256-PLUS");const g=p.find(h=>f.includes(h));if(!g)throw new Error("SASL: Only mechanism(s) "+p.join(" and ")+" are supported");if(g==="SCRAM-SHA-256-PLUS"&&typeof d.getPeerCertificate!="function")throw new Error("SASL: Mechanism SCRAM-SHA-256-PLUS requires a certificate");const b=e.randomBytes(18).toString("base64");return{mechanism:g,clientNonce:b,response:(g==="SCRAM-SHA-256-PLUS"?"p=tls-server-end-point":d?"y":"n")+",,n=*,r="+b,message:"SASLInitialResponse"}}async function s(f,d,p,g){if(f.message!=="SASLInitialResponse")throw new Error("SASL: Last message was not SASLInitialResponse");if(typeof d!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");if(d==="")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a non-empty string");if(typeof p!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");const b=c(p);if(b.nonce.startsWith(f.clientNonce)){if(b.nonce.length===f.clientNonce.length)throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");const v="n=*,r="+f.clientNonce,h="r="+b.nonce+",s="+b.salt+",i="+b.iteration;let y=g?"eSws":"biws";if(f.mechanism==="SCRAM-SHA-256-PLUS"){const x=g.getPeerCertificate().raw;let P=t(x);(P==="MD5"||P==="SHA-1")&&(P="SHA-256");const D=await e.hashByName(P,x);y=Buffer.concat([Buffer.from("p=tls-server-end-point,,"),Buffer.from(D)]).toString("base64")}const E="c="+y+",r="+b.nonce,S=v+","+h+","+E,L=Buffer.from(b.salt,"base64"),A=await e.deriveKey(d,L,b.iteration),m=await e.hmacSha256(A,"Client Key"),_=await e.sha256(m),w=await e.hmacSha256(_,S),T=a(Buffer.from(m),Buffer.from(w)).toString("base64"),C=await e.hmacSha256(A,"Server Key"),I=await e.hmacSha256(C,S);f.message="SASLResponse",f.serverSignature=Buffer.from(I).toString("base64"),f.response=E+",p="+T}function n(f,d){if(f.message!=="SASLResponse")throw new Error("SASL: Last message was not SASLResponse");if(typeof d!="string")throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");const{serverSignature:p}=u(d);if(p!==f.serverSignature)throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match")}function i(f){if(typeof f!="string")throw new TypeError("SASL: text must be a string");return f.split("").map((d,p)=>f.charCodeAt(p)).every(d=>d>=33&&d<=43||d>=45&&d<=126)}function o(f){return/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(f)}function l(f){if(typeof f!="string")throw new TypeError("SASL: attribute pairs text must be a string");return new Map(f.split(",").map(d=>{if(!/^.=/.test(d))throw new Error("SASL: Invalid attribute pair entry");const p=d[0],g=d.substring(2);return[p,g]}))}function c(f){const d=l(f),p=d.get("r");if(p){if(!i(p))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");const g=d.get("s");if(g){if(!o(g))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");const b=d.get("i");if(b){if(!/^[1-9][0-9]*$/.test(b))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");const v=parseInt(b,10);return{nonce:p,salt:g,iteration:v}}function u(f){const p=l(f).get("v");if(p){if(!o(p))throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64")}else throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");return{serverSignature:p}}function a(f,d){if(!Buffer.isBuffer(f))throw new TypeError("first argument must be a Buffer");if(!Buffer.isBuffer(d))throw new TypeError("second argument must be a Buffer");if(f.length!==d.length)throw new Error("Buffer lengths must match");if(f.length===0)throw new Error("Buffers cannot be empty");return Buffer.from(f.map((p,g)=>f[g]^d[g]))}return _r={startSession:r,continueSession:s,finalizeSession:n},_r}var Sr,Ks;function Gr(){if(Ks)return Sr;Ks=1;const e=_t();function t(r){this._types=r||e,this.text={},this.binary={}}return t.prototype.getOverrides=function(r){switch(r){case"text":return this.text;case"binary":return this.binary;default:return{}}},t.prototype.setTypeParser=function(r,s,n){typeof s=="function"&&(n=s,s="text"),this.getOverrides(s)[r]=n},t.prototype.getTypeParser=function(r,s){return s=s||"text",this.getOverrides(s)[r]||this._types.getTypeParser(r,s)},Sr=t,Sr}var Ar,Zs;function Wo(){if(Zs)return Ar;Zs=1;function e(i,o={}){if(i.charAt(0)==="/"){const p=i.split(" ");return{host:p[0],database:p[1]}}const l={};let c,u=!1;/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(i)&&(i=encodeURI(i).replace(/%25(\d\d)/g,"%$1"));try{try{c=new URL(i,"postgres://base")}catch{c=new URL(i.replace("@/","@___DUMMY___/"),"postgres://base"),u=!0}}catch(p){throw p.input&&(p.input="*****REDACTED*****"),p}for(const p of c.searchParams.entries())l[p[0]]=p[1];if(l.user=l.user||decodeURIComponent(c.username),l.password=l.password||decodeURIComponent(c.password),c.protocol=="socket:")return l.host=decodeURI(c.pathname),l.database=c.searchParams.get("db"),l.client_encoding=c.searchParams.get("encoding"),l;const a=u?"":c.hostname;l.host?a&&/^%2f/i.test(a)&&(c.pathname=a+c.pathname):l.host=decodeURIComponent(a),l.port||(l.port=c.port);const f=c.pathname.slice(1)||null;l.database=f?decodeURI(f):null,(l.ssl==="true"||l.ssl==="1")&&(l.ssl=!0),l.ssl==="0"&&(l.ssl=!1),(l.sslcert||l.sslkey||l.sslrootcert||l.sslmode)&&(l.ssl={});const d=l.sslcert||l.sslkey||l.sslrootcert?Ln:null;if(l.sslcert&&(l.ssl.cert=d.readFileSync(l.sslcert).toString()),l.sslkey&&(l.ssl.key=d.readFileSync(l.sslkey).toString()),l.sslrootcert&&(l.ssl.ca=d.readFileSync(l.sslrootcert).toString()),o.useLibpqCompat&&l.uselibpqcompat)throw new Error("Both useLibpqCompat and uselibpqcompat are set. Please use only one of them.");if(l.uselibpqcompat==="true"||o.useLibpqCompat)switch(l.sslmode){case"disable":{l.ssl=!1;break}case"prefer":{l.ssl.rejectUnauthorized=!1;break}case"require":{l.sslrootcert?l.ssl.checkServerIdentity=function(){}:l.ssl.rejectUnauthorized=!1;break}case"verify-ca":{if(!l.ssl.ca)throw new Error("SECURITY WARNING: Using sslmode=verify-ca requires specifying a CA with sslrootcert. If a public CA is used, verify-ca allows connections to a server that somebody else may have registered with the CA, making you vulnerable to Man-in-the-Middle attacks. Either specify a custom CA certificate with sslrootcert parameter or use sslmode=verify-full for proper security.");l.ssl.checkServerIdentity=function(){};break}}else switch(l.sslmode){case"disable":{l.ssl=!1;break}case"prefer":case"require":case"verify-ca":case"verify-full":{l.sslmode!=="verify-full"&&n(l.sslmode);break}case"no-verify":{l.ssl.rejectUnauthorized=!1;break}}return l}function t(i){return Object.entries(i).reduce((l,[c,u])=>(u!=null&&(l[c]=u),l),{})}function r(i){return Object.entries(i).reduce((l,[c,u])=>{if(c==="ssl"){const a=u;typeof a=="boolean"&&(l[c]=a),typeof a=="object"&&(l[c]=t(a))}else if(u!=null)if(c==="port"){if(u!==""){const a=parseInt(u,10);if(isNaN(a))throw new Error(`Invalid ${c}: ${u}`);l[c]=a}}else l[c]=u;return l},{})}function s(i){return r(e(i))}function n(i){!n.warned&&typeof process<"u"&&process.emitWarning&&(n.warned=!0,process.emitWarning(`SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=${i}'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.`))}return Ar=e,e.parse=e,e.toClientConfig=r,e.parseIntoClientConfig=s,Ar}var Tr,en;function ui(){if(en)return Tr;en=1;var e={};const t=vi,r=St(),s=Wo().parse,n=function(u,a,f){return a[u]?a[u]:(f===void 0?f=e["PG"+u.toUpperCase()]:f===!1||(f=e[f]),f||r[u])},i=function(){switch(e.PGSSLMODE){case"disable":return!1;case"prefer":case"require":case"verify-ca":case"verify-full":return!0;case"no-verify":return{rejectUnauthorized:!1}}return r.ssl},o=function(u){return"'"+(""+u).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"},l=function(u,a,f){const d=a[f];d!=null&&u.push(f+"="+o(d))};class c{constructor(a){a=typeof a=="string"?s(a):a||{},a.connectionString&&(a=Object.assign({},a,s(a.connectionString))),this.user=n("user",a),this.database=n("database",a),this.database===void 0&&(this.database=this.user),this.port=parseInt(n("port",a),10),this.host=n("host",a),Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:n("password",a)}),this.binary=n("binary",a),this.options=n("options",a),this.ssl=typeof a.ssl>"u"?i():a.ssl,typeof this.ssl=="string"&&this.ssl==="true"&&(this.ssl=!0),this.ssl==="no-verify"&&(this.ssl={rejectUnauthorized:!1}),this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this.client_encoding=n("client_encoding",a),this.replication=n("replication",a),this.isDomainSocket=!(this.host||"").indexOf("/"),this.application_name=n("application_name",a,"PGAPPNAME"),this.fallback_application_name=n("fallback_application_name",a,!1),this.statement_timeout=n("statement_timeout",a,!1),this.lock_timeout=n("lock_timeout",a,!1),this.idle_in_transaction_session_timeout=n("idle_in_transaction_session_timeout",a,!1),this.query_timeout=n("query_timeout",a,!1),a.connectionTimeoutMillis===void 0?this.connect_timeout=e.PGCONNECT_TIMEOUT||0:this.connect_timeout=Math.floor(a.connectionTimeoutMillis/1e3),a.keepAlive===!1?this.keepalives=0:a.keepAlive===!0&&(this.keepalives=1),typeof a.keepAliveInitialDelayMillis=="number"&&(this.keepalives_idle=Math.floor(a.keepAliveInitialDelayMillis/1e3))}getLibpqConnectionString(a){const f=[];l(f,this,"user"),l(f,this,"password"),l(f,this,"port"),l(f,this,"application_name"),l(f,this,"fallback_application_name"),l(f,this,"connect_timeout"),l(f,this,"options");const d=typeof this.ssl=="object"?this.ssl:this.ssl?{sslmode:this.ssl}:{};if(l(f,d,"sslmode"),l(f,d,"sslca"),l(f,d,"sslkey"),l(f,d,"sslcert"),l(f,d,"sslrootcert"),this.database&&f.push("dbname="+o(this.database)),this.replication&&f.push("replication="+o(this.replication)),this.host&&f.push("host="+o(this.host)),this.isDomainSocket)return a(null,f.join(" "));this.client_encoding&&f.push("client_encoding="+o(this.client_encoding)),t.lookup(this.host,function(p,g){return p?a(p,null):(f.push("hostaddr="+o(g)),a(null,f.join(" ")))})}}return Tr=c,Tr}var Cr,tn;function di(){if(tn)return Cr;tn=1;const e=_t(),t=/^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/;class r{constructor(n,i){this.command=null,this.rowCount=null,this.oid=null,this.rows=[],this.fields=[],this._parsers=void 0,this._types=i,this.RowCtor=null,this.rowAsArray=n==="array",this.rowAsArray&&(this.parseRow=this._parseRowAsArray),this._prebuiltEmptyResultObject=null}addCommandComplete(n){let i;n.text?i=t.exec(n.text):i=t.exec(n.command),i&&(this.command=i[1],i[3]?(this.oid=parseInt(i[2],10),this.rowCount=parseInt(i[3],10)):i[2]&&(this.rowCount=parseInt(i[2],10)))}_parseRowAsArray(n){const i=new Array(n.length);for(let o=0,l=n.length;o<l;o++){const c=n[o];c!==null?i[o]=this._parsers[o](c):i[o]=null}return i}parseRow(n){const i={...this._prebuiltEmptyResultObject};for(let o=0,l=n.length;o<l;o++){const c=n[o],u=this.fields[o].name;if(c!==null){const a=this.fields[o].format==="binary"?Buffer.from(c):c;i[u]=this._parsers[o](a)}else i[u]=null}return i}addRow(n){this.rows.push(n)}addFields(n){this.fields=n,this.fields.length&&(this._parsers=new Array(n.length));const i={};for(let o=0;o<n.length;o++){const l=n[o];i[l.name]=null,this._types?this._parsers[o]=this._types.getTypeParser(l.dataTypeID,l.format||"text"):this._parsers[o]=e.getTypeParser(l.dataTypeID,l.format||"text")}this._prebuiltEmptyResultObject={...i}}}return Cr=r,Cr}var Rr,rn;function $o(){if(rn)return Rr;rn=1;const{EventEmitter:e}=ze,t=di(),r=Ze();class s extends e{constructor(i,o,l){super(),i=r.normalizeQueryConfig(i,o,l),this.text=i.text,this.values=i.values,this.rows=i.rows,this.types=i.types,this.name=i.name,this.queryMode=i.queryMode,this.binary=i.binary,this.portal=i.portal||"",this.callback=i.callback,this._rowMode=i.rowMode,process.domain&&i.callback&&(this.callback=process.domain.bind(i.callback)),this._result=new t(this._rowMode,this.types),this._results=this._result,this._canceledDueToError=!1}requiresPreparation(){return this.queryMode==="extended"||this.name||this.rows?!0:!this.text||!this.values?!1:this.values.length>0}_checkForMultirow(){this._result.command&&(Array.isArray(this._results)||(this._results=[this._result]),this._result=new t(this._rowMode,this._result._types),this._results.push(this._result))}handleRowDescription(i){this._checkForMultirow(),this._result.addFields(i.fields),this._accumulateRows=this.callback||!this.listeners("row").length}handleDataRow(i){let o;if(!this._canceledDueToError){try{o=this._result.parseRow(i.fields)}catch(l){this._canceledDueToError=l;return}this.emit("row",o,this._result),this._accumulateRows&&this._result.addRow(o)}}handleCommandComplete(i,o){this._checkForMultirow(),this._result.addCommandComplete(i),this.rows&&o.sync()}handleEmptyQuery(i){this.rows&&i.sync()}handleError(i,o){if(this._canceledDueToError&&(i=this._canceledDueToError,this._canceledDueToError=!1),this.callback)return this.callback(i);this.emit("error",i)}handleReadyForQuery(i){if(this._canceledDueToError)return this.handleError(this._canceledDueToError,i);if(this.callback)try{this.callback(null,this._results)}catch(o){process.nextTick(()=>{throw o})}this.emit("end",this._results)}submit(i){if(typeof this.text!="string"&&typeof this.name!="string")return new Error("A query must have either text or a name. Supplying neither is unsupported.");const o=i.parsedStatements[this.name];if(this.text&&o&&this.text!==o)return new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);if(this.values&&!Array.isArray(this.values))return new Error("Query values must be an array");if(this.requiresPreparation()){i.stream.cork&&i.stream.cork();try{this.prepare(i)}finally{i.stream.uncork&&i.stream.uncork()}}else i.query(this.text);return null}hasBeenParsed(i){return this.name&&i.parsedStatements[this.name]}handlePortalSuspended(i){this._getRows(i,this.rows)}_getRows(i,o){i.execute({portal:this.portal,rows:o}),o?i.flush():i.sync()}prepare(i){this.hasBeenParsed(i)||i.parse({text:this.text,name:this.name,types:this.types});try{i.bind({portal:this.portal,statement:this.name,values:this.values,binary:this.binary,valueMapper:r.prepareValue})}catch(o){this.handleError(o,i);return}i.describe({type:"P",name:this.portal||""}),this._getRows(i,this.rows)}handleCopyInResponse(i){i.sendCopyFail("No source stream defined")}handleCopyData(i,o){}}return Rr=s,Rr}var Nr={},B={},sn;function fi(){if(sn)return B;sn=1,Object.defineProperty(B,"__esModule",{value:!0}),B.NoticeMessage=B.DataRowMessage=B.CommandCompleteMessage=B.ReadyForQueryMessage=B.NotificationResponseMessage=B.BackendKeyDataMessage=B.AuthenticationMD5Password=B.ParameterStatusMessage=B.ParameterDescriptionMessage=B.RowDescriptionMessage=B.Field=B.CopyResponse=B.CopyDataMessage=B.DatabaseError=B.copyDone=B.emptyQuery=B.replicationStart=B.portalSuspended=B.noData=B.closeComplete=B.bindComplete=B.parseComplete=void 0,B.parseComplete={name:"parseComplete",length:5},B.bindComplete={name:"bindComplete",length:5},B.closeComplete={name:"closeComplete",length:5},B.noData={name:"noData",length:5},B.portalSuspended={name:"portalSuspended",length:5},B.replicationStart={name:"replicationStart",length:4},B.emptyQuery={name:"emptyQuery",length:4},B.copyDone={name:"copyDone",length:4};class e extends Error{constructor(b,v,h){super(b),this.length=v,this.name=h}}B.DatabaseError=e;class t{constructor(b,v){this.length=b,this.chunk=v,this.name="copyData"}}B.CopyDataMessage=t;class r{constructor(b,v,h,y){this.length=b,this.name=v,this.binary=h,this.columnTypes=new Array(y)}}B.CopyResponse=r;class s{constructor(b,v,h,y,E,S,L){this.name=b,this.tableID=v,this.columnID=h,this.dataTypeID=y,this.dataTypeSize=E,this.dataTypeModifier=S,this.format=L}}B.Field=s;class n{constructor(b,v){this.length=b,this.fieldCount=v,this.name="rowDescription",this.fields=new Array(this.fieldCount)}}B.RowDescriptionMessage=n;class i{constructor(b,v){this.length=b,this.parameterCount=v,this.name="parameterDescription",this.dataTypeIDs=new Array(this.parameterCount)}}B.ParameterDescriptionMessage=i;class o{constructor(b,v,h){this.length=b,this.parameterName=v,this.parameterValue=h,this.name="parameterStatus"}}B.ParameterStatusMessage=o;class l{constructor(b,v){this.length=b,this.salt=v,this.name="authenticationMD5Password"}}B.AuthenticationMD5Password=l;class c{constructor(b,v,h){this.length=b,this.processID=v,this.secretKey=h,this.name="backendKeyData"}}B.BackendKeyDataMessage=c;class u{constructor(b,v,h,y){this.length=b,this.processId=v,this.channel=h,this.payload=y,this.name="notification"}}B.NotificationResponseMessage=u;class a{constructor(b,v){this.length=b,this.status=v,this.name="readyForQuery"}}B.ReadyForQueryMessage=a;class f{constructor(b,v){this.length=b,this.text=v,this.name="commandComplete"}}B.CommandCompleteMessage=f;class d{constructor(b,v){this.length=b,this.fields=v,this.name="dataRow",this.fieldCount=v.length}}B.DataRowMessage=d;class p{constructor(b,v){this.length=b,this.message=v,this.name="notice"}}return B.NoticeMessage=p,B}var We={},$e={},nn;function Go(){if(nn)return $e;nn=1,Object.defineProperty($e,"__esModule",{value:!0}),$e.Writer=void 0;class e{constructor(r=256){this.size=r,this.offset=5,this.headerPosition=0,this.buffer=Buffer.allocUnsafe(r)}ensure(r){if(this.buffer.length-this.offset<r){const n=this.buffer,i=n.length+(n.length>>1)+r;this.buffer=Buffer.allocUnsafe(i),n.copy(this.buffer)}}addInt32(r){return this.ensure(4),this.buffer[this.offset++]=r>>>24&255,this.buffer[this.offset++]=r>>>16&255,this.buffer[this.offset++]=r>>>8&255,this.buffer[this.offset++]=r>>>0&255,this}addInt16(r){return this.ensure(2),this.buffer[this.offset++]=r>>>8&255,this.buffer[this.offset++]=r>>>0&255,this}addCString(r){if(!r)this.ensure(1);else{const s=Buffer.byteLength(r);this.ensure(s+1),this.buffer.write(r,this.offset,"utf-8"),this.offset+=s}return this.buffer[this.offset++]=0,this}addString(r=""){const s=Buffer.byteLength(r);return this.ensure(s),this.buffer.write(r,this.offset),this.offset+=s,this}add(r){return this.ensure(r.length),r.copy(this.buffer,this.offset),this.offset+=r.length,this}join(r){if(r){this.buffer[this.headerPosition]=r;const s=this.offset-(this.headerPosition+1);this.buffer.writeInt32BE(s,this.headerPosition+1)}return this.buffer.slice(r?0:5,this.offset)}flush(r){const s=this.join(r);return this.offset=5,this.headerPosition=0,this.buffer=Buffer.allocUnsafe(this.size),s}}return $e.Writer=e,$e}var on;function Jo(){if(on)return We;on=1,Object.defineProperty(We,"__esModule",{value:!0}),We.serialize=void 0;const e=Go(),t=new e.Writer,r=x=>{t.addInt16(3).addInt16(0);for(const M of Object.keys(x))t.addCString(M).addCString(x[M]);t.addCString("client_encoding").addCString("UTF8");const P=t.addCString("").flush(),D=P.length+4;return new e.Writer().addInt32(D).add(P).flush()},s=()=>{const x=Buffer.allocUnsafe(8);return x.writeInt32BE(8,0),x.writeInt32BE(80877103,4),x},n=x=>t.addCString(x).flush(112),i=function(x,P){return t.addCString(x).addInt32(Buffer.byteLength(P)).addString(P),t.flush(112)},o=function(x){return t.addString(x).flush(112)},l=x=>t.addCString(x).flush(81),c=[],u=x=>{const P=x.name||"";P.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",P,P.length),console.error("This can cause conflicts and silent errors executing queries"));const D=x.types||c,M=D.length,F=t.addCString(P).addCString(x.text).addInt16(M);for(let z=0;z<M;z++)F.addInt32(D[z]);return t.flush(80)},a=new e.Writer,f=function(x,P){for(let D=0;D<x.length;D++){const M=P?P(x[D],D):x[D];M==null?(t.addInt16(0),a.addInt32(-1)):M instanceof Buffer?(t.addInt16(1),a.addInt32(M.length),a.add(M)):(t.addInt16(0),a.addInt32(Buffer.byteLength(M)),a.addString(M))}},d=(x={})=>{const P=x.portal||"",D=x.statement||"",M=x.binary||!1,F=x.values||c,z=F.length;return t.addCString(P).addCString(D),t.addInt16(z),f(F,x.valueMapper),t.addInt16(z),t.add(a.flush()),t.addInt16(1),t.addInt16(M?1:0),t.flush(66)},p=Buffer.from([69,0,0,0,9,0,0,0,0,0]),g=x=>{if(!x||!x.portal&&!x.rows)return p;const P=x.portal||"",D=x.rows||0,M=Buffer.byteLength(P),F=4+M+1+4,z=Buffer.allocUnsafe(1+F);return z[0]=69,z.writeInt32BE(F,1),z.write(P,5,"utf-8"),z[M+5]=0,z.writeUInt32BE(D,z.length-4),z},b=(x,P)=>{const D=Buffer.allocUnsafe(16);return D.writeInt32BE(16,0),D.writeInt16BE(1234,4),D.writeInt16BE(5678,6),D.writeInt32BE(x,8),D.writeInt32BE(P,12),D},v=(x,P)=>{const M=4+Buffer.byteLength(P)+1,F=Buffer.allocUnsafe(1+M);return F[0]=x,F.writeInt32BE(M,1),F.write(P,5,"utf-8"),F[M]=0,F},h=t.addCString("P").flush(68),y=t.addCString("S").flush(68),E=x=>x.name?v(68,`${x.type}${x.name||""}`):x.type==="P"?h:y,S=x=>{const P=`${x.type}${x.name||""}`;return v(67,P)},L=x=>t.add(x).flush(100),A=x=>v(102,x),m=x=>Buffer.from([x,0,0,0,4]),_=m(72),w=m(83),T=m(88),C=m(99),I={startup:r,password:n,requestSsl:s,sendSASLInitialResponseMessage:i,sendSCRAMClientFinalMessage:o,query:l,parse:u,bind:d,execute:g,describe:E,close:S,flush:()=>_,sync:()=>w,end:()=>T,copyData:L,copyDone:()=>C,copyFail:A,cancel:b};return We.serialize=I,We}var Ge={},Je={},an;function Yo(){if(an)return Je;an=1,Object.defineProperty(Je,"__esModule",{value:!0}),Je.BufferReader=void 0;class e{constructor(r=0){this.offset=r,this.buffer=Buffer.allocUnsafe(0),this.encoding="utf-8"}setBuffer(r,s){this.offset=r,this.buffer=s}int16(){const r=this.buffer.readInt16BE(this.offset);return this.offset+=2,r}byte(){const r=this.buffer[this.offset];return this.offset++,r}int32(){const r=this.buffer.readInt32BE(this.offset);return this.offset+=4,r}uint32(){const r=this.buffer.readUInt32BE(this.offset);return this.offset+=4,r}string(r){const s=this.buffer.toString(this.encoding,this.offset,this.offset+r);return this.offset+=r,s}cstring(){const r=this.offset;let s=r;for(;this.buffer[s++]!==0;);return this.offset=s,this.buffer.toString(this.encoding,r,s-1)}bytes(r){const s=this.buffer.slice(this.offset,this.offset+r);return this.offset+=r,s}}return Je.BufferReader=e,Je}var ln;function Ko(){if(ln)return Ge;ln=1,Object.defineProperty(Ge,"__esModule",{value:!0}),Ge.Parser=void 0;const e=fi(),t=Yo(),r=1,n=r+4,i=-1,o=Buffer.allocUnsafe(0);class l{constructor(_){if(this.buffer=o,this.bufferLength=0,this.bufferOffset=0,this.reader=new t.BufferReader,(_==null?void 0:_.mode)==="binary")throw new Error("Binary mode not supported yet");this.mode=(_==null?void 0:_.mode)||"text"}parse(_,w){this.mergeBuffer(_);const T=this.bufferOffset+this.bufferLength;let C=this.bufferOffset;for(;C+n<=T;){const I=this.buffer[C],x=this.buffer.readUInt32BE(C+r),P=r+x;if(P+C<=T){const D=this.handlePacket(C+n,I,x,this.buffer);w(D),C+=P}else break}C===T?(this.buffer=o,this.bufferLength=0,this.bufferOffset=0):(this.bufferLength=T-C,this.bufferOffset=C)}mergeBuffer(_){if(this.bufferLength>0){const w=this.bufferLength+_.byteLength;if(w+this.bufferOffset>this.buffer.byteLength){let C;if(w<=this.buffer.byteLength&&this.bufferOffset>=this.bufferLength)C=this.buffer;else{let I=this.buffer.byteLength*2;for(;w>=I;)I*=2;C=Buffer.allocUnsafe(I)}this.buffer.copy(C,0,this.bufferOffset,this.bufferOffset+this.bufferLength),this.buffer=C,this.bufferOffset=0}_.copy(this.buffer,this.bufferOffset+this.bufferLength),this.bufferLength=w}else this.buffer=_,this.bufferOffset=0,this.bufferLength=_.byteLength}handlePacket(_,w,T,C){const{reader:I}=this;I.setBuffer(_,C);let x;switch(w){case 50:x=e.bindComplete;break;case 49:x=e.parseComplete;break;case 51:x=e.closeComplete;break;case 110:x=e.noData;break;case 115:x=e.portalSuspended;break;case 99:x=e.copyDone;break;case 87:x=e.replicationStart;break;case 73:x=e.emptyQuery;break;case 68:x=y(I);break;case 67:x=u(I);break;case 90:x=c(I);break;case 65:x=g(I);break;case 82:x=L(I,T);break;case 83:x=E(I);break;case 75:x=S(I);break;case 69:x=A(I,"error");break;case 78:x=A(I,"notice");break;case 84:x=b(I);break;case 116:x=h(I);break;case 71:x=f(I);break;case 72:x=d(I);break;case 100:x=a(I,T);break;default:return new e.DatabaseError("received invalid response: "+w.toString(16),T,"error")}return I.setBuffer(0,o),x.length=T,x}}Ge.Parser=l;const c=m=>{const _=m.string(1);return new e.ReadyForQueryMessage(i,_)},u=m=>{const _=m.cstring();return new e.CommandCompleteMessage(i,_)},a=(m,_)=>{const w=m.bytes(_-4);return new e.CopyDataMessage(i,w)},f=m=>p(m,"copyInResponse"),d=m=>p(m,"copyOutResponse"),p=(m,_)=>{const w=m.byte()!==0,T=m.int16(),C=new e.CopyResponse(i,_,w,T);for(let I=0;I<T;I++)C.columnTypes[I]=m.int16();return C},g=m=>{const _=m.int32(),w=m.cstring(),T=m.cstring();return new e.NotificationResponseMessage(i,_,w,T)},b=m=>{const _=m.int16(),w=new e.RowDescriptionMessage(i,_);for(let T=0;T<_;T++)w.fields[T]=v(m);return w},v=m=>{const _=m.cstring(),w=m.uint32(),T=m.int16(),C=m.uint32(),I=m.int16(),x=m.int32(),P=m.int16()===0?"text":"binary";return new e.Field(_,w,T,C,I,x,P)},h=m=>{const _=m.int16(),w=new e.ParameterDescriptionMessage(i,_);for(let T=0;T<_;T++)w.dataTypeIDs[T]=m.int32();return w},y=m=>{const _=m.int16(),w=new Array(_);for(let T=0;T<_;T++){const C=m.int32();w[T]=C===-1?null:m.string(C)}return new e.DataRowMessage(i,w)},E=m=>{const _=m.cstring(),w=m.cstring();return new e.ParameterStatusMessage(i,_,w)},S=m=>{const _=m.int32(),w=m.int32();return new e.BackendKeyDataMessage(i,_,w)},L=(m,_)=>{const w=m.int32(),T={name:"authenticationOk",length:_};switch(w){case 0:break;case 3:T.length===8&&(T.name="authenticationCleartextPassword");break;case 5:if(T.length===12){T.name="authenticationMD5Password";const C=m.bytes(4);return new e.AuthenticationMD5Password(i,C)}break;case 10:{T.name="authenticationSASL",T.mechanisms=[];let C;do C=m.cstring(),C&&T.mechanisms.push(C);while(C)}break;case 11:T.name="authenticationSASLContinue",T.data=m.string(_-8);break;case 12:T.name="authenticationSASLFinal",T.data=m.string(_-8);break;default:throw new Error("Unknown authenticationOk message type "+w)}return T},A=(m,_)=>{const w={};let T=m.string(1);for(;T!=="\0";)w[T]=m.cstring(),T=m.string(1);const C=w.M,I=_==="notice"?new e.NoticeMessage(i,C):new e.DatabaseError(C,i,_);return I.severity=w.S,I.code=w.C,I.detail=w.D,I.hint=w.H,I.position=w.P,I.internalPosition=w.p,I.internalQuery=w.q,I.where=w.W,I.schema=w.s,I.table=w.t,I.column=w.c,I.dataType=w.d,I.constraint=w.n,I.file=w.F,I.line=w.L,I.routine=w.R,I};return Ge}var cn;function pi(){return cn||(cn=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.DatabaseError=e.serialize=e.parse=void 0;const t=fi();Object.defineProperty(e,"DatabaseError",{enumerable:!0,get:function(){return t.DatabaseError}});const r=Jo();Object.defineProperty(e,"serialize",{enumerable:!0,get:function(){return r.serialize}});const s=Ko();function n(i,o){const l=new s.Parser;return i.on("data",c=>l.parse(c,o)),new Promise(c=>i.on("end",()=>c()))}e.parse=n})(Nr)),Nr}var ut={},un;function Zo(){return un||(un=1,Object.defineProperty(ut,"__esModule",{value:!0}),ut.default={}),ut}var Ir,dn;function ea(){if(dn)return Ir;dn=1;const{getStream:e,getSecureStream:t}=i();Ir={getStream:e,getSecureStream:t};function r(){function o(c){const u=qn;return new u.Socket}function l(c){return wi.connect(c)}return{getStream:o,getSecureStream:l}}function s(){function o(c){const{CloudflareSocket:u}=Zo();return new u(c)}function l(c){return c.socket.startTls(c),c.socket}return{getStream:o,getSecureStream:l}}function n(){if(typeof navigator=="object"&&navigator!==null&&typeof navigator.userAgent=="string")return navigator.userAgent==="Cloudflare-Workers";if(typeof Response=="function"){const o=new Response(null,{cf:{thing:!0}});if(typeof o.cf=="object"&&o.cf!==null&&o.cf.thing)return!0}return!1}function i(){return n()?s():r()}return Ir}var Pr,fn;function hi(){if(fn)return Pr;fn=1;const e=ze.EventEmitter,{parse:t,serialize:r}=pi(),{getStream:s,getSecureStream:n}=ea(),i=r.flush(),o=r.sync(),l=r.end();class c extends e{constructor(a){super(),a=a||{},this.stream=a.stream||s(a.ssl),typeof this.stream=="function"&&(this.stream=this.stream(a)),this._keepAlive=a.keepAlive,this._keepAliveInitialDelayMillis=a.keepAliveInitialDelayMillis,this.parsedStatements={},this.ssl=a.ssl||!1,this._ending=!1,this._emitMessage=!1;const f=this;this.on("newListener",function(d){d==="message"&&(f._emitMessage=!0)})}connect(a,f){const d=this;this._connecting=!0,this.stream.setNoDelay(!0),this.stream.connect(a,f),this.stream.once("connect",function(){d._keepAlive&&d.stream.setKeepAlive(!0,d._keepAliveInitialDelayMillis),d.emit("connect")});const p=function(g){d._ending&&(g.code==="ECONNRESET"||g.code==="EPIPE")||d.emit("error",g)};if(this.stream.on("error",p),this.stream.on("close",function(){d.emit("end")}),!this.ssl)return this.attachListeners(this.stream);this.stream.once("data",function(g){switch(g.toString("utf8")){case"S":break;case"N":return d.stream.end(),d.emit("error",new Error("The server does not support SSL connections"));default:return d.stream.end(),d.emit("error",new Error("There was an error establishing an SSL connection"))}const v={socket:d.stream};d.ssl!==!0&&(Object.assign(v,d.ssl),"key"in d.ssl&&(v.key=d.ssl.key));const h=qn;h.isIP&&h.isIP(f)===0&&(v.servername=f);try{d.stream=n(v)}catch(y){return d.emit("error",y)}d.attachListeners(d.stream),d.stream.on("error",p),d.emit("sslconnect")})}attachListeners(a){t(a,f=>{const d=f.name==="error"?"errorMessage":f.name;this._emitMessage&&this.emit("message",f),this.emit(d,f)})}requestSsl(){this.stream.write(r.requestSsl())}startup(a){this.stream.write(r.startup(a))}cancel(a,f){this._send(r.cancel(a,f))}password(a){this._send(r.password(a))}sendSASLInitialResponseMessage(a,f){this._send(r.sendSASLInitialResponseMessage(a,f))}sendSCRAMClientFinalMessage(a){this._send(r.sendSCRAMClientFinalMessage(a))}_send(a){return this.stream.writable?this.stream.write(a):!1}query(a){this._send(r.query(a))}parse(a){this._send(r.parse(a))}bind(a){this._send(r.bind(a))}execute(a){this._send(r.execute(a))}flush(){this.stream.writable&&this.stream.write(i)}sync(){this._ending=!0,this._send(o)}ref(){this.stream.ref()}unref(){this.stream.unref()}end(){if(this._ending=!0,!this._connecting||!this.stream.writable){this.stream.end();return}return this.stream.write(l,()=>{this.stream.end()})}close(a){this._send(r.close(a))}describe(a){this._send(r.describe(a))}sendCopyFromChunk(a){this._send(r.copyData(a))}endCopyFrom(){this._send(r.copyDone())}sendCopyFail(a){this._send(r.copyFail(a))}}return Pr=c,Pr}var dt={exports:{}},Or={exports:{}},Lr,pn;function ta(){if(pn)return Lr;pn=1;const{Transform:e}=Dn,{StringDecoder:t}=xi,r=Symbol("last"),s=Symbol("decoder");function n(u,a,f){let d;if(this.overflow){if(d=this[s].write(u).split(this.matcher),d.length===1)return f();d.shift(),this.overflow=!1}else this[r]+=this[s].write(u),d=this[r].split(this.matcher);this[r]=d.pop();for(let p=0;p<d.length;p++)try{o(this,this.mapper(d[p]))}catch(g){return f(g)}if(this.overflow=this[r].length>this.maxLength,this.overflow&&!this.skipOverflow){f(new Error("maximum buffer reached"));return}f()}function i(u){if(this[r]+=this[s].end(),this[r])try{o(this,this.mapper(this[r]))}catch(a){return u(a)}u()}function o(u,a){a!==void 0&&u.push(a)}function l(u){return u}function c(u,a,f){switch(u=u||/\r?\n/,a=a||l,f=f||{},arguments.length){case 1:typeof u=="function"?(a=u,u=/\r?\n/):typeof u=="object"&&!(u instanceof RegExp)&&!u[Symbol.split]&&(f=u,u=/\r?\n/);break;case 2:typeof u=="function"?(f=a,a=u,u=/\r?\n/):typeof a=="object"&&(f=a,a=l)}f=Object.assign({},f),f.autoDestroy=!0,f.transform=n,f.flush=i,f.readableObjectMode=!0;const d=new e(f);return d[r]="",d[s]=new t("utf8"),d.matcher=u,d.mapper=a,d.maxLength=f.maxLength,d.skipOverflow=f.skipOverflow||!1,d.overflow=!1,d._destroy=function(p,g){this._writableState.errorEmitted=!1,g(p)},d}return Lr=c,Lr}var hn;function ra(){return hn||(hn=1,(function(e){var t={},r=Ei,s=Dn.Stream,n=ta(),i=He,o=5432,l=process.platform==="win32",c=process.stderr,u=56,a=7,f=61440,d=32768;function p(L){return(L&f)==d}var g=["host","port","database","user","password"],b=g.length,v=g[b-1];function h(){var L=c instanceof s&&c.writable===!0;if(L){var A=Array.prototype.slice.call(arguments).concat(`
`);c.write(i.format.apply(i,A))}}Object.defineProperty(e.exports,"isWin",{get:function(){return l},set:function(L){l=L}}),e.exports.warnTo=function(L){var A=c;return c=L,A},e.exports.getFileName=function(L){var A=L||t,m=A.PGPASSFILE||(l?r.join(A.APPDATA||"./","postgresql","pgpass.conf"):r.join(A.HOME||"./",".pgpass"));return m},e.exports.usePgPass=function(L,A){return Object.prototype.hasOwnProperty.call(t,"PGPASSWORD")?!1:l?!0:(A=A||"<unkn>",p(L.mode)?L.mode&(u|a)?(h('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less',A),!1):!0:(h('WARNING: password file "%s" is not a plain file',A),!1))};var y=e.exports.match=function(L,A){return g.slice(0,-1).reduce(function(m,_,w){return w==1&&Number(L[_]||o)===Number(A[_])?m&&!0:m&&(A[_]==="*"||A[_]===L[_])},!0)};e.exports.getPassword=function(L,A,m){var _,w=A.pipe(n());function T(x){var P=E(x);P&&S(P)&&y(L,P)&&(_=P[v],w.end())}var C=function(){A.destroy(),m(_)},I=function(x){A.destroy(),h("WARNING: error on reading file: %s",x),m(void 0)};A.on("error",I),w.on("data",T).on("end",C).on("error",I)};var E=e.exports.parseLine=function(L){if(L.length<11||L.match(/^\s+#/))return null;for(var A="",m="",_=0,w=0,T={},C=!1,I=function(P,D,M){var F=L.substring(D,M);Object.hasOwnProperty.call(t,"PGPASS_NO_DEESCAPE")||(F=F.replace(/\\([:\\])/g,"$1")),T[g[P]]=F},x=0;x<L.length-1;x+=1){if(A=L.charAt(x+1),m=L.charAt(x),C=_==b-1,C){I(_,w);break}x>=0&&A==":"&&m!=="\\"&&(I(_,w,x+1),w=x+2,_+=1)}return T=Object.keys(T).length===b?T:null,T},S=e.exports.isValidEntry=function(L){for(var A={0:function(C){return C.length>0},1:function(C){return C==="*"?!0:(C=Number(C),isFinite(C)&&C>0&&C<9007199254740992&&Math.floor(C)===C)},2:function(C){return C.length>0},3:function(C){return C.length>0},4:function(C){return C.length>0}},m=0;m<g.length;m+=1){var _=A[m],w=L[g[m]]||"",T=_(w);if(!T)return!1}return!0}})(Or)),Or.exports}var mn;function sa(){if(mn)return dt.exports;mn=1;var e=Ln,t=ra();return dt.exports=function(r,s){var n=t.getFileName();e.stat(n,function(i,o){if(i||!t.usePgPass(o,n))return s(void 0);var l=e.createReadStream(n);t.getPassword(r,l,s)})},dt.exports.warnTo=t.warnTo,dt.exports}var qr,gn;function na(){if(gn)return qr;gn=1;const e=ze.EventEmitter,t=Ze(),r=He,s=Xo(),n=Gr(),i=ui(),o=$o(),l=St(),c=hi(),u=ci(),a=r.deprecate(()=>{},"Client.activeQuery is deprecated and will be removed in pg@9.0"),f=r.deprecate(()=>{},"Client.queryQueue is deprecated and will be removed in pg@9.0."),d=r.deprecate(()=>{},"pgpass support is deprecated and will be removed in pg@9.0. You can provide an async function as the password property to the Client/Pool constructor that returns a password instead. Within this function you can call the pgpass module in your own code."),p=r.deprecate(()=>{},"Passing a custom Promise implementation to the Client/Pool constructor is deprecated and will be removed in pg@9.0."),g=r.deprecate(()=>{},"Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.");class b extends e{constructor(h){super(),this.connectionParameters=new i(h),this.user=this.connectionParameters.user,this.database=this.connectionParameters.database,this.port=this.connectionParameters.port,this.host=this.connectionParameters.host,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:this.connectionParameters.password}),this.replication=this.connectionParameters.replication;const y=h||{};y.Promise&&p(),this._Promise=y.Promise||Vr.Promise,this._types=new n(y.types),this._ending=!1,this._ended=!1,this._connecting=!1,this._connected=!1,this._connectionError=!1,this._queryable=!0,this._activeQuery=null,this.enableChannelBinding=!!y.enableChannelBinding,this.connection=y.connection||new c({stream:y.stream,ssl:this.connectionParameters.ssl,keepAlive:y.keepAlive||!1,keepAliveInitialDelayMillis:y.keepAliveInitialDelayMillis||0,encoding:this.connectionParameters.client_encoding||"utf8"}),this._queryQueue=[],this.binary=y.binary||l.binary,this.processID=null,this.secretKey=null,this.ssl=this.connectionParameters.ssl||!1,this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this._connectionTimeoutMillis=y.connectionTimeoutMillis||0}get activeQuery(){return a(),this._activeQuery}set activeQuery(h){a(),this._activeQuery=h}_getActiveQuery(){return this._activeQuery}_errorAllQueries(h){const y=S=>{process.nextTick(()=>{S.handleError(h,this.connection)})},E=this._getActiveQuery();E&&(y(E),this._activeQuery=null),this._queryQueue.forEach(y),this._queryQueue.length=0}_connect(h){const y=this,E=this.connection;if(this._connectionCallback=h,this._connecting||this._connected){const S=new Error("Client has already been connected. You cannot reuse a client.");process.nextTick(()=>{h(S)});return}this._connecting=!0,this._connectionTimeoutMillis>0&&(this.connectionTimeoutHandle=setTimeout(()=>{E._ending=!0,E.stream.destroy(new Error("timeout expired"))},this._connectionTimeoutMillis),this.connectionTimeoutHandle.unref&&this.connectionTimeoutHandle.unref()),this.host&&this.host.indexOf("/")===0?E.connect(this.host+"/.s.PGSQL."+this.port):E.connect(this.port,this.host),E.on("connect",function(){y.ssl?E.requestSsl():E.startup(y.getStartupConf())}),E.on("sslconnect",function(){E.startup(y.getStartupConf())}),this._attachListeners(E),E.once("end",()=>{const S=this._ending?new Error("Connection terminated"):new Error("Connection terminated unexpectedly");clearTimeout(this.connectionTimeoutHandle),this._errorAllQueries(S),this._ended=!0,this._ending||(this._connecting&&!this._connectionError?this._connectionCallback?this._connectionCallback(S):this._handleErrorEvent(S):this._connectionError||this._handleErrorEvent(S)),process.nextTick(()=>{this.emit("end")})})}connect(h){if(h){this._connect(h);return}return new this._Promise((y,E)=>{this._connect(S=>{S?E(S):y(this)})})}_attachListeners(h){h.on("authenticationCleartextPassword",this._handleAuthCleartextPassword.bind(this)),h.on("authenticationMD5Password",this._handleAuthMD5Password.bind(this)),h.on("authenticationSASL",this._handleAuthSASL.bind(this)),h.on("authenticationSASLContinue",this._handleAuthSASLContinue.bind(this)),h.on("authenticationSASLFinal",this._handleAuthSASLFinal.bind(this)),h.on("backendKeyData",this._handleBackendKeyData.bind(this)),h.on("error",this._handleErrorEvent.bind(this)),h.on("errorMessage",this._handleErrorMessage.bind(this)),h.on("readyForQuery",this._handleReadyForQuery.bind(this)),h.on("notice",this._handleNotice.bind(this)),h.on("rowDescription",this._handleRowDescription.bind(this)),h.on("dataRow",this._handleDataRow.bind(this)),h.on("portalSuspended",this._handlePortalSuspended.bind(this)),h.on("emptyQuery",this._handleEmptyQuery.bind(this)),h.on("commandComplete",this._handleCommandComplete.bind(this)),h.on("parseComplete",this._handleParseComplete.bind(this)),h.on("copyInResponse",this._handleCopyInResponse.bind(this)),h.on("copyData",this._handleCopyData.bind(this)),h.on("notification",this._handleNotification.bind(this))}_getPassword(h){const y=this.connection;if(typeof this.password=="function")this._Promise.resolve().then(()=>this.password(this.connectionParameters)).then(E=>{if(E!==void 0){if(typeof E!="string"){y.emit("error",new TypeError("Password must be a string"));return}this.connectionParameters.password=this.password=E}else this.connectionParameters.password=this.password=null;h()}).catch(E=>{y.emit("error",E)});else if(this.password!==null)h();else try{sa()(this.connectionParameters,S=>{S!==void 0&&(d(),this.connectionParameters.password=this.password=S),h()})}catch(E){this.emit("error",E)}}_handleAuthCleartextPassword(h){this._getPassword(()=>{this.connection.password(this.password)})}_handleAuthMD5Password(h){this._getPassword(async()=>{try{const y=await u.postgresMd5PasswordHash(this.user,this.password,h.salt);this.connection.password(y)}catch(y){this.emit("error",y)}})}_handleAuthSASL(h){this._getPassword(()=>{try{this.saslSession=s.startSession(h.mechanisms,this.enableChannelBinding&&this.connection.stream),this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism,this.saslSession.response)}catch(y){this.connection.emit("error",y)}})}async _handleAuthSASLContinue(h){try{await s.continueSession(this.saslSession,this.password,h.data,this.enableChannelBinding&&this.connection.stream),this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)}catch(y){this.connection.emit("error",y)}}_handleAuthSASLFinal(h){try{s.finalizeSession(this.saslSession,h.data),this.saslSession=null}catch(y){this.connection.emit("error",y)}}_handleBackendKeyData(h){this.processID=h.processID,this.secretKey=h.secretKey}_handleReadyForQuery(h){this._connecting&&(this._connecting=!1,this._connected=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback&&(this._connectionCallback(null,this),this._connectionCallback=null),this.emit("connect"));const y=this._getActiveQuery();this._activeQuery=null,this.readyForQuery=!0,y&&y.handleReadyForQuery(this.connection),this._pulseQueryQueue()}_handleErrorWhileConnecting(h){if(!this._connectionError){if(this._connectionError=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback)return this._connectionCallback(h);this.emit("error",h)}}_handleErrorEvent(h){if(this._connecting)return this._handleErrorWhileConnecting(h);this._queryable=!1,this._errorAllQueries(h),this.emit("error",h)}_handleErrorMessage(h){if(this._connecting)return this._handleErrorWhileConnecting(h);const y=this._getActiveQuery();if(!y){this._handleErrorEvent(h);return}this._activeQuery=null,y.handleError(h,this.connection)}_handleRowDescription(h){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected rowDescription message from backend.");this._handleErrorEvent(E);return}y.handleRowDescription(h)}_handleDataRow(h){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected dataRow message from backend.");this._handleErrorEvent(E);return}y.handleDataRow(h)}_handlePortalSuspended(h){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected portalSuspended message from backend.");this._handleErrorEvent(E);return}y.handlePortalSuspended(this.connection)}_handleEmptyQuery(h){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected emptyQuery message from backend.");this._handleErrorEvent(E);return}y.handleEmptyQuery(this.connection)}_handleCommandComplete(h){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected commandComplete message from backend.");this._handleErrorEvent(E);return}y.handleCommandComplete(h,this.connection)}_handleParseComplete(){const h=this._getActiveQuery();if(h==null){const y=new Error("Received unexpected parseComplete message from backend.");this._handleErrorEvent(y);return}h.name&&(this.connection.parsedStatements[h.name]=h.text)}_handleCopyInResponse(h){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected copyInResponse message from backend.");this._handleErrorEvent(E);return}y.handleCopyInResponse(this.connection)}_handleCopyData(h){const y=this._getActiveQuery();if(y==null){const E=new Error("Received unexpected copyData message from backend.");this._handleErrorEvent(E);return}y.handleCopyData(h,this.connection)}_handleNotification(h){this.emit("notification",h)}_handleNotice(h){this.emit("notice",h)}getStartupConf(){const h=this.connectionParameters,y={user:h.user,database:h.database},E=h.application_name||h.fallback_application_name;return E&&(y.application_name=E),h.replication&&(y.replication=""+h.replication),h.statement_timeout&&(y.statement_timeout=String(parseInt(h.statement_timeout,10))),h.lock_timeout&&(y.lock_timeout=String(parseInt(h.lock_timeout,10))),h.idle_in_transaction_session_timeout&&(y.idle_in_transaction_session_timeout=String(parseInt(h.idle_in_transaction_session_timeout,10))),h.options&&(y.options=h.options),y}cancel(h,y){if(h.activeQuery===y){const E=this.connection;this.host&&this.host.indexOf("/")===0?E.connect(this.host+"/.s.PGSQL."+this.port):E.connect(this.port,this.host),E.on("connect",function(){E.cancel(h.processID,h.secretKey)})}else h._queryQueue.indexOf(y)!==-1&&h._queryQueue.splice(h._queryQueue.indexOf(y),1)}setTypeParser(h,y,E){return this._types.setTypeParser(h,y,E)}getTypeParser(h,y){return this._types.getTypeParser(h,y)}escapeIdentifier(h){return t.escapeIdentifier(h)}escapeLiteral(h){return t.escapeLiteral(h)}_pulseQueryQueue(){if(this.readyForQuery===!0){this._activeQuery=this._queryQueue.shift();const h=this._getActiveQuery();if(h){this.readyForQuery=!1,this.hasExecuted=!0;const y=h.submit(this.connection);y&&process.nextTick(()=>{h.handleError(y,this.connection),this.readyForQuery=!0,this._pulseQueryQueue()})}else this.hasExecuted&&(this._activeQuery=null,this.emit("drain"))}}query(h,y,E){let S,L,A,m,_;if(h==null)throw new TypeError("Client was passed a null or undefined query");return typeof h.submit=="function"?(A=h.query_timeout||this.connectionParameters.query_timeout,L=S=h,S.callback||(typeof y=="function"?S.callback=y:E&&(S.callback=E))):(A=h.query_timeout||this.connectionParameters.query_timeout,S=new o(h,y,E),S.callback||(L=new this._Promise((w,T)=>{S.callback=(C,I)=>C?T(C):w(I)}).catch(w=>{throw Error.captureStackTrace(w),w}))),A&&(_=S.callback||(()=>{}),m=setTimeout(()=>{const w=new Error("Query read timeout");process.nextTick(()=>{S.handleError(w,this.connection)}),_(w),S.callback=()=>{};const T=this._queryQueue.indexOf(S);T>-1&&this._queryQueue.splice(T,1),this._pulseQueryQueue()},A),S.callback=(w,T)=>{clearTimeout(m),_(w,T)}),this.binary&&!S.binary&&(S.binary=!0),S._result&&!S._result._types&&(S._result._types=this._types),this._queryable?this._ending?(process.nextTick(()=>{S.handleError(new Error("Client was closed and is not queryable"),this.connection)}),L):(this._queryQueue.length>0&&g(),this._queryQueue.push(S),this._pulseQueryQueue(),L):(process.nextTick(()=>{S.handleError(new Error("Client has encountered a connection error and is not queryable"),this.connection)}),L)}ref(){this.connection.ref()}unref(){this.connection.unref()}end(h){if(this._ending=!0,!this.connection._connecting||this._ended)if(h)h();else return this._Promise.resolve();if(this._getActiveQuery()||!this._queryable?this.connection.stream.destroy():this.connection.end(),h)this.connection.once("end",h);else return new this._Promise(y=>{this.connection.once("end",y)})}get queryQueue(){return f(),this._queryQueue}}return b.Query=o,qr=b,qr}var Dr,bn;function ia(){if(bn)return Dr;bn=1;const e=ze.EventEmitter,t=function(){},r=(u,a)=>{const f=u.findIndex(a);return f===-1?void 0:u.splice(f,1)[0]};class s{constructor(a,f,d){this.client=a,this.idleListener=f,this.timeoutId=d}}class n{constructor(a){this.callback=a}}function i(){throw new Error("Release called on client which has already been released to the pool.")}function o(u,a){if(a)return{callback:a,result:void 0};let f,d;const p=function(b,v){b?f(b):d(v)},g=new u(function(b,v){d=b,f=v}).catch(b=>{throw Error.captureStackTrace(b),b});return{callback:p,result:g}}function l(u,a){return function f(d){d.client=a,a.removeListener("error",f),a.on("error",()=>{u.log("additional client error after disconnection due to error",d)}),u._remove(a),u.emit("error",d,a)}}class c extends e{constructor(a,f){super(),this.options=Object.assign({},a),a!=null&&"password"in a&&Object.defineProperty(this.options,"password",{configurable:!0,enumerable:!1,writable:!0,value:a.password}),a!=null&&a.ssl&&a.ssl.key&&Object.defineProperty(this.options.ssl,"key",{enumerable:!1}),this.options.max=this.options.max||this.options.poolSize||10,this.options.min=this.options.min||0,this.options.maxUses=this.options.maxUses||1/0,this.options.allowExitOnIdle=this.options.allowExitOnIdle||!1,this.options.maxLifetimeSeconds=this.options.maxLifetimeSeconds||0,this.log=this.options.log||function(){},this.Client=this.options.Client||f||mi().Client,this.Promise=this.options.Promise||Vr.Promise,typeof this.options.idleTimeoutMillis>"u"&&(this.options.idleTimeoutMillis=1e4),this._clients=[],this._idle=[],this._expired=new WeakSet,this._pendingQueue=[],this._endCallback=void 0,this.ending=!1,this.ended=!1}_promiseTry(a){const f=this.Promise;return typeof f.try=="function"?f.try(a):new f(d=>d(a()))}_isFull(){return this._clients.length>=this.options.max}_isAboveMin(){return this._clients.length>this.options.min}_pulseQueue(){if(this.log("pulse queue"),this.ended){this.log("pulse queue ended");return}if(this.ending){this.log("pulse queue on ending"),this._idle.length&&this._idle.slice().map(f=>{this._remove(f.client)}),this._clients.length||(this.ended=!0,this._endCallback());return}if(!this._pendingQueue.length){this.log("no queued requests");return}if(!this._idle.length&&this._isFull())return;const a=this._pendingQueue.shift();if(this._idle.length){const f=this._idle.pop();clearTimeout(f.timeoutId);const d=f.client;d.ref&&d.ref();const p=f.idleListener;return this._acquireClient(d,a,p,!1)}if(!this._isFull())return this.newClient(a);throw new Error("unexpected condition")}_remove(a,f){const d=r(this._idle,g=>g.client===a);d!==void 0&&clearTimeout(d.timeoutId),this._clients=this._clients.filter(g=>g!==a);const p=this;a.end(()=>{p.emit("remove",a),typeof f=="function"&&f()})}connect(a){if(this.ending){const p=new Error("Cannot use a pool after calling end on the pool");return a?a(p):this.Promise.reject(p)}const f=o(this.Promise,a),d=f.result;if(this._isFull()||this._idle.length){if(this._idle.length&&process.nextTick(()=>this._pulseQueue()),!this.options.connectionTimeoutMillis)return this._pendingQueue.push(new n(f.callback)),d;const p=(v,h,y)=>{clearTimeout(b),f.callback(v,h,y)},g=new n(p),b=setTimeout(()=>{r(this._pendingQueue,v=>v.callback===p),g.timedOut=!0,f.callback(new Error("timeout exceeded when trying to connect"))},this.options.connectionTimeoutMillis);return b.unref&&b.unref(),this._pendingQueue.push(g),d}return this.newClient(new n(f.callback)),d}newClient(a){const f=new this.Client(this.options);this._clients.push(f);const d=l(this,f);this.log("checking client timeout");let p,g=!1;this.options.connectionTimeoutMillis&&(p=setTimeout(()=>{f.connection?(this.log("ending client due to timeout"),g=!0,f.connection.stream.destroy()):f.isConnected()||(this.log("ending client due to timeout"),g=!0,f.end())},this.options.connectionTimeoutMillis)),this.log("connecting new client"),f.connect(b=>{if(p&&clearTimeout(p),f.on("error",d),b)this.log("client failed to connect",b),this._clients=this._clients.filter(v=>v!==f),g&&(b=new Error("Connection terminated due to connection timeout",{cause:b})),this._pulseQueue(),a.timedOut||a.callback(b,void 0,t);else{if(this.log("new client connected"),this.options.onConnect){this._promiseTry(()=>this.options.onConnect(f)).then(()=>{this._afterConnect(f,a,d)},v=>{this._clients=this._clients.filter(h=>h!==f),f.end(()=>{this._pulseQueue(),a.timedOut||a.callback(v,void 0,t)})});return}return this._afterConnect(f,a,d)}})}_afterConnect(a,f,d){if(this.options.maxLifetimeSeconds!==0){const p=setTimeout(()=>{this.log("ending client due to expired lifetime"),this._expired.add(a),this._idle.findIndex(b=>b.client===a)!==-1&&this._acquireClient(a,new n((b,v,h)=>h()),d,!1)},this.options.maxLifetimeSeconds*1e3);p.unref(),a.once("end",()=>clearTimeout(p))}return this._acquireClient(a,f,d,!0)}_acquireClient(a,f,d,p){p&&this.emit("connect",a),this.emit("acquire",a),a.release=this._releaseOnce(a,d),a.removeListener("error",d),f.timedOut?p&&this.options.verify?this.options.verify(a,a.release):a.release():p&&this.options.verify?this.options.verify(a,g=>{if(g)return a.release(g),f.callback(g,void 0,t);f.callback(void 0,a,a.release)}):f.callback(void 0,a,a.release)}_releaseOnce(a,f){let d=!1;return p=>{d&&i(),d=!0,this._release(a,f,p)}}_release(a,f,d){if(a.on("error",f),a._poolUseCount=(a._poolUseCount||0)+1,this.emit("release",d,a),d||this.ending||!a._queryable||a._ending||a._poolUseCount>=this.options.maxUses)return a._poolUseCount>=this.options.maxUses&&this.log("remove expended client"),this._remove(a,this._pulseQueue.bind(this));if(this._expired.has(a))return this.log("remove expired client"),this._expired.delete(a),this._remove(a,this._pulseQueue.bind(this));let g;this.options.idleTimeoutMillis&&this._isAboveMin()&&(g=setTimeout(()=>{this._isAboveMin()&&(this.log("remove idle client"),this._remove(a,this._pulseQueue.bind(this)))},this.options.idleTimeoutMillis),this.options.allowExitOnIdle&&g.unref()),this.options.allowExitOnIdle&&a.unref(),this._idle.push(new s(a,f,g)),this._pulseQueue()}query(a,f,d){if(typeof a=="function"){const g=o(this.Promise,a);return setImmediate(function(){return g.callback(new Error("Passing a function as the first parameter to pool.query is not supported"))}),g.result}typeof f=="function"&&(d=f,f=void 0);const p=o(this.Promise,d);return d=p.callback,this.connect((g,b)=>{if(g)return d(g);let v=!1;const h=y=>{v||(v=!0,b.release(y),d(y))};b.once("error",h),this.log("dispatching query");try{b.query(a,f,(y,E)=>{if(this.log("query dispatched"),b.removeListener("error",h),!v)return v=!0,b.release(y),y?d(y):d(void 0,E)})}catch(y){return b.release(y),d(y)}}),p.result}end(a){if(this.log("ending"),this.ending){const d=new Error("Called end on pool more than once");return a?a(d):this.Promise.reject(d)}this.ending=!0;const f=o(this.Promise,a);return this._endCallback=f.callback,this._pulseQueue(),f.result}get waitingCount(){return this._pendingQueue.length}get idleCount(){return this._idle.length}get expiredCount(){return this._clients.reduce((a,f)=>a+(this._expired.has(f)?1:0),0)}get totalCount(){return this._clients.length}}return Dr=c,Dr}var jr={exports:{}};const oa={},aa=Object.freeze(Object.defineProperty({__proto__:null,default:oa},Symbol.toStringTag,{value:"Module"})),la=oo(aa);var kr={exports:{}},yn;function ca(){if(yn)return kr.exports;yn=1;const e=ze.EventEmitter,t=He,r=Ze(),s=kr.exports=function(i,o,l){e.call(this),i=r.normalizeQueryConfig(i,o,l),this.text=i.text,this.values=i.values,this.name=i.name,this.queryMode=i.queryMode,this.callback=i.callback,this.state="new",this._arrayMode=i.rowMode==="array",this._emitRowEvents=!1,this.on("newListener",(function(c){c==="row"&&(this._emitRowEvents=!0)}).bind(this))};t.inherits(s,e);const n={sqlState:"code",statementPosition:"position",messagePrimary:"message",context:"where",schemaName:"schema",tableName:"table",columnName:"column",dataTypeName:"dataType",constraintName:"constraint",sourceFile:"file",sourceLine:"line",sourceFunction:"routine"};return s.prototype.handleError=function(i){const o=this.native.pq.resultErrorFields();if(o)for(const l in o){const c=n[l]||l;i[c]=o[l]}this.callback?this.callback(i):this.emit("error",i),this.state="error"},s.prototype.then=function(i,o){return this._getPromise().then(i,o)},s.prototype.catch=function(i){return this._getPromise().catch(i)},s.prototype._getPromise=function(){return this._promise?this._promise:(this._promise=new Promise((function(i,o){this._once("end",i),this._once("error",o)}).bind(this)),this._promise)},s.prototype.submit=function(i){this.state="running";const o=this;this.native=i.native,i.native.arrayMode=this._arrayMode;let l=function(c,u,a){if(i.native.arrayMode=!1,setImmediate(function(){o.emit("_done")}),c)return o.handleError(c);o._emitRowEvents&&(a.length>1?u.forEach((f,d)=>{f.forEach(p=>{o.emit("row",p,a[d])})}):u.forEach(function(f){o.emit("row",f,a)})),o.state="end",o.emit("end",a),o.callback&&o.callback(null,a)};if(process.domain&&(l=process.domain.bind(l)),this.name){this.name.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",this.name,this.name.length),console.error("This can cause conflicts and silent errors executing queries"));const c=(this.values||[]).map(r.prepareValue);if(i.namedQueries[this.name]){if(this.text&&i.namedQueries[this.name]!==this.text){const u=new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);return l(u)}return i.native.execute(this.name,c,l)}return i.native.prepare(this.name,this.text,c.length,function(u){return u?l(u):(i.namedQueries[o.name]=o.text,o.native.execute(o.name,c,l))})}else if(this.values){if(!Array.isArray(this.values)){const u=new Error("Query values must be an array");return l(u)}const c=this.values.map(r.prepareValue);i.native.query(this.text,c,l)}else this.queryMode==="extended"?i.native.query(this.text,[],l):i.native.query(this.text,l)},kr.exports}var vn;function ua(){if(vn)return jr.exports;vn=1;const e=He;var t;try{t=la}catch(u){throw u}const r=Gr(),s=ze.EventEmitter,n=He,i=ui(),o=ca(),l=e.deprecate(()=>{},"Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead."),c=jr.exports=function(u){s.call(this),u=u||{},this._Promise=u.Promise||Vr.Promise,this._types=new r(u.types),this.native=new t({types:this._types}),this._queryQueue=[],this._ending=!1,this._connecting=!1,this._connected=!1,this._queryable=!0;const a=this.connectionParameters=new i(u);u.nativeConnectionString&&(a.nativeConnectionString=u.nativeConnectionString),this.user=a.user,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:a.password}),this.database=a.database,this.host=a.host,this.port=a.port,this.namedQueries={}};return c.Query=o,n.inherits(c,s),c.prototype._errorAllQueries=function(u){const a=f=>{process.nextTick(()=>{f.native=this.native,f.handleError(u)})};this._hasActiveQuery()&&(a(this._activeQuery),this._activeQuery=null),this._queryQueue.forEach(a),this._queryQueue.length=0},c.prototype._connect=function(u){const a=this;if(this._connecting){process.nextTick(()=>u(new Error("Client has already been connected. You cannot reuse a client.")));return}this._connecting=!0,this.connectionParameters.getLibpqConnectionString(function(f,d){if(a.connectionParameters.nativeConnectionString&&(d=a.connectionParameters.nativeConnectionString),f)return u(f);a.native.connect(d,function(p){if(p)return a.native.end(),u(p);a._connected=!0,a.native.on("error",function(g){a._queryable=!1,a._errorAllQueries(g),a.emit("error",g)}),a.native.on("notification",function(g){a.emit("notification",{channel:g.relname,payload:g.extra})}),a.emit("connect"),a._pulseQueryQueue(!0),u(null,this)})})},c.prototype.connect=function(u){if(u){this._connect(u);return}return new this._Promise((a,f)=>{this._connect(d=>{d?f(d):a(this)})})},c.prototype.query=function(u,a,f){let d,p,g,b,v;if(u==null)throw new TypeError("Client was passed a null or undefined query");if(typeof u.submit=="function")g=u.query_timeout||this.connectionParameters.query_timeout,p=d=u,typeof a=="function"&&(u.callback=a);else if(g=u.query_timeout||this.connectionParameters.query_timeout,d=new o(u,a,f),!d.callback){let h,y;p=new this._Promise((E,S)=>{h=E,y=S}).catch(E=>{throw Error.captureStackTrace(E),E}),d.callback=(E,S)=>E?y(E):h(S)}return g&&(v=d.callback||(()=>{}),b=setTimeout(()=>{const h=new Error("Query read timeout");process.nextTick(()=>{d.handleError(h,this.connection)}),v(h),d.callback=()=>{};const y=this._queryQueue.indexOf(d);y>-1&&this._queryQueue.splice(y,1),this._pulseQueryQueue()},g),d.callback=(h,y)=>{clearTimeout(b),v(h,y)}),this._queryable?this._ending?(d.native=this.native,process.nextTick(()=>{d.handleError(new Error("Client was closed and is not queryable"))}),p):(this._queryQueue.length>0&&l(),this._queryQueue.push(d),this._pulseQueryQueue(),p):(d.native=this.native,process.nextTick(()=>{d.handleError(new Error("Client has encountered a connection error and is not queryable"))}),p)},c.prototype.end=function(u){const a=this;this._ending=!0,this._connected||this.once("connect",this.end.bind(this,u));let f;return u||(f=new this._Promise(function(d,p){u=g=>g?p(g):d()})),this.native.end(function(){a._connected=!1,a._errorAllQueries(new Error("Connection terminated")),process.nextTick(()=>{a.emit("end"),u&&u()})}),f},c.prototype._hasActiveQuery=function(){return this._activeQuery&&this._activeQuery.state!=="error"&&this._activeQuery.state!=="end"},c.prototype._pulseQueryQueue=function(u){if(!this._connected||this._hasActiveQuery())return;const a=this._queryQueue.shift();if(!a){u||this.emit("drain");return}this._activeQuery=a,a.submit(this);const f=this;a.once("_done",function(){f._pulseQueryQueue()})},c.prototype.cancel=function(u){this._activeQuery===u?this.native.cancel(function(){}):this._queryQueue.indexOf(u)!==-1&&this._queryQueue.splice(this._queryQueue.indexOf(u),1)},c.prototype.ref=function(){},c.prototype.unref=function(){},c.prototype.setTypeParser=function(u,a,f){return this._types.setTypeParser(u,a,f)},c.prototype.getTypeParser=function(u,a){return this._types.getTypeParser(u,a)},c.prototype.isConnected=function(){return this._connected},jr.exports}var Br,wn;function En(){return wn||(wn=1,Br=ua()),Br}var xn;function mi(){return xn||(xn=1,(function(e){var t={};const r=na(),s=St(),n=hi(),i=di(),o=Ze(),l=ia(),c=Gr(),{DatabaseError:u}=pi(),{escapeIdentifier:a,escapeLiteral:f}=Ze(),d=v=>class extends l{constructor(y){super(y,v)}},p=function(v){this.defaults=s,this.Client=v,this.Query=this.Client.Query,this.Pool=d(this.Client),this._pools=[],this.Connection=n,this.types=_t(),this.DatabaseError=u,this.TypeOverrides=c,this.escapeIdentifier=a,this.escapeLiteral=f,this.Result=i,this.utils=o};let g=r,b=!1;try{b=!!t.NODE_PG_FORCE_NATIVE}catch{}b&&(g=En()),e.exports=new p(g),Object.defineProperty(e.exports,"native",{configurable:!0,enumerable:!1,get(){let v=null;try{v=new p(En())}catch(h){if(h.code!=="MODULE_NOT_FOUND")throw h}return Object.defineProperty(e.exports,"native",{value:v}),v}})})(ar)),ar.exports}var da=mi();const Z=Zn(da);Z.Client;const fa=Z.Pool;Z.Connection;Z.types;Z.Query;Z.DatabaseError;Z.escapeIdentifier;Z.escapeLiteral;Z.Result;Z.TypeOverrides;Z.defaults;const pa=Object.freeze(Object.defineProperty({__proto__:null,Pool:fa,default:Z},Symbol.toStringTag,{value:"Module"}));export{Ls as default};
