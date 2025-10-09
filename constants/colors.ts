// constants/Colors.js

const tintColorLight = '#2f95dc'; // Azul vibrante para elementos activos en modo claro
const tintColorDark = '#fff';      // Blanco para elementos activos en modo oscuro

export default {
  // Colores principales de la marca
  primary: '#1897d6ff',   // Morado oscuro (usado en Splash Screen, botones principales)
  secondary: '#03DAC6', // Turquesa (para acentos, notificaciones)
  
  // Colores de la interfaz de usuario
  background: '#FFFFFF', // Fondo de la pantalla
  text: '#1C1C1E',       // Color de texto principal (casi negro)
  lightText: '#6C757D',  // Color de texto secundario (gris claro)
  
  // Colores de estado
  success: '#28A745', // Verde
  warning: '#FFC107', // Amarillo (usado para ratings/estrellas)
  error: '#DC3545',   // Rojo (usado para 'likes' o mensajes de error)
  rating: '#FFC107',  // Alias que solo existe DENTRO de este bloque.

  
  // Colores para modos claro/oscuro (si planeas implementarlo)
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  
};