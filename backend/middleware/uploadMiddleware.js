// middleware/uploadMiddleware.js
// Handles all file uploads:
//   - KYC documents (PDF, JPG, PNG — 5MB max)
//   - Product images (JPG, PNG, WEBP — 10MB max each, up to 10)
//   - Product videos (MP4, MOV, WEBM — 50MB max)
//   - Store logo (JPG, PNG, WEBP — 5MB max)

import multer   from 'multer'
import path     from 'path'
import fs       from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// ── Create upload directories ─────────────────────────
const dirs = ['kyc', 'products', 'store']
dirs.forEach(dir => {
    const p = path.join(__dirname, '..', 'uploads', dir)
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
})

// ── Storage factory ───────────────────────────────────
function makeStorage(folder) {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '..', 'uploads', folder))
        },
        filename: (req, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
            const ext    = path.extname(file.originalname).toLowerCase()
            cb(null, file.fieldname + '-' + unique + ext)
        },
    })
}

// ── KYC uploads ───────────────────────────────────────
const kycFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png']
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true)
    else cb(new Error('Only PDF, JPG and PNG files are allowed'))
}

export const uploadKYCDocs = multer({
    storage:    makeStorage('kyc'),
    fileFilter: kycFilter,
    limits:     { fileSize: 5 * 1024 * 1024 },
}).fields([
    { name: 'gstCert',      maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'bizRegCert',   maxCount: 1 },
])

// ── Product images + video ────────────────────────────
const productFilter = (req, file, cb) => {
    const imageExts = ['.jpg', '.jpeg', '.png', '.webp']
    const videoExts = ['.mp4', '.mov', '.webm']
    const ext       = path.extname(file.originalname).toLowerCase()

    if ([...imageExts, ...videoExts].includes(ext)) cb(null, true)
    else cb(new Error('Only JPG, PNG, WEBP images and MP4, MOV, WEBM videos allowed'))
}

export const uploadProductMedia = multer({
    storage:    makeStorage('products'),
    fileFilter: productFilter,
    limits:     { fileSize: 50 * 1024 * 1024 }, // 50MB max for videos
}).fields([
    { name: 'images', maxCount: 10 },
    { name: 'video',  maxCount: 1  },
])

// ── Store logo ────────────────────────────────────────
const logoFilter = (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp']
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true)
    else cb(new Error('Only JPG, PNG and WEBP files allowed for logo'))
}

export const uploadStoreLogo = multer({
    storage:    makeStorage('store'),
    fileFilter: logoFilter,
    limits:     { fileSize: 5 * 1024 * 1024 },
}).single('logo')

export default { uploadKYCDocs, uploadProductMedia, uploadStoreLogo }