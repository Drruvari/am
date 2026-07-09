import image480Jpg from '@/assets/images/image-480.jpg'
import image480Webp from '@/assets/images/image-480.webp'
import image600Jpg from '@/assets/images/image-600.jpg'
import image600Webp from '@/assets/images/image-600.webp'
import image800Jpg from '@/assets/images/image-800.jpg'
import image800Webp from '@/assets/images/image-800.webp'
import image1600Jpg from '@/assets/images/image-1600.jpg'
import image1600Webp from '@/assets/images/image-1600.webp'

export const images = {
  jpg: {
    480: image480Jpg,
    600: image600Jpg,
    800: image800Jpg,
    1600: image1600Jpg,
  },
  webp: {
    480: image480Webp,
    600: image600Webp,
    800: image800Webp,
    1600: image1600Webp,
  },
} as const

export const cardSrcsetWebp = `${image480Webp} 480w, ${image600Webp} 600w, ${image800Webp} 800w, ${image1600Webp} 1470w`
export const cardSrcsetJpg = `${image480Jpg} 480w, ${image600Jpg} 600w, ${image800Jpg} 800w, ${image1600Jpg} 1470w`
export const cardSizes = '(max-width: 48rem) 100vw, 50vw'

export const heroSrcsetWebp = `${image600Webp} 600w, ${image1600Webp} 1470w`
export const heroSrcsetJpg = `${image600Jpg} 600w, ${image1600Jpg} 1470w`

export const projectGalleryImages = `${image600Webp}|${image600Webp}|${image600Webp}`
