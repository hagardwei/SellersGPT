import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { saveSocialToken } from '@/utilities/social/service'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  const { platform } = await context.params
  const searchParams = req.nextUrl.searchParams


  console.log('🔐 [OAuth] Incoming request')
  console.log('🔐 Platform:', platform)
  console.log('🔐 Query params:', Object.fromEntries(searchParams.entries()))

  const payload = await getPayload({ config: configPromise })

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const callbackUrl = `${serverUrl}/api/social/auth/${platform}`

  console.log('🔁 Callback URL:', callbackUrl)

  // 1️⃣ Initial Auth Redirect
  if (!searchParams.has('code')) {
    console.log('➡️ [OAuth] Initial authorization request')
      const userId = searchParams.get('userId')
      if (!userId) {
        return NextResponse.json(
          { error: 'Missing userId in request' },
          { status: 400 }
        )
      }

    let authUrl = ''

    switch (platform) {
      case 'linkedin':
        authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${callbackUrl}&state=${userId}&scope=w_member_social%20openid%20profile%20email%20r_profile_basicinfo`
        break

      case 'facebook':
        authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${callbackUrl}&state=${userId}&scope=pages_manage_posts,pages_read_engagement,pages_show_list,public_profile`
        break

      case 'twitter':
        authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${callbackUrl}&state=${userId}&scope=tweet.read%20tweet.write%20users.read%20offline.access&code_challenge=challenge&code_challenge_method=plain`
        break

      default:
        console.error('❌ Unsupported platform:', platform)
        return NextResponse.json(
          { error: 'Unsupported platform' },
          { status: 400 }
        )
    }

    console.log('🚀 Redirecting to:', authUrl)
    return NextResponse.redirect(authUrl)
  }

  // 2️⃣ Callback Handling
  console.log('⬅️ [OAuth] Callback received')

  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    console.error('❌ OAuth provider returned error:', error)
    return NextResponse.json(
      { error: searchParams.get('error_description') || error },
      { status: 400 }
    )
  }

  if (!code || !state ) {
    console.error('❌ Missing code or invalid state')
    return NextResponse.json(
      { error: 'Missing code or user identification' },
      { status: 400 }
    )
  }

  console.log('✅ Code received')
  console.log('👤 User ID (state):', state)
  console.log('👤 User ID (state):', callbackUrl)

  try {
    let tokenUrl = ''
    let body: any = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: callbackUrl,
      client_id: '',
      client_secret: '',
    }

    switch (platform) {
      case 'linkedin':
        tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken'
        body.client_id = process.env.LINKEDIN_CLIENT_ID
        body.client_secret = process.env.LINKEDIN_CLIENT_SECRET
        break

      case 'facebook':
        tokenUrl = 'https://graph.facebook.com/v12.0/oauth/access_token'
        body.client_id = process.env.FACEBOOK_APP_ID
        body.client_secret = process.env.FACEBOOK_APP_SECRET
        break

      case 'twitter':
        tokenUrl = 'https://api.twitter.com/2/oauth2/token'
        body.client_id = process.env.TWITTER_CLIENT_ID
        body.client_secret = process.env.TWITTER_CLIENT_SECRET
        body.code_verifier = 'challenge'
        break
    }

    console.log('🔄 Exchanging code for token...')
    console.log('🔗 Token URL:', tokenUrl)

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body),
    })

    const data: any = await response.json()

    console.log('📨 Token response status:', response.status)
    console.log('📨 Token response body:', data)

    if (!response.ok) {
      console.error(`❌ OAuth error for ${platform}:`, data)
      return NextResponse.json(
        {
          error:
            data.error_description ||
            data.error ||
            'Failed to exchange code for token',
        },
        { status: 400 }
      )
    }

    console.log('💾 Saving token for user:', state)

    await saveSocialToken(state, platform, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(
        Date.now() + (data.expires_in || 3600) * 1000
      ),
      scope: data.scope,
    })

    console.log('✅ Token saved successfully')

    const adminUrl = `${serverUrl}/admin/collections/users/${state}`

    console.log('↩️ Redirecting back to admin:', adminUrl)

    return NextResponse.redirect(adminUrl)
  } catch (err: any) {
    console.error('🔥 OAuth processing error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}