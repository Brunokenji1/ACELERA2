import "../styles/ajudaModal.css";
import "../styles/fotoPerfilModal.css";
import { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import { X, Upload } from "lucide-react";
import { getCroppedImg } from "../utils/cropImage";
import { atualizarFotoPerfil } from "../services/usuarioService";

export default function FotoPerfilModal({ aberto, fechar, onFotoSalva }) {
  const [imagemSrc, setImagemSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewBlob, setPreviewBlob] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const inputRef = useRef(null);

  if (!aberto) return null;

  function resetar() {
    setImagemSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropPixels(null);
    setPreviewUrl(null);
    setPreviewBlob(null);
  }

  function fecharModal() {
    resetar();
    fechar();
  }

  function aoEscolherArquivo(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    const tiposValidos = ["image/jpeg", "image/png", "image/webp"];
    if (!tiposValidos.includes(arquivo.type)) {
      alert("Formato inválido. Use JPG, PNG ou WebP.");
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    const leitor = new FileReader();
    leitor.onload = () => setImagemSrc(leitor.result);
    leitor.readAsDataURL(arquivo);
  }

  async function gerarPreview() {
    try {
      const blob = await getCroppedImg(imagemSrc, cropPixels);
      setPreviewBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert("Erro ao recortar a imagem.");
    }
  }

  async function salvar() {
    try {
      setSalvando(true);
      const resposta = await atualizarFotoPerfil(previewBlob);
      onFotoSalva(resposta.usuario);
      fecharModal();
    } catch (e) {
      alert(e.message || "Erro ao salvar a foto.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={fecharModal}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="fechar-modal" onClick={fecharModal}>
          <X size={18} />
        </button>

        <h2>Foto de Perfil</h2>

        {!imagemSrc && (
          <div className="foto-escolher">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={aoEscolherArquivo}
              hidden
            />
            <button
              className="btn-escolher-foto"
              onClick={() => inputRef.current.click()}
            >
              <Upload size={18} /> Escolher imagem
            </button>
            <p className="foto-dica">JPG, PNG ou WebP. Máximo 5MB.</p>
          </div>
        )}

        {imagemSrc && !previewUrl && (
          <div className="foto-cortar">
            <div className="cropper-area">
              <Cropper
                image={imagemSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) => setCropPixels(areaPixels)}
              />
            </div>

            <label className="zoom-label">
              Zoom
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </label>

            <div className="foto-acoes">
              <button className="btn-cancelar-perfil" onClick={resetar}>
                Trocar imagem
              </button>
              <button className="btn-salvar-perfil" onClick={gerarPreview}>
                Visualizar
              </button>
            </div>
          </div>
        )}

        {previewUrl && (
          <div className="foto-preview">
            <p>Ficou assim:</p>
            <img src={previewUrl} alt="Pré-visualização" className="preview-img" />

            <div className="foto-acoes">
              <button
                className="btn-cancelar-perfil"
                onClick={() => setPreviewUrl(null)}
                disabled={salvando}
              >
                Voltar
              </button>
              <button
                className="btn-salvar-perfil"
                onClick={salvar}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar foto"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}