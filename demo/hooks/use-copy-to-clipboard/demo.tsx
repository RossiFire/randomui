'use client'

import { useState } from 'react'
import { useCopyToClipboard } from './use-copy-to-clipboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { DemoBlock } from '@/components/demoBlock'
import { cn } from '@/lib/utils'

export default function CopyToClipboardDemo() {

  const {
    copy,
    isCopied,
    copiedText,
  } = useCopyToClipboard({ resetAfter: 3000 })

  const handleCopyStaticText = () => {
    copy('Hello, World!')
  }

  const handleCopyCode = () => {
    const codeBlock = `const { copy, isCopied } = useCopyToClipboard()

const handleCopy = () => {
  copy('Hello, World!')
}`
    copy(codeBlock)
  }

  return (
    <DemoBlock containerClassName='h-[400px]'>
    <div className="text-center flex flex-col gap-4 items-center">
      <div className='flex gap-2 items-center justify-center'>
        <span>Status:</span>
        <Badge variant={isCopied ? 'default' : 'secondary'} className={cn(isCopied && 'bg-green-500')}>{isCopied ? 'Copied' : 'Not Copied'}</Badge>
      </div>
      <div className="text-lg font-semibold text-fd-foreground">
        Copy to clipboard hook
      </div>
      <div className='flex gap-2 items-center'>
        <Button onClick={handleCopyStaticText}>Copy "Hello, World!"</Button>
        <Button onClick={handleCopyCode}>Copy Code Block</Button>
      </div>
      {copiedText && <Alert variant="success" className='rounded-md mx-auto max-w-md p-4 mt-8'>
        {copiedText}
      </Alert>}
    </div>
  </DemoBlock>
  )
}
