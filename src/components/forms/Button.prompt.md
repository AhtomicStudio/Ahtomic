Button — the studio's action control; use `primary` (red) at most once per view, `secondary` for everything else.

```jsx
<Button variant="primary" size="lg">Start a project</Button>
<Button variant="secondary">View work</Button>
<Button variant="ghost" size="sm">Cancel</Button>
```

Variants: `primary` (red fill), `secondary` (1px outline), `ghost` (text only), `inverse` (white fill, for red/hero contexts). Sizes sm/md/lg (34/42/52px). Pass `href` to render a link.
