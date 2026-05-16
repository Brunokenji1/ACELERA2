import "../styles/ajudaModal.css";

export default function AjudaModal({

  aberto,

  fechar,

  titulo,

  descricao

}) {

  if (!aberto) return null;

  return (

    <div
      className="modal-overlay"
      onClick={fechar}
    >

      <div
        className="modal-box"

        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* FECHAR */}
        <button
          className="fechar-modal"
          onClick={fechar}
        >
          ✕
        </button>

        {/* CONTEÚDO */}
        <h2>{titulo}</h2>

        <p>{descricao}</p>

      </div>

    </div>
  );
}