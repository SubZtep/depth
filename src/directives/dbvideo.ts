import type { Directive, DirectiveBinding } from "vue"
import DbQueries from "../packages/Supabase/dbqueries"

/**
 * Make sure, video element exists in db, binding updated to id
 */

type DBVideoBinding = DirectiveBinding<(id?: number) => void>

let db: DbQueries
const cachedSrcVideoIds = new Map<string, number>()

function addVideo(el: HTMLVideoElement, src: string, binding: DBVideoBinding) {
  db.addVideo({
    filename: src,
    width: el.videoWidth,
    height: el.videoHeight,
    duration: el.duration,
  }).then(id => {
    cachedSrcVideoIds.set(src, id)
    if (el.src === src) {
      binding.value.call(null, id)
    }
  })
}

function videoId(el: HTMLVideoElement, binding: DBVideoBinding): Promise<void> {
  const src = el.src

  return new Promise(resolve => {
    db.hasVideo(src).then(id => {
      if (id) {
        cachedSrcVideoIds.set(src, id)
        if (el.src === src) {
          binding.value.call(null, id)
        }
        return resolve()
      } else {
        if (el.readyState > el.HAVE_NOTHING) {
          addVideo(el, src, binding)
        } else {
          el.addEventListener("loadedmetadata", () => addVideo(el, src, binding), { once: true })
        }
      }
    })
  })
}

function hasVideoFilled(el: HTMLVideoElement) {
  // FIXME: check it better
  return el.src.indexOf(".") !== -1
}

export default (async (el, binding: DBVideoBinding) => {
  if (!db) db = new DbQueries(globalThis.supabase)

  if (!hasVideoFilled(el)) {
    binding.value.call(null, undefined)
    return
  }

  if (!cachedSrcVideoIds.has(el.src)) {
    binding.value.call(null, undefined)
    await videoId(el, binding)
    return
  }

  if (cachedSrcVideoIds.has(el.src)) {
    binding.value.call(null, cachedSrcVideoIds.get(el.src))
  }
}) as Directive
