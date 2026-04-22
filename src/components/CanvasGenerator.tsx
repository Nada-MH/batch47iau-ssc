import { useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import maleTemplateSrc from '../assets/male.png'
import femaleDay1TemplateSrc from '../assets/female day 1.png'
import femaleDay2TemplateSrc from '../assets/female day 2.png'

interface Props {
  userImage: string
  userData: {
    firstName: string
    lastName: string
    gender: 'male' | 'female' | ''
    day: 'day1' | 'day2' | ''
  }
}

export default function CanvasGenerator({ userImage, userData }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(1.3)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const draw = (userImg?: HTMLImageElement, templateImg?: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (!templateImg) return

    // Set canvas to match template image dimensions
    canvas.width = templateImg.width
    canvas.height = templateImg.height

    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    // --- Circle position relative to template ---
    // Template is 1414x2000.
    const CIRCLE_CX = W * 0.511       // center X (722/1414)
    const CIRCLE_CY = H * 0.505       // center Y (1010/2000)
    const CIRCLE_RADIUS = W * 0.165   // radius  (increased from 0.1485 to fit better)

    // If the user uploaded a photo, draw it FIRST (behind the template)
    if (userImg) {
      ctx.save()
      // Clip to the circle region
      ctx.beginPath()
      ctx.arc(CIRCLE_CX, CIRCLE_CY, CIRCLE_RADIUS, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      // Draw the user image, centered and scaled to fill the circle
      const minDim = Math.min(userImg.width, userImg.height)
      const sx = (userImg.width - minDim) / 2
      const sy = (userImg.height - minDim) / 2
      const drawSize = CIRCLE_RADIUS * 2 * scale
      const dx = CIRCLE_CX - (drawSize / 2) + offsetX
      const dy = CIRCLE_CY - (drawSize / 2) + offsetY
      ctx.drawImage(
        userImg,
        sx, sy, minDim, minDim,
        dx, dy, drawSize, drawSize
      )

      ctx.restore()
    }

    // Composite approach: draw template, punch hole, draw user image behind
    ctx.clearRect(0, 0, W, H)

    // Step 1: Draw the full template
    ctx.drawImage(templateImg, 0, 0, W, H)

    if (userImg) {
      // Step 2: Punch a hole in the circle area using 'destination-out'
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(CIRCLE_CX, CIRCLE_CY, CIRCLE_RADIUS - 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Step 3: Draw user image behind everything using 'destination-over'
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      // Clip to circle
      ctx.beginPath()
      ctx.arc(CIRCLE_CX, CIRCLE_CY, CIRCLE_RADIUS - 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      const minDim = Math.min(userImg.width, userImg.height)
      const sx = (userImg.width - minDim) / 2
      const sy = (userImg.height - minDim) / 2
      const drawSize = CIRCLE_RADIUS * 2 * scale
      const dx = CIRCLE_CX - (drawSize / 2) + offsetX
      const dy = CIRCLE_CY - (drawSize / 2) + offsetY
      ctx.drawImage(
        userImg,
        sx, sy, minDim, minDim,
        dx, dy, drawSize, drawSize
      )

      ctx.restore()

      // Draw a subtle circle border on top to blend with the template
      ctx.save()
      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()
      ctx.arc(CIRCLE_CX, CIRCLE_CY, CIRCLE_RADIUS - 1, 0, Math.PI * 2)
      ctx.lineWidth = 4
      ctx.strokeStyle = 'rgba(190, 185, 170, 0.7)'
      ctx.stroke()
      ctx.restore()
    }

    // --- Draw Name ---
    // Make sure name only draws if we have a name
    const fullName = `${userData.firstName} ${userData.lastName}`.trim();
    if (fullName) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#A48846';
      
      // Load font with fallback to Amiri or serif
      ctx.font = 'bold 80px "XB Shafigh", Amiri, serif';
      
      // Position directly below the circle
      // The circle ends at CIRCLE_CY + CIRCLE_RADIUS. We add a little margin.
      const textY = CIRCLE_CY + CIRCLE_RADIUS + 40;
      ctx.fillText(fullName, CIRCLE_CX, textY);
      ctx.restore();
    }

    setIsReady(!!userImg)
  }

  useEffect(() => {
    let currentTemplateSrc = maleTemplateSrc;
    if (userData.gender === 'female') {
      currentTemplateSrc = userData.day === 'day2' ? femaleDay2TemplateSrc : femaleDay1TemplateSrc;
    }

    const templateImg = new Image()
    templateImg.src = currentTemplateSrc

    templateImg.onload = () => {
      document.fonts.ready.then(() => {
        if (userImage) {
          const userImg = new Image()
          userImg.src = userImage
          userImg.onload = () => draw(userImg, templateImg)
        } else {
          draw(undefined, templateImg)
        }
      });
    }
  }, [userImage, userData, scale, offsetX, offsetY])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `IAU_Graduation_${userData.lastName || 'photo'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="canvas-container">
      <div className="canvas-preview-wrapper" style={{ maxWidth: '500px', width: '100%' }}>
        <canvas 
          ref={canvasRef} 
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {userImage && (
        <div className="adjustment-controls">
          <div className="slider-group">
            <label>
              <span>🔍 التكبير</span>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
              />
            </label>
          </div>
          <div className="slider-group">
            <label>
              <span>↔ أفقي</span>
              <input 
                type="range" 
                min="-200" 
                max="200" 
                step="1"
                value={offsetX}
                onChange={(e) => setOffsetX(parseInt(e.target.value))}
              />
            </label>
          </div>
          <div className="slider-group">
            <label>
              <span>↕ عمودي</span>
              <input 
                type="range" 
                min="-200" 
                max="200" 
                step="1"
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value))}
              />
            </label>
          </div>
        </div>
      )}

      <div className="controls-row">
        <button 
          className="button-primary" 
          onClick={handleDownload}
          disabled={!isReady}
          style={{ width: '100%' }}
        >
          <Download size={18} />
          {isReady ? 'تحميل الصورة' : 'ارفع صورة للتحميل'}
        </button>
      </div>
    </div>
  )
}
