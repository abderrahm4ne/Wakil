import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
    try {
        const session = await auth();
        if (!session) return NextResponse.json(
            { success: false, error: 'UNAUTHORIZED' }, { status: 401 }
        )

        const params = new URLSearchParams({
            client_id: process.env.META_APP_ID!,
            redirect_uri: `${process.env.NEXTAUTH_URL}/api/oauth/meta/callback`,
            scope: 'pages_messaging,pages_read_engagement,pages_manage_metadata',
            response_type: 'code',
            state: session.user.id
        })

        const metaOAuthUrl = `https://www.facebook.com/dialog/oauth?${params.toString()}`
        
        return NextResponse.redirect(metaOAuthUrl)
    }
    catch (err) {
        console.error('error in meta oauth GET route',err)
        return NextResponse.json(
            { success: false, error: 'SERVER_ERROR' }, { status: 500 }
        )
    }
}