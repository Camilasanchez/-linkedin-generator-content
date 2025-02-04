import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    profession: "",
    company: "",
    interests: "",
  });
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Profesional");
  const [generatedPost, setGeneratedPost] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userProfile", JSON.stringify(formData));
    setProfile(formData);
  };

  const handleGeneratePost = async () => {
    if (!topic) {
      alert("Por favor ingresa un tema para el post.");
      return;
    }

    setLoading(true);
    try {
       
      
      const response = await axios.post("/api/generate", {
        topic,
        profile,
        tone,
      });
    
      setGeneratedPost(response.data.post);
    } catch (error) {
      console.error("Error generando el post:", error);
      alert(`Error al generar el post: ${
        error.response?.data?.error || error.message || "Error desconocido"
      }`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPost = () => {
    navigator.clipboard.writeText(generatedPost);
    alert("¡Post copiado al portapapeles!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <header className="w-full max-w-2xl text-center py-4">
        <h1 className="text-3xl font-bold text-blue-700">
          Generador de Posts para LinkedIn
        </h1>
        <p className="text-gray-600">Crea publicaciones atractivas en segundos</p>
      </header>

      {!profile ? (
        <main className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Crea tu perfil</h2>
          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            {[
              { name: "name", placeholder: "Nombre" },
              { name: "gender", placeholder: "Género" },
              { name: "profession", placeholder: "Profesión" },
              { name: "company", placeholder: "Empresa" },
              { name: "interests", placeholder: "Temas de interés (opcional)" },
            ].map((input) => (
              <input
                key={input.name}
                type="text"
                name={input.name}
                placeholder={input.placeholder}
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={handleProfileChange}
                required={input.name !== "interests"}
              />
            ))}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Guardar Perfil
            </button>
          </form>
        </main>
      ) : (
        <main className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">
            ¿Sobre qué tema te gustaría escribir hoy?
          </h2>
          <input
            type="text"
            placeholder="Tema"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="flex justify-between items-center mb-4">
            <label className="text-gray-700">Tono de voz:</label>
            <select
              className="border border-gray-300 p-2 rounded-lg"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option>Profesional</option>
              <option>Casual</option>
              <option>Inspirador</option>
            </select>
          </div>

          <button
            onClick={handleGeneratePost}
            disabled={loading}
            className={`w-full py-2 rounded-lg transition ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {loading ? "Generando..." : "Generar Post"}
          </button>

          {generatedPost && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold">Post Generado</h2>
              <textarea
                readOnly
                className="w-full h-40 p-2 border border-gray-300 rounded-lg mt-2"
                value={generatedPost}
              ></textarea>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleCopyPost}
                  className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                  Copiar Post
                </button>
                <button
                  onClick={() => setGeneratedPost("")}
                  className="flex-1 bg-slate-500 text-white py-2 rounded-lg hover:bg-slate-600 transition"
                >
                  Generar Otro
                </button>
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  );
}
