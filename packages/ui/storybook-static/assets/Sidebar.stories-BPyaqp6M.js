import{i as e,s as t}from"./preload-helper-CT_b8DTk.js";import{t as n}from"./iframe-BzKUYKUQ.js";import{n as r,t as i}from"./Icon-47kNA-4U.js";import{t as a}from"./jsx-runtime-DqZldVDK.js";import{o,r as s}from"./useRenderElement-Cl30B0cK.js";import{n as c,t as l}from"./src-yTxolqsv.js";import{r as u,t as d}from"./Button-CU-Smr7A.js";import{n as ee,t as f}from"./dist-BSzDvpbx.js";import{r as p,t as m}from"./use-render-De_rW9Jb.js";import{n as h,t as te}from"./Input-Bk2YsSd0.js";import{n as ne,t as re}from"./Separator-C5ehTDKO.js";import{i as ie,l as ae,o as oe,r as se,s as ce,t as le}from"./Sheet-nM22uJr0.js";import{n as ue,t as de}from"./Skeleton-C-zTTLRh.js";import{a as fe,i as pe,n as me,t as he}from"./Tooltip-4DpmMew1.js";function ge(){return typeof process<`u`?typeof window<`u`?`warn`:`info`:`debug`}function _e(e){let t=e.context?.module,n=t?` [${t}]`:``,r=`${e.timestamp} ${e.level.toUpperCase()}${n} ${e.message}`,i=e.context?Object.fromEntries(Object.entries(e.context).filter(([e])=>e!==`module`)):void 0,a=i&&Object.keys(i).length>0;e.level===`error`?a?console.error(r,i):console.error(r):e.level===`warn`?a?console.warn(r,i):console.warn(r):a?console.log(r,i):console.log(r)}function ve(e){let t=JSON.stringify(e);e.level===`error`?console.error(t):e.level===`warn`?console.warn(t):console.log(t)}function g(e){return new v(e)}var _,v,ye=e((()=>{_={debug:0,info:1,warn:2,error:3},v=class e{config;minLevel;constructor(e={}){this.config=e,this.minLevel=_[e.minLevel??ge()]}emit(e,t,n){if(_[e]<this.minLevel)return;let r={level:e,message:t,timestamp:new Date().toISOString(),context:this.config.context||n?{...this.config.context,...n}:void 0};typeof process<`u`?ve(r):_e(r)}debug(e,t){this.emit(`debug`,e,t)}info(e,t){this.emit(`info`,e,t)}warn(e,t){this.emit(`warn`,e,t)}error(e,t){this.emit(`error`,e,t)}child(t){return new e({...this.config,context:{...this.config.context,...t}})}},new v})),be=e((()=>{ye()}));async function xe(e,t={},n,r){let i=await n();y.debug(`${t.method??`GET`} ${e}`);let a=await fetch(`${r}${e}`,{method:t.method??`GET`,headers:{"Content-Type":`application/json`,...i?{Authorization:`Bearer ${i}`}:{},...t.headers},body:t.body===void 0?void 0:JSON.stringify(t.body)});if(!a.ok){let n=(await a.json().catch(()=>({error:a.statusText}))).error??`HTTP ${a.status}`;throw y.error(`${t.method??`GET`} ${e} failed`,{status:a.status,message:n}),Error(n)}return(await a.json()).data}var y,Se=e((()=>{be(),y=g({context:{module:`hooks/fetchApi`}})}));function Ce({children:e,getToken:t,baseUrl:n}){let r=(0,b.useMemo)(()=>({fetchApi:(e,r={})=>xe(e,r,t,n)}),[t,n]);return(0,x.jsx)(we.Provider,{value:r,children:e})}var b,x,we,S=e((()=>{b=t(n()),Se(),x=a(),we=(0,b.createContext)(null),Ce.__docgenInfo={description:``,methods:[],displayName:`PasseApiProvider`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},getToken:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => Promise<string | null>`,signature:{arguments:[],return:{name:`Promise`,elements:[{name:`union`,raw:`string | null`,elements:[{name:`string`},{name:`null`}]}],raw:`Promise<string | null>`}}},description:``},baseUrl:{required:!0,tsType:{name:`string`},description:``}}}})),Te=e((()=>{S()})),Ee=e((()=>{S()})),De=e((()=>{S()}));function Oe(){let[e,t]=C.useState(void 0);return C.useEffect(()=>{let e=window.matchMedia(`(max-width: ${w-1}px)`),n=()=>{t(window.innerWidth<w)};return e.addEventListener(`change`,n),t(window.innerWidth<w),()=>e.removeEventListener(`change`,n)},[]),!!e}var C,w,ke=e((()=>{C=t(n()),w=768})),Ae=e((()=>{S()})),je=e((()=>{be(),S(),g({context:{module:`hooks/use-upload`}})})),Me=e((()=>{S()})),Ne=e((()=>{S(),Te(),Ee(),De(),ke(),Ae(),je(),Me()}));function T(){let e=H.useContext(W);if(!e)throw Error(`useSidebar must be used within a SidebarProvider.`);return e}function E({defaultOpen:e=!0,open:t,onOpenChange:n,className:r,style:i,children:a,...o}){let s=Oe(),[l,u]=H.useState(!1),[d,ee]=H.useState(e),f=t??d,p=H.useCallback(e=>{let t=typeof e==`function`?e(f):e;n?n(t):ee(t),document.cookie=`${Ve}=${t}; path=/; max-age=${He}`},[n,f]),m=H.useCallback(()=>s?u(e=>!e):p(e=>!e),[s,p,u]);H.useEffect(()=>{let e=e=>{e.key===Ke&&(e.metaKey||e.ctrlKey)&&(e.preventDefault(),m())};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[m]);let h=f?`expanded`:`collapsed`,te=H.useMemo(()=>({state:h,open:f,setOpen:p,isMobile:s,openMobile:l,setOpenMobile:u,toggleSidebar:m}),[h,f,p,s,l,u,m]);return(0,U.jsx)(W.Provider,{value:te,children:(0,U.jsx)(`div`,{"data-slot":`sidebar-wrapper`,style:{"--sidebar-width":Ue,"--sidebar-width-icon":Ge,...i},className:c(`group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar`,r),...o,children:a})})}function D({side:e=`left`,variant:t=`sidebar`,collapsible:n=`offcanvas`,className:r,children:i,dir:a,...o}){let{isMobile:s,state:l,openMobile:u,setOpenMobile:d}=T();return n===`none`?(0,U.jsx)(`div`,{"data-slot":`sidebar`,className:c(`flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground`,r),...o,children:i}):s?(0,U.jsx)(le,{open:u,onOpenChange:d,...o,children:(0,U.jsxs)(se,{dir:a,"data-sidebar":`sidebar`,"data-slot":`sidebar`,"data-mobile":`true`,className:`w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden`,style:{"--sidebar-width":We},side:e,children:[(0,U.jsxs)(oe,{className:`sr-only`,children:[(0,U.jsx)(ce,{children:`Sidebar`}),(0,U.jsx)(ie,{children:`Displays the mobile sidebar.`})]}),(0,U.jsx)(`div`,{className:`flex h-full w-full flex-col`,children:i})]})}):(0,U.jsxs)(`div`,{className:`group peer hidden text-sidebar-foreground md:block`,"data-state":l,"data-collapsible":l===`collapsed`?n:``,"data-variant":t,"data-side":e,"data-slot":`sidebar`,children:[(0,U.jsx)(`div`,{"data-slot":`sidebar-gap`,className:c(`relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear`,`group-data-[collapsible=offcanvas]:w-0`,`group-data-[side=right]:rotate-180`,t===`floating`||t===`inset`?`group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]`:`group-data-[collapsible=icon]:w-(--sidebar-width-icon)`)}),(0,U.jsx)(`div`,{"data-slot":`sidebar-container`,"data-side":e,className:c(`fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex`,t===`floating`||t===`inset`?`p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]`:`group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l`,r),...o,children:(0,U.jsx)(`div`,{"data-sidebar":`sidebar`,"data-slot":`sidebar-inner`,className:`flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border`,children:i})})]})}function O({className:e,onClick:t,...n}){let{toggleSidebar:r}=T();return(0,U.jsxs)(d,{"data-sidebar":`trigger`,"data-slot":`sidebar-trigger`,variant:`ghost`,size:`icon-sm`,className:c(e),onClick:e=>{t?.(e),r()},...n,children:[(0,U.jsx)(i,{name:`panel-left`,className:`cn-rtl-flip`}),(0,U.jsx)(`span`,{className:`sr-only`,children:`Toggle Sidebar`})]})}function k({className:e,...t}){let{toggleSidebar:n}=T();return(0,U.jsx)(`button`,{"data-sidebar":`rail`,"data-slot":`sidebar-rail`,"aria-label":`Toggle Sidebar`,tabIndex:-1,onClick:n,title:`Toggle Sidebar`,className:c(`absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2`,`in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize`,`[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize`,`group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar`,`[[data-side=left][data-collapsible=offcanvas]_&]:-right-2`,`[[data-side=right][data-collapsible=offcanvas]_&]:-left-2`,e),...t})}function A({className:e,...t}){return(0,U.jsx)(`main`,{"data-slot":`sidebar-inset`,className:c(`relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2`,e),...t})}function Pe({className:e,...t}){return(0,U.jsx)(te,{"data-slot":`sidebar-input`,"data-sidebar":`input`,className:c(`h-8 w-full bg-background shadow-none`,e),...t})}function j({className:e,...t}){return(0,U.jsx)(`div`,{"data-slot":`sidebar-header`,"data-sidebar":`header`,className:c(`flex flex-col gap-2 p-2`,e),...t})}function M({className:e,...t}){return(0,U.jsx)(`div`,{"data-slot":`sidebar-footer`,"data-sidebar":`footer`,className:c(`flex flex-col gap-2 p-2`,e),...t})}function Fe({className:e,...t}){return(0,U.jsx)(re,{"data-slot":`sidebar-separator`,"data-sidebar":`separator`,className:c(`mx-2 w-auto bg-sidebar-border`,e),...t})}function N({className:e,...t}){return(0,U.jsx)(`div`,{"data-slot":`sidebar-content`,"data-sidebar":`content`,className:c(`no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden`,e),...t})}function P({className:e,...t}){return(0,U.jsx)(`div`,{"data-slot":`sidebar-group`,"data-sidebar":`group`,className:c(`relative flex w-full min-w-0 flex-col p-2`,e),...t})}function F({className:e,render:t,...n}){return p({defaultTagName:`div`,props:o({className:c(`flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0`,e)},n),render:t,state:{slot:`sidebar-group-label`,sidebar:`group-label`}})}function Ie({className:e,render:t,...n}){return p({defaultTagName:`button`,props:o({className:c(`absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0`,e)},n),render:t,state:{slot:`sidebar-group-action`,sidebar:`group-action`}})}function I({className:e,...t}){return(0,U.jsx)(`div`,{"data-slot":`sidebar-group-content`,"data-sidebar":`group-content`,className:c(`w-full text-sm`,e),...t})}function L({className:e,...t}){return(0,U.jsx)(`ul`,{"data-slot":`sidebar-menu`,"data-sidebar":`menu`,className:c(`flex w-full min-w-0 flex-col gap-0`,e),...t})}function R({className:e,...t}){return(0,U.jsx)(`li`,{"data-slot":`sidebar-menu-item`,"data-sidebar":`menu-item`,className:c(`group/menu-item relative`,e),...t})}function z({render:e,isActive:t=!1,variant:n=`default`,size:r=`default`,tooltip:i,className:a,...s}){let{isMobile:l,state:u}=T(),d=p({defaultTagName:`button`,props:o({className:c(qe({variant:n,size:r}),a)},s),render:i?(0,U.jsx)(pe,{render:e}):e,state:{slot:`sidebar-menu-button`,sidebar:`menu-button`,size:r,active:t}});return i?(typeof i==`string`&&(i={children:i}),(0,U.jsxs)(he,{children:[d,(0,U.jsx)(me,{side:`right`,align:`center`,hidden:u!==`collapsed`||l,...i})]})):d}function Le({className:e,render:t,showOnHover:n=!1,...r}){return p({defaultTagName:`button`,props:o({className:c(`absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0`,n&&`group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground aria-expanded:opacity-100 md:opacity-0`,e)},r),render:t,state:{slot:`sidebar-menu-action`,sidebar:`menu-action`}})}function B({className:e,...t}){return(0,U.jsx)(`div`,{"data-slot":`sidebar-menu-badge`,"data-sidebar":`menu-badge`,className:c(`pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground`,e),...t})}function Re({className:e,showIcon:t=!1,...n}){let[r]=H.useState(()=>`${Math.floor(Math.random()*40)+50}%`);return(0,U.jsxs)(`div`,{"data-slot":`sidebar-menu-skeleton`,"data-sidebar":`menu-skeleton`,className:c(`flex h-8 items-center gap-2 rounded-md px-2`,e),...n,children:[t&&(0,U.jsx)(de,{className:`size-4 rounded-md`,"data-sidebar":`menu-skeleton-icon`}),(0,U.jsx)(de,{className:`h-4 max-w-(--skeleton-width) flex-1`,"data-sidebar":`menu-skeleton-text`,style:{"--skeleton-width":r}})]})}function ze({className:e,...t}){return(0,U.jsx)(`ul`,{"data-slot":`sidebar-menu-sub`,"data-sidebar":`menu-sub`,className:c(`mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden`,e),...t})}function V({className:e,...t}){return(0,U.jsx)(`li`,{"data-slot":`sidebar-menu-sub-item`,"data-sidebar":`menu-sub-item`,className:c(`group/menu-sub-item relative`,e),...t})}function Be({render:e,size:t=`md`,isActive:n=!1,className:r,...i}){return p({defaultTagName:`a`,props:o({className:c(`flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden group-data-[collapsible=icon]:hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[size=md]:text-sm data-[size=sm]:text-xs data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground`,r)},i),render:e,state:{slot:`sidebar-menu-sub-button`,sidebar:`menu-sub-button`,size:t,active:n}})}var H,U,Ve,He,Ue,We,Ge,Ke,W,qe,Je=e((()=>{s(),m(),ee(),H=t(n()),Ne(),l(),u(),r(),h(),ne(),ae(),ue(),fe(),U=a(),Ve=`sidebar_state`,He=3600*24*7,Ue=`16rem`,We=`18rem`,Ge=`3rem`,Ke=`b`,W=H.createContext(null),qe=f(`peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate`,{variants:{variant:{default:`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`,outline:`bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]`},size:{default:`h-8 text-sm`,sm:`h-7 text-xs`,lg:`h-12 text-sm group-data-[collapsible=icon]:p-0!`}},defaultVariants:{variant:`default`,size:`default`}}),D.__docgenInfo={description:``,methods:[],displayName:`Sidebar`,props:{side:{required:!1,tsType:{name:`union`,raw:`'left' | 'right'`,elements:[{name:`literal`,value:`'left'`},{name:`literal`,value:`'right'`}]},description:``,defaultValue:{value:`'left'`,computed:!1}},variant:{required:!1,tsType:{name:`union`,raw:`'sidebar' | 'floating' | 'inset'`,elements:[{name:`literal`,value:`'sidebar'`},{name:`literal`,value:`'floating'`},{name:`literal`,value:`'inset'`}]},description:``,defaultValue:{value:`'sidebar'`,computed:!1}},collapsible:{required:!1,tsType:{name:`union`,raw:`'offcanvas' | 'icon' | 'none'`,elements:[{name:`literal`,value:`'offcanvas'`},{name:`literal`,value:`'icon'`},{name:`literal`,value:`'none'`}]},description:``,defaultValue:{value:`'offcanvas'`,computed:!1}}}},N.__docgenInfo={description:``,methods:[],displayName:`SidebarContent`},M.__docgenInfo={description:``,methods:[],displayName:`SidebarFooter`},P.__docgenInfo={description:``,methods:[],displayName:`SidebarGroup`},I.__docgenInfo={description:``,methods:[],displayName:`SidebarGroupContent`},j.__docgenInfo={description:``,methods:[],displayName:`SidebarHeader`},Pe.__docgenInfo={description:``,methods:[],displayName:`SidebarInput`},A.__docgenInfo={description:``,methods:[],displayName:`SidebarInset`},L.__docgenInfo={description:``,methods:[],displayName:`SidebarMenu`},B.__docgenInfo={description:``,methods:[],displayName:`SidebarMenuBadge`},z.__docgenInfo={description:``,methods:[],displayName:`SidebarMenuButton`,props:{isActive:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}},tooltip:{required:!1,tsType:{name:`union`,raw:`string | React.ComponentProps<typeof TooltipContent>`,elements:[{name:`string`},{name:`ReactComponentProps`,raw:`React.ComponentProps<typeof TooltipContent>`,elements:[{name:`TooltipContent`}]}]},description:``},variant:{defaultValue:{value:`'default'`,computed:!1},required:!1},size:{defaultValue:{value:`'default'`,computed:!1},required:!1}}},R.__docgenInfo={description:``,methods:[],displayName:`SidebarMenuItem`},Re.__docgenInfo={description:``,methods:[],displayName:`SidebarMenuSkeleton`,props:{showIcon:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}},ze.__docgenInfo={description:``,methods:[],displayName:`SidebarMenuSub`},V.__docgenInfo={description:``,methods:[],displayName:`SidebarMenuSubItem`},E.__docgenInfo={description:``,methods:[],displayName:`SidebarProvider`,props:{defaultOpen:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}},open:{required:!1,tsType:{name:`boolean`},description:``},onOpenChange:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(open: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`open`}],return:{name:`void`}}},description:``}}},k.__docgenInfo={description:``,methods:[],displayName:`SidebarRail`},Fe.__docgenInfo={description:``,methods:[],displayName:`SidebarSeparator`},O.__docgenInfo={description:``,methods:[],displayName:`SidebarTrigger`}}));function G({title:e}){return(0,K.jsxs)(A,{children:[(0,K.jsxs)(`header`,{className:`flex h-12 items-center gap-2 border-b px-4`,children:[(0,K.jsx)(O,{}),(0,K.jsx)(`span`,{className:`text-sm font-medium`,children:e})]}),(0,K.jsx)(`div`,{className:`p-4 text-sm text-muted-foreground`,children:`Main content area`})]})}var K,Ye,q,J,Y,X,Z,Q,$,Xe;e((()=>{r(),Je(),K=a(),Ye={title:`Components/Sidebar`,tags:[`autodocs`],decorators:[e=>(0,K.jsx)(`div`,{className:`h-[600px] w-full overflow-hidden rounded-lg border`,style:{transform:`translateZ(0)`},children:(0,K.jsx)(e,{})})]},q={render:()=>(0,K.jsxs)(E,{children:[(0,K.jsxs)(D,{children:[(0,K.jsx)(j,{children:(0,K.jsxs)(`div`,{className:`flex items-center gap-2 px-2 py-1`,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{className:`font-semibold`,children:`Passé`})]})}),(0,K.jsx)(N,{children:(0,K.jsxs)(P,{children:[(0,K.jsx)(F,{children:`Navigation`}),(0,K.jsx)(I,{children:(0,K.jsxs)(L,{children:[(0,K.jsx)(R,{children:(0,K.jsxs)(z,{isActive:!0,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{children:`Trips`})]})}),(0,K.jsx)(R,{children:(0,K.jsxs)(z,{children:[(0,K.jsx)(i,{name:`map`}),(0,K.jsx)(`span`,{children:`Map`})]})}),(0,K.jsx)(R,{children:(0,K.jsxs)(z,{children:[(0,K.jsx)(i,{name:`globe`}),(0,K.jsx)(`span`,{children:`Explore`})]})})]})})]})}),(0,K.jsx)(M,{children:(0,K.jsx)(L,{children:(0,K.jsx)(R,{children:(0,K.jsxs)(z,{children:[(0,K.jsx)(i,{name:`user`}),(0,K.jsx)(`span`,{children:`Account`})]})})})}),(0,K.jsx)(k,{})]}),(0,K.jsx)(G,{title:`Trips`})]})},J={render:()=>(0,K.jsxs)(E,{defaultOpen:!1,children:[(0,K.jsxs)(D,{collapsible:`icon`,children:[(0,K.jsx)(j,{children:(0,K.jsxs)(`div`,{className:`flex items-center gap-2 px-2 py-1`,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{className:`font-semibold`,children:`Passé`})]})}),(0,K.jsx)(N,{children:(0,K.jsxs)(P,{children:[(0,K.jsx)(F,{children:`Navigation`}),(0,K.jsx)(I,{children:(0,K.jsxs)(L,{children:[(0,K.jsx)(R,{children:(0,K.jsxs)(z,{isActive:!0,tooltip:`Trips`,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{children:`Trips`})]})}),(0,K.jsx)(R,{children:(0,K.jsxs)(z,{tooltip:`Map`,children:[(0,K.jsx)(i,{name:`map`}),(0,K.jsx)(`span`,{children:`Map`})]})}),(0,K.jsx)(R,{children:(0,K.jsxs)(z,{tooltip:`Explore`,children:[(0,K.jsx)(i,{name:`globe`}),(0,K.jsx)(`span`,{children:`Explore`})]})})]})})]})}),(0,K.jsx)(M,{children:(0,K.jsx)(L,{children:(0,K.jsx)(R,{children:(0,K.jsxs)(z,{tooltip:`Account`,children:[(0,K.jsx)(i,{name:`user`}),(0,K.jsx)(`span`,{children:`Account`})]})})})}),(0,K.jsx)(k,{})]}),(0,K.jsx)(G,{title:`Trips`})]})},Y={render:()=>(0,K.jsxs)(E,{children:[(0,K.jsxs)(D,{variant:`floating`,children:[(0,K.jsx)(j,{children:(0,K.jsxs)(`div`,{className:`flex items-center gap-2 px-2 py-1`,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{className:`font-semibold`,children:`Passé`})]})}),(0,K.jsx)(N,{children:(0,K.jsxs)(P,{children:[(0,K.jsx)(F,{children:`Navigation`}),(0,K.jsx)(I,{children:(0,K.jsxs)(L,{children:[(0,K.jsx)(R,{children:(0,K.jsxs)(z,{isActive:!0,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{children:`Trips`})]})}),(0,K.jsx)(R,{children:(0,K.jsxs)(z,{children:[(0,K.jsx)(i,{name:`map`}),(0,K.jsx)(`span`,{children:`Map`})]})})]})})]})}),(0,K.jsx)(k,{})]}),(0,K.jsx)(G,{title:`Trips`})]})},X={render:()=>(0,K.jsxs)(E,{children:[(0,K.jsxs)(D,{variant:`inset`,children:[(0,K.jsx)(j,{children:(0,K.jsxs)(`div`,{className:`flex items-center gap-2 px-2 py-1`,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{className:`font-semibold`,children:`Passé`})]})}),(0,K.jsx)(N,{children:(0,K.jsxs)(P,{children:[(0,K.jsx)(F,{children:`Navigation`}),(0,K.jsx)(I,{children:(0,K.jsxs)(L,{children:[(0,K.jsx)(R,{children:(0,K.jsxs)(z,{isActive:!0,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{children:`Trips`})]})}),(0,K.jsx)(R,{children:(0,K.jsxs)(z,{children:[(0,K.jsx)(i,{name:`map`}),(0,K.jsx)(`span`,{children:`Map`})]})})]})})]})}),(0,K.jsx)(k,{})]}),(0,K.jsx)(G,{title:`Trips`})]})},Z={render:()=>(0,K.jsxs)(E,{children:[(0,K.jsx)(G,{title:`Trips`}),(0,K.jsxs)(D,{side:`right`,children:[(0,K.jsx)(j,{children:(0,K.jsxs)(`div`,{className:`flex items-center gap-2 px-2 py-1`,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{className:`font-semibold`,children:`Passé`})]})}),(0,K.jsx)(N,{children:(0,K.jsxs)(P,{children:[(0,K.jsx)(F,{children:`Navigation`}),(0,K.jsx)(I,{children:(0,K.jsxs)(L,{children:[(0,K.jsx)(R,{children:(0,K.jsxs)(z,{isActive:!0,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{children:`Trips`})]})}),(0,K.jsx)(R,{children:(0,K.jsxs)(z,{children:[(0,K.jsx)(i,{name:`map`}),(0,K.jsx)(`span`,{children:`Map`})]})})]})})]})}),(0,K.jsx)(k,{})]})]})},Q={render:()=>(0,K.jsxs)(E,{children:[(0,K.jsxs)(D,{children:[(0,K.jsx)(j,{children:(0,K.jsxs)(`div`,{className:`flex items-center gap-2 px-2 py-1`,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{className:`font-semibold`,children:`Passé`})]})}),(0,K.jsx)(N,{children:(0,K.jsxs)(P,{children:[(0,K.jsx)(F,{children:`Navigation`}),(0,K.jsx)(I,{children:(0,K.jsxs)(L,{children:[(0,K.jsx)(R,{children:(0,K.jsxs)(z,{isActive:!0,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{children:`Trips`})]})}),(0,K.jsxs)(R,{children:[(0,K.jsxs)(z,{children:[(0,K.jsx)(i,{name:`globe`}),(0,K.jsx)(`span`,{children:`Explore`})]}),(0,K.jsxs)(ze,{children:[(0,K.jsx)(V,{children:(0,K.jsx)(Be,{href:`#`,children:`Countries`})}),(0,K.jsx)(V,{children:(0,K.jsx)(Be,{href:`#`,children:`Cities`})})]})]})]})})]})}),(0,K.jsx)(k,{})]}),(0,K.jsx)(G,{title:`Explore`})]})},$={render:()=>(0,K.jsxs)(E,{children:[(0,K.jsxs)(D,{children:[(0,K.jsx)(j,{children:(0,K.jsxs)(`div`,{className:`flex items-center gap-2 px-2 py-1`,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{className:`font-semibold`,children:`Passé`})]})}),(0,K.jsx)(N,{children:(0,K.jsxs)(P,{children:[(0,K.jsx)(F,{children:`Navigation`}),(0,K.jsx)(Ie,{title:`Add trip`,children:(0,K.jsx)(i,{name:`plus`})}),(0,K.jsx)(I,{children:(0,K.jsxs)(L,{children:[(0,K.jsxs)(R,{children:[(0,K.jsxs)(z,{isActive:!0,children:[(0,K.jsx)(i,{name:`luggage`}),(0,K.jsx)(`span`,{children:`Trips`})]}),(0,K.jsx)(B,{children:`12`})]}),(0,K.jsxs)(R,{children:[(0,K.jsxs)(z,{children:[(0,K.jsx)(i,{name:`mail`}),(0,K.jsx)(`span`,{children:`Messages`})]}),(0,K.jsx)(Le,{showOnHover:!0,title:`Mark all read`,children:(0,K.jsx)(i,{name:`check`})}),(0,K.jsx)(B,{children:`3`})]})]})})]})}),(0,K.jsx)(k,{})]}),(0,K.jsx)(G,{title:`Trips`})]})},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Icon name="luggage" />
            <span className="font-semibold">Passé</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Icon name="luggage" />
                    <span>Trips</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icon name="map" />
                    <span>Map</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icon name="globe" />
                    <span>Explore</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Icon name="user" />
                <span>Account</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <DemoInset title="Trips" />
    </SidebarProvider>
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Icon name="luggage" />
            <span className="font-semibold">Passé</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Trips">
                    <Icon name="luggage" />
                    <span>Trips</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Map">
                    <Icon name="map" />
                    <span>Map</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Explore">
                    <Icon name="globe" />
                    <span>Explore</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Account">
                <Icon name="user" />
                <span>Account</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <DemoInset title="Trips" />
    </SidebarProvider>
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Icon name="luggage" />
            <span className="font-semibold">Passé</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Icon name="luggage" />
                    <span>Trips</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icon name="map" />
                    <span>Map</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <DemoInset title="Trips" />
    </SidebarProvider>
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Icon name="luggage" />
            <span className="font-semibold">Passé</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Icon name="luggage" />
                    <span>Trips</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icon name="map" />
                    <span>Map</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <DemoInset title="Trips" />
    </SidebarProvider>
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider>
      <DemoInset title="Trips" />
      <Sidebar side="right">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Icon name="luggage" />
            <span className="font-semibold">Passé</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Icon name="luggage" />
                    <span>Trips</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icon name="map" />
                    <span>Map</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Icon name="luggage" />
            <span className="font-semibold">Passé</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Icon name="luggage" />
                    <span>Trips</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icon name="globe" />
                    <span>Explore</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#">Countries</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#">Cities</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <DemoInset title="Explore" />
    </SidebarProvider>
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <Icon name="luggage" />
            <span className="font-semibold">Passé</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupAction title="Add trip">
              <Icon name="plus" />
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Icon name="luggage" />
                    <span>Trips</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>12</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Icon name="mail" />
                    <span>Messages</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction showOnHover title="Mark all read">
                    <Icon name="check" />
                  </SidebarMenuAction>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <DemoInset title="Trips" />
    </SidebarProvider>
}`,...$.parameters?.docs?.source}}},Xe=[`Default`,`CollapsibleIcon`,`FloatingVariant`,`InsetVariant`,`RightSide`,`WithSubmenu`,`WithBadgesAndActions`]}))();export{J as CollapsibleIcon,q as Default,Y as FloatingVariant,X as InsetVariant,Z as RightSide,$ as WithBadgesAndActions,Q as WithSubmenu,Xe as __namedExportsOrder,Ye as default};