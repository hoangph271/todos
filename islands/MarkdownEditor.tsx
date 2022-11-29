import { useEffect, useRef, useState } from "preact/hooks"
import { forwardRef } from 'preact/compat'
import {} from "preact/jsx-runtime"
import * as _ from 'npm:@types/ckeditor'

type MarkdownEditorProps = {
  initialContent?: string
}

const useInitCkEditor = () => {
  // deno-lint-ignore no-explicit-any
  const [done, setIsDone] = useState(!!(window as any).InlineEditor)

  useEffect(() => {
    if (done) return

    const ckEditorScript = document.createElement('script')
    ckEditorScript.src = 'https://cdn.ckeditor.com/ckeditor5/35.3.2/inline/ckeditor.js'
    ckEditorScript.addEventListener('load', () => {
      setIsDone(true)
    })
    document.body.appendChild(ckEditorScript)
  }, [done])

  return done
}

const MarkdownEditor = forwardRef<CKEDITOR.editor | unknown, MarkdownEditorProps>((props, ref) => {
  const { initialContent } = props
  const ckEditor = useRef<HTMLDivElement>(null)

  const initDone = useInitCkEditor()

  useEffect(() => {
    if (!ckEditor.current) return
    if (!initDone) return

    // deno-lint-ignore no-explicit-any
    const { InlineEditor } = window as any

    InlineEditor
      .create(ckEditor.current)
      .then((editor: CKEDITOR.editor) => {
        // deno-lint-ignore no-explicit-any
        (ref as any).current = editor
        editor.setData(initialContent ?? '')
      })
      .catch((error: unknown) => {
        console.error('InlineEditor error:')
        console.error(error)
      })
  }, [initDone])

  return (
    <div ref={ckEditor} style={{ borderColor: 'lightgray' }} />
  )
})

export default MarkdownEditor
