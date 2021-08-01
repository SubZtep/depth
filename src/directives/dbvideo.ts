import type { Directive, DirectiveBinding } from "vue"
import DbQueries from "../packages/Supabase/dbqueries"

/**
 * Make sure, video element exists in db, binding updated to id
 */

type DBVideoBinding = DirectiveBinding<(id?: number) => void>

let db: DbQueries

async function addVideo(el: HTMLVideoElement, filename: string, binding: DBVideoBinding) {
  let id: number
  try {
    id = await db.addVideo({
      filename,
      width: el.videoWidth,
      height: el.videoHeight,
      duration: el.duration,
    })
  } catch (e) {
    console.error(e)
    return
  }
  binding.value.call(null, id)
}

async function videoId(el: HTMLVideoElement, filename: string, binding: DBVideoBinding): Promise<void> {
  const id = await db.hasVideo(filename)
  if (id) {
    binding.value.call(null, id)
    return
  }

  if (el.readyState > el.HAVE_NOTHING) {
    addVideo(el, filename, binding)
  } else {
    el.addEventListener("loadedmetadata", () => addVideo(el, filename, binding), { once: true })
  }
}


export default (async (el, binding: DBVideoBinding) => {
  if (!db) db = new DbQueries(globalThis.supabase)

  const src = el.src.split("/").pop()!
  if (!src) {
    binding.value.call(null, undefined)
    return
  }

  await videoId(el, src, binding)
}) as Directive
