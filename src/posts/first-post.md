---
title: My First Post
date: 2012-08-20
layout: post.html
---
# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6

---

This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

This is a paragraph with `inline code` and an emoji 👻. Some **strong**, some *italic*. Learn more about Metalsmith – [Linky](http://metalsmith.io)

> This is a blockquote

- List Item
- excepteur sint
- occaecat cupidatat non proident
- sunt in culpa qui officia
- deserunt
- mollit anim id est laborum

```
// Code Block
const food = document.querySelector('.pizza')
food.style.borderBottomWidth = '10rem'
food.order({
  delivery: true
}, (err, status) => {
  if(err) console.log(err)
  if(status === 'delivered'){
    return eat()
  } else {
    return wait()
  }
})
```
