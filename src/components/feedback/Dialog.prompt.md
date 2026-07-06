Dialog — modal on a blurred dark scrim; clicking the scrim closes.

```jsx
<Dialog open={open} onClose={close} title="Send inquiry?"
  description="We'll reply within two days."
  actions={<><Button variant="ghost" onClick={close}>Cancel</Button><Button onClick={send}>Send</Button></>} />
```
