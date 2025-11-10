import { useState } from 'react'
import axios from 'axios'
import './Login.css'

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      showMessage('Por favor, preencha todos os campos', 'error')
      return
    }

    if (!isValidEmail(formData.email)) {
      showMessage('Por favor, insira um endereço de email válido', 'error')
      return
    }

    setIsLoading(true)
    showMessage('Entrando...', 'info')

    try {
      const response = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
        remember: formData.remember
      })

      showMessage('Bem-vindo à Comunidade WoodCraft!', 'success')
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      // Call the success callback with user data
      setTimeout(() => {
        onLoginSuccess(response.data.user)
      }, 1000)
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Falha no login. Tente novamente.'
      showMessage(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 5000)
  }

  const handleSSOLogin = async (provider) => {
    if (isLoading) return
    
    setIsLoading(true)
    showMessage(`Conectando com ${provider}...`, 'info')

    try {
      // OAuth URLs for each provider
      const oauthUrls = {
        google: `http://localhost:8080/api/auth/oauth2/authorize/google?redirect_uri=${encodeURIComponent(window.location.origin + '/auth-callback.html')}`
      }

      const authUrl = oauthUrls[provider]
      if (!authUrl) {
        throw new Error('Provedor não suportado')
      }

      // Open popup window for OAuth
      const popup = window.open(
        authUrl,
        `${provider}_oauth`,
        'width=500,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
      )

      if (!popup) {
        throw new Error('Popup bloqueado. Permita popups para este site.')
      }

      // Listen for popup messages
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'OAUTH_SUCCESS') {
          popup.close()
          window.removeEventListener('message', handleMessage)
          
          showMessage(`Login com ${provider} realizado com sucesso!`, 'success')
          
          // Store token if provided
          if (event.data.token) {
            localStorage.setItem('token', event.data.token)
          }
          
          setTimeout(() => {
            onLoginSuccess(event.data.user)
          }, 1000)
          
        } else if (event.data.type === 'OAUTH_ERROR') {
          popup.close()
          window.removeEventListener('message', handleMessage)
          throw new Error(event.data.message || `Erro ao conectar com ${provider}`)
        }
      }

      window.addEventListener('message', handleMessage)

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          window.removeEventListener('message', handleMessage)
          setIsLoading(false)
          showMessage('Login cancelado', 'error')
        }
      }, 1000)

    } catch (error) {
      showMessage(error.message || `Erro ao conectar com ${provider}. Tente novamente.`, 'error')
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo">🌲</div>
          <h1>Comunidade WoodCraft</h1>
          <p>Conecte-se com outros marceneiros</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              Lembrar de mim
            </label>
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </div>
          
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          
          <div className="divider">
            <span>ou</span>
          </div>
          
          <div className="sso-section">
            <p className="sso-text">Entre com sua conta social</p>
            <div className="sso-buttons">
              <button type="button" className="sso-btn google-btn" onClick={() => handleSSOLogin('google')}>
                <svg className="sso-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            </div>
          </div>
          
          <div className="divider">
            <span>ou</span>
          </div>
          
          <div className="signup-section">
            <p>Novo na Comunidade WoodCraft?</p>
            <a href="#" className="signup-btn">Criar Conta</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login