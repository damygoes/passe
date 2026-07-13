import{i as e}from"./preload-helper-CT_b8DTk.js";import{n as t,t as n}from"./Icon-47kNA-4U.js";import{t as r}from"./jsx-runtime-DqZldVDK.js";import{r as i,t as a}from"./Button-CU-Smr7A.js";import{a as o,i as s,n as c,r as l,t as u}from"./Tooltip-4DpmMew1.js";var d,f,p,m,h,g,_;e((()=>{i(),t(),o(),d=r(),f={title:`Components/Tooltip`,component:u,tags:[`autodocs`],decorators:[e=>(0,d.jsx)(l,{children:(0,d.jsx)(`div`,{className:`flex min-h-32 items-center justify-center`,children:(0,d.jsx)(e,{})})})]},p={render:()=>(0,d.jsxs)(u,{children:[(0,d.jsx)(s,{render:(0,d.jsx)(a,{variant:`outline`,children:`Hover me`})}),(0,d.jsx)(c,{children:`Save this trip`})]})},m={render:()=>(0,d.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,d.jsxs)(u,{children:[(0,d.jsx)(s,{render:(0,d.jsx)(a,{variant:`outline`,children:`Top`})}),(0,d.jsx)(c,{side:`top`,children:`Top tooltip`})]}),(0,d.jsxs)(u,{children:[(0,d.jsx)(s,{render:(0,d.jsx)(a,{variant:`outline`,children:`Right`})}),(0,d.jsx)(c,{side:`right`,children:`Right tooltip`})]}),(0,d.jsxs)(u,{children:[(0,d.jsx)(s,{render:(0,d.jsx)(a,{variant:`outline`,children:`Bottom`})}),(0,d.jsx)(c,{side:`bottom`,children:`Bottom tooltip`})]}),(0,d.jsxs)(u,{children:[(0,d.jsx)(s,{render:(0,d.jsx)(a,{variant:`outline`,children:`Left`})}),(0,d.jsx)(c,{side:`left`,children:`Left tooltip`})]})]})},h={render:()=>(0,d.jsxs)(u,{children:[(0,d.jsx)(s,{render:(0,d.jsx)(a,{variant:`ghost`,size:`icon-sm`,children:(0,d.jsx)(n,{name:`panel-left`})})}),(0,d.jsx)(c,{children:`Toggle sidebar`})]})},g={render:()=>(0,d.jsxs)(u,{children:[(0,d.jsx)(s,{render:(0,d.jsx)(a,{variant:`outline`,children:`Trip status`})}),(0,d.jsx)(c,{children:`This trip is private — only you can see its memories until you make it public.`})]})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent>Save this trip</TooltipContent>
    </Tooltip>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Top</Button>} />
        <TooltipContent side="top">Top tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Right</Button>} />
        <TooltipContent side="right">Right tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Bottom</Button>} />
        <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Left</Button>} />
        <TooltipContent side="left">Left tooltip</TooltipContent>
      </Tooltip>
    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon-sm">
            <Icon name="panel-left" />
          </Button>} />
      <TooltipContent>Toggle sidebar</TooltipContent>
    </Tooltip>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Trip status</Button>} />
      <TooltipContent>
        This trip is private — only you can see its memories until you make it public.
      </TooltipContent>
    </Tooltip>
}`,...g.parameters?.docs?.source}}},_=[`Default`,`Sides`,`IconTrigger`,`LongContent`]}))();export{p as Default,h as IconTrigger,g as LongContent,m as Sides,_ as __namedExportsOrder,f as default};