import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'noctis_state';

const defaultState = {
  user: null, 
  library: {}, 
  lists: [], 
  customAchievements: {}, 
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useAppState() {
  const { isAuthenticated, updateUser } = useAuth(); 
  const [state, setState] = useState(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // =========================================
  // SINCRONIZAÇÃO DO USUÁRIO
  // =========================================
  const syncUser = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch("http://localhost:8000/users/me", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const userData = await response.json();
          const mappedUser = { 
            id: userData.id || Date.now().toString(), 
            name: userData.username, 
            email: userData.email, 
            avatar: userData.avatar || userData.username.charAt(0).toUpperCase() 
          };
          setState(s => ({ ...s, user: mappedUser }));
          updateUser(mappedUser);
        }
      } catch (error) {
        console.error("Erro ao sincronizar dados do usuário:", error);
      }
    }
  };

  // =========================================
  // SINCRONIZAÇÃO DA BIBLIOTECA
  // =========================================
  const syncLibrary = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch("http://localhost:8000/biblioteca", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const dadosDoBanco = await response.json();
          const bibliotecaSincronizada = {};
          const customAchsSincronizados = {}; 

          dadosDoBanco.forEach(item => {
            const jogoCompleto = item.dados_jogo 
              ? JSON.parse(item.dados_jogo) 
              : { id: item.game_id, title: item.titulo, name: item.titulo, cover: item.capa, background_image: item.capa };

            bibliotecaSincronizada[item.game_id] = {
              status: item.status_principal,
              favorite: item.favorito,
              hoursPlayed: item.horas_jogadas,
              rating: item.nota_geral,
              comment: item.comentario,
              criteria: item.criterios ? JSON.parse(item.criterios) : {},
              achievements: item.conquistas ? JSON.parse(item.conquistas) : {},
              game: jogoCompleto
            };

            if (item.conquistas_personalizadas) {
              customAchsSincronizados[item.game_id] = JSON.parse(item.conquistas_personalizadas);
            }
          });

          setState(s => ({ 
            ...s, 
            library: bibliotecaSincronizada,
            customAchievements: customAchsSincronizados
          }));
        } else if (response.status === 401) {
          logout();
        }
      } catch (error) {
        console.error("Erro de conexão ao sincronizar biblioteca:", error);
      }
    } else {
      if (Object.keys(state.library).length > 0) {
        setState(s => ({ ...s, library: {} }));
      }
    }
  };

  // =========================================
  // SINCRONIZAÇÃO DAS LISTAS 
  // =========================================
  const syncLists = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("http://localhost:8000/listas", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const listasDB = await response.json();
          const listasSincronizadas = listasDB.map(l => ({
            id: l.list_id,
            name: l.nome,
            description: l.descricao,
            gameIds: JSON.parse(l.jogos),
            createdAt: l.criado_em
          }));
          setState(s => ({ ...s, lists: listasSincronizadas }));
        }
      } catch (error) {
        console.error("Erro ao sincronizar listas:", error);
      }
    } else {
      setState(s => ({ ...s, lists: [] }));
    }
  };

  useEffect(() => {
    syncUser();
    syncLibrary();
    syncLists();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      syncUser();
      syncLibrary();
      syncLists();
    } else {
      setState(s => ({ ...s, library: {}, customAchievements: {}, lists: [] }));
    }
  }, [isAuthenticated]);

  // =========================================
  // AUTH
  // =========================================
  const login = (name, email) => {
    setState(s => ({
      ...s,
      user: { id: Date.now().toString(), name, email, avatar: name.charAt(0).toUpperCase() },
      library: {}, 
      customAchievements: {},
      lists: []
    }));
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    setState(s => ({ ...s, user: null, library: {}, customAchievements: {}, lists: [] })); 
  };

  // =========================================
  // ATUALIZAÇÃO DE PERFIL
  // =========================================
  const updateProfile = async (profileData) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch("http://localhost:8000/users/me", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const mappedUser = { 
          ...state.user,
          name: updatedUser.username, 
          email: updatedUser.email, 
          avatar: updatedUser.avatar 
        };

        setState(s => ({ ...s, user: mappedUser }));
        updateUser(mappedUser);

        return true;
      } else {
        const err = await response.json();
        alert(err.detail || "Erro ao atualizar perfil da base NOCTIS.");
        return false;
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      return false;
    }
  };

// =========================================
  // LIBRARY (FRONTEND + BACKEND)
  // =========================================
  
  const setGameStatus = async (game, status) => {
    const token = localStorage.getItem("token");
    
    const gameId = game.id; 
    
    setState(s => ({
      ...s,
      library: {
        ...s.library,
        [gameId]: { 
          ...(s.library[gameId] || {}), 
          status, 
          addedAt: s.library[gameId]?.addedAt || Date.now(),
          game: game 
        }
      }
    }));

   if (token) {
      await fetch("http://localhost:8000/biblioteca", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          game_id: gameId,
          status_principal: status,
          favorito: state.library[gameId]?.favorite || false,
          horas_jogadas: state.library[gameId]?.hoursPlayed || 0,
          titulo: game.title || game.name, 
          capa: game.cover || game.background_image,
          dados_jogo: JSON.stringify(game) 
        })
      });
    }
  };
  
  const setGameFavorite = async (gameId, value) => {
    const token = localStorage.getItem("token");

    setState(s => ({
      ...s,
      library: {
        ...s.library,
        [gameId]: { ...(s.library[gameId] || {}), favorite: value, addedAt: s.library[gameId]?.addedAt || Date.now() }
      }
    }));

    if (token) {
      await fetch("http://localhost:8000/biblioteca", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: gameId,
          status_principal: state.library[gameId]?.status || "Quero Jogar",
          favorito: value,
          horas_jogadas: state.library[gameId]?.hoursPlayed || 0
        })
      });
    }
  };
  
  const removeGameStatus = async (gameId) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await fetch(`http://localhost:8000/biblioteca/${gameId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Erro ao remover jogo:", error);
      }
    }

    setState(s => {
      const lib = { ...s.library };
      delete lib[gameId]; 
      return { ...s, library: lib };
    });
  };
  
  const setGameRating = async (gameId, ratingData) => {
    const token = localStorage.getItem("token");

    setState(s => ({
      ...s,
      library: {
        ...s.library,
        [gameId]: { ...(s.library[gameId] || {}), ...ratingData }
      }
    }));

    if (token) {
      try {
        await fetch("http://localhost:8000/biblioteca", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            game_id: gameId,
            status_principal: state.library[gameId]?.status || "Quero Jogar",
            favorito: state.library[gameId]?.favorite || false,
            horas_jogadas: state.library[gameId]?.hoursPlayed || 0,
            nota_geral: ratingData.rating,
            comentario: ratingData.comment,
            criterios: JSON.stringify(ratingData.criteria)
          })
        });
      } catch (e) { console.error("Erro ao salvar avaliação:", e); }
    }
  };
  
  const setGameHours = async (gameId, hours) => {
    const parsedHours = parseFloat(hours) || 0;
    const token = localStorage.getItem("token");

    setState(s => ({
      ...s,
      library: {
        ...s.library,
        [gameId]: { ...(s.library[gameId] || {}), hoursPlayed: parsedHours }
      }
    }));

    if (token) {
      try {
        await fetch("http://localhost:8000/biblioteca", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            game_id: gameId,
            status_principal: state.library[gameId]?.status || "Quero Jogar",
            favorito: state.library[gameId]?.favorite || false,
            horas_jogadas: parsedHours,
            nota_geral: state.library[gameId]?.rating || null,
            comentario: state.library[gameId]?.comment || null,
            criterios: state.library[gameId]?.criteria ? JSON.stringify(state.library[gameId].criteria) : null
          })
        });
      } catch (e) { console.error("Erro ao salvar horas:", e); }
    }
  };

  // =========================================
  // ACHIEVEMENTS
  // =========================================
  const syncAchievementsToDB = async (gameId, updatedAchs, updatedCustoms) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const currentGame = state.library[gameId] || {};

    try {
      await fetch("http://localhost:8000/biblioteca", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          game_id: gameId,
          status_principal: currentGame.status || "Quero Jogar",
          favorito: currentGame.favorite || false,
          horas_jogadas: currentGame.hoursPlayed || 0,
          nota_geral: currentGame.rating || null,
          comentario: currentGame.comment || null,
          criterios: currentGame.criteria ? JSON.stringify(currentGame.criteria) : null,
          conquistas: JSON.stringify(updatedAchs),
          conquistas_personalizadas: updatedCustoms ? JSON.stringify(updatedCustoms) : null
        })
      });
    } catch (e) { console.error("Erro ao salvar conquistas no banco:", e); }
  };

  const toggleAchievement = (gameId, achievementId) => {
    const gameAchs = state.library[gameId]?.achievements || {};
    const newAchs = { ...gameAchs, [achievementId]: !gameAchs[achievementId] };
    const currentCustoms = state.customAchievements[gameId] || [];

    setState(s => ({
      ...s,
      library: {
        ...s.library,
        [gameId]: { ...(s.library[gameId] || {}), achievements: newAchs }
      }
    }));
    syncAchievementsToDB(gameId, newAchs, currentCustoms);
  };
  
  const addCustomAchievement = (gameId, ach) => {
    const newCustoms = [...(state.customAchievements[gameId] || []), ach];
    const gameAchs = state.library[gameId]?.achievements || {};

    setState(s => ({
      ...s,
      customAchievements: { ...s.customAchievements, [gameId]: newCustoms }
    }));
    syncAchievementsToDB(gameId, gameAchs, newCustoms);
  };
  
  const removeCustomAchievement = (gameId, achId) => {
    const newCustoms = (state.customAchievements[gameId] || []).filter(a => a.id !== achId);
    const gameAchs = state.library[gameId]?.achievements || {};
    
    const newAchs = { ...gameAchs };
    delete newAchs[achId];

    setState(s => ({
      ...s,
      library: {
        ...s.library,
        [gameId]: { ...(s.library[gameId] || {}), achievements: newAchs }
      },
      customAchievements: { ...s.customAchievements, [gameId]: newCustoms }
    }));
    syncAchievementsToDB(gameId, newAchs, newCustoms);
  };

  // =========================================
  // LISTS (INTEGRADO AO BANCO)
  // =========================================
  
  const saveListToDB = async (list) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch("http://localhost:8000/listas", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          list_id: list.id,
          nome: list.name,
          descricao: list.description || "",
          jogos: JSON.stringify(list.gameIds),
          criado_em: list.createdAt
        })
      });
    } catch (e) { console.error("Erro ao salvar lista no banco:", e); }
  };

  const createList = (name, description) => {
    const newList = { id: Date.now().toString(), name, description, gameIds: [], createdAt: Date.now() };
    setState(s => ({ ...s, lists: [...s.lists, newList] }));
    saveListToDB(newList);
  };
  
  const updateList = (listId, updates) => {
    setState(s => {
      const newLists = s.lists.map(l => l.id === listId ? { ...l, ...updates } : l);
      const updatedList = newLists.find(l => l.id === listId);
      if (updatedList) saveListToDB(updatedList);
      return { ...s, lists: newLists };
    });
  };
  
  const deleteList = async (listId) => {
    setState(s => ({ ...s, lists: s.lists.filter(l => l.id !== listId) }));
    
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`http://localhost:8000/listas/${listId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
      } catch (e) { console.error("Erro ao deletar lista do banco:", e); }
    }
  };
  
  const addGameToList = (listId, gameId) => {
    setState(s => {
      const newLists = s.lists.map(l => l.id === listId && !l.gameIds.includes(gameId)
        ? { ...l, gameIds: [...l.gameIds, gameId] } : l);
      
      const updatedList = newLists.find(l => l.id === listId);
      if (updatedList) saveListToDB(updatedList);
      return { ...s, lists: newLists };
    });
  };
  
  const removeGameFromList = (listId, gameId) => {
    setState(s => {
      const newLists = s.lists.map(l => l.id === listId
        ? { ...l, gameIds: l.gameIds.filter(id => id !== gameId) } : l);
      
      const updatedList = newLists.find(l => l.id === listId);
      if (updatedList) saveListToDB(updatedList);
      return { ...s, lists: newLists };
    });
  };
  
  const reorderListGames = (listId, gameIds) => {
    setState(s => {
      const newLists = s.lists.map(l => l.id === listId ? { ...l, gameIds } : l);
      const updatedList = newLists.find(l => l.id === listId);
      if (updatedList) saveListToDB(updatedList);
      return { ...s, lists: newLists };
    });
  };

  return {
    state,
    syncLibrary, syncLists,
    login, logout, updateProfile,
    setGameStatus, setGameFavorite, removeGameStatus, setGameRating, setGameHours,
    toggleAchievement, addCustomAchievement, removeCustomAchievement,
    createList, updateList, deleteList, addGameToList, removeGameFromList, reorderListGames,
  };
}