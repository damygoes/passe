import{i as e}from"./preload-helper-CT_b8DTk.js";import{i as t,n,r,t as i}from"./Icon-47kNA-4U.js";import{t as a}from"./jsx-runtime-DqZldVDK.js";var o,s,c,l,u,d;e((()=>{n(),t(),o=a(),s={title:`Components/Icon`,component:i,tags:[`autodocs`],args:{name:`arrow-right`,size:`md`},argTypes:{name:{control:`select`,options:r},size:{control:`select`,options:[`xs`,`sm`,`md`,`lg`,`xl`,`2xl`,`3xl`,`4xl`,`5xl`]}}},c={},l={render:()=>(0,o.jsx)(`div`,{className:`flex flex-wrap gap-6`,children:r.map(e=>(0,o.jsxs)(`div`,{className:`flex flex-col items-center gap-1`,children:[(0,o.jsx)(i,{name:e,size:`md`}),(0,o.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:e})]},e))})},u={render:()=>(0,o.jsx)(`div`,{className:`flex flex-wrap items-end gap-6`,children:[`xs`,`sm`,`md`,`lg`,`xl`,`2xl`].map(e=>(0,o.jsxs)(`div`,{className:`flex flex-col items-center gap-1`,children:[(0,o.jsx)(i,{name:`arrow-right`,size:e}),(0,o.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:e})]},e))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-6">
      {iconNames.map(name => <div key={name} className="flex flex-col items-center gap-1">
          <Icon name={name} size="md" />
          <span className="text-xs text-muted-foreground">{name}</span>
        </div>)}
    </div>
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-end gap-6">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map(size => <div key={size} className="flex flex-col items-center gap-1">
          <Icon name="arrow-right" size={size} />
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>)}
    </div>
}`,...u.parameters?.docs?.source}}},d=[`Default`,`AllIcons`,`AllSizes`]}))();export{l as AllIcons,u as AllSizes,c as Default,d as __namedExportsOrder,s as default};