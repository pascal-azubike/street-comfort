import { Editor } from '@tiptap/react'
import { 
    Bold, Italic, Link as LinkIcon, Image as ImageIcon,
    Heading1, Heading2, Quote 
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BubbleToolbarProps {
    editor: Editor
}

export function BubbleToolbar({ editor }: BubbleToolbarProps) {
    const addImage = () => {
        const url = window.prompt('Enter image URL')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('Enter URL', previousUrl)
        
        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().unsetLink().run()
            return
        }

        editor.chain().focus().setLink({ href: url }).run()
    }

    return (
        <div className="flex items-center gap-1 p-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-active={editor.isActive('bold')}
                className="h-8 w-8 p-0 data-[active=true]:bg-[#593C2D]/10"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-active={editor.isActive('italic')}
                className="h-8 w-8 p-0 data-[active=true]:bg-[#593C2D]/10"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-[#593C2D]/10" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                data-active={editor.isActive('heading', { level: 1 })}
                className="h-8 w-8 p-0 data-[active=true]:bg-[#593C2D]/10"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                data-active={editor.isActive('heading', { level: 2 })}
                className="h-8 w-8 p-0 data-[active=true]:bg-[#593C2D]/10"
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-[#593C2D]/10" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                data-active={editor.isActive('blockquote')}
                className="h-8 w-8 p-0 data-[active=true]:bg-[#593C2D]/10"
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={setLink}
                data-active={editor.isActive('link')}
                className="h-8 w-8 p-0 data-[active=true]:bg-[#593C2D]/10"
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={addImage}
                className="h-8 w-8 p-0"
            >
                <ImageIcon className="h-4 w-4" />
            </Button>
        </div>
    )
} 