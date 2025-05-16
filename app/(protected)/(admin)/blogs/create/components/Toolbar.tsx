import { Editor } from '@tiptap/react'
import { 
    Bold, Italic, List, ListOrdered, Image as ImageIcon, 
    Link as LinkIcon, Heading1, Heading2, Heading3, Quote 
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ToolbarProps {
    editor: Editor | null
}

export function Toolbar({ editor }: ToolbarProps) {
    if (!editor) return null

    const addImage = () => {
        const url = window.prompt('Enter image URL')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const setLink = () => {
        const url = window.prompt('Enter URL')
        if (url) {
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    return (
        <div className="border-b border-[#593C2D]/10 bg-white p-2 flex flex-wrap gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-active={editor.isActive('bold')}
                className="data-[active=true]:bg-[#593C2D]/10"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-active={editor.isActive('italic')}
                className="data-[active=true]:bg-[#593C2D]/10"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                data-active={editor.isActive('heading', { level: 1 })}
                className="data-[active=true]:bg-[#593C2D]/10"
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                data-active={editor.isActive('heading', { level: 2 })}
                className="data-[active=true]:bg-[#593C2D]/10"
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                data-active={editor.isActive('heading', { level: 3 })}
                className="data-[active=true]:bg-[#593C2D]/10"
            >
                <Heading3 className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                data-active={editor.isActive('bulletList')}
                className="data-[active=true]:bg-[#593C2D]/10"
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                data-active={editor.isActive('orderedList')}
                className="data-[active=true]:bg-[#593C2D]/10"
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                data-active={editor.isActive('blockquote')}
                className="data-[active=true]:bg-[#593C2D]/10"
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={addImage}
            >
                <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={setLink}
                data-active={editor.isActive('link')}
                className="data-[active=true]:bg-[#593C2D]/10"
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
        </div>
    )
} 