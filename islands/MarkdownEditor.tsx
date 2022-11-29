import { useEffect, useRef } from "preact/hooks"
import { forwardRef } from 'preact/compat'
import {} from "preact/jsx-runtime"
import * as _ from 'npm:@types/ckeditor'

type MarkdownEditorProps = {
  initialContent?: string
}

const MarkdownEditor = forwardRef<CKEDITOR.editor | unknown, MarkdownEditorProps>((props, ref) => {
  const { initialContent } = props
  const ckEditor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // deno-lint-ignore no-explicit-any
    const { InlineEditor } = window as any

    if (!ckEditor.current) return
    if (!InlineEditor) return

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
  }, [])

  return (
    <>
      <script
        src="https://cdn.ckeditor.com/ckeditor5/35.3.2/inline/ckeditor.js"
      />
      <div ref={ckEditor} style={{ borderColor: 'lightgray' }} />
    </>
  )
})

export default MarkdownEditor
