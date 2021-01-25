const { join } = require('path')
const ImageHandler = require('..')

const publicPath = '/images'
const outputPath = join(__dirname, 'output', `${publicPath}`)

const handler = new ImageHandler({
  publicPath,
  outputPath,
  sizes: [320, 640, 960],
  placeholderSize: 20,
})

describe('ResponsivImageHandler', () => {
  beforeEach(async function () {
    await handler.clear()
  })
  it('It handles a regular image', async () => {
    const image = await handler.optimizeImagePath('__tests__/files/image.jpg')
    expect(image).toMatchInlineSnapshot(`
      Object {
        "height": 2908,
        "name": "image",
        "placeholder": "data:image/jpeg;base64,/9j/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wgARCAAPABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFAwb/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/aAAwDAQACEAMQAAAB6ZCNkU6Qhn//xAAcEAACAgIDAAAAAAAAAAAAAAABAhETBAUAAxL/2gAIAQEAAQUCLQOzLrDbWC+weHybU8Wc/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAIAQMBAT8BV//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EACAQAAIABAcAAAAAAAAAAAAAAAABAiExMxESInGBkZL/2gAIAQEABj8Co3sWouS2vRoWBNUM0+z/xAAcEAEAAwACAwAAAAAAAAAAAAABABEhMXGBkeH/2gAIAQEAAT8hGzoCWi+UEwPZ8Srpbze5NajkktgMY//aAAwDAQACAAMAAAAQ9y//xAAVEQEBAAAAAAAAAAAAAAAAAAABEP/aAAgBAwEBPxACP//EABYRAQEBAAAAAAAAAAAAAAAAAAARIf/aAAgBAgEBPxDUf//EAB8QAQACAQMFAAAAAAAAAAAAAAEAIRFBcaExUWGx4f/aAAgBAQABPxBgd0GHQCy55YGIdaj6hBotnk6g7bw2wg1Avj7Mp6IEJwjP/9k=",
        "src": "/images/image-61591c506580c4383bd037913fd729f0-320.jpg",
        "srcSet": "/images/image-61591c506580c4383bd037913fd729f0-320.jpg 320w, /images/image-61591c506580c4383bd037913fd729f0-640.jpg 640w, /images/image-61591c506580c4383bd037913fd729f0-960.jpg 960w",
        "webpSrcSet": "/images/image-61591c506580c4383bd037913fd729f0-320.webp 320w, /images/image-61591c506580c4383bd037913fd729f0-640.webp 640w, /images/image-61591c506580c4383bd037913fd729f0-960.webp 960w",
        "width": 3882,
      }
    `)
  })
  it('It handles a vector image', async () => {
    const image = await handler.optimizeImagePath('__tests__/files/vector.svg')
    expect(image).toMatchInlineSnapshot(`
      Object {
        "height": 128,
        "name": "vector",
        "placeholder": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEJ0lEQVQ4yz2UW0zbdRTHT8EXjdGHieJgFErvl3/Lv/dCC0JLKZRyMRDCxqKTBHHJsgi4CG5BmciMY4qy4djo2LiFQrl30tKW3iibPrgsxocZXzTRLYviElwG7f/465b4e/r9Hs7nfL/nnN+Bv3f+AbcvyMJkMg0y8sB4tA2ALgLRyU5Qnu4Dk3MKZPnqY7TU9KtcXLgt5Wne+rJnGvJzpCDkFLBEHBoEeQr4//y7vw+rkS1ARPJivaioP5IPEs1B4fETWs3Fb+WykuohiUCHMjaNBflapCVGlIsMk9xDkgw+mwICZJEkIOGqQcpTs+DasgfOOScUi/5QMHbn7r0/7j/YPTbrflgych0tky60LnuwzOVOFPafT0ptDUlZnipBCw0oFeg+V6vKQaMws+RCfXpKkJirAohuRuHC5WtnndNz6A9G8Pt1Pw7HbmPFoi9pnXUnHLHtRMusn2n0x7EiHk9Sn/SjUFr4e0G23EJsgVZoSpcLDTDe700BXwdvjhIaHc35+q8vPjw8MYNnbswkGta8yeroNmNxLzO2NS/z9tU1bJj3MnW+cLJuI4aiy6O/QUnZS5kKA6g5OpDxtRal2HiXEuhGoSMUAubxblnPnR+x46ef0bF1i6mKbmHF0iqWL6ygdWkN7bE4VoWjBOrDlhnfXuH6OmYPDDjNAM/JRIYhlaQY1bISlAv0R+Bg95mTp32Be72bYeze8Cc6g5v4htuNgksjaJlfegokSdAeiqLDH2ZqNsJMtS+MovNfPRFzlA8ogR7V0pJECkjxtQ6QjTnREgyj2eNN2r7zYdnSCmN0zaPVF0TbTS9aV26ijUCrvAG0h2OMnSi1E+uiwSEUcdVIgE9SMKXEhGR8coD/zXCkMhLDmnBs306sVm/FmZpInKmNkCZ4vGi+PoP6w+9iJbkTINYGI4x2M4Ds3o/vSw/JH9MEpJYWP1IIDZ9lHmCnQ+bxE+Ua1xzWbN/GJpd3r2lmnakMR7A6FGVsvgBT1DvASF8RYknvOab+1g8JSyic5E7ewNzW92ol2dRgCkiLixaL1VXPBpszMQ65H37UrnMvYPOsD49O+5hab4hxBCIJs3tp3zrl2qep4n1TexeWbseRNzWREFjfRHmOYi1XrM6ixcadVFMovq6UqATQ7/zJ4l4ZhczW9kLllTF/6fIq40jZJbUzzy1iJemwaX4Bqatje5xP+38RqkqRYtO7YpGuUiEqBDLUXSkggTWTOj5TKVuYT884dQrqQ1HgldfZlbUtqOzocdHDI0OSLy4M5vadbct4v0PMB3hBfkCgEMqNbLm4CBrK32E1WluBFhUFCHBES5XC0z+sxSRwP+hOa/vrURrP0QTUa5IuEvyqoacPNB4P5I07IaOzC7JIcurlfBDx1ESZIU1AloOQLAd2luB5CVelLCCW/wOhqABvKohZ+AAAAABJRU5ErkJggg==",
        "src": "/images/beae5b0f3d226dfa9c8767f3f5996404.svg",
        "width": 184,
      }
    `)
  })
})
