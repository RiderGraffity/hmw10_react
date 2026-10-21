import { useState, type ChangeEvent, type FormEvent } from 'react'

type Form = {
  fullName: string
  email: string
  birthDate: string
  accountType: 'Персональний' | 'Бізнес'
  company: string
  role: string
  otherRole: string
  newsletter: boolean
  frequency: 'Щодня' | 'Щотижня'
}

type Errors = Partial<Record<keyof Form, string>>

const initialForm: Form = {
  fullName: '',
  email: '',
  birthDate: '',
  accountType: 'Персональний',
  company: '',
  role: 'Розробник',
  otherRole: '',
  newsletter: false,
  frequency: 'Щотижня',
}

const roles = ['Розробник', 'Дизайнер', 'Менеджер', 'Інше']

const getAge = (date: string) => {
  const birth = new Date(date)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const month = today.getMonth() - birth.getMonth()

  if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

const validate = (form: Form) => {
  const errors: Errors = {}

  if (form.fullName.trim().length < 3) {
    errors.fullName = "Ім'я має бути мінімум 3 символи"
  }

  if (!form.email) {
    errors.email = 'Вкажіть email'
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Неправильний формат пошти'
  }

  if (!form.birthDate) {
    errors.birthDate = 'Вкажіть дату народження'
  } else if (getAge(form.birthDate) < 18) {
    errors.birthDate = 'Вам має бути 18 років або більше'
  }

  if (form.accountType === 'Бізнес' && !form.company.trim()) {
    errors.company = 'Вкажіть назву компанії'
  }

  if (form.role === 'Інше' && !form.otherRole.trim()) {
    errors.otherRole = 'Вкажіть свою роль'
  }

  return errors
}

export default function ProfileForm() {
  const [form, setForm] = useState<Form>(initialForm)
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({})

  const errors = validate(form)
  const hasErrors = Object.keys(errors).length > 0

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setTouched({ ...touched, [name]: true })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (hasErrors) return
    console.log(form)
    alert('Профіль збережено')
  }

  const handleReset = () => {
    setForm(initialForm)
    setTouched({})
  }

  const showError = (field: keyof Form) =>
    touched[field] && errors[field] && <p className="error">{errors[field]}</p>

  return (
    <div className="page">
      <form onSubmit={handleSubmit} noValidate>
        <h2>Редагування профілю</h2>

        <label>
          Повне ім'я
          <input name="fullName" value={form.fullName} onChange={handleChange} />
        </label>
        {showError('fullName')}

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
        {showError('email')}

        <label>
          Дата народження
          <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
        </label>
        {showError('birthDate')}

        <div className="group">
          Тип акаунту
          <label className="inline">
            <input
              type="radio"
              name="accountType"
              value="Персональний"
              checked={form.accountType === 'Персональний'}
              onChange={handleChange}
            />
            Персональний
          </label>
          <label className="inline">
            <input
              type="radio"
              name="accountType"
              value="Бізнес"
              checked={form.accountType === 'Бізнес'}
              onChange={handleChange}
            />
            Бізнес
          </label>
        </div>

        {form.accountType === 'Бізнес' && (
          <>
            <label>
              Назва компанії
              <input name="company" value={form.company} onChange={handleChange} />
            </label>
            {showError('company')}
          </>
        )}

        <label>
          Роль
          <select name="role" value={form.role} onChange={handleChange}>
            {roles.map(role => (
              <option key={role}>{role}</option>
            ))}
          </select>
        </label>

        {form.role === 'Інше' && (
          <>
            <label>
              Ваша роль
              <input name="otherRole" value={form.otherRole} onChange={handleChange} />
            </label>
            {showError('otherRole')}
          </>
        )}

        <label className="inline">
          <input
            type="checkbox"
            checked={form.newsletter}
            onChange={e => setForm({ ...form, newsletter: e.target.checked })}
          />
          Підписатися на розсилку
        </label>

        {form.newsletter && (
          <label>
            Частота
            <select name="frequency" value={form.frequency} onChange={handleChange}>
              <option>Щодня</option>
              <option>Щотижня</option>
            </select>
          </label>
        )}

        <div className="buttons">
          <button type="submit" disabled={hasErrors}>
            Зберегти
          </button>
          <button type="button" onClick={handleReset}>
            Скинути
          </button>
        </div>
      </form>

      <div className="preview">
        <h2>Live Preview</h2>
        <pre>{JSON.stringify(form, null, 2)}</pre>
      </div>
    </div>
  )
}
