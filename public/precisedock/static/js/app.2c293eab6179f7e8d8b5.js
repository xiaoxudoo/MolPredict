webpackJsonp([22,20],{0:function(n,t,e){"use strict";function r(n){return n&&n.__esModule?n:{default:n}}var i=e(286),u=r(i),a=e(252),o=r(a),c=e(284),l=r(c),f=e(209),p=r(f),d=e(293),s=r(d),m=e(292),v=r(m),h=e(296);(0,u.default)(h).forEach(function(n){o.default.filter(n,h[n])}),o.default.use(l.default),o.default.use(s.default),o.default.use(v.default);var b=new l.default({mode:"hash",routes:[{name:"index",path:"/",component:function(n){return e.e(0,function(t){var e=[t(219)];n.apply(null,e)}.bind(this))}},{name:"product",path:"/product",component:function(n){return e.e(4,function(t){var e=[t(222)];n.apply(null,e)}.bind(this))},redirect:"/product/virtualscreen",children:[{path:"virtualscreen",component:function(n){return e.e(8,function(t){var e=[t(229)];n.apply(null,e)}.bind(this))}},{path:"md",component:function(n){return e.e(13,function(t){var e=[t(224)];n.apply(null,e)}.bind(this))}},{path:"dock",component:function(n){return e.e(15,function(t){var e=[t(223)];n.apply(null,e)}.bind(this))}},{path:"pharmacophore",component:function(n){return e.e(12,function(t){var e=[t(226)];n.apply(null,e)}.bind(this))}},{path:"modeling",component:function(n){return e.e(19,function(t){var e=[t(225)];n.apply(null,e)}.bind(this))}},{path:"training",component:function(n){return e.e(10,function(t){var e=[t(228)];n.apply(null,e)}.bind(this))}},{path:"platform",component:function(n){return e.e(11,function(t){var e=[t(227)];n.apply(null,e)}.bind(this))}}]},{name:"custom",path:"/custom",component:function(n){return e.e(3,function(t){var e=[t(216)];n.apply(null,e)}.bind(this))},redirect:"/custom/cooperation",children:[{path:"cooperation",component:function(n){return e.e(1,function(t){var e=[t(218)];n.apply(null,e)}.bind(this))}},{path:"case",component:function(n){return e.e(9,function(t){var e=[t(217)];n.apply(null,e)}.bind(this))}}]},{name:"news",path:"/news",component:function(n){return e.e(5,function(t){var e=[t(220)];n.apply(null,e)}.bind(this))}},{name:"newsdetail",path:"/news/:id",component:function(n){return e.e(2,function(t){var e=[t(221)];n.apply(null,e)}.bind(this))}},{name:"abouts",path:"/abouts",component:function(n){return e.e(6,function(t){var e=[t(210)];n.apply(null,e)}.bind(this))},redirect:"/abouts/company",children:[{path:"company",component:function(n){return e.e(17,function(t){var e=[t(211)];n.apply(null,e)}.bind(this))}},{path:"culture",component:function(n){return e.e(16,function(t){var e=[t(213)];n.apply(null,e)}.bind(this))}},{path:"join",component:function(n){return e.e(14,function(t){var e=[t(215)];n.apply(null,e)}.bind(this))}},{path:"contact",component:function(n){return e.e(7,function(t){var e=[t(212)];n.apply(null,e)}.bind(this))}},{path:"faq",component:function(n){return e.e(18,function(t){var e=[t(214)];n.apply(null,e)}.bind(this))}}]}]});b.beforeEach(function(n,t,e){window.scrollTo(0,0),e()}),b.afterEach(function(n,t,e){});new o.default({el:"#app",router:b,render:function(n){return n(p.default)}})},197:function(n,t){},209:function(n,t,e){e(197);var r=e(1)(e(297),e(239),null,null);n.exports=r.exports},239:function(n,t){n.exports={render:function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{directives:[{name:"bd-statistic",rawName:"v-bd-statistic"}],attrs:{id:"appBody"}},[e("keep-alive",[e("router-view")],1)],1)},staticRenderFns:[]}},292:function(n,t){"use strict";n.exports=function(n){n.directive("bd-statistic",{bind:function(){var n=document.createElement("script");n.src="//hm.baidu.com/hm.js?70dd77fbe247aa71fd61c99fd02b6e34";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(n,t)}})}},293:function(n,t){"use strict";n.exports=function(n){function t(n,t){var r=t.arg||"src";"img"===n.tagName.toLowerCase()&&t.value?t.value.indexOf("data:image")<0?n.setAttribute(r,e?t.value+".webp":t.value):n.setAttribute(r,t.value):t.modifiers.back&&t.value&&(t.value.indexOf("data:image")<0?n.style.backgroundImage=e?"url("+t.value+".webp)":"url("+t.value+")":n.style.backgroundImage="url("+t.value+")")}var e="webp"==document.documentElement.getAttribute("data-ext"),r="2"===n.version.split(".")[0];r?n.directive("webp",{bind:function(n,e){t(n,{arg:e.arg,modifiers:e.modifiers,value:e.value})}}):n.directive("webp",{bind:function(){},update:function(n,e){t(this.el,{arg:this.arg,value:n})},unbind:function(){}})}},294:function(n,t,e){function r(n){return n&&n.__esModule?n:{default:n}}var i,u,a=e(289),o=r(a),c=e(285),l=r(c);!function(){function e(n,t,e){void 0!=n&&void 0!=t&&("string"!=typeof t&&(t=(0,l.default)(t)),e&&(t=d(t,e)),s&&s.setItem(n,t))}function r(n,t){if(!n||!s)return null;var e=s.getItem(n);return"string"==t?e:JSON.parse(e)}function a(n){n&&s&&s.removeItem(n)}function c(){s&&s.clear()}function f(n){return void 0==n?"":("string"!=typeof n&&(n=(0,l.default)(n)),md5?md5(n):"")}function p(n,t,e){var i=r(n);e&&(i=d(i,e),t=d(t,e));var u=f(i),a=f(t);return u!=a}function d(n,t,e){if(!n)return"";if("string"!=typeof n&&(n=(0,l.default)(n)),!t)return n;t instanceof Array||(t=[t]);for(var r,i=n,u=t.length,a=0;a<u;a++)if(r=t[a],"object"==("undefined"==typeof r?"undefined":(0,o.default)(r))){var c=r.reg,f=r.replacement;c instanceof RegExp||(c=new RegExp(c,"gm")),void 0==f&&(f=""),i=i.replace(c,function(n,t){var e=f;return"string"==typeof t&&(e=n.replace(t,f)),e})}return"object"==e&&(i=JSON.parse(i)),i}var s=window.localStorage,m={get:r,set:e,remove:a,clear:c,isChanged:p,filter:d};i=[],u=function(){return m}.apply(t,i),!(void 0!==u&&(n.exports=u))}()},295:function(n,t,e){"use strict";var r={};n.exports=r},296:function(n,t,e){(function(n,r){"use strict";function i(n){return"￥"+(n/100).toFixed(2)}function u(t){return date=parseInt(date),n(t).format("YYYY-MM-DD")}function a(t){return t=parseInt(t),n(t).format("YYYY-MM-DD")}function o(n,t){var e=r.get("config")&&r.get("config").cdn_domains||l.cdn_domains;return n?1==t?""+e.image+n:void 0:""}function c(n){switch(n){case f:return"申请下架";case p:case d:case s:case m:return"中止审核";default:return""}}Object.defineProperty(t,"__esModule",{value:!0}),t.filterPrice=i,t.filterTime=u,t.filterDate=a,t.filterCdnDomain=o,t.mapStatusToManual=c;var l=e(295),f="ONLINE",p="PUT_ONLINE_VERIFYING",d="PUT_OFFLINE_VERIFYING",s="UPDATE_APK_VERIFYING",m="UPDATE_INFO_VERIFYING"}).call(t,e(251),e(294))},297:function(n,t){"use strict";n.exports={data:function(){return{}},components:{},created:function(){},directives:{}}}});
//# sourceMappingURL=app.2c293eab6179f7e8d8b5.js.map