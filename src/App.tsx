import { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import CanvasGenerator from './components/CanvasGenerator'
import UserForm from './components/UserForm'
import { GraduationCap } from 'lucide-react'

interface UserData {
  firstName: string
  lastName: string
  gender: 'male' | 'female' | ''
  day: 'day1' | 'day2' | ''
}

function App() {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    gender: 'male',
    day: ''
  })

  const resetAll = () => {
    setUserImage(null)
    setUserData({ firstName: '', lastName: '', gender: 'male', day: '' })
  }

  return (
    <div className="app-container" dir="rtl" style={{ textAlign: 'right' }}>
      <header className="header">
        <GraduationCap size={48} color="var(--primary-navy)" style={{ marginBottom: '1rem' }} />
        <h1>الدفعة السابعة والأربعون</h1>
        <p>جامعة الإمام عبدالرحمن بن فيصل</p>
      </header>

      <div className="app-grid">
        <div className="app-card">
          <UserForm data={userData} onChange={setUserData} />
          <hr style={{ border: 'none', borderTop: '1px solid var(--primary-slate)', opacity: 0.2 }} />
          <ImageUploader onImageReady={setUserImage} />
          
          {(userImage || userData.firstName) && (
            <button 
              className="button-secondary" 
              onClick={resetAll} 
              style={{ marginTop: '1rem', width: '100%' }}
            >
              البدء من جديد
            </button>
          )}
        </div>

        <div className="preview-card">
          <CanvasGenerator 
            userImage={userImage || ''} 
            userData={userData}
          />
        </div>
      </div>
    </div>
  )
}

export default App
