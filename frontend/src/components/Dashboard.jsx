import { useState } from 'react'
import axios from 'axios'
import './Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  const [userType, setUserType] = useState('customer') // 'customer' or 'woodworker'
  const [showRequestForm, setShowRequestForm] = useState(false)
  
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
          budget
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
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('❌ Erro ao publicar solicitação. Tente novamente.')
    }
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
                          onChange={(e) => setBudget(e.target.value)}
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
                    <span className="card-count">3</span>
                  </div>
                  <div className="card-content">
                    <div className="request-item">
                      <div className="request-info">
                        <span className="request-title">Mesa de Jantar em Carvalho</span>
                        <span className="request-meta">5 propostas • Há 2 dias</span>
                      </div>
                      <span className="project-status in-progress">Ativo</span>
                    </div>
                    <div className="request-item">
                      <div className="request-info">
                        <span className="request-title">Estante de MDF Branco</span>
                        <span className="request-meta">12 propostas • Há 1 semana</span>
                      </div>
                      <span className="project-status completed">Concluído</span>
                    </div>
                    <div className="request-item">
                      <div className="request-info">
                        <span className="request-title">Rack para TV</span>
                        <span className="request-meta">0 propostas • Há 3 horas</span>
                      </div>
                      <span className="project-status planning">Novo</span>
                    </div>
                  </div>
                  <button className="card-action">Ver Todas</button>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>💬 Propostas Recebidas</h3>
                    <span className="card-count">17</span>
                  </div>
                  <div className="card-content">
                    <div className="proposal-item">
                      <div className="proposal-header">
                        <span className="woodworker-name">João Silva</span>
                        <span className="proposal-price">R$ 2.500</span>
                      </div>
                      <p className="proposal-text">Mesa de Jantar em Carvalho</p>
                      <div className="proposal-meta">
                        <span>⭐ 4.8 (23 avaliações)</span>
                        <span>📍 São Paulo, SP</span>
                      </div>
                    </div>
                    <div className="proposal-item">
                      <div className="proposal-header">
                        <span className="woodworker-name">Maria Santos</span>
                        <span className="proposal-price">R$ 2.200</span>
                      </div>
                      <p className="proposal-text">Mesa de Jantar em Carvalho</p>
                      <div className="proposal-meta">
                        <span>⭐ 5.0 (45 avaliações)</span>
                        <span>📍 Rio de Janeiro, RJ</span>
                      </div>
                    </div>
                  </div>
                  <button className="card-action">Ver Todas as Propostas</button>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3>📊 Estatísticas</h3>
                  </div>
                  <div className="card-content">
                    <div className="stats-grid">
                      <div className="stat">
                        <span className="stat-number">3</span>
                        <span className="stat-label">Solicitações Ativas</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">17</span>
                        <span className="stat-label">Propostas Recebidas</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">2</span>
                        <span className="stat-label">Projetos Concluídos</span>
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
                  <span className="card-count">24</span>
                </div>
                <div className="card-content">
                  <div className="customer-request">
                    <div className="request-header">
                      <span className="request-title">Mesa de Jantar em Carvalho</span>
                      <span className="request-time">Há 3 horas</span>
                    </div>
                    <p className="request-description">
                      Preciso de uma mesa de jantar para 6 pessoas em madeira de carvalho natural. 
                      Dimensões aproximadas: 1.8m x 1m.
                    </p>
                    <div className="request-specs">
                      <span className="spec-tag">🪵 Madeira Natural</span>
                      <span className="spec-tag">📏 1.8m x 1m</span>
                      <span className="spec-tag">💰 R$ 2.000 - 3.000</span>
                    </div>
                    <button className="proposal-btn">Enviar Proposta</button>
                  </div>
                  <div className="customer-request">
                    <div className="request-header">
                      <span className="request-title">Estante de MDF Branco</span>
                      <span className="request-time">Há 5 horas</span>
                    </div>
                    <p className="request-description">
                      Estante para livros em MDF branco, 5 prateleiras, 2m de altura.
                    </p>
                    <div className="request-specs">
                      <span className="spec-tag">🎨 MDF Branco</span>
                      <span className="spec-tag">📏 2m altura</span>
                      <span className="spec-tag">💰 Orçamento aberto</span>
                    </div>
                    <button className="proposal-btn">Enviar Proposta</button>
                  </div>
                </div>
                <button className="card-action">Ver Todas as Solicitações</button>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>📤 Minhas Propostas</h3>
                  <span className="card-count">8</span>
                </div>
                <div className="card-content">
                  <div className="my-proposal">
                    <div className="proposal-info">
                      <span className="proposal-title">Mesa de Centro em Pinus</span>
                      <span className="proposal-value">R$ 1.200</span>
                    </div>
                    <span className="project-status planning">Aguardando</span>
                  </div>
                  <div className="my-proposal">
                    <div className="proposal-info">
                      <span className="proposal-title">Rack para TV em MDF</span>
                      <span className="proposal-value">R$ 800</span>
                    </div>
                    <span className="project-status completed">Aceita</span>
                  </div>
                  <div className="my-proposal">
                    <div className="proposal-info">
                      <span className="proposal-title">Cama de Casal em Cedro</span>
                      <span className="proposal-value">R$ 3.500</span>
                    </div>
                    <span className="project-status in-progress">Em Negociação</span>
                  </div>
                </div>
                <button className="card-action">Ver Todas</button>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3>📊 Meu Desempenho</h3>
                </div>
                <div className="card-content">
                  <div className="stats-grid">
                    <div className="stat">
                      <span className="stat-number">8</span>
                      <span className="stat-label">Propostas Enviadas</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">3</span>
                      <span className="stat-label">Projetos Ativos</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">12</span>
                      <span className="stat-label">Projetos Concluídos</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">4.9</span>
                      <span className="stat-label">Avaliação Média</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard