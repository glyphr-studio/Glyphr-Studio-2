const yE=Object.freeze(Object.defineProperty({__proto__:null,get ComponentInstance(){return hn}},Symbol.toStringTag,{value:"Module"}));(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=r(a);fetch(a.href,i)}})();function y({tag:t="span",className:e="",id:r="",content:n="",title:a="",tabIndex:i=!1,attributes:s={},style:l=!1,innerHTML:E="",onClick:T,doc:h}={}){if(h||(h=document),!h.createElement)return console.warn("no document or createElement"),console.warn(h),new HTMLElement;const u=h.createElement(t);if(e&&u.setAttribute("class",e),r&&u.setAttribute("id",r),n&&(u.innerHTML=n),a&&u.setAttribute("title",a),i===!0?u.setAttribute("tabIndex","0"):i!==!1&&u.setAttribute("tabIndex",i),Object.keys(s).forEach(C=>u.setAttribute(C,s[C])),l&&u.setAttribute("style",l),E){const C=document.createElement("template");C.innerHTML=E,u.appendChild(C.content)}return T&&typeof T=="function"&&u.addEventListener("click",T),u}function ie(t,e=[]){Array.isArray(e)?e.forEach(r=>{Array.isArray(r)?ie(t,r):t.appendChild(r)}):t.appendChild(e)}function xe(t=""){let e=y();return e.innerHTML=t,e.firstElementChild}function Ea(t,e){t!=null&&t.parentNode&&e&&t.parentNode.insertBefore(e,t.nextSibling)}const mE="*{box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:var(--global-transition)}:host{margin-right:8px;display:inline-block;width:max-content;min-width:40px;--fancy-gradient: linear-gradient( 135deg, var(--blue-l55), var(--purple-l45), var(--orange-l50), var(--purple-l45), var(--blue-l55), var(--purple-l45) );--fancy-animation: gradFade 120s linear infinite;--fancy-background-size: 500% 500%}@keyframes gradFade{0%{background-position:0% 0%}to{background-position:100% 100%}}:host(:active) .wrapper{top:1px;left:1px;box-shadow:none}:host([disabled]:active) .wrapper{top:0;left:0}.wrapper{display:inline-block;position:relative;top:0;left:0;margin:0;padding:2px;height:100%;width:100%;border-style:solid;border-width:0px;border-radius:5px;animation:var(--fancy-animation);box-shadow:var(--l2-shadow);background:var(--fancy-gradient);background-size:var(--fancy-background-size)}.wrapper:hover,.wrapper *:hover,.wrapper:focus,.wrapper *:focus{cursor:pointer}.wrapper:focus{outline:var(--global-focus-style)}.buttonContent{display:flex;align-items:center;padding:0;border-radius:3px;background-color:transparent;width:100%;height:100%}.buttonText{display:inline-block;width:max-content;height:max-content;margin:5px 10px;color:#fff;animation:var(--fancy-animation);background-color:transparent}.wrapper[secondary] .buttonContent{background-color:#fffffff2}.wrapper[secondary] .buttonText{background:var(--fancy-gradient);background-size:var(--fancy-background-size);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.wrapper:hover .buttonContent,.wrapper:active .buttonContent{background-color:#ffffff1a}.wrapper[secondary]:hover .buttonContent,.wrapper[secondary]:active .buttonContent{background-color:#fff}.wrapper[minimal]{padding:1px;box-shadow:var(--l1-shadow);background:linear-gradient(135deg,var(--blue-l85),var(--blue-l90));animation:var(--fancy-animation)}.wrapper[minimal] .buttonContent{background-color:#fffffff2}.wrapper[minimal] .buttonText{background:linear-gradient(135deg,var(--blue-l70),var(--blue-l90));background-size:var(--fancy-background-size);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.wrapper[minimal]:hover,.wrapper[minimal]:active{box-shadow:var(--l2-shadow);background:linear-gradient(135deg,var(--blue-l65),var(--blue-l70))}.wrapper[minimal]:hover .buttonContent,.wrapper[minimal]:active .buttonContent{background-color:#fff}.wrapper[minimal]:hover .buttonText,.wrapper[minimal]:active .buttonText{background:linear-gradient(135deg,var(--blue-l40),var(--blue-l70));background-size:var(--fancy-background-size);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.wrapper[danger]{background:linear-gradient(135deg,var(--orange-l50),var(--red));animation:var(--fancy-animation)}.wrapper[danger] .buttonText{background:#fff;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.wrapper[secondary][danger] .buttonText{background:var(--red);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.wrapper[disabled],.wrapper[disabled]:hover,.wrapper[disabled]:focus,.wrapper[disabled]:active{background-image:none;background-color:var(--disabled-border);cursor:default;box-shadow:none}.wrapper[disabled] .buttonContent,.wrapper[disabled]:hover .buttonContent,.wrapper[disabled]:focus .buttonContent,.wrapper[disabled]:active .buttonContent{background-color:var(--disabled-background);cursor:default}.wrapper[disabled] .buttonText,.wrapper[disabled]:hover .buttonText,.wrapper[disabled]:focus .buttonText,.wrapper[disabled]:active .buttonText{background-color:var(--disabled-background);background-clip:none;-webkit-text-fill-color:var(--disabled-border);color:var(--disabled-border);cursor:default}";class fE extends HTMLElement{constructor(e={}){super(),Object.keys(e).forEach(a=>this.setAttribute(a,e[a])),this.wrapper=y({className:"wrapper"}),this.buttonContent=y({className:"buttonContent"}),this.buttonText=y({tag:"slot",className:"buttonText"}),this.hasAttribute("secondary")&&this.wrapper.setAttribute("secondary",""),this.hasAttribute("danger")&&this.wrapper.setAttribute("danger",""),this.hasAttribute("minimal")&&this.wrapper.setAttribute("minimal",""),this.hasAttribute("disabled")?(this.wrapper.setAttribute("disabled",""),this.disabled=!0):(this.wrapper.setAttribute("tabIndex","0"),this.disabled=!1);let r=this.attachShadow({mode:"open"}),n=y({tag:"style",innerHTML:mE});r.appendChild(n),this.buttonContent.appendChild(this.buttonText),this.wrapper.appendChild(this.buttonContent),r.appendChild(this.wrapper),this.disabled||this.addEventListener("keydown",this.keyPress)}static get observedAttributes(){return["disabled","secondary","danger","minimal"]}attributeChangedCallback(e,r,n){this.wrapper&&(e==="disabled"&&(n===""?this.wrapper.setAttribute("disabled",""):r===""&&this.wrapper.removeAttribute("disabled")),e==="secondary"&&(n===""?this.wrapper.setAttribute("secondary",""):r===""&&this.wrapper.removeAttribute("secondary")),e==="danger"&&(n===""?this.wrapper.setAttribute("danger",""):r===""&&this.wrapper.removeAttribute("danger")),e==="minimal"&&(n===""?this.wrapper.setAttribute("minimal",""):r===""&&this.wrapper.removeAttribute("minimal")))}keyPress(e){if(e.keyCode===13){let r=new MouseEvent("click",{shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,altKey:e.altKey,metaKey:e.metaKey});this.dispatchEvent(r),this.flashAsPressed(this)}}flashAsPressed(e){e.wrapper.style.top="1px",e.wrapper.style.left="1px",e.wrapper.style.boxShadow="none",setTimeout(function(){e.wrapper.style.top="0px",e.wrapper.style.left="0px",e.wrapper.style.boxShadow="2px 2px 2px rgba(0, 0, 0, 0.3)"},100)}}function Kr(t={}){const e=Object.keys(t);return e.length?e[0]:!1}function E1(t,e="id"){let r=1,n=""+e+r;for(;t[n];)r+=1,n=""+e+r;return n}function Gt(t){return Object.keys(t).length}function Er(t){try{return structuredClone(t)}catch{const r=Array.isArray(t)?[]:{};for(const n of Object.keys(t))t[n]&&typeof t[n]=="object"&&n!=="parent"&&n!=="cache"?r[n]=Er(t[n]):r[n]=t[n];return r}}function Ka(t,e){if(t=Er(t),e)return JSON.stringify(t);{let r=JSON.stringify(t,void 0,2);return r=r||"",r=r.replace(/\n/g,`\r
`),r=r.replaceAll(`\r
                  "`,'"'),r=r.replaceAll(`\r
                }`,"}"),r=r.replaceAll(`\r
                "`,'"'),r=r.replaceAll(`\r
              }`,"}"),r=r.replaceAll('},"','}, "'),r}}function c1(t,e){if(typeof t!="object"&&typeof e!="object")return t===e;for(const r of Object.keys(t))if(e[r]){if(typeof t[r]=="object"&&typeof e[r]=="object"){if(!c1(t[r],e[r]))return!1}else if(t[r]!==e[r])return!1}else return!1;return!0}function yt(t,e,r=1){return isNaN(t.x)||isNaN(t.y)||isNaN(e.x)||isNaN(e.y)?!1:!!(t.x===e.x&&t.y===e.y||T0(t.x,e.x,r)&&T0(t.y,e.y,r))}function T0(t,e,r=1){return isNaN(t)||isNaN(e)?!1:t===e||Math.abs(t-e)<=r}function ft(t,e=!1){const r=e?1:-1;return oe(t)+.5*r}function oe(t,e=0){return t&&+(Math.round(+`${t}e${e}`)+`e-${e}`)||0}function Ar(t){t=He(t);const e=""+t;return(e.indexOf("0000")>-1||e.indexOf("9999")>-1)&&(t=oe(t,3)),t<1e-5&&t>0&&(t=0),t}function h1(t){return t=parseFloat(t),!(isNaN(t)||t!==Math.round(t))}function He(t=0){let e=+t;return isNaN(e)?0:e}function V0(t=""){return t=String(t),t.replace(/[<>'"\\]/g,"")}function z0(t=""){if(t=String(t),t==='""'||t==="''")return"";try{return t=t.replace(/^\s+|\s+$/g,""),t.replace(/(\r\n|\n|\r|\t)/gm,"")}catch{return""}}function mr(t="",e=""){return t=String(t),t=t.split(e).join(""),t||""}function L1(t=""){let e="";for(let r=0;r<t.length;r++){let n=t.charCodeAt(r);n<=90&&n>=65&&(e+="-"),e+=t.charAt(r).toLowerCase()}return e}function Ui(t=""){let e="";for(let r=0;r<t.length;r++)t.charAt(r)==="-"?(r++,e+=t.charAt(r).toUpperCase()):e+=t.charAt(r);return e}function T1(t=""){if(typeof t=="string"){if(t==='""'||t==="''")return"";t.indexOf("&")>-1&&(t=t.replace(/&/g,"&amp;")),t.indexOf('"')>-1&&(t=t.replace(/"/g,"&quot;")),t.indexOf("'")>-1&&(t=t.replace(/'/g,"&apos;")),t.indexOf("<")>-1&&(t=t.replace(/</g,"&lt;")),t.indexOf(">")>-1&&(t=t.replace(/>/g,"&gt;"))}return t}function pt(t){return t===0||t===!1?!0:t==null||typeof t=="object"&&Object.keys(t).length===0?!1:!!t}function So(t){if(!t)return!0;for(const e of Object.keys(t))if(!pt(t[e])||t[e]===Number.MAX_SAFE_INTEGER||t[e]===Number.MIN_SAFE_INTEGER)return!0;return!1}function kn(t,e,r){return r.indexOf(t)===e}function Ia(t=10){return new Promise(e=>{setTimeout(()=>{e("fast")},t)})}const ti=["top-left","middle-left","baseline-left","bottom-left","top-center","middle-center","baseline-center","bottom-center","top-right","middle-right","baseline-right","bottom-right"];function J0(t=0,e=0,r,n="baseline-left"){(n===!1||ti.indexOf(""+n)<0)&&(n="baseline-left"),n=""+n;let a={deltaX:0,deltaY:0};if(e!==0&&(n.includes("top")&&(a.deltaY=e*-1),n.includes("middle")&&(a.deltaY=e/-2),n.includes("baseline"))){let i=(e+r.height)/r.height,s=r.yMax*i,l=(r.yMax-s)*-1;a.deltaY=l-e}return t!==0&&(n.includes("right")&&(a.deltaX=t*-1),n.includes("center")&&(a.deltaX=t/-2)),a}function gn(t,e={x:0,y:0}){let r=Math.atan2(t.y-e.y,t.x-e.x);return isNaN(r)&&(console.warn(`calculateAngle returned NaN
`+Ka(t)+`

Item does not exist yet, click to create`),s==="new"&&(l=`

Item was created, but has not yet been edited`),s==="changed"&&(l=`

Item was recently edited`),this.hasAttribute("selected")&&this.wrapper.setAttribute("selected",""),this.glyph&&this.glyph.hasChangedThisSession===!0?(this.setAttribute("title",`${a}
${r}${l}`),this.thumbnail=y({tag:"span",className:"thumbnail"}),this.thumbnail.width=i,this.thumbnail.height=i):(this.setAttribute("title",`${a}
${r}${l}`),this.thumbnail=y({className:"thumbnail"}),FE(mr(r,"glyph-"))?this.thumbnail.innerHTML=`
					<div class="whitespace-char-thumbnail">white space</div>
				`:n?this.thumbnail.innerHTML=n:this.thumbnail.innerHTML=`
						<div class="whitespace-char-thumbnail">${r}</div>
					`),this.name=y({className:"name"}),n?this.name.innerHTML=r==="glyph-0x20"?"Space":n:this.name.innerHTML=a.replaceAll("Component ","comp-");const E=this.attachShadow({mode:"open"}),T=y({tag:"style",innerHTML:bE});E.appendChild(T),this.wrapper.appendChild(this.thumbnail),this.wrapper.appendChild(this.name),E.appendChild(this.wrapper),this.redraw()}attributeChangedCallback(){const e=this.shadowRoot?this.shadowRoot.querySelector(".wrapper"):!1;e&&(this.hasAttribute("selected")?e.setAttribute("selected",""):e.removeAttribute("selected"))}redraw(){var e,r;(r=(e=this.glyph)==null?void 0:e.shapes)!=null&&r.length&&(this.thumbnail.innerHTML=this.project.makeItemThumbnail(this.glyph))}}const Lt={gray:{l97:"hsl(200, 81%, 97%)",l95:"hsl(200, 81%, 94%)",l90:"hsl(200, 60%, 88%)",l85:"hsl(200, 52%, 82%)",l80:"hsl(200, 47%, 76%)",l75:"hsl(200, 42%, 71%)",l70:"hsl(200, 33%, 65%)",l65:"hsl(200, 27%, 60%)",l60:"hsl(200, 22%, 55%)",l55:"hsl(200, 18%, 50%)",l50:"hsl(200, 17%, 45%)",l45:"hsl(200, 17%, 40%)",l40:"hsl(200, 18%, 36%)",l35:"hsl(200, 18%, 31%)",l30:"hsl(200, 17%, 27%)",l25:"hsl(200, 18%, 23%)",l20:"hsl(200, 18%, 19%)",l15:"hsl(200, 17%, 15%)",l10:"hsl(200, 19%, 11%)",l05:"hsl(200, 18%, 7%)"},blue:{l95:"hsl(200, 100%, 94%)",l90:"hsl(200, 94%, 87%)",l85:"hsl(200, 100%, 80%)",l80:"hsl(200, 100%, 73%)",l75:"hsl(200, 100%, 64%)",l70:"hsl(200, 100%, 58%)",l65:"hsl(200, 100%, 49%)",l60:"hsl(200, 100%, 45%)",l55:"hsl(200, 100%, 41%)",l50:"hsl(200, 100%, 37%)",l45:"hsl(200, 100%, 33%)",l40:"hsl(200, 100%, 30%)",l35:"hsl(200, 100%, 25%)",l30:"hsl(200, 100%, 22%)",l25:"hsl(200, 100%, 19%)",l20:"hsl(200, 100%, 15%)",l15:"hsl(200, 100%, 12%)",l10:"hsl(200, 100%, 9%)",l05:"hsl(200, 100%, 6%)"},orange:{l95:"hsl(20, 100%, 95%)",l90:"hsl(20, 100%, 89%)",l85:"hsl(20, 100%, 84%)",l80:"hsl(20, 100%, 78%)",l75:"hsl(20, 100%, 72%)",l70:"hsl(20, 100%, 66%)",l65:"hsl(20, 100%, 56%)",l60:"hsl(20, 100%, 50%)",l55:"hsl(20, 100%, 46%)",l50:"hsl(20, 100%, 42%)",l45:"hsl(20, 100%, 37%)",l40:"hsl(20, 100%, 33%)",l35:"hsl(20, 100%, 29%)",l30:"hsl(20, 100%, 25%)",l25:"hsl(20, 100%, 22%)",l20:"hsl(20, 100%, 17%)",l15:"hsl(20, 100%, 14%)",l10:"hsl(20, 100%, 10%)",l05:"hsl(20, 100%, 6%)"},green:{l95:"hsl(125, 100%, 82%)",l90:"hsl(125, 97%, 74%)",l85:"hsl(125, 83%, 66%)",l80:"hsl(125, 74%, 58%)",l75:"hsl(125, 67%, 50%)",l70:"hsl(125, 82%, 43%)",l65:"hsl(125, 100%, 36%)",l60:"hsl(125, 100%, 33%)",l55:"hsl(125, 100%, 30%)",l50:"hsl(125, 100%, 27%)",l45:"hsl(125, 100%, 24%)",l40:"hsl(125, 95%, 22%)",l35:"hsl(125, 100%, 19%)",l30:"hsl(125, 100%, 16%)",l25:"hsl(125, 100%, 14%)",l20:"hsl(125, 100%, 11%)",l15:"hsl(125, 100%, 9%)",l10:"hsl(125, 100%, 6%)",l05:"hsl(125, 100%, 4%)"},purple:{l95:"hsl(285, 100%, 96%)",l90:"hsl(285, 100%, 92%)",l85:"hsl(285, 100%, 89%)",l80:"hsl(285, 100%, 85%)",l75:"hsl(285, 100%, 81%)",l70:"hsl(285, 100%, 77%)",l65:"hsl(285, 100%, 72%)",l60:"hsl(285, 100%, 66%)",l55:"hsl(285, 100%, 61%)",l50:"hsl(285, 100%, 50%)",l45:"hsl(285, 100%, 45%)",l40:"hsl(285, 100%, 40%)",l35:"hsl(285, 100%, 36%)",l30:"hsl(285, 100%, 31%)",l25:"hsl(285, 100%, 27%)",l20:"hsl(285, 100%, 22%)",l15:"hsl(285, 100%, 17%)",l10:"hsl(285, 100%, 13%)",l05:"hsl(285, 100%, 10%)"}},vs=Lt.blue.l65,xn={accent:vs,offWhite:"hsl(200, 81%, 97%)",darkRed:"hsl(0, 100%, 23%)",red:"hsl(0, 100%, 48%)",lightRed:"hsl(0, 100%, 90%)",enabled:{resting:{text:"hsl(0, 0%, 5%)",lightText:"hsl(0, 0%, 10%)",border:"hsl(0, 0%, 75%)",fill:"hsl(0, 0%, 39%)",background:"hsl(0, 0%, 98%)"},restingLight:{text:"hsl(0, 0%, 20%)",lightText:"hsl(0, 0%, 30%)",border:"hsla(0, 0%, 75%, 0.2)",fill:"hsl(0, 0%, 39%, 0.4)",background:"hsl(0, 0%, 98%)"},focus:{text:"hsl(0, 0%, 0%)",lightText:"hsl(0, 0%, 10%)",border:"hsl(0, 0%, 63%)",fill:"hsl(200, 25%, 15%)",background:"white"},active:{text:"hsl(0, 0%, 0%)",lightText:"hsl(0, 0%, 10%)",border:"hsl(0, 0%, 63%)",fill:vs,background:"white"}},disabled:{text:"hsl(0, 0%, 40%)",border:"hsl(0, 0%, 82%)",fill:"hsl(0, 0%, 82%)",background:"hsl(0, 0%, 94%)"}};function ri(t){const e={r:0,g:0,b:0,a:1};if(typeof t!="string")return e;if(t.charAt(0)==="#")t=t.substring(1,7),e.r=parseInt(t.substring(0,2),16),e.g=parseInt(t.substring(2,4),16),e.b=parseInt(t.substring(4,6),16);else if(t.substring(0,4)==="rgb("){let r=t.split("(")[1].split(")")[0].split(",");e.r=parseInt(r[0],10),e.g=parseInt(r[1],10),e.b=parseInt(r[2],10),e.a=parseInt(r[3],10)||1}return e}function I0(t){let e=ri(t),r=e.r.toString(16).toUpperCase();r.length===1&&(r=`0${r}`);let n=e.g.toString(16).toUpperCase();n.length===1&&(n=`0${n}`);let a=e.b.toString(16).toUpperCase();return a.length===1&&(a=`0${a}`),`#${r}${n}${a}`}function PE(t,e,r){e=Math.max(0,Math.min(e,1));const n=ri(t);return n.r=Math.max(0,Math.min(n.r,255)),n.g=Math.max(0,Math.min(n.g,255)),n.b=Math.max(0,Math.min(n.b,255)),r?(n.r=oe((255-n.r)*e+n.r),n.g=oe((255-n.g)*e+n.g),n.b=oe((255-n.b)*e+n.b)):(n.r=oe(n.r-n.r*e),n.g=oe(n.g-n.g*e),n.b=oe(n.b-n.b*e)),`rgb(${n.r},${n.g},${n.b})`}function Fr(t,e){const r=ri(t),n=oe((255-r.r)*(1-e)),a=oe((255-r.g)*(1-e)),i=oe((255-r.b)*(1-e)),s=r.r+n,l=r.g+a,E=r.b+i;return`rgb(${s},${l},${E})`}function Nn(t){const e=parseInt(t);return!e||isNaN(e)?1:e>100?0:e<0?1:(100-e)/100}function D1(){const t=Math.floor(Math.random()*5)*51,e=[],r=Math.floor(Math.random()*3);switch(e[r]=t,r){case 0:e[1]=0,e[2]=255;break;case 1:e[0]=0,e[2]=255;break;case 2:e[0]=255,e[1]=0;break}return"rgb("+e[0]+","+e[1]+","+e[2]+")"}const vE=Object.freeze(Object.defineProperty({__proto__:null,accentColors:Lt,getColorFromRGBA:Fr,makeRandomSaturatedColor:D1,parseColorString:ri,rgbToHex:I0,shiftColor:PE,transparencyToAlpha:Nn,uiColors:xn},Symbol.toStringTag,{value:"Module"}));let Je={};function Dn(t){let e=20;t.name&&t.name.indexOf("page_")===0&&(e=24),t.name&&t.name.indexOf("panel_")===0&&(e=24);let r=t.color||"rgb(76,81,86)",n="";return Je[t.name]&&(Je[t.name].outline?n=Je[t.name].outline:n=Je[t.name]),`
		<svg version="1.1"
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px" y="0px" width="${e}px" height="${e}px" viewBox="0 0 ${e} ${e}"
		>
			<defs></defs>
			<rect fill="transparent" width="${e}" height="${e}"/>
			<g pointer-events="none" fill="${r}">
				${n}
			</g>
		</svg>
	`}Je.panel_layers=`
	<polygon points="12 9 0 4.574 12 0 24 4.5 12 9"/>
	<polygon points="12 14 0 9.5 4 8 12 11 20 8 24 9.5 12 14"/>
	<polygon points="12 19 0 14.5 4 13 12 16 20 13 24 14.5 12 19"/>
	<polygon points="12 24 0 19.5 4 18 12 21 20 18 24 19.5 12 24"/>
`;Je.panel_guides=`
	<polygon points="2 17 5 20 5 17 2 17"/>
	<polygon points="24 22 0 22 0 23 24 23 24 22 24 22"/>
	<polygon points="24 7 0 7 0 8 24 8 24 7 24 7"/>
	<polygon points="24 3 0 3 0 3.5 24 3.5 24 3 24 3"/>
	<polygon points="24 1 0 1 0 2 24 2 24 1 24 1"/>
	<polygon points="24 15 0 15 0 17 24 17 24 15 24 15"/>
	<polygon points="7 0 5 0 5 24 7 24 7 0 7 0"/>
	<polygon points="22.5 0 22 0 22 24 22.5 24 22.5 0 22.5 0"/>
`;Je.panel_contextCharacters=`
	<path d="m8.942,16.997h-2.672v-.55c-.412.432-.882.647-1.407.647-.53,0-.973-.213-1.329-.64s-.534-.966-.534-1.621c0-.668.193-1.221.578-1.661s.875-.66,1.469-.66c.412,0,.82.141,1.224.424v-.737c0-.375-.047-.641-.139-.796s-.259-.233-.5-.233c-.322,0-.544.181-.666.542l-1.829-.383c.539-1.006,1.455-1.508,2.747-1.508.752,0,1.344.179,1.775.535s.646.879.646,1.569v3.57h.639v1.502Zm-2.672-1.801v-1.052c-.172-.216-.367-.324-.585-.324-.2,0-.358.083-.476.252-.118.168-.177.392-.177.669,0,.272.055.482.167.63s.264.221.459.221c.24,0,.444-.132.612-.397Z"/>
	<path d="m9.547,16.997v-1.502h.666v-6.995h-.666v-1.502h2.699v3.651h.027c.299-.496.727-.745,1.285-.745.594,0,1.068.292,1.424.876s.534,1.432.534,2.545c0,1.214-.171,2.146-.513,2.795s-.828.973-1.458.973c-.499,0-.931-.218-1.299-.657v.559h-2.699Zm2.699-3.987v1.416c0,.394.042.686.126.878.084.191.232.288.445.288.249,0,.409-.147.479-.441s.105-.843.105-1.648c0-.726-.04-1.23-.119-1.509-.079-.28-.239-.42-.479-.42-.213,0-.359.109-.439.326s-.119.587-.119,1.11Z"/>
	<path d="m19.429,14.229l1.571.598c-.258,1.581-1.079,2.371-2.461,2.371-.834,0-1.49-.334-1.968-1.001s-.717-1.587-.717-2.76c0-1.057.207-1.909.622-2.559s.958-.973,1.628-.973c.644,0,1.077.29,1.299.869h.027v-.757h1.462v2.823h-1.462c-.032-.505-.11-.878-.235-1.12-.125-.241-.312-.362-.561-.362-.263,0-.44.159-.53.476s-.136.85-.136,1.6c0,.819.044,1.401.133,1.746s.296.517.622.517c.227,0,.392-.118.496-.354s.174-.608.211-1.113Z"/>
	<path d="m18,4v-1h4v-1h-5v2h-1V0h-8v4h-1v-2H2v1h4v1H0v16h6v1H2v1h5v-2h1v4h8v-4h1v2h5v-1h-4v-1h6V4h-6ZM9,1h6v3h-6V1Zm6,22h-6v-3h6v3Zm7-5H2V6h20v12Z"/>
`;Je.panel_history=`
	<path d="m19.075,18.133l-.021.022c-.181.185-.478.189-.663.008l-5.229-5.102c-.185-.181.491-.874.676-.693l5.229,5.102c.185.181.189.478.008.663Z"/>
	<path d="m16.1,9.358l.022.021c.185.181.189.478.008.663l-2.291,2.348c-.181.185-.874-.491-.693-.676l2.291-2.348c.181-.185.478-.189.663-.008Z"/>
	<circle cx="13.165" cy="12.387" r="1.033"/>
	<path d="m19.551,5.842c.149.145.282.3.418.452l1.747-1.747c-.146-.159-.283-.322-.439-.475-2.259-2.204-5.187-3.302-8.112-3.302-3.021,0-6.039,1.171-8.315,3.504-2.196,2.251-3.287,5.166-3.295,8.08h2.475c.008-2.294.865-4.587,2.589-6.354,1.736-1.779,4.06-2.758,6.546-2.758,2.4,0,4.667.923,6.386,2.6Z"/>
	<path d="m1.608,11.33H.2l2.609,4.174,2.609-4.174h-1.166c-.954-.008-1.986-.008-2.644,0Z"/>
	<path d="m21.916,6.021l-.736.736c1.133,1.605,1.769,3.503,1.794,5.509.032,2.62-.958,5.096-2.788,6.971-1.862,1.908-4.355,2.959-7.022,2.959-2.574,0-5.007-.99-6.85-2.788-1.066-1.041-1.855-2.286-2.353-3.645l-.677,1.084c.541,1.201,1.309,2.324,2.309,3.3,2.108,2.057,4.841,3.082,7.571,3.082,2.819,0,5.636-1.093,7.761-3.27,3.747-3.841,4.05-9.742.991-13.938Z"/>
`;Je.panel_attributes=`
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
`;Je.panel_view=`
	<circle cx="12" cy="13" r="4"/>
	<path d="m24,13h-2v-1c0-3.237-4.368-7-10-7S2,8.763,2,12v1H0v-1C0,7.29,5.72,3,12,3s12,4.29,12,9v1Z"/>
`;Je.command_save=`
	<path d="M0,0V17.22l2.78,2.78H20V0H0ZM5,1H15V10H5V1Zm2,18v-3h1v3h-1Zm2,0v-3h5v3h-5ZM19,3h-1v1h1v15h-4v-4H6v4H3.5l-2.5-2.5V1h3V11h12V1h3V3Z"/>
`;Je.command_export=`
	<polygon points="10 19.06 10 5.06 15.25 10.31 16 9.56 9.5 3.06 3 9.56 3.75 10.31 9 5.06 9 19.06 10 19.06"/>
	<rect width="19" height="1"/>
`;Je.command_newTab=`
	<polygon points="10.35 10.35 18.94 1.77 18.94 9 20 9 20 0 11 0 11 1.06 18.23 1.06 9.65 9.65 10.35 10.35"/>
	<polygon points="15 10 14.98 19 1 19 1 5 10 5 11 4 0 4 0 20 15.98 20 16 9 15 10"/>
`;Je.command_info=`
	<path d="M10,1c4.13,0,6.4,0,7.7,1.3,1.3,1.3,1.3,3.57,1.3,7.7s0,6.4-1.3,7.7c-1.3,1.3-3.57,1.3-7.7,1.3s-6.4,0-7.7-1.3c-1.3-1.3-1.3-3.57-1.3-7.7S1,3.6,2.3,2.3c1.3-1.3,3.57-1.3,7.7-1.3m0-1C5.62,0,3.18,0,1.59,1.59,0,3.18,0,5.62,0,10s0,6.82,1.59,8.41c1.59,1.59,4.03,1.59,8.41,1.59s6.82,0,8.41-1.59c1.59-1.59,1.59-4.03,1.59-8.41s0-6.82-1.59-8.41c-1.59-1.59-4.03-1.59-8.41-1.59h0Z"/>
	<path d="M9.28,14.06v-4.76h-1.13v-1.28h2.57v6.04h1.13v1.28h-3.7v-1.28h1.13Zm-.2-8.53c0-.23,.08-.43,.25-.6s.37-.26,.62-.26c.24,0,.44,.08,.61,.25s.26,.37,.26,.61-.09,.45-.26,.62c-.17,.17-.38,.25-.61,.25s-.45-.09-.62-.26-.25-.37-.25-.61Z"/>
`;Je.command_help=`
	<path d="M10,1c4.13,0,6.4,0,7.7,1.3,1.3,1.3,1.3,3.57,1.3,7.7s0,6.4-1.3,7.7c-1.3,1.3-3.57,1.3-7.7,1.3s-6.4,0-7.7-1.3c-1.3-1.3-1.3-3.57-1.3-7.7S1,3.6,2.3,2.3c1.3-1.3,3.57-1.3,7.7-1.3m0-1C5.62,0,3.18,0,1.59,1.59,0,3.18,0,5.62,0,10s0,6.82,1.59,8.41c1.59,1.59,4.03,1.59,8.41,1.59s6.82,0,8.41-1.59c1.59-1.59,1.59-4.03,1.59-8.41s0-6.82-1.59-8.41c-1.59-1.59-4.03-1.59-8.41-1.59h0Z"/>
	<path d="M10.06,12.65h-.82l-.19-3.53c.25,.06,.5,.1,.75,.1,.7,0,1.2-.18,1.5-.53s.46-.77,.46-1.25c0-.56-.17-1-.5-1.31-.33-.31-.75-.47-1.27-.47-.62,0-1.08,.18-1.39,.53s-.45,.8-.45,1.33c0,.11,0,.24,0,.39h-1.49c0-.14,0-.27,0-.37,0-1.09,.32-1.9,.97-2.41s1.42-.77,2.31-.77c1.08,0,1.91,.29,2.5,.87,.59,.58,.89,1.34,.89,2.28s-.28,1.64-.84,2.18-1.22,.81-1.98,.81c-.06,0-.14,0-.25,0l-.2,2.16Zm-1.41,2.99v-1.96h1.96v1.96h-1.96Z"/>
`;Je.command_autoFit=`
	<polygon points="6 9 3 9 4.75 7.25 4 6.5 1 9.5 4.25 12.25 5 11.5 3 10 6 10 6 9"/>
	<polygon points="14 9 17 9 15.25 7.25 16 6.5 19 9.5 15.75 12.25 15 11.5 17 10 14 10 14 9"/>
	<rect y="4" width="1" height="11"/>
	<rect x="19" y="4" width="1" height="11"/>
	<rect x="12" y="9" width="1" height="1"/>
	<rect x="7" y="9" width="1" height="1"/>
	<rect x="9" y="9" width="2" height="1"/>
`;Je.command_verticalBar='<rect x="9" y="0" width="2" height="18"/>';Je.command_horizontalBar='<rect y="9" x="1" height="2" width="19"/>';Je.command_crossProjectActions=`
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
`;Je.page_about=`
	<path d="m12,1.2c4.955,0,7.684,0,9.242,1.558,1.558,1.558,1.558,4.287,1.558,9.242s0,7.684-1.558,9.242c-1.558,1.558-4.287,1.558-9.242,1.558s-7.684,0-9.242-1.558c-1.558-1.558-1.558-4.287-1.558-9.242s0-7.684,1.558-9.242c1.558-1.558,4.287-1.558,9.242-1.558m0-1.2C6.742,0,3.818,0,1.909,1.909,0,3.818,0,6.742,0,12s0,8.182,1.909,10.091c1.909,1.909,4.832,1.909,10.091,1.909s8.182,0,10.091-1.909c1.909-1.909,1.909-4.832,1.909-10.091s0-8.182-1.909-10.091c-1.909-1.909-4.832-1.909-10.091-1.909h0Z"/>
	<path d="m11,17v-6h-2v-2h4v8h2v2s-6,0-6,0v-2h2Zm-.95-11.258c0-.468.165-.877.495-1.223s.748-.52,1.255-.52c.477,0,.888.168,1.233.504s.517.749.517,1.238-.173.905-.517,1.244c-.345.342-.756.514-1.233.514-.487,0-.9-.174-1.24-.52s-.51-.758-.51-1.238Z"/>
`;Je.page_help=`
	<path d="m12,1.2c4.955,0,7.684,0,9.242,1.558,1.558,1.558,1.558,4.287,1.558,9.242s0,7.684-1.558,9.242c-1.558,1.558-4.287,1.558-9.242,1.558s-7.684,0-9.242-1.558c-1.558-1.558-1.558-4.287-1.558-9.242s0-7.684,1.558-9.242c1.558-1.558,4.287-1.558,9.242-1.558m0-1.2C6.742,0,3.818,0,1.909,1.909,0,3.818,0,6.742,0,12s0,8.182,1.909,10.091c1.909,1.909,4.832,1.909,10.091,1.909s8.182,0,10.091-1.909c1.909-1.909,1.909-4.832,1.909-10.091s0-8.182-1.909-10.091c-1.909-1.909-4.832-1.909-10.091-1.909h0Z"/>
	<path d="m12.398,16h-2v-4.5c2,0,4.202-.5,4.202-3,0-1.5-.6-2.5-2.202-2.5-2,0-2.398,1.3-2.398,2v1h-2v-1c0-1,.398-4,4.398-4,2.602,0,4.602,1.5,4.602,4.5s-2.602,4.5-4.102,4.5l-.5,3Z"/>
	<rect x="10" y="17" width="3" height="3" rx=".75" ry=".75"/>
`;Je.page_exportFont=`
	<polygon points="30.1,9.9 40.1,0 50,9.9 42.5,9.9 42.5,18.8 37.6,18.8 37.6,9.9"/>
	<path d="M15.2,12.7l-9.9,9.9V50h29.8V12.7H15.2z M26.7,29.1h-1.9l0.7-2.9H20L18.8,31h4.7l-0.4,1.8h-4.7l-1.3,5.4h1.7l-0.4,1.8H13l0.4-1.8h1.4l2.9-12h-1.5l0.4-1.8h11.3L26.7,29.1z"/>
`;Je.page_exportSVG=`
	<polygon points="7 4 4 0 1 4 3 4 3 7 5 7 5 4 7 4"/>
	<path d="m17.026,6H7v18h15v-12.75l-4.974-5.25Zm-5.835,11.758c-.272.247-.613.371-1.022.371-.359,0-.684-.115-.976-.344v.303h-.949v-1.575h.949c0,.369.051.608.154.718.103.11.238.165.406.165.15,0,.267-.043.351-.128.084-.084.126-.202.126-.353,0-.12-.048-.247-.143-.38-.095-.131-.332-.334-.711-.604-.511-.361-.836-.657-.978-.889-.141-.232-.212-.46-.212-.684,0-.339.124-.617.371-.834.247-.217.561-.326.94-.326.188,0,.353.022.494.065.141.045.309.137.503.279v-.303h.949v1.463h-.949c0-.308-.047-.515-.141-.62s-.228-.158-.402-.158c-.127,0-.227.033-.302.098-.075.065-.113.153-.113.262,0,.135.044.253.131.354.088.101.26.236.519.405.582.383.962.702,1.142.959.18.256.269.53.269.823,0,.375-.136.687-.408.934Zm5.908-3.793h-.437l-1.455,4.201h-1.213l-1.402-4.201h-.455v-.725h2.318v.725h-.464l.727,2.313.719-2.313h-.536v-.725h2.198v.725Zm3.308,3.02c-.062.274-.163.51-.304.706s-.313.341-.514.436-.43.142-.685.142c-.526,0-.941-.217-1.244-.65-.303-.435-.455-1.054-.455-1.857,0-.812.123-1.441.369-1.889.246-.448.591-.672,1.036-.672.299,0,.554.146.766.441h.014v-.366h.783v1.675h-.783c-.007-.31-.054-.542-.142-.695-.088-.154-.205-.23-.35-.23-.176,0-.288.101-.337.303-.049.201-.073.633-.073,1.295,0,.524.012.914.036,1.168.024.255.065.427.125.519.059.091.147.137.263.137.278,0,.42-.272.427-.817h-.328v-.734h1.49c0,.453-.031.817-.092,1.092Z"/>
`;Je.page_importAndExport=`
	<polygon points="17 20 20 24 23 20 21 20 21 17 19 17 19 20 17 20"/>
	<polygon points="7 4 4 0 1 4 3 4 3 7 5 7 5 4 7 4"/>
	<path d="m13.684,6h-6.684v12h10v-8.5l-3.316-3.5Zm1.316,9h-5v-1h5v1Zm0-2h-5v-1h5v1Zm0-2h-7v-1h7v1Z"/>
`;Je.page_settings=`
	<path d="m23.404,15.538c.366-1.11.572-2.291.596-3.518l-3.267-1.344c-.041-.326-.101-.645-.176-.959l2.601-2.372c-.448-1.126-1.057-2.169-1.806-3.098l-3.375,1.073c-.227-.21-.465-.408-.714-.594l.47-3.506c-1.043-.567-2.18-.982-3.381-1.221l-1.897,2.993c-.152-.008-.301-.023-.455-.023s-.303.015-.455.023l-1.897-2.993c-1.201.238-2.338.653-3.381,1.221l.47,3.506c-.249.186-.487.384-.714.594l-3.375-1.073c-.749.929-1.358,1.972-1.806,3.098l2.601,2.372c-.075.314-.135.633-.176.959l-3.267,1.344c.024,1.227.23,2.408.596,3.518l3.516.145c.153.308.319.607.505.893l-1.634,3.121c.785.893,1.699,1.665,2.715,2.294l2.777-2.142c.323.141.656.264.998.366l.752,3.43c.58.086,1.17.145,1.774.145s1.194-.059,1.774-.145l.752-3.43c.342-.102.675-.225.998-.366l2.777,2.142c1.016-.628,1.93-1.401,2.715-2.294l-1.634-3.121c.186-.286.353-.585.505-.893l3.516-.145Zm-11.404,1.284c-2.761,0-5-2.239-5-5s2.239-5,5-5,5,2.239,5,5-2.239,5-5,5Z"/>
`;Je.page_globalActions=`
	<path d="m22.198,17.785l-3.6-3.6c1.293-1.339,2.093-3.157,2.093-5.166,0-1.751-.609-3.358-1.621-4.629-.016.554-.129,1.161-.344,1.811-.555,1.67-1.718,3.448-3.277,5.006-2.205,2.205-4.81,3.581-6.833,3.625,1.272,1.016,2.882,1.627,4.636,1.627,1.923,0,3.669-.735,4.989-1.932l1.582,1.582c-3.828,3.509-9.79,3.421-13.497-.287-3.707-3.707-3.795-9.669-.287-13.497l1.705,1.705c-1.197,1.32-1.932,3.067-1.932,4.989,0,1.739.601,3.334,1.6,4.601,1.567.793,4.737-.5,7.343-3.106,1.453-1.453,2.532-3.095,3.04-4.622.377-1.137.382-2.067.055-2.715-1.266-.998-2.861-1.598-4.598-1.598-2.008,0-3.827.799-5.166,2.093L4.485.072c-.097-.097-.253-.097-.35,0s-.097.253,0,.35l.855.855c-4.085,4.406-3.998,11.309.287,15.593,1.774,1.774,4,2.818,6.31,3.157v1.583c-2.439.05-4.32.347-4.32.71v.96c0,.398,2.257.72,5.04.72s5.04-.322,5.04-.72v-.96c0-.362-1.881-.659-4.32-.71v-1.46c.068.001.136.01.205.01,2.747,0,5.487-1.009,7.638-3.003l.978.978c.048.048.112.073.175.073s.127-.024.175-.073c.097-.097.097-.253,0-.35Z"/>
`;Je.page_livePreview=`
	<rect x="20" y="5" width="1" height="15"/>
	<rect x="17" y="3.98" width="3" height="1"/>
	<rect x="21" y="4" width="3" height="1"/>
	<rect x="17" y="19.98" width="3" height="1"/>
	<rect x="21" y="20" width="3" height="1"/>
	<path d="m0,16v-2s2,0,2,0v-6H0v-2h6v2h-2v6h3v-2h2v4S0,16,0,16Z"/>
	<path d="m14,18v2h-4v-2h1v-7h-1v-2h3v.879c.618-.654,1.308-.981,2.069-.981.92,0,1.644.365,2.173,1.096s.794,1.582.794,2.554c0,1.03-.273,1.882-.819,2.558-.546.675-1.274,1.013-2.184,1.013-.742,0-1.42-.29-2.033-.869v2.751s1,0,1,0Zm1.759-5.495c0-.608-.126-1.063-.377-1.365s-.583-.453-.995-.453c-.417,0-.756.154-1.017.463s-.392.77-.392,1.383c0,.551.129.994.388,1.329s.603.503,1.035.503c.398,0,.723-.151.977-.453s.381-.771.381-1.408Z"/>
`;Je.page_kerning=`
	<path d="m16.697,18l-4.164-10.513h-1.534v-1.487h4.892v1.487h-1.432l3.156,7.976,3.072-7.976h-1.446v-1.487h4.758v1.487h-1.505l-4.078,10.513h-1.72Z"/>
	<path d="m11.616,16.5l-3.41-9h1.495v-1.5H3.379v1.5h1.445l-3.327,9H0v1.5h4.873v-1.5h-1.503l.946-2.714h4.456l.92,2.714h-1.538v1.5h4.846v-1.5h-1.384Zm-6.839-4.12l1.667-4.88h.26l1.602,4.88h-3.529Z"/>
	<rect x="11" y="2" width="13" height="1"/>
	<rect x="11" width="1" height="5"/>
	<rect y="21" width="13" height="1"/>
	<rect x="12" y="19" width="1" height="5"/>
`;Je.page_ligatures=`
	<path id="b" data-name="ligatures" d="m21,21v-13s-8,0-8,0c-.002-.479,0-1.249,0-2.083s.2-2.917,2.2-2.917c.642,0,2.572,0,2.572,1.423,0,.899.943,1.524,1.826,1.402.891-.116,1.402-.825,1.402-1.825,0-2-2.376-4-5-4-1.75,0-2.704.202-3.87,1.194-.541.461-1.147,1.187-1.525,2.294-.723-1.025-1.865-1.545-3.438-1.545-3.166,0-4.206,2.057-4.206,5.196v.861l-2.96-.035v3.035h3v10H0v3h24v-3h-3ZM6,7.142c0-1.076,0-2.596,1.383-2.596.701,0,1.107.518,1.218,1.553l1.634-.251v2.152h-4.236v-.858Zm0,13.858v-10h4v10h-4Zm7,0v-10h5v10h-5Z"/>
`;Je.page_components=`
	<path d="m9.831,15.308c-.899-.912-2.012-1.368-3.338-1.368-1.38,0-2.544.544-3.493,1.632v-5.572H0v1.986l1,.014v10H0v2h3.028l-.028-1.602c.279.405.736.773,1.373,1.104.637.332,1.34.497,2.109.497,1.373,0,2.499-.489,3.378-1.468.879-.978,1.318-2.184,1.318-3.617,0-1.493-.449-2.695-1.348-3.607Zm-.531,3.75c0,.979-.3,1.755-.9,2.329-.6.574-1.292.861-2.076.861-.008,0-.016-.002-.024-.002-.008,0-.016.002-.024.002-.784,0-1.477-.287-2.076-.861-.6-.574-.9-1.35-.9-2.329,0-.031.006-.057.007-.088,0-.03-.007-.057-.007-.087,0-.992.297-1.762.89-2.31.593-.548,1.288-.822,2.086-.822.008,0,.016.002.024.002.008,0,.016-.002.024-.002.797,0,1.493.274,2.086.822.593.548.89,1.318.89,2.31,0,.031-.006.057-.007.087,0,.031.007.057.007.088Z"/>
	<path d="m12.821,18.915c0,1.433.439,2.638,1.318,3.617.879.978,2.005,1.468,3.378,1.468.77,0,1.473-.166,2.109-.497.637-.332,1.094-.7,1.373-1.104l-.028,1.602h3.028s0-2,0-2h-1v-10l1-.014v-1.986s-3,0-3,0v5.572c-.949-1.088-2.113-1.632-3.493-1.632-1.327,0-2.439.456-3.338,1.368-.899.912-1.348,2.114-1.348,3.607Zm1.886.055c0-.03-.007-.057-.007-.087,0-.992.297-1.762.89-2.31.593-.548,1.289-.822,2.086-.822.008,0,.016.002.024.002.008,0,.016-.002.024-.002.797,0,1.493.274,2.086.822.593.548.89,1.318.89,2.31,0,.031-.006.057-.007.087,0,.031.007.057.007.088,0,.979-.3,1.755-.9,2.329-.6.574-1.292.861-2.076.861-.008,0-.016-.002-.024-.002-.008,0-.016.002-.024.002-.784,0-1.477-.287-2.076-.861-.6-.574-.9-1.35-.9-2.329,0-.031.006-.057.007-.088Z"/>
	<path d="m15,3.131c0-.992-.297-1.762-.89-2.31-.593-.548-1.288-.822-2.086-.822-.008,0-.016.002-.024.002-.008,0-.016-.002-.024-.002-.797,0-1.493.274-2.086.822-.593.548-.89,1.318-.89,2.31,0,.031.006.057.007.087,0,.031-.007.057-.007.088,0,.979.3,1.755.9,2.329.6.574,1.292.861,2.076.861.008,0,.016-.002.024-.002.008,0,.016.002.024.002.784,0,1.477-.287,2.076-.861.6-.574.9-1.35.9-2.329,0-.031-.006-.057-.007-.088,0-.03.007-.057.007-.087Z"/>
	<path d="m15.001,13.5c-.17,0-.335-.087-.429-.243l-2.571-4.285-2.571,4.285c-.142.236-.45.314-.686.172-.237-.142-.313-.449-.171-.686l3.429-5.715,3.429,5.715c.142.236.065.544-.171.686-.081.049-.169.071-.257.071Z"/>
`;Je.page_characters=`
	<path d="m13.548,0h2.452v6l-2.452.004c-.785-2.073-2.148-3.002-4.088-3.002-1.602,0-2.814.466-3.634,1.557s-1.231,2.399-1.231,3.923c0,1.594.434,2.884,1.302,3.87s1.973,1.479,3.316,1.479c1.1,0,3.795-.823,4.796-3.825l2.992,1.001c-1.225,3.805-3.923,5.84-8.094,5.84-2.945,0-5.166-.793-6.662-2.38S0,10.874,0,8.447c0-1.728.389-3.24,1.166-4.536S2.99,1.64,4.306.984s2.759-.984,4.33-.984c1.956,0,3.593.511,4.913,1.532V0Z"/>
	<polygon points="21 21 21 20.5 22 20.5 22 20 23 20 23 17 23 16.5 22.5 16.5 22.5 16 22 16 22 15.5 21.5 15.5 21.5 15 21 15 21 14.5 20.5 14.5 20.5 14 20 14 20 13.5 19.5 13.5 19.5 13 19 13 19 12.5 18.5 12.5 18.5 12 18 12 18 11.5 17.5 11.5 17.5 11 17 11 17 12 17.5 12 17.5 13 18 13 18 14 18.5 14 18.5 15 19 15 19 16 19.5 16 20 16 20 16.5 20.5 16.5 20.5 17.5 20 17.5 20 18 19.5 18 19 18 19 17.5 18.5 17.5 18.5 16.5 19 16.5 19 16 18.5 16 18.5 15 18 15 18 14 17.5 14 17.5 13 17 13 17 19 17 19.5 17.5 19.5 17.5 20 18 20 18 20.5 18.5 20.5 18.5 21 19 21 19 21.5 19.5 21.5 20 21.5 20 21 21 21"/>
	<polygon points="24 22 24 21 23.5 21 23.5 20 23 20 23 20.5 22 20.5 22 21 21 21 21 21.5 20 21.5 20 22 20 22.5 20.5 22.5 20.5 23.5 21.5 23.5 21.5 23 22.5 23 22.5 22.5 23.5 22.5 23.5 22 24 22"/>
`;Je.page_overview=`
	<path d="m7,9.646v1.362h-2.161v-.951c-.701.72-1.483,1.08-2.347,1.08-.671,0-1.254-.231-1.749-.693S0,9.39,0,8.671C0,7.946.263,7.344.789,6.866s1.16-.717,1.901-.717c.691,0,1.359.22,2.004.661v-.773c0-.397-.036-.704-.107-.918s-.238-.408-.499-.58-.603-.258-1.025-.258c-.726,0-1.252.306-1.577.918l-1.387-.387c.615-1.214,1.677-1.821,3.185-1.821.554,0,1.033.079,1.436.238s.705.363.903.612.331.52.4.81.103.752.103,1.386v3.609h.873Zm-2.306-1.539c-.625-.516-1.257-.773-1.898-.773-.401,0-.737.124-1.006.371s-.404.567-.404.959c0,.365.118.671.354.918s.558.371.964.371c.701,0,1.364-.312,1.989-.935v-.91Z"/>
	<path d="m8,11.007v-1.362h.925V1.362h-.925V0h2.343v4.312c.726-.881,1.618-1.321,2.675-1.321,1.016,0,1.868.369,2.557,1.108s1.033,1.712,1.033,2.921c0,1.16-.337,2.136-1.01,2.929s-1.536,1.188-2.587,1.188c-.589,0-1.128-.134-1.616-.403s-.838-.567-1.052-.894v1.168h-2.343Zm2.388-3.883c0,.811.235,1.454.705,1.93s1.012.713,1.627.713c.645,0,1.201-.252,1.669-.757s.701-1.182.701-2.03c0-.822-.232-1.46-.697-1.914s-1.01-.681-1.635-.681c-.615,0-1.163.235-1.646.705s-.724,1.148-.724,2.034Z"/>
	<path d="m24,3v3s-1.25,0-1.25,0c-.064-.564-.393-.999-.75-1.3s-.884-.294-1.356-.294c-.629,0-1.141.243-1.534.729s-.59,1.124-.59,1.914c0,.736.187,1.384.561,1.946s.915.842,1.623.842c.983,0,1.697-.51,2.139-1.531l1.158.596c-.639,1.552-1.758,2.328-3.356,2.328-1.131,0-2.021-.422-2.67-1.265s-.974-1.815-.974-2.917c0-1.176.354-2.147,1.062-2.913s1.524-1.148,2.449-1.148c.792,0,1.693.255,2.239.765v-.753h1.25Z"/>
	<path d="m4.047,17.842l-1.444,1.806h.941v1.406H0v-1.406h1.076l2.196-2.731-2.098-2.511H.189v-1.406h3.43v1.406h-.91l1.314,1.578,1.269-1.578h-.744v-1.406h3.452v1.406h-1.205l-2.002,2.503,2.281,2.739h.925v1.406h-3.452v-1.406h1.008l-1.51-1.806Z"/>
	<path d="m12.492,20.2l-2.503-5.798h-.989v-1.402h3.492v1.402h-.913l1.645,4.198,1.613-4.198h-1.007v-1.402h3.17v1.402h-.613l-3.883,9.598h-2.498v-1.5h1.593l.892-2.3Z"/>
	<path d="m18,21.054v-1.315l4.37-5.433h-3.12v.694h-1.25v-2h6v1.406l-4.387,5.333h3.191v-.74h1.196v2.054h-6Z"/>
`;function UE(t="baseline-left"){let e=Lt.gray.l25,r=Lt.blue.l70,n=0;t.includes("center")&&(n=7),t.includes("right")&&(n=14);let a=0;return t.includes("middle")&&(a=8),t.includes("baseline")&&(a=11),t.includes("bottom")&&(a=15),`
	<svg version="1.1"
	xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20">
	<defs></defs>
	<rect fill="transparent" width="20" height="20"/>
	<g pointer-events="none" width="20" height="20">
			<path d="m2,2v16h15V2H2Zm14,15H3v-3h13v3Zm0-4H3V3h13v10Z"/>
			<rect x="${n}" y="${a}" width="5" height="5" style="fill: ${e};"/>
			<rect x="${n+1}" y="${a+1}" width="3" height="3" style="fill: ${r};"/>
		</g>
	</svg>
	`}Je.back='<polygon points="37,23 20,23 25,18 22,15 12,25 22,35 25,32 20,27 37,27"/>';Je.more='<polygon points="0,0 0,10 5,5"/>';Je.selected='<polygon points="6,6 6,14 14,10"/>';Je.notSelected='<rect x="5" y="9.75" width="10" height="0.5"/>';Je.keyboard=`
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
`;function ni(t,e="",r=[],n=!1){let a=`current${t.objType}`;a==="currentControlPoint"&&(a=`currentPathPoint.${t.type}`);let i=[a].concat(r);e&&(e+=":&ensp;");let s=y({tag:"label",innerHTML:`${e}x${ai()}y`}),l=y({tag:"div",className:"doubleInput"}),E=Pt(t,"x",i,"input-number"),T=Pt(t,"y",i,"input-number");return n&&(E.setAttribute("disabled",""),T.setAttribute("disabled","")),l.appendChild(E),l.appendChild(ii()),l.appendChild(T),[s,l]}function j0(t,e=!1){let r=[],n=`current${t.objType}`,a=we(`width${ai()}height`),i=y({tag:"div",className:"doubleInput"}),s=Pt(t,"width",n,"input-number"),l=Pt(t,"height",n,"input-number");if(e&&(s.setAttribute("disabled",""),l.setAttribute("disabled","")),i.appendChild(s),i.appendChild(ii()),i.appendChild(l),r.push(a),r.push(i),!e){let E=["top-left","baseline-left","bottom-left","top-right","baseline-right","bottom-right","middle-center"];E=ti;let T=we("transform origin",`With increases or decreases to width or height,
		the transform origin is the point that stays fixed.
		<br><br>
		This only takes effect when directly entering values
		into the width or height inputs.`),h=y({tag:"option-chooser",attributes:{"selected-id":t.transformOrigin,"selected-name":t.transformOrigin.replace("-"," ")}});E.forEach(g=>{let H=y({tag:"option",attributes:{"selection-id":g},innerHTML:`${UE(g)}${g.replace("-"," ")}`});H.addEventListener("click",()=>{t.transformOrigin=g,z().publish("editCanvasView",t)}),h.appendChild(H)});let u=we("lock aspect ratio",`
			When either the width or height is adjusted,
			the overall size will be kept proportional.
			<br><br>
			Maintaining aspect ratio will override value
			locks if need be.
		`),C=Wn(t,"ratioLock",n);r.push(T),r.push(h),r.push(u),r.push(C)}return r}function Pt(t,e,r,n,a=[]){let i=Array.isArray(r)?r:[r],s=y({tag:n,className:`singleInput-${e}`,attributes:{"pubsub-topic":i[0]}}),l=n==="input"?t[e]:oe(t[e],3);s.setAttribute("value",l),t.isLockable&&(s.setAttribute("is-locked",t.isLocked(e)),s.addEventListener("lock",T=>{T.detail.isLocked?t.lock(e):t.unlock(e);const h=z();i.forEach(u=>h.publish(u,t))}));function E(T){if(t.isLockable&&t.isLocked(e))return;let h=T.target.value;const u=z();if(e==="leftSideBearing"){let C=u.view;u.view.dx-=(h-t.leftSideBearing)*C.dz,u.publish("editCanvasView",t)}if((t.objType==="Glyph"||t.objType==="VirtualGlyph"||t.objType==="Path")&&(e==="width"||e==="height")){let C={width:!1,height:!1};C.ratioLock=t.ratioLock,C.transformOrigin=t.transformOrigin,e==="width"?C.width=h:C.height=h,t.objType==="Path"?t.setShapeSize(C):t.setGlyphSize(C)}else t[e]=h;t.objType==="VirtualGlyph"?i.forEach(C=>u.publish(C,u.selectedItem)):t.objType==="VirtualShape"?i.forEach(C=>u.publish(C,u.selectedItem)):i.forEach(C=>u.publish(C,t))}return s.addEventListener("change",E),a&&a.forEach(T=>{s.addEventListener(T,E)}),z().subscribe({topic:i,subscriberID:`attributesPanel.${i[0]}.${e}`,callback:T=>{if(T&&(T[e]||T[e]===0)){let h;n==="input"?h=T[e]:h=oe(T[e],3),s.value=h,s.setAttribute("value",h)}}}),s}function Wn(t,e,r){let n=y({tag:"input",attributes:{type:"checkbox"}});return t[e]&&n.setAttribute("checked",""),n.addEventListener("change",a=>{let i=a.target.checked;t[e]=!!i,r&&(z().publish(r,t),e==="use"&&(Vo(t.type,!!i),t.parent.reconcileHandle(t.type)))}),r&&z().subscribe({topic:r,subscriberID:`attributesPanel.${r}.${e}`,callback:a=>{a[e]?(n.setAttribute("checked",""),e==="use"&&Vo(t.type,!0)):(n.removeAttribute("checked"),e==="use"&&Vo(t.type,!1))}}),n}function Vo(t,e){let r=document.getElementById(`${t}InputGroup`);r&&(r.style.display=e?"grid":"none")}function we(t,e=!1,r=!1,n=!1){let a=y({content:t}),i=y({tag:"label"});if(r&&i.setAttribute("for",r),i.appendChild(a),e){let s=y({tag:"info-bubble",content:e});i.appendChild(s),i.classList.add("info")}return n&&i.setAttribute("class",n),i}function Qr(){return y({tag:"div",className:"rowPad"})}function ai(){return'<span class="dimSplit">&#x2044;</span>'}function ii(){return y({className:"dimSplit",innerHTML:"&#x2044;"})}function lr(t,e,r,n=!1){let a=y({tag:"input",attributes:{type:"checkbox"}});return t[e]&&a.setAttribute("checked",""),typeof n=="string"&&a.setAttribute("id",n),a.addEventListener("change",i=>{let s=i.target.checked;t[e]=!!s,r&&r(s)}),a}function O1(t){const e=z(),r=ce(),n=e.project.getItem(t);let a=y({className:"item-link__row",attributes:{"target-item-id":t}});return a.addEventListener("click",()=>{n.displayType==="Glyph"&&(e.nav.page="Characters"),n.displayType==="Component"&&(e.nav.page="Components"),n.displayType==="Ligature"&&(e.nav.page="Ligatures"),e.selectedItemID=t,e.navigate()}),a.appendChild(y({className:"item-link__thumbnail",attributes:{"target-item-id":t},innerHTML:r.makeItemThumbnail(n)})),a.appendChild(y({className:"item-link__title",innerHTML:`${(n==null?void 0:n.name)||"ERROR"}`})),a.appendChild(y({className:"item-link__subtitle",innerHTML:`${(n==null?void 0:n.displayType)||"ERROR"}&ensp;|&ensp;${t}`})),a}class Pr{constructor(){this.parent,this.id=""}changed(){this.cache&&(this.cache={}),this.parent&&this.parent.changed&&this.parent.changed(),this.hasChangedThisSession=!0}get objType(){return this._objType||this.constructor.name}get displayType(){if(this.id){if(this.id.startsWith("liga-"))return"Ligature";if(this.id.startsWith("comp-"))return"Component";if(this.id.startsWith("glyph-"))return"Glyph";if(this.id.startsWith("kern-"))return"Kern Group"}return this.objType}set objType(e){this._objType=e}get cache(){return this._cache||(this._cache={}),this._cache}set cache(e){this._cache=e||{}}save(e=!1){const r=Er(this);return e?r.objType=this.objType:delete r.objType,r.cache&&delete r.cache,r}clone(){return this.save(!0)}toString(){return Ka(this.save())}print(e=0,r=!1){let n="";for(let l=0;l<e;l++)n+="  ";let a=`${n}{${this.objType} ${r||""}
`;n+="  ";const i=this.save();let s;for(const l of Object.keys(i))s=this[l],s.print?a+=`${n}${l}: ${s.print(e+1)}
`:typeof s!="function"&&(typeof s=="object"?a+=`${n}${l}: ${JSON.stringify(s)}
`:a+=`${n}${l}: ${s}
`);return a+=`${n.substring(2)}}/${this.objType} ${r||""}`,a}get isLockable(){return!1}}function wE(){let t=["💖","🦧","🐆","✅","🐋","😈","🦑"],e="";for(let r=0;r<3;r++)e+=t[Math.floor(Math.random()*t.length)];return e}const YE=Object.freeze(Object.defineProperty({__proto__:null,GlyphElement:Pr,makeRandomID:wE},Symbol.toStringTag,{value:"Module"}));class Kt extends Pr{constructor({xMin:e,xMax:r,yMin:n,yMax:a}={}){return super(),this.xMin=e,this.xMax=r,this.yMin=n,this.yMax=a,this.objType="Maxes",this}save(e=!1){const r={};return pt(this._xMin)&&(r.xMin=this._xMin),pt(this._xMax)&&(r.xMax=this._xMax),pt(this._yMin)&&(r.yMin=this._yMin),pt(this._yMax)&&(r.yMax=this._yMax),e&&(r.objType=this.objType),r}print(e=0){let r="";for(let a=0;a<e;a++)r+="  ";let n=`${r}{`;return n+=`xMin:${this.xMin} `,n+=`xMax:${this.xMax} `,n+=`yMin:${this.yMin} `,n+=`yMax:${this.yMax}`,n+="}",n}get xMin(){return pt(this._xMin)?He(this._xMin):Number.MAX_SAFE_INTEGER}get xMax(){return pt(this._xMax)?He(this._xMax):Number.MIN_SAFE_INTEGER}get yMin(){return pt(this._yMin)?He(this._yMin):Number.MAX_SAFE_INTEGER}get yMax(){return pt(this._yMax)?He(this._yMax):Number.MIN_SAFE_INTEGER}get center(){return{x:this.width/2+this.xMin,y:this.height/2+this.yMin}}get width(){return this.xMax-this.xMin}get height(){return this.yMax-this.yMin}set xMin(e){e===void 0||isNaN(+e)?delete this._xMin:this._xMin=He(e)}set xMax(e){e===void 0||isNaN(+e)?delete this._xMax:this._xMax=He(e)}set yMin(e){e===void 0||isNaN(+e)?delete this._yMin:this._yMin=He(e)}set yMax(e){e===void 0||isNaN(+e)?delete this._yMax:this._yMax=He(e)}roundAll(e=3){this.xMin=oe(this.xMin,e),this.xMax=oe(this.xMax,e),this.yMin=oe(this.yMin,e),this.yMax=oe(this.yMax,e)}isPointInside(e,r){return!(e>=this.xMax||e<=this.xMin||r>=this.yMax||r<=this.yMin)}isMaxesInside(e){return!(!this.isPointInside(e.xMin,e.yMin)||!this.isPointInside(e.xMin,e.yMax)||!this.isPointInside(e.xMax,e.yMax)||!this.isPointInside(e.xMax,e.yMin))}}function X0(t={}){return!(isNaN(t==null?void 0:t.yMin)||isNaN(t==null?void 0:t.xMin)||isNaN(t==null?void 0:t.yMax)||isNaN(t==null?void 0:t.xMax))}function ji(t,e,r=!0){let n;return r?n=t.xMin<e.xMax&&t.xMax>e.xMin&&t.yMin<e.yMax&&t.yMax>e.yMin:n=t.xMin<=e.xMax&&t.xMax>=e.xMin&&t.yMin<=e.yMax&&t.yMax>=e.yMin,n}function za(t){const e=B1();let r;for(let n=0;n<t.length;n++)r=new Kt(t[n]),e.xMin=Math.min(e.xMin,r.xMin),e.xMax=Math.max(e.xMax,r.xMax),e.yMin=Math.min(e.yMin,r.yMin),e.yMax=Math.max(e.yMax,r.yMax);return new Kt(e)}function q0(t){return t.xMax===0&&t.xMin===0&&t.yMax===0&&t.yMin===0}function B1(){return{xMin:Number.MAX_SAFE_INTEGER,xMax:Number.MIN_SAFE_INTEGER,yMin:Number.MAX_SAFE_INTEGER,yMax:Number.MIN_SAFE_INTEGER}}function WE(){return{xMin:Number.MIN_SAFE_INTEGER,xMax:Number.MAX_SAFE_INTEGER,yMin:Number.MIN_SAFE_INTEGER,yMax:Number.MAX_SAFE_INTEGER}}const kE=Object.freeze(Object.defineProperty({__proto__:null,Maxes:Kt,getOverallMaxes:za,isAllZeros:q0,isMaxes:X0,maxesMaxBounds:WE,maxesMinBounds:B1,maxesOverlap:ji},Symbol.toStringTag,{value:"Module"}));class rn{constructor(e={}){this.text=e.text||"",this.fontSize=e.fontSize||48,this.lineGap=e.lineGap||12,this.pagePadding=e.pagePadding||10,this.pageWidth=e.pageWidth||"fit",this.pageHeight=e.pageHeight||"auto",this.showCharacterExtras=e.showCharacterExtras||!1,this.showLineExtras=e.showLineExtras||!1,this.showPageExtras=e.showPageExtras||!1,this.showPlaceholderMessage=e.showPlaceholderMessage||!1,this.widthAdjustment=e.widthAdjustment||0}get text(){let e=this._text;return e.substring(0,2)==="{{"&&(e=e.substring(2,e.length-2),kt[e])?kt[e]:this._text}set text(e){this._text=e}get displayName(){let e="";return e+=`${this.text.substring(0,40)}...`,e}save(){let e={};return this.fontSize&&this.fontSize!==48&&(e.fontSize=this.fontSize),this.lineGap&&this.lineGap!==12&&(e.lineGap=this.lineGap),this.pagePadding&&this.pagePadding!==10&&(e.pagePadding=this.pagePadding),this.pageWidth&&this.pageWidth!=="fit"&&(e.pageWidth=this.pageWidth),this.pageHeight&&this.pageHeight!=="auto"&&(e.pageHeight=this.pageHeight),this.showCharacterExtras&&(e.showCharacterExtras=this.showCharacterExtras),this.showLineExtras&&(e.showLineExtras=this.showLineExtras),this.showPageExtras&&(e.showPageExtras=this.showPageExtras),this._text&&(e.text=this._text),this.text===kt.swadesh_207_short&&(e.text="{{swadesh_207_short}}"),this.text===kt.swadesh_207_frequent&&(e.text="{{swadesh_207_frequent}}"),this.text===kt.scowl_10_short&&(e.text="{{scowl_10_short}}"),this.text===kt.scowl_10_frequent&&(e.text="{{scowl_10_frequent}}"),this.text===kt.scowl_50_short&&(e.text="{{scowl_50_short}}"),this.text===kt.scowl_50_frequent&&(e.text="{{scowl_50_frequent}}"),this.text===kt.scowl_70_short&&(e.text="{{scowl_70_short}}"),this.text===kt.scowl_70_frequent&&(e.text="{{scowl_70_frequent}}"),e}}let kt={};kt.swadesh_207_short="I you they we you they this that here there who what where when how not all many some few other one two three four five big long wide thick heavy small short narrow thin woman man child wife husband mother father animal fish bird dog louse snake worm tree forest stick fruit seed leaf root bark flower grass rope skin meat blood bone fat egg horn tail feather hair head ear eye nose mouth tooth tongue fingernail foot leg knee hand wing belly guts neck back breast heart liver drink eat bite suck spit vomit blow breathe laugh see hear know think smell fear sleep live die kill fight hunt hit cut split stab scratch dig swim fly walk come lie sit stand turn fall give hold squeeze rub wash wipe pull push throw tie sew count say sing play float flow freeze swell sun moon star water rain river lake sea salt stone sand dust earth cloud fog sky wind snow ice smoke fire ash burn road mountain red green yellow white black night day year warm cold full new old good bad rotten dirty straight round sharp dull smooth wet dry correct near far right left at in with and if because name";kt.swadesh_207_frequent="stab black head leaf fingernail snake animal name husband narrow breast feather because heavy play bird blood bone breathe burn ice scratch thick cloud correct cut day wide dirty dog drink dust seed squeeze left egg yellow rotten sleep forest wet few they father flower freeze full straight give good grass tongue sharp short three die wife wipe this fruit liver skin knee sky laugh child walk salt belly smell vomit mountain stone nose many float smoke hold woman smooth rope mother spit split pull bark worm dry sing some suck swell stick guts turn two rub four mouth water where you";kt.scowl_10_short="able act add leaf age ahead aid major make all am an chaos gap are as at cause gave law tax day lazy bad rubber be bid object able submit box brand jobs doubt bug obvious by can occur ice char city back club code acquire cry cs act cup cycle day feedback broadcast add code edge did adjust badly admit midnight do dry adds due advice hardware body eat debate neck bed see left leg behalf being reject seek cell deem end video deep equal err hes bet queue even few sex eye fan fed off fit fly for fry left fun modify gap age meaningful bigger high girl glad sign go grew bugs length gun apology had forthcoming withdraw he hid highly algorithm technical hot three months eight huge worthwhile why via library ice aid die if big like ill aim in prior chip unique air is it medium five fix size object job jump package key background kid quickly knew asks awkward lucky law album welcome old led half algorithm lie bulk all film log help already also felt blue solve always fly mad dumb me harmful mix firmly common autumn mod dump aims much my name inch and net info hang unhappy nice enjoy bank only government annoy no input unreasonable runs cent numb invent unwanted any boat job lock mod doe of dog oh oil project book old come on too pop or cost got our love how box boy dozen pay update pen helpful graph pi plan equipment pop apple press chips kept put upwards copy quit ran nearby force card re perfect argue perhaps rid dark girl arm turn row sharp err bars art run serve forward cry sad husband disc see satisfy she sit ask slip small so spot square less best sum answer busy tax catch ate doubtful the tie title treatment to output try its putt tune two city equal club luck judge due stuff bug quit bulk sum fun quote up our us but buy van even via vote heavy war we awful who win awkward slowly own two write laws growth exact except boxes exist expand next maybe cycle eye dying style symbol syntax you type buys byte anyway bizarre size";kt.scowl_10_frequent="establishment accidentally administration afterwards disadvantage ahead straightforward majority mistaking alternatively fundamentally misunderstanding chaos applications broadcasting automatically available withdraw maximum displaying crazy embarrassing rubbish deliberately responsibility objections submitting borrowing observation doubtful contributions obviously thereby communications circumstances characters background conclusion acquiring descriptions electronics introduction consistency recommendation feedback additional knowledge adjust admittedly midnight documentation addressing misunderstands undergraduates hardware everybody disappearing somebody sophisticated guaranteeing definitions registering comprehensive rejecting seeking announcement simultaneously representation consequences interpretation queue nevertheless elsewhere experiencing keyboard facilities professional difficulties significantly reflecting frequently justifying investigate arrangements meaningful suggestions discouraging accordingly algorithms buildings strength terminology beforehand forthcoming thoroughly techniques authorities throughout months hundreds worthwhile philosophy appreciating opportunities likewise mediums fixing bizarre justification packages brackets quickly networks awkward lucky calculations album considerable yourself talking almost development helpful already individuals absolutely themselves always combinations harmful harmless autumn demonstration comparatively mysterious unfortunately unhappy enjoy thinking certainly environment unnecessarily unpleasant unreasonable continuously conventional unwanted anonymous misunderstood whatsoever programmers oh pointless projects looking controlling possibilities potentially improvements boxes destroying dozens updating developing upsetting manipulation upwards occupying disturbing performance perhaps particularly information instruction intervention unnecessary husband successfully asking criticism square answering symbols switching atmosphere output publication excluding sufficiently requirements corrupting buying individually avoiding heavy awful widespread unknown rewrite borrows growth examined exceptions executing complexity extending cycles destroyed style syntax everyone anyplace everything everywhere citizen";kt.scowl_50_short="salaam abed acme gad aery aft jag bah fain rajah hake alb lam ankh baobab apps aqua agar asp tat auk aver awl axon dray laze bah bobby webcam abductee abed clubfeet subgroups subhead bier abjure lambkin bleep submerse hobnail bola subplot brr albs bobtail bur obverse bobwhite bobby cads cocci apace achoo cis beck clew acme picnicker coda acquirable craw docs bract cud chancy czarina coda oddball redcap adder deb gadfly cadge dhoti ding adjure bodkin addle adman gladness doc midpoint dram ids hardtop duh adverted dweeb dyer adze lea deb beck zed jeep fief aegis meh lei deejay pekoe ell emo wen oleo hep coequal ere espy eta euro bevy clew hex fey wheezy fa halfback serfdom fey doff afghan wolfhound fie flan hafnium fob halfpence frack coifs aft futz daffy gad bugbear dogcatcher hangdog loge dogfish boggy aught gird glop magma cosign agog grog ergs dogtrot ague wigwag gyro haw highboy ashcans archduke hep mirthful flashgun fishhook hie babushka phlox bathmat techno hob dishpan thru ankhs aught hula schwa ashy iamb jib mica ids fie coif brig jihad piing demijohn wiki mil sim ding viol pip cliquish dirk cis clit odium diva antiwar nix sukiyaki baize jag jeep jib josh julep kale backbit crankcase workday hake sackful ginkgo ankh kith lockjaw yukked anklet milkmaid knave kook chickpea krone auks buckteeth haiku inkwell balky la alb milch veld lea milf bilge bullhorn clit killjoy bilk ell palmy ulna lo pulpy catafalque bulrush awls dolt alum salvo bulwark lynx maw iamb gimcrack slumdog meh brimful farmhand mid mkay armlet jimmy limn emo ump kumquat armrest ems emu triumvirate dimwit gamy nary inbox conch wend pone confab bong inhere nib ninja ankh wanly enmesh jinn noel unpin jonquil unripe duns nth nu convoke unwed lynx onyx benzene roan fob doc hod aloe oft agog oho poi emoji gook pol tom yon coon fop toque orb hos sot lout coven cowl lox soy boozy paps soapbox topcoat stepdad jape campfire popgun aphid pip bumpkin plait stepmom grapnel poi apps prig apps inapt pug pwn pyx aqua brad orb orc gird ere serf erg rho brig marjoram dirk purl berm lorn euro carpi marquis brr burs arty drub nervy airway aery furze mesa busby scat misdo apse misfire disgorge ashy sim disjointedly rusk slaw ism snaky sol asp squab disrobe buss sty suet svelte swag hussy eta catbird butch cote outfox outgo nth ti catkin fitly litmus botnet tom potpie tram lats attar tun outvote twain sty futz aqua nub deuce cud ague mufti pug duh quid jujube auk hula ump dun quoit yup bur buss abut muumuu uvula bauxite obloquy abuzz diva aver vim vole chevron ovule divvy bevy swag cowbird howdah wen lawfully gewgaw whey wiki hawker awl bowman pwn wooer cowpox wrack haws newtons wuss dewy frowzy fixate oxbow coxcomb fixer oxford foxglove foxhound axial laxly laxness axon sexpot coxswain sextet nexus boxwood epoxy yaw flyby lyceum hydra ye mayfly cygnet tallyho yip skyjack beryl hymen lynx yon hypo gyro cloys mythic yuk byword pyx piazza zed zing buzzkill drizzly hazmat kazoo gazpacho kudzu zwieback boozy";kt.scowl_50_frequent="salaaming imperturbability ultraconservatives disadvantageously aerodynamically afforestation tetrahedrons praiseworthiness majorettes groundbreakings electroencephalograms contemporaneously chaotically electroencephalographs aquaculture counterrevolutionaries overenthusiastic interrelationships authoritativeness circumnavigations straightaways axiomatically companionways nonhazardous flibbertigibbets subcontracting molybdenum disencumbering obfuscating subgroups subheadings comprehensibility unobjectionable lambkins bloodthirstiness submersibles abnegating chlorofluorocarbons subprograms transubstantiation obtrusiveness bureaucratically obviousness dumbwaiters labyrinthine electrocardiographs unacceptability lackadaisically counterclaiming acmes picnickers acquisitiveness aristocratically electrodynamics cryptocurrency czarinas daguerreotyping rebroadcasting featherbedding inconsiderateness crowdfunding foreknowledge hardheadedness maladjustment bodkins disconnectedly administratively lightheartedness ambassadorships sandpipers hydroelectricity fountainheads superconductivity hundredweights kudzus rebelliousness electioneering prefabrication gregariousness reinterpretations steeplejacks inconsequentially electromagnetism neurotransmitters exemplifications monkeyshines intermezzos multifariousness beefburger serfdom paraprofessionals afghans halfheartedness aloofness disinformation halfpennies disenfranchisement weatherproofs antiaircraft unfaithfulness misidentifying herringbone dogcatchers hangdog counterintelligence wrongfulness microaggressions bacteriological uncompromisingly phlegmatically nongovernmental dogtrotting wigwagging parapsychology archbishoprics beachcombers archdeacons thoroughgoing bathhouses babushkas arithmetically biotechnology catchphrase philanthropically mouthwatering inconspicuousness annihilators shanghaiing demijohns sportsmanlike deliquescent conversationalists triumvirates contrariwise transfixing sukiyaki prizefighters jitterbugging photojournalists jurisdictional blackballing blackcurrant backdating cantankerousness thankfulness blackguards blockhouses lockjaw yukking huckleberries brinkmanship kookaburras backpedals bankrolling backstretches blackthorns skulduggery anticlockwise buckyballs spellbinders spellcheckers officeholders overindulgence levelheadedness killjoys streetwalkers schoolmistresses invulnerability palpitations milquetoasts chivalrously galvanometers councilwoman discombobulating gimcracks humdingers interdepartmental circumflexes warmhearted interdenominational mkay circumlocutions telecommunication anthropomorphism kumquats armrests bantamweights mysteriousness boysenberries teleconferencing circumnavigating unhesitatingly conjunctivitis dimensionless environmentalism interconnections unpredictability inquisitiveness nonrepresentational counterrevolutions discontinuances overanxious mulligatawny extravaganzas prohibitionists boisterousness psychokinesis grandiloquence atmospherically incontrovertible flamethrowers detoxification spermatozoon shipbuilders slipcovers snapdragons sheepfolds popguns slipknots developmental pneumatically apprehensiveness circumscriptions unscrupulousness sleepwalkers aromatherapy noninterference hypoallergenic porterhouses crackerjacks telemarketing disorderliness predetermination overqualified incorruptibility counterweights counterrevolutionary overzealous crossbreeding conscientiousness disfranchisement thanksgivings disjointedly muskellunges unreasonableness misquotations disreputably transversely swashbucklers syllabification carpetbaggers boastfulness remortgaging catkins shuttlecocking forthrightness breastplates agriculturalists outvoting trustworthiness chintziest longitudinally genuflections lugubriousness brouhahas jujitsu interleukin muumuus antediluvian luxuriousness colloquy puzzlement chevrons skivvying waterboardings shadowboxing weatherproofing viewfinders lawgivers horsewhipping nighthawks sawmills clownishness cowpunchers wrongheadedness newspaperwoman swallowtails knockwursts billowy frowziest counterexamples oxbows unexceptionable oxfords foxgloves inexhaustibly sexless laxness exorbitantly expostulations coxswains extemporaneously waxwings oxyacetylene cyberbullies underemployed ladyfingers lollygagging policyholders skyjackers asymmetrically embryologists cryptocurrencies tyrannosauruses crystallographic electrolytes polyunsaturated pennyweights asphyxia quizzically buzzkills bedazzling hazmat gazpacho mazurkas zwieback lazybones";kt.scowl_70_short="aah ab ac ad ae aft aga ah ai haj aka al am an ciao ape aqua ar as at aud av aw ax aye azo aba abb bobcat bd be bf pibgorn abhor bi obj bk bl abmho cobnut boa bp br abs btl bu abvolt lbw bx by subzero ca ecbolic cc cd ace cf cg ch cig ck cl cm acne co cp acquit cr cs ct cu cw cyl czar dab db dc dd de gadfly dg edh di adj dk bdl dm ordn do dpi hdqrs dr ads obdt dub adv dwt dye dz ea deb dec ed bee def beg eh lei eject eek el em en eon dep eq er es et feu eve dew ex bey fez fa offbeat offcuts mfd fec ff mfg offhand fib fjeld offkey fl fm hafnium fo fp fr ifs ft fug fwd defy rugby agcy gds age bagful egg ugh gi logjam gl gm gnu go magpie gr gs gt gum dogvane hgwy gym zigzag ha cashbox ahchoo hd he hf hg hhd hi kishke hl chm john ho hp earthquake hr chs ht hub boschvark hwy hyp machzor ria ib hic id die if big ihram aalii bijou oik ail aim in bio dip liq air is it ilium civ iwis fix hiya biz ja jct jet jg jib hajj prajna jo jr adjt jug ka kb kc jackdaw eke nakfa kg ankh ki lockjaw dekko kl km kn koa kph kr ks kt haku kvass kw sky la lb talc eld ale elf lg pelham li killjoy alk ll lm ln lo alp calque dlr ls alt flu lv lwei lx fly colza ma mb emcee mdse me mf mg mho mi ramjet mk ml mm damn mo mp kumquat amrita ms mt mu duumvir dimwit my hamza ana inbox enc and ne inf eng sinh nib conj ink enl unman ann no tnpk cinque nr ans ant nu inv unwed jinx any bonze ob doc od doe of bog oh oi mojo oka col om on oo op loq or os bot fou gov ow ox boy oz pa peepbo pc pd pe pf pg pi kopje pk pl pm apnea pod pp pr ps pt pub pvt pwn pya pzazz qadi sheqel qi ql qoph sqq qr qt qu qwerty bra arb arc rd re barf erg rho interj ark birl rm urn bro rpm cirque arr rs rt cru arvo crwth cry orzo sac sb sc sd sea sf sgd sh si masjid ask isl ism assn so sp sq sri ss st sub svelte swab sym grosz ta tb etc gtd ate artful mtg fth ti muntjac latke atm tn to hatpin cotquean tr ts att tub outvote two qty ditz qua bub buck cue buff aug uh oui juju auk bul um bun duo up tuque bur us ut lituus guv thruway aux buy buzz ova vb avdp ave avg vhf via vlf avn vo livre vs ovum vv ivy evzone wad bawbee bawcock wd we awful gewgaw whf wig blowjob wk awl cwm awn wo twp wry bows wt swum bowwow fwy blowzy coxa oxbow exc flexdollars axed boxful foxglove exhale xi axle taxman laxness axon exp exquisite exr bxs ext xu paxwax boxy ya flyby syce yd ye dayfly tyg anyhow yid skyjack dyke syn yo gyp yr mys byte yuk gyve ywis pyx sayyid coryza zap whizzbang vizcacha samizdat zed fizgig muzhik zig britzka zloty gizmo kibbutznik chutzpah buzzsaw azure mitzvah buzzword cozy";kt.scowl_70_frequent="aardwolves honorificabilitudinitatibus psychopharmacologies contradistinctively aerothermodynamics tetrafluoroethylene supercalifragilisticexpialidocious tetrahydrocannabinol photoreconnaissance majoritarianism groundbreakings pneumonoultramicroscopicsilicovolcanoconiosis extraordinarily electroencephalographic anthraquinone antidisestablishmentarianisms overenthusiastically floccinaucinihilipilification circumnavigations unseaworthiness chemoprophylaxis companionways succinylsulfathiazole bacteriologically flabbergasting subclassification subdirectories overbearingnesses dumbfounding subglacial abhorrently objectionableness knobkerries subminiaturize subnormalities bourgeoisification subprofessionals tribromoethanols insubstantialities unobtrusiveness subventionary cobwebbiest bxs presbyterianism subzero ecbolic synecdochically cf cg dichlorodiphenyltrichloroethane buckminsterfullerene chlortetracyclines blancmanges chromaticness ecphonesis acquaintanceship colicweed czarevitch hippopotomonstrosesquipedalian rebroadcasting featherbedding departmentalization grandfathering curmudgeonliness goodheartedness adjudications handkerchiefs otherworldlinesses maladministration straightforwardness childproofing headquartering magnetohydrodynamics straightforwards bloodthirstiness individualistically disadvantageously hundredweights dziggetais chickenheartedness thrombophlebitides feeblemindednesses indefatigabilities photodisintegration incomprehensibility deinstitutionalization nonprejudicial triskaidekaphobias contemporaneousnesses inconsequentiality counterrevolutionaries praiseworthiness attorneyships piezoelectricities surfboardings unselfconsciousness chiefdom counteroffensives roofgarden halfheartedness fjords offkey engulfment aloofness halfpennyworth softheartednesses halfwitted interstratifying hummingbirds dogcatchers subkingdoms counterinsurgencies meaningfulness microaggressions logjams glomerulonephritides segmentalization otorhinolaryngologists stringpiece misunderstandings superstrength contradistinguished dogvane songwriters otorhinolaryngology zigzagging archbishoprics archconservative archdeaconries reproachfulness thoroughgoing highhandedness babushkas biotechnological thoroughpaced earthquakes pseudohermaphroditism electroencephalographs boschvark northwestwardly electroencephalography machzor triiodomethane bijouterie unsportsmanlike impressionistically hemidemisemiquavers microsporangium uncommunicativenesses contrariwise interlocutrix semiyearly compartmentalization straitjacketing jct jg jitterbugging hajjes prajna photojournalists jr adjt injudiciousness lackadaisicalness stockbrokerage blackcurrants backdating breakfasting backgrounders backhandedness counterattacking stockjobbers bookkeepers kaffeeklatsches acknowledgments cuckooflowers backpedaling bankruptcies backscratchers breakthroughs skulduggery kvetchers counterclockwise ankylostomiasis albuminurias tetramethyldiarsine algorithmically diphenylhydantoins killjoys phenylketonuria diacetylmorphine caesalpiniaceous unnilquadiums hexylresorcinol convolvulaceous pickerelweeds calxes calzone somnambulistically uncircumcision humdingers uncomfortableness circumgyration warmheartedness circumjacent gymkhanas circumlocutions kumquats steamrollering circumterrestrial multidimensionality circumvallating bantamweights dihydrostreptomycin hamza nonbelligerents undemonstrativeness videoconferencing environmentalists unpretentiousnesses inquisitiveness nonrepresentational deoxyribonuclease conversationalists unwholesomeness nasopharynxes dinitrobenzene unapproachabilities autobiographically chlorofluorocarbons brokenheartedly grandiloquently underemployment photozincography clapboarding stepchildren stepdaughters leapfrogging campgrounds flapjacks pumpkinseeds oversimplifications developmentally disproportionateness disputatiousness impv shipwrecking endocrinotherapy pzazz sheqalim sheqel qindarkas ql qophs seqq hdqrs qto qwerty electrocardiographic interjectionally disembarkation preternaturalness anthropomorphically overqualified electrodynamometers ultraconservatives bilharziases jurisdictional unsatisfactoriness disgracefulness disjointedness contemporaneously misrepresentations transvestitisms upperclasswoman groszy heartbreakingly postconvalescent outdistancing roentgenotherapy pocketknives indiscreetnesses bulletproofing cotquean glottochronologies bodhisattva untrustworthiness quartziferous intellectualization insufficiently superdreadnought kieselguhrs hallelujahs lukewarmness dichlorodifluoromethane chautauqua duumvirate chauvinistically rauwolfias juxtapositional ventriloquy muzzleloading vb avdp incontrovertibilities avg vhf pavlovas czarevna vraisemblance leitmotivs advt improvvisatore heavyweights evzone shadowboxings cowcatchers bowdlerizations weatherboardings sorrowfulness shadowgraphs wholeheartedness showjumping sparrowhawks snowmobiling downheartedness cowpunchers wrongheadedness newspaperwoman yellowthroats knockwursts hollowwares lawyerly frowziness hexamethylenetetramine boxberries excommunications sexdecillion exemplifications exfoliating foxgloves exhibitionistically lexicographically orthodoxly fluxmeter complexnesses inexorabilities exquisiteness boxrooms exsanguinate extemporaneousness heterosexuality maxwells cyanocobalamins cybernetician encephalomyelitis gillyflowers acanthopterygians platyhelminths skyjackings pyknic polymorphonuclear electromyographies hyperparathyroidism psychophysiological demythologizations polyunsaturated polyvalence archaeopteryxes sayyid psychoanalyzing whizzbangs mezcaline samizdat anthropomorphized wayzgoose muzhiks anthropomorphizing blitzkriegs bamboozlement quizmasters kibbutzniks chutzpah buzzsaw gazumping rendezvousing buzzwords zygophyllaceous";class u0{constructor(e={}){this.textBlocks=[],this.lineBreakers=e.lineBreakers||[" "," "," "],this.data=[],this.pixelHeight=0,this.canvasMaxes=e.canvasMaxes,this.ctx=e.ctx,this.project=e.project||ce(),this.options=new rn(e.options),this.hasDrawableCharacters=!1,this.drawPageExtras=e.drawPageExtras||!1,this.drawLineExtras=e.drawLineExtras||!1,this.drawCharacterExtras=e.drawCharacterExtras||!1,this.drawCharacter=e.drawCharacter||!1,this.roundUp=e.roundUp||!1,this.generateData()}get canvasMaxes(){return this._canvasMaxes}set canvasMaxes(e){this._canvasMaxes=new Kt({xMin:e.xMin||0,xMax:e.xMax||1/0,yMin:e.yMin||0,yMax:e.yMax||1/0})}draw({showPageExtras:e=!1,showLineExtras:r=!1,showCharacterExtras:n=!1,showCharacter:a=!1}={}){if(this.drawPageExtras&&e&&this.drawPageExtras(this.ctx,this),this.options.text==="")return;let i=-1;this.drawLineExtras&&r&&this.iterator(s=>{s.lineNumber!==i&&(this.drawLineExtras(this.ctx,s,this),i=s.lineNumber)}),this.drawCharacterExtras&&n&&this.iterator(s=>{this.drawCharacterExtras(this.ctx,s,this.roundUp)}),this.drawCharacter&&a&&this.iterator(s=>{this.drawCharacter(this.ctx,s)})}iterator(e){for(let r=0;r<this.data.length;r++)for(let n=0;n<this.data[r].length;n++)e(this.data[r][n],this)}drawCanvasMaxes(e){e.fillStyle="transparent",e.strokeStyle="lime",e.lineWidth=1,e.strokeRect(this.canvasMaxes.xMin,this.canvasMaxes.yMin,this.canvasMaxes.width,this.canvasMaxes.height)}generateData(){var te;let e,r,n,a,i=0,s,l,E;for(this.data=[],this.textBlocks=this.options.text.split(`
`),n=0;n<this.textBlocks.length;n++)for(e=H1(this.textBlocks[n].split(""),this.project),this.data[n]=[],a=0;a<e.length;a++)r=e[a],r.startsWith("liga-")?(E=this.project.ligatures[r],r=E.chars):E=this.project.getItem(`glyph-${qr(r)}`),(te=E==null?void 0:E.shapes)!=null&&te.length&&(this.hasDrawableCharacters=!0),s=E?E.advanceWidth:this.project.defaultAdvanceWidth,l=En(r,e[a+1]),i+=s+l,this.data[n][a]={char:r,item:E,view:!1,widths:{advance:s,kern:l,aggregate:i},isLineBreaker:this.lineBreakers.indexOf(r)>-1,isVisible:!1,lineNumber:!1};let T,h,u,C=0,g=0,H=0,F=!1;const K=this.options.fontSize/this.project.totalVertical,j=this.project.settings.font.ascent,Q={lineHeight:this.project.totalVertical+this.options.lineGap/K,width:this.canvasMaxes.width/K,yMax:this.canvasMaxes.yMax/K,yMin:this.canvasMaxes.yMin/K,xMin:this.canvasMaxes.xMin/K};for(this.options.pageHeight==="auto"&&(Q.yMax=1/0),g=Q.xMin,H=Q.yMin+j,n=0;n<this.data.length;n++){for(e=this.data[n],a=0;a<e.length;a++){if(T=e[a],T.view===!1){if(F&&Number.isFinite(Q.width)){if(h=KE(e,a),u=h.widths.aggregate+h.widths.advance-T.widths.aggregate,g+u>Q.width){if(C++,H+Q.lineHeight>Q.yMax)return;g=Q.xMin,H=Q.yMin+j+C*Q.lineHeight}F=!1}T.isVisible=!0,T.lineNumber=C,T.view={dx:g*K,dy:H*K,dz:K},g+=T.widths.advance+T.widths.kern}T.isLineBreaker&&(F=!0)}if(C++,H+Q.lineHeight>Q.yMax)return;g=Q.xMin,H=Q.yMin+j+C*Q.lineHeight,this.pixelHeight=C*Q.lineHeight*K}}}function KE(t,e){for(let n=e;n<t.length;n++)if(t[n].isLineBreaker)return t[n];return t[t.length-1]}function En(t,e){if(!t||!e)return 0;t=Cn(t).join(""),e=Cn(e).join("");let r=ce().kerning,n,a,i;for(let s of Object.keys(r))for(let l=0;l<r[s].leftGroup.length;l++)if(n=r[s].leftGroup[l],Cn(n)[0]===t){for(let E=0;E<r[s].rightGroup.length;E++)if(a=r[s].rightGroup[E],Cn(a)[0]===e)return i=r[s].value*-1,i}return 0}function H1(t,e){e=e||ce();const r=e.sortedLigatures;let n,a;for(let i=0;i<t.length;i++)for(let s=0;s<r.length;s++)n=r[s].chars,a=t.slice(i,i+n.length).join(""),a===n&&t.splice(i,n.length,r[s].id);return t}class Q0{constructor(e={}){this.objType="Guide",this.angle=e.angle===0?0:90,this.name=e.name,this.location=isNaN(parseInt(e.location))?200:parseInt(e.location),this.color=e.color||Us,this.visible=!!e.visible}save(){let e={},r=this.name;return r!=="Horizontal guide"&&r!=="Vertical guide"&&r!=="Guide"&&(e.name=this.name),this.angle!==90&&(e.angle=this.angle),this.location!==200&&(e.location=this.location),this.color!==Us&&(e.color=this.color),this.visible||(e.visible=this.visible),e}get name(){return this._name||(this.angle===90?this._name="Horizontal guide":this.angle===0?this._name="Vertical guide":this._name="Guide"),this._name}set name(e){e||(this.angle===90?e="Horizontal guide":this.angle===0?e="Vertical guide":e="Guide"),this._name=e}}const Us="rgb(127, 0, 255)",p0="rgb(227, 190, 171)",S0="rgb(212, 154, 125)",Ya="rgb(191, 106, 64)";function ws(t){let e=[],r=(t==null?void 0:t.attributes)||{},n=Number(r.r)||Number(r.rx)||100;n=Math.abs(n);let a=Number(r.r)||Number(r.ry)||100;a=Math.abs(a);let i=Number(r.cx)||0,s=Number(r.cy)||0;if(!(n===0&&a===0)){let l={xMin:i-n,xMax:i+n,yMin:s-a,yMax:s+a};e=_E(l)}return[e]}function _E(t){let e=t.xMin,r=t.yMax,n=t.xMax,a=t.yMin,i=(n-e)/2,s=(r-a)/2,l=i*.448,E=s*.448,T={x:Pe(e+i),y:Pe(r)},h={x:Pe(e+l),y:Pe(r)},u={x:Pe(n-l),y:Pe(r)},C={x:Pe(n),y:Pe(a+s)},g={x:Pe(n),y:Pe(r-E)},H={x:Pe(n),y:Pe(a+E)},F={x:Pe(e+i),y:Pe(a)},K={x:Pe(n-l),y:Pe(a)},j={x:Pe(e+l),y:Pe(a)},Q={x:Pe(e),y:Pe(a+s)},te={x:Pe(e),y:Pe(a+E)},se={x:Pe(e),y:Pe(r-E)};return[[T,u,g,C],[C,H,K,F],[F,j,te,Q],[Q,se,h,T]]}function F1(t,e,r,n,a,i,s,l,E,T){let h={x:t,y:e},u={x:l,y:E};if(t===l&&e===E||!r||!n)return[h.x,h.y,u.x,u.y,u.x,u.y];let C=VE(a);i=!!i,s=!!s;let g={},H,F;if(T)H=T[0],F=T[1],g={x:T[2],y:T[3]};else{h=Ni(h,C*-1),u=Ni(u,C*-1);let Re=(h.x-u.x)/2,Me=(h.y-u.y)/2,xt=Me*Me,Oe=Re*Re,ae=Oe/(r*r)+xt/(n*n);ae>1&&(ae=Math.sqrt(ae),r*=ae,n*=ae);let me=r*r,ne=n*n,Dt=i===s?-1:1;Dt*=Math.sqrt(Math.abs((me*ne-me*xt-ne*Oe)/(me*xt+ne*Oe))),g.x=Dt*r*Me/n+(h.x+u.x)/2,g.y=Dt*-1*n*Re/r+(h.y+u.y)/2,H=Math.asin((h.y-g.y)/n),F=Math.asin((u.y-g.y)/n),H=h.x<g.x?Math.PI-H:H,F=u.x<g.x?Math.PI-F:F;let wt=Math.PI*2;H<0&&(H=wt+H),F<0&&(F=wt+F),s&&H>F&&(H=H-wt),!s&&F>H&&(F=F-wt)}let K=F-H,j=[],Q=Math.PI*120/180;if(Math.abs(K)>Q){let Re=F,Me=u.x,xt=u.y;F=H+Q*(s&&F>H?1:-1),u.x=g.x+r*Math.cos(F),u.y=g.y+n*Math.sin(F),j=F1(u.x,u.y,r,n,a,0,s,Me,xt,[F,Re,g.x,g.y])}let te={x:Math.cos(H),y:Math.sin(H)},se={x:Math.cos(F),y:Math.sin(F)};K=F-H;let Ie=Math.tan(K/4)*4/3,le={x:h.x,y:h.y},ue={x:h.x+r*Ie*te.y,y:h.y-n*Ie*te.x};ue.x=2*le.x-ue.x,ue.y=2*le.y-ue.y;let ve={x:u.x+r*Ie*se.y,y:u.y-n*Ie*se.x},Ye={x:u.x,y:u.y};if(j=[ue.x,ue.y,ve.x,ve.y,Ye.x,Ye.y].concat(j),T)return j;{let Re=[];for(let Me=0;Me<j.length;Me++)Me%2?Re[Me]=Ni({x:j[Me-1],y:j[Me]},C).y:Re[Me]=Ni({x:j[Me],y:j[Me+1]},C).x,Re[Me]=Pe(Re[Me]);return Re}}function VE(t){return t*(Math.PI/180)}function Ni(t,e,r){if(!t)return;if(e===0)return t;r=r||{},r.x=r.x||0,r.y=r.y||0;const n={x:0,y:0};return n.x=Math.cos(e)*(t.x-r.x)-Math.sin(e)*(t.y-r.y)+r.x,n.y=Math.sin(e)*(t.x-r.x)+Math.cos(e)*(t.y-r.y)+r.y,n}function Ys(t={}){const e=t.attributes.d||"";if(e.length===0||e.length===1)return[];let r=JE(e);return r=ZE(r),r=jE(r),r=XE(r),r=qE(r),r=QE(r),r=$E(r),zE(r)}function zE(t){let e=[],r=[],n=0,a=0;return t.forEach(i=>{const s=i.parameters||[];s.forEach((l,E)=>s[E]=Pe(l)),i.type==="M"&&(n=s[0],a=s[1]),i.type==="L"&&(r.push([{x:n,y:a},!1,!1,{x:s[0],y:s[1]}]),n=s[0],a=s[1]),i.type==="C"&&(r.push([{x:n,y:a},{x:s[0],y:s[1]},{x:s[2],y:s[3]},{x:s[4],y:s[5]}]),n=s[4],a=s[5]),i.type==="Z"&&(e.push(r),r=[])}),r.length&&e.push(r),e}function JE(t){let e=[],r=!1,n=P1(t);for(let a=0;a<n.length;a++)if(Ws(n.charAt(a))){r=a;break}if(r===!1)return[{type:"Z"}];for(let a=r+1;a<n.length;a++)Ws(n.charAt(a))&&(e.push({type:n.charAt(r),parameters:g0(n.substring(r+1,a))}),r=a);return r<n.length-1&&e.push({type:n.charAt(r),parameters:g0(n.substring(r+1,n.length))}),e}function ZE(t){let e=[],r={},n={x:0,y:0},a={x:0,y:0};return t.forEach(i=>{if(i.type==="m"||i.type==="l"){r={type:i.type==="m"?"M":"L",parameters:[]};for(let s=0;s<i.parameters.length;s+=2)a.x=i.parameters[s+0]+n.x,a.y=i.parameters[s+1]+n.y,r.parameters.push(a.x),r.parameters.push(a.y),n.x=a.x,n.y=a.y;e.push(r)}else if(i.type==="h"){r={type:"H",parameters:[]};for(let s=0;s<i.parameters.length;s++)a.x=i.parameters[s]+n.x,r.parameters.push(a.x),n.x=a.x;e.push(r)}else if(i.type==="v"){r={type:"V",parameters:[]};for(let s=0;s<i.parameters.length;s++)a.y=i.parameters[s]+n.y,r.parameters.push(a.y),n.y=a.y;e.push(r)}else if(i.type==="c"){r={type:"C",parameters:[]};for(let s=0;s<i.parameters.length;s+=6)r.parameters.push(i.parameters[s+0]+n.x),r.parameters.push(i.parameters[s+1]+n.y),r.parameters.push(i.parameters[s+2]+n.x),r.parameters.push(i.parameters[s+3]+n.y),a.x=i.parameters[s+4]+n.x,a.y=i.parameters[s+5]+n.y,r.parameters.push(a.x),r.parameters.push(a.y),n.x=a.x,n.y=a.y;e.push(r)}else if(i.type==="s"){r={type:"S",parameters:[]};for(let s=0;s<i.parameters.length;s+=4)r.parameters.push(i.parameters[s+0]+n.x),r.parameters.push(i.parameters[s+1]+n.y),a.x=i.parameters[s+2]+n.x,a.y=i.parameters[s+3]+n.y,r.parameters.push(a.x),r.parameters.push(a.y),n.x=a.x,n.y=a.y;e.push(r)}else if(i.type==="q"){r={type:"Q",parameters:[]};for(let s=0;s<i.parameters.length;s+=4)r.parameters.push(i.parameters[s+0]+n.x),r.parameters.push(i.parameters[s+1]+n.y),a.x=i.parameters[s+2]+n.x,a.y=i.parameters[s+3]+n.y,r.parameters.push(a.x),r.parameters.push(a.y),n.x=a.x,n.y=a.y;e.push(r)}else if(i.type==="t"){r={type:"T",parameters:[]};for(let s=0;s<i.parameters.length;s+=2)a.x=i.parameters[s+0]+n.x,a.y=i.parameters[s+1]+n.y,r.parameters.push(a.x),r.parameters.push(a.y),n.x=a.x,n.y=a.y;e.push(r)}else if(i.type==="a"){r={type:"A",parameters:[]};for(let s=0;s<i.parameters.length;s+=7)r.parameters.push(i.parameters[s+0]),r.parameters.push(i.parameters[s+1]),r.parameters.push(i.parameters[s+2]),r.parameters.push(i.parameters[s+3]),r.parameters.push(i.parameters[s+4]),a.x=i.parameters[s+5]+n.x,a.y=i.parameters[s+6]+n.y,r.parameters.push(a.x),r.parameters.push(a.y),n.x=a.x,n.y=a.y;e.push(r)}else i.type==="z"?e.push({type:"Z"}):(e.push(i),n=oi(n,i))}),e}function jE(t){let e=[];return t.forEach(r=>{if(r.type)switch(r.type){case"Z":case"z":e.push({type:"Z"});break;case"H":case"V":case"h":case"v":for(let n=0;n<r.parameters.length;n+=2)e.push({type:r.type,parameters:[r.parameters[n]]});break;case"M":for(let n=0;n<r.parameters.length;n+=2)e.push({type:n<2?"M":"L",parameters:[r.parameters[n],r.parameters[n+1]]});break;case"m":for(let n=0;n<r.parameters.length;n+=2)e.push({type:n<2?"m":"l",parameters:[r.parameters[n],r.parameters[n+1]]});break;case"L":case"T":case"l":case"t":for(let n=0;n<r.parameters.length;n+=2)e.push({type:r.type,parameters:[r.parameters[n],r.parameters[n+1]]});break;case"Q":case"S":case"q":case"s":for(let n=0;n<r.parameters.length;n+=4)e.push({type:r.type,parameters:[r.parameters[n],r.parameters[n+1],r.parameters[n+2],r.parameters[n+3]]});break;case"C":case"c":for(let n=0;n<r.parameters.length;n+=6)e.push({type:r.type,parameters:[r.parameters[n],r.parameters[n+1],r.parameters[n+2],r.parameters[n+3],r.parameters[n+4],r.parameters[n+5]]});break;case"A":case"a":for(let n=0;n<r.parameters.length;n+=7)e.push({type:r.type,parameters:[r.parameters[n],r.parameters[n+1],r.parameters[n+2],r.parameters[n+3],r.parameters[n+4],r.parameters[n+5],r.parameters[n+6]]});break}}),e}function XE(t){let e=[],r={x:0,y:0};return t.forEach(n=>{if(n.type==="H")for(let a=0;a<n.parameters.length;a++)e.push({type:"L",parameters:[n.parameters[a],r.y]});else if(n.type==="V")for(let a=0;a<n.parameters.length;a++)e.push({type:"L",parameters:[r.x,n.parameters[a]]});else e.push(n);r=oi(r,n)}),e}function qE(t){let e=[],r={x:0,y:0},n={x:0,y:0},a={x:0,y:0},i;return t.forEach(s=>{s.type==="S"||s.type==="T"?(i=e.length>1?e.at(-1):!1,i&&i.type==="C"?(n.x=i.parameters[2],n.y=i.parameters[3]):i&&i.type==="Q"?(n.x=i.parameters[0],n.y=i.parameters[1]):(n.x=r.x,n.y=r.y),a={x:r.x-n.x+r.x,y:r.y-n.y+r.y},s.type==="S"?e.push({type:"C",parameters:[a.x,a.y,s.parameters[0],s.parameters[1],s.parameters[2],s.parameters[3]]}):s.type==="T"&&e.push({type:"Q",parameters:[a.x,a.y,s.parameters[0],s.parameters[1]]})):e.push(s),r=oi(r,s)}),e}function QE(t){let e=[],r={x:0,y:0},n,a,i,s,l,E,T,h,u,C;return t.forEach(g=>{g.type==="Q"?(n=r.x,a=r.y,i=g.parameters[0],s=g.parameters[1],l=g.parameters[2],E=g.parameters[3],T=n+2/3*(i-n),h=a+2/3*(s-a),u=l+2/3*(i-l),C=E+2/3*(s-E),e.push({type:"C",parameters:[T,h,u,C,l,E]})):e.push(g),r=oi(r,g)}),e}function $E(t){let e=[],r=[],n={x:0,y:0};return t.forEach(a=>{if(a.type==="A")for(let i=0;i<a.parameters.length;i+=7){r=F1(n.x,n.y,a.parameters[i+0],a.parameters[i+1],a.parameters[i+2],a.parameters[i+3],a.parameters[i+4],a.parameters[i+5],a.parameters[i+6],!1);for(let s=0;s<r.length;s+=6)e.push({type:"C",parameters:[r[s+0],r[s+1],r[s+2],r[s+3],r[s+4],r[s+5]]});n={x:r.at(-2),y:r.at(-1)}}else e.push(a),n=oi(n,a)}),e}function oi(t,e){let r={x:t.x||0,y:t.y||0};switch(e.type){case"Z":case"z":break;case"H":r.x=e.parameters.at(-1);break;case"V":r.y=e.parameters.at(-1);break;case"M":case"L":case"C":case"S":case"A":case"Q":case"T":r.x=e.parameters.at(-2),r.y=e.parameters.at(-1);break;case"h":for(let n=0;n<e.parameters.length;n++)r.x+=e.parameters[n];break;case"v":for(let n=0;n<e.parameters.length;n++)r.y+=e.parameters[n];break;case"m":case"l":case"t":for(let n=0;n<e.parameters.length;n+=2)r.x+=e.parameters[n+0],r.y+=e.parameters[n+1];break;case"q":case"s":for(let n=0;n<e.parameters.length;n+=4)r.x+=e.parameters[n+2],r.y+=e.parameters[n+3];break;case"c":for(let n=0;n<e.parameters.length;n+=6)r.x+=e.parameters[n+4],r.y+=e.parameters[n+5];break;case"a":for(let n=0;n<e.parameters.length;n+=7)r.x+=e.parameters[n+5],r.y+=e.parameters[n+6];break}return r}function Ws(t){return"MmLlCcSsZzHhVvAaQqTt".indexOf(t)>-1}function ks(t){var a;let e=[],r=(a=t==null?void 0:t.attributes)==null?void 0:a.points;r=P1(r);let n=g0(r);if(n.length>4){let i=Number(n[0]),s=Number(n[1]);for(let l=0;l<n.length;l+=2){let E=Number(n[l])||0,T=Number(n[l+1])||0;e.push([{x:Pe(i),y:Pe(s)},!1,!1,{x:Pe(E),y:Pe(T)}]),i=E,s=T}}return[e]}function ec(t){let e=t.attributes||{},r=Pe(e.x)||0,n=Pe(e.y)||0,a=Pe(e.width)||100,i=Pe(e.height)||100,s=r+a,l=n+i,E={x:r,y:n},T={x:s,y:n},h={x:s,y:l},u={x:r,y:l};return[[[E,!1,!1,T],[T,!1,!1,h],[h,!1,!1,u],[u,!1,!1,E]]]}function tc(t){var i;if(!t||!(t!=null&&t.attributes))return[];const e=["matrix","translate","scale","rotate","skewx","skewy"];let r=[],n,a;return(i=t.attributes)!=null&&i.transform&&(n=t.attributes.transform.replaceAll(","," "),n=n.replaceAll("  "," "),n=n.toLowerCase(),n=n.split(")"),n.forEach(s=>{let l=s.split("(");l.length===2&&(l[0]=l[0].trim(),l[1]=l[1].trim(),e.indexOf(l[0])>-1&&(a=l[1].split(" "),a=a.map(E=>Number(E)),r.push({name:l[0],args:a})))})),t.attributes["transform-origin"]&&(n=t.attributes["transform-origin"],n=n.replaceAll(","," "),n=n.replaceAll("  "," "),a=n.split(" "),a=a.map(s=>Number(s)),r.push({name:"origin",args:a})),r}function rc(t=[],e=[]){JSON.stringify(t);const r=structuredClone(t);JSON.stringify(r);let n=e.reverse(),a=[0,0];for(let i=0;i<n.length;i++)if(n[i].name==="origin"){a=n.splice(i,1),a=a[0].args;break}return JSON.stringify(n),`${a.toString()}`,n.forEach(i=>{if(Ks[i.name]){`${i.name}`;const s=Ks[i.name];r.forEach((l,E)=>{l.forEach((T,h)=>{const u=s(T,i.args,a);r[E][h]=u})})}}),JSON.stringify(r),r}const Ks={matrix:nc,translate:ac,scale:ic,rotate:oc,skewx:sc,skewy:Ac};function nc(t=[],e=[],r=[]){const n=[];for(;e.length<6;)e.push(0);`${e.toString()}`;function a(i){if(i===!1)return!1;const s=i.x,l=i.y,E={x:0,y:0};return E.x=Pe(1*e[0]*s+1*e[2]*l+1*e[4]),E.y=Pe(1*e[1]*s+1*e[3]*l+1*e[5]),E}return n[0]=a(t[0]),n[1]=a(t[1]),n[2]=a(t[2]),n[3]=a(t[3]),n}function ac(t=[],e=[],r=[]){const n=[],a=e[0]||0,i=e[1]||0;`${t[0].x}${t[0].y}`;function s(l){if(l===!1)return!1;const E={x:0,y:0};return E.x=Pe(l.x+a),E.y=Pe(l.y+i),E}return n[0]=s(t[0]),n[1]=s(t[1]),n[2]=s(t[2]),n[3]=s(t[3]),n}function ic(t=[],e=[],r=[]){const n=e[0];let a=e[1];a||(a=n);const i=[];`${e.toString()}`;function s(l){if(l===!1)return!1;const E={x:0,y:0};return E.x=Pe(l.x*n),E.y=Pe(l.y*a),E}return i[0]=s(t[0]),i[1]=s(t[1]),i[2]=s(t[2]),i[3]=s(t[3]),i}function oc(t=[],e=[],r=[]){`${r.toString()}`;const n=$0(e[0]),a={x:0,y:0};e[1]||(e[1]=0),e[2]||(e[2]=0),a.x=e[1]+r[0],a.y=e[2]+r[1];const i=[];`${e.toString()}`;function s(l){if(!l)return!1;const E={x:0,y:0};return E.x=Pe(Math.cos(n)*(l.x-a.x)-Math.sin(n)*(l.y-a.y)+a.x),E.y=Pe(Math.sin(n)*(l.x-a.x)+Math.cos(n)*(l.y-a.y)+a.y),E}return i[0]=s(t[0]),i[1]=s(t[1]),i[2]=s(t[2]),i[3]=s(t[3]),i}function sc(t=[],e=[],r=[]){const n=[];`${e.toString()}`;const a=$0(e[0]),i=Math.tan(a);function s(l){if(!l)return!1;const E=l.x,T=l.y,h={x:0,y:0};return h.x=Pe(E+i*T),h.y=Pe(T),h}return n[0]=s(t[0]),n[1]=s(t[1]),n[2]=s(t[2]),n[3]=s(t[3]),n}function Ac(t=[],e=[],r=[]){const n=[];`${e.toString()}`;const a=$0(e[0]),i=Math.tan(a);function s(l){if(!l)return!1;const E=l.x,T=l.y,h={x:0,y:0};return h.x=Pe(E),h.y=Pe(T+i*E),h}return n[0]=s(t[0]),n[1]=s(t[1]),n[2]=s(t[2]),n[3]=s(t[3]),n}function $0(t){return Math.PI/180*parseFloat(t)}function lc(t){let e,r;if(typeof window.DOMParser<"u")e=new window.DOMParser().parseFromString(t,"text/xml");else if(typeof window.ActiveXObject<"u"&&new window.ActiveXObject("Microsoft.XMLDOM"))e=new window.ActiveXObject("Microsoft.XMLDOM"),e.async="false",e.loadXML(t);else throw console.warn("No XML document parser found."),r=new SyntaxError("No XML document parser found."),r;if(e.getElementsByTagName("parserError").length){const i=e.getElementsByTagName("div")[0].innerHTML;throw r=new SyntaxError(Xi(i)),r}return{name:e.documentElement.nodeName,attributes:G1(e.documentElement.attributes),content:M1(e.documentElement)}}function M1(t){const e=t.childNodes;if(e.length===0)return Xi(t.nodeValue);const r=[];let n,a,i;for(const s of e)n={},s.nodeName!=="#comment"&&(a=M1(s),i=G1(s.attributes),s.nodeName==="#text"&&JSON.stringify(i)==="{}"?n=Xi(a):(n.name=s.nodeName,n.attributes=i,n.content=a),n!==""&&r.push(n));return r}function G1(t){if(!t||!t.length)return{};const e={};for(const r of t)e[r.name]=Xi(r.value);return e}function Xi(t){try{return t=t.replace(/^\s+|\s+$/g,""),t.replace(/(\r\n|\n|\r|\t)/gm,"")}catch{return""}}const xc=!1;function Ec(t){let e=lc(t);return b1(e)}function b1(t){if(!(t!=null&&t.content))return[];let e=[];return t.content.forEach(r=>{const n=r.name.toLowerCase(),a=tc(r);if(_s[n]){let i=_s[n](r);a&&(i=rc(i,a)),e=e.concat(i)}}),e}const _s={circle:ws,ellipse:ws,path:Ys,glyph:Ys,polygon:ks,polyline:ks,rect:ec,g:b1};function P1(t){return t=t.replace(/\s+/g,","),t=t.replace(/e/gi,"e"),t=t.replace(/e-/g,"~~~"),t=t.replace(/-/g,",-"),t=t.replace(/~~~/g,"e-"),t=t.replace(/e\+/g,"~~~"),t=t.replace(/\+/g,","),t=t.replace(/~~~/g,"e+"),t=t.replace(/,+/g,","),t}function g0(t=""){let e=[];return t.charAt(0)===","&&(t=t.substring(1)),t.charAt(t.length-1)===","&&(t=t.substring(0,t.length-1)),t.length>0&&(t=t.split(","),t.forEach(r=>{if(r=r.split("."),r.length===1)e.push(Number(r[0]));else if(r.length===2)e.push(Number(r.join(".")));else if(r.length>2){e.push(+`${r[0]}.${r[1]}`);for(let n=2;n<r.length;n++)e.push(+`0.${r[n]}`)}})),e}function Pe(t){return t=cc(t),t=v1(t,xc),t}function v1(t,e=!1){return t?e===!1?parseFloat(t):(t=parseFloat(t),+(Math.round(`${t}e${e}`)+`e-${e}`)||0):0}function cc(t){const e=String(t);return(e.indexOf("00000")>-1||e.indexOf("99999")>-1)&&(t=v1(t,5)),t}class an extends Pr{constructor({x:e=0,y:r=0,parent:n=!1}={}){super(),this.parent=n,this.x=e,this.y=r,this.objType="Coord"}save(){return{x:Ar(this.x),y:Ar(this.y)}}print(e=0){let r="";for(let a=0;a<e;a++)r+="  ";let n=`${r}{`;return n+=`x: ${pt(this._x)?this._x:"--"}  `,n+=`y: ${pt(this._y)?this._y:"--"}`,n+="}",n}get x(){return isNaN(this._x)?(this._x=0,console.warn("Coord.x was NaN, setting to 0"),0):this._x}get y(){return isNaN(this._y)?(this._y=0,console.warn("Coord.y was NaN, setting to 0"),0):this._y}set x(e){e=Ar(e),isNaN(e)?this._x=0:this._x=e,this.changed()}set y(e){e=Ar(e),isNaN(e)?this._y=0:this._y=e,this.changed()}}const hc=Object.freeze(Object.defineProperty({__proto__:null,Coord:an},Symbol.toStringTag,{value:"Module"}));class ke extends Pr{constructor({coord:e={},use:r=!0,xLock:n=!1,yLock:a=!1,parent:i=!1,type:s=""}={}){super(),this.parent=i,this.coord=e,this.use=r,this.xLock=n,this.yLock=a,this.type=s,this.objType="ControlPoint"}save(e=!1){const r={coord:this.coord.save()};return this.use||(r.use=!1),this.xLock&&(r.xLock=!0),this.yLock&&(r.yLock=!0),e&&(r.objType=this.objType),this.type==="p"&&delete r.use,r}print(e=0){let r="";for(let a=0;a<e;a++)r+="  ";let n=`${r}{ControlPoint
`;return r+="  ",n+=`${r}coord: ${this.coord.print(e+1)}
`,this.type!=="p"&&(n+=`${r}use: ${this.use}
`),n+=`${r.substring(2)}}`,n}get x(){return this.use?this.coord.x:this.parent.p.x}get y(){return this.use?this.coord.y:this.parent.p.y}get coord(){return(this==null?void 0:this._coord)||new an}get use(){return this._use!==!1}get xLock(){return this._xLock||!1}get yLock(){return this._yLock||!1}get type(){return this._type||"p"}set x(e){if(this.type==="p"){let r=e-this.x;this.parent?this.parent.updatePathPointPosition("p",r,0):this.coord.x=e}else this.coord.x=e,this.use=!0}set y(e){if(this.type==="p"){let r=e-this.y;this.parent?this.parent.updatePathPointPosition("p",0,r):this.coord.y=e}else this.coord.y=e,this.use=!0}set coord(e){this._coord=new an(e),this._coord.parent=this,this.use=!0}set use(e){this._use=!!e,this.changed()}set xLock(e){this._xLock=!!e}set yLock(e){this._yLock=!!e}set type(e){this._type=e}get isLockable(){return!0}isLocked(e){return e==="x"?this.xLock:e==="y"?this.yLock:!1}lock(e){e==="x"&&(this.xLock=!0),e==="y"&&(this.yLock=!0)}unlock(e){e==="x"&&(this.xLock=!1),e==="y"&&(this.yLock=!1)}rotate(e,r){Ji(this.coord,e,r)}}const Lc=Object.freeze(Object.defineProperty({__proto__:null,ControlPoint:ke},Symbol.toStringTag,{value:"Module"}));class _t extends Pr{constructor({p:e,h1:r,h2:n,type:a="corner",parent:i=!1}={}){super(),this.parent=i,this.p=e,this.h1=r,this.h2=n,this.type=a,this.objType="PathPoint",this.hasOverlappingHandle("h1")&&(this.h1.use=!1),this.hasOverlappingHandle("h2")&&(this.h2.use=!1)}save(e=!1){const r={type:this.type,p:this.p.save(e)};return(this.h1.use||!this.h1.use&&!this.hasOverlappingHandle("h1"))&&(r.h1=this.h1.save(e)),(this.h2.use||!this.h2.use&&!this.hasOverlappingHandle("h2"))&&(r.h2=this.h2.save(e)),e&&(r.objType=this.objType),r}print(e=0,r=!1){let n="";for(let s=0;s<e;s++)n+="  ";let a=He(r)?` ${He(r)}`:"",i=`${n}{PathPoint${a}
`;return n+="  ",i+=`${n}type: ${this.type}
`,i+=`${n}p: ${this.p.print(e+1)}
`,i+=`${n}h1: ${this.h1.print(e+1)}
`,i+=`${n}h2: ${this.h2.print(e+1)}
`,i+=`${n.substring(2)}}/PathPoint${a}`,i}get p(){return this._p||new ke}get h1(){return this._h1||new ke}get h2(){return this._h2||new ke}get type(){return this._type||"corner"}get xLock(){return this.p.xLock}get yLock(){return this.p.yLock}get name(){let e=this.pointNumber===!1?"-1":this.pointNumber;return`${this.parent.name}: Path Point ${e}`}get pointNumber(){if(!this.parent)return!1;const e=this.parent.pathPoints;if(!e)return!1;for(let r=0;r<e.length;r++)if(e[r]===this)return r;return!1}set p(e){e||(e=new ke),e.type="p",this._p=new ke(e),this._p.parent=this}set h1(e){let r=!1;e||(e=new ke,r=!0),(!e.coord||r)&&(e.coord=new an({x:this.p.x-50,y:this.p.y}),e.use=!1),e.type="h1",this._h1=new ke(e),this._h1.parent=this}set h2(e){let r=!1;e||(e=new ke,r=!0),(!e.coord||r)&&(e.coord=new an({x:this.p.x+50,y:this.p.y}),e.use=!1),e.type="h2",this._h2=new ke(e),this._h2.parent=this}set type(e){e==="symmetric"?this.makeSymmetric():e==="flat"?this.makeFlat():this._type="corner"}updatePathPointPosition(e="p",r=0,n=0){switch(r=He(r),n=He(n),r=Number.isFinite(r)?r:0,n=Number.isFinite(n)?n:0,e){case"p":this.p.coord.x+=r,this.p.coord.y+=n,this.h1.coord.x+=r,this.h1.coord.y+=n,this.h2.coord.x+=r,this.h2.coord.y+=n;break;case"h1":this.h1.coord.x+=r,this.h1.coord.y+=n,this.h1.use&&(this.type==="symmetric"?this.makeSymmetric("h1"):this.type==="flat"&&this.makeFlat("h1"));break;case"h2":this.h2.coord.x+=r,this.h2.coord.y+=n,this.h2.use&&(this.type==="symmetric"?this.makeSymmetric("h2"):this.type==="flat"&&this.makeFlat("h2"));break}}makeSymmetric(e=!1){if(this._type="symmetric",!e&&(e=this.h1.use?"h1":"h2",!(this.h1.use||this.h2.use)&&yt(this.p.coord,this.h1.coord)&&yt(this.p.coord,this.h2.coord)))return this.h2.x-=200,this.h1.x+=200,this.h1.use=!0,this.h2.use=!0,this;this.h1.use=!0,this.h2.use=!0;let r,n,a=!1;switch(e){case"h1":r=this.p.x-this.h1.x+this.p.x,this.h2.x!==r&&(this.h2.x=r,a=!0),n=this.p.y-this.h1.y+this.p.y,this.h2.y!==n&&(this.h2.y=n,a=!0);break;case"h2":r=this.p.x-this.h2.x+this.p.x,this.h1.x!==r&&(this.h1.x=r,a=!0),n=this.p.y-this.h2.y+this.p.y,this.h1.y!==n&&(this.h1.y=n,a=!0);break}return this._type="symmetric",a&&(this.h1.use=!0,this.h2.use=!0),this}makeFlat(e=!1){if(this._type="flat",this.isFlat())return this;if(!e&&(e=this.h1.use?"h1":"h2",!(this.h1.use||this.h2.use)&&yt(this.p.coord,this.h1.coord)&&yt(this.p.coord,this.h2.coord)))return this.h2.x-=300,this.h1.x+=100,this;this.h1.use=!0,this.h2.use=!0;const r=gn(this.h1.coord,this.p.coord),n=gn(this.h2.coord,this.p.coord),a=la(this.p.coord,this.h1.coord),i=la(this.p.coord,this.h2.coord);let s,l,E,T;return e==="h1"?(E=Math.cos(r)*i,T=Math.tan(r)*E,s=this.p.x+E*-1,l=this.p.y+T*-1,!isNaN(s)&&!isNaN(l)&&(this.h2.x!==s&&(this.h2.x=s),this.h2.y!==l&&(this.h2.y=l))):e==="h2"&&(E=Math.cos(n)*a,T=Math.tan(n)*E,s=this.p.x+E*-1,l=this.p.y+T*-1,!isNaN(s)&&!isNaN(l)&&(this.h1.x!==s&&(this.h1.x=s),this.h1.y!==l&&(this.h1.y=l))),this}isFlat(){if(!this.h1.use||!this.h2.use)return!1;if(this.p.x===this.h1.x&&this.p.x===this.h2.x||this.p.y===this.h1.y&&this.p.y===this.h2.y)return!0;const e=gn(this.h1.coord,this.p.coord),r=gn(this.h2.coord,this.p.coord);return oe(Math.abs(e)+Math.abs(r),2)===3.14}reconcileHandle(e="h1"){let r=e==="h1"?"h2":"h1";this.type==="symmetric"?this.makeSymmetric(r):this.type==="flat"&&this.makeFlat(r)}resolvePointType(){if(this.isFlat()){const e=la(this.p.coord,this.h1.coord),r=la(this.p.coord,this.h2.coord);e===r?this._type="symmetric":this._type="flat"}else this._type="corner";return this.type}makePointedTo(e,r,n=0,a="h2",i=!1){const s=this.p.x-e,l=this.p.y-r,E=l>=0?-1:1,T=-1,h=Math.sqrt(s*s+l*l),u=Math.acos(s/h);return n=n||h/3,this[a].x=this.p.x+Math.cos(u)*n*T,this[a].y=this.p.y+Math.sin(u)*n*E,i||(this.type==="corner"?this.makeFlat(a):this.makeSymmetric(a)),this}hasOverlappingHandle(e){return!this[e]||!this[e].coord?!1:yt(this[e].coord,this.p.coord)}rotate(e,r){return this.p.rotate(e,r),this.h1.rotate(e,r),this.h2.rotate(e,r),this}resetHandles(){return this.type="corner",this.h1.use=!0,this.h2.use=!0,this.h2.x=this.p.x-100,this.h2.y=this.p.y,this.h1.x=this.p.x+100,this.h1.y=this.p.y,this}roundAll(e=9){this.p.x=oe(this.p.x,e),this.p.y=oe(this.p.y,e);let r=this.h1.use;this.h1.x=oe(this.h1.x,e),this.h1.y=oe(this.h1.y,e),this.h1.use=r;let n=this.h2.use;return this.h2.x=oe(this.h2.x,e),this.h2.y=oe(this.h2.y,e),this.h2.use=n,this}}const Tc=Object.freeze(Object.defineProperty({__proto__:null,PathPoint:_t},Symbol.toStringTag,{value:"Module"}));class Jr{constructor(e=0,r=0){e=parseFloat(""+e),this.x=isNaN(e)?0:e,r=parseFloat(""+r),this.y=isNaN(r)?0:r}}const dc=Object.freeze(Object.defineProperty({__proto__:null,XYPoint:Jr},Symbol.toStringTag,{value:"Module"}));class qt extends Pr{constructor({p1x:e=0,p1y:r=0,p2x:n,p2y:a,p3x:i,p3y:s,p4x:l=0,p4y:E=0,point1ID:T=!1,point2ID:h=!1}={}){super(),this.p1x=Ar(e),this.p1y=Ar(r),this.p4x=Ar(l),this.p4y=Ar(E),this.p2x=n===void 0?this.p1x:Ar(n),this.p2y=a===void 0?this.p1y:Ar(a),this.p3x=i===void 0?this.p4x:Ar(i),this.p3y=s===void 0?this.p4y:Ar(s),T&&(this.point1ID=T),h&&(this.point2ID=h),this.objType="Segment",this.recalculateMaxes()}save(e=!1){const r={p1x:this.p1x,p1y:this.p1y,p2x:this.p2x,p2y:this.p2y,p3x:this.p3x,p3y:this.p3y,p4x:this.p4x,p4y:this.p4y};return e&&(r.objType=this.objType),r}print(e=0){let r="";for(let a=0;a<e;a++)r+="  ";let n=`${r}{Segment
`;return r+="  ",n+=`${r+"  "}line: ${this.lineType}
`,n+=`${r+"  "}p1: ${this.p1x}/${this.p1y}
`,n+=`${r+"  "}p2: ${this.p2x}/${this.p2y}
`,n+=`${r+"  "}p3: ${this.p3x}/${this.p3y}
`,n+=`${r+"  "}p4: ${this.p4x}/${this.p4y}
`,n+=`${r+"  "}maxes: ${this.maxes.print(e+1)}
`,n+=`${r.substring(2)}}`,n}get lineType(){return pt(this._lineType)||this.determineLineType(),this._lineType}get length(){return this.cache.length?this.cache.length:(this.cache.length=this.calculateLength(),this.cache.length)}get baseLength(){return Ua(this.p1x,this.p1y,this.p4x,this.p4y)}get topLength(){const e=Ua(this.p1x,this.p1y,this.p2x,this.p2y),r=Ua(this.p2x,this.p2y,this.p3x,this.p3y),n=Ua(this.p3x,this.p3y,this.p4x,this.p4y);return e+r+n}get quickLength(){return Math.max(this.topLength,this.baseLength)}get maxes(){return(!this.cache.maxes||So(this.cache.maxes))&&this.recalculateMaxes(),new Kt(this.cache.maxes)}get valuesAsArray(){return[this.p1x,this.p1y,this.p2x,this.p2y,this.p3x,this.p3y,this.p4x,this.p4y]}set maxes(e){this.cache.maxes={},this.cache.maxes=new Kt(e)}split(e=.5){return typeof e=="object"&&pt(e.x)&&pt(e.y)?this.splitAtPoint(e):isNaN(e)?!1:this.splitAtTime(e)}splitAtPoint(e){if(this.containsTerminalPoint(e,.1))return!1;if(this.lineType==="horizontal"||this.lineType==="vertical"){let r,n,a=!1;return this.lineType==="horizontal"?oe(e.y,2)===oe(this.p1y,2)&&e.x>Math.min(this.p1x,this.p4x)&&e.x<Math.max(this.p1x,this.p4x)&&(r=e.x,n=this.p1y,a=!0):this.lineType==="vertical"&&oe(e.x,2)===oe(this.p1x,2)&&e.y>Math.min(this.p1y,this.p4y)&&e.y<Math.max(this.p1y,this.p4y)&&(r=this.p1x,n=e.y,a=!0),a?[new qt({p1x:this.p1x,p1y:this.p1y,p4x:r,p4y:n}),new qt({p1x:r,p1y:n,p4x:this.p4x,p4y:this.p4y})]:!1}else if(this.pointIsWithinMaxes(e)){const n=this.getSplitFromXYPoint(e,.1);if(n&&n.distance<.1)return this.splitAtTime(n.split)}return!1}splitAtTime(e=.5){const r=1-e,n=this.p1x*r+this.p2x*e,a=this.p1y*r+this.p2y*e,i=this.p2x*r+this.p3x*e,s=this.p2y*r+this.p3y*e,l=this.p3x*r+this.p4x*e,E=this.p3y*r+this.p4y*e,T=n*r+i*e,h=a*r+s*e,u=i*r+l*e,C=s*r+E*e,g=T*r+u*e,H=h*r+C*e;return[new qt({p1x:this.p1x,p1y:this.p1y,p2x:n,p2y:a,p3x:T,p3y:h,p4x:g,p4y:H}),new qt({p1x:g,p1y:H,p2x:u,p2y:C,p3x:l,p3y:E,p4x:this.p4x,p4y:this.p4y})]}splitAtManyPoints(e,r=1){const n=[new qt(Er(this))];let a;for(let i=0;i<e.length;i++)for(let s=0;s<n.length;s++)n[s].containsTerminalPoint(e[i],r)||(a=n[s].splitAtPoint(e[i]),a&&n.splice(s,1,a[0],a[1]));return n}pointIsWithinMaxes(e){const r=this.maxes;return e.x<=r.xMax&&e.x>=r.xMin&&e.y<=r.yMax&&e.y>=r.yMin}convertToLine(){return new qt({p1x:this.p1x,p1y:this.p1y,p4x:this.p4x,p4y:this.p4y})}getSplitFromXYPoint(e,r=1){const n=this.quickLength*1e3;let a=999999999,i={},s,l;for(let E=0;E<1;E+=1/n)if(s=this.findXYPointFromSplit(E),l=Math.sqrt((s.x-e.x)*(s.x-e.x)+(s.y-e.y)*(s.y-e.y)),l<a&&(a=l,i={split:E,distance:l,x:s.x,y:s.y},r&&i.distance<r))return i;return i}calculateLength(){if(this.lineType)return this.baseLength;let e;if(this.quickLength<10)return this.quickLength;{const n=this.split();return e=n[0].calculateLength()+n[1].calculateLength(),e}}findXYPointFromSplit(e=.5){const r=1-e,n=this.p1x*r+this.p2x*e,a=this.p1y*r+this.p2y*e,i=this.p2x*r+this.p3x*e,s=this.p2y*r+this.p3y*e,l=this.p3x*r+this.p4x*e,E=this.p3y*r+this.p4y*e,T=n*r+i*e,h=a*r+s*e,u=i*r+l*e,C=s*r+E*e,g=T*r+u*e,H=h*r+C*e;return new Jr(g,H)}getReverse(){return new qt({p1x:this.p4x,p1y:this.p4y,p2x:this.p3x,p2y:this.p3y,p3x:this.p2x,p3y:this.p2y,p4x:this.p1x,p4y:this.p1y})}getXYPoint(e){return e===1?new Jr(this.p1x,this.p1y):e===2?new Jr(this.p2x,this.p2y):e===3?new Jr(this.p3x,this.p3y):new Jr(this.p4x,this.p4y)}getFastMaxes(){const e={xMin:Math.min(this.p1x,Math.min(this.p2x,Math.min(this.p3x,this.p4x))),yMin:Math.min(this.p1y,Math.min(this.p2y,Math.min(this.p3y,this.p4y))),xMax:Math.max(this.p1x,Math.max(this.p2x,Math.max(this.p3x,this.p4x))),yMax:Math.max(this.p1y,Math.max(this.p2y,Math.max(this.p3y,this.p4y)))};return new Kt(e)}recalculateMaxes(){function e(j,Q){j.xMin>Q?j.xMin=Q:j.xMax<Q&&(j.xMax=Q)}function r(j,Q){j.yMin>Q?j.yMin=Q:j.yMax<Q&&(j.yMax=Q)}function n(j,Q,te,se,Ie){const le=1-j;return le*le*le*Q+3*le*le*j*te+3*le*j*j*se+j*j*j*Ie}const a={xMin:Math.min(this.p1x,this.p4x),yMin:Math.min(this.p1y,this.p4y),xMax:Math.max(this.p1x,this.p4x),yMax:Math.max(this.p1y,this.p4y)};if(this.lineType){this.maxes=new Kt(a);return}const i=this.p2x-this.p1x,s=this.p2y-this.p1y;let l=this.p3x-this.p2x,E=this.p3y-this.p2y;const T=this.p4x-this.p3x,h=this.p4y-this.p3y;let u,C,g,H,F,K;(this.p2x<a.xMin||this.p2x>a.xMax||this.p3x<a.xMin||this.p3x>a.xMax)&&(i+T!==2*l&&(l+=.01),u=2*(i-l),C=2*(i-2*l+T),g=(2*l-2*i)*(2*l-2*i)-2*i*C,H=Math.sqrt(g),F=(u+H)/C,K=(u-H)/C,0<F&&F<1&&e(a,n(F,this.p1x,this.p2x,this.p3x,this.p4x)),0<K&&K<1&&e(a,n(K,this.p1x,this.p2x,this.p3x,this.p4x))),(this.p2y<a.yMin||this.p2y>a.yMax||this.p3y<a.yMin||this.p3y>a.yMax)&&(s+h!==2*E&&(E+=.01),u=2*(s-E),C=2*(s-2*E+h),g=(2*E-2*s)*(2*E-2*s)-2*s*C,H=Math.sqrt(g),F=(u+H)/C,K=(u-H)/C,0<F&&F<1&&r(a,n(F,this.p1y,this.p2y,this.p3y,this.p4y)),0<K&&K<1&&r(a,n(K,this.p1y,this.p2y,this.p3y,this.p4y))),this.maxes=new Kt(a)}isLineOverlappedByLine(e){if(!this.lineType||!e.lineType)return!1;const r=e.containsPointOnLine(this.getXYPoint(1)),n=e.containsPointOnLine(this.getXYPoint(4));return r&&n}containsTerminalPoint(e,r=1){return this.containsStartPoint(e,r)?"start":this.containsEndPoint(e,r)?"end":!1}containsStartPoint(e,r=1){return yt(this.getXYPoint(1),e,r)}containsEndPoint(e,r=1){return yt(this.getXYPoint(4),e,r)}containsPointOnCurve(e,r=.1){if(this.containsTerminalPoint(e,r))return!0;if(this.lineType)return this.containsPointOnLine(e);const n=this.getSplitFromXYPoint(e,r);return!!(n&&n.distance<r)}containsPointOnLine(e){if(!this.lineType||this.containsTerminalPoint(e))return!1;function r(n,a,i){return n<=a&&a<=i||i<=a&&a<=n}return!!(r(this.p1x,e.x,this.p4x)&&r(this.p1y,e.y,this.p4y)&&wi(this.getXYPoint(1),this.getXYPoint(4),e))}precedes(e,r=1){const n=this.getXYPoint(4),a=e.getXYPoint(1);return yt(n,a,r)}determineLineType(e=1){let r=!1;const n=oe(this.p1x,e)===oe(this.p2x,e)&&oe(this.p1x,e)===oe(this.p3x,e)&&oe(this.p1x,e)===oe(this.p4x,e),a=oe(this.p1y,e)===oe(this.p2y,e)&&oe(this.p1y,e)===oe(this.p3y,e)&&oe(this.p1y,e)===oe(this.p4y,e),i=wi(this.getXYPoint(1),this.getXYPoint(4),this.getXYPoint(2))&&wi(this.getXYPoint(1),this.getXYPoint(4),this.getXYPoint(3));return n?r="vertical":a?r="horizontal":i&&(r="diagonal"),this._lineType=r,r}roundAll(e=3){return this.p1x=oe(this.p1x,e),this.p1y=oe(this.p1y,e),this.p2x=oe(this.p2x,e),this.p2y=oe(this.p2y,e),this.p3x=oe(this.p3x,e),this.p3y=oe(this.p3y,e),this.p4x=oe(this.p4x,e),this.p4y=oe(this.p4y,e),this}}function Ua(t,e,r,n){const a=Math.abs(t-r),i=Math.abs(e-n);return Math.sqrt(a*a+i*i)}function wi(t,e,r,n){n=pt(n)?n:3;const a=(e.x-t.x)*(r.y-t.y),i=(r.x-t.x)*(e.y-t.y);return oe(a,n)===oe(i,n)}const Ic=Object.freeze(Object.defineProperty({__proto__:null,Segment:qt,getLineLength:Ua,pointsAreCollinear:wi},Symbol.toStringTag,{value:"Module"}));class Ja extends Pr{constructor({segments:e=[]}={}){super(),this.segments=e,this.objType="PolySegment"}save(e=!1){const r={segments:[]};for(let n=0;n<this._segments.length;n++)r.segments[n]=this._segments[n].save(e);return e&&(r.objType=this.objType),r}print(e=0){let r="";for(let a=0;a<e;a++)r+="  ";let n=`${r}{PolySegment
`;return r+="  ",n+=`${r}segments: [
`,this.segments.forEach(a=>{n+=a.print(e+2),n+=`
`}),n+=`${r}]
`,n+=`${r.substring(2)}}`,n}get segments(){return this._segments}set segments(e){this._segments=[];for(let r=0;r<e.length;r++)this._segments[r]=new qt(e[r])}get valuesAsArray(){let e=[];return this.segments.forEach(r=>e.push(r.valuesAsArray)),e}get path(){function e(l,E){const T={h1:{coord:{x:l.p3x,y:l.p3y}},p:{coord:{x:E.p1x,y:E.p1y}},h2:{coord:{x:E.p2x,y:E.p2y}}};return yt(T.h1.coord,T.p.coord)&&(T.h1.use=!1),yt(T.h2.coord,T.p.coord)&&(T.h2.use=!1),l.lineType&&(T.h1.use=!1),E.lineType&&(T.h2.use=!1),T}const r=[],n=Er(this._segments),a=new Jr(n[0].p1x,n[0].p1y),i=new Jr(n.at(-1).p4x,n.at(-1).p4y);yt(a,i)||n.push(new qt({p1x:i.x,p1y:i.y,p4x:a.x,p4y:a.y})),r.push(e(n.at(-1),n[0]));let s;for(let l=0;l<n.length-1;l++)s=n[l+1],r.push(e(n[l],s));return new hr({pathPoints:r})}containsSegment(e){for(let r=0;r<this._segments.length;r++)if(C0(this._segments[r],e))return!0;return!1}roundAll(e=3){for(let r=0;r<this._segments.length;r++)this._segments[r].roundAll(e);return this}findIntersections(){let e,r,n=[];for(let a=0;a<this._segments.length;a++)for(let i=a;i<this._segments.length;i++)i!==a&&(e=new qt(this._segments[a]),r=new qt(this._segments[i]),n=n.concat(es(e,r)));return n=n.filter(kn),n}splitSegmentsAtIntersections(e=this.findIntersections(),r=1){let n,a;e.forEach(function(s,l){n=s.split("/")[0],a=s.split("/")[1],e[l]=new Jr(n,a)});let i=[];for(let s=0;s<this._segments.length;s++)i=i.concat(this._segments[s].splitAtManyPoints(e,r));return this._segments=i,this.cache.splits=e,this}stitchSegmentsTogether(){const e=this.segments;let r=[];const n=[];function a(l){let E,T;for(let h=0;h<e.length;h++)if(E=e[h],E.objType==="Segment"&&E.containsStartPoint(l,0))return T=new qt(E),E.objType="-"+n.length+"."+r.length,T;for(let h=0;h<e.length;h++)if(E=e[h].getReverse(),e[h].objType==="Segment"&&E.containsStartPoint(l,0))return T=new qt(E),e[h].objType="R"+n.length+"."+r.length,T;return!1}function i(){for(let l=0;l<e.length;l++)if(e[l].objType==="Segment")return e[l].getXYPoint(1)}let s=i();for(let l=0;l<e.length;l++){let E=a(s);E?(r.push(E),s=E.getXYPoint(4)):r.length&&(n.push(new Ja({segments:r})),r[r.length-1].containsEndPoint(r[0].getXYPoint(1)),r=[],s=i(),l--)}return r.length&&(n.push(new Ja({segments:r})),r[r.length-1].containsEndPoint(r[0].getXYPoint(1))),n}removeZeroLengthSegments(){let e;for(let r=0;r<this._segments.length;r++)e=this._segments[r],yt(e.getXYPoint(1),e.getXYPoint(4))&&(e.lineType?e.objType="LINE ZERO":yt(e.getXYPoint(1),e.getXYPoint(2))&&yt(e.getXYPoint(1),e.getXYPoint(3))&&(e.objType="ZERO"));return this._segments=this._segments.filter(function(r){return r.objType==="Segment"}),this}removeRedundantLineSegments(){for(let e=0;e<this._segments.length;e++)for(let r=0;r<this._segments.length;r++)if(e!==r&&this._segments[e]&&this._segments[r]){let n=this._segments[e],a=this._segments[r];n.isLineOverlappedByLine(a)&&(n.objType="REDUNDANT"),a.isLineOverlappedByLine(n)&&(a.objType="REDUNDANT"),a.objType==="Segment"&&n.objType==="Segment"&&C0(n,a)&&(n.objType="DUPLICATE")}return this._segments=this._segments.filter(function(e){return e.objType==="Segment"}),this}removeNonConnectingSegments(){let e,r;const n=[],a=[];for(let s=0;s<this._segments.length;s++){e=this._segments[s],n[s]=!1,a[s]=!1;for(let l=0;l<this._segments.length&&(r=this._segments[l],!(s!==l&&(r.containsTerminalPoint(e.getXYPoint(1),1)&&(n[s]=!0),r.containsTerminalPoint(e.getXYPoint(4),1)&&(a[s]=!0),n[s]&&a[s])));l++);}for(let s=0;s<this._segments.length;s++)n[s]&&a[s]||(this._segments[s].objType="NON CONNECTED");return this._segments=this._segments.filter(function(s){return s.objType==="Segment"}),this}combineInlineSegments(){let e,r;for(let n=0;n<this.segments.length;n++)e=this.segments[n],r=this.segments[n+1],n===this.segments.length-1&&(r=this.segments[0]),e.lineType===r.lineType&&(this.segments[n]=new qt({p1x:e.p1x,p1y:e.p1y,p4x:r.p4x,p4y:r.p4y}),this.segments.splice(n+1,1),n--)}}function es(t,e,r=0){if(r===0){const K=U1(t,e);if(K.length)return K}if(r===0){const K=w1(t,e);if(K.length)return K}let n=[];r===0&&(t.lineType||e.lineType)&&(n=Y1(t,e));const a=t.getFastMaxes(),i=e.getFastMaxes();if(!ji(a,i))return[];const s=9e-4,l=3;let E=a.xMax-a.xMin,T=a.yMax-a.yMin,h=i.xMax-i.xMin,u=i.yMax-i.yMin;if(E<s&&T<s&&h<s&&u<s){E*=.5,T*=.5,h*=.5,u*=.5;let K=(a.xMin+E+(i.xMin+h))/2,j=(a.yMin+T+(i.yMin+u))/2;return K=oe(K,l),j=oe(j,l),[""+K+"/"+j]}let C=[];const g=t.splitAtTime(.5),H=e.splitAtTime(.5);let F=[[g[0],H[0]],[g[0],H[1]],[g[1],H[1]],[g[1],H[0]]];return F=F.filter(function(K){return ji(K[0].getFastMaxes(),K[1].getFastMaxes(),"inclusive")}),F.forEach(function(K){C=C.concat(es(K[0],K[1],r+1))}),C=C.concat(n),C=C.filter(kn),C}function C0(t,e,r=1){if(yt(t.getXYPoint(1),e.getXYPoint(1),r)&&yt(t.getXYPoint(4),e.getXYPoint(4),r)){if(t.lineType&&e.lineType)return!0;if(yt(t.getXYPoint(2),e.getXYPoint(2),r)&&yt(t.getXYPoint(3),e.getXYPoint(3),r))return!0}return!1}function U1(t,e){const r=[];return t.containsPointOnLine(e.getXYPoint(1))&&r.push(""+e.p1x+"/"+e.p1y),t.containsPointOnLine(e.getXYPoint(4))&&r.push(""+e.p4x+"/"+e.p4y),e.containsPointOnLine(t.getXYPoint(1))&&r.push(""+t.p1x+"/"+t.p1y),e.containsPointOnLine(t.getXYPoint(4))&&r.push(""+t.p4x+"/"+t.p4y),r.length,r}function w1(t,e){if(!t.lineType||!e.lineType)return[];const r=t.p4x-t.p1x,n=t.p4y-t.p1y,a=e.p4x-e.p1x,i=e.p4y-e.p1y,s=(-1*n*(t.p1x-e.p1x)+r*(t.p1y-e.p1y))/(-1*a*n+r*i),l=(a*(t.p1y-e.p1y)-i*(t.p1x-e.p1x))/(-1*a*n+r*i);if(s>=0&&s<=1&&l>=0&&l<=1){const E=Ar(t.p1x+l*r),T=Ar(t.p1y+l*n);return t.containsTerminalPoint({x:E,y:T})&&e.containsTerminalPoint({x:E,y:T})?[]:[""+E+"/"+T]}return[]}function Y1(t,e){const r=t.getXYPoint(1),n=t.getXYPoint(4),a=e.getXYPoint(1),i=e.getXYPoint(4),s=[];return t.containsPointOnCurve(a)&&s.push(`${a.x}/${a.y}`),t.containsPointOnCurve(i)&&s.push(`${i.x}/${i.y}`),e.containsPointOnCurve(r)&&s.push(`${r.x}/${r.y}`),e.containsPointOnCurve(n)&&s.push(`${n.x}/${n.y}`),s}const uc=Object.freeze(Object.defineProperty({__proto__:null,PolySegment:Ja,findCrossingLineSegmentIntersections:w1,findEndPointSegmentIntersections:Y1,findOverlappingLineSegmentIntersections:U1,findSegmentIntersections:es,segmentsAreEqual:C0},Symbol.toStringTag,{value:"Module"}));let hr=class extends Pr{constructor({name:e="Path",objType:r="Path",pathPoints:n=[],winding:a,xLock:i=!1,yLock:s=!1,wLock:l=!1,hLock:E=!1,transformOrigin:T="",ratioLock:h=!1,parent:u=!1}={}){super(),this.name=e,this.pathPoints=n,this.winding=a,this.xLock=i,this.yLock=s,this.wLock=l,this.hLock=E,this.transformOrigin=T,this.ratioLock=h,this.parent=u,this.link=!1,this.objType=r}save(e=!1){const r={name:this.name,winding:this.winding,pathPoints:[]};return this.xLock&&(r.xLock=!0),this.yLock&&(r.yLock=!0),this.wLock&&(r.wLock=!0),this.hLock&&(r.hLock=!0),this.transformOrigin&&this.transformOrigin!=="baseline-left"&&(r.transformOrigin=this.transformOrigin),this.ratioLock&&(r.ratioLock=!0),this.pathPoints.forEach(n=>{r.pathPoints.push(n.save(e))}),e&&(r.objType=this.objType),r}print(e=0){let r="";for(let a=0;a<e;a++)r+="  ";let n=`${r}{Path
`;return r+="  ",n+=`${r}winding: ${this.winding}
`,this.name!=="Path"&&(n+=`${r}name: ${this.name}
`),this.xLock&&(n+=`${r}xLock: ${this.xLock}
`),this.yLock&&(n+=`${r}yLock: ${this.yLock}
`),this.wLock&&(n+=`${r}wLock: ${this.wLock}
`),this.hLock&&(n+=`${r}hLock: ${this.hLock}
`),this.ratioLock&&(n+=`${r}ratioLock: ${this.ratioLock}
`),n+=`${r}pathPoints: [
`,this.pathPoints.forEach((a,i)=>{n+=a.print(e+2,i),n+=`
`}),n+=`${r}]
`,n+=`${r.substring(2)}}/Path`,n}get name(){return this._name||""}get pathPoints(){return this._pathPoints||[]}get winding(){return pt(this._winding)||(this.findWinding?this.findWinding():this._winding=0),this._winding||0}get x(){return this.maxes.xMin}get y(){return this.maxes.yMax}get height(){const e=this.maxes.yMax-this.maxes.yMin;return Math.max(e,0)}get width(){const e=this.maxes.xMax-this.maxes.xMin;return Math.max(e,0)}get xLock(){return!!this._xLock}get yLock(){return!!this._yLock}get wLock(){return!!this._wLock}get hLock(){return!!this._hLock}get transformOrigin(){return this._transformOrigin||(this._transformOrigin="baseline-left"),this._transformOrigin}get ratioLock(){return!!this._ratioLock}get maxes(){return this.cache.maxes?So(this.cache.maxes)?this.recalculateMaxes():q0(this.cache.maxes)&&this.recalculateMaxes():this.recalculateMaxes(),new Kt(this.cache.maxes)}get svgPathData(){return this.cache.svgPathData?this.cache.svgPathData:(this.cache.svgPathData=this.makeSVGPathData(),this.cache.svgPathData)}set name(e){e=V0(e),e!==""&&(this._name=e)}set pathPoints(e){if(this._pathPoints=[],e&&e.length)for(let r=0;r<e.length;r++)this._pathPoints[r]=new _t(e[r]),this._pathPoints[r].parent=this}set winding(e){pt(e)?this._winding=e:this.findWinding()}set x(e){this.setShapePosition(e,!1)}set y(e){this.setShapePosition(!1,e)}set height(e){this.setShapeSize({height:e})}set width(e){this.setShapeSize({width:e})}set xLock(e){this._xLock=!!e}set yLock(e){this._yLock=!!e}set wLock(e){this._wLock=!!e}set hLock(e){this._hLock=!!e}set transformOrigin(e){ti.indexOf(e)>-1?this._transformOrigin=e:this._transformOrigin="baseline-left"}set ratioLock(e){this._ratioLock=!!e}set maxes(e){this.cache.maxes={},this.cache.maxes=new Kt(e)}set svgPathData(e){this.cache.svgPathData=e}get isLockable(){return!0}isLocked(e){return e==="x"?this.xLock:e==="y"?this.yLock:e==="width"?this.wLock:e==="height"?this.hLock:!1}lock(e){e==="x"&&(this.xLock=!0),e==="y"&&(this.yLock=!0),e==="width"&&(this.wLock=!0),e==="height"&&(this.hLock=!0)}unlock(e){e==="x"&&(this.xLock=!1),e==="y"&&(this.yLock=!1),e==="width"&&(this.wLock=!1),e==="height"&&(this.hLock=!1)}setShapeSize({width:e=!1,height:r=!1,ratioLock:n=!1,transformOrigin:a=!1}={}){e!==!1&&(e=He(e)),r!==!1&&(r=He(r));const i=e!==!1?e-this.width:0,s=r!==!1?r-this.height:0;return this.updateShapeSize({width:i,height:s,ratioLock:n,transformOrigin:a}),this}updateShapeSize({width:e=0,height:r=0,ratioLock:n=!1,transformOrigin:a=!1}={}){let i=He(e),s=He(r);if(!i&&!s)return;if(n&&i!==s){const K=this.width/this.height;Math.abs(i)>Math.abs(s)?s=i/K:i=s*K}let l=this.width;l===0&&(l=1);let E=this.height;E===0&&(E=1);const T=Math.max(l+i,1),h=Math.max(E+s,1),u=h/E,C=T/l;if(n&&(T<=1||h<=1))return;let g=J0(i,s,this.maxes,a),H=this.maxes.xMin,F=this.maxes.yMin;this.pathPoints.forEach(K=>{K.p.coord.x=(K.p.coord.x-this.maxes.xMin)*C+H,K.h1.coord.x=(K.h1.coord.x-this.maxes.xMin)*C+H,K.h2.coord.x=(K.h2.coord.x-this.maxes.xMin)*C+H,K.p.coord.y=(K.p.coord.y-this.maxes.yMin)*u+F,K.h1.coord.y=(K.h1.coord.y-this.maxes.yMin)*u+F,K.h2.coord.y=(K.h2.coord.y-this.maxes.yMin)*u+F}),this.updateShapePosition(g.deltaX,g.deltaY)}setShapePosition(e=!1,r=!1){e!==!1&&(e=He(e)),r!==!1&&(r=He(r));const n=e!==!1?e*1-this.maxes.xMin:0,a=r!==!1?r*1-this.maxes.yMax:0;this.updateShapePosition(n,a)}updateShapePosition(e=0,r=0){e=He(e),r=He(r);for(let n=0;n<this.pathPoints.length;n++)this.pathPoints[n].updatePathPointPosition("p",e,r)}rotate(e,r=this.maxes.center){for(let n=0;n<this.pathPoints.length;n++)this.pathPoints[n].rotate(e,r)}getNextPointNum(e=0){return e=He(e),e+=1,e=e%this.pathPoints.length,e}getPreviousPointNum(e=0){return e=He(e),e-=1,e<0&&(e=e+this.pathPoints.length),e}containsPoint(e,r){for(let n=0;n<this.pathPoints.length;n++)if(yt(e,this.pathPoints[n].p,.01))if(r)r=!1;else return this.pathPoints[n];return!1}makeSVGPathData(e="not specified",r=8){if(!this.pathPoints||!this.pathPoints.length)return"";let n,a,i="",s="M"+oe(this.pathPoints[0].p.x,r)+","+oe(this.pathPoints[0].p.y,r);s.indexOf("NaN")>-1&&console.warn(e+" PathPoint 0 MOVE has NaN: "+s);for(let l=0;l<this.pathPoints.length;l++)n=this.pathPoints[l],a=this.pathPoints[this.getNextPointNum(l)],i=" C"+oe(n.h2.x,r)+","+oe(n.h2.y,r)+","+oe(a.h1.x,r)+","+oe(a.h1.y,r)+","+oe(a.p.x,r)+","+oe(a.p.y,r),i.indexOf("NaN")>-1&&console.warn(e+" PathPoint "+l+" has NaN: "+i),s+=i;return s+="Z",s}makePostScript(e=0,r=0){if(!this.pathPoints)return{re:"",lastX:e,lastY:r};let n,a,i,s,l,E,T,h,u="",C=`${this.pathPoints[0].p.x-e} ${this.pathPoints[0].p.y-r} rmoveto
		`;for(let g=0;g<this.pathPoints.length;g++)n=this.pathPoints[g],a=this.pathPoints[this.getNextPointNum(g)],i=n.h2.x-n.p.x,s=n.h2.y-n.p.y,l=a.h1.x-n.h2.x,E=a.h1.y-n.h2.y,T=a.p.x-a.h1.x,h=a.p.y-a.h1.y,u=`
					${i} ${s} ${l} ${E} ${T} ${h} rrcurveto
			`,C+=u;return{re:C.replaceAll("	",""),lastX:a.p.x,lastY:a.p.y}}makePolySegment(){const e=[];for(let n=0;n<this.pathPoints.length;n++)e.push(this.makeSegment(n));return new Ja({segments:e})}makeSegment(e=0){if(e=e%this.pathPoints.length,this.cache.segments||(this.cache.segments=[]),this.cache.segments[e])return this.cache.segments[e];const r=this.pathPoints[e];let n=Math.round(Math.random()*1e4);r.pointID||(r.pointID=`point-${e}-${n}`);const a=this.getNextPointNum(e),i=this.pathPoints[a];i.pointID||(i.pointID=`point-${a}-${n}`);const s=new qt({point1ID:r.pointID,p1x:r.p.x,p1y:r.p.y,p2x:r.h2.x,p2y:r.h2.y,p3x:i.h1.x,p3y:i.h1.y,p4x:i.p.x,p4y:i.p.y,point2ID:i.pointID});return this.cache.segments[e]=s,s}addPointsAtPathIntersections(){const e=this.makePolySegment();e.splitSegmentsAtIntersections();const r=e.path;this._pathPoints=r.pathPoints}calculateQuickSegmentLength(e=0){return this.makeSegment(e).quickLength}findWinding(e=!1){let r,n,a,i=-1;const s=this.pathPoints;if(s.length===2)i=s[1].p.x>s[0].p.x?-1:1;else if(s.length>2)for(let l=0;l<s.length;l++)r=(l+1)%s.length,n=(l+2)%s.length,a=(s[r].p.x-s[l].p.x)*(s[n].p.y-s[r].p.y),a-=(s[r].p.y-s[l].p.y)*(s[n].p.x-s[r].p.x),a<0?i--:a>0&&i++;return i===0&&!e&&(this.reverseWinding(),i=this.findWinding(!0)*-1,this.reverseWinding()),this._winding=i,i}reverseWinding(){let e;this.pathPoints&&(this.pathPoints.forEach(r=>{e=r.h1,r.h1=r.h2,r.h2=e}),this.pathPoints.reverse(),this.winding*=-1,(this.winding===0||!pt(this.winding))&&this.findWinding(!0))}flipNS(e=this.maxes.center.y){this.pathPoints.forEach(r=>{r.p.coord.y+=(e-r.p.coord.y)*2,r.h1.coord.y+=(e-r.h1.coord.y)*2,r.h2.coord.y+=(e-r.h2.coord.y)*2}),this.reverseWinding()}flipEW(e=this.maxes.center.x){this.pathPoints.forEach(r=>{r.p.coord.x+=(e-r.p.coord.x)*2,r.h1.coord.x+=(e-r.h1.coord.x)*2,r.h2.coord.x+=(e-r.h2.coord.x)*2}),this.reverseWinding()}roundAll(e=0){return this.pathPoints.forEach(r=>r.roundAll(e)),this}addPathPoint(e){return e=new _t(e),e.parent=this,this.pathPoints.push(e),this.findWinding(),this.changed(),e}insertPathPoint(e=0,r=.5,n=!1){const a=this.pathPoints[e],i=this.getNextPointNum(e),s=this.pathPoints[i];let l,E,T,h;if(this.pathPoints.length>1){const u=this.makeSegment(e).split(r),C=u[0],g=u[1];l=new ke({coord:{x:C.p4x,y:C.p4y}}),E=new ke({coord:{x:C.p3x,y:C.p3y}}),T=new ke({coord:{x:g.p2x,y:g.p2y}}),h=new _t({p:l,h1:E,h2:T}),a.type==="symmetric"&&(a.type="flat"),a.h2.x=C.p2x,a.h2.y=C.p2y,s.type==="symmetric"&&(s.type="flat"),s.h1.x=g.p3x,s.h1.y=g.p3y}else l=new ke({coord:{x:a.p.x+100,y:a.p.y+100}}),E=new ke({coord:{x:a.h2.x+100,y:a.h2.y+100}}),T=new ke({coord:{x:a.h1.x+100,y:a.h1.y+100}}),h=new _t({p:l,h1:E,h2:T,type:a.type});return n&&h.roundAll(0),h.parent=this,this.pathPoints.splice(i,0,h),h}findClosestPointOnCurve(e=new Jr,r=!1){let n=1e4,a=!1,i,s=999999999,l,E;for(let h=0;h<this.pathPoints.length;h++){n=this.makeSegment(h).quickLength*100;for(let u=0;u<1;u+=1/n)l=this.findXYPointFromSplit(u,h),E=Math.sqrt((l.x-e.x)*(l.x-e.x)+(l.y-e.y)*(l.y-e.y)),E<s&&(a&&a.point!==h&&(i=Er(a)),s=E,a={point:h,split:u,distance:E,x:l.x,y:l.y})}return r?i:a}findXYPointFromSplit(e=.5,r=0){return this.pathPoints.length>1?this.makeSegment(r).findXYPointFromSplit(e):this.pathPoints[0].p}recalculateMaxes(){this.cache.maxes=new Kt,this.cache.segments||(this.cache.segments=[]);let e=this.pathPoints.map((r,n)=>this.makeSegment(n).maxes);this.cache.maxes=za(e)}checkForNaN(){for(let e=0;e<this.pathPoints.length;e++){const r=this.pathPoints[e];if(isNaN(r.p.x)||isNaN(r.p.y)||isNaN(r.h1.x)||isNaN(r.h1.y)||isNaN(r.h2.x)||isNaN(r.h2.y))return!0}return!1}};const pc=Object.freeze(Object.defineProperty({__proto__:null,Path:hr},Symbol.toStringTag,{value:"Module"}));let ct=class extends Pr{constructor({id:e="",parent:r=!1,objType:n="Glyph",name:a="",shapes:i=[],advanceWidth:s=0,transformOrigin:l="",ratioLock:E=!1,usedIn:T=[],gsub:h=[],contextCharacters:u=""}={}){if(super(),this.id=e,this.parent=r,this.objType=n,this.name=a,this.shapes=i,this.advanceWidth=s,this.transformOrigin=l,this.ratioLock=E,this.usedIn=T,this.gsub=h,this.contextCharacters=u,this.hasChangedThisSession=!1,this.wasCreatedThisSession=!0,this.id&&this.id.startsWith("liga-")&&this.gsub.length===0){let C=this.id.split("-");C.shift(),this.gsub=C.map(g=>u1(g)?Number(g):g.codePointAt(0))}}save(e=!1){const r={id:this.id};this.advanceWidth!==0&&(r.advanceWidth=this.advanceWidth),this.transformOrigin&&this.transformOrigin!=="baseline-left"&&(r.transformOrigin=this.transformOrigin),this.ratioLock!==!1&&(r.ratioLock=this.ratioLock),this.usedIn.length&&(r.usedIn=this.usedIn),this.gsub.length&&(r.gsub=this.gsub);let n=this.contextCharacters;if(n.length&&n!==this.char&&(r.contextCharacters=n),this.shapes&&this.shapes.length){r.shapes=[];for(let a=0;a<this.shapes.length;a++)r.shapes.push(this.shapes[a].save(e))}return e&&(r.objType=this.objType,r.name=this.name),r}print(e=0){let r="";for(let a=0;a<e;a++)r+="  ";let n=`${r}{Glyph
`;return r+="  ",n+=`${r}id: ${this.id}
`,n+=`${r}name: ${this.name}
`,this.advanceWidth!==0&&(n+=`${r}advanceWidth: ${this.advanceWidth}
`),this.transformOrigin!==!1&&(n+=`${r}transformOrigin: ${this.transformOrigin}
`),this.ratioLock!==!1&&(n+=`${r}ratioLock: ${this.ratioLock}
`),this.usedIn.length&&(n+=`${r}usedIn: ${JSON.stringify(this.usedIn)}
`),this.gsub.length&&(n+=`${r}gsub: ${JSON.stringify(this.gsub)}
`),this.shapes&&this.shapes.length?(n+=`${r}shapes: [
`,this.shapes.forEach(a=>{n+=a.print(e+2),n+=`
`}),n+=`${r}]
`):n+=`${r}shapes: []
`,this.maxes&&(n+=`${r}maxes: ${this.maxes.print(e+1)}
`),n+=`${r.substring(2)}}/Glyph ${this.id}`,n}get shapes(){return this._shapes||[]}get advanceWidth(){return this._advanceWidth||0}get transformOrigin(){return this._transformOrigin||(this._transformOrigin="baseline-left"),this._transformOrigin||""}get ratioLock(){return this._ratioLock||!1}get usedIn(){return this._usedIn||[]}get gsub(){return this._gsub||[]}get contextCharacters(){return!this._contextCharacters||this._contextCharacters===this.char?this.char:this._contextCharacters}get sessionState(){return this.hasChangedThisSession===!0?"changed":this.wasCreatedThisSession===!0?"new":"old"}get x(){return this.maxes.xMin}get y(){return this.maxes.yMax}get width(){const e=this.maxes.xMax-this.maxes.xMin;return Math.max(e,0)}get height(){const e=this.maxes.yMax-this.maxes.yMin;return Math.max(e,0)}get leftSideBearing(){return this.maxes.xMin}get rightSideBearing(){let e=this.maxes.xMax;return this.advanceWidth-e}get name(){let e=this._name;if(!e&&!this.id)return"[no id]";if(!e){if(this.id.startsWith("liga-")){let n=mr(this.id,"liga-").split("-");e="Ligature ",n.forEach(a=>{a.length===1?e+=a:e+=Mr(a)})}else if(this.id.startsWith("comp-"))e=`Component ${mr(this.id,"comp-")}`;else if(this.id.startsWith("glyph-")){let r=mr(this.id,"glyph-");e=Da(r)}this._name=e}return e}get char(){let e;return this.gsub.length?e=this.gsub.reduce((r,n)=>`${r}${String.fromCodePoint(n)}`,""):e=Mr(mr(this.id,"glyph-")),e}get chars(){return this.char}get contentType(){if(this.cache.contentType)return this.cache.contentType;let e="unknown",r=0,n=0;return this.shapes.forEach(a=>{a.objType==="ComponentInstance"&&n++,a.objType==="Path"&&r++}),r>0&&n===0&&(e="paths"),n>0&&r===0&&(e="component instances"),r>0&&n>0&&(e="items"),this.cache.contentType=e,e}get pointCount(){let e=0;return this.shapes.forEach(r=>{r.objType==="ComponentInstance"?e+=r.pointCount:r.pathPoints.forEach(n=>{var a,i;e++,(a=n==null?void 0:n.h1)!=null&&a.use&&e++,(i=n==null?void 0:n.h2)!=null&&i.use&&e++})}),e}set shapes(e){this._shapes=[],e&&e.length&&e.forEach(r=>{this.addOneShape(r)}),this.changed()}addOneShape(e={}){if(e)return Array.isArray(this._shapes)||(this._shapes=[]),e!=null&&e.link?(e.parent=this,this._shapes.push(new hn(e))):(e.parent=this,this._shapes.push(new hr(e))),this.changed(),this._shapes.at(-1)}set advanceWidth(e){this._advanceWidth=He(e),isNaN(this._advanceWidth)&&(this._advanceWidth=0)}set transformOrigin(e){ti.indexOf(e)>-1?this._transformOrigin=e:this._transformOrigin=!1}set ratioLock(e){this._ratioLock=!!e}set usedIn(e){this._usedIn=e||[]}set gsub(e){this._gsub=e||[]}set contextCharacters(e){!e||e===this.char||typeof e!="string"?delete this._contextCharacters:this._contextCharacters=e}set name(e){this._name=e}set x(e){this.setGlyphPosition(e,!1)}set y(e){this.setGlyphPosition(!1,e)}set width(e){this.setGlyphSize({width:e})}set height(e){this.setGlyphSize({height:e})}set leftSideBearing(e){let r=e-this.leftSideBearing;this.setGlyphPosition(e),this.advanceWidth+=r}set rightSideBearing(e){let r=e-this.rightSideBearing;this.advanceWidth+=r}setGlyphPosition(e=!1,r=!1,n=!0){const a=this.maxes;e!==!1&&(e=He(e)),r!==!1&&(r=He(r));const i=e!==!1?e-a.xMin:0,s=r!==!1?r-a.yMax:0;this.updateGlyphPosition(i,s,n)}updateGlyphPosition(e=0,r=0,n=!0){e=He(e)||0,r=He(r)||0;for(let a=0;a<this.shapes.length;a++){const i=this.shapes[a];i.objType==="ComponentInstance"&&!n||i.updateShapePosition(e,r)}}setGlyphSize({width:e=!1,height:r=!1,ratioLock:n=!1,updateComponentInstances:a=!0,transformOrigin:i=""}={}){const s=this.maxes;e!==!1&&(e=He(e)),r!==!1&&(r=He(r));const l=s.yMax-s.yMin,E=s.xMax-s.xMin;let T=e!==!1?e-E:0,h=r!==!1?r-l:0;r=He(r),e=He(e),n&&(Math.abs(r)>Math.abs(e)?T=E*(r/l)-E:h=l*(e/E)-l),this.updateGlyphSize({width:T,height:h,updateComponentInstances:a,transformOrigin:i})}updateGlyphSize({width:e=0,height:r=0,ratioLock:n=!1,updateComponentInstances:a=!0,transformOrigin:i=""}={}){const s=this.maxes;let l=He(e)||0,E=He(r)||0;const T=s.width,h=s.height;let u=T+l,C=h+E;Math.abs(u)<1&&(u=1),Math.abs(C)<1&&(C=1);let g=C/h,H=u/T;n&&(l!==0&&E===0?(g=H,C=h*g,E=C-h):(H=g,u=T*H,l=u-T));const F=J0(l,E,this.maxes,i);this.shapes.forEach(K=>{if(K.objType==="ComponentInstance"&&!a)return;const j=K.maxes,Q=j.xMax-j.xMin,te=Q*H;let se=0;H!==0&&(se=te-Q);const Ie=j.yMax-j.yMin,le=Ie*g;let ue=0;g!==0&&(ue=le-Ie),K.updateShapeSize({width:se,height:ue,transformOrigin:"bottom-left"});const ve=j.xMin-s.xMin,Ye=ve*H;let Re=0;H!==0&&(Re=Ye-ve);const Me=j.yMin-s.yMin,xt=Me*g;let Oe=0;g!==0&&(Oe=xt-Me),K.updateShapePosition(Re,Oe,!0)}),this.updateGlyphPosition(F.deltaX,F.deltaY)}flipNS(e=this.maxes.center.y){for(let r=0;r<this.shapes.length;r++)this.shapes[r].flipNS(e);return this}flipEW(e=this.maxes.center.x){for(let r=0;r<this.shapes.length;r++)this.shapes[r].flipEW(e);return this}roundAll(e=0){return this.shapes.forEach(r=>{r.roundAll&&r.roundAll(e)}),this}rotate(e,r){r=r||this.maxes.center;for(let n=0;n<this.shapes.length;n++)this.shapes[n].rotate(e,r);return this}reverseWinding(){for(let e=0;e<this.shapes.length;e++)this.shapes[e].reverseWinding();return this}get svgPathData(){var e;return(e=this==null?void 0:this.cache)!=null&&e.svgPathData||(this.cache.svgPathData=this.makeSVGPathData()),this.cache.svgPathData}makeSVGPathData(){let e="M0,0";return this.shapes.forEach(r=>{if(r.objType==="ComponentInstance"){const n=r.transformedGlyph;n&&(e+=n.svgPathData)}else e+=r.svgPathData,e+=" "}),z0(e)==="M0,0"&&(e="M0,0Z"),e}get maxes(){return this.cache.maxes?So(this.cache.maxes)?this.recalculateGlyphMaxes():q0(this.cache.maxes)&&this.recalculateGlyphMaxes():this.recalculateGlyphMaxes(),this.cache.maxes}recalculateGlyphMaxes(){let e={xMax:0,xMin:0,yMax:0,yMin:0};return this.shapes&&this.shapes.length>0&&(e=za(this.shapes.map(r=>r.maxes))),this.cache.maxes=new Kt(e),this.cache.maxes}};const Sc=Object.freeze(Object.defineProperty({__proto__:null,Glyph:ct},Symbol.toStringTag,{value:"Module"}));function Za(t,e=!0){const r=Ec(t);if(e&&r.length===0)return Ir(`
			Could not find any SVG tags to import.
			Supported tags are: &lt;path&gt;, &lt;rect&gt;, &lt;polygon&gt;, &lt;polyline&gt;, and &lt;ellipse&gt;.`),new ct;let n=0,a=[];r.forEach(s=>{if(s=s.filter(l=>!(l[0].x===l[3].x&&l[0].y===l[3].y&&l[1]===!1&&l[2]===!1)),s.length){n++;const l=s[0][0].x===s.at(-1)[3].x&&s[0][0].y===s.at(-1)[3].y;let E=new hr({name:`Path ${n}`}),T;l||(T=new _t,T.p=new ke({coord:new an({x:s[0][0].x,y:s[0][0].y})}),s[0][1]&&(T.h2=new ke({coord:new an({x:s[0][1].x,y:s[0][1].y})})),E.addPathPoint(T));for(let h=0;h<s.length-1;h++)E.addPathPoint(Vs(s[h],s[h+1]));l?E.addPathPoint(Vs(s.at(-1),s[0])):(T=new _t,T.p=new ke({coord:new an({x:s.at(-1)[3].x,y:s.at(-1)[3].y})}),s.at(-1)[2]&&(T.h1=new ke({coord:new an({x:s.at(-1)[2].x,y:s.at(-1)[2].y})})),E.addPathPoint(T)),a.push(E)}});const i=new ct({shapes:a});return i.changed(),i}function Vs(t,e){t[3].x!==e[0].x||(t[3].y,e[0].y);let r=new _t;return r.p=new ke({coord:{x:e[0].x,y:e[0].y}}),t[2]&&(r.h1=new ke({coord:{x:t[2].x,y:t[2].y},use:!0})),e[1]&&(r.h2=new ke({coord:{x:e[1].x,y:e[1].y},use:!0})),r}function qi(t,e="SVG"){const r=Za(t);if(r&&r.shapes.length){r.flipNS(),r.reverseWinding();const n=z(),a=ta(r,n.selectedItem);n.history.addState("Imported SVG to glyph "+n.selectedItem.name);const i=n.multiSelect.shapes;i.clear(),a.forEach(s=>i.add(s)),ce().settings.app.moveShapesOnSVGDragDrop&&i.setShapePosition(0,i.maxes.height),n.publish("currentItem",n.selectedItem),ge(`Imported ${r.shapes.length} shapes from ${e}`)}else ge("Could not import pasted SVG code.")}async function R0(t){var r;const e=t.clipboardData||window.clipboardData;if(e){let n=e.getData("Text");qi(n,"<br>the operating system clipboard")}else if((r=navigator==null?void 0:navigator.clipboard)!=null&&r.readText)navigator.clipboard.readText().then(n=>{n?qi(n,"<br>the operating system clipboard"):ge("Could not import SVG from the operating system clipboard")});else{ge("Could not import SVG from the operating system clipboard");return}}function gc(t){nt(t);const r=t.dataTransfer.files[0];if(r!=null&&r.name){const n=r.name.split("."),a=n[n.length-1].toLowerCase(),i=new FileReader;a==="svg"?(i.onload=function(){qi(i.result.toString(),"<br>from the dropped SVG file")},i.readAsText(r)):ge("Only SVG files can be dropped on the canvas")}else ge("Error reading file.")}var ts=0,W1=-3;function ja(){this.table=new Uint16Array(16),this.trans=new Uint16Array(288)}function Cc(t,e){this.source=t,this.sourceIndex=0,this.tag=0,this.bitcount=0,this.dest=e,this.destLen=0,this.ltree=new ja,this.dtree=new ja}var k1=new ja,K1=new ja,rs=new Uint8Array(30),ns=new Uint16Array(30),_1=new Uint8Array(30),V1=new Uint16Array(30),Rc=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),zs=new ja,Yr=new Uint8Array(320);function z1(t,e,r,n){var a,i;for(a=0;a<r;++a)t[a]=0;for(a=0;a<30-r;++a)t[a+r]=a/r|0;for(i=n,a=0;a<30;++a)e[a]=i,i+=1<<t[a]}function yc(t,e){var r;for(r=0;r<7;++r)t.table[r]=0;for(t.table[7]=24,t.table[8]=152,t.table[9]=112,r=0;r<24;++r)t.trans[r]=256+r;for(r=0;r<144;++r)t.trans[24+r]=r;for(r=0;r<8;++r)t.trans[168+r]=280+r;for(r=0;r<112;++r)t.trans[176+r]=144+r;for(r=0;r<5;++r)e.table[r]=0;for(e.table[5]=32,r=0;r<32;++r)e.trans[r]=r}var Js=new Uint16Array(16);function zo(t,e,r,n){var a,i;for(a=0;a<16;++a)t.table[a]=0;for(a=0;a<n;++a)t.table[e[r+a]]++;for(t.table[0]=0,i=0,a=0;a<16;++a)Js[a]=i,i+=t.table[a];for(a=0;a<n;++a)e[r+a]&&(t.trans[Js[e[r+a]]++]=a)}function mc(t){t.bitcount--||(t.tag=t.source[t.sourceIndex++],t.bitcount=7);var e=t.tag&1;return t.tag>>>=1,e}function zr(t,e,r){if(!e)return r;for(;t.bitcount<24;)t.tag|=t.source[t.sourceIndex++]<<t.bitcount,t.bitcount+=8;var n=t.tag&65535>>>16-e;return t.tag>>>=e,t.bitcount-=e,n+r}function y0(t,e){for(;t.bitcount<24;)t.tag|=t.source[t.sourceIndex++]<<t.bitcount,t.bitcount+=8;var r=0,n=0,a=0,i=t.tag;do n=2*n+(i&1),i>>>=1,++a,r+=e.table[a],n-=e.table[a];while(n>=0);return t.tag=i,t.bitcount-=a,e.trans[r+n]}function fc(t,e,r){var n,a,i,s,l,E;for(n=zr(t,5,257),a=zr(t,5,1),i=zr(t,4,4),s=0;s<19;++s)Yr[s]=0;for(s=0;s<i;++s){var T=zr(t,3,0);Yr[Rc[s]]=T}for(zo(zs,Yr,0,19),l=0;l<n+a;){var h=y0(t,zs);switch(h){case 16:var u=Yr[l-1];for(E=zr(t,2,3);E;--E)Yr[l++]=u;break;case 17:for(E=zr(t,3,3);E;--E)Yr[l++]=0;break;case 18:for(E=zr(t,7,11);E;--E)Yr[l++]=0;break;default:Yr[l++]=h;break}}zo(e,Yr,0,n),zo(r,Yr,n,a)}function Zs(t,e,r){for(;;){var n=y0(t,e);if(n===256)return ts;if(n<256)t.dest[t.destLen++]=n;else{var a,i,s,l;for(n-=257,a=zr(t,rs[n],ns[n]),i=y0(t,r),s=t.destLen-zr(t,_1[i],V1[i]),l=s;l<s+a;++l)t.dest[t.destLen++]=t.dest[l]}}}function Nc(t){for(var e,r,n;t.bitcount>8;)t.sourceIndex--,t.bitcount-=8;if(e=t.source[t.sourceIndex+1],e=256*e+t.source[t.sourceIndex],r=t.source[t.sourceIndex+3],r=256*r+t.source[t.sourceIndex+2],e!==(~r&65535))return W1;for(t.sourceIndex+=4,n=e;n;--n)t.dest[t.destLen++]=t.source[t.sourceIndex++];return t.bitcount=0,ts}function J1(t,e){var r=new Cc(t,e),n,a,i;do{switch(n=mc(r),a=zr(r,2,0),a){case 0:i=Nc(r);break;case 1:i=Zs(r,k1,K1);break;case 2:fc(r,r.ltree,r.dtree),i=Zs(r,r.ltree,r.dtree);break;default:i=W1}if(i!==ts)throw new Error("Data error")}while(!n);return r.destLen<r.dest.length?typeof r.dest.slice=="function"?r.dest.slice(0,r.destLen):r.dest.subarray(0,r.destLen):r.dest}yc(k1,K1);z1(rs,ns,4,3);z1(_1,V1,2,1);rs[28]=0;ns[28]=258;function aa(t,e,r,n,a){return Math.pow(1-a,3)*t+3*Math.pow(1-a,2)*a*e+3*(1-a)*Math.pow(a,2)*r+Math.pow(a,3)*n}function Xn(){this.x1=Number.NaN,this.y1=Number.NaN,this.x2=Number.NaN,this.y2=Number.NaN}Xn.prototype.isEmpty=function(){return isNaN(this.x1)||isNaN(this.y1)||isNaN(this.x2)||isNaN(this.y2)};Xn.prototype.addPoint=function(t,e){typeof t=="number"&&((isNaN(this.x1)||isNaN(this.x2))&&(this.x1=t,this.x2=t),t<this.x1&&(this.x1=t),t>this.x2&&(this.x2=t)),typeof e=="number"&&((isNaN(this.y1)||isNaN(this.y2))&&(this.y1=e,this.y2=e),e<this.y1&&(this.y1=e),e>this.y2&&(this.y2=e))};Xn.prototype.addX=function(t){this.addPoint(t,null)};Xn.prototype.addY=function(t){this.addPoint(null,t)};Xn.prototype.addBezier=function(t,e,r,n,a,i,s,l){const E=[t,e],T=[r,n],h=[a,i],u=[s,l];this.addPoint(t,e),this.addPoint(s,l);for(let C=0;C<=1;C++){const g=6*E[C]-12*T[C]+6*h[C],H=-3*E[C]+9*T[C]-9*h[C]+3*u[C],F=3*T[C]-3*E[C];if(H===0){if(g===0)continue;const te=-F/g;0<te&&te<1&&(C===0&&this.addX(aa(E[C],T[C],h[C],u[C],te)),C===1&&this.addY(aa(E[C],T[C],h[C],u[C],te)));continue}const K=Math.pow(g,2)-4*F*H;if(K<0)continue;const j=(-g+Math.sqrt(K))/(2*H);0<j&&j<1&&(C===0&&this.addX(aa(E[C],T[C],h[C],u[C],j)),C===1&&this.addY(aa(E[C],T[C],h[C],u[C],j)));const Q=(-g-Math.sqrt(K))/(2*H);0<Q&&Q<1&&(C===0&&this.addX(aa(E[C],T[C],h[C],u[C],Q)),C===1&&this.addY(aa(E[C],T[C],h[C],u[C],Q)))}};Xn.prototype.addQuad=function(t,e,r,n,a,i){const s=t+.6666666666666666*(r-t),l=e+2/3*(n-e),E=s+1/3*(a-t),T=l+1/3*(i-e);this.addBezier(t,e,s,l,E,T,a,i)};var as=Xn;function Ut(){this.commands=[],this.fill="black",this.stroke=null,this.strokeWidth=1}var Ga={};function Z1(t,e){const r=Math.floor(t),n=t-r;if(Ga[e]||(Ga[e]={}),Ga[e][n]!==void 0){const i=Ga[e][n];return r+i}const a=+(Math.round(n+"e+"+e)+"e-"+e);return Ga[e][n]=a,r+a}function j1(t){let e=[[]],r=0,n=0;for(let a=0;a<t.length;a+=1){const i=e[e.length-1],s=t[a],l=i[0],E=i[1],T=i[i.length-1],h=t[a+1];i.push(s),s.type==="M"?(r=s.x,n=s.y):s.type==="L"&&(!h||h.command==="Z")?Math.abs(s.x-r)>1||Math.abs(s.y-n)>1||i.pop():s.type==="L"&&T&&T.x===s.x&&T.y===s.y?i.pop():s.type==="Z"&&(l&&E&&T&&l.type==="M"&&E.type==="L"&&T.type==="L"&&T.x===l.x&&T.y===l.y&&(i.shift(),i[0].type="M"),a+1<t.length&&e.push([]))}return t=[].concat.apply([],e),t}function Dc(t){return Object.assign({},{decimalPlaces:2,optimize:!0,flipY:!0,flipYBase:void 0,scale:1,x:0,y:0},t)}function Oc(t){return parseInt(t)===t&&(t={decimalPlaces:t,flipY:!1}),Object.assign({},{decimalPlaces:2,optimize:!0,flipY:!0,flipYBase:void 0},t)}Ut.prototype.fromSVG=function(t,e={}){typeof SVGPathElement<"u"&&t instanceof SVGPathElement&&(t=t.getAttribute("d")),e=Dc(e),this.commands=[];const r="0123456789",n="MmLlQqCcZzHhVv",a="SsTtAa",i="-+";let s={},l=[""],E=!1;function T(H){return H.filter(F=>F.length).map(F=>{let K=parseFloat(F);return(e.decimalPlaces||e.decimalPlaces===0)&&(K=Z1(K,e.decimalPlaces)),K})}function h(H){if(!this.commands.length)return H;const F=this.commands[this.commands.length-1];for(let K=0;K<H.length;K++)H[K]+=F[K&1?"y":"x"];return H}function u(){if(s.type===void 0)return;const H=s.type.toUpperCase(),F=H!=="Z"&&s.type.toUpperCase()!==s.type;let K=T(l);if(l=[""],!K.length&&H!=="Z")return;F&&H!=="H"&&H!=="V"&&(K=h.apply(this,[K]));const j=this.commands.length&&this.commands[this.commands.length-1].x||0,Q=this.commands.length&&this.commands[this.commands.length-1].y||0;switch(H){case"M":this.moveTo(...K);break;case"L":this.lineTo(...K);break;case"V":for(let te=0;te<K.length;te++){let se=0;F&&(se=this.commands.length&&this.commands[this.commands.length-1].y||0),this.lineTo(j,K[te]+se)}break;case"H":for(let te=0;te<K.length;te++){let se=0;F&&(se=this.commands.length&&this.commands[this.commands.length-1].x||0),this.lineTo(K[te]+se,Q)}break;case"C":this.bezierCurveTo(...K);break;case"Q":this.quadraticCurveTo(...K);break;case"Z":(this.commands.length<1||this.commands[this.commands.length-1].type!=="Z")&&this.close();break}if(this.commands.length)for(const te in this.commands[this.commands.length-1])this.commands[this.commands.length-1][te]===void 0&&(this.commands[this.commands.length-1][te]=0)}for(let H=0;H<t.length;H++){const F=t.charAt(H),K=l[l.length-1];if(r.indexOf(F)>-1)l[l.length-1]+=F;else if(i.indexOf(F)>-1)if(!s.type&&!this.commands.length&&(s.type="L"),F==="-")!s.type||K.indexOf("-")>0?E=!0:K.length?l.push("-"):l[l.length-1]=F;else if(!s.type||K.length>0)E=!0;else continue;else if(n.indexOf(F)>-1)s.type?(u.apply(this),s={type:F}):s.type=F;else{if(a.indexOf(F)>-1)throw new Error("Unsupported path command: "+F+". Currently supported commands are "+n.split("").join(", ")+".");` ,	
\r\f\v`.indexOf(F)>-1?l.push(""):F==="."?!s.type||K.indexOf(F)>-1?E=!0:l[l.length-1]+=F:E=!0}if(E)throw new Error("Unexpected character: "+F+" at offset "+H)}u.apply(this),e.optimize&&(this.commands=j1(this.commands));const C=e.flipY;let g=e.flipYBase;if(C===!0&&e.flipYBase===void 0){const H=this.getBoundingBox();g=H.y1+H.y2}for(const H in this.commands){const F=this.commands[H];for(const K in F)["x","x1","x2"].includes(K)?this.commands[H][K]=e.x+F[K]*e.scale:["y","y1","y2"].includes(K)&&(this.commands[H][K]=e.y+(C?g-F[K]:F[K])*e.scale)}return this};Ut.fromSVG=function(t,e){return new Ut().fromSVG(t,e)};Ut.prototype.moveTo=function(t,e){this.commands.push({type:"M",x:t,y:e})};Ut.prototype.lineTo=function(t,e){this.commands.push({type:"L",x:t,y:e})};Ut.prototype.curveTo=Ut.prototype.bezierCurveTo=function(t,e,r,n,a,i){this.commands.push({type:"C",x1:t,y1:e,x2:r,y2:n,x:a,y:i})};Ut.prototype.quadTo=Ut.prototype.quadraticCurveTo=function(t,e,r,n){this.commands.push({type:"Q",x1:t,y1:e,x:r,y:n})};Ut.prototype.close=Ut.prototype.closePath=function(){this.commands.push({type:"Z"})};Ut.prototype.extend=function(t){if(t.commands)t=t.commands;else if(t instanceof as){const e=t;this.moveTo(e.x1,e.y1),this.lineTo(e.x2,e.y1),this.lineTo(e.x2,e.y2),this.lineTo(e.x1,e.y2),this.close();return}Array.prototype.push.apply(this.commands,t)};Ut.prototype.getBoundingBox=function(){const t=new as;let e=0,r=0,n=0,a=0;for(let i=0;i<this.commands.length;i++){const s=this.commands[i];switch(s.type){case"M":t.addPoint(s.x,s.y),e=n=s.x,r=a=s.y;break;case"L":t.addPoint(s.x,s.y),n=s.x,a=s.y;break;case"Q":t.addQuad(n,a,s.x1,s.y1,s.x,s.y),n=s.x,a=s.y;break;case"C":t.addBezier(n,a,s.x1,s.y1,s.x2,s.y2,s.x,s.y),n=s.x,a=s.y;break;case"Z":n=e,a=r;break;default:throw new Error("Unexpected path command "+s.type)}}return t.isEmpty()&&t.addPoint(0,0),t};Ut.prototype.draw=function(t){const e=this._layers;if(e&&e.length){for(let n=0;n<e.length;n++)this.draw.call(e[n],t);return}const r=this._image;if(r){t.drawImage(r.image,r.x,r.y,r.width,r.height);return}t.beginPath();for(let n=0;n<this.commands.length;n+=1){const a=this.commands[n];a.type==="M"?t.moveTo(a.x,a.y):a.type==="L"?t.lineTo(a.x,a.y):a.type==="C"?t.bezierCurveTo(a.x1,a.y1,a.x2,a.y2,a.x,a.y):a.type==="Q"?t.quadraticCurveTo(a.x1,a.y1,a.x,a.y):a.type==="Z"&&this.stroke&&this.strokeWidth&&t.closePath()}this.fill&&(t.fillStyle=this.fill,t.fill()),this.stroke&&(t.strokeStyle=this.stroke,t.lineWidth=this.strokeWidth,t.stroke())};Ut.prototype.toPathData=function(t){t=Oc(t);function e(l){const E=Z1(l,t.decimalPlaces);return Math.round(l)===E?""+E:E.toFixed(t.decimalPlaces)}function r(){let l="";for(let E=0;E<arguments.length;E+=1){const T=arguments[E];T>=0&&E>0&&(l+=" "),l+=e(T)}return l}let n=this.commands;t.optimize&&(n=JSON.parse(JSON.stringify(this.commands)),n=j1(n));const a=t.flipY;let i=t.flipYBase;if(a===!0&&i===void 0){const l=new Ut;l.extend(n);const E=l.getBoundingBox();i=E.y1+E.y2}let s="";for(let l=0;l<n.length;l+=1){const E=n[l];E.type==="M"?s+="M"+r(E.x,a?i-E.y:E.y):E.type==="L"?s+="L"+r(E.x,a?i-E.y:E.y):E.type==="C"?s+="C"+r(E.x1,a?i-E.y1:E.y1,E.x2,a?i-E.y2:E.y2,E.x,a?i-E.y:E.y):E.type==="Q"?s+="Q"+r(E.x1,a?i-E.y1:E.y1,E.x,a?i-E.y:E.y):E.type==="Z"&&(s+="Z")}return s};Ut.prototype.toSVG=function(t,e){this._layers&&this._layers.length&&console.warn("toSVG() does not support colr font layers yet"),this._image&&console.warn("toSVG() does not support SVG glyphs yet"),e||(e=this.toPathData(t));let r='<path d="';return r+=e,r+='"',this.fill!==void 0&&this.fill!=="black"&&(this.fill===null?r+=' fill="none"':r+=' fill="'+this.fill+'"'),this.stroke&&(r+=' stroke="'+this.stroke+'" stroke-width="'+this.strokeWidth+'"'),r+="/>",r};Ut.prototype.toDOMElement=function(t,e){this._layers&&this._layers.length&&console.warn("toDOMElement() does not support colr font layers yet"),e||(e=this.toPathData(t));const r=e,n=document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("d",r),this.fill!==void 0&&this.fill!=="black"&&(this.fill===null?n.setAttribute("fill","none"):n.setAttribute("fill",this.fill)),this.stroke&&(n.setAttribute("stroke",this.stroke),n.setAttribute("stroke-width",this.strokeWidth)),n};var Kn=Ut;function X1(t){throw new Error(t)}function js(t,e){t||X1(e)}var ye={fail:X1,argument:js,assert:js},Xs=32768,qs=2147483648,Bc=-32768,Hc=32767+1/65536,ua={},de={},Fe={};function vr(t){return function(){return t}}de.BYTE=function(t){return ye.argument(t>=0&&t<=255,"Byte value should be between 0 and 255."),[t]};Fe.BYTE=vr(1);de.CHAR=function(t){return[t.charCodeAt(0)]};Fe.CHAR=vr(1);de.CHARARRAY=function(t){(t===null||typeof t>"u")&&(t="",console.warn("CHARARRAY with undefined or null value encountered and treated as an empty string. This is probably caused by a missing glyph name."));const e=[];for(let r=0;r<t.length;r+=1)e[r]=t.charCodeAt(r);return e};Fe.CHARARRAY=function(t){return typeof t>"u"?0:t.length};de.USHORT=function(t){return[t>>8&255,t&255]};Fe.USHORT=vr(2);de.SHORT=function(t){return t>=Xs&&(t=-(2*Xs-t)),[t>>8&255,t&255]};Fe.SHORT=vr(2);de.UINT24=function(t){return[t>>16&255,t>>8&255,t&255]};Fe.UINT24=vr(3);de.ULONG=function(t){return[t>>24&255,t>>16&255,t>>8&255,t&255]};Fe.ULONG=vr(4);de.LONG=function(t){return t>=qs&&(t=-(2*qs-t)),[t>>24&255,t>>16&255,t>>8&255,t&255]};Fe.LONG=vr(4);de.FLOAT=function(t){if(t>Hc||t<Bc)throw new Error(`Value ${t} is outside the range of representable values in 16.16 format`);const e=Math.round(t*65536)<<0;return de.ULONG(e)};Fe.FLOAT=Fe.ULONG;de.FIXED=de.ULONG;Fe.FIXED=Fe.ULONG;de.FWORD=de.SHORT;Fe.FWORD=Fe.SHORT;de.UFWORD=de.USHORT;Fe.UFWORD=Fe.USHORT;de.F2DOT14=function(t){return de.USHORT(t*16384)};Fe.F2DOT14=Fe.USHORT;de.LONGDATETIME=function(t){return[0,0,0,0,t>>24&255,t>>16&255,t>>8&255,t&255]};Fe.LONGDATETIME=vr(8);de.TAG=function(t){return ye.argument(t.length===4,"Tag should be exactly 4 ASCII characters."),[t.charCodeAt(0),t.charCodeAt(1),t.charCodeAt(2),t.charCodeAt(3)]};Fe.TAG=vr(4);de.Card8=de.BYTE;Fe.Card8=Fe.BYTE;de.Card16=de.USHORT;Fe.Card16=Fe.USHORT;de.OffSize=de.BYTE;Fe.OffSize=Fe.BYTE;de.SID=de.USHORT;Fe.SID=Fe.USHORT;de.NUMBER=function(t){return t>=-107&&t<=107?[t+139]:t>=108&&t<=1131?(t=t-108,[(t>>8)+247,t&255]):t>=-1131&&t<=-108?(t=-t-108,[(t>>8)+251,t&255]):t>=-32768&&t<=32767?de.NUMBER16(t):de.NUMBER32(t)};Fe.NUMBER=function(t){return de.NUMBER(t).length};de.NUMBER16=function(t){return[28,t>>8&255,t&255]};Fe.NUMBER16=vr(3);de.NUMBER32=function(t){return[29,t>>24&255,t>>16&255,t>>8&255,t&255]};Fe.NUMBER32=vr(5);de.REAL=function(t){let e=t.toString();const r=/\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(e);if(r){const i=parseFloat("1e"+((r[2]?+r[2]:0)+r[1].length));e=(Math.round(t*i)/i).toString()}let n="";for(let i=0,s=e.length;i<s;i+=1){const l=e[i];l==="e"?n+=e[++i]==="-"?"c":"b":l==="."?n+="a":l==="-"?n+="e":n+=l}n+=n.length&1?"f":"ff";const a=[30];for(let i=0,s=n.length;i<s;i+=2)a.push(parseInt(n.substr(i,2),16));return a};Fe.REAL=function(t){return de.REAL(t).length};de.NAME=de.CHARARRAY;Fe.NAME=Fe.CHARARRAY;de.STRING=de.CHARARRAY;Fe.STRING=Fe.CHARARRAY;ua.UTF8=function(t,e,r){const n=[],a=r;for(let i=0;i<a;i++,e+=1)n[i]=t.getUint8(e);return String.fromCharCode.apply(null,n)};ua.UTF16=function(t,e,r){const n=[],a=r/2;for(let i=0;i<a;i++,e+=2)n[i]=t.getUint16(e);return String.fromCharCode.apply(null,n)};de.UTF16=function(t){const e=[];for(let r=0;r<t.length;r+=1){const n=t.charCodeAt(r);e[e.length]=n>>8&255,e[e.length]=n&255}return e};Fe.UTF16=function(t){return t.length*2};var Qi={"x-mac-croatian":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ","x-mac-cyrillic":"АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю","x-mac-gaelic":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæøṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ","x-mac-greek":"Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ­","x-mac-icelandic":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ","x-mac-inuit":"ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł","x-mac-ce":"ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ",macintosh:"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ","x-mac-romanian":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ","x-mac-turkish":"ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ"};ua.MACSTRING=function(t,e,r,n){const a=Qi[n];if(a===void 0)return;let i="";for(let s=0;s<r;s++){const l=t.getUint8(e+s);l<=127?i+=String.fromCharCode(l):i+=a[l&127]}return i};var Di=typeof WeakMap=="function"&&new WeakMap,Oi,Fc=function(t){if(!Oi){Oi={};for(let a in Qi)Oi[a]=new String(a)}const e=Oi[t];if(e===void 0)return;if(Di){const a=Di.get(e);if(a!==void 0)return a}const r=Qi[t];if(r===void 0)return;const n={};for(let a=0;a<r.length;a++)n[r.charCodeAt(a)]=a+128;return Di&&Di.set(e,n),n};de.MACSTRING=function(t,e){const r=Fc(e);if(r===void 0)return;const n=[];for(let a=0;a<t.length;a++){let i=t.charCodeAt(a);if(i>=128&&(i=r[i],i===void 0))return;n[a]=i}return n};Fe.MACSTRING=function(t,e){const r=de.MACSTRING(t,e);return r!==void 0?r.length:0};function m0(t){return t>=-128&&t<=127}function Mc(t,e,r){let n=0;const a=t.length;for(;e<a&&n<64&&t[e]===0;)++e,++n;return r.push(128|n-1),e}function Gc(t,e,r){let n=0;const a=t.length;let i=e;for(;i<a&&n<64;){const s=t[i];if(!m0(s)||s===0&&i+1<a&&t[i+1]===0)break;++i,++n}r.push(n-1);for(let s=e;s<i;++s)r.push(t[s]+256&255);return i}function bc(t,e,r){let n=0;const a=t.length;let i=e;for(;i<a&&n<64;){const s=t[i];if(s===0||m0(s)&&i+1<a&&m0(t[i+1]))break;++i,++n}r.push(64|n-1);for(let s=e;s<i;++s){const l=t[s];r.push(l+65536>>8&255,l+256&255)}return i}de.VARDELTAS=function(t){let e=0;const r=[];for(;e<t.length;){const n=t[e];n===0?e=Mc(t,e,r):n>=-128&&n<=127?e=Gc(t,e,r):e=bc(t,e,r)}return r};de.INDEX=function(t){let e=1;const r=[e],n=[];for(let l=0;l<t.length;l+=1){const E=de.OBJECT(t[l]);Array.prototype.push.apply(n,E),e+=E.length,r.push(e)}if(n.length===0)return[0,0];const a=[],i=1+Math.floor(Math.log(e)/Math.log(2))/8|0,s=[void 0,de.BYTE,de.USHORT,de.UINT24,de.ULONG][i];for(let l=0;l<r.length;l+=1){const E=s(r[l]);Array.prototype.push.apply(a,E)}return Array.prototype.concat(de.Card16(t.length),de.OffSize(i),a,n)};Fe.INDEX=function(t){return de.INDEX(t).length};de.DICT=function(t){let e=[];const r=Object.keys(t),n=r.length;for(let a=0;a<n;a+=1){const i=parseInt(r[a],0),s=t[i],l=de.OPERAND(s.value,s.type),E=de.OPERATOR(i);for(let T=0;T<l.length;T++)e.push(l[T]);for(let T=0;T<E.length;T++)e.push(E[T])}return e};Fe.DICT=function(t){return de.DICT(t).length};de.OPERATOR=function(t){return t<1200?[t]:[12,t-1200]};de.OPERAND=function(t,e){let r=[];if(Array.isArray(e))for(let n=0;n<e.length;n+=1){ye.argument(t.length===e.length,"Not enough arguments given for type"+e);const a=de.OPERAND(t[n],e[n]);for(let i=0;i<a.length;i++)r.push(a[i])}else if(e==="SID"){const n=de.NUMBER(t);for(let a=0;a<n.length;a++)r.push(n[a])}else if(e==="offset"){const n=de.NUMBER32(t);for(let a=0;a<n.length;a++)r.push(n[a])}else if(e==="number"){const n=de.NUMBER(t);for(let a=0;a<n.length;a++)r.push(n[a])}else if(e==="real"){const n=de.REAL(t);for(let a=0;a<n.length;a++)r.push(n[a])}else throw new Error("Unknown operand type "+e);return r};de.OP=de.BYTE;Fe.OP=Fe.BYTE;var Bi=typeof WeakMap=="function"&&new WeakMap;de.CHARSTRING=function(t){if(Bi){const n=Bi.get(t);if(n!==void 0)return n}let e=[];const r=t.length;for(let n=0;n<r;n+=1){const a=t[n],i=de[a.type](a.value);for(let s=0;s<i.length;s++)e.push(i[s])}return Bi&&Bi.set(t,e),e};Fe.CHARSTRING=function(t){return de.CHARSTRING(t).length};de.OBJECT=function(t){const e=de[t.type];return ye.argument(e!==void 0,"No encoding function for type "+t.type),e(t.value)};Fe.OBJECT=function(t){const e=Fe[t.type];return ye.argument(e!==void 0,"No sizeOf function for type "+t.type),e(t.value)};de.TABLE=function(t){let e=[];const r=(t.fields||[]).length,n=[],a=[];for(let i=0;i<r;i+=1){const s=t.fields[i],l=de[s.type];ye.argument(l!==void 0,"No encoding function for field type "+s.type+" ("+s.name+")");let E=t[s.name];E===void 0&&(E=s.value);const T=l(E);if(s.type==="TABLE")E.fields!==null&&(a.push(e.length),n.push(T)),e.push(0,0);else for(let h=0;h<T.length;h++)e.push(T[h])}for(let i=0;i<n.length;i+=1){const s=a[i],l=e.length;ye.argument(l<65536,"Table "+t.tableName+" too big."),e[s]=l>>8,e[s+1]=l&255;for(let E=0;E<n[i].length;E++)e.push(n[i][E])}return e};Fe.TABLE=function(t){let e=0;const r=(t.fields||[]).length;for(let n=0;n<r;n+=1){const a=t.fields[n],i=Fe[a.type];ye.argument(i!==void 0,"No sizeOf function for field type "+a.type+" ("+a.name+")");let s=t[a.name];s===void 0&&(s=a.value),e+=i(s),a.type==="TABLE"&&(e+=2)}return e};de.RECORD=de.TABLE;Fe.RECORD=Fe.TABLE;de.LITERAL=function(t){return t};Fe.LITERAL=function(t){return t.length};function Mt(t,e,r){if(e&&e.length)for(let n=0;n<e.length;n+=1){const a=e[n];this[a.name]=a.value}if(this.tableName=t,this.fields=e,r){const n=Object.keys(r);for(let a=0;a<n.length;a+=1){const i=n[a],s=r[i];this[i]!==void 0&&(this[i]=s)}}}Mt.prototype.encode=function(){return de.TABLE(this)};Mt.prototype.sizeOf=function(){return Fe.TABLE(this)};function pa(t,e,r){r===void 0&&(r=e.length);const n=new Array(e.length+1);n[0]={name:t+"Count",type:"USHORT",value:r};for(let a=0;a<e.length;a++)n[a+1]={name:t+a,type:"USHORT",value:e[a]};return n}function f0(t,e,r){const n=e.length,a=new Array(n+1);a[0]={name:t+"Count",type:"USHORT",value:n};for(let i=0;i<n;i++)a[i+1]={name:t+i,type:"TABLE",value:r(e[i],i)};return a}function Sa(t,e,r){const n=e.length;let a=[];a[0]={name:t+"Count",type:"USHORT",value:n};for(let i=0;i<n;i++)a=a.concat(r(e[i],i));return a}function $i(t){t.format===1?Mt.call(this,"coverageTable",[{name:"coverageFormat",type:"USHORT",value:1}].concat(pa("glyph",t.glyphs))):t.format===2?Mt.call(this,"coverageTable",[{name:"coverageFormat",type:"USHORT",value:2}].concat(Sa("rangeRecord",t.ranges,function(e,r){return[{name:"startGlyphID"+r,type:"USHORT",value:e.start},{name:"endGlyphID"+r,type:"USHORT",value:e.end},{name:"startCoverageIndex"+r,type:"USHORT",value:e.index}]}))):ye.assert(!1,"Coverage format must be 1 or 2.")}$i.prototype=Object.create(Mt.prototype);$i.prototype.constructor=$i;function eo(t){Mt.call(this,"scriptListTable",Sa("scriptRecord",t,function(e,r){const n=e.script;let a=n.defaultLangSys;return ye.assert(!!a,"Unable to write GSUB: script "+e.tag+" has no default language system."),[{name:"scriptTag"+r,type:"TAG",value:e.tag},{name:"script"+r,type:"TABLE",value:new Mt("scriptTable",[{name:"defaultLangSys",type:"TABLE",value:new Mt("defaultLangSys",[{name:"lookupOrder",type:"USHORT",value:0},{name:"reqFeatureIndex",type:"USHORT",value:a.reqFeatureIndex}].concat(pa("featureIndex",a.featureIndexes)))}].concat(Sa("langSys",n.langSysRecords,function(i,s){const l=i.langSys;return[{name:"langSysTag"+s,type:"TAG",value:i.tag},{name:"langSys"+s,type:"TABLE",value:new Mt("langSys",[{name:"lookupOrder",type:"USHORT",value:0},{name:"reqFeatureIndex",type:"USHORT",value:l.reqFeatureIndex}].concat(pa("featureIndex",l.featureIndexes)))}]})))}]}))}eo.prototype=Object.create(Mt.prototype);eo.prototype.constructor=eo;function to(t){Mt.call(this,"featureListTable",Sa("featureRecord",t,function(e,r){const n=e.feature;return[{name:"featureTag"+r,type:"TAG",value:e.tag},{name:"feature"+r,type:"TABLE",value:new Mt("featureTable",[{name:"featureParams",type:"USHORT",value:n.featureParams}].concat(pa("lookupListIndex",n.lookupListIndexes)))}]}))}to.prototype=Object.create(Mt.prototype);to.prototype.constructor=to;function ro(t,e){Mt.call(this,"lookupListTable",f0("lookup",t,function(r){let n=e[r.lookupType];return ye.assert(!!n,"Unable to write GSUB lookup type "+r.lookupType+" tables."),new Mt("lookupTable",[{name:"lookupType",type:"USHORT",value:r.lookupType},{name:"lookupFlag",type:"USHORT",value:r.lookupFlag}].concat(f0("subtable",r.subtables,n)))}))}ro.prototype=Object.create(Mt.prototype);ro.prototype.constructor=ro;function no(t){t.format===1?Mt.call(this,"classDefTable",[{name:"classFormat",type:"USHORT",value:1},{name:"startGlyphID",type:"USHORT",value:t.startGlyph}].concat(pa("glyph",t.classes))):t.format===2?Mt.call(this,"classDefTable",[{name:"classFormat",type:"USHORT",value:2}].concat(Sa("rangeRecord",t.ranges,function(e,r){return[{name:"startGlyphID"+r,type:"USHORT",value:e.start},{name:"endGlyphID"+r,type:"USHORT",value:e.end},{name:"class"+r,type:"USHORT",value:e.classId}]}))):ye.assert(!1,"Class format must be 1 or 2.")}no.prototype=Object.create(Mt.prototype);no.prototype.constructor=no;var Ae={Table:Mt,Record:Mt,Coverage:$i,ClassDef:no,ScriptList:eo,FeatureList:to,LookupList:ro,ushortList:pa,tableList:f0,recordList:Sa};function Qs(t,e){return t.getUint8(e)}function ao(t,e){return t.getUint16(e,!1)}function Pc(t,e){return t.getInt16(e,!1)}function q1(t,e){return(t.getUint16(e)<<8)+t.getUint8(e+2)}function is(t,e){return t.getUint32(e,!1)}function vc(t,e){return t.getInt32(e,!1)}function Q1(t,e){const r=t.getInt16(e,!1),n=t.getUint16(e+2,!1);return r+n/65535}function Uc(t,e){let r="";for(let n=e;n<e+4;n+=1)r+=String.fromCharCode(t.getInt8(n));return r}function wc(t,e,r){let n=0;for(let a=0;a<r;a+=1)n<<=8,n+=t.getUint8(e+a);return n}function Yc(t,e,r){const n=[];for(let a=e;a<r;a+=1)n.push(t.getUint8(a));return n}function Wc(t){let e="";for(let r=0;r<t.length;r+=1)e+=String.fromCharCode(t[r]);return e}var kc={byte:1,uShort:2,f2dot14:2,short:2,uInt24:3,uLong:4,fixed:4,longDateTime:8,tag:4},nr={LONG_WORDS:32768,WORD_DELTA_COUNT_MASK:32767,SHARED_POINT_NUMBERS:32768,COUNT_MASK:4095,EMBEDDED_PEAK_TUPLE:32768,INTERMEDIATE_REGION:16384,PRIVATE_POINT_NUMBERS:8192,TUPLE_INDEX_MASK:4095,POINTS_ARE_WORDS:128,POINT_RUN_COUNT_MASK:127,DELTAS_ARE_ZERO:128,DELTAS_ARE_WORDS:64,DELTA_RUN_COUNT_MASK:63,INNER_INDEX_BIT_COUNT_MASK:15,MAP_ENTRY_SIZE_MASK:48};function q(t,e){this.data=t,this.offset=e,this.relativeOffset=0}q.prototype.parseByte=function(){const t=this.data.getUint8(this.offset+this.relativeOffset);return this.relativeOffset+=1,t};q.prototype.parseChar=function(){const t=this.data.getInt8(this.offset+this.relativeOffset);return this.relativeOffset+=1,t};q.prototype.parseCard8=q.prototype.parseByte;q.prototype.parseUShort=function(){const t=this.data.getUint16(this.offset+this.relativeOffset);return this.relativeOffset+=2,t};q.prototype.parseCard16=q.prototype.parseUShort;q.prototype.parseSID=q.prototype.parseUShort;q.prototype.parseOffset16=q.prototype.parseUShort;q.prototype.parseShort=function(){const t=this.data.getInt16(this.offset+this.relativeOffset);return this.relativeOffset+=2,t};q.prototype.parseF2Dot14=function(){const t=this.data.getInt16(this.offset+this.relativeOffset)/16384;return this.relativeOffset+=2,t};q.prototype.parseUInt24=function(){const t=q1(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=3,t};q.prototype.parseULong=function(){const t=is(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,t};q.prototype.parseLong=function(){const t=vc(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,t};q.prototype.parseOffset32=q.prototype.parseULong;q.prototype.parseFixed=function(){const t=Q1(this.data,this.offset+this.relativeOffset);return this.relativeOffset+=4,t};q.prototype.parseString=function(t){const e=this.data,r=this.offset+this.relativeOffset;let n="";this.relativeOffset+=t;for(let a=0;a<t;a++)n+=String.fromCharCode(e.getUint8(r+a));return n};q.prototype.parseTag=function(){return this.parseString(4)};q.prototype.parseLongDateTime=function(){let t=is(this.data,this.offset+this.relativeOffset+4);return t-=2082844800,this.relativeOffset+=8,t};q.prototype.parseVersion=function(t){const e=ao(this.data,this.offset+this.relativeOffset),r=ao(this.data,this.offset+this.relativeOffset+2);return this.relativeOffset+=4,t===void 0&&(t=4096),e+r/t/10};q.prototype.skip=function(t,e){e===void 0&&(e=1),this.relativeOffset+=kc[t]*e};q.prototype.parseULongList=function(t){t===void 0&&(t=this.parseULong());const e=new Array(t),r=this.data;let n=this.offset+this.relativeOffset;for(let a=0;a<t;a++)e[a]=r.getUint32(n),n+=4;return this.relativeOffset+=t*4,e};q.prototype.parseOffset16List=q.prototype.parseUShortList=function(t){t===void 0&&(t=this.parseUShort());const e=new Array(t),r=this.data;let n=this.offset+this.relativeOffset;for(let a=0;a<t;a++)e[a]=r.getUint16(n),n+=2;return this.relativeOffset+=t*2,e};q.prototype.parseShortList=function(t){const e=new Array(t),r=this.data;let n=this.offset+this.relativeOffset;for(let a=0;a<t;a++)e[a]=r.getInt16(n),n+=2;return this.relativeOffset+=t*2,e};q.prototype.parseByteList=function(t){const e=new Array(t),r=this.data;let n=this.offset+this.relativeOffset;for(let a=0;a<t;a++)e[a]=r.getUint8(n++);return this.relativeOffset+=t,e};q.prototype.parseList=function(t,e){e||(e=t,t=this.parseUShort());const r=new Array(t);for(let n=0;n<t;n++)r[n]=e.call(this);return r};q.prototype.parseList32=function(t,e){e||(e=t,t=this.parseULong());const r=new Array(t);for(let n=0;n<t;n++)r[n]=e.call(this);return r};q.prototype.parseRecordList=function(t,e){e||(e=t,t=this.parseUShort());const r=new Array(t),n=Object.keys(e);for(let a=0;a<t;a++){const i={};for(let s=0;s<n.length;s++){const l=n[s],E=e[l];i[l]=E.call(this)}r[a]=i}return r};q.prototype.parseRecordList32=function(t,e){e||(e=t,t=this.parseULong());const r=new Array(t),n=Object.keys(e);for(let a=0;a<t;a++){const i={};for(let s=0;s<n.length;s++){const l=n[s],E=e[l];i[l]=E.call(this)}r[a]=i}return r};q.prototype.parseTupleRecords=function(t,e){let r=[];for(let n=0;n<t;n++){let a=[];for(let i=0;i<e;i++)a.push(this.parseF2Dot14());r.push(a)}return r};q.prototype.parseStruct=function(t){if(typeof t=="function")return t.call(this);{const e=Object.keys(t),r={};for(let n=0;n<e.length;n++){const a=e[n],i=t[a];r[a]=i.call(this)}return r}};q.prototype.parseValueRecord=function(t){if(t===void 0&&(t=this.parseUShort()),t===0)return;const e={};return t&1&&(e.xPlacement=this.parseShort()),t&2&&(e.yPlacement=this.parseShort()),t&4&&(e.xAdvance=this.parseShort()),t&8&&(e.yAdvance=this.parseShort()),t&16&&(e.xPlaDevice=void 0,this.parseShort()),t&32&&(e.yPlaDevice=void 0,this.parseShort()),t&64&&(e.xAdvDevice=void 0,this.parseShort()),t&128&&(e.yAdvDevice=void 0,this.parseShort()),e};q.prototype.parseValueRecordList=function(){const t=this.parseUShort(),e=this.parseUShort(),r=new Array(e);for(let n=0;n<e;n++)r[n]=this.parseValueRecord(t);return r};q.prototype.parsePointer=function(t){const e=this.parseOffset16();if(e>0)return new q(this.data,this.offset+e).parseStruct(t)};q.prototype.parsePointer32=function(t){const e=this.parseOffset32();if(e>0)return new q(this.data,this.offset+e).parseStruct(t)};q.prototype.parseListOfLists=function(t){const e=this.parseOffset16List(),r=e.length,n=this.relativeOffset,a=new Array(r);for(let i=0;i<r;i++){const s=e[i];if(s===0){a[i]=void 0;continue}if(this.relativeOffset=s,t){const l=this.parseOffset16List(),E=new Array(l.length);for(let T=0;T<l.length;T++)this.relativeOffset=s+l[T],E[T]=t.call(this);a[i]=E}else a[i]=this.parseUShortList()}return this.relativeOffset=n,a};q.prototype.parseCoverage=function(){const t=this.offset+this.relativeOffset,e=this.parseUShort(),r=this.parseUShort();if(e===1)return{format:1,glyphs:this.parseUShortList(r)};if(e===2){const n=new Array(r);for(let a=0;a<r;a++)n[a]={start:this.parseUShort(),end:this.parseUShort(),index:this.parseUShort()};return{format:2,ranges:n}}throw new Error("0x"+t.toString(16)+": Coverage format must be 1 or 2.")};q.prototype.parseClassDef=function(){const t=this.offset+this.relativeOffset,e=this.parseUShort();return e===1?{format:1,startGlyph:this.parseUShort(),classes:this.parseUShortList()}:e===2?{format:2,ranges:this.parseRecordList({start:q.uShort,end:q.uShort,classId:q.uShort})}:(console.warn(`0x${t.toString(16)}: This font file uses an invalid ClassDef format of ${e}. It might be corrupted and should be reacquired if it doesn't display as intended.`),{format:e})};q.list=function(t,e){return function(){return this.parseList(t,e)}};q.list32=function(t,e){return function(){return this.parseList32(t,e)}};q.recordList=function(t,e){return function(){return this.parseRecordList(t,e)}};q.recordList32=function(t,e){return function(){return this.parseRecordList32(t,e)}};q.pointer=function(t){return function(){return this.parsePointer(t)}};q.pointer32=function(t){return function(){return this.parsePointer32(t)}};q.tag=q.prototype.parseTag;q.byte=q.prototype.parseByte;q.uShort=q.offset16=q.prototype.parseUShort;q.uShortList=q.prototype.parseUShortList;q.uInt24=q.prototype.parseUInt24;q.uLong=q.offset32=q.prototype.parseULong;q.uLongList=q.prototype.parseULongList;q.fixed=q.prototype.parseFixed;q.f2Dot14=q.prototype.parseF2Dot14;q.struct=q.prototype.parseStruct;q.coverage=q.prototype.parseCoverage;q.classDef=q.prototype.parseClassDef;var $s={reserved:q.uShort,reqFeatureIndex:q.uShort,featureIndexes:q.uShortList};q.prototype.parseScriptList=function(){return this.parsePointer(q.recordList({tag:q.tag,script:q.pointer({defaultLangSys:q.pointer($s),langSysRecords:q.recordList({tag:q.tag,langSys:q.pointer($s)})})}))||[]};q.prototype.parseFeatureList=function(){return this.parsePointer(q.recordList({tag:q.tag,feature:q.pointer({featureParams:q.offset16,lookupListIndexes:q.uShortList})}))||[]};q.prototype.parseLookupList=function(t){return this.parsePointer(q.list(q.pointer(function(){const e=this.parseUShort();ye.argument(1<=e&&e<=9,"GPOS/GSUB lookup type "+e+" unknown.");const r=this.parseUShort(),n=r&16;return{lookupType:e,lookupFlag:r,subtables:this.parseList(q.pointer(t[e])),markFilteringSet:n?this.parseUShort():void 0}})))||[]};q.prototype.parseFeatureVariationsList=function(){return this.parsePointer32(function(){const t=this.parseUShort(),e=this.parseUShort();return ye.argument(t===1&&e<1,"GPOS/GSUB feature variations table unknown."),this.parseRecordList32({conditionSetOffset:q.offset32,featureTableSubstitutionOffset:q.offset32})})||[]};q.prototype.parseVariationStore=function(){const t=this.relativeOffset,e=this.parseUShort(),r={itemVariationStore:this.parseItemVariationStore()};return this.relativeOffset=t+e+2,r};q.prototype.parseItemVariationStore=function(){const t=this.relativeOffset,e={format:this.parseUShort(),variationRegions:[],itemVariationSubtables:[]},r=this.parseOffset32(),n=this.parseUShort(),a=this.parseULongList(n);this.relativeOffset=t+r,e.variationRegions=this.parseVariationRegionList();for(let i=0;i<n;i++){const s=a[i];this.relativeOffset=t+s,e.itemVariationSubtables.push(this.parseItemVariationSubtable())}return e};q.prototype.parseVariationRegionList=function(){const t=this.parseUShort(),e=this.parseUShort();return this.parseRecordList(e,{regionAxes:q.recordList(t,{startCoord:q.f2Dot14,peakCoord:q.f2Dot14,endCoord:q.f2Dot14})})};q.prototype.parseItemVariationSubtable=function(){const t=this.parseUShort(),e=this.parseUShort(),r=this.parseUShortList(),n=r.length;return{regionIndexes:r,deltaSets:t&&n?this.parseDeltaSets(t,e,n):[]}};q.prototype.parseDeltaSetIndexMap=function(){const t=this.parseByte(),e=this.parseByte(),r=[];let n=0;switch(t){case 0:n=this.parseUShort();break;case 1:n=this.parseULong();break;default:console.error(`unsupported DeltaSetIndexMap format ${t}`)}if(!n)return{format:t,entryFormat:e};const a=(e&nr.INNER_INDEX_BIT_COUNT_MASK)+1,i=((e&nr.MAP_ENTRY_SIZE_MASK)>>4)+1;for(let s=0;s<n;s++){let l;if(i===1)l=this.parseByte();else if(i===2)l=this.parseUShort();else if(i===3)l=this.parseUInt24();else if(i===4)l=this.getULong();else throw new Error(`Invalid entry size of ${i}`);const E=l>>a,T=l&(1<<a)-1;r.push({outerIndex:E,innerIndex:T})}return{format:t,entryFormat:e,map:r}};q.prototype.parseDeltaSets=function(t,e,r){const n=Array.from({length:t},()=>[]),a=e&nr.LONG_WORDS,i=e&nr.WORD_DELTA_COUNT_MASK;if(i>r)throw Error("wordCount must be less than or equal to regionIndexCount");const s=(a?this.parseLong:this.parseShort).bind(this),l=(a?this.parseShort:this.parseChar).bind(this);for(let E=0;E<t;E++)for(let T=0;T<r;T++)T<i?n[E].push(s()):n[E].push(l());return n};q.prototype.parseTupleVariationStoreList=function(t,e,r){const n=this.parseUShort(),i=this.parseUShort()&1,s=this.parseOffset32(),l=(i?this.parseULong:this.parseUShort).bind(this),E={};let T=l();i||(T*=2);let h;for(let u=0;u<n;u++){h=l(),i||(h*=2);const C=h-T;E[u]=C?this.parseTupleVariationStore(s+T,t,e,r,u):void 0,T=h}return E};q.prototype.parseTupleVariationStore=function(t,e,r,n,a){const i=this.relativeOffset;this.relativeOffset=t,r==="cvar"&&(this.relativeOffset+=4);const s=this.parseUShort(),l=!!(s&nr.SHARED_POINT_NUMBERS),E=s&nr.COUNT_MASK;let T=this.parseOffset16();const h=[];let u=[];for(let H=0;H<E;H++){const F=this.parseTupleVariationHeader(e,r);h.push(F)}this.relativeOffset!==t+T&&(console.warn(`Unexpected offset after parsing tuple variation headers! Expected ${t+T}, actually ${this.relativeOffset}`),this.relativeOffset=t+T),l&&(u=this.parsePackedPointNumbers());let C=this.relativeOffset;for(let H=0;H<E;H++){const F=h[H];F.privatePoints=[],this.relativeOffset=C,r==="cvar"&&!F.peakTuple&&console.warn("An embedded peak tuple is required in TupleVariationHeaders for the cvar table."),F.flags.privatePointNumbers&&(F.privatePoints=this.parsePackedPointNumbers()),delete F.flags;const K=this.offset,j=this.relativeOffset,Q=te=>{let se,Ie;const le=()=>{let ue=0;if(r==="gvar"){if(ue=F.privatePoints.length||u.length,!ue){const ve=n.get(a);ve.path,ue=ve.points.length,ue+=4}}else r==="cvar"&&(ue=n.length);this.offset=K,this.relativeOffset=j,se=this.parsePackedDeltas(ue),r==="gvar"&&(Ie=this.parsePackedDeltas(ue))};return{configurable:!0,get:function(){return se===void 0&&le(),te==="deltasY"?Ie:se},set:function(ue){se===void 0&&le(),te==="deltasY"?Ie=ue:se=ue}}};Object.defineProperty(F,"deltas",Q.call(this,"deltas")),r==="gvar"&&Object.defineProperty(F,"deltasY",Q.call(this,"deltasY")),C+=F.variationDataSize,delete F.variationDataSize}this.relativeOffset=i;const g={headers:h};return g.sharedPoints=u,g};q.prototype.parseTupleVariationHeader=function(t,e){const r=this.parseUShort(),n=this.parseUShort(),a=!!(n&nr.EMBEDDED_PEAK_TUPLE),i=!!(n&nr.INTERMEDIATE_REGION),s=!!(n&nr.PRIVATE_POINT_NUMBERS),l=a?void 0:n&nr.TUPLE_INDEX_MASK,E=a?this.parseTupleRecords(1,t)[0]:void 0,T=i?this.parseTupleRecords(1,t)[0]:void 0,h=i?this.parseTupleRecords(1,t)[0]:void 0,u={variationDataSize:r,peakTuple:E,intermediateStartTuple:T,intermediateEndTuple:h,flags:{embeddedPeakTuple:a,intermediateRegion:i,privatePointNumbers:s}};return e==="gvar"&&(u.sharedTupleRecordsIndex=l),u};q.prototype.parsePackedPointNumbers=function(){const t=this.parseByte(),e=[];let r=t;if(t>=128){const a=this.parseByte();r=(t&nr.POINT_RUN_COUNT_MASK)<<8|a}let n=0;for(;e.length<r;){const a=this.parseByte(),i=!!(a&nr.POINTS_ARE_WORDS);let s=(a&nr.POINT_RUN_COUNT_MASK)+1;for(let l=0;l<s&&e.length<r;l++){let E;i?E=this.parseUShort():E=this.parseByte(),n=n+E,e.push(n)}}return e};q.prototype.parsePackedDeltas=function(t){const e=[];for(;e.length<t;){const r=this.parseByte(),n=!!(r&nr.DELTAS_ARE_ZERO),a=!!(r&nr.DELTAS_ARE_WORDS),i=(r&nr.DELTA_RUN_COUNT_MASK)+1;for(let s=0;s<i&&e.length<t;s++)n?e.push(0):a?e.push(this.parseShort()):e.push(this.parseChar())}return e};var pe={getByte:Qs,getCard8:Qs,getUShort:ao,getCard16:ao,getShort:Pc,getUInt24:q1,getULong:is,getFixed:Q1,getTag:Uc,getOffset:wc,getBytes:Yc,bytesToString:Wc,Parser:q},io=["copyright","fontFamily","fontSubfamily","uniqueID","fullName","version","postScriptName","trademark","manufacturer","designer","description","manufacturerURL","designerURL","license","licenseURL","reserved","preferredFamily","preferredSubfamily","compatibleFullName","sampleText","postScriptFindFontName","wwsFamily","wwsSubfamily"],$1={0:"en",1:"fr",2:"de",3:"it",4:"nl",5:"sv",6:"es",7:"da",8:"pt",9:"no",10:"he",11:"ja",12:"ar",13:"fi",14:"el",15:"is",16:"mt",17:"tr",18:"hr",19:"zh-Hant",20:"ur",21:"hi",22:"th",23:"ko",24:"lt",25:"pl",26:"hu",27:"es",28:"lv",29:"se",30:"fo",31:"fa",32:"ru",33:"zh",34:"nl-BE",35:"ga",36:"sq",37:"ro",38:"cz",39:"sk",40:"si",41:"yi",42:"sr",43:"mk",44:"bg",45:"uk",46:"be",47:"uz",48:"kk",49:"az-Cyrl",50:"az-Arab",51:"hy",52:"ka",53:"mo",54:"ky",55:"tg",56:"tk",57:"mn-CN",58:"mn",59:"ps",60:"ks",61:"ku",62:"sd",63:"bo",64:"ne",65:"sa",66:"mr",67:"bn",68:"as",69:"gu",70:"pa",71:"or",72:"ml",73:"kn",74:"ta",75:"te",76:"si",77:"my",78:"km",79:"lo",80:"vi",81:"id",82:"tl",83:"ms",84:"ms-Arab",85:"am",86:"ti",87:"om",88:"so",89:"sw",90:"rw",91:"rn",92:"ny",93:"mg",94:"eo",128:"cy",129:"eu",130:"ca",131:"la",132:"qu",133:"gn",134:"ay",135:"tt",136:"ug",137:"dz",138:"jv",139:"su",140:"gl",141:"af",142:"br",143:"iu",144:"gd",145:"gv",146:"ga",147:"to",148:"el-polyton",149:"kl",150:"az",151:"nn"},Kc={0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:5,11:1,12:4,13:0,14:6,15:0,16:0,17:0,18:0,19:2,20:4,21:9,22:21,23:3,24:29,25:29,26:29,27:29,28:29,29:0,30:0,31:4,32:7,33:25,34:0,35:0,36:0,37:0,38:29,39:29,40:0,41:5,42:7,43:7,44:7,45:7,46:7,47:7,48:7,49:7,50:4,51:24,52:23,53:7,54:7,55:7,56:7,57:27,58:7,59:4,60:4,61:4,62:4,63:26,64:9,65:9,66:9,67:13,68:13,69:11,70:10,71:12,72:17,73:16,74:14,75:15,76:18,77:19,78:20,79:22,80:30,81:0,82:0,83:0,84:4,85:28,86:28,87:28,88:0,89:0,90:0,91:0,92:0,93:0,94:0,128:0,129:0,130:0,131:0,132:0,133:0,134:0,135:7,136:4,137:26,138:0,139:0,140:0,141:0,142:0,143:28,144:0,145:0,146:0,147:0,148:6,149:0,150:0,151:0},el={1078:"af",1052:"sq",1156:"gsw",1118:"am",5121:"ar-DZ",15361:"ar-BH",3073:"ar",2049:"ar-IQ",11265:"ar-JO",13313:"ar-KW",12289:"ar-LB",4097:"ar-LY",6145:"ary",8193:"ar-OM",16385:"ar-QA",1025:"ar-SA",10241:"ar-SY",7169:"aeb",14337:"ar-AE",9217:"ar-YE",1067:"hy",1101:"as",2092:"az-Cyrl",1068:"az",1133:"ba",1069:"eu",1059:"be",2117:"bn",1093:"bn-IN",8218:"bs-Cyrl",5146:"bs",1150:"br",1026:"bg",1027:"ca",3076:"zh-HK",5124:"zh-MO",2052:"zh",4100:"zh-SG",1028:"zh-TW",1155:"co",1050:"hr",4122:"hr-BA",1029:"cs",1030:"da",1164:"prs",1125:"dv",2067:"nl-BE",1043:"nl",3081:"en-AU",10249:"en-BZ",4105:"en-CA",9225:"en-029",16393:"en-IN",6153:"en-IE",8201:"en-JM",17417:"en-MY",5129:"en-NZ",13321:"en-PH",18441:"en-SG",7177:"en-ZA",11273:"en-TT",2057:"en-GB",1033:"en",12297:"en-ZW",1061:"et",1080:"fo",1124:"fil",1035:"fi",2060:"fr-BE",3084:"fr-CA",1036:"fr",5132:"fr-LU",6156:"fr-MC",4108:"fr-CH",1122:"fy",1110:"gl",1079:"ka",3079:"de-AT",1031:"de",5127:"de-LI",4103:"de-LU",2055:"de-CH",1032:"el",1135:"kl",1095:"gu",1128:"ha",1037:"he",1081:"hi",1038:"hu",1039:"is",1136:"ig",1057:"id",1117:"iu",2141:"iu-Latn",2108:"ga",1076:"xh",1077:"zu",1040:"it",2064:"it-CH",1041:"ja",1099:"kn",1087:"kk",1107:"km",1158:"quc",1159:"rw",1089:"sw",1111:"kok",1042:"ko",1088:"ky",1108:"lo",1062:"lv",1063:"lt",2094:"dsb",1134:"lb",1071:"mk",2110:"ms-BN",1086:"ms",1100:"ml",1082:"mt",1153:"mi",1146:"arn",1102:"mr",1148:"moh",1104:"mn",2128:"mn-CN",1121:"ne",1044:"nb",2068:"nn",1154:"oc",1096:"or",1123:"ps",1045:"pl",1046:"pt",2070:"pt-PT",1094:"pa",1131:"qu-BO",2155:"qu-EC",3179:"qu",1048:"ro",1047:"rm",1049:"ru",9275:"smn",4155:"smj-NO",5179:"smj",3131:"se-FI",1083:"se",2107:"se-SE",8251:"sms",6203:"sma-NO",7227:"sms",1103:"sa",7194:"sr-Cyrl-BA",3098:"sr",6170:"sr-Latn-BA",2074:"sr-Latn",1132:"nso",1074:"tn",1115:"si",1051:"sk",1060:"sl",11274:"es-AR",16394:"es-BO",13322:"es-CL",9226:"es-CO",5130:"es-CR",7178:"es-DO",12298:"es-EC",17418:"es-SV",4106:"es-GT",18442:"es-HN",2058:"es-MX",19466:"es-NI",6154:"es-PA",15370:"es-PY",10250:"es-PE",20490:"es-PR",3082:"es",1034:"es",21514:"es-US",14346:"es-UY",8202:"es-VE",2077:"sv-FI",1053:"sv",1114:"syr",1064:"tg",2143:"tzm",1097:"ta",1092:"tt",1098:"te",1054:"th",1105:"bo",1055:"tr",1090:"tk",1152:"ug",1058:"uk",1070:"hsb",1056:"ur",2115:"uz-Cyrl",1091:"uz",1066:"vi",1106:"cy",1160:"wo",1157:"sah",1144:"ii",1130:"yo"};function _c(t,e,r){switch(t){case 0:if(e===65535)return"und";if(r)return r[e];break;case 1:return $1[e];case 3:return el[e]}}var N0="utf-16",Vc={0:"macintosh",1:"x-mac-japanese",2:"x-mac-chinesetrad",3:"x-mac-korean",6:"x-mac-greek",7:"x-mac-cyrillic",9:"x-mac-devanagai",10:"x-mac-gurmukhi",11:"x-mac-gujarati",12:"x-mac-oriya",13:"x-mac-bengali",14:"x-mac-tamil",15:"x-mac-telugu",16:"x-mac-kannada",17:"x-mac-malayalam",18:"x-mac-sinhalese",19:"x-mac-burmese",20:"x-mac-khmer",21:"x-mac-thai",22:"x-mac-lao",23:"x-mac-georgian",24:"x-mac-armenian",25:"x-mac-chinesesimp",26:"x-mac-tibetan",27:"x-mac-mongolian",28:"x-mac-ethiopic",29:"x-mac-ce",30:"x-mac-vietnamese",31:"x-mac-extarabic"},zc={15:"x-mac-icelandic",17:"x-mac-turkish",18:"x-mac-croatian",24:"x-mac-ce",25:"x-mac-ce",26:"x-mac-ce",27:"x-mac-ce",28:"x-mac-ce",30:"x-mac-icelandic",37:"x-mac-romanian",38:"x-mac-ce",39:"x-mac-ce",40:"x-mac-ce",143:"x-mac-inuit",146:"x-mac-gaelic"};function os(t,e,r){switch(t){case 0:return N0;case 1:return zc[r]||Vc[e];case 3:if(e===1||e===10)return N0;break}}var tl={0:"unicode",1:"macintosh",2:"reserved",3:"windows"};function Jc(t){return tl[t]}function Zc(t,e,r){const n={},a=new pe.Parser(t,e),i=a.parseUShort(),s=a.parseUShort(),l=a.offset+a.parseUShort();for(let E=0;E<s;E++){const T=a.parseUShort(),h=a.parseUShort(),u=a.parseUShort(),C=a.parseUShort(),g=io[C]||C,H=a.parseUShort(),F=a.parseUShort(),K=_c(T,u,r),j=os(T,h,u),Q=Jc(T);if(j!==void 0&&K!==void 0&&Q!==void 0){let te;if(j===N0?te=ua.UTF16(t,l+F,H):te=ua.MACSTRING(t,l+F,H,j),te){let se=n[Q];se===void 0&&(se=n[Q]={});let Ie=se[g];Ie===void 0&&(Ie=se[g]={}),Ie[K]=te}}}return i===1&&a.parseUShort(),n}function Hi(t){const e={};for(let r in t)e[t[r]]=parseInt(r);return e}function eA(t,e,r,n,a,i){return new Ae.Record("NameRecord",[{name:"platformID",type:"USHORT",value:t},{name:"encodingID",type:"USHORT",value:e},{name:"languageID",type:"USHORT",value:r},{name:"nameID",type:"USHORT",value:n},{name:"length",type:"USHORT",value:a},{name:"offset",type:"USHORT",value:i}])}function jc(t,e){const r=t.length,n=e.length-r+1;e:for(let a=0;a<n;a++)for(;a<n;a++){for(let i=0;i<r;i++)if(e[a+i]!==t[i])continue e;return a}return-1}function tA(t,e){let r=jc(t,e);if(r<0){r=e.length;let n=0;const a=t.length;for(;n<a;++n)e.push(t[n])}return r}function Xc(t,e){const r=Hi(tl),n=Hi($1),a=Hi(el),i=[],s=[];for(let E in t){let T;const h=[],u={},C=Hi(io),g=r[E];for(let H in t[E]){let F=C[H];if(F===void 0&&(F=H),T=parseInt(F),isNaN(T))throw new Error('Name table entry "'+H+'" does not exist, see nameTableNames for complete list.');u[T]=t[E][H],h.push(T)}for(let H=0;H<h.length;H++){T=h[H];const F=u[T];for(let K in F){const j=F[K];if(g===1||g===0){let Q=n[K],te=Kc[Q];const se=os(g,te,Q);let Ie=de.MACSTRING(j,se);if(g===0&&(Q=e.indexOf(K),Q<0&&(Q=e.length,e.push(K)),te=4,Ie=de.UTF16(j)),Ie!==void 0){const le=tA(Ie,s);i.push(eA(g,te,Q,T,Ie.length,le))}}if(g===3){const Q=a[K];if(Q!==void 0){const te=de.UTF16(j),se=tA(te,s);i.push(eA(3,1,Q,T,te.length,se))}}}}}i.sort(function(E,T){return E.platformID-T.platformID||E.encodingID-T.encodingID||E.languageID-T.languageID||E.nameID-T.nameID});const l=new Ae.Table("name",[{name:"format",type:"USHORT",value:0},{name:"count",type:"USHORT",value:i.length},{name:"stringOffset",type:"USHORT",value:6+i.length*12}]);for(let E=0;E<i.length;E++)l.fields.push({name:"record_"+E,type:"RECORD",value:i[E]});return l.fields.push({name:"strings",type:"LITERAL",value:s}),l}function oo(t,e,r=[]){if(e<256&&e in io){if(r.length&&!r.includes(parseInt(e)))return;e=io[e]}for(let n in t)for(let a in t[n])if(a===e||parseInt(a)===e)return t[n][a]}var rl={parse:Zc,make:Xc,getNameByID:oo};function qc(t,e,r,n){t.length=e.parseUShort(),t.language=e.parseUShort()-1;const a=e.parseByteList(t.length),i=Object.assign({},a),s=os(r,n,t.language),l=Qi[s];for(let E=0;E<l.length;E++)i[l.charCodeAt(E)]=a[128+E];t.glyphIndexMap=i}function Qc(t,e,r){e.parseUShort(),t.length=e.parseULong(),t.language=e.parseULong();let n;t.groupCount=n=e.parseULong(),t.glyphIndexMap={};for(let a=0;a<n;a+=1){const i=e.parseULong(),s=e.parseULong();let l=e.parseULong();for(let E=i;E<=s;E+=1)t.glyphIndexMap[E]=l,r===12&&l++}}function $c(t,e,r,n,a){t.length=e.parseUShort(),t.language=e.parseUShort();let i;t.segCount=i=e.parseUShort()>>1,e.skip("uShort",3),t.glyphIndexMap={};const s=new pe.Parser(r,n+a+14),l=new pe.Parser(r,n+a+16+i*2),E=new pe.Parser(r,n+a+16+i*4),T=new pe.Parser(r,n+a+16+i*6);let h=n+a+16+i*8;for(let u=0;u<i-1;u+=1){let C;const g=s.parseUShort(),H=l.parseUShort(),F=E.parseShort(),K=T.parseUShort();for(let j=H;j<=g;j+=1)K!==0?(h=T.offset+T.relativeOffset-2,h+=K,h+=(j-H)*2,C=pe.getUShort(r,h),C!==0&&(C=C+F&65535)):C=j+F&65535,t.glyphIndexMap[j]=C}}function eh(t,e){const r={};e.skip("uLong");const n=e.parseULong();for(let a=0;a<n;a+=1){const i=e.parseUInt24(),s={varSelector:i},l=e.parseOffset32(),E=e.parseOffset32(),T=e.relativeOffset;l&&(e.relativeOffset=l,s.defaultUVS=e.parseStruct({ranges:function(){return e.parseRecordList32({startUnicodeValue:e.parseUInt24,additionalCount:e.parseByte})}})),E&&(e.relativeOffset=E,s.nonDefaultUVS=e.parseStruct({uvsMappings:function(){const h={},u=e.parseRecordList32({unicodeValue:e.parseUInt24,glyphID:e.parseUShort});for(let C=0;C<u.length;C+=1)h[u[C].unicodeValue]=u[C];return h}})),r[i]=s,e.relativeOffset=T}t.varSelectorList=r}function th(t,e){const r={};r.version=pe.getUShort(t,e),ye.argument(r.version===0,"cmap table version should be 0."),r.numTables=pe.getUShort(t,e+2);let n=null,a=-1,i=-1,s=null,l=null;const E=[0,1,2,3,4,6],T=[0,1,10];for(let u=r.numTables-1;u>=0;u-=1)if(s=pe.getUShort(t,e+4+u*8),l=pe.getUShort(t,e+4+u*8+2),s===3&&T.includes(l)||s===0&&E.includes(l)||s===1&&l===0){if(i>0)continue;if(i=pe.getULong(t,e+4+u*8+4),n)break}else if(s===0&&l===5){if(a=pe.getULong(t,e+4+u*8+4),n=new pe.Parser(t,e+a),n.parseUShort()!==14)a=-1,n=null;else if(i>0)break}if(i===-1)throw new Error("No valid cmap sub-tables found.");const h=new pe.Parser(t,e+i);if(r.format=h.parseUShort(),r.format===0)qc(r,h,s,l);else if(r.format===12||r.format===13)Qc(r,h,r.format);else if(r.format===4)$c(r,h,t,e,i);else throw new Error("Only format 0 (platformId 1, encodingId 0), 4, 12 and 14 cmap tables are supported (found format "+r.format+", platformId "+s+", encodingId "+l+").");return n&&eh(r,n),r}function rh(t,e,r){t.segments.push({end:e,start:e,delta:-(e-r),offset:0,glyphIndex:r})}function nh(t){t.segments.push({end:65535,start:65535,delta:1,offset:0})}function ah(t){let e=!0,r;for(r=t.length-1;r>0;r-=1)if(t.get(r).unicode>65535){console.log("Adding CMAP format 12 (needed!)"),e=!1;break}let n=[{name:"version",type:"USHORT",value:0},{name:"numTables",type:"USHORT",value:e?1:2},{name:"platformID",type:"USHORT",value:3},{name:"encodingID",type:"USHORT",value:1},{name:"offset",type:"ULONG",value:e?12:20}];e||n.push({name:"cmap12PlatformID",type:"USHORT",value:3},{name:"cmap12EncodingID",type:"USHORT",value:10},{name:"cmap12Offset",type:"ULONG",value:0}),n.push({name:"format",type:"USHORT",value:4},{name:"cmap4Length",type:"USHORT",value:0},{name:"language",type:"USHORT",value:0},{name:"segCountX2",type:"USHORT",value:0},{name:"searchRange",type:"USHORT",value:0},{name:"entrySelector",type:"USHORT",value:0},{name:"rangeShift",type:"USHORT",value:0});const a=new Ae.Table("cmap",n);for(a.segments=[],r=0;r<t.length;r+=1){const g=t.get(r);for(let H=0;H<g.unicodes.length;H+=1)rh(a,g.unicodes[H],r)}a.segments.sort(function(g,H){return g.start-H.start}),nh(a);const i=a.segments.length;let s=0,l=[],E=[],T=[],h=[],u=[],C=[];for(r=0;r<i;r+=1){const g=a.segments[r];g.end<=65535&&g.start<=65535?(l.push({name:"end_"+r,type:"USHORT",value:g.end}),E.push({name:"start_"+r,type:"USHORT",value:g.start}),T.push({name:"idDelta_"+r,type:"SHORT",value:g.delta}),h.push({name:"idRangeOffset_"+r,type:"USHORT",value:g.offset}),g.glyphId!==void 0&&u.push({name:"glyph_"+r,type:"USHORT",value:g.glyphId})):s+=1,!e&&g.glyphIndex!==void 0&&(C.push({name:"cmap12Start_"+r,type:"ULONG",value:g.start}),C.push({name:"cmap12End_"+r,type:"ULONG",value:g.end}),C.push({name:"cmap12Glyph_"+r,type:"ULONG",value:g.glyphIndex}))}a.segCountX2=(i-s)*2,a.searchRange=Math.pow(2,Math.floor(Math.log(i-s)/Math.log(2)))*2,a.entrySelector=Math.log(a.searchRange/2)/Math.log(2),a.rangeShift=a.segCountX2-a.searchRange;for(let g=0;g<l.length;g++)a.fields.push(l[g]);a.fields.push({name:"reservedPad",type:"USHORT",value:0});for(let g=0;g<E.length;g++)a.fields.push(E[g]);for(let g=0;g<T.length;g++)a.fields.push(T[g]);for(let g=0;g<h.length;g++)a.fields.push(h[g]);for(let g=0;g<u.length;g++)a.fields.push(u[g]);if(a.cmap4Length=14+l.length*2+2+E.length*2+T.length*2+h.length*2+u.length*2,!e){const g=16+C.length*4;a.cmap12Offset=12+2*2+4+a.cmap4Length,a.fields.push({name:"cmap12Format",type:"USHORT",value:12},{name:"cmap12Reserved",type:"USHORT",value:0},{name:"cmap12Length",type:"ULONG",value:g},{name:"cmap12Language",type:"ULONG",value:0},{name:"cmap12nGroups",type:"ULONG",value:C.length/3});for(let H=0;H<C.length;H++)a.fields.push(C[H])}return a}var nl={parse:th,make:ah},Yi=[".notdef","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","endash","dagger","daggerdbl","periodcentered","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","questiondown","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","ring","cedilla","hungarumlaut","ogonek","caron","emdash","AE","ordfeminine","Lslash","Oslash","OE","ordmasculine","ae","dotlessi","lslash","oslash","oe","germandbls","onesuperior","logicalnot","mu","trademark","Eth","onehalf","plusminus","Thorn","onequarter","divide","brokenbar","degree","thorn","threequarters","twosuperior","registered","minus","eth","multiply","threesuperior","copyright","Aacute","Acircumflex","Adieresis","Agrave","Aring","Atilde","Ccedilla","Eacute","Ecircumflex","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Ntilde","Oacute","Ocircumflex","Odieresis","Ograve","Otilde","Scaron","Uacute","Ucircumflex","Udieresis","Ugrave","Yacute","Ydieresis","Zcaron","aacute","acircumflex","adieresis","agrave","aring","atilde","ccedilla","eacute","ecircumflex","edieresis","egrave","iacute","icircumflex","idieresis","igrave","ntilde","oacute","ocircumflex","odieresis","ograve","otilde","scaron","uacute","ucircumflex","udieresis","ugrave","yacute","ydieresis","zcaron","exclamsmall","Hungarumlautsmall","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","266 ff","onedotenleader","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","commasuperior","threequartersemdash","periodsuperior","questionsmall","asuperior","bsuperior","centsuperior","dsuperior","esuperior","isuperior","lsuperior","msuperior","nsuperior","osuperior","rsuperior","ssuperior","tsuperior","ff","ffi","ffl","parenleftinferior","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","exclamdownsmall","centoldstyle","Lslashsmall","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","Dotaccentsmall","Macronsmall","figuredash","hypheninferior","Ogoneksmall","Ringsmall","Cedillasmall","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","zerosuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall","001.000","001.001","001.002","001.003","Black","Bold","Book","Light","Medium","Regular","Roman","Semibold"],ih=[".notdef","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","endash","dagger","daggerdbl","periodcentered","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","questiondown","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","ring","cedilla","hungarumlaut","ogonek","caron","emdash","AE","ordfeminine","Lslash","Oslash","OE","ordmasculine","ae","dotlessi","lslash","oslash","oe","germandbls","onesuperior","logicalnot","mu","trademark","Eth","onehalf","plusminus","Thorn","onequarter","divide","brokenbar","degree","thorn","threequarters","twosuperior","registered","minus","eth","multiply","threesuperior","copyright","Aacute","Acircumflex","Adieresis","Agrave","Aring","Atilde","Ccedilla","Eacute","Ecircumflex","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Ntilde","Oacute","Ocircumflex","Odieresis","Ograve","Otilde","Scaron","Uacute","Ucircumflex","Udieresis","Ugrave","Yacute","Ydieresis","Zcaron","aacute","acircumflex","adieresis","agrave","aring","atilde","ccedilla","eacute","ecircumflex","edieresis","egrave","iacute","icircumflex","idieresis","igrave","ntilde","oacute","ocircumflex","odieresis","ograve","otilde","scaron","uacute","ucircumflex","udieresis","ugrave","yacute","ydieresis","zcaron"],oh=[".notdef","space","exclamsmall","Hungarumlautsmall","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","twodotenleader","onedotenleader","comma","hyphen","period","fraction","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","colon","semicolon","commasuperior","threequartersemdash","periodsuperior","questionsmall","asuperior","bsuperior","centsuperior","dsuperior","esuperior","isuperior","lsuperior","msuperior","nsuperior","osuperior","rsuperior","ssuperior","tsuperior","ff","fi","fl","ffi","ffl","parenleftinferior","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","exclamdownsmall","centoldstyle","Lslashsmall","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","Dotaccentsmall","Macronsmall","figuredash","hypheninferior","Ogoneksmall","Ringsmall","Cedillasmall","onequarter","onehalf","threequarters","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","zerosuperior","onesuperior","twosuperior","threesuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall"],sh=[".notdef","space","dollaroldstyle","dollarsuperior","parenleftsuperior","parenrightsuperior","twodotenleader","onedotenleader","comma","hyphen","period","fraction","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","colon","semicolon","commasuperior","threequartersemdash","periodsuperior","asuperior","bsuperior","centsuperior","dsuperior","esuperior","isuperior","lsuperior","msuperior","nsuperior","osuperior","rsuperior","ssuperior","tsuperior","ff","fi","fl","ffi","ffl","parenleftinferior","parenrightinferior","hyphensuperior","colonmonetary","onefitted","rupiah","centoldstyle","figuredash","hypheninferior","onequarter","onehalf","threequarters","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","zerosuperior","onesuperior","twosuperior","threesuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior"],D0=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quoteright","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","quoteleft","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","exclamdown","cent","sterling","fraction","yen","florin","section","currency","quotesingle","quotedblleft","guillemotleft","guilsinglleft","guilsinglright","fi","fl","","endash","dagger","daggerdbl","periodcentered","","paragraph","bullet","quotesinglbase","quotedblbase","quotedblright","guillemotright","ellipsis","perthousand","","questiondown","","grave","acute","circumflex","tilde","macron","breve","dotaccent","dieresis","","ring","cedilla","","hungarumlaut","ogonek","caron","emdash","","","","","","","","","","","","","","","","","AE","","ordfeminine","","","","","Lslash","Oslash","OE","ordmasculine","","","","","","ae","","","","dotlessi","","","lslash","oslash","oe","germandbls"],Ah=["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","space","exclamsmall","Hungarumlautsmall","","dollaroldstyle","dollarsuperior","ampersandsmall","Acutesmall","parenleftsuperior","parenrightsuperior","twodotenleader","onedotenleader","comma","hyphen","period","fraction","zerooldstyle","oneoldstyle","twooldstyle","threeoldstyle","fouroldstyle","fiveoldstyle","sixoldstyle","sevenoldstyle","eightoldstyle","nineoldstyle","colon","semicolon","commasuperior","threequartersemdash","periodsuperior","questionsmall","","asuperior","bsuperior","centsuperior","dsuperior","esuperior","","","isuperior","","","lsuperior","msuperior","nsuperior","osuperior","","","rsuperior","ssuperior","tsuperior","","ff","fi","fl","ffi","ffl","parenleftinferior","","parenrightinferior","Circumflexsmall","hyphensuperior","Gravesmall","Asmall","Bsmall","Csmall","Dsmall","Esmall","Fsmall","Gsmall","Hsmall","Ismall","Jsmall","Ksmall","Lsmall","Msmall","Nsmall","Osmall","Psmall","Qsmall","Rsmall","Ssmall","Tsmall","Usmall","Vsmall","Wsmall","Xsmall","Ysmall","Zsmall","colonmonetary","onefitted","rupiah","Tildesmall","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","exclamdownsmall","centoldstyle","Lslashsmall","","","Scaronsmall","Zcaronsmall","Dieresissmall","Brevesmall","Caronsmall","","Dotaccentsmall","","","Macronsmall","","","figuredash","hypheninferior","","","Ogoneksmall","Ringsmall","Cedillasmall","","","","onequarter","onehalf","threequarters","questiondownsmall","oneeighth","threeeighths","fiveeighths","seveneighths","onethird","twothirds","","","zerosuperior","onesuperior","twosuperior","threesuperior","foursuperior","fivesuperior","sixsuperior","sevensuperior","eightsuperior","ninesuperior","zeroinferior","oneinferior","twoinferior","threeinferior","fourinferior","fiveinferior","sixinferior","seveninferior","eightinferior","nineinferior","centinferior","dollarinferior","periodinferior","commainferior","Agravesmall","Aacutesmall","Acircumflexsmall","Atildesmall","Adieresissmall","Aringsmall","AEsmall","Ccedillasmall","Egravesmall","Eacutesmall","Ecircumflexsmall","Edieresissmall","Igravesmall","Iacutesmall","Icircumflexsmall","Idieresissmall","Ethsmall","Ntildesmall","Ogravesmall","Oacutesmall","Ocircumflexsmall","Otildesmall","Odieresissmall","OEsmall","Oslashsmall","Ugravesmall","Uacutesmall","Ucircumflexsmall","Udieresissmall","Yacutesmall","Thornsmall","Ydieresissmall"],wn=[".notdef",".null","nonmarkingreturn","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quotesingle","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","grave","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","Adieresis","Aring","Ccedilla","Eacute","Ntilde","Odieresis","Udieresis","aacute","agrave","acircumflex","adieresis","atilde","aring","ccedilla","eacute","egrave","ecircumflex","edieresis","iacute","igrave","icircumflex","idieresis","ntilde","oacute","ograve","ocircumflex","odieresis","otilde","uacute","ugrave","ucircumflex","udieresis","dagger","degree","cent","sterling","section","bullet","paragraph","germandbls","registered","copyright","trademark","acute","dieresis","notequal","AE","Oslash","infinity","plusminus","lessequal","greaterequal","yen","mu","partialdiff","summation","product","pi","integral","ordfeminine","ordmasculine","Omega","ae","oslash","questiondown","exclamdown","logicalnot","radical","florin","approxequal","Delta","guillemotleft","guillemotright","ellipsis","nonbreakingspace","Agrave","Atilde","Otilde","OE","oe","endash","emdash","quotedblleft","quotedblright","quoteleft","quoteright","divide","lozenge","ydieresis","Ydieresis","fraction","currency","guilsinglleft","guilsinglright","fi","fl","daggerdbl","periodcentered","quotesinglbase","quotedblbase","perthousand","Acircumflex","Ecircumflex","Aacute","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Oacute","Ocircumflex","apple","Ograve","Uacute","Ucircumflex","Ugrave","dotlessi","circumflex","tilde","macron","breve","dotaccent","ring","cedilla","hungarumlaut","ogonek","caron","Lslash","lslash","Scaron","scaron","Zcaron","zcaron","brokenbar","Eth","eth","Yacute","yacute","Thorn","thorn","minus","multiply","onesuperior","twosuperior","threesuperior","onehalf","onequarter","threequarters","franc","Gbreve","gbreve","Idotaccent","Scedilla","scedilla","Cacute","cacute","Ccaron","ccaron","dcroat"];function al(t){this.font=t}al.prototype.charToGlyphIndex=function(t){const e=t.codePointAt(0),r=this.font.glyphs;if(r)for(let n=0;n<r.length;n+=1){const a=r.get(n);for(let i=0;i<a.unicodes.length;i+=1)if(a.unicodes[i]===e)return n}return null};function il(t){this.cmap=t}il.prototype.charToGlyphIndex=function(t){return this.cmap.glyphIndexMap[t.codePointAt(0)]||0};function ol(t,e){this.encoding=t,this.charset=e}ol.prototype.charToGlyphIndex=function(t){const e=t.codePointAt(0),r=this.encoding[e];return this.charset.indexOf(r)};function ss(t){switch(t.version){case 1:this.names=wn.slice();break;case 2:this.names=new Array(t.numberOfGlyphs);for(let e=0;e<t.numberOfGlyphs;e++)t.glyphNameIndex[e]<wn.length?this.names[e]=wn[t.glyphNameIndex[e]]:this.names[e]=t.names[t.glyphNameIndex[e]-wn.length];break;case 2.5:this.names=new Array(t.numberOfGlyphs);for(let e=0;e<t.numberOfGlyphs;e++)this.names[e]=wn[e+t.glyphNameIndex[e]];break;case 3:this.names=[];break;default:this.names=[];break}}ss.prototype.nameToGlyphIndex=function(t){return this.names.indexOf(t)};ss.prototype.glyphIndexToName=function(t){return this.names[t]};function lh(t){let e;const r=t.tables.cmap.glyphIndexMap,n=Object.keys(r);for(let a=0;a<n.length;a+=1){const i=n[a],s=r[i];e=t.glyphs.get(s),e.addUnicode(parseInt(i))}for(let a=0;a<t.glyphs.length;a+=1)e=t.glyphs.get(a),t.cffEncoding?e.name=t.cffEncoding.charset[a]:t.glyphNames.names&&(e.name=t.glyphNames.glyphIndexToName(a))}function xh(t){t._IndexToUnicodeMap={};const e=t.tables.cmap.glyphIndexMap,r=Object.keys(e);for(let n=0;n<r.length;n+=1){const a=r[n];let i=e[a];t._IndexToUnicodeMap[i]===void 0?t._IndexToUnicodeMap[i]={unicodes:[parseInt(a)]}:t._IndexToUnicodeMap[i].unicodes.push(parseInt(a))}}function Eh(t,e){e.lowMemory?xh(t):lh(t)}function ch(t,e,r,n,a){t.beginPath(),t.moveTo(e,r),t.lineTo(n,a),t.stroke()}var Pn={line:ch};function hh(t,e){const r=new q(t,e),n=r.parseShort();n!==0&&console.warn("Only CPALv0 is currently fully supported.");const a=r.parseShort(),i=r.parseShort(),s=r.parseShort(),l=r.parseOffset32(),E=r.parseUShortList(i);r.relativeOffset=l;const T=r.parseULongList(s);return r.relativeOffset=l,{version:n,numPaletteEntries:a,colorRecords:T,colorRecordIndices:E}}function Lh({version:t=0,numPaletteEntries:e=0,colorRecords:r=[],colorRecordIndices:n=[0]}){return ye.argument(t===0,"Only CPALv0 are supported."),ye.argument(r.length,"No colorRecords given."),ye.argument(n.length,"No colorRecordIndices given."),n.length>1&&ye.argument(e,"Can't infer numPaletteEntries on multiple colorRecordIndices"),new Ae.Table("CPAL",[{name:"version",type:"USHORT",value:t},{name:"numPaletteEntries",type:"USHORT",value:e||r.length},{name:"numPalettes",type:"USHORT",value:n.length},{name:"numColorRecords",type:"USHORT",value:r.length},{name:"colorRecordsArrayOffset",type:"ULONG",value:12+2*n.length},...n.map((a,i)=>({name:"colorRecordIndices_"+i,type:"USHORT",value:a})),...r.map((a,i)=>({name:"colorRecords_"+i,type:"ULONG",value:a}))])}function sl(t){var e=(t&4278190080)>>24,r=(t&16711680)>>16,n=(t&65280)>>8,a=t&255;return e=e+256&255,r=r+256&255,n=n+256&255,a=(a+256&255)/255,{b:e,g:r,r:n,a}}function As(t,e,r=0,n="hexa"){if(e==65535)return"currentColor";const a=t&&t.tables&&t.tables.cpal;if(!a)return"currentColor";if(r>a.colorRecordIndices.length-1)throw new Error(`Palette index out of range (colorRecordIndices.length: ${a.colorRecordIndices.length}, index: ${e})`);if(e>a.numPaletteEntries)throw new Error(`Color index out of range (numPaletteEntries: ${a.numPaletteEntries}, index: ${e})`);const i=a.colorRecordIndices[r]+e;if(i>a.colorRecords)throw new Error(`Color index out of range (colorRecords.length: ${a.colorRecords.length}, lookupIndex: ${i})`);const s=sl(a.colorRecords[i]);return n==="bgra"?s:ga(s,n)}function Hr(t){return("0"+parseInt(t).toString(16)).slice(-2)}function Th(t){const e=t.r/255,r=t.g/255,n=t.b/255,a=Math.max(e,r,n),i=Math.min(e,r,n);let s,l,E=(a+i)/2;if(a===i)s=l=0;else{const T=a-i;switch(l=E>.5?T/(2-a-i):T/(a+i),a){case e:s=(r-n)/T+(r<n?6:0);break;case r:s=(n-e)/T+2;break;case n:s=(e-r)/T+4;break}s/=6}return{h:s*360,s:l*100,l:E*100}}function dh(t){let{h:e,s:r,l:n,a}=t;e=e%360,r/=100,n/=100;const i=(1-Math.abs(2*n-1))*r,s=i*(1-Math.abs(e/60%2-1)),l=n-i/2;let E=0,T=0,h=0;return 0<=e&&e<60?(E=i,T=s,h=0):60<=e&&e<120?(E=s,T=i,h=0):120<=e&&e<180?(E=0,T=i,h=s):180<=e&&e<240?(E=0,T=s,h=i):240<=e&&e<300?(E=s,T=0,h=i):300<=e&&e<=360&&(E=i,T=0,h=s),{r:Math.round((E+l)*255),g:Math.round((T+l)*255),b:Math.round((h+l)*255),a}}function Al(t){return parseInt(`0x${Hr(t.b)}${Hr(t.g)}${Hr(t.r)}${Hr(t.a*255)}`,16)}function so(t,e="hexa"){const r=e=="raw"||e=="cpal",n=Number.isInteger(t);let a=!0;if(n&&r||t==="currentColor")return t;if(typeof t=="object"){if(e=="bgra")return t;if(r)return Al(t)}else if(!n&&/^#([a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/i.test(t.trim())){switch(t=t.trim().substring(1),t.length){case 3:t={r:parseInt(t[0].repeat(2),16),g:parseInt(t[1].repeat(2),16),b:parseInt(t[2].repeat(2),16),a:1};break;case 4:t={r:parseInt(t[0].repeat(2),16),g:parseInt(t[1].repeat(2),16),b:parseInt(t[2].repeat(2),16),a:parseInt(t[3].repeat(2),16)/255};break;case 6:t={r:parseInt(t[0]+t[1],16),g:parseInt(t[2]+t[3],16),b:parseInt(t[4]+t[5],16),a:1};break;case 8:t={r:parseInt(t[0]+t[1],16),g:parseInt(t[2]+t[3],16),b:parseInt(t[4]+t[5],16),a:parseInt(t[6]+t[7],16)/255};break}if(e=="bgra")return t}else if(typeof document<"u"&&/^[a-z]+$/i.test(t)){const i=document.createElement("canvas").getContext("2d");i.fillStyle=t;const s=ga(i.fillStyle,"hexa");s==="#000000ff"&&t.toLowerCase()!=="black"?a=!1:t=s}else{t=t.trim();const i=/rgba?\(\s*(?:(\d*\.\d+)(%?)|(\d+)(%?))\s*(?:,|\s*)\s*(?:(\d*\.\d+)(%?)|(\d+)(%?))\s*(?:,|\s*)\s*(?:(\d*\.\d+)(%?)|(\d+)(%?))\s*(?:(?:,|\s|\/)\s*(?:(0*(?:\.\d+)?()|0*1(?:\.0+)?())|(?:\.\d+)|(\d+)(%)|(\d*\.\d+)(%)))?\s*\)/;if(i.test(t)){const s=t.match(i).filter(l=>typeof l<"u");t={r:Math.round(parseFloat(s[1])/(s[2]?100/255:1)),g:Math.round(parseFloat(s[3])/(s[4]?100/255:1)),b:Math.round(parseFloat(s[5])/(s[6]?100/255:1)),a:s[7]?parseFloat(s[7])/(s[8]?100:1):1}}else{const s=/hsla?\(\s*(?:(\d*\.\d+|\d+)(deg|turn|))\s*(?:,|\s*)\s*(?:(\d*\.\d+)%?|(\d+)%?)\s*(?:,|\s*)\s*(?:(\d*\.\d+)%?|(\d+)%?)\s*(?:(?:,|\s|\/)\s*(?:(0*(?:\.\d+)?()|0*1(?:\.0+)?())|(?:\.\d+)|(\d+)(%)|(\d*\.\d+)(%)))?\s*\)/;if(s.test(t)){const l=t.match(s).filter(E=>typeof E<"u");t=dh({h:parseFloat(l[1])*(l[2]==="turn"?360:1),s:parseFloat(l[3]),l:parseFloat(l[4]),a:l[5]?parseFloat(l[5])/(l[6]?100:1):1})}else a=!1}}if(!a)throw new Error(`Invalid color format: ${t}`);return ga(t,e)}function ga(t,e="hexa"){if(t==="currentColor")return t;if(Number.isInteger(t)){if(e=="raw"||e=="cpal")return t;t=sl(t)}else typeof t!="object"&&(t=so(t,"bgra"));let r=["hsl","hsla"].includes(e)?Th(t):null;switch(e){case"rgba":return`rgba(${t.r}, ${t.g}, ${t.b}, ${parseFloat(t.a.toFixed(3))})`;case"rgb":return`rgb(${t.r}, ${t.g}, ${t.b})`;case"hex":case"hex6":case"hex-6":return`#${Hr(t.r)}${Hr(t.g)}${Hr(t.b)}`;case"hexa":case"hex8":case"hex-8":return`#${Hr(t.r)}${Hr(t.g)}${Hr(t.b)}${Hr(t.a*255)}`;case"hsl":return`hsl(${r.h.toFixed(2)}, ${r.s.toFixed(2)}%, ${r.l.toFixed(2)}%)`;case"hsla":return`hsla(${r.h.toFixed(2)}, ${r.s.toFixed(2)}%, ${r.l.toFixed(2)}%, ${parseFloat(t.a.toFixed(3))})`;case"bgra":return t;case"raw":case"cpal":return Al(t);default:throw new Error("Unknown color format: "+e)}}var ll={parse:hh,make:Lh,getPaletteColor:As,parseColor:so,formatColor:ga};function Ih(t,e){let r=e||new Kn;return{configurable:!0,get:function(){return typeof r=="function"&&(r=r()),r},set:function(n){r=n}}}function or(t){this.bindConstructorValues(t)}or.prototype.bindConstructorValues=function(t){if(this.index=t.index||0,t.name===".notdef"?t.unicode=void 0:t.name===".null"&&(t.unicode=0),t.unicode===0&&t.name!==".null")throw new Error('The unicode value "0" is reserved for the glyph name ".null" and cannot be used by any other glyph.');this.name=t.name||null,this.unicode=t.unicode,this.unicodes=t.unicodes||(t.unicode!==void 0?[t.unicode]:[]),"xMin"in t&&(this.xMin=t.xMin),"yMin"in t&&(this.yMin=t.yMin),"xMax"in t&&(this.xMax=t.xMax),"yMax"in t&&(this.yMax=t.yMax),"advanceWidth"in t&&(this.advanceWidth=t.advanceWidth),"leftSideBearing"in t&&(this.leftSideBearing=t.leftSideBearing),"points"in t&&(this.points=t.points),Object.defineProperty(this,"path",Ih(this,t.path))};or.prototype.addUnicode=function(t){this.unicodes.length===0&&(this.unicode=t),this.unicodes.push(t)};or.prototype.getBoundingBox=function(){return this.path.getBoundingBox()};or.prototype.getPath=function(t,e,r,n,a){t=t!==void 0?t:0,e=e!==void 0?e:0,r=r!==void 0?r:72,n=Object.assign({},a&&a.defaultRenderOptions,n);let i,s,l=n.xScale,E=n.yScale;const T=1/(this.path.unitsPerEm||1e3)*r;let h=this;a&&a.variation&&(h=a.variation.getTransform(this,n.variation),i=h.path.commands),n.hinting&&a&&a.hinting&&(s=h.path&&a.hinting.exec(h,r,n)),s?(i=a.hinting.getCommands(s),t=Math.round(t),e=Math.round(e),l=E=1):(i=h.path.commands,l===void 0&&(l=T),E===void 0&&(E=T));const u=new Kn;if(n.drawSVG){const C=this.getSvgImage(a);if(C){const g=new Kn;return g._image={image:C.image,x:t+C.leftSideBearing*T,y:e-C.baseline*T,width:C.image.width*T,height:C.image.height*T},u._layers=[g],u}}if(n.drawLayers){const C=this.getLayers(a);if(C&&C.length){u._layers=[];for(let g=0;g<C.length;g+=1){const H=C[g];let F=As(a,H.paletteIndex,n.usePalette);F==="currentColor"?F=n.fill||"black":F=ga(F,n.colorFormat||"rgba"),n=Object.assign({},n,{fill:F}),u._layers.push(this.getPath.call(H.glyph,t,e,r,n,a))}return u}}u.fill=n.fill||this.path.fill,u.stroke=this.path.stroke,u.strokeWidth=this.path.strokeWidth*T;for(let C=0;C<i.length;C+=1){const g=i[C];g.type==="M"?u.moveTo(t+g.x*l,e+-g.y*E):g.type==="L"?u.lineTo(t+g.x*l,e+-g.y*E):g.type==="Q"?u.quadraticCurveTo(t+g.x1*l,e+-g.y1*E,t+g.x*l,e+-g.y*E):g.type==="C"?u.curveTo(t+g.x1*l,e+-g.y1*E,t+g.x2*l,e+-g.y2*E,t+g.x*l,e+-g.y*E):g.type==="Z"&&u.stroke&&u.strokeWidth&&u.closePath()}return u};or.prototype.getLayers=function(t){if(!t)throw Error("The font object is required to read the colr/cpal tables in order to get the layers.");return t.layers.get(this.index)};or.prototype.getSvgImage=function(t){if(!t)throw Error("The font object is required to read the svg table in order to get the image.");return t.svgImages.get(this.index)};or.prototype.getContours=function(t=null){if(this.points===void 0&&!t)return[];const e=[];let r=[],n=t||this.points;for(let a=0;a<n.length;a+=1){const i=n[a];r.push(i),i.lastPointOfContour&&(e.push(r),r=[])}return ye.argument(r.length===0,"There are still points left in the current contour."),e};or.prototype.getMetrics=function(){const t=this.path.commands,e=[],r=[];for(let a=0;a<t.length;a+=1){const i=t[a];i.type!=="Z"&&(e.push(i.x),r.push(i.y)),(i.type==="Q"||i.type==="C")&&(e.push(i.x1),r.push(i.y1)),i.type==="C"&&(e.push(i.x2),r.push(i.y2))}const n={xMin:Math.min.apply(null,e),yMin:Math.min.apply(null,r),xMax:Math.max.apply(null,e),yMax:Math.max.apply(null,r),leftSideBearing:this.leftSideBearing};return isFinite(n.xMin)||(n.xMin=0),isFinite(n.xMax)||(n.xMax=this.advanceWidth),isFinite(n.yMin)||(n.yMin=0),isFinite(n.yMax)||(n.yMax=0),n.rightSideBearing=this.advanceWidth-n.leftSideBearing-(n.xMax-n.xMin),n};or.prototype.draw=function(t,e,r,n,a,i){a=Object.assign({},i.defaultRenderOptions,a),this.getPath(e,r,n,a,i).draw(t)};or.prototype.drawPoints=function(t,e,r,n,a,i){if(a=Object.assign({},i&&i.defaultRenderOptions,a),a.drawLayers){const C=this.getLayers(i);if(C&&C.length){for(let g=0;g<C.length;g+=1)C[g].glyph.index!==this.index&&this.drawPoints.call(C[g].glyph,t,e,r,n);return}}function s(C,g,H,F){t.beginPath();for(let K=0;K<C.length;K+=1)t.moveTo(g+C[K].x*F,H+C[K].y*F),t.arc(g+C[K].x*F,H+C[K].y*F,2,0,Math.PI*2,!1);t.fill()}e=e!==void 0?e:0,r=r!==void 0?r:0,n=n!==void 0?n:24;const l=1/this.path.unitsPerEm*n,E=[],T=[];let u=this.path.commands;i&&i.variation&&(u=i.variation.getTransform(this,a.variation).path.commands);for(let C=0;C<u.length;C+=1){const g=u[C];g.x!==void 0&&E.push({x:g.x,y:-g.y}),g.x1!==void 0&&T.push({x:g.x1,y:-g.y1}),g.x2!==void 0&&T.push({x:g.x2,y:-g.y2})}t.fillStyle="blue",s(E,e,r,l),t.fillStyle="red",s(T,e,r,l)};or.prototype.drawMetrics=function(t,e,r,n){let a;e=e!==void 0?e:0,r=r!==void 0?r:0,n=n!==void 0?n:24,a=1/this.path.unitsPerEm*n,t.lineWidth=1,t.strokeStyle="black",Pn.line(t,e,-1e4,e,1e4),Pn.line(t,-1e4,r,1e4,r);const i=this.xMin||0;let s=this.yMin||0;const l=this.xMax||0;let E=this.yMax||0;const T=this.advanceWidth||0;t.strokeStyle="blue",Pn.line(t,e+i*a,-1e4,e+i*a,1e4),Pn.line(t,e+l*a,-1e4,e+l*a,1e4),Pn.line(t,-1e4,r+-s*a,1e4,r+-s*a),Pn.line(t,-1e4,r+-E*a,1e4,r+-E*a),t.strokeStyle="green",Pn.line(t,e+T*a,-1e4,e+T*a,1e4)};or.prototype.toPathData=function(t,e){t=Object.assign({},{variation:e&&e.defaultRenderOptions.variation},t);let r=this;e&&e.variation&&(r=e.variation.getTransform(this,t.variation));let n=r.points&&t.pointsTransform?t.pointsTransform(r.points):r.path;return t.pathTramsform&&(n=t.pathTramsform(n)),n.toPathData(t)};or.prototype.fromSVG=function(t,e={}){return this.path.fromSVG(t,e)};or.prototype.toSVG=function(t,e){const r=this.toPathData.apply(this,[t,e]);return this.path.toSVG(t,r)};or.prototype.toDOMElement=function(t,e){t=Object.assign({},{variation:e&&e.defaultRenderOptions.variation},t);let r=this.path;return e&&e.variation&&(r=e.variation.getTransform(this,t.variation).path),r.toDOMElement(t)};var Ca=or;function ia(t,e,r){Object.defineProperty(t,e,{get:function(){return typeof t[r]>"u"&&t.path,t[r]},set:function(n){t[r]=n},enumerable:!0,configurable:!0})}function mo(t,e){if(this.font=t,this.glyphs={},Array.isArray(e))for(let r=0;r<e.length;r++){const n=e[r];n.path.unitsPerEm=t.unitsPerEm,this.glyphs[r]=n}this.length=e&&e.length||0}typeof Symbol<"u"&&Symbol.iterator&&(mo.prototype[Symbol.iterator]=function(){let t=-1;return{next:(function(){t++;const e=t>=this.length-1;return{value:this.get(t),done:e}}).bind(this)}});mo.prototype.get=function(t){if(this.font._push&&this.glyphs[t]===void 0){this.font._push(t),typeof this.glyphs[t]=="function"&&(this.glyphs[t]=this.glyphs[t]());let e=this.glyphs[t],r=this.font._IndexToUnicodeMap[t];if(r)for(let n=0;n<r.unicodes.length;n++)e.addUnicode(r.unicodes[n]);this.font.cffEncoding?e.name=this.font.cffEncoding.charset[t]:this.font.glyphNames.names&&(e.name=this.font.glyphNames.glyphIndexToName(t)),this.glyphs[t].advanceWidth=this.font._hmtxTableData[t].advanceWidth,this.glyphs[t].leftSideBearing=this.font._hmtxTableData[t].leftSideBearing}else typeof this.glyphs[t]=="function"&&(this.glyphs[t]=this.glyphs[t]());return this.glyphs[t]};mo.prototype.push=function(t,e){this.glyphs[t]=e,this.length++};function uh(t,e){return new Ca({index:e,font:t})}function ph(t,e,r,n,a,i){return function(){const s=new Ca({index:e,font:t});return s.path=function(){r(s,n,a);const l=i(t.glyphs,s);return l.unitsPerEm=t.unitsPerEm,l},ia(s,"numberOfContours","_numberOfContours"),ia(s,"xMin","_xMin"),ia(s,"xMax","_xMax"),ia(s,"yMin","_yMin"),ia(s,"yMax","_yMax"),ia(s,"points","_points"),s}}function Sh(t,e,r,n,a){return function(){const i=new Ca({index:e,font:t});return i.path=function(){const s=r(t,i,n,a);return s.unitsPerEm=t.unitsPerEm,s},i}}var Xr={GlyphSet:mo,glyphLoader:uh,ttfGlyphLoader:ph,cffGlyphLoader:Sh};function xl(t,e){if(t===e)return!0;if(Array.isArray(t)&&Array.isArray(e)){if(t.length!==e.length)return!1;for(let r=0;r<t.length;r+=1)if(!xl(t[r],e[r]))return!1;return!0}else return!1}function Ao(t){let e;return t.length<1240?e=107:t.length<33900?e=1131:e=32768,e}function Vr(t,e,r,n){const a=[],i=[],s=n>1?pe.getULong(t,e):pe.getCard16(t,e),l=n>1?4:2;let E,T;if(s!==0){const h=pe.getByte(t,e+l);E=e+(s+1)*h+l;let u=e+l+1;for(let C=0;C<s+1;C+=1)a.push(pe.getOffset(t,u,h)),u+=h;T=E+a[s]}else T=e+l;for(let h=0;h<a.length-1;h+=1){let u=pe.getBytes(t,E+a[h],E+a[h+1]);r&&(u=r(u,t,e,n)),i.push(u)}return{objects:i,startOffset:e,endOffset:T}}function gh(t,e,r){const n=[],a=r>1?pe.getULong(t,e):pe.getCard16(t,e),i=r>1?4:2;let s,l;if(a!==0){const E=pe.getByte(t,e+i);s=e+(a+1)*E+i;let T=e+i+1;for(let h=0;h<a+1;h+=1)n.push(pe.getOffset(t,T,E)),T+=E;l=s+n[a]}else l=e+i;return{offsets:n,startOffset:e,endOffset:l}}function Ch(t,e,r,n,a,i){const s=i>1?pe.getULong(r,n):pe.getCard16(r,n),l=i>1?4:2;let E=0;if(s!==0){const h=pe.getByte(r,n+l);E=n+(s+1)*h+l}return pe.getBytes(r,E+e[t],E+e[t+1])}function Rh(t){let e="";const n=["0","1","2","3","4","5","6","7","8","9",".","E","E-",null,"-"];for(;;){const a=t.parseByte(),i=a>>4,s=a&15;if(i===15||(e+=n[i],s===15))break;e+=n[s]}return parseFloat(e)}function yh(t,e){let r,n,a,i;if(e===28)return r=t.parseByte(),n=t.parseByte(),r<<8|n;if(e===29)return r=t.parseByte(),n=t.parseByte(),a=t.parseByte(),i=t.parseByte(),r<<24|n<<16|a<<8|i;if(e===30)return Rh(t);if(e>=32&&e<=246)return e-139;if(e>=247&&e<=250)return r=t.parseByte(),(e-247)*256+r+108;if(e>=251&&e<=254)return r=t.parseByte(),-(e-251)*256-r-108;throw new Error("Invalid b0 "+e)}function mh(t){const e={};for(let r=0;r<t.length;r+=1){const n=t[r][0],a=t[r][1];let i;if(a.length===1?i=a[0]:i=a,Object.prototype.hasOwnProperty.call(e,n)&&!isNaN(e[n]))throw new Error("Object "+e+" already has key "+n);e[n]=i}return e}function ls(t,e,r,n){e=e!==void 0?e:0;const a=new pe.Parser(t,e),i=[];let s=[];r=r!==void 0?r:t.byteLength;let l=n<2?22:28;for(;a.relativeOffset<r;){let E=a.parseByte();if(E<l){if(E===12&&(E=1200+a.parseByte()),n>1&&E===23){bh(s);continue}i.push([E,s]),s=[]}else s.push(yh(a,E))}return mh(i)}function Wa(t,e){return e<=390?e=Yi[e]:t?e=t[e-391]:e=void 0,e}function xs(t,e,r){const n={};let a;for(let i=0;i<e.length;i+=1){const s=e[i];if(Array.isArray(s.type)){const l=[];l.length=s.type.length;for(let E=0;E<s.type.length;E++)a=t[s.op]!==void 0?t[s.op][E]:void 0,a===void 0&&(a=s.value!==void 0&&s.value[E]!==void 0?s.value[E]:null),s.type[E]==="SID"&&(a=Wa(r,a)),l[E]=a;n[s.name]=l}else a=t[s.op],a===void 0&&(a=s.value!==void 0?s.value:null),s.type==="SID"&&(a=Wa(r,a)),n[s.name]=a}return n}function fh(t,e){const r={};if(r.formatMajor=pe.getCard8(t,e),r.formatMinor=pe.getCard8(t,e+1),r.formatMajor>2)throw new Error(`Unsupported CFF table version ${r.formatMajor}.${r.formatMinor}`);return r.size=pe.getCard8(t,e+2),r.formatMajor<2?(r.offsetSize=pe.getCard8(t,e+3),r.startOffset=e,r.endOffset=e+4):(r.topDictLength=pe.getCard16(t,e+3),r.endOffset=e+8),r}var El=[{name:"version",op:0,type:"SID"},{name:"notice",op:1,type:"SID"},{name:"copyright",op:1200,type:"SID"},{name:"fullName",op:2,type:"SID"},{name:"familyName",op:3,type:"SID"},{name:"weight",op:4,type:"SID"},{name:"isFixedPitch",op:1201,type:"number",value:0},{name:"italicAngle",op:1202,type:"number",value:0},{name:"underlinePosition",op:1203,type:"number",value:-100},{name:"underlineThickness",op:1204,type:"number",value:50},{name:"paintType",op:1205,type:"number",value:0},{name:"charstringType",op:1206,type:"number",value:2},{name:"fontMatrix",op:1207,type:["real","real","real","real","real","real"],value:[.001,0,0,.001,0,0]},{name:"uniqueId",op:13,type:"number"},{name:"fontBBox",op:5,type:["number","number","number","number"],value:[0,0,0,0]},{name:"strokeWidth",op:1208,type:"number",value:0},{name:"xuid",op:14,type:[],value:null},{name:"charset",op:15,type:"offset",value:0},{name:"encoding",op:16,type:"offset",value:0},{name:"charStrings",op:17,type:"offset",value:0},{name:"private",op:18,type:["number","offset"],value:[0,0]},{name:"ros",op:1230,type:["SID","SID","number"]},{name:"cidFontVersion",op:1231,type:"number",value:0},{name:"cidFontRevision",op:1232,type:"number",value:0},{name:"cidFontType",op:1233,type:"number",value:0},{name:"cidCount",op:1234,type:"number",value:8720},{name:"uidBase",op:1235,type:"number"},{name:"fdArray",op:1236,type:"offset"},{name:"fdSelect",op:1237,type:"offset"},{name:"fontName",op:1238,type:"SID"}],Nh=[{name:"fontMatrix",op:1207,type:["real","real","real","real","real","real"],value:[.001,0,0,.001,0,0]},{name:"charStrings",op:17,type:"offset"},{name:"fdArray",op:1236,type:"offset"},{name:"fdSelect",op:1237,type:"offset"},{name:"vstore",op:24,type:"offset"}],cl=[{name:"subrs",op:19,type:"offset",value:0},{name:"defaultWidthX",op:20,type:"number",value:0},{name:"nominalWidthX",op:21,type:"number",value:0}],Dh=[{name:"blueValues",op:6,type:"delta"},{name:"otherBlues",op:7,type:"delta"},{name:"familyBlues",op:7,type:"delta"},{name:"familyBlues",op:8,type:"delta"},{name:"familyOtherBlues",op:9,type:"delta"},{name:"blueScale",op:1209,type:"number",value:.039625},{name:"blueShift",op:1210,type:"number",value:7},{name:"blueFuzz",op:1211,type:"number",value:1},{name:"stdHW",op:10,type:"number"},{name:"stdVW",op:11,type:"number"},{name:"stemSnapH",op:1212,type:"number"},{name:"stemSnapV",op:1213,type:"number"},{name:"languageGroup",op:1217,type:"number",value:0},{name:"expansionFactor",op:1218,type:"number",value:.06},{name:"vsindex",op:22,type:"number",value:0},{name:"subrs",op:19,type:"offset"}],Oh=[{name:"private",op:18,type:["number","offset"],value:[0,0]}];function Bh(t,e,r,n){const a=ls(t,e,t.byteLength,n);return xs(a,n>1?Nh:El,r)}function Es(t,e,r,n,a){const i=ls(t,e,r,a);return xs(i,a>1?Dh:cl,n)}function Hh(t,e,r){const n=ls(t,e,void 0,r);return xs(n,Oh)}function Fh(t,e,r){const n=[];for(let a=0;a<r.length;a++){const i=new DataView(new Uint8Array(r[a]).buffer),s=Hh(i,0,2),l=s.private[0],E=s.private[1];if(l!==0&&E!==0){const T=Es(t,E+e,l,[],2);if(T.subrs){const h=E+T.subrs,u=Vr(t,h+e,void 0,2);s._subrs=u.objects,s._subrsBias=Ao(s._subrs)}s._privateDict=T}n.push(s)}return n}function Jo(t,e,r,n,a){const i=[];for(let s=0;s<r.length;s+=1){const l=new DataView(new Uint8Array(r[s]).buffer),E=Bh(l,0,n,a);E._subrs=[],E._subrsBias=0,E._defaultWidthX=0,E._nominalWidthX=0;const T=a<2?E.private[0]:0,h=a<2?E.private[1]:0;if(T!==0&&h!==0){const u=Es(t,h+e,T,n,a);if(E._defaultWidthX=u.defaultWidthX,E._nominalWidthX=u.nominalWidthX,u.subrs!==0){const C=h+u.subrs,g=Vr(t,C+e,void 0,a);E._subrs=g.objects,E._subrsBias=Ao(E._subrs)}E._privateDict=u}i.push(E)}return i}function Mh(t,e,r,n,a){let i,s;const l=new pe.Parser(t,e);r-=1;const E=[".notdef"],T=l.parseCard8();if(T===0)for(let h=0;h<r;h+=1)i=l.parseSID(),a?E.push(i):E.push(Wa(n,i)||i);else if(T===1)for(;E.length<=r;){i=l.parseSID(),s=l.parseCard8();for(let h=0;h<=s;h+=1)a?E.push("cid"+("00000"+i).slice(-5)):E.push(Wa(n,i)||i),i+=1}else if(T===2)for(;E.length<=r;){i=l.parseSID(),s=l.parseCard16();for(let h=0;h<=s;h+=1)a?E.push("cid"+("00000"+i).slice(-5)):E.push(Wa(n,i)||i),i+=1}else throw new Error("Unknown charset format "+T);return E}function Gh(t,e){let r;const n={},a=new pe.Parser(t,e),i=a.parseCard8();if(i===0){const s=a.parseCard8();for(let l=0;l<s;l+=1)r=a.parseCard8(),n[r]=l}else if(i===1){const s=a.parseCard8();r=1;for(let l=0;l<s;l+=1){const E=a.parseCard8(),T=a.parseCard8();for(let h=E;h<=E+T;h+=1)n[h]=r,r+=1}}else throw new Error("Unknown encoding format "+i);return n}function bh(t){let e=t.pop();for(;t.length>e;)t.pop()}function hl(t,e){const r=t.tables.cff&&t.tables.cff.topDict&&t.tables.cff.topDict.paintType||0;return r===2&&(e.fill=null,e.stroke="black",e.strokeWidth=t.tables.cff.topDict.strokeWidth||0),r}function O0(t,e,r,n,a){let i,s,l,E;const T=new Kn,h=[];let u=0,C=!1,g=!1,H=0,F=0,K,j,Q,te,se=0,Ie=[],le;const ue=t.tables.cff2||t.tables.cff;if(Q=ue.topDict._defaultWidthX,te=ue.topDict._nominalWidthX,a=a||t.variation&&t.variation.get(),e.getBlendPath||(e.getBlendPath=function(Oe){return O0(t,e,r,n,Oe)}),t.isCIDFont||n>1){const Oe=ue.topDict._fdSelect?ue.topDict._fdSelect[e.index]:0,ae=ue.topDict._fdArray[Oe];K=ae._subrs,j=ae._subrsBias,n>1?(Ie=ue.topDict._vstore.itemVariationStore,se=ae._privateDict.vsindex):(Q=ae._defaultWidthX,te=ae._nominalWidthX)}else K=ue.topDict._subrs,j=ue.topDict._subrsBias;const ve=hl(t,T);let Ye=Q;function Re(Oe,ae){g&&ve!==2&&T.closePath(),T.moveTo(Oe,ae),g=!0}function Me(){let Oe;Oe=(h.length&1)!==0,Oe&&!C&&(Ye=h.shift()+te),u+=h.length>>1,h.length=0,C=!0}function xt(Oe){let ae,me,ne,Dt,wt,We,dt,Qt,$t,bt,jt,rt,ut=0;for(;ut<Oe.length;){let Xt=Oe[ut];switch(ut+=1,Xt){case 1:Me();break;case 3:Me();break;case 4:h.length>1&&!C&&(Ye=h.shift()+te,C=!0),F+=h.pop(),Re(H,F);break;case 5:for(;h.length>0;)H+=h.shift(),F+=h.shift(),T.lineTo(H,F);break;case 6:for(;h.length>0&&(H+=h.shift(),T.lineTo(H,F),h.length!==0);)F+=h.shift(),T.lineTo(H,F);break;case 7:for(;h.length>0&&(F+=h.shift(),T.lineTo(H,F),h.length!==0);)H+=h.shift(),T.lineTo(H,F);break;case 8:for(;h.length>0;)i=H+h.shift(),s=F+h.shift(),l=i+h.shift(),E=s+h.shift(),H=l+h.shift(),F=E+h.shift(),T.curveTo(i,s,l,E,H,F);break;case 10:wt=h.pop()+j,We=K[wt],We&&xt(We);break;case 11:if(n>1){console.error("CFF CharString operator return (11) is not supported in CFF2");break}return;case 12:switch(Xt=Oe[ut],ut+=1,Xt){case 35:i=H+h.shift(),s=F+h.shift(),l=i+h.shift(),E=s+h.shift(),dt=l+h.shift(),Qt=E+h.shift(),$t=dt+h.shift(),bt=Qt+h.shift(),jt=$t+h.shift(),rt=bt+h.shift(),H=jt+h.shift(),F=rt+h.shift(),h.shift(),T.curveTo(i,s,l,E,dt,Qt),T.curveTo($t,bt,jt,rt,H,F);break;case 34:i=H+h.shift(),s=F,l=i+h.shift(),E=s+h.shift(),dt=l+h.shift(),Qt=E,$t=dt+h.shift(),bt=E,jt=$t+h.shift(),rt=F,H=jt+h.shift(),T.curveTo(i,s,l,E,dt,Qt),T.curveTo($t,bt,jt,rt,H,F);break;case 36:i=H+h.shift(),s=F+h.shift(),l=i+h.shift(),E=s+h.shift(),dt=l+h.shift(),Qt=E,$t=dt+h.shift(),bt=E,jt=$t+h.shift(),rt=bt+h.shift(),H=jt+h.shift(),T.curveTo(i,s,l,E,dt,Qt),T.curveTo($t,bt,jt,rt,H,F);break;case 37:i=H+h.shift(),s=F+h.shift(),l=i+h.shift(),E=s+h.shift(),dt=l+h.shift(),Qt=E+h.shift(),$t=dt+h.shift(),bt=Qt+h.shift(),jt=$t+h.shift(),rt=bt+h.shift(),Math.abs(jt-H)>Math.abs(rt-F)?H=jt+h.shift():F=rt+h.shift(),T.curveTo(i,s,l,E,dt,Qt),T.curveTo($t,bt,jt,rt,H,F);break;default:console.log("Glyph "+e.index+": unknown operator 1200"+Xt),h.length=0}break;case 14:if(n>1){console.error("CFF CharString operator endchar (14) is not supported in CFF2");break}if(h.length>=4){const en=D0[h.pop()],tn=D0[h.pop()],ra=h.pop(),na=h.pop();if(en&&tn){e.isComposite=!0,e.components=[];const yi=t.cffEncoding.charset.indexOf(en),mi=t.cffEncoding.charset.indexOf(tn);e.components.push({glyphIndex:mi,dx:0,dy:0}),e.components.push({glyphIndex:yi,dx:na,dy:ra}),T.extend(t.glyphs.get(mi).path);const Ht=t.glyphs.get(yi),Mn=JSON.parse(JSON.stringify(Ht.path.commands));for(let gt=0;gt<Mn.length;gt+=1){const ur=Mn[gt];ur.type!=="Z"&&(ur.x+=na,ur.y+=ra),(ur.type==="Q"||ur.type==="C")&&(ur.x1+=na,ur.y1+=ra),ur.type==="C"&&(ur.x2+=na,ur.y2+=ra)}T.extend(Mn)}}else h.length>0&&!C&&(Ye=h.shift()+te,C=!0);g&&ve!==2&&(T.closePath(),g=!1);break;case 15:if(n<2){console.error("CFF2 CharString operator vsindex (15) is not supported in CFF");break}se=h.pop();break;case 16:if(n<2){console.error("CFF2 CharString operator blend (16) is not supported in CFF");break}le||(le=t.variation&&a&&t.variation.process.getBlendVector(Ie,se,a));var Ur=h.pop(),ot=le?le.length:Ie.itemVariationSubtables[se].regionIndexes.length,Xe=Ur*ot,st=h.length-Xe,et=st-Ur;if(le)for(let en=0;en<Ur;en++){var Nr=h[et+en];for(let tn=0;tn<ot;tn++)Nr+=le[tn]*h[st++];h[et+en]=Nr}for(;Xe--;)h.pop();break;case 18:Me();break;case 19:case 20:Me(),ut+=u+7>>3;break;case 21:h.length>2&&!C&&(Ye=h.shift()+te,C=!0),F+=h.pop(),H+=h.pop(),Re(H,F);break;case 22:h.length>1&&!C&&(Ye=h.shift()+te,C=!0),H+=h.pop(),Re(H,F);break;case 23:Me();break;case 24:for(;h.length>2;)i=H+h.shift(),s=F+h.shift(),l=i+h.shift(),E=s+h.shift(),H=l+h.shift(),F=E+h.shift(),T.curveTo(i,s,l,E,H,F);H+=h.shift(),F+=h.shift(),T.lineTo(H,F);break;case 25:for(;h.length>6;)H+=h.shift(),F+=h.shift(),T.lineTo(H,F);i=H+h.shift(),s=F+h.shift(),l=i+h.shift(),E=s+h.shift(),H=l+h.shift(),F=E+h.shift(),T.curveTo(i,s,l,E,H,F);break;case 26:for(h.length&1&&(H+=h.shift());h.length>0;)i=H,s=F+h.shift(),l=i+h.shift(),E=s+h.shift(),H=l,F=E+h.shift(),T.curveTo(i,s,l,E,H,F);break;case 27:for(h.length&1&&(F+=h.shift());h.length>0;)i=H+h.shift(),s=F,l=i+h.shift(),E=s+h.shift(),H=l+h.shift(),F=E,T.curveTo(i,s,l,E,H,F);break;case 28:ae=Oe[ut],me=Oe[ut+1],h.push((ae<<24|me<<16)>>16),ut+=2;break;case 29:wt=h.pop()+t.gsubrsBias,We=t.gsubrs[wt],We&&xt(We);break;case 30:for(;h.length>0&&(i=H,s=F+h.shift(),l=i+h.shift(),E=s+h.shift(),H=l+h.shift(),F=E+(h.length===1?h.shift():0),T.curveTo(i,s,l,E,H,F),h.length!==0);)i=H+h.shift(),s=F,l=i+h.shift(),E=s+h.shift(),F=E+h.shift(),H=l+(h.length===1?h.shift():0),T.curveTo(i,s,l,E,H,F);break;case 31:for(;h.length>0&&(i=H+h.shift(),s=F,l=i+h.shift(),E=s+h.shift(),F=E+h.shift(),H=l+(h.length===1?h.shift():0),T.curveTo(i,s,l,E,H,F),h.length!==0);)i=H,s=F+h.shift(),l=i+h.shift(),E=s+h.shift(),H=l+h.shift(),F=E+(h.length===1?h.shift():0),T.curveTo(i,s,l,E,H,F);break;default:Xt<32?console.log("Glyph "+e.index+": unknown operator "+Xt):Xt<247?h.push(Xt-139):Xt<251?(ae=Oe[ut],ut+=1,h.push((Xt-247)*256+ae+108)):Xt<255?(ae=Oe[ut],ut+=1,h.push(-(Xt-251)*256-ae-108)):(ae=Oe[ut],me=Oe[ut+1],ne=Oe[ut+2],Dt=Oe[ut+3],ut+=4,h.push((ae<<24|me<<16|ne<<8|Dt)/65536))}}}return xt(r),t.variation&&a&&(T.commands=T.commands.map(Oe=>{const ae=Object.keys(Oe);for(let me=0;me<ae.length;me++){const ne=ae[me];ne!=="type"&&(Oe[ne]=Math.round(Oe[ne]))}return Oe})),C&&(e.advanceWidth=Ye),T}function rA(t,e,r,n,a){const i=[];let s;const l=new pe.Parser(t,e),E=l.parseCard8();if(E===0)for(let T=0;T<r;T++){if(s=l.parseCard8(),s>=n)throw new Error("CFF table CID Font FDSelect has bad FD index value "+s+" (FD count "+n+")");i.push(s)}else if(E===3||a>1&&E===4){const T=E===4?l.parseULong():l.parseCard16();let h=E===4?l.parseULong():l.parseCard16();if(h!==0)throw new Error(`CFF Table CID Font FDSelect format ${E} range has bad initial GID ${h}`);let u;for(let C=0;C<T;C++){if(s=E===4?l.parseUShort():l.parseCard8(),u=E===4?l.parseULong():l.parseCard16(),s>=n)throw new Error("CFF table CID Font FDSelect has bad FD index value "+s+" (FD count "+n+")");if(u>r)throw new Error(`CFF Table CID Font FDSelect format ${a} range has bad GID ${u}`);for(;h<u;h++)i.push(s);h=u}if(u!==r)throw new Error("CFF Table CID Font FDSelect format 3 range has bad final (Sentinal) GID "+u)}else throw new Error("CFF Table CID Font FDSelect table has unsupported format "+E);return i}function Ph(t,e,r,n){let a;const i=fh(t,e);i.formatMajor===2?a=r.tables.cff2={}:a=r.tables.cff={};const s=i.formatMajor>1?null:Vr(t,i.endOffset,pe.bytesToString),l=i.formatMajor>1?null:Vr(t,s.endOffset),E=i.formatMajor>1?null:Vr(t,l.endOffset,pe.bytesToString),T=Vr(t,i.formatMajor>1?e+i.size+i.topDictLength:E.endOffset,void 0,i.formatMajor);r.gsubrs=T.objects,r.gsubrsBias=Ao(r.gsubrs);let h;if(i.formatMajor>1){const C=e+i.size,g=pe.getBytes(t,C,C+i.topDictLength);h=Jo(t,0,[g],void 0,i.formatMajor)[0]}else{const C=Jo(t,e,l.objects,E.objects,i.formatMajor);if(C.length!==1)throw new Error("CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = "+C.length);h=C[0]}if(a.topDict=h,h._privateDict&&(r.defaultWidthX=h._privateDict.defaultWidthX,r.nominalWidthX=h._privateDict.nominalWidthX),i.formatMajor<2&&h.ros[0]!==void 0&&h.ros[1]!==void 0&&(r.isCIDFont=!0),i.formatMajor>1){let C=h.fdArray,g=h.fdSelect;if(!C)throw new Error("This is a CFF2 font, but FDArray information is missing");const H=Vr(t,e+C,null,i.formatMajor),F=Fh(t,e,H.objects);h._fdArray=F,g&&(h._fdSelect=rA(t,e+g,r.numGlyphs,F.length,i.formatMajor))}else if(r.isCIDFont){let C=h.fdArray,g=h.fdSelect;if(C===0||g===0)throw new Error("Font is marked as a CID font, but FDArray and/or FDSelect information is missing");C+=e;const H=Vr(t,C),F=Jo(t,e,H.objects,E.objects,i.formatMajor);h._fdArray=F,g+=e,h._fdSelect=rA(t,g,r.numGlyphs,F.length,i.formatMajor)}if(i.formatMajor<2){const C=e+h.private[1],g=Es(t,C,h.private[0],E.objects,i.formatMajor);if(r.defaultWidthX=g.defaultWidthX,r.nominalWidthX=g.nominalWidthX,g.subrs!==0){const H=C+g.subrs,F=Vr(t,H);r.subrs=F.objects,r.subrsBias=Ao(r.subrs)}else r.subrs=[],r.subrsBias=0}let u;if(n.lowMemory?(u=gh(t,e+h.charStrings,i.formatMajor),r.nGlyphs=u.offsets.length-(i.formatMajor>1?1:0)):(u=Vr(t,e+h.charStrings,null,i.formatMajor),r.nGlyphs=u.objects.length),i.formatMajor>1&&r.tables.maxp&&r.nGlyphs!==r.tables.maxp.numGlyphs&&console.error(`Glyph count in the CFF2 table (${r.nGlyphs}) must correspond to the glyph count in the maxp table (${r.tables.maxp.numGlyphs})`),i.formatMajor<2){let C=[],g=[];h.charset===0?C=ih:h.charset===1?C=oh:h.charset===2?C=sh:C=Mh(t,e+h.charset,r.nGlyphs,E.objects,r.isCIDFont),h.encoding===0?g=D0:h.encoding===1?g=Ah:g=Gh(t,e+h.encoding),r.cffEncoding=new ol(g,C),r.encoding=r.encoding||r.cffEncoding}if(r.glyphs=new Xr.GlyphSet(r),n.lowMemory)r._push=function(C){const g=Ch(C,u.offsets,t,e+h.charStrings,void 0,i.formatMajor);r.glyphs.push(C,Xr.cffGlyphLoader(r,C,O0,g,i.formatMajor))};else for(let C=0;C<r.nGlyphs;C+=1){const g=u.objects[C];r.glyphs.push(C,Xr.cffGlyphLoader(r,C,O0,g,i.formatMajor))}if(h.vstore){const C=new pe.Parser(t,e+h.vstore);h._vstore=C.parseVariationStore()}}function Ll(t,e){let r,n=Yi.indexOf(t);return n>=0&&(r=n),n=e.indexOf(t),n>=0?r=n+Yi.length:(r=Yi.length+e.length,e.push(t)),r}function vh(){return new Ae.Record("Header",[{name:"major",type:"Card8",value:1},{name:"minor",type:"Card8",value:0},{name:"hdrSize",type:"Card8",value:4},{name:"major",type:"Card8",value:1}])}function Uh(t){const e=new Ae.Record("Name INDEX",[{name:"names",type:"INDEX",value:[]}]);e.names=[];for(let r=0;r<t.length;r+=1)e.names.push({name:"name_"+r,type:"NAME",value:t[r]});return e}function Tl(t,e,r){const n={};for(let a=0;a<t.length;a+=1){const i=t[a];let s=e[i.name];s!==void 0&&!xl(s,i.value)&&(i.type==="SID"&&(s=Ll(s,r)),n[i.op]={name:i.name,type:i.type,value:s})}return n}function nA(t,e,r){const n=new Ae.Record("Top DICT",[{name:"dict",type:"DICT",value:{}}]);return n.dict=Tl(El,t,e),n}function aA(t){const e=new Ae.Record("Top DICT INDEX",[{name:"topDicts",type:"INDEX",value:[]}]);return e.topDicts=[{name:"topDict_0",type:"TABLE",value:t}],e}function wh(t){const e=new Ae.Record("String INDEX",[{name:"strings",type:"INDEX",value:[]}]);e.strings=[];for(let r=0;r<t.length;r+=1)e.strings.push({name:"string_"+r,type:"STRING",value:t[r]});return e}function Yh(){return new Ae.Record("Global Subr INDEX",[{name:"subrs",type:"INDEX",value:[]}])}function Wh(t,e){const r=new Ae.Record("Charsets",[{name:"format",type:"Card8",value:0}]);for(let n=0;n<t.length;n+=1){const a=t[n],i=Ll(a,e);r.fields.push({name:"glyph_"+n,type:"SID",value:i})}return r}function kh(t,e){const r=[],n=t.path;r.push({name:"width",type:"NUMBER",value:t.advanceWidth});let a=0,i=0;for(let s=0;s<n.commands.length;s+=1){let l,E,T=n.commands[s];if(T.type==="Q"){const h=.3333333333333333,u=2/3;T={type:"C",x:T.x,y:T.y,x1:Math.round(h*a+u*T.x1),y1:Math.round(h*i+u*T.y1),x2:Math.round(h*T.x+u*T.x1),y2:Math.round(h*T.y+u*T.y1)}}if(T.type==="M")l=Math.round(T.x-a),E=Math.round(T.y-i),r.push({name:"dx",type:"NUMBER",value:l}),r.push({name:"dy",type:"NUMBER",value:E}),r.push({name:"rmoveto",type:"OP",value:21}),a=Math.round(T.x),i=Math.round(T.y);else if(T.type==="L")l=Math.round(T.x-a),E=Math.round(T.y-i),r.push({name:"dx",type:"NUMBER",value:l}),r.push({name:"dy",type:"NUMBER",value:E}),r.push({name:"rlineto",type:"OP",value:5}),a=Math.round(T.x),i=Math.round(T.y);else if(T.type==="C"){const h=Math.round(T.x1-a),u=Math.round(T.y1-i),C=Math.round(T.x2-T.x1),g=Math.round(T.y2-T.y1);l=Math.round(T.x-T.x2),E=Math.round(T.y-T.y2),r.push({name:"dx1",type:"NUMBER",value:h}),r.push({name:"dy1",type:"NUMBER",value:u}),r.push({name:"dx2",type:"NUMBER",value:C}),r.push({name:"dy2",type:"NUMBER",value:g}),r.push({name:"dx",type:"NUMBER",value:l}),r.push({name:"dy",type:"NUMBER",value:E}),r.push({name:"rrcurveto",type:"OP",value:8}),a=Math.round(T.x),i=Math.round(T.y)}}return r.push({name:"endchar",type:"OP",value:14}),r}function Kh(t,e){const r=new Ae.Record("CharStrings INDEX",[{name:"charStrings",type:"INDEX",value:[]}]);for(let n=0;n<t.length;n+=1){const a=t.get(n),i=kh(a);r.charStrings.push({name:a.name,type:"CHARSTRING",value:i})}return r}function _h(t,e,r){const n=new Ae.Record("Private DICT",[{name:"dict",type:"DICT",value:{}}]);return n.dict=Tl(cl,t,e),n}function Vh(t,e){const r=new Ae.Table("CFF ",[{name:"header",type:"RECORD"},{name:"nameIndex",type:"RECORD"},{name:"topDictIndex",type:"RECORD"},{name:"stringIndex",type:"RECORD"},{name:"globalSubrIndex",type:"RECORD"},{name:"charsets",type:"RECORD"},{name:"charStringsIndex",type:"RECORD"},{name:"privateDict",type:"RECORD"}]),n=1/e.unitsPerEm,a={version:e.version,fullName:e.fullName,familyName:e.familyName,weight:e.weightName,fontBBox:e.fontBBox||[0,0,0,0],fontMatrix:[n,0,0,n,0,0],charset:999,encoding:0,charStrings:999,private:[0,999]},i=e&&e.topDict||{};i.paintType&&(a.paintType=i.paintType,a.strokeWidth=i.strokeWidth||0);const s={},l=[];let E;for(let C=1;C<t.length;C+=1)E=t.get(C),l.push(E.name);const T=[];r.header=vh(),r.nameIndex=Uh([e.postScriptName]);let h=nA(a,T);r.topDictIndex=aA(h),r.globalSubrIndex=Yh(),r.charsets=Wh(l,T),r.charStringsIndex=Kh(t),r.privateDict=_h(s,T),r.stringIndex=wh(T);const u=r.header.sizeOf()+r.nameIndex.sizeOf()+r.topDictIndex.sizeOf()+r.stringIndex.sizeOf()+r.globalSubrIndex.sizeOf();return a.charset=u,a.encoding=0,a.charStrings=a.charset+r.charsets.sizeOf(),a.private[1]=a.charStrings+r.charStringsIndex.sizeOf(),h=nA(a,T),r.topDictIndex=aA(h),r}var B0={parse:Ph,make:Vh};function zh(t,e){const r={},n=new pe.Parser(t,e);return r.version=n.parseVersion(),r.fontRevision=Math.round(n.parseFixed()*1e3)/1e3,r.checkSumAdjustment=n.parseULong(),r.magicNumber=n.parseULong(),ye.argument(r.magicNumber===1594834165,"Font header has wrong magic number."),r.flags=n.parseUShort(),r.unitsPerEm=n.parseUShort(),r.created=n.parseLongDateTime(),r.modified=n.parseLongDateTime(),r.xMin=n.parseShort(),r.yMin=n.parseShort(),r.xMax=n.parseShort(),r.yMax=n.parseShort(),r.macStyle=n.parseUShort(),r.lowestRecPPEM=n.parseUShort(),r.fontDirectionHint=n.parseShort(),r.indexToLocFormat=n.parseShort(),r.glyphDataFormat=n.parseShort(),r}function Jh(t){const e=Math.round(new Date().getTime()/1e3)+2082844800;let r=e,n=t.macStyle||0;return t.createdTimestamp&&(r=t.createdTimestamp+2082844800),new Ae.Table("head",[{name:"version",type:"FIXED",value:65536},{name:"fontRevision",type:"FIXED",value:65536},{name:"checkSumAdjustment",type:"ULONG",value:0},{name:"magicNumber",type:"ULONG",value:1594834165},{name:"flags",type:"USHORT",value:0},{name:"unitsPerEm",type:"USHORT",value:1e3},{name:"created",type:"LONGDATETIME",value:r},{name:"modified",type:"LONGDATETIME",value:e},{name:"xMin",type:"SHORT",value:0},{name:"yMin",type:"SHORT",value:0},{name:"xMax",type:"SHORT",value:0},{name:"yMax",type:"SHORT",value:0},{name:"macStyle",type:"USHORT",value:n},{name:"lowestRecPPEM",type:"USHORT",value:0},{name:"fontDirectionHint",type:"SHORT",value:2},{name:"indexToLocFormat",type:"SHORT",value:0},{name:"glyphDataFormat",type:"SHORT",value:0}],t)}var dl={parse:zh,make:Jh};function Zh(t,e){const r={},n=new pe.Parser(t,e);return r.version=n.parseVersion(),r.ascender=n.parseShort(),r.descender=n.parseShort(),r.lineGap=n.parseShort(),r.advanceWidthMax=n.parseUShort(),r.minLeftSideBearing=n.parseShort(),r.minRightSideBearing=n.parseShort(),r.xMaxExtent=n.parseShort(),r.caretSlopeRise=n.parseShort(),r.caretSlopeRun=n.parseShort(),r.caretOffset=n.parseShort(),n.relativeOffset+=8,r.metricDataFormat=n.parseShort(),r.numberOfHMetrics=n.parseUShort(),r}function jh(t){return new Ae.Table("hhea",[{name:"version",type:"FIXED",value:65536},{name:"ascender",type:"FWORD",value:0},{name:"descender",type:"FWORD",value:0},{name:"lineGap",type:"FWORD",value:0},{name:"advanceWidthMax",type:"UFWORD",value:0},{name:"minLeftSideBearing",type:"FWORD",value:0},{name:"minRightSideBearing",type:"FWORD",value:0},{name:"xMaxExtent",type:"FWORD",value:0},{name:"caretSlopeRise",type:"SHORT",value:1},{name:"caretSlopeRun",type:"SHORT",value:0},{name:"caretOffset",type:"SHORT",value:0},{name:"reserved1",type:"SHORT",value:0},{name:"reserved2",type:"SHORT",value:0},{name:"reserved3",type:"SHORT",value:0},{name:"reserved4",type:"SHORT",value:0},{name:"metricDataFormat",type:"SHORT",value:0},{name:"numberOfHMetrics",type:"USHORT",value:0}],t)}var Il={parse:Zh,make:jh};function Xh(t,e,r,n,a){let i,s;const l=new pe.Parser(t,e);for(let E=0;E<n;E+=1){E<r&&(i=l.parseUShort(),s=l.parseShort());const T=a.get(E);T.advanceWidth=i,T.leftSideBearing=s}}function qh(t,e,r,n,a){t._hmtxTableData={};let i,s;const l=new pe.Parser(e,r);for(let E=0;E<a;E+=1)E<n&&(i=l.parseUShort(),s=l.parseShort()),t._hmtxTableData[E]={advanceWidth:i,leftSideBearing:s}}function Qh(t,e,r,n,a,i,s){s.lowMemory?qh(t,e,r,n,a):Xh(e,r,n,a,i)}function $h(t){const e=new Ae.Table("hmtx",[]);for(let r=0;r<t.length;r+=1){const n=t.get(r),a=n.advanceWidth||0,i=n.leftSideBearing||0;e.fields.push({name:"advanceWidth_"+r,type:"USHORT",value:a}),e.fields.push({name:"leftSideBearing_"+r,type:"SHORT",value:i})}return e}var ul={parse:Qh,make:$h};function eL(t){const e=new Ae.Table("ltag",[{name:"version",type:"ULONG",value:1},{name:"flags",type:"ULONG",value:0},{name:"numTags",type:"ULONG",value:t.length}]);let r="";const n=12+t.length*4;for(let a=0;a<t.length;++a){let i=r.indexOf(t[a]);i<0&&(i=r.length,r+=t[a]),e.fields.push({name:"offset "+a,type:"USHORT",value:n+i}),e.fields.push({name:"length "+a,type:"USHORT",value:t[a].length})}return e.fields.push({name:"stringPool",type:"CHARARRAY",value:r}),e}function tL(t,e){const r=new pe.Parser(t,e),n=r.parseULong();ye.argument(n===1,"Unsupported ltag table version."),r.skip("uLong",1);const a=r.parseULong(),i=[];for(let s=0;s<a;s++){let l="";const E=e+r.parseUShort(),T=r.parseUShort();for(let h=E;h<E+T;++h)l+=String.fromCharCode(t.getInt8(h));i.push(l)}return i}var pl={make:eL,parse:tL};function rL(t,e){const r={},n=new pe.Parser(t,e);return r.version=n.parseVersion(),r.numGlyphs=n.parseUShort(),r.version===1&&(r.maxPoints=n.parseUShort(),r.maxContours=n.parseUShort(),r.maxCompositePoints=n.parseUShort(),r.maxCompositeContours=n.parseUShort(),r.maxZones=n.parseUShort(),r.maxTwilightPoints=n.parseUShort(),r.maxStorage=n.parseUShort(),r.maxFunctionDefs=n.parseUShort(),r.maxInstructionDefs=n.parseUShort(),r.maxStackElements=n.parseUShort(),r.maxSizeOfInstructions=n.parseUShort(),r.maxComponentElements=n.parseUShort(),r.maxComponentDepth=n.parseUShort()),r}function nL(t){return new Ae.Table("maxp",[{name:"version",type:"FIXED",value:20480},{name:"numGlyphs",type:"USHORT",value:t}])}var Sl={parse:rL,make:nL},H0=[{begin:0,end:127},{begin:128,end:255},{begin:256,end:383},{begin:384,end:591},{begin:592,end:687},{begin:688,end:767},{begin:768,end:879},{begin:880,end:1023},{begin:11392,end:11519},{begin:1024,end:1279},{begin:1328,end:1423},{begin:1424,end:1535},{begin:42240,end:42559},{begin:1536,end:1791},{begin:1984,end:2047},{begin:2304,end:2431},{begin:2432,end:2559},{begin:2560,end:2687},{begin:2688,end:2815},{begin:2816,end:2943},{begin:2944,end:3071},{begin:3072,end:3199},{begin:3200,end:3327},{begin:3328,end:3455},{begin:3584,end:3711},{begin:3712,end:3839},{begin:4256,end:4351},{begin:6912,end:7039},{begin:4352,end:4607},{begin:7680,end:7935},{begin:7936,end:8191},{begin:8192,end:8303},{begin:8304,end:8351},{begin:8352,end:8399},{begin:8400,end:8447},{begin:8448,end:8527},{begin:8528,end:8591},{begin:8592,end:8703},{begin:8704,end:8959},{begin:8960,end:9215},{begin:9216,end:9279},{begin:9280,end:9311},{begin:9312,end:9471},{begin:9472,end:9599},{begin:9600,end:9631},{begin:9632,end:9727},{begin:9728,end:9983},{begin:9984,end:10175},{begin:12288,end:12351},{begin:12352,end:12447},{begin:12448,end:12543},{begin:12544,end:12591},{begin:12592,end:12687},{begin:43072,end:43135},{begin:12800,end:13055},{begin:13056,end:13311},{begin:44032,end:55215},{begin:55296,end:57343},{begin:67840,end:67871},{begin:19968,end:40959},{begin:57344,end:63743},{begin:12736,end:12783},{begin:64256,end:64335},{begin:64336,end:65023},{begin:65056,end:65071},{begin:65040,end:65055},{begin:65104,end:65135},{begin:65136,end:65279},{begin:65280,end:65519},{begin:65520,end:65535},{begin:3840,end:4095},{begin:1792,end:1871},{begin:1920,end:1983},{begin:3456,end:3583},{begin:4096,end:4255},{begin:4608,end:4991},{begin:5024,end:5119},{begin:5120,end:5759},{begin:5760,end:5791},{begin:5792,end:5887},{begin:6016,end:6143},{begin:6144,end:6319},{begin:10240,end:10495},{begin:40960,end:42127},{begin:5888,end:5919},{begin:66304,end:66351},{begin:66352,end:66383},{begin:66560,end:66639},{begin:118784,end:119039},{begin:119808,end:120831},{begin:1044480,end:1048573},{begin:65024,end:65039},{begin:917504,end:917631},{begin:6400,end:6479},{begin:6480,end:6527},{begin:6528,end:6623},{begin:6656,end:6687},{begin:11264,end:11359},{begin:11568,end:11647},{begin:19904,end:19967},{begin:43008,end:43055},{begin:65536,end:65663},{begin:65856,end:65935},{begin:66432,end:66463},{begin:66464,end:66527},{begin:66640,end:66687},{begin:66688,end:66735},{begin:67584,end:67647},{begin:68096,end:68191},{begin:119552,end:119647},{begin:73728,end:74751},{begin:119648,end:119679},{begin:7040,end:7103},{begin:7168,end:7247},{begin:7248,end:7295},{begin:43136,end:43231},{begin:43264,end:43311},{begin:43312,end:43359},{begin:43520,end:43615},{begin:65936,end:65999},{begin:66e3,end:66047},{begin:66208,end:66271},{begin:127024,end:127135}];function aL(t){for(let e=0;e<H0.length;e+=1){const r=H0[e];if(t>=r.begin&&t<r.end)return e}return-1}function iL(t,e){const r={},n=new pe.Parser(t,e);r.version=n.parseUShort(),r.xAvgCharWidth=n.parseShort(),r.usWeightClass=n.parseUShort(),r.usWidthClass=n.parseUShort(),r.fsType=n.parseUShort(),r.ySubscriptXSize=n.parseShort(),r.ySubscriptYSize=n.parseShort(),r.ySubscriptXOffset=n.parseShort(),r.ySubscriptYOffset=n.parseShort(),r.ySuperscriptXSize=n.parseShort(),r.ySuperscriptYSize=n.parseShort(),r.ySuperscriptXOffset=n.parseShort(),r.ySuperscriptYOffset=n.parseShort(),r.yStrikeoutSize=n.parseShort(),r.yStrikeoutPosition=n.parseShort(),r.sFamilyClass=n.parseShort(),r.panose=[];for(let a=0;a<10;a++)r.panose[a]=n.parseByte();return r.ulUnicodeRange1=n.parseULong(),r.ulUnicodeRange2=n.parseULong(),r.ulUnicodeRange3=n.parseULong(),r.ulUnicodeRange4=n.parseULong(),r.achVendID=String.fromCharCode(n.parseByte(),n.parseByte(),n.parseByte(),n.parseByte()),r.fsSelection=n.parseUShort(),r.usFirstCharIndex=n.parseUShort(),r.usLastCharIndex=n.parseUShort(),r.sTypoAscender=n.parseShort(),r.sTypoDescender=n.parseShort(),r.sTypoLineGap=n.parseShort(),r.usWinAscent=n.parseUShort(),r.usWinDescent=n.parseUShort(),r.version>=1&&(r.ulCodePageRange1=n.parseULong(),r.ulCodePageRange2=n.parseULong()),r.version>=2&&(r.sxHeight=n.parseShort(),r.sCapHeight=n.parseShort(),r.usDefaultChar=n.parseUShort(),r.usBreakChar=n.parseUShort(),r.usMaxContent=n.parseUShort()),r}function oL(t){return new Ae.Table("OS/2",[{name:"version",type:"USHORT",value:3},{name:"xAvgCharWidth",type:"SHORT",value:0},{name:"usWeightClass",type:"USHORT",value:0},{name:"usWidthClass",type:"USHORT",value:0},{name:"fsType",type:"USHORT",value:0},{name:"ySubscriptXSize",type:"SHORT",value:650},{name:"ySubscriptYSize",type:"SHORT",value:699},{name:"ySubscriptXOffset",type:"SHORT",value:0},{name:"ySubscriptYOffset",type:"SHORT",value:140},{name:"ySuperscriptXSize",type:"SHORT",value:650},{name:"ySuperscriptYSize",type:"SHORT",value:699},{name:"ySuperscriptXOffset",type:"SHORT",value:0},{name:"ySuperscriptYOffset",type:"SHORT",value:479},{name:"yStrikeoutSize",type:"SHORT",value:49},{name:"yStrikeoutPosition",type:"SHORT",value:258},{name:"sFamilyClass",type:"SHORT",value:0},{name:"bFamilyType",type:"BYTE",value:0},{name:"bSerifStyle",type:"BYTE",value:0},{name:"bWeight",type:"BYTE",value:0},{name:"bProportion",type:"BYTE",value:0},{name:"bContrast",type:"BYTE",value:0},{name:"bStrokeVariation",type:"BYTE",value:0},{name:"bArmStyle",type:"BYTE",value:0},{name:"bLetterform",type:"BYTE",value:0},{name:"bMidline",type:"BYTE",value:0},{name:"bXHeight",type:"BYTE",value:0},{name:"ulUnicodeRange1",type:"ULONG",value:0},{name:"ulUnicodeRange2",type:"ULONG",value:0},{name:"ulUnicodeRange3",type:"ULONG",value:0},{name:"ulUnicodeRange4",type:"ULONG",value:0},{name:"achVendID",type:"CHARARRAY",value:"XXXX"},{name:"fsSelection",type:"USHORT",value:0},{name:"usFirstCharIndex",type:"USHORT",value:0},{name:"usLastCharIndex",type:"USHORT",value:0},{name:"sTypoAscender",type:"SHORT",value:0},{name:"sTypoDescender",type:"SHORT",value:0},{name:"sTypoLineGap",type:"SHORT",value:0},{name:"usWinAscent",type:"USHORT",value:0},{name:"usWinDescent",type:"USHORT",value:0},{name:"ulCodePageRange1",type:"ULONG",value:0},{name:"ulCodePageRange2",type:"ULONG",value:0},{name:"sxHeight",type:"SHORT",value:0},{name:"sCapHeight",type:"SHORT",value:0},{name:"usDefaultChar",type:"USHORT",value:0},{name:"usBreakChar",type:"USHORT",value:0},{name:"usMaxContext",type:"USHORT",value:0}],t)}var F0={parse:iL,make:oL,unicodeRanges:H0,getUnicodeRange:aL};function sL(t,e){const r={},n=new pe.Parser(t,e);switch(r.version=n.parseVersion(),r.italicAngle=n.parseFixed(),r.underlinePosition=n.parseShort(),r.underlineThickness=n.parseShort(),r.isFixedPitch=n.parseULong(),r.minMemType42=n.parseULong(),r.maxMemType42=n.parseULong(),r.minMemType1=n.parseULong(),r.maxMemType1=n.parseULong(),r.version){case 1:r.names=wn.slice();break;case 2:r.numberOfGlyphs=n.parseUShort(),r.glyphNameIndex=new Array(r.numberOfGlyphs);for(let a=0;a<r.numberOfGlyphs;a++)r.glyphNameIndex[a]=n.parseUShort();r.names=[];for(let a=0;a<r.numberOfGlyphs;a++)if(r.glyphNameIndex[a]>=wn.length){const i=n.parseChar();r.names.push(n.parseString(i))}break;case 2.5:r.numberOfGlyphs=n.parseUShort(),r.offset=new Array(r.numberOfGlyphs);for(let a=0;a<r.numberOfGlyphs;a++)r.offset[a]=n.parseChar();break}return r}function AL(t){const{italicAngle:e=Math.round((t.italicAngle||0)*65536),underlinePosition:r=0,underlineThickness:n=0,isFixedPitch:a=0,minMemType42:i=0,maxMemType42:s=0,minMemType1:l=0,maxMemType1:E=0}=t.tables.post||{};return new Ae.Table("post",[{name:"version",type:"FIXED",value:196608},{name:"italicAngle",type:"FIXED",value:e},{name:"underlinePosition",type:"FWORD",value:r},{name:"underlineThickness",type:"FWORD",value:n},{name:"isFixedPitch",type:"ULONG",value:a},{name:"minMemType42",type:"ULONG",value:i},{name:"maxMemType42",type:"ULONG",value:s},{name:"minMemType1",type:"ULONG",value:l},{name:"maxMemType1",type:"ULONG",value:E}])}var gl={parse:sL,make:AL},Gr=new Array(10);Gr[1]=function(){const e=this.offset+this.relativeOffset,r=this.parseUShort();if(r===1)return{posFormat:1,coverage:this.parsePointer(q.coverage),value:this.parseValueRecord()};if(r===2)return{posFormat:2,coverage:this.parsePointer(q.coverage),values:this.parseValueRecordList()};ye.assert(!1,"0x"+e.toString(16)+": GPOS lookup type 1 format must be 1 or 2.")};Gr[2]=function(){const e=this.offset+this.relativeOffset,r=this.parseUShort();ye.assert(r===1||r===2,"0x"+e.toString(16)+": GPOS lookup type 2 format must be 1 or 2.");const n=this.parsePointer(q.coverage),a=this.parseUShort(),i=this.parseUShort();if(r===1)return{posFormat:r,coverage:n,valueFormat1:a,valueFormat2:i,pairSets:this.parseList(q.pointer(q.list(function(){return{secondGlyph:this.parseUShort(),value1:this.parseValueRecord(a),value2:this.parseValueRecord(i)}})))};if(r===2){const s=this.parsePointer(q.classDef),l=this.parsePointer(q.classDef),E=this.parseUShort(),T=this.parseUShort();return{posFormat:r,coverage:n,valueFormat1:a,valueFormat2:i,classDef1:s,classDef2:l,class1Count:E,class2Count:T,classRecords:this.parseList(E,q.list(T,function(){return{value1:this.parseValueRecord(a),value2:this.parseValueRecord(i)}}))}}};Gr[3]=function(){return{error:"GPOS Lookup 3 not supported"}};Gr[4]=function(){return{error:"GPOS Lookup 4 not supported"}};Gr[5]=function(){return{error:"GPOS Lookup 5 not supported"}};Gr[6]=function(){return{error:"GPOS Lookup 6 not supported"}};Gr[7]=function(){return{error:"GPOS Lookup 7 not supported"}};Gr[8]=function(){return{error:"GPOS Lookup 8 not supported"}};Gr[9]=function(){return{error:"GPOS Lookup 9 not supported"}};function lL(t,e){e=e||0;const r=new q(t,e),n=r.parseVersion(1);return ye.argument(n===1||n===1.1,"Unsupported GPOS table version "+n),n===1?{version:n,scripts:r.parseScriptList(),features:r.parseFeatureList(),lookups:r.parseLookupList(Gr)}:{version:n,scripts:r.parseScriptList(),features:r.parseFeatureList(),lookups:r.parseLookupList(Gr),variations:r.parseFeatureVariationsList()}}var Cl=new Array(10);function Fi(t,e,r){if(!e)return;const n=["xPlacement","yPlacement","xAdvance","yAdvance","xPlacementDevice","yPlacementDevice","xAdvanceDevice","yAdvanceDevice"];for(let a=0;a<n.length;a++)r&1<<a&&t.fields.push({name:n[a],type:"SHORT",value:e[n[a]]||0})}Cl[2]=function(e){if(e.posFormat===1)return new Ae.Table("pairPosFormat1",[{name:"posFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new Ae.Coverage(e.coverage)},{name:"valueFormat1",type:"USHORT",value:e.valueFormat1},{name:"valueFormat2",type:"USHORT",value:e.valueFormat2}].concat(Ae.tableList("pairSets",e.pairSets,function(n){const a=new Ae.Table("pairSetTable",[]);a.fields.push({name:"pairValueCount",type:"USHORT",value:n.length});for(let i=0;i<n.length;i++){const s=n[i];a.fields.push({name:"secondGlyph",type:"USHORT",value:s.secondGlyph}),Fi(a,s.value1,e.valueFormat1),Fi(a,s.value2,e.valueFormat2)}return a})));if(e.posFormat===2){const r=new Ae.Table("pairPosFormat2",[{name:"posFormat",type:"USHORT",value:2},{name:"coverage",type:"TABLE",value:new Ae.Coverage(e.coverage)},{name:"valueFormat1",type:"USHORT",value:e.valueFormat1},{name:"valueFormat2",type:"USHORT",value:e.valueFormat2},{name:"classDef1",type:"TABLE",value:new Ae.ClassDef(e.classDef1)},{name:"classDef2",type:"TABLE",value:new Ae.ClassDef(e.classDef2)},{name:"class1Count",type:"USHORT",value:e.classRecords.length},{name:"class2Count",type:"USHORT",value:e.classRecords[0].length}]);for(let n=0;n<e.classRecords.length;n++){const a=e.classRecords[n];for(let i=0;i<a.length;i++){const s=a[i];Fi(r,s.value1,e.valueFormat1),Fi(r,s.value2,e.valueFormat2)}}return r}else throw new Error("Lookup type 2 format must be 1 or 2.")};function xL(t){const e=[],r=[];for(let s=0;s<t.lookups.length;s++)t.lookups[s].lookupType===2&&(r.push(s),e.push(JSON.parse(JSON.stringify(t.lookups[s]))));if(e.length===0)return;const n=[],a=[];for(let s=0;s<t.features.length;s++)t.features[s].tag==="kern"&&(a.push(s),n.push(JSON.parse(JSON.stringify(t.features[s]))));for(let s=0;s<n.length;s++)n[s].feature.lookupListIndexes=n[s].feature.lookupListIndexes.filter(l=>r.includes(l)).map(l=>r.indexOf(l));const i=[];for(let s=0;s<t.scripts.length;s++){const l=JSON.parse(JSON.stringify(t.scripts[s]));if(l.script.defaultLangSys.featureIndexes=l.script.defaultLangSys.featureIndexes.filter(E=>a.includes(E)).map(E=>a.indexOf(E)),l.script.defaultLangSys.featureIndexes.length!==0){for(let E=0;E<l.script.langSysRecords.length;E++)l.script.langSysRecords[E].featureIndexes=l.script.langSysRecords[E].langSys.featureIndexes.filter(T=>a.includes(T)).map(T=>a.indexOf(T));i.push(l)}}return{version:t.version,lookups:e,features:n,scripts:i}}function EL(t,e){if(t)t=xL(t);else if(e&&Object.keys(e).length>0)t=cL(e);else return;if(t)return new Ae.Table("GPOS",[{name:"version",type:"ULONG",value:65536},{name:"scripts",type:"TABLE",value:new Ae.ScriptList(t.scripts)},{name:"features",type:"TABLE",value:new Ae.FeatureList(t.features)},{name:"lookups",type:"TABLE",value:new Ae.LookupList(t.lookups,Cl)}])}function cL(t){const e=Object.entries(t);e.sort(function(E,T){const h=parseInt(E[0].match(/\d+/)[0]),u=parseInt(E[0].match(/\d+$/)[0]),C=parseInt(T[0].match(/\d+/)[0]),g=parseInt(T[0].match(/\d+$/)[0]);return h<C?-1:h>C?1:u<g?-1:1});const r=e.length,n={format:1,glyphs:[]},a=[];for(let E=0;E<r;E++){let T=parseInt(e[E][0].match(/\d+/)[0]),h=parseInt(e[E][0].match(/\d+$/)[0]);T!==n.glyphs[n.glyphs.length-1]&&(n.glyphs.push(T),a.push([])),a[n.glyphs.length-1].push({secondGlyph:h,value1:{xAdvance:e[E][1]},value2:void 0})}return{version:1,scripts:[{tag:"DFLT",script:{defaultLangSys:{featureIndexes:[0]},langSysRecords:[]}}],features:[{tag:"kern",feature:{lookupListIndexes:[0]}}],lookups:[{lookupType:2,subtables:[{posFormat:1,coverage:n,valueFormat1:4,valueFormat2:0,pairSets:a}]}]}}var Rl={parse:lL,make:EL},br=new Array(9);br[1]=function(){const e=this.offset+this.relativeOffset,r=this.parseUShort();if(r===1)return{substFormat:1,coverage:this.parsePointer(q.coverage),deltaGlyphId:this.parseShort()};if(r===2)return{substFormat:2,coverage:this.parsePointer(q.coverage),substitute:this.parseOffset16List()};ye.assert(!1,"0x"+e.toString(16)+": lookup type 1 format must be 1 or 2.")};br[2]=function(){const e=this.parseUShort();return ye.argument(e===1,"GSUB Multiple Substitution Subtable identifier-format must be 1"),{substFormat:e,coverage:this.parsePointer(q.coverage),sequences:this.parseListOfLists()}};br[3]=function(){const e=this.parseUShort();return ye.argument(e===1,"GSUB Alternate Substitution Subtable identifier-format must be 1"),{substFormat:e,coverage:this.parsePointer(q.coverage),alternateSets:this.parseListOfLists()}};br[4]=function(){const e=this.parseUShort();return ye.argument(e===1,"GSUB ligature table identifier-format must be 1"),{substFormat:e,coverage:this.parsePointer(q.coverage),ligatureSets:this.parseListOfLists(function(){return{ligGlyph:this.parseUShort(),components:this.parseUShortList(this.parseUShort()-1)}})}};var ca={sequenceIndex:q.uShort,lookupListIndex:q.uShort};br[5]=function(){const e=this.offset+this.relativeOffset,r=this.parseUShort();if(r===1)return{substFormat:r,coverage:this.parsePointer(q.coverage),ruleSets:this.parseListOfLists(function(){const n=this.parseUShort(),a=this.parseUShort();return{input:this.parseUShortList(n-1),lookupRecords:this.parseRecordList(a,ca)}})};if(r===2)return{substFormat:r,coverage:this.parsePointer(q.coverage),classDef:this.parsePointer(q.classDef),classSets:this.parseListOfLists(function(){const n=this.parseUShort(),a=this.parseUShort();return{classes:this.parseUShortList(n-1),lookupRecords:this.parseRecordList(a,ca)}})};if(r===3){const n=this.parseUShort(),a=this.parseUShort();return{substFormat:r,coverages:this.parseList(n,q.pointer(q.coverage)),lookupRecords:this.parseRecordList(a,ca)}}ye.assert(!1,"0x"+e.toString(16)+": lookup type 5 format must be 1, 2 or 3.")};br[6]=function(){const e=this.offset+this.relativeOffset,r=this.parseUShort();if(r===1)return{substFormat:1,coverage:this.parsePointer(q.coverage),chainRuleSets:this.parseListOfLists(function(){return{backtrack:this.parseUShortList(),input:this.parseUShortList(this.parseShort()-1),lookahead:this.parseUShortList(),lookupRecords:this.parseRecordList(ca)}})};if(r===2)return{substFormat:2,coverage:this.parsePointer(q.coverage),backtrackClassDef:this.parsePointer(q.classDef),inputClassDef:this.parsePointer(q.classDef),lookaheadClassDef:this.parsePointer(q.classDef),chainClassSet:this.parseListOfLists(function(){return{backtrack:this.parseUShortList(),input:this.parseUShortList(this.parseShort()-1),lookahead:this.parseUShortList(),lookupRecords:this.parseRecordList(ca)}})};if(r===3)return{substFormat:3,backtrackCoverage:this.parseList(q.pointer(q.coverage)),inputCoverage:this.parseList(q.pointer(q.coverage)),lookaheadCoverage:this.parseList(q.pointer(q.coverage)),lookupRecords:this.parseRecordList(ca)};ye.assert(!1,"0x"+e.toString(16)+": lookup type 6 format must be 1, 2 or 3.")};br[7]=function(){const e=this.parseUShort();ye.argument(e===1,"GSUB Extension Substitution subtable identifier-format must be 1");const r=this.parseUShort(),n=new q(this.data,this.offset+this.parseULong());return{substFormat:1,lookupType:r,extension:br[r].call(n)}};br[8]=function(){const e=this.parseUShort();return ye.argument(e===1,"GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1"),{substFormat:e,coverage:this.parsePointer(q.coverage),backtrackCoverage:this.parseList(q.pointer(q.coverage)),lookaheadCoverage:this.parseList(q.pointer(q.coverage)),substitutes:this.parseUShortList()}};function hL(t,e){e=e||0;const r=new q(t,e),n=r.parseVersion(1);return ye.argument(n===1||n===1.1,"Unsupported GSUB table version."),n===1?{version:n,scripts:r.parseScriptList(),features:r.parseFeatureList(),lookups:r.parseLookupList(br)}:{version:n,scripts:r.parseScriptList(),features:r.parseFeatureList(),lookups:r.parseLookupList(br),variations:r.parseFeatureVariationsList()}}var qn=new Array(9);qn[1]=function(e){if(e.substFormat===1)return new Ae.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new Ae.Coverage(e.coverage)},{name:"deltaGlyphID",type:"SHORT",value:e.deltaGlyphId}]);if(e.substFormat===2)return new Ae.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:2},{name:"coverage",type:"TABLE",value:new Ae.Coverage(e.coverage)}].concat(Ae.ushortList("substitute",e.substitute)));ye.fail("Lookup type 1 substFormat must be 1 or 2.")};qn[2]=function(e){return ye.assert(e.substFormat===1,"Lookup type 2 substFormat must be 1."),new Ae.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new Ae.Coverage(e.coverage)}].concat(Ae.tableList("seqSet",e.sequences,function(r){return new Ae.Table("sequenceSetTable",Ae.ushortList("sequence",r))})))};qn[3]=function(e){return ye.assert(e.substFormat===1,"Lookup type 3 substFormat must be 1."),new Ae.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new Ae.Coverage(e.coverage)}].concat(Ae.tableList("altSet",e.alternateSets,function(r){return new Ae.Table("alternateSetTable",Ae.ushortList("alternate",r))})))};qn[4]=function(e){return ye.assert(e.substFormat===1,"Lookup type 4 substFormat must be 1."),new Ae.Table("substitutionTable",[{name:"substFormat",type:"USHORT",value:1},{name:"coverage",type:"TABLE",value:new Ae.Coverage(e.coverage)}].concat(Ae.tableList("ligSet",e.ligatureSets,function(r){return new Ae.Table("ligatureSetTable",Ae.tableList("ligature",r,function(n){return new Ae.Table("ligatureTable",[{name:"ligGlyph",type:"USHORT",value:n.ligGlyph}].concat(Ae.ushortList("component",n.components,n.components.length+1)))}))})))};qn[5]=function(e){if(e.substFormat===1)return new Ae.Table("contextualSubstitutionTable",[{name:"substFormat",type:"USHORT",value:e.substFormat},{name:"coverage",type:"TABLE",value:new Ae.Coverage(e.coverage)}].concat(Ae.tableList("sequenceRuleSet",e.ruleSets,function(r){return r?new Ae.Table("sequenceRuleSetTable",Ae.tableList("sequenceRule",r,function(n){let a=Ae.ushortList("seqLookup",[],n.lookupRecords.length).concat(Ae.ushortList("inputSequence",n.input,n.input.length+1));[a[0],a[1]]=[a[1],a[0]];for(let i=0;i<n.lookupRecords.length;i++){const s=n.lookupRecords[i];a=a.concat({name:"sequenceIndex"+i,type:"USHORT",value:s.sequenceIndex}).concat({name:"lookupListIndex"+i,type:"USHORT",value:s.lookupListIndex})}return new Ae.Table("sequenceRuleTable",a)})):new Ae.Table("NULL",null)})));if(e.substFormat===2)return new Ae.Table("contextualSubstitutionTable",[{name:"substFormat",type:"USHORT",value:e.substFormat},{name:"coverage",type:"TABLE",value:new Ae.Coverage(e.coverage)},{name:"classDef",type:"TABLE",value:new Ae.ClassDef(e.classDef)}].concat(Ae.tableList("classSeqRuleSet",e.classSets,function(r){return r?new Ae.Table("classSeqRuleSetTable",Ae.tableList("classSeqRule",r,function(n){let a=Ae.ushortList("classes",n.classes,n.classes.length+1).concat(Ae.ushortList("seqLookupCount",[],n.lookupRecords.length));for(let i=0;i<n.lookupRecords.length;i++){const s=n.lookupRecords[i];a=a.concat({name:"sequenceIndex"+i,type:"USHORT",value:s.sequenceIndex}).concat({name:"lookupListIndex"+i,type:"USHORT",value:s.lookupListIndex})}return new Ae.Table("classSeqRuleTable",a)})):new Ae.Table("NULL",null)})));if(e.substFormat===3){let r=[{name:"substFormat",type:"USHORT",value:e.substFormat}];r.push({name:"inputGlyphCount",type:"USHORT",value:e.coverages.length}),r.push({name:"substitutionCount",type:"USHORT",value:e.lookupRecords.length});for(let a=0;a<e.coverages.length;a++){const i=e.coverages[a];r.push({name:"inputCoverage"+a,type:"TABLE",value:new Ae.Coverage(i)})}for(let a=0;a<e.lookupRecords.length;a++){const i=e.lookupRecords[a];r=r.concat({name:"sequenceIndex"+a,type:"USHORT",value:i.sequenceIndex}).concat({name:"lookupListIndex"+a,type:"USHORT",value:i.lookupListIndex})}return new Ae.Table("contextualSubstitutionTable",r)}ye.assert(!1,"lookup type 5 format must be 1, 2 or 3.")};qn[6]=function(e){if(e.substFormat===1)return new Ae.Table("chainContextTable",[{name:"substFormat",type:"USHORT",value:e.substFormat},{name:"coverage",type:"TABLE",value:new Ae.Coverage(e.coverage)}].concat(Ae.tableList("chainRuleSet",e.chainRuleSets,function(n){return new Ae.Table("chainRuleSetTable",Ae.tableList("chainRule",n,function(a){let i=Ae.ushortList("backtrackGlyph",a.backtrack,a.backtrack.length).concat(Ae.ushortList("inputGlyph",a.input,a.input.length+1)).concat(Ae.ushortList("lookaheadGlyph",a.lookahead,a.lookahead.length)).concat(Ae.ushortList("substitution",[],a.lookupRecords.length));for(let s=0;s<a.lookupRecords.length;s++){const l=a.lookupRecords[s];i=i.concat({name:"sequenceIndex"+s,type:"USHORT",value:l.sequenceIndex}).concat({name:"lookupListIndex"+s,type:"USHORT",value:l.lookupListIndex})}return new Ae.Table("chainRuleTable",i)}))})));if(e.substFormat===2)ye.assert(!1,"lookup type 6 format 2 is not yet supported.");else if(e.substFormat===3){let r=[{name:"substFormat",type:"USHORT",value:e.substFormat}];r.push({name:"backtrackGlyphCount",type:"USHORT",value:e.backtrackCoverage.length});for(let a=0;a<e.backtrackCoverage.length;a++){const i=e.backtrackCoverage[a];r.push({name:"backtrackCoverage"+a,type:"TABLE",value:new Ae.Coverage(i)})}r.push({name:"inputGlyphCount",type:"USHORT",value:e.inputCoverage.length});for(let a=0;a<e.inputCoverage.length;a++){const i=e.inputCoverage[a];r.push({name:"inputCoverage"+a,type:"TABLE",value:new Ae.Coverage(i)})}r.push({name:"lookaheadGlyphCount",type:"USHORT",value:e.lookaheadCoverage.length});for(let a=0;a<e.lookaheadCoverage.length;a++){const i=e.lookaheadCoverage[a];r.push({name:"lookaheadCoverage"+a,type:"TABLE",value:new Ae.Coverage(i)})}r.push({name:"substitutionCount",type:"USHORT",value:e.lookupRecords.length});for(let a=0;a<e.lookupRecords.length;a++){const i=e.lookupRecords[a];r=r.concat({name:"sequenceIndex"+a,type:"USHORT",value:i.sequenceIndex}).concat({name:"lookupListIndex"+a,type:"USHORT",value:i.lookupListIndex})}return new Ae.Table("chainContextTable",r)}ye.assert(!1,"lookup type 6 format must be 1, 2 or 3.")};function LL(t){return new Ae.Table("GSUB",[{name:"version",type:"ULONG",value:65536},{name:"scripts",type:"TABLE",value:new Ae.ScriptList(t.scripts)},{name:"features",type:"TABLE",value:new Ae.FeatureList(t.features)},{name:"lookups",type:"TABLE",value:new Ae.LookupList(t.lookups,qn)}])}var yl={parse:hL,make:LL};function TL(t,e){const r=new pe.Parser(t,e),n=r.parseULong();ye.argument(n===1,"Unsupported META table version."),r.parseULong(),r.parseULong();const a=r.parseULong(),i={};for(let s=0;s<a;s++){const l=r.parseTag(),E=r.parseULong(),T=r.parseULong();if(l==="appl"||l==="bild")continue;const h=ua.UTF8(t,e+E,T);i[l]=h}return i}function dL(t){const e=Object.keys(t).length;let r="";const n=16+e*12,a=new Ae.Table("meta",[{name:"version",type:"ULONG",value:1},{name:"flags",type:"ULONG",value:0},{name:"offset",type:"ULONG",value:n},{name:"numTags",type:"ULONG",value:e}]);for(let i in t){const s=r.length;r+=t[i],a.fields.push({name:"tag "+i,type:"TAG",value:i}),a.fields.push({name:"offset "+i,type:"ULONG",value:n+s}),a.fields.push({name:"length "+i,type:"ULONG",value:t[i].length})}return a.fields.push({name:"stringPool",type:"CHARARRAY",value:r}),a}var ml={parse:TL,make:dL};function IL(t,e){const r=new q(t,e),n=r.parseUShort();n!==0&&console.warn("Only COLRv0 is currently fully supported. A subset of color glyphs might be available in this font if provided in the v0 format.");const a=r.parseUShort(),i=r.parseOffset32(),s=r.parseOffset32(),l=r.parseUShort();r.relativeOffset=i;const E=r.parseRecordList(a,{glyphID:q.uShort,firstLayerIndex:q.uShort,numLayers:q.uShort});r.relativeOffset=s;const T=r.parseRecordList(l,{glyphID:q.uShort,paletteIndex:q.uShort});return{version:n,baseGlyphRecords:E,layerRecords:T}}function uL({version:t=0,baseGlyphRecords:e=[],layerRecords:r=[]}){ye.argument(t===0,"Only COLRv0 supported.");const n=14,a=n+e.length*6;return new Ae.Table("COLR",[{name:"version",type:"USHORT",value:t},{name:"numBaseGlyphRecords",type:"USHORT",value:e.length},{name:"baseGlyphRecordsOffset",type:"ULONG",value:n},{name:"layerRecordsOffset",type:"ULONG",value:a},{name:"numLayerRecords",type:"USHORT",value:r.length},...e.map((i,s)=>[{name:"glyphID_"+s,type:"USHORT",value:i.glyphID},{name:"firstLayerIndex_"+s,type:"USHORT",value:i.firstLayerIndex},{name:"numLayers_"+s,type:"USHORT",value:i.numLayers}]).flat(),...r.map((i,s)=>[{name:"LayerGlyphID_"+s,type:"USHORT",value:i.glyphID},{name:"paletteIndex_"+s,type:"USHORT",value:i.paletteIndex}]).flat()])}var fl={parse:IL,make:uL};function pL(t,e){return[{name:"tag_"+t,type:"TAG",value:e.tag},{name:"minValue_"+t,type:"FIXED",value:e.minValue<<16},{name:"defaultValue_"+t,type:"FIXED",value:e.defaultValue<<16},{name:"maxValue_"+t,type:"FIXED",value:e.maxValue<<16},{name:"flags_"+t,type:"USHORT",value:0},{name:"nameID_"+t,type:"USHORT",value:e.axisNameID}]}function SL(t,e,r){const n={},a=new pe.Parser(t,e);n.tag=a.parseTag(),n.minValue=a.parseFixed(),n.defaultValue=a.parseFixed(),n.maxValue=a.parseFixed(),a.skip("uShort",1);const i=a.parseUShort();return n.axisNameID=i,n.name=oo(r,i),n}function gL(t,e,r,n={}){const a=[{name:"nameID_"+t,type:"USHORT",value:e.subfamilyNameID},{name:"flags_"+t,type:"USHORT",value:0}];for(let i=0;i<r.length;++i){const s=r[i].tag;a.push({name:"axis_"+t+" "+s,type:"FIXED",value:e.coordinates[s]<<16})}return n&&n.postScriptNameID&&a.push({name:"postScriptNameID_",type:"USHORT",value:e.postScriptNameID!==void 0?e.postScriptNameID:65535}),a}function CL(t,e,r,n,a){const i={},s=new pe.Parser(t,e),l=s.parseUShort();i.subfamilyNameID=l,i.name=oo(n,l,[2,17]),s.skip("uShort",1),i.coordinates={};for(let T=0;T<r.length;++T)i.coordinates[r[T].tag]=s.parseFixed();if(s.relativeOffset===a)return i.postScriptNameID=void 0,i.postScriptName=void 0,i;const E=s.parseUShort();return i.postScriptNameID=E==65535?void 0:E,i.postScriptName=i.postScriptNameID!==void 0?oo(n,E,[6]):"",i}function RL(t,e){const r=new Ae.Table("fvar",[{name:"version",type:"ULONG",value:65536},{name:"offsetToData",type:"USHORT",value:0},{name:"countSizePairs",type:"USHORT",value:2},{name:"axisCount",type:"USHORT",value:t.axes.length},{name:"axisSize",type:"USHORT",value:20},{name:"instanceCount",type:"USHORT",value:t.instances.length},{name:"instanceSize",type:"USHORT",value:4+t.axes.length*4}]);r.offsetToData=r.sizeOf();for(let a=0;a<t.axes.length;a++)r.fields=r.fields.concat(pL(a,t.axes[a]));const n={};for(let a=0;a<t.instances.length;a++)if(t.instances[a].postScriptNameID!==void 0){r.instanceSize+=2,n.postScriptNameID=!0;break}for(let a=0;a<t.instances.length;a++)r.fields=r.fields.concat(gL(a,t.instances[a],t.axes,n));return r}function yL(t,e,r){const n=new pe.Parser(t,e),a=n.parseULong();ye.argument(a===65536,"Unsupported fvar table version.");const i=n.parseOffset16();n.skip("uShort",1);const s=n.parseUShort(),l=n.parseUShort(),E=n.parseUShort(),T=n.parseUShort(),h=[];for(let g=0;g<s;g++)h.push(SL(t,e+i+g*l,r));const u=[],C=e+i+s*l;for(let g=0;g<E;g++)u.push(CL(t,C+g*T,h,r,T));return{axes:h,instances:u}}var Nl={make:RL,parse:yL},mL={tag:q.tag,nameID:q.uShort,ordering:q.uShort},si=new Array(5);si[1]=function(){return{axisIndex:this.parseUShort(),flags:this.parseUShort(),valueNameID:this.parseUShort(),value:this.parseFixed()}};si[2]=function(){return{axisIndex:this.parseUShort(),flags:this.parseUShort(),valueNameID:this.parseUShort(),nominalValue:this.parseFixed(),rangeMinValue:this.parseFixed(),rangeMaxValue:this.parseFixed()}};si[3]=function(){return{axisIndex:this.parseUShort(),flags:this.parseUShort(),valueNameID:this.parseUShort(),value:this.parseFixed(),linkedValue:this.parseFixed()}};si[4]=function(){const e=this.parseUShort();return{flags:this.parseUShort(),valueNameID:this.parseUShort(),axisValues:this.parseList(e,function(){return{axisIndex:this.parseUShort(),value:this.parseFixed()}})}};function fL(){const t=this.parseUShort(),e=si[t],r={format:t};return e===void 0?(console.warn(`Unknown axis value table format ${t}`),r):Object.assign(r,this.parseStruct(e.bind(this)))}function NL(t,e,r){e||(e=0);const n=new pe.Parser(t,e),a=n.parseUShort(),i=n.parseUShort();a!==1&&console.warn(`Unsupported STAT table version ${a}.${i}`);const s=[a,i],l=n.parseUShort(),E=n.parseUShort(),T=n.parseOffset32(),h=n.parseUShort(),u=n.parseOffset32(),C=a>1||i>0?n.parseUShort():void 0;r!==void 0&&ye.argument(E>=r.axes.length,"STAT axis count must be greater than or equal to fvar axis count"),h>0&&ye.argument(E>=0,"STAT axis count must be greater than 0 if STAT axis value count is greater than 0");const g=[];for(let K=0;K<E;K++)n.offset=e+T,n.relativeOffset=K*l,g.push(n.parseStruct(mL));n.offset=e,n.relativeOffset=u;const H=n.parseUShortList(h),F=[];for(let K=0;K<h;K++)n.offset=e+u,n.relativeOffset=H[K],F.push(fL.apply(n));return{version:s,axes:g,values:F,elidedFallbackNameID:C}}var Ai=new Array(5);Ai[1]=function(e,r){return[{name:`format${e}`,type:"USHORT",value:1},{name:`axisIndex${e}`,type:"USHORT",value:r.axisIndex},{name:`flags${e}`,type:"USHORT",value:r.flags},{name:`valueNameID${e}`,type:"USHORT",value:r.valueNameID},{name:`value${e}`,type:"FLOAT",value:r.value}]};Ai[2]=function(e,r){return[{name:`format${e}`,type:"USHORT",value:2},{name:`axisIndex${e}`,type:"USHORT",value:r.axisIndex},{name:`flags${e}`,type:"USHORT",value:r.flags},{name:`valueNameID${e}`,type:"USHORT",value:r.valueNameID},{name:`nominalValue${e}`,type:"FLOAT",value:r.nominalValue},{name:`rangeMinValue${e}`,type:"FLOAT",value:r.rangeMinValue},{name:`rangeMaxValue${e}`,type:"FLOAT",value:r.rangeMaxValue}]};Ai[3]=function(e,r){return[{name:`format${e}`,type:"USHORT",value:3},{name:`axisIndex${e}`,type:"USHORT",value:r.axisIndex},{name:`flags${e}`,type:"USHORT",value:r.flags},{name:`valueNameID${e}`,type:"USHORT",value:r.valueNameID},{name:`value${e}`,type:"FLOAT",value:r.value},{name:`linkedValue${e}`,type:"FLOAT",value:r.linkedValue}]};Ai[4]=function(e,r){let n=[{name:`format${e}`,type:"USHORT",value:4},{name:`axisCount${e}`,type:"USHORT",value:r.axisValues.length},{name:`flags${e}`,type:"USHORT",value:r.flags},{name:`valueNameID${e}`,type:"USHORT",value:r.valueNameID}];for(let a=0;a<r.axisValues.length;a++)n=n.concat([{name:`format${e}axisIndex${a}`,type:"USHORT",value:r.axisValues[a].axisIndex},{name:`format${e}value${a}`,type:"FLOAT",value:r.axisValues[a].value}]);return n};function DL(t,e){return new Ae.Record("axisRecord_"+t,[{name:"axisTag_"+t,type:"TAG",value:e.tag},{name:"axisNameID_"+t,type:"USHORT",value:e.nameID},{name:"axisOrdering_"+t,type:"USHORT",value:e.ordering}])}function OL(t,e){const r=e.format,n=Ai[r];ye.argument(n!==void 0,`Unknown axis value table format ${r}`);const a=n(t,e);return new Ae.Table("axisValueTable_"+t,a)}function BL(t){const e=new Ae.Table("STAT",[{name:"majorVersion",type:"USHORT",value:1},{name:"minorVersion",type:"USHORT",value:2},{name:"designAxisSize",type:"USHORT",value:8},{name:"designAxisCount",type:"USHORT",value:t.axes.length},{name:"designAxesOffset",type:"ULONG",value:0},{name:"axisValueCount",type:"USHORT",value:t.values.length},{name:"offsetToAxisValueOffsets",type:"ULONG",value:0},{name:"elidedFallbackNameID",type:"USHORT",value:t.elidedFallbackNameID}]);e.designAxesOffset=e.offsetToAxisValueOffsets=e.sizeOf();for(let i=0;i<t.axes.length;i++){const s=DL(i,t.axes[i]);e.offsetToAxisValueOffsets+=s.sizeOf(),e.fields=e.fields.concat(s.fields)}const r=[];let n=[],a=t.values.length*2;for(let i=0;i<t.values.length;i++){const s=OL(i,t.values[i]);r.push({name:"offset_"+i,type:"USHORT",value:a}),a+=s.sizeOf(),n=n.concat(s.fields)}return e.fields=e.fields.concat(r),e.fields=e.fields.concat(n),e}var Dl={make:BL,parse:NL};function HL(t,e){return new Ae.Record("axisValueMap_"+t,[{name:"fromCoordinate_"+t,type:"F2DOT14",value:e.fromCoordinate},{name:"toCoordinate_"+t,type:"F2DOT14",value:e.toCoordinate}])}function FL(t,e){const r=new Ae.Record("segmentMap_"+t,[{name:"positionMapCount_"+t,type:"USHORT",value:e.axisValueMaps.length}]);let n=[];for(let a=0;a<e.axisValueMaps.length;a++){const i=HL(`${t}_${a}`,e.axisValueMaps[a]);n=n.concat(i.fields)}return r.fields=r.fields.concat(n),r}function ML(t,e){ye.argument(t.axisSegmentMaps.length===e.axes.length,"avar axis count must correspond to fvar axis count");const r=new Ae.Table("avar",[{name:"majorVersion",type:"USHORT",value:1},{name:"minorVersion",type:"USHORT",value:0},{name:"reserved",type:"USHORT",value:0},{name:"axisCount",type:"USHORT",value:t.axisSegmentMaps.length}]);for(let n=0;n<t.axisSegmentMaps.length;n++){const a=FL(n,t.axisSegmentMaps[n]);r.fields=r.fields.concat(a.fields)}return r}function GL(t,e,r){e||(e=0);const n=new q(t,e),a=n.parseUShort(),i=n.parseUShort();a!==1&&console.warn(`Unsupported avar table version ${a}.${i}`),n.skip("uShort",1);const s=n.parseUShort();ye.argument(s===r.axes.length,"avar axis count must correspond to fvar axis count");const l=[];for(let E=0;E<s;E++){const T=[],h=n.parseUShort();for(let u=0;u<h;u++){const C=n.parseF2Dot14(),g=n.parseF2Dot14();T.push({fromCoordinate:C,toCoordinate:g})}l.push({axisValueMaps:T})}return{version:[a,i],axisSegmentMaps:l}}var Ol={make:ML,parse:GL};function bL(t,e,r,n){const a=new pe.Parser(t,e),i=a.parseTupleVariationStore(a.relativeOffset,r.axes.length,"cvar",n),s=a.parseUShort(),l=a.parseUShort();return s!==1&&console.warn(`Unsupported cvar table version ${s}.${l}`),{version:[s,l],...i}}function PL(){console.warn("Writing of cvar tables is not yet supported.")}var Bl={make:PL,parse:bL};function vL(t,e,r,n){const a=new pe.Parser(t,e),i=a.parseUShort(),s=a.parseUShort();i!==1&&console.warn(`Unsupported gvar table version ${i}.${s}`);const l=a.parseUShort();l!==r.axes.length&&console.warn(`axisCount ${l} in gvar table does not match the number of axes ${r.axes.length} in the fvar table!`);const E=a.parseUShort(),T=a.parsePointer32(function(){return this.parseTupleRecords(E,l)}),h=a.parseTupleVariationStoreList(l,"gvar",n);return{version:[i,s],sharedTuples:T,glyphVariations:h}}function UL(){console.warn("Writing of gvar tables is not yet supported.")}var Hl={make:UL,parse:vL};function wL(t,e){const r={},n=new pe.Parser(t,e);r.version=n.parseUShort(),ye.argument(r.version<=1,"Unsupported gasp table version."),r.numRanges=n.parseUShort(),r.gaspRanges=[];for(let a=0;a<r.numRanges;a++)r.gaspRanges[a]={rangeMaxPPEM:n.parseUShort(),rangeGaspBehavior:n.parseUShort()};return r}function YL(t){const e=new Ae.Table("gasp",[{name:"version",type:"USHORT",value:1},{name:"numRanges",type:"USHORT",value:t.numRanges}]);for(let r in t.numRanges)e.fields.push({name:"rangeMaxPPEM",type:"USHORT",value:t.numRanges[r].rangeMaxPPEM}),e.fields.push({name:"rangeGaspBehavior",type:"USHORT",value:t.numRanges[r].rangeGaspBehavior});return e}var Fl={parse:wL,make:YL};function WL(t,e){const r=new Map,n=t.buffer,a=new q(t,e);if(a.parseUShort()!==0)return r;a.relativeOffset=a.parseOffset32();const s=t.byteOffset+e+a.relativeOffset,l=a.parseUShort(),E=new Map;for(let T=0;T<l;T++){const h=a.parseUShort(),u=a.parseUShort(),C=s+a.parseOffset32(),g=a.parseULong();let H=E.get(C);H===void 0&&(H=new Uint8Array(n,C,g),E.set(C,H));for(let F=h;F<=u;F++)r.set(F,H)}return r}function kL(t){const e=Array.from(t.keys()).sort(),r=[],n=[],a=new Map;let i=0,s={endGlyphID:null};for(let C=0,g=e.length;C<g;C++){const H=e[C],F=t.get(H);let K=a.get(F);K===void 0&&(K=i,n.push(F),a.set(F,K),i+=F.byteLength),H-1===s.endGlyphID&&K===s.svgDocOffset?s.endGlyphID=H:(s={startGlyphID:H,endGlyphID:H,svgDocOffset:K,svgDocLength:F.byteLength},r.push(s))}const l=r.length,E=n.length,T=2+l*12,h=new Array(4+l*4+E);let u=0;h[u++]={name:"version",type:"USHORT",value:0},h[u++]={name:"svgDocumentListOffset",type:"ULONG",value:10},h[u++]={name:"reserved",type:"ULONG",value:0},h[u++]={name:"numEntries",type:"USHORT",value:l};for(let C=0;C<l;C++){const g="documentRecord_"+C,{startGlyphID:H,endGlyphID:F,svgDocOffset:K,svgDocLength:j}=r[C];h[u++]={name:g+"_startGlyphID",type:"USHORT",value:H},h[u++]={name:g+"_endGlyphID",type:"USHORT",value:F},h[u++]={name:g+"_svgDocOffset",type:"ULONG",value:T+K},h[u++]={name:g+"_svgDocLength",type:"ULONG",value:j}}for(let C=0;C<E;C++)h[u++]={name:"svgDoc_"+C,type:"LITERAL",value:n[C]};return new Ae.Table("SVG ",h)}var Ml={make:kL,parse:WL};function iA(t){return Math.log(t)/Math.log(2)|0}function cs(t){for(;t.length%4!==0;)t.push(0);let e=0;for(let r=0;r<t.length;r+=4)e+=(t[r]<<24)+(t[r+1]<<16)+(t[r+2]<<8)+t[r+3];return e%=Math.pow(2,32),e}function oA(t,e,r,n){return new Ae.Record("Table Record",[{name:"tag",type:"TAG",value:t!==void 0?t:""},{name:"checkSum",type:"ULONG",value:e!==void 0?e:0},{name:"offset",type:"ULONG",value:r!==void 0?r:0},{name:"length",type:"ULONG",value:n!==void 0?n:0}])}function Gl(t){const e=new Ae.Table("sfnt",[{name:"version",type:"TAG",value:"OTTO"},{name:"numTables",type:"USHORT",value:0},{name:"searchRange",type:"USHORT",value:0},{name:"entrySelector",type:"USHORT",value:0},{name:"rangeShift",type:"USHORT",value:0}]);e.tables=t,e.numTables=t.length;const r=Math.pow(2,iA(e.numTables));e.searchRange=16*r,e.entrySelector=iA(r),e.rangeShift=e.numTables*16-e.searchRange;const n=[],a=[];let i=e.sizeOf()+oA().sizeOf()*e.numTables;for(;i%4!==0;)i+=1,a.push({name:"padding",type:"BYTE",value:0});for(let s=0;s<t.length;s+=1){const l=t[s];ye.argument(l.tableName.length===4,"Table name"+l.tableName+" is invalid.");const E=l.sizeOf(),T=oA(l.tableName,cs(l.encode()),i,E);for(n.push({name:T.tag+" Table Record",type:"RECORD",value:T}),a.push({name:l.tableName+" table",type:"RECORD",value:l}),i+=E,ye.argument(!isNaN(i),"Something went wrong calculating the offset.");i%4!==0;)i+=1,a.push({name:"padding",type:"BYTE",value:0})}return n.sort(function(s,l){return s.value.tag>l.value.tag?1:-1}),e.fields=e.fields.concat(n),e.fields=e.fields.concat(a),e}function sA(t,e,r){for(let n=0;n<e.length;n+=1){const a=t.charToGlyphIndex(e[n]);if(a>0)return t.glyphs.get(a).getMetrics()}return r}function KL(t){let e=0;for(let r=0;r<t.length;r+=1)e+=t[r];return e/t.length}function _L(t){const e=[],r=[],n=[],a=[],i=[],s=[],l=[];let E,T=0,h=0,u=0,C=0,g=0;for(let ot=0;ot<t.glyphs.length;ot+=1){const Xe=t.glyphs.get(ot),st=Xe.unicode|0;if(isNaN(Xe.advanceWidth))throw new Error("Glyph "+Xe.name+" ("+ot+"): advanceWidth is not a number.");(E>st||E===void 0)&&st>0&&(E=st),T<st&&(T=st);const et=F0.getUnicodeRange(st);if(et<32)h|=1<<et;else if(et<64)u|=1<<et-32;else if(et<96)C|=1<<et-64;else if(et<123)g|=1<<et-96;else throw new Error("Unicode ranges bits > 123 are reserved for internal usage");if(Xe.name===".notdef")continue;const Nr=Xe.getMetrics();e.push(Nr.xMin),r.push(Nr.yMin),n.push(Nr.xMax),a.push(Nr.yMax),s.push(Nr.leftSideBearing),l.push(Nr.rightSideBearing),i.push(Xe.advanceWidth)}const H={xMin:Math.min.apply(null,e),yMin:Math.min.apply(null,r),xMax:Math.max.apply(null,n),yMax:Math.max.apply(null,a),advanceWidthMax:Math.max.apply(null,i),advanceWidthAvg:KL(i),minLeftSideBearing:Math.min.apply(null,s),maxLeftSideBearing:Math.max.apply(null,s),minRightSideBearing:Math.min.apply(null,l)};H.ascender=t.ascender,H.descender=t.descender;let F=0;t.weightClass>=600&&(F|=t.macStyleValues.BOLD),t.italicAngle<0&&(F|=t.macStyleValues.ITALIC);const K=dl.make({flags:3,unitsPerEm:t.unitsPerEm,xMin:H.xMin,yMin:H.yMin,xMax:H.xMax,yMax:H.yMax,lowestRecPPEM:3,macStyle:F,createdTimestamp:t.createdTimestamp}),j=Il.make({ascender:H.ascender,descender:H.descender,advanceWidthMax:H.advanceWidthMax,minLeftSideBearing:H.minLeftSideBearing,minRightSideBearing:H.minRightSideBearing,xMaxExtent:H.maxLeftSideBearing+(H.xMax-H.xMin),numberOfHMetrics:t.glyphs.length}),Q=Sl.make(t.glyphs.length),te=F0.make(Object.assign({xAvgCharWidth:Math.round(H.advanceWidthAvg),usFirstCharIndex:E,usLastCharIndex:T,ulUnicodeRange1:h,ulUnicodeRange2:u,ulUnicodeRange3:C,ulUnicodeRange4:g,sTypoAscender:H.ascender,sTypoDescender:H.descender,sTypoLineGap:0,usWinAscent:H.yMax,usWinDescent:Math.abs(H.yMin),ulCodePageRange1:1,sxHeight:sA(t,"xyvw",{yMax:Math.round(H.ascender/2)}).yMax,sCapHeight:sA(t,"HIKLEFJMNTZBDPRAGOQSUVWXY",H).yMax,usDefaultChar:t.hasChar(" ")?32:0,usBreakChar:t.hasChar(" ")?32:0},t.tables.os2)),se=ul.make(t.glyphs),Ie=nl.make(t.glyphs),le=t.getEnglishName("fontFamily"),ue=t.getEnglishName("fontSubfamily"),ve=le+" "+ue;let Ye=t.getEnglishName("postScriptName");Ye||(Ye=le.replace(/\s/g,"")+"-"+ue);const Re={};for(let ot in t.names)Re[ot]=t.names[ot];Re.unicode=Re.unicode||{},Re.macintosh=Re.macintosh||{},Re.windows=Re.windows||{};const Me=t.names.unicode||{},xt=t.names.macintosh||{},Oe=t.names.windows||{};for(const ot in Re){if(Re[ot]=Re[ot]||{},!Re[ot].uniqueID){const Xe=t.getEnglishName("manufacturer")||"";Re[ot].uniqueID={en:`${Xe}: ${ve}`}}Re[ot].postScriptName||(Re[ot].postScriptName={en:Ye})}Re.unicode.preferredFamily||(Re.unicode.preferredFamily=Me.fontFamily||xt.fontFamily||Oe.fontFamily),Re.macintosh.preferredFamily||(Re.macintosh.preferredFamily=xt.fontFamily||Me.fontFamily||Oe.fontFamily),Re.windows.preferredFamily||(Re.windows.preferredFamily=Oe.fontFamily||Me.fontFamily||xt.fontFamily),Re.unicode.preferredSubfamily||(Re.unicode.preferredSubfamily=Me.fontSubfamily||xt.fontSubfamily||Oe.fontSubfamily),Re.macintosh.preferredSubfamily||(Re.macintosh.preferredSubfamily=xt.fontSubfamily||Me.fontSubfamily||Oe.fontSubfamily),Re.windows.preferredSubfamily||(Re.windows.preferredSubfamily=Oe.fontSubfamily||Me.fontSubfamily||xt.fontSubfamily);const ae=[],me=rl.make(Re,ae),ne=ae.length>0?pl.make(ae):void 0,Dt=gl.make(t),wt=B0.make(t.glyphs,{version:t.getEnglishName("version"),fullName:ve,familyName:le,weightName:ue,postScriptName:Ye,unitsPerEm:t.unitsPerEm,fontBBox:[0,H.yMin,H.ascender,H.advanceWidthMax],topDict:t.tables.cff&&t.tables.cff.topDict||{}}),We=t.metas&&Object.keys(t.metas).length>0?ml.make(t.metas):void 0,dt=[K,j,Q,te,me,Ie,Dt,wt,se];ne&&dt.push(ne);const Qt={gpos:Rl,gsub:yl,cpal:ll,colr:fl,stat:Dl,avar:Ol,cvar:Bl,fvar:Nl,gvar:Hl,gasp:Fl,svg:Ml},$t={avar:[t.tables.fvar],fvar:[t.names],gpos:[t.kerningPairs]};for(let ot in Qt){const Xe=t.tables[ot];if(Xe||ot==="gpos"){const st=Qt[ot].make.call(t,Xe,...$t[ot]||[]);st&&dt.push(st)}}We&&dt.push(We);const bt=Gl(dt),jt=bt.encode(),rt=cs(jt),ut=bt.fields;let Ur=!1;for(let ot=0;ot<ut.length;ot+=1)if(ut[ot].name==="head table"){ut[ot].value.checkSumAdjustment=2981146554-rt,Ur=!0;break}if(!Ur)throw new Error("Could not find head table with checkSum to adjust.");return bt}var VL={make:Gl,fontToTable:_L,computeCheckSum:cs};function Zo(t,e){let r=0,n=t.length-1;for(;r<=n;){const a=r+n>>>1,i=t[a].tag;if(i===e)return a;i<e?r=a+1:n=a-1}return-r-1}function AA(t,e){let r=0,n=t.length-1;for(;r<=n;){const a=r+n>>>1,i=t[a];if(i===e)return a;i<e?r=a+1:n=a-1}return-r-1}function lA(t,e){let r,n=0,a=t.length-1;for(;n<=a;){const i=n+a>>>1;r=t[i];const s=r.start;if(s===e)return r;s<e?n=i+1:a=i-1}if(n>0)return r=t[n-1],e>r.end?0:r}function bl(t,e){this.font=t,this.tableName=e}bl.prototype={searchTag:Zo,binSearch:AA,getTable:function(t){let e=this.font.tables[this.tableName];return!e&&t&&(e=this.font.tables[this.tableName]=this.createDefaultTable()),e},getScriptNames:function(){let t=this.getTable();return t?t.scripts.map(function(e){return e.tag}):[]},getDefaultScriptName:function(){let t=this.getTable();if(!t)return;let e=!1;for(let r=0;r<t.scripts.length;r++){const n=t.scripts[r].tag;if(n==="DFLT")return n;n==="latn"&&(e=!0)}if(e)return"latn"},getScriptTable:function(t,e){const r=this.getTable(e);if(r){t=t||"DFLT";const n=r.scripts,a=Zo(r.scripts,t);if(a>=0)return n[a].script;if(e){const i={tag:t,script:{defaultLangSys:{reserved:0,reqFeatureIndex:65535,featureIndexes:[]},langSysRecords:[]}};return n.splice(-1-a,0,i),i.script}}},getLangSysTable:function(t,e,r){const n=this.getScriptTable(t,r);if(n){if(!e||e==="dflt"||e==="DFLT")return n.defaultLangSys;const a=Zo(n.langSysRecords,e);if(a>=0)return n.langSysRecords[a].langSys;if(r){const i={tag:e,langSys:{reserved:0,reqFeatureIndex:65535,featureIndexes:[]}};return n.langSysRecords.splice(-1-a,0,i),i.langSys}}},getFeatureTable:function(t,e,r,n){const a=this.getLangSysTable(t,e,n);if(a){let i;const s=a.featureIndexes,l=this.font.tables[this.tableName].features;for(let E=0;E<s.length;E++)if(i=l[s[E]],i.tag===r)return i.feature;if(n){const E=l.length;return ye.assert(E===0||r>=l[E-1].tag,"Features must be added in alphabetical order."),i={tag:r,feature:{params:0,lookupListIndexes:[]}},l.push(i),s.push(E),i.feature}}},getLookupTables:function(t,e,r,n,a){const i=this.getFeatureTable(t,e,r,a),s=[];if(i){let l;const E=i.lookupListIndexes,T=this.font.tables[this.tableName].lookups;for(let h=0;h<E.length;h++)l=T[E[h]],l.lookupType===n&&s.push(l);if(s.length===0&&a){l={lookupType:n,lookupFlag:0,subtables:[],markFilteringSet:void 0};const h=T.length;return T.push(l),E.push(h),[l]}}return s},getGlyphClass:function(t,e){switch(t.format){case 1:return t.startGlyph<=e&&e<t.startGlyph+t.classes.length?t.classes[e-t.startGlyph]:0;case 2:{const r=lA(t.ranges,e);return r?r.classId:0}}},getCoverageIndex:function(t,e){switch(t.format){case 1:{const r=AA(t.glyphs,e);return r>=0?r:-1}case 2:{const r=lA(t.ranges,e);return r?r.index+e-r.start:-1}}},expandCoverage:function(t){if(t.format===1)return t.glyphs;{const e=[],r=t.ranges;for(let n=0;n<r.length;n++){const a=r[n],i=a.start,s=a.end;for(let l=i;l<=s;l++)e.push(l)}return e}}};var fo=bl;function li(t){fo.call(this,t,"gpos")}li.prototype=fo.prototype;li.prototype.init=function(){const t=this.getDefaultScriptName();this.defaultKerningTables=this.getKerningTables(t)};li.prototype.getKerningValue=function(t,e,r){for(let n=0;n<t.length;n++){const a=t[n].subtables;for(let i=0;i<a.length;i++){const s=a[i],l=this.getCoverageIndex(s.coverage,e);if(!(l<0))switch(s.posFormat){case 1:{let E=s.pairSets[l];for(let T=0;T<E.length;T++){let h=E[T];if(h.secondGlyph===r)return h.value1&&h.value1.xAdvance||0}break}case 2:{const E=this.getGlyphClass(s.classDef1,e),T=this.getGlyphClass(s.classDef2,r),h=s.classRecords[E][T];return h.value1&&h.value1.xAdvance||0}}}}return 0};li.prototype.getKerningTables=function(t,e){if(this.font.tables.gpos)return this.getLookupTables(t,e,"kern",2)};var zL=li;function JL(t,e){const r=t.length;if(r!==e.length)return!1;for(let n=0;n<r;n++)if(t[n]!==e[n])return!1;return!0}function ZL(t,e,r){let n=0,a=t.length-1,i=null;for(;n<=a;){const s=Math.floor((n+a)/2),l=t[s],E=l[e];if(E<r)n=s+1;else if(E>r)a=s-1;else{i=l;break}}return i}function jL(t,e,r){let n=0,a=t.length-1;for(;n<=a;){const i=Math.floor((n+a)/2),s=t[i];if(s[e]<r)n=i+1;else if(s[e]>r)a=i-1;else return i}return-1}function XL(t,e,r){let n=0,a=t.length;const i=(s,l)=>s[e]-l[e];for(;n<a;){const s=n+a>>>1;i(t[s],r)<0?n=s+1:a=s}return t.splice(n,0,r),n}function Pl(t){return t[0]===31&&t[1]===139&&t[2]===8}function qL(t){const e=new DataView(t.buffer,t.byteOffset,t.byteLength);let r=10;const n=t.byteLength-8,a=e.getInt8(3);if(a&4&&(r+=2+e.getUint16(r,!0)),a&8)for(;r<n&&t[r++]!==0;);if(a&16)for(;r<n&&t[r++]!==0;);if(a&2&&(r+=2),r>=n)throw new Error("Can't find compressed blocks");const i=e.getUint32(e.byteLength-4,!0);return J1(t.subarray(r,n),new Uint8Array(i))}function xA(t){return{x:t.x,y:t.y,onCurve:t.onCurve,lastPointOfContour:t.lastPointOfContour}}function QL(t){return{glyphIndex:t.glyphIndex,xScale:t.xScale,scale01:t.scale01,scale10:t.scale10,yScale:t.yScale,dx:t.dx,dy:t.dy}}function Sr(t){fo.call(this,t,"gsub")}function hs(t,e,r){const n=t.subtables;for(let a=0;a<n.length;a++){const i=n[a];if(i.substFormat===e)return i}if(r)return n.push(r),r}Sr.prototype=fo.prototype;Sr.prototype.createDefaultTable=function(){return{version:1,scripts:[{tag:"DFLT",script:{defaultLangSys:{reserved:0,reqFeatureIndex:65535,featureIndexes:[]},langSysRecords:[]}}],features:[],lookups:[]}};Sr.prototype.getSingle=function(t,e,r){const n=[],a=this.getLookupTables(e,r,t,1);for(let i=0;i<a.length;i++){const s=a[i].subtables;for(let l=0;l<s.length;l++){const E=s[l],T=this.expandCoverage(E.coverage);let h;if(E.substFormat===1){const u=E.deltaGlyphId;for(h=0;h<T.length;h++){const C=T[h];n.push({sub:C,by:C+u})}}else{const u=E.substitute;for(h=0;h<T.length;h++)n.push({sub:T[h],by:u[h]})}}}return n};Sr.prototype.getMultiple=function(t,e,r){const n=[],a=this.getLookupTables(e,r,t,2);for(let i=0;i<a.length;i++){const s=a[i].subtables;for(let l=0;l<s.length;l++){const E=s[l],T=this.expandCoverage(E.coverage);let h;for(h=0;h<T.length;h++){const u=T[h],C=E.sequences[h];n.push({sub:u,by:C})}}}return n};Sr.prototype.getAlternates=function(t,e,r){const n=[],a=this.getLookupTables(e,r,t,3);for(let i=0;i<a.length;i++){const s=a[i].subtables;for(let l=0;l<s.length;l++){const E=s[l],T=this.expandCoverage(E.coverage),h=E.alternateSets;for(let u=0;u<T.length;u++)n.push({sub:T[u],by:h[u]})}}return n};Sr.prototype.getLigatures=function(t,e,r){const n=[],a=this.getLookupTables(e,r,t,4);for(let i=0;i<a.length;i++){const s=a[i].subtables;for(let l=0;l<s.length;l++){const E=s[l],T=this.expandCoverage(E.coverage),h=E.ligatureSets;for(let u=0;u<T.length;u++){const C=T[u],g=h[u];for(let H=0;H<g.length;H++){const F=g[H];n.push({sub:[C].concat(F.components),by:F.ligGlyph})}}}}return n};Sr.prototype.addSingle=function(t,e,r,n){const a=this.getLookupTables(r,n,t,1,!0)[0],i=hs(a,2,{substFormat:2,coverage:{format:1,glyphs:[]},substitute:[]});ye.assert(i.coverage.format===1,"Single: unable to modify coverage table format "+i.coverage.format);const s=e.sub;let l=this.binSearch(i.coverage.glyphs,s);l<0&&(l=-1-l,i.coverage.glyphs.splice(l,0,s),i.substitute.splice(l,0,0)),i.substitute[l]=e.by};Sr.prototype.addMultiple=function(t,e,r,n){ye.assert(e.by instanceof Array&&e.by.length>1,'Multiple: "by" must be an array of two or more ids');const a=this.getLookupTables(r,n,t,2,!0)[0],i=hs(a,1,{substFormat:1,coverage:{format:1,glyphs:[]},sequences:[]});ye.assert(i.coverage.format===1,"Multiple: unable to modify coverage table format "+i.coverage.format);const s=e.sub;let l=this.binSearch(i.coverage.glyphs,s);l<0&&(l=-1-l,i.coverage.glyphs.splice(l,0,s),i.sequences.splice(l,0,0)),i.sequences[l]=e.by};Sr.prototype.addAlternate=function(t,e,r,n){const a=this.getLookupTables(r,n,t,3,!0)[0],i=hs(a,1,{substFormat:1,coverage:{format:1,glyphs:[]},alternateSets:[]});ye.assert(i.coverage.format===1,"Alternate: unable to modify coverage table format "+i.coverage.format);const s=e.sub;let l=this.binSearch(i.coverage.glyphs,s);l<0&&(l=-1-l,i.coverage.glyphs.splice(l,0,s),i.alternateSets.splice(l,0,0)),i.alternateSets[l]=e.by};Sr.prototype.addLigature=function(t,e,r,n){const a=this.getLookupTables(r,n,t,4,!0)[0];let i=a.subtables[0];i||(i={substFormat:1,coverage:{format:1,glyphs:[]},ligatureSets:[]},a.subtables[0]=i),ye.assert(i.coverage.format===1,"Ligature: unable to modify coverage table format "+i.coverage.format);const s=e.sub[0],l=e.sub.slice(1),E={ligGlyph:e.by,components:l};let T=this.binSearch(i.coverage.glyphs,s);if(T>=0){const h=i.ligatureSets[T];for(let u=0;u<h.length;u++)if(JL(h[u].components,l))return;h.push(E)}else T=-1-T,i.coverage.glyphs.splice(T,0,s),i.ligatureSets.splice(T,0,[E])};Sr.prototype.getFeature=function(t,e,r){if(/ss\d\d/.test(t))return this.getSingle(t,e,r);switch(t){case"aalt":case"salt":return this.getSingle(t,e,r).concat(this.getAlternates(t,e,r));case"dlig":case"liga":case"rlig":return this.getLigatures(t,e,r);case"ccmp":return this.getMultiple(t,e,r).concat(this.getLigatures(t,e,r));case"stch":return this.getMultiple(t,e,r)}};Sr.prototype.add=function(t,e,r,n){if(/ss\d\d/.test(t))return this.addSingle(t,e,r,n);switch(t){case"aalt":case"salt":return typeof e.by=="number"?this.addSingle(t,e,r,n):this.addAlternate(t,e,r,n);case"dlig":case"liga":case"rlig":return this.addLigature(t,e,r,n);case"ccmp":return e.by instanceof Array?this.addMultiple(t,e,r,n):this.addLigature(t,e,r,n)}};var $L=Sr,vl=class{constructor(t){this.defaultValue=255,this.font=t}cpal(){return this.font.tables&&this.font.tables.cpal?this.font.tables.cpal:!1}getAll(t){const e=[],r=this.cpal();if(!r)return e;for(let n=0;n<r.colorRecordIndices.length;n++){const a=r.colorRecordIndices[n],i=[];for(let s=a;s<a+r.numPaletteEntries;s++)i.push(ga(r.colorRecords[s],t||"hexa"));e.push(i)}return e}toCPALcolor(t){return Array.isArray(t)?t.map(e=>so(e,"raw")):so(t,"raw")}fillPalette(t,e=[],r=this.cpal().numPaletteEntries){return t=Number.isInteger(t)?this.get(t,"raw"):t,Object.assign(Array(r).fill(this.defaultValue),this.toCPALcolor(t).concat(this.toCPALcolor(e)))}extend(t){if(this.ensureCPAL(Array(t).fill(this.defaultValue)))return;const e=this.cpal(),r=e.numPaletteEntries+t,n=this.getAll().map(a=>this.fillPalette(a,[],r));e.numPaletteEntries=r,e.colorRecords=this.toCPALcolor(n.flat()),this.updateIndices()}get(t,e="hexa"){return this.getAll(e)[t]||null}getColor(t,e=0,r="hexa"){return As(this.font,t,e,r)}setColor(t,e,r=0){t=parseInt(t),r=parseInt(r);let n=this.getAll("raw"),a=n[r];if(!a)throw Error(`paletteIndex ${r} out of range`);const i=this.cpal(),s=i.numPaletteEntries;Array.isArray(e)||(e=[e]),e.length+t>s&&(this.extend(e.length+t-s),n=this.getAll("raw"),a=n[r]);for(let l=0;l<e.length;l++)a[l+t]=this.toCPALcolor(e[l]);i.colorRecords=n.flat(),this.updateIndices()}add(t){if(this.ensureCPAL(t))return;const e=this.cpal(),r=e.numPaletteEntries;t&&t.length?(t=this.toCPALcolor(t),t.length>r?this.extend(t.length-r):t.length<r&&(t=this.fillPalette(t)),e.colorRecordIndices.push(e.colorRecords.length),e.colorRecords.push(...t)):(e.colorRecordIndices.push(e.colorRecords.length),e.colorRecords.push(...Array(r).fill(this.defaultValue)))}delete(t){const e=this.getAll("raw");delete e[t];const r=this.cpal();r.colorRecordIndices.pop(),r.colorRecords=e.flat()}deleteColor(t,e){if(t===e)throw Error("replacementIndex cannot be the same as colorIndex");const r=this.cpal(),n=this.getAll("raw"),a=[];if(e>r.numPaletteEntries-1)throw Error(`Replacement index out of range: numPaletteEntries after deletion: ${r.numPaletteEntries-1}, replacementIndex: ${e})`);for(let l=0;l<n.length;l++){const T=n[l].filter((h,u)=>u!==t);a.push(T)}const i=this.font.tables.colr;if(i){const l=i.layerRecords;for(let E=0;E<l.length;E++){const T=l[E].paletteIndex;if(T>t)l[E].paletteIndex-=1;else if(T===t){let h=0;for(let u=0;u<n.length;u++)if(e>t&&e<=t+n[u].length){h++;break}l[E].paletteIndex=e-h}}this.font.tables.colr={...i,layerRecords:l}}const s=a.flat();for(let l=0;l<n.length;l++)r.colorRecordIndices[l]-=l;r.numPaletteEntries=Math.max(0,r.numPaletteEntries-1),r.colorRecords=this.toCPALcolor(s)}ensureCPAL(t){return this.cpal()?!1:(!t||!t.length?t=[this.defaultValue]:t=this.toCPALcolor(t),this.font.tables.cpal={version:0,numPaletteEntries:t.length,colorRecords:t,colorRecordIndices:[0]},!0)}updateIndices(){const t=this.cpal(),e=Math.ceil(t.colorRecords.length/t.numPaletteEntries);t.colorRecordIndices=[];for(let r=0;r<e;r++)t.colorRecordIndices.push(r*t.numPaletteEntries)}},eT=class{constructor(t){this.font=t}ensureCOLR(){return this.font.tables.colr||(this.font.tables.colr={version:0,baseGlyphRecords:[],layerRecords:[]}),this.font}get(t){const e=this.font,r=[],n=e.tables.colr,a=e.tables.cpal;if(!n||!a)return r;const i=ZL(n.baseGlyphRecords,"glyphID",t);if(!i)return r;const s=i.firstLayerIndex,l=i.numLayers;for(let E=0;E<l;E++){const T=n.layerRecords[s+E];r.push({glyph:e.glyphs.get(T.glyphID),paletteIndex:T.paletteIndex})}return r}add(t,e,r){const n=this.get(t);e=Array.isArray(e)?e:[e],r===void 0||r===1/0||r>n.length?r=n.length:r<0&&(r=n.length+1+r%(n.length+1),r>=n.length+1&&(r-=n.length+1));const a=[];for(let i=0;i<r;i++){const s=Number.isInteger(n[i].glyph)?n[i].glyph:n[i].glyph.index;a.push({glyphID:s,paletteIndex:n[i].paletteIndex})}for(const i of e){const s=Number.isInteger(i.glyph)?i.glyph:i.glyph.index;a.push({glyphID:s,paletteIndex:i.paletteIndex})}for(let i=r;i<n.length;i++){const s=Number.isInteger(n[i].glyph)?n[i].glyph:n[i].glyph.index;a.push({glyphID:s,paletteIndex:n[i].paletteIndex})}this.updateColrTable(t,a)}setPaletteIndex(t,e,r){let n=this.get(t);n[e]?(n=n.map((a,i)=>({glyphID:a.glyph.index,paletteIndex:i===e?r:a.paletteIndex})),this.updateColrTable(t,n)):console.error("Invalid layer index")}remove(t,e,r=e){let n=this.get(t);n=n.map(a=>({glyphID:a.glyph.index,paletteIndex:a.paletteIndex})),n.splice(e,r-e+1),this.updateColrTable(t,n)}updateColrTable(t,e){this.ensureCOLR();const n=this.font.tables.colr;let a=jL(n.baseGlyphRecords,"glyphID",t);if(a===-1){const h={glyphID:t,firstLayerIndex:n.layerRecords.length,numLayers:0};a=XL(n.baseGlyphRecords,"glyphID",h)}const s=n.baseGlyphRecords[a],l=s.numLayers,E=e.length,T=E-l;if(T>0){const h=e.slice(l).map(u=>({glyphID:u.glyphID,paletteIndex:u.paletteIndex}));n.layerRecords.splice(s.firstLayerIndex+l,0,...h)}else T<0&&n.layerRecords.splice(s.firstLayerIndex+E,-T);for(let h=0;h<Math.min(l,E);h++)n.layerRecords[s.firstLayerIndex+h]={glyphID:e[h].glyphID,paletteIndex:e[h].paletteIndex};if(s.numLayers=E,T!==0)for(let h=0;h<n.baseGlyphRecords.length;h++){const u=n.baseGlyphRecords[h];h===a||u.firstLayerIndex<s.firstLayerIndex||(n.baseGlyphRecords[h].firstLayerIndex+=T)}}},tT=class{constructor(t){this.font=t,this.cache=new WeakMap}get(t){const e=this.getOrCreateSvgImageCacheEntry(t);return e&&e.image}getAsync(t){const e=this.getOrCreateSvgImageCacheEntry(t);return e&&e.promise}getOrCreateSvgImageCacheEntry(t){const e=this.font.tables.svg;if(e===void 0)return;const r=e.get(t);if(r===void 0)return;let n=this.cache.get(r);n===void 0&&(n=rT(r),this.cache.set(r,n));let a=n.images.get(t);return a===void 0&&(a=nT(this.font,n.template,t),a.promise.then(i=>{if(a.image=i,typeof this.font.onGlyphUpdated=="function")try{this.font.onGlyphUpdated(t)}catch(s){console.error("font.onGlyphUpdated",t,s)}}),n.images.set(t,a)),a}};function rT(t){return{template:aT(t).then(sT),images:new Map}}function nT(t,e,r){return{promise:e.then(n=>{let a;typeof n=="string"?a=n:(n[4]=r,a=n.join(""));const i=AT(a,t.unitsPerEm);return i.image.decode().then(()=>i)}),image:void 0}}var aT=typeof DecompressionStream=="function"?oT:iT;function iT(t){try{return Promise.resolve(new TextDecoder().decode(Pl(t)?qL(t):t))}catch(e){return Promise.reject(e)}}function oT(t){if(Pl(t))return new Response(new Response(t).body.pipeThrough(new DecompressionStream("gzip"))).text();try{return Promise.resolve(new TextDecoder().decode(t))}catch(e){return Promise.reject(e)}}function sT(t){const e=t.indexOf("<svg"),r=t.indexOf(">",e+4)+1;if(/ id=['"]glyph\d+['"]/.test(t.substring(e,r)))return t;const n=t.lastIndexOf("</svg>");return[t.substring(0,r),"<defs>",t.substring(r,n),'</defs><use href="#glyph',"",'"/>',t.substring(n)]}function AT(t,e){const n=new DOMParser().parseFromString(t,"image/svg+xml").documentElement,a=n.viewBox.baseVal,i=n.width.baseVal,s=n.height.baseVal;let l=1,E=1;a.width>0&&a.height>0&&(i.unitType===1?(l=i.valueInSpecifiedUnits/a.width,E=s.unitType===1?s.valueInSpecifiedUnits/a.height:l):s.unitType===1?(E=s.valueInSpecifiedUnits/a.height,l=E):e&&(l=e/a.width,E=e/a.height));const T=document.createElement("div");T.style.position="fixed",T.style.visibility="hidden",T.appendChild(n),document.body.appendChild(T);const h=n.getBBox();document.body.removeChild(T);const u=(h.x-a.x)*l,C=(a.y-h.y)*E,g=h.width*l,H=h.height*E;n.setAttribute("viewBox",[h.x,h.y,h.width,h.height].join(" ")),l!==1&&n.setAttribute("width",g),E!==1&&n.setAttribute("height",H);const F=new Image(g,H);return F.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(n.outerHTML),{leftSideBearing:u,baseline:C,image:F}}function EA(t,e,r,n,a){let i;return(e&n)>0?(i=t.parseByte(),e&a||(i=-i),i=r+i):(e&a)>0?i=r:i=r+t.parseShort(),i}function Ul(t,e,r){const n=new pe.Parser(e,r);t._numberOfContours=n.parseShort(),t._xMin=n.parseShort(),t._yMin=n.parseShort(),t._xMax=n.parseShort(),t._yMax=n.parseShort();let a,i;if(t._numberOfContours>0){const s=t.endPointIndices=[];for(let E=0;E<t._numberOfContours;E+=1)s.push(n.parseUShort());t.instructionLength=n.parseUShort(),t.instructions=[];for(let E=0;E<t.instructionLength;E+=1)t.instructions.push(n.parseByte());const l=s[s.length-1]+1;a=[];for(let E=0;E<l;E+=1)if(i=n.parseByte(),a.push(i),(i&8)>0){const T=n.parseByte();for(let h=0;h<T;h+=1)a.push(i),E+=1}if(ye.argument(a.length===l,"Bad flags."),s.length>0){const E=[];let T;if(l>0){for(let C=0;C<l;C+=1)i=a[C],T={},T.onCurve=!!(i&1),T.lastPointOfContour=s.indexOf(C)>=0,E.push(T);let h=0;for(let C=0;C<l;C+=1)i=a[C],T=E[C],T.x=EA(n,i,h,2,16),h=T.x;let u=0;for(let C=0;C<l;C+=1)i=a[C],T=E[C],T.y=EA(n,i,u,4,32),u=T.y}t.points=E}else t.points=[]}else if(t.numberOfContours===0)t.points=[];else{t.isComposite=!0,t.points=[],t.components=[];let s=!0;for(;s;){a=n.parseUShort();const l={glyphIndex:n.parseUShort(),xScale:1,scale01:0,scale10:0,yScale:1,dx:0,dy:0};(a&1)>0?(a&2)>0?(l.dx=n.parseShort(),l.dy=n.parseShort()):l.matchedPoints=[n.parseUShort(),n.parseUShort()]:(a&2)>0?(l.dx=n.parseChar(),l.dy=n.parseChar()):l.matchedPoints=[n.parseByte(),n.parseByte()],(a&8)>0?l.xScale=l.yScale=n.parseF2Dot14():(a&64)>0?(l.xScale=n.parseF2Dot14(),l.yScale=n.parseF2Dot14()):(a&128)>0&&(l.xScale=n.parseF2Dot14(),l.scale01=n.parseF2Dot14(),l.scale10=n.parseF2Dot14(),l.yScale=n.parseF2Dot14()),t.components.push(l),s=!!(a&32)}if(a&256){t.instructionLength=n.parseUShort(),t.instructions=[];for(let l=0;l<t.instructionLength;l+=1)t.instructions.push(n.parseByte())}}}function Wi(t,e){const r=[];for(let n=0;n<t.length;n+=1){const a=t[n],i={x:e.xScale*a.x+e.scale10*a.y+e.dx,y:e.scale01*a.x+e.yScale*a.y+e.dy,onCurve:a.onCurve,lastPointOfContour:a.lastPointOfContour};r.push(i)}return r}function lT(t){const e=[];let r=[];for(let n=0;n<t.length;n+=1){const a=t[n];r.push(a),a.lastPointOfContour&&(e.push(r),r=[])}return ye.argument(r.length===0,"There are still points left in the current contour."),e}function Ls(t){const e=new Kn;if(!t)return e;const r=lT(t);for(let n=0;n<r.length;++n){const a=r[n];let i=a[a.length-1],s=a[0];if(i.onCurve)e.moveTo(i.x,i.y);else if(s.onCurve)e.moveTo(s.x,s.y);else{const l={x:(i.x+s.x)*.5,y:(i.y+s.y)*.5};e.moveTo(l.x,l.y)}for(let l=0;l<a.length;++l)if(i=s,s=a[(l+1)%a.length],i.onCurve)e.lineTo(i.x,i.y);else{let E=s;s.onCurve||(E={x:(i.x+s.x)*.5,y:(i.y+s.y)*.5}),e.quadraticCurveTo(i.x,i.y,E.x,E.y)}e.closePath()}return e}function wl(t,e){if(e.isComposite)for(let r=0;r<e.components.length;r+=1){const n=e.components[r],a=t.get(n.glyphIndex);if(a.getPath(),a.points){let i;if(n.matchedPoints===void 0)i=Wi(a.points,n);else{if(n.matchedPoints[0]>e.points.length-1||n.matchedPoints[1]>a.points.length-1)throw Error("Matched points out of range in "+e.name);const s=e.points[n.matchedPoints[0]];let l=a.points[n.matchedPoints[1]];const E={xScale:n.xScale,scale01:n.scale01,scale10:n.scale10,yScale:n.yScale,dx:0,dy:0};l=Wi([l],E)[0],E.dx=s.x-l.x,E.dy=s.y-l.y,i=Wi(a.points,E)}e.points=e.points.concat(i)}}return Ls(e.points)}function xT(t,e,r,n){const a=new Xr.GlyphSet(n);for(let i=0;i<r.length-1;i+=1){const s=r[i],l=r[i+1];s!==l?a.push(i,Xr.ttfGlyphLoader(n,i,Ul,t,e+s,wl)):a.push(i,Xr.glyphLoader(n,i))}return a}function ET(t,e,r,n){const a=new Xr.GlyphSet(n);return n._push=function(i){const s=r[i],l=r[i+1];s!==l?a.push(i,Xr.ttfGlyphLoader(n,i,Ul,t,e+s,wl)):a.push(i,Xr.glyphLoader(n,i))},a}function cT(t,e,r,n,a){return a.lowMemory?ET(t,e,r,n):xT(t,e,r,n)}var Yl={getPath:Ls,parse:cT},hT=class{constructor(t){this.font=t}normalizeCoordTags(t){for(const e in t)if(e.length<4){const r=e.padEnd(4," ");t[r]===void 0&&(t[r]=t[e]),delete t[e]}}getNormalizedCoords(t){t||(t=this.font.variation.get());let e=[];this.normalizeCoordTags(t);for(let r=0;r<this.fvar().axes.length;r++){const n=this.fvar().axes[r];let a=t[n.tag];a===void 0&&(a=n.defaultValue),a<n.defaultValue?e.push((a-n.defaultValue+Number.EPSILON)/(n.defaultValue-n.minValue+Number.EPSILON)):e.push((a-n.defaultValue+Number.EPSILON)/(n.maxValue-n.defaultValue+Number.EPSILON))}if(this.avar())for(let r=0;r<this.avar().axisSegmentMaps.length;r++){let n=this.avar().axisSegmentMaps[r];for(let a=0;a<n.axisValueMaps.length;a++){let i=n.axisValueMaps[a];if(a>=1&&e[r]<i.fromCoordinate){let s=n.axisValueMaps[a-1];e[r]=((e[r]-s.fromCoordinate)*(i.toCoordinate-s.toCoordinate)+Number.EPSILON)/(i.fromCoordinate-s.fromCoordinate+Number.EPSILON)+s.toCoordinate;break}}}return e}interpolatePoints(t,e,r){if(t.length===0)return;let n=0;for(;n<t.length;){let a=n,i=n,s=t[i];for(;!s.lastPointOfContour;)s=t[++i];for(;n<=i&&!r[n];)n++;if(n>i)continue;let l=n,E=n;for(n++;n<=i;)r[n]&&(this.deltaInterpolate(E+1,n-1,E,n,e,t),E=n),n++;E===l?this.deltaShift(a,i,E,e,t):(this.deltaInterpolate(E+1,i,E,l,e,t),l>0&&this.deltaInterpolate(a,l-1,E,l,e,t)),n=i+1}}deltaInterpolate(t,e,r,n,a,i){if(t>e)return;let s=["x","y"];for(let E=0;E<s.length;E++){let T=s[E];if(a[r][T]>a[n][T]){var l=r;r=n,n=l}let h=a[r][T],u=a[n][T],C=i[r][T],g=i[n][T];if(h!==u||C===g){let H=h===u?0:(g-C)/(u-h);for(let F=t;F<=e;F++){let K=a[F][T];K<=h?K+=C-h:K>=u?K+=g-u:K=C+(K-h)*H,i[F][T]=K}}}}deltaShift(t,e,r,n,a){let i=a[r].x-n[r].x,s=a[r].y-n[r].y;if(!(i===0&&s===0))for(let l=t;l<=e;l++)l!==r&&(a[l].x+=i,a[l].y+=s)}transformComponents(t,e,r,n,a,i){let s=0;for(let l=0;l<t.components.length;l++){const E=t.components[l],T=this.font.glyphs.get(E.glyphIndex),h=QL(E),u=n.indexOf(l);u>-1&&(h.dx+=Math.round(a.deltas[u]*i),h.dy+=Math.round(a.deltasY[u]*i));const C=Wi(this.getTransform(T,r).points,h);e.splice(s,C.length,...C),s+=T.points.length}}applyTupleVariationStore(t,e,r,n="gvar",a={}){r||(r=this.font.variation.get());const i=this.getNormalizedCoords(r),{headers:s,sharedPoints:l}=t,E=this.fvar().axes.length;let T;n==="gvar"?T=e.map(xA):n==="cvar"&&(T=[...e]);for(let h=0;h<s.length;h++){const u=s[h];let C=1;for(let H=0;H<E;H++){let F=[0];switch(n){case"gvar":F=u.peakTuple?u.peakTuple:this.gvar().sharedTuples[u.sharedTupleRecordsIndex];break;case"cvar":F=u.peakTuple;break}if(F[H]!==0){if(i[H]===0){C=0;break}if(u.intermediateStartTuple)if(i[H]<u.intermediateStartTuple[H]||i[H]>u.intermediateEndTuple[H]){C=0;break}else i[H]<F[H]?C=C*(i[H]-u.intermediateStartTuple[H]+Number.EPSILON)/(F[H]-u.intermediateStartTuple[H]+Number.EPSILON):C=C*(u.intermediateEndTuple[H]-i[H]+Number.EPSILON)/(u.intermediateEndTuple[H]-F[H]+Number.EPSILON);else{if(i[H]<Math.min(0,F[H])||i[H]>Math.max(0,F[H])){C=0;break}C=(C*i[H]+Number.EPSILON)/(F[H]+Number.EPSILON)}}}if(C===0)continue;const g=u.privatePoints.length?u.privatePoints:l;if(n==="gvar"&&a.glyph&&a.glyph.isComposite)this.transformComponents(a.glyph,T,r,g,u,C);else if(g.length===0)for(let H=0;H<T.length;H++){const F=T[H];n==="gvar"?T[H]={x:Math.round(F.x+u.deltas[H]*C),y:Math.round(F.y+u.deltasY[H]*C),onCurve:F.onCurve,lastPointOfContour:F.lastPointOfContour}:n==="cvar"&&(T[H]=Math.round(F+u.deltas[H]*C))}else{let H;n==="gvar"?H=T.map(xA):n==="cvar"&&(H=T);const F=Array(e.length).fill(!1);for(let K=0;K<g.length;K++){let j=g[K];if(j<e.length){let Q=H[j];n==="gvar"?(F[j]=!0,Q.x+=u.deltas[K]*C,Q.y+=u.deltasY[K]*C):n==="cvar"&&(T[j]=Math.round(Q+u.deltas[K]*C))}}if(n==="gvar"){this.interpolatePoints(H,T,F);for(let K=0;K<e.length;K++){let j=H[K].x-T[K].x,Q=H[K].y-T[K].y;T[K].x=Math.round(T[K].x+j),T[K].y=Math.round(T[K].y+Q)}}}}return T}getTransform(t,e){Number.isInteger(t)&&(t=this.font.glyphs.get(t));const r=t.getBlendPath,n=!!(t.points&&t.points.length);let a=t;if(r||n){if(e||(e=this.font.variation.get()),n){const i=this.gvar()&&this.gvar().glyphVariations[t.index];if(i){const s=t.points;let l=this.applyTupleVariationStore(i,s,e,"gvar",{glyph:t});a=new Ca(Object.assign({},t,{points:l,path:Ls(l)}))}}else if(r){const i=t.getBlendPath(e);a=new Ca(Object.assign({},t,{path:i}))}}return this.font.tables.hvar&&(t._advanceWidth=typeof t._advanceWidth<"u"?t._advanceWidth:t.advanceWidth,t.advanceWidth=a.advanceWidth=Math.round(t._advanceWidth+this.getVariableAdjustment(a.index,"hvar","advanceWidth",e)),t._leftSideBearing=typeof t._leftSideBearing<"u"?t._leftSideBearing:t.leftSideBearing,t.leftSideBearing=a.leftSideBearing=Math.round(t._leftSideBearing+this.getVariableAdjustment(a.index,"hvar","lsb",e))),a}getCvarTransform(t){const e=this.font.tables.cvt,r=this.cvar();return!e||!e.length||!r||!r.headers.length?e:this.applyTupleVariationStore(r,e,t,"cvar")}getVariableAdjustment(t,e,r,n){n=n||this.font.variation.get();let a,i;const s=this.font.tables[e];if(!s)throw Error(`trying to get variation adjustment from non-existent table "${s}"`);if(!s.itemVariationStore)throw Error(`trying to get variation adjustment from table "${s}" which does not have an itemVariationStore`);const l=s[r]&&s[r].map.length;if(l){let E=t;E>=l&&(E=l-1),{outerIndex:a,innerIndex:i}=s[r].map[E]}else a=0,i=t;return this.getDelta(s.itemVariationStore,a,i,n)}getDelta(t,e,r,n){if(e>=t.itemVariationSubtables.length)return 0;let a=t.itemVariationSubtables[e];if(r>=a.deltaSets.length)return 0;let i=a.deltaSets[r],s=this.getBlendVector(t,e,n),l=0;for(let E=0;E<a.regionIndexes.length;E++)l+=i[E]*s[E];return l}getBlendVector(t,e,r){r||(r=this.font.variation.get());let n=t.itemVariationSubtables[e];const a=this.getNormalizedCoords(r);let i=[];for(let s=0;s<n.regionIndexes.length;s++){let l=1,E=n.regionIndexes[s],T=t.variationRegions[E].regionAxes;for(let h=0;h<T.length;h++){let u=T[h],C;u.startCoord>u.peakCoord||u.peakCoord>u.endCoord||u.startCoord<0&&u.endCoord>0&&u.peakCoord!==0||u.peakCoord===0?C=1:a[h]<u.startCoord||a[h]>u.endCoord?C=0:a[h]===u.peakCoord?C=1:a[h]<u.peakCoord?C=(a[h]-u.startCoord+Number.EPSILON)/(u.peakCoord-u.startCoord+Number.EPSILON):C=(u.endCoord-a[h]+Number.EPSILON)/(u.endCoord-u.peakCoord+Number.EPSILON),l*=C}i[s]=l}return i}avar(){return this.font.tables.avar}cvar(){return this.font.tables.cvar}fvar(){return this.font.tables.fvar}gvar(){return this.font.tables.gvar}hvar(){return this.font.tables.hvar}},LT=class{constructor(t){this.font=t,this.process=new hT(this.font),this.activateDefaultVariation(),this.getTransform=this.process.getTransform.bind(this.process)}activateDefaultVariation(){const t=this.getDefaultInstanceIndex();t>-1?this.set(t):this.set(this.getDefaultCoordinates())}getDefaultCoordinates(){return this.fvar().axes.reduce((t,e)=>(t[e.tag]=e.defaultValue,t),{})}getDefaultInstanceIndex(){const t=this.getDefaultCoordinates();let e=this.getInstanceIndex(t);return e<0&&(e=this.fvar().instances.findIndex(r=>r.name&&r.name.en==="Regular")),e}getInstanceIndex(t){return this.fvar().instances.findIndex(e=>Object.keys(t).every(r=>e.coordinates[r]===t[r]))}getInstance(t){return this.fvar().instances&&this.fvar().instances[t]}set(t){let e;if(Number.isInteger(t)){const r=this.getInstance(t);if(!r)throw Error(`Invalid instance index ${t}`);e={...r.coordinates}}else e=t,this.process.normalizeCoordTags(e);e=Object.assign({},this.font.defaultRenderOptions.variation,e),this.font.defaultRenderOptions=Object.assign({},this.font.defaultRenderOptions,{variation:e})}get(){return Object.assign({},this.font.defaultRenderOptions.variation)}avar(){return this.font.tables.avar}cvar(){return this.font.tables.cvar}fvar(){return this.font.tables.fvar}gvar(){return this.font.tables.gvar}hvar(){return this.font.tables.hvar}},Wl,_n,kl,M0;function Kl(t){this.font=t,this.getCommands=function(e){return Yl.getPath(e).commands},this._fpgmState=this._prepState=void 0,this._errorState=0}function TT(t){return t}function _l(t){return Math.sign(t)*Math.round(Math.abs(t))}function dT(t){return Math.sign(t)*Math.round(Math.abs(t*2))/2}function IT(t){return Math.sign(t)*(Math.round(Math.abs(t)+.5)-.5)}function uT(t){return Math.sign(t)*Math.ceil(Math.abs(t))}function pT(t){return Math.sign(t)*Math.floor(Math.abs(t))}var Vl=function(t){const e=this.srPeriod;let r=this.srPhase;const n=this.srThreshold;let a=1;return t<0&&(t=-t,a=-1),t+=n-r,t=Math.trunc(t/e)*e,t+=r,t<0?r*a:t*a},Zr={x:1,y:0,axis:"x",distance:function(t,e,r,n){return(r?t.xo:t.x)-(n?e.xo:e.x)},interpolate:function(t,e,r,n){let a,i,s,l,E,T,h;if(!n||n===this){if(a=t.xo-e.xo,i=t.xo-r.xo,E=e.x-e.xo,T=r.x-r.xo,s=Math.abs(a),l=Math.abs(i),h=s+l,h===0){t.x=t.xo+(E+T)/2;return}t.x=t.xo+(E*l+T*s)/h;return}if(a=n.distance(t,e,!0,!0),i=n.distance(t,r,!0,!0),E=n.distance(e,e,!1,!0),T=n.distance(r,r,!1,!0),s=Math.abs(a),l=Math.abs(i),h=s+l,h===0){Zr.setRelative(t,t,(E+T)/2,n,!0);return}Zr.setRelative(t,t,(E*l+T*s)/h,n,!0)},normalSlope:Number.NEGATIVE_INFINITY,setRelative:function(t,e,r,n,a){if(!n||n===this){t.x=(a?e.xo:e.x)+r;return}const i=a?e.xo:e.x,s=a?e.yo:e.y,l=i+r*n.x,E=s+r*n.y;t.x=l+(t.y-E)/n.normalSlope},slope:0,touch:function(t){t.xTouched=!0},touched:function(t){return t.xTouched},untouch:function(t){t.xTouched=!1}},on={x:0,y:1,axis:"y",distance:function(t,e,r,n){return(r?t.yo:t.y)-(n?e.yo:e.y)},interpolate:function(t,e,r,n){let a,i,s,l,E,T,h;if(!n||n===this){if(a=t.yo-e.yo,i=t.yo-r.yo,E=e.y-e.yo,T=r.y-r.yo,s=Math.abs(a),l=Math.abs(i),h=s+l,h===0){t.y=t.yo+(E+T)/2;return}t.y=t.yo+(E*l+T*s)/h;return}if(a=n.distance(t,e,!0,!0),i=n.distance(t,r,!0,!0),E=n.distance(e,e,!1,!0),T=n.distance(r,r,!1,!0),s=Math.abs(a),l=Math.abs(i),h=s+l,h===0){on.setRelative(t,t,(E+T)/2,n,!0);return}on.setRelative(t,t,(E*l+T*s)/h,n,!0)},normalSlope:0,setRelative:function(t,e,r,n,a){if(!n||n===this){t.y=(a?e.yo:e.y)+r;return}const i=a?e.xo:e.x,s=a?e.yo:e.y,l=i+r*n.x,E=s+r*n.y;t.y=E+n.normalSlope*(t.x-l)},slope:Number.POSITIVE_INFINITY,touch:function(t){t.yTouched=!0},touched:function(t){return t.yTouched},untouch:function(t){t.yTouched=!1}};Object.freeze(Zr);Object.freeze(on);function xi(t,e){this.x=t,this.y=e,this.axis=void 0,this.slope=e/t,this.normalSlope=-t/e,Object.freeze(this)}xi.prototype.distance=function(t,e,r,n){return this.x*Zr.distance(t,e,r,n)+this.y*on.distance(t,e,r,n)};xi.prototype.interpolate=function(t,e,r,n){let a,i,s,l,E,T,h;if(s=n.distance(t,e,!0,!0),l=n.distance(t,r,!0,!0),a=n.distance(e,e,!1,!0),i=n.distance(r,r,!1,!0),E=Math.abs(s),T=Math.abs(l),h=E+T,h===0){this.setRelative(t,t,(a+i)/2,n,!0);return}this.setRelative(t,t,(a*T+i*E)/h,n,!0)};xi.prototype.setRelative=function(t,e,r,n,a){n=n||this;const i=a?e.xo:e.x,s=a?e.yo:e.y,l=i+r*n.x,E=s+r*n.y,T=n.normalSlope,h=this.slope,u=t.x,C=t.y;t.x=(h*u-T*l+E-C)/(h-T),t.y=h*(t.x-u)+C};xi.prototype.touch=function(t){t.xTouched=!0,t.yTouched=!0};function Ei(t,e){const r=Math.sqrt(t*t+e*e);return t/=r,e/=r,t===1&&e===0?Zr:t===0&&e===1?on:new xi(t,e)}function An(t,e,r,n){this.x=this.xo=Math.round(t*64)/64,this.y=this.yo=Math.round(e*64)/64,this.lastPointOfContour=r,this.onCurve=n,this.prevPointOnContour=void 0,this.nextPointOnContour=void 0,this.xTouched=!1,this.yTouched=!1,Object.preventExtensions(this)}An.prototype.nextTouched=function(t){let e=this.nextPointOnContour;for(;!t.touched(e)&&e!==this;)e=e.nextPointOnContour;return e};An.prototype.prevTouched=function(t){let e=this.prevPointOnContour;for(;!t.touched(e)&&e!==this;)e=e.prevPointOnContour;return e};var Xa=Object.freeze(new An(0,0)),ST={cvCutIn:17/16,deltaBase:9,deltaShift:.125,loop:1,minDis:1,autoFlip:!0};function Rn(t,e){switch(this.env=t,this.stack=[],this.prog=e,t){case"glyf":this.zp0=this.zp1=this.zp2=1,this.rp0=this.rp1=this.rp2=0;case"prep":this.fv=this.pv=this.dpv=Zr,this.round=_l}}Kl.prototype.exec=function(t,e){if(typeof e!="number")throw new Error("Point size is not a number!");if(this._errorState>2)return;const r=this.font;let n=this._prepState;if(!n||n.ppem!==e){let a=this._fpgmState;if(!a){Rn.prototype=ST,a=this._fpgmState=new Rn("fpgm",r.tables.fpgm),a.funcs=[],a.font=r;try{_n(a)}catch(s){console.log("Hinting error in FPGM:"+s),this._errorState=3;return}}Rn.prototype=a,n=this._prepState=new Rn("prep",r.tables.prep),n.ppem=e;const i=r.variation&&r.variation.process.getCvarTransform()||r.tables.cvt;if(i){const s=n.cvt=new Array(i.length),l=e/r.unitsPerEm;for(let E=0;E<i.length;E++)s[E]=i[E]*l}else n.cvt=[];try{_n(n)}catch(s){this._errorState<2&&console.log("Hinting error in PREP:"+s),this._errorState=2}}if(!(this._errorState>1))try{return kl(t,n)}catch(a){this._errorState<1&&(console.log("Hinting error:"+a),console.log("Note: further hinting errors are silenced")),this._errorState=1;return}};kl=function(t,e){const r=e.ppem/e.font.unitsPerEm,n=r;let a=t.components,i,s,l;if(Rn.prototype=e,!a)l=new Rn("glyf",t.instructions),M0(t,l,r,n),s=l.gZone;else{const E=e.font;s=[],i=[];for(let T=0;T<a.length;T++){const h=a[T],u=E.glyphs.get(h.glyphIndex);l=new Rn("glyf",u.instructions),M0(u,l,r,n);const C=Math.round(h.dx*r),g=Math.round(h.dy*n),H=l.gZone,F=l.contours;for(let j=0;j<H.length;j++){const Q=H[j];Q.xTouched=Q.yTouched=!1,Q.xo=Q.x=Q.x+C,Q.yo=Q.y=Q.y+g}const K=s.length;s.push.apply(s,H);for(let j=0;j<F.length;j++)i.push(F[j]+K)}t.instructions&&!l.inhibitGridFit&&(l=new Rn("glyf",t.instructions),l.gZone=l.z0=l.z1=l.z2=s,l.contours=i,s.push(new An(0,0),new An(Math.round(t.advanceWidth*r),0)),_n(l),s.length-=2)}return s};M0=function(t,e,r,n){const a=t.points||[],i=a.length,s=e.gZone=e.z0=e.z1=e.z2=[],l=e.contours=[];let E;for(let u=0;u<i;u++)E=a[u],s[u]=new An(E.x*r,E.y*n,E.lastPointOfContour,E.onCurve);let T,h;for(let u=0;u<i;u++)E=s[u],T||(T=E,l.push(u)),E.lastPointOfContour?(E.nextPointOnContour=T,T.prevPointOnContour=E,T=void 0):(h=s[u+1],E.nextPointOnContour=h,h.prevPointOnContour=E);e.inhibitGridFit||(s.push(new An(0,0),new An(Math.round(t.advanceWidth*r),0)),_n(e),s.length-=2)};_n=function(t){let e=t.prog;if(!e)return;const r=e.length;let n;for(t.ip=0;t.ip<r;t.ip++){if(n=Wl[e[t.ip]],!n)throw new Error("unknown instruction: 0x"+Number(e[t.ip]).toString(16));n(t)}};function No(t){const e=t.tZone=new Array(t.gZone.length);for(let r=0;r<e.length;r++)e[r]=new An(0,0)}function zl(t,e){const r=t.prog;let n=t.ip,a=1,i;do if(i=r[++n],i===88)a++;else if(i===89)a--;else if(i===64)n+=r[n+1]+1;else if(i===65)n+=2*r[n+1]+1;else if(i>=176&&i<=183)n+=i-176+1;else if(i>=184&&i<=191)n+=(i-184+1)*2;else if(e&&a===1&&i===27)break;while(a>0);t.ip=n}function cA(t,e){e.fv=e.pv=e.dpv=t}function hA(t,e){e.pv=e.dpv=t}function LA(t,e){e.fv=t}function TA(t,e){const r=e.stack,n=r.pop(),a=r.pop(),i=e.z2[n],s=e.z1[a];let l,E;t?(l=i.y-s.y,E=s.x-i.x):(l=s.x-i.x,E=s.y-i.y),e.pv=e.dpv=Ei(l,E)}function dA(t,e){const r=e.stack,n=r.pop(),a=r.pop(),i=e.z2[n],s=e.z1[a];let l,E;t?(l=i.y-s.y,E=s.x-i.x):(l=s.x-i.x,E=s.y-i.y),e.fv=Ei(l,E)}function gT(t){const e=t.stack,r=e.pop(),n=e.pop();t.pv=t.dpv=Ei(n,r)}function CT(t){const e=t.stack,r=e.pop(),n=e.pop();t.fv=Ei(n,r)}function RT(t){const e=t.stack,r=t.pv;e.push(r.x*16384),e.push(r.y*16384)}function yT(t){const e=t.stack,r=t.fv;e.push(r.x*16384),e.push(r.y*16384)}function mT(t){t.fv=t.pv}function fT(t){const e=t.stack,r=e.pop(),n=e.pop(),a=e.pop(),i=e.pop(),s=e.pop(),l=t.z0,E=t.z1,T=l[r],h=l[n],u=E[a],C=E[i],g=t.z2[s],H=T.x,F=T.y,K=h.x,j=h.y,Q=u.x,te=u.y,se=C.x,Ie=C.y,le=(H-K)*(te-Ie)-(F-j)*(Q-se),ue=H*j-F*K,ve=Q*Ie-te*se;g.x=(ue*(Q-se)-ve*(H-K))/le,g.y=(ue*(te-Ie)-ve*(F-j))/le}function NT(t){t.rp0=t.stack.pop()}function DT(t){t.rp1=t.stack.pop()}function OT(t){t.rp2=t.stack.pop()}function BT(t){const e=t.stack.pop();switch(t.zp0=e,e){case 0:t.tZone||No(t),t.z0=t.tZone;break;case 1:t.z0=t.gZone;break;default:throw new Error("Invalid zone pointer")}}function HT(t){const e=t.stack.pop();switch(t.zp1=e,e){case 0:t.tZone||No(t),t.z1=t.tZone;break;case 1:t.z1=t.gZone;break;default:throw new Error("Invalid zone pointer")}}function FT(t){const e=t.stack.pop();switch(t.zp2=e,e){case 0:t.tZone||No(t),t.z2=t.tZone;break;case 1:t.z2=t.gZone;break;default:throw new Error("Invalid zone pointer")}}function MT(t){const e=t.stack.pop();switch(t.zp0=t.zp1=t.zp2=e,e){case 0:t.tZone||No(t),t.z0=t.z1=t.z2=t.tZone;break;case 1:t.z0=t.z1=t.z2=t.gZone;break;default:throw new Error("Invalid zone pointer")}}function GT(t){t.loop=t.stack.pop()}function bT(t){t.round=_l}function PT(t){t.round=IT}function vT(t){const e=t.stack.pop();t.minDis=e/64}function UT(t){zl(t,!1)}function wT(t){const e=t.stack.pop();t.ip+=e-1}function YT(t){const e=t.stack.pop();t.cvCutIn=e/64}function WT(t){const e=t.stack;e.push(e[e.length-1])}function jo(t){t.stack.pop()}function kT(t){t.stack.length=0}function KT(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(r),e.push(n)}function _T(t){const e=t.stack;e.push(e.length)}function VT(t){const e=t.stack,r=e.pop(),n=e.pop(),a=t.ip,i=t.prog;t.prog=t.funcs[r];for(let s=0;s<n;s++)_n(t);t.ip=a,t.prog=i}function zT(t){const e=t.stack.pop(),r=t.ip,n=t.prog;t.prog=t.funcs[e],_n(t),t.ip=r,t.prog=n}function JT(t){const e=t.stack,r=e.pop();e.push(e[e.length-r])}function ZT(t){const e=t.stack,r=e.pop();e.push(e.splice(e.length-r,1)[0])}function jT(t){if(t.env!=="fpgm")throw new Error("FDEF not allowed here");const e=t.stack,r=t.prog;let n=t.ip;const a=e.pop(),i=n;for(;r[++n]!==45;);t.ip=n,t.funcs[a]=r.slice(i+1,n)}function IA(t,e){const r=e.stack.pop(),n=e.z0[r],a=e.fv,i=e.pv;let s=i.distance(n,Xa);t&&(s=e.round(s)),a.setRelative(n,Xa,s,i),a.touch(n),e.rp0=e.rp1=r}function uA(t,e){const r=e.z2,n=r.length-2;let a,i,s;for(let l=0;l<n;l++)a=r[l],!t.touched(a)&&(i=a.prevTouched(t),i!==a&&(s=a.nextTouched(t),i===s&&t.setRelative(a,a,t.distance(i,i,!1,!0),t,!0),t.interpolate(a,i,s,t)))}function pA(t,e){const r=e.stack,n=t?e.rp1:e.rp2,a=(t?e.z0:e.z1)[n],i=e.fv,s=e.pv;let l=e.loop;const E=e.z2;for(;l--;){const T=r.pop(),h=E[T],u=s.distance(a,a,!1,!0);i.setRelative(h,h,u,s),i.touch(h)}e.loop=1}function SA(t,e){const r=e.stack,n=t?e.rp1:e.rp2,a=(t?e.z0:e.z1)[n],i=e.fv,s=e.pv,l=r.pop(),E=e.z2[e.contours[l]];let T=E;const h=s.distance(a,a,!1,!0);do T!==a&&i.setRelative(T,T,h,s),T=T.nextPointOnContour;while(T!==E)}function gA(t,e){const r=e.stack,n=t?e.rp1:e.rp2,a=(t?e.z0:e.z1)[n],i=e.fv,s=e.pv,l=r.pop();let E;switch(l){case 0:E=e.tZone;break;case 1:E=e.gZone;break;default:throw new Error("Invalid zone")}let T;const h=s.distance(a,a,!1,!0),u=E.length-2;for(let C=0;C<u;C++)T=E[C],i.setRelative(T,T,h,s)}function XT(t){const e=t.stack;let r=t.loop;const n=t.fv,a=e.pop()/64,i=t.z2;for(;r--;){const s=e.pop(),l=i[s];n.setRelative(l,l,a),n.touch(l)}t.loop=1}function qT(t){const e=t.stack,r=t.rp1,n=t.rp2;let a=t.loop;const i=t.z0[r],s=t.z1[n],l=t.fv,E=t.dpv,T=t.z2;for(;a--;){const h=e.pop(),u=T[h];l.interpolate(u,i,s,E),l.touch(u)}t.loop=1}function CA(t,e){const r=e.stack,n=r.pop()/64,a=r.pop(),i=e.z1[a],s=e.z0[e.rp0],l=e.fv,E=e.pv;l.setRelative(i,s,n,E),l.touch(i),e.rp1=e.rp0,e.rp2=a,t&&(e.rp0=a)}function QT(t){const e=t.stack,r=t.rp0,n=t.z0[r];let a=t.loop;const i=t.fv,s=t.pv,l=t.z1;for(;a--;){const E=e.pop(),T=l[E];i.setRelative(T,n,0,s),i.touch(T)}t.loop=1}function $T(t){t.round=dT}function RA(t,e){const r=e.stack,n=r.pop(),a=r.pop(),i=e.z0[a],s=e.fv,l=e.pv;let E=e.cvt[n],T=l.distance(i,Xa);t&&(Math.abs(T-E)<e.cvCutIn&&(T=E),T=e.round(T)),s.setRelative(i,Xa,T,l),e.zp0===0&&(i.xo=i.x,i.yo=i.y),s.touch(i),e.rp0=e.rp1=a}function ed(t){const e=t.prog;let r=t.ip;const n=t.stack,a=e[++r];for(let i=0;i<a;i++)n.push(e[++r]);t.ip=r}function td(t){let e=t.ip;const r=t.prog,n=t.stack,a=r[++e];for(let i=0;i<a;i++){let s=r[++e]<<8|r[++e];s&32768&&(s=-((s^65535)+1)),n.push(s)}t.ip=e}function rd(t){const e=t.stack;let r=t.store;r||(r=t.store=[]);const n=e.pop(),a=e.pop();r[a]=n}function nd(t){const e=t.stack,r=t.store,n=e.pop(),a=r&&r[n]||0;e.push(a)}function ad(t){const e=t.stack,r=e.pop(),n=e.pop();t.cvt[n]=r/64}function id(t){const e=t.stack,r=e.pop();e.push(t.cvt[r]*64)}function yA(t,e){const r=e.stack,n=r.pop(),a=e.z2[n];r.push(e.dpv.distance(a,Xa,t,!1)*64)}function mA(t,e){const r=e.stack,n=r.pop(),a=r.pop(),i=e.z1[n],s=e.z0[a],l=e.dpv.distance(s,i,t,t);e.stack.push(Math.round(l*64))}function od(t){t.stack.push(t.ppem)}function sd(t){t.autoFlip=!0}function Ad(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(n<r?1:0)}function ld(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(n<=r?1:0)}function xd(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(n>r?1:0)}function Ed(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(n>=r?1:0)}function cd(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(r===n?1:0)}function hd(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(r!==n?1:0)}function Ld(t){const e=t.stack,r=e.pop();e.push(Math.trunc(r)&1?1:0)}function Td(t){const e=t.stack,r=e.pop();e.push(Math.trunc(r)&1?0:1)}function dd(t){t.stack.pop()||zl(t,!0)}function Id(t){}function ud(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(r&&n?1:0)}function pd(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(r||n?1:0)}function Sd(t){const e=t.stack,r=e.pop();e.push(r?0:1)}function Xo(t,e){const r=e.stack,n=r.pop(),a=e.fv,i=e.pv,s=e.ppem,l=e.deltaBase+(t-1)*16,E=e.deltaShift,T=e.z0;for(let h=0;h<n;h++){const u=r.pop(),C=r.pop();if(l+((C&240)>>4)!==s)continue;let H=(C&15)-8;H>=0&&H++;const F=T[u];a.setRelative(F,F,H*E,i)}}function gd(t){const r=t.stack.pop();t.deltaBase=r}function Cd(t){const r=t.stack.pop();t.deltaShift=Math.pow(.5,r)}function Rd(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(n+r)}function yd(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(n-r)}function md(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(n*64/r)}function fd(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(n*r/64)}function Nd(t){const e=t.stack,r=e.pop();e.push(Math.abs(r))}function Dd(t){const e=t.stack;let r=e.pop();e.push(-r)}function Od(t){const e=t.stack,r=e.pop();e.push(Math.floor(r/64)*64)}function Bd(t){const e=t.stack,r=e.pop();e.push(Math.ceil(r/64)*64)}function Mi(t,e){const r=e.stack,n=r.pop();r.push(e.round(n/64)*64)}function Hd(t){const e=t.stack,r=e.pop(),n=e.pop();t.cvt[n]=r*t.ppem/t.font.unitsPerEm}function qo(t,e){const r=e.stack,n=r.pop(),a=e.ppem,i=e.deltaBase+(t-1)*16,s=e.deltaShift;for(let l=0;l<n;l++){const E=r.pop(),T=r.pop();if(i+((T&240)>>4)!==a)continue;let u=(T&15)-8;u>=0&&u++;const C=u*s;e.cvt[E]+=C}}function Fd(t){let e=t.stack.pop();t.round=Vl;let r;switch(e&192){case 0:r=.5;break;case 64:r=1;break;case 128:r=2;break;default:throw new Error("invalid SROUND value")}switch(t.srPeriod=r,e&48){case 0:t.srPhase=0;break;case 16:t.srPhase=.25*r;break;case 32:t.srPhase=.5*r;break;case 48:t.srPhase=.75*r;break;default:throw new Error("invalid SROUND value")}e&=15,e===0?t.srThreshold=0:t.srThreshold=(e/8-.5)*r}function Md(t){let e=t.stack.pop();t.round=Vl;let r;switch(e&192){case 0:r=Math.sqrt(2)/2;break;case 64:r=Math.sqrt(2);break;case 128:r=2*Math.sqrt(2);break;default:throw new Error("invalid S45ROUND value")}switch(t.srPeriod=r,e&48){case 0:t.srPhase=0;break;case 16:t.srPhase=.25*r;break;case 32:t.srPhase=.5*r;break;case 48:t.srPhase=.75*r;break;default:throw new Error("invalid S45ROUND value")}e&=15,e===0?t.srThreshold=0:t.srThreshold=(e/8-.5)*r}function Gd(t){t.round=TT}function bd(t){t.round=uT}function Pd(t){t.round=pT}function vd(t){t.stack.pop()}function fA(t,e){const r=e.stack,n=r.pop(),a=r.pop(),i=e.z2[n],s=e.z1[a];let l,E;t?(l=i.y-s.y,E=s.x-i.x):(l=s.x-i.x,E=s.y-i.y),e.dpv=Ei(l,E)}function Ud(t){const e=t.stack,r=e.pop();let n=0;r&1&&(n=35),r&32&&(n|=4096),e.push(n)}function wd(t){const e=t.stack,r=e.pop(),n=e.pop(),a=e.pop();e.push(n),e.push(r),e.push(a)}function Yd(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(Math.max(n,r))}function Wd(t){const e=t.stack,r=e.pop(),n=e.pop();e.push(Math.min(n,r))}function kd(t){t.stack.pop()}function Kd(t){const e=t.stack.pop();let r=t.stack.pop();switch(e){case 1:t.inhibitGridFit=!!r;return;case 2:t.ignoreCvt=!!r;return;default:throw new Error("invalid INSTCTRL[] selector")}}function un(t,e){const r=e.stack,n=e.prog;let a=e.ip;for(let i=0;i<t;i++)r.push(n[++a]);e.ip=a}function pn(t,e){let r=e.ip;const n=e.prog,a=e.stack;for(let i=0;i<t;i++){let s=n[++r]<<8|n[++r];s&32768&&(s=-((s^65535)+1)),a.push(s)}e.ip=r}function Ce(t,e,r,n,a,i){const s=i.stack,l=t&&s.pop(),E=s.pop(),T=i.rp0,h=i.z0[T],u=i.z1[E],C=i.minDis,g=i.fv,H=i.dpv;let F,K,j;F=H.distance(u,h,!0,!0),K=F>=0?1:-1,F=Math.abs(F),t&&(j=i.cvt[l],n&&Math.abs(F-j)<i.cvCutIn&&(F=j)),r&&F<C&&(F=C),n&&(F=i.round(F)),g.setRelative(u,h,K*F,H),g.touch(u),i.rp1=i.rp0,i.rp2=E,e&&(i.rp0=E)}Wl=[cA.bind(void 0,on),cA.bind(void 0,Zr),hA.bind(void 0,on),hA.bind(void 0,Zr),LA.bind(void 0,on),LA.bind(void 0,Zr),TA.bind(void 0,0),TA.bind(void 0,1),dA.bind(void 0,0),dA.bind(void 0,1),gT,CT,RT,yT,mT,fT,NT,DT,OT,BT,HT,FT,MT,GT,bT,PT,vT,UT,wT,YT,void 0,void 0,WT,jo,kT,KT,_T,JT,ZT,void 0,void 0,void 0,VT,zT,jT,void 0,IA.bind(void 0,0),IA.bind(void 0,1),uA.bind(void 0,on),uA.bind(void 0,Zr),pA.bind(void 0,0),pA.bind(void 0,1),SA.bind(void 0,0),SA.bind(void 0,1),gA.bind(void 0,0),gA.bind(void 0,1),XT,qT,CA.bind(void 0,0),CA.bind(void 0,1),QT,$T,RA.bind(void 0,0),RA.bind(void 0,1),ed,td,rd,nd,ad,id,yA.bind(void 0,0),yA.bind(void 0,1),void 0,mA.bind(void 0,0),mA.bind(void 0,1),od,void 0,sd,void 0,void 0,Ad,ld,xd,Ed,cd,hd,Ld,Td,dd,Id,ud,pd,Sd,Xo.bind(void 0,1),gd,Cd,Rd,yd,md,fd,Nd,Dd,Od,Bd,Mi.bind(void 0,0),Mi.bind(void 0,1),Mi.bind(void 0,2),Mi.bind(void 0,3),void 0,void 0,void 0,void 0,Hd,Xo.bind(void 0,2),Xo.bind(void 0,3),qo.bind(void 0,1),qo.bind(void 0,2),qo.bind(void 0,3),Fd,Md,void 0,void 0,Gd,void 0,bd,Pd,jo,jo,void 0,void 0,void 0,void 0,void 0,vd,fA.bind(void 0,0),fA.bind(void 0,1),Ud,void 0,wd,Yd,Wd,kd,Kd,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,void 0,un.bind(void 0,1),un.bind(void 0,2),un.bind(void 0,3),un.bind(void 0,4),un.bind(void 0,5),un.bind(void 0,6),un.bind(void 0,7),un.bind(void 0,8),pn.bind(void 0,1),pn.bind(void 0,2),pn.bind(void 0,3),pn.bind(void 0,4),pn.bind(void 0,5),pn.bind(void 0,6),pn.bind(void 0,7),pn.bind(void 0,8),Ce.bind(void 0,0,0,0,0,0),Ce.bind(void 0,0,0,0,0,1),Ce.bind(void 0,0,0,0,0,2),Ce.bind(void 0,0,0,0,0,3),Ce.bind(void 0,0,0,0,1,0),Ce.bind(void 0,0,0,0,1,1),Ce.bind(void 0,0,0,0,1,2),Ce.bind(void 0,0,0,0,1,3),Ce.bind(void 0,0,0,1,0,0),Ce.bind(void 0,0,0,1,0,1),Ce.bind(void 0,0,0,1,0,2),Ce.bind(void 0,0,0,1,0,3),Ce.bind(void 0,0,0,1,1,0),Ce.bind(void 0,0,0,1,1,1),Ce.bind(void 0,0,0,1,1,2),Ce.bind(void 0,0,0,1,1,3),Ce.bind(void 0,0,1,0,0,0),Ce.bind(void 0,0,1,0,0,1),Ce.bind(void 0,0,1,0,0,2),Ce.bind(void 0,0,1,0,0,3),Ce.bind(void 0,0,1,0,1,0),Ce.bind(void 0,0,1,0,1,1),Ce.bind(void 0,0,1,0,1,2),Ce.bind(void 0,0,1,0,1,3),Ce.bind(void 0,0,1,1,0,0),Ce.bind(void 0,0,1,1,0,1),Ce.bind(void 0,0,1,1,0,2),Ce.bind(void 0,0,1,1,0,3),Ce.bind(void 0,0,1,1,1,0),Ce.bind(void 0,0,1,1,1,1),Ce.bind(void 0,0,1,1,1,2),Ce.bind(void 0,0,1,1,1,3),Ce.bind(void 0,1,0,0,0,0),Ce.bind(void 0,1,0,0,0,1),Ce.bind(void 0,1,0,0,0,2),Ce.bind(void 0,1,0,0,0,3),Ce.bind(void 0,1,0,0,1,0),Ce.bind(void 0,1,0,0,1,1),Ce.bind(void 0,1,0,0,1,2),Ce.bind(void 0,1,0,0,1,3),Ce.bind(void 0,1,0,1,0,0),Ce.bind(void 0,1,0,1,0,1),Ce.bind(void 0,1,0,1,0,2),Ce.bind(void 0,1,0,1,0,3),Ce.bind(void 0,1,0,1,1,0),Ce.bind(void 0,1,0,1,1,1),Ce.bind(void 0,1,0,1,1,2),Ce.bind(void 0,1,0,1,1,3),Ce.bind(void 0,1,1,0,0,0),Ce.bind(void 0,1,1,0,0,1),Ce.bind(void 0,1,1,0,0,2),Ce.bind(void 0,1,1,0,0,3),Ce.bind(void 0,1,1,0,1,0),Ce.bind(void 0,1,1,0,1,1),Ce.bind(void 0,1,1,0,1,2),Ce.bind(void 0,1,1,0,1,3),Ce.bind(void 0,1,1,1,0,0),Ce.bind(void 0,1,1,1,0,1),Ce.bind(void 0,1,1,1,0,2),Ce.bind(void 0,1,1,1,0,3),Ce.bind(void 0,1,1,1,1,0),Ce.bind(void 0,1,1,1,1,1),Ce.bind(void 0,1,1,1,1,2),Ce.bind(void 0,1,1,1,1,3)];var _d=Kl;function Oa(t){this.char=t,this.state={},this.activeState=null}function Ts(t,e,r){this.contextName=r,this.startIndex=t,this.endOffset=e}function Vd(t,e,r){this.contextName=t,this.openRange=null,this.ranges=[],this.checkStart=e,this.checkEnd=r}function cr(t,e){this.context=t,this.index=e,this.length=t.length,this.current=t[e],this.backtrack=t.slice(0,e),this.lookahead=t.slice(e+1)}function Do(t){this.eventId=t,this.subscribers=[]}function zd(t){const e=["start","end","next","newToken","contextStart","contextEnd","insertToken","removeToken","removeRange","replaceToken","replaceRange","composeRUD","updateContextsRanges"];for(let n=0;n<e.length;n++){const a=e[n];Object.defineProperty(this.events,a,{value:new Do(a)})}if(t)for(let n=0;n<e.length;n++){const a=e[n],i=t[a];typeof i=="function"&&this.events[a].subscribe(i)}const r=["insertToken","removeToken","removeRange","replaceToken","replaceRange","composeRUD"];for(let n=0;n<r.length;n++){const a=r[n];this.events[a].subscribe(this.updateContextsRanges)}}function Bt(t){this.tokens=[],this.registeredContexts={},this.contextCheckers=[],this.events={},this.registeredModifiers=[],zd.call(this,t)}Oa.prototype.setState=function(t,e){return this.state[t]=e,this.activeState={key:t,value:this.state[t]},this.activeState};Oa.prototype.getState=function(t){return this.state[t]||null};Bt.prototype.inboundIndex=function(t){return t>=0&&t<this.tokens.length};Bt.prototype.composeRUD=function(t){const r=t.map(a=>this[a[0]].apply(this,a.slice(1).concat(!0))),n=a=>typeof a=="object"&&Object.prototype.hasOwnProperty.call(a,"FAIL");if(r.every(n))return{FAIL:"composeRUD: one or more operations hasn't completed successfully",report:r.filter(n)};this.dispatch("composeRUD",[r.filter(a=>!n(a))])};Bt.prototype.replaceRange=function(t,e,r,n){e=e!==null?e:this.tokens.length;const a=r.every(i=>i instanceof Oa);if(!isNaN(t)&&this.inboundIndex(t)&&a){const i=this.tokens.splice.apply(this.tokens,[t,e].concat(r));return n||this.dispatch("replaceToken",[t,e,r]),[i,r]}else return{FAIL:"replaceRange: invalid tokens or startIndex."}};Bt.prototype.replaceToken=function(t,e,r){if(!isNaN(t)&&this.inboundIndex(t)&&e instanceof Oa){const n=this.tokens.splice(t,1,e);return r||this.dispatch("replaceToken",[t,e]),[n[0],e]}else return{FAIL:"replaceToken: invalid token or index."}};Bt.prototype.removeRange=function(t,e,r){e=isNaN(e)?this.tokens.length:e;const n=this.tokens.splice(t,e);return r||this.dispatch("removeRange",[n,t,e]),n};Bt.prototype.removeToken=function(t,e){if(!isNaN(t)&&this.inboundIndex(t)){const r=this.tokens.splice(t,1);return e||this.dispatch("removeToken",[r,t]),r}else return{FAIL:"removeToken: invalid token index."}};Bt.prototype.insertToken=function(t,e,r){return t.every(a=>a instanceof Oa)?(this.tokens.splice.apply(this.tokens,[e,0].concat(t)),r||this.dispatch("insertToken",[t,e]),t):{FAIL:"insertToken: invalid token(s)."}};Bt.prototype.registerModifier=function(t,e,r){this.events.newToken.subscribe(function(n,a){const i=[n,a],s=e===null||e.apply(this,i)===!0,l=[n,a];if(s){let E=r.apply(this,l);n.setState(t,E)}}),this.registeredModifiers.push(t)};Do.prototype.subscribe=function(t){return typeof t=="function"?this.subscribers.push(t)-1:{FAIL:`invalid '${this.eventId}' event handler`}};Do.prototype.unsubscribe=function(t){this.subscribers.splice(t,1)};cr.prototype.setCurrentIndex=function(t){this.index=t,this.current=this.context[t],this.backtrack=this.context.slice(0,t),this.lookahead=this.context.slice(t+1)};cr.prototype.get=function(t){switch(!0){case t===0:return this.current;case(t<0&&Math.abs(t)<=this.backtrack.length):return this.backtrack.slice(t)[0];case(t>0&&t<=this.lookahead.length):return this.lookahead[t-1];default:return null}};Bt.prototype.rangeToText=function(t){if(t instanceof Ts)return this.getRangeTokens(t).map(e=>e.char).join("")};Bt.prototype.getText=function(){return this.tokens.map(t=>t.char).join("")};Bt.prototype.getContext=function(t){let e=this.registeredContexts[t];return e||null};Bt.prototype.on=function(t,e){const r=this.events[t];return r?r.subscribe(e):null};Bt.prototype.dispatch=function(t,e){const r=this.events[t];if(r instanceof Do)for(let n=0;n<r.subscribers.length;n++)r.subscribers[n].apply(this,e||[])};Bt.prototype.registerContextChecker=function(t,e,r){if(this.getContext(t))return{FAIL:`context name '${t}' is already registered.`};if(typeof e!="function")return{FAIL:"missing context start check."};if(typeof r!="function")return{FAIL:"missing context end check."};const n=new Vd(t,e,r);return this.registeredContexts[t]=n,this.contextCheckers.push(n),n};Bt.prototype.getRangeTokens=function(t){const e=t.startIndex+t.endOffset;return[].concat(this.tokens.slice(t.startIndex,e))};Bt.prototype.getContextRanges=function(t){const e=this.getContext(t);return e?e.ranges:{FAIL:`context checker '${t}' is not registered.`}};Bt.prototype.resetContextsRanges=function(){const t=this.registeredContexts;for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e)){const r=t[e];r.ranges=[]}};Bt.prototype.updateContextsRanges=function(){this.resetContextsRanges();const t=this.tokens.map(e=>e.char);for(let e=0;e<t.length;e++){const r=new cr(t,e);this.runContextCheck(r)}this.dispatch("updateContextsRanges",[this.registeredContexts])};Bt.prototype.setEndOffset=function(t,e){const r=this.getContext(e).openRange.startIndex;let n=new Ts(r,t,e);const a=this.getContext(e).ranges;return n.rangeId=`${e}.${a.length}`,a.push(n),this.getContext(e).openRange=null,n};Bt.prototype.runContextCheck=function(t){const e=t.index;for(let r=0;r<this.contextCheckers.length;r++){const n=this.contextCheckers[r];let a=n.contextName,i=this.getContext(a).openRange;if(!i&&n.checkStart(t)&&(i=new Ts(e,null,a),this.getContext(a).openRange=i,this.dispatch("contextStart",[a,e])),i&&n.checkEnd(t)){const s=e-i.startIndex+1,l=this.setEndOffset(s,a);this.dispatch("contextEnd",[a,l])}}};Bt.prototype.tokenize=function(t){this.tokens=[],this.resetContextsRanges();let e=Array.from(t);this.dispatch("start");for(let r=0;r<e.length;r++){const n=e[r],a=new cr(e,r);this.dispatch("next",[a]),this.runContextCheck(a);let i=new Oa(n);this.tokens.push(i),this.dispatch("newToken",[i,a])}return this.dispatch("end",[this.tokens]),this.tokens};var Jd=Bt;function fn(t){return/[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(t)}function Jl(t){return/[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(t)}function On(t){return/[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(t)}function ki(t){return/[\u0E00-\u0E7F]/.test(t)}function Ki(t){return/[A-z]/.test(t)}function Zd(t){return/\s/.test(t)}function gr(t){this.font=t,this.features={}}function Sn(t){this.id=t.id,this.tag=t.tag,this.substitution=t.substitution}function cn(t,e){if(!t)return-1;switch(e.format){case 1:return e.glyphs.indexOf(t);case 2:{let r=e.ranges;for(let n=0;n<r.length;n++){const a=r[n];if(t>=a.start&&t<=a.end){let i=t-a.start;return a.index+i}}break}default:return-1}return-1}function jd(t,e){return cn(t,e.coverage)===-1?null:t+e.deltaGlyphId}function Xd(t,e){let r=cn(t,e.coverage);return r===-1?null:e.substitute[r]}function Qo(t,e){let r=[];for(let n=0;n<t.length;n++){const a=t[n];let i=e.current;i=Array.isArray(i)?i[0]:i;const s=cn(i,a);s!==-1&&r.push(s)}return r.length!==t.length?-1:r}function qd(t,e){const r=e.inputCoverage.length+e.lookaheadCoverage.length+e.backtrackCoverage.length;if(t.context.length<r)return[];let n=Qo(e.inputCoverage,t);if(n===-1)return[];const a=e.inputCoverage.length-1;if(t.lookahead.length<e.lookaheadCoverage.length)return[];let i=t.lookahead.slice(a);for(;i.length&&On(i[0].char);)i.shift();const s=new cr(i,0);let l=Qo(e.lookaheadCoverage,s),E=[].concat(t.backtrack);for(E.reverse();E.length&&On(E[0].char);)E.shift();if(E.length<e.backtrackCoverage.length)return[];const T=new cr(E,0);let h=Qo(e.backtrackCoverage,T);const u=n.length===e.inputCoverage.length&&l.length===e.lookaheadCoverage.length&&h.length===e.backtrackCoverage.length;let C=[];if(u)for(let g=0;g<e.lookupRecords.length;g++){const F=e.lookupRecords[g].lookupListIndex,K=this.getLookupByIndex(F);for(let j=0;j<K.subtables.length;j++){let Q=K.subtables[j],te,se=this.getSubstitutionType(K,Q);if(se==="71"?(se=this.getSubstitutionType(Q,Q.extension),te=this.getLookupMethod(Q,Q.extension),Q=Q.extension):te=this.getLookupMethod(K,Q),se==="12")for(let Ie=0;Ie<n.length;Ie++){const le=t.get(Ie),ue=te(le);ue&&C.push(ue)}else throw new Error(`Substitution type ${se} is not supported in chaining substitution`)}}return C}function Qd(t,e){let r=t.current,n=cn(r,e.coverage);if(n===-1)return null;let a,i=e.ligatureSets[n];for(let s=0;s<i.length;s++){a=i[s];for(let l=0;l<a.components.length;l++){const E=t.lookahead[l],T=a.components[l];if(E!==T)break;if(l===a.components.length-1)return a}}return null}function $d(t,e){let r=t.current;if(cn(r,e.coverage)===-1)return null;for(const a of e.ruleSets)for(const i of a){let s=!0;for(let l=0;l<i.input.length;l++)if(t.lookahead[l]!==i.input[l]){s=!1;break}if(s){let l=[];l.push(r);for(let T=0;T<i.input.length;T++)l.push(i.input[T]);const E=(T,h)=>{const{lookupListIndex:u,sequenceIndex:C}=h,{subtables:g}=this.getLookupByIndex(u);for(const H of g)cn(T[C],H.coverage)!==-1&&(T[C]=H.deltaGlyphId)};for(let T=0;T<i.lookupRecords.length;T++){const h=i.lookupRecords[T];E(l,h)}return l}}return null}function eI(t,e){let r=[];for(let n=0;n<e.coverages.length;n++){const a=e.lookupRecords[n],i=e.coverages[n];let s=t.context[t.index+a.sequenceIndex];if(cn(s,i)===-1)return null;let E=this.font.tables.gsub.lookups[a.lookupListIndex];for(let T=0;T<E.subtables.length;T++){let h=E.subtables[T],u=cn(s,h.coverage);if(u===-1)return null;switch(E.lookupType){case 1:{let C=h.substitute[u];r.push(C);break}case 2:{let C=h.sequences[u];r.push(C);break}}}}return r}function tI(t,e){let r=cn(t,e.coverage);return r===-1?null:e.sequences[r]}gr.prototype.getDefaultScriptFeaturesIndexes=function(){const t=this.font.tables.gsub.scripts;for(let e=0;e<t.length;e++){const r=t[e];if(r.tag==="DFLT")return r.script.defaultLangSys.featureIndexes}return[]};gr.prototype.getScriptFeaturesIndexes=function(t){if(!this.font.tables.gsub)return[];if(!t)return this.getDefaultScriptFeaturesIndexes();const r=this.font.tables.gsub.scripts;for(let n=0;n<r.length;n++){const a=r[n];if(a.tag===t&&a.script.defaultLangSys)return a.script.defaultLangSys.featureIndexes;{let i=a.langSysRecords;if(i)for(let s=0;s<i.length;s++){const l=i[s];if(l.tag===t)return l.langSys.featureIndexes}}}return this.getDefaultScriptFeaturesIndexes()};gr.prototype.mapTagsToFeatures=function(t,e){let r={};for(let n=0;n<t.length;n++){const a=t[n].tag,i=t[n].feature;r[a]=i}this.features[e].tags=r};gr.prototype.getScriptFeatures=function(t){let e=this.features[t];if(Object.prototype.hasOwnProperty.call(this.features,t))return e;const r=this.getScriptFeaturesIndexes(t);if(!r)return null;const n=this.font.tables.gsub;return e=r.map(a=>n.features[a]),this.features[t]=e,this.mapTagsToFeatures(e,t),e};gr.prototype.getSubstitutionType=function(t,e){const r=t.lookupType.toString(),n=e.substFormat.toString();return r+n};gr.prototype.getLookupMethod=function(t,e){let r=this.getSubstitutionType(t,e);switch(r){case"11":return n=>jd.apply(this,[n,e]);case"12":return n=>Xd.apply(this,[n,e]);case"63":return n=>qd.apply(this,[n,e]);case"41":return n=>Qd.apply(this,[n,e]);case"21":return n=>tI.apply(this,[n,e]);case"51":return n=>$d.apply(this,[n,e]);case"53":return n=>eI.apply(this,[n,e]);default:throw new Error(`substitutionType : ${r} lookupType: ${t.lookupType} - substFormat: ${e.substFormat} is not yet supported`)}};gr.prototype.lookupFeature=function(t){let e=t.contextParams,r=e.index;const n=this.getFeature({tag:t.tag,script:t.script});if(!n)return new Error(`font '${(this.font.names.unicode||this.font.names.windows||this.font.names.macintosh).fullName.en}' doesn't support feature '${t.tag}' for script '${t.script}'.`);const a=this.getFeatureLookups(n),i=[].concat(e.context);for(let s=0;s<a.length;s++){const l=a[s],E=this.getLookupSubtables(l);for(let T=0;T<E.length;T++){let h=E[T],u=this.getSubstitutionType(l,h),C;u==="71"?(u=this.getSubstitutionType(h,h.extension),C=this.getLookupMethod(h,h.extension),h=h.extension):C=this.getLookupMethod(l,h);let g;switch(u){case"11":g=C(e.current),g&&i.splice(r,1,new Sn({id:11,tag:t.tag,substitution:g}));break;case"12":g=C(e.current),g&&i.splice(r,1,new Sn({id:12,tag:t.tag,substitution:g}));break;case"63":g=C(e),Array.isArray(g)&&g.length&&i.splice(r,1,new Sn({id:63,tag:t.tag,substitution:g}));break;case"41":g=C(e),g&&i.splice(r,1,new Sn({id:41,tag:t.tag,substitution:g}));break;case"21":g=C(e.current),g&&i.splice(r,1,new Sn({id:21,tag:t.tag,substitution:g}));break;case"51":case"53":g=C(e),Array.isArray(g)&&g.length&&i.splice(r,1,new Sn({id:parseInt(u),tag:t.tag,substitution:g}));break}e=new cr(i,r),!(Array.isArray(g)&&!g.length)&&(g=null)}}return i.length?i:null};gr.prototype.supports=function(t){if(!t.script)return!1;this.getScriptFeatures(t.script);const e=Object.prototype.hasOwnProperty.call(this.features,t.script);if(!t.tag)return e;const r=this.features[t.script].some(n=>n.tag===t.tag);return e&&r};gr.prototype.getLookupSubtables=function(t){return t.subtables||null};gr.prototype.getLookupByIndex=function(t){return this.font.tables.gsub.lookups[t]||null};gr.prototype.getFeatureLookups=function(t){return t.lookupListIndexes.map(this.getLookupByIndex.bind(this))};gr.prototype.getFeature=function(e){if(!this.font)return{FAIL:"No font was found"};Object.prototype.hasOwnProperty.call(this.features,e.script)||this.getScriptFeatures(e.script);const r=this.features[e.script];return r?r.tags[e.tag]?this.features[e.script].tags[e.tag]:null:{FAIL:`No feature for script ${e.script}`}};var rI=gr;function nI(t){const e=t.current,r=t.get(-1);return r===null&&fn(e)||!fn(r)&&fn(e)}function aI(t){const e=t.get(1);return e===null||!fn(e)}var iI={startCheck:nI,endCheck:aI};function oI(t){const e=t.current,r=t.get(-1);return(fn(e)||On(e))&&!fn(r)}function sI(t){const e=t.get(1);switch(!0){case e===null:return!0;case(!fn(e)&&!On(e)):{const r=Zd(e);if(!r)return!0;if(r){let n=!1;if(n=t.lookahead.some(a=>fn(a)||On(a)),!n)return!0}break}default:return!1}}var AI={startCheck:oI,endCheck:sI};function lI(t,e,r){e[r].setState(t.tag,t.substitution)}function xI(t,e,r){e[r].setState(t.tag,t.substitution)}function $o(t,e,r){for(let n=0;n<t.substitution.length;n++){const a=t.substitution[n],i=e[r+n];if(Array.isArray(a)){a.length?i.setState(t.tag,a[0]):i.setState("deleted",!0);continue}i.setState(t.tag,a)}}function EI(t,e,r){let n=e[r];n.setState(t.tag,t.substitution.ligGlyph);const a=t.substitution.components.length;for(let i=0;i<a;i++)n=e[r+i+1],n.setState("deleted",!0)}var NA={11:lI,12:xI,63:$o,41:EI,51:$o,53:$o};function cI(t,e,r){t instanceof Sn&&NA[t.id]&&NA[t.id](t,e,r)}var Qn=cI;function hI(t){let e=[].concat(t.backtrack);for(let r=e.length-1;r>=0;r--){const n=e[r],a=Jl(n),i=On(n);if(!a&&!i)return!0;if(a)return!1}return!1}function LI(t){if(Jl(t.current))return!1;for(let e=0;e<t.lookahead.length;e++){const r=t.lookahead[e];if(!On(r))return!0}return!1}function TI(t){const e="arab",r=this.featuresTags[e],n=this.tokenizer.getRangeTokens(t);if(n.length===1)return;let a=new cr(n.map(s=>s.getState("glyphIndex")),0);const i=new cr(n.map(s=>s.char),0);for(let s=0;s<n.length;s++){const l=n[s];if(On(l.char))continue;a.setCurrentIndex(s),i.setCurrentIndex(s);let E=0;hI(i)&&(E|=1),LI(i)&&(E|=2);let T;switch(E){case 1:T="fina";break;case 2:T="init";break;case 3:T="medi";break}if(r.indexOf(T)===-1)continue;let h=this.query.lookupFeature({tag:T,script:e,contextParams:a});if(h instanceof Error){console.info(h.message);continue}for(let u=0;u<h.length;u++){const C=h[u];C instanceof Sn&&(Qn(C,n,u),a.context[u]=C.substitution)}}}var dI=TI;function DA(t,e){const r=t.map(n=>n.activeState.value);return new cr(r,0)}function II(t){const e="arab";let r=this.tokenizer.getRangeTokens(t),n=DA(r);for(let a=0;a<n.context.length;a++){n.setCurrentIndex(a);let i=this.query.lookupFeature({tag:"rlig",script:e,contextParams:n});if(i.length){for(let s=0;s<i.length;s++){const l=i[s];Qn(l,r,a)}n=DA(r)}}}var uI=II;function pI(t){return t.index===0&&t.context.length>1}function SI(t){return t.index===t.context.length-1}var gI={startCheck:pI,endCheck:SI};function OA(t,e){const r=t.map(n=>n.activeState.value);return new cr(r,0)}function CI(t){const e="delf",r="ccmp";let n=this.tokenizer.getRangeTokens(t),a=OA(n);for(let i=0;i<a.context.length;i++){if(!this.query.getFeature({tag:r,script:e,contextParams:a}))continue;a.setCurrentIndex(i);let s=this.query.lookupFeature({tag:r,script:e,contextParams:a});if(s.length){for(let l=0;l<s.length;l++){const E=s[l];Qn(E,n,i)}a=OA(n)}}}var RI=CI;function yI(t){const e=t.current,r=t.get(-1);return r===null&&Ki(e)||!Ki(r)&&Ki(e)}function mI(t){const e=t.get(1);return e===null||!Ki(e)}var fI={startCheck:yI,endCheck:mI};function BA(t,e){const r=t.map(n=>n.activeState.value);return new cr(r,0)}function NI(t){const e="latn";let r=this.tokenizer.getRangeTokens(t),n=BA(r);for(let a=0;a<n.context.length;a++){n.setCurrentIndex(a);let i=this.query.lookupFeature({tag:"liga",script:e,contextParams:n});if(i.length){for(let s=0;s<i.length;s++){const l=i[s];Qn(l,r,a)}n=BA(r)}}}var DI=NI;function OI(t){const e=t.current,r=t.get(-1);return r===null&&ki(e)||!ki(r)&&ki(e)}function BI(t){const e=t.get(1);return e===null||!ki(e)}var HI={startCheck:OI,endCheck:BI};function HA(t,e){const r=t.map(n=>n.activeState.value);return new cr(r,e||0)}function FI(t){const e="thai";let r=this.tokenizer.getRangeTokens(t),n=HA(r,0);for(let a=0;a<n.context.length;a++){n.setCurrentIndex(a);let i=this.query.lookupFeature({tag:"ccmp",script:e,contextParams:n});if(i.length){for(let s=0;s<i.length;s++){const l=i[s];Qn(l,r,a)}n=HA(r,a)}}}var MI=FI;function FA(t,e){const r=t.map(n=>n.activeState.value);return new cr(r,e||0)}function GI(t){const e="thai";let r=this.tokenizer.getRangeTokens(t),n=FA(r,0);for(let a=0;a<n.context.length;a++){n.setCurrentIndex(a);let i=this.query.lookupFeature({tag:"liga",script:e,contextParams:n});if(i.length){for(let s=0;s<i.length;s++){const l=i[s];Qn(l,r,a)}n=FA(r,a)}}}var bI=GI;function MA(t,e){const r=t.map(n=>n.activeState.value);return new cr(r,e||0)}function PI(t){const e="thai";let r=this.tokenizer.getRangeTokens(t),n=MA(r,0);for(let a=0;a<n.context.length;a++){n.setCurrentIndex(a);let i=this.query.lookupFeature({tag:"rlig",script:e,contextParams:n});if(i.length){for(let s=0;s<i.length;s++){const l=i[s];Qn(l,r,a)}n=MA(r,a)}}}var vI=PI;function G0(t){if(t===null)return!1;const e=t.codePointAt(0);return e>=6155&&e<=6157||e>=65024&&e<=65039||e>=917760&&e<=917999}function UI(t){const e=t.current,r=t.get(1);return r===null&&G0(e)||G0(r)}function wI(t){const e=t.get(1);return e===null||!G0(e)}var YI={startCheck:UI,endCheck:wI};function WI(t){const e=this.query.font,r=this.tokenizer.getRangeTokens(t);if(r[1].setState("deleted",!0),e.tables.cmap&&e.tables.cmap.varSelectorList){const n=r[0].char.codePointAt(0),a=r[1].char.codePointAt(0),i=e.tables.cmap.varSelectorList[a];if(i!==void 0&&i.nonDefaultUVS){const s=i.nonDefaultUVS.uvsMappings;if(s[n]){const l=s[n].glyphID;e.glyphs.glyphs[l]!==void 0&&r[0].setState("glyphIndex",l)}}}}var kI=WI;function fr(t){this.baseDir=t||"ltr",this.tokenizer=new Jd,this.featuresTags={}}fr.prototype.setText=function(t){this.text=t};fr.prototype.contextChecks={ccmpReplacementCheck:gI,latinWordCheck:fI,arabicWordCheck:iI,arabicSentenceCheck:AI,thaiWordCheck:HI,unicodeVariationSequenceCheck:YI};function oa(t){const e=this.contextChecks[`${t}Check`];return this.tokenizer.registerContextChecker(t,e.startCheck,e.endCheck)}function KI(){return oa.call(this,"ccmpReplacement"),oa.call(this,"latinWord"),oa.call(this,"arabicWord"),oa.call(this,"arabicSentence"),oa.call(this,"thaiWord"),oa.call(this,"unicodeVariationSequence"),this.tokenizer.tokenize(this.text)}function _I(){const t=this.tokenizer.getContextRanges("arabicSentence");for(let e=0;e<t.length;e++){const r=t[e];let n=this.tokenizer.getRangeTokens(r);this.tokenizer.replaceRange(r.startIndex,r.endOffset,n.reverse())}}fr.prototype.registerFeatures=function(t,e){const r=e.filter(n=>this.query.supports({script:t,tag:n}));Object.prototype.hasOwnProperty.call(this.featuresTags,t)?this.featuresTags[t]=this.featuresTags[t].concat(r):this.featuresTags[t]=r};fr.prototype.applyFeatures=function(t,e){if(!t)throw new Error("No valid font was provided to apply features");this.query||(this.query=new rI(t));for(let r=0;r<e.length;r++){const n=e[r];this.query.supports({script:n.script})&&this.registerFeatures(n.script,n.tags)}};fr.prototype.registerModifier=function(t,e,r){this.tokenizer.registerModifier(t,e,r)};function ci(){if(this.tokenizer.registeredModifiers.indexOf("glyphIndex")===-1)throw new Error("glyphIndex modifier is required to apply arabic presentation features.")}function VI(){if(!Object.prototype.hasOwnProperty.call(this.featuresTags,"arab"))return;ci.call(this);const e=this.tokenizer.getContextRanges("arabicWord");for(let r=0;r<e.length;r++){const n=e[r];dI.call(this,n)}}function zI(){ci.call(this);const t=this.tokenizer.getContextRanges("ccmpReplacement");for(let e=0;e<t.length;e++){const r=t[e];RI.call(this,r)}}function JI(){if(!this.hasFeatureEnabled("arab","rlig"))return;ci.call(this);const t=this.tokenizer.getContextRanges("arabicWord");for(let e=0;e<t.length;e++){const r=t[e];uI.call(this,r)}}function ZI(){if(!this.hasFeatureEnabled("latn","liga"))return;ci.call(this);const t=this.tokenizer.getContextRanges("latinWord");for(let e=0;e<t.length;e++){const r=t[e];DI.call(this,r)}}function jI(){const t=this.tokenizer.getContextRanges("unicodeVariationSequence");for(let e=0;e<t.length;e++){const r=t[e];kI.call(this,r)}}function XI(){ci.call(this);const t=this.tokenizer.getContextRanges("thaiWord");for(let e=0;e<t.length;e++){const r=t[e];this.hasFeatureEnabled("thai","liga")&&bI.call(this,r),this.hasFeatureEnabled("thai","rlig")&&vI.call(this,r),this.hasFeatureEnabled("thai","ccmp")&&MI.call(this,r)}}fr.prototype.checkContextReady=function(t){return!!this.tokenizer.getContext(t)};fr.prototype.applyFeaturesToContexts=function(){this.checkContextReady("ccmpReplacement")&&zI.call(this),this.checkContextReady("arabicWord")&&(VI.call(this),JI.call(this)),this.checkContextReady("latinWord")&&ZI.call(this),this.checkContextReady("arabicSentence")&&_I.call(this),this.checkContextReady("thaiWord")&&XI.call(this),this.checkContextReady("unicodeVariationSequence")&&jI.call(this)};fr.prototype.hasFeatureEnabled=function(t,e){return(this.featuresTags[t]||[]).indexOf(e)!==-1};fr.prototype.processText=function(t){(!this.text||this.text!==t)&&(this.setText(t),KI.call(this),this.applyFeaturesToContexts())};fr.prototype.getBidiText=function(t){return this.processText(t),this.tokenizer.getText()};fr.prototype.getTextGlyphs=function(t){this.processText(t);let e=[];for(let r=0;r<this.tokenizer.tokens.length;r++){const n=this.tokenizer.tokens[r];if(n.state.deleted)continue;const a=n.activeState.value;e.push(Array.isArray(a)?a[0]:a)}return e};var qI=fr;function e0(t){return{fontFamily:{en:t.familyName||" "},fontSubfamily:{en:t.styleName||" "},fullName:{en:t.fullName||t.familyName+" "+t.styleName},postScriptName:{en:t.postScriptName||(t.familyName+t.styleName).replace(/\s/g,"")},designer:{en:t.designer||" "},designerURL:{en:t.designerURL||" "},manufacturer:{en:t.manufacturer||" "},manufacturerURL:{en:t.manufacturerURL||" "},license:{en:t.license||" "},licenseURL:{en:t.licenseURL||" "},version:{en:t.version||"Version 0.1"},description:{en:t.description||" "},copyright:{en:t.copyright||" "},trademark:{en:t.trademark||" "}}}function Tt(t){if(t=t||{},t.tables=t.tables||{},!t.empty){if(!t.familyName)throw"When creating a new Font object, familyName is required.";if(!t.styleName)throw"When creating a new Font object, styleName is required.";if(!t.unitsPerEm)throw"When creating a new Font object, unitsPerEm is required.";if(!t.ascender)throw"When creating a new Font object, ascender is required.";if(t.descender>0)throw"When creating a new Font object, negative descender value is required.";this.names={},this.names.unicode=e0(t),this.names.macintosh=e0(t),this.names.windows=e0(t),this.unitsPerEm=t.unitsPerEm||1e3,this.ascender=t.ascender,this.descender=t.descender,this.createdTimestamp=t.createdTimestamp,this.italicAngle=t.italicAngle||0,this.weightClass=t.weightClass||0;let e=0;t.fsSelection?e=t.fsSelection:(this.italicAngle<0?e|=this.fsSelectionValues.ITALIC:this.italicAngle>0&&(e|=this.fsSelectionValues.OBLIQUE),this.weightClass>=600&&(e|=this.fsSelectionValues.BOLD),e==0&&(e=this.fsSelectionValues.REGULAR)),(!t.panose||!Array.isArray(t.panose))&&(t.panose=[0,0,0,0,0,0,0,0,0]),this.tables=Object.assign(t.tables,{os2:Object.assign({usWeightClass:t.weightClass||this.usWeightClasses.MEDIUM,usWidthClass:t.widthClass||this.usWidthClasses.MEDIUM,bFamilyType:t.panose[0]||0,bSerifStyle:t.panose[1]||0,bWeight:t.panose[2]||0,bProportion:t.panose[3]||0,bContrast:t.panose[4]||0,bStrokeVariation:t.panose[5]||0,bArmStyle:t.panose[6]||0,bLetterform:t.panose[7]||0,bMidline:t.panose[8]||0,bXHeight:t.panose[9]||0,fsSelection:e},t.tables.os2)})}this.supported=!0,this.glyphs=new Xr.GlyphSet(this,t.glyphs||[]),this.encoding=new al(this),this.position=new zL(this),this.substitution=new $L(this),this.tables=this.tables||{},this.tables=new Proxy(this.tables,{set:(e,r,n)=>(e[r]=n,e.fvar&&(e.gvar||e.cff2)&&!this.variation&&(this.variation=new LT(this)),!0)}),this.palettes=new vl(this),this.layers=new eT(this),this.svgImages=new tT(this),this._push=null,this._hmtxTableData={},Object.defineProperty(this,"hinting",{get:function(){return this._hinting?this._hinting:this.outlinesFormat==="truetype"?this._hinting=new _d(this):null}})}Tt.prototype.hasChar=function(t){return this.encoding.charToGlyphIndex(t)>0};Tt.prototype.charToGlyphIndex=function(t){return this.encoding.charToGlyphIndex(t)};Tt.prototype.charToGlyph=function(t){const e=this.charToGlyphIndex(t);let r=this.glyphs.get(e);return r||(r=this.glyphs.get(0)),r};Tt.prototype.updateFeatures=function(t){return this.defaultRenderOptions.features.map(e=>e.script==="latn"?{script:"latn",tags:e.tags.filter(r=>t[r])}:e)};Tt.prototype.stringToGlyphIndexes=function(t,e){const r=new qI,n=i=>this.charToGlyphIndex(i.char);r.registerModifier("glyphIndex",null,n);let a=e?this.updateFeatures(e.features):this.defaultRenderOptions.features;return r.applyFeatures(this,a),r.getTextGlyphs(t)};Tt.prototype.stringToGlyphs=function(t,e){const r=this.stringToGlyphIndexes(t,e);let n=r.length;const a=new Array(n),i=this.glyphs.get(0);for(let s=0;s<n;s+=1)a[s]=this.glyphs.get(r[s])||i;return a};Tt.prototype.nameToGlyphIndex=function(t){return this.glyphNames.nameToGlyphIndex(t)};Tt.prototype.nameToGlyph=function(t){const e=this.nameToGlyphIndex(t);let r=this.glyphs.get(e);return r||(r=this.glyphs.get(0)),r};Tt.prototype.glyphIndexToName=function(t){return this.glyphNames.glyphIndexToName?this.glyphNames.glyphIndexToName(t):""};Tt.prototype.getKerningValue=function(t,e){t=t.index||t,e=e.index||e;const r=this.position.defaultKerningTables;return r?this.position.getKerningValue(r,t,e):this.kerningPairs[t+","+e]||0};Tt.prototype.defaultRenderOptions={kerning:!0,features:[{script:"arab",tags:["init","medi","fina","rlig"]},{script:"latn",tags:["liga","rlig"]},{script:"thai",tags:["liga","rlig","ccmp"]}],hinting:!1,usePalette:0,drawLayers:!0,drawSVG:!0};Tt.prototype.forEachGlyph=function(t,e,r,n,a,i){e=e!==void 0?e:0,r=r!==void 0?r:0,n=n!==void 0?n:72,a=Object.assign({},this.defaultRenderOptions,a);const s=1/this.unitsPerEm*n,l=this.stringToGlyphs(t,a);let E;if(a.kerning){const T=a.script||this.position.getDefaultScriptName();E=this.position.getKerningTables(T,a.language)}for(let T=0;T<l.length;T+=1){const h=l[T];if(i.call(this,h,e,r,n,a),h.advanceWidth&&(e+=h.advanceWidth*s),a.kerning&&T<l.length-1){const u=E?this.position.getKerningValue(E,h.index,l[T+1].index):this.getKerningValue(h,l[T+1]);e+=u*s}a.letterSpacing?e+=a.letterSpacing*n:a.tracking&&(e+=a.tracking/1e3*n)}return e};Tt.prototype.getPath=function(t,e,r,n,a){a=Object.assign({},this.defaultRenderOptions,a);const i=new Kn;if(i._layers=[],hl(this,i),i.stroke){const s=1/(i.unitsPerEm||1e3)*n;i.strokeWidth*=s}return this.forEachGlyph(t,e,r,n,a,(s,l,E,T)=>{const h=s.getPath(l,E,T,a,this);if(a.drawSVG||a.drawLayers){const u=h._layers;if(u&&u.length){for(let C=0;C<u.length;C++){const g=u[C];i._layers.push(g)}return}}i.extend(h)}),i};Tt.prototype.getPaths=function(t,e,r,n,a){a=Object.assign({},this.defaultRenderOptions,a);const i=[];return this.forEachGlyph(t,e,r,n,a,function(s,l,E,T){const h=s.getPath(l,E,T,a,this);i.push(h)}),i};Tt.prototype.getAdvanceWidth=function(t,e,r){return r=Object.assign({},this.defaultRenderOptions,r),this.forEachGlyph(t,0,0,e,r,function(){})};Tt.prototype.draw=function(t,e,r,n,a,i){this.getPath(e,r,n,a,i).draw(t)};Tt.prototype.drawPoints=function(t,e,r,n,a,i){i=Object.assign({},this.defaultRenderOptions,i),this.forEachGlyph(e,r,n,a,i,function(s,l,E,T){s.drawPoints(t,l,E,T,i,this)})};Tt.prototype.drawMetrics=function(t,e,r,n,a,i){i=Object.assign({},this.defaultRenderOptions,i),this.forEachGlyph(e,r,n,a,i,function(s,l,E,T){s.drawMetrics(t,l,E,T)})};Tt.prototype.getEnglishName=function(t){const e=(this.names.unicode||this.names.macintosh||this.names.windows)[t];if(e)return e.en};Tt.prototype.validate=function(){const t=[],e=this;function r(a,i){a||(console.warn(`[opentype.js] ${i}`),t.push(i))}function n(a){const i=e.getEnglishName(a);r(i&&i.trim().length>0,"No English "+a+" specified.")}if(n("fontFamily"),n("weightName"),n("manufacturer"),n("copyright"),n("version"),r(this.unitsPerEm>0,"No unitsPerEm specified."),this.tables.colr){const a=this.tables.colr.baseGlyphRecords;let i=-1;for(let s=0;s<a.length;s++){const l=a[s].glyphID;if(r(i<a[s].glyphID,`baseGlyphs must be sorted by GlyphID in ascending order, but glyphID ${l} comes after ${i}`),i>a[s].glyphID)break;i=l}}return t};Tt.prototype.toTables=function(){return VL.fontToTable(this)};Tt.prototype.toBuffer=function(){return console.warn("Font.toBuffer is deprecated. Use Font.toArrayBuffer instead."),this.toArrayBuffer()};Tt.prototype.toArrayBuffer=function(){const e=this.toTables().encode(),r=new ArrayBuffer(e.length),n=new Uint8Array(r);for(let a=0;a<e.length;a++)n[a]=e[a];return r};Tt.prototype.download=function(){console.error("DEPRECATED: platform-specific actions are to be implemented on user-side")};Tt.prototype.fsSelectionValues={ITALIC:1,UNDERSCORE:2,NEGATIVE:4,OUTLINED:8,STRIKEOUT:16,BOLD:32,REGULAR:64,USER_TYPO_METRICS:128,WWS:256,OBLIQUE:512};Tt.prototype.macStyleValues={BOLD:1,ITALIC:2,UNDERLINE:4,OUTLINED:8,SHADOW:16,CONDENSED:32,EXTENDED:64};Tt.prototype.usWidthClasses={ULTRA_CONDENSED:1,EXTRA_CONDENSED:2,CONDENSED:3,SEMI_CONDENSED:4,MEDIUM:5,SEMI_EXPANDED:6,EXPANDED:7,EXTRA_EXPANDED:8,ULTRA_EXPANDED:9};Tt.prototype.usWeightClasses={THIN:100,EXTRA_LIGHT:200,LIGHT:300,NORMAL:400,MEDIUM:500,SEMI_BOLD:600,BOLD:700,EXTRA_BOLD:800,BLACK:900};var Zl=Tt;function QI(t,e){const r=new pe.Parser(t,e),n=r.parseUShort(),a=r.parseUShort();n!==1&&console.warn(`Unsupported hvar table version ${n}.${a}`);const i=[n,a],s=r.parsePointer32(function(){return this.parseItemVariationStore()}),l=r.parsePointer32(function(){return this.parseDeltaSetIndexMap()}),E=r.parsePointer32(function(){return this.parseDeltaSetIndexMap()}),T=r.parsePointer32(function(){return this.parseDeltaSetIndexMap()});return{version:i,itemVariationStore:s,advanceWidth:l,lsb:E,rsb:T}}function $I(){console.warn("Writing of hvar tables is not yet supported.")}var eu={make:$I,parse:QI},tu=function(){return{coverage:this.parsePointer(q.coverage),attachPoints:this.parseList(q.pointer(q.uShortList))}},ru=function(){var t=this.parseUShort();if(ye.argument(t===1||t===2||t===3,"Unsupported CaretValue table version."),t===1)return{coordinate:this.parseShort()};if(t===2)return{pointindex:this.parseShort()};if(t===3)return{coordinate:this.parseShort()}},nu=function(){return this.parseList(q.pointer(ru))},au=function(){return{coverage:this.parsePointer(q.coverage),ligGlyphs:this.parseList(q.pointer(nu))}},iu=function(){return this.parseUShort(),this.parseList(q.pointer(q.coverage))};function ou(t,e){e=e||0;const r=new q(t,e),n=r.parseVersion(1);ye.argument(n===1||n===1.2||n===1.3,"Unsupported GDEF table version.");var a={version:n,classDef:r.parsePointer(q.classDef),attachList:r.parsePointer(tu),ligCaretList:r.parsePointer(au),markAttachClassDef:r.parsePointer(q.classDef)};return n>=1.2&&(a.markGlyphSets=r.parsePointer(iu)),a}var su={parse:ou};function Au(t){const e={};t.skip("uShort");const r=t.parseUShort();ye.argument(r===0,"Unsupported kern sub-table version."),t.skip("uShort",2);const n=t.parseUShort();t.skip("uShort",3);for(let a=0;a<n;a+=1){const i=t.parseUShort(),s=t.parseUShort(),l=t.parseShort();e[i+","+s]=l}return e}function lu(t){const e={};t.skip("uShort"),t.parseULong()>1&&console.warn("Only the first kern subtable is supported."),t.skip("uLong");const a=t.parseUShort()&255;if(t.skip("uShort"),a===0){const i=t.parseUShort();t.skip("uShort",3);for(let s=0;s<i;s+=1){const l=t.parseUShort(),E=t.parseUShort(),T=t.parseShort();e[l+","+E]=T}}return e}function xu(t,e){const r=new pe.Parser(t,e),n=r.parseUShort();if(n===0)return Au(r);if(n===1)return lu(r);throw new Error("Unsupported kern table version ("+n+").")}var Eu={parse:xu};function cu(t,e,r,n){const a=new pe.Parser(t,e),i=n?a.parseUShort:a.parseULong,s=[];for(let l=0;l<r+1;l+=1){let E=i.call(a);n&&(E*=2),s.push(E)}return s}var hu={parse:cu};function GA(t,e){const r=[];let n=12;for(let a=0;a<e;a+=1){const i=pe.getTag(t,n),s=pe.getULong(t,n+4),l=pe.getULong(t,n+8),E=pe.getULong(t,n+12);r.push({tag:i,checksum:s,offset:l,length:E,compression:!1}),n+=16}return r}function Lu(t,e){const r=[];let n=44;for(let a=0;a<e;a+=1){const i=pe.getTag(t,n),s=pe.getULong(t,n+4),l=pe.getULong(t,n+8),E=pe.getULong(t,n+12);let T;l<E?T="WOFF":T=!1,r.push({tag:i,offset:s,compression:T,compressedLength:l,length:E}),n+=20}return r}function At(t,e){if(e.compression==="WOFF"){const r=new Uint8Array(t.buffer,e.offset+2,e.compressedLength-2),n=new Uint8Array(e.length);if(J1(r,n),n.byteLength!==e.length)throw new Error("Decompression error: "+e.tag+" decompressed length doesn't match recorded length");return{data:new DataView(n.buffer,0),offset:0}}else return{data:t,offset:e.offset}}function Tu(t,e={}){let r,n;const a=new Zl({empty:!0});t.constructor!==ArrayBuffer&&(t=new Uint8Array(t).buffer);const i=new DataView(t,0);let s,l=[];const E=pe.getTag(i,0);if(E==="\0\0\0"||E==="true"||E==="typ1")a.outlinesFormat="truetype",s=pe.getUShort(i,4),l=GA(i,s);else if(E==="OTTO")a.outlinesFormat="cff",s=pe.getUShort(i,4),l=GA(i,s);else if(E==="wOFF"){const ae=pe.getTag(i,4);if(ae==="\0\0\0")a.outlinesFormat="truetype";else if(ae==="OTTO")a.outlinesFormat="cff";else throw new Error("Unsupported OpenType flavor "+E);s=pe.getUShort(i,12),l=Lu(i,s)}else if(E==="wOF2"){var T="https://github.com/opentypejs/opentype.js/issues/183#issuecomment-1147228025";throw new Error("WOFF2 require an external decompressor library, see examples at: "+T)}else throw new Error("Unsupported OpenType signature "+E);let h,u,C,g,H,F,K,j,Q,te,se,Ie,le,ue,ve,Ye,Re,Me;for(let ae=0;ae<s;ae+=1){const me=l[ae];let ne;switch(me.tag){case"avar":K=me;break;case"cmap":ne=At(i,me),a.tables.cmap=nl.parse(ne.data,ne.offset),a.encoding=new il(a.tables.cmap);break;case"cvt ":ne=At(i,me),Me=new pe.Parser(ne.data,ne.offset),a.tables.cvt=Me.parseShortList(me.length/2);break;case"fvar":C=me;break;case"STAT":g=me;break;case"gvar":H=me;break;case"cvar":F=me;break;case"fpgm":ne=At(i,me),Me=new pe.Parser(ne.data,ne.offset),a.tables.fpgm=Me.parseByteList(me.length);break;case"head":ne=At(i,me),a.tables.head=dl.parse(ne.data,ne.offset),a.unitsPerEm=a.tables.head.unitsPerEm,r=a.tables.head.indexToLocFormat;break;case"hhea":ne=At(i,me),a.tables.hhea=Il.parse(ne.data,ne.offset),a.ascender=a.tables.hhea.ascender,a.descender=a.tables.hhea.descender,a.numberOfHMetrics=a.tables.hhea.numberOfHMetrics;break;case"HVAR":le=me;break;case"hmtx":Ie=me;break;case"ltag":ne=At(i,me),n=pl.parse(ne.data,ne.offset);break;case"COLR":ne=At(i,me),a.tables.colr=fl.parse(ne.data,ne.offset);break;case"CPAL":ne=At(i,me),a.tables.cpal=ll.parse(ne.data,ne.offset);break;case"maxp":ne=At(i,me),a.tables.maxp=Sl.parse(ne.data,ne.offset),a.numGlyphs=a.tables.maxp.numGlyphs;break;case"name":Ye=me;break;case"OS/2":ne=At(i,me),a.tables.os2=F0.parse(ne.data,ne.offset);break;case"post":ne=At(i,me),a.tables.post=gl.parse(ne.data,ne.offset),a.glyphNames=new ss(a.tables.post);break;case"prep":ne=At(i,me),Me=new pe.Parser(ne.data,ne.offset),a.tables.prep=Me.parseByteList(me.length);break;case"glyf":j=me;break;case"loca":ve=me;break;case"CFF ":h=me;break;case"CFF2":u=me;break;case"kern":ue=me;break;case"GDEF":Q=me;break;case"GPOS":te=me;break;case"GSUB":se=me;break;case"meta":Re=me;break;case"gasp":ne=At(i,me),a.tables.gasp=Fl.parse(ne.data,ne.offset);break;case"SVG ":ne=At(i,me),a.tables.svg=Ml.parse(ne.data,ne.offset);break}}const xt=At(i,Ye);if(a.tables.name=rl.parse(xt.data,xt.offset,n),a.names=a.tables.name,j&&ve){const ae=r===0,me=At(i,ve),ne=hu.parse(me.data,me.offset,a.numGlyphs,ae),Dt=At(i,j);a.glyphs=Yl.parse(Dt.data,Dt.offset,ne,a,e)}else if(h){const ae=At(i,h);B0.parse(ae.data,ae.offset,a,e)}else if(u){const ae=At(i,u);B0.parse(ae.data,ae.offset,a,e)}else throw new Error("Font doesn't contain TrueType, CFF or CFF2 outlines.");const Oe=At(i,Ie);if(ul.parse(a,Oe.data,Oe.offset,a.numberOfHMetrics,a.numGlyphs,a.glyphs,e),Eh(a,e),ue){const ae=At(i,ue);a.kerningPairs=Eu.parse(ae.data,ae.offset)}else a.kerningPairs={};if(Q){const ae=At(i,Q);a.tables.gdef=su.parse(ae.data,ae.offset)}if(te){const ae=At(i,te);a.tables.gpos=Rl.parse(ae.data,ae.offset),a.position.init()}if(se){const ae=At(i,se);a.tables.gsub=yl.parse(ae.data,ae.offset)}if(C){const ae=At(i,C);a.tables.fvar=Nl.parse(ae.data,ae.offset,a.names)}if(g){const ae=At(i,g);a.tables.stat=Dl.parse(ae.data,ae.offset,a.tables.fvar)}if(H){C||console.warn("This font provides a gvar table, but no fvar table, which is required for variable fonts."),j||console.warn("This font provides a gvar table, but no glyf table. Glyph variation only works with TrueType outlines.");const ae=At(i,H);a.tables.gvar=Hl.parse(ae.data,ae.offset,a.tables.fvar,a.glyphs)}if(F){C||console.warn("This font provides a cvar table, but no fvar table, which is required for variable fonts."),a.tables.cvt||console.warn("This font provides a cvar table, but no cvt table which could be made variable."),j||console.warn("This font provides a gvar table, but no glyf table. Glyph variation only works with TrueType outlines.");const ae=At(i,F);a.tables.cvar=Bl.parse(ae.data,ae.offset,a.tables.fvar,a.tables.cvt||[])}if(K){C||console.warn("This font provides an avar table, but no fvar table, which is required for variable fonts.");const ae=At(i,K);a.tables.avar=Ol.parse(ae.data,ae.offset,a.tables.fvar)}if(le){C||console.warn("This font provides an HVAR table, but no fvar table, which is required for variable fonts."),Ie||console.warn("This font provides an HVAR table, but no hmtx table to vary.");const ae=At(i,le);a.tables.hvar=eu.parse(ae.data,ae.offset,a.tables.fvar)}if(Re){const ae=At(i,Re);a.tables.meta=ml.parse(ae.data,ae.offset),a.metas=a.tables.meta}return a.palettes=new vl(a),a}function du(){console.error("DEPRECATED! migrate to: opentype.parse(buffer, opt) See: https://github.com/opentypejs/opentype.js/issues/675")}function Iu(){console.error('DEPRECATED! migrate to: opentype.parse(require("fs").readFileSync(url), opt)')}const Bn={BoundingBox:as,Font:Zl,Glyph:Ca,Path:Kn,_parse:pe,load:du,loadSync:Iu,parse:Tu};function t0(t){const e=he,r=z();if(e.mousePosition=jl(t),t.button===3||t.button===4){nt(t);return}if(t.button,t.button===1&&(t.type==="mousedown"&&eE(t),t.type==="mouseup"&&tE(t)),t.button===0){switch(r.selectedTool){case"resize":e.currentToolHandler=r.eventHandlers.tool_resize;break;case"pathEdit":e.currentToolHandler=r.eventHandlers.tool_pathEdit;break;case"pan":e.currentToolHandler=r.eventHandlers.tool_pan;break;case"pathAddPoint":e.currentToolHandler=r.eventHandlers.tool_pathAddPoint;break;case"newPath":e.currentToolHandler=r.eventHandlers.tool_addPath;break;case"newRectangle":e.currentToolHandler=r.eventHandlers.tool_addRectOval;break;case"newOval":e.currentToolHandler=r.eventHandlers.tool_addRectOval;break;case"kern":e.currentToolHandler=r.eventHandlers.tool_kern;break;case r.selectedTool:e.currentToolHandler=r.eventHandlers.tool_resize}e.currentToolHandler[t.type](t)}}function jl(t){let e={};return t.offsetX||t.offsetY?(e.x=t.offsetX,e.y=t.offsetY):(t.layerX||t.layerY)&&(e.x=t.layerX,e.y=t.layerY),e}function b0(){const t=z();t.multiSelect.points.clear(),t.multiSelect.shapes.clear()}function Xl(t,e,r,n,a="pathPoints"){t=Rt(t),e=mt(e),r=Rt(r),n=mt(n);const i=Math.min(t,r),s=Math.min(e,n),l=Math.max(t,r),E=Math.max(e,n),T=new Kt({xMin:i,xMax:l,yMin:s,yMax:E}),h=z();let u=!0;const C=h.multiSelect.points,g=h.multiSelect.shapes,H=he.isCtrlDown;a==="pathPoints"?(C.allowPublishing=!1,H||C.clear(),g.allowPublishing=!1,H||g.clear(),h.selectedItem.shapes.forEach(F=>{ji(F.maxes,T)&&F.pathPoints&&F.pathPoints.forEach(K=>{T.isPointInside(K.p.x,K.p.y)&&(C.add(K),g.add(K.parent),u=!0)})})):a==="shapes"&&(C.allowPublishing=!1,H||C.clear(),g.allowPublishing=!1,H||g.clear(),h.selectedItem.shapes.forEach(F=>{T.isMaxesInside(F.maxes)&&(g.add(F),u=!0)})),C.allowPublishing=!0,g.allowPublishing=!0,u&&(C.publishChanges(),g.publishChanges())}function bA(){let e=z().multiSelect.shapes,r=he.handle,n=Rt(he.mousePosition.x),a=mt(he.mousePosition.y),i=Rt(he.lastX),l=mt(he.lastY)-a,E=i-n,T=e.ratioLock,h=e.maxes;switch(r.includes("e")&&n+E<=h.xMax&&(E=0),r.includes("w")&&(n+E>=h.xMin&&(E=0),h.width+E<0&&(E=h.width*-.9)),r.includes("n")&&a<=h.yMax-l&&(l=0),r.includes("s")&&(a+l>=h.yMin&&(l=0),h.height+l<0&&(l=h.height*-.9)),r){case"n":Ft("n")&&(Ke("n-resize"),e.updateShapeSize({width:0,height:l*-1,ratioLock:T,transformOrigin:"bottom-center"}));break;case"ne":Ft("ne")&&(Ke("ne-resize"),e.updateShapeSize({width:E*-1,height:l*-1,ratioLock:T,transformOrigin:"bottom-left"}));break;case"e":Ft("e")&&(Ke("e-resize"),e.updateShapeSize({width:E*-1,height:0,ratioLock:T,transformOrigin:"middle-left"}));break;case"be":Ft("be")&&(Ke("e-resize"),e.updateShapeSize({width:E*-1,height:0,ratioLock:T,transformOrigin:"baseline-left"}));break;case"se":Ft("se")&&(Ke("se-resize"),e.updateShapeSize({width:E*-1,height:l,ratioLock:T,transformOrigin:"top-left"}));break;case"s":Ft("s")&&(Ke("s-resize"),e.updateShapeSize({width:0,height:l,ratioLock:T,transformOrigin:"top-center"}));break;case"sw":Ft("sw")&&(Ke("sw-resize"),e.updateShapeSize({width:E,height:l,ratioLock:T,transformOrigin:"top-right"}));break;case"bw":Ft("bw")&&(Ke("ew-resize"),e.updateShapeSize({width:E,height:0,ratioLock:T,transformOrigin:"baseline-right"}));break;case"w":Ft("w")&&(Ke("w-resize"),e.updateShapeSize({width:E,height:0,ratioLock:T,transformOrigin:"middle-right"}));break;case"nw":Ft("nw")&&(Ke("nw-resize"),e.updateShapeSize({width:E,height:l*-1,ratioLock:T,transformOrigin:"bottom-right"}));break}}function ql(t,e){const r=z();if(aE(t,e)){let n=mg(t,e);Ke("pointer"),n!==he.canvasHotspotHovering&&r.publish("editCanvasView",r.view),he.canvasHotspotHovering=n}else he.canvasHotspotHovering&&r.publish("editCanvasView",r.view),he.canvasHotspotHovering=!1}function Ft(t){const e=z(),r=e.multiSelect.shapes;let n=r;r.length>1&&(n=r.virtualGlyph);let a=n.ratioLock,i=n.xLock,s=n.yLock,l=n.wLock,E=n.hLock,T=n.maxes.yMax,h=n.maxes.yMin,u=vt/2/e.view.dz,C=!0;switch(t){case"nw":C=a?!1:!s&&!E&&!i&&!l;break;case"n":C=!s&&!E;break;case"ne":C=a?!1:!s&&!E&&!l;break;case"e":C=!l;break;case"be":C=!l&&a&&h<u*-1&&T>u;break;case"se":C=a?!1:!E&&!l;break;case"s":C=!E;break;case"sw":C=a?!1:!E&&!i&&!l;break;case"bw":C=!i&&!l&&a&&h<u*-1&&T>u;break;case"w":C=!i&&!l}return C}function uu(t){let e=t.deltaY*-1;const r=z(),n=jl(t);r.nav.isOnEditCanvasPage&&(t.ctrlKey||t.metaKey)&&(nt(t),$a(),he.hoverPoint=!1,e>0?r.updateViewZoom(1.1,n):r.updateViewZoom(.9,n))}let vt=7,lo=40,ds=Lt.blue.l65,pu=Lt.green.l65,Ql=Lt.gray.l65,Su="#000",$l="#FFF",gu=3;function Cu(t){let r=z().multiSelect.shapes;if(r.length<1)return;let n=r.maxes,a=hi();ex(t,n,a.thickness,a.accent)}function Ru(t){let e=hi();fu(t,e.accent,e.thickness)}function yu(t){let r=z().multiSelect.shapes;if(r.length<1)return;let n=r.maxes,a=hi();mu(t,n,a.thickness,a.accent)}function hi(){let e=z().multiSelect.shapes,r=1,n=ds;return e.length>1?(r=gu,n=Ql):e.singleton.objType==="ComponentInstance"&&(n=pu),{thickness:r,accent:n}}function ex(t,e,r,n){const a=Is(e,r);let i=a.rightX-a.leftX,s=a.topY-a.bottomY;t.fillStyle="transparent",t.strokeStyle=n||hi().accent,t.lineWidth=r||1,t.strokeRect(a.leftX,a.bottomY,i,s)}function mu(t,e,r,n){let a=Is(e,r);if(t.fillStyle=$l,t.lineWidth=1,t.strokeStyle=n,z().multiSelect.shapes.isRotatable()){const s=vt/2;t.lineWidth=r,tx(t,{x:a.midX+1,y:a.topY},{x:a.midX+1,y:a.topY-lo}),t.lineWidth=1,us(t,{x:a.midX+1,y:a.topY-lo+s})}Ft("nw")&&Wr(t,a.nw),Ft("n")&&Wr(t,a.n),Ft("ne")&&Wr(t,a.ne),Ft("e")&&Wr(t,a.e),Ft("be")&&Wr(t,a.be),Ft("se")&&Wr(t,a.se),Ft("s")&&Wr(t,a.s),Ft("sw")&&Wr(t,a.sw),Ft("bw")&&Wr(t,a.bw),Ft("w")&&Wr(t,a.w)}function fu(t,e=ds,r=1){const n=he;let a=n.rotationStartCenter,i=n.rotationStartMaxesTopY,s=n.mousePosition.x,l=n.mousePosition.y,E=gn({x:Rt(s),y:mt(l)},a);n.isShiftDown&&(E=d1(E));let h={x:a.x,y:i};Ji(h,E,a),Ji(h,Math.PI/-2,a);let u=!1;Math.abs(E)>Math.PI/2&&(u=!0);let C={x:Nt(h.x),y:It(h.y)},g={x:Nt(a.x),y:It(a.y)};i=It(i);let H=la(g,C);t.fillStyle=e,t.strokeStyle=e,t.globalAlpha=.3,t.beginPath(),t.moveTo(g.x,g.y),t.arc(g.x,g.y,H,Math.PI/-2,E*-1,u),t.closePath(),t.stroke(),t.fill(),t.strokeStyle=e,t.fillStyle=$l,t.lineWidth=r,tx(t,{x:C.x,y:C.y},{x:g.x,y:g.y}),t.lineWidth=1,us(t,C);let F=oe(I1(E),1);u&&(F-=360),F=oe(F,1),t.font='24px FiraGo, "Open Sans", sans-serif',t.fillStyle=e,t.globalAlpha=.8,t.fillText(""+F+"°",g.x,i-24),t.globalAlpha=1}function PA(t,e,r){if(!r)return!1;const n=z();let a="",i=vt,s=Is(r);return n.multiSelect.shapes.isRotatable()&&t>s.midX&&t<s.midX+i&&e>s.topY-lo&&e<s.topY-lo+i&&(a="rotate"),t>s.nw.x&&t<s.nw.x+i&&e>s.nw.y&&e<s.nw.y+i&&(a="nw"),t>s.n.x&&t<s.n.x+i&&e>s.n.y&&e<s.n.y+i&&(a="n"),t>s.ne.x&&t<s.ne.x+i&&e>s.ne.y&&e<s.ne.y+i&&(a="ne"),t>s.e.x&&t<s.e.x+i&&e>s.e.y&&e<s.e.y+i&&(a="e"),t>s.be.x&&t<s.be.x+i&&e>s.be.y&&e<s.be.y+i&&(a="be"),t>s.se.x&&t<s.se.x+i&&e>s.se.y&&e<s.se.y+i&&(a="se"),t>s.s.x&&t<s.s.x+i&&e>s.s.y&&e<s.s.y+i&&(a="s"),t>s.sw.x&&t<s.sw.x+i&&e>s.sw.y&&e<s.sw.y+i&&(a="sw"),t>s.bw.x&&t<s.bw.x+i&&e>s.bw.y&&e<s.bw.y+i&&(a="bw"),t>s.w.x&&t<s.w.x+i&&e>s.w.y&&e<s.w.y+i&&(a="w"),a}function Is(t,e=1){const r=vt,n=vt/2,a=1;let i=Nt(t.xMin),s=oe(Nt(t.xMin)+(Nt(t.xMax)-Nt(t.xMin))/2),l=Nt(t.xMax),E=It(t.yMax),T=It(0),h=oe(It(t.yMax)+(It(t.yMin)-It(t.yMax))/2),u=It(t.yMin);return e>1&&(i-=e,l+=e,E-=e,u+=e),i=ft(i,!1)-a,s=ft(s,!1),l=ft(l,!0)+a,E=ft(E,!1)-a,h=ft(h,!1),u=ft(u,!0)+a,{leftX:i,midX:s,rightX:l,topY:E,midY:h,bottomY:u,nw:{x:i-r,y:E-r},n:{x:ft(s-n)+a,y:E-r},ne:{x:l,y:E-r},e:{x:l,y:ft(h-n)+a},be:{x:l,y:ft(T-n)+a},se:{x:l,y:u},s:{x:ft(s-n)+a,y:u},sw:{x:i-r,y:u},bw:{x:i-r,y:ft(T-n)+a},w:{x:i-r,y:ft(h-n)+a}}}function r0(t,e){let n=z().multiSelect.shapes,a=n.members.length,i=hi();a>0&&(t.beginPath(),n.drawShapes(t,e),t.closePath(),t.strokeStyle=i.accent,t.lineWidth=i.thickness,t.stroke())}function Nu(t,e,r){t.beginPath(),gi(e,t,r),t.closePath(),t.fillStyle=Su,t.fill(),t.strokeStyle=ds,t.stroke(),ex(t,e.maxes)}function tx(t,e,r){t.beginPath(),t.moveTo(e.x,e.y),t.lineTo(r.x,r.y),t.closePath(),t.stroke()}function Wr(t,e){t.fillRect(e.x,e.y,vt,vt),t.strokeRect(e.x,e.y,vt,vt)}function us(t,e){t.beginPath(),t.arc(e.x,e.y,vt/2,0,Math.PI*2,!0),t.closePath(),t.fill(),t.stroke()}function vA(t){const e=z();e.multiSelect.shapes.members.forEach(n=>{n.objType!=="ComponentInstance"&&n.pathPoints.forEach(a=>{e.multiSelect.points.isSelected(a)&&Hu(a,t)})})}function Gi(t,e=!1){const r=z();let n=r.multiSelect.shapes.members;e&&(n=r.selectedItem.shapes),n.forEach(a=>{a.objType!=="ComponentInstance"&&a.pathPoints.forEach((i,s)=>{if(s===0){let l=a.pathPoints[a.getNextPointNum(0)];Bu(i,t,r.multiSelect.points.isSelected(i),l)}else Ou(i,t,r.multiSelect.points.isSelected(i))})})}function Du(t,e){let r=vt;e&&(t.fillStyle=Lt.blue.l85,t.fillRect(e.x,e.y,r,r))}function Ou(t,e,r){let n=7,a=xn.offWhite,i=xn.accent;const s=n/2;e.fillStyle=r?a:i,e.strokeStyle=i,e.font="10px Consolas";let l=Nt(t.p.x)-s,E=It(t.p.y)-s;e.fillRect(l,E,n,n),e.strokeRect(l,E,n,n),e.fillStyle=i}function Bu(t,e,r,n){let a=xn.offWhite,i=xn.accent;e.fillStyle=r?a:i,e.strokeStyle=i,e.lineWidth=1;const s={x:t.p.x,y:t.p.y};let l={x:t.h2.x,y:t.h2.y};t.h2.use||(l={x:n.p.x,y:n.p.y});const E=vt/2,T=[[E*3,0],[E,E],[-E,E],[-E,-E],[E,-E]],h=[];let u=Math.atan2(l.y-s.y,l.x-s.x)*-1;!u&&u!==0&&(u=t.p.x>t.h2.x?Math.PI:0);for(const C of Object.keys(T))h.push([T[C][0]*Math.cos(u)-T[C][1]*Math.sin(u),T[C][0]*Math.sin(u)+T[C][1]*Math.cos(u)]);e.beginPath(),e.moveTo(h[0][0]+Nt(t.p.x),h[0][1]+It(t.p.y)),h.forEach((C,g)=>{g>0&&e.lineTo(h[g][0]+Nt(t.p.x),h[g][1]+It(t.p.y))}),e.lineTo(h[0][0]+Nt(t.p.x),h[0][1]+It(t.p.y)),e.fill(),e.stroke(),e.fillStyle=i,e.fillRect(ft(Nt(t.p.x)),ft(It(t.p.y)),1,1)}function Hu(t,e,r=!0,n=!0){let a=xn.accent;e.fillStyle=a,e.strokeStyle=a,e.lineWidth=1,e.font="10px Consolas",r&&t.h1.use&&i(t.h1,"1"),n&&t.h2.use&&i(t.h2,"2");function i(s,l){const E=Nt(s.x),T=It(s.y);us(e,{x:E,y:T}),e.beginPath(),e.moveTo(Nt(t.p.x),It(t.p.y)),e.lineTo(E,T),e.closePath(),e.stroke(),e.fillText(l,E+12,T)}}function Fu(t,e){let r=e.mousePosition.x,n=e.mousePosition.y;r+=r<e.firstX?1:0,n+=n<e.firstY?1:0;const a=new Kt({xMin:Math.min(e.firstX,r),xMax:Math.max(e.firstX,r),yMin:Math.min(e.firstY,n),yMax:Math.max(e.firstY,n)});t.fillStyle="hsl(200, 17%, 45%, 0.05)",t.strokeStyle=Ql,t.lineWidth=1,t.setLineDash([3,3]),t.fillRect(a.xMin,a.yMin,a.width,a.height),t.strokeRect(ft(a.xMin),ft(a.yMin),a.width,a.height),t.setLineDash([])}function Mu(t=[],e,r){for(let n=0;n<t.length;n++){let a=ps(t[n],e,r);if(a)return a}return!1}function n0(t,e,r,n){let a;return t!==!1&&(Array.isArray(t)?a=Mu(t,e,r):t.objType==="Glyph"||t.objType==="VirtualGlyph"?t.shapes&&t.shapes.length&&(a=Gu(t,e,r,n)):t.objType==="Path"?a=rx(t,e,r,n):t.objType==="PathPoint"&&(a=ps(t,e,r,n))),a}function Gu(t,e,r,n){let a=!1;for(let i=0;i<t.shapes.length;i++)if(t.shapes[i].objType!=="ComponentInstance"&&(a=rx(t.shapes[i],e,r,n),a))return a;return!1}function rx(t,e,r,n){let a=t.pathPoints||[],i=!1;for(let s=a.length-1;s>=0;s--)if(i=ps(a[s],e,r,n),i)return i;return!1}function UA(t,e,r){let n=t.pathPoints[0];return n?yt({x:e,y:r},n.p.coord,vt):!1}function ps(t,e=0,r=0,n=!1){const a=z().view.dz,i=vt/a,s={x:e,y:r};let l=!1;return yt(t.p,s,i)&&(l={pathPoint:t,controlPoint:"p"}),l||(t.h1.use&&!n&&yt(t.h1,s,i)&&(l={pathPoint:t,controlPoint:"h1"}),t.h2.use&&!n&&yt(t.h2,s,i)&&(l={pathPoint:t,controlPoint:"h2"})),l}const bu=":root{--gray-l99: hsl(200, 90%, 99%);--gray-l97: hsl(200, 81%, 97%);--gray-l95: hsl(200, 81%, 94%);--gray-l90: hsl(200, 60%, 88%);--gray-l85: hsl(200, 52%, 82%);--gray-l80: hsl(200, 47%, 76%);--gray-l75: hsl(200, 42%, 71%);--gray-l70: hsl(200, 33%, 65%);--gray-l65: hsl(200, 27%, 60%);--gray-l60: hsl(200, 22%, 55%);--gray-l55: hsl(200, 18%, 50%);--gray-l50: hsl(200, 17%, 45%);--gray-l45: hsl(200, 17%, 40%);--gray-l40: hsl(200, 18%, 36%);--gray-l35: hsl(200, 18%, 31%);--gray-l30: hsl(200, 17%, 27%);--gray-l25: hsl(200, 18%, 23%);--gray-l20: hsl(200, 18%, 19%);--gray-l15: hsl(200, 17%, 15%);--gray-l10: hsl(200, 19%, 11%);--gray-l05: hsl(350, 17%, 7%);--blue-l98: hsl(200, 100%, 98%);--blue-l95: hsl(200, 100%, 94%);--blue-l90: hsl(200, 100%, 87%);--blue-l85: hsl(200, 100%, 80%);--blue-l80: hsl(200, 100%, 73%);--blue-l75: hsl(199, 100%, 64%);--blue-l70: hsl(200, 100%, 58%);--blue-l65: hsl(200, 100%, 49%);--blue-l60: hsl(200, 100%, 45%);--blue-l55: hsl(200, 100%, 41%);--blue-l50: hsl(200, 100%, 37%);--blue-l45: hsl(200, 100%, 33%);--blue-l40: hsl(200, 100%, 30%);--blue-l35: hsl(200, 100%, 25%);--blue-l30: hsl(200, 100%, 22%);--blue-l25: hsl(200, 100%, 19%);--blue-l20: hsl(200, 100%, 15%);--blue-l15: hsl(200, 100%, 12%);--blue-l10: hsl(200, 100%, 9%);--blue-l05: hsl(200, 100%, 6%);--orange-l98: hsl(20, 100%, 98%);--orange-l95: hsl(20, 100%, 95%);--orange-l90: hsl(20, 100%, 89%);--orange-l85: hsl(20, 100%, 84%);--orange-l80: hsl(20, 100%, 78%);--orange-d80: hsl(20, 50%, 78%);--orange-l75: hsl(20, 100%, 72%);--orange-l70: hsl(20, 100%, 66%);--orange-d70: hsl(20, 50%, 66%);--orange-l65: hsl(20, 100%, 56%);--orange-l60: hsl(20, 100%, 50%);--orange-d60: hsl(20, 50%, 50%);--orange-l55: hsl(20, 100%, 46%);--orange-l50: hsl(20, 100%, 42%);--orange-d50: hsl(20, 50%, 42%);--orange-l45: hsl(20, 100%, 37%);--orange-l40: hsl(20, 100%, 33%);--orange-d40: hsl(20, 50%, 33%);--orange-l35: hsl(20, 100%, 29%);--orange-l30: hsl(20, 100%, 25%);--orange-l25: hsl(20, 100%, 22%);--orange-l20: hsl(20, 100%, 17%);--orange-l15: hsl(20, 100%, 14%);--orange-l10: hsl(20, 100%, 10%);--orange-l05: hsl(20, 100%, 6%);--green-l98: hsl(125, 100%, 98%);--green-l95: hsl(125, 100%, 82%);--green-l90: hsl(125, 97%, 74%);--green-l85: hsl(125, 83%, 66%);--green-l80: hsl(125, 74%, 58%);--green-l75: hsl(125, 67%, 50%);--green-l70: hsl(125, 82%, 43%);--green-l65: hsl(125, 100%, 36%);--green-l60: hsl(125, 100%, 33%);--green-l55: hsl(125, 100%, 30%);--green-l50: hsl(125, 100%, 27%);--green-l45: hsl(125, 100%, 24%);--green-l40: hsl(125, 95%, 22%);--green-l35: hsl(125, 100%, 19%);--green-l30: hsl(125, 100%, 16%);--green-l25: hsl(125, 100%, 14%);--green-l20: hsl(125, 100%, 11%);--green-l15: hsl(125, 100%, 9%);--green-l10: hsl(125, 100%, 6%);--green-l05: hsl(125, 100%, 4%);--purple-l98: hsl(285, 100%, 98%);--purple-l95: hsl(285, 100%, 96%);--purple-l90: hsl(285, 100%, 92%);--purple-l85: hsl(285, 100%, 89%);--purple-l80: hsl(285, 100%, 85%);--purple-l75: hsl(285, 100%, 81%);--purple-l70: hsl(285, 100%, 77%);--purple-l65: hsl(285, 100%, 72%);--purple-l60: hsl(285, 100%, 66%);--purple-l55: hsl(285, 100%, 61%);--purple-l50: hsl(285, 100%, 50%);--purple-l45: hsl(285, 100%, 45%);--purple-l40: hsl(285, 100%, 40%);--purple-l35: hsl(285, 100%, 36%);--purple-l30: hsl(285, 100%, 31%);--purple-l25: hsl(285, 100%, 27%);--purple-l20: hsl(285, 100%, 22%);--purple-l15: hsl(285, 100%, 17%);--purple-l10: hsl(285, 100%, 13%);--purple-l05: hsl(285, 100%, 10%);--offWhite: hsl(200, 81%, 97%);--darkRed: hsl(0, 100%, 23%);--red: hsl(0, 100%, 48%);--lightRed: hsl(0, 100%, 90%);--accent-color: hsl(200, 100%, 37%);--accent-color-light: hsl(200, 100%, 49%);--enabled-resting-text: hsl(0, 0%, 5%);--enabled-resting-lightText: hsl(0, 0%, 10%);--enabled-resting-border: hsl(0, 0%, 75%);--enabled-resting-fill: hsl(0, 0%, 40%);--enabled-resting-background: hsl(0, 0%, 98%);--enabled-restingLight-text: hsl(0, 0%, 20%);--enabled-restingLight-lightText: hsl(0, 0%, 30%);--enabled-restingLight-border: hsl(0, 0%, 80%);--enabled-restingLight-fill: hsl(0, 0%, 60%);--enabled-restingLight-background: hsl(0, 0%, 98%);--enabled-focus-text: hsl(0, 0%, 0%);--enabled-focus-lightText: hsl(0, 0%, 10%);--enabled-focus-border: hsl(200, 25%, 63%);--enabled-focus-fill: hsl(200, 25%, 25%);--enabled-focus-background: white;--enabled-active-text: hsl(0, 0%, 0%);--enabled-active-lightText: hsl(0, 0%, 10%);--enabled-active-border: hsl(0, 0%, 63%);--enabled-active-fill: var(--accent-color);--enabled-active-background: white;--disabled-text: hsl(0, 0%, 40%);--disabled-text-light: hsl(0, 0%, 60%);--disabled-text-dark: hsl(0, 0%, 20%);--disabled-border: hsl(0, 0%, 82%);--disabled-fill: hsl(0, 0%, 82%);--disabled-background: hsl(0, 0%, 94%)}",Pu=`<?xml version="1.0" encoding="UTF-8"?>\r
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">\r
  <path fill="hsl(200, 100%, 41%)" d="m491.109,170.926c-89.722,0-162.715,82.261-162.715,183.377,0,124.258,113.791,137.671,162.715,137.671s162.715-13.413,162.715-137.671c0-101.116-72.993-183.377-162.715-183.377Z"/>\r
  <path fill="hsl(200, 100%, 41%)" d="m920.448,79.552C840.896,0,719.097,0,500,0S159.104,0,79.552,79.552C0,159.104,0,280.903,0,500s0,340.896,79.552,420.448c79.552,79.552,201.351,79.552,420.448,79.552s340.896,0,420.448-79.552c79.552-79.552,79.552-201.351,79.552-420.448s0-340.896-79.552-420.448Zm-146.744,112.456c0,2.761-2.239,5-5,5h-7.034c-.038,0-.074-.01-.112-.011-.004,0-.007.001-.01.001h-45.856c-1.075,0-2.087.506-2.731,1.366l-8.66,11.546c27.074,41.021,42.88,90.25,42.88,143.144,0,70.001-27.646,127.253-79.957,165.578-44.577,32.657-105.478,49.921-176.114,49.921-55.318,0-104.663-10.591-144.875-30.869-10.283,10.57-17.335,24.213-17.335,38.766,0,34.131,21.332,54.11,94.524,54.11,90.099,0,163.146-23.565,231.294-23.565,80.615,0,85.357,57.752,85.357,99.583,0,118.551-27.271,209.05-292.825,209.05-33.161,0-97.221-1.724-132.317-9.312-3.75-.811-6.015-4.609-5.018-8.314l20.862-78.928c.909-3.377,4.229-5.502,7.667-4.855,21.23,3.999,80.354,10.479,108.806,10.479,156.167,0,209.013,8.004,209.245-98.506-.071-11.553,3.771-19.614-12.673-19.614-61.646,0-130.08,16.099-239.25,16.099-126.868,0-158.866-87.434-158.866-144.64,0-26.761,14.174-60.59,39.162-86.528-32.729-36.272-49.828-83.42-49.828-138.455,0-142.651,114.875-258.706,256.071-258.706,59.47,0,114.268,20.59,157.783,55.082l12.693-16.924c7.611-10.15,19.559-16.123,32.245-16.123h67.717c.01,0,.019.003.029.003.032,0,.062-.009.094-.009h7.034c2.761,0,5,2.239,5,5v70.632Z"/>\r
</svg>`,vu=":root{--dark-gradient-background: linear-gradient(135deg, var(--blue-l15), var(--purple-l05));--global-focus-style: 1px dashed var(--purple-l50);--global-transition: all 80ms ease;--animate-fade-duration: .14s;--animate-fade-in-slide-down: var(--animate-fade-duration) ease-in fade-slide-in;--animate-fade-in: var(--animate-fade-duration) ease-in fade-in;--animate-fade-out: var(--animate-fade-duration) ease-out fade-out;--animate-fade-update: var(--animate-fade-duration) ease-in fade-in-update;--l1-shadow: 0px 0px 2px rgba(0, 0, 0, .1);--l1-shadow-down: 0px 2px 2px rgba(0, 0, 0, .1);--l2-shadow: 0px 0px 4px rgba(0, 0, 0, .2);--l2-shadow-upper-left: -1px -1px 4px rgba(0, 0, 0, .2);--l2-shadow-down: 0px 4px 4px rgba(0, 0, 0, .3);--l3-shadow: 0px 0px 6px rgba(0, 0, 0, .3);--l3-shadow-down: 0px 6px 6px rgba(0, 0, 0, .3)}@font-face{font-family:FiraGo;font-style:normal;font-weight:400;src:url(/app/assets/FiraGO-Regular-aODw3bZ7.woff2)}*{margin:0;padding:0;font-family:FiraGo,Tahoma,Verdana,sans-serif;font-size:14px;font-weight:400;text-align:left;box-sizing:border-box;transition:var(--global-transition)}html,body{background-color:var(--dark-gradient-background);height:100%;width:100%;min-height:100%;min-width:100%;overflow:hidden}html[lang=en],html[lang=en] body{overflow:auto}::-webkit-scrollbar{width:8px;padding:1px;border-radius:4px;border:1px solid var(--gray-l90);background-color:var(--offWhite)}::-webkit-scrollbar-button{height:0px;background-color:transparent}::-webkit-scrollbar-track{width:8px}::-webkit-scrollbar-track-piece{background-color:transparent}::-webkit-scrollbar-thumb{margin:2px;background-color:var(--gray-l80);border-radius:4px}::-webkit-scrollbar-corner{display:none}::-webkit-resizer{display:block;border:2px outset var(--enabled-restingLight-background)}div,p,h1,h2,h3,table,td,label,button{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}b,strong{font-weight:700}a,a:visited{background-color:transparent;border-radius:4px;color:var(--blue-l55);text-decoration:none}a:active{color:var(--blue-l40);background-color:#0099e61a}a:focus,a:hover{color:var(--blue-l65);text-decoration:underline;cursor:pointer}a[danger],a[danger]:visited{color:var(--darkRed)}a[danger]:hover,a[danger]:focus{color:var(--red)}p{display:block;margin-top:4px}p,li{line-height:1.3em}p code{height:1.3em;margin-top:0;margin-bottom:0;padding-top:0}span:disabled,span[disabled=disabled]{color:var(--disabled-text)}hr{border-style:solid;border-color:var(--gray-l85)}h1{margin-left:0;color:var(--gray-l55);font-size:2em;margin-bottom:8px;clear:right}h2{color:var(--gray-l45);font-size:1.6em}h3{color:var(--gray-l45);font-size:1.3em;margin-bottom:4px}h4{color:var(--gray-l45);font-size:1.2em;margin-bottom:4px}table{border-collapse:collapse}td{vertical-align:top}svg{overflow:visible}.number{font-family:monospace}label,label:focus,label:active{display:inline}label:hover{color:#000}input,textarea{border:none;padding:0 0 0 4px;height:24px;text-align:left;font-family:monospace;background-color:var(--enabled-restingLight-background);color:var(--enabled-restingLight-text);border:1px solid var(--enabled-restingLight-border);border-radius:4px;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}input:hover,textarea:hover{background-color:var(--enabled-focus-background);color:var(--enabled-focus-text);border-color:var(--enabled-focus-border)}input:focus,textarea:focus{background-color:var(--enabled-focus-background);color:var(--enabled-focus-text);border-color:var(--enabled-focus-border)}textarea:hover::-webkit-resizer,textarea:focus::-webkit-resizer{display:block;border:2px outset var(--enabled-focus-background)}info-bubble{width:12px}input:focus,button:focus,textarea:focus,info-bubble:focus,glyph-tile:focus{outline:var(--global-focus-style);outline-offset:-1px}input[type=image]{height:auto;width:auto;background-color:transparent;border-width:0px}input[type=number]{text-align:right;width:70px;border:1px solid white;border:1px solid var(--gray-l90);cursor:default}input[type=text][disabled=disabled],input[type=number][disabled=disabled]{background-color:var(--gray-l90);border:1px solid var(--gray-l90);color:var(--gray-l65)}input[type=checkbox]{accent-color:var(--accent-color);opacity:.75}ul li{margin-left:20px;margin-top:10px}canvas:focus,canvas:focus-visible,edit-canvas:focus,edit-canvas:focus-visible{border:0;border-image:none;outline:0}@keyframes fade-slide-in{0%{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}@keyframes fade-in-update{0%{opacity:.8}to{opacity:1}}@keyframes fade-in{0%{opacity:0;transform:scale(1.006)}to{opacity:1;transform:scale(1)}}@keyframes fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.994)}}.span-all-columns{grid-column:-1 / 1!important}button,button:active,button:hover,button:focus{text-align:center;padding:4px 8px;margin:2px 0;cursor:pointer;border-radius:4px;border:1px solid var(--gray-l90);background-color:var(--gray-l90);color:var(--enabled-text);box-shadow:var(--l1-shadow)}button:hover{color:var(--enabled-focus-text);border-color:var(--blue-l85);box-shadow:var(--l1-shadow)}button[disabled],button[disabled]:active,button[disabled]:hover,button[disabled]:focus{background-color:var(--gray-l95);border-color:var(--gray-l95);color:var(--disabled-text);cursor:default}.button__call-to-action,.button__call-to-action:hover,.button__call-to-action:active,.button__call-to-action:focus{background-color:var(--blue-l60);color:var(--gray-l95)}.button__call-to-action:hover{color:#fff}",Uu="dialog{z-index:1000}#toast,#error{display:none;width:300px;position:absolute;left:520px;top:0;margin:5px 0;background-color:var(--green-l90);color:var(--green-l10);padding:4px 8px;z-index:2010;text-align:center;border:1px solid var(--green-l60);border-radius:4px;box-shadow:var(--l3-shadow-down);animation:var(--animate-fade-in-slide-down)}#toast[fancy]{background-color:var(--purple-l30);background:linear-gradient(135deg,var(--purple-l25),var(--purple-l10));color:var(--purple-l95);font-size:1.2em;border-color:var(--purple-l30);padding:10px}#toast a{color:var(--green-l10)}#notation{display:none;position:absolute;right:900px;top:400px;width:auto;height:auto;padding:0;z-index:2020;background-color:#e5eaef;border:5px solid rgb(229,234,239);border-radius:5px 5px 0;box-shadow:var(--l2-shadow-upper-left);animation:var(--animate-fade-in)}.notation__path-add-point{display:grid;grid-template-columns:20px min-content min-content;margin:0 5px 2px}.notation__path-add-point span{font-family:monospace}.notation__path-add-point label{font-family:monospace;color:var(--enabled-restingLight-lightText)}#error{margin-top:10px;border-color:var(--red);color:var(--darkRed);background-color:var(--lightRed);display:grid;grid-template-rows:20px 1fr;padding:10px 12px 12px;row-gap:10px}#error hr{border-color:var(--red);margin:10px 0}.error__header{display:grid;grid-template-columns:1fr 20px}.error__header h3{color:var(--darkRed)}.error__header button{background-color:var(--darkRed);border-color:var(--darkRed);color:var(--lightRed);width:20px;height:20px;line-height:20px;padding:0;margin:0}.error__header button:hover{color:#fff;border-color:var(--red)}#context-menu{display:grid;grid-template-columns:24px 1fr min-content min-content;column-gap:0px;row-gap:5px;width:fit-content;height:min-content;overflow-y:auto;padding:10px;position:absolute;z-index:2030;background-color:var(--enabled-resting-background);border:1px solid var(--enabled-focus-border);border-radius:0 4px 4px;box-shadow:var(--l3-shadow-down);animation:var(--animate-fade-in-slide-down)}.context-menu__top-menu{max-height:400px}#context-menu:focus{outline:0}.context-menu-row{display:contents;padding:5px 10px 5px 5px;height:24px;border-radius:4px}.context-menu-row:hover>span,.context-menu-row:hover>.row-notes,.context-menu-row:hover>.row-notes span,.context-menu-row:hover>.row-notes code{background-color:var(--enabled-focus-background);color:var(--blue-l45);cursor:pointer}.context-menu-row:focus{outline:var(--global-focus-style)}.context-menu-row[disabled]{opacity:.5;color:var(--disabled-text-light)}.context-menu-row[disabled]:hover>span,.context-menu-row[disabled]:hover>.row-notes,.context-menu-row[disabled]:hover>.row-notes span,.context-menu-row[disabled]:hover>.row-notes code{color:var(--disabled-text-light);cursor:default;background-color:transparent}.context-menu-row[disabled] svg g{fill:var(--disabled-text-light)!important}#context-menu .spanAll h2{font-size:.8em;color:var(--enabled-restingLight-lightText);font-family:monospace;padding:0 20px 0 0}.context-menu-row hr,.context-menu-row hr:hover,.context-menu-row hr:active,.context-menu-row hr:focus{margin:8px 0;grid-column:1 / -1;border-width:0px 0px 1px 0px;border-color:var(--gray-l90)}.context-menu-row .row-icon{height:24px;width:24px}.context-menu-row .row-icon svg{height:20px;width:20px;margin:2px}.context-menu-row .row-name{line-height:22px;height:24px;padding:2px 20px 0 10px;display:flex}.context-menu-row .row-name svg{margin-right:10px}.context-menu-row .row-notes{background-color:transparent;width:max-content;height:24px;opacity:.8;display:contents;margin-left:20px}.context-menu-row .row-notes code{height:20px;line-height:18px;margin:2px;font-size:.8em;min-height:24px;min-width:24px}.context-menu-row .row-notes span{grid-column:span 2;font-size:.8em;line-height:24px;padding:0 0 0 4px;height:24px;margin:0}#modal-dialog{display:block;position:absolute;text-align:center;border-width:0px;padding:0px auto;left:0;top:0;width:100vw;height:100vh;z-index:2000;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);background-color:#ffffffbf;animation:var(--animate-fade-in)}.modal-dialog__content{display:grid;grid-template-rows:30px 1fr;width:clamp(500px,66vw,1000px);max-height:calc(100vh - 80px);overflow-y:hidden;margin:40px auto;text-align:left;background-color:var(--enabled-focus-background);border:1px solid var(--blue-l60);border-radius:8px;box-shadow:var(--l3-shadow-down);animation:var(--animate-fade-in-slide-down)}.modal-dialog__header{margin:4px;height:20px;display:grid;grid-template-columns:1fr 20px}.modal-dialog__body{display:block;max-height:calc(100vh - 120px);overflow-y:auto;padding:0 20px 20px}.modal-dialog__body h2{margin-bottom:10px}.modal-dialog__close-button{background-color:var(--blue-l95);border-color:var(--blue-l85);color:var(--blue-l50);text-align:center;width:20px;height:20px;line-height:14px;font-size:1.2em;padding:0 0 2px;margin:0}.modal-dialog__close-button:hover{background-color:var(--blue-l90);color:var(--blue-l30);border-color:var(--blue-l70);cursor:pointer;padding:0 0 2px;margin:0}.modal-dialog__close-button:active,.modal-dialog__close-button:focus{background-color:var(--blue-l90);color:var(--blue-l50);cursor:pointer;padding:0;margin:0}",wu="";class Li extends HTMLElement{constructor(e={}){super(),this.isSetUp=!1,this.initialAttributes=e,this.observedAttrs=["text","font-size","line-gap","page-padding","show-page-extras","show-line-extras","show-character-extras","show-placeholder-message","width-adjustment"]}connectedCallback(){this.constructor.name!=="DisplayCanvas"&&(this.__proto__=customElements.get("display-canvas").prototype),this.textBlockOptions=new rn,Object.keys(this.initialAttributes).forEach(n=>{let a=this.initialAttributes[n];n!=="_text"?(n!=="width"&&n!=="height"&&this.setAttribute(L1(n),a),this.textBlockOptions[Ui(n)]&&(this.textBlockOptions[Ui(n)]=a)):(this.textBlockOptions.text=this.initialAttributes._text,this.setAttribute("text",this.textBlockOptions.text))}),this.observedAttrs.forEach(n=>{if(this.hasAttribute(n)){let a=this.getAttribute(n);n.startsWith("show")?a==="false"?a=!1:a=!0:n!=="text"&&(a=parseFloat(a)),this.textBlockOptions[Ui(n)]=a}});const e=this.attachShadow({mode:"open"}),r=y({tag:"style",innerHTML:wu});e.appendChild(r),this.canvas=y({tag:"canvas",id:"mainDisplayCanvas"}),e.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.drawCrisp=!1,this.isSetUp=!0,this.resizeAndRedraw?this.resizeAndRedraw():console.warn(`${this.constructor.name}: Methods not available on connectedCallback`)}resizeAndRedraw(){this.isSetUp&&(this.updateTextBlock(),this.updateCanvasSize(),this.redraw())}updateCanvasSize(){var s;const e=(s=this==null?void 0:this.parentElement)==null?void 0:s.getClientRects()[0],r=this.textBlockOptions.pageHeight,n=this.textBlockOptions.pageWidth;let a=1e3,i=1e3;r==="auto"?(a=this.textBlock.pixelHeight,a+=this.textBlockOptions.pagePadding):r==="fit"?a=e.height:isNaN(parseInt(r))||(a=parseInt(r)),n==="fit"?i=e.width:isNaN(parseInt(n))||(i=parseInt(n)),this.widthAdjustment&&(i+=this.widthAdjustment),this.height=a,this.width=i,this.canvas.height=a,this.canvas.width=i}updateTextBlock(){let e=this.calculatePageMaxes(),r=!1,n=parseInt(this.getAttribute("project-editor"));isNaN(n)||(r=it().projectEditors[n].project),this.textBlock=new u0({options:this.textBlockOptions,canvasMaxes:e,ctx:this.ctx,drawPageExtras:this.drawDisplayPageExtras,drawLineExtras:this.drawDisplayLineExtras,drawCharacterExtras:this.drawDisplayCharacterExtras,drawCharacter:this.drawDisplayCharacter,project:r})}calculatePageMaxes(){var s;const e=(s=this==null?void 0:this.parentElement)==null?void 0:s.getClientRects()[0],r=this.textBlockOptions.pagePadding,n=this.textBlockOptions.pageHeight,a=this.textBlockOptions.pageWidth,i={xMin:r,yMin:r,xMax:1e3,yMax:1e3};return n==="auto"?i.yMax=1/0:n==="fit"?i.yMax=e.height-r:isNaN(parseInt(n))||(i.yMax=parseInt(n)),a==="fit"?i.xMax=e.width-r:isNaN(parseInt(a))||(i.xMax=parseInt(a)),this.widthAdjustment&&(i.xMax+=this.widthAdjustment),i}static get observedAttributes(){return this.observedAttrs}attributeChangedCallback(e,r,n){this.constructor.name==="DisplayCanvas"&&(e==="text"&&(this.textBlockOptions.text=n,this.resizeAndRedraw()),e==="font-size"&&(this.textBlockOptions.fontSize=Math.max(parseInt(n),1),this.resizeAndRedraw()),e==="line-gap"&&(this.textBlockOptions.lineGap=Math.max(parseInt(n),0),this.resizeAndRedraw()),e==="page-padding"&&(this.textBlockOptions.pagePadding=Math.max(parseInt(n),0),this.resizeAndRedraw()),e==="show-page-extras"&&(this.textBlockOptions.showPageExtras=n==="true",this.redraw()),e==="show-line-extras"&&(this.textBlockOptions.showLineExtras=n==="true",this.redraw()),e==="show-character-extras"&&(this.textBlockOptions.showCharacterExtras=n==="true",this.redraw()),e==="show-placeholder-message"&&(this.textBlockOptions.showPlaceholderMessage=n==="true",this.redraw()),e==="width-adjustment"&&(this.widthAdjustment=parseInt(n),this.resizeAndRedraw()))}redraw(){if(this.isSetUp){if(this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.textBlock.hasDrawableCharacters)this.textBlock.draw({showPageExtras:this.textBlockOptions.showPageExtras,showLineExtras:this.textBlockOptions.showLineExtras,showCharacterExtras:this.textBlockOptions.showCharacterExtras,showCharacter:!0});else if(this.textBlockOptions.showPlaceholderMessage){this.ctx.fillStyle=xn.disabled.text,this.ctx.font="14px sans-serif",this.ctx.textBaseline="middle";let e=this.textBlock.canvasMaxes.xMin,r=this.height/2;this.ctx.fillText("Project preview text will be shown here.",e,r)}}}iterator(e){const r=this.textBlock.data;for(let n=0;n<r.length;n++)for(let a=0;a<r[n].length;a++)e(r[n][a],this)}drawDisplayPageExtras(e,r){const n=r.canvasMaxes,a=n.yMin||0,i=n.yMax===1/0?r.pixelHeight:n.yMax,s=n.xMin||0,E=(n.xMax||1e3)-s,T=i-a;e.fillStyle="transparent",e.strokeStyle=Lt.gray.l90,e.lineWidth=1,e.strokeRect(ft(s),ft(a),oe(E),oe(T))}drawDisplayLineExtras(e,r,n){e.strokeStyle=Lt.gray.l85,e.beginPath(),e.moveTo(n.canvasMaxes.xMin,r.view.dy),e.lineTo(n.canvasMaxes.xMax,r.view.dy),e.closePath(),e.stroke()}drawDisplayCharacterExtras(e,r){const n=ce(),a=n.settings.font,i=r.view.dz;let s=r.widths.advance*i,l=n.totalVertical*i,E=r.view.dy-a.ascent*i,T=r.view.dx;const h=r.widths.kern*i*-1;r.widths.kern&&(e.fillStyle="orange",e.globalAlpha=.3,e.fillRect(T+s-h,E,h,l),e.globalAlpha=1),e.fillStyle="transparent",e.strokeStyle=Lt.blue.l85,e.lineWidth=1,this.drawCrisp&&(T=ft(T),E=ft(E),s=oe(s),l=oe(l)),e.strokeRect(T,E,s,l)}drawDisplayCharacter(e,r){const n=r.item,a=Er(r.view);n&&(e.fillStyle=xn.enabled.resting.text,e.strokeStyle="transparent",ka(n,e,a,1))}}function Yu(t){let e,r;if(typeof window.DOMParser<"u")e=new window.DOMParser().parseFromString(t,"text/xml");else if(typeof window.ActiveXObject<"u"&&new window.ActiveXObject("Microsoft.XMLDOM"))e=new window.ActiveXObject("Microsoft.XMLDOM"),e.async="false",e.loadXML(t);else throw console.warn("No XML document parser found."),r=new SyntaxError("No XML document parser found."),r;if(e.getElementsByTagName("parsererror").length){const E=e.getElementsByTagName("div")[0].innerHTML;throw r=new SyntaxError(l(E)),r}return{name:e.documentElement.nodeName,attributes:s(e.documentElement.attributes),content:i(e.documentElement)};function i(E){const T=E.childNodes;if(T.length===0)return l(E.nodeValue);const h=[];let u,C,g;for(const H of T)u={name:"",attributes:{},content:""},H.nodeName!=="#comment"&&(C=i(H),g=s(H.attributes),H.nodeName==="#text"&&JSON.stringify(g)==="{}"?u=l(C):(u.name=H.nodeName,u.attributes=g,u.content=C),u!==""&&h.push(u));return h}function s(E){if(!E||!E.length)return{};const T={};for(const h of E)T[h.name]=l(h.value);return T}function l(E){try{return E=E.replace(/^\s+|\s+$/g,""),E.replace(/(\r\n|\n|\r|\t)/gm,"")}catch{return""}}}let a0=0;async function Ss(t){const e=document.querySelector("#progress-indicator__message");if(e){const r=document.querySelector("#progress-indicator__bar");r&&(a0=(a0+.95)%100,r.style.backgroundPosition=`${a0}%`,t&&(e.innerHTML=t)),await Ia()}}function Wu(){let t=y({id:"progress-indicator__wrapper"}),e=y({id:"progress-indicator__message",innerHTML:"Working..."}),r=y({tag:"div",id:"progress-indicator__bar"});return ie(t,[e,r]),t}function ku(t){let e=y({tag:"div",className:"panel__card",innerHTML:"<h3>Component instance</h3>"}),r=we("name"),n=Pt(t,"name","currentComponentInstance","input"),a=Ku(t),i=_u(t),s=we("flip vertical",`
		Flip top to bottom,
		as compared to the root Glyph or Component
		that this Component Instance is linked to.
	`),l=Wn(t,"isFlippedNS","currentComponentInstance"),E=we("flip horizontal",`
		Flip left to right,
		as compared to the root Glyph or Component
		that this Component Instance is linked to.
	`),T=Wn(t,"isFlippedEW","currentComponentInstance"),h=we("reverse winding",`
		Reverse all the windings,
		as compared to the root Glyph or Component
		that this Component Instance is linked to.
	`),u=Wn(t,"reverseWinding","currentComponentInstance"),C=we("rotate"),g=Pt(t,"rotation","currentComponentInstance","input-number"),H=we("rotate first",Vu());H.querySelector("info-bubble").setAttribute("bubble-width","540px");let F=Wn(t,"rotateFirst","currentComponentInstance"),K=y({tag:"h3",innerHTML:"Component root"}),j=O1(t.link);return ie(e,[r,n,a,i,s,l,E,T,h,u,C,g]),t.rotation!==0&&ie(e,[H,F]),ie(e,[Qr(),K,j]),ie(e,Qr()),ie(e,jg()),e}function Ku(t){let e=we(`Δ x${ai()}Δ y`,`
		The difference in x or y position,
		as compared to the root Glyph or Component
		that this Component Instance is linked to.
	`),r=y({tag:"div",className:"doubleInput"}),n=Pt(t,"translateX","currentComponentInstance","input-number"),a=Pt(t,"translateY","currentComponentInstance","input-number");return r.appendChild(n),r.appendChild(ii()),r.appendChild(a),[e,r]}function _u(t){let e=we(`Δ width${ai()}Δ height`,`
		The difference in width or height,
		as compared to the root Glyph or Component
		that this Component Instance is linked to.
	`),r=y({tag:"div",className:"doubleInput"}),n=Pt(t,"resizeWidth","currentComponentInstance","input-number"),a=Pt(t,"resizeHeight","currentComponentInstance","input-number");r.appendChild(n),r.appendChild(ii()),r.appendChild(a);let i=we("lock aspect ratio",`
		When either the width or height is adjusted,
		the overall size will be kept proportional.
		<br><br>
		Maintaining aspect ratio will override value
		locks if need be.
	`),s=Wn(t,"ratioLock","currentComponentInstance");return[e,r,i,s]}function Vu(){return`
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
	`}function zu(t){var h,u;let e=y({tag:"div",className:"panel__card",innerHTML:`<h3>${t.displayType} ${t.ident||""}</h3>`}),r=we("advance width"),n=y({tag:"div",className:"doubleInput"}),a=Pt(t,"advanceWidth","currentItem","input-number"),i=y({tag:"button",className:"panel-card__action-button",title:`Auto-fit advance width
The advance width will be set to the x-max of the paths in this glyph.`,innerHTML:Dn({name:"command_autoFit"}),onClick:()=>{let C=z();C.selectedItem.advanceWidth=C.selectedItem.maxes.xMax,C.publish("currentItem",C.selectedItem)}});ie(n,[a,y(),i]);let s=y({tag:"label",className:"info",innerHTML:`
			<span>bearings: left${ai()}right</span>
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
		`}),l=y({tag:"div",className:"doubleInput"}),E=Pt(t,"leftSideBearing","currentItem","input-number"),T=Pt(t,"rightSideBearing","currentItem","input-number");if(l.appendChild(E),l.appendChild(ii()),l.appendChild(T),t.displayType!=="Component"?(ie(e,[r,n]),(h=t==null?void 0:t.shapes)!=null&&h.length&&ie(e,[s,l])):ie(e,[we("name"),Pt(t,"name","currentItem","input")]),(u=t==null?void 0:t.shapes)!=null&&u.length){const C=!!z().multiSelect.shapes.length;ie(e,Qr()),ie(e,y({tag:"h4",content:C?"Overall paths":"Bulk-edit paths"})),ie(e,ni(t,"",[],C)),ie(e,j0(t,C))}return ie(e,Qr()),ie(e,Jg()),ie(e,Zg()),e}function Ju(t){var r;if(!((r=t==null?void 0:t.usedIn)!=null&&r.length))return"";let e=y({tag:"div",className:"panel__card full-width item-links__rows-area",innerHTML:`
		<h3>Links</h3>
		This ${t.displayType} is linked to the following items.
		It is used as a component root and will show up in these items as a component instance.
		`});return t.usedIn.forEach(n=>{e.appendChild(O1(n))}),z().subscribe({topic:"currentItem",subscriberID:"ItemLinkRow",callback:()=>{const n=z(),a=ce();document.querySelectorAll(".item-link__thumbnail").forEach(s=>{const l=s.getAttribute("target-item-id"),E=n.project.getItem(l);s.innerHTML=a.makeItemThumbnail(E)})}}),e}function Zu(t){const e=ce(),r=z();let n=y({tag:"div",className:"panel__card no-card",style:"grid-template-columns: max-content 1fr max-content;"}),a=wA(t,-1),i=r.project.getItemName(a.id,!0),s=y({tag:"fancy-button",className:"thumbnail-button button-left",attributes:{minimal:""},title:`Navigate to:
${i}
${a.id}`});s.innerHTML=e.makeItemThumbnail(a,24)+"<span>Previous&nbsp;item</span>",s.addEventListener("click",()=>{r.selectedItemID=a.id,r.history.addState(`Navigated to ${i}`)});let l=wA(t,1),E=r.project.getItemName(l.id,!0),T=y({tag:"fancy-button",className:"thumbnail-button button-right",attributes:{minimal:""},title:`Navigate to:
${E}
${l.id}`});return T.innerHTML="<span>Next&nbsp;item</span>"+e.makeItemThumbnail(l,24),T.addEventListener("click",()=>{r.selectedItemID=l.id,r.history.addState(`Navigated to ${E}`)}),ie(n,[s,xe("<span></span>"),T]),n}function wA(t,e){var E,T,h,u,C;const r=ce(),n=t.id;let a={};(E=t==null?void 0:t.id)!=null&&E.startsWith("glyph-")?a=r.glyphs:(T=t==null?void 0:t.id)!=null&&T.startsWith("liga-")?a=r.ligatures:(h=t==null?void 0:t.id)!=null&&h.startsWith("comp-")?a=r.components:(u=t==null?void 0:t.id)!=null&&u.startsWith("kern-")&&(a=r.kerning);let i=Object.keys(a);i.sort(),(C=t==null?void 0:t.id)!=null&&C.startsWith("glyph-")&&(i=i.filter(ju));const s=i.indexOf(n),l=i.at((s+e)%i.length);return r.getItem(l)}function ju(t){const e=ce();let r=!1,n=e.settings.project.characterRanges.filter(a=>a.enabled);for(let a=0;a<n.length;a++)if(n[a].getMemberIDs().indexOf(t.substring(6))>-1){r=!0;break}return r}function Xu(t){let e=y({tag:"div",className:"panel__card",innerHTML:`<h3>Path ${t.ident||""}</h3>`}),r=we("path name"),n=Pt(t,"name","currentPath","input"),a=y({tag:"label",className:"info",innerHTML:`
			<span>winding</span>
			<info-bubble>
				<h1>Winding</h1>
				Ordered Path Points that make up a path outline have either a clockwise or counter-clockwise direction.
				This path direction is also known as a path&rsquo;s &ldquo;winding&rdquo;.
				Paths with the same winding will visually combine, opposite windings will cut-out.
				<br><br>
				For example, to create the glyph &lsquo;o&rsquo;, draw two overlapping oval paths.
				If the outside oval has a clockwise winding, select the inside oval and change it&rsquo;s winding to counter-clockwise.
				This will result in the inside oval appearing transparent (or cutting out) in relation to the outside oval.
				<br><br>
				<div style="display: grid; gap: 10px; grid-template-columns: 1fr 1fr; width: 350px;">
					<span>Same Winding</span>
					<span>Different Winding</span>
					<img
						alt="Paths with the same winding will visually combine"
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
		`}),i=y({tag:"option-toggle",innerHTML:"<option>Clockwise</option><option>Counter-clockwise</option>",attributes:{"selected-name":i0(t.winding),"selected-value":i0(t.winding)},onClick:()=>{const E=z();t.reverseWinding(),E.history.addState(`Toggled path winding to ${i0(t.winding)}`),E.publish("currentPath",t)}}),s=ni(t),l=j0(t);return ie(e,[r,n,a,i,s,l]),ie(e,Qr()),ie(e,xE()),e}function i0(t){let e="Unknown";return t>0&&(e="Counter-clockwise"),t<0&&(e="Clockwise"),e}function qu(t){let e=y({tag:"div",className:"panel__card",innerHTML:`<h3>${t.shapes.length} selected shapes</h3>`});return ie(e,ni(t)),ie(e,j0(t)),ie(e,xE()),e}function Qu(t){const e=z();let r=y({tag:"div",className:"panel__card",innerHTML:`<h3>Path point ${t.pointNumber+1} ${t.ident||""}</h3>`}),n=ni(t.p,"point"),a=we("point type"),i=y();ie(i,[o0("symmetric",t.type==="symmetric",()=>{t.type="symmetric",t.makeSymmetric(),e.publish("currentPathPoint",t)}),o0("flat",t.type==="flat",()=>{t.type="flat",t.makeFlat(),e.publish("currentPathPoint",t)}),o0("corner",t.type==="corner",()=>{t.type="corner",e.publish("currentPathPoint",t)})]),e.subscribe({topic:"currentPathPoint",subscriberID:"pointTypeButtons",callback:E=>{document.getElementById(`pointTypeButton-${E.type}`)&&(document.getElementById("pointTypeButton-symmetric").removeAttribute("selected"),document.getElementById("pointTypeButton-flat").removeAttribute("selected"),document.getElementById("pointTypeButton-corner").removeAttribute("selected"),document.getElementById(`pointTypeButton-${E.type}`).setAttribute("selected","")),xo("h1",E),xo("h2",E)}});let s=y({id:"h1Group",className:"span-all-columns"});ie(s,YA("h1",t));let l=y({id:"h2Group",className:"span-all-columns"});return ie(l,YA("h2",t)),ie(r,n),ie(r,[a,i]),ie(r,[s,l]),ie(r,Qr()),ie(r,EE()),r}function YA(t="h1",e){let r=y({className:"pre-checkbox"}),n=Wn(e[t],"use","currentPathPoint");e.type!=="corner"&&n.setAttribute("disabled",""),ie(r,[n,y({tag:"h4",content:`Use handle ${t.charAt(1)}`})]);let a=y({id:`${t}InputGroup`,style:`display: ${e[t].use?"grid":"none"}`}),i=ni(e[t],t);return ie(a,i),z().subscribe({topic:"currentPathPoint",subscriberID:`controlPointInputGroup.${t}`,callback:s=>{s.type==="symmetric"&&s.makeSymmetric(t),s.type==="flat"&&s.makeFlat(t),xo("h1",s),xo("h2",s)}}),[r,a]}function xo(t="h1",e){let r=e;e.objType==="ControlPoint"&&(r=e.parent);let n=document.getElementById(`${t}Group`);if(n){let a=r[t].use,i=n.querySelector("input");if(i.removeAttribute("checked"),i.removeAttribute("disabled"),a){i.setAttribute("checked",""),r.type!=="corner"&&i.setAttribute("disabled","");let s=document.getElementById(`${t}InputGroup`);s.style.display="grid",s.querySelectorAll("input-number")[0].setAttribute("value",r[t].x),s.querySelectorAll("input-number")[1].setAttribute("value",r[t].y)}}}function $u(t){let e=y({tag:"div",className:"panel__card",innerHTML:`<h3>${t.pathPoints.length} selected path points</h3>`});return ie(e,EE()),e}function o0(t,e,r){let n=Lt.gray.l40,a=y({tag:"button",className:"pointTypeButton",id:`pointTypeButton-${t}`,attributes:{title:`point type: ${t}`}});a.addEventListener("click",r),e&&a.setAttribute("selected","");let i=`
	<svg version="1.1"
		xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		x="0" y="0" width="20" height="20" viewBox="0 0 20 20" enable-background="new 0 0 20 20">
		<g fill="${n}">
		<rect x="8" y="8" width="1" height="4"/>
		<rect x="11" y="8" width="1" height="4"/>
		<rect x="8" y="8" width="4" height="1"/>
		<rect x="8" y="11" width="4" height="1"/>
		<rect x="4" y="4" width="1" height="1"/>
		<rect x="5" y="5" width="1" height="1"/>
		<rect x="6" y="6" width="1" height="1"/>
		<rect x="7" y="7" width="1" height="1"/>
		<circle cx="3" cy="3" r="1.5"/>
	`;switch(t){case"corner":i+=`
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
			`;break}return i+="</g></svg>",a.innerHTML=i,a}function ep(){const t=z();let e=t.multiSelect.shapes,r=t.multiSelect.points;if(he.selecting)return[tp()];let n=[];if(r.length===1)n.push(Qu(r.singleton));else if(r.length>1){let i=r.virtualShape;n.push($u(i))}e.length===1?e.singleton.objType==="ComponentInstance"?n.push(ku(e.singleton)):n.push(Xu(e.singleton)):e.length>1&&r.length===0&&n.push(qu(e.virtualGlyph)),n.push(zu(t.selectedItem)),n.push(Zu(t.selectedItem));const a=Ju(t.selectedItem);return a&&n.push(a),t.nav.page==="Ligatures"&&n.push(y({tag:"fancy-button",content:"Create a new ligature",attributes:{secondary:""},onClick:Rs,style:"margin-top: 10px;"})),t.nav.page==="Components"&&n.push(y({tag:"fancy-button",content:"Create a new component",attributes:{secondary:""},onClick:Hs,style:"margin-top: 10px;"})),t.subscribe({topic:"whichShapeIsSelected",subscriberID:"attributesPanel",callback:()=>{dr()}}),t.subscribe({topic:"whichPathPointIsSelected",subscriberID:"attributesPanel",callback:()=>{dr()}}),n}function tp(){const t=z();let e=t.multiSelect.points.length,r=t.multiSelect.shapes.length,n="";if(e===0)r===0&&(n="Drag to select..."),r===1&&(n="1 selected shape"),r>1&&(n=`${r} selected shapes`);else{let i=e>1?"path points":"path point",s=r>1?"shapes":"shape";n=`${e} selected ${i} across ${r} ${s}`}return y({tag:"div",className:"panel__card",innerHTML:`<h3>${n}</h3>`})}let Ba,Ha;function gs(t,e="",r=z()){Ba=t,Ha=!0;let n=y({tag:"div",className:"item-chooser__wrapper"}),a=y({tag:"div",className:"item-chooser__header"});a.appendChild(np(r,e)),n.appendChild(a);let i=e||r.nav.page;return i==="Ligatures"&&Gt(r.project.ligatures)>0?n.appendChild(Bo(r)):i==="Components"&&Gt(r.project.components)>0?n.appendChild(Ho(r)):n.appendChild(Oo(r)),n}function rp(t,e){Ba=e,Ha=!0;let r=y({tag:"div",className:"item-chooser__wrapper"});if(t==="Ligatures")r.appendChild(Bo()),r.appendChild(y({tag:"fancy-button",innerHTML:"Create a new ligature",attributes:{secondary:""},onClick:Rs}));else if(t==="Components")r.appendChild(Ho()),r.appendChild(y({tag:"fancy-button",innerHTML:"Create a new component",attributes:{secondary:""},onClick:Hs}));else if(t==="Kerning")r.appendChild(ax()),r.appendChild(y({tag:"fancy-button",innerHTML:"Create a new kern group",attributes:{secondary:""},onClick:()=>Go(!1),style:"margin-top: 10px;"}));else{let n=y({tag:"div",className:"item-chooser__header"});r.appendChild(n),n.appendChild(ap()),r.appendChild(Oo())}return r}function np(t=z(),e=""){let r=Gt(t.project.components),n=Gt(t.project.ligatures),a;e==="Components"&&r>0?a={name:"Components",id:`Components ${r}&nbsp;items`}:e==="Ligatures"&&n>0?a={name:"Ligatures",id:`Ligatures ${n}&nbsp;items`}:a=t.selectedCharacterRange;let i=y({tag:"option-chooser",attributes:{"selected-name":a.name,"selected-id":a.id}}),s;return n&&(s=y({tag:"option",innerHTML:"Ligatures",attributes:{note:`${n}&nbsp;items`}}),s.addEventListener("click",()=>{t.selectedCharacterRange="Ligatures",document.querySelector(".item-chooser__tile-grid").remove(),document.querySelector(".item-chooser__wrapper").appendChild(Bo(t))}),i.appendChild(s)),r&&(s=y({tag:"option",innerHTML:"Components",attributes:{note:`${r}&nbsp;items`}}),s.addEventListener("click",()=>{t.selectedCharacterRange="Components",document.querySelector(".item-chooser__tile-grid").remove(),document.querySelector(".item-chooser__wrapper").appendChild(Ho(t))}),i.appendChild(s)),(n||r)&&i.appendChild(y({tag:"hr"})),nx(i,t),i}function ap(t=z()){let e=t.selectedCharacterRange,r=y({tag:"option-chooser",attributes:{"selected-name":e.name,"selected-id":e.id}});return nx(r),r}function nx(t,e=z()){let r=e.project.settings.project.characterRanges,n;r.forEach(a=>{a.enabled&&(n=y({tag:"option",innerHTML:a.name,attributes:{note:a.note}}),n.addEventListener("click",()=>{e.selectedCharacterRange=a,document.querySelector(".item-chooser__tile-grid").remove(),document.querySelector(".item-chooser__wrapper").appendChild(Oo(e))}),t.appendChild(n))})}function Oo(t=z()){const e=t===z();let r=y({tag:"div",className:"item-chooser__tile-grid"}),n=t.selectedCharacterRange.getMemberIDs();if(n!=null&&n.length){const a=Fo(n,t.chooserPage.characters,t);n.length>a.length&&r.appendChild(Mo("characters",n,t)),a.forEach(i=>{const s=`glyph-${i}`;let l=new yo({"displayed-item-id":s,project:t.project});e&&t.selectedGlyphID===s&&l.setAttribute("selected",""),l.addEventListener("click",()=>Ba(s)),Ha&&t.subscribe({topic:"whichGlyphIsSelected",subscriberID:`glyphTile.${s}`,callback:E=>{parseInt(E)===parseInt(s)?e&&l.setAttribute("selected",""):l.removeAttribute("selected")}}),r.appendChild(l)})}else r.appendChild(y({tag:"i",content:"No characters in this range.<br><br>If this is a range of Control Characters, make sure they are enabled in: Settings > App > Show non-graphic control characters."}));return r}function Bo(t=z(),e=!0){const r=y({tag:"div",className:"item-chooser__tile-grid"}),n=t.project.sortedLigatures,a=Fo(n,t.chooserPage.ligatures,t);return n.length>a.length&&r.appendChild(Mo("ligatures",n,t)),a.forEach(i=>{let s=new yo({"displayed-item-id":i.id,project:t.project});e&&t.selectedLigatureID===i.id&&s.setAttribute("selected",""),s.addEventListener("click",()=>Ba(i.id)),Ha&&t.subscribe({topic:"whichLigatureIsSelected",subscriberID:`glyphTile.${i.id}`,callback:l=>{l===i.id?e&&s.setAttribute("selected",""):s.removeAttribute("selected")}}),r.appendChild(s)}),r}function Ho(t=z(),e=!0){let r=y({tag:"div",className:"item-chooser__tile-grid"});const n=t.project.sortedComponents,a=Fo(n,t.chooserPage.components,t);return n.length>a.length&&r.appendChild(Mo("components",n,t)),a.forEach(i=>{let s=new yo({"displayed-item-id":i.id,project:t.project});e&&t.selectedComponentID===i.id&&s.setAttribute("selected",""),s.addEventListener("click",()=>Ba(i.id)),Ha&&t.subscribe({topic:"whichComponentIsSelected",subscriberID:`glyphTile.${i.id}`,callback:l=>{l===i.id?e&&s.setAttribute("selected",""):s.removeAttribute("selected")}}),r.appendChild(s)}),r}function ax(t=z()){let e=y({tag:"div",className:"kern-group-chooser__list"});const r=t.project.sortedKernGroups,n=Fo(r,t.chooserPage.kerning,t);return r.length>n.length&&e.appendChild(Mo("kerning",r,t)),n.forEach(a=>{let i=ix(a.id);t.selectedKernGroupID===a.id&&i.setAttribute("selected",""),i.addEventListener("click",()=>Ba(a.id)),Ha&&t.subscribe({topic:"whichKernGroupIsSelected",subscriberID:`kernGroupRow.${a.id}`,callback:s=>{s===a.id?i.setAttribute("selected",""):i.removeAttribute("selected")}}),e.appendChild(i)}),e}function ix(t,e=ce()){const r=e.getItem(t),n=y({className:"kern-group-chooser__row"}),a=y({className:"kern-group-chooser__left-members"});a.appendChild(Ra(r.leftGroup));const i=y({className:"kern-group-chooser__right-members"});return i.appendChild(Ra(r.rightGroup)),ie(n,[y({content:t}),a,y({className:"kern-group-chooser__members-divider",content:"&emsp;|&emsp;"}),i]),n}function Fo(t=[],e=0,r=z()){const n=parseInt(r.project.settings.app.itemChooserPageSize)||256;if(t.length<n)return t;const a=e*n,i=a+n;return t.slice(a,i)}function Mo(t,e=[],r=z()){const n={characters:Oo,ligatures:Bo,components:Ho,kerning:ax},a=parseInt(r.project.settings.app.itemChooserPageSize)||256,i=r.chooserPage[t],s=Math.ceil(e.length/a),l=y({tag:"button",className:"editor-page__tool",content:"◁"});r.chooserPage[t]===0?l.setAttribute("disabled",""):l.addEventListener("click",()=>{r.chooserPage[t]-=1,r.chooserPage[t]=Math.max(r.chooserPage[t],0);let h;t==="kerning"?h=document.querySelector(".kern-group-chooser__list"):h=document.querySelector(".item-chooser__tile-grid"),h.innerHTML="",h.appendChild(n[t]())});const E=y({tag:"button",className:"editor-page__tool",content:"▷"});r.chooserPage[t]===s-1?E.setAttribute("disabled",""):E.addEventListener("click",()=>{r.chooserPage[t]+=1,r.chooserPage[t]=Math.min(r.chooserPage[t],s-1);let h;t==="kerning"?h=document.querySelector(".kern-group-chooser__list"):h=document.querySelector(".item-chooser__tile-grid"),h.innerHTML="",h.appendChild(n[t]())});const T=y({tag:"div",className:"item-chooser__page-control"});return ie(T,[l,y({content:`Page ${i+1} of ${s}`}),E]),T}class Ln extends Pr{constructor({leftGroup:e=[],rightGroup:r=[],value:n=0}={}){super(),this.leftGroup=e,this.rightGroup=r,this.value=n,this.objType="KernGroup"}save(e=!1){const r={leftGroup:this.leftGroup.slice(),rightGroup:this.rightGroup.slice(),value:this._value};return e&&(r.objType=this.objType),r}print(e=0){let r="";for(let a=0;a<e;a++)r+="  ";let n=`${r}{${this.objType} 
`;return r+="  ",n+=`${r}leftGroup: ${JSON.stringify(this.leftGroup)}
`,n+=`${r}rightGroup: ${JSON.stringify(this.rightGroup)}
`,n+=`${r}value: ${this.value}
`,n+=`${r.substring(2)}}/${this.objType}`,n}get leftGroup(){return this._leftGroup||[]}get rightGroup(){return this._rightGroup||[]}get value(){return this._value||0}get name(){return`${this.leftGroupAsString} | ${this.rightGroupAsString}`}get leftGroupAsString(){let e="";return this.leftGroup&&(e=Mr(this.leftGroup.join(""))),e||""}get rightGroupAsString(){let e="";return this.rightGroup&&(e=Mr(this.rightGroup.join(""))),e||""}set leftGroup(e){e=e.map(r=>ir(r)),e=e.filter(kn),this.changed(),this._leftGroup=e}set rightGroup(e){e=e.map(r=>ir(r)),e=e.filter(kn),this.changed(),this._rightGroup=e}set value(e){this._value=He(e)||0,this.changed()}}const ip=Object.freeze(Object.defineProperty({__proto__:null,KernGroup:Ln},Symbol.toStringTag,{value:"Module"}));function op(){const t=z(),e=t.selectedKernGroupID,a=y({tag:"div",id:"app__page",innerHTML:`
		<div class="editor__page">
			<div class="editor-page__left-area">
				<div class="editor-page__nav-area">
					${Vt({level:"l1",superTitle:"PAGE",title:"Kerning"})}
				</div>
				<div id="editor-page__panel"></div>
			</div>
			${e?`
		<div class="editor-page__tools-area"></div>
		<div class="editor-page__edit-canvas-wrapper"></div>
		<div class="editor-page__zoom-area"></div>
	`:'<div class="editor-page__edit-canvas-wrapper" style="grid-column: span 2; overflow-y: scroll;"></div>'}
		</div>
	`});t.showPageTransitions&&a.classList.add("app__page-animation");let i=a.querySelector("#nav-button-l1");i.addEventListener("click",function(){zt(i)});const s=a.querySelector(".editor-page__nav-area"),l=a.querySelector(".editor-page__edit-canvas-wrapper");if(!e)return ie(l,sp()),s.style.display="block",i.style.width="100%",i.style.borderRadius="4px",a;const E=t.selectedKernGroup,T=Vt({level:"l2",superTitle:"EDITING",title:E.name}),h=Vt({level:"l3",superTitle:"PANEL",title:t.nav.panel});s.appendChild(xe(T)),s.appendChild(xe(h));const u=y({tag:"edit-canvas",id:"editor-page__edit-canvas",attributes:{"editing-item-id":t.selectedKernGroupID}});l.appendChild(u);let C=a.querySelector("#nav-button-l2");C.addEventListener("click",function(){zt(C)}),t.subscribe({topic:"whichKernGroupIsSelected",subscriberID:"nav.kernChooserButton",callback:()=>{var te;t.selectedKernGroup&&(C.innerHTML=fa((te=t.selectedKernGroup)==null?void 0:te.name,"EDITING"))}});let g=a.querySelector("#nav-button-l3");g.addEventListener("click",function(){zt(g)});const H=a.querySelector("#editor-page__panel");H.appendChild(Ti()),H.addEventListener("scroll",$r),t.subscribe({topic:["whichKernGroupIsSelected"],subscriberID:"nav.panelChooserButton",callback:()=>{dr()}}),t.selectedTool="kern";let F=a.querySelector(".editor-page__tools-area");F.innerHTML="";let K=KS();K&&ie(F,K);let j=a.querySelector(".editor-page__zoom-area");j.innerHTML="";let Q=Uo();return Q&&ie(j,Q),t.subscribe({topic:"whichKernGroupIsSelected",subscriberID:"editCanvas.selectedKernGroup",callback:te=>{a.querySelector("#editor-page__edit-canvas").setAttribute("editing-item-id",te)}}),a}function sp(){const t=y({className:"editor-page__first-run",innerHTML:`
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
		`}),e=y({tag:"fancy-button",innerHTML:"Create a new kern group",onClick:()=>Go(!1)});return t.appendChild(e),t}function Ap(t,e,r){const n=Cs(),a=ce();return a.addItemByType(new Ln({leftGroup:t,rightGroup:e,value:r}),"KernGroup",n),a.kerning[n]}function Cs(t=ce().kerning){let e=Gt(t);for(;t[`kern-${e}`];)e++;return`kern-${e}`}function Go(t){const e=y({innerHTML:`
		<h2>${t?"Edit this":"Create a new"} kern group</h2>
		Specify which characters should be in the left-side group,
		the right-side group, then what distance in <code>Em</code>
		units should be used for the kern value.
		<br><br>

		<h3>Left group</h3>
		<input id="kerning__add-new-kern-group__left-group" type="text"
		value="${t?t.leftGroupAsString:""}"
		autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
		/>
		<br><br>
		<h3>Right group</h3>
		<input id="kerning__add-new-kern-group__right-group" type="text"
		value="${t?t.rightGroupAsString:""}"
		autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
		/>
		<br><br>
		<h3>Value</h3>
		<input id="kerning__add-new-kern-group__value" type="text"
			value="${t?t.value:""}"
			autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
		/>
		<br><br>
		<fancy-button disabled id="kerning__add-new-kern-group__submit-button">
			${t?"Save changes":"Create kern group"}
		</fancy-button>
		`}),r=e.querySelector("#kerning__add-new-kern-group__submit-button"),n=e.querySelector("#kerning__add-new-kern-group__left-group"),a=e.querySelector("#kerning__add-new-kern-group__right-group"),i=e.querySelector("#kerning__add-new-kern-group__value");n.addEventListener("change",s),a.addEventListener("change",s),i.addEventListener("change",s),n.addEventListener("keyup",s),a.addEventListener("keyup",s),i.addEventListener("keyup",s),t&&(r.removeAttribute("disabled"),r.addEventListener("click",l));function s(){n.value!==""&&a.value!==""&&i.value?(r.removeAttribute("disabled"),r.addEventListener("click",l)):(r.setAttribute("disabled",""),r.removeEventListener("click",l))}function l(){const E=z();let T=Va(n.value),h=Va(a.value),u=parseInt(i.value);if(t)t.leftGroup=T,t.rightGroup=h,t.value=u,E.history.addState("Edited kern group: "+E.selectedKernGroupID),E.publish("currentKernGroup",E.selectedKernGroup),E.navigate(),ze();else{const C=Ap(T,h,u);typeof C=="string"?Ir(C):(E.selectedItemID=C.id,E.navigate(),E.history.addWholeProjectChangePostState(),ze())}}Cr(e,500)}function lp(){const t=y({innerHTML:`
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
		`}),e=t.querySelector("#kerning__letter-pair__left-group");e.addEventListener("change",yn),e.addEventListener("keyup",yn);const r=t.querySelector("#kerning__letter-pair__right-group");r.addEventListener("change",yn),r.addEventListener("keyup",yn),t.querySelector("#kerning__letter-pair__search-button").addEventListener("click",Ep),Cr(t,800)}function xp(){const t=y({innerHTML:`
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
		`}),e=t.querySelector("#kerning__letter-pair__left-group");e.addEventListener("change",yn),e.addEventListener("keyup",yn);const r=t.querySelector("#kerning__letter-pair__right-group");r.addEventListener("change",yn),r.addEventListener("keyup",yn),t.querySelector("#kerning__letter-pair__search-button").addEventListener("click",cp),Cr(t,800)}function yn(){const t=document.querySelector("#kerning__letter-pair__left-group"),e=document.querySelector("#kerning__letter-pair__right-group"),r=document.querySelector("#kerning__letter-pair__search-button");t.value.length&&e.value.length?r.removeAttribute("disabled"):r.setAttribute("disabled","")}function Ep(){const e=document.querySelector("#kerning__letter-pair__left-group").value.charAt(0),n=document.querySelector("#kerning__letter-pair__right-group").value.charAt(0),a=ce().kerning,i=[];Object.keys(a).forEach(l=>{a[l].leftGroup.includes(qr(e))&&a[l].rightGroup.includes(qr(n))&&i.push(l)});const s=document.querySelector("#kerning__letter-pair__results");if(s.innerHTML="",i.length){const l=z().selectedKernGroupID;i.forEach(E=>{let T=ix(E);T.addEventListener("click",()=>{const h=z();h.selectedItemID=E,h.history.addState(`Navigated to ${h.project.getItemName(E,!0)}`),document.querySelectorAll(".kern-group-chooser__row").forEach(C=>C.removeAttribute("selected")),T.setAttribute("selected","")}),E===l&&T.setAttribute("selected",""),s.appendChild(T)})}else s.innerHTML="<i>No Kern Groups exist with that letter pair</i>"}function cp(){const e=document.querySelector("#kerning__letter-pair__left-group").value.charAt(0),n=document.querySelector("#kerning__letter-pair__right-group").value.charAt(0),a=document.querySelector("#kerning__result-message");a.innerHTML="";const i=ce().kerning;let s,l=[],E=[];Object.keys(i).forEach(T=>{i[T].leftGroup.includes(qr(e))&&i[T].rightGroup.includes(qr(n))&&(s=hp(e,n,T),s?E.push(T):l.push(T))}),l.length&&(a.innerHTML=`
			<br><br>
			<b>Warning</b><br>
			The following Kern Groups contain the specified letter pair, but
			the letters could not be removed because both the left group and
			the right group contain multiple members.
			<br><br>
			${l.join(", ")}
			<br><br>
			<hr>
		`),E.length>0?(a.innerHTML+=`
			<br>
			Successfully removed letter pair from Kern Group${E.length>1?"s:":":"}
			<br><br>
			${E.join(", ")}
		`,z().navigate()):l.length||(a.innerHTML+=`
				<br>
				<i>No Kern Groups with the specified letter pair was found.</i>
			`)}function hp(t="",e="",r=""){let n={},a=qr(t),i=qr(e);const s=z();let l=!1;if(r){let E=s.project.getItem(r);E&&(n[r]=E)}else n=s.project.kerning;return Object.keys(n).forEach(E=>{let T=n[E].leftGroup,h=n[E].rightGroup;T.includes(a)&&h.includes(i)&&(T.length===1&&h.length===1?(s.deleteItem(E,s.project.kerning),l=!0):T.length===1?(h.splice(h.indexOf(i),1),l=!0):h.length===1&&(T.splice(T.indexOf(a),1),l=!0))}),l}function Ra(t){const e=y();return t.forEach(r=>{e.appendChild(Lp(r))}),e}function Lp(t){let e=Mr(t)||"",r=Da(t),n=t;return r&&(n=`${r}
${t}`),y({tag:"code",innerHTML:e,attributes:{title:n}})}function Tp(t){let e=y({tag:"div",className:"panel__card",innerHTML:"<h3>Kern Group</h3>"}),r=we("Value"),n=Pt(t,"value","currentKernGroup","input-number"),a=we("Left group"),i=Ra(t.leftGroup),s=we("Right group"),l=Ra(t.rightGroup);return ie(e,[r,n,a,i,s,l]),ie(e,Qr()),ie(e,Xg()),e}function dp(){let t=y({tag:"div",className:"panel__card",innerHTML:"<h3>Other kern group actions</h3>"}),e=y({tag:"div",className:"panel__actions-area"});return ar(e,xr("otherKernGroupActions")),t.appendChild(e),t}function Ip(){const t=z();if(Gt(t.project.kerning)<=0)return[];const e=y({tag:"fancy-button",content:"Create a new kern group",attributes:{secondary:""},onClick:()=>Go(!1)});return[Tp(t.selectedKernGroup),dp(),e]}function Eo(t=50,e,r=0,n=100,a=1){let i=y({className:"fancy-slider__wrapper"}),s=y({className:"fancy-slider__slider-readout",innerHTML:""+t});const l=t/(n-r)*100;let E=y({tag:"input",attributes:{type:"range",value:t,style:`accent-color: hsl(${l+200}, 100%, 40%);`,min:r,max:n,step:a},className:"fancy-slider__bar"});return E.addEventListener("input",T=>{const h=parseInt(T.target.value);s.innerHTML=""+h;const u=h/(n-r)*100;E.setAttribute("style",`accent-color: hsl(${u+200}, 100%, 40%);`),e&&e(h)}),ie(i,[E,s]),i}function up(){const t=z(),e=ce();let r=y({tag:"div",className:"panel__card",innerHTML:"<h3>Characters</h3>"}),n=y({tag:"p",className:"spanAll",content:`Context characters are a small set of letters that are shown around
		the character you are currently editing.`});const a=e.settings.app.contextCharacters;let i=we("Show&nbsp;context&nbsp;characters&nbsp;&nbsp;"),s=lr(a,"showCharacters",()=>{z().autoFitView(),WA()}),l=Pt(t.selectedItem,"contextCharacters","editCanvasView","input",["input"]);l.addEventListener("input",()=>z().autoFitView());let E=we("Transparency"),T=Eo(a.characterTransparency,F=>{a.characterTransparency=F,z().editCanvas.redraw()});l.classList.add("spanAll"),ie(r,[n,l,Qr(),i,s,E,T]);let h=y({tag:"div",className:"panel__card",innerHTML:`<h3>Guides and labels</h3>
	`}),u=we("Show guides and labels"),C=lr(a,"showGuides",WA),g=we("Transparency"),H=Eo(a.guidesTransparency,F=>{a.guidesTransparency=F,z().editCanvas.redraw()});return ie(h,[u,C,g,H]),[r,h,Wx(!0)]}function WA(){z().editCanvas.redraw()}function ox({iconName:t="default",iconOptions:e=!1,title:r="",disabled:n=!1,onClick:a=()=>{},id:i=!1}={}){let s=y({tag:"button",innerHTML:_e[t](e),attributes:{title:r}});return a&&s.addEventListener("click",a),n&&s.setAttribute("disabled","disabled"),typeof i=="string"&&s.setAttribute("id",i),s}let _e={};function je(t,e="30"){return`
		<svg
			version="1.1" viewBox="0 0 ${e} ${e}"
			height="100%" width="100%"
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		>
			${t}
			`}let Le={darkFill:Lt.gray.l25,lightFill:Lt.gray.l85,blueOutline:Lt.blue.l70,greenOutline:Lt.green.l70,grayOutline:Lt.gray.l70,purpleOutline:Lt.purple.l40,redX:xn.red};_e.copy=()=>{let t="",e=Le.blueOutline,r=Le.grayOutline,n=Le.darkFill;return t+=`
		<polygon fill="${n}" points="1,22 1,10.4 10.4,1 18,1 18,22"/>
		<path fill="${r}" d="M17,2v19H2V10.8L10.8,2H17 M19,0h-9L0,10v13h19V0L19,0z"/>
		<polygon fill="${n}" points="12,29 12,17.4 21.4,8 29,8 29,29"/>
		<path fill="${e}" d="M28,9v19H13V17.8L21.8,9H28 M30,7h-9L11,17v13h19V7L30,7z"/>
	`,je(t)};_e.paste=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<rect fill="${r}" x="5" y="7"	width="20" height="22"/>
		<path fill="${e}" d="M24,8v20H6V8H24 M26,6H4v24h22V6L26,6z"/>
		<path fill="${r}" d="M9,9V4h3V3c0-1.3,1.8-2,3-2s3,0.7,3,2v1h3v5H9z"/>
		<path fill="${e}" d="M15,2c0.9,0,2,0.5,2,1v2h2h1v3H10V5h1h2V3C13,2.5,14.1,2,15,2 M15,0c-1.7,0-4,1-4,3H8v7h14V3h-3C19,1,16.7,0,15,0L15,0z"/>
	`,je(t)};_e.clearClipboard=()=>{let t="",e=Le.blueOutline,r=Le.darkFill,n=Le.redX;return t+=`
		<rect fill="${r}" x="5" y="7"	width="20" height="22"/>
		<path fill="${e}" d="M24,8v20H6V8H24 M26,6H4v24h22V6L26,6z"/>
		<path fill="${r}" d="M9,9V4h3V3c0-1.3,1.8-2,3-2s3,0.7,3,2v1h3v5H9z"/>
		<path fill="${e}" d="M15,2c0.9,0,2,0.5,2,1v2h2h1v3H10V5h1h2V3C13,2.5,14.1,2,15,2 M15,0c-1.7,0-4,1-4,3H8v7h14V3h-3C19,1,16.7,0,15,0L15,0z"/>
		<path fill="${n}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${n}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>
	`,je(t)};_e.pastePathsFromAnotherGlyph=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<rect fill="${r}" x="5" y="7"	width="20" height="22"/>
		<path fill="${e}" d="M24,8v20H6V8H24 M26,6H4v24h22V6L26,6z"/>
		<path fill="${r}" d="M9,9V4h3V3c0-1.3,1.8-2,3-2s3,0.7,3,2v1h3v5H9z"/>
		<path fill="${e}" d="M15,2c0.9,0,2,0.5,2,1v2h2h1v3H10V5h1h2V3C13,2.5,14.1,2,15,2 M15,0c-1.7,0-4,1-4,3H8v7h14V3h-3C19,1,16.7,0,15,0L15,0z"/>
		<path fill="${e}" d="M17.4,20.6h-4.8l-1,3h1.6v1.7H8v-1.7h1.6l3.6-10.2h-1.6V12h6.8v1.5h-1.7l3.7,10.2H22v1.7h-5.2v-1.7h1.7L17.4,20.6z M16.9,19.1l-1.8-5.6H15l-1.8,5.6H16.9z"/>
	`,je(t)};_e.pastePathsFromAnotherProject=()=>{let t=Le.lightFill,e=Le.purpleOutline;const r=`
		<path fill="${t}" d="m11.5,1c4.817,0,7.471,0,8.986,1.514,1.514,1.515,1.514,4.168,1.514,8.986s0,7.471-1.514,8.985c-1.515,1.515-4.168,1.515-8.986,1.515s-7.471,0-8.985-1.515c-1.515-1.514-1.515-4.168-1.515-8.985s0-7.471,1.515-8.986c1.514-1.514,4.168-1.514,8.985-1.514"/>
		<path fill="${e}" d="m11.5,23c-5.084,0-7.886,0-9.692-1.808-1.808-1.808-1.808-4.608-1.808-9.692S0,3.615,1.808,1.808C3.614,0,6.416,0,11.5,0s7.886,0,9.692,1.808c1.808,1.808,1.808,4.608,1.808,9.692s0,7.885-1.808,9.692c-1.807,1.808-4.608,1.808-9.692,1.808Zm0-21c-4.55,0-7.057,0-8.278,1.222s-1.222,3.729-1.222,8.278,0,7.057,1.222,8.278,3.728,1.222,8.278,1.222,7.057,0,8.278-1.222,1.222-3.729,1.222-8.278,0-7.057-1.222-8.278-3.728-1.222-8.278-1.222Z"/>
		<rect fill="${e}" x="5" y="5" width="3" height="3"/>
		<path fill="${t}" d="m18.5,8c4.817,0,7.471,0,8.986,1.514,1.514,1.515,1.514,4.168,1.514,8.986s0,7.471-1.514,8.985c-1.515,1.515-4.168,1.515-8.986,1.515s-7.471,0-8.985-1.515c-1.515-1.514-1.515-4.168-1.515-8.985s0-7.471,1.515-8.986c1.514-1.514,4.168-1.514,8.985-1.514"/>
		<path fill="${e}" d="m28.192,8.808c-1.807-1.808-4.608-1.808-9.692-1.808-.176,0-.329,0-.5,0v-2.001h-3v2.033c-.735.022-1.389.068-2,.133v-2.166h-3v2.961c-.437.228-.841.495-1.192.847-.352.352-.618.756-.847,1.192h-2.961v3h2.166c-.065.611-.111,1.265-.133,2h-2.033v3h2.001c0,.171,0,.324,0,.5,0,5.084,0,7.885,1.808,9.692,1.807,1.808,4.608,1.808,9.692,1.808s7.886,0,9.692-1.808c1.808-1.808,1.808-4.608,1.808-9.692s0-7.885-1.808-9.692Zm-1.414,17.971c-1.222,1.222-3.728,1.222-8.278,1.222s-7.057,0-8.278-1.222-1.222-3.729-1.222-8.278,0-7.057,1.222-8.278,3.728-1.222,8.278-1.222,7.057,0,8.278,1.222,1.222,3.729,1.222,8.278,0,7.057-1.222,8.278Z"/>
		<path fill="${e}" d="m20.233,20h-3.467l-1.092,3h1.525v2h-5.2v-2h1.733l3.467-9h-1.733v-2h6.067v2h-1.733l3.467,9h1.733v2h-5.2v-2h1.517l-1.083-3Zm-.433-1l-1.3-4-1.3,4h2.6Z"/>
	`;return je(r)};_e.addPath=function(t=!1){let e="",r=Le.blueOutline,n=Le.darkFill;return t&&(r=Le.greenOutline,n=Le.lightFill),e+=`
		<rect fill="${n}" x="1" y="1"	width="16" height="16"/>
		<path fill="${r}" d="M16,2v14H2V2H16 M18,0H0v18h18V0L18,0z"/>
	`,e+=`
		<rect x="21" y="15" fill="${r}" width="3" height="15"/>
		<rect x="15" y="21" fill="${r}" width="15" height="3"/>
	`,je(e)};_e.undo=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<path fill="${r}" d="M20.1,23c4.6-5,6.6-9.6,5.5-12.8C24.9,8.2,22.9,7,20,7c-5.9,0-8.8,5.3-8.9,5.5L10.9,13l2.4,4.1l-12,0.8l4-14.4l2.5,4.2l0.9-1.1c0,0,4-4.6,11.2-4.6c4.1,0,7.9,2.8,8.8,6.5C29.4,10.8,29.3,16.3,20.1,23z"/>
		<path fill="${e}" d="M20,3c3.1,0,6.9,2,7.8,5.7c0.5,2.1-0.1,4.4-1.6,6.7c0.7-2,0.9-3.9,0.3-5.5C25.7,7.4,23.3,6,20,6c-6.5,0-9.6,5.8-9.8,6.1l-0.5,1l0.6,1l1.3,2.2l-8.9,0.6L5.7,6l0.6,1l1.4,2.4l1.8-2.2C9.6,7.2,13.2,3,20,3 M20,1C12.2,1,8,6,8,6L5,1L0,19l15-1l-3-5c0,0,2.6-5,8-5c7.7,0,7.2,9.2-8,21C39.8,15,29.5,1,20,1L20,1z"/>
	`,je(t)};_e.linkToGlyph=()=>{let t="",e=Le.greenOutline;return t+=`
		<path fill="${e}" d="M18,8.8L8.8,18c-0.5,0.5-1.3,0.5-1.8,0s-0.5-1.3,0-1.8L16.2,7c0.5-0.5,1.3-0.5,1.8,0S18.5,8.3,18,8.8z"/>
		<path fill="${e}" d="M7.5,21.2c-1.1,1.1-2.8,1.8-4.1,0.5s-0.6-3,0.5-4.1l5.9-5.9c-1.8-0.5-3.8,0.1-5.5,1.8L2,15.7c-2.4,2.4-2.6,5.7-0.5,7.8s5.4,2,7.8-0.5l2.3-2.3c1.7-1.7,2.3-3.7,1.8-5.5L7.5,21.2z"/>
		<path fill="${e}" d="M21.2,7.5c1.1-1.1,1.8-2.8,0.5-4.1s-3-0.6-4.1,0.5l-5.9,5.9c-0.5-1.8,0.1-3.8,1.8-5.5L15.7,2c2.4-2.4,5.7-2.6,7.8-0.5s2,5.4-0.5,7.8l-2.3,2.3c-1.7,1.7-3.7,2.3-5.5,1.8L21.2,7.5z"/>
		<rect x="21" y="15" fill="${e}" width="3" height="15"/>
		<rect x="15" y="21" fill="${e}" width="15" height="3"/>
	`,je(t)};_e.round=()=>{let t=Le.redX,e=Le.darkFill,r=`
		<path fill="${t}" d="M17.4,21.9c0.4,0.5,2-0.5,1.4-1.4c-1.3-1.9-4.8-5.9-6.5-7.3C11.1,12.2,10,13,10,13S14.4,17.5,17.4,21.9z"/>
		<path fill="${t}" d="M12.2,21.6c-0.5,1-2.1-0.1-1.3-1.2c1.5-2.2,4.4-6.4,6.5-7.9c1.3-1,2.1-0.1,2.1-0.1S14.9,16.7,12.2,21.6z"/>
		<path fill="${t}" d="M28,21.9c0.4,0.5,2-0.5,1.4-1.4c-1.3-1.9-4.8-5.9-6.5-7.3c-1.2-1-2.3-0.3-2.3-0.3S24.9,17.5,28,21.9z"/>
		<path fill="${t}" d="M22.7,21.6c-0.5,1-2.1-0.1-1.3-1.2c1.5-2.2,4.4-6.4,6.5-7.9c1.3-1,2.1-0.1,2.1-0.1S25.5,16.7,22.7,21.6z"/>
		<path fill="${e}" d="M2,20V9H0V7h4v13h2v2H0v-2H2z"/>
		<path fill="${e}" d="M7,22v-2h2v2H7z"/>
	`;return je(r)};_e.flipVertical=()=>{let t="",e=Le.blueOutline,r=Le.grayOutline,n=Le.darkFill;return t+=`
		<polygon fill="${n}" points="6.4,13 1,7.6 1,1 14.7,1 29,9.6 29,13"/>
		<path fill="${r}" d="M14.2,2L28,10.1V12H6.8L2,7.2V2h12 M15,0H0v8l6,6h24V9L15,0L15,0z"/>
		<polygon fill="${n}" points="1,29 1,22.4 6.4,17 29,17 29,20.4 14.7,29"/>
		<path fill="${e}" d="M28,18v1.9L14.4,28H2v-5.2L6.8,18H28 M30,16H6l-6,6v8h15l15-9V16L30,16z"/>
	`,je(t)};_e.flipHorizontal=()=>{let t="",e=Le.blueOutline,r=Le.grayOutline,n=Le.darkFill;return t+=`
		<polygon fill="${n}" points="1,29 1,15.3 9.6,1 13,1 13,23.6 7.6,29"/>
		<path fill="${r}" d="M12,2v21.2L7.2,28H2V15.6L10.1,2H12 M14,0H9L0,15v15h8l6-6V0L14,0z"/>
		<polygon fill="${n}" points="22.4,29 17,23.6 17,1 20.4,1 29,15.3 29,29"/>
		<path fill="${e}" d="M19.9,2L28,15.6V28h-5.2L18,23.2V2H19.9 M21,0h-5v24l6,6h8V15L21,0L21,0z"/>
	`,je(t)};_e.exportGlyphSVG=()=>{let t=Le.blueOutline,e=Le.darkFill,r=`
      <rect x="7" y="1" width="16" height="2" fill="${t}"/>
      <polygon points="20 9 15 4 10 9 13.778 9 13.778 14 16.222 14 16.222 9 20 9" fill="${t}"/>
      <path d="M4.811,24.279c.448,0,.809-.071,1.083-.213s.413-.354.413-.638c0-.192-.054-.354-.162-.484-.108-.13-.314-.255-.621-.374-.306-.119-.759-.261-1.36-.425-.55-.147-1.036-.334-1.458-.561-.422-.227-.75-.519-.986-.876-.235-.356-.353-.802-.353-1.334,0-.539.15-1.018.45-1.437.3-.42.743-.75,1.326-.99.583-.241,1.297-.361,2.142-.361.805,0,1.506.104,2.104.31.598.207,1.115.47,1.551.787l-1.071,1.58c-.374-.231-.776-.417-1.207-.557-.431-.139-.864-.208-1.301-.208s-.761.059-.973.175-.319.29-.319.522c0,.153.056.284.166.396.11.11.319.224.625.34.306.116.754.259,1.343.429.583.165,1.092.354,1.526.569.433.216.769.503,1.007.863.238.359.357.834.357,1.424,0,.657-.196,1.208-.587,1.653-.391.444-.909.777-1.555.998-.646.222-1.354.332-2.125.332-.873,0-1.644-.125-2.312-.374-.669-.249-1.238-.578-1.708-.986l1.352-1.513c.351.272.749.499,1.194.68.445.182.931.272,1.458.272Z" fill="${e}"/>
      <path d="M19.214,16.884l-3.009,9.027h-3.162l-3.043-9.027h2.898l1.759,6.971,1.836-6.971h2.72Z" fill="${e}"/>
      <path d="M28.371,15.439l.629,1.972c-.317.125-.688.216-1.113.272-.425.057-.921.085-1.488.085.567.243.999.545,1.296.905.297.359.446.831.446,1.415s-.156,1.104-.468,1.56c-.312.456-.753.814-1.326,1.075-.573.261-1.25.391-2.032.391-.192,0-.374-.008-.544-.025-.17-.017-.337-.042-.501-.076-.096.051-.17.125-.221.221-.051.097-.076.195-.076.298,0,.142.058.27.174.383.116.113.389.17.82.17h1.479c.702,0,1.31.113,1.823.34.513.227.911.535,1.194.927.284.391.425.838.425,1.343,0,.924-.405,1.651-1.216,2.185-.81.532-2.014.799-3.612.799-1.156,0-2.05-.118-2.682-.353-.632-.235-1.071-.57-1.317-1.003-.247-.434-.37-.948-.37-1.543h2.38c0,.261.052.475.157.642.104.167.306.29.604.37.297.079.729.118,1.296.118.572,0,1.009-.045,1.309-.136s.506-.214.616-.369c.11-.156.166-.331.166-.523,0-.267-.105-.481-.314-.646-.21-.165-.542-.247-.995-.247h-1.437c-.975,0-1.683-.18-2.125-.539-.442-.36-.663-.781-.663-1.263,0-.334.089-.651.268-.952.179-.3.429-.553.752-.756-.578-.307-.992-.668-1.241-1.084-.249-.417-.374-.917-.374-1.5,0-.681.173-1.266.519-1.756s.823-.868,1.433-1.135c.609-.266,1.305-.399,2.086-.399.674.012,1.261-.035,1.76-.14.499-.105.946-.25,1.343-.434.396-.185.776-.382,1.139-.591ZM24.198,18.346c-.425,0-.762.135-1.012.404s-.374.639-.374,1.109c0,.498.127.881.382,1.147.255.267.589.399,1.003.399.447,0,.789-.133,1.024-.399s.353-.66.353-1.182c0-.504-.116-.877-.349-1.118-.232-.24-.575-.361-1.028-.361Z" fill="${e}"/>
	`;return je(r)};_e.importGlyphSVG=()=>{let t=Le.blueOutline,e=Le.darkFill,r=`
    <path d="M28,4l-2-2-5,5-3-3c0-.143,0,8,0,8h8l-3-3,5-5Z" fill="${t}"/>
    <path d="M4.811,24.279c.448,0,.809-.071,1.083-.213s.413-.354.413-.638c0-.192-.054-.354-.162-.484-.108-.13-.314-.255-.621-.374-.306-.119-.759-.261-1.36-.425-.55-.147-1.036-.334-1.458-.561-.422-.227-.75-.519-.986-.876-.235-.356-.353-.802-.353-1.334,0-.539.15-1.018.45-1.437.3-.42.743-.75,1.326-.99.583-.241,1.297-.361,2.142-.361.805,0,1.506.104,2.104.31.598.207,1.115.47,1.551.787l-1.071,1.58c-.374-.231-.776-.417-1.207-.557-.431-.139-.864-.208-1.301-.208s-.761.059-.973.175-.319.29-.319.522c0,.153.056.284.166.396.11.11.319.224.625.34.306.116.754.259,1.343.429.583.165,1.092.354,1.526.569.433.216.769.503,1.007.863.238.359.357.834.357,1.424,0,.657-.196,1.208-.587,1.653-.391.444-.909.777-1.555.998-.646.222-1.354.332-2.125.332-.873,0-1.644-.125-2.312-.374-.669-.249-1.238-.578-1.708-.986l1.352-1.513c.351.272.749.499,1.194.68.445.182.931.272,1.458.272Z" fill="${e}"/>
    <path d="M19.214,16.884l-3.009,9.027h-3.162l-3.043-9.027h2.898l1.759,6.971,1.836-6.971h2.72Z" fill="${e}"/>
    <path d="M28.371,15.439l.629,1.972c-.317.125-.688.216-1.113.272-.425.057-.921.085-1.488.085.567.243.999.545,1.296.905.297.359.446.831.446,1.415s-.156,1.104-.468,1.56c-.312.456-.753.814-1.326,1.075-.573.261-1.25.391-2.032.391-.192,0-.374-.008-.544-.025-.17-.017-.337-.042-.501-.076-.096.051-.17.125-.221.221-.051.097-.076.195-.076.298,0,.142.058.27.174.383.116.113.389.17.82.17h1.479c.702,0,1.31.113,1.823.34.513.227.911.535,1.194.927.284.391.425.838.425,1.343,0,.924-.405,1.651-1.216,2.185-.81.532-2.014.799-3.612.799-1.156,0-2.05-.118-2.682-.353-.632-.235-1.071-.57-1.317-1.003-.247-.434-.37-.948-.37-1.543h2.38c0,.261.052.475.157.642.104.167.306.29.604.37.297.079.729.118,1.296.118.572,0,1.009-.045,1.309-.136s.506-.214.616-.369c.11-.156.166-.331.166-.523,0-.267-.105-.481-.314-.646-.21-.165-.542-.247-.995-.247h-1.437c-.975,0-1.683-.18-2.125-.539-.442-.36-.663-.781-.663-1.263,0-.334.089-.651.268-.952.179-.3.429-.553.752-.756-.578-.307-.992-.668-1.241-1.084-.249-.417-.374-.917-.374-1.5,0-.681.173-1.266.519-1.756s.823-.868,1.433-1.135c.609-.266,1.305-.399,2.086-.399.674.012,1.261-.035,1.76-.14.499-.105.946-.25,1.343-.434.396-.185.776-.382,1.139-.591ZM24.198,18.346c-.425,0-.762.135-1.012.404s-.374.639-.374,1.109c0,.498.127.881.382,1.147.255.267.589.399,1.003.399.447,0,.789-.133,1.024-.399s.353-.66.353-1.182c0-.504-.116-.877-.349-1.118-.232-.24-.575-.361-1.028-.361Z" fill="${e}"/>
	`;return je(r)};_e.deleteGlyph=()=>{let t=Le.redX,r=`
		<path fill="${Le.darkFill}" d="M20.2,18.5H10L7.8,25h3.5v3.6H0V25h3.5l7.8-21.8H7.8V0h14.6v3.2h-3.6l8,21.8H30v3.6H18.8V25h3.5L20.2,18.5zM19.2,15.2L15.4,3.2H15l-4,11.9H19.2z"/>
		<path fill="${t}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${t}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>
	`;return je(r)};_e.reverseWinding=()=>{let t="",e=Le.blueOutline,r=Le.grayOutline;return t+=`
		<path fill="${r}" d="M3.7,7.8V5L0,8.7l3.7,3.7V9.6c6.2,0,11.2,5,11.2,11.2h1.9C16.8,13.6,10.9,7.8,3.7,7.8z"/>
		<path fill="${e}" d="M25.2,22.3C25.2,10,15.2,0,3,0v3.2c10.5,0,19.1,8.6,19.1,19.1h-4.8l6.4,6.4l6.4-6.4H25.2z"/>
	`,je(t)};_e.switchPathComponent=function(t=!1){let e="",r=Le.blueOutline,n=Le.greenOutline,a=Le.darkFill,i=Le.lightFill;return t&&(r=Le.greenOutline,n=Le.blueOutline,a=Le.lightFill,i=Le.darkFill),e+=`
	<polygon fill="${a}" points="5.1,21 1,17.2 1,1 3.4,1 10,11.3 10,21"/>
	<path fill="${r}" d="M2.9,2L9,11.6V20H5.5L2,16.7V2H2.9 M3.9,0H0v17.6L4.7,22H11V11L3.9,0L3.9,0z"/>
	<polygon fill="${i}" points="21.8,29 16,23.6 16,1 19.8,1 29,15.3 29,29"/>
	<path fill="${n}" d="M19.1,2L28,15.6V28h-5.8L17,23.1V2h2 M20.4,0H15v24l6.4,6H30V15L20.4,0L20.4,0z"/>
	`,je(e)};_e.deletePath=function(t=!1){let e="",r=Le.redX,n=Le.blueOutline,a=Le.darkFill;return t&&(n=Le.greenOutline,a=Le.lightFill),e+=`
		<rect fill="${a}" x="1" y="1"	width="16" height="16"/>
		<path fill="${n}" d="M16,2v14H2V2H16 M18,0H0v18h18V0L18,0z"/>
	`,e+=`
		<path fill="${r}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${r}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>
	`,je(e)};_e.combine_unite=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<path d="M15.164,6.4c-.8-3.104-3.61-5.4-6.964-5.4-3.976,0-7.2,3.223-7.2,7.2,0,3.354,2.296,6.164,5.4,6.964v3.836h12.6V6.4h-3.836Z" style="fill: ${r};"/>
		<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8c0,3.726,2.551,6.848,6,7.738v4.262h14V6h-4.262ZM18,18h-10v-4c-.702,0-1.373-.127-2-.35-2.327-.826-4-3.044-4-5.65,0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4,.223.627.35,1.298.35,2h4v10Z" style="fill: ${e};"/>
	`,je(t,"20")};_e.combine_divide=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<path d="M15.164,6.4c-.8-3.104-3.61-5.4-6.964-5.4C4.224,1,1,4.223,1,8.2c0,3.354,2.296,6.164,5.4,6.964v3.836h12.6V6.4h-3.836Z" style="fill: ${r};"/>
		<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8c0,3.726,2.551,6.848,6,7.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM14,8c0,3.308-2.692,6-6,6v-6h6ZM18,18h-10v-2c4.418,0,8-3.582,8-8h2v10Z" style="fill: ${e};"/>
	`,je(t,"20")};_e.combine_subtract=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<path d="M15,6.337c-.791-3.068-3.568-5.337-6.883-5.337C4.186,1,1,4.186,1,8.117c0,3.315,2.27,6.092,5.337,6.883V6.337h8.663Z" style="fill: ${r};"/>
		<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8c0,3.726,2.551,6.848,6,7.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM18,18h-10v-10h10v10Z" style="fill: ${e};"/>
	`,je(t,"20")};_e.combine_exclude=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<path d="M15.347,7c0,5-3.347,8.347-8.347,8.347v3.653h12V7h-3.653Z" style="fill: ${r};"/>
		<path d="M15,6.337c-.791-3.068-3.568-5.337-6.883-5.337-3.93,0-7.117,3.186-7.117,7.117,0,3.315,2.27,6.092,5.337,6.883V6.337h8.663Z" style="fill: ${r};"/>
		<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8c0,3.726,2.551,6.848,6,7.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM14,8c0,3.308-2.692,6-6,6v-6h6ZM18,18h-10v-2c4.418,0,8-3.582,8-8h2v10Z" style="fill: ${e};"/>
	`,je(t,"20")};_e.combine_intersect=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<path d="M15,8.6c0-.554-.078-1.088-.21-1.6h-7.79v7.79c.512.132,1.046.21,1.6.21,3.535,0,6.4-2.865,6.4-6.4Z" style="fill: ${r};"/>
		<path d="M15.738,6c-.889-3.449-4.011-6-7.738-6C3.582,0,0,3.582,0,8c0,3.726,2.551,6.848,6,7.738v4.262h14V6h-4.262ZM2,8c0-3.308,2.692-6,6-6,2.606,0,4.824,1.673,5.65,4h-7.65v7.65c-2.327-.826-4-3.044-4-5.65ZM14,8c0,3.308-2.692,6-6,6v-6h6ZM18,18h-10v-2c4.418,0,8-3.582,8-8h2v10Z" style="fill: ${e};"/>
	`,je(t,"20")};_e.edit=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<path fill="${e}" d="m28.643,1.357c-1.577-1.577-4.109-1.891-5.651-.349L4,20,0,29l1,1,9-4L28.992,7.008c1.542-1.542,1.228-4.074-.349-5.651Z"/>
		<path fill="${r}" d="m28.643,1.357C27.771.486,26.608,0,25.482,0,24.57,0,23.682.318,22.992,1.008L4,20,0,29l1,1,9-4L28.992,7.008c1.542-1.542,1.228-4.074-.349-5.651ZM6.268,20.561l15.793-15.793,3.172,3.172-15.793,15.793-3.172-3.172Zm-.662.752l3.082,3.082-5.548,2.466,2.466-5.548ZM27.577,5.594l-1.638,1.638-3.172-3.172,1.638-1.638c.281-.28.643-.423,1.076-.423.611,0,1.264.288,1.747.771.44.44.719,1.018.765,1.586.028.346-.021.842-.416,1.237Z"/>
	`,je(t)};_e.delete=()=>{let t="",e=Le.redX;return t+=`
		<path fill="${e}" d="m23.597,28.681c1.121,1.472,6.349-1.368,4.386-3.98C23.74,19.055,12.613,7.416,7.367,3.301,3.535.295,0,2.518,0,2.518c0,0,13.846,13.354,23.597,26.164Z"/>
		<path fill="${e}" d="m6.893,28.339c-1.703,2.813-6.56-.4-4.174-3.566C7.551,18.364,16.797,6.057,23.298,1.396c4.182-2.998,6.702-.235,6.702-.235,0,0-14.277,12.59-23.107,27.178Z"/>
	`,je(t)};_e.createNewKernGroup=()=>{let t="",e=Le.greenOutline,r=Le.darkFill;return t+=`
		<path d="m16.306,19.001l-4.324-11.39h-1.593v-1.611h5.08v1.611h-1.487l3.278,8.641,3.19-8.641h-1.501v-1.611h4.941v1.611h-1.563l-4.235,11.39h-1.786Z" fill="${r}"/>
		<path d="m12.197,17.375l-3.58-9.75h1.57v-1.625H3.548v1.625h1.517l-3.493,9.75H0v1.625h5.116v-1.625h-1.578l.994-2.941h4.679l.966,2.941h-1.615v1.625h5.088v-1.625h-1.453Zm-7.181-4.463l1.751-5.287h.273l1.682,5.287h-3.705Z" fill="${r}"/>
		<polygon points="13 20.5 13 22.5 0 22.5 0 23.5 13 23.5 13 25.5 14 25.5 14 20.5 13 20.5" fill="${r}"/>
		<polygon points="24 2 10 2 10 0 9 0 9 5 10 5 10 3 24 3 24 2" fill="${r}"/>
		<rect x="21" y="15" width="3" height="15" fill="${e}"/>
		<rect x="21" y="15" width="3" height="15" transform="translate(45 0) rotate(90)" fill="${e}"/>
	`,je(t)};_e.deleteSingleLetterPair=()=>{let t="",e=Le.redX,r=Le.darkFill;return t+=`
		<path d="m16.306,19.001l-4.324-11.39h-1.593v-1.611h5.08v1.611h-1.487l3.278,8.641,3.19-8.641h-1.501v-1.611h4.941v1.611h-1.563l-4.235,11.39h-1.786Z" fill="${r}"/>
		<path d="m12.197,17.375l-3.58-9.75h1.57v-1.625H3.548v1.625h1.517l-3.493,9.75H0v1.625h5.116v-1.625h-1.578l.994-2.941h4.679l.966,2.941h-1.615v1.625h5.088v-1.625h-1.453Zm-7.181-4.463l1.751-5.287h.273l1.682,5.287h-3.705Z" fill="${r}"/>
		<path d="m26.428,29.033c.625.821,3.542-.763,2.447-2.22-2.367-3.149-8.574-9.642-11.5-11.938-2.138-1.677-4.11-.437-4.11-.437,0,0,7.723,7.449,13.163,14.595Z" fill="${e}"/>
		<path d="m17.111,28.842c-.95,1.569-3.659-.223-2.328-1.989,2.695-3.575,7.853-10.44,11.479-13.04,2.333-1.673,3.739-.131,3.739-.131,0,0-7.964,7.023-12.889,15.16Z" fill="${e}"/>
	`,je(t)};_e.findSingleLetterPair=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<path d="m16.306,19.001l-4.324-11.39h-1.593v-1.611h5.08v1.611h-1.487l3.278,8.641,3.19-8.641h-1.501v-1.611h4.941v1.611h-1.563l-4.235,11.39h-1.786Z" fill="${r}"/>
		<path d="m12.197,17.375l-3.58-9.75h1.57v-1.625H3.548v1.625h1.517l-3.493,9.75H0v1.625h5.116v-1.625h-1.578l.994-2.941h4.679l.966,2.941h-1.615v1.625h5.088v-1.625h-1.453Zm-7.181-4.463l1.751-5.287h.273l1.682,5.287h-3.705Z" fill="${r}"/>
		<path d="m30,28l-5.154-5.154c.728-1.104,1.154-2.425,1.154-3.846,0-3.866-3.134-7-7-7s-7,3.134-7,7,3.134,7,7,7c1.421,0,2.742-.426,3.846-1.154l5.154,5.154,2-2Zm-15.5-9c0-2.481,2.019-4.5,4.5-4.5s4.5,2.019,4.5,4.5-2.019,4.5-4.5,4.5-4.5-2.019-4.5-4.5Z" fill="${e}"/>
	`,je(t)};_e.moveLayerDown=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<rect fill="${e}" x="23" y="21" width="2" height="7"/>
		<path fill="${e}" d="M20,26h8l-4,4C24,30,19.9,25.9,20,26z"/>
		<polygon fill="${e}" points="15,17 5.4,12.5 0,15 15,22 30,15 24.6,12.5"/>
		<polygon fill="${r}" points="15,14 0,7 15,0 30,7"/>
	`,je(t)};_e.moveLayerUp=()=>{let t="",e=Le.blueOutline,r=Le.darkFill;return t+=`
		<rect fill="${e}" x="23" y="23" width="2" height="7"/>
		<path fill="${e}" d="M20,25h8l-4-4C24,21,19.9,25.1,20,25z"/>
		<polygon fill="${r}" points="15,17 5.4,12.5 0,15 15,22 30,15 24.6,12.5"/>
		<polygon fill="${e}" points="15,14 0,7 15,0 30,7"/>
	`,je(t)};_e.align=function(t){let e="",r=Le.blueOutline,n=Le.darkFill;switch(t){case"bottom":e+=`
				<rect x="0" y="18" width="20" height="2" style="fill: ${r};"/>
				<rect x="1" y="11" width="4" height="6" style="fill: ${n};"/>
				<rect x="8" y="1" width="4" height="16" style="fill: ${n};"/>
				<rect x="15" y="5" width="4" height="12" style="fill: ${n};"/>
			`;break;case"middle":e+=`
				<rect x="0" y="9" width="20" height="2" style="fill: ${r};"/>
				<rect x="1" y="7" width="4" height="6" style="fill: ${n};"/>
				<rect x="8" y="2" width="4" height="16" style="fill: ${n};"/>
				<rect x="15" y="4" width="4" height="12" style="fill: ${n};"/>
			`;break;case"top":e+=`
				<rect x="0" width="20" height="2" style="fill: ${r};"/>
				<rect x="1" y="3" width="4" height="6" style="fill: ${n};"/>
				<rect x="8" y="3" width="4" height="16" style="fill: ${n};"/>
				<rect x="15" y="3" width="4" height="12" style="fill: ${n};"/>
			`;break;case"left":e+=`
				<rect x="0" width="2" height="20" style="fill: ${r};"/>
				<rect x="3" y="1" width="6" height="4" style="fill: ${n};"/>
				<rect x="3" y="8" width="16" height="4" style="fill: ${n};"/>
				<rect x="3" y="15" width="12" height="4" style="fill: ${n};"/>
			`;break;case"center":e+=`
				<rect x="9.016" width="2" height="20" style="fill: ${r};"/>
				<rect x="7" y="1" width="6" height="4" style="fill: ${n};"/>
				<rect x="2" y="8" width="16" height="4" style="fill: ${n};"/>
				<rect x="4" y="15" width="12" height="4" style="fill: ${n};"/>
			`;break;case"right":e+=`
				<rect x="18" width="2" height="20" style="fill: ${r};"/>
				<rect x="11" y="1" width="6" height="4" style="fill: ${n};"/>
				<rect x="1" y="8" width="16" height="4" style="fill: ${n};"/>
				<rect x="5" y="15" width="12" height="4" style="fill: ${n};"/>
			`;break}return je(e,"20")};_e.resetPathPoint=()=>{let t="",e=Le.blueOutline,r=Le.grayOutline;return t+=`
		<circle display="inline" fill="${r}" cx="20" cy="27" r="3"/>
		<circle display="inline" fill="${r}" cx="27" cy="13" r="3"/>
		<line display="inline" fill="none" stroke="${r}" stroke-miterlimit="10" x1="20" y1="27" x2="13" y2="13"/>
		<line display="inline" fill="none" stroke="${r}" stroke-miterlimit="10" x1="13" y1="13" x2="27" y2="13"/>
	`,t+=`
		<line stroke="${e}" fill="none" stroke-miterlimit="10" x1="4" y1="22" x2="22" y2="4"/>
		<rect fill="#FFFFFF" x="9.5" y="9.5" width="7" height="7"/>
		<path fill="${e}" d="M16,10v6h-6v-6H16 M17,9h-1h-6H9v1v6v1h1h6h1v-1v-6V9L17,9z"/>
		<circle fill="${e}" cx="3" cy="23" r="3"/>
		<circle fill="${e}" cx="23" cy="3" r="3"/>
	`,je(t)};_e.deletePathPoint=()=>{let t="",e=Le.blueOutline,r=Le.redX;return t+=`
		<line stroke="${e}" fill="none" stroke-miterlimit="10" x1="4" y1="22" x2="22" y2="4"/>
		<rect fill="#FFFFFF" x="9.5" y="9.5" width="7" height="7"/>
		<path fill="${e}" d="M16,10v6h-6v-6H16 M17,9h-1h-6H9v1v6v1h1h6h1v-1v-6V9L17,9z"/>
		<circle fill="${e}" cx="3" cy="23" r="3"/>
		<circle fill="${e}" cx="23" cy="3" r="3"/>
	`,t+=`
		<path fill="${r}" d="M26.4,29c0.6,0.8,3.5-0.8,2.4-2.2c-2.4-3.1-8.6-9.6-11.5-11.9c-2.1-1.7-4.1-0.4-4.1-0.4S21,21.9,26.4,29z"/>
		<path fill="${r}" d="M17.2,28.8c-0.9,1.6-3.7-0.2-2.3-2c2.7-3.6,7.9-10.4,11.5-13c2.3-1.7,3.7-0.1,3.7-0.1S22.1,20.7,17.2,28.8z"/>';
	`,je(t)};_e.insertPathPoint=()=>{let t="",e=Le.blueOutline;return t+=`
		<line stroke="${e}" fill="none" stroke-miterlimit="10" x1="4" y1="22" x2="22" y2="4"/>
		<rect fill="#FFFFFF" x="9.5" y="9.5" width="7" height="7"/>
		<path fill="${e}" d="M16,10v6h-6v-6H16 M17,9h-1h-6H9v1v6v1h1h6h1v-1v-6V9L17,9z"/>
		<circle fill="${e}" cx="3" cy="23" r="3"/>
		<circle fill="${e}" cx="23" cy="3" r="3"/>
	`,t+=`
		<rect x="21" y="15" fill="${e}" width="3" height="15"/>
		<rect x="15" y="21" fill="${e}" width="15" height="3"/>';
	`,je(t)};_e.selectNextPathPoint=()=>{let t="",e=Le.blueOutline,r=Le.grayOutline;return t+=`
		<rect x="22.5" y="11.5" width="7" height="7" fill="white"/>
		<path d="m29,12v6h-6v-6h6m1-1h-8v8h8v-8h0Z" fill="${e}"/>
		<path d="m19,15s-7-7-7-7v5h-6v4h6v5s7-7,7-7Z" fill="${r}"/>
		<rect y="13" width="3" height="4" fill="${r}"/>
	`,je(t)};_e.selectPreviousPathPoint=()=>{let t="",e=Le.blueOutline,r=Le.grayOutline;return t+=`
		<rect x=".5" y="11.5" width="7" height="7" fill="white"/>
		<path d="m7,12v6H1v-6h6m1-1H0v8h8v-8h0Z" fill="${e}"/>
		<path d="m11,15s7-7,7-7v5h6v4h-6s0,5,0,5l-7-7Z" fill="${r}"/>
		<rect x="27" y="13" width="3" height="4" fill="${r}"/>
	`,je(t)};_e.default=()=>{let t=`<rect width="30" height="30" fill="${Le.greenOutline}"/>`;return je(t)};_e.test=()=>{let t=`
		<path d="M28.05,23.82c-1.65-1.79-9.55-13.02-9.55-17.82V3h1c.28,0,.5-.72,.5-1s-.22-1-.5-1H10.5c-.28,0-.5,.72-.5,1s.22,1,.5,1h1v3c0,4.8-7.9,16.03-9.55,17.82-.58,.55-.95,1.32-.95,2.18,0,1.66,1.34,3,3,3H26c1.66,0,3-1.34,3-3,0-.86-.37-1.63-.95-2.18ZM13.5,6V3h3v3c0,2.76,2.01,6.95,4.25,10.72-3.27,1.69-5.6-.72-7.75-.72-.34,0-1.86-.31-4,1.15,2.34-3.88,4.5-8.28,4.5-11.15Zm3.5,20c-1.66,0-3-1.34-3-3s1.34-3,3-3,3,1.34,3,3-1.34,3-3,3Zm-6-7.5c0-.83,.67-1.5,1.5-1.5s1.5,.67,1.5,1.5-.67,1.5-1.5,1.5-1.5-.67-1.5-1.5Z" fill="${Le.redX}"/>
		<circle cx="15" cy="14" r="1" fill="${Le.redX}"/>
	`;return je(t)};function pp(){let t=y({className:"panel__card guides-card__view-options",innerHTML:"<h3>View options</h3>"});const e=ce().settings.app.guides,r=e.systemShowGuides,n=e.customShowGuides;ie(t,[lr(e,"drawGuidesOnTop",ha),y({tag:"label",style:"grid-column: 2 / -1;",content:"Draw guides over shapes"})]);const a=lr(e,"systemShowGuides");a.addEventListener("change",()=>{z().navigate()}),ie(t,[a,y({tag:"h4",content:"Key metrics guides"})]),r&&ie(t,[y(),we("Transparency"),Eo(e.systemTransparency,l=>{e.systemTransparency=l,z().editCanvas.redraw()}),y(),we("Show labels"),lr(e,"systemShowLabels",ha),Qr()]);const i=lr(e,"customShowGuides");i.addEventListener("change",()=>{z().navigate()}),ie(t,[i,y({tag:"h4",content:"Custom guides"})]),n&&ie(t,[y(),we("Transparency"),Eo(e.customTransparency,l=>{e.customTransparency=l,z().editCanvas.redraw()}),y(),we("Show labels"),lr(e,"customShowLabels",ha)]);let s=[t];return r&&s.push(Sp()),n&&s.push(gp()),s}function ha(){dr(),z().editCanvas.redraw()}function Sp(){let t=y({className:"panel__card guides-card__system",innerHTML:"<h3>Key metrics guides</h3>"});const e=ce().settings.font,r=z().selectedItem.advanceWidth;return ie(t,[vn("ascent","Ascent",e.ascent,S0),vn("capHeight","Cap height",e.capHeight,p0),vn("xHeight","X height",e.xHeight,p0),vn("baseline","Baseline","0",Ya),vn("descent","Descent",e.descent,S0),vn("leftSide","Left side","0",Ya),vn("rightSide","Right side",r,Ya)]),t}function vn(t,e,r="0000",n){const a=z().systemGuides,i=lr(a,t,E=>{const T=z();let h=T.project.settings.app.guides.systemGuides;E?h.includes(t)||h.push(t):h.includes(t)&&(h=h.filter(u=>u!==t)),T.editCanvas.redraw()});i.setAttribute("title","Show / hide guide"),i.setAttribute("style",`accent-color: ${n};`);let s=y({className:"guide-system-angle",innerHTML:Dn({name:"command_horizontalBar",color:n})});s.setAttribute("title","Horizontal guideline"),(t==="leftSide"||t==="rightSide")&&(s.innerHTML=Dn({name:"command_verticalBar",color:n}),s.setAttribute("title","Vertical guideline"));const l=y({className:"guide-system-value",content:r});return l.setAttribute("title",`Guide line position
These are based on this font's key metrics,
which you can edit on the Font Settings page.`),[i,we(e),s,l]}function gp(){let t=y({className:"panel__card guides-card__custom",innerHTML:"<h3>Custom guides</h3>"});const e=ce().settings.app.guides.custom;e.length&&(e.forEach((n,a)=>{ie(t,Cp(n,a))}),t.appendChild(Qr()));const r=y({tag:"fancy-button",attributes:{secondary:""},innerHTML:"Add a custom guide"});return r.addEventListener("click",()=>{ce().settings.app.guides.custom.push(new Q0({visible:!0,color:D1()})),ha()}),t.appendChild(r),t}function Cp(t,e){const r=lr(t,"visible",()=>{z().editCanvas.redraw()});r.setAttribute("style",`accent-color: ${t.color}`),r.setAttribute("title","Show / hide guide");const n=Pt(t,"name","editCanvasView","input"),a=ox({iconName:"delete",title:"Delete guide"});a.setAttribute("class","guide-delete-button"),a.addEventListener("click",()=>{ce().settings.app.guides.custom.splice(e,1),ha()});const i=y({tag:"input",className:"guide-color-button",title:"Change guide color",attributes:{type:"color",style:`background-color: ${t.color};`,value:I0(t.color)}});i.addEventListener("input",E=>{let T=ri(E.target.value),h=`rgb(${T.r},${T.g},${T.b})`;i.setAttribute("value",I0(h)),i.style.backgroundColor=h,r.style.accentColor=h,s.querySelector("g").setAttribute("fill",h);const u=ce().settings.app.guides.custom[e];u.color=h,z().editCanvas.redraw()});const s=y({tag:"button",title:"Toggle vertical / horizontal",className:"guide-angle-button",innerHTML:Dn({name:"command_verticalBar",color:t.color})});t.angle===90&&(s.innerHTML=Dn({name:"command_horizontalBar",color:t.color})),s.addEventListener("click",()=>{const E=ce().settings.app.guides.custom[e];E.angle===90?(E.angle=0,E.name=E.name.replace("Horizontal","Vertical")):(E.angle=90,E.name=E.name.replace("Vertical","Horizontal")),ha()});const l=Pt(t,"location","editCanvasView","input-number");return l.setAttribute("title","Guide line position"),[r,n,a,i,s,l]}function Rp(){const t=z();let e=y({className:"panel__card history-list"}),r=t.history.length,n=y({tag:"button",className:r>0?"button__call-to-action number":"number",innerHTML:`undo ${r}`,style:"max-width: 30%; grid-column: 1 / -1;"});e.appendChild(n),r>0?n.addEventListener("click",()=>{t.history.restoreState()}):(n.setAttribute("disabled",""),e.appendChild(y({tag:"h3",innerHTML:t.project.getItemName(t.selectedItemID,!0)||""})));let a="initial";return t.history.queue.forEach(i=>{if(i.title!=="_whole_project_change_post_state_"){i.itemID&&i.itemID!==a&&(e.appendChild(y({tag:"h3",innerHTML:t.project.getItemName(i.itemID,!0)||""})),a=i.itemID);let s=i.title;i.wholeProjectSave&&(s=`<strong>${i.title}</strong>`),e.appendChild(y({className:"history-list__title",innerHTML:s})),e.appendChild(y({className:"history-list__date number",innerHTML:new Date(i.timeStamp).toLocaleTimeString(),title:new Date(i.timeStamp).toLocaleString()}))}}),e.appendChild(y({className:"history-list__title history-list__initial-entry",innerHTML:"Initial state"})),e.appendChild(y({className:"history-list__date number history-list__initial-entry",innerHTML:new Date(t.history.initialTimeStamp).toLocaleTimeString()})),e}const sx={isCtrlDown:!1,isSpaceDown:!1,isShiftDown:!1,isAltDown:!1};function kA(t){const e=wo(t);Ax(e,"down")}function KA(t){let e=wo(t);Ax(e,"up")}function Ax(t,e){const r=sx;e==="down"&&(t==="Control"&&(r.isCtrlDown=!0),t==="Space"&&(r.isSpaceDown=!0),t==="Shift"&&(r.isShiftDown=!0),t==="Alt"&&(r.isAltDown=!0)),e==="up"&&(t==="Control"&&(r.isCtrlDown=!1),t==="Space"&&(r.isSpaceDown=!1),t==="Shift"&&(r.isShiftDown=!1),t==="Alt"&&(r.isAltDown=!1))}function yp(){var i;let t=y({className:"panel__card full-width item-links__rows-area"});const e=z(),r=ce();let a=e.selectedItem.shapes;if((i=he==null?void 0:he.newBasicPath)!=null&&i.objType){let s=he.newBasicPath,l=y();l.setAttribute("class","item-link__row layer-panel__new-path"),l.classList.add("layer-panel__selected"),l.appendChild(y({className:"item-link__thumbnail",innerHTML:r.makeItemThumbnail(s)})),l.appendChild(y({className:"item-link__title",innerHTML:s.name})),t.appendChild(l)}if(a.length>0)for(let s=a.length-1;s>=0;s--){let l=a[s],E=y({attributes:{"target-path-index":s}});l.objType==="ComponentInstance"?E.setAttribute("class","item-link__row layer-panel__component-row"):E.setAttribute("class","item-link__row layer-panel__path-row"),e.multiSelect.shapes.isSelected(l)&&E.classList.add("layer-panel__selected"),e.subscribe({topic:"whichShapeIsSelected",subscriberID:`layersPanel.item-link-row-${s}`,callback:()=>{let u=e.multiSelect.shapes.isSelected(l);E.classList.toggle("layer-panel__selected",u)}}),E.addEventListener("click",()=>{sx.isCtrlDown?e.multiSelect.shapes.toggle(l):e.multiSelect.shapes.select(l),e.publish("whichShapeIsSelected",l)});const T=y({className:"item-link__thumbnail",attributes:{"target-path-index":s},innerHTML:r.makeItemThumbnail(l)});E.appendChild(T),E.appendChild(y({className:"item-link__title",innerHTML:`${l.name}`}));let h="Path";l.link&&(h=`Component instance&emsp;|&emsp;${r.getItem(l.link).name}`),E.appendChild(y({className:"item-link__subtitle",innerHTML:h})),t.appendChild(E)}else t.appendChild(y({content:'No paths exist yet.  You can create one with the New Path tools on the canvas, or by pressing "add new path" below.'}));return e.subscribe({topic:["currentPath","currentItem"],subscriberID:"layersPanel",callback:()=>{const s=z(),l=ce();document.querySelectorAll(".item-link__thumbnail").forEach(T=>{const h=T.getAttribute("target-path-index");T.innerHTML=l.makeItemThumbnail(s.selectedItem.shapes[h])})}}),[t,mp()]}function mp(){const t=z();let e=y({className:"panel__card full-width",content:"<h3>Actions</h3>"}),r=y({tag:"div",className:"panel__actions-area"});ar(r,xr("addShapeActions"));let n=t.multiSelect.shapes.members;return t.selectedItem.shapes.length>1&&n.length===1&&ar(r,xr("layerActions")),ie(e,r),e}function Ti(){const t=z();let e=y(),r=t.nav.panel;return r!=="Layers"&&(document.removeEventListener("keydown",kA,!1),document.removeEventListener("keyup",KA,!1)),t.nav.page==="Components"&&Gt(t.project.components)<=0||t.nav.page==="Ligatures"&&Gt(t.project.ligatures)<=0||t.nav.page==="Kerning"&&Gt(t.project.kerning)<=0||(r==="Attributes"?(t.unsubscribe({idToRemove:"layersPanel"}),t.unsubscribe({idToRemove:"historyPanel"}),t.unsubscribe({idToRemove:"guidesPanel"}),t.unsubscribe({idToRemove:"contextCharactersPanel"}),t.nav.page==="Kerning"?ie(e,Ip()):ie(e,ep())):r==="Layers"?(t.unsubscribe({idToRemove:"attributesPanel"}),t.unsubscribe({idToRemove:"historyPanel"}),t.unsubscribe({idToRemove:"guidesPanel"}),t.unsubscribe({idToRemove:"contextCharactersPanel"}),ie(e,yp()),document.addEventListener("keydown",kA,!1),document.addEventListener("keyup",KA,!1)):r==="Context characters"?(t.unsubscribe({idToRemove:"attributesPanel"}),t.unsubscribe({idToRemove:"layersPanel"}),t.unsubscribe({idToRemove:"historyPanel"}),t.unsubscribe({idToRemove:"guidesPanel"}),ie(e,up())):r==="History"?(t.unsubscribe({idToRemove:"attributesPanel"}),t.unsubscribe({idToRemove:"layersPanel"}),t.unsubscribe({idToRemove:"guidesPanel"}),t.unsubscribe({idToRemove:"contextCharactersPanel"}),ie(e,Rp())):r==="Guides"&&(t.unsubscribe({idToRemove:"attributesPanel"}),t.unsubscribe({idToRemove:"layersPanel"}),t.unsubscribe({idToRemove:"historyPanel"}),t.unsubscribe({idToRemove:"contextCharactersPanel"}),ie(e,pp()))),e}function dr(){let t=document.querySelector("#editor-page__panel");if(t){let e=Ti();t.innerHTML="",t.appendChild(e)}}function fp(){const t=z(),e=t.selectedLigatureID,a=y({tag:"div",id:"app__page",innerHTML:`
		<div class="editor__page">
			<div class="editor-page__left-area">
				<div class="editor-page__nav-area">
					${Vt({level:"l1",superTitle:"PAGE",title:"Ligatures"})}
				</div>
				<div id="editor-page__panel"></div>
			</div>
			${e?`
		<div class="editor-page__tools-area"></div>
		<div class="editor-page__edit-canvas-wrapper"></div>
		<div class="editor-page__zoom-area"></div>
	`:'<div class="editor-page__edit-canvas-wrapper" style="grid-column: span 2; overflow-y: scroll;"></div>'}
		</div>
	`});t.showPageTransitions&&a.classList.add("app__page-animation");let i=a.querySelector("#nav-button-l1");i.addEventListener("click",function(){zt(i)});const s=a.querySelector(".editor-page__nav-area"),l=a.querySelector(".editor-page__edit-canvas-wrapper");if(!e)return ie(l,Np()),s.style.display="block",i.style.width="100%",i.style.borderRadius="4px",a;const E=t.selectedLigature,T=Vt({level:"l2",superTitle:"EDITING",title:E.name}),h=Vt({level:"l3",superTitle:"PANEL",title:t.nav.panel});s.appendChild(xe(T)),s.appendChild(xe(h));const u=y({tag:"edit-canvas",id:"editor-page__edit-canvas",attributes:{"editing-item-id":t.selectedLigatureID}});l.appendChild(u);let C=a.querySelector("#nav-button-l2");C.addEventListener("click",function(){zt(C)}),t.subscribe({topic:"whichLigatureIsSelected",subscriberID:"nav.ligatureChooserButton",callback:()=>{var te;t.selectedLigature&&(C.innerHTML=fa((te=t.selectedLigature)==null?void 0:te.name,"EDITING"))}});let g=a.querySelector("#nav-button-l3");g.addEventListener("click",function(){zt(g)});const H=a.querySelector("#editor-page__panel");H.appendChild(Ti()),H.addEventListener("scroll",$r),t.subscribe({topic:["whichLigatureIsSelected","whichShapeIsSelected"],subscriberID:"nav.panelChooserButton",callback:()=>{dr()}}),t.selectedTool==="kern"&&(t.selectedTool="resize");let F=a.querySelector(".editor-page__tools-area");F.innerHTML="";let K=Bs();K&&ie(F,K);let j=a.querySelector(".editor-page__zoom-area");j.innerHTML="";let Q=Uo();return Q&&ie(j,Q),t.subscribe({topic:"whichLigatureIsSelected",subscriberID:"editCanvas.selectedLigature",callback:te=>{Jn(),a.querySelector("#editor-page__edit-canvas").setAttribute("editing-item-id",te)}}),t.subscribe({topic:"whichShapeIsSelected",subscriberID:"editCanvas.selectedPath",callback:()=>{Jn(),t.editCanvas.redraw()}}),t.subscribe({topic:"whichPathPointIsSelected",subscriberID:"editCanvas.selectedPathPoint",callback:()=>{t.editCanvas.redraw()}}),a}function Np(){let t="";lx.forEach(a=>{t+=`
			<span class="first-run__example-wrapper">
					<pre>${a.display}</pre>
					<span> ➞ </span>
					<pre>&#${parseInt(a.point)};</pre>
			</span>
		`});const e=y({className:"editor-page__first-run",innerHTML:`
			<h1>There are no ligatures in your project</h1>
			<p>
				Ligatures are a feature of fonts where a specified sequence of characters
				is recognized and replaced with a single new character that you design.
				In Latin, there are some common ligatures:
				<div class="first-run__examples-table">
				${t}
				</div>
			</p>
			<p>
				These are just some examples. <strong>Ligatures can have any sequence of two
				or more characters.</strong> In a text editing program that has ligatures enabled,
				this sequence of characters is recognized, then replaced with the custom ligature
				character that you design.
			</p>
		`}),r=y({tag:"fancy-button",innerHTML:"Create a new ligature",onClick:Rs}),n=y({tag:"fancy-button",innerHTML:"Add the common Latin ligatures to your project",attributes:{secondary:""},onClick:Dp});return e.appendChild(r),e.appendChild(n),e}const lx=[{chars:"ae",display:"ae",point:"0xE6"},{chars:"AE",display:"AE",point:"0xC6"},{chars:"ff",display:"f‌f",point:"0xFB00"},{chars:"fi",display:"f‌i",point:"0xFB01"},{chars:"fl",display:"f‌l",point:"0xFB02"},{chars:"oe",display:"oe",point:"0x153"},{chars:"OE",display:"OE",point:"0x152"},{chars:"st",display:"st",point:"0xFB06"},{chars:"ffi",display:"f‌f‌i",point:"0xFB03"},{chars:"ffl",display:"f‌f‌l",point:"0xFB04"}];function Dp(){lx.forEach(e=>P0(e.chars));const t=z();t.nav.page="Ligatures",t.navigate(),t.history.addWholeProjectChangePostState()}function P0(t){if(t.length<2)return"Ligature sequences need to be two or more characters.";let e="";const r=Co(t);let n=[];if(r.startsWith("U+")?(n=r.split("U+"),n=n.slice(1),e="U+"):r.startsWith("0x")&&(n=r.split("0x"),n=n.slice(1),e="0x"),e&&n.length>1){t="";for(let s=0;s<n.length;s++){let l=n[s],E=Ro(l);if(E)t+=Mr(`0x${E}`);else return`Invalid Hex or Unicode format: ${e}${l}.`}}const a=di(t),i=ce();return i.ligatures[a]?"Ligature already exists.":a===!1?"Characters could not be read for the ligature sequence.":(i.addItemByType(new ct({id:a,parent:i,objType:"Ligature",gsub:t.split("").map(s=>s.codePointAt(0))}),"Ligature",a),i.ligatures[a])}function di(t=""){if(t==="")return!1;let e="liga";return t.split("").forEach(n=>{let a=n.charCodeAt(0);a>=65&&a<=90||a>=97&&a<=122?e+="-"+n:e+="-"+qr(n)}),e}function Rs(){const t=y({innerHTML:`
			<h2 id="ligatures__new-ligature-title">Create a new ligature</h2>
			Create a new ligature by specifying two or more individual characters.
			<br>
			<div class="panel__card no-card">
				<input type="checkbox" id="ligatures__multi-input-checkbox" style="margin: 0 0 15px 0;"/>
				<label for="ligatures__multi-input-checkbox" style="grid-column-start: 2;">Create many ligatures at once with a comma separated list.<br>Ligatures cannot contain commas or spaces if you use this option.</label>
			</div>
			<input id="ligatures__new-ligature-input" type="text" style="width: 90%;"
				autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
			/>
			<info-bubble style="display: inline-block; margin-left: 10px;">
				Ligature characters can be specified in three different formats:
				<ul>
					<li>By just typing characters: <code>ff</code></li>
					<li>Specifying Unicode code points: <code>U+66U+66</code></li>
					<li>Specifying Hexadecimal format: <code>0x660x66</code></li>
				</ul>
				<br><br>
				Hexadecimal, Unicode, and regular character formats cannot be mixed - choose one type!
				<br><br>
				<b>Warning!</b><br>
				Specifying ligature characters beyond the Basic Multilingual Plane
				(above Unicode <code>U+FFFF</code>) will cause errors!
			</info-bubble>
			<br><br>
			<fancy-button disabled id="ligatures__add-new-ligature-button">Create ligature</fancy-button>
		`}),e=t.querySelector("#ligatures__add-new-ligature-button"),r=t.querySelector("#ligatures__new-ligature-input"),n=t.querySelector("#ligatures__multi-input-checkbox"),a=t.querySelector("#ligatures__new-ligature-title");r.addEventListener("keyup",()=>{r.value.length<2?e.setAttribute("disabled",""):e.removeAttribute("disabled")}),n.addEventListener("change",()=>{n.checked?(a.innerHTML="Create new ligatures",e.innerHTML="Create ligatures"):(a.innerHTML="Create a new ligature",e.innerHTML="Create ligature")}),e.addEventListener("click",()=>{let i,s;if(n.checked?r.value.replaceAll(" ","").split(",").forEach(T=>{let h=P0(T);typeof h=="string"?(typeof i!="string"&&(i="One or more ligature could not be created:<br><br>"),i=""+i+h+"<br><br>"):(h.hasChangedThisSession=!1,h.wasCreatedThisSession=!0,s=h.id)}):(i=P0(r.value),typeof i!="string"&&(i.hasChangedThisSession=!1,i.wasCreatedThisSession=!0,s=i.id)),typeof i=="string")Ir(i);else{const l=z();l.selectedLigatureID=s,l.navigate(),l.history.addWholeProjectChangePostState(),ze()}}),Cr(t,500)}let Rr=[],Aa=[];async function Op(t,e=!1){const r=e?new Wo:Ri(),n=r.project;await Ss("Reading font data..."),Rr=_i(t,"glyph");const a={},i={};let s=0;for(await ba("character",1);s<Rr.length;)await l(Rr[s]);async function l(F){if(F&&F.attributes){const K=F.attributes,j=K["glyph-name"];let Q=Cn(K.unicode);if((K.unicode===" "||j.toLowerCase()==="space")&&(Q=["0x20"]),!K.unicode&&j.startsWith("uni")){const te=ir(`0x${j.substring(3)}`);te&&(Q=[te],n.settings.app.showNonCharPoints=!0)}if(Q[0]==="0x0")Rr.splice(s,1);else{const te=`<svg><glyph d="${Rr[s].attributes.d}"/></svg>`,se=Za(te,!1),Ie=parseInt(K["horiz-adv-x"]);if(se.advanceWidth=Ie,Q.length===1){await ba("character",s);const le=Q[0];isNaN(Number(le))||n.incrementRangeCountFor(Number(le)),se.id=`glyph-${le}`,a[`glyph-${le}`]=se,Da(le)==="[name not found]"&&(n.settings.app.showNonCharPoints=!0)}else{await ba("ligature",s);const le=Q.join(""),ue=Mr(le);if(ue){const ve=di(ue);ve&&(se.id=ve,se.gsub=S1(le),i[ve]=se)}}}s++}else Rr.splice(s,1)}let E=_i(t,"missing-glyph");if(E.length){const F=E[0].attributes,K=`<svg><glyph d="${F.d}"/></svg>`,j=Za(K,!1),Q=parseInt(F["horiz-adv-x"]);j.advanceWidth=Q,n.incrementRangeCountFor(0),j.id="glyph-0x0",a["glyph-0x0"]=j}Aa=_i(t,"hkern");const T={};let h=0;for(await ba("kern pair",1);h<Aa.length;)await u(Aa[h]);async function u(F){await ba("kern pair",h+Rr.length);let K=[],j=[];if(F)if(K=_A(F.attributes.g1,Rr,K),j=_A(F.attributes.g2,Rr,j),K=VA(F.attributes.u1,Rr,K),j=VA(F.attributes.u2,Rr,j),K.length&&j.length){const Q=E1(T,"kern-"),te=F.attributes.k||0;T[Q]=new Ln({leftGroup:K,rightGroup:j,value:te}),T[Q].id=Q,h++}else Aa.splice(h,1);else Aa.splice(h,1)}n.glyphs=a,n.ligatures=i,n.kerning=T;const C=ys(t,"font-face").attributes,g=n.settings.font,H=C["font-family"]||"My Font";if(g.family=H,g.style=C["font-style"]||"Regular",g.panose=C["panose-1"]||"0 0 0 0 0 0 0 0 0 0",g.upm=1*C["units-per-em"]||g.upm,g.ascent=1*C.ascent||g.ascent,g.capHeight=1*C["cap-height"]||g.capHeight,g.xHeight=1*C["x-height"]||g.xHeight,g.descent=1*C.descent||g.descent,g.variant=C["font-variant"]||"normal",g.weight=1*C["font-weight"]||400,g.stretch=C["font-stretch"]||"normal",g.underlinePosition=1*C["underline-position"]||-100,g.underlineThickness=1*C["underline-thickness"]||20,g.strikethroughPosition=1*C["strikethrough-position"]||g.xHeight/2,g.strikethroughThickness=1*C["strikethrough-thickness"]||20,g.overlinePosition=1*C["overline-position"]||g.ascent+50,g.overlineThickness=1*C["overline-thickness"]||20,g.overshoot=g.upm>2e3?30:20,n.settings.project.name=H,e)return r.project.save();_o(r),r.project.resetSessionStateForAllItems(),r.nav.page="Overview",r.navigate()}async function ba(t,e){const r=Rr.length+Aa.length;await Ss(`
			Importing ${t}:
			<span class="progress-indicator__counter">${e}</span>
			 of
			<span class="progress-indicator__counter">${r}</span>
		`)}function _i(t,e){typeof e=="string"&&(e=[e]);let r=[];if(t.content)for(let n=0;n<t.content.length;n++)r=r.concat(_i(t.content[n],e));else e.indexOf(t.name)>-1&&(r=[t]);return r}function ys(t,e){if(e===t.name)return t;if(t.content)for(let r=0;r<t.content.length;r++){const n=ys(t.content[r],e);if(n)return n}else return!1}function _A(t,e,r,n){n=n||65535;let a;if(t){const i=t.split(",");for(let s=0;s<i.length;s++)for(let l=0;l<e.length;l++)e[l].attributes.unicode&&i[s]===e[l].attributes["glyph-name"]&&(a=Cn(e[l].attributes.unicode),1*a[0]<n&&(r=r.concat(a)))}return r}function VA(t,e,r,n){n=n||65535;let a;if(t){const i=t.split(",");for(let s=0;s<i.length;s++)for(let l=0;l<e.length;l++)e[l].attributes.unicode&&i[s]===e[l].attributes.unicode&&(a=Cn(e[l].attributes.unicode),1*a[0]<n&&(r=r.concat(a)))}return r}const Ot={fileName:"",fileSuffix:"",fileType:"",fileHandle:!1,errorMessage:"",content:!1};let Ii;async function Bp(t,e){Ii=e;let r;window.showOpenFilePicker&&window.showSaveFilePicker?(Ot.fileHandle=t,r=await t.getFile()):r=t,Ot.fileName=r.name;let n=r.name.split(".");n=n[n.length-1].toLowerCase(),Ot.fileSuffix=n;const a=new FileReader;if(a.onerror=()=>{yr("A file reader error occurred. [FR0]")},Ot.fileSuffix==="otf"||Ot.fileSuffix==="ttf"||Ot.fileSuffix==="woff")Ot.fileType="font",a.onload=Hp,a.readAsArrayBuffer(r);else if(Ot.fileSuffix==="svg")Ot.fileType="svg",a.onload=Fp,a.readAsText(r);else if(Ot.fileSuffix==="txt")Ot.fileType="project",a.onload=zA,a.readAsText(r);else if(Ot.fileSuffix==="gs2")Ot.fileType="project",a.onload=zA,a.readAsText(r);else return yr(`
			Unrecognized file type (.${Ot.fileSuffix}).
			Try loading a Glyphr Studio Project file, or a font file.
			[FR1]
		`)}function Hp(){var r;const t=this.result;let e=!1;try{e=Bn.parse(t)}catch(n){return yr(`
			Font file could not be read. [FF0]
			<hr>
			${n.message}
		`)}if(e)if((r=e==null?void 0:e.glyphs)!=null&&r.length)Ot.content=e;else return yr("Font file does not have any glyph data. [FF1]");Ii(Ot)}function Fp(){let t=this.result,e;try{t=t.replace(/&#x/g,"0x"),e=Yu(t)}catch(n){return yr(`
			SVG file could not be read. [SVG0]
			<hr>
			${n.message}
		`)}let r=ys(e,"font");if(r)Ot.content=r;else return yr(`
			The SVG file you tried to load was not a SVG Font file.
			See Glyphr Studio help for more information. [SVG1]`);Ii(Ot)}function zA(){var a,i,s;const t=this.result;let e;try{e=JSON.parse(t)}catch(l){return yr(`
			The file could not be read. Expecting a Glyphr Studio Project file
			in JSON format. [PF0]
			<hr>
			${l.message}
		`)}if(!e.settings&&!e.projectsettings)return yr(`
		The provided text file is missing project settings.
		It may not be a Glyphr Studio Project file. [PF1]
		`);if(!((i=(a=e==null?void 0:e.settings)==null?void 0:a.project)!=null&&i.latestVersion)&&!((s=e==null?void 0:e.projectsettings)!=null&&s.versionnum))return yr(`
			The provided text file has no version information associated with it.
			It may not be a Glyphr Studio Project file. [PF2]
		`);let r=xx(e);if(!r)return yr(`
			The version information could not be read for the provided project file. [PF3]
		`);let n=co(it().version);if(JA(n,r))return yr(`
			This Glyphr Studio project file was created with a future version of
			Glyphr Studio (0_o) As with most software, Glyphr Studio is not forwards-compatible. [PF4]
		`);if(JA(r,[1,13,2]))return yr(`
			Only Glyphr Studio Project files with version 1.13.2 and above can be
			imported into Glyphr Studio v2. For versions 1.13.1 and below, open and re-save
			the project file with Glyphr Studio v1 App (which will update it). [PF5]
		`);Ot.content=e,Ii(Ot)}function xx(t){var r,n,a;let e=co((r=t==null?void 0:t.projectsettings)==null?void 0:r.versionnum);return e||(e=co((a=(n=t==null?void 0:t.settings)==null?void 0:n.project)==null?void 0:a.latestVersion)),e}function yr(t){return Ot.errorMessage=t,console.warn(t.replace(/\s\s+/g," ")),Ii(Ot),!1}function JA(t,e){Array.isArray(e)&&(e={major:e[0],minor:e[1],patch:e[2]});let r="";return t.major<e.major?r="major":t.major===e.major&&(t.minor<e.minor?r="minor":t.minor===e.minor&&t.patch<e.patch&&(r="patch")),r}function co(t){if(!t)return!1;const e=t.split("-"),r=e[0].split(".");if(r.length!==3)return!1;const n={major:parseInt(r[0]),minor:parseInt(r[1]),patch:parseInt(r[2])};return e[1]&&(n.preRelease=e[1]||!1),n}function Mp(t){const e=(t==null?void 0:t.major)||"0",r=(t==null?void 0:t.minor)||"0",n=(t==null?void 0:t.patch)||"0",a=t==null?void 0:t.preRelease;let i=`${e}.${r}.${n}`;return a&&(i=`${i}-${a}`),i}function wa(t){var i,s,l;typeof t=="string"&&(t=JSON.parse(t)),t||(t=new Zn({}));const e=xx(t);e.major===1&&(t=Gp(t));const r=it();t.settings.project.latestVersion=r.version,t.settings.project.initialVersion||(t.settings.project.initialVersion=Mp(e));const n=new Zn(t),a=(l=(s=(i=n==null?void 0:n.settings)==null?void 0:i.app)==null?void 0:s.guides)==null?void 0:l.systemGuides;if(a){const E=z();E.systemGuides={ascent:a.includes("ascent"),capHeight:a.includes("capHeight"),xHeight:a.includes("xHeight"),baseline:a.includes("baseline"),descent:a.includes("descent"),leftSide:a.includes("leftSide"),rightSide:a.includes("rightSide")}}return n}function Gp(t){const e=new Zn({}),r=t.projectsettings.defaultlsb,n=t.projectsettings.defaultrsb;Object.keys(t.glyphs).forEach(H=>{const F=xa(H);e.glyphs[F]=s0(t.glyphs[H],F,r,n)}),Object.keys(t.ligatures).forEach(H=>{const F=xa(H),K=Mr(H);if(K!==!1){let j=K.split("").map(qr);e.ligatures[F]=s0(t.ligatures[H],F,r,n),e.ligatures[F].objType="Ligature",e.ligatures[F].gsub=j}}),Object.keys(t.components).forEach(H=>{const F=xa(H);e.components[F]=s0(t.components[H],F,r,n),e.components[F].objType="Component",e.components[F].advanceWidth=!1}),Object.keys(t.kerning).forEach(H=>{const F=xa(H),K=t.kerning[H];e.kerning[F]=new Ln({value:K.value,leftGroup:K.leftgroup.map(j=>ir(j)),rightGroup:K.rightgroup.map(j=>ir(j))})});const a=e.settings.app,i=e.settings.project.characterRanges,s=e.settings.app.guides,l=e.settings.font,E=t.projectsettings,T=t.projectsettings.glyphrange,h=t.projectsettings.guides,u=t.projectsettings.colors,C=t.metadata;e.settings.project.name=E.name||"My Font";const g={basicLatin:{begin:32,end:127,name:"Basic Latin"},latinSupplementControls:{begin:128,end:159,name:"Latin Supplement Controls"},latinSupplement:{begin:160,end:255,name:"Latin Supplement"},latinExtendedA:{begin:256,end:383,name:"Latin Extended A"},latinExtendedB:{begin:384,end:591,name:"Latin Extended B"}};return T.basiclatin&&i.push(g.basicLatin),T.latinsupplement&&i.push(g.latinSupplement),T.latinextendeda&&i.push(g.latinExtendedA),T.latinextendedb&&i.push(g.latinExtendedB),T.custom.length&&T.custom.forEach(H=>i.push(H)),a.stopPageNavigation=E.stoppagenavigation||!0,a.formatSaveFile=E.formatsavefile||!0,a.contextCharacters.showGuides=E.showcontextglyphguides||!0,a.contextCharacters.transparency=u.contextglyphtransparency||90,s.systemTransparency=u.systemguidetransparency||70,s.customTransparency=u.systemguidetransparency||70,Object.keys(h).forEach(H=>{let F=h[H];F.editable&&s.custom.push(new Q0({angle:F.type==="horizontal"?90:0,location:F.location,name:F.name,color:F.color,visible:F.visible}))}),l.family=C.font_family||"My Font",l.style=C.font_style||"normal",l.panose=C.panose_1||"2 0 0 0 0 0 0 0 0 0",l.upm=E.upm||1e3,l.ascent=E.ascent||700,l.descent=E.descent||-300,l.capHeight=E.capHeight||675,l.xHeight=E.xHeight||400,l.lineGap=E.lineGap||250,l.italicAngle=E.italicAngle||0,l.overshoot=E.overshoot||10,l.designer=C.designer||"",l.designerURL=C.designerURL||"",l.manufacturer=C.manufacturer||"",l.manufacturerURL=C.manufacturerURL||"",l.license=C.license||"",l.licenseURL=C.licenseURL||"",l.version=C.version||"",l.description=C.description||"",l.copyright=C.copyright||"",l.trademark=C.trademark||"",l.variant=C.font_variant||"normal",l.weight=C.font_weight||400,l.stretch=C.font_stretch||"normal",l.stemv=C.stemv||0,l.stemh=C.stemh||0,l.slope=C.slope||0,l.underlinePosition=C.underline_position||-50,l.underlineThickness=C.underline_thickness||10,l.strikethroughPosition=C.strikethrough_position||300,l.strikethrough_thickness=C.strikethrough_thickness||10,l.overlinePosition=C.overline_position||750,l.overlineThickness=C.overline_thickness||10,e}function s0(t,e,r=0,n=0){const a=new ct({id:e,parent:ce(),advanceWidth:t.glyphwidth,ratioLock:t.ratiolock,usedIn:t.usedin.map(xa),contextCharacters:t.contextglyphs});let i;if(t.shapes.forEach(s=>{s.path?(i=bp(s,a),a.addOneShape(i)):(i=vp(s),a.addOneShape(i))}),t.isautowide){const s=t.leftsidebearing||r,l=t.rightsidebearing||n;a.leftSideBearing=s,a.rightSideBearing=l}return a}function bp(t,e){const r=new hr;return r.parent=e,r.name=t.name,r.xLock=t.xlock,r.yLock=t.ylock,r.wLock=t.wlock,r.hLock=t.hlock,r.ratioLock=t.ratiolock,t.path&&t.path.pathpoints.forEach(n=>{r.pathPoints.push(Pp(n,r))}),r}function Pp(t,e){const r=new _t;return r.parent=e,r.p=new ke({coord:t.P,type:"p",parent:r}),r.h1=new ke({coord:t.H1,type:"h1",use:t.useh1,parent:r}),r.h2=new ke({coord:t.H2,type:"h2",use:t.useh2,parent:r}),r}function vp(t){const e=new hn;return e.link=xa(t.link),e.translateX=t.translatex,e.translateY=t.translatey,e.resizeWidth=t.scalew,e.resizeHeight=t.scaleh,e.isFlippedNS=t.flipns,e.isFlippedEW=t.flipew,e.reverseWinding=t.reversewinding,e.rotation=t.rotation,e.rotateFirst=t.rotatefirst,e}function xa(t){let e="";t.startsWith("com")&&(e=`comp-${t.split("com")[1]}`),t.startsWith("kern")&&(e=`kern-${t.split("kern")[1]}`),t.startsWith("id")&&(e=`kern-${t.split("id")[1]}`);const r=Mr(t);return r!==!1&&r.length>1&&(e=di(r)||""),r!==!1&&r.length===1&&(e=`glyph-${ir(t)}`),e}const Up=`{\r
  "settings": {\r
    "project": {\r
      "name": "Boolean Test Project",\r
      "latestVersion": "2.1.4",\r
      "initialVersion": "2.1.4",\r
      "id": "g2_BOOLTEST",\r
      "characterRanges": [\r
        {\r
          "name": "Test Range",\r
          "begin": "0x41",\r
          "end": "0x7A"\r
        },\r
        {\r
          "name": "Basic Latin",\r
          "begin": "0x20",\r
          "end": "0x7F"\r
        }\r
      ]\r
    },\r
    "app": {\r
      "stopPageNavigation": true,\r
      "formatSaveFile": true,\r
      "saveLivePreviews": true,\r
      "autoSave": true,\r
      "savePreferences": false,\r
      "unlinkComponentInstances": true,\r
      "showNonCharPoints": false,\r
      "itemChooserPageSize": 256,\r
      "previewText": false,\r
      "exportLigatures": true,\r
      "exportKerning": true,\r
      "moveShapesOnSVGDragDrop": false,\r
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
        "showCharacters": false,\r
        "characterTransparency": 20,\r
        "showGuides": true,\r
        "guidesTransparency": 70\r
      },\r
      "livePreviews": [\r
        {\r
          "fontSize": 118,\r
          "text": "the quick brown fox jumps over a lazy dog"\r
        }\r
      ]\r
    },\r
    "font": {\r
      "family": "Boolean Test Project",\r
      "style": "Regular",\r
      "version": "1.0",\r
      "description": "",\r
      "panose": "0 0 0 0 0 0 0 0 0 0",\r
      "upm": 2048,\r
      "ascent": 1550,\r
      "descent": -440,\r
      "capHeight": 1480,\r
      "xHeight": 1100,\r
      "overshoot": 30,\r
      "lineGap": 58,\r
      "italicAngle": 0,\r
      "designer": "",\r
      "designerURL": "",\r
      "manufacturer": "",\r
      "manufacturerURL": "",\r
      "license": "",\r
      "licenseURL": "",\r
      "copyright": "",\r
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
      "advanceWidth": 900,\r
      "shapes": [\r
        {\r
          "name": "Rectangle 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 600}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 600}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 100}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 100}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 100}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 100}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy)",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 300,"y": 800}},\r
              "h1": {"coord": {"x": 267.381974248927,"y": 800}, "use": false},\r
              "h2": {"coord": {"x": 332.618025751073,"y": 800}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 800,"y": 800}},\r
              "h1": {"coord": {"x": 767.3819742489266,"y": 800}, "use": false},\r
              "h2": {"coord": {"x": 832.6180257510724,"y": 800}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 800,"y": 300}},\r
              "h1": {"coord": {"x": 767.3819742489266,"y": 300}, "use": false},\r
              "h2": {"coord": {"x": 832.6180257510724,"y": 300}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 300,"y": 300}},\r
              "h1": {"coord": {"x": 267.381974248927,"y": 300}, "use": false},\r
              "h2": {"coord": {"x": 332.618025751073,"y": 300}, "use": false}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x20": {\r
      "id": "glyph-0x20",\r
      "advanceWidth": 200\r
    },\r
    "glyph-0x42": {\r
      "id": "glyph-0x42",\r
      "advanceWidth": 1300,\r
      "shapes": [\r
        {\r
          "name": "Rectangle 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 600}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 600}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 100}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 100}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 100}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 100}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy)",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 400,"y": 900}},\r
              "h1": {"coord": {"x": 367.381974248927,"y": 900}, "use": false},\r
              "h2": {"coord": {"x": 432.618025751073,"y": 900}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 900,"y": 900}},\r
              "h1": {"coord": {"x": 867.3819742489271,"y": 900}, "use": false},\r
              "h2": {"coord": {"x": 932.618025751073,"y": 900}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 900,"y": 400}},\r
              "h1": {"coord": {"x": 867.3819742489271,"y": 400}, "use": false},\r
              "h2": {"coord": {"x": 932.618025751073,"y": 400}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 400,"y": 400}},\r
              "h1": {"coord": {"x": 367.381974248927,"y": 400}, "use": false},\r
              "h2": {"coord": {"x": 432.618025751073,"y": 400}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy 2)",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 700,"y": 1200}},\r
              "h1": {"coord": {"x": 667.381974248927,"y": 1200}, "use": false},\r
              "h2": {"coord": {"x": 732.618025751073,"y": 1200}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1200,"y": 1200}},\r
              "h1": {"coord": {"x": 1167.381974248928,"y": 1200}, "use": false},\r
              "h2": {"coord": {"x": 1232.6180257510737,"y": 1200}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1200,"y": 700}},\r
              "h1": {"coord": {"x": 1167.381974248928,"y": 700}, "use": false},\r
              "h2": {"coord": {"x": 1232.6180257510737,"y": 700}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 700,"y": 700}},\r
              "h1": {"coord": {"x": 667.381974248927,"y": 700}, "use": false},\r
              "h2": {"coord": {"x": 732.618025751073,"y": 700}, "use": false}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x43": {\r
      "id": "glyph-0x43",\r
      "advanceWidth": 1050,\r
      "shapes": [\r
        {\r
          "name": "Rectangle 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 750}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 750}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 750}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 750}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 750}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 750}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 250}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 250}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 250}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 250}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 250}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 250}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy)",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 300,"y": 950}},\r
              "h1": {"coord": {"x": 267.381974248927,"y": 950}, "use": false},\r
              "h2": {"coord": {"x": 332.618025751073,"y": 950}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 800,"y": 950}},\r
              "h1": {"coord": {"x": 767.3819742489266,"y": 950}, "use": false},\r
              "h2": {"coord": {"x": 832.6180257510724,"y": 950}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 800,"y": 450}},\r
              "h1": {"coord": {"x": 767.3819742489266,"y": 450}, "use": false},\r
              "h2": {"coord": {"x": 832.6180257510724,"y": 450}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 300,"y": 450}},\r
              "h1": {"coord": {"x": 267.381974248927,"y": 450}, "use": false},\r
              "h2": {"coord": {"x": 332.618025751073,"y": 450}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy 2)",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 450,"y": 600}},\r
              "h1": {"coord": {"x": 417.381974248927,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 482.6180257510729,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 950,"y": 600}},\r
              "h1": {"coord": {"x": 917.3819742489262,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 982.6180257510722,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 950,"y": 100}},\r
              "h1": {"coord": {"x": 917.3819742489262,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 982.6180257510722,"y": 100}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 450,"y": 100}},\r
              "h1": {"coord": {"x": 417.381974248927,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 482.6180257510729,"y": 100}, "use": false}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x44": {\r
      "id": "glyph-0x44",\r
      "shapes": [\r
        {\r
          "name": "Rectangle 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 600}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 600}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 100}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 100}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 100}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 100}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy)",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 300,"y": 600}},\r
              "h1": {"coord": {"x": 267.381974248927,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 332.618025751073,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 800,"y": 600}},\r
              "h1": {"coord": {"x": 767.3819742489266,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 832.6180257510724,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 800,"y": 100}},\r
              "h1": {"coord": {"x": 767.3819742489266,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 832.6180257510724,"y": 100}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 300,"y": 100}},\r
              "h1": {"coord": {"x": 267.381974248927,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 332.618025751073,"y": 100}, "use": false}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x45": {\r
      "id": "glyph-0x45",\r
      "shapes": [\r
        {\r
          "name": "Oval 1",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 349.7510373443983,"y": 650}},\r
              "h1": {"coord": {"x": 184.13858921161824,"y": 650}},\r
              "h2": {"coord": {"x": 515.3634854771783,"y": 650}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 650,"y": 350.2746987951807}},\r
              "h1": {"coord": {"x": 650,"y": 515.8192771084338}},\r
              "h2": {"coord": {"x": 650,"y": 184.73012048192766}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 349.7510373443983,"y": 50}},\r
              "h1": {"coord": {"x": 515.8614107883817,"y": 50}},\r
              "h2": {"coord": {"x": 183.6406639004149,"y": 50}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 50,"y": 350.2746987951807}},\r
              "h1": {"coord": {"x": 50,"y": 184.1807228915663}},\r
              "h2": {"coord": {"x": 50,"y": 516.3686746987951}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Oval 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 899.8147208121827,"y": 600}},\r
              "h1": {"coord": {"x": 761.5380710659898,"y": 600}},\r
              "h2": {"coord": {"x": 1038.0913705583757,"y": 600}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 1150,"y": 349.9}},\r
              "h1": {"coord": {"x": 1150,"y": 488}},\r
              "h2": {"coord": {"x": 1150,"y": 211.8}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 899.8147208121827,"y": 100}},\r
              "h1": {"coord": {"x": 1038.46192893401,"y": 100}},\r
              "h2": {"coord": {"x": 761.1675126903554,"y": 100}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 650,"y": 349.9}},\r
              "h1": {"coord": {"x": 650,"y": 212}},\r
              "h2": {"coord": {"x": 650,"y": 487.8}}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x46": {\r
      "id": "glyph-0x46",\r
      "advanceWidth": 700,\r
      "shapes": [\r
        {\r
          "name": "Rectangle 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 600}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 600}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 100}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 100}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 100}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 100}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy)",\r
          "winding": 5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 250,"y": 250}},\r
              "h1": {"coord": {"x": 263.04721030042936,"y": 250}, "use": false},\r
              "h2": {"coord": {"x": 236.95278969957073,"y": 250}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 450,"y": 250}},\r
              "h1": {"coord": {"x": 463.0472103004289,"y": 250}, "use": false},\r
              "h2": {"coord": {"x": 436.952343801653,"y": 250}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 450,"y": 450}},\r
              "h1": {"coord": {"x": 463.0472103004289,"y": 450}, "use": false},\r
              "h2": {"coord": {"x": 436.952343801653,"y": 450}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 250,"y": 450}},\r
              "h1": {"coord": {"x": 263.04721030042936,"y": 450}, "use": false},\r
              "h2": {"coord": {"x": 236.95278969957073,"y": 450}, "use": false}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x47": {\r
      "id": "glyph-0x47",\r
      "advanceWidth": 1100,\r
      "shapes": [\r
        {\r
          "name": "Rectangle 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 600}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 600}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 100}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 100}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 100}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 100}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy)",\r
          "winding": 5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 250,"y": 250}},\r
              "h1": {"coord": {"x": 263.04721030042936,"y": 250}, "use": false},\r
              "h2": {"coord": {"x": 236.95278969957073,"y": 250}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 450,"y": 250}},\r
              "h1": {"coord": {"x": 463.0472103004289,"y": 250}, "use": false},\r
              "h2": {"coord": {"x": 436.952343801653,"y": 250}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 450,"y": 450}},\r
              "h1": {"coord": {"x": 463.0472103004289,"y": 450}, "use": false},\r
              "h2": {"coord": {"x": 436.952343801653,"y": 450}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 250,"y": 450}},\r
              "h1": {"coord": {"x": 263.04721030042936,"y": 450}, "use": false},\r
              "h2": {"coord": {"x": 236.95278969957073,"y": 450}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy)",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 500,"y": 1000}},\r
              "h1": {"coord": {"x": 467.3820598006646,"y": 1000}, "use": false},\r
              "h2": {"coord": {"x": 532.6179401993357,"y": 1000}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1000,"y": 1000}},\r
              "h1": {"coord": {"x": 967.3820598006632,"y": 1000}, "use": false},\r
              "h2": {"coord": {"x": 1032.6179401993352,"y": 1000}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1000,"y": 500}},\r
              "h1": {"coord": {"x": 967.3820598006632,"y": 500}, "use": false},\r
              "h2": {"coord": {"x": 1032.6179401993352,"y": 500}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 500,"y": 500}},\r
              "h1": {"coord": {"x": 467.3820598006646,"y": 500}, "use": false},\r
              "h2": {"coord": {"x": 532.6179401993357,"y": 500}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy 2)",\r
          "winding": 5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": 650}},\r
              "h1": {"coord": {"x": 663.0469102990019,"y": 650}, "use": false},\r
              "h2": {"coord": {"x": 636.9527906976746,"y": 650}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 650}},\r
              "h1": {"coord": {"x": 863.0469102990018,"y": 650}, "use": false},\r
              "h2": {"coord": {"x": 836.9521594684384,"y": 650}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 850}},\r
              "h1": {"coord": {"x": 863.0469102990018,"y": 850}, "use": false},\r
              "h2": {"coord": {"x": 836.9521594684384,"y": 850}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": 850}},\r
              "h1": {"coord": {"x": 663.0469102990019,"y": 850}, "use": false},\r
              "h2": {"coord": {"x": 636.9527906976746,"y": 850}, "use": false}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x48": {\r
      "id": "glyph-0x48",\r
      "advanceWidth": 950,\r
      "shapes": [\r
        {\r
          "name": "Rectangle 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 600}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 600}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 600}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 600}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 100}},\r
              "h1": {"coord": {"x": 567.381974248927,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 632.6180257510729,"y": 100}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 100}},\r
              "h1": {"coord": {"x": 67.38197424892704,"y": 100}, "use": false},\r
              "h2": {"coord": {"x": 132.61802575107296,"y": 100}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy)",\r
          "winding": 5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 250,"y": 250}},\r
              "h1": {"coord": {"x": 263.04721030042936,"y": 250}, "use": false},\r
              "h2": {"coord": {"x": 236.95278969957073,"y": 250}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 450,"y": 250}},\r
              "h1": {"coord": {"x": 463.0472103004289,"y": 250}, "use": false},\r
              "h2": {"coord": {"x": 436.952343801653,"y": 250}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 450,"y": 450}},\r
              "h1": {"coord": {"x": 463.0472103004289,"y": 450}, "use": false},\r
              "h2": {"coord": {"x": 436.952343801653,"y": 450}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 250,"y": 450}},\r
              "h1": {"coord": {"x": 263.04721030042936,"y": 450}, "use": false},\r
              "h2": {"coord": {"x": 236.95278969957073,"y": 450}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy)",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 350,"y": 850}},\r
              "h1": {"coord": {"x": 317.3820598006646,"y": 850}, "use": false},\r
              "h2": {"coord": {"x": 382.61794019933575,"y": 850}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 850}},\r
              "h1": {"coord": {"x": 817.3820598006625,"y": 850}, "use": false},\r
              "h2": {"coord": {"x": 882.6179401993343,"y": 850}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 350}},\r
              "h1": {"coord": {"x": 817.3820598006625,"y": 350}, "use": false},\r
              "h2": {"coord": {"x": 882.6179401993343,"y": 350}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 350,"y": 350}},\r
              "h1": {"coord": {"x": 317.3820598006646,"y": 350}, "use": false},\r
              "h2": {"coord": {"x": 382.61794019933575,"y": 350}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 0 (copy 2)",\r
          "winding": 5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 500,"y": 500}},\r
              "h1": {"coord": {"x": 513.0469102990012,"y": 500}, "use": false},\r
              "h2": {"coord": {"x": 486.952790697674,"y": 500}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 700,"y": 500}},\r
              "h1": {"coord": {"x": 713.046910299001,"y": 500}, "use": false},\r
              "h2": {"coord": {"x": 686.9521594684377,"y": 500}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 700,"y": 700}},\r
              "h1": {"coord": {"x": 713.046910299001,"y": 700}, "use": false},\r
              "h2": {"coord": {"x": 686.9521594684377,"y": 700}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 500,"y": 700}},\r
              "h1": {"coord": {"x": 513.0469102990012,"y": 700}, "use": false},\r
              "h2": {"coord": {"x": 486.952790697674,"y": 700}, "use": false}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x49": {\r
      "id": "glyph-0x49",\r
      "advanceWidth": 1046.1516604685944,\r
      "shapes": [\r
        {\r
          "name": "Oval 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 349.8147208121827,"y": 600}},\r
              "h1": {"coord": {"x": 211.5380710659898,"y": 600}},\r
              "h2": {"coord": {"x": 488.0913705583756,"y": 600}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 600,"y": 349.9}},\r
              "h1": {"coord": {"x": 600,"y": 488}},\r
              "h2": {"coord": {"x": 600,"y": 211.8}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 349.8147208121827,"y": 100}},\r
              "h1": {"coord": {"x": 488.46192893401013,"y": 100}},\r
              "h2": {"coord": {"x": 211.1675126903553,"y": 100}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 100,"y": 349.9}},\r
              "h1": {"coord": {"x": 100,"y": 212}},\r
              "h2": {"coord": {"x": 100,"y": 487.8}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 492.51162790697674,"y": 651.8272425249173}},\r
              "h1": {"coord": {"x": 196.83056478405263,"y": 226.57807308970018}},\r
              "h2": {"coord": {"x": 788.1926910299009,"y": 1077.0764119601345}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 695.1694352159468,"y": 286.3787375415282}},\r
              "h1": {"coord": {"x": 1230.0531561461796,"y": 312.95681063122925}},\r
              "h2": {"coord": {"x": 160.285714285714,"y": 259.8006644518272}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 721.747508305648,"y": 555.4817275747511}},\r
              "h1": {"coord": {"x": 794.8372093023256,"y": 469.10299003322325}},\r
              "h2": {"coord": {"x": 648.6578073089704,"y": 641.8604651162789}}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x4A": {\r
      "id": "glyph-0x4A",\r
      "advanceWidth": 1009.8512753082377,\r
      "shapes": [\r
        {\r
          "name": "Oval 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 480.29703204063384,"y": 600}},\r
              "h1": {"coord": {"x": 342.02038229444094,"y": 600}},\r
              "h2": {"coord": {"x": 618.5736817868267,"y": 600}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 730.4823112284512,"y": 349.9}},\r
              "h1": {"coord": {"x": 730.4823112284512,"y": 488}},\r
              "h2": {"coord": {"x": 730.4823112284512,"y": 211.8}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 480.29703204063384,"y": 100}},\r
              "h1": {"coord": {"x": 618.9442401624613,"y": 100}},\r
              "h2": {"coord": {"x": 341.6498239188064,"y": 100}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 230.48231122845112,"y": 349.9}},\r
              "h1": {"coord": {"x": 230.48231122845112,"y": 212}},\r
              "h2": {"coord": {"x": 230.48231122845112,"y": 487.8}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 249.00961223921098,"y": 456.257362994337}},\r
              "h1": {"coord": {"x": -376.5604085008617,"y": 284.80123931528044}},\r
              "h2": {"coord": {"x": 888.7830427088813,"y": 624.3717836576856}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 443.62941708584185,"y": 248.6604326209002}},\r
              "h1": {"coord": {"x": 1370.650893521688,"y": 50.99549041624297}},\r
              "h2": {"coord": {"x": -483.1573382248501,"y": 447.3200572437637}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 778.6209306829899,"y": 336.0498216025141}},\r
              "h1": {"coord": {"x": 885.2025229186208,"y": 246.26987211946928}},\r
              "h2": {"coord": {"x": 662.0642385057556,"y": 428.6907057837829}}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x4B": {\r
      "id": "glyph-0x4B",\r
      "advanceWidth": 1482.790697645294,\r
      "shapes": [\r
        {\r
          "name": "Path 1",\r
          "winding": 3,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 229.56810631229249,"y": 728.2392026578071}},\r
              "h1": {"coord": {"x": 179.56810631229246,"y": 728.2392026578071}, "use": false},\r
              "h2": {"coord": {"x": 279.56810631229246,"y": 728.2392026578071}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 100,"y": 628.5714285714288}},\r
              "h1": {"coord": {"x": 50,"y": 628.5714285714288}, "use": false},\r
              "h2": {"coord": {"x": 150,"y": 628.5714285714288}, "use": false}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 913.9534883720931,"y": 63.78737541528254}},\r
              "h1": {"coord": {"x": 448.83720930232573,"y": 60.46511627906992}},\r
              "h2": {"coord": {"x": 1379.0697674418607,"y": 67.10963455149516}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 1382.392026578073,"y": 449.16943521594703}},\r
              "h1": {"coord": {"x": 1385.7142857142856,"y": 246.51162790697663}},\r
              "h2": {"coord": {"x": 1379.0697674418604,"y": 651.8272425249174}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 997.0099667774085,"y": 834.5514950166114}},\r
              "h1": {"coord": {"x": 1262.7906976744182,"y": 834.5514950166115}},\r
              "h2": {"coord": {"x": 731.2292358803988,"y": 834.5514950166113}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 119.9335548172757,"y": 209.9667774086379}},\r
              "h1": {"coord": {"x": 69.9335548172757,"y": 209.9667774086379}, "use": false},\r
              "h2": {"coord": {"x": 169.93355481727568,"y": 209.9667774086379}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 262.79069767441865,"y": 50.49833887043204}},\r
              "h1": {"coord": {"x": 212.79069767441862,"y": 50.49833887043204}, "use": false},\r
              "h2": {"coord": {"x": 312.79069767441865,"y": 50.49833887043204}, "use": false}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 997.0099667774087,"y": 651.8272425249171}},\r
              "h1": {"coord": {"x": 787.7076411960135,"y": 658.4717607973423}},\r
              "h2": {"coord": {"x": 1206.312292358804,"y": 645.1827242524919}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 1236.2126245847173,"y": 429.2358803986712}},\r
              "h1": {"coord": {"x": 1239.53488372093,"y": 528.9036544850501}},\r
              "h2": {"coord": {"x": 1232.8903654485046,"y": 329.56810631229234}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 894.0199335548174,"y": 200}},\r
              "h1": {"coord": {"x": 1149.8338870431894,"y": 206.6445182724251}},\r
              "h2": {"coord": {"x": 638.2059800664454,"y": 193.3554817275749}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Rectangle 1",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 400}},\r
              "h1": {"coord": {"x": 814.1666666666666,"y": 400}, "use": false},\r
              "h2": {"coord": {"x": 885.8333333333334,"y": 400}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 950,"y": 400}},\r
              "h1": {"coord": {"x": 914.1666666666666,"y": 400}, "use": false},\r
              "h2": {"coord": {"x": 985.8333333333333,"y": 400}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 950,"y": 300}},\r
              "h1": {"coord": {"x": 914.1666666666666,"y": 300}, "use": false},\r
              "h2": {"coord": {"x": 985.8333333333333,"y": 300}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 300}},\r
              "h1": {"coord": {"x": 814.1666666666666,"y": 300}, "use": false},\r
              "h2": {"coord": {"x": 885.8333333333334,"y": 300}, "use": false}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x4C": {\r
      "id": "glyph-0x4C",\r
      "advanceWidth": 700,\r
      "shapes": [\r
        {\r
          "name": "Oval 1",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 349.7510373443983,"y": 650}},\r
              "h1": {"coord": {"x": 184.13858921161824,"y": 650}},\r
              "h2": {"coord": {"x": 515.3634854771783,"y": 650}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 650,"y": 350.2746987951807}},\r
              "h1": {"coord": {"x": 650,"y": 515.8192771084338}},\r
              "h2": {"coord": {"x": 650,"y": 184.73012048192766}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 349.7510373443983,"y": 50}},\r
              "h1": {"coord": {"x": 515.8614107883817,"y": 50}},\r
              "h2": {"coord": {"x": 183.6406639004149,"y": 50}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 50,"y": 350.2746987951807}},\r
              "h1": {"coord": {"x": 50,"y": 184.1807228915663}},\r
              "h2": {"coord": {"x": 50,"y": 516.3686746987951}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Oval 0",\r
          "winding": 5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 150,"y": 349.92}},\r
              "h1": {"coord": {"x": 150,"y": 460.24}},\r
              "h2": {"coord": {"x": 150,"y": 239.6}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 349.85177664974606,"y": 150}},\r
              "h1": {"coord": {"x": 238.93401015228432,"y": 150}},\r
              "h2": {"coord": {"x": 460.7695431472078,"y": 150}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 550,"y": 349.92}},\r
              "h1": {"coord": {"x": 550,"y": 239.44}},\r
              "h2": {"coord": {"x": 550,"y": 460.4}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 349.85177664974606,"y": 550}},\r
              "h1": {"coord": {"x": 460.4730964467003,"y": 550}},\r
              "h2": {"coord": {"x": 239.2304568527918,"y": 550}}\r
            }\r
          ],\r
          "transformOrigin": "middle-center"\r
        },\r
        {\r
          "name": "Rectangle 2",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 300,"y": 700}},\r
              "h1": {"coord": {"x": 249.5921693898437,"y": 700}, "use": false},\r
              "h2": {"coord": {"x": 350.4078306101563,"y": 700}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 400,"y": 700}},\r
              "h1": {"coord": {"x": 349.5921693898437,"y": 700}, "use": false},\r
              "h2": {"coord": {"x": 450.40783061015634,"y": 700}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 400,"y": 0}},\r
              "h1": {"coord": {"x": 349.5921693898437,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 450.40783061015634,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 300,"y": 0}},\r
              "h1": {"coord": {"x": 249.5921693898437,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 350.4078306101563,"y": 0}, "use": false}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x4D": {\r
      "id": "glyph-0x4D",\r
      "advanceWidth": 1293.7111040495865,\r
      "shapes": [\r
        {\r
          "name": "Oval 0",\r
          "winding": 5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 426.498769569797,"y": 369.13910391925504}},\r
              "h1": {"coord": {"x": 426.498769569797,"y": 517.6556402556512}},\r
              "h2": {"coord": {"x": 426.498769569797,"y": 220.6225675828594}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 676.3134903819797,"y": 100}},\r
              "h1": {"coord": {"x": 537.6662822601522,"y": 100}},\r
              "h2": {"coord": {"x": 814.9606985038072,"y": 100}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 926.498769569797,"y": 369.13910391925504}},\r
              "h1": {"coord": {"x": 926.498769569797,"y": 220.40717014074713}},\r
              "h2": {"coord": {"x": 926.498769569797,"y": 517.8710376977633}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 676.3134903819797,"y": 638.4936052806227}},\r
              "h1": {"coord": {"x": 814.5901401281726,"y": 638.4936052806227}},\r
              "h2": {"coord": {"x": 538.0368406357868,"y": 638.4936052806227}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 280.7738858488668,"y": 496.8951039199978}},\r
              "h1": {"coord": {"x": -468.36201388153097,"y": 179.05473751658434}},\r
              "h2": {"coord": {"x": 1057.3545873438309,"y": 814.7354703234118}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 616.4986769334952,"y": 335.49202893012404}},\r
              "h1": {"coord": {"x": 1819.5122629684727,"y": 355.8325000152958}},\r
              "h2": {"coord": {"x": -586.5155958787078,"y": 316.1024019248308}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 1005.0496488205681,"y": 501.35268950272155}},\r
              "h1": {"coord": {"x": 1159.8596082215054,"y": 436.8068372670515}},\r
              "h2": {"coord": {"x": 831.085708932448,"y": 566.3463066024372}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Oval 0",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 484.3204494618038,"y": 779.4019933554814}},\r
              "h1": {"coord": {"x": 336.4628195208687,"y": 779.4019933554814}},\r
              "h2": {"coord": {"x": 632.1780794027391,"y": 779.4019933554814}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 751.8406887409622,"y": 529.3019933554821}},\r
              "h1": {"coord": {"x": 751.8406887409622,"y": 667.4019933554814}},\r
              "h2": {"coord": {"x": 751.8406887409622,"y": 391.2019933554827}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 484.3204494618038,"y": 279.4019933554817}},\r
              "h1": {"coord": {"x": 632.5743132084958,"y": 279.4019933554817}},\r
              "h2": {"coord": {"x": 336.06658571511275,"y": 279.4019933554817}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 217.1964439884016,"y": 529.3019933554821}},\r
              "h1": {"coord": {"x": 217.1964439884016,"y": 391.4019933554819}},\r
              "h2": {"coord": {"x": 217.1964439884016,"y": 667.2019933554823}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": 5,\r
          "pathPoints": [\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 832.2994340216236,"y": 734.8837209302325}},\r
              "h1": {"coord": {"x": 759.2097330249464,"y": 821.2624584717603}},\r
              "h2": {"coord": {"x": 905.3891350183007,"y": 648.5049833887047}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 805.7213609319226,"y": 465.7807308970102}},\r
              "h1": {"coord": {"x": 270.8376400016903,"y": 439.2026578073091}},\r
              "h2": {"coord": {"x": 1340.605081862155,"y": 492.3588039867113}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 603.0635536229532,"y": 831.2292358803987}},\r
              "h1": {"coord": {"x": 898.7446167458766,"y": 1256.4784053156172}},\r
              "h2": {"coord": {"x": 307.3824905000299,"y": 405.9800664451802}}\r
            }\r
          ]\r
        }\r
      ]\r
    }\r
  },\r
  "ligatures": {},\r
  "components": {},\r
  "kerning": {}\r
}`,v0=`{\r
  "settings": {\r
    "project": {\r
      "name": "Oblegg",\r
      "latestVersion": "2.1.2",\r
      "initialVersion": "2.1.2",\r
      "id": "g2_OBLEGG2",\r
      "characterRanges": [\r
        {\r
          "name": "Basic Latin",\r
          "begin": "0x20",\r
          "end": "0x7F"\r
        },\r
        {\r
          "name": "General Punctuation",\r
          "begin": "0x2000",\r
          "end": "0x206F"\r
        }\r
      ]\r
    },\r
    "app": {\r
      "savePreferences": false,\r
      "stopPageNavigation": true,\r
      "autoSave": true,\r
      "showNonCharPoints": false,\r
      "itemChooserPageSize": 256,\r
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
              "p": {"coord": {"x": 1207,"y": 174}},\r
              "h1": {"coord": {"x": 1210,"y": 174}},\r
              "h2": {"coord": {"x": 1257,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1113,"y": 174}},\r
              "h1": {"coord": {"x": 1063,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 1163,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 755,"y": 1316}},\r
              "h1": {"coord": {"x": 705,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 805,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 800,"y": 1316}},\r
              "h1": {"coord": {"x": 750,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 803,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 805,"y": 1321}},\r
              "h1": {"coord": {"x": 805,"y": 1318}},\r
              "h2": {"coord": {"x": 855,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 805,"y": 1485}},\r
              "h1": {"coord": {"x": 755,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 805,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 800,"y": 1490}},\r
              "h1": {"coord": {"x": 803,"y": 1490}},\r
              "h2": {"coord": {"x": 850,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 439,"y": 1490}},\r
              "h1": {"coord": {"x": 389,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 436,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 434,"y": 1485}},\r
              "h1": {"coord": {"x": 434,"y": 1488}},\r
              "h2": {"coord": {"x": 484,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 434,"y": 1321}},\r
              "h1": {"coord": {"x": 384,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 434,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 439,"y": 1316}},\r
              "h1": {"coord": {"x": 436,"y": 1316}},\r
              "h2": {"coord": {"x": 489,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 484,"y": 1316}},\r
              "h1": {"coord": {"x": 434,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 534,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 126,"y": 174}},\r
              "h1": {"coord": {"x": 76,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 176,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 174}},\r
              "h1": {"coord": {"x": -5,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 169}},\r
              "h1": {"coord": {"x": 40,"y": 172}},\r
              "h2": {"coord": {"x": 90,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 0}},\r
              "h1": {"coord": {"x": 321,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 374,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 5}},\r
              "h1": {"coord": {"x": 376,"y": 2}},\r
              "h2": {"coord": {"x": 426,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 169}},\r
              "h1": {"coord": {"x": 326,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 376,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 174}},\r
              "h1": {"coord": {"x": 374,"y": 174}},\r
              "h2": {"coord": {"x": 421,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 289,"y": 174}},\r
              "h1": {"coord": {"x": 239,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 339,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 378,"y": 456}},\r
              "h1": {"coord": {"x": 328,"y": 456}, "use": false},\r
              "h2": {"coord": {"x": 428,"y": 456}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 851,"y": 456}},\r
              "h1": {"coord": {"x": 801,"y": 456}, "use": false},\r
              "h2": {"coord": {"x": 901,"y": 456}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 940,"y": 174}},\r
              "h1": {"coord": {"x": 890,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 990,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 872,"y": 174}},\r
              "h1": {"coord": {"x": 822,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 869,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 867,"y": 169}},\r
              "h1": {"coord": {"x": 867,"y": 172}},\r
              "h2": {"coord": {"x": 917,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 867,"y": 5}},\r
              "h1": {"coord": {"x": 817,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 867,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 872,"y": 0}},\r
              "h1": {"coord": {"x": 869,"y": 0}},\r
              "h2": {"coord": {"x": 922,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1207,"y": 0}},\r
              "h1": {"coord": {"x": 1157,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1210,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1212,"y": 5}},\r
              "h1": {"coord": {"x": 1212,"y": 2}},\r
              "h2": {"coord": {"x": 1262,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1212,"y": 169}},\r
              "h1": {"coord": {"x": 1162,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 1212,"y": 172}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -4,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 432,"y": 630}},\r
              "h1": {"coord": {"x": 382,"y": 630}, "use": false},\r
              "h2": {"coord": {"x": 482,"y": 630}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 614,"y": 1211}},\r
              "h1": {"coord": {"x": 564,"y": 1211}, "use": false},\r
              "h2": {"coord": {"x": 664,"y": 1211}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 797,"y": 630}},\r
              "h1": {"coord": {"x": 747,"y": 630}, "use": false},\r
              "h2": {"coord": {"x": 847,"y": 630}, "use": false}\r
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
              "p": {"coord": {"x": 832,"y": 783}},\r
              "h1": {"coord": {"x": 978,"y": 686}},\r
              "h2": {"coord": {"x": 906,"y": 862}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 940,"y": 1058}},\r
              "h1": {"coord": {"x": 940,"y": 969}},\r
              "h2": {"coord": {"x": 940,"y": 1180}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 578,"y": 1490}},\r
              "h1": {"coord": {"x": 907,"y": 1483}},\r
              "h2": {"coord": {"x": 628,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 578,"y": 1490}},\r
              "h1": {"coord": {"x": 528,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 628,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1323}},\r
              "h1": {"coord": {"x": -10,"y": 1323}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1320}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1318}},\r
              "h1": {"coord": {"x": 42,"y": 1318}},\r
              "h2": {"coord": {"x": 95,"y": 1318}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 150,"y": 1318}},\r
              "h1": {"coord": {"x": 100,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 200,"y": 1318}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 150,"y": 172}},\r
              "h1": {"coord": {"x": 100,"y": 172}, "use": false},\r
              "h2": {"coord": {"x": 200,"y": 172}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 172}},\r
              "h1": {"coord": {"x": -5,"y": 172}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 167}},\r
              "h1": {"coord": {"x": 40,"y": 170}},\r
              "h2": {"coord": {"x": 90,"y": 167}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 628,"y": 0}},\r
              "h1": {"coord": {"x": 578,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 938,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1012,"y": 396}},\r
              "h1": {"coord": {"x": 1012,"y": 230}},\r
              "h2": {"coord": {"x": 1012,"y": 489}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -6,\r
          "pathPoints": [\r
            {\r
              "type": "flat",\r
              "p": {"coord": {"x": 565,"y": 1318}},\r
              "h1": {"coord": {"x": 515,"y": 1318}},\r
              "h2": {"coord": {"x": 732,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 796,"y": 1058}},\r
              "h1": {"coord": {"x": 796,"y": 1225}},\r
              "h2": {"coord": {"x": 796,"y": 938}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 566,"y": 840}},\r
              "h1": {"coord": {"x": 708,"y": 840}},\r
              "h2": {"coord": {"x": 616,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 322,"y": 840}},\r
              "h1": {"coord": {"x": 272,"y": 840}, "use": false},\r
              "h2": {"coord": {"x": 372,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 322,"y": 1318}},\r
              "h1": {"coord": {"x": 272,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 372,"y": 1318}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 3",\r
          "winding": -6,\r
          "pathPoints": [\r
            {\r
              "type": "flat",\r
              "p": {"coord": {"x": 628,"y": 172}},\r
              "h1": {"coord": {"x": 774,"y": 172}},\r
              "h2": {"coord": {"x": 578,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 322,"y": 172}},\r
              "h1": {"coord": {"x": 272,"y": 172}, "use": false},\r
              "h2": {"coord": {"x": 372,"y": 172}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 322,"y": 665}},\r
              "h1": {"coord": {"x": 272,"y": 665}, "use": false},\r
              "h2": {"coord": {"x": 372,"y": 665}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 628,"y": 665}},\r
              "h1": {"coord": {"x": 578,"y": 665}, "use": false},\r
              "h2": {"coord": {"x": 799,"y": 665}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 864,"y": 396}},\r
              "h1": {"coord": {"x": 864,"y": 568}},\r
              "h2": {"coord": {"x": 864,"y": 273}}\r
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
              "p": {"coord": {"x": 852,"y": 1256}},\r
              "h1": {"coord": {"x": 849,"y": 1256}},\r
              "h2": {"coord": {"x": 902,"y": 1256}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1017,"y": 1256}},\r
              "h1": {"coord": {"x": 967,"y": 1256}, "use": false},\r
              "h2": {"coord": {"x": 1020,"y": 1256}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1022,"y": 1261}},\r
              "h1": {"coord": {"x": 1022,"y": 1258}},\r
              "h2": {"coord": {"x": 1072,"y": 1261}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1022,"y": 1407}},\r
              "h1": {"coord": {"x": 972,"y": 1407}, "use": false},\r
              "h2": {"coord": {"x": 1022,"y": 1453}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 939,"y": 1490}},\r
              "h1": {"coord": {"x": 985,"y": 1490}},\r
              "h2": {"coord": {"x": 989,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 704,"y": 1490}},\r
              "h1": {"coord": {"x": 654,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 490,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 196,"y": 1230}},\r
              "h1": {"coord": {"x": 314,"y": 1400}},\r
              "h2": {"coord": {"x": 144,"y": 1155}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 78,"y": 965}},\r
              "h1": {"coord": {"x": 104,"y": 1066}},\r
              "h2": {"coord": {"x": 53,"y": 870}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 657}},\r
              "h1": {"coord": {"x": 40,"y": 766}},\r
              "h2": {"coord": {"x": 40,"y": 431}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 207,"y": 159}},\r
              "h1": {"coord": {"x": 95,"y": 268}},\r
              "h2": {"coord": {"x": 317,"y": 52}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 704,"y": 0}},\r
              "h1": {"coord": {"x": 479,"y": 0}},\r
              "h2": {"coord": {"x": 754,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 939,"y": 0}},\r
              "h1": {"coord": {"x": 889,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 985,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1022,"y": 83}},\r
              "h1": {"coord": {"x": 1022,"y": 37}},\r
              "h2": {"coord": {"x": 1072,"y": 83}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1022,"y": 224}},\r
              "h1": {"coord": {"x": 972,"y": 224}, "use": false},\r
              "h2": {"coord": {"x": 1022,"y": 227}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1017,"y": 229}},\r
              "h1": {"coord": {"x": 1020,"y": 229}},\r
              "h2": {"coord": {"x": 1067,"y": 229}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 852,"y": 229}},\r
              "h1": {"coord": {"x": 802,"y": 229}, "use": false},\r
              "h2": {"coord": {"x": 849,"y": 229}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 847,"y": 224}},\r
              "h1": {"coord": {"x": 847,"y": 227}},\r
              "h2": {"coord": {"x": 897,"y": 224}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 847,"y": 172}},\r
              "h1": {"coord": {"x": 797,"y": 172}, "use": false},\r
              "h2": {"coord": {"x": 897,"y": 172}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 704,"y": 172}},\r
              "h1": {"coord": {"x": 654,"y": 172}, "use": false},\r
              "h2": {"coord": {"x": 350,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 212,"y": 657}},\r
              "h1": {"coord": {"x": 212,"y": 308}},\r
              "h2": {"coord": {"x": 212,"y": 847}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 337,"y": 1132}},\r
              "h1": {"coord": {"x": 256,"y": 1016}},\r
              "h2": {"coord": {"x": 423,"y": 1255}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 704,"y": 1318}},\r
              "h1": {"coord": {"x": 547,"y": 1318}},\r
              "h2": {"coord": {"x": 754,"y": 1318}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 847,"y": 1318}},\r
              "h1": {"coord": {"x": 797,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 897,"y": 1318}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 847,"y": 1261}},\r
              "h1": {"coord": {"x": 797,"y": 1261}, "use": false},\r
              "h2": {"coord": {"x": 847,"y": 1258}}\r
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
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 463,"y": 0}},\r
              "h1": {"coord": {"x": 413,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 688,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 960,"y": 159}},\r
              "h1": {"coord": {"x": 850,"y": 52}},\r
              "h2": {"coord": {"x": 1072,"y": 268}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1127,"y": 657}},\r
              "h1": {"coord": {"x": 1127,"y": 431}},\r
              "h2": {"coord": {"x": 1127,"y": 766}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1090,"y": 965}},\r
              "h1": {"coord": {"x": 1115,"y": 870}},\r
              "h2": {"coord": {"x": 1064,"y": 1066}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 971,"y": 1230}},\r
              "h1": {"coord": {"x": 1023,"y": 1155}},\r
              "h2": {"coord": {"x": 853,"y": 1400}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 463,"y": 1490}},\r
              "h1": {"coord": {"x": 677,"y": 1490}},\r
              "h2": {"coord": {"x": 513,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1323}},\r
              "h1": {"coord": {"x": -10,"y": 1323}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1320}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1318}},\r
              "h1": {"coord": {"x": 42,"y": 1318}},\r
              "h2": {"coord": {"x": 95,"y": 1318}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 148,"y": 1318}},\r
              "h1": {"coord": {"x": 98,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 198,"y": 1318}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 148,"y": 172}},\r
              "h1": {"coord": {"x": 98,"y": 172}, "use": false},\r
              "h2": {"coord": {"x": 198,"y": 172}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 172}},\r
              "h1": {"coord": {"x": -5,"y": 172}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 167}},\r
              "h1": {"coord": {"x": 40,"y": 170}},\r
              "h2": {"coord": {"x": 90,"y": 167}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 320,"y": 1318}},\r
              "h1": {"coord": {"x": 270,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 370,"y": 1318}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 463,"y": 1318}},\r
              "h1": {"coord": {"x": 413,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 620,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 830,"y": 1132}},\r
              "h1": {"coord": {"x": 744,"y": 1255}},\r
              "h2": {"coord": {"x": 911,"y": 1016}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 955,"y": 657}},\r
              "h1": {"coord": {"x": 955,"y": 847}},\r
              "h2": {"coord": {"x": 955,"y": 308}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 463,"y": 172}},\r
              "h1": {"coord": {"x": 817,"y": 172}},\r
              "h2": {"coord": {"x": 513,"y": 172}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 320,"y": 172}},\r
              "h1": {"coord": {"x": 270,"y": 172}, "use": false},\r
              "h2": {"coord": {"x": 370,"y": 172}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 320,"y": 1318}},\r
              "h1": {"coord": {"x": 270,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 370,"y": 1318}, "use": false}\r
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
              "p": {"coord": {"x": 787,"y": 1232}},\r
              "h1": {"coord": {"x": 737,"y": 1232}, "use": false},\r
              "h2": {"coord": {"x": 787,"y": 1229}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 792,"y": 1227}},\r
              "h1": {"coord": {"x": 789,"y": 1227}},\r
              "h2": {"coord": {"x": 842,"y": 1227}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 956,"y": 1227}},\r
              "h1": {"coord": {"x": 906,"y": 1227}, "use": false},\r
              "h2": {"coord": {"x": 959,"y": 1227}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 961,"y": 1232}},\r
              "h1": {"coord": {"x": 961,"y": 1229}},\r
              "h2": {"coord": {"x": 1011,"y": 1232}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 961,"y": 1490}},\r
              "h1": {"coord": {"x": 911,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 1011,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1321}},\r
              "h1": {"coord": {"x": -10,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1316}},\r
              "h1": {"coord": {"x": 42,"y": 1316}},\r
              "h2": {"coord": {"x": 95,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 101,"y": 1316}},\r
              "h1": {"coord": {"x": 51,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 151,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 101,"y": 174}},\r
              "h1": {"coord": {"x": 51,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 151,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 174}},\r
              "h1": {"coord": {"x": -5,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 169}},\r
              "h1": {"coord": {"x": 40,"y": 172}},\r
              "h2": {"coord": {"x": 90,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 961,"y": 0}},\r
              "h1": {"coord": {"x": 911,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1011,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 961,"y": 258}},\r
              "h1": {"coord": {"x": 911,"y": 258}, "use": false},\r
              "h2": {"coord": {"x": 961,"y": 261}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 956,"y": 263}},\r
              "h1": {"coord": {"x": 959,"y": 263}},\r
              "h2": {"coord": {"x": 1006,"y": 263}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 792,"y": 263}},\r
              "h1": {"coord": {"x": 742,"y": 263}, "use": false},\r
              "h2": {"coord": {"x": 789,"y": 263}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 787,"y": 258}},\r
              "h1": {"coord": {"x": 787,"y": 261}},\r
              "h2": {"coord": {"x": 837,"y": 258}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 787,"y": 174}},\r
              "h1": {"coord": {"x": 737,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 837,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 274,"y": 174}},\r
              "h1": {"coord": {"x": 224,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 324,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 274,"y": 665}},\r
              "h1": {"coord": {"x": 224,"y": 665}, "use": false},\r
              "h2": {"coord": {"x": 324,"y": 665}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 583,"y": 665}},\r
              "h1": {"coord": {"x": 533,"y": 665}, "use": false},\r
              "h2": {"coord": {"x": 586,"y": 665}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 588,"y": 670}},\r
              "h1": {"coord": {"x": 588,"y": 667}},\r
              "h2": {"coord": {"x": 638,"y": 670}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 588,"y": 835}},\r
              "h1": {"coord": {"x": 538,"y": 835}, "use": false},\r
              "h2": {"coord": {"x": 588,"y": 838}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 583,"y": 840}},\r
              "h1": {"coord": {"x": 586,"y": 840}},\r
              "h2": {"coord": {"x": 633,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 274,"y": 840}},\r
              "h1": {"coord": {"x": 224,"y": 840}, "use": false},\r
              "h2": {"coord": {"x": 324,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 274,"y": 1316}},\r
              "h1": {"coord": {"x": 224,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 324,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 787,"y": 1316}},\r
              "h1": {"coord": {"x": 737,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 837,"y": 1316}, "use": false}\r
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
              "p": {"coord": {"x": 45,"y": 174}},\r
              "h1": {"coord": {"x": -5,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 169}},\r
              "h1": {"coord": {"x": 40,"y": 172}},\r
              "h2": {"coord": {"x": 90,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 0}},\r
              "h1": {"coord": {"x": 321,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 374,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 5}},\r
              "h1": {"coord": {"x": 376,"y": 2}},\r
              "h2": {"coord": {"x": 426,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 169}},\r
              "h1": {"coord": {"x": 326,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 376,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 174}},\r
              "h1": {"coord": {"x": 374,"y": 174}},\r
              "h2": {"coord": {"x": 421,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 276,"y": 174}},\r
              "h1": {"coord": {"x": 226,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 326,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 276,"y": 665}},\r
              "h1": {"coord": {"x": 226,"y": 665}, "use": false},\r
              "h2": {"coord": {"x": 326,"y": 665}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 665}},\r
              "h1": {"coord": {"x": 550,"y": 665}, "use": false},\r
              "h2": {"coord": {"x": 603,"y": 665}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 605,"y": 670}},\r
              "h1": {"coord": {"x": 605,"y": 667}},\r
              "h2": {"coord": {"x": 655,"y": 670}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 605,"y": 835}},\r
              "h1": {"coord": {"x": 555,"y": 835}, "use": false},\r
              "h2": {"coord": {"x": 605,"y": 838}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 840}},\r
              "h1": {"coord": {"x": 603,"y": 840}},\r
              "h2": {"coord": {"x": 650,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 276,"y": 840}},\r
              "h1": {"coord": {"x": 226,"y": 840}, "use": false},\r
              "h2": {"coord": {"x": 326,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 276,"y": 1316}},\r
              "h1": {"coord": {"x": 226,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 326,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 789,"y": 1316}},\r
              "h1": {"coord": {"x": 739,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 839,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 789,"y": 1232}},\r
              "h1": {"coord": {"x": 739,"y": 1232}, "use": false},\r
              "h2": {"coord": {"x": 789,"y": 1229}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 794,"y": 1227}},\r
              "h1": {"coord": {"x": 791,"y": 1227}},\r
              "h2": {"coord": {"x": 844,"y": 1227}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 958,"y": 1227}},\r
              "h1": {"coord": {"x": 908,"y": 1227}, "use": false},\r
              "h2": {"coord": {"x": 961,"y": 1227}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 963,"y": 1232}},\r
              "h1": {"coord": {"x": 963,"y": 1229}},\r
              "h2": {"coord": {"x": 1013,"y": 1232}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 963,"y": 1490}},\r
              "h1": {"coord": {"x": 913,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 1013,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1321}},\r
              "h1": {"coord": {"x": -10,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1316}},\r
              "h1": {"coord": {"x": 42,"y": 1316}},\r
              "h2": {"coord": {"x": 95,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 103,"y": 1316}},\r
              "h1": {"coord": {"x": 53,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 153,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 103,"y": 174}},\r
              "h1": {"coord": {"x": 53,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 153,"y": 174}, "use": false}\r
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
              "p": {"coord": {"x": 650,"y": -20}},\r
              "h1": {"coord": {"x": 268,"y": -20}},\r
              "h2": {"coord": {"x": 830,"y": -20}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1084,"y": 128}},\r
              "h1": {"coord": {"x": 978,"y": 23}},\r
              "h2": {"coord": {"x": 1134,"y": 128}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1084,"y": 4}},\r
              "h1": {"coord": {"x": 1034,"y": 4}, "use": false},\r
              "h2": {"coord": {"x": 1084,"y": 1}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1089,"y": -1}},\r
              "h1": {"coord": {"x": 1086,"y": -1}},\r
              "h2": {"coord": {"x": 1139,"y": -1}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1254,"y": -1}},\r
              "h1": {"coord": {"x": 1204,"y": -1}, "use": false},\r
              "h2": {"coord": {"x": 1257,"y": -1}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1259,"y": 4}},\r
              "h1": {"coord": {"x": 1259,"y": 1}},\r
              "h2": {"coord": {"x": 1309,"y": 4}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1259,"y": 625}},\r
              "h1": {"coord": {"x": 1209,"y": 625}, "use": false},\r
              "h2": {"coord": {"x": 1259,"y": 628}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1254,"y": 630}},\r
              "h1": {"coord": {"x": 1257,"y": 630}},\r
              "h2": {"coord": {"x": 1304,"y": 630}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 714,"y": 630}},\r
              "h1": {"coord": {"x": 664,"y": 630}, "use": false},\r
              "h2": {"coord": {"x": 711,"y": 630}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 709,"y": 625}},\r
              "h1": {"coord": {"x": 709,"y": 628}},\r
              "h2": {"coord": {"x": 759,"y": 625}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 709,"y": 460}},\r
              "h1": {"coord": {"x": 659,"y": 460}, "use": false},\r
              "h2": {"coord": {"x": 709,"y": 457}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 714,"y": 455}},\r
              "h1": {"coord": {"x": 711,"y": 455}},\r
              "h2": {"coord": {"x": 764,"y": 455}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1058,"y": 455}},\r
              "h1": {"coord": {"x": 1008,"y": 455}, "use": false},\r
              "h2": {"coord": {"x": 1017,"y": 291}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": 158}},\r
              "h1": {"coord": {"x": 911,"y": 158}},\r
              "h2": {"coord": {"x": 304,"y": 158}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 218,"y": 684}},\r
              "h1": {"coord": {"x": 218,"y": 434}},\r
              "h2": {"coord": {"x": 218,"y": 997}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": 1332}},\r
              "h1": {"coord": {"x": 295,"y": 1332}},\r
              "h2": {"coord": {"x": 859,"y": 1332}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1029,"y": 1054}},\r
              "h1": {"coord": {"x": 972,"y": 1215}},\r
              "h2": {"coord": {"x": 1079,"y": 1054}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1202,"y": 1095}},\r
              "h1": {"coord": {"x": 1152,"y": 1095}, "use": false},\r
              "h2": {"coord": {"x": 1130,"y": 1314}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": 1510}},\r
              "h1": {"coord": {"x": 975,"y": 1510}},\r
              "h2": {"coord": {"x": 117,"y": 1510}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 684}},\r
              "h1": {"coord": {"x": 40,"y": 954}},\r
              "h2": {"coord": {"x": 40,"y": 198}}\r
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
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 0}},\r
              "h1": {"coord": {"x": 321,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 374,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 5}},\r
              "h1": {"coord": {"x": 376,"y": 2}},\r
              "h2": {"coord": {"x": 426,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 169}},\r
              "h1": {"coord": {"x": 326,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 376,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 174}},\r
              "h1": {"coord": {"x": 374,"y": 174}},\r
              "h2": {"coord": {"x": 421,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 174}},\r
              "h1": {"coord": {"x": 242,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 665}},\r
              "h1": {"coord": {"x": 242,"y": 665}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 665}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 929,"y": 665}},\r
              "h1": {"coord": {"x": 879,"y": 665}, "use": false},\r
              "h2": {"coord": {"x": 979,"y": 665}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 929,"y": 174}},\r
              "h1": {"coord": {"x": 879,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 979,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 174}},\r
              "h1": {"coord": {"x": 800,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 847,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 845,"y": 169}},\r
              "h1": {"coord": {"x": 845,"y": 172}},\r
              "h2": {"coord": {"x": 895,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 845,"y": 5}},\r
              "h1": {"coord": {"x": 795,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 845,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 0}},\r
              "h1": {"coord": {"x": 847,"y": 0}},\r
              "h2": {"coord": {"x": 900,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1176,"y": 0}},\r
              "h1": {"coord": {"x": 1126,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1179,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1181,"y": 5}},\r
              "h1": {"coord": {"x": 1181,"y": 2}},\r
              "h2": {"coord": {"x": 1231,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1181,"y": 169}},\r
              "h1": {"coord": {"x": 1131,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 1181,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1176,"y": 174}},\r
              "h1": {"coord": {"x": 1179,"y": 174}},\r
              "h2": {"coord": {"x": 1226,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1102,"y": 174}},\r
              "h1": {"coord": {"x": 1052,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 1152,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1102,"y": 1316}},\r
              "h1": {"coord": {"x": 1052,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 1152,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1176,"y": 1316}},\r
              "h1": {"coord": {"x": 1126,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 1179,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1181,"y": 1321}},\r
              "h1": {"coord": {"x": 1181,"y": 1318}},\r
              "h2": {"coord": {"x": 1231,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1181,"y": 1485}},\r
              "h1": {"coord": {"x": 1131,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 1181,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1176,"y": 1490}},\r
              "h1": {"coord": {"x": 1179,"y": 1490}},\r
              "h2": {"coord": {"x": 1226,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 1490}},\r
              "h1": {"coord": {"x": 800,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 847,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 845,"y": 1485}},\r
              "h1": {"coord": {"x": 845,"y": 1488}},\r
              "h2": {"coord": {"x": 895,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 845,"y": 1321}},\r
              "h1": {"coord": {"x": 795,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 845,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 1316}},\r
              "h1": {"coord": {"x": 847,"y": 1316}},\r
              "h2": {"coord": {"x": 900,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 929,"y": 1316}},\r
              "h1": {"coord": {"x": 879,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 979,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 929,"y": 840}},\r
              "h1": {"coord": {"x": 879,"y": 840}, "use": false},\r
              "h2": {"coord": {"x": 979,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 840}},\r
              "h1": {"coord": {"x": 242,"y": 840}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 1316}},\r
              "h1": {"coord": {"x": 242,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 1316}},\r
              "h1": {"coord": {"x": 321,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 374,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 1321}},\r
              "h1": {"coord": {"x": 376,"y": 1318}},\r
              "h2": {"coord": {"x": 426,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 1485}},\r
              "h1": {"coord": {"x": 326,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 376,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 1490}},\r
              "h1": {"coord": {"x": 374,"y": 1490}},\r
              "h2": {"coord": {"x": 421,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1321}},\r
              "h1": {"coord": {"x": -10,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1316}},\r
              "h1": {"coord": {"x": 42,"y": 1316}},\r
              "h2": {"coord": {"x": 95,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 119,"y": 1316}},\r
              "h1": {"coord": {"x": 69,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 169,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 119,"y": 174}},\r
              "h1": {"coord": {"x": 69,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 169,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 174}},\r
              "h1": {"coord": {"x": -5,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 169}},\r
              "h1": {"coord": {"x": 40,"y": 172}},\r
              "h2": {"coord": {"x": 90,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
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
              "p": {"coord": {"x": 1056,"y": 0}},\r
              "h1": {"coord": {"x": 1006,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1106,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1056,"y": 231}},\r
              "h1": {"coord": {"x": 1006,"y": 231}, "use": false},\r
              "h2": {"coord": {"x": 1056,"y": 234}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1051,"y": 236}},\r
              "h1": {"coord": {"x": 1054,"y": 236}},\r
              "h2": {"coord": {"x": 1101,"y": 236}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 887,"y": 236}},\r
              "h1": {"coord": {"x": 837,"y": 236}, "use": false},\r
              "h2": {"coord": {"x": 884,"y": 236}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 882,"y": 231}},\r
              "h1": {"coord": {"x": 882,"y": 234}},\r
              "h2": {"coord": {"x": 932,"y": 231}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 882,"y": 174}},\r
              "h1": {"coord": {"x": 832,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 932,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 629,"y": 174}},\r
              "h1": {"coord": {"x": 579,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 679,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 629,"y": 1316}},\r
              "h1": {"coord": {"x": 579,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 679,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 882,"y": 1316}},\r
              "h1": {"coord": {"x": 832,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 932,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 882,"y": 1256}},\r
              "h1": {"coord": {"x": 832,"y": 1256}, "use": false},\r
              "h2": {"coord": {"x": 882,"y": 1253}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 887,"y": 1251}},\r
              "h1": {"coord": {"x": 884,"y": 1251}},\r
              "h2": {"coord": {"x": 937,"y": 1251}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1051,"y": 1251}},\r
              "h1": {"coord": {"x": 1001,"y": 1251}, "use": false},\r
              "h2": {"coord": {"x": 1054,"y": 1251}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1056,"y": 1256}},\r
              "h1": {"coord": {"x": 1056,"y": 1253}},\r
              "h2": {"coord": {"x": 1106,"y": 1256}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1056,"y": 1490}},\r
              "h1": {"coord": {"x": 1006,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 1106,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1490}},\r
              "h1": {"coord": {"x": -10,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1256}},\r
              "h1": {"coord": {"x": -10,"y": 1256}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1253}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1251}},\r
              "h1": {"coord": {"x": 42,"y": 1251}},\r
              "h2": {"coord": {"x": 95,"y": 1251}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 209,"y": 1251}},\r
              "h1": {"coord": {"x": 159,"y": 1251}, "use": false},\r
              "h2": {"coord": {"x": 212,"y": 1251}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 214,"y": 1256}},\r
              "h1": {"coord": {"x": 214,"y": 1253}},\r
              "h2": {"coord": {"x": 264,"y": 1256}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 214,"y": 1316}},\r
              "h1": {"coord": {"x": 164,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 264,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 455,"y": 1316}},\r
              "h1": {"coord": {"x": 405,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 505,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 455,"y": 174}},\r
              "h1": {"coord": {"x": 405,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 505,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 214,"y": 174}},\r
              "h1": {"coord": {"x": 164,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 264,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 214,"y": 231}},\r
              "h1": {"coord": {"x": 164,"y": 231}, "use": false},\r
              "h2": {"coord": {"x": 214,"y": 234}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 209,"y": 236}},\r
              "h1": {"coord": {"x": 212,"y": 236}},\r
              "h2": {"coord": {"x": 259,"y": 236}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 236}},\r
              "h1": {"coord": {"x": -5,"y": 236}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 236}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 231}},\r
              "h1": {"coord": {"x": 40,"y": 234}},\r
              "h2": {"coord": {"x": 90,"y": 231}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 0}},\r
              "h1": {"coord": {"x": -10,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 0}, "use": false}\r
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
              "p": {"coord": {"x": 964,"y": 1490}},\r
              "h1": {"coord": {"x": 967,"y": 1490}},\r
              "h2": {"coord": {"x": 1014,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 216,"y": 1490}},\r
              "h1": {"coord": {"x": 166,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 213,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 211,"y": 1485}},\r
              "h1": {"coord": {"x": 211,"y": 1488}},\r
              "h2": {"coord": {"x": 261,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 211,"y": 1321}},\r
              "h1": {"coord": {"x": 161,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 211,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 216,"y": 1316}},\r
              "h1": {"coord": {"x": 213,"y": 1316}},\r
              "h2": {"coord": {"x": 266,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 747,"y": 1316}},\r
              "h1": {"coord": {"x": 697,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 797,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 747,"y": 710}},\r
              "h1": {"coord": {"x": 697,"y": 710}, "use": false},\r
              "h2": {"coord": {"x": 797,"y": 710}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 747,"y": 710}},\r
              "h1": {"coord": {"x": 697,"y": 710}, "use": false},\r
              "h2": {"coord": {"x": 747,"y": 701}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 748,"y": 684}},\r
              "h1": {"coord": {"x": 748,"y": 693}},\r
              "h2": {"coord": {"x": 748,"y": 438}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 314,"y": 154}},\r
              "h1": {"coord": {"x": 688,"y": 156}},\r
              "h2": {"coord": {"x": 364,"y": 154}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 314,"y": 154}},\r
              "h1": {"coord": {"x": 264,"y": 154}, "use": false},\r
              "h2": {"coord": {"x": 364,"y": 154}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 214,"y": 154}},\r
              "h1": {"coord": {"x": 164,"y": 154}, "use": false},\r
              "h2": {"coord": {"x": 264,"y": 154}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 214,"y": 233}},\r
              "h1": {"coord": {"x": 164,"y": 233}, "use": false},\r
              "h2": {"coord": {"x": 214,"y": 236}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 209,"y": 238}},\r
              "h1": {"coord": {"x": 212,"y": 238}},\r
              "h2": {"coord": {"x": 259,"y": 238}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 238}},\r
              "h1": {"coord": {"x": -5,"y": 238}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 238}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 233}},\r
              "h1": {"coord": {"x": 40,"y": 236}},\r
              "h2": {"coord": {"x": 90,"y": 233}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 63}},\r
              "h1": {"coord": {"x": -10,"y": 63}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 17}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 123,"y": -20}},\r
              "h1": {"coord": {"x": 77,"y": -20}},\r
              "h2": {"coord": {"x": 173,"y": -20}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 314,"y": -20}},\r
              "h1": {"coord": {"x": 264,"y": -20}, "use": false},\r
              "h2": {"coord": {"x": 364,"y": -20}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 314,"y": -20}},\r
              "h1": {"coord": {"x": 264,"y": -20}, "use": false},\r
              "h2": {"coord": {"x": 681,"y": -19}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 920,"y": 684}},\r
              "h1": {"coord": {"x": 920,"y": 166}},\r
              "h2": {"coord": {"x": 920,"y": 693}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 920,"y": 710}},\r
              "h1": {"coord": {"x": 920,"y": 701}},\r
              "h2": {"coord": {"x": 970,"y": 710}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 920,"y": 710}},\r
              "h1": {"coord": {"x": 870,"y": 710}, "use": false},\r
              "h2": {"coord": {"x": 970,"y": 710}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 920,"y": 1316}},\r
              "h1": {"coord": {"x": 870,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 970,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 964,"y": 1316}},\r
              "h1": {"coord": {"x": 914,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 967,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 969,"y": 1321}},\r
              "h1": {"coord": {"x": 969,"y": 1318}},\r
              "h2": {"coord": {"x": 1019,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 969,"y": 1485}},\r
              "h1": {"coord": {"x": 919,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 969,"y": 1488}}\r
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
              "p": {"coord": {"x": 376,"y": 5}},\r
              "h1": {"coord": {"x": 376,"y": 2}},\r
              "h2": {"coord": {"x": 426,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 169}},\r
              "h1": {"coord": {"x": 326,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 376,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 174}},\r
              "h1": {"coord": {"x": 374,"y": 174}},\r
              "h2": {"coord": {"x": 421,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 174}},\r
              "h1": {"coord": {"x": 242,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 665}},\r
              "h1": {"coord": {"x": 242,"y": 665}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 665}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 361,"y": 665}},\r
              "h1": {"coord": {"x": 311,"y": 665}, "use": false},\r
              "h2": {"coord": {"x": 411,"y": 665}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 778,"y": 174}},\r
              "h1": {"coord": {"x": 728,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 828,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 729,"y": 174}},\r
              "h1": {"coord": {"x": 679,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 726,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 724,"y": 169}},\r
              "h1": {"coord": {"x": 724,"y": 172}},\r
              "h2": {"coord": {"x": 774,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 724,"y": 5}},\r
              "h1": {"coord": {"x": 674,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 724,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 729,"y": 0}},\r
              "h1": {"coord": {"x": 726,"y": 0}},\r
              "h2": {"coord": {"x": 779,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1055,"y": 0}},\r
              "h1": {"coord": {"x": 1005,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1058,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1060,"y": 5}},\r
              "h1": {"coord": {"x": 1060,"y": 2}},\r
              "h2": {"coord": {"x": 1110,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1060,"y": 169}},\r
              "h1": {"coord": {"x": 1010,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 1060,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1055,"y": 174}},\r
              "h1": {"coord": {"x": 1058,"y": 174}},\r
              "h2": {"coord": {"x": 1105,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1004,"y": 174}},\r
              "h1": {"coord": {"x": 954,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 1054,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 475,"y": 796}},\r
              "h1": {"coord": {"x": 425,"y": 796}, "use": false},\r
              "h2": {"coord": {"x": 525,"y": 796}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 891,"y": 1316}},\r
              "h1": {"coord": {"x": 841,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 941,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 985,"y": 1316}},\r
              "h1": {"coord": {"x": 935,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 988,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 990,"y": 1321}},\r
              "h1": {"coord": {"x": 990,"y": 1318}},\r
              "h2": {"coord": {"x": 1040,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 990,"y": 1485}},\r
              "h1": {"coord": {"x": 940,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 990,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 985,"y": 1490}},\r
              "h1": {"coord": {"x": 988,"y": 1490}},\r
              "h2": {"coord": {"x": 1035,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 659,"y": 1490}},\r
              "h1": {"coord": {"x": 609,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 656,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 654,"y": 1485}},\r
              "h1": {"coord": {"x": 654,"y": 1488}},\r
              "h2": {"coord": {"x": 704,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 654,"y": 1321}},\r
              "h1": {"coord": {"x": 604,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 654,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 659,"y": 1316}},\r
              "h1": {"coord": {"x": 656,"y": 1316}},\r
              "h2": {"coord": {"x": 709,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 714,"y": 1316}},\r
              "h1": {"coord": {"x": 664,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 764,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 320,"y": 840}},\r
              "h1": {"coord": {"x": 270,"y": 840}, "use": false},\r
              "h2": {"coord": {"x": 370,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 840}},\r
              "h1": {"coord": {"x": 242,"y": 840}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 1316}},\r
              "h1": {"coord": {"x": 242,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 1316}},\r
              "h1": {"coord": {"x": 321,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 374,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 1321}},\r
              "h1": {"coord": {"x": 376,"y": 1318}},\r
              "h2": {"coord": {"x": 426,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 1485}},\r
              "h1": {"coord": {"x": 326,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 376,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 1490}},\r
              "h1": {"coord": {"x": 374,"y": 1490}},\r
              "h2": {"coord": {"x": 421,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1321}},\r
              "h1": {"coord": {"x": -10,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1316}},\r
              "h1": {"coord": {"x": 42,"y": 1316}},\r
              "h2": {"coord": {"x": 95,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 119,"y": 1316}},\r
              "h1": {"coord": {"x": 69,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 169,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 119,"y": 174}},\r
              "h1": {"coord": {"x": 69,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 169,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 174}},\r
              "h1": {"coord": {"x": -5,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 169}},\r
              "h1": {"coord": {"x": 40,"y": 172}},\r
              "h2": {"coord": {"x": 90,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 0}},\r
              "h1": {"coord": {"x": 321,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 374,"y": 0}}\r
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
              "p": {"coord": {"x": 963,"y": 256}},\r
              "h1": {"coord": {"x": 913,"y": 256}, "use": false},\r
              "h2": {"coord": {"x": 963,"y": 259}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 958,"y": 261}},\r
              "h1": {"coord": {"x": 961,"y": 261}},\r
              "h2": {"coord": {"x": 1008,"y": 261}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 794,"y": 261}},\r
              "h1": {"coord": {"x": 744,"y": 261}, "use": false},\r
              "h2": {"coord": {"x": 791,"y": 261}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 789,"y": 256}},\r
              "h1": {"coord": {"x": 789,"y": 259}},\r
              "h2": {"coord": {"x": 839,"y": 256}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 789,"y": 174}},\r
              "h1": {"coord": {"x": 739,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 839,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 276,"y": 174}},\r
              "h1": {"coord": {"x": 226,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 326,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 276,"y": 1316}},\r
              "h1": {"coord": {"x": 226,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 326,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 1316}},\r
              "h1": {"coord": {"x": 321,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 374,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 1321}},\r
              "h1": {"coord": {"x": 376,"y": 1318}},\r
              "h2": {"coord": {"x": 426,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 1485}},\r
              "h1": {"coord": {"x": 326,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 376,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 1490}},\r
              "h1": {"coord": {"x": 374,"y": 1490}},\r
              "h2": {"coord": {"x": 421,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1321}},\r
              "h1": {"coord": {"x": -10,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1316}},\r
              "h1": {"coord": {"x": 42,"y": 1316}},\r
              "h2": {"coord": {"x": 95,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 103,"y": 1316}},\r
              "h1": {"coord": {"x": 53,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 153,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 103,"y": 174}},\r
              "h1": {"coord": {"x": 53,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 153,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 174}},\r
              "h1": {"coord": {"x": -5,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 169}},\r
              "h1": {"coord": {"x": 40,"y": 172}},\r
              "h2": {"coord": {"x": 90,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 963,"y": 0}},\r
              "h1": {"coord": {"x": 913,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1013,"y": 0}, "use": false}\r
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
              "p": {"coord": {"x": 650,"y": 1510}},\r
              "h1": {"coord": {"x": 1187,"y": 1510}},\r
              "h2": {"coord": {"x": 117,"y": 1510}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 684}},\r
              "h1": {"coord": {"x": 40,"y": 954}},\r
              "h2": {"coord": {"x": 40,"y": 198}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": -20}},\r
              "h1": {"coord": {"x": 268,"y": -20}},\r
              "h2": {"coord": {"x": 1019,"y": -20}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1260,"y": 684}},\r
              "h1": {"coord": {"x": 1260,"y": 164}},\r
              "h2": {"coord": {"x": 1260,"y": 979}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "flat",\r
              "p": {"coord": {"x": 650,"y": 158}},\r
              "h1": {"coord": {"x": 1028,"y": 158}},\r
              "h2": {"coord": {"x": 304,"y": 158}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 218,"y": 684}},\r
              "h1": {"coord": {"x": 218,"y": 434}},\r
              "h2": {"coord": {"x": 218,"y": 997}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": 1332}},\r
              "h1": {"coord": {"x": 295,"y": 1332}},\r
              "h2": {"coord": {"x": 1003,"y": 1332}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1081,"y": 684}},\r
              "h1": {"coord": {"x": 1081,"y": 997}},\r
              "h2": {"coord": {"x": 1081,"y": 437}}\r
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
              "p": {"coord": {"x": 929,"y": 0}},\r
              "h1": {"coord": {"x": 879,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 979,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1102,"y": 0}},\r
              "h1": {"coord": {"x": 1052,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1152,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1102,"y": 1315}},\r
              "h1": {"coord": {"x": 1052,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 1152,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1176,"y": 1315}},\r
              "h1": {"coord": {"x": 1126,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 1179,"y": 1315}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1181,"y": 1320}},\r
              "h1": {"coord": {"x": 1181,"y": 1317}},\r
              "h2": {"coord": {"x": 1231,"y": 1320}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1181,"y": 1484}},\r
              "h1": {"coord": {"x": 1131,"y": 1484}, "use": false},\r
              "h2": {"coord": {"x": 1181,"y": 1487}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1176,"y": 1489}},\r
              "h1": {"coord": {"x": 1179,"y": 1489}},\r
              "h2": {"coord": {"x": 1226,"y": 1489}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 1489}},\r
              "h1": {"coord": {"x": 800,"y": 1489}, "use": false},\r
              "h2": {"coord": {"x": 847,"y": 1489}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 845,"y": 1484}},\r
              "h1": {"coord": {"x": 845,"y": 1487}},\r
              "h2": {"coord": {"x": 895,"y": 1484}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 845,"y": 1320}},\r
              "h1": {"coord": {"x": 795,"y": 1320}, "use": false},\r
              "h2": {"coord": {"x": 845,"y": 1317}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 850,"y": 1315}},\r
              "h1": {"coord": {"x": 847,"y": 1315}},\r
              "h2": {"coord": {"x": 900,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 929,"y": 1315}},\r
              "h1": {"coord": {"x": 879,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 979,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 929,"y": 366}},\r
              "h1": {"coord": {"x": 879,"y": 366}, "use": false},\r
              "h2": {"coord": {"x": 979,"y": 366}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 297,"y": 1481}},\r
              "h1": {"coord": {"x": 247,"y": 1481}, "use": false},\r
              "h2": {"coord": {"x": 347,"y": 1481}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 297,"y": 1484}},\r
              "h1": {"coord": {"x": 247,"y": 1484}, "use": false},\r
              "h2": {"coord": {"x": 297,"y": 1487}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 1489}},\r
              "h1": {"coord": {"x": 295,"y": 1489}},\r
              "h2": {"coord": {"x": 343,"y": 1489}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 1490}},\r
              "h1": {"coord": {"x": 242,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 291,"y": 1489}},\r
              "h1": {"coord": {"x": 241,"y": 1489}, "use": false},\r
              "h2": {"coord": {"x": 341,"y": 1489}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1489}},\r
              "h1": {"coord": {"x": -5,"y": 1489}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1489}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1484}},\r
              "h1": {"coord": {"x": 40,"y": 1487}},\r
              "h2": {"coord": {"x": 90,"y": 1484}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1320}},\r
              "h1": {"coord": {"x": -10,"y": 1320}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1317}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1315}},\r
              "h1": {"coord": {"x": 42,"y": 1315}},\r
              "h2": {"coord": {"x": 95,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 119,"y": 1315}},\r
              "h1": {"coord": {"x": 69,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 169,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 119,"y": 174}},\r
              "h1": {"coord": {"x": 69,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 169,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 174}},\r
              "h1": {"coord": {"x": -5,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 169}},\r
              "h1": {"coord": {"x": 40,"y": 172}},\r
              "h2": {"coord": {"x": 90,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 0}},\r
              "h1": {"coord": {"x": 321,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 374,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 5}},\r
              "h1": {"coord": {"x": 376,"y": 2}},\r
              "h2": {"coord": {"x": 426,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 376,"y": 169}},\r
              "h1": {"coord": {"x": 326,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 376,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 371,"y": 174}},\r
              "h1": {"coord": {"x": 374,"y": 174}},\r
              "h2": {"coord": {"x": 421,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 174}},\r
              "h1": {"coord": {"x": 242,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 292,"y": 1114}},\r
              "h1": {"coord": {"x": 242,"y": 1114}, "use": false},\r
              "h2": {"coord": {"x": 342,"y": 1114}, "use": false}\r
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
              "p": {"coord": {"x": 1291,"y": 1489}},\r
              "h1": {"coord": {"x": 1294,"y": 1489}},\r
              "h2": {"coord": {"x": 1341,"y": 1489}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1048,"y": 1489}},\r
              "h1": {"coord": {"x": 998,"y": 1489}, "use": false},\r
              "h2": {"coord": {"x": 1098,"y": 1489}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1048,"y": 1489}},\r
              "h1": {"coord": {"x": 998,"y": 1489}, "use": false},\r
              "h2": {"coord": {"x": 1098,"y": 1489}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1047,"y": 1490}},\r
              "h1": {"coord": {"x": 997,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 1097,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1046,"y": 1489}},\r
              "h1": {"coord": {"x": 996,"y": 1489}, "use": false},\r
              "h2": {"coord": {"x": 1044,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1043,"y": 1484}},\r
              "h1": {"coord": {"x": 1043,"y": 1486}},\r
              "h2": {"coord": {"x": 1093,"y": 1484}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1043,"y": 1483}},\r
              "h1": {"coord": {"x": 993,"y": 1483}, "use": false},\r
              "h2": {"coord": {"x": 1093,"y": 1483}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 682,"y": 811}},\r
              "h1": {"coord": {"x": 632,"y": 811}, "use": false},\r
              "h2": {"coord": {"x": 732,"y": 811}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 1483}},\r
              "h1": {"coord": {"x": 243,"y": 1483}, "use": false},\r
              "h2": {"coord": {"x": 343,"y": 1483}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 1484}},\r
              "h1": {"coord": {"x": 243,"y": 1484}, "use": false},\r
              "h2": {"coord": {"x": 293,"y": 1486}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 290,"y": 1489}},\r
              "h1": {"coord": {"x": 292,"y": 1488}},\r
              "h2": {"coord": {"x": 340,"y": 1489}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 289,"y": 1490}},\r
              "h1": {"coord": {"x": 239,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 339,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 288,"y": 1489}},\r
              "h1": {"coord": {"x": 238,"y": 1489}, "use": false},\r
              "h2": {"coord": {"x": 338,"y": 1489}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 288,"y": 1489}},\r
              "h1": {"coord": {"x": 238,"y": 1489}, "use": false},\r
              "h2": {"coord": {"x": 338,"y": 1489}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1489}},\r
              "h1": {"coord": {"x": -5,"y": 1489}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1489}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1484}},\r
              "h1": {"coord": {"x": 40,"y": 1487}},\r
              "h2": {"coord": {"x": 90,"y": 1484}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1320}},\r
              "h1": {"coord": {"x": -10,"y": 1320}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1317}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1315}},\r
              "h1": {"coord": {"x": 42,"y": 1315}},\r
              "h2": {"coord": {"x": 95,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 120,"y": 1315}},\r
              "h1": {"coord": {"x": 70,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 170,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 120,"y": 174}},\r
              "h1": {"coord": {"x": 70,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 170,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 46,"y": 174}},\r
              "h1": {"coord": {"x": -4,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 43,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 41,"y": 169}},\r
              "h1": {"coord": {"x": 41,"y": 172}},\r
              "h2": {"coord": {"x": 91,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 41,"y": 5}},\r
              "h1": {"coord": {"x": -9,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 41,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 46,"y": 0}},\r
              "h1": {"coord": {"x": 43,"y": 0}},\r
              "h2": {"coord": {"x": 96,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 372,"y": 0}},\r
              "h1": {"coord": {"x": 322,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 375,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 377,"y": 5}},\r
              "h1": {"coord": {"x": 377,"y": 2}},\r
              "h2": {"coord": {"x": 427,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 377,"y": 169}},\r
              "h1": {"coord": {"x": 327,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 377,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 372,"y": 174}},\r
              "h1": {"coord": {"x": 375,"y": 174}},\r
              "h2": {"coord": {"x": 422,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 174}},\r
              "h1": {"coord": {"x": 243,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 343,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 1110}},\r
              "h1": {"coord": {"x": 243,"y": 1110}, "use": false},\r
              "h2": {"coord": {"x": 343,"y": 1110}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 678,"y": 451}},\r
              "h1": {"coord": {"x": 628,"y": 451}, "use": false},\r
              "h2": {"coord": {"x": 728,"y": 451}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1043,"y": 1103}},\r
              "h1": {"coord": {"x": 993,"y": 1103}, "use": false},\r
              "h2": {"coord": {"x": 1093,"y": 1103}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1043,"y": 174}},\r
              "h1": {"coord": {"x": 993,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 1093,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 964,"y": 174}},\r
              "h1": {"coord": {"x": 914,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 961,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 959,"y": 169}},\r
              "h1": {"coord": {"x": 959,"y": 172}},\r
              "h2": {"coord": {"x": 1009,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 959,"y": 5}},\r
              "h1": {"coord": {"x": 909,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 959,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 964,"y": 0}},\r
              "h1": {"coord": {"x": 961,"y": 0}},\r
              "h2": {"coord": {"x": 1014,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1290,"y": 0}},\r
              "h1": {"coord": {"x": 1240,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1293,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1295,"y": 5}},\r
              "h1": {"coord": {"x": 1295,"y": 2}},\r
              "h2": {"coord": {"x": 1345,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1295,"y": 169}},\r
              "h1": {"coord": {"x": 1245,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 1295,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1290,"y": 174}},\r
              "h1": {"coord": {"x": 1293,"y": 174}},\r
              "h2": {"coord": {"x": 1340,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1216,"y": 174}},\r
              "h1": {"coord": {"x": 1166,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 1266,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1216,"y": 1315}},\r
              "h1": {"coord": {"x": 1166,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 1266,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1291,"y": 1315}},\r
              "h1": {"coord": {"x": 1241,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 1294,"y": 1315}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1296,"y": 1320}},\r
              "h1": {"coord": {"x": 1296,"y": 1317}},\r
              "h2": {"coord": {"x": 1346,"y": 1320}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1296,"y": 1484}},\r
              "h1": {"coord": {"x": 1246,"y": 1484}, "use": false},\r
              "h2": {"coord": {"x": 1296,"y": 1487}}\r
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
              "p": {"coord": {"x": 573,"y": 666}},\r
              "h1": {"coord": {"x": 523,"y": 666}, "use": false},\r
              "h2": {"coord": {"x": 834,"y": 666}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 954,"y": 1059}},\r
              "h1": {"coord": {"x": 954,"y": 897}},\r
              "h2": {"coord": {"x": 954,"y": 1181}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 585,"y": 1490}},\r
              "h1": {"coord": {"x": 914,"y": 1483}},\r
              "h2": {"coord": {"x": 635,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 585,"y": 1490}},\r
              "h1": {"coord": {"x": 535,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 635,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1321}},\r
              "h1": {"coord": {"x": -10,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1316}},\r
              "h1": {"coord": {"x": 42,"y": 1316}},\r
              "h2": {"coord": {"x": 95,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 157,"y": 1316}},\r
              "h1": {"coord": {"x": 107,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 207,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 157,"y": 174}},\r
              "h1": {"coord": {"x": 107,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 207,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 174}},\r
              "h1": {"coord": {"x": -5,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 169}},\r
              "h1": {"coord": {"x": 40,"y": 172}},\r
              "h2": {"coord": {"x": 90,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 422,"y": 0}},\r
              "h1": {"coord": {"x": 372,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 472,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 425,"y": 1}},\r
              "h1": {"coord": {"x": 375,"y": 1}, "use": false},\r
              "h2": {"coord": {"x": 475,"y": 1}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 426,"y": 1}},\r
              "h1": {"coord": {"x": 376,"y": 1}, "use": false},\r
              "h2": {"coord": {"x": 476,"y": 1}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 426,"y": 2}},\r
              "h1": {"coord": {"x": 376,"y": 2}, "use": false},\r
              "h2": {"coord": {"x": 476,"y": 2}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 427,"y": 5}},\r
              "h1": {"coord": {"x": 377,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 477,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 427,"y": 169}},\r
              "h1": {"coord": {"x": 377,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 477,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 426,"y": 172}},\r
              "h1": {"coord": {"x": 376,"y": 172}, "use": false},\r
              "h2": {"coord": {"x": 476,"y": 172}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 426,"y": 173}},\r
              "h1": {"coord": {"x": 376,"y": 173}, "use": false},\r
              "h2": {"coord": {"x": 476,"y": 173}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 425,"y": 173}},\r
              "h1": {"coord": {"x": 375,"y": 173}, "use": false},\r
              "h2": {"coord": {"x": 475,"y": 173}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 422,"y": 174}},\r
              "h1": {"coord": {"x": 372,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 472,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 329,"y": 174}},\r
              "h1": {"coord": {"x": 279,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 379,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 329,"y": 666}},\r
              "h1": {"coord": {"x": 279,"y": 666}, "use": false},\r
              "h2": {"coord": {"x": 379,"y": 666}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 572,"y": 1318}},\r
              "h1": {"coord": {"x": 522,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 739,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 803,"y": 1059}},\r
              "h1": {"coord": {"x": 803,"y": 1226}},\r
              "h2": {"coord": {"x": 803,"y": 939}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 573,"y": 841}},\r
              "h1": {"coord": {"x": 715,"y": 841}},\r
              "h2": {"coord": {"x": 623,"y": 841}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 329,"y": 840}},\r
              "h1": {"coord": {"x": 279,"y": 840}, "use": false},\r
              "h2": {"coord": {"x": 379,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 329,"y": 1318}},\r
              "h1": {"coord": {"x": 279,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 379,"y": 1318}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 572,"y": 1318}},\r
              "h1": {"coord": {"x": 522,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 622,"y": 1318}, "use": false}\r
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
              "p": {"coord": {"x": 1119,"y": 167}},\r
              "h1": {"coord": {"x": 1069,"y": 167}, "use": false},\r
              "h2": {"coord": {"x": 1209,"y": 279}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1260,"y": 684}},\r
              "h1": {"coord": {"x": 1260,"y": 446}},\r
              "h2": {"coord": {"x": 1260,"y": 979}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": 1510}},\r
              "h1": {"coord": {"x": 1187,"y": 1510}},\r
              "h2": {"coord": {"x": 117,"y": 1510}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 684}},\r
              "h1": {"coord": {"x": 40,"y": 954}},\r
              "h2": {"coord": {"x": 40,"y": 198}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": -20}},\r
              "h1": {"coord": {"x": 268,"y": -20}},\r
              "h2": {"coord": {"x": 779,"y": -20}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 985,"y": 54}},\r
              "h1": {"coord": {"x": 892,"y": 2}},\r
              "h2": {"coord": {"x": 1035,"y": 54}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1155,"y": -116}},\r
              "h1": {"coord": {"x": 1105,"y": -116}, "use": false},\r
              "h2": {"coord": {"x": 1157,"y": -118}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1162,"y": -116}},\r
              "h1": {"coord": {"x": 1160,"y": -118}},\r
              "h2": {"coord": {"x": 1212,"y": -116}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1278,"y": 0}},\r
              "h1": {"coord": {"x": 1228,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1280,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1278,"y": 7}},\r
              "h1": {"coord": {"x": 1280,"y": 5}},\r
              "h2": {"coord": {"x": 1328,"y": 7}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -3,\r
          "pathPoints": [\r
            {\r
              "type": "flat",\r
              "p": {"coord": {"x": 650,"y": 158}},\r
              "h1": {"coord": {"x": 729,"y": 158}},\r
              "h2": {"coord": {"x": 304,"y": 158}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 218,"y": 684}},\r
              "h1": {"coord": {"x": 218,"y": 434}},\r
              "h2": {"coord": {"x": 218,"y": 997}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": 1332}},\r
              "h1": {"coord": {"x": 295,"y": 1332}},\r
              "h2": {"coord": {"x": 1003,"y": 1332}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1081,"y": 684}},\r
              "h1": {"coord": {"x": 1081,"y": 997}},\r
              "h2": {"coord": {"x": 1081,"y": 548}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 987,"y": 299}},\r
              "h1": {"coord": {"x": 1065,"y": 402}},\r
              "h2": {"coord": {"x": 1037,"y": 299}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 848,"y": 437}},\r
              "h1": {"coord": {"x": 798,"y": 437}, "use": false},\r
              "h2": {"coord": {"x": 846,"y": 439}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 841,"y": 437}},\r
              "h1": {"coord": {"x": 843,"y": 439}},\r
              "h2": {"coord": {"x": 891,"y": 437}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 725,"y": 322}},\r
              "h1": {"coord": {"x": 675,"y": 322}, "use": false},\r
              "h2": {"coord": {"x": 723,"y": 320}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 725,"y": 314}},\r
              "h1": {"coord": {"x": 723,"y": 316}},\r
              "h2": {"coord": {"x": 775,"y": 314}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 847,"y": 192}},\r
              "h1": {"coord": {"x": 797,"y": 192}, "use": false},\r
              "h2": {"coord": {"x": 794,"y": 170}}\r
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
              "p": {"coord": {"x": 1058,"y": 175}},\r
              "h1": {"coord": {"x": 1061,"y": 175}},\r
              "h2": {"coord": {"x": 1108,"y": 175}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 930,"y": 175}},\r
              "h1": {"coord": {"x": 880,"y": 175}, "use": false},\r
              "h2": {"coord": {"x": 980,"y": 175}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 642,"y": 674}},\r
              "h1": {"coord": {"x": 592,"y": 674}, "use": false},\r
              "h2": {"coord": {"x": 847,"y": 716}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 942,"y": 1059}},\r
              "h1": {"coord": {"x": 942,"y": 915}},\r
              "h2": {"coord": {"x": 942,"y": 1181}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 573,"y": 1490}},\r
              "h1": {"coord": {"x": 902,"y": 1483}},\r
              "h2": {"coord": {"x": 623,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 573,"y": 1490}},\r
              "h1": {"coord": {"x": 523,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 623,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 44,"y": 1490}},\r
              "h1": {"coord": {"x": -6,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 94,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 44,"y": 1490}},\r
              "h1": {"coord": {"x": -6,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1487}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1321}},\r
              "h1": {"coord": {"x": -10,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1316}},\r
              "h1": {"coord": {"x": 42,"y": 1316}},\r
              "h2": {"coord": {"x": 95,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 145,"y": 1316}},\r
              "h1": {"coord": {"x": 95,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 195,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 145,"y": 174}},\r
              "h1": {"coord": {"x": 95,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 195,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 174}},\r
              "h1": {"coord": {"x": -5,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 169}},\r
              "h1": {"coord": {"x": 40,"y": 172}},\r
              "h2": {"coord": {"x": 90,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 422,"y": 0}},\r
              "h1": {"coord": {"x": 372,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 425,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 427,"y": 5}},\r
              "h1": {"coord": {"x": 427,"y": 2}},\r
              "h2": {"coord": {"x": 477,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 427,"y": 169}},\r
              "h1": {"coord": {"x": 377,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 427,"y": 172}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 422,"y": 174}},\r
              "h1": {"coord": {"x": 425,"y": 174}},\r
              "h2": {"coord": {"x": 472,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 317,"y": 174}},\r
              "h1": {"coord": {"x": 267,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 367,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 317,"y": 666}},\r
              "h1": {"coord": {"x": 267,"y": 666}, "use": false},\r
              "h2": {"coord": {"x": 367,"y": 666}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 445,"y": 666}},\r
              "h1": {"coord": {"x": 395,"y": 666}, "use": false},\r
              "h2": {"coord": {"x": 495,"y": 666}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 806,"y": 1}},\r
              "h1": {"coord": {"x": 756,"y": 1}, "use": false},\r
              "h2": {"coord": {"x": 856,"y": 1}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 809,"y": 1}},\r
              "h1": {"coord": {"x": 759,"y": 1}, "use": false},\r
              "h2": {"coord": {"x": 859,"y": 1}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 809,"y": 1}},\r
              "h1": {"coord": {"x": 759,"y": 1}, "use": false},\r
              "h2": {"coord": {"x": 859,"y": 1}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1058,"y": 1}},\r
              "h1": {"coord": {"x": 1008,"y": 1}, "use": false},\r
              "h2": {"coord": {"x": 1061,"y": 1}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1063,"y": 6}},\r
              "h1": {"coord": {"x": 1063,"y": 3}},\r
              "h2": {"coord": {"x": 1113,"y": 6}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1063,"y": 170}},\r
              "h1": {"coord": {"x": 1013,"y": 170}, "use": false},\r
              "h2": {"coord": {"x": 1063,"y": 173}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -3,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 317,"y": 1318}},\r
              "h1": {"coord": {"x": 267,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 367,"y": 1318}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 560,"y": 1318}},\r
              "h1": {"coord": {"x": 510,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 727,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 791,"y": 1059}},\r
              "h1": {"coord": {"x": 791,"y": 1226}},\r
              "h2": {"coord": {"x": 791,"y": 939}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 561,"y": 841}},\r
              "h1": {"coord": {"x": 703,"y": 841}},\r
              "h2": {"coord": {"x": 611,"y": 841}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 503,"y": 841}},\r
              "h1": {"coord": {"x": 453,"y": 841}, "use": false},\r
              "h2": {"coord": {"x": 553,"y": 841}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 503,"y": 840}},\r
              "h1": {"coord": {"x": 453,"y": 840}, "use": false},\r
              "h2": {"coord": {"x": 553,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 317,"y": 840}},\r
              "h1": {"coord": {"x": 267,"y": 840}, "use": false},\r
              "h2": {"coord": {"x": 367,"y": 840}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 317,"y": 1318}},\r
              "h1": {"coord": {"x": 267,"y": 1318}, "use": false},\r
              "h2": {"coord": {"x": 367,"y": 1318}, "use": false}\r
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
              "p": {"coord": {"x": 490,"y": 849}},\r
              "h1": {"coord": {"x": 910,"y": 849}},\r
              "h2": {"coord": {"x": 540,"y": 849}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 490,"y": 850}},\r
              "h1": {"coord": {"x": 440,"y": 850}, "use": false},\r
              "h2": {"coord": {"x": 257,"y": 850}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 228,"y": 1054}},\r
              "h1": {"coord": {"x": 228,"y": 988}},\r
              "h2": {"coord": {"x": 228,"y": 1201}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 490,"y": 1316}},\r
              "h1": {"coord": {"x": 296,"y": 1316}},\r
              "h2": {"coord": {"x": 553,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 684,"y": 1316}},\r
              "h1": {"coord": {"x": 624,"y": 1316}},\r
              "h2": {"coord": {"x": 734,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 684,"y": 1234}},\r
              "h1": {"coord": {"x": 634,"y": 1234}, "use": false},\r
              "h2": {"coord": {"x": 684,"y": 1231}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 689,"y": 1229}},\r
              "h1": {"coord": {"x": 686,"y": 1229}},\r
              "h2": {"coord": {"x": 739,"y": 1229}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 853,"y": 1229}},\r
              "h1": {"coord": {"x": 803,"y": 1229}, "use": false},\r
              "h2": {"coord": {"x": 856,"y": 1229}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 858,"y": 1234}},\r
              "h1": {"coord": {"x": 858,"y": 1231}},\r
              "h2": {"coord": {"x": 908,"y": 1234}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 858,"y": 1407}},\r
              "h1": {"coord": {"x": 808,"y": 1407}, "use": false},\r
              "h2": {"coord": {"x": 858,"y": 1453}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 775,"y": 1490}},\r
              "h1": {"coord": {"x": 821,"y": 1490}},\r
              "h2": {"coord": {"x": 825,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 490,"y": 1490}},\r
              "h1": {"coord": {"x": 440,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 310,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 54,"y": 1054}},\r
              "h1": {"coord": {"x": 54,"y": 1395}},\r
              "h2": {"coord": {"x": 54,"y": 880}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 486,"y": 676}},\r
              "h1": {"coord": {"x": 207,"y": 676}},\r
              "h2": {"coord": {"x": 741,"y": 676}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 767,"y": 394}},\r
              "h1": {"coord": {"x": 767,"y": 552}},\r
              "h2": {"coord": {"x": 767,"y": 324}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 486,"y": 174}},\r
              "h1": {"coord": {"x": 762,"y": 174}},\r
              "h2": {"coord": {"x": 536,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 214,"y": 174}},\r
              "h1": {"coord": {"x": 164,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 264,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 214,"y": 254}},\r
              "h1": {"coord": {"x": 164,"y": 254}, "use": false},\r
              "h2": {"coord": {"x": 214,"y": 257}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 209,"y": 259}},\r
              "h1": {"coord": {"x": 212,"y": 259}},\r
              "h2": {"coord": {"x": 259,"y": 259}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 259}},\r
              "h1": {"coord": {"x": -5,"y": 259}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 259}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 254}},\r
              "h1": {"coord": {"x": 40,"y": 257}},\r
              "h2": {"coord": {"x": 90,"y": 254}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 83}},\r
              "h1": {"coord": {"x": -10,"y": 83}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 38}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 121,"y": 0}},\r
              "h1": {"coord": {"x": 76,"y": 1}},\r
              "h2": {"coord": {"x": 171,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 121,"y": 0}},\r
              "h1": {"coord": {"x": 71,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 171,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 486,"y": 0}},\r
              "h1": {"coord": {"x": 436,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 956,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 941,"y": 394}},\r
              "h1": {"coord": {"x": 941,"y": 331}},\r
              "h2": {"coord": {"x": 941,"y": 517}}\r
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
              "p": {"coord": {"x": 1064,"y": 1490}},\r
              "h1": {"coord": {"x": 1014,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 1114,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1490}},\r
              "h1": {"coord": {"x": -10,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1215}},\r
              "h1": {"coord": {"x": -10,"y": 1215}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1212}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1210}},\r
              "h1": {"coord": {"x": 42,"y": 1210}},\r
              "h2": {"coord": {"x": 95,"y": 1210}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 210,"y": 1210}},\r
              "h1": {"coord": {"x": 160,"y": 1210}, "use": false},\r
              "h2": {"coord": {"x": 213,"y": 1210}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 215,"y": 1215}},\r
              "h1": {"coord": {"x": 215,"y": 1212}},\r
              "h2": {"coord": {"x": 265,"y": 1215}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 215,"y": 1315}},\r
              "h1": {"coord": {"x": 165,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 265,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 458,"y": 1315}},\r
              "h1": {"coord": {"x": 408,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 508,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 458,"y": 176}},\r
              "h1": {"coord": {"x": 408,"y": 176}, "use": false},\r
              "h2": {"coord": {"x": 508,"y": 176}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 359,"y": 176}},\r
              "h1": {"coord": {"x": 309,"y": 176}, "use": false},\r
              "h2": {"coord": {"x": 356,"y": 176}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 354,"y": 171}},\r
              "h1": {"coord": {"x": 354,"y": 174}},\r
              "h2": {"coord": {"x": 404,"y": 171}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 354,"y": 5}},\r
              "h1": {"coord": {"x": 304,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 354,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 359,"y": 0}},\r
              "h1": {"coord": {"x": 356,"y": 0}},\r
              "h2": {"coord": {"x": 409,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 723,"y": 0}},\r
              "h1": {"coord": {"x": 673,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 726,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 728,"y": 5}},\r
              "h1": {"coord": {"x": 728,"y": 2}},\r
              "h2": {"coord": {"x": 778,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 728,"y": 171}},\r
              "h1": {"coord": {"x": 678,"y": 171}, "use": false},\r
              "h2": {"coord": {"x": 728,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 723,"y": 176}},\r
              "h1": {"coord": {"x": 726,"y": 176}},\r
              "h2": {"coord": {"x": 773,"y": 176}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 634,"y": 176}},\r
              "h1": {"coord": {"x": 584,"y": 176}, "use": false},\r
              "h2": {"coord": {"x": 684,"y": 176}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 634,"y": 1315}},\r
              "h1": {"coord": {"x": 584,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 684,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 888,"y": 1315}},\r
              "h1": {"coord": {"x": 838,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 938,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 888,"y": 1215}},\r
              "h1": {"coord": {"x": 838,"y": 1215}, "use": false},\r
              "h2": {"coord": {"x": 888,"y": 1212}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 893,"y": 1210}},\r
              "h1": {"coord": {"x": 890,"y": 1210}},\r
              "h2": {"coord": {"x": 943,"y": 1210}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1058,"y": 1210}},\r
              "h1": {"coord": {"x": 1008,"y": 1210}, "use": false},\r
              "h2": {"coord": {"x": 1061,"y": 1210}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1063,"y": 1215}},\r
              "h1": {"coord": {"x": 1063,"y": 1212}},\r
              "h2": {"coord": {"x": 1113,"y": 1215}, "use": false}\r
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
              "p": {"coord": {"x": 1256,"y": 1490}},\r
              "h1": {"coord": {"x": 1259,"y": 1490}},\r
              "h2": {"coord": {"x": 1306,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 892,"y": 1490}},\r
              "h1": {"coord": {"x": 842,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 889,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 887,"y": 1485}},\r
              "h1": {"coord": {"x": 887,"y": 1488}},\r
              "h2": {"coord": {"x": 937,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 887,"y": 1319}},\r
              "h1": {"coord": {"x": 837,"y": 1319}, "use": false},\r
              "h2": {"coord": {"x": 887,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 892,"y": 1314}},\r
              "h1": {"coord": {"x": 889,"y": 1314}},\r
              "h2": {"coord": {"x": 942,"y": 1314}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 984,"y": 1314}},\r
              "h1": {"coord": {"x": 934,"y": 1314}, "use": false},\r
              "h2": {"coord": {"x": 1034,"y": 1314}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 984,"y": 506}},\r
              "h1": {"coord": {"x": 934,"y": 506}, "use": false},\r
              "h2": {"coord": {"x": 984,"y": 379}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 907,"y": 237}},\r
              "h1": {"coord": {"x": 959,"y": 291}},\r
              "h2": {"coord": {"x": 854,"y": 182}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 642,"y": 155}},\r
              "h1": {"coord": {"x": 768,"y": 155}},\r
              "h2": {"coord": {"x": 518,"y": 155}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 385,"y": 235}},\r
              "h1": {"coord": {"x": 434,"y": 181}},\r
              "h2": {"coord": {"x": 336,"y": 288}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 312,"y": 506}},\r
              "h1": {"coord": {"x": 312,"y": 377}},\r
              "h2": {"coord": {"x": 362,"y": 506}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 312,"y": 1314}},\r
              "h1": {"coord": {"x": 262,"y": 1314}, "use": false},\r
              "h2": {"coord": {"x": 362,"y": 1314}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 409,"y": 1314}},\r
              "h1": {"coord": {"x": 359,"y": 1314}, "use": false},\r
              "h2": {"coord": {"x": 412,"y": 1314}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 414,"y": 1319}},\r
              "h1": {"coord": {"x": 414,"y": 1316}},\r
              "h2": {"coord": {"x": 464,"y": 1319}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 414,"y": 1485}},\r
              "h1": {"coord": {"x": 364,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 414,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 409,"y": 1490}},\r
              "h1": {"coord": {"x": 412,"y": 1490}},\r
              "h2": {"coord": {"x": 459,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1319}},\r
              "h1": {"coord": {"x": -10,"y": 1319}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1314}},\r
              "h1": {"coord": {"x": 42,"y": 1314}},\r
              "h2": {"coord": {"x": 95,"y": 1314}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 138,"y": 1314}},\r
              "h1": {"coord": {"x": 88,"y": 1314}, "use": false},\r
              "h2": {"coord": {"x": 188,"y": 1314}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 138,"y": 506}},\r
              "h1": {"coord": {"x": 88,"y": 506}, "use": false},\r
              "h2": {"coord": {"x": 138,"y": 332}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 256,"y": 118}},\r
              "h1": {"coord": {"x": 176,"y": 205}},\r
              "h2": {"coord": {"x": 340,"y": 25}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 642,"y": -20}},\r
              "h1": {"coord": {"x": 466,"y": -20}},\r
              "h2": {"coord": {"x": 728,"y": -20}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 864,"y": 12}},\r
              "h1": {"coord": {"x": 800,"y": -9}},\r
              "h2": {"coord": {"x": 931,"y": 35}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1033,"y": 116}},\r
              "h1": {"coord": {"x": 988,"y": 69}},\r
              "h2": {"coord": {"x": 1117,"y": 205}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1159,"y": 506}},\r
              "h1": {"coord": {"x": 1159,"y": 332}},\r
              "h2": {"coord": {"x": 1209,"y": 506}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1159,"y": 1314}},\r
              "h1": {"coord": {"x": 1109,"y": 1314}, "use": false},\r
              "h2": {"coord": {"x": 1209,"y": 1314}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1256,"y": 1314}},\r
              "h1": {"coord": {"x": 1206,"y": 1314}, "use": false},\r
              "h2": {"coord": {"x": 1259,"y": 1314}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1261,"y": 1319}},\r
              "h1": {"coord": {"x": 1261,"y": 1316}},\r
              "h2": {"coord": {"x": 1311,"y": 1319}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1261,"y": 1485}},\r
              "h1": {"coord": {"x": 1211,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 1261,"y": 1488}}\r
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
              "p": {"coord": {"x": 1231,"y": 1490}},\r
              "h1": {"coord": {"x": 1234,"y": 1490}},\r
              "h2": {"coord": {"x": 1281,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1018,"y": 1490}},\r
              "h1": {"coord": {"x": 968,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 1016,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1013,"y": 1486}},\r
              "h1": {"coord": {"x": 1013,"y": 1488}},\r
              "h2": {"coord": {"x": 1063,"y": 1486}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 650,"y": 395}},\r
              "h1": {"coord": {"x": 600,"y": 395}, "use": false},\r
              "h2": {"coord": {"x": 700,"y": 395}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 263,"y": 1486}},\r
              "h1": {"coord": {"x": 213,"y": 1486}, "use": false},\r
              "h2": {"coord": {"x": 263,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 258,"y": 1490}},\r
              "h1": {"coord": {"x": 260,"y": 1490}},\r
              "h2": {"coord": {"x": 308,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1321}},\r
              "h1": {"coord": {"x": -10,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1316}},\r
              "h1": {"coord": {"x": 42,"y": 1316}},\r
              "h2": {"coord": {"x": 95,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 131,"y": 1316}},\r
              "h1": {"coord": {"x": 81,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 181,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 597,"y": 0}},\r
              "h1": {"coord": {"x": 547,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 647,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 705,"y": 0}},\r
              "h1": {"coord": {"x": 655,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 755,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1141,"y": 1316}},\r
              "h1": {"coord": {"x": 1091,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 1191,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1231,"y": 1316}},\r
              "h1": {"coord": {"x": 1181,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 1234,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1236,"y": 1321}},\r
              "h1": {"coord": {"x": 1236,"y": 1318}},\r
              "h2": {"coord": {"x": 1286,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1236,"y": 1485}},\r
              "h1": {"coord": {"x": 1186,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 1236,"y": 1488}}\r
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
              "p": {"coord": {"x": 1504,"y": 1490}},\r
              "h1": {"coord": {"x": 1507,"y": 1490}},\r
              "h2": {"coord": {"x": 1554,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1291,"y": 1490}},\r
              "h1": {"coord": {"x": 1241,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 1288,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1286,"y": 1485}},\r
              "h1": {"coord": {"x": 1286,"y": 1488}},\r
              "h2": {"coord": {"x": 1336,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1067,"y": 385}},\r
              "h1": {"coord": {"x": 1017,"y": 385}, "use": false},\r
              "h2": {"coord": {"x": 1117,"y": 385}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 803,"y": 897}},\r
              "h1": {"coord": {"x": 753,"y": 897}, "use": false},\r
              "h2": {"coord": {"x": 853,"y": 897}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 741,"y": 897}},\r
              "h1": {"coord": {"x": 691,"y": 897}, "use": false},\r
              "h2": {"coord": {"x": 791,"y": 897}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 484,"y": 392}},\r
              "h1": {"coord": {"x": 434,"y": 392}, "use": false},\r
              "h2": {"coord": {"x": 534,"y": 392}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 263,"y": 1485}},\r
              "h1": {"coord": {"x": 213,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 263,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 258,"y": 1490}},\r
              "h1": {"coord": {"x": 261,"y": 1490}},\r
              "h2": {"coord": {"x": 308,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1321}},\r
              "h1": {"coord": {"x": -10,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1316}},\r
              "h1": {"coord": {"x": 42,"y": 1316}},\r
              "h2": {"coord": {"x": 95,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 123,"y": 1316}},\r
              "h1": {"coord": {"x": 73,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 173,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 366,"y": 0}},\r
              "h1": {"coord": {"x": 316,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 416,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 515,"y": 0}},\r
              "h1": {"coord": {"x": 465,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 565,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 771,"y": 523}},\r
              "h1": {"coord": {"x": 721,"y": 523}, "use": false},\r
              "h2": {"coord": {"x": 821,"y": 523}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1034,"y": 0}},\r
              "h1": {"coord": {"x": 984,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1084,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1183,"y": 0}},\r
              "h1": {"coord": {"x": 1133,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1233,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1428,"y": 1316}},\r
              "h1": {"coord": {"x": 1378,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 1478,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1504,"y": 1316}},\r
              "h1": {"coord": {"x": 1454,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 1507,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1509,"y": 1321}},\r
              "h1": {"coord": {"x": 1509,"y": 1318}},\r
              "h2": {"coord": {"x": 1559,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1509,"y": 1485}},\r
              "h1": {"coord": {"x": 1459,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 1509,"y": 1488}}\r
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
              "p": {"coord": {"x": 1135,"y": 174}},\r
              "h1": {"coord": {"x": 1138,"y": 174}},\r
              "h2": {"coord": {"x": 1185,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1022,"y": 174}},\r
              "h1": {"coord": {"x": 972,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 1072,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 702,"y": 759}},\r
              "h1": {"coord": {"x": 652,"y": 759}, "use": false},\r
              "h2": {"coord": {"x": 752,"y": 759}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1010,"y": 1316}},\r
              "h1": {"coord": {"x": 960,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 1060,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1115,"y": 1316}},\r
              "h1": {"coord": {"x": 1065,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 1118,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1120,"y": 1321}},\r
              "h1": {"coord": {"x": 1120,"y": 1318}},\r
              "h2": {"coord": {"x": 1170,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1120,"y": 1485}},\r
              "h1": {"coord": {"x": 1070,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 1120,"y": 1488}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1115,"y": 1490}},\r
              "h1": {"coord": {"x": 1118,"y": 1490}},\r
              "h2": {"coord": {"x": 1165,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 902,"y": 1490}},\r
              "h1": {"coord": {"x": 852,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 900,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 898,"y": 1488}},\r
              "h1": {"coord": {"x": 848,"y": 1488}, "use": false},\r
              "h2": {"coord": {"x": 948,"y": 1488}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 897,"y": 1487}},\r
              "h1": {"coord": {"x": 847,"y": 1487}, "use": false},\r
              "h2": {"coord": {"x": 947,"y": 1487}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 600,"y": 945}},\r
              "h1": {"coord": {"x": 550,"y": 945}, "use": false},\r
              "h2": {"coord": {"x": 650,"y": 945}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 303,"y": 1487}},\r
              "h1": {"coord": {"x": 253,"y": 1487}, "use": false},\r
              "h2": {"coord": {"x": 353,"y": 1487}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 302,"y": 1488}},\r
              "h1": {"coord": {"x": 252,"y": 1488}, "use": false},\r
              "h2": {"coord": {"x": 352,"y": 1488}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 298,"y": 1490}},\r
              "h1": {"coord": {"x": 300,"y": 1490}},\r
              "h2": {"coord": {"x": 348,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 85,"y": 1490}},\r
              "h1": {"coord": {"x": 35,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 82,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 80,"y": 1485}},\r
              "h1": {"coord": {"x": 80,"y": 1488}},\r
              "h2": {"coord": {"x": 130,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 80,"y": 1321}},\r
              "h1": {"coord": {"x": 30,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 80,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 85,"y": 1316}},\r
              "h1": {"coord": {"x": 82,"y": 1316}},\r
              "h2": {"coord": {"x": 135,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 190,"y": 1316}},\r
              "h1": {"coord": {"x": 140,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 240,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 488,"y": 777}},\r
              "h1": {"coord": {"x": 438,"y": 777}, "use": false},\r
              "h2": {"coord": {"x": 538,"y": 777}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 157,"y": 174}},\r
              "h1": {"coord": {"x": 107,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 207,"y": 174}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 174}},\r
              "h1": {"coord": {"x": -5,"y": 174}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 174}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 169}},\r
              "h1": {"coord": {"x": 40,"y": 172}},\r
              "h2": {"coord": {"x": 90,"y": 169}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 258,"y": 0}},\r
              "h1": {"coord": {"x": 208,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 260,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 262,"y": 2}},\r
              "h1": {"coord": {"x": 212,"y": 2}, "use": false},\r
              "h2": {"coord": {"x": 312,"y": 2}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 263,"y": 3}},\r
              "h1": {"coord": {"x": 213,"y": 3}, "use": false},\r
              "h2": {"coord": {"x": 313,"y": 3}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 590,"y": 593}},\r
              "h1": {"coord": {"x": 540,"y": 593}, "use": false},\r
              "h2": {"coord": {"x": 640,"y": 593}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 917,"y": 3}},\r
              "h1": {"coord": {"x": 867,"y": 3}, "use": false},\r
              "h2": {"coord": {"x": 967,"y": 3}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 918,"y": 2}},\r
              "h1": {"coord": {"x": 868,"y": 2}, "use": false},\r
              "h2": {"coord": {"x": 968,"y": 2}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 922,"y": 0}},\r
              "h1": {"coord": {"x": 920,"y": 0}},\r
              "h2": {"coord": {"x": 972,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1135,"y": 0}},\r
              "h1": {"coord": {"x": 1085,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1138,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1140,"y": 5}},\r
              "h1": {"coord": {"x": 1140,"y": 2}},\r
              "h2": {"coord": {"x": 1190,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1140,"y": 169}},\r
              "h1": {"coord": {"x": 1090,"y": 169}, "use": false},\r
              "h2": {"coord": {"x": 1140,"y": 172}}\r
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
              "p": {"coord": {"x": 1231,"y": 1490}},\r
              "h1": {"coord": {"x": 1234,"y": 1490}},\r
              "h2": {"coord": {"x": 1281,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1018,"y": 1490}},\r
              "h1": {"coord": {"x": 968,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 1016,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1014,"y": 1488}},\r
              "h1": {"coord": {"x": 964,"y": 1488}, "use": false},\r
              "h2": {"coord": {"x": 1064,"y": 1488}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1014,"y": 1487}},\r
              "h1": {"coord": {"x": 964,"y": 1487}, "use": false},\r
              "h2": {"coord": {"x": 1064,"y": 1487}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 654,"y": 891}},\r
              "h1": {"coord": {"x": 604,"y": 891}, "use": false},\r
              "h2": {"coord": {"x": 704,"y": 891}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 262,"y": 1488}},\r
              "h1": {"coord": {"x": 212,"y": 1488}, "use": false},\r
              "h2": {"coord": {"x": 312,"y": 1488}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 262,"y": 1488}},\r
              "h1": {"coord": {"x": 212,"y": 1488}, "use": false},\r
              "h2": {"coord": {"x": 312,"y": 1488}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 258,"y": 1490}},\r
              "h1": {"coord": {"x": 260,"y": 1490}},\r
              "h2": {"coord": {"x": 308,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1321}},\r
              "h1": {"coord": {"x": -10,"y": 1321}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1318}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1316}},\r
              "h1": {"coord": {"x": 42,"y": 1316}},\r
              "h2": {"coord": {"x": 95,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 145,"y": 1316}},\r
              "h1": {"coord": {"x": 95,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 195,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 572,"y": 657}},\r
              "h1": {"coord": {"x": 522,"y": 657}, "use": false},\r
              "h2": {"coord": {"x": 622,"y": 657}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 572,"y": 171}},\r
              "h1": {"coord": {"x": 522,"y": 171}, "use": false},\r
              "h2": {"coord": {"x": 622,"y": 171}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 493,"y": 171}},\r
              "h1": {"coord": {"x": 443,"y": 171}, "use": false},\r
              "h2": {"coord": {"x": 490,"y": 171}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 488,"y": 166}},\r
              "h1": {"coord": {"x": 488,"y": 169}},\r
              "h2": {"coord": {"x": 538,"y": 166}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 488,"y": 2}},\r
              "h1": {"coord": {"x": 438,"y": 2}, "use": false},\r
              "h2": {"coord": {"x": 488,"y": -1}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 493,"y": -3}},\r
              "h1": {"coord": {"x": 490,"y": -3}},\r
              "h2": {"coord": {"x": 543,"y": -3}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 819,"y": -3}},\r
              "h1": {"coord": {"x": 769,"y": -3}, "use": false},\r
              "h2": {"coord": {"x": 822,"y": -3}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 824,"y": 2}},\r
              "h1": {"coord": {"x": 824,"y": -1}},\r
              "h2": {"coord": {"x": 874,"y": 2}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 824,"y": 166}},\r
              "h1": {"coord": {"x": 774,"y": 166}, "use": false},\r
              "h2": {"coord": {"x": 824,"y": 169}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 819,"y": 171}},\r
              "h1": {"coord": {"x": 822,"y": 171}},\r
              "h2": {"coord": {"x": 869,"y": 171}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 745,"y": 171}},\r
              "h1": {"coord": {"x": 695,"y": 171}, "use": false},\r
              "h2": {"coord": {"x": 795,"y": 171}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 745,"y": 687}},\r
              "h1": {"coord": {"x": 695,"y": 687}, "use": false},\r
              "h2": {"coord": {"x": 795,"y": 687}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1124,"y": 1316}},\r
              "h1": {"coord": {"x": 1074,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 1174,"y": 1316}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1231,"y": 1316}},\r
              "h1": {"coord": {"x": 1181,"y": 1316}, "use": false},\r
              "h2": {"coord": {"x": 1234,"y": 1316}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1236,"y": 1321}},\r
              "h1": {"coord": {"x": 1236,"y": 1318}},\r
              "h2": {"coord": {"x": 1286,"y": 1321}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1236,"y": 1485}},\r
              "h1": {"coord": {"x": 1186,"y": 1485}, "use": false},\r
              "h2": {"coord": {"x": 1236,"y": 1488}}\r
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
              "p": {"coord": {"x": 1101,"y": 242}},\r
              "h1": {"coord": {"x": 1104,"y": 242}},\r
              "h2": {"coord": {"x": 1151,"y": 242}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 933,"y": 242}},\r
              "h1": {"coord": {"x": 883,"y": 242}, "use": false},\r
              "h2": {"coord": {"x": 930,"y": 242}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 928,"y": 237}},\r
              "h1": {"coord": {"x": 928,"y": 240}},\r
              "h2": {"coord": {"x": 978,"y": 237}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 928,"y": 175}},\r
              "h1": {"coord": {"x": 878,"y": 175}, "use": false},\r
              "h2": {"coord": {"x": 978,"y": 175}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 334,"y": 175}},\r
              "h1": {"coord": {"x": 284,"y": 175}, "use": false},\r
              "h2": {"coord": {"x": 384,"y": 175}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1086,"y": 1460}},\r
              "h1": {"coord": {"x": 1036,"y": 1460}, "use": false},\r
              "h2": {"coord": {"x": 1136,"y": 1460}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1086,"y": 1490}},\r
              "h1": {"coord": {"x": 1036,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 1136,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 86,"y": 1490}},\r
              "h1": {"coord": {"x": 36,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 83,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 81,"y": 1485}},\r
              "h1": {"coord": {"x": 81,"y": 1488}},\r
              "h2": {"coord": {"x": 131,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 81,"y": 1253}},\r
              "h1": {"coord": {"x": 31,"y": 1253}, "use": false},\r
              "h2": {"coord": {"x": 81,"y": 1250}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 86,"y": 1248}},\r
              "h1": {"coord": {"x": 83,"y": 1248}},\r
              "h2": {"coord": {"x": 136,"y": 1248}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 255,"y": 1248}},\r
              "h1": {"coord": {"x": 205,"y": 1248}, "use": false},\r
              "h2": {"coord": {"x": 258,"y": 1248}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 260,"y": 1253}},\r
              "h1": {"coord": {"x": 260,"y": 1250}},\r
              "h2": {"coord": {"x": 310,"y": 1253}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 260,"y": 1315}},\r
              "h1": {"coord": {"x": 210,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 310,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 793,"y": 1315}},\r
              "h1": {"coord": {"x": 743,"y": 1315}, "use": false},\r
              "h2": {"coord": {"x": 843,"y": 1315}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 41,"y": 30}},\r
              "h1": {"coord": {"x": -9,"y": 30}, "use": false},\r
              "h2": {"coord": {"x": 91,"y": 30}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 0}},\r
              "h1": {"coord": {"x": -10,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1101,"y": 0}},\r
              "h1": {"coord": {"x": 1051,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1104,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1106,"y": 5}},\r
              "h1": {"coord": {"x": 1106,"y": 2}},\r
              "h2": {"coord": {"x": 1156,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1106,"y": 237}},\r
              "h1": {"coord": {"x": 1056,"y": 237}, "use": false},\r
              "h2": {"coord": {"x": 1106,"y": 240}}\r
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
              "p": {"coord": {"x": 904,"y": 165}},\r
              "h1": {"coord": {"x": 854,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 954,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 819,"y": 165}},\r
              "h1": {"coord": {"x": 769,"y": 165}},\r
              "h2": {"coord": {"x": 869,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 820,"y": 605}},\r
              "h1": {"coord": {"x": 820,"y": 571}},\r
              "h2": {"coord": {"x": 820,"y": 755}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 356,"y": 1040}},\r
              "h1": {"coord": {"x": 858,"y": 1040}},\r
              "h2": {"coord": {"x": 232,"y": 1040}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 67,"y": 992}},\r
              "h1": {"coord": {"x": 100,"y": 1005}},\r
              "h2": {"coord": {"x": 50,"y": 985}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 51,"y": 965}},\r
              "h1": {"coord": {"x": 48,"y": 979}},\r
              "h2": {"coord": {"x": 101,"y": 965}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 84,"y": 842}},\r
              "h1": {"coord": {"x": 34,"y": 842}, "use": false},\r
              "h2": {"coord": {"x": 134,"y": 842}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 84,"y": 842}},\r
              "h1": {"coord": {"x": 34,"y": 842}, "use": false},\r
              "h2": {"coord": {"x": 134,"y": 842}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 84,"y": 842}},\r
              "h1": {"coord": {"x": 34,"y": 842}, "use": false},\r
              "h2": {"coord": {"x": 88,"y": 825}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 109,"y": 826}},\r
              "h1": {"coord": {"x": 96,"y": 823}},\r
              "h2": {"coord": {"x": 144,"y": 834}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 356,"y": 879}},\r
              "h1": {"coord": {"x": 240,"y": 879}},\r
              "h2": {"coord": {"x": 645,"y": 879}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 647,"y": 651}},\r
              "h1": {"coord": {"x": 647,"y": 827}},\r
              "h2": {"coord": {"x": 647,"y": 645}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 647,"y": 589}},\r
              "h1": {"coord": {"x": 647,"y": 619}},\r
              "h2": {"coord": {"x": 585,"y": 639}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 415,"y": 671}},\r
              "h1": {"coord": {"x": 505,"y": 671}},\r
              "h2": {"coord": {"x": 197,"y": 671}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 292}},\r
              "h1": {"coord": {"x": 40,"y": 512}},\r
              "h2": {"coord": {"x": 40,"y": 184}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 425,"y": -20}},\r
              "h1": {"coord": {"x": 125,"y": -20}},\r
              "h2": {"coord": {"x": 522,"y": -20}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 669,"y": 37}},\r
              "h1": {"coord": {"x": 606,"y": 7}},\r
              "h2": {"coord": {"x": 684,"y": 15}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 737,"y": 1}},\r
              "h1": {"coord": {"x": 709,"y": 1}},\r
              "h2": {"coord": {"x": 787,"y": 1}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 904,"y": 1}},\r
              "h1": {"coord": {"x": 854,"y": 1}, "use": false},\r
              "h2": {"coord": {"x": 907,"y": 1}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 909,"y": 6}},\r
              "h1": {"coord": {"x": 909,"y": 3}},\r
              "h2": {"coord": {"x": 959,"y": 6}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 909,"y": 160}},\r
              "h1": {"coord": {"x": 859,"y": 160}, "use": false},\r
              "h2": {"coord": {"x": 909,"y": 163}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 904,"y": 165}},\r
              "h1": {"coord": {"x": 907,"y": 165}},\r
              "h2": {"coord": {"x": 954,"y": 165}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -6,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 654,"y": 212}},\r
              "h1": {"coord": {"x": 604,"y": 212}, "use": false},\r
              "h2": {"coord": {"x": 654,"y": 164}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 425,"y": 117}},\r
              "h1": {"coord": {"x": 593,"y": 117}},\r
              "h2": {"coord": {"x": 355,"y": 117}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 203,"y": 293}},\r
              "h1": {"coord": {"x": 203,"y": 116}},\r
              "h2": {"coord": {"x": 203,"y": 437}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 415,"y": 534}},\r
              "h1": {"coord": {"x": 287,"y": 534}},\r
              "h2": {"coord": {"x": 543,"y": 534}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 654,"y": 340}},\r
              "h1": {"coord": {"x": 654,"y": 458}},\r
              "h2": {"coord": {"x": 654,"y": 271}}\r
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
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": -5,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 212,"y": 0}},\r
              "h1": {"coord": {"x": 162,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 257,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 82}},\r
              "h1": {"coord": {"x": 293,"y": 37}},\r
              "h2": {"coord": {"x": 343,"y": 82}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 93}},\r
              "h1": {"coord": {"x": 243,"y": 93}, "use": false},\r
              "h2": {"coord": {"x": 356,"y": 25}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 590,"y": -20}},\r
              "h1": {"coord": {"x": 451,"y": -20}},\r
              "h2": {"coord": {"x": 893,"y": -20}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1045,"y": 384}},\r
              "h1": {"coord": {"x": 1045,"y": 159}},\r
              "h2": {"coord": {"x": 1095,"y": 384}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1045,"y": 589}},\r
              "h1": {"coord": {"x": 995,"y": 589}, "use": false},\r
              "h2": {"coord": {"x": 1095,"y": 589}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1045,"y": 589}},\r
              "h1": {"coord": {"x": 995,"y": 589}, "use": false},\r
              "h2": {"coord": {"x": 1044,"y": 851}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 593,"y": 1040}},\r
              "h1": {"coord": {"x": 840,"y": 1040}},\r
              "h2": {"coord": {"x": 477,"y": 1040}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 294,"y": 915}},\r
              "h1": {"coord": {"x": 373,"y": 992}},\r
              "h2": {"coord": {"x": 344,"y": 915}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 1408}},\r
              "h1": {"coord": {"x": 243,"y": 1408}, "use": false},\r
              "h2": {"coord": {"x": 293,"y": 1453}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 212,"y": 1490}},\r
              "h1": {"coord": {"x": 257,"y": 1490}},\r
              "h2": {"coord": {"x": 262,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1332}},\r
              "h1": {"coord": {"x": -10,"y": 1332}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1329}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1327}},\r
              "h1": {"coord": {"x": 42,"y": 1327}},\r
              "h2": {"coord": {"x": 95,"y": 1327}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": 1327}},\r
              "h1": {"coord": {"x": 80,"y": 1327}, "use": false},\r
              "h2": {"coord": {"x": 180,"y": 1327}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": 164}},\r
              "h1": {"coord": {"x": 80,"y": 164}, "use": false},\r
              "h2": {"coord": {"x": 180,"y": 164}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 164}},\r
              "h1": {"coord": {"x": -5,"y": 164}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 164}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 159}},\r
              "h1": {"coord": {"x": 40,"y": 162}},\r
              "h2": {"coord": {"x": 90,"y": 159}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -7,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 605}},\r
              "h1": {"coord": {"x": 243,"y": 605}, "use": false},\r
              "h2": {"coord": {"x": 299,"y": 776}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 593,"y": 896}},\r
              "h1": {"coord": {"x": 439,"y": 896}},\r
              "h2": {"coord": {"x": 750,"y": 896}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 880,"y": 576}},\r
              "h1": {"coord": {"x": 880,"y": 766}},\r
              "h2": {"coord": {"x": 930,"y": 576}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 880,"y": 396}},\r
              "h1": {"coord": {"x": 830,"y": 396}, "use": false},\r
              "h2": {"coord": {"x": 880,"y": 155}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 590,"y": 133}},\r
              "h1": {"coord": {"x": 663,"y": 133}},\r
              "h2": {"coord": {"x": 484,"y": 133}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 403}},\r
              "h1": {"coord": {"x": 300,"y": 179}},\r
              "h2": {"coord": {"x": 343,"y": 403}, "use": false}\r
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
              "p": {"coord": {"x": 40,"y": 1016}},\r
              "h1": {"coord": {"x": -10,"y": 1016}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 1016}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 863}},\r
              "h1": {"coord": {"x": -10,"y": 863}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 860}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 858}},\r
              "h1": {"coord": {"x": 42,"y": 858}},\r
              "h2": {"coord": {"x": 95,"y": 858}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": 858}},\r
              "h1": {"coord": {"x": 80,"y": 858}},\r
              "h2": {"coord": {"x": 130,"y": 507}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": -265}},\r
              "h1": {"coord": {"x": 80,"y": -265}, "use": false},\r
              "h2": {"coord": {"x": 180,"y": -265}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 46,"y": -265}},\r
              "h1": {"coord": {"x": -4,"y": -265}, "use": false},\r
              "h2": {"coord": {"x": 43,"y": -265}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 41,"y": -270}},\r
              "h1": {"coord": {"x": 41,"y": -267}},\r
              "h2": {"coord": {"x": 91,"y": -270}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 41,"y": -424}},\r
              "h1": {"coord": {"x": -9,"y": -424}, "use": false},\r
              "h2": {"coord": {"x": 41,"y": -427}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 46,"y": -429}},\r
              "h1": {"coord": {"x": 43,"y": -429}},\r
              "h2": {"coord": {"x": 96,"y": -429}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 212,"y": -429}},\r
              "h1": {"coord": {"x": 162,"y": -429}, "use": false},\r
              "h2": {"coord": {"x": 257,"y": -429}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 294,"y": -347}},\r
              "h1": {"coord": {"x": 294,"y": -392}},\r
              "h2": {"coord": {"x": 344,"y": -347}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 294,"y": 99}},\r
              "h1": {"coord": {"x": 244,"y": 99}, "use": false},\r
              "h2": {"coord": {"x": 356,"y": 28}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 595,"y": -19}},\r
              "h1": {"coord": {"x": 453,"y": -19}},\r
              "h2": {"coord": {"x": 898,"y": -19}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1050,"y": 385}},\r
              "h1": {"coord": {"x": 1050,"y": 160}},\r
              "h2": {"coord": {"x": 1100,"y": 385}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1050,"y": 589}},\r
              "h1": {"coord": {"x": 1000,"y": 589}, "use": false},\r
              "h2": {"coord": {"x": 1049,"y": 851}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 598,"y": 1041}},\r
              "h1": {"coord": {"x": 845,"y": 1041}},\r
              "h2": {"coord": {"x": 480,"y": 1041}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 910}},\r
              "h1": {"coord": {"x": 372,"y": 990}},\r
              "h2": {"coord": {"x": 343,"y": 910}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 293,"y": 940}},\r
              "h1": {"coord": {"x": 243,"y": 940}, "use": false},\r
              "h2": {"coord": {"x": 293,"y": 985}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 212,"y": 1021}},\r
              "h1": {"coord": {"x": 257,"y": 1021}},\r
              "h2": {"coord": {"x": 262,"y": 1021}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1021}},\r
              "h1": {"coord": {"x": -5,"y": 1021}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1021}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1016}},\r
              "h1": {"coord": {"x": 40,"y": 1019}},\r
              "h2": {"coord": {"x": 90,"y": 1016}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -7,\r
          "pathPoints": [\r
            {\r
              "type": "flat",\r
              "p": {"coord": {"x": 298,"y": 417}},\r
              "h1": {"coord": {"x": 298,"y": 182}},\r
              "h2": {"coord": {"x": 298,"y": 422}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 298,"y": 595}},\r
              "h1": {"coord": {"x": 298,"y": 550}},\r
              "h2": {"coord": {"x": 298,"y": 772}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 598,"y": 897}},\r
              "h1": {"coord": {"x": 441,"y": 897}},\r
              "h2": {"coord": {"x": 755,"y": 897}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 885,"y": 577}},\r
              "h1": {"coord": {"x": 885,"y": 767}},\r
              "h2": {"coord": {"x": 935,"y": 577}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 885,"y": 397}},\r
              "h1": {"coord": {"x": 835,"y": 397}, "use": false},\r
              "h2": {"coord": {"x": 885,"y": 156}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 595,"y": 134}},\r
              "h1": {"coord": {"x": 668,"y": 134}},\r
              "h2": {"coord": {"x": 487,"y": 134}}\r
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
              "p": {"coord": {"x": 849,"y": 272}},\r
              "h1": {"coord": {"x": 854,"y": 270}},\r
              "h2": {"coord": {"x": 824,"y": 282}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 720,"y": 331}},\r
              "h1": {"coord": {"x": 753,"y": 316}},\r
              "h2": {"coord": {"x": 717,"y": 332}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 714,"y": 327}},\r
              "h1": {"coord": {"x": 714,"y": 330}},\r
              "h2": {"coord": {"x": 714,"y": 173}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 142}},\r
              "h1": {"coord": {"x": 585,"y": 142}},\r
              "h2": {"coord": {"x": 372,"y": 142}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 204,"y": 392}},\r
              "h1": {"coord": {"x": 204,"y": 158}},\r
              "h2": {"coord": {"x": 254,"y": 392}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 204,"y": 592}},\r
              "h1": {"coord": {"x": 154,"y": 592}, "use": false},\r
              "h2": {"coord": {"x": 254,"y": 592}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 204,"y": 592}},\r
              "h1": {"coord": {"x": 154,"y": 592}, "use": false},\r
              "h2": {"coord": {"x": 205,"y": 767}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 897}},\r
              "h1": {"coord": {"x": 324,"y": 897}},\r
              "h2": {"coord": {"x": 529,"y": 897}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 897}},\r
              "h1": {"coord": {"x": 429,"y": 897}, "use": false},\r
              "h2": {"coord": {"x": 529,"y": 897}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 897}},\r
              "h1": {"coord": {"x": 429,"y": 897}, "use": false},\r
              "h2": {"coord": {"x": 590,"y": 897}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 696,"y": 739}},\r
              "h1": {"coord": {"x": 670,"y": 847}},\r
              "h2": {"coord": {"x": 698,"y": 729}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 712,"y": 736}},\r
              "h1": {"coord": {"x": 705,"y": 733}},\r
              "h2": {"coord": {"x": 742,"y": 750}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 837,"y": 799}},\r
              "h1": {"coord": {"x": 801,"y": 783}},\r
              "h2": {"coord": {"x": 840,"y": 800}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 842,"y": 808}},\r
              "h1": {"coord": {"x": 844,"y": 801}},\r
              "h2": {"coord": {"x": 801,"y": 949}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 1040}},\r
              "h1": {"coord": {"x": 670,"y": 1040}},\r
              "h2": {"coord": {"x": 529,"y": 1040}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 1040}},\r
              "h1": {"coord": {"x": 429,"y": 1040}, "use": false},\r
              "h2": {"coord": {"x": 529,"y": 1040}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 1040}},\r
              "h1": {"coord": {"x": 429,"y": 1040}, "use": false},\r
              "h2": {"coord": {"x": 233,"y": 1040}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 590}},\r
              "h1": {"coord": {"x": 40,"y": 838}},\r
              "h2": {"coord": {"x": 90,"y": 590}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 590}},\r
              "h1": {"coord": {"x": -10,"y": 590}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 590}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 390}},\r
              "h1": {"coord": {"x": -10,"y": 390}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 390}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 390}},\r
              "h1": {"coord": {"x": -10,"y": 390}, "use": false},\r
              "h2": {"coord": {"x": 41,"y": 175}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": -20}},\r
              "h1": {"coord": {"x": 169,"y": -20}},\r
              "h2": {"coord": {"x": 785,"y": -20}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 858,"y": 262}},\r
              "h1": {"coord": {"x": 858,"y": 205}},\r
              "h2": {"coord": {"x": 858,"y": 267}}\r
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
              "p": {"coord": {"x": 919,"y": 592}},\r
              "h1": {"coord": {"x": 869,"y": 592}, "use": false},\r
              "h2": {"coord": {"x": 918,"y": 839}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 480,"y": 1040}},\r
              "h1": {"coord": {"x": 725,"y": 1040}},\r
              "h2": {"coord": {"x": 235,"y": 1040}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 41,"y": 592}},\r
              "h1": {"coord": {"x": 42,"y": 839}},\r
              "h2": {"coord": {"x": 91,"y": 592}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 592}},\r
              "h1": {"coord": {"x": -10,"y": 592}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 592}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 390}},\r
              "h1": {"coord": {"x": -10,"y": 390}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 390}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 390}},\r
              "h1": {"coord": {"x": -10,"y": 390}, "use": false},\r
              "h2": {"coord": {"x": 41,"y": 175}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 480,"y": -20}},\r
              "h1": {"coord": {"x": 170,"y": -20}},\r
              "h2": {"coord": {"x": 530,"y": -20}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 480,"y": -20}},\r
              "h1": {"coord": {"x": 430,"y": -20}, "use": false},\r
              "h2": {"coord": {"x": 790,"y": -20}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 919,"y": 390}},\r
              "h1": {"coord": {"x": 918,"y": 175}},\r
              "h2": {"coord": {"x": 969,"y": 390}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 919,"y": 390}},\r
              "h1": {"coord": {"x": 869,"y": 390}, "use": false},\r
              "h2": {"coord": {"x": 969,"y": 390}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 919,"y": 592}},\r
              "h1": {"coord": {"x": 869,"y": 592}, "use": false},\r
              "h2": {"coord": {"x": 969,"y": 592}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "flat",\r
              "p": {"coord": {"x": 480,"y": 142}},\r
              "h1": {"coord": {"x": 587,"y": 142}},\r
              "h2": {"coord": {"x": 430,"y": 142}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 142}},\r
              "h1": {"coord": {"x": 429,"y": 142}, "use": false},\r
              "h2": {"coord": {"x": 529,"y": 142}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 142}},\r
              "h1": {"coord": {"x": 429,"y": 142}, "use": false},\r
              "h2": {"coord": {"x": 372,"y": 142}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 204,"y": 392}},\r
              "h1": {"coord": {"x": 204,"y": 158}},\r
              "h2": {"coord": {"x": 254,"y": 392}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 204,"y": 590}},\r
              "h1": {"coord": {"x": 154,"y": 590}, "use": false},\r
              "h2": {"coord": {"x": 254,"y": 590}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 205,"y": 590}},\r
              "h1": {"coord": {"x": 155,"y": 590}, "use": false},\r
              "h2": {"coord": {"x": 205,"y": 766}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 480,"y": 897}},\r
              "h1": {"coord": {"x": 324,"y": 897}},\r
              "h2": {"coord": {"x": 636,"y": 897}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 755,"y": 590}},\r
              "h1": {"coord": {"x": 755,"y": 766}},\r
              "h2": {"coord": {"x": 805,"y": 590}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 755,"y": 590}},\r
              "h1": {"coord": {"x": 705,"y": 590}, "use": false},\r
              "h2": {"coord": {"x": 805,"y": 590}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 755,"y": 392}},\r
              "h1": {"coord": {"x": 705,"y": 392}, "use": false},\r
              "h2": {"coord": {"x": 755,"y": 158}}\r
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
              "p": {"coord": {"x": 479,"y": -20}},\r
              "h1": {"coord": {"x": 429,"y": -20}, "use": false},\r
              "h2": {"coord": {"x": 529,"y": -20}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 480,"y": -20}},\r
              "h1": {"coord": {"x": 430,"y": -20}, "use": false},\r
              "h2": {"coord": {"x": 530,"y": -20}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 480,"y": -20}},\r
              "h1": {"coord": {"x": 430,"y": -20}, "use": false},\r
              "h2": {"coord": {"x": 714,"y": -20}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 877,"y": 155}},\r
              "h1": {"coord": {"x": 843,"y": 106}},\r
              "h2": {"coord": {"x": 886,"y": 168}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 734,"y": 244}},\r
              "h1": {"coord": {"x": 745,"y": 255}},\r
              "h2": {"coord": {"x": 680,"y": 187}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 480,"y": 142}},\r
              "h1": {"coord": {"x": 564,"y": 142}},\r
              "h2": {"coord": {"x": 530,"y": 142}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 142}},\r
              "h1": {"coord": {"x": 429,"y": 142}, "use": false},\r
              "h2": {"coord": {"x": 529,"y": 142}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": 142}},\r
              "h1": {"coord": {"x": 429,"y": 142}, "use": false},\r
              "h2": {"coord": {"x": 372,"y": 142}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 204,"y": 392}},\r
              "h1": {"coord": {"x": 204,"y": 158}},\r
              "h2": {"coord": {"x": 254,"y": 392}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 204,"y": 462}},\r
              "h1": {"coord": {"x": 154,"y": 462}, "use": false},\r
              "h2": {"coord": {"x": 254,"y": 462}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 880,"y": 489}},\r
              "h1": {"coord": {"x": 830,"y": 489}, "use": false},\r
              "h2": {"coord": {"x": 887,"y": 489}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 892,"y": 502}},\r
              "h1": {"coord": {"x": 892,"y": 495}},\r
              "h2": {"coord": {"x": 942,"y": 502}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 891,"y": 573}},\r
              "h1": {"coord": {"x": 841,"y": 573}, "use": false},\r
              "h2": {"coord": {"x": 941,"y": 573}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 891,"y": 573}},\r
              "h1": {"coord": {"x": 841,"y": 573}, "use": false},\r
              "h2": {"coord": {"x": 886,"y": 887}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 482,"y": 1040}},\r
              "h1": {"coord": {"x": 724,"y": 1040}},\r
              "h2": {"coord": {"x": 532,"y": 1040}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 481,"y": 1040}},\r
              "h1": {"coord": {"x": 431,"y": 1040}, "use": false},\r
              "h2": {"coord": {"x": 531,"y": 1040}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 481,"y": 1040}},\r
              "h1": {"coord": {"x": 431,"y": 1040}, "use": false},\r
              "h2": {"coord": {"x": 236,"y": 1040}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 592}},\r
              "h1": {"coord": {"x": 41,"y": 839}},\r
              "h2": {"coord": {"x": 90,"y": 592}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 592}},\r
              "h1": {"coord": {"x": -10,"y": 592}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 592}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 390}},\r
              "h1": {"coord": {"x": -10,"y": 390}, "use": false},\r
              "h2": {"coord": {"x": 90,"y": 390}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 390}},\r
              "h1": {"coord": {"x": -10,"y": 390}, "use": false},\r
              "h2": {"coord": {"x": 41,"y": 175}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 479,"y": -20}},\r
              "h1": {"coord": {"x": 169,"y": -20}},\r
              "h2": {"coord": {"x": 529,"y": -20}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -6,\r
          "pathPoints": [\r
            {\r
              "type": "flat",\r
              "p": {"coord": {"x": 481,"y": 897}},\r
              "h1": {"coord": {"x": 335,"y": 897}},\r
              "h2": {"coord": {"x": 531,"y": 897}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 481,"y": 897}},\r
              "h1": {"coord": {"x": 431,"y": 897}, "use": false},\r
              "h2": {"coord": {"x": 531,"y": 897}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 482,"y": 897}},\r
              "h1": {"coord": {"x": 432,"y": 897}, "use": false},\r
              "h2": {"coord": {"x": 624,"y": 897}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 725,"y": 636}},\r
              "h1": {"coord": {"x": 711,"y": 788}},\r
              "h2": {"coord": {"x": 775,"y": 636}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 207,"y": 622}},\r
              "h1": {"coord": {"x": 157,"y": 622}, "use": false},\r
              "h2": {"coord": {"x": 221,"y": 781}}\r
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
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 381,"y": 0}},\r
              "h1": {"coord": {"x": 331,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 384,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 386,"y": 5}},\r
              "h1": {"coord": {"x": 386,"y": 2}},\r
              "h2": {"coord": {"x": 436,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 386,"y": 160}},\r
              "h1": {"coord": {"x": 336,"y": 160}, "use": false},\r
              "h2": {"coord": {"x": 386,"y": 163}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 381,"y": 165}},\r
              "h1": {"coord": {"x": 384,"y": 165}},\r
              "h2": {"coord": {"x": 431,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 296,"y": 165}},\r
              "h1": {"coord": {"x": 246,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 346,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 296,"y": 855}},\r
              "h1": {"coord": {"x": 246,"y": 855}, "use": false},\r
              "h2": {"coord": {"x": 346,"y": 855}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 501,"y": 855}},\r
              "h1": {"coord": {"x": 451,"y": 855}, "use": false},\r
              "h2": {"coord": {"x": 504,"y": 855}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 506,"y": 860}},\r
              "h1": {"coord": {"x": 506,"y": 857}},\r
              "h2": {"coord": {"x": 556,"y": 860}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 506,"y": 1015}},\r
              "h1": {"coord": {"x": 456,"y": 1015}, "use": false},\r
              "h2": {"coord": {"x": 506,"y": 1018}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 501,"y": 1020}},\r
              "h1": {"coord": {"x": 504,"y": 1020}},\r
              "h2": {"coord": {"x": 551,"y": 1020}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 296,"y": 1020}},\r
              "h1": {"coord": {"x": 246,"y": 1020}, "use": false},\r
              "h2": {"coord": {"x": 346,"y": 1020}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 296,"y": 1111}},\r
              "h1": {"coord": {"x": 246,"y": 1111}, "use": false},\r
              "h2": {"coord": {"x": 296,"y": 1287}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 514,"y": 1339}},\r
              "h1": {"coord": {"x": 368,"y": 1339}},\r
              "h2": {"coord": {"x": 568,"y": 1339}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 671,"y": 1327}},\r
              "h1": {"coord": {"x": 627,"y": 1333}},\r
              "h2": {"coord": {"x": 684,"y": 1325}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 696,"y": 1343}},\r
              "h1": {"coord": {"x": 692,"y": 1326}},\r
              "h2": {"coord": {"x": 746,"y": 1343}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 696,"y": 1343}},\r
              "h1": {"coord": {"x": 646,"y": 1343}, "use": false},\r
              "h2": {"coord": {"x": 746,"y": 1343}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 696,"y": 1343}},\r
              "h1": {"coord": {"x": 646,"y": 1343}, "use": false},\r
              "h2": {"coord": {"x": 746,"y": 1343}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 730,"y": 1466}},\r
              "h1": {"coord": {"x": 680,"y": 1466}, "use": false},\r
              "h2": {"coord": {"x": 733,"y": 1480}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 713,"y": 1493}},\r
              "h1": {"coord": {"x": 731,"y": 1489}},\r
              "h2": {"coord": {"x": 646,"y": 1508}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 514,"y": 1510}},\r
              "h1": {"coord": {"x": 541,"y": 1510}},\r
              "h2": {"coord": {"x": 136,"y": 1510}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 131,"y": 1076}},\r
              "h1": {"coord": {"x": 131,"y": 1226}},\r
              "h2": {"coord": {"x": 181,"y": 1076}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 131,"y": 1020}},\r
              "h1": {"coord": {"x": 81,"y": 1020}, "use": false},\r
              "h2": {"coord": {"x": 181,"y": 1020}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1020}},\r
              "h1": {"coord": {"x": -5,"y": 1020}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1020}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1015}},\r
              "h1": {"coord": {"x": 40,"y": 1018}},\r
              "h2": {"coord": {"x": 90,"y": 1015}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 860}},\r
              "h1": {"coord": {"x": -10,"y": 860}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 857}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 855}},\r
              "h1": {"coord": {"x": 42,"y": 855}},\r
              "h2": {"coord": {"x": 95,"y": 855}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 131,"y": 855}},\r
              "h1": {"coord": {"x": 81,"y": 855}},\r
              "h2": {"coord": {"x": 181,"y": 855}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 131,"y": 165}},\r
              "h1": {"coord": {"x": 81,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 181,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 165}},\r
              "h1": {"coord": {"x": -5,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 165}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 160}},\r
              "h1": {"coord": {"x": 40,"y": 163}},\r
              "h2": {"coord": {"x": 90,"y": 160}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
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
              "p": {"coord": {"x": 1003,"y": 1020}},\r
              "h1": {"coord": {"x": 953,"y": 1020}, "use": false},\r
              "h2": {"coord": {"x": 1053,"y": 1020}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 872,"y": 1020}},\r
              "h1": {"coord": {"x": 822,"y": 1020}, "use": false},\r
              "h2": {"coord": {"x": 849,"y": 1020}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 814,"y": 991}},\r
              "h1": {"coord": {"x": 828,"y": 1009}},\r
              "h2": {"coord": {"x": 864,"y": 991}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 781,"y": 947}},\r
              "h1": {"coord": {"x": 731,"y": 947}, "use": false},\r
              "h2": {"coord": {"x": 704,"y": 1005}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 505,"y": 1040}},\r
              "h1": {"coord": {"x": 609,"y": 1040}},\r
              "h2": {"coord": {"x": 249,"y": 1040}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 571}},\r
              "h1": {"coord": {"x": 40,"y": 830}},\r
              "h2": {"coord": {"x": 40,"y": 471}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": 319}},\r
              "h1": {"coord": {"x": 71,"y": 385}},\r
              "h2": {"coord": {"x": 85,"y": 272}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 59,"y": 162}},\r
              "h1": {"coord": {"x": 59,"y": 211}},\r
              "h2": {"coord": {"x": 59,"y": 58}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 348,"y": -100}},\r
              "h1": {"coord": {"x": 118,"y": -100}},\r
              "h2": {"coord": {"x": 546,"y": -100}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 773,"y": -44}},\r
              "h1": {"coord": {"x": 661,"y": -44}},\r
              "h2": {"coord": {"x": 803,"y": -44}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 796,"y": -79}},\r
              "h1": {"coord": {"x": 796,"y": -58}},\r
              "h2": {"coord": {"x": 796,"y": -272}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 425,"y": -287}},\r
              "h1": {"coord": {"x": 708,"y": -287}},\r
              "h2": {"coord": {"x": 373,"y": -287}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 228,"y": -271}},\r
              "h1": {"coord": {"x": 267,"y": -278}},\r
              "h2": {"coord": {"x": 222,"y": -270}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 214,"y": -279}},\r
              "h1": {"coord": {"x": 216,"y": -273}},\r
              "h2": {"coord": {"x": 264,"y": -279}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 176,"y": -418}},\r
              "h1": {"coord": {"x": 126,"y": -418}, "use": false},\r
              "h2": {"coord": {"x": 174,"y": -425}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 185,"y": -433}},\r
              "h1": {"coord": {"x": 178,"y": -432}},\r
              "h2": {"coord": {"x": 249,"y": -447}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 425,"y": -450}},\r
              "h1": {"coord": {"x": 365,"y": -450}},\r
              "h2": {"coord": {"x": 907,"y": -450}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 956,"y": -44}},\r
              "h1": {"coord": {"x": 956,"y": -259}},\r
              "h2": {"coord": {"x": 956,"y": 32}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 801,"y": 137}},\r
              "h1": {"coord": {"x": 947,"y": 137}},\r
              "h2": {"coord": {"x": 677,"y": 137}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 382,"y": 67}},\r
              "h1": {"coord": {"x": 545,"y": 67}},\r
              "h2": {"coord": {"x": 249,"y": 67}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 210,"y": 165}},\r
              "h1": {"coord": {"x": 210,"y": 103}},\r
              "h2": {"coord": {"x": 210,"y": 191}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 242,"y": 236}},\r
              "h1": {"coord": {"x": 223,"y": 217}},\r
              "h2": {"coord": {"x": 315,"y": 199}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 505,"y": 180}},\r
              "h1": {"coord": {"x": 405,"y": 180}},\r
              "h2": {"coord": {"x": 633,"y": 180}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 824,"y": 270}},\r
              "h1": {"coord": {"x": 743,"y": 211}},\r
              "h2": {"coord": {"x": 919,"y": 340}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 969,"y": 571}},\r
              "h1": {"coord": {"x": 969,"y": 444}},\r
              "h2": {"coord": {"x": 969,"y": 670}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 887,"y": 838}},\r
              "h1": {"coord": {"x": 939,"y": 762}},\r
              "h2": {"coord": {"x": 937,"y": 838}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 899,"y": 857}},\r
              "h1": {"coord": {"x": 849,"y": 857}, "use": false},\r
              "h2": {"coord": {"x": 949,"y": 857}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1003,"y": 857}},\r
              "h1": {"coord": {"x": 953,"y": 857}, "use": false},\r
              "h2": {"coord": {"x": 1006,"y": 857}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1008,"y": 862}},\r
              "h1": {"coord": {"x": 1008,"y": 859}},\r
              "h2": {"coord": {"x": 1058,"y": 862}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1008,"y": 1015}},\r
              "h1": {"coord": {"x": 958,"y": 1015}, "use": false},\r
              "h2": {"coord": {"x": 1008,"y": 1018}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1003,"y": 1020}},\r
              "h1": {"coord": {"x": 1006,"y": 1020}},\r
              "h2": {"coord": {"x": 1053,"y": 1020}, "use": false}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": -5,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 209,"y": 568}},\r
              "h1": {"coord": {"x": 209,"y": 343}},\r
              "h2": {"coord": {"x": 209,"y": 751}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 505,"y": 901}},\r
              "h1": {"coord": {"x": 342,"y": 901}},\r
              "h2": {"coord": {"x": 668,"y": 901}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 800,"y": 568}},\r
              "h1": {"coord": {"x": 800,"y": 751}},\r
              "h2": {"coord": {"x": 800,"y": 343}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 505,"y": 319}},\r
              "h1": {"coord": {"x": 594,"y": 319}},\r
              "h2": {"coord": {"x": 416,"y": 319}}\r
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
              "p": {"coord": {"x": 1043,"y": 165}},\r
              "h1": {"coord": {"x": 1046,"y": 165}},\r
              "h2": {"coord": {"x": 1093,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 983,"y": 165}},\r
              "h1": {"coord": {"x": 933,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 1033,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 983,"y": 635}},\r
              "h1": {"coord": {"x": 933,"y": 635}, "use": false},\r
              "h2": {"coord": {"x": 1033,"y": 635}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 983,"y": 635}},\r
              "h1": {"coord": {"x": 933,"y": 635}, "use": false},\r
              "h2": {"coord": {"x": 983,"y": 860}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 536,"y": 1039}},\r
              "h1": {"coord": {"x": 839,"y": 1039}},\r
              "h2": {"coord": {"x": 434,"y": 1039}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 295,"y": 975}},\r
              "h1": {"coord": {"x": 355,"y": 1015}},\r
              "h2": {"coord": {"x": 345,"y": 975}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 295,"y": 1408}},\r
              "h1": {"coord": {"x": 245,"y": 1408}, "use": false},\r
              "h2": {"coord": {"x": 295,"y": 1453}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 213,"y": 1490}},\r
              "h1": {"coord": {"x": 258,"y": 1490}},\r
              "h2": {"coord": {"x": 263,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1330}},\r
              "h1": {"coord": {"x": -10,"y": 1330}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1327}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1325}},\r
              "h1": {"coord": {"x": 42,"y": 1325}},\r
              "h2": {"coord": {"x": 95,"y": 1325}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": 1325}},\r
              "h1": {"coord": {"x": 80,"y": 1325}, "use": false},\r
              "h2": {"coord": {"x": 180,"y": 1325}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": 165}},\r
              "h1": {"coord": {"x": 80,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 180,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 165}},\r
              "h1": {"coord": {"x": -5,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 165}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 160}},\r
              "h1": {"coord": {"x": 40,"y": 163}},\r
              "h2": {"coord": {"x": 90,"y": 160}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 357,"y": 0}},\r
              "h1": {"coord": {"x": 307,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 360,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 362,"y": 5}},\r
              "h1": {"coord": {"x": 362,"y": 2}},\r
              "h2": {"coord": {"x": 412,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 362,"y": 160}},\r
              "h1": {"coord": {"x": 312,"y": 160}, "use": false},\r
              "h2": {"coord": {"x": 362,"y": 163}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 357,"y": 165}},\r
              "h1": {"coord": {"x": 360,"y": 165}},\r
              "h2": {"coord": {"x": 407,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 295,"y": 165}},\r
              "h1": {"coord": {"x": 245,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 345,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 295,"y": 791}},\r
              "h1": {"coord": {"x": 245,"y": 791}, "use": false},\r
              "h2": {"coord": {"x": 366,"y": 875}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 536,"y": 894}},\r
              "h1": {"coord": {"x": 482,"y": 894}},\r
              "h2": {"coord": {"x": 574,"y": 894}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 816,"y": 635}},\r
              "h1": {"coord": {"x": 816,"y": 876}},\r
              "h2": {"coord": {"x": 866,"y": 635}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 816,"y": 635}},\r
              "h1": {"coord": {"x": 766,"y": 635}, "use": false},\r
              "h2": {"coord": {"x": 866,"y": 635}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 816,"y": 165}},\r
              "h1": {"coord": {"x": 766,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 866,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 731,"y": 165}},\r
              "h1": {"coord": {"x": 681,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 728,"y": 165}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 726,"y": 160}},\r
              "h1": {"coord": {"x": 726,"y": 163}},\r
              "h2": {"coord": {"x": 776,"y": 160}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 726,"y": 5}},\r
              "h1": {"coord": {"x": 676,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 726,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 731,"y": 0}},\r
              "h1": {"coord": {"x": 728,"y": 0}},\r
              "h2": {"coord": {"x": 781,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1043,"y": 0}},\r
              "h1": {"coord": {"x": 993,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 1046,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1048,"y": 5}},\r
              "h1": {"coord": {"x": 1048,"y": 2}},\r
              "h2": {"coord": {"x": 1098,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 1048,"y": 160}},\r
              "h1": {"coord": {"x": 998,"y": 160}, "use": false},\r
              "h2": {"coord": {"x": 1048,"y": 163}}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x69": {\r
      "id": "glyph-0x69",\r
      "advanceWidth": 412,\r
      "usedIn": [\r
        "liga-f-i"\r
      ],\r
      "shapes": [\r
        {\r
          "name": "Path 1",\r
          "winding": 10,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 855}},\r
              "h1": {"coord": {"x": 42,"y": 855}},\r
              "h2": {"coord": {"x": 95,"y": 855}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": 855}},\r
              "h1": {"coord": {"x": 80,"y": 855}, "use": false},\r
              "h2": {"coord": {"x": 180,"y": 855}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": 165}},\r
              "h1": {"coord": {"x": 80,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 180,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 55,"y": 165}},\r
              "h1": {"coord": {"x": 5,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 52,"y": 165}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 50,"y": 160}},\r
              "h1": {"coord": {"x": 50,"y": 163}},\r
              "h2": {"coord": {"x": 100,"y": 160}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 50,"y": 5}},\r
              "h1": {"coord": {"x": 0,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 50,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 55,"y": 0}},\r
              "h1": {"coord": {"x": 52,"y": 0}},\r
              "h2": {"coord": {"x": 105,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 367,"y": 0}},\r
              "h1": {"coord": {"x": 317,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 370,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 372,"y": 5}},\r
              "h1": {"coord": {"x": 372,"y": 2}},\r
              "h2": {"coord": {"x": 422,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 372,"y": 160}},\r
              "h1": {"coord": {"x": 322,"y": 160}, "use": false},\r
              "h2": {"coord": {"x": 372,"y": 163}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 367,"y": 165}},\r
              "h1": {"coord": {"x": 370,"y": 165}},\r
              "h2": {"coord": {"x": 417,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 295,"y": 165}},\r
              "h1": {"coord": {"x": 245,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 345,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 295,"y": 938}},\r
              "h1": {"coord": {"x": 245,"y": 938}, "use": false},\r
              "h2": {"coord": {"x": 295,"y": 984}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 213,"y": 1020}},\r
              "h1": {"coord": {"x": 259,"y": 1020}},\r
              "h2": {"coord": {"x": 263,"y": 1020}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1020}},\r
              "h1": {"coord": {"x": -5,"y": 1020}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1020}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1015}},\r
              "h1": {"coord": {"x": 40,"y": 1018}},\r
              "h2": {"coord": {"x": 90,"y": 1015}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 860}},\r
              "h1": {"coord": {"x": -10,"y": 860}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 857}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": 5,\r
          "pathPoints": [\r
            {\r
              "type": "flat",\r
              "p": {"coord": {"x": 92,"y": 1187}},\r
              "h1": {"coord": {"x": 69,"y": 1204}},\r
              "h2": {"coord": {"x": 112.10440353665814,"y": 1172.1402234729048}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 171,"y": 1164}},\r
              "h1": {"coord": {"x": 139,"y": 1164}},\r
              "h2": {"coord": {"x": 203,"y": 1164}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 250,"y": 1187}},\r
              "h1": {"coord": {"x": 230,"y": 1172}},\r
              "h2": {"coord": {"x": 273,"y": 1204}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 286,"y": 1261}},\r
              "h1": {"coord": {"x": 286,"y": 1230}},\r
              "h2": {"coord": {"x": 286,"y": 1325}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 171,"y": 1377}},\r
              "h1": {"coord": {"x": 234,"y": 1377}},\r
              "h2": {"coord": {"x": 108,"y": 1377}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 56,"y": 1261}},\r
              "h1": {"coord": {"x": 56,"y": 1325}},\r
              "h2": {"coord": {"x": 56,"y": 1230}}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x6A": {\r
      "id": "glyph-0x6A",\r
      "advanceWidth": 300,\r
      "shapes": [\r
        {\r
          "name": "Path 1",\r
          "winding": 5,\r
          "pathPoints": [\r
            {\r
              "type": "flat",\r
              "p": {"coord": {"x": 57,"y": 1187}},\r
              "h1": {"coord": {"x": 34,"y": 1204}},\r
              "h2": {"coord": {"x": 77.10440353665814,"y": 1172.1402234729048}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 136,"y": 1165}},\r
              "h1": {"coord": {"x": 104,"y": 1165}},\r
              "h2": {"coord": {"x": 168,"y": 1165}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 215,"y": 1187}},\r
              "h1": {"coord": {"x": 195,"y": 1172}},\r
              "h2": {"coord": {"x": 238,"y": 1204}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 251,"y": 1261}},\r
              "h1": {"coord": {"x": 251,"y": 1230}},\r
              "h2": {"coord": {"x": 251,"y": 1325}}\r
            },\r
            {\r
              "type": "symmetric",\r
              "p": {"coord": {"x": 136,"y": 1378}},\r
              "h1": {"coord": {"x": 199,"y": 1378}},\r
              "h2": {"coord": {"x": 73,"y": 1378}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 21,"y": 1261}},\r
              "h1": {"coord": {"x": 21,"y": 1325}},\r
              "h2": {"coord": {"x": 21,"y": 1230}}\r
            }\r
          ]\r
        },\r
        {\r
          "name": "Path 2",\r
          "winding": 7,\r
          "pathPoints": [\r
            {\r
              "type": "flat",\r
              "p": {"coord": {"x": -322,"y": -419}},\r
              "h1": {"coord": {"x": -340,"y": -415}},\r
              "h2": {"coord": {"x": -255,"y": -434}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": -123,"y": -436}},\r
              "h1": {"coord": {"x": -150,"y": -436}},\r
              "h2": {"coord": {"x": 255,"y": -436}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 260,"y": -1}},\r
              "h1": {"coord": {"x": 260,"y": -151}},\r
              "h2": {"coord": {"x": 310,"y": -1}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 260,"y": 938}},\r
              "h1": {"coord": {"x": 210,"y": 938}, "use": false},\r
              "h2": {"coord": {"x": 260,"y": 984}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 178,"y": 1020}},\r
              "h1": {"coord": {"x": 224,"y": 1020}},\r
              "h2": {"coord": {"x": 228,"y": 1020}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 10,"y": 1020}},\r
              "h1": {"coord": {"x": -40,"y": 1020}, "use": false},\r
              "h2": {"coord": {"x": 7,"y": 1020}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 5,"y": 1015}},\r
              "h1": {"coord": {"x": 5,"y": 1018}},\r
              "h2": {"coord": {"x": 55,"y": 1015}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 5,"y": 861}},\r
              "h1": {"coord": {"x": -45,"y": 861}, "use": false},\r
              "h2": {"coord": {"x": 5,"y": 858}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 10,"y": 856}},\r
              "h1": {"coord": {"x": 7,"y": 856}},\r
              "h2": {"coord": {"x": 60,"y": 856}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 95,"y": 856}},\r
              "h1": {"coord": {"x": 45,"y": 856}, "use": false},\r
              "h2": {"coord": {"x": 145,"y": 856}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 95,"y": -37}},\r
              "h1": {"coord": {"x": 45,"y": -37}, "use": false},\r
              "h2": {"coord": {"x": 95,"y": -213}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": -123,"y": -265}},\r
              "h1": {"coord": {"x": 23,"y": -265}},\r
              "h2": {"coord": {"x": -177,"y": -265}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": -280,"y": -253}},\r
              "h1": {"coord": {"x": -236,"y": -259}},\r
              "h2": {"coord": {"x": -293,"y": -251}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": -305,"y": -269}},\r
              "h1": {"coord": {"x": -301,"y": -252}},\r
              "h2": {"coord": {"x": -255,"y": -269}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": -305,"y": -269}},\r
              "h1": {"coord": {"x": -355,"y": -269}, "use": false},\r
              "h2": {"coord": {"x": -255,"y": -269}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": -305,"y": -269}},\r
              "h1": {"coord": {"x": -355,"y": -269}, "use": false},\r
              "h2": {"coord": {"x": -255,"y": -269}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": -339,"y": -392}},\r
              "h1": {"coord": {"x": -389,"y": -392}, "use": false},\r
              "h2": {"coord": {"x": -342,"y": -406}}\r
            }\r
          ]\r
        }\r
      ]\r
    },\r
    "glyph-0x6B": {\r
      "id": "glyph-0x6B",\r
      "advanceWidth": 846,\r
      "shapes": [\r
        {\r
          "name": "Path 1",\r
          "winding": 16,\r
          "pathPoints": [\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 165}},\r
              "h1": {"coord": {"x": -5,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 165}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 160}},\r
              "h1": {"coord": {"x": 40,"y": 163}},\r
              "h2": {"coord": {"x": 90,"y": 160}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 5}},\r
              "h1": {"coord": {"x": -10,"y": 5}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 2}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 0}},\r
              "h1": {"coord": {"x": 42,"y": 0}},\r
              "h2": {"coord": {"x": 95,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 381,"y": 0}},\r
              "h1": {"coord": {"x": 331,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 384,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 386,"y": 5}},\r
              "h1": {"coord": {"x": 386,"y": 2}},\r
              "h2": {"coord": {"x": 436,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 386,"y": 160}},\r
              "h1": {"coord": {"x": 336,"y": 160}, "use": false},\r
              "h2": {"coord": {"x": 386,"y": 163}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 381,"y": 165}},\r
              "h1": {"coord": {"x": 384,"y": 165}},\r
              "h2": {"coord": {"x": 431,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 296,"y": 165}},\r
              "h1": {"coord": {"x": 246,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 346,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 296,"y": 524}},\r
              "h1": {"coord": {"x": 246,"y": 524}, "use": false},\r
              "h2": {"coord": {"x": 346,"y": 524}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 312,"y": 540}},\r
              "h1": {"coord": {"x": 262,"y": 540}, "use": false},\r
              "h2": {"coord": {"x": 400,"y": 394}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 623,"y": 26}},\r
              "h1": {"coord": {"x": 613,"y": 40}},\r
              "h2": {"coord": {"x": 636,"y": 8}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 685,"y": 0}},\r
              "h1": {"coord": {"x": 662,"y": 0}},\r
              "h2": {"coord": {"x": 735,"y": 0}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 801,"y": 0}},\r
              "h1": {"coord": {"x": 751,"y": 0}, "use": false},\r
              "h2": {"coord": {"x": 804,"y": 0}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 806,"y": 5}},\r
              "h1": {"coord": {"x": 806,"y": 2}},\r
              "h2": {"coord": {"x": 856,"y": 5}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 806,"y": 160}},\r
              "h1": {"coord": {"x": 756,"y": 160}, "use": false},\r
              "h2": {"coord": {"x": 806,"y": 163}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 801,"y": 165}},\r
              "h1": {"coord": {"x": 804,"y": 165}},\r
              "h2": {"coord": {"x": 851,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 726,"y": 165}},\r
              "h1": {"coord": {"x": 676,"y": 165}, "use": false},\r
              "h2": {"coord": {"x": 776,"y": 165}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 425,"y": 650}},\r
              "h1": {"coord": {"x": 375,"y": 650}, "use": false},\r
              "h2": {"coord": {"x": 475,"y": 650}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 634,"y": 854}},\r
              "h1": {"coord": {"x": 584,"y": 854}, "use": false},\r
              "h2": {"coord": {"x": 684,"y": 854}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 801,"y": 854}},\r
              "h1": {"coord": {"x": 751,"y": 854}, "use": false},\r
              "h2": {"coord": {"x": 804,"y": 854}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 806,"y": 859}},\r
              "h1": {"coord": {"x": 806,"y": 856}},\r
              "h2": {"coord": {"x": 856,"y": 859}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 806,"y": 1014}},\r
              "h1": {"coord": {"x": 756,"y": 1014}, "use": false},\r
              "h2": {"coord": {"x": 806,"y": 1017}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 801,"y": 1019}},\r
              "h1": {"coord": {"x": 804,"y": 1019}},\r
              "h2": {"coord": {"x": 851,"y": 1019}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 632,"y": 1019}},\r
              "h1": {"coord": {"x": 582,"y": 1019}, "use": false},\r
              "h2": {"coord": {"x": 609,"y": 1019}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 574,"y": 995}},\r
              "h1": {"coord": {"x": 589,"y": 1010}},\r
              "h2": {"coord": {"x": 562,"y": 983}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 296,"y": 724}},\r
              "h1": {"coord": {"x": 376,"y": 802}},\r
              "h2": {"coord": {"x": 346,"y": 724}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 296,"y": 1407}},\r
              "h1": {"coord": {"x": 246,"y": 1407}, "use": false},\r
              "h2": {"coord": {"x": 296,"y": 1453}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 213,"y": 1490}},\r
              "h1": {"coord": {"x": 259,"y": 1490}},\r
              "h2": {"coord": {"x": 263,"y": 1490}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1490}},\r
              "h1": {"coord": {"x": -5,"y": 1490}, "use": false},\r
              "h2": {"coord": {"x": 42,"y": 1490}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1485}},\r
              "h1": {"coord": {"x": 40,"y": 1488}},\r
              "h2": {"coord": {"x": 90,"y": 1485}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 40,"y": 1330}},\r
              "h1": {"coord": {"x": -10,"y": 1330}, "use": false},\r
              "h2": {"coord": {"x": 40,"y": 1327}}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 45,"y": 1325}},\r
              "h1": {"coord": {"x": 42,"y": 1325}},\r
              "h2": {"coord": {"x": 95,"y": 1325}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": 1325}},\r
              "h1": {"coord": {"x": 80,"y": 1325}, "use": false},\r
              "h2": {"coord": {"x": 180,"y": 1325}, "use": false}\r
            },\r
            {\r
              "type": "corner",\r
              "p": {"coord": {"x": 130,"y": 165}},\r
              "h1": {"coord": {"x": 80,"y": 165}, "use": false},\r
            }\r
          ]\r
        }\r
  }\r