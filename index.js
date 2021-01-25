const { parse } = require('path')
const { stat, readFile, writeFile } = require('fs').promises
const crypto = require('crypto')
const mkdirp = require('mkdirp')
const sharp = require('sharp')
const util = require('util')
const rimraf = util.promisify(require('rimraf'))
const SVGO = require('svgo')
const { promisify } = require('util')

const svgo = new SVGO()

promisify(svgo.optimize)

class ImageHandler {
  constructor({
    publicPath,
    outputPath,
    sizes = [320, 640, 960, 1100, 1600],
    quality = 65,
    placeholderSize = 40,
  }) {
    this.publicPath = publicPath
    this.outputPath = outputPath
    this.sizes = sizes
    this.mimes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      avif: 'image/avif',
    }
    this.quality = quality
    this.placeholderSize = placeholderSize
  }
  async clear() {
    await rimraf(this.outputPath)
    await mkdirp(this.outputPath)
  }
  createPlaceholder(data, mime) {
    return `data:${mime};base64,${data.toString('base64')}`
  }
  getPublicPath(str) {
    return `${this.publicPath}/${str}`
  }
  createSrcSet(files) {
    return files
      .map(({ src, width }) => `${this.getPublicPath(src)} ${width}w`)
      .join(', ')
  }
  createContentDigest(input) {
    const content = typeof input !== 'string' ? JSON.stringify(input) : input
    return crypto.createHash('md5').update(content).digest('hex')
  }
  async getFile(path) {
    const stats = await stat(path)
    const digest = this.createContentDigest({
      stats,
      absolutePath: path,
    })
    const { name, base } = parse(path)
    const [, ext] = base.split('.')
    return {
      path,
      digest,
      name,
      ext,
      mime: this.mimes[ext],
    }
  }
  findFormat(ext) {
    if (ext === 'png' || ext === 'svg') {
      return 'png'
    }
    return 'jpg'
  }
  async optimizeImageSvg(file) {
    const src = `${file.digest}.${file.ext}`
    const readIn = await readFile(file.path, 'utf-8')
    const { data } = await svgo.optimize(readIn)
    const savePath = `${this.outputPath}/${src}`
    await writeFile(savePath, data, 'utf-8')
    return [{ src }]
  }
  async optimizeImagePath(path) {
    const file = await this.getFile(path)
    const image = sharp(file.path)
    const ext = this.findFormat(file.ext)
    const mime = this.mimes[ext]
    const { width, height } = await image.metadata()
    let jpgs,
      webp,
      placeholderData = null
    placeholderData = await this.writeFile({
      image,
      width: this.placeholderSize,
      toBuffer: true,
      ext,
    })
    const isVector = file.ext === 'svg'
    if (isVector) {
      jpgs = await this.optimizeImageSvg(file)
    } else {
      jpgs = await this.transformImage({
        image,
        file,
        ext,
      })
      webp = await this.transformImage({
        image,
        file,
        ext: 'webp',
      })
    }
    const { src } = jpgs[0]
    let data = {
      src: this.getPublicPath(src),
      height,
      width,
      name: file.name,
      placeholder: placeholderData
        ? this.createPlaceholder(placeholderData, mime)
        : null,
    }
    if (!isVector) {
      data.srcSet = this.createSrcSet(jpgs)
      data.webpSrcSet = this.createSrcSet(webp)
    }
    return data
  }
  async transformImage({ image, file, ext }) {
    const metadata = await image.metadata()
    const promises = []
    const widthsToGenerate = new Set()
    const isVector = file.ext === 'svg'
    this.sizes.forEach((size) => {
      const usedWith = isVector ? size : metadata.width
      const width = Math.min(usedWith, size)
      // Only resize images if they aren't an exact copy of one already being resized...
      if (!widthsToGenerate.has(width)) {
        widthsToGenerate.add(width)
        const baseName = `${file.name}-${file.digest}-${width}`
        promises.push(
          this.writeFile({
            image,
            width,
            ext,
            baseName,
          })
        )
      }
    })
    const res = await Promise.all(promises)
    return res
  }
  async writeFile({ image, width, ext = 'jpg', baseName, toBuffer }) {
    return new Promise((resolve, reject) => {
      let resized = image.clone().resize(width, null)
      if (ext === 'jpg') {
        resized = resized.jpeg({
          quality: this.quality,
          progressive: true,
        })
      }
      if (ext === 'png' || ext === 'svg') {
        resized = image
          .clone()
          .png({
            quality: this.quality,
          })
          .resize(width, null)
      }
      if (ext === 'webp') {
        resized = resized.webp({
          quality: this.quality,
        })
      }
      if (toBuffer) {
        resized.toBuffer((err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      } else {
        const src = `${baseName}.${ext}`
        const savePath = `${this.outputPath}/${src}`
        resized.toFile(savePath, (err, { width, height }) => {
          if (err) {
            return reject(err)
          }
          resolve({
            ext,
            src,
            width,
            height,
          })
        })
      }
    })
  }
}

module.exports = ImageHandler
