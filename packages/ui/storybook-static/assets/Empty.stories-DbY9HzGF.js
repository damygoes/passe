import{i as e}from"./preload-helper-CT_b8DTk.js";import{n as t,t as n}from"./Icon-47kNA-4U.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{n as i,t as a}from"./src-yTxolqsv.js";import{r as o,t as s}from"./Button-CU-Smr7A.js";import{n as c,t as l}from"./dist-BSzDvpbx.js";function u({className:e,...t}){return(0,g.jsx)(`div`,{"data-slot":`empty`,className:i(`flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance`,e),...t})}function d({className:e,...t}){return(0,g.jsx)(`div`,{"data-slot":`empty-header`,className:i(`flex max-w-sm flex-col items-center gap-2`,e),...t})}function f({className:e,variant:t=`default`,...n}){return(0,g.jsx)(`div`,{"data-slot":`empty-icon`,"data-variant":t,className:i(_({variant:t,className:e})),...n})}function p({className:e,...t}){return(0,g.jsx)(`div`,{"data-slot":`empty-title`,className:i(`cn-font-heading text-sm font-medium tracking-tight`,e),...t})}function m({className:e,...t}){return(0,g.jsx)(`div`,{"data-slot":`empty-description`,className:i(`text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary`,e),...t})}function h({className:e,...t}){return(0,g.jsx)(`div`,{"data-slot":`empty-content`,className:i(`flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance`,e),...t})}var g,_,v=e((()=>{a(),c(),g=r(),_=l(`mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0`,{variants:{variant:{default:`bg-transparent`,icon:`flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4`}},defaultVariants:{variant:`default`}}),u.__docgenInfo={description:``,methods:[],displayName:`Empty`},d.__docgenInfo={description:``,methods:[],displayName:`EmptyHeader`},p.__docgenInfo={description:``,methods:[],displayName:`EmptyTitle`},m.__docgenInfo={description:``,methods:[],displayName:`EmptyDescription`},h.__docgenInfo={description:``,methods:[],displayName:`EmptyContent`},f.__docgenInfo={description:``,methods:[],displayName:`EmptyMedia`,props:{variant:{defaultValue:{value:`'default'`,computed:!1},required:!1}}}})),y,b,x,S,C,w,T;e((()=>{o(),t(),v(),y=r(),b={title:`Components/Empty`,component:u,tags:[`autodocs`]},x={render:()=>(0,y.jsx)(u,{className:`h-48 border`,children:(0,y.jsxs)(d,{children:[(0,y.jsx)(p,{children:`No trips yet`}),(0,y.jsx)(m,{children:`Your travel memories will appear here once you add your first trip.`})]})})},S={render:()=>(0,y.jsx)(u,{className:`h-56 border`,children:(0,y.jsxs)(d,{children:[(0,y.jsx)(f,{variant:`icon`,children:(0,y.jsx)(n,{name:`alert`})}),(0,y.jsx)(p,{children:`No memories found`}),(0,y.jsx)(m,{children:`Try adjusting your filters or add a new memory to this trip.`})]})})},C={render:()=>(0,y.jsxs)(u,{className:`h-56 border`,children:[(0,y.jsxs)(d,{children:[(0,y.jsx)(p,{children:`No trips yet`}),(0,y.jsx)(m,{children:`Start by creating your first trip and attaching memories to it.`})]}),(0,y.jsx)(h,{children:(0,y.jsx)(s,{size:`sm`,children:`Create a trip`})})]})},w={render:()=>(0,y.jsxs)(u,{className:`h-64 border`,children:[(0,y.jsxs)(d,{children:[(0,y.jsx)(f,{variant:`icon`,children:(0,y.jsx)(n,{name:`alert`})}),(0,y.jsx)(p,{children:`No memories found`}),(0,y.jsx)(m,{children:`You haven't added any memories to this trip yet. Attach photos and notes to bring it to life.`})]}),(0,y.jsxs)(h,{children:[(0,y.jsx)(s,{size:`sm`,children:`Add a memory`}),(0,y.jsx)(s,{variant:`ghost`,size:`sm`,children:`Learn more`})]})]})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Empty className="h-48 border">
      <EmptyHeader>
        <EmptyTitle>No trips yet</EmptyTitle>
        <EmptyDescription>Your travel memories will appear here once you add your first trip.</EmptyDescription>
      </EmptyHeader>
    </Empty>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <Empty className="h-56 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="alert" />
        </EmptyMedia>
        <EmptyTitle>No memories found</EmptyTitle>
        <EmptyDescription>Try adjusting your filters or add a new memory to this trip.</EmptyDescription>
      </EmptyHeader>
    </Empty>
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <Empty className="h-56 border">
      <EmptyHeader>
        <EmptyTitle>No trips yet</EmptyTitle>
        <EmptyDescription>Start by creating your first trip and attaching memories to it.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create a trip</Button>
      </EmptyContent>
    </Empty>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <Empty className="h-64 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon name="alert" />
        </EmptyMedia>
        <EmptyTitle>No memories found</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t added any memories to this trip yet. Attach photos and notes to bring it to life.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Add a memory</Button>
        <Button variant="ghost" size="sm">Learn more</Button>
      </EmptyContent>
    </Empty>
}`,...w.parameters?.docs?.source}}},T=[`Default`,`WithIcon`,`WithContent`,`Full`]}))();export{x as Default,w as Full,C as WithContent,S as WithIcon,T as __namedExportsOrder,b as default};