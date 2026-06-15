(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,185793,e=>{"use strict";e.i(247167);var t=e.i(271645),r=e.i(343794),a=e.i(242064),i=e.i(529681);let n=e=>{let{prefixCls:a,className:i,style:n,size:o,shape:l}=e,s=(0,r.default)({[`${a}-lg`]:"large"===o,[`${a}-sm`]:"small"===o}),d=(0,r.default)({[`${a}-circle`]:"circle"===l,[`${a}-square`]:"square"===l,[`${a}-round`]:"round"===l}),c=t.useMemo(()=>"number"==typeof o?{width:o,height:o,lineHeight:`${o}px`}:{},[o]);return t.createElement("span",{className:(0,r.default)(a,s,d,i),style:Object.assign(Object.assign({},c),n)})};e.i(296059);var o=e.i(694758),l=e.i(915654),s=e.i(246422),d=e.i(838378);let c=new o.Keyframes("ant-skeleton-loading",{"0%":{backgroundPosition:"100% 50%"},"100%":{backgroundPosition:"0 50%"}}),m=e=>({height:e,lineHeight:(0,l.unit)(e)}),u=e=>Object.assign({width:e},m(e)),g=(e,t)=>Object.assign({width:t(e).mul(5).equal(),minWidth:t(e).mul(5).equal()},m(e)),p=e=>Object.assign({width:e},m(e)),f=(e,t,r)=>{let{skeletonButtonCls:a}=e;return{[`${r}${a}-circle`]:{width:t,minWidth:t,borderRadius:"50%"},[`${r}${a}-round`]:{borderRadius:t}}},h=(e,t)=>Object.assign({width:t(e).mul(2).equal(),minWidth:t(e).mul(2).equal()},m(e)),b=(0,s.genStyleHooks)("Skeleton",e=>{let{componentCls:t,calc:r}=e;return(e=>{let{componentCls:t,skeletonAvatarCls:r,skeletonTitleCls:a,skeletonParagraphCls:i,skeletonButtonCls:n,skeletonInputCls:o,skeletonImageCls:l,controlHeight:s,controlHeightLG:d,controlHeightSM:m,gradientFromColor:b,padding:_,marginSM:v,borderRadius:w,titleHeight:x,blockRadius:k,paragraphLiHeight:y,controlHeightXS:C,paragraphMarginTop:O}=e;return{[t]:{display:"table",width:"100%",[`${t}-header`]:{display:"table-cell",paddingInlineEnd:_,verticalAlign:"top",[r]:Object.assign({display:"inline-block",verticalAlign:"top",background:b},u(s)),[`${r}-circle`]:{borderRadius:"50%"},[`${r}-lg`]:Object.assign({},u(d)),[`${r}-sm`]:Object.assign({},u(m))},[`${t}-content`]:{display:"table-cell",width:"100%",verticalAlign:"top",[a]:{width:"100%",height:x,background:b,borderRadius:k,[`+ ${i}`]:{marginBlockStart:m}},[i]:{padding:0,"> li":{width:"100%",height:y,listStyle:"none",background:b,borderRadius:k,"+ li":{marginBlockStart:C}}},[`${i}> li:last-child:not(:first-child):not(:nth-child(2))`]:{width:"61%"}},[`&-round ${t}-content`]:{[`${a}, ${i} > li`]:{borderRadius:w}}},[`${t}-with-avatar ${t}-content`]:{[a]:{marginBlockStart:v,[`+ ${i}`]:{marginBlockStart:O}}},[`${t}${t}-element`]:Object.assign(Object.assign(Object.assign(Object.assign({display:"inline-block",width:"auto"},(e=>{let{borderRadiusSM:t,skeletonButtonCls:r,controlHeight:a,controlHeightLG:i,controlHeightSM:n,gradientFromColor:o,calc:l}=e;return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({[r]:Object.assign({display:"inline-block",verticalAlign:"top",background:o,borderRadius:t,width:l(a).mul(2).equal(),minWidth:l(a).mul(2).equal()},h(a,l))},f(e,a,r)),{[`${r}-lg`]:Object.assign({},h(i,l))}),f(e,i,`${r}-lg`)),{[`${r}-sm`]:Object.assign({},h(n,l))}),f(e,n,`${r}-sm`))})(e)),(e=>{let{skeletonAvatarCls:t,gradientFromColor:r,controlHeight:a,controlHeightLG:i,controlHeightSM:n}=e;return{[t]:Object.assign({display:"inline-block",verticalAlign:"top",background:r},u(a)),[`${t}${t}-circle`]:{borderRadius:"50%"},[`${t}${t}-lg`]:Object.assign({},u(i)),[`${t}${t}-sm`]:Object.assign({},u(n))}})(e)),(e=>{let{controlHeight:t,borderRadiusSM:r,skeletonInputCls:a,controlHeightLG:i,controlHeightSM:n,gradientFromColor:o,calc:l}=e;return{[a]:Object.assign({display:"inline-block",verticalAlign:"top",background:o,borderRadius:r},g(t,l)),[`${a}-lg`]:Object.assign({},g(i,l)),[`${a}-sm`]:Object.assign({},g(n,l))}})(e)),(e=>{let{skeletonImageCls:t,imageSizeBase:r,gradientFromColor:a,borderRadiusSM:i,calc:n}=e;return{[t]:Object.assign(Object.assign({display:"inline-flex",alignItems:"center",justifyContent:"center",verticalAlign:"middle",background:a,borderRadius:i},p(n(r).mul(2).equal())),{[`${t}-path`]:{fill:"#bfbfbf"},[`${t}-svg`]:Object.assign(Object.assign({},p(r)),{maxWidth:n(r).mul(4).equal(),maxHeight:n(r).mul(4).equal()}),[`${t}-svg${t}-svg-circle`]:{borderRadius:"50%"}}),[`${t}${t}-circle`]:{borderRadius:"50%"}}})(e)),[`${t}${t}-block`]:{width:"100%",[n]:{width:"100%"},[o]:{width:"100%"}},[`${t}${t}-active`]:{[`
        ${a},
        ${i} > li,
        ${r},
        ${n},
        ${o},
        ${l}
      `]:Object.assign({},{background:e.skeletonLoadingBackground,backgroundSize:"400% 100%",animationName:c,animationDuration:e.skeletonLoadingMotionDuration,animationTimingFunction:"ease",animationIterationCount:"infinite"})}}})((0,d.mergeToken)(e,{skeletonAvatarCls:`${t}-avatar`,skeletonTitleCls:`${t}-title`,skeletonParagraphCls:`${t}-paragraph`,skeletonButtonCls:`${t}-button`,skeletonInputCls:`${t}-input`,skeletonImageCls:`${t}-image`,imageSizeBase:r(e.controlHeight).mul(1.5).equal(),borderRadius:100,skeletonLoadingBackground:`linear-gradient(90deg, ${e.gradientFromColor} 25%, ${e.gradientToColor} 37%, ${e.gradientFromColor} 63%)`,skeletonLoadingMotionDuration:"1.4s"}))},e=>{let{colorFillContent:t,colorFill:r}=e;return{color:t,colorGradientEnd:r,gradientFromColor:t,gradientToColor:r,titleHeight:e.controlHeight/2,blockRadius:e.borderRadiusSM,paragraphMarginTop:e.marginLG+e.marginXXS,paragraphLiHeight:e.controlHeight/2}},{deprecatedTokens:[["color","gradientFromColor"],["colorGradientEnd","gradientToColor"]]}),_=e=>{let{prefixCls:a,className:i,style:n,rows:o=0}=e,l=Array.from({length:o}).map((r,a)=>t.createElement("li",{key:a,style:{width:((e,t)=>{let{width:r,rows:a=2}=t;return Array.isArray(r)?r[e]:a-1===e?r:void 0})(a,e)}}));return t.createElement("ul",{className:(0,r.default)(a,i),style:n},l)},v=({prefixCls:e,className:a,width:i,style:n})=>t.createElement("h3",{className:(0,r.default)(e,a),style:Object.assign({width:i},n)});function w(e){return e&&"object"==typeof e?e:{}}let x=e=>{let{prefixCls:i,loading:o,className:l,rootClassName:s,style:d,children:c,avatar:m=!1,title:u=!0,paragraph:g=!0,active:p,round:f}=e,{getPrefixCls:h,direction:x,className:k,style:y}=(0,a.useComponentConfig)("skeleton"),C=h("skeleton",i),[O,E,j]=b(C);if(o||!("loading"in e)){let e,a,i=!!m,o=!!u,c=!!g;if(i){let r=Object.assign(Object.assign({prefixCls:`${C}-avatar`},o&&!c?{size:"large",shape:"square"}:{size:"large",shape:"circle"}),w(m));e=t.createElement("div",{className:`${C}-header`},t.createElement(n,Object.assign({},r)))}if(o||c){let e,r;if(o){let r=Object.assign(Object.assign({prefixCls:`${C}-title`},!i&&c?{width:"38%"}:i&&c?{width:"50%"}:{}),w(u));e=t.createElement(v,Object.assign({},r))}if(c){let e,a=Object.assign(Object.assign({prefixCls:`${C}-paragraph`},(e={},i&&o||(e.width="61%"),!i&&o?e.rows=3:e.rows=2,e)),w(g));r=t.createElement(_,Object.assign({},a))}a=t.createElement("div",{className:`${C}-content`},e,r)}let h=(0,r.default)(C,{[`${C}-with-avatar`]:i,[`${C}-active`]:p,[`${C}-rtl`]:"rtl"===x,[`${C}-round`]:f},k,l,s,E,j);return O(t.createElement("div",{className:h,style:Object.assign(Object.assign({},y),d)},e,a))}return null!=c?c:null};x.Button=e=>{let{prefixCls:o,className:l,rootClassName:s,active:d,block:c=!1,size:m="default"}=e,{getPrefixCls:u}=t.useContext(a.ConfigContext),g=u("skeleton",o),[p,f,h]=b(g),_=(0,i.default)(e,["prefixCls"]),v=(0,r.default)(g,`${g}-element`,{[`${g}-active`]:d,[`${g}-block`]:c},l,s,f,h);return p(t.createElement("div",{className:v},t.createElement(n,Object.assign({prefixCls:`${g}-button`,size:m},_))))},x.Avatar=e=>{let{prefixCls:o,className:l,rootClassName:s,active:d,shape:c="circle",size:m="default"}=e,{getPrefixCls:u}=t.useContext(a.ConfigContext),g=u("skeleton",o),[p,f,h]=b(g),_=(0,i.default)(e,["prefixCls","className"]),v=(0,r.default)(g,`${g}-element`,{[`${g}-active`]:d},l,s,f,h);return p(t.createElement("div",{className:v},t.createElement(n,Object.assign({prefixCls:`${g}-avatar`,shape:c,size:m},_))))},x.Input=e=>{let{prefixCls:o,className:l,rootClassName:s,active:d,block:c,size:m="default"}=e,{getPrefixCls:u}=t.useContext(a.ConfigContext),g=u("skeleton",o),[p,f,h]=b(g),_=(0,i.default)(e,["prefixCls"]),v=(0,r.default)(g,`${g}-element`,{[`${g}-active`]:d,[`${g}-block`]:c},l,s,f,h);return p(t.createElement("div",{className:v},t.createElement(n,Object.assign({prefixCls:`${g}-input`,size:m},_))))},x.Image=e=>{let{prefixCls:i,className:n,rootClassName:o,style:l,active:s}=e,{getPrefixCls:d}=t.useContext(a.ConfigContext),c=d("skeleton",i),[m,u,g]=b(c),p=(0,r.default)(c,`${c}-element`,{[`${c}-active`]:s},n,o,u,g);return m(t.createElement("div",{className:p},t.createElement("div",{className:(0,r.default)(`${c}-image`,n),style:l},t.createElement("svg",{viewBox:"0 0 1098 1024",xmlns:"http://www.w3.org/2000/svg",className:`${c}-image-svg`},t.createElement("title",null,"Image placeholder"),t.createElement("path",{d:"M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z",className:`${c}-image-path`})))))},x.Node=e=>{let{prefixCls:i,className:n,rootClassName:o,style:l,active:s,children:d}=e,{getPrefixCls:c}=t.useContext(a.ConfigContext),m=c("skeleton",i),[u,g,p]=b(m),f=(0,r.default)(m,`${m}-element`,{[`${m}-active`]:s},g,n,o,p);return u(t.createElement("div",{className:f},t.createElement("div",{className:(0,r.default)(`${m}-image`,n),style:l},d)))},e.s(["default",0,x],185793)},959013,e=>{"use strict";e.i(247167);var t=e.i(931067),r=e.i(271645);let a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"}},{tag:"path",attrs:{d:"M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"}}]},name:"plus",theme:"outlined"};var i=e.i(9583),n=r.forwardRef(function(e,n){return r.createElement(i.default,(0,t.default)({},e,{ref:n,icon:a}))});e.s(["default",0,n],959013)},389083,e=>{"use strict";var t=e.i(290571),r=e.i(271645),a=e.i(829087),i=e.i(480731),n=e.i(95779),o=e.i(444755),l=e.i(673706);let s={xs:{paddingX:"px-2",paddingY:"py-0.5",fontSize:"text-xs"},sm:{paddingX:"px-2.5",paddingY:"py-0.5",fontSize:"text-sm"},md:{paddingX:"px-3",paddingY:"py-0.5",fontSize:"text-md"},lg:{paddingX:"px-3.5",paddingY:"py-0.5",fontSize:"text-lg"},xl:{paddingX:"px-4",paddingY:"py-1",fontSize:"text-xl"}},d={xs:{height:"h-4",width:"w-4"},sm:{height:"h-4",width:"w-4"},md:{height:"h-4",width:"w-4"},lg:{height:"h-5",width:"w-5"},xl:{height:"h-6",width:"w-6"}},c=(0,l.makeClassName)("Badge"),m=r.default.forwardRef((e,m)=>{let{color:u,icon:g,size:p=i.Sizes.SM,tooltip:f,className:h,children:b}=e,_=(0,t.__rest)(e,["color","icon","size","tooltip","className","children"]),v=g||null,{tooltipProps:w,getReferenceProps:x}=(0,a.useTooltip)();return r.default.createElement("span",Object.assign({ref:(0,l.mergeRefs)([m,w.refs.setReference]),className:(0,o.tremorTwMerge)(c("root"),"w-max shrink-0 inline-flex justify-center items-center cursor-default rounded-tremor-small ring-1 ring-inset",u?(0,o.tremorTwMerge)((0,l.getColorClassNames)(u,n.colorPalette.background).bgColor,(0,l.getColorClassNames)(u,n.colorPalette.iconText).textColor,(0,l.getColorClassNames)(u,n.colorPalette.iconRing).ringColor,"bg-opacity-10 ring-opacity-20","dark:bg-opacity-5 dark:ring-opacity-60"):(0,o.tremorTwMerge)("bg-tremor-brand-faint text-tremor-brand-emphasis ring-tremor-brand/20","dark:bg-dark-tremor-brand-muted/50 dark:text-dark-tremor-brand dark:ring-dark-tremor-subtle/20"),s[p].paddingX,s[p].paddingY,s[p].fontSize,h)},x,_),r.default.createElement(a.default,Object.assign({text:f},w)),v?r.default.createElement(v,{className:(0,o.tremorTwMerge)(c("icon"),"shrink-0 -ml-1 mr-1.5",d[p].height,d[p].width)}):null,r.default.createElement("span",{className:(0,o.tremorTwMerge)(c("text"),"whitespace-nowrap")},b))});m.displayName="Badge",e.s(["Badge",0,m],389083)},269200,e=>{"use strict";var t=e.i(290571),r=e.i(271645),a=e.i(444755);let i=(0,e.i(673706).makeClassName)("Table"),n=r.default.forwardRef((e,n)=>{let{children:o,className:l}=e,s=(0,t.__rest)(e,["children","className"]);return r.default.createElement("div",{className:(0,a.tremorTwMerge)(i("root"),"overflow-auto",l)},r.default.createElement("table",Object.assign({ref:n,className:(0,a.tremorTwMerge)(i("table"),"w-full text-tremor-default","text-tremor-content","dark:text-dark-tremor-content")},s),o))});n.displayName="Table",e.s(["Table",0,n],269200)},942232,e=>{"use strict";var t=e.i(290571),r=e.i(271645),a=e.i(444755);let i=(0,e.i(673706).makeClassName)("TableBody"),n=r.default.forwardRef((e,n)=>{let{children:o,className:l}=e,s=(0,t.__rest)(e,["children","className"]);return r.default.createElement(r.default.Fragment,null,r.default.createElement("tbody",Object.assign({ref:n,className:(0,a.tremorTwMerge)(i("root"),"align-top divide-y","divide-tremor-border","dark:divide-dark-tremor-border",l)},s),o))});n.displayName="TableBody",e.s(["TableBody",0,n],942232)},977572,e=>{"use strict";var t=e.i(290571),r=e.i(271645),a=e.i(444755);let i=(0,e.i(673706).makeClassName)("TableCell"),n=r.default.forwardRef((e,n)=>{let{children:o,className:l}=e,s=(0,t.__rest)(e,["children","className"]);return r.default.createElement(r.default.Fragment,null,r.default.createElement("td",Object.assign({ref:n,className:(0,a.tremorTwMerge)(i("root"),"align-middle whitespace-nowrap text-left p-4",l)},s),o))});n.displayName="TableCell",e.s(["TableCell",0,n],977572)},427612,64848,e=>{"use strict";var t=e.i(290571),r=e.i(271645),a=e.i(444755),i=e.i(673706);let n=(0,i.makeClassName)("TableHead"),o=r.default.forwardRef((e,i)=>{let{children:o,className:l}=e,s=(0,t.__rest)(e,["children","className"]);return r.default.createElement(r.default.Fragment,null,r.default.createElement("thead",Object.assign({ref:i,className:(0,a.tremorTwMerge)(n("root"),"text-left","text-tremor-content","dark:text-dark-tremor-content",l)},s),o))});o.displayName="TableHead",e.s(["TableHead",0,o],427612);let l=(0,i.makeClassName)("TableHeaderCell"),s=r.default.forwardRef((e,i)=>{let{children:n,className:o}=e,s=(0,t.__rest)(e,["children","className"]);return r.default.createElement(r.default.Fragment,null,r.default.createElement("th",Object.assign({ref:i,className:(0,a.tremorTwMerge)(l("root"),"whitespace-nowrap text-left font-semibold top-0 px-4 py-3.5","text-tremor-content-strong","dark:text-dark-tremor-content-strong",o)},s),n))});s.displayName="TableHeaderCell",e.s(["TableHeaderCell",0,s],64848)},496020,e=>{"use strict";var t=e.i(290571),r=e.i(271645),a=e.i(444755);let i=(0,e.i(673706).makeClassName)("TableRow"),n=r.default.forwardRef((e,n)=>{let{children:o,className:l}=e,s=(0,t.__rest)(e,["children","className"]);return r.default.createElement(r.default.Fragment,null,r.default.createElement("tr",Object.assign({ref:n,className:(0,a.tremorTwMerge)(i("row"),l)},s),o))});n.displayName="TableRow",e.s(["TableRow",0,n],496020)},360820,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function(e,r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:r},e),t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5 15l7-7 7 7"}))});e.s(["ChevronUpIcon",0,r],360820)},871943,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function(e,r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:r},e),t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 9l-7 7-7-7"}))});e.s(["ChevronDownIcon",0,r],871943)},434626,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function(e,r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:r},e),t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"}))});e.s(["ExternalLinkIcon",0,r],434626)},991124,e=>{"use strict";let t=(0,e.i(475254).default)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);e.s(["default",0,t])},278587,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function(e,r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:r},e),t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"}))});e.s(["RefreshIcon",0,r],278587)},68155,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function(e,r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:r},e),t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"}))});e.s(["TrashIcon",0,r],68155)},752978,728889,e=>{"use strict";var t=e.i(290571),r=e.i(271645),a=e.i(829087),i=e.i(480731),n=e.i(444755),o=e.i(673706),l=e.i(95779);let s={xs:{paddingX:"px-1.5",paddingY:"py-1.5"},sm:{paddingX:"px-1.5",paddingY:"py-1.5"},md:{paddingX:"px-2",paddingY:"py-2"},lg:{paddingX:"px-2",paddingY:"py-2"},xl:{paddingX:"px-2.5",paddingY:"py-2.5"}},d={xs:{height:"h-3",width:"w-3"},sm:{height:"h-5",width:"w-5"},md:{height:"h-5",width:"w-5"},lg:{height:"h-7",width:"w-7"},xl:{height:"h-9",width:"w-9"}},c={simple:{rounded:"",border:"",ring:"",shadow:""},light:{rounded:"rounded-tremor-default",border:"",ring:"",shadow:""},shadow:{rounded:"rounded-tremor-default",border:"border",ring:"",shadow:"shadow-tremor-card dark:shadow-dark-tremor-card"},solid:{rounded:"rounded-tremor-default",border:"border-2",ring:"ring-1",shadow:""},outlined:{rounded:"rounded-tremor-default",border:"border",ring:"ring-2",shadow:""}},m=(0,o.makeClassName)("Icon"),u=r.default.forwardRef((e,u)=>{let{icon:g,variant:p="simple",tooltip:f,size:h=i.Sizes.SM,color:b,className:_}=e,v=(0,t.__rest)(e,["icon","variant","tooltip","size","color","className"]),w=((e,t)=>{switch(e){case"simple":return{textColor:t?(0,o.getColorClassNames)(t,l.colorPalette.text).textColor:"text-tremor-brand dark:text-dark-tremor-brand",bgColor:"",borderColor:"",ringColor:""};case"light":return{textColor:t?(0,o.getColorClassNames)(t,l.colorPalette.text).textColor:"text-tremor-brand dark:text-dark-tremor-brand",bgColor:t?(0,n.tremorTwMerge)((0,o.getColorClassNames)(t,l.colorPalette.background).bgColor,"bg-opacity-20"):"bg-tremor-brand-muted dark:bg-dark-tremor-brand-muted",borderColor:"",ringColor:""};case"shadow":return{textColor:t?(0,o.getColorClassNames)(t,l.colorPalette.text).textColor:"text-tremor-brand dark:text-dark-tremor-brand",bgColor:t?(0,n.tremorTwMerge)((0,o.getColorClassNames)(t,l.colorPalette.background).bgColor,"bg-opacity-20"):"bg-tremor-background dark:bg-dark-tremor-background",borderColor:"border-tremor-border dark:border-dark-tremor-border",ringColor:""};case"solid":return{textColor:t?(0,o.getColorClassNames)(t,l.colorPalette.text).textColor:"text-tremor-brand-inverted dark:text-dark-tremor-brand-inverted",bgColor:t?(0,n.tremorTwMerge)((0,o.getColorClassNames)(t,l.colorPalette.background).bgColor,"bg-opacity-20"):"bg-tremor-brand dark:bg-dark-tremor-brand",borderColor:"border-tremor-brand-inverted dark:border-dark-tremor-brand-inverted",ringColor:"ring-tremor-ring dark:ring-dark-tremor-ring"};case"outlined":return{textColor:t?(0,o.getColorClassNames)(t,l.colorPalette.text).textColor:"text-tremor-brand dark:text-dark-tremor-brand",bgColor:t?(0,n.tremorTwMerge)((0,o.getColorClassNames)(t,l.colorPalette.background).bgColor,"bg-opacity-20"):"bg-tremor-background dark:bg-dark-tremor-background",borderColor:t?(0,o.getColorClassNames)(t,l.colorPalette.ring).borderColor:"border-tremor-brand-subtle dark:border-dark-tremor-brand-subtle",ringColor:t?(0,n.tremorTwMerge)((0,o.getColorClassNames)(t,l.colorPalette.ring).ringColor,"ring-opacity-40"):"ring-tremor-brand-muted dark:ring-dark-tremor-brand-muted"}}})(p,b),{tooltipProps:x,getReferenceProps:k}=(0,a.useTooltip)();return r.default.createElement("span",Object.assign({ref:(0,o.mergeRefs)([u,x.refs.setReference]),className:(0,n.tremorTwMerge)(m("root"),"inline-flex shrink-0 items-center justify-center",w.bgColor,w.textColor,w.borderColor,w.ringColor,c[p].rounded,c[p].border,c[p].shadow,c[p].ring,s[h].paddingX,s[h].paddingY,_)},k,v),r.default.createElement(a.default,Object.assign({text:f},x)),r.default.createElement(g,{className:(0,n.tremorTwMerge)(m("icon"),"shrink-0",d[h].height,d[h].width)}))});u.displayName="Icon",e.s(["default",0,u],728889),e.s(["Icon",0,u],752978)},502547,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function(e,r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:r},e),t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 5l7 7-7 7"}))});e.s(["ChevronRightIcon",0,r],502547)},250980,e=>{"use strict";var t=e.i(271645);let r=t.forwardRef(function(e,r){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:r},e),t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"}))});e.s(["PlusCircleIcon",0,r],250980)},292639,e=>{"use strict";var t=e.i(602869),r=e.i(266027);let a=(0,e.i(243652).createQueryKeys)("uiSettings");e.s(["useUISettings",0,()=>(0,r.useQuery)({queryKey:a.list({}),queryFn:async()=>await (0,t.getUiSettings)(),staleTime:36e5,gcTime:36e5})])},902555,591935,122577,551332,e=>{"use strict";var t=e.i(843476),r=e.i(271645);let a=r.forwardRef(function(e,t){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:t},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"}))});e.s(["PencilAltIcon",0,a],591935);let i=r.forwardRef(function(e,t){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:t},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"}),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M21 12a9 9 0 11-18 0 9 9 0 0118 0z"}))});e.s(["PlayIcon",0,i],122577);var n=e.i(278587),o=e.i(68155),l=e.i(360820),s=e.i(871943),d=e.i(434626);let c=r.forwardRef(function(e,t){return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor","aria-hidden":"true",ref:t},e),r.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"}))});e.s(["ClipboardCopyIcon",0,c],551332);var m=e.i(592968),u=e.i(115504),g=e.i(752978);function p({icon:e,onClick:r,className:a,disabled:i,dataTestId:n}){return i?(0,t.jsx)(g.Icon,{icon:e,size:"sm",className:"opacity-50 cursor-not-allowed","data-testid":n}):(0,t.jsx)(g.Icon,{icon:e,size:"sm",onClick:r,className:(0,u.cx)("cursor-pointer",a),"data-testid":n})}e.i(773447);var f=e.i(892781);let h={Edit:{icon:a,className:"hover:text-blue-600"},Delete:{icon:o.TrashIcon,className:"hover:text-red-600"},Test:{icon:i,className:"hover:text-blue-600"},Regenerate:{icon:n.RefreshIcon,className:"hover:text-green-600"},Up:{icon:l.ChevronUpIcon,className:"hover:text-blue-600"},Down:{icon:s.ChevronDownIcon,className:"hover:text-blue-600"},Open:{icon:d.ExternalLinkIcon,className:"hover:text-green-600"},Copy:{icon:c,className:"hover:text-blue-600"}};e.s(["default",0,function({onClick:e,tooltipText:r,disabled:a=!1,disabledTooltipText:i,dataTestId:n,variant:o}){let{t:l}=(0,f.useTranslations)("common"),{icon:s,className:d}=h[o];return(0,t.jsx)(m.Tooltip,{title:a?i:r,children:(0,t.jsx)("span",{children:(0,t.jsx)(p,{icon:s,onClick:e,className:d,disabled:a,dataTestId:n})})})}],902555)},928685,e=>{"use strict";var t=e.i(38953);e.s(["SearchOutlined",()=>t.default])},44121,186515,e=>{"use strict";e.i(247167);var t=e.i(931067),r=e.i(271645);let a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM115.4 518.9L271.7 642c5.8 4.6 14.4.5 14.4-6.9V388.9c0-7.4-8.5-11.5-14.4-6.9L115.4 505.1a8.74 8.74 0 000 13.8z"}}]},name:"menu-fold",theme:"outlined"};var i=e.i(9583),n=r.forwardRef(function(e,n){return r.createElement(i.default,(0,t.default)({},e,{ref:n,icon:a}))});e.s(["MenuFoldOutlined",0,n],44121);let o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 000-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0014.4 7z"}}]},name:"menu-unfold",theme:"outlined"};var l=r.forwardRef(function(e,a){return r.createElement(i.default,(0,t.default)({},e,{ref:a,icon:o}))});e.s(["MenuUnfoldOutlined",0,l],186515)},283713,e=>{"use strict";var t=e.i(271645),r=e.i(602869),a=e.i(612256);let i="litellm_selected_worker_id";e.s(["useWorker",0,()=>{let{data:e}=(0,a.useUIConfig)(),n=e?.is_control_plane??!1,o=e?.workers??[],[l,s]=(0,t.useState)(()=>localStorage.getItem(i));(0,t.useEffect)(()=>{if(!l||0===o.length)return;let e=o.find(e=>e.worker_id===l);e&&(0,r.switchToWorkerUrl)(e.url)},[l,o]);let d=o.find(e=>e.worker_id===l)??null,c=(0,t.useCallback)(e=>{let t=o.find(t=>t.worker_id===e);t&&(s(e),localStorage.setItem(i,e),(0,r.switchToWorkerUrl)(t.url))},[o]);return{isControlPlane:n,workers:o,selectedWorkerId:l,selectedWorker:d,selectWorker:c,disconnectFromWorker:(0,t.useCallback)(()=>{s(null),localStorage.removeItem(i),(0,r.switchToWorkerUrl)(null)},[])}}])},295320,e=>{"use strict";e.i(247167);var t=e.i(931067),r=e.i(271645);let a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M704 446H320c-4.4 0-8 3.6-8 8v402c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8V454c0-4.4-3.6-8-8-8zm-328 64h272v117H376V510zm272 290H376V683h272v117z"}},{tag:"path",attrs:{d:"M424 748a32 32 0 1064 0 32 32 0 10-64 0zm0-178a32 32 0 1064 0 32 32 0 10-64 0z"}},{tag:"path",attrs:{d:"M811.4 368.9C765.6 248 648.9 162 512.2 162S258.8 247.9 213 368.8C126.9 391.5 63.5 470.2 64 563.6 64.6 668 145.6 752.9 247.6 762c4.7.4 8.7-3.3 8.7-8v-60.4c0-4-3-7.4-7-7.9-27-3.4-52.5-15.2-72.1-34.5-24-23.5-37.2-55.1-37.2-88.6 0-28 9.1-54.4 26.2-76.4 16.7-21.4 40.2-36.9 66.1-43.7l37.9-10 13.9-36.7c8.6-22.8 20.6-44.2 35.7-63.5 14.9-19.2 32.6-36 52.4-50 41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.3c19.9 14 37.5 30.8 52.4 50 15.1 19.3 27.1 40.7 35.7 63.5l13.8 36.6 37.8 10c54.2 14.4 92.1 63.7 92.1 120 0 33.6-13.2 65.1-37.2 88.6-19.5 19.2-44.9 31.1-71.9 34.5-4 .5-6.9 3.9-6.9 7.9V754c0 4.7 4.1 8.4 8.8 8 101.7-9.2 182.5-94 183.2-198.2.6-93.4-62.7-172.1-148.6-194.9z"}}]},name:"cloud-server",theme:"outlined"};var i=e.i(9583),n=r.forwardRef(function(e,n){return r.createElement(i.default,(0,t.default)({},e,{ref:n,icon:a}))});e.s(["CloudServerOutlined",0,n],295320)},282786,836938,310730,829672,e=>{"use strict";e.i(247167);var t=e.i(271645),r=e.i(343794),a=e.i(914949),i=e.i(404948);let n=e=>e?"function"==typeof e?e():e:null;e.s(["getRenderPropValue",0,n],836938);var o=e.i(613541),l=e.i(763731),s=e.i(242064),d=e.i(491816);e.i(793154);var c=e.i(880476),m=e.i(183293),u=e.i(717356),g=e.i(320560),p=e.i(307358),f=e.i(246422),h=e.i(838378),b=e.i(617933);let _=(0,f.genStyleHooks)("Popover",e=>{let{colorBgElevated:t,colorText:r}=e,a=(0,h.mergeToken)(e,{popoverBg:t,popoverColor:r});return[(e=>{let{componentCls:t,popoverColor:r,titleMinWidth:a,fontWeightStrong:i,innerPadding:n,boxShadowSecondary:o,colorTextHeading:l,borderRadiusLG:s,zIndexPopup:d,titleMarginBottom:c,colorBgElevated:u,popoverBg:p,titleBorderBottom:f,innerContentPadding:h,titlePadding:b}=e;return[{[t]:Object.assign(Object.assign({},(0,m.resetComponent)(e)),{position:"absolute",top:0,left:{_skip_check_:!0,value:0},zIndex:d,fontWeight:"normal",whiteSpace:"normal",textAlign:"start",cursor:"auto",userSelect:"text","--valid-offset-x":"var(--arrow-offset-horizontal, var(--arrow-x))",transformOrigin:"var(--valid-offset-x, 50%) var(--arrow-y, 50%)","--antd-arrow-background-color":u,width:"max-content",maxWidth:"100vw","&-rtl":{direction:"rtl"},"&-hidden":{display:"none"},[`${t}-content`]:{position:"relative"},[`${t}-inner`]:{backgroundColor:p,backgroundClip:"padding-box",borderRadius:s,boxShadow:o,padding:n},[`${t}-title`]:{minWidth:a,marginBottom:c,color:l,fontWeight:i,borderBottom:f,padding:b},[`${t}-inner-content`]:{color:r,padding:h}})},(0,g.default)(e,"var(--antd-arrow-background-color)"),{[`${t}-pure`]:{position:"relative",maxWidth:"none",margin:e.sizePopupArrow,display:"inline-block",[`${t}-content`]:{display:"inline-block"}}}]})(a),(e=>{let{componentCls:t}=e;return{[t]:b.PresetColors.map(r=>{let a=e[`${r}6`];return{[`&${t}-${r}`]:{"--antd-arrow-background-color":a,[`${t}-inner`]:{backgroundColor:a},[`${t}-arrow`]:{background:"transparent"}}}})}})(a),(0,u.initZoomMotion)(a,"zoom-big")]},e=>{let{lineWidth:t,controlHeight:r,fontHeight:a,padding:i,wireframe:n,zIndexPopupBase:o,borderRadiusLG:l,marginXS:s,lineType:d,colorSplit:c,paddingSM:m}=e,u=r-a;return Object.assign(Object.assign(Object.assign({titleMinWidth:177,zIndexPopup:o+30},(0,p.getArrowToken)(e)),(0,g.getArrowOffsetToken)({contentRadius:l,limitVerticalRadius:!0})),{innerPadding:12*!n,titleMarginBottom:n?0:s,titlePadding:n?`${u/2}px ${i}px ${u/2-t}px`:0,titleBorderBottom:n?`${t}px ${d} ${c}`:"none",innerContentPadding:n?`${m}px ${i}px`:0})},{resetStyle:!1,deprecatedTokens:[["width","titleMinWidth"],["minWidth","titleMinWidth"]]});var v=function(e,t){var r={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&0>t.indexOf(a)&&(r[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var i=0,a=Object.getOwnPropertySymbols(e);i<a.length;i++)0>t.indexOf(a[i])&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(r[a[i]]=e[a[i]]);return r};let w=({title:e,content:r,prefixCls:a})=>e||r?t.createElement(t.Fragment,null,e&&t.createElement("div",{className:`${a}-title`},e),r&&t.createElement("div",{className:`${a}-inner-content`},r)):null,x=e=>{let{hashId:a,prefixCls:i,className:o,style:l,placement:s="top",title:d,content:m,children:u}=e,g=n(d),p=n(m),f=(0,r.default)(a,i,`${i}-pure`,`${i}-placement-${s}`,o);return t.createElement("div",{className:f,style:l},t.createElement("div",{className:`${i}-arrow`}),t.createElement(c.Popup,Object.assign({},e,{className:a,prefixCls:i}),u||t.createElement(w,{prefixCls:i,title:g,content:p})))},k=e=>{let{prefixCls:a,className:i}=e,n=v(e,["prefixCls","className"]),{getPrefixCls:o}=t.useContext(s.ConfigContext),l=o("popover",a),[d,c,m]=_(l);return d(t.createElement(x,Object.assign({},n,{prefixCls:l,hashId:c,className:(0,r.default)(i,m)})))};e.s(["Overlay",0,w,"default",0,k],310730);var y=function(e,t){var r={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&0>t.indexOf(a)&&(r[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var i=0,a=Object.getOwnPropertySymbols(e);i<a.length;i++)0>t.indexOf(a[i])&&Object.prototype.propertyIsEnumerable.call(e,a[i])&&(r[a[i]]=e[a[i]]);return r};let C=t.forwardRef((e,c)=>{var m,u;let{prefixCls:g,title:p,content:f,overlayClassName:h,placement:b="top",trigger:v="hover",children:x,mouseEnterDelay:k=.1,mouseLeaveDelay:C=.1,onOpenChange:O,overlayStyle:E={},styles:j,classNames:$}=e,N=y(e,["prefixCls","title","content","overlayClassName","placement","trigger","children","mouseEnterDelay","mouseLeaveDelay","onOpenChange","overlayStyle","styles","classNames"]),{getPrefixCls:I,className:T,style:M,classNames:R,styles:S}=(0,s.useComponentConfig)("popover"),P=I("popover",g),[L,z,A]=_(P),H=I(),B=(0,r.default)(h,z,A,T,R.root,null==$?void 0:$.root),q=(0,r.default)(R.body,null==$?void 0:$.body),[D,W]=(0,a.default)(!1,{value:null!=(m=e.open)?m:e.visible,defaultValue:null!=(u=e.defaultOpen)?u:e.defaultVisible}),F=(e,t)=>{W(e,!0),null==O||O(e,t)},U=n(p),Y=n(f);return L(t.createElement(d.default,Object.assign({placement:b,trigger:v,mouseEnterDelay:k,mouseLeaveDelay:C},N,{prefixCls:P,classNames:{root:B,body:q},styles:{root:Object.assign(Object.assign(Object.assign(Object.assign({},S.root),M),E),null==j?void 0:j.root),body:Object.assign(Object.assign({},S.body),null==j?void 0:j.body)},ref:c,open:D,onOpenChange:e=>{F(e)},overlay:U||Y?t.createElement(w,{prefixCls:P,title:U,content:Y}):null,transitionName:(0,o.getTransitionName)(H,"zoom-big",N.transitionName),"data-popover-inject":!0}),(0,l.cloneElement)(x,{onKeyDown:e=>{var r,a;(0,t.isValidElement)(x)&&(null==(a=null==x?void 0:(r=x.props).onKeyDown)||a.call(r,e)),e.keyCode===i.default.ESC&&F(!1,e)}})))});C._InternalPanelDoNotUseOrYouWillBeFired=k,e.s(["default",0,C],829672),e.s(["Popover",0,C],282786)},492030,e=>{"use strict";var t=e.i(121229);e.s(["CheckOutlined",()=>t.default])},166406,e=>{"use strict";var t=e.i(190144);e.s(["CopyOutlined",()=>t.default])},447566,e=>{"use strict";e.i(247167);var t=e.i(931067),r=e.i(271645);let a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"}}]},name:"arrow-left",theme:"outlined"};var i=e.i(9583),n=r.forwardRef(function(e,n){return r.createElement(i.default,(0,t.default)({},e,{ref:n,icon:a}))});e.s(["ArrowLeftOutlined",0,n],447566)},755151,e=>{"use strict";var t=e.i(247153);e.s(["DownOutlined",()=>t.default])},596239,e=>{"use strict";e.i(247167);var t=e.i(931067),r=e.i(271645);let a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M574 665.4a8.03 8.03 0 00-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 00-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 000 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 000 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 00-11.3 0L372.3 598.7a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z"}}]},name:"link",theme:"outlined"};var i=e.i(9583),n=r.forwardRef(function(e,n){return r.createElement(i.default,(0,t.default)({},e,{ref:n,icon:a}))});e.s(["LinkOutlined",0,n],596239)},62478,e=>{"use strict";var t=e.i(602869);let r=async e=>{if(!e)return null;try{return await (0,t.getProxyUISettings)(e)}catch(e){return console.error("Error fetching proxy settings:",e),null}};e.s(["fetchProxySettings",0,r])},818581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return i}});let a=e.r(271645);function i(e,t){let r=(0,a.useRef)(null),i=(0,a.useRef)(null);return(0,a.useCallback)(a=>{if(null===a){let e=r.current;e&&(r.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(r.current=n(e,a)),t&&(i.current=n(t,a))},[e,t])}function n(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},602073,e=>{"use strict";e.i(247167);var t=e.i(931067),r=e.i(271645);let a={icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64L128 192v384c0 212.1 171.9 384 384 384s384-171.9 384-384V192L512 64zm312 512c0 172.3-139.7 312-312 312S200 748.3 200 576V246l312-110 312 110v330z"}},{tag:"path",attrs:{d:"M378.4 475.1a35.91 35.91 0 00-50.9 0 35.91 35.91 0 000 50.9l129.4 129.4 2.1 2.1a33.98 33.98 0 0048.1 0L730.6 434a33.98 33.98 0 000-48.1l-2.8-2.8a33.98 33.98 0 00-48.1 0L483 579.7 378.4 475.1z"}}]},name:"safety",theme:"outlined"};var i=e.i(9583),n=r.forwardRef(function(e,n){return r.createElement(i.default,(0,t.default)({},e,{ref:n,icon:a}))});e.s(["SafetyOutlined",0,n],602073)},190272,785913,e=>{"use strict";var t,r,a=((t={}).AUDIO_SPEECH="audio_speech",t.AUDIO_TRANSCRIPTION="audio_transcription",t.IMAGE_GENERATION="image_generation",t.VIDEO_GENERATION="video_generation",t.CHAT="chat",t.RESPONSES="responses",t.IMAGE_EDITS="image_edits",t.ANTHROPIC_MESSAGES="anthropic_messages",t.EMBEDDING="embedding",t),i=((r={}).IMAGE="image",r.VIDEO="video",r.CHAT="chat",r.RESPONSES="responses",r.IMAGE_EDITS="image_edits",r.ANTHROPIC_MESSAGES="anthropic_messages",r.EMBEDDINGS="embeddings",r.SPEECH="speech",r.TRANSCRIPTION="transcription",r.A2A_AGENTS="a2a_agents",r.MCP="mcp",r.REALTIME="realtime",r.INTERACTIONS="interactions",r);let n={image_generation:"image",video_generation:"video",chat:"chat",responses:"responses",image_edits:"image_edits",anthropic_messages:"anthropic_messages",audio_speech:"speech",audio_transcription:"transcription",embedding:"embeddings"};e.s(["EndpointType",()=>i,"getEndpointType",0,e=>{if(console.log("getEndpointType:",e),Object.values(a).includes(e)){let t=n[e];return console.log("endpointType:",t),t}return"chat"}],785913),e.s(["generateCodeSnippet",0,e=>{let t,{apiKeySource:r,accessToken:a,apiKey:n,inputMessage:o,chatHistory:l,selectedTags:s,selectedVectorStores:d,selectedGuardrails:c,selectedPolicies:m,selectedMCPServers:u,mcpServers:g,mcpServerToolRestrictions:p,selectedVoice:f,endpointType:h,selectedModel:b,selectedSdk:_,proxySettings:v}=e,w="session"===r?a:n,x=window.location.origin,k=v?.LITELLM_UI_API_DOC_BASE_URL;k&&k.trim()?x=k:v?.PROXY_BASE_URL&&(x=v.PROXY_BASE_URL);let y=o||"Your prompt here",C=y.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n"),O=l.filter(e=>!e.isImage).map(({role:e,content:t})=>({role:e,content:t})),E={};s.length>0&&(E.tags=s),d.length>0&&(E.vector_stores=d),c.length>0&&(E.guardrails=c),m.length>0&&(E.policies=m);let j=b||"your-model-name",$="azure"===_?`import openai

client = openai.AzureOpenAI(
	api_key="${w||"YOUR_LITELLM_API_KEY"}",
	azure_endpoint="${x}",
	api_version="2024-02-01"
)`:`import openai

client = openai.OpenAI(
	api_key="${w||"YOUR_LITELLM_API_KEY"}",
	base_url="${x}"
)`;switch(h){case i.CHAT:{let e=Object.keys(E).length>0,r="";if(e){let e=JSON.stringify({metadata:E},null,2).split("\n").map(e=>" ".repeat(4)+e).join("\n").trim();r=`,
    extra_body=${e}`}let a=O.length>0?O:[{role:"user",content:y}];t=`
import base64

# Helper function to encode images to base64
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Example with text only
response = client.chat.completions.create(
    model="${j}",
    messages=${JSON.stringify(a,null,4)}${r}
)

print(response)

# Example with image or PDF (uncomment and provide file path to use)
# base64_file = encode_image("path/to/your/file.jpg")  # or .pdf
# response_with_file = client.chat.completions.create(
#     model="${j}",
#     messages=[
#         {
#             "role": "user",
#             "content": [
#                 {
#                     "type": "text",
#                     "text": "${C}"
#                 },
#                 {
#                     "type": "image_url",
#                     "image_url": {
#                         "url": f"data:image/jpeg;base64,{base64_file}"  # or data:application/pdf;base64,{base64_file}
#                     }
#                 }
#             ]
#         }
#     ]${r}
# )
# print(response_with_file)
`;break}case i.RESPONSES:{let e=Object.keys(E).length>0,r="";if(e){let e=JSON.stringify({metadata:E},null,2).split("\n").map(e=>" ".repeat(4)+e).join("\n").trim();r=`,
    extra_body=${e}`}let a=O.length>0?O:[{role:"user",content:y}];t=`
import base64

# Helper function to encode images to base64
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Example with text only
response = client.responses.create(
    model="${j}",
    input=${JSON.stringify(a,null,4)}${r}
)

print(response.output_text)

# Example with image or PDF (uncomment and provide file path to use)
# base64_file = encode_image("path/to/your/file.jpg")  # or .pdf
# response_with_file = client.responses.create(
#     model="${j}",
#     input=[
#         {
#             "role": "user",
#             "content": [
#                 {"type": "input_text", "text": "${C}"},
#                 {
#                     "type": "input_image",
#                     "image_url": f"data:image/jpeg;base64,{base64_file}",  # or data:application/pdf;base64,{base64_file}
#                 },
#             ],
#         }
#     ]${r}
# )
# print(response_with_file.output_text)
`;break}case i.IMAGE:t="azure"===_?`
# NOTE: The Azure SDK does not have a direct equivalent to the multi-modal 'responses.create' method shown for OpenAI.
# This snippet uses 'client.images.generate' and will create a new image based on your prompt.
# It does not use the uploaded image, as 'client.images.generate' does not support image inputs in this context.
import os
import requests
import json
import time
from PIL import Image

result = client.images.generate(
	model="${j}",
	prompt="${o}",
	n=1
)

json_response = json.loads(result.model_dump_json())

# Set the directory for the stored image
image_dir = os.path.join(os.curdir, 'images')

# If the directory doesn't exist, create it
if not os.path.isdir(image_dir):
	os.mkdir(image_dir)

# Initialize the image path
image_filename = f"generated_image_{int(time.time())}.png"
image_path = os.path.join(image_dir, image_filename)

try:
	# Retrieve the generated image
	if json_response.get("data") && len(json_response["data"]) > 0 && json_response["data"][0].get("url"):
			image_url = json_response["data"][0]["url"]
			generated_image = requests.get(image_url).content
			with open(image_path, "wb") as image_file:
					image_file.write(generated_image)

			print(f"Image saved to {image_path}")
			# Display the image
			image = Image.open(image_path)
			image.show()
	else:
			print("Could not find image URL in response.")
			print("Full response:", json_response)
except Exception as e:
	print(f"An error occurred: {e}")
	print("Full response:", json_response)
`:`
import base64
import os
import time
import json
from PIL import Image
import requests

# Helper function to encode images to base64
def encode_image(image_path):
	with open(image_path, "rb") as image_file:
			return base64.b64encode(image_file.read()).decode('utf-8')

# Helper function to create a file (simplified for this example)
def create_file(image_path):
	# In a real implementation, this would upload the file to OpenAI
	# For this example, we'll just return a placeholder ID
	return f"file_{os.path.basename(image_path).replace('.', '_')}"

# The prompt entered by the user
prompt = "${C}"

# Encode images to base64
base64_image1 = encode_image("body-lotion.png")
base64_image2 = encode_image("soap.png")

# Create file IDs
file_id1 = create_file("body-lotion.png")
file_id2 = create_file("incense-kit.png")

response = client.responses.create(
	model="${j}",
	input=[
			{
					"role": "user",
					"content": [
							{"type": "input_text", "text": prompt},
							{
									"type": "input_image",
									"image_url": f"data:image/jpeg;base64,{base64_image1}",
							},
							{
									"type": "input_image",
									"image_url": f"data:image/jpeg;base64,{base64_image2}",
							},
							{
									"type": "input_image",
									"file_id": file_id1,
							},
							{
									"type": "input_image",
									"file_id": file_id2,
							}
					],
			}
	],
	tools=[{"type": "image_generation"}],
)

# Process the response
image_generation_calls = [
	output
	for output in response.output
	if output.type == "image_generation_call"
]

image_data = [output.result for output in image_generation_calls]

if image_data:
	image_base64 = image_data[0]
	image_filename = f"edited_image_{int(time.time())}.png"
	with open(image_filename, "wb") as f:
			f.write(base64.b64decode(image_base64))
	print(f"Image saved to {image_filename}")
else:
	# If no image is generated, there might be a text response with an explanation
	text_response = [output.text for output in response.output if hasattr(output, 'text')]
	if text_response:
			print("No image generated. Model response:")
			print("\\n".join(text_response))
	else:
			print("No image data found in response.")
	print("Full response for debugging:")
	print(response)
`;break;case i.IMAGE_EDITS:t="azure"===_?`
import base64
import os
import time
import json
from PIL import Image
import requests

# Helper function to encode images to base64
def encode_image(image_path):
	with open(image_path, "rb") as image_file:
			return base64.b64encode(image_file.read()).decode('utf-8')

# The prompt entered by the user
prompt = "${C}"

# Encode images to base64
base64_image1 = encode_image("body-lotion.png")
base64_image2 = encode_image("soap.png")

# Create file IDs
file_id1 = create_file("body-lotion.png")
file_id2 = create_file("incense-kit.png")

response = client.responses.create(
	model="${j}",
	input=[
			{
					"role": "user",
					"content": [
							{"type": "input_text", "text": prompt},
							{
									"type": "input_image",
									"image_url": f"data:image/jpeg;base64,{base64_image1}",
							},
							{
									"type": "input_image",
									"image_url": f"data:image/jpeg;base64,{base64_image2}",
							},
							{
									"type": "input_image",
									"file_id": file_id1,
							},
							{
									"type": "input_image",
									"file_id": file_id2,
							}
					],
			}
	],
	tools=[{"type": "image_generation"}],
)

# Process the response
image_generation_calls = [
	output
	for output in response.output
	if output.type == "image_generation_call"
]

image_data = [output.result for output in image_generation_calls]

if image_data:
	image_base64 = image_data[0]
	image_filename = f"edited_image_{int(time.time())}.png"
	with open(image_filename, "wb") as f:
			f.write(base64.b64decode(image_base64))
	print(f"Image saved to {image_filename}")
else:
	# If no image is generated, there might be a text response with an explanation
	text_response = [output.text for output in response.output if hasattr(output, 'text')]
	if text_response:
			print("No image generated. Model response:")
			print("\\n".join(text_response))
	else:
			print("No image data found in response.")
	print("Full response for debugging:")
	print(response)
`:`
import base64
import os
import time

# Helper function to encode images to base64
def encode_image(image_path):
	with open(image_path, "rb") as image_file:
			return base64.b64encode(image_file.read()).decode('utf-8')

# Helper function to create a file (simplified for this example)
def create_file(image_path):
	# In a real implementation, this would upload the file to OpenAI
	# For this example, we'll just return a placeholder ID
	return f"file_{os.path.basename(image_path).replace('.', '_')}"
import { useTranslations } from "@/i18n";

# The prompt entered by the user
prompt = "${C}"

# Encode images to base64
base64_image1 = encode_image("body-lotion.png")
base64_image2 = encode_image("soap.png")

# Create file IDs
file_id1 = create_file("body-lotion.png")
file_id2 = create_file("incense-kit.png")

response = client.responses.create(
	model="${j}",
	input=[
			{
					"role": "user",
					"content": [
							{"type": "input_text", "text": prompt},
							{
									"type": "input_image",
									"image_url": f"data:image/jpeg;base64,{base64_image1}",
							},
							{
									"type": "input_image",
									"image_url": f"data:image/jpeg;base64,{base64_image2}",
							},
							{
									"type": "input_image",
									"file_id": file_id1,
							},
							{
									"type": "input_image",
									"file_id": file_id2,
							}
					],
			}
	],
	tools=[{"type": "image_generation"}],
)

# Process the response
image_generation_calls = [
	output
	for output in response.output
	if output.type == "image_generation_call"
]

image_data = [output.result for output in image_generation_calls]

if image_data:
	image_base64 = image_data[0]
	image_filename = f"edited_image_{int(time.time())}.png"
	with open(image_filename, "wb") as f:
			f.write(base64.b64decode(image_base64))
	print(f"Image saved to {image_filename}")
else:
	# If no image is generated, there might be a text response with an explanation
	text_response = [output.text for output in response.output if hasattr(output, 'text')]
	if text_response:
			print("No image generated. Model response:")
			print("\\n".join(text_response))
	else:
			print("No image data found in response.")
	print("Full response for debugging:")
	print(response)
`;break;case i.EMBEDDINGS:t=`
response = client.embeddings.create(
	input="${o||"Your string here"}",
	model="${j}",
	encoding_format="base64" # or "float"
)

print(response.data[0].embedding)
`;break;case i.TRANSCRIPTION:t=`
# Open the audio file
audio_file = open("path/to/your/audio/file.mp3", "rb")

# Make the transcription request
response = client.audio.transcriptions.create(
	model="${j}",
	file=audio_file${o?`,
	prompt="${o.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`:""}
)

print(response.text)
`;break;case i.SPEECH:t=`
# Make the text-to-speech request
response = client.audio.speech.create(
	model="${j}",
	input="${o||"Your text to convert to speech here"}",
	voice="${f}"  # Options: alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer
)

# Save the audio to a file
output_filename = "output_speech.mp3"
response.stream_to_file(output_filename)
print(f"Audio saved to {output_filename}")

# Optional: Customize response format and speed
# response = client.audio.speech.create(
#     model="${j}",
#     input="${o||"Your text to convert to speech here"}",
#     voice="alloy",
#     response_format="mp3",  # Options: mp3, opus, aac, flac, wav, pcm
#     speed=1.0  # Range: 0.25 to 4.0
# )
# response.stream_to_file("output_speech.mp3")
`;break;default:t="\n# Code generation for this endpoint is not implemented yet."}return`${$}
${t}`}],190272)},86408,e=>{"use strict";var t=e.i(843476),r=e.i(271645),a=e.i(618566),i=e.i(934879);function n(){let e=(0,a.useSearchParams)().get("key"),[n,o]=(0,r.useState)(null);return console.log("PublicModelHubTable accessToken:",n),(0,r.useEffect)(()=>{e&&o(e)},[e]),(0,t.jsx)(i.default,{accessToken:n,publicPage:!0,premiumUser:!1,userRole:null})}e.s(["default",0,function(){return(0,t.jsx)(r.Suspense,{fallback:(0,t.jsx)("div",{className:"flex items-center justify-center min-h-screen",children:"Loading..."}),children:(0,t.jsx)(n,{})})}])}]);