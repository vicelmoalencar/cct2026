var bn=Object.defineProperty;var es=e=>{throw TypeError(e)};var yn=(e,t,r)=>t in e?bn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var j=(e,t,r)=>yn(e,typeof t!="symbol"?t+"":t,r),Ot=(e,t,r)=>t.has(e)||es("Cannot "+r);var N=(e,t,r)=>(Ot(e,t,"read from private field"),r?r.call(e):t.get(e)),U=(e,t,r)=>t.has(e)?es("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),k=(e,t,r,s)=>(Ot(e,t,"write to private field"),s?s.call(e,r):t.set(e,r),r),H=(e,t,r)=>(Ot(e,t,"access private method"),r);var ts=(e,t,r,s)=>({set _(i){k(e,t,i,r)},get _(){return N(e,t,s)}});import ze from"events";import He from"util";import Pi from"crypto";import vn from"dns";import qi from"fs";import Di from"net";import wn from"tls";import En from"path";import ji from"stream";import _n from"string_decoder";var rs=(e,t,r)=>(s,i)=>{let n=-1;return o(0);async function o(l){if(l<=n)throw new Error("next() called multiple times");n=l;let u,d=!1,a;if(e[l]?(a=e[l][0][0],s.req.routeIndex=l):a=l===e.length&&i||void 0,a)try{u=await a(s,()=>o(l+1))}catch(f){if(f instanceof Error&&t)s.error=f,u=await t(f,s),d=!0;else throw f}else s.finalized===!1&&r&&(u=await r(s));return u&&(s.finalized===!1||d)&&(s.res=u),s}},xn=Symbol(),Sn=async(e,t=Object.create(null))=>{const{all:r=!1,dot:s=!1}=t,n=(e instanceof Fi?e.raw.headers:e.headers).get("Content-Type");return n!=null&&n.startsWith("multipart/form-data")||n!=null&&n.startsWith("application/x-www-form-urlencoded")?An(e,{all:r,dot:s}):{}};async function An(e,t){const r=await e.formData();return r?Tn(r,t):{}}function Tn(e,t){const r=Object.create(null);return e.forEach((s,i)=>{t.all||i.endsWith("[]")?Cn(r,i,s):r[i]=s}),t.dot&&Object.entries(r).forEach(([s,i])=>{s.includes(".")&&(Rn(r,s,i),delete r[s])}),r}var Cn=(e,t,r)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(r):e[t]=[e[t],r]:t.endsWith("[]")?e[t]=[r]:e[t]=r},Rn=(e,t,r)=>{let s=e;const i=t.split(".");i.forEach((n,o)=>{o===i.length-1?s[n]=r:((!s[n]||typeof s[n]!="object"||Array.isArray(s[n])||s[n]instanceof File)&&(s[n]=Object.create(null)),s=s[n])})},ki=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Nn=e=>{const{groups:t,path:r}=In(e),s=ki(r);return On(s,t)},In=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(r,s)=>{const i=`@${s}`;return t.push([i,r]),i}),{groups:t,path:e}},On=(e,t)=>{for(let r=t.length-1;r>=0;r--){const[s]=t[r];for(let i=e.length-1;i>=0;i--)if(e[i].includes(s)){e[i]=e[i].replace(s,t[r][1]);break}}return e},ct={},Ln=(e,t)=>{if(e==="*")return"*";const r=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(r){const s=`${e}#${t}`;return ct[s]||(r[2]?ct[s]=t&&t[0]!==":"&&t[0]!=="*"?[s,r[1],new RegExp(`^${r[2]}(?=/${t})`)]:[e,r[1],new RegExp(`^${r[2]}$`)]:ct[s]=[e,r[1],!0]),ct[s]}return null},wt=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,r=>{try{return t(r)}catch{return r}})}},Pn=e=>wt(e,decodeURI),Bi=e=>{const t=e.url,r=t.indexOf("/",t.indexOf(":")+4);let s=r;for(;s<t.length;s++){const i=t.charCodeAt(s);if(i===37){const n=t.indexOf("?",s),o=t.slice(r,n===-1?void 0:n);return Pn(o.includes("%25")?o.replace(/%25/g,"%2525"):o)}else if(i===63)break}return t.slice(r,s)},qn=e=>{const t=Bi(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},qe=(e,t,...r)=>(r.length&&(t=qe(t,...r)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),Mi=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),r=[];let s="";return t.forEach(i=>{if(i!==""&&!/\:/.test(i))s+="/"+i;else if(/\:/.test(i))if(/\?/.test(i)){r.length===0&&s===""?r.push("/"):r.push(s);const n=i.replace("?","");s+="/"+n,r.push(s)}else s+="/"+i}),r.filter((i,n,o)=>o.indexOf(i)===n)},Lt=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?wt(e,zr):e):e,Ui=(e,t,r)=>{let s;if(!r&&t&&!/[%+]/.test(t)){let o=e.indexOf(`?${t}`,8);for(o===-1&&(o=e.indexOf(`&${t}`,8));o!==-1;){const l=e.charCodeAt(o+t.length+1);if(l===61){const u=o+t.length+2,d=e.indexOf("&",u);return Lt(e.slice(u,d===-1?void 0:d))}else if(l==38||isNaN(l))return"";o=e.indexOf(`&${t}`,o+1)}if(s=/[%+]/.test(e),!s)return}const i={};s??(s=/[%+]/.test(e));let n=e.indexOf("?",8);for(;n!==-1;){const o=e.indexOf("&",n+1);let l=e.indexOf("=",n);l>o&&o!==-1&&(l=-1);let u=e.slice(n+1,l===-1?o===-1?void 0:o:l);if(s&&(u=Lt(u)),n=o,u==="")continue;let d;l===-1?d="":(d=e.slice(l+1,o===-1?void 0:o),s&&(d=Lt(d))),r?(i[u]&&Array.isArray(i[u])||(i[u]=[]),i[u].push(d)):i[u]??(i[u]=d)}return t?i[t]:i},Dn=Ui,jn=(e,t)=>Ui(e,t,!0),zr=decodeURIComponent,ss=e=>wt(e,zr),ke,Z,fe,Hi,$i,Ur,me,Si,Fi=(Si=class{constructor(e,t="/",r=[[]]){U(this,fe);j(this,"raw");U(this,ke);U(this,Z);j(this,"routeIndex",0);j(this,"path");j(this,"bodyCache",{});U(this,me,e=>{const{bodyCache:t,raw:r}=this,s=t[e];if(s)return s;const i=Object.keys(t)[0];return i?t[i].then(n=>(i==="json"&&(n=JSON.stringify(n)),new Response(n)[e]())):t[e]=r[e]()});this.raw=e,this.path=t,k(this,Z,r),k(this,ke,{})}param(e){return e?H(this,fe,Hi).call(this,e):H(this,fe,$i).call(this)}query(e){return Dn(this.url,e)}queries(e){return jn(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((r,s)=>{t[s]=r}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await Sn(this,e))}json(){return N(this,me).call(this,"text").then(e=>JSON.parse(e))}text(){return N(this,me).call(this,"text")}arrayBuffer(){return N(this,me).call(this,"arrayBuffer")}blob(){return N(this,me).call(this,"blob")}formData(){return N(this,me).call(this,"formData")}addValidatedData(e,t){N(this,ke)[e]=t}valid(e){return N(this,ke)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[xn](){return N(this,Z)}get matchedRoutes(){return N(this,Z)[0].map(([[,e]])=>e)}get routePath(){return N(this,Z)[0].map(([[,e]])=>e)[this.routeIndex].path}},ke=new WeakMap,Z=new WeakMap,fe=new WeakSet,Hi=function(e){const t=N(this,Z)[0][this.routeIndex][1][e],r=H(this,fe,Ur).call(this,t);return r&&/\%/.test(r)?ss(r):r},$i=function(){const e={},t=Object.keys(N(this,Z)[0][this.routeIndex][1]);for(const r of t){const s=H(this,fe,Ur).call(this,N(this,Z)[0][this.routeIndex][1][r]);s!==void 0&&(e[r]=/\%/.test(s)?ss(s):s)}return e},Ur=function(e){return N(this,Z)[1]?N(this,Z)[1][e]:e},me=new WeakMap,Si),kn={Stringify:1},zi=async(e,t,r,s,i)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const n=e.callbacks;return n!=null&&n.length?(i?i[0]+=e:i=[e],Promise.all(n.map(l=>l({phase:t,buffer:i,context:s}))).then(l=>Promise.all(l.filter(Boolean).map(u=>zi(u,t,!1,s,i))).then(()=>i[0]))):Promise.resolve(e)},Bn="text/plain; charset=UTF-8",Pt=(e,t)=>({"Content-Type":e,...t}),rt,st,le,Be,ce,Y,it,Me,Ue,_e,nt,ot,he,De,Ai,Mn=(Ai=class{constructor(e,t){U(this,he);U(this,rt);U(this,st);j(this,"env",{});U(this,le);j(this,"finalized",!1);j(this,"error");U(this,Be);U(this,ce);U(this,Y);U(this,it);U(this,Me);U(this,Ue);U(this,_e);U(this,nt);U(this,ot);j(this,"render",(...e)=>(N(this,Me)??k(this,Me,t=>this.html(t)),N(this,Me).call(this,...e)));j(this,"setLayout",e=>k(this,it,e));j(this,"getLayout",()=>N(this,it));j(this,"setRenderer",e=>{k(this,Me,e)});j(this,"header",(e,t,r)=>{this.finalized&&k(this,Y,new Response(N(this,Y).body,N(this,Y)));const s=N(this,Y)?N(this,Y).headers:N(this,_e)??k(this,_e,new Headers);t===void 0?s.delete(e):r!=null&&r.append?s.append(e,t):s.set(e,t)});j(this,"status",e=>{k(this,Be,e)});j(this,"set",(e,t)=>{N(this,le)??k(this,le,new Map),N(this,le).set(e,t)});j(this,"get",e=>N(this,le)?N(this,le).get(e):void 0);j(this,"newResponse",(...e)=>H(this,he,De).call(this,...e));j(this,"body",(e,t,r)=>H(this,he,De).call(this,e,t,r));j(this,"text",(e,t,r)=>!N(this,_e)&&!N(this,Be)&&!t&&!r&&!this.finalized?new Response(e):H(this,he,De).call(this,e,t,Pt(Bn,r)));j(this,"json",(e,t,r)=>H(this,he,De).call(this,JSON.stringify(e),t,Pt("application/json",r)));j(this,"html",(e,t,r)=>{const s=i=>H(this,he,De).call(this,i,t,Pt("text/html; charset=UTF-8",r));return typeof e=="object"?zi(e,kn.Stringify,!1,{}).then(s):s(e)});j(this,"redirect",(e,t)=>{const r=String(e);return this.header("Location",/[^\x00-\xFF]/.test(r)?encodeURI(r):r),this.newResponse(null,t??302)});j(this,"notFound",()=>(N(this,Ue)??k(this,Ue,()=>new Response),N(this,Ue).call(this,this)));k(this,rt,e),t&&(k(this,ce,t.executionCtx),this.env=t.env,k(this,Ue,t.notFoundHandler),k(this,ot,t.path),k(this,nt,t.matchResult))}get req(){return N(this,st)??k(this,st,new Fi(N(this,rt),N(this,ot),N(this,nt))),N(this,st)}get event(){if(N(this,ce)&&"respondWith"in N(this,ce))return N(this,ce);throw Error("This context has no FetchEvent")}get executionCtx(){if(N(this,ce))return N(this,ce);throw Error("This context has no ExecutionContext")}get res(){return N(this,Y)||k(this,Y,new Response(null,{headers:N(this,_e)??k(this,_e,new Headers)}))}set res(e){if(N(this,Y)&&e){e=new Response(e.body,e);for(const[t,r]of N(this,Y).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const s=N(this,Y).headers.getSetCookie();e.headers.delete("set-cookie");for(const i of s)e.headers.append("set-cookie",i)}else e.headers.set(t,r)}k(this,Y,e),this.finalized=!0}get var(){return N(this,le)?Object.fromEntries(N(this,le)):{}}},rt=new WeakMap,st=new WeakMap,le=new WeakMap,Be=new WeakMap,ce=new WeakMap,Y=new WeakMap,it=new WeakMap,Me=new WeakMap,Ue=new WeakMap,_e=new WeakMap,nt=new WeakMap,ot=new WeakMap,he=new WeakSet,De=function(e,t,r){const s=N(this,Y)?new Headers(N(this,Y).headers):N(this,_e)??new Headers;if(typeof t=="object"&&"headers"in t){const n=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[o,l]of n)o.toLowerCase()==="set-cookie"?s.append(o,l):s.set(o,l)}if(r)for(const[n,o]of Object.entries(r))if(typeof o=="string")s.set(n,o);else{s.delete(n);for(const l of o)s.append(n,l)}const i=typeof t=="number"?t:(t==null?void 0:t.status)??N(this,Be);return new Response(e,{status:i,headers:s})},Ai),z="ALL",Un="all",Fn=["get","post","put","delete","options","patch"],Wi="Can not add a route since the matcher is already built.",Vi=class extends Error{},Hn="__COMPOSED_HANDLER",$n=e=>e.text("404 Not Found",404),is=(e,t)=>{if("getResponse"in e){const r=e.getResponse();return t.newResponse(r.body,r)}return console.error(e),t.text("Internal Server Error",500)},te,W,Xi,re,we,mt,ht,Ti,Qi=(Ti=class{constructor(t={}){U(this,W);j(this,"get");j(this,"post");j(this,"put");j(this,"delete");j(this,"options");j(this,"patch");j(this,"all");j(this,"on");j(this,"use");j(this,"router");j(this,"getPath");j(this,"_basePath","/");U(this,te,"/");j(this,"routes",[]);U(this,re,$n);j(this,"errorHandler",is);j(this,"onError",t=>(this.errorHandler=t,this));j(this,"notFound",t=>(k(this,re,t),this));j(this,"fetch",(t,...r)=>H(this,W,ht).call(this,t,r[1],r[0],t.method));j(this,"request",(t,r,s,i)=>t instanceof Request?this.fetch(r?new Request(t,r):t,s,i):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${qe("/",t)}`,r),s,i)));j(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(H(this,W,ht).call(this,t.request,t,void 0,t.request.method))})});[...Fn,Un].forEach(n=>{this[n]=(o,...l)=>(typeof o=="string"?k(this,te,o):H(this,W,we).call(this,n,N(this,te),o),l.forEach(u=>{H(this,W,we).call(this,n,N(this,te),u)}),this)}),this.on=(n,o,...l)=>{for(const u of[o].flat()){k(this,te,u);for(const d of[n].flat())l.map(a=>{H(this,W,we).call(this,d.toUpperCase(),N(this,te),a)})}return this},this.use=(n,...o)=>(typeof n=="string"?k(this,te,n):(k(this,te,"*"),o.unshift(n)),o.forEach(l=>{H(this,W,we).call(this,z,N(this,te),l)}),this);const{strict:s,...i}=t;Object.assign(this,i),this.getPath=s??!0?t.getPath??Bi:qn}route(t,r){const s=this.basePath(t);return r.routes.map(i=>{var o;let n;r.errorHandler===is?n=i.handler:(n=async(l,u)=>(await rs([],r.errorHandler)(l,()=>i.handler(l,u))).res,n[Hn]=i.handler),H(o=s,W,we).call(o,i.method,i.path,n)}),this}basePath(t){const r=H(this,W,Xi).call(this);return r._basePath=qe(this._basePath,t),r}mount(t,r,s){let i,n;s&&(typeof s=="function"?n=s:(n=s.optionHandler,s.replaceRequest===!1?i=u=>u:i=s.replaceRequest));const o=n?u=>{const d=n(u);return Array.isArray(d)?d:[d]}:u=>{let d;try{d=u.executionCtx}catch{}return[u.env,d]};i||(i=(()=>{const u=qe(this._basePath,t),d=u==="/"?0:u.length;return a=>{const f=new URL(a.url);return f.pathname=f.pathname.slice(d)||"/",new Request(f,a)}})());const l=async(u,d)=>{const a=await r(i(u.req.raw),...o(u));if(a)return a;await d()};return H(this,W,we).call(this,z,qe(t,"*"),l),this}},te=new WeakMap,W=new WeakSet,Xi=function(){const t=new Qi({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,k(t,re,N(this,re)),t.routes=this.routes,t},re=new WeakMap,we=function(t,r,s){t=t.toUpperCase(),r=qe(this._basePath,r);const i={basePath:this._basePath,path:r,method:t,handler:s};this.router.add(t,r,[s,i]),this.routes.push(i)},mt=function(t,r){if(t instanceof Error)return this.errorHandler(t,r);throw t},ht=function(t,r,s,i){if(i==="HEAD")return(async()=>new Response(null,await H(this,W,ht).call(this,t,r,s,"GET")))();const n=this.getPath(t,{env:s}),o=this.router.match(i,n),l=new Mn(t,{path:n,matchResult:o,env:s,executionCtx:r,notFoundHandler:N(this,re)});if(o[0].length===1){let d;try{d=o[0][0][0][0](l,async()=>{l.res=await N(this,re).call(this,l)})}catch(a){return H(this,W,mt).call(this,a,l)}return d instanceof Promise?d.then(a=>a||(l.finalized?l.res:N(this,re).call(this,l))).catch(a=>H(this,W,mt).call(this,a,l)):d??N(this,re).call(this,l)}const u=rs(o[0],this.errorHandler,N(this,re));return(async()=>{try{const d=await u(l);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return H(this,W,mt).call(this,d,l)}})()},Ti),Yi=[];function zn(e,t){const r=this.buildAllMatchers(),s=(i,n)=>{const o=r[i]||r[z],l=o[2][n];if(l)return l;const u=n.match(o[0]);if(!u)return[[],Yi];const d=u.indexOf("",1);return[o[1][d],u]};return this.match=s,s(e,t)}var bt="[^/]+",Ke=".*",Ze="(?:|/.*)",je=Symbol(),Wn=new Set(".\\+*[^]$()");function Vn(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===Ke||e===Ze?1:t===Ke||t===Ze?-1:e===bt?1:t===bt?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var xe,Se,se,Ci,Fr=(Ci=class{constructor(){U(this,xe);U(this,Se);U(this,se,Object.create(null))}insert(t,r,s,i,n){if(t.length===0){if(N(this,xe)!==void 0)throw je;if(n)return;k(this,xe,r);return}const[o,...l]=t,u=o==="*"?l.length===0?["","",Ke]:["","",bt]:o==="/*"?["","",Ze]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(u){const a=u[1];let f=u[2]||bt;if(a&&u[2]&&(f===".*"||(f=f.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(f))))throw je;if(d=N(this,se)[f],!d){if(Object.keys(N(this,se)).some(c=>c!==Ke&&c!==Ze))throw je;if(n)return;d=N(this,se)[f]=new Fr,a!==""&&k(d,Se,i.varIndex++)}!n&&a!==""&&s.push([a,N(d,Se)])}else if(d=N(this,se)[o],!d){if(Object.keys(N(this,se)).some(a=>a.length>1&&a!==Ke&&a!==Ze))throw je;if(n)return;d=N(this,se)[o]=new Fr}d.insert(l,r,s,i,n)}buildRegExpStr(){const r=Object.keys(N(this,se)).sort(Vn).map(s=>{const i=N(this,se)[s];return(typeof N(i,Se)=="number"?`(${s})@${N(i,Se)}`:Wn.has(s)?`\\${s}`:s)+i.buildRegExpStr()});return typeof N(this,xe)=="number"&&r.unshift(`#${N(this,xe)}`),r.length===0?"":r.length===1?r[0]:"(?:"+r.join("|")+")"}},xe=new WeakMap,Se=new WeakMap,se=new WeakMap,Ci),yt,at,Ri,Qn=(Ri=class{constructor(){U(this,yt,{varIndex:0});U(this,at,new Fr)}insert(e,t,r){const s=[],i=[];for(let o=0;;){let l=!1;if(e=e.replace(/\{[^}]+\}/g,u=>{const d=`@\\${o}`;return i[o]=[d,u],o++,l=!0,d}),!l)break}const n=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let o=i.length-1;o>=0;o--){const[l]=i[o];for(let u=n.length-1;u>=0;u--)if(n[u].indexOf(l)!==-1){n[u]=n[u].replace(l,i[o][1]);break}}return N(this,at).insert(n,t,s,N(this,yt),r),s}buildRegExp(){let e=N(this,at).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const r=[],s=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(i,n,o)=>n!==void 0?(r[++t]=Number(n),"$()"):(o!==void 0&&(s[Number(o)]=++t),"")),[new RegExp(`^${e}`),r,s]}},yt=new WeakMap,at=new WeakMap,Ri),Xn=[/^$/,[],Object.create(null)],gt=Object.create(null);function Gi(e){return gt[e]??(gt[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,r)=>r?`\\${r}`:"(?:|/.*)")}$`))}function Yn(){gt=Object.create(null)}function Gn(e){var d;const t=new Qn,r=[];if(e.length===0)return Xn;const s=e.map(a=>[!/\*|\/:/.test(a[0]),...a]).sort(([a,f],[c,p])=>a?1:c?-1:f.length-p.length),i=Object.create(null);for(let a=0,f=-1,c=s.length;a<c;a++){const[p,h,b]=s[a];p?i[h]=[b.map(([m])=>[m,Object.create(null)]),Yi]:f++;let v;try{v=t.insert(h,f,p)}catch(m){throw m===je?new Vi(h):m}p||(r[f]=b.map(([m,y])=>{const w=Object.create(null);for(y-=1;y>=0;y--){const[x,O]=v[y];w[x]=O}return[m,w]}))}const[n,o,l]=t.buildRegExp();for(let a=0,f=r.length;a<f;a++)for(let c=0,p=r[a].length;c<p;c++){const h=(d=r[a][c])==null?void 0:d[1];if(!h)continue;const b=Object.keys(h);for(let v=0,m=b.length;v<m;v++)h[b[v]]=l[h[b[v]]]}const u=[];for(const a in o)u[a]=r[o[a]];return[n,u,i]}function Oe(e,t){if(e){for(const r of Object.keys(e).sort((s,i)=>i.length-s.length))if(Gi(r).test(t))return[...e[r]]}}var ge,be,vt,Ji,Ni,Jn=(Ni=class{constructor(){U(this,vt);j(this,"name","RegExpRouter");U(this,ge);U(this,be);j(this,"match",zn);k(this,ge,{[z]:Object.create(null)}),k(this,be,{[z]:Object.create(null)})}add(e,t,r){var l;const s=N(this,ge),i=N(this,be);if(!s||!i)throw new Error(Wi);s[e]||[s,i].forEach(u=>{u[e]=Object.create(null),Object.keys(u[z]).forEach(d=>{u[e][d]=[...u[z][d]]})}),t==="/*"&&(t="*");const n=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const u=Gi(t);e===z?Object.keys(s).forEach(d=>{var a;(a=s[d])[t]||(a[t]=Oe(s[d],t)||Oe(s[z],t)||[])}):(l=s[e])[t]||(l[t]=Oe(s[e],t)||Oe(s[z],t)||[]),Object.keys(s).forEach(d=>{(e===z||e===d)&&Object.keys(s[d]).forEach(a=>{u.test(a)&&s[d][a].push([r,n])})}),Object.keys(i).forEach(d=>{(e===z||e===d)&&Object.keys(i[d]).forEach(a=>u.test(a)&&i[d][a].push([r,n]))});return}const o=Mi(t)||[t];for(let u=0,d=o.length;u<d;u++){const a=o[u];Object.keys(i).forEach(f=>{var c;(e===z||e===f)&&((c=i[f])[a]||(c[a]=[...Oe(s[f],a)||Oe(s[z],a)||[]]),i[f][a].push([r,n-d+u+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(N(this,be)).concat(Object.keys(N(this,ge))).forEach(t=>{e[t]||(e[t]=H(this,vt,Ji).call(this,t))}),k(this,ge,k(this,be,void 0)),Yn(),e}},ge=new WeakMap,be=new WeakMap,vt=new WeakSet,Ji=function(e){const t=[];let r=e===z;return[N(this,ge),N(this,be)].forEach(s=>{const i=s[e]?Object.keys(s[e]).map(n=>[n,s[e][n]]):[];i.length!==0?(r||(r=!0),t.push(...i)):e!==z&&t.push(...Object.keys(s[z]).map(n=>[n,s[z][n]]))}),r?Gn(t):null},Ni),ye,ue,Ii,Kn=(Ii=class{constructor(e){j(this,"name","SmartRouter");U(this,ye,[]);U(this,ue,[]);k(this,ye,e.routers)}add(e,t,r){if(!N(this,ue))throw new Error(Wi);N(this,ue).push([e,t,r])}match(e,t){if(!N(this,ue))throw new Error("Fatal error");const r=N(this,ye),s=N(this,ue),i=r.length;let n=0,o;for(;n<i;n++){const l=r[n];try{for(let u=0,d=s.length;u<d;u++)l.add(...s[u]);o=l.match(e,t)}catch(u){if(u instanceof Vi)continue;throw u}this.match=l.match.bind(l),k(this,ye,[l]),k(this,ue,void 0);break}if(n===i)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(N(this,ue)||N(this,ye).length!==1)throw new Error("No active router has been determined yet.");return N(this,ye)[0]}},ye=new WeakMap,ue=new WeakMap,Ii),We=Object.create(null),ve,X,Ae,Fe,Q,de,Ee,Oi,Ki=(Oi=class{constructor(e,t,r){U(this,de);U(this,ve);U(this,X);U(this,Ae);U(this,Fe,0);U(this,Q,We);if(k(this,X,r||Object.create(null)),k(this,ve,[]),e&&t){const s=Object.create(null);s[e]={handler:t,possibleKeys:[],score:0},k(this,ve,[s])}k(this,Ae,[])}insert(e,t,r){k(this,Fe,++ts(this,Fe)._);let s=this;const i=Nn(t),n=[];for(let o=0,l=i.length;o<l;o++){const u=i[o],d=i[o+1],a=Ln(u,d),f=Array.isArray(a)?a[0]:u;if(f in N(s,X)){s=N(s,X)[f],a&&n.push(a[1]);continue}N(s,X)[f]=new Ki,a&&(N(s,Ae).push(a),n.push(a[1])),s=N(s,X)[f]}return N(s,ve).push({[e]:{handler:r,possibleKeys:n.filter((o,l,u)=>u.indexOf(o)===l),score:N(this,Fe)}}),s}search(e,t){var l;const r=[];k(this,Q,We);let i=[this];const n=ki(t),o=[];for(let u=0,d=n.length;u<d;u++){const a=n[u],f=u===d-1,c=[];for(let p=0,h=i.length;p<h;p++){const b=i[p],v=N(b,X)[a];v&&(k(v,Q,N(b,Q)),f?(N(v,X)["*"]&&r.push(...H(this,de,Ee).call(this,N(v,X)["*"],e,N(b,Q))),r.push(...H(this,de,Ee).call(this,v,e,N(b,Q)))):c.push(v));for(let m=0,y=N(b,Ae).length;m<y;m++){const w=N(b,Ae)[m],x=N(b,Q)===We?{}:{...N(b,Q)};if(w==="*"){const T=N(b,X)["*"];T&&(r.push(...H(this,de,Ee).call(this,T,e,N(b,Q))),k(T,Q,x),c.push(T));continue}const[O,A,g]=w;if(!a&&!(g instanceof RegExp))continue;const E=N(b,X)[O],_=n.slice(u).join("/");if(g instanceof RegExp){const T=g.exec(_);if(T){if(x[A]=T[0],r.push(...H(this,de,Ee).call(this,E,e,N(b,Q),x)),Object.keys(N(E,X)).length){k(E,Q,x);const C=((l=T[0].match(/\//))==null?void 0:l.length)??0;(o[C]||(o[C]=[])).push(E)}continue}}(g===!0||g.test(a))&&(x[A]=a,f?(r.push(...H(this,de,Ee).call(this,E,e,x,N(b,Q))),N(E,X)["*"]&&r.push(...H(this,de,Ee).call(this,N(E,X)["*"],e,x,N(b,Q)))):(k(E,Q,x),c.push(E)))}}i=c.concat(o.shift()??[])}return r.length>1&&r.sort((u,d)=>u.score-d.score),[r.map(({handler:u,params:d})=>[u,d])]}},ve=new WeakMap,X=new WeakMap,Ae=new WeakMap,Fe=new WeakMap,Q=new WeakMap,de=new WeakSet,Ee=function(e,t,r,s){const i=[];for(let n=0,o=N(e,ve).length;n<o;n++){const l=N(e,ve)[n],u=l[t]||l[z],d={};if(u!==void 0&&(u.params=Object.create(null),i.push(u),r!==We||s&&s!==We))for(let a=0,f=u.possibleKeys.length;a<f;a++){const c=u.possibleKeys[a],p=d[u.score];u.params[c]=s!=null&&s[c]&&!p?s[c]:r[c]??(s==null?void 0:s[c]),d[u.score]=!0}}return i},Oi),Te,Li,Zn=(Li=class{constructor(){j(this,"name","TrieRouter");U(this,Te);k(this,Te,new Ki)}add(e,t,r){const s=Mi(t);if(s){for(let i=0,n=s.length;i<n;i++)N(this,Te).insert(e,s[i],r);return}N(this,Te).insert(e,t,r)}match(e,t){return N(this,Te).search(e,t)}},Te=new WeakMap,Li),Zi=class extends Qi{constructor(e={}){super(e),this.router=e.router??new Kn({routers:[new Jn,new Zn]})}},eo=e=>{const r={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},s=(n=>typeof n=="string"?n==="*"?()=>n:o=>n===o?o:null:typeof n=="function"?n:o=>n.includes(o)?o:null)(r.origin),i=(n=>typeof n=="function"?n:Array.isArray(n)?()=>n:()=>[])(r.allowMethods);return async function(o,l){var a;function u(f,c){o.res.headers.set(f,c)}const d=await s(o.req.header("origin")||"",o);if(d&&u("Access-Control-Allow-Origin",d),r.origin!=="*"){const f=o.req.header("Vary");f?u("Vary",f):u("Vary","Origin")}if(r.credentials&&u("Access-Control-Allow-Credentials","true"),(a=r.exposeHeaders)!=null&&a.length&&u("Access-Control-Expose-Headers",r.exposeHeaders.join(",")),o.req.method==="OPTIONS"){r.maxAge!=null&&u("Access-Control-Max-Age",r.maxAge.toString());const f=await i(o.req.header("origin")||"",o);f.length&&u("Access-Control-Allow-Methods",f.join(","));let c=r.allowHeaders;if(!(c!=null&&c.length)){const p=o.req.header("Access-Control-Request-Headers");p&&(c=p.split(/\s*,\s*/))}return c!=null&&c.length&&(u("Access-Control-Allow-Headers",c.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await l()}},to=/^[\w!#$%&'*.^`|~+-]+$/,ro=/^[ !#-:<-[\]-~]*$/,ns=(e,t)=>{if(t&&e.indexOf(t)===-1)return{};const r=e.trim().split(";"),s={};for(let i of r){i=i.trim();const n=i.indexOf("=");if(n===-1)continue;const o=i.substring(0,n).trim();if(t&&t!==o||!to.test(o))continue;let l=i.substring(n+1).trim();if(l.startsWith('"')&&l.endsWith('"')&&(l=l.slice(1,-1)),ro.test(l)&&(s[o]=l.indexOf("%")!==-1?wt(l,zr):l,t))break}return s},so=(e,t,r={})=>{let s=`${e}=${t}`;if(e.startsWith("__Secure-")&&!r.secure)throw new Error("__Secure- Cookie must have Secure attributes");if(e.startsWith("__Host-")){if(!r.secure)throw new Error("__Host- Cookie must have Secure attributes");if(r.path!=="/")throw new Error('__Host- Cookie must have Path attributes with "/"');if(r.domain)throw new Error("__Host- Cookie must not have Domain attributes")}if(r&&typeof r.maxAge=="number"&&r.maxAge>=0){if(r.maxAge>3456e4)throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");s+=`; Max-Age=${r.maxAge|0}`}if(r.domain&&r.prefix!=="host"&&(s+=`; Domain=${r.domain}`),r.path&&(s+=`; Path=${r.path}`),r.expires){if(r.expires.getTime()-Date.now()>3456e7)throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");s+=`; Expires=${r.expires.toUTCString()}`}if(r.httpOnly&&(s+="; HttpOnly"),r.secure&&(s+="; Secure"),r.sameSite&&(s+=`; SameSite=${r.sameSite.charAt(0).toUpperCase()+r.sameSite.slice(1)}`),r.priority&&(s+=`; Priority=${r.priority.charAt(0).toUpperCase()+r.priority.slice(1)}`),r.partitioned){if(!r.secure)throw new Error("Partitioned Cookie must have Secure attributes");s+="; Partitioned"}return s},qt=(e,t,r)=>(t=encodeURIComponent(t),so(e,t,r)),V=(e,t,r)=>{const s=e.req.raw.headers.get("Cookie");if(typeof t=="string"){if(!s)return;let n=t;return ns(s,n)[n]}return s?ns(s):{}},io=(e,t,r)=>{let s;return(r==null?void 0:r.prefix)==="secure"?s=qt("__Secure-"+e,t,{path:"/",...r,secure:!0}):(r==null?void 0:r.prefix)==="host"?s=qt("__Host-"+e,t,{...r,path:"/",secure:!0,domain:void 0}):s=qt(e,t,{path:"/",...r}),s},J=(e,t,r,s)=>{const i=io(t,r,s);e.header("Set-Cookie",i,{append:!0})},et=(e,t,r)=>{const s=V(e,t);return J(e,t,"",{...r,maxAge:0}),s};class no{constructor(t,r){j(this,"supabaseUrl");j(this,"supabaseKey");this.supabaseUrl=t,this.supabaseKey=r}async query(t,r={},s){const{select:i="*",filters:n={},order:o,limit:l,single:u=!1}=r;let d=`${this.supabaseUrl}/rest/v1/${t}?select=${i}`;Object.entries(n).forEach(([c,p])=>{d+=`&${c}=eq.${p}`}),o&&(d+=`&order=${o}`),l&&(d+=`&limit=${l}`);const a={apikey:this.supabaseKey,"Content-Type":"application/json"};s&&(a.Authorization=`Bearer ${s}`),u&&(a.Accept="application/vnd.pgrst.object+json");const f=await fetch(d,{headers:a});if(!f.ok)throw new Error(`Supabase query failed: ${f.statusText}`);return await f.json()}async insert(t,r,s){const i=`${this.supabaseUrl}/rest/v1/${t}`,n={apikey:this.supabaseKey,"Content-Type":"application/json",Prefer:"return=representation"};s&&(n.Authorization=`Bearer ${s}`);const o=await fetch(i,{method:"POST",headers:n,body:JSON.stringify(r)});if(!o.ok){const l=await o.text();throw console.error(`Supabase insert failed for table ${t}:`,{status:o.status,statusText:o.statusText,error:l,data:r}),new Error(`Supabase insert failed (${o.status}): ${l}`)}return await o.json()}async update(t,r,s,i){let n=`${this.supabaseUrl}/rest/v1/${t}?`;Object.entries(r).forEach(([u,d])=>{n+=`${u}=eq.${d}&`});const o={apikey:this.supabaseKey,"Content-Type":"application/json",Prefer:"return=representation"};i&&(o.Authorization=`Bearer ${i}`);const l=await fetch(n,{method:"PATCH",headers:o,body:JSON.stringify(s)});if(!l.ok){const u=await l.text();throw new Error(`Supabase update failed: ${u}`)}return await l.json()}async delete(t,r,s){let i=`${this.supabaseUrl}/rest/v1/${t}?`;Object.entries(r).forEach(([l,u])=>{i+=`${l}=eq.${u}&`});const n={apikey:this.supabaseKey,"Content-Type":"application/json"};s&&(n.Authorization=`Bearer ${s}`);const o=await fetch(i,{method:"DELETE",headers:n});if(!o.ok){const l=await o.text();throw new Error(`Supabase delete failed: ${l}`)}return!0}async rpc(t,r={},s){const i=`${this.supabaseUrl}/rest/v1/rpc/${t}`,n={apikey:this.supabaseKey,"Content-Type":"application/json"};s&&(n.Authorization=`Bearer ${s}`);const o=await fetch(i,{method:"POST",headers:n,body:JSON.stringify(r)});if(!o.ok){const l=await o.text();throw new Error(`Supabase RPC failed: ${l}`)}return await o.json()}}const Ve=new Map;class $e{constructor(t){j(this,"connectionString");this.connectionString=t.replace("postgresql+psycopg2://","postgresql://").replace("postgres+psycopg2://","postgresql://")}async getPool(){if(Ve.has(this.connectionString))return Ve.get(this.connectionString);const t=await Promise.resolve().then(()=>ya),{Pool:r}=t.default||t;let s=this.connectionString;s.includes("connect_timeout")||(s+=(s.includes("?")?"&":"?")+"connect_timeout=5");const i=new r({connectionString:s,ssl:!1,max:5,idleTimeoutMillis:3e4,connectionTimeoutMillis:5e3});return i.on("error",n=>{console.error("❌ PostgreSQL pool error:",n.message)}),Ve.set(this.connectionString,i),i}async query(t,r={}){const{select:s="*",filters:i={},order:n,limit:o,single:l=!1}=r,u=await this.getPool(),d=[],a=[];let f=1;for(const[m,y]of Object.entries(i))d.push(`"${m}" = $${f}`),a.push(y),f++;let c="";n&&(c="ORDER BY "+n.replace(/\.desc$/i," DESC").replace(/\.asc$/i," ASC").replace(/,([^,]+)\.desc/gi,", $1 DESC").replace(/,([^,]+)\.asc/gi,", $1 ASC"));const p=d.length>0?`WHERE ${d.join(" AND ")}`:"",h=o||l?`LIMIT ${l?1:o}`:"",b=`SELECT ${s} FROM "${t}" ${p} ${c} ${h}`.trim(),v=await u.query(b,a);return l?v.rows[0]||null:v.rows}async insert(t,r){const s=await this.getPool(),i=Object.keys(r).filter(d=>r[d]!==void 0),n=i.map(d=>r[d]),o=i.map((d,a)=>`$${a+1}`),l=`
      INSERT INTO "${t}" (${i.map(d=>`"${d}"`).join(", ")})
      VALUES (${o.join(", ")})
      RETURNING *
    `;return(await s.query(l,n)).rows}async update(t,r,s){const i=await this.getPool(),n=Object.keys(s).filter(p=>s[p]!==void 0),o=[];let l=1;const u=n.map(p=>(o.push(s[p]),`"${p}" = $${l++}`)),d=[];for(const[p,h]of Object.entries(r))d.push(`"${p}" = $${l}`),o.push(h),l++;const a=d.length>0?`WHERE ${d.join(" AND ")}`:"",f=`UPDATE "${t}" SET ${u.join(", ")} ${a} RETURNING *`;return(await i.query(f,o)).rows}async delete(t,r){const s=await this.getPool(),i=[],n=[];let o=1;for(const[d,a]of Object.entries(r))i.push(`"${d}" = $${o}`),n.push(a),o++;const l=i.length>0?`WHERE ${i.join(" AND ")}`:"",u=`DELETE FROM "${t}" ${l}`;return await s.query(u,n),!0}async sql(t,r=[]){return(await(await this.getPool()).query(t,r)).rows}async rpc(t,r={}){const s=await this.getPool(),i=Object.keys(r),n=i.map(d=>r[d]),o=i.map((d,a)=>`${d} => $${a+1}`).join(", "),l=`SELECT * FROM ${t}(${o})`,u=await s.query(l,n);if(u.rows.length===1){const d=u.rows[0],a=Object.keys(d);return a.length===1?d[a[0]]:d}return u.rows}async end(){const t=Ve.get(this.connectionString);t&&(await t.end(),Ve.delete(this.connectionString))}}const os="data:image/png;base64,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";var Wr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function en(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function oo(e){if(Object.prototype.hasOwnProperty.call(e,"__esModule"))return e;var t=e.default;if(typeof t=="function"){var r=function s(){return this instanceof s?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};r.prototype=t.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(e).forEach(function(s){var i=Object.getOwnPropertyDescriptor(e,s);Object.defineProperty(r,s,i.get?i:{enumerable:!0,get:function(){return e[s]}})}),r}var Le={},Dt,as;function ao(){return as||(as=1,Dt=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),Dt}var jt={},pe={},ls;function Ce(){if(ls)return pe;ls=1;let e;const t=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return pe.getSymbolSize=function(s){if(!s)throw new Error('"version" cannot be null or undefined');if(s<1||s>40)throw new Error('"version" should be in range from 1 to 40');return s*4+17},pe.getSymbolTotalCodewords=function(s){return t[s]},pe.getBCHDigit=function(r){let s=0;for(;r!==0;)s++,r>>>=1;return s},pe.setToSJISFunction=function(s){if(typeof s!="function")throw new Error('"toSJISFunc" is not a valid function.');e=s},pe.isKanjiModeEnabled=function(){return typeof e<"u"},pe.toSJIS=function(s){return e(s)},pe}var kt={},cs;function Vr(){return cs||(cs=1,(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(r){if(typeof r!="string")throw new Error("Param is not a string");switch(r.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+r)}}e.isValid=function(s){return s&&typeof s.bit<"u"&&s.bit>=0&&s.bit<4},e.from=function(s,i){if(e.isValid(s))return s;try{return t(s)}catch{return i}}})(kt)),kt}var Bt,us;function lo(){if(us)return Bt;us=1;function e(){this.buffer=[],this.length=0}return e.prototype={get:function(t){const r=Math.floor(t/8);return(this.buffer[r]>>>7-t%8&1)===1},put:function(t,r){for(let s=0;s<r;s++)this.putBit((t>>>r-s-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(t){const r=Math.floor(this.length/8);this.buffer.length<=r&&this.buffer.push(0),t&&(this.buffer[r]|=128>>>this.length%8),this.length++}},Bt=e,Bt}var Mt,ds;function co(){if(ds)return Mt;ds=1;function e(t){if(!t||t<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=t,this.data=new Uint8Array(t*t),this.reservedBit=new Uint8Array(t*t)}return e.prototype.set=function(t,r,s,i){const n=t*this.size+r;this.data[n]=s,i&&(this.reservedBit[n]=!0)},e.prototype.get=function(t,r){return this.data[t*this.size+r]},e.prototype.xor=function(t,r,s){this.data[t*this.size+r]^=s},e.prototype.isReserved=function(t,r){return this.reservedBit[t*this.size+r]},Mt=e,Mt}var Ut={},fs;function uo(){return fs||(fs=1,(function(e){const t=Ce().getSymbolSize;e.getRowColCoords=function(s){if(s===1)return[];const i=Math.floor(s/7)+2,n=t(s),o=n===145?26:Math.ceil((n-13)/(2*i-2))*2,l=[n-7];for(let u=1;u<i-1;u++)l[u]=l[u-1]-o;return l.push(6),l.reverse()},e.getPositions=function(s){const i=[],n=e.getRowColCoords(s),o=n.length;for(let l=0;l<o;l++)for(let u=0;u<o;u++)l===0&&u===0||l===0&&u===o-1||l===o-1&&u===0||i.push([n[l],n[u]]);return i}})(Ut)),Ut}var Ft={},ps;function fo(){if(ps)return Ft;ps=1;const e=Ce().getSymbolSize,t=7;return Ft.getPositions=function(s){const i=e(s);return[[0,0],[i-t,0],[0,i-t]]},Ft}var Ht={},ms;function po(){return ms||(ms=1,(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(i){return i!=null&&i!==""&&!isNaN(i)&&i>=0&&i<=7},e.from=function(i){return e.isValid(i)?parseInt(i,10):void 0},e.getPenaltyN1=function(i){const n=i.size;let o=0,l=0,u=0,d=null,a=null;for(let f=0;f<n;f++){l=u=0,d=a=null;for(let c=0;c<n;c++){let p=i.get(f,c);p===d?l++:(l>=5&&(o+=t.N1+(l-5)),d=p,l=1),p=i.get(c,f),p===a?u++:(u>=5&&(o+=t.N1+(u-5)),a=p,u=1)}l>=5&&(o+=t.N1+(l-5)),u>=5&&(o+=t.N1+(u-5))}return o},e.getPenaltyN2=function(i){const n=i.size;let o=0;for(let l=0;l<n-1;l++)for(let u=0;u<n-1;u++){const d=i.get(l,u)+i.get(l,u+1)+i.get(l+1,u)+i.get(l+1,u+1);(d===4||d===0)&&o++}return o*t.N2},e.getPenaltyN3=function(i){const n=i.size;let o=0,l=0,u=0;for(let d=0;d<n;d++){l=u=0;for(let a=0;a<n;a++)l=l<<1&2047|i.get(d,a),a>=10&&(l===1488||l===93)&&o++,u=u<<1&2047|i.get(a,d),a>=10&&(u===1488||u===93)&&o++}return o*t.N3},e.getPenaltyN4=function(i){let n=0;const o=i.data.length;for(let u=0;u<o;u++)n+=i.data[u];return Math.abs(Math.ceil(n*100/o/5)-10)*t.N4};function r(s,i,n){switch(s){case e.Patterns.PATTERN000:return(i+n)%2===0;case e.Patterns.PATTERN001:return i%2===0;case e.Patterns.PATTERN010:return n%3===0;case e.Patterns.PATTERN011:return(i+n)%3===0;case e.Patterns.PATTERN100:return(Math.floor(i/2)+Math.floor(n/3))%2===0;case e.Patterns.PATTERN101:return i*n%2+i*n%3===0;case e.Patterns.PATTERN110:return(i*n%2+i*n%3)%2===0;case e.Patterns.PATTERN111:return(i*n%3+(i+n)%2)%2===0;default:throw new Error("bad maskPattern:"+s)}}e.applyMask=function(i,n){const o=n.size;for(let l=0;l<o;l++)for(let u=0;u<o;u++)n.isReserved(u,l)||n.xor(u,l,r(i,u,l))},e.getBestMask=function(i,n){const o=Object.keys(e.Patterns).length;let l=0,u=1/0;for(let d=0;d<o;d++){n(d),e.applyMask(d,i);const a=e.getPenaltyN1(i)+e.getPenaltyN2(i)+e.getPenaltyN3(i)+e.getPenaltyN4(i);e.applyMask(d,i),a<u&&(u=a,l=d)}return l}})(Ht)),Ht}var ut={},hs;function tn(){if(hs)return ut;hs=1;const e=Vr(),t=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],r=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return ut.getBlocksCount=function(i,n){switch(n){case e.L:return t[(i-1)*4+0];case e.M:return t[(i-1)*4+1];case e.Q:return t[(i-1)*4+2];case e.H:return t[(i-1)*4+3];default:return}},ut.getTotalCodewordsCount=function(i,n){switch(n){case e.L:return r[(i-1)*4+0];case e.M:return r[(i-1)*4+1];case e.Q:return r[(i-1)*4+2];case e.H:return r[(i-1)*4+3];default:return}},ut}var $t={},Qe={},gs;function mo(){if(gs)return Qe;gs=1;const e=new Uint8Array(512),t=new Uint8Array(256);return(function(){let s=1;for(let i=0;i<255;i++)e[i]=s,t[s]=i,s<<=1,s&256&&(s^=285);for(let i=255;i<512;i++)e[i]=e[i-255]})(),Qe.log=function(s){if(s<1)throw new Error("log("+s+")");return t[s]},Qe.exp=function(s){return e[s]},Qe.mul=function(s,i){return s===0||i===0?0:e[t[s]+t[i]]},Qe}var bs;function ho(){return bs||(bs=1,(function(e){const t=mo();e.mul=function(s,i){const n=new Uint8Array(s.length+i.length-1);for(let o=0;o<s.length;o++)for(let l=0;l<i.length;l++)n[o+l]^=t.mul(s[o],i[l]);return n},e.mod=function(s,i){let n=new Uint8Array(s);for(;n.length-i.length>=0;){const o=n[0];for(let u=0;u<i.length;u++)n[u]^=t.mul(i[u],o);let l=0;for(;l<n.length&&n[l]===0;)l++;n=n.slice(l)}return n},e.generateECPolynomial=function(s){let i=new Uint8Array([1]);for(let n=0;n<s;n++)i=e.mul(i,new Uint8Array([1,t.exp(n)]));return i}})($t)),$t}var zt,ys;function go(){if(ys)return zt;ys=1;const e=ho();function t(r){this.genPoly=void 0,this.degree=r,this.degree&&this.initialize(this.degree)}return t.prototype.initialize=function(s){this.degree=s,this.genPoly=e.generateECPolynomial(this.degree)},t.prototype.encode=function(s){if(!this.genPoly)throw new Error("Encoder not initialized");const i=new Uint8Array(s.length+this.degree);i.set(s);const n=e.mod(i,this.genPoly),o=this.degree-n.length;if(o>0){const l=new Uint8Array(this.degree);return l.set(n,o),l}return n},zt=t,zt}var Wt={},Vt={},Qt={},vs;function rn(){return vs||(vs=1,Qt.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}),Qt}var ie={},ws;function sn(){if(ws)return ie;ws=1;const e="[0-9]+",t="[A-Z $%*+\\-./:]+";let r="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";r=r.replace(/u/g,"\\u");const s="(?:(?![A-Z0-9 $%*+\\-./:]|"+r+`)(?:.|[\r
]))+`;ie.KANJI=new RegExp(r,"g"),ie.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),ie.BYTE=new RegExp(s,"g"),ie.NUMERIC=new RegExp(e,"g"),ie.ALPHANUMERIC=new RegExp(t,"g");const i=new RegExp("^"+r+"$"),n=new RegExp("^"+e+"$"),o=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return ie.testKanji=function(u){return i.test(u)},ie.testNumeric=function(u){return n.test(u)},ie.testAlphanumeric=function(u){return o.test(u)},ie}var Es;function Re(){return Es||(Es=1,(function(e){const t=rn(),r=sn();e.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(n,o){if(!n.ccBits)throw new Error("Invalid mode: "+n);if(!t.isValid(o))throw new Error("Invalid version: "+o);return o>=1&&o<10?n.ccBits[0]:o<27?n.ccBits[1]:n.ccBits[2]},e.getBestModeForData=function(n){return r.testNumeric(n)?e.NUMERIC:r.testAlphanumeric(n)?e.ALPHANUMERIC:r.testKanji(n)?e.KANJI:e.BYTE},e.toString=function(n){if(n&&n.id)return n.id;throw new Error("Invalid mode")},e.isValid=function(n){return n&&n.bit&&n.ccBits};function s(i){if(typeof i!="string")throw new Error("Param is not a string");switch(i.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+i)}}e.from=function(n,o){if(e.isValid(n))return n;try{return s(n)}catch{return o}}})(Vt)),Vt}var _s;function bo(){return _s||(_s=1,(function(e){const t=Ce(),r=tn(),s=Vr(),i=Re(),n=rn(),o=7973,l=t.getBCHDigit(o);function u(c,p,h){for(let b=1;b<=40;b++)if(p<=e.getCapacity(b,h,c))return b}function d(c,p){return i.getCharCountIndicator(c,p)+4}function a(c,p){let h=0;return c.forEach(function(b){const v=d(b.mode,p);h+=v+b.getBitsLength()}),h}function f(c,p){for(let h=1;h<=40;h++)if(a(c,h)<=e.getCapacity(h,p,i.MIXED))return h}e.from=function(p,h){return n.isValid(p)?parseInt(p,10):h},e.getCapacity=function(p,h,b){if(!n.isValid(p))throw new Error("Invalid QR Code version");typeof b>"u"&&(b=i.BYTE);const v=t.getSymbolTotalCodewords(p),m=r.getTotalCodewordsCount(p,h),y=(v-m)*8;if(b===i.MIXED)return y;const w=y-d(b,p);switch(b){case i.NUMERIC:return Math.floor(w/10*3);case i.ALPHANUMERIC:return Math.floor(w/11*2);case i.KANJI:return Math.floor(w/13);case i.BYTE:default:return Math.floor(w/8)}},e.getBestVersionForData=function(p,h){let b;const v=s.from(h,s.M);if(Array.isArray(p)){if(p.length>1)return f(p,v);if(p.length===0)return 1;b=p[0]}else b=p;return u(b.mode,b.getLength(),v)},e.getEncodedBits=function(p){if(!n.isValid(p)||p<7)throw new Error("Invalid QR Code version");let h=p<<12;for(;t.getBCHDigit(h)-l>=0;)h^=o<<t.getBCHDigit(h)-l;return p<<12|h}})(Wt)),Wt}var Xt={},xs;function yo(){if(xs)return Xt;xs=1;const e=Ce(),t=1335,r=21522,s=e.getBCHDigit(t);return Xt.getEncodedBits=function(n,o){const l=n.bit<<3|o;let u=l<<10;for(;e.getBCHDigit(u)-s>=0;)u^=t<<e.getBCHDigit(u)-s;return(l<<10|u)^r},Xt}var Yt={},Gt,Ss;function vo(){if(Ss)return Gt;Ss=1;const e=Re();function t(r){this.mode=e.NUMERIC,this.data=r.toString()}return t.getBitsLength=function(s){return 10*Math.floor(s/3)+(s%3?s%3*3+1:0)},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(s){let i,n,o;for(i=0;i+3<=this.data.length;i+=3)n=this.data.substr(i,3),o=parseInt(n,10),s.put(o,10);const l=this.data.length-i;l>0&&(n=this.data.substr(i),o=parseInt(n,10),s.put(o,l*3+1))},Gt=t,Gt}var Jt,As;function wo(){if(As)return Jt;As=1;const e=Re(),t=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function r(s){this.mode=e.ALPHANUMERIC,this.data=s}return r.getBitsLength=function(i){return 11*Math.floor(i/2)+6*(i%2)},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(i){let n;for(n=0;n+2<=this.data.length;n+=2){let o=t.indexOf(this.data[n])*45;o+=t.indexOf(this.data[n+1]),i.put(o,11)}this.data.length%2&&i.put(t.indexOf(this.data[n]),6)},Jt=r,Jt}var Kt,Ts;function Eo(){if(Ts)return Kt;Ts=1;const e=Re();function t(r){this.mode=e.BYTE,typeof r=="string"?this.data=new TextEncoder().encode(r):this.data=new Uint8Array(r)}return t.getBitsLength=function(s){return s*8},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(r){for(let s=0,i=this.data.length;s<i;s++)r.put(this.data[s],8)},Kt=t,Kt}var Zt,Cs;function _o(){if(Cs)return Zt;Cs=1;const e=Re(),t=Ce();function r(s){this.mode=e.KANJI,this.data=s}return r.getBitsLength=function(i){return i*13},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(s){let i;for(i=0;i<this.data.length;i++){let n=t.toSJIS(this.data[i]);if(n>=33088&&n<=40956)n-=33088;else if(n>=57408&&n<=60351)n-=49472;else throw new Error("Invalid SJIS character: "+this.data[i]+`
Make sure your charset is UTF-8`);n=(n>>>8&255)*192+(n&255),s.put(n,13)}},Zt=r,Zt}var er={exports:{}},Rs;function xo(){return Rs||(Rs=1,(function(e){var t={single_source_shortest_paths:function(r,s,i){var n={},o={};o[s]=0;var l=t.PriorityQueue.make();l.push(s,0);for(var u,d,a,f,c,p,h,b,v;!l.empty();){u=l.pop(),d=u.value,f=u.cost,c=r[d]||{};for(a in c)c.hasOwnProperty(a)&&(p=c[a],h=f+p,b=o[a],v=typeof o[a]>"u",(v||b>h)&&(o[a]=h,l.push(a,h),n[a]=d))}if(typeof i<"u"&&typeof o[i]>"u"){var m=["Could not find a path from ",s," to ",i,"."].join("");throw new Error(m)}return n},extract_shortest_path_from_predecessor_list:function(r,s){for(var i=[],n=s;n;)i.push(n),r[n],n=r[n];return i.reverse(),i},find_path:function(r,s,i){var n=t.single_source_shortest_paths(r,s,i);return t.extract_shortest_path_from_predecessor_list(n,i)},PriorityQueue:{make:function(r){var s=t.PriorityQueue,i={},n;r=r||{};for(n in s)s.hasOwnProperty(n)&&(i[n]=s[n]);return i.queue=[],i.sorter=r.sorter||s.default_sorter,i},default_sorter:function(r,s){return r.cost-s.cost},push:function(r,s){var i={value:r,cost:s};this.queue.push(i),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};e.exports=t})(er)),er.exports}var Ns;function So(){return Ns||(Ns=1,(function(e){const t=Re(),r=vo(),s=wo(),i=Eo(),n=_o(),o=sn(),l=Ce(),u=xo();function d(m){return unescape(encodeURIComponent(m)).length}function a(m,y,w){const x=[];let O;for(;(O=m.exec(w))!==null;)x.push({data:O[0],index:O.index,mode:y,length:O[0].length});return x}function f(m){const y=a(o.NUMERIC,t.NUMERIC,m),w=a(o.ALPHANUMERIC,t.ALPHANUMERIC,m);let x,O;return l.isKanjiModeEnabled()?(x=a(o.BYTE,t.BYTE,m),O=a(o.KANJI,t.KANJI,m)):(x=a(o.BYTE_KANJI,t.BYTE,m),O=[]),y.concat(w,x,O).sort(function(g,E){return g.index-E.index}).map(function(g){return{data:g.data,mode:g.mode,length:g.length}})}function c(m,y){switch(y){case t.NUMERIC:return r.getBitsLength(m);case t.ALPHANUMERIC:return s.getBitsLength(m);case t.KANJI:return n.getBitsLength(m);case t.BYTE:return i.getBitsLength(m)}}function p(m){return m.reduce(function(y,w){const x=y.length-1>=0?y[y.length-1]:null;return x&&x.mode===w.mode?(y[y.length-1].data+=w.data,y):(y.push(w),y)},[])}function h(m){const y=[];for(let w=0;w<m.length;w++){const x=m[w];switch(x.mode){case t.NUMERIC:y.push([x,{data:x.data,mode:t.ALPHANUMERIC,length:x.length},{data:x.data,mode:t.BYTE,length:x.length}]);break;case t.ALPHANUMERIC:y.push([x,{data:x.data,mode:t.BYTE,length:x.length}]);break;case t.KANJI:y.push([x,{data:x.data,mode:t.BYTE,length:d(x.data)}]);break;case t.BYTE:y.push([{data:x.data,mode:t.BYTE,length:d(x.data)}])}}return y}function b(m,y){const w={},x={start:{}};let O=["start"];for(let A=0;A<m.length;A++){const g=m[A],E=[];for(let _=0;_<g.length;_++){const T=g[_],C=""+A+_;E.push(C),w[C]={node:T,lastCount:0},x[C]={};for(let I=0;I<O.length;I++){const S=O[I];w[S]&&w[S].node.mode===T.mode?(x[S][C]=c(w[S].lastCount+T.length,T.mode)-c(w[S].lastCount,T.mode),w[S].lastCount+=T.length):(w[S]&&(w[S].lastCount=T.length),x[S][C]=c(T.length,T.mode)+4+t.getCharCountIndicator(T.mode,y))}}O=E}for(let A=0;A<O.length;A++)x[O[A]].end=0;return{map:x,table:w}}function v(m,y){let w;const x=t.getBestModeForData(m);if(w=t.from(y,x),w!==t.BYTE&&w.bit<x.bit)throw new Error('"'+m+'" cannot be encoded with mode '+t.toString(w)+`.
 Suggested mode is: `+t.toString(x));switch(w===t.KANJI&&!l.isKanjiModeEnabled()&&(w=t.BYTE),w){case t.NUMERIC:return new r(m);case t.ALPHANUMERIC:return new s(m);case t.KANJI:return new n(m);case t.BYTE:return new i(m)}}e.fromArray=function(y){return y.reduce(function(w,x){return typeof x=="string"?w.push(v(x,null)):x.data&&w.push(v(x.data,x.mode)),w},[])},e.fromString=function(y,w){const x=f(y,l.isKanjiModeEnabled()),O=h(x),A=b(O,w),g=u.find_path(A.map,"start","end"),E=[];for(let _=1;_<g.length-1;_++)E.push(A.table[g[_]].node);return e.fromArray(p(E))},e.rawSplit=function(y){return e.fromArray(f(y,l.isKanjiModeEnabled()))}})(Yt)),Yt}var Is;function Ao(){if(Is)return jt;Is=1;const e=Ce(),t=Vr(),r=lo(),s=co(),i=uo(),n=fo(),o=po(),l=tn(),u=go(),d=bo(),a=yo(),f=Re(),c=So();function p(A,g){const E=A.size,_=n.getPositions(g);for(let T=0;T<_.length;T++){const C=_[T][0],I=_[T][1];for(let S=-1;S<=7;S++)if(!(C+S<=-1||E<=C+S))for(let P=-1;P<=7;P++)I+P<=-1||E<=I+P||(S>=0&&S<=6&&(P===0||P===6)||P>=0&&P<=6&&(S===0||S===6)||S>=2&&S<=4&&P>=2&&P<=4?A.set(C+S,I+P,!0,!0):A.set(C+S,I+P,!1,!0))}}function h(A){const g=A.size;for(let E=8;E<g-8;E++){const _=E%2===0;A.set(E,6,_,!0),A.set(6,E,_,!0)}}function b(A,g){const E=i.getPositions(g);for(let _=0;_<E.length;_++){const T=E[_][0],C=E[_][1];for(let I=-2;I<=2;I++)for(let S=-2;S<=2;S++)I===-2||I===2||S===-2||S===2||I===0&&S===0?A.set(T+I,C+S,!0,!0):A.set(T+I,C+S,!1,!0)}}function v(A,g){const E=A.size,_=d.getEncodedBits(g);let T,C,I;for(let S=0;S<18;S++)T=Math.floor(S/3),C=S%3+E-8-3,I=(_>>S&1)===1,A.set(T,C,I,!0),A.set(C,T,I,!0)}function m(A,g,E){const _=A.size,T=a.getEncodedBits(g,E);let C,I;for(C=0;C<15;C++)I=(T>>C&1)===1,C<6?A.set(C,8,I,!0):C<8?A.set(C+1,8,I,!0):A.set(_-15+C,8,I,!0),C<8?A.set(8,_-C-1,I,!0):C<9?A.set(8,15-C-1+1,I,!0):A.set(8,15-C-1,I,!0);A.set(_-8,8,1,!0)}function y(A,g){const E=A.size;let _=-1,T=E-1,C=7,I=0;for(let S=E-1;S>0;S-=2)for(S===6&&S--;;){for(let P=0;P<2;P++)if(!A.isReserved(T,S-P)){let D=!1;I<g.length&&(D=(g[I]>>>C&1)===1),A.set(T,S-P,D),C--,C===-1&&(I++,C=7)}if(T+=_,T<0||E<=T){T-=_,_=-_;break}}}function w(A,g,E){const _=new r;E.forEach(function(P){_.put(P.mode.bit,4),_.put(P.getLength(),f.getCharCountIndicator(P.mode,A)),P.write(_)});const T=e.getSymbolTotalCodewords(A),C=l.getTotalCodewordsCount(A,g),I=(T-C)*8;for(_.getLengthInBits()+4<=I&&_.put(0,4);_.getLengthInBits()%8!==0;)_.putBit(0);const S=(I-_.getLengthInBits())/8;for(let P=0;P<S;P++)_.put(P%2?17:236,8);return x(_,A,g)}function x(A,g,E){const _=e.getSymbolTotalCodewords(g),T=l.getTotalCodewordsCount(g,E),C=_-T,I=l.getBlocksCount(g,E),S=_%I,P=I-S,D=Math.floor(_/I),M=Math.floor(C/I),F=M+1,$=D-M,Tt=new u($);let Ct=0;const lt=new Array(I),Kr=new Array(I);let Rt=0;const gn=new Uint8Array(A.buffer);for(let Ie=0;Ie<I;Ie++){const It=Ie<P?M:F;lt[Ie]=gn.slice(Ct,Ct+It),Kr[Ie]=Tt.encode(lt[Ie]),Ct+=It,Rt=Math.max(Rt,It)}const Nt=new Uint8Array(_);let Zr=0,oe,ae;for(oe=0;oe<Rt;oe++)for(ae=0;ae<I;ae++)oe<lt[ae].length&&(Nt[Zr++]=lt[ae][oe]);for(oe=0;oe<$;oe++)for(ae=0;ae<I;ae++)Nt[Zr++]=Kr[ae][oe];return Nt}function O(A,g,E,_){let T;if(Array.isArray(A))T=c.fromArray(A);else if(typeof A=="string"){let D=g;if(!D){const M=c.rawSplit(A);D=d.getBestVersionForData(M,E)}T=c.fromString(A,D||40)}else throw new Error("Invalid data");const C=d.getBestVersionForData(T,E);if(!C)throw new Error("The amount of data is too big to be stored in a QR Code");if(!g)g=C;else if(g<C)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+C+`.
`);const I=w(g,E,T),S=e.getSymbolSize(g),P=new s(S);return p(P,g),h(P),b(P,g),m(P,E,0),g>=7&&v(P,g),y(P,I),isNaN(_)&&(_=o.getBestMask(P,m.bind(null,P,E))),o.applyMask(_,P),m(P,E,_),{modules:P,version:g,errorCorrectionLevel:E,maskPattern:_,segments:T}}return jt.create=function(g,E){if(typeof g>"u"||g==="")throw new Error("No input text");let _=t.M,T,C;return typeof E<"u"&&(_=t.from(E.errorCorrectionLevel,t.M),T=d.from(E.version),C=o.from(E.maskPattern),E.toSJISFunc&&e.setToSJISFunction(E.toSJISFunc)),O(g,T,_,C)},jt}var tr={},rr={},Os;function nn(){return Os||(Os=1,(function(e){function t(r){if(typeof r=="number"&&(r=r.toString()),typeof r!="string")throw new Error("Color should be defined as hex string");let s=r.slice().replace("#","").split("");if(s.length<3||s.length===5||s.length>8)throw new Error("Invalid hex color: "+r);(s.length===3||s.length===4)&&(s=Array.prototype.concat.apply([],s.map(function(n){return[n,n]}))),s.length===6&&s.push("F","F");const i=parseInt(s.join(""),16);return{r:i>>24&255,g:i>>16&255,b:i>>8&255,a:i&255,hex:"#"+s.slice(0,6).join("")}}e.getOptions=function(s){s||(s={}),s.color||(s.color={});const i=typeof s.margin>"u"||s.margin===null||s.margin<0?4:s.margin,n=s.width&&s.width>=21?s.width:void 0,o=s.scale||4;return{width:n,scale:n?4:o,margin:i,color:{dark:t(s.color.dark||"#000000ff"),light:t(s.color.light||"#ffffffff")},type:s.type,rendererOpts:s.rendererOpts||{}}},e.getScale=function(s,i){return i.width&&i.width>=s+i.margin*2?i.width/(s+i.margin*2):i.scale},e.getImageWidth=function(s,i){const n=e.getScale(s,i);return Math.floor((s+i.margin*2)*n)},e.qrToImageData=function(s,i,n){const o=i.modules.size,l=i.modules.data,u=e.getScale(o,n),d=Math.floor((o+n.margin*2)*u),a=n.margin*u,f=[n.color.light,n.color.dark];for(let c=0;c<d;c++)for(let p=0;p<d;p++){let h=(c*d+p)*4,b=n.color.light;if(c>=a&&p>=a&&c<d-a&&p<d-a){const v=Math.floor((c-a)/u),m=Math.floor((p-a)/u);b=f[l[v*o+m]?1:0]}s[h++]=b.r,s[h++]=b.g,s[h++]=b.b,s[h]=b.a}}})(rr)),rr}var Ls;function To(){return Ls||(Ls=1,(function(e){const t=nn();function r(i,n,o){i.clearRect(0,0,n.width,n.height),n.style||(n.style={}),n.height=o,n.width=o,n.style.height=o+"px",n.style.width=o+"px"}function s(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(n,o,l){let u=l,d=o;typeof u>"u"&&(!o||!o.getContext)&&(u=o,o=void 0),o||(d=s()),u=t.getOptions(u);const a=t.getImageWidth(n.modules.size,u),f=d.getContext("2d"),c=f.createImageData(a,a);return t.qrToImageData(c.data,n,u),r(f,d,a),f.putImageData(c,0,0),d},e.renderToDataURL=function(n,o,l){let u=l;typeof u>"u"&&(!o||!o.getContext)&&(u=o,o=void 0),u||(u={});const d=e.render(n,o,u),a=u.type||"image/png",f=u.rendererOpts||{};return d.toDataURL(a,f.quality)}})(tr)),tr}var sr={},Ps;function Co(){if(Ps)return sr;Ps=1;const e=nn();function t(i,n){const o=i.a/255,l=n+'="'+i.hex+'"';return o<1?l+" "+n+'-opacity="'+o.toFixed(2).slice(1)+'"':l}function r(i,n,o){let l=i+n;return typeof o<"u"&&(l+=" "+o),l}function s(i,n,o){let l="",u=0,d=!1,a=0;for(let f=0;f<i.length;f++){const c=Math.floor(f%n),p=Math.floor(f/n);!c&&!d&&(d=!0),i[f]?(a++,f>0&&c>0&&i[f-1]||(l+=d?r("M",c+o,.5+p+o):r("m",u,0),u=0,d=!1),c+1<n&&i[f+1]||(l+=r("h",a),a=0)):u++}return l}return sr.render=function(n,o,l){const u=e.getOptions(o),d=n.modules.size,a=n.modules.data,f=d+u.margin*2,c=u.color.light.a?"<path "+t(u.color.light,"fill")+' d="M0 0h'+f+"v"+f+'H0z"/>':"",p="<path "+t(u.color.dark,"stroke")+' d="'+s(a,d,u.margin)+'"/>',h='viewBox="0 0 '+f+" "+f+'"',v='<svg xmlns="http://www.w3.org/2000/svg" '+(u.width?'width="'+u.width+'" height="'+u.width+'" ':"")+h+' shape-rendering="crispEdges">'+c+p+`</svg>
`;return typeof l=="function"&&l(null,v),v},sr}var qs;function Ro(){if(qs)return Le;qs=1;const e=ao(),t=Ao(),r=To(),s=Co();function i(n,o,l,u,d){const a=[].slice.call(arguments,1),f=a.length,c=typeof a[f-1]=="function";if(!c&&!e())throw new Error("Callback required as last argument");if(c){if(f<2)throw new Error("Too few arguments provided");f===2?(d=l,l=o,o=u=void 0):f===3&&(o.getContext&&typeof d>"u"?(d=u,u=void 0):(d=u,u=l,l=o,o=void 0))}else{if(f<1)throw new Error("Too few arguments provided");return f===1?(l=o,o=u=void 0):f===2&&!o.getContext&&(u=l,l=o,o=void 0),new Promise(function(p,h){try{const b=t.create(l,u);p(n(b,o,u))}catch(b){h(b)}})}try{const p=t.create(l,u);d(null,n(p,o,u))}catch(p){d(p)}}return Le.create=t.create,Le.toCanvas=i.bind(null,r.render),Le.toDataURL=i.bind(null,r.renderToDataURL),Le.toString=i.bind(null,function(n,o,l){return s.render(n,l)}),Le}var No=Ro();const Io=en(No),R=new Zi,ir=new Map,nr=new Map,or=new Map,ar=new Map;function L(e){const t=e.env.DATABASE_CCT;if(!t)throw new Error("DATABASE_CCT não configurado nas variáveis de ambiente");return new $e(t)}function Qr(e){const t=e.env.DATABASE_URL_CREDITOS||e.env.DATABASE_SUITEPLUS;if(!t)throw new Error("DATABASE_URL_CREDITOS não configurado");return new $e(t)}async function Xr(e){const t=e.connectionString||"credits";ir.has(t)||ir.set(t,(async()=>{await e.sql(`
        CREATE TABLE IF NOT EXISTS users_credits (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL UNIQUE,
          credits_balance INTEGER NOT NULL DEFAULT 0,
          total_credits_used INTEGER NOT NULL DEFAULT 0,
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
      `),await e.sql("CREATE INDEX IF NOT EXISTS idx_users_credits_email ON users_credits(lower(user_email))")})()),await ir.get(t)}async function Hr(e,t){await Xr(e);const r=await e.sql("SELECT credits_balance FROM users_credits WHERE lower(user_email) = lower($1)",[t]);return r.length>0?parseInt(r[0].credits_balance):0}async function Oo(e,t,r){return await Xr(e),(await e.sql(`UPDATE users_credits
     SET credits_balance = credits_balance - $1,
         total_credits_used = COALESCE(total_credits_used, 0) + $1,
         updated_at = NOW()
     WHERE lower(user_email) = lower($2)
       AND credits_balance >= $1
     RETURNING credits_balance`,[r,t])).length>0}async function Et(e){const t=e.connectionString||"lesson-rentals";nr.has(t)||nr.set(t,(async()=>{await e.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS rentable BOOLEAN DEFAULT FALSE"),await e.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS rental_credits INTEGER DEFAULT 0"),await e.sql(`
        CREATE TABLE IF NOT EXISTS lesson_rentals (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          lesson_id INTEGER NOT NULL,
          credits_paid INTEGER NOT NULL,
          rented_at TIMESTAMPTZ DEFAULT NOW(),
          expires_at TIMESTAMPTZ NOT NULL,
          UNIQUE(user_email, lesson_id)
        )
      `),await e.sql("CREATE INDEX IF NOT EXISTS idx_lesson_rentals_email ON lesson_rentals(user_email)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_lesson_rentals_lesson ON lesson_rentals(lesson_id)")})()),await nr.get(t)}async function _t(e){const t=e.connectionString||"comments-replies";or.has(t)||or.set(t,(async()=>{await e.sql("ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_reply TEXT"),await e.sql("ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_replied_at TIMESTAMPTZ"),await e.sql("ALTER TABLE comments ADD COLUMN IF NOT EXISTS admin_replied_by TEXT"),await e.sql("CREATE INDEX IF NOT EXISTS idx_comments_admin_replied_at ON comments(admin_replied_at)")})()),await or.get(t)}async function ne(e){const t=e.connectionString||"question-bank";ar.has(t)||ar.set(t,(async()=>{await e.sql(`
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
      `),await e.sql("CREATE INDEX IF NOT EXISTS idx_question_bank_status ON question_bank(status)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_question_bank_type ON question_bank(question_type)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_question_bank_theme ON question_bank(theme)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_question_bank_course ON question_bank(course_id)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_question_versions_question ON question_bank_versions(question_id)")})()),await ar.get(t)}async function xt(e,t){try{const s=await new $e(t).sql(`SELECT expires_at FROM user_subscriptions
       WHERE lower(user_email) = lower($1) AND product_id = 4 AND status = 'active'
       ORDER BY expires_at DESC LIMIT 1`,[e]);return s.length>0&&s[0].expires_at?new Date(s[0].expires_at):null}catch(r){return console.error("⚠️ Suiteplus subscription check failed:",r.message),null}}R.use("/api/*",eo());R.get("/health",e=>{const t=!!e.env.SUPABASE_URL,r=!!e.env.SUPABASE_ANON_KEY;return e.json({status:"ok",timestamp:new Date().toISOString(),environment:{supabase_url:t?"✅ Configured":"❌ Missing",supabase_key:r?"✅ Configured":"❌ Missing"}})});async function K(e,t,r){try{if(e.startsWith("IMPERSONATE:")){const i=JSON.parse(Buffer.from(e.replace("IMPERSONATE:",""),"base64").toString("utf-8")),n=Buffer.from(`${i.email}:${r}`).toString("base64");return i.signature!==n?(console.error("❌ Invalid impersonation token signature"),null):Date.now()-new Date(i.impersonated_at).getTime()>1440*60*1e3?(console.error("❌ Impersonation token expired"),null):(console.log(`🎭 Using impersonation token for ${i.email}`),{email:i.email,user_metadata:{name:i.nome},id:i.user_id,impersonated:!0})}const s=await fetch(`${t}/auth/v1/user`,{headers:{Authorization:`Bearer ${e}`,apikey:r}});return s.ok?await s.json():null}catch(s){return console.error("Token verification error:",s),null}}async function G(e,t){const r=V(e,"sb-access-token");if(!r)return e.json({error:"Unauthorized"},401);const s=await K(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!s)return e.json({error:"Invalid token"},401);e.set("user",s),await t()}R.get("/api/user/credits",G,async e=>{try{const t=e.get("user");if(!(e.env.DATABASE_URL_CREDITOS||e.env.DATABASE_SUITEPLUS))return console.warn("Credits DB not configured — returning 0"),e.json({success:!0,credits:0,unavailable:!0});const s=Qr(e),i=await Hr(s,t.email);return e.json({success:!0,credits:i})}catch(t){return console.error("Get credits error:",t),e.json({success:!0,credits:0,unavailable:!0})}});R.post("/api/auth/login",async e=>{try{const t=await e.req.json(),{email:r,password:s}=t;if(console.log("🔐 Login attempt:",{email:r,hasPassword:!!s}),console.log("🌐 Supabase URL:",e.env.SUPABASE_URL),console.log("🔑 Supabase Key present:",!!e.env.SUPABASE_ANON_KEY),!r||!s)return console.error("❌ Missing email or password"),e.json({error:"Email e senha são obrigatórios"},400);const i=await fetch(`${e.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:r,password:s})}),n=await i.json();return console.log("📨 Supabase response:",{status:i.status,ok:i.ok}),i.ok?(console.log("✅ Login successful for:",r),J(e,"sb-access-token",n.access_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),J(e,"sb-refresh-token",n.refresh_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0,user:n.user})):(console.error("❌ Login failed:",n),e.json({error:n.error_description||n.message||"Login failed"},400))}catch{return e.json({error:"Login failed"},500)}});R.post("/api/auth/register",async e=>{try{const{email:t,password:r,name:s}=await e.req.json();if(!t||!r||!s)return e.json({error:"Nome, email e senha são obrigatórios"},400);const i=await fetch(`${e.env.SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:t,password:r,data:{name:s}})}),n=await i.json();if(!i.ok){const o=n.error_description||n.message||n.msg||n.error||"Registration failed";return console.error("❌ Supabase signup failed:",{status:i.status,error:o,raw:n}),e.json({error:o},i.status)}try{await L(e).insert("users",{email:t,nome:s,ativo:!0,teste_gratis:!1}),console.log("✅ User record created in users table:",t)}catch(o){console.error("❌ Failed to create user record:",o)}return e.json({success:!0,message:"Registration successful. Please check your email to confirm.",user:n.user})}catch{return e.json({error:"Registration failed"},500)}});R.post("/api/auth/logout",async e=>(et(e,"sb-access-token"),et(e,"sb-refresh-token"),e.json({success:!0})));R.get("/api/auth/me",async e=>{var s;const t=V(e,"sb-access-token");if(!t)return e.json({user:null});try{if((s=JSON.parse(atob(t.split(".")[1])).amr)==null?void 0:s.some(o=>o.method==="otp"))return et(e,"sb-access-token"),et(e,"sb-refresh-token"),e.json({user:null,error:"password_reset_required",message:"Por favor, redefina sua senha antes de fazer login"},401)}catch{}const r=await K(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);return e.json({user:r})});R.get("/api/user/profile",async e=>{var t;try{const r=V(e,"sb-access-token");if(!r)return e.json({error:"Não autenticado"},401);const s=await K(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!s)return e.json({error:"Usuário não encontrado"},404);const i=L(e),n=await i.query("users",{select:"*",filters:{email:s.email},single:!0});if(!n){await i.insert("users",{email:s.email,nome:((t=s.user_metadata)==null?void 0:t.name)||"",ativo:!0,teste_gratis:!1});const o=await i.query("users",{select:"*",filters:{email:s.email},single:!0});return e.json({profile:o})}return e.json({profile:n})}catch(r){return console.error("Error fetching user profile:",r),e.json({error:"Erro ao buscar perfil"},500)}});R.put("/api/user/profile",async e=>{try{const t=V(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const r=await K(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({error:"Usuário não encontrado"},404);const{nome:s,first_name:i,last_name:n,cpf:o,telefone:l,whatsapp:u,end_cep:d,end_logradouro:a,end_numero:f,end_cidade:c,end_estado:p}=await e.req.json();return await L(e).update("users",{email:r.email},{nome:s||null,first_name:i||null,last_name:n||null,cpf:o||null,telefone:l||null,whatsapp:u||null,end_cep:d||null,end_logradouro:a||null,end_numero:f||null,end_cidade:c||null,end_estado:p||null,updated_at:new Date().toISOString()}),s&&await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({data:{name:s.trim()}})}),e.json({success:!0,message:"Perfil atualizado com sucesso!"})}catch(t){return console.error("Error updating user profile:",t),e.json({error:"Erro ao atualizar perfil"},500)}});R.put("/api/auth/profile",async e=>{try{const t=V(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const{name:r}=await e.req.json();if(console.log("👤 Profile update attempt"),console.log("   Name:",r),!r||r.trim().length===0)return console.error("❌ Missing name"),e.json({error:"Nome é obrigatório"},400);const s=await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({data:{name:r.trim()}})});if(console.log("📨 Supabase response:",{status:s.status,ok:s.ok}),!s.ok){const n=await s.json();return console.error("❌ Profile update failed:",n),e.json({error:n.error_description||n.message||"Falha ao atualizar perfil"},400)}const i=await s.json();return console.log("✅ Profile updated successfully"),e.json({success:!0,user:i,message:"Perfil atualizado com sucesso!"})}catch(t){return console.error("💥 Profile update error:",t),e.json({error:"Erro ao atualizar perfil"},500)}});R.post("/api/auth/change-password",async e=>{try{const t=V(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const{currentPassword:r,newPassword:s}=await e.req.json();if(console.log("🔐 Password change attempt"),console.log("   Has current password:",!!r),console.log("   New password length:",s==null?void 0:s.length),!r||!s)return console.error("❌ Missing passwords"),e.json({error:"Senha atual e nova senha são obrigatórias"},400);if(s.length<6)return console.error("❌ Password too short"),e.json({error:"A nova senha deve ter pelo menos 6 caracteres"},400);const i=await K(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!i||!i.email)return e.json({error:"Usuário não encontrado"},401);if(!(await fetch(`${e.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:i.email,password:r})})).ok)return console.error("❌ Current password is incorrect"),e.json({error:"Senha atual incorreta"},400);console.log("✅ Current password verified");const o=await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({password:s})});if(console.log("📨 Supabase response:",{status:o.status,ok:o.ok}),!o.ok){const u=await o.json();console.error("❌ Password change failed:",u);let d="Falha ao alterar senha";return u.error_code==="same_password"?d="A nova senha deve ser diferente da senha atual":u.msg?d=u.msg:u.error_description&&(d=u.error_description),e.json({error:d},400)}const l=await o.json();return console.log("✅ Password changed successfully"),l.access_token&&J(e,"sb-access-token",l.access_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),l.refresh_token&&J(e,"sb-refresh-token",l.refresh_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0,message:"Senha alterada com sucesso!"})}catch(t){return console.error("💥 Password change error:",t),e.json({error:"Erro ao alterar senha"},500)}});R.get("/api/user/access-status",G,async e=>{var t;try{const s=e.get("user").email;if(!s)return e.json({error:"Email do usuário não encontrado"},400);const i=L(e);let n="SEM_ACESSO";try{const a=await i.rpc("user_tipo_acesso",{email_usuario:s});console.log("🔍 Access type result for",s,":",a),typeof a=="string"?n=a:Array.isArray(a)&&a.length>0?n=a[0].user_tipo_acesso||a[0]:a&&typeof a=="object"&&(n=a.user_tipo_acesso)}catch(a){console.log("⚠️ user_tipo_acesso RPC error, will fallback to member_subscriptions:",a==null?void 0:a.message)}console.log("🔍 RPC accessType:",n);let o=null,l=null;const u=await i.sql(`SELECT data_expiracao, COALESCE(teste_gratis, false) AS teste_gratis, detalhe
       FROM member_subscriptions
       WHERE lower(email_membro) = lower($1)
         AND data_expiracao > NOW()
         AND COALESCE(ativo, true) = true
       ORDER BY COALESCE(teste_gratis, false) ASC, data_expiracao DESC
       LIMIT 1`,[s]);if(u.length>0){const a=u[0];o=a.data_expiracao,l=a.detalhe,n=a.teste_gratis?"TESTE_GRATIS":"COMPLETO"}const d=e.env.DATABASE_SUITEPLUS;if(d){const a=await xt(s,d);a&&a>new Date&&(n="COMPLETO",(!o||a>new Date(o))&&(o=a.toISOString()))}return console.log("✅ Final accessType for",s,":",n),e.json({email:s,accessType:n,hasActiveSubscription:n!=="SEM_ACESSO",hasFullAccess:n==="COMPLETO",expirationDate:o,subscriptionDetail:l})}catch(r){return console.error("Error loading access status:",(r==null?void 0:r.message)||r),e.json({email:((t=e.get("user"))==null?void 0:t.email)||"",accessType:"SEM_ACESSO",hasActiveSubscription:!1,hasFullAccess:!1,expirationDate:null,subscriptionDetail:null},200)}});R.get("/api/user/subscriptions",G,async e=>{try{const r=e.get("user").email;if(!r)return e.json({error:"Email do usuário não encontrado"},400);const i=await L(e).query("member_subscriptions",{select:"*",filters:{email_membro:r},order:"data_expiracao.desc"}),n=e.env.DATABASE_SUITEPLUS;if(n&&i&&i.length>0){const o=await xt(r,n);if(o)for(const l of i){const u=new Date(l.data_expiracao);o>u&&(l.data_expiracao=o.toISOString())}}return e.json({subscriptions:i||[],total:(i==null?void 0:i.length)||0})}catch(t){return console.error("Error loading subscriptions:",t),e.json({error:t.message||"Erro ao carregar assinaturas"},500)}});R.get("/auth/callback*",async e=>{var r;const t=e.req.path;if(t.includes("%20")||t.includes(" ")){const s=t.split(/(%20| )/)[0],i=e.req.url.split("#")[1],n=(r=e.req.url.split("?")[1])==null?void 0:r.split("#")[0];let o=s;return n&&(o+="?"+n),i&&(o+="#"+i),e.redirect(o)}return await Lo(e)});async function Lo(e){var o,l,u,d,a,f;const t=new URL(e.req.url),r=t.searchParams.get("error_code")||((o=t.hash.match(/error_code=([^&]+)/))==null?void 0:o[1]);if(t.searchParams.get("error_description")||((l=t.hash.match(/error_description=([^&]+)/))==null||l[1]),r)return r==="otp_expired"?e.html(`
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
      `):e.redirect(`/?error=${r}`);const s=t.searchParams.get("access_token")||((u=t.hash.match(/access_token=([^&]+)/))==null?void 0:u[1]),i=t.searchParams.get("refresh_token")||((d=t.hash.match(/refresh_token=([^&]+)/))==null?void 0:d[1]),n=t.searchParams.get("type")||((a=t.hash.match(/type=([^&]+)/))==null?void 0:a[1]);if(!s)return e.redirect("/?error=no_token");try{const p=(f=JSON.parse(atob(s.split(".")[1])).amr)==null?void 0:f.some(h=>h.method==="otp");if(n==="recovery"||p)return e.redirect(`/reset-password#access_token=${s}&refresh_token=${i||""}&type=recovery`)}catch{if(n==="recovery")return e.redirect(`/reset-password#access_token=${s}&refresh_token=${i||""}&type=recovery`)}return J(e,"sb-access-token",s,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),i&&J(e,"sb-refresh-token",i,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.redirect("/?auth=success")}R.post("/api/auth/callback",async e=>{try{const{access_token:t,refresh_token:r}=await e.req.json();return t?(J(e,"sb-access-token",t,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),r&&J(e,"sb-refresh-token",r,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0})):e.json({error:"No access token"},400)}catch{return e.json({error:"Callback failed"},500)}});R.post("/api/auth/forgot-password",async e=>{try{const{email:t}=await e.req.json();if(!t)return e.json({error:"Email is required"},400);const r=e.req.header("host")||"localhost:3000",i=`${r.includes("localhost")?"http":"https"}://${r}/auth/callback`,n=await fetch(`${e.env.SUPABASE_URL}/auth/v1/recover`,{method:"POST",headers:{"Content-Type":"application/json",apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({email:t,options:{redirectTo:i}})});if(n.ok)return e.json({success:!0,message:"Se o email estiver cadastrado, você receberá um link de recuperação. O link é válido por 1 hora."});const o=await n.json();return e.json({error:o.error_description||"Failed to send reset email"},400)}catch{return e.json({error:"Failed to process request"},500)}});R.post("/api/auth/reset-password",async e=>{try{const t=await e.req.json(),{token:r,password:s}=t;if(console.log("🔐 Password reset attempt"),console.log("   Token present:",!!r),console.log("   Token length:",r==null?void 0:r.length),console.log("   Password length:",s==null?void 0:s.length),!r||!s)return console.error("❌ Missing token or password"),e.json({error:"Token e senha são obrigatórios"},400);if(s.length<6)return console.error("❌ Password too short"),e.json({error:"A senha deve ter pelo menos 6 caracteres"},400);console.log("📨 Calling Supabase to update password...");const i=await fetch(`${e.env.SUPABASE_URL}/auth/v1/user`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`,apikey:e.env.SUPABASE_ANON_KEY},body:JSON.stringify({password:s})});if(console.log("📨 Supabase response:",{status:i.status,ok:i.ok}),!i.ok){const o=await i.json();console.error("❌ Password reset failed:",o);let l="Falha ao redefinir senha";return o.error_code==="same_password"?l="A nova senha deve ser diferente da senha atual":o.msg?l=o.msg:o.error_description?l=o.error_description:o.message&&(l=o.message),e.json({error:l},400)}const n=await i.json();return console.log("✅ Password reset successful"),n.access_token&&J(e,"sb-access-token",n.access_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),n.refresh_token&&J(e,"sb-refresh-token",n.refresh_token,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:604800}),e.json({success:!0,message:"Senha alterada com sucesso!"})}catch{return e.json({error:"Failed to reset password"},500)}});async function Yr(e,t,r,s){try{return await new no(t,r).query("users",{select:"id, email, isadmin",filters:{email:e,isadmin:!0},single:!0},s)!==null}catch(i){return console.error("Error checking admin access in Supabase users:",i),!1}}async function q(e,t){const r=V(e,"sb-access-token");if(!r)return e.json({error:"Unauthorized"},401);const s=await K(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!s)return e.json({error:"Invalid token"},401);if(!await Yr(s.email,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY,r))return e.json({error:"Forbidden - Admin only"},403);e.set("user",s),await t()}R.get("/api/admin/check",async e=>{const t=V(e,"sb-access-token");if(!t)return e.json({isAdmin:!1});const r=await K(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({isAdmin:!1});const s=await Yr(r.email,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY,t);return e.json({isAdmin:s})});R.post("/api/admin/impersonate",q,async e=>{try{const{user_email:t}=await e.req.json();if(!t)return e.json({error:"user_email is required"},400);console.log(`🎭 Admin impersonating user: ${t}`);const r=L(e);let s=await r.sql("SELECT id, email, nome FROM users WHERE lower(email) = lower($1) LIMIT 1",[t]);if((!s||s.length===0)&&(s=await r.sql(`SELECT NULL::integer AS id, email_membro AS email, NULL::text AS nome
         FROM member_subscriptions
         WHERE lower(email_membro) = lower($1)
         ORDER BY data_expiracao DESC NULLS LAST
         LIMIT 1`,[t])),!s||s.length===0)return e.json({error:"User not found"},404);const i=s[0],n={email:t,nome:i.nome||"Usuário",impersonated:!0,impersonated_at:new Date().toISOString(),user_id:i.id,signature:Buffer.from(`${t}:${e.env.SUPABASE_ANON_KEY}`).toString("base64")},o=`IMPERSONATE:${Buffer.from(JSON.stringify(n)).toString("base64")}`,l=V(e,"sb-access-token");return l&&J(e,"sb-admin-backup-token",l,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:86400}),J(e,"sb-access-token",o,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:86400}),console.log(`✅ Impersonation session set for ${t}`),e.json({success:!0,user_email:t,user_name:i.nome})}catch(t){return console.error("Impersonation error:",t),e.json({error:t.message||"Failed to impersonate user"},500)}});R.post("/api/admin/exit-impersonation",async e=>{try{const t=V(e,"sb-admin-backup-token");return t?(J(e,"sb-access-token",t,{httpOnly:!0,secure:!0,sameSite:"Lax",maxAge:3600}),et(e,"sb-admin-backup-token"),e.json({success:!0})):e.json({error:"No admin session to restore"},400)}catch(t){return console.error("Exit impersonation error:",t),e.json({error:t.message||"Failed to exit impersonation"},500)}});R.post("/api/admin/courses",q,async e=>{try{const{title:t,description:r,duration_hours:s,instructor:i,offers_certificate:n,is_published:o,min_completion_days:l}=await e.req.json(),d=await L(e).insert("courses",{title:t,description:r||null,duration_hours:s||0,instructor:i||"Vicelmo",offers_certificate:n!==void 0?n:!0,is_published:o!==void 0?o:!0,min_completion_days:l||null});return e.json({success:!0,course_id:d[0].id})}catch(t){return console.error("Create course error:",t),e.json({error:t.message||"Failed to create course"},500)}});R.put("/api/admin/courses/:id",q,async e=>{try{const t=e.req.param("id"),{title:r,description:s,duration_hours:i,instructor:n,offers_certificate:o,is_published:l,min_completion_days:u}=await e.req.json();return await L(e).update("courses",{id:t},{title:r,description:s||null,duration_hours:i||0,instructor:n||"Vicelmo",offers_certificate:o!==void 0?o:!0,is_published:l!==void 0?l:!0,min_completion_days:u||null}),e.json({success:!0})}catch{return e.json({error:"Failed to update course"},500)}});R.delete("/api/admin/courses/:id",q,async e=>{try{const t=e.req.param("id");return await L(e).delete("courses",{id:t}),e.json({success:!0})}catch{return e.json({error:"Failed to delete course"},500)}});R.get("/api/admin/courses/find",q,async e=>{try{const t=e.req.query("title");if(!t)return e.json({error:"Title is required"},400);const r=L(e),s=await r.sql("SELECT * FROM courses WHERE lower(title) = lower($1) LIMIT 1",[t]);if(s&&s.length>0)return e.json({course:s[0]});const i=await r.sql("SELECT * FROM courses WHERE lower(title) ILIKE lower($1) LIMIT 1",[`%${t}%`]);return e.json({course:i&&i.length>0?i[0]:null})}catch(t){return console.error("Find course error:",t),e.json({error:t.message||"Failed to find course"},500)}});R.post("/api/admin/modules",q,async e=>{try{const{course_id:t,title:r,description:s,order_index:i}=await e.req.json(),o=await L(e).insert("modules",{course_id:t,title:r,description:s||null,order_index:i||0});return e.json({success:!0,module_id:o[0].id})}catch(t){return console.error("Create module error:",t),e.json({error:t.message||"Failed to create module"},500)}});R.post("/api/admin/modules-reorder",q,async e=>{try{const{modules:t}=await e.req.json();if(!Array.isArray(t))return e.json({error:"modules must be an array"},400);const r=L(e);for(const{id:s,order_index:i}of t)await r.update("modules",{id:Number(s)},{order_index:Number(i)});return e.json({success:!0})}catch(t){return console.error("Reorder modules error:",t),e.json({error:t.message||"Failed to reorder modules"},500)}});R.put("/api/admin/modules/:id",q,async e=>{try{const t=e.req.param("id"),{title:r,description:s,order_index:i}=await e.req.json();return await L(e).update("modules",{id:t},{title:r,description:s||null,order_index:i}),e.json({success:!0})}catch{return e.json({error:"Failed to update module"},500)}});R.delete("/api/admin/modules/:id",q,async e=>{try{const t=e.req.param("id");return await L(e).delete("modules",{id:t}),e.json({success:!0})}catch{return e.json({error:"Failed to delete module"},500)}});R.get("/api/admin/modules/find",q,async e=>{try{const t=e.req.query("course_id"),r=e.req.query("title");if(!t||!r)return e.json({error:"course_id and title are required"},400);const i=await L(e).query("modules",{select:"*",filters:{course_id:t,title:r},limit:1});return i&&i.length>0?e.json({module:i[0]}):e.json({module:null})}catch(t){return console.error("Find module error:",t),e.json({error:t.message||"Failed to find module"},500)}});R.post("/api/admin/lessons",q,async e=>{try{const{module_id:t,title:r,description:s,video_provider:i,video_id:n,duration_minutes:o,order_index:l,free_trial:u,support_text:d,transcript:a,attachments:f,rentable:c,rental_credits:p}=await e.req.json();let h=null;i&&n&&(i==="youtube"?h=`https://www.youtube.com/watch?v=${n}`:i==="vimeo"?h=`https://vimeo.com/${n}`:h=n);const v=await L(e).insert("lessons",{module_id:t,title:r,description:s||null,video_url:h,video_provider:i||null,video_id:n||null,duration_minutes:o||0,order_index:l||0,teste_gratis:u||!1,support_text:d||null,transcript:a||null,attachments:JSON.stringify(f||[]),rentable:c||!1,rental_credits:p||0});return e.json({success:!0,lesson_id:v[0].id})}catch(t){return console.error("Create lesson error:",t),e.json({error:t.message||"Failed to create lesson"},500)}});R.post("/api/admin/lessons-reorder",q,async e=>{try{const{lessons:t}=await e.req.json();if(!Array.isArray(t))return e.json({error:"lessons must be an array"},400);const r=L(e);for(const{id:s,order_index:i}of t)await r.update("lessons",{id:Number(s)},{order_index:Number(i)});return e.json({success:!0})}catch(t){return console.error("Reorder lessons error:",t),e.json({error:t.message||"Failed to reorder lessons"},500)}});R.put("/api/admin/lessons/:id",q,async e=>{try{const t=e.req.param("id"),{title:r,description:s,video_provider:i,video_id:n,duration_minutes:o,order_index:l,free_trial:u,support_text:d,transcript:a,attachments:f,rentable:c,rental_credits:p}=await e.req.json();let h=null;i&&n&&(i==="youtube"?h=`https://www.youtube.com/watch?v=${n}`:i==="vimeo"?h=`https://vimeo.com/${n}`:h=n);const b=L(e),v=parseInt(t);await b.update("lessons",{id:v},{title:r,description:s||null,video_url:h,video_provider:i||null,video_id:n||null,duration_minutes:parseInt(o)||0,order_index:parseInt(l)||0,teste_gratis:u===!0||u==="true"});try{await b.sql("UPDATE lessons SET support_text = $1, transcript = $2, attachments = $3::jsonb WHERE id = $4",[d||null,a||null,JSON.stringify(f||[]),v])}catch(m){console.warn("support_text/transcript/attachments columns may not exist:",m.message)}return await b.sql("UPDATE lessons SET rentable = $1, rental_credits = $2 WHERE id = $3",[c===!0||c==="true",parseInt(p)||0,v]),e.json({success:!0})}catch(t){return console.error("Update lesson error:",t),e.json({error:t.message||"Failed to update lesson"},500)}});R.post("/api/admin/lessons/:id/generate-transcript",q,async e=>{var t,r,s;try{const i=parseInt(e.req.param("id")),{context:n}=await e.req.json(),l=await L(e).sql("SELECT title, transcript FROM lessons WHERE id = $1",[i]);if(!l.length)return e.json({error:"Aula não encontrada"},404);const u=l[0];if(!u.transcript)return e.json({error:"Esta aula não possui transcrição para estruturar."},400);const d=e.env.VITE_OPENROUTER_API_KEY;if(!d)return e.json({error:"VITE_OPENROUTER_API_KEY não configurada no ambiente"},500);const a="Você é um especialista em direito trabalhista, liquidação de sentença judicial e uso do software PJe-Calc. Sua tarefa é pegar transcrições brutas de aulas e organizá-las em Markdown estruturado, claro e didático.",f=`Abaixo está a transcrição bruta de uma aula chamada "${u.title}".${n?`

Instruções adicionais: ${n}`:""}

Organize essa transcrição em Markdown estruturado, sem inventar conteúdo. Apenas reorganize, agrupe por tópicos e formate o que já está no texto:
- Título principal com #
- Tópicos e subtópicos com ## e ###
- Conceitos importantes em **negrito**
- > Blockquote para trechos de destaque ou alertas
- Listas com - quando houver enumerações
- Um **Resumo** ao final com os pontos principais

Transcrição bruta:
---
${u.transcript}
---`,c=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`,"HTTP-Referer":"https://cct2026.com.br","X-Title":"CCT2026 Admin"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"system",content:a},{role:"user",content:f}]})});if(!c.ok){const b=await c.text();return e.json({error:`Erro na API OpenRouter: ${b}`},500)}const h=((s=(r=(t=(await c.json()).choices)==null?void 0:t[0])==null?void 0:r.message)==null?void 0:s.content)||"";return e.json({transcript:h})}catch(i){return console.error("Generate transcript error:",i),e.json({error:i.message||"Erro ao gerar transcrição"},500)}});R.post("/api/admin/structure-transcript",q,async e=>{var t,r,s;try{const{title:i,transcript:n,context:o}=await e.req.json();if(!(n!=null&&n.trim()))return e.json({error:"Transcrição vazia"},400);const l=e.env.VITE_OPENROUTER_API_KEY;if(!l)return e.json({error:"VITE_OPENROUTER_API_KEY não configurada"},500);const u="Você é um especialista em direito trabalhista, liquidação de sentença judicial e uso do software PJe-Calc. Sua tarefa é pegar transcrições brutas de aulas e organizá-las em Markdown estruturado, claro e didático.",d=`Abaixo está a transcrição bruta de uma aula${i?` chamada "${i}"`:""}.${o?`

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
${n}
---`,a=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${l}`,"HTTP-Referer":"https://cct2026.com.br","X-Title":"CCT2026 Admin"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"system",content:u},{role:"user",content:d}]})});if(!a.ok)return e.json({error:`OpenRouter: ${await a.text()}`},500);const f=await a.json();return e.json({transcript:((s=(r=(t=f.choices)==null?void 0:t[0])==null?void 0:r.message)==null?void 0:s.content)||""})}catch(i){return e.json({error:i.message},500)}});R.post("/api/admin/vimeo-transcript",q,async e=>{try{const{video_id:t}=await e.req.json();if(!t)return e.json({error:"video_id obrigatório"},400);const r=e.env.VIMEO_ACCESS_TOKEN;if(!r)return e.json({error:"VIMEO_ACCESS_TOKEN não configurada"},500);const s=String(t).replace(/^https?:\/\/(?:www\.)?vimeo\.com\//i,"").replace(/[?#].*$/,"").replace(/\/$/,""),i=await fetch(`https://api.vimeo.com/videos/${s}/texttracks?per_page=100`,{headers:{Authorization:`Bearer ${r}`,Accept:"application/vnd.vimeo.*+json;version=3.4"}});if(!i.ok)return e.json({error:`Vimeo API ${i.status}`},502);const o=(await i.json()).data||[];if(!o.length)return e.json({error:"Nenhuma legenda encontrada para este vídeo"},404);const u=[...o].sort((h,b)=>{const v=m=>{let y=0;return String(m.language||"").toLowerCase().startsWith("pt")&&(y+=40),m.active!==!1&&(y+=20),m.type==="captions"&&(y+=10),y};return v(b)-v(h)}).find(h=>h.link)||null;if(!u)return e.json({error:"Nenhuma legenda com link disponível"},404);const d=await fetch(u.link);if(!d.ok)return e.json({error:`Download da legenda falhou: ${d.status}`},502);const f=(await d.text()).replace(/^﻿/,"").split(/\r?\n/).map(h=>h.trim()),c=[];for(const h of f){if(!h||/^(WEBVTT|Kind:|Language:|NOTE|STYLE|REGION|\d+$)/.test(h)||h.includes("-->"))continue;const b=h.replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").trim();b&&c[c.length-1]!==b&&c.push(b)}const p=c.join(" ").replace(/\s+/g," ").trim();return p?e.json({transcript:p,language:u.language}):e.json({error:"Legenda encontrada mas está vazia"},404)}catch(t){return e.json({error:t.message},500)}});R.post("/api/admin/lessons/:id/whisper-transcribe",q,async e=>{var t,r,s,i;try{const n=parseInt(e.req.param("id")),o=L(e),l=await o.sql("SELECT id, title, video_provider, video_id FROM lessons WHERE id = $1",[n]);if(!l.length)return e.json({error:"Aula não encontrada"},404);const u=l[0];if(u.video_provider!=="vimeo")return e.json({error:"Esta aula não usa Vimeo como provedor"},400);if(!u.video_id||!/^\d+$/.test(u.video_id))return e.json({error:"ID do vídeo Vimeo inválido"},400);const d=((t=globalThis.process)==null?void 0:t.env)||{},a=e.env.VIMEO_ACCESS_TOKEN||d.VIMEO_ACCESS_TOKEN,f=e.env.OPENAI_API_KEY||d.OPENAI_API_KEY||d["OPENAI_API-KEY"],c=e.env.VITE_OPENROUTER_API_KEY||d.VITE_OPENROUTER_API_KEY;if(!a)return e.json({error:"VIMEO_ACCESS_TOKEN não configurado"},500);if(!f){const S=Object.keys(d).filter(P=>P.toLowerCase().includes("openai"));return e.json({error:`OPENAI_API_KEY não configurado. Chaves OPENAI encontradas: [${S.join(", ")}]`},500)}const p=await fetch(`https://api.vimeo.com/videos/${u.video_id}?fields=download`,{headers:{Authorization:`Bearer ${a}`}});if(!p.ok)return e.json({error:`Vimeo API ${p.status}`},502);const b=((await p.json()).download||[]).filter(S=>S.link&&S.size).sort((S,P)=>S.size-P.size);if(!b.length)return e.json({error:"Download não disponível para este vídeo"},400);const v=b[0],m=(v.size/1024/1024).toFixed(1),y=await fetch(v.link);if(!y.ok)return e.json({error:`Download falhou: HTTP ${y.status}`},502);let w=Buffer.from(await y.arrayBuffer()),x="video.mp4";const O=24*1024*1024;if(w.length>O){try{const S=await import("os"),P=await import("path"),D=await import("fs"),M=await import("child_process"),F=P.join(S.tmpdir(),`cct_w_${n}.mp4`),$=P.join(S.tmpdir(),`cct_w_${n}.mp3`);D.writeFileSync(F,w),M.spawnSync("ffmpeg",["-y","-i",F,"-vn","-ar","16000","-ac","1","-b:a","32k",$],{stdio:"pipe"}).status===0&&D.existsSync($)&&(w=D.readFileSync($),x="audio.mp3",D.unlinkSync($)),D.unlinkSync(F)}catch{}if(w.length>O)return e.json({error:`Arquivo muito grande (${m} MB). Use o script de transcrição em lote.`},400)}const A="----WhisperBoundary"+Date.now().toString(16),g=`\r
`,E=x.endsWith(".mp3")?"audio/mpeg":"video/mp4",_=Buffer.concat([Buffer.from(`--${A}${g}Content-Disposition: form-data; name="file"; filename="${x}"${g}Content-Type: ${E}${g}${g}`),w,Buffer.from(`${g}--${A}${g}Content-Disposition: form-data; name="model"${g}${g}whisper-1`),Buffer.from(`${g}--${A}${g}Content-Disposition: form-data; name="language"${g}${g}pt`),Buffer.from(`${g}--${A}${g}Content-Disposition: form-data; name="response_format"${g}${g}text`),Buffer.from(`${g}--${A}--${g}`)]),T=await fetch("https://api.openai.com/v1/audio/transcriptions",{method:"POST",headers:{Authorization:`Bearer ${f}`,"Content-Type":`multipart/form-data; boundary=${A}`,"Content-Length":String(_.length)},body:_});if(!T.ok)return e.json({error:`OpenAI Whisper ${T.status}: ${await T.text()}`},502);let C=(await T.text()).trim(),I=null;if(c&&C){const S=`Você é um assistente especializado em cursos de PJe-Calc (cálculos trabalhistas no sistema judicial brasileiro).

Recebi a transcrição bruta de uma aula chamada "${u.title}". Organize esta transcrição em Markdown estruturado com:
- Um resumo em ## Resumo (3-4 linhas)
- Tópicos principais com ## e subtópicos com ###
- **Negrito** para termos técnicos e ações importantes
- Listas com - para passos ou itens
- > Destaques para avisos, dicas e pontos críticos

Mantenha o idioma português do Brasil. Não adicione conteúdo que não esteja na transcrição.

TRANSCRIÇÃO:
${C}`,P=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${c}`,"Content-Type":"application/json"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"user",content:S}]})});if(P.ok){const M=((i=(s=(r=(await P.json()).choices)==null?void 0:r[0])==null?void 0:s.message)==null?void 0:i.content)||"";if(M){C=M;const F=M.match(/##\s*Resumo\s*\n([\s\S]*?)(?=\n##\s|\n*$)/);F&&(I=F[1].trim())}}}return await o.sql("UPDATE lessons SET transcript = $1, description = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE description END WHERE id = $3",[C,I,n]),e.json({transcript:C,description:I,sizeMB:m})}catch(n){return e.json({error:n.message},500)}});R.post("/api/admin/lessons/:id/groq-transcribe",q,async e=>{var t,r,s,i;try{const n=parseInt(e.req.param("id")),o=L(e),l=await o.sql("SELECT id, title, video_provider, video_id FROM lessons WHERE id = $1",[n]);if(!l.length)return e.json({error:"Aula não encontrada"},404);const u=l[0];if(u.video_provider!=="vimeo")return e.json({error:"Esta aula não usa Vimeo como provedor"},400);if(!u.video_id||!/^\d+$/.test(u.video_id))return e.json({error:"ID do vídeo Vimeo inválido"},400);const d=((t=globalThis.process)==null?void 0:t.env)||{},a=e.env.VIMEO_ACCESS_TOKEN||d.VIMEO_ACCESS_TOKEN,f=e.env.GROQ_API_KEY||d.GROQ_API_KEY,c=e.env.VITE_OPENROUTER_API_KEY||d.VITE_OPENROUTER_API_KEY;if(!a)return e.json({error:"VIMEO_ACCESS_TOKEN não configurado"},500);if(!f){const S=Object.keys(d).filter(P=>P.toLowerCase().includes("groq"));return e.json({error:`GROQ_API_KEY não configurado. Chaves GROQ encontradas: [${S.join(", ")}]`},500)}const p=await fetch(`https://api.vimeo.com/videos/${u.video_id}?fields=download`,{headers:{Authorization:`Bearer ${a}`}});if(!p.ok)return e.json({error:`Vimeo API ${p.status}`},502);const b=((await p.json()).download||[]).filter(S=>S.link&&S.size).sort((S,P)=>S.size-P.size);if(!b.length)return e.json({error:"Download não disponível para este vídeo"},400);const v=b[0],m=(v.size/1024/1024).toFixed(1),y=await fetch(v.link);if(!y.ok)return e.json({error:`Download falhou: HTTP ${y.status}`},502);let w=Buffer.from(await y.arrayBuffer()),x="video.mp4";const O=24*1024*1024;if(w.length>O){try{const S=await import("os"),P=await import("path"),D=await import("fs"),M=await import("child_process"),F=P.join(S.tmpdir(),`cct_g_${n}.mp4`),$=P.join(S.tmpdir(),`cct_g_${n}.mp3`);D.writeFileSync(F,w),M.spawnSync("ffmpeg",["-y","-i",F,"-vn","-ar","16000","-ac","1","-b:a","32k",$],{stdio:"pipe"}).status===0&&D.existsSync($)&&(w=D.readFileSync($),x="audio.mp3",D.unlinkSync($)),D.unlinkSync(F)}catch{}if(w.length>O)return e.json({error:`Arquivo muito grande (${m} MB). Use o script de transcrição em lote.`},400)}const A="----GroqBoundary"+Date.now().toString(16),g=`\r
`,E=x.endsWith(".mp3")?"audio/mpeg":"video/mp4",_=Buffer.concat([Buffer.from(`--${A}${g}Content-Disposition: form-data; name="file"; filename="${x}"${g}Content-Type: ${E}${g}${g}`),w,Buffer.from(`${g}--${A}${g}Content-Disposition: form-data; name="model"${g}${g}whisper-large-v3-turbo`),Buffer.from(`${g}--${A}${g}Content-Disposition: form-data; name="language"${g}${g}pt`),Buffer.from(`${g}--${A}${g}Content-Disposition: form-data; name="response_format"${g}${g}text`),Buffer.from(`${g}--${A}--${g}`)]),T=await fetch("https://api.groq.com/openai/v1/audio/transcriptions",{method:"POST",headers:{Authorization:`Bearer ${f}`,"Content-Type":`multipart/form-data; boundary=${A}`,"Content-Length":String(_.length)},body:_});if(!T.ok)return e.json({error:`Groq Whisper ${T.status}: ${await T.text()}`},502);let C=(await T.text()).trim(),I=null;if(c&&C){const S=`Você é um assistente especializado em cursos de PJe-Calc (cálculos trabalhistas no sistema judicial brasileiro).

Recebi a transcrição bruta de uma aula chamada "${u.title}". Organize esta transcrição em Markdown estruturado com:
- Um resumo em ## Resumo (3-4 linhas)
- Tópicos principais com ## e subtópicos com ###
- **Negrito** para termos técnicos e ações importantes
- Listas com - para passos ou itens
- > Destaques para avisos, dicas e pontos críticos

Mantenha o idioma português do Brasil. Não adicione conteúdo que não esteja na transcrição.

TRANSCRIÇÃO:
${C}`,P=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${c}`,"Content-Type":"application/json"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"user",content:S}]})});if(P.ok){const M=((i=(s=(r=(await P.json()).choices)==null?void 0:r[0])==null?void 0:s.message)==null?void 0:i.content)||"";if(M){C=M;const F=M.match(/##\s*Resumo\s*\n([\s\S]*?)(?=\n##\s|\n*$)/);F&&(I=F[1].trim())}}}return await o.sql("UPDATE lessons SET transcript = $1, description = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE description END WHERE id = $3",[C,I,n]),e.json({transcript:C,description:I,sizeMB:m})}catch(n){return e.json({error:n.message},500)}});R.delete("/api/admin/lessons/:id",q,async e=>{try{const t=e.req.param("id");return await L(e).delete("lessons",{id:t}),e.json({success:!0})}catch{return e.json({error:"Failed to delete lesson"},500)}});R.post("/api/lessons/:id/rent",G,async e=>{try{const t=parseInt(e.req.param("id")),s=e.get("user").email,i=L(e);await Et(i);const n=await i.sql("SELECT id, title, rentable, rental_credits FROM lessons WHERE id = $1",[t]);if(!n.length||!n[0].rentable)return e.json({error:"Esta aula não está disponível para aluguel"},400);const o=n[0],l=parseInt(o.rental_credits);if(!Number.isFinite(l)||l<=0)return e.json({error:"Créditos de aluguel inválidos para esta aula"},400);const u=await i.sql("SELECT expires_at FROM lesson_rentals WHERE lower(user_email) = lower($1) AND lesson_id = $2 AND expires_at > NOW()",[s,t]);if(u.length>0)return e.json({error:"Você já possui acesso ativo a esta aula",expires_at:u[0].expires_at},400);const d=e.env.DATABASE_URL_CREDITOS||e.env.DATABASE_SUITEPLUS;console.log("Credits DB configured:",!!d,"| prefix:",d==null?void 0:d.substring(0,30));const a=Qr(e),f=await Hr(a,s);if(f<l)return e.json({error:"Créditos insuficientes",available:f,required:l},400);if(!await Oo(a,s,l)){const p=await Hr(a,s);return e.json({error:"Créditos insuficientes",available:p,required:l},400)}return await i.sql(`INSERT INTO lesson_rentals (user_email, lesson_id, credits_paid, rented_at, expires_at)
       VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '30 days')
       ON CONFLICT (user_email, lesson_id)
       DO UPDATE SET credits_paid = $3, rented_at = NOW(), expires_at = NOW() + INTERVAL '30 days'`,[s,t,l]),e.json({success:!0,message:"Aula alugada com sucesso! Acesso liberado por 30 dias."})}catch(t){return console.error("Rent lesson error:",t),e.json({error:t.message||"Erro ao processar aluguel"},500)}});R.get("/api/user/rentals",G,async e=>{try{const t=e.get("user"),r=L(e);await Et(r);const s=await r.sql(`SELECT lr.id, lr.lesson_id, lr.credits_paid, lr.rented_at, lr.expires_at,
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
  `),await e.sql("CREATE INDEX IF NOT EXISTS idx_trail_lessons_trail ON trail_lessons(trail_id)"),await e.sql("CREATE INDEX IF NOT EXISTS idx_trail_lessons_lesson ON trail_lessons(lesson_id)")}R.get("/api/trails",G,async e=>{try{const t=e.get("user"),r=L(e);await Ne(r);const s=await r.sql(`
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
    `,[t.email]);return e.json({trails:s})}catch(t){return console.error("Get trails error:",t),e.json({error:t.message||"Erro ao buscar trilhas"},500)}});R.get("/api/trails/:id",G,async e=>{try{const t=e.req.param("id"),r=e.get("user"),s=L(e);await Ne(s);const i=await s.sql("SELECT * FROM trails WHERE id = $1",[t]);if(!i.length)return e.json({error:"Trilha não encontrada"},404);const n=i[0],o=await s.sql(`
      SELECT tl.order_index, tl.lesson_id,
             l.title, l.description, l.duration_minutes, l.video_provider, l.teste_gratis, l.free_trial, l.rentable, l.rental_credits,
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
    `,[t,r.email]);return e.json({trail:n,lessons:o})}catch(t){return console.error("Get trail error:",t),e.json({error:t.message||"Erro ao buscar trilha"},500)}});R.get("/api/admin/trails",q,async e=>{try{const t=L(e);await Ne(t);const r=await t.sql(`
      SELECT t.*, COUNT(tl.id)::int AS lessons_count
      FROM trails t
      LEFT JOIN trail_lessons tl ON tl.trail_id = t.id
      GROUP BY t.id
      ORDER BY t.order_index ASC, t.created_at DESC
    `);return e.json({trails:r})}catch(t){return e.json({error:t.message},500)}});R.post("/api/admin/trails",q,async e=>{try{const{title:t,description:r,is_published:s,order_index:i}=await e.req.json();if(!t)return e.json({error:"title is required"},400);const n=L(e);await Ne(n);const o=await n.insert("trails",{title:t,description:r||null,is_published:s??!1,order_index:i??0});return e.json({success:!0,trail_id:o[0].id,trail:o[0]})}catch(t){return e.json({error:t.message},500)}});R.put("/api/admin/trails/:id",q,async e=>{try{const t=parseInt(e.req.param("id")),r=await e.req.json(),s=L(e);await Ne(s);const i=["title","description","is_published","order_index"],n={updated_at:new Date().toISOString()};for(const o of i)o in r&&(n[o]=r[o]);return await s.update("trails",{id:t},n),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});R.delete("/api/admin/trails/:id",q,async e=>{try{const t=parseInt(e.req.param("id")),r=L(e);return await Ne(r),await r.delete("trails",{id:t}),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});R.post("/api/admin/trails/:id/lessons",q,async e=>{var t;try{const r=parseInt(e.req.param("id")),{lesson_id:s}=await e.req.json();if(!s)return e.json({error:"lesson_id required"},400);const i=L(e);await Ne(i);const o=(((t=(await i.sql("SELECT COALESCE(MAX(order_index), -1) AS max_idx FROM trail_lessons WHERE trail_id = $1",[r]))[0])==null?void 0:t.max_idx)??-1)+1;return await i.sql("INSERT INTO trail_lessons (trail_id, lesson_id, order_index) VALUES ($1, $2, $3) ON CONFLICT (trail_id, lesson_id) DO NOTHING",[r,s,o]),e.json({success:!0})}catch(r){return e.json({error:r.message},500)}});R.delete("/api/admin/trails/:id/lessons/:lessonId",q,async e=>{try{const t=parseInt(e.req.param("id")),r=parseInt(e.req.param("lessonId"));return await L(e).sql("DELETE FROM trail_lessons WHERE trail_id = $1 AND lesson_id = $2",[t,r]),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});R.post("/api/admin/trails/:id/reorder",q,async e=>{try{const t=parseInt(e.req.param("id")),{lessons:r}=await e.req.json();if(!Array.isArray(r))return e.json({error:"lessons array required"},400);const s=L(e);for(const i of r)await s.sql("UPDATE trail_lessons SET order_index = $1 WHERE trail_id = $2 AND lesson_id = $3",[i.order_index,t,i.lesson_id]);return e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});R.get("/api/admin/trails/search-lessons",q,async e=>{try{const t=e.req.query("q")||"",r=e.req.query("course_id"),s=L(e),i=r?`AND co.id = ${parseInt(r)}`:"",n=t?"AND (l.title ILIKE $1)":"",o=t?[`%${t}%`]:[],l=await s.sql(`
      SELECT l.id, l.title, l.duration_minutes, l.teste_gratis, l.rentable, l.rental_credits,
             m.title AS module_title,
             co.id AS course_id, co.title AS course_title
      FROM lessons l
      JOIN modules m ON m.id = l.module_id
      JOIN courses co ON co.id = m.course_id
      WHERE 1=1 ${i} ${n}
      ORDER BY co.title ASC, m.order_index ASC, l.order_index ASC
      LIMIT 50
    `,o);return e.json({lessons:l})}catch(t){return e.json({error:t.message},500)}});R.get("/api/admin/lessons/find",q,async e=>{try{const t=e.req.query("module_id"),r=e.req.query("title");if(!t||!r)return e.json({error:"module_id and title are required"},400);const i=await L(e).query("lessons",{select:"*",filters:{module_id:t,title:r},limit:1});return i&&i.length>0?e.json({lesson:i[0]}):e.json({lesson:null})}catch(t){return console.error("Find lesson error:",t),e.json({error:t.message||"Failed to find lesson"},500)}});function Gr(e,t){const r=Array.isArray(e.alternatives)?e.alternatives:[],s=Array.isArray(e.tags)?e.tags:String(e.tags||"").split(",").map(i=>i.trim()).filter(Boolean);return{title:e.title||null,statement_html:e.statement_html||"",question_type:e.question_type||"multiple_choice",alternatives:JSON.stringify(r),answer_key:JSON.stringify(e.answer_key||{}),technical_comment_html:e.technical_comment_html||null,difficulty:e.difficulty||"medio",theme:e.theme||null,subtheme:e.subtheme||null,legal_basis:e.legal_basis||null,weight:Number(e.weight||1),estimated_minutes:parseInt(e.estimated_minutes)||5,tags:JSON.stringify(s),status:e.status||"draft",professor:e.professor||null,course_id:e.course_id?parseInt(e.course_id):null,lesson_id:e.lesson_id?parseInt(e.lesson_id):null,source_transcript:e.source_transcript||null,ai_generated:e.ai_generated===!0||e.ai_generated==="true",order_index:parseInt(e.order_index)||0,usage_count:parseInt(e.usage_count)||0,attempts_count:parseInt(e.attempts_count)||0,correct_count:parseInt(e.correct_count)||0,wrong_count:parseInt(e.wrong_count)||0,created_by:t||e.created_by||null}}function $r(e){if(typeof e=="string")return e.replace(/\b(conforme|segundo|de acordo com|com base na|a partir da)\s+a\s+transcri[cç][aã]o\b/gi,"").replace(/\bna\s+transcri[cç][aã]o\b/gi,"no material de estudo").replace(/\bda\s+transcri[cç][aã]o\b/gi,"do material de estudo").replace(/\btranscri[cç][aã]o\b/gi,"material de estudo").replace(/\s{2,}/g," ").replace(/\s+([,.;:!?])/g,"$1").trim();if(Array.isArray(e))return e.map($r).filter(t=>!(typeof t=="string"&&/transcri[cç][aã]o/i.test(t)));if(e&&typeof e=="object"){const t={};for(const[r,s]of Object.entries(e))t[r]=$r(s);return t}return e}R.get("/api/admin/questions",q,async e=>{try{const t=L(e);await ne(t);const r=[],s=[];let i=1;const n=(m,y)=>{r.push(m.replace("?",`$${i++}`)),s.push(y)},o=e.req.query("q"),l=e.req.query("theme"),u=e.req.query("professor"),d=e.req.query("course_id"),a=e.req.query("difficulty"),f=e.req.query("question_type"),c=e.req.query("status"),p=e.req.query("from"),h=e.req.query("to");o&&(r.push(`(title ILIKE $${i} OR statement_html ILIKE $${i+1} OR legal_basis ILIKE $${i+2})`),s.push(`%${o}%`,`%${o}%`,`%${o}%`),i+=3),l&&n("theme = ?",l),u&&n("professor = ?",u),d&&n("course_id = ?",parseInt(d)),a&&n("difficulty = ?",a),f&&n("question_type = ?",f),c&&n("status = ?",c),p&&n("created_at >= ?",p),h&&n("created_at <= ?",h);const b=r.length?`WHERE ${r.join(" AND ")}`:"",v=await t.sql(`
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
    `,s);return e.json({questions:v})}catch(t){return console.error("List questions error:",t),e.json({error:t.message||"Failed to list questions"},500)}});R.get("/api/admin/questions/stats",q,async e=>{try{const t=L(e);await ne(t);const r=await t.sql(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'published')::int AS published,
        COUNT(*) FILTER (WHERE ai_generated)::int AS ai_generated,
        COALESCE(SUM(usage_count), 0)::int AS total_usage,
        ROUND(AVG(CASE WHEN attempts_count > 0 THEN correct_count::numeric / attempts_count::numeric * 100 END), 1) AS avg_success_rate
      FROM question_bank
    `),s=await t.sql("SELECT id, title, wrong_count, attempts_count FROM question_bank ORDER BY wrong_count DESC, attempts_count DESC LIMIT 5"),i=await t.sql("SELECT id, title, usage_count FROM question_bank ORDER BY usage_count DESC LIMIT 5");return e.json({stats:r[0]||{},mostWrong:s,mostUsed:i})}catch(t){return e.json({error:t.message},500)}});R.get("/api/admin/questions/:id/versions",q,async e=>{try{const t=L(e);await ne(t);const r=await t.sql("SELECT * FROM question_bank_versions WHERE question_id = $1 ORDER BY version DESC, created_at DESC",[parseInt(e.req.param("id"))]);return e.json({versions:r})}catch(t){return e.json({error:t.message},500)}});R.post("/api/admin/questions",q,async e=>{try{const t=e.get("user"),r=L(e);await ne(r);const s=Gr(await e.req.json(),t==null?void 0:t.email),n=(await r.sql(`
      INSERT INTO question_bank (
        title, statement_html, question_type, alternatives, answer_key, technical_comment_html,
        difficulty, theme, subtheme, legal_basis, weight, estimated_minutes, tags, status,
        professor, course_id, lesson_id, source_transcript, ai_generated, order_index,
        usage_count, attempts_count, correct_count, wrong_count, created_by
      )
      VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25)
      RETURNING *
    `,[s.title,s.statement_html,s.question_type,s.alternatives,s.answer_key,s.technical_comment_html,s.difficulty,s.theme,s.subtheme,s.legal_basis,s.weight,s.estimated_minutes,s.tags,s.status,s.professor,s.course_id,s.lesson_id,s.source_transcript,s.ai_generated,s.order_index,s.usage_count,s.attempts_count,s.correct_count,s.wrong_count,s.created_by]))[0];return await r.sql("INSERT INTO question_bank_versions (question_id, version, snapshot, changed_by, change_note) VALUES ($1, $2, $3::jsonb, $4, $5)",[n.id,1,JSON.stringify(n),(t==null?void 0:t.email)||null,"Criacao"]),e.json({success:!0,question:n})}catch(t){return console.error("Create question error:",t),e.json({error:t.message||"Failed to create question"},500)}});R.put("/api/admin/questions/:id",q,async e=>{try{const t=e.get("user"),r=parseInt(e.req.param("id")),s=L(e);await ne(s);const i=await s.sql("SELECT * FROM question_bank WHERE id = $1",[r]);if(!i.length)return e.json({error:"Question not found"},404);const n=i[0],o=Gr(await e.req.json(),t==null?void 0:t.email),l=parseInt(n.version||1)+1,u=await s.sql(`
      UPDATE question_bank SET
        title=$1, statement_html=$2, question_type=$3, alternatives=$4::jsonb, answer_key=$5::jsonb,
        technical_comment_html=$6, difficulty=$7, theme=$8, subtheme=$9, legal_basis=$10,
        weight=$11, estimated_minutes=$12, tags=$13::jsonb, status=$14, professor=$15,
        course_id=$16, lesson_id=$17, source_transcript=$18, ai_generated=$19, order_index=$20,
        usage_count=$21, attempts_count=$22, correct_count=$23, wrong_count=$24,
        version=$25, updated_at=NOW()
      WHERE id=$26
      RETURNING *
    `,[o.title,o.statement_html,o.question_type,o.alternatives,o.answer_key,o.technical_comment_html,o.difficulty,o.theme,o.subtheme,o.legal_basis,o.weight,o.estimated_minutes,o.tags,o.status,o.professor,o.course_id,o.lesson_id,o.source_transcript,o.ai_generated,o.order_index,o.usage_count,o.attempts_count,o.correct_count,o.wrong_count,l,r]);return await s.sql("INSERT INTO question_bank_versions (question_id, version, snapshot, changed_by, change_note) VALUES ($1, $2, $3::jsonb, $4, $5)",[r,l,JSON.stringify(u[0]),(t==null?void 0:t.email)||null,"Edicao manual"]),e.json({success:!0,question:u[0]})}catch(t){return console.error("Update question error:",t),e.json({error:t.message||"Failed to update question"},500)}});R.post("/api/admin/questions/:id/duplicate",q,async e=>{try{const t=e.get("user"),r=parseInt(e.req.param("id")),s=L(e);await ne(s);const i=await s.sql("SELECT * FROM question_bank WHERE id = $1",[r]);if(!i.length)return e.json({error:"Question not found"},404);const n=i[0],o=await s.sql(`
      INSERT INTO question_bank (
        title, statement_html, question_type, alternatives, answer_key, technical_comment_html,
        difficulty, theme, subtheme, legal_basis, weight, estimated_minutes, tags, status,
        professor, course_id, lesson_id, source_transcript, ai_generated, order_index, created_by
      )
      VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,'draft',$14,$15,$16,$17,$18,$19,$20)
      RETURNING *
    `,[`${n.title||"Questao"} (copia)`,n.statement_html,n.question_type,JSON.stringify(n.alternatives||[]),JSON.stringify(n.answer_key||{}),n.technical_comment_html,n.difficulty,n.theme,n.subtheme,n.legal_basis,n.weight,n.estimated_minutes,JSON.stringify(n.tags||[]),n.professor,n.course_id,n.lesson_id,n.source_transcript,n.ai_generated,n.order_index+1,(t==null?void 0:t.email)||null]);return e.json({success:!0,question:o[0]})}catch(t){return e.json({error:t.message},500)}});R.delete("/api/admin/questions/:id",q,async e=>{try{const t=L(e);return await ne(t),await t.sql("DELETE FROM question_bank WHERE id = $1",[parseInt(e.req.param("id"))]),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});R.post("/api/admin/questions-reorder",q,async e=>{try{const{questions:t}=await e.req.json();if(!Array.isArray(t))return e.json({error:"questions must be an array"},400);const r=L(e);await ne(r);for(const s of t)await r.sql("UPDATE question_bank SET order_index = $1, updated_at = NOW() WHERE id = $2",[parseInt(s.order_index),parseInt(s.id)]);return e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});R.post("/api/admin/questions/import",q,async e=>{try{const{questions:t}=await e.req.json();if(!Array.isArray(t))return e.json({error:"questions array required"},400);const r=e.get("user"),s=L(e);await ne(s);let i=0;for(const n of t){const o=Gr(n,r==null?void 0:r.email);await s.sql(`
        INSERT INTO question_bank (
          title, statement_html, question_type, alternatives, answer_key, technical_comment_html,
          difficulty, theme, subtheme, legal_basis, weight, estimated_minutes, tags, status,
          professor, course_id, lesson_id, source_transcript, ai_generated, order_index, created_by
        )
        VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,$16,$17,$18,$19,$20,$21)
      `,[o.title,o.statement_html,o.question_type,o.alternatives,o.answer_key,o.technical_comment_html,o.difficulty,o.theme,o.subtheme,o.legal_basis,o.weight,o.estimated_minutes,o.tags,o.status,o.professor,o.course_id,o.lesson_id,o.source_transcript,o.ai_generated,o.order_index,o.created_by]),i++}return e.json({success:!0,created:i})}catch(t){return e.json({error:t.message},500)}});R.post("/api/admin/questions/generate-ai",q,async e=>{var t,r,s;try{const{lesson_id:i,transcript:n,count:o=5,types:l=["multiple_choice","true_false","discursive"],difficulty:u="misto",context:d=""}=await e.req.json(),a=L(e);await ne(a);let f=n||"",c=null;if(i&&(c=(await a.sql(`
        SELECT l.id, l.title, l.transcript, c.title AS course_title, c.instructor, c.id AS course_id
        FROM lessons l
        JOIN modules m ON m.id = l.module_id
        JOIN courses c ON c.id = m.course_id
        WHERE l.id = $1
      `,[parseInt(i)]))[0]||null,f=f||(c==null?void 0:c.transcript)||""),!(f!=null&&f.trim()))return e.json({error:"Informe uma transcricao ou selecione uma aula com transcricao."},400);const p=e.env.VITE_OPENROUTER_API_KEY;if(!p)return e.json({error:"VITE_OPENROUTER_API_KEY nao configurada"},500);const h=`Gere questoes para prova de proficiencia e certificacao em calculos trabalhistas usando exclusivamente o conteudo-base fornecido abaixo.
Retorne somente JSON valido, sem markdown, no formato {"questions":[...]}.
Cada item deve conter: title, statement_html, question_type ("discursive", "multiple_choice" ou "true_false"), alternatives (array com {label,text_html,is_correct}), answer_key, technical_comment_html, difficulty ("facil","medio","dificil"), theme, subtheme, legal_basis, weight, estimated_minutes, tags.
Crie alternativas plausiveis, gabarito comentado e fundamentacao tecnica. Tipos desejados: ${l.join(", ")}. Dificuldade: ${u}. Quantidade: ${o}.
Nao mencione "transcricao", "aula transcrita", "texto transcrito" ou a origem do conteudo em nenhum enunciado, alternativa, comentario, gabarito, tag, tema ou titulo. As questoes devem parecer itens independentes de prova.
Contexto adicional: ${d||"nenhum"}.
Conteudo-base:
---
${f.slice(0,24e3)}
---`,b=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${p}`,"HTTP-Referer":"https://cct2026.com.br","X-Title":"CCT2026 Admin"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:[{role:"system",content:"Voce e especialista em direito do trabalho, calculos trabalhistas, PJe-Calc e avaliacao educacional. Responda apenas JSON valido."},{role:"user",content:h}],response_format:{type:"json_object"}})});if(!b.ok)return e.json({error:`OpenRouter: ${await b.text()}`},500);const m=((s=(r=(t=(await b.json()).choices)==null?void 0:t[0])==null?void 0:r.message)==null?void 0:s.content)||'{"questions":[]}',w=(JSON.parse(m).questions||[]).map(x=>({...$r(x),lesson_id:(c==null?void 0:c.id)||i||null,course_id:(c==null?void 0:c.course_id)||null,professor:(c==null?void 0:c.instructor)||null,source_transcript:f,ai_generated:!0,status:"review"}));return e.json({questions:w})}catch(i){return console.error("Generate questions error:",i),e.json({error:i.message||"Erro ao gerar questoes"},500)}});R.post("/api/admin/run-migration-lesson-fields",q,async e=>{try{const t=L(e);return await t.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS support_text TEXT"),await t.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS transcript TEXT"),await t.sql("ALTER TABLE lessons ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb"),await Et(t),e.json({success:!0,message:"Migration applied successfully"})}catch(t){return console.error("Migration error:",t),e.json({error:t.message},500)}});const Po=new Set(["update_user","update_member_subscription","create_member_subscription","expire_subscription","update_lesson","update_course","update_certificate","reply_comment","delete_comment","generate_certificate","add_credits","bulk_extend_subscriptions"]),qo=[{type:"function",function:{name:"search_users",description:"Busca usuários por email ou nome parcial. Retorna lista com dados básicos e status de assinatura.",parameters:{type:"object",properties:{query:{type:"string",description:"Email ou nome para buscar (parcial)"},limit:{type:"number",description:"Máximo de resultados (padrão 10)"}},required:["query"]}}},{type:"function",function:{name:"get_user_details",description:"Retorna dados completos de um usuário: perfil, assinaturas (member_subscriptions) e certificados.",parameters:{type:"object",properties:{email:{type:"string",description:"Email exato do usuário"}},required:["email"]}}},{type:"function",function:{name:"list_courses",description:"Lista todos os cursos com id, título, instrutor e carga horária.",parameters:{type:"object",properties:{}}}},{type:"function",function:{name:"get_course_details",description:"Retorna detalhes de um curso: módulos, contagem de aulas, configurações.",parameters:{type:"object",properties:{course_id:{type:"number",description:"ID do curso"}},required:["course_id"]}}},{type:"function",function:{name:"search_subscriptions",description:"Busca assinaturas por email do usuário (tabela member_subscriptions).",parameters:{type:"object",properties:{email:{type:"string",description:"Email do usuário"}},required:["email"]}}},{type:"function",function:{name:"list_certificates",description:"Lista certificados. Se email fornecido, filtra por usuário.",parameters:{type:"object",properties:{email:{type:"string",description:"Email do usuário (opcional)"},limit:{type:"number",description:"Máximo de resultados (padrão 20)"}}}}},{type:"function",function:{name:"get_lesson",description:"Retorna dados de uma aula pelo ID (título, video, duração, configurações de acesso).",parameters:{type:"object",properties:{lesson_id:{type:"number",description:"ID da aula"}},required:["lesson_id"]}}},{type:"function",function:{name:"list_comments",description:"Lista comentários recentes, opcionalmente filtrado por aula.",parameters:{type:"object",properties:{lesson_id:{type:"number",description:"ID da aula (opcional)"},limit:{type:"number",description:"Máximo de resultados (padrão 20)"}}}}},{type:"function",function:{name:"dashboard_stats",description:"Retorna estatísticas gerais do sistema: total de usuários, assinaturas ativas, certificados emitidos, comentários sem resposta, total de cursos e aulas.",parameters:{type:"object",properties:{}}}},{type:"function",function:{name:"get_user_progress",description:"Retorna o progresso de um usuário em todos os cursos: % concluído, aulas completadas e aulas totais por curso.",parameters:{type:"object",properties:{email:{type:"string",description:"Email do usuário"}},required:["email"]}}},{type:"function",function:{name:"list_recent_signups",description:"Lista usuários cadastrados recentemente.",parameters:{type:"object",properties:{days:{type:"number",description:"Últimos X dias (padrão 7)"},limit:{type:"number",description:"Máximo de resultados (padrão 20)"}}}}},{type:"function",function:{name:"search_lessons",description:"Busca aulas por título/palavra-chave e/ou por data de criação. Todos os parâmetros são opcionais — pode buscar só por nome, só por data, ou combinar os dois.",parameters:{type:"object",properties:{query:{type:"string",description:"Termo de busca no título da aula (opcional)"},course_id:{type:"number",description:"Filtrar por curso (opcional)"},created_after:{type:"string",description:"Aulas criadas a partir desta data ISO 8601, ex: 2026-06-01 (opcional)"},created_before:{type:"string",description:"Aulas criadas até esta data ISO 8601, ex: 2026-06-30 (opcional)"},order_by:{type:"string",description:'Ordenação: "created_asc", "created_desc" (padrão), "title" (opcional)'},limit:{type:"number",description:"Máximo de resultados (padrão 20)"}}}}},{type:"function",function:{name:"search_suiteplus_subscriptions",description:"Busca assinaturas no banco SuitePlus (sistema externo de pagamentos). Se email fornecido, filtra por usuário; caso contrário lista as mais recentes.",parameters:{type:"object",properties:{email:{type:"string",description:"Email do usuário (opcional)"},status:{type:"string",description:"Filtrar por status: active, expired, cancelled (opcional)"},limit:{type:"number",description:"Máximo de resultados (padrão 20)"}}}}},{type:"function",function:{name:"reply_comment",description:"Responde a um comentário de aluno.",parameters:{type:"object",properties:{comment_id:{type:"number",description:"ID do comentário"},reply:{type:"string",description:"Texto da resposta"}},required:["comment_id","reply"]}}},{type:"function",function:{name:"delete_comment",description:"Remove um comentário.",parameters:{type:"object",properties:{comment_id:{type:"number",description:"ID do comentário a remover"}},required:["comment_id"]}}},{type:"function",function:{name:"generate_certificate",description:"Emite um certificado manualmente para um usuário em um curso.",parameters:{type:"object",properties:{email:{type:"string",description:"Email do usuário"},user_name:{type:"string",description:"Nome completo do usuário no certificado"},course_title:{type:"string",description:"Título do curso"},carga_horaria:{type:"number",description:"Carga horária em horas"},completion_date:{type:"string",description:"Data de conclusão ISO 8601 (padrão: hoje)"}},required:["email","user_name","course_title","carga_horaria"]}}},{type:"function",function:{name:"add_credits",description:"Adiciona créditos de aluguel ao saldo de um usuário.",parameters:{type:"object",properties:{email:{type:"string",description:"Email do usuário"},amount:{type:"number",description:"Quantidade de créditos a adicionar"}},required:["email","amount"]}}},{type:"function",function:{name:"bulk_extend_subscriptions",description:"Estende a data de expiração de assinaturas de múltiplos usuários de uma só vez.",parameters:{type:"object",properties:{emails:{type:"array",items:{type:"string"},description:"Lista de emails dos usuários"},days:{type:"number",description:"Número de dias para estender"}},required:["emails","days"]}}},{type:"function",function:{name:"list_expiring_subscriptions",description:'Lista assinaturas da tabela member_subscriptions que expiram nos próximos N dias (ou que já expiraram nos últimos N dias se days_ago for passado). Use esta ferramenta para perguntas como "quem expira essa semana", "assinaturas vencendo hoje", etc.',parameters:{type:"object",properties:{days_ahead:{type:"number",description:"Buscar assinaturas expirando nos próximos X dias (ex: 7 para esta semana, 30 para este mês). Padrão: 7."},include_expired_days:{type:"number",description:"Também incluir assinaturas que expiraram nos últimos X dias. Padrão: 0 (não incluir)."},only_active:{type:"boolean",description:"Se true, filtra apenas onde ativo=true. Padrão: true."}}}}},{type:"function",function:{name:"update_user",description:"Atualiza campos de um usuário na tabela users (nome, telefone, ativo, dt_expiracao).",parameters:{type:"object",properties:{email:{type:"string",description:"Email do usuário"},fields:{type:"object",description:"Campos a atualizar (nome, telefone, ativo, dt_expiracao)"}},required:["email","fields"]}}},{type:"function",function:{name:"update_member_subscription",description:"Atualiza assinatura de membro (data_expiracao, ativo, detalhe).",parameters:{type:"object",properties:{email:{type:"string",description:"Email do membro"},fields:{type:"object",description:"Campos a atualizar (data_expiracao, ativo, detalhe)"}},required:["email","fields"]}}},{type:"function",function:{name:"create_member_subscription",description:"Cria nova assinatura para um membro.",parameters:{type:"object",properties:{email_membro:{type:"string",description:"Email do membro"},data_expiracao:{type:"string",description:"Data de expiração ISO 8601 (ex: 2026-12-31)"},detalhe:{type:"string",description:"Descrição do plano (ex: Plano Anual)"},ativo:{type:"boolean",description:"Ativo (padrão true)"}},required:["email_membro","data_expiracao"]}}},{type:"function",function:{name:"expire_subscription",description:"Expira imediatamente a assinatura de um usuário (define data_expiracao para agora e ativo=false).",parameters:{type:"object",properties:{email:{type:"string",description:"Email do usuário"}},required:["email"]}}},{type:"function",function:{name:"update_lesson",description:"Atualiza dados de uma aula (title, description, teste_gratis, rentable, duration_minutes).",parameters:{type:"object",properties:{lesson_id:{type:"number",description:"ID da aula"},fields:{type:"object",description:"Campos: title, description, teste_gratis, rentable, duration_minutes"}},required:["lesson_id","fields"]}}},{type:"function",function:{name:"update_course",description:"Atualiza dados de um curso (title, description, instructor, duration_hours).",parameters:{type:"object",properties:{course_id:{type:"number",description:"ID do curso"},fields:{type:"object",description:"Campos: title, description, instructor, duration_hours"}},required:["course_id","fields"]}}},{type:"function",function:{name:"update_certificate",description:"Atualiza dados de um certificado (user_name, course_title, carga_horaria, generated_at).",parameters:{type:"object",properties:{certificate_id:{type:"number",description:"ID do certificado"},fields:{type:"object",description:"Campos: user_name, course_title, carga_horaria, generated_at"}},required:["certificate_id","fields"]}}}];function Do(e,t){switch(e){case"update_user":return`Atualizar usuário **${t.email}** com os campos:
${JSON.stringify(t.fields,null,2)}`;case"update_member_subscription":return`Atualizar assinatura de **${t.email}** com:
${JSON.stringify(t.fields,null,2)}`;case"create_member_subscription":return`Criar assinatura para **${t.email_membro}** com expiração em **${t.data_expiracao}** (${t.detalhe||"sem detalhe"})`;case"expire_subscription":return`Expirar imediatamente a assinatura de **${t.email}** (ativo = false, data_expiracao = agora)`;case"update_lesson":return`Atualizar aula ID **${t.lesson_id}** com:
${JSON.stringify(t.fields,null,2)}`;case"update_course":return`Atualizar curso ID **${t.course_id}** com:
${JSON.stringify(t.fields,null,2)}`;case"update_certificate":return`Atualizar certificado ID **${t.certificate_id}** com:
${JSON.stringify(t.fields,null,2)}`;case"reply_comment":return`Responder ao comentário ID **${t.comment_id}** com:
"${t.reply}"`;case"delete_comment":return`Excluir permanentemente o comentário ID **${t.comment_id}**`;case"generate_certificate":return`Emitir certificado para **${t.user_name}** (${t.email})
Curso: **${t.course_title}** — ${t.carga_horaria}h
Data de conclusão: ${t.completion_date||"hoje"}`;case"add_credits":return`Adicionar **${t.amount} créditos** ao saldo de **${t.email}**`;case"bulk_extend_subscriptions":return`Estender assinaturas de **${(t.emails||[]).length} usuários** por **${t.days} dias**:
${(t.emails||[]).join(`
`)}`;default:return`Executar ação **${e}** com args: ${JSON.stringify(t)}`}}async function jo(e,t,r,s){var i,n,o,l,u,d,a;switch(e){case"search_users":{const f=`%${t.query}%`,c=Math.min(t.limit||10,50),p=await r.sql(`SELECT u.id, u.email, u.nome, u.ativo, u.dt_expiracao,
                ms.data_expiracao as sub_expiracao, ms.ativo as sub_ativo, ms.detalhe as sub_detalhe
         FROM users u
         LEFT JOIN member_subscriptions ms ON lower(ms.email_membro) = lower(u.email)
         WHERE u.email ILIKE $1 OR u.nome ILIKE $1
         ORDER BY u.created_at DESC LIMIT $2`,[f,c]);return{users:p,total:p.length}}case"get_user_details":{const[f,c,p]=await Promise.all([r.sql("SELECT * FROM users WHERE lower(email) = lower($1) LIMIT 1",[t.email]),r.sql("SELECT * FROM member_subscriptions WHERE lower(email_membro) = lower($1) ORDER BY data_expiracao DESC",[t.email]),r.sql("SELECT * FROM certificates WHERE lower(user_email) = lower($1) ORDER BY created_at DESC",[t.email])]);return{user:f[0]||null,subscriptions:c,certificates:p}}case"list_courses":return{courses:await r.sql("SELECT id, title, instructor, duration_hours, created_at FROM courses ORDER BY title")};case"get_course_details":{const[f,c]=await Promise.all([r.sql("SELECT * FROM courses WHERE id = $1",[t.course_id]),r.sql(`SELECT m.id, m.title, m.order_index, COUNT(l.id)::int as lesson_count
           FROM modules m LEFT JOIN lessons l ON l.module_id = m.id
           WHERE m.course_id = $1 GROUP BY m.id ORDER BY m.order_index`,[t.course_id])]);return{course:f[0]||null,modules:c}}case"search_subscriptions":return{subscriptions:await r.sql("SELECT * FROM member_subscriptions WHERE lower(email_membro) = lower($1) ORDER BY data_expiracao DESC",[t.email])};case"list_certificates":{const f=Math.min(t.limit||20,100);return{certificates:t.email?await r.sql("SELECT * FROM certificates WHERE lower(user_email) = lower($1) ORDER BY created_at DESC LIMIT $2",[t.email,f]):await r.sql("SELECT * FROM certificates ORDER BY created_at DESC LIMIT $1",[f])}}case"get_lesson":return{lesson:(await r.sql(`SELECT l.*, m.title as module_title, c.title as course_title
         FROM lessons l LEFT JOIN modules m ON m.id = l.module_id LEFT JOIN courses c ON c.id = m.course_id
         WHERE l.id = $1`,[t.lesson_id]))[0]||null};case"list_comments":{const f=Math.min(t.limit||20,100);return{comments:t.lesson_id?await r.sql("SELECT * FROM comments WHERE lesson_id = $1 ORDER BY created_at DESC LIMIT $2",[t.lesson_id,f]):await r.sql("SELECT * FROM comments ORDER BY created_at DESC LIMIT $1",[f])}}case"dashboard_stats":{const[f,c,p,h,b,v,m]=await Promise.all([r.sql("SELECT COUNT(*)::int as total FROM users"),r.sql("SELECT COUNT(*)::int as total FROM member_subscriptions WHERE data_expiracao > NOW() AND ativo = true"),r.sql("SELECT COUNT(*)::int as total FROM certificates"),r.sql("SELECT COUNT(*)::int as total FROM comments WHERE admin_reply IS NULL"),r.sql("SELECT COUNT(*)::int as total FROM courses"),r.sql("SELECT COUNT(*)::int as total FROM lessons"),(()=>{const y=s.env.DATABASE_SUITEPLUS;return y?new $e(y).sql("SELECT COUNT(*)::int as total FROM user_subscriptions WHERE status = 'active' AND product_id = 4 AND expires_at > NOW()").catch(()=>[{total:null}]):Promise.resolve([{total:null}])})()]);return{total_users:(i=f[0])==null?void 0:i.total,active_subscriptions_cct:(n=c[0])==null?void 0:n.total,active_subscriptions_suiteplus:(o=m[0])==null?void 0:o.total,total_certificates:(l=p[0])==null?void 0:l.total,pending_comments:(u=h[0])==null?void 0:u.total,total_courses:(d=b[0])==null?void 0:d.total,total_lessons:(a=v[0])==null?void 0:a.total}}case"get_user_progress":{const c=(await r.sql(`SELECT c.id as course_id, c.title as course_title,
                COUNT(l.id)::int as total_lessons,
                COUNT(up.lesson_id) FILTER (WHERE up.completed = true)::int as completed_lessons
         FROM courses c
         JOIN modules m ON m.course_id = c.id
         JOIN lessons l ON l.module_id = m.id
         LEFT JOIN user_progress up ON up.lesson_id = l.id AND lower(up.user_email) = lower($1)
         GROUP BY c.id, c.title
         HAVING COUNT(up.lesson_id) FILTER (WHERE up.completed = true) > 0
         ORDER BY completed_lessons DESC`,[t.email])).map(p=>({...p,progress_pct:p.total_lessons>0?Math.round(p.completed_lessons/p.total_lessons*100):0}));return{email:t.email,courses_with_progress:c,total_courses:c.length}}case"list_recent_signups":{const f=Math.min(t.days||7,365),c=Math.min(t.limit||20,100),p=await r.sql(`SELECT email, nome, created_at FROM users
         WHERE created_at > NOW() - INTERVAL '${f} days'
         ORDER BY created_at DESC LIMIT $1`,[c]);return{signups:p,count:p.length,days:f}}case"search_lessons":{const f=Math.min(t.limit||20,100),c=[],p=[];let h=1;t.query&&(c.push(`l.title ILIKE $${h++}`),p.push(`%${t.query}%`)),t.course_id&&(c.push(`c.id = $${h++}`),p.push(t.course_id)),t.created_after&&(c.push(`l.created_at >= $${h++}`),p.push(t.created_after)),t.created_before&&(c.push(`l.created_at <= $${h++}`),p.push(t.created_before));const b=c.length>0?`WHERE ${c.join(" AND ")}`:"",m={created_asc:"l.created_at ASC",created_desc:"l.created_at DESC",title:"l.title ASC"}[t.order_by]||"l.created_at DESC";p.push(f);const y=await r.sql(`SELECT l.id, l.title, l.duration_minutes, l.teste_gratis, l.rentable, l.created_at,
                m.title as module_title, c.title as course_title, c.id as course_id
         FROM lessons l JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id
         ${b} ORDER BY ${m} LIMIT $${h}`,p);return{lessons:y,count:y.length}}case"search_suiteplus_subscriptions":{const f=s.env.DATABASE_SUITEPLUS;if(!f)return{error:"DATABASE_SUITEPLUS não configurada"};const c=new $e(f),p=Math.min(t.limit||20,100);let h;return t.email?h=await c.sql(`SELECT id, user_email, product_id, started_at, expires_at, status, payment_source, recurring_enabled
           FROM user_subscriptions WHERE lower(user_email) = lower($1) ORDER BY expires_at DESC LIMIT $2`,[t.email,p]):t.status?h=await c.sql(`SELECT id, user_email, product_id, started_at, expires_at, status, payment_source, recurring_enabled
           FROM user_subscriptions WHERE status = $1 AND product_id = 4 ORDER BY expires_at DESC LIMIT $2`,[t.status,p]):h=await c.sql(`SELECT id, user_email, product_id, started_at, expires_at, status, payment_source, recurring_enabled
           FROM user_subscriptions WHERE product_id = 4 ORDER BY expires_at DESC LIMIT $1`,[p]),{subscriptions:h,count:h.length,source:"SuitePlus"}}case"list_expiring_subscriptions":{const f=Math.min(Math.max(t.days_ahead??7,0),365),c=Math.min(Math.max(t.include_expired_days??0,0),365),h=t.only_active!==!1?"AND ativo = true":"",b=await r.sql(`SELECT ms.email_membro, ms.data_expiracao, ms.ativo, ms.detalhe, ms.origem,
                u.nome
         FROM member_subscriptions ms
         LEFT JOIN users u ON lower(u.email) = lower(ms.email_membro)
         WHERE ms.data_expiracao BETWEEN (NOW() - INTERVAL '${c} days') AND (NOW() + INTERVAL '${f} days')
         ${h.replace("ativo","ms.ativo")}
         ORDER BY ms.data_expiracao ASC`,[]);return{subscriptions:b,count:b.length,query:{days_ahead:f,include_expired_days:c}}}default:return{error:`Ferramenta desconhecida: ${e}`}}}async function ko(e,t,r,s){var d,a,f;const i=new Set(["nome","telefone","whatsapp","ativo","dt_expiracao"]),n=new Set(["data_expiracao","ativo","detalhe","origem"]),o=new Set(["title","description","teste_gratis","rentable","duration_minutes","order_index"]),l=new Set(["title","description","instructor","duration_hours"]),u=new Set(["user_name","course_title","carga_horaria","generated_at"]);switch(e){case"update_user":{const c={};for(const[v,m]of Object.entries(t.fields||{}))i.has(v)&&(c[v]=m);if(Object.keys(c).length===0)return{error:"Nenhum campo válido para atualizar"};const p=Object.keys(c).map((v,m)=>`"${v}" = $${m+2}`).join(", "),h=[t.email,...Object.values(c)],b=await r.sql(`UPDATE users SET ${p} WHERE lower(email) = lower($1) RETURNING *`,h);return{updated:b.length,user:b[0]||null}}case"update_member_subscription":{const c={};for(const[v,m]of Object.entries(t.fields||{}))n.has(v)&&(c[v]=m);if(Object.keys(c).length===0)return{error:"Nenhum campo válido para atualizar"};const p=Object.keys(c).map((v,m)=>`"${v}" = $${m+2}`).join(", "),h=[t.email,...Object.values(c)],b=await r.sql(`UPDATE member_subscriptions SET ${p}, updated_at = NOW() WHERE lower(email_membro) = lower($1) RETURNING *`,h);return{updated:b.length,subscription:b[0]||null}}case"create_member_subscription":return{created:!0,subscription:(await r.sql(`INSERT INTO member_subscriptions (email_membro, data_expiracao, detalhe, ativo, origem, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'agente_ia', NOW(), NOW()) RETURNING *`,[t.email_membro,t.data_expiracao,t.detalhe||null,t.ativo!==!1]))[0]};case"expire_subscription":return{updated:(await r.sql(`UPDATE member_subscriptions SET data_expiracao = NOW(), ativo = false, updated_at = NOW()
         WHERE lower(email_membro) = lower($1) RETURNING *`,[t.email])).length,expired:!0};case"update_lesson":{const c={};for(const[v,m]of Object.entries(t.fields||{}))o.has(v)&&(c[v]=m);if(Object.keys(c).length===0)return{error:"Nenhum campo válido para atualizar"};const p=Object.keys(c).map((v,m)=>`"${v}" = $${m+2}`).join(", "),h=[t.lesson_id,...Object.values(c)],b=await r.sql(`UPDATE lessons SET ${p} WHERE id = $1 RETURNING id, title`,h);return{updated:b.length,lesson:b[0]||null}}case"update_course":{const c={};for(const[v,m]of Object.entries(t.fields||{}))l.has(v)&&(c[v]=m);if(Object.keys(c).length===0)return{error:"Nenhum campo válido para atualizar"};const p=Object.keys(c).map((v,m)=>`"${v}" = $${m+2}`).join(", "),h=[t.course_id,...Object.values(c)],b=await r.sql(`UPDATE courses SET ${p}, updated_at = NOW() WHERE id = $1 RETURNING id, title`,h);return{updated:b.length,course:b[0]||null}}case"update_certificate":{const c={};for(const[v,m]of Object.entries(t.fields||{}))u.has(v)&&(c[v]=m);if(Object.keys(c).length===0)return{error:"Nenhum campo válido para atualizar"};const p=Object.keys(c).map((v,m)=>`"${v}" = $${m+2}`).join(", "),h=[t.certificate_id,...Object.values(c)],b=await r.sql(`UPDATE certificates SET ${p}, updated_at = NOW() WHERE id = $1 RETURNING *`,h);return{updated:b.length,certificate:b[0]||null}}case"reply_comment":{const c=s.get("user"),p=await r.sql("UPDATE comments SET admin_reply = $1, admin_replied_at = NOW(), admin_replied_by = $2 WHERE id = $3 RETURNING id, user_name, comment_text, admin_reply",[t.reply,(c==null?void 0:c.email)||"admin",t.comment_id]);return p.length===0?{error:`Comentário ID ${t.comment_id} não encontrado`}:{replied:!0,comment:p[0]}}case"delete_comment":{const c=await r.sql("DELETE FROM comments WHERE id = $1 RETURNING id, user_name, comment_text",[t.comment_id]);return c.length===0?{error:`Comentário ID ${t.comment_id} não encontrado`}:{deleted:!0,comment:c[0]}}case"generate_certificate":{const c=new Uint8Array(4);crypto.getRandomValues(c);const p="CCT-"+new Date().getFullYear()+"-"+Array.from(c).map(m=>m.toString(16).padStart(2,"0")).join("").toUpperCase(),h=new Date().toISOString(),b=t.completion_date||h.split("T")[0],v=await r.sql(`INSERT INTO certificates (user_email, user_name, course_title, carga_horaria, certificate_code, verification_code, issued_at, completion_date, created_at)
         VALUES ($1, $2, $3, $4, $5, $5, $6, $7::date, $6)
         RETURNING id, certificate_code`,[t.email,t.user_name,t.course_title,t.carga_horaria,p,h,b]);return{created:!0,certificate_id:(d=v[0])==null?void 0:d.id,certificate_code:(a=v[0])==null?void 0:a.certificate_code}}case"add_credits":{const c=Qr(s);await Xr(c);const p=await c.sql(`INSERT INTO users_credits (user_email, credits_balance, total_credits_used, updated_at)
         VALUES (lower($1), $2, 0, NOW())
         ON CONFLICT (user_email) DO UPDATE
           SET credits_balance = users_credits.credits_balance + $2, updated_at = NOW()
         RETURNING user_email, credits_balance`,[t.email,t.amount]);return{added:t.amount,new_balance:(f=p[0])==null?void 0:f.credits_balance,email:t.email}}case"bulk_extend_subscriptions":{const c=(t.emails||[]).map(b=>b.toLowerCase());if(c.length===0)return{error:"Nenhum email fornecido"};const p=Math.min(Math.max(t.days||0,1),3650),h=await r.sql(`UPDATE member_subscriptions
         SET data_expiracao = data_expiracao + ($1 || ' days')::INTERVAL, updated_at = NOW()
         WHERE lower(email_membro) = ANY($2)
         RETURNING email_membro, data_expiracao`,[String(p),c]);return{updated:h.length,days_added:p,subscriptions:h}}default:return{error:`Ferramenta de escrita desconhecida: ${e}`}}}R.get("/api/admin/agent-settings",q,async e=>{var t;try{const r=L(e);await r.sql("CREATE TABLE IF NOT EXISTS agent_settings (key VARCHAR(100) PRIMARY KEY, value TEXT, updated_at TIMESTAMPTZ DEFAULT NOW())");const s=await r.sql("SELECT value FROM agent_settings WHERE key = 'custom_instructions'");return e.json({instructions:((t=s[0])==null?void 0:t.value)||""})}catch(r){return e.json({error:r.message},500)}});R.put("/api/admin/agent-settings",q,async e=>{try{const{instructions:t}=await e.req.json(),r=L(e);return await r.sql("CREATE TABLE IF NOT EXISTS agent_settings (key VARCHAR(100) PRIMARY KEY, value TEXT, updated_at TIMESTAMPTZ DEFAULT NOW())"),await r.sql(`INSERT INTO agent_settings (key, value, updated_at) VALUES ('custom_instructions', $1, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,[t||""]),e.json({success:!0})}catch(t){return e.json({error:t.message},500)}});R.post("/api/admin/agent",q,async e=>{var t,r,s;try{const i=await e.req.json(),{message:n,history:o=[],pendingAction:l}=i,u=L(e),d=e.env.VITE_OPENROUTER_API_KEY;if(!d)return e.json({error:"VITE_OPENROUTER_API_KEY não configurada"},500);if(l){const h=await ko(l.tool,l.args,u,e);return h.error?e.json({reply:`❌ Erro ao executar: ${h.error}`}):e.json({reply:`✅ Feito! Resultado:
\`\`\`json
${JSON.stringify(h,null,2)}
\`\`\``})}let a="";try{await u.sql("CREATE TABLE IF NOT EXISTS agent_settings (key VARCHAR(100) PRIMARY KEY, value TEXT, updated_at TIMESTAMPTZ DEFAULT NOW())"),a=((r=(t=(await u.sql("SELECT value FROM agent_settings WHERE key = 'custom_instructions'"))[0])==null?void 0:t.value)==null?void 0:r.trim())||""}catch{}let p=[{role:"system",content:`Você é um assistente administrativo do CCT (Clube de Cálculo Trabalhista).
Responda sempre em português brasileiro, de forma clara e objetiva.
Use as ferramentas disponíveis para consultar dados antes de responder. Nunca invente dados — sempre busque via ferramenta.

FORMATAÇÃO DE DATAS: Converta SEMPRE datas ISO (ex: 2026-05-02T13:59:26.255Z) para o formato brasileiro DD/MM/AAAA. Nunca exiba timestamps ISO crus para o admin.
FORMATAÇÃO GERAL: Omita campos técnicos internos (IDs de sistema, updated_at, created_at) a menos que sejam relevantes para a pergunta. Apresente os dados de forma limpa e legível.
STATUS DE ASSINATURA: Quando exibir data de expiração, indique também se está ativa ou expirada comparando com a data atual. Exemplo: "02/05/2026 ⚠️ expirada há 44 dias".

Para perguntas sobre assinaturas expirando (esta semana, este mês, hoje, etc.): use list_expiring_subscriptions com days_ahead apropriado.
Quando mostrar detalhes completos de um usuário: consulte também search_suiteplus_subscriptions para comparar com o banco SuitePlus e indique se há divergência entre os sistemas.
Para ações de modificação (update/create/expire): use a ferramenta correspondente — o sistema pedirá confirmação antes de executar.
Data/hora atual no Brasil: ${new Date().toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo",dateStyle:"full",timeStyle:"short"})}${a?`

INSTRUÇÕES PERSONALIZADAS DO ADMINISTRADOR:
${a}`:""}`},...o.slice(-20),{role:"user",content:n}];for(let h=0;h<6;h++){const b=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`,"HTTP-Referer":"https://novocct.ensinoplus.com.br","X-Title":"CCT Admin Agent"},body:JSON.stringify({model:"google/gemini-2.5-flash",messages:p,tools:qo,tool_choice:"auto"})});if(!b.ok)return e.json({error:`OpenRouter: ${await b.text()}`},500);const m=(s=(await b.json()).choices)==null?void 0:s[0];if(!m)return e.json({error:"Resposta vazia do modelo"},500);const y=m.message,w=y.tool_calls;if(!w||w.length===0)return e.json({reply:y.content||""});const x=w[0],O=x.function.name;let A={};try{A=JSON.parse(x.function.arguments)}catch{}if(Po.has(O)){const E=Do(O,A);return e.json({reply:`⚠️ **Confirmação necessária**

${E}`,pendingAction:{tool:O,args:A,description:E}})}const g=await jo(O,A,u,e);p.push({role:"assistant",content:y.content||null,tool_calls:w}),p.push({role:"tool",content:JSON.stringify(g),tool_call_id:x.id})}return e.json({reply:"Não consegui completar a consulta. Tente reformular sua pergunta."})}catch(i){return console.error("Agent error:",i),e.json({error:i.message||"Erro no agente"},500)}});R.get("/api/admin/users",q,async e=>{try{const r=await L(e).sql(`
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
    `);return e.json({users:r})}catch(t){return console.error("Get users error:",t),e.json({error:t.message||"Failed to fetch users"},500)}});R.get("/api/admin/users/find",q,async e=>{try{const t=e.req.query("email");if(!t)return e.json({error:"Email is required"},400);const s=await L(e).query("users",{select:"*",filters:{email:t},limit:1});return s&&s.length>0?e.json({user:s[0]}):e.json({user:null})}catch(t){return console.error("Find user error:",t),e.json({error:t.message||"Failed to find user"},500)}});R.post("/api/admin/users",q,async e=>{try{const t=await e.req.json();if(!t.email)return e.json({error:"Email is required"},400);const s=await L(e).insert("users",{email:t.email,nome:t.nome||null,first_name:t.first_name||null,last_name:t.last_name||null,cpf:t.cpf||null,telefone:t.telefone||null,whatsapp:t.whatsapp||null,foto:t.foto||null,end_cep:t.end_cep||null,end_logradouro:t.end_logradouro||null,end_numero:t.end_numero||null,end_cidade:t.end_cidade||null,end_estado:t.end_estado||null,ativo:t.ativo!==void 0?t.ativo:!0,teste_gratis:t.teste_gratis||!1,dt_expiracao:t.dt_expiracao||null});return e.json({success:!0,user_id:s[0].id})}catch(t){return console.error("Create user error:",t),e.json({error:t.message||"Failed to create user"},500)}});R.put("/api/admin/users/:id",q,async e=>{try{const t=e.req.param("id"),r=await e.req.json();return await L(e).update("users",{id:t},{nome:r.nome,first_name:r.first_name,last_name:r.last_name,cpf:r.cpf,telefone:r.telefone,whatsapp:r.whatsapp,foto:r.foto,end_cep:r.end_cep,end_logradouro:r.end_logradouro,end_numero:r.end_numero,end_cidade:r.end_cidade,end_estado:r.end_estado,ativo:r.ativo,teste_gratis:r.teste_gratis,dt_expiracao:r.dt_expiracao,updated_at:new Date().toISOString()}),e.json({success:!0})}catch(t){return console.error("Update user error:",t),e.json({error:t.message||"Failed to update user"},500)}});R.delete("/api/admin/users/:id",q,async e=>{try{const t=e.req.param("id");return await L(e).delete("users",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete user error:",t),e.json({error:t.message||"Failed to delete user"},500)}});R.get("/api/admin/certificates",q,async e=>{try{const r=await L(e).query("certificates",{select:"*",order:"created_at DESC"});return e.json({certificates:r||[]})}catch(t){return console.error("List certificates error:",t),e.json({error:t.message||"Failed to list certificates"},500)}});R.get("/api/admin/certificates/:id",q,async e=>{try{const t=e.req.param("id"),s=await L(e).query("certificates",{select:"*",filters:{id:t}});return!s||s.length===0?e.json({error:"Certificate not found"},404):e.json({certificate:s[0]})}catch(t){return console.error("Get certificate error:",t),e.json({error:t.message||"Failed to get certificate"},500)}});R.get("/api/admin/certificates/find",q,async e=>{try{const t=e.req.query("email"),r=e.req.query("course");if(!t||!r)return e.json({error:"Email and course parameters are required"},400);const i=await L(e).query("certificates",{select:"*",filters:{user_email:t,course_title:r}});return e.json({certificates:i||[]})}catch(t){return console.error("Find certificate error:",t),e.json({error:t.message||"Failed to find certificate"},500)}});R.get("/api/admin/certificates/suggested-dates",q,async e=>{try{const t=e.req.query("email"),r=e.req.query("course_id");if(!t||!r)return e.json({error:"email e course_id são obrigatórios"},400);const n=(await L(e).sql(`
      SELECT MIN(up.completed_at) AS start_date, MAX(up.completed_at) AS completion_date
      FROM user_progress up
      JOIN lessons l ON l.id = up.lesson_id
      JOIN modules m ON m.id = l.module_id
      WHERE m.course_id = $1 AND up.user_email = $2 AND up.completed = true
    `,[r,t]))[0]||{};return e.json({start_date:n.start_date||null,completion_date:n.completion_date||null})}catch(t){return console.error("Suggest certificate dates error:",t),e.json({error:t.message||"Failed to suggest dates"},500)}});R.post("/api/admin/certificates",q,async e=>{try{const t=await e.req.json();if(!t.user_email||!t.course_title)return e.json({error:"Email and course title are required"},400);const r=L(e),s=new Date().toISOString(),i=await r.insert("certificates",{user_email:t.user_email,user_name:t.user_name||"Aluno",course_id:t.course_id||null,course_title:t.course_title,issued_at:t.issued_at||s,start_date:t.start_date||null,completion_date:t.completion_date||s,carga_horaria:t.carga_horaria||null,certificate_code:t.certificate_code||null,generated_at:t.generated_at||null});return e.json({success:!0,certificate_id:i&&i.length>0?i[0].id:null})}catch(t){return console.error("Create certificate error:",t),e.json({error:t.message||"Failed to create certificate"},500)}});R.post("/api_certificado",async e=>{var t;try{const r=await e.req.json(),s=Array.isArray(r)?r:[r],i=L(e),n=[];for(const l of s){const u=m=>{const y=String(m??"").trim();return!y||y.toLowerCase()==="null"||y.toLowerCase()==="undefined"?"":y},d=u(l.user_email||l.email).toLowerCase(),a=u(l.user_name||l.nome)||null,f=u(l.course_title||l.curso);let c=l.carga_horaria?parseInt(String(l.carga_horaria)):null;if(c!==null&&!Number.isFinite(c)&&(c=null),!d.includes("@")||!f){n.push({user_email:d,course_title:f,status:"error",error:"user_email e course_title são obrigatórios"});continue}const p=m=>{if(!m)return null;const y=String(m).trim();if(!y||y.toLowerCase()==="null"||y.toLowerCase()==="undefined")return null;if(/^\d{2}\/\d{2}\/\d{4}$/.test(y)){const[w,x,O]=y.split("/");return`${O}-${x}-${w}T12:00:00Z`}return isNaN(new Date(y).getTime())?null:new Date(y).toISOString()},h=p(l.data_final||l.completion_date),b=p(l.data_inicio||l.data_inicial||l.start_date);if(!c){const m=await i.sql("SELECT duration_hours FROM courses WHERE lower(title) = lower($1) OR lower(title) ILIKE lower($2) LIMIT 1",[f,`%${f}%`]);if(m.length>0&&m[0].duration_hours)c=parseInt(m[0].duration_hours);else{const y=x=>x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9\s]/g,"").split(/\s+/).filter(O=>O&&O!=="de"&&O!=="do"&&O!=="da"),w=y(f);if(w.length>0){const O=(await i.sql("SELECT title, duration_hours FROM courses WHERE duration_hours > 0")).find(A=>{const g=y(A.title).join(" ");return w.every(E=>g.includes(E))});O&&(c=parseInt(O.duration_hours))}}}const v=await i.sql("SELECT id FROM certificates WHERE lower(user_email) = lower($1) AND lower(course_title) = lower($2) LIMIT 1",[d,f]);if(v.length>0)await i.sql(`UPDATE certificates
           SET user_name = COALESCE($1, user_name),
               carga_horaria = COALESCE($2, carga_horaria),
               completion_date = COALESCE($3, completion_date),
               start_date = COALESCE($4::date, start_date),
               updated_at = NOW()
           WHERE id = $5`,[a,c,h,b,v[0].id]),n.push({user_email:d,course_title:f,status:"updated",certificate_id:v[0].id});else{const m=new Uint8Array(4);crypto.getRandomValues(m);const y="CCT-"+new Date().getFullYear()+"-"+Array.from(m).map(O=>O.toString(16).padStart(2,"0")).join("").toUpperCase(),w=new Date().toISOString(),x=await i.sql(`INSERT INTO certificates (user_email, user_name, course_title, carga_horaria, certificate_code, verification_code, issued_at, completion_date, start_date, created_at)
           VALUES ($1, $2, $3, $4, $5, $5, $6, COALESCE($7, $6::timestamp), $8::date, $6)
           RETURNING id`,[d,a||"Aluno",f,c,y,w,h,b]);n.push({user_email:d,course_title:f,status:"created",certificate_id:(t=x[0])==null?void 0:t.id,verification_code:y})}}const o=n.filter(l=>l.status==="error").length;return e.json({success:o===0,total:s.length,results:n})}catch(r){return console.error("Webhook api_certificado error:",r),e.json({error:r.message||"Falha ao processar certificado"},500)}});R.put("/api/admin/certificates/:id",q,async e=>{try{const t=e.req.param("id"),r=await e.req.json(),s=L(e);let i=r.course_title;if(r.course_id){const n=await s.query("courses",{select:"title",filters:{id:r.course_id}});n&&n.length>0&&(i=n[0].title)}return await s.update("certificates",{id:t},{user_email:r.user_email,user_name:r.user_name,course_id:r.course_id,course_title:i,carga_horaria:r.carga_horaria,start_date:r.start_date||null,completion_date:r.completion_date||null,updated_at:new Date().toISOString()}),e.json({success:!0})}catch(t){return console.error("Update certificate error:",t),e.json({error:t.message||"Failed to update certificate"},500)}});R.delete("/api/admin/certificates/:id",q,async e=>{try{const t=e.req.param("id");return await L(e).delete("certificates",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete certificate error:",t),e.json({error:t.message||"Failed to delete certificate"},500)}});function Bo(e){const t=!!e.templateImageUrl,r=!!e.versoImageUrl,s=e.modules&&e.modules.length>0;if(t){const d=s?e.modules.map((f,c)=>`<div class="mod-item"><span class="mod-num">${String(c+1).padStart(2,"0")}.</span> ${f}</div>`).join(""):"",a=r?`
    <div class="page verso-page">
      <img class="bg-img" src="${e.versoImageUrl}" alt="Verso do certificado">
      ${s?`
      <div class="verso-overlay">
        <div class="mod-grid">${d}</div>
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
</html>`}const i=`<svg viewBox="0 0 115 78" xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none" style="display:block;width:100%;height:100%;">
    <path d="M 0 0 L 110 0 C 130 0 114 28 62 58 C 38 72 8 79 0 79 Z" fill="#1a1a2e"/>
    <path d="M 0 0 L 90 0 C 108 0 93 23 48 50 C 27 63 4 70 0 67 Z" fill="#c0392b"/>
  </svg>`,n=`<svg viewBox="0 0 80 108" xmlns="http://www.w3.org/2000/svg" width="66" height="89">
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
  `,u=s?`
  <div class="page">
    <div class="corner-tl">${i}</div>
    <div class="corner-br">${i}</div>
    <div class="cert-border"></div>
    <div class="watermark">${o}</div>

    <div class="logo-section">
      <img class="logo-img" src="${os}" alt="Ensino Plus"/>
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
        ${e.modules.map((d,a)=>`
          <div class="mod-item"><span class="mod-num">${String(a+1).padStart(2,"0")}.</span>${d}</div>`).join("")}
      </div>
    </div>

    <div class="footer-section">
      <div class="f-left">
        <div class="f-label">Código de Verificação</div>
        <div class="f-value">${e.verificationCode}</div>
      </div>
      <div class="f-center">${n}</div>
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
    <div class="corner-tl">${i}</div>
    <div class="corner-br">${i}</div>
    <div class="cert-border"></div>
    <div class="watermark">${o}</div>

    <!-- Logo centralizado grande -->
    <div class="logo-section">
      <img class="logo-img" src="${os}" alt="Ensino Plus"/>
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
      <div class="f-center">${n}</div>
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

  ${u}

  <script>window.onload=function(){document.querySelectorAll('.qr-wrap svg').forEach(function(s){s.setAttribute('width','60');s.setAttribute('height','60');})}<\/script>

</body>
</html>`}R.get("/api/my-courses-progress",G,async e=>{try{const r=e.get("user").email;if(!r)return e.json({error:"User email not found"},400);const i=await L(e).sql(`
      SELECT
        c.id AS course_id,
        c.title AS course_title,
        c.duration_hours,
        c.min_completion_days,
        COUNT(DISTINCT l.id)::int AS total_lessons,
        COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.completed = true)::int AS completed_lessons,
        MIN(up.completed_at) FILTER (WHERE up.completed = true) AS first_completed_at,
        MAX(up.completed_at) FILTER (WHERE up.completed = true) AS last_completed_at,
        cert.id AS certificate_id
      FROM courses c
      JOIN modules m ON m.course_id = c.id
      JOIN lessons l ON l.module_id = m.id
      LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_email = $1
      LEFT JOIN certificates cert ON cert.course_id = c.id AND cert.user_email = $1
      WHERE c.is_published = true
      GROUP BY c.id, c.title, c.duration_hours, c.min_completion_days, cert.id
      HAVING COUNT(DISTINCT up.lesson_id) FILTER (WHERE up.completed = true) > 0 OR cert.id IS NOT NULL
      ORDER BY c.title
    `,[r]);return e.json({courses:i||[]})}catch(t){return console.error("Get my courses progress error:",t),e.json({error:t.message||"Failed to get courses progress"},500)}});R.get("/api/my-certificates",G,async e=>{try{const r=e.get("user").email;if(!r)return e.json({error:"User email not found"},400);const i=await L(e).query("certificates",{select:"*",filters:{user_email:r},order:"completion_date DESC"});return e.json({certificates:i||[]})}catch(t){return console.error("Get my certificates error:",t),e.json({error:t.message||"Failed to get certificates"},500)}});R.get("/api/certificates/:id/html",G,async e=>{try{const t=e.req.param("id"),s=e.get("user").email,i=L(e),n=await i.query("certificates",{select:"*",filters:{id:t}});if(!n||n.length===0)return e.json({error:"Certificate not found"},404);const o=n[0];if(o.user_email!==s)return e.json({error:"Unauthorized"},403);const l=o.start_date?new Date(o.start_date).toLocaleDateString("pt-BR"):void 0,u=o.completion_date?new Date(o.completion_date).toLocaleDateString("pt-BR"):void 0,d=o.generated_at?new Date(o.generated_at).toLocaleDateString("pt-BR"):new Date().toLocaleDateString("pt-BR"),a=new URL(e.req.url).origin,f=o.certificate_code||o.verification_code||"",c=f?`${a}/verificar/${f}`:"";let p=[];if(o.course_modules)try{p=JSON.parse(o.course_modules).map(w=>w.title||w)}catch(y){console.log("Error parsing course_modules:",y)}if(p.length===0&&o.course_id)try{const y=await i.query("modules",{select:"title, order_index",filters:{course_id:o.course_id},order:"order_index ASC"});y&&y.length>0&&(p=y.map(w=>w.title))}catch(y){console.log("Error fetching modules:",y)}let h,b;if(o.course_id)try{const y=await i.query("certificate_templates",{select:"template_data, template_mime, verso_data, verso_mime",filters:{course_id:o.course_id},single:!0});y!=null&&y.template_data&&(h=`data:${y.template_mime||"image/jpeg"};base64,${y.template_data}`),y!=null&&y.verso_data&&(b=`data:${y.verso_mime||"image/jpeg"};base64,${y.verso_data}`)}catch{console.log("No certificate template found for course",o.course_id)}let v;if(c)try{v=await Io.toString(c,{type:"svg",margin:1,color:{dark:"#1a1a2e",light:"#f8f7f5"}})}catch(y){console.log("QR code generation failed:",y)}const m=Bo({studentName:o.user_name,courseName:o.course_title,workload:o.carga_horaria||"N/A",startDate:l,completionDate:u,issueDate:d,verificationCode:f,verificationUrl:c,qrCodeSVG:v,modules:p.length>0?p:void 0,templateImageUrl:h,versoImageUrl:b});return e.html(m)}catch(t){return console.error("Generate certificate HTML error:",t),e.json({error:t.message||"Failed to generate certificate"},500)}});R.get("/verificar/:code",async e=>{try{const t=e.req.param("code"),r=L(e),s=await r.query("certificates",{select:"*",filters:{certificate_code:t}});if(!s||s.length===0)return e.html(`
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
      `);const i=s[0];try{await r.update("certificates",{id:i.id},{verification_count:(i.verification_count||0)+1})}catch{}const n=i.start_date?new Date(i.start_date).toLocaleDateString("pt-BR"):void 0,o=i.completion_date?new Date(i.completion_date).toLocaleDateString("pt-BR"):void 0,l=i.generated_at?new Date(i.generated_at).toLocaleDateString("pt-BR"):new Date().toLocaleDateString("pt-BR");let u=[];if(i.course_modules)try{u=JSON.parse(i.course_modules).map(f=>f.title||f)}catch(a){console.log("Error parsing course_modules:",a)}if(u.length===0&&i.course_id)try{const a=await r.query("modules",{select:"title, order_index",filters:{course_id:i.course_id},order:"order_index ASC"});a&&a.length>0&&(u=a.map(f=>f.title))}catch(a){console.log("Error fetching modules:",a)}const d=u.length>0?`
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="text-sm font-bold text-gray-700 mb-3">
          <i class="fas fa-list-check mr-2 text-blue-600"></i>Módulos Concluídos:
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${u.map((a,f)=>`
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
                  <span class="text-xl font-bold text-gray-800">${i.user_name}</span>
                </div>
                <div>
                  <span class="text-sm text-gray-500 block">Curso</span>
                  <span class="text-lg font-semibold text-gray-800">${i.course_title}</span>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Carga Horária</span>
                <span class="text-lg font-bold text-blue-600">${i.carga_horaria||"N/A"} horas</span>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Data de Conclusão</span>
                <span class="text-lg font-bold text-blue-600">${o}</span>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Início do Curso</span>
                <span class="text-lg font-bold text-blue-600">${n||"&mdash;"}</span>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <span class="text-xs text-gray-500 block mb-1">Emissão do Certificado</span>
                <span class="text-lg font-bold text-blue-600">${l}</span>
              </div>
            </div>
            
            ${d}
            
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-gray-500 block mb-1">Código de Verificação</span>
                  <span class="text-sm font-mono font-bold text-gray-800">${i.certificate_code}</span>
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
                Este certificado foi verificado ${i.verification_count||1} vez(es)
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
    `)}catch(t){return console.error("Verify certificate error:",t),e.json({error:t.message||"Failed to verify certificate"},500)}});R.get("/api/verify/:code",async e=>{try{const t=e.req.param("code"),r=L(e),s=await r.query("certificates",{select:"*",filters:{certificate_code:t}});if(!s||s.length===0)return e.json({valid:!1,message:"Certificate not found"},404);const i=s[0];try{await r.update("certificates",{id:i.id},{verification_count:(i.verification_count||0)+1})}catch{}return e.json({valid:!0,certificate:{student_name:i.user_name,course_title:i.course_title,workload:i.carga_horaria,completion_date:i.completion_date,issued_at:i.issued_at,certificate_code:i.certificate_code,verification_count:(i.verification_count||0)+1}})}catch(t){return console.error("Verify certificate API error:",t),e.json({error:t.message||"Failed to verify certificate"},500)}});R.get("/api/admin/member-subscriptions",q,async e=>{try{const r=await L(e).query("member_subscriptions",{select:"*",order:"created_at DESC"});return e.json({subscriptions:r||[]})}catch(t){return console.error("List member subscriptions error:",t),e.json({error:t.message||"Failed to list member subscriptions"},500)}});R.get("/api/admin/suiteplus-subscriptions",q,async e=>{try{const t=e.env.DATABASE_SUITEPLUS;if(!t)return e.json({error:"DATABASE_SUITEPLUS não configurada"},500);const s=await new $e(t).sql(`SELECT id, user_email, product_id, started_at, expires_at, status, payment_source, recurring_enabled
       FROM user_subscriptions
       ORDER BY expires_at DESC`);return e.json({subscriptions:s})}catch(t){return console.error("SuitePlus subscriptions error:",t),e.json({error:t.message||"Erro ao buscar assinaturas SuitePlus"},500)}});R.get("/api/admin/member-subscriptions/find",q,async e=>{try{const t=e.req.query("email");if(!t)return e.json({error:"Email parameter is required"},400);const s=await L(e).query("member_subscriptions",{select:"*",filters:{email_membro:t}});return e.json({subscriptions:s||[]})}catch(t){return console.error("Find member subscription error:",t),e.json({error:t.message||"Failed to find member subscription"},500)}});R.post("/api/admin/member-subscriptions",q,async e=>{try{const t=await e.req.json();if(!t.email_membro)return e.json({error:"Email is required"},400);const s=await L(e).insert("member_subscriptions",{email_membro:t.email_membro,data_expiracao:t.data_expiracao||null,detalhe:t.detalhe||null,origem:t.origem||null,teste_gratis:t.teste_gratis||!1,ativo:t.ativo!==void 0?t.ativo:!0});return e.json({success:!0,subscription_id:s&&s.length>0?s[0].id:null})}catch(t){return console.error("Create member subscription error:",t),e.json({error:t.message||"Failed to create member subscription"},500)}});R.put("/api/admin/member-subscriptions/:id",q,async e=>{try{const t=e.req.param("id"),r=await e.req.json();return await L(e).update("member_subscriptions",{id:t},{email_membro:r.email_membro,data_expiracao:r.data_expiracao,detalhe:r.detalhe,origem:r.origem,teste_gratis:r.teste_gratis,ativo:r.ativo,updated_at:new Date().toISOString()}),e.json({success:!0})}catch(t){return console.error("Update member subscription error:",t),e.json({error:t.message||"Failed to update member subscription"},500)}});R.delete("/api/admin/member-subscriptions/:id",q,async e=>{try{const t=e.req.param("id");return await L(e).delete("member_subscriptions",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete user error:",t),e.json({error:t.message||"Failed to delete user"},500)}});R.get("/api/courses",async e=>{try{const t=L(e),r=V(e,"sb-access-token");let s=!1;if(r){const l=await K(r,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);l&&(s=await Yr(l.email,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY,r))}const i=s?{}:{is_published:!0},n=s?"":"WHERE c.is_published = true",o=await t.sql(`
      SELECT c.*,
             COUNT(DISTINCT m.id)::int AS modules_count,
             COUNT(l.id)::int          AS lessons_count
      FROM courses c
      LEFT JOIN modules m ON m.course_id = c.id
      LEFT JOIN lessons l ON l.module_id = m.id
      ${n}
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);return e.json({courses:o})}catch(t){return console.error("❌ /api/courses error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch courses"},500)}});R.get("/api/courses/:id/modules",async e=>{try{const t=e.req.param("id"),r=L(e),s=await r.query("courses",{select:"*",filters:{id:t},single:!0});if(!s)return e.json({error:"Course not found"},404);const i=await r.sql(`SELECT m.*,
              COUNT(l.id)::int AS lessons_count
       FROM modules m
       LEFT JOIN lessons l ON l.module_id = m.id
       WHERE m.course_id = $1
       GROUP BY m.id
       ORDER BY m.order_index`,[t]);return e.json({course:s,modules:i})}catch(t){return console.error("❌ /api/courses/:id/modules error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch course modules"},500)}});R.get("/api/courses/:id",async e=>{try{const t=e.req.param("id"),r=L(e),s=await r.query("courses",{select:"*",filters:{id:t},single:!0});if(!s)return e.json({error:"Course not found"},404);const i=await r.query("modules",{select:"*",filters:{course_id:t},order:"order_index"}),n=await r.sql(`SELECT l.* FROM lessons l
       JOIN modules m ON m.id = l.module_id
       WHERE m.course_id = $1
       ORDER BY m.order_index, l.order_index`,[t]),o=new Map;for(const l of n){const u=o.get(l.module_id)||[];u.push(l),o.set(l.module_id,u)}for(const l of i)l.lessons=o.get(l.id)||[];return e.json({course:s,modules:i})}catch(t){return console.error("❌ /api/courses/:id error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch course"},500)}});R.get("/api/search/lessons",G,async e=>{try{const t=e.get("user"),r=L(e);await Et(r);const s=(e.req.query("q")||"").trim(),i=e.req.query("course_id"),n=e.req.query("type")||"all",o=Math.max(parseInt(e.req.query("min_duration")||"0",10),0),l=Math.min(Math.max(parseInt(e.req.query("max_duration")||"999",10),o),999),u=Math.min(Math.max(parseInt(e.req.query("limit")||"80",10),1),120),d=e.req.query("sort")||"relevance",a=[t.email],f=["1=1"];let c=a.length+1;i&&(f.push(`co.id = $${c++}`),a.push(parseInt(i,10))),f.push(`COALESCE(l.duration_minutes, 0) BETWEEN $${c++} AND $${c++}`),a.push(o,l),n==="free"?f.push("(COALESCE(l.teste_gratis, false) = true OR COALESCE(l.free_trial, false) = true)"):n==="premium"?f.push("COALESCE(l.teste_gratis, false) = false AND COALESCE(l.free_trial, false) = false"):n==="rented"&&f.push("lr.lesson_id IS NOT NULL");const p=s.length>=2?s.split(/\s+/).filter(Boolean).slice(0,6):[];for(const x of p)f.push(`(
        l.title ILIKE $${c}
        OR COALESCE(l.description, '') ILIKE $${c}
        OR COALESCE(l.transcript, '') ILIKE $${c}
        OR m.title ILIKE $${c}
        OR co.title ILIKE $${c}
      )`),a.push(`%${x}%`),c++;const h=p[0]||"";a.push(h);const b=`$${c++}`;a.push(`%${s}%`);const v=`$${c++}`;a.push(u);const m=`$${c++}`;let y="relevance_score DESC, co.title ASC, m.order_index ASC, l.order_index ASC";d==="title"&&(y="l.title ASC"),d==="duration"&&(y="COALESCE(l.duration_minutes, 0) ASC, l.title ASC"),d==="date"&&(y="l.created_at DESC NULLS LAST, l.id DESC");const w=await r.sql(`
      SELECT l.id,
             l.title,
             l.description,
             l.duration_minutes,
             l.created_at,
             l.teste_gratis,
             l.free_trial,
             l.rentable,
             l.rental_credits,
             m.id AS module_id,
             m.title AS module_name,
             co.id AS course_id,
             co.title AS course_name,
             lr.lesson_id IS NOT NULL AS is_rented,
             CASE
               WHEN ${b} <> ''
                    AND COALESCE(l.transcript, '') ILIKE ('%' || ${b} || '%')
               THEN substring(
                 l.transcript
                 FROM GREATEST(1, strpos(lower(l.transcript), lower(${b})) - 80)
                 FOR 280
               )
               ELSE NULL
             END AS transcript_snippet,
             (
               CASE WHEN l.title ILIKE ${v} THEN 40 ELSE 0 END +
               CASE WHEN COALESCE(l.description, '') ILIKE ${v} THEN 12 ELSE 0 END +
               CASE WHEN m.title ILIKE ${v} THEN 8 ELSE 0 END +
               CASE WHEN co.title ILIKE ${v} THEN 6 ELSE 0 END +
               CASE WHEN COALESCE(l.transcript, '') ILIKE ${v} THEN 3 ELSE 0 END
             ) AS relevance_score
      FROM lessons l
      JOIN modules m ON m.id = l.module_id
      JOIN courses co ON co.id = m.course_id
      LEFT JOIN lesson_rentals lr
        ON lr.lesson_id = l.id
       AND lower(lr.user_email) = lower($1)
       AND lr.expires_at > NOW()
      WHERE ${f.join(" AND ")}
      ORDER BY ${y}
      LIMIT ${m}
    `,a);return e.json({lessons:w,limit:u})}catch(t){return console.error("❌ /api/search/lessons error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to search lessons"},500)}});R.get("/api/modules/:id/lessons",async e=>{try{const t=e.req.param("id"),s=await L(e).sql(`SELECT *
       FROM lessons
       WHERE module_id = $1
       ORDER BY order_index`,[t]);return e.json({lessons:s||[]})}catch(t){return console.error("❌ /api/modules/:id/lessons error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch module lessons"},500)}});R.get("/api/lessons/:id",async e=>{var t,r,s,i,n,o;try{const l=e.req.param("id"),u=V(e,"sb-access-token");let d=null;if(u){const w=await K(u,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);w&&(d=w.email)}const a=L(e);let f=!1,c=!1;if(d)try{if(f=!!((t=(await a.sql("SELECT user_has_lesson_access($1::text, $2::integer) AS has_access",[d,parseInt(l)]))[0])!=null&&t.has_access),console.log("Has access:",f,"User:",d,"Lesson:",l),!f){const x=e.env.DATABASE_SUITEPLUS,[O,A,g]=await Promise.all([a.sql("SELECT expires_at FROM lesson_rentals WHERE lower(user_email) = lower($1) AND lesson_id = $2 AND expires_at > NOW()",[d,parseInt(l)]),a.sql(`SELECT id FROM member_subscriptions
               WHERE lower(email_membro) = lower($1)
                 AND data_expiracao > NOW()
                 AND COALESCE(ativo, true) = true
                 AND COALESCE(teste_gratis, false) = false
               LIMIT 1`,[d]),x?xt(d,x):Promise.resolve(null)]);if((O.length>0||A.length>0||g&&g>new Date)&&(f=!0),!f){const E=await a.sql("SELECT rentable, rental_credits, title, COALESCE(teste_gratis, false) AS teste_gratis, COALESCE(free_trial, false) AS free_trial FROM lessons WHERE id = $1",[parseInt(l)]);if((r=E[0])!=null&&r.teste_gratis||(s=E[0])!=null&&s.free_trial)f=!0;else return console.log("❌ Access denied for user:",d,"lesson:",l),e.json({error:"Access denied",message:"Você não tem permissão para acessar esta aula.",needsUpgrade:!0,rentable:((i=E[0])==null?void 0:i.rentable)||!1,rental_credits:((n=E[0])==null?void 0:n.rental_credits)||0,lesson_title:((o=E[0])==null?void 0:o.title)||""},403)}}console.log("✅ Access granted for user:",d,"lesson:",l)}catch(w){console.error("❌ Error checking access via RPC:",w),console.log("⚠️ Allowing access due to RPC error (fallback mode)"),c=!0,f=!0}if(!d||!f&&!c){const w=await a.query("lessons",{select:"teste_gratis, free_trial",filters:{id:l},single:!0});if(!(w!=null&&w.teste_gratis)&&!(w!=null&&w.free_trial))return e.json({error:"Access denied",message:"Esta é uma aula premium. Faça login e tenha um plano ativo para acessar.",needsLogin:!0},403)}await _t(a);const p=`
      SELECT l.*, m.title as module_title, c.title as course_title, c.id as course_id
      FROM lessons l
      LEFT JOIN modules m ON l.module_id = m.id
      LEFT JOIN courses c ON m.course_id = c.id
      WHERE l.id = $1
    `,h=`
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
    `,[b,v,m]=await Promise.all([a.sql(p,[parseInt(l)]),a.sql("SELECT * FROM comments WHERE lesson_id = $1 ORDER BY created_at DESC",[l]),a.sql(h,[parseInt(l)])]);if(!b||b.length===0)return e.json({error:"Lesson not found"},404);const y=b[0];return e.json({lesson:y,comments:v,trails:m})}catch(l){return console.error("Error fetching lesson:",l),e.json({error:"Failed to fetch lesson"},500)}});R.get("/api/admin/comments",q,async e=>{try{const t=e.req.query("status")||"all",r=(e.req.query("search")||"").trim(),s=L(e);await _t(s);const i=[],n=[];t==="pending"?i.push("NULLIF(TRIM(COALESCE(c.admin_reply, '')), '') IS NULL"):t==="answered"&&i.push("NULLIF(TRIM(COALESCE(c.admin_reply, '')), '') IS NOT NULL"),r&&(n.push(`%${r}%`),i.push(`(
        c.comment_text ILIKE $${n.length}
        OR c.user_name ILIKE $${n.length}
        OR c.user_email ILIKE $${n.length}
        OR l.title ILIKE $${n.length}
        OR m.title ILIKE $${n.length}
        OR co.title ILIKE $${n.length}
      )`));const o=i.length?`WHERE ${i.join(" AND ")}`:"",l=await s.sql(`
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
    `,n);return e.json({comments:l})}catch(t){return console.error("List admin comments error:",t),e.json({error:t.message||"Failed to list comments"},500)}});R.put("/api/admin/comments/:id/reply",q,async e=>{try{const t=parseInt(e.req.param("id")),{admin_reply:r}=await e.req.json(),s=e.get("user"),i=String(r||"").trim(),n=L(e);await _t(n);const o=await n.update("comments",{id:t},{admin_reply:i||null,admin_replied_at:i?new Date().toISOString():null,admin_replied_by:i&&(s==null?void 0:s.email)||null});return e.json({success:!0,comment:o[0]||null})}catch(t){return console.error("Reply comment error:",t),e.json({error:t.message||"Failed to reply comment"},500)}});R.delete("/api/admin/comments/:id",q,async e=>{try{const t=parseInt(e.req.param("id")),r=L(e);return await _t(r),await r.delete("comments",{id:t}),e.json({success:!0})}catch(t){return console.error("Delete comment error:",t),e.json({error:t.message||"Failed to delete comment"},500)}});R.post("/api/lessons/:id/comments",async e=>{var t,r;try{const s=e.req.param("id"),{comment_text:i}=await e.req.json(),n=V(e,"sb-access-token");if(!n)return e.json({error:"Unauthorized"},401);const o=await K(n,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!o)return e.json({error:"Unauthorized"},401);if(!i||!i.trim())return e.json({error:"Comment text is required"},400);const l=((t=o.user_metadata)==null?void 0:t.full_name)||((r=o.email)==null?void 0:r.split("@")[0])||"Usuário",d=await L(e).insert("comments",{lesson_id:parseInt(s),user_name:l,user_email:o.email,comment_text:i.trim()});return e.json({success:!0,comment_id:d[0].id})}catch(s){return console.error("Add comment error:",s),e.json({error:s.message||"Failed to add comment"},500)}});R.get("/api/progress/:email/:courseId",async e=>{try{const t=e.req.param("email"),r=e.req.param("courseId"),n=await L(e).sql(`
      SELECT up.*, l.module_id
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      WHERE up.user_email = $1 AND m.course_id = $2
    `,[t,parseInt(r)]);return e.json({progress:n||[]})}catch(t){return console.error("❌ /api/progress error:",(t==null?void 0:t.message)||t),e.json({error:(t==null?void 0:t.message)||"Failed to fetch progress"},500)}});R.post("/api/progress/complete",async e=>{try{const{user_email:t,lesson_id:r}=await e.req.json();if(!t||!r)return e.json({error:"Missing required fields"},400);const s=L(e),i=await s.query("user_progress",{select:"*",filters:{user_email:t,lesson_id:r}});return i&&i.length>0?await s.update("user_progress",{id:i[0].id},{completed:!0,completed_at:new Date().toISOString()}):await s.insert("user_progress",{user_email:t,lesson_id:parseInt(r),completed:!0,completed_at:new Date().toISOString()}),e.json({success:!0})}catch{return e.json({error:"Failed to update progress"},500)}});R.post("/api/progress/uncomplete",async e=>{try{const{user_email:t,lesson_id:r}=await e.req.json();if(!t||!r)return e.json({error:"Missing required fields"},400);const s=L(e),i=await s.query("user_progress",{select:"*",filters:{user_email:t,lesson_id:r}});return i&&i.length>0&&await s.delete("user_progress",{id:i[0].id}),e.json({success:!0})}catch{return e.json({error:"Failed to update progress"},500)}});R.post("/api/admin/certificate-template",q,async e=>{try{const t=await e.req.json(),{course_id:r,image_data:s,verso_data:i}=t;if(!r||!s)return e.json({error:"ID do curso e imagem da frente são obrigatórios"},400);const n=b=>{const v=b.match(/^data:([^;]+);base64,/);return v?v[1]:"image/jpeg"},o=b=>b.includes(",")?b.split(",")[1]:b,l=n(s),u=o(s),d=i?n(i):null,a=i?o(i):null,f=`/api/certificate-template/${r}/image`,c=i?`/api/certificate-template/${r}/verso`:null,p=L(e),h=await p.query("certificate_templates",{select:"*",filters:{course_id:r}});if(h&&h.length>0){const b={template_url:f,template_data:u,template_mime:l,updated_at:new Date().toISOString()};i!==void 0&&(b.verso_data=a,b.verso_mime=d),await p.update("certificate_templates",{id:h[0].id},b)}else await p.insert("certificate_templates",{course_id:parseInt(r),template_url:f,template_data:u,template_mime:l,verso_data:a,verso_mime:d,created_at:new Date().toISOString(),updated_at:new Date().toISOString()});return console.log("✅ Certificate template saved to Postgres"),e.json({success:!0,template_url:f,verso_url:c,message:"Template de certificado salvo com sucesso!"})}catch(t){return console.error("💥 Certificate template error:",t),e.json({error:"Erro ao salvar template de certificado",details:t.message},500)}});R.get("/api/certificate-template/:courseId/image",async e=>{try{const t=e.req.param("courseId"),s=await L(e).query("certificate_templates",{select:"template_data, template_mime",filters:{course_id:t},single:!0});if(!(s!=null&&s.template_data))return e.json({error:"Imagem não encontrada"},404);const i=Uint8Array.from(atob(s.template_data),n=>n.charCodeAt(0));return new Response(i,{headers:{"Content-Type":s.template_mime||"image/jpeg","Cache-Control":"public, max-age=86400"}})}catch{return e.json({error:"Erro ao buscar imagem"},500)}});R.get("/api/certificate-template/:courseId/verso",async e=>{try{const t=e.req.param("courseId"),s=await L(e).query("certificate_templates",{select:"verso_data, verso_mime",filters:{course_id:t},single:!0});if(!(s!=null&&s.verso_data))return e.json({error:"Verso não encontrado"},404);const i=Uint8Array.from(atob(s.verso_data),n=>n.charCodeAt(0));return new Response(i,{headers:{"Content-Type":s.verso_mime||"image/jpeg","Cache-Control":"public, max-age=86400"}})}catch{return e.json({error:"Erro ao buscar verso"},500)}});R.get("/api/certificate-template/:courseId",async e=>{try{const t=e.req.param("courseId"),r=L(e),s=await r.query("certificate_templates",{select:"id, course_id, template_mime, verso_mime, created_at, updated_at",filters:{course_id:t},single:!0});if(s){s.template_url=`/api/certificate-template/${t}/image`;const i=await r.query("certificate_templates",{select:"verso_data",filters:{course_id:t},single:!0});s.verso_url=i!=null&&i.verso_data?`/api/certificate-template/${t}/verso`:null}return e.json({template:s})}catch{return e.json({template:null})}});R.post("/api/certificates/generate",async e=>{var t,r,s;try{const i=V(e,"sb-access-token");if(!i)return e.json({error:"Não autenticado"},401);const n=await K(i,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!n)return e.json({error:"Usuário não encontrado"},401);const{course_id:o}=await e.req.json();if(console.log("📜 Certificate generation request:",{user_email:n.email,course_id:o}),!o)return e.json({error:"ID do curso é obrigatório"},400);const l=L(e),u=await l.query("certificates",{select:"*",filters:{user_email:n.email,course_id:o}});if(u&&u.length>0)return console.log("✅ Certificate already exists"),e.json({success:!0,certificate:u[0],message:"Certificado já existe!"});const d=await l.query("courses",{select:"*",filters:{id:o},single:!0});if(!d)return e.json({error:"Curso não encontrado"},404);const a=await l.query("modules",{select:"*",filters:{course_id:o}});let f=[];if(a)for(const x of a){const O=await l.query("lessons",{select:"id",filters:{module_id:x.id}});O&&(f=[...f,...O.map(A=>A.id)])}if(f.length===0)return e.json({error:"Curso não possui aulas"},400);const p=(await l.query("user_progress",{select:"*",filters:{user_email:n.email}})||[]).filter(x=>x.completed&&f.includes(x.lesson_id)),h=p.map(x=>x.lesson_id),b=h.length/f.length*100;if(console.log("📊 Course completion:",{total_lessons:f.length,completed_lessons:h.length,percentage:b}),b<100)return e.json({error:"Você precisa completar 100% do curso para receber o certificado",completion:b},400);const v=p.map(x=>x.completed_at).filter(x=>!!x).sort(),m=v[0]||new Date().toISOString(),y=v[v.length-1]||new Date().toISOString();if(d.min_completion_days){const x=(new Date(y).getTime()-new Date(m).getTime())/864e5;if(x<d.min_completion_days)return console.log("⏳ Certificate blocked: minimum completion period not met",{days_elapsed:x,min_days_required:d.min_completion_days}),e.json({error:`Este curso exige um prazo mínimo de ${d.min_completion_days} dia(s) entre a primeira e a última aula concluída. Você concluiu em ${x.toFixed(1)} dia(s). Continue acessando o curso normalmente — o certificado ficará disponível assim que o prazo mínimo for atingido.`,days_elapsed:x,min_days_required:d.min_completion_days},400)}const w=await l.insert("certificates",{user_email:n.email,user_name:((t=n.user_metadata)==null?void 0:t.name)||"Aluno",course_id:parseInt(o),course_title:d.title,carga_horaria:d.duration_hours||null,issued_at:new Date().toISOString(),start_date:m,completion_date:y});return console.log("✅ Certificate generated successfully"),e.json({success:!0,certificate:w,message:"Parabéns! Seu certificado foi gerado com sucesso!"})}catch(i){return console.error("💥 Certificate generation error:",i),console.error("Error details:",i.message),(r=i.message)!=null&&r.includes("certificates")||(s=i.message)!=null&&s.includes("relation")?e.json({error:"Tabela de certificados não encontrada. Execute a migração SQL no Supabase.",details:i.message},500):e.json({error:"Erro ao gerar certificado",details:i.message},500)}});R.get("/api/certificates",async e=>{try{const t=V(e,"sb-access-token");if(!t)return e.json({error:"Não autenticado"},401);const r=await K(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({error:"Usuário não encontrado"},401);const s=L(e),i=await s.query("certificates",{select:"*",filters:{user_email:r.email},order:"issued_at DESC"})||[],n=await Promise.all(i.map(async o=>{const l=await s.query("certificate_templates",{select:"*",filters:{course_id:o.course_id},single:!0});return{...o,template_url:(l==null?void 0:l.template_url)||null}}));return e.json({certificates:n})}catch(t){return console.error("💥 Certificates fetch error:",t),e.json({error:"Erro ao buscar certificados"},500)}});R.get("/api/certificates/:id",async e=>{try{const t=e.req.param("id"),r=L(e),s=await r.query("certificates",{select:"*",filters:{id:t},single:!0});if(!s)return e.json({error:"Certificado não encontrado"},404);const i=await r.query("certificate_templates",{select:"*",filters:{course_id:s.course_id},single:!0});return e.json({certificate:{...s,template_url:(i==null?void 0:i.template_url)||null}})}catch{return e.json({error:"Erro ao buscar certificado"},500)}});R.get("/api/plans",async e=>{try{const r=await L(e).query("plans",{select:"*",filters:{is_active:!0},order:"display_order"})||[];return e.json({plans:r})}catch{return e.json({error:"Erro ao buscar planos"},500)}});R.get("/api/subscriptions/current",async e=>{try{const t=V(e,"sb-access-token");if(!t)return e.json({subscription:null});const r=await K(t,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!r)return e.json({subscription:null});const n=await L(e).sql(`
      SELECT s.*, p.name as plan_name, p.monthly_price, p.duration_days
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_email = $1 AND s.status = 'active'
      ORDER BY s.end_date DESC
      LIMIT 1
    `,[r.email]);return e.json({subscription:n&&n.length>0?n[0]:null})}catch(t){return console.error("Error fetching subscription:",t),e.json({subscription:null})}});R.post("/api/admin/subscriptions",q,async e=>{try{const{user_email:t,plan_id:r,duration_days:s}=await e.req.json();if(!t||!r)return e.json({error:"Email e plano são obrigatórios"},400);const i=L(e),n=await i.query("plans",{select:"*",filters:{id:r},single:!0});if(!n)return e.json({error:"Plano não encontrado"},404);const o=new Date;o.setDate(o.getDate()+(s||n.duration_days));const l=o.toISOString(),u=await i.insert("member_subscriptions",{email_membro:t,data_expiracao:l,detalhe:n.name,origem:"admin",teste_gratis:n.is_free_trial||!1,ativo:!0}),d=await i.query("users",{select:"id",filters:{email:t},single:!0});return d&&await i.update("users",{id:d.id},{dt_expiracao:l,updated_at:new Date().toISOString()}),e.json({success:!0,message:"Assinatura criada com sucesso!",subscription:u[0]})}catch(t){return console.error("Error creating subscription:",t),e.json({error:"Erro ao criar assinatura"},500)}});R.get("/api/lessons/:id/access",async e=>{var t;try{const r=e.req.param("id"),s=V(e,"sb-access-token");if(!s){const d=await L(e).query("lessons",{select:"teste_gratis, free_trial",filters:{id:r},single:!0}),a=!!(d!=null&&d.teste_gratis||d!=null&&d.free_trial);return e.json({hasAccess:a,reason:a?"free_lesson":"not_authenticated"})}const i=await K(s,e.env.SUPABASE_URL,e.env.SUPABASE_ANON_KEY);if(!i)return e.json({hasAccess:!1,reason:"invalid_token"});const n=L(e);let l=!!((t=(await n.sql("SELECT user_has_lesson_access($1::text, $2::integer) AS has_access",[i.email,parseInt(r)]))[0])!=null&&t.has_access);if(!l){const[u,d]=await Promise.all([n.sql(`SELECT id FROM member_subscriptions
           WHERE lower(email_membro) = lower($1)
             AND data_expiracao > NOW()
             AND COALESCE(ativo, true) = true
             AND COALESCE(teste_gratis, false) = false
           LIMIT 1`,[i.email]),n.sql(`SELECT expires_at FROM lesson_rentals
           WHERE lower(user_email) = lower($1)
             AND lesson_id = $2
             AND expires_at > NOW()
           LIMIT 1`,[i.email,parseInt(r)])]);(u.length>0||d.length>0)&&(l=!0)}if(!l){const u=e.env.DATABASE_SUITEPLUS;if(u){const d=await xt(i.email,u);d&&d>new Date&&(l=!0)}}if(!l){const u=await n.query("lessons",{select:"teste_gratis, free_trial",filters:{id:r},single:!0});if(u!=null&&u.teste_gratis||u!=null&&u.free_trial)return e.json({hasAccess:!0,reason:"free_lesson"})}return e.json({hasAccess:l,reason:l?"active_subscription":"no_active_subscription"})}catch(r){return console.error("Error checking lesson access:",r),e.json({hasAccess:!1,reason:"error"},500)}});R.post("/api/admin/subscriptions/expire",q,async e=>{try{return await L(e).rpc("expire_subscriptions",{}),e.json({success:!0,message:"Assinaturas expiradas com sucesso!"})}catch(t){return console.error("Error expiring subscriptions:",t),e.json({error:"Erro ao expirar assinaturas"},500)}});R.get("/api/admin/plans",q,async e=>{try{const r=await L(e).query("plans",{select:"*",order:"display_order"})||[];return e.json({plans:r})}catch{return e.json({error:"Erro ao buscar planos"},500)}});R.post("/api/admin/plans",q,async e=>{try{const t=await e.req.json(),{id:r,name:s,description:i,price:n,duration_days:o,is_active:l,is_free_trial:u,features:d,display_order:a}=t,f=L(e);if(r)return await f.update("plans",{id:r},{name:s,description:i,price:parseFloat(n),duration_days:parseInt(o),is_active:l,is_free_trial:u,features:d||[],display_order:parseInt(a||0),updated_at:new Date().toISOString()}),e.json({success:!0,message:"Plano atualizado!"});{const c=await f.insert("plans",{name:s,description:i,price:parseFloat(n),duration_days:parseInt(o),is_active:l,is_free_trial:u,features:d||[],display_order:parseInt(a||0)});return e.json({success:!0,plan:c[0],message:"Plano criado!"})}}catch(t){return console.error("Error saving plan:",t),e.json({error:"Erro ao salvar plano"},500)}});R.get("/api/admin/subscriptions",q,async e=>{try{const t=L(e),r=await t.query("subscriptions",{select:"*",order:"created_at DESC"})||[],s=await Promise.all(r.map(async i=>{const n=await t.query("plans",{select:"*",filters:{id:i.plan_id},single:!0});return{...i,plan_name:(n==null?void 0:n.name)||"Desconhecido"}}));return e.json({subscriptions:s})}catch{return e.json({error:"Erro ao buscar assinaturas"},500)}});R.get("/recover",e=>e.html(`
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
  `));R.get("/reset-password",e=>e.html(`
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
  `));R.get("/test-continue",e=>e.html(`
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
  `));R.get("/admin",e=>e.html(`<!DOCTYPE html>
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
  <script src="/static/admin.js?v=10"><\/script>
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
</html>`));R.get("/aula/:id",e=>e.redirect(`/?aula=${e.req.param("id")}`));R.get("/curso/:id",e=>e.redirect(`/?curso=${e.req.param("id")}`));R.get("/",e=>e.html(`
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
        <script defer src="/static/admin.js?v=10"><\/script>
        <script defer src="/static/access-control.js?v=4"><\/script>
        <script defer src="/static/app.js?v=23"><\/script>
        <script defer src="/static/search.js?v=5"><\/script>
    </body>
    </html>
  `));R.get("/course/:courseId",e=>{const t=e.req.param("courseId");return e.html(`<!DOCTYPE html>
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
</html>`)});R.get("/lesson/:lessonId",e=>{const t=e.req.param("lessonId");return e.html(`<!DOCTYPE html>
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
</html>`)});R.get("/api/favorites",G,async e=>{const t=e.get("user"),r=L(e);try{const s=await r.sql(`
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
    `,[t.email]);return e.json(s)}finally{await r.end()}});R.post("/api/favorites",G,async e=>{const t=e.get("user"),r=await e.req.json();if(!r.lesson_id)return e.json({error:"lesson_id required"},400);const s=L(e);try{return await s.sql("INSERT INTO user_favorites (user_email, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",[t.email,r.lesson_id]),e.json({ok:!0})}finally{await s.end()}});R.delete("/api/favorites/:lessonId",G,async e=>{const t=e.get("user"),r=parseInt(e.req.param("lessonId")),s=L(e);try{return await s.sql("DELETE FROM user_favorites WHERE user_email = $1 AND lesson_id = $2",[t.email,r]),e.json({ok:!0})}finally{await s.end()}});R.get("/api/favorites/check/:lessonId",G,async e=>{const t=e.get("user"),r=parseInt(e.req.param("lessonId")),s=L(e);try{const i=await s.sql("SELECT id FROM user_favorites WHERE user_email = $1 AND lesson_id = $2 LIMIT 1",[t.email,r]);return e.json({favorite:i.length>0})}finally{await s.end()}});R.get("/favorites",e=>e.html(`
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
                <a href="/aula/\${f.lesson_id}"
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
  `));R.get("/certificates",e=>e.html(`
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

            <!-- In Progress Courses Grid -->
            <div id="inProgressSection" class="hidden mt-10">
                <h3 class="text-xl font-bold text-gray-800 mb-4">
                    <i class="fas fa-hourglass-half text-blue-500 mr-2"></i>
                    Cursos em Andamento
                </h3>
                <div id="inProgressGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- In-progress course cards will be loaded here -->
                </div>
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

        // Load certificates + in-progress courses
        async function loadCertificates() {
            try {
                const [certResponse, progressResponse] = await Promise.all([
                    axios.get('/api/my-certificates'),
                    axios.get('/api/my-courses-progress').catch(() => ({ data: { courses: [] } }))
                ])

                const certificates = certResponse.data.certificates || []
                const coursesProgress = progressResponse.data.courses || []

                document.getElementById('loadingDiv').classList.add('hidden')

                // Courses that don't have a certificate yet
                const inProgressCourses = coursesProgress.filter(course => !course.certificate_id)

                if (certificates.length === 0 && inProgressCourses.length === 0) {
                    document.getElementById('emptyState').classList.remove('hidden')
                    return
                }

                if (certificates.length > 0) {
                    renderCertificates(certificates)
                }

                if (inProgressCourses.length > 0) {
                    renderInProgressCourses(inProgressCourses)
                }
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

        // Render courses in progress (no certificate yet) with a "Gerar Certificado" button
        function renderInProgressCourses(courses) {
            const section = document.getElementById('inProgressSection')
            const grid = document.getElementById('inProgressGrid')
            section.classList.remove('hidden')

            grid.innerHTML = courses.map(course => {
                const total = course.total_lessons || 0
                const completed = course.completed_lessons || 0
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0
                const cardId = 'course-card-' + course.course_id

                return \`
                    <div id="\${cardId}" class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                        <div class="bg-gradient-to-r from-gray-600 to-gray-700 p-6 text-white">
                            <div class="flex items-center gap-2 mb-2">
                                <i class="fas fa-hourglass-half text-xl"></i>
                                <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                                    Em andamento
                                </span>
                            </div>
                            <h3 class="text-xl font-bold mb-1">\${course.course_title}</h3>
                            <p class="text-gray-200 text-sm">\${completed}/\${total} aulas concluídas</p>
                        </div>

                        <div class="p-6">
                            <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
                                <div class="bg-blue-600 h-3 rounded-full transition-all" style="width: \${percent}%"></div>
                            </div>
                            <p class="text-sm text-gray-600 mb-4">\${percent}% concluído</p>

                            <div id="msg-\${course.course_id}" class="hidden mb-4"></div>

                            <button id="btn-\${course.course_id}" onclick="generateCertificateFor(\${course.course_id})"
                                class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                <i class="fas fa-certificate"></i>
                                Gerar Certificado
                            </button>
                        </div>
                    </div>
                \`
            }).join('')
        }

        // Attempt to generate certificate for a specific course, showing success or error inline
        async function generateCertificateFor(courseId) {
            const btn = document.getElementById('btn-' + courseId)
            const msgDiv = document.getElementById('msg-' + courseId)

            btn.disabled = true
            btn.classList.add('opacity-50', 'cursor-not-allowed')

            try {
                const response = await axios.post('/api/certificates/generate', { course_id: courseId })

                if (response.data.success) {
                    msgDiv.className = 'mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm'
                    msgDiv.innerHTML = '<i class="fas fa-check-circle mr-1"></i> ' + (response.data.message || 'Certificado gerado com sucesso!')
                    msgDiv.classList.remove('hidden')

                    // Reload the whole list after a short delay so the new certificate card appears
                    setTimeout(() => loadCertificates(), 1500)
                }
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Não foi possível gerar o certificado.'
                msgDiv.className = 'mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'
                msgDiv.innerHTML = '<i class="fas fa-exclamation-circle mr-1"></i> ' + errorMessage
                msgDiv.classList.remove('hidden')

                btn.disabled = false
                btn.classList.remove('opacity-50', 'cursor-not-allowed')
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
  `));R.get("/profile",e=>e.html(`
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
  `));R.get("/certificates",e=>e.html(`
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
  `));const Ds=new Zi,Mo=Object.assign({"/src/index.tsx":R});let on=!1;for(const[,e]of Object.entries(Mo))e&&(Ds.all("*",t=>{let r;try{r=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,r)}),Ds.notFound(t=>{let r;try{r=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,r)}),on=!0);if(!on)throw new Error("Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']");var lr={exports:{}},cr={exports:{}},Pe={},ur={},js;function an(){if(js)return ur;js=1,ur.parse=function(r,s){return new e(r,s).parse()};class e{constructor(s,i){this.source=s,this.transform=i||t,this.position=0,this.entries=[],this.recorded=[],this.dimension=0}isEof(){return this.position>=this.source.length}nextCharacter(){var s=this.source[this.position++];return s==="\\"?{value:this.source[this.position++],escaped:!0}:{value:s,escaped:!1}}record(s){this.recorded.push(s)}newEntry(s){var i;(this.recorded.length>0||s)&&(i=this.recorded.join(""),i==="NULL"&&!s&&(i=null),i!==null&&(i=this.transform(i)),this.entries.push(i),this.recorded=[])}consumeDimensions(){if(this.source[0]==="[")for(;!this.isEof();){var s=this.nextCharacter();if(s.value==="=")break}}parse(s){var i,n,o;for(this.consumeDimensions();!this.isEof();)if(i=this.nextCharacter(),i.value==="{"&&!o)this.dimension++,this.dimension>1&&(n=new e(this.source.substr(this.position-1),this.transform),this.entries.push(n.parse(!0)),this.position+=n.position-2);else if(i.value==="}"&&!o){if(this.dimension--,!this.dimension&&(this.newEntry(),s))return this.entries}else i.value==='"'&&!i.escaped?(o&&this.newEntry(!0),o=!o):i.value===","&&!o?this.newEntry():this.record(i.value);if(this.dimension!==0)throw new Error("array dimension not balanced");return this.entries}}function t(r){return r}return ur}var dr,ks;function ln(){if(ks)return dr;ks=1;var e=an();return dr={create:function(t,r){return{parse:function(){return e.parse(t,r)}}}},dr}var fr,Bs;function Uo(){if(Bs)return fr;Bs=1;var e=/(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/,t=/^(\d{1,})-(\d{2})-(\d{2})( BC)?$/,r=/([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/,s=/^-?infinity$/;fr=function(d){if(s.test(d))return Number(d.replace("i","I"));var a=e.exec(d);if(!a)return i(d)||null;var f=!!a[8],c=parseInt(a[1],10);f&&(c=o(c));var p=parseInt(a[2],10)-1,h=a[3],b=parseInt(a[4],10),v=parseInt(a[5],10),m=parseInt(a[6],10),y=a[7];y=y?1e3*parseFloat(y):0;var w,x=n(d);return x!=null?(w=new Date(Date.UTC(c,p,h,b,v,m,y)),l(c)&&w.setUTCFullYear(c),x!==0&&w.setTime(w.getTime()-x)):(w=new Date(c,p,h,b,v,m,y),l(c)&&w.setFullYear(c)),w};function i(u){var d=t.exec(u);if(d){var a=parseInt(d[1],10),f=!!d[4];f&&(a=o(a));var c=parseInt(d[2],10)-1,p=d[3],h=new Date(a,c,p);return l(a)&&h.setFullYear(a),h}}function n(u){if(u.endsWith("+00"))return 0;var d=r.exec(u.split(" ")[1]);if(d){var a=d[1];if(a==="Z")return 0;var f=a==="-"?-1:1,c=parseInt(d[2],10)*3600+parseInt(d[3]||0,10)*60+parseInt(d[4]||0,10);return c*f*1e3}}function o(u){return-(u-1)}function l(u){return u>=0&&u<100}return fr}var pr,Ms;function Fo(){if(Ms)return pr;Ms=1,pr=t;var e=Object.prototype.hasOwnProperty;function t(r){for(var s=1;s<arguments.length;s++){var i=arguments[s];for(var n in i)e.call(i,n)&&(r[n]=i[n])}return r}return pr}var mr,Us;function Ho(){if(Us)return mr;Us=1;var e=Fo();mr=t;function t(v){if(!(this instanceof t))return new t(v);e(this,b(v))}var r=["seconds","minutes","hours","days","months","years"];t.prototype.toPostgres=function(){var v=r.filter(this.hasOwnProperty,this);return this.milliseconds&&v.indexOf("seconds")<0&&v.push("seconds"),v.length===0?"0":v.map(function(m){var y=this[m]||0;return m==="seconds"&&this.milliseconds&&(y=(y+this.milliseconds/1e3).toFixed(6).replace(/\.?0+$/,"")),y+" "+m},this).join(" ")};var s={years:"Y",months:"M",days:"D",hours:"H",minutes:"M",seconds:"S"},i=["years","months","days"],n=["hours","minutes","seconds"];t.prototype.toISOString=t.prototype.toISO=function(){var v=i.map(y,this).join(""),m=n.map(y,this).join("");return"P"+v+"T"+m;function y(w){var x=this[w]||0;return w==="seconds"&&this.milliseconds&&(x=(x+this.milliseconds/1e3).toFixed(6).replace(/0+$/,"")),x+s[w]}};var o="([+-]?\\d+)",l=o+"\\s+years?",u=o+"\\s+mons?",d=o+"\\s+days?",a="([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?",f=new RegExp([l,u,d,a].map(function(v){return"("+v+")?"}).join("\\s*")),c={years:2,months:4,days:6,hours:9,minutes:10,seconds:11,milliseconds:12},p=["hours","minutes","seconds","milliseconds"];function h(v){var m=v+"000000".slice(v.length);return parseInt(m,10)/1e3}function b(v){if(!v)return{};var m=f.exec(v),y=m[8]==="-";return Object.keys(c).reduce(function(w,x){var O=c[x],A=m[O];return!A||(A=x==="milliseconds"?h(A):parseInt(A,10),!A)||(y&&~p.indexOf(x)&&(A*=-1),w[x]=A),w},{})}return mr}var hr,Fs;function $o(){if(Fs)return hr;Fs=1;var e=Buffer.from||Buffer;return hr=function(r){if(/^\\x/.test(r))return e(r.substr(2),"hex");for(var s="",i=0;i<r.length;)if(r[i]!=="\\")s+=r[i],++i;else if(/[0-7]{3}/.test(r.substr(i+1,3)))s+=String.fromCharCode(parseInt(r.substr(i+1,3),8)),i+=4;else{for(var n=1;i+n<r.length&&r[i+n]==="\\";)n++;for(var o=0;o<Math.floor(n/2);++o)s+="\\";i+=Math.floor(n/2)*2}return e(s,"binary")},hr}var gr,Hs;function zo(){if(Hs)return gr;Hs=1;var e=an(),t=ln(),r=Uo(),s=Ho(),i=$o();function n(g){return function(_){return _===null?_:g(_)}}function o(g){return g===null?g:g==="TRUE"||g==="t"||g==="true"||g==="y"||g==="yes"||g==="on"||g==="1"}function l(g){return g?e.parse(g,o):null}function u(g){return parseInt(g,10)}function d(g){return g?e.parse(g,n(u)):null}function a(g){return g?e.parse(g,n(function(E){return y(E).trim()})):null}var f=function(g){if(!g)return null;var E=t.create(g,function(_){return _!==null&&(_=x(_)),_});return E.parse()},c=function(g){if(!g)return null;var E=t.create(g,function(_){return _!==null&&(_=parseFloat(_)),_});return E.parse()},p=function(g){if(!g)return null;var E=t.create(g);return E.parse()},h=function(g){if(!g)return null;var E=t.create(g,function(_){return _!==null&&(_=r(_)),_});return E.parse()},b=function(g){if(!g)return null;var E=t.create(g,function(_){return _!==null&&(_=s(_)),_});return E.parse()},v=function(g){return g?e.parse(g,n(i)):null},m=function(g){return parseInt(g,10)},y=function(g){var E=String(g);return/^\d+$/.test(E)?E:g},w=function(g){return g?e.parse(g,n(JSON.parse)):null},x=function(g){return g[0]!=="("?null:(g=g.substring(1,g.length-1).split(","),{x:parseFloat(g[0]),y:parseFloat(g[1])})},O=function(g){if(g[0]!=="<"&&g[1]!=="(")return null;for(var E="(",_="",T=!1,C=2;C<g.length-1;C++){if(T||(E+=g[C]),g[C]===")"){T=!0;continue}else if(!T)continue;g[C]!==","&&(_+=g[C])}var I=x(E);return I.radius=parseFloat(_),I},A=function(g){g(20,y),g(21,m),g(23,m),g(26,m),g(700,parseFloat),g(701,parseFloat),g(16,o),g(1082,r),g(1114,r),g(1184,r),g(600,x),g(651,p),g(718,O),g(1e3,l),g(1001,v),g(1005,d),g(1007,d),g(1028,d),g(1016,a),g(1017,f),g(1021,c),g(1022,c),g(1231,c),g(1014,p),g(1015,p),g(1008,p),g(1009,p),g(1040,p),g(1041,p),g(1115,h),g(1182,h),g(1185,h),g(1186,s),g(1187,b),g(17,i),g(114,JSON.parse.bind(JSON)),g(3802,JSON.parse.bind(JSON)),g(199,w),g(3807,w),g(3907,p),g(2951,p),g(791,p),g(1183,p),g(1270,p)};return gr={init:A},gr}var br,$s;function Wo(){if($s)return br;$s=1;var e=1e6;function t(r){var s=r.readInt32BE(0),i=r.readUInt32BE(4),n="";s<0&&(s=~s+(i===0),i=~i+1>>>0,n="-");var o="",l,u,d,a,f,c;{if(l=s%e,s=s/e>>>0,u=4294967296*l+i,i=u/e>>>0,d=""+(u-e*i),i===0&&s===0)return n+d+o;for(a="",f=6-d.length,c=0;c<f;c++)a+="0";o=a+d+o}{if(l=s%e,s=s/e>>>0,u=4294967296*l+i,i=u/e>>>0,d=""+(u-e*i),i===0&&s===0)return n+d+o;for(a="",f=6-d.length,c=0;c<f;c++)a+="0";o=a+d+o}{if(l=s%e,s=s/e>>>0,u=4294967296*l+i,i=u/e>>>0,d=""+(u-e*i),i===0&&s===0)return n+d+o;for(a="",f=6-d.length,c=0;c<f;c++)a+="0";o=a+d+o}return l=s%e,u=4294967296*l+i,d=""+u%e,n+d+o}return br=t,br}var yr,zs;function Vo(){if(zs)return yr;zs=1;var e=Wo(),t=function(p,h,b,v,m){b=b||0,v=v||!1,m=m||function(T,C,I){return T*Math.pow(2,I)+C};var y=b>>3,w=function(T){return v?~T&255:T},x=255,O=8-b%8;h<O&&(x=255<<8-h&255,O=h),b&&(x=x>>b%8);var A=0;b%8+h>=8&&(A=m(0,w(p[y])&x,O));for(var g=h+b>>3,E=y+1;E<g;E++)A=m(A,w(p[E]),8);var _=(h+b)%8;return _>0&&(A=m(A,w(p[g])>>8-_,_)),A},r=function(p,h,b){var v=Math.pow(2,b-1)-1,m=t(p,1),y=t(p,b,1);if(y===0)return 0;var w=1,x=function(A,g,E){A===0&&(A=1);for(var _=1;_<=E;_++)w/=2,(g&1<<E-_)>0&&(A+=w);return A},O=t(p,h,b+1,!1,x);return y==Math.pow(2,b+1)-1?O===0?m===0?1/0:-1/0:NaN:(m===0?1:-1)*Math.pow(2,y-v)*O},s=function(p){return t(p,1)==1?-1*(t(p,15,1,!0)+1):t(p,15,1)},i=function(p){return t(p,1)==1?-1*(t(p,31,1,!0)+1):t(p,31,1)},n=function(p){return r(p,23,8)},o=function(p){return r(p,52,11)},l=function(p){var h=t(p,16,32);if(h==49152)return NaN;for(var b=Math.pow(1e4,t(p,16,16)),v=0,m=t(p,16),y=0;y<m;y++)v+=t(p,16,64+16*y)*b,b/=1e4;var w=Math.pow(10,t(p,16,48));return(h===0?1:-1)*Math.round(v*w)/w},u=function(p,h){var b=t(h,1),v=t(h,63,1),m=new Date((b===0?1:-1)*v/1e3+9466848e5);return p||m.setTime(m.getTime()+m.getTimezoneOffset()*6e4),m.usec=v%1e3,m.getMicroSeconds=function(){return this.usec},m.setMicroSeconds=function(y){this.usec=y},m.getUTCMicroSeconds=function(){return this.usec},m},d=function(p){var h=t(p,32);t(p,32,32);for(var b=t(p,32,64),v=96,m=[],y=0;y<h;y++)m[y]=t(p,32,v),v+=32,v+=32;var w=function(O){var A=t(p,32,v);if(v+=32,A==4294967295)return null;var g;if(O==23||O==20)return g=t(p,A*8,v),v+=A*8,g;if(O==25)return g=p.toString(this.encoding,v>>3,(v+=A<<3)>>3),g;console.log("ERROR: ElementType not implemented: "+O)},x=function(O,A){var g=[],E;if(O.length>1){var _=O.shift();for(E=0;E<_;E++)g[E]=x(O,A);O.unshift(_)}else for(E=0;E<O[0];E++)g[E]=w(A);return g};return x(m,b)},a=function(p){return p.toString("utf8")},f=function(p){return p===null?null:t(p,8)>0},c=function(p){p(20,e),p(21,s),p(23,i),p(26,i),p(1700,l),p(700,n),p(701,o),p(16,f),p(1114,u.bind(null,!1)),p(1184,u.bind(null,!0)),p(1e3,d),p(1007,d),p(1016,d),p(1008,d),p(1009,d),p(25,a)};return yr={init:c},yr}var vr,Ws;function Qo(){return Ws||(Ws=1,vr={BOOL:16,BYTEA:17,CHAR:18,INT8:20,INT2:21,INT4:23,REGPROC:24,TEXT:25,OID:26,TID:27,XID:28,CID:29,JSON:114,XML:142,PG_NODE_TREE:194,SMGR:210,PATH:602,POLYGON:604,CIDR:650,FLOAT4:700,FLOAT8:701,ABSTIME:702,RELTIME:703,TINTERVAL:704,CIRCLE:718,MACADDR8:774,MONEY:790,MACADDR:829,INET:869,ACLITEM:1033,BPCHAR:1042,VARCHAR:1043,DATE:1082,TIME:1083,TIMESTAMP:1114,TIMESTAMPTZ:1184,INTERVAL:1186,TIMETZ:1266,BIT:1560,VARBIT:1562,NUMERIC:1700,REFCURSOR:1790,REGPROCEDURE:2202,REGOPER:2203,REGOPERATOR:2204,REGCLASS:2205,REGTYPE:2206,UUID:2950,TXID_SNAPSHOT:2970,PG_LSN:3220,PG_NDISTINCT:3361,PG_DEPENDENCIES:3402,TSVECTOR:3614,TSQUERY:3615,GTSVECTOR:3642,REGCONFIG:3734,REGDICTIONARY:3769,JSONB:3802,REGNAMESPACE:4089,REGROLE:4096}),vr}var Vs;function St(){if(Vs)return Pe;Vs=1;var e=zo(),t=Vo(),r=ln(),s=Qo();Pe.getTypeParser=o,Pe.setTypeParser=l,Pe.arrayParser=r,Pe.builtins=s;var i={text:{},binary:{}};function n(u){return String(u)}function o(u,d){return d=d||"text",i[d]&&i[d][u]||n}function l(u,d,a){typeof d=="function"&&(a=d,d="text"),i[d][u]=a}return e.init(function(u,d){i.text[u]=d}),t.init(function(u,d){i.binary[u]=d}),Pe}var Qs;function At(){return Qs||(Qs=1,(function(e){var t={};let r;try{r=process.platform==="win32"?t.USERNAME:t.USER}catch{}e.exports={host:"localhost",user:r,database:void 0,password:null,connectionString:void 0,port:5432,rows:0,binary:!1,max:10,idleTimeoutMillis:3e4,client_encoding:"",ssl:!1,application_name:void 0,fallback_application_name:void 0,options:void 0,parseInputDatesAsUTC:!1,statement_timeout:!1,lock_timeout:!1,idle_in_transaction_session_timeout:!1,query_timeout:!1,connect_timeout:0,keepalives:1,keepalives_idle:0};const s=St(),i=s.getTypeParser(20,"text"),n=s.getTypeParser(1016,"text");e.exports.__defineSetter__("parseInt8",function(o){s.setTypeParser(20,"text",o?s.getTypeParser(23,"text"):i),s.setTypeParser(1016,"text",o?s.getTypeParser(1007,"text"):n)})})(cr)),cr.exports}var wr,Xs;function tt(){if(Xs)return wr;Xs=1;const e=At(),t=He,{isDate:r}=t.types||t;function s(c){return'"'+c.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"'}function i(c){let p="{";for(let h=0;h<c.length;h++)if(h>0&&(p=p+","),c[h]===null||typeof c[h]>"u")p=p+"NULL";else if(Array.isArray(c[h]))p=p+i(c[h]);else if(ArrayBuffer.isView(c[h])){let b=c[h];if(!(b instanceof Buffer)){const v=Buffer.from(b.buffer,b.byteOffset,b.byteLength);v.length===b.byteLength?b=v:b=v.slice(b.byteOffset,b.byteOffset+b.byteLength)}p+="\\\\x"+b.toString("hex")}else p+=s(n(c[h]));return p=p+"}",p}const n=function(c,p){if(c==null)return null;if(typeof c=="object"){if(c instanceof Buffer)return c;if(ArrayBuffer.isView(c)){const h=Buffer.from(c.buffer,c.byteOffset,c.byteLength);return h.length===c.byteLength?h:h.slice(c.byteOffset,c.byteOffset+c.byteLength)}return r(c)?e.parseInputDatesAsUTC?u(c):l(c):Array.isArray(c)?i(c):o(c,p)}return c.toString()};function o(c,p){if(c&&typeof c.toPostgres=="function"){if(p=p||[],p.indexOf(c)!==-1)throw new Error('circular reference detected while preparing "'+c+'" for query');return p.push(c),n(c.toPostgres(n),p)}return JSON.stringify(c)}function l(c){let p=-c.getTimezoneOffset(),h=c.getFullYear();const b=h<1;b&&(h=Math.abs(h)+1);let v=String(h).padStart(4,"0")+"-"+String(c.getMonth()+1).padStart(2,"0")+"-"+String(c.getDate()).padStart(2,"0")+"T"+String(c.getHours()).padStart(2,"0")+":"+String(c.getMinutes()).padStart(2,"0")+":"+String(c.getSeconds()).padStart(2,"0")+"."+String(c.getMilliseconds()).padStart(3,"0");return p<0?(v+="-",p*=-1):v+="+",v+=String(Math.floor(p/60)).padStart(2,"0")+":"+String(p%60).padStart(2,"0"),b&&(v+=" BC"),v}function u(c){let p=c.getUTCFullYear();const h=p<1;h&&(p=Math.abs(p)+1);let b=String(p).padStart(4,"0")+"-"+String(c.getUTCMonth()+1).padStart(2,"0")+"-"+String(c.getUTCDate()).padStart(2,"0")+"T"+String(c.getUTCHours()).padStart(2,"0")+":"+String(c.getUTCMinutes()).padStart(2,"0")+":"+String(c.getUTCSeconds()).padStart(2,"0")+"."+String(c.getUTCMilliseconds()).padStart(3,"0");return b+="+00:00",h&&(b+=" BC"),b}function d(c,p,h){return c=typeof c=="string"?{text:c}:c,p&&(typeof p=="function"?c.callback=p:c.values=p),h&&(c.callback=h),c}return wr={prepareValue:function(p){return n(p)},normalizeQueryConfig:d,escapeIdentifier:function(c){return'"'+c.replace(/"/g,'""')+'"'},escapeLiteral:function(c){let p=!1,h="'";if(c==null||typeof c!="string")return"''";for(let b=0;b<c.length;b++){const v=c[b];v==="'"?h+=v+v:v==="\\"?(h+=v+v,p=!0):h+=v}return h+="'",p===!0&&(h=" E"+h),h}},wr}var dt={exports:{}},Er,Ys;function Xo(){if(Ys)return Er;Ys=1;const e=Pi;function t(l){return e.createHash("md5").update(l,"utf-8").digest("hex")}function r(l,u,d){const a=t(u+l);return"md5"+t(Buffer.concat([Buffer.from(a),d]))}function s(l){return e.createHash("sha256").update(l).digest()}function i(l,u){return l=l.replace(/(\D)-/,"$1"),e.createHash(l).update(u).digest()}function n(l,u){return e.createHmac("sha256",l).update(u).digest()}async function o(l,u,d){return e.pbkdf2Sync(l,u,d,32,"sha256")}return Er={postgresMd5PasswordHash:r,randomBytes:e.randomBytes,deriveKey:o,sha256:s,hashByName:i,hmacSha256:n,md5:t},Er}var _r,Gs;function Yo(){if(Gs)return _r;Gs=1;const e=Pi;_r={postgresMd5PasswordHash:o,randomBytes:i,deriveKey:a,sha256:l,hashByName:u,hmacSha256:d,md5:n};const t=e.webcrypto||globalThis.crypto,r=t.subtle,s=new TextEncoder;function i(f){return t.getRandomValues(Buffer.alloc(f))}async function n(f){try{return e.createHash("md5").update(f,"utf-8").digest("hex")}catch{const p=typeof f=="string"?s.encode(f):f,h=await r.digest("MD5",p);return Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,"0")).join("")}}async function o(f,c,p){const h=await n(c+f);return"md5"+await n(Buffer.concat([Buffer.from(h),p]))}async function l(f){return await r.digest("SHA-256",f)}async function u(f,c){return await r.digest(f,c)}async function d(f,c){const p=await r.importKey("raw",f,{name:"HMAC",hash:"SHA-256"},!1,["sign"]);return await r.sign("HMAC",p,s.encode(c))}async function a(f,c,p){const h=await r.importKey("raw",s.encode(f),"PBKDF2",!1,["deriveBits"]),b={name:"PBKDF2",hash:"SHA-256",salt:c,iterations:p};return await r.deriveBits(b,h,256,["deriveBits"])}return _r}var Js;function cn(){return Js||(Js=1,parseInt(process.versions&&process.versions.node&&process.versions.node.split(".")[0])<15?dt.exports=Xo():dt.exports=Yo()),dt.exports}var xr,Ks;function Go(){if(Ks)return xr;Ks=1;function e(n,o){return new Error("SASL channel binding: "+n+" when parsing public certificate "+o.toString("base64"))}function t(n,o){let l=n[o++];if(l<128)return{length:l,index:o};const u=l&127;if(u>4)throw e("bad length",n);l=0;for(let d=0;d<u;d++)l=l<<8|n[o++];return{length:l,index:o}}function r(n,o){if(n[o++]!==6)throw e("non-OID data",n);const{length:l,index:u}=t(n,o);o=u;const d=o+l,a=n[o++];let f=(a/40>>0)+"."+a%40;for(;o<d;){let c=0;for(;o<d;){const p=n[o++];if(c=c<<7|p&127,p<128)break}f+="."+c}return{oid:f,index:o}}function s(n,o){if(n[o++]!==48)throw e("non-sequence data",n);return t(n,o)}function i(n,o){o===void 0&&(o=0),o=s(n,o).index;const{length:l,index:u}=s(n,o);o=u+l,o=s(n,o).index;const{oid:d,index:a}=r(n,o);switch(d){case"1.2.840.113549.1.1.4":return"MD5";case"1.2.840.113549.1.1.5":return"SHA-1";case"1.2.840.113549.1.1.11":return"SHA-256";case"1.2.840.113549.1.1.12":return"SHA-384";case"1.2.840.113549.1.1.13":return"SHA-512";case"1.2.840.113549.1.1.14":return"SHA-224";case"1.2.840.113549.1.1.15":return"SHA512-224";case"1.2.840.113549.1.1.16":return"SHA512-256";case"1.2.840.10045.4.1":return"SHA-1";case"1.2.840.10045.4.3.1":return"SHA-224";case"1.2.840.10045.4.3.2":return"SHA-256";case"1.2.840.10045.4.3.3":return"SHA-384";case"1.2.840.10045.4.3.4":return"SHA-512";case"1.2.840.113549.1.1.10":{if(o=a,o=s(n,o).index,n[o++]!==160)throw e("non-tag data",n);o=t(n,o).index,o=s(n,o).index;const{oid:f}=r(n,o);switch(f){case"1.2.840.113549.2.5":return"MD5";case"1.3.14.3.2.26":return"SHA-1";case"2.16.840.1.101.3.4.2.1":return"SHA-256";case"2.16.840.1.101.3.4.2.2":return"SHA-384";case"2.16.840.1.101.3.4.2.3":return"SHA-512"}throw e("unknown hash OID "+f,n)}case"1.3.101.110":case"1.3.101.112":return"SHA-512";case"1.3.101.111":case"1.3.101.113":throw e("Ed448 certificate channel binding is not currently supported by Postgres")}throw e("unknown OID "+d,n)}return xr={signatureAlgorithmHashFromCertificate:i},xr}var Sr,Zs;function Jo(){if(Zs)return Sr;Zs=1;const e=cn(),{signatureAlgorithmHashFromCertificate:t}=Go();function r(f,c){const p=["SCRAM-SHA-256"];c&&p.unshift("SCRAM-SHA-256-PLUS");const h=p.find(m=>f.includes(m));if(!h)throw new Error("SASL: Only mechanism(s) "+p.join(" and ")+" are supported");if(h==="SCRAM-SHA-256-PLUS"&&typeof c.getPeerCertificate!="function")throw new Error("SASL: Mechanism SCRAM-SHA-256-PLUS requires a certificate");const b=e.randomBytes(18).toString("base64");return{mechanism:h,clientNonce:b,response:(h==="SCRAM-SHA-256-PLUS"?"p=tls-server-end-point":c?"y":"n")+",,n=*,r="+b,message:"SASLInitialResponse"}}async function s(f,c,p,h){if(f.message!=="SASLInitialResponse")throw new Error("SASL: Last message was not SASLInitialResponse");if(typeof c!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string");if(c==="")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a non-empty string");if(typeof p!="string")throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");const b=u(p);if(b.nonce.startsWith(f.clientNonce)){if(b.nonce.length===f.clientNonce.length)throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");const v="n=*,r="+f.clientNonce,m="r="+b.nonce+",s="+b.salt+",i="+b.iteration;let y=h?"eSws":"biws";if(f.mechanism==="SCRAM-SHA-256-PLUS"){const S=h.getPeerCertificate().raw;let P=t(S);(P==="MD5"||P==="SHA-1")&&(P="SHA-256");const D=await e.hashByName(P,S);y=Buffer.concat([Buffer.from("p=tls-server-end-point,,"),Buffer.from(D)]).toString("base64")}const w="c="+y+",r="+b.nonce,x=v+","+m+","+w,O=Buffer.from(b.salt,"base64"),A=await e.deriveKey(c,O,b.iteration),g=await e.hmacSha256(A,"Client Key"),E=await e.sha256(g),_=await e.hmacSha256(E,x),T=a(Buffer.from(g),Buffer.from(_)).toString("base64"),C=await e.hmacSha256(A,"Server Key"),I=await e.hmacSha256(C,x);f.message="SASLResponse",f.serverSignature=Buffer.from(I).toString("base64"),f.response=w+",p="+T}function i(f,c){if(f.message!=="SASLResponse")throw new Error("SASL: Last message was not SASLResponse");if(typeof c!="string")throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");const{serverSignature:p}=d(c);if(p!==f.serverSignature)throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match")}function n(f){if(typeof f!="string")throw new TypeError("SASL: text must be a string");return f.split("").map((c,p)=>f.charCodeAt(p)).every(c=>c>=33&&c<=43||c>=45&&c<=126)}function o(f){return/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(f)}function l(f){if(typeof f!="string")throw new TypeError("SASL: attribute pairs text must be a string");return new Map(f.split(",").map(c=>{if(!/^.=/.test(c))throw new Error("SASL: Invalid attribute pair entry");const p=c[0],h=c.substring(2);return[p,h]}))}function u(f){const c=l(f),p=c.get("r");if(p){if(!n(p))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");const h=c.get("s");if(h){if(!o(h))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");const b=c.get("i");if(b){if(!/^[1-9][0-9]*$/.test(b))throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count")}else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");const v=parseInt(b,10);return{nonce:p,salt:h,iteration:v}}function d(f){const p=l(f).get("v");if(p){if(!o(p))throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64")}else throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing");return{serverSignature:p}}function a(f,c){if(!Buffer.isBuffer(f))throw new TypeError("first argument must be a Buffer");if(!Buffer.isBuffer(c))throw new TypeError("second argument must be a Buffer");if(f.length!==c.length)throw new Error("Buffer lengths must match");if(f.length===0)throw new Error("Buffers cannot be empty");return Buffer.from(f.map((p,h)=>f[h]^c[h]))}return Sr={startSession:r,continueSession:s,finalizeSession:i},Sr}var Ar,ei;function Jr(){if(ei)return Ar;ei=1;const e=St();function t(r){this._types=r||e,this.text={},this.binary={}}return t.prototype.getOverrides=function(r){switch(r){case"text":return this.text;case"binary":return this.binary;default:return{}}},t.prototype.setTypeParser=function(r,s,i){typeof s=="function"&&(i=s,s="text"),this.getOverrides(s)[r]=i},t.prototype.getTypeParser=function(r,s){return s=s||"text",this.getOverrides(s)[r]||this._types.getTypeParser(r,s)},Ar=t,Ar}var Tr,ti;function Ko(){if(ti)return Tr;ti=1;function e(n,o={}){if(n.charAt(0)==="/"){const p=n.split(" ");return{host:p[0],database:p[1]}}const l={};let u,d=!1;/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(n)&&(n=encodeURI(n).replace(/%25(\d\d)/g,"%$1"));try{try{u=new URL(n,"postgres://base")}catch{u=new URL(n.replace("@/","@___DUMMY___/"),"postgres://base"),d=!0}}catch(p){throw p.input&&(p.input="*****REDACTED*****"),p}for(const p of u.searchParams.entries())l[p[0]]=p[1];if(l.user=l.user||decodeURIComponent(u.username),l.password=l.password||decodeURIComponent(u.password),u.protocol=="socket:")return l.host=decodeURI(u.pathname),l.database=u.searchParams.get("db"),l.client_encoding=u.searchParams.get("encoding"),l;const a=d?"":u.hostname;l.host?a&&/^%2f/i.test(a)&&(u.pathname=a+u.pathname):l.host=decodeURIComponent(a),l.port||(l.port=u.port);const f=u.pathname.slice(1)||null;l.database=f?decodeURI(f):null,(l.ssl==="true"||l.ssl==="1")&&(l.ssl=!0),l.ssl==="0"&&(l.ssl=!1),(l.sslcert||l.sslkey||l.sslrootcert||l.sslmode)&&(l.ssl={});const c=l.sslcert||l.sslkey||l.sslrootcert?qi:null;if(l.sslcert&&(l.ssl.cert=c.readFileSync(l.sslcert).toString()),l.sslkey&&(l.ssl.key=c.readFileSync(l.sslkey).toString()),l.sslrootcert&&(l.ssl.ca=c.readFileSync(l.sslrootcert).toString()),o.useLibpqCompat&&l.uselibpqcompat)throw new Error("Both useLibpqCompat and uselibpqcompat are set. Please use only one of them.");if(l.uselibpqcompat==="true"||o.useLibpqCompat)switch(l.sslmode){case"disable":{l.ssl=!1;break}case"prefer":{l.ssl.rejectUnauthorized=!1;break}case"require":{l.sslrootcert?l.ssl.checkServerIdentity=function(){}:l.ssl.rejectUnauthorized=!1;break}case"verify-ca":{if(!l.ssl.ca)throw new Error("SECURITY WARNING: Using sslmode=verify-ca requires specifying a CA with sslrootcert. If a public CA is used, verify-ca allows connections to a server that somebody else may have registered with the CA, making you vulnerable to Man-in-the-Middle attacks. Either specify a custom CA certificate with sslrootcert parameter or use sslmode=verify-full for proper security.");l.ssl.checkServerIdentity=function(){};break}}else switch(l.sslmode){case"disable":{l.ssl=!1;break}case"prefer":case"require":case"verify-ca":case"verify-full":{l.sslmode!=="verify-full"&&i(l.sslmode);break}case"no-verify":{l.ssl.rejectUnauthorized=!1;break}}return l}function t(n){return Object.entries(n).reduce((l,[u,d])=>(d!=null&&(l[u]=d),l),{})}function r(n){return Object.entries(n).reduce((l,[u,d])=>{if(u==="ssl"){const a=d;typeof a=="boolean"&&(l[u]=a),typeof a=="object"&&(l[u]=t(a))}else if(d!=null)if(u==="port"){if(d!==""){const a=parseInt(d,10);if(isNaN(a))throw new Error(`Invalid ${u}: ${d}`);l[u]=a}}else l[u]=d;return l},{})}function s(n){return r(e(n))}function i(n){!i.warned&&typeof process<"u"&&process.emitWarning&&(i.warned=!0,process.emitWarning(`SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=${n}'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.`))}return Tr=e,e.parse=e,e.toClientConfig=r,e.parseIntoClientConfig=s,Tr}var Cr,ri;function un(){if(ri)return Cr;ri=1;var e={};const t=vn,r=At(),s=Ko().parse,i=function(d,a,f){return a[d]?a[d]:(f===void 0?f=e["PG"+d.toUpperCase()]:f===!1||(f=e[f]),f||r[d])},n=function(){switch(e.PGSSLMODE){case"disable":return!1;case"prefer":case"require":case"verify-ca":case"verify-full":return!0;case"no-verify":return{rejectUnauthorized:!1}}return r.ssl},o=function(d){return"'"+(""+d).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'"},l=function(d,a,f){const c=a[f];c!=null&&d.push(f+"="+o(c))};class u{constructor(a){a=typeof a=="string"?s(a):a||{},a.connectionString&&(a=Object.assign({},a,s(a.connectionString))),this.user=i("user",a),this.database=i("database",a),this.database===void 0&&(this.database=this.user),this.port=parseInt(i("port",a),10),this.host=i("host",a),Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:i("password",a)}),this.binary=i("binary",a),this.options=i("options",a),this.ssl=typeof a.ssl>"u"?n():a.ssl,typeof this.ssl=="string"&&this.ssl==="true"&&(this.ssl=!0),this.ssl==="no-verify"&&(this.ssl={rejectUnauthorized:!1}),this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this.client_encoding=i("client_encoding",a),this.replication=i("replication",a),this.isDomainSocket=!(this.host||"").indexOf("/"),this.application_name=i("application_name",a,"PGAPPNAME"),this.fallback_application_name=i("fallback_application_name",a,!1),this.statement_timeout=i("statement_timeout",a,!1),this.lock_timeout=i("lock_timeout",a,!1),this.idle_in_transaction_session_timeout=i("idle_in_transaction_session_timeout",a,!1),this.query_timeout=i("query_timeout",a,!1),a.connectionTimeoutMillis===void 0?this.connect_timeout=e.PGCONNECT_TIMEOUT||0:this.connect_timeout=Math.floor(a.connectionTimeoutMillis/1e3),a.keepAlive===!1?this.keepalives=0:a.keepAlive===!0&&(this.keepalives=1),typeof a.keepAliveInitialDelayMillis=="number"&&(this.keepalives_idle=Math.floor(a.keepAliveInitialDelayMillis/1e3))}getLibpqConnectionString(a){const f=[];l(f,this,"user"),l(f,this,"password"),l(f,this,"port"),l(f,this,"application_name"),l(f,this,"fallback_application_name"),l(f,this,"connect_timeout"),l(f,this,"options");const c=typeof this.ssl=="object"?this.ssl:this.ssl?{sslmode:this.ssl}:{};if(l(f,c,"sslmode"),l(f,c,"sslca"),l(f,c,"sslkey"),l(f,c,"sslcert"),l(f,c,"sslrootcert"),this.database&&f.push("dbname="+o(this.database)),this.replication&&f.push("replication="+o(this.replication)),this.host&&f.push("host="+o(this.host)),this.isDomainSocket)return a(null,f.join(" "));this.client_encoding&&f.push("client_encoding="+o(this.client_encoding)),t.lookup(this.host,function(p,h){return p?a(p,null):(f.push("hostaddr="+o(h)),a(null,f.join(" ")))})}}return Cr=u,Cr}var Rr,si;function dn(){if(si)return Rr;si=1;const e=St(),t=/^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/;class r{constructor(i,n){this.command=null,this.rowCount=null,this.oid=null,this.rows=[],this.fields=[],this._parsers=void 0,this._types=n,this.RowCtor=null,this.rowAsArray=i==="array",this.rowAsArray&&(this.parseRow=this._parseRowAsArray),this._prebuiltEmptyResultObject=null}addCommandComplete(i){let n;i.text?n=t.exec(i.text):n=t.exec(i.command),n&&(this.command=n[1],n[3]?(this.oid=parseInt(n[2],10),this.rowCount=parseInt(n[3],10)):n[2]&&(this.rowCount=parseInt(n[2],10)))}_parseRowAsArray(i){const n=new Array(i.length);for(let o=0,l=i.length;o<l;o++){const u=i[o];u!==null?n[o]=this._parsers[o](u):n[o]=null}return n}parseRow(i){const n={...this._prebuiltEmptyResultObject};for(let o=0,l=i.length;o<l;o++){const u=i[o],d=this.fields[o].name;if(u!==null){const a=this.fields[o].format==="binary"?Buffer.from(u):u;n[d]=this._parsers[o](a)}else n[d]=null}return n}addRow(i){this.rows.push(i)}addFields(i){this.fields=i,this.fields.length&&(this._parsers=new Array(i.length));const n={};for(let o=0;o<i.length;o++){const l=i[o];n[l.name]=null,this._types?this._parsers[o]=this._types.getTypeParser(l.dataTypeID,l.format||"text"):this._parsers[o]=e.getTypeParser(l.dataTypeID,l.format||"text")}this._prebuiltEmptyResultObject={...n}}}return Rr=r,Rr}var Nr,ii;function Zo(){if(ii)return Nr;ii=1;const{EventEmitter:e}=ze,t=dn(),r=tt();class s extends e{constructor(n,o,l){super(),n=r.normalizeQueryConfig(n,o,l),this.text=n.text,this.values=n.values,this.rows=n.rows,this.types=n.types,this.name=n.name,this.queryMode=n.queryMode,this.binary=n.binary,this.portal=n.portal||"",this.callback=n.callback,this._rowMode=n.rowMode,process.domain&&n.callback&&(this.callback=process.domain.bind(n.callback)),this._result=new t(this._rowMode,this.types),this._results=this._result,this._canceledDueToError=!1}requiresPreparation(){return this.queryMode==="extended"||this.name||this.rows?!0:!this.text||!this.values?!1:this.values.length>0}_checkForMultirow(){this._result.command&&(Array.isArray(this._results)||(this._results=[this._result]),this._result=new t(this._rowMode,this._result._types),this._results.push(this._result))}handleRowDescription(n){this._checkForMultirow(),this._result.addFields(n.fields),this._accumulateRows=this.callback||!this.listeners("row").length}handleDataRow(n){let o;if(!this._canceledDueToError){try{o=this._result.parseRow(n.fields)}catch(l){this._canceledDueToError=l;return}this.emit("row",o,this._result),this._accumulateRows&&this._result.addRow(o)}}handleCommandComplete(n,o){this._checkForMultirow(),this._result.addCommandComplete(n),this.rows&&o.sync()}handleEmptyQuery(n){this.rows&&n.sync()}handleError(n,o){if(this._canceledDueToError&&(n=this._canceledDueToError,this._canceledDueToError=!1),this.callback)return this.callback(n);this.emit("error",n)}handleReadyForQuery(n){if(this._canceledDueToError)return this.handleError(this._canceledDueToError,n);if(this.callback)try{this.callback(null,this._results)}catch(o){process.nextTick(()=>{throw o})}this.emit("end",this._results)}submit(n){if(typeof this.text!="string"&&typeof this.name!="string")return new Error("A query must have either text or a name. Supplying neither is unsupported.");const o=n.parsedStatements[this.name];if(this.text&&o&&this.text!==o)return new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);if(this.values&&!Array.isArray(this.values))return new Error("Query values must be an array");if(this.requiresPreparation()){n.stream.cork&&n.stream.cork();try{this.prepare(n)}finally{n.stream.uncork&&n.stream.uncork()}}else n.query(this.text);return null}hasBeenParsed(n){return this.name&&n.parsedStatements[this.name]}handlePortalSuspended(n){this._getRows(n,this.rows)}_getRows(n,o){n.execute({portal:this.portal,rows:o}),o?n.flush():n.sync()}prepare(n){this.hasBeenParsed(n)||n.parse({text:this.text,name:this.name,types:this.types});try{n.bind({portal:this.portal,statement:this.name,values:this.values,binary:this.binary,valueMapper:r.prepareValue})}catch(o){this.handleError(o,n);return}n.describe({type:"P",name:this.portal||""}),this._getRows(n,this.rows)}handleCopyInResponse(n){n.sendCopyFail("No source stream defined")}handleCopyData(n,o){}}return Nr=s,Nr}var Ir={},B={},ni;function fn(){if(ni)return B;ni=1,Object.defineProperty(B,"__esModule",{value:!0}),B.NoticeMessage=B.DataRowMessage=B.CommandCompleteMessage=B.ReadyForQueryMessage=B.NotificationResponseMessage=B.BackendKeyDataMessage=B.AuthenticationMD5Password=B.ParameterStatusMessage=B.ParameterDescriptionMessage=B.RowDescriptionMessage=B.Field=B.CopyResponse=B.CopyDataMessage=B.DatabaseError=B.copyDone=B.emptyQuery=B.replicationStart=B.portalSuspended=B.noData=B.closeComplete=B.bindComplete=B.parseComplete=void 0,B.parseComplete={name:"parseComplete",length:5},B.bindComplete={name:"bindComplete",length:5},B.closeComplete={name:"closeComplete",length:5},B.noData={name:"noData",length:5},B.portalSuspended={name:"portalSuspended",length:5},B.replicationStart={name:"replicationStart",length:4},B.emptyQuery={name:"emptyQuery",length:4},B.copyDone={name:"copyDone",length:4};class e extends Error{constructor(b,v,m){super(b),this.length=v,this.name=m}}B.DatabaseError=e;class t{constructor(b,v){this.length=b,this.chunk=v,this.name="copyData"}}B.CopyDataMessage=t;class r{constructor(b,v,m,y){this.length=b,this.name=v,this.binary=m,this.columnTypes=new Array(y)}}B.CopyResponse=r;class s{constructor(b,v,m,y,w,x,O){this.name=b,this.tableID=v,this.columnID=m,this.dataTypeID=y,this.dataTypeSize=w,this.dataTypeModifier=x,this.format=O}}B.Field=s;class i{constructor(b,v){this.length=b,this.fieldCount=v,this.name="rowDescription",this.fields=new Array(this.fieldCount)}}B.RowDescriptionMessage=i;class n{constructor(b,v){this.length=b,this.parameterCount=v,this.name="parameterDescription",this.dataTypeIDs=new Array(this.parameterCount)}}B.ParameterDescriptionMessage=n;class o{constructor(b,v,m){this.length=b,this.parameterName=v,this.parameterValue=m,this.name="parameterStatus"}}B.ParameterStatusMessage=o;class l{constructor(b,v){this.length=b,this.salt=v,this.name="authenticationMD5Password"}}B.AuthenticationMD5Password=l;class u{constructor(b,v,m){this.length=b,this.processID=v,this.secretKey=m,this.name="backendKeyData"}}B.BackendKeyDataMessage=u;class d{constructor(b,v,m,y){this.length=b,this.processId=v,this.channel=m,this.payload=y,this.name="notification"}}B.NotificationResponseMessage=d;class a{constructor(b,v){this.length=b,this.status=v,this.name="readyForQuery"}}B.ReadyForQueryMessage=a;class f{constructor(b,v){this.length=b,this.text=v,this.name="commandComplete"}}B.CommandCompleteMessage=f;class c{constructor(b,v){this.length=b,this.fields=v,this.name="dataRow",this.fieldCount=v.length}}B.DataRowMessage=c;class p{constructor(b,v){this.length=b,this.message=v,this.name="notice"}}return B.NoticeMessage=p,B}var Xe={},Ye={},oi;function ea(){if(oi)return Ye;oi=1,Object.defineProperty(Ye,"__esModule",{value:!0}),Ye.Writer=void 0;class e{constructor(r=256){this.size=r,this.offset=5,this.headerPosition=0,this.buffer=Buffer.allocUnsafe(r)}ensure(r){if(this.buffer.length-this.offset<r){const i=this.buffer,n=i.length+(i.length>>1)+r;this.buffer=Buffer.allocUnsafe(n),i.copy(this.buffer)}}addInt32(r){return this.ensure(4),this.buffer[this.offset++]=r>>>24&255,this.buffer[this.offset++]=r>>>16&255,this.buffer[this.offset++]=r>>>8&255,this.buffer[this.offset++]=r>>>0&255,this}addInt16(r){return this.ensure(2),this.buffer[this.offset++]=r>>>8&255,this.buffer[this.offset++]=r>>>0&255,this}addCString(r){if(!r)this.ensure(1);else{const s=Buffer.byteLength(r);this.ensure(s+1),this.buffer.write(r,this.offset,"utf-8"),this.offset+=s}return this.buffer[this.offset++]=0,this}addString(r=""){const s=Buffer.byteLength(r);return this.ensure(s),this.buffer.write(r,this.offset),this.offset+=s,this}add(r){return this.ensure(r.length),r.copy(this.buffer,this.offset),this.offset+=r.length,this}join(r){if(r){this.buffer[this.headerPosition]=r;const s=this.offset-(this.headerPosition+1);this.buffer.writeInt32BE(s,this.headerPosition+1)}return this.buffer.slice(r?0:5,this.offset)}flush(r){const s=this.join(r);return this.offset=5,this.headerPosition=0,this.buffer=Buffer.allocUnsafe(this.size),s}}return Ye.Writer=e,Ye}var ai;function ta(){if(ai)return Xe;ai=1,Object.defineProperty(Xe,"__esModule",{value:!0}),Xe.serialize=void 0;const e=ea(),t=new e.Writer,r=S=>{t.addInt16(3).addInt16(0);for(const M of Object.keys(S))t.addCString(M).addCString(S[M]);t.addCString("client_encoding").addCString("UTF8");const P=t.addCString("").flush(),D=P.length+4;return new e.Writer().addInt32(D).add(P).flush()},s=()=>{const S=Buffer.allocUnsafe(8);return S.writeInt32BE(8,0),S.writeInt32BE(80877103,4),S},i=S=>t.addCString(S).flush(112),n=function(S,P){return t.addCString(S).addInt32(Buffer.byteLength(P)).addString(P),t.flush(112)},o=function(S){return t.addString(S).flush(112)},l=S=>t.addCString(S).flush(81),u=[],d=S=>{const P=S.name||"";P.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",P,P.length),console.error("This can cause conflicts and silent errors executing queries"));const D=S.types||u,M=D.length,F=t.addCString(P).addCString(S.text).addInt16(M);for(let $=0;$<M;$++)F.addInt32(D[$]);return t.flush(80)},a=new e.Writer,f=function(S,P){for(let D=0;D<S.length;D++){const M=P?P(S[D],D):S[D];M==null?(t.addInt16(0),a.addInt32(-1)):M instanceof Buffer?(t.addInt16(1),a.addInt32(M.length),a.add(M)):(t.addInt16(0),a.addInt32(Buffer.byteLength(M)),a.addString(M))}},c=(S={})=>{const P=S.portal||"",D=S.statement||"",M=S.binary||!1,F=S.values||u,$=F.length;return t.addCString(P).addCString(D),t.addInt16($),f(F,S.valueMapper),t.addInt16($),t.add(a.flush()),t.addInt16(1),t.addInt16(M?1:0),t.flush(66)},p=Buffer.from([69,0,0,0,9,0,0,0,0,0]),h=S=>{if(!S||!S.portal&&!S.rows)return p;const P=S.portal||"",D=S.rows||0,M=Buffer.byteLength(P),F=4+M+1+4,$=Buffer.allocUnsafe(1+F);return $[0]=69,$.writeInt32BE(F,1),$.write(P,5,"utf-8"),$[M+5]=0,$.writeUInt32BE(D,$.length-4),$},b=(S,P)=>{const D=Buffer.allocUnsafe(16);return D.writeInt32BE(16,0),D.writeInt16BE(1234,4),D.writeInt16BE(5678,6),D.writeInt32BE(S,8),D.writeInt32BE(P,12),D},v=(S,P)=>{const M=4+Buffer.byteLength(P)+1,F=Buffer.allocUnsafe(1+M);return F[0]=S,F.writeInt32BE(M,1),F.write(P,5,"utf-8"),F[M]=0,F},m=t.addCString("P").flush(68),y=t.addCString("S").flush(68),w=S=>S.name?v(68,`${S.type}${S.name||""}`):S.type==="P"?m:y,x=S=>{const P=`${S.type}${S.name||""}`;return v(67,P)},O=S=>t.add(S).flush(100),A=S=>v(102,S),g=S=>Buffer.from([S,0,0,0,4]),E=g(72),_=g(83),T=g(88),C=g(99),I={startup:r,password:i,requestSsl:s,sendSASLInitialResponseMessage:n,sendSCRAMClientFinalMessage:o,query:l,parse:d,bind:c,execute:h,describe:w,close:x,flush:()=>E,sync:()=>_,end:()=>T,copyData:O,copyDone:()=>C,copyFail:A,cancel:b};return Xe.serialize=I,Xe}var Ge={},Je={},li;function ra(){if(li)return Je;li=1,Object.defineProperty(Je,"__esModule",{value:!0}),Je.BufferReader=void 0;class e{constructor(r=0){this.offset=r,this.buffer=Buffer.allocUnsafe(0),this.encoding="utf-8"}setBuffer(r,s){this.offset=r,this.buffer=s}int16(){const r=this.buffer.readInt16BE(this.offset);return this.offset+=2,r}byte(){const r=this.buffer[this.offset];return this.offset++,r}int32(){const r=this.buffer.readInt32BE(this.offset);return this.offset+=4,r}uint32(){const r=this.buffer.readUInt32BE(this.offset);return this.offset+=4,r}string(r){const s=this.buffer.toString(this.encoding,this.offset,this.offset+r);return this.offset+=r,s}cstring(){const r=this.offset;let s=r;for(;this.buffer[s++]!==0;);return this.offset=s,this.buffer.toString(this.encoding,r,s-1)}bytes(r){const s=this.buffer.slice(this.offset,this.offset+r);return this.offset+=r,s}}return Je.BufferReader=e,Je}var ci;function sa(){if(ci)return Ge;ci=1,Object.defineProperty(Ge,"__esModule",{value:!0}),Ge.Parser=void 0;const e=fn(),t=ra(),r=1,i=r+4,n=-1,o=Buffer.allocUnsafe(0);class l{constructor(E){if(this.buffer=o,this.bufferLength=0,this.bufferOffset=0,this.reader=new t.BufferReader,(E==null?void 0:E.mode)==="binary")throw new Error("Binary mode not supported yet");this.mode=(E==null?void 0:E.mode)||"text"}parse(E,_){this.mergeBuffer(E);const T=this.bufferOffset+this.bufferLength;let C=this.bufferOffset;for(;C+i<=T;){const I=this.buffer[C],S=this.buffer.readUInt32BE(C+r),P=r+S;if(P+C<=T){const D=this.handlePacket(C+i,I,S,this.buffer);_(D),C+=P}else break}C===T?(this.buffer=o,this.bufferLength=0,this.bufferOffset=0):(this.bufferLength=T-C,this.bufferOffset=C)}mergeBuffer(E){if(this.bufferLength>0){const _=this.bufferLength+E.byteLength;if(_+this.bufferOffset>this.buffer.byteLength){let C;if(_<=this.buffer.byteLength&&this.bufferOffset>=this.bufferLength)C=this.buffer;else{let I=this.buffer.byteLength*2;for(;_>=I;)I*=2;C=Buffer.allocUnsafe(I)}this.buffer.copy(C,0,this.bufferOffset,this.bufferOffset+this.bufferLength),this.buffer=C,this.bufferOffset=0}E.copy(this.buffer,this.bufferOffset+this.bufferLength),this.bufferLength=_}else this.buffer=E,this.bufferOffset=0,this.bufferLength=E.byteLength}handlePacket(E,_,T,C){const{reader:I}=this;I.setBuffer(E,C);let S;switch(_){case 50:S=e.bindComplete;break;case 49:S=e.parseComplete;break;case 51:S=e.closeComplete;break;case 110:S=e.noData;break;case 115:S=e.portalSuspended;break;case 99:S=e.copyDone;break;case 87:S=e.replicationStart;break;case 73:S=e.emptyQuery;break;case 68:S=y(I);break;case 67:S=d(I);break;case 90:S=u(I);break;case 65:S=h(I);break;case 82:S=O(I,T);break;case 83:S=w(I);break;case 75:S=x(I);break;case 69:S=A(I,"error");break;case 78:S=A(I,"notice");break;case 84:S=b(I);break;case 116:S=m(I);break;case 71:S=f(I);break;case 72:S=c(I);break;case 100:S=a(I,T);break;default:return new e.DatabaseError("received invalid response: "+_.toString(16),T,"error")}return I.setBuffer(0,o),S.length=T,S}}Ge.Parser=l;const u=g=>{const E=g.string(1);return new e.ReadyForQueryMessage(n,E)},d=g=>{const E=g.cstring();return new e.CommandCompleteMessage(n,E)},a=(g,E)=>{const _=g.bytes(E-4);return new e.CopyDataMessage(n,_)},f=g=>p(g,"copyInResponse"),c=g=>p(g,"copyOutResponse"),p=(g,E)=>{const _=g.byte()!==0,T=g.int16(),C=new e.CopyResponse(n,E,_,T);for(let I=0;I<T;I++)C.columnTypes[I]=g.int16();return C},h=g=>{const E=g.int32(),_=g.cstring(),T=g.cstring();return new e.NotificationResponseMessage(n,E,_,T)},b=g=>{const E=g.int16(),_=new e.RowDescriptionMessage(n,E);for(let T=0;T<E;T++)_.fields[T]=v(g);return _},v=g=>{const E=g.cstring(),_=g.uint32(),T=g.int16(),C=g.uint32(),I=g.int16(),S=g.int32(),P=g.int16()===0?"text":"binary";return new e.Field(E,_,T,C,I,S,P)},m=g=>{const E=g.int16(),_=new e.ParameterDescriptionMessage(n,E);for(let T=0;T<E;T++)_.dataTypeIDs[T]=g.int32();return _},y=g=>{const E=g.int16(),_=new Array(E);for(let T=0;T<E;T++){const C=g.int32();_[T]=C===-1?null:g.string(C)}return new e.DataRowMessage(n,_)},w=g=>{const E=g.cstring(),_=g.cstring();return new e.ParameterStatusMessage(n,E,_)},x=g=>{const E=g.int32(),_=g.int32();return new e.BackendKeyDataMessage(n,E,_)},O=(g,E)=>{const _=g.int32(),T={name:"authenticationOk",length:E};switch(_){case 0:break;case 3:T.length===8&&(T.name="authenticationCleartextPassword");break;case 5:if(T.length===12){T.name="authenticationMD5Password";const C=g.bytes(4);return new e.AuthenticationMD5Password(n,C)}break;case 10:{T.name="authenticationSASL",T.mechanisms=[];let C;do C=g.cstring(),C&&T.mechanisms.push(C);while(C)}break;case 11:T.name="authenticationSASLContinue",T.data=g.string(E-8);break;case 12:T.name="authenticationSASLFinal",T.data=g.string(E-8);break;default:throw new Error("Unknown authenticationOk message type "+_)}return T},A=(g,E)=>{const _={};let T=g.string(1);for(;T!=="\0";)_[T]=g.cstring(),T=g.string(1);const C=_.M,I=E==="notice"?new e.NoticeMessage(n,C):new e.DatabaseError(C,n,E);return I.severity=_.S,I.code=_.C,I.detail=_.D,I.hint=_.H,I.position=_.P,I.internalPosition=_.p,I.internalQuery=_.q,I.where=_.W,I.schema=_.s,I.table=_.t,I.column=_.c,I.dataType=_.d,I.constraint=_.n,I.file=_.F,I.line=_.L,I.routine=_.R,I};return Ge}var ui;function pn(){return ui||(ui=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.DatabaseError=e.serialize=e.parse=void 0;const t=fn();Object.defineProperty(e,"DatabaseError",{enumerable:!0,get:function(){return t.DatabaseError}});const r=ta();Object.defineProperty(e,"serialize",{enumerable:!0,get:function(){return r.serialize}});const s=sa();function i(n,o){const l=new s.Parser;return n.on("data",u=>l.parse(u,o)),new Promise(u=>n.on("end",()=>u()))}e.parse=i})(Ir)),Ir}var ft={},di;function ia(){return di||(di=1,Object.defineProperty(ft,"__esModule",{value:!0}),ft.default={}),ft}var Or,fi;function na(){if(fi)return Or;fi=1;const{getStream:e,getSecureStream:t}=n();Or={getStream:e,getSecureStream:t};function r(){function o(u){const d=Di;return new d.Socket}function l(u){return wn.connect(u)}return{getStream:o,getSecureStream:l}}function s(){function o(u){const{CloudflareSocket:d}=ia();return new d(u)}function l(u){return u.socket.startTls(u),u.socket}return{getStream:o,getSecureStream:l}}function i(){if(typeof navigator=="object"&&navigator!==null&&typeof navigator.userAgent=="string")return navigator.userAgent==="Cloudflare-Workers";if(typeof Response=="function"){const o=new Response(null,{cf:{thing:!0}});if(typeof o.cf=="object"&&o.cf!==null&&o.cf.thing)return!0}return!1}function n(){return i()?s():r()}return Or}var Lr,pi;function mn(){if(pi)return Lr;pi=1;const e=ze.EventEmitter,{parse:t,serialize:r}=pn(),{getStream:s,getSecureStream:i}=na(),n=r.flush(),o=r.sync(),l=r.end();class u extends e{constructor(a){super(),a=a||{},this.stream=a.stream||s(a.ssl),typeof this.stream=="function"&&(this.stream=this.stream(a)),this._keepAlive=a.keepAlive,this._keepAliveInitialDelayMillis=a.keepAliveInitialDelayMillis,this.parsedStatements={},this.ssl=a.ssl||!1,this._ending=!1,this._emitMessage=!1;const f=this;this.on("newListener",function(c){c==="message"&&(f._emitMessage=!0)})}connect(a,f){const c=this;this._connecting=!0,this.stream.setNoDelay(!0),this.stream.connect(a,f),this.stream.once("connect",function(){c._keepAlive&&c.stream.setKeepAlive(!0,c._keepAliveInitialDelayMillis),c.emit("connect")});const p=function(h){c._ending&&(h.code==="ECONNRESET"||h.code==="EPIPE")||c.emit("error",h)};if(this.stream.on("error",p),this.stream.on("close",function(){c.emit("end")}),!this.ssl)return this.attachListeners(this.stream);this.stream.once("data",function(h){switch(h.toString("utf8")){case"S":break;case"N":return c.stream.end(),c.emit("error",new Error("The server does not support SSL connections"));default:return c.stream.end(),c.emit("error",new Error("There was an error establishing an SSL connection"))}const v={socket:c.stream};c.ssl!==!0&&(Object.assign(v,c.ssl),"key"in c.ssl&&(v.key=c.ssl.key));const m=Di;m.isIP&&m.isIP(f)===0&&(v.servername=f);try{c.stream=i(v)}catch(y){return c.emit("error",y)}c.attachListeners(c.stream),c.stream.on("error",p),c.emit("sslconnect")})}attachListeners(a){t(a,f=>{const c=f.name==="error"?"errorMessage":f.name;this._emitMessage&&this.emit("message",f),this.emit(c,f)})}requestSsl(){this.stream.write(r.requestSsl())}startup(a){this.stream.write(r.startup(a))}cancel(a,f){this._send(r.cancel(a,f))}password(a){this._send(r.password(a))}sendSASLInitialResponseMessage(a,f){this._send(r.sendSASLInitialResponseMessage(a,f))}sendSCRAMClientFinalMessage(a){this._send(r.sendSCRAMClientFinalMessage(a))}_send(a){return this.stream.writable?this.stream.write(a):!1}query(a){this._send(r.query(a))}parse(a){this._send(r.parse(a))}bind(a){this._send(r.bind(a))}execute(a){this._send(r.execute(a))}flush(){this.stream.writable&&this.stream.write(n)}sync(){this._ending=!0,this._send(o)}ref(){this.stream.ref()}unref(){this.stream.unref()}end(){if(this._ending=!0,!this._connecting||!this.stream.writable){this.stream.end();return}return this.stream.write(l,()=>{this.stream.end()})}close(a){this._send(r.close(a))}describe(a){this._send(r.describe(a))}sendCopyFromChunk(a){this._send(r.copyData(a))}endCopyFrom(){this._send(r.copyDone())}sendCopyFail(a){this._send(r.copyFail(a))}}return Lr=u,Lr}var pt={exports:{}},Pr={exports:{}},qr,mi;function oa(){if(mi)return qr;mi=1;const{Transform:e}=ji,{StringDecoder:t}=_n,r=Symbol("last"),s=Symbol("decoder");function i(d,a,f){let c;if(this.overflow){if(c=this[s].write(d).split(this.matcher),c.length===1)return f();c.shift(),this.overflow=!1}else this[r]+=this[s].write(d),c=this[r].split(this.matcher);this[r]=c.pop();for(let p=0;p<c.length;p++)try{o(this,this.mapper(c[p]))}catch(h){return f(h)}if(this.overflow=this[r].length>this.maxLength,this.overflow&&!this.skipOverflow){f(new Error("maximum buffer reached"));return}f()}function n(d){if(this[r]+=this[s].end(),this[r])try{o(this,this.mapper(this[r]))}catch(a){return d(a)}d()}function o(d,a){a!==void 0&&d.push(a)}function l(d){return d}function u(d,a,f){switch(d=d||/\r?\n/,a=a||l,f=f||{},arguments.length){case 1:typeof d=="function"?(a=d,d=/\r?\n/):typeof d=="object"&&!(d instanceof RegExp)&&!d[Symbol.split]&&(f=d,d=/\r?\n/);break;case 2:typeof d=="function"?(f=a,a=d,d=/\r?\n/):typeof a=="object"&&(f=a,a=l)}f=Object.assign({},f),f.autoDestroy=!0,f.transform=i,f.flush=n,f.readableObjectMode=!0;const c=new e(f);return c[r]="",c[s]=new t("utf8"),c.matcher=d,c.mapper=a,c.maxLength=f.maxLength,c.skipOverflow=f.skipOverflow||!1,c.overflow=!1,c._destroy=function(p,h){this._writableState.errorEmitted=!1,h(p)},c}return qr=u,qr}var hi;function aa(){return hi||(hi=1,(function(e){var t={},r=En,s=ji.Stream,i=oa(),n=He,o=5432,l=process.platform==="win32",u=process.stderr,d=56,a=7,f=61440,c=32768;function p(O){return(O&f)==c}var h=["host","port","database","user","password"],b=h.length,v=h[b-1];function m(){var O=u instanceof s&&u.writable===!0;if(O){var A=Array.prototype.slice.call(arguments).concat(`
`);u.write(n.format.apply(n,A))}}Object.defineProperty(e.exports,"isWin",{get:function(){return l},set:function(O){l=O}}),e.exports.warnTo=function(O){var A=u;return u=O,A},e.exports.getFileName=function(O){var A=O||t,g=A.PGPASSFILE||(l?r.join(A.APPDATA||"./","postgresql","pgpass.conf"):r.join(A.HOME||"./",".pgpass"));return g},e.exports.usePgPass=function(O,A){return Object.prototype.hasOwnProperty.call(t,"PGPASSWORD")?!1:l?!0:(A=A||"<unkn>",p(O.mode)?O.mode&(d|a)?(m('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less',A),!1):!0:(m('WARNING: password file "%s" is not a plain file',A),!1))};var y=e.exports.match=function(O,A){return h.slice(0,-1).reduce(function(g,E,_){return _==1&&Number(O[E]||o)===Number(A[E])?g&&!0:g&&(A[E]==="*"||A[E]===O[E])},!0)};e.exports.getPassword=function(O,A,g){var E,_=A.pipe(i());function T(S){var P=w(S);P&&x(P)&&y(O,P)&&(E=P[v],_.end())}var C=function(){A.destroy(),g(E)},I=function(S){A.destroy(),m("WARNING: error on reading file: %s",S),g(void 0)};A.on("error",I),_.on("data",T).on("end",C).on("error",I)};var w=e.exports.parseLine=function(O){if(O.length<11||O.match(/^\s+#/))return null;for(var A="",g="",E=0,_=0,T={},C=!1,I=function(P,D,M){var F=O.substring(D,M);Object.hasOwnProperty.call(t,"PGPASS_NO_DEESCAPE")||(F=F.replace(/\\([:\\])/g,"$1")),T[h[P]]=F},S=0;S<O.length-1;S+=1){if(A=O.charAt(S+1),g=O.charAt(S),C=E==b-1,C){I(E,_);break}S>=0&&A==":"&&g!=="\\"&&(I(E,_,S+1),_=S+2,E+=1)}return T=Object.keys(T).length===b?T:null,T},x=e.exports.isValidEntry=function(O){for(var A={0:function(C){return C.length>0},1:function(C){return C==="*"?!0:(C=Number(C),isFinite(C)&&C>0&&C<9007199254740992&&Math.floor(C)===C)},2:function(C){return C.length>0},3:function(C){return C.length>0},4:function(C){return C.length>0}},g=0;g<h.length;g+=1){var E=A[g],_=O[h[g]]||"",T=E(_);if(!T)return!1}return!0}})(Pr)),Pr.exports}var gi;function la(){if(gi)return pt.exports;gi=1;var e=qi,t=aa();return pt.exports=function(r,s){var i=t.getFileName();e.stat(i,function(n,o){if(n||!t.usePgPass(o,i))return s(void 0);var l=e.createReadStream(i);t.getPassword(r,l,s)})},pt.exports.warnTo=t.warnTo,pt.exports}var Dr,bi;function ca(){if(bi)return Dr;bi=1;const e=ze.EventEmitter,t=tt(),r=He,s=Jo(),i=Jr(),n=un(),o=Zo(),l=At(),u=mn(),d=cn(),a=r.deprecate(()=>{},"Client.activeQuery is deprecated and will be removed in pg@9.0"),f=r.deprecate(()=>{},"Client.queryQueue is deprecated and will be removed in pg@9.0."),c=r.deprecate(()=>{},"pgpass support is deprecated and will be removed in pg@9.0. You can provide an async function as the password property to the Client/Pool constructor that returns a password instead. Within this function you can call the pgpass module in your own code."),p=r.deprecate(()=>{},"Passing a custom Promise implementation to the Client/Pool constructor is deprecated and will be removed in pg@9.0."),h=r.deprecate(()=>{},"Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead.");class b extends e{constructor(m){super(),this.connectionParameters=new n(m),this.user=this.connectionParameters.user,this.database=this.connectionParameters.database,this.port=this.connectionParameters.port,this.host=this.connectionParameters.host,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:this.connectionParameters.password}),this.replication=this.connectionParameters.replication;const y=m||{};y.Promise&&p(),this._Promise=y.Promise||Wr.Promise,this._types=new i(y.types),this._ending=!1,this._ended=!1,this._connecting=!1,this._connected=!1,this._connectionError=!1,this._queryable=!0,this._activeQuery=null,this.enableChannelBinding=!!y.enableChannelBinding,this.connection=y.connection||new u({stream:y.stream,ssl:this.connectionParameters.ssl,keepAlive:y.keepAlive||!1,keepAliveInitialDelayMillis:y.keepAliveInitialDelayMillis||0,encoding:this.connectionParameters.client_encoding||"utf8"}),this._queryQueue=[],this.binary=y.binary||l.binary,this.processID=null,this.secretKey=null,this.ssl=this.connectionParameters.ssl||!1,this.ssl&&this.ssl.key&&Object.defineProperty(this.ssl,"key",{enumerable:!1}),this._connectionTimeoutMillis=y.connectionTimeoutMillis||0}get activeQuery(){return a(),this._activeQuery}set activeQuery(m){a(),this._activeQuery=m}_getActiveQuery(){return this._activeQuery}_errorAllQueries(m){const y=x=>{process.nextTick(()=>{x.handleError(m,this.connection)})},w=this._getActiveQuery();w&&(y(w),this._activeQuery=null),this._queryQueue.forEach(y),this._queryQueue.length=0}_connect(m){const y=this,w=this.connection;if(this._connectionCallback=m,this._connecting||this._connected){const x=new Error("Client has already been connected. You cannot reuse a client.");process.nextTick(()=>{m(x)});return}this._connecting=!0,this._connectionTimeoutMillis>0&&(this.connectionTimeoutHandle=setTimeout(()=>{w._ending=!0,w.stream.destroy(new Error("timeout expired"))},this._connectionTimeoutMillis),this.connectionTimeoutHandle.unref&&this.connectionTimeoutHandle.unref()),this.host&&this.host.indexOf("/")===0?w.connect(this.host+"/.s.PGSQL."+this.port):w.connect(this.port,this.host),w.on("connect",function(){y.ssl?w.requestSsl():w.startup(y.getStartupConf())}),w.on("sslconnect",function(){w.startup(y.getStartupConf())}),this._attachListeners(w),w.once("end",()=>{const x=this._ending?new Error("Connection terminated"):new Error("Connection terminated unexpectedly");clearTimeout(this.connectionTimeoutHandle),this._errorAllQueries(x),this._ended=!0,this._ending||(this._connecting&&!this._connectionError?this._connectionCallback?this._connectionCallback(x):this._handleErrorEvent(x):this._connectionError||this._handleErrorEvent(x)),process.nextTick(()=>{this.emit("end")})})}connect(m){if(m){this._connect(m);return}return new this._Promise((y,w)=>{this._connect(x=>{x?w(x):y(this)})})}_attachListeners(m){m.on("authenticationCleartextPassword",this._handleAuthCleartextPassword.bind(this)),m.on("authenticationMD5Password",this._handleAuthMD5Password.bind(this)),m.on("authenticationSASL",this._handleAuthSASL.bind(this)),m.on("authenticationSASLContinue",this._handleAuthSASLContinue.bind(this)),m.on("authenticationSASLFinal",this._handleAuthSASLFinal.bind(this)),m.on("backendKeyData",this._handleBackendKeyData.bind(this)),m.on("error",this._handleErrorEvent.bind(this)),m.on("errorMessage",this._handleErrorMessage.bind(this)),m.on("readyForQuery",this._handleReadyForQuery.bind(this)),m.on("notice",this._handleNotice.bind(this)),m.on("rowDescription",this._handleRowDescription.bind(this)),m.on("dataRow",this._handleDataRow.bind(this)),m.on("portalSuspended",this._handlePortalSuspended.bind(this)),m.on("emptyQuery",this._handleEmptyQuery.bind(this)),m.on("commandComplete",this._handleCommandComplete.bind(this)),m.on("parseComplete",this._handleParseComplete.bind(this)),m.on("copyInResponse",this._handleCopyInResponse.bind(this)),m.on("copyData",this._handleCopyData.bind(this)),m.on("notification",this._handleNotification.bind(this))}_getPassword(m){const y=this.connection;if(typeof this.password=="function")this._Promise.resolve().then(()=>this.password(this.connectionParameters)).then(w=>{if(w!==void 0){if(typeof w!="string"){y.emit("error",new TypeError("Password must be a string"));return}this.connectionParameters.password=this.password=w}else this.connectionParameters.password=this.password=null;m()}).catch(w=>{y.emit("error",w)});else if(this.password!==null)m();else try{la()(this.connectionParameters,x=>{x!==void 0&&(c(),this.connectionParameters.password=this.password=x),m()})}catch(w){this.emit("error",w)}}_handleAuthCleartextPassword(m){this._getPassword(()=>{this.connection.password(this.password)})}_handleAuthMD5Password(m){this._getPassword(async()=>{try{const y=await d.postgresMd5PasswordHash(this.user,this.password,m.salt);this.connection.password(y)}catch(y){this.emit("error",y)}})}_handleAuthSASL(m){this._getPassword(()=>{try{this.saslSession=s.startSession(m.mechanisms,this.enableChannelBinding&&this.connection.stream),this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism,this.saslSession.response)}catch(y){this.connection.emit("error",y)}})}async _handleAuthSASLContinue(m){try{await s.continueSession(this.saslSession,this.password,m.data,this.enableChannelBinding&&this.connection.stream),this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)}catch(y){this.connection.emit("error",y)}}_handleAuthSASLFinal(m){try{s.finalizeSession(this.saslSession,m.data),this.saslSession=null}catch(y){this.connection.emit("error",y)}}_handleBackendKeyData(m){this.processID=m.processID,this.secretKey=m.secretKey}_handleReadyForQuery(m){this._connecting&&(this._connecting=!1,this._connected=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback&&(this._connectionCallback(null,this),this._connectionCallback=null),this.emit("connect"));const y=this._getActiveQuery();this._activeQuery=null,this.readyForQuery=!0,y&&y.handleReadyForQuery(this.connection),this._pulseQueryQueue()}_handleErrorWhileConnecting(m){if(!this._connectionError){if(this._connectionError=!0,clearTimeout(this.connectionTimeoutHandle),this._connectionCallback)return this._connectionCallback(m);this.emit("error",m)}}_handleErrorEvent(m){if(this._connecting)return this._handleErrorWhileConnecting(m);this._queryable=!1,this._errorAllQueries(m),this.emit("error",m)}_handleErrorMessage(m){if(this._connecting)return this._handleErrorWhileConnecting(m);const y=this._getActiveQuery();if(!y){this._handleErrorEvent(m);return}this._activeQuery=null,y.handleError(m,this.connection)}_handleRowDescription(m){const y=this._getActiveQuery();if(y==null){const w=new Error("Received unexpected rowDescription message from backend.");this._handleErrorEvent(w);return}y.handleRowDescription(m)}_handleDataRow(m){const y=this._getActiveQuery();if(y==null){const w=new Error("Received unexpected dataRow message from backend.");this._handleErrorEvent(w);return}y.handleDataRow(m)}_handlePortalSuspended(m){const y=this._getActiveQuery();if(y==null){const w=new Error("Received unexpected portalSuspended message from backend.");this._handleErrorEvent(w);return}y.handlePortalSuspended(this.connection)}_handleEmptyQuery(m){const y=this._getActiveQuery();if(y==null){const w=new Error("Received unexpected emptyQuery message from backend.");this._handleErrorEvent(w);return}y.handleEmptyQuery(this.connection)}_handleCommandComplete(m){const y=this._getActiveQuery();if(y==null){const w=new Error("Received unexpected commandComplete message from backend.");this._handleErrorEvent(w);return}y.handleCommandComplete(m,this.connection)}_handleParseComplete(){const m=this._getActiveQuery();if(m==null){const y=new Error("Received unexpected parseComplete message from backend.");this._handleErrorEvent(y);return}m.name&&(this.connection.parsedStatements[m.name]=m.text)}_handleCopyInResponse(m){const y=this._getActiveQuery();if(y==null){const w=new Error("Received unexpected copyInResponse message from backend.");this._handleErrorEvent(w);return}y.handleCopyInResponse(this.connection)}_handleCopyData(m){const y=this._getActiveQuery();if(y==null){const w=new Error("Received unexpected copyData message from backend.");this._handleErrorEvent(w);return}y.handleCopyData(m,this.connection)}_handleNotification(m){this.emit("notification",m)}_handleNotice(m){this.emit("notice",m)}getStartupConf(){const m=this.connectionParameters,y={user:m.user,database:m.database},w=m.application_name||m.fallback_application_name;return w&&(y.application_name=w),m.replication&&(y.replication=""+m.replication),m.statement_timeout&&(y.statement_timeout=String(parseInt(m.statement_timeout,10))),m.lock_timeout&&(y.lock_timeout=String(parseInt(m.lock_timeout,10))),m.idle_in_transaction_session_timeout&&(y.idle_in_transaction_session_timeout=String(parseInt(m.idle_in_transaction_session_timeout,10))),m.options&&(y.options=m.options),y}cancel(m,y){if(m.activeQuery===y){const w=this.connection;this.host&&this.host.indexOf("/")===0?w.connect(this.host+"/.s.PGSQL."+this.port):w.connect(this.port,this.host),w.on("connect",function(){w.cancel(m.processID,m.secretKey)})}else m._queryQueue.indexOf(y)!==-1&&m._queryQueue.splice(m._queryQueue.indexOf(y),1)}setTypeParser(m,y,w){return this._types.setTypeParser(m,y,w)}getTypeParser(m,y){return this._types.getTypeParser(m,y)}escapeIdentifier(m){return t.escapeIdentifier(m)}escapeLiteral(m){return t.escapeLiteral(m)}_pulseQueryQueue(){if(this.readyForQuery===!0){this._activeQuery=this._queryQueue.shift();const m=this._getActiveQuery();if(m){this.readyForQuery=!1,this.hasExecuted=!0;const y=m.submit(this.connection);y&&process.nextTick(()=>{m.handleError(y,this.connection),this.readyForQuery=!0,this._pulseQueryQueue()})}else this.hasExecuted&&(this._activeQuery=null,this.emit("drain"))}}query(m,y,w){let x,O,A,g,E;if(m==null)throw new TypeError("Client was passed a null or undefined query");return typeof m.submit=="function"?(A=m.query_timeout||this.connectionParameters.query_timeout,O=x=m,x.callback||(typeof y=="function"?x.callback=y:w&&(x.callback=w))):(A=m.query_timeout||this.connectionParameters.query_timeout,x=new o(m,y,w),x.callback||(O=new this._Promise((_,T)=>{x.callback=(C,I)=>C?T(C):_(I)}).catch(_=>{throw Error.captureStackTrace(_),_}))),A&&(E=x.callback||(()=>{}),g=setTimeout(()=>{const _=new Error("Query read timeout");process.nextTick(()=>{x.handleError(_,this.connection)}),E(_),x.callback=()=>{};const T=this._queryQueue.indexOf(x);T>-1&&this._queryQueue.splice(T,1),this._pulseQueryQueue()},A),x.callback=(_,T)=>{clearTimeout(g),E(_,T)}),this.binary&&!x.binary&&(x.binary=!0),x._result&&!x._result._types&&(x._result._types=this._types),this._queryable?this._ending?(process.nextTick(()=>{x.handleError(new Error("Client was closed and is not queryable"),this.connection)}),O):(this._queryQueue.length>0&&h(),this._queryQueue.push(x),this._pulseQueryQueue(),O):(process.nextTick(()=>{x.handleError(new Error("Client has encountered a connection error and is not queryable"),this.connection)}),O)}ref(){this.connection.ref()}unref(){this.connection.unref()}end(m){if(this._ending=!0,!this.connection._connecting||this._ended)if(m)m();else return this._Promise.resolve();if(this._getActiveQuery()||!this._queryable?this.connection.stream.destroy():this.connection.end(),m)this.connection.once("end",m);else return new this._Promise(y=>{this.connection.once("end",y)})}get queryQueue(){return f(),this._queryQueue}}return b.Query=o,Dr=b,Dr}var jr,yi;function ua(){if(yi)return jr;yi=1;const e=ze.EventEmitter,t=function(){},r=(d,a)=>{const f=d.findIndex(a);return f===-1?void 0:d.splice(f,1)[0]};class s{constructor(a,f,c){this.client=a,this.idleListener=f,this.timeoutId=c}}class i{constructor(a){this.callback=a}}function n(){throw new Error("Release called on client which has already been released to the pool.")}function o(d,a){if(a)return{callback:a,result:void 0};let f,c;const p=function(b,v){b?f(b):c(v)},h=new d(function(b,v){c=b,f=v}).catch(b=>{throw Error.captureStackTrace(b),b});return{callback:p,result:h}}function l(d,a){return function f(c){c.client=a,a.removeListener("error",f),a.on("error",()=>{d.log("additional client error after disconnection due to error",c)}),d._remove(a),d.emit("error",c,a)}}class u extends e{constructor(a,f){super(),this.options=Object.assign({},a),a!=null&&"password"in a&&Object.defineProperty(this.options,"password",{configurable:!0,enumerable:!1,writable:!0,value:a.password}),a!=null&&a.ssl&&a.ssl.key&&Object.defineProperty(this.options.ssl,"key",{enumerable:!1}),this.options.max=this.options.max||this.options.poolSize||10,this.options.min=this.options.min||0,this.options.maxUses=this.options.maxUses||1/0,this.options.allowExitOnIdle=this.options.allowExitOnIdle||!1,this.options.maxLifetimeSeconds=this.options.maxLifetimeSeconds||0,this.log=this.options.log||function(){},this.Client=this.options.Client||f||hn().Client,this.Promise=this.options.Promise||Wr.Promise,typeof this.options.idleTimeoutMillis>"u"&&(this.options.idleTimeoutMillis=1e4),this._clients=[],this._idle=[],this._expired=new WeakSet,this._pendingQueue=[],this._endCallback=void 0,this.ending=!1,this.ended=!1}_promiseTry(a){const f=this.Promise;return typeof f.try=="function"?f.try(a):new f(c=>c(a()))}_isFull(){return this._clients.length>=this.options.max}_isAboveMin(){return this._clients.length>this.options.min}_pulseQueue(){if(this.log("pulse queue"),this.ended){this.log("pulse queue ended");return}if(this.ending){this.log("pulse queue on ending"),this._idle.length&&this._idle.slice().map(f=>{this._remove(f.client)}),this._clients.length||(this.ended=!0,this._endCallback());return}if(!this._pendingQueue.length){this.log("no queued requests");return}if(!this._idle.length&&this._isFull())return;const a=this._pendingQueue.shift();if(this._idle.length){const f=this._idle.pop();clearTimeout(f.timeoutId);const c=f.client;c.ref&&c.ref();const p=f.idleListener;return this._acquireClient(c,a,p,!1)}if(!this._isFull())return this.newClient(a);throw new Error("unexpected condition")}_remove(a,f){const c=r(this._idle,h=>h.client===a);c!==void 0&&clearTimeout(c.timeoutId),this._clients=this._clients.filter(h=>h!==a);const p=this;a.end(()=>{p.emit("remove",a),typeof f=="function"&&f()})}connect(a){if(this.ending){const p=new Error("Cannot use a pool after calling end on the pool");return a?a(p):this.Promise.reject(p)}const f=o(this.Promise,a),c=f.result;if(this._isFull()||this._idle.length){if(this._idle.length&&process.nextTick(()=>this._pulseQueue()),!this.options.connectionTimeoutMillis)return this._pendingQueue.push(new i(f.callback)),c;const p=(v,m,y)=>{clearTimeout(b),f.callback(v,m,y)},h=new i(p),b=setTimeout(()=>{r(this._pendingQueue,v=>v.callback===p),h.timedOut=!0,f.callback(new Error("timeout exceeded when trying to connect"))},this.options.connectionTimeoutMillis);return b.unref&&b.unref(),this._pendingQueue.push(h),c}return this.newClient(new i(f.callback)),c}newClient(a){const f=new this.Client(this.options);this._clients.push(f);const c=l(this,f);this.log("checking client timeout");let p,h=!1;this.options.connectionTimeoutMillis&&(p=setTimeout(()=>{f.connection?(this.log("ending client due to timeout"),h=!0,f.connection.stream.destroy()):f.isConnected()||(this.log("ending client due to timeout"),h=!0,f.end())},this.options.connectionTimeoutMillis)),this.log("connecting new client"),f.connect(b=>{if(p&&clearTimeout(p),f.on("error",c),b)this.log("client failed to connect",b),this._clients=this._clients.filter(v=>v!==f),h&&(b=new Error("Connection terminated due to connection timeout",{cause:b})),this._pulseQueue(),a.timedOut||a.callback(b,void 0,t);else{if(this.log("new client connected"),this.options.onConnect){this._promiseTry(()=>this.options.onConnect(f)).then(()=>{this._afterConnect(f,a,c)},v=>{this._clients=this._clients.filter(m=>m!==f),f.end(()=>{this._pulseQueue(),a.timedOut||a.callback(v,void 0,t)})});return}return this._afterConnect(f,a,c)}})}_afterConnect(a,f,c){if(this.options.maxLifetimeSeconds!==0){const p=setTimeout(()=>{this.log("ending client due to expired lifetime"),this._expired.add(a),this._idle.findIndex(b=>b.client===a)!==-1&&this._acquireClient(a,new i((b,v,m)=>m()),c,!1)},this.options.maxLifetimeSeconds*1e3);p.unref(),a.once("end",()=>clearTimeout(p))}return this._acquireClient(a,f,c,!0)}_acquireClient(a,f,c,p){p&&this.emit("connect",a),this.emit("acquire",a),a.release=this._releaseOnce(a,c),a.removeListener("error",c),f.timedOut?p&&this.options.verify?this.options.verify(a,a.release):a.release():p&&this.options.verify?this.options.verify(a,h=>{if(h)return a.release(h),f.callback(h,void 0,t);f.callback(void 0,a,a.release)}):f.callback(void 0,a,a.release)}_releaseOnce(a,f){let c=!1;return p=>{c&&n(),c=!0,this._release(a,f,p)}}_release(a,f,c){if(a.on("error",f),a._poolUseCount=(a._poolUseCount||0)+1,this.emit("release",c,a),c||this.ending||!a._queryable||a._ending||a._poolUseCount>=this.options.maxUses)return a._poolUseCount>=this.options.maxUses&&this.log("remove expended client"),this._remove(a,this._pulseQueue.bind(this));if(this._expired.has(a))return this.log("remove expired client"),this._expired.delete(a),this._remove(a,this._pulseQueue.bind(this));let h;this.options.idleTimeoutMillis&&this._isAboveMin()&&(h=setTimeout(()=>{this._isAboveMin()&&(this.log("remove idle client"),this._remove(a,this._pulseQueue.bind(this)))},this.options.idleTimeoutMillis),this.options.allowExitOnIdle&&h.unref()),this.options.allowExitOnIdle&&a.unref(),this._idle.push(new s(a,f,h)),this._pulseQueue()}query(a,f,c){if(typeof a=="function"){const h=o(this.Promise,a);return setImmediate(function(){return h.callback(new Error("Passing a function as the first parameter to pool.query is not supported"))}),h.result}typeof f=="function"&&(c=f,f=void 0);const p=o(this.Promise,c);return c=p.callback,this.connect((h,b)=>{if(h)return c(h);let v=!1;const m=y=>{v||(v=!0,b.release(y),c(y))};b.once("error",m),this.log("dispatching query");try{b.query(a,f,(y,w)=>{if(this.log("query dispatched"),b.removeListener("error",m),!v)return v=!0,b.release(y),y?c(y):c(void 0,w)})}catch(y){return b.release(y),c(y)}}),p.result}end(a){if(this.log("ending"),this.ending){const c=new Error("Called end on pool more than once");return a?a(c):this.Promise.reject(c)}this.ending=!0;const f=o(this.Promise,a);return this._endCallback=f.callback,this._pulseQueue(),f.result}get waitingCount(){return this._pendingQueue.length}get idleCount(){return this._idle.length}get expiredCount(){return this._clients.reduce((a,f)=>a+(this._expired.has(f)?1:0),0)}get totalCount(){return this._clients.length}}return jr=u,jr}var kr={exports:{}};const da={},fa=Object.freeze(Object.defineProperty({__proto__:null,default:da},Symbol.toStringTag,{value:"Module"})),pa=oo(fa);var Br={exports:{}},vi;function ma(){if(vi)return Br.exports;vi=1;const e=ze.EventEmitter,t=He,r=tt(),s=Br.exports=function(n,o,l){e.call(this),n=r.normalizeQueryConfig(n,o,l),this.text=n.text,this.values=n.values,this.name=n.name,this.queryMode=n.queryMode,this.callback=n.callback,this.state="new",this._arrayMode=n.rowMode==="array",this._emitRowEvents=!1,this.on("newListener",(function(u){u==="row"&&(this._emitRowEvents=!0)}).bind(this))};t.inherits(s,e);const i={sqlState:"code",statementPosition:"position",messagePrimary:"message",context:"where",schemaName:"schema",tableName:"table",columnName:"column",dataTypeName:"dataType",constraintName:"constraint",sourceFile:"file",sourceLine:"line",sourceFunction:"routine"};return s.prototype.handleError=function(n){const o=this.native.pq.resultErrorFields();if(o)for(const l in o){const u=i[l]||l;n[u]=o[l]}this.callback?this.callback(n):this.emit("error",n),this.state="error"},s.prototype.then=function(n,o){return this._getPromise().then(n,o)},s.prototype.catch=function(n){return this._getPromise().catch(n)},s.prototype._getPromise=function(){return this._promise?this._promise:(this._promise=new Promise((function(n,o){this._once("end",n),this._once("error",o)}).bind(this)),this._promise)},s.prototype.submit=function(n){this.state="running";const o=this;this.native=n.native,n.native.arrayMode=this._arrayMode;let l=function(u,d,a){if(n.native.arrayMode=!1,setImmediate(function(){o.emit("_done")}),u)return o.handleError(u);o._emitRowEvents&&(a.length>1?d.forEach((f,c)=>{f.forEach(p=>{o.emit("row",p,a[c])})}):d.forEach(function(f){o.emit("row",f,a)})),o.state="end",o.emit("end",a),o.callback&&o.callback(null,a)};if(process.domain&&(l=process.domain.bind(l)),this.name){this.name.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",this.name,this.name.length),console.error("This can cause conflicts and silent errors executing queries"));const u=(this.values||[]).map(r.prepareValue);if(n.namedQueries[this.name]){if(this.text&&n.namedQueries[this.name]!==this.text){const d=new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);return l(d)}return n.native.execute(this.name,u,l)}return n.native.prepare(this.name,this.text,u.length,function(d){return d?l(d):(n.namedQueries[o.name]=o.text,o.native.execute(o.name,u,l))})}else if(this.values){if(!Array.isArray(this.values)){const d=new Error("Query values must be an array");return l(d)}const u=this.values.map(r.prepareValue);n.native.query(this.text,u,l)}else this.queryMode==="extended"?n.native.query(this.text,[],l):n.native.query(this.text,l)},Br.exports}var wi;function ha(){if(wi)return kr.exports;wi=1;const e=He;var t;try{t=pa}catch(d){throw d}const r=Jr(),s=ze.EventEmitter,i=He,n=un(),o=ma(),l=e.deprecate(()=>{},"Calling client.query() when the client is already executing a query is deprecated and will be removed in pg@9.0. Use async/await or an external async flow control mechanism instead."),u=kr.exports=function(d){s.call(this),d=d||{},this._Promise=d.Promise||Wr.Promise,this._types=new r(d.types),this.native=new t({types:this._types}),this._queryQueue=[],this._ending=!1,this._connecting=!1,this._connected=!1,this._queryable=!0;const a=this.connectionParameters=new n(d);d.nativeConnectionString&&(a.nativeConnectionString=d.nativeConnectionString),this.user=a.user,Object.defineProperty(this,"password",{configurable:!0,enumerable:!1,writable:!0,value:a.password}),this.database=a.database,this.host=a.host,this.port=a.port,this.namedQueries={}};return u.Query=o,i.inherits(u,s),u.prototype._errorAllQueries=function(d){const a=f=>{process.nextTick(()=>{f.native=this.native,f.handleError(d)})};this._hasActiveQuery()&&(a(this._activeQuery),this._activeQuery=null),this._queryQueue.forEach(a),this._queryQueue.length=0},u.prototype._connect=function(d){const a=this;if(this._connecting){process.nextTick(()=>d(new Error("Client has already been connected. You cannot reuse a client.")));return}this._connecting=!0,this.connectionParameters.getLibpqConnectionString(function(f,c){if(a.connectionParameters.nativeConnectionString&&(c=a.connectionParameters.nativeConnectionString),f)return d(f);a.native.connect(c,function(p){if(p)return a.native.end(),d(p);a._connected=!0,a.native.on("error",function(h){a._queryable=!1,a._errorAllQueries(h),a.emit("error",h)}),a.native.on("notification",function(h){a.emit("notification",{channel:h.relname,payload:h.extra})}),a.emit("connect"),a._pulseQueryQueue(!0),d(null,this)})})},u.prototype.connect=function(d){if(d){this._connect(d);return}return new this._Promise((a,f)=>{this._connect(c=>{c?f(c):a(this)})})},u.prototype.query=function(d,a,f){let c,p,h,b,v;if(d==null)throw new TypeError("Client was passed a null or undefined query");if(typeof d.submit=="function")h=d.query_timeout||this.connectionParameters.query_timeout,p=c=d,typeof a=="function"&&(d.callback=a);else if(h=d.query_timeout||this.connectionParameters.query_timeout,c=new o(d,a,f),!c.callback){let m,y;p=new this._Promise((w,x)=>{m=w,y=x}).catch(w=>{throw Error.captureStackTrace(w),w}),c.callback=(w,x)=>w?y(w):m(x)}return h&&(v=c.callback||(()=>{}),b=setTimeout(()=>{const m=new Error("Query read timeout");process.nextTick(()=>{c.handleError(m,this.connection)}),v(m),c.callback=()=>{};const y=this._queryQueue.indexOf(c);y>-1&&this._queryQueue.splice(y,1),this._pulseQueryQueue()},h),c.callback=(m,y)=>{clearTimeout(b),v(m,y)}),this._queryable?this._ending?(c.native=this.native,process.nextTick(()=>{c.handleError(new Error("Client was closed and is not queryable"))}),p):(this._queryQueue.length>0&&l(),this._queryQueue.push(c),this._pulseQueryQueue(),p):(c.native=this.native,process.nextTick(()=>{c.handleError(new Error("Client has encountered a connection error and is not queryable"))}),p)},u.prototype.end=function(d){const a=this;this._ending=!0,this._connected||this.once("connect",this.end.bind(this,d));let f;return d||(f=new this._Promise(function(c,p){d=h=>h?p(h):c()})),this.native.end(function(){a._connected=!1,a._errorAllQueries(new Error("Connection terminated")),process.nextTick(()=>{a.emit("end"),d&&d()})}),f},u.prototype._hasActiveQuery=function(){return this._activeQuery&&this._activeQuery.state!=="error"&&this._activeQuery.state!=="end"},u.prototype._pulseQueryQueue=function(d){if(!this._connected||this._hasActiveQuery())return;const a=this._queryQueue.shift();if(!a){d||this.emit("drain");return}this._activeQuery=a,a.submit(this);const f=this;a.once("_done",function(){f._pulseQueryQueue()})},u.prototype.cancel=function(d){this._activeQuery===d?this.native.cancel(function(){}):this._queryQueue.indexOf(d)!==-1&&this._queryQueue.splice(this._queryQueue.indexOf(d),1)},u.prototype.ref=function(){},u.prototype.unref=function(){},u.prototype.setTypeParser=function(d,a,f){return this._types.setTypeParser(d,a,f)},u.prototype.getTypeParser=function(d,a){return this._types.getTypeParser(d,a)},u.prototype.isConnected=function(){return this._connected},kr.exports}var Mr,Ei;function _i(){return Ei||(Ei=1,Mr=ha()),Mr}var xi;function hn(){return xi||(xi=1,(function(e){var t={};const r=ca(),s=At(),i=mn(),n=dn(),o=tt(),l=ua(),u=Jr(),{DatabaseError:d}=pn(),{escapeIdentifier:a,escapeLiteral:f}=tt(),c=v=>class extends l{constructor(y){super(y,v)}},p=function(v){this.defaults=s,this.Client=v,this.Query=this.Client.Query,this.Pool=c(this.Client),this._pools=[],this.Connection=i,this.types=St(),this.DatabaseError=d,this.TypeOverrides=u,this.escapeIdentifier=a,this.escapeLiteral=f,this.Result=n,this.utils=o};let h=r,b=!1;try{b=!!t.NODE_PG_FORCE_NATIVE}catch{}b&&(h=_i()),e.exports=new p(h),Object.defineProperty(e.exports,"native",{configurable:!0,enumerable:!1,get(){let v=null;try{v=new p(_i())}catch(m){if(m.code!=="MODULE_NOT_FOUND")throw m}return Object.defineProperty(e.exports,"native",{value:v}),v}})})(lr)),lr.exports}var ga=hn();const ee=en(ga);ee.Client;const ba=ee.Pool;ee.Connection;ee.types;ee.Query;ee.DatabaseError;ee.escapeIdentifier;ee.escapeLiteral;ee.Result;ee.TypeOverrides;ee.defaults;const ya=Object.freeze(Object.defineProperty({__proto__:null,Pool:ba,default:ee},Symbol.toStringTag,{value:"Module"}));export{Ds as default};
