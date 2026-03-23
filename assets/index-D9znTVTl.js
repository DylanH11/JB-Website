(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();const d=document.getElementById("cur"),a=document.getElementById("curR");document.addEventListener("mousemove",e=>{d.style.left=a.style.left=e.clientX+"px",d.style.top=a.style.top=e.clientY+"px"});document.querySelectorAll("a,button,.gc,.tier").forEach(e=>{e.addEventListener("mouseenter",()=>{d.style.width=d.style.height="20px",a.style.width=a.style.height="52px"}),e.addEventListener("mouseleave",()=>{d.style.width=d.style.height="10px",a.style.width=a.style.height="36px"})});window.addEventListener("scroll",()=>document.getElementById("nav").classList.toggle("sc",scrollY>60));const w=new IntersectionObserver(e=>e.forEach(t=>{t.isIntersecting&&t.target.classList.add("vis")}),{threshold:.1});document.querySelectorAll(".fu").forEach(e=>w.observe(e));const I="YOUR_FORM_ID";function g(e){return fetch(`https://formspree.io/f/${I}`,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(e)})}function B(e){const t=document.querySelector(".form-err");t&&t.remove();const s=document.createElement("p");return s.className="form-err",s.textContent=e,s.style.cssText="font-size:.82rem;color:#9b3d2a;margin-top:.6rem;",s}let p={};function x(e,t){p={title:e,desc:t},document.getElementById("mo-body").innerHTML=S(e,t),document.getElementById("mb").classList.add("open"),document.body.style.overflow="hidden"}function f(){document.getElementById("mb").classList.remove("open"),document.body.style.overflow=""}document.getElementById("mb").addEventListener("click",e=>{e.target===document.getElementById("mb")&&f()});document.addEventListener("keydown",e=>{e.key==="Escape"&&f()});function S(e,t){return`
  <p class="mo-tag">Enquire about this piece</p>
  <h3 class="mo-name">${e}</h3>
  <p class="mo-desc" style="margin-bottom:1.8rem">${t}</p>
  <div class="mo-div"></div>
  <p style="font-size:.82rem;color:var(--mid);line-height:1.7;margin-bottom:1.5rem">
    Tell me which format you'd like, any size preference, and I'll come back to you with availability and pricing.
  </p>
  <label class="ml">Your Name</label>
  <input type="text" class="mi" placeholder="Full name" id="m-n"/>
  <label class="ml">Email Address</label>
  <input type="email" class="mi" placeholder="your@email.com" id="m-e"/>
  <label class="ml">What are you interested in?</label>
  <select class="mi" id="m-t" style="appearance:none;cursor:pointer">
    <option value="" disabled selected>Select…</option>
    <option>Print of this piece</option>
    <option>Original artwork</option>
    <option>Not sure — tell me more</option>
  </select>
  <label class="ml">Preferred size (optional)</label>
  <input type="text" class="mi" placeholder="e.g. A3, 50×70cm" id="m-s"/>
  <label class="ml">Anything else?</label>
  <textarea class="mta" placeholder="Any questions, colour preferences, gifting notes…" id="m-msg" style="min-height:80px"></textarea>
  <button class="btn-pay" onclick="pay()">Send enquiry</button>`}async function L(){var i,c,m,u,y;const e=(i=document.getElementById("m-n"))==null?void 0:i.value.trim(),t=(c=document.getElementById("m-e"))==null?void 0:c.value.trim(),s=(m=document.getElementById("m-t"))==null?void 0:m.value,l=(u=document.getElementById("m-s"))==null?void 0:u.value.trim(),n=(y=document.getElementById("m-msg"))==null?void 0:y.value.trim();if(!e||!t){const r=document.querySelector("#mo-body .btn-pay");r==null||r.parentNode.insertBefore(B("Please enter your name and email."),r);return}const o=document.querySelector("#mo-body .btn-pay");o&&(o.disabled=!0,o.textContent="Sending…");try{await g({name:e,email:t,piece:p.title,format:s||"",size:l,message:n,_subject:`Gallery Enquiry: ${p.title} — JB Designs`})}catch(r){console.warn("Form submission error:",r)}document.getElementById("mo-body").innerHTML=`
  <div class="mo-ok">
    <div class="ok-mark">✦</div>
    <div class="ok-title">Enquiry sent!</div>
    <p class="ok-body">
      Thanks ${e}! I've received your enquiry about <em>${p.title}</em> and will be in touch
      at <strong>${t}</strong> with pricing and availability.
    </p>
    <button class="btn-pay" style="margin-top:2rem;width:auto;padding:.9rem 2rem" onclick="closeM()">Close</button>
  </div>`}async function O(){var m,u,y,r,b,h,v;const e=(m=document.getElementById("co-name"))==null?void 0:m.value.trim(),t=(u=document.getElementById("co-email"))==null?void 0:u.value.trim(),s=(y=document.getElementById("co-desc"))==null?void 0:y.value.trim(),l=(r=document.getElementById("co-type"))==null?void 0:r.value,n=(b=document.getElementById("co-size"))==null?void 0:b.value.trim(),o=(h=document.getElementById("co-budget"))==null?void 0:h.value.trim(),i=(v=document.getElementById("co-date"))==null?void 0:v.value;if(!e||!t||!s){alert("Please fill in your name, email and description.");return}const c=document.querySelector('[onclick="sendCustomOrder()"]');c.disabled=!0,c.textContent="Sending…";try{await g({name:e,email:t,orderType:l||"",description:s,size:n,budget:o,deadline:i,_subject:"Custom Order Enquiry — JB Designs"})}catch(E){console.warn("Form submission error:",E)}document.getElementById("co-ok").style.display="block",c.textContent="Sent ✦"}async function q(){const e=document.getElementById("cf-n").value.trim(),t=document.getElementById("cf-e").value.trim(),s=document.getElementById("cf-s").value.trim(),l=document.getElementById("cf-m").value.trim();if(!e||!t||!l){alert("Please fill in all fields.");return}const n=document.querySelector("#contact .btn-send");n.disabled=!0,n.textContent="Sending…";try{await g({name:e,email:t,subject:s,message:l,_subject:`Contact: ${s||"General enquiry"} — JB Designs`})}catch(o){console.warn("Form submission error:",o)}document.getElementById("cf-ok").style.display="block",n.textContent="Sent ✦"}window.openModal=x;window.closeM=f;window.pay=L;window.sendCustomOrder=O;window.sendCF=q;
