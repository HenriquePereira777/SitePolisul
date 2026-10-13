import React, { useRef, useState } from 'react';
import api from '../utils/security';
import { btnSecundario, mensagemErro } from './ui';

// Escolhe uma foto, envia para o servidor e devolve a URL (/uploads/...) via onChange.
export default function ImagemInput({ valor, onChange, proporcao = 'aspect-[4/3]', fundo = 'bg-white' }) {
  const ref = useRef(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const escolher = async e => {
    const arq = e.target.files?.[0];
    e.target.value = '';
    if (!arq) return;
    if (!/^image\/(jpeg|png|webp)$/.test(arq.type)) { setErro('Use uma imagem JPG, PNG ou WEBP.'); return; }
    if (arq.size > 8 * 1024 * 1024) { setErro('Imagem muito grande (máximo 8 MB).'); return; }
    setErro(''); setEnviando(true);
    try {
      const fd = new FormData();
      fd.append('arquivo', arq);
      const r = await api.post('/api/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 });
      onChange(r.data.url);
    } catch (err) {
      setErro(mensagemErro(err, 'Falha ao enviar a imagem.'));
    } finally { setEnviando(false); }
  };

  return (
    <div>
      <div className={`relative w-full max-w-xs overflow-hidden border border-gray-200 rounded-xl ${proporcao} ${fundo} flex items-center justify-center`}>
        {valor
          ? <img src={valor} alt="Pré-visualização" className="absolute inset-0 object-contain w-full h-full" />
          : <span className="text-sm text-gray-400">Sem foto</span>}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <button type="button" className={btnSecundario} disabled={enviando} onClick={() => ref.current?.click()}>
          {enviando ? 'Enviando…' : valor ? 'Trocar foto' : 'Escolher foto'}
        </button>
        {valor && !enviando && <button type="button" className="text-sm text-gray-500 underline" onClick={() => onChange('')}>Remover</button>}
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={escolher} />
      </div>
      {erro && <p className="mt-1 text-sm text-red-600">{erro}</p>}
    </div>
  );
}
