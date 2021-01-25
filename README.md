# Responsiv image handler

`npm i responsiv-image-handler`

## Usage

```
const ImageHandler = require('responsiv-image-handler')
const { join } = require('path')

const publicPath = '/images'
const output = join(__dirname, '..', `src${publicPath}`)

const handler = new ImageHandler({
  output: '/images', // Images will be served from this directory on your website
  publicPath, join(__dirname, 'build/images') // Directory for where images as stored
  sizes: [320, 640, 960], 
  placeholderSize: 20,
  sizes = [320, 640, 960, 1100, 1600], // List of sizes you want to be generated for jpg/png and webp
  quality = 65, // Image size for generated images in jpg/png/webp
  placeholderSize = 40, // Size in pixel for base64 preview
})

// Generate sizes for a image
const image = await handler.optimizeImagePath('src/image.jpg')

```

`image` will then look like this:

```
{
  height: 2908,
  width: 3882,
  name: "image",
  placeholder: "data:image/jpeg;base64,..",
  src: "/images/image-b124abd136fffe44501bac559c7dd89a-320.jpg",
  srcSet: "/images/image-b124abd136fffe44501bac559c7dd89a-320.jpg 320w, /images/image-b124abd136fffe44501bac559c7dd89a-640.jpg 640w, /images/image-b124abd136fffe44501bac559c7dd89a-960.jpg 960w",
  webpSrcSet: "/images/image-b124abd136fffe44501bac559c7dd89a-320.webp 320w, /images/image-b124abd136fffe44501bac559c7dd89a-640.webp 640w, /images/image-b124abd136fffe44501bac559c7dd89a-960.webp 960w"
}

```
