import { useState, useEffect } from 'react'
import axios from 'axios'
import './Dashboard.css'

// Currency formatting functions
const formatCurrency = (value) => {
  if (!value) return ''
  const numericValue = value.replace(/\D/g, '')
  const number = parseFloat(numericValue) / 100
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const handleCurrencyInput = (value) => {
  const numericValue = value.replace(/\D/g, '')
  if (!numericValue) return ''
  const number = parseFloat(numericValue) / 100
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const Dashboard = ({ user, onLogout }) => {
  const [userType, setUserType] = useState('customer') // 'customer' or 'woodworker'
  const [showRequestForm, setShowRequestForm] = useState(false)
  
  // Requests state
  const [myRequests, setMyRequests] = useState([])
  const [activeRequests, setActiveRequests] = useState([])
  const [rejectedRequests, setRejectedRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  
  // Woodworker proposals by status
  const [pendingProposals, setPendingProposals] = useState([])
  const [acceptedProposals, setAcceptedProposals] = useState([])
  const [rejectedProposals, setRejectedProposals] = useState([])
  
  // Modal state
  const [showRequestDetails, setShowRequestDetails] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requestProposals, setRequestProposals] = useState([])
  const [loadingProposals, setLoadingProposals] = useState(false)
  
  // Proposal modal state
  const [showProposalModal, setShowProposalModal] = useState(false)
  const [proposalPrice, setProposalPrice] = useState('')
  const [proposalMessage, setProposalMessage] = useState('')
  const [submittingProposal, setSubmittingProposal] = useState(false)
  
  // Form state for furniture preview
  const [furnitureType, setFurnitureType] = useState('mesa')
  const [material, setMaterial] = useState('madeira')
  const [woodType, setWoodType] = useState('carvalho')
  const [color, setColor] = useState('#8B4513')
  const [thickness, setThickness] = useState('25mm')
  const [description, setDescription] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [budget, setBudget] = useState('')

  // AI Preview state
  const [aiPreview, setAiPreview] = useState({
    loading: false,
    imageUrl: null,
    error: null,
    showAI: false
  })

  // Generate AI Preview function
  const generateAIPreview = async () => {
    setAiPreview({ loading: true, imageUrl: null, error: null, showAI: true })
    
    try {
      const response = await axios.post('http://localhost:8080/api/furniture/preview', {
        furnitureType,
        material,
        woodType,
        color,
        thickness,
        description
      })
      
      setAiPreview({
        loading: false,
        imageUrl: `data:image/png;base64,${response.data.imageBase64}`,
        error: null,
        showAI: true
      })
    } catch (error) {
      setAiPreview({
        loading: false,
        imageUrl: null,
        error: error.response?.data?.error || 'Erro ao gerar preview. Tente novamente.',
        showAI: true
      })
    }
  }

  // Load requests
  const loadMyRequests = async () => {
    setLoadingRequests(true)
    try {
      const response = await axios.get(
        `http://localhost:8080/api/requests/my-requests?email=${user.email}`
      )
      setMyRequests(response.data)
    } catch (error) {
      console.error('Error loading my requests:', error)
    } finally {
      setLoadingRequests(false)
    }
  }

  const loadActiveRequests = async () => {
    setLoadingRequests(true)
    try {
      const response = await axios.get(`http://localhost:8080/api/requests/active?email=${user.email}`)
      setActiveRequests(response.data)
    } catch (error) {
      console.error('Error loading active requests:', error)
    } finally {
      setLoadingRequests(false)
    }
  }

  // Load rejected requests (woodworker)
  const loadRejectedRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/requests/rejected?email=${user.email}`)
      setRejectedRequests(response.data)
    } catch (error) {
      console.error('Error loading rejected requests:', error)
    }
  }

  // Reject request (woodworker doesn't want to see this request)
  const handleRejectRequest = async (requestId) => {
    if (!confirm('Deseja ocultar esta solicitação? Ela não aparecerá mais na sua lista.')) return
    
    try {
      const response = await axios.post(
        `http://localhost:8080/api/requests/reject?email=${user.email}&requestId=${requestId}`
      )
      if (response.data.success) {
        alert('✅ Solicitação ocultada com sucesso!')
        loadActiveRequests() // Reload list
        loadRejectedRequests() // Update rejected list
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('❌ Erro ao ocultar solicitação.')
    }
  }

  // Load woodworker proposals by status
  const loadWoodworkerProposals = async () => {
    try {
      const [pending, accepted, rejected] = await Promise.all([
        axios.get(`http://localhost:8080/api/proposals/my-proposals?email=${user.email}&status=PENDING`),
        axios.get(`http://localhost:8080/api/proposals/my-proposals?email=${user.email}&status=ACCEPTED`),
        axios.get(`http://localhost:8080/api/proposals/my-proposals?email=${user.email}&status=REJECTED`)
      ])
      setPendingProposals(pending.data)
      setAcceptedProposals(accepted.data)
      setRejectedProposals(rejected.data)
    } catch (error) {
      console.error('Error loading woodworker proposals:', error)
    }
  }

  // Load requests when component mounts or userType changes
  useEffect(() => {
    if (userType === 'customer') {
      loadMyRequests()
    } else {
      loadActiveRequests()
      loadWoodworkerProposals()
      loadRejectedRequests()
    }
  }, [userType])

  // Open request details modal
  const openRequestDetails = async (request) => {
    setSelectedRequest(request)
    setShowRequestDetails(true)
    setLoadingProposals(true)
    
    try {
      const response = await axios.get(`http://localhost:8080/api/proposals/by-request/${request.id}`)
      setRequestProposals(response.data)
    } catch (error) {
      console.error('Error loading proposals:', error)
      setRequestProposals([])
    } finally {
      setLoadingProposals(false)
    }
  }

  // Close request details modal
  const closeRequestDetails = () => {
    setShowRequestDetails(false)
    setSelectedRequest(null)
    setRequestProposals([])
  }

  // Open proposal modal
  const openProposalModal = (request) => {
    setSelectedRequest(request)
    setShowProposalModal(true)
    setProposalPrice('')
    setProposalMessage('')
  }

  // Close proposal modal
  const closeProposalModal = () => {
    setShowProposalModal(false)
    setSelectedRequest(null)
    setProposalPrice('')
    setProposalMessage('')
  }

  // Submit proposal
  const handleSubmitProposal = async (e) => {
    e.preventDefault()
    setSubmittingProposal(true)
    
    try {
      const response = await axios.post(
        `http://localhost:8080/api/proposals/create?email=${user.email}`,
        {
          requestId: selectedRequest.id,
          price: proposalPrice,
          message: proposalMessage,
          imageUrls: null
        }
      )
      
      if (response.data.success) {
        alert('✅ Proposta enviada com sucesso!')
        closeProposalModal()
        loadActiveRequests()
        loadWoodworkerProposals()
      }
    } catch (error) {
      console.error('Error submitting proposal:', error)
      alert('❌ Erro ao enviar proposta. Tente novamente.')
    } finally {
      setSubmittingProposal(false)
    }
  }

  // Accept proposal
  const handleAcceptProposal = async (proposalId) => {
    if (!confirm('Deseja aceitar esta proposta?')) return
    
    try {
      const response = await axios.put(`http://localhost:8080/api/proposals/${proposalId}/accept`)
      if (response.data.success) {
        alert('✅ Proposta aceita!')
        openRequestDetails(selectedRequest) // Reload proposals
      }
    } catch (error) {
      console.error('Error accepting proposal:', error)
      alert('❌ Erro ao aceitar proposta.')
    }
  }

  // Reject proposal
  const handleRejectProposal = async (proposalId) => {
    if (!confirm('Deseja rejeitar esta proposta?')) return
    
    try {
      const response = await axios.put(`http://localhost:8080/api/proposals/${proposalId}/reject`)
      if (response.data.success) {
        alert('Proposta rejeitada')
        openRequestDetails(selectedRequest) // Reload proposals
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error)
      alert('❌ Erro ao rejeitar proposta.')
    }
  }

  // Submit furniture request
  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    
    try {
      const response = await axios.post(
        `http://localhost:8080/api/requests/create?email=${user.email}`,
        {
          furnitureType,
          material,
          woodType,
          color,
          thickness,
          dimensions,
          description,
          budget,
          aiPreviewImage: aiPreview.imageUrl || null
        }
      )
      
      if (response.data.success) {
        alert('✅ Solicitação publicada com sucesso! Todos os marceneiros foram notificados.')
        // Reset form
        setShowRequestForm(false)
        setFurnitureType('mesa')
        setMaterial('madeira')
        setWoodType('carvalho')
        setColor('#8B4513')
        setThickness('25mm')
        setDimensions('')
        setDescription('')
        setBudget('')
        setAiPreview({ loading: false, imageUrl: null, error: null, showAI: false })
        // Reload requests
        loadMyRequests()
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('❌ Erro ao publicar solicitação. Tente novamente.')
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 60) return `Há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
    if (diffDays < 7) return `Há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`
    return date.toLocaleDateString('pt-BR')
  }

  // Translate furniture type
  const translateFurnitureType = (type) => {
    const translations = {
      'mesa': 'Mesa',
      'cadeira': 'Cadeira',
      'estante': 'Estante',
      'armario': 'Armário',
      'rack': 'Rack para TV'
    }
    return translations[type] || type
  }

  // Translate material
  const translateMaterial = (mat) => {
    const translations = {
      'madeira': 'Madeira Natural',
      'mdf': 'MDF',
      'mdp': 'MDP',
      'compensado': 'Compensado'
    }
    return translations[mat] || mat
  }

  // Material colors
  const getMaterialColor = () => {
    if (material === 'madeira') {
      const woodColors = {
        'carvalho': '#8B4513',
        'pinus': '#DEB887',
        'mogno': '#C04000',
        'cedro': '#D2691E',
        'imbuia': '#654321'
      }
      return woodColors[woodType] || '#8B4513'
    } else if (material === 'mdf') {
      return color
    }
    return '#D2B48C'
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo">🪵</span>
            <h1>WoodCraft Marketplace</h1>
          </div>
          <div className="user-section">
            <div className="user-info">
              <span className="welcome-text">Olá, {user.firstName}!</span>
              <div className="user-type-toggle">
                <button 
                  className={`toggle-btn ${userType === 'customer' ? 'active' : ''}`}
                  onClick={() => setUserType('customer')}
                >
                  Cliente
                </button>
                <button 
                  className={`toggle-btn ${userType === 'woodworker' ? 'active' : ''}`}
                  onClick={() => setUserType('woodworker')}
                >
                  Marceneiro
                </button>
              </div>
            </div>
            <button className="logout-btn" onClick={onLogout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {userType === 'customer' ? (
          <>
            <div className="hero-section">
              <div className="hero-content">
                <h2>Móveis Personalizados Sob Medida</h2>
                <p>Conecte-se com marceneiros qualificados e transforme suas ideias em realidade</p>
                <button className="cta-btn" onClick={() => setShowRequestForm(!showRequestForm)}>
                  {showRequestForm ? '← Voltar' : '+ Nova Solicitação'}
                </button>
              </div>
            </div>

            {showRequestForm ? (
              <div className="form-with-preview">
                <div className="card request-form-card">
                  <div className="card-header">
                    <h3>📝 Nova Solicitação de Móvel</h3>
                  </div>
                  <div className="card-content">
                    <form className="request-form" onSubmit={handleSubmitRequest}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Tipo de Móvel</label>
                          <select value={furnitureType} onChange={(e) => setFurnitureType(e.target.value)}>
                            <option value="mesa">Mesa</option>
                            <option value="cadeira">Cadeira</option>
                            <option value="estante">Estante</option>
                            <option value="armario">Armário</option>
                            <option value="rack">Rack para TV</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Material</label>
                          <select value={material} onChange={(e) => setMaterial(e.target.value)}>
                            <option value="madeira">Madeira Natural</option>
                            <option value="mdf">MDF</option>
                            <option value="mdp">MDP</option>
                            <option value="compensado">Compensado</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Tipo de Madeira {material !== 'madeira' && '(não aplicável)'}</label>
                          <select 
                            value={woodType} 
                            onChange={(e) => setWoodType(e.target.value)}
                            disabled={material !== 'madeira'}
                          >
                            <option value="pinus">Pinus (Clara)</option>
                            <option value="carvalho">Carvalho (Média)</option>
                            <option value="cedro">Cedro (Avermelhada)</option>
                            <option value="mogno">Mogno (Escura)</option>
                            <option value="imbuia">Imbuia (Muito Escura)</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Cor/Acabamento {material === 'madeira' && '(não aplicável)'}</label>
                          <select 
                            value={color} 
                            onChange={(e) => setColor(e.target.value)}
                            disabled={material === 'madeira'}
                          >
                            <option value="#FFFFFF">Branco</option>
                            <option value="#F5F5DC">Bege</option>
                            <option value="#D2B48C">Amadeirado Claro</option>
                            <option value="#8B4513">Amadeirado Médio</option>
                            <option value="#654321">Amadeirado Escuro</option>
                            <option value="#2F4F4F">Cinza Escuro</option>
                            <option value="#000000">Preto</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Dimensões (opcional)</label>
                          <input 
                            type="text" 
                            placeholder="Ex: 2m x 1m x 0.8m"
                            value={dimensions}
                            onChange={(e) => setDimensions(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Espessura</label>
                          <select value={thickness} onChange={(e) => setThickness(e.target.value)}>
                            <option value="15mm">15mm (Fino)</option>
                            <option value="18mm">18mm (Padrão)</option>
                            <option value="25mm">25mm (Reforçado)</option>
                            <option value="30mm">30mm (Extra Reforçado)</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label>Descrição Detalhada (opcional - influencia o preview com IA)</label>
                        <textarea 
                          rows="4" 
                          placeholder="Descreva detalhes específicos do móvel (ex: gavetas, prateleiras, estilo moderno/rústico, etc.). Se deixar em branco, será gerado um móvel simples e padrão."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="form-group full-width">
                        <label>Orçamento Estimado (opcional)</label>
                        <input 
                          type="text" 
                          placeholder="R$ 0,00"
                          value={budget}
                          onChange={(e) => setBudget(handleCurrencyInput(e.target.value))}
                        />
                      </div>

                      <button type="submit" className="submit-btn">Publicar Solicitação</button>
                    </form>
                  </div>
                </div>

                <div className="card preview-card">
                  <div className="card-header">
                    <h3>👁️ Prévia do Móvel</h3>
                  </div>
                  <div className="card-content">
                    <div className="furniture-preview">
                      <div className="preview-controls">
                        <button 
                          className="ai-generate-btn" 
                          onClick={generateAIPreview}
                          disabled={aiPreview.loading}
                        >
                          {aiPreview.loading ? '⏳ Gerando Preview Realista...' : '🎨 Gerar Preview com IA'}
                        </button>
                        {aiPreview.imageUrl && (
                          <div className="preview-toggle">
                            <button 
                              className={`toggle-preview-btn ${!aiPreview.showAI ? 'active' : ''}`}
                              onClick={() => setAiPreview({...aiPreview, showAI: false})}
                            >
                              3D
                            </button>
                            <button 
                              className={`toggle-preview-btn ${aiPreview.showAI ? 'active' : ''}`}
                              onClick={() => setAiPreview({...aiPreview, showAI: true})}
                            >
                              IA
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {aiPreview.error && (
                        <div className="ai-error">
                          ⚠️ {aiPreview.error}
                          <button onClick={generateAIPreview} className="retry-btn">Tentar Novamente</button>
                        </div>
                      )}
                      
                      <div className="preview-canvas" style={{ display: aiPreview.showAI && aiPreview.imageUrl ? 'none' : 'flex' }}>
                        {furnitureType === 'mesa' && (
                          <div className="furniture-3d mesa-3d">
                            <div className="table-top" style={{ 
                              background: getMaterialColor(),
                              boxShadow: `0 4px 8px ${getMaterialColor()}80`
                            }}></div>
                            <div className="table-leg leg-1" style={{ background: getMaterialColor() }}></div>
                            <div className="table-leg leg-2" style={{ background: getMaterialColor() }}></div>
                            <div className="table-leg leg-3" style={{ background: getMaterialColor() }}></div>
                            <div className="table-leg leg-4" style={{ background: getMaterialColor() }}></div>
                          </div>
                        )}
                        {furnitureType === 'cadeira' && (
                          <div className="furniture-3d chair-3d">
                            <div className="chair-back" style={{ background: getMaterialColor() }}></div>
                            <div className="chair-seat" style={{ background: getMaterialColor() }}></div>
                            <div className="chair-leg leg-1" style={{ background: getMaterialColor() }}></div>
                            <div className="chair-leg leg-2" style={{ background: getMaterialColor() }}></div>
                            <div className="chair-leg leg-3" style={{ background: getMaterialColor() }}></div>
                            <div className="chair-leg leg-4" style={{ background: getMaterialColor() }}></div>
                          </div>
                        )}
                        {furnitureType === 'estante' && (
                          <div className="furniture-3d shelf-3d">
                            <div className="shelf-side side-left" style={{ background: getMaterialColor() }}></div>
                            <div className="shelf-side side-right" style={{ background: getMaterialColor() }}></div>
                            <div className="shelf-board board-1" style={{ background: getMaterialColor() }}></div>
                            <div className="shelf-board board-2" style={{ background: getMaterialColor() }}></div>
                            <div className="shelf-board board-3" style={{ background: getMaterialColor() }}></div>
                            <div className="shelf-board board-4" style={{ background: getMaterialColor() }}></div>
                          </div>
                        )}
                        {furnitureType === 'armario' && (
                          <div className="furniture-3d cabinet-3d">
                            <div className="cabinet-body" style={{ background: getMaterialColor() }}></div>
                            <div className="cabinet-door door-left" style={{ background: getMaterialColor() }}></div>
                            <div className="cabinet-door door-right" style={{ background: getMaterialColor() }}></div>
                          </div>
                        )}
                        {furnitureType === 'rack' && (
                          <div className="furniture-3d rack-3d">
                            <div className="rack-body" style={{ background: getMaterialColor() }}></div>
                            <div className="rack-shelf shelf-1" style={{ background: getMaterialColor() }}></div>
                            <div className="rack-shelf shelf-2" style={{ background: getMaterialColor() }}></div>
                          </div>
                        )}
                      </div>
                      
                      {aiPreview.imageUrl && aiPreview.showAI && (
                        <div className="ai-preview-container">
                          <img src={aiPreview.imageUrl} alt="AI Generated Preview" className="ai-preview-image" />
                          <a href={aiPreview.imageUrl} download="furniture-preview.png" className="download-btn">
                            📥 Baixar Imagem
                          </a>
                        </div>
                      )}
                      
                      <div className="preview-info">
                        <div className="info-item">
                          <span className="info-label">Material:</span>
                          <span className="info-value">{material === 'madeira' ? `${woodType.charAt(0).toUpperCase() + woodType.slice(1)}` : material.toUpperCase()}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Espessura:</span>
                          <span className="info-value">{thickness}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Acabamento:</span>
                          <span className="info-value">{material === 'madeira' ? 'Natural' : 'Personalizado'}</span>
                        </div>
                      </div>
                      <div className="preview-note">
                        <p>💡 Esta é uma representação visual aproximada. O móvel final será feito conforme suas especificações exatas.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header">
                    <h3>📋 Minhas Solicitações</h3>
                    <span className="card-count">{myRequests.length}</span>
                  </div>
                  <div className="card-content">
                    {loadingRequests ? (
                      <p style={{ textAlign: 'center', color: '#718096' }}>Carregando...</p>
                    ) : myRequests.length === 0 ? (
                      <p style={{ textAlign: 'center', color: '#718096' }}>
                        Nenhuma solicitação ainda. Clique em "+ Nova Solicitação" para começar!
                      </p>
                    ) : (
                      myRequests.slice(0, 3).map((request) => (
                        <div 
                          key={request.id} 
                          className="request-item clickable"
                          onClick={() => openRequestDetails(request)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="request-info">
                            <span className="request-title">
                              {translateFurnitureType(request.furnitureType)} em {translateMaterial(request.material)}
                            </span>
                            <span className="request-meta">{formatDate(request.createdAt)}</span>
                          </div>
                          <span className="project-status in-progress">{request.status === 'ACTIVE' ? 'Ativo' : request.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                  {myRequests.length > 3 && (
                    <button className="card-action">Ver Todas ({myRequests.length})</button>
                  )}
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>📊 Estatísticas</h3>
                  </div>
                  <div className="card-content">
                    <div className="stats-grid">
                      <div className="stat">
                        <span className="stat-number">{myRequests.filter(r => r.status === 'ACTIVE').length}</span>
                        <span className="stat-label">Solicitações Ativas</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">{myRequests.length}</span>
                        <span className="stat-label">Total de Solicitações</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="hero-section">
              <div className="hero-content">
                <h2>Encontre Novos Clientes</h2>
                <p>Acesse solicitações de clientes e envie suas propostas com orçamentos e projetos</p>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card">
                <div className="card-header">
                  <h3>🔔 Novas Solicitações</h3>
                  <span className="card-count">{activeRequests.length}</span>
                </div>
                <div className="card-content">
                  {loadingRequests ? (
                    <p style={{ textAlign: 'center', color: '#718096' }}>Carregando...</p>
                  ) : activeRequests.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#718096' }}>
                      Nenhuma solicitação ativa no momento. Volte mais tarde!
                    </p>
                  ) : (
                    activeRequests.slice(0, 2).map((request) => (
                      <div key={request.id} className="customer-request">
                        <div 
                          className="request-header clickable" 
                          onClick={() => openRequestDetails(request)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="request-title">
                            {translateFurnitureType(request.furnitureType)} em {translateMaterial(request.material)}
                          </span>
                          <span className="request-time">{formatDate(request.createdAt)}</span>
                        </div>
                        {request.description && (
                          <p className="request-description">{request.description}</p>
                        )}
                        <div className="request-specs">
                          <span className="spec-tag">🪵 {translateMaterial(request.material)}</span>
                          {request.dimensions && <span className="spec-tag">📏 {request.dimensions}</span>}
                          {request.budget && <span className="spec-tag">💰 {request.budget}</span>}
                          {!request.budget && <span className="spec-tag">💰 Orçamento aberto</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button className="proposal-btn" onClick={() => openProposalModal(request)}>
                            Enviar Proposta
                          </button>
                          <button 
                            className="proposal-btn-secondary" 
                            onClick={() => openRequestDetails(request)}
                          >
                            Ver Detalhes
                          </button>
                          <button 
                            className="proposal-btn-reject" 
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRejectRequest(request.id)
                            }}
                            title="Não tenho interesse nesta solicitação"
                          >
                            ❌ Não Tenho Interesse
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {activeRequests.length > 2 && (
                  <button className="card-action">Ver Todas as Solicitações ({activeRequests.length})</button>
                )}
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>✅ Propostas Aceitas</h3>
                  <span className="card-count">{acceptedProposals.length}</span>
                </div>
                <div className="card-content">
                  {acceptedProposals.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#718096' }}>Nenhuma proposta aceita ainda.</p>
                  ) : (
                    acceptedProposals.slice(0, 2).map((proposal) => (
                      <div key={proposal.id} className="proposal-item accepted">
                        <div className="proposal-info">
                          <span className="proposal-title">Proposta de {proposal.price}</span>
                          <span className="proposal-meta">{formatDate(proposal.createdAt)}</span>
                        </div>
                        <span className="project-status completed">Aceita</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>❌ Propostas Rejeitadas</h3>
                  <span className="card-count">{rejectedProposals.length}</span>
                </div>
                <div className="card-content">
                  {rejectedProposals.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#718096' }}>Nenhuma proposta rejeitada.</p>
                  ) : (
                    rejectedProposals.slice(0, 2).map((proposal) => (
                      <div key={proposal.id} className="proposal-item rejected">
                        <div className="proposal-info">
                          <span className="proposal-title">Proposta de {proposal.price}</span>
                          <span className="proposal-meta">{formatDate(proposal.createdAt)}</span>
                        </div>
                        <span className="project-status cancelled">Rejeitada</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>🚫 Solicitações Rejeitadas</h3>
                  <span className="card-count">{rejectedRequests.length}</span>
                </div>
                <div className="card-content">
                  {rejectedRequests.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#718096' }}>Nenhuma solicitação rejeitada.</p>
                  ) : (
                    rejectedRequests.slice(0, 2).map((request) => (
                      <div key={request.id} className="request-item rejected">
                        <div className="request-info">
                          <span className="request-title">
                            {translateFurnitureType(request.furnitureType)} em {translateMaterial(request.material)}
                          </span>
                          <span className="request-meta">{formatDate(request.createdAt)}</span>
                        </div>
                        <span className="project-status cancelled">Rejeitada</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>📊 Estatísticas</h3>
                </div>
                <div className="card-content">
                  <div className="stats-grid">
                    <div className="stat">
                      <span className="stat-number">{pendingProposals.length}</span>
                      <span className="stat-label">Propostas Pendentes</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{acceptedProposals.length}</span>
                      <span className="stat-label">Propostas Aceitas</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{rejectedRequests.length}</span>
                      <span className="stat-label">Solicitações Rejeitadas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <div className="modal-overlay" onClick={closeRequestDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes da Solicitação</h2>
              <button className="modal-close" onClick={closeRequestDetails}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="request-details-section">
                <h3>📋 Informações do Móvel</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Tipo:</span>
                    <span className="detail-value">{translateFurnitureType(selectedRequest.furnitureType)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Material:</span>
                    <span className="detail-value">{translateMaterial(selectedRequest.material)}</span>
                  </div>
                  {selectedRequest.woodType && (
                    <div className="detail-item">
                      <span className="detail-label">Tipo de Madeira:</span>
                      <span className="detail-value">{selectedRequest.woodType}</span>
                    </div>
                  )}
                  {selectedRequest.thickness && (
                    <div className="detail-item">
                      <span className="detail-label">Espessura:</span>
                      <span className="detail-value">{selectedRequest.thickness}</span>
                    </div>
                  )}
                  {selectedRequest.dimensions && (
                    <div className="detail-item">
                      <span className="detail-label">Dimensões:</span>
                      <span className="detail-value">{selectedRequest.dimensions}</span>
                    </div>
                  )}
                  {selectedRequest.budget && (
                    <div className="detail-item">
                      <span className="detail-label">Orçamento:</span>
                      <span className="detail-value">{selectedRequest.budget}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">
                      <span className="project-status in-progress">
                        {selectedRequest.status === 'ACTIVE' ? 'Ativo' : selectedRequest.status}
                      </span>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Publicado:</span>
                    <span className="detail-value">{formatDate(selectedRequest.createdAt)}</span>
                  </div>
                </div>
                
                {selectedRequest.description && (
                  <div className="detail-item full-width">
                    <span className="detail-label">Descrição:</span>
                    <p className="detail-description">{selectedRequest.description}</p>
                  </div>
                )}
              </div>

              {selectedRequest.aiPreviewImage && (
                <div className="request-details-section">
                  <h3>🎨 Preview Gerado com IA</h3>
                  <div className="ai-preview-display">
                    <img src={selectedRequest.aiPreviewImage} alt="Preview IA" className="ai-preview-img" />
                  </div>
                </div>
              )}

              <div className="request-details-section">
                <h3>💬 {userType === 'customer' ? 'Propostas Recebidas' : 'Informações de Propostas'} ({requestProposals.length})</h3>
                {userType === 'woodworker' ? (
                  <p className="no-proposals">
                    {requestProposals.length === 0 
                      ? 'Seja o primeiro a enviar uma proposta!' 
                      : `${requestProposals.length} ${requestProposals.length === 1 ? 'marceneiro já enviou' : 'marceneiros já enviaram'} proposta${requestProposals.length > 1 ? 's' : ''} para esta solicitação.`
                    }
                  </p>
                ) : loadingProposals ? (
                  <p className="no-proposals">Carregando propostas...</p>
                ) : requestProposals.length === 0 ? (
                  <p className="no-proposals">Nenhuma proposta recebida ainda. Os marceneiros serão notificados!</p>
                ) : (
                  <div className="proposals-list">
                    {requestProposals.map((proposal, index) => (
                      <div key={index} className="proposal-card">
                        <div className="proposal-header">
                          <span className="woodworker-name">{proposal.woodworkerName}</span>
                          <span className="proposal-price">{proposal.price}</span>
                        </div>
                        <p className="proposal-message">{proposal.message}</p>
                        <div className="proposal-actions">
                          {proposal.status === 'PENDING' ? (
                            <>
                              <button 
                                className="btn-accept" 
                                onClick={() => handleAcceptProposal(proposal.id)}
                              >
                                Aceitar Proposta
                              </button>
                              <button 
                                className="btn-reject" 
                                onClick={() => handleRejectProposal(proposal.id)}
                              >
                                Rejeitar
                              </button>
                            </>
                          ) : (
                            <span className={`proposal-status ${proposal.status.toLowerCase()}`}>
                              {proposal.status === 'ACCEPTED' ? '✅ Aceita' : '❌ Rejeitada'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {showProposalModal && selectedRequest && (
        <div className="modal-overlay" onClick={closeProposalModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Enviar Proposta</h2>
              <button className="modal-close" onClick={closeProposalModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="proposal-request-info">
                <h3>{translateFurnitureType(selectedRequest.furnitureType)} em {translateMaterial(selectedRequest.material)}</h3>
                {selectedRequest.description && <p>{selectedRequest.description}</p>}
              </div>

              <form onSubmit={handleSubmitProposal} className="proposal-form">
                <div className="form-group">
                  <label>Preço da Proposta *</label>
                  <input
                    type="text"
                    placeholder="Ex: R$ 2.500,00"
                    value={proposalPrice}
                    onChange={(e) => setProposalPrice(handleCurrencyInput(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mensagem / Observações *</label>
                  <textarea
                    rows="6"
                    placeholder="Descreva sua proposta, prazo de entrega, materiais que utilizará, etc."
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Imagens do Projeto (opcional)</label>
                  <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                    💡 Funcionalidade de upload de imagens será implementada em breve
                  </p>
                </div>

                <div className="proposal-form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={closeProposalModal}
                    disabled={submittingProposal}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit-proposal"
                    disabled={submittingProposal}
                  >
                    {submittingProposal ? 'Enviando...' : 'Enviar Proposta'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard