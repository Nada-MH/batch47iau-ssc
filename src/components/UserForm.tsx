interface FormData {
  firstName: string
  lastName: string
  gender: 'male' | 'female' | ''
  day: 'day1' | 'day2' | ''
}

interface Props {
  data: FormData
  onChange: (data: FormData) => void
}

export default function UserForm({ data, onChange }: Props) {
  const handleChange = (field: keyof FormData, value: string) => {
    onChange({ ...data, [field]: value })
  }
  
  const handleMultipleChange = (updates: Partial<FormData>) => {
    onChange({ ...data, ...updates })
  }

  return (
    <div className="user-form">
      <h2 style={{ color: 'var(--primary-navy)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
        بيانات الخريج
      </h2>
      
      <div className="form-row">
        <div className="form-group">
          <label>الاسم الأول</label>
          <input 
            type="text" 
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="الاسم الأول"
          />
        </div>

        <div className="form-group">
          <label>الاسم الأخير</label>
          <input 
            type="text" 
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="الاسم الأخير"
          />
        </div>
      </div>

      <div className="form-group">
        <label>الجنس</label>
        <div className="gender-options">
          <label className={`gender-option ${data.gender === 'male' ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="gender" 
              value="male" 
              checked={data.gender === 'male'}
              onChange={() => handleMultipleChange({ gender: 'male', day: '' })}
            />
            خريج
          </label>
          <label className={`gender-option ${data.gender === 'female' ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="gender" 
              value="female" 
              checked={data.gender === 'female'}
              onChange={() => handleMultipleChange({ 
                gender: 'female', 
                day: data.day || 'day1' 
              })}
            />
            خريجة
          </label>
        </div>
      </div>

      {data.gender === 'female' && (
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label>يوم الحفل</label>
          <div className="gender-options">
            <label className={`gender-option ${data.day === 'day1' ? 'active' : ''}`}>
              <input 
                type="radio" 
                name="day" 
                value="day1" 
                checked={data.day === 'day1'}
                onChange={() => handleChange('day', 'day1')}
              />
              اليوم الأول
            </label>
            <label className={`gender-option ${data.day === 'day2' ? 'active' : ''}`}>
              <input 
                type="radio" 
                name="day" 
                value="day2" 
                checked={data.day === 'day2'}
                onChange={() => handleChange('day', 'day2')}
              />
              اليوم الثاني
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
