import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api, { validarContato, sanitize } from '../../utils/security';
import { empresa } from '../../config/empresa';

const infos = [
  { Icon: FiPhone, label: 'Telefone',      valor: empresa.telefone, href: `https://wa.me/${empresa.whatsapp}` },
  { Icon: FiMail, label: 'E-mail',        valor: empresa.email, href: `mailto:${empresa.email}` },
  { Icon: FiMapPin, label: 'Localização',   valor: empresa.local },
  { Icon: FiClock, label: 'Atendimento',   valor: empresa.horario },
];

export default function Contato() {
  const [form, setForm]       = useState({ nome:'', email:'', telefone:'', empresa:'', mensagem:'' });
  const [erros, setErros]     = useState({});
  const [status, setStatus]   = useState(null); // 'ok' | 'erro'
  const [enviando, setEnviando] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (erros[name]) setErros(p => ({ ...p, [name]: null }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errosValidacao = validarContato(form);
    if (Object.keys(errosValidacao).length > 0) { setErros(errosValidacao); return; }

    setEnviando(true);
    setStatus(null);
    try {
      await api.post('/api/contatos', form);
      setStatus('ok');
      setForm({ nome:'', email:'', telefone:'', empresa:'', mensagem:'' });
    } catch (err) {
      // Exibe mensagem do servidor se houver, senão mensagem genérica
      const msg = err.response?.data?.erro || 'Erro ao enviar. Tente novamente.';
      setStatus({ tipo: 'erro', msg: sanitize(msg) });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="contato" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Info lateral */}
          <div>
            <span className="section-tag">Fale conosco</span>
            <h2 className="font-display text-3xl text-green-900 mb-4">Vamos conversar sobre sua necessidade</h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
              Atendemos distribuidores, redes de supermercados, cooperativas e exportadores.
            </p>
            <div className="space-y-4">
              {infos.map(i => (
                <div key={i.label} className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0">
                    <i.Icon size={19} />
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 mb-0.5">{i.label}</span>
                    {i.href
                      ? <a href={i.href} target={i.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block text-sm font-medium text-green-900 hover:text-green-600">{i.valor}</a>
                      : <span className="block text-sm font-medium text-green-900">{i.valor}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} noValidate className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-base font-medium text-green-900 mb-5">Envie uma mensagem</h3>

            {status === 'ok' && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3 mb-5">
                <FiCheckCircle className="flex-shrink-0" size={16} /> Mensagem enviada! Entraremos em contato em breve.
              </div>
            )}
            {status?.tipo === 'erro' && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
                <FiXCircle className="flex-shrink-0" size={16} /> {status.msg}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { name: 'nome',    label: 'Nome *',        placeholder: 'Seu nome completo', col: 'col-span-1' },
                { name: 'email',   label: 'E-mail *',      placeholder: 'seu@email.com',      col: 'col-span-1', type: 'email' },
                { name: 'telefone',label: 'Telefone',      placeholder: '(53) 9 9999-9999',   col: 'col-span-1', type: 'tel' },
                { name: 'empresa', label: 'Empresa',       placeholder: 'Ex: Cooperativa',    col: 'col-span-1' },
              ].map(f => (
                <div key={f.name} className={f.col}>
                  <label className="block text-xs font-medium text-green-800 mb-1.5">{f.label}</label>
                  <input
                    name={f.name} type={f.type || 'text'}
                    value={form[f.name]} onChange={handleChange}
                    placeholder={f.placeholder}
                    className={`input-field ${erros[f.name] ? 'border-red-400 focus:border-red-400' : ''}`}
                  />
                  {erros[f.name] && <p className="text-[11px] text-red-500 mt-1">{erros[f.name]}</p>}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-green-800 mb-1.5">Mensagem *</label>
              <textarea
                name="mensagem" rows={4} value={form.mensagem} onChange={handleChange}
                placeholder="Descreva o produto, volume e sua necessidade..."
                className={`input-field resize-none ${erros.mensagem ? 'border-red-400' : ''}`}
              />
              <div className="flex justify-between items-center mt-1">
                {erros.mensagem
                  ? <p className="text-[11px] text-red-500">{erros.mensagem}</p>
                  : <span />
                }
                <span className="text-[11px] text-gray-400">{form.mensagem.length}/2000</span>
              </div>
            </div>

            <button type="submit" disabled={enviando}
              className="btn-primary w-full mt-5 !py-3 disabled:opacity-60 disabled:cursor-not-allowed">
              {enviando ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
