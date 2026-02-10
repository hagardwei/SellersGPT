import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
//   const { secret, path, tags } = await req.json()
  const { secret, path, tags } = await req.json()

//   if (secret !== process.env.REVALIDATE_SECRET) {
//     return NextResponse.json(
//       { error: 'Unauthorized' },
//       { status: 401 }
//     )
//   }

  if (path) {
    revalidatePath(path)
  }

  if (Array.isArray(tags)) {
    for (const tag of tags) {
      revalidateTag(tag)
    }
  }

  return NextResponse.json({
    revalidated: true,
    path,
    tags,
  })
}
