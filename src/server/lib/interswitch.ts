import axios from 'axios'

interface TokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface EscrowHoldParams {
  walletId: string
  amountKobo: number
  reference: string
}

interface EscrowHoldResponse {
  interswitchReference: string
  status: string
}

let tokenCache: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 30_000) {
    return tokenCache.value
  }

  const clientId = process.env.INTERSWITCH_CLIENT_ID!
  const secret = process.env.INTERSWITCH_SECRET!
  const baseUrl = process.env.INTERSWITCH_BASE_URL!

  const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64')

  const { data } = await axios.post<TokenResponse>(
    `${baseUrl}/passport/oauth/token`,
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  tokenCache = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return data.access_token
}

export async function initiateEscrowHold(
  params: EscrowHoldParams,
): Promise<EscrowHoldResponse> {
  const token = await getAccessToken()
  const baseUrl = process.env.INTERSWITCH_BASE_URL!

  const { data } = await axios.post<EscrowHoldResponse>(
    `${baseUrl}/api/v3/transfers`,
    {
      walletId: params.walletId,
      amount: params.amountKobo,
      reference: params.reference,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  )

  return {
    interswitchReference: data.interswitchReference,
    status: data.status,
  }
}

export async function releaseEscrow(_reference: string): Promise<void> {
  throw new Error('Not implemented: releaseEscrow')
}

export async function generatePaycode(
  _amountKobo: number,
  _reference: string,
): Promise<string> {
  throw new Error('Not implemented: generatePaycode')
}
