var Nx=(r,t)=>()=>(t||r((t={exports:{}}).exports,t),t.exports);var uS=Nx(N=>{(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))e(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&e(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();function L({tag:r="span",className:t,id:n,content:e,title:a,elementRoot:i,tabIndex:o=!1,attributes:A={},style:x=!1,innerHTML:E=!1,onClick:l=!1,doc:T=document}={}){if(!T||!T.createElement)return console.warn("no document or createElement"),console.warn(T),"";const s=T.createElement(r);if(t&&s.setAttribute("class",t),n?s.setAttribute("id",n):window.getUniqueControlID&&s.setAttribute("id",document.getUniqueControlID()),e&&(s.innerHTML=e),a&&s.setAttribute("title",a),i&&(s.elementRoot=i),o===!0?s.setAttribute("tabIndex","0"):o!==!1&&s.setAttribute("tabIndex",o),Object.keys(A).forEach(c=>s.setAttribute(c,A[c])),x&&s.setAttribute("style",x),E){const c=document.createElement("template");c.innerHTML=E,s.appendChild(c.content)}return l&&s.addEventListener("click",l),s}function y(r,t=[]){Array.isArray(t)?t.forEach(n=>{Array.isArray(n)?y(r,n):r.appendChild(n)}):r.appendChild(t)}function b(r){return L({innerHTML:r}).firstElementChild}function Nn(r,t){r.parentNode.insertBefore(t,r.nextSibling)}const Dx="*{box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:var(--global-transition)}:host{margin-right:8px;display:inline-block;width:max-content;min-width:40px;--fancy-gradient: linear-gradient( 135deg, var(--blue-l55), var(--purple-l45), var(--orange-l50), var(--purple-l45), var(--blue-l55), var(--purple-l45) );--fancy-animation: gradFade 120s linear infinite;--fancy-background-size: 500% 500%}@keyframes gradFade{0%{background-position:0% 0%}to{background-position:100% 100%}}:host(:active) .wrapper{top:1px;left:1px;box-shadow:none}:host([disabled]:active) .wrapper{top:0;left:0}.wrapper{display:inline-block;position:relative;top:0;left:0;margin:0;padding:2px;height:100%;width:100%;border-style:solid;border-width:0px;border-radius:5px;animation:var(--fancy-animation);box-shadow:var(--l2-shadow);background:var(--fancy-gradient);background-size:var(--fancy-background-size)}.wrapper:hover,.wrapper *:hover,.wrapper:focus,.wrapper *:focus{cursor:pointer}.wrapper:focus{outline:var(--global-focus-style)}.buttonContent{display:flex;align-items:center;padding:0;border-radius:3px;background-color:transparent;width:100%;height:100%}.buttonText{display:inline-block;width:max-content;height:max-content;margin:5px 10px;color:#fff;animation:var(--fancy-animation);background-color:transparent}.wrapper[secondary] .buttonContent{background-color:#fffffff2}.wrapper[secondary] .buttonText{background:var(--fancy-gradient);background-size:var(--fancy-background-size);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.wrapper:hover .buttonContent,.wrapper:active .buttonContent{background-color:#ffffff1a}.wrapper[secondary]:hover .buttonContent,.wrapper[secondary]:active .buttonContent{background-color:#fff}.wrapper[minimal]{padding:1px;box-shadow:var(--l1-shadow);background:linear-gradient(135deg,var(--blue-l70),var(--blue-l90));animation:var(--fancy-animation)}.wrapper[minimal] .buttonContent{background-color:#fffffff2}.wrapper[minimal] .buttonText{background:linear-gradient(135deg,var(--blue-l70),var(--blue-l90));background-size:var(--fancy-background-size);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.wrapper[minimal]:hover,.wrapper[minimal]:active{box-shadow:var(--l2-shadow);background:linear-gradient(135deg,var(--blue-l40),var(--blue-l70))}.wrapper[minimal]:hover .buttonContent,.wrapper[minimal]:active .buttonContent{background-color:#fff}.wrapper[minimal]:hover .buttonText,.wrapper[minimal]:active .buttonText{background:linear-gradient(135deg,var(--blue-l40),var(--blue-l70));background-size:var(--fancy-background-size);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.wrapper[danger]{background:linear-gradient(135deg,var(--orange-l50),var(--red));animation:var(--fancy-animation)}.wrapper[danger] .buttonText{background:white;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.wrapper[secondary][danger] .buttonText{background:var(--red);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.wrapper[disabled],.wrapper[disabled]:hover,.wrapper[disabled]:focus,.wrapper[disabled]:active{background-image:none;background-color:var(--disabled-border);cursor:default;box-shadow:none}.wrapper[disabled] .buttonContent,.wrapper[disabled]:hover .buttonContent,.wrapper[disabled]:focus .buttonContent,.wrapper[disabled]:active .buttonContent{background-color:var(--disabled-background);cursor:default}.wrapper[disabled] .buttonText,.wrapper[disabled]:hover .buttonText,.wrapper[disabled]:focus .buttonText,.wrapper[disabled]:active .buttonText{background-color:var(--disabled-background);background-clip:none;-webkit-text-fill-color:var(--disabled-border);color:var(--disabled-border);cursor:default}";class Ox extends HTMLElement{constructor(t={}){super(),Object.keys(t).forEach(a=>this.setAttribute(a,t[a])),this.wrapper=L({className:"wrapper"}),this.buttonContent=L({className:"buttonContent"}),this.buttonText=L({tag:"slot",className:"buttonText"}),this.hasAttribute("secondary")&&this.wrapper.setAttribute("secondary",""),this.hasAttribute("danger")&&this.wrapper.setAttribute("danger",""),this.hasAttribute("minimal")&&this.wrapper.setAttribute("minimal",""),this.hasAttribute("disabled")?(this.wrapper.setAttribute("disabled",""),this.disabled=!0):(this.wrapper.setAttribute("tabIndex","0"),this.disabled=!1);let n=this.attachShadow({mode:"open"}),e=L({tag:"style",innerHTML:Dx});n.appendChild(e),this.buttonContent.appendChild(this.buttonText),this.wrapper.appendChild(this.buttonContent),n.appendChild(this.wrapper),this.disabled||(this.addEventListener("click",this.toggle),this.addEventListener("keydown",this.keyPress))}static get observedAttributes(){return["disabled","secondary","danger","minimal"]}attributeChangedCallback(t,n,e){t==="disabled"&&(e===""?this.wrapper.setAttribute("disabled",""):n===""&&this.wrapper.removeAttribute("disabled")),t==="secondary"&&(e===""?this.wrapper.setAttribute("secondary",""):n===""&&this.wrapper.removeAttribute("secondary")),t==="danger"&&(e===""?this.wrapper.setAttribute("danger",""):n===""&&this.wrapper.removeAttribute("danger")),t==="minimal"&&(e===""?this.wrapper.setAttribute("minimal",""):n===""&&this.wrapper.removeAttribute("minimal"))}keyPress(t){if(t.keyCode===13){let n=new MouseEvent("click",{shiftKey:t.shiftKey,ctrlKey:t.ctrlKey,altKey:t.altKey,metaKey:t.metaKey});this.dispatchEvent(n),this.flashAsPressed(this)}}flashAsPressed(t){t.wrapper.style.top="1px",t.wrapper.style.left="1px",t.wrapper.style.boxShadow="none",setTimeout(function(){t.wrapper.style.top="0px",t.wrapper.style.left="0px",t.wrapper.style.boxShadow="2px 2px 2px rgba(0, 0, 0, 0.3)"},100)}}function ur(r){for(const t of Object.keys(r))return t;return!1}function Mo(r,t){let n=1;t=t||"id";let e=""+t+n;for(;r[e];)n+=1,e=""+t+n;return e}function mt(r){return Object.keys(r).length}function Zt(r){try{return structuredClone(r)}catch{const n=Array.isArray(r)?[]:{};for(const e of Object.keys(r))r[e]&&typeof r[e]=="object"&&e!=="parent"&&e!=="cache"?n[e]=Zt(r[e]):n[e]=r[e];return n}}function zn(r,t){if(r=Zt(r),t)return JSON.stringify(r);{let n=JSON.stringify(r,void 0,2);return n=n||"",n=n.replace(/\n/g,`\r
`),n=n.replaceAll(`\r
                  "`,'"'),n=n.replaceAll(`\r
                }`,"}"),n=n.replaceAll(`\r
                "`,'"'),n=n.replaceAll(`\r
              }`,"}"),n=n.replaceAll('},"','}, "'),n}}function Go(r,t){if(typeof r!="object"&&typeof t!="object")return r===t;for(const n of Object.keys(r))if(t[n]){if(typeof r[n]=="object"&&typeof t[n]=="object"){if(!Go(r[n],t[n]))return!1}else if(r[n]!==t[n])return!1}else return!1;return!0}function lt(r,t,n=1){return!!(r.x===t.x&&r.y===t.y||a0(r.x,t.x,n)&&a0(r.y,t.y,n))}function a0(r,t,n=1){return r===t||Math.abs(r-t)<=n}function ut(r,t){const n=t?1:-1;return R(r)+.5*n}function R(r,t=0){return r&&+(Math.round(`${r}e${t}`)+`e-${t}`)||0}function Vt(r){r=parseFloat(r);const t=""+r;return(t.indexOf("0000")>-1||t.indexOf("9999")>-1)&&(r=R(r,3)),r<1e-5&&r>0&&(r=0),r}function Po(r){return r=parseFloat(r),!(isNaN(r)||r!==Math.round(r))}function G0(r=""){return r=String(r),r.replace(/[<>'"\\]/g,"")}function P0(r=""){if(r=String(r),r==='""'||r==="''")return"";try{return r=r.replace(/^\s+|\s+$/g,""),r.replace(/(\r\n|\n|\r|\t)/gm,"")}catch{return""}}function yr(r="",t=""){return r=String(r),r=r.split(t),r=r.join(""),r||""}function bo(r=""){let t="";for(let n=0;n<r.length;n++){let e=r.charCodeAt(n);e<=90&&e>=65&&(t+="-"),t+=r.charAt(n).toLowerCase()}return t}function mx(r=""){let t="";for(let n=0;n<r.length;n++)r.charAt(n)==="-"?(n++,t+=r.charAt(n).toUpperCase()):t+=r.charAt(n);return t}function Uo(r=""){if(typeof r=="string"){if(r==='""'||r==="''")return"";r.indexOf("&")>-1&&(r=r.replace(/&/g,"&amp;")),r.indexOf('"')>-1&&(r=r.replace(/"/g,"&quot;")),r.indexOf("'")>-1&&(r=r.replace(/'/g,"&apos;")),r.indexOf("<")>-1&&(r=r.replace(/</g,"&lt;")),r.indexOf(">")>-1&&(r=r.replace(/>/g,"&gt;"))}return r}function j(r){return r===0||r===!1?!0:r==null||typeof r=="object"&&Object.keys(r).length===0?!1:!!r}function Ta(r){if(!r)return!0;for(const t of Object.keys(r))if(!j(r[t])||r[t]===Number.MAX_SAFE_INTEGER||r[t]===Number.MIN_SAFE_INTEGER)return!0;return!1}function or(r,t,n){return n.indexOf(r)===t}function Hn(r=10){return new Promise(t=>{setTimeout(()=>{t("fast")},r)})}const Ee=["top-left","middle-left","baseline-left","bottom-left","top-center","middle-center","baseline-center","bottom-center","top-right","middle-right","baseline-right","bottom-right"];function b0(r=0,t=0,n,e){Ee.indexOf(e)<0&&(e="baseline-left");let a={deltaX:0,deltaY:0};if(t!==0&&(e.includes("top")&&(a.deltaY=t*-1),e.includes("middle")&&(a.deltaY=t/-2),e.includes("baseline"))){let i=(t+n.height)/n.height,o=n.yMax*i,A=(n.yMax-o)*-1;a.deltaY=A-t}return r!==0&&(e.includes("right")&&(a.deltaX=r*-1),e.includes("center")&&(a.deltaX=r/-2)),a}function Zr(r,t={x:0,y:0}){let n=Math.atan2(r.y-t.y,r.x-t.x);return isNaN(n)&&(console.warn(`calculateAngle returned NaN
`+zn(r)+`
${n}`),this.wrapper=L({className:"wrapper"}),this.wrapper.style.backgroundSize=`auto ${i}px`,this.hasAttribute("selected")&&this.wrapper.setAttribute("selected",""),this.showingOtherProject&&this.removeAttribute("selected"),this.glyph&&this.glyph.advanceWidth?(this.thumbnail=L({tag:"span",className:"thumbnail"}),this.thumbnail.width=i,this.thumbnail.height=i):(this.thumbnail=L({className:"thumbnail"}),Xo(yr(n,"glyph-"))?this.thumbnail.innerHTML=`
					<div class="whitespace-char-thumbnail">white space</div>
				`:e?this.thumbnail.innerHTML=e:this.thumbnail.innerHTML=`
						<div class="whitespace-char-thumbnail">${n}</div>
					`),this.name=L({className:"name"}),e?this.name.innerHTML=n==="glyph-0x20"?"Space":e:this.name.innerHTML=a.replaceAll("Component ","comp-");const o=this.attachShadow({mode:"open"}),A=L({tag:"style",innerHTML:vx});o.appendChild(A),this.wrapper.appendChild(this.thumbnail),this.wrapper.appendChild(this.name),o.appendChild(this.wrapper),this.redraw()}attributeChangedCallback(){const t=this.shadowRoot?this.shadowRoot.querySelector(".wrapper"):!1;t&&!this.showingOtherProject&&(this.hasAttribute("selected")?t.setAttribute("selected",""):t.removeAttribute("selected"))}redraw(){var t,n;(n=(t=this.glyph)==null?void 0:t.shapes)!=null&&n.length&&(this.thumbnail.innerHTML=this.project.makeItemThumbnail(this.glyph))}}const it={gray:{l97:"hsl(200, 81%, 97%)",l95:"hsl(200, 81%, 94%)",l90:"hsl(200, 60%, 88%)",l85:"hsl(200, 52%, 82%)",l80:"hsl(200, 47%, 76%)",l75:"hsl(200, 42%, 71%)",l70:"hsl(200, 33%, 65%)",l65:"hsl(200, 27%, 60%)",l60:"hsl(200, 22%, 55%)",l55:"hsl(200, 18%, 50%)",l50:"hsl(200, 17%, 45%)",l45:"hsl(200, 17%, 40%)",l40:"hsl(200, 18%, 36%)",l35:"hsl(200, 18%, 31%)",l30:"hsl(200, 17%, 27%)",l25:"hsl(200, 18%, 23%)",l20:"hsl(200, 18%, 19%)",l15:"hsl(200, 17%, 15%)",l10:"hsl(200, 19%, 11%)",l05:"hsl(200, 18%, 7%)"},blue:{l95:"hsl(200, 100%, 94%)",l90:"hsl(200, 94%, 87%)",l85:"hsl(200, 100%, 80%)",l80:"hsl(200, 100%, 73%)",l75:"hsl(200, 100%, 64%)",l70:"hsl(200, 100%, 58%)",l65:"hsl(200, 100%, 49%)",l60:"hsl(200, 100%, 45%)",l55:"hsl(200, 100%, 41%)",l50:"hsl(200, 100%, 37%)",l45:"hsl(200, 100%, 33%)",l40:"hsl(200, 100%, 30%)",l35:"hsl(200, 100%, 25%)",l30:"hsl(200, 100%, 22%)",l25:"hsl(200, 100%, 19%)",l20:"hsl(200, 100%, 15%)",l15:"hsl(200, 100%, 12%)",l10:"hsl(200, 100%, 9%)",l05:"hsl(200, 100%, 6%)"},orange:{l95:"hsl(20, 100%, 95%)",l90:"hsl(20, 100%, 89%)",l85:"hsl(20, 100%, 84%)",l80:"hsl(20, 100%, 78%)",l75:"hsl(20, 100%, 72%)",l70:"hsl(20, 100%, 66%)",l65:"hsl(20, 100%, 56%)",l60:"hsl(20, 100%, 50%)",l55:"hsl(20, 100%, 46%)",l50:"hsl(20, 100%, 42%)",l45:"hsl(20, 100%, 37%)",l40:"hsl(20, 100%, 33%)",l35:"hsl(20, 100%, 29%)",l30:"hsl(20, 100%, 25%)",l25:"hsl(20, 100%, 22%)",l20:"hsl(20, 100%, 17%)",l15:"hsl(20, 100%, 14%)",l10:"hsl(20, 100%, 10%)",l05:"hsl(20, 100%, 6%)"},green:{l95:"hsl(125, 100%, 82%)",l90:"hsl(125, 97%, 74%)",l85:"hsl(125, 83%, 66%)",l80:"hsl(125, 74%, 58%)",l75:"hsl(125, 67%, 50%)",l70:"hsl(125, 82%, 43%)",l65:"hsl(125, 100%, 36%)",l60:"hsl(125, 100%, 33%)",l55:"hsl(125, 100%, 30%)",l50:"hsl(125, 100%, 27%)",l45:"hsl(125, 100%, 24%)",l40:"hsl(125, 95%, 22%)",l35:"hsl(125, 100%, 19%)",l30:"hsl(125, 100%, 16%)",l25:"hsl(125, 100%, 14%)",l20:"hsl(125, 100%, 11%)",l15:"hsl(125, 100%, 9%)",l10:"hsl(125, 100%, 6%)",l05:"hsl(125, 100%, 4%)"},purple:{l95:"hsl(285, 100%, 96%)",l90:"hsl(285, 100%, 92%)",l85:"hsl(285, 100%, 89%)",l80:"hsl(285, 100%, 85%)",l75:"hsl(285, 100%, 81%)",l70:"hsl(285, 100%, 77%)",l65:"hsl(285, 100%, 72%)",l60:"hsl(285, 100%, 66%)",l55:"hsl(285, 100%, 61%)",l50:"hsl(285, 100%, 50%)",l45:"hsl(285, 100%, 45%)",l40:"hsl(285, 100%, 40%)",l35:"hsl(285, 100%, 36%)",l30:"hsl(285, 100%, 31%)",l25:"hsl(285, 100%, 27%)",l20:"hsl(285, 100%, 22%)",l15:"hsl(285, 100%, 17%)",l10:"hsl(285, 100%, 13%)",l05:"hsl(285, 100%, 10%)"}},pi=it.blue.l65,Ur={accent:pi,offWhite:"hsl(200, 81%, 97%)",darkRed:"hsl(0, 100%, 23%)",red:"hsl(0, 100%, 48%)",lightRed:"hsl(0, 100%, 90%)",enabled:{resting:{text:"hsl(0, 0%, 5%)",lightText:"hsl(0, 0%, 10%)",border:"hsl(0, 0%, 75%)",fill:"hsl(0, 0%, 39%)",background:"hsl(0, 0%, 98%)"},restingLight:{text:"hsl(0, 0%, 20%)",lightText:"hsl(0, 0%, 30%)",border:"hsla(0, 0%, 75%, 0.2)",fill:"hsl(0, 0%, 39%, 0.4)",background:"hsl(0, 0%, 98%)"},focus:{text:"hsl(0, 0%, 0%)",lightText:"hsl(0, 0%, 10%)",border:"hsl(0, 0%, 63%)",fill:"hsl(200, 25%, 15%)",background:"white"},active:{text:"hsl(0, 0%, 0%)",lightText:"hsl(0, 0%, 10%)",border:"hsl(0, 0%, 63%)",fill:pi,background:"white"}},disabled:{text:"hsl(0, 0%, 40%)",border:"hsl(0, 0%, 82%)",fill:"hsl(0, 0%, 82%)",background:"hsl(0, 0%, 94%)"}};function le(r){const t={r:0,g:0,b:0,a:1};return typeof r!="string"||(r.charAt(0)==="#"?(r=r.substring(1,7),t.r=parseInt(r.substring(0,2),16),t.g=parseInt(r.substring(2,4),16),t.b=parseInt(r.substring(4,6),16)):r.substring(0,4)==="rgb("&&(r=r.split("(")[1].split(")")[0].split(","),t.r=parseInt(r[0],10),t.g=parseInt(r[1],10),t.b=parseInt(r[2],10),t.a=parseInt(r[3],10)||1)),t}function o0(r){let t=le(r),n=t.r.toString(16).toUpperCase();n.length===1&&(n=`0${n}`);let e=t.g.toString(16).toUpperCase();e.length===1&&(e=`0${e}`);let a=t.b.toString(16).toUpperCase();return a.length===1&&(a=`0${a}`),`#${n}${e}${a}`}function wx(r,t,n){t=Math.max(0,Math.min(t,1));const e=le(r);return e.r=Math.max(0,Math.min(e.r,255)),e.g=Math.max(0,Math.min(e.g,255)),e.b=Math.max(0,Math.min(e.b,255)),n?(e.r=R((255-e.r)*t+e.r),e.g=R((255-e.g)*t+e.g),e.b=R((255-e.b)*t+e.b)):(e.r=R(e.r-e.r*t),e.g=R(e.g-e.g*t),e.b=R(e.b-e.b*t)),`rgb(${e.r},${e.g},${e.b})`}function Er(r,t){const n=le(r),e=R((255-n.r)*(1-t)),a=R((255-n.g)*(1-t)),i=R((255-n.b)*(1-t)),o=n.r+e,A=n.g+a,x=n.b+i;return`rgb(${o},${A},${x})`}function rn(r){const t=parseInt(r);return!t||isNaN(t)?1:t>100?0:t<0?1:(100-r)/100}function jo(){const r=Math.floor(Math.random()*5)*51,t=[],n=Math.floor(Math.random()*3);switch(t[n]=r,n){case 0:t[1]=0,t[2]=255;break;case 1:t[0]=0,t[2]=255;break;case 2:t[0]=255,t[1]=0;break}return"rgb("+t[0]+","+t[1]+","+t[2]+")"}const Wx=Object.freeze(Object.defineProperty({__proto__:null,accentColors:it,getColorFromRGBA:Er,makeRandomSaturatedColor:jo,parseColorString:le,rgbToHex:o0,shiftColor:wx,transparencyToAlpha:rn,uiColors:Ur},Symbol.toStringTag,{value:"Module"}));let _={};function nn(r){let t=20;r.name&&r.name.indexOf("page_")===0&&(t=24),r.name&&r.name.indexOf("panel_")===0&&(t=24);let n=r.color||"rgb(76,81,86)",e="";return _[r.name]&&(_[r.name].outline?e=_[r.name].outline:e=_[r.name]),`
		<svg version="1.1"
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px" y="0px" width="${t}px" height="${t}px" viewBox="0 0 ${t} ${t}"
		>
			<defs></defs>
			<rect fill="transparent" width="${t}" height="${t}"/>
			<g pointer-events="none" fill="${n}">
				${e}
			</g>
		</svg>
	`}_.panel_layers=`
	<polygon points="12 9 0 4.574 12 0 24 4.5 12 9"/>
	<polygon points="12 14 0 9.5 4 8 12 11 20 8 24 9.5 12 14"/>
	<polygon points="12 19 0 14.5 4 13 12 16 20 13 24 14.5 12 19"/>
	<polygon points="12 24 0 19.5 4 18 12 21 20 18 24 19.5 12 24"/>
`;_.panel_guides=`
	<polygon points="2 17 5 20 5 17 2 17"/>
	<polygon points="24 22 0 22 0 23 24 23 24 22 24 22"/>
	<polygon points="24 7 0 7 0 8 24 8 24 7 24 7"/>
	<polygon points="24 3 0 3 0 3.5 24 3.5 24 3 24 3"/>
	<polygon points="24 1 0 1 0 2 24 2 24 1 24 1"/>
	<polygon points="24 15 0 15 0 17 24 17 24 15 24 15"/>
	<polygon points="7 0 5 0 5 24 7 24 7 0 7 0"/>
	<polygon points="22.5 0 22 0 22 24 22.5 24 22.5 0 22.5 0"/>
`;_.panel_contextCharacters=`
	<path d="m8.942,16.997h-2.672v-.55c-.412.432-.882.647-1.407.647-.53,0-.973-.213-1.329-.64s-.534-.966-.534-1.621c0-.668.193-1.221.578-1.661s.875-.66,1.469-.66c.412,0,.82.141,1.224.424v-.737c0-.375-.047-.641-.139-.796s-.259-.233-.5-.233c-.322,0-.544.181-.666.542l-1.829-.383c.539-1.006,1.455-1.508,2.747-1.508.752,0,1.344.179,1.775.535s.646.879.646,1.569v3.57h.639v1.502Zm-2.672-1.801v-1.052c-.172-.216-.367-.324-.585-.324-.2,0-.358.083-.476.252-.118.168-.177.392-.177.669,0,.272.055.482.167.63s.264.221.459.221c.24,0,.444-.132.612-.397Z"/>
	<path d="m9.547,16.997v-1.502h.666v-6.995h-.666v-1.502h2.699v3.651h.027c.299-.496.727-.745,1.285-.745.594,0,1.068.292,1.424.876s.534,1.432.534,2.545c0,1.214-.171,2.146-.513,2.795s-.828.973-1.458.973c-.499,0-.931-.218-1.299-.657v.559h-2.699Zm2.699-3.987v1.416c0,.394.042.686.126.878.084.191.232.288.445.288.249,0,.409-.147.479-.441s.105-.843.105-1.648c0-.726-.04-1.23-.119-1.509-.079-.28-.239-.42-.479-.42-.213,0-.359.109-.439.326s-.119.587-.119,1.11Z"/>
	<path d="m19.429,14.229l1.571.598c-.258,1.581-1.079,2.371-2.461,2.371-.834,0-1.49-.334-1.968-1.001s-.717-1.587-.717-2.76c0-1.057.207-1.909.622-2.559s.958-.973,1.628-.973c.644,0,1.077.29,1.299.869h.027v-.757h1.462v2.823h-1.462c-.032-.505-.11-.878-.235-1.12-.125-.241-.312-.362-.561-.362-.263,0-.44.159-.53.476s-.136.85-.136,1.6c0,.819.044,1.401.133,1.746s.296.517.622.517c.227,0,.392-.118.496-.354s.174-.608.211-1.113Z"/>
	<path d="m18,4v-1h4v-1h-5v2h-1V0h-8v4h-1v-2H2v1h4v1H0v16h6v1H2v1h5v-2h1v4h8v-4h1v2h5v-1h-4v-1h6V4h-6ZM9,1h6v3h-6V1Zm6,22h-6v-3h6v3Zm7-5H2V6h20v12Z"/>
`;_.panel_history=`
	<path d="m19.075,18.133l-.021.022c-.181.185-.478.189-.663.008l-5.229-5.102c-.185-.181.491-.874.676-.693l5.229,5.102c.185.181.189.478.008.663Z"/>
	<path d="m16.1,9.358l.022.021c.185.181.189.478.008.663l-2.291,2.348c-.181.185-.874-.491-.693-.676l2.291-2.348c.181-.185.478-.189.663-.008Z"/>
	<circle cx="13.165" cy="12.387" r="1.033"/>
	<path d="m19.551,5.842c.149.145.282.3.418.452l1.747-1.747c-.146-.159-.283-.322-.439-.475-2.259-2.204-5.187-3.302-8.112-3.302-3.021,0-6.039,1.171-8.315,3.504-2.196,2.251-3.287,5.166-3.295,8.08h2.475c.008-2.294.865-4.587,2.589-6.354,1.736-1.779,4.06-2.758,6.546-2.758,2.4,0,4.667.923,6.386,2.6Z"/>
	<path d="m1.608,11.33H.2l2.609,4.174,2.609-4.174h-1.166c-.954-.008-1.986-.008-2.644,0Z"/>
	<path d="m21.916,6.021l-.736.736c1.133,1.605,1.769,3.503,1.794,5.509.032,2.62-.958,5.096-2.788,6.971-1.862,1.908-4.355,2.959-7.022,2.959-2.574,0-5.007-.99-6.85-2.788-1.066-1.041-1.855-2.286-2.353-3.645l-.677,1.084c.541,1.201,1.309,2.324,2.309,3.3,2.108,2.057,4.841,3.082,7.571,3.082,2.819,0,5.636-1.093,7.761-3.27,3.747-3.841,4.05-9.742.991-13.938Z"/>
`;_.panel_attributes=`
	<polygon points="12 10 0 10 0 11 12 11 12 10 12 10"/>
	<polygon points="12 12 0 12 0 13 12 13 12 12 12 12"/>
	<polygon points="12 14 0 14 0 15 12 15 12 14 12 14"/>
	<polygon points="24 2 12 2 12 3 24 3 24 2 24 2"/>
	<polygon points="24 4 12 4 12 5 24 5 24 4 24 4"/>
	<polygon points="24 6 12 6 12 7 24 7 24 6 24 6"/>
	<path d="m14,10v5c0,.552.448,1,1,1h8c.552,0,1-.448,1-1v-5c0-.552-.448-1-1-1h-8c-.552,0-1,.448-1,1Zm1,4l2-3,2,3h-4Zm6,0l-2-3h4l-2,3Z"/>
	<polygon points="12 18 0 18 0 19 12 19 12 18 12 18"/>
	<polygon points="12 20 0 20 0 21 12 21 12 20 12 20"/>
	<polygon points="12 22 0 22 0 23 12 23 12 22 12 22"/>
	<path d="m14,18v5c0,.552.448,1,1,1h8c.552,0,1-.448,1-1v-5c0-.552-.448-1-1-1h-8c-.552,0-1,.448-1,1Zm1,4l2-3,2,3h-4Zm6,0l-2-3h4l-2,3Z"/>
	<path d="m9,1H1c-.552,0-1,.448-1,1v5c0,.552.448,1,1,1h8c.552,0,1-.448,1-1V2c0-.552-.448-1-1-1Zm-4.5,5.5l-2.5-2.5,1-1,1.5,1.5,2.5-2.5,1,1-3.5,3.5Z"/>
`;_.panel_view=`
	<circle cx="12" cy="13" r="4"/>
	<path d="m24,13h-2v-1c0-3.237-4.368-7-10-7S2,8.763,2,12v1H0v-1C0,7.29,5.72,3,12,3s12,4.29,12,9v1Z"/>
`;_.command_save=`
	<path d="M0,0V17.22l2.78,2.78H20V0H0ZM5,1H15V10H5V1Zm2,18v-3h1v3h-1Zm2,0v-3h5v3h-5ZM19,3h-1v1h1v15h-4v-4H6v4H3.5l-2.5-2.5V1h3V11h12V1h3V3Z"/>
`;_.command_export=`
	<polygon points="10 19.06 10 5.06 15.25 10.31 16 9.56 9.5 3.06 3 9.56 3.75 10.31 9 5.06 9 19.06 10 19.06"/>
	<rect width="19" height="1"/>
`;_.command_newTab=`
	<polygon points="10.35 10.35 18.94 1.77 18.94 9 20 9 20 0 11 0 11 1.06 18.23 1.06 9.65 9.65 10.35 10.35"/>
	<polygon points="15 10 14.98 19 1 19 1 5 10 5 11 4 0 4 0 20 15.98 20 16 9 15 10"/>
`;_.command_info=`
	<path d="M10,1c4.13,0,6.4,0,7.7,1.3,1.3,1.3,1.3,3.57,1.3,7.7s0,6.4-1.3,7.7c-1.3,1.3-3.57,1.3-7.7,1.3s-6.4,0-7.7-1.3c-1.3-1.3-1.3-3.57-1.3-7.7S1,3.6,2.3,2.3c1.3-1.3,3.57-1.3,7.7-1.3m0-1C5.62,0,3.18,0,1.59,1.59,0,3.18,0,5.62,0,10s0,6.82,1.59,8.41c1.59,1.59,4.03,1.59,8.41,1.59s6.82,0,8.41-1.59c1.59-1.59,1.59-4.03,1.59-8.41s0-6.82-1.59-8.41c-1.59-1.59-4.03-1.59-8.41-1.59h0Z"/>
	<path d="M9.28,14.06v-4.76h-1.13v-1.28h2.57v6.04h1.13v1.28h-3.7v-1.28h1.13Zm-.2-8.53c0-.23,.08-.43,.25-.6s.37-.26,.62-.26c.24,0,.44,.08,.61,.25s.26,.37,.26,.61-.09,.45-.26,.62c-.17,.17-.38,.25-.61,.25s-.45-.09-.62-.26-.25-.37-.25-.61Z"/>
`;_.command_help=`
	<path d="M10,1c4.13,0,6.4,0,7.7,1.3,1.3,1.3,1.3,3.57,1.3,7.7s0,6.4-1.3,7.7c-1.3,1.3-3.57,1.3-7.7,1.3s-6.4,0-7.7-1.3c-1.3-1.3-1.3-3.57-1.3-7.7S1,3.6,2.3,2.3c1.3-1.3,3.57-1.3,7.7-1.3m0-1C5.62,0,3.18,0,1.59,1.59,0,3.18,0,5.62,0,10s0,6.82,1.59,8.41c1.59,1.59,4.03,1.59,8.41,1.59s6.82,0,8.41-1.59c1.59-1.59,1.59-4.03,1.59-8.41s0-6.82-1.59-8.41c-1.59-1.59-4.03-1.59-8.41-1.59h0Z"/>
	<path d="M10.06,12.65h-.82l-.19-3.53c.25,.06,.5,.1,.75,.1,.7,0,1.2-.18,1.5-.53s.46-.77,.46-1.25c0-.56-.17-1-.5-1.31-.33-.31-.75-.47-1.27-.47-.62,0-1.08,.18-1.39,.53s-.45,.8-.45,1.33c0,.11,0,.24,0,.39h-1.49c0-.14,0-.27,0-.37,0-1.09,.32-1.9,.97-2.41s1.42-.77,2.31-.77c1.08,0,1.91,.29,2.5,.87,.59,.58,.89,1.34,.89,2.28s-.28,1.64-.84,2.18-1.22,.81-1.98,.81c-.06,0-.14,0-.25,0l-.2,2.16Zm-1.41,2.99v-1.96h1.96v1.96h-1.96Z"/>
`;_.command_autoFit=`
	<polygon points="6 9 3 9 4.75 7.25 4 6.5 1 9.5 4.25 12.25 5 11.5 3 10 6 10 6 9"/>
	<polygon points="14 9 17 9 15.25 7.25 16 6.5 19 9.5 15.75 12.25 15 11.5 17 10 14 10 14 9"/>
	<rect y="4" width="1" height="11"/>
	<rect x="19" y="4" width="1" height="11"/>
	<rect x="12" y="9" width="1" height="1"/>
	<rect x="7" y="9" width="1" height="1"/>
	<rect x="9" y="9" width="2" height="1"/>
`;_.command_verticalBar='<rect x="9" y="0" width="2" height="18"/>';_.command_horizontalBar='<rect y="9" x="1" height="2" width="19"/>';_.command_crossProjectActions=`
  <path d="m18.916,7.084c-.962-.962-2.426-1.07-4.92-1.082-.013-2.48-.121-3.959-1.08-4.918-1.084-1.084-2.8-1.084-5.916-1.084S2.168,0,1.084,1.084,0,3.884,0,7s0,4.832,1.084,5.916c.959.959,2.437,1.068,4.918,1.081.012,2.493.12,3.958,1.082,4.919,1.084,1.084,2.8,1.084,5.916,1.084s4.832,0,5.916-1.084,1.084-2.8,1.084-5.916,0-4.832-1.084-5.916Zm-17.916-.084c0-2.849,0-4.418.791-5.209s2.36-.791,5.209-.791,4.418,0,5.209.791c.691.691.777,1.996.788,4.209-2.356,0-3.91.002-4.997.472v-.472h-2v2h.472c-.47,1.087-.472,2.641-.472,4.997-2.211-.011-3.518-.097-4.209-.788-.791-.791-.791-2.36-.791-5.209Zm17.209,11.209c-.791.791-2.36.791-5.209.791s-4.418,0-5.209-.791-.791-2.36-.791-5.209,0-4.418.791-5.209,2.36-.791,5.209-.791,4.418,0,5.209.791.791,2.36.791,5.209,0,4.418-.791,5.209Z"/>
  <rect x="9" y="9" width="2" height="2"/>
  <rect x="12" y="9" width="2" height="2"/>
  <rect x="9" y="12" width="2" height="2"/>
  <rect x="9" y="15" width="2" height="2"/>
  <rect x="12" y="12" width="2" height="2"/>
  <rect x="15" y="9" width="2" height="2"/>
  <rect x="3" y="3" width="2" height="2"/>
  <rect x="6" y="3" width="2" height="2"/>
  <rect x="3" y="6" width="2" height="2"/>
  <rect x="3" y="9" width="2" height="2"/>
  <rect x="9" y="3" width="2" height="2"/>
`;_.page_about=`
	<path d="m12,1.2c4.955,0,7.684,0,9.242,1.558,1.558,1.558,1.558,4.287,1.558,9.242s0,7.684-1.558,9.242c-1.558,1.558-4.287,1.558-9.242,1.558s-7.684,0-9.242-1.558c-1.558-1.558-1.558-4.287-1.558-9.242s0-7.684,1.558-9.242c1.558-1.558,4.287-1.558,9.242-1.558m0-1.2C6.742,0,3.818,0,1.909,1.909,0,3.818,0,6.742,0,12s0,8.182,1.909,10.091c1.909,1.909,4.832,1.909,10.091,1.909s8.182,0,10.091-1.909c1.909-1.909,1.909-4.832,1.909-10.091s0-8.182-1.909-10.091c-1.909-1.909-4.832-1.909-10.091-1.909h0Z"/>
	<path d="m11,17v-6h-2v-2h4v8h2v2s-6,0-6,0v-2h2Zm-.95-11.258c0-.468.165-.877.495-1.223s.748-.52,1.255-.52c.477,0,.888.168,1.233.504s.517.749.517,1.238-.173.905-.517,1.244c-.345.342-.756.514-1.233.514-.487,0-.9-.174-1.24-.52s-.51-.758-.51-1.238Z"/>
`;_.page_help=`
	<path d="m12,1.2c4.955,0,7.684,0,9.242,1.558,1.558,1.558,1.558,4.287,1.558,9.242s0,7.684-1.558,9.242c-1.558,1.558-4.287,1.558-9.242,1.558s-7.684,0-9.242-1.558c-1.558-1.558-1.558-4.287-1.558-9.242s0-7.684,1.558-9.242c1.558-1.558,4.287-1.558,9.242-1.558m0-1.2C6.742,0,3.818,0,1.909,1.909,0,3.818,0,6.742,0,12s0,8.182,1.909,10.091c1.909,1.909,4.832,1.909,10.091,1.909s8.182,0,10.091-1.909c1.909-1.909,1.909-4.832,1.909-10.091s0-8.182-1.909-10.091c-1.909-1.909-4.832-1.909-10.091-1.909h0Z"/>
	<path d="m12.398,16h-2v-4.5c2,0,4.202-.5,4.202-3,0-1.5-.6-2.5-2.202-2.5-2,0-2.398,1.3-2.398,2v1h-2v-1c0-1,.398-4,4.398-4,2.602,0,4.602,1.5,4.602,4.5s-2.602,4.5-4.102,4.5l-.5,3Z"/>
	<rect x="10" y="17" width="3" height="3" rx=".75" ry=".75"/>
`;_.page_exportFont=`
	<polygon points="30.1,9.9 40.1,0 50,9.9 42.5,9.9 42.5,18.8 37.6,18.8 37.6,9.9"/>
	<path d="M15.2,12.7l-9.9,9.9V50h29.8V12.7H15.2z M26.7,29.1h-1.9l0.7-2.9H20L18.8,31h4.7l-0.4,1.8h-4.7l-1.3,5.4h1.7l-0.4,1.8H13l0.4-1.8h1.4l2.9-12h-1.5l0.4-1.8h11.3L26.7,29.1z"/>
`;_.page_exportSVG=`
	<polygon points="7 4 4 0 1 4 3 4 3 7 5 7 5 4 7 4"/>
	<path d="m17.026,6H7v18h15v-12.75l-4.974-5.25Zm-5.835,11.758c-.272.247-.613.371-1.022.371-.359,0-.684-.115-.976-.344v.303h-.949v-1.575h.949c0,.369.051.608.154.718.103.11.238.165.406.165.15,0,.267-.043.351-.128.084-.084.126-.202.126-.353,0-.12-.048-.247-.143-.38-.095-.131-.332-.334-.711-.604-.511-.361-.836-.657-.978-.889-.141-.232-.212-.46-.212-.684,0-.339.124-.617.371-.834.247-.217.561-.326.94-.326.188,0,.353.022.494.065.141.045.309.137.503.279v-.303h.949v1.463h-.949c0-.308-.047-.515-.141-.62s-.228-.158-.402-.158c-.127,0-.227.033-.302.098-.075.065-.113.153-.113.262,0,.135.044.253.131.354.088.101.26.236.519.405.582.383.962.702,1.142.959.18.256.269.53.269.823,0,.375-.136.687-.408.934Zm5.908-3.793h-.437l-1.455,4.201h-1.213l-1.402-4.201h-.455v-.725h2.318v.725h-.464l.727,2.313.719-2.313h-.536v-.725h2.198v.725Zm3.308,3.02c-.062.274-.163.51-.304.706s-.313.341-.514.436-.43.142-.685.142c-.526,0-.941-.217-1.244-.65-.303-.435-.455-1.054-.455-1.857,0-.812.123-1.441.369-1.889.246-.448.591-.672,1.036-.672.299,0,.554.146.766.441h.014v-.366h.783v1.675h-.783c-.007-.31-.054-.542-.142-.695-.088-.154-.205-.23-.35-.23-.176,0-.288.101-.337.303-.049.201-.073.633-.073,1.295,0,.524.012.914.036,1.168.024.255.065.427.125.519.059.091.147.137.263.137.278,0,.42-.272.427-.817h-.328v-.734h1.49c0,.453-.031.817-.092,1.092Z"/>
`;_.page_importAndExport=`
	<polygon points="17 20 20 24 23 20 21 20 21 17 19 17 19 20 17 20"/>
	<polygon points="7 4 4 0 1 4 3 4 3 7 5 7 5 4 7 4"/>
	<path d="m13.684,6h-6.684v12h10v-8.5l-3.316-3.5Zm1.316,9h-5v-1h5v1Zm0-2h-5v-1h5v1Zm0-2h-7v-1h7v1Z"/>
`;_.page_settings=`
	<path d="m23.404,15.538c.366-1.11.572-2.291.596-3.518l-3.267-1.344c-.041-.326-.101-.645-.176-.959l2.601-2.372c-.448-1.126-1.057-2.169-1.806-3.098l-3.375,1.073c-.227-.21-.465-.408-.714-.594l.47-3.506c-1.043-.567-2.18-.982-3.381-1.221l-1.897,2.993c-.152-.008-.301-.023-.455-.023s-.303.015-.455.023l-1.897-2.993c-1.201.238-2.338.653-3.381,1.221l.47,3.506c-.249.186-.487.384-.714.594l-3.375-1.073c-.749.929-1.358,1.972-1.806,3.098l2.601,2.372c-.075.314-.135.633-.176.959l-3.267,1.344c.024,1.227.23,2.408.596,3.518l3.516.145c.153.308.319.607.505.893l-1.634,3.121c.785.893,1.699,1.665,2.715,2.294l2.777-2.142c.323.141.656.264.998.366l.752,3.43c.58.086,1.17.145,1.774.145s1.194-.059,1.774-.145l.752-3.43c.342-.102.675-.225.998-.366l2.777,2.142c1.016-.628,1.93-1.401,2.715-2.294l-1.634-3.121c.186-.286.353-.585.505-.893l3.516-.145Zm-11.404,1.284c-2.761,0-5-2.239-5-5s2.239-5,5-5,5,2.239,5,5-2.239,5-5,5Z"/>
`;_.page_globalActions=`
	<path d="m22.198,17.785l-3.6-3.6c1.293-1.339,2.093-3.157,2.093-5.166,0-1.751-.609-3.358-1.621-4.629-.016.554-.129,1.161-.344,1.811-.555,1.67-1.718,3.448-3.277,5.006-2.205,2.205-4.81,3.581-6.833,3.625,1.272,1.016,2.882,1.627,4.636,1.627,1.923,0,3.669-.735,4.989-1.932l1.582,1.582c-3.828,3.509-9.79,3.421-13.497-.287-3.707-3.707-3.795-9.669-.287-13.497l1.705,1.705c-1.197,1.32-1.932,3.067-1.932,4.989,0,1.739.601,3.334,1.6,4.601,1.567.793,4.737-.5,7.343-3.106,1.453-1.453,2.532-3.095,3.04-4.622.377-1.137.382-2.067.055-2.715-1.266-.998-2.861-1.598-4.598-1.598-2.008,0-3.827.799-5.166,2.093L4.485.072c-.097-.097-.253-.097-.35,0s-.097.253,0,.35l.855.855c-4.085,4.406-3.998,11.309.287,15.593,1.774,1.774,4,2.818,6.31,3.157v1.583c-2.439.05-4.32.347-4.32.71v.96c0,.398,2.257.72,5.04.72s5.04-.322,5.04-.72v-.96c0-.362-1.881-.659-4.32-.71v-1.46c.068.001.136.01.205.01,2.747,0,5.487-1.009,7.638-3.003l.978.978c.048.048.112.073.175.073s.127-.024.175-.073c.097-.097.097-.253,0-.35Z"/>
`;_.page_livePreview=`
	<rect x="20" y="5" width="1" height="15"/>
	<rect x="17" y="3.98" width="3" height="1"/>
	<rect x="21" y="4" width="3" height="1"/>
	<rect x="17" y="19.98" width="3" height="1"/>
	<rect x="21" y="20" width="3" height="1"/>
	<path d="m0,16v-2s2,0,2,0v-6H0v-2h6v2h-2v6h3v-2h2v4S0,16,0,16Z"/>
	<path d="m14,18v2h-4v-2h1v-7h-1v-2h3v.879c.618-.654,1.308-.981,2.069-.981.92,0,1.644.365,2.173,1.096s.794,1.582.794,2.554c0,1.03-.273,1.882-.819,2.558-.546.675-1.274,1.013-2.184,1.013-.742,0-1.42-.29-2.033-.869v2.751s1,0,1,0Zm1.759-5.495c0-.608-.126-1.063-.377-1.365s-.583-.453-.995-.453c-.417,0-.756.154-1.017.463s-.392.77-.392,1.383c0,.551.129.994.388,1.329s.603.503,1.035.503c.398,0,.723-.151.977-.453s.381-.771.381-1.408Z"/>
`;_.page_kerning=`
	<path d="m16.697,18l-4.164-10.513h-1.534v-1.487h4.892v1.487h-1.432l3.156,7.976,3.072-7.976h-1.446v-1.487h4.758v1.487h-1.505l-4.078,10.513h-1.72Z"/>
	<path d="m11.616,16.5l-3.41-9h1.495v-1.5H3.379v1.5h1.445l-3.327,9H0v1.5h4.873v-1.5h-1.503l.946-2.714h4.456l.92,2.714h-1.538v1.5h4.846v-1.5h-1.384Zm-6.839-4.12l1.667-4.88h.26l1.602,4.88h-3.529Z"/>
	<rect x="11" y="2" width="13" height="1"/>
	<rect x="11" width="1" height="5"/>
	<rect y="21" width="13" height="1"/>
	<rect x="12" y="19" width="1" height="5"/>
`;_.page_ligatures=`
	<path id="b" data-name="ligatures" d="m21,21v-13s-8,0-8,0c-.002-.479,0-1.249,0-2.083s.2-2.917,2.2-2.917c.642,0,2.572,0,2.572,1.423,0,.899.943,1.524,1.826,1.402.891-.116,1.402-.825,1.402-1.825,0-2-2.376-4-5-4-1.75,0-2.704.202-3.87,1.194-.541.461-1.147,1.187-1.525,2.294-.723-1.025-1.865-1.545-3.438-1.545-3.166,0-4.206,2.057-4.206,5.196v.861l-2.96-.035v3.035h3v10H0v3h24v-3h-3ZM6,7.142c0-1.076,0-2.596,1.383-2.596.701,0,1.107.518,1.218,1.553l1.634-.251v2.152h-4.236v-.858Zm0,13.858v-10h4v10h-4Zm7,0v-10h5v10h-5Z"/>
`;_.page_components=`
	<path d="m9.831,15.308c-.899-.912-2.012-1.368-3.338-1.368-1.38,0-2.544.544-3.493,1.632v-5.572H0v1.986l1,.014v10H0v2h3.028l-.028-1.602c.279.405.736.773,1.373,1.104.637.332,1.34.497,2.109.497,1.373,0,2.499-.489,3.378-1.468.879-.978,1.318-2.184,1.318-3.617,0-1.493-.449-2.695-1.348-3.607Zm-.531,3.75c0,.979-.3,1.755-.9,2.329-.6.574-1.292.861-2.076.861-.008,0-.016-.002-.024-.002-.008,0-.016.002-.024.002-.784,0-1.477-.287-2.076-.861-.6-.574-.9-1.35-.9-2.329,0-.031.006-.057.007-.088,0-.03-.007-.057-.007-.087,0-.992.297-1.762.89-2.31.593-.548,1.288-.822,2.086-.822.008,0,.016.002.024.002.008,0,.016-.002.024-.002.797,0,1.493.274,2.086.822.593.548.89,1.318.89,2.31,0,.031-.006.057-.007.087,0,.031.007.057.007.088Z"/>
	<path d="m12.821,18.915c0,1.433.439,2.638,1.318,3.617.879.978,2.005,1.468,3.378,1.468.77,0,1.473-.166,2.109-.497.637-.332,1.094-.7,1.373-1.104l-.028,1.602h3.028s0-2,0-2h-1v-10l1-.014v-1.986s-3,0-3,0v5.572c-.949-1.088-2.113-1.632-3.493-1.632-1.327,0-2.439.456-3.338,1.368-.899.912-1.348,2.114-1.348,3.607Zm1.886.055c0-.03-.007-.057-.007-.087,0-.992.297-1.762.89-2.31.593-.548,1.289-.822,2.086-.822.008,0,.016.002.024.002.008,0,.016-.002.024-.002.797,0,1.493.274,2.086.822.593.548.89,1.318.89,2.31,0,.031-.006.057-.007.087,0,.031.007.057.007.088,0,.979-.3,1.755-.9,2.329-.6.574-1.292.861-2.076.861-.008,0-.016-.002-.024-.002-.008,0-.016.002-.024.002-.784,0-1.477-.287-2.076-.861-.6-.574-.9-1.35-.9-2.329,0-.031.006-.057.007-.088Z"/>
	<path d="m15,3.131c0-.992-.297-1.762-.89-2.31-.593-.548-1.288-.822-2.086-.822-.008,0-.016.002-.024.002-.008,0-.016-.002-.024-.002-.797,0-1.493.274-2.086.822-.593.548-.89,1.318-.89,2.31,0,.031.006.057.007.087,0,.031-.007.057-.007.088,0,.979.3,1.755.9,2.329.6.574,1.292.861,2.076.861.008,0,.016-.002.024-.002.008,0,.016.002.024.002.784,0,1.477-.287,2.076-.861.6-.574.9-1.35.9-2.329,0-.031-.006-.057-.007-.088,0-.03.007-.057.007-.087Z"/>
	<path d="m15.001,13.5c-.17,0-.335-.087-.429-.243l-2.571-4.285-2.571,4.285c-.142.236-.45.314-.686.172-.237-.142-.313-.449-.171-.686l3.429-5.715,3.429,5.715c.142.236.065.544-.171.686-.081.049-.169.071-.257.071Z"/>
`;_.page_characters=`
	<path d="m13.548,0h2.452v6l-2.452.004c-.785-2.073-2.148-3.002-4.088-3.002-1.602,0-2.814.466-3.634,1.557s-1.231,2.399-1.231,3.923c0,1.594.434,2.884,1.302,3.87s1.973,1.479,3.316,1.479c1.1,0,3.795-.823,4.796-3.825l2.992,1.001c-1.225,3.805-3.923,5.84-8.094,5.84-2.945,0-5.166-.793-6.662-2.38S0,10.874,0,8.447c0-1.728.389-3.24,1.166-4.536S2.99,1.64,4.306.984s2.759-.984,4.33-.984c1.956,0,3.593.511,4.913,1.532V0Z"/>
	<polygon points="21 21 21 20.5 22 20.5 22 20 23 20 23 17 23 16.5 22.5 16.5 22.5 16 22 16 22 15.5 21.5 15.5 21.5 15 21 15 21 14.5 20.5 14.5 20.5 14 20 14 20 13.5 19.5 13.5 19.5 13 19 13 19 12.5 18.5 12.5 18.5 12 18 12 18 11.5 17.5 11.5 17.5 11 17 11 17 12 17.5 12 17.5 13 18 13 18 14 18.5 14 18.5 15 19 15 19 16 19.5 16 20 16 20 16.5 20.5 16.5 20.5 17.5 20 17.5 20 18 19.5 18 19 18 19 17.5 18.5 17.5 18.5 16.5 19 16.5 19 16 18.5 16 18.5 15 18 15 18 14 17.5 14 17.5 13 17 13 17 19 17 19.5 17.5 19.5 17.5 20 18 20 18 20.5 18.5 20.5 18.5 21 19 21 19 21.5 19.5 21.5 20 21.5 20 21 21 21"/>
	<polygon points="24 22 24 21 23.5 21 23.5 20 23 20 23 20.5 22 20.5 22 21 21 21 21 21.5 20 21.5 20 22 20 22.5 20.5 22.5 20.5 23.5 21.5 23.5 21.5 23 22.5 23 22.5 22.5 23.5 22.5 23.5 22 24 22"/>
`;_.page_overview=`
	<path d="m7,9.646v1.362h-2.161v-.951c-.701.72-1.483,1.08-2.347,1.08-.671,0-1.254-.231-1.749-.693S0,9.39,0,8.671C0,7.946.263,7.344.789,6.866s1.16-.717,1.901-.717c.691,0,1.359.22,2.004.661v-.773c0-.397-.036-.704-.107-.918s-.238-.408-.499-.58-.603-.258-1.025-.258c-.726,0-1.252.306-1.577.918l-1.387-.387c.615-1.214,1.677-1.821,3.185-1.821.554,0,1.033.079,1.436.238s.705.363.903.612.331.52.4.81.103.752.103,1.386v3.609h.873Zm-2.306-1.539c-.625-.516-1.257-.773-1.898-.773-.401,0-.737.124-1.006.371s-.404.567-.404.959c0,.365.118.671.354.918s.558.371.964.371c.701,0,1.364-.312,1.989-.935v-.91Z"/>
	<path d="m8,11.007v-1.362h.925V1.362h-.925V0h2.343v4.312c.726-.881,1.618-1.321,2.675-1.321,1.016,0,1.868.369,2.557,1.108s1.033,1.712,1.033,2.921c0,1.16-.337,2.136-1.01,2.929s-1.536,1.188-2.587,1.188c-.589,0-1.128-.134-1.616-.403s-.838-.567-1.052-.894v1.168h-2.343Zm2.388-3.883c0,.811.235,1.454.705,1.93s1.012.713,1.627.713c.645,0,1.201-.252,1.669-.757s.701-1.182.701-2.03c0-.822-.232-1.46-.697-1.914s-1.01-.681-1.635-.681c-.615,0-1.163.235-1.646.705s-.724,1.148-.724,2.034Z"/>
	<path d="m24,3v3s-1.25,0-1.25,0c-.064-.564-.393-.999-.75-1.3s-.884-.294-1.356-.294c-.629,0-1.141.243-1.534.729s-.59,1.124-.59,1.914c0,.736.187,1.384.561,1.946s.915.842,1.623.842c.983,0,1.697-.51,2.139-1.531l1.158.596c-.639,1.552-1.758,2.328-3.356,2.328-1.131,0-2.021-.422-2.67-1.265s-.974-1.815-.974-2.917c0-1.176.354-2.147,1.062-2.913s1.524-1.148,2.449-1.148c.792,0,1.693.255,2.239.765v-.753h1.25Z"/>
	<path d="m4.047,17.842l-1.444,1.806h.941v1.406H0v-1.406h1.076l2.196-2.731-2.098-2.511H.189v-1.406h3.43v1.406h-.91l1.314,1.578,1.269-1.578h-.744v-1.406h3.452v1.406h-1.205l-2.002,2.503,2.281,2.739h.925v1.406h-3.452v-1.406h1.008l-1.51-1.806Z"/>
	<path d="m12.492,20.2l-2.503-5.798h-.989v-1.402h3.492v1.402h-.913l1.645,4.198,1.613-4.198h-1.007v-1.402h3.17v1.402h-.613l-3.883,9.598h-2.498v-1.5h1.593l.892-2.3Z"/>
	<path d="m18,21.054v-1.315l4.37-5.433h-3.12v.694h-1.25v-2h6v1.406l-4.387,5.333h3.191v-.74h1.196v2.054h-6Z"/>
`;function kx(r="baseline-left"){let t=it.gray.l25,n=it.blue.l70,e=0;r.includes("center")&&(e=7),r.includes("right")&&(e=14);let a=0;return r.includes("middle")&&(a=8),r.includes("baseline")&&(a=11),r.includes("bottom")&&(a=15),`
	<svg version="1.1"
	xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20">
	<defs></defs>
	<rect fill="transparent" width="20" height="20"/>
	<g pointer-events="none" width="20" height="20">
			<path d="m2,2v16h15V2H2Zm14,15H3v-3h13v3Zm0-4H3V3h13v10Z"/>
			<rect x="${e}" y="${a}" width="5" height="5" style="fill: ${t};"/>
			<rect x="${e+1}" y="${a+1}" width="3" height="3" style="fill: ${n};"/>
		</g>
	</svg>
	`}_.back='<polygon points="37,23 20,23 25,18 22,15 12,25 22,35 25,32 20,27 37,27"/>';_.more='<polygon points="0,0 0,10 5,5"/>';_.selected='<polygon points="6,6 6,14 14,10"/>';_.notSelected='<rect x="5" y="9.75" width="10" height="0.5"/>';_.keyboard=`
	<rect x="12" y="29" width="26" height="7"/>
	<rect y="29" width="10" height="7"/>
	<rect y="21" width="8" height="6"/>
	<rect x="10" y="21" width="6" height="6"/>
	<rect x="18" y="21" width="6" height="6"/>
	<rect x="26" y="21" width="6" height="6"/>
	<rect x="34" y="21" width="6" height="6"/>
	<rect x="42" y="21" width="8" height="6"/>
	<rect x="6" y="13" width="6" height="6"/>
	<rect x="14" y="13" width="6" height="6"/>
	<rect x="22" y="13" width="6" height="6"/>
	<rect x="38" y="13" width="6" height="6"/>
	<rect x="30" y="13" width="6" height="6"/>
	<rect x="46" y="13" width="4" height="6"/>
	<rect y="13" width="4" height="6"/>
	<rect x="40" y="29" width="10" height="7"/>
`;function Jn(r,t,n={x:0,y:0,z:1},e=1,a="#000"){if(!r.shapes)return console.warn(`Glyph ${r.name} has no shapes to draw`),!1;let i;return t.beginPath(),r.shapes.forEach(o=>{if(i=se(o,t,n),!i&&o.objType==="ComponentInstance"&&!m().getItem(o.link)){console.warn(`>>> Component Instance has bad link: ${o.link} from ${r.id}`);const A=r.shapes.indexOf(o);A>-1&&(r.shapes.splice(A,1),console.warn(">>> Deleted the Instance"))}}),t.closePath(),t.fillStyle=a,t.globalAlpha=e,t.fill("nonzero"),t.globalAlpha=1,r.advanceWidth*n.dz}function se(r,t,n){return r.objType==="ComponentInstance"?Kx(r,t,n):Vx(r,t,n)}function Kx(r,t,n){const e=r.transformedGlyph;if(!e)return!1;let a=!1,i=!1;return e.shapes.forEach(o=>{a=se(o,t,n),i=i||!a}),!i}function Vx(r,t,n,e=!1){if(!(r!=null&&r.pathPoints)||r.pathPoints===!1||r.pathPoints.length<2)return!1;let a,i;const o=e?0:9,A=At(R(r.pathPoints[0].p.x,o),n),x=q(R(r.pathPoints[0].p.y,o),n);let E,l,T,s,c,I;t.moveTo(A,x);for(let h=0;h<r.pathPoints.length;h++)a=r.pathPoints[h],i=r.pathPoints[r.getNextPointNum(h)],!a.h2.use&&!i.h1.use?(c=At(R(i.p.x,o),n),I=q(R(i.p.y,o),n),t.lineTo(c,I)):(E=At(R(a.h2.x,o),n),l=q(R(a.h2.y,o),n),T=At(R(i.h1.x,o),n),s=q(R(i.h1.y,o),n),c=At(R(i.p.x,o),n),I=q(R(i.p.y,o),n),t.bezierCurveTo(E,l,T,s,c,I));return!0}class cr{constructor(){}changed(){this.cache&&(this.cache={}),this.parent&&this.parent.changed&&this.parent.changed()}get ident(){return this.__ID||""}get objType(){return this._objType||this.constructor.name}get displayType(){if(this.id){if(this.id.startsWith("liga-"))return"Ligature";if(this.id.startsWith("comp-"))return"Component";if(this.id.startsWith("glyph-"))return"Glyph";if(this.id.startsWith("kern-"))return"Kern Group"}return this.objType}set objType(t){this._objType=t}get cache(){return this._cache||(this._cache={}),this._cache}set cache(t={}){this._cache=t}save(t=!1){const n=Zt(this);return t?n.objType=this.objType:delete n.objType,n.cache&&delete n.cache,n}clone(){return new this.constructor(this.save(!0))}toString(){return zn(this.save())}print(t=0,n=!1){let e="";for(let A=0;A<t;A++)e+="  ";let a=`${e}{${this.objType} ${n||""}
`;e+="  ";const i=this.save();let o;for(const A of Object.keys(i))o=this[A],o.print?a+=`${e}${A}: ${o.print(t+1)}
`:typeof o!="function"&&(typeof o=="object"?a+=`${e}${A}: ${JSON.stringify(o)}
`:a+=`${e}${A}: ${o}
`);return a+=`${e.substring(2)}}/${this.objType} ${n||""}`,a}get isLockable(){return!1}isLocked(){return!1}lock(){}unlock(){}}function Jx(){let r=["💖","🦧","🐆","✅","🐋","😈","🦑"],t="";for(let n=0;n<3;n++)t+=r[Math.floor(Math.random()*r.length)];return t}const _x=Object.freeze(Object.defineProperty({__proto__:null,GlyphElement:cr,makeRandomID:Jx},Symbol.toStringTag,{value:"Module"}));class Yr extends cr{constructor({link:t=!1,name:n="Component Instance",translateX:e=0,translateY:a=0,resizeWidth:i=0,resizeHeight:o=0,isFlippedNS:A=!1,isFlippedEW:x=!1,reverseWinding:E=!1,rotation:l=0,rotateFirst:T=!1,xLock:s=!1,yLock:c=!1,wLock:I=!1,hLock:h=!1,ratioLock:S=!1,parent:p=!1}={}){super(),this.parent=p,this.name=n,this.link=t,this.translateX=e,this.translateY=a,this.resizeWidth=i,this.resizeHeight=o,this.isFlippedNS=A,this.isFlippedEW=x,this.reverseWinding=E,this.rotation=l,this.rotateFirst=T,this.xLock=s,this.yLock=c,this.wLock=I,this.hLock=h,this.ratioLock=S,this.objType="ComponentInstance"}save(t=!1){const n={link:this.link};return this.name!=="Component Instance"&&(n.name=this.name),this.translateX!==0&&(n.translateX=this.translateX),this.translateY!==0&&(n.translateY=this.translateY),this.resizeWidth!==0&&(n.resizeWidth=this.resizeWidth),this.resizeHeight!==0&&(n.resizeHeight=this.resizeHeight),this.isFlippedNS!==!1&&(n.isFlippedNS=this.isFlippedNS),this.isFlippedEW!==!1&&(n.isFlippedEW=this.isFlippedEW),this.reverseWinding!==!1&&(n.reverseWinding=this.reverseWinding),this.rotation!==0&&(n.rotation=this.rotation),this.rotateFirst!==!1&&(n.rotateFirst=this.rotateFirst),this.xLock!==!1&&(n.xLock=this.xLock),this.yLock!==!1&&(n.yLock=this.yLock),this.wLock!==!1&&(n.wLock=this.wLock),this.hLock!==!1&&(n.hLock=this.hLock),this.ratioLock!==!1&&(n.ratioLock=this.ratioLock),t&&(n.objType=this.objType),n}get transformedGlyph(){return this.cache.transformedGlyph||(this.cache.transformedGlyph=this.makeTransformedGlyph()),this.cache.transformedGlyph}makeTransformedGlyph(){const t=this.getCrossLinkedItem();if(!t)return console.warn(`Tried to get Component: ${this.link} but it doesn't exist - bad usedIn array maintenance.`),!1;const n=Sn(t);return(this.translateX||this.translateY||this.resizeWidth||this.resizeHeight||this.isFlippedEW||this.isFlippedNS||this.reverseWinding||this.rotation)&&(this.rotateFirst&&n.rotate(Xn(this.rotation*-1),n.maxes.center),this.isFlippedEW&&n.flipEW(),this.isFlippedNS&&n.flipNS(),n.updateGlyphPosition(this.translateX,this.translateY,!0),n.updateGlyphSize({width:this.resizeWidth,height:this.resizeHeight}),this.reverseWinding&&n.reverseWinding(),this.rotateFirst||n.rotate(Xn(this.rotation*-1),n.maxes.center)),n}getCrossLinkedItem(){var e;let t=(e=this==null?void 0:this.parent)==null?void 0:e.parent,n;return t&&t.getItem&&(n=t.getItem(this.link)),n}get link(){return this._link}get name(){return this._name}get translateX(){return this._translateX}get translateY(){return this._translateY}get resizeWidth(){return this._scaleW}get resizeHeight(){return this._scaleH}get isFlippedEW(){return this._isFlippedEW}get isFlippedNS(){return this._isFlippedNS}get reverseWinding(){return this._reverseWinding}get rotation(){return this._rotation}get rotateFirst(){return this._rotateFirst}get xLock(){return this._xLock}get yLock(){return this._yLock}get wLock(){return this._wLock}get hLock(){return this._hLock}get ratioLock(){return this._ratioLock}get x(){return this.maxes.xMin}get y(){return this.maxes.yMax}get width(){return this.transformedGlyph.maxes.width}get height(){return this.transformedGlyph.maxes.height}get maxes(){return this.transformedGlyph.maxes}get center(){return this.transformedGlyph.maxes.center}get svgPathData(){return this.transformedGlyph.svgPathData}set link(t){this._link=t,this.changed()}set name(t=""){t=G0(t),t!==""&&(this._name=t)}set translateX(t){this._translateX=parseFloat(t),isNaN(this._translateX)&&(this._translateX=0),this.changed()}set translateY(t){this._translateY=parseFloat(t),isNaN(this._translateY)&&(this._translateY=0),this.changed()}set resizeWidth(t){this._scaleW=parseFloat(t),isNaN(this._scaleW)&&(this._scaleW=0),this.changed()}set resizeHeight(t){this._scaleH=parseFloat(t),isNaN(this._scaleH)&&(this._scaleH=0),this.changed()}set isFlippedNS(t){this._isFlippedNS=!!t,this.changed()}set isFlippedEW(t){this._isFlippedEW=!!t,this.changed()}set reverseWinding(t){this._reverseWinding=!!t,this.changed()}set rotation(t){this._rotation=parseFloat(t),isNaN(this._rotation)&&(this._rotation=0),this.changed()}set rotateFirst(t){this._rotateFirst=!!t,this.changed()}set xLock(t){this._xLock=!!t}set yLock(t){this._yLock=!!t}set wLock(t){this._wLock=!!t}set hLock(t){this._hLock=!!t}set ratioLock(t){this._ratioLock=!!t}updateShapePosition(t,n){t=parseFloat(t)||0,n=parseFloat(n)||0,this.translateX=1*this.translateX+t,this.translateY=1*this.translateY+n}updateShapeSize({width:t=!1,height:n=!1,ratioLock:e=!1}){if(t!==!1&&(t=parseFloat(t)||0),n!==!1&&(n=parseFloat(n)||0),e){const a=this.transformedGlyph.maxes,i=a.xMax-a.xMin,o=a.yMax-a.yMin;Math.abs(t)>Math.abs(n)?n=t*(o/i):t=n*(i/o)}this.resizeWidth=1*this.resizeWidth+t,this.resizeHeight=1*this.resizeHeight+n,this.rotation===0&&(this.rotateFirst=!1)}flipEW(t){if(this.isFlippedEW=!this.isFlippedEW,t){const n=this.transformedGlyph.maxes;this.translateX+=t-n.xMax+t-n.xMin}return this.rotation===0&&(this.rotateFirst=!1),this}flipNS(t){if(this.isFlippedNS=!this.isFlippedNS,t){const n=this.transformedGlyph.maxes;this.translateY+=t-n.yMax+t-n.yMin}return this.rotation===0&&(this.rotateFirst=!1),this}rotate(t){const n=ca(t)*-1;return this.rotation=this.rotation+n,this.resizeHeight===0&&this.resizeWidth===0&&!this.isFlippedEW&&!this.isFlippedNS&&(this.rotateFirst=!0),this}}const Zx=Object.freeze(Object.defineProperty({__proto__:null,ComponentInstance:Yr},Symbol.toStringTag,{value:"Module"}));class Qt extends cr{constructor({xMin:t,xMax:n,yMin:e,yMax:a}={}){return super(),this.xMin=t,this.xMax=n,this.yMin=e,this.yMax=a,this.objType="Maxes",this}save(t=!1){const n={};return j(this._xMin)&&(n.xMin=this._xMin),j(this._xMax)&&(n.xMax=this._xMax),j(this._yMin)&&(n.yMin=this._yMin),j(this._yMax)&&(n.yMax=this._yMax),t&&(n.objType=this.objType),n}print(t=0){let n="";for(let a=0;a<t;a++)n+="  ";let e=`${n}{`;return e+=`xMin:${this._xMin} `,e+=`xMax:${this._xMax} `,e+=`yMin:${this._yMin} `,e+=`yMax:${this._yMax}`,e+="}",e}get xMin(){return j(this._xMin)?this._xMin:Number.MAX_SAFE_INTEGER}get xMax(){return j(this._xMax)?this._xMax:Number.MIN_SAFE_INTEGER}get yMin(){return j(this._yMin)?this._yMin:Number.MAX_SAFE_INTEGER}get yMax(){return j(this._yMax)?this._yMax:Number.MIN_SAFE_INTEGER}get center(){return{x:this.width/2+this.xMin,y:this.height/2+this.yMin}}get width(){return this.xMax-this.xMin}get height(){return this.yMax-this.yMin}set xMin(t){t=parseFloat(t),isNaN(t)||(this._xMin=t)}set xMax(t){t=parseFloat(t),isNaN(t)?delete this._xMax:this._xMax=t}set yMin(t){t=parseFloat(t),isNaN(t)?delete this._yMin:this._yMin=t}set yMax(t){t=parseFloat(t),isNaN(t)?delete this._yMax:this._yMax=t}roundAll(t=3){this.xMin=R(this.xMin,t),this.xMax=R(this.xMax,t),this.yMin=R(this.yMin,t),this.yMax=R(this.yMax,t)}isPointInside(t,n){return t<=this.xMax&&t>=this.xMin&&n<=this.yMax&&n>=this.yMin}}function Qn(r,t,n=!0){let e;return n?e=r.xMin<t.xMax&&r.xMax>t.xMin&&r.yMin<t.yMax&&r.yMax>t.yMin:e=r.xMin<=t.xMax&&r.xMax>=t.xMin&&r.yMin<=t.yMax&&r.yMax>=t.yMin,e}function qn(r){const t=Qo();let n;for(let e=0;e<r.length;e++)n=new Qt(r[e]),t.xMin=Math.min(t.xMin,n.xMin),t.xMax=Math.max(t.xMax,n.xMax),t.yMin=Math.min(t.yMin,n.yMin),t.yMax=Math.max(t.yMax,n.yMax);return new Qt(t)}function U0(r){return r.xMax===0&&r.xMin===0&&r.yMax===0&&r.yMin===0}function Qo(){return{xMin:Number.MAX_SAFE_INTEGER,xMax:Number.MIN_SAFE_INTEGER,yMin:Number.MAX_SAFE_INTEGER,yMax:Number.MIN_SAFE_INTEGER}}function zx(){return{xMin:Number.MIN_SAFE_INTEGER,xMax:Number.MAX_SAFE_INTEGER,yMin:Number.MIN_SAFE_INTEGER,yMax:Number.MAX_SAFE_INTEGER}}const Xx=Object.freeze(Object.defineProperty({__proto__:null,Maxes:Qt,getOverallMaxes:qn,isAllZeros:U0,maxesMaxBounds:zx,maxesMinBounds:Qo,maxesOverlap:Qn},Symbol.toStringTag,{value:"Module"}));class qo extends cr{constructor({x:t=0,y:n=0,parent:e=!1}={}){super(),this.parent=e,this.x=t,this.y=n,this.objType="Coord"}save(){return{x:Vt(this.x),y:Vt(this.y)}}print(t=0){let n="";for(let a=0;a<t;a++)n+="  ";let e=`${n}{`;return e+=`x: ${j(this._x)?this._x:"--"}  `,e+=`y: ${j(this._y)?this._y:"--"}`,e+="}",e}get x(){return isNaN(this._x)?(this._x=0,console.warn("Coord.x was NaN, setting to 0"),0):this._x}get y(){return isNaN(this._y)?(this._y=0,console.warn("Coord.y was NaN, setting to 0"),0):this._y}set x(t=0){t=Vt(t),isNaN(t)?this._x=0:this._x=t,this.changed()}set y(t=0){t=Vt(t),isNaN(t)?this._y=0:this._y=t,this.changed()}}const jx=Object.freeze(Object.defineProperty({__proto__:null,Coord:qo},Symbol.toStringTag,{value:"Module"}));class at extends cr{constructor({coord:t={x:0,y:0},use:n=!0,xLock:e=!1,yLock:a=!1,parent:i=!1,type:o=!1}={}){super(),this.parent=i,this.coord=t,this.use=n,this.xLock=e,this.yLock=a,this.type=o,this.objType="ControlPoint"}save(t=!1){const n={coord:this.coord.save(t)};return this.use||(n.use=!1),this.xLock&&(n.xLock=!0),this.yLock&&(n.yLock=!0),t&&(n.objType=this.objType),this.type==="p"&&delete n.use,!t&&this.__ID&&delete this.__ID,n}print(t=0){let n="";for(let a=0;a<t;a++)n+="  ";let e=`${n}{ControlPoint
`;return n+="  ",e+=`${n}coord: ${this.coord.print(t+1)}
`,this.type!=="p"&&(e+=`${n}use: ${this.use}
`),e+=`${n.substring(2)}}`,e}get x(){return this.use?this._coord.x:this.parent.p.x}get y(){return this.use?this._coord.y:this.parent.p.y}get coord(){return this._coord}get use(){return this._use!==!1}get xLock(){return this._xLock}get yLock(){return this._yLock}get type(){return this._type}set x(t){if(this.type==="p"){let n=t-this.x;this.parent.updatePathPointPosition("p",n,0)}else this.coord.x=t,this.use=!0}set y(t){if(this.type==="p"){let n=t-this.y;this.parent.updatePathPointPosition("p",0,n)}else this.coord.y=t,this.use=!0}set coord(t){this._coord=new qo(t),this._coord.parent=this,this.use=!0}set use(t){this._use=!!t,this.changed()}set xLock(t){this._xLock=!!t}set yLock(t){this._yLock=!!t}set type(t){this._type=t}get isLockable(){return!0}isLocked(t){return t==="x"?this.xLock:t==="y"?this.yLock:!1}lock(t){t==="x"&&(this.xLock=!0),t==="y"&&(this.yLock=!0)}unlock(t){t==="x"&&(this.xLock=!1),t==="y"&&(this.yLock=!1)}rotate(t,n){Ze(this.coord,t,n)}}const Qx=Object.freeze(Object.defineProperty({__proto__:null,ControlPoint:at},Symbol.toStringTag,{value:"Module"}));class Gt extends cr{constructor({p:t,h1:n,h2:e,type:a="corner",parent:i=!1}={}){super(),this.parent=i,this.p=t,this.h1=n,this.h2=e,this.type=a,this.objType="PathPoint",this.hasOverlappingHandle("h1")&&(this.h1.use=!1),this.hasOverlappingHandle("h2")&&(this.h2.use=!1)}save(t=!1){const n={type:this.type,p:this.p.save(t)};return(this.h1.use||!this.h1.use&&!this.hasOverlappingHandle("h1"))&&(n.h1=this.h1.save(t)),(this.h2.use||!this.h2.use&&!this.hasOverlappingHandle("h2"))&&(n.h2=this.h2.save(t)),t&&(n.objType=this.objType),!t&&this.__ID&&delete this.__ID,n}print(t=0,n=!1){let e="";for(let o=0;o<t;o++)e+="  ";let a=parseInt(n)?` ${parseInt(n)}`:"",i=`${e}{PathPoint${a}
`;return e+="  ",i+=`${e}type: ${this.type}
`,i+=`${e}p: ${this.p.print(t+1)}
`,i+=`${e}h1: ${this.h1.print(t+1)}
`,i+=`${e}h2: ${this.h2.print(t+1)}
`,i+=`${e.substring(2)}}/PathPoint${a}`,i}get p(){return this._p}get h1(){return this._h1}get h2(){return this._h2}get type(){return this._type}get pointNumber(){if(!this.parent)return!1;const t=this.parent.pathPoints;if(!t)return!1;for(let n=0;n<t.length;n++)if(t[n]===this)return n;return!1}set p(t={}){t.type="p",this._p=new at(t),this._p.parent=this}set h1(t={}){t.coord||(t.coord={x:this.p.x-50,y:this.p.y},t.use=!1),t.type="h1",this._h1=new at(t),this._h1.parent=this}set h2(t={}){t.coord||(t.coord={x:this.p.x+50,y:this.p.y},t.use=!1),t.type="h2",this._h2=new at(t),this._h2.parent=this}set type(t){t==="symmetric"?this.makeSymmetric():t==="flat"?this.makeFlat():this._type="corner"}updatePathPointPosition(t="p",n=0,e=0){switch(n=parseFloat(n),e=parseFloat(e),n=Number.isFinite(n)?n:0,e=Number.isFinite(e)?e:0,t){case"p":this.p.coord.x+=n,this.p.coord.y+=e,this.h1.coord.x+=n,this.h1.coord.y+=e,this.h2.coord.x+=n,this.h2.coord.y+=e;break;case"h1":this.h1.coord.x+=n,this.h1.coord.y+=e,this.h1.use&&(this.type==="symmetric"?this.makeSymmetric("h1"):this.type==="flat"&&this.makeFlat("h1"));break;case"h2":this.h2.coord.x+=n,this.h2.coord.y+=e,this.h2.use&&(this.type==="symmetric"?this.makeSymmetric("h2"):this.type==="flat"&&this.makeFlat("h2"));break}}makeSymmetric(t){if(this._type="symmetric",!t&&(t=this.h1.use?"h1":"h2",!(this.h1.use||this.h2.use)&&lt(this.p.coord,this.h1.coord)&&lt(this.p.coord,this.h2.coord))){this.h2.x-=200,this.h1.x+=200,this.h1.use=!0,this.h2.use=!0;return}this.h1.use=!0,this.h2.use=!0;let n,e,a=!1;switch(t){case"h1":n=this.p.x-this.h1.x+this.p.x,this.h2.x!==n&&(this.h2.x=n,a=!0),e=this.p.y-this.h1.y+this.p.y,this.h2.y!==e&&(this.h2.y=e,a=!0);break;case"h2":n=this.p.x-this.h2.x+this.p.x,this.h1.x!==n&&(this.h1.x=n,a=!0),e=this.p.y-this.h2.y+this.p.y,this.h1.y!==e&&(this.h1.y=e,a=!0);break}return this._type="symmetric",a&&(this.h1.use=!0,this.h2.use=!0),this}makeFlat(t){if(this._type="flat",this.isFlat())return;if(!t&&(t=this.h1.use?"h1":"h2",!(this.h1.use||this.h2.use)&&lt(this.p.coord,this.h1.coord)&&lt(this.p.coord,this.h2.coord))){this.h2.x-=300,this.h1.x+=100;return}this.h1.use=!0,this.h2.use=!0;const n=Zr(this.h1.coord,this.p.coord),e=Zr(this.h2.coord,this.p.coord),a=gn(this.p.coord,this.h1.coord),i=gn(this.p.coord,this.h2.coord);let o,A,x,E;return t==="h1"?(x=Math.cos(n)*i,E=Math.tan(n)*x,o=this.p.x+x*-1,A=this.p.y+E*-1,!isNaN(o)&&!isNaN(A)&&(this.h2.x!==o&&(this.h2.x=o),this.h2.y!==A&&(this.h2.y=A))):t==="h2"&&(x=Math.cos(e)*a,E=Math.tan(e)*x,o=this.p.x+x*-1,A=this.p.y+E*-1,!isNaN(o)&&!isNaN(A)&&(this.h1.x!==o&&(this.h1.x=o),this.h1.y!==A&&(this.h1.y=A))),this}isFlat(){if(!this.h1.use||!this.h2.use)return!1;if(this.p.x===this.h1.x&&this.p.x===this.h2.x||this.p.y===this.h1.y&&this.p.y===this.h2.y)return!0;const t=Zr(this.h1.coord,this.p.coord),n=Zr(this.h2.coord,this.p.coord);return R(Math.abs(t)+Math.abs(n),2)===3.14}reconcileHandle(t="h1"){let n=t==="h1"?"h2":"h1";this.type==="symmetric"?this.makeSymmetric(n):this.type==="flat"&&this.makeFlat(n)}resolvePointType(){if(this.isFlat()){const t=gn(this.p.coord,this.h1.coord),n=gn(this.p.coord,this.h2.coord);t===n?this._type="symmetric":this._type="flat"}else this._type="corner";return this.type}makePointedTo(t,n,e=!1,a="h2",i=!1){const o=this.p.x-t,A=this.p.y-n,x=A>=0?-1:1,E=-1,l=Math.sqrt(o*o+A*A),T=Math.acos(o/l);return e=e||l/3,this[a].x=this.p.x+Math.cos(T)*e*E,this[a].y=this.p.y+Math.sin(T)*e*x,i||(this.type==="corner"?this.makeFlat(a):this.makeSymmetric(a)),this}hasOverlappingHandle(t){return!this[t]||!this[t].coord?!1:lt(this[t].coord,this.p.coord)}rotate(t,n){return this.p.rotate(t,n),this.h1.rotate(t,n),this.h2.rotate(t,n),this}resetHandles(){return this.type="corner",this.h1.use=!0,this.h2.use=!0,this.h2.x=this.p.x-100,this.h2.y=this.p.y,this.h1.x=this.p.x+100,this.h1.y=this.p.y,this}roundAll(t=9){this.p.x=R(this.p.x,t),this.p.y=R(this.p.y,t);let n=this.h1.use;this.h1.x=R(this.h1.x,t),this.h1.y=R(this.h1.y,t),this.h1.use=n;let e=this.h2.use;return this.h2.x=R(this.h2.x,t),this.h2.y=R(this.h2.y,t),this.h2.use=e,this}}const qx=Object.freeze(Object.defineProperty({__proto__:null,PathPoint:Gt},Symbol.toStringTag,{value:"Module"}));class xr{constructor(t=0,n=0){t=parseFloat(t),this.x=isNaN(t)?0:t,n=parseFloat(n),this.y=isNaN(n)?0:n}}const $x=Object.freeze(Object.defineProperty({__proto__:null,XYPoint:xr},Symbol.toStringTag,{value:"Module"}));class wt extends cr{constructor({p1x:t=0,p1y:n=0,p2x:e,p2y:a,p3x:i,p3y:o,p4x:A=0,p4y:x=0,point1ID:E=!1,point2ID:l=!1}={}){super(),this.p1x=Vt(t),this.p1y=Vt(n),this.p4x=Vt(A),this.p4y=Vt(x),this.p2x=j(e)?Vt(e):this.p1x,this.p2y=j(a)?Vt(a):this.p1y,this.p3x=j(i)?Vt(i):this.p4x,this.p3y=j(o)?Vt(o):this.p4y,E&&(this.point1ID=E),l&&(this.point2ID=l),this.objType="Segment",this.recalculateMaxes()}save(t=!1){const n={p1x:this.p1x,p1y:this.p1y,p2x:this.p2x,p2y:this.p2y,p3x:this.p3x,p3y:this.p3y,p4x:this.p4x,p4y:this.p4y};return t&&(n.objType=this.objType),n}print(t=0){let n="";for(let a=0;a<t;a++)n+="  ";let e=`${n}{Segment
`;return n+="  ",e+=`${n+"  "}line: ${this.lineType}
`,e+=`${n+"  "}p1: ${this.p1x}/${this.p1y}
`,e+=`${n+"  "}p2: ${this.p2x}/${this.p2y}
`,e+=`${n+"  "}p3: ${this.p3x}/${this.p3y}
`,e+=`${n+"  "}p4: ${this.p4x}/${this.p4y}
`,e+=`${n+"  "}maxes: ${this.maxes.print(t+1)}
`,e+=`${n.substring(2)}}`,e}get lineType(){return j(this._lineType)||this.determineLineType(),this._lineType}get length(){return this.cache.length?this.cache.length:(this.cache.length=this.calculateLength(),this.cache.length)}get baseLength(){return Vn(this.p1x,this.p1y,this.p4x,this.p4y)}get topLength(){const t=Vn(this.p1x,this.p1y,this.p2x,this.p2y),n=Vn(this.p2x,this.p2y,this.p3x,this.p3y),e=Vn(this.p3x,this.p3y,this.p4x,this.p4y);return t+n+e}get quickLength(){return Math.max(this.topLength,this.baseLength)}get maxes(){return(!this.cache.maxes||Ta(this.cache.maxes))&&this.recalculateMaxes(),new Qt(this.cache.maxes)}get valuesAsArray(){return[this.p1x,this.p1y,this.p2x,this.p2y,this.p3x,this.p3y,this.p4x,this.p4y]}set maxes(t){this.cache.maxes={},this.cache.maxes=new Qt(t)}split(t=.5){return typeof t=="object"&&j(t.x)&&j(t.y)?this.splitAtPoint(t):isNaN(t)?!1:this.splitAtTime(t)}splitAtPoint(t){if(this.containsTerminalPoint(t,.1))return!1;if(this.lineType==="horizontal"||this.lineType==="vertical"){let n,e,a=!1;return this.lineType==="horizontal"?R(t.y,2)===R(this.p1y,2)&&t.x>Math.min(this.p1x,this.p4x)&&t.x<Math.max(this.p1x,this.p4x)&&(n=t.x,e=this.p1y,a=!0):this.lineType==="vertical"&&R(t.x,2)===R(this.p1x,2)&&t.y>Math.min(this.p1y,this.p4y)&&t.y<Math.max(this.p1y,this.p4y)&&(n=this.p1x,e=t.y,a=!0),a?[new wt({p1x:this.p1x,p1y:this.p1y,p4x:n,p4y:e}),new wt({p1x:n,p1y:e,p4x:this.p4x,p4y:this.p4y})]:!1}else if(this.pointIsWithinMaxes(t)){const e=this.getSplitFromXYPoint(t,.1);if(e&&e.distance<.1)return this.splitAtTime(e.split)}return!1}splitAtTime(t=.5){const n=1-t,e=this.p1x*n+this.p2x*t,a=this.p1y*n+this.p2y*t,i=this.p2x*n+this.p3x*t,o=this.p2y*n+this.p3y*t,A=this.p3x*n+this.p4x*t,x=this.p3y*n+this.p4y*t,E=e*n+i*t,l=a*n+o*t,T=i*n+A*t,s=o*n+x*t,c=E*n+T*t,I=l*n+s*t;return[new wt({p1x:this.p1x,p1y:this.p1y,p2x:e,p2y:a,p3x:E,p3y:l,p4x:c,p4y:I}),new wt({p1x:c,p1y:I,p2x:T,p2y:s,p3x:A,p3y:x,p4x:this.p4x,p4y:this.p4y})]}splitAtManyPoints(t,n=1){const e=[new wt(Zt(this))];let a;for(let i=0;i<t.length;i++)for(let o=0;o<e.length;o++)e[o].containsTerminalPoint(t[i],n)||(a=e[o].splitAtPoint(t[i]),a&&e.splice(o,1,a[0],a[1]));return e}pointIsWithinMaxes(t){const n=this.maxes;return t.x<=n.xMax&&t.x>=n.xMin&&t.y<=n.yMax&&t.y>=n.yMin}convertToLine(){return new wt({p1x:this.p1x,p1y:this.p1y,p4x:this.p4x,p4y:this.p4y})}getSplitFromXYPoint(t,n=1){const e=this.quickLength*1e3;let a=999999999,i=!1,o,A;for(let x=0;x<1;x+=1/e)if(o=this.findXYPointFromSplit(x),A=Math.sqrt((o.x-t.x)*(o.x-t.x)+(o.y-t.y)*(o.y-t.y)),A<a&&(a=A,i={split:x,distance:A,x:o.x,y:o.y},n&&i.distance<n))return i;return i}calculateLength(){if(this.lineType)return this.baseLength;let t;const n=10;if(this.quickLength<n)return this.quickLength;{const e=this.split();return t=e[0].calculateLength()+e[1].calculateLength(),t}}findXYPointFromSplit(t=.5){const n=1-t,e=this.p1x*n+this.p2x*t,a=this.p1y*n+this.p2y*t,i=this.p2x*n+this.p3x*t,o=this.p2y*n+this.p3y*t,A=this.p3x*n+this.p4x*t,x=this.p3y*n+this.p4y*t,E=e*n+i*t,l=a*n+o*t,T=i*n+A*t,s=o*n+x*t,c=E*n+T*t,I=l*n+s*t;return new xr(c,I)}getReverse(){return new wt({p1x:this.p4x,p1y:this.p4y,p2x:this.p3x,p2y:this.p3y,p3x:this.p2x,p3y:this.p2y,p4x:this.p1x,p4y:this.p1y})}getXYPoint(t){if(t===1)return new xr(this.p1x,this.p1y);if(t===2)return new xr(this.p2x,this.p2y);if(t===3)return new xr(this.p3x,this.p3y);if(t===4)return new xr(this.p4x,this.p4y)}getFastMaxes(){const t={xMin:Math.min(this.p1x,Math.min(this.p2x,Math.min(this.p3x,this.p4x))),yMin:Math.min(this.p1y,Math.min(this.p2y,Math.min(this.p3y,this.p4y))),xMax:Math.max(this.p1x,Math.max(this.p2x,Math.max(this.p3x,this.p4x))),yMax:Math.max(this.p1y,Math.max(this.p2y,Math.max(this.p3y,this.p4y)))};return new Qt(t)}recalculateMaxes(){function t(p,u){p.xMin>u?p.xMin=u:p.xMax<u&&(p.xMax=u)}function n(p,u){p.yMin>u?p.yMin=u:p.yMax<u&&(p.yMax=u)}function e(p,u,D,M,f){const O=1-p;return O*O*O*u+3*O*O*p*D+3*O*p*p*M+p*p*p*f}const a={xMin:Math.min(this.p1x,this.p4x),yMin:Math.min(this.p1y,this.p4y),xMax:Math.max(this.p1x,this.p4x),yMax:Math.max(this.p1y,this.p4y)};if(this.lineType)return this.maxes=a,this.maxes;const i=this.p2x-this.p1x,o=this.p2y-this.p1y;let A=this.p3x-this.p2x,x=this.p3y-this.p2y;const E=this.p4x-this.p3x,l=this.p4y-this.p3y;let T,s,c,I,h,S;return(this.p2x<a.xMin||this.p2x>a.xMax||this.p3x<a.xMin||this.p3x>a.xMax)&&(i+E!==2*A&&(A+=.01),T=2*(i-A),s=2*(i-2*A+E),c=(2*A-2*i)*(2*A-2*i)-2*i*s,I=Math.sqrt(c),h=(T+I)/s,S=(T-I)/s,0<h&&h<1&&t(a,e(h,this.p1x,this.p2x,this.p3x,this.p4x)),0<S&&S<1&&t(a,e(S,this.p1x,this.p2x,this.p3x,this.p4x))),(this.p2y<a.yMin||this.p2y>a.yMax||this.p3y<a.yMin||this.p3y>a.yMax)&&(o+l!==2*x&&(x+=.01),T=2*(o-x),s=2*(o-2*x+l),c=(2*x-2*o)*(2*x-2*o)-2*o*s,I=Math.sqrt(c),h=(T+I)/s,S=(T-I)/s,0<h&&h<1&&n(a,e(h,this.p1y,this.p2y,this.p3y,this.p4y)),0<S&&S<1&&n(a,e(S,this.p1y,this.p2y,this.p3y,this.p4y))),this.maxes=a,this.maxes}isLineOverlappedByLine(t){if(!this.lineType||!t.lineType)return!1;const n=t.containsPointOnLine(this.getXYPoint(1)),e=t.containsPointOnLine(this.getXYPoint(4));return n&&e}containsTerminalPoint(t,n=1){return this.containsStartPoint(t,n)?"start":this.containsEndPoint(t,n)?"end":!1}containsStartPoint(t,n=1){return lt(this.getXYPoint(1),t,n)}containsEndPoint(t,n=1){return lt(this.getXYPoint(4),t,n)}containsPointOnCurve(t,n){if(this.containsTerminalPoint(t,n))return!0;if(this.lineType)return this.containsPointOnLine(t);n=j(n)?n:.1;const e=this.getSplitFromXYPoint(t,n);return!!(e&&e.distance<n)}containsPointOnLine(t){if(!this.lineType||this.containsTerminalPoint(t))return!1;function n(e,a,i){return e<=a&&a<=i||i<=a&&a<=e}return!!(n(this.p1x,t.x,this.p4x)&&n(this.p1y,t.y,this.p4y)&&We(this.getXYPoint(1),this.getXYPoint(4),t))}precedes(t,n=1){const e=this.getXYPoint(4),a=t.getXYPoint(1);return lt(e,a,n)}determineLineType(t){t=j(t)?t:1;let n=!1;return R(this.p1x,t)===R(this.p2x,t)&&R(this.p1x,t)===R(this.p3x,t)&&R(this.p1x,t)===R(this.p4x,t)&&(n="vertical"),R(this.p1y,t)===R(this.p2y,t)&&R(this.p1y,t)===R(this.p3y,t)&&R(this.p1y,t)===R(this.p4y,t)&&(n="horizontal"),We(this.getXYPoint(1),this.getXYPoint(4),this.getXYPoint(2))&&We(this.getXYPoint(1),this.getXYPoint(4),this.getXYPoint(3))&&(n="diagonal"),this._lineType=n,n}roundAll(t=3){return this.p1x=R(this.p1x,t),this.p1y=R(this.p1y,t),this.p2x=R(this.p2x,t),this.p2y=R(this.p2y,t),this.p3x=R(this.p3x,t),this.p3y=R(this.p3y,t),this.p4x=R(this.p4x,t),this.p4y=R(this.p4y,t),this}}function Vn(r,t,n,e){const a=Math.abs(r-n),i=Math.abs(t-e);return Math.sqrt(a*a+i*i)}function We(r,t,n,e){e=j(e)?e:3;const a=(t.x-r.x)*(n.y-r.y),i=(n.x-r.x)*(t.y-r.y);return R(a,e)===R(i,e)}const tE=Object.freeze(Object.defineProperty({__proto__:null,Segment:wt,getLineLength:Vn,pointsAreCollinear:We},Symbol.toStringTag,{value:"Module"}));class qr extends cr{constructor({segments:t=[]}={}){super(),this.segments=t,this.objType="PolySegment"}save(t=!1){const n={segments:[]};for(let e=0;e<this._segments.length;e++)n.segments[e]=this._segments[e].save(t);return t&&(n.objType=this.objType),n}print(t=0){let n="";for(let a=0;a<t;a++)n+="  ";let e=`${n}{PolySegment
`;return n+="  ",e+=`${n}segments: [
`,this.segments.forEach(a=>{e+=a.print(t+2),e+=`
`}),e+=`${n}]
`,e+=`${n.substring(2)}}`,e}get segments(){return this._segments}set segments(t=[]){this._segments=[];for(let n=0;n<t.length;n++)this._segments[n]=new wt(t[n])}get valuesAsArray(){let t=[];return this.segments.forEach(n=>t.push(n.valuesAsArray)),t}get path(){function t(A,x){const E={h1:{coord:{x:A.p3x,y:A.p3y}},p:{coord:{x:x.p1x,y:x.p1y}},h2:{coord:{x:x.p2x,y:x.p2y}}};return lt(E.h1.coord,E.p.coord)&&(E.h1.use=!1),lt(E.h2.coord,E.p.coord)&&(E.h2.use=!1),A.lineType&&(E.h1.use=!1),x.lineType&&(E.h2.use=!1),E}const n=[],e=Zt(this._segments),a=new xr(e[0].p1x,e[0].p1y),i=new xr(e.at(-1).p4x,e.at(-1).p4y);lt(a,i)||e.push(new wt({p1x:i.x,p1y:i.y,p4x:a.x,p4y:a.y})),n.push(t(e.at(-1),e[0]));let o;for(let A=0;A<e.length-1;A++)o=e[A+1],n.push(t(e[A],o));return new Xt({pathPoints:n})}containsSegment(t){for(let n=0;n<this._segments.length;n++)if(A0(this._segments[n],t))return!0;return!1}roundAll(t=3){for(let n=0;n<this._segments.length;n++)this._segments[n].roundAll(t);return this}findIntersections(){let t,n,e=[];for(let a=0;a<this._segments.length;a++)for(let i=a;i<this._segments.length;i++)i!==a&&(t=new wt(this._segments[a]),n=new wt(this._segments[i]),e=e.concat(Sa(t,n)));return e=e.filter(or),e}splitSegmentsAtIntersections(t=this.findIntersections(),n=1){let e,a;t.forEach(function(o,A){e=o.split("/")[0],a=o.split("/")[1],t[A]=new xr(e,a)});let i=[];for(let o=0;o<this._segments.length;o++)i=i.concat(this._segments[o].splitAtManyPoints(t,n));return this._segments=i,this.cache.splits=t,this}stitchSegmentsTogether(){const t=this.segments;let n=[];const e=[];function a(x){let E,l;for(let T=0;T<t.length;T++)if(E=t[T],E.objType==="Segment"&&E.containsStartPoint(x,0))return l=new wt(E),E.objType="-"+e.length+"."+n.length,l;for(let T=0;T<t.length;T++)if(E=t[T].getReverse(),t[T].objType==="Segment"&&E.containsStartPoint(x,0))return l=new wt(E),t[T].objType="R"+e.length+"."+n.length,l;return!1}function i(){for(let x=0;x<t.length;x++)if(t[x].objType==="Segment")return t[x].getXYPoint(1)}let o,A=i();for(let x=0;x<t.length;x++)o=a(A),o?(n.push(o),A=o.getXYPoint(4)):n.length&&(e.push(new qr({segments:n})),n[n.length-1].containsEndPoint(n[0].getXYPoint(1)),n=[],A=i(),x--);return n.length&&(e.push(new qr({segments:n})),n[n.length-1].containsEndPoint(n[0].getXYPoint(1))),e}removeZeroLengthSegments(){let t;for(let n=0;n<this._segments.length;n++)t=this._segments[n],lt(t.getXYPoint(1),t.getXYPoint(4))&&(t.lineType?t.objType="LINE ZERO":lt(t.getXYPoint(1),t.getXYPoint(2))&&lt(t.getXYPoint(1),t.getXYPoint(3))&&(t.objType="ZERO"));return this._segments=this._segments.filter(function(n){return n.objType==="Segment"}),this}removeRedundantLineSegments(){for(let t=0;t<this._segments.length;t++)for(let n=0;n<this._segments.length;n++)if(t!==n&&this._segments[t]&&this._segments[n]){let e=this._segments[t],a=this._segments[n];e.isLineOverlappedByLine(a)&&(e.objType="REDUNDANT"),a.isLineOverlappedByLine(e)&&(a.objType="REDUNDANT"),a.objType==="Segment"&&e.objType==="Segment"&&A0(e,a)&&(e.objType="DUPLICATE")}return this._segments=this._segments.filter(function(t){return t.objType==="Segment"}),this}removeNonConnectingSegments(){let t,n;const e=[],a=[];for(let o=0;o<this._segments.length;o++){t=this._segments[o],e[o]=!1,a[o]=!1;for(let A=0;A<this._segments.length&&(n=this._segments[A],!(o!==A&&(n.containsTerminalPoint(t.getXYPoint(1),1)&&(e[o]=!0),n.containsTerminalPoint(t.getXYPoint(4),1)&&(a[o]=!0),e[o]&&a[o])));A++);}for(let o=0;o<this._segments.length;o++)e[o]&&a[o]||(this._segments[o].objType="NON CONNECTED");return this._segments=this._segments.filter(function(o){return o.objType==="Segment"}),this}combineInlineSegments(){let t,n;for(let e=0;e<this.segments.length;e++)t=this.segments[e],n=this.segments[e+1],e===this.segments.length-1&&(n=this.segments[0]),t.lineType===n.lineType&&(this.segments[e]=new wt({p1x:t.p1x,p1y:t.p1y,p4x:n.p4x,p4y:n.p4y}),this.segments.splice(e+1,1),e--)}}function Sa(r,t,n){if(n=n||0,n===0){const S=$o(r,t);if(S.length)return S}if(n===0){const S=tA(r,t);if(S.length)return S}let e=[];n===0&&(r.lineType||t.lineType)&&(e=rA(r,t));const a=r.getFastMaxes(),i=t.getFastMaxes();if(!Qn(a,i))return[];const o=9e-4,A=3;let x=a.xMax-a.xMin,E=a.yMax-a.yMin,l=i.xMax-i.xMin,T=i.yMax-i.yMin;if(x<o&&E<o&&l<o&&T<o){x*=.5,E*=.5,l*=.5,T*=.5;let S=(a.xMin+x+(i.xMin+l))/2,p=(a.yMin+E+(i.yMin+T))/2;return S=R(S,A),p=R(p,A),[""+S+"/"+p]}let s=[];const c=r.splitAtTime(.5),I=t.splitAtTime(.5);let h=[[c[0],I[0]],[c[0],I[1]],[c[1],I[1]],[c[1],I[0]]];return h=h.filter(function(S){return Qn(S[0].getFastMaxes(),S[1].getFastMaxes(),"inclusive")}),h.forEach(function(S){s=s.concat(Sa(S[0],S[1],n+1))}),s=s.concat(e),s=s.filter(or),s}function A0(r,t,n=1){if(lt(r.getXYPoint(1),t.getXYPoint(1),n)&&lt(r.getXYPoint(4),t.getXYPoint(4),n)){if(r.lineType&&t.lineType)return!0;if(lt(r.getXYPoint(2),t.getXYPoint(2),n)&&lt(r.getXYPoint(3),t.getXYPoint(3),n))return!0}return!1}function $o(r,t){const n=[];return r.containsPointOnLine(t.getXYPoint(1))&&n.push(""+t.p1x+"/"+t.p1y),r.containsPointOnLine(t.getXYPoint(4))&&n.push(""+t.p4x+"/"+t.p4y),t.containsPointOnLine(r.getXYPoint(1))&&n.push(""+r.p1x+"/"+r.p1y),t.containsPointOnLine(r.getXYPoint(4))&&n.push(""+r.p4x+"/"+r.p4y),n.length,n}function tA(r,t){if(!r.lineType||!t.lineType)return[];const n=r.p4x-r.p1x,e=r.p4y-r.p1y,a=t.p4x-t.p1x,i=t.p4y-t.p1y,o=(-1*e*(r.p1x-t.p1x)+n*(r.p1y-t.p1y))/(-1*a*e+n*i),A=(a*(r.p1y-t.p1y)-i*(r.p1x-t.p1x))/(-1*a*e+n*i);if(o>=0&&o<=1&&A>=0&&A<=1){const x=Vt(r.p1x+A*n),E=Vt(r.p1y+A*e);return r.containsTerminalPoint({x,y:E})&&t.containsTerminalPoint({x,y:E})?[]:[""+x+"/"+E]}return[]}function rA(r,t){const n=r.getXYPoint(1),e=r.getXYPoint(4),a=t.getXYPoint(1),i=t.getXYPoint(4),o=[];return r.containsPointOnCurve(a)&&o.push(`${a.x}/${a.y}`),r.containsPointOnCurve(i)&&o.push(`${i.x}/${i.y}`),t.containsPointOnCurve(n)&&o.push(`${n.x}/${n.y}`),t.containsPointOnCurve(e)&&o.push(`${e.x}/${e.y}`),o}const rE=Object.freeze(Object.defineProperty({__proto__:null,PolySegment:qr,findCrossingLineSegmentIntersections:tA,findEndPointSegmentIntersections:rA,findOverlappingLineSegmentIntersections:$o,findSegmentIntersections:Sa,segmentsAreEqual:A0},Symbol.toStringTag,{value:"Module"}));let Xt=class extends cr{constructor({name:t="Path",objType:n="Path",pathPoints:e=[],winding:a,xLock:i=!1,yLock:o=!1,wLock:A=!1,hLock:x=!1,transformOrigin:E=!1,ratioLock:l=!1,parent:T=!1}={}){super(),this.name=t,this.pathPoints=e,this.winding=a,this.xLock=i,this.yLock=o,this.wLock=A,this.hLock=x,this.transformOrigin=E,this.ratioLock=l,this.parent=T,this.objType=n}save(t=!1){const n={name:this.name,winding:this.winding,pathPoints:[]};return this.xLock&&(n.xLock=!0),this.yLock&&(n.yLock=!0),this.wLock&&(n.wLock=!0),this.hLock&&(n.hLock=!0),this.transformOrigin&&this.transformOrigin!=="baseline-left"&&(n.transformOrigin=this.transformOrigin),this.ratioLock&&(n.ratioLock=!0),this._pathPoints.forEach(e=>{n.pathPoints.push(e.save(t))}),t&&(n.objType=this.objType),!t&&this.__ID&&delete this.__ID,n}print(t=0){let n="";for(let a=0;a<t;a++)n+="  ";let e=`${n}{Path
`;return n+="  ",e+=`${n}winding: ${this.winding}
`,this.name!=="Path"&&(e+=`${n}name: ${this.name}
`),this.xLock&&(e+=`${n}xLock: ${this.xLock}
`),this.yLock&&(e+=`${n}yLock: ${this.yLock}
`),this.wLock&&(e+=`${n}wLock: ${this.wLock}
`),this.hLock&&(e+=`${n}hLock: ${this.hLock}
`),this.ratioLock&&(e+=`${n}ratioLock: ${this.ratioLock}
`),e+=`${n}pathPoints: [
`,this._pathPoints.forEach((a,i)=>{e+=a.print(t+2,i),e+=`
`}),e+=`${n}]
`,e+=`${n.substring(2)}}/Path`,e}get name(){return this._name}get pathPoints(){return this._pathPoints}get winding(){return j(this._winding)||(this.findWinding?this.findWinding():this._winding=0),this._winding}get x(){return this.maxes.xMin}get y(){return this.maxes.yMax}get height(){const t=this.maxes.yMax-this.maxes.yMin;return Math.max(t,0)}get width(){const t=this.maxes.xMax-this.maxes.xMin;return Math.max(t,0)}get xLock(){return this._xLock}get yLock(){return this._yLock}get wLock(){return this._wLock}get hLock(){return this._hLock}get transformOrigin(){return this._transformOrigin||(this._transformOrigin="baseline-left"),this._transformOrigin}get ratioLock(){return this._ratioLock}get maxes(){return this.cache.maxes?Ta(this.cache.maxes)?this.recalculateMaxes():U0(this.cache.maxes)&&this.recalculateMaxes():this.recalculateMaxes(),new Qt(this.cache.maxes)}get svgPathData(){return this.cache.svgPathData?this.cache.svgPathData:(this.cache.svgPathData=this.makeSVGPathData(),this.cache.svgPathData)}set name(t){t=G0(t),t!==""&&(this._name=t)}set pathPoints(t){if(this._pathPoints=[],t&&t.length)for(let n=0;n<t.length;n++)this._pathPoints[n]=new Gt(t[n]),this._pathPoints[n].parent=this}set winding(t){j(t)?this._winding=t:this.findWinding()}set x(t){this.setShapePosition(t,!1)}set y(t){this.setShapePosition(!1,t)}set height(t){this.setShapeSize({height:t})}set width(t){this.setShapeSize({width:t})}set xLock(t){this._xLock=!!t}set yLock(t){this._yLock=!!t}set wLock(t){this._wLock=!!t}set hLock(t){this._hLock=!!t}set transformOrigin(t){Ee.indexOf(t)>-1?this._transformOrigin=t:this._transformOrigin=!1}set ratioLock(t){this._ratioLock=!!t}set maxes(t){this.cache.maxes={},this.cache.maxes=new Qt(t)}set svgPathData(t){this.cache.svgPathData=t}get isLockable(){return!0}isLocked(t){return t==="x"?this.xLock:t==="y"?this.yLock:t==="width"?this.wLock:t==="height"?this.hLock:!1}lock(t){t==="x"&&(this.xLock=!0),t==="y"&&(this.yLock=!0),t==="width"&&(this.wLock=!0),t==="height"&&(this.hLock=!0)}unlock(t){t==="x"&&(this.xLock=!1),t==="y"&&(this.yLock=!1),t==="width"&&(this.wLock=!1),t==="height"&&(this.hLock=!1)}setShapeSize({width:t=!1,height:n=!1,ratioLock:e=!1,transformOrigin:a=!1}={}){t!==!1&&(t=parseFloat(t)),n!==!1&&(n=parseFloat(n));const i=t!==!1?t-this.width:0,o=n!==!1?n-this.height:0;return this.updateShapeSize({width:i,height:o,ratioLock:e,transformOrigin:a}),this}updateShapeSize({width:t=0,height:n=0,ratioLock:e=!1,transformOrigin:a=!1}={}){let i=parseFloat(t),o=parseFloat(n);if(!i&&!o)return;if(e&&i!==o){const S=this.width/this.height;Math.abs(i)>Math.abs(o)?o=i/S:i=o*S}let A=this.width;A===0&&(A=1);let x=this.height;x===0&&(x=1);const E=Math.max(A+i,1),l=Math.max(x+o,1),T=l/x,s=E/A;if(e&&(E<=1||l<=1))return;let c=b0(i,o,this.maxes,a),I=this.maxes.xMin,h=this.maxes.yMin;this.pathPoints.forEach(S=>{S.p.coord.x=(S.p.coord.x-this.maxes.xMin)*s+I,S.h1.coord.x=(S.h1.coord.x-this.maxes.xMin)*s+I,S.h2.coord.x=(S.h2.coord.x-this.maxes.xMin)*s+I,S.p.coord.y=(S.p.coord.y-this.maxes.yMin)*T+h,S.h1.coord.y=(S.h1.coord.y-this.maxes.yMin)*T+h,S.h2.coord.y=(S.h2.coord.y-this.maxes.yMin)*T+h}),this.updateShapePosition(c.deltaX,c.deltaY)}setShapePosition(t=!1,n=!1){t!==!1&&(t=parseFloat(t)),n!==!1&&(n=parseFloat(n));const e=t!==!1?t*1-this.maxes.xMin:0,a=n!==!1?n*1-this.maxes.yMax:0;this.updateShapePosition(e,a)}updateShapePosition(t=0,n=0){t=parseFloat(t),n=parseFloat(n);for(let e=0;e<this.pathPoints.length;e++)this.pathPoints[e].updatePathPointPosition("p",t,n)}rotate(t,n=this.maxes.center){for(let e=0;e<this.pathPoints.length;e++)this.pathPoints[e].rotate(t,n)}getNextPointNum(t=0){return t=parseInt(t),t+=1,t=t%this.pathPoints.length,t}getPreviousPointNum(t=0){return t=parseInt(t),t-=1,t<0&&(t=t+this.pathPoints.length),t}containsPoint(t,n){for(let e=0;e<this.pathPoints.length;e++)if(lt(t,this.pathPoints[e].p,.01))if(n)n=!1;else return this.pathPoints[e];return!1}makeSVGPathData(t="not specified",n=8){if(!this.pathPoints||!this.pathPoints.length)return"";let e,a,i="",o="M"+R(this.pathPoints[0].p.x,n)+","+R(this.pathPoints[0].p.y,n);o.indexOf("NaN")>-1&&console.warn(t+" PathPoint 0 MOVE has NaN: "+o);for(let A=0;A<this.pathPoints.length;A++)e=this.pathPoints[A],a=this.pathPoints[this.getNextPointNum(A)],i=" C"+R(e.h2.x,n)+","+R(e.h2.y,n)+","+R(a.h1.x,n)+","+R(a.h1.y,n)+","+R(a.p.x,n)+","+R(a.p.y,n),i.indexOf("NaN")>-1&&console.warn(t+" PathPoint "+A+" has NaN: "+i),o+=i;return o+="Z",o}makePostScript(t=0,n=0){if(!this.pathPoints)return{re:"",lastX:t,lastY:n};let e,a,i,o,A,x,E,l,T="",s=`${this.pathPoints[0].p.x-t} ${this.pathPoints[0].p.y-n} rmoveto
		`;for(let c=0;c<this.pathPoints.length;c++)e=this.pathPoints[c],a=this.pathPoints[this.getNextPointNum(c)],i=e.h2.x-e.p.x,o=e.h2.y-e.p.y,A=a.h1.x-e.h2.x,x=a.h1.y-e.h2.y,E=a.p.x-a.h1.x,l=a.p.y-a.h1.y,T=`
					${i} ${o} ${A} ${x} ${E} ${l} rrcurveto
			`,s+=T;return{re:s.replaceAll("	",""),lastX:a.p.x,lastY:a.p.y}}makePolySegment(){const t=[];for(let e=0;e<this.pathPoints.length;e++)t.push(this.makeSegment(e));return new qr({segments:t})}makeSegment(t=0){if(t=t%this.pathPoints.length,this.cache.segments||(this.cache.segments=[]),this.cache.segments[t])return this.cache.segments[t];const n=this.pathPoints[t];let e=Math.round(Math.random()*1e4);n.pointID||(n.pointID=`point-${t}-${e}`);const a=this.getNextPointNum(t),i=this.pathPoints[a];i.pointID||(i.pointID=`point-${a}-${e}`);const o=new wt({point1ID:n.pointID,p1x:n.p.x,p1y:n.p.y,p2x:n.h2.x,p2y:n.h2.y,p3x:i.h1.x,p3y:i.h1.y,p4x:i.p.x,p4y:i.p.y,point2ID:i.pointID});return this.cache.segments[t]=o,o}addPointsAtPathIntersections(){const t=this.makePolySegment();t.splitSegmentsAtIntersections();const n=t.path;this._pathPoints=n.pathPoints}calculateQuickSegmentLength(t=0){let n=this.makeSegment(t);return n=n.quickLength,n}findWinding(t){let n,e,a,i=-1;const o=this.pathPoints;if(o.length===2)i=o[1].p.x>o[0].p.x?-1:1;else if(o.length>2)for(let A=0;A<o.length;A++)n=(A+1)%o.length,e=(A+2)%o.length,a=(o[n].p.x-o[A].p.x)*(o[e].p.y-o[n].p.y),a-=(o[n].p.y-o[A].p.y)*(o[e].p.x-o[n].p.x),a<0?i--:a>0&&i++;return i===0&&!t&&(this.reverseWinding(),i=this.findWinding(!0)*-1,this.reverseWinding()),this._winding=i,i}reverseWinding(){let t;this.pathPoints&&(this.pathPoints.forEach(n=>{t=n.h1,n.h1=n.h2,n.h2=t}),this.pathPoints.reverse(),this.winding*=-1,(this.winding===0||!j(this.winding))&&this.findWinding(!0))}flipNS(t=this.maxes.center.y){this.pathPoints.forEach(n=>{n.p.coord.y+=(t-n.p.coord.y)*2,n.h1.coord.y+=(t-n.h1.coord.y)*2,n.h2.coord.y+=(t-n.h2.coord.y)*2}),this.reverseWinding()}flipEW(t=this.maxes.center.x){this.pathPoints.forEach(n=>{n.p.coord.x+=(t-n.p.coord.x)*2,n.h1.coord.x+=(t-n.h1.coord.x)*2,n.h2.coord.x+=(t-n.h2.coord.x)*2}),this.reverseWinding()}roundAll(t=0){return this.pathPoints.forEach(n=>n.roundAll(t)),this}addPathPoint(t){return t=new Gt(t),t.parent=this,this.pathPoints.push(t),this.findWinding(),this.changed(),t}insertPathPoint(t=0,n=.5,e=!1){const a=t===!1?this.pathPoints[0]:this.pathPoints[t],i=this.getNextPointNum(t),o=this.pathPoints[i];let A,x,E,l;if(this.pathPoints.length>1){const T=this.makeSegment(t).split(n),s=T[0],c=T[1];A={coord:{x:s.p4x,y:s.p4y}},x={coord:{x:s.p3x,y:s.p3y}},E={coord:{x:c.p2x,y:c.p2y}},l=new Gt({p:A,h1:x,h2:E}),a.type==="symmetric"&&(a.type="flat"),a.h2.x=s.p2x,a.h2.y=s.p2y,o.type==="symmetric"&&(o.type="flat"),o.h1.x=c.p3x,o.h1.y=c.p3y}else A=new at({coord:{x:a.p.x+100,y:a.p.y+100}}),x=new at({coord:{x:a.h2.x+100,y:a.h2.y+100}}),E=new at({coord:{x:a.h1.x+100,y:a.h1.y+100}}),l=new Gt({p:A,h1:x,h2:E,type:a.type});return e&&l.roundAll(0),l.parent=this,this.pathPoints.splice(i,0,l),l}findClosestPointOnCurve(t=new xr,n=!1){let e=1e4,a=!1,i=!1,o=999999999,A,x;for(let l=0;l<this.pathPoints.length;l++){e=this.makeSegment(l).quickLength*100;for(let T=0;T<1;T+=1/e)A=this.findXYPointFromSplit(T,l),x=Math.sqrt((A.x-t.x)*(A.x-t.x)+(A.y-t.y)*(A.y-t.y)),x<o&&(a&&a.point!==l&&(i=Zt(a)),o=x,a={point:l,split:T,distance:x,x:A.x,y:A.y})}return n?i:a}findXYPointFromSplit(t,n=0){return this.pathPoints.length>1?this.makeSegment(n).findXYPointFromSplit(t):this.pathPoints[0].p}recalculateMaxes(){this.cache.maxes=new Qt,this.cache.segments||(this.cache.segments=[]);let t=this.pathPoints.map((n,e)=>this.makeSegment(e).maxes);this.cache.maxes=qn(t)}checkForNaN(){for(let t=0;t<this.pathPoints.length;t++){const n=this.pathPoints[t];if(isNaN(n.p.x)||isNaN(n.p.y)||isNaN(n.h1.x)||isNaN(n.h1.y)||isNaN(n.h2.x)||isNaN(n.h2.y))return!0}return!1}};const nE=Object.freeze(Object.defineProperty({__proto__:null,Path:Xt},Symbol.toStringTag,{value:"Module"}));let ot=class extends cr{constructor({id:t=!1,parent:n=!1,objType:e="Glyph",name:a=!1,shapes:i=[],advanceWidth:o=0,transformOrigin:A=!1,ratioLock:x=!1,usedIn:E=[],gsub:l=[],contextCharacters:T=""}={}){super(),this.id=t,this.parent=n,this.name=a,this.shapes=i,this.advanceWidth=o,this.transformOrigin=A,this.ratioLock=x,this.usedIn=E,this.gsub=l,this.contextCharacters=T,this.objType=e}save(t=!1){const n={name:this.name,id:this._id,objType:this.objType};this.advanceWidth!==0&&(n.advanceWidth=this.advanceWidth),this.transformOrigin&&this.transformOrigin!=="baseline-left"&&(n.transformOrigin=this.transformOrigin),this.ratioLock!==!1&&(n.ratioLock=this.ratioLock),this.usedIn.length&&(n.usedIn=this.usedIn),this.gsub.length&&(n.gsub=this.gsub);let e=this.contextCharacters;if(e.length&&e!==this.char&&(n.contextCharacters=e),this.shapes&&this.shapes.length){n.shapes=[];for(let a=0;a<this.shapes.length;a++)n.shapes.push(this.shapes[a].save(t))}return t||(this.objType==="Glyph"&&delete n.name,delete n.objType),!t&&this.__ID&&delete this.__ID,n}print(t=0){let n="";for(let a=0;a<t;a++)n+="  ";let e=`${n}{Glyph
`;return n+="  ",e+=`${n}id: ${this.id}
`,e+=`${n}name: ${this.name}
`,this.advanceWidth!==0&&(e+=`${n}advanceWidth: ${this.advanceWidth}
`),this.transformOrigin!==!1&&(e+=`${n}transformOrigin: ${this.transformOrigin}
`),this.ratioLock!==!1&&(e+=`${n}ratioLock: ${this.ratioLock}
`),this.usedIn.length&&(e+=`${n}usedIn: ${JSON.stringify(this.usedIn)}
`),this.gsub.length&&(e+=`${n}gsub: ${JSON.stringify(this.gsub)}
`),this.shapes&&this.shapes.length?(e+=`${n}shapes: [
`,this._shapes.forEach(a=>{e+=a.print(t+2),e+=`
`}),e+=`${n}]
`):e+=`${n}shapes: []
`,this.maxes&&(e+=`${n}maxes: ${this.maxes.print(t+1)}
`),e+=`${n.substring(2)}}/Glyph ${this.id}`,e}get id(){return this._id}get shapes(){return this._shapes}get advanceWidth(){return this._advanceWidth}get transformOrigin(){return this._transformOrigin||(this._transformOrigin="baseline-left"),this._transformOrigin}get ratioLock(){return this._ratioLock}get usedIn(){return this._usedIn||[]}get gsub(){return this._gsub||[]}get contextCharacters(){return!this._contextCharacters||this._contextCharacters===this.char?this.char:this._contextCharacters}get x(){return this.maxes.xMin}get y(){return this.maxes.yMax}get width(){const t=this.maxes.xMax-this.maxes.xMin;return Math.max(t,0)}get height(){const t=this.maxes.yMax-this.maxes.yMin;return Math.max(t,0)}get leftSideBearing(){return this.maxes.xMin}get rightSideBearing(){let t=this.maxes.xMax;return this.advanceWidth-t}get name(){let t=this._name;if(!t&&!this.id)return"[no id]";if(!t){if(this.id.startsWith("liga-")){let n=yr(this.id,"liga-");n=n.split("-"),t="Ligature ",n.forEach(e=>{e.length===1?t+=e:t+=lr(e)})}else if(this.id.startsWith("comp-"))t=`Component ${yr(this.id,"comp-")}`;else if(this.id.startsWith("glyph-")){let n=yr(this.id,"glyph-");t=bn(n)}this._name=t}return t}get char(){let t;return this.gsub.length?t=this.gsub.reduce((n,e)=>`${n}${String.fromCodePoint(e)}`,""):t=lr(yr(this.id,"glyph-")),t}get chars(){return this.char}get contentType(){if(this.cache.contentType)return this.cache.contentType;let t="unknown",n=0,e=0;return this.shapes.forEach(a=>{a.objType==="ComponentInstance"&&e++,a.objType==="Path"&&n++}),n>0&&e===0&&(t="paths"),e>0&&n===0&&(t="component instances"),n>0&&e>0&&(t="items"),this.cache.contentType=t,t}set id(t){this._id=t}set shapes(t=[]){this._shapes=[],t&&t.length&&t.forEach(n=>{this.addOneShape(n)}),this.changed()}addOneShape(t){return j(t.link)?(t.parent=this,this._shapes.push(new Yr(t))):(t.parent=this,this._shapes.push(new Xt(t))),this.changed(),this._shapes.at(-1)}set advanceWidth(t){this._advanceWidth=parseFloat(t),isNaN(this._advanceWidth)&&(this._advanceWidth=0)}set transformOrigin(t){Ee.indexOf(t)>-1?this._transformOrigin=t:this._transformOrigin=!1}set ratioLock(t){this._ratioLock=!!t}set usedIn(t){this._usedIn=t||[]}set gsub(t){this._gsub=t||[]}set contextCharacters(t=!1){!t||t===this.char||typeof t!="string"?delete this._contextCharacters:this._contextCharacters=t}set name(t){this._name=t}set x(t){this.setGlyphPosition(t,!1)}set y(t){this.setGlyphPosition(!1,t)}set width(t){this.setGlyphSize({width:t})}set height(t){this.setGlyphSize({height:t})}set leftSideBearing(t){let n=t-this.leftSideBearing;this.setGlyphPosition(t),this.advanceWidth+=n}set rightSideBearing(t){let n=t-this.rightSideBearing;this.advanceWidth+=n}setGlyphPosition(t,n,e=!0){const a=this.maxes;t!==!1&&(t=parseFloat(t)),n!==!1&&(n=parseFloat(n));const i=t!==!1?t-a.xMin:0,o=n!==!1?n-a.yMax:0;this.updateGlyphPosition(i,o,e)}updateGlyphPosition(t,n,e=!0){t=parseFloat(t)||0,n=parseFloat(n)||0;for(let a=0;a<this.shapes.length;a++){const i=this.shapes[a];i.objType==="ComponentInstance"&&!e||i.updateShapePosition(t,n)}}setGlyphSize({width:t=!1,height:n=!1,ratioLock:e=!1,updateComponentInstances:a=!0,transformOrigin:i=!1}={}){const o=this.maxes;t!==!1&&(t=parseFloat(t)),n!==!1&&(n=parseFloat(n));const A=o.yMax-o.yMin,x=o.xMax-o.xMin;let E=t!==!1?t-x:0,l=n!==!1?n-A:0;e&&(Math.abs(n)>Math.abs(t)?E=x*(n/A)-x:l=A*(t/x)-A),this.updateGlyphSize({width:E,height:l,updateComponentInstances:a,transformOrigin:i})}updateGlyphSize({width:t=0,height:n=0,ratioLock:e=!1,updateComponentInstances:a=!0,transformOrigin:i=!1}={}){const o=this.maxes;let A=parseFloat(t)||0,x=parseFloat(n)||0;const E=o.width,l=o.height;let T=E+A,s=l+x;Math.abs(T)<1&&(T=1),Math.abs(s)<1&&(s=1);let c=s/l,I=T/E;e&&(A!==0&&x===0?(c=I,s=l*c,x=s-l):(I=c,T=E*I,A=T-E));const h=b0(A,x,this.maxes,i);this.shapes.forEach(S=>{if(S.objType==="ComponentInstance"&&!a)return;const p=S.maxes,u=p.xMax-p.xMin,D=u*I;let M=!1;I!==0&&(M=D-u);const f=p.yMax-p.yMin,O=f*c;let g=!1;c!==0&&(g=O-f),S.updateShapeSize({width:M,height:g,transformOrigin:"bottom-left"});const v=p.xMin-o.xMin,k=v*I;let z=!1;I!==0&&(z=k-v);const X=p.yMin-o.yMin,st=X*c;let vt=!1;c!==0&&(vt=st-X),S.updateShapePosition(z,vt,!0)}),this.updateGlyphPosition(h.deltaX,h.deltaY)}flipNS(t=this.maxes.center.y){for(let n=0;n<this.shapes.length;n++)this.shapes[n].flipNS(t);return this}flipEW(t=this.maxes.center.x){for(let n=0;n<this.shapes.length;n++)this.shapes[n].flipEW(t);return this}roundAll(t=0){return this.shapes.forEach(n=>{n.roundAll&&n.roundAll(t)}),this}rotate(t,n){n=n||this.maxes.center;for(let e=0;e<this.shapes.length;e++)this.shapes[e].rotate(t,n);return this}reverseWinding(){for(let t=0;t<this.shapes.length;t++)this.shapes[t].reverseWinding();return this}get svgPathData(){var t;return(t=this==null?void 0:this.cache)!=null&&t.svgPathData||(this.cache.svgPathData=this.makeSVGPathData(this)),this.cache.svgPathData}makeSVGPathData(){let t="M0,0";return this.shapes.forEach(n=>{if(n.objType==="ComponentInstance"){const e=n.transformedGlyph;e&&(t+=e.svgPathData)}else t+=n.svgPathData,t+=" "}),P0(t)==="M0,0"&&(t="M0,0Z"),t}get maxes(){return this.cache.maxes?Ta(this.cache.maxes)?this.recalculateGlyphMaxes():U0(this.cache.maxes)&&this.recalculateGlyphMaxes():this.recalculateGlyphMaxes(),this.cache.maxes}recalculateGlyphMaxes(){let t={xMax:0,xMin:0,yMax:0,yMin:0};return this.shapes&&this.shapes.length>0&&(t=qn(this.shapes.map(n=>n.maxes))),this.cache.maxes=new Qt(t),this.cache.maxes}};const eE=Object.freeze(Object.defineProperty({__proto__:null,Glyph:ot},Symbol.toStringTag,{value:"Module"}));function Un(r){r!=null&&r.cache&&(r.cache={}),r.recalculateGlyphMaxes();const t=m();r.usedIn=r.usedIn||[],r.usedIn.forEach(n=>{if(n!==r.id){const e=t.getItem(n);e&&(Un(e),e.shapes&&e.shapes.forEach(a=>{a.objType==="ComponentInstance"&&(a.cache={})}))}})}function aE(r){let t=Math.max(r.maxes.height,r.maxes.width),n=r.svgPathData,e='<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ';return e+=`width="${t}" height="${t}" viewBox="0,0,${t},${t}">
`,e+=`	<g transform="translate(100,${t})">
`,e+=`		<path d="${n}"/>
`,e+=`	</g>
</svg>`,e}function $n(r,t,n=!1){const e=d(),a=m();let i=!t;t=t||e.selectedItemID;let o=a.getItem(t,!0);if(nA(o,r)){let A=a.getItem(r,!0),x=`Instance of ${A.name}`,E=new Yr({link:r,name:x});return o.addOneShape(E),Un(o),i&&(e.multiSelect.shapes.select(E),e.publish("whatShapeIsSelected",e.multiSelect.shapes.singleton())),Le(A,t),n&&(o.advanceWidth=A.advanceWidth),!0}else return U("A circular link was found, components can't include links to themselves."),!1}function Sn(r){let t=new ot(r);t.id="glyph-with-resolved-links",t.name="Glyph with resolved links",t.shapes=[];let n=[];return r.shapes.forEach(e=>{if(e.objType==="Path")n.push(new Xt(e));else if(e.objType==="ComponentInstance"){const a=e.transformedGlyph;if(a&&a.shapes){const i=Sn(a);n=n.concat(i.shapes)}}}),n.forEach(e=>t.addOneShape(e)),t.parent=m(),t}function nA(r,t){if(r.id===t)return!1;if(!r.usedIn||r.usedIn.length===0)return!0;let n=eA(r,[],!0);n=n.filter(function(a,i){return n.indexOf(a)===i});let e=aA(r,[]);return e=e.filter(function(a,i){return e.indexOf(a)===i}),!(n.indexOf(t)>-1||e.indexOf(t)>-1)}function eA(r,t=[],n=!1){return r.shapes.forEach(e=>{if(e.objType==="ComponentInstance"){const a=m().getItem(e.link);t=t.concat(eA(a,t)),n||t.push(e.link)}}),t}function aA(r,t=[]){return r.usedIn.forEach(n=>{const e=m().getItem(n);t=t.concat(aA(e,t)),t.push(n)}),t}function iE(r){if(r.objType==="KernGroup")return;let t;const n=m();for(let e=0;e<r.usedIn.length;e++){t=n.getItem(r.usedIn[e]);for(let a=0;a<t.shapes.length;a++)t.shapes[a].objType==="ComponentInstance"&&t.shapes[a].link===r.id&&(t.shapes.splice(a,1),a--)}for(let e=0;e<r.shapes.length;e++)r.shapes[e].objType==="ComponentInstance"&&pa(n.getItem(r.shapes[e].link),r.id)}function oE(r){let t=[],n;return r.usedIn.length&&r.usedIn.filter(or).forEach(e=>{n=m().getItem(e),n.shapes.forEach(a=>{a.link&&a.link===r.id&&t.push(a)})}),t}function Le(r,t){r.id!==t&&(r.usedIn.push(""+t),r.usedIn.sort())}function pa(r,t){const n=r.usedIn.indexOf(""+t);n!==-1&&r.usedIn.splice(n,1)}function te(r=[]){let t=0;const n=m();return r.forEach(e=>{let a=n.getItem(`glyph-${e}`);a&&a.advanceWidth&&(t=Math.max(t,a.advanceWidth))}),t}function AE(r){const t=m();let n=te(r.leftGroup)||t.defaultAdvanceWidth,e=te(r.rightGroup)||t.defaultAdvanceWidth;return n-r.value+e}class Y0{constructor(t={}){this.objType="Guide",this.angle=t.angle===0?0:90,this.name=t.name,this.location=isNaN(parseInt(t.location))?200:parseInt(t.location),this.color=t.color||Ci,this.visible=!!t.visible}save(){let t={},n=this.name;return n!=="Horizontal guide"&&n!=="Vertical guide"&&n!=="Guide"&&(t.name=this.name),this.angle!==90&&(t.angle=this.angle),this.location!==200&&(t.location=this.location),this.color!==Ci&&(t.color=this.color),this.visible||(t.visible=this.visible),t}get name(){return this._name||(this.angle===90?this._name="Horizontal guide":this.angle===0?this._name="Vertical guide":this._name="Guide"),this._name}set name(t=!1){t||(this.angle===90?t="Horizontal guide":this.angle===0?t="Vertical guide":t="Guide"),this._name=t}}const Ci="rgb(127, 0, 255)",x0="rgb(227, 190, 171)",E0="rgb(212, 154, 125)",_n="rgb(191, 106, 64)";class Hr{constructor(t={}){this.text=t.text||"",this.fontSize=t.fontSize||48,this.lineGap=t.lineGap||12,this.pagePadding=t.pagePadding||10,this.pageWidth=t.pageWidth||"fit",this.pageHeight=t.pageHeight||"auto",this.showCharacterExtras=t.showCharacterExtras||!1,this.showLineExtras=t.showLineExtras||!1,this.showPageExtras=t.showPageExtras||!1,this.widthAdjustment=t.widthAdjustment||0}get text(){let t=this._text;return t.substring(0,2)==="{{"&&(t=t.substring(2,t.length-2),Mt[t])?Mt[t]:this._text}set text(t=""){this._text=t}get displayName(){let t="";return t+=`${this.text.substring(0,40)}...`,t}save(){let t={};return this.fontSize&&this.fontSize!==48&&(t.fontSize=this.fontSize),this.lineGap&&this.lineGap!==12&&(t.lineGap=this.lineGap),this.pagePadding&&this.pagePadding!==10&&(t.pagePadding=this.pagePadding),this.pageWidth&&this.pageWidth!=="fit"&&(t.pageWidth=this.pageWidth),this.pageHeight&&this.pageHeight!=="auto"&&(t.pageHeight=this.pageHeight),this.showCharacterExtras&&(t.showCharacterExtras=this.showCharacterExtras),this.showLineExtras&&(t.showLineExtras=this.showLineExtras),this.showPageExtras&&(t.showPageExtras=this.showPageExtras),this._text&&(t.text=this._text),this.text===Mt.swadesh_207_short&&(t.text="{{swadesh_207_short}}"),this.text===Mt.swadesh_207_frequent&&(t.text="{{swadesh_207_frequent}}"),this.text===Mt.scowl_10_short&&(t.text="{{scowl_10_short}}"),this.text===Mt.scowl_10_frequent&&(t.text="{{scowl_10_frequent}}"),this.text===Mt.scowl_50_short&&(t.text="{{scowl_50_short}}"),this.text===Mt.scowl_50_frequent&&(t.text="{{scowl_50_frequent}}"),this.text===Mt.scowl_70_short&&(t.text="{{scowl_70_short}}"),this.text===Mt.scowl_70_frequent&&(t.text="{{scowl_70_frequent}}"),t}}let Mt={};Mt.swadesh_207_short="I you they we you they this that here there who what where when how not all many some few other one two three four five big long wide thick heavy small short narrow thin woman man child wife husband mother father animal fish bird dog louse snake worm tree forest stick fruit seed leaf root bark flower grass rope skin meat blood bone fat egg horn tail feather hair head ear eye nose mouth tooth tongue fingernail foot leg knee hand wing belly guts neck back breast heart liver drink eat bite suck spit vomit blow breathe laugh see hear know think smell fear sleep live die kill fight hunt hit cut split stab scratch dig swim fly walk come lie sit stand turn fall give hold squeeze rub wash wipe pull push throw tie sew count say sing play float flow freeze swell sun moon star water rain river lake sea salt stone sand dust earth cloud fog sky wind snow ice smoke fire ash burn road mountain red green yellow white black night day year warm cold full new old good bad rotten dirty straight round sharp dull smooth wet dry correct near far right left at in with and if because name";Mt.swadesh_207_frequent="stab black head leaf fingernail snake animal name husband narrow breast feather because heavy play bird blood bone breathe burn ice scratch thick cloud correct cut day wide dirty dog drink dust seed squeeze left egg yellow rotten sleep forest wet few they father flower freeze full straight give good grass tongue sharp short three die wife wipe this fruit liver skin knee sky laugh child walk salt belly smell vomit mountain stone nose many float smoke hold woman smooth rope mother spit split pull bark worm dry sing some suck swell stick guts turn two rub four mouth water where you";Mt.scowl_10_short="able act add leaf age ahead aid major make all am an chaos gap are as at cause gave law tax day lazy bad rubber be bid object able submit box brand jobs doubt bug obvious by can occur ice char city back club code acquire cry cs act cup cycle day feedback broadcast add code edge did adjust badly admit midnight do dry adds due advice hardware body eat debate neck bed see left leg behalf being reject seek cell deem end video deep equal err hes bet queue even few sex eye fan fed off fit fly for fry left fun modify gap age meaningful bigger high girl glad sign go grew bugs length gun apology had forthcoming withdraw he hid highly algorithm technical hot three months eight huge worthwhile why via library ice aid die if big like ill aim in prior chip unique air is it medium five fix size object job jump package key background kid quickly knew asks awkward lucky law album welcome old led half algorithm lie bulk all film log help already also felt blue solve always fly mad dumb me harmful mix firmly common autumn mod dump aims much my name inch and net info hang unhappy nice enjoy bank only government annoy no input unreasonable runs cent numb invent unwanted any boat job lock mod doe of dog oh oil project book old come on too pop or cost got our love how box boy dozen pay update pen helpful graph pi plan equipment pop apple press chips kept put upwards copy quit ran nearby force card re perfect argue perhaps rid dark girl arm turn row sharp err bars art run serve forward cry sad husband disc see satisfy she sit ask slip small so spot square less best sum answer busy tax catch ate doubtful the tie title treatment to output try its putt tune two city equal club luck judge due stuff bug quit bulk sum fun quote up our us but buy van even via vote heavy war we awful who win awkward slowly own two write laws growth exact except boxes exist expand next maybe cycle eye dying style symbol syntax you type buys byte anyway bizarre size";Mt.scowl_10_frequent="establishment accidentally administration afterwards disadvantage ahead straightforward majority mistaking alternatively fundamentally misunderstanding chaos applications broadcasting automatically available withdraw maximum displaying crazy embarrassing rubbish deliberately responsibility objections submitting borrowing observation doubtful contributions obviously thereby communications circumstances characters background conclusion acquiring descriptions electronics introduction consistency recommendation feedback additional knowledge adjust admittedly midnight documentation addressing misunderstands undergraduates hardware everybody disappearing somebody sophisticated guaranteeing definitions registering comprehensive rejecting seeking announcement simultaneously representation consequences interpretation queue nevertheless elsewhere experiencing keyboard facilities professional difficulties significantly reflecting frequently justifying investigate arrangements meaningful suggestions discouraging accordingly algorithms buildings strength terminology beforehand forthcoming thoroughly techniques authorities throughout months hundreds worthwhile philosophy appreciating opportunities likewise mediums fixing bizarre justification packages brackets quickly networks awkward lucky calculations album considerable yourself talking almost development helpful already individuals absolutely themselves always combinations harmful harmless autumn demonstration comparatively mysterious unfortunately unhappy enjoy thinking certainly environment unnecessarily unpleasant unreasonable continuously conventional unwanted anonymous misunderstood whatsoever programmers oh pointless projects looking controlling possibilities potentially improvements boxes destroying dozens updating developing upsetting manipulation upwards occupying disturbing performance perhaps particularly information instruction intervention unnecessary husband successfully asking criticism square answering symbols switching atmosphere output publication excluding sufficiently requirements corrupting buying individually avoiding heavy awful widespread unknown rewrite borrows growth examined exceptions executing complexity extending cycles destroyed style syntax everyone anyplace everything everywhere citizen";Mt.scowl_50_short="salaam abed acme gad aery aft jag bah fain rajah hake alb lam ankh baobab apps aqua agar asp tat auk aver awl axon dray laze bah bobby webcam abductee abed clubfeet subgroups subhead bier abjure lambkin bleep submerse hobnail bola subplot brr albs bobtail bur obverse bobwhite bobby cads cocci apace achoo cis beck clew acme picnicker coda acquirable craw docs bract cud chancy czarina coda oddball redcap adder deb gadfly cadge dhoti ding adjure bodkin addle adman gladness doc midpoint dram ids hardtop duh adverted dweeb dyer adze lea deb beck zed jeep fief aegis meh lei deejay pekoe ell emo wen oleo hep coequal ere espy eta euro bevy clew hex fey wheezy fa halfback serfdom fey doff afghan wolfhound fie flan hafnium fob halfpence frack coifs aft futz daffy gad bugbear dogcatcher hangdog loge dogfish boggy aught gird glop magma cosign agog grog ergs dogtrot ague wigwag gyro haw highboy ashcans archduke hep mirthful flashgun fishhook hie babushka phlox bathmat techno hob dishpan thru ankhs aught hula schwa ashy iamb jib mica ids fie coif brig jihad piing demijohn wiki mil sim ding viol pip cliquish dirk cis clit odium diva antiwar nix sukiyaki baize jag jeep jib josh julep kale backbit crankcase workday hake sackful ginkgo ankh kith lockjaw yukked anklet milkmaid knave kook chickpea krone auks buckteeth haiku inkwell balky la alb milch veld lea milf bilge bullhorn clit killjoy bilk ell palmy ulna lo pulpy catafalque bulrush awls dolt alum salvo bulwark lynx maw iamb gimcrack slumdog meh brimful farmhand mid mkay armlet jimmy limn emo ump kumquat armrest ems emu triumvirate dimwit gamy nary inbox conch wend pone confab bong inhere nib ninja ankh wanly enmesh jinn noel unpin jonquil unripe duns nth nu convoke unwed lynx onyx benzene roan fob doc hod aloe oft agog oho poi emoji gook pol tom yon coon fop toque orb hos sot lout coven cowl lox soy boozy paps soapbox topcoat stepdad jape campfire popgun aphid pip bumpkin plait stepmom grapnel poi apps prig apps inapt pug pwn pyx aqua brad orb orc gird ere serf erg rho brig marjoram dirk purl berm lorn euro carpi marquis brr burs arty drub nervy airway aery furze mesa busby scat misdo apse misfire disgorge ashy sim disjointedly rusk slaw ism snaky sol asp squab disrobe buss sty suet svelte swag hussy eta catbird butch cote outfox outgo nth ti catkin fitly litmus botnet tom potpie tram lats attar tun outvote twain sty futz aqua nub deuce cud ague mufti pug duh quid jujube auk hula ump dun quoit yup bur buss abut muumuu uvula bauxite obloquy abuzz diva aver vim vole chevron ovule divvy bevy swag cowbird howdah wen lawfully gewgaw whey wiki hawker awl bowman pwn wooer cowpox wrack haws newtons wuss dewy frowzy fixate oxbow coxcomb fixer oxford foxglove foxhound axial laxly laxness axon sexpot coxswain sextet nexus boxwood epoxy yaw flyby lyceum hydra ye mayfly cygnet tallyho yip skyjack beryl hymen lynx yon hypo gyro cloys mythic yuk byword pyx piazza zed zing buzzkill drizzly hazmat kazoo gazpacho kudzu zwieback boozy";Mt.scowl_50_frequent="salaaming imperturbability ultraconservatives disadvantageously aerodynamically afforestation tetrahedrons praiseworthiness majorettes groundbreakings electroencephalograms contemporaneously chaotically electroencephalographs aquaculture counterrevolutionaries overenthusiastic interrelationships authoritativeness circumnavigations straightaways axiomatically companionways nonhazardous flibbertigibbets subcontracting molybdenum disencumbering obfuscating subgroups subheadings comprehensibility unobjectionable lambkins bloodthirstiness submersibles abnegating chlorofluorocarbons subprograms transubstantiation obtrusiveness bureaucratically obviousness dumbwaiters labyrinthine electrocardiographs unacceptability lackadaisically counterclaiming acmes picnickers acquisitiveness aristocratically electrodynamics cryptocurrency czarinas daguerreotyping rebroadcasting featherbedding inconsiderateness crowdfunding foreknowledge hardheadedness maladjustment bodkins disconnectedly administratively lightheartedness ambassadorships sandpipers hydroelectricity fountainheads superconductivity hundredweights kudzus rebelliousness electioneering prefabrication gregariousness reinterpretations steeplejacks inconsequentially electromagnetism neurotransmitters exemplifications monkeyshines intermezzos multifariousness beefburger serfdom paraprofessionals afghans halfheartedness aloofness disinformation halfpennies disenfranchisement weatherproofs antiaircraft unfaithfulness misidentifying herringbone dogcatchers hangdog counterintelligence wrongfulness microaggressions bacteriological uncompromisingly phlegmatically nongovernmental dogtrotting wigwagging parapsychology archbishoprics beachcombers archdeacons thoroughgoing bathhouses babushkas arithmetically biotechnology catchphrase philanthropically mouthwatering inconspicuousness annihilators shanghaiing demijohns sportsmanlike deliquescent conversationalists triumvirates contrariwise transfixing sukiyaki prizefighters jitterbugging photojournalists jurisdictional blackballing blackcurrant backdating cantankerousness thankfulness blackguards blockhouses lockjaw yukking huckleberries brinkmanship kookaburras backpedals bankrolling backstretches blackthorns skulduggery anticlockwise buckyballs spellbinders spellcheckers officeholders overindulgence levelheadedness killjoys streetwalkers schoolmistresses invulnerability palpitations milquetoasts chivalrously galvanometers councilwoman discombobulating gimcracks humdingers interdepartmental circumflexes warmhearted interdenominational mkay circumlocutions telecommunication anthropomorphism kumquats armrests bantamweights mysteriousness boysenberries teleconferencing circumnavigating unhesitatingly conjunctivitis dimensionless environmentalism interconnections unpredictability inquisitiveness nonrepresentational counterrevolutions discontinuances overanxious mulligatawny extravaganzas prohibitionists boisterousness psychokinesis grandiloquence atmospherically incontrovertible flamethrowers detoxification spermatozoon shipbuilders slipcovers snapdragons sheepfolds popguns slipknots developmental pneumatically apprehensiveness circumscriptions unscrupulousness sleepwalkers aromatherapy noninterference hypoallergenic porterhouses crackerjacks telemarketing disorderliness predetermination overqualified incorruptibility counterweights counterrevolutionary overzealous crossbreeding conscientiousness disfranchisement thanksgivings disjointedly muskellunges unreasonableness misquotations disreputably transversely swashbucklers syllabification carpetbaggers boastfulness remortgaging catkins shuttlecocking forthrightness breastplates agriculturalists outvoting trustworthiness chintziest longitudinally genuflections lugubriousness brouhahas jujitsu interleukin muumuus antediluvian luxuriousness colloquy puzzlement chevrons skivvying waterboardings shadowboxing weatherproofing viewfinders lawgivers horsewhipping nighthawks sawmills clownishness cowpunchers wrongheadedness newspaperwoman swallowtails knockwursts billowy frowziest counterexamples oxbows unexceptionable oxfords foxgloves inexhaustibly sexless laxness exorbitantly expostulations coxswains extemporaneously waxwings oxyacetylene cyberbullies underemployed ladyfingers lollygagging policyholders skyjackers asymmetrically embryologists cryptocurrencies tyrannosauruses crystallographic electrolytes polyunsaturated pennyweights asphyxia quizzically buzzkills bedazzling hazmat gazpacho mazurkas zwieback lazybones";Mt.scowl_70_short="aah ab ac ad ae aft aga ah ai haj aka al am an ciao ape aqua ar as at aud av aw ax aye azo aba abb bobcat bd be bf pibgorn abhor bi obj bk bl abmho cobnut boa bp br abs btl bu abvolt lbw bx by subzero ca ecbolic cc cd ace cf cg ch cig ck cl cm acne co cp acquit cr cs ct cu cw cyl czar dab db dc dd de gadfly dg edh di adj dk bdl dm ordn do dpi hdqrs dr ads obdt dub adv dwt dye dz ea deb dec ed bee def beg eh lei eject eek el em en eon dep eq er es et feu eve dew ex bey fez fa offbeat offcuts mfd fec ff mfg offhand fib fjeld offkey fl fm hafnium fo fp fr ifs ft fug fwd defy rugby agcy gds age bagful egg ugh gi logjam gl gm gnu go magpie gr gs gt gum dogvane hgwy gym zigzag ha cashbox ahchoo hd he hf hg hhd hi kishke hl chm john ho hp earthquake hr chs ht hub boschvark hwy hyp machzor ria ib hic id die if big ihram aalii bijou oik ail aim in bio dip liq air is it ilium civ iwis fix hiya biz ja jct jet jg jib hajj prajna jo jr adjt jug ka kb kc jackdaw eke nakfa kg ankh ki lockjaw dekko kl km kn koa kph kr ks kt haku kvass kw sky la lb talc eld ale elf lg pelham li killjoy alk ll lm ln lo alp calque dlr ls alt flu lv lwei lx fly colza ma mb emcee mdse me mf mg mho mi ramjet mk ml mm damn mo mp kumquat amrita ms mt mu duumvir dimwit my hamza ana inbox enc and ne inf eng sinh nib conj ink enl unman ann no tnpk cinque nr ans ant nu inv unwed jinx any bonze ob doc od doe of bog oh oi mojo oka col om on oo op loq or os bot fou gov ow ox boy oz pa peepbo pc pd pe pf pg pi kopje pk pl pm apnea pod pp pr ps pt pub pvt pwn pya pzazz qadi sheqel qi ql qoph sqq qr qt qu qwerty bra arb arc rd re barf erg rho interj ark birl rm urn bro rpm cirque arr rs rt cru arvo crwth cry orzo sac sb sc sd sea sf sgd sh si masjid ask isl ism assn so sp sq sri ss st sub svelte swab sym grosz ta tb etc gtd ate artful mtg fth ti muntjac latke atm tn to hatpin cotquean tr ts att tub outvote two qty ditz qua bub buck cue buff aug uh oui juju auk bul um bun duo up tuque bur us ut lituus guv thruway aux buy buzz ova vb avdp ave avg vhf via vlf avn vo livre vs ovum vv ivy evzone wad bawbee bawcock wd we awful gewgaw whf wig blowjob wk awl cwm awn wo twp wry bows wt swum bowwow fwy blowzy coxa oxbow exc flexdollars axed boxful foxglove exhale xi axle taxman laxness axon exp exquisite exr bxs ext xu paxwax boxy ya flyby syce yd ye dayfly tyg anyhow yid skyjack dyke syn yo gyp yr mys byte yuk gyve ywis pyx sayyid coryza zap whizzbang vizcacha samizdat zed fizgig muzhik zig britzka zloty gizmo kibbutznik chutzpah buzzsaw azure mitzvah buzzword cozy";Mt.scowl_70_frequent="aardwolves honorificabilitudinitatibus psychopharmacologies contradistinctively aerothermodynamics tetrafluoroethylene supercalifragilisticexpialidocious tetrahydrocannabinol photoreconnaissance majoritarianism groundbreakings pneumonoultramicroscopicsilicovolcanoconiosis extraordinarily electroencephalographic anthraquinone antidisestablishmentarianisms overenthusiastically floccinaucinihilipilification circumnavigations unseaworthiness chemoprophylaxis companionways succinylsulfathiazole bacteriologically flabbergasting subclassification subdirectories overbearingnesses dumbfounding subglacial abhorrently objectionableness knobkerries subminiaturize subnormalities bourgeoisification subprofessionals tribromoethanols insubstantialities unobtrusiveness subventionary cobwebbiest bxs presbyterianism subzero ecbolic synecdochically cf cg dichlorodiphenyltrichloroethane buckminsterfullerene chlortetracyclines blancmanges chromaticness ecphonesis acquaintanceship colicweed czarevitch hippopotomonstrosesquipedalian rebroadcasting featherbedding departmentalization grandfathering curmudgeonliness goodheartedness adjudications handkerchiefs otherworldlinesses maladministration straightforwardness childproofing headquartering magnetohydrodynamics straightforwards bloodthirstiness individualistically disadvantageously hundredweights dziggetais chickenheartedness thrombophlebitides feeblemindednesses indefatigabilities photodisintegration incomprehensibility deinstitutionalization nonprejudicial triskaidekaphobias contemporaneousnesses inconsequentiality counterrevolutionaries praiseworthiness attorneyships piezoelectricities surfboardings unselfconsciousness chiefdom counteroffensives roofgarden halfheartedness fjords offkey engulfment aloofness halfpennyworth softheartednesses halfwitted interstratifying hummingbirds dogcatchers subkingdoms counterinsurgencies meaningfulness microaggressions logjams glomerulonephritides segmentalization otorhinolaryngologists stringpiece misunderstandings superstrength contradistinguished dogvane songwriters otorhinolaryngology zigzagging archbishoprics archconservative archdeaconries reproachfulness thoroughgoing highhandedness babushkas biotechnological thoroughpaced earthquakes pseudohermaphroditism electroencephalographs boschvark northwestwardly electroencephalography machzor triiodomethane bijouterie unsportsmanlike impressionistically hemidemisemiquavers microsporangium uncommunicativenesses contrariwise interlocutrix semiyearly compartmentalization straitjacketing jct jg jitterbugging hajjes prajna photojournalists jr adjt injudiciousness lackadaisicalness stockbrokerage blackcurrants backdating breakfasting backgrounders backhandedness counterattacking stockjobbers bookkeepers kaffeeklatsches acknowledgments cuckooflowers backpedaling bankruptcies backscratchers breakthroughs skulduggery kvetchers counterclockwise ankylostomiasis albuminurias tetramethyldiarsine algorithmically diphenylhydantoins killjoys phenylketonuria diacetylmorphine caesalpiniaceous unnilquadiums hexylresorcinol convolvulaceous pickerelweeds calxes calzone somnambulistically uncircumcision humdingers uncomfortableness circumgyration warmheartedness circumjacent gymkhanas circumlocutions kumquats steamrollering circumterrestrial multidimensionality circumvallating bantamweights dihydrostreptomycin hamza nonbelligerents undemonstrativeness videoconferencing environmentalists unpretentiousnesses inquisitiveness nonrepresentational deoxyribonuclease conversationalists unwholesomeness nasopharynxes dinitrobenzene unapproachabilities autobiographically chlorofluorocarbons brokenheartedly grandiloquently underemployment photozincography clapboarding stepchildren stepdaughters leapfrogging campgrounds flapjacks pumpkinseeds oversimplifications developmentally disproportionateness disputatiousness impv shipwrecking endocrinotherapy pzazz sheqalim sheqel qindarkas ql qophs seqq hdqrs qto qwerty electrocardiographic interjectionally disembarkation preternaturalness anthropomorphically overqualified electrodynamometers ultraconservatives bilharziases jurisdictional unsatisfactoriness disgracefulness disjointedness contemporaneously misrepresentations transvestitisms upperclasswoman groszy heartbreakingly postconvalescent outdistancing roentgenotherapy pocketknives indiscreetnesses bulletproofing cotquean glottochronologies bodhisattva untrustworthiness quartziferous intellectualization insufficiently superdreadnought kieselguhrs hallelujahs lukewarmness dichlorodifluoromethane chautauqua duumvirate chauvinistically rauwolfias juxtapositional ventriloquy muzzleloading vb avdp incontrovertibilities avg vhf pavlovas czarevna vraisemblance leitmotivs advt improvvisatore heavyweights evzone shadowboxings cowcatchers bowdlerizations weatherboardings sorrowfulness shadowgraphs wholeheartedness showjumping sparrowhawks snowmobiling downheartedness cowpunchers wrongheadedness newspaperwoman yellowthroats knockwursts hollowwares lawyerly frowziness hexamethylenetetramine boxberries excommunications sexdecillion exemplifications exfoliating foxgloves exhibitionistically lexicographically orthodoxly fluxmeter complexnesses inexorabilities exquisiteness boxrooms exsanguinate extemporaneousness heterosexuality maxwells cyanocobalamins cybernetician encephalomyelitis gillyflowers acanthopterygians platyhelminths skyjackings pyknic polymorphonuclear electromyographies hyperparathyroidism psychophysiological demythologizations polyunsaturated polyvalence archaeopteryxes sayyid psychoanalyzing whizzbangs mezcaline samizdat anthropomorphized wayzgoose muzhiks anthropomorphizing blitzkriegs bamboozlement quizmasters kibbutzniks chutzpah buzzsaw gazumping rendezvousing buzzwords zygophyllaceous";class l0{constructor(t={}){this.textBlocks=[],this.lineBreakers=t.lineBreakers||[" "," "," "],this.data=[],this.pixelHeight=0,this.canvasMaxes=t.canvasMaxes,this.ctx=t.ctx,this.project=t.project||m(),this.options=new Hr(t.options),this.hasDrawableCharacters=!1,this.drawPageExtras=t.drawPageExtras||!1,this.drawLineExtras=t.drawLineExtras||!1,this.drawCharacterExtras=t.drawCharacterExtras||!1,this.drawCharacter=t.drawCharacter||!1,this.roundUp=t.roundUp||!1,this.generateData()}get canvasMaxes(){return this._canvasMaxes}set canvasMaxes(t={}){this._canvasMaxes=new Qt({xMin:t.xMin||0,xMax:t.xMax||1/0,yMin:t.yMin||0,yMax:t.yMax||1/0})}draw({showPageExtras:t=!1,showLineExtras:n=!1,showCharacterExtras:e=!1,showCharacter:a=!1}={}){if(this.drawPageExtras&&t&&this.drawPageExtras(this.ctx,this),this.options.text==="")return;let i=-1;this.drawLineExtras&&n&&this.iterator(o=>{o.lineNumber!==i&&(this.drawLineExtras(this.ctx,o,this),i=o.lineNumber)}),this.drawCharacterExtras&&e&&this.iterator(o=>{this.drawCharacterExtras(this.ctx,o,this.roundUp)}),this.drawCharacter&&a&&this.iterator(o=>{this.drawCharacter(this.ctx,o)})}iterator(t){for(let n=0;n<this.data.length;n++)for(let e=0;e<this.data[n].length;e++)t(this.data[n][e],this)}drawCanvasMaxes(t){t.fillStyle="transparent",t.strokeStyle="lime",t.lineWidth=1,t.strokeRect(this.canvasMaxes.xMin,this.canvasMaxes.yMin,this.canvasMaxes.width,this.canvasMaxes.height)}generateData(){var D;let t,n,e,a,i=0,o,A,x;for(this.data=[],this.textBlocks=this.options.text.split(`
`),e=0;e<this.textBlocks.length;e++)for(t=iA(this.textBlocks[e].split(""),this.project),this.data[e]=[],a=0;a<t.length;a++)n=t[a],n.startsWith("liga-")?(x=this.project.ligatures[n],n=x.chars):x=this.project.getItem(`glyph-${Or(n)}`),(D=x==null?void 0:x.shapes)!=null&&D.length&&(this.hasDrawableCharacters=!0),o=x?x.advanceWidth:this.project.defaultAdvanceWidth,A=vr(n,t[a+1]),i+=o+A,this.data[e][a]={char:n,item:x,view:!1,widths:{advance:o,kern:A,aggregate:i},isLineBreaker:this.lineBreakers.indexOf(n)>-1,isVisible:!1,lineNumber:!1};let E,l,T,s=0,c=0,I=0,h=!1;const S=this.options.fontSize/this.project.totalVertical,p=this.project.settings.font.ascent,u={lineHeight:this.project.totalVertical+this.options.lineGap/S,width:this.canvasMaxes.width/S,yMax:this.canvasMaxes.yMax/S,yMin:this.canvasMaxes.yMin/S,xMin:this.canvasMaxes.xMin/S};for(this.options.pageHeight==="auto"&&(u.yMax=Number.Infinity),c=u.xMin,I=u.yMin+p,e=0;e<this.data.length;e++){for(t=this.data[e],a=0;a<t.length;a++){if(E=t[a],E.view===!1){if(h&&Number.isFinite(u.width)){if(l=xE(t,a),T=l.widths.aggregate+l.widths.advance-E.widths.aggregate,c+T>u.width){if(s++,I+u.lineHeight>u.yMax)return;c=u.xMin,I=u.yMin+p+s*u.lineHeight}h=!1}E.isVisible=!0,E.lineNumber=s,E.view={dx:c*S,dy:I*S,dz:S},c+=E.widths.advance+E.widths.kern}E.isLineBreaker&&(h=!0)}if(s++,I+u.lineHeight>u.yMax)return;c=u.xMin,I=u.yMin+p+s*u.lineHeight,this.pixelHeight=s*u.lineHeight*S}}}function xE(r,t){for(let e=t;e<r.length;e++)if(r[e].isLineBreaker)return r[e];return r[r.length-1]}function vr(r,t){if(!r||!t)return 0;r=zr(r).join(""),t=zr(t).join("");let n=m().kerning,e,a,i;for(let o of Object.keys(n))for(let A=0;A<n[o].leftGroup.length;A++)if(e=n[o].leftGroup[A],zr(e)[0]===r){for(let x=0;x<n[o].rightGroup.length;x++)if(a=n[o].rightGroup[x],zr(a)[0]===t)return i=n[o].value*-1,i}return 0}function iA(r,t){t=t||m();const n=t.sortedLigatures;let e,a;for(let i=0;i<r.length;i++)for(let o=0;o<n.length;o++)e=n[o].chars,a=r.slice(i,i+e.length).join(""),a===e&&r.splice(i,e.length,n[o].id);return r}function EE(r){let t=[],n=(r==null?void 0:r.attributes)||{},e=Number(n.r)||Number(n.rx)||100;e=Math.abs(e);let a=Number(n.r)||Number(n.ry)||100;a=Math.abs(a);let i=Number(n.cx)||0,o=Number(n.cy)||0;if(!(e===0&&a===0)){let A={xMin:i-e,xMax:i+e,yMin:o-a,yMax:o+a};t=lE(A)}return[t]}function lE(r){let t=r.xMin,n=r.yMax,e=r.xMax,a=r.yMin,i=(e-t)/2,o=(n-a)/2,A=i*.448,x=o*.448,E={x:t+i,y:n},l={x:t+A,y:n},T={x:e-A,y:n},s={x:e,y:a+o},c={x:e,y:n-x},I={x:e,y:a+x},h={x:t+i,y:a},S={x:e-A,y:a},p={x:t+A,y:a},u={x:t,y:a+o},D={x:t,y:a+x},M={x:t,y:n-x};return[[E,T,c,s],[s,I,S,h],[h,p,D,u],[u,M,l,E]]}function sE(r){var a;let t=[],n=(a=r==null?void 0:r.attributes)==null?void 0:a.points;n=lA(n);let e=s0(n);if(e.length>4){let i=Number(e[0]),o=Number(e[1]);for(let A=0;A<e.length;A+=2){let x=Number(e[A])||0,E=Number(e[A+1])||0;t.push([{x:i,y:o},!1,!1,{x,y:E}]),i=x,o=E}}return[t]}function oA(r,t,n,e,a,i,o,A,x,E){let l={x:r,y:t},T={x:A,y:x};if(r===A&&t===x||!n||!e)return[l.x,l.y,T.x,T.y,T.x,T.y];let s=LE(a);i=!!i,o=!!o;let c={},I,h;if(E)I=E[0],h=E[1],c={x:E[2],y:E[3]};else{l=Fe(l,s*-1),T=Fe(T,s*-1);let z=(l.x-T.x)/2,X=(l.y-T.y)/2,st=X*X,vt=z*z,gt=vt/(n*n)+st/(e*e);gt>1&&(gt=Math.sqrt(gt),n*=gt,e*=gt);let et=n*n,yt=e*e,It=i===o?-1:1;It*=Math.sqrt(Math.abs((et*yt-et*st-yt*vt)/(et*st+yt*vt))),c.x=It*n*X/e+(l.x+T.x)/2,c.y=It*-1*e*z/n+(l.y+T.y)/2,I=Math.asin((l.y-c.y)/e),h=Math.asin((T.y-c.y)/e),I=l.x<c.x?Math.PI-I:I,h=T.x<c.x?Math.PI-h:h;let Ct=Math.PI*2;I<0&&(I=Ct+I),h<0&&(h=Ct+h),o&&I>h&&(I=I-Ct),!o&&h>I&&(h=h-Ct)}let S=h-I,p=[],u=Math.PI*120/180;if(Math.abs(S)>u){let z=h,X=T.x,st=T.y;h=I+u*(o&&h>I?1:-1),T.x=c.x+n*Math.cos(h),T.y=c.y+e*Math.sin(h),p=oA(T.x,T.y,n,e,a,0,o,X,st,[h,z,c.x,c.y])}let D={x:Math.cos(I),y:Math.sin(I)},M={x:Math.cos(h),y:Math.sin(h)};S=h-I;let f=Math.tan(S/4)*4/3,O={x:l.x,y:l.y},g={x:l.x+n*f*D.y,y:l.y-e*f*D.x};g.x=2*O.x-g.x,g.y=2*O.y-g.y;let v={x:T.x+n*f*M.y,y:T.y-e*f*M.x},k={x:T.x,y:T.y};if(p=[g.x,g.y,v.x,v.y,k.x,k.y].concat(p),E)return p;{let z=[];for(let X=0;X<p.length;X++)X%2?z[X]=Fe({x:p[X-1],y:p[X]},s).y:z[X]=Fe({x:p[X],y:p[X+1]},s).x;return z}}function LE(r){return r*(Math.PI/180)}function Fe(r,t,n){if(!r)return;if(t===0)return r;n=n||{},n.x=n.x||0,n.y=n.y||0,r.x-=n.x,r.y-=n.y;let e=r.x*Math.cos(t)-r.y*Math.sin(t),a=r.x*Math.sin(t)+r.y*Math.cos(t);return r.x=e+n.x,r.y=a+n.y,r}function TE(r={}){const t=r.attributes.d||"";if(t.length===0||t.length===1)return[];let n=IE(t);return n=hE(n),n=dE(n),n=SE(n),n=pE(n),n=CE(n),n=uE(n),cE(n)}function cE(r){let t=[],n=[],e=0,a=0;return r.forEach(i=>{i.type==="M"&&(e=i.parameters[0],a=i.parameters[1]),i.type==="L"&&(n.push([{x:e,y:a},!1,!1,{x:i.parameters[0],y:i.parameters[1]}]),e=i.parameters[0],a=i.parameters[1]),i.type==="C"&&(n.push([{x:e,y:a},{x:i.parameters[0],y:i.parameters[1]},{x:i.parameters[2],y:i.parameters[3]},{x:i.parameters[4],y:i.parameters[5]}]),e=i.parameters[4],a=i.parameters[5]),i.type==="Z"&&(t.push(n),n=[])}),n.length&&t.push(n),t}function IE(r){let t=[],n=!1,e=lA(r);for(let a=0;a<e.length;a++)if(ui(e.charAt(a))){n=a;break}if(n===!1)return[{type:"Z"}];for(let a=n+1;a<e.length;a++)ui(e.charAt(a))&&(t.push({type:e.charAt(n),parameters:s0(e.substring(n+1,a))}),n=a);return n<e.length-1&&t.push({type:e.charAt(n),parameters:s0(e.substring(n+1,e.length))}),t}function hE(r){let t=[],n={},e={x:0,y:0},a={x:0,y:0};return r.forEach(i=>{if(i.type==="m"||i.type==="l"){n={type:i.type==="m"?"M":"L",parameters:[]};for(let o=0;o<i.parameters.length;o+=2)a.x=i.parameters[o+0]+e.x,a.y=i.parameters[o+1]+e.y,n.parameters.push(a.x),n.parameters.push(a.y),e.x=a.x,e.y=a.y;t.push(n)}else if(i.type==="h"){n={type:"H",parameters:[]};for(let o=0;o<i.parameters.length;o++)a.x=i.parameters[o]+e.x,n.parameters.push(a.x),e.x=a.x;t.push(n)}else if(i.type==="v"){n={type:"V",parameters:[]};for(let o=0;o<i.parameters.length;o++)a.y=i.parameters[o]+e.y,n.parameters.push(a.y),e.y=a.y;t.push(n)}else if(i.type==="c"){n={type:"C",parameters:[]};for(let o=0;o<i.parameters.length;o+=6)n.parameters.push(i.parameters[o+0]+e.x),n.parameters.push(i.parameters[o+1]+e.y),n.parameters.push(i.parameters[o+2]+e.x),n.parameters.push(i.parameters[o+3]+e.y),a.x=i.parameters[o+4]+e.x,a.y=i.parameters[o+5]+e.y,n.parameters.push(a.x),n.parameters.push(a.y),e.x=a.x,e.y=a.y;t.push(n)}else if(i.type==="s"){n={type:"S",parameters:[]};for(let o=0;o<i.parameters.length;o+=4)n.parameters.push(i.parameters[o+0]+e.x),n.parameters.push(i.parameters[o+1]+e.y),a.x=i.parameters[o+2]+e.x,a.y=i.parameters[o+3]+e.y,n.parameters.push(a.x),n.parameters.push(a.y),e.x=a.x,e.y=a.y;t.push(n)}else if(i.type==="q"){n={type:"Q",parameters:[]};for(let o=0;o<i.parameters.length;o+=4)n.parameters.push(i.parameters[o+0]+e.x),n.parameters.push(i.parameters[o+1]+e.y),a.x=i.parameters[o+2]+e.x,a.y=i.parameters[o+3]+e.y,n.parameters.push(a.x),n.parameters.push(a.y),e.x=a.x,e.y=a.y;t.push(n)}else if(i.type==="t"){n={type:"T",parameters:[]};for(let o=0;o<i.parameters.length;o+=2)a.x=i.parameters[o+0]+e.x,a.y=i.parameters[o+1]+e.y,n.parameters.push(a.x),n.parameters.push(a.y),e.x=a.x,e.y=a.y;t.push(n)}else if(i.type==="a"){n={type:"A",parameters:[]};for(let o=0;o<i.parameters.length;o+=7)n.parameters.push(i.parameters[o+0]),n.parameters.push(i.parameters[o+1]),n.parameters.push(i.parameters[o+2]),n.parameters.push(i.parameters[o+3]),n.parameters.push(i.parameters[o+4]),a.x=i.parameters[o+5]+e.x,a.y=i.parameters[o+6]+e.y,n.parameters.push(a.x),n.parameters.push(a.y),e.x=a.x,e.y=a.y;t.push(n)}else i.type==="z"?t.push({type:"Z"}):(t.push(i),e=Te(e,i))}),t}function dE(r){let t=[];return r.forEach(n=>{if(n.type)switch(n.type){case"Z":case"z":t.push({type:"Z"});break;case"H":case"V":case"h":case"v":for(let e=0;e<n.parameters.length;e+=2)t.push({type:n.type,parameters:[n.parameters[e]]});break;case"M":for(let e=0;e<n.parameters.length;e+=2)t.push({type:e<2?"M":"L",parameters:[n.parameters[e],n.parameters[e+1]]});break;case"m":for(let e=0;e<n.parameters.length;e+=2)t.push({type:e<2?"m":"l",parameters:[n.parameters[e],n.parameters[e+1]]});break;case"L":case"T":case"l":case"t":for(let e=0;e<n.parameters.length;e+=2)t.push({type:n.type,parameters:[n.parameters[e],n.parameters[e+1]]});break;case"Q":case"S":case"q":case"s":for(let e=0;e<n.parameters.length;e+=4)t.push({type:n.type,parameters:[n.parameters[e],n.parameters[e+1],n.parameters[e+2],n.parameters[e+3]]});break;case"C":case"c":for(let e=0;e<n.parameters.length;e+=6)t.push({type:n.type,parameters:[n.parameters[e],n.parameters[e+1],n.parameters[e+2],n.parameters[e+3],n.parameters[e+4],n.parameters[e+5]]});break;case"A":case"a":for(let e=0;e<n.parameters.length;e+=7)t.push({type:n.type,parameters:[n.parameters[e],n.parameters[e+1],n.parameters[e+2],n.parameters[e+3],n.parameters[e+4],n.parameters[e+5],n.parameters[e+6]]});break}}),t}function SE(r){let t=[],n={x:0,y:0};return r.forEach(e=>{if(e.type==="H")for(let a=0;a<e.parameters.length;a++)t.push({type:"L",parameters:[e.parameters[a],n.y]});else if(e.type==="V")for(let a=0;a<e.parameters.length;a++)t.push({type:"L",parameters:[n.x,e.parameters[a]]});else t.push(e);n=Te(n,e)}),t}function pE(r){let t=[],n={x:0,y:0},e={x:0,y:0},a={x:0,y:0},i;return r.forEach(o=>{o.type==="S"||o.type==="T"?(i=t.length>1?t.at(-1):!1,i&&i.type==="C"?(e.x=i.parameters[2],e.y=i.parameters[3]):i&&i.type==="Q"?(e.x=i.parameters[0],e.y=i.parameters[1]):(e.x=n.x,e.y=n.y),a={x:n.x-e.x+n.x,y:n.y-e.y+n.y},o.type==="S"?t.push({type:"C",parameters:[a.x,a.y,o.parameters[0],o.parameters[1],o.parameters[2],o.parameters[3]]}):o.type==="T"&&t.push({type:"Q",parameters:[a.x,a.y,o.parameters[0],o.parameters[1]]})):t.push(o),n=Te(n,o)}),t}function CE(r){let t=[],n={x:0,y:0},e,a,i,o,A,x,E,l,T,s;return r.forEach(c=>{c.type==="Q"?(e=n.x,a=n.y,i=c.parameters[0],o=c.parameters[1],A=c.parameters[2],x=c.parameters[3],E=e+2/3*(i-e),l=a+2/3*(o-a),T=A+2/3*(i-A),s=x+2/3*(o-x),t.push({type:"C",parameters:[E,l,T,s,A,x]})):t.push(c),n=Te(n,c)}),t}function uE(r){let t=[],n=[],e={x:0,y:0};return r.forEach(a=>{if(a.type==="A")for(let i=0;i<a.parameters.length;i+=7){n=oA(e.x,e.y,a.parameters[i+0],a.parameters[i+1],a.parameters[i+2],a.parameters[i+3],a.parameters[i+4],a.parameters[i+5],a.parameters[i+6],!1);for(let o=0;o<n.length;o+=6)t.push({type:"C",parameters:[n[o+0],n[o+1],n[o+2],n[o+3],n[o+4],n[o+5]]});e={x:n.at(-2),y:n.at(-1)}}else t.push(a),e=Te(e,a)}),t}function Te(r,t){let n={x:r.x||0,y:r.y||0};switch(t.type){case"Z":case"z":break;case"H":n.x=t.parameters.at(-1);break;case"V":n.y=t.parameters.at(-1);break;case"M":case"L":case"C":case"S":case"A":case"Q":case"T":n.x=t.parameters.at(-2),n.y=t.parameters.at(-1);break;case"h":for(let e=0;e<t.parameters.length;e++)n.x+=t.parameters[e];break;case"v":for(let e=0;e<t.parameters.length;e++)n.y+=t.parameters[e];break;case"m":case"l":case"t":for(let e=0;e<t.parameters.length;e+=2)n.x+=t.parameters[e+0],n.y+=t.parameters[e+1];break;case"q":case"s":for(let e=0;e<t.parameters.length;e+=4)n.x+=t.parameters[e+2],n.y+=t.parameters[e+3];break;case"c":for(let e=0;e<t.parameters.length;e+=6)n.x+=t.parameters[e+4],n.y+=t.parameters[e+5];break;case"a":for(let e=0;e<t.parameters.length;e+=7)n.x+=t.parameters[e+5],n.y+=t.parameters[e+6];break}return n}function ui(r){return"MmLlCcSsZzHhVvAaQqTt".indexOf(r)>-1}function RE(r){let t=r.attributes||{},n=Number(t.x)||0,e=Number(t.y)||0,a=Number(t.width)||100,i=Number(t.height)||100,o=n+a,A=e+i,x={x:n,y:e},E={x:o,y:e},l={x:o,y:A},T={x:n,y:A};return[[[x,!1,!1,E],[E,!1,!1,l],[l,!1,!1,T],[T,!1,!1,x]]]}function gE(r){let t,n;if(typeof window.DOMParser<"u")t=new window.DOMParser().parseFromString(r,"text/xml");else if(typeof window.ActiveXObject<"u"&&new window.ActiveXObject("Microsoft.XMLDOM"))t=new window.ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(r);else throw console.warn("No XML document parser found."),n=new SyntaxError("No XML document parser found."),n;if(t.getElementsByTagName("parserError").length){const i=t.getElementsByTagName("div")[0].innerHTML;throw n=new SyntaxError(Xe(i)),n}return{name:t.documentElement.nodeName,attributes:xA(t.documentElement.attributes),content:AA(t.documentElement)}}function AA(r){const t=r.childNodes;if(t.length===0)return Xe(r.nodeValue);const n=[];let e,a,i;for(const o of t)e={},o.nodeName!=="#comment"&&(a=AA(o),i=xA(o.attributes),o.nodeName==="#text"&&JSON.stringify(i)==="{}"?e=Xe(a):(e.name=o.nodeName,e.attributes=i,e.content=a),e!==""&&n.push(e));return n}function xA(r){if(!r||!r.length)return{};const t={};for(const n of r)t[n.name]=Xe(n.value);return t}function Xe(r){try{return r=r.replace(/^\s+|\s+$/g,""),r.replace(/(\r\n|\n|\r|\t)/gm,"")}catch{return""}}function yE(r){let t=gE(r);return EA(t)}function EA(r,t=!1){let n=[],e=!1;return r!=null&&r.content?(r.attributes.transform&&console.warn("Transform data is not supported!"),r.content.forEach(a=>{let i=a.name.toLowerCase();(i==="circle"||i==="ellipse")&&(n=n.concat(EE(a))),(i==="path"||i==="glyph")&&(n=n.concat(TE(a))),(i==="polygon"||i==="polyline")&&(n=n.concat(sE(a))),i==="rect"&&(n=n.concat(RE(a))),i==="g"&&(n=n.concat(EA(a,e)))}),n):[]}function lA(r){return r=r.replace(/\s+/g,","),r=r.replace(/e/gi,"e"),r=r.replace(/e-/g,"~~~"),r=r.replace(/-/g,",-"),r=r.replace(/~~~/g,"e-"),r=r.replace(/e\+/g,"~~~"),r=r.replace(/\+/g,","),r=r.replace(/~~~/g,"e+"),r=r.replace(/,+/g,","),r}function s0(r=""){let t=[];return r.charAt(0)===","&&(r=r.substring(1)),r.charAt(r.length-1)===","&&(r=r.substring(0,r.length-1)),r.length>0&&(r=r.split(","),r.forEach(n=>{if(n=n.split("."),n.length===1)t.push(Number(n[0]));else if(n.length===2)t.push(Number(n.join(".")));else if(n.length>2){t.push(+`${n[0]}.${n[1]}`);for(let e=2;e<n.length;e++)t.push(+`0.${n[e]}`)}})),t}function v0(r){const t=yE(r);if(t.length===0)return new ot;let n=0,e=[];t.forEach(i=>{if(i=i.filter(o=>!(o[0].x===o[3].x&&o[0].y===o[3].y&&o[1]===!1&&o[2]===!1)),i.length){n++;const o=i[0][0].x===i.at(-1)[3].x&&i[0][0].y===i.at(-1)[3].y;let A=new Xt({name:`Path ${n}`}),x;o||(x=new Gt({p:{coord:{x:i[0][0].x,y:i[0][0].y}}}),i[0][1]&&(x.h2=new at({coord:{x:i[0][1].x,y:i[0][1].y}})),A.addPathPoint(x));for(let E=0;E<i.length-1;E++)A.addPathPoint(Ri(i[E],i[E+1]));o?A.addPathPoint(Ri(i.at(-1),i[0])):(x=new Gt({p:{coord:{x:i.at(-1)[3].x,y:i.at(-1)[3].y}}}),i.at(-1)[2]&&(x.h1=new at({coord:{x:i.at(-1)[2].x,y:i.at(-1)[2].y}})),A.addPathPoint(x)),e.push(A)}});const a=new ot({shapes:e});return a.changed(!0),a}function Ri(r,t){r[3].x!==t[0].x||(r[3].y,t[0].y);let n=new Gt({p:{coord:{x:t[0].x,y:t[0].y}}});return r[2]&&(n.h1=new at({coord:{x:r[2].x,y:r[2].y},use:!0})),t[1]&&(n.h2=new at({coord:{x:t[1].x,y:t[1].y},use:!0})),n}function ce(r,t="",n=[]){let e=`current${r.objType}`;e==="currentControlPoint"&&(e=`currentPathPoint.${r.type}`);let a=[e].concat(n);t&&(t+=":&ensp;");let i=L({tag:"label",innerHTML:`${t}x${Ie()}y`}),o=L({tag:"div",className:"doubleInput"}),A=Ft(r,"x",a,"input-number"),x=Ft(r,"y",a,"input-number");return o.appendChild(A),o.appendChild(he()),o.appendChild(x),[i,o]}function w0(r){let t=`current${r.objType}`,n=V(`width${Ie()}height`),e=L({tag:"div",className:"doubleInput"}),a=Ft(r,"width",t,"input-number"),i=Ft(r,"height",t,"input-number");e.appendChild(a),e.appendChild(he()),e.appendChild(i);let o=["top-left","baseline-left","bottom-left","top-right","baseline-right","bottom-right","middle-center"];o=Ee;let A=V("transform origin",`With increases or decreases to width or height,
		the transform origin is the point that stays fixed.
		<br><br>
		This only takes effect when directly entering values
		into the width or height inputs.`),x=L({tag:"option-chooser",attributes:{"selected-id":r.transformOrigin,"selected-name":r.transformOrigin.replace("-"," ")}});o.forEach(T=>{let s=L({tag:"option",attributes:{"selection-id":T},innerHTML:`${kx(T)}${T.replace("-"," ")}`});s.addEventListener("click",()=>{r.transformOrigin=T,d().publish("editCanvasView",r)}),x.appendChild(s)});let E=V("lock aspect ratio",`
			When either the width or height is adjusted,
			the overall size will be kept proportional.
			<br><br>
			Maintaining aspect ratio will override value
			locks if need be.
		`),l=Ln(r,"ratioLock",t);return[n,e,A,x,E,l]}function Ft(r,t,n,e,a=[]){let i=Array.isArray(n)?n:[n],o=L({tag:e,className:`singleInput-${t}`,attributes:{"pubsub-topic":i[0]}}),A=e==="input"?r[t]:R(r[t],3);o.setAttribute("value",A),r.isLockable&&(o.setAttribute("is-locked",r.isLocked(t)),o.addEventListener("lock",E=>{E.detail.isLocked?r.lock(t):r.unlock(t);const l=d();i.forEach(T=>l.publish(T,r))}));function x(E){if(r.isLockable&&r.isLocked(t))return;let l=E.target.value;const T=d();if(t==="leftSideBearing"){let s=T.view;T.view.dx-=(l-r.leftSideBearing)*s.dz,T.publish("editCanvasView",r)}if((r.constructor.name==="Glyph"||r.objType==="Path")&&(t==="width"||t==="height")){let s={width:!1,height:!1};s.ratioLock=r.ratioLock,s.transformOrigin=r.transformOrigin,t==="width"?s.width=l:s.height=l,r.objType==="Path"?r.setShapeSize(s):r.setGlyphSize(s)}else r[t]=l;r.objType==="VirtualGlyph"?i.forEach(s=>T.publish(s,T.selectedItem)):r.objType==="VirtualShape"?i.forEach(s=>T.publish(s,T.selectedItem)):i.forEach(s=>T.publish(s,r))}return o.addEventListener("change",x),a&&a.forEach(E=>{o.addEventListener(E,x)}),d().subscribe({topic:i,subscriberID:`attributesPanel.${i[0]}.${t}`,callback:E=>{if(E&&(E[t]||E[t]===0)){let l;e==="input"?l=E[t]:l=R(E[t],3),o.value=l,o.setAttribute("value",l)}}}),o}function Ln(r,t,n){let e=L({tag:"input",attributes:{type:"checkbox"}});return r[t]&&e.setAttribute("checked",""),e.addEventListener("change",a=>{let i=a.target.checked;r[t]=!!i,n&&(d().publish(n,r),t==="use"&&(Ga(r.type,!!i),r.parent.reconcileHandle(r.type)))}),n&&d().subscribe({topic:n,subscriberID:`attributesPanel.${n}.${t}`,callback:a=>{a[t]?(e.setAttribute("checked",""),t==="use"&&Ga(r.type,!0)):(e.removeAttribute("checked"),t==="use"&&Ga(r.type,!1))}}),e}function Ga(r,t){let n=document.getElementById(`${r}InputGroup`);n&&(n.style.display=t?"grid":"none")}function V(r,t=!1,n=!1,e=!1){let a=L({content:r}),i=L({tag:"label"});if(n&&i.setAttribute("for",n),i.appendChild(a),t){let o=L({tag:"info-bubble",content:t});i.appendChild(o),i.classList.add("info")}return e&&i.setAttribute("class",e),i}function mr(){return L({tag:"div",className:"rowPad"})}function Ie(){return'<span class="dimSplit">&#x2044;</span>'}function he(){return L({className:"dimSplit",innerHTML:"&#x2044;"})}function tr(r,t,n){let e=L({tag:"input",attributes:{type:"checkbox"}});return r[t]&&e.setAttribute("checked",""),e.addEventListener("change",a=>{let i=a.target.checked;r[t]=!!i,n&&n(i)}),e}function sA(r){const t=d(),n=m(),e=t.project.getItem(r);let a=L({className:"item-link__row",attributes:{"target-item-id":r}});return a.addEventListener("click",()=>{e.displayType==="Glyph"&&(t.nav.page="Characters"),e.displayType==="Component"&&(t.nav.page="Components"),e.displayType==="Ligature"&&(t.nav.page="Ligatures"),t.selectedItemID=r,t.navigate()}),a.appendChild(L({className:"item-link__thumbnail",attributes:{"target-item-id":r},innerHTML:n.makeItemThumbnail(e)})),a.appendChild(L({className:"item-link__title",innerHTML:`${(e==null?void 0:e.name)||"ERROR"}`})),a.appendChild(L({className:"item-link__subtitle",innerHTML:`${(e==null?void 0:e.displayType)||"ERROR"}&ensp;|&ensp;${r}`})),a}/*! https://mths.be/codepointat v0.2.0 by @mathias */String.prototype.codePointAt||function(){var r=function(){try{var n={},e=Object.defineProperty,a=e(n,n,n)&&e}catch{}return a}(),t=function(n){if(this==null)throw TypeError();var e=String(this),a=e.length,i=n?Number(n):0;if(i!=i&&(i=0),!(i<0||i>=a)){var o=e.charCodeAt(i),A;return o>=55296&&o<=56319&&a>i+1&&(A=e.charCodeAt(i+1),A>=56320&&A<=57343)?(o-55296)*1024+A-56320+65536:o}};r?r(String.prototype,"codePointAt",{value:t,configurable:!0,writable:!0}):String.prototype.codePointAt=t}();var W0=0,LA=-3;function re(){this.table=new Uint16Array(16),this.trans=new Uint16Array(288)}function NE(r,t){this.source=r,this.sourceIndex=0,this.tag=0,this.bitcount=0,this.dest=t,this.destLen=0,this.ltree=new re,this.dtree=new re}var TA=new re,cA=new re,k0=new Uint8Array(30),K0=new Uint16Array(30),IA=new Uint8Array(30),hA=new Uint16Array(30),DE=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),gi=new re,Sr=new Uint8Array(320);function dA(r,t,n,e){var a,i;for(a=0;a<n;++a)r[a]=0;for(a=0;a<30-n;++a)r[a+n]=a/n|0;for(i=e,a=0;a<30;++a)t[a]=i,i+=1<<r[a]}function OE(r,t){var n;for(n=0;n<7;++n)r.table[n]=0;for(r.table[7]=24,r.table[8]=152,r.table[9]=112,n=0;n<24;++n)r.trans[n]=256+n;for(n=0;n<144;++n)r.trans[24+n]=n;for(n=0;n<8;++n)r.trans[168+n]=280+n;for(n=0;n<112;++n)r.trans[176+n]=144+n;for(n=0;n<5;++n)t.table[n]=0;for(t.table[5]=32,n=0;n<32;++n)t.trans[n]=n}var yi=new Uint16Array(16);function Pa(r,t,n,e){var a,i;for(a=0;a<16;++a)r.table[a]=0;for(a=0;a<e;++a)r.table[t[n+a]]++;for(r.table[0]=0,i=0,a=0;a<16;++a)yi[a]=i,i+=r.table[a];for(a=0;a<e;++a)t[n+a]&&(r.trans[yi[t[n+a]]++]=a)}function mE(r){r.bitcount--||(r.tag=r.source[r.sourceIndex++],r.bitcount=7);var t=r.tag&1;return r.tag>>>=1,t}function gr(r,t,n){if(!t)return n;for(;r.bitcount<24;)r.tag|=r.source[r.sourceIndex++]<<r.bitcount,r.bitcount+=8;var e=r.tag&65535>>>16-t;return r.tag>>>=t,r.bitcount-=t,e+n}function L0(r,t){for(;r.bitcount<24;)r.tag|=r.source[r.sourceIndex++]<<r.bitcount,r.bitcount+=8;var n=0,e=0,a=0,i=r.tag;do e=2*e+(i&1),i>>>=1,++a,n+=t.table[a],e-=t.table[a];while(e>=0);return r.tag=i,r.bitcount-=a,t.trans[n+e]}function BE(r,t,n){var e,a,i,o,A,x;for(e=gr(r,5,257),a=gr(r,5,1),i=gr(r,4,4),o=0;o<19;++o)Sr[o]=0;for(o=0;o<i;++o){var E=gr(r,3,0);Sr[DE[o]]=E}for(Pa(gi,Sr,0,19),A=0;A<e+a;){var l=L0(r,gi);switch(l){case 16:var T=Sr[A-1];for(x=gr(r,2,3);x;--x)Sr[A++]=T;break;case 17:for(x=gr(r,3,3);x;--x)Sr[A++]=0;break;case 18:for(x=gr(r,7,11);x;--x)Sr[A++]=0;break;default:Sr[A++]=l;break}}Pa(t,Sr,0,e),Pa(n,Sr,e,a)}function Ni(r,t,n){for(;;){var e=L0(r,t);if(e===256)return W0;if(e<256)r.dest[r.destLen++]=e;else{var a,i,o,A;for(e-=257,a=gr(r,k0[e],K0[e]),i=L0(r,n),o=r.destLen-gr(r,IA[i],hA[i]),A=o;A<o+a;++A)r.dest[r.destLen++]=r.dest[A]}}}function HE(r){for(var t,n,e;r.bitcount>8;)r.sourceIndex--,r.bitcount-=8;if(t=r.source[r.sourceIndex+1],t=256*t+r.source[r.sourceIndex],n=r.source[r.sourceIndex+3],n=256*n+r.source[r.sourceIndex+2],t!==(~n&65535))return LA;for(r.sourceIndex+=4,e=t;e;--e)r.dest[r.destLen++]=r.source[r.sourceIndex++];return r.bitcount=0,W0}function FE(r,t){var n=new NE(r,t),e,a,i;do{switch(e=mE(n),a=gr(n,2,0),a){case 0:i=HE(n);break;case 1:i=Ni(n,TA,cA);break;case 2:BE(n,n.ltree,n.dtree),i=Ni(n,n.ltree,n.dtree);break;default:i=LA}if(i!==W0)throw new Error("Data error")}while(!e);return n.destLen<n.dest.length?typeof n.dest.slice=="function"?n.dest.slice(0,n.destLen):n.dest.subarray(0,n.destLen):n.dest}OE(TA,cA);dA(k0,K0,4,3);dA(IA,hA,2,1);k0[28]=0;K0[28]=258;var fE=FE;function Cn(r,t,n,e,a){return Math.pow(1-a,3)*r+3*Math.pow(1-a,2)*a*t+3*(1-a)*Math.pow(a,2)*n+Math.pow(a,3)*e}function wr(){this.x1=Number.NaN,this.y1=Number.NaN,this.x2=Number.NaN,this.y2=Number.NaN}wr.prototype.isEmpty=function(){return isNaN(this.x1)||isNaN(this.y1)||isNaN(this.x2)||isNaN(this.y2)};wr.prototype.addPoint=function(r,t){typeof r=="number"&&((isNaN(this.x1)||isNaN(this.x2))&&(this.x1=r,this.x2=r),r<this.x1&&(this.x1=r),r>this.x2&&(this.x2=r)),typeof t=="number"&&((isNaN(this.y1)||isNaN(this.y2))&&(this.y1=t,this.y2=t),t<this.y1&&(this.y1=t),t>this.y2&&(this.y2=t))};wr.prototype.addX=function(r){this.addPoint(r,null)};wr.prototype.addY=function(r){this.addPoint(null,r)};wr.prototype.addBezier=function(r,t,n,e,a,i,o,A){var x=[r,t],E=[n,e],l=[a,i],T=[o,A];this.addPoint(r,t),this.addPoint(o,A);for(var s=0;s<=1;s++){var c=6*x[s]-12*E[s]+6*l[s],I=-3*x[s]+9*E[s]-9*l[s]+3*T[s],h=3*E[s]-3*x[s];if(I===0){if(c===0)continue;var S=-h/c;0<S&&S<1&&(s===0&&this.addX(Cn(x[s],E[s],l[s],T[s],S)),s===1&&this.addY(Cn(x[s],E[s],l[s],T[s],S)));continue}var p=Math.pow(c,2)-4*h*I;if(!(p<0)){var u=(-c+Math.sqrt(p))/(2*I);0<u&&u<1&&(s===0&&this.addX(Cn(x[s],E[s],l[s],T[s],u)),s===1&&this.addY(Cn(x[s],E[s],l[s],T[s],u)));var D=(-c-Math.sqrt(p))/(2*I);0<D&&D<1&&(s===0&&this.addX(Cn(x[s],E[s],l[s],T[s],D)),s===1&&this.addY(Cn(x[s],E[s],l[s],T[s],D)))}}};wr.prototype.addQuad=function(r,t,n,e,a,i){var o=r+.6666666666666666*(n-r),A=t+2/3*(e-t),x=o+1/3*(a-r),E=A+1/3*(i-t);this.addBezier(r,t,o,A,x,E,a,i)};function Bt(){this.commands=[],this.fill="black",this.stroke=null,this.strokeWidth=1}Bt.prototype.moveTo=function(r,t){this.commands.push({type:"M",x:r,y:t})};Bt.prototype.lineTo=function(r,t){this.commands.push({type:"L",x:r,y:t})};Bt.prototype.curveTo=Bt.prototype.bezierCurveTo=function(r,t,n,e,a,i){this.commands.push({type:"C",x1:r,y1:t,x2:n,y2:e,x:a,y:i})};Bt.prototype.quadTo=Bt.prototype.quadraticCurveTo=function(r,t,n,e){this.commands.push({type:"Q",x1:r,y1:t,x:n,y:e})};Bt.prototype.close=Bt.prototype.closePath=function(){this.commands.push({type:"Z"})};Bt.prototype.extend=function(r){if(r.commands)r=r.commands;else if(r instanceof wr){var t=r;this.moveTo(t.x1,t.y1),this.lineTo(t.x2,t.y1),this.lineTo(t.x2,t.y2),this.lineTo(t.x1,t.y2),this.close();return}Array.prototype.push.apply(this.commands,r)};Bt.prototype.getBoundingBox=function(){for(var r=new wr,t=0,n=0,e=0,a=0,i=0;i<this.commands.length;i++){var o=this.commands[i];switch(o.type){case"M":r.addPoint(o.x,o.y),t=e=o.x,n=a=o.y;break;case"L":r.addPoint(o.x,o.y),e=o.x,a=o.y;break;case"Q":r.addQuad(e,a,o.x1,o.y1,o.x,o.y),e=o.x,a=o.y;break;case"C":r.addBezier(e,a,o.x1,o.y1,o.x2,o.y2,o.x,o.y),e=o.x,a=o.y;break;case"Z":e=t,a=n;break;default:throw new Error("Unexpected path command "+o.type)}}return r.isEmpty()&&r.addPoint(0,0),r};Bt.prototype.draw=function(r){r.beginPath();for(var t=0;t<this.commands.length;t+=1){var n=this.commands[t];n.type==="M"?r.moveTo(n.x,n.y):n.type==="L"?r.lineTo(n.x,n.y):n.type==="C"?r.bezierCurveTo(n.x1,n.y1,n.x2,n.y2,n.x,n.y):n.type==="Q"?r.quadraticCurveTo(n.x1,n.y1,n.x,n.y):n.type==="Z"&&r.closePath()}this.fill&&(r.fillStyle=this.fill,r.fill()),this.stroke&&(r.strokeStyle=this.stroke,r.lineWidth=this.strokeWidth,r.stroke())};Bt.prototype.toPathData=function(r){r=r!==void 0?r:2;function t(o){return Math.round(o)===o?""+Math.round(o):o.toFixed(r)}function n(){for(var o=arguments,A="",x=0;x<arguments.length;x+=1){var E=o[x];E>=0&&x>0&&(A+=" "),A+=t(E)}return A}for(var e="",a=0;a<this.commands.length;a+=1){var i=this.commands[a];i.type==="M"?e+="M"+n(i.x,i.y):i.type==="L"?e+="L"+n(i.x,i.y):i.type==="C"?e+="C"+n(i.x1,i.y1,i.x2,i.y2,i.x,i.y):i.type==="Q"?e+="Q"+n(i.x1,i.y1,i.x,i.y):i.type==="Z"&&(e+="Z")}return e};Bt.prototype.toSVG=function(r){var t='<path d="';return t+=this.toPathData(r),t+='"',this.fill&&this.fill!=="black"&&(this.fill===null?t+=' fill="none"':t+=' fill="'+this.fill+'"'),this.stroke&&(t+=' stroke="'+this.stroke+'" stroke-width="'+this.strokeWidth+'"'),t+="/>",t};Bt.prototype.toDOMElement=function(r){var t=this.toPathData(r),n=document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("d",t),n};function SA(r){throw new Error(r)}function Di(r,t){r||SA(t)}var J={fail:SA,argument:Di,assert:Di},Oi=32768,mi=2147483648,Fn={},H={},w={};function Ir(r){return function(){return r}}H.BYTE=function(r){return J.argument(r>=0&&r<=255,"Byte value should be between 0 and 255."),[r]};w.BYTE=Ir(1);H.CHAR=function(r){return[r.charCodeAt(0)]};w.CHAR=Ir(1);H.CHARARRAY=function(r){for(var t=[],n=0;n<r.length;n+=1)t[n]=r.charCodeAt(n);return t};w.CHARARRAY=function(r){return r.length};H.USHORT=function(r){return[r>>8&255,r&255]};w.USHORT=Ir(2);H.SHORT=function(r){return r>=Oi&&(r=-(2*Oi-r)),[r>>8&255,r&255]};w.SHORT=Ir(2);H.UINT24=function(r){return[r>>16&255,r>>8&255,r&255]};w.UINT24=Ir(3);H.ULONG=function(r){return[r>>24&255,r>>16&255,r>>8&255,r&255]};w.ULONG=Ir(4);H.LONG=function(r){return r>=mi&&(r=-(2*mi-r)),[r>>24&255,r>>16&255,r>>8&255,r&255]};w.LONG=Ir(4);H.FIXED=H.ULONG;w.FIXED=w.ULONG;H.FWORD=H.SHORT;w.FWORD=w.SHORT;H.UFWORD=H.USHORT;w.UFWORD=w.USHORT;H.LONGDATETIME=function(r){return[0,0,0,0,r>>24&255,r>>16&255,r>>8&255,r&255]};w.LONGDATETIME=Ir(8);H.TAG=function(r){return J.argument(r.length===4,"Tag should be exactly 4 ASCII characters."),[r.charCodeAt(0),r.charCodeAt(1),r.charCodeAt(2),r.charCodeAt(3)]};w.TAG=Ir(4);H.Card8=H.BYTE;w.Card8=w.BYTE;H.Card16=H.USHORT;w.Card16=w.USHORT;H.OffSize=H.BYTE;w.OffSize=w.BYTE;H.SID=H.USHORT;w.SID=w.USHORT;H.NUMBER=function(r){return r>=-107&&r<=107?[r+139]:r>=108&&r<=1131?(r=r-108,[(r>>8)+247,r&255]):r>=-1131&&r<=-108?(r=-r-108,[(r>>8)+251,r&255]):r>=-32768&&r<=32767?H.NUMBER16(r):H.NUMBER32(r)};w.NUMBER=function(r){return H.NUMBER(r).length};H.NUMBER16=function(r){return[28,r>>8&255,r&255]};w.NUMBER16=Ir(3);H.NUMBER32=function(r){return[29,r>>24&255,r>>16&255,r>>8&255,r&255]};w.NUMBER32=Ir(5);H.REAL=function(r){var t=r.toString(),n=/\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(t);if(n){var e=parseFloat("1e"+((n[2]?+n[2]:0)+n[1].length));t=(Math.round(r*e)/e).toString()}for(var a="",i=0,o=t.length;i<o;i+=1){var A=t[i];A==="e"?a+=t[++i]==="-"?"c":"b":A==="."?a+="a":A==="-"?a+="e":a+=A}a+=a.length&1?"f":"ff";for(var x=[30],E=0,l=a.length;E<l;E+=2)x.push(parseInt(a.substr(E,2),16));return x};w.REAL=function(r){return H.REAL(r).length};H.NAME=H.CHARARRAY;w.NAME=w.CHARARRAY;H.STRING=H.CHARARRAY;w.STRING=w.CHARARRAY;Fn.UTF8=function(r,t,n){for(var e=[],a=n,i=0;i<a;i++,t+=1)e[i]=r.getUint8(t);return String.fromCharCode.apply(null,e)};Fn.UTF16=function(r,t,n){for(var e=[],a=n/2,i=0;i<a;i++,t+=2)e[i]=r.getUint16(t);return String.fromCharCode.apply(null,e)};H.UTF16=function(r){for(var t=[],n=0;n<r.length;n+=1){var e=r.charCodeAt(n);t[t.length]=e>>8&255,t[t.length]=e&255}return t};w.UTF16=function(r){return r.length*2};var T0={"x-mac-croatian":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ","x-mac-cyrillic":"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю","x-mac-gaelic":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæøṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ","x-mac-greek":"Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ­","x-mac-icelandic":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ","x-mac-inuit":"ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł","x-mac-ce":"ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ",macintosh:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ","x-mac-romanian":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ","x-mac-turkish":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ"};Fn.MACSTRING=function(r,t,n,e){var a=T0[e];if(a!==void 0){for(var i="",o=0;o<n;o++){var A=r.getUint8(t+o);A<=127?i+=String.fromCharCode(A):i+=a[A&127]}return i}};var fe=typeof WeakMap=="function"&&new WeakMap,Me,ME=function(r){if(!Me){Me={};for(var t in T0)Me[t]=new String(t)}var n=Me[r];if(n!==void 0){if(fe){var e=fe.get(n);if(e!==void 0)return e}var a=T0[r];if(a!==void 0){for(var i={},o=0;o<a.length;o++)i[a.charCodeAt(o)]=o+128;return fe&&fe.set(n,i),i}}};H.MACSTRING=function(r,t){var n=ME(t);if(n!==void 0){for(var e=[],a=0;a<r.length;a++){var i=r.charCodeAt(a);if(i>=128&&(i=n[i],i===void 0))return;e[a]=i}return e}};w.MACSTRING=function(r,t){var n=H.MACSTRING(r,t);return n!==void 0?n.length:0};function c0(r){return r>=-128&&r<=127}function GE(r,t,n){for(var e=0,a=r.length;t<a&&e<64&&r[t]===0;)++t,++e;return n.push(128|e-1),t}function PE(r,t,n){for(var e=0,a=r.length,i=t;i<a&&e<64;){var o=r[i];if(!c0(o)||o===0&&i+1<a&&r[i+1]===0)break;++i,++e}n.push(e-1);for(var A=t;A<i;++A)n.push(r[A]+256&255);return i}function bE(r,t,n){for(var e=0,a=r.length,i=t;i<a&&e<64;){var o=r[i];if(o===0||c0(o)&&i+1<a&&c0(r[i+1]))break;++i,++e}n.push(64|e-1);for(var A=t;A<i;++A){var x=r[A];n.push(x+65536>>8&255,x+256&255)}return i}H.VARDELTAS=function(r){for(var t=0,n=[];t<r.length;){var e=r[t];e===0?t=GE(r,t,n):e>=-128&&e<=127?t=PE(r,t,n):t=bE(r,t,n)}return n};H.INDEX=function(r){for(var t=1,n=[t],e=[],a=0;a<r.length;a+=1){var i=H.OBJECT(r[a]);Array.prototype.push.apply(e,i),t+=i.length,n.push(t)}if(e.length===0)return[0,0];for(var o=[],A=1+Math.floor(Math.log(t)/Math.log(2))/8|0,x=[void 0,H.BYTE,H.USHORT,H.UINT24,H.ULONG][A],E=0;E<n.length;E+=1){var l=x(n[E]);Array.prototype.push.apply(o,l)}return Array.prototype.concat(H.Card16(r.length),H.OffSize(A),o,e)};w.INDEX=function(r){return H.INDEX(r).length};H.DICT=function(r){for(var t=[],n=Object.keys(r),e=n.length,a=0;a<e;a+=1){var i=parseInt(n[a],0),o=r[i];t=t.concat(H.OPERAND(o.value,o.type)),t=t.concat(H.OPERATOR(i))}return t};w.DICT=function(r){return H.DICT(r).length};H.OPERATOR=function(r){return r<1200?[r]:[12,r-1200]};H.OPERAND=function(r,t){var n=[];if(Array.isArray(t))for(var e=0;e<t.length;e+=1)J.argument(r.length===t.length,"Not enough arguments given for type"+t),n=n.concat(H.OPERAND(r[e],t[e]));else if(t==="SID")n=n.concat(H.NUMBER(r));else if(t==="offset")n=n.concat(H.NUMBER32(r));else if(t==="number")n=n.concat(H.NUMBER(r));else if(t==="real")n=n.concat(H.REAL(r));else throw new Error("Unknown operand type "+t);return n};H.OP=H.BYTE;w.OP=w.BYTE;var Ge=typeof WeakMap=="function"&&new WeakMap;H.CHARSTRING=function(r){if(Ge){var t=Ge.get(r);if(t!==void 0)return t}for(var n=[],e=r.length,a=0;a<e;a+=1){var i=r[a];n=n.concat(H[i.type](i.value))}return Ge&&Ge.set(r,n),n};w.CHARSTRING=function(r){return H.CHARSTRING(r).length};H.OBJECT=function(r){var t=H[r.type];return J.argument(t!==void 0,"No encoding function for type "+r.type),t(r.value)};w.OBJECT=function(r){var t=w[r.type];return J.argument(t!==void 0,"No sizeOf function for type "+r.type),t(r.value)};H.TABLE=function(r){for(var t=[],n=r.fields.length,e=[],a=[],i=0;i<n;i+=1){var o=r.fields[i],A=H[o.type];J.argument(A!==void 0,"No encoding function for field type "+o.type+" ("+o.name+")");var x=r[o.name];x===void 0&&(x=o.value);var E=A(x);o.type==="TABLE"?(a.push(t.length),t=t.concat([0,0]),e.push(E)):t=t.concat(E)}for(var l=0;l<e.length;l+=1){var T=a[l],s=t.length;J.argument(s<65536,"Table "+r.tableName+" too big."),t[T]=s>>8,t[T+1]=s&255,t=t.concat(e[l])}return t};w.TABLE=function(r){for(var t=0,n=r.fields.length,e=0;e<n;e+=1){var a=r.fields[e],i=w[a.type];J.argument(i!==void 0,"No sizeOf function for field type "+a.type+" ("+a.name+")");var o=r[a.name];o===void 0&&(o=a.value),t+=i(o),a.type==="TABLE"&&(t+=2)}return t};H.RECORD=H.TABLE;w.RECORD=w.TABLE;H.LITERAL=function(r){return r};w.LITERAL=function(r){return r.length};function Wt(r,t,n){for(var e=0;e<t.length;e+=1){var a=t[e];this[a.name]=a.value}if(this.tableName=r,this.fields=t,n)for(var i=Object.keys(n),o=0;o<i.length;o+=1){var A=i[o],x=n[A];this[A]!==void 0&&(this[A]=x)}}Wt.prototype.encode=function(){return H.TABLE(this)};Wt.prototype.sizeOf=function(){return w.TABLE(this)};function ne(r,t,n){n===void 0&&(n=t.length);var e=new Array(t.length+1);e[0]={name:r+"Count",type:"USHORT",value:n};for(var a=0;a<t.length;a++)e[a+1]={name:r+a,type:"USHORT",value:t[a]};return e}function I0(r,t,n){var e=t.length,a=new Array(e+1);a[0]={name:r+"Count",type:"USHORT",value:e};for(var i=0;i<e;i++)a[i+1]={name:r+i,type:"TABLE",value:n(t[i],i)};return a}function je(r,t,n){var e=t.length,a=[];a[0]={name:r+"Count",type:"USHORT",value:e};for(var i=0;i<e;i++)a=a.concat(n(t[i],i));return a}function Qe(r){r.format===1?Wt.call(this,"coverageTable",[{name:"coverageFormat",type:"USHORT",value:1}].concat(ne("glyph",r.glyphs))):J.assert(!1,"Can't create coverage table format 2 yet.")}Qe.prototype=Object.create(Wt.prototype);Qe.prototype.constructor=Qe;function qe(r){Wt.call(this,"scriptListTable",je("scriptRecord",r,function(t,n){var e=t.script,a=e.defaultLangSys;return J.assert(!!a,"Unable to write GSUB: script "+t.tag+" has no default language system."),[{name:"scriptTag"+n,type:"TAG",value:t.tag},{name:"script"+n,type:"TABLE",value:new Wt("scriptTable",[{name:"defaultLangSys",type:"TABLE",value:new Wt("defaultLangSys",[{name:"lookupOrder",type:"USHORT",value:0},{name:"reqFeatureIndex",type:"USHORT",value:a.reqFeatureIndex}].concat(ne("featureIndex",a.featureIndexes)))}].concat(je("langSys",e.langSysRecords,function(i,o){var A=i.langSys;return[{name:"langSysTag"+o,type:"TAG",value:i.tag},{name:"langSys"+o,type:"TABLE",value:new Wt("langSys",[{name:"lookupOrder",type:"USHORT",value:0},{name:"reqFeatureIndex",type:"USHORT",value:A.reqFeatureIndex}].concat(ne("featureIndex",A.featureIndexes)))}]})))}]}))}qe.prototype=Object.create(Wt.prototype);qe.prototype.constructor=qe;function $e(r){Wt.call(this,"featureListTable",je("featureRecord",r,function(t,n){var e=t.feature;return[{name:"featureTag"+n,type:"TAG",value:t.tag},{name:"feature"+n,type:"TABLE",value:new Wt("featureTable",[{name:"featureParams",type:"USHORT",value:e.featureParams}].concat(ne("lookupListIndex",e.lookupListIndexes)))}]}))}$e.prototype=Object.create(Wt.prototype);$e.prototype.constructor=$e;function ta(r,t){Wt.call(this,"lookupListTable",I0("lookup",r,function(n){var e=t[n.lookupType];return J.assert(!!e,"Unable to write GSUB lookup type "+n.lookupType+" tables."),new Wt("lookupTable",[{name:"lookupType",type:"USHORT",value:n.lookupType},{name:"lookupFlag",type:"USHORT",value:n.lookupFlag}].concat(I0("subtable",n.subtables,e)))}))}ta.prototype=Object.create(Wt.prototype);ta.prototype.constructor=ta;var Y={Table:Wt,Record:Wt,Coverage:Qe,ScriptList:qe,FeatureList:$e,LookupList:ta,ushortList:ne,tableList:I0,recordList:je};function Bi(r,t){return r.getUint8(t)}function ra(r,t){return r.getUint16(t,!1)}function UE(r,t){return r.getInt16(t,!1)}function V0(r,t){return r.getUint32(t,!1)}function pA(r,t){var n=r.getInt16(t,!1),e=r.getUint16(t+2,!1);return n+e/65535}function YE(r,t){for(var n="",e=t;e<t+4;e+=1)n+=String.fromCharCode(r.getInt8(e));return n}function vE(r,t,n){for(var e=0,a=0;a<n;a+=1)e<<=8,e+=r.getUint8(t+a);return e}function wE(r,t,n){for(var e=[],a=t;a<n;a+=1)e.push(r.getUint8(a));return e}function WE(r){for(var t="",n=0;n<r.length;n+=1)t+=String.fromCharCode(r[n]);return t}var kE={byte:1,uShort:2,short:2,uLong:4,fixed:4,longDateTime:8,tag:4};function C(r,t){this.data=r,this.offset=t,this.relativeOffset=0}C.prototype.parseByte=function(){var r=this.data.getUint8(this.offset+this.relativeOffset);return this.relativeOffset+=1,r};C.prototype.parseChar=function(){var r=this.data.getInt8(this.offset+this.relativeOffset);return this.relativeOffset+=1,r};C.prototype.parseCard8=C.prototype.parseByte;C.prototype.parseUShort=function(){var r=this.data.getUint16(this.offset+this.relativeOffset);return this.relativeOffset+=2,r};C.prototype.parseCard16=C.prototype.parseUShort;C.prototype.parseSID=C.prototype.parseUShort;C.prototype.parseOffset16=C.prototype.parseUShort;C.prototype.parseShort=function(){var r=this.data.getInt16(this.offset+this.relativeOffset);return this.relativeOffset+=2,r};C.prototype.parseF2Dot14=function(){var r=this.data.getInt16(this.offset+this.relativeOffset)/16384;return this.relativeOffset+=2,r};C.prototype.parseULong=function(){var r=V0(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,r};C.prototype.parseOffset32=C.prototype.parseULong;C.prototype.parseFixed=function(){var r=pA(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,r};C.prototype.parseString=function(r){var t=this.data,n=this.offset+this.relativeOffset,e="";this.relativeOffset+=r;for(var a=0;a<r;a++)e+=String.fromCharCode(t.getUint8(n+a));return e};C.prototype.parseTag=function(){return this.parseString(4)};C.prototype.parseLongDateTime=function(){var r=V0(this.data,this.offset+this.relativeOffset+4);return r-=2082844800,this.relativeOffset+=8,r};C.prototype.parseVersion=function(r){var t=ra(this.data,this.offset+this.relativeOffset),n=ra(this.data,this.offset+this.relativeOffset+2);return this.relativeOffset+=4,r===void 0&&(r=4096),t+n/r/10};C.prototype.skip=function(r,t){t===void 0&&(t=1),this.relativeOffset+=kE[r]*t};C.prototype.parseULongList=function(r){r===void 0&&(r=this.parseULong());for(var t=new Array(r),n=this.data,e=this.offset+this.relativeOffset,a=0;a<r;a++)t[a]=n.getUint32(e),e+=4;return this.relativeOffset+=r*4,t};C.prototype.parseOffset16List=C.prototype.parseUShortList=function(r){r===void 0&&(r=this.parseUShort());for(var t=new Array(r),n=this.data,e=this.offset+this.relativeOffset,a=0;a<r;a++)t[a]=n.getUint16(e),e+=2;return this.relativeOffset+=r*2,t};C.prototype.parseShortList=function(r){for(var t=new Array(r),n=this.data,e=this.offset+this.relativeOffset,a=0;a<r;a++)t[a]=n.getInt16(e),e+=2;return this.relativeOffset+=r*2,t};C.prototype.parseByteList=function(r){for(var t=new Array(r),n=this.data,e=this.offset+this.relativeOffset,a=0;a<r;a++)t[a]=n.getUint8(e++);return this.relativeOffset+=r,t};C.prototype.parseList=function(r,t){t||(t=r,r=this.parseUShort());for(var n=new Array(r),e=0;e<r;e++)n[e]=t.call(this);return n};C.prototype.parseList32=function(r,t){t||(t=r,r=this.parseULong());for(var n=new Array(r),e=0;e<r;e++)n[e]=t.call(this);return n};C.prototype.parseRecordList=function(r,t){t||(t=r,r=this.parseUShort());for(var n=new Array(r),e=Object.keys(t),a=0;a<r;a++){for(var i={},o=0;o<e.length;o++){var A=e[o],x=t[A];i[A]=x.call(this)}n[a]=i}return n};C.prototype.parseRecordList32=function(r,t){t||(t=r,r=this.parseULong());for(var n=new Array(r),e=Object.keys(t),a=0;a<r;a++){for(var i={},o=0;o<e.length;o++){var A=e[o],x=t[A];i[A]=x.call(this)}n[a]=i}return n};C.prototype.parseStruct=function(r){if(typeof r=="function")return r.call(this);for(var t=Object.keys(r),n={},e=0;e<t.length;e++){var a=t[e],i=r[a];n[a]=i.call(this)}return n};C.prototype.parseValueRecord=function(r){if(r===void 0&&(r=this.parseUShort()),r!==0){var t={};return r&1&&(t.xPlacement=this.parseShort()),r&2&&(t.yPlacement=this.parseShort()),r&4&&(t.xAdvance=this.parseShort()),r&8&&(t.yAdvance=this.parseShort()),r&16&&(t.xPlaDevice=void 0,this.parseShort()),r&32&&(t.yPlaDevice=void 0,this.parseShort()),r&64&&(t.xAdvDevice=void 0,this.parseShort()),r&128&&(t.yAdvDevice=void 0,this.parseShort()),t}};C.prototype.parseValueRecordList=function(){for(var r=this.parseUShort(),t=this.parseUShort(),n=new Array(t),e=0;e<t;e++)n[e]=this.parseValueRecord(r);return n};C.prototype.parsePointer=function(r){var t=this.parseOffset16();if(t>0)return new C(this.data,this.offset+t).parseStruct(r)};C.prototype.parsePointer32=function(r){var t=this.parseOffset32();if(t>0)return new C(this.data,this.offset+t).parseStruct(r)};C.prototype.parseListOfLists=function(r){for(var t=this.parseOffset16List(),n=t.length,e=this.relativeOffset,a=new Array(n),i=0;i<n;i++){var o=t[i];if(o===0){a[i]=void 0;continue}if(this.relativeOffset=o,r){for(var A=this.parseOffset16List(),x=new Array(A.length),E=0;E<A.length;E++)this.relativeOffset=o+A[E],x[E]=r.call(this);a[i]=x}else a[i]=this.parseUShortList()}return this.relativeOffset=e,a};C.prototype.parseCoverage=function(){var r=this.offset+this.relativeOffset,t=this.parseUShort(),n=this.parseUShort();if(t===1)return{format:1,glyphs:this.parseUShortList(n)};if(t===2){for(var e=new Array(n),a=0;a<n;a++)e[a]={start:this.parseUShort(),end:this.parseUShort(),index:this.parseUShort()};return{format:2,ranges:e}}throw new Error("0x"+r.toString(16)+": Coverage format must be 1 or 2.")};C.prototype.parseClassDef=function(){var r=this.offset+this.relativeOffset,t=this.parseUShort();if(t===1)return{format:1,startGlyph:this.parseUShort(),classes:this.parseUShortList()};if(t===2)return{format:2,ranges:this.parseRecordList({start:C.uShort,end:C.uShort,classId:C.uShort})};throw new Error("0x"+r.toString(16)+": ClassDef format must be 1 or 2.")};C.list=function(r,t){return function(){return this.parseList(r,t)}};C.list32=function(r,t){return function(){return this.parseList32(r,t)}};C.recordList=function(r,t){return function(){return this.parseRecordList(r,t)}};C.recordList32=function(r,t){return function(){return this.parseRecordList32(r,t)}};C.pointer=function(r){return function(){return this.parsePointer(r)}};C.pointer32=function(r){return function(){return this.parsePointer32(r)}};C.tag=C.prototype.parseTag;C.byte=C.prototype.parseByte;C.uShort=C.offset16=C.prototype.parseUShort;C.uShortList=C.prototype.parseUShortList;C.uLong=C.offset32=C.prototype.parseULong;C.uLongList=C.prototype.parseULongList;C.struct=C.prototype.parseStruct;C.coverage=C.prototype.parseCoverage;C.classDef=C.prototype.parseClassDef;var Hi={reserved:C.uShort,reqFeatureIndex:C.uShort,featureIndexes:C.uShortList};C.prototype.parseScriptList=function(){return this.parsePointer(C.recordList({tag:C.tag,script:C.pointer({defaultLangSys:C.pointer(Hi),langSysRecords:C.recordList({tag:C.tag,langSys:C.pointer(Hi)})})}))||[]};C.prototype.parseFeatureList=function(){return this.parsePointer(C.recordList({tag:C.tag,feature:C.pointer({featureParams:C.offset16,lookupListIndexes:C.uShortList})}))||[]};C.prototype.parseLookupList=function(r){return this.parsePointer(C.list(C.pointer(function(){var t=this.parseUShort();J.argument(1<=t&&t<=9,"GPOS/GSUB lookup type "+t+" unknown.");var n=this.parseUShort(),e=n&16;return{lookupType:t,lookupFlag:n,subtables:this.parseList(C.pointer(r[t])),markFilteringSet:e?this.parseUShort():void 0}})))||[]};C.prototype.parseFeatureVariationsList=function(){return this.parsePointer32(function(){var r=this.parseUShort(),t=this.parseUShort();J.argument(r===1&&t<1,"GPOS/GSUB feature variations table unknown.");var n=this.parseRecordList32({conditionSetOffset:C.offset32,featureTableSubstitutionOffset:C.offset32});return n})||[]};var P={getByte:Bi,getCard8:Bi,getUShort:ra,getCard16:ra,getShort:UE,getULong:V0,getFixed:pA,getTag:YE,getOffset:vE,getBytes:wE,bytesToString:WE,Parser:C};function KE(r,t){t.parseUShort(),r.length=t.parseULong(),r.language=t.parseULong();var n;r.groupCount=n=t.parseULong(),r.glyphIndexMap={};for(var e=0;e<n;e+=1)for(var a=t.parseULong(),i=t.parseULong(),o=t.parseULong(),A=a;A<=i;A+=1)r.glyphIndexMap[A]=o,o++}function VE(r,t,n,e,a){r.length=t.parseUShort(),r.language=t.parseUShort();var i;r.segCount=i=t.parseUShort()>>1,t.skip("uShort",3),r.glyphIndexMap={};for(var o=new P.Parser(n,e+a+14),A=new P.Parser(n,e+a+16+i*2),x=new P.Parser(n,e+a+16+i*4),E=new P.Parser(n,e+a+16+i*6),l=e+a+16+i*8,T=0;T<i-1;T+=1)for(var s=void 0,c=o.parseUShort(),I=A.parseUShort(),h=x.parseShort(),S=E.parseUShort(),p=I;p<=c;p+=1)S!==0?(l=E.offset+E.relativeOffset-2,l+=S,l+=(p-I)*2,s=P.getUShort(n,l),s!==0&&(s=s+h&65535)):s=p+h&65535,r.glyphIndexMap[p]=s}function JE(r,t){var n={};n.version=P.getUShort(r,t),J.argument(n.version===0,"cmap table version should be 0."),n.numTables=P.getUShort(r,t+2);for(var e=-1,a=n.numTables-1;a>=0;a-=1){var i=P.getUShort(r,t+4+a*8),o=P.getUShort(r,t+4+a*8+2);if(i===3&&(o===0||o===1||o===10)||i===0&&(o===0||o===1||o===2||o===3||o===4)){e=P.getULong(r,t+4+a*8+4);break}}if(e===-1)throw new Error("No valid cmap sub-tables found.");var A=new P.Parser(r,t+e);if(n.format=A.parseUShort(),n.format===12)KE(n,A);else if(n.format===4)VE(n,A,r,t,e);else throw new Error("Only format 4 and 12 cmap tables are supported (found format "+n.format+").");return n}function _E(r,t,n){r.segments.push({end:t,start:t,delta:-(t-n),offset:0,glyphIndex:n})}function ZE(r){r.segments.push({end:65535,start:65535,delta:1,offset:0})}function zE(r){var t=!0,n;for(n=r.length-1;n>0;n-=1){var e=r.get(n);if(e.unicode>65535){console.log("Adding CMAP format 12 (needed!)"),t=!1;break}}var a=[{name:"version",type:"USHORT",value:0},{name:"numTables",type:"USHORT",value:t?1:2},{name:"platformID",type:"USHORT",value:3},{name:"encodingID",type:"USHORT",value:1},{name:"offset",type:"ULONG",value:t?12:20}];t||(a=a.concat([{name:"cmap12PlatformID",type:"USHORT",value:3},{name:"cmap12EncodingID",type:"USHORT",value:10},{name:"cmap12Offset",type:"ULONG",value:0}])),a=a.concat([{name:"format",type:"USHORT",value:4},{name:"cmap4Length",type:"USHORT",value:0},{name:"language",type:"USHORT",value:0},{name:"segCountX2",type:"USHORT",value:0},{name:"searchRange",type:"USHORT",value:0},{name:"entrySelector",type:"USHORT",value:0},{name:"rangeShift",type:"USHORT",value:0}]);var i=new Y.Table("cmap",a);for(i.segments=[],n=0;n<r.length;n+=1){for(var o=r.get(n),A=0;A<o.unicodes.length;A+=1)_E(i,o.unicodes[A],n);i.segments=i.segments.sort(function(u,D){return u.start-D.start})}ZE(i);var x=i.segments.length,E=0,l=[],T=[],s=[],c=[],I=[],h=[];for(n=0;n<x;n+=1){var S=i.segments[n];S.end<=65535&&S.start<=65535?(l=l.concat({name:"end_"+n,type:"USHORT",value:S.end}),T=T.concat({name:"start_"+n,type:"USHORT",value:S.start}),s=s.concat({name:"idDelta_"+n,type:"SHORT",value:S.delta}),c=c.concat({name:"idRangeOffset_"+n,type:"USHORT",value:S.offset}),S.glyphId!==void 0&&(I=I.concat({name:"glyph_"+n,type:"USHORT",value:S.glyphId}))):E+=1,!t&&S.glyphIndex!==void 0&&(h=h.concat({name:"cmap12Start_"+n,type:"ULONG",value:S.start}),h=h.concat({name:"cmap12End_"+n,type:"ULONG",value:S.end}),h=h.concat({name:"cmap12Glyph_"+n,type:"ULONG",value:S.glyphIndex}))}if(i.segCountX2=(x-E)*2,i.searchRange=Math.pow(2,Math.floor(Math.log(x-E)/Math.log(2)))*2,i.entrySelector=Math.log(i.searchRange/2)/Math.log(2),i.rangeShift=i.segCountX2-i.searchRange,i.fields=i.fields.concat(l),i.fields.push({name:"reservedPad",type:"USHORT",value:0}),i.fields=i.fields.concat(T),i.fields=i.fields.concat(s),i.fields=i.fields.concat(c),i.fields=i.fields.concat(I),i.cmap4Length=14+l.length*2+2+T.length*2+s.length*2+c.length*2+I.length*2,!t){var p=16+h.length*4;i.cmap12Offset=12+2*2+4+i.cmap4Length,i.fields=i.fields.concat([{name:"cmap12Format",type:"USHORT",value:12},{name:"cmap12Reserved",type:"USHORT",value:0},{name:"cmap12Length",type:"ULONG",value:p},{name:"cmap12Language",type:"ULONG",value:0},{name:"cmap12nGroups",type:"ULONG",value:h.length/3}]),i.fields=i.fields.concat(h)}return i}var CA={parse:JE,make:zE},ke=[".notdef","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","endash","dagger","daggerdbl","periodcentered","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","questiondown","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","ring","cedilla","hungarumlaut","ogonek","caron","emdash","AE","ordfeminine","Lslash","Oslash","OE","ordmasculine","ae","dotlessi","lslash","oslash","oe","germandbls","onesuperior","logicalnot","mu","trademark","Eth","onehalf","plusminus","Thorn","onequarter","divide","brokenbar","degree","thorn","threequarters","twosuperior","registered","minus","eth","multiply","threesuperior","copyright","Aacute","Acircumflex","Adieresis","Agrave","Aring","Atilde","Ccedilla","Eacute","Ecircumflex","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Ntilde","Oacute","Ocircumflex","Odieresis","Ograve","Otilde","Scaron","Uacute","Ucircumflex","Udieresis","Ugrave","Yacute","Ydieresis","Zcaron","aacute","acircumflex","adieresis","agrave","aring","atilde","ccedilla","eacute","ecircumflex","edieresis","egrave","iacute","icircumflex","idieresis","igrave","ntilde","oacute","ocircumflex","odieresis","ograve","otilde","scaron","uacute","ucircumflex","udieresis","ugrave","yacute","ydieresis","zcaron","exclamsmall","Hungarumlautsmall","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","266 ff","onedotenleader","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","commasuperior","threequartersemdash","periodsuperior","questionsmall","asuperior","bsuperior","centsuperior","dsuperior","esuperior","isuperior","lsuperior","msuperior","nsuperior","osuperior","rsuperior","ssuperior","tsuperior","ff","ffi","ffl","parenleftinferior","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","exclamdownsmall","centoldstyle","Lslashsmall","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","Dotaccentsmall","Macronsmall","figuredash","hypheninferior","Ogoneksmall","Ringsmall","Cedillasmall","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","zerosuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall","001.000","001.001","001.002","001.003","Black","Bold","Book","Light","Medium","Regular","Roman","Semibold"],XE=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","","endash","dagger","daggerdbl","periodcentered","","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","","questiondown","","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","","ring","cedilla","","hungarumlaut","ogonek","caron","emdash","","","","","","","","","","","","","","","","","AE","","ordfeminine","","","","","Lslash","Oslash","OE","ordmasculine","","","","","","ae","","","","dotlessi","","","lslash","oslash","oe","germandbls"],jE=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","space","exclamsmall","Hungarumlautsmall","","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","twodotenleader","onedotenleader","comma","hyphen","period","fraction","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","colon","semicolon","commasuperior","threequartersemdash","periodsuperior","questionsmall","","asuperior","bsuperior","centsuperior","dsuperior","esuperior","","","isuperior","","","lsuperior","msuperior","nsuperior","osuperior","","","rsuperior","ssuperior","tsuperior","","ff","fi","fl","ffi","ffl","parenleftinferior","","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","exclamdownsmall","centoldstyle","Lslashsmall","","","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","","Dotaccentsmall","","","Macronsmall","","","figuredash","hypheninferior","","","Ogoneksmall","Ringsmall","Cedillasmall","","","","onequarter","onehalf","threequarters","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","","","zerosuperior","onesuperior","twosuperior","threesuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall"],ln=[".notdef",".null","nonmarkingreturn","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quotesingle","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","grave","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","Adieresis","Aring","Ccedilla","Eacute","Ntilde","Odieresis","Udieresis","aacute","agrave","acircumflex","adieresis","atilde","aring","ccedilla","eacute","egrave","ecircumflex","edieresis","iacute","igrave","icircumflex","idieresis","ntilde","oacute","ograve","ocircumflex","odieresis","otilde","uacute","ugrave","ucircumflex","udieresis","dagger","degree","cent","sterling","section","bullet","paragraph","germandbls","registered","copyright","trademark","acute","dieresis","notequal","AE","Oslash","infinity","plusminus","lessequal","greaterequal","yen","mu","partialdiff","summation","product","pi","integral","ordfeminine","ordmasculine","Omega","ae","oslash","questiondown","exclamdown","logicalnot","radical","florin","approxequal","Delta","guillemotleft","guillemotright","ellipsis","nonbreakingspace","Agrave","Atilde","Otilde","OE","oe","endash","emdash","quotedblleft","quotedblright","quoteleft","quoteright","divide","lozenge","ydieresis","Ydieresis","fraction","currency","guilsinglleft","guilsinglright","fi","fl","daggerdbl","periodcentered","quotesinglbase","quotedblbase","perthousand","Acircumflex","Ecircumflex","Aacute","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Oacute","Ocircumflex","apple","Ograve","Uacute","Ucircumflex","Ugrave","dotlessi","circumflex","tilde","macron","breve","dotaccent","ring","cedilla","hungarumlaut","ogonek","caron","Lslash","lslash","Scaron","scaron","Zcaron","zcaron","brokenbar","Eth","eth","Yacute","yacute","Thorn","thorn","minus","multiply","onesuperior","twosuperior","threesuperior","onehalf","onequarter","threequarters","franc","Gbreve","gbreve","Idotaccent","Scedilla","scedilla","Cacute","cacute","Ccaron","ccaron","dcroat"];function uA(r){this.font=r}uA.prototype.charToGlyphIndex=function(r){var t=r.codePointAt(0),n=this.font.glyphs;if(n){for(var e=0;e<n.length;e+=1)for(var a=n.get(e),i=0;i<a.unicodes.length;i+=1)if(a.unicodes[i]===t)return e}return null};function RA(r){this.cmap=r}RA.prototype.charToGlyphIndex=function(r){return this.cmap.glyphIndexMap[r.codePointAt(0)]||0};function na(r,t){this.encoding=r,this.charset=t}na.prototype.charToGlyphIndex=function(r){var t=r.codePointAt(0),n=this.encoding[t];return this.charset.indexOf(n)};function J0(r){switch(r.version){case 1:this.names=ln.slice();break;case 2:this.names=new Array(r.numberOfGlyphs);for(var t=0;t<r.numberOfGlyphs;t++)r.glyphNameIndex[t]<ln.length?this.names[t]=ln[r.glyphNameIndex[t]]:this.names[t]=r.names[r.glyphNameIndex[t]-ln.length];break;case 2.5:this.names=new Array(r.numberOfGlyphs);for(var n=0;n<r.numberOfGlyphs;n++)this.names[n]=ln[n+r.glyphNameIndex[n]];break;case 3:this.names=[];break;default:this.names=[];break}}J0.prototype.nameToGlyphIndex=function(r){return this.names.indexOf(r)};J0.prototype.glyphIndexToName=function(r){return this.names[r]};function QE(r){for(var t,n=r.tables.cmap.glyphIndexMap,e=Object.keys(n),a=0;a<e.length;a+=1){var i=e[a],o=n[i];t=r.glyphs.get(o),t.addUnicode(parseInt(i))}for(var A=0;A<r.glyphs.length;A+=1)t=r.glyphs.get(A),r.cffEncoding?r.isCIDFont?t.name="gid"+A:t.name=r.cffEncoding.charset[A]:r.glyphNames.names&&(t.name=r.glyphNames.glyphIndexToName(A))}function qE(r){r._IndexToUnicodeMap={};for(var t=r.tables.cmap.glyphIndexMap,n=Object.keys(t),e=0;e<n.length;e+=1){var a=n[e],i=t[a];r._IndexToUnicodeMap[i]===void 0?r._IndexToUnicodeMap[i]={unicodes:[parseInt(a)]}:r._IndexToUnicodeMap[i].unicodes.push(parseInt(a))}}function $E(r,t){t.lowMemory?qE(r):QE(r)}function tl(r,t,n,e,a){r.beginPath(),r.moveTo(t,n),r.lineTo(e,a),r.stroke()}var An={line:tl};function rl(r,t){var n=t||new Bt;return{configurable:!0,get:function(){return typeof n=="function"&&(n=n()),n},set:function(e){n=e}}}function nr(r){this.bindConstructorValues(r)}nr.prototype.bindConstructorValues=function(r){this.index=r.index||0,this.name=r.name||null,this.unicode=r.unicode||void 0,this.unicodes=r.unicodes||r.unicode!==void 0?[r.unicode]:[],r.xMin&&(this.xMin=r.xMin),r.yMin&&(this.yMin=r.yMin),r.xMax&&(this.xMax=r.xMax),r.yMax&&(this.yMax=r.yMax),r.advanceWidth&&(this.advanceWidth=r.advanceWidth),Object.defineProperty(this,"path",rl(this,r.path))};nr.prototype.addUnicode=function(r){this.unicodes.length===0&&(this.unicode=r),this.unicodes.push(r)};nr.prototype.getBoundingBox=function(){return this.path.getBoundingBox()};nr.prototype.getPath=function(r,t,n,e,a){r=r!==void 0?r:0,t=t!==void 0?t:0,n=n!==void 0?n:72;var i,o;e||(e={});var A=e.xScale,x=e.yScale;if(e.hinting&&a&&a.hinting&&(o=this.path&&a.hinting.exec(this,n)),o)i=a.hinting.getCommands(o),r=Math.round(r),t=Math.round(t),A=x=1;else{i=this.path.commands;var E=1/(this.path.unitsPerEm||1e3)*n;A===void 0&&(A=E),x===void 0&&(x=E)}for(var l=new Bt,T=0;T<i.length;T+=1){var s=i[T];s.type==="M"?l.moveTo(r+s.x*A,t+-s.y*x):s.type==="L"?l.lineTo(r+s.x*A,t+-s.y*x):s.type==="Q"?l.quadraticCurveTo(r+s.x1*A,t+-s.y1*x,r+s.x*A,t+-s.y*x):s.type==="C"?l.curveTo(r+s.x1*A,t+-s.y1*x,r+s.x2*A,t+-s.y2*x,r+s.x*A,t+-s.y*x):s.type==="Z"&&l.closePath()}return l};nr.prototype.getContours=function(){if(this.points===void 0)return[];for(var r=[],t=[],n=0;n<this.points.length;n+=1){var e=this.points[n];t.push(e),e.lastPointOfContour&&(r.push(t),t=[])}return J.argument(t.length===0,"There are still points left in the current contour."),r};nr.prototype.getMetrics=function(){for(var r=this.path.commands,t=[],n=[],e=0;e<r.length;e+=1){var a=r[e];a.type!=="Z"&&(t.push(a.x),n.push(a.y)),(a.type==="Q"||a.type==="C")&&(t.push(a.x1),n.push(a.y1)),a.type==="C"&&(t.push(a.x2),n.push(a.y2))}var i={xMin:Math.min.apply(null,t),yMin:Math.min.apply(null,n),xMax:Math.max.apply(null,t),yMax:Math.max.apply(null,n),leftSideBearing:this.leftSideBearing};return isFinite(i.xMin)||(i.xMin=0),isFinite(i.xMax)||(i.xMax=this.advanceWidth),isFinite(i.yMin)||(i.yMin=0),isFinite(i.yMax)||(i.yMax=0),i.rightSideBearing=this.advanceWidth-i.leftSideBearing-(i.xMax-i.xMin),i};nr.prototype.draw=function(r,t,n,e,a){this.getPath(t,n,e,a).draw(r)};nr.prototype.drawPoints=function(r,t,n,e){function a(T,s,c,I){r.beginPath();for(var h=0;h<T.length;h+=1)r.moveTo(s+T[h].x*I,c+T[h].y*I),r.arc(s+T[h].x*I,c+T[h].y*I,2,0,Math.PI*2,!1);r.closePath(),r.fill()}t=t!==void 0?t:0,n=n!==void 0?n:0,e=e!==void 0?e:24;for(var i=1/this.path.unitsPerEm*e,o=[],A=[],x=this.path,E=0;E<x.commands.length;E+=1){var l=x.commands[E];l.x!==void 0&&o.push({x:l.x,y:-l.y}),l.x1!==void 0&&A.push({x:l.x1,y:-l.y1}),l.x2!==void 0&&A.push({x:l.x2,y:-l.y2})}r.fillStyle="blue",a(o,t,n,i),r.fillStyle="red",a(A,t,n,i)};nr.prototype.drawMetrics=function(r,t,n,e){var a;t=t!==void 0?t:0,n=n!==void 0?n:0,e=e!==void 0?e:24,a=1/this.path.unitsPerEm*e,r.lineWidth=1,r.strokeStyle="black",An.line(r,t,-1e4,t,1e4),An.line(r,-1e4,n,1e4,n);var i=this.xMin||0,o=this.yMin||0,A=this.xMax||0,x=this.yMax||0,E=this.advanceWidth||0;r.strokeStyle="blue",An.line(r,t+i*a,-1e4,t+i*a,1e4),An.line(r,t+A*a,-1e4,t+A*a,1e4),An.line(r,-1e4,n+-o*a,1e4,n+-o*a),An.line(r,-1e4,n+-x*a,1e4,n+-x*a),r.strokeStyle="green",An.line(r,t+E*a,-1e4,t+E*a,1e4)};function Pe(r,t,n){Object.defineProperty(r,t,{get:function(){return r.path,r[n]},set:function(e){r[n]=e},enumerable:!0,configurable:!0})}function _0(r,t){if(this.font=r,this.glyphs={},Array.isArray(t))for(var n=0;n<t.length;n++){var e=t[n];e.path.unitsPerEm=r.unitsPerEm,this.glyphs[n]=e}this.length=t&&t.length||0}_0.prototype.get=function(r){if(this.glyphs[r]===void 0){this.font._push(r),typeof this.glyphs[r]=="function"&&(this.glyphs[r]=this.glyphs[r]());var t=this.glyphs[r],n=this.font._IndexToUnicodeMap[r];if(n)for(var e=0;e<n.unicodes.length;e++)t.addUnicode(n.unicodes[e]);this.font.cffEncoding?this.font.isCIDFont?t.name="gid"+r:t.name=this.font.cffEncoding.charset[r]:this.font.glyphNames.names&&(t.name=this.font.glyphNames.glyphIndexToName(r)),this.glyphs[r].advanceWidth=this.font._hmtxTableData[r].advanceWidth,this.glyphs[r].leftSideBearing=this.font._hmtxTableData[r].leftSideBearing}else typeof this.glyphs[r]=="function"&&(this.glyphs[r]=this.glyphs[r]());return this.glyphs[r]};_0.prototype.push=function(r,t){this.glyphs[r]=t,this.length++};function nl(r,t){return new nr({index:t,font:r})}function el(r,t,n,e,a,i){return function(){var o=new nr({index:t,font:r});return o.path=function(){n(o,e,a);var A=i(r.glyphs,o);return A.unitsPerEm=r.unitsPerEm,A},Pe(o,"xMin","_xMin"),Pe(o,"xMax","_xMax"),Pe(o,"yMin","_yMin"),Pe(o,"yMax","_yMax"),o}}function al(r,t,n,e){return function(){var a=new nr({index:t,font:r});return a.path=function(){var i=n(r,a,e);return i.unitsPerEm=r.unitsPerEm,i},a}}var Dr={GlyphSet:_0,glyphLoader:nl,ttfGlyphLoader:el,cffGlyphLoader:al};function gA(r,t){if(r===t)return!0;if(Array.isArray(r)&&Array.isArray(t)){if(r.length!==t.length)return!1;for(var n=0;n<r.length;n+=1)if(!gA(r[n],t[n]))return!1;return!0}else return!1}function h0(r){var t;return r.length<1240?t=107:r.length<33900?t=1131:t=32768,t}function Jr(r,t,n){var e=[],a=[],i=P.getCard16(r,t),o,A;if(i!==0){var x=P.getByte(r,t+2);o=t+(i+1)*x+2;for(var E=t+3,l=0;l<i+1;l+=1)e.push(P.getOffset(r,E,x)),E+=x;A=o+e[i]}else A=t+2;for(var T=0;T<e.length-1;T+=1){var s=P.getBytes(r,o+e[T],o+e[T+1]);n&&(s=n(s)),a.push(s)}return{objects:a,startOffset:t,endOffset:A}}function il(r,t){var n=[],e=P.getCard16(r,t),a,i;if(e!==0){var o=P.getByte(r,t+2);a=t+(e+1)*o+2;for(var A=t+3,x=0;x<e+1;x+=1)n.push(P.getOffset(r,A,o)),A+=o;i=a+n[e]}else i=t+2;return{offsets:n,startOffset:t,endOffset:i}}function ol(r,t,n,e,a){var i=P.getCard16(n,e),o=0;if(i!==0){var A=P.getByte(n,e+2);o=e+(i+1)*A+2}var x=P.getBytes(n,o+t[r],o+t[r+1]);return a&&(x=a(x)),x}function Al(r){for(var t="",n=15,e=["0","1","2","3","4","5","6","7","8","9",".","E","E-",null,"-"];;){var a=r.parseByte(),i=a>>4,o=a&15;if(i===n||(t+=e[i],o===n))break;t+=e[o]}return parseFloat(t)}function xl(r,t){var n,e,a,i;if(t===28)return n=r.parseByte(),e=r.parseByte(),n<<8|e;if(t===29)return n=r.parseByte(),e=r.parseByte(),a=r.parseByte(),i=r.parseByte(),n<<24|e<<16|a<<8|i;if(t===30)return Al(r);if(t>=32&&t<=246)return t-139;if(t>=247&&t<=250)return n=r.parseByte(),(t-247)*256+n+108;if(t>=251&&t<=254)return n=r.parseByte(),-(t-251)*256-n-108;throw new Error("Invalid b0 "+t)}function El(r){for(var t={},n=0;n<r.length;n+=1){var e=r[n][0],a=r[n][1],i=void 0;if(a.length===1?i=a[0]:i=a,t.hasOwnProperty(e)&&!isNaN(t[e]))throw new Error("Object "+t+" already has key "+e);t[e]=i}return t}function yA(r,t,n){t=t!==void 0?t:0;var e=new P.Parser(r,t),a=[],i=[];for(n=n!==void 0?n:r.length;e.relativeOffset<n;){var o=e.parseByte();o<=21?(o===12&&(o=1200+e.parseByte()),a.push([o,i]),i=[]):i.push(xl(e,o))}return El(a)}function Zn(r,t){return t<=390?t=ke[t]:t=r[t-391],t}function NA(r,t,n){for(var e={},a,i=0;i<t.length;i+=1){var o=t[i];if(Array.isArray(o.type)){var A=[];A.length=o.type.length;for(var x=0;x<o.type.length;x++)a=r[o.op]!==void 0?r[o.op][x]:void 0,a===void 0&&(a=o.value!==void 0&&o.value[x]!==void 0?o.value[x]:null),o.type[x]==="SID"&&(a=Zn(n,a)),A[x]=a;e[o.name]=A}else a=r[o.op],a===void 0&&(a=o.value!==void 0?o.value:null),o.type==="SID"&&(a=Zn(n,a)),e[o.name]=a}return e}function ll(r,t){var n={};return n.formatMajor=P.getCard8(r,t),n.formatMinor=P.getCard8(r,t+1),n.size=P.getCard8(r,t+2),n.offsetSize=P.getCard8(r,t+3),n.startOffset=t,n.endOffset=t+4,n}var DA=[{name:"version",op:0,type:"SID"},{name:"notice",op:1,type:"SID"},{name:"copyright",op:1200,type:"SID"},{name:"fullName",op:2,type:"SID"},{name:"familyName",op:3,type:"SID"},{name:"weight",op:4,type:"SID"},{name:"isFixedPitch",op:1201,type:"number",value:0},{name:"italicAngle",op:1202,type:"number",value:0},{name:"underlinePosition",op:1203,type:"number",value:-100},{name:"underlineThickness",op:1204,type:"number",value:50},{name:"paintType",op:1205,type:"number",value:0},{name:"charstringType",op:1206,type:"number",value:2},{name:"fontMatrix",op:1207,type:["real","real","real","real","real","real"],value:[.001,0,0,.001,0,0]},{name:"uniqueId",op:13,type:"number"},{name:"fontBBox",op:5,type:["number","number","number","number"],value:[0,0,0,0]},{name:"strokeWidth",op:1208,type:"number",value:0},{name:"xuid",op:14,type:[],value:null},{name:"charset",op:15,type:"offset",value:0},{name:"encoding",op:16,type:"offset",value:0},{name:"charStrings",op:17,type:"offset",value:0},{name:"private",op:18,type:["number","offset"],value:[0,0]},{name:"ros",op:1230,type:["SID","SID","number"]},{name:"cidFontVersion",op:1231,type:"number",value:0},{name:"cidFontRevision",op:1232,type:"number",value:0},{name:"cidFontType",op:1233,type:"number",value:0},{name:"cidCount",op:1234,type:"number",value:8720},{name:"uidBase",op:1235,type:"number"},{name:"fdArray",op:1236,type:"offset"},{name:"fdSelect",op:1237,type:"offset"},{name:"fontName",op:1238,type:"SID"}],OA=[{name:"subrs",op:19,type:"offset",value:0},{name:"defaultWidthX",op:20,type:"number",value:0},{name:"nominalWidthX",op:21,type:"number",value:0}];function sl(r,t){var n=yA(r,0,r.byteLength);return NA(n,DA,t)}function mA(r,t,n,e){var a=yA(r,t,n);return NA(a,OA,e)}function Fi(r,t,n,e){for(var a=[],i=0;i<n.length;i+=1){var o=new DataView(new Uint8Array(n[i]).buffer),A=sl(o,e);A._subrs=[],A._subrsBias=0;var x=A.private[0],E=A.private[1];if(x!==0&&E!==0){var l=mA(r,E+t,x,e);if(A._defaultWidthX=l.defaultWidthX,A._nominalWidthX=l.nominalWidthX,l.subrs!==0){var T=E+l.subrs,s=Jr(r,T+t);A._subrs=s.objects,A._subrsBias=h0(A._subrs)}A._privateDict=l}a.push(A)}return a}function Ll(r,t,n,e){var a,i,o=new P.Parser(r,t);n-=1;var A=[".notdef"],x=o.parseCard8();if(x===0)for(var E=0;E<n;E+=1)a=o.parseSID(),A.push(Zn(e,a));else if(x===1)for(;A.length<=n;){a=o.parseSID(),i=o.parseCard8();for(var l=0;l<=i;l+=1)A.push(Zn(e,a)),a+=1}else if(x===2)for(;A.length<=n;){a=o.parseSID(),i=o.parseCard16();for(var T=0;T<=i;T+=1)A.push(Zn(e,a)),a+=1}else throw new Error("Unknown charset format "+x);return A}function Tl(r,t,n){var e,a={},i=new P.Parser(r,t),o=i.parseCard8();if(o===0)for(var A=i.parseCard8(),x=0;x<A;x+=1)e=i.parseCard8(),a[e]=x;else if(o===1){var E=i.parseCard8();e=1;for(var l=0;l<E;l+=1)for(var T=i.parseCard8(),s=i.parseCard8(),c=T;c<=T+s;c+=1)a[c]=e,e+=1}else throw new Error("Unknown encoding format "+o);return new na(a,n)}function fi(r,t,n){var e,a,i,o,A=new Bt,x=[],E=0,l=!1,T=!1,s=0,c=0,I,h,S,p;if(r.isCIDFont){var u=r.tables.cff.topDict._fdSelect[t.index],D=r.tables.cff.topDict._fdArray[u];I=D._subrs,h=D._subrsBias,S=D._defaultWidthX,p=D._nominalWidthX}else I=r.tables.cff.topDict._subrs,h=r.tables.cff.topDict._subrsBias,S=r.tables.cff.topDict._defaultWidthX,p=r.tables.cff.topDict._nominalWidthX;var M=S;function f(v,k){T&&A.closePath(),A.moveTo(v,k),T=!0}function O(){var v;v=x.length%2!==0,v&&!l&&(M=x.shift()+p),E+=x.length>>1,x.length=0,l=!0}function g(v){for(var k,z,X,st,vt,gt,et,yt,It,Ct,Ht,qt,Nt=0;Nt<v.length;){var kt=v[Nt];switch(Nt+=1,kt){case 1:O();break;case 3:O();break;case 4:x.length>1&&!l&&(M=x.shift()+p,l=!0),c+=x.pop(),f(s,c);break;case 5:for(;x.length>0;)s+=x.shift(),c+=x.shift(),A.lineTo(s,c);break;case 6:for(;x.length>0&&(s+=x.shift(),A.lineTo(s,c),x.length!==0);)c+=x.shift(),A.lineTo(s,c);break;case 7:for(;x.length>0&&(c+=x.shift(),A.lineTo(s,c),x.length!==0);)s+=x.shift(),A.lineTo(s,c);break;case 8:for(;x.length>0;)e=s+x.shift(),a=c+x.shift(),i=e+x.shift(),o=a+x.shift(),s=i+x.shift(),c=o+x.shift(),A.curveTo(e,a,i,o,s,c);break;case 10:vt=x.pop()+h,gt=I[vt],gt&&g(gt);break;case 11:return;case 12:switch(kt=v[Nt],Nt+=1,kt){case 35:e=s+x.shift(),a=c+x.shift(),i=e+x.shift(),o=a+x.shift(),et=i+x.shift(),yt=o+x.shift(),It=et+x.shift(),Ct=yt+x.shift(),Ht=It+x.shift(),qt=Ct+x.shift(),s=Ht+x.shift(),c=qt+x.shift(),x.shift(),A.curveTo(e,a,i,o,et,yt),A.curveTo(It,Ct,Ht,qt,s,c);break;case 34:e=s+x.shift(),a=c,i=e+x.shift(),o=a+x.shift(),et=i+x.shift(),yt=o,It=et+x.shift(),Ct=o,Ht=It+x.shift(),qt=c,s=Ht+x.shift(),A.curveTo(e,a,i,o,et,yt),A.curveTo(It,Ct,Ht,qt,s,c);break;case 36:e=s+x.shift(),a=c+x.shift(),i=e+x.shift(),o=a+x.shift(),et=i+x.shift(),yt=o,It=et+x.shift(),Ct=o,Ht=It+x.shift(),qt=Ct+x.shift(),s=Ht+x.shift(),A.curveTo(e,a,i,o,et,yt),A.curveTo(It,Ct,Ht,qt,s,c);break;case 37:e=s+x.shift(),a=c+x.shift(),i=e+x.shift(),o=a+x.shift(),et=i+x.shift(),yt=o+x.shift(),It=et+x.shift(),Ct=yt+x.shift(),Ht=It+x.shift(),qt=Ct+x.shift(),Math.abs(Ht-s)>Math.abs(qt-c)?s=Ht+x.shift():c=qt+x.shift(),A.curveTo(e,a,i,o,et,yt),A.curveTo(It,Ct,Ht,qt,s,c);break;default:console.log("Glyph "+t.index+": unknown operator 1200"+kt),x.length=0}break;case 14:x.length>0&&!l&&(M=x.shift()+p,l=!0),T&&(A.closePath(),T=!1);break;case 18:O();break;case 19:case 20:O(),Nt+=E+7>>3;break;case 21:x.length>2&&!l&&(M=x.shift()+p,l=!0),c+=x.pop(),s+=x.pop(),f(s,c);break;case 22:x.length>1&&!l&&(M=x.shift()+p,l=!0),s+=x.pop(),f(s,c);break;case 23:O();break;case 24:for(;x.length>2;)e=s+x.shift(),a=c+x.shift(),i=e+x.shift(),o=a+x.shift(),s=i+x.shift(),c=o+x.shift(),A.curveTo(e,a,i,o,s,c);s+=x.shift(),c+=x.shift(),A.lineTo(s,c);break;case 25:for(;x.length>6;)s+=x.shift(),c+=x.shift(),A.lineTo(s,c);e=s+x.shift(),a=c+x.shift(),i=e+x.shift(),o=a+x.shift(),s=i+x.shift(),c=o+x.shift(),A.curveTo(e,a,i,o,s,c);break;case 26:for(x.length%2&&(s+=x.shift());x.length>0;)e=s,a=c+x.shift(),i=e+x.shift(),o=a+x.shift(),s=i,c=o+x.shift(),A.curveTo(e,a,i,o,s,c);break;case 27:for(x.length%2&&(c+=x.shift());x.length>0;)e=s+x.shift(),a=c,i=e+x.shift(),o=a+x.shift(),s=i+x.shift(),c=o,A.curveTo(e,a,i,o,s,c);break;case 28:k=v[Nt],z=v[Nt+1],x.push((k<<24|z<<16)>>16),Nt+=2;break;case 29:vt=x.pop()+r.gsubrsBias,gt=r.gsubrs[vt],gt&&g(gt);break;case 30:for(;x.length>0&&(e=s,a=c+x.shift(),i=e+x.shift(),o=a+x.shift(),s=i+x.shift(),c=o+(x.length===1?x.shift():0),A.curveTo(e,a,i,o,s,c),x.length!==0);)e=s+x.shift(),a=c,i=e+x.shift(),o=a+x.shift(),c=o+x.shift(),s=i+(x.length===1?x.shift():0),A.curveTo(e,a,i,o,s,c);break;case 31:for(;x.length>0&&(e=s+x.shift(),a=c,i=e+x.shift(),o=a+x.shift(),c=o+x.shift(),s=i+(x.length===1?x.shift():0),A.curveTo(e,a,i,o,s,c),x.length!==0);)e=s,a=c+x.shift(),i=e+x.shift(),o=a+x.shift(),s=i+x.shift(),c=o+(x.length===1?x.shift():0),A.curveTo(e,a,i,o,s,c);break;default:kt<32?console.log("Glyph "+t.index+": unknown operator "+kt):kt<247?x.push(kt-139):kt<251?(k=v[Nt],Nt+=1,x.push((kt-247)*256+k+108)):kt<255?(k=v[Nt],Nt+=1,x.push(-(kt-251)*256-k-108)):(k=v[Nt],z=v[Nt+1],X=v[Nt+2],st=v[Nt+3],Nt+=4,x.push((k<<24|z<<16|X<<8|st)/65536))}}}return g(n),t.advanceWidth=M,A}function cl(r,t,n,e){var a=[],i,o=new P.Parser(r,t),A=o.parseCard8();if(A===0)for(var x=0;x<n;x++){if(i=o.parseCard8(),i>=e)throw new Error("CFF table CID Font FDSelect has bad FD index value "+i+" (FD count "+e+")");a.push(i)}else if(A===3){var E=o.parseCard16(),l=o.parseCard16();if(l!==0)throw new Error("CFF Table CID Font FDSelect format 3 range has bad initial GID "+l);for(var T,s=0;s<E;s++){if(i=o.parseCard8(),T=o.parseCard16(),i>=e)throw new Error("CFF table CID Font FDSelect has bad FD index value "+i+" (FD count "+e+")");if(T>n)throw new Error("CFF Table CID Font FDSelect format 3 range has bad GID "+T);for(;l<T;l++)a.push(i);l=T}if(T!==n)throw new Error("CFF Table CID Font FDSelect format 3 range has bad final GID "+T)}else throw new Error("CFF Table CID Font FDSelect table has unsupported format "+A);return a}function Il(r,t,n,e){n.tables.cff={};var a=ll(r,t),i=Jr(r,a.endOffset,P.bytesToString),o=Jr(r,i.endOffset),A=Jr(r,o.endOffset,P.bytesToString),x=Jr(r,A.endOffset);n.gsubrs=x.objects,n.gsubrsBias=h0(n.gsubrs);var E=Fi(r,t,o.objects,A.objects);if(E.length!==1)throw new Error("CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = "+E.length);var l=E[0];if(n.tables.cff.topDict=l,l._privateDict&&(n.defaultWidthX=l._privateDict.defaultWidthX,n.nominalWidthX=l._privateDict.nominalWidthX),l.ros[0]!==void 0&&l.ros[1]!==void 0&&(n.isCIDFont=!0),n.isCIDFont){var T=l.fdArray,s=l.fdSelect;if(T===0||s===0)throw new Error("Font is marked as a CID font, but FDArray and/or FDSelect information is missing");T+=t;var c=Jr(r,T),I=Fi(r,t,c.objects,A.objects);l._fdArray=I,s+=t,l._fdSelect=cl(r,s,n.numGlyphs,I.length)}var h=t+l.private[1],S=mA(r,h,l.private[0],A.objects);if(n.defaultWidthX=S.defaultWidthX,n.nominalWidthX=S.nominalWidthX,S.subrs!==0){var p=h+S.subrs,u=Jr(r,p);n.subrs=u.objects,n.subrsBias=h0(n.subrs)}else n.subrs=[],n.subrsBias=0;var D;e.lowMemory?(D=il(r,t+l.charStrings),n.nGlyphs=D.offsets.length):(D=Jr(r,t+l.charStrings),n.nGlyphs=D.objects.length);var M=Ll(r,t+l.charset,n.nGlyphs,A.objects);if(l.encoding===0?n.cffEncoding=new na(XE,M):l.encoding===1?n.cffEncoding=new na(jE,M):n.cffEncoding=Tl(r,t+l.encoding,M),n.encoding=n.encoding||n.cffEncoding,n.glyphs=new Dr.GlyphSet(n),e.lowMemory)n._push=function(g){var v=ol(g,D.offsets,r,t+l.charStrings);n.glyphs.push(g,Dr.cffGlyphLoader(n,g,fi,v))};else for(var f=0;f<n.nGlyphs;f+=1){var O=D.objects[f];n.glyphs.push(f,Dr.cffGlyphLoader(n,f,fi,O))}}function BA(r,t){var n,e=ke.indexOf(r);return e>=0&&(n=e),e=t.indexOf(r),e>=0?n=e+ke.length:(n=ke.length+t.length,t.push(r)),n}function hl(){return new Y.Record("Header",[{name:"major",type:"Card8",value:1},{name:"minor",type:"Card8",value:0},{name:"hdrSize",type:"Card8",value:4},{name:"major",type:"Card8",value:1}])}function dl(r){var t=new Y.Record("Name INDEX",[{name:"names",type:"INDEX",value:[]}]);t.names=[];for(var n=0;n<r.length;n+=1)t.names.push({name:"name_"+n,type:"NAME",value:r[n]});return t}function HA(r,t,n){for(var e={},a=0;a<r.length;a+=1){var i=r[a],o=t[i.name];o!==void 0&&!gA(o,i.value)&&(i.type==="SID"&&(o=BA(o,n)),e[i.op]={name:i.name,type:i.type,value:o})}return e}function Mi(r,t){var n=new Y.Record("Top DICT",[{name:"dict",type:"DICT",value:{}}]);return n.dict=HA(DA,r,t),n}function Gi(r){var t=new Y.Record("Top DICT INDEX",[{name:"topDicts",type:"INDEX",value:[]}]);return t.topDicts=[{name:"topDict_0",type:"TABLE",value:r}],t}function Sl(r){var t=new Y.Record("String INDEX",[{name:"strings",type:"INDEX",value:[]}]);t.strings=[];for(var n=0;n<r.length;n+=1)t.strings.push({name:"string_"+n,type:"STRING",value:r[n]});return t}function pl(){return new Y.Record("Global Subr INDEX",[{name:"subrs",type:"INDEX",value:[]}])}function Cl(r,t){for(var n=new Y.Record("Charsets",[{name:"format",type:"Card8",value:0}]),e=0;e<r.length;e+=1){var a=r[e],i=BA(a,t);n.fields.push({name:"glyph_"+e,type:"SID",value:i})}return n}function ul(r){var t=[],n=r.path;t.push({name:"width",type:"NUMBER",value:r.advanceWidth});for(var e=0,a=0,i=0;i<n.commands.length;i+=1){var o=void 0,A=void 0,x=n.commands[i];if(x.type==="Q"){var E=.3333333333333333,l=2/3;x={type:"C",x:x.x,y:x.y,x1:E*e+l*x.x1,y1:E*a+l*x.y1,x2:E*x.x+l*x.x1,y2:E*x.y+l*x.y1}}if(x.type==="M")o=Math.round(x.x-e),A=Math.round(x.y-a),t.push({name:"dx",type:"NUMBER",value:o}),t.push({name:"dy",type:"NUMBER",value:A}),t.push({name:"rmoveto",type:"OP",value:21}),e=Math.round(x.x),a=Math.round(x.y);else if(x.type==="L")o=Math.round(x.x-e),A=Math.round(x.y-a),t.push({name:"dx",type:"NUMBER",value:o}),t.push({name:"dy",type:"NUMBER",value:A}),t.push({name:"rlineto",type:"OP",value:5}),e=Math.round(x.x),a=Math.round(x.y);else if(x.type==="C"){var T=Math.round(x.x1-e),s=Math.round(x.y1-a),c=Math.round(x.x2-x.x1),I=Math.round(x.y2-x.y1);o=Math.round(x.x-x.x2),A=Math.round(x.y-x.y2),t.push({name:"dx1",type:"NUMBER",value:T}),t.push({name:"dy1",type:"NUMBER",value:s}),t.push({name:"dx2",type:"NUMBER",value:c}),t.push({name:"dy2",type:"NUMBER",value:I}),t.push({name:"dx",type:"NUMBER",value:o}),t.push({name:"dy",type:"NUMBER",value:A}),t.push({name:"rrcurveto",type:"OP",value:8}),e=Math.round(x.x),a=Math.round(x.y)}}return t.push({name:"endchar",type:"OP",value:14}),t}function Rl(r){for(var t=new Y.Record("CharStrings INDEX",[{name:"charStrings",type:"INDEX",value:[]}]),n=0;n<r.length;n+=1){var e=r.get(n),a=ul(e);t.charStrings.push({name:e.name,type:"CHARSTRING",value:a})}return t}function gl(r,t){var n=new Y.Record("Private DICT",[{name:"dict",type:"DICT",value:{}}]);return n.dict=HA(OA,r,t),n}function yl(r,t){for(var n=new Y.Table("CFF ",[{name:"header",type:"RECORD"},{name:"nameIndex",type:"RECORD"},{name:"topDictIndex",type:"RECORD"},{name:"stringIndex",type:"RECORD"},{name:"globalSubrIndex",type:"RECORD"},{name:"charsets",type:"RECORD"},{name:"charStringsIndex",type:"RECORD"},{name:"privateDict",type:"RECORD"}]),e=1/t.unitsPerEm,a={version:t.version,fullName:t.fullName,familyName:t.familyName,weight:t.weightName,fontBBox:t.fontBBox||[0,0,0,0],fontMatrix:[e,0,0,e,0,0],charset:999,encoding:0,charStrings:999,private:[0,999]},i={},o=[],A,x=1;x<r.length;x+=1)A=r.get(x),o.push(A.name);var E=[];n.header=hl(),n.nameIndex=dl([t.postScriptName]);var l=Mi(a,E);n.topDictIndex=Gi(l),n.globalSubrIndex=pl(),n.charsets=Cl(o,E),n.charStringsIndex=Rl(r),n.privateDict=gl(i,E),n.stringIndex=Sl(E);var T=n.header.sizeOf()+n.nameIndex.sizeOf()+n.topDictIndex.sizeOf()+n.stringIndex.sizeOf()+n.globalSubrIndex.sizeOf();return a.charset=T,a.encoding=0,a.charStrings=a.charset+n.charsets.sizeOf(),a.private[1]=a.charStrings+n.charStringsIndex.sizeOf(),l=Mi(a,E),n.topDictIndex=Gi(l),n}var FA={parse:Il,make:yl};function Nl(r,t){var n={},e=new P.Parser(r,t);return n.version=e.parseVersion(),n.fontRevision=Math.round(e.parseFixed()*1e3)/1e3,n.checkSumAdjustment=e.parseULong(),n.magicNumber=e.parseULong(),J.argument(n.magicNumber===1594834165,"Font header has wrong magic number."),n.flags=e.parseUShort(),n.unitsPerEm=e.parseUShort(),n.created=e.parseLongDateTime(),n.modified=e.parseLongDateTime(),n.xMin=e.parseShort(),n.yMin=e.parseShort(),n.xMax=e.parseShort(),n.yMax=e.parseShort(),n.macStyle=e.parseUShort(),n.lowestRecPPEM=e.parseUShort(),n.fontDirectionHint=e.parseShort(),n.indexToLocFormat=e.parseShort(),n.glyphDataFormat=e.parseShort(),n}function Dl(r){var t=Math.round(new Date().getTime()/1e3)+2082844800,n=t;return r.createdTimestamp&&(n=r.createdTimestamp+2082844800),new Y.Table("head",[{name:"version",type:"FIXED",value:65536},{name:"fontRevision",type:"FIXED",value:65536},{name:"checkSumAdjustment",type:"ULONG",value:0},{name:"magicNumber",type:"ULONG",value:1594834165},{name:"flags",type:"USHORT",value:0},{name:"unitsPerEm",type:"USHORT",value:1e3},{name:"created",type:"LONGDATETIME",value:n},{name:"modified",type:"LONGDATETIME",value:t},{name:"xMin",type:"SHORT",value:0},{name:"yMin",type:"SHORT",value:0},{name:"xMax",type:"SHORT",value:0},{name:"yMax",type:"SHORT",value:0},{name:"macStyle",type:"USHORT",value:r.macStyle},{name:"lowestRecPPEM",type:"USHORT",value:0},{name:"fontDirectionHint",type:"SHORT",value:2},{name:"indexToLocFormat",type:"SHORT",value:0},{name:"glyphDataFormat",type:"SHORT",value:0}],r)}var fA={parse:Nl,make:Dl};function Ol(r,t){var n={},e=new P.Parser(r,t);return n.version=e.parseVersion(),n.ascender=e.parseShort(),n.descender=e.parseShort(),n.lineGap=e.parseShort(),n.advanceWidthMax=e.parseUShort(),n.minLeftSideBearing=e.parseShort(),n.minRightSideBearing=e.parseShort(),n.xMaxExtent=e.parseShort(),n.caretSlopeRise=e.parseShort(),n.caretSlopeRun=e.parseShort(),n.caretOffset=e.parseShort(),e.relativeOffset+=8,n.metricDataFormat=e.parseShort(),n.numberOfHMetrics=e.parseUShort(),n}function ml(r){return new Y.Table("hhea",[{name:"version",type:"FIXED",value:65536},{name:"ascender",type:"FWORD",value:0},{name:"descender",type:"FWORD",value:0},{name:"lineGap",type:"FWORD",value:0},{name:"advanceWidthMax",type:"UFWORD",value:0},{name:"minLeftSideBearing",type:"FWORD",value:0},{name:"minRightSideBearing",type:"FWORD",value:0},{name:"xMaxExtent",type:"FWORD",value:0},{name:"caretSlopeRise",type:"SHORT",value:1},{name:"caretSlopeRun",type:"SHORT",value:0},{name:"caretOffset",type:"SHORT",value:0},{name:"reserved1",type:"SHORT",value:0},{name:"reserved2",type:"SHORT",value:0},{name:"reserved3",type:"SHORT",value:0},{name:"reserved4",type:"SHORT",value:0},{name:"metricDataFormat",type:"SHORT",value:0},{name:"numberOfHMetrics",type:"USHORT",value:0}],r)}var MA={parse:Ol,make:ml};function Bl(r,t,n,e,a){for(var i,o,A=new P.Parser(r,t),x=0;x<e;x+=1){x<n&&(i=A.parseUShort(),o=A.parseShort());var E=a.get(x);E.advanceWidth=i,E.leftSideBearing=o}}function Hl(r,t,n,e,a){r._hmtxTableData={};for(var i,o,A=new P.Parser(t,n),x=0;x<a;x+=1)x<e&&(i=A.parseUShort(),o=A.parseShort()),r._hmtxTableData[x]={advanceWidth:i,leftSideBearing:o}}function Fl(r,t,n,e,a,i,o){o.lowMemory?Hl(r,t,n,e,a):Bl(t,n,e,a,i)}function fl(r){for(var t=new Y.Table("hmtx",[]),n=0;n<r.length;n+=1){var e=r.get(n),a=e.advanceWidth||0,i=e.leftSideBearing||0;t.fields.push({name:"advanceWidth_"+n,type:"USHORT",value:a}),t.fields.push({name:"leftSideBearing_"+n,type:"SHORT",value:i})}return t}var GA={parse:Fl,make:fl};function Ml(r){for(var t=new Y.Table("ltag",[{name:"version",type:"ULONG",value:1},{name:"flags",type:"ULONG",value:0},{name:"numTags",type:"ULONG",value:r.length}]),n="",e=12+r.length*4,a=0;a<r.length;++a){var i=n.indexOf(r[a]);i<0&&(i=n.length,n+=r[a]),t.fields.push({name:"offset "+a,type:"USHORT",value:e+i}),t.fields.push({name:"length "+a,type:"USHORT",value:r[a].length})}return t.fields.push({name:"stringPool",type:"CHARARRAY",value:n}),t}function Gl(r,t){var n=new P.Parser(r,t),e=n.parseULong();J.argument(e===1,"Unsupported ltag table version."),n.skip("uLong",1);for(var a=n.parseULong(),i=[],o=0;o<a;o++){for(var A="",x=t+n.parseUShort(),E=n.parseUShort(),l=x;l<x+E;++l)A+=String.fromCharCode(r.getInt8(l));i.push(A)}return i}var PA={make:Ml,parse:Gl};function Pl(r,t){var n={},e=new P.Parser(r,t);return n.version=e.parseVersion(),n.numGlyphs=e.parseUShort(),n.version===1&&(n.maxPoints=e.parseUShort(),n.maxContours=e.parseUShort(),n.maxCompositePoints=e.parseUShort(),n.maxCompositeContours=e.parseUShort(),n.maxZones=e.parseUShort(),n.maxTwilightPoints=e.parseUShort(),n.maxStorage=e.parseUShort(),n.maxFunctionDefs=e.parseUShort(),n.maxInstructionDefs=e.parseUShort(),n.maxStackElements=e.parseUShort(),n.maxSizeOfInstructions=e.parseUShort(),n.maxComponentElements=e.parseUShort(),n.maxComponentDepth=e.parseUShort()),n}function bl(r){return new Y.Table("maxp",[{name:"version",type:"FIXED",value:20480},{name:"numGlyphs",type:"USHORT",value:r}])}var bA={parse:Pl,make:bl},UA=["copyright","fontFamily","fontSubfamily","uniqueID","fullName","version","postScriptName","trademark","manufacturer","designer","description","manufacturerURL","designerURL","license","licenseURL","reserved","preferredFamily","preferredSubfamily","compatibleFullName","sampleText","postScriptFindFontName","wwsFamily","wwsSubfamily"],YA={0:"en",1:"fr",2:"de",3:"it",4:"nl",5:"sv",6:"es",7:"da",8:"pt",9:"no",10:"he",11:"ja",12:"ar",13:"fi",14:"el",15:"is",16:"mt",17:"tr",18:"hr",19:"zh-Hant",20:"ur",21:"hi",22:"th",23:"ko",24:"lt",25:"pl",26:"hu",27:"es",28:"lv",29:"se",30:"fo",31:"fa",32:"ru",33:"zh",34:"nl-BE",35:"ga",36:"sq",37:"ro",38:"cz",39:"sk",40:"si",41:"yi",42:"sr",43:"mk",44:"bg",45:"uk",46:"be",47:"uz",48:"kk",49:"az-Cyrl",50:"az-Arab",51:"hy",52:"ka",53:"mo",54:"ky",55:"tg",56:"tk",57:"mn-CN",58:"mn",59:"ps",60:"ks",61:"ku",62:"sd",63:"bo",64:"ne",65:"sa",66:"mr",67:"bn",68:"as",69:"gu",70:"pa",71:"or",72:"ml",73:"kn",74:"ta",75:"te",76:"si",77:"my",78:"km",79:"lo",80:"vi",81:"id",82:"tl",83:"ms",84:"ms-Arab",85:"am",86:"ti",87:"om",88:"so",89:"sw",90:"rw",91:"rn",92:"ny",93:"mg",94:"eo",128:"cy",129:"eu",130:"ca",131:"la",132:"qu",133:"gn",134:"ay",135:"tt",136:"ug",137:"dz",138:"jv",139:"su",140:"gl",141:"af",142:"br",143:"iu",144:"gd",145:"gv",146:"ga",147:"to",148:"el-polyton",149:"kl",150:"az",151:"nn"},Ul={0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:5,11:1,12:4,13:0,14:6,15:0,16:0,17:0,18:0,19:2,20:4,21:9,22:21,23:3,24:29,25:29,26:29,27:29,28:29,29:0,30:0,31:4,32:7,33:25,34:0,35:0,36:0,37:0,38:29,39:29,40:0,41:5,42:7,43:7,44:7,45:7,46:7,47:7,48:7,49:7,50:4,51:24,52:23,53:7,54:7,55:7,56:7,57:27,58:7,59:4,60:4,61:4,62:4,63:26,64:9,65:9,66:9,67:13,68:13,69:11,70:10,71:12,72:17,73:16,74:14,75:15,76:18,77:19,78:20,79:22,80:30,81:0,82:0,83:0,84:4,85:28,86:28,87:28,88:0,89:0,90:0,91:0,92:0,93:0,94:0,128:0,129:0,130:0,131:0,132:0,133:0,134:0,135:7,136:4,137:26,138:0,139:0,140:0,141:0,142:0,143:28,144:0,145:0,146:0,147:0,148:6,149:0,150:0,151:0},vA={1078:"af",1052:"sq",1156:"gsw",1118:"am",5121:"ar-DZ",15361:"ar-BH",3073:"ar",2049:"ar-IQ",11265:"ar-JO",13313:"ar-KW",12289:"ar-LB",4097:"ar-LY",6145:"ary",8193:"ar-OM",16385:"ar-QA",1025:"ar-SA",10241:"ar-SY",7169:"aeb",14337:"ar-AE",9217:"ar-YE",1067:"hy",1101:"as",2092:"az-Cyrl",1068:"az",1133:"ba",1069:"eu",1059:"be",2117:"bn",1093:"bn-IN",8218:"bs-Cyrl",5146:"bs",1150:"br",1026:"bg",1027:"ca",3076:"zh-HK",5124:"zh-MO",2052:"zh",4100:"zh-SG",1028:"zh-TW",1155:"co",1050:"hr",4122:"hr-BA",1029:"cs",1030:"da",1164:"prs",1125:"dv",2067:"nl-BE",1043:"nl",3081:"en-AU",10249:"en-BZ",4105:"en-CA",9225:"en-029",16393:"en-IN",6153:"en-IE",8201:"en-JM",17417:"en-MY",5129:"en-NZ",13321:"en-PH",18441:"en-SG",7177:"en-ZA",11273:"en-TT",2057:"en-GB",1033:"en",12297:"en-ZW",1061:"et",1080:"fo",1124:"fil",1035:"fi",2060:"fr-BE",3084:"fr-CA",1036:"fr",5132:"fr-LU",6156:"fr-MC",4108:"fr-CH",1122:"fy",1110:"gl",1079:"ka",3079:"de-AT",1031:"de",5127:"de-LI",4103:"de-LU",2055:"de-CH",1032:"el",1135:"kl",1095:"gu",1128:"ha",1037:"he",1081:"hi",1038:"hu",1039:"is",1136:"ig",1057:"id",1117:"iu",2141:"iu-Latn",2108:"ga",1076:"xh",1077:"zu",1040:"it",2064:"it-CH",1041:"ja",1099:"kn",1087:"kk",1107:"km",1158:"quc",1159:"rw",1089:"sw",1111:"kok",1042:"ko",1088:"ky",1108:"lo",1062:"lv",1063:"lt",2094:"dsb",1134:"lb",1071:"mk",2110:"ms-BN",1086:"ms",1100:"ml",1082:"mt",1153:"mi",1146:"arn",1102:"mr",1148:"moh",1104:"mn",2128:"mn-CN",1121:"ne",1044:"nb",2068:"nn",1154:"oc",1096:"or",1123:"ps",1045:"pl",1046:"pt",2070:"pt-PT",1094:"pa",1131:"qu-BO",2155:"qu-EC",3179:"qu",1048:"ro",1047:"rm",1049:"ru",9275:"smn",4155:"smj-NO",5179:"smj",3131:"se-FI",1083:"se",2107:"se-SE",8251:"sms",6203:"sma-NO",7227:"sms",1103:"sa",7194:"sr-Cyrl-BA",3098:"sr",6170:"sr-Latn-BA",2074:"sr-Latn",1132:"nso",1074:"tn",1115:"si",1051:"sk",1060:"sl",11274:"es-AR",16394:"es-BO",13322:"es-CL",9226:"es-CO",5130:"es-CR",7178:"es-DO",12298:"es-EC",17418:"es-SV",4106:"es-GT",18442:"es-HN",2058:"es-MX",19466:"es-NI",6154:"es-PA",15370:"es-PY",10250:"es-PE",20490:"es-PR",3082:"es",1034:"es",21514:"es-US",14346:"es-UY",8202:"es-VE",2077:"sv-FI",1053:"sv",1114:"syr",1064:"tg",2143:"tzm",1097:"ta",1092:"tt",1098:"te",1054:"th",1105:"bo",1055:"tr",1090:"tk",1152:"ug",1058:"uk",1070:"hsb",1056:"ur",2115:"uz-Cyrl",1091:"uz",1066:"vi",1106:"cy",1160:"wo",1157:"sah",1144:"ii",1130:"yo"};function Yl(r,t,n){switch(r){case 0:if(t===65535)return"und";if(n)return n[t];break;case 1:return YA[t];case 3:return vA[t]}}var d0="utf-16",vl={0:"macintosh",1:"x-mac-japanese",2:"x-mac-chinesetrad",3:"x-mac-korean",6:"x-mac-greek",7:"x-mac-cyrillic",9:"x-mac-devanagai",10:"x-mac-gurmukhi",11:"x-mac-gujarati",12:"x-mac-oriya",13:"x-mac-bengali",14:"x-mac-tamil",15:"x-mac-telugu",16:"x-mac-kannada",17:"x-mac-malayalam",18:"x-mac-sinhalese",19:"x-mac-burmese",20:"x-mac-khmer",21:"x-mac-thai",22:"x-mac-lao",23:"x-mac-georgian",24:"x-mac-armenian",25:"x-mac-chinesesimp",26:"x-mac-tibetan",27:"x-mac-mongolian",28:"x-mac-ethiopic",29:"x-mac-ce",30:"x-mac-vietnamese",31:"x-mac-extarabic"},wl={15:"x-mac-icelandic",17:"x-mac-turkish",18:"x-mac-croatian",24:"x-mac-ce",25:"x-mac-ce",26:"x-mac-ce",27:"x-mac-ce",28:"x-mac-ce",30:"x-mac-icelandic",37:"x-mac-romanian",38:"x-mac-ce",39:"x-mac-ce",40:"x-mac-ce",143:"x-mac-inuit",146:"x-mac-gaelic"};function wA(r,t,n){switch(r){case 0:return d0;case 1:return wl[n]||vl[t];case 3:if(t===1||t===10)return d0;break}}function Wl(r,t,n){for(var e={},a=new P.Parser(r,t),i=a.parseUShort(),o=a.parseUShort(),A=a.offset+a.parseUShort(),x=0;x<o;x++){var E=a.parseUShort(),l=a.parseUShort(),T=a.parseUShort(),s=a.parseUShort(),c=UA[s]||s,I=a.parseUShort(),h=a.parseUShort(),S=Yl(E,T,n),p=wA(E,l,T);if(p!==void 0&&S!==void 0){var u=void 0;if(p===d0?u=Fn.UTF16(r,A+h,I):u=Fn.MACSTRING(r,A+h,I,p),u){var D=e[c];D===void 0&&(D=e[c]={}),D[S]=u}}}return i===1&&a.parseUShort(),e}function ba(r){var t={};for(var n in r)t[r[n]]=parseInt(n);return t}function Pi(r,t,n,e,a,i){return new Y.Record("NameRecord",[{name:"platformID",type:"USHORT",value:r},{name:"encodingID",type:"USHORT",value:t},{name:"languageID",type:"USHORT",value:n},{name:"nameID",type:"USHORT",value:e},{name:"length",type:"USHORT",value:a},{name:"offset",type:"USHORT",value:i}])}function kl(r,t){var n=r.length,e=t.length-n+1;t:for(var a=0;a<e;a++)for(;a<e;a++){for(var i=0;i<n;i++)if(t[a+i]!==r[i])continue t;return a}return-1}function bi(r,t){var n=kl(r,t);if(n<0){n=t.length;for(var e=0,a=r.length;e<a;++e)t.push(r[e])}return n}function Kl(r,t){var n,e=[],a={},i=ba(UA);for(var o in r){var A=i[o];if(A===void 0&&(A=o),n=parseInt(A),isNaN(n))throw new Error('Name table entry "'+o+'" does not exist, see nameTableNames for complete list.');a[n]=r[o],e.push(n)}for(var x=ba(YA),E=ba(vA),l=[],T=[],s=0;s<e.length;s++){n=e[s];var c=a[n];for(var I in c){var h=c[I],S=1,p=x[I],u=Ul[p],D=wA(S,u,p),M=H.MACSTRING(h,D);M===void 0&&(S=0,p=t.indexOf(I),p<0&&(p=t.length,t.push(I)),u=4,M=H.UTF16(h));var f=bi(M,T);l.push(Pi(S,u,p,n,M.length,f));var O=E[I];if(O!==void 0){var g=H.UTF16(h),v=bi(g,T);l.push(Pi(3,1,O,n,g.length,v))}}}l.sort(function(X,st){return X.platformID-st.platformID||X.encodingID-st.encodingID||X.languageID-st.languageID||X.nameID-st.nameID});for(var k=new Y.Table("name",[{name:"format",type:"USHORT",value:0},{name:"count",type:"USHORT",value:l.length},{name:"stringOffset",type:"USHORT",value:6+l.length*12}]),z=0;z<l.length;z++)k.fields.push({name:"record_"+z,type:"RECORD",value:l[z]});return k.fields.push({name:"strings",type:"LITERAL",value:T}),k}var WA={parse:Wl,make:Kl},S0=[{begin:0,end:127},{begin:128,end:255},{begin:256,end:383},{begin:384,end:591},{begin:592,end:687},{begin:688,end:767},{begin:768,end:879},{begin:880,end:1023},{begin:11392,end:11519},{begin:1024,end:1279},{begin:1328,end:1423},{begin:1424,end:1535},{begin:42240,end:42559},{begin:1536,end:1791},{begin:1984,end:2047},{begin:2304,end:2431},{begin:2432,end:2559},{begin:2560,end:2687},{begin:2688,end:2815},{begin:2816,end:2943},{begin:2944,end:3071},{begin:3072,end:3199},{begin:3200,end:3327},{begin:3328,end:3455},{begin:3584,end:3711},{begin:3712,end:3839},{begin:4256,end:4351},{begin:6912,end:7039},{begin:4352,end:4607},{begin:7680,end:7935},{begin:7936,end:8191},{begin:8192,end:8303},{begin:8304,end:8351},{begin:8352,end:8399},{begin:8400,end:8447},{begin:8448,end:8527},{begin:8528,end:8591},{begin:8592,end:8703},{begin:8704,end:8959},{begin:8960,end:9215},{begin:9216,end:9279},{begin:9280,end:9311},{begin:9312,end:9471},{begin:9472,end:9599},{begin:9600,end:9631},{begin:9632,end:9727},{begin:9728,end:9983},{begin:9984,end:10175},{begin:12288,end:12351},{begin:12352,end:12447},{begin:12448,end:12543},{begin:12544,end:12591},{begin:12592,end:12687},{begin:43072,end:43135},{begin:12800,end:13055},{begin:13056,end:13311},{begin:44032,end:55215},{begin:55296,end:57343},{begin:67840,end:67871},{begin:19968,end:40959},{begin:57344,end:63743},{begin:12736,end:12783},{begin:64256,end:64335},{begin:64336,end:65023},{begin:65056,end:65071},{begin:65040,end:65055},{begin:65104,end:65135},{begin:65136,end:65279},{begin:65280,end:65519},{begin:65520,end:65535},{begin:3840,end:4095},{begin:1792,end:1871},{begin:1920,end:1983},{begin:3456,end:3583},{begin:4096,end:4255},{begin:4608,end:4991},{begin:5024,end:5119},{begin:5120,end:5759},{begin:5760,end:5791},{begin:5792,end:5887},{begin:6016,end:6143},{begin:6144,end:6319},{begin:10240,end:10495},{begin:40960,end:42127},{begin:5888,end:5919},{begin:66304,end:66351},{begin:66352,end:66383},{begin:66560,end:66639},{begin:118784,end:119039},{begin:119808,end:120831},{begin:1044480,end:1048573},{begin:65024,end:65039},{begin:917504,end:917631},{begin:6400,end:6479},{begin:6480,end:6527},{begin:6528,end:6623},{begin:6656,end:6687},{begin:11264,end:11359},{begin:11568,end:11647},{begin:19904,end:19967},{begin:43008,end:43055},{begin:65536,end:65663},{begin:65856,end:65935},{begin:66432,end:66463},{begin:66464,end:66527},{begin:66640,end:66687},{begin:66688,end:66735},{begin:67584,end:67647},{begin:68096,end:68191},{begin:119552,end:119647},{begin:73728,end:74751},{begin:119648,end:119679},{begin:7040,end:7103},{begin:7168,end:7247},{begin:7248,end:7295},{begin:43136,end:43231},{begin:43264,end:43311},{begin:43312,end:43359},{begin:43520,end:43615},{begin:65936,end:65999},{begin:66e3,end:66047},{begin:66208,end:66271},{begin:127024,end:127135}];function Vl(r){for(var t=0;t<S0.length;t+=1){var n=S0[t];if(r>=n.begin&&r<n.end)return t}return-1}function Jl(r,t){var n={},e=new P.Parser(r,t);n.version=e.parseUShort(),n.xAvgCharWidth=e.parseShort(),n.usWeightClass=e.parseUShort(),n.usWidthClass=e.parseUShort(),n.fsType=e.parseUShort(),n.ySubscriptXSize=e.parseShort(),n.ySubscriptYSize=e.parseShort(),n.ySubscriptXOffset=e.parseShort(),n.ySubscriptYOffset=e.parseShort(),n.ySuperscriptXSize=e.parseShort(),n.ySuperscriptYSize=e.parseShort(),n.ySuperscriptXOffset=e.parseShort(),n.ySuperscriptYOffset=e.parseShort(),n.yStrikeoutSize=e.parseShort(),n.yStrikeoutPosition=e.parseShort(),n.sFamilyClass=e.parseShort(),n.panose=[];for(var a=0;a<10;a++)n.panose[a]=e.parseByte();return n.ulUnicodeRange1=e.parseULong(),n.ulUnicodeRange2=e.parseULong(),n.ulUnicodeRange3=e.parseULong(),n.ulUnicodeRange4=e.parseULong(),n.achVendID=String.fromCharCode(e.parseByte(),e.parseByte(),e.parseByte(),e.parseByte()),n.fsSelection=e.parseUShort(),n.usFirstCharIndex=e.parseUShort(),n.usLastCharIndex=e.parseUShort(),n.sTypoAscender=e.parseShort(),n.sTypoDescender=e.parseShort(),n.sTypoLineGap=e.parseShort(),n.usWinAscent=e.parseUShort(),n.usWinDescent=e.parseUShort(),n.version>=1&&(n.ulCodePageRange1=e.parseULong(),n.ulCodePageRange2=e.parseULong()),n.version>=2&&(n.sxHeight=e.parseShort(),n.sCapHeight=e.parseShort(),n.usDefaultChar=e.parseUShort(),n.usBreakChar=e.parseUShort(),n.usMaxContent=e.parseUShort()),n}function _l(r){return new Y.Table("OS/2",[{name:"version",type:"USHORT",value:3},{name:"xAvgCharWidth",type:"SHORT",value:0},{name:"usWeightClass",type:"USHORT",value:0},{name:"usWidthClass",type:"USHORT",value:0},{name:"fsType",type:"USHORT",value:0},{name:"ySubscriptXSize",type:"SHORT",value:650},{name:"ySubscriptYSize",type:"SHORT",value:699},{name:"ySubscriptXOffset",type:"SHORT",value:0},{name:"ySubscriptYOffset",type:"SHORT",value:140},{name:"ySuperscriptXSize",type:"SHORT",value:650},{name:"ySuperscriptYSize",type:"SHORT",value:699},{name:"ySuperscriptXOffset",type:"SHORT",value:0},{name:"ySuperscriptYOffset",type:"SHORT",value:479},{name:"yStrikeoutSize",type:"SHORT",value:49},{name:"yStrikeoutPosition",type:"SHORT",value:258},{name:"sFamilyClass",type:"SHORT",value:0},{name:"bFamilyType",type:"BYTE",value:0},{name:"bSerifStyle",type:"BYTE",value:0},{name:"bWeight",type:"BYTE",value:0},{name:"bProportion",type:"BYTE",value:0},{name:"bContrast",type:"BYTE",value:0},{name:"bStrokeVariation",type:"BYTE",value:0},{name:"bArmStyle",type:"BYTE",value:0},{name:"bLetterform",type:"BYTE",value:0},{name:"bMidline",type:"BYTE",value:0},{name:"bXHeight",type:"BYTE",value:0},{name:"ulUnicodeRange1",type:"ULONG",value:0},{name:"ulUnicodeRange2",type:"ULONG",value:0},{name:"ulUnicodeRange3",type:"ULONG",value:0},{name:"ulUnicodeRange4",type:"ULONG",value:0},{name:"achVendID",type:"CHARARRAY",value:"XXXX"},{name:"fsSelection",type:"USHORT",value:0},{name:"usFirstCharIndex",type:"USHORT",value:0},{name:"usLastCharIndex",type:"USHORT",value:0},{name:"sTypoAscender",type:"SHORT",value:0},{name:"sTypoDescender",type:"SHORT",value:0},{name:"sTypoLineGap",type:"SHORT",value:0},{name:"usWinAscent",type:"USHORT",value:0},{name:"usWinDescent",type:"USHORT",value:0},{name:"ulCodePageRange1",type:"ULONG",value:0},{name:"ulCodePageRange2",type:"ULONG",value:0},{name:"sxHeight",type:"SHORT",value:0},{name:"sCapHeight",type:"SHORT",value:0},{name:"usDefaultChar",type:"USHORT",value:0},{name:"usBreakChar",type:"USHORT",value:0},{name:"usMaxContext",type:"USHORT",value:0}],r)}var p0={parse:Jl,make:_l,unicodeRanges:S0,getUnicodeRange:Vl};function Zl(r,t){var n={},e=new P.Parser(r,t);switch(n.version=e.parseVersion(),n.italicAngle=e.parseFixed(),n.underlinePosition=e.parseShort(),n.underlineThickness=e.parseShort(),n.isFixedPitch=e.parseULong(),n.minMemType42=e.parseULong(),n.maxMemType42=e.parseULong(),n.minMemType1=e.parseULong(),n.maxMemType1=e.parseULong(),n.version){case 1:n.names=ln.slice();break;case 2:n.numberOfGlyphs=e.parseUShort(),n.glyphNameIndex=new Array(n.numberOfGlyphs);for(var a=0;a<n.numberOfGlyphs;a++)n.glyphNameIndex[a]=e.parseUShort();n.names=[];for(var i=0;i<n.numberOfGlyphs;i++)if(n.glyphNameIndex[i]>=ln.length){var o=e.parseChar();n.names.push(e.parseString(o))}break;case 2.5:n.numberOfGlyphs=e.parseUShort(),n.offset=new Array(n.numberOfGlyphs);for(var A=0;A<n.numberOfGlyphs;A++)n.offset[A]=e.parseChar();break}return n}function zl(r){return new Y.Table("post",[{name:"version",type:"FIXED",value:196608},{name:"italicAngle",type:"FIXED",value:Math.round(r.italicAngle*65536)},{name:"underlinePosition",type:"FWORD",value:0},{name:"underlineThickness",type:"FWORD",value:0},{name:"isFixedPitch",type:"ULONG",value:0},{name:"minMemType42",type:"ULONG",value:0},{name:"maxMemType42",type:"ULONG",value:0},{name:"minMemType1",type:"ULONG",value:0},{name:"maxMemType1",type:"ULONG",value:0}])}var kA={parse:Zl,make:zl},sr=new Array(9);sr[1]=function(){var t=this.offset+this.relativeOffset,n=this.parseUShort();if(n===1)return{substFormat:1,coverage:this.parsePointer(C.coverage),deltaGlyphId:this.parseUShort()};if(n===2)return{substFormat:2,coverage:this.parsePointer(C.coverage),substitute:this.parseOffset16List()};J.assert(!1,"0x"+t.toString(16)+": lookup type 1 format must be 1 or 2.")};sr[2]=function(){var t=this.parseUShort();return J.argument(t===1,"GSUB Multiple Substitution Subtable identifier-format must be 1"),{substFormat:t,coverage:this.parsePointer(C.coverage),sequences:this.parseListOfLists()}};sr[3]=function(){var t=this.parseUShort();return J.argument(t===1,"GSUB Alternate Substitution Subtable identifier-format must be 1"),{substFormat:t,coverage:this.parsePointer(C.coverage),alternateSets:this.parseListOfLists()}};sr[4]=function(){var t=this.parseUShort();return J.argument(t===1,"GSUB ligature table identifier-format must be 1"),{substFormat:t,coverage:this.parsePointer(C.coverage),ligatureSets:this.parseListOfLists(function(){return{ligGlyph:this.parseUShort(),components:this.parseUShortList(this.parseUShort()-1)}})}};var Dn={sequenceIndex:C.uShort,lookupListIndex:C.uShort};sr[5]=function(){var t=this.offset+this.relativeOffset,n=this.parseUShort();if(n===1)return{substFormat:n,coverage:this.parsePointer(C.coverage),ruleSets:this.parseListOfLists(function(){var i=this.parseUShort(),o=this.parseUShort();return{input:this.parseUShortList(i-1),lookupRecords:this.parseRecordList(o,Dn)}})};if(n===2)return{substFormat:n,coverage:this.parsePointer(C.coverage),classDef:this.parsePointer(C.classDef),classSets:this.parseListOfLists(function(){var i=this.parseUShort(),o=this.parseUShort();return{classes:this.parseUShortList(i-1),lookupRecords:this.parseRecordList(o,Dn)}})};if(n===3){var e=this.parseUShort(),a=this.parseUShort();return{substFormat:n,coverages:this.parseList(e,C.pointer(C.coverage)),lookupRecords:this.parseRecordList(a,Dn)}}J.assert(!1,"0x"+t.toString(16)+": lookup type 5 format must be 1, 2 or 3.")};sr[6]=function(){var t=this.offset+this.relativeOffset,n=this.parseUShort();if(n===1)return{substFormat:1,coverage:this.parsePointer(C.coverage),chainRuleSets:this.parseListOfLists(function(){return{backtrack:this.parseUShortList(),input:this.parseUShortList(this.parseShort()-1),lookahead:this.parseUShortList(),lookupRecords:this.parseRecordList(Dn)}})};if(n===2)return{substFormat:2,coverage:this.parsePointer(C.coverage),backtrackClassDef:this.parsePointer(C.classDef),inputClassDef:this.parsePointer(C.classDef),lookaheadClassDef:this.parsePointer(C.classDef),chainClassSet:this.parseListOfLists(function(){return{backtrack:this.parseUShortList(),input:this.parseUShortList(this.parseShort()-1),lookahead:this.parseUShortList(),lookupRecords:this.parseRecordList(Dn)}})};if(n===3)return{substFormat:3,backtrackCoverage:this.parseList(C.pointer(C.coverage)),inputCoverage:this.parseList(C.pointer(C.coverage)),lookaheadCoverage:this.parseList(C.pointer(C.coverage)),lookupRecords:this.parseRecordList(Dn)};J.assert(!1,"0x"+t.toString(16)+": lookup type 6 format must be 1, 2 or 3.")};sr[7]=function(){var t=this.parseUShort();J.argument(t===1,"GSUB Extension Substitution subtable identifier-format must be 1");var n=this.parseUShort(),e=new C(this.data,this.offset+this.parseULong());return{substFormat:1,lookupType:n,extension:sr[n].call(e)}};sr[8]=function(){var t=this.parseUShort();return J.argument(t===1,"GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1"),{substFormat:t,coverage:this.parsePointer(C.coverage),backtrackCoverage:this.parseList(C.pointer(C.coverage)),lookaheadCoverage:this.parseList(C.pointer(C.coverage)),substitutes:this.parseUShortList()}};function Xl(r,t){t=t||0;var n=new C(r,t),e=n.parseVersion(1);return J.argument(e===1||e===1.1,"Unsupported GSUB table version."),e===1?{version:e,scripts:n.parseScriptList(),features:n.parseFeatureList(),lookups:n.parseLookupList(sr)}:{version:e,scripts:n.parseScriptList(),features:n.parseFeatureList(),lookups:n.parseLookupList(sr),variations:n.parseFeatureVariationsList()}}var Ca=new Array(9);Ca[1]=function(t){return t.substFormat===1?new Y.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new Y.Coverage(t.coverage)},{name:"deltaGlyphID",type:"USHORT",value:t.deltaGlyphId}]):new Y.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:2},{name:"coverage",type:"TABLE",value:new Y.Coverage(t.coverage)}].concat(Y.ushortList("substitute",t.substitute)))};Ca[3]=function(t){return J.assert(t.substFormat===1,"Lookup type 3 substFormat must be 1."),new Y.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new Y.Coverage(t.coverage)}].concat(Y.tableList("altSet",t.alternateSets,function(n){return new Y.Table("alternateSetTable",Y.ushortList("alternate",n))})))};Ca[4]=function(t){return J.assert(t.substFormat===1,"Lookup type 4 substFormat must be 1."),new Y.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new Y.Coverage(t.coverage)}].concat(Y.tableList("ligSet",t.ligatureSets,function(n){return new Y.Table("ligatureSetTable",Y.tableList("ligature",n,function(e){return new Y.Table("ligatureTable",[{name:"ligGlyph",type:"USHORT",value:e.ligGlyph}].concat(Y.ushortList("component",e.components,e.components.length+1)))}))})))};function jl(r){return new Y.Table("GSUB",[{name:"version",type:"ULONG",value:65536},{name:"scripts",type:"TABLE",value:new Y.ScriptList(r.scripts)},{name:"features",type:"TABLE",value:new Y.FeatureList(r.features)},{name:"lookups",type:"TABLE",value:new Y.LookupList(r.lookups,Ca)}])}var KA={parse:Xl,make:jl};function Ql(r,t){var n=new P.Parser(r,t),e=n.parseULong();J.argument(e===1,"Unsupported META table version."),n.parseULong(),n.parseULong();for(var a=n.parseULong(),i={},o=0;o<a;o++){var A=n.parseTag(),x=n.parseULong(),E=n.parseULong(),l=Fn.UTF8(r,t+x,E);i[A]=l}return i}function ql(r){var t=Object.keys(r).length,n="",e=16+t*12,a=new Y.Table("meta",[{name:"version",type:"ULONG",value:1},{name:"flags",type:"ULONG",value:0},{name:"offset",type:"ULONG",value:e},{name:"numTags",type:"ULONG",value:t}]);for(var i in r){var o=n.length;n+=r[i],a.fields.push({name:"tag "+i,type:"TAG",value:i}),a.fields.push({name:"offset "+i,type:"ULONG",value:e+o}),a.fields.push({name:"length "+i,type:"ULONG",value:r[i].length})}return a.fields.push({name:"stringPool",type:"CHARARRAY",value:n}),a}var VA={parse:Ql,make:ql};function Ui(r){return Math.log(r)/Math.log(2)|0}function Z0(r){for(;r.length%4!==0;)r.push(0);for(var t=0,n=0;n<r.length;n+=4)t+=(r[n]<<24)+(r[n+1]<<16)+(r[n+2]<<8)+r[n+3];return t%=Math.pow(2,32),t}function Yi(r,t,n,e){return new Y.Record("Table Record",[{name:"tag",type:"TAG",value:r!==void 0?r:""},{name:"checkSum",type:"ULONG",value:t!==void 0?t:0},{name:"offset",type:"ULONG",value:n!==void 0?n:0},{name:"length",type:"ULONG",value:e!==void 0?e:0}])}function JA(r){var t=new Y.Table("sfnt",[{name:"version",type:"TAG",value:"OTTO"},{name:"numTables",type:"USHORT",value:0},{name:"searchRange",type:"USHORT",value:0},{name:"entrySelector",type:"USHORT",value:0},{name:"rangeShift",type:"USHORT",value:0}]);t.tables=r,t.numTables=r.length;var n=Math.pow(2,Ui(t.numTables));t.searchRange=16*n,t.entrySelector=Ui(n),t.rangeShift=t.numTables*16-t.searchRange;for(var e=[],a=[],i=t.sizeOf()+Yi().sizeOf()*t.numTables;i%4!==0;)i+=1,a.push({name:"padding",type:"BYTE",value:0});for(var o=0;o<r.length;o+=1){var A=r[o];J.argument(A.tableName.length===4,"Table name"+A.tableName+" is invalid.");var x=A.sizeOf(),E=Yi(A.tableName,Z0(A.encode()),i,x);for(e.push({name:E.tag+" Table Record",type:"RECORD",value:E}),a.push({name:A.tableName+" table",type:"RECORD",value:A}),i+=x,J.argument(!isNaN(i),"Something went wrong calculating the offset.");i%4!==0;)i+=1,a.push({name:"padding",type:"BYTE",value:0})}return e.sort(function(l,T){return l.value.tag>T.value.tag?1:-1}),t.fields=t.fields.concat(e),t.fields=t.fields.concat(a),t}function vi(r,t,n){for(var e=0;e<t.length;e+=1){var a=r.charToGlyphIndex(t[e]);if(a>0){var i=r.glyphs.get(a);return i.getMetrics()}}return n}function $l(r){for(var t=0,n=0;n<r.length;n+=1)t+=r[n];return t/r.length}function ts(r){for(var t=[],n=[],e=[],a=[],i=[],o=[],A=[],x,E=0,l=0,T=0,s=0,c=0,I=0;I<r.glyphs.length;I+=1){var h=r.glyphs.get(I),S=h.unicode|0;if(isNaN(h.advanceWidth))throw new Error("Glyph "+h.name+" ("+I+"): advanceWidth is not a number.");(x>S||x===void 0)&&S>0&&(x=S),E<S&&(E=S);var p=p0.getUnicodeRange(S);if(p<32)l|=1<<p;else if(p<64)T|=1<<p-32;else if(p<96)s|=1<<p-64;else if(p<123)c|=1<<p-96;else throw new Error("Unicode ranges bits > 123 are reserved for internal usage");if(h.name!==".notdef"){var u=h.getMetrics();t.push(u.xMin),n.push(u.yMin),e.push(u.xMax),a.push(u.yMax),o.push(u.leftSideBearing),A.push(u.rightSideBearing),i.push(h.advanceWidth)}}var D={xMin:Math.min.apply(null,t),yMin:Math.min.apply(null,n),xMax:Math.max.apply(null,e),yMax:Math.max.apply(null,a),advanceWidthMax:Math.max.apply(null,i),advanceWidthAvg:$l(i),minLeftSideBearing:Math.min.apply(null,o),maxLeftSideBearing:Math.max.apply(null,o),minRightSideBearing:Math.min.apply(null,A)};D.ascender=r.ascender,D.descender=r.descender;var M=0;r.italicAngle<0&&(M|=2),r.weightClass>=600&&(M|=1);var f=fA.make({flags:3,unitsPerEm:r.unitsPerEm,xMin:D.xMin,yMin:D.yMin,xMax:D.xMax,yMax:D.yMax,lowestRecPPEM:3,macStyle:M,createdTimestamp:r.createdTimestamp}),O=MA.make({ascender:D.ascender,descender:D.descender,advanceWidthMax:D.advanceWidthMax,minLeftSideBearing:D.minLeftSideBearing,minRightSideBearing:D.minRightSideBearing,xMaxExtent:D.maxLeftSideBearing+(D.xMax-D.xMin),numberOfHMetrics:r.glyphs.length,slope:r.slope}),g=bA.make(r.glyphs.length),v=p0.make(Object.assign({xAvgCharWidth:Math.round(D.advanceWidthAvg),usFirstCharIndex:x,usLastCharIndex:E,ulUnicodeRange1:l,ulUnicodeRange2:T,ulUnicodeRange3:s,ulUnicodeRange4:c,sTypoAscender:D.ascender,sTypoDescender:D.descender,sTypoLineGap:0,usWinAscent:D.yMax,usWinDescent:Math.abs(D.yMin),ulCodePageRange1:1,sxHeight:vi(r,"xyvw",{yMax:Math.round(D.ascender/2)}).yMax,sCapHeight:vi(r,"HIKLEFJMNTZBDPRAGOQSUVWXY",D).yMax,usDefaultChar:r.hasChar(" ")?32:0,usBreakChar:r.hasChar(" ")?32:0},r.tables.os2)),k=GA.make(r.glyphs),z=CA.make(r.glyphs),X=r.getEnglishName("fontFamily"),st=r.getEnglishName("fontSubfamily"),vt=X+" "+st,gt=r.getEnglishName("postScriptName");gt||(gt=X.replace(/\s/g,"")+"-"+st);var et={};for(var yt in r.names)et[yt]=r.names[yt];et.uniqueID||(et.uniqueID={en:r.getEnglishName("manufacturer")+":"+vt}),et.postScriptName||(et.postScriptName={en:gt}),et.preferredFamily||(et.preferredFamily=r.names.fontFamily),et.preferredSubfamily||(et.preferredSubfamily=r.names.fontSubfamily);var It=[],Ct=WA.make(et,It),Ht=It.length>0?PA.make(It):void 0,qt=kA.make(r),Nt=FA.make(r.glyphs,{version:r.getEnglishName("version"),fullName:vt,familyName:X,weightName:st,postScriptName:gt,unitsPerEm:r.unitsPerEm,fontBBox:[0,D.yMin,D.ascender,D.advanceWidthMax]}),kt=r.metas&&Object.keys(r.metas).length>0?VA.make(r.metas):void 0,Be=[f,O,g,v,Ct,z,qt,Nt,k];Ht&&Be.push(Ht),r.tables.gsub&&Be.push(KA.make(r.tables.gsub)),kt&&Be.push(kt);for(var fa=JA(Be),gx=fa.encode(),yx=Z0(gx),Ma=fa.fields,hi=!1,He=0;He<Ma.length;He+=1)if(Ma[He].name==="head table"){Ma[He].value.checkSumAdjustment=2981146554-yx,hi=!0;break}if(!hi)throw new Error("Could not find head table with checkSum to adjust.");return fa}var rs={make:JA,fontToTable:ts,computeCheckSum:Z0};function Ua(r,t){for(var n=0,e=r.length-1;n<=e;){var a=n+e>>>1,i=r[a].tag;if(i===t)return a;i<t?n=a+1:e=a-1}return-n-1}function wi(r,t){for(var n=0,e=r.length-1;n<=e;){var a=n+e>>>1,i=r[a];if(i===t)return a;i<t?n=a+1:e=a-1}return-n-1}function Wi(r,t){for(var n,e=0,a=r.length-1;e<=a;){var i=e+a>>>1;n=r[i];var o=n.start;if(o===t)return n;o<t?e=i+1:a=i-1}if(e>0)return n=r[e-1],t>n.end?0:n}function de(r,t){this.font=r,this.tableName=t}de.prototype={searchTag:Ua,binSearch:wi,getTable:function(r){var t=this.font.tables[this.tableName];return!t&&r&&(t=this.font.tables[this.tableName]=this.createDefaultTable()),t},getScriptNames:function(){var r=this.getTable();return r?r.scripts.map(function(t){return t.tag}):[]},getDefaultScriptName:function(){var r=this.getTable();if(r){for(var t=!1,n=0;n<r.scripts.length;n++){var e=r.scripts[n].tag;if(e==="DFLT")return e;e==="latn"&&(t=!0)}if(t)return"latn"}},getScriptTable:function(r,t){var n=this.getTable(t);if(n){r=r||"DFLT";var e=n.scripts,a=Ua(n.scripts,r);if(a>=0)return e[a].script;if(t){var i={tag:r,script:{defaultLangSys:{reserved:0,reqFeatureIndex:65535,featureIndexes:[]},langSysRecords:[]}};return e.splice(-1-a,0,i),i.script}}},getLangSysTable:function(r,t,n){var e=this.getScriptTable(r,n);if(e){if(!t||t==="dflt"||t==="DFLT")return e.defaultLangSys;var a=Ua(e.langSysRecords,t);if(a>=0)return e.langSysRecords[a].langSys;if(n){var i={tag:t,langSys:{reserved:0,reqFeatureIndex:65535,featureIndexes:[]}};return e.langSysRecords.splice(-1-a,0,i),i.langSys}}},getFeatureTable:function(r,t,n,e){var a=this.getLangSysTable(r,t,e);if(a){for(var i,o=a.featureIndexes,A=this.font.tables[this.tableName].features,x=0;x<o.length;x++)if(i=A[o[x]],i.tag===n)return i.feature;if(e){var E=A.length;return J.assert(E===0||n>=A[E-1].tag,"Features must be added in alphabetical order."),i={tag:n,feature:{params:0,lookupListIndexes:[]}},A.push(i),o.push(E),i.feature}}},getLookupTables:function(r,t,n,e,a){var i=this.getFeatureTable(r,t,n,a),o=[];if(i){for(var A,x=i.lookupListIndexes,E=this.font.tables[this.tableName].lookups,l=0;l<x.length;l++)A=E[x[l]],A.lookupType===e&&o.push(A);if(o.length===0&&a){A={lookupType:e,lookupFlag:0,subtables:[],markFilteringSet:void 0};var T=E.length;return E.push(A),x.push(T),[A]}}return o},getGlyphClass:function(r,t){switch(r.format){case 1:return r.startGlyph<=t&&t<r.startGlyph+r.classes.length?r.classes[t-r.startGlyph]:0;case 2:var n=Wi(r.ranges,t);return n?n.classId:0}},getCoverageIndex:function(r,t){switch(r.format){case 1:var n=wi(r.glyphs,t);return n>=0?n:-1;case 2:var e=Wi(r.ranges,t);return e?e.index+t-e.start:-1}},expandCoverage:function(r){if(r.format===1)return r.glyphs;for(var t=[],n=r.ranges,e=0;e<n.length;e++)for(var a=n[e],i=a.start,o=a.end,A=i;A<=o;A++)t.push(A);return t}};function Se(r){de.call(this,r,"gpos")}Se.prototype=de.prototype;Se.prototype.init=function(){var r=this.getDefaultScriptName();this.defaultKerningTables=this.getKerningTables(r)};Se.prototype.getKerningValue=function(r,t,n){for(var e=0;e<r.length;e++)for(var a=r[e].subtables,i=0;i<a.length;i++){var o=a[i],A=this.getCoverageIndex(o.coverage,t);if(!(A<0))switch(o.posFormat){case 1:for(var x=o.pairSets[A],E=0;E<x.length;E++){var l=x[E];if(l.secondGlyph===n)return l.value1&&l.value1.xAdvance||0}break;case 2:var T=this.getGlyphClass(o.classDef1,t),s=this.getGlyphClass(o.classDef2,n),c=o.classRecords[T][s];return c.value1&&c.value1.xAdvance||0}}return 0};Se.prototype.getKerningTables=function(r,t){if(this.font.tables.gpos)return this.getLookupTables(r,t,"kern",2)};function hr(r){de.call(this,r,"gsub")}function ns(r,t){var n=r.length;if(n!==t.length)return!1;for(var e=0;e<n;e++)if(r[e]!==t[e])return!1;return!0}function _A(r,t,n){for(var e=r.subtables,a=0;a<e.length;a++){var i=e[a];if(i.substFormat===t)return i}if(n)return e.push(n),n}hr.prototype=de.prototype;hr.prototype.createDefaultTable=function(){return{version:1,scripts:[{tag:"DFLT",script:{defaultLangSys:{reserved:0,reqFeatureIndex:65535,featureIndexes:[]},langSysRecords:[]}}],features:[],lookups:[]}};hr.prototype.getSingle=function(r,t,n){for(var e=[],a=this.getLookupTables(t,n,r,1),i=0;i<a.length;i++)for(var o=a[i].subtables,A=0;A<o.length;A++){var x=o[A],E=this.expandCoverage(x.coverage),l=void 0;if(x.substFormat===1){var T=x.deltaGlyphId;for(l=0;l<E.length;l++){var s=E[l];e.push({sub:s,by:s+T})}}else{var c=x.substitute;for(l=0;l<E.length;l++)e.push({sub:E[l],by:c[l]})}}return e};hr.prototype.getAlternates=function(r,t,n){for(var e=[],a=this.getLookupTables(t,n,r,3),i=0;i<a.length;i++)for(var o=a[i].subtables,A=0;A<o.length;A++)for(var x=o[A],E=this.expandCoverage(x.coverage),l=x.alternateSets,T=0;T<E.length;T++)e.push({sub:E[T],by:l[T]});return e};hr.prototype.getLigatures=function(r,t,n){for(var e=[],a=this.getLookupTables(t,n,r,4),i=0;i<a.length;i++)for(var o=a[i].subtables,A=0;A<o.length;A++)for(var x=o[A],E=this.expandCoverage(x.coverage),l=x.ligatureSets,T=0;T<E.length;T++)for(var s=E[T],c=l[T],I=0;I<c.length;I++){var h=c[I];e.push({sub:[s].concat(h.components),by:h.ligGlyph})}return e};hr.prototype.addSingle=function(r,t,n,e){var a=this.getLookupTables(n,e,r,1,!0)[0],i=_A(a,2,{substFormat:2,coverage:{format:1,glyphs:[]},substitute:[]});J.assert(i.coverage.format===1,"Ligature: unable to modify coverage table format "+i.coverage.format);var o=t.sub,A=this.binSearch(i.coverage.glyphs,o);A<0&&(A=-1-A,i.coverage.glyphs.splice(A,0,o),i.substitute.splice(A,0,0)),i.substitute[A]=t.by};hr.prototype.addAlternate=function(r,t,n,e){var a=this.getLookupTables(n,e,r,3,!0)[0],i=_A(a,1,{substFormat:1,coverage:{format:1,glyphs:[]},alternateSets:[]});J.assert(i.coverage.format===1,"Ligature: unable to modify coverage table format "+i.coverage.format);var o=t.sub,A=this.binSearch(i.coverage.glyphs,o);A<0&&(A=-1-A,i.coverage.glyphs.splice(A,0,o),i.alternateSets.splice(A,0,0)),i.alternateSets[A]=t.by};hr.prototype.addLigature=function(r,t,n,e){var a=this.getLookupTables(n,e,r,4,!0)[0],i=a.subtables[0];i||(i={substFormat:1,coverage:{format:1,glyphs:[]},ligatureSets:[]},a.subtables[0]=i),J.assert(i.coverage.format===1,"Ligature: unable to modify coverage table format "+i.coverage.format);var o=t.sub[0],A=t.sub.slice(1),x={ligGlyph:t.by,components:A},E=this.binSearch(i.coverage.glyphs,o);if(E>=0){for(var l=i.ligatureSets[E],T=0;T<l.length;T++)if(ns(l[T].components,A))return;l.push(x)}else E=-1-E,i.coverage.glyphs.splice(E,0,o),i.ligatureSets.splice(E,0,[x])};hr.prototype.getFeature=function(r,t,n){if(/ss\d\d/.test(r))return this.getSingle(r,t,n);switch(r){case"aalt":case"salt":return this.getSingle(r,t,n).concat(this.getAlternates(r,t,n));case"dlig":case"liga":case"rlig":return this.getLigatures(r,t,n)}};hr.prototype.add=function(r,t,n,e){if(/ss\d\d/.test(r))return this.addSingle(r,t,n,e);switch(r){case"aalt":case"salt":return typeof t.by=="number"?this.addSingle(r,t,n,e):this.addAlternate(r,t,n,e);case"dlig":case"liga":case"rlig":return this.addLigature(r,t,n,e)}};function es(){return typeof window<"u"}function ZA(r){for(var t=new ArrayBuffer(r.length),n=new Uint8Array(t),e=0;e<r.length;++e)n[e]=r[e];return t}function as(r){for(var t=new Buffer(r.byteLength),n=new Uint8Array(r),e=0;e<t.length;++e)t[e]=n[e];return t}function Kn(r,t){if(!r)throw t}function ki(r,t,n,e,a){var i;return(t&e)>0?(i=r.parseByte(),t&a||(i=-i),i=n+i):(t&a)>0?i=n:i=n+r.parseShort(),i}function zA(r,t,n){var e=new P.Parser(t,n);r.numberOfContours=e.parseShort(),r._xMin=e.parseShort(),r._yMin=e.parseShort(),r._xMax=e.parseShort(),r._yMax=e.parseShort();var a,i;if(r.numberOfContours>0){for(var o=r.endPointIndices=[],A=0;A<r.numberOfContours;A+=1)o.push(e.parseUShort());r.instructionLength=e.parseUShort(),r.instructions=[];for(var x=0;x<r.instructionLength;x+=1)r.instructions.push(e.parseByte());var E=o[o.length-1]+1;a=[];for(var l=0;l<E;l+=1)if(i=e.parseByte(),a.push(i),(i&8)>0)for(var T=e.parseByte(),s=0;s<T;s+=1)a.push(i),l+=1;if(J.argument(a.length===E,"Bad flags."),o.length>0){var c=[],I;if(E>0){for(var h=0;h<E;h+=1)i=a[h],I={},I.onCurve=!!(i&1),I.lastPointOfContour=o.indexOf(h)>=0,c.push(I);for(var S=0,p=0;p<E;p+=1)i=a[p],I=c[p],I.x=ki(e,i,S,2,16),S=I.x;for(var u=0,D=0;D<E;D+=1)i=a[D],I=c[D],I.y=ki(e,i,u,4,32),u=I.y}r.points=c}else r.points=[]}else if(r.numberOfContours===0)r.points=[];else{r.isComposite=!0,r.points=[],r.components=[];for(var M=!0;M;){a=e.parseUShort();var f={glyphIndex:e.parseUShort(),xScale:1,scale01:0,scale10:0,yScale:1,dx:0,dy:0};(a&1)>0?(a&2)>0?(f.dx=e.parseShort(),f.dy=e.parseShort()):f.matchedPoints=[e.parseUShort(),e.parseUShort()]:(a&2)>0?(f.dx=e.parseChar(),f.dy=e.parseChar()):f.matchedPoints=[e.parseByte(),e.parseByte()],(a&8)>0?f.xScale=f.yScale=e.parseF2Dot14():(a&64)>0?(f.xScale=e.parseF2Dot14(),f.yScale=e.parseF2Dot14()):(a&128)>0&&(f.xScale=e.parseF2Dot14(),f.scale01=e.parseF2Dot14(),f.scale10=e.parseF2Dot14(),f.yScale=e.parseF2Dot14()),r.components.push(f),M=!!(a&32)}if(a&256){r.instructionLength=e.parseUShort(),r.instructions=[];for(var O=0;O<r.instructionLength;O+=1)r.instructions.push(e.parseByte())}}}function Ya(r,t){for(var n=[],e=0;e<r.length;e+=1){var a=r[e],i={x:t.xScale*a.x+t.scale01*a.y+t.dx,y:t.scale10*a.x+t.yScale*a.y+t.dy,onCurve:a.onCurve,lastPointOfContour:a.lastPointOfContour};n.push(i)}return n}function is(r){for(var t=[],n=[],e=0;e<r.length;e+=1){var a=r[e];n.push(a),a.lastPointOfContour&&(t.push(n),n=[])}return J.argument(n.length===0,"There are still points left in the current contour."),t}function XA(r){var t=new Bt;if(!r)return t;for(var n=is(r),e=0;e<n.length;++e){var a=n[e],i=null,o=a[a.length-1],A=a[0];if(o.onCurve)t.moveTo(o.x,o.y);else if(A.onCurve)t.moveTo(A.x,A.y);else{var x={x:(o.x+A.x)*.5,y:(o.y+A.y)*.5};t.moveTo(x.x,x.y)}for(var E=0;E<a.length;++E)if(i=o,o=A,A=a[(E+1)%a.length],o.onCurve)t.lineTo(o.x,o.y);else{var l=A;i.onCurve||((o.x+i.x)*.5,(o.y+i.y)*.5),A.onCurve||(l={x:(o.x+A.x)*.5,y:(o.y+A.y)*.5}),t.quadraticCurveTo(o.x,o.y,l.x,l.y)}t.closePath()}return t}function jA(r,t){if(t.isComposite)for(var n=0;n<t.components.length;n+=1){var e=t.components[n],a=r.get(e.glyphIndex);if(a.getPath(),a.points){var i=void 0;if(e.matchedPoints===void 0)i=Ya(a.points,e);else{if(e.matchedPoints[0]>t.points.length-1||e.matchedPoints[1]>a.points.length-1)throw Error("Matched points out of range in "+t.name);var o=t.points[e.matchedPoints[0]],A=a.points[e.matchedPoints[1]],x={xScale:e.xScale,scale01:e.scale01,scale10:e.scale10,yScale:e.yScale,dx:0,dy:0};A=Ya([A],x)[0],x.dx=o.x-A.x,x.dy=o.y-A.y,i=Ya(a.points,x)}t.points=t.points.concat(i)}}return XA(t.points)}function os(r,t,n,e){for(var a=new Dr.GlyphSet(e),i=0;i<n.length-1;i+=1){var o=n[i],A=n[i+1];o!==A?a.push(i,Dr.ttfGlyphLoader(e,i,zA,r,t+o,jA)):a.push(i,Dr.glyphLoader(e,i))}return a}function As(r,t,n,e){var a=new Dr.GlyphSet(e);return e._push=function(i){var o=n[i],A=n[i+1];o!==A?a.push(i,Dr.ttfGlyphLoader(e,i,zA,r,t+o,jA)):a.push(i,Dr.glyphLoader(e,i))},a}function xs(r,t,n,e,a){return a.lowMemory?As(r,t,n,e):os(r,t,n,e)}var QA={getPath:XA,parse:xs},qA,Tn,$A,C0;function t1(r){this.font=r,this.getCommands=function(t){return QA.getPath(t).commands},this._fpgmState=this._prepState=void 0,this._errorState=0}function Es(r){return r}function r1(r){return Math.sign(r)*Math.round(Math.abs(r))}function ls(r){return Math.sign(r)*Math.round(Math.abs(r*2))/2}function ss(r){return Math.sign(r)*(Math.round(Math.abs(r)+.5)-.5)}function Ls(r){return Math.sign(r)*Math.ceil(Math.abs(r))}function Ts(r){return Math.sign(r)*Math.floor(Math.abs(r))}var n1=function(r){var t=this.srPeriod,n=this.srPhase,e=this.srThreshold,a=1;return r<0&&(r=-r,a=-1),r+=e-n,r=Math.trunc(r/t)*t,r+=n,r<0?n*a:r*a},Nr={x:1,y:0,axis:"x",distance:function(r,t,n,e){return(n?r.xo:r.x)-(e?t.xo:t.x)},interpolate:function(r,t,n,e){var a,i,o,A,x,E,l;if(!e||e===this){if(a=r.xo-t.xo,i=r.xo-n.xo,x=t.x-t.xo,E=n.x-n.xo,o=Math.abs(a),A=Math.abs(i),l=o+A,l===0){r.x=r.xo+(x+E)/2;return}r.x=r.xo+(x*A+E*o)/l;return}if(a=e.distance(r,t,!0,!0),i=e.distance(r,n,!0,!0),x=e.distance(t,t,!1,!0),E=e.distance(n,n,!1,!0),o=Math.abs(a),A=Math.abs(i),l=o+A,l===0){Nr.setRelative(r,r,(x+E)/2,e,!0);return}Nr.setRelative(r,r,(x*A+E*o)/l,e,!0)},normalSlope:Number.NEGATIVE_INFINITY,setRelative:function(r,t,n,e,a){if(!e||e===this){r.x=(a?t.xo:t.x)+n;return}var i=a?t.xo:t.x,o=a?t.yo:t.y,A=i+n*e.x,x=o+n*e.y;r.x=A+(r.y-x)/e.normalSlope},slope:0,touch:function(r){r.xTouched=!0},touched:function(r){return r.xTouched},untouch:function(r){r.xTouched=!1}},Mr={x:0,y:1,axis:"y",distance:function(r,t,n,e){return(n?r.yo:r.y)-(e?t.yo:t.y)},interpolate:function(r,t,n,e){var a,i,o,A,x,E,l;if(!e||e===this){if(a=r.yo-t.yo,i=r.yo-n.yo,x=t.y-t.yo,E=n.y-n.yo,o=Math.abs(a),A=Math.abs(i),l=o+A,l===0){r.y=r.yo+(x+E)/2;return}r.y=r.yo+(x*A+E*o)/l;return}if(a=e.distance(r,t,!0,!0),i=e.distance(r,n,!0,!0),x=e.distance(t,t,!1,!0),E=e.distance(n,n,!1,!0),o=Math.abs(a),A=Math.abs(i),l=o+A,l===0){Mr.setRelative(r,r,(x+E)/2,e,!0);return}Mr.setRelative(r,r,(x*A+E*o)/l,e,!0)},normalSlope:0,setRelative:function(r,t,n,e,a){if(!e||e===this){r.y=(a?t.yo:t.y)+n;return}var i=a?t.xo:t.x,o=a?t.yo:t.y,A=i+n*e.x,x=o+n*e.y;r.y=x+e.normalSlope*(r.x-A)},slope:Number.POSITIVE_INFINITY,touch:function(r){r.yTouched=!0},touched:function(r){return r.yTouched},untouch:function(r){r.yTouched=!1}};Object.freeze(Nr);Object.freeze(Mr);function pe(r,t){this.x=r,this.y=t,this.axis=void 0,this.slope=t/r,this.normalSlope=-r/t,Object.freeze(this)}pe.prototype.distance=function(r,t,n,e){return this.x*Nr.distance(r,t,n,e)+this.y*Mr.distance(r,t,n,e)};pe.prototype.interpolate=function(r,t,n,e){var a,i,o,A,x,E,l;if(o=e.distance(r,t,!0,!0),A=e.distance(r,n,!0,!0),a=e.distance(t,t,!1,!0),i=e.distance(n,n,!1,!0),x=Math.abs(o),E=Math.abs(A),l=x+E,l===0){this.setRelative(r,r,(a+i)/2,e,!0);return}this.setRelative(r,r,(a*E+i*x)/l,e,!0)};pe.prototype.setRelative=function(r,t,n,e,a){e=e||this;var i=a?t.xo:t.x,o=a?t.yo:t.y,A=i+n*e.x,x=o+n*e.y,E=e.normalSlope,l=this.slope,T=r.x,s=r.y;r.x=(l*T-E*A+x-s)/(l-E),r.y=l*(r.x-T)+s};pe.prototype.touch=function(r){r.xTouched=!0,r.yTouched=!0};function Ce(r,t){var n=Math.sqrt(r*r+t*t);return r/=n,t/=n,r===1&&t===0?Nr:r===0&&t===1?Mr:new pe(r,t)}function Pr(r,t,n,e){this.x=this.xo=Math.round(r*64)/64,this.y=this.yo=Math.round(t*64)/64,this.lastPointOfContour=n,this.onCurve=e,this.prevPointOnContour=void 0,this.nextPointOnContour=void 0,this.xTouched=!1,this.yTouched=!1,Object.preventExtensions(this)}Pr.prototype.nextTouched=function(r){for(var t=this.nextPointOnContour;!r.touched(t)&&t!==this;)t=t.nextPointOnContour;return t};Pr.prototype.prevTouched=function(r){for(var t=this.prevPointOnContour;!r.touched(t)&&t!==this;)t=t.prevPointOnContour;return t};var ee=Object.freeze(new Pr(0,0)),cs={cvCutIn:17/16,deltaBase:9,deltaShift:.125,loop:1,minDis:1,autoFlip:!0};function Xr(r,t){switch(this.env=r,this.stack=[],this.prog=t,r){case"glyf":this.zp0=this.zp1=this.zp2=1,this.rp0=this.rp1=this.rp2=0;case"prep":this.fv=this.pv=this.dpv=Nr,this.round=r1}}t1.prototype.exec=function(r,t){if(typeof t!="number")throw new Error("Point size is not a number!");if(!(this._errorState>2)){var n=this.font,e=this._prepState;if(!e||e.ppem!==t){var a=this._fpgmState;if(!a){Xr.prototype=cs,a=this._fpgmState=new Xr("fpgm",n.tables.fpgm),a.funcs=[],a.font=n,N.DEBUG&&(console.log("---EXEC FPGM---"),a.step=-1);try{Tn(a)}catch(E){console.log("Hinting error in FPGM:"+E),this._errorState=3;return}}Xr.prototype=a,e=this._prepState=new Xr("prep",n.tables.prep),e.ppem=t;var i=n.tables.cvt;if(i)for(var o=e.cvt=new Array(i.length),A=t/n.unitsPerEm,x=0;x<i.length;x++)o[x]=i[x]*A;else e.cvt=[];N.DEBUG&&(console.log("---EXEC PREP---"),e.step=-1);try{Tn(e)}catch(E){this._errorState<2&&console.log("Hinting error in PREP:"+E),this._errorState=2}}if(!(this._errorState>1))try{return $A(r,e)}catch(E){this._errorState<1&&(console.log("Hinting error:"+E),console.log("Note: further hinting errors are silenced")),this._errorState=1;return}}};$A=function(r,t){var n=t.ppem/t.font.unitsPerEm,e=n,a=r.components,i,o,A;if(Xr.prototype=t,!a)A=new Xr("glyf",r.instructions),N.DEBUG&&(console.log("---EXEC GLYPH---"),A.step=-1),C0(r,A,n,e),o=A.gZone;else{var x=t.font;o=[],i=[];for(var E=0;E<a.length;E++){var l=a[E],T=x.glyphs.get(l.glyphIndex);A=new Xr("glyf",T.instructions),N.DEBUG&&(console.log("---EXEC COMP "+E+"---"),A.step=-1),C0(T,A,n,e);for(var s=Math.round(l.dx*n),c=Math.round(l.dy*e),I=A.gZone,h=A.contours,S=0;S<I.length;S++){var p=I[S];p.xTouched=p.yTouched=!1,p.xo=p.x=p.x+s,p.yo=p.y=p.y+c}var u=o.length;o.push.apply(o,I);for(var D=0;D<h.length;D++)i.push(h[D]+u)}r.instructions&&!A.inhibitGridFit&&(A=new Xr("glyf",r.instructions),A.gZone=A.z0=A.z1=A.z2=o,A.contours=i,o.push(new Pr(0,0),new Pr(Math.round(r.advanceWidth*n),0)),N.DEBUG&&(console.log("---EXEC COMPOSITE---"),A.step=-1),Tn(A),o.length-=2)}return o};C0=function(r,t,n,e){for(var a=r.points||[],i=a.length,o=t.gZone=t.z0=t.z1=t.z2=[],A=t.contours=[],x,E=0;E<i;E++)x=a[E],o[E]=new Pr(x.x*n,x.y*e,x.lastPointOfContour,x.onCurve);for(var l,T,s=0;s<i;s++)x=o[s],l||(l=x,A.push(s)),x.lastPointOfContour?(x.nextPointOnContour=l,l.prevPointOnContour=x,l=void 0):(T=o[s+1],x.nextPointOnContour=T,T.prevPointOnContour=x);if(!t.inhibitGridFit){if(N.DEBUG){console.log("PROCESSING GLYPH",t.stack);for(var c=0;c<i;c++)console.log(c,o[c].x,o[c].y)}if(o.push(new Pr(0,0),new Pr(Math.round(r.advanceWidth*n),0)),Tn(t),o.length-=2,N.DEBUG){console.log("FINISHED GLYPH",t.stack);for(var I=0;I<i;I++)console.log(I,o[I].x,o[I].y)}}};Tn=function(r){var t=r.prog;if(t){var n=t.length,e;for(r.ip=0;r.ip<n;r.ip++){if(N.DEBUG&&r.step++,e=qA[t[r.ip]],!e)throw new Error("unknown instruction: 0x"+Number(t[r.ip]).toString(16));e(r)}}};function ua(r){for(var t=r.tZone=new Array(r.gZone.length),n=0;n<t.length;n++)t[n]=new Pr(0,0)}function e1(r,t){var n=r.prog,e=r.ip,a=1,i;do if(i=n[++e],i===88)a++;else if(i===89)a--;else if(i===64)e+=n[e+1]+1;else if(i===65)e+=2*n[e+1]+1;else if(i>=176&&i<=183)e+=i-176+1;else if(i>=184&&i<=191)e+=(i-184+1)*2;else if(t&&a===1&&i===27)break;while(a>0);r.ip=e}function Ki(r,t){N.DEBUG&&console.log(t.step,"SVTCA["+r.axis+"]"),t.fv=t.pv=t.dpv=r}function Vi(r,t){N.DEBUG&&console.log(t.step,"SPVTCA["+r.axis+"]"),t.pv=t.dpv=r}function Ji(r,t){N.DEBUG&&console.log(t.step,"SFVTCA["+r.axis+"]"),t.fv=r}function _i(r,t){var n=t.stack,e=n.pop(),a=n.pop(),i=t.z2[e],o=t.z1[a];N.DEBUG&&console.log("SPVTL["+r+"]",e,a);var A,x;r?(A=i.y-o.y,x=o.x-i.x):(A=o.x-i.x,x=o.y-i.y),t.pv=t.dpv=Ce(A,x)}function Zi(r,t){var n=t.stack,e=n.pop(),a=n.pop(),i=t.z2[e],o=t.z1[a];N.DEBUG&&console.log("SFVTL["+r+"]",e,a);var A,x;r?(A=i.y-o.y,x=o.x-i.x):(A=o.x-i.x,x=o.y-i.y),t.fv=Ce(A,x)}function Is(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"SPVFS[]",n,e),r.pv=r.dpv=Ce(e,n)}function hs(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"SPVFS[]",n,e),r.fv=Ce(e,n)}function ds(r){var t=r.stack,n=r.pv;N.DEBUG&&console.log(r.step,"GPV[]"),t.push(n.x*16384),t.push(n.y*16384)}function Ss(r){var t=r.stack,n=r.fv;N.DEBUG&&console.log(r.step,"GFV[]"),t.push(n.x*16384),t.push(n.y*16384)}function ps(r){r.fv=r.pv,N.DEBUG&&console.log(r.step,"SFVTPV[]")}function Cs(r){var t=r.stack,n=t.pop(),e=t.pop(),a=t.pop(),i=t.pop(),o=t.pop(),A=r.z0,x=r.z1,E=A[n],l=A[e],T=x[a],s=x[i],c=r.z2[o];N.DEBUG&&console.log("ISECT[], ",n,e,a,i,o);var I=E.x,h=E.y,S=l.x,p=l.y,u=T.x,D=T.y,M=s.x,f=s.y,O=(I-S)*(D-f)-(h-p)*(u-M),g=I*p-h*S,v=u*f-D*M;c.x=(g*(u-M)-v*(I-S))/O,c.y=(g*(D-f)-v*(h-p))/O}function us(r){r.rp0=r.stack.pop(),N.DEBUG&&console.log(r.step,"SRP0[]",r.rp0)}function Rs(r){r.rp1=r.stack.pop(),N.DEBUG&&console.log(r.step,"SRP1[]",r.rp1)}function gs(r){r.rp2=r.stack.pop(),N.DEBUG&&console.log(r.step,"SRP2[]",r.rp2)}function ys(r){var t=r.stack.pop();switch(N.DEBUG&&console.log(r.step,"SZP0[]",t),r.zp0=t,t){case 0:r.tZone||ua(r),r.z0=r.tZone;break;case 1:r.z0=r.gZone;break;default:throw new Error("Invalid zone pointer")}}function Ns(r){var t=r.stack.pop();switch(N.DEBUG&&console.log(r.step,"SZP1[]",t),r.zp1=t,t){case 0:r.tZone||ua(r),r.z1=r.tZone;break;case 1:r.z1=r.gZone;break;default:throw new Error("Invalid zone pointer")}}function Ds(r){var t=r.stack.pop();switch(N.DEBUG&&console.log(r.step,"SZP2[]",t),r.zp2=t,t){case 0:r.tZone||ua(r),r.z2=r.tZone;break;case 1:r.z2=r.gZone;break;default:throw new Error("Invalid zone pointer")}}function Os(r){var t=r.stack.pop();switch(N.DEBUG&&console.log(r.step,"SZPS[]",t),r.zp0=r.zp1=r.zp2=t,t){case 0:r.tZone||ua(r),r.z0=r.z1=r.z2=r.tZone;break;case 1:r.z0=r.z1=r.z2=r.gZone;break;default:throw new Error("Invalid zone pointer")}}function ms(r){r.loop=r.stack.pop(),N.DEBUG&&console.log(r.step,"SLOOP[]",r.loop)}function Bs(r){N.DEBUG&&console.log(r.step,"RTG[]"),r.round=r1}function Hs(r){N.DEBUG&&console.log(r.step,"RTHG[]"),r.round=ss}function Fs(r){var t=r.stack.pop();N.DEBUG&&console.log(r.step,"SMD[]",t),r.minDis=t/64}function fs(r){N.DEBUG&&console.log(r.step,"ELSE[]"),e1(r,!1)}function Ms(r){var t=r.stack.pop();N.DEBUG&&console.log(r.step,"JMPR[]",t),r.ip+=t-1}function Gs(r){var t=r.stack.pop();N.DEBUG&&console.log(r.step,"SCVTCI[]",t),r.cvCutIn=t/64}function Ps(r){var t=r.stack;N.DEBUG&&console.log(r.step,"DUP[]"),t.push(t[t.length-1])}function va(r){N.DEBUG&&console.log(r.step,"POP[]"),r.stack.pop()}function bs(r){N.DEBUG&&console.log(r.step,"CLEAR[]"),r.stack.length=0}function Us(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"SWAP[]"),t.push(n),t.push(e)}function Ys(r){var t=r.stack;N.DEBUG&&console.log(r.step,"DEPTH[]"),t.push(t.length)}function vs(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"LOOPCALL[]",n,e);var a=r.ip,i=r.prog;r.prog=r.funcs[n];for(var o=0;o<e;o++)Tn(r),N.DEBUG&&console.log(++r.step,o+1<e?"next loopcall":"done loopcall",o);r.ip=a,r.prog=i}function ws(r){var t=r.stack.pop();N.DEBUG&&console.log(r.step,"CALL[]",t);var n=r.ip,e=r.prog;r.prog=r.funcs[t],Tn(r),r.ip=n,r.prog=e,N.DEBUG&&console.log(++r.step,"returning from",t)}function Ws(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"CINDEX[]",n),t.push(t[t.length-n])}function ks(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"MINDEX[]",n),t.push(t.splice(t.length-n,1)[0])}function Ks(r){if(r.env!=="fpgm")throw new Error("FDEF not allowed here");var t=r.stack,n=r.prog,e=r.ip,a=t.pop(),i=e;for(N.DEBUG&&console.log(r.step,"FDEF[]",a);n[++e]!==45;);r.ip=e,r.funcs[a]=n.slice(i+1,e)}function zi(r,t){var n=t.stack.pop(),e=t.z0[n],a=t.fv,i=t.pv;N.DEBUG&&console.log(t.step,"MDAP["+r+"]",n);var o=i.distance(e,ee);r&&(o=t.round(o)),a.setRelative(e,ee,o,i),a.touch(e),t.rp0=t.rp1=n}function Xi(r,t){var n=t.z2,e=n.length-2,a,i,o;N.DEBUG&&console.log(t.step,"IUP["+r.axis+"]");for(var A=0;A<e;A++)a=n[A],!r.touched(a)&&(i=a.prevTouched(r),i!==a&&(o=a.nextTouched(r),i===o&&r.setRelative(a,a,r.distance(i,i,!1,!0),r,!0),r.interpolate(a,i,o,r)))}function ji(r,t){for(var n=t.stack,e=r?t.rp1:t.rp2,a=(r?t.z0:t.z1)[e],i=t.fv,o=t.pv,A=t.loop,x=t.z2;A--;){var E=n.pop(),l=x[E],T=o.distance(a,a,!1,!0);i.setRelative(l,l,T,o),i.touch(l),N.DEBUG&&console.log(t.step,(t.loop>1?"loop "+(t.loop-A)+": ":"")+"SHP["+(r?"rp1":"rp2")+"]",E)}t.loop=1}function Qi(r,t){var n=t.stack,e=r?t.rp1:t.rp2,a=(r?t.z0:t.z1)[e],i=t.fv,o=t.pv,A=n.pop(),x=t.z2[t.contours[A]],E=x;N.DEBUG&&console.log(t.step,"SHC["+r+"]",A);var l=o.distance(a,a,!1,!0);do E!==a&&i.setRelative(E,E,l,o),E=E.nextPointOnContour;while(E!==x)}function qi(r,t){var n=t.stack,e=r?t.rp1:t.rp2,a=(r?t.z0:t.z1)[e],i=t.fv,o=t.pv,A=n.pop();N.DEBUG&&console.log(t.step,"SHZ["+r+"]",A);var x;switch(A){case 0:x=t.tZone;break;case 1:x=t.gZone;break;default:throw new Error("Invalid zone")}for(var E,l=o.distance(a,a,!1,!0),T=x.length-2,s=0;s<T;s++)E=x[s],i.setRelative(E,E,l,o)}function Vs(r){for(var t=r.stack,n=r.loop,e=r.fv,a=t.pop()/64,i=r.z2;n--;){var o=t.pop(),A=i[o];N.DEBUG&&console.log(r.step,(r.loop>1?"loop "+(r.loop-n)+": ":"")+"SHPIX[]",o,a),e.setRelative(A,A,a),e.touch(A)}r.loop=1}function Js(r){for(var t=r.stack,n=r.rp1,e=r.rp2,a=r.loop,i=r.z0[n],o=r.z1[e],A=r.fv,x=r.dpv,E=r.z2;a--;){var l=t.pop(),T=E[l];N.DEBUG&&console.log(r.step,(r.loop>1?"loop "+(r.loop-a)+": ":"")+"IP[]",l,n,"<->",e),A.interpolate(T,i,o,x),A.touch(T)}r.loop=1}function $i(r,t){var n=t.stack,e=n.pop()/64,a=n.pop(),i=t.z1[a],o=t.z0[t.rp0],A=t.fv,x=t.pv;A.setRelative(i,o,e,x),A.touch(i),N.DEBUG&&console.log(t.step,"MSIRP["+r+"]",e,a),t.rp1=t.rp0,t.rp2=a,r&&(t.rp0=a)}function _s(r){for(var t=r.stack,n=r.rp0,e=r.z0[n],a=r.loop,i=r.fv,o=r.pv,A=r.z1;a--;){var x=t.pop(),E=A[x];N.DEBUG&&console.log(r.step,(r.loop>1?"loop "+(r.loop-a)+": ":"")+"ALIGNRP[]",x),i.setRelative(E,e,0,o),i.touch(E)}r.loop=1}function Zs(r){N.DEBUG&&console.log(r.step,"RTDG[]"),r.round=ls}function to(r,t){var n=t.stack,e=n.pop(),a=n.pop(),i=t.z0[a],o=t.fv,A=t.pv,x=t.cvt[e];N.DEBUG&&console.log(t.step,"MIAP["+r+"]",e,"(",x,")",a);var E=A.distance(i,ee);r&&(Math.abs(E-x)<t.cvCutIn&&(E=x),E=t.round(E)),o.setRelative(i,ee,E,A),t.zp0===0&&(i.xo=i.x,i.yo=i.y),o.touch(i),t.rp0=t.rp1=a}function zs(r){var t=r.prog,n=r.ip,e=r.stack,a=t[++n];N.DEBUG&&console.log(r.step,"NPUSHB[]",a);for(var i=0;i<a;i++)e.push(t[++n]);r.ip=n}function Xs(r){var t=r.ip,n=r.prog,e=r.stack,a=n[++t];N.DEBUG&&console.log(r.step,"NPUSHW[]",a);for(var i=0;i<a;i++){var o=n[++t]<<8|n[++t];o&32768&&(o=-((o^65535)+1)),e.push(o)}r.ip=t}function js(r){var t=r.stack,n=r.store;n||(n=r.store=[]);var e=t.pop(),a=t.pop();N.DEBUG&&console.log(r.step,"WS",e,a),n[a]=e}function Qs(r){var t=r.stack,n=r.store,e=t.pop();N.DEBUG&&console.log(r.step,"RS",e);var a=n&&n[e]||0;t.push(a)}function qs(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"WCVTP",n,e),r.cvt[e]=n/64}function $s(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"RCVT",n),t.push(r.cvt[n]*64)}function ro(r,t){var n=t.stack,e=n.pop(),a=t.z2[e];N.DEBUG&&console.log(t.step,"GC["+r+"]",e),n.push(t.dpv.distance(a,ee,r,!1)*64)}function no(r,t){var n=t.stack,e=n.pop(),a=n.pop(),i=t.z1[e],o=t.z0[a],A=t.dpv.distance(o,i,r,r);N.DEBUG&&console.log(t.step,"MD["+r+"]",e,a,"->",A),t.stack.push(Math.round(A*64))}function tL(r){N.DEBUG&&console.log(r.step,"MPPEM[]"),r.stack.push(r.ppem)}function rL(r){N.DEBUG&&console.log(r.step,"FLIPON[]"),r.autoFlip=!0}function nL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"LT[]",n,e),t.push(e<n?1:0)}function eL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"LTEQ[]",n,e),t.push(e<=n?1:0)}function aL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"GT[]",n,e),t.push(e>n?1:0)}function iL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"GTEQ[]",n,e),t.push(e>=n?1:0)}function oL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"EQ[]",n,e),t.push(n===e?1:0)}function AL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"NEQ[]",n,e),t.push(n!==e?1:0)}function xL(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"ODD[]",n),t.push(Math.trunc(n)%2?1:0)}function EL(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"EVEN[]",n),t.push(Math.trunc(n)%2?0:1)}function lL(r){var t=r.stack.pop();N.DEBUG&&console.log(r.step,"IF[]",t),t||(e1(r,!0),N.DEBUG&&console.log(r.step,"EIF[]"))}function sL(r){N.DEBUG&&console.log(r.step,"EIF[]")}function LL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"AND[]",n,e),t.push(n&&e?1:0)}function TL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"OR[]",n,e),t.push(n||e?1:0)}function cL(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"NOT[]",n),t.push(n?0:1)}function wa(r,t){var n=t.stack,e=n.pop(),a=t.fv,i=t.pv,o=t.ppem,A=t.deltaBase+(r-1)*16,x=t.deltaShift,E=t.z0;N.DEBUG&&console.log(t.step,"DELTAP["+r+"]",e,n);for(var l=0;l<e;l++){var T=n.pop(),s=n.pop(),c=A+((s&240)>>4);if(c===o){var I=(s&15)-8;I>=0&&I++,N.DEBUG&&console.log(t.step,"DELTAPFIX",T,"by",I*x);var h=E[T];a.setRelative(h,h,I*x,i)}}}function IL(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"SDB[]",n),r.deltaBase=n}function hL(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"SDS[]",n),r.deltaShift=Math.pow(.5,n)}function dL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"ADD[]",n,e),t.push(e+n)}function SL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"SUB[]",n,e),t.push(e-n)}function pL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"DIV[]",n,e),t.push(e*64/n)}function CL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"MUL[]",n,e),t.push(e*n/64)}function uL(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"ABS[]",n),t.push(Math.abs(n))}function RL(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"NEG[]",n),t.push(-n)}function gL(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"FLOOR[]",n),t.push(Math.floor(n/64)*64)}function yL(r){var t=r.stack,n=t.pop();N.DEBUG&&console.log(r.step,"CEILING[]",n),t.push(Math.ceil(n/64)*64)}function be(r,t){var n=t.stack,e=n.pop();N.DEBUG&&console.log(t.step,"ROUND[]"),n.push(t.round(e/64)*64)}function NL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"WCVTF[]",n,e),r.cvt[e]=n*r.ppem/r.font.unitsPerEm}function Wa(r,t){var n=t.stack,e=n.pop(),a=t.ppem,i=t.deltaBase+(r-1)*16,o=t.deltaShift;N.DEBUG&&console.log(t.step,"DELTAC["+r+"]",e,n);for(var A=0;A<e;A++){var x=n.pop(),E=n.pop(),l=i+((E&240)>>4);if(l===a){var T=(E&15)-8;T>=0&&T++;var s=T*o;N.DEBUG&&console.log(t.step,"DELTACFIX",x,"by",s),t.cvt[x]+=s}}}function DL(r){var t=r.stack.pop();N.DEBUG&&console.log(r.step,"SROUND[]",t),r.round=n1;var n;switch(t&192){case 0:n=.5;break;case 64:n=1;break;case 128:n=2;break;default:throw new Error("invalid SROUND value")}switch(r.srPeriod=n,t&48){case 0:r.srPhase=0;break;case 16:r.srPhase=.25*n;break;case 32:r.srPhase=.5*n;break;case 48:r.srPhase=.75*n;break;default:throw new Error("invalid SROUND value")}t&=15,t===0?r.srThreshold=0:r.srThreshold=(t/8-.5)*n}function OL(r){var t=r.stack.pop();N.DEBUG&&console.log(r.step,"S45ROUND[]",t),r.round=n1;var n;switch(t&192){case 0:n=Math.sqrt(2)/2;break;case 64:n=Math.sqrt(2);break;case 128:n=2*Math.sqrt(2);break;default:throw new Error("invalid S45ROUND value")}switch(r.srPeriod=n,t&48){case 0:r.srPhase=0;break;case 16:r.srPhase=.25*n;break;case 32:r.srPhase=.5*n;break;case 48:r.srPhase=.75*n;break;default:throw new Error("invalid S45ROUND value")}t&=15,t===0?r.srThreshold=0:r.srThreshold=(t/8-.5)*n}function mL(r){N.DEBUG&&console.log(r.step,"ROFF[]"),r.round=Es}function BL(r){N.DEBUG&&console.log(r.step,"RUTG[]"),r.round=Ls}function HL(r){N.DEBUG&&console.log(r.step,"RDTG[]"),r.round=Ts}function FL(r){var t=r.stack.pop();N.DEBUG&&console.log(r.step,"SCANCTRL[]",t)}function eo(r,t){var n=t.stack,e=n.pop(),a=n.pop(),i=t.z2[e],o=t.z1[a];N.DEBUG&&console.log(t.step,"SDPVTL["+r+"]",e,a);var A,x;r?(A=i.y-o.y,x=o.x-i.x):(A=o.x-i.x,x=o.y-i.y),t.dpv=Ce(A,x)}function fL(r){var t=r.stack,n=t.pop(),e=0;N.DEBUG&&console.log(r.step,"GETINFO[]",n),n&1&&(e=35),n&32&&(e|=4096),t.push(e)}function ML(r){var t=r.stack,n=t.pop(),e=t.pop(),a=t.pop();N.DEBUG&&console.log(r.step,"ROLL[]"),t.push(e),t.push(n),t.push(a)}function GL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"MAX[]",n,e),t.push(Math.max(e,n))}function PL(r){var t=r.stack,n=t.pop(),e=t.pop();N.DEBUG&&console.log(r.step,"MIN[]",n,e),t.push(Math.min(e,n))}function bL(r){var t=r.stack.pop();N.DEBUG&&console.log(r.step,"SCANTYPE[]",t)}function UL(r){var t=r.stack.pop(),n=r.stack.pop();switch(N.DEBUG&&console.log(r.step,"INSTCTRL[]",t,n),t){case 1:r.inhibitGridFit=!!n;return;case 2:r.ignoreCvt=!!n;return;default:throw new Error("invalid INSTCTRL[] selector")}}function Kr(r,t){var n=t.stack,e=t.prog,a=t.ip;N.DEBUG&&console.log(t.step,"PUSHB["+r+"]");for(var i=0;i<r;i++)n.push(e[++a]);t.ip=a}function Vr(r,t){var n=t.ip,e=t.prog,a=t.stack;N.DEBUG&&console.log(t.ip,"PUSHW["+r+"]");for(var i=0;i<r;i++){var o=e[++n]<<8|e[++n];o&32768&&(o=-((o^65535)+1)),a.push(o)}t.ip=n}function G(r,t,n,e,a,i){var o=i.stack,A=r&&o.pop(),x=o.pop(),E=i.rp0,l=i.z0[E],T=i.z1[x],s=i.minDis,c=i.fv,I=i.dpv,h,S,p,u;S=h=I.distance(T,l,!0,!0),p=S>=0?1:-1,S=Math.abs(S),r&&(u=i.cvt[A],e&&Math.abs(S-u)<i.cvCutIn&&(S=u)),n&&S<s&&(S=s),e&&(S=i.round(S)),c.setRelative(T,l,p*S,I),c.touch(T),N.DEBUG&&console.log(i.step,(r?"MIRP[":"MDRP[")+(t?"M":"m")+(n?">":"_")+(e?"R":"_")+(a===0?"Gr":a===1?"Bl":a===2?"Wh":"")+"]",r?A+"("+i.cvt[A]+","+u+")":"",x,"(d =",h,"->",p*S,")"),i.rp1=i.rp0,i.rp2=x,t&&(i.rp0=x)}qA=[Ki.bind(void 0,Mr),Ki.bind(void 0,Nr),Vi.bind(void 0,Mr),Vi.bind(void 0,Nr),Ji.bind(void 0,Mr),Ji.bind(void 0,Nr),_i.bind(void 0,0),_i.bind(void 0,1),Zi.bind(void 0,0),Zi.bind(void 0,1),Is,hs,ds,Ss,ps,Cs,us,Rs,gs,ys,Ns,Ds,Os,ms,Bs,Hs,Fs,fs,Ms,Gs,void 0,void 0,Ps,va,bs,Us,Ys,Ws,ks,void 0,void 0,void 0,vs,ws,Ks,void 0,zi.bind(void 0,0),zi.bind(void 0,1),Xi.bind(void 0,Mr),Xi.bind(void 0,Nr),ji.bind(void 0,0),ji.bind(void 0,1),Qi.bind(void 0,0),Qi.bind(void 0,1),qi.bind(void 0,0),qi.bind(void 0,1),Vs,Js,$i.bind(void 0,0),$i.bind(void 0,1),_s,Zs,to.bind(void 0,0),to.bind(void 0,1),zs,Xs,js,Qs,qs,$s,ro.bind(void 0,0),ro.bind(void 0,1),void 0,no.bind(void 0,0),no.bind(void 0,1),tL,void 0,rL,void 0,void 0,nL,eL,aL,iL,oL,AL,xL,EL,lL,sL,LL,TL,cL,wa.bind(void 0,1),IL,hL,dL,SL,pL,CL,uL,RL,gL,yL,be.bind(void 0,0),be.bind(void 0,1),be.bind(void 0,2),be.bind(void 0,3),void 0,void 0,void 0,void 0,NL,wa.bind(void 0,2),wa.bind(void 0,3),Wa.bind(void 0,1),Wa.bind(void 0,2),Wa.bind(void 0,3),DL,OL,void 0,void 0,mL,void 0,BL,HL,va,va,void 0,void 0,void 0,void 0,void 0,FL,eo.bind(void 0,0),eo.bind(void 0,1),fL,void 0,ML,GL,PL,bL,UL,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,Kr.bind(void 0,1),Kr.bind(void 0,2),Kr.bind(void 0,3),Kr.bind(void 0,4),Kr.bind(void 0,5),Kr.bind(void 0,6),Kr.bind(void 0,7),Kr.bind(void 0,8),Vr.bind(void 0,1),Vr.bind(void 0,2),Vr.bind(void 0,3),Vr.bind(void 0,4),Vr.bind(void 0,5),Vr.bind(void 0,6),Vr.bind(void 0,7),Vr.bind(void 0,8),G.bind(void 0,0,0,0,0,0),G.bind(void 0,0,0,0,0,1),G.bind(void 0,0,0,0,0,2),G.bind(void 0,0,0,0,0,3),G.bind(void 0,0,0,0,1,0),G.bind(void 0,0,0,0,1,1),G.bind(void 0,0,0,0,1,2),G.bind(void 0,0,0,0,1,3),G.bind(void 0,0,0,1,0,0),G.bind(void 0,0,0,1,0,1),G.bind(void 0,0,0,1,0,2),G.bind(void 0,0,0,1,0,3),G.bind(void 0,0,0,1,1,0),G.bind(void 0,0,0,1,1,1),G.bind(void 0,0,0,1,1,2),G.bind(void 0,0,0,1,1,3),G.bind(void 0,0,1,0,0,0),G.bind(void 0,0,1,0,0,1),G.bind(void 0,0,1,0,0,2),G.bind(void 0,0,1,0,0,3),G.bind(void 0,0,1,0,1,0),G.bind(void 0,0,1,0,1,1),G.bind(void 0,0,1,0,1,2),G.bind(void 0,0,1,0,1,3),G.bind(void 0,0,1,1,0,0),G.bind(void 0,0,1,1,0,1),G.bind(void 0,0,1,1,0,2),G.bind(void 0,0,1,1,0,3),G.bind(void 0,0,1,1,1,0),G.bind(void 0,0,1,1,1,1),G.bind(void 0,0,1,1,1,2),G.bind(void 0,0,1,1,1,3),G.bind(void 0,1,0,0,0,0),G.bind(void 0,1,0,0,0,1),G.bind(void 0,1,0,0,0,2),G.bind(void 0,1,0,0,0,3),G.bind(void 0,1,0,0,1,0),G.bind(void 0,1,0,0,1,1),G.bind(void 0,1,0,0,1,2),G.bind(void 0,1,0,0,1,3),G.bind(void 0,1,0,1,0,0),G.bind(void 0,1,0,1,0,1),G.bind(void 0,1,0,1,0,2),G.bind(void 0,1,0,1,0,3),G.bind(void 0,1,0,1,1,0),G.bind(void 0,1,0,1,1,1),G.bind(void 0,1,0,1,1,2),G.bind(void 0,1,0,1,1,3),G.bind(void 0,1,1,0,0,0),G.bind(void 0,1,1,0,0,1),G.bind(void 0,1,1,0,0,2),G.bind(void 0,1,1,0,0,3),G.bind(void 0,1,1,0,1,0),G.bind(void 0,1,1,0,1,1),G.bind(void 0,1,1,0,1,2),G.bind(void 0,1,1,0,1,3),G.bind(void 0,1,1,1,0,0),G.bind(void 0,1,1,1,0,1),G.bind(void 0,1,1,1,0,2),G.bind(void 0,1,1,1,0,3),G.bind(void 0,1,1,1,1,0),G.bind(void 0,1,1,1,1,1),G.bind(void 0,1,1,1,1,2),G.bind(void 0,1,1,1,1,3)];function Yn(r){this.char=r,this.state={},this.activeState=null}function z0(r,t,n){this.contextName=n,this.startIndex=r,this.endOffset=t}function YL(r,t,n){this.contextName=r,this.openRange=null,this.ranges=[],this.checkStart=t,this.checkEnd=n}function Lr(r,t){this.context=r,this.index=t,this.length=r.length,this.current=r[t],this.backtrack=r.slice(0,t),this.lookahead=r.slice(t+1)}function Ra(r){this.eventId=r,this.subscribers=[]}function vL(r){var t=this,n=["start","end","next","newToken","contextStart","contextEnd","insertToken","removeToken","removeRange","replaceToken","replaceRange","composeRUD","updateContextsRanges"];n.forEach(function(a){Object.defineProperty(t.events,a,{value:new Ra(a)})}),r&&n.forEach(function(a){var i=r[a];typeof i=="function"&&t.events[a].subscribe(i)});var e=["insertToken","removeToken","removeRange","replaceToken","replaceRange","composeRUD"];e.forEach(function(a){t.events[a].subscribe(t.updateContextsRanges)})}function pt(r){this.tokens=[],this.registeredContexts={},this.contextCheckers=[],this.events={},this.registeredModifiers=[],vL.call(this,r)}Yn.prototype.setState=function(r,t){return this.state[r]=t,this.activeState={key:r,value:this.state[r]},this.activeState};Yn.prototype.getState=function(r){return this.state[r]||null};pt.prototype.inboundIndex=function(r){return r>=0&&r<this.tokens.length};pt.prototype.composeRUD=function(r){var t=this,n=!0,e=r.map(function(i){return t[i[0]].apply(t,i.slice(1).concat(n))}),a=function(i){return typeof i=="object"&&i.hasOwnProperty("FAIL")};if(e.every(a))return{FAIL:"composeRUD: one or more operations hasn't completed successfully",report:e.filter(a)};this.dispatch("composeRUD",[e.filter(function(i){return!a(i)})])};pt.prototype.replaceRange=function(r,t,n,e){t=t!==null?t:this.tokens.length;var a=n.every(function(o){return o instanceof Yn});if(!isNaN(r)&&this.inboundIndex(r)&&a){var i=this.tokens.splice.apply(this.tokens,[r,t].concat(n));return e||this.dispatch("replaceToken",[r,t,n]),[i,n]}else return{FAIL:"replaceRange: invalid tokens or startIndex."}};pt.prototype.replaceToken=function(r,t,n){if(!isNaN(r)&&this.inboundIndex(r)&&t instanceof Yn){var e=this.tokens.splice(r,1,t);return n||this.dispatch("replaceToken",[r,t]),[e[0],t]}else return{FAIL:"replaceToken: invalid token or index."}};pt.prototype.removeRange=function(r,t,n){t=isNaN(t)?this.tokens.length:t;var e=this.tokens.splice(r,t);return n||this.dispatch("removeRange",[e,r,t]),e};pt.prototype.removeToken=function(r,t){if(!isNaN(r)&&this.inboundIndex(r)){var n=this.tokens.splice(r,1);return t||this.dispatch("removeToken",[n,r]),n}else return{FAIL:"removeToken: invalid token index."}};pt.prototype.insertToken=function(r,t,n){var e=r.every(function(a){return a instanceof Yn});return e?(this.tokens.splice.apply(this.tokens,[t,0].concat(r)),n||this.dispatch("insertToken",[r,t]),r):{FAIL:"insertToken: invalid token(s)."}};pt.prototype.registerModifier=function(r,t,n){this.events.newToken.subscribe(function(e,a){var i=[e,a],o=t===null||t.apply(this,i)===!0,A=[e,a];if(o){var x=n.apply(this,A);e.setState(r,x)}}),this.registeredModifiers.push(r)};Ra.prototype.subscribe=function(r){return typeof r=="function"?this.subscribers.push(r)-1:{FAIL:"invalid '"+this.eventId+"' event handler"}};Ra.prototype.unsubscribe=function(r){this.subscribers.splice(r,1)};Lr.prototype.setCurrentIndex=function(r){this.index=r,this.current=this.context[r],this.backtrack=this.context.slice(0,r),this.lookahead=this.context.slice(r+1)};Lr.prototype.get=function(r){switch(!0){case r===0:return this.current;case(r<0&&Math.abs(r)<=this.backtrack.length):return this.backtrack.slice(r)[0];case(r>0&&r<=this.lookahead.length):return this.lookahead[r-1];default:return null}};pt.prototype.rangeToText=function(r){if(r instanceof z0)return this.getRangeTokens(r).map(function(t){return t.char}).join("")};pt.prototype.getText=function(){return this.tokens.map(function(r){return r.char}).join("")};pt.prototype.getContext=function(r){var t=this.registeredContexts[r];return t||null};pt.prototype.on=function(r,t){var n=this.events[r];return n?n.subscribe(t):null};pt.prototype.dispatch=function(r,t){var n=this,e=this.events[r];e instanceof Ra&&e.subscribers.forEach(function(a){a.apply(n,t||[])})};pt.prototype.registerContextChecker=function(r,t,n){if(this.getContext(r))return{FAIL:"context name '"+r+"' is already registered."};if(typeof t!="function")return{FAIL:"missing context start check."};if(typeof n!="function")return{FAIL:"missing context end check."};var e=new YL(r,t,n);return this.registeredContexts[r]=e,this.contextCheckers.push(e),e};pt.prototype.getRangeTokens=function(r){var t=r.startIndex+r.endOffset;return[].concat(this.tokens.slice(r.startIndex,t))};pt.prototype.getContextRanges=function(r){var t=this.getContext(r);return t?t.ranges:{FAIL:"context checker '"+r+"' is not registered."}};pt.prototype.resetContextsRanges=function(){var r=this.registeredContexts;for(var t in r)if(r.hasOwnProperty(t)){var n=r[t];n.ranges=[]}};pt.prototype.updateContextsRanges=function(){this.resetContextsRanges();for(var r=this.tokens.map(function(e){return e.char}),t=0;t<r.length;t++){var n=new Lr(r,t);this.runContextCheck(n)}this.dispatch("updateContextsRanges",[this.registeredContexts])};pt.prototype.setEndOffset=function(r,t){var n=this.getContext(t).openRange.startIndex,e=new z0(n,r,t),a=this.getContext(t).ranges;return e.rangeId=t+"."+a.length,a.push(e),this.getContext(t).openRange=null,e};pt.prototype.runContextCheck=function(r){var t=this,n=r.index;this.contextCheckers.forEach(function(e){var a=e.contextName,i=t.getContext(a).openRange;if(!i&&e.checkStart(r)&&(i=new z0(n,null,a),t.getContext(a).openRange=i,t.dispatch("contextStart",[a,n])),i&&e.checkEnd(r)){var o=n-i.startIndex+1,A=t.setEndOffset(o,a);t.dispatch("contextEnd",[a,A])}})};pt.prototype.tokenize=function(r){this.tokens=[],this.resetContextsRanges();var t=Array.from(r);this.dispatch("start");for(var n=0;n<t.length;n++){var e=t[n],a=new Lr(t,n);this.dispatch("next",[a]),this.runContextCheck(a);var i=new Yn(e);this.tokens.push(i),this.dispatch("newToken",[i,a])}return this.dispatch("end",[this.tokens]),this.tokens};function $r(r){return/[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(r)}function a1(r){return/[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(r)}function en(r){return/[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(r)}function Ke(r){return/[A-z]/.test(r)}function wL(r){return/\s/.test(r)}function er(r){this.font=r,this.features={}}function sn(r){this.id=r.id,this.tag=r.tag,this.substitution=r.substitution}function ue(r,t){if(!r)return-1;switch(t.format){case 1:return t.glyphs.indexOf(r);case 2:for(var n=t.ranges,e=0;e<n.length;e++){var a=n[e];if(r>=a.start&&r<=a.end){var i=r-a.start;return a.index+i}}break;default:return-1}return-1}function WL(r,t){var n=ue(r,t.coverage);return n===-1?null:r+t.deltaGlyphId}function kL(r,t){var n=ue(r,t.coverage);return n===-1?null:t.substitute[n]}function ka(r,t){for(var n=[],e=0;e<r.length;e++){var a=r[e],i=t.current;i=Array.isArray(i)?i[0]:i;var o=ue(i,a);o!==-1&&n.push(o)}return n.length!==r.length?-1:n}function KL(r,t){var n=t.inputCoverage.length+t.lookaheadCoverage.length+t.backtrackCoverage.length;if(r.context.length<n)return[];var e=ka(t.inputCoverage,r);if(e===-1)return[];var a=t.inputCoverage.length-1;if(r.lookahead.length<t.lookaheadCoverage.length)return[];for(var i=r.lookahead.slice(a);i.length&&en(i[0].char);)i.shift();var o=new Lr(i,0),A=ka(t.lookaheadCoverage,o),x=[].concat(r.backtrack);for(x.reverse();x.length&&en(x[0].char);)x.shift();if(x.length<t.backtrackCoverage.length)return[];var E=new Lr(x,0),l=ka(t.backtrackCoverage,E),T=e.length===t.inputCoverage.length&&A.length===t.lookaheadCoverage.length&&l.length===t.backtrackCoverage.length,s=[];if(T)for(var c=0;c<t.lookupRecords.length;c++)for(var I=t.lookupRecords[c],h=I.lookupListIndex,S=this.getLookupByIndex(h),p=0;p<S.subtables.length;p++){var u=S.subtables[p],D=this.getLookupMethod(S,u),M=this.getSubstitutionType(S,u);if(M==="12")for(var f=0;f<e.length;f++){var O=r.get(f),g=D(O);g&&s.push(g)}}return s}function VL(r,t){var n=r.current,e=ue(n,t.coverage);if(e===-1)return null;for(var a,i=t.ligatureSets[e],o=0;o<i.length;o++){a=i[o];for(var A=0;A<a.components.length;A++){var x=r.lookahead[A],E=a.components[A];if(x!==E)break;if(A===a.components.length-1)return a}}return null}function JL(r,t){var n=ue(r,t.coverage);return n===-1?null:t.sequences[n]}er.prototype.getDefaultScriptFeaturesIndexes=function(){for(var r=this.font.tables.gsub.scripts,t=0;t<r.length;t++){var n=r[t];if(n.tag==="DFLT")return n.script.defaultLangSys.featureIndexes}return[]};er.prototype.getScriptFeaturesIndexes=function(r){var t=this.font.tables;if(!t.gsub)return[];if(!r)return this.getDefaultScriptFeaturesIndexes();for(var n=this.font.tables.gsub.scripts,e=0;e<n.length;e++){var a=n[e];if(a.tag===r&&a.script.defaultLangSys)return a.script.defaultLangSys.featureIndexes;var i=a.langSysRecords;if(i)for(var o=0;o<i.length;o++){var A=i[o];if(A.tag===r){var x=A.langSys;return x.featureIndexes}}}return this.getDefaultScriptFeaturesIndexes()};er.prototype.mapTagsToFeatures=function(r,t){for(var n={},e=0;e<r.length;e++){var a=r[e].tag,i=r[e].feature;n[a]=i}this.features[t].tags=n};er.prototype.getScriptFeatures=function(r){var t=this.features[r];if(this.features.hasOwnProperty(r))return t;var n=this.getScriptFeaturesIndexes(r);if(!n)return null;var e=this.font.tables.gsub;return t=n.map(function(a){return e.features[a]}),this.features[r]=t,this.mapTagsToFeatures(t,r),t};er.prototype.getSubstitutionType=function(r,t){var n=r.lookupType.toString(),e=t.substFormat.toString();return n+e};er.prototype.getLookupMethod=function(r,t){var n=this,e=this.getSubstitutionType(r,t);switch(e){case"11":return function(a){return WL.apply(n,[a,t])};case"12":return function(a){return kL.apply(n,[a,t])};case"63":return function(a){return KL.apply(n,[a,t])};case"41":return function(a){return VL.apply(n,[a,t])};case"21":return function(a){return JL.apply(n,[a,t])};default:throw new Error("lookupType: "+r.lookupType+" - substFormat: "+t.substFormat+" is not yet supported")}};er.prototype.lookupFeature=function(r){var t=r.contextParams,n=t.index,e=this.getFeature({tag:r.tag,script:r.script});if(!e)return new Error("font '"+this.font.names.fullName.en+"' doesn't support feature '"+r.tag+"' for script '"+r.script+"'.");for(var a=this.getFeatureLookups(e),i=[].concat(t.context),o=0;o<a.length;o++)for(var A=a[o],x=this.getLookupSubtables(A),E=0;E<x.length;E++){var l=x[E],T=this.getSubstitutionType(A,l),s=this.getLookupMethod(A,l),c=void 0;switch(T){case"11":c=s(t.current),c&&i.splice(n,1,new sn({id:11,tag:r.tag,substitution:c}));break;case"12":c=s(t.current),c&&i.splice(n,1,new sn({id:12,tag:r.tag,substitution:c}));break;case"63":c=s(t),Array.isArray(c)&&c.length&&i.splice(n,1,new sn({id:63,tag:r.tag,substitution:c}));break;case"41":c=s(t),c&&i.splice(n,1,new sn({id:41,tag:r.tag,substitution:c}));break;case"21":c=s(t.current),c&&i.splice(n,1,new sn({id:21,tag:r.tag,substitution:c}));break}t=new Lr(i,n),!(Array.isArray(c)&&!c.length)&&(c=null)}return i.length?i:null};er.prototype.supports=function(r){if(!r.script)return!1;this.getScriptFeatures(r.script);var t=this.features.hasOwnProperty(r.script);if(!r.tag)return t;var n=this.features[r.script].some(function(e){return e.tag===r.tag});return t&&n};er.prototype.getLookupSubtables=function(r){return r.subtables||null};er.prototype.getLookupByIndex=function(r){var t=this.font.tables.gsub.lookups;return t[r]||null};er.prototype.getFeatureLookups=function(r){return r.lookupListIndexes.map(this.getLookupByIndex.bind(this))};er.prototype.getFeature=function(t){if(!this.font)return{FAIL:"No font was found"};this.features.hasOwnProperty(t.script)||this.getScriptFeatures(t.script);var n=this.features[t.script];return n?n.tags[t.tag]?this.features[t.script].tags[t.tag]:null:{FAIL:"No feature for script "+t.script}};function _L(r){var t=r.current,n=r.get(-1);return n===null&&$r(t)||!$r(n)&&$r(t)}function ZL(r){var t=r.get(1);return t===null||!$r(t)}var zL={startCheck:_L,endCheck:ZL};function XL(r){var t=r.current,n=r.get(-1);return($r(t)||en(t))&&!$r(n)}function jL(r){var t=r.get(1);switch(!0){case t===null:return!0;case(!$r(t)&&!en(t)):var n=wL(t);if(!n)return!0;if(n){var e=!1;if(e=r.lookahead.some(function(a){return $r(a)||en(a)}),!e)return!0}break;default:return!1}}var QL={startCheck:XL,endCheck:jL};function qL(r,t,n){t[n].setState(r.tag,r.substitution)}function $L(r,t,n){t[n].setState(r.tag,r.substitution)}function tT(r,t,n){r.substitution.forEach(function(e,a){var i=t[n+a];i.setState(r.tag,e)})}function rT(r,t,n){var e=t[n];e.setState(r.tag,r.substitution.ligGlyph);for(var a=r.substitution.components.length,i=0;i<a;i++)e=t[n+i+1],e.setState("deleted",!0)}var ao={11:qL,12:$L,63:tT,41:rT};function X0(r,t,n){r instanceof sn&&ao[r.id]&&ao[r.id](r,t,n)}function nT(r){for(var t=[].concat(r.backtrack),n=t.length-1;n>=0;n--){var e=t[n],a=a1(e),i=en(e);if(!a&&!i)return!0;if(a)return!1}return!1}function eT(r){if(a1(r.current))return!1;for(var t=0;t<r.lookahead.length;t++){var n=r.lookahead[t],e=en(n);if(!e)return!0}return!1}function aT(r){var t=this,n="arab",e=this.featuresTags[n],a=this.tokenizer.getRangeTokens(r);if(a.length!==1){var i=new Lr(a.map(function(A){return A.getState("glyphIndex")}),0),o=new Lr(a.map(function(A){return A.char}),0);a.forEach(function(A,x){if(!en(A.char)){i.setCurrentIndex(x),o.setCurrentIndex(x);var E=0;nT(o)&&(E|=1),eT(o)&&(E|=2);var l;switch(E){case 1:l="fina";break;case 2:l="init";break;case 3:l="medi";break}if(e.indexOf(l)!==-1){var T=t.query.lookupFeature({tag:l,script:n,contextParams:i});if(T instanceof Error)return console.info(T.message);T.forEach(function(s,c){s instanceof sn&&(X0(s,a,c),i.context[c]=s.substitution)})}}})}}function io(r,t){var n=r.map(function(e){return e.activeState.value});return new Lr(n,t||0)}function iT(r){var t=this,n="arab",e=this.tokenizer.getRangeTokens(r),a=io(e);a.context.forEach(function(i,o){a.setCurrentIndex(o);var A=t.query.lookupFeature({tag:"rlig",script:n,contextParams:a});A.length&&(A.forEach(function(x){return X0(x,e,o)}),a=io(e))})}function oT(r){var t=r.current,n=r.get(-1);return n===null&&Ke(t)||!Ke(n)&&Ke(t)}function AT(r){var t=r.get(1);return t===null||!Ke(t)}var xT={startCheck:oT,endCheck:AT};function oo(r,t){var n=r.map(function(e){return e.activeState.value});return new Lr(n,t||0)}function ET(r){var t=this,n="latn",e=this.tokenizer.getRangeTokens(r),a=oo(e);a.context.forEach(function(i,o){a.setCurrentIndex(o);var A=t.query.lookupFeature({tag:"liga",script:n,contextParams:a});A.length&&(A.forEach(function(x){return X0(x,e,o)}),a=oo(e))})}function dr(r){this.baseDir=r||"ltr",this.tokenizer=new pt,this.featuresTags={}}dr.prototype.setText=function(r){this.text=r};dr.prototype.contextChecks={latinWordCheck:xT,arabicWordCheck:zL,arabicSentenceCheck:QL};function Ka(r){var t=this.contextChecks[r+"Check"];return this.tokenizer.registerContextChecker(r,t.startCheck,t.endCheck)}function lT(){return Ka.call(this,"latinWord"),Ka.call(this,"arabicWord"),Ka.call(this,"arabicSentence"),this.tokenizer.tokenize(this.text)}function sT(){var r=this,t=this.tokenizer.getContextRanges("arabicSentence");t.forEach(function(n){var e=r.tokenizer.getRangeTokens(n);r.tokenizer.replaceRange(n.startIndex,n.endOffset,e.reverse())})}dr.prototype.registerFeatures=function(r,t){var n=this,e=t.filter(function(a){return n.query.supports({script:r,tag:a})});this.featuresTags.hasOwnProperty(r)?this.featuresTags[r]=this.featuresTags[r].concat(e):this.featuresTags[r]=e};dr.prototype.applyFeatures=function(r,t){if(!r)throw new Error("No valid font was provided to apply features");this.query||(this.query=new er(r));for(var n=0;n<t.length;n++){var e=t[n];this.query.supports({script:e.script})&&this.registerFeatures(e.script,e.tags)}};dr.prototype.registerModifier=function(r,t,n){this.tokenizer.registerModifier(r,t,n)};function j0(){if(this.tokenizer.registeredModifiers.indexOf("glyphIndex")===-1)throw new Error("glyphIndex modifier is required to apply arabic presentation features.")}function LT(){var r=this,t="arab";if(this.featuresTags.hasOwnProperty(t)){j0.call(this);var n=this.tokenizer.getContextRanges("arabicWord");n.forEach(function(e){aT.call(r,e)})}}function TT(){var r=this,t="arab";if(this.featuresTags.hasOwnProperty(t)){var n=this.featuresTags[t];if(n.indexOf("rlig")!==-1){j0.call(this);var e=this.tokenizer.getContextRanges("arabicWord");e.forEach(function(a){iT.call(r,a)})}}}function cT(){var r=this,t="latn";if(this.featuresTags.hasOwnProperty(t)){var n=this.featuresTags[t];if(n.indexOf("liga")!==-1){j0.call(this);var e=this.tokenizer.getContextRanges("latinWord");e.forEach(function(a){ET.call(r,a)})}}}dr.prototype.checkContextReady=function(r){return!!this.tokenizer.getContext(r)};dr.prototype.applyFeaturesToContexts=function(){this.checkContextReady("arabicWord")&&(LT.call(this),TT.call(this)),this.checkContextReady("latinWord")&&cT.call(this),this.checkContextReady("arabicSentence")&&sT.call(this)};dr.prototype.processText=function(r){(!this.text||this.text!==r)&&(this.setText(r),lT.call(this),this.applyFeaturesToContexts())};dr.prototype.getBidiText=function(r){return this.processText(r),this.tokenizer.getText()};dr.prototype.getTextGlyphs=function(r){this.processText(r);for(var t=[],n=0;n<this.tokenizer.tokens.length;n++){var e=this.tokenizer.tokens[n];if(!e.state.deleted){var a=e.activeState.value;t.push(Array.isArray(a)?a[0]:a)}}return t};function xt(r){if(r=r||{},r.tables=r.tables||{},!r.empty){Kn(r.familyName,"When creating a new Font object, familyName is required."),Kn(r.styleName,"When creating a new Font object, styleName is required."),Kn(r.unitsPerEm,"When creating a new Font object, unitsPerEm is required."),Kn(r.ascender,"When creating a new Font object, ascender is required."),Kn(r.descender<=0,"When creating a new Font object, negative descender value is required."),this.names={fontFamily:{en:r.familyName||" "},fontSubfamily:{en:r.styleName||" "},fullName:{en:r.fullName||r.familyName+" "+r.styleName},postScriptName:{en:r.postScriptName||(r.familyName+r.styleName).replace(/\s/g,"")},designer:{en:r.designer||" "},designerURL:{en:r.designerURL||" "},manufacturer:{en:r.manufacturer||" "},manufacturerURL:{en:r.manufacturerURL||" "},license:{en:r.license||" "},licenseURL:{en:r.licenseURL||" "},version:{en:r.version||"Version 0.1"},description:{en:r.description||" "},copyright:{en:r.copyright||" "},trademark:{en:r.trademark||" "}},this.unitsPerEm=r.unitsPerEm||1e3,this.ascender=r.ascender,this.descender=r.descender,this.slope=r.slope,this.italicAngle=r.italicAngle,this.createdTimestamp=r.createdTimestamp;var t=0;this.italicAngle<0?t|=this.fsSelectionValues.ITALIC:this.italicAngle>0&&(t|=this.fsSelectionValues.OBLIQUE),this.weightClass>=600&&(t|=this.fsSelectionValues.BOLD),t==0&&(t=this.fsSelectionValues.REGULAR),this.tables=Object.assign(r.tables,{os2:Object.assign({usWeightClass:r.weightClass||this.usWeightClasses.MEDIUM,usWidthClass:r.widthClass||this.usWidthClasses.MEDIUM,bFamilyType:r.panose[0]||0,bSerifStyle:r.panose[1]||0,bWeight:r.panose[2]||0,bProportion:r.panose[3]||0,bContrast:r.panose[4]||0,bStrokeVariation:r.panose[5]||0,bArmStyle:r.panose[6]||0,bLetterform:r.panose[7]||0,bMidline:r.panose[8]||0,bXHeight:r.panose[9]||0,fsSelection:t},r.tables.os2)})}this.supported=!0,this.glyphs=new Dr.GlyphSet(this,r.glyphs||[]),this.encoding=new uA(this),this.position=new Se(this),this.substitution=new hr(this),this.tables=this.tables||{},this._push=null,this._hmtxTableData={},Object.defineProperty(this,"hinting",{get:function(){if(this._hinting)return this._hinting;if(this.outlinesFormat==="truetype")return this._hinting=new t1(this)}})}xt.prototype.hasChar=function(r){return this.encoding.charToGlyphIndex(r)!==null};xt.prototype.charToGlyphIndex=function(r){return this.encoding.charToGlyphIndex(r)};xt.prototype.charToGlyph=function(r){var t=this.charToGlyphIndex(r),n=this.glyphs.get(t);return n||(n=this.glyphs.get(0)),n};xt.prototype.updateFeatures=function(r){return this.defaultRenderOptions.features.map(function(t){return t.script==="latn"?{script:"latn",tags:t.tags.filter(function(n){return r[n]})}:t})};xt.prototype.stringToGlyphs=function(r,t){var n=this,e=new dr,a=function(T){return n.charToGlyphIndex(T.char)};e.registerModifier("glyphIndex",null,a);var i=t?this.updateFeatures(t.features):this.defaultRenderOptions.features;e.applyFeatures(this,i);for(var o=e.getTextGlyphs(r),A=o.length,x=new Array(A),E=this.glyphs.get(0),l=0;l<A;l+=1)x[l]=this.glyphs.get(o[l])||E;return x};xt.prototype.nameToGlyphIndex=function(r){return this.glyphNames.nameToGlyphIndex(r)};xt.prototype.nameToGlyph=function(r){var t=this.nameToGlyphIndex(r),n=this.glyphs.get(t);return n||(n=this.glyphs.get(0)),n};xt.prototype.glyphIndexToName=function(r){return this.glyphNames.glyphIndexToName?this.glyphNames.glyphIndexToName(r):""};xt.prototype.getKerningValue=function(r,t){r=r.index||r,t=t.index||t;var n=this.position.defaultKerningTables;return n?this.position.getKerningValue(n,r,t):this.kerningPairs[r+","+t]||0};xt.prototype.defaultRenderOptions={kerning:!0,features:[{script:"arab",tags:["init","medi","fina","rlig"]},{script:"latn",tags:["liga","rlig"]}]};xt.prototype.forEachGlyph=function(r,t,n,e,a,i){t=t!==void 0?t:0,n=n!==void 0?n:0,e=e!==void 0?e:72,a=Object.assign({},this.defaultRenderOptions,a);var o=1/this.unitsPerEm*e,A=this.stringToGlyphs(r,a),x;if(a.kerning){var E=a.script||this.position.getDefaultScriptName();x=this.position.getKerningTables(E,a.language)}for(var l=0;l<A.length;l+=1){var T=A[l];if(i.call(this,T,t,n,e,a),T.advanceWidth&&(t+=T.advanceWidth*o),a.kerning&&l<A.length-1){var s=x?this.position.getKerningValue(x,T.index,A[l+1].index):this.getKerningValue(T,A[l+1]);t+=s*o}a.letterSpacing?t+=a.letterSpacing*e:a.tracking&&(t+=a.tracking/1e3*e)}return t};xt.prototype.getPath=function(r,t,n,e,a){var i=new Bt;return this.forEachGlyph(r,t,n,e,a,function(o,A,x,E){var l=o.getPath(A,x,E,a,this);i.extend(l)}),i};xt.prototype.getPaths=function(r,t,n,e,a){var i=[];return this.forEachGlyph(r,t,n,e,a,function(o,A,x,E){var l=o.getPath(A,x,E,a,this);i.push(l)}),i};xt.prototype.getAdvanceWidth=function(r,t,n){return this.forEachGlyph(r,0,0,t,n,function(){})};xt.prototype.draw=function(r,t,n,e,a,i){this.getPath(t,n,e,a,i).draw(r)};xt.prototype.drawPoints=function(r,t,n,e,a,i){this.forEachGlyph(t,n,e,a,i,function(o,A,x,E){o.drawPoints(r,A,x,E)})};xt.prototype.drawMetrics=function(r,t,n,e,a,i){this.forEachGlyph(t,n,e,a,i,function(o,A,x,E){o.drawMetrics(r,A,x,E)})};xt.prototype.getEnglishName=function(r){var t=this.names[r];if(t)return t.en};xt.prototype.validate=function(){var r=this;function t(e,a){}function n(e){var a=r.getEnglishName(e);a&&a.trim().length>0}n("fontFamily"),n("weightName"),n("manufacturer"),n("copyright"),n("version"),this.unitsPerEm>0};xt.prototype.toTables=function(){return rs.fontToTable(this)};xt.prototype.toBuffer=function(){return console.warn("Font.toBuffer is deprecated. Use Font.toArrayBuffer instead."),this.toArrayBuffer()};xt.prototype.toArrayBuffer=function(){for(var r=this.toTables(),t=r.encode(),n=new ArrayBuffer(t.length),e=new Uint8Array(n),a=0;a<t.length;a++)e[a]=t[a];return n};xt.prototype.download=function(r){var t=this.getEnglishName("fontFamily"),n=this.getEnglishName("fontSubfamily");r=r||t.replace(/\s/g,"")+"-"+n+".otf";var e=this.toArrayBuffer();if(es())if(window.URL=window.URL||window.webkitURL,window.URL){var a=new DataView(e),i=new Blob([a],{type:"font/opentype"}),o=document.createElement("a");o.href=window.URL.createObjectURL(i),o.download=r;var A=document.createEvent("MouseEvents");A.initEvent("click",!0,!1),o.dispatchEvent(A)}else console.warn("Font file could not be downloaded. Try using a different browser.");else{var x=require("fs"),E=as(e);x.writeFileSync(r,E)}};xt.prototype.fsSelectionValues={ITALIC:1,UNDERSCORE:2,NEGATIVE:4,OUTLINED:8,STRIKEOUT:16,BOLD:32,REGULAR:64,USER_TYPO_METRICS:128,WWS:256,OBLIQUE:512};xt.prototype.usWidthClasses={ULTRA_CONDENSED:1,EXTRA_CONDENSED:2,CONDENSED:3,SEMI_CONDENSED:4,MEDIUM:5,SEMI_EXPANDED:6,EXPANDED:7,EXTRA_EXPANDED:8,ULTRA_EXPANDED:9};xt.prototype.usWeightClasses={THIN:100,EXTRA_LIGHT:200,LIGHT:300,NORMAL:400,MEDIUM:500,SEMI_BOLD:600,BOLD:700,EXTRA_BOLD:800,BLACK:900};function i1(r,t){var n=JSON.stringify(r),e=256;for(var a in t){var i=parseInt(a);if(!(!i||i<256)){if(JSON.stringify(t[a])===n)return i;e<=i&&(e=i+1)}}return t[e]=r,e}function IT(r,t,n){var e=i1(t.name,n);return[{name:"tag_"+r,type:"TAG",value:t.tag},{name:"minValue_"+r,type:"FIXED",value:t.minValue<<16},{name:"defaultValue_"+r,type:"FIXED",value:t.defaultValue<<16},{name:"maxValue_"+r,type:"FIXED",value:t.maxValue<<16},{name:"flags_"+r,type:"USHORT",value:0},{name:"nameID_"+r,type:"USHORT",value:e}]}function hT(r,t,n){var e={},a=new P.Parser(r,t);return e.tag=a.parseTag(),e.minValue=a.parseFixed(),e.defaultValue=a.parseFixed(),e.maxValue=a.parseFixed(),a.skip("uShort",1),e.name=n[a.parseUShort()]||{},e}function dT(r,t,n,e){for(var a=i1(t.name,e),i=[{name:"nameID_"+r,type:"USHORT",value:a},{name:"flags_"+r,type:"USHORT",value:0}],o=0;o<n.length;++o){var A=n[o].tag;i.push({name:"axis_"+r+" "+A,type:"FIXED",value:t.coordinates[A]<<16})}return i}function ST(r,t,n,e){var a={},i=new P.Parser(r,t);a.name=e[i.parseUShort()]||{},i.skip("uShort",1),a.coordinates={};for(var o=0;o<n.length;++o)a.coordinates[n[o].tag]=i.parseFixed();return a}function pT(r,t){var n=new Y.Table("fvar",[{name:"version",type:"ULONG",value:65536},{name:"offsetToData",type:"USHORT",value:0},{name:"countSizePairs",type:"USHORT",value:2},{name:"axisCount",type:"USHORT",value:r.axes.length},{name:"axisSize",type:"USHORT",value:20},{name:"instanceCount",type:"USHORT",value:r.instances.length},{name:"instanceSize",type:"USHORT",value:4+r.axes.length*4}]);n.offsetToData=n.sizeOf();for(var e=0;e<r.axes.length;e++)n.fields=n.fields.concat(IT(e,r.axes[e],t));for(var a=0;a<r.instances.length;a++)n.fields=n.fields.concat(dT(a,r.instances[a],r.axes,t));return n}function CT(r,t,n){var e=new P.Parser(r,t),a=e.parseULong();J.argument(a===65536,"Unsupported fvar table version.");var i=e.parseOffset16();e.skip("uShort",1);for(var o=e.parseUShort(),A=e.parseUShort(),x=e.parseUShort(),E=e.parseUShort(),l=[],T=0;T<o;T++)l.push(hT(r,t+i+T*A,n));for(var s=[],c=t+i+o*A,I=0;I<x;I++)s.push(ST(r,c+I*E,l,n));return{axes:l,instances:s}}var uT={make:pT,parse:CT},Tr=new Array(10);Tr[1]=function(){var t=this.offset+this.relativeOffset,n=this.parseUShort();if(n===1)return{posFormat:1,coverage:this.parsePointer(C.coverage),value:this.parseValueRecord()};if(n===2)return{posFormat:2,coverage:this.parsePointer(C.coverage),values:this.parseValueRecordList()};J.assert(!1,"0x"+t.toString(16)+": GPOS lookup type 1 format must be 1 or 2.")};Tr[2]=function(){var t=this.offset+this.relativeOffset,n=this.parseUShort();J.assert(n===1||n===2,"0x"+t.toString(16)+": GPOS lookup type 2 format must be 1 or 2.");var e=this.parsePointer(C.coverage),a=this.parseUShort(),i=this.parseUShort();if(n===1)return{posFormat:n,coverage:e,valueFormat1:a,valueFormat2:i,pairSets:this.parseList(C.pointer(C.list(function(){return{secondGlyph:this.parseUShort(),value1:this.parseValueRecord(a),value2:this.parseValueRecord(i)}})))};if(n===2){var o=this.parsePointer(C.classDef),A=this.parsePointer(C.classDef),x=this.parseUShort(),E=this.parseUShort();return{posFormat:n,coverage:e,valueFormat1:a,valueFormat2:i,classDef1:o,classDef2:A,class1Count:x,class2Count:E,classRecords:this.parseList(x,C.list(E,function(){return{value1:this.parseValueRecord(a),value2:this.parseValueRecord(i)}}))}}};Tr[3]=function(){return{error:"GPOS Lookup 3 not supported"}};Tr[4]=function(){return{error:"GPOS Lookup 4 not supported"}};Tr[5]=function(){return{error:"GPOS Lookup 5 not supported"}};Tr[6]=function(){return{error:"GPOS Lookup 6 not supported"}};Tr[7]=function(){return{error:"GPOS Lookup 7 not supported"}};Tr[8]=function(){return{error:"GPOS Lookup 8 not supported"}};Tr[9]=function(){return{error:"GPOS Lookup 9 not supported"}};function RT(r,t){t=t||0;var n=new C(r,t),e=n.parseVersion(1);return J.argument(e===1||e===1.1,"Unsupported GPOS table version "+e),e===1?{version:e,scripts:n.parseScriptList(),features:n.parseFeatureList(),lookups:n.parseLookupList(Tr)}:{version:e,scripts:n.parseScriptList(),features:n.parseFeatureList(),lookups:n.parseLookupList(Tr),variations:n.parseFeatureVariationsList()}}var gT=new Array(10);function yT(r){return new Y.Table("GPOS",[{name:"version",type:"ULONG",value:65536},{name:"scripts",type:"TABLE",value:new Y.ScriptList(r.scripts)},{name:"features",type:"TABLE",value:new Y.FeatureList(r.features)},{name:"lookups",type:"TABLE",value:new Y.LookupList(r.lookups,gT)}])}var NT={parse:RT,make:yT};function DT(r){var t={};r.skip("uShort");var n=r.parseUShort();J.argument(n===0,"Unsupported kern sub-table version."),r.skip("uShort",2);var e=r.parseUShort();r.skip("uShort",3);for(var a=0;a<e;a+=1){var i=r.parseUShort(),o=r.parseUShort(),A=r.parseShort();t[i+","+o]=A}return t}function OT(r){var t={};r.skip("uShort");var n=r.parseULong();n>1&&console.warn("Only the first kern subtable is supported."),r.skip("uLong");var e=r.parseUShort(),a=e&255;if(r.skip("uShort"),a===0){var i=r.parseUShort();r.skip("uShort",3);for(var o=0;o<i;o+=1){var A=r.parseUShort(),x=r.parseUShort(),E=r.parseShort();t[A+","+x]=E}}return t}function mT(r,t){var n=new P.Parser(r,t),e=n.parseUShort();if(e===0)return DT(n);if(e===1)return OT(n);throw new Error("Unsupported kern table version ("+e+").")}var BT={parse:mT};function HT(r,t,n,e){for(var a=new P.Parser(r,t),i=e?a.parseUShort:a.parseULong,o=[],A=0;A<n+1;A+=1){var x=i.call(a);e&&(x*=2),o.push(x)}return o}var FT={parse:HT};function fT(r,t){var n=require("fs");n.readFile(r,function(e,a){if(e)return t(e.message);t(null,ZA(a))})}function MT(r,t){var n=new XMLHttpRequest;n.open("get",r,!0),n.responseType="arraybuffer",n.onload=function(){return n.response?t(null,n.response):t("Font could not be loaded: "+n.statusText)},n.onerror=function(){t("Font could not be loaded")},n.send()}function Ao(r,t){for(var n=[],e=12,a=0;a<t;a+=1){var i=P.getTag(r,e),o=P.getULong(r,e+4),A=P.getULong(r,e+8),x=P.getULong(r,e+12);n.push({tag:i,checksum:o,offset:A,length:x,compression:!1}),e+=16}return n}function GT(r,t){for(var n=[],e=44,a=0;a<t;a+=1){var i=P.getTag(r,e),o=P.getULong(r,e+4),A=P.getULong(r,e+8),x=P.getULong(r,e+12),E=void 0;A<x?E="WOFF":E=!1,n.push({tag:i,offset:o,compression:E,compressedLength:A,length:x}),e+=20}return n}function Dt(r,t){if(t.compression==="WOFF"){var n=new Uint8Array(r.buffer,t.offset+2,t.compressedLength-2),e=new Uint8Array(t.length);if(fE(n,e),e.byteLength!==t.length)throw new Error("Decompression error: "+t.tag+" decompressed length doesn't match recorded length");var a=new DataView(e.buffer,0);return{data:a,offset:0}}else return{data:r,offset:t.offset}}function Q0(r,t){t=t??{};var n,e,a=new xt({empty:!0}),i=new DataView(r,0),o,A=[],x=P.getTag(i,0);if(x==="\0\0\0"||x==="true"||x==="typ1")a.outlinesFormat="truetype",o=P.getUShort(i,4),A=Ao(i,o);else if(x==="OTTO")a.outlinesFormat="cff",o=P.getUShort(i,4),A=Ao(i,o);else if(x==="wOFF"){var E=P.getTag(i,4);if(E==="\0\0\0")a.outlinesFormat="truetype";else if(E==="OTTO")a.outlinesFormat="cff";else throw new Error("Unsupported OpenType flavor "+x);o=P.getUShort(i,12),A=GT(i,o)}else throw new Error("Unsupported OpenType signature "+x);for(var l,T,s,c,I,h,S,p,u,D,M,f=0;f<o;f+=1){var O=A[f],g=void 0;switch(O.tag){case"cmap":g=Dt(i,O),a.tables.cmap=CA.parse(g.data,g.offset),a.encoding=new RA(a.tables.cmap);break;case"cvt ":g=Dt(i,O),M=new P.Parser(g.data,g.offset),a.tables.cvt=M.parseShortList(O.length/2);break;case"fvar":T=O;break;case"fpgm":g=Dt(i,O),M=new P.Parser(g.data,g.offset),a.tables.fpgm=M.parseByteList(O.length);break;case"head":g=Dt(i,O),a.tables.head=fA.parse(g.data,g.offset),a.unitsPerEm=a.tables.head.unitsPerEm,n=a.tables.head.indexToLocFormat;break;case"hhea":g=Dt(i,O),a.tables.hhea=MA.parse(g.data,g.offset),a.ascender=a.tables.hhea.ascender,a.descender=a.tables.hhea.descender,a.numberOfHMetrics=a.tables.hhea.numberOfHMetrics;break;case"hmtx":h=O;break;case"ltag":g=Dt(i,O),e=PA.parse(g.data,g.offset);break;case"maxp":g=Dt(i,O),a.tables.maxp=bA.parse(g.data,g.offset),a.numGlyphs=a.tables.maxp.numGlyphs;break;case"name":u=O;break;case"OS/2":g=Dt(i,O),a.tables.os2=p0.parse(g.data,g.offset);break;case"post":g=Dt(i,O),a.tables.post=kA.parse(g.data,g.offset),a.glyphNames=new J0(a.tables.post);break;case"prep":g=Dt(i,O),M=new P.Parser(g.data,g.offset),a.tables.prep=M.parseByteList(O.length);break;case"glyf":s=O;break;case"loca":p=O;break;case"CFF ":l=O;break;case"kern":S=O;break;case"GPOS":c=O;break;case"GSUB":I=O;break;case"meta":D=O;break}}var v=Dt(i,u);if(a.tables.name=WA.parse(v.data,v.offset,e),a.names=a.tables.name,s&&p){var k=n===0,z=Dt(i,p),X=FT.parse(z.data,z.offset,a.numGlyphs,k),st=Dt(i,s);a.glyphs=QA.parse(st.data,st.offset,X,a,t)}else if(l){var vt=Dt(i,l);FA.parse(vt.data,vt.offset,a,t)}else throw new Error("Font doesn't contain TrueType or CFF outlines.");var gt=Dt(i,h);if(GA.parse(a,gt.data,gt.offset,a.numberOfHMetrics,a.numGlyphs,a.glyphs,t),$E(a,t),S){var et=Dt(i,S);a.kerningPairs=BT.parse(et.data,et.offset)}else a.kerningPairs={};if(c){var yt=Dt(i,c);a.tables.gpos=NT.parse(yt.data,yt.offset),a.position.init()}if(I){var It=Dt(i,I);a.tables.gsub=KA.parse(It.data,It.offset)}if(T){var Ct=Dt(i,T);a.tables.fvar=uT.parse(Ct.data,Ct.offset,a.names)}if(D){var Ht=Dt(i,D);a.tables.meta=VA.parse(Ht.data,Ht.offset),a.metas=a.tables.meta}return a}function PT(r,t,n){var e=typeof window>"u",a=e?fT:MT;return new Promise(function(i,o){a(r,function(A,x){if(A){if(t)return t(A);o(A)}var E;try{E=Q0(x,n)}catch(l){if(t)return t(l,null);o(l)}if(t)return t(null,E);i(E)})})}function bT(r,t){var n=require("fs"),e=n.readFileSync(r);return Q0(ZA(e),t)}var an=Object.freeze({__proto__:null,Font:xt,Glyph:nr,Path:Bt,BoundingBox:wr,_parse:P,parse:Q0,load:PT,loadSync:bT});function UT(r){let t,n;if(typeof window.DOMParser<"u")t=new window.DOMParser().parseFromString(r,"text/xml");else if(typeof window.ActiveXObject<"u"&&new window.ActiveXObject("Microsoft.XMLDOM"))t=new window.ActiveXObject("Microsoft.XMLDOM"),t.async="false",t.loadXML(r);else throw console.warn("No XML document parser found."),n=new SyntaxError("No XML document parser found."),n;if(t.getElementsByTagName("parsererror").length){const x=t.getElementsByTagName("div")[0].innerHTML;throw n=new SyntaxError(A(x)),n}return{name:t.documentElement.nodeName,attributes:o(t.documentElement.attributes),content:i(t.documentElement)};function i(x){const E=x.childNodes;if(E.length===0)return A(x.nodeValue);const l=[];let T,s,c;for(const I of E)T={},I.nodeName!=="#comment"&&(s=i(I),c=o(I.attributes),I.nodeName==="#text"&&JSON.stringify(c)==="{}"?T=A(s):(T.name=I.nodeName,T.attributes=c,T.content=s),T!==""&&l.push(T));return l}function o(x){if(!x||!x.length)return{};const E={};for(const l of x)E[l.name]=A(l.value);return E}function A(x){try{return x=x.replace(/^\s+|\s+$/g,""),x.replace(/(\r\n|\n|\r|\t)/gm,"")}catch{return""}}}let Va=0;function _r(r){const t=document.getElementById("progress-indicator__message"),n=document.getElementById("progress-indicator__bar");Va=(Va+.95)%100,n.style.backgroundPosition=`${Va}%`,r&&(t.innerHTML=r)}function YT(){let r=L({id:"progress-indicator__wrapper"}),t=L({id:"progress-indicator__message",innerHTML:"Working..."}),n=L({tag:"div",id:"progress-indicator__bar"});return y(r,[t,n]),r}function Ja(r){const t=F,n=d();if(t.mousePosition=o1(r),r.button===3||r.button===4){rt(r);return}if(r.button,r.button===1&&(r.type==="mousedown"&&Tx(r),r.type==="mouseup"&&cx(r)),r.button===0){switch(n.selectedTool){case"resize":t.currentToolHandler=n.eventHandlers.tool_resize;break;case"pathEdit":t.currentToolHandler=n.eventHandlers.tool_pathEdit;break;case"pan":t.currentToolHandler=n.eventHandlers.tool_pan;break;case"pathAddPoint":t.currentToolHandler=n.eventHandlers.tool_pathAddPoint;break;case"newPath":t.currentToolHandler=n.eventHandlers.tool_addPath;break;case"newRectangle":t.currentToolHandler=n.eventHandlers.tool_addRectOval;break;case"newOval":t.currentToolHandler=n.eventHandlers.tool_addRectOval;break;case"kern":t.currentToolHandler=n.eventHandlers.tool_kern;break;case n.selectedTool:t.currentToolHandler=n.eventHandlers.tool_resize}t.currentToolHandler[r.type](r)}}function o1(r){let t={x:!1,y:!1};return r.offsetX||r.offsetY?(t.x=r.offsetX,t.y=r.offsetY):(r.layerX||r.layerY)&&(t.x=r.layerX,t.y=r.layerY),t}function u0(){const r=d();r.multiSelect.points.clear(),r.multiSelect.shapes.clear()}function xo(){let t=d().multiSelect.shapes,n=F.handle,e=ht(F.mousePosition.x),a=St(F.mousePosition.y),i=ht(F.lastX),A=St(F.lastY)-a,x=i-e,E=t.ratioLock,l=t.maxes;switch(n.includes("e")&&e+x<=l.xMax&&(x=0),n.includes("w")&&(e+x>=l.xMin&&(x=0),l.width+x<0&&(x=l.width*-.9)),n.includes("n")&&a<=l.yMax-A&&(A=0),n.includes("s")&&(a+A>=l.yMin&&(A=0),l.height+A<0&&(A=l.height*-.9)),n){case"n":Rt("n")&&(K("n-resize"),t.updateShapeSize({width:0,height:A*-1,ratioLock:E,transformOrigin:"bottom-center"}));break;case"ne":Rt("ne")&&(K("ne-resize"),t.updateShapeSize({width:x*-1,height:A*-1,ratioLock:E,transformOrigin:"bottom-left"}));break;case"e":Rt("e")&&(K("e-resize"),t.updateShapeSize({width:x*-1,height:0,ratioLock:E,transformOrigin:"middle-left"}));break;case"be":Rt("be")&&(K("e-resize"),t.updateShapeSize({width:x*-1,height:0,ratioLock:E,transformOrigin:"baseline-left"}));break;case"se":Rt("se")&&(K("se-resize"),t.updateShapeSize({width:x*-1,height:A,ratioLock:E,transformOrigin:"top-left"}));break;case"s":Rt("s")&&(K("s-resize"),t.updateShapeSize({width:0,height:A,ratioLock:E,transformOrigin:"top-center"}));break;case"sw":Rt("sw")&&(K("sw-resize"),t.updateShapeSize({width:x,height:A,ratioLock:E,transformOrigin:"top-right"}));break;case"bw":Rt("bw")&&(K("ew-resize"),t.updateShapeSize({width:x,height:0,ratioLock:E,transformOrigin:"baseline-right"}));break;case"w":Rt("w")&&(K("w-resize"),t.updateShapeSize({width:x,height:0,ratioLock:E,transformOrigin:"middle-right"}));break;case"nw":Rt("nw")&&(K("nw-resize"),t.updateShapeSize({width:x,height:A*-1,ratioLock:E,transformOrigin:"bottom-right"}));break}}function A1(r,t){const n=d();if(dx(r,t)){let e=Yd(r,t);K("pointer"),e!==F.canvasHotspotHovering&&n.publish("editCanvasView",n.view),F.canvasHotspotHovering=e}else F.canvasHotspotHovering&&n.publish("editCanvasView",n.view),F.canvasHotspotHovering=!1}function Rt(r){const t=d(),n=t.multiSelect.shapes;let e=n;n.length>1&&(e=n.virtualGlyph);let a=e.ratioLock,i=e.xLock,o=e.yLock,A=e.wLock,x=e.hLock,E=e.maxes.yMax,l=e.maxes.yMin,T=ft/2/t.view.dz,s=!0;switch(r){case"nw":s=a?!1:!o&&!x&&!i&&!A;break;case"n":s=!o&&!x;break;case"ne":s=a?!1:!o&&!x&&!A;break;case"e":s=!A;break;case"be":s=!A&&a&&l<T*-1&&E>T;break;case"se":s=a?!1:!x&&!A;break;case"s":s=!x;break;case"sw":s=a?!1:!x&&!i&&!A;break;case"bw":s=!i&&!A&&a&&l<T*-1&&E>T;break;case"w":s=!i&&!A}return s}function vT(r){let t=r.deltaY*-1;const n=d(),e=o1(r);n.nav.isOnEditCanvasPage&&(r.ctrlKey||r.metaKey)&&(rt(r),Ae(),F.hoverPoint=!1,t>0?n.updateViewZoom(1.1,e):n.updateViewZoom(.9,e))}let ft=7,ea=40,q0=it.blue.l65,wT=it.green.l65,WT=it.gray.l65,kT="#000",x1="#FFF",KT=3;function VT(r){let n=d().multiSelect.shapes;if(n.length<1)return;let e=n.maxes,a=ga();E1(r,e,a.thickness,a.accent)}function JT(r){let t=ga();zT(r,t.accent,t.thickness)}function _T(r){let n=d().multiSelect.shapes;if(n.length<1)return;let e=n.maxes,a=ga();ZT(r,e,a.thickness,a.accent)}function ga(){let t=d().multiSelect.shapes,n=1,e=q0;return t.length>1?(n=KT,e=WT):t.singleton.objType==="ComponentInstance"&&(e=wT),{thickness:n,accent:e}}function E1(r,t,n,e){const a=$0(t,n);let i=a.rightX-a.leftX,o=a.topY-a.bottomY;r.fillStyle="transparent",r.strokeStyle=e,r.lineWidth=n,r.strokeRect(a.leftX,a.bottomY,i,o)}function ZT(r,t,n,e){let a=$0(t,n);if(r.fillStyle=x1,r.lineWidth=1,r.strokeStyle=e,d().multiSelect.shapes.isRotatable()){const o=ft/2;r.lineWidth=n,l1(r,{x:a.midX+1,y:a.topY},{x:a.midX+1,y:a.topY-ea}),r.lineWidth=1,ti(r,{x:a.midX+1,y:a.topY-ea+o})}Rt("nw")&&pr(r,a.nw),Rt("n")&&pr(r,a.n),Rt("ne")&&pr(r,a.ne),Rt("e")&&pr(r,a.e),Rt("be")&&pr(r,a.be),Rt("se")&&pr(r,a.se),Rt("s")&&pr(r,a.s),Rt("sw")&&pr(r,a.sw),Rt("bw")&&pr(r,a.bw),Rt("w")&&pr(r,a.w)}function zT(r,t=q0,n=1){const e=F;let a=e.rotationStartCenter,i=e.rotationStartMaxesTopY,o=e.mousePosition.x,A=e.mousePosition.y,x=Zr({x:ht(o),y:St(A)},a);e.isShiftDown&&(x=Yo(x));let l={x:a.x,y:i};Ze(l,x,a),Ze(l,Math.PI/-2,a);let T=!1;Math.abs(x)>Math.PI/2&&(T=!0);let s={x:At(l.x),y:q(l.y)},c={x:At(a.x),y:q(a.y)};i=q(i);let I=gn(c,s);r.fillStyle=t,r.strokeStyle=t,r.globalAlpha=.3,r.beginPath(),r.moveTo(c.x,c.y),r.arc(c.x,c.y,I,Math.PI/-2,x*-1,T),r.closePath(),r.stroke(),r.fill(),r.strokeStyle=t,r.fillStyle=x1,r.lineWidth=n,l1(r,{x:s.x,y:s.y},{x:c.x,y:c.y}),r.lineWidth=1,ti(r,s);let h=R(vo(x),1);T&&(h-=360),h=R(h,1),r.font='24px FiraGo, "Open Sans", sans-serif',r.fillStyle=t,r.globalAlpha=.8,r.fillText(""+h+"°",c.x,i-24),r.globalAlpha=1}function Eo(r,t,n){if(!n)return!1;const e=d();let a=!1,i=ft,o=$0(n);return e.multiSelect.shapes.isRotatable()&&r>o.midX&&r<o.midX+i&&t>o.topY-ea&&t<o.topY-ea+i&&(a="rotate"),r>o.nw.x&&r<o.nw.x+i&&t>o.nw.y&&t<o.nw.y+i&&(a="nw"),r>o.n.x&&r<o.n.x+i&&t>o.n.y&&t<o.n.y+i&&(a="n"),r>o.ne.x&&r<o.ne.x+i&&t>o.ne.y&&t<o.ne.y+i&&(a="ne"),r>o.e.x&&r<o.e.x+i&&t>o.e.y&&t<o.e.y+i&&(a="e"),r>o.be.x&&r<o.be.x+i&&t>o.be.y&&t<o.be.y+i&&(a="be"),r>o.se.x&&r<o.se.x+i&&t>o.se.y&&t<o.se.y+i&&(a="se"),r>o.s.x&&r<o.s.x+i&&t>o.s.y&&t<o.s.y+i&&(a="s"),r>o.sw.x&&r<o.sw.x+i&&t>o.sw.y&&t<o.sw.y+i&&(a="sw"),r>o.bw.x&&r<o.bw.x+i&&t>o.bw.y&&t<o.bw.y+i&&(a="bw"),r>o.w.x&&r<o.w.x+i&&t>o.w.y&&t<o.w.y+i&&(a="w"),a}function $0(r,t){const n=ft,e=ft/2;t=1;const a=1;let i=At(r.xMin),o=R(At(r.xMin)+(At(r.xMax)-At(r.xMin))/2),A=At(r.xMax),x=q(r.yMax),E=q(0),l=R(q(r.yMax)+(q(r.yMin)-q(r.yMax))/2),T=q(r.yMin);return t>1&&(i-=t,A+=t,x-=t,T+=t),i=ut(i,!1)-a,o=ut(o,!1),A=ut(A,!0)+a,x=ut(x,!1)-a,l=ut(l,!1),T=ut(T,!0)+a,{leftX:i,midX:o,rightX:A,topY:x,midY:l,bottomY:T,nw:{x:i-n,y:x-n},n:{x:ut(o-e)+a,y:x-n},ne:{x:A,y:x-n},e:{x:A,y:ut(l-e)+a},be:{x:A,y:ut(E-e)+a},se:{x:A,y:T},s:{x:ut(o-e)+a,y:T},sw:{x:i-n,y:T},bw:{x:i-n,y:ut(E-e)+a},w:{x:i-n,y:ut(l-e)+a}}}function _a(r,t){let e=d().multiSelect.shapes,a=e.members.length,i=ga();a>0&&(r.beginPath(),e.drawShapes(r,t),r.closePath(),r.strokeStyle=i.accent,r.lineWidth=i.thickness,r.stroke())}function XT(r,t,n){r.beginPath(),se(t,r,n),r.closePath(),r.fillStyle=kT,r.fill(),r.strokeStyle=q0,r.stroke(),E1(r,t.maxes,1)}function l1(r,t,n){r.beginPath(),r.moveTo(t.x,t.y),r.lineTo(n.x,n.y),r.closePath(),r.stroke()}function pr(r,t){r.fillRect(t.x,t.y,ft,ft),r.strokeRect(t.x,t.y,ft,ft)}function ti(r,t){r.beginPath(),r.arc(t.x,t.y,ft/2,0,Math.PI*2,!0),r.closePath(),r.fill(),r.stroke()}function lo(r){const t=d();t.multiSelect.shapes.members.forEach(e=>{e.objType!=="ComponentInstance"&&e.pathPoints.forEach(a=>{t.multiSelect.points.isSelected(a)&&$T(a,r)})})}function Ue(r,t=!1){const n=d();let e=n.multiSelect.shapes.members;t&&(e=n.selectedItem.shapes),e.forEach(a=>{a.objType!=="ComponentInstance"&&a.pathPoints.forEach((i,o)=>{if(o===0){let A=a.pathPoints[a.getNextPointNum(0)];qT(i,r,n.multiSelect.points.isSelected(i),A)}else QT(i,r,n.multiSelect.points.isSelected(i))})})}function jT(r,t){let n=ft;t&&(r.fillStyle=it.blue.l85,r.fillRect(t.x,t.y,n,n))}function QT(r,t,n){let e=7,a=Ur.offWhite,i=Ur.accent;const o=e/2;t.fillStyle=n?a:i,t.strokeStyle=i,t.font="10px Consolas";let A=At(r.p.x)-o,x=q(r.p.y)-o;t.fillRect(A,x,e,e),t.strokeRect(A,x,e,e),t.fillStyle=i}function qT(r,t,n,e){let a=Ur.offWhite,i=Ur.accent;t.fillStyle=n?a:i,t.strokeStyle=i,t.lineWidth=1;const o={x:r.p.x,y:r.p.y};let A={x:r.h2.x,y:r.h2.y};r.h2.use||(A={x:e.p.x,y:e.p.y});const x=ft/2,E=[[x*3,0],[x,x],[-x,x],[-x,-x],[x,-x]],l=[];let T=Math.atan2(A.y-o.y,A.x-o.x)*-1;!T&&T!==0&&(T=r.p.x>r.h2.x?Math.PI:0);for(const s of Object.keys(E))l.push([E[s][0]*Math.cos(T)-E[s][1]*Math.sin(T),E[s][0]*Math.sin(T)+E[s][1]*Math.cos(T)]);t.beginPath(),t.moveTo(l[0][0]+At(r.p.x),l[0][1]+q(r.p.y));for(const s of Object.keys(l))s>0&&t.lineTo(l[s][0]+At(r.p.x),l[s][1]+q(r.p.y));t.lineTo(l[0][0]+At(r.p.x),l[0][1]+q(r.p.y)),t.fill(),t.stroke(),t.fillStyle=i,t.fillRect(ut(At(r.p.x)),ut(q(r.p.y)),1,1)}function $T(r,t,n=!0,e=!0){let a=Ur.accent;t.fillStyle=a,t.strokeStyle=a,t.lineWidth=1,t.font="10px Consolas",n&&r.h1.use&&i(r.h1,"1"),e&&r.h2.use&&i(r.h2,"2");function i(o,A){const x=At(o.x),E=q(o.y);ti(t,{x,y:E}),t.beginPath(),t.moveTo(At(r.p.x),q(r.p.y)),t.lineTo(x,E),t.closePath(),t.stroke(),t.fillText(A,x+12,E)}}function tc(r=[],t,n){for(let e=0;e<r.length;e++){let a=ri(r[e],t,n);if(a)return a}return!1}function Za(r,t,n,e){let a=!1;return r&&(Array.isArray(r)?a=tc(r,t,n):r.objType==="Glyph"||r.objType==="VirtualGlyph"?r.shapes&&r.shapes.length&&(a=rc(r,t,n,e)):r.objType==="Path"?a=s1(r,t,n,e):r.objType==="PathPoint"&&(a=ri(r,t,n,e))),a}function rc(r,t,n,e){let a=!1;for(let i=0;i<r.shapes.length;i++)if(r.shapes[i].objType!=="ComponentInstance"&&(a=s1(r.shapes[i],t,n,e),a))return a;return!1}function s1(r,t,n,e){let a=r.pathPoints||[],i=!1;for(let o=a.length-1;o>=0;o--)if(i=ri(a[o],t,n,e),i)return i;return!1}function so(r,t,n){let e=r.pathPoints[0];return e?lt({x:t,y:n},e.p.coord,ft):!1}function ri(r,t=0,n=0,e=!1){const a=d().view.dz,i=ft/a,o={x:t,y:n};let A=!1;return lt(r.p,o,i)&&(A={pathPoint:r,controlPoint:"p"}),A||(r.h1.use&&!e&&lt(r.h1,o,i)&&(A={pathPoint:r,controlPoint:"h1"}),r.h2.use&&!e&&lt(r.h2,o,i)&&(A={pathPoint:r,controlPoint:"h2"})),A}const nc=":root{--gray-l97: hsl(200, 81%, 97%);--gray-l95: hsl(200, 81%, 94%);--gray-l90: hsl(200, 60%, 88%);--gray-l85: hsl(200, 52%, 82%);--gray-l80: hsl(200, 47%, 76%);--gray-l75: hsl(200, 42%, 71%);--gray-l70: hsl(200, 33%, 65%);--gray-l65: hsl(200, 27%, 60%);--gray-l60: hsl(200, 22%, 55%);--gray-l55: hsl(200, 18%, 50%);--gray-l50: hsl(200, 17%, 45%);--gray-l45: hsl(200, 17%, 40%);--gray-l40: hsl(200, 18%, 36%);--gray-l35: hsl(200, 18%, 31%);--gray-l30: hsl(200, 17%, 27%);--gray-l25: hsl(200, 18%, 23%);--gray-l20: hsl(200, 18%, 19%);--gray-l15: hsl(200, 17%, 15%);--gray-l10: hsl(200, 19%, 11%);--gray-l05: hsl(350, 17%, 7%);--blue-l98: hsl(200, 100%, 98%);--blue-l95: hsl(200, 100%, 94%);--blue-l90: hsl(200, 100%, 87%);--blue-l85: hsl(200, 100%, 80%);--blue-l80: hsl(200, 100%, 73%);--blue-l75: hsl(199, 100%, 64%);--blue-l70: hsl(200, 100%, 58%);--blue-l65: hsl(200, 100%, 49%);--blue-l60: hsl(200, 100%, 45%);--blue-l55: hsl(200, 100%, 41%);--blue-l50: hsl(200, 100%, 37%);--blue-l45: hsl(200, 100%, 33%);--blue-l40: hsl(200, 100%, 30%);--blue-l35: hsl(200, 100%, 25%);--blue-l30: hsl(200, 100%, 22%);--blue-l25: hsl(200, 100%, 19%);--blue-l20: hsl(200, 100%, 15%);--blue-l15: hsl(200, 100%, 12%);--blue-l10: hsl(200, 100%, 9%);--blue-l05: hsl(200, 100%, 6%);--orange-l98: hsl(20, 100%, 98%);--orange-l95: hsl(20, 100%, 95%);--orange-l90: hsl(20, 100%, 89%);--orange-l85: hsl(20, 100%, 84%);--orange-l80: hsl(20, 100%, 78%);--orange-d80: rgb(227, 190, 171);--orange-l75: hsl(20, 100%, 72%);--orange-l70: hsl(20, 100%, 66%);--orange-d70: rgb(212, 154, 125);--orange-l65: hsl(20, 100%, 56%);--orange-l60: hsl(20, 100%, 50%);--orange-d60: rgb(191, 106, 64);--orange-l55: hsl(20, 100%, 46%);--orange-l50: hsl(20, 100%, 42%);--orange-d50: rgb(161, 89, 54);--orange-l45: hsl(20, 100%, 37%);--orange-l40: hsl(20, 100%, 33%);--orange-d40: rgb(126, 70, 42);--orange-l35: hsl(20, 100%, 29%);--orange-l30: hsl(20, 100%, 25%);--orange-l25: hsl(20, 100%, 22%);--orange-l20: hsl(20, 100%, 17%);--orange-l15: hsl(20, 100%, 14%);--orange-l10: hsl(20, 100%, 10%);--orange-l05: hsl(20, 100%, 6%);--green-l98: hsl(125, 100%, 98%);--green-l95: hsl(125, 100%, 82%);--green-l90: hsl(125, 97%, 74%);--green-l85: hsl(125, 83%, 66%);--green-l80: hsl(125, 74%, 58%);--green-l75: hsl(125, 67%, 50%);--green-l70: hsl(125, 82%, 43%);--green-l65: hsl(125, 100%, 36%);--green-l60: hsl(125, 100%, 33%);--green-l55: hsl(125, 100%, 30%);--green-l50: hsl(125, 100%, 27%);--green-l45: hsl(125, 100%, 24%);--green-l40: hsl(125, 95%, 22%);--green-l35: hsl(125, 100%, 19%);--green-l30: hsl(125, 100%, 16%);--green-l25: hsl(125, 100%, 14%);--green-l20: hsl(125, 100%, 11%);--green-l15: hsl(125, 100%, 9%);--green-l10: hsl(125, 100%, 6%);--green-l05: hsl(125, 100%, 4%);--purple-l98: hsl(285, 100%, 98%);--purple-l95: hsl(285, 100%, 96%);--purple-l90: hsl(285, 100%, 92%);--purple-l85: hsl(285, 100%, 89%);--purple-l80: hsl(285, 100%, 85%);--purple-l75: hsl(285, 100%, 81%);--purple-l70: hsl(285, 100%, 77%);--purple-l65: hsl(285, 100%, 72%);--purple-l60: hsl(285, 100%, 66%);--purple-l55: hsl(285, 100%, 61%);--purple-l50: hsl(285, 100%, 50%);--purple-l45: hsl(285, 100%, 45%);--purple-l40: hsl(285, 100%, 40%);--purple-l35: hsl(285, 100%, 36%);--purple-l30: hsl(285, 100%, 31%);--purple-l25: hsl(285, 100%, 27%);--purple-l20: hsl(285, 100%, 22%);--purple-l15: hsl(285, 100%, 17%);--purple-l10: hsl(285, 100%, 13%);--purple-l05: hsl(285, 100%, 10%);--offWhite: hsl(200, 81%, 97%);--darkRed: hsl(0, 100%, 23%);--red: hsl(0, 100%, 48%);--lightRed: hsl(0, 100%, 90%);--accent-color: hsl(200, 100%, 37%);--accent-color-light: hsl(200, 100%, 49%);--enabled-resting-text: hsl(0, 0%, 5%);--enabled-resting-lightText: hsl(0, 0%, 10%);--enabled-resting-border: hsl(0, 0%, 75%);--enabled-resting-fill: hsl(0, 0%, 40%);--enabled-resting-background: hsl(0, 0%, 98%);--enabled-restingLight-text: hsl(0, 0%, 20%);--enabled-restingLight-lightText: hsl(0, 0%, 30%);--enabled-restingLight-border: hsl(0, 0%, 80%);--enabled-restingLight-fill: hsl(0, 0%, 60%);--enabled-restingLight-background: hsl(0, 0%, 98%);--enabled-focus-text: hsl(0, 0%, 0%);--enabled-focus-lightText: hsl(0, 0%, 10%);--enabled-focus-border: hsl(200, 25%, 63%);--enabled-focus-fill: hsl(200, 25%, 25%);--enabled-focus-background: white;--enabled-active-text: hsl(0, 0%, 0%);--enabled-active-lightText: hsl(0, 0%, 10%);--enabled-active-border: hsl(0, 0%, 63%);--enabled-active-fill: var(--accent-color);--enabled-active-background: white;--disabled-text: hsl(0, 0%, 40%);--disabled-text-light: hsl(0, 0%, 60%);--disabled-text-dark: hsl(0, 0%, 20%);--disabled-border: hsl(0, 0%, 82%);--disabled-fill: hsl(0, 0%, 82%);--disabled-background: hsl(0, 0%, 94%)}",L1=`<?xml version="1.0" encoding="UTF-8"?>\r
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">\r
  <path fill="hsl(200, 100%, 41%)" d="m491.109,170.926c-89.722,0-162.715,82.261-162.715,183.377,0,124.258,113.791,137.671,162.715,137.671s162.715-13.413,162.715-137.671c0-101.116-72.993-183.377-162.715-183.377Z"/>\r
  <path fill="hsl(200, 100%, 41%)" d="m920.448,79.552C840.896,0,719.097,0,500,0S159.104,0,79.552,79.552C0,159.104,0,280.903,0,500s0,340.896,79.552,420.448c79.552,79.552,201.351,79.552,420.448,79.552s340.896,0,420.448-79.552c79.552-79.552,79.552-201.351,79.552-420.448s0-340.896-79.552-420.448Zm-146.744,112.456c0,2.761-2.239,5-5,5h-7.034c-.038,0-.074-.01-.112-.011-.004,0-.007.001-.01.001h-45.856c-1.075,0-2.087.506-2.731,1.366l-8.66,11.546c27.074,41.021,42.88,90.25,42.88,143.144,0,70.001-27.646,127.253-79.957,165.578-44.577,32.657-105.478,49.921-176.114,49.921-55.318,0-104.663-10.591-144.875-30.869-10.283,10.57-17.335,24.213-17.335,38.766,0,34.131,21.332,54.11,94.524,54.11,90.099,0,163.146-23.565,231.294-23.565,80.615,0,85.357,57.752,85.357,99.583,0,118.551-27.271,209.05-292.825,209.05-33.161,0-97.221-1.724-132.317-9.312-3.75-.811-6.015-4.609-5.018-8.314l20.862-78.928c.909-3.377,4.229-5.502,7.667-4.855,21.23,3.999,80.354,10.479,108.806,10.479,156.167,0,209.013,8.004,209.245-98.506-.071-11.553,3.771-19.614-12.673-19.614-61.646,0-130.08,16.099-239.25,16.099-126.868,0-158.866-87.434-158.866-144.64,0-26.761,14.174-60.59,39.162-86.528-32.729-36.272-49.828-83.42-49.828-138.455,0-142.651,114.875-258.706,256.071-258.706,59.47,0,114.268,20.59,157.783,55.082l12.693-16.924c7.611-10.15,19.559-16.123,32.245-16.123h67.717c.01,0,.019.003.029.003.032,0,.062-.009.094-.009h7.034c2.761,0,5,2.239,5,5v70.632Z"/>\r
</svg>`,ec="@font-face{font-family:FiraGo;font-style:normal;font-weight:400;src:url(/v2/app/assets/FiraGO-Regular-Gjg8N22e.woff2)}*{margin:0;padding:0;font-family:FiraGo,Tahoma,Verdana,sans-serif;font-size:14px;font-weight:400;text-align:left;box-sizing:border-box;transition:var(--global-transition)}html,body{background-color:var(--gray-l97);height:100%;width:100%;min-height:100%;min-width:100%;overflow:hidden}::-webkit-scrollbar{width:8px;padding:1px;border-radius:4px;border:1px solid var(--gray-l90);background-color:var(--offWhite)}::-webkit-scrollbar-button{height:0px;background-color:transparent}::-webkit-scrollbar-track{width:8px}::-webkit-scrollbar-track-piece{background-color:transparent}::-webkit-scrollbar-thumb{margin:2px;background-color:var(--gray-l80);border-radius:4px}::-webkit-scrollbar-corner{display:none}::-webkit-resizer{display:block;border:2px outset var(--enabled-restingLight-background)}div,p,h1,h2,h3,table,td,label,button{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}b,strong{font-weight:700}a,a:visited{background-color:transparent;border-radius:4px;color:var(--blue-l55);text-decoration:none}a:active{color:var(--blue-l40);background-color:#0099e61a}a:focus,a:hover{color:var(--blue-l65);text-decoration:underline;cursor:pointer}p{display:block}hr{border-style:solid;border-color:var(--gray-l85)}h1{margin-left:0;color:var(--gray-l55);font-size:2em;margin-bottom:8px;clear:right}h2{color:var(--gray-l45);font-size:1.6em}h3{color:var(--gray-l45);font-size:1.3em;margin-bottom:4px}h4{color:var(--gray-l45);font-size:1.2em;margin-bottom:4px}table{border-collapse:collapse}td{vertical-align:top}svg{overflow:visible}.number{font-family:monospace}label,label:focus,label:active{display:inline}label:hover{color:#000}input,textarea{border:none;padding:0 0 0 4px;height:24px;text-align:left;font-family:monospace;background-color:var(--enabled-restingLight-background);color:var(--enabled-restingLight-text);border:1px solid var(--enabled-restingLight-border);border-radius:4px;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}input:hover,textarea:hover{background-color:var(--enabled-focus-background);color:var(--enabled-focus-text);border-color:var(--enabled-focus-border)}input:focus,textarea:focus{background-color:var(--enabled-focus-background);color:var(--enabled-focus-text);border-color:var(--enabled-focus-border)}textarea:hover::-webkit-resizer,textarea:focus::-webkit-resizer{display:block;border:2px outset var(--enabled-focus-background)}info-bubble{width:12px}input:focus,button:focus,textarea:focus,info-bubble:focus,glyph-tile:focus{outline:var(--global-focus-style);outline-offset:-1px}input[type=image]{height:auto;width:auto;background-color:transparent;border-width:0px}input[type=number]{text-align:right;width:70px;border:1px solid white;border:1px solid var(--gray-l90);cursor:default}input[type=text][disabled=disabled],input[type=number][disabled=disabled]{background-color:var(--gray-l90);border:1px solid var(--gray-l90);color:var(--gray-l65)}input[type=checkbox]{accent-color:var(--accent-color);opacity:.75}ul li{margin-left:20px;margin-top:10px}:root{--global-focus-style: 1px dashed var(--purple-l50);--global-transition: all 80ms ease;--animate-fade-in-slide-down: .18s ease-in fade-slide-in;--animate-fade-in: .18s ease-in fade-in;--animate-fade-out: .18s ease-out fade-out;--animate-fade-update: .14s ease-in fade-in-update;--l1-shadow: 0px 0px 2px rgba(0, 0, 0, .1);--l1-shadow-down: 0px 2px 2px rgba(0, 0, 0, .1);--l2-shadow: 0px 0px 4px rgba(0, 0, 0, .2);--l2-shadow-upper-left: -1px -1px 4px rgba(0, 0, 0, .2);--l2-shadow-down: 0px 4px 4px rgba(0, 0, 0, .3);--l3-shadow: 0px 0px 6px rgba(0, 0, 0, .3);--l3-shadow-down: 0px 6px 6px rgba(0, 0, 0, .3)}@keyframes fade-slide-in{0%{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}@keyframes fade-in-update{0%{opacity:.6}to{opacity:1}}@keyframes fade-in{0%{opacity:0;transform:scale(1.01)}to{opacity:1;transform:scale(1)}}@keyframes fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.99)}}.span-all-columns{grid-column:-1 / 1!important}button,button:active,button:hover,button:focus{text-align:center;padding:4px 8px;margin:2px 0;cursor:pointer;border-radius:4px;border:1px solid var(--gray-l90);background-color:var(--gray-l90);color:var(--enabled-text);box-shadow:var(--l1-shadow)}button:hover{color:var(--enabled-focus-text);border-color:var(--blue-l85);box-shadow:var(--l1-shadow)}button[disabled],button[disabled]:active,button[disabled]:hover,button[disabled]:focus{background-color:var(--gray-l95);border-color:var(--gray-l95);color:var(--disabled-text);cursor:default}.button__call-to-action,.button__call-to-action:hover,.button__call-to-action:active,.button__call-to-action:focus{background-color:var(--blue-l60);color:var(--gray-l95)}.button__call-to-action:hover{color:#fff}",ac="dialog{z-index:1000}#toast,#error{display:none;width:300px;position:absolute;left:520px;margin:5px 0;background-color:var(--green-l90);color:var(--green-l10);padding:4px 8px;z-index:2010;text-align:center;border:1px solid var(--green-l60);border-radius:4px;box-shadow:var(--l3-shadow-down);animation:var(--animate-fade-in-slide-down)}#toast[fancy]{background-color:var(--purple-l30);background:linear-gradient(135deg,var(--purple-l25),var(--purple-l10));color:var(--purple-l95);font-size:1.2em;border-color:var(--purple-l30);padding:10px}#toast a{color:var(--green-l10)}#notation{display:none;position:absolute;right:900px;top:400px;width:auto;height:auto;padding:0;z-index:2020;background-color:#e5eaef;border:5px solid rgb(229,234,239);border-radius:5px 5px 0;box-shadow:var(--l2-shadow-upper-left);animation:var(--animate-fade-in)}.notation__path-add-point{display:grid;grid-template-columns:20px min-content min-content;margin:0 5px 2px}.notation__path-add-point span{font-family:monospace}.notation__path-add-point label{font-family:monospace;color:var(--enabled-restingLight-lightText)}#error{margin-top:10px;border-color:var(--red);color:var(--darkRed);background-color:var(--lightRed);display:grid;grid-template-rows:20px 1fr;padding:10px 12px 12px;row-gap:10px}#error hr{border-color:var(--red);margin:10px 0}.error__header{display:grid;grid-template-columns:1fr 20px}.error__header h3{color:var(--darkRed)}.error__header button{background-color:var(--darkRed);border-color:var(--darkRed);color:var(--lightRed);width:20px;height:20px;line-height:20px;padding:0;margin:0}.error__header button:hover{color:#fff;border-color:var(--red)}#context-menu{display:grid;grid-template-columns:24px 1fr min-content min-content;column-gap:0px;row-gap:5px;width:fit-content;overflow-y:auto;padding:10px;position:absolute;z-index:2030;background-color:var(--enabled-resting-background);border:1px solid var(--enabled-focus-border);border-radius:0 4px 4px;box-shadow:var(--l3-shadow-down);animation:var(--animate-fade-in-slide-down)}#context-menu:focus{outline:0}.context-menu-row{display:contents;padding:5px 10px 5px 5px;height:24px;border-radius:4px}.context-menu-row:hover>span,.context-menu-row:hover>.row-notes,.context-menu-row:hover>.row-notes span,.context-menu-row:hover>.row-notes code{background-color:var(--enabled-focus-background);color:var(--blue-l45);cursor:pointer}.context-menu-row:focus{outline:var(--global-focus-style)}.context-menu-row[disabled]{opacity:.5;color:var(--disabled-text-light)}.context-menu-row[disabled]:hover>span,.context-menu-row[disabled]:hover>.row-notes,.context-menu-row[disabled]:hover>.row-notes span,.context-menu-row[disabled]:hover>.row-notes code{color:var(--disabled-text-light);cursor:default;background-color:transparent}.context-menu-row[disabled] svg g{fill:var(--disabled-text-light)!important}#context-menu .spanAll h2{font-size:.8em;color:var(--enabled-restingLight-lightText);font-family:monospace;padding:0 20px 0 0}.context-menu-row hr,.context-menu-row hr:hover,.context-menu-row hr:active,.context-menu-row hr:focus{margin:8px 0;grid-column:1 / -1;border-width:0px 0px 1px 0px;border-color:var(--gray-l90)}.context-menu-row .row-icon{height:24px;width:24px}.context-menu-row .row-icon svg{height:20px;width:20px;margin:2px}.context-menu-row .row-name{line-height:22px;height:24px;padding:2px 20px 0 10px;display:flex}.context-menu-row .row-name svg{margin-right:10px}.context-menu-row .row-notes{background-color:transparent;width:max-content;height:24px;opacity:.8;display:contents;margin-left:20px}.context-menu-row .row-notes code{height:20px;margin:2px;font-size:.8em}.context-menu-row .row-notes span{grid-column:span 2;font-size:.8em;line-height:24px;padding:0 0 0 4px;height:24px;margin:0}#modal-dialog{display:block;position:absolute;text-align:center;border-width:0px;padding:0px auto;left:0;top:0;width:100vw;height:100vh;z-index:2000;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);background-color:#ffffffbf;animation:var(--animate-fade-in)}.modal-dialog__content{display:grid;grid-template-rows:30px 1fr;width:clamp(500px,66vw,1000px);max-height:calc(100vh - 80px);overflow-y:hidden;margin:40px auto;text-align:left;background-color:var(--enabled-focus-background);border:1px solid var(--blue-l60);border-radius:8px;box-shadow:var(--l3-shadow-down);animation:var(--animate-fade-in-slide-down)}.modal-dialog__header{margin:4px;height:20px;display:grid;grid-template-columns:1fr 20px}.modal-dialog__body{display:block;max-height:calc(100vh - 120px);overflow-y:auto;padding:0 20px 20px}.modal-dialog__close-button{background-color:var(--blue-l95);border-color:var(--blue-l85);color:var(--blue-l50);text-align:center;width:20px;height:20px;line-height:14px;font-size:1.2em;padding:0 0 2px;margin:0}.modal-dialog__close-button:hover{background-color:var(--blue-l90);color:var(--blue-l30);border-color:var(--blue-l70);cursor:pointer;padding:0 0 2px;margin:0}.modal-dialog__close-button:active,.modal-dialog__close-button:focus{background-color:var(--blue-l90);color:var(--blue-l50);cursor:pointer;padding:0;margin:0}.modal-dialog__glyph-chooser-scroll-area{height:100%;padding:10px 5px 5px 10px;background-color:var(--offWhite);margin-bottom:10px}",ic="";class ya extends HTMLElement{constructor(t={}){super(),this.textBlockOptions=new Hr,Object.keys(t).forEach(n=>{n!=="_text"?(n!=="width"&&n!=="height"&&this.setAttribute(bo(n),t[n]),this.textBlockOptions[n]&&(this.textBlockOptions[n]=t[n])):(this.textBlockOptions.text=t._text,this.setAttribute("text",this.textBlockOptions.text))}),this.isSetUp=!1}connectedCallback(){const t=this.attachShadow({mode:"open"}),n=L({tag:"style",innerHTML:ic});t.appendChild(n),this.canvas=L({tag:"canvas",id:"mainDisplayCanvas"}),t.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.drawCrisp=!1,this.isSetUp=!0,this.resizeAndRedraw()}resizeAndRedraw(){this.isSetUp&&(this.updateTextBlock(),this.updateCanvasSize(),this.redraw())}updateCanvasSize(){var o;const t=(o=this==null?void 0:this.parentElement)==null?void 0:o.getClientRects()[0],n=this.textBlockOptions.pageHeight,e=this.textBlockOptions.pageWidth;let a=1e3,i=1e3;n==="auto"?(a=this.textBlock.pixelHeight,a+=this.textBlockOptions.pagePadding):n==="fit"?a=t.height:isNaN(parseInt(n))||(a=parseInt(n)),e==="fit"?i=t.width:isNaN(parseInt(e))||(i=parseInt(e)),this.widthAdjustment&&(i+=this.widthAdjustment),this.height=a,this.width=i,this.canvas.height=a,this.canvas.width=i}updateTextBlock(){let t=this.calculatePageMaxes(),n=!1,e=parseInt(this.getAttribute("project-editor"));isNaN(e)||(n=Tt().projectEditors[e].project),this.textBlock=new l0({options:this.textBlockOptions,canvasMaxes:t,ctx:this.ctx,drawPageExtras:this.drawDisplayPageExtras,drawLineExtras:this.drawDisplayLineExtras,drawCharacterExtras:this.drawDisplayCharacterExtras,drawCharacter:this.drawDisplayCharacter,project:n})}calculatePageMaxes(){var o;const t=(o=this==null?void 0:this.parentElement)==null?void 0:o.getClientRects()[0],n=this.textBlockOptions.pagePadding,e=this.textBlockOptions.pageHeight,a=this.textBlockOptions.pageWidth,i={xMin:n,yMin:n,xMax:1e3,yMax:1e3};return e==="auto"?i.yMax=1/0:e==="fit"?i.yMax=t.height-n:isNaN(parseInt(e))||(i.yMax=parseInt(e)),a==="fit"?i.xMax=t.width-n:isNaN(parseInt(a))||(i.xMax=parseInt(a)),this.widthAdjustment&&(i.xMax+=this.widthAdjustment),i}static get observedAttributes(){return["text","font-size","line-gap","page-padding","show-page-extras","show-line-extras","show-character-extras","show-placeholder-message","width-adjustment"]}attributeChangedCallback(t,n,e){t==="text"&&(this.textBlockOptions.text=e,this.resizeAndRedraw()),t==="font-size"&&(this.textBlockOptions.fontSize=Math.max(parseInt(e),1),this.resizeAndRedraw()),t==="line-gap"&&(this.textBlockOptions.lineGap=Math.max(parseInt(e),0),this.resizeAndRedraw()),t==="page-padding"&&(this.textBlockOptions.pagePadding=Math.max(parseInt(e),0),this.resizeAndRedraw()),t==="show-page-extras"&&(this.textBlockOptions.showPageExtras=e==="true",this.redraw()),t==="show-line-extras"&&(this.textBlockOptions.showLineExtras=e==="true",this.redraw()),t==="show-character-extras"&&(this.textBlockOptions.showCharacterExtras=e==="true",this.redraw()),t==="show-placeholder-message"&&(this.textBlockOptions.showPlaceholderMessage=e==="true",this.redraw()),t==="width-adjustment"&&(this.widthAdjustment=parseInt(e),this.resizeAndRedraw())}redraw(){if(this.isSetUp){if(this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.textBlock.hasDrawableCharacters)this.textBlock.draw({showPageExtras:this.textBlockOptions.showPageExtras,showLineExtras:this.textBlockOptions.showLineExtras,showCharacterExtras:this.textBlockOptions.showCharacterExtras,showCharacter:!0});else if(this.textBlockOptions.showPlaceholderMessage){this.ctx.fillStyle=Ur.disabled.text,this.ctx.font="14px sans-serif",this.ctx.textBaseline="middle";let t=this.textBlock.canvasMaxes.xMin,n=this.height/2;this.ctx.fillText("Project preview text will be shown here.",t,n)}}}iterator(t){const n=this.textBlock.data;for(let e=0;e<n.length;e++)for(let a=0;a<n[e].length;a++)t(n[e][a],this)}drawDisplayPageExtras(t,n){const e=n.canvasMaxes,a=e.yMin||0,i=e.yMax===1/0?n.pixelHeight:e.yMax,o=e.xMin||0,x=(e.xMax||1e3)-o,E=i-a;t.fillStyle="transparent",t.strokeStyle=it.gray.l90,t.lineWidth=1,t.strokeRect(ut(o),ut(a),R(x),R(E))}drawDisplayLineExtras(t,n,e){t.strokeStyle=it.gray.l85,t.beginPath(),t.moveTo(e.canvasMaxes.xMin,n.view.dy),t.lineTo(e.canvasMaxes.xMax,n.view.dy),t.closePath(),t.stroke()}drawDisplayCharacterExtras(t,n){const e=m(),a=e.settings.font,i=n.view.dz;let o=n.widths.advance*i,A=e.totalVertical*i,x=n.view.dy-a.ascent*i,E=n.view.dx;const l=n.widths.kern*i*-1;n.widths.kern&&(t.fillStyle="orange",t.globalAlpha=.3,t.fillRect(E+o-l,x,l,A),t.globalAlpha=1),t.fillStyle="transparent",t.strokeStyle=it.blue.l85,t.lineWidth=1,this.drawCrisp&&(E=ut(E),x=ut(x),o=R(o),A=R(A)),t.strokeRect(E,x,o,A)}drawDisplayCharacter(t,n){const e=n.item,a=Zt(n.view);e&&(t.fillStyle=Ur.enabled.resting.text,t.strokeStyle="transparent",Jn(e,t,a,1,!0))}}const oc=`<?xml version="1.0" encoding="UTF-8"?>\r
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 147 29">\r
	<g id="g">\r
		<path\r
			d="m13,6l-1,2c-1.15-.9-3-2-5-2C3,6,0,9,0,13c0,2,.45,3.04,1.32,4-.66.69-1.32,1.35-1.32,2.1,0,1.51,1.13,3.94,4.48,3.94,4.52,0,5.52-1,6.52-1,.43,0,1,.69,1,1,0,3-3,3-6,3-.75,0-2,0-3-1-.1-.02-1.1,2-1,2,1,1,3,1,4,1,7.01,0,8-2.86,8-6,0-1,0-2-1-2-4,0-5.64,1-8.02,1-1.93,0-2.98-1.08-2.98-2,0-.39.67-.75.94-1.03,1.1.54,2.6,1.01,4.1,1.01,4,0,7-2,7-6,0-2-.28-2.9-1-4l1-1h2v-2h-3Zm-6,11c-2,0-5-1-5-4s2.63-5,5-5,5,2,5,5-2,4-5,4Z" />\r
	</g>\r
	<path id="l" d="m20,19h-1V1c0-.66-.34-1-1-1h-2v2h1v17h-1v2h4v-2Z" />\r
	<g id="y">\r
		<path\r
			d="m33,6h-2v2h1v9c-.72,1.47-2.55,2-4,2-.55,0-4,.4-4-3V7c0-.66-.34-1-1-1h-3v2h2v8c0,3.14,1.48,5,6,5,1.65,0,2.99-.37,4-1v2c0,3-1.83,4-6,4-2,0-3-1-3-1l-1,2c1,1,3,1,4,1,7.1,0,8-3,8-6V7c0-.66-.34-1-1-1Z" />\r
	</g>\r
	<path id="p"\r
		d="m35,25v2h2c.65,0,1-.35,1-1v-6s2,1,4,1c3,0,6-2,6-5v-5c0-3-2-5-6-5-2,0-4,1-4,1,0,0-.35-1-1-1h-2v2h1v17h-1Zm7-17c2,0,4,1,4,3v5c0,2-1.73,3-4,3s-4-1-4-3v-5c0-2,2-3,4-3Z" />\r
	<path id="h"\r
		d="m63,19h-1s0-7,0-7c0-4-1.64-6-6-6-1.47,0-3.14.42-4,1V1c0-.66-.35-1-1-1h-2v2h1v17h-1v2h4v-2h-1v-9c1-1.21,3-2,4-2s4,0,4,4v7h-1v2h4v-2Z" />\r
	<path id="r"\r
		d="m75,7s-1-1-4-1c-2,0-3,1-4,2v-1c0-.66-.33-1-1-1h-2v2h1v11h-1v2h4v-2h-1v-8c.66-1.66,2-3,4-3,1,0,2,0,3,1l1-2Z" />\r
	<path id="s"\r
		d="m85,13c-2,0-2-2-2-3s2-2,4-2c1.68,0,3,0,4,1l1-2c-1-1-2.21-1-4-1-7,0-7,3.22-7,4,0,2,0,5,3,5,4,0,7-1,7,1,0,2.78-1.28,3-5,3-1,0-3,0-4-1-.1-0-1.1,2-1,2,1,1,3,1,5,1,6.37,0,7-1.9,7-5,0-5-5.63-3-8-3Z" />\r
	<path id="t" d="m100,6h-3V1h-2v5h-2v2h2v12c0,.72.27,1,1,1h3v-2h-2v-11h3v-2Z" />\r
	<path id="u"\r
		d="m114,6h-2c-.65,0-1,.35-1,1v10c0,2-3.23,2-4,2-1,0-4-.53-4-4v-7h1v-2h-2c-.65,0-1,.34-1,1v8c.11,3.13,1.77,6,6,6,1.53,0,4-1,4-1,0,0,.51,1,1,1h2v-2h-1v-11h1v-2Z" />\r
	<path id="d"\r
		d="m128,2V0h-2c-.65,0-1,.35-1,1v6s-2-1-4-1c-3,0-6,2-6,5v5c0,3,2,5,6,5,2,0,4-1,4-1,0,0,.35,1,1,1h2v-2h-1V2h1Zm-7,17c-2,0-4-1-4-3v-5c0-2,1.73-3,4-3s4,1,4,3v5c0,2-2,3-4,3Z" />\r
	<path id="i" d="m133,19h-1V7c0-.66-.35-1-1-1h-2v2h1v11h-1v2h4v-2Z" />\r
	<path id="i-2" d="m131,4.5c2,0,1.25-1.5,1.25-1.5,0,0-.35-1-1.25-1s-1.25,1-1.25,1c0,0-.75,1.5,1.25,1.5Z" />\r
	<path id="o"\r
		d="m146,12c0-4-3-6-6-6s-6,2-6,6v4c0,3,3,5,6,5s6-2,6-5v-4Zm-6,7c-2,0-4-1-4-3v-4c0-2,2-4,4-4s4,2,4,4v4c0,2-2,3-4,3Z" />\r
</svg>`;function Ac(r){let t=L({tag:"div",className:"panel__card",innerHTML:"<h3>Component instance</h3>"}),n=V("name"),e=Ft(r,"name","currentComponentInstance","input"),a=xc(r),i=Ec(r),o=V("flip vertical",`
		Flip top to bottom,
		as compared to the root Glyph or Component
		that this Component Instance is linked to.
	`),A=Ln(r,"isFlippedNS","currentComponentInstance"),x=V("flip horizontal",`
		Flip left to right,
		as compared to the root Glyph or Component
		that this Component Instance is linked to.
	`),E=Ln(r,"isFlippedEW","currentComponentInstance"),l=V("reverse winding",`
		Reverse all the windings,
		as compared to the root Glyph or Component
		that this Component Instance is linked to.
	`),T=Ln(r,"reverseWinding","currentComponentInstance"),s=V("rotate"),c=Ft(r,"rotation","currentComponentInstance","input-number"),I=V("rotate first",lc());I.querySelector("info-bubble").setAttribute("bubble-width","540px");let h=Ln(r,"rotateFirst","currentComponentInstance"),S=L({tag:"h3",innerHTML:"Component root"}),p=sA(r.link);return y(t,[n,e,a,i,o,A,x,E,l,T,s,c]),r.rotation!==0&&y(t,[I,h]),y(t,[mr(),S,p]),y(t,mr()),y(t,Ld()),t}function xc(r){let t=V(`Δ x${Ie()}Δ y`,`
		The difference in x or y position,
		as compared to the root Glyph or Component
		that this Component Instance is linked to.
	`),n=L({tag:"div",className:"doubleInput"}),e=Ft(r,"translateX","currentComponentInstance","input-number"),a=Ft(r,"translateY","currentComponentInstance","input-number");return n.appendChild(e),n.appendChild(he()),n.appendChild(a),[t,n]}function Ec(r){let t=V(`Δ width${Ie()}Δ height`,`
		The difference in width or height,
		as compared to the root Glyph or Component
		that this Component Instance is linked to.
	`),n=L({tag:"div",className:"doubleInput"}),e=Ft(r,"resizeWidth","currentComponentInstance","input-number"),a=Ft(r,"resizeHeight","currentComponentInstance","input-number");n.appendChild(e),n.appendChild(he()),n.appendChild(a);let i=V("lock aspect ratio",`
		When either the width or height is adjusted,
		the overall size will be kept proportional.
		<br><br>
		Maintaining aspect ratio will override value
		locks if need be.
	`),o=Ln(r,"ratioLock","currentComponentInstance");return[t,n,i,o]}function lc(){return`
		<h1>Rotate First - Resize First</h1>
		<div style="width: 500px;">
		Component Instances are rotated around their center point.  But if they are resized, their center point changes.  When Component Instances are rendered, the Root Component is adjusted according to the delta values stored by the Component Instance.
		<br><br>
		This option changes how this Component Instance is rendered.  The default order is to resize, then rotate. When this option is selected to be true, the new order will be rotate, then resize. This order has an impact on the Component Instance's resulting shape.
		<br><br>
		<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAFXCAYAAABUXrzKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAFkJJREFUeNrs3btz29aCwOGjTLoUyyb10m1SRC5uHapNE7mIW0ttdmdszexsK6m9jZRitxXdKoWdJq3ov8Da4t42vPUtrC2yLReHAMSH+ab4wMH3zdC2KFkPCAc/HBAEQwAAAAAAAAAAAAAAAAAAAAAA2JTbXsNC2L4vLQJqsoFpZX8eZre4oXnIbvfh5UFnysceZ+97b6HByt5k46ibjaO2RSHo8FSzhPPsdlKEfPz9Mewx3JfZhqdb3Bc/9ia7HViAsJabbDwFURd0WDfmx0WYZx36axSxP84+/uxxIwSIegWZhZBizE/GwlzOxD9kt24R8u+nztyjlwcHS37NqxAPM076v7e93oz/eTRy6D//3uNRhWZ2i/efZe+/90tlB+OoWYyRVcTx1Rp6+3ShqOdf87z4v83i3jgOfvEwmKBTz43Qx6FQvy82Jg8TPjZ+zNXEjdYyQc8fn7+b+H/H3zcr6IOP7RQ7H6+Kn+PZxO8fNjuW5q27y5od9Xxn9ipMP6p2aqY/2xcWAYkZPszezjYAL6bGML//lzU3eo3ia3bnfGS3H/rPb52hj3ldfFyM/EU/9vnPcuzXSsXlJ6LO/5hGf9yG8LzYMX5W7JSHIvbM4DF0UppRxLPYW0MBPV3g49edgcSYx6MC16E85D4t6POVZ+APb+BCGBx6hG26L3YqVxGPLp0MrcdHcx86iofUb3vPHk9Qze/rFue3HPfHR37U4H5orL0f+bz5Dvbk9wk6VMrwTPZywZiv/nzZ/BDhcTGj+G1K0A+X+IxvQ34SUZydd4oZeyg+P2xXfgSrs+LYaC0V8+GAz9vJiN/Xbe+7Yuz92J/ND5QPod0XO9lm6FBR3w39e5EN0Ys1Yt4sNh5xA3Q2I9yNx79ve8NHA34L+UMCD0Mbs3axoTovbvF9pwts5GAfLRfz6U5GYp6LR99a/XEXd4DjQ1T5TsTJ4/treN6JoJOSxsJ7+utvZMrH6l8UM4Z5Hz8e/FY/2re90Q3ey4Oz7L74uH5zbAMGmxd3VJ9mB7L7JDHPj6SVR6rORo4e3PbiDvldMY46YfDMlsu6PjNE0GH5jcxFEeTLqVebG7guZirdMHhM/McweMrcu5Cf+BPGdkbMytn2eh2D+I/sdrH253qKs9Hzx8PLh8U+H2vx7dteee7Ku+Lj7osTSmtJ0ElJd2TPfhN76fmM4XzhDUc+wx5/LC9uiP4nlCfUbep7heVifhLmnXuyve9nOObtGWPtMoxeT+Kszr9GT1sjJR+G/v16Q1/jvPj7sH/BmPI2fLb84L5FZzBeyIJ9iPm+fD9xp/mPkD9MdTnn2SonY+PnVZ1/lS4sQ0obpkaxISgH+PMnn/nmJ7a1FvrYWRenyTdaHzf2fcJqMe+GVR/uiddPeJqYlzPzeReiaYbBRaTOip3t8ryWWl5VTtBJbQN1MTSLnn+Wbb4TcJJ9zPWaX7f1OEsfvVJc/H7aIycaDQ4nHob8+fLP/OLY8VhZ37KXS14n5qM71+/7F5C67cXH0q+KcV/LqysKOinO0stYllG/DONPEcs/9iQMLjXZnnshmtWC3psw8xme4b9wjWr2ZKzsOuifwvyHnzr9IwGDnZHReI9HXtAh2Q1VZ+jfh2Mbj7hBeL7yU3amB33a45PxqMHZAmfJwzbHyuXOzhKfd97JYAzHw+sfJ+4Qjx+GX/fIm6DD3myoYkyPF9xIvNjoIbr8cGLjMeaeX85+Rv2yzk/7EnTY741VnDnHM1/j382xGXncs39rloxx8hj13wQdAKoe9dueV/YDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAglK+9DCw2XhrFq7qxIV9YBLDSxim+1vrH4nXOgdkhv8j+9Uf/Fv8t7Bvh9dBhtZifFG/F11U/Ci8P7i0YGAt5CG+y2+vsNh7wOG5+yW7X2dh5sLAEHXYd8yDqsEDI/8yGyO9Zv//ZDeGn8xC+bgq7oMOexLzTzjdQ53chfNUQdZgV8t+v83+XWifCLuiwJzH/79P8/uahqCPki4Z8nLALOuxFzEuiTn3HRhwXV0uHfNwPb/Kwf9UQdkGHHcVc1KlvyM/jmr9WyIfFsRPD/sNrYRd02FHMRR0hXz3kwi7osFcxF3WE/GkJu6DDzmIu6gj5tsLezW6X2bhq+yUJOmwm5qKOkAu7oEMiMRd1hFzY9yro+bV366aTrRAdo1rM1465qCPkwr5HQe/VcHnEFeHC6BbzJyXqCLmw70XQf71Mfyl8+30I37QEXcyfPuaiThVCXq7/cXsfr7deRcI+8xfeK6Ke/u2ni17x84p53WJeruc/32x+PWse9sLNp3Jd++SlV9lJyG97fzyu9+W6/3Uzne35V418mz4Ya73iZz5J/dfr9dAxM9/kzHxYN5uQXx6VhzLjFOJO1NlqyEO4eZyVx/X+357l635VZ+WTxPH1azY3+/dn+RGHfLw1+z974mEXdMR8GzEXdXazrrdqE3JhF3TEfOtEne2E/K6/btUt5NPC/p/P82WQSzLsgo6Y74Kos/mQt2od8nHxZ4/LIC6LRMMu6Ii5qCPkwp5A2AUdMRd1hFzYPw97S9BBzEUdIa9+2O/6y7hCYRd0xFzUEXImh71VpbALOmIu6gg5CYRd0BFzUUfISSDsgo6YizpVCPnfO0Iu7IKOmIs6lQ55XBcujoRc2AUdMRd1Kh3yv3UsI2EXdMRc1BFy6hB2QUfMRZ3tr7fNYt0V8lTCHq8V//fOTsMu6Ii5qLP9kP/xuO4KeTpjNP4O4+9yR2EXdMRc1BFynkr8Xe4o7IKOmIs6Qs72w/7k41bQEXNRR8jZftg/9teRuK4IOmJ+Wt9lIepCTgphP+mvK08UdkFHzEUdISeBsAs6Yi7qCDkJhF3QEXNRR8hJIOyCjpiLOuuEvLywiJCz47ALOmIu6qwT8tFLf8LOwi7oiLmoI+QkEHZBR8xFnc/Xw0Z2uxJy9irscWzPCLugs1+zoRCOH9/+/RfLZJ2oD/bqY9RfWShLOXkMeenXSyFnt2H/fJsY19FzQWf/vDzIpkAh2w0N/allOL8LoWliuZKfb0L4y+O+UTtbtmcWylLr4nX2ZzYVD5eP62Ncpv+VTdhbJ5YP2xXXubjuxXVwoN1fR18enAo6+7ohvX+M+lcNUV815oPotIcHPEutiw/Z7WIk7F83hZ3dhDyue+MhzydBQdARdTFn+bBf9+8Tdjbp21YIf/24cMgFHVEXc5YP+1kR9raws5GQX9yNb+/mhlzQEXUxZ7X1slssX2Hn6UP+TWvpkAs6oi7mCDsJhFzQEXUxZ9Nhjxvrb1uWERsNuaAj6mLOpsMeN9ZxXRV2NhhyQUfUxRxhJ4GQCzqiLuYIOwmEXNARdTFH2Ekg5IKOqIs5ws7mQ97Jbs83GXJBR9TFHGFnsyE/yn7XR8W2auMEHVEXc4SdzYS8s81vR9ARdTFH2FlG3L7sUcgFHVEXc/Yz7EdFHIR935QXDIovnLJHIRd0RF3M2c/1uNOPg7DvX8hHL+m7NyEXdERdzBF2Egi5oCPqYk4KYR+8XjY1DbmgI+piTgphj9GJ646w1zbkgo6oizmphD2uO8Je25ALOqIu5gi7kCcQckFH1MUcYRfyBEIu6Ij6rqMu5gj7PoS8W/WQCzqivsuoiznCvg8hjy+Y8qzqIRd0RH1XURdzhH1fQt5O6ccVdER9m1EXc4RdyAUdKh51MWd/wt5NMuxxLP90kV9rvUYhLx1Mfc9tr1fDVf4y+4VfGPk1ctuLFc9qHhrhz4dsDci2dd0NvHSxmLN/635cIc+z26Dknax3v16G8M9u9UL+w5vs9jr/9yDkl6lHXNAFnW1GXcwRdiHfadBB1MUcYd/HsAu5oMNWoy7mpBD2OBZ+/yW7Xef/FnJBh1pFXcwRdiEXdKh41MUcYRdyQYeKR13MEXYhF3SoeNTFHGEXckGHikddzBH21cM+OeTxk2SfMFxn4+nBAhd02HzUxRxhXy3sQi7osDdRF3NYPuxCLuiwV1H/eyeEvxyLOXwe9qv+OJkU9hjyn86FXNBhj6I+IOYwOk7i+MjKHV6PhP3/HoZfBEbIBR32KupiDsuEXcgFHfYw6q+yDdKZhQELhz0IOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD77MAigBlue4f9v18e3FsY1HD9b2R/xjFwn42BBwtE0KHKG7RW9ue77HYk6tRknT/J/vwxux2PvScG/X12e5uNhc7Yxzez+y4svN36wiKAueIs5e5xtg5phvwwu33M/nUzIeblODgpxsK7/uw9j/mNhbcfvrQIYKmoLzdTz2f4reKtbnbrZP+/a3GydzGP63e+noeR9TWEf2S370J+6L1ZvO947O1Vvmb5ObrZmGgP3d8sdhwmGz8SkH/8cfG9t+s8vhxypy4brLuhsK4jHnacH/U85DdTNninIxsw2O3YiOvox6GYx3X7bOSw+vz1+nKpQ+75DsTH4q24k3s09L7Zs/6XBwdzdkRqO77M0GH5mfpVP+rTN1aNYiNTznLi447/G/LHJQ/7G6vbXnfiBhO272Ys5kdTT4CL6+xt75diDKz7NadpDo2dt3M+z1Wxk/28+PumuE/QIWGrntBWnuU7/HlezPwfcWN42zvt/9+XB9dD77nI7v+j2GC9CvnhTNjl7DzOuFtDAT2aeTZ7Pnu+WvNrXhVjqhNmHzV7u8Csv1UcHegWnzvubBz3f64a7jALOvXw8uBsjQ3e3UKzl9Gv1566kQrh/HFGNPr5j8bOHo4bvjfFzOOZpw2xAa+G/n25QMzXOwEuX9/fFDH/MCXo/7LEZ4wh/34s8OX9ZujA1Bn+0RNE9cfi7w9F+OMhzOtiIxcPxT8vZviHxX2hf0RAzNmMwwV2QkvNfvQnmz8bzh+KelfsoL4YWr+nf0/5DkDo/5/J562c9T9nfuTrofi/13U9MU7QYVsxzzdOh2HwfN7BzCifWRwWs/ezoZnQtcfa2ULQ569j6z/PvHys/kWx0zrv48+LWzl+uiE/We/90Pf0vv/MkxBeF5+71iecCjrpyWe359nAfrFHMT8sZieh2Ch1hzZK5WPuH/uzlvys4/zpPNNnRFClMXkS8qeWtUeCPFl5KL7cySjPY2kWs/EXY1HvBOej9LmwDCnGfPxpLKuLsV0/5o2h2Ul74gwiP5xYxru8qMepQ+1sWLlj2dzgmIyf+6r4WmcLjLmL/lPT4lPZ8ls8g/3Z0Pd67tcm6Ij5Lr+nwyLmp3OOBpQewupn5sOi7h+DvrkrIZY7s/FrxSNQF/3b4GS2ZnHfyYzId4d2eF2xcQqH3Ek15o2hE2qWn7U8xUk1o9/T7Mf2BrP4ctYUZzX5NeRhc34LgyNCceb7YgNfoxyHx2HyJWWbxdfuhNnPH3e0StCp6cy8vG8VcSZwsbWYj85iOsVG9Y/+hvC292bsuezwlOJj0VfFunfcnyUvclJZ3AFd/OGgaeeBfF/EPu7Avu3/Pfvzvho7qsAYl34l1aCv43KtM3pHv5/7YhY0SX7d6cHze/MrXuX3HYfBU3yeu/47Gxw/5bo2f/0fHEmKs+r1ThbND7vnM/Py0q+DS8vGHY0PxfrfKGI+fG5J2y/ODJ0UxRPK8qeuDEe93OtfRWfN7+h46Ps4DNMf8+sUT925GtqQdoufKT4d533xud6F/NKWsInxE9e1GMiT4p7z7O1Xxfgpx0Jcn38cW7fvNrRexp2FN2Hy89SvxdwMnfrN1Edf8GG730ecZbQW+Mj2UPAfPju0ns+Gyo3ae6/HzobX23LGvIj84jDrXCNhME7GX22tvH/4CnAfjAFBp75Rv99Z0KHa4+c8TD55rQx5PHJ05imVgg7b2yg9zYVloI5jqBk+f7io46qFwC42SA0LAQAAAAAAAAAAAAAAAAAAAAAAAABIQHw539vep+ISylSIa7kDMIh5/nrkUXzxlSOvcCboAFQ35kHUq+cLiwBAzB9j3s3afXkUwp/9V0eNL3J05/A7AFQh5re9Xv/214+98FWjl93bC83DXrj51Cve5zF1AKhczMubqANAxWMu6gCQSMxFHQASibmoA0AiMRd1AEgk5qIOAInEXNT3mivFAaQe88kXjVlPM2v4+V3Idg7iW64oJ+gAVC7moi7oACQSc1EXdAASibmoCzoAicRc1AUdgERiLuqCDkAiMRd1QQcgkZiLuqADkEjMRV3QAUgk5qIu6AAkEnNRF3QAEom5qAs6AInEXNQFHYBEYi7qgg5AIjEXdUEHEPNEYi7qgg4g5onEXNQFHUDME4m5qAs6gJgnRtQFHUDMRR1BBxBzURd0AMRc1KsS9NveXQ2Xx9ts5WlbLZbeCGWjMFxZEMYIYi7qu/PljPe1arg8PlglVtKo6foSjBHE/ImVP38e9bhtucuWj6ivGfRcXLCp+/5VlqMTa8NTqMP6UkfGiJiLegJB/1sn/aXwjcnlk6nD+lJHxoiYi/re+8IiABDzvY56vlzKqB9aMIIOIOaiLugAiLmoCzoAYi7qgg4g5qIu6oIOsHuDiy+9PRNzURd0gIqKF2nIK/4f7/IroiHqgg5QMfnzp/Oox8uaxudXi7qoCzqAqIu6qAs6gKiLuqADIOqiLugAiLqoCzqAqCPqgg4g6qIu6ACIuqgLOgCiLuqCDiDqiLqgA4i6qCccdUEHEHVRF3QARF3UBR0AURd1QQcQdURd0AFEXdSTibqgA4i6qCcQdUEHEHVRTyDqgg4g6qKeQNQFHUDURT2BqAs6gKiTQNQFHUDUSSDqgg4g6iQQdUEHEHUSiLqgA4g6CURd0AFEnQSiLugAok4CURd0AFEngagLOoCok0DUBR1A1Ekg6oIOIOokEHVBBxB1Eoi6oAOIOglEXdABRJ0Eoi7oAKJuuSQQdUEHEHVRTyDqgg4g6qKeQNQFHUDURT2BqAs6gKiLegJRF3QAURf1BKIu6ACIegJRF3QARH2TUc+VUW8IOgCiXjU/vB5+6yxbvg+CDoCoV8nPNyG0Tsq3TrPl2t7klxN0AES94jEXdABEPYGYCzoAop5AzAUdAFFPIObRl3M/4ttW+r+Er//VivhU6rC+1JExQoz6bS9G/S6LeqMf9fiUrPjULHYe88WCHn9psCjrC4i6mLd38W3MCnqnhr+WrhG7koeari/BGEHUax71PYk5AKwmXsb0tvcpu/XCzadeaB72snvrdfv5ptf/+fPbiZUCAFEXcwAQdTEHAFEXcwCoTdTFHABRF3MAEHUxBwBRF3MAqGvUxRwAKh51MQeAikddzAGg4lEXcwCoeNTFHAAqHnUxB4CKR13MAaDiURdzAKh41MUcACoedTEHgIpHXcwBoOJRF3MAqHjUxRwAKh51MQeAikddzAGg4lEXcwCoeNTFHAAqHnUxB4CKR13MAaDiURdzAKh41MUcACoedTEPB9YQACoV9RDuslsj/PkQwuVRCD+8DqH12PDT8PKgLegAUKWoj6ptzAUdgFSiXuuYA0C1o54/pn5iYQAAAAAAAAAAAAAAAAAAAAAAAACwf/5fgAEANYw/F5fXdHUAAAAASUVORK5CYII='/>
		<br><br>
		If a Component Instance is not resized, or not rotated, this option has no effect.
		</div>
	`}function sc(r){let t=L({tag:"div",className:"panel__card",innerHTML:`<h3>${r.displayType} ${r.ident}</h3>`}),n=V("advance width"),e=L({tag:"div",className:"doubleInput"}),a=Ft(r,"advanceWidth","currentItem","input-number"),i=L({tag:"button",className:"panel-card__action-button",title:`Auto-fit advance width
The advance width will be set to the x-max of the paths in this glyph.`,innerHTML:nn({name:"command_autoFit"}),onClick:()=>{let l=d();l.selectedItem.advanceWidth=l.selectedItem.maxes.xMax,l.publish("currentItem",l.selectedItem)}});y(e,[a,L(),i]);let o=L({tag:"label",className:"info",innerHTML:`
			<span>bearings: left${Ie()}right</span>
			<info-bubble>
				<h1>Side Bearings</h1>
				Side bearings are the blank space to the left and right
				of shapes in a glyph. The open space between
				characters is very important for legibility.
				<br><br>
				These are calculated values based on shape positions and the
				Advance Width. They are not properties that are saved with the
				glyph, but it's helpful to think about them as if they were.
				<br>
				<h2>Left side bearing</h2>
				Distance from x=0 to the leftmost side of shapes in the glyph.
				Editing this will move all the shapes in the glyph, and update
				the Advance Width.
				<br>
				<h2>Right side bearing</h2>
				Distance from the rightmost side of shapes in the glyph to the
				Advance Width.
			</info-bubble>
		`}),A=L({tag:"div",className:"doubleInput"}),x=Ft(r,"leftSideBearing","currentItem","input-number"),E=Ft(r,"rightSideBearing","currentItem","input-number");return A.appendChild(x),A.appendChild(he()),A.appendChild(E),r.displayType!=="Component"?(y(t,[n,e]),r.shapes.length&&y(t,[o,A])):y(t,[V("name"),Ft(r,"name","currentItem","input")]),r.shapes.length&&(y(t,mr()),y(t,L({tag:"h4",content:"Bulk-edit paths"})),y(t,ce(r)),y(t,w0(r))),y(t,mr()),y(t,ld()),y(t,sd()),t}function Lc(r){if(!r.usedIn.length)return"";let t=L({tag:"div",className:"panel__card full-width item-links__rows-area",innerHTML:`
		<h3>Links</h3>
		This ${r.displayType} is linked to the following items.
		It is used as a component root and will show up in these items as a component instance.
		`});return r.usedIn.forEach(n=>{t.appendChild(sA(n))}),d().subscribe({topic:"currentItem",subscriberID:"ItemLinkRow",callback:()=>{const n=d(),e=m();document.querySelectorAll(".item-link__thumbnail").forEach(i=>{const o=i.getAttribute("target-item-id"),A=n.project.getItem(o);i.innerHTML=e.makeItemThumbnail(A)})}}),t}function Tc(r){let t=L({tag:"div",className:"panel__card",innerHTML:`<h3>Path ${r.ident}</h3>`}),n=V("path name"),e=Ft(r,"name","currentPath","input"),a=L({tag:"label",className:"info",innerHTML:`
			<span>winding</span>
			<info-bubble>
				<h1>Winding</h1>
				Ordered Path Points that make up a path outline have either a clockwise or counter-clockwise direction.
				This path direction is also known as a path&rsquo;s &ldquo;winding&rdquo;.
				Paths with the same winding will combine, opposite windings will cut-out.
				<br><br>
				For example, to create the glyph &lsquo;o&rsquo;, draw two overlapping oval paths.
				If the outside oval has a clockwise winding, select the inside oval and change it&rsquo;s winding to counter-clockwise.
				This will result in the inside oval appearing in reverse (or cutting out) in relation to the outside oval.
				<br><br>
				<div style="display: grid; gap: 10px; grid-template-columns: 1fr 1fr; width: 350px;">
					<span>Same Winding</span>
					<span>Different Winding</span>
					<img
						alt="Paths with the same winding will visuall combine"
						class="winding-help-image"
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ0AAABkCAYAAACcuzIHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACutJREFUeNrsXS1YI0kQ7SAXcWNYy+hdQQw60ZzYmMWCvhNwYjVg17CI08laTsCJW0vQKwji1jLYQ5ATnM3N6+qamYQkkGRmuqd66vuGQPib6nr1qrqmu1qpWmopWRqVudPzURh/xNWMr8C8u2ney0oUX/eZz+nabUQV0DHI6NfMfKc18ZPD+LrNfN3XH3cb/Rp0qwGsHV9bZvDbyfee4vG+H6SfR7fjv/s+Y5/N+FfXAzVhHPzytX61DcTzUdvo1ppwJqV+ZPATxbf89G/69Ubsa2+Nr72JfyVsTjod69iPdRzUoJttAIzcXnx1EvbCwP99TYP+ENHrMgKj6GuLXt8lGB4YIH4txTjkTB0Dsk4CKH3dkjNpgA0X/9sbIQERurGeGyGz4qUB4WWs59Bv0JERDhKgAVjf4/H5/mcMtoIjxfvYONsf4qvDxok0+JTq5c6A56P9+OMHrScABR1/XNPrU4EYgF7QD+y/3eF3e8bJ+n6BjsIKgY2B1v+6PJOtKmCFdkyyrX0Ox2CGs5UMQw61b/QMEh3xakOgF4C3c8DhGI51YoP9GhbAdqTzGITOv87sGWGWtPcJgBSC+9owi4CPwHakAQcW+xbr2O9ReuCKgAE/HpGuFH7jm1RfXAi9+YLtfHQVXyN1fDWKQ9softftC/eIe8U90703X5x5no+O9c//fjeKDeq+juvBSH08HqnuI3R8NGlA5cEGQ3QrBbZp4Pt8w+A7NWWN5zkbjAbjwYhV0xHg+6XLOt6YiFRJwHUSQ1TB61+6dg6zjNBJQikzOIwG41VZx7CZZffpDuYwu13oG/90UX1DTDICdCKjXGgAIpRWkcFf52B3L6YVTtTacKO44e2OLENkgcdsAD2lAY6vjTDLeoeuAo7yGuQ/uGGpgIN+ABvYgD+X6mC49k8ZeF3XAHec5DVSBx/5DgCGcIrPJxNwCXnrrAu6Ubi9cSPP49kpPF864MBs03JUZgO8Sh8D68BjwEn2ch5s5DfzJkUYAx/YnspHloDnE+BeCyQfgMd5benA843hFs1/pKcbAB5y29KAR7NU2YDDoM7L4V5T5/LFKVEcL+EZquyEmcMHPHmVwjbPanmmKxt43aIAF+o6HCryUgeRwYKBzAMsCM34W5KeysxKJwpZLID4var3V2UA8yr2cpheNC+sZgH5Md9HZlz8lRwq8BQFAMk7dcBjMukTC1w8o83xeWo1l+wsGgqLYnJesyb18eB4fnecT1gFiiUDjmebRT68B6Clh1k4F+V3zVUAdyg+rHLeVfSMnMOs5DJKGmavlgVcoJNDyeURToLLmmFiZix9MsbOxQtdF548SJ/uI8cqM8nnyYr0/JhqlHfLsZwPgwPmKTvv8cWZF6rd+cRyZedYnEPWbFezXOl5pK3/7QDbrU2BHRLAQH37osQK73bHZm8bgv+LDc/tfbljzJ0bqD/Ni6A70DvSn4ZyBwSAA/Cue3YN0t5TouWbduq26XowA3RU1GuaH5Yr6Odh27HQ1wStKzZCueOMJkjUTuNgHtPtrdSSqwoCI6OBDDpD2RTu2LTdke3gFGI780DXca6hTRGhldt12RaEd+khFoyONnCZR2NrE6E1ND8kV2BkVxwLDR/T5oUyhRtaZiYUWaZriw+t64EboXUyxKJBo/wQ254Gug+Fd7+0Ldz29YdDeuJe0BFUsoDRMUE1m3iyoGvqlqSSBW1Ql+3pW3SIlc90CdutZfK5QHRo1els0y2Wg6C5NXI6yXkd53bmmIK1hOXSb8gOr5NHAFhnOuMEb70AXSsLutA5BshbmElcdCzc0zvhkwly9jALupb6J5Kt9FuHQYeqAQ4kkSx04Ew4PpF4uJetNE7PeYjcZQHp4ZVJLZ4/rCWzCun5HGp0roIO8iaQPf7p2Acp0/03VLVYEuTT0ssmqQRr3hiWa3S12HUupeLwymudnjxguuxJgrVYkzWeUdQsUEuZoKullhp0tcgHHcVV6ctranEIdKKOW3xB1n+qLW5TTC3Sn/DqwxIi14XGf8CgG4pfWuOy6NUv3lQPhgy6gXjQ4THMpsNMJ/2JUIqvYYbpNuWDbt3R55s+PC3hBQ27jSS83nqzysHFWTpYQPrTElovGGUnEgPxiwjBdHjU52IagXsSv4h2k3A2Brp0diFXsJAw3HIstBpn92F/CiJqArrdRqTzOulsh7KJazrifpiFpQrvN1aqn2U6euN9SzboeN2aSxMKMK8v+40nwivkWj7TGeO61LQG9+LDfmMAzjz9yoLuMkODcgUbf9+13AEc35NkIT2TXh4p6Civi8R3EUJe5wrToZ2Eax0HiphAUMXg8jnomO186JfG7V9dYAAfumSBzHYbg1mgO9OolAw8zBQxobDN6Og3DPD7EVrHPGscdBRiB+K7CIFdMBg2C8XcJ8/lbZF5AI7GuDcbdMx28ELJCwC437Ct7uYYW1QKpIfWnw8oZSMymwO63QZQORTdbh6CZt5oeG2jZvfxKNvyXu4Egkpwr+ya7sOJOdDNxok5tk7qcejEnFkrh7/ERhmqnUO5nojwijC7d1ou2zHL9XuyWY4i5cliv8hsJ/k05rJPJfSF5XCY8pyj1eftkQDbRdozJZdPysztfu3KZzmsmqFc7rfl/gAOEyv6mHEXcjscDvfpotj/s90ZeTOWS59snQLvSvyJfUUDoixg276QpuAEzYmzwJYBXejFseoARFFHnZd5ZLutK2zyUZs5zT7xh3wIDQBG3mzELIrXOqwuDLwL8d7KANk5zHd2jJqV/JpcDmH1OegCXez7fCN7ABEKATyEi1W9H2OFS7KjwkEprBa0SgSHnADR0j0XdaZVa5QYI/yNVcFbhciAmm6hwmWUsgqqtnKUVViKwo3sHBjOBKc6H3XLKQAy8CRX1jkfWxR4VDaQPTYp4G74kLmygHfqzeC+FngYixpwhQOvm+tsr8rA45BaA64U4FENT/LkIgu8aRMDHwCH/NQJwE3meCisSi0PIMcD6DDwPEGArjzTlQy4tCzSdQNwKfDaupwyiw2kzGrhWDx7RxVeclkE+jKLI4d3Uug57Y02hOQ8jx750CV1vSEcCQRCTxoqsD2QZ7YIPZKMAl1ogeLI6HinHUzac1Uu+1D+FqrKCIXbu1JX5hYZZsYN0cw8GuyKcTDkqimLH6tKChnlWCsBZaqYbOOeyRCPMw3BDgY98ey2apMpOAvnqlgpUil2m5/rdSsFvhRsPGsLX6HnoQYns7vr4APY0onCXVm5W6P0kKsUduB29F6BP05o76crDWSwT6K1T5uE053pJ5ObhV9kd6UOjZ6B3g+BfRguddrEznt0GKCWD5HRsVfWv29YYz6ljjT4noaBBt73P+1tPsbgo5UGbZuDB1wuDLbp4OsYPUMNOuzov+7ZcTI4EfQD2Mih+go9RkoEm13QPTcMWKGpjQHgoUlgkQyIQde7lloEONoJRkagNgjDnPUEw+8ZXYMEgGjkUyQDQkc4U9pTJDIOdbaSQ1UadM/ZD0ZB9562fg8hGN0zH+7JQGjLv2jDGQw2jivAtji0Wk37pSljgGs1pd9GgXpmdQy1Y6EBN/rmAYA4xGTRdrDczBJ6sY7jLVeZ1ZyI8e6Abjo74NrSLMiHIUPYUPNk81lv4cgY4FYbYbfRd8TRoGPL6Nce+z6DcJ5DjTc6GhodB8aZ+i4eOOgu6KYbqanDExnopdlkZK6hKx6+ABBDo+drevH2E0aryImW/wswAEGrvdgr+YXFAAAAAElFTkSuQmCC"
					>
					<img
						alt="Paths with different windings will appear transparent where they overlap"
						class="winding-help-image"
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ4AAABkCAYAAAB3jIkEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAChtJREFUeNrsXS1020gQ3hQ2oCYpjXADahIc4R6IyZXauCQh5T56xFdw2DH1ATvgjtrGAXZAS63QBtgFCdXp21lZ8k8cO5G0q9md97bKe/3bmf3mm5ldaVYIJ040yIHxM+yGlejXqhrH6inUs7Llb86jMVE/43mnnhPx+WBuoJ6xjl40PirdPDW2yUTpGqzoGDjg7Q+0WjTOouFLwweRLTHu7+j5GNn5Z2TX+y22PYrW63003kb/nBet59ExPT2JW/zFYTRG0ehrAWI39JV+pOe90uf7SCx+fpiTvtvkxKfncaTXe6Ujfj6szFM6DiMdJw5464vgKbDVpdf/GNICyOcw+/8Pi/UhGidn9CSW6CgQBjnqCR3Ppa73QUXc9BM9HzLGPhxP6hnpeFoDEAOpH/Q0AIQHmgEXg60mF+HmWsjnQ4EEdFihhTk9p2eyOP0MneoiGg0Jtn+/kY73BUdCMKFfJx2PvEA52l9Gph25hdJueBmNqfh7GopPl2G0+GH0O/oH5oH5YF6YXzdsqND/slDaDXvRCMWXdhgtvBk6YpzWQvG1F8q5dcO2cg7WoGtGYyaag1D4DXMW4qnFwTwxXzjKfoAbiPYsFL83zXGqTePII6dgC0CEVDDIn+MwyjvMBtzqwHwJgFOVGjwdUrF4ZQDcdgC2XszyBgHOW3i/6Qz33MD8KQQP1pghZnIsXpkAtwmACcs3ygq6S6lAo1XuxVjNAaFPHH6x99YNx5LJTcrhskgzQBbkZJWyAK4iJwx2KFtY3Sf8UlgiIHLUEU5GBchsa4phzO47JooJc2G5TQtC+dBUVq1gBk5stynFIPZrmQq6hmQAbEdwXQTkQAir6RAU6132HHbbgGOt6m0I6FrSK7iG1tj45PntJ5ke1SxX/cH0VHiMzQBfvIXAOdwkoGs8m2YgDHO1A0aSZlT1gg4UjBBkM+iWC6uxJeCb6QFfDDquRcS+oLMXfF6RoGvKBXFMtw18vHO+BHwF5XxYCO45HVicTimar95a4lztpsFXwD4d7+oVg7YO2hnYy5f24u6kWdlra/jgvE+HQUdi2YUPHK2BPTnnwki5XpqW7GDAgTyR4Aw6nFHmkTDjhIO77egYMeNK1wavhW7ktbWcosWUfbRAMZVZvkevNs3Y53V0IN7LMT/22e8EJPlxM5sQy/UNjPUwke+2AI4WcezE2ZYopOjNHe81hqpJL+UcYjFo66Qh8pa4QEMuyb9AG7zGUFP2+1CUlwxEUQKAA+icbZrky74zUOYGehX4xuwdGoUUiOtFbMe9oCia7dKFBnenflEK49iuCPAN2LMe9NuL9WzI7SgUDIQuscG5MXZ2blSy9oQBvR+x2JPOrO2PvtlgjroYdgRrifuHZNUf5eXSEZ8ueNt6eIVfa6v7em/W9pnwh+gPMwbeOS26frlSnZz42hrNiW76BL4tjFfT0slIB+Nh0XULtUTrq/kwZr0ORdItwDuXrcK4g+6wYlLHzGvFwHyFWs9V0+H2zVqYvekzB54xYTaWPvtwC0HzyVS4TTOeL9uePjDv00dhbWjMfKgx4kR1JmXMetcUUTcA74x9mPVUb2DD+gHLcIu2uJyFWgr7mxnvx5A/8Exiu1T6zZ7x4obiajM5Dbzqsx3Gyy4fJKvcGjiziXIKG1ivmgAPKIzb23OW956ZjBfneSfcWQ/XcMg7PBaM57FnO8l4PrGLmRLIKwL4V7beCvBueStNizo3uL3+LXvg4VIcVWDEwPvI/rSCwqzJtB4I7yP/AmOlqq2wB95b4zdoA/abyFLLiawpEuBxF6oaR845NMvjfInxqrncGeZkn8p2aMWWykqodeKkGKEtO88Bz0nBOd6tA54TF2qdOOA5cZKj0F5lkADPhj0kk6X0NybuKISzBfAmNpXyhkqV/WtpG0It/+vB6SWIM4dvzaLOoxPgHTNnvEfjfctj/1paDLzPB8MYeLfsczxiPN9o4NnxhtAS4wXs3/mP2cTcJN6WN4SGy8Dj/i4YhJJ3U3MKCz498AlrC+DhgBrAc+FWjxAL838LnPbwbtOMRxTI/UsnyqFMfNvSt2IrJfWVXxp4E9u+7TRIztizHSLqkbf4pjkNvJEl33ZW9F7y+wTjfR/xtv1KB4cEeOgVByrkXmQQ69UNyu88WVhw71lD0XS0DjwS/i2zqE2HSdTOv1ESilbCVf8p4F0Lv84ceIuWWaaE27oVreFQQ6Raw60zng3hlhhGv4fZEmaJzJZawy0Djz52vhK/Me/L+983/NowYCYN2faX8xktSIyK1qungUfSEWcN3sDD1gVVt7oVvRAj5o3OicSuVjs4rAMPpxho1eozB98/f+gNtwB9MKmw/qwURQWRWGd3o7jLP/IGnrug0BlGA9u5K7uccTTc3uic+hkDjeU/4C56yxJ0l/L6dOfQW43kW3FDN4AAQOQPOrqhm/v9ZV/aG+8v29dYPfG1x9tQAAIAsXLfVg7A68lFcbbcw0tPa7wN1mjlW2jgpkju0QO60a2Yl85o2oxmofNSiB1kbby2aA5sCRPVjG03YB9iqUjLIV0hrx3LkMR/G2Ca2ddo3bApixfO0cKrxlVsLa88pSpRzX0PCsVUFiEDe6FYECwM5xSFdgVaeW8J1CwyZvvVTso5r0vs1BOFiC2eTOGj6SLD1mJiXOxH8lgQ7uBLcpeGA50JoEtXuvaA73Jn0HGvYLWCzk7ma1vNdEg/qPAam9GDBqGoG4asjX7kJQXHqtFJf/6gI/3HZjU+QrUL43Pe54PxsYlOxveWGJ/zwf8ujK8ZfFW5KFgcMATvc92Z3OsDC3BOMz5dhjKaFfH2TgYnHFR0cN3Dgl7EAJRoczyVAHEQu08NbPmxQ+hFMsqF/aAHJdczpV9Fsh5eLuDkZGA5cqxWObvRp9kPZ6BlZgbMP85z1osLcrKypxjIU6mAmGr7CCpjAPoLZihb5Yf50utSg62LQU7WWoTfMgEwCauzF53UlACADelNMQBNZUDMKwHcdM+TC0+xovkABMOlAcf+khcC4ECGLlSIplSFAAnmQyF18KpOAwkAKQSbkgPGTkUhVRvgDrRvv6CNA1p14av6YYca6hTZ/Ry9PdDNCI1lvCraLKCDzre4c2UmeS71abkQD3NP6ofuUEU26onbhJ2eJ52bSMcrXUt/YBQLChFZRviyrwlaO/wYUSPFLIEIoKEjFhoFYhHQHpXANsp9IcjR6tLRAEL0PUYnUDyzbkV74lOzHOhJTXPwH3Skrql2YQ54q8UINU88k090U7qb0OI8/BJLjao39R45SdUAMPrhOwIbbi+izvZDQd0ph7JXjB4dvSUd0fUdev2MMHF/F7fNpT/7M1h3Pq+adOmP9UJX9dixCGgTpWd/tWmOA97uTIGFwvOdSO6qqIjN91bA4PPUz7/UM8gshOax9US6VJVe6U7om6rpudIp/vlW0B0SgTZn2kP+F2AAw6cPzxGbmzkAAAAASUVORK5CYII="
					>
				</div>
			</info-bubble>
		`}),i=L({tag:"option-toggle",innerHTML:"<option>Clockwise</option><option>Counter-clockwise</option>",attributes:{"selected-name":za(r.winding),"selected-value":za(r.winding)},onClick:()=>{const x=d();r.reverseWinding(),x.history.addState(`Toggled path winding to ${za(r.winding)}`),x.publish("currentPath",r)}}),o=ce(r),A=w0(r);return y(t,[n,e,a,i,o,A]),y(t,mr()),y(t,ax()),t}function za(r){let t="Unknown";return r>0&&(t="Counter-clockwise"),r<0&&(t="Clockwise"),t}function cc(r){let t=L({tag:"div",className:"panel__card",innerHTML:`<h3>${r.shapes.length} selected paths</h3>`});return y(t,ce(r)),y(t,w0(r)),y(t,ax()),t}function Ic(r){const t=d();let n=L({tag:"div",className:"panel__card",innerHTML:`<h3>Path point ${r.pointNumber+1} ${r.ident}</h3>`}),e=ce(r.p,"point"),a=V("point type"),i=L();y(i,[Xa("symmetric",r.type==="symmetric",()=>{r.type="symmetric",r.makeSymmetric(),t.publish("currentPathPoint",r)}),Xa("flat",r.type==="flat",()=>{r.type="flat",r.makeFlat(),t.publish("currentPathPoint",r)}),Xa("corner",r.type==="corner",()=>{r.type="corner",t.publish("currentPathPoint",r)})]),t.subscribe({topic:"currentPathPoint",subscriberID:"pointTypeButtons",callback:x=>{document.getElementById(`pointTypeButton-${x.type}`)&&(document.getElementById("pointTypeButton-symmetric").removeAttribute("selected"),document.getElementById("pointTypeButton-flat").removeAttribute("selected"),document.getElementById("pointTypeButton-corner").removeAttribute("selected"),document.getElementById(`pointTypeButton-${x.type}`).setAttribute("selected","")),aa("h1",x),aa("h2",x)}});let o=L({id:"h1Group",className:"span-all-columns"});y(o,Lo("h1",r));let A=L({id:"h2Group",className:"span-all-columns"});return y(A,Lo("h2",r)),y(n,e),y(n,[a,i]),y(n,[o,A]),y(n,mr()),y(n,ix()),n}function Lo(r="h1",t){let n=L({className:"pre-checkbox"}),e=Ln(t[r],"use","currentPathPoint");t.type!=="corner"&&e.setAttribute("disabled",""),y(n,[e,L({tag:"h4",content:`Use handle ${r.charAt(1)}`})]);let a=L({id:`${r}InputGroup`,style:`display: ${t[r].use?"grid":"none"}`}),i=ce(t[r],r);return y(a,i),d().subscribe({topic:"currentPathPoint",subscriberID:`controlPointInputGroup.${r}`,callback:o=>{o.type==="symmetric"&&o.makeSymmetric(r),o.type==="flat"&&o.makeFlat(r),aa("h1",o),aa("h2",o)}}),[n,a]}function aa(r="h1",t){let n=t;t.objType==="ControlPoint"&&(n=t.parent);let e=document.getElementById(`${r}Group`);if(e){let a=n[r].use,i=e.querySelector("input");if(i.removeAttribute("checked"),i.removeAttribute("disabled"),a){i.setAttribute("checked",""),n.type!=="corner"&&i.setAttribute("disabled","");let o=document.getElementById(`${r}InputGroup`);o.style.display="grid",o.querySelectorAll("input-number")[0].setAttribute("value",n[r].x),o.querySelectorAll("input-number")[1].setAttribute("value",n[r].y)}}}function hc(r){let t=L({tag:"div",className:"panel__card",innerHTML:`<h3>${r.pathPoints.length} selected path points</h3>`});return y(t,ix()),t}function Xa(r,t,n){let e=it.gray.l40,a=L({tag:"button",className:"pointTypeButton",id:`pointTypeButton-${r}`,attributes:{title:`point type: ${r}`}});a.addEventListener("click",n),t&&a.setAttribute("selected","");let i=`
	<svg version="1.1"
		xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		x="0" y="0" width="20" height="20" viewBox="0 0 20 20" enable-background="new 0 0 20 20">
		<g fill="${e}">
		<rect x="8" y="8" width="1" height="4"/>
		<rect x="11" y="8" width="1" height="4"/>
		<rect x="8" y="8" width="4" height="1"/>
		<rect x="8" y="11" width="4" height="1"/>
		<rect x="4" y="4" width="1" height="1"/>
		<rect x="5" y="5" width="1" height="1"/>
		<rect x="6" y="6" width="1" height="1"/>
		<rect x="7" y="7" width="1" height="1"/>
		<circle cx="3" cy="3" r="1.5"/>
	`;switch(r){case"corner":i+=`
			<rect x="7" y="12" width="1" height="1"/>
			<rect x="6" y="13" width="1" height="1"/>
			<rect x="5" y="14" width="1" height="1"/>
			<rect x="4" y="15" width="1" height="1"/>
			<circle cx="3" cy="17" r="1.5"/>
			`;break;case"symmetric":i+=`
			<rect x="12" y="12" width="1" height="1"/>
			<rect x="13" y="13" width="1" height="1"/>
			<rect x="14" y="14" width="1" height="1"/>
			<rect x="15" y="15" width="1" height="1"/>
			<circle cx="17" cy="17" r="1.5"/>
			`;break;case"flat":i+=`
			<rect x="12" y="12" width="1" height="1"/>
			<rect x="13" y="13" width="1" height="1"/>
			<circle cx="15" cy="15" r="1.5"/>
			`;break}return i+="</g></svg>",a.innerHTML=i,a}function dc(){const r=d();let t=[],n=r.multiSelect.points;if(n.length===1)t.push(Ic(n.singleton));else if(n.length>1){let i=n.virtualShape;t.push(hc(i))}let e=r.multiSelect.shapes;e.length===1?e.singleton.objType==="ComponentInstance"?t.push(Ac(e.singleton)):t.push(Tc(e.singleton)):e.length>1&&n.length===0&&t.push(cc(e.virtualGlyph)),t.push(sc(r.selectedItem));const a=Lc(r.selectedItem);return a&&t.push(a),r.subscribe({topic:"whichShapeIsSelected",subscriberID:"attributesPanel",callback:()=>{ir()}}),r.subscribe({topic:"whichPathPointIsSelected",subscriberID:"attributesPanel",callback:()=>{ir()}}),t}let vn,wn;function ni(r,t=!1,n=d()){vn=r,wn=!0;let e=L({tag:"div",className:"item-chooser__wrapper"}),a=L({tag:"div",className:"item-chooser__header"});a.appendChild(pc(n)),e.appendChild(a);let i=t||n.nav.page;return i==="Ligatures"?e.appendChild(Na(n)):i==="Components"?e.appendChild(Da(n)):e.appendChild(ei(n)),e}function Sc(r,t){vn=t,wn=!0;let n=L({tag:"div",className:"item-chooser__wrapper"});if(r==="Ligatures")n.appendChild(Na()),n.appendChild(L({tag:"fancy-button",innerHTML:"Create new ligature",onClick:Z1}));else if(r==="Components")n.appendChild(Da()),n.appendChild(L({tag:"fancy-button",innerHTML:"Create new component",onClick:S1}));else if(r==="Kerning")n.appendChild(c1()),n.appendChild(L({tag:"fancy-button",innerHTML:"Create a new kern group",onClick:()=>ia(!1)}));else{let e=L({tag:"div",className:"item-chooser__header"});n.appendChild(e),e.appendChild(Cc()),n.appendChild(ei())}return n}function pc(r=d()){let t=r.selectedCharacterRange,n=L({tag:"option-chooser",attributes:{"selected-name":t.name,"selected-id":t.id}}),e,a=mt(r.project.ligatures),i=mt(r.project.components);return a&&(e=L({tag:"option",innerHTML:"Ligatures",attributes:{note:`${a}&nbsp;items`}}),e.addEventListener("click",()=>{r.selectedCharacterRange="Ligatures",document.querySelector(".item-chooser__tile-grid").remove(),document.querySelector(".item-chooser__wrapper").appendChild(Na())}),n.appendChild(e)),i&&(e=L({tag:"option",innerHTML:"Components",attributes:{note:`${i}&nbsp;items`}}),e.addEventListener("click",()=>{r.selectedCharacterRange="Components",document.querySelector(".item-chooser__tile-grid").remove(),document.querySelector(".item-chooser__wrapper").appendChild(Da())}),n.appendChild(e)),(a||i)&&n.appendChild(L({tag:"hr"})),T1(n,r),n}function Cc(r=d()){let t=r.selectedCharacterRange,n=L({tag:"option-chooser",attributes:{"selected-name":t.name,"selected-id":t.id}});return T1(n),n}function T1(r,t=d()){let e=m().settings.project.characterRanges,a;e.forEach(i=>{a=L({tag:"option",innerHTML:i.name,attributes:{note:i.note}}),a.addEventListener("click",()=>{t.selectedCharacterRange=i,document.querySelector(".item-chooser__tile-grid").remove(),document.querySelector(".item-chooser__wrapper").appendChild(ei())}),r.appendChild(a)})}function ei(r=d()){let t=L({tag:"div",className:"item-chooser__tile-grid"}),n=r.selectedCharacterRange.getMembers(r.project.settings.app.showNonCharPoints);return n!=null&&n.length&&n.forEach(e=>{const a=`glyph-${e}`;let i=new da({"displayed-item-id":a,project:r.project});r.selectedGlyphID===a&&i.setAttribute("selected",""),i.addEventListener("click",()=>vn(a)),wn&&r.subscribe({topic:"whichGlyphIsSelected",subscriberID:`glyphTile.${a}`,callback:o=>{parseInt(o)===parseInt(a)?i.setAttribute("selected",""):i.removeAttribute("selected")}}),t.appendChild(i)}),t}function Na(r=d()){const t=L({tag:"div",className:"item-chooser__tile-grid"}),n=r.project.sortedLigatures,e=ai(n,r.chooserPage.ligatures,r);return n.length>e.length&&t.appendChild(ii("ligatures",n,r)),e.forEach(a=>{let i=new da({"displayed-item-id":a.id});r.selectedLigatureID===a.id&&i.setAttribute("selected",""),i.addEventListener("click",()=>vn(a.id)),wn&&r.subscribe({topic:"whichLigatureIsSelected",subscriberID:`glyphTile.${a.id}`,callback:o=>{o===a.id?i.setAttribute("selected",""):i.removeAttribute("selected")}}),t.appendChild(i)}),t}function Da(r=d()){let t=L({tag:"div",className:"item-chooser__tile-grid"});const n=r.project.sortedComponents,e=ai(n,r.chooserPage.components,r);return n.length>e.length&&t.appendChild(ii("components",n,r)),e.forEach(a=>{let i=new da({"displayed-item-id":a.id});r.selectedComponentID===a.id&&i.setAttribute("selected",""),i.addEventListener("click",()=>vn(a.id)),wn&&r.subscribe({topic:"whichComponentIsSelected",subscriberID:`glyphTile.${a.id}`,callback:o=>{o===a.id?i.setAttribute("selected",""):i.removeAttribute("selected")}}),t.appendChild(i)}),t}function c1(r=d()){let t=L({tag:"div",className:"kern-group-chooser__list"});const n=r.project.sortedKernGroups,e=ai(n,r.chooserPage.kerning,r);return n.length>e.length&&t.appendChild(ii("kerning",n,r)),e.forEach(a=>{let i=I1(a.id);r.selectedKernGroupID===a.id&&i.setAttribute("selected",""),i.addEventListener("click",()=>vn(a.id)),wn&&r.subscribe({topic:"whichKernGroupIsSelected",subscriberID:`kernGroupRow.${a.id}`,callback:o=>{o===a.id?i.setAttribute("selected",""):i.removeAttribute("selected")}}),t.appendChild(i)}),t}function I1(r,t=m()){const n=t.getItem(r),e=L({className:"kern-group-chooser__row"}),a=L({className:"kern-group-chooser__left-members"});a.appendChild(fn(n.leftGroup));const i=L({className:"kern-group-chooser__right-members"});return i.appendChild(fn(n.rightGroup)),y(e,[L({content:r}),a,L({className:"kern-group-chooser__members-divider",content:"&emsp;|&emsp;"}),i]),e}function ai(r=[],t=0,n=d()){const e=parseInt(n.project.settings.app.itemChooserPageSize)||256;if(r.length<e)return r;const a=t*e,i=a+e;return r.slice(a,i)}function ii(r,t=[],n=d()){const e={ligatures:Na,components:Da,kerning:c1},a=parseInt(n.project.settings.app.itemChooserPageSize)||256,i=n.chooserPage[r],o=Math.ceil(t.length/a),A=L({tag:"button",className:"editor-page__tool",content:"◁"});n.chooserPage[r]===0?A.setAttribute("disabled",""):A.addEventListener("click",()=>{n.chooserPage[r]-=1,n.chooserPage[r]=Math.max(n.chooserPage[r],0);let l;r==="kerning"?l=document.querySelector(".kern-group-chooser__list"):l=document.querySelector(".item-chooser__tile-grid"),l.innerHTML="",l.appendChild(e[r]())});const x=L({tag:"button",className:"editor-page__tool",content:"▷"});n.chooserPage[r]===o-1?x.setAttribute("disabled",""):x.addEventListener("click",()=>{n.chooserPage[r]+=1,n.chooserPage[r]=Math.min(n.chooserPage[r],o-1);let l;r==="kerning"?l=document.querySelector(".kern-group-chooser__list"):l=document.querySelector(".item-chooser__tile-grid"),l.innerHTML="",l.appendChild(e[r]())});const E=L({tag:"div",className:"item-chooser__page-control"});return y(E,[A,L({content:`Page ${i+1} of ${o}`}),x]),E}class Wr extends cr{constructor({leftGroup:t=[],rightGroup:n=[],value:e=0}={}){super(),this.leftGroup=t,this.rightGroup=n,this.value=e,this.objType="KernGroup"}save(t=!1){const n={leftGroup:this.leftGroup.slice(),rightGroup:this.rightGroup.slice(),value:this._value};return t&&(n.objType=this.objType),n}print(t=0){let n="";for(let a=0;a<t;a++)n+="  ";let e=`${n}{${this.objType} 
`;return n+="  ",e+=`${n}leftGroup: ${JSON.stringify(this.leftGroup)}
`,e+=`${n}rightGroup: ${JSON.stringify(this.rightGroup)}
`,e+=`${n}value: ${this.value}
`,e+=`${n.substring(2)}}/${this.objType}`,e}get leftGroup(){return this._leftGroup||[]}get rightGroup(){return this._rightGroup||[]}get value(){return this._value||0}get name(){return`${this.leftGroupAsString} | ${this.rightGroupAsString}`}get leftGroupAsString(){let t="";return this.leftGroup&&(t=lr(this.leftGroup.join(""))),t}get rightGroupAsString(){let t="";return this.rightGroup&&(t=lr(this.rightGroup.join(""))),t}set leftGroup(t=[]){t=t.map(n=>zt(n)),t=t.filter(or),this.changed(),this._leftGroup=t}set rightGroup(t=[]){t=t.map(n=>zt(n)),t=t.filter(or),this.changed(),this._rightGroup=t}set value(t){this._value=parseInt(t)||0,this.changed()}}const uc=Object.freeze(Object.defineProperty({__proto__:null,KernGroup:Wr},Symbol.toStringTag,{value:"Module"}));function Rc(){const r=d(),t=r.selectedKernGroupID,n=`
		<div class="editor-page__tools-area"></div>
		<div class="editor-page__edit-canvas-wrapper"></div>
		<div class="editor-page__zoom-area"></div>
	`,e='<div class="editor-page__edit-canvas-wrapper" style="grid-column: span 2; overflow-y: scroll;"></div>',a=L({tag:"div",id:"app__page",innerHTML:`
		<div class="editor__page">
			<div class="editor-page__left-area">
				<div class="editor-page__nav-area">
					${Pt({level:"l1",superTitle:"PAGE",title:"Kerning"})}
				</div>
				<div id="editor-page__panel"></div>
			</div>
			${t?n:e}
		</div>
	`});let i=a.querySelector("#nav-button-l1");i.addEventListener("click",function(){bt(i)});const o=a.querySelector(".editor-page__nav-area"),A=a.querySelector(".editor-page__edit-canvas-wrapper");if(!t)return y(A,gc()),o.style.display="block",i.style.width="100%",i.style.borderRadius="4px",a;const x=r.selectedKernGroup,E=Pt({level:"l2",superTitle:"EDITING",title:x.name}),l=Pt({level:"l3",superTitle:"PANEL",title:r.nav.panel});o.appendChild(b(E)),o.appendChild(b(l));const T=L({tag:"edit-canvas",id:"editor-page__edit-canvas",attributes:{"editing-item-id":r.selectedKernGroupID}});A.appendChild(T);let s=a.querySelector("#nav-button-l2");s.addEventListener("click",function(){bt(s)}),r.subscribe({topic:"whichKernGroupIsSelected",subscriberID:"nav.kernChooserButton",callback:()=>{s.innerHTML=Mn(r.selectedKernGroup.name,"EDITING")}});let c=a.querySelector("#nav-button-l3");c.addEventListener("click",function(){bt(c)});const I=a.querySelector("#editor-page__panel");I.appendChild(Re()),I.addEventListener("scroll",Br),r.subscribe({topic:["whichKernGroupIsSelected"],subscriberID:"nav.panelChooserButton",callback:()=>{ir()}}),r.selectedTool="kern";let h=a.querySelector(".editor-page__tools-area");h.innerHTML="";let S=Oh();S&&y(h,S);let p=a.querySelector(".editor-page__zoom-area");p.innerHTML="";let u=Ba();return u&&y(p,u),r.subscribe({topic:"whichKernGroupIsSelected",subscriberID:"editCanvas.selectedKernGroup",callback:D=>{a.querySelector("#editor-page__edit-canvas").setAttribute("editing-item-id",D)}}),a}function gc(){const r=L({className:"editor-page__first-run",innerHTML:`
			<h1>There are no kern pairs in your project</h1>
			<p>
				Kerning is an advanced feature of fonts that recognizes a pair of characters, then
				adjusts the spacing between them to some custom value. The default spacing between
				characters is zero - which is to say, the white space (side bearings) within each
				character are the only space shown.
			</p>
			<p>
				Some letter combinations, like <code>VA</code>
				as an example, if the default side bearing spacing
				is used, the letters visually look very far apart. Kerning can help the visual flow of
				character pairs look more well considered. Many character pairs may need either negative
				or positive kern values to make them "look right".
			</p>
			<h2>Class-based kerning</h2>
			<p>
				Font files encode kerning values as three pieces of information: a left character, a right
				character, and a horizontal adjustment value. Fonts with many characters can end up having
				a huge amount of kern pairs. Glyphr Studio uses a system called Class-based Kerning, where
				groups of characters with similar edges (like
					<code>V</code><code>v</code><code>W</code><code>w</code>
					)
				can be treated as a single left-hand group, and a group of right-hand characters (for example,
				<code>A</code><code>/</code>) can be treated as single group - which can be given a single value.
				When a font is exported, the permutations are saved as individual kern pairs. But, while
				editing, grouping common characters often simplifies the overall kerning process.
			</p>
		`}),t=L({tag:"fancy-button",innerHTML:"Create a new kern group",onClick:()=>ia(!1)});return r.appendChild(t),r}function yc(r,t,n){const e=oi(),a=m();return a.addItemByType(new Wr({leftGroup:r,rightGroup:t,value:n}),"KernGroup",e),a.kerning[e]}function oi(r=m().kerning){let t=mt(r);for(;r[`kern-${t}`];)t++;return`kern-${t}`}function ia(r=!1){const t=L({innerHTML:`
		<h2>${r?"Edit this":"Create a new"} kern group</h2>
		Specify which characters should be in the left-side group,
		the right-side group, then what distance in <code>Em</code>
		units should be used for the kern value.
		<br><br>

		<h3>Left group</h3>
		<input id="kerning__add-new-kern-group__left-group" type="text"
		value="${r?r.leftGroupAsString:""}"
		autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
		/>
		<br><br>
		<h3>Right group</h3>
		<input id="kerning__add-new-kern-group__right-group" type="text"
		value="${r?r.rightGroupAsString:""}"
		autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
		/>
		<br><br>
		<h3>Value</h3>
		<input id="kerning__add-new-kern-group__value" type="text"
			value="${r?r.value:""}"
			autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
		/>
		<br><br>
		<fancy-button disabled id="kerning__add-new-kern-group__submit-button">
			${r?"Save changes":"Add new kern group"}
		</fancy-button>
		`}),n=t.querySelector("#kerning__add-new-kern-group__submit-button"),e=t.querySelector("#kerning__add-new-kern-group__left-group"),a=t.querySelector("#kerning__add-new-kern-group__right-group"),i=t.querySelector("#kerning__add-new-kern-group__value");e.addEventListener("change",o),a.addEventListener("change",o),i.addEventListener("change",o),e.addEventListener("keyup",o),a.addEventListener("keyup",o),i.addEventListener("keyup",o),r&&(n.removeAttribute("disabled"),n.addEventListener("click",A));function o(){e.value!==""&&a.value!==""&&i.value?(n.removeAttribute("disabled"),n.addEventListener("click",A)):(n.setAttribute("disabled",""),n.removeEventListener("click",A))}function A(){const x=d();let E=jn(e.value),l=jn(a.value),T=parseInt(i.value);if(r)r.leftGroup=E,r.rightGroup=l,r.value=T,x.history.addState("Edited kern group: "+x.selectedKernGroupID),x.publish("currentKernGroup",x.selectedKernGroup),x.navigate(),nt();else{const s=yc(E,l,T);typeof s=="string"?rr(s):(x.selectedItemID=s.id,x.navigate(),nt())}}Ar(t,500)}function Nc(){const r=L({innerHTML:`
		<h2>Find a letter pair</h2>
		Specify a pair of letters below, and search will return all the Kern Groups
		that contain that pair. Clicking on a search result will select that Kern Group
		behind the dialog box.
		<br><br>
		It is good to not have duplicate values for a letter pair - the value that actually
		gets used may not be the expected one.
		<br><br>

		<div class="list__two-column" style="max-width: 100px;">
			<div class="list__column-header">Left group letter</div>
			<div class="list__column-header">Right group letter</div>
			<input
				id="kerning__letter-pair__left-group" type="text" value=""
				autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="1"
				onclick="this.select();"
			/>
			<input
				id="kerning__letter-pair__right-group" type="text" value=""
				autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="1"
				onclick="this.select();"
			/>
		</div>
		<br>

		<fancy-button disabled id="kerning__letter-pair__search-button">
			Search
		</fancy-button>
		<br><br>
		<hr/>
		<br>
		<div id="kerning__letter-pair__results">
			<i>Search results...</i>
		</div>
		`}),t=r.querySelector("#kerning__letter-pair__left-group");t.addEventListener("change",jr),t.addEventListener("keyup",jr);const n=r.querySelector("#kerning__letter-pair__right-group");n.addEventListener("change",jr),n.addEventListener("keyup",jr),r.querySelector("#kerning__letter-pair__search-button").addEventListener("click",Oc),Ar(r,800)}function Dc(){const r=L({innerHTML:`
		<h2>Delete letter pairs</h2>
		Specify a pair of letters below, and search will find and attempt to delete all
		the letter pairs from the applicable Kern Groups.
		<br><br>
		<b>Note</b>: This will only affect Kern Groups where either the left group or the right group has only one member. Kern Groups affect all possible permutations of left group / right group.
		Because of this, if a left group and a right group both have multiple members, including
		the specified letter pair, removing the letters from the letter pair would remove more
		than just the kern value for those two letters.
		<br><br>

		<div class="list__two-column" style="max-width: 100px;">
			<div class="list__column-header">Left group letter</div>
			<div class="list__column-header">Right group letter</div>
			<input
				id="kerning__letter-pair__left-group" type="text" value=""
				autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="1"
				onclick="this.select();"
			/>
			<input
				id="kerning__letter-pair__right-group" type="text" value=""
				autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" maxlength="1"
				onclick="this.select();"
			/>
		</div>
		<br>

		<fancy-button disabled danger id="kerning__letter-pair__search-button">
			Find and delete
		</fancy-button>
		<div id="kerning__result-message"></div>
		`}),t=r.querySelector("#kerning__letter-pair__left-group");t.addEventListener("change",jr),t.addEventListener("keyup",jr);const n=r.querySelector("#kerning__letter-pair__right-group");n.addEventListener("change",jr),n.addEventListener("keyup",jr),r.querySelector("#kerning__letter-pair__search-button").addEventListener("click",mc),Ar(r,800)}function jr(){const r=document.querySelector("#kerning__letter-pair__left-group"),t=document.querySelector("#kerning__letter-pair__right-group"),n=document.querySelector("#kerning__letter-pair__search-button");r.value.length&&t.value.length?n.removeAttribute("disabled"):n.setAttribute("disabled","")}function Oc(){const r=document.querySelector("#kerning__letter-pair__left-group").value.charAt(0),t=document.querySelector("#kerning__letter-pair__right-group").value.charAt(0),n=m().kerning,e=[];Object.keys(n).forEach(i=>{n[i].leftGroup.includes(Or(r))&&n[i].rightGroup.includes(Or(t))&&e.push(i)});const a=document.querySelector("#kerning__letter-pair__results");if(a.innerHTML="",e.length){const i=d().selectedKernGroupID;e.forEach(o=>{let A=I1(o);A.addEventListener("click",()=>{const x=d();x.selectedItemID=o,x.history.addState(`Navigated to ${x.project.getItemName(o,!0)}`),document.querySelectorAll(".kern-group-chooser__row").forEach(l=>l.removeAttribute("selected")),A.setAttribute("selected","")}),o===i&&A.setAttribute("selected",""),a.appendChild(A)})}else a.innerHTML="<i>No Kern Groups exist with that letter pair</i>"}function mc(){const r=document.querySelector("#kerning__letter-pair__left-group").value.charAt(0),t=document.querySelector("#kerning__letter-pair__right-group").value.charAt(0),n=document.querySelector("#kerning__result-message");n.innerHTML="";const e=m().kerning;let a,i=[],o=[];Object.keys(e).forEach(A=>{e[A].leftGroup.includes(Or(r))&&e[A].rightGroup.includes(Or(t))&&(a=Bc(r,t,A),a?o.push(A):i.push(A))}),i.length&&(n.innerHTML=`
			<br><br>
			<b>Warning</b><br>
			The following Kern Groups contain the specified letter pair, but
			the letters could not be removed because both the left group and
			the right group contain multiple members.
			<br><br>
			${i.join(", ")}
			<br><br>
			<hr>
		`),o.length>0?(n.innerHTML+=`
			<br>
			Successfully removed letter pair from Kern Group${o.length>1?"s:":":"}
			<br><br>
			${o.join(", ")}
		`,d().navigate()):i.length||(n.innerHTML+=`
				<br>
				<i>No Kern Groups with the specified letter pair was found.</i>
			`)}function Bc(r="",t="",n=!1){let e={},a=Or(r),i=Or(t);const o=d();let A=!1;if(n){let x=o.project.getItem(n);x&&(e[n]=x)}else e=o.project.kerning;return Object.keys(e).forEach(x=>{let E=e[x].leftGroup,l=e[x].rightGroup;E.includes(a)&&l.includes(i)&&(E.length===1&&l.length===1?(o.deleteItem(x,o.project.kerning),A=!0):E.length===1?(l.splice(l.indexOf(i),1),A=!0):l.length===1&&(E.splice(E.indexOf(a),1),A=!0))}),A}function fn(r){const t=L();return r.forEach(n=>{t.appendChild(Hc(n))}),t}function Hc(r){let t=lr(r),n=bn(r),e=r;return n&&(e=`${n}
${r}`),L({tag:"code",innerHTML:t,attributes:{title:e}})}function Fc(r){let t=L({tag:"div",className:"panel__card",innerHTML:"<h3>Kern Group</h3>"}),n=V("Value"),e=Ft(r,"value","currentKernGroup","input-number"),a=V("Left group"),i=fn(r.leftGroup),o=V("Right group"),A=fn(r.rightGroup);return y(t,[n,e,a,i,o,A]),y(t,mr()),y(t,Td()),t}function fc(){let r=L({tag:"div",className:"panel__card",innerHTML:"<h3>Other kern group actions</h3>"}),t=L({tag:"div",className:"panel__actions-area"});return _t(t,Jt("otherKernGroupActions")),r.appendChild(t),r}function Mc(){const r=d();return mt(r.project.kerning)<=0?[]:[Fc(r.selectedKernGroup),fc()]}function oa(r=50,t=!1,n=0,e=100,a=1){let i=L({className:"fancy-slider__wrapper"}),o=L({className:"fancy-slider__slider-readout",innerHTML:r}),A=L({tag:"input",attributes:{type:"range",value:r,style:`accent-color: hsl(${r+200}, 100%, 40%);`,min:n,max:e,step:a},className:"fancy-slider__bar"});return A.addEventListener("input",x=>{const E=parseInt(x.target.value);o.innerHTML=E,A.setAttribute("style",`accent-color: hsl(${E+200}, 100%, 40%);`),t&&t(E)}),y(i,[A,o]),i}function Gc(){const r=d(),t=m();let n=L({tag:"div",className:"panel__card",innerHTML:"<h3>Characters</h3>"}),e=L({tag:"p",className:"spanAll",content:`Context characters are a small set of letters that are shown around
		the character you are currently editing.`});const a=t.settings.app.contextCharacters;let i=V("Show&nbsp;context&nbsp;characters&nbsp;&nbsp;"),o=tr(a,"showCharacters",()=>{d().autoFitView(),To()}),A=Ft(r.selectedItem,"contextCharacters","editCanvasView","input",["input"]);A.addEventListener("input",()=>d().autoFitView());let x=V("Transparency"),E=oa(a.characterTransparency,h=>{a.characterTransparency=h,d().editCanvas.redraw()});A.classList.add("spanAll"),y(n,[e,A,mr(),i,o,x,E]);let l=L({tag:"div",className:"panel__card",innerHTML:`<h3>Guides and labels</h3>
	`}),T=V("Show guides and labels"),s=tr(a,"showGuides",To),c=V("Transparency"),I=oa(a.guidesTransparency,h=>{a.guidesTransparency=h,d().editCanvas.redraw()});return y(l,[T,s,c,I]),[n,l,W1(!0)]}function To(){d().editCanvas.redraw()}function h1({iconName:r="default",iconOptions:t=!1,title:n="",disabled:e=!1,onClick:a=!1,id:i=!1}={}){let o=L({tag:"button",innerHTML:Q[r](t),attributes:{title:n}});return a&&o.addEventListener("click",a),e&&o.setAttribute("disabled","disabled"),i&&o.setAttribute("id",i),o}let Q={};function $(r){return`
		<svg
			version="1.1" viewBox="0 0 30 30"
			height="100%" width="100%"
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		>
			${r}
		</svg>
	`}let B={darkFill:it.gray.l25,lightFill:it.gray.l85,blueOutline:it.blue.l70,greenOutline:it.green.l70,grayOutline:it.gray.l70,purpleOutline:it.purple.l40,redX:Ur.red};Q.copy=()=>{let r="",t=B.blueOutline,n=B.grayOutline,e=B.darkFill;return r+=`
		<polygon fill="${e}" points="1,22 1,10.4 10.4,1 18,1 18,22"/>
		<path fill="${n}" d="M17,2v19H2V10.8L10.8,2H17 M19,0h-9L0,10v13h19V0L19,0z"/>
		<polygon fill="${e}" points="12,29 12,17.4 21.4,8 29,8 29,29"/>
		<path fill="${t}" d="M28,9v19H13V17.8L21.8,9H28 M30,7h-9L11,17v13h19V7L30,7z"/>
	`,$(r)};Q.paste=()=>{let r="",t=B.blueOutline,n=B.darkFill;return r+=`
		<rect fill="${n}" x="5" y="7"	width="20" height="22"/>
		<path fill="${t}" d="M24,8v20H6V8H24 M26,6H4v24h22V6L26,6z"/>
		<path fill="${n}" d="M9,9V4h3V3c0-1.3,1.8-2,3-2s3,0.7,3,2v1h3v5H9z"/>
		<path fill="${t}" d="M15,2c0.9,0,2,0.5,2,1v2h2h1v3H10V5h1h2V3C13,2.5,14.1,2,15,2 M15,0c-1.7,0-4,1-4,3H8v7h14V3h-3C19,1,16.7,0,15,0L15,0z"/>
	`,$(r)};Q.pastePathsFromAnotherGlyph=()=>{let r="",t=B.blueOutline,n=B.darkFill;return r+=`
		<rect fill="${n}" x="5" y="7"	width="20" height="22"/>
		<path fill="${t}" d="M24,8v20H6V8H24 M26,6H4v24h22V6L26,6z"/>
		<path fill="${n}" d="M9,9V4h3V3c0-1.3,1.8-2,3-2s3,0.7,3,2v1h3v5H9z"/>
		<path fill="${t}" d="M15,2c0.9,0,2,0.5,2,1v2h2h1v3H10V5h1h2V3C13,2.5,14.1,2,15,2 M15,0c-1.7,0-4,1-4,3H8v7h14V3h-3C19,1,16.7,0,15,0L15,0z"/>
		<path fill="${t}" d="M17.4,20.6h-4.8l-1,3h1.6v1.7H8v-1.7h1.6l3.6-10.2h-1.6V12h6.8v1.5h-1.7l3.7,10.2H22v1.7h-5.2v-1.7h1.7L17.4,20.6z M16.9,19.1l-1.8-5.6H15l-1.8,5.6H16.9z"/>
	`,$(r)};Q.pastePathsFromAnotherProject=()=>{let r=B.lightFill,t=B.purpleOutline;const n=`
		<path fill="${r}" d="m11.5,1c4.817,0,7.471,0,8.986,1.514,1.514,1.515,1.514,4.168,1.514,8.986s0,7.471-1.514,8.985c-1.515,1.515-4.168,1.515-8.986,1.515s-7.471,0-8.985-1.515c-1.515-1.514-1.515-4.168-1.515-8.985s0-7.471,1.515-8.986c1.514-1.514,4.168-1.514,8.985-1.514"/>
		<path fill="${t}" d="m11.5,23c-5.084,0-7.886,0-9.692-1.808-1.808-1.808-1.808-4.608-1.808-9.692S0,3.615,1.808,1.808C3.614,0,6.416,0,11.5,0s7.886,0,9.692,1.808c1.808,1.808,1.808,4.608,1.808,9.692s0,7.885-1.808,9.692c-1.807,1.808-4.608,1.808-9.692,1.808Zm0-21c-4.55,0-7.057,0-8.278,1.222s-1.222,3.729-1.222,8.278,0,7.057,1.222,8.278,3.728,1.222,8.278,1.222,7.057,0,8.278-1.222,1.222-3.729,1.222-8.278,0-7.057-1.222-8.278-3.728-1.222-8.278-1.222Z"/>
		<rect fill="${t}" x="5" y="5" width="3" height="3"/>
		<path fill="${r}" d="m18.5,8c4.817,0,7.471,0,8.986,1.514,1.514,1.515,1.514,4.168,1.514,8.986s0,7.471-1.514,8.985c-1.515,1.515-4.168,1.515-8.986,1.515s-7.471,0-8.985-1.515c-1.515-1.514-1.515-4.168-1.515-8.985s0-7.471,1.515-8.986c1.514-1.514,4.168-1.514,8.985-1.514"/>
		<path fill="${t}" d="m28.192,8.808c-1.807-1.808-4.608-1.808-9.692-1.808-.176,0-.329,0-.5,0v-2.001h-3v2.033c-.735.022-1.389.068-2,.133v-2.166h-3v2.961c-.437.228-.841.495-1.192.847-.352.352-.618.756-.847,1.192h-2.961v3h2.166c-.065.611-.111,1.265-.133,2h-2.033v3h2.001c0,.171,0,.324,0,.5,0,5.084,0,7.885,1.808,9.692,1.807,1.808,4.608,1.808,9.692,1.808s7.886,0,9.692-1.808c1.808-1.808,1.808-4.608,1.808-9.692s0-7.885-1.808-9.692Zm-1.414,17.971c-1.222,1.222-3.728,1.222-8.278,1.222s-7.057,0-8.278-1.222-1.222-3.729-1.222-8.278,0-7.057,1.222-8.278,3.728-1.222,8.278-1.222,7.057,0,8.278,1.222,1.222,3.729,1.222,8.278,0,7.057-1.222,8.278Z"/>
		<path fill="${t}" d="m20.233,20h-3.467l-1.092,3h1.525v2h-5.2v-2h1.733l3.467-9h-1.733v-2h6.067v2h-1.733l3.467,9h1.733v2h-5.2v-2h1.517l-1.083-3Zm-.433-1l-1.3-4-1.3,4h2.6Z"/>
	`;return $(n)};Q.addPath=function(r=!1){let t="",n=B.blueOutline,e=B.darkFill;return r&&(n=B.greenOutline,e=B.lightFill),t+=`
		<rect fill="${e}" x="1" y="1"	width="16" height="16"/>
		<path fill="${n}" d="M16,2v14H2V2H16 M18,0H0v18h18V0L18,0z"/>
	`,t+=`
		<rect x="21" y="15" fill="${n}" width="3" height="15"/>
		<rect x="15" y="21" fill="${n}" width="15" height="3"/>
	`,$(t)};Q.undo=()=>{let r="",t=B.blueOutline,n=B.darkFill;return r+=`
		<path fill="${n}" d="M20.1,23c4.6-5,6.6-9.6,5.5-12.8C24.9,8.2,22.9,7,20,7c-5.9,0-8.8,5.3-8.9,5.5L10.9,13l2.4,4.1l-12,0.8l4-14.4l2.5,4.2l0.9-1.1c0,0,4-4.6,11.2-4.6c4.1,0,7.9,2.8,8.8,6.5C29.4,10.8,29.3,16.3,20.1,23z"/>
		<path fill="${t}" d="M20,3c3.1,0,6.9,2,7.8,5.7c0.5,2.1-0.1,4.4-1.6,6.7c0.7-2,0.9-3.9,0.3-5.5C25.7,7.4,23.3,6,20,6c-6.5,0-9.6,5.8-9.8,6.1l-0.5,1l0.6,1l1.3,2.2l-8.9,0.6L5.7,6l0.6,1l1.4,2.4l1.8-2.2C9.6,7.2,13.2,3,20,3 M20,1C12.2,1,8,6,8,6L5,1L0,19l15-1l-3-5c0,0,2.6-5,8-5c7.7,0,7.2,9.2-8,21C39.8,15,29.5,1,20,1L20,1z"/>
	`,$(r)};Q.linkToGlyph=()=>{let r="",t=B.greenOutline;return r+=`
		<path fill="${t}" d="M18,8.8L8.8,18c-0.5,0.5-1.3,0.5-1.8,0s-0.5-1.3,0-1.8L16.2,7c0.5-0.5,1.3-0.5,1.8,0S18.5,8.3,18,8.8z"/>
		<path fill="${t}" d="M7.5,21.2c-1.1,1.1-2.8,1.8-4.1,0.5s-0.6-3,0.5-4.1l5.9-5.9c-1.8-0.5-3.8,0.1-5.5,1.8L2,15.7c-2.4,2.4-2.6,5.7-0.5,7.8s5.4,2,7.8-0.5l2.3-2.3c1.7-1.7,2.3-3.7,1.8-5.5L7.5,21.2z"/>
		<path fill="${t}" d="M21.2,7.5c1.1-1.1,1.8-2.8,0.5-4.1s-3-0.6-4.1,0.5l-5.9,5.9c-0.5-1.8,0.1-3.8,1.8-5.5L15.7,2c2.4-2.4,5.7-2.6,7.8-0.5s2,5.4-0.5,7.8l-2.3,2.3c-1.7,1.7-3.7,2.3-5.5,1.8L21.2,7.5z"/>
		<rect x="21" y="15" fill="${t}" width="3" height="15"/>
		<rect x="15" y="21" fill="${t}" width="15" height="3"/>
	`,$(r)};Q.round=()=>{let r=B.redX,t=B.darkFill,n=`
		<path fill="${r}" d="M17.4,21.9c0.4,0.5,2-0.5,1.4-1.4c-1.3-1.9-4.8-5.9-6.5-7.3C11.1,12.2,10,13,10,13S14.4,17.5,17.4,21.9z"/>
		<path fill="${r}" d="M12.2,21.6c-0.5,1-2.1-0.1-1.3-1.2c1.5-2.2,4.4-6.4,6.5-7.9c1.3-1,2.1-0.1,2.1-0.1S14.9,16.7,12.2,21.6z"/>
		<path fill="${r}" d="M28,21.9c0.4,0.5,2-0.5,1.4-1.4c-1.3-1.9-4.8-5.9-6.5-7.3c-1.2-1-2.3-0.3-2.3-0.3S24.9,17.5,28,21.9z"/>
		<path fill="${r}" d="M22.7,21.6c-0.5,1-2.1-0.1-1.3-1.2c1.5-2.2,4.4-6.4,6.5-7.9c1.3-1,2.1-0.1,2.1-0.1S25.5,16.7,22.7,21.6z"/>
		<path fill="${t}" d="M2,20V9H0V7h4v13h2v2H0v-2H2z"/>
		<path fill="${t}" d="M7,22v-2h2v2H7z"/>
	`;return $(n)};Q.flipVertical=()=>{let r="",t=B.blueOutline,n=B.grayOutline,e=B.darkFill;return r+=`
		<polygon fill="${e}" points="6.4,13 1,7.6 1,1 14.7,1 29,9.6 29,13"/>
		<path fill="${n}" d="M14.2,2L28,10.1V12H6.8L2,7.2V2h12 M15,0H0v8l6,6h24V9L15,0L15,0z"/>
		<polygon fill="${e}" points="1,29 1,22.4 6.4,17 29,17 29,20.4 14.7,29"/>
		<path fill="${t}" d="M28,18v1.9L14.4,28H2v-5.2L6.8,18H28 M30,16H6l-6,6v8h15l15-9V16L30,16z"/>
	`,$(r)};Q.flipHorizontal=()=>{let r="",t=B.blueOutline,n=B.grayOutline,e=B.darkFill;return r+=`
		<polygon fill="${e}" points="1,29 1,15.3 9.6,1 13,1 13,23.6 7.6,29"/>
		<path fill="${n}" d="M12,2v21.2L7.2,28H2V15.6L10.1,2H12 M14,0H9L0,15v15h8l6-6V0L14,0z"/>
		<polygon fill="${e}" points="22.4,29 17,23.6 17,1 20.4,1 29,15.3 29,29"/>
		<path fill="${t}" d="M19.9,2L28,15.6V28h-5.2L18,23.2V2H19.9 M21,0h-5v24l6,6h8V15L21,0L21,0z"/>
	`,$(r)};Q.exportGlyphSVG=()=>{let r=B.blueOutline,n=`
		<polygon fill="${B.darkFill}" points="3,8 3,30 27,30 27,0 11,0"/>
		<path fill="${r}" d="M9.2,19.9c-0.4,0.4-1,0.6-1.6,0.6c-0.7,0-1.3-0.2-1.8-0.7v0.6H4.9v-2.6h0.9v0.6c0.4,0.8,1,1.2,1.7,1.2 c0.4,0,0.7-0.1,0.9-0.3c0.2-0.2,0.4-0.5,0.4-0.9c0-0.3-0.1-0.6-0.3-0.7c-0.2-0.2-0.6-0.3-1.1-0.5c-0.6-0.2-1.1-0.3-1.4-0.5 c-0.3-0.2-0.6-0.4-0.7-0.7c-0.2-0.3-0.3-0.6-0.3-1c0-0.6,0.2-1.1,0.6-1.5C5.9,13.2,6.4,13,7,13c0.6,0,1.1,0.2,1.6,0.6v-0.5h0.9 v2.2H8.6v-0.5c-0.4-0.6-0.9-0.8-1.5-0.8c-0.4,0-0.7,0.1-0.9,0.3c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.2,0.1,0.4,0.2,0.5 c0.1,0.1,0.2,0.3,0.4,0.3c0.2,0.1,0.5,0.2,1,0.3c0.6,0.2,1.1,0.3,1.4,0.5c0.3,0.1,0.5,0.4,0.7,0.7c0.2,0.3,0.3,0.7,0.3,1.2 C9.9,19,9.7,19.5,9.2,19.9z"/>
		<path fill="${r}" d="M21.4,13c1,0,1.9,0.3,2.5,0.9v-0.8h0.9v2.4H24c-0.2-0.4-0.5-0.8-0.9-1.1c-0.4-0.3-0.9-0.5-1.5-0.5 c-0.8,0-1.4,0.3-1.9,0.8c-0.5,0.5-0.7,1.2-0.7,1.9c0,0.9,0.3,1.5,0.8,2.1c0.5,0.5,1.2,0.8,1.9,0.8c0.6,0,1.1-0.2,1.5-0.5 c0.5-0.3,0.7-0.7,0.8-1.3h-1.3v-0.9h2.6c0,0.1,0,0.2,0,0.3c0,1-0.3,1.8-1,2.4c-0.7,0.6-1.5,0.9-2.6,0.9c-1.3,0-2.3-0.4-2.9-1.1 c-0.6-0.7-1-1.6-1-2.6c0-1.1,0.3-2,1-2.7C19.4,13.4,20.3,13,21.4,13z"/>
		<polygon fill="${r}" points="14.1,18.9 15.9,14 15,14 15,13.1 17.8,13.1 17.8,14 16.9,14 14.5,20.4 13.5,20.4 11.1,14 10.2,14 10.2,13.1 13.1,13.1 13.1,14 12.2,14"/>
	`;return $(n)};Q.deleteGlyph=()=>{let r=B.redX,n=`
		<path fill="${B.darkFill}" d="M20.2,18.5H10L7.8,25h3.5v3.6H0V25h3.5l7.8-21.8H7.8V0h14.6v3.2h-3.6l8,21.8H30v3.6H18.8V25h3.5L20.2,18.5zM19.2,15.2L15.4,3.2H15l-4,11.9H19.2z"/>
		<path fill="${r}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${r}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>
	`;return $(n)};Q.reverseWinding=()=>{let r="",t=B.blueOutline,n=B.grayOutline;return r+=`
		<path fill="${n}" d="M3.7,7.8V5L0,8.7l3.7,3.7V9.6c6.2,0,11.2,5,11.2,11.2h1.9C16.8,13.6,10.9,7.8,3.7,7.8z"/>
		<path fill="${t}" d="M25.2,22.3C25.2,10,15.2,0,3,0v3.2c10.5,0,19.1,8.6,19.1,19.1h-4.8l6.4,6.4l6.4-6.4H25.2z"/>
	`,$(r)};Q.switchPathComponent=function(r=!1){let t="",n=B.blueOutline,e=B.greenOutline,a=B.darkFill,i=B.lightFill;return r&&(n=B.greenOutline,e=B.blueOutline,a=B.lightFill,i=B.darkFill),t+=`
	<polygon fill="${a}" points="5.1,21 1,17.2 1,1 3.4,1 10,11.3 10,21"/>
	<path fill="${n}" d="M2.9,2L9,11.6V20H5.5L2,16.7V2H2.9 M3.9,0H0v17.6L4.7,22H11V11L3.9,0L3.9,0z"/>
	<polygon fill="${i}" points="21.8,29 16,23.6 16,1 19.8,1 29,15.3 29,29"/>
	<path fill="${e}" d="M19.1,2L28,15.6V28h-5.8L17,23.1V2h2 M20.4,0H15v24l6.4,6H30V15L20.4,0L20.4,0z"/>
	`,$(t)};Q.subtractUsingBottom=()=>{let r="",t=B.blueOutline,n=B.darkFill,e=B.lightFill;return r+=`
		<path fill="${n}" d="M11,29v-6c6.6,0,12-5.4,12-12h6v18H11z"/>
		<path fill="${t}" d="M28,12v16H12v-4c6.4-0.5,11.5-5.6,12-12H28 M30,10h-8.1c0,0.3,0.1,0.7,0.1,1c0,6.1-4.9,11-11,11c-0.3,0-0.7,0-1-0.1V30h20V10L30,10z"/>
		<circle fill="${e}" cx="11" cy="11" r="11"/>
	`,$(r)};Q.subtractUsingTop=()=>{let r="",t=B.blueOutline,n=B.darkFill,e=B.lightFill;return r+=`
		<rect fill="${e}" x="11" y="11" width="19" height="19"/>
		<path fill="${n}" d="M10,21c-5-0.5-9-4.8-9-10C1,5.5,5.5,1,11,1c5.2,0,9.4,4,10,9H10V21z"/>
		<path fill="${t}" d="M11,2c4.3,0,7.9,3,8.8,7H11H9v2v8.8c-4-0.9-7-4.5-7-8.8C2,6,6,2,11,2 M11,0C4.9,0,0,4.9,0,11s4.9,11,11,11V11h11C22,4.9,17.1,0,11,0L11,0z"/>
	`,$(r)};Q.combine=()=>{let r="",t=B.blueOutline,n=B.darkFill;return r+=`
		<path fill="${n}" d="M11,29v-8L10.1,21C4.9,20.5,1,16.2,1,11C1,5.5,5.5,1,11,1c5.2,0,9.5,3.9,10,9.1L21,11h8v18H11z"/>
		<path fill="${t}" d="M11,2c4.7,0,8.5,3.5,9,8.2l0.2,1.8h1.8H28v16H12v-6.1v-1.8L10.2,20C5.5,19.5,2,15.7,2,11C2,6,6,2,11,2M11,0C4.9,0,0,4.9,0,11c0,5.7,4.4,10.4,10,10.9V30h20V10h-8.1C21.4,4.4,16.7,0,11,0L11,0z"/>
	`,$(r)};Q.deletePath=function(r=!1){let t="",n=B.redX,e=B.blueOutline,a=B.darkFill;return r&&(e=B.greenOutline,a=B.lightFill),t+=`
		<rect fill="${a}" x="1" y="1"	width="16" height="16"/>
		<path fill="${e}" d="M16,2v14H2V2H16 M18,0H0v18h18V0L18,0z"/>
	`,t+=`
		<path fill="${n}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${n}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>
	`,$(t)};Q.edit=()=>{let r="",t=B.blueOutline,n=B.darkFill;return r+=`
		<path fill="${t}" d="m28.643,1.357c-1.577-1.577-4.109-1.891-5.651-.349L4,20,0,29l1,1,9-4L28.992,7.008c1.542-1.542,1.228-4.074-.349-5.651Z"/>
		<path fill="${n}" d="m28.643,1.357C27.771.486,26.608,0,25.482,0,24.57,0,23.682.318,22.992,1.008L4,20,0,29l1,1,9-4L28.992,7.008c1.542-1.542,1.228-4.074-.349-5.651ZM6.268,20.561l15.793-15.793,3.172,3.172-15.793,15.793-3.172-3.172Zm-.662.752l3.082,3.082-5.548,2.466,2.466-5.548ZM27.577,5.594l-1.638,1.638-3.172-3.172,1.638-1.638c.281-.28.643-.423,1.076-.423.611,0,1.264.288,1.747.771.44.44.719,1.018.765,1.586.028.346-.021.842-.416,1.237Z"/>
	`,$(r)};Q.delete=()=>{let r="",t=B.redX;return r+=`
		<path fill="${t}" d="m23.597,28.681c1.121,1.472,6.349-1.368,4.386-3.98C23.74,19.055,12.613,7.416,7.367,3.301,3.535.295,0,2.518,0,2.518c0,0,13.846,13.354,23.597,26.164Z"/>
		<path fill="${t}" d="m6.893,28.339c-1.703,2.813-6.56-.4-4.174-3.566C7.551,18.364,16.797,6.057,23.298,1.396c4.182-2.998,6.702-.235,6.702-.235,0,0-14.277,12.59-23.107,27.178Z"/>
	`,$(r)};Q.createNewKernGroup=()=>{let r="",t=B.greenOutline,n=B.darkFill;return r+=`
		<path d="m16.306,19.001l-4.324-11.39h-1.593v-1.611h5.08v1.611h-1.487l3.278,8.641,3.19-8.641h-1.501v-1.611h4.941v1.611h-1.563l-4.235,11.39h-1.786Z" fill="${n}"/>
		<path d="m12.197,17.375l-3.58-9.75h1.57v-1.625H3.548v1.625h1.517l-3.493,9.75H0v1.625h5.116v-1.625h-1.578l.994-2.941h4.679l.966,2.941h-1.615v1.625h5.088v-1.625h-1.453Zm-7.181-4.463l1.751-5.287h.273l1.682,5.287h-3.705Z" fill="${n}"/>
		<polygon points="13 20.5 13 22.5 0 22.5 0 23.5 13 23.5 13 25.5 14 25.5 14 20.5 13 20.5" fill="${n}"/>
		<polygon points="24 2 10 2 10 0 9 0 9 5 10 5 10 3 24 3 24 2" fill="${n}"/>
		<rect x="21" y="15" width="3" height="15" fill="${t}"/>
		<rect x="21" y="15" width="3" height="15" transform="translate(45 0) rotate(90)" fill="${t}"/>
	`,$(r)};Q.deleteSingleLetterPair=()=>{let r="",t=B.redX,n=B.darkFill;return r+=`
		<path d="m16.306,19.001l-4.324-11.39h-1.593v-1.611h5.08v1.611h-1.487l3.278,8.641,3.19-8.641h-1.501v-1.611h4.941v1.611h-1.563l-4.235,11.39h-1.786Z" fill="${n}"/>
		<path d="m12.197,17.375l-3.58-9.75h1.57v-1.625H3.548v1.625h1.517l-3.493,9.75H0v1.625h5.116v-1.625h-1.578l.994-2.941h4.679l.966,2.941h-1.615v1.625h5.088v-1.625h-1.453Zm-7.181-4.463l1.751-5.287h.273l1.682,5.287h-3.705Z" fill="${n}"/>
		<path d="m26.428,29.033c.625.821,3.542-.763,2.447-2.22-2.367-3.149-8.574-9.642-11.5-11.938-2.138-1.677-4.11-.437-4.11-.437,0,0,7.723,7.449,13.163,14.595Z" fill="${t}"/>
		<path d="m17.111,28.842c-.95,1.569-3.659-.223-2.328-1.989,2.695-3.575,7.853-10.44,11.479-13.04,2.333-1.673,3.739-.131,3.739-.131,0,0-7.964,7.023-12.889,15.16Z" fill="${t}"/>
	`,$(r)};Q.findSingleLetterPair=()=>{let r="",t=B.blueOutline,n=B.darkFill;return r+=`
		<path d="m16.306,19.001l-4.324-11.39h-1.593v-1.611h5.08v1.611h-1.487l3.278,8.641,3.19-8.641h-1.501v-1.611h4.941v1.611h-1.563l-4.235,11.39h-1.786Z" fill="${n}"/>
		<path d="m12.197,17.375l-3.58-9.75h1.57v-1.625H3.548v1.625h1.517l-3.493,9.75H0v1.625h5.116v-1.625h-1.578l.994-2.941h4.679l.966,2.941h-1.615v1.625h5.088v-1.625h-1.453Zm-7.181-4.463l1.751-5.287h.273l1.682,5.287h-3.705Z" fill="${n}"/>
		<path d="m30,28l-5.154-5.154c.728-1.104,1.154-2.425,1.154-3.846,0-3.866-3.134-7-7-7s-7,3.134-7,7,3.134,7,7,7c1.421,0,2.742-.426,3.846-1.154l5.154,5.154,2-2Zm-15.5-9c0-2.481,2.019-4.5,4.5-4.5s4.5,2.019,4.5,4.5-2.019,4.5-4.5,4.5-4.5-2.019-4.5-4.5Z" fill="${t}"/>
	`,$(r)};Q.moveLayerDown=()=>{let r="",t=B.blueOutline,n=B.darkFill;return r+=`
		<rect fill="${t}" x="23" y="21" width="2" height="7"/>
		<path fill="${t}" d="M20,26h8l-4,4C24,30,19.9,25.9,20,26z"/>
		<polygon fill="${t}" points="15,17 5.4,12.5 0,15 15,22 30,15 24.6,12.5"/>
		<polygon fill="${n}" points="15,14 0,7 15,0 30,7"/>
	`,$(r)};Q.moveLayerUp=()=>{let r="",t=B.blueOutline,n=B.darkFill;return r+=`
		<rect fill="${t}" x="23" y="23" width="2" height="7"/>
		<path fill="${t}" d="M20,25h8l-4-4C24,21,19.9,25.1,20,25z"/>
		<polygon fill="${n}" points="15,17 5.4,12.5 0,15 15,22 30,15 24.6,12.5"/>
		<polygon fill="${t}" points="15,14 0,7 15,0 30,7"/>
	`,$(r)};Q.align=function(r){let t="",n=B.blueOutline,e=B.darkFill;switch(r){case"bottom":t+=`
				<rect fill="${e}" x="1" y="21" width="6" height="8"/>
				<path fill="${n}" d="M6,22v6H2v-6H6 M8,20H0v10h8V20L8,20z"/>
				<rect fill="${e}" x="12" y="5" width="6" height="24"/>
				<path fill="${n}" d="M17,6v22h-4V6H17 M19,4h-8v26h8V4L19,4z"/>
				<rect fill="${e}" x="23" y="15" width="6" height="14"/>
				<path fill="${n}" d="M28,16v12h-4V16H28 M30,14h-8v16h8V14L30,14z"/>
			`;break;case"middle":t+=`
				<rect fill="${e}" x="1" y="11" width="6" height="8"/>
				<path fill="${n}" d="M6,12v6H2v-6H6 M8,10H0v10h8V10L8,10z"/>
				<rect fill="${e}" x="12" y="3" width="6" height="24"/>
				<path fill="${n}" d="M17,4v22h-4V4H17 M19,2h-8v26h8V2L19,2z"/>
				<rect fill="${e}" x="23" y="8" width="6" height="14"/>
				<path fill="${n}" d="M28,9v12h-4V9H28 M30,7h-8v16h8V7L30,7z"/>
			`;break;case"top":t+=`
				<rect fill="${e}" x="1" y="1" width="6" height="8"/>
				<path fill="${n}" d="M6,2v6H2V2H6 M8,0H0v10h8V0L8,0z"/>
				<rect fill="${e}" x="12" y="1" width="6" height="24"/>
				<path fill="${n}" d="M17,2v22h-4V2H17 M19,0h-8v26h8V0L19,0z"/>
				<rect fill="${e}" x="23" y="1" width="6" height="14"/>
				<path fill="${n}" d="M28,2v12h-4V2H28 M30,0h-8v16h8V0L30,0z"/>
			`;break;case"left":t+=`
				<rect fill="${e}" x="1" y="1" width="8" height="6"/>
				<path fill="${n}" d="M8,2v4H2V2H8 M10,0H0v8h10V0L10,0z"/>
				<rect fill="${e}" x="1" y="12" width="24" height="6"/>
				<path fill="${n}" d="M24,13v4H2v-4H24 M26,11H0v8h26V11L26,11z"/>
				<rect fill="${e}" x="1" y="23" width="14" height="6"/>
				<path fill="${n}" d="M14,24v4H2v-4H14 M16,22H0v8h16V22L16,22z"/>
			`;break;case"center":t+=`
				<rect fill="${e}" x="11" y="1" width="8" height="6"/>
				<path fill="${n}" d="M18,2v4h-6V2H18 M20,0H10v8h10V0L20,0z"/>
				<rect fill="${e}" x="3" y="12" width="24" height="6"/>
				<path fill="${n}" d="M26,13v4H4v-4H26 M28,11H2v8h26V11L28,11z"/>
				<rect fill="${e}" x="8" y="23" width="14" height="6"/>
				<path fill="${n}" d="M21,24v4H9v-4H21 M23,22H7v8h16V22L23,22z"/>
			`;break;case"right":t+=`
				<rect fill="${e}" x="21" y="1" width="8" height="6"/>
				<path fill="${n}" d="M28,2v4h-6V2H28 M30,0H20v8h10V0L30,0z"/>
				<rect fill="${e}" x="5" y="12" width="24" height="6"/>
				<path fill="${n}" d="M28,13v4H6v-4H28 M30,11H4v8h26V11L30,11z"/>
				<rect fill="${e}" x="15" y="23" width="14" height="6"/>
				<path fill="${n}" d="M28,24v4H16v-4H28 M30,22H14v8h16V22L30,22z"/>
			`;break}return $(t)};Q.resetPathPoint=()=>{let r="",t=B.blueOutline,n=B.grayOutline;return r+=`
		<circle display="inline" fill="${n}" cx="20" cy="27" r="3"/>
		<circle display="inline" fill="${n}" cx="27" cy="13" r="3"/>
		<line display="inline" fill="none" stroke="${n}" stroke-miterlimit="10" x1="20" y1="27" x2="13" y2="13"/>
		<line display="inline" fill="none" stroke="${n}" stroke-miterlimit="10" x1="13" y1="13" x2="27" y2="13"/>
	`,r+=`
		<line stroke="${t}" fill="none" stroke-miterlimit="10" x1="4" y1="22" x2="22" y2="4"/>
		<rect fill="#FFFFFF" x="9.5" y="9.5" width="7" height="7"/>
		<path fill="${t}" d="M16,10v6h-6v-6H16 M17,9h-1h-6H9v1v6v1h1h6h1v-1v-6V9L17,9z"/>
		<circle fill="${t}" cx="3" cy="23" r="3"/>
		<circle fill="${t}" cx="23" cy="3" r="3"/>
	`,$(r)};Q.deletePathPoint=()=>{let r="",t=B.blueOutline,n=B.redX;return r+=`
		<line stroke="${t}" fill="none" stroke-miterlimit="10" x1="4" y1="22" x2="22" y2="4"/>
		<rect fill="#FFFFFF" x="9.5" y="9.5" width="7" height="7"/>
		<path fill="${t}" d="M16,10v6h-6v-6H16 M17,9h-1h-6H9v1v6v1h1h6h1v-1v-6V9L17,9z"/>
		<circle fill="${t}" cx="3" cy="23" r="3"/>
		<circle fill="${t}" cx="23" cy="3" r="3"/>
	`,r+=`
		<path fill="${n}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${n}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>';
	`,$(r)};Q.insertPathPoint=()=>{let r="",t=B.blueOutline;return r+=`
		<line stroke="${t}" fill="none" stroke-miterlimit="10" x1="4" y1="22" x2="22" y2="4"/>
		<rect fill="#FFFFFF" x="9.5" y="9.5" width="7" height="7"/>
		<path fill="${t}" d="M16,10v6h-6v-6H16 M17,9h-1h-6H9v1v6v1h1h6h1v-1v-6V9L17,9z"/>
		<circle fill="${t}" cx="3" cy="23" r="3"/>
		<circle fill="${t}" cx="23" cy="3" r="3"/>
	`,r+=`
		<rect x="21" y="15" fill="${t}" width="3" height="15"/>
		<rect x="15" y="21" fill="${t}" width="15" height="3"/>';
	`,$(r)};Q.selectNextPathPoint=()=>{let r="",t=B.blueOutline,n=B.grayOutline;return r+=`
		<rect x="22.5" y="11.5" width="7" height="7" fill="white"/>
		<path d="m29,12v6h-6v-6h6m1-1h-8v8h8v-8h0Z" fill="${t}"/>
		<path d="m19,15s-7-7-7-7v5h-6v4h6v5s7-7,7-7Z" fill="${n}"/>
		<rect y="13" width="3" height="4" fill="${n}"/>
	`,$(r)};Q.selectPreviousPathPoint=()=>{let r="",t=B.blueOutline,n=B.grayOutline;return r+=`
		<rect x=".5" y="11.5" width="7" height="7" fill="white"/>
		<path d="m7,12v6H1v-6h6m1-1H0v8h8v-8h0Z" fill="${t}"/>
		<path d="m11,15s7-7,7-7v5h6v4h-6s0,5,0,5l-7-7Z" fill="${n}"/>
		<rect x="27" y="13" width="3" height="4" fill="${n}"/>
	`,$(r)};Q.default=()=>{let r=`<rect width="30" height="30" fill="${B.greenOutline}"/>`;return $(r)};Q.test=()=>{let r=`
		<path d="M28.05,23.82c-1.65-1.79-9.55-13.02-9.55-17.82V3h1c.28,0,.5-.72,.5-1s-.22-1-.5-1H10.5c-.28,0-.5,.72-.5,1s.22,1,.5,1h1v3c0,4.8-7.9,16.03-9.55,17.82-.58,.55-.95,1.32-.95,2.18,0,1.66,1.34,3,3,3H26c1.66,0,3-1.34,3-3,0-.86-.37-1.63-.95-2.18ZM13.5,6V3h3v3c0,2.76,2.01,6.95,4.25,10.72-3.27,1.69-5.6-.72-7.75-.72-.34,0-1.86-.31-4,1.15,2.34-3.88,4.5-8.28,4.5-11.15Zm3.5,20c-1.66,0-3-1.34-3-3s1.34-3,3-3,3,1.34,3,3-1.34,3-3,3Zm-6-7.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5-.67,1.5-1.5,1.5-1.5-.67-1.5-1.5Z" fill="${B.redX}"/>
		<circle cx="15" cy="14" r="1" fill="${B.redX}"/>
	`;return $(r)};function Pc(){let r=L({className:"panel__card guides-card__view-options",innerHTML:"<h3>View options</h3>"});const t=m().settings.app.guides,n=t.systemShowGuides,e=t.customShowGuides;y(r,[tr(t,"drawGuidesOnTop",On),L({tag:"label",style:"grid-column: 2 / -1;",content:"Draw guides over shapes"})]);const a=tr(t,"systemShowGuides");a.addEventListener("change",()=>{d().navigate()}),y(r,[a,L({tag:"h4",content:"Key metrics guides"})]),n&&y(r,[L(),V("Transparency"),oa(t.systemTransparency,A=>{t.systemTransparency=A,d().editCanvas.redraw()}),L(),V("Show labels"),tr(t,"systemShowLabels",On),mr()]);const i=tr(t,"customShowGuides");i.addEventListener("change",()=>{d().navigate()}),y(r,[i,L({tag:"h4",content:"Custom guides"})]),e&&y(r,[L(),V("Transparency"),oa(t.customTransparency,A=>{t.customTransparency=A,d().editCanvas.redraw()}),L(),V("Show labels"),tr(t,"customShowLabels",On)]);let o=[r];return n&&o.push(bc()),e&&o.push(Uc()),o}function On(){ir(),d().editCanvas.redraw()}function bc(){let r=L({className:"panel__card guides-card__system",innerHTML:"<h3>Key metrics guides</h3>"});const t=m().settings.font,n=d().selectedItem.advanceWidth;return y(r,[xn("ascent","Ascent",t.ascent,E0),xn("capHeight","Cap height",t.capHeight,x0),xn("xHeight","X height",t.xHeight,x0),xn("baseline","Baseline","0",_n),xn("descent","Descent",t.descent,E0),xn("leftSide","Left side","0",_n),xn("rightSide","Right side",n,_n)]),r}function xn(r,t,n="0000",e){const a=d().systemGuides,i=tr(a,r,x=>{const E=d();let l=E.project.settings.app.guides.systemGuides;x?l.includes(r)||l.push(r):l.includes(r)&&(l=l.filter(T=>T!==r)),E.editCanvas.redraw()});i.setAttribute("title","Show / hide guide"),i.setAttribute("style",`accent-color: ${e};`);let o=L({className:"guide-system-angle",innerHTML:nn({name:"command_horizontalBar",color:e})});o.setAttribute("title","Horizontal guideline"),(r==="leftSide"||r==="rightSide")&&(o.innerHTML=nn({name:"command_verticalBar",color:e}),o.setAttribute("title","Vertical guideline"));const A=L({className:"guide-system-value",content:n});return A.setAttribute("title",`Guide line position
These are based on this font's key metrics,
which you can edit on the Font Settings page.`),[i,V(t),o,A]}function Uc(){let r=L({className:"panel__card guides-card__custom",innerHTML:"<h3>Custom guides</h3>"});const t=m().settings.app.guides.custom;t.length&&(t.forEach((e,a)=>{y(r,Yc(e,a))}),r.appendChild(mr()));const n=L({tag:"fancy-button",attributes:{secondary:""},innerHTML:"Add a custom guide"});return n.addEventListener("click",()=>{m().settings.app.guides.custom.push(new Y0({visible:!0,color:jo()})),On()}),r.appendChild(n),r}function Yc(r,t){const n=tr(r,"visible",()=>{d().editCanvas.redraw()});n.setAttribute("style",`accent-color: ${r.color}`),n.setAttribute("title","Show / hide guide");const e=Ft(r,"name","editCanvasView","input"),a=h1({iconName:"delete",title:"Delete guide"});a.setAttribute("class","guide-delete-button"),a.addEventListener("click",()=>{m().settings.app.guides.custom.splice(t,1),On()});const i=L({tag:"input",className:"guide-color-button",title:"Change guide color",attributes:{type:"color",style:`background-color: ${r.color};`,value:o0(r.color)}});i.addEventListener("input",x=>{let E=le(x.target.value),l=`rgb(${E.r},${E.g},${E.b})`;i.setAttribute("value",o0(l)),i.style.backgroundColor=l,n.style.accentColor=l,o.querySelector("g").setAttribute("fill",l);const T=m().settings.app.guides.custom[t];T.color=l,d().editCanvas.redraw()});const o=L({tag:"button",title:"Toggle vertical / horizontal",className:"guide-angle-button",innerHTML:nn({name:"command_verticalBar",color:r.color})});r.angle===90&&(o.innerHTML=nn({name:"command_horizontalBar",color:r.color})),o.addEventListener("click",()=>{const x=m().settings.app.guides.custom[t];x.angle===90?(x.angle=0,x.name=x.name.replace("Horizontal","Vertical")):(x.angle=90,x.name=x.name.replace("Vertical","Horizontal")),On()});const A=Ft(r,"location","editCanvasView","input-number");return A.setAttribute("title","Guide line position"),[n,e,a,i,o,A]}function vc(){const r=d();let t=L({className:"panel__card history-list"}),n=r.history.length,e=L({tag:"button",className:n>0?"button__call-to-action number":"number",innerHTML:`undo ${n}`,style:"max-width: 30%; grid-column: 1 / -1;"});t.appendChild(e),n>0?e.addEventListener("click",()=>{r.history.restoreState()}):(e.setAttribute("disabled",""),t.appendChild(L({tag:"h3",innerHTML:r.project.getItemName(r.selectedItemID,!0)})));let a="initial";return r.history.queue.forEach(i=>{if(i.title!=="_whole_project_change_post_state_"){i.itemID&&i.itemID!==a&&(t.appendChild(L({tag:"h3",innerHTML:r.project.getItemName(i.itemID,!0)})),a=i.itemID);let o=i.title;i.wholeProjectSave&&(o=`<strong>${i.title}</strong>`),t.appendChild(L({className:"history-list__title",innerHTML:o})),t.appendChild(L({className:"history-list__date number",innerHTML:new Date(i.timeStamp).toLocaleTimeString(),title:new Date(i.timeStamp).toLocaleString()}))}}),t.appendChild(L({className:"history-list__title history-list__initial-entry",innerHTML:"Initial state"})),t.appendChild(L({className:"history-list__date number history-list__initial-entry",innerHTML:new Date(r.history.initialTimeStamp).toLocaleTimeString()})),t}function wc(){let r=L({className:"panel__card full-width item-links__rows-area"});const t=d(),n=m();let a=t.selectedItem.shapes;if(F.newBasicPath){let i=F.newBasicPath,o=L();o.setAttribute("class","item-link__row layer-panel__new-path"),o.classList.add("layer-panel__selected"),o.appendChild(L({className:"item-link__thumbnail",innerHTML:n.makeItemThumbnail(i)})),o.appendChild(L({className:"item-link__title",innerHTML:i.name})),r.appendChild(o)}if(a.length>0)for(let i=a.length-1;i>=0;i--){let o=a[i],A=L({attributes:{"target-path-index":i}});o.objType==="ComponentInstance"?A.setAttribute("class","item-link__row layer-panel__component-row"):A.setAttribute("class","item-link__row layer-panel__path-row"),t.multiSelect.shapes.isSelected(o)&&A.classList.add("layer-panel__selected"),t.subscribe({topic:"whichShapeIsSelected",subscriberID:`layersPanel.item-link-row-${i}`,callback:()=>{let l=t.multiSelect.shapes.isSelected(o);A.classList.toggle("layer-panel__selected",l)}}),A.addEventListener("click",()=>{t.multiSelect.shapes.select(o),t.publish("whichShapeIsSelected",o)});const x=L({className:"item-link__thumbnail",attributes:{"target-path-index":i},innerHTML:n.makeItemThumbnail(o)});A.appendChild(x),A.appendChild(L({className:"item-link__title",innerHTML:`${o.name}`}));let E="Path";o.link&&(E=`Component instance&emsp;|&emsp;${n.getItem(o.link).name}`),A.appendChild(L({className:"item-link__subtitle",innerHTML:E})),r.appendChild(A)}else r.appendChild(L({content:'No paths exist yet.  You can create one with the New Path tools on the canvas, or by pressing "add new path" below.'}));return t.subscribe({topic:["currentPath","currentItem"],subscriberID:"layersPanel",callback:()=>{const i=d(),o=m();document.querySelectorAll(".item-link__thumbnail").forEach(x=>{const E=x.getAttribute("target-path-index");x.innerHTML=o.makeItemThumbnail(i.selectedItem.shapes[E])})}}),[r,Wc()]}function Wc(){const r=d();let t=L({className:"panel__card full-width",content:"<h3>Actions</h3>"}),n=L({tag:"div",className:"panel__actions-area"});_t(n,Jt("addShapeActions"));let e=r.multiSelect.shapes.members;return r.selectedItem.shapes.length>1&&e.length===1&&_t(n,Jt("layerActions")),y(t,n),t}function Re(){const r=d();let t=L(),n=r.nav.panel;return r.nav.page==="Components"&&mt(r.project.components)<=0||r.nav.page==="Ligatures"&&mt(r.project.ligatures)<=0||r.nav.page==="Kerning"&&mt(r.project.kerning)<=0||(n==="Attributes"?(r.unsubscribe({idToRemove:"layersPanel"}),r.unsubscribe({idToRemove:"historyPanel"}),r.unsubscribe({idToRemove:"guidesPanel"}),r.unsubscribe({idToRemove:"contextCharactersPanel"}),r.nav.page==="Kerning"?y(t,Mc()):y(t,dc())):n==="Layers"?(r.unsubscribe({idToRemove:"attributesPanel"}),r.unsubscribe({idToRemove:"historyPanel"}),r.unsubscribe({idToRemove:"guidesPanel"}),r.unsubscribe({idToRemove:"contextCharactersPanel"}),y(t,wc())):n==="Context characters"?(r.unsubscribe({idToRemove:"attributesPanel"}),r.unsubscribe({idToRemove:"layersPanel"}),r.unsubscribe({idToRemove:"historyPanel"}),r.unsubscribe({idToRemove:"guidesPanel"}),y(t,Gc())):n==="History"?(r.unsubscribe({idToRemove:"attributesPanel"}),r.unsubscribe({idToRemove:"layersPanel"}),r.unsubscribe({idToRemove:"guidesPanel"}),r.unsubscribe({idToRemove:"contextCharactersPanel"}),y(t,vc())):n==="Guides"&&(r.unsubscribe({idToRemove:"attributesPanel"}),r.unsubscribe({idToRemove:"layersPanel"}),r.unsubscribe({idToRemove:"historyPanel"}),r.unsubscribe({idToRemove:"contextCharactersPanel"}),y(t,Pc()))),t}function ir(){let r=document.querySelector("#editor-page__panel");if(r){let t=Re();r.innerHTML="",r.appendChild(t)}}function kc(){const r=d(),t=r.selectedComponentID,n=`
		<div class="editor-page__tools-area"></div>
		<div class="editor-page__edit-canvas-wrapper"></div>
		<div class="editor-page__zoom-area"></div>
	`,e='<div class="editor-page__edit-canvas-wrapper" style="grid-column: span 2; overflow-y: scroll;"></div>',a=L({tag:"div",id:"app__page",innerHTML:`
		<div class="editor__page">
			<div class="editor-page__left-area">
				<div class="editor-page__nav-area">
					${Pt({level:"l1",superTitle:"PAGE",title:"Components"})}
				</div>
				<div id="editor-page__panel"></div>
			</div>
			${t?n:e}
		</div>
	`});let i=a.querySelector("#nav-button-l1");i.addEventListener("click",function(){bt(i)});const o=a.querySelector(".editor-page__nav-area"),A=a.querySelector(".editor-page__edit-canvas-wrapper");if(!t)return y(A,Kc()),o.style.display="block",i.style.width="100%",i.style.borderRadius="4px",a;const x=r.selectedComponent,E=Pt({level:"l2",superTitle:"EDITING",title:x.name}),l=Pt({level:"l3",superTitle:"PANEL",title:r.nav.panel});o.appendChild(b(E)),o.appendChild(b(l));const T=L({tag:"edit-canvas",id:"editor-page__edit-canvas",attributes:{"editing-item-id":r.selectedComponentID}});A.appendChild(T);let s=a.querySelector("#nav-button-l2");s.addEventListener("click",function(){bt(s)}),r.subscribe({topic:"whichComponentIsSelected",subscriberID:"nav.componentChooserButton",callback:()=>{s.innerHTML=Mn(r.selectedComponent.name,"EDITING")}});let c=a.querySelector("#nav-button-l3");c.addEventListener("click",function(){bt(c)});const I=a.querySelector("#editor-page__panel");I.appendChild(Re()),I.addEventListener("scroll",Br),r.subscribe({topic:["whichComponentIsSelected","whichShapeIsSelected"],subscriberID:"nav.panelChooserButton",callback:()=>{ir()}}),r.selectedTool==="kern"&&(r.selectedTool="resize");let h=a.querySelector(".editor-page__tools-area");h.innerHTML="";let S=Li();S&&y(h,S);let p=a.querySelector(".editor-page__zoom-area");p.innerHTML="";let u=Ba();return u&&y(p,u),r.subscribe({topic:"whichComponentIsSelected",subscriberID:"editCanvas.selectedComponent",callback:D=>{hn(),a.querySelector("#editor-page__edit-canvas").setAttribute("editing-item-id",D)}}),r.subscribe({topic:"whichShapeIsSelected",subscriberID:"editCanvas.selectedPath",callback:()=>{hn(),r.editCanvas.redraw({calledBy:"Edit canvas subscription to selectedPath"})}}),r.subscribe({topic:"whichPathPointIsSelected",subscriberID:"editCanvas.selectedPathPoint",callback:()=>{r.editCanvas.redraw({calledBy:"Edit canvas subscription to selectedPathPoint"})}}),r.subscribe({topic:"currentItem",subscriberID:"ComponentsPage.l2Nav",callback:()=>{s.innerHTML=Mn(r.selectedComponent.name,"EDITING")}}),a}function Kc(){let r="";[{root:"A",instances:"&#xC0;&#xC1;&#xC2;&#xC3;&#xC4;&#xC5;&#x100;&#x102;&#x104;&#x1DE;&#x1FA;&#x200;&#x226;&#x23A;&#x1E00;&#x24B6;&#x2C6F;"},{root:"N",instances:"&#xD1;&#x143;&#x145;&#x147;&#x19D;&#x1F8;&#x1E44;&#x1E46;&#x1E48;&#x1E4A;&#x24C3;&#xA790;&#xA7A4;"}].forEach(e=>{r+=`
			<span class="first-run__example-wrapper">
					<pre>${e.root}</pre>
					<span> ➞ </span>
					<pre>${e.instances}</pre>
			</span>
		`});const t=L({className:"editor-page__first-run",innerHTML:`
			<h1>There are no components in your project</h1>
			<p>
				Components are a Glyphr Studio feature that lets you re-use a collection of paths
				across many different glyphs. The root is called a 'Component' and these are added
				by reference to other glyphs, where they are called 'Component Instances'.
				Updating the root component will also update all component instances.
			</p>
			<p>
				<div class="first-run__examples-table">
					${r}
				</div>
				Diacritic glyphs (glyphs with accents) are just one example of where having a shared
				component root can be used across many individual characters.
			</p>
		`}),n=L({tag:"fancy-button",innerHTML:"Create a new component",onClick:S1});return t.appendChild(n),t}function d1(r){return m().addItemByType(new ot(r),"Component")}function Vc(){const r=m();let t=mt(r.components);for(;r.components[`comp-${t}`];)t++;return`comp-${t}`}function S1(){const r=L({innerHTML:`
			<h2>Add a new component</h2>
				Specify a name to create a new component:
				<br><br>
				<input id="components__new-component-input" type="text"
					autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
				/>
				<br><br>
				<fancy-button disabled id="components__add-new-component-button">Add new component to project</fancy-button>
		`}),t=r.querySelector("#components__add-new-component-button"),n=r.querySelector("#components__new-component-input");n.addEventListener("keyup",()=>{n.value.length<1?t.setAttribute("disabled",""):t.removeAttribute("disabled")}),t.addEventListener("click",()=>{const e=d1(new ot({name:n.value}));if(typeof e=="string")rr(e);else{const a=d();a.selectedComponentID=e.id,a.navigate(),nt()}}),Ar(r,500)}class ae{constructor({begin:t=0,end:n=0,name:e=""}){this.begin=t,this.end=n,this.name=e,this.cachedArray=!1}get begin(){return this._begin||0}set begin(t){this._begin=parseInt(t)}get end(){return this._end||0}set end(t){this._end=parseInt(t)}*generator(t=!1){if(this.begin<=33&&(this.end===126||this.end===127)){let n=0;for(;n<co.length;)yield co[n],n++}else{let n=this.begin;if(t)for(;n<=this.end;)yield Lt(n++);else{for(;_o(n);)n++;for(;n<=this.end;)yield Lt(n++)}}}get isValid(){let t=this.begin!==0,n=this.end!==0,e=this.name!=="";return t&&n&&e}save(){return{name:this.name,begin:this.beginHex,end:this.endHex}}get beginHex(){return Lt(this.begin)}get endHex(){return Lt(this.end)}get note(){return`["${this.beginHex}", "${this.endHex}"]`}get id(){return`${this.name} ${this.note}`}getMembers(t=!1){if(this.cachedArray)return this.cachedArray;const n=[];for(const e of this.generator(t))n.push(e);return this.cachedArray=n,n}}const co=["0x41","0x42","0x43","0x44","0x45","0x46","0x47","0x48","0x49","0x4A","0x4B","0x4C","0x4D","0x4E","0x4F","0x50","0x51","0x52","0x53","0x54","0x55","0x56","0x57","0x58","0x59","0x5A","0x61","0x62","0x63","0x64","0x65","0x66","0x67","0x68","0x69","0x6A","0x6B","0x6C","0x6D","0x6E","0x6F","0x70","0x71","0x72","0x73","0x74","0x75","0x76","0x77","0x78","0x79","0x7A","0x30","0x31","0x32","0x33","0x34","0x35","0x36","0x37","0x38","0x39","0x21","0x22","0x23","0x24","0x25","0x26","0x27","0x28","0x29","0x2A","0x2B","0x2C","0x2D","0x2E","0x2F","0x3A","0x3B","0x3C","0x3D","0x3E","0x3F","0x40","0x5B","0x5C","0x5D","0x5E","0x5F","0x60","0x7B","0x7C","0x7D","0x7E","0x20"];class tn{constructor(t={}){var o,A,x,E,l,T;this.settings={project:{name:"My Font",latestVersion:!1,initialVersion:!1,id:!1,characterRanges:[]},app:{savePreferences:!1,stopPageNavigation:!0,autoSave:!0,showNonCharPoints:!1,itemChooserPageSize:256,formatSaveFile:!1,moveShapesOnSVGDragDrop:!1,guides:{drawGuidesOnTop:!1,systemShowGuides:!0,systemShowLabels:!1,systemTransparency:70,systemGuides:["baseline","leftSide","rightSide"],customShowGuides:!0,customShowLabels:!1,customTransparency:70,custom:[]},contextCharacters:{showCharacters:!1,characterTransparency:20,showGuides:!0,guidesTransparency:70},saveLivePreviews:!0,livePreviews:[],previewText:!1},font:{family:"My Font",style:"Regular",version:"1.0",description:"",panose:"0 0 0 0 0 0 0 0 0 0",upm:2048,ascent:1550,descent:-440,capHeight:1480,xHeight:1100,overshoot:30,lineGap:58,italicAngle:0,designer:"",designerURL:"",manufacturer:"",manufacturerURL:"",license:"",licenseURL:"",copyright:"",trademark:"",variant:"normal",weight:400,stretch:"normal",stemv:0,stemh:0,slope:0,underlinePosition:-50,underlineThickness:10,strikethroughPosition:300,strikethroughThickness:10,overlinePosition:750,overlineThickness:10}},this.glyphs={},this.ligatures={},this.kerning={},this.components={},t.settings&&(this.settings=C1(this.settings,t.settings));const n=Tt();this.settings.project.latestVersion=n.version,this.settings.project.initialVersion=n.version,this.settings.project.id=this.settings.project.id||_c();const e=(A=(o=t==null?void 0:t.settings)==null?void 0:o.app)==null?void 0:A.guides;e!=null&&e.systemGuides&&(this.settings.app.guides.systemGuides=Zt(e.systemGuides)),e!=null&&e.custom&&(this.settings.app.guides.custom=[],e.custom.forEach(s=>this.settings.app.guides.custom.push(new Y0(s))));let a=(E=(x=t==null?void 0:t.settings)==null?void 0:x.project)==null?void 0:E.characterRanges;a&&(this.settings.project.characterRanges=[],a.forEach(s=>{this.settings.project.characterRanges.push(new ae(s))})),this.settings.font.descent=-1*Math.abs(this.settings.font.descent);const i=(T=(l=t==null?void 0:t.settings)==null?void 0:l.app)==null?void 0:T.livePreviews;i&&(this.settings.app.livePreviews=[],this.settings.app.livePreviews=i.map(s=>new Hr(s))),this.hydrateProjectItems(ot,t.components,"Component"),this.hydrateProjectItems(ot,t.glyphs,"Glyph"),this.hydrateProjectItems(ot,t.ligatures,"Ligature"),this.hydrateProjectItems(Wr,t.kerning,"KernGroup")}save(t=!1){const n={settings:Zt(this.settings),glyphs:{},ligatures:{},components:{},kerning:{}};n.settings.project.characterRanges=[],this.settings.project.characterRanges.forEach(a=>{n.settings.project.characterRanges.push(a.save())}),n.settings.app.livePreviews=[],this.settings.app.livePreviews.forEach(a=>{n.settings.app.livePreviews.push(a.save())}),n.settings.app.guides.custom=[],this.settings.app.guides.custom.forEach(a=>{n.settings.app.guides.custom.push(a.save())});function e(a,i){for(const o of Object.keys(a))a[o].save&&(n[i][o]=a[o].save(t))}return e(this.glyphs,"glyphs"),e(this.ligatures,"ligatures"),e(this.components,"components"),e(this.kerning,"kerning"),n}getItem(t,n=!1){if(!t)return!1;t=""+t;let e;return this.ligatures&&t.startsWith("liga-")?(e=this.ligatures[t]||!1,!e&&n&&(this.addItemByType(new ot({id:t}),"Ligature",t),e=this.ligatures[t])):this.glyphs&&t.startsWith("glyph-")?(t=`glyph-${zt(t.substring(6))}`,e=this.glyphs[t]||!1,!e&&n&&(this.addItemByType(new ot({id:t}),"Glyph",t),e=this.glyphs[t])):this.components&&t.startsWith("comp-")?(e=this.components[t]||!1,!e&&n&&(this.addItemByType(new ot({id:t}),"Component",t),e=this.components[t])):this.kerning&&t.startsWith("kern-")&&(e=this.kerning[t]||!1),e}getItemID(t){if(t.length===1)return`glyph-${jn(t)[0]}`;for(let n of Object.keys(this.ligatures))if(this.ligatures[n].gsub===t)return n;return!1}addItemByType(t,n,e=!1){let a;return n==="Glyph"&&(a=this.glyphs),n==="Ligature"&&(a=this.ligatures,e||(e=ge(t.chars))),n==="Component"&&(a=this.components,e||(e=Vc())),n==="KernGroup"&&(a=this.kerning,e||(e=oi(this.kerning))),t.id=e,t.objType=n,t.parent=this,a[e]=t,a[e]}getItemName(t,n=!1){if(t=""+t,!t)return!1;if(t.startsWith("glyph-")){let i;if(n?i=bn(yr(t,"glyph-")):i=zo(yr(t,"glyph-")),i)return i}return this.getItem(t).name||"[name not found]"}makeItemThumbnail(t){var T;const a=40/this.totalVertical,i=this.totalVertical,A=(50-((t==null?void 0:t.advanceWidth)||((T=t==null?void 0:t.parent)==null?void 0:T.advanceWidth)||this.defaultAdvanceWidth)*a)/2,x=i*a-5,E=(t==null?void 0:t.svgPathData)||"H100 V100 H-100 V-100";return`
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50px" height="50px">
			<path
				transform="translate(${A},${x}) scale(${a}, -${a})"
				d="${E}"
			/>
		</svg>`}get totalVertical(){let t=Math.abs(parseInt(this.settings.font.descent)),n=parseInt(this.settings.font.ascent);return t+n}get defaultAdvanceWidth(){return parseInt(this.settings.font.upm)/2}get sortedLigatures(){let t=[];return Object.keys(this.ligatures).forEach(n=>{t.push(this.ligatures[n])}),t.sort(p1),t}get sortedComponents(){let t=[];return Object.keys(this.components).forEach(n=>{t.push(this.components[n])}),t.sort((n,e)=>n.name-e.name),t}get sortedKernGroups(){let t=[];return Object.keys(this.kerning).forEach(n=>{this.kerning[n].suffix=parseInt(n.substring(5)),t.push(this.kerning[n])}),t.sort((n,e)=>n.suffix-e.suffix),t}forEachItem(t){let n=[],e;for(const a of Object.keys(this.glyphs))e=t(this.glyphs[a]),n=n.concat(e);for(const a of Object.keys(this.components))e=t(this.components[a]),n=n.concat(e);for(const a of Object.keys(this.ligatures))e=t(this.ligatures[a]),n=n.concat(e);return n}hydrateProjectItems(t,n,e){n=n||{};for(const a of Object.keys(n)){let i=Jc(a,e);n[a]&&this.addItemByType(new t(n[a]),e,i)}}}function p1(r,t){return r.chars.length===t.chars.length?r.chars.localeCompare(t.chars):t.chars.length-r.chars.length}function Jc(r,t){if(t==="Glyph"){let n=yr(r,"glyph-");if(n=zt(n),n)return`glyph-${n}`}return r}function C1(r={},t={},n=!1){for(const e of Object.keys(r))typeof r[e]=="object"?t[e]&&(r[e]=C1(r[e],t[e])):t[e]&&(typeof t[e]=="string"&&n?r[e]=P0(t[e]):r[e]=t[e]);return r}function _c(){const r="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";let t="g2_";for(let n=0;n<10;n++)t+=r.charAt(Math.floor(R(Math.random()*r.length)));return t}const u1=[],Ai={};async function R1(){const r=Zc(),t=zc();let n;for(let a=0;a<t.glyphs.length;a++)n=await Xc(t.glyphs[a]),r.glyphs.push(n);for(let a=0;a<t.ligatures.length;a++)n=await jc(t.ligatures[a]),r.glyphs.push(n);U("Finalizing..."),r.glyphs.sort(function(a,i){return a.unicode-i.unicode});const e=new an.Font(r);u1.forEach(a=>{e.substitution.addLigature("liga",a)}),e.download(),await Hn(),U("Export complete!"),await Hn(1e3),px()}function Zc(){const r={},t=m(),n=t.settings.font;if(r.unitsPerEm=n.upm||1e3,r.ascender=n.ascent||1e-5,r.descender=-1*Math.abs(n.descent)||-1e-5,r.familyName=n.family||" ",r.styleName=n.style||" ",r.designer=n.designer||" ",r.designerURL=n.designerURL||" ",r.manufacturer=n.manufacturer||" ",r.manufacturerURL=n.manufacturerURL||" ",r.license=n.license||" ",r.licenseURL=n.licenseURL||" ",r.version=n.version||"Version 0.001",r.description=n.description||" ",r.copyright=n.copyright||" ",r.trademark=n.trademark||" ",r.weightClass=parseInt(n.weight),r.panose=n.panose.split(" ").map(Number)||[],r.italicAngle=n.italicAngle||0,r.slope=n.slope||0,r.glyphs=[],!t.glyphs["glyph-0x0"]){const e=Qc(),a=xi(e,new an.Path);r.glyphs.push(new an.Glyph({name:".null",unicode:0,index:0,advanceWidth:R(e.advanceWidth),xMin:R(e.maxes.xMin),xMax:R(e.maxes.xMax),yMin:R(e.maxes.yMin),yMax:R(e.maxes.yMax),path:a}))}return Ai["0x0"]=0,r}function zc(){const r=[],t=m();let n;for(const a of Object.keys(t.glyphs)){let i=parseInt(a.substring(6));typeof i=="number"?(n=t.glyphs[a],r.push({xg:n,xc:i})):console.warn("Skipped exporting Glyph "+i+" - non-numeric key value.")}r.sort(function(a,i){return a.xc-i.xc});const e=[];for(const a of Object.keys(t.ligatures))t.ligatures[a].gsub.length>1?(n=t.ligatures[a],e.push({xg:n,xc:a,chars:n.chars})):console.warn(`
					Skipped exporting ligature ${t.ligatures[a].name}.
					Source chars length: ${t.ligatures[a].gsub.length}
				`);return e.sort(p1),{glyphs:r,ligatures:e}}async function Xc(r){const t=r.xg,n=r.xc,e=t.maxes;U("Exporting<br>"+t.name,999999);const a=xi(t,new an.Path),i=g1();let o=t.advanceWidth;o===0&&(o=1e-6);const A=new an.Glyph({name:zo(Lt(n)),unicode:parseInt(n),index:i,advanceWidth:o,xMin:R(e.xMin),xMax:R(e.xMax),yMin:R(e.yMin),yMax:R(e.yMax),path:a});return Ai[zr(t.chars)]=i,await Hn(),A}async function jc(r){const t=r.xg,n=t.maxes;U("Exporting<br>"+t.name,999999);const e=xi(t,new an.Path),a=g1(),i={name:t.name.replace("Ligature ","liga-"),index:a,advanceWidth:R(t.advanceWidth||1),path:e,xMin:R(n.xMin),xMax:R(n.xMax),yMin:R(n.yMin),yMax:R(n.yMax)},o=t.gsub.map(A=>Ai[Lt(A)]);return u1.push({sub:o,by:a}),await Hn(),new an.Glyph(i)}let Io=0;function g1(){return Io+=1,Io}function Qc(){const r=m();let t=r.getItem("glyph-0x0");if(t)return t;const n=r.settings.font.capHeight,e=[{name:"Outer Phi Rectangle",pathPoints:[{p:{coord:{x:0,y:700}}},{p:{coord:{x:432,y:700}}},{p:{coord:{x:432,y:0}}},{p:{coord:{x:0,y:0}}}],winding:-4},{name:"Inner Phi Rectangle",pathPoints:[{p:{coord:{x:50,y:50}}},{p:{coord:{x:382,y:50}}},{p:{coord:{x:382,y:650}}},{p:{coord:{x:50,y:650}}}],winding:4}];if(t=new ot({name:"notdef",advanceWidth:432,shapes:e}),n!==700){let a=n-700;t.updateGlyphSize({height:a,ratioLock:!0}),t.advanceWidth=t.maxes.xMax}return t}function xi(r,t){return Sn(r).shapes.forEach(e=>{e.objType==="Path"&&(t=qc(e,t))}),t}function qc(r,t){return r.pathPoints?(r.reverseWinding(),t.moveTo(R(r.pathPoints[0].p.x),R(r.pathPoints[0].p.y)),r.pathPoints.forEach(n=>{const e=r.pathPoints[r.getNextPointNum(n.pointNumber)];t.curveTo(R(n.h2.x),R(n.h2.y),R(e.h1.x),R(e.h1.y),R(e.p.x),R(e.p.y))}),t.close(),r.reverseWinding(),t):(r.pathPoints.length,t.close(),t)}async function Ei(r,t,n=!1){let e=d().loadedFileHandle;e&&r==="gs2"?(n&&(e=!1),await tI(r,t,e)):$c(r,t)}function $c(r,t){const n="text/plain;charset=utf-8",e=new Blob([t],{type:n,endings:"native"});let a=Aa(r,!0);try{window.navigator.msSaveBlob(e,a)}catch{const o=document.createElement("a");window.URL=window.URL||window.webkitURL,o.href=window.URL.createObjectURL(e),o.download=a;const A=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0});o.dispatchEvent(A)}}async function tI(r,t,n=!1){const a={suggestedName:Aa(r),types:[{description:"Glyphr Studio Project file",accept:{"application/json":[".gs2"]}}]};n||(n=await window.showSaveFilePicker(a));const i=await n.createWritable();await i.write(t),await i.close();const o=d();o.loadedFileHandle=n}function Aa(r,t=!1){let e=m().settings.project.name;return r==="gs2"?(e+=" - Glyphr Studio Project",t&&(e+=` - ${R0()}`)):r==="svg"&&(e+=` - SVG Font - ${R0()}`),e+=`.${r}`,e}function R0(){const r=new Date,t=r.getFullYear(),n=r.getMonth()+1,e=r.getDate(),a=r.getHours(),i=(r.getMinutes()<10?"0":"")+r.getMinutes(),o=(r.getSeconds()<10?"0":"")+r.getSeconds();return`${t}.${n}.${e}-${a}.${i}.${o}`}function y1(){const r=m(),t=Tt(),n=r.settings.font,e=n.family,a=e.replace(/ /g,"_");let o=R0().split("-");o[0]=o[0].replace(/\./g,"-"),o[1]=o[1].replace(/\./g,":"),o=o.join(" at ");let A=`<?xml version="1.0"?>
<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<metadata>
		Project: ${r.settings.project.name}
		Font exported on ${o}
		Created with Glyphr Studio - the free, web-based font editor
		Version: ${t.version}
		Find out more at www.glyphrstudio.com
	</metadata>
	<defs>
		<font id="${a}" horiz-adv-x="${n.upm}">
			<font-face ${rI()}
			>
				<font-face-src>
					<font-face-name name="${e}" />
				</font-face-src>
			</font-face>
${eI()}
${aI()}
${iI()}
		</font>
	</defs>

	<text x="100" y="150" style="font-size:48px;" font-family="${e}">
		${e}
	</text>
</svg>
`;Ei("svg",A),U("Exported SVG Font File")}function rI(){const t=m().settings.font,n=nI(),e="		";let a="";return a+=`
		${e}font-family="${t.family}"
		${e}font-style="${t.style}"
		${e}panose-1="${t.panose}"
		${e}units-per-em="${t.upm}"
		${e}ascent="${t.ascent}"
		${e}cap-height="${t.capHeight}"
		${e}x-height="${t.xHeight}"
		${e}descent="${t.descent}"
		${e}bbox="${n.maxes.xMin}, ${n.maxes.yMin}, ${n.maxes.xMax}, ${n.maxes.yMax}"
		${e}unicode-range="U+20-${n.maxGlyph}"
		${e}font-variant="${t.variant}"
		${e}font-weight="${t.weight}"
		${e}font-stretch="${t.stretch}"
		${e}stemv="${t.stemv}"
		${e}stemh="${t.stemh}"
		${e}slope="${t.slope}"
		${e}underline-position="${t.underlinePosition}"
		${e}underline-thickness="${t.underlineThickness}"
		${e}strikethrough-position="${t.strikethroughPosition}"
		${e}strikethrough-thickness="${t.strikethroughThickness}"
		${e}overline-position="${t.overlinePosition}"
		${e}overline-thickness="${t.overlineThickness}"
	`,a}function nI(){const r=m(),t={maxGlyph:32,maxes:new Qt};let n;r.settings.project.characterRanges.forEach(a=>{for(let i=a.begin;i<a.end;i++)n=r.getItem(`glyph-${Lt(i)}`),n&&(t.maxes=qn([t.maxes,n.maxes]));t.maxGlyph=Math.max(t.maxGlyph,a.end)});for(const a of Object.keys(r.ligatures))t.maxes=qn([t.maxes,r.ligatures[a]]);return t}function eI(){const r=m();let t=r.getItem("glyph-0x0");if(t)return g0(t,"glyph-0x0");const n=r.settings.font.ascent,e=R(n*.618),a=R(n/100);let i=`			<missing-glyph horiz-adv-x="${e}" `;return i+=`d="M0,0 v${n} h${e} v-${n} h-${e}z `,i+=`M${a},${a} v${n-a*2} h${e-a*2} `,i+=`v - ${n-a*2} h - ${e-a*2} z"/>
`,i}function aI(){const r=m().glyphs;let t="";const n=m().ligatures;t+=`			<!-- Ligatures -->
`;for(const e of Object.keys(n))t+=g0(n[e],e);t+=`			<!-- Glyphs -->
`;for(const e of Object.keys(r))t+=g0(r[e],e);return t}function g0(r,t){if(!r.shapes.length&&!Xo(t.substring(6)))return console.warn("Glyph "+t+" not exported: No paths."),"";let n=r.svgPathData;n=n||"M0,0Z";let e="			";return e+=`<glyph glyph-name="${r.name.replace(/ /g,"_")}" `,e+=`unicode="${Uo(r.chars)}" `,e+=`horiz-adv-x="${r.advanceWidth}" `,e+=`d="${n}" />
`,e}function iI(){const r=m().kerning;let t=Object.keys(r);if(!t.length)return"";let n=`			<!-- Kern Pairs -->
`;for(const e of t)for(let a=0;a<r[e].leftGroup.length;a++)for(let i=0;i<r[e].rightGroup.length;i++)n+="			<hkern ",n+=`u1="${di(r[e].leftGroup[a])}" `,n+=`u2="${di(r[e].rightGroup[i])}" `,n+=`k="${r[e].value}" />
`;return n}const N1=`<?xml version="1.0" encoding="utf-8"?>\r
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"\r
	y="0px" viewBox="0 0 2661 1650" style="enable-background:new 0 0 2651 1640;" xml:space="preserve">\r
	<defs>\r
		<linearGradient id="logoGradient">\r
			<stop offset="0%" stop-color="var(--blue-l60)" />\r
			<stop offset="100%" stop-color="var(--purple-l50)" />\r
		</linearGradient>\r
	</defs>\r
	<path d="M500.77,240.66h-3.93h-6.56h-60.13c-11.89,0-23.1,5.6-30.23,15.12l-11.9,15.87C347.22,239.3,295.84,220,240.08,220\r
	C107.7,220,0,328.81,0,462.55c0,51.6,16.03,95.8,46.72,129.81C23.29,616.68,10,648.4,10,673.49c0,53.63,30,135.61,148.95,135.61\r
	c102.35,0,161.84-29.12,219.64-29.12c15.42,0,11.82,7.56,11.88,18.39c-0.22,99.86-45.09,107.16-191.5,107.16\r
	c-26.68,0-82.11-4.52-102.01-8.27c-3.22-0.61-6.34,1.39-7.19,4.55L70.2,973.47c-0.94,3.47,1.19,7.03,4.7,7.79\r
	c32.9,7.11,92.96,8.73,124.05,8.73c248.97,0,274.54-98.88,274.54-210.02c0-39.22-4.45-93.37-80.03-93.37\r
	c-63.89,0-132.38,36.12-216.85,36.12C108,722.73,88,704,88,672c0-13.64,6.61-26.44,16.25-36.35c37.7,19.01,83.97,28.94,135.83,28.94\r
	c66.22,0,123.32-16.19,165.12-46.8c49.04-35.93,74.96-89.61,74.96-155.24c0-49.59-14.82-95.75-40.2-134.21l9.08-12.11h47.79v-0.02\r
	h3.93c2.76,0,5-2.24,5-5v-65.57C505.77,242.9,503.53,240.66,500.77,240.66z M240.08,592.8c-45.87,0-152.56-12.58-152.56-129.07\r
	c0-94.8,68.44-171.93,152.56-171.93s152.56,77.12,152.56,171.93C392.64,580.22,285.95,592.8,240.08,592.8z" />\r
	<path d="M1131,241h-74h-2h-2c-2.76,0-5,2.24-5,5v74c0,2.76,2.24,5,5,5h2h2h32v294.5c-25.36,51.94-93.81,70.5-145,70.5\r
	c-19.59,0-149-6.19-149-126V283c0-23.2-18.8-42-42-42h-74h-2h-2c-2.76,0-5,2.24-5,5v74c0,2.76,2.24,5,5,5h2h2h37v239\r
	c0,110.81,68.5,206,228,206c58.34,0,105.27-13.01,141.09-35.38c0,23.82,0,47.13,0,51.92c0,89.46-46.98,116.23-194.07,116.23\r
	c-27.54,0-77.92-2.77-100.32-6.01c-6.57-0.95-10.59-0.76-12.75,8.05l-0.01,0.04l-0.01,0.04l-17.08,62.78\r
	c-1.74,7.34-0.82,11.67,8.36,13.73C803.11,989,877.33,990,891.02,990c250.21,0,278.58-120.83,281.63-200h0.35V283\r
	C1173,259.8,1154.2,241,1131,241z" />\r
	<path\r
		d="M671,675h-2v0h-39V43c0-23.2-18.8-42-42-42h-79h-2h-2c-2.76,0-5,2.24-5,5v74c0,2.76,2.24,5,5,5h2h2h37v590h-39v0h-2\r
	c-2.76,0-5,2.24-5,5v74c0,2.76,2.24,5,5,5h4c0,0,0,0,0,0H667c0,0,0,0,0,0h4c2.76,0,5-2.24,5-5v-74C676,677.24,673.76,675,671,675z" />\r
	<path d="M2647,250l-2.59-0.83l-0.03,0.01C2612.9,236.87,2575.85,230,2533.5,230c-71.87,0-121.1,25.18-153.5,60.35V283\r
	c0-23.2-18.8-42-42-42h-79h-2h-2c-2.76,0-5,2.24-5,5v74c0,2.76,2.24,5,5,5h2h2h37v240v111h-27v0h-2c-2.76,0-5,2.24-5,5v74\r
	c0,2.76,2.24,5,5,5h4c0,0,0,0,0,0H2417c0,0,0,0,0,0h4c2.76,0,5-2.24,5-5v-74c0-2.76-2.24-5-5-5h-2v0h-39V565V404.42\r
	c22.85-59.07,86.11-84.7,153.5-84.7c8.65,0,39.65,0.05,71.5,10.28c7,2,10,3,14-4l30-65C2652,255,2651,252,2647,250z" />\r
	<path d="M2238,676h-2v0h-26.25V436c0.08,0,0.17,0,0.25,0c0-114.81-73.5-206-228-206c-52.27,0-92.52,12.37-123,32.91V42\r
	c0-23.2-18.8-42-42-42h-79h-2h-2c-2.76,0-5,2.24-5,5v74c0,2.76,2.24,5,5,5h2h2h37v592h-39v0h-2c-2.76,0-5,2.24-5,5v74\r
	c0,2.76,2.24,5,5,5h4c0,0,0,0,0,0H1884c0,0,0,0,0,0h4c2.76,0,5-2.24,5-5v-74c0-2.76-2.24-5-5-5h-2v0h-27V356.6\r
	c36.17-42.63,95.53-52.6,123-52.6c19.59,0,143,9.19,143,132h-0.25v240H2086v0h-2c-2.76,0-5,2.24-5,5v74c0,2.76,2.24,5,5,5h4\r
	c0,0,0,0,0,0H2234c0,0,0,0,0,0h4c2.76,0,5-2.24,5-5v-74C2243,678.24,2240.76,676,2238,676z" />\r
	<path\r
		d="M1721.99,460c-0.48-133.51-104.79-230-230.49-230c-59.98,0-114.17,25.6-154.5,66.12V282c0-23.2-18.8-42-42-42h-79h-2h-2\r
	c-2.76,0-5,2.24-5,5v74c0,2.76,2.24,5,5,5h2h2h37v383v161v32h-37h-2h-2c-2.76,0-5,2.24-5,5v74c0,2.76,2.24,5,5,5h2h2h79\r
	c23.2,0,42-18.8,42-42v-74V710.14c31.83,36.2,80.71,59.86,153,59.86c154.5,0,232-91.19,232-206V460H1721.99z M1638,558\r
	c0,122.81-111,134-148,134c-55,0-151-24.19-151-144v-90.89c0-90.09,72.44-153.88,152.5-153.88S1638,369.94,1638,466.61V558z" />\r
	<path d="M2573.61,1327.19c-0.53-125.82-98.88-228.33-223.74-228.33c-0.18,0-0.36,0.02-0.55,0.03c-0.18-0.01-0.36-0.03-0.55-0.03\r
	c-125.2,0-223.75,103.06-223.75,229.35h0.14v101.93h0c0.4,109.7,65.74,208.86,223.74,208.86c0.17,0,0.34-0.01,0.51-0.01\r
	c0.17,0.01,0.34,0.01,0.51,0.01c158,0,223.34-99.15,223.74-208.86h0v-102.95H2573.61z M2349.93,1556.4c-0.17,0-0.34,0.01-0.51,0.02\r
	c-0.17-0.01-0.34-0.02-0.51-0.02c-54.65,0-140.16-8.22-140.16-127.27v-101.93h-0.12c0.46-89.01,60.9-155.57,140.15-155.57\r
	c0.18,0,0.36-0.02,0.55-0.03c0.18,0.01,0.36,0.03,0.55,0.03c79.55,0,140.16,67.07,140.16,156.59h0.06v100.92\r
	C2490.09,1548.17,2404.58,1556.4,2349.93,1556.4z" />\r
	<path d="M2078.54,1544.64l-36.55,0v-393.85c0-23.2-18.81-42-42-42h-85.46c-1.41,0-2.55,1.14-2.55,2.55v78.91\r
	c0,1.41,1.14,2.55,2.55,2.55h43.46v351.85l-38.36,0c-1.41,0-2.55,1.14-2.55,2.55v78.91c0,1.41,1.14,2.55,2.55,2.55h158.92\r
	c1.41,0,2.55-1.14,2.55-2.55v-78.91C2081.09,1545.79,2079.95,1544.64,2078.54,1544.64z" />\r
	<path d="M1938.43,1023.83c10.2,7.48,24.14,11.43,40.31,11.43s30.11-3.95,40.31-11.43c11.97-8.77,18.3-21.88,18.3-37.9\r
	c0-32.65-26.29-59.22-58.61-59.22c-32.32,0-58.61,26.56-58.61,59.22C1920.13,1001.95,1926.46,1015.06,1938.43,1023.83z" />\r
	<path d="M758.32,1108.73l-93.19,0V924.51c0-2.41-1.95-4.36-4.36-4.36h-75.44c-2.41,0-4.36,1.95-4.36,4.36v184.22l-55.04,0\r
	c-1.41,0-2.55,1.14-2.55,2.55v79.06c0,1.41,1.14,2.55,2.55,2.55l55.04,0v389.27c0,25.65,20.79,46.44,46.44,46.44h92.82\r
	c0.1,0,0.2-0.01,0.31-0.02c0.19,0.05,0.39,0.08,0.6,0.08h8.93c1.41,0,2.55-1.14,2.55-2.55v-79.06c0-1.41-1.14-2.55-2.55-2.55h-8.93\r
	c-0.04,0-0.08,0.01-0.12,0.01c-0.26-0.05-0.52-0.08-0.79-0.08h-50.74c-2.41,0-4.36-1.95-4.36-4.36v-347.19l93.19,0\r
	c1.41,0,2.55-1.14,2.55-2.55v-79.06C760.86,1109.87,759.72,1108.73,758.32,1108.73z" />\r
	<path d="M406.88,1329.37c-63.01,0-110.27,20.43-193.58,20.43c-67.68,0-77.11-18.57-77.11-50.13c0-25.32-6.99-118.97,183.68-118.97\r
	c58.91,0,107.84,22.84,125.84,26.91c6.47,1.47,10.6,0.76,12.75-8.05l0.01-0.04l0.01-0.04l17.09-62.8\r
	c1.74-7.34,0.42-10.35-8.37-13.73c-17.07-6.58-84.34-24.41-147.33-24.41C62.33,1098.55,55,1289.15,55,1316.74\r
	c0,52.1,29.61,113.05,135.87,113.05c100.95,0,149.42-13.43,206.42-13.43c15.21,0,11.65,7.45,11.72,18.14\r
	c-0.22,98.49-53,120.98-183.77,120.98c-26.31,0-121.75-4.45-141.38-8.15c-3.18-0.6-6.25,1.37-7.09,4.49l-19.29,70.68\r
	c-0.92,3.43,1.17,6.94,4.64,7.69c32.45,7.02,132.46,8.61,163.12,8.61c224.04,0,260.57-107.71,260.57-217.33\r
	C485.81,1382.78,481.43,1329.37,406.88,1329.37z" />\r
	<path d="M1812.64,952.47h43.16c1.41,0,2.55-1.14,2.55-2.55v-78.37c0-1.41-1.14-2.55-2.55-2.55h-84.89\r
	c-23.05,0-41.73,18.68-41.73,41.73l-0.16,251.69c-40.11-39.23-93.43-63.89-152.31-63.89c-125.76,0-230.12,96.53-230.6,230.11h-0.01\r
	v104.05c0,114.86,77.54,206.1,232.11,206.1c70.76,0,119.09-22.66,150.98-57.55v5.63c0,23.05,18.68,41.73,41.73,41.73h84.89\r
	c1.41,0,2.55-1.14,2.55-2.55v-78.37c0-1.41-1.14-2.55-2.55-2.55h-43.16V952.47z M1578.2,1560.75c-37.02,0-148.07-11.2-148.07-134.06\r
	v-91.43c0-96.71,66.47-163.46,146.57-163.46c78.5,0,149.67,61.3,152.48,148.6v102.67\r
	C1725.82,1537.41,1632.23,1560.75,1578.2,1560.75z" />\r
	<path d="M1312.95,1189.64v-78.37c0-1.41-1.14-2.55-2.55-2.55h-84.89c-23.05,0-41.73,18.69-41.73,41.73l0.01,360.86\r
	c-36.11,42.98-95.75,53.01-123.3,53.01c-19.58,0-142.89-9.18-142.89-131.9h0.25l-0.91-239.97h43.47c1.41,0,2.55-1.14,2.55-2.55\r
	v-78.93c0-1.41-1.14-2.55-2.55-2.55h-85.57c-23.2,0-42.01,18.81-42.01,42.01l0.01,291.09c3.81,110.4,77.39,196.73,227.66,196.73\r
	c54.46,0,95.85-13.44,126.75-35.56c6.46,14.9,21.28,25.32,38.55,25.32l82.16-0.04c2.76,0,5-2.24,5-5v-74c0-2.76-2.24-5-5-5\r
	l-40.16,0.03l-0.55-351.84h43.16C1311.81,1192.19,1312.95,1191.05,1312.95,1189.64z" />\r
</svg>`,D1={},xa={},O1={},y0={};let ie=0,oe=0;async function oI(r){log("ioFont_importFont","start"),log(r);const t=me(),n=t.project,e=r.glyphs.glyphs,a=r.substitution.getLigatures("liga"),i=r.kerningPairs;oe=mt(e)+a.length+mt(i);for(const o of Object.keys(e))await ja(),AI(e[o],n);for(const o of a)await ja(),xI({glyph:r.glyphs.get(o.by),gsub:o.sub},r);for(const o of Object.keys(i))await ja(),EI(o,i[o]);lI(r,n),n.glyphs=D1,n.ligatures=O1,n.kerning=y0,log(n),Fa(t),t.selectedCharacterRange=fr("Basic Latin"),t.nav.page="Overview",t.navigate(),log("ioFont_importFont","end")}async function ja(){_r(`
			Importing glyph:
			<span class="progress-indicator__counter">${ie}</span>
			 of
			<span class="progress-indicator__counter">${oe}</span>
		`),await Hn()}function AI(r,t){const n=Lt(r.unicode||0);if(n===!1){oe--;return}const e=m1(r);if(!e){console.warn("Something went wrong with importing this glyph."),console.log(r),oe--;return}const a=`glyph-${n}`;e.id=a,D1[a]=e,_o(n)&&(t.settings.app.showNonCharPoints=!0,console.warn(`CONTROL CHAR FOUND ${n}`));const i=Zo(n);xa[i.name]||(xa[i.name]=i),ie++}function m1(r){const t=r.advanceWidth;let n=r.path.toSVG(),e;return n?e=v0(`<svg>${n}</svg>`):e=new ot,e&&(e.advanceWidth=t),e}function xI(r,t){const n=m1(r.glyph);if(!n){console.warn("Something went wrong with importing this glyph."),console.log(r),oe--;return}let e=[];r.gsub.forEach(i=>{e.push(t.glyphs.get(i).unicode)}),n.gsub=e,n.objType="Ligature";const a=ge(String.fromCodePoint(...e));n.id=a,O1[a]=n,ie++}function EI(r,t){r=r.split(",");let n=Lt(r[0]),e=Lt(r[1]);if(r.length!==2){console.warn(`Something went wrong with importing this kern pair: ${JSON.stringify(r)} | ${t} `),ie--;return}const a=new Wr({leftGroup:[n],rightGroup:[e],value:t}),i=oi(y0);y0[i]=a,ie++}function lI(r,t){const n=t.settings.font,e=r.tables.os2,a=Ot(r.names.fontFamily)||"My Font";t.settings.project.name=a,n.name=a,n.upm=1*r.unitsPerEm||n.upm,n.ascent=1*Ot(e.sTypoAscender)||n.ascent,n.descent=-1*Math.abs(Ot(e.sTypoDescender))||n.descent,n.capHeight=1*Ot(e.sCapHeight)||n.capHeight,n.xHeight=1*Ot(e.sxHeight)||n.xHeight,n.overshoot=n.upm>2e3?30:20,n.lineGap=1*Ot(e.sTypoLineGap)||n.lineGap,n.family=a.substring(0,31),n.panose=Ot(e.panose)||"0 0 0 0 0 0 0 0 0 0",n.version=Ot(r.tables.head.fontRevision)||Ot(r.version)||Ot("Version 0.1"),n.style=Ot(r.tables.name.fontSubfamily)||"Regular",n.copyright=Ot(r.tables.name.copyright)||"",n.trademark=Ot(r.tables.name.trademark)||"",n.designer=Ot(r.tables.name.designer)||"",n.designerURL=Ot(r.tables.name.designerURL)||"",n.manufacturer=Ot(r.tables.name.manufacturer)||"",n.manufacturerURL=Ot(r.tables.name.manufacturerURL)||"",n.license=Ot(r.tables.name.license)||"",n.licenseURL=Ot(r.tables.name.licenseURL)||"",n.description=Ot(r.tables.name.description)||"";for(const i of Object.keys(xa))t.settings.project.characterRanges.push(new ae(xa[i]))}function Ot(r){try{if(typeof r=="object"&&typeof r.en=="string")return r.en;if(Object.prototype.toString.call(r)==="[object Array]")return r.join(" ")}catch{return 0}}const N0=`{\r
	"settings": {\r
		"project": {\r
			"name": "Oblegg",\r
			"latestVersion": "2.0.0",\r
			"initialVersion": "2.0.0-beta.1.0",\r
			"id": "g2_OBLEGG2",\r
			"characterRanges": [\r
				{\r
					"name": "Basic Latin",\r
					"begin": "0x20",\r
					"end": "0x7F"\r
				}\r
			]\r
		},\r
		"app": {\r
			"savePreferences": false,\r
			"stopPageNavigation": true,\r
			"showNonCharPoints": false,\r
			"formatSaveFile": true,\r
			"moveShapesOnSVGDragDrop": true,\r
			"guides": {\r
				"drawGuidesOnTop": false,\r
				"systemShowGuides": true,\r
				"systemShowLabels": false,\r
				"systemTransparency": 70,\r
				"systemGuides": [\r
					"baseline",\r
					"leftSide",\r
					"rightSide"\r
				],\r
				"customShowGuides": true,\r
				"customShowLabels": false,\r
				"customTransparency": 70,\r
				"custom": []\r
			},\r
			"contextCharacters": {\r
				"showCharacters": true,\r
				"characterTransparency": 20,\r
				"showGuides": true,\r
				"guidesTransparency": 70\r
			},\r
			"saveLivePreviews": true,\r
			"livePreviews": [\r
				{\r
					"text": "the five boxing wizards jump quickly"\r
				},\r
				{\r
					"fontSize": 128,\r
					"text": "pack my box with five dozen liquor waffle coffins."\r
				},\r
				{\r
					"fontSize": 28,\r
					"text": "{{scowl_10_short}}"\r
				}\r
			],\r
			"previewText": false\r
		},\r
		"font": {\r
			"family": "Oblegg",\r
			"style": "Regular",\r
			"version": "1.0",\r
			"description": "Test font for Glyphr Studio v2",\r
			"panose": "0 0 0 0 0 0 0 0 0 0",\r
			"upm": 2048,\r
			"ascent": 1490,\r
			"descent": -430,\r
			"capHeight": 1490,\r
			"xHeight": 1020,\r
			"overshoot": 20,\r
			"lineGap": 250,\r
			"italicAngle": 0,\r
			"designer": "Matt LaGrandeur",\r
			"designerURL": "mattlag.com",\r
			"manufacturer": "Matt LaGrandeur",\r
			"manufacturerURL": "mattlag.com",\r
			"license": "OFL",\r
			"licenseURL": "",\r
			"copyright": "2023",\r
			"trademark": "",\r
			"variant": "normal",\r
			"weight": 400,\r
			"stretch": "normal",\r
			"stemv": 0,\r
			"stemh": 0,\r
			"slope": 0,\r
			"underlinePosition": -50,\r
			"underlineThickness": 10,\r
			"strikethroughPosition": 300,\r
			"strikethroughThickness": 10,\r
			"overlinePosition": 750,\r
			"overlineThickness": 10\r
		}\r
	},\r
	"glyphs": {\r
		"glyph-0x41": {\r
			"id": "glyph-0x41",\r
			"advanceWidth": 1252,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 15,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1207,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1210,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1257,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1113,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1063,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1163,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 755,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 705,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 805,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 800,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 750,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 803,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 805,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 805,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 855,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 805,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 755,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 805,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 800,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 803,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 850,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 439,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 389,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 436,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 434,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 434,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 484,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 434,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 384,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 434,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 439,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 436,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 489,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 484,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 434,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 534,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 126,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 76,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 176,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 321,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 374,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 426,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 326,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 376,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 374,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 421,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 289,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 239,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 339,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 378,\r
									"y": 456\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 328,\r
									"y": 456\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 428,\r
									"y": 456\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 851,\r
									"y": 456\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 801,\r
									"y": 456\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 901,\r
									"y": 456\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 940,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 890,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 990,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 872,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 822,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 869,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 867,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 867,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 917,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 867,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 817,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 867,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 872,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 869,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 922,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1207,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1157,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1210,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1212,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1212,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1262,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1212,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1162,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1212,\r
									"y": 172\r
								}\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -4,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 432,\r
									"y": 630\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 382,\r
									"y": 630\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 482,\r
									"y": 630\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 614,\r
									"y": 1211\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 564,\r
									"y": 1211\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 664,\r
									"y": 1211\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 797,\r
									"y": 630\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 747,\r
									"y": 630\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 847,\r
									"y": 630\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x42": {\r
			"id": "glyph-0x42",\r
			"advanceWidth": 1052,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 7,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 832,\r
									"y": 783\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 978,\r
									"y": 686\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 906,\r
									"y": 862\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 940,\r
									"y": 1058\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 940,\r
									"y": 969\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 940,\r
									"y": 1180\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 578,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 907,\r
									"y": 1483\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 628,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 578,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 528,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 628,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1323\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1323\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1320\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 150,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 100,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 200,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 150,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 100,\r
									"y": 172\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 200,\r
									"y": 172\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 172\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 167\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 170\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 167\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 628,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 578,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 938,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1012,\r
									"y": 396\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1012,\r
									"y": 230\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1012,\r
									"y": 489\r
								}\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -6,\r
					"pathPoints": [\r
						{\r
							"type": "flat",\r
							"p": {\r
								"coord": {\r
									"x": 565,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 732,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 796,\r
									"y": 1058\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 796,\r
									"y": 1225\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 796,\r
									"y": 938\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 566,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 708,\r
									"y": 840\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 322,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 272,\r
									"y": 840\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 372,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 322,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 272,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 372,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 3",\r
					"winding": -6,\r
					"pathPoints": [\r
						{\r
							"type": "flat",\r
							"p": {\r
								"coord": {\r
									"x": 628,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 774,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 322,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 272,\r
									"y": 172\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 372,\r
									"y": 172\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 322,\r
									"y": 665\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 272,\r
									"y": 665\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 372,\r
									"y": 665\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 628,\r
									"y": 665\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 578,\r
									"y": 665\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 799,\r
									"y": 665\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 864,\r
									"y": 396\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 864,\r
									"y": 568\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 864,\r
									"y": 273\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x43": {\r
			"id": "glyph-0x43",\r
			"advanceWidth": 1062,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 11,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 852,\r
									"y": 1256\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 849,\r
									"y": 1256\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 902,\r
									"y": 1256\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1017,\r
									"y": 1256\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 967,\r
									"y": 1256\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1020,\r
									"y": 1256\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1022,\r
									"y": 1261\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1022,\r
									"y": 1258\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1072,\r
									"y": 1261\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1022,\r
									"y": 1407\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 972,\r
									"y": 1407\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1022,\r
									"y": 1453\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 939,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 985,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 989,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 704,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 654,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 490,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 196,\r
									"y": 1230\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 314,\r
									"y": 1400\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 144,\r
									"y": 1155\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 78,\r
									"y": 965\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 104,\r
									"y": 1066\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 53,\r
									"y": 870\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 657\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 766\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 431\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 207,\r
									"y": 159\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 95,\r
									"y": 268\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 317,\r
									"y": 52\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 704,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 479,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 754,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 939,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 889,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 985,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1022,\r
									"y": 83\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1022,\r
									"y": 37\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1072,\r
									"y": 83\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1022,\r
									"y": 224\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 972,\r
									"y": 224\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1022,\r
									"y": 227\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1017,\r
									"y": 229\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1020,\r
									"y": 229\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1067,\r
									"y": 229\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 852,\r
									"y": 229\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 802,\r
									"y": 229\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 849,\r
									"y": 229\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 847,\r
									"y": 224\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 847,\r
									"y": 227\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 897,\r
									"y": 224\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 847,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 797,\r
									"y": 172\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 897,\r
									"y": 172\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 704,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 654,\r
									"y": 172\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 350,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 212,\r
									"y": 657\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 212,\r
									"y": 308\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 212,\r
									"y": 847\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 337,\r
									"y": 1132\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 256,\r
									"y": 1016\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 423,\r
									"y": 1255\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 704,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 547,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 754,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 847,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 797,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 897,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 847,\r
									"y": 1261\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 797,\r
									"y": 1261\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 847,\r
									"y": 1258\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x44": {\r
			"id": "glyph-0x44",\r
			"advanceWidth": 1167,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 11,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 463,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 413,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 688,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 960,\r
									"y": 159\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 850,\r
									"y": 52\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1072,\r
									"y": 268\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1127,\r
									"y": 657\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1127,\r
									"y": 431\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1127,\r
									"y": 766\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1090,\r
									"y": 965\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1115,\r
									"y": 870\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1064,\r
									"y": 1066\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 971,\r
									"y": 1230\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1023,\r
									"y": 1155\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 853,\r
									"y": 1400\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 463,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 677,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 513,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1323\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1323\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1320\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 148,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 98,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 198,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 148,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 98,\r
									"y": 172\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 198,\r
									"y": 172\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 172\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 167\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 170\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 167\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -5,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 320,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 270,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 370,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 463,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 413,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 620,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 830,\r
									"y": 1132\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 744,\r
									"y": 1255\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 911,\r
									"y": 1016\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 955,\r
									"y": 657\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 955,\r
									"y": 847\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 955,\r
									"y": 308\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 463,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 817,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 513,\r
									"y": 172\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 320,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 270,\r
									"y": 172\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 370,\r
									"y": 172\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 320,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 270,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 370,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x45": {\r
			"id": "glyph-0x45",\r
			"advanceWidth": 1001,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 13,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 787,\r
									"y": 1232\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 737,\r
									"y": 1232\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 787,\r
									"y": 1229\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 792,\r
									"y": 1227\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 789,\r
									"y": 1227\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 842,\r
									"y": 1227\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 956,\r
									"y": 1227\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 906,\r
									"y": 1227\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 959,\r
									"y": 1227\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 961,\r
									"y": 1232\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 961,\r
									"y": 1229\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1011,\r
									"y": 1232\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 961,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 911,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1011,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 101,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 51,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 151,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 101,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 51,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 151,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 961,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 911,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1011,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 961,\r
									"y": 258\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 911,\r
									"y": 258\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 961,\r
									"y": 261\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 956,\r
									"y": 263\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 959,\r
									"y": 263\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1006,\r
									"y": 263\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 792,\r
									"y": 263\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 742,\r
									"y": 263\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 789,\r
									"y": 263\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 787,\r
									"y": 258\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 787,\r
									"y": 261\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 837,\r
									"y": 258\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 787,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 737,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 837,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 274,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 224,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 324,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 274,\r
									"y": 665\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 224,\r
									"y": 665\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 324,\r
									"y": 665\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 583,\r
									"y": 665\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 533,\r
									"y": 665\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 586,\r
									"y": 665\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 588,\r
									"y": 670\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 588,\r
									"y": 667\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 638,\r
									"y": 670\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 588,\r
									"y": 835\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 538,\r
									"y": 835\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 588,\r
									"y": 838\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 583,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 586,\r
									"y": 840\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 633,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 274,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 224,\r
									"y": 840\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 324,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 274,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 224,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 324,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 787,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 737,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 837,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x46": {\r
			"id": "glyph-0x46",\r
			"advanceWidth": 1003,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 13,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 321,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 374,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 426,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 326,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 376,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 374,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 421,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 276,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 226,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 326,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 276,\r
									"y": 665\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 226,\r
									"y": 665\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 326,\r
									"y": 665\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 600,\r
									"y": 665\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 550,\r
									"y": 665\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 603,\r
									"y": 665\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 605,\r
									"y": 670\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 605,\r
									"y": 667\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 655,\r
									"y": 670\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 605,\r
									"y": 835\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 555,\r
									"y": 835\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 605,\r
									"y": 838\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 600,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 603,\r
									"y": 840\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 650,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 276,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 226,\r
									"y": 840\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 326,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 276,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 226,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 326,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 789,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 739,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 839,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 789,\r
									"y": 1232\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 739,\r
									"y": 1232\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 789,\r
									"y": 1229\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 794,\r
									"y": 1227\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 791,\r
									"y": 1227\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 844,\r
									"y": 1227\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 958,\r
									"y": 1227\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 908,\r
									"y": 1227\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 961,\r
									"y": 1227\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 963,\r
									"y": 1232\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 963,\r
									"y": 1229\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1013,\r
									"y": 1232\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 963,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 913,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1013,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 103,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 53,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 153,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 103,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 53,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 153,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x47": {\r
			"id": "glyph-0x47",\r
			"advanceWidth": 1299,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 9,\r
					"pathPoints": [\r
						{\r
							"type": "flat",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 268,\r
									"y": -20\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 830,\r
									"y": -20\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1084,\r
									"y": 128\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 978,\r
									"y": 23\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1134,\r
									"y": 128\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1084,\r
									"y": 4\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1034,\r
									"y": 4\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1084,\r
									"y": 1\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1089,\r
									"y": -1\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1086,\r
									"y": -1\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1139,\r
									"y": -1\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1254,\r
									"y": -1\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1204,\r
									"y": -1\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1257,\r
									"y": -1\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1259,\r
									"y": 4\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1259,\r
									"y": 1\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1309,\r
									"y": 4\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1259,\r
									"y": 625\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1209,\r
									"y": 625\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1259,\r
									"y": 628\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1254,\r
									"y": 630\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1257,\r
									"y": 630\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1304,\r
									"y": 630\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 714,\r
									"y": 630\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 664,\r
									"y": 630\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 711,\r
									"y": 630\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 709,\r
									"y": 625\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 709,\r
									"y": 628\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 759,\r
									"y": 625\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 709,\r
									"y": 460\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 659,\r
									"y": 460\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 709,\r
									"y": 457\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 714,\r
									"y": 455\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 711,\r
									"y": 455\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 764,\r
									"y": 455\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1058,\r
									"y": 455\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1008,\r
									"y": 455\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1017,\r
									"y": 291\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": 158\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 911,\r
									"y": 158\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 304,\r
									"y": 158\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 218,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 218,\r
									"y": 434\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 218,\r
									"y": 997\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": 1332\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 295,\r
									"y": 1332\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 859,\r
									"y": 1332\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1029,\r
									"y": 1054\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 972,\r
									"y": 1215\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1079,\r
									"y": 1054\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1202,\r
									"y": 1095\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1152,\r
									"y": 1095\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1130,\r
									"y": 1314\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": 1510\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 975,\r
									"y": 1510\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 117,\r
									"y": 1510\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 954\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 198\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x48": {\r
			"id": "glyph-0x48",\r
			"advanceWidth": 1221,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 19,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 321,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 374,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 426,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 326,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 376,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 374,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 421,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 665\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 665\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 665\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 929,\r
									"y": 665\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 879,\r
									"y": 665\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 979,\r
									"y": 665\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 929,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 879,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 979,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 850,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 800,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 847,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 845,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 845,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 895,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 845,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 795,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 845,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 850,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 847,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 900,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1176,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1126,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1179,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1231,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1131,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1176,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1179,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1226,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1102,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1052,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1152,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1102,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1052,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1152,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1176,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1126,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1179,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1231,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1131,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1176,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1179,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1226,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 850,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 800,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 847,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 845,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 845,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 895,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 845,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 795,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 845,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 850,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 847,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 900,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 929,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 879,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 979,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 929,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 879,\r
									"y": 840\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 979,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 840\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 321,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 374,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 426,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 326,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 374,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 421,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 119,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 69,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 169,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 119,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 69,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 169,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x49": {\r
			"id": "glyph-0x49",\r
			"advanceWidth": 1096,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 11,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1056,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1006,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1106,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1056,\r
									"y": 231\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1006,\r
									"y": 231\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1056,\r
									"y": 234\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1051,\r
									"y": 236\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1054,\r
									"y": 236\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1101,\r
									"y": 236\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 887,\r
									"y": 236\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 837,\r
									"y": 236\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 884,\r
									"y": 236\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 882,\r
									"y": 231\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 882,\r
									"y": 234\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 932,\r
									"y": 231\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 882,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 832,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 932,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 629,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 579,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 679,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 629,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 579,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 679,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 882,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 832,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 932,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 882,\r
									"y": 1256\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 832,\r
									"y": 1256\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 882,\r
									"y": 1253\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 887,\r
									"y": 1251\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 884,\r
									"y": 1251\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 937,\r
									"y": 1251\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1051,\r
									"y": 1251\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1001,\r
									"y": 1251\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1054,\r
									"y": 1251\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1056,\r
									"y": 1256\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1056,\r
									"y": 1253\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1106,\r
									"y": 1256\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1056,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1006,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1106,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1256\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1256\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1253\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1251\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1251\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1251\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 209,\r
									"y": 1251\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 159,\r
									"y": 1251\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 212,\r
									"y": 1251\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 214,\r
									"y": 1256\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 214,\r
									"y": 1253\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 264,\r
									"y": 1256\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 214,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 164,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 264,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 455,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 405,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 505,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 455,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 405,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 505,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 214,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 164,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 264,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 214,\r
									"y": 231\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 164,\r
									"y": 231\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 214,\r
									"y": 234\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 209,\r
									"y": 236\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 212,\r
									"y": 236\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 259,\r
									"y": 236\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 236\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 236\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 236\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 231\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 234\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 231\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x4A": {\r
			"id": "glyph-0x4A",\r
			"advanceWidth": 1009,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 10,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 964,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 967,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1014,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 216,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 166,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 213,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 211,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 211,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 261,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 211,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 161,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 211,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 216,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 213,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 266,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 747,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 697,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 797,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 747,\r
									"y": 710\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 697,\r
									"y": 710\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 797,\r
									"y": 710\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 747,\r
									"y": 710\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 697,\r
									"y": 710\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 747,\r
									"y": 701\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 748,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 748,\r
									"y": 693\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 748,\r
									"y": 438\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 314,\r
									"y": 154\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 688,\r
									"y": 156\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 364,\r
									"y": 154\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 314,\r
									"y": 154\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 264,\r
									"y": 154\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 364,\r
									"y": 154\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 214,\r
									"y": 154\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 164,\r
									"y": 154\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 264,\r
									"y": 154\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 214,\r
									"y": 233\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 164,\r
									"y": 233\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 214,\r
									"y": 236\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 209,\r
									"y": 238\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 212,\r
									"y": 238\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 259,\r
									"y": 238\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 238\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 238\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 238\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 233\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 236\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 233\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 63\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 63\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 17\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 123,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 77,\r
									"y": -20\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 173,\r
									"y": -20\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 314,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 264,\r
									"y": -20\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 364,\r
									"y": -20\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 314,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 264,\r
									"y": -20\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 681,\r
									"y": -19\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 920,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 920,\r
									"y": 166\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 920,\r
									"y": 693\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 920,\r
									"y": 710\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 920,\r
									"y": 701\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 970,\r
									"y": 710\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 920,\r
									"y": 710\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 870,\r
									"y": 710\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 970,\r
									"y": 710\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 920,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 870,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 970,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 964,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 914,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 967,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 969,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 969,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1019,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 969,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 919,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 969,\r
									"y": 1488\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x4B": {\r
			"id": "glyph-0x4B",\r
			"advanceWidth": 1100,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 18,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 426,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 326,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 376,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 374,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 421,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 665\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 665\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 665\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 361,\r
									"y": 665\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 311,\r
									"y": 665\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 411,\r
									"y": 665\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 778,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 728,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 828,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 729,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 679,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 726,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 724,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 724,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 774,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 724,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 674,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 724,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 729,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 726,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 779,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1055,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1005,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1058,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1060,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1060,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1110,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1060,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1010,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1060,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1055,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1058,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1105,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1004,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 954,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1054,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 475,\r
									"y": 796\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 425,\r
									"y": 796\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 525,\r
									"y": 796\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 891,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 841,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 941,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 985,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 935,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 988,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 990,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 990,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1040,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 990,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 940,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 990,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 985,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 988,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1035,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 659,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 609,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 656,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 654,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 654,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 704,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 654,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 604,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 654,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 659,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 656,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 709,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 714,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 664,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 764,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 320,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 270,\r
									"y": 840\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 370,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 840\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 321,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 374,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 426,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 326,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 374,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 421,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 119,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 69,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 169,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 119,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 69,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 169,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 321,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 374,\r
									"y": 0\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x4C": {\r
			"id": "glyph-0x4C",\r
			"advanceWidth": 1003,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 11,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 963,\r
									"y": 256\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 913,\r
									"y": 256\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 963,\r
									"y": 259\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 958,\r
									"y": 261\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 961,\r
									"y": 261\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1008,\r
									"y": 261\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 794,\r
									"y": 261\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 744,\r
									"y": 261\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 791,\r
									"y": 261\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 789,\r
									"y": 256\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 789,\r
									"y": 259\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 839,\r
									"y": 256\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 789,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 739,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 839,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 276,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 226,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 326,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 276,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 226,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 326,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 321,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 374,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 426,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 326,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 374,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 421,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 103,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 53,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 153,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 103,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 53,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 153,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 963,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 913,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1013,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x4F": {\r
			"id": "glyph-0x4F",\r
			"advanceWidth": 1300,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 3,\r
					"pathPoints": [\r
						{\r
							"type": "flat",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": 1510\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1187,\r
									"y": 1510\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 117,\r
									"y": 1510\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 954\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 198\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 268,\r
									"y": -20\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1019,\r
									"y": -20\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1260,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1260,\r
									"y": 164\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1260,\r
									"y": 979\r
								}\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -5,\r
					"pathPoints": [\r
						{\r
							"type": "flat",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": 158\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1028,\r
									"y": 158\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 304,\r
									"y": 158\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 218,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 218,\r
									"y": 434\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 218,\r
									"y": 997\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": 1332\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 295,\r
									"y": 1332\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1003,\r
									"y": 1332\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1081,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1081,\r
									"y": 997\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1081,\r
									"y": 437\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x4E": {\r
			"id": "glyph-0x4E",\r
			"advanceWidth": 1221,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 13,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 929,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 879,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 979,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1102,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1052,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1152,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1102,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1052,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1152,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1176,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1126,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1179,\r
									"y": 1315\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 1320\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 1317\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1231,\r
									"y": 1320\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 1484\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1131,\r
									"y": 1484\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 1487\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1176,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1179,\r
									"y": 1489\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1226,\r
									"y": 1489\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 850,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 800,\r
									"y": 1489\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 847,\r
									"y": 1489\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 845,\r
									"y": 1484\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 845,\r
									"y": 1487\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 895,\r
									"y": 1484\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 845,\r
									"y": 1320\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 795,\r
									"y": 1320\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 845,\r
									"y": 1317\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 850,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 847,\r
									"y": 1315\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 900,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 929,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 879,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 979,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 929,\r
									"y": 366\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 879,\r
									"y": 366\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 979,\r
									"y": 366\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 297,\r
									"y": 1481\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 247,\r
									"y": 1481\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 347,\r
									"y": 1481\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 297,\r
									"y": 1484\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 247,\r
									"y": 1484\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 297,\r
									"y": 1487\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 295,\r
									"y": 1489\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 343,\r
									"y": 1489\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 291,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 241,\r
									"y": 1489\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 341,\r
									"y": 1489\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1489\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1489\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1484\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1487\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1484\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1320\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1320\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1317\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1315\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 119,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 69,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 169,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 119,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 69,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 169,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 321,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 374,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 426,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 376,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 326,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 376,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 371,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 374,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 421,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 292,\r
									"y": 1114\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 242,\r
									"y": 1114\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 342,\r
									"y": 1114\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x4D": {\r
			"id": "glyph-0x4D",\r
			"advanceWidth": 1336,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 15,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1291,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1294,\r
									"y": 1489\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1341,\r
									"y": 1489\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1048,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 998,\r
									"y": 1489\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1098,\r
									"y": 1489\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1048,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 998,\r
									"y": 1489\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1098,\r
									"y": 1489\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1047,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 997,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1097,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1046,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 996,\r
									"y": 1489\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1044,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1043,\r
									"y": 1484\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1043,\r
									"y": 1486\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1093,\r
									"y": 1484\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1043,\r
									"y": 1483\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 993,\r
									"y": 1483\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1093,\r
									"y": 1483\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 682,\r
									"y": 811\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 632,\r
									"y": 811\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 732,\r
									"y": 811\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 1483\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 243,\r
									"y": 1483\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 343,\r
									"y": 1483\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 1484\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 243,\r
									"y": 1484\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 293,\r
									"y": 1486\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 290,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 292,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 340,\r
									"y": 1489\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 289,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 239,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 339,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 288,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 238,\r
									"y": 1489\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 338,\r
									"y": 1489\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 288,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 238,\r
									"y": 1489\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 338,\r
									"y": 1489\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1489\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1489\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1484\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1487\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1484\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1320\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1320\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1317\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1315\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 120,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 70,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 170,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 120,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 70,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 170,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 46,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -4,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 43,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 41,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 41,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 91,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 41,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -9,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 41,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 46,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 43,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 96,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 372,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 322,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 375,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 377,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 377,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 427,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 377,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 327,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 377,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 372,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 375,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 422,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 243,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 343,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 1110\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 243,\r
									"y": 1110\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 343,\r
									"y": 1110\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 678,\r
									"y": 451\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 628,\r
									"y": 451\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 728,\r
									"y": 451\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1043,\r
									"y": 1103\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 993,\r
									"y": 1103\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1093,\r
									"y": 1103\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1043,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 993,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1093,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 964,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 914,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 961,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 959,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 959,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1009,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 959,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 909,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 959,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 964,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 961,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1014,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1290,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1240,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1293,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1295,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1295,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1345,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1295,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1245,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1295,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1290,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1293,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1340,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1216,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1166,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1266,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1216,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1166,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1266,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1291,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1241,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1294,\r
									"y": 1315\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1296,\r
									"y": 1320\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1296,\r
									"y": 1317\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1346,\r
									"y": 1320\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1296,\r
									"y": 1484\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1246,\r
									"y": 1484\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1296,\r
									"y": 1487\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x50": {\r
			"id": "glyph-0x50",\r
			"advanceWidth": 994,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 7,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 573,\r
									"y": 666\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 523,\r
									"y": 666\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 834,\r
									"y": 666\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 954,\r
									"y": 1059\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 954,\r
									"y": 897\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 954,\r
									"y": 1181\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 585,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 914,\r
									"y": 1483\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 635,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 585,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 535,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 635,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 157,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 107,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 207,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 157,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 107,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 207,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 422,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 372,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 425,\r
									"y": 1\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 375,\r
									"y": 1\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 475,\r
									"y": 1\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 426,\r
									"y": 1\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 1\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 476,\r
									"y": 1\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 426,\r
									"y": 2\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 2\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 476,\r
									"y": 2\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 427,\r
									"y": 5\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 477,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 427,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 377,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 426,\r
									"y": 172\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 172\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 476,\r
									"y": 172\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 426,\r
									"y": 173\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 376,\r
									"y": 173\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 476,\r
									"y": 173\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 425,\r
									"y": 173\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 375,\r
									"y": 173\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 475,\r
									"y": 173\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 422,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 472,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 329,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 279,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 379,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 329,\r
									"y": 666\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 279,\r
									"y": 666\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 379,\r
									"y": 666\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -5,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 572,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 522,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 739,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 803,\r
									"y": 1059\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 803,\r
									"y": 1226\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 803,\r
									"y": 939\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 573,\r
									"y": 841\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 715,\r
									"y": 841\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 329,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 279,\r
									"y": 840\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 379,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 329,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 279,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 379,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 572,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 622,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x51": {\r
			"id": "glyph-0x51",\r
			"advanceWidth": 1318,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 5,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1119,\r
									"y": 167\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1069,\r
									"y": 167\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1209,\r
									"y": 279\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1260,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1260,\r
									"y": 446\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1260,\r
									"y": 979\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": 1510\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1187,\r
									"y": 1510\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 117,\r
									"y": 1510\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 954\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 198\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 268,\r
									"y": -20\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 779,\r
									"y": -20\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 985,\r
									"y": 54\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 892,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1035,\r
									"y": 54\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1155,\r
									"y": -116\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1105,\r
									"y": -116\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1157,\r
									"y": -118\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1162,\r
									"y": -116\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1160,\r
									"y": -118\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1212,\r
									"y": -116\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1278,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1228,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1280,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1278,\r
									"y": 7\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1280,\r
									"y": 5\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1328,\r
									"y": 7\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -3,\r
					"pathPoints": [\r
						{\r
							"type": "flat",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": 158\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 729,\r
									"y": 158\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 304,\r
									"y": 158\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 218,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 218,\r
									"y": 434\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 218,\r
									"y": 997\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": 1332\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 295,\r
									"y": 1332\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1003,\r
									"y": 1332\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1081,\r
									"y": 684\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1081,\r
									"y": 997\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1081,\r
									"y": 548\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 987,\r
									"y": 299\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1065,\r
									"y": 402\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1037,\r
									"y": 299\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 848,\r
									"y": 437\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 798,\r
									"y": 437\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 846,\r
									"y": 439\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 841,\r
									"y": 437\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 843,\r
									"y": 439\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 891,\r
									"y": 437\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 725,\r
									"y": 322\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 675,\r
									"y": 322\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 723,\r
									"y": 320\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 725,\r
									"y": 314\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 723,\r
									"y": 316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 775,\r
									"y": 314\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 847,\r
									"y": 192\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 797,\r
									"y": 192\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 794,\r
									"y": 170\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x52": {\r
			"id": "glyph-0x52",\r
			"advanceWidth": 1103,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 9,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1058,\r
									"y": 175\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1061,\r
									"y": 175\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1108,\r
									"y": 175\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 930,\r
									"y": 175\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 880,\r
									"y": 175\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 980,\r
									"y": 175\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 642,\r
									"y": 674\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 592,\r
									"y": 674\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 847,\r
									"y": 716\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 942,\r
									"y": 1059\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 942,\r
									"y": 915\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 942,\r
									"y": 1181\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 573,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 902,\r
									"y": 1483\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 623,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 573,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 523,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 623,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 44,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -6,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 94,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 44,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -6,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1487\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 145,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 195,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 145,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 95,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 195,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 422,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 372,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 425,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 427,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 427,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 477,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 427,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 377,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 427,\r
									"y": 172\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 422,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 425,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 472,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 317,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 267,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 367,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 317,\r
									"y": 666\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 267,\r
									"y": 666\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 367,\r
									"y": 666\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 445,\r
									"y": 666\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 395,\r
									"y": 666\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 495,\r
									"y": 666\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 806,\r
									"y": 1\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 756,\r
									"y": 1\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 856,\r
									"y": 1\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 809,\r
									"y": 1\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 759,\r
									"y": 1\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 859,\r
									"y": 1\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 809,\r
									"y": 1\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 759,\r
									"y": 1\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 859,\r
									"y": 1\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1058,\r
									"y": 1\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1008,\r
									"y": 1\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1061,\r
									"y": 1\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1063,\r
									"y": 6\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1063,\r
									"y": 3\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1113,\r
									"y": 6\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1063,\r
									"y": 170\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1013,\r
									"y": 170\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1063,\r
									"y": 173\r
								}\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -3,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 317,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 267,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 367,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 560,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 727,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 791,\r
									"y": 1059\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 791,\r
									"y": 1226\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 791,\r
									"y": 939\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 561,\r
									"y": 841\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 703,\r
									"y": 841\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 503,\r
									"y": 841\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 553,\r
									"y": 841\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 503,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 453,\r
									"y": 840\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 553,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 317,\r
									"y": 840\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 267,\r
									"y": 840\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 367,\r
									"y": 840\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 317,\r
									"y": 1318\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 267,\r
									"y": 1318\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 367,\r
									"y": 1318\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x53": {\r
			"id": "glyph-0x53",\r
			"advanceWidth": 981,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 7,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 490,\r
									"y": 849\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 910,\r
									"y": 849\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 540,\r
									"y": 849\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 490,\r
									"y": 850\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 440,\r
									"y": 850\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 257,\r
									"y": 850\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 228,\r
									"y": 1054\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 228,\r
									"y": 988\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 228,\r
									"y": 1201\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 490,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 296,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 553,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 684,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 624,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 734,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 684,\r
									"y": 1234\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 634,\r
									"y": 1234\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 684,\r
									"y": 1231\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 689,\r
									"y": 1229\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 686,\r
									"y": 1229\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 739,\r
									"y": 1229\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 853,\r
									"y": 1229\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 803,\r
									"y": 1229\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 856,\r
									"y": 1229\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 858,\r
									"y": 1234\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 858,\r
									"y": 1231\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 908,\r
									"y": 1234\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 858,\r
									"y": 1407\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 808,\r
									"y": 1407\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 858,\r
									"y": 1453\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 775,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 821,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 825,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 490,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 440,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 310,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 54,\r
									"y": 1054\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 54,\r
									"y": 1395\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 54,\r
									"y": 880\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 486,\r
									"y": 676\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 207,\r
									"y": 676\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 741,\r
									"y": 676\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 767,\r
									"y": 394\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 767,\r
									"y": 552\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 767,\r
									"y": 324\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 486,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 762,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 536,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 214,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 164,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 264,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 214,\r
									"y": 254\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 164,\r
									"y": 254\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 214,\r
									"y": 257\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 209,\r
									"y": 259\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 212,\r
									"y": 259\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 259,\r
									"y": 259\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 259\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 259\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 259\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 254\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 257\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 254\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 83\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 83\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 38\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 121,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 76,\r
									"y": 1\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 171,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 121,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 71,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 171,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 486,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 436,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 956,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 941,\r
									"y": 394\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 941,\r
									"y": 331\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 941,\r
									"y": 517\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x54": {\r
			"id": "glyph-0x54",\r
			"advanceWidth": 1104,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 11,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1064,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1014,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1114,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1215\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1215\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1212\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1210\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1210\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1210\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 210,\r
									"y": 1210\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 160,\r
									"y": 1210\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 213,\r
									"y": 1210\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 215,\r
									"y": 1215\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 215,\r
									"y": 1212\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 265,\r
									"y": 1215\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 215,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 165,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 265,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 458,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 408,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 508,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 458,\r
									"y": 176\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 408,\r
									"y": 176\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 508,\r
									"y": 176\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 359,\r
									"y": 176\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 309,\r
									"y": 176\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 356,\r
									"y": 176\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 354,\r
									"y": 171\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 354,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 404,\r
									"y": 171\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 354,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 304,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 354,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 359,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 356,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 409,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 723,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 673,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 726,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 728,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 728,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 778,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 728,\r
									"y": 171\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 678,\r
									"y": 171\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 728,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 723,\r
									"y": 176\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 726,\r
									"y": 176\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 773,\r
									"y": 176\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 634,\r
									"y": 176\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 584,\r
									"y": 176\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 684,\r
									"y": 176\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 634,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 584,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 684,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 888,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 838,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 938,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 888,\r
									"y": 1215\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 838,\r
									"y": 1215\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 888,\r
									"y": 1212\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 893,\r
									"y": 1210\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 890,\r
									"y": 1210\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 943,\r
									"y": 1210\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1058,\r
									"y": 1210\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1008,\r
									"y": 1210\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1061,\r
									"y": 1210\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1063,\r
									"y": 1215\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1063,\r
									"y": 1212\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1113,\r
									"y": 1215\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x55": {\r
			"id": "glyph-0x55",\r
			"advanceWidth": 1301,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 12,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1256,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1259,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1306,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 892,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 842,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 889,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 887,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 887,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 937,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 887,\r
									"y": 1319\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 837,\r
									"y": 1319\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 887,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 892,\r
									"y": 1314\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 889,\r
									"y": 1314\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 942,\r
									"y": 1314\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 984,\r
									"y": 1314\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 934,\r
									"y": 1314\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1034,\r
									"y": 1314\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 984,\r
									"y": 506\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 934,\r
									"y": 506\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 984,\r
									"y": 379\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 907,\r
									"y": 237\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 959,\r
									"y": 291\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 854,\r
									"y": 182\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 642,\r
									"y": 155\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 768,\r
									"y": 155\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 518,\r
									"y": 155\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 385,\r
									"y": 235\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 434,\r
									"y": 181\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 336,\r
									"y": 288\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 312,\r
									"y": 506\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 312,\r
									"y": 377\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 362,\r
									"y": 506\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 312,\r
									"y": 1314\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 262,\r
									"y": 1314\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 362,\r
									"y": 1314\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 409,\r
									"y": 1314\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 359,\r
									"y": 1314\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 412,\r
									"y": 1314\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 414,\r
									"y": 1319\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 414,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 464,\r
									"y": 1319\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 414,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 364,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 414,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 409,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 412,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 459,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1319\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1319\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1314\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1314\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1314\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 138,\r
									"y": 1314\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 88,\r
									"y": 1314\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 188,\r
									"y": 1314\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 138,\r
									"y": 506\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 88,\r
									"y": 506\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 138,\r
									"y": 332\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 256,\r
									"y": 118\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 176,\r
									"y": 205\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 340,\r
									"y": 25\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 642,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 466,\r
									"y": -20\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 728,\r
									"y": -20\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 864,\r
									"y": 12\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 800,\r
									"y": -9\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 931,\r
									"y": 35\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1033,\r
									"y": 116\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 988,\r
									"y": 69\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1117,\r
									"y": 205\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1159,\r
									"y": 506\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1159,\r
									"y": 332\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1209,\r
									"y": 506\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1159,\r
									"y": 1314\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1109,\r
									"y": 1314\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1209,\r
									"y": 1314\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1256,\r
									"y": 1314\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1206,\r
									"y": 1314\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1259,\r
									"y": 1314\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1261,\r
									"y": 1319\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1261,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1311,\r
									"y": 1319\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1261,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1211,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1261,\r
									"y": 1488\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x56": {\r
			"id": "glyph-0x56",\r
			"advanceWidth": 1276,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 10,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1231,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1234,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1281,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1018,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 968,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1016,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1013,\r
									"y": 1486\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1013,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1063,\r
									"y": 1486\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 650,\r
									"y": 395\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 600,\r
									"y": 395\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 700,\r
									"y": 395\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 263,\r
									"y": 1486\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 213,\r
									"y": 1486\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 263,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 258,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 260,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 308,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 131,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 81,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 181,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 597,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 547,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 647,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 705,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 655,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 755,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1141,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1091,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1191,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1231,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1234,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1236,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1236,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1286,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1236,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1186,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1236,\r
									"y": 1488\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x57": {\r
			"id": "glyph-0x57",\r
			"advanceWidth": 1549,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 12,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1504,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1507,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1554,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1291,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1241,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1288,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1286,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1286,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1336,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1067,\r
									"y": 385\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1017,\r
									"y": 385\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1117,\r
									"y": 385\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 803,\r
									"y": 897\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 753,\r
									"y": 897\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 853,\r
									"y": 897\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 741,\r
									"y": 897\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 691,\r
									"y": 897\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 791,\r
									"y": 897\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 484,\r
									"y": 392\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 434,\r
									"y": 392\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 534,\r
									"y": 392\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 263,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 213,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 263,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 258,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 261,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 308,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 123,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 73,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 173,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 366,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 316,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 416,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 515,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 465,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 565,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 771,\r
									"y": 523\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 721,\r
									"y": 523\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 821,\r
									"y": 523\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1034,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 984,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1084,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1183,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1133,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1233,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1428,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1378,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1478,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1504,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1454,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1507,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1509,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1509,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1559,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1509,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1459,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1509,\r
									"y": 1488\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x58": {\r
			"id": "glyph-0x58",\r
			"advanceWidth": 1180,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 19,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1135,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1138,\r
									"y": 174\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1185,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1022,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 972,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1072,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 702,\r
									"y": 759\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 652,\r
									"y": 759\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 752,\r
									"y": 759\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1010,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 960,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1060,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1115,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1065,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1118,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1120,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1120,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1170,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1120,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1070,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1120,\r
									"y": 1488\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1115,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1118,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1165,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 902,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 852,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 900,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 898,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 948,\r
									"y": 1488\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 897,\r
									"y": 1487\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 847,\r
									"y": 1487\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 947,\r
									"y": 1487\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 600,\r
									"y": 945\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 550,\r
									"y": 945\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 650,\r
									"y": 945\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 303,\r
									"y": 1487\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 253,\r
									"y": 1487\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 353,\r
									"y": 1487\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 302,\r
									"y": 1488\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 252,\r
									"y": 1488\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 298,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 300,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 348,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 85,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 35,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 82,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 80,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 80,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 130,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 80,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 30,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 80,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 85,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 82,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 135,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 190,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 140,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 240,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 488,\r
									"y": 777\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 438,\r
									"y": 777\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 538,\r
									"y": 777\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 157,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 107,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 207,\r
									"y": 174\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 174\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 174\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 174\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 172\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 169\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 258,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 208,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 260,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 262,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 312,\r
									"y": 2\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 263,\r
									"y": 3\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 213,\r
									"y": 3\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 313,\r
									"y": 3\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 590,\r
									"y": 593\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 540,\r
									"y": 593\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 640,\r
									"y": 593\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 917,\r
									"y": 3\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 867,\r
									"y": 3\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 967,\r
									"y": 3\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 918,\r
									"y": 2\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 868,\r
									"y": 2\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 922,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 920,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 972,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1135,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1085,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1138,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1140,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1140,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1190,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1140,\r
									"y": 169\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1090,\r
									"y": 169\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1140,\r
									"y": 172\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x59": {\r
			"id": "glyph-0x59",\r
			"advanceWidth": 1276,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 14,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1231,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1234,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1281,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1018,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 968,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1016,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1014,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1064,\r
									"y": 1488\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1014,\r
									"y": 1487\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 964,\r
									"y": 1487\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1064,\r
									"y": 1487\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 654,\r
									"y": 891\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 604,\r
									"y": 891\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 704,\r
									"y": 891\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 262,\r
									"y": 1488\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 212,\r
									"y": 1488\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 312,\r
									"y": 1488\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 262,\r
									"y": 1488\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 212,\r
									"y": 1488\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 258,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 260,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 308,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1321\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1318\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 145,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 195,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 572,\r
									"y": 657\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 522,\r
									"y": 657\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 622,\r
									"y": 657\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 572,\r
									"y": 171\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 522,\r
									"y": 171\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 622,\r
									"y": 171\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 493,\r
									"y": 171\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 443,\r
									"y": 171\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 490,\r
									"y": 171\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 488,\r
									"y": 166\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 488,\r
									"y": 169\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 538,\r
									"y": 166\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 488,\r
									"y": 2\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 438,\r
									"y": 2\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 488,\r
									"y": -1\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 493,\r
									"y": -3\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 490,\r
									"y": -3\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 543,\r
									"y": -3\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 819,\r
									"y": -3\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 769,\r
									"y": -3\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 822,\r
									"y": -3\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 824,\r
									"y": 2\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 824,\r
									"y": -1\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 874,\r
									"y": 2\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 824,\r
									"y": 166\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 774,\r
									"y": 166\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 824,\r
									"y": 169\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 819,\r
									"y": 171\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 822,\r
									"y": 171\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 869,\r
									"y": 171\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 745,\r
									"y": 171\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 695,\r
									"y": 171\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 795,\r
									"y": 171\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 745,\r
									"y": 687\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 695,\r
									"y": 687\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 795,\r
									"y": 687\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1124,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1074,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1174,\r
									"y": 1316\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1231,\r
									"y": 1316\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1181,\r
									"y": 1316\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1234,\r
									"y": 1316\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1236,\r
									"y": 1321\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1236,\r
									"y": 1318\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1286,\r
									"y": 1321\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1236,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1186,\r
									"y": 1485\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1236,\r
									"y": 1488\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x5A": {\r
			"id": "glyph-0x5A",\r
			"advanceWidth": 1146,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 11,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1101,\r
									"y": 242\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1104,\r
									"y": 242\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1151,\r
									"y": 242\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 933,\r
									"y": 242\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 883,\r
									"y": 242\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 930,\r
									"y": 242\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 928,\r
									"y": 237\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 928,\r
									"y": 240\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 978,\r
									"y": 237\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 928,\r
									"y": 175\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 878,\r
									"y": 175\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 978,\r
									"y": 175\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 334,\r
									"y": 175\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 284,\r
									"y": 175\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 384,\r
									"y": 175\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1086,\r
									"y": 1460\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1036,\r
									"y": 1460\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1136,\r
									"y": 1460\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1086,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1036,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1136,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 86,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 36,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 83,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 81,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 81,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 131,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 81,\r
									"y": 1253\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 31,\r
									"y": 1253\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 81,\r
									"y": 1250\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 86,\r
									"y": 1248\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 83,\r
									"y": 1248\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 136,\r
									"y": 1248\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 255,\r
									"y": 1248\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 205,\r
									"y": 1248\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 258,\r
									"y": 1248\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 260,\r
									"y": 1253\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 260,\r
									"y": 1250\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 310,\r
									"y": 1253\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 260,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 210,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 310,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 793,\r
									"y": 1315\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 743,\r
									"y": 1315\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 843,\r
									"y": 1315\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 41,\r
									"y": 30\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -9,\r
									"y": 30\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 91,\r
									"y": 30\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1101,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1051,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1104,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1106,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1106,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1156,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1106,\r
									"y": 237\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1056,\r
									"y": 237\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1106,\r
									"y": 240\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x61": {\r
			"id": "glyph-0x61",\r
			"advanceWidth": 949,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 7,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 904,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 854,\r
									"y": 165\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 954,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 819,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 769,\r
									"y": 165\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 869,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 820,\r
									"y": 605\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 820,\r
									"y": 571\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 820,\r
									"y": 755\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 356,\r
									"y": 1040\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 858,\r
									"y": 1040\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 232,\r
									"y": 1040\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 67,\r
									"y": 992\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 100,\r
									"y": 1005\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 50,\r
									"y": 985\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 51,\r
									"y": 965\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 48,\r
									"y": 979\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 101,\r
									"y": 965\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 84,\r
									"y": 842\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 34,\r
									"y": 842\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 134,\r
									"y": 842\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 84,\r
									"y": 842\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 34,\r
									"y": 842\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 134,\r
									"y": 842\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 84,\r
									"y": 842\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 34,\r
									"y": 842\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 88,\r
									"y": 825\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 109,\r
									"y": 826\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 96,\r
									"y": 823\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 144,\r
									"y": 834\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 356,\r
									"y": 879\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 240,\r
									"y": 879\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 645,\r
									"y": 879\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 647,\r
									"y": 651\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 647,\r
									"y": 827\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 647,\r
									"y": 645\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 647,\r
									"y": 589\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 647,\r
									"y": 619\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 585,\r
									"y": 639\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 415,\r
									"y": 671\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 505,\r
									"y": 671\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 197,\r
									"y": 671\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 292\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 512\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 184\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 425,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 125,\r
									"y": -20\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 522,\r
									"y": -20\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 669,\r
									"y": 37\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 606,\r
									"y": 7\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 684,\r
									"y": 15\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 737,\r
									"y": 1\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 709,\r
									"y": 1\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 787,\r
									"y": 1\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 904,\r
									"y": 1\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 854,\r
									"y": 1\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 907,\r
									"y": 1\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 909,\r
									"y": 6\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 909,\r
									"y": 3\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 959,\r
									"y": 6\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 909,\r
									"y": 160\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 859,\r
									"y": 160\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 909,\r
									"y": 163\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 904,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 907,\r
									"y": 165\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 954,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -6,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 654,\r
									"y": 212\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 604,\r
									"y": 212\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 654,\r
									"y": 164\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 425,\r
									"y": 117\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 593,\r
									"y": 117\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 355,\r
									"y": 117\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 203,\r
									"y": 293\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 203,\r
									"y": 116\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 203,\r
									"y": 437\r
								}\r
							}\r
						},\r
						{\r
							"type": "symmetric",\r
							"p": {\r
								"coord": {\r
									"x": 415,\r
									"y": 534\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 287,\r
									"y": 534\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 543,\r
									"y": 534\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 654,\r
									"y": 340\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 654,\r
									"y": 458\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 654,\r
									"y": 271\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x62": {\r
			"id": "glyph-0x62",\r
			"advanceWidth": 1085,\r
			"usedIn": [\r
				"glyph-0x64"\r
			],\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 9,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 212,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 162,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 257,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 82\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 293,\r
									"y": 37\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 343,\r
									"y": 82\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 93\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 243,\r
									"y": 93\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 356,\r
									"y": 25\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 590,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 451,\r
									"y": -20\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 893,\r
									"y": -20\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1045,\r
									"y": 384\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1045,\r
									"y": 159\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1095,\r
									"y": 384\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1045,\r
									"y": 589\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 995,\r
									"y": 589\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1095,\r
									"y": 589\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1045,\r
									"y": 589\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 995,\r
									"y": 589\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1044,\r
									"y": 851\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 593,\r
									"y": 1040\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 840,\r
									"y": 1040\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 477,\r
									"y": 1040\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 294,\r
									"y": 915\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 373,\r
									"y": 992\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 344,\r
									"y": 915\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 1408\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 243,\r
									"y": 1408\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 293,\r
									"y": 1453\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 212,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 257,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 262,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1332\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1332\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1329\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1327\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1327\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1327\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 130,\r
									"y": 1327\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 80,\r
									"y": 1327\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 180,\r
									"y": 1327\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 130,\r
									"y": 164\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 80,\r
									"y": 164\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 180,\r
									"y": 164\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 164\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 164\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 164\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 159\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 162\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 159\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -7,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 605\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 243,\r
									"y": 605\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 299,\r
									"y": 776\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 593,\r
									"y": 896\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 439,\r
									"y": 896\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 750,\r
									"y": 896\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 880,\r
									"y": 576\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 880,\r
									"y": 766\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 930,\r
									"y": 576\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 880,\r
									"y": 396\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 830,\r
									"y": 396\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 880,\r
									"y": 155\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 590,\r
									"y": 133\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 663,\r
									"y": 133\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 484,\r
									"y": 133\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 403\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 300,\r
									"y": 179\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 343,\r
									"y": 403\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x70": {\r
			"id": "glyph-0x70",\r
			"advanceWidth": 1090,\r
			"usedIn": [\r
				"glyph-0x71"\r
			],\r
			"contextCharacters": "gpgy",\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 10,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1016\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1016\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1016\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 863\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 863\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 860\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 858\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 858\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 858\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 130,\r
									"y": 858\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 80,\r
									"y": 858\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 130,\r
									"y": 507\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 130,\r
									"y": -265\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 80,\r
									"y": -265\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 180,\r
									"y": -265\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 46,\r
									"y": -265\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -4,\r
									"y": -265\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 43,\r
									"y": -265\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 41,\r
									"y": -270\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 41,\r
									"y": -267\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 91,\r
									"y": -270\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 41,\r
									"y": -424\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -9,\r
									"y": -424\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 41,\r
									"y": -427\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 46,\r
									"y": -429\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 43,\r
									"y": -429\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 96,\r
									"y": -429\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 212,\r
									"y": -429\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 162,\r
									"y": -429\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 257,\r
									"y": -429\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 294,\r
									"y": -347\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 294,\r
									"y": -392\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 344,\r
									"y": -347\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 294,\r
									"y": 99\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 244,\r
									"y": 99\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 356,\r
									"y": 28\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 595,\r
									"y": -19\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 453,\r
									"y": -19\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 898,\r
									"y": -19\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1050,\r
									"y": 385\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1050,\r
									"y": 160\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1100,\r
									"y": 385\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1050,\r
									"y": 589\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1000,\r
									"y": 589\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1049,\r
									"y": 851\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 598,\r
									"y": 1041\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 845,\r
									"y": 1041\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 480,\r
									"y": 1041\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 910\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 372,\r
									"y": 990\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 343,\r
									"y": 910\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 293,\r
									"y": 940\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 243,\r
									"y": 940\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 293,\r
									"y": 985\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 212,\r
									"y": 1021\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 257,\r
									"y": 1021\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 262,\r
									"y": 1021\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1021\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1021\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1021\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1016\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1019\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1016\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -7,\r
					"pathPoints": [\r
						{\r
							"type": "flat",\r
							"p": {\r
								"coord": {\r
									"x": 298,\r
									"y": 417\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 298,\r
									"y": 182\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 298,\r
									"y": 422\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 298,\r
									"y": 595\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 298,\r
									"y": 550\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 298,\r
									"y": 772\r
								}\r
							}\r
						},\r
						{\r
							"type": "symmetric",\r
							"p": {\r
								"coord": {\r
									"x": 598,\r
									"y": 897\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 441,\r
									"y": 897\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 755,\r
									"y": 897\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 885,\r
									"y": 577\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 885,\r
									"y": 767\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 935,\r
									"y": 577\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 885,\r
									"y": 397\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 835,\r
									"y": 397\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 885,\r
									"y": 156\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 595,\r
									"y": 134\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 668,\r
									"y": 134\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 487,\r
									"y": 134\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x64": {\r
			"id": "glyph-0x64",\r
			"advanceWidth": 1085,\r
			"shapes": [\r
				{\r
					"link": "glyph-0x62",\r
					"isFlippedEW": true\r
				}\r
			]\r
		},\r
		"glyph-0x63": {\r
			"id": "glyph-0x63",\r
			"advanceWidth": 898,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 6,\r
					"pathPoints": [\r
						{\r
							"type": "flat",\r
							"p": {\r
								"coord": {\r
									"x": 849,\r
									"y": 272\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 854,\r
									"y": 270\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 824,\r
									"y": 282\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 720,\r
									"y": 331\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 753,\r
									"y": 316\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 717,\r
									"y": 332\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 714,\r
									"y": 327\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 714,\r
									"y": 330\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 714,\r
									"y": 173\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 142\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 585,\r
									"y": 142\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 372,\r
									"y": 142\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 204,\r
									"y": 392\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 204,\r
									"y": 158\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 254,\r
									"y": 392\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 204,\r
									"y": 592\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 154,\r
									"y": 592\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 254,\r
									"y": 592\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 204,\r
									"y": 592\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 154,\r
									"y": 592\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 205,\r
									"y": 767\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 897\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 324,\r
									"y": 897\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 529,\r
									"y": 897\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 897\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 429,\r
									"y": 897\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 529,\r
									"y": 897\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 897\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 429,\r
									"y": 897\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 590,\r
									"y": 897\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 696,\r
									"y": 739\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 670,\r
									"y": 847\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 698,\r
									"y": 729\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 712,\r
									"y": 736\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 705,\r
									"y": 733\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 742,\r
									"y": 750\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 837,\r
									"y": 799\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 801,\r
									"y": 783\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 840,\r
									"y": 800\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 842,\r
									"y": 808\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 844,\r
									"y": 801\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 801,\r
									"y": 949\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 1040\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 670,\r
									"y": 1040\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 529,\r
									"y": 1040\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 1040\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 429,\r
									"y": 1040\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 529,\r
									"y": 1040\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 1040\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 429,\r
									"y": 1040\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 233,\r
									"y": 1040\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 590\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 838\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 590\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 590\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 590\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 590\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 390\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 390\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 390\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 390\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 390\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 41,\r
									"y": 175\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 169,\r
									"y": -20\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 785,\r
									"y": -20\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 858,\r
									"y": 262\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 858,\r
									"y": 205\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 858,\r
									"y": 267\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x71": {\r
			"id": "glyph-0x71",\r
			"advanceWidth": 1090,\r
			"contextCharacters": "gqpgy",\r
			"shapes": [\r
				{\r
					"link": "glyph-0x70",\r
					"isFlippedEW": true\r
				}\r
			]\r
		},\r
		"glyph-0x6F": {\r
			"id": "glyph-0x6F",\r
			"advanceWidth": 959,\r
			"contextCharacters": "bgo",\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 2,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 919,\r
									"y": 592\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 869,\r
									"y": 592\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 918,\r
									"y": 839\r
								}\r
							}\r
						},\r
						{\r
							"type": "symmetric",\r
							"p": {\r
								"coord": {\r
									"x": 480,\r
									"y": 1040\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 725,\r
									"y": 1040\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 235,\r
									"y": 1040\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 41,\r
									"y": 592\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 839\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 91,\r
									"y": 592\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 592\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 592\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 592\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 390\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 390\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 390\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 390\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 390\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 41,\r
									"y": 175\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 480,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 170,\r
									"y": -20\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 530,\r
									"y": -20\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 480,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 430,\r
									"y": -20\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 790,\r
									"y": -20\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 919,\r
									"y": 390\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 918,\r
									"y": 175\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 969,\r
									"y": 390\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 919,\r
									"y": 390\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 869,\r
									"y": 390\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 969,\r
									"y": 390\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 919,\r
									"y": 592\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 869,\r
									"y": 592\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 969,\r
									"y": 592\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -5,\r
					"pathPoints": [\r
						{\r
							"type": "flat",\r
							"p": {\r
								"coord": {\r
									"x": 480,\r
									"y": 142\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 587,\r
									"y": 142\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 430,\r
									"y": 142\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 142\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 429,\r
									"y": 142\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 529,\r
									"y": 142\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 142\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 429,\r
									"y": 142\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 372,\r
									"y": 142\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 204,\r
									"y": 392\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 204,\r
									"y": 158\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 254,\r
									"y": 392\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 204,\r
									"y": 590\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 154,\r
									"y": 590\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 254,\r
									"y": 590\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 205,\r
									"y": 590\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 155,\r
									"y": 590\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 205,\r
									"y": 766\r
								}\r
							}\r
						},\r
						{\r
							"type": "symmetric",\r
							"p": {\r
								"coord": {\r
									"x": 480,\r
									"y": 897\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 324,\r
									"y": 897\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 636,\r
									"y": 897\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 755,\r
									"y": 590\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 755,\r
									"y": 766\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 805,\r
									"y": 590\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 755,\r
									"y": 590\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 705,\r
									"y": 590\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 805,\r
									"y": 590\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 755,\r
									"y": 392\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 705,\r
									"y": 392\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 755,\r
									"y": 158\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x65": {\r
			"id": "glyph-0x65",\r
			"advanceWidth": 932,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": -1,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 429,\r
									"y": -20\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 529,\r
									"y": -20\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 480,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 430,\r
									"y": -20\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 530,\r
									"y": -20\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 480,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 430,\r
									"y": -20\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 714,\r
									"y": -20\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 877,\r
									"y": 155\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 843,\r
									"y": 106\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 886,\r
									"y": 168\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 734,\r
									"y": 244\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 745,\r
									"y": 255\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 680,\r
									"y": 187\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 480,\r
									"y": 142\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 564,\r
									"y": 142\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 530,\r
									"y": 142\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 142\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 429,\r
									"y": 142\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 529,\r
									"y": 142\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": 142\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 429,\r
									"y": 142\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 372,\r
									"y": 142\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 204,\r
									"y": 392\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 204,\r
									"y": 158\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 254,\r
									"y": 392\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 204,\r
									"y": 462\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 154,\r
									"y": 462\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 254,\r
									"y": 462\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 880,\r
									"y": 489\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 830,\r
									"y": 489\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 887,\r
									"y": 489\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 892,\r
									"y": 502\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 892,\r
									"y": 495\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 942,\r
									"y": 502\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 891,\r
									"y": 573\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 841,\r
									"y": 573\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 941,\r
									"y": 573\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 891,\r
									"y": 573\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 841,\r
									"y": 573\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 886,\r
									"y": 887\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 482,\r
									"y": 1040\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 724,\r
									"y": 1040\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 532,\r
									"y": 1040\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 481,\r
									"y": 1040\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 431,\r
									"y": 1040\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 531,\r
									"y": 1040\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 481,\r
									"y": 1040\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 431,\r
									"y": 1040\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 236,\r
									"y": 1040\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 592\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 41,\r
									"y": 839\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 592\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 592\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 592\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 592\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 390\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 390\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 390\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 390\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 390\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 41,\r
									"y": 175\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 479,\r
									"y": -20\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 169,\r
									"y": -20\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 529,\r
									"y": -20\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -6,\r
					"pathPoints": [\r
						{\r
							"type": "flat",\r
							"p": {\r
								"coord": {\r
									"x": 481,\r
									"y": 897\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 335,\r
									"y": 897\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 531,\r
									"y": 897\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 481,\r
									"y": 897\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 431,\r
									"y": 897\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 531,\r
									"y": 897\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 482,\r
									"y": 897\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 432,\r
									"y": 897\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 624,\r
									"y": 897\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 725,\r
									"y": 636\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 711,\r
									"y": 788\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 775,\r
									"y": 636\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 207,\r
									"y": 622\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 157,\r
									"y": 622\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 221,\r
									"y": 781\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x66": {\r
			"id": "glyph-0x66",\r
			"advanceWidth": 771,\r
			"usedIn": [\r
				"liga-f-i",\r
				"liga-f-f-i",\r
				"liga-f-f",\r
				"liga-f-f",\r
				"liga-f-l"\r
			],\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 13,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 381,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 331,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 384,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 386,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 386,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 436,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 386,\r
									"y": 160\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 336,\r
									"y": 160\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 386,\r
									"y": 163\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 381,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 384,\r
									"y": 165\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 431,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 296,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 246,\r
									"y": 165\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 346,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 296,\r
									"y": 855\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 246,\r
									"y": 855\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 346,\r
									"y": 855\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 501,\r
									"y": 855\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 451,\r
									"y": 855\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 504,\r
									"y": 855\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 506,\r
									"y": 860\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 506,\r
									"y": 857\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 556,\r
									"y": 860\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 506,\r
									"y": 1015\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 456,\r
									"y": 1015\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 506,\r
									"y": 1018\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 501,\r
									"y": 1020\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 504,\r
									"y": 1020\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 551,\r
									"y": 1020\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 296,\r
									"y": 1020\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 246,\r
									"y": 1020\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 346,\r
									"y": 1020\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 296,\r
									"y": 1111\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 246,\r
									"y": 1111\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 296,\r
									"y": 1287\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 514,\r
									"y": 1339\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 368,\r
									"y": 1339\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 568,\r
									"y": 1339\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 671,\r
									"y": 1327\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 627,\r
									"y": 1333\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 684,\r
									"y": 1325\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 696,\r
									"y": 1343\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 692,\r
									"y": 1326\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 746,\r
									"y": 1343\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 696,\r
									"y": 1343\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 646,\r
									"y": 1343\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 746,\r
									"y": 1343\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 696,\r
									"y": 1343\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 646,\r
									"y": 1343\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 746,\r
									"y": 1343\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 730,\r
									"y": 1466\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 680,\r
									"y": 1466\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 733,\r
									"y": 1480\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 713,\r
									"y": 1493\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 731,\r
									"y": 1489\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 646,\r
									"y": 1508\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 514,\r
									"y": 1510\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 541,\r
									"y": 1510\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 136,\r
									"y": 1510\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 131,\r
									"y": 1076\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 131,\r
									"y": 1226\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 181,\r
									"y": 1076\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 131,\r
									"y": 1020\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 81,\r
									"y": 1020\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 181,\r
									"y": 1020\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1020\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1020\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1020\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1015\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1018\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1015\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 860\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 860\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 857\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 855\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 855\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 855\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 131,\r
									"y": 855\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 81,\r
									"y": 855\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 181,\r
									"y": 855\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 131,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 81,\r
									"y": 165\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 181,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 165\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 165\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 160\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 163\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 160\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x67": {\r
			"id": "glyph-0x67",\r
			"advanceWidth": 1048,\r
			"contextCharacters": "bgy",\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 8,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1003,\r
									"y": 1020\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 953,\r
									"y": 1020\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1053,\r
									"y": 1020\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 872,\r
									"y": 1020\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 822,\r
									"y": 1020\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 849,\r
									"y": 1020\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 814,\r
									"y": 991\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 828,\r
									"y": 1009\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 864,\r
									"y": 991\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 781,\r
									"y": 947\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 731,\r
									"y": 947\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 704,\r
									"y": 1005\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 505,\r
									"y": 1040\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 609,\r
									"y": 1040\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 249,\r
									"y": 1040\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 571\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 830\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 471\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 130,\r
									"y": 319\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 71,\r
									"y": 385\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 85,\r
									"y": 272\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 59,\r
									"y": 162\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 59,\r
									"y": 211\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 59,\r
									"y": 58\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 348,\r
									"y": -100\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 118,\r
									"y": -100\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 546,\r
									"y": -100\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 773,\r
									"y": -44\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 661,\r
									"y": -44\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 803,\r
									"y": -44\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 796,\r
									"y": -79\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 796,\r
									"y": -58\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 796,\r
									"y": -272\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 425,\r
									"y": -287\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 708,\r
									"y": -287\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 373,\r
									"y": -287\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 228,\r
									"y": -271\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 267,\r
									"y": -278\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 222,\r
									"y": -270\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 214,\r
									"y": -279\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 216,\r
									"y": -273\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 264,\r
									"y": -279\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 176,\r
									"y": -418\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 126,\r
									"y": -418\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 174,\r
									"y": -425\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 185,\r
									"y": -433\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 178,\r
									"y": -432\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 249,\r
									"y": -447\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 425,\r
									"y": -450\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 365,\r
									"y": -450\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 907,\r
									"y": -450\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 956,\r
									"y": -44\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 956,\r
									"y": -259\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 956,\r
									"y": 32\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 801,\r
									"y": 137\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 947,\r
									"y": 137\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 677,\r
									"y": 137\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 382,\r
									"y": 67\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 545,\r
									"y": 67\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 249,\r
									"y": 67\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 210,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 210,\r
									"y": 103\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 210,\r
									"y": 191\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 242,\r
									"y": 236\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 223,\r
									"y": 217\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 315,\r
									"y": 199\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 505,\r
									"y": 180\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 405,\r
									"y": 180\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 633,\r
									"y": 180\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 824,\r
									"y": 270\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 743,\r
									"y": 211\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 919,\r
									"y": 340\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 969,\r
									"y": 571\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 969,\r
									"y": 444\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 969,\r
									"y": 670\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 887,\r
									"y": 838\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 939,\r
									"y": 762\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 937,\r
									"y": 838\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 899,\r
									"y": 857\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 849,\r
									"y": 857\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 949,\r
									"y": 857\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1003,\r
									"y": 857\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 953,\r
									"y": 857\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1006,\r
									"y": 857\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1008,\r
									"y": 862\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1008,\r
									"y": 859\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1058,\r
									"y": 862\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1008,\r
									"y": 1015\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 958,\r
									"y": 1015\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1008,\r
									"y": 1018\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1003,\r
									"y": 1020\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1006,\r
									"y": 1020\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1053,\r
									"y": 1020\r
								},\r
								"use": false\r
							}\r
						}\r
					]\r
				},\r
				{\r
					"name": "Path 2",\r
					"winding": -5,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 209,\r
									"y": 568\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 209,\r
									"y": 343\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 209,\r
									"y": 751\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 505,\r
									"y": 901\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 342,\r
									"y": 901\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 668,\r
									"y": 901\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 800,\r
									"y": 568\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 800,\r
									"y": 751\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 800,\r
									"y": 343\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 505,\r
									"y": 319\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 594,\r
									"y": 319\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 416,\r
									"y": 319\r
								}\r
							}\r
						}\r
					]\r
				}\r
			]\r
		},\r
		"glyph-0x68": {\r
			"id": "glyph-0x68",\r
			"advanceWidth": 1088,\r
			"shapes": [\r
				{\r
					"name": "Path 1",\r
					"winding": 14,\r
					"pathPoints": [\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 1043,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 1046,\r
									"y": 165\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1093,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 983,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 933,\r
									"y": 165\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1033,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 983,\r
									"y": 635\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 933,\r
									"y": 635\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 1033,\r
									"y": 635\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 983,\r
									"y": 635\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 933,\r
									"y": 635\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 983,\r
									"y": 860\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 536,\r
									"y": 1039\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 839,\r
									"y": 1039\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 434,\r
									"y": 1039\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 295,\r
									"y": 975\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 355,\r
									"y": 1015\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 345,\r
									"y": 975\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 295,\r
									"y": 1408\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 245,\r
									"y": 1408\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 295,\r
									"y": 1453\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 213,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 258,\r
									"y": 1490\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 263,\r
									"y": 1490\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1490\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 1490\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1490\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1485\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1488\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 1485\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1330\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 1330\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 1327\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 1325\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 1325\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 1325\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 130,\r
									"y": 1325\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 80,\r
									"y": 1325\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 180,\r
									"y": 1325\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 130,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 80,\r
									"y": 165\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 180,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -5,\r
									"y": 165\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 42,\r
									"y": 165\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 160\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 40,\r
									"y": 163\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 90,\r
									"y": 160\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 40,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": -10,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 40,\r
									"y": 2\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 45,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 42,\r
									"y": 0\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 95,\r
									"y": 0\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 357,\r
									"y": 0\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 307,\r
									"y": 0\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 360,\r
									"y": 0\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 362,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 362,\r
									"y": 2\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 412,\r
									"y": 5\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 362,\r
									"y": 160\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 312,\r
									"y": 160\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 362,\r
									"y": 163\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 357,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 360,\r
									"y": 165\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 407,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 295,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 245,\r
									"y": 165\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 345,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 295,\r
									"y": 791\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 245,\r
									"y": 791\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 366,\r
									"y": 875\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 536,\r
									"y": 894\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 482,\r
									"y": 894\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 574,\r
									"y": 894\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 816,\r
									"y": 635\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 816,\r
									"y": 876\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 866,\r
									"y": 635\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 816,\r
									"y": 635\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 766,\r
									"y": 635\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 866,\r
									"y": 635\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 816,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 766,\r
									"y": 165\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 866,\r
									"y": 165\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 731,\r
									"y": 165\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 681,\r
									"y": 165\r
								},\r
								"use": false\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 728,\r
									"y": 165\r
								}\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 726,\r
									"y": 160\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 726,\r
									"y": 163\r
								}\r
							},\r
							"h2": {\r
								"coord": {\r
									"x": 776,\r
									"y": 160\r
								},\r
								"use": false\r
							}\r
						},\r
						{\r
							"type": "corner",\r
							"p": {\r
								"coord": {\r
									"x": 726,\r
									"y": 5\r
								}\r
							},\r
							"h1": {\r
								"coord": {\r
									"x": 676,\r
									"y": 5\r
								},\r
								"use": false\r
							},\r