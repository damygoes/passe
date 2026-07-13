import{i as e}from"./preload-helper-CT_b8DTk.js";import{t}from"./jsx-runtime-DqZldVDK.js";import{r as n,t as r}from"./Button-CU-Smr7A.js";import{n as i,t as a}from"./Input-Bk2YsSd0.js";import{a as o,c as s,i as c,l,n as u,o as d,r as f,s as p,t as m}from"./Sheet-nM22uJr0.js";var h,g,_,v,y,b,x;e((()=>{n(),i(),l(),h=t(),g={title:`Components/Sheet`,component:m,tags:[`autodocs`]},_={render:()=>(0,h.jsxs)(m,{children:[(0,h.jsx)(s,{render:(0,h.jsx)(r,{variant:`outline`,children:`Open`})}),(0,h.jsxs)(f,{children:[(0,h.jsxs)(d,{children:[(0,h.jsx)(p,{children:`Trip details`}),(0,h.jsx)(c,{children:`View and edit the details of this trip.`})]}),(0,h.jsxs)(o,{children:[(0,h.jsx)(u,{render:(0,h.jsx)(r,{variant:`outline`,children:`Cancel`})}),(0,h.jsx)(r,{children:`Save`})]})]})]})},v={render:()=>(0,h.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,h.jsxs)(m,{children:[(0,h.jsx)(s,{render:(0,h.jsx)(r,{variant:`outline`,children:`Top`})}),(0,h.jsx)(f,{side:`top`,children:(0,h.jsxs)(d,{children:[(0,h.jsx)(p,{children:`Top sheet`}),(0,h.jsx)(c,{children:`Slides in from the top.`})]})})]}),(0,h.jsxs)(m,{children:[(0,h.jsx)(s,{render:(0,h.jsx)(r,{variant:`outline`,children:`Right`})}),(0,h.jsx)(f,{side:`right`,children:(0,h.jsxs)(d,{children:[(0,h.jsx)(p,{children:`Right sheet`}),(0,h.jsx)(c,{children:`Slides in from the right.`})]})})]}),(0,h.jsxs)(m,{children:[(0,h.jsx)(s,{render:(0,h.jsx)(r,{variant:`outline`,children:`Bottom`})}),(0,h.jsx)(f,{side:`bottom`,children:(0,h.jsxs)(d,{children:[(0,h.jsx)(p,{children:`Bottom sheet`}),(0,h.jsx)(c,{children:`Slides in from the bottom.`})]})})]}),(0,h.jsxs)(m,{children:[(0,h.jsx)(s,{render:(0,h.jsx)(r,{variant:`outline`,children:`Left`})}),(0,h.jsx)(f,{side:`left`,children:(0,h.jsxs)(d,{children:[(0,h.jsx)(p,{children:`Left sheet`}),(0,h.jsx)(c,{children:`Slides in from the left.`})]})})]})]})},y={render:()=>(0,h.jsxs)(m,{children:[(0,h.jsx)(s,{render:(0,h.jsx)(r,{variant:`outline`,children:`Open`})}),(0,h.jsxs)(f,{showCloseButton:!1,children:[(0,h.jsxs)(d,{children:[(0,h.jsx)(p,{children:`Delete trip`}),(0,h.jsx)(c,{children:`This action cannot be undone.`})]}),(0,h.jsxs)(o,{children:[(0,h.jsx)(u,{render:(0,h.jsx)(r,{variant:`outline`,children:`Cancel`})}),(0,h.jsx)(r,{variant:`destructive`,children:`Delete`})]})]})]})},b={render:()=>(0,h.jsxs)(m,{children:[(0,h.jsx)(s,{render:(0,h.jsx)(r,{variant:`outline`,children:`Edit trip name`})}),(0,h.jsxs)(f,{children:[(0,h.jsxs)(d,{children:[(0,h.jsx)(p,{children:`Edit trip name`}),(0,h.jsx)(c,{children:`Update the name shown on your trip page.`})]}),(0,h.jsx)(`div`,{className:`px-4`,children:(0,h.jsx)(a,{defaultValue:`Morocco, 2024`})}),(0,h.jsxs)(o,{children:[(0,h.jsx)(u,{render:(0,h.jsx)(r,{variant:`outline`,children:`Cancel`})}),(0,h.jsx)(r,{children:`Save`})]})]})]})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Sheet>
      <SheetTrigger render={<Button variant="outline">Open</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Trip details</SheetTitle>
          <SheetDescription>View and edit the details of this trip.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Sheet>
        <SheetTrigger render={<Button variant="outline">Top</Button>} />
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Top sheet</SheetTitle>
            <SheetDescription>Slides in from the top.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger render={<Button variant="outline">Right</Button>} />
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Right sheet</SheetTitle>
            <SheetDescription>Slides in from the right.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger render={<Button variant="outline">Bottom</Button>} />
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Bottom sheet</SheetTitle>
            <SheetDescription>Slides in from the bottom.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger render={<Button variant="outline">Left</Button>} />
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Left sheet</SheetTitle>
            <SheetDescription>Slides in from the left.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Sheet>
      <SheetTrigger render={<Button variant="outline">Open</Button>} />
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Delete trip</SheetTitle>
          <SheetDescription>This action cannot be undone.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Sheet>
      <SheetTrigger render={<Button variant="outline">Edit trip name</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit trip name</SheetTitle>
          <SheetDescription>Update the name shown on your trip page.</SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <Input defaultValue="Morocco, 2024" />
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
}`,...b.parameters?.docs?.source}}},x=[`Default`,`Sides`,`WithoutCloseButton`,`EditForm`]}))();export{_ as Default,b as EditForm,v as Sides,y as WithoutCloseButton,x as __namedExportsOrder,g as default};