import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

const PLAN_LIMITS: Record<string, number> = {
    PRO: 1000,
    BUSINESS: 2000
}
const REQUIRED = ['name', 'price']
const EXAMPLE_SKU_MARKER = 'TS-RED-L'

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })

        const bot = await prisma.bot.findUnique({
            where: { userId: session.user.id },
            include: { user: { include: { subscription: true } } }
        })
        if (!bot) return NextResponse.json({ success: false, error: 'BOT_NOT_FOUND' }, { status: 404 })

        const plan = bot.user.subscription?.plan
        const limit = plan ? PLAN_LIMITS[plan] : undefined
        if (!limit) {
            return NextResponse.json({ success: false, error: 'PRODUCT_UPLOAD_REQUIRES_PRO_OR_BUSINESS' }, { status: 403 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File | null
        if (!file) return NextResponse.json({ success: false, error: 'NO_FILE' }, { status: 400 })

        const buffer = Buffer.from(await file.arrayBuffer())
        const workbook = XLSX.read(buffer, { type: 'buffer' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        if (rows.length === 0) {
            return NextResponse.json({ success: false, error: 'EMPTY_FILE' }, { status: 400 })
        }

        const headers = Object.keys(rows[0]).map(h => h.trim().toLowerCase())
        // console.log(headers)
        const missing = REQUIRED.filter(r => !headers.includes(r))
        // console.log("missing, ", missing)
        if (missing.length > 0) {
            return NextResponse.json(
                { success: false, error: 'MISSING_HEADERS', missing },
                { status: 400 }
            )
        }

        const errors: { row: number; reason: string }[] = []
        const valid: { name: string; variant: string | null; price: number; stock: number; sku: string | null }[] = []


        rows.forEach((raw, i) => {
            // console.log(i, raw)
            const rowNum = i + 2
            const norm: Record<string, any> = {}
            for (const key in raw) norm[key.trim().toLowerCase()] = raw[key]

            // if (norm.sku === EXAMPLE_SKU_MARKER) return

            const name = String(norm.name ?? '').trim()
            if (!name) {
                errors.push({ row: rowNum, reason: 'MISSING_NAME' })
                return
            }

            const priceNum = Number(norm.price)
            if (norm.price === '' || isNaN(priceNum) || priceNum < 0) {
                errors.push({ row: rowNum, reason: 'INVALID_PRICE' })
                return
            }

            let stockNum = 0
            if (norm.stock !== '' && norm.stock !== undefined) {
                const parsed = Number(norm.stock)
                if (isNaN(parsed) || parsed < 0) {
                    errors.push({ row: rowNum, reason: 'INVALID_STOCK' })
                    return
                }
                stockNum = parsed
            }

            valid.push({
                name,
                variant: norm.variant ? String(norm.variant).trim() : null,
                price: priceNum,
                stock: stockNum,
                sku: norm.sku ? String(norm.sku).trim() : null
            })
        })
        console.log(valid)

        if (valid.length > limit) {
            return NextResponse.json(
                { success: false, error: 'PRODUCT_LIMIT_EXCEEDED', limit, received: valid.length },
                { status: 400 }
            )
        }

        await prisma.$transaction([
            prisma.product.deleteMany({ where: { botId: bot.id } }),
            prisma.product.createMany({
                data: valid.map(p => ({ ...p, botId: bot.id }))
            })
        ])
 
        return NextResponse.json({
            success: true,
            imported: valid.length,
            rejected: errors.length,
            errors
        })

    } catch (err) {
        console.error('error in product upload route:', err)
        return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 })
    }
}