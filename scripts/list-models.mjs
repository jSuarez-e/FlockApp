// list-models.mjs
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("No se encontró la API Key");
  process.exit(1);
}

console.log("🔍 Consultando los modelos disponibles de Google...");

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error("❌ Error de la API:", data.error.message);
      return;
    }
    
    console.log("✅ Modelos disponibles para generar contenido:");
    const validModels = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace('models/', '')); // Limpiamos el prefijo
      
    console.log(validModels);
  })
  .catch(err => console.error(err));