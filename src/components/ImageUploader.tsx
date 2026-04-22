import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'

interface Props {
  onImageReady: (url: string) => void
}

export default function ImageUploader({ onImageReady }: Props) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageReady(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: 'var(--primary-navy)', marginBottom: '1rem' }}>ارفع صورتك</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        للحصول على أفضل النتائج، استخدم صورة شخصية واضحة بخلفية نظيفة.
      </p>
      
      <label 
        className={`upload-zone ${isDragging ? 'drag-active' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={onFileInput} 
          style={{ display: 'none' }} 
        />
        <Upload size={48} className="upload-icon" />
        <h3 style={{ color: 'var(--primary-navy)' }}>انقر أو اسحب الصورة هنا</h3>
        <p style={{ color: 'var(--text-muted)' }}>JPEG, PNG بحد أقصى 10MB</p>
        <div className="button-secondary" style={{ marginTop: '1rem' }}>
          اختيار ملف
        </div>
      </label>
    </div>
  )
}
