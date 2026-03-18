# Què es MCP?

El Model Context Protocol(MCP) es un protocolo que permite conectar modelos de inteligencia artificial con fuentes de datos externas, como archivos locales, API's o repositorios.

## Instalación paso a paso

 1. En Cursor abrir la terminal dentro del proyecto

 2. Ejecutar:
npx -y @modelcontextprotocol/server-filesystem "**ubicación de tu proyecto**"

3.Ir a: 
    Preferences: Open  User Settings(JSON)  O bien precionar la combinación de teclas "Ctrl + Shft + P"

4. Añadir configuración:

{
  "cursor.mcp.servers": [
    {
      "name": "filesystem",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\iambr\\Documents\\taskflow-project"
      ]
    }
  ]
}

6. Guardar y reiniciar cursor


## Pruebas realizadas

Se realizaron consultas como:

Lectura del archivo app.js

Búsqueda de uso de localStorage

Análisis de funciones del proyecto

Detección de errores

La IA respondió utilizando información real del proyecto, confirmando que MCP funciona correctamente.


## Casos de usos 
 
MCP es útil para:
Analizar código automáticamente
Detectar errores en proyectos más grandes
Generar documentación automática
Asistir en debugging  con contexto real
Integrar IA con sistemas internos de empresas




